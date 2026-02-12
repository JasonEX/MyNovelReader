import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { JSDOM } from 'jsdom';

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
    };
  }

  it('exports INTERSECTION_ROOT_MARGIN_PX', () => {
    expect(INTERSECTION_ROOT_MARGIN_PX).toBe(800);
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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1500, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1500, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1500, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 5000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext does nothing when not armed and not in fill mode', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollHeight', { value: 1400 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 500, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = false;
    result.scheduleAutoLoadNext();
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('scheduleAutoLoadNext triggers load in fill mode (short content)', () => {
    const mainEl = document.createElement('div');
    // scrollHeight - clientHeight < 180 → fill mode
    Object.defineProperty(mainEl, 'scrollHeight', { value: 700 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    // autoLoadArmed is false, but fill mode kicks in
    result.scheduleAutoLoadNext();

    // First call sets nextAutoLoadAt; advance timers to trigger the load
    vi.advanceTimersByTime(6000);

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
  });

  it('scheduleAutoLoadNext triggers load when armed and near bottom', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1300, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    result.scheduleAutoLoadNext();

    // Advance past the cooldown
    vi.advanceTimersByTime(6000);

    expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('auto');
    expect(result.autoLoadArmed.value).toBe(false);
  });

  it('clearAutoLoadTimer clears the pending timer', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1300, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;

    result.scheduleAutoLoadNext();
    result.clearAutoLoadTimer();

    vi.advanceTimersByTime(10000);
    // loadNextChapter should NOT have been called because timer was cleared
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('stops auto-loading in fill mode after SHORT_CHAIN_LIMIT', () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollHeight', { value: 700 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    const result = useReaderAutoLoad(opts);
    result.autoLoadShortChainCount.value = 10; // At the limit

    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(10000);

    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });

  it('slows down on failed auto-load', async () => {
    const mainEl = document.createElement('div');
    Object.defineProperty(mainEl, 'scrollHeight', { value: 700 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1300, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1300, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

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
    Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });
    Object.defineProperty(mainEl, 'scrollTop', { value: 1300, writable: true });
    Object.defineProperty(mainEl, 'clientHeight', { value: 600 });

    const opts = createAutoLoadOptions({ mainRef: mainEl });
    opts.isNavigating.value = true;
    const result = useReaderAutoLoad(opts);
    result.autoLoadArmed.value = true;
    result.scheduleAutoLoadNext();
    vi.advanceTimersByTime(10000);
    expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
  });
});
