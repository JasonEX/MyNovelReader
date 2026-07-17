import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { detectTocPage, isInvalidChapterUrl } from '@/ui/stores/reader/detection';
import { isVipChapterPage } from '@/core/detection';

describe('isInvalidChapterUrl (extra coverage)', () => {
  it('rejects common non-chapter URL patterns', () => {
    expect(isInvalidChapterUrl('https://example.com/list.html')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/catalog/')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/toc.html')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/index.html')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/book/123/')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/novel/456/')).toBe(true);
  });

  it('rejects ciweimao non-chapter endpoints', () => {
    expect(isInvalidChapterUrl('https://www.ciweimao.com/chapter/get_par_tsu_list')).toBe(true);
    expect(isInvalidChapterUrl('https://www.ciweimao.com/chapter/ajax_get_session_code')).toBe(
      true
    );
    expect(
      isInvalidChapterUrl('https://www.ciweimao.com/chapter/get_book_chapter_detail_info')
    ).toBe(true);
  });

  it('detects path depth mismatch when currentChapterUrl provided', () => {
    // current has deep path, target has shallow path
    expect(
      isInvalidChapterUrl('https://example.com/book/123', 'https://example.com/chapter/123/456/789')
    ).toBe(true);
  });

  it('returns false for unparseable URLs', () => {
    expect(isInvalidChapterUrl('not a valid url at all :::')).toBe(false);
  });

  it('accepts valid chapter URLs with digits in single segment', () => {
    expect(isInvalidChapterUrl('https://example.com/412421_1.html')).toBe(false);
  });

  it('rejects single-segment paths without digits', () => {
    expect(isInvalidChapterUrl('https://example.com/about')).toBe(true);
  });
});

describe('isVipChapterPage (extra coverage)', () => {
  it('returns false for empty body', () => {
    const doc = new JSDOM('<!doctype html><html><body></body></html>').window.document;
    expect(isVipChapterPage(doc)).toBe(false);
  });

  it('detects CTA button with VIP signal in body', () => {
    const doc = new JSDOM(
      '<!doctype html><html><body><p>付费章节内容</p><button>立即购买</button></body></html>'
    ).window.document;
    expect(isVipChapterPage(doc)).toBe(true);
  });

  it('detects locked chapter patterns', () => {
    const doc = new JSDOM(
      '<!doctype html><html><body>本章节内容已锁定，需要订阅后阅读</body></html>'
    ).window.document;
    expect(isVipChapterPage(doc)).toBe(true);
  });

  it('returns false for normal chapter content', () => {
    const doc = new JSDOM(
      '<!doctype html><html><body><p>这是一段正常的小说内容，没有任何VIP提示。</p></body></html>'
    ).window.document;
    expect(isVipChapterPage(doc)).toBe(false);
  });
});

describe('detectTocPage (extra coverage)', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('detects TOC via URL structure comparison (chapter vs book pattern)', () => {
    expect(
      detectTocPage(
        '<div>some content</div>',
        'https://example.com/book/123',
        'https://example.com/read/123/456'
      )
    ).toBe(true);
  });

  it('detects high link-to-text ratio pages', () => {
    const links = Array.from(
      { length: 10 },
      (_, i) => `<a href="/p/${i}">链接文本内容第${i}项比较长的文字</a>`
    ).join('');
    // Content is mostly links
    const content = `<div>${links}</div>`;
    expect(
      detectTocPage(content, 'https://example.com/dir.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('detects pages with many chapter-pattern links', () => {
    const links = Array.from(
      { length: 12 },
      (_, i) => `<a href="/chapter/${i}.html">Chapter ${i}</a>`
    ).join('');
    const content = `<div><p>${'正文内容'.repeat(50)}</p>${links}</div>`;
    expect(
      detectTocPage(content, 'https://example.com/page.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('detects pages containing link to current chapter with many links', () => {
    const links = Array.from({ length: 6 }, (_, i) => `<a href="/other/${i}">Link ${i}</a>`).join(
      ''
    );
    const content = `<div>${links}<a href="/chapter/1.html">当前章</a></div>`;
    expect(
      detectTocPage(content, 'https://example.com/page.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('detects pages with TOC keywords and many links', () => {
    const links = Array.from({ length: 16 }, (_, i) => `<a href="/p/${i}">Item ${i}</a>`).join('');
    const content = `<div><h1>目录</h1>${links}</div>`;
    expect(
      detectTocPage(content, 'https://example.com/page.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('detects pages with multiple TOC keywords', () => {
    const content = `<div><h1>章节目录</h1><p>全部章节列表</p><a href="/1">Ch1</a></div>`;
    expect(
      detectTocPage(content, 'https://example.com/page.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('detects pages with many chapter-named links', () => {
    const links = Array.from({ length: 8 }, (_, i) => `<a href="/c/${i}">第${i}章 标题</a>`).join(
      ''
    );
    const content = `<div>${links}</div>`;
    expect(
      detectTocPage(content, 'https://example.com/page.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('handles URL parsing failure gracefully in structure comparison', () => {
    // Invalid currentChapterUrl should not crash
    expect(
      detectTocPage(
        '<div><p>Normal content</p></div>',
        'https://example.com/page.html',
        'not-a-valid-url'
      )
    ).toBe(false);
  });

  it('handles normalizeUrlLocal with invalid href', () => {
    const links = Array.from(
      { length: 6 },
      (_, i) => `<a href="javascript:void(${i})">Link ${i}</a>`
    ).join('');
    const content = `<div>${links}<a href=":::invalid">Bad</a></div>`;
    // Should not crash
    expect(
      detectTocPage(content, 'https://example.com/page.html', 'https://example.com/chapter/1.html')
    ).toBe(false);
  });
});
