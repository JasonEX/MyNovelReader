import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadTocEntriesPaged } from '@/ui/stores/reader/toc';
import { sto9Rule } from '@/core/rules/sites/sto9';

import { createDom } from '../testUtils/dom';

const chapterListHtml = `
  <ul>
    <li data-num="1"><a href="/txt/7974/3881377.html">第1章 開局</a></li>
    <li data-num="765"><a href="/txt/7974/7627078.html">第765章 生死存亡！</a></li>
    <li data-num="766"><a href="/txt/7974/7628065.html">第766章 援軍到了！</a></li>
    <li><a href="/book/7974/index.html">返回書頁</a></li>
  </ul>
`;

describe('Sto9 TOC loading', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    createDom('https://sto9.com/txt/7974/7627078.html');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads the complete catalog from the site chapter-list endpoint', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => ({
      ok: true,
      status: 200,
      text: async () => chapterListHtml,
    }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('GM_xmlhttpRequest', undefined);

    const entries = await loadTocEntriesPaged(
      'https://sto9.com/book/7974/index.html',
      'https://sto9.com/txt/7974/7627078.html',
      sto9Rule,
      vi.fn()
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      'https://sto9.com/ajax_novels/chapterlist/7974.html'
    );
    expect(entries).toEqual([
      { title: '第1章 開局', url: 'https://sto9.com/txt/7974/3881377.html' },
      { title: '第765章 生死存亡！', url: 'https://sto9.com/txt/7974/7627078.html' },
      { title: '第766章 援軍到了！', url: 'https://sto9.com/txt/7974/7628065.html' },
    ]);
  });
});
