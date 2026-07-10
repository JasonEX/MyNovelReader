import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadTocEntriesPaged } from '@/ui/stores/reader/toc';
import type { SiteRule } from '@/core/rules/types';

import { createDom } from '../testUtils/dom';

const twkanRule = { id: 'twkan' } as SiteRule;

const chapterListHtml = `
  <ul>
    <li><a href="/txt/93181/52973196">1.第1章 方小草的悔意</a></li>
    <li><a href="/txt/93181/53052605">120.第120章 進化〖暴龍獸〗！力量湧上來了！</a></li>
    <li><a href="/txt/93181/53052605">120.第120章 進化〖暴龍獸〗！力量湧上來了！</a></li>
    <li><a href="/book/93181/index.html">返回書頁</a></li>
  </ul>
`;

describe('Twkan TOC loading', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    createDom('https://twkan.com/txt/93181/53052605');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads full catalog entries from the chapterlist HTML endpoint', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => ({
      ok: true,
      status: 200,
      text: async () => chapterListHtml,
    }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('GM_xmlhttpRequest', undefined);

    const entries = await loadTocEntriesPaged(
      'https://twkan.com/book/93181/index.html',
      'https://twkan.com/txt/93181/53052605',
      twkanRule,
      vi.fn()
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      'https://twkan.com/ajax_novels/chapterlist/93181.html'
    );
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      credentials: 'include',
      headers: {
        Accept: 'text/html, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    expect(entries).toEqual([
      {
        title: '第1章 方小草的悔意',
        url: 'https://twkan.com/txt/93181/52973196',
      },
      {
        title: '第120章 進化〖暴龍獸〗！力量湧上來了！',
        url: 'https://twkan.com/txt/93181/53052605',
      },
    ]);
  });

  it('falls back to GM_xmlhttpRequest when native fetch fails', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 403,
      text: async () => '',
    }));
    const gm = vi.fn((opts: GM_xmlhttpRequestOptions) => {
      opts.onload?.({
        readyState: 4,
        responseHeaders: '',
        responseText: chapterListHtml,
        status: 200,
        statusText: 'OK',
        finalUrl: opts.url,
      });
      return { abort: vi.fn() };
    });

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const entries = await loadTocEntriesPaged(
      'https://twkan.com/book/93181/index.html',
      'https://twkan.com/txt/93181/53052605',
      twkanRule,
      vi.fn()
    );

    expect(gm).toHaveBeenCalledTimes(1);
    expect((gm.mock.calls[0]?.[0] as GM_xmlhttpRequestOptions).url).toBe(
      'https://twkan.com/ajax_novels/chapterlist/93181.html'
    );
    expect(entries).toHaveLength(2);
  });
});
