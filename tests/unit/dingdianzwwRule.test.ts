import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { findBuiltInRule } from '@/core/rules/builtInRules';
import { loadTocEntriesPaged } from '@/ui/stores/reader/toc';
import { Parser } from '@/core/parser';

import { createDom } from '../testUtils/dom';

const url = 'https://dingdianzww.org/27543/13341609.html?page=1';

function chapterHtml(options: {
  body: string;
  nextHref: string;
  prevHref: string;
  title: string;
}): string {
  return `
    <!doctype html>
    <html>
      <head>
        <title>废土边境检查官小说免费阅读 ${options.title}_顶点小说</title>
      </head>
      <body>
        <h3 class="mytitle hide720">
          <div class="bread">
            <a href="/index.html">首页</a> &gt;
            <a href="/27543/">废土边境检查官</a> &gt;
            <a href="/27543/13341609.html">${options.title}</a>
          </div>
        </h3>
        <div class="txtnav">
          <h1>${options.title}</h1>
          ${options.body}
          <div class="txtinfo hide720">
            <span>PC站点如章节文字不全请用手机访问dingdianzww.org</span>
          </div>
        </div>
        <div class="page1">
          <a href="${options.prevHref}">上一章</a>
          <a href="/27543/">章节目录</a>
          <a href="${options.nextHref}">下一章</a>
        </div>
      </body>
    </html>
  `;
}

function makeDoc(html: string, pageUrl = url): Document {
  return new JSDOM(html, { url: pageUrl }).window.document;
}

const page1Html = chapterHtml({
  title: '第291章 新的改制，突破重械！',
  body: `
    &emsp;&emsp;第一段正文，电话挂断。<br />
    <br />
    &emsp;&emsp;第二段正文，众人重新分析局势。<br />
  `,
  prevHref: '/27543/13341608.html',
  nextHref: '/27543/13380762.html',
});

const tocHtml = `
  <!doctype html>
  <html>
    <body>
      <div class="mybox">
        <h3 class="mytitle">最新章节</h3>
        <ul>
          <li><a href="/27543/13380762.html"><span>第292章 军团分裂，自主力量！</span></a></li>
        </ul>
      </div>
      <div class="mybox">
        <h3 class="mytitle">全部章节</h3>
        <ul>
          <li><a href="/27543/9719752.html"><span>第1章 幸福城，您的废土避难首选！</span></a></li>
          <li><a href="/27543/13341608.html"><span>第290章 生命礼赞，原初超凡之种！</span></a></li>
          <li><a href="/27543/13341609.html"><span>第291章 新的改制，突破重械！</span></a></li>
          <li><a href="/27543/13380762.html"><span>第292章 军团分裂，自主力量！</span></a></li>
          <li><a href="/27543/13430077.html"><span>第293章 争锋相对，对赌合约！</span></a></li>
        </ul>
      </div>
    </body>
  </html>
`;

describe('Dingdianzww rule', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    createDom(url);
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('is auto-discovered and replaces the obsolete ddxsmf rule', () => {
    const rule = findBuiltInRule(url);

    expect(rule?.id).toBe('dingdianzww');
    expect(rule?.version).toBe(1);
    expect(rule?.advanced?.noSection).toBe(true);
    expect(findBuiltInRule('https://www.ddxsmf.com/read/27543/9719752.html')).toBeUndefined();
  });

  it('parses chapter title, book title, navigation, and removes site noise', async () => {
    const chapter = await new Parser().parse(makeDoc(page1Html), url);

    expect(chapter?.rule?.id).toBe('dingdianzww');
    expect(chapter?.title).toBe('第291章 新的改制，突破重械！');
    expect(chapter?.bookTitle).toBe('废土边境检查官');
    expect(chapter?.prevUrl).toBe('https://dingdianzww.org/27543/13341608.html');
    expect(chapter?.indexUrl).toBe('https://dingdianzww.org/27543/');
    expect(chapter?.nextUrl).toBe('https://dingdianzww.org/27543/13380762.html');

    const content = chapter?.content || '';
    expect(content).toContain('第一段正文');
    expect(content).toContain('第二段正文');
    expect(content).not.toContain('PC站点');
    expect(content).not.toContain('dingdianzww.org');
  });

  it('does not merge ?page=1 as a paged chapter', async () => {
    const parser = new Parser();
    const merger = createSectionMerger(parser);
    const result = await merger.merge(makeDoc(page1Html), url, {
      fetcher: async targetUrl => {
        throw new Error(`unexpected fetch: ${targetUrl}`);
      },
    });

    expect(result?.url).toBe(url);
    expect(result?.content).toContain('第一段正文');
    expect(result?.nextUrl).toBe('https://dingdianzww.org/27543/13380762.html');
  });

  it('loads and sorts catalog entries from the book index page', async () => {
    const gm = vi.fn((opts: GM_xmlhttpRequestOptions) => {
      opts.onload?.({
        readyState: 4,
        responseHeaders: '',
        responseText: tocHtml,
        status: 200,
        statusText: 'OK',
        finalUrl: opts.url,
      });
      return { abort: vi.fn() };
    });
    vi.stubGlobal('GM_xmlhttpRequest', gm);

    const entries = await loadTocEntriesPaged(
      'https://dingdianzww.org/27543/',
      url,
      findBuiltInRule(url),
      vi.fn()
    );

    expect(gm).toHaveBeenCalledTimes(1);
    expect(entries.map(entry => entry.title)).toEqual([
      '第1章 幸福城，您的废土避难首选！',
      '第290章 生命礼赞，原初超凡之种！',
      '第291章 新的改制，突破重械！',
      '第292章 军团分裂，自主力量！',
      '第293章 争锋相对，对赌合约！',
    ]);
  });
});
