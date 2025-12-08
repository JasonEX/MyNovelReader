import { describe, expect, it } from 'vitest';
import { formatMillisencod } from '../../src/common/utils/datetime';

describe('formatMillisencod', () => {
  it('formats milliseconds into hh:mm:ss with padding', () => {
    expect(formatMillisencod(3_661_000)).toBe('01:01:01');
    expect(formatMillisencod(61_000)).toBe('00:01:01');
    expect(formatMillisencod(0)).toBe('00:00:00');
  });

  it('uses absolute value for negative durations', () => {
    expect(formatMillisencod(-90_500)).toBe('00:01:30');
  });
});
