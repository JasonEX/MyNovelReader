/**
 * Reader Store - Manages reading state with infinite scroll support
 */

import { computed, ref } from 'vue';
import { hashText, htmlTextLength, redactUrl, tailStrings } from '@/core/debug/diagnostics';
import { type ConversionMode } from '@/core/converter';
import { defineStore } from 'pinia';
import type { ParsedChapter } from '@/core/parser';
import { recordDebugEvent } from '@/core/debug/events';
import type { SiteRule } from '@/core/rules/types';

// Import types from modular files
import type {
  CachedChapter,
  CacheProgressState,
  ChapterEntry,
  ReadingProgress,
  TocEntry,
  TocEntryWithStatus,
} from './reader/types';
import { VIP_BLOCK_TOAST } from './reader/types';

// Import utilities from modular files
import {
  applyConversionToChapterEntry as applyConversionImpl,
  applyTocConversion as applyTocConversionImpl,
} from './reader/conversion';
import {
  cleanupExpiredCaches,
  clearPersistedCache as clearPersistedCacheImpl,
  getCurrentBookCacheKey,
  getPersistedCachedChapter,
  persistCache as persistCacheImpl,
  restoreCache as restoreCacheImpl,
  touchPersistedCache,
} from './reader/persistence';
import { createTocActions, loadTocEntriesPaged } from './reader/toc';
import { normalizeUrlForBlock, normalizeUrlForFetch } from './reader/utils';
import { createCacheAll } from './reader/cacheAll';
import { createNavigation } from './reader/navigation';
import { createReaderRuntime } from './reader/runtime';
import { syncHostPageToChapter } from './reader/hostPage';

