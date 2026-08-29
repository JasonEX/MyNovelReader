import { beforeEach, describe, expect, it } from 'vitest';

import {
  compileCustomParagraphFilters,
  filterCustomParagraphs,
  MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH,
  MAX_CUSTOM_PARAGRAPH_FILTERS,
} from '@/ui/contentFilters';
import { createDom } from '../testUtils/dom';

describe('custom paragraph filters', () => {
  beforeEach(() => {
    createDom();
  });

  it('compiles valid non-empty lines and reports invalid lines without disabling them', () => {
    const result = compileCustomParagraphFilters('广告.*\\.com\n\n[\n^测试尾注$');

    expect(result.patterns).toHaveLength(2);
    expect(result.patterns[0]).toMatchObject({ global: false, ignoreCase: true, unicode: true });
    expect(result.errors).toEqual([{ line: 3, message: '不是有效的正则表达式' }]);
  });

  it('bounds the number and length of rules', () => {
    const tooLong = 'x'.repeat(MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH + 1);
    const tooMany = Array.from(
      { length: MAX_CUSTOM_PARAGRAPH_FILTERS + 1 },
      (_, index) => `rule-${index}`
    ).join('\n');

    expect(compileCustomParagraphFilters(tooLong)).toEqual({
      patterns: [],
      errors: [
        {
          line: 1,
          message: `单条规则不能超过 ${MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH} 个字符`,
        },
      ],
    });
    const result = compileCustomParagraphFilters(tooMany);
    expect(result.patterns).toHaveLength(MAX_CUSTOM_PARAGRAPH_FILTERS);
    expect(result.errors).toEqual([
      { line: MAX_CUSTOM_PARAGRAPH_FILTERS + 1, message: '最多支持 20 条规则' },
    ]);
  });

  it('removes only matching paragraphs using normalized visible text', () => {
    const html = [
      '<p class="keep"><strong>正文</strong>保留。</p>',
      '<p class="remove">小说<span>免费阅读</span>，请收藏　 一七小说【1qxs.com】</p>',
      '<div>小说免费阅读，请收藏 一七小说【1qxs.com】</div>',
    ].join('');
    const { patterns } = compileCustomParagraphFilters(
      '^小说免费阅读，请收藏 一七小说【1qxs\\.com】$'
    );

    const result = filterCustomParagraphs(html, patterns);

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
