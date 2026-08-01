/**
 * useChapterNavigation - Composable for chapter navigation logic
 *
 * Handles navigating between chapters, jumping to specific chapters,
 * loading adjacent chapters while preserving context, and keyboard-driven scrolling.
 */

import { nextTick, type Ref } from 'vue';
import type { useReaderStore } from '@/ui/stores/reader';

export interface UseChapterNavigationOptions {
  mainRef: Ref<HTMLElement | null>;
  chapterRefs: Map<string, HTMLElement>;
  readerStore: ReturnType<typeof useReaderStore>;
  isNavigating: Ref<boolean>;
  onViewportSettled: () => void;
}

type ChapterDirection = 'prev' | 'next';
type ReaderMoveMode = 'line' | 'page';

type ViewportAnchor = {
  top: number;
  url: string;
};

const SCROLL_BOUNDARY_EPSILON_PX = 4;
const SMOOTH_NAVIGATION_LOCK_MS = 650;
const PAGE_SCROLL_RATIO = 0.9;
const LINE_SCROLL_STEP_PX = 150;

export function useChapterNavigation(options: UseChapterNavigationOptions) {
  const { mainRef, chapterRefs, readerStore, isNavigating, onViewportSettled } = options;

  function scrollByPage(mainEl: HTMLElement, direction: 'prev' | 'next'): void {
    isNavigating.value = true;
    mainEl.scrollBy({
      top: mainEl.clientHeight * PAGE_SCROLL_RATIO * (direction === 'next' ? 1 : -1),
      behavior: 'smooth',
    });
    setTimeout(() => {
      isNavigating.value = false;
      onViewportSettled();
    }, SMOOTH_NAVIGATION_LOCK_MS);
  }

  function scrollByLine(mainEl: HTMLElement, direction: ChapterDirection): void {
    mainEl.scrollBy({
      top: LINE_SCROLL_STEP_PX * (direction === 'next' ? 1 : -1),
      behavior: 'auto',
    });
  }

  async function waitForLayout(): Promise<void> {
    await nextTick();
    await new Promise<void>(resolve => globalThis.requestAnimationFrame(() => resolve()));
  }

  function captureViewportAnchor(
    mainEl: HTMLElement,
    direction: ChapterDirection
  ): ViewportAnchor | null {
    const entries = readerStore.chapters;
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
    const available = direction === 'next' ? readerStore.hasNext : readerStore.hasPrev;
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
    if (isNavigating.value || readerStore.isLoadingPrev || readerStore.isLoadingNext) return false;

    isNavigating.value = true;
    try {
      return await loadAtBoundary(mainEl, direction);
    } finally {
      isNavigating.value = false;
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
      chapterRefs.get(url)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (index < 0 || index >= readerStore.chapters.length) return;

    isNavigating.value = true;

    await waitForLayout();

    const url = readerStore.chapters[index]?.chapter.url;
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

  /** Coordinate scrolling, boundary loading and the shared navigation lock. */
  async function moveReader(direction: ChapterDirection, mode: ReaderMoveMode): Promise<void> {
    const mainEl = mainRef.value;
    if (!mainEl) return;
    if (isNavigating.value) return;

    const atBoundary = direction === 'next' ? isAtBottom(mainEl) : isAtTop(mainEl);
    if (!atBoundary) {
      if (mode === 'page') scrollByPage(mainEl, direction);
      else scrollByLine(mainEl, direction);
      return;
    }

    if (readerStore.isLoadingPrev || readerStore.isLoadingNext) return;

    const available = direction === 'next' ? readerStore.hasNext : readerStore.hasPrev;
    if (!available) {
      if (mode === 'page') showBoundaryEnd(direction);
      return;
    }

    isNavigating.value = true;
    let loaded = false;
    let pageScrollStarted = false;
    try {
      loaded = await loadAtBoundary(mainEl, direction);
      if (!loaded) return;

      if (mode === 'page') {
        scrollByPage(mainEl, direction);
        pageScrollStarted = true;
      } else {
        scrollByLine(mainEl, direction);
      }
    } finally {
      if (!pageScrollStarted) {
        isNavigating.value = false;
        if (loaded) onViewportSettled();
      }
    }
  }

  /**
   * Turn one reader page while preserving a small overlap for reading continuity.
   * At content boundaries, continue into the adjacent chapter instead of clamping.
   */
  function turnReaderPage(direction: ChapterDirection): Promise<void> {
    return moveReader(direction, 'page');
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
      if (readerStore.hasPrev) void loadBoundaryChapter('prev');
      return;
    }

    if (e.deltaY > 0 && isAtBottom(mainEl)) {
      preventBoundaryDefault(e);
      if (readerStore.hasNext) void loadBoundaryChapter('next');
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

    const available = direction === 'next' ? readerStore.hasNext : readerStore.hasPrev;
    if (!available) {
      showBoundaryEnd(direction);
      return;
    }

    const loading = direction === 'next' ? readerStore.isLoadingNext : readerStore.isLoadingPrev;
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
   * Scroll one line while preserving continuous-reading semantics at chapter boundaries.
   */
  function scrollReader(direction: 'up' | 'down'): Promise<void> {
    return moveReader(direction === 'down' ? 'next' : 'prev', 'line');
  }

  return {
    navigateChapter,
    jumpToChapter,
    jumpToCachedChapter,
    loadBoundaryChapter,
    turnReaderPage,
    handleWheel,
    scrollReader,
  };
}
