import { describe, expect, it } from 'vitest';

import {
  type AutoLoadPolicyInput,
  decideAutoLoadNext,
  INTERSECTION_ROOT_MARGIN_PX,
  isViewportNearBottom,
} from '@/ui/composables/reader/autoLoadPolicy';

function makeInput(overrides: Partial<AutoLoadPolicyInput> = {}): AutoLoadPolicyInput {
  return {
    autoLoadInFlight: false,
    enabled: true,
    failureCooldownUntil: 0,
    graceUntil: 0,
    hasChapter: true,
    hasNext: true,
    isLoading: false,
    isLoadingNext: false,
    isLoadingPrev: false,
    isNavigating: false,
    isNearBottom: true,
    now: 10_000,
    pageHidden: false,
    unreadLoadedChapterCount: 0,
    ...overrides,
  };
}

describe('autoLoadPolicy', () => {
  it('uses the configured 1600px near-bottom fallback', () => {
    expect(INTERSECTION_ROOT_MARGIN_PX).toBe(1600);
    expect(isViewportNearBottom(5000, 2900, 600)).toBe(true);
    expect(isViewportNearBottom(6000, 1000, 600)).toBe(false);
  });

  it('waits for the hard reading grace period before starting', () => {
    expect(decideAutoLoadNext('state', makeInput({ now: 1000, graceUntil: 3000 }))).toEqual({
      type: 'schedule',
      dueAt: 3000,
    });
  });

  it('starts after the grace period when the base state is eligible', () => {
    expect(decideAutoLoadNext('state', makeInput())).toEqual({ type: 'start' });
  });

  it('keeps scroll-driven triggers behind the distance gate', () => {
    expect(decideAutoLoadNext('scroll', makeInput({ isNearBottom: false }))).toEqual({
      type: 'idle',
      clearTimer: false,
    });
    expect(decideAutoLoadNext('visibility', makeInput({ isNearBottom: false }))).toEqual({
      type: 'start',
    });
  });

  it('retries a failed auto preload only after a later trigger reaches cooldown', () => {
    expect(
      decideAutoLoadNext('state', makeInput({ now: 1000, failureCooldownUntil: 6000 }))
    ).toEqual({
      type: 'idle',
      clearTimer: false,
    });
    expect(
      decideAutoLoadNext('sentinel', makeInput({ now: 1000, failureCooldownUntil: 6000 }))
    ).toEqual({
      type: 'schedule',
      dueAt: 6000,
    });
  });

  it('clears pending timers when preload is disabled or a next chapter is already buffered', () => {
    expect(decideAutoLoadNext('state', makeInput({ enabled: false }))).toEqual({
      type: 'idle',
      clearTimer: true,
    });
    expect(decideAutoLoadNext('state', makeInput({ unreadLoadedChapterCount: 1 }))).toEqual({
      type: 'idle',
      clearTimer: true,
    });
  });

  it('idles without clearing timers for temporary busy states', () => {
    expect(decideAutoLoadNext('state', makeInput({ isLoadingNext: true }))).toEqual({
      type: 'idle',
      clearTimer: false,
    });
  });
});
