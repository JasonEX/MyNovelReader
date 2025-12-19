/**
 * Reader Store - Manages reading state with infinite scroll support
 */

import { computed, ref } from 'vue';
import { type ConversionMode, convertHTML } from '@/core/converter';
import { joinHtml, normalizeAbsoluteUrl } from '@/core/utils';
import { defineStore } from 'pinia';
import { getParser } from '@/core/parser';
import type { ParsedChapter } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';

type SectionInfo = {
  isSection: boolean;
  nextSectionUrl: string | null;
  nextChapterUrl: string | null;
  confidence: number;
};

export interface ReadingProgress {
  /** Chapter URL */
  url: string;
  /** Scroll position (0-100%) */
  scrollPercent: number;
  /** Current chapter (visible) URL */
  chapterUrl: string;
  /** Progress within current chapter (0-100%) */
  chapterPercent: number;
  /** Last read timestamp */
  lastRead: number;
}

export interface CacheProgressState {
  done: number;
  total: number;
  running: boolean;
}

/** Chapter entry for infinite scroll */
export interface ChapterEntry {
  chapter: ParsedChapter;
  rule?: SiteRule;
  id: string; // unique ID for Vue key
}

/** Table of contents entry */
export interface TocEntry {
  title: string;
  url: string;
}

/** TOC entry with cache status for UI */
export interface TocEntryWithStatus extends TocEntry {
  isCached: boolean;
  isPersisted: boolean;
  isCurrent: boolean;
}

/** Cached chapter content (separate from display chapters) */
export interface CachedChapter {
  chapter: ParsedChapter;
  rule?: SiteRule;
  cachedAt: number;
}

/** Persisted cache structure for GM storage */
interface PersistedBookCache {
  bookId: string;
  indexUrl: string;
  chapters: Record<string, CachedChapter>;
  lastUpdated: number;
}

const MAX_CACHED_CHAPTERS = 8;
// MAX_CACHE_TASKS removed - now unlimited

