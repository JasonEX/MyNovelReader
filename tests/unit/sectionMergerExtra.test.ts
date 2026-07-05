import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ParsedChapter, Parser } from '@/core/parser';

const { mockFetchAndParseUrl } = vi.hoisted(() => ({
  mockFetchAndParseUrl: vi.fn(),
}));

vi.mock('@/core/utils/network', () => ({
  fetchAndParseUrl: mockFetchAndParseUrl,
}));

import { SectionMerger } from '@/core/auto-enable/SectionMerger';

describe('SectionMerger (extra coverage)', () => {
  beforeEach(() => {
    mockFetchAndParseUrl.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const makeDoc = () =>
    new DOMParser().parseFromString('<!doctype html><html><body></body></html>', 'text/html');

  it('falls back to parsed section-like nextUrl when nextSectionUrl is missing', async () => {
    const parsed: Record<string, ParsedChapter> = {
      'https://example.com/1.html': {
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url: 'https://example.com/1.html',
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
        rule: {
          id: 'r',
          version: 1,
          match: { pattern: 'example\\.com', type: 'regex' },
          content: { selector: '#content' },
          advanced: { checkSection: true },
          meta: { source: 'builtin' },
        },
      },
      'https://example.com/1_2.html': {
        title: 'c1-2',
        content: '<p>b</p>',
        rawContent: '<p>b</p>',
        url: 'https://example.com/1_2.html',
        nextUrl: 'https://example.com/1_3.html',
        confidence: 1,
        method: 'rule',
      },
      'https://example.com/1_3.html': {
        title: 'c1-3',
        content: '<p>c</p>',
        rawContent: '<p>c</p>',
        url: 'https://example.com/1_3.html',
        nextUrl: 'https://example.com/2.html',
        confidence: 1,
        method: 'rule',
      },
    };

    const fakeParser = {
      parse: vi.fn(async (doc: Document, url: string) => parsed[url] || null),
      detectSection: vi.fn((_doc: Document, _url: string) => ({
        isSection: true,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0.9,
      })),
    };

    const fetcher = vi.fn(async () => makeDoc());
    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(makeDoc(), 'https://example.com/1.html', {
      maxPages: 10,
      fetcher,
    });

    expect(fetcher).toHaveBeenCalled();
    expect(result?.content).toContain('<p>a</p>');
    expect(result?.content).toContain('<p>b</p>');
    expect(result?.content).toContain('<p>c</p>');
    expect(result?.nextUrl).toBe('https://example.com/2.html');
  });

  it('returns early when signal is aborted before normalization fetch', async () => {
    const fakeParser = {
      parse: vi.fn(async () => null),
      detectSection: vi.fn(() => undefined),
    };

    const controller = new AbortController();
    controller.abort();

    const fetcher = vi.fn(async () => makeDoc());
    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(makeDoc(), 'https://example.com/1_2.html', {
      fetcher,
      signal: controller.signal,
    });

    expect(result).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
    expect(fakeParser.parse).not.toHaveBeenCalled();
    expect(fakeParser.detectSection).not.toHaveBeenCalled();
  });

  it('aborts an in-flight fetch task when signal becomes aborted synchronously', async () => {
    let aborted = false;
    const signal = {
      get aborted() {
        return aborted;
      },
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as AbortSignal;

    const abort = vi.fn();
    mockFetchAndParseUrl.mockImplementationOnce(() => {
      aborted = true;
      return { promise: new Promise(() => {}), abort };
    });

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
        rule: {
          id: 'r',
          version: 1,
          match: { pattern: 'example\\.com', type: 'regex' },
          content: { selector: '#content' },
          advanced: { checkSection: true },
          meta: { source: 'builtin' },
        },
      })),
      detectSection: vi.fn(() => ({
        isSection: true,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0.9,
      })),
    };

    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(makeDoc(), 'https://example.com/1.html', { signal });

    expect(result?.content).toContain('<p>a</p>');
    expect(abort).toHaveBeenCalledTimes(1);
  });

  it('resolves real next chapter URL when section-like nextUrl is present but should not merge', async () => {
    const doc = makeDoc();
    doc.body.innerHTML = `
      <a href="/1_2.html">Next page</a>
      <a href="/2.html">下章</a>
    `;

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
      })),
      detectSection: vi.fn(() => ({
        isSection: false,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0,
      })),
    };

    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(doc, 'https://example.com/1.html');

    expect(result?.nextUrl).toBe('https://example.com/2.html');
  });

  it('returns first chapter when rule disables section merge', async () => {
    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
        rule: {
          id: 'r',
          version: 1,
          match: { pattern: 'example\\.com', type: 'regex' },
          content: { selector: '#content' },
          advanced: { noSection: true },
          meta: { source: 'builtin' },
        },
      })),
      detectSection: vi.fn(() => undefined),
    };

    const fetcher = vi.fn(async () => makeDoc());
    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(makeDoc(), 'https://example.com/1.html', { fetcher });

    expect(result?.nextUrl).toBe('https://example.com/1_2.html');
    expect(fetcher).not.toHaveBeenCalled();
    expect(fakeParser.detectSection).not.toHaveBeenCalled();
  });

  it('keeps section-like nextUrl when detection provides nextSectionUrl but should not merge', async () => {
    const doc = makeDoc();
    doc.body.innerHTML = `
      <a href="/2.html">下章</a>
    `;

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
      })),
      detectSection: vi.fn(() => ({
        isSection: true,
        nextSectionUrl: 'https://example.com/1_2.html',
        nextChapterUrl: null,
        confidence: 0.1,
      })),
    };

    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(doc, 'https://example.com/1.html');

    expect(result?.nextUrl).toBe('https://example.com/1_2.html');
  });

  it('normalizes later section page to baseUrl when base fetch succeeds', async () => {
    const baseDoc = makeDoc();
    const openDoc = makeDoc();

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: undefined,
        confidence: 1,
        method: 'rule',
        rule: {
          id: 'r',
          version: 1,
          match: { pattern: 'example\\.com', type: 'regex' },
          content: { selector: '#content' },
          advanced: { noSection: true },
          meta: { source: 'builtin' },
        },
      })),
      detectSection: vi.fn(() => undefined),
    };

    const fetcher = vi.fn(async (url: string) => (url.endsWith('/1.html') ? baseDoc : null));
    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(openDoc, 'https://example.com/1_2.html', { fetcher });

    expect(fakeParser.parse).toHaveBeenCalledWith(baseDoc, 'https://example.com/1.html');
    expect(result?.url).toBe('https://example.com/1.html');
  });

  it('refetches a cached section page when cached parsing fails after base normalization', async () => {
    const baseDoc = makeDoc();
    const openDoc = makeDoc();
    const refetchedDoc = makeDoc();

    const fakeParser = {
      parse: vi.fn(async (doc: Document, url: string) => {
        if (url.endsWith('/1.html')) {
          return {
            title: 'c1',
            content: '<p>a</p>',
            rawContent: '<p>a</p>',
            url,
            nextUrl: 'https://example.com/1_2.html',
            confidence: 1,
            method: 'rule',
            rule: {
              id: 'r',
              version: 1,
              match: { pattern: 'example\\.com', type: 'regex' },
              content: { selector: '#content' },
              advanced: { checkSection: true },
              meta: { source: 'builtin' },
            },
          } satisfies ParsedChapter;
        }

        if (url.endsWith('/1_2.html') && doc === openDoc) {
          return null;
        }

        if (url.endsWith('/1_2.html') && doc === refetchedDoc) {
          return {
            title: 'c1-2',
            content: '<p>b</p>',
            rawContent: '<p>b</p>',
            url,
            nextUrl: 'https://example.com/2.html',
            confidence: 1,
            method: 'rule',
          } satisfies ParsedChapter;
        }

        return null;
      }),
      detectSection: vi.fn((_doc: Document, url: string) => {
        if (url.endsWith('/1.html')) {
          return {
            isSection: true,
            nextSectionUrl: 'https://example.com/1_2.html',
            nextChapterUrl: null,
            confidence: 1,
          };
        }

        return {
          isSection: true,
          nextSectionUrl: null,
          nextChapterUrl: 'https://example.com/2.html',
          confidence: 1,
        };
      }),
    };

    const fetcher = vi.fn(async (url: string) => {
      if (url.endsWith('/1.html')) return baseDoc;
      if (url.endsWith('/1_2.html')) return refetchedDoc;
      return null;
    });
    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(openDoc, 'https://example.com/1_2.html', { fetcher });

    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      'https://example.com/1.html',
      'https://example.com/1_2.html'
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      'https://example.com/1_2.html',
      'https://example.com/1.html'
    );
    expect(result?.content).toContain('<p>a</p>');
    expect(result?.content).toContain('<p>b</p>');
    expect(result?.nextUrl).toBe('https://example.com/2.html');
  });

  it('finds forward next chapter URL and skips pagination-like "next page" links', async () => {
    const doc = makeDoc();
    doc.body.innerHTML = `
      <a href="/p2.html">Next page</a>
      <a href="/continue.html">继续阅读</a>
      <a href="/2.html" rel="next">后一章</a>
    `;

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
      })),
      detectSection: vi.fn(() => ({
        isSection: false,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0,
      })),
    };

    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(doc, 'https://example.com/1.html');

    expect(result?.nextUrl).toBe('https://example.com/2.html');
  });

  it('prefers strong English next-link hints like "Next"', async () => {
    const doc = makeDoc();
    doc.body.innerHTML = `
      <a href="/p2.html">Next page</a>
      <a href="/2.html">Next</a>
    `;

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
      })),
      detectSection: vi.fn(() => ({
        isSection: false,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0,
      })),
    };

    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(doc, 'https://example.com/1.html');

    expect(result?.nextUrl).toBe('https://example.com/2.html');
  });

  it('does not change nextUrl when no suitable next-chapter link can be found', async () => {
    const doc = makeDoc();
    doc.body.innerHTML = `
      <a>no href</a>
      <a href="/1_2.html">下一页</a>
      <a href="/same.html"> </a>
    `;

    const fakeParser = {
      parse: vi.fn(async (_doc: Document, url: string) => ({
        title: 'c1',
        content: '<p>a</p>',
        rawContent: '<p>a</p>',
        url,
        nextUrl: 'https://example.com/1_2.html',
        confidence: 1,
        method: 'rule',
      })),
      detectSection: vi.fn(() => ({
        isSection: false,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0,
      })),
    };

    const merger = new SectionMerger(fakeParser as unknown as Parser);
    const result = await merger.merge(doc, 'https://example.com/1.html');

    expect(result?.nextUrl).toBe('https://example.com/1_2.html');
  });
});
