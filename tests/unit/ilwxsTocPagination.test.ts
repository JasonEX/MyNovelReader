/**
 * Unit tests for paginated TOC loading (m.ilwxs.com)
 */

import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { useReaderStore } from '@/ui/stores/reader';

type MockGmXhrOpts = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  overrideMimeType?: string;
  onload: (resp: { status: number; responseText: string }) => void;
  onerror: (err: unknown) => void;
  ontimeout: () => void;
};

describe('ilwxs TOC pagination', () => {
  it('should load multiple TOC pages by following "下一页"', async () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://x.test/' });
    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom DOMParser to globalThis
    globalThis.DOMParser = dom.window.DOMParser;
    // @ts-expect-error - test env: assigning jsdom Node to globalThis
    globalThis.Node = dom.window.Node;

    setActivePinia(createPinia());

    const page1Url = 'https://m.ilwxs.com/shu/36354/';
    const page2Url = 'https://m.ilwxs.com/shu/36354_2/';
    const page3Url = 'https://m.ilwxs.com/shu/36354_3/';

    const page1Html = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div class="caption">
            <span>
              【<a href="/shu/36354_2/">下一页</a>】
              【<a href="/shu/36354_3/">尾页</a>】
            </span>
          </div>
          <ul class="read">
            <li><a href="/shu/36354/125361606.html">第1章 凶手</a></li>
            <li><a href="/shu/36354/125361607.html">第2章 线索</a></li>
            <li><a href="/shu/36354/125361608.html">第3章 追踪</a></li>
            <li><a href="/shu/36354/125361609.html">第4章 真相</a></li>
          </ul>
          <a href="/down/36354.html">TXT下载</a>
        </body>
      </html>
    `;

    const page2Html = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div class="caption">
            <span>【<a href="/shu/36354_3/">下一页</a>】</span>
          </div>
          <ul class="read">
            <li><a href="/shu/36354/125361610.html">第5章 开端</a></li>
            <li><a href="/shu/36354/125361611.html">第6章 继续</a></li>
            <li><a href="/shu/36354/125361612.html">第7章 转折</a></li>
            <li><a href="/shu/36354/125361613.html">第8章 余波</a></li>
          </ul>
        </body>
      </html>
    `;

    const page3Html = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <ul class="read">
            <li><a href="/shu/36354/125361614.html">第9章 新局</a></li>
            <li><a href="/shu/36354/125361615.html">第10章 风起</a></li>
            <li><a href="/shu/36354/125361616.html">第11章 暗流</a></li>
            <li><a href="/shu/36354/125361617.html">第12章 落子</a></li>
          </ul>
        </body>
      </html>
    `;

    // Stub GM_* storage APIs (restoreCache runs on setChapter)
    // @ts-expect-error - userscript global stub
    globalThis.GM_listValues = () => [];
    // @ts-expect-error - userscript global stub
    globalThis.GM_getValue = () => null;
    // @ts-expect-error - userscript global stub
    globalThis.GM_setValue = () => {};
    // @ts-expect-error - userscript global stub
    globalThis.GM_deleteValue = () => {};

    const gm = vi.fn((opts: MockGmXhrOpts) => {
      const u = opts.url;
      let responseText = page1Html;
      if (u === page2Url) responseText = page2Html;
      if (u === page3Url) responseText = page3Html;
      setTimeout(() => opts.onload({ status: 200, responseText }), 0);
      return { abort: () => {} };
    });

    // @ts-expect-error - userscript global stub
    globalThis.GM_xmlhttpRequest = gm;

    const store = useReaderStore();
    store.setChapter({
      title: '第1章 凶手',
      bookTitle: '最后的黑暗之王',
      content: 'x',
      rawContent: 'x',
      prevUrl: null,
      nextUrl: null,
      indexUrl: page1Url,
      url: 'https://m.ilwxs.com/shu/36354/125361606.html',
      confidence: 1,
      method: 'rule',
      rule: {
        id: 'ilwxs',
        version: 1,
        match: { pattern: '.*' },
        content: { selector: '.content' },
        navigation: { index: 'a' },
        meta: { source: 'builtin' },
      },
    });

    await store.loadToc();

    // Fetched page1 + followed next to page2 + page3
    expect(gm).toHaveBeenCalledTimes(3);
    expect(store.toc.length).toBe(12);
    expect(store.toc[0].url).toContain('/125361606.html');
    expect(store.toc[11].url).toContain('/125361617.html');
  });
});
