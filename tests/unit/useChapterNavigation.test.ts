import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { JSDOM } from 'jsdom';

import { useChapterNavigation } from '@/ui/composables/reader/useChapterNavigation';

describe('useChapterNavigation', () => {
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

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function makeChapterEntry(url: string, prevUrl?: string, nextUrl?: string) {
    return {
      chapter: { url, prevUrl, nextUrl, content: '', title: '' },
      rule: undefined,
      id: `ch-${url}`,
    };
  }

  function createNavigationOptions(overrides: Record<string, any> = {}) {
    const chapters = computed(() => overrides.chapters || []);
    const chapterRefs = overrides.chapterRefs || new Map();
    const mainRef = ref(overrides.mainRef || null);
    const isNavigating = ref(false);
    const isLoadingPrev = computed(() => overrides.isLoadingPrev ?? false);
    const isLoadingNext = computed(() => overrides.isLoadingNext ?? false);
    const hasPrev = computed(() => overrides.hasPrev ?? false);
    const hasNext = computed(() => overrides.hasNext ?? false);
    const topSpacer = computed(() => overrides.topSpacer ?? 0);

    const readerStore = {
      chapters: overrides.chapters || [],
      currentChapterIndex: 0,
      setCurrentChapter: vi.fn(),
      loadPrevChapter: vi.fn().mockResolvedValue(true),
      loadNextChapter: vi.fn().mockResolvedValue(true),
      rebuildChaptersAround: vi.fn().mockResolvedValue(true),
      showToast: vi.fn(),
      getVipBlockedToast: vi.fn().mockReturnValue(null),
      ...overrides.readerStore,
    };

    const setChapterHeight = vi.fn();
    const updateWindow = vi.fn();

    return {
      mainRef,
      chapters,
      chapterRefs,
      readerStore: readerStore as any,
      isNavigating,
      isLoadingPrev,
      isLoadingNext,
      hasPrev,
      hasNext,
      topSpacer,
      setChapterHeight,
      updateWindow,
    };
  }

  describe('scrollToChapter', () => {
    it('scrolls to the chapter element', () => {
      const chapterRefs = new Map();
      const scrollIntoViewMock = vi.fn();
      const el = document.createElement('div');
      el.scrollIntoView = scrollIntoViewMock;
      chapterRefs.set('https://example.com/ch1', el);

      const entry = makeChapterEntry('https://example.com/ch1');
      const opts = createNavigationOptions({ chapters: [entry], chapterRefs });
      const { scrollToChapter } = useChapterNavigation(opts);

      scrollToChapter(0);
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it('does nothing for invalid index', () => {
      const opts = createNavigationOptions({ chapters: [] });
      const { scrollToChapter } = useChapterNavigation(opts);
      // Should not throw
      scrollToChapter(5);
    });

    it('does nothing when element is not in refs', () => {
      const entry = makeChapterEntry('https://example.com/ch1');
      const opts = createNavigationOptions({ chapters: [entry] });
      const { scrollToChapter } = useChapterNavigation(opts);
      // Should not throw
      scrollToChapter(0);
    });
  });

  describe('jumpToCachedChapter', () => {
    it('scrolls to existing chapter in display list', async () => {
      const entry = makeChapterEntry('https://example.com/ch1');
      const chapterRefs = new Map();
      const scrollIntoViewMock = vi.fn();
      const el = document.createElement('div');
      el.scrollIntoView = scrollIntoViewMock;
      chapterRefs.set('https://example.com/ch1', el);

      const readerStore = {
        chapters: [entry],
        setCurrentChapter: vi.fn(),
        rebuildChaptersAround: vi.fn(),
      };
      const opts = createNavigationOptions({
        chapters: [entry],
        chapterRefs,
        readerStore,
      });
      const { jumpToCachedChapter } = useChapterNavigation(opts);

      await jumpToCachedChapter('https://example.com/ch1');
      expect(readerStore.setCurrentChapter).toHaveBeenCalledWith(0);
    });

    it('rebuilds from cache when chapter is not in display list', async () => {
      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();

      const replaceStateSpy = vi.fn();
      window.history.replaceState = replaceStateSpy;

      const readerStore = {
        chapters: [],
        setCurrentChapter: vi.fn(),
        rebuildChaptersAround: vi.fn().mockResolvedValue(true),
      };
      const opts = createNavigationOptions({
        chapters: [],
        mainRef: mainEl,
        readerStore,
      });
      const { jumpToCachedChapter } = useChapterNavigation(opts);

      await jumpToCachedChapter('https://example.com/ch5');
      expect(readerStore.rebuildChaptersAround).toHaveBeenCalledWith('https://example.com/ch5');
      expect(replaceStateSpy).toHaveBeenCalled();
    });

    it('attempts navigation fallback when rebuild fails', async () => {
      const readerStore = {
        chapters: [],
        setCurrentChapter: vi.fn(),
        rebuildChaptersAround: vi.fn().mockResolvedValue(false),
      };
      const opts = createNavigationOptions({
        chapters: [],
        readerStore,
      });
      const { jumpToCachedChapter } = useChapterNavigation(opts);

      // The function will try to set window.location.href — this will throw
      // in jsdom, but we verify rebuild was attempted and returned false
      try {
        await jumpToCachedChapter('https://example.com/ch5');
      } catch {
        // Expected: jsdom may throw on navigation
      }
      expect(readerStore.rebuildChaptersAround).toHaveBeenCalledWith('https://example.com/ch5');
    });
  });

  describe('jumpToChapter', () => {
    it('returns early when mainRef is null', async () => {
      const opts = createNavigationOptions({ mainRef: null });
      const { jumpToChapter } = useChapterNavigation(opts);
      await jumpToChapter(0);
      expect(opts.readerStore.setCurrentChapter).not.toHaveBeenCalled();
    });

    it('returns early for out-of-range index', async () => {
      const mainEl = document.createElement('div');
      const entry = makeChapterEntry('https://example.com/ch1');
      const opts = createNavigationOptions({ chapters: [entry], mainRef: mainEl });
      const { jumpToChapter } = useChapterNavigation(opts);
      await jumpToChapter(-1);
      expect(opts.readerStore.setCurrentChapter).not.toHaveBeenCalled();
    });

    it('resets isNavigating when target element not found', async () => {
      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();
      mainEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const entry = makeChapterEntry('https://example.com/ch1');
      const opts = createNavigationOptions({ chapters: [entry], mainRef: mainEl });
      const { jumpToChapter } = useChapterNavigation(opts);

      await jumpToChapter(0);
      expect(opts.isNavigating.value).toBe(false);
    });

    it('resets isNavigating when target chapter has no url', async () => {
      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();

      const opts = createNavigationOptions({
        chapters: [{ chapter: { url: '', content: '', title: '' }, rule: undefined, id: 'blank' }],
        mainRef: mainEl,
      });
      const { jumpToChapter } = useChapterNavigation(opts);

      await jumpToChapter(0);

      expect(opts.isNavigating.value).toBe(false);
      expect(mainEl.scrollTo).not.toHaveBeenCalled();
    });

    it('scrolls to chapter with smooth behavior and sets timeout', async () => {
      vi.useFakeTimers();
      vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((cb: FrameRequestCallback) => {
          cb(0);
          return 0;
        })
      );

      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();
      mainEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const chapterRefs = new Map();
      const chEl = document.createElement('div');
      chEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 });
      chapterRefs.set('https://example.com/ch1', chEl);

      const entry = makeChapterEntry('https://example.com/ch1');
      const opts = createNavigationOptions({
        chapters: [entry],
        mainRef: mainEl,
        chapterRefs,
      });
      const { jumpToChapter } = useChapterNavigation(opts);

      // Run the async function - flush only microtasks (nextTick + rAF) but not macrotasks (setTimeout)
      const jumpPromise = jumpToChapter(0, 'smooth');
      // Flush microtasks for nextTick and the rAF-based Promise
      await Promise.resolve();
      await Promise.resolve();
      await jumpPromise;

      expect(mainEl.scrollTo).toHaveBeenCalled();
      expect(opts.readerStore.setCurrentChapter).toHaveBeenCalledWith(0);

      // The smooth navigation lock timeout hasn't fired yet
      expect(opts.isNavigating.value).toBe(true);

      vi.advanceTimersByTime(650);
      expect(opts.isNavigating.value).toBe(false);

      vi.useRealTimers();
    });

    it('scrolls to chapter with auto behavior and resets via rAF', async () => {
      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();
      mainEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const chapterRefs = new Map();
      const chEl = document.createElement('div');
      chEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 50 });
      chapterRefs.set('https://example.com/ch1', chEl);

      const entry = makeChapterEntry('https://example.com/ch1');
      const opts = createNavigationOptions({
        chapters: [entry],
        mainRef: mainEl,
        chapterRefs,
      });
      const { jumpToChapter } = useChapterNavigation(opts);

      await jumpToChapter(0, 'auto');
      expect(opts.isNavigating.value).toBe(false);
    });
  });

  describe('handleWheel', () => {
    it('loads prev chapter on upward scroll at top', () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const entry = makeChapterEntry('https://example.com/ch1', 'https://example.com/ch0');
      const opts = createNavigationOptions({
        chapters: [entry],
        mainRef: mainEl,
        hasPrev: true,
      });
      const { handleWheel } = useChapterNavigation(opts);

      const wheelEvent = {
        deltaY: -10,
        preventDefault: vi.fn(),
      } as unknown as WheelEvent;
      handleWheel(wheelEvent);

      expect(wheelEvent.preventDefault).toHaveBeenCalled();
      expect(opts.readerStore.loadPrevChapter).toHaveBeenCalled();
    });

    it('does nothing on downward scroll away from bottom', () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
      Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
      Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasPrev: true,
      });
      const { handleWheel } = useChapterNavigation(opts);

      const wheelEvent = {
        deltaY: 10,
        preventDefault: vi.fn(),
      } as unknown as WheelEvent;
      handleWheel(wheelEvent);
      expect(wheelEvent.preventDefault).not.toHaveBeenCalled();
      expect(opts.readerStore.loadPrevChapter).not.toHaveBeenCalled();
      expect(opts.readerStore.loadNextChapter).not.toHaveBeenCalled();
    });

    it('manually appends next chapter on downward scroll at bottom', () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 1400, writable: true });
      Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
      Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasNext: true,
      });
      const { handleWheel } = useChapterNavigation(opts);

      const wheelEvent = {
        deltaY: 10,
        preventDefault: vi.fn(),
      } as unknown as WheelEvent;
      handleWheel(wheelEvent);

      expect(wheelEvent.preventDefault).toHaveBeenCalled();
      expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('manual');
    });

    it('still treats bottom boundary wheel as manual reading when preload is disabled', () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 1400, writable: true });
      Object.defineProperty(mainEl, 'clientHeight', { value: 600 });
      Object.defineProperty(mainEl, 'scrollHeight', { value: 2000 });

      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasNext: true,
        preloadNext: false,
      });
      const { handleWheel } = useChapterNavigation(opts);

      const wheelEvent = {
        deltaY: 10,
        preventDefault: vi.fn(),
      } as unknown as WheelEvent;
      handleWheel(wheelEvent);

      expect(wheelEvent.preventDefault).toHaveBeenCalled();
      expect(opts.readerStore.loadNextChapter).toHaveBeenCalledWith('manual');
    });

    it('does nothing when mainRef is null', () => {
      const opts = createNavigationOptions({ mainRef: null });
      const { handleWheel } = useChapterNavigation(opts);
      handleWheel({ deltaY: -10 } as WheelEvent);
    });

    it('does nothing when already loading prev', () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasPrev: true,
        isLoadingPrev: true,
      });
      const { handleWheel } = useChapterNavigation(opts);
      handleWheel({ deltaY: -10 } as WheelEvent);
      expect(opts.readerStore.loadPrevChapter).not.toHaveBeenCalled();
    });

    it('does nothing when isNavigating', () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });
      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasPrev: true,
      });
      opts.isNavigating.value = true;
      const { handleWheel } = useChapterNavigation(opts);
      handleWheel({ deltaY: -10 } as WheelEvent);
      expect(opts.readerStore.loadPrevChapter).not.toHaveBeenCalled();
    });
  });

  describe('navigateChapter', () => {
    it('jumps to previous chapter within list', async () => {
      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();
      mainEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const entries = [
        makeChapterEntry('https://example.com/ch0'),
        makeChapterEntry('https://example.com/ch1'),
      ];
      const readerStore = {
        chapters: entries,
        currentChapterIndex: 1,
        setCurrentChapter: vi.fn(),
        loadPrevChapter: vi.fn(),
        loadNextChapter: vi.fn(),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: entries,
        mainRef: mainEl,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('prev');
      // Should call jumpToChapter(0) which calls updateWindow and setCurrentChapter
      expect(opts.updateWindow).toHaveBeenCalled();
    });

    it('loads prev chapter when at beginning and hasPrev', async () => {
      const mainEl = document.createElement('div');
      const readerStore = {
        chapters: [makeChapterEntry('https://example.com/ch0')],
        currentChapterIndex: 0,
        setCurrentChapter: vi.fn(),
        loadPrevChapter: vi.fn().mockResolvedValue(true),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: [makeChapterEntry('https://example.com/ch0')],
        mainRef: mainEl,
        hasPrev: true,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('prev');
      expect(readerStore.loadPrevChapter).toHaveBeenCalledWith('manual');
    });

    it('shows toast when no prev chapter', async () => {
      const mainEl = document.createElement('div');
      const readerStore = {
        chapters: [makeChapterEntry('https://example.com/ch0')],
        currentChapterIndex: 0,
        setCurrentChapter: vi.fn(),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: [makeChapterEntry('https://example.com/ch0')],
        mainRef: mainEl,
        hasPrev: false,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('prev');
      expect(readerStore.showToast).toHaveBeenCalledWith('已经是第一章了', 'info');
    });

    it('shows VIP blocked toast when getVipBlockedToast returns value', async () => {
      const mainEl = document.createElement('div');
      const readerStore = {
        chapters: [makeChapterEntry('https://example.com/ch0')],
        currentChapterIndex: 0,
        setCurrentChapter: vi.fn(),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue('VIP blocked message'),
      };
      const opts = createNavigationOptions({
        chapters: [makeChapterEntry('https://example.com/ch0')],
        mainRef: mainEl,
        hasPrev: false,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('prev');
      expect(readerStore.showToast).toHaveBeenCalledWith('VIP blocked message', 'info');
    });

    it('jumps to next chapter within list', async () => {
      const mainEl = document.createElement('div');
      mainEl.scrollTo = vi.fn();
      mainEl.getBoundingClientRect = vi.fn().mockReturnValue({ top: 0 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const entries = [
        makeChapterEntry('https://example.com/ch0'),
        makeChapterEntry('https://example.com/ch1'),
      ];
      const readerStore = {
        chapters: entries,
        currentChapterIndex: 0,
        setCurrentChapter: vi.fn(),
        loadNextChapter: vi.fn(),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: entries,
        mainRef: mainEl,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('next');
      expect(opts.updateWindow).toHaveBeenCalled();
    });

    it('loads next chapter when at end and hasNext', async () => {
      const mainEl = document.createElement('div');
      const entries = [makeChapterEntry('https://example.com/ch0')];
      const readerStore = {
        chapters: entries,
        currentChapterIndex: 0,
        setCurrentChapter: vi.fn(),
        loadNextChapter: vi.fn().mockResolvedValue(true),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: entries,
        mainRef: mainEl,
        hasNext: true,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('next');
      expect(readerStore.loadNextChapter).toHaveBeenCalledWith('manual');
    });

    it('shows toast when no next chapter', async () => {
      const mainEl = document.createElement('div');
      const readerStore = {
        chapters: [makeChapterEntry('https://example.com/ch0')],
        currentChapterIndex: 0,
        setCurrentChapter: vi.fn(),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: [makeChapterEntry('https://example.com/ch0')],
        mainRef: mainEl,
        hasNext: false,
        readerStore,
      });
      const { navigateChapter } = useChapterNavigation(opts);

      await navigateChapter('next');
      expect(readerStore.showToast).toHaveBeenCalledWith('已经是最后一章了', 'info');
    });

    it('returns early when mainRef is null', async () => {
      const opts = createNavigationOptions({ mainRef: null });
      const { navigateChapter } = useChapterNavigation(opts);
      await navigateChapter('next');
      expect(opts.readerStore.setCurrentChapter).not.toHaveBeenCalled();
    });

    it('returns early when isNavigating', async () => {
      const mainEl = document.createElement('div');
      const opts = createNavigationOptions({ mainRef: mainEl });
      opts.isNavigating.value = true;
      const { navigateChapter } = useChapterNavigation(opts);
      await navigateChapter('next');
    });
  });

  describe('scrollReader', () => {
    it('scrolls down by step', () => {
      const mainEl = document.createElement('div');
      mainEl.scrollBy = vi.fn();
      Object.defineProperty(mainEl, 'clientHeight', { value: 800 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });

      const opts = createNavigationOptions({ mainRef: mainEl });
      const { scrollReader } = useChapterNavigation(opts);

      scrollReader('down');
      expect(mainEl.scrollBy).toHaveBeenCalledWith({ top: 150, behavior: 'auto' });
    });

    it('scrolls up by step', () => {
      const mainEl = document.createElement('div');
      mainEl.scrollBy = vi.fn();
      Object.defineProperty(mainEl, 'clientHeight', { value: 800 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });

      const opts = createNavigationOptions({ mainRef: mainEl });
      const { scrollReader } = useChapterNavigation(opts);

      scrollReader('up');
      expect(mainEl.scrollBy).toHaveBeenCalledWith({ top: -150, behavior: 'auto' });
    });

    it('scrolls pagedown with smooth behavior', () => {
      const mainEl = document.createElement('div');
      mainEl.scrollBy = vi.fn();
      Object.defineProperty(mainEl, 'clientHeight', { value: 800 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });

      const opts = createNavigationOptions({ mainRef: mainEl });
      const { scrollReader } = useChapterNavigation(opts);

      scrollReader('pagedown');
      expect(mainEl.scrollBy).toHaveBeenCalledWith({ top: 720, behavior: 'smooth' });
    });

    it('scrolls pageup with smooth behavior', () => {
      const mainEl = document.createElement('div');
      mainEl.scrollBy = vi.fn();
      Object.defineProperty(mainEl, 'clientHeight', { value: 800 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 100, writable: true });

      const opts = createNavigationOptions({ mainRef: mainEl });
      const { scrollReader } = useChapterNavigation(opts);

      scrollReader('pageup');
      expect(mainEl.scrollBy).toHaveBeenCalledWith({ top: -720, behavior: 'smooth' });
    });

    it('loads prev chapter on up when at the very top', () => {
      const mainEl = document.createElement('div');
      mainEl.scrollBy = vi.fn();
      Object.defineProperty(mainEl, 'clientHeight', { value: 800 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasPrev: true,
      });
      const { scrollReader } = useChapterNavigation(opts);

      scrollReader('up');
      expect(opts.readerStore.loadPrevChapter).toHaveBeenCalled();
      expect(mainEl.scrollBy).not.toHaveBeenCalled();
    });

    it('loads prev chapter on pageup when at the very top', () => {
      const mainEl = document.createElement('div');
      mainEl.scrollBy = vi.fn();
      Object.defineProperty(mainEl, 'clientHeight', { value: 800 });
      Object.defineProperty(mainEl, 'scrollTop', { value: 0, writable: true });

      const opts = createNavigationOptions({
        mainRef: mainEl,
        hasPrev: true,
      });
      const { scrollReader } = useChapterNavigation(opts);

      scrollReader('pageup');
      expect(opts.readerStore.loadPrevChapter).toHaveBeenCalled();
      expect(mainEl.scrollBy).not.toHaveBeenCalled();
    });

    it('does nothing when mainRef is null', () => {
      const opts = createNavigationOptions({ mainRef: null });
      const { scrollReader } = useChapterNavigation(opts);
      scrollReader('down'); // Should not throw
    });
  });

  describe('loadPrevWithScrollAdjust', () => {
    it('preserves the current view after prepending a previous chapter', async () => {
      const mainEl = document.createElement('div');
      Object.defineProperty(mainEl, 'scrollTop', { value: 120, writable: true });

      const newChapterEl = document.createElement('article');
      newChapterEl.className = 'mnr-reader-content';
      Object.defineProperty(newChapterEl, 'offsetHeight', { value: 900 });
      mainEl.appendChild(newChapterEl);

      const previous = makeChapterEntry('https://example.com/ch0');
      const current = makeChapterEntry('https://example.com/ch1');
      const readerStore = {
        chapters: [previous, current],
        currentChapterIndex: 1,
        setCurrentChapter: vi.fn(),
        loadPrevChapter: vi.fn().mockResolvedValue(true),
        showToast: vi.fn(),
        getVipBlockedToast: vi.fn().mockReturnValue(null),
      };
      const opts = createNavigationOptions({
        chapters: [previous, current],
        mainRef: mainEl,
        topSpacer: 40,
        readerStore,
      });
      const { loadPrevWithScrollAdjust } = useChapterNavigation(opts);

      await loadPrevWithScrollAdjust();

      expect(readerStore.loadPrevChapter).toHaveBeenCalledWith('manual');
      expect(opts.updateWindow).toHaveBeenCalledWith(1);
      expect(opts.setChapterHeight).toHaveBeenCalledWith('https://example.com/ch0', 900);
      expect(mainEl.scrollTop).toBe(1020);
    });
  });
});
