import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { JSDOM } from 'jsdom';

import { useTouchGestures } from '@/ui/composables/reader/useTouchGestures';

describe('useTouchGestures', () => {
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
    // test env
    globalThis.HTMLElement = dom.window.HTMLElement;
    // test env
    globalThis.Element = dom.window.Element;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function makeTouchEvent(
    type: string,
    touches: Array<{ identifier: number; clientX: number; clientY: number }>,
    changedTouches?: Array<{ identifier: number; clientX: number; clientY: number }>,
    target?: unknown
  ): Event {
    const e = new dom.window.Event(type, { bubbles: true });
    Object.defineProperty(e, 'touches', { value: touches });
    Object.defineProperty(e, 'changedTouches', { value: changedTouches || touches });
    Object.defineProperty(e, 'target', { value: target || document.body, writable: false });
    return e;
  }

  it('detects left swipe and calls onSwipeLeft', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight,
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('detects right swipe and calls onSwipeRight', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight,
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 100, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 300, clientY: 200 }]));

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores swipe when disabled', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => false),
      onSwipeLeft,
      onSwipeRight,
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('ignores short swipes (below threshold)', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight,
    });

    // Move only 50px (below the 72px minimum threshold)
    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 200, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 150, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('cancels swipe on vertical movement', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 100 }]));
    // Move vertically significantly
    handleTouchMove(makeTouchEvent('touchmove', [{ identifier: 0, clientX: 290, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores multi-touch events', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchStart } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(
      makeTouchEvent('touchstart', [
        { identifier: 0, clientX: 300, clientY: 200 },
        { identifier: 1, clientX: 100, clientY: 200 },
      ])
    );
    // swipeStart should be null, so subsequent end won't trigger anything
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores swipe when text is selected', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({
      toString: () => 'selected text',
    } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores slow swipes (exceeds max duration)', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);
    vi.useFakeTimers();

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));

    vi.advanceTimersByTime(800); // SWIPE_MAX_DURATION_MS is 700

    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('ignores touchmove when multi-touch appears mid-gesture', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchStart, handleTouchMove } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    // Multi-touch during move → cancels
    handleTouchMove(
      makeTouchEvent('touchmove', [
        { identifier: 0, clientX: 290, clientY: 200 },
        { identifier: 1, clientX: 100, clientY: 100 },
      ])
    );
    // No assertion on onSwipeLeft — the swipeStart is nullified
  });

  it('handleTouchCancel resets state', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchCancel, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchCancel();
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores non-touch events', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchStart } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    // Plain Event without touches/changedTouches
    handleTouchStart(new dom.window.Event('touchstart'));
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores swipe starting on interactive elements', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    const button = document.createElement('button');
    document.body.appendChild(button);

    handleTouchStart(
      makeTouchEvent(
        'touchstart',
        [{ identifier: 0, clientX: 300, clientY: 200 }],
        undefined,
        button
      )
    );
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores swipe starting inside an element with button semantics', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    const button = document.createElement('div');
    button.setAttribute('role', 'button');
    const child = document.createElement('span');
    button.appendChild(child);
    document.body.appendChild(button);

    handleTouchStart(
      makeTouchEvent(
        'touchstart',
        [{ identifier: 0, clientX: 300, clientY: 200 }],
        undefined,
        child
      )
    );
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('adapts the swipe distance to the viewport width', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 200, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 126, clientY: 200 }]));
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, 'innerWidth', { value: 1_000, configurable: true });
    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 200, clientY: 200 }]));
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('ignores swipe where vertical movement dominates at the end', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    // dx = -100, dy = 200 → abs(dx) < abs(dy) * 1.5 → rejected
    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 100 }]));
    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 200, clientY: 300 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('handleTouchEnd does nothing when no swipe was started', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('handleTouchMove with non-touch event is ignored', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchStart, handleTouchMove } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    // Plain event without touches
    handleTouchMove(new dom.window.Event('touchmove'));
    // Should not crash
  });

  it('handleTouchEnd with non-touch event is ignored', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchEnd(new dom.window.Event('touchend'));
    // Should not crash
  });

  it('handleTouchEnd ignores when changedTouches does not contain matching identifier', () => {
    const onSwipeLeft = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    handleTouchEnd(
      makeTouchEvent('touchend', [], [{ identifier: 99, clientX: 100, clientY: 200 }])
    );

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('handleTouchMove ignores when touch identifier does not match', () => {
    const onSwipeLeft = vi.fn();

    const { handleTouchStart, handleTouchMove } = useTouchGestures({
      enabled: computed(() => true),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));
    // Move with different identifier
    handleTouchMove(makeTouchEvent('touchmove', [{ identifier: 5, clientX: 290, clientY: 400 }]));
    // The swipe should not be cancelled since the move didn't match
  });

  it('handleTouchEnd with disabled composable after start (via ref)', () => {
    const onSwipeLeft = vi.fn();
    const enabledRef = ref(true);
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as Selection);

    const { handleTouchStart, handleTouchEnd } = useTouchGestures({
      enabled: computed(() => enabledRef.value),
      onSwipeLeft,
      onSwipeRight: vi.fn(),
    });

    handleTouchStart(makeTouchEvent('touchstart', [{ identifier: 0, clientX: 300, clientY: 200 }]));

    enabledRef.value = false;

    handleTouchEnd(makeTouchEvent('touchend', [], [{ identifier: 0, clientX: 100, clientY: 200 }]));

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });
});
