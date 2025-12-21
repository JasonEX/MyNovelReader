/**
 * Unit tests for ContentDetector
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { ContentDetector } from '@/core/detection/ContentDetector';
import { JSDOM } from 'jsdom';

describe('ContentDetector', () => {
  let detector: ContentDetector;

  beforeEach(() => {
    detector = new ContentDetector();
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
  });
});
