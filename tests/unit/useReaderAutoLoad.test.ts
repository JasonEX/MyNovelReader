import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { JSDOM } from 'jsdom';

import {
  type AdaptivePreloadStats,
  getAdaptivePreloadStorageKey,
} from '@/ui/composables/reader/preloadStats';
import {
  INTERSECTION_ROOT_MARGIN_PX,
  useReaderAutoLoad,
} from '@/ui/composables/reader/useReaderAutoLoad';

// We need an active Pinia for watch() to work in composables
// but useReaderAutoLoad doesn't use Pinia directly - it receives store instances as params.

describe('useReaderAutoLoad', () => {
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

    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function createAutoLoadOptions(overrides: Record<string, any> = {}) {
    const mainRef = ref(overrides.mainRef || null);
    const readerStore = {
      chapters: overrides.chapters || [],
      currentChapterIndex: overrides.currentChapterIndex ?? 0,
      loadNextChapter: vi.fn().mockResolvedValue(true),
      ...overrides.readerStore,
    };
    const configStore = {
      behavior: {
        preloadNext: overrides.preloadNext ?? true,
      },
      ...overrides.configStore,
    };

    return {
      mainRef,
      readerStore: readerStore as any,
      configStore: configStore as any,
      hasNext: computed(() => overrides.hasNext ?? true),
      isLoadingNext: computed(() => overrides.isLoadingNext ?? false),
      isLoadingPrev: computed(() => overrides.isLoadingPrev ?? false),
      isLoading: computed(() => overrides.isLoading ?? false),
      isNavigating: ref(overrides.isNavigating ?? false),
      chapterRefs: overrides.chapterRefs,
    };
  }

  function makeChapter(url: string, content = '内容'.repeat(1000), nextUrl = '') {
    return {
      chapter: {
        url,
        title: 'Chapter',
        bookTitle: 'Book',
        content,
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

  function defineChapterMetrics(
    el: HTMLElement,
    metrics: { offsetTop: number; offsetHeight: number }
  ) {
    Object.defineProperty(el, 'offsetTop', { value: metrics.offsetTop, configurable: true });
    Object.defineProperty(el, 'offsetHeight', { value: metrics.offsetHeight, configurable: true });
  }

  function stubStoredStats(stats: AdaptivePreloadStats) {
    const storageKey = getAdaptivePreloadStorageKey(stats.key);
    vi.stubGlobal(
      'GM_getValue',
      vi.fn((key: string, defaultValue: unknown) =>
        key === storageKey ? JSON.stringify(stats) : defaultValue
      )
    );
    vi.stubGlobal('GM_setValue', vi.fn());
  }

  it('exports INTERSECTION_ROOT_MARGIN_PX', () => {
    expect(INTERSECTION_ROOT_MARGIN_PX).toBe(1600);
  });

  it('initializes with autoLoadArmed as false', () => {
    const opts = createAutoLoadOptions();
    const { autoLoadArmed } = useReaderAutoLoad(opts);
    expect(autoLoadArmed.value).toBe(false);
  });

  it('scheduleAutoLoadNext does nothing when mainRef is null', () => {
    const opts = createAutoLoadOptions({ mainRef: null });
    const result = useReaderAutoLoad(opts);
    // Should not throw
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext does nothing when preloadNext is disabled', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1500, clientHeight: 600 });

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      preloadNext: false,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext does nothing when hasNext is false', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1500, clientHeight: 600 });

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      hasNext: false,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext does nothing when already loading', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1500, clientHeight: 600 });

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      isLoadingNext: true,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext does nothing when not near bottom', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 100, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext does nothing when not armed and not in fill mode', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 1400, scrollTop: 500, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = false;
    result.lastAutoLoadScrollTop.value = 400;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext arms itself near bottom after enough user scroll', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1300, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = false;
    result.lastAutoLoadScrollTop.value = 1000;

    result.scheduleAutoLoadNext();

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
    expect(result.autoLoadArmed.value).toBe(false);
  });

  it('scheduleAutoLoadNext triggers load in fill mode (short content)', () => {
    const mainEl = document.createElement('div');
    // scrollHeight - clientHeight < 180 → fill mode
    defineScrollMetrics(mainEl, { scrollHeight: 700, scrollTop: 0, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    // autoLoadArmed is false, but fill mode kicks in
    result.scheduleAutoLoadNext();

    // First call sets nextAutoLoadAt; advance timers to trigger the load
    vi.advanceTimersByTime(6000);

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('scheduleAutoLoadNext triggers load immediately when armed and near bottom', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1300, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    result.scheduleAutoLoadNext();

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
    expect(result.autoLoadArmed.value).toBe(false);
  });

  it('scheduleAutoLoadNext also loads immediately at the interactive bottom', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1250, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    result.scheduleAutoLoadNext();

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
    expect(result.autoLoadArmed.value).toBe(false);
  });

  it('clearAutoLoadTimer clears the pending timer', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 700, scrollTop: 0, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);

    result.scheduleAutoLoadNext();
    result.clearAutoLoadTimer();

    vi.advanceTimersByTime(10000);
    // loadNextChapter should NOT have been called because timer was cleared
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('stops auto-loading in fill mode after SHORT_CHAIN_LIMIT', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 700, scrollTop: 0, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadShortChainCount.value = 10; // At the limit

    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(10000);

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('slows down on failed auto-load', async () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 700, scrollTop: 0, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.readerStore.loadNextChapter = vi.fn().mockResolvedValue(false);

    const result = useReaderAutoLoad(opts);
    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(6000);

    // Wait for the promise to resolve
    await vi.runAllTimersAsync();
    expect(opts.readerStore.loadNextChapter).toHaveBeenCalled();
  });

  it('isLoadingPrev blocks scheduling', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1300, clientHeight: 600 });

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      isLoadingPrev: true,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(10000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('isLoading blocks scheduling', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1300, clientHeight: 600 });

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      isLoading: true,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(10000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('isNavigating blocks scheduling', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1300, clientHeight: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.isNavigating.value = true;
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(10000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('uses adaptive timing to preload before the fixed pixel margin on slow sites', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 10000, scrollTop: 7600, clientHeight: 600 });

    const chapterEl = document.createElement('article');
    defineChapterMetrics(chapterEl, { offsetTop: 0, offsetHeight: 10000 });

    const chapter = makeChapter(
      'https://example.com/chapter/1',
      '字'.repeat(5000),
      'https://example.com/chapter/2'
    );
    const stats: AdaptivePreloadStats = {
      version: 1,
      key: 'test@example.com',
      loadSrttMs: 12000,
      loadRttVarMs: 5000,
      loadSamples: 4,
      charsPerMs: 2000 / 60000,
      readSamples: 3,
      failureCount: 0,
      updatedAt: Date.now(),
    };
    stubStoredStats(stats);

    const chapterRefs = new Map([[chapter.chapter.url, chapterEl]]);
    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      chapters: [chapter],
      chapterRefs,
      hasNext: true,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    expect(mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight)).toBeGreaterThan(
      INTERSECTION_ROOT_MARGIN_PX
    );

    result.scheduleAutoLoadNext();

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('does not fetch another chapter while one unread chapter is already buffered', () => {
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 5000, scrollTop: 3000, clientHeight: 600 });

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      chapters: [
        makeChapter('https://example.com/chapter/1', '字'.repeat(2000)),
        makeChapter(
          'https://example.com/chapter/2',
          '字'.repeat(2000),
          'https://example.com/chapter/3'
        ),
      ],
      currentChapterIndex: 0,
      hasNext: true,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    result.scheduleAutoLoadNext();

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('records successful auto-load latency into adaptive stats', async () => {
    vi.setSystemTime(new Date('2026-06-30T00:00:00Z'));
    const mainEl = document.createElement('div');
    defineScrollMetrics(mainEl, { scrollHeight: 2000, scrollTop: 1300, clientHeight: 600 });

    const gmSetValue = vi.fn();
    vi.stubGlobal(
      'GM_getValue',
      vi.fn((_: string, defaultValue: unknown) => defaultValue)
    );
    vi.stubGlobal('GM_setValue', gmSetValue);

    const opts = createAutoLoadOptions({
      mainRef: mainEl,
      chapters: [
        makeChapter(
          'https://example.com/chapter/1',
          '字'.repeat(2000),
          'https://example.com/chapter/2'
        ),
      ],
      readerStore: {
        loadNextChapter: vi.fn(
          () => new Promise<boolean>(resolve => setTimeout(() => resolve(true), 2000))
        ),
      },
      hasNext: true,
    });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    result.scheduleAutoLoadNext();
    await vi.advanceTimersByTimeAsync(2000);

    expect(gmSetValue).toHaveBeenCalled();
    const lastCall = gmSetValue.mock.calls.at(-1);
    const saved = JSON.parse(String(lastCall?.[1])) as AdaptivePreloadStats;
    expect(saved.key).toBe('test@example.com');
    expect(saved.loadSamples).toBe(1);
    expect(saved.loadSrttMs).toBe(2000);
  });
});
