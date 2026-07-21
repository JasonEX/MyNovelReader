/**
 * useChapterNavigation - Composable for chapter navigation logic
 *
 * Handles navigating between chapters, jumping to specific chapters,
 * loading previous chapters with scroll adjustment, and keyboard-driven scrolling.
 */

import type { ChapterEntry, useReaderStore } from '@/ui/stores/reader';
import { type ComputedRef, nextTick, type Ref } from 'vue';

export interface UseChapterNavigationOptions {
  mainRef: Ref<HTMLElement | null>;
  chapters: ComputedRef<ChapterEntry[]>;
  chapterRefs: Map<string, HTMLElement>;
  readerStore: ReturnType<typeof useReaderStore>;
  isNavigating: Ref<boolean>;
  isLoadingPrev: ComputedRef<boolean>;
  isLoadingNext: ComputedRef<boolean>;
  hasPrev: ComputedRef<boolean>;
  hasNext: ComputedRef<boolean>;
  onPageTurnSettled: () => void;
}

const SCROLL_BOUNDARY_EPSILON_PX = 4;
const SMOOTH_NAVIGATION_LOCK_MS = 650;
const PAGE_SCROLL_RATIO = 0.9;

export function useChapterNavigation(options: UseChapterNavigationOptions) {
  const {
    mainRef,
    chapters,
    chapterRefs,
    readerStore,
    isNavigating,
    isLoadingPrev,
    isLoadingNext,
    hasPrev,
    hasNext,
    onPageTurnSettled,
  } = options;

  let isLoadingPrevLocal = false;

  function scrollByPage(mainEl: HTMLElement, direction: 'prev' | 'next'): void {
    isNavigating.value = true;
    mainEl.scrollBy({
      top: mainEl.clientHeight * PAGE_SCROLL_RATIO * (direction === 'next' ? 1 : -1),
      behavior: 'smooth',
    });
    setTimeout(() => {
      isNavigating.value = false;
      onPageTurnSettled();
    }, SMOOTH_NAVIGATION_LOCK_MS);
  }

  async function waitForLayout(): Promise<void> {
    await nextTick();
    await new Promise<void>(resolve => globalThis.requestAnimationFrame(() => resolve()));
  }

  function captureChapterAnchor(
    mainEl: HTMLElement,
    url: string | undefined
  ): { url: string; top: number } | null {
    if (!url) return null;

    const chapterEl = chapterRefs.get(url);
    if (!chapterEl) return null;

    return {
      url,
      top: chapterEl.getBoundingClientRect().top - mainEl.getBoundingClientRect().top,
    };
  }

  function restoreChapterAnchor(
    mainEl: HTMLElement,
    anchor: { url: string; top: number } | null
  ): void {
    if (!anchor) return;

    const chapterEl = chapterRefs.get(anchor.url);
    if (!chapterEl) return;

    const nextTop = chapterEl.getBoundingClientRect().top - mainEl.getBoundingClientRect().top;
    mainEl.scrollTop += nextTop - anchor.top;
  }

  function isAtTop(mainEl: HTMLElement): boolean {
    return mainEl.scrollTop <= SCROLL_BOUNDARY_EPSILON_PX;
  }

  function isAtBottom(mainEl: HTMLElement): boolean {
    return (
      mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight) <= SCROLL_BOUNDARY_EPSILON_PX
    );
  }

  function preventBoundaryDefault(e: WheelEvent): void {
    if (e.cancelable === false) return;
    if (typeof e.preventDefault !== 'function') return;
    e.preventDefault();
  }

  function loadNextAtBoundary(): void {
    if (!hasNext.value) return;
    if (isLoadingNext.value || isLoadingPrev.value || isNavigating.value) return;

    void readerStore.loadNextChapter('manual');
  }

  /**
   * Scroll to a specific chapter in the view
   */
  function scrollToChapter(index: number) {
    const url = chapters.value[index]?.chapter.url;
    if (!url) return;

    const chapterEl = chapterRefs.get(url);
    if (chapterEl) {
      chapterEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Jump to a cached chapter without page reload
   */
  async function jumpToCachedChapter(url: string) {
    // First check if already in the current chapters array
    const existingIndex = readerStore.chapters.findIndex(entry => entry.chapter.url === url);

    if (existingIndex >= 0) {
      // Already in display list - just scroll to it
      readerStore.setCurrentChapter(existingIndex);
      scrollToChapter(existingIndex);
      return;
    }

    // Not in current chapters - rebuild from cache
    const success = await readerStore.rebuildChaptersAround(url);
    if (success) {
      // Scroll to top
      mainRef.value?.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      // Fallback to page navigation if cache miss
      window.location.href = url;
    }
  }

  /**
   * Jump to a specific chapter by index
   */
  async function jumpToChapter(index: number, behavior: 'auto' | 'smooth' = 'smooth') {
    const mainEl = mainRef.value;
    if (!mainEl) return;
    if (index < 0 || index >= chapters.value.length) return;

    isNavigating.value = true;

    await waitForLayout();

    const url = chapters.value[index]?.chapter.url;
    if (!url) {
      isNavigating.value = false;
      return;
    }

    const targetEl = chapterRefs.get(url);
    if (!targetEl) {
      isNavigating.value = false;
      return;
    }

    const containerRect = mainEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const targetOffset = targetRect.top - containerRect.top + mainEl.scrollTop;
    mainEl.scrollTo({
      top: targetOffset,
      behavior,
    });

    // Update current chapter index
    readerStore.setCurrentChapter(index);

    // Reset navigating flag
    if (behavior === 'smooth') {
      setTimeout(() => {
        isNavigating.value = false;
      }, SMOOTH_NAVIGATION_LOCK_MS);
    } else {
      // Immediate reset for auto scroll
      globalThis.requestAnimationFrame(() => {
        isNavigating.value = false;
      });
    }
  }

  /**
   * Load previous chapter with scroll position adjustment
   * jumpToStart: true => snap to the start (title) of the newly loaded chapter to avoid bounce
   */
  async function loadPrevWithScrollAdjust(jumpToStart = false): Promise<boolean> {
    const mainEl = mainRef.value;
    if (!mainEl || isLoadingPrev.value || isLoadingPrevLocal) return false;

    isLoadingPrevLocal = true;

    try {
      // Remember the current position so prepending a chapter does not move the visible text.
      const oldScrollTop = mainEl.scrollTop;

      const success = await readerStore.loadPrevChapter('manual');

      if (success) {
        await waitForLayout();

        if (jumpToStart) {
          // When user explicitly wants to go to previous chapter, snap to its title
          await jumpToChapter(0, 'auto');
          return true;
        }

        const chapterEls = mainEl.querySelectorAll('.mnr-reader-content');
        if (chapterEls.length > 0) {
          const newChapterEl = chapterEls[0] as HTMLElement;
          const newChapterHeight = newChapterEl.offsetHeight;
          mainEl.scrollTop = oldScrollTop + newChapterHeight;
        }

        return true;
      }

      return false;
    } finally {
      isLoadingPrevLocal = false;
    }
  }

  /**
   * Turn one reader page while preserving a small overlap for reading continuity.
   * At content boundaries, continue into the adjacent chapter instead of clamping.
   */
  async function turnReaderPage(direction: 'prev' | 'next'): Promise<void> {
    const mainEl = mainRef.value;
    if (!mainEl) return;
    if (isNavigating.value || isLoadingPrev.value || isLoadingNext.value) return;

    if (direction === 'next') {
      if (!isAtBottom(mainEl)) {
        scrollByPage(mainEl, direction);
        return;
      }

      if (!hasNext.value) {
        readerStore.showToast(readerStore.getVipBlockedToast('next') || '已经是最后一章了', 'info');
        return;
      }

      isNavigating.value = true;
      let loaded = false;
      const tailUrl = chapters.value[chapters.value.length - 1]?.chapter.url;
      const anchor = captureChapterAnchor(mainEl, tailUrl);
      try {
        loaded = await readerStore.loadNextChapter('manual');
        if (loaded) {
          await waitForLayout();
          restoreChapterAnchor(mainEl, anchor);
          scrollByPage(mainEl, direction);
        }
      } finally {
        if (!loaded) isNavigating.value = false;
      }
      return;
    }

    if (!isAtTop(mainEl)) {
      scrollByPage(mainEl, direction);
      return;
    }

    if (!hasPrev.value) {
      readerStore.showToast(readerStore.getVipBlockedToast('prev') || '已经是第一章了', 'info');
      return;
    }

    isNavigating.value = true;
    let loaded = false;
    try {
      loaded = await loadPrevWithScrollAdjust();
      if (loaded) scrollByPage(mainEl, direction);
    } finally {
      if (!loaded) isNavigating.value = false;
    }
  }

  /**
   * Handle wheel event at scroll boundaries.
   * Preventing the default boundary wheel is required to keep the host page from
   * receiving the gesture after the reader's internal scroller reaches its edge.
   */
  function handleWheel(e: WheelEvent) {
    const mainEl = mainRef.value;
    if (!mainEl) return;

    if (e.deltaY < 0 && isAtTop(mainEl)) {
      preventBoundaryDefault(e);
      if (hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
        loadPrevWithScrollAdjust();
      }
      return;
    }

    if (e.deltaY > 0 && isAtBottom(mainEl)) {
      preventBoundaryDefault(e);
      loadNextAtBoundary();
    }
  }

  /**
   * Navigate to previous or next chapter
   */
  async function navigateChapter(direction: 'prev' | 'next') {
    const mainEl = mainRef.value;
    if (!mainEl) return;

    const currentIdx = readerStore.currentChapterIndex;
    const chaptersCount = readerStore.chapters.length;

    // Smart lock: prevent instant double-clicks.
    if (isNavigating.value) {
      return;
    }

    if (direction === 'prev') {
      if (currentIdx > 0) {
        await jumpToChapter(currentIdx - 1);
      } else if (hasPrev.value && !isLoadingPrev.value) {
        const success = await readerStore.loadPrevChapter('manual');
        if (success) {
          // Use auto scroll to prevent bounce/race condition with top observer
          globalThis.requestAnimationFrame(() => jumpToChapter(0, 'auto'));
        }
      } else if (!hasPrev.value) {
        // Show toast when no previous chapter available
        readerStore.showToast(readerStore.getVipBlockedToast('prev') || '已经是第一章了', 'info');
      }
    } else {
      if (currentIdx < chaptersCount - 1) {
        await jumpToChapter(currentIdx + 1);
      } else if (hasNext.value && !isLoadingNext.value) {
        const success = await readerStore.loadNextChapter('manual');
        if (success) {
          globalThis.requestAnimationFrame(() => jumpToChapter(readerStore.chapters.length - 1));
        }
      } else if (!hasNext.value) {
        // Show toast when no next chapter available
        readerStore.showToast(readerStore.getVipBlockedToast('next') || '已经是最后一章了', 'info');
      }
    }
  }

  /**
   * Scroll content by keyboard
   */
  function scrollReader(direction: 'up' | 'down' | 'pageup' | 'pagedown') {
    const mainEl = mainRef.value;
    if (!mainEl) return;

    const step = 150; // slightly more than standard line height
    const pageHeight = mainEl.clientHeight * PAGE_SCROLL_RATIO;

    let top = 0;
    let behavior: 'auto' | 'smooth' = 'auto';

    switch (direction) {
      case 'up': {
        // If already at the very top, load previous chapter
        if (mainEl.scrollTop <= 4 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
          loadPrevWithScrollAdjust(true);
          return;
        }
        top = -step;
        break;
      }
      case 'down':
        top = step;
        break;
      case 'pageup': {
        // If already at the very top, directly load previous chapter and snap to its title
        if (mainEl.scrollTop <= 4 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
          loadPrevWithScrollAdjust(true);
          return;
        }
        top = -pageHeight;
        behavior = 'smooth';
        break;
      }
      case 'pagedown':
        top = pageHeight;
        behavior = 'smooth';
        break;
    }

    mainEl.scrollBy({ top, behavior });
  }

  return {
    navigateChapter,
    jumpToChapter,
    jumpToCachedChapter,
    scrollToChapter,
    loadPrevWithScrollAdjust,
    turnReaderPage,
    handleWheel,
    scrollReader,
  };
}
