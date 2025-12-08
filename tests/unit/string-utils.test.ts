import { describe, expect, it } from 'vitest';
import { locations } from '../../src/common/utils/string';

describe('locations', () => {
  it('returns all starting indexes of substring occurrences', () => {
    expect(locations('test', 'test test test')).toEqual([0, 5, 10]);
    expect(locations('aba', 'ababa')).toEqual([0, 2]);
  });

  it('handles overlapping matches', () => {
    expect(locations('aa', 'aaaa')).toEqual([0, 1, 2]);
  });

  it('returns empty array when no matches are found', () => {
    expect(locations('z', 'abc')).toEqual([]);
  });
});
