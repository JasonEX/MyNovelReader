import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAndParseUrl } from '@/core/utils/network';

describe('fetchAndParseUrl (url validation)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns invalid-url for non-http(s) schemes without calling GM_xmlhttpRequest', async () => {
    const gm = vi.fn();
    // @ts-expect-error - userscript global stub
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const { promise } = fetchAndParseUrl('data:text/html,<p>x</p>', 'https://example.com/');
    const result = await promise;

    expect(result.error).toBe('invalid-url');
    expect(gm).not.toHaveBeenCalled();
  });

  it('blocks private network targets when referer is a different host', async () => {
    const gm = vi.fn();
    // @ts-expect-error - userscript global stub
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const { promise } = fetchAndParseUrl('http://127.0.0.1/secret', 'https://example.com/');
    const result = await promise;

    expect(result.error).toBe('invalid-url');
    expect(gm).not.toHaveBeenCalled();
  });

  it('allows private network targets when referer is the same host', async () => {
    const gm = vi.fn((opts: GM_xmlhttpRequestOptions) => {
      opts.onload?.({
        status: 200,
        responseText: '<!doctype html><html><body>ok</body></html>',
        finalUrl: opts.url,
      });
      return { abort: () => {} };
    });
    // @ts-expect-error - userscript global stub
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
});
