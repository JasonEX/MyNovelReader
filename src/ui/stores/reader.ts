/**
 * Reader Store - Manages reading state with infinite scroll support
 */

import { computed, ref } from 'vue';
import { type ConversionMode, convertHTML, convertText } from '@/core/converter';
import { getParser, type ParsedChapter } from '@/core/parser';
import { defineStore } from 'pinia';
import { fetchAndParseUrl } from '@/core/utils/network';
import { isCloudflareChallenge } from '@/core/protection';
import type { SiteRule } from '@/core/rules/types';

// Import types from modular files
import type {
  CachedChapter,
  CacheProgressState,
  ChapterEntry,
  LoadSource,
  PersistedBookCache,
  ReadingProgress,
  TocEntry,
  TocEntryWithStatus,
} from './reader/types';
import {
  MAX_CACHED_CHAPTERS,
  MAX_NAV_FAILURES,
  MAX_SESSION_CACHE,
  VIP_BLOCK_TOAST,
} from './reader/types';

// Import utilities from modular files
import { detectTocPage, isInvalidChapterUrl, isVipChapterPage } from './reader/detection';
import { normalizeUrl, normalizeUrlForBlock, normalizeUrlForFetch } from './reader/utils';
import { trimCachedContents, trimNavFailures } from './reader/trim';
import { loadTocEntriesPaged } from './reader/toc';
import { parseWithSectionMerge } from './reader/section';

