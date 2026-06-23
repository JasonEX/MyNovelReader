import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { findBuiltInRule } from '@/core/rules/builtInRules';
import { Parser } from '@/core/parser';

function makeDoc(html: string, url: string): Document {
  return new JSDOM(html, { url }).window.document;
}

function pageHtml(options: {
  body: string;
  nextHref: string;
  nextText: string;
  pageLabel: string;
  prevHref: string;
}): string {
  return `
    <!doctype html>
    <html>
      <head>
        <title>快意恩仇，我以暴力殺穿整個亂世_第33章 他別讓我失望就成！_免費小說閱讀_uu看書</title>
      </head>
      <body>
        <ul class="bread">
          <li><a href="/">首頁</a></li>
          <li><a href="/class/1">玄幻</a></li>
          <li><a href="/author">作者</a></li>
          <li><a href="/1880014">快意恩仇，我以暴力殺穿整個亂世</a></li>
        </ul>
        <h1 class="chatit">第33章 他別讓我失望就成！（${options.pageLabel}）</h1>
        <div class="txt_tcontent">
          <p>${options.body}</p>
        </div>
        <div class="chapter-nav">
          <a class="btn-primary radius-rounded" href="${options.prevHref}">上一章</a>
          <a class="btn-primary radius-rounded" href="javascript:report()">報錯</a>
          <a class="btn-primary radius-rounded" href="/1880014">目錄</a>
          <a class="btn-primary radius-rounded" href="${options.nextHref}">${options.nextText}</a>
        </div>
      </body>
    </html>
  `;
}

describe('UUread rule', () => {
  it('is auto-discovered as a site rule', () => {
    const rule = findBuiltInRule('https://www.uuread.tw/chapter/1880014/2545609.html');

    expect(rule?.id).toBe('uuread');
    expect(rule?.version).toBe(2);
  });

  it('merges paged chapters, cleans page markers from title, and keeps real next chapter', async () => {
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });

    const page1Url = 'https://www.uuread.tw/chapter/1880014/2545609.html';
    const page2Url = 'https://www.uuread.tw/chapter/1880014/2545609_2.html';
    const prevChapterUrl = 'https://www.uuread.tw/chapter/1880014/2545608.html';
    const nextChapterUrl = 'https://www.uuread.tw/chapter/1880014/2545611.html';

    const pages = new Map<string, string>([
      [
        page1Url,
        pageHtml({
          body: '第一页正文。'.repeat(120),
          nextHref: '/chapter/1880014/2545609_2.html',
          nextText: '下一頁',
          pageLabel: '1 / 2',
          prevHref: '/chapter/1880014/2545608.html',
        }),
      ],
      [
        page2Url,
        pageHtml({
          body: '第二页正文。'.repeat(120),
          nextHref: '/chapter/1880014/2545611.html',
          nextText: '下一章',
          pageLabel: '2 / 2',
          prevHref: '/chapter/1880014/2545609.html',
        }),
      ],
    ]);

    const parser = new Parser();
    const merger = createSectionMerger(parser);
    const result = await merger.merge(makeDoc(pages.get(page1Url)!, page1Url), page1Url, {
      fetcher: async url => makeDoc(pages.get(url)!, url),
      maxPages: 10,
    });

    expect(result?.title).toBe('第33章 他別讓我失望就成！');
    expect(result?.bookTitle).toBe('快意恩仇，我以暴力殺穿整個亂世');
    expect(result?.url).toBe(page1Url);
    expect(result?.prevUrl).toBe(prevChapterUrl);
    expect(result?.indexUrl).toBe('https://www.uuread.tw/1880014');
    expect(result?.nextUrl).toBe(nextChapterUrl);
    expect(result?.content).toContain('第一页正文。');
    expect(result?.content).toContain('第二页正文。');
  });
});
