import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDom } from '../testUtils/dom';
import { fetchAndParseUrl } from '@/core/utils/network';

const makeXhrResponse = (
  opts: GM_xmlhttpRequestOptions,
  overrides: Partial<GmXhrResponse> = {}
): GmXhrResponse => ({
  readyState: 4,
  responseHeaders: '',
  responseText: '',
  status: 0,
  statusText: '',
  finalUrl: opts.url,
  ...overrides,
});

describe('fetchAndParseUrl (url validation)', () => {
  beforeEach(() => {
    createDom('https://reader.test/');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns invalid-url for non-http(s) schemes without calling GM_xmlhttpRequest', async () => {
    const gm = vi.fn();
    // userscript global stub
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const { promise } = fetchAndParseUrl('data:text/html,<p>x</p>', 'https://example.com/');
    const result = await promise;

    expect(result.error).toBe('invalid-url');
    expect(gm).not.toHaveBeenCalled();
  });

  it('blocks private network targets when referer is a different host', async () => {
    const gm = vi.fn();
    // userscript global stub
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const { promise } = fetchAndParseUrl('http://127.0.0.1/secret', 'https://example.com/');
    const result = await promise;

    expect(result.error).toBe('invalid-url');
    expect(gm).not.toHaveBeenCalled();
  });

  it('allows private network targets when referer is the same host', async () => {
    const gm = vi.fn((opts: GM_xmlhttpRequestOptions) => {
      opts.onload?.(
        makeXhrResponse(opts, {
          status: 200,
          responseText: '<!doctype html><html><body>ok</body></html>',
          finalUrl: opts.url,
        })
      );
      return { abort: () => {} };
    });
    // userscript global stub
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const { promise } = fetchAndParseUrl(
      'http://localhost/chapter/1',
      'http://localhost/chapter/0'
    );
    const result = await promise;

    expect(result.error).toBeNull();
    expect(result.doc).not.toBeNull();
    expect(gm).toHaveBeenCalledTimes(1);
  });

  it('prefers native fetch for current-origin requests even when GM_xmlhttpRequest exists', async () => {
    createDom('https://example.com/chapter/1');
    const gm = vi.fn();
    const fetchMock = vi.fn(async () => {
      return new Response('<!doctype html><html><body>native ok</body></html>', {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    });

    // userscript global stub
    vi.stubGlobal('GM_xmlhttpRequest', gm);
    vi.stubGlobal('fetch', fetchMock);
    window.fetch = fetchMock as unknown as typeof fetch;

    const { promise } = fetchAndParseUrl(
      'https://example.com/chapter/2',
      'https://example.com/chapter/1'
    );
    const result = await promise;

    expect(result.error).toBeNull();
    expect(result.doc?.body.textContent).toContain('native ok');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(gm).not.toHaveBeenCalled();
  });
});
