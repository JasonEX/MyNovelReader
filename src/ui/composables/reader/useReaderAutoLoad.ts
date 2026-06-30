/**
 * useReaderAutoLoad - Composable for auto-loading next chapters
 *
 * Manages the auto-load safety gate, cooldown timers, and scheduling
 * for preloading subsequent chapters during reading.
 */

import {
  type AdaptivePreloadStats,
  countReadableChars,
  estimateAdaptivePreloadLeadMs,
  estimateReadingCharsPerMs,
  getAdaptivePreloadStatsKey,
  loadAdaptivePreloadStats,
  recordLoadFailure,
  recordLoadSample,
  recordReadingSample,
  saveAdaptivePreloadStats,
} from './preloadStats';
import { type ComputedRef, onUnmounted, ref, type Ref, watch } from 'vue';
import type { useConfigStore } from '@/ui/stores/config';
import type { useReaderStore } from '@/ui/stores/reader';

// === Constants ===
export const INTERSECTION_ROOT_MARGIN_PX = 1600;
const AUTO_LOAD_COOLDOWN_MIN_MS = 3000;
const AUTO_LOAD_COOLDOWN_MAX_MS = 5000;
const AUTO_LOAD_ARM_SCROLL_DELTA_PX = 180;
const AUTO_LOAD_SHORT_CHAIN_LIMIT = 10;
const ADAPTIVE_SCROLL_SPEED_ALPHA = 0.25;
const ADAPTIVE_MIN_SCROLL_SAMPLE_MS = 80;
const ADAPTIVE_MAX_SCROLL_SAMPLE_MS = 30000;
const ADAPTIVE_MIN_SCROLL_DELTA_PX = 8;
const ADAPTIVE_MAX_DISTANCE_PX = 12000;

export interface UseReaderAutoLoadOptions {
  mainRef: Ref<HTMLElement | null>;
  readerStore: ReturnType<typeof useReaderStore>;
  configStore: ReturnType<typeof useConfigStore>;
  hasNext: ComputedRef<boolean>;
  isLoadingNext: ComputedRef<boolean>;
  isLoadingPrev: ComputedRef<boolean>;
  isLoading: ComputedRef<boolean>;
  isNavigating: Ref<boolean>;
  chapterRefs?: Map<string, HTMLElement>;
}

