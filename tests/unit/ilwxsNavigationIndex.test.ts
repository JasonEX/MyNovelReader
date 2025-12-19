/**
 * Regression test: ilwxs chapter pages contain both "书页" and "目录".
 * The script must use the real TOC (/shu/{bookId}/) as indexUrl.
 */

import { describe, expect, it } from 'vitest';
import { getParser } from '@/core/parser';
import { JSDOM } from 'jsdom';

describe('ilwxs navigation index', () => {
  it('should prefer /shu/{bookId}/ over /info-{bookId}.html for indexUrl', async () => {
    const url = 'https://m.ilwxs.com/shu/36354/171272950.html';
    const dom = new JSDOM(
      `<!DOCTYPE html>
      <html>
        <head><title>最后的黑暗之王</title></head>
        <body>
          <div class="pager">
            <a href="/shu/36354/171062833.html">上一章</a>
            <a href="/info-36354.html">书 页</a>
            <a href="/shu/36354/171272951.html">下一章</a>
          </div>

          <h1 class="headline">第877章 深渊之战（上）</h1>
          <div class="path">
            <a href="/">首页</a>
            <a href="/info-36354.html">最后的黑暗之王</a>
          </div>

          <div class="content">CONTENT</div>

          <div class="pager">
            <a href="/shu/36354/171062833.html">上一章</a>
            <a href="/shu/36354/">目 录</a>
            <a href="/shu/36354/171272951.html">下一章</a>
          </div>
        </body>
      </html>`,
      { url }
    );

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom DOMParser to globalThis
    globalThis.DOMParser = dom.window.DOMParser;
    // @ts-expect-error - test env: assigning jsdom Node to globalThis
    globalThis.Node = dom.window.Node;
    // @ts-expect-error - test env: align DOM constructors for instanceof checks
    globalThis.HTMLAnchorElement = dom.window.HTMLAnchorElement;

    // Stub GM_* storage APIs used by RuleStorage / RuleManager
    // @ts-expect-error - userscript global stub
    globalThis.GM_listValues = () => [];
    // @ts-expect-error - userscript global stub
    globalThis.GM_getValue = () => null;
    // @ts-expect-error - userscript global stub
    globalThis.GM_setValue = () => {};
    // @ts-expect-error - userscript global stub
    globalThis.GM_deleteValue = () => {};

    const parser = getParser();
    const parsed = await parser.parse(dom.window.document, url);
    expect(parsed?.indexUrl).toBe('https://m.ilwxs.com/shu/36354/');
  });
});
