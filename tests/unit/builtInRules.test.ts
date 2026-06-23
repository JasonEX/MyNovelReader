import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { builtInRules, findBuiltInRule, getBuiltInRulesCount } from '@/core/rules/builtInRules';
import { Parser } from '@/core/parser';
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

  it('builds Qidian TOC URL from the stable book detail page', async () => {
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });

    const url = 'https://www.qidian.com/chapter/1045659200/850667574/';
    const pageContext = {
      pageContext: {
        pageProps: {
          pageData: {
            bookInfo: {
              bookId: 1045659200,
              bookName: '为武道狂，拳压诸天',
            },
            chapterInfo: {
              chapterName: '第一章 武当寻旧',
              content: '<p>武当山正文。</p>',
              next: 850662591,
              prev: -1,
            },
          },
        },
      },
    };
    const doc = new JSDOM(
      `<!doctype html>
      <html>
        <head><title>第一章 武当寻旧 _《为武道狂，拳压诸天》小说在线阅读 - 起点中文网</title></head>
        <body>
          <script id="vite-plugin-ssr_pageContext" type="application/json">${JSON.stringify(
            pageContext
          )}</script>
          <main id="c-850667574"><h1 class="title">第一章 武当寻旧</h1><p>武当山正文。</p></main>
        </body>
      </html>`,
      { url }
    ).window.document;

    const chapter = await new Parser().parse(doc, url);

    expect(chapter?.indexUrl).toBe('https://www.qidian.com/book/1045659200/');
    expect(chapter?.nextUrl).toBe('https://www.qidian.com/chapter/1045659200/850662591/');
  });
});
