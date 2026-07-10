import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearAllTimers } from '@/core/protection/timers';

describe('clearAllTimers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clears every allocated interval and timeout id', () => {
    vi.spyOn(window, 'setInterval').mockReturnValue(
      2 as unknown as ReturnType<typeof window.setInterval>
    );
    vi.spyOn(window, 'setTimeout').mockReturnValue(
      3 as unknown as ReturnType<typeof window.setTimeout>
    );
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval').mockImplementation(() => {});
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout').mockImplementation(() => {});

    clearAllTimers();

    expect(clearIntervalSpy.mock.calls.map(([id]) => id)).toEqual([0, 1, 2]);
    expect(clearTimeoutSpy.mock.calls.map(([id]) => id)).toEqual([0, 1, 2, 3]);
  });
});
