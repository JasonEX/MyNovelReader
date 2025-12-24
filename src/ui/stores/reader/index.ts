/**
 * Reader Store - Refactored Modular Version
 *
 * This is the main entry point for the reader store.
 * It integrates all the specialized modules while maintaining
 * backward compatibility with the existing API.
 *
 * @module reader/index
 */

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { getParser, type ParsedChapter } from '@/core/parser';
import type { ConversionMode } from '@/core/converter';
import { getChapterCacheManager } from '@/core/optimization/MemoryManager';
import type { SiteRule } from '@/core/rules/types';

// Import all modules
import {
  type CachedChapter,
  type CacheProgressState,
  type ChapterEntry,
  READER_CONSTANTS,
  type ReadingProgress,
  type TocEntry,
  type TocEntryWithStatus,
} from './types';
import { fetchAndParseUrl, normalizeUrlForBlock, normalizeUrlForFetch } from './utils';
import { createCacheManager } from './CacheManager';
import { createChapterLoader } from './ChapterLoader';
import { createErrorHandler } from './ErrorHandler';
import { createNavigationManager } from './Navigation';
import { createTOCManager } from './TOCManager';

// Import converter functions (lazy loading to avoid circular deps)
let converterModule: typeof import('@/core/converter') | null = null;
async function getConverter() {
  if (!converterModule) {
    converterModule = await import('@/core/converter');
  }
  return converterModule;
}

/**
 * Main Reader Store
 *
 * Integrates all specialized modules and provides the Pinia API
 */
