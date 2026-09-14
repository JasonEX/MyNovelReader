import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import {
  collectTocCandidates,
  dedupeTocEntries,
  filterTocEntries,
} from '@/ui/stores/reader/tocEntries';
import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { DetectionEngine } from '@/core/detection';
import { Parser } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';
import { TitleDetector } from '@/core/detection/TitleDetector';

const chapterUrl = 'https://example.com/read/123/456.html';

describe('default chapter flow', () => {
  it.each(['?lang=zh', '?ref=menu', '?page=3', '?page=2&lang=zh', '#top'])(
    'does not merge a self-link or non-consecutive variant %s',
    async suffix => {
      const doc = new JSDOM(
        `<h1>第98章 开始</h1>
         <div id="article-content">${'测试正文。'.repeat(120)}</div>
         <a href="${chapterUrl}${suffix}">继续阅读</a>
         <a href="/read/123/457.html">下一章</a>`,
        { url: chapterUrl }
      ).window.document;
      const detection = new DetectionEngine().detect(doc, chapterUrl);
      expect(detection.results.section?.isSection).toBe(false);
      const fetcher = vi.fn();
      await createSectionMerger(new Parser()).merge(doc, chapterUrl, { fetcher });
      expect(fetcher).not.toHaveBeenCalled();
    }
  );

  it('extracts the inner article body without treating a language self-link as pagination', async () => {
    const doc = new JSDOM(
      `<title>第98章 神形功，入门！ - 修仙从扮演少女开始 - 免费小说</title>
       <a href="${chapterUrl}">简体中文</a>
       <article>
         <h1>第98章 神形功，入门！</h1>
         <p>修仙从扮演少女开始</p>
         <div id="article-content"><p>${'这是一段用于验证正文完整保留的小说文字。'.repeat(40)}</p></div>
         <div>分享 Facebook 下载 App</div>
         <a href="/read/123/455.html">上一章</a>
         <a href="/book/123.html">返回目录</a>
         <a href="/read/123/457.html">下一章</a>
       </article>`,
      { url: chapterUrl }
    ).window.document;
    const detection = new DetectionEngine().detect(doc, `${chapterUrl}#google_vignette`);
    expect(detection.results.content.selector).toBe('#article-content');
    expect(detection.results.section?.isSection).toBe(false);

    const fetcher = vi.fn();
    const chapter = await createSectionMerger(new Parser()).merge(doc, chapterUrl, { fetcher });
    expect(chapter?.method).toBe('detection');
    expect(chapter?.title).toBe('第98章 神形功，入门！');
    expect(chapter?.bookTitle).toBe('修仙从扮演少女开始');
    expect(chapter?.content).not.toMatch(/分享|Facebook|下载|第98章/);
    expect(chapter?.content).toContain('小说文字。');
    expect(chapter?.nextUrl).toBe('https://example.com/read/123/457.html');
    expect(chapter?.prevUrl).toBe('https://example.com/read/123/455.html');
    expect(chapter?.indexUrl).toBe('https://example.com/book/123.html');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each(['，', ','])('preserves %s within a book name separated from the chapter', comma => {
    const doc = new JSDOM(`<title>第12章 风起${comma}云涌 - 山海${comma}归途 - 小说网</title>`)
      .window.document;
    expect(new TitleDetector().detect(doc).bookTitle).toBe(`山海${comma}归途`);
  });

  it('reads collapsed template chapters in document order without executing or mounting them', () => {
    const doc = new JSDOM(`
      <a href="/read/123/1.html">第1章 开始</a>
      <template x-if="expanded">
        <a href="/read/123/2.html">第2章 继续</a>
        <template><a href="/read/123/3.html">第3章 转折</a></template>
        <a :href="chapter.url" x-text="chapter.title"></a>
        <script>throw new Error('must not execute')</script>
      </template>
      <a href="/read/123/4.html">第4章 归来</a>
      <a href="/read/123/5.html">第5章 尾声</a>
      <a href="/read/123/6.html">第6章 终章</a>
    `).window.document;
    const before = doc.documentElement.outerHTML;
    const entries = filterTocEntries(dedupeTocEntries(collectTocCandidates(doc, chapterUrl)));
    expect(entries.map(entry => entry.url)).toEqual(
      [1, 2, 3, 4, 5, 6].map(id => `https://example.com/read/123/${id}.html`)
    );
    expect(doc.documentElement.outerHTML).toBe(before);
  });

  it('honors excluded containers outside and inside templates', () => {
    const doc = new JSDOM(`
      <div class="related"><template><a href="/read/123/1.html">第1章 排除</a></template></div>
      <template>
        <div class="related"><a href="/read/123/2.html">第2章 排除</a></div>
        <a href="/read/123/3.html">第3章 保留</a>
      </template>
    `).window.document;
    const rule = { toc: { excludeAncestors: '.related' } } as SiteRule;
    expect(collectTocCandidates(doc, chapterUrl, rule)).toEqual([
      { title: '第3章 保留', url: 'https://example.com/read/123/3.html' },
    ]);
  });
});
