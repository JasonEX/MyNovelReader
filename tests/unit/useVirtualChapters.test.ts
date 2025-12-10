/* eslint-disable sort-imports */
import { useVirtualChapters } from '@/ui/composables/useVirtualChapters';
import type { ChapterEntry } from '@/ui/stores/reader';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { ref } from 'vue';

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
});
