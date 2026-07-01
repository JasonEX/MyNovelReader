import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { JSDOM } from 'jsdom';

import type { ChapterEntry } from '@/ui/stores/reader';
import { useReaderScroll } from '@/ui/composables/reader/useReaderScroll';

describe('useReaderScroll', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });
    // @ts-expect-error - test env
    globalThis.window = dom.window;
    // @ts-expect-error - test env
    globalThis.document = dom.window.document;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function makeEntry(url: string, _index?: number): ChapterEntry {
    return {
      chapter: { url, content: '', title: '', prevUrl: '', nextUrl: '' } as any,
      rule: undefined,
      id: `ch-${url}`,
    };
  }

  function createScrollOptions(overrides: Record<string, any> = {}) {
    const chapters = computed(() => overrides.chapters || []);
    const visibleChapters = computed(() => overrides.visibleChapters || []);
    const chapterRefs = overrides.chapterRefs || new Map<string, HTMLElement>();
    const chapterHeights = ref(overrides.chapterHeights || new Map<string, number>());
    const averageHeight = ref(overrides.averageHeight ?? 500);
    const mainRef = ref(overrides.mainRef || null);

    const readerStore = {
      setCurrentChapter: vi.fn(),
      updateScroll: vi.fn(),
      ...overrides.readerStore,
    };

    return {
      mainRef,
      chapters,
      visibleChapters,
      chapterRefs,
      chapterHeights,
      averageHeight,
      setChapterHeight: vi.fn(),
      updateWindow: vi.fn(),
      readerStore: readerStore as any,
      autoHideHeader: computed(() => overrides.autoHideHeader ?? false),
      showControls: ref(overrides.showControls ?? true),
      isNavigating: ref(overrides.isNavigating ?? false),
      scheduleAutoLoadNext: vi.fn(),
    };
  }

  it('handleScroll does nothing when mainRef is null', () => {
    const opts = createScrollOptions({ mainRef: null });
    const { handleScroll } = useReaderScroll(opts);
    handleScroll();
    expect(opts.readerStore.setCurrentChapter).not.toHaveBeenCalled();
  });

  it('handleScroll finds the most visible chapter and updates store', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const el1 = document.createElement('div');
    Object.defineProperty(el1, 'offsetTop', { value: 0 });
    Object.defineProperty(el1, 'offsetHeight', { value: 500 });

    const chapterRefs = new Map();
    chapterRefs.set('https://example.com/ch1', el1);

    const entry = makeEntry('https://example.com/ch1');
    const visibleEntry = { ...entry, index: 0 };

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [entry],
      visibleChapters: [visibleEntry],
      chapterRefs,
    });
    const { handleScroll } = useReaderScroll(opts);

    handleScroll();

    expect(opts.readerStore.setCurrentChapter).toHaveBeenCalledWith(0);
    expect(opts.readerStore.updateScroll).toHaveBeenCalled();
    expect(opts.setChapterHeight).toHaveBeenCalledWith('https://example.com/ch1', 500);
    expect(opts.updateWindow).toHaveBeenCalledWith(0);
    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledWith('scroll');
  });

  it('queues one post-layout auto-load check after scroll handling', () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        rafCallbacks.push(callback);
        return rafCallbacks.length;
      })
    );

    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const el1 = document.createElement('div');
    Object.defineProperty(el1, 'offsetTop', { value: 0 });
    Object.defineProperty(el1, 'offsetHeight', { value: 500 });

    const chapterRefs = new Map();
    chapterRefs.set('https://example.com/ch1', el1);

    const entry = makeEntry('https://example.com/ch1');
    const visibleEntry = { ...entry, index: 0 };

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [entry],
      visibleChapters: [visibleEntry],
      chapterRefs,
    });
    const { handleScroll } = useReaderScroll(opts);

    handleScroll();
    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledTimes(1);
    expect(opts.scheduleAutoLoadNext).toHaveBeenLastCalledWith('scroll');

    rafCallbacks[0](0);
    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledTimes(2);
    expect(opts.scheduleAutoLoadNext).toHaveBeenLastCalledWith('scroll');
  });

  it('queues a settled auto-load check after scroll handling', () => {
    vi.useFakeTimers();

    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 200, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const el1 = document.createElement('div');
    Object.defineProperty(el1, 'offsetTop', { value: 0 });
    Object.defineProperty(el1, 'offsetHeight', { value: 800 });

    const chapterRefs = new Map();
    chapterRefs.set('https://example.com/ch1', el1);

    const entry = makeEntry('https://example.com/ch1');

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [entry],
      visibleChapters: [{ ...entry, index: 0 }],
      chapterRefs,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledWith('scroll');
    vi.advanceTimersByTime(179);
    expect(opts.scheduleAutoLoadNext).not.toHaveBeenCalledWith('settled');

    vi.advanceTimersByTime(1);
    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledWith('settled');

    vi.useRealTimers();
  });

  it('resets the settled auto-load check while scrolling continues', () => {
    vi.useFakeTimers();

    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 200, writable: true, configurable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const el1 = document.createElement('div');
    Object.defineProperty(el1, 'offsetTop', { value: 0 });
    Object.defineProperty(el1, 'offsetHeight', { value: 800 });

    const chapterRefs = new Map();
    chapterRefs.set('https://example.com/ch1', el1);

    const entry = makeEntry('https://example.com/ch1');
    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [entry],
      visibleChapters: [{ ...entry, index: 0 }],
      chapterRefs,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();
    vi.advanceTimersByTime(100);

    Object.defineProperty(mainEl, 'scrollTop', { value: 260, writable: true, configurable: true });
    handleScroll();
    vi.advanceTimersByTime(20);
    vi.advanceTimersByTime(159);
    expect(opts.scheduleAutoLoadNext).not.toHaveBeenCalledWith('settled');

    vi.advanceTimersByTime(1);
    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledWith('settled');

    vi.useRealTimers();
  });

  it('does not schedule auto-load checks during programmatic navigation', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 200, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const opts = createScrollOptions({
      mainRef: mainEl,
      isNavigating: true,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.scheduleAutoLoadNext).not.toHaveBeenCalled();
  });

  it('does not recalculate the current chapter during programmatic navigation', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 900, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 3000 });

    const el2 = document.createElement('div');
    Object.defineProperty(el2, 'offsetTop', { value: 800 });
    Object.defineProperty(el2, 'offsetHeight', { value: 800 });

    const entries = [makeEntry('https://example.com/ch1'), makeEntry('https://example.com/ch2')];
    const chapterRefs = new Map();
    chapterRefs.set('https://example.com/ch2', el2);

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: entries,
      visibleChapters: [{ ...entries[1], index: 1 }],
      chapterRefs,
      isNavigating: true,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.readerStore.updateScroll).toHaveBeenCalledWith(38);
    expect(opts.readerStore.setCurrentChapter).not.toHaveBeenCalled();
    expect(opts.updateWindow).not.toHaveBeenCalled();
    expect(opts.scheduleAutoLoadNext).not.toHaveBeenCalled();
  });

  it('auto-hides controls on scroll down past 100px', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 200, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const opts = createScrollOptions({
      mainRef: mainEl,
      autoHideHeader: true,
      showControls: true,
    });

    const { handleScroll } = useReaderScroll(opts);

    // First call sets lastScrollTop
    handleScroll();
    // Simulate scrolling down
    Object.defineProperty(mainEl, 'scrollTop', { value: 400, writable: true });
    handleScroll();

    expect(opts.showControls.value).toBe(false);
  });

  it('shows controls on significant scroll up', () => {
    vi.useFakeTimers();

    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 400, writable: true, configurable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const opts = createScrollOptions({
      mainRef: mainEl,
      autoHideHeader: true,
      showControls: false,
    });

    const { handleScroll } = useReaderScroll(opts);

    // First call to set lastScrollTop = 400
    handleScroll();

    // Advance past throttle interval
    vi.advanceTimersByTime(20);

    // Simulate scrolling up significantly (> 20px)
    Object.defineProperty(mainEl, 'scrollTop', { value: 350, writable: true, configurable: true });
    handleScroll();

    // Advance past throttle for the trailing call
    vi.advanceTimersByTime(20);

    expect(opts.showControls.value).toBe(true);

    vi.useRealTimers();
  });

  it('falls back to estimateIndexFromOffset when no visible chapter element found', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 600, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const entry = makeEntry('https://example.com/ch1');

    const heights = new Map<string, number>();
    heights.set('https://example.com/ch1', 800);

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [entry],
      visibleChapters: [], // No visible chapters
      chapterHeights: heights,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.readerStore.setCurrentChapter).toHaveBeenCalledWith(0);
    expect(opts.updateWindow).toHaveBeenCalledWith(0);
    expect(opts.readerStore.updateScroll).toHaveBeenCalled();
    expect(opts.scheduleAutoLoadNext).toHaveBeenCalledWith('scroll');
  });

  it('estimateIndexFromOffset can resolve the first matching chapter', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const entries = [makeEntry('https://example.com/ch1'), makeEntry('https://example.com/ch2')];

    const heights = new Map<string, number>();
    heights.set('https://example.com/ch1', 800);
    heights.set('https://example.com/ch2', 800);

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: entries,
      visibleChapters: [],
      chapterHeights: heights,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.readerStore.setCurrentChapter).toHaveBeenCalledWith(0);
  });

  it('estimateIndexFromOffset returns last index when past all chapters', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 5000, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 6000 });

    const entries = [makeEntry('https://example.com/ch1'), makeEntry('https://example.com/ch2')];

    const heights = new Map<string, number>();
    heights.set('https://example.com/ch1', 500);
    heights.set('https://example.com/ch2', 500);

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: entries,
      visibleChapters: [],
      chapterHeights: heights,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.readerStore.setCurrentChapter).toHaveBeenCalledWith(1);
  });

  it('estimateIndexFromOffset returns -1 for empty chapters (no update)', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [],
      visibleChapters: [],
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.readerStore.setCurrentChapter).not.toHaveBeenCalled();
  });

  it('computes 100% scroll when scrollHeight equals clientHeight', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
    Object.defineProperty(mainEl, 'scrollHeight', { value: 600 });

    const el1 = document.createElement('div');
    Object.defineProperty(el1, 'offsetTop', { value: 0 });
    Object.defineProperty(el1, 'offsetHeight', { value: 600 });

    const chapterRefs = new Map();
    chapterRefs.set('https://example.com/ch1', el1);

    const entry = makeEntry('https://example.com/ch1');
    const visibleEntry = { ...entry, index: 0 };

    const opts = createScrollOptions({
      mainRef: mainEl,
      chapters: [entry],
      visibleChapters: [visibleEntry],
      chapterRefs,
    });

    const { handleScroll } = useReaderScroll(opts);
    handleScroll();

    expect(opts.readerStore.updateScroll).toHaveBeenCalledWith(100);
  });
});
