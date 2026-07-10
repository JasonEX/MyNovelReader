/**
 * Regression test: when GM_xmlhttpRequest redirects, use response.finalUrl as base for resolving
 * relative TOC links.
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
  onload: (resp: { status: number; responseText: string; finalUrl?: string }) => void;
  onerror: (err: unknown) => void;
  ontimeout: () => void;
};

describe('reader TOC (finalUrl base)', () => {
  it('resolves relative chapter links against response.finalUrl', async () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'https://example.com/book/chapter/0',
    });
    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // test env: assigning jsdom DOMParser to globalThis
    globalThis.DOMParser = dom.window.DOMParser;
    // test env: assigning jsdom Node to globalThis
    globalThis.Node = dom.window.Node;

    setActivePinia(createPinia());

    // Stub GM_* storage APIs used by RuleStorage / caching.
    // userscript global stub
    globalThis.GM_listValues = () => [];
    // userscript global stub
    globalThis.GM_getValue = <T>(_name: string, defaultValue?: T): T => defaultValue as T;
    // userscript global stub
    globalThis.GM_setValue = () => {};
    // userscript global stub
    globalThis.GM_deleteValue = () => {};

    const indexUrl = 'https://example.com/book'; // Requested URL (no trailing slash)
    const redirectedIndexUrl = 'https://example.com/book/'; // Effective URL after redirect

    const tocHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <ul class="read">
            <li><a href="chapter/1">第1章 测试</a></li>
          </ul>
        </body>
      </html>
    `;

    const gm = vi.fn((opts: MockGmXhrOpts) => {
      expect(opts.url).toBe(indexUrl);
      setTimeout(
        () => opts.onload({ status: 200, responseText: tocHtml, finalUrl: redirectedIndexUrl }),
        0
      );
      return { abort: () => {} };
    });

    // userscript global stub
    globalThis.GM_xmlhttpRequest = gm as unknown as typeof GM_xmlhttpRequest;

    const store = useReaderStore();
    store.setChapter({
      title: '第0章',
      bookTitle: '测试书名',
      content: 'init',
      rawContent: 'init',
      prevUrl: undefined,
      nextUrl: undefined,
      indexUrl,
      url: 'https://example.com/book/chapter/0',
      confidence: 1,
      method: 'detection',
    });

    await store.loadToc();

    expect(store.toc).toHaveLength(1);
    expect(store.toc[0].url).toBe('https://example.com/book/chapter/1');
  });
});
