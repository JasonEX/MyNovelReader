import { describe, expect, it } from 'vitest';

import { builtInRules, findBuiltInRule, getBuiltInRulesCount } from '@/core/rules/builtInRules';
import type { SiteRule } from '@/core/rules/types';

describe('builtInRules helpers', () => {
  it('returns stable counts', () => {
    const counts = getBuiltInRulesCount();

    expect(counts.total).toBe(builtInRules.length);
    expect(counts.total).toBeGreaterThan(0);
    expect(counts.special).toBeGreaterThanOrEqual(0);
    expect(counts.simplified).toBeGreaterThanOrEqual(0);
  });

  it('findBuiltInRule respects excludes and skips invalid regex rules', () => {
    const url = 'https://uukanshu.cc/book/26185/17096360.html';

    const invalidRule = {
      id: 'invalid-regex',
      version: 1,
      match: { pattern: '[', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'builtin' },
    } satisfies SiteRule;

    const excludedRule = {
      id: 'excluded-first',
      name: 'excluded-first',
      version: 1,
      match: { pattern: 'uukanshu\\.cc', type: 'regex', exclude: ['17096360'] },
      content: { selector: '#content' },
      meta: { source: 'builtin' },
    } satisfies SiteRule;

    builtInRules.unshift(excludedRule);
    builtInRules.unshift(invalidRule);

    try {
      const found = findBuiltInRule(url);
      expect(found?.id).toBe('uukanshu-cc');
    } finally {
      builtInRules.shift();
      builtInRules.shift();
    }
  });

  it('findBuiltInRule returns undefined when no match exists', () => {
    expect(findBuiltInRule('https://example.com/not-a-novel')).toBeUndefined();
  });
});
