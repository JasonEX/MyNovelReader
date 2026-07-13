import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, nextTick, reactive, ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { JSDOM } from 'jsdom';

import {
  INTERSECTION_ROOT_MARGIN_PX,
  useReaderAutoLoad,
} from '@/ui/composables/reader/useReaderAutoLoad';

describe('useReaderAutoLoad', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });
    // test env
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    // test env
    globalThis.document = dom.window.document;

    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-01T00:00:00Z'));
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function makeChapter(url: string, nextUrl = 'https://example.com/chapter/next') {
    return {
      chapter: {
        url,
        title: 'Chapter',
        bookTitle: 'Book',
        content: '内容'.repeat(1000),
        indexUrl: 'https://example.com/book/1',
        nextUrl,
        prevUrl: '',
        method: 'rule',
        confidence: 100,
      },
      rule: { id: 'test', name: 'Test', pattern: 'example\\.com' },
      id: `entry-${url}`,
    };
  }

  function defineScrollMetrics(
    el: HTMLElement,
    metrics: { scrollHeight: number; scrollTop: number; clientHeight: number }
  ) {
    Object.defineProperty(el, 'scrollHeight', { value: metrics.scrollHeight, configurable: true });
    Object.defineProperty(el, 'scrollTop', {
      value: metrics.scrollTop,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(el, 'clientHeight', { value: metrics.clientHeight, configurable: true });
  }

  function createAutoLoadOptions(overrides: Record<string, any> = {}) {
    const mainRef = ref<HTMLElement | null>(overrides.mainRef || null);
    const readerStore = reactive({
      chapters: overrides.chapters || [makeChapter('https://example.com/chapter/1')],
      currentChapterIndex: overrides.currentChapterIndex ?? 0,
      loadNextChapter: vi.fn().mockResolvedValue(true),
      ...overrides.readerStore,
    });
    const configStore = reactive({
      behavior: {
        preloadNext: overrides.preloadNext ?? true,
      },
      ...overrides.configStore,
    });

    return {
      mainRef,
      readerStore: readerStore as any,
      configStore: configStore as any,
      hasNext: computed(() => overrides.hasNext ?? true),
      isLoadingNext: computed(() => overrides.isLoadingNext ?? false),
      isLoadingPrev: computed(() => overrides.isLoadingPrev ?? false),
      isLoading: computed(() => overrides.isLoading ?? false),
      isNavigating: ref(overrides.isNavigating ?? false),
    };
  }

  async function flushPromises() {
    await Promise.resolve();
    await nextTick();
  }

  it('exports INTERSECTION_ROOT_MARGIN_PX', () => {
    expect(INTERSECTION_ROOT_MARGIN_PX).toBe(1600);
  });

  it('does nothing when mainRef is null', () => {
    const opts = createAutoLoadOptions({ mainRef: null });
    const result = useReaderAutoLoad(opts);

    result.scheduleAutoLoadNext('state');
    vi.advanceTimersByTime(5000);

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('does not auto preload before the 3s hard gate', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 0, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });

    useReaderAutoLoad(opts);

    vi.advanceTimersByTime(2999);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('keeps the 1600px fallback behind the same hard gate', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);

    result.scheduleAutoLoadNext('scroll');
    vi.advanceTimersByTime(2999);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('does not let near-bottom scroll preload when it is still outside the 1600px fallback', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 6000, scrollTop: 1000, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);

    result.clearAutoLoadTimer();
    vi.advanceTimersByTime(3000);

    result.scheduleAutoLoadNext('scroll');

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('uses the 1600px fallback after the hard gate has passed', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);

    result.clearAutoLoadTimer();
    vi.advanceTimersByTime(3000);
    result.scheduleAutoLoadNext('settled');

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('does not preload when an unread next chapter is already buffered', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });
    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      chapters: [
        makeChapter('https://example.com/chapter/1'),
        makeChapter('https://example.com/chapter/2'),
      ],
      currentChapterIndex: 0,
      hasNext: true,
    });

    useReaderAutoLoad(opts);
    vi.advanceTimersByTime(5000);

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('does not preload while disabled, loading, navigating, or at the end', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });

    for (const overrides of [
      { preloadNext: false },
      { isLoadingNext: true },
      { isLoadingPrev: true },
      { isLoading: true },
      { isNavigating: true },
      { hasNext: false },
    ]) {
      const opts = createAutoLoadOptions({ mainRef: mainEl, ...overrides });
      useReaderAutoLoad(opts);
      vi.advanceTimersByTime(5000);
      expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
      vi.clearAllTimers();
    }
  });

  it('responds to the preload setting being turned off and back on', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 0, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });

    useReaderAutoLoad(opts);
    opts.configStore.behavior.preloadNext = false;
    await nextTick();
    vi.advanceTimersByTime(5000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    opts.configStore.behavior.preloadNext = true;
    await nextTick();

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('preloads when progressive section merging reveals the next chapter', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 0, clientHeight: 600 });
    const nextAvailable = ref(false);
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.hasNext = computed(() => nextAvailable.value);

    useReaderAutoLoad(opts);
    vi.advanceTimersByTime(5000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    nextAvailable.value = true;
    await nextTick();

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('schedules after loading state clears without loading during the busy state', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 0, clientHeight: 600 });

    const loadingNext = ref(false);
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.isLoadingNext = computed(() => loadingNext.value);

    const result = useReaderAutoLoad(opts);
    result.clearAutoLoadTimer();

    loadingNext.value = true;
    await nextTick();
    vi.advanceTimersByTime(5000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    loadingNext.value = false;
    await nextTick();
    vi.advanceTimersByTime(3000);
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('waits until the page becomes visible before scheduling preload', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    });

    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 0, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });

    useReaderAutoLoad(opts);
    vi.advanceTimersByTime(5000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('starts a new hard gate when the visible current chapter changes', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });
    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      chapters: [
        makeChapter('https://example.com/chapter/1'),
        makeChapter('https://example.com/chapter/2'),
      ],
      currentChapterIndex: 0,
    });
    useReaderAutoLoad(opts);

    vi.advanceTimersByTime(1000);
    opts.readerStore.currentChapterIndex = 1;
    await nextTick();

    vi.advanceTimersByTime(2999);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('applies a short cooldown after failed auto preload and retries only after a later trigger', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.readerStore.loadNextChapter = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const result = useReaderAutoLoad(opts);
    vi.advanceTimersByTime(3000);
    await flushPromises();
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledTimes(1);

    result.scheduleAutoLoadNext('state');
    result.scheduleAutoLoadNext('settled');
    vi.advanceTimersByTime(5999);
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledTimes(2);
  });

  it('also cools down when auto preload rejects', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 2900, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.readerStore.loadNextChapter = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(true);

    const result = useReaderAutoLoad(opts);
    vi.advanceTimersByTime(3000);
    await flushPromises();
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledTimes(1);

    result.scheduleAutoLoadNext('sentinel');
    vi.advanceTimersByTime(6000);

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledTimes(2);
  });

  it('clearAutoLoadTimer clears the pending hard-gate timer', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 0, clientHeight: 600 });
    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);

    result.clearAutoLoadTimer();
    vi.advanceTimersByTime(5000);

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });
});
