import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { detectTocPage, isInvalidChapterUrl, isVipChapterPage } from '@/ui/stores/reader/detection';

describe('Reader detection utilities', () => {
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

  it('isInvalidChapterUrl detects obvious non-chapter URLs', () => {
    expect(isInvalidChapterUrl('https://example.com/')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/login')).toBe(true);
    expect(isInvalidChapterUrl('https://example.com/412421_1.html')).toBe(false);
  });

  it('isInvalidChapterUrl rejects cross-host URLs when currentChapterUrl is provided', () => {
    expect(
      isInvalidChapterUrl('https://other.example.com/chapter/1', 'https://example.com/chapter/2')
    ).toBe(true);
  });

  it('isVipChapterPage detects VIP/locked chapter pages via body text', () => {
    const doc = new JSDOM('<!doctype html><html><body>本章为VIP章节，订阅后可阅读</body></html>')
      .window.document;
    expect(isVipChapterPage(doc)).toBe(true);
  });

  it('isVipChapterPage detects VIP pages via CTA text when body signals VIP', () => {
    const doc = new JSDOM(
      '<!doctype html><html><body><div>VIP专区</div><a href="/buy">立即订阅</a></body></html>'
    ).window.document;
    expect(isVipChapterPage(doc)).toBe(true);
  });

  it('detectTocPage detects TOC via URL patterns', () => {
    expect(
      detectTocPage(
        '<div>xx</div>',
        'https://example.com/book/123.html',
        'https://example.com/chapter/1.html'
      )
    ).toBe(true);
  });

  it('detectTocPage detects link-heavy short pages', () => {
    const links = Array.from(
      { length: 12 },
      (_, i) => `<a href="/chapter/${i}.html">第${i}章</a>`
    ).join('');
    const content = `<div>${links}</div>`;
    expect(
      detectTocPage(content, 'https://example.com/dir.html', 'https://example.com/chapter/1.html')
    ).toBe(true);
  });

  it('detectTocPage returns false for typical chapter content', () => {
    const content = `<article>
      <h1>第1章</h1>
      <p>${'正文'.repeat(300)}</p>
      <a href="/chapter/2.html">下一章</a>
    </article>`;

    expect(
      detectTocPage(
        content,
        'https://example.com/chapter/1.html',
        'https://example.com/chapter/1.html'
      )
    ).toBe(false);
  });
});