// Re-export reader types used by UI modules.
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
  const vipBlockedUrls = ref<Set<string>>(new Set());
  const blockedNavUrls = ref<Set<string>>(new Set());
  const originalContents = ref<Map<string, string>>(new Map());
  const originalTitles = ref<Map<string, { title: string; bookTitle?: string }>>(new Map());
  const currentConversionMode = ref<ConversionMode>('none');
  const pendingNextAbort = ref<(() => void) | null>(null);
  const pendingPrevAbort = ref<(() => void) | null>(null);
  const navFailures = new Map<string, { count: number; nextRetryAt: number }>();
  const cacheProgress = ref<CacheProgressState>({ done: 0, total: 0, running: false });
  const cacheQueue = ref<string[]>([]);
  const cacheAbort = ref<(() => void) | null>(null);
  const reloadAbort = ref<(() => void) | null>(null);
  const toc = ref<TocEntry[]>([]);
  const tocOriginal = ref<TocEntry[]>([]);
  const tocLoading = ref(false);
  const tocAbort = ref<(() => void) | null>(null);
  const cachedContents = ref<Map<string, CachedChapter>>(new Map());
  const persistedUrls = ref<Set<string>>(new Set());
  const runtime = createReaderRuntime();

  // Getters
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

  // TOC with cache status (incremental: normalize URLs once, pre-compute status map)
  const normalizedTocUrls = computed(() => toc.value.map(entry => normalizeUrlForFetch(entry.url)));

  const tocStatusMap = computed(() => {
    const currentUrl = chapter.value?.url;
    const map = new Map<string, { isCached: boolean; isPersisted: boolean; isCurrent: boolean }>();
    for (const url of normalizedTocUrls.value) {
      map.set(url, {
        isCached:
          loadedUrls.value.has(url) ||
          cachedContents.value.has(url) ||
          persistedUrls.value.has(url),
        isPersisted: persistedUrls.value.has(url),
        isCurrent: url === currentUrl,
      });
    }
    return map;
  });

  const tocWithStatus = computed<TocEntryWithStatus[]>(() => {
    const urls = normalizedTocUrls.value;
    const statusMap = tocStatusMap.value;
    return toc.value.map((entry, i) => {
      const url = urls[i];
      const status = statusMap.get(url) || {
        isCached: false,
        isPersisted: false,
        isCurrent: false,
      };
      return { ...entry, url, ...status };
    });
  });

  const currentChapterUrl = computed(() => chapter.value?.url || '');

  function syncCurrentHostPage(): void {
    syncHostPageToChapter(chapter.value, currentChapterIndex.value);
  }

  function setError(msg: string) {
    recordDebugEvent('reader.error', { message: msg }, 'error');
    error.value = msg;
    toastType.value = 'error';
    isLoading.value = false;
    if (toastTimer.value) {
      window.clearTimeout(toastTimer.value);
    }
    toastTimer.value = window.setTimeout(() => {
      error.value = null;
      toastTimer.value = null;
    }, 3000);
  }

  function showToast(msg: string, type: 'info' | 'error' = 'info', duration = 2000) {
    recordDebugEvent('reader.toast', { message: msg, type, duration }, type);
    error.value = msg;
    toastType.value = type;
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

  async function applyConversionToChapterEntry(
    entryId: string,
    mode: ConversionMode
  ): Promise<void> {
    await applyConversionImpl(
      chapters.value,
      originalContents.value,
      originalTitles.value,
      entryId,
      mode
    );
  }

  async function applyTocConversion(mode: ConversionMode): Promise<void> {
    toc.value = await applyTocConversionImpl(tocOriginal.value, mode);
  }

  async function applyTextConversion(mode: ConversionMode): Promise<void> {
    currentConversionMode.value = mode;
    for (const entry of chapters.value) {
      await applyConversionToChapterEntry(entry.id, mode);
    }
    await applyTocConversion(mode);
    syncCurrentHostPage();
  }

  async function getPersistedCachedChapterForCurrentBook(
    url: string
  ): Promise<CachedChapter | null> {
    const cacheBook = getCurrentBookCacheKey(chapter.value?.indexUrl);
    if (!cacheBook) return null;
    return getPersistedCachedChapter(cacheBook, url);
  }

  async function persistCache(): Promise<void> {
    const runId = runtime.sessionId();
    const cacheBook = getCurrentBookCacheKey(chapter.value?.indexUrl);
    if (!cacheBook) return;
    const result = persistCacheImpl(cacheBook, cachedContents.value, persistedUrls.value);
    if (!runtime.isSessionStale(runId)) {
      persistedUrls.value = result;
    }
  }

  async function restoreCache(): Promise<void> {
    const runId = runtime.sessionId();
    const cacheBook = getCurrentBookCacheKey(chapter.value?.indexUrl);
    if (!cacheBook) return;
    const restored = restoreCacheImpl(cacheBook);
    if (runtime.isSessionStale(runId)) return;
    if (restored) {
      persistedUrls.value = restored;
      touchPersistedCache(cacheBook);
    }
    cleanupExpiredCaches({ currentBookId: cacheBook.bookId });
  }

  async function clearPersistedCache(): Promise<void> {
    const cacheBook = getCurrentBookCacheKey(chapter.value?.indexUrl);
    if (!cacheBook) return;
    clearPersistedCacheImpl(cacheBook, persistedUrls.value);
    persistedUrls.value.clear();
  }

  // Initialize extracted modules
  const nav = createNavigation({
    chapters,
    currentChapterIndex,
    isLoading,
    isLoadingNext,
    isLoadingPrev,
    pendingNextAbort,
    pendingPrevAbort,
    reloadAbort,
    loadedUrls,
    vipBlockedUrls,
    blockedNavUrls,
    cachedContents,
    persistedUrls,
    originalContents,
    originalTitles,
    currentConversionMode,
    navFailures,
    history,
    runtime,
    showToast,
    setError,
    applyConversionToChapterEntry,
    getPersistedCachedChapter: getPersistedCachedChapterForCurrentBook,
  });

  const { startCacheAll, cancelCacheAll } = createCacheAll({
    cacheProgress,
    cacheQueue,
    cacheAbort,
    loadedUrls,
    cachedContents,
    persistedUrls,
    chapter,
    rule,
    chapters,
    runtime,
    restoreCache,
    persistCache,
  });

  const tocActions = createTocActions({
    toc,
    tocOriginal,
    tocLoading,
    tocAbort,
    chapters,
    chapter,
    rule,
    currentConversionMode,
    runtime,
    showToast,
    applyTocConversion,
    loadTocEntriesPaged,
  });

  // ---- Core actions ----
  /** Cancel all in-flight requests and reset loading states */
  function cancelAllInFlight() {
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
  }

  /** Clear all navigation/cache/toc data */
  function clearAllData() {
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

  function activate() {
    recordDebugEvent('reader.activate');
    isActive.value = true;
    error.value = null;
  }

  function deactivate() {
    recordDebugEvent('reader.deactivate');
    runtime.bumpSession();
    isActive.value = false;
    cancelAllInFlight();
    clearAllData();
  }

  function setChapter(newChapter: ParsedChapter, newRule?: SiteRule) {
    recordDebugEvent('reader.setChapter', {
      url: newChapter.url,
      title: newChapter.title,
      ruleId: newRule?.id || newChapter.rule?.id,
    });
    runtime.bumpSession();
    cancelAllInFlight();
    toc.value = [];
    tocOriginal.value = [];
    const effectiveRule = newRule || newChapter.rule;

    // Canonicalize URLs (strip hashes etc.) to stabilize caching and navigation.
    if (newChapter.url) newChapter.url = normalizeUrlForFetch(newChapter.url);
    if (newChapter.prevUrl) newChapter.prevUrl = normalizeUrlForFetch(newChapter.prevUrl);
    if (newChapter.nextUrl) newChapter.nextUrl = normalizeUrlForFetch(newChapter.nextUrl);
    if (newChapter.indexUrl) newChapter.indexUrl = normalizeUrlForFetch(newChapter.indexUrl);

    const id = `chapter-${Date.now()}-0`;
    chapters.value = [{ chapter: newChapter, rule: effectiveRule, id }];
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
      rule: effectiveRule,
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
      void applyConversionToChapterEntry(id, currentConversionMode.value).then(() => {
        syncCurrentHostPage();
      });
    }

    syncCurrentHostPage();

    // Restore persisted cache for this book (async, don't block)
    void restoreCache();
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  function updateScroll(percent: number) {
    scrollPercent.value = Math.max(0, Math.min(100, percent));
  }

  /** Update current chapter index and host page state */
  function setCurrentChapter(index: number) {
    if (index < 0 || index >= chapters.value.length) return;
    if (currentChapterIndex.value === index) return;

    recordDebugEvent('reader.setCurrentChapter', {
      from: currentChapterIndex.value,
      to: index,
      url: chapters.value[index]?.chapter.url,
    });
    currentChapterIndex.value = index;
    syncCurrentHostPage();
  }

  async function loadNextChapter(source: 'auto' | 'manual' = 'auto'): Promise<boolean> {
    recordDebugEvent('reader.loadNext.start', {
      source,
      currentIndex: currentChapterIndex.value,
      currentUrl: chapter.value?.url,
      targetUrl: chapters.value[chapters.value.length - 1]?.chapter.nextUrl,
    });
    const ok = await nav.loadNextChapter(source);
    recordDebugEvent('reader.loadNext.end', {
      source,
      ok,
      chapterCount: chapters.value.length,
      currentIndex: currentChapterIndex.value,
    });
    return ok;
  }

  async function loadPrevChapter(source: 'auto' | 'manual' = 'manual'): Promise<boolean> {
    recordDebugEvent('reader.loadPrev.start', {
      source,
      currentIndex: currentChapterIndex.value,
      currentUrl: chapter.value?.url,
      targetUrl: chapters.value[0]?.chapter.prevUrl,
    });
    const ok = await nav.loadPrevChapter(source);
    recordDebugEvent('reader.loadPrev.end', {
      source,
      ok,
      chapterCount: chapters.value.length,
      currentIndex: currentChapterIndex.value,
    });
    return ok;
  }

  async function rebuildChaptersAround(targetUrl: string): Promise<boolean> {
    recordDebugEvent('reader.rebuildAround.start', { targetUrl });
    const ok = await nav.rebuildChaptersAround(targetUrl);
    if (ok) syncCurrentHostPage();
    recordDebugEvent('reader.rebuildAround.end', { targetUrl, ok });
    return ok;
  }

  async function reloadCurrentChapter(): Promise<void> {
    await nav.reloadCurrentChapter();
    syncCurrentHostPage();
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

  function getDebugSnapshot() {
    const currentEntry = chapters.value[currentChapterIndex.value] || null;
    const firstEntry = chapters.value[0] || null;
    const lastEntry = chapters.value[chapters.value.length - 1] || null;
    const cacheBook = getCurrentBookCacheKey(chapter.value?.indexUrl);

    return {
      active: isActive.value,
      loading: {
        main: isLoading.value,
        prev: isLoadingPrev.value,
        next: isLoadingNext.value,
        toc: tocLoading.value,
        pendingNext: Boolean(pendingNextAbort.value),
        pendingPrev: Boolean(pendingPrevAbort.value),
        pendingCache: Boolean(cacheAbort.value),
        pendingReload: Boolean(reloadAbort.value),
        pendingToc: Boolean(tocAbort.value),
      },
      toast: {
        message: error.value,
        type: toastType.value,
      },
      view: {
        currentChapterIndex: currentChapterIndex.value,
        chapterCount: chapters.value.length,
        scrollPercent: scrollPercent.value,
        hasNext: hasNext.value,
        hasPrev: hasPrev.value,
        hasIndex: hasIndex.value,
        confidence: confidence.value,
        method: method.value,
        conversionMode: currentConversionMode.value,
        runtimeSessionId: runtime.sessionId(),
        runtimeViewId: runtime.viewId(),
      },
      current: summarizeChapterForDebug(currentEntry),
      first: summarizeChapterForDebug(firstEntry),
      last: summarizeChapterForDebug(lastEntry),
      navigation: {
        history: {
          count: history.value.length,
          tail: tailStrings(history.value),
        },
        loadedUrls: summarizeUrlSet(loadedUrls.value),
        vipBlockedUrls: summarizeUrlSet(vipBlockedUrls.value),
        blockedNavUrls: summarizeUrlSet(blockedNavUrls.value),
        navFailures: {
          count: navFailures.size,
          tail: Array.from(navFailures.entries())
            .slice(-8)
            .map(([url, failure]) => ({
              url: redactUrl(url),
              count: failure.count,
              retryInMs: Math.max(0, failure.nextRetryAt - Date.now()),
            })),
        },
      },
      cache: {
        currentBook: cacheBook
          ? {
              bookId: cacheBook.bookId,
              indexUrl: redactUrl(cacheBook.indexUrl),
            }
          : null,
        progress: { ...cacheProgress.value },
        queue: {
          count: cacheQueue.value.length,
          tail: tailStrings(cacheQueue.value),
        },
        memory: {
          count: cachedContents.value.size,
          tail: Array.from(cachedContents.value.entries())
            .slice(-8)
            .map(([url, cached]) => ({
              url: redactUrl(url),
              title: cached.chapter.title,
              contentChars: cached.chapter.content.length,
              textChars: htmlTextLength(cached.chapter.content),
              cachedAt: cached.cachedAt,
            })),
        },
        persistedUrls: summarizeUrlSet(persistedUrls.value),
      },
      toc: {
        loading: tocLoading.value,
        count: toc.value.length,
        originalCount: tocOriginal.value.length,
        currentMatched: tocWithStatus.value.some(entry => entry.isCurrent),
        cachedCount: tocWithStatus.value.filter(entry => entry.isCached).length,
        persistedCount: tocWithStatus.value.filter(entry => entry.isPersisted).length,
      },
      originals: {
        contentCount: originalContents.value.size,
        titleCount: originalTitles.value.size,
      },
    };
  }

  function summarizeChapterForDebug(entry: ChapterEntry | null) {
    if (!entry) return null;
    const chapterData = entry.chapter;
    return {
      id: entry.id,
      url: redactUrl(chapterData.url),
      title: chapterData.title,
      bookTitle: chapterData.bookTitle || null,
      prevUrl: redactUrl(chapterData.prevUrl),
      nextUrl: redactUrl(chapterData.nextUrl),
      indexUrl: redactUrl(chapterData.indexUrl),
      confidence: chapterData.confidence,
      method: chapterData.method,
      ruleId: entry.rule?.id || chapterData.rule?.id || null,
      contentChars: chapterData.content.length,
      textChars: htmlTextLength(chapterData.content),
      rawContentChars: chapterData.rawContent.length,
      contentHash: hashText(chapterData.content),
    };
  }

  function summarizeUrlSet(values: Set<string>) {
    return {
      count: values.size,
      tail: tailStrings(values),
    };
  }

  function $reset() {
    runtime.bumpSession();
    isActive.value = false;
    cancelAllInFlight();
    clearAllData();
    scrollPercent.value = 0;
    currentConversionMode.value = 'none';
  }

  return {
    isActive,
    isLoading,
    isLoadingPrev,
    isLoadingNext,
    chapters,
    currentChapterIndex,
    currentConversionMode,
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
    getDebugSnapshot,
    applyTextConversion,
    startCacheAll,
    cancelCacheAll,
    loadToc: tocActions.loadToc,
    rebuildChaptersAround,
    reloadCurrentChapter,
    persistCache,
    restoreCache,
    clearPersistedCache,
    $reset,
  };
});
