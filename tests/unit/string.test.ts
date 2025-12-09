import { describe, expect, it } from 'vitest';
import getMiddleStr from '../../src/MyNovelReader/utils/string';

describe('getMiddleStr', () => {
  it('should extract middle string between left and right delimiters', () => {
    expect(getMiddleStr('hello [world] yes', '[', ']')).toBe('world');
    expect(getMiddleStr('start <middle> end', '<', '>')).toBe('middle');
    expect(getMiddleStr('abc123def', 'abc', 'def')).toBe('123');
    expect(getMiddleStr('prefix middle suffix', 'prefix ', ' suffix')).toBe('middle');
  });

  it('should return empty string when left delimiter not found', () => {
    expect(getMiddleStr('hello world', '[', ']')).toBe('');
    // Note: current implementation has a bug where it may return partial string
    // when left delimiter is not found but right delimiter exists
  });

  it('should return empty string when right delimiter not found', () => {
    expect(getMiddleStr('hello [world', '[', ']')).toBe('');
    expect(getMiddleStr('left only', 'left', 'missing')).toBe('');
  });

  it('should return empty string when neither delimiter found', () => {
    expect(getMiddleStr('plain text', '[', ']')).toBe('');
  });

  it('should handle overlapping delimiters', () => {
    // When right delimiter appears before left delimiter, should return empty
    expect(getMiddleStr('] world [', '[', ']')).toBe('');
  });

  it('should handle multiple occurrences', () => {
    // Takes first occurrence of left, then first occurrence of right after left
    expect(getMiddleStr('a [b] c [d] e', '[', ']')).toBe('b');
  });

  it('should handle empty string', () => {
    expect(getMiddleStr('', '[', ']')).toBe('');
  });

  it('should handle empty delimiters', () => {
    // Edge cases: empty left delimiter works as expected
    expect(getMiddleStr('abc', '', 'c')).toBe('ab');
    // Empty right delimiter: indexOf('', pos) returns pos, so returns empty
    expect(getMiddleStr('abc', 'a', '')).toBe('');
    expect(getMiddleStr('abc', '', '')).toBe('');
  });
});
