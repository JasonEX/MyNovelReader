/**
 * Unit tests for TitleDetector
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { TitleDetector } from '@/core/detection/TitleDetector';

describe('TitleDetector', () => {
  let detector: TitleDetector;

  beforeEach(() => {
    detector = new TitleDetector();
  });

  describe('detect', () => {
    it('should detect title from h1 element', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>小说名 - 第一章 开始</title></head>
          <body>
            <h1>第一章 开始</h1>
            <div id="content">Content here</div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).toContain('第一章');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should detect title from document.title', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第二十章 转折 - 我的小说</title></head>
          <body>
            <div id="content">Content here</div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).toContain('第二十章');
      expect(result.method).toBe('document-title');
    });

    it('should detect Chinese number chapters', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第一百零八章 决战</title></head>
          <body></body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).toContain('第一百零八章');
    });

    it('should detect Arabic number chapters', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第123章 新开始</title></head>
          <body></body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).toContain('第123章');
    });

    it('should clean up title by removing site name', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第一章 开始_小说阅读网</title></head>
          <body></body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).not.toContain('小说阅读网');
    });

    it('should strip pagination suffix like (1/3) from h1', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第一章 测试 - 小说</title></head>
          <body>
            <h1>第一章 测试(1/3)</h1>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.chapterTitle).toBe('第一章 测试');
    });

    it('should detect book title from breadcrumb', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第一章</title></head>
          <body>
            <div class="breadcrumb">
              <a href="/">首页</a>
              <a href="/book/123">我的小说</a>
            </div>
            <h1>第一章 开始</h1>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.bookTitle).toBe('我的小说');
    });

    it('should detect book title from meta tags', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>第12章 测试</title>
            <meta property="og:novel:book_name" content="元婴修仙传" />
          </head>
          <body>
            <h1>第12章 测试</h1>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.bookTitle).toBe('元婴修仙传');
    });

    it('should prefer repeated book title candidates', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>《假名》 - 第1章</title>
          </head>
          <body>
            <div class="bookinfo">
              <h1>真正的书名</h1>
            </div>
            <a href="/index" aria-label="目录">《真正的书名》章节目录</a>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.bookTitle).toBe('真正的书名');
    });

    it('should return empty result when no title found', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title></title></head>
          <body>
            <div>No title here</div>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).toBe('');
      expect(result.confidence).toBe(0);
    });

    it('tolerates selector errors and continues scanning', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第1章 测试</title></head>
          <body><h1>第1章 测试</h1></body>
        </html>
      `);

      const doc = dom.window.document;
      const original = doc.querySelector.bind(doc);
      doc.querySelector = ((selector: string) => {
        if (selector === 'h1.chapter-title') throw new Error('boom');
        return original(selector);
      }) as typeof doc.querySelector;

      const result = detector.detect(doc);
      expect(result.chapterTitle).toContain('第1章');
    });

    it('falls back to first part of document.title when no chapter pattern exists', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>我的小说 - 首页</title></head>
          <body></body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.method).toBe('document-title');
      expect(result.chapterTitle).toBe('我的小说');
    });

    it('returns empty result when document.title has only an overlong chapter match', () => {
      const long = `第1章 ${'很长的标题'.repeat(60)}`;
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>${long}</title></head>
          <body></body>
        </html>
      `);

      const result = detector.detect(dom.window.document);

      expect(result.chapterTitle).toBe('');
      expect(result.confidence).toBe(0);
    });

    it('detects chapter title from h2 when no valid h1 exists', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>小说</title></head>
          <body>
            <h1></h1>
            <h2>第12章 H2标题</h2>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.method).toBe('heading');
      expect(result.chapterTitle).toContain('第12章');
    });

    it('ignores malformed JSON-LD when extracting book title', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>第1章 测试</title>
            <meta property="og:novel:book_name" content="书名A" />
          </head>
          <body>
            <script type="application/ld+json">{ not valid json </script>
            <h1>第1章 测试</h1>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.bookTitle).toBe('书名A');
    });

    it('ignores structured data arrays without a book title', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><title>第1章</title></head>
          <body>
            <script type="application/ld+json">
              [
                {
                  "@type": "Page",
                  "data": { "info": { "name": 123 } },
                  "random": { "nested": { "foo": "bar" } }
                }
              ]
            </script>
            <h1>第1章 测试</h1>
          </body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.chapterTitle).toContain('第1章');
      expect(result.bookTitle).toBeUndefined();
    });

    it('continues scanning book-title selectors when doc.querySelector throws', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>第1章 测试</title>
            <meta property="og:novel:book_name" content="书名B" />
          </head>
          <body><h1>第1章 测试</h1></body>
        </html>
      `);

      const doc = dom.window.document;
      const original = doc.querySelector.bind(doc);
      doc.querySelector = ((selector: string) => {
        if (selector === '.bookname') throw new Error('boom');
        return original(selector);
      }) as typeof doc.querySelector;

      const result = detector.detect(doc);
      expect(result.bookTitle).toBe('书名B');
    });

    it('prefers longer book title when weights tie (after stripping chapter suffix)', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>第1章 测试</title>
            <meta property="og:title" content="短名 第1章" />
            <meta name="twitter:title" content="更长书名 第1章" />
          </head>
          <body><h1>第1章 测试</h1></body>
        </html>
      `);

      const result = detector.detect(dom.window.document);
      expect(result.bookTitle).toBe('更长书名');
    });

    it('detects book title from structured data and script hints', () => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>第1章 开始 - 假名</title>
            <meta name="keywords" content="《元婴修仙传》,修仙,玄幻" />
            <meta name="description" content="《元婴修仙传》是一部精彩小说" />
          </head>
          <body>
            <script type="application/ld+json">
              { "@type": "Book", "name": "《元婴修仙传》" }
            </script>
            <script>
              window.__DATA__ = { bookName: "元婴修仙传" };
            </script>
            <a href="/index">元婴修仙传 章节目录</a>
            <h1 id="chapter:title">第1章 开始</h1>
          </body>
        </html>
      `);

      const doc = dom.window.document;
      const originalQuerySelector = doc.querySelector.bind(doc);
      const knownTitleSelectors = new Set([
        'h1.chapter-title',
        'h1.chapter_title',
        '.chapter-title',
        '.chapter_title',
        '.bookname h1',
        'h1.title',
        '.title h1',
        '#chapter_title',
        '.readtitle h1',
        'article h1',
        'h1',
      ]);

      doc.querySelector = ((selector: string) => {
        if (knownTitleSelectors.has(selector)) throw new Error('boom');
        return originalQuerySelector(selector);
      }) as typeof doc.querySelector;

      const result = detector.detect(doc);

      expect(result.bookTitle).toBe('元婴修仙传');
      expect(result.selector).toContain('#');
    });
  });
});
