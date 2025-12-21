import { describe, expect, it } from 'vitest';
import { builtInRules } from '@/core/rules/builtInRules';

describe('built-in rule: uukanshu.cc', () => {
  it('should prefer .readcotent as the first content selector', () => {
    const rule = builtInRules.find(r => r.id === 'uukanshu-cc');
    expect(rule).toBeTruthy();

    const firstSelector = (rule!.content.selector || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)[0];
    expect(firstSelector).toBe('.readcotent');

    const url = 'https://uukanshu.cc/book/26185/17096360.html';
    expect(new RegExp(rule!.match.pattern, 'i').test(url)).toBe(true);
  });
});