export const useReaderStore = defineStore('reader', () => {
  // State
  const isActive = ref(false);
  const isLoading = ref(false);
  const isLoadingPrev = ref(false);
  const isLoadingNext = ref(false);
  const chapters = ref<ChapterEntry[]>([]);
  const currentChapterIndex = ref(0);
  const error = ref<string | null>(null);
  const toastType = ref<'info' | 'error'>('error');
  const toastTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const scrollPercent = ref(0);
  const history = ref<string[]>([]);
  const loadedUrls = ref<Set<string>>(new Set());
  const originalContents = ref<Map<string, string>>(new Map()); // id -> original HTML
  const currentConversionMode = ref<ConversionMode>('none');
  const pendingNextAbort = ref<(() => void) | null>(null);
  const pendingPrevAbort = ref<(() => void) | null>(null);
  const cacheProgress = ref<CacheProgressState>({ done: 0, total: 0, running: false });
  const cacheQueue = ref<string[]>([]);
  const cacheAbort = ref<(() => void) | null>(null);

  // Table of contents state
  const toc = ref<TocEntry[]>([]);
  const tocLoading = ref(false);
  const tocAbort = ref<(() => void) | null>(null);

  // Cached chapters storage (separate from display chapters for memory efficiency)
  const cachedContents = ref<Map<string, CachedChapter>>(new Map());
  // Track which URLs are persisted to GM_Storage (vs just in-memory session cache)
  const persistedUrls = ref<Set<string>>(new Set());

  // Getters - for compatibility
  const chapter = computed(() => chapters.value[currentChapterIndex.value]?.chapter || null);
  const rule = computed(() => chapters.value[currentChapterIndex.value]?.rule || null);
  const title = computed(() => chapter.value?.title || '');
  const bookTitle = computed(() => chapter.value?.bookTitle || '');
  const content = computed(() => chapter.value?.content || '');
  const hasNext = computed(() => {
    const lastChapter = chapters.value[chapters.value.length - 1];
    return !!lastChapter?.chapter.nextUrl;
  });
  const hasPrev = computed(() => {
    const firstChapter = chapters.value[0];
    return !!firstChapter?.chapter.prevUrl;
  });
  const hasIndex = computed(() => !!chapter.value?.indexUrl);
  const confidence = computed(() => chapter.value?.confidence || 0);
  const method = computed(() => chapter.value?.method || 'detection');

  // TOC with cache status for UI
  const tocWithStatus = computed<TocEntryWithStatus[]>(() => {
    const currentUrl = chapter.value?.url;
    return toc.value.map(entry => ({
      ...entry,
      isCached: loadedUrls.value.has(entry.url) || cachedContents.value.has(entry.url),
      isPersisted: persistedUrls.value.has(entry.url),
      isCurrent: entry.url === currentUrl,
    }));
  });

  // Current chapter URL for external reference
  const currentChapterUrl = computed(() => chapter.value?.url || '');

  // Actions
  function activate() {
    isActive.value = true;
    error.value = null;
  }

  function deactivate() {
    isActive.value = false;
    chapters.value = [];
    currentChapterIndex.value = 0;
    error.value = null;
    loadedUrls.value.clear();
  }

  function setChapter(newChapter: ParsedChapter, newRule?: SiteRule) {
    const id = `chapter-${Date.now()}-0`;
    // Clear existing chapters and set the initial one
    chapters.value = [
      {
        chapter: newChapter,
        rule: newRule,
        id,
      },
    ];
    currentChapterIndex.value = 0;
    isLoading.value = false;
    error.value = null;
    loadedUrls.value.clear();
    loadedUrls.value.add(newChapter.url);

    // Store original content for text conversion
    originalContents.value.clear();
    originalContents.value.set(id, newChapter.content);

    // Also store in cachedContents for quick jump
    cachedContents.value.set(newChapter.url, {
      chapter: newChapter,
      rule: newRule,
      cachedAt: Date.now(),
    });

    // Add to history
    if (newChapter.url && !history.value.includes(newChapter.url)) {
      history.value.push(newChapter.url);
      if (history.value.length > 100) {
        history.value = history.value.slice(-100);
      }
    }

    // Restore persisted cache for this book (async, don't block)
    restoreCache();
  }

  /** Helper: Insert a chapter from cache to chapters list */
  async function insertCachedChapter(
    cached: CachedChapter,
    position: 'append' | 'prepend'
  ): Promise<boolean> {
    const suffix = position === 'append' ? 'cached' : 'cached-prev';
    const id = `chapter-${Date.now()}-${suffix}-${chapters.value.length}`;
    let content = cached.chapter.content;

    // Apply current conversion mode if active
    if (currentConversionMode.value !== 'none') {
      content = await convertHTML(content, currentConversionMode.value);
    }

    const entry = {
      chapter: { ...cached.chapter, content },
      rule: cached.rule,
      id,
    };

    if (position === 'append') {
      chapters.value.push(entry);
    } else {
      chapters.value.unshift(entry);
      currentChapterIndex.value++;
    }

    // Store original content for text conversion
    originalContents.value.set(id, cached.chapter.content);

    // Trim cached chapters to limit memory
    if (chapters.value.length > MAX_CACHED_CHAPTERS) {
      if (position === 'append' && currentChapterIndex.value > 2) {
        // Trim from beginning when appending
        const removed = chapters.value.shift();
        if (removed) {
          loadedUrls.value.delete(removed.chapter.url);
          originalContents.value.delete(removed.id);
          currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
        }
      } else if (position === 'prepend') {
        // Trim from end when prepending
        const removed = chapters.value.pop();
        if (removed) {
          loadedUrls.value.delete(removed.chapter.url);
          originalContents.value.delete(removed.id);
        }
      }
    }

    return true;
  }

  /** Normalize URL for comparison (remove trailing slash and index.html) */
  function normalizeUrl(url: string): string {
    return url.replace(/\/$/, '').replace(/\/index\.html?$/, '');
  }

  /** Unified chapter loading function */
  async function loadChapter(direction: 'next' | 'prev'): Promise<boolean> {
    const isNext = direction === 'next';
    const refChapter = isNext ? chapters.value[chapters.value.length - 1] : chapters.value[0];
    const isLoadingRef = isNext ? isLoadingNext : isLoadingPrev;
    const pendingAbortRef = isNext ? pendingNextAbort : pendingPrevAbort;
    const endMessage = isNext ? '已经是最后一章了' : '已经是第一章了';
    const errorMessage = isNext ? '加载下一章失败' : '加载上一章失败';

    if (isLoadingRef.value) {
      return false;
    }

    const targetUrl = isNext ? refChapter?.chapter.nextUrl : refChapter?.chapter.prevUrl;
    if (!targetUrl) {
      showToast(endMessage, 'info');
      return false;
    }

    // Don't load if targetUrl is the index/TOC page
    if (
      refChapter.chapter.indexUrl &&
      normalizeUrl(targetUrl) === normalizeUrl(refChapter.chapter.indexUrl)
    ) {
      showToast(endMessage, 'info');
      return false;
    }

    // Check if already in cachedContents
    if (loadedUrls.value.has(targetUrl)) {
      const cached = cachedContents.value.get(targetUrl);
      if (cached) {
        return insertCachedChapter(cached, isNext ? 'append' : 'prepend');
      }
      return false;
    }

    isLoadingRef.value = true;

    // Cancel in-flight request
    if (pendingAbortRef.value) {
      pendingAbortRef.value();
      pendingAbortRef.value = null;
    }

    // Pre-fetch validation: check if URL looks like a valid chapter page
    if (isInvalidChapterUrl(targetUrl, refChapter.chapter.url)) {
      loadedUrls.value.add(targetUrl);
      isLoadingRef.value = false;
      showToast(endMessage, 'info');
      return false;
    }

    try {
      const referer = refChapter.chapter.url;
      const { promise, abort } = fetchAndParseUrl(targetUrl, referer);
      pendingAbortRef.value = abort;

      const doc = await promise;
      pendingAbortRef.value = null;
      if (!doc) {
        loadedUrls.value.add(targetUrl);
        showToast(endMessage, 'info');
        return false;
      }

      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, doc, targetUrl, referer);
      if (!parsed) {
        loadedUrls.value.add(targetUrl);
        showToast(endMessage, 'info');
        return false;
      }

      // Check if this is a TOC page
      const isTocPage = detectTocPage(parsed.content, targetUrl, refChapter.chapter.url);
      if (isTocPage) {
        loadedUrls.value.add(targetUrl);
        showToast(endMessage, 'info');
        return false;
      }

      // Additional validation for prev: check if page has prev but no next
      if (!isNext) {
        if (
          parsed.nextUrl &&
          normalizeUrl(parsed.nextUrl) === normalizeUrl(refChapter.chapter.url)
        ) {
          // This is fine, it's actually the previous chapter
        } else if (parsed.prevUrl && !parsed.nextUrl) {
          // Page has prev but no next - likely a TOC or non-chapter page
          loadedUrls.value.add(targetUrl);
          return false;
        }
      }

      // Add to chapters list
      const suffix = isNext ? '' : 'prev-';
      const id = `chapter-${Date.now()}-${suffix}${chapters.value.length}`;
      const entry = {
        chapter: parsed,
        rule: parsed.rule,
        id,
      };

      if (isNext) {
        chapters.value.push(entry);
      } else {
        chapters.value.unshift(entry);
        currentChapterIndex.value++;
      }
      loadedUrls.value.add(parsed.url);

      // Store original content for text conversion
      originalContents.value.set(id, parsed.content);

      // Also store in cachedContents for quick jump
      cachedContents.value.set(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      // Apply current conversion mode if active
      if (currentConversionMode.value !== 'none') {
        const converted = await convertHTML(parsed.content, currentConversionMode.value);
        const chapterEntry = chapters.value.find(e => e.id === id);
        if (chapterEntry) {
          chapterEntry.chapter = { ...chapterEntry.chapter, content: converted };
        }
      }

      // Add to history
      if (!history.value.includes(parsed.url)) {
        if (isNext) {
          history.value.push(parsed.url);
        } else {
          history.value.unshift(parsed.url);
        }
      }

      // Trim cached chapters to limit memory
      if (chapters.value.length > MAX_CACHED_CHAPTERS) {
        if (isNext && currentChapterIndex.value > 2) {
          const removed = chapters.value.shift();
          if (removed) {
            loadedUrls.value.delete(removed.chapter.url);
            originalContents.value.delete(removed.id);
            currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
          }
        } else if (!isNext) {
          const removed = chapters.value.pop();
          if (removed) {
            loadedUrls.value.delete(removed.chapter.url);
            originalContents.value.delete(removed.id);
          }
        }
      }

      return true;
    } catch (e) {
      console.error(`[MNR] Failed to load ${direction} chapter:`, e);
      setError(errorMessage);
      return false;
    } finally {
      isLoadingRef.value = false;
    }
  }

  /** Load next chapter and append to list */
  async function loadNextChapter(): Promise<boolean> {
    return loadChapter('next');
  }

  /** Load previous chapter and prepend to list */
  async function loadPrevChapter(): Promise<boolean> {
    return loadChapter('prev');
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  function setError(msg: string) {
    error.value = msg;
    toastType.value = 'error';
    isLoading.value = false;
    // Auto-dismiss after 3 seconds
    if (toastTimer.value) {
      window.clearTimeout(toastTimer.value);
    }
    toastTimer.value = window.setTimeout(() => {
      error.value = null;
      toastTimer.value = null;
    }, 3000);
  }

  function showToast(msg: string, type: 'info' | 'error' = 'info', duration = 2000) {
    error.value = msg;
    toastType.value = type;
    // Auto-dismiss
    if (toastTimer.value) {
      window.clearTimeout(toastTimer.value);
    }
    toastTimer.value = window.setTimeout(() => {
      error.value = null;
      toastTimer.value = null;
    }, duration);
  }

  function clearError() {
    error.value = null;
    if (toastTimer.value) {
      window.clearTimeout(toastTimer.value);
      toastTimer.value = null;
    }
  }

  function updateScroll(percent: number) {
    scrollPercent.value = Math.max(0, Math.min(100, percent));
  }

  /** Update current chapter index and browser URL */
  function setCurrentChapter(index: number) {
    if (index < 0 || index >= chapters.value.length) return;
    if (currentChapterIndex.value === index) return;

    currentChapterIndex.value = index;
    const chapterEntry = chapters.value[index];
    if (chapterEntry?.chapter.url) {
      // Update browser URL without reloading
      try {
        window.history.replaceState({ mnrChapter: index }, '', chapterEntry.chapter.url);
      } catch {
        // Ignore errors (cross-origin restrictions etc.)
      }
    }
  }

  function getProgress(): ReadingProgress | null {
    if (!chapter.value?.url) return null;
    return {
      url: readerStoreHistoryFallback(),
      chapterUrl: chapter.value.url,
      chapterPercent: calculateCurrentChapterPercent(),
      scrollPercent: scrollPercent.value,
      lastRead: Date.now(),
    };
  }

  // Helper to get a stable URL even if history was not updated yet
  function readerStoreHistoryFallback(): string {
    return chapter.value?.url || window.location.href;
  }

  // Simplified: use overall scroll percent as chapter percent approximation
  function calculateCurrentChapterPercent(): number {
    return scrollPercent.value;
  }

  /** Apply text conversion to all chapters */
  async function applyTextConversion(mode: ConversionMode): Promise<void> {
    currentConversionMode.value = mode;

    if (mode === 'none') {
      // Restore original content
      for (const entry of chapters.value) {
        const original = originalContents.value.get(entry.id);
        if (original && entry.chapter.content !== original) {
          entry.chapter = { ...entry.chapter, content: original };
        }
      }
    } else {
      // Convert all chapters
      for (const entry of chapters.value) {
        const original = originalContents.value.get(entry.id);
        if (original) {
          const converted = await convertHTML(original, mode);
          entry.chapter = { ...entry.chapter, content: converted };
        }
      }
    }
  }

  /**
   * Batch cache chapters (best-effort, sequential)
   * Caches to cachedContents (not chapters) for memory efficiency
   * No limit on number of chapters - can cache entire book
   */
  async function startCacheAll(urls?: string[]): Promise<void> {
    if (cacheProgress.value.running) return;

    let taskList = urls ? [...urls] : []; // No limit
    cacheQueue.value = [...taskList];

    // 目录列表：current.indexUrl -> 解析出章节列表，缓存全本
    if (!taskList.length) {
      const indexUrl = chapter.value?.indexUrl;
      const currentUrl = chapter.value?.url;
      if (indexUrl) {
        const tocEntries = await loadTocEntriesPaged(indexUrl, currentUrl || indexUrl, abort => {
          cacheAbort.value = abort;
        });
        cacheAbort.value = null;

        const tocLinks = tocEntries.map(e => e.url).slice(0, 10000);
        // Cache entire book, filter already cached
        taskList = tocLinks.filter(u => !loadedUrls.value.has(u) && !cachedContents.value.has(u));
        cacheQueue.value = [...taskList];
      }
    }

    // Total is actual list length
    const estimatedTotal = taskList.length;
    if (estimatedTotal === 0) {
      cacheProgress.value = { done: 0, total: 0, running: false };
      return;
    }
    cacheProgress.value = { done: 0, total: estimatedTotal, running: true };

    let nextUrl: string | undefined | null = taskList.shift();
    let referer = chapters.value[chapters.value.length - 1]?.chapter.url || chapter.value?.url;

    while (cacheProgress.value.running && nextUrl) {
      // 去重 - check both loadedUrls and cachedContents
      if (loadedUrls.value.has(nextUrl) || cachedContents.value.has(nextUrl)) {
        cacheProgress.value = { ...cacheProgress.value, done: cacheProgress.value.done + 1 };
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      const { promise, abort } = fetchAndParseUrl(nextUrl, referer);
      cacheAbort.value = abort;
      const doc = await promise;
      cacheAbort.value = null;
      if (!doc) {
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, doc, nextUrl, referer);
      if (!parsed) {
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      // Store in cachedContents (not chapters - for memory efficiency)
      cachedContents.value.set(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      // Mark as loaded for deduplication
      loadedUrls.value.add(parsed.url);

      cacheProgress.value = { ...cacheProgress.value, done: cacheProgress.value.done + 1 };

      // 下一章 URL 优先：显式队列 > 检测器返回 nextUrl（分页合并后 nextUrl 已指向下一章）
      referer = parsed.url;
      nextUrl = taskList.shift() ?? parsed.nextUrl ?? null;

      // If following nextUrl chain, update total estimate
      if (!cacheQueue.value.length && nextUrl && !loadedUrls.value.has(nextUrl)) {
        cacheProgress.value = { ...cacheProgress.value, total: cacheProgress.value.done + 1 };
      }
    }

    // Final total update
    cacheProgress.value = {
      ...cacheProgress.value,
      total: cacheProgress.value.done,
      running: false,
    };
    cacheAbort.value = null;

    // Persist cache after completion
    await persistCache();
  }

  function cancelCacheAll(): void {
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];
    cacheAbort.value?.();
    cacheAbort.value = null;
  }

  function resolveUrl(href: string, base: string): string | null {
    try {
      return new URL(href, base).toString();
    } catch {
      return null;
    }
  }

  /**
   * Extract URL pattern by replacing numbers with placeholders
   * e.g., /chapter/123/456.html -> /chapter/{N}/{N}.html
   */
  function extractUrlPattern(url: string): string {
    try {
      const u = new URL(url);
      // Replace consecutive digits with {N}, keep path structure
      return u.pathname.replace(/\d+/g, '{N}');
    } catch {
      return url.replace(/\d+/g, '{N}');
    }
  }

  /**
   * Chapter title whitelist patterns - titles matching these are likely real chapters
   * Based on common novel chapter naming conventions
   */
  const CHAPTER_TITLE_PATTERNS = [
    // Chinese chapter formats: 第X章/节/回/话/篇/集/卷
    /^.{0,10}第.{1,10}[章节回话篇集卷]/,
    // Numbered chapters: 1. xxx, 001 xxx, etc.
    /^\d{1,4}[.、\s]/,
    // Chapter keyword at start
    /^(序章|序幕|楔子|引子|终章|尾声|番外|后记|前言)/,
    // English format
    /^chapter\s*\d+/i,
    /^(prologue|epilogue|preface)/i,
  ];

  /**
   * Non-chapter title patterns to filter out (blacklist)
   */
  const NON_CHAPTER_TITLE_PATTERNS = [
    // Announcements and notices
    /^(公告|通知|声明|说明|必读|注意|警告|温馨提示)/,
    /上架感言|完本感言|请假|推迟|停更|断更|更新|爆更|上架通知|卷末感言/,
    /必看|必读|请务必阅读|读者必看/,
    // Author-related
    /^(作者|关于作者|作品相关|设定|世界观|人物介绍|角色)/,
    // Promotional content
    /求.*票|求.*收藏|求.*订阅|求.*打赏|求.*推荐|求.*支持/,
    /新书|推荐|安利|宣传|书单|书评/,
    // Metadata pages
    /^(目录|封面|简介|内容简介|书籍信息|作品信息)/,
    // Locked/VIP markers that are standalone entries (not part of chapter title)
    /^(VIP|付费|锁定|未解锁|需订阅|加入书架)$/i,
    // External links and community
    /官网|公众号|微信|QQ群|粉丝群|书友群|交流群|读者群/,
    // Common non-content links
    /登[录陆]|注册|充值|书架|书城|排行|分类|搜索|设置/,
    /首页|返回|上一页|下一页|翻页/,
    // Volume/section labels only (e.g., "章节2", "卷一", not real chapter titles)
    /^(章节|分卷|卷|部|篇)\s*[\d一二三四五六七八九十百千]+\s*$/,
    /^(正文|番外|VIP卷?|免费章节?)\s*$/,
  ];

  /**
   * Extract book ID from URL for same-book filtering
   * Returns null if cannot extract
   */
  function extractBookId(url: string): string | null {
    try {
      const u = new URL(url);
      // Common patterns: /book/123/, /chapter/123/456/, /123/456.html
      const patterns = [
        /\/book\/(\d+)/,
        /\/chapter\/(\d+)\//,
        /\/(\d+)\/\d+(?:\.html?)?$/,
        // Faloo (飞卢): /{bookId}_{chapterId}.html
        /\/(\d+)_\d+(?:\.html?)?$/,
        /[?&](?:book_?id|bid|id)=(\d+)/i,
      ];
      for (const p of patterns) {
        const m = u.pathname.match(p) || u.search.match(p);
        if (m) return m[1];
      }
    } catch {
      // Invalid URL
    }
    return null;
  }

  /**
   * Check if a title matches chapter patterns (whitelist)
   */
  function isLikelyChapterTitle(title: string): boolean {
    const t = title.trim();
    return CHAPTER_TITLE_PATTERNS.some(p => p.test(t));
  }

  /**
   * Check if a title looks like a non-chapter entry (blacklist)
   */
  function isNonChapterTitle(title: string): boolean {
    const t = title.trim();
    // Too short to be a chapter
    if (t.length < 2) return true;
    // Match against blacklist patterns
    return NON_CHAPTER_TITLE_PATTERNS.some(p => p.test(t));
  }

  /**
   * Smart filter TOC entries based on URL pattern analysis and title filtering
   * Strategy:
   * 1. Same-book filtering - filter out links to other books (recommendations)
   * 2. URL pattern analysis - find dominant URL patterns (chapter URLs usually follow same pattern)
   * 3. Title whitelist - entries matching chapter patterns get priority
   * 4. Title blacklist - filter out non-chapter content
   */
  function filterTocEntries(entries: TocEntry[]): TocEntry[] {
    if (entries.length < 5) return entries; // Too few to analyze

    // Step 0: Same-book filtering - find dominant book ID and filter out other books
    const bookIdCounts = new Map<string, number>();
    for (const entry of entries) {
      const bookId = extractBookId(entry.url);
      if (bookId) {
        bookIdCounts.set(bookId, (bookIdCounts.get(bookId) || 0) + 1);
      }
    }

    // Find the dominant book ID (most common one)
    let dominantBookId: string | null = null;
    let maxCount = 0;
    for (const [bookId, count] of bookIdCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantBookId = bookId;
      }
    }

    // Pre-filter: remove entries pointing to different books (recommendations)
    const sameBookEntries =
      dominantBookId && maxCount >= 5
        ? entries.filter(entry => {
            const bookId = extractBookId(entry.url);
            // Keep if: no book ID detected, or matches dominant book ID
            return !bookId || bookId === dominantBookId;
          })
        : entries;

    // Step 1: Count URL patterns
    const patternCounts = new Map<string, number>();
    const patternEntries = new Map<string, TocEntry[]>();

    for (const entry of sameBookEntries) {
      const pattern = extractUrlPattern(entry.url);
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
      if (!patternEntries.has(pattern)) {
        patternEntries.set(pattern, []);
      }
      patternEntries.get(pattern)!.push(entry);
    }

    // Step 2: Find dominant pattern(s)
    const sortedPatterns = Array.from(patternCounts.entries()).sort((a, b) => b[1] - a[1]);

    const dominantPatterns = new Set<string>();
    const totalEntries = sameBookEntries.length;

    for (const [pattern, count] of sortedPatterns) {
      // Accept patterns that have at least 5 entries OR represent > 30% of total
      const ratio = count / totalEntries;
      if (count >= 5 || ratio > 0.3) {
        dominantPatterns.add(pattern);
        // Stop if we've covered enough entries (> 90%)
        const coveredCount = Array.from(dominantPatterns).reduce(
          (sum, p) => sum + (patternCounts.get(p) || 0),
          0
        );
        if (coveredCount / totalEntries > 0.9) break;
      }
    }

    // If no dominant pattern found, use the most common one
    if (dominantPatterns.size === 0 && sortedPatterns.length > 0) {
      dominantPatterns.add(sortedPatterns[0][0]);
    }

    // Step 3: Score and filter entries
    // Score: +2 for URL pattern match, +1 for whitelist title, -2 for blacklist title
    // But: whitelist overrides blacklist (chapter with "求票" suffix should be kept)
    const scoredEntries = sameBookEntries.map(entry => {
      let score = 0;
      const pattern = extractUrlPattern(entry.url);

      // URL pattern match
      if (dominantPatterns.has(pattern)) {
        score += 2;
      }

      // Title whitelist (looks like a chapter)
      const matchesWhitelist = isLikelyChapterTitle(entry.title);
      if (matchesWhitelist) {
        score += 1;
      }

      // Title blacklist (looks like non-chapter)
      // Only apply blacklist penalty if title doesn't match whitelist
      // This prevents filtering "第1章 xxx（求票）" which is a valid chapter
      if (!matchesWhitelist && isNonChapterTitle(entry.title)) {
        score -= 2;
      }

      return { entry, score };
    });

    // Filter: keep entries with score >= 1
    // (either URL match + not blacklisted, or whitelist title)
    const filtered = scoredEntries.filter(({ score }) => score >= 1).map(({ entry }) => entry);

    // Fallback: if filtering removed too many entries, be more conservative
    if (filtered.length < sameBookEntries.length * 0.3 || filtered.length < 10) {
      // More lenient: just apply blacklist filtering without URL pattern
      const lenientFiltered = sameBookEntries.filter(entry => !isNonChapterTitle(entry.title));
      // If lenient filter gives reasonable results, use it
      if (lenientFiltered.length >= filtered.length) {
        // Use lenient results, but we still need to apply sorting logic below
        return sortTocEntries(lenientFiltered);
      }
    }

    return sortTocEntries(filtered);
  }

  /**
   * Detect list order and sort/reverse if necessary
   * Handles cases where TOC is in descending order (newest first)
   */
  function sortTocEntries(entries: TocEntry[]): TocEntry[] {
    if (entries.length < 5) return entries;

    // Extract numbers from titles
    const entriesWithNum = entries
      .map((entry, index) => ({
        index, // Keep original index
        entry,
        num: extractChapterNumber(entry.title),
      }))
      .filter(item => item.num !== null);

    // Only attempt sorting if we have enough numbered entries
    if (entriesWithNum.length < entries.length * 0.3 || entriesWithNum.length < 3) {
      return entries;
    }

    // Check order trends using adjacent pairs
    let descendingPairs = 0;
    let ascendingPairs = 0;

    for (let i = 0; i < entriesWithNum.length - 1; i++) {
      const diff = entriesWithNum[i + 1].num! - entriesWithNum[i].num!;
      if (diff < 0) descendingPairs++;
      else if (diff > 0) ascendingPairs++;
    }

    // If overwhelmingly descending (reverse order), reverse the list
    // Threshold: > 60% of pairs are descending
    const totalPairs = descendingPairs + ascendingPairs;
    if (totalPairs > 0 && descendingPairs / totalPairs > 0.6) {
      // It's a descending list, reverse it to make it ascending (Chapter 1 -> Chapter N)
      return [...entries].reverse();
    }

    return entries;
  }

  /**
   * Extract chapter number from title for sorting
   * Primarily supports Arabic numbers which are most common
   */
  function extractChapterNumber(title: string): number | null {
    // 1. "第123章" / "第 123 章" / "第123话"
    const match1 = title.match(/第\s*(\d+)\s*[章节回话篇集卷]/);
    if (match1) return parseInt(match1[1], 10);

    // 2. "123." / "123 " / "123、" at start
    const match2 = title.match(/^(\d+)[.、\s]/);
    if (match2) return parseInt(match2[1], 10);

    // 3. "Chapter 123"
    const match3 = title.match(/Chapter\s*(\d+)/i);
    if (match3) return parseInt(match3[1], 10);

    // 4. Pure number at start (riskier, check length)
    // const match4 = title.match(/^(\d+)\s*$/);
    // if (match4) return parseInt(match4[1], 10);

    return null;
  }

  /**
   * Parse TOC with titles from a document
   * Deduplication strategy: Keep last occurrence position, but prefer better titles
   * This handles TOC pages with "recent updates" at top followed by full chapter list
   */
  function isPlaceholderTocTitle(title: string): boolean {
    return /^章节\s*\d+$/i.test(title.trim());
  }

  function isBetterTocTitle(oldTitle: string, newTitle: string): boolean {
    const oldWhitelist = isLikelyChapterTitle(oldTitle);
    const newWhitelist = isLikelyChapterTitle(newTitle);

    // Prefer titles that look like real chapters
    if (newWhitelist && !oldWhitelist) return true;
    if (oldWhitelist && !newWhitelist) return false;

    // Avoid replacing a non-placeholder with a placeholder
    if (!isPlaceholderTocTitle(oldTitle) && isPlaceholderTocTitle(newTitle)) return false;
    if (isPlaceholderTocTitle(oldTitle) && !isPlaceholderTocTitle(newTitle)) return true;

    // Otherwise prefer the longer (more informative) title
    return newTitle.length > oldTitle.length;
  }

  /**
   * Extract chapter title from link element
   * Prioritizes inner title elements to avoid getting extra text like "免费", "VIP"
   */
  function extractTocLinkTitle(a: Element): string {
    // Method 1: Try common title selectors (Qidian mobile sidebar, etc.)
    const titleSelectors = [
      '[class*="chapterItemTitle"]', // Qidian mobile: _chapterItemTitle_xxx
      '[class*="chapter-title"]',
      '[class*="chapterTitle"]',
      'h2', // Qidian mobile catalog: <a><div><h2>Title</h2></div><span>免费</span></a>
      'h3',
    ];

    for (const sel of titleSelectors) {
      const el = a.querySelector(sel);
      if (el) {
        const text = (el.textContent || '').trim();
        if (text) return text;
      }
    }

    // Method 2: If link has child elements, try to get first meaningful text
    // This handles structures like: <a><div><p>Title</p><p>免费</p></div></a>
    const firstP = a.querySelector('p');
    if (firstP) {
      // Check if there are multiple p elements (likely title + status)
      const allP = a.querySelectorAll('p');
      if (allP.length > 1) {
        // Return first p's text (usually the title)
        const text = (firstP.textContent || '').trim();
        if (text) return text;
      }
    }

    // Method 3: Get direct text content only (excludes child element text)
    // This handles: <a>Chapter Title<span>Extra</span></a>
    let directText = '';
    for (const node of Array.from(a.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        directText += node.textContent || '';
      }
    }
    directText = directText.trim();
    if (directText) return directText;

    // Fallback to full textContent
    return (a.textContent || '').trim();
  }

  function collectTocCandidates(doc: Document, base: string): TocEntry[] {
    const links = Array.from(doc.querySelectorAll('a[href]'));
    // Match chapter titles: 第X章/节/回/话/篇/集/卷/幕, or standalone 章/回/节/話/幕
    const textPattern = /(第.{1,20}[章节回话篇集卷幕]|[章回节話幕]|chapter|\d+)/i;
    // Match chapter URLs: /chapter_1, /read/1, /123.html (pure numeric filename)
    const urlPattern = /(chapter|read|book|novel|txt|\/\d+)[/_-]\d+|\/\d+\.html?$/i;
    const excludeAncestors = (rule.value?.toc?.excludeAncestors || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const candidates: TocEntry[] = [];
    for (const a of links) {
      // Rule-specific TOC exclusions (keep generic parser clean; configure per-site in rules).
      if (excludeAncestors.length > 0) {
        let excluded = false;
        for (const sel of excludeAncestors) {
          try {
            if (a.closest(sel)) {
              excluded = true;
              break;
            }
          } catch {
            // Ignore invalid selectors
          }
        }
        if (excluded) continue;
      }

      const text = extractTocLinkTitle(a);
      const href = a.getAttribute('href') || '';
      const abs = resolveUrl(href, base);
      if (!abs) continue;

      // Only keep links that look like chapters
      if (!(textPattern.test(text) || urlPattern.test(href))) {
        continue;
      }

      const title = text || `章节 ${candidates.length + 1}`;
      candidates.push({ title, url: abs });
    }

    return candidates;
  }

  /**
   * Deduplicate TOC entries while preserving the last occurrence position.
   * This helps handle TOC pages that have "recent updates" at top followed by full list.
   */
  function dedupeTocEntries(candidates: TocEntry[]): TocEntry[] {
    const seenUrls = new Map<string, TocEntry>();
    const results: TocEntry[] = [];

    for (let i = candidates.length - 1; i >= 0; i--) {
      const entry = candidates[i];
      if (seenUrls.has(entry.url)) {
        const existing = seenUrls.get(entry.url)!;
        if (isBetterTocTitle(existing.title, entry.title)) {
          existing.title = entry.title;
        }
      } else {
        seenUrls.set(entry.url, entry);
        results.unshift(entry);
      }
    }

    return results;
  }

  const MAX_TOC_PAGES = 120;

  function normalizeTocPagerText(text: string): string {
    return text.replace(/\s+/g, '').trim();
  }

  function isTocNextPageText(text: string): boolean {
    const t = normalizeTocPagerText(text).toLowerCase();
    if (!t) return false;
    if (t.includes('下一页') || t.includes('下页') || t.includes('下一頁') || t.includes('下頁')) {
      return true;
    }
    // Conservative English fallback (avoid matching "next chapter")
    if (t.includes('next') && !t.includes('chapter') && (t.includes('page') || t === 'next')) {
      return true;
    }
    return false;
  }

  function extractTocPaginationSeed(indexUrl: string): string | null {
    try {
      const u = new URL(indexUrl);
      // Prefer numeric IDs (most CN sites), but keep it conservative: 3+ digits.
      const m = u.pathname.match(/\/(\d{3,})(?:[/?]|$)/);
      return m?.[1] || null;
    } catch {
      return null;
    }
  }

  function normalizeUrlForCompare(url: string): string {
    try {
      const u = new URL(url);
      u.hash = '';
      return u.toString();
    } catch {
      return url;
    }
  }

  function isValidTocPaginationUrl(candidateUrl: string, indexUrl: string): boolean {
    try {
      const c = new URL(candidateUrl);
      const idx = new URL(indexUrl);
      if (c.protocol !== 'http:' && c.protocol !== 'https:') return false;
      if (c.origin !== idx.origin) return false;

      const seed = extractTocPaginationSeed(indexUrl);
      if (seed && !c.pathname.includes(seed)) return false;

      return true;
    } catch {
      return false;
    }
  }

  function findNextTocPageUrl(
    doc: Document,
    currentPageUrl: string,
    indexUrl: string
  ): string | null {
    const currentNorm = normalizeUrlForCompare(currentPageUrl);

    const pushCandidate = (
      candidates: Array<{ url: string; score: number }>,
      href: string,
      score: number
    ) => {
      const abs = resolveUrl(href, currentPageUrl);
      if (!abs) return;
      const absNorm = normalizeUrlForCompare(abs);
      if (absNorm === currentNorm) return;
      if (!isValidTocPaginationUrl(abs, indexUrl)) return;
      candidates.push({ url: abs, score });
    };

    const candidates: Array<{ url: string; score: number }> = [];

    // 1) <link rel="next" href="...">
    const linkNext = doc.querySelector('link[rel="next"][href]')?.getAttribute('href');
    if (linkNext) {
      pushCandidate(candidates, linkNext, 100);
    }

    // 2) <a rel="next" href="...">
    const aRelNext = doc.querySelector('a[rel~="next"][href]')?.getAttribute('href');
    if (aRelNext) {
      pushCandidate(candidates, aRelNext, 90);
    }

    // 3) Text-based paging links (e.g. "下一页")
    for (const a of Array.from(doc.querySelectorAll('a[href]'))) {
      const text = a.textContent || '';
      if (!isTocNextPageText(text)) continue;

      const href = a.getAttribute('href');
      if (!href) continue;

      let score = 50;
      const rel = (a.getAttribute('rel') || '').toLowerCase();
      if (rel.includes('next')) score += 10;
      const cls = (a.getAttribute('class') || '').toLowerCase();
      if (cls.includes('next')) score += 3;
      if (a.closest('.pager, .pagination, .page, .pagebar, .caption, nav')) score += 2;

      pushCandidate(candidates, href, score);
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].url;
  }

  async function loadTocEntriesPaged(
    indexUrl: string,
    currentUrl: string,
    setAbort: (abort: (() => void) | null) => void
  ): Promise<TocEntry[]> {
    const visitedPages = new Set<string>();
    const seenChapterUrls = new Set<string>();
    const allCandidates: TocEntry[] = [];

    const aborters: Array<() => void> = [];
    let aborted = false;
    const abortAll = () => {
      aborted = true;
      for (const fn of aborters) {
        try {
          fn();
        } catch {
          // ignore
        }
      }
    };
    setAbort(abortAll);

    try {
      let pageUrl: string | null = indexUrl;
      let referer: string | undefined = currentUrl || indexUrl;

      while (pageUrl && visitedPages.size < MAX_TOC_PAGES) {
        const pageKey = normalizeUrlForCompare(pageUrl);
        if (visitedPages.has(pageKey)) break;
        visitedPages.add(pageKey);

        const { promise, abort } = fetchAndParseUrl(pageUrl, referer);
        aborters.push(abort);

        const doc = await promise;
        if (aborted) break;
        if (!doc) break;

        const pageCandidates = collectTocCandidates(doc, pageUrl);
        allCandidates.push(...pageCandidates);

        let newCount = 0;
        for (const entry of pageCandidates) {
          if (!seenChapterUrls.has(entry.url)) {
            seenChapterUrls.add(entry.url);
            newCount++;
          }
        }

        // If we are "turning pages" but keep seeing the same set, stop to avoid loops.
        if (visitedPages.size >= 2 && newCount === 0) break;

        const nextPageUrl = findNextTocPageUrl(doc, pageUrl, indexUrl);
        if (!nextPageUrl) break;

        referer = pageUrl;
        pageUrl = nextPageUrl;
      }
    } finally {
      setAbort(null);
    }

    if (allCandidates.length === 0) return [];
    return filterTocEntries(dedupeTocEntries(allCandidates));
  }

  /**
   * Load table of contents from index URL
   */
  async function loadToc(): Promise<void> {
    const indexUrl = chapter.value?.indexUrl;
    if (!indexUrl || toc.value.length > 0 || tocLoading.value) return;

    tocLoading.value = true;
    const currentUrl = chapter.value?.url || '';

    try {
      toc.value = await loadTocEntriesPaged(indexUrl, currentUrl, abort => {
        tocAbort.value = abort;
      });
    } catch (e) {
      console.error('[MNR] Failed to load TOC:', e);
    } finally {
      tocLoading.value = false;
      tocAbort.value = null;
    }
  }

  function $reset() {
    isActive.value = false;
    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;
    chapters.value = [];
    currentChapterIndex.value = 0;
    error.value = null;
    scrollPercent.value = 0;
    loadedUrls.value.clear();
    originalContents.value.clear();
    currentConversionMode.value = 'none';
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];
    cacheAbort.value = null;
    // Reset TOC state
    toc.value = [];
    tocLoading.value = false;
    if (tocAbort.value) {
      tocAbort.value();
      tocAbort.value = null;
    }
  }

  /**
   * Rebuild chapters array around a target URL (for jumping to cached chapter)
   * Clears current chapters and sets the target as the only chapter
   */
  async function rebuildChaptersAround(targetUrl: string): Promise<boolean> {
    // Check cachedContents first
    const cached = cachedContents.value.get(targetUrl);
    if (!cached) return false;

    // Clear current chapters
    chapters.value = [];
    currentChapterIndex.value = 0;
    originalContents.value.clear();

    // Add target chapter
    const id = `chapter-${Date.now()}-jump-0`;
    chapters.value.push({
      chapter: cached.chapter,
      rule: cached.rule,
      id,
    });

    // Store original content
    originalContents.value.set(id, cached.chapter.content);

    // Apply current conversion mode if needed
    if (currentConversionMode.value !== 'none') {
      const converted = await convertHTML(cached.chapter.content, currentConversionMode.value);
      chapters.value[0].chapter = { ...chapters.value[0].chapter, content: converted };
    }

    return true;
  }

  /**
   * Reload current chapter - refetch and reparse with current rules
   * Used after rule updates to apply changes immediately
   */
  async function reloadCurrentChapter(): Promise<void> {
    const current = chapters.value[currentChapterIndex.value];
    if (!current) return;

    const url = current.chapter.url;

    showToast('正在重新加载...', 'info');

    // Refetch the page
    const { promise } = fetchAndParseUrl(url, url);
    const doc = await promise;
    if (!doc) {
      showToast('重新加载失败', 'error');
      return;
    }

    // Parse with new rules (will pick up updated rules from RuleManager)
    const parser = getParser();
    const parsed = await parseWithSectionMerge(parser, doc, url, url);

    if (parsed) {
      // Update current chapter
      current.chapter = parsed;
      current.rule = parsed.rule;
      originalContents.value.set(current.id, parsed.content);

      // Also update cached content
      cachedContents.value.set(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      // Reapply text conversion if active
      if (currentConversionMode.value !== 'none') {
        const converted = await convertHTML(parsed.content, currentConversionMode.value);
        current.chapter = { ...current.chapter, content: converted };
      }

      showToast('规则已应用', 'info');
    } else {
      showToast('解析失败', 'error');
    }
  }

  /**
   * Generate a book ID from index URL for cache persistence
   */
  function generateBookId(indexUrl: string): string {
    try {
      const url = new URL(indexUrl);
      // Use pathname as book ID (usually contains book identifier)
      return url.hostname + url.pathname.replace(/\//g, '_');
    } catch {
      // Fallback to simple hash
      return btoa(indexUrl).slice(0, 32);
    }
  }

  /**
   * Persist cache to GM storage
   */
  async function persistCache(): Promise<void> {
    const indexUrl = chapter.value?.indexUrl;
    if (!indexUrl || cachedContents.value.size === 0) return;

    const bookId = generateBookId(indexUrl);

    // Convert Map to object for JSON serialization
    const chaptersObj: Record<string, CachedChapter> = {};
    for (const [url, cached] of cachedContents.value) {
      chaptersObj[url] = cached;
    }

    const data: PersistedBookCache = {
      bookId,
      indexUrl,
      chapters: chaptersObj,
      lastUpdated: Date.now(),
    };

    try {
      if (typeof GM_setValue !== 'undefined') {
        GM_setValue(`mnr_cache_${bookId}`, JSON.stringify(data));
        // Update persistedUrls to reflect what's saved
        persistedUrls.value = new Set(Object.keys(chaptersObj));
      }
    } catch (e) {
      console.error('[MNR] Failed to persist cache:', e);
    }
  }

  /**
   * Restore cache from GM storage
   */
  async function restoreCache(): Promise<void> {
    const indexUrl = chapter.value?.indexUrl;
    if (!indexUrl) return;

    const bookId = generateBookId(indexUrl);

    try {
      if (typeof GM_getValue !== 'undefined') {
        const stored = GM_getValue(`mnr_cache_${bookId}`, null);
        if (stored) {
          const data: PersistedBookCache = JSON.parse(stored as string);

          // Restore to cachedContents, loadedUrls, and persistedUrls
          const urls = Object.keys(data.chapters);
          for (const [url, cached] of Object.entries(data.chapters)) {
            cachedContents.value.set(url, cached);
            loadedUrls.value.add(url);
          }
          persistedUrls.value = new Set(urls);
        }
      }
    } catch (e) {
      console.error('[MNR] Failed to restore cache:', e);
    }
  }

  /**
   * Clear persisted cache for current book
   */
  async function clearPersistedCache(): Promise<void> {
    const indexUrl = chapter.value?.indexUrl;
    if (!indexUrl) return;

    const bookId = generateBookId(indexUrl);

    try {
      if (typeof GM_deleteValue !== 'undefined') {
        GM_deleteValue(`mnr_cache_${bookId}`);
      }
      // Only clear persisted URLs, keep session cache intact
      persistedUrls.value.clear();
    } catch (e) {
      console.error('[MNR] Failed to clear cache:', e);
    }
  }

  return {
    // State
    isActive,
    isLoading,
    isLoadingPrev,
    isLoadingNext,
    chapters,
    currentChapterIndex,
    chapter,
    rule,
    error,
    toastType,
    scrollPercent,
    history,
    cacheProgress,
    toc,
    tocLoading,
    cachedContents,
    persistedUrls,

    // Getters
    title,
    bookTitle,
    content,
    hasNext,
    hasPrev,
    hasIndex,
    confidence,
    method,
    tocWithStatus,
    currentChapterUrl,

    // Actions
    activate,
    deactivate,
    setChapter,
    setCurrentChapter,
    loadNextChapter,
    loadPrevChapter,
    setLoading,
    setError,
    showToast,
    clearError,
    updateScroll,
    getProgress,
    applyTextConversion,
    startCacheAll,
    cancelCacheAll,
    loadToc,
    rebuildChaptersAround,
    reloadCurrentChapter,
    persistCache,
    restoreCache,
    clearPersistedCache,
    $reset,
  };
});

function getSectionBaseUrl(url: string): string | null {
  // /123_2.html -> /123.html
  const m = url.match(/^(.*\/\d+)[_-]\d+(\.html?)$/i);
  if (m) return `${m[1]}${m[2]}`;
  return null;
}

/**
 * Check if nextUrl looks like a section/page URL relative to currentUrl.
 * E.g., /123.html -> /123_2.html or /123_2.html -> /123_3.html
 */
function isSectionLikeUrl(currentUrl: string, nextUrl: string): boolean {
  try {
    const current = new URL(currentUrl);
    const next = new URL(nextUrl);
    if (current.host !== next.host) return false;

    const currentPath = current.pathname;
    const nextPath = next.pathname;

    // Pattern 1: /123.html -> /123_2.html (first page to second page)
    const firstPageMatch = currentPath.match(/\/(\d+)\.html?$/i);
    const secondPageMatch = nextPath.match(/\/(\d+)[_-]2\.html?$/i);
    if (firstPageMatch && secondPageMatch && firstPageMatch[1] === secondPageMatch[1]) {
      return true;
    }

    // Pattern 2: /123_2.html -> /123_3.html (consecutive sections)
    const sectionMatch1 = currentPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
    const sectionMatch2 = nextPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
    if (sectionMatch1 && sectionMatch2 && sectionMatch1[1] === sectionMatch2[1]) {
      const s1 = parseInt(sectionMatch1[2], 10);
      const s2 = parseInt(sectionMatch2[2], 10);
      if (s2 === s1 + 1) return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function parseWithSectionMerge(
  parser: ReturnType<typeof getParser>,
  initialDoc: Document,
  url: string,
  referer?: string
): Promise<ParsedChapter | null> {
  const resolvedUrl = normalizeAbsoluteUrl(url, referer);

  // If user opens a later section page, normalize to the first page for stable TOC matching.
  const baseUrl = getSectionBaseUrl(resolvedUrl);
  let startUrl = resolvedUrl;
  let startDoc = initialDoc;
  if (baseUrl && baseUrl !== resolvedUrl) {
    const { promise } = fetchAndParseUrl(baseUrl, referer || resolvedUrl);
    const doc = await promise;
    if (doc) {
      startUrl = baseUrl;
      startDoc = doc;
    }
  }

  const first = await parser.parse(startDoc, startUrl);
  if (!first) return null;

  // Decide whether to attempt section merging: rule says so OR detection says current/next is section-like.
  // If rule explicitly sets noSection: true, skip all section merging (both rule-based and auto-detected).
  const disableByRule = !!first.rule?.advanced?.noSection;
  if (disableByRule) return first;

  const enableByRule = !!first.rule?.advanced?.checkSection;
  const detection = parser.detect(startDoc, startUrl);
  const section: SectionInfo = {
    isSection: !!detection.results.section?.isSection,
    nextSectionUrl: detection.results.section?.nextSectionUrl || null,
    nextChapterUrl: detection.results.section?.nextChapterUrl || null,
    confidence: detection.results.section?.confidence || 0,
  };

  const shouldMerge = enableByRule || (section.isSection && section.confidence >= 0.8);
  if (!shouldMerge) return first;

  let mergedContent = first.content;
  let mergedRaw = first.rawContent;
  let nextSectionUrl = section.nextSectionUrl;
  let nextChapterUrl = section.nextChapterUrl || null;
  let lastUrl = startUrl;

  // When rule enables checkSection but auto-detection didn't find nextSectionUrl,
  // check if first.nextUrl is a section URL (e.g., /123_2.html pattern).
  // This handles cases where rule selector picks "下一页" but auto-detection picks "下一章".
  if (enableByRule && !nextSectionUrl && first.nextUrl) {
    const isSectionUrl = isSectionLikeUrl(startUrl, first.nextUrl);
    if (isSectionUrl) {
      nextSectionUrl = first.nextUrl;
    }
  }

  // Best-effort: merge up to 10 pages to avoid infinite loops.
  const seen = new Set<string>([startUrl]);
  for (let i = 0; i < 10 && nextSectionUrl; i++) {
    const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
    if (seen.has(absNextSection)) break;
    seen.add(absNextSection);

    const { promise } = fetchAndParseUrl(absNextSection, lastUrl);
    const nextDoc = await promise;
    if (!nextDoc) break;

    const nextParsed = await parser.parse(nextDoc, absNextSection);
    if (!nextParsed) break;

    mergedContent = joinHtml(mergedContent, nextParsed.content);
    mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);

    const nextDet = parser.detect(nextDoc, absNextSection);
    const s = nextDet.results.section;
    if (s?.nextChapterUrl) nextChapterUrl = s.nextChapterUrl;

    // Prefer auto-detected nextSectionUrl, but fall back to rule-parsed nextUrl if it looks like a section
    nextSectionUrl = s?.nextSectionUrl || null;
    if (enableByRule && !nextSectionUrl && nextParsed.nextUrl) {
      if (isSectionLikeUrl(absNextSection, nextParsed.nextUrl)) {
        nextSectionUrl = nextParsed.nextUrl;
      } else {
        // nextParsed.nextUrl is not a section URL, treat it as next chapter
        if (!nextChapterUrl) nextChapterUrl = nextParsed.nextUrl;
      }
    }
    lastUrl = absNextSection;
  }

  // After merging, nextUrl should point to next *chapter*, not the next page.
  // Keep other fields from the first page (title/book/index/prev).
  return {
    ...first,
    url: startUrl,
    content: mergedContent,
    rawContent: mergedRaw,
    nextUrl: nextChapterUrl || first.nextUrl,
  };
}

/** Get GM_xmlhttpRequest function */
function getGmXhr(): typeof GM_xmlhttpRequest | null {
  if (typeof GM_xmlhttpRequest === 'function') {
    return GM_xmlhttpRequest;
  }
  return null;
}

/** Fetch URL and return parsed Document with abort handle */
function fetchAndParseUrl(
  url: string,
  referer?: string
): { promise: Promise<Document | null>; abort: () => void } {
  const gmXhr = getGmXhr();

  if (!gmXhr) {
    console.error('[MNR] GM_xmlhttpRequest not available');
    return { promise: Promise.resolve(null), abort: () => {} };
  }

  let request: GmXhrReturn | null = null;

  const promise = new Promise<Document | null>(resolve => {
    const headers: Record<string, string> = {
      Accept: 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    };
    if (referer) {
      headers['Referer'] = referer;
    }
    request = gmXhr({
      method: 'GET',
      url,
      headers,
      overrideMimeType: 'text/html;charset=' + document.characterSet,
      onload: response => {
        if (response.status >= 200 && response.status < 300) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            // Set base URL for relative links
            const base = doc.createElement('base');
            base.href = url;
            doc.head.insertBefore(base, doc.head.firstChild);
            // Store URL in a custom property (location may not be configurable)
            (doc as Document & { _mnrUrl: string })._mnrUrl = url;
            resolve(doc);
          } catch (e) {
            console.error('[MNR] Parse error:', e);
            resolve(null);
          }
        } else {
          console.error('[MNR] HTTP error:', response.status);
          resolve(null);
        }
      },
      onerror: err => {
        console.error('[MNR] Request error:', err);
        resolve(null);
      },
      onabort: () => {
        resolve(null);
      },
      ontimeout: () => {
        console.error('[MNR] Request timeout');
        resolve(null);
      },
    });
  });

  const abort = () => {
    try {
      request?.abort();
    } catch {
      // ignore
    }
  };

  return { promise, abort };
}

/**
 * Check if URL is invalid for chapter navigation (homepage, login, etc.)
 * This is a quick pre-fetch check to avoid loading non-chapter pages
 */
function isInvalidChapterUrl(url: string, currentChapterUrl?: string): boolean {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;

    // Homepage/root path
    if (pathname === '/' || pathname === '') {
      return true;
    }

    // Very short paths are likely not chapter pages
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      // Some sites use single-segment chapter URLs, e.g.:
      // - Faloo: /412421_1.html
      // - Others: /123.html
      // If it doesn't contain digits, it's very likely not a chapter.
      const part = pathParts[0] || '';
      if (!/\d/.test(part)) {
        return true;
      }
    }

    // Common non-chapter URL patterns
    const invalidPatterns = [
      /^https?:\/\/[^/]+\/?$/i, // Root domain
      /^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php)?$/i, // Homepage variants
      /\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)\/?/i,
      /\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i, // Book index without chapter
      /\/(?:list|catalog|toc|contents?)\.?(?:html?)?$/i,
      /\/(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(url) || pattern.test(pathname)) {
        return true;
      }
    }

    // If current chapter URL is provided, check URL structure similarity
    if (currentChapterUrl) {
      const currentParsed = new URL(currentChapterUrl);
      const currentParts = currentParsed.pathname.split('/').filter(Boolean);

      // If current URL has significantly more path depth, target is likely not a chapter
      // e.g., current: /chapter/123/456, target: /book/123 -> invalid
      if (currentParts.length >= 3 && pathParts.length < currentParts.length - 1) {
        return true;
      }

      // Different domain/host -> invalid
      if (parsed.host !== currentParsed.host) {
        return true;
      }
    }

    return false;
  } catch {
    // URL parsing failed
    return false;
  }
}

