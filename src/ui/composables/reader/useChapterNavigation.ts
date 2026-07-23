/**
 * useChapterNavigation - Composable for chapter navigation logic
 *
 * Handles navigating between chapters, jumping to specific chapters,
 * loading adjacent chapters while preserving context, and keyboard-driven scrolling.
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

type ChapterDirection = 'prev' | 'next';

type ViewportAnchor = {
  top: number;
  url: string;
};

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

  function captureViewportAnchor(
    mainEl: HTMLElement,
    direction: ChapterDirection
  ): ViewportAnchor | null {
    const entries = chapters.value;
    const mainTop = mainEl.getBoundingClientRect().top;
    const mainBottom = mainTop + mainEl.clientHeight;
    const start = direction === 'next' ? entries.length - 1 : 0;
    const step = direction === 'next' ? -1 : 1;

    for (let index = start; index >= 0 && index < entries.length; index += step) {
      const url = entries[index]?.chapter.url;
      const chapterEl = url ? chapterRefs.get(url) : undefined;
      if (!url || !chapterEl) continue;

      const rect = chapterEl.getBoundingClientRect();
      if (rect.bottom > mainTop && rect.top < mainBottom) {
        return { url, top: rect.top - mainTop };
      }
    }

    const fallbackUrl = entries[start]?.chapter.url;
    const fallbackEl = fallbackUrl ? chapterRefs.get(fallbackUrl) : undefined;
    if (!fallbackUrl || !fallbackEl) return null;

    return { url: fallbackUrl, top: fallbackEl.getBoundingClientRect().top - mainTop };
  }

  function restoreViewportAnchor(mainEl: HTMLElement, anchor: ViewportAnchor | null): void {
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

  function showBoundaryEnd(direction: ChapterDirection): void {
    const fallback = direction === 'next' ? '已经是最后一章了' : '已经是第一章了';
    readerStore.showToast(readerStore.getVipBlockedToast(direction) || fallback, 'info');
  }

  async function loadAtBoundary(
    mainEl: HTMLElement,
    direction: ChapterDirection
  ): Promise<boolean> {
    const available = direction === 'next' ? hasNext.value : hasPrev.value;
    if (!available) {
      showBoundaryEnd(direction);
      return false;
    }

    const anchor = captureViewportAnchor(mainEl, direction);

    try {
      const loaded =
        direction === 'next'
          ? await readerStore.loadNextChapter('manual')
          : await readerStore.loadPrevChapter('manual');
      if (!loaded) return false;

      await waitForLayout();
      restoreViewportAnchor(mainEl, anchor);
      return true;
    } catch (error) {
      console.error(`[MNR] Failed to load ${direction} chapter at reader boundary:`, error);
      return false;
    }
  }

  async function loadBoundaryChapter(direction: ChapterDirection): Promise<boolean> {
    const mainEl = mainRef.value;
    if (!mainEl) return false;
    if (isNavigating.value || isLoadingPrev.value || isLoadingNext.value) return false;

    isNavigating.value = true;
    try {
      return await loadAtBoundary(mainEl, direction);
    } finally {
      isNavigating.value = false;
    }
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
   * Turn one reader page while preserving a small overlap for reading continuity.
   * At content boundaries, continue into the adjacent chapter instead of clamping.
   */
  async function turnReaderPage(direction: ChapterDirection): Promise<void> {
    const mainEl = mainRef.value;
    if (!mainEl) return;
    if (isNavigating.value || isLoadingPrev.value || isLoadingNext.value) return;

    const atBoundary = direction === 'next' ? isAtBottom(mainEl) : isAtTop(mainEl);
    if (!atBoundary) {
      scrollByPage(mainEl, direction);
      return;
    }

    isNavigating.value = true;
    let loaded = false;
    try {
      loaded = await loadAtBoundary(mainEl, direction);
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
      if (hasPrev.value) void loadBoundaryChapter('prev');
      return;
    }

    if (e.deltaY > 0 && isAtBottom(mainEl)) {
      preventBoundaryDefault(e);
      if (hasNext.value) void loadBoundaryChapter('next');
    }
  }

  /**
   * Navigate to previous or next chapter
   */
  async function navigateChapter(direction: ChapterDirection) {
    const mainEl = mainRef.value;
    if (!mainEl) return;

    const currentIdx = readerStore.currentChapterIndex;
    const chaptersCount = readerStore.chapters.length;

    // Smart lock: prevent instant double-clicks.
    if (isNavigating.value) {
      return;
    }

    const targetIndex = currentIdx + (direction === 'next' ? 1 : -1);
    if (targetIndex >= 0 && targetIndex < chaptersCount) {
      await jumpToChapter(targetIndex);
      return;
    }

    const available = direction === 'next' ? hasNext.value : hasPrev.value;
    if (!available) {
      showBoundaryEnd(direction);
      return;
    }

    const loading = direction === 'next' ? isLoadingNext.value : isLoadingPrev.value;
    if (loading) return;

    const success =
      direction === 'next'
        ? await readerStore.loadNextChapter('manual')
        : await readerStore.loadPrevChapter('manual');
    if (!success) return;

    const loadedIndex = direction === 'next' ? readerStore.chapters.length - 1 : 0;
    const behavior = direction === 'next' ? 'smooth' : 'auto';
    globalThis.requestAnimationFrame(() => void jumpToChapter(loadedIndex, behavior));
  }

  /**
   * Scroll content by keyboard
   */
  function scrollReader(direction: 'up' | 'down' | 'pageup' | 'pagedown') {
    const mainEl = mainRef.value;
    if (!mainEl) return;

    if (
      (direction === 'up' || direction === 'pageup') &&
      isAtTop(mainEl) &&
      hasPrev.value &&
      !isLoadingPrev.value &&
      !isNavigating.value
    ) {
      void navigateChapter('prev');
      return;
    }

    const step = 150; // slightly more than standard line height
    const pageHeight = mainEl.clientHeight * PAGE_SCROLL_RATIO;

    let top = 0;
    let behavior: 'auto' | 'smooth' = 'auto';

    switch (direction) {
      case 'up':
        top = -step;
        break;
      case 'down':
        top = step;
        break;
      case 'pageup':
        top = -pageHeight;
        behavior = 'smooth';
        break;
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
    loadBoundaryChapter,
    turnReaderPage,
    handleWheel,
    scrollReader,
  };
}
