/**
 * Unit tests for NavigationDetector
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { NavigationDetector } from '@/core/detection/NavigationDetector';
import { parseChapterSectionFromPathname } from '@/core/utils/sectionPath';

describe('NavigationDetector', () => {
  let detector: NavigationDetector;

  beforeEach(() => {
    detector = new NavigationDetector();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const createDom = (html: string, url = 'http://example.com/chapter/1.html') => {
    const dom = new JSDOM(html, { url, pretendToBeVisual: true });
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    return dom;
  };

  describe('detect', () => {
    it('should detect next link with rel="next" attribute', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a rel="next" href="/chapter/2.html">Next</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.next).not.toBeNull();
      expect(result.next?.url).toContain('/chapter/2.html');
      expect(result.next?.confidence).toBeGreaterThan(0.9);
      expect(result.next?.method).toBe('rel-attribute');
    });

    it('should detect navigation links by Chinese text', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="/chapter/1.html">上一章</a>
            <a href="/book/123/catalog.html">目录</a>
            <a href="/chapter/3.html">下一章</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.prev).not.toBeNull();
      expect(result.prev?.text).toBe('上一章');
      expect(result.next).not.toBeNull();
      expect(result.next?.text).toBe('下一章');
      expect(result.index).not.toBeNull();
      expect(result.index?.text).toBe('目录');
    });

    it('should detect short navigation text', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="/prev.html">上一页</a>
            <a href="/next.html">下一页</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.prev).not.toBeNull();
      expect(result.next).not.toBeNull();
    });

    it('should ignore javascript: links', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="javascript:void(0)">下一章</a>
            <a href="/real-next.html">下一页</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.next?.url).toContain('/real-next.html');
    });

    it('should ignore non-http(s) links (data/mailto)', () => {
      const dom = createDom(
        `
          <!DOCTYPE html>
          <html>
            <body>
              <a href="data:text/html,<p>x</p>">下一章</a>
              <a href="mailto:test@example.com">下一章</a>
              <a href="/chapter/2.html">下一章</a>
            </body>
          </html>
        `
      );

      const result = detector.detect(dom.window.document);

      expect(result.next?.url).toContain('/chapter/2.html');
    });

    it('should ignore anchor-only hash links (href="#")', () => {
      const dom = createDom(
        `
          <!DOCTYPE html>
          <html>
            <body>
              <a href="#">下一章</a>
              <a href="/chapter/2.html">下一页</a>
            </body>
          </html>
        `
      );

      const result = detector.detect(dom.window.document);

      expect(result.next?.url).toContain('/chapter/2.html');
    });

    it('should ignore invalid URL patterns like index/list', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="/index.html">下一章</a>
            <a href="/chapter/5.html">下一页</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      // Should prefer the chapter link over index
      expect(result.next?.url).toContain('/chapter/5.html');
    });

    it('should ignore ciweimao tsukkomi (get_par_tsu_list) links', () => {
      const dom = createDom(
        `
        <!DOCTYPE html>
        <html>
          <body>
            <a href="https://wap.ciweimao.com/chapter/get_par_tsu_list?chapter_id=113493242&data-pgid=0">
              下一章
            </a>
            <a href="https://wap.ciweimao.com/chapter/113497985">下一章</a>
          </body>
        </html>
      `,
        'https://wap.ciweimao.com/chapter/113493242'
      );

      const result = detector.detect(dom.window.document);
      expect(result.next?.url).toContain('/chapter/113497985');
    });

    it('should allow index/list URLs for index navigation', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="/book/123/index.html">目录</a>
            <a href="/chapter/5.html">下一章</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.index).not.toBeNull();
      expect(result.index?.url).toContain('/book/123/index.html');
    });

    it('should return null when no navigation found', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <p>No navigation links here</p>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.next).toBeNull();
      expect(result.prev).toBeNull();
      expect(result.index).toBeNull();
    });

    it('does not treat opposite-direction chapter text as a navigation candidate', () => {
      const nextOnly = createDom(`
        <!doctype html>
        <html>
          <body>
            <a href="/chapter/2.html">下一章</a>
          </body>
        </html>
      `);

      const nextOnlyResult = detector.detect(nextOnly.window.document);
      expect(nextOnlyResult.next?.text).toBe('下一章');
      expect(nextOnlyResult.prev).toBeNull();

      detector = new NavigationDetector();
      const prevOnly = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <a href="/chapter/100.html">上一章</a>
            </body>
          </html>
        `,
        'http://example.com/chapter/101.html'
      );

      const prevOnlyResult = detector.detect(prevOnly.window.document);
      expect(prevOnlyResult.prev?.text).toBe('上一章');
      expect(prevOnlyResult.next).toBeNull();
    });

    it('prefers short chapter navigation over long text and uses id/class selectors when possible', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="container">
              <a class="unique-next" href="/chapter/2.html" title="下一章">>></a>
              <a id="nav:next" href="/chapter/2.html">下一章</a>
              <a href="/chapter/2.html">${'下一章'.repeat(20)}</a>
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.next?.url).toContain('/chapter/2.html');
      expect(result.next?.selector).toMatch(/^(#|\\.)/);
    });
  });

  describe('validateNavigation', () => {
    it('should validate sequential chapter numbers', () => {
      const dom = createDom(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="/chapter/4.html">上一章</a>
            <a href="/chapter/6.html">下一章</a>
          </body>
        </html>
      `);

      const navigation = detector.detect(dom.window.document);
      const validated = detector.validateNavigation(
        'http://example.com/chapter/5.html',
        navigation
      );

      // Confidence should remain high for sequential numbers
      expect(validated.next?.confidence).toBeGreaterThan(0.5);
      expect(validated.prev?.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('detectSection', () => {
    it('detects section pages by URL pattern and finds explicit 下一页 link', () => {
      const currentUrl = 'https://example.com/123_2.html';
      const dom = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <a href="/124.html">下一章</a>
              <a href="/123_3.html" rel="next">下一页</a>
            </body>
          </html>
        `,
        currentUrl
      );

      const navigation = detector.detect(dom.window.document, currentUrl);
      const section = detector.detectSection(dom.window.document, currentUrl, navigation);

      expect(section.isSection).toBe(true);
      expect(section.currentSection).toBe(2);
      expect(section.nextSectionUrl).toContain('123_3.html');
      expect(section.nextChapterUrl).toContain('/124.html');
    });

    it('treats 下一页 as cross-chapter navigation when URL comparison disagrees', () => {
      const currentUrl = 'https://example.com/123.html';
      const dom = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <a href="/999.html">下一页</a>
            </body>
          </html>
        `,
        currentUrl
      );

      const navigation = detector.detect(dom.window.document, currentUrl);
      const section = detector.detectSection(dom.window.document, currentUrl, navigation);

      expect(section.isSection).toBe(false);
      expect(section.nextChapterUrl).toContain('/999.html');
    });

    it('detects section based on prev link text when next link is absent', () => {
      const currentUrl = 'https://example.com/123_2.html';
      const dom = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <a href="/123.html">上一页</a>
            </body>
          </html>
        `,
        currentUrl
      );

      const navigation = detector.detect(dom.window.document, currentUrl);
      const section = detector.detectSection(dom.window.document, currentUrl, navigation);

      expect(section.isSection).toBe(true);
      expect(section.currentSection).toBe(2);
      expect(section.method).toBe('url-pattern');
    });

    it('detects section based on prev link text when url pattern is not recognized', () => {
      const currentUrl = 'https://example.com/123.html?page=2';
      const dom = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <a href="/123.html?page=1">上一页</a>
            </body>
          </html>
        `,
        currentUrl
      );

      const navigation = detector.detect(dom.window.document, currentUrl);
      const section = detector.detectSection(dom.window.document, currentUrl, navigation);

      expect(section.isSection).toBe(true);
      expect(section.method).toBe('link-text');
    });

    it('detects section by URL comparison when link text is not a section indicator', () => {
      const currentUrl = 'https://example.com/123.html';
      const dom = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <a href="/123_2.html">Continue</a>
            </body>
          </html>
        `,
        currentUrl
      );

      const navigation = detector.detect(dom.window.document, currentUrl);
      const section = detector.detectSection(dom.window.document, currentUrl, navigation);

      expect(navigation.next).toBeNull();
      expect(section.isSection).toBe(true);
      expect(section.method).toBe('url-comparison');
      expect(section.nextSectionUrl).toContain('123_2.html');
    });

    it('detects section with /chapterId/section.html patterns', () => {
      const currentUrl = 'https://example.com/123/2.html';
      const dom = createDom(
        `
          <!doctype html>
          <html>
            <body>
              <p>content</p>
            </body>
          </html>
        `,
        currentUrl
      );

      const navigation = detector.detect(dom.window.document, currentUrl);
      const section = detector.detectSection(dom.window.document, currentUrl, navigation);

      expect(section.isSection).toBe(true);
      expect(section.currentSection).toBe(2);
      expect(section.method).toBe('url-pattern');
    });
  });

  describe('internals', () => {
    it('resolveBaseUrl falls back to first truthy candidate when all URLs are invalid', () => {
      vi.stubGlobal('window', undefined);
      const resolveBaseUrl = (
        detector as unknown as { resolveBaseUrl: (doc: Document, currentUrl?: string) => string }
      ).resolveBaseUrl;

      const fakeDoc = { location: { href: 'not a url' } } as unknown as Document;
      expect(resolveBaseUrl(fakeDoc, 'also-not-a-url')).toBe('also-not-a-url');
    });

    it('resolveLinkUrl returns null when URL parsing fails', () => {
      const resolveLinkUrl = (
        detector as unknown as {
          resolveLinkUrl: (a: HTMLAnchorElement, baseUrl: string) => string | null;
        }
      ).resolveLinkUrl;

      const dom = new JSDOM('<a href="http://[::">bad</a>', { url: 'https://example.com/' });
      const a = dom.window.document.querySelector('a') as HTMLAnchorElement;
      expect(resolveLinkUrl(a, 'https://example.com/')).toBeNull();
    });

    it('isValidLink rejects invalid hrefs and non-http protocols', () => {
      const isValidLink = (
        detector as unknown as {
          isValidLink: (
            a: HTMLAnchorElement,
            purpose: 'next' | 'prev' | 'index',
            currentUrl: string,
            href: string
          ) => boolean;
        }
      ).isValidLink;

      const dom = new JSDOM('<a href="/x">x</a>', { url: 'https://example.com/' });
      const a = dom.window.document.querySelector('a') as HTMLAnchorElement;

      expect(isValidLink(a, 'next', 'https://example.com/', 'not a url')).toBe(false);
      expect(isValidLink(a, 'next', 'https://example.com/', 'ftp://example.com/x')).toBe(false);
    });

    it('isValidLink tolerates invalid currentUrl in anchor-only checks', () => {
      const isValidLink = (
        detector as unknown as {
          isValidLink: (
            a: HTMLAnchorElement,
            purpose: 'next' | 'prev' | 'index',
            currentUrl: string,
            href: string
          ) => boolean;
        }
      ).isValidLink;

      const dom = new JSDOM('<a href="#x">下一章</a>', { url: 'https://example.com/ch' });
      const a = dom.window.document.querySelector('a') as HTMLAnchorElement;

      expect(isValidLink(a, 'next', 'not a url', 'https://example.com/ch#x')).toBe(true);
    });

    it('scores 《书名》 book title links for index detection', () => {
      const dom = createDom(`
        <!doctype html>
        <html>
          <body>
            <a href="/book/123/index.html">目录</a>
            <a href="/book/123/">《测试书名》</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.index).not.toBeNull();
    });

    it('tolerates getBoundingClientRect failures when scoring links', () => {
      const dom = createDom(`
        <!doctype html>
        <html>
          <body>
            <a href="/chapter/2.html">下一章</a>
          </body>
        </html>
      `);

      const a = dom.window.document.querySelector('a') as HTMLAnchorElement;
      Object.defineProperty(a, 'getBoundingClientRect', {
        value: () => {
          throw new Error('boom');
        },
      });

      const result = detector.detect(dom.window.document);
      expect(result.next).not.toBeNull();
    });

    it('does not read layout while collecting non-candidate link signals', () => {
      const dom = createDom(`
        <!doctype html>
        <html>
          <body>
            ${Array.from({ length: 30 }, (_, i) => `<a href="/chapter/${i + 2}.html">推荐</a>`).join('')}
          </body>
        </html>
      `);

      const spies = Array.from(dom.window.document.querySelectorAll('a')).map(anchor =>
        vi.spyOn(anchor, 'getBoundingClientRect')
      );

      const result = detector.detect(dom.window.document);

      expect(result.next).toBeNull();
      expect(result.prev).toBeNull();
      expect(result.index).toBeNull();
      expect(spies.every(spy => spy.mock.calls.length === 0)).toBe(true);
    });

    it('ignores slug-like URLs without digits unless link text indicates navigation', () => {
      const dom = createDom(`
        <!doctype html>
        <html>
          <body>
            <a href="/next.html">Read more</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document, 'https://example.com/ch');
      expect(result.next).toBeNull();
    });

    it('handles selector generation when querySelectorAll throws', () => {
      const generateSelector = (
        detector as unknown as { generateSelector: (el: Element) => string }
      ).generateSelector.bind(detector);

      const dom = createDom(`
        <!doctype html>
        <html>
          <body>
            <div id="wrap">
              <a class="bad" href="/x">x</a>
            </div>
          </body>
        </html>
      `);

      const a = dom.window.document.querySelector('a')!;
      vi.spyOn(dom.window.document, 'querySelectorAll').mockImplementation(() => {
        throw new Error('boom');
      });

      expect(generateSelector(a)).toContain('#wrap');
    });

    it('generatePathSelector uses nearest ancestor id as anchor', () => {
      const generateSelector = (
        detector as unknown as { generateSelector: (el: Element) => string }
      ).generateSelector.bind(detector);

      const dom = createDom(`
        <!doctype html>
        <html>
          <body>
            <div id="container">
              <p><a href="/x">x</a></p>
            </div>
          </body>
        </html>
      `);

      const a = dom.window.document.querySelector('a')!;
      expect(generateSelector(a)).toContain('#container');
    });

    it('compareUrlsForSection handles host mismatch and invalid inputs', () => {
      const compareUrlsForSection = (
        detector as unknown as {
          compareUrlsForSection: (
            currentUrl: string,
            nextUrl: string
          ) => { isSection: boolean; confidence: number };
        }
      ).compareUrlsForSection;

      expect(
        compareUrlsForSection('https://a.example/1_1.html', 'https://b.example/1_2.html')
      ).toMatchObject({ isSection: false });
      expect(compareUrlsForSection('not a url', 'https://example.com/x')).toMatchObject({
        isSection: false,
      });

      const dissimilar = compareUrlsForSection(
        'https://example.com/aaaa1111.html',
        'https://example.com/bbbb2222.html'
      );
      expect(dissimilar.isSection).toBe(false);
    });

    it('extractSectionFromUrl returns null for invalid URLs', () => {
      const extractSectionFromUrl = (
        detector as unknown as { extractSectionFromUrl: (url: string) => unknown }
      ).extractSectionFromUrl;

      expect(extractSectionFromUrl('not a url')).toBeNull();
    });

    it('parses extensionless chapter IDs in section parser', () => {
      expect(parseChapterSectionFromPathname('/12345')).toMatchObject({
        chapterKey: '/12345',
        section: 1,
      });
      expect(parseChapterSectionFromPathname('/gb_1/94443/1')).toMatchObject({
        chapterKey: '/gb_1/94443/1',
        section: 1,
      });
      expect(parseChapterSectionFromPathname('/gb_1/94443/1/2')).toMatchObject({
        chapterKey: '/gb_1/94443/1',
        section: 2,
      });
      expect(parseChapterSectionFromPathname('/abc')).toBeNull();
    });
  });
});
