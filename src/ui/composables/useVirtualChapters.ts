/**
 * useVirtualChapters - Composable for virtualized chapter rendering
 *
 * Manages virtual window calculation, height caching, and spacer computation
 * for efficient rendering of large chapter lists.
 */

import { computed, type ComputedRef, type Ref, ref, watch } from 'vue';
import type { ChapterEntry } from '@/ui/stores/reader';

export interface VirtualWindow {
  start: number;
  end: number;
}

export interface VirtualChapterEntry extends ChapterEntry {
  index: number;
}

export interface UseVirtualChaptersOptions {
  windowSize?: number;
  overscan?: number;
  defaultHeight?: number;
}

export interface UseVirtualChaptersReturn {
  // State
  virtualWindow: Ref<VirtualWindow>;
  heights: Ref<Map<string, number>>;

  // Computed
  visibleChapters: ComputedRef<VirtualChapterEntry[]>;
  topSpacer: ComputedRef<number>;
  bottomSpacer: ComputedRef<number>;
  totalHeight: ComputedRef<number>;
  averageHeight: ComputedRef<number>;

  // Methods
  setHeight: (url: string, height: number) => void;
  removeHeight: (url: string) => void;
  getOffsetBefore: (index: number) => number;
  updateWindow: (currentIndex: number) => void;
  reset: () => void;
}

export function useVirtualChapters(
  chapters: Ref<ChapterEntry[]>,
  options: UseVirtualChaptersOptions = {}
): UseVirtualChaptersReturn {
  const { windowSize = 5, overscan = 1, defaultHeight = 1200 } = options;

  // === State ===
  const heights = ref(new Map<string, number>());
  const virtualWindow = ref<VirtualWindow>({ start: 0, end: windowSize });

  // === Computed ===
  const totalHeight = computed(() =>
    Array.from(heights.value.values()).reduce((sum, h) => sum + h, 0)
  );

  const averageHeight = computed(() =>
    heights.value.size > 0 ? totalHeight.value / heights.value.size : defaultHeight
  );

  // The actual rendered range includes overscan; keep it in one place so
  // spacers and visible list stay aligned.
  const visibleRange = computed(() => {
    const start = Math.max(0, virtualWindow.value.start - overscan);
    const end = Math.min(chapters.value.length, virtualWindow.value.end + overscan);
    return { start, end };
  });

  const visibleChapters = computed<VirtualChapterEntry[]>(() => {
    const { start, end } = visibleRange.value;
    return chapters.value.slice(start, end).map((entry, idx) => ({
      ...entry,
      index: start + idx,
    }));
  });

  const topSpacer = computed(() => getOffsetBefore(visibleRange.value.start));

  const bottomSpacer = computed(() => {
    const endOffset = getOffsetBefore(visibleRange.value.end);
    return Math.max(0, totalHeight.value - endOffset);
  });

  // === Methods ===
  function setHeight(url: string, height: number): void {
    const prev = heights.value.get(url);
    if (prev !== height) {
      heights.value.set(url, height);
    }
  }

  function removeHeight(url: string): void {
    heights.value.delete(url);
  }

  function getOffsetBefore(index: number): number {
    if (index <= 0) return 0;
    let offset = 0;
    const len = Math.min(index, chapters.value.length);
    for (let i = 0; i < len; i++) {
      const url = chapters.value[i].chapter.url;
      offset += heights.value.get(url) ?? averageHeight.value;
    }
    return offset;
  }

  function updateWindow(currentIndex: number): void {
    const halfWindow = Math.floor(windowSize / 2);
    virtualWindow.value = {
      start: Math.max(0, currentIndex - halfWindow),
      end: Math.min(chapters.value.length, currentIndex + halfWindow + 1),
    };
  }

  function reset(): void {
    heights.value.clear();
    virtualWindow.value = { start: 0, end: windowSize };
  }

  // === Watchers ===
  // Initialize window when chapters are first loaded
  watch(
    chapters,
    newChapters => {
      if (newChapters.length > 0 && virtualWindow.value.end === 0) {
        virtualWindow.value = {
          start: 0,
          end: Math.min(newChapters.length, windowSize),
        };
      }
    },
    { immediate: true }
  );

  return {
    // State
    virtualWindow,
    heights,

    // Computed
    visibleChapters,
    topSpacer,
    bottomSpacer,
    totalHeight,
    averageHeight,

    // Methods
    setHeight,
    removeHeight,
    getOffsetBefore,
    updateWindow,
    reset,
  };
}
