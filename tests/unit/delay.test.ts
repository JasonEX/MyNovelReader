import { describe, expect, it, vi } from 'vitest';
import { delay } from '../../src/common/utils/index';

describe('delay', () => {
  it('resolves after the specified milliseconds', async () => {
    vi.useFakeTimers();

    try {
      let resolved = false;
      const promise = delay(500).then(() => {
        resolved = true;
      });

      vi.advanceTimersByTime(499);
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(1);
      await promise;
      expect(resolved).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
