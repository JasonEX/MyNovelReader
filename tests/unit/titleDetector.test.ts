/**
 * Unit tests for TitleDetector
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { TitleDetector } from '../../src/core/detection/TitleDetector';

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
  });
});
