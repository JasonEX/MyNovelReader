import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { builtInRules, findBuiltInRule, getBuiltInRulesCount } from '@/core/rules/builtInRules';
import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
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

  it('uses native fetch instead of iframe for mobile Qidian chapters', async () => {
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });

    const mobileUrl = 'https://m.qidian.com/chapter/1049115805/903889110/';
    const desktopUrl = 'https://www.qidian.com/chapter/1049115805/903889110/';
    const mobileRule = findBuiltInRule(mobileUrl);
    const desktopRule = findBuiltInRule(desktopUrl);

    expect(mobileRule?.id).toBe('qidian-mobile');
    expect(mobileRule?.advanced?.useIframe).not.toBe(true);
    expect(desktopRule?.id).toBe('qidian');
    expect(desktopRule?.advanced?.useIframe).toBe(true);

    const pageContext = {
      pageContext: {
        pageProps: {
          pageData: {
            bookInfo: {
              bookId: 1049115805,
              bookName: '苟在仙宗打铁，悄悄修成道祖',
            },
            chapterInfo: {
              chapterName: '第7章 指间陀螺',
              content: '<p>午后。</p>',
              next: 903937574,
              prev: 903692507,
            },
          },
        },
      },
    };
    const doc = new JSDOM(
      `<!doctype html>
      <html>
        <head><title>第7章 指间陀螺 _小说在线阅读 - 起点中文网手机版</title></head>
        <body>
          <script id="vite-plugin-ssr_pageContext" type="application/json">${JSON.stringify(
            pageContext
          )}</script>
          <main id="c-903889110"><h1 class="title">第7章 指间陀螺</h1><p>午后。</p></main>
        </body>
      </html>`,
      { url: mobileUrl }
    ).window.document;

    const chapter = await new Parser().parse(doc, mobileUrl);

    expect(chapter?.rule?.id).toBe('qidian-mobile');
    expect(chapter?.indexUrl).toBe('https://m.qidian.com/book/1049115805/');
    expect(chapter?.prevUrl).toBe('https://m.qidian.com/chapter/1049115805/903692507/');
    expect(chapter?.nextUrl).toBe('https://m.qidian.com/chapter/1049115805/903937574/');
  });

  it('canonicalizes Qidian mobile book preview to the embedded first chapter', async () => {
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });

    const bookUrl = 'https://m.qidian.com/book/1049115805/';
    const pageContext = {
      pageContext: {
        pageProps: {
          pageData: {
            chapterContentInfo: {
              firstChapterId: 903299473,
              firstChapterT: '第1章 宗门杂役',
              nextChapterId: 903299284,
            },
          },
        },
        routeParams: {
          bookId: '1049115805',
        },
      },
    };
    const doc = new JSDOM(
      `<!doctype html>
      <html>
        <head><title>苟在仙宗打铁，悄悄修成道祖 小说在线阅读-起点中文网手机端</title></head>
        <body>
          <script id="vite-plugin-ssr_pageContext" type="application/json">${JSON.stringify(
            pageContext
          )}</script>
          <h1 class="detail__header-detail__title">苟在仙宗打铁，悄悄修成道祖</h1>
          <div class="_bookDetailTabs_1rj30_193"><span>章节试读</span></div>
          <div id="reader">
            <h2 class="title text-1.3em">
              第1章 宗门杂役<span class="review"><span class="review-count">10</span></span>
            </h2>
            <main id="c-903299473">
              <p>玄天宗，外门杂役堂。</p>
              <p>所有人收拾好行李，一炷香之内到广场集合。</p>
            </main>
          </div>
        </body>
      </html>`,
      { url: bookUrl }
    ).window.document;

    const chapter = await createSectionMerger(new Parser()).merge(doc, bookUrl);

    expect(chapter?.rule?.id).toBe('qidian-mobile');
    expect(chapter?.url).toBe('https://m.qidian.com/chapter/1049115805/903299473/');
    expect(chapter?.title).toBe('第1章 宗门杂役');
    expect(chapter?.indexUrl).toBe('https://m.qidian.com/book/1049115805/');
    expect(chapter?.nextUrl).toBe('https://m.qidian.com/chapter/1049115805/903299284/');
    expect(chapter?.content).toContain('所有人收拾好行李');
  });
});
