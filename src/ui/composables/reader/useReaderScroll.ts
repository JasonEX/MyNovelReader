/**
 * useReaderScroll - Composable for scroll handling in the reader view
 *
 * Handles throttled scroll events, scroll direction detection,
 * auto-hide header, chapter visibility calculation, and virtual window updates.
 */

import type { ChapterEntry, useReaderStore } from '@/ui/stores/reader';
import { type ComputedRef, type Ref } from 'vue';
import type { ScheduleAutoLoadNext } from './useReaderAutoLoad';
import type { VirtualChapterEntry } from '@/ui/composables/useVirtualChapters';

// === Constants ===
const SCROLL_THROTTLE_MS = 16; // ~60fps
const SCROLL_SETTLE_CHECK_MS = 180;

// === Utility: Throttle function ===
function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...fnArgs: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn(...fnArgs);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...fnArgs);
      }, remaining);
    }
  }) as T;
}

export interface UseReaderScrollOptions {
  mainRef: Ref<HTMLElement | null>;
  chapters: ComputedRef<ChapterEntry[]>;
  visibleChapters: ComputedRef<VirtualChapterEntry[]>;
  chapterRefs: Map<string, HTMLElement>;
  chapterHeights: Ref<Map<string, number>>;
  averageHeight: Ref<number>;
  setChapterHeight: (url: string, height: number) => void;
  updateWindow: (index: number) => void;
  readerStore: ReturnType<typeof useReaderStore>;
  autoHideHeader: ComputedRef<boolean>;
  showControls: Ref<boolean>;
  isNavigating: Ref<boolean>;
  scheduleAutoLoadNext: ScheduleAutoLoadNext;
}

export function useReaderScroll(options: UseReaderScrollOptions) {
  const {
    mainRef,
    chapters,
    visibleChapters,
    chapterRefs,
    chapterHeights,
    averageHeight,
    setChapterHeight,
    updateWindow,
    readerStore,
    autoHideHeader,
    showControls,
    isNavigating,
    scheduleAutoLoadNext,
  } = options;

  let lastScrollTop = 0;
  let pendingAutoLoadCheckFrame: number | null = null;
  let pendingScrollSettleTimer: ReturnType<typeof setTimeout> | null = null;

  function queuePostLayoutAutoLoadCheck(): void {
    if (pendingAutoLoadCheckFrame !== null) return;

    if (typeof globalThis.requestAnimationFrame !== 'function') {
      scheduleAutoLoadNext('scroll');
      return;
    }

    pendingAutoLoadCheckFrame = globalThis.requestAnimationFrame(() => {
      pendingAutoLoadCheckFrame = null;
      scheduleAutoLoadNext('scroll');
    });
  }

  function queueScrollSettledAutoLoadCheck(): void {
    if (pendingScrollSettleTimer) {
      clearTimeout(pendingScrollSettleTimer);
    }

    pendingScrollSettleTimer = setTimeout(() => {
      pendingScrollSettleTimer = null;
      scheduleAutoLoadNext('settled');
    }, SCROLL_SETTLE_CHECK_MS);
  }

  function estimateIndexFromOffset(offset: number): number {
    if (chapters.value.length === 0) return -1;

    let acc = 0;
    for (let i = 0; i < chapters.value.length; i++) {
      const url = chapters.value[i].chapter.url;
      const height = chapterHeights.value.get(url) ?? averageHeight.value;
      acc += height;
      if (offset < acc) {
        return i;
      }
    }
    return chapters.value.length - 1;
  }

  function handleScrollCore() {
    const mainEl = mainRef.value;
    if (!mainEl) return;

    const currentScrollY = mainEl.scrollTop;
    const scrollHeight = mainEl.scrollHeight - mainEl.clientHeight;
    const overallPercent =
      scrollHeight > 0 ? Math.round((currentScrollY / scrollHeight) * 100) : 100;

    if (isNavigating.value) {
      readerStore.updateScroll(overallPercent);
      return;
    }

    // Auto-hide controls on scroll down
    if (autoHideHeader.value) {
      if (currentScrollY > lastScrollTop && currentScrollY > 100) {
        // Scrolling down & passed top area
        showControls.value = false;
      } else if (currentScrollY < lastScrollTop - 20) {
        // Scrolling up significantly
        showControls.value = true;
      }
    }
    lastScrollTop = currentScrollY;

    // Find current visible chapter using visible area calculation
    let currentChapterEl: HTMLElement | null = null;
    let currentChapterIdx = -1;
    let maxVisibleHeight = 0;

    const viewportTop = currentScrollY;
    const viewportBottom = currentScrollY + mainEl.clientHeight;

    for (const entry of visibleChapters.value) {
      const el = chapterRefs.get(entry.chapter.url);
      if (!el) continue;

      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const elBottom = elTop + elHeight;

      // Update height cache
      setChapterHeight(entry.chapter.url, elHeight);

      // Calculate visible overlap
      const visibleTop = Math.max(elTop, viewportTop);
      const visibleBottom = Math.min(elBottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        currentChapterIdx = entry.index;
        currentChapterEl = el;
      }
    }

    if (!currentChapterEl || currentChapterIdx === -1) {
      // Fallback: when spacer fills the viewport, estimate index from scroll offset
      const estimatedIdx = estimateIndexFromOffset(currentScrollY + mainEl.clientHeight / 2);
      if (estimatedIdx !== -1) {
        readerStore.setCurrentChapter(estimatedIdx);
        updateWindow(estimatedIdx);
        readerStore.updateScroll(overallPercent);
        scheduleAutoLoadNext('scroll');
        queuePostLayoutAutoLoadCheck();
        queueScrollSettledAutoLoadCheck();
      }
      return;
    }

    // Update current chapter in store (this updates header title and browser URL)
    readerStore.setCurrentChapter(currentChapterIdx);

    // Update virtual window based on current chapter
    updateWindow(currentChapterIdx);

    // Update overall scroll progress for UI
    readerStore.updateScroll(overallPercent);

    // Note: Chapter loading is triggered by sentinel + this scroll gate.
    scheduleAutoLoadNext('scroll');
    queuePostLayoutAutoLoadCheck();
    queueScrollSettledAutoLoadCheck();
  }

  const handleScroll = throttle(handleScrollCore, SCROLL_THROTTLE_MS);

  return { handleScroll, lastScrollTop };
}