export function useReaderAutoLoad(options: UseReaderAutoLoadOptions) {
  const {
    mainRef,
    readerStore,
    configStore,
    hasNext,
    isLoadingNext,
    isLoadingPrev,
    isLoading,
    isNavigating,
    chapterRefs,
  } = options;

  // Auto-load safety gate:
  // - Avoid request storms when the sentinel stays intersecting (e.g. short chapters / large rootMargin).
  // - Require some user scrolling after each append before allowing the next auto-load.
  const autoLoadArmed = ref(false);
  const lastAutoLoadScrollTop = { value: 0 };
  const autoLoadShortChainCount = { value: 0 };
  let nextAutoLoadAt = 0;
  let autoLoadTimer: ReturnType<typeof setTimeout> | null = null;
  let statsKey = '';
  let adaptiveStats: AdaptivePreloadStats | null = null;
  let lastObservedScrollTop: number | null = null;
  let lastObservedAt: number | null = null;
  let scrollPxPerMs = 0;
  let activeRead: {
    key: string;
    url: string;
    chars: number;
    startedAt: number;
  } | null = null;
  const chapterCharCounts = new Map<string, number>();

  function getRandomDelayMs(min: number, max: number): number {
    const a = Math.min(min, max);
    const b = Math.max(min, max);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function getDistanceToBottom(mainEl: HTMLElement): number {
    return mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight);
  }

  function isNearBottom(mainEl: HTMLElement): boolean {
    return getDistanceToBottom(mainEl) <= INTERSECTION_ROOT_MARGIN_PX;
  }

  function nowMs(): number {
    return Date.now();
  }

  function getCurrentIndex(): number {
    const index = Number(readerStore.currentChapterIndex ?? 0);
    if (!Number.isFinite(index)) return 0;
    return Math.max(0, Math.min(readerStore.chapters.length - 1, index));
  }

  function getCurrentEntry() {
    return readerStore.chapters[getCurrentIndex()];
  }

  function getStatsForCurrentEntry(): AdaptivePreloadStats | null {
    const key = getAdaptivePreloadStatsKey(getCurrentEntry());
    if (!key) {
      statsKey = '';
      adaptiveStats = null;
      return null;
    }
    if (key !== statsKey || !adaptiveStats) {
      statsKey = key;
      adaptiveStats = loadAdaptivePreloadStats(key);
    }
    return adaptiveStats;
  }

  function updateStats(nextStats: AdaptivePreloadStats): void {
    adaptiveStats = nextStats;
    statsKey = nextStats.key;
    saveAdaptivePreloadStats(nextStats);
  }

  function persistStats(nextStats: AdaptivePreloadStats): void {
    if (nextStats.key === statsKey) {
      updateStats(nextStats);
      return;
    }
    saveAdaptivePreloadStats(nextStats);
  }

  function getChapterCharCount(index: number): number {
    const entry = readerStore.chapters[index];
    const url = entry?.chapter.url;
    if (!entry || !url) return 0;
    const cached = chapterCharCounts.get(url);
    if (typeof cached === 'number') return cached;

    const count = countReadableChars(entry.chapter.content || '');
    chapterCharCounts.set(url, count);
    return count;
  }

  function getUnreadLoadedChapterCount(): number {
    return Math.max(0, readerStore.chapters.length - getCurrentIndex() - 1);
  }

  function recordScrollObservation(mainEl: HTMLElement): void {
    const currentTop = mainEl.scrollTop;
    const currentAt = nowMs();
    if (lastObservedScrollTop === null || lastObservedAt === null) {
      lastObservedScrollTop = currentTop;
      lastObservedAt = currentAt;
      return;
    }

    const deltaPx = currentTop - lastObservedScrollTop;
    const deltaMs = currentAt - lastObservedAt;
    lastObservedScrollTop = currentTop;
    lastObservedAt = currentAt;

    if (deltaPx < ADAPTIVE_MIN_SCROLL_DELTA_PX) return;
    if (deltaMs < ADAPTIVE_MIN_SCROLL_SAMPLE_MS || deltaMs > ADAPTIVE_MAX_SCROLL_SAMPLE_MS) return;

    const sample = deltaPx / deltaMs;
    scrollPxPerMs =
      scrollPxPerMs > 0
        ? (1 - ADAPTIVE_SCROLL_SPEED_ALPHA) * scrollPxPerMs + ADAPTIVE_SCROLL_SPEED_ALPHA * sample
        : sample;
  }

  function estimateRemainingChars(mainEl: HTMLElement): number | null {
    if (readerStore.chapters.length === 0) return null;
    const currentIndex = getCurrentIndex();
    if (currentIndex < 0 || currentIndex >= readerStore.chapters.length) return null;

    const viewportBottom = mainEl.scrollTop + mainEl.clientHeight;
    let remainingChars = 0;

    for (let i = currentIndex; i < readerStore.chapters.length; i++) {
      const entry = readerStore.chapters[i];
      const chars = getChapterCharCount(i);
      if (!entry || chars <= 0) continue;

      let unreadFraction = 1;
      const chapterEl = chapterRefs?.get(entry.chapter.url);
      if (chapterEl && chapterEl.offsetHeight > 0) {
        const unreadPx = chapterEl.offsetTop + chapterEl.offsetHeight - viewportBottom;
        unreadFraction = Math.min(1, Math.max(0, unreadPx / chapterEl.offsetHeight));
      } else if (i === currentIndex && readerStore.chapters.length === 1) {
        const distanceToBottom = getDistanceToBottom(mainEl);
        const scrollable = Math.max(1, mainEl.scrollHeight - mainEl.clientHeight);
        unreadFraction = Math.min(1, Math.max(0, distanceToBottom / scrollable));
      }

      remainingChars += chars * unreadFraction;
    }

    return remainingChars;
  }

  function shouldPreloadByAdaptiveEstimate(mainEl: HTMLElement): boolean {
    if (isNearBottom(mainEl)) return true;

    const stats = getStatsForCurrentEntry();
    if (!stats) return false;

    const leadMs = estimateAdaptivePreloadLeadMs(stats);
    const remainingChars = estimateRemainingChars(mainEl);
    if (remainingChars !== null && remainingChars / estimateReadingCharsPerMs(stats) <= leadMs) {
      return true;
    }

    if (scrollPxPerMs > 0) {
      const adaptiveDistance = Math.min(ADAPTIVE_MAX_DISTANCE_PX, scrollPxPerMs * leadMs);
      if (getDistanceToBottom(mainEl) <= Math.max(INTERSECTION_ROOT_MARGIN_PX, adaptiveDistance)) {
        return true;
      }
    }

    return false;
  }

  function isShortScrollableContent(mainEl: HTMLElement): boolean {
    const scrollableDistance = mainEl.scrollHeight - mainEl.clientHeight;
    return scrollableDistance < AUTO_LOAD_ARM_SCROLL_DELTA_PX;
  }

  function armAutoLoadIfUserScrolled(mainEl: HTMLElement): void {
    if (isNavigating.value || autoLoadArmed.value) return;
    if (mainEl.scrollTop - lastAutoLoadScrollTop.value < AUTO_LOAD_ARM_SCROLL_DELTA_PX) return;

    autoLoadArmed.value = true;
    autoLoadShortChainCount.value = 0;
  }

  function clearAutoLoadTimer(): void {
    if (!autoLoadTimer) return;
    clearTimeout(autoLoadTimer);
    autoLoadTimer = null;
  }

  function scheduleAutoLoadNext(): void {
    const mainEl = mainRef.value;
    if (!mainEl) return;
    if (!configStore.behavior.preloadNext) return;
    if (!hasNext.value) return;
    if (isLoadingNext.value || isLoadingPrev.value || isLoading.value || isNavigating.value) return;

    recordScrollObservation(mainEl);
    getStatsForCurrentEntry();

    armAutoLoadIfUserScrolled(mainEl);

    const fillMode = isShortScrollableContent(mainEl);
    if (!fillMode && getUnreadLoadedChapterCount() > 0) return;
    if (!fillMode && !shouldPreloadByAdaptiveEstimate(mainEl)) return;

    const canAutoLoad = autoLoadArmed.value || fillMode;
    if (!canAutoLoad) return;

    // Prevent endless auto-loading when content stays extremely short.
    if (fillMode && autoLoadShortChainCount.value >= AUTO_LOAD_SHORT_CHAIN_LIMIT) return;

    const now = Date.now();
    if (fillMode && nextAutoLoadAt === 0) {
      nextAutoLoadAt = now + getRandomDelayMs(AUTO_LOAD_COOLDOWN_MIN_MS, AUTO_LOAD_COOLDOWN_MAX_MS);
    }
    const delayMs = Math.max(0, nextAutoLoadAt - now);
    if (delayMs > 0) {
      if (!autoLoadTimer) {
        autoLoadTimer = setTimeout(() => {
          autoLoadTimer = null;
          scheduleAutoLoadNext();
        }, delayMs);
      }
      return;
    }

    // Commit auto-load
    clearAutoLoadTimer();
    nextAutoLoadAt = 0;
    lastAutoLoadScrollTop.value = mainEl.scrollTop;
    autoLoadArmed.value = false;
    autoLoadShortChainCount.value = fillMode ? autoLoadShortChainCount.value + 1 : 0;

    const loadStartedAt = nowMs();
    const loadStatsKey = statsKey;
    void readerStore.loadNextChapter('auto').then(ok => {
      if (loadStatsKey) {
        const stats =
          loadStatsKey === statsKey && adaptiveStats
            ? adaptiveStats
            : loadAdaptivePreloadStats(loadStatsKey);
        persistStats(
          ok ? recordLoadSample(stats, nowMs() - loadStartedAt) : recordLoadFailure(stats)
        );
      }

      if (!ok) {
        // On failures, slow down a bit more to avoid triggering anti-crawler rules.
        nextAutoLoadAt =
          Date.now() + getRandomDelayMs(AUTO_LOAD_COOLDOWN_MAX_MS, AUTO_LOAD_COOLDOWN_MAX_MS * 2);
      } else {
        nextAutoLoadAt = 0;
      }
    });
  }

  // Any chapter list change (append/prepend) should re-arm only after user scrolls again.
  watch(
    () => readerStore.chapters.length,
    () => {
      const mainEl = mainRef.value;
      if (!mainEl) return;
      lastAutoLoadScrollTop.value = mainEl.scrollTop;
      autoLoadArmed.value = false;
      // Allow a few consecutive auto-loads when content is too short to scroll.
      if (!isShortScrollableContent(mainEl)) {
        autoLoadShortChainCount.value = 0;
      }
      scheduleAutoLoadNext();
    }
  );

  function startReadSession(): void {
    const entry = getCurrentEntry();
    const key = getAdaptivePreloadStatsKey(entry);
    const url = entry?.chapter.url || '';
    if (!key || !url) {
      activeRead = null;
      return;
    }

    activeRead = {
      key,
      url,
      chars: getChapterCharCount(getCurrentIndex()),
      startedAt: nowMs(),
    };
  }

  function finishReadSession(): void {
    if (!activeRead) return;
    const session = activeRead;
    activeRead = null;

    if (session.chars <= 0) return;
    const stats =
      session.key === statsKey && adaptiveStats
        ? adaptiveStats
        : loadAdaptivePreloadStats(session.key);
    const nextStats = recordReadingSample(stats, session.chars, nowMs() - session.startedAt);
    if (nextStats !== stats) {
      persistStats(nextStats);
    }
  }

  startReadSession();

  watch(
    () => readerStore.currentChapterIndex,
    () => {
      finishReadSession();
      getStatsForCurrentEntry();
      startReadSession();
      scheduleAutoLoadNext();
    }
  );

  watch(
    () => readerStore.chapters.map(entry => entry.chapter.url).join('\n'),
    () => {
      for (const url of chapterCharCounts.keys()) {
        if (!readerStore.chapters.some(entry => entry.chapter.url === url)) {
          chapterCharCounts.delete(url);
        }
      }
      getStatsForCurrentEntry();
      const currentUrl = getCurrentEntry()?.chapter.url || '';
      if (activeRead && activeRead.url !== currentUrl) {
        finishReadSession();
        startReadSession();
      } else if (!activeRead) {
        startReadSession();
      }
    }
  );

  watch(
    () => [isLoadingNext.value, isLoadingPrev.value, isLoading.value, isNavigating.value],
    ([loadingNext, loadingPrev, loading, navigating]) => {
      if (loadingNext || loadingPrev || loading || navigating) return;
      scheduleAutoLoadNext();
    }
  );

  watch(
    () => configStore.behavior.preloadNext,
    enabled => {
      if (!enabled) {
        clearAutoLoadTimer();
        nextAutoLoadAt = 0;
        autoLoadShortChainCount.value = 0;
        return;
      }
      scheduleAutoLoadNext();
    }
  );

  onUnmounted(() => {
    clearAutoLoadTimer();
    finishReadSession();
  });

  return {
    autoLoadArmed,
    scheduleAutoLoadNext,
    clearAutoLoadTimer,
    lastAutoLoadScrollTop,
    autoLoadShortChainCount,
    INTERSECTION_ROOT_MARGIN_PX,
  };
}
