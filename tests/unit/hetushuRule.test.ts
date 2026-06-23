import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { findBuiltInRule } from '@/core/rules/builtInRules';
import { Parser } from '@/core/parser';

function makeDoc(): Document {
  const url = 'https://www.hetushu.com/book/9145/6567989.html';
  const dom = new JSDOM(
    `
      <!doctype html>
      <html>
        <head>
          <title>木叶：让宇智波再次伟大_第一章 还不如不激活呢_和图书</title>
          <style>
            #content .shown { display: block; }
            #content .noise { display: none; }
          </style>
        </head>
        <body>
          <div id="left"><h3><a href="/book/9145/">木叶：让宇智波再次伟大</a></h3></div>
          <a id="pre" href="/book/9145/6567988.html">上一章</a>
          <a id="next" href="/book/9145/6567990.html">下一章</a>
          <div id="content">
            <h2>第一章 还不如不激活呢</h2>
            <div id="second" class="shown">第二段正文<acronym>www.hetushu.com</acronym></div>
            <div id="first" class="shown">第一段正文</div>
            <div id="hidden" class="noise">隐藏广告</div>
          </div>
        </body>
      </html>
    `,
    { url, pretendToBeVisual: true }
  );

  return dom.window.document;
}

describe('Hetushu rule', () => {
  it('is auto-discovered as a site rule', () => {
    const rule = findBuiltInRule('https://www.hetushu.com/book/9145/6567989.html');

    expect(rule?.id).toBe('hetushu');
    expect(rule?.version).toBe(2);
  });

  it('keeps visible paragraphs and removes watermark tags', async () => {
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });

    const url = 'https://www.hetushu.com/book/9145/6567989.html';
    const chapter = await new Parser().parse(makeDoc(), url);

    expect(chapter?.rule?.id).toBe('hetushu');
    expect(chapter?.title).toContain('第一章');
    expect(chapter?.bookTitle).toBe('木叶：让宇智波再次伟大');
    expect(chapter?.prevUrl).toBe('https://www.hetushu.com/book/9145/6567988.html');
    expect(chapter?.nextUrl).toBe('https://www.hetushu.com/book/9145/6567990.html');
    expect(chapter?.indexUrl).toBe('https://www.hetushu.com/book/9145/');

    const content = chapter?.content || '';
    expect(content).toContain('第一段正文');
    expect(content).toContain('第二段正文');
    expect(content).not.toContain('隐藏广告');
    expect(content).not.toContain('hetushu.com');
  });
});