// Re-export types for backward compatibility
export type {
  CachedChapter,
  CacheProgressState,
  ChapterEntry,
  ReadingProgress,
  TocEntry,
  TocEntryWithStatus,
};

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
  // VIP/locked chapters should not be loaded when paging
  const vipBlockedUrls = ref<Set<string>>(new Set());
  // URLs that were determined to be non-chapter for navigation (e.g. TOC, invalid links)
  const blockedNavUrls = ref<Set<string>>(new Set());
  const originalContents = ref<Map<string, string>>(new Map()); // id -> original HTML
  const originalTitles = ref<Map<string, { title: string; bookTitle?: string }>>(new Map());
  const currentConversionMode = ref<ConversionMode>('none');
  const pendingNextAbort = ref<(() => void) | null>(null);
  const pendingPrevAbort = ref<(() => void) | null>(null);
  const navFailures = new Map<string, { count: number; nextRetryAt: number }>();
  const cacheProgress = ref<CacheProgressState>({ done: 0, total: 0, running: false });
  const cacheQueue = ref<string[]>([]);
  const cacheAbort = ref<(() => void) | null>(null);
  const reloadAbort = ref<(() => void) | null>(null);

  // Table of contents state
  const toc = ref<TocEntry[]>([]);
  const tocOriginal = ref<TocEntry[]>([]);
  const tocLoading = ref(false);
  const tocAbort = ref<(() => void) | null>(null);

  let sessionId = 0;
  let viewId = 0;
  const bumpSession = (): number => {
    sessionId += 1;
    viewId += 1;
    return sessionId;
  };
  const bumpView = (): number => {
    viewId += 1;
    return viewId;
  };
  const isSessionStale = (runId: number): boolean => runId !== sessionId;
  const isViewStale = (runId: number): boolean => runId !== viewId;

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

  function isVipBlockedUrl(url: string): boolean {
    return vipBlockedUrls.value.has(normalizeUrlForBlock(url));
  }

  function getVipBlockedToast(direction: 'next' | 'prev'): string | null {
    const entry =
      direction === 'next' ? chapters.value[chapters.value.length - 1] : chapters.value[0];
    const navUrl = direction === 'next' ? entry?.chapter.nextUrl : entry?.chapter.prevUrl;
    if (!navUrl) return null;
    return isVipBlockedUrl(navUrl) ? VIP_BLOCK_TOAST : null;
  }

  const hasNext = computed(() => {
    const lastChapter = chapters.value[chapters.value.length - 1];
    const nextUrl = lastChapter?.chapter.nextUrl;
    if (!nextUrl) return false;
    if (blockedNavUrls.value.has(normalizeUrlForBlock(nextUrl))) return false;
    return !isVipBlockedUrl(nextUrl);
  });
  const hasPrev = computed(() => {
    const firstChapter = chapters.value[0];
    const prevUrl = firstChapter?.chapter.prevUrl;
    if (!prevUrl) return false;
    if (blockedNavUrls.value.has(normalizeUrlForBlock(prevUrl))) return false;
    return !isVipBlockedUrl(prevUrl);
  });
  const hasIndex = computed(() => !!chapter.value?.indexUrl);
  const confidence = computed(() => chapter.value?.confidence || 0);
  const method = computed(() => chapter.value?.method || 'detection');

  // TOC with cache status for UI
  const tocWithStatus = computed<TocEntryWithStatus[]>(() => {
    const currentUrl = chapter.value?.url;
    return toc.value.map(entry => {
      const url = normalizeUrlForFetch(entry.url);
      return {
        ...entry,
        url,
        isCached:
          loadedUrls.value.has(url) ||
          cachedContents.value.has(url) ||
          persistedUrls.value.has(url),
        isPersisted: persistedUrls.value.has(url),
        isCurrent: url === currentUrl,
      };
    });
  });

  // Current chapter URL for external reference
  const currentChapterUrl = computed(() => chapter.value?.url || '');

  // Actions
  function activate() {
    isActive.value = true;
    error.value = null;
  }

  function deactivate() {
    bumpSession();
    isActive.value = false;
    pendingNextAbort.value?.();
    pendingNextAbort.value = null;
    pendingPrevAbort.value?.();
    pendingPrevAbort.value = null;
    cacheAbort.value?.();
    cacheAbort.value = null;
    reloadAbort.value?.();
    reloadAbort.value = null;
    tocAbort.value?.();
    tocAbort.value = null;

    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;
    tocLoading.value = false;
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];

    chapters.value = [];
    currentChapterIndex.value = 0;
    error.value = null;
    loadedUrls.value.clear();
    vipBlockedUrls.value.clear();
    blockedNavUrls.value.clear();
    navFailures.clear();
    originalContents.value.clear();
    originalTitles.value.clear();
    cachedContents.value.clear();
    persistedUrls.value.clear();
    toc.value = [];
    tocOriginal.value = [];
  }

  function setChapter(newChapter: ParsedChapter, newRule?: SiteRule) {
    bumpSession();
    pendingNextAbort.value?.();
    pendingNextAbort.value = null;
    pendingPrevAbort.value?.();
    pendingPrevAbort.value = null;
    cacheAbort.value?.();
    cacheAbort.value = null;
    reloadAbort.value?.();
    reloadAbort.value = null;
    tocAbort.value?.();
    tocAbort.value = null;

    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;
    tocLoading.value = false;
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];
    toc.value = [];
    tocOriginal.value = [];

    // Canonicalize URLs (strip hashes etc.) to stabilize caching and navigation.
    if (newChapter.url) {
      newChapter.url = normalizeUrlForFetch(newChapter.url);
    }
    if (newChapter.prevUrl) {
      newChapter.prevUrl = normalizeUrlForFetch(newChapter.prevUrl);
    }
    if (newChapter.nextUrl) {
      newChapter.nextUrl = normalizeUrlForFetch(newChapter.nextUrl);
    }
    if (newChapter.indexUrl) {
      newChapter.indexUrl = normalizeUrlForFetch(newChapter.indexUrl);
    }

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
    error.value = null;
    loadedUrls.value.clear();
    loadedUrls.value.add(newChapter.url);
    vipBlockedUrls.value.clear();
    blockedNavUrls.value.clear();
    navFailures.clear();
    cachedContents.value.clear();
    persistedUrls.value.clear();

    // Store original content for text conversion
    originalContents.value.clear();
    originalContents.value.set(id, newChapter.content);
    originalTitles.value.clear();
    originalTitles.value.set(id, { title: newChapter.title, bookTitle: newChapter.bookTitle });

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

    if (currentConversionMode.value !== 'none') {
      void applyConversionToChapterEntry(id, currentConversionMode.value);
    }

    // Restore persisted cache for this book (async, don't block)
    void restoreCache();
  }

  /** Helper: Insert a chapter from cache to chapters list */
  async function insertCachedChapter(
    cached: CachedChapter,
    position: 'append' | 'prepend'
  ): Promise<boolean> {
    const suffix = position === 'append' ? 'cached' : 'cached-prev';
    const id = `chapter-${Date.now()}-${suffix}-${chapters.value.length}`;
    const entry = {
      chapter: { ...cached.chapter },
      rule: cached.rule,
      id,
    };

    if (position === 'append') {
      chapters.value.push(entry);
    } else {
      chapters.value.unshift(entry);
      currentChapterIndex.value++;
    }
    loadedUrls.value.add(entry.chapter.url);

    // Store original content for text conversion
    originalContents.value.set(id, cached.chapter.content);
    originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle,
    });

    if (currentConversionMode.value !== 'none') {
      await applyConversionToChapterEntry(id, currentConversionMode.value);
    }

    // Trim cached chapters to limit memory
    if (chapters.value.length > MAX_CACHED_CHAPTERS) {
      if (position === 'append' && currentChapterIndex.value > 2) {
        // Trim from beginning when appending
        const removed = chapters.value.shift();
        if (removed) {
          loadedUrls.value.delete(removed.chapter.url);
          originalContents.value.delete(removed.id);
          originalTitles.value.delete(removed.id);
          currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
        }
      } else if (position === 'prepend') {
        // Trim from end when prepending
        const removed = chapters.value.pop();
        if (removed) {
          loadedUrls.value.delete(removed.chapter.url);
          originalContents.value.delete(removed.id);
          originalTitles.value.delete(removed.id);
        }
      }
    }

    return true;
  }

  /** Unified chapter loading function */
  async function loadChapter(direction: 'next' | 'prev', source: LoadSource): Promise<boolean> {
    const runId = viewId;
    const isNext = direction === 'next';
    const refChapter = isNext ? chapters.value[chapters.value.length - 1] : chapters.value[0];
    const isLoadingRef = isNext ? isLoadingNext : isLoadingPrev;
    const pendingAbortRef = isNext ? pendingNextAbort : pendingPrevAbort;
    const endMessage = isNext ? '已经是最后一章了' : '已经是第一章了';
    const errorMessage = isNext ? '加载下一章失败' : '加载上一章失败';

    if (isLoadingRef.value) {
      return false;
    }

    const rawTargetUrl = isNext ? refChapter?.chapter.nextUrl : refChapter?.chapter.prevUrl;
    if (!rawTargetUrl) {
      if (source === 'manual') {
        showToast(endMessage, 'info');
      }
      return false;
    }

    const targetUrl = normalizeUrlForFetch(rawTargetUrl);
    if (targetUrl !== rawTargetUrl) {
      if (isNext) {
        refChapter.chapter.nextUrl = targetUrl;
      } else {
        refChapter.chapter.prevUrl = targetUrl;
      }
    }

    // Don't load if targetUrl is the index/TOC page
    if (
      refChapter.chapter.indexUrl &&
      normalizeUrl(targetUrl) === normalizeUrl(refChapter.chapter.indexUrl)
    ) {
      blockedNavUrls.value.add(normalizeUrlForBlock(targetUrl));
      if (source === 'manual') {
        showToast(endMessage, 'info');
      }
      return false;
    }

    // Don't load VIP chapters (cached for this session)
    if (vipBlockedUrls.value.has(normalizeUrlForBlock(targetUrl))) {
      showToast(VIP_BLOCK_TOAST, 'info', 3000);
      return false;
    }

    const navKey = normalizeUrlForBlock(targetUrl);
    if (blockedNavUrls.value.has(navKey)) {
      if (source === 'manual') {
        showToast(endMessage, 'info');
      }
      return false;
    }

    const failure = navFailures.get(navKey);
    if (failure && Date.now() < failure.nextRetryAt) {
      if (source === 'manual') {
        showToast('加载失败过于频繁，请稍后重试', 'info', 2000);
      }
      return false;
    }

    if (loadedUrls.value.has(targetUrl)) {
      return false;
    }

    // Prefer cached content if available (avoid refetching on race/abort failures).
    const cached = cachedContents.value.get(targetUrl);
    if (cached) {
      return insertCachedChapter(cached, isNext ? 'append' : 'prepend');
    }
    if (persistedUrls.value.has(targetUrl)) {
      const persisted = await getPersistedCachedChapter(targetUrl);
      if (isViewStale(runId)) return false;
      if (persisted) {
        const sessionCached: CachedChapter = { ...persisted, cachedAt: Date.now() };
        cachedContents.value.set(targetUrl, sessionCached);
        trimCachedContents(cachedContents.value, MAX_SESSION_CACHE);
        return insertCachedChapter(sessionCached, isNext ? 'append' : 'prepend');
      }
    }

    isLoadingRef.value = true;

    // Cancel in-flight request
    if (pendingAbortRef.value) {
      pendingAbortRef.value();
      pendingAbortRef.value = null;
    }

    // Pre-fetch validation: check if URL looks like a valid chapter page
    if (isInvalidChapterUrl(targetUrl, refChapter.chapter.url)) {
      isLoadingRef.value = false;
      blockedNavUrls.value.add(navKey);
      if (source === 'manual') {
        showToast(endMessage, 'info');
      }
      return false;
    }

    try {
      const referer = refChapter.chapter.url;
      const { promise, abort } = fetchAndParseUrl(targetUrl, referer);
      if (isViewStale(runId)) {
        abort();
        return false;
      }
      pendingAbortRef.value = abort;

      const result = await promise;
      if (isViewStale(runId)) {
        abort();
        return false;
      }
      pendingAbortRef.value = null;
      if (result.error === 'abort') {
        return false;
      }
      if (!result.doc) {
        const prev = navFailures.get(navKey);
        const count = (prev?.count || 0) + 1;
        const backoffMs = Math.min(1500 * Math.pow(2, count - 1), 30000);
        navFailures.set(navKey, { count, nextRetryAt: Date.now() + backoffMs });
        trimNavFailures(navFailures, MAX_NAV_FAILURES);
        if (source === 'manual' || count === 1) {
          showToast(errorMessage, 'error', 2500);
        }
        return false;
      }

      // Cloudflare challenge page: the actual chapter was not returned.
      // Treat as a transient failure so the backoff/retry mechanism kicks in.
      if (isCloudflareChallenge(result.doc)) {
        const prev = navFailures.get(navKey);
        const count = (prev?.count || 0) + 1;
        const backoffMs = Math.min(1500 * Math.pow(2, count - 1), 30000);
        navFailures.set(navKey, { count, nextRetryAt: Date.now() + backoffMs });
        trimNavFailures(navFailures, MAX_NAV_FAILURES);
        if (source === 'manual' || count === 1) {
          showToast('Cloudflare 验证页面，请在新标签页中完成验证后重试', 'info', 4000);
        }
        return false;
      }

      // VIP page detection: do not parse / load, just toast and block it for this session
      if (isVipChapterPage(result.doc)) {
        vipBlockedUrls.value.add(normalizeUrlForBlock(targetUrl));
        showToast(VIP_BLOCK_TOAST, 'info', 3000);
        return false;
      }

      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, result.doc, targetUrl, referer);
      if (isViewStale(runId)) {
        return false;
      }
      if (!parsed) {
        const prev = navFailures.get(navKey);
        const count = (prev?.count || 0) + 1;
        const backoffMs = Math.min(1500 * Math.pow(2, count - 1), 30000);
        navFailures.set(navKey, { count, nextRetryAt: Date.now() + backoffMs });
        trimNavFailures(navFailures, MAX_NAV_FAILURES);
        if (source === 'manual' || count === 1) {
          showToast(errorMessage, 'error', 2500);
        }
        return false;
      }

      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

      // Check if this is a TOC page
      const isTocPage = detectTocPage(parsed.content, targetUrl, refChapter.chapter.url);
      if (isTocPage) {
        blockedNavUrls.value.add(navKey);
        if (source === 'manual') {
          showToast(endMessage, 'info');
        }
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
          blockedNavUrls.value.add(navKey);
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
      navFailures.delete(navKey);
      loadedUrls.value.add(parsed.url);

      // Store original content for text conversion
      originalContents.value.set(id, parsed.content);
      originalTitles.value.set(id, { title: parsed.title, bookTitle: parsed.bookTitle });

      // Also store in cachedContents for quick jump
      cachedContents.value.set(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      // Trim in-memory session cache (LRU) to keep memory bounded.
      trimCachedContents(cachedContents.value, MAX_SESSION_CACHE);

      // Apply current conversion mode if active
      if (currentConversionMode.value !== 'none') {
        await applyConversionToChapterEntry(id, currentConversionMode.value);
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
            originalTitles.value.delete(removed.id);
            currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
          }
        } else if (!isNext) {
          const removed = chapters.value.pop();
          if (removed) {
            loadedUrls.value.delete(removed.chapter.url);
            originalContents.value.delete(removed.id);
            originalTitles.value.delete(removed.id);
          }
        }
      }

      return true;
    } catch (e) {
      if (!isViewStale(runId)) {
        console.error(`[MNR] Failed to load ${direction} chapter:`, e);
        setError(errorMessage);
      }
      return false;
    } finally {
      if (!isViewStale(runId)) {
        isLoadingRef.value = false;
      }
    }
  }

  /** Load next chapter and append to list */
  async function loadNextChapter(source: LoadSource = 'auto'): Promise<boolean> {
    return loadChapter('next', source);
  }

  /** Load previous chapter and prepend to list */
  async function loadPrevChapter(source: LoadSource = 'manual'): Promise<boolean> {
    return loadChapter('prev', source);
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

  async function applyConversionToChapterEntry(
    entryId: string,
    mode: ConversionMode
  ): Promise<void> {
    const entry = chapters.value.find(e => e.id === entryId);
    if (!entry) return;

    const originalContent = originalContents.value.get(entryId);
    const originalTitle = originalTitles.value.get(entryId);
    const updates: Partial<ParsedChapter> = {};

    if (mode === 'none') {
      if (originalContent && entry.chapter.content !== originalContent) {
        updates.content = originalContent;
      }
      if (originalTitle) {
        updates.title = originalTitle.title;
        updates.bookTitle = originalTitle.bookTitle;
      }
    } else {
      if (originalContent) {
        updates.content = await convertHTML(originalContent, mode);
      }
      if (originalTitle) {
        updates.title = await convertText(originalTitle.title, mode);
        updates.bookTitle = originalTitle.bookTitle
          ? await convertText(originalTitle.bookTitle, mode)
          : originalTitle.bookTitle;
      }
    }

    if (Object.keys(updates).length > 0) {
      entry.chapter = { ...entry.chapter, ...updates };
    }
  }

  async function applyTocConversion(mode: ConversionMode): Promise<void> {
    if (tocOriginal.value.length === 0) {
      toc.value = [];
      return;
    }

    if (mode === 'none') {
      toc.value = [...tocOriginal.value];
      return;
    }

    const converted = await Promise.all(
      tocOriginal.value.map(async entry => ({
        ...entry,
        title: await convertText(entry.title, mode),
      }))
    );
    toc.value = converted;
  }

  /** Apply text conversion to all chapters */
  async function applyTextConversion(mode: ConversionMode): Promise<void> {
    currentConversionMode.value = mode;

    for (const entry of chapters.value) {
      await applyConversionToChapterEntry(entry.id, mode);
    }

    await applyTocConversion(mode);
  }

  /**
   * Batch cache chapters (best-effort, sequential)
   * Persists chapters to storage (best-effort); in-memory cache is LRU-capped.
   */
  async function startCacheAll(urls?: string[]): Promise<void> {
    const runId = sessionId;
    if (cacheProgress.value.running) return;

    const seenUrls = new Set<string>();

    // Ensure we have the latest persistedUrls before building the task list.
    await restoreCache();
    if (isSessionStale(runId)) return;
    const persistedSet = new Set(persistedUrls.value);
    const cacheBook = getCurrentBookCacheKey();

    let taskList = urls ? [...urls] : []; // No limit
    cacheQueue.value = [...taskList];

    // 目录列表：current.indexUrl -> 解析出章节列表，缓存全本
    if (!taskList.length) {
      const indexUrl = chapter.value?.indexUrl;
      const currentUrl = chapter.value?.url;
      if (indexUrl) {
        const tocEntries = await loadTocEntriesPaged(
          indexUrl,
          currentUrl || indexUrl,
          rule.value ?? undefined,
          abort => {
            if (!isSessionStale(runId)) {
              cacheAbort.value = abort;
            }
          }
        );
        if (isSessionStale(runId)) return;
        cacheAbort.value = null;

        const tocLinks = tocEntries.map(e => normalizeUrlForFetch(e.url)).slice(0, 10000);
        // Cache entire book, filter already cached/persisted
        taskList = tocLinks.filter(
          u => !loadedUrls.value.has(u) && !cachedContents.value.has(u) && !persistedSet.has(u)
        );
        cacheQueue.value = [...taskList];
      }
    }

    // Total is actual list length
    const estimatedTotal = taskList.length;
    if (isSessionStale(runId)) return;
    if (estimatedTotal === 0) {
      cacheProgress.value = { done: 0, total: 0, running: false };
      return;
    }
    cacheProgress.value = { done: 0, total: estimatedTotal, running: true };

    let nextUrl: string | undefined | null = taskList.shift();
    let referer = chapters.value[chapters.value.length - 1]?.chapter.url || chapter.value?.url;

    while (cacheProgress.value.running && nextUrl) {
      const targetUrl = normalizeUrlForFetch(nextUrl);

      // 去重 - check loadedUrls, session cache, and persisted cache
      if (
        seenUrls.has(targetUrl) ||
        loadedUrls.value.has(targetUrl) ||
        cachedContents.value.has(targetUrl) ||
        persistedSet.has(targetUrl)
      ) {
        cacheProgress.value = { ...cacheProgress.value, done: cacheProgress.value.done + 1 };
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      const { promise, abort } = fetchAndParseUrl(targetUrl, referer);
      if (isSessionStale(runId)) {
        abort();
        break;
      }
      cacheAbort.value = abort;
      const result = await promise;
      if (isSessionStale(runId)) {
        abort();
        break;
      }
      cacheAbort.value = null;
      if (result.error === 'abort') {
        break;
      }
      if (!result.doc) {
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, result.doc, targetUrl, referer);
      if (isSessionStale(runId)) {
        break;
      }
      if (!parsed) {
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      // Store in cachedContents (not chapters - for memory efficiency)
      const cached: CachedChapter = {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      };
      cachedContents.value.set(parsed.url, cached);
      seenUrls.add(parsed.url);

      // Trim session cache (LRU) to avoid unbounded memory usage during cache-all.
      trimCachedContents(cachedContents.value, MAX_SESSION_CACHE);

      // Persist chapter (best-effort) while caching to avoid holding everything in memory.
      if (cacheBook) {
        const persisted = persistCachedChapter(cacheBook, parsed.url, cached);
        if (persisted) {
          persistedSet.add(parsed.url);
        }
      }

      // Mark as loaded for deduplication
      cacheProgress.value = { ...cacheProgress.value, done: cacheProgress.value.done + 1 };

      // 下一章 URL 优先：显式队列 > 检测器返回 nextUrl（分页合并后 nextUrl 已指向下一章）
      referer = parsed.url;
      nextUrl = taskList.shift() ?? (parsed.nextUrl ? normalizeUrlForFetch(parsed.nextUrl) : null);

      // If following nextUrl chain, update total estimate
      if (taskList.length === 0 && nextUrl) {
        const normalizedNext = normalizeUrlForFetch(nextUrl);
        if (
          !seenUrls.has(normalizedNext) &&
          !loadedUrls.value.has(normalizedNext) &&
          !cachedContents.value.has(normalizedNext) &&
          !persistedSet.has(normalizedNext)
        ) {
          cacheProgress.value = { ...cacheProgress.value, total: cacheProgress.value.done + 1 };
        }
      }
    }

    if (isSessionStale(runId)) return;
    // Final total update
    cacheProgress.value = {
      ...cacheProgress.value,
      total: cacheProgress.value.done,
      running: false,
    };
    cacheAbort.value = null;

    // Persist cache after completion
    if (cacheBook && persistedSet.size > 0) {
      persistedUrls.value = persistedSet;
    }
    await persistCache();
  }

  function cancelCacheAll(): void {
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];
    cacheAbort.value?.();
    cacheAbort.value = null;
  }

  /**
   * Load table of contents from index URL
   */
  async function setTocEntries(entries: TocEntry[]): Promise<void> {
    tocOriginal.value = entries;
    await applyTocConversion(currentConversionMode.value);
  }

  async function ensureIndexUrl(): Promise<string | undefined> {
    const current = chapter.value;
    const currentUrl = current?.url || '';
    const existing = current?.indexUrl;

    // If we already have an indexUrl and it doesn't look like the current chapter URL, keep it.
    if (
      existing &&
      (!currentUrl || normalizeUrlForBlock(existing) !== normalizeUrlForBlock(currentUrl))
    ) {
      return existing;
    }

    if (!currentUrl) return undefined;

    try {
      const parser = getParser();
      const detected = parser.detect(document, currentUrl).results.navigation.index?.url;
      if (!detected) return undefined;

      const normalized = normalizeUrlForFetch(detected);
      for (const entry of chapters.value) {
        const existingIndex = entry.chapter.indexUrl;
        const entryUrl = entry.chapter.url;
        const looksLikeSelf =
          existingIndex && entryUrl
            ? normalizeUrlForBlock(existingIndex) === normalizeUrlForBlock(entryUrl)
            : false;
        if (!existingIndex || looksLikeSelf) {
          entry.chapter.indexUrl = normalized;
        }
      }
      return normalized;
    } catch (e) {
      console.error('[MNR] Failed to detect indexUrl:', e);
      return undefined;
    }
  }

  async function loadToc(): Promise<void> {
    const runId = sessionId;
    if (toc.value.length > 0 || tocLoading.value) return;

    const currentUrl = chapter.value?.url || '';
    let indexUrl = chapter.value?.indexUrl;
    if (
      !indexUrl ||
      (currentUrl && normalizeUrlForBlock(indexUrl) === normalizeUrlForBlock(currentUrl))
    ) {
      indexUrl = (await ensureIndexUrl()) || undefined;
    }
    if (!indexUrl) {
      showToast('未检测到目录链接', 'info', 2500);
      return;
    }

    tocLoading.value = true;

    try {
      let entries = await loadTocEntriesPaged(
        indexUrl,
        currentUrl || indexUrl,
        rule.value ?? undefined,
        abort => {
          if (!isSessionStale(runId)) {
            tocAbort.value = abort;
          }
        }
      );
      if (isSessionStale(runId)) return;
      if (entries.length === 0) {
        // Retry once for transient request failures / slow dynamic pages.
        await new Promise<void>(resolve => window.setTimeout(resolve, 400));
        if (isSessionStale(runId)) return;
        entries = await loadTocEntriesPaged(
          indexUrl,
          currentUrl || indexUrl,
          rule.value ?? undefined,
          abort => {
            if (!isSessionStale(runId)) {
              tocAbort.value = abort;
            }
          }
        );
        if (isSessionStale(runId)) return;
      }
      await setTocEntries(entries);
      if (isSessionStale(runId)) return;
      if (entries.length === 0) {
        showToast('目录解析为空，可稍后重试或刷新页面', 'info', 2500);
      }
    } catch (e) {
      if (!isSessionStale(runId)) {
        console.error('[MNR] Failed to load TOC:', e);
        showToast('目录加载失败，可稍后重试', 'error', 2500);
      }
    } finally {
      if (!isSessionStale(runId)) {
        tocLoading.value = false;
        tocAbort.value = null;
      }
    }
  }

  function $reset() {
    bumpSession();
    isActive.value = false;
    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;
    pendingNextAbort.value?.();
    pendingNextAbort.value = null;
    pendingPrevAbort.value?.();
    pendingPrevAbort.value = null;
    reloadAbort.value?.();
    reloadAbort.value = null;
    chapters.value = [];
    currentChapterIndex.value = 0;
    error.value = null;
    scrollPercent.value = 0;
    loadedUrls.value.clear();
    vipBlockedUrls.value.clear();
    originalContents.value.clear();
    originalTitles.value.clear();
    blockedNavUrls.value.clear();
    navFailures.clear();
    cachedContents.value.clear();
    persistedUrls.value.clear();
    currentConversionMode.value = 'none';
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];
    cacheAbort.value?.();
    cacheAbort.value = null;
    // Reset TOC state
    toc.value = [];
    tocOriginal.value = [];
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
    const runId = bumpView();
    const url = normalizeUrlForFetch(targetUrl);
    pendingNextAbort.value?.();
    pendingNextAbort.value = null;
    pendingPrevAbort.value?.();
    pendingPrevAbort.value = null;
    reloadAbort.value?.();
    reloadAbort.value = null;
    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;

    // Check cachedContents first
    let cached = cachedContents.value.get(url);
    if (!cached && persistedUrls.value.has(url)) {
      const persisted = await getPersistedCachedChapter(url);
      if (isViewStale(runId)) return false;
      if (persisted) {
        cached = { ...persisted, cachedAt: Date.now() };
        cachedContents.value.set(url, cached);
        trimCachedContents(cachedContents.value, MAX_SESSION_CACHE);
      }
    }
    if (!cached) return false;
    if (isViewStale(runId)) return false;

    // Clear current chapters
    chapters.value = [];
    currentChapterIndex.value = 0;
    loadedUrls.value.clear();
    originalContents.value.clear();
    originalTitles.value.clear();

    // Add target chapter
    const id = `chapter-${Date.now()}-jump-0`;
    chapters.value.push({
      chapter: { ...cached.chapter },
      rule: cached.rule,
      id,
    });
    loadedUrls.value.add(url);

    // Store original content
    originalContents.value.set(id, cached.chapter.content);
    originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle,
    });

    // Apply current conversion mode if needed
    if (currentConversionMode.value !== 'none') {
      await applyConversionToChapterEntry(id, currentConversionMode.value);
    }

    return true;
  }

  /**
   * Reload current chapter - refetch and reparse with current rules
   * Used after rule updates to apply changes immediately
   */
  async function reloadCurrentChapter(): Promise<void> {
    const runId = viewId;
    const current = chapters.value[currentChapterIndex.value];
    if (!current) return;

    const url = current.chapter.url;

    showToast('正在重新加载...', 'info');

    // Refetch the page
    reloadAbort.value?.();
    reloadAbort.value = null;
    const { promise, abort } = fetchAndParseUrl(url, url);
    if (!isViewStale(runId)) {
      reloadAbort.value = abort;
    }
    const result = await promise;
    if (isViewStale(runId)) {
      abort();
      return;
    }
    if (reloadAbort.value === abort) {
      reloadAbort.value = null;
    }
    if (result.error === 'abort') {
      return;
    }
    if (!result.doc) {
      showToast('重新加载失败', 'error');
      return;
    }

    // Parse with new rules (will pick up updated rules from RuleManager)
    const parser = getParser();
    const parsed = await parseWithSectionMerge(parser, result.doc, url, url);
    if (isViewStale(runId)) {
      return;
    }

    if (parsed) {
      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

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

  type CacheBookKey = {
    bookId: string;
    indexUrl: string;
  };

  type PersistedBookCacheV2Index = {
    version: 2;
    bookId: string;
    indexUrl: string;
    urls: string[];
    lastUpdated: number;
  };

  function encodeBase64UrlUtf8(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function parseStoredJson<T>(stored: unknown): T | null {
    if (stored === null || stored === undefined) return null;
    if (typeof stored === 'string') {
      try {
        return JSON.parse(stored) as T;
      } catch {
        return null;
      }
    }
    if (typeof stored === 'object') {
      return stored as T;
    }
    return null;
  }

  function getCacheV1Key(bookId: string): string {
    return `mnr_cache_${bookId}`;
  }

  function getCacheV2IndexKey(bookId: string): string {
    return `mnr_cache_v2_index_${bookId}`;
  }

  function getCacheV2ChapterKey(bookId: string, url: string): string {
    return `mnr_cache_v2_chapter_${bookId}_${encodeBase64UrlUtf8(url)}`;
  }

  function getCurrentBookCacheKey(): CacheBookKey | null {
    const indexUrl = chapter.value?.indexUrl;
    if (!indexUrl) return null;
    return { bookId: generateBookId(indexUrl), indexUrl };
  }

  function persistCachedChapter(
    cacheBook: CacheBookKey,
    url: string,
    cached: CachedChapter
  ): boolean {
    if (typeof GM_setValue === 'undefined') return false;
    try {
      GM_setValue(getCacheV2ChapterKey(cacheBook.bookId, url), JSON.stringify(cached));
      return true;
    } catch (e) {
      console.error('[MNR] Failed to persist cached chapter:', e);
      return false;
    }
  }

  async function getPersistedCachedChapter(url: string): Promise<CachedChapter | null> {
    const cacheBook = getCurrentBookCacheKey();
    if (!cacheBook) return null;
    if (typeof GM_getValue === 'undefined') return null;

    try {
      const storedV2 = GM_getValue<unknown>(getCacheV2ChapterKey(cacheBook.bookId, url), null);
      const cachedV2 = parseStoredJson<CachedChapter>(storedV2);
      if (cachedV2?.chapter?.url) {
        return cachedV2;
      }

      const storedV1 = GM_getValue<unknown>(getCacheV1Key(cacheBook.bookId), null);
      const dataV1 = parseStoredJson<PersistedBookCache>(storedV1);
      const cachedV1 = dataV1?.chapters?.[url];
      if (cachedV1?.chapter?.url) {
        return cachedV1;
      }
    } catch (e) {
      console.error('[MNR] Failed to load persisted chapter:', e);
    }
    return null;
  }

  /**
   * Persist cache to GM storage
   */
  async function persistCache(): Promise<void> {
    const runId = sessionId;
    const cacheBook = getCurrentBookCacheKey();
    if (!cacheBook) return;
    if (typeof GM_setValue === 'undefined') return;

    const persistedSet = new Set(persistedUrls.value);
    for (const [url, cached] of cachedContents.value) {
      const persisted = persistCachedChapter(cacheBook, url, cached);
      if (persisted) {
        persistedSet.add(url);
      }
    }
    if (persistedSet.size === 0) return;

    const indexData: PersistedBookCacheV2Index = {
      version: 2,
      bookId: cacheBook.bookId,
      indexUrl: cacheBook.indexUrl,
      urls: Array.from(persistedSet),
      lastUpdated: Date.now(),
    };

    try {
      GM_setValue(getCacheV2IndexKey(cacheBook.bookId), JSON.stringify(indexData));
      if (isSessionStale(runId)) return;
      persistedUrls.value = persistedSet;
    } catch (e) {
      console.error('[MNR] Failed to persist cache index:', e);
    }
  }

  /**
   * Restore cache from GM storage
   */
  async function restoreCache(): Promise<void> {
    const runId = sessionId;
    const cacheBook = getCurrentBookCacheKey();
    if (!cacheBook) return;
    if (typeof GM_getValue === 'undefined') return;

    try {
      const storedV2 = GM_getValue<unknown>(getCacheV2IndexKey(cacheBook.bookId), null);
      const dataV2 = parseStoredJson<PersistedBookCacheV2Index>(storedV2);
      if (dataV2?.version === 2 && Array.isArray(dataV2.urls)) {
        if (isSessionStale(runId)) return;
        persistedUrls.value = new Set(dataV2.urls);
        return;
      }

      const storedV1 = GM_getValue<unknown>(getCacheV1Key(cacheBook.bookId), null);
      const dataV1 = parseStoredJson<PersistedBookCache>(storedV1);
      if (dataV1?.chapters && typeof dataV1.chapters === 'object') {
        if (isSessionStale(runId)) return;
        persistedUrls.value = new Set(Object.keys(dataV1.chapters));
      }
    } catch (e) {
      console.error('[MNR] Failed to restore cache:', e);
    }
  }

  /**
   * Clear persisted cache for current book
   */
  async function clearPersistedCache(): Promise<void> {
    const cacheBook = getCurrentBookCacheKey();
    if (!cacheBook) return;
    if (typeof GM_deleteValue === 'undefined') return;

    let urls = new Set(persistedUrls.value);

    if (typeof GM_getValue !== 'undefined') {
      const storedIndex = GM_getValue<unknown>(getCacheV2IndexKey(cacheBook.bookId), null);
      const dataV2 = parseStoredJson<PersistedBookCacheV2Index>(storedIndex);
      if (dataV2?.version === 2 && Array.isArray(dataV2.urls)) {
        urls = new Set(dataV2.urls);
      }
    }

    try {
      const chapterKeyPrefix = `mnr_cache_v2_chapter_${cacheBook.bookId}_`;
      if (urls.size > 0) {
        for (const url of urls) {
          GM_deleteValue(getCacheV2ChapterKey(cacheBook.bookId, url));
        }
      } else if (typeof GM_listValues === 'function') {
        for (const key of GM_listValues()) {
          if (key.startsWith(chapterKeyPrefix)) {
            GM_deleteValue(key);
          }
        }
      }

      GM_deleteValue(getCacheV2IndexKey(cacheBook.bookId));
      GM_deleteValue(getCacheV1Key(cacheBook.bookId));
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
    getVipBlockedToast,
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
