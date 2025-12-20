/**
 * Unit tests for NavigationDetector
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { NavigationDetector } from '@/core/detection/NavigationDetector';

describe('NavigationDetector', () => {
  let detector: NavigationDetector;

  beforeEach(() => {
    detector = new NavigationDetector();
  });

  describe('detect', () => {
    it('should detect next link with rel="next" attribute', () => {
      const dom = new JSDOM(`
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
      const dom = new JSDOM(`
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
      const dom = new JSDOM(`
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
      const dom = new JSDOM(`
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

    it('should ignore invalid URL patterns like index/list', () => {
      const dom = new JSDOM(`
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
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <body>
            <a href="https://wap.ciweimao.com/chapter/get_par_tsu_list?chapter_id=113493242&data-pgid=0">
              下一章
            </a>
            <a href="https://wap.ciweimao.com/chapter/113497985">下一章</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.next?.url).toContain('/chapter/113497985');
    });

    it('should allow index/list URLs for index navigation', () => {
      const dom = new JSDOM(`
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
      const dom = new JSDOM(`
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
  });

  describe('validateNavigation', () => {
    it('should validate sequential chapter numbers', () => {
      const dom = new JSDOM(`
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
});
