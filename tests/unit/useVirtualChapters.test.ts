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
});
