import { beforeEach, describe, expect, it } from 'vitest';

import {
  appendScopedCustomParagraphFilter,
  compileCustomParagraphFilters,
  filterCustomParagraphs,
  formatScopedCustomParagraphFilter,
  getCustomParagraphFilterHostname,
  getCustomParagraphFiltersForHostname,
  getCustomParagraphFiltersForUrl,
  MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH,
  MAX_CUSTOM_PARAGRAPH_FILTERS,
  MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS,
  MAX_CUSTOM_PARAGRAPH_SITE_FILTERS,
} from '@/ui/contentFilters';
import { createDom } from '../testUtils/dom';

describe('custom paragraph filters', () => {
  beforeEach(() => {
    createDom();
  });

  it('compiles global and exact-hostname rules while reporting invalid lines', () => {
    const result = compileCustomParagraphFilters(
      ['广告.*\\.com', '', '@host=M.1QXS.COM ^测试尾注$', '[', '@host=bad/path.example 正文'].join(
        '\n'
      )
    );

    expect(result.globalPatterns).toHaveLength(1);
    expect(result.globalPatterns[0]).toMatchObject({
      global: false,
      ignoreCase: true,
      unicode: true,
    });
    expect(result.patternsByHostname.get('m.1qxs.com')).toHaveLength(1);
    expect(result.errors).toEqual([
      { line: 4, message: '不是有效的正则表达式' },
      { line: 5, message: 'hostname 无效' },
    ]);
  });

  it('selects only global and exact-hostname rules for each chapter URL', () => {
    const compiled = compileCustomParagraphFilters(
      ['^全局$', '@host=a.example.com ^甲站$', '@host=b.example.com ^乙站$'].join('\n')
    );

    expect(getCustomParagraphFiltersForHostname(compiled, 'A.EXAMPLE.COM')).toHaveLength(2);
    expect(getCustomParagraphFiltersForUrl(compiled, 'https://a.example.com/book/1')).toHaveLength(
      2
    );
    expect(getCustomParagraphFiltersForUrl(compiled, 'https://sub.a.example.com/book/1')).toEqual(
      compiled.globalPatterns
    );
    expect(getCustomParagraphFiltersForUrl(compiled, 'not a url')).toEqual(compiled.globalPatterns);
  });

  it('normalizes chapter hostnames and formats complete scoped rules', () => {
    expect(getCustomParagraphFilterHostname('https://M.1QXS.COM:443/x')).toBe('m.1qxs.com');
    expect(getCustomParagraphFilterHostname('javascript:alert(1)')).toBeNull();
    expect(formatScopedCustomParagraphFilter('M.1QXS.COM.', '  正文.*广告  ')).toBe(
      '@host=m.1qxs.com 正文.*广告'
    );
    expect(formatScopedCustomParagraphFilter('bad/path', '正文')).toBeNull();
    expect(formatScopedCustomParagraphFilter('example.com', '   ')).toBeNull();
  });

  it('appends a complete current-site rule as one bounded state transition', () => {
    expect(appendScopedCustomParagraphFilter('全局规则', 'M.1QXS.COM', '  本站广告$  ')).toEqual({
      source: '全局规则\n@host=m.1qxs.com 本站广告$',
      error: null,
    });
    expect(appendScopedCustomParagraphFilter('全局规则', 'bad/path', '本站广告$')).toEqual({
      source: '全局规则',
      error: '无法识别当前章节 hostname',
    });
    expect(appendScopedCustomParagraphFilter('全局规则', 'example.com', '[')).toEqual({
      source: '全局规则',
      error: '不是有效的正则表达式',
    });
  });

  it('bounds global, per-site, total, and per-rule resources independently', () => {
    const tooLong = 'x'.repeat(MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH + 1);
    expect(compileCustomParagraphFilters(tooLong)).toMatchObject({
      globalPatterns: [],
      errors: [
        {
          line: 1,
          message: `单条规则不能超过 ${MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH} 个字符`,
        },
      ],
    });

    const globalSource = Array.from(
      { length: MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS + 1 },
      (_, index) => `global-${index}`
    ).join('\n');
    const globals = compileCustomParagraphFilters(globalSource);
    expect(globals.globalPatterns).toHaveLength(MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS);
    expect(globals.errors).toEqual([
      {
        line: MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS + 1,
        message: `全局最多支持 ${MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS} 条规则`,
      },
    ]);

    const siteSource = Array.from(
      { length: MAX_CUSTOM_PARAGRAPH_SITE_FILTERS + 1 },
      (_, index) => `@host=example.com site-${index}`
    ).join('\n');
    const site = compileCustomParagraphFilters(siteSource);
    expect(site.patternsByHostname.get('example.com')).toHaveLength(
      MAX_CUSTOM_PARAGRAPH_SITE_FILTERS
    );
    expect(site.errors).toEqual([
      {
        line: MAX_CUSTOM_PARAGRAPH_SITE_FILTERS + 1,
        message: `每个网站最多支持 ${MAX_CUSTOM_PARAGRAPH_SITE_FILTERS} 条规则`,
      },
    ]);

    const totalSource = Array.from(
      { length: MAX_CUSTOM_PARAGRAPH_FILTERS + 1 },
      (_, index) => `@host=site-${index}.example.com rule-${index}`
    ).join('\n');
    const total = compileCustomParagraphFilters(totalSource);
    expect(total.patternsByHostname).toHaveLength(MAX_CUSTOM_PARAGRAPH_FILTERS);
    expect(total.errors).toEqual([
      {
        line: MAX_CUSTOM_PARAGRAPH_FILTERS + 1,
        message: `全部网站合计最多支持 ${MAX_CUSTOM_PARAGRAPH_FILTERS} 条规则`,
      },
    ]);
  });

  it('removes only matching paragraphs using normalized visible text', () => {
    const html = [
      '<p class="keep"><strong>正文</strong>保留。</p>',
      '<p class="remove">小说<span>免费阅读</span>，请收藏　 一七小说【1qxs.com】</p>',
      '<div>小说免费阅读，请收藏 一七小说【1qxs.com】</div>',
    ].join('');
    const { globalPatterns } = compileCustomParagraphFilters(
      '^小说免费阅读，请收藏 一七小说【1qxs\\.com】$'
    );

    const result = filterCustomParagraphs(html, globalPatterns);

    expect(result).not.toContain('class="remove"');
    expect(result).toContain('<p class="keep"><strong>正文</strong>保留。</p>');
    expect(result).toContain('<div>小说免费阅读，请收藏 一七小说【1qxs.com】</div>');
    expect(html).toContain('class="remove"');
  });

  it('returns the original HTML without parsing when no filters are enabled', () => {
    const html = '<p data-source="canonical">正文</p>';

    expect(filterCustomParagraphs(html, [])).toBe(html);
    expect(filterCustomParagraphs('', [/广告/u])).toBe('');
  });
});
