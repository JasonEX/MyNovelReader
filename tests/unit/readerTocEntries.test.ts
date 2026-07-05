import { describe, expect, it } from 'vitest';

import {
  collectTocCandidates,
  dedupeTocEntries,
  filterTocEntries,
  findNextTocPageUrl,
  sortTocEntries,
} from '@/ui/stores/reader/tocEntries';
import type { SiteRule } from '@/core/rules/types';

function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('reader TOC entry helpers', () => {
  it('dedupes by URL and keeps the better chapter title', () => {
    const entries = dedupeTocEntries([
      { title: '章节 1', url: 'https://example.com/book/1.html' },
      { title: '第1章 起点', url: 'https://example.com/book/1.html' },
      { title: '第2章 后续', url: 'https://example.com/book/2.html' },
    ]);

    expect(entries).toEqual([
      { title: '第1章 起点', url: 'https://example.com/book/1.html' },
      { title: '第2章 后续', url: 'https://example.com/book/2.html' },
    ]);
  });

  it('reverses a clearly descending chapter list', () => {
    const entries = sortTocEntries([
      { title: '第5章', url: 'https://example.com/book/5.html' },
      { title: '第4章', url: 'https://example.com/book/4.html' },
      { title: '第3章', url: 'https://example.com/book/3.html' },
      { title: '第2章', url: 'https://example.com/book/2.html' },
      { title: '第1章', url: 'https://example.com/book/1.html' },
    ]);

    expect(entries.map(entry => entry.title)).toEqual([
      '第1章',
      '第2章',
      '第3章',
      '第4章',
      '第5章',
    ]);
  });

  it('filters TOC noise outside the dominant book', () => {
    const entries = filterTocEntries([
      { title: '第1章', url: 'https://example.com/book/100/1.html' },
      { title: '第2章', url: 'https://example.com/book/100/2.html' },
      { title: '第3章', url: 'https://example.com/book/100/3.html' },
      { title: '第4章', url: 'https://example.com/book/100/4.html' },
      { title: '第5章', url: 'https://example.com/book/100/5.html' },
      { title: '目录', url: 'https://example.com/book/100/index.html' },
      { title: '第1章 其他书', url: 'https://example.com/book/200/1.html' },
    ]);

    expect(entries.map(entry => entry.url)).toEqual([
      'https://example.com/book/100/1.html',
      'https://example.com/book/100/2.html',
      'https://example.com/book/100/3.html',
      'https://example.com/book/100/4.html',
      'https://example.com/book/100/5.html',
    ]);
  });

  it('collects candidates with rule exclusions and site title cleaners', () => {
    const doc = parseHtml(`
      <main>
        <a href="/gb_1/94443/17">17017 第一章 风起</a>
        <div class="ads"><a href="/gb_1/94443/18">第18章 广告</a></div>
        <a href="/about">关于本站</a>
      </main>
    `);
    const rule = { toc: { excludeAncestors: '.ads' } } as SiteRule;

    const entries = collectTocCandidates(doc, 'https://m.goboo.cc/gb_1/94443/', rule);

    expect(entries).toEqual([
      {
        title: '017 第一章 风起',
        url: 'https://m.goboo.cc/gb_1/94443/17',
      },
    ]);
  });

  it('finds the best next TOC page link', () => {
    const doc = parseHtml(`
      <html>
        <head><link rel="next" href="/book/1/index-2.html" /></head>
        <body>
          <nav>
            <a class="next" href="/book/1/index-3.html">下一页</a>
          </nav>
        </body>
      </html>
    `);

    expect(
      findNextTocPageUrl(
        doc,
        'https://example.com/book/1/index.html',
        'https://example.com/book/1/index.html'
      )
    ).toBe('https://example.com/book/1/index-2.html');
  });
});
