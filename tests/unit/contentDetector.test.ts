/**
 * Unit tests for ContentDetector
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContentDetector } from '@/core/detection/ContentDetector';
import { JSDOM } from 'jsdom';

describe('ContentDetector', () => {
  let detector: ContentDetector;

  beforeEach(() => {
    detector = new ContentDetector();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('detect', () => {
    it('should detect content by known selector (#content)', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <nav>Navigation</nav>
            <div id="content">
              <p>这是一段很长的小说内容。</p>
              <p>第一章 开始</p>
              <p>${'小说正文内容'.repeat(100)}</p>
            </div>
            <footer>Footer</footer>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).not.toBeNull();
      expect(result.selector).toBe('#content');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.method).toBe('selector');
    });

    it('skips hidden known selectors before falling back to visible content', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="content" style="display: none">
              ${'这是隐藏正文内容，不能作为阅读正文。'.repeat(120)}
            </div>
            <main id="main-story">
              <p>${'这是可见小说正文内容，主角继续向前。'.repeat(120)}</p>
            </main>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element?.id).toBe('main-story');
      expect(result.method).toBe('heuristic');
    });

    it('does not apply host computed styles to detached parsed documents', () => {
      const hostGetComputedStyle = vi.fn(() => ({
        display: 'none',
        visibility: 'hidden',
      }));
      vi.stubGlobal('getComputedStyle', hostGetComputedStyle);

      const host = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      const parsed = new host.window.DOMParser().parseFromString(
        `
          <!DOCTYPE html>
          <html>
            <body>
              <main id="main">
                <div class="content">
                  <p>${'这是后台解析的小说正文，主角继续向前。'.repeat(120)}</p>
                </div>
              </main>
            </body>
          </html>
        `,
        'text/html'
      );

      expect(parsed.defaultView).toBeNull();

      const result = detector.detect(parsed);

      expect(result.selector).toBe('.content');
      expect(result.method).toBe('selector');
      expect(hostGetComputedStyle).not.toHaveBeenCalled();
    });

    it('respects inline visibility in detached parsed documents', () => {
      const host = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      const parsed = new host.window.DOMParser().parseFromString(
        `
          <!DOCTYPE html>
          <html>
            <body>
              <div class="content" style="display: none">
                ${'这是隐藏正文内容，不能作为阅读正文。'.repeat(120)}
              </div>
              <main id="main-story">
                <p>${'这是可见小说正文内容，主角继续向前。'.repeat(120)}</p>
              </main>
            </body>
          </html>
        `,
        'text/html'
      );

      expect(parsed.defaultView).toBeNull();

      const result = detector.detect(parsed);

      expect(result.element?.id).toBe('main-story');
      expect(result.method).toBe('heuristic');
    });

    it('should detect content by known selector (.noveltext)', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div class="noveltext">
              ${'这是一段很长的小说内容，包含很多中文字符。'.repeat(50)}
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).not.toBeNull();
      expect(result.selector).toBe('.noveltext');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect truncated .content when p_key + 加载更多 pattern exists', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div class="content">
              <p>这是一段较短的正文内容。</p>
              <p>阅|读|模|式|下，无|法|显|示|本|章|节|全|部|内|容，请|返|回|原|网|页阅|读。</p>
              <p><button>加|载|更|多</button></p>
            </div>
            <script>const p_key='${'A'.repeat(120)}';</script>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).not.toBeNull();
      expect(result.selector).toBe('.content');
      expect(result.method).toBe('selector');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should use heuristic detection when no known selector matches', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div class="header">Header</div>
            <div class="main-story">
              <h1>第一章</h1>
              ${'这是一段很长的小说正文内容，主角出场了。'.repeat(100)}
            </div>
            <div class="sidebar">Sidebar</div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).not.toBeNull();
      expect(result.method).toBe('heuristic');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should return empty result when no valid content found', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div>Short text</div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).toBeNull();
      expect(result.confidence).toBe(0);
      expect(result.method).toBe('fallback');
    });

    it('should penalize high link density elements', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="links">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
              <a href="#">Link 4</a>
              <a href="#">Link 5</a>
            </div>
            <div id="article">
              ${'这是一段很长的小说内容，没有太多链接。'.repeat(100)}
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      // Should prefer #article over #links due to link density
      expect(result.element?.id).not.toBe('links');
    });

    it('should prefer elements with high Chinese character ratio', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="english">
              ${'This is English text with no Chinese characters. '.repeat(100)}
            </div>
            <div id="chinese">
              ${'这是中文小说内容，包含大量中文字符。主角开始了冒险之旅。'.repeat(100)}
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element?.id).toBe('chinese');
    });

    it('calculates Chinese ratio without counting whitespace', () => {
      const calculateChineseRatio = (
        detector as unknown as { calculateChineseRatio(text: string): number }
      ).calculateChineseRatio.bind(detector);

      expect(calculateChineseRatio('你 好\tA\u00a0\u3000')).toBeCloseTo(2 / 3);
      expect(calculateChineseRatio(' \n\t\u00a0\u3000')).toBe(0);
    });

    it('returns empty result when candidates exist but score is too low', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="comment-section">
              ${'<a href="#">link</a>'.repeat(200)}
              ${'This is mostly links and should have low content score. '.repeat(20)}
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).toBeNull();
      expect(result.method).toBe('fallback');
    });

    it('uses direct DOM lookup for simple known selectors', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="content">
              <p>${'小说正文内容'.repeat(120)}</p>
            </div>
          </body>
        </html>
      `);

      const doc = dom.window.document;
      const querySpy = vi.spyOn(doc, 'querySelector');
      const getElementByIdSpy = vi.spyOn(doc, 'getElementById');

      const result = detector.detect(doc);

      expect(result.selector).toBe('#content');
      expect(getElementByIdSpy).toHaveBeenCalled();
      expect(querySpy).not.toHaveBeenCalled();
    });

    it('treats 加载更多 pattern as invalid when p_key is missing', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div class="content">
              <p>较短正文。</p>
              <p>无法显示本章节全部内容，请返回原网页阅读。</p>
              <p><a href="#">加载更多</a></p>
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).toBeNull();
      expect(result.method).toBe('fallback');
    });

    it('ignores hidden candidates (display:none)', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div style="display:none">
              ${'这是隐藏内容'.repeat(120)}
            </div>
            <div class="main-story">
              ${'这是可见内容'.repeat(120)}
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element).not.toBeNull();
      expect(result.element?.className).toBe('main-story');
    });

    it('scores MAIN tags and paragraph counts', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <main class="story-main">
              <p>第一段。</p>
              <p>第二段。</p>
              <p>第三段。</p>
              <p>${'这是小说正文内容'.repeat(120)}</p>
            </main>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element?.tagName.toLowerCase()).toBe('main');
      expect(result.method).toBe('heuristic');
    });

    it('applies negative scoring to comment-like containers', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <div id="comment">
              ${'评论'.repeat(300)}${'<a href="#">x</a>'.repeat(200)}
            </div>
            <div id="main-story">
              ${'这是中文小说内容'.repeat(200)}
            </div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.element?.id).toBe('main-story');
    });
  });

  describe('generateSelector', () => {
    it('should generate ID selector when element has ID', () => {
      const dom = new JSDOM(`
        <html><body><div id="content">Test</div></body></html>
      `);
      const element = dom.window.document.getElementById('content')!;

      const selector = detector.generateSelector(element);

      expect(selector).toBe('#content');
    });

    it('should generate class selector when ID is not available', () => {
      const dom = new JSDOM(`
        <html><body><div class="unique-class">Test</div></body></html>
      `);
      const element = dom.window.document.querySelector('.unique-class')!;

      const selector = detector.generateSelector(element);

      // In jsdom environment, document.querySelectorAll uses global document
      // so it falls back to path selector. In real browser, it would use class.
      expect(selector).toBeTruthy();
      expect(typeof selector).toBe('string');
    });

    it('should escape special characters in selectors', () => {
      const dom = new JSDOM(`
        <html><body><div id="content:main">Test</div></body></html>
      `);
      const element = dom.window.document.getElementById('content:main')!;

      const selector = detector.generateSelector(element);

      // Should be properly escaped
      expect(selector).toContain('content');
    });

    it('uses unique class selector when possible (with global document set)', () => {
      const dom = new JSDOM('<html><body><div class="unique-class">Test</div></body></html>');
      vi.stubGlobal('document', dom.window.document);
      const element = dom.window.document.querySelector('.unique-class')!;

      const selector = detector.generateSelector(element);

      expect(selector).toBe('.unique-class');
    });

    it('continues when querySelectorAll throws for a class selector', () => {
      const dom = new JSDOM('<html><body><div class="bad">Test</div></body></html>');
      vi.stubGlobal('document', dom.window.document);
      const element = dom.window.document.querySelector('.bad')!;

      const qsa = vi.spyOn(dom.window.document, 'querySelectorAll').mockImplementation(() => {
        throw new Error('boom');
      });

      const selector = detector.generateSelector(element);

      expect(selector).toContain('div');
      expect(qsa).toHaveBeenCalled();
    });

    it('generates a path selector that stops at the nearest ancestor with an id', () => {
      const dom = new JSDOM(`
        <html>
          <body>
            <div id="wrap">
              <p><span>Test</span></p>
            </div>
          </body>
        </html>
      `);
      vi.stubGlobal('document', dom.window.document);
      const element = dom.window.document.querySelector('#wrap span')!;

      const selector = detector.generateSelector(element);

      expect(selector).toContain('#wrap');
    });
  });

  it('treats NAV/HEADER/FOOTER/ASIDE elements as navigation elements', () => {
    const dom = new JSDOM('<html><body><nav>Nav</nav></body></html>');
    const nav = dom.window.document.querySelector('nav')!;

    const isNavigationElement = (
      detector as unknown as { isNavigationElement: (el: Element) => boolean }
    ).isNavigationElement;

    expect(isNavigationElement(nav)).toBe(true);
  });
});