/**
 * Detect if content looks like a Table of Contents page
 * Uses multiple heuristics to identify TOC pages
 */
function detectTocPage(content: string, pageUrl: string, currentChapterUrl: string): boolean {
  // Heuristic 0: URL pattern suggests index/book page
  const tocUrlPatterns = [
    /\/book\/\d+\.html?$/i, // /book/123.htm
    /\/book\/\d+\/?$/i, // /book/123/ or /book/123
    /\/novel\/\d+\/?$/i, // /novel/123/
    /\/xiaoshuo\/\d+\/?$/i, // /xiaoshuo/123/
    /\/info\/\d+\.html?$/i, // /info/123.html
    /\/\d+\/index\.html?$/i, // /123/index.html
    /\/booklist/i, // /booklist
    /\/catalog/i, // /catalog
    /\/contents?\.html?$/i, // /content.html or /contents.html
    /\/list\.html?$/i, // /list.html
    /\/toc\.html?$/i, // /toc.html
  ];

  for (const pattern of tocUrlPatterns) {
    if (pattern.test(pageUrl)) {
      return true;
    }
  }

  // Heuristic 0.5: Compare URL structures - chapter URLs usually have different pattern than index
  try {
    const currentPath = new URL(currentChapterUrl).pathname;
    const pagePath = new URL(pageUrl).pathname;

    // If current chapter is like /txt/123/456 but page is like /book/123, it's likely TOC
    const chapterPattern = /\/(txt|read|chapter|article)\/\d+\/\d+/i;
    const bookPattern = /\/(book|novel|info|xiaoshuo)\/\d+/i;

    if (chapterPattern.test(currentPath) && bookPattern.test(pagePath)) {
      return true;
    }
  } catch {
    // URL parsing failed, continue with other checks
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const textContent = tempDiv.textContent || '';
  const textLength = textContent.length;
  const links = tempDiv.querySelectorAll('a');
  const linkCount = links.length;

  // Heuristic 1: Very short content with many links
  if (textLength < 500 && linkCount > 10) {
    return true;
  }

  // Heuristic 2: High link-to-text ratio (TOC pages are mostly links)
  const linkTextLength = Array.from(links).reduce(
    (sum, a) => sum + (a.textContent?.length || 0),
    0
  );
  const linkRatio = textLength > 0 ? linkTextLength / textLength : 0;
  if (linkRatio > 0.6 && linkCount > 8) {
    return true;
  }

  // Heuristic 3: Many links pointing to chapter-like URLs
  const chapterLinkPattern = /\/(chapter|txt|read|book|novel|article)\/|\d+\.html?$/i;
  const chapterLinks = Array.from(links).filter(a => {
    const href = a.getAttribute('href') || '';
    return chapterLinkPattern.test(href);
  });
  if (chapterLinks.length > 10) {
    return true;
  }

  // Heuristic 4: Contains link to the current chapter (we're on a page listing chapters)
  const normalizeUrl = (url: string) => {
    try {
      const u = new URL(url, pageUrl);
      return u.pathname.replace(/\/$/, '');
    } catch {
      return url.replace(/\/$/, '');
    }
  };
  const currentPath = normalizeUrl(currentChapterUrl);
  const hasLinkToCurrentChapter = Array.from(links).some(a => {
    const href = a.getAttribute('href');
    if (!href) return false;
    return normalizeUrl(href) === currentPath;
  });
  if (hasLinkToCurrentChapter && linkCount > 5) {
    return true;
  }

  // Heuristic 5: Title/content contains TOC-related keywords
  const tocKeywords = [
    '目录',
    '章节列表',
    '章节目录',
    '全部章节',
    '最新章节',
    '小说目录',
    'table of contents',
    'toc',
    'catalog',
    'index',
  ];
  const pageText = textContent.toLowerCase();
  const keywordMatches = tocKeywords.filter(kw => pageText.includes(kw.toLowerCase()));
  if (keywordMatches.length >= 2 || (keywordMatches.length >= 1 && linkCount > 15)) {
    return true;
  }

  // Heuristic 6: Content is structured like a list (many similar short links)
  const linkTexts = Array.from(links)
    .map(a => a.textContent?.trim() || '')
    .filter(t => t.length > 0);
  const chapterNamePattern = /^第.{1,10}[章节回话篇集卷]/;
  const chapterNameLinks = linkTexts.filter(t => chapterNamePattern.test(t));
  if (chapterNameLinks.length > 5) {
    return true;
  }

  return false;
}
