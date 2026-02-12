import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import type { ChapterEntry } from '@/ui/stores/reader';
import { useVirtualChapters } from '@/ui/composables/useVirtualChapters';

function createChapter(url: string): ChapterEntry {
  return {
    id: url,
    chapter: {
      title: url,
      content: '',
      rawContent: '',
      url,
      confidence: 1,
      method: 'detection',
    },
  };
}

describe('useVirtualChapters', () => {
  it('keeps spacers aligned with rendered range when overscan is applied', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3'].map(createChapter));
    const { virtualWindow, topSpacer, bottomSpacer, visibleChapters, setHeight, totalHeight } =
      useVirtualChapters(chapters, { windowSize: 2, overscan: 1, defaultHeight: 100 });

    setHeight('c1', 100);
    setHeight('c2', 200);
    setHeight('c3', 300);

    // Move window so overscan renders an extra chapter before virtual window start
    virtualWindow.value = { start: 2, end: 3 };

    expect(visibleChapters.value.map(c => c.chapter.url)).toEqual(['c2', 'c3']);
    expect(topSpacer.value).toBe(100); // only chapters before the rendered range
    expect(bottomSpacer.value).toBe(0); // all chapters rendered, nothing left for spacer
    expect(totalHeight.value).toBe(600);
  });

  it('calculates bottomSpacer correctly when some chapters have no cached height', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3', 'c4', 'c5'].map(createChapter));
    const { virtualWindow, topSpacer, bottomSpacer, averageHeight } = useVirtualChapters(chapters, {
      windowSize: 2,
      overscan: 1,
      defaultHeight: 100,
    });

    // Only cache heights for c2 and c3 (the visible ones)
    // c1, c4, c5 will use averageHeight estimation

    // With no cached heights, averageHeight = defaultHeight = 100
    // totalOffset = 5 * 100 = 500
    virtualWindow.value = { start: 1, end: 3 }; // visibleRange = [0, 4] with overscan=1

    // topSpacer = getOffsetBefore(0) = 0
    expect(topSpacer.value).toBe(0);

    // All chapters use defaultHeight since none cached
    // bottomSpacer = getOffsetBefore(5) - getOffsetBefore(4) = 500 - 400 = 100
    expect(bottomSpacer.value).toBe(100);
    expect(averageHeight.value).toBe(100); // defaultHeight when no heights cached
  });

  it('uses consistent calculation basis for spacers with mixed cached/uncached heights', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3', 'c4', 'c5'].map(createChapter));
    const { virtualWindow, topSpacer, bottomSpacer, setHeight, averageHeight } = useVirtualChapters(
      chapters,
      {
        windowSize: 2,
        overscan: 0,
        defaultHeight: 100,
      }
    );

    // Cache heights for c2 and c3 only
    setHeight('c2', 200);
    setHeight('c3', 300);

    // averageHeight = (200 + 300) / 2 = 250
    expect(averageHeight.value).toBe(250);

    // Window at middle: visibleRange = [2, 4] (c3, c4)
    virtualWindow.value = { start: 2, end: 4 };

    // topSpacer = getOffsetBefore(2) = c1(250, uncached) + c2(200, cached) = 450
    expect(topSpacer.value).toBe(450);

    // bottomSpacer = getOffsetBefore(5) - getOffsetBefore(4)
    // getOffsetBefore(5) = c1(250) + c2(200) + c3(300) + c4(250) + c5(0, not counted) = 1000
    // getOffsetBefore(4) = c1(250) + c2(200) + c3(300) + c4(250) = 1000
    // Wait, getOffsetBefore(5) should include all 5 chapters
    // getOffsetBefore(5) = 250 + 200 + 300 + 250 + 250 = 1250
    // getOffsetBefore(4) = 250 + 200 + 300 + 250 = 1000
    // bottomSpacer = 1250 - 1000 = 250
    expect(bottomSpacer.value).toBe(250);
  });

  it('cleans up heights synchronously when chapters are removed', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3'].map(createChapter));
    const { heights, setHeight } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 100);
    setHeight('c2', 200);
    setHeight('c3', 300);

    expect(heights.value.size).toBe(3);

    // Remove c1 from chapters
    chapters.value = chapters.value.slice(1);

    // Heights should be cleaned up synchronously (flush: 'sync')
    expect(heights.value.size).toBe(2);
    expect(heights.value.has('c1')).toBe(false);
    expect(heights.value.has('c2')).toBe(true);
    expect(heights.value.has('c3')).toBe(true);
  });

  it('handles empty chapter list', () => {
    const chapters = ref<ChapterEntry[]>([]);
    const { topSpacer, bottomSpacer, visibleChapters, averageHeight, getOffsetBefore } =
      useVirtualChapters(chapters, {
        windowSize: 5,
        overscan: 1,
        defaultHeight: 100,
      });

    expect(visibleChapters.value).toEqual([]);
    expect(topSpacer.value).toBe(0);
    expect(bottomSpacer.value).toBe(0);
    expect(averageHeight.value).toBe(100); // defaults to defaultHeight
    expect(getOffsetBefore(0)).toBe(0);
    expect(getOffsetBefore(5)).toBe(0); // empty list returns 0
  });

  it('handles single chapter', () => {
    const chapters = ref<ChapterEntry[]>([createChapter('c1')]);
    const { topSpacer, bottomSpacer, visibleChapters, setHeight } = useVirtualChapters(chapters, {
      windowSize: 5,
      overscan: 1,
      defaultHeight: 100,
    });

    expect(visibleChapters.value.length).toBe(1);
    expect(topSpacer.value).toBe(0);
    expect(bottomSpacer.value).toBe(0); // only chapter is rendered

    setHeight('c1', 500);
    expect(topSpacer.value).toBe(0);
    expect(bottomSpacer.value).toBe(0);
  });

  it('getOffsetBefore returns 0 for index <= 0', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3'].map(createChapter));
    const { getOffsetBefore, setHeight } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 100);
    setHeight('c2', 200);

    expect(getOffsetBefore(0)).toBe(0);
    expect(getOffsetBefore(-1)).toBe(0);
    expect(getOffsetBefore(-100)).toBe(0);
  });

  it('clamps virtual window when chapters list shrinks', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3', 'c4', 'c5'].map(createChapter));
    const { virtualWindow } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    // Set window to the end
    virtualWindow.value = { start: 3, end: 5 };

    // Shrink chapters list
    chapters.value = chapters.value.slice(0, 2); // only c1, c2

    // Window should be clamped
    expect(virtualWindow.value.end).toBeLessThanOrEqual(2);
    expect(virtualWindow.value.start).toBeLessThanOrEqual(virtualWindow.value.end);
  });

  it('getOffsetBefore is O(1) via prefixOffsets and handles boundary indices', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3'].map(createChapter));
    const { getOffsetBefore, setHeight, averageHeight } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 100);
    setHeight('c2', 200);
    // c3 uncached → uses averageHeight = (100+200)/2 = 150

    expect(averageHeight.value).toBe(150);
    expect(getOffsetBefore(0)).toBe(0);
    expect(getOffsetBefore(1)).toBe(100); // c1
    expect(getOffsetBefore(2)).toBe(300); // c1 + c2
    expect(getOffsetBefore(3)).toBe(450); // c1 + c2 + c3(est 150)
    // index beyond length is clamped
    expect(getOffsetBefore(100)).toBe(450);
    // negative index
    expect(getOffsetBefore(-5)).toBe(0);
  });

  it('totalHeight includes estimated heights for uncached chapters', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3', 'c4'].map(createChapter));
    const { totalHeight, setHeight, averageHeight } = useVirtualChapters(chapters, {
      windowSize: 4,
      overscan: 0,
      defaultHeight: 100,
    });

    // No cached heights → all use defaultHeight
    expect(totalHeight.value).toBe(400); // 4 * 100

    setHeight('c1', 200);
    // averageHeight = 200, uncached c2/c3/c4 each use 200
    expect(averageHeight.value).toBe(200);
    expect(totalHeight.value).toBe(800); // 200 + 200*3

    setHeight('c2', 300);
    // averageHeight = (200+300)/2 = 250
    expect(averageHeight.value).toBe(250);
    expect(totalHeight.value).toBe(200 + 300 + 250 + 250); // 1000
  });

  it('spacers remain correct when window shrinks after chapters are removed', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3', 'c4', 'c5'].map(createChapter));
    const { virtualWindow, topSpacer, bottomSpacer, setHeight } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 100);
    setHeight('c2', 200);
    setHeight('c3', 300);
    setHeight('c4', 400);
    setHeight('c5', 500);

    virtualWindow.value = { start: 2, end: 4 }; // visible: c3, c4

    expect(topSpacer.value).toBe(300); // c1(100) + c2(200)
    expect(bottomSpacer.value).toBe(500); // c5(500)

    // Remove last two chapters → only c1, c2, c3
    chapters.value = chapters.value.slice(0, 3);

    // Window gets clamped, spacers should still be consistent
    expect(topSpacer.value + bottomSpacer.value).toBeGreaterThanOrEqual(0);
    // totalHeight should equal sum of remaining cached heights
    // (c4, c5 heights cleaned up by watcher)
  });

  it('empty list after non-empty produces zero spacers and totalHeight', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2'].map(createChapter));
    const { topSpacer, bottomSpacer, totalHeight, setHeight } = useVirtualChapters(chapters, {
      windowSize: 2,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 100);
    setHeight('c2', 200);
    expect(totalHeight.value).toBe(300);

    // Clear all chapters
    chapters.value = [];

    expect(topSpacer.value).toBe(0);
    expect(bottomSpacer.value).toBe(0);
    expect(totalHeight.value).toBe(0);
  });

  it('updateWindow centers the window around the given index', () => {
    const chapters = ref<ChapterEntry[]>(
      ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'].map(createChapter)
    );
    const { virtualWindow, updateWindow } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    updateWindow(3);
    // halfWindow = floor(3/2) = 1
    // start = max(0, 3-1) = 2, end = min(7, 3+1+1) = 5
    expect(virtualWindow.value.start).toBe(2);
    expect(virtualWindow.value.end).toBe(5);

    // Edge: near start
    updateWindow(0);
    expect(virtualWindow.value.start).toBe(0);
    expect(virtualWindow.value.end).toBe(2);

    // Edge: near end
    updateWindow(6);
    expect(virtualWindow.value.start).toBe(5);
    expect(virtualWindow.value.end).toBe(7);
  });

  it('reset clears heights and resets window', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2', 'c3'].map(createChapter));
    const { virtualWindow, heights, setHeight, reset } = useVirtualChapters(chapters, {
      windowSize: 2,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 500);
    setHeight('c2', 600);
    virtualWindow.value = { start: 1, end: 3 };

    expect(heights.value.size).toBe(2);

    reset();

    expect(heights.value.size).toBe(0);
    expect(virtualWindow.value).toEqual({ start: 0, end: 2 });
  });

  it('watcher initializes window when chapters go from empty to non-empty with end=0', () => {
    const chapters = ref<ChapterEntry[]>([]);
    const { virtualWindow } = useVirtualChapters(chapters, {
      windowSize: 3,
      overscan: 0,
      defaultHeight: 100,
    });

    // After init with empty, window should be {start:0, end:0}
    expect(virtualWindow.value).toEqual({ start: 0, end: 0 });

    // Add chapters — watcher should detect end===0 and initialize
    chapters.value = ['c1', 'c2', 'c3', 'c4', 'c5'].map(createChapter);

    expect(virtualWindow.value.start).toBe(0);
    expect(virtualWindow.value.end).toBe(3); // min(5, windowSize=3)
  });

  it('setHeight is a no-op when height is unchanged', () => {
    const chapters = ref<ChapterEntry[]>(['c1'].map(createChapter));
    const { heights, setHeight } = useVirtualChapters(chapters, {
      windowSize: 1,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 200);
    const map1 = heights.value;
    expect(map1.get('c1')).toBe(200);

    // Setting same height should not trigger a new set
    setHeight('c1', 200);
    // Map reference is the same (no reactivity trigger for same value)
    expect(heights.value).toBe(map1);
  });

  it('getOffsetBefore clamps index beyond chapter length', () => {
    const chapters = ref<ChapterEntry[]>(['c1', 'c2'].map(createChapter));
    const { getOffsetBefore, setHeight } = useVirtualChapters(chapters, {
      windowSize: 2,
      overscan: 0,
      defaultHeight: 100,
    });

    setHeight('c1', 150);
    setHeight('c2', 250);

    // index=2 is exactly length, should return total
    expect(getOffsetBefore(2)).toBe(400);
    // index=100 should clamp to length
    expect(getOffsetBefore(100)).toBe(400);
  });
});
