import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { getPageKind } from '@/core/auto-enable/PageKind';

describe('getPageKind', () => {
  it('classifies by URL (chapter)', () => {
    expect(getPageKind('https://example.com/chapter/1')).toBe('chapter');
  });

  it('classifies by URL (toc)', () => {
    expect(getPageKind('https://example.com/book/1/toc/')).toBe('toc');
    expect(getPageKind('https://example.com/book/1?toc=1')).toBe('toc');
  });

  it('falls back to document title for toc', () => {
    const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/book/1',
    });
    dom.window.document.title = '章节目录 - 示例小说';

    expect(getPageKind(dom.window.location.href, dom.window.document)).toBe('toc');
  });

  it('falls back to lightweight DOM heuristics for chapter pages', () => {
    const longText = '正文'.repeat(2500);
    const html = `
      <!doctype html>
      <html>
        <head></head>
        <body>
          <a href="/chapter/2">下一章</a>
          <p>${longText}</p>
          <p>${longText}</p>
        </body>
      </html>
    `;
    const dom = new JSDOM(html, { url: 'https://example.com/book/1' });

    expect(getPageKind(dom.window.location.href, dom.window.document)).toBe('chapter');
  });
});
