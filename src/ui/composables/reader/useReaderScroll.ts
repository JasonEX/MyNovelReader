/**
 * useReaderScroll - Composable for scroll handling in the reader view
 *
 * Handles throttled scroll events, scroll direction detection,
 * auto-hide header, chapter visibility calculation, and virtual window updates.
 */

import type { ChapterEntry, useReaderStore } from '@/ui/stores/reader';
import { type ComputedRef, type Ref } from 'vue';
import type { ScheduleAutoLoadNext } from './useReaderAutoLoad';

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
  getOffsetBefore: (index: number) => number;
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
    getOffsetBefore,
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

  function findChapterIndexByOffset(offset: number): number {
    const chapterCount = chapters.value.length;
    if (chapterCount === 0) return -1;

    const target = Math.max(0, offset);
    let low = 0;
    let high = chapterCount - 1;
    let candidate = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (getOffsetBefore(mid) <= target) {
        candidate = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.min(candidate, chapterCount - 1);
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

    const currentChapterIdx = findChapterIndexByOffset(currentScrollY + mainEl.clientHeight / 2);
    if (currentChapterIdx === -1) {
      readerStore.updateScroll(overallPercent);
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
