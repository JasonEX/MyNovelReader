import { describe, expect, it, vi } from 'vitest';
import {
  makeTiantangOverview,
  makeTiantangToc,
  tiantangChapterPath,
  tiantangDirectory,
  tiantangIndexPath,
  tiantangOrigin,
} from '../testUtils/tiantang';
import { fetchAndParseUrl } from '@/core/utils/network';
import { loadTocEntriesPaged } from '@/ui/stores/reader/toc';
import { tiantangRule } from '@/core/rules/sites/tiantang';

vi.mock('@/core/utils/network', () => ({ fetchAndParseUrl: vi.fn() }));
const parse = (html: string): Document => new DOMParser().parseFromString(html, 'text/html');
const indexUrl = tiantangOrigin + tiantangDirectory;
const currentUrl = tiantangOrigin + tiantangChapterPath(256);

describe('Tiantang catalog entry', () => {
  it('loads the full catalog directly without reading overview snippets', async () => {
    const requests: string[] = [];
    vi.mocked(fetchAndParseUrl).mockImplementation(url => {
      requests.push(url);
      const page = Number(new URL(url).pathname.match(/\/(\d+)\/$/)?.[1]);
      return {
        promise: Promise.resolve({
          doc: parse(
            url === tiantangOrigin + tiantangIndexPath
              ? makeTiantangOverview()
              : makeTiantangToc(page === 337644 ? 1 : page)
          ),
          finalUrl: url,
          status: 200,
          error: null,
        }),
        abort: vi.fn(),
      };
    });
    const setAbort = vi.fn();
    const doc = parse(makeTiantangOverview());
    await tiantangRule.hooks?.beforeParse?.(doc, currentUrl);
    const catalogUrl = doc.querySelector('#mnr-tiantang-index')!.getAttribute('href')!;
    const entries = await loadTocEntriesPaged(catalogUrl, currentUrl, tiantangRule, setAbort);
    expect(requests).toEqual([
      indexUrl,
      ...[2, 3, 4, 5, 6].map(page => `${tiantangOrigin}${tiantangDirectory}${page}/`),
    ]);
    expect(entries).toEqual(
      Array.from({ length: 298 }, (_, i) => ({
        title: `第${i + 1}章 测试正文`,
        url: tiantangOrigin + tiantangChapterPath(i + 1),
      }))
    );
    expect(setAbort).toHaveBeenLastCalledWith(null);
  });

  it.each([
    currentUrl,
    currentUrl.replace('.html', '_2.html'),
    currentUrl.replace('http:', 'https:') + '?from=reader#content',
  ])('provides the full catalog for chapter URL %s without duplicating links', async url => {
    const doc = parse('<a href="/books/337644.html" rel="index">目录</a>');
    await tiantangRule.hooks?.beforeParse?.(doc, url);
    await tiantangRule.hooks?.beforeParse?.(doc, url);
    expect(doc.querySelectorAll('#mnr-tiantang-index')).toHaveLength(1);
    expect(doc.querySelector('#mnr-tiantang-index')?.getAttribute('href')).toBe(
      new URL('.', url).href
    );
    expect(doc.querySelector('a[rel="index"]')?.getAttribute('href')).toBe('/books/337644.html');
  });

  it.each([
    undefined,
    'invalid',
    tiantangOrigin + tiantangIndexPath,
    tiantangOrigin + tiantangDirectory,
    'http://other.test/337/337644/1889083.html',
  ])('does not adapt non-chapter URL %s', async url => {
    const doc = parse(makeTiantangOverview());
    await tiantangRule.hooks?.beforeParse?.(doc, url);
    expect(doc.querySelector('#mnr-tiantang-index')).toBeNull();
  });
});
