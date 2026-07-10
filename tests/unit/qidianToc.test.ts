import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadTocEntriesPaged } from '@/ui/stores/reader/toc';
import type { SiteRule } from '@/core/rules/types';

import { createDom } from '../testUtils/dom';

const qidianRule = { id: 'qidian' } as SiteRule;

const qidianCategoryResponse = {
  code: 0,
  msg: '',
  data: {
    vs: [
      {
        cs: [
          { id: 850667574, cN: '第一章 武当寻旧（求追读！）', cU: '' },
          { id: 850662591, cN: '第二章 不存在的师父', cU: '' },
        ],
      },
      {
        cs: [{ id: 850668865, cN: '第三章 道争', cU: '' }],
      },
    ],
  },
};

describe('Qidian TOC loading', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    createDom('https://www.qidian.com/chapter/1045659200/850667574/');
    document.cookie = '_csrfToken=csrf-token-123';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads Qidian catalog entries from the category JSON endpoint', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => ({
      ok: true,
      status: 200,
      json: async () => qidianCategoryResponse,
    }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('GM_xmlhttpRequest', undefined);

    const entries = await loadTocEntriesPaged(
      'https://www.qidian.com/book/1045659200/',
      'https://www.qidian.com/chapter/1045659200/850667574/',
      qidianRule,
      vi.fn()
    );

    const requestedUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requestedUrl.pathname).toBe('/webcommon/book/category');
    expect(requestedUrl.searchParams.get('_csrfToken')).toBe('csrf-token-123');
    expect(requestedUrl.searchParams.get('bookId')).toBe('1045659200');
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    expect(entries).toEqual([
      {
        title: '第一章 武当寻旧（求追读！）',
        url: 'https://www.qidian.com/chapter/1045659200/850667574/',
      },
      {
        title: '第二章 不存在的师父',
        url: 'https://www.qidian.com/chapter/1045659200/850662591/',
      },
      {
        title: '第三章 道争',
        url: 'https://www.qidian.com/chapter/1045659200/850668865/',
      },
    ]);
  });

  it('falls back to GM_xmlhttpRequest when native fetch does not return a usable catalog', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ code: 1403, msg: 'CSRF 不合法' }),
    }));
    const gm = vi.fn((opts: GM_xmlhttpRequestOptions) => {
      opts.onload?.({
        readyState: 4,
        responseHeaders: '',
        responseText: JSON.stringify(qidianCategoryResponse),
        status: 200,
        statusText: 'OK',
        finalUrl: opts.url,
      });
      return { abort: vi.fn() };
    });

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const entries = await loadTocEntriesPaged(
      'https://www.qidian.com/book/1045659200/',
      'https://www.qidian.com/chapter/1045659200/850667574/',
      qidianRule,
      vi.fn()
    );

    expect(gm).toHaveBeenCalledTimes(1);
    expect((gm.mock.calls[0]?.[0] as GM_xmlhttpRequestOptions).url).toContain(
      '/webcommon/book/category?'
    );
    expect(entries).toHaveLength(3);
  });
});
