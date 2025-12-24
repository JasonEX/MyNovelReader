import { describe, expect, it, vi } from 'vitest';

import type { Parser } from '../../src/core/parser/Parser';
import { SectionMerger } from '../../src/core/auto-enable/SectionMerger';

describe('SectionMerger (nextUrl resolution)', () => {
  it('skips query-based pagination links when resolving real next chapter', async () => {
    const parser = {
      parse: vi.fn().mockResolvedValue({
        title: 't',
        content: '<p>c</p>',
        rawContent: '<p>c</p>',
        url: 'https://example.com/123.html',
        nextUrl: 'https://example.com/123_2.html',
        confidence: 1,
        method: 'detection',
      }),
      detect: vi.fn().mockReturnValue({ results: { section: undefined } }),
    } satisfies Pick<Parser, 'detect' | 'parse'>;

    const merger = new SectionMerger(parser as unknown as Parser);
    const startDoc = new DOMParser().parseFromString(
      '<html><body><a href="?page=2">下一页</a><a href="/124.html">下一章</a></body></html>',
      'text/html'
    );

    const result = await merger.merge(startDoc, 'https://example.com/123.html');
    expect(result?.nextUrl).toBe('https://example.com/124.html');
  });

  it('treats query-based nextUrl as section-like and resolves to next chapter', async () => {
    const parser = {
      parse: vi.fn().mockResolvedValue({
        title: 't',
        content: '<p>c</p>',
        rawContent: '<p>c</p>',
        url: 'https://example.com/123.html',
        nextUrl: 'https://example.com/123.html?page=2',
        confidence: 1,
        method: 'detection',
      }),
      detect: vi.fn().mockReturnValue({ results: { section: undefined } }),
    } satisfies Pick<Parser, 'detect' | 'parse'>;

    const merger = new SectionMerger(parser as unknown as Parser);
    const startDoc = new DOMParser().parseFromString(
      '<html><body><a href="/124.html">下一章</a></body></html>',
      'text/html'
    );

    const result = await merger.merge(startDoc, 'https://example.com/123.html');
    expect(result?.nextUrl).toBe('https://example.com/124.html');
  });

  it('does not rewrite section-like nextUrl when section detection provides nextSectionUrl (even if below threshold)', async () => {
    const parser = {
      parse: vi.fn().mockResolvedValue({
        title: 't',
        content: '<p>c</p>',
        rawContent: '<p>c</p>',
        url: 'https://example.com/123.html',
        nextUrl: 'https://example.com/123.html?page=2',
        confidence: 1,
        method: 'detection',
      }),
      detect: vi.fn().mockReturnValue({
        results: {
          section: {
            isSection: true,
            nextSectionUrl: 'https://example.com/123.html?page=2',
            nextChapterUrl: null,
            confidence: 0.5,
          },
        },
      }),
    } satisfies Pick<Parser, 'detect' | 'parse'>;

    const merger = new SectionMerger(parser as unknown as Parser);
    const startDoc = new DOMParser().parseFromString(
      '<html><body><a href="/124.html">下一章</a></body></html>',
      'text/html'
    );

    const result = await merger.merge(startDoc, 'https://example.com/123.html');
    expect(result?.nextUrl).toBe('https://example.com/123.html?page=2');
  });
});
