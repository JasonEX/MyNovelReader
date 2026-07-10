import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { JSDOM } from 'jsdom';

import type { ChapterEntry } from '@/ui/stores/reader';
import { saveReadingPosition } from '@/ui/stores/reader/readingPosition';
import { useReaderScroll } from '@/ui/composables/reader/useReaderScroll';

vi.mock('@/ui/stores/reader/readingPosition', () => ({ saveReadingPosition: vi.fn() }));

describe('useReaderScroll', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    vi.mocked(saveReadingPosition).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function makeEntry(url: string): ChapterEntry {
    return {
      chapter: { url, content: '', title: '', prevUrl: '', nextUrl: '' } as any,
      id: `chapter-${url}`,
    };
  }

  function createMain(scrollTop = 200, clientHeight = 600, scrollHeight = 2400) {
    const element = document.createElement('main');
    Object.defineProperties(element, {
      scrollTop: { value: scrollTop, writable: true, configurable: true },
      clientHeight: { value: clientHeight, configurable: true },
      scrollHeight: { value: scrollHeight, configurable: true },
    });
    element.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0, bottom: clientHeight });
    return element;
  }

  function createOptions(overrides: Record<string, any> = {}) {
    const entries = overrides.chapters || [];
    const readerStore = {
      currentChapterIndex: overrides.currentChapterIndex ?? 0,
      setCurrentChapter: vi.fn(),
      updateScroll: vi.fn(),
      ...overrides.readerStore,
    };
    return {
      mainRef: ref<HTMLElement | null>(overrides.mainRef ?? null),
      chapters: computed(() => entries),
      chapterRefs: overrides.chapterRefs || new Map<string, HTMLElement>(),
      readerStore: readerStore as any,
      autoHideHeader: computed(() => overrides.autoHideHeader ?? false),
      showControls: ref(overrides.showControls ?? true),
      isNavigating: ref(overrides.isNavigating ?? false),
      scheduleAutoLoadNext: vi.fn(),
    };
  }

  it('does nothing without a reader element', () => {
    const options = createOptions();
    useReaderScroll(options).handleScroll();
    expect(options.readerStore.updateScroll).not.toHaveBeenCalled();
  });

  it('tracks the chapter under the viewport center and saves chapter-local progress', () => {
    const main = createMain(200, 600, 1800);
    const entry = makeEntry('https://example.com/chapter/1');
    const article = document.createElement('article');
    Object.defineProperty(article, 'offsetHeight', { value: 1200 });
    article.getBoundingClientRect = vi.fn().mockReturnValue({ top: -200, bottom: 1000 });
    const chapterRefs = new Map([[entry.chapter.url, article]]);
    const options = createOptions({ mainRef: main, chapters: [entry], chapterRefs });

    useReaderScroll(options).handleScroll();

    expect(options.readerStore.setCurrentChapter).toHaveBeenCalledWith(0);
    expect(options.readerStore.updateScroll).toHaveBeenCalledWith(expect.closeTo(22.22, 1));
    expect(saveReadingPosition).toHaveBeenCalledWith(entry.chapter.url, expect.closeTo(22.22, 1));
    expect(options.scheduleAutoLoadNext).toHaveBeenCalledWith('scroll');
  });

  it('treats a chapter that fits in the viewport as fully read', () => {
    const main = createMain(0, 700, 700);
    const entry = makeEntry('https://example.com/chapter/1');
    const article = document.createElement('article');
    Object.defineProperty(article, 'offsetHeight', { value: 500 });
    article.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0, bottom: 500 });
    const options = createOptions({
      mainRef: main,
      chapters: [entry],
      chapterRefs: new Map([[entry.chapter.url, article]]),
    });

    useReaderScroll(options).handleScroll();
    expect(options.readerStore.updateScroll).toHaveBeenCalledWith(100);
  });

  it('does not change chapters or schedule loading during programmatic navigation', () => {
    const main = createMain(900, 600, 3000);
    const options = createOptions({ mainRef: main, isNavigating: true });

    useReaderScroll(options).handleScroll();

    expect(options.readerStore.updateScroll).toHaveBeenCalledWith(37.5);
    expect(options.readerStore.setCurrentChapter).not.toHaveBeenCalled();
    expect(options.scheduleAutoLoadNext).not.toHaveBeenCalled();
  });

  it('falls back to container progress before chapter refs are mounted', () => {
    const main = createMain(450, 600, 2400);
    const options = createOptions({
      mainRef: main,
      chapters: [makeEntry('https://example.com/1')],
    });

    useReaderScroll(options).handleScroll();

    expect(options.readerStore.setCurrentChapter).not.toHaveBeenCalled();
    expect(options.readerStore.updateScroll).toHaveBeenCalledWith(25);
  });

  it('auto-hides controls while scrolling down', () => {
    vi.useFakeTimers();
    const main = createMain(200);
    const options = createOptions({ mainRef: main, autoHideHeader: true });
    const { handleScroll } = useReaderScroll(options);

    handleScroll();
    vi.advanceTimersByTime(20);
    main.scrollTop = 400;
    handleScroll();
    vi.advanceTimersByTime(20);

    expect(options.showControls.value).toBe(false);
  });

  it('shows controls after a significant upward scroll', () => {
    vi.useFakeTimers();
    const main = createMain(400);
    const options = createOptions({
      mainRef: main,
      autoHideHeader: true,
      showControls: false,
    });
    const { handleScroll } = useReaderScroll(options);

    handleScroll();
    vi.advanceTimersByTime(20);
    main.scrollTop = 350;
    handleScroll();
    vi.advanceTimersByTime(20);

    expect(options.showControls.value).toBe(true);
  });

  it('queues post-layout and settled auto-load checks', () => {
    vi.useFakeTimers();
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      })
    );
    const main = createMain();
    const options = createOptions({ mainRef: main });

    useReaderScroll(options).handleScroll();
    expect(options.scheduleAutoLoadNext).toHaveBeenCalledTimes(1);

    frames[0](0);
    expect(options.scheduleAutoLoadNext).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(180);
    expect(options.scheduleAutoLoadNext).toHaveBeenCalledWith('settled');
  });
});