export const useReaderStore = defineStore('reader', () => {
  // ========================================
  // Reactive State
  // ========================================
  const isActive = ref(false);
  const isLoading = ref(false);
  const isLoadingPrev = ref(false);
  const isLoadingNext = ref(false);
  const chapters = ref<ChapterEntry[]>([]);
  const currentChapterIndex = ref(0);
  const scrollPercent = ref(0);
  const history = ref<string[]>([]);
  const loadedUrls = ref<Set<string>>(new Set());
  const vipBlockedUrls = ref<Set<string>>(new Set());
  const blockedNavUrls = ref<Set<string>>(new Set());
  const originalContents = ref<Map<string, string>>(new Map());
  const originalTitles = ref<Map<string, { title: string; bookTitle?: string }>>(new Map());
  const currentConversionMode = ref<ConversionMode>('none');
  const pendingNextAbort = ref<(() => void) | null>(null);
  const pendingPrevAbort = ref<(() => void) | null>(null);
  const navFailures = new Map<string, { count: number; nextRetryAt: number }>();

  // TOC state
  const toc = ref<TocEntry[]>([]);
  const tocOriginal = ref<TocEntry[]>([]);
  const tocLoading = ref(false);
  const tocAbort = ref<(() => void) | null>(null);

  // Cache state
  // Stores simple boolean existence for UI reactivity. Actual content is in MemoryManager.
  const cachedUrls = ref<Set<string>>(new Set());
  const persistedUrls = ref<Set<string>>(new Set());

  // ========================================
  // Module Instances
  // ========================================
  const errorHandler = createErrorHandler();
  const navigationManager = createNavigationManager();
  const cacheManager = createCacheManager();
  const memoryManager = getChapterCacheManager();

  // ========================================
  // Computed Getters
  // ========================================
  const chapter = computed(() => chapters.value[currentChapterIndex.value]?.chapter || null);
  const rule = computed(() => chapters.value[currentChapterIndex.value]?.rule || null);
  const title = computed(() => chapter.value?.title || '');
  const bookTitle = computed(() => chapter.value?.bookTitle || '');
  const content = computed(() => chapter.value?.content || '');

  const hasNext = computed(() => navigationManager.hasNext(chapters.value, vipBlockedUrls.value));
  const hasPrev = computed(() => navigationManager.hasPrev(chapters.value, vipBlockedUrls.value));
  const hasIndex = computed(() => !!chapter.value?.indexUrl);
  const confidence = computed(() => chapter.value?.confidence || 0);
  const method = computed(() => chapter.value?.method || 'detection');

  const error = computed(() => errorHandler.getError());
  const toastType = computed(() => errorHandler.getToastType());

  const cacheProgress = ref<CacheProgressState>({ ...cacheManager.getProgress() });
  const cacheQueue = ref<string[]>([...cacheManager.getQueue()]);

  // TOC with cache status for UI
  const tocWithStatus = computed<TocEntryWithStatus[]>(() => {
    const currentUrl = chapter.value?.url;
    return toc.value.map(entry => ({
      ...entry,
      isCached: loadedUrls.value.has(entry.url) || cachedUrls.value.has(entry.url),
      isPersisted: persistedUrls.value.has(entry.url),
      isCurrent: entry.url === currentUrl,
    }));
  });

  const currentChapterUrl = computed(() => chapter.value?.url || '');

  // ========================================
  // Helper Functions
  // ========================================

  function showToast(msg: string, type: 'info' | 'error' = 'info', duration = 2000): void {
    errorHandler.showToast(msg, type, duration);
  }

  function setError(msg: string): void {
    errorHandler.setError(msg);
    isLoading.value = false;
  }

  function clearError(): void {
    errorHandler.clearError();
  }

  function getVipBlockedToast(direction: 'next' | 'prev'): string | null {
    return navigationManager.getVipBlockedToast(
      chapters.value,
      vipBlockedUrls.value,
      direction,
      READER_CONSTANTS.VIP_BLOCK_TOAST
    );
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

    // Store original content for text conversion
    originalContents.value.set(id, cached.chapter.content);
    originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle,
    });

    // Apply conversion if needed
    if (currentConversionMode.value !== 'none') {
      await applyConversionToChapterEntry(id, currentConversionMode.value);
    }

    // Trim cached chapters to limit memory
    if (chapters.value.length > READER_CONSTANTS.MAX_CACHED_CHAPTERS) {
      if (position === 'append' && currentChapterIndex.value > 2) {
        const removed = chapters.value.shift();
        if (removed) {
          loadedUrls.value.delete(removed.chapter.url);
          originalContents.value.delete(removed.id);
          originalTitles.value.delete(removed.id);
          currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
        }
      } else if (position === 'prepend') {
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

  // ========================================
  // Actions
  // ========================================

  function activate(): void {
    isActive.value = true;
    errorHandler.clearError();
  }

  function deactivate(): void {
    isActive.value = false;
    chapters.value = [];
    currentChapterIndex.value = 0;
    errorHandler.clearError();
    loadedUrls.value.clear();
    vipBlockedUrls.value.clear();
    blockedNavUrls.value.clear();
    navFailures.clear();
    originalContents.value.clear();
    originalTitles.value.clear();
    cachedUrls.value.clear();
    persistedUrls.value.clear();
  }

  function setChapter(newChapter: ParsedChapter, newRule?: SiteRule): void {
    // Canonicalize URLs
    const normalize = (url: string | undefined) => (url ? normalizeUrlForFetch(url) : url);

    if (newChapter.url) newChapter.url = normalize(newChapter.url);
    if (newChapter.prevUrl) newChapter.prevUrl = normalize(newChapter.prevUrl);
    if (newChapter.nextUrl) newChapter.nextUrl = normalize(newChapter.nextUrl);
    if (newChapter.indexUrl) newChapter.indexUrl = normalize(newChapter.indexUrl);

    const id = `chapter-${Date.now()}-0`;
    chapters.value = [{ chapter: newChapter, rule: newRule, id }];
    currentChapterIndex.value = 0;
    isLoading.value = false;
    errorHandler.clearError();
    loadedUrls.value.clear();
    loadedUrls.value.add(newChapter.url);
    vipBlockedUrls.value.clear();
    blockedNavUrls.value.clear();
    navFailures.clear();
    cachedUrls.value.clear();
    persistedUrls.value.clear();

    // Store original content
    originalContents.value.clear();
    originalContents.value.set(id, newChapter.content);
    originalTitles.value.clear();
    originalTitles.value.set(id, {
      title: newChapter.title,
      bookTitle: newChapter.bookTitle,
    });

    // Store in cache
    memoryManager.addChapter(newChapter.url, {
      chapter: newChapter,
      rule: newRule,
      cachedAt: Date.now(),
    });
    cachedUrls.value.add(newChapter.url);

    // Add to history
    navigationManager.addToHistory(newChapter.url);

    // Apply conversion if needed
    if (currentConversionMode.value !== 'none') {
      void applyConversionToChapterEntry(id, currentConversionMode.value);
    }

    // Restore persisted cache
    void restoreCache();
  }

  type LoadSource = 'auto' | 'manual';

  async function loadChapter(direction: 'next' | 'prev', source: LoadSource): Promise<boolean> {
    const chapterLoader = createChapterLoader();

    return chapterLoader.loadChapter(direction, source, {
      chapters: chapters.value,
      currentChapterIndex: currentChapterIndex,
      // Pass proxy Map to adapt MemoryManager
      cachedContents: {
        get: (url: string) => memoryManager.getChapter(url),
        has: (url: string) => memoryManager.hasChapter(url),
        set: (url: string, val: CachedChapter) => {
          memoryManager.addChapter(url, val);
          cachedUrls.value.add(url);
        },
        delete: (url: string) => {
          memoryManager.removeChapter(url);
          cachedUrls.value.delete(url);
        },
        clear: () => {
          memoryManager.clear();
          cachedUrls.value.clear();
        },
      },
      loadedUrls: loadedUrls.value,
      vipBlockedUrls: vipBlockedUrls.value,
      blockedNavUrls: blockedNavUrls.value,
      originalContents: originalContents.value,
      originalTitles: originalTitles.value,
      currentConversionMode: currentConversionMode.value,
      navFailures,
      pendingNextAbort,
      pendingPrevAbort,
      normalizeUrl: normalizeUrlForBlock,
      showToast,
      addToHistory: (url: string, isNext: boolean) => {
        navigationManager.addToHistory(url, isNext);
      },
      setError,
      insertCachedChapter,
    });
  }

  async function loadNextChapter(source: LoadSource = 'auto'): Promise<boolean> {
    return loadChapter('next', source);
  }

  async function loadPrevChapter(source: LoadSource = 'manual'): Promise<boolean> {
    return loadChapter('prev', source);
  }

  function setLoading(loading: boolean): void {
    isLoading.value = loading;
  }

  function updateScroll(percent: number): void {
    scrollPercent.value = Math.max(0, Math.min(100, percent));
  }

  function setCurrentChapter(index: number): void {
    if (index < 0 || index >= chapters.value.length) return;
    if (currentChapterIndex.value === index) return;

    currentChapterIndex.value = index;
    const chapterEntry = chapters.value[index];
    if (chapterEntry?.chapter.url) {
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
      url: chapter.value?.url || window.location.href,
      chapterUrl: chapter.value.url,
      chapterPercent: scrollPercent.value,
      scrollPercent: scrollPercent.value,
      lastRead: Date.now(),
    };
  }

  // ========================================
  // Text Conversion
  // ========================================

  async function applyConversionToChapterEntry(
    entryId: string,
    mode: ConversionMode
  ): Promise<void> {
    const entry = chapters.value.find(e => e.id === entryId);
    if (!entry) return;

    const originalContent = originalContents.value.get(entryId);
    const originalTitle = originalTitles.value.get(entryId);
    const updates: Partial<ParsedChapter> = {};

    const { convertHTML, convertText } = await getConverter();

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

    const { convertText } = await getConverter();
    const converted = await Promise.all(
      tocOriginal.value.map(async entry => ({
        ...entry,
        title: await convertText(entry.title, mode),
      }))
    );
    toc.value = converted;
  }

  async function applyTextConversion(mode: ConversionMode): Promise<void> {
    currentConversionMode.value = mode;

    for (const entry of chapters.value) {
      await applyConversionToChapterEntry(entry.id, mode);
    }

    await applyTocConversion(mode);
  }

  // ========================================
  // Cache Management
  // ========================================

  async function startCacheAll(urls?: string[]): Promise<void> {
    const tocManager = createTOCManager();

    await cacheManager.startCacheAll({
      urls,
      currentChapter: chapter.value,
      chapters: chapters.value,
      loadedUrls: loadedUrls.value,
      persistedUrls: persistedUrls.value,
      loadTocEntries: tocManager.loadTocEntries.bind(tocManager),
      onProgress: progress => {
        cacheProgress.value = { ...progress };
        cacheQueue.value = [...cacheManager.getQueue()];
      },
    });

    cacheProgress.value = { ...cacheManager.getProgress() };
    cacheQueue.value = [...cacheManager.getQueue()];
    cachedUrls.value = new Set(memoryManager.getCachedUrls());
  }

  function cancelCacheAll(): void {
    cacheManager.stopCache();
    cacheProgress.value = { done: 0, total: 0, running: false };
    cacheQueue.value = [];
  }

  async function persistCache(): Promise<void> {
    const tocManager = createTOCManager();

    await cacheManager.persistCache({
      currentChapter: chapter.value,
      chapters: chapters.value,
      loadedUrls: loadedUrls.value,
      persistedUrls: persistedUrls.value,
      loadTocEntries: tocManager.loadTocEntries.bind(tocManager),
    });
  }

  async function restoreCache(): Promise<void> {
    const tocManager = createTOCManager();

    const restoredCount = await cacheManager.restoreCache({
      currentChapter: chapter.value,
      chapters: chapters.value,
      loadedUrls: loadedUrls.value,
      persistedUrls: persistedUrls.value,
      loadTocEntries: tocManager.loadTocEntries.bind(tocManager),
    });

    if (restoredCount > 0) {
      console.log(`[MNR] Restored ${restoredCount} chapters from cache`);
    }

    cachedUrls.value = new Set(memoryManager.getCachedUrls());
  }

  async function clearPersistedCache(): Promise<void> {
    if (!chapter.value?.indexUrl) return;

    const bookId = generateBookId(chapter.value.indexUrl);
    await cacheManager.clearBookCache(bookId);
    persistedUrls.value.clear();
  }

  function generateBookId(indexUrl: string): string {
    try {
      const url = new URL(indexUrl);
      return url.hostname + url.pathname.replace(/\//g, '_');
    } catch {
      return btoa(indexUrl).slice(0, 32);
    }
  }

  // ========================================
  // TOC Management
  // ========================================

  async function setTocEntries(entries: TocEntry[]): Promise<void> {
    tocOriginal.value = entries;
    await applyTocConversion(currentConversionMode.value);
  }

  async function ensureIndexUrl(): Promise<string | null> {
    const current = chapter.value;
    const currentUrl = current?.url || '';
    const existing = current?.indexUrl;

    if (
      existing &&
      (!currentUrl || normalizeUrlForBlock(existing) !== normalizeUrlForBlock(currentUrl))
    ) {
      return existing;
    }

    if (!currentUrl) return null;

    try {
      const parser = getParser();
      const detected = parser.detect(document, currentUrl).results.navigation.index?.url;
      if (!detected) return null;

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
      return null;
    }
  }

  async function loadToc(): Promise<void> {
    if (toc.value.length > 0 || tocLoading.value) return;

    const currentUrl = chapter.value?.url || '';
    let indexUrl = chapter.value?.indexUrl;
    if (
      !indexUrl ||
      (currentUrl && normalizeUrlForBlock(indexUrl) === normalizeUrlForBlock(currentUrl))
    ) {
      indexUrl = await ensureIndexUrl();
    }
    if (!indexUrl) {
      showToast('未检测到目录链接', 'info', 2500);
      return;
    }

    tocLoading.value = true;

    try {
      const tocManager = createTOCManager();
      let entries = await tocManager.loadTocEntries(indexUrl, currentUrl || indexUrl, abort => {
        tocAbort.value = abort;
      });
      if (entries.length === 0) {
        // Retry once
        await new Promise<void>(resolve => window.setTimeout(resolve, 400));
        entries = await tocManager.loadTocEntries(indexUrl, currentUrl || indexUrl, abort => {
          tocAbort.value = abort;
        });
      }
      await setTocEntries(entries);
      if (entries.length === 0) {
        showToast('目录解析为空，可稍后重试或刷新页面', 'info', 2500);
      }
    } catch (e) {
      console.error('[MNR] Failed to load TOC:', e);
      showToast('目录加载失败，可稍后重试', 'error', 2500);
    } finally {
      tocLoading.value = false;
      tocAbort.value = null;
    }
  }

  // ========================================
  // Chapter Navigation Utilities
  // ========================================

  async function rebuildChaptersAround(targetUrl: string): Promise<boolean> {
    const cached = memoryManager.getChapter(targetUrl);
    if (!cached) return false;

    chapters.value = [];
    currentChapterIndex.value = 0;
    originalContents.value.clear();
    originalTitles.value.clear();

    const id = `chapter-${Date.now()}-jump-0`;
    chapters.value.push({
      chapter: cached.chapter,
      rule: cached.rule,
      id,
    });

    originalContents.value.set(id, cached.chapter.content);
    originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle,
    });

    if (currentConversionMode.value !== 'none') {
      await applyConversionToChapterEntry(id, currentConversionMode.value);
    }

    return true;
  }

  async function reloadCurrentChapter(): Promise<void> {
    const current = chapters.value[currentChapterIndex.value];
    if (!current) return;

    const url = current.chapter.url;
    showToast('正在重新加载...', 'info');

    const { promise } = fetchAndParseUrl(url, url);
    const result = await promise;
    if (!result.doc) {
      showToast('重新加载失败', 'error');
      return;
    }

    const parser = getParser();
    const parsed = await parser.parse(result.doc, url);

    if (parsed) {
      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

      current.chapter = parsed;
      current.rule = parsed.rule;
      originalContents.value.set(current.id, parsed.content);

      memoryManager.addChapter(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });
      cachedUrls.value.add(parsed.url);

      if (currentConversionMode.value !== 'none') {
        const { convertHTML } = await getConverter();
        const converted = await convertHTML(parsed.content, currentConversionMode.value);
        current.chapter = { ...current.chapter, content: converted };
      }

      showToast('规则已应用', 'info');
    } else {
      showToast('解析失败', 'error');
    }
  }

  // ========================================
  // Reset
  // ========================================

  function $reset(): void {
    isActive.value = false;
    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;
    chapters.value = [];
    currentChapterIndex.value = 0;
    scrollPercent.value = 0;
    loadedUrls.value.clear();
    originalContents.value.clear();
    originalTitles.value.clear();
    blockedNavUrls.value.clear();
    navFailures.clear();
    cachedUrls.value.clear();
    memoryManager.clear();
    persistedUrls.value.clear();
    currentConversionMode.value = 'none';
    toc.value = [];
    tocOriginal.value = [];
    tocLoading.value = false;
    if (tocAbort.value) {
      tocAbort.value();
      tocAbort.value = null;
    }
    errorHandler.destroy();
  }

  // ========================================
  // Export API
  // ========================================

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
    cachedContents: cachedUrls,
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
