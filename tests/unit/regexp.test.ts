import { describe, expect, it } from 'vitest';
import { toReStr, wildcardToRegExpStr } from '../../src/common/utils/regexp';

describe('toReStr', () => {
  it('escapes regular expression special characters', () => {
    const source = 'a+b*c?(test)[group]{1}|^$\\';
    const expected = 'a\\+b\\*c\\?\\(test\\)\\[group\\]\\{1\\}\\|\\^\\$\\\\';
    expect(toReStr(source)).toBe(expected);
  });
});

describe('wildcardToRegExpStr', () => {
  it('returns regex source when given a RegExp', () => {
    expect(wildcardToRegExpStr(/abc.*/)).toBe('abc.*');
  });

  it('converts single asterisk to match any characters', () => {
    const pattern = new RegExp(wildcardToRegExpStr('https://example.com/*'));
    expect(pattern.test('https://example.com/path')).toBe(true);
    expect(pattern.test('https://example.com/nested/path')).toBe(true);
    expect(pattern.test('https://other.com/path')).toBe(false);
  });

  it('treats consecutive asterisks as a single path segment matcher', () => {
    const pattern = new RegExp(wildcardToRegExpStr('foo/**/bar'));
    expect(pattern.test('foo/segment/bar')).toBe(true);
    expect(pattern.test('foo/segment/another/bar')).toBe(false);
  });
});
