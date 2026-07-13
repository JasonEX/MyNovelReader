/**
 * useTouchGestures - Composable for swipe gesture handling
 *
 * Detects horizontal swipe gestures for page turns
 * while properly filtering out vertical scrolls and interactive elements.
 */

import type { ComputedRef } from 'vue';

// === Types ===
type SwipeStartState = {
  id: number;
  x: number;
  y: number;
  time: number;
  threshold: number;
  cancelled: boolean;
};

type TouchPoint = {
  identifier: number;
  clientX: number;
  clientY: number;
};

type TouchEventLike = {
  touches: ArrayLike<TouchPoint>;
  changedTouches: ArrayLike<TouchPoint>;
  target: unknown;
};

// === Constants ===
const SWIPE_MIN_THRESHOLD_PX = 72;
const SWIPE_MAX_THRESHOLD_PX = 120;
const SWIPE_VIEWPORT_RATIO = 0.18;
const SWIPE_MAX_DURATION_MS = 700;
const SWIPE_CANCEL_VERTICAL_PX = 28;
const SWIPE_AXIS_RATIO = 1.5;

function isTouchEvent(e: Event): e is Event & TouchEventLike {
  const candidate = e as unknown as Partial<TouchEventLike>;
  return Boolean(candidate.touches && candidate.changedTouches);
}

function isInteractiveElement(target: unknown): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'a, button, input, textarea, select, label, summary, [contenteditable], [role="button"]'
    )
  );
}

function getSwipeThreshold(): number {
  return Math.min(
    SWIPE_MAX_THRESHOLD_PX,
    Math.max(SWIPE_MIN_THRESHOLD_PX, window.innerWidth * SWIPE_VIEWPORT_RATIO)
  );
}

export interface UseTouchGesturesOptions {
  enabled: ComputedRef<boolean>;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useTouchGestures(options: UseTouchGesturesOptions) {
  const { enabled, onSwipeLeft, onSwipeRight } = options;

  let swipeStart: SwipeStartState | null = null;

  function handleTouchStart(e: Event) {
    if (!enabled.value) return;
    if (!isTouchEvent(e)) return;
    if (e.touches.length !== 1) return;
    if (isInteractiveElement(e.target)) return;

    const touch = e.touches[0];
    swipeStart = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      threshold: getSwipeThreshold(),
      cancelled: false,
    };
  }

  function handleTouchMove(e: Event) {
    if (!swipeStart) return;
    if (!isTouchEvent(e)) return;
    if (e.touches.length !== 1) {
      swipeStart = null;
      return;
    }

    const touch = Array.from(e.touches).find(t => t.identifier === swipeStart?.id);
    if (!touch) return;

    const dx = touch.clientX - swipeStart.x;
    const dy = touch.clientY - swipeStart.y;

    // Cancel if it's clearly a vertical scroll gesture.
    if (
      Math.abs(dy) >= SWIPE_CANCEL_VERTICAL_PX &&
      Math.abs(dy) >= Math.abs(dx) * SWIPE_AXIS_RATIO
    ) {
      swipeStart.cancelled = true;
    }
  }

  function handleTouchEnd(e: Event) {
    if (!swipeStart) return;
    if (!isTouchEvent(e)) return;

    const start = swipeStart;
    swipeStart = null;

    if (start.cancelled) return;
    if (!enabled.value) return;

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    const touch = Array.from(e.changedTouches).find(t => t.identifier === start.id);
    if (!touch) return;

    const dt = Date.now() - start.time;
    if (dt > SWIPE_MAX_DURATION_MS) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) < start.threshold) return;
    if (Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO) return;

    // Reader UX: swipe left => page down, swipe right => page up.
    if (dx < 0) {
      onSwipeLeft();
    } else {
      onSwipeRight();
    }
  }

  function handleTouchCancel() {
    swipeStart = null;
  }

  return { handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel };
}
