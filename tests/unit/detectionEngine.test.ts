import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { DetectionEngine } from '@/core/detection';

describe('DetectionEngine', () => {
  let dom: JSDOM;
  let doc: Document;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/123_2.html',
      pretendToBeVisual: true,
    });
    doc = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = doc;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('runs full detection and returns confidence report', () => {
    doc.title = '第1章 测试';
    doc.body.innerHTML = `
      <div id="content">
        <h1>第1章 测试</h1>
        <p>${'这是小说正文内容。'.repeat(200)}</p>
        <a rel="prev" href="/123.html">上一章</a>
        <a rel="next" href="/124.html">下一章</a>
        <a href="/index.html">目录</a>
      </div>
    `;

    const engine = new DetectionEngine();
    const out = engine.detect(doc, 'https://example.com/123_2.html');

    expect(out.results.content.element).not.toBeNull();
    expect(out.results.title.chapterTitle).toContain('第1章');
    expect(out.confidence.reasons.length).toBeGreaterThan(0);
  });

  it('supports section-only detection helper', () => {
    doc.body.innerHTML = `
      <div id="content">
        <p>${'这是小说正文内容。'.repeat(120)}</p>
        <a href="/123_3.html">下一页</a>
      </div>
    `;

    const engine = new DetectionEngine();
    const section = engine.detectSection(doc, 'https://example.com/123_2.html');

    expect(section.isSection).toBe(true);
    expect(section.nextSectionUrl).toContain('123_3.html');
  });

  it('quickCheck returns true when at least 2 indicators match', () => {
    doc.title = '第1章 测试';
    doc.body.innerHTML = '<div id="content"><p>短内容</p></div>';

    const engine = new DetectionEngine();
    expect(engine.quickCheck(doc)).toBe(true);
  });

  it('quickCheck uses provided document location (not host window URL)', () => {
    const hostDom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://host.example.com/read/1',
      pretendToBeVisual: true,
    });
    const chaptersDom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/chapters/123',
      pretendToBeVisual: true,
    });

    globalThis.window = hostDom.window as unknown as Window & typeof globalThis;
    globalThis.document = hostDom.window.document;

    const targetDoc = chaptersDom.window.document;
    targetDoc.body.innerHTML = `<a href="/chapters/124">下一章</a><div>${'x'.repeat(1500)}</div>`;

    const engine = new DetectionEngine();
    expect(engine.quickCheck(targetDoc)).toBe(true);
  });

  it('delegates generateSelector and supports threshold accessors', () => {
    doc.body.innerHTML = '<div id="content"><p>x</p></div>';
    const el = doc.querySelector('#content')!;

    const engine = new DetectionEngine();
    expect(engine.generateSelector(el)).toBe('#content');

    const t1 = engine.getThreshold();
    engine.setThreshold(0.9);
    const t2 = engine.getThreshold();
    expect(t2).not.toBe(t1);
  });
});
