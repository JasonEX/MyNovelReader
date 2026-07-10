import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { builtInRules } from '@/core/rules/builtInRules';
import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { Parser } from '@/core/parser';
import { shu69Rule } from '@/core/rules/sites/shu69';

const url = 'https://www.69shuba.com/txt/58672/38147713';

function makeDoc(): Document {
  const dom = new JSDOM(
    `
      <!doctype html>
      <html>
        <head>
          <title>第249章 打穿京营，夺下京城 - 大明第一国舅 - 69书吧</title>
        </head>
        <body>
          <script>
            var bookinfo = {
              pageType: 3,
              articleid: '58672',
              chapterid: '38147713',
              articlename: '大明第一国舅',
              chaptername: '第249章 打穿京营，夺下京城',
              index_page: '/book/58672/',
              preview_page: '/txt/58672/38147712',
              next_page: 'https://www.69shuba.com/txt/58672/38147714'
            };
          </script>
          <h3 class="mytitle hide720">
            <div class="bread">
              <a href="/">首页</a> &gt;
              历史&gt;
              <a href="/book/58672.htm">大明第一国舅</a>
              &gt; 第249章 打穿京营，夺下京城
            </div>
          </h3>
          <div class="page1">
            <a href="/book/58672.htm">上一章</a>
            <a href="/txt/58672/38147713">书签</a>
            <a href="/book/58672/">目录</a>
            <a href="/txt/58672/38147714">下一章</a>
          </div>
          <div class="txtnav">
            <h1>第249章 打穿京营，夺下京城</h1>
            <div id="txtcontent">
              \u2003\u2003第一段正文，皇城之外风声渐急。<br>
              <br>
              \u2003\u2003第二段正文，众人沿着长街向前推进。<br>
              <br>
              请收藏本站，最新网址：www.69shuba.com
            </div>
            <div id="txtright">右侧广告</div>
            <div class="bottom-ad">底部广告</div>
            <div class="page1">
              <a href="/book/58672.htm">上一章</a>
              <a href="/txt/58672/38147713">书签</a>
              <a href="/book/58672.htm">目录</a>
              <a href="/txt/58672/38147714">下一章</a>
            </div>
          </div>
        </body>
      </html>
    `,
    { url }
  );

  return dom.window.document;
}

describe('69shu rule', () => {
  it('is auto-discovered as a site rule', () => {
    expect(builtInRules).toContain(shu69Rule);
    expect(shu69Rule.version).toBe(2);
    expect(new RegExp(shu69Rule.match.pattern, 'i').test(url)).toBe(true);
  });

  it('parses titles, navigation, and removes site noise', async () => {
    Object.assign(globalThis, {
      GM_deleteValue: () => {},
      GM_getValue: () => null,
      GM_listValues: () => [],
      GM_setValue: () => {},
    });

    const doc = makeDoc();
    const chapter = await new Parser().parse(doc, url);

    expect(chapter?.rule?.id).toBe('69shu');
    expect(doc.querySelector('#mnr-69shu-book')?.textContent).toBe('大明第一国舅');
    expect(doc.querySelector<HTMLAnchorElement>('#mnr-69shu-prev')?.href).toBe(
      'https://www.69shuba.com/txt/58672/38147712'
    );
    expect(chapter?.title).toBe('第249章 打穿京营，夺下京城');
    expect(chapter?.bookTitle).toBe('大明第一国舅');
    expect(chapter?.prevUrl).toBe('https://www.69shuba.com/txt/58672/38147712');
    expect(chapter?.indexUrl).toBe('https://www.69shuba.com/book/58672/');
    expect(chapter?.nextUrl).toBe('https://www.69shuba.com/txt/58672/38147714');

    const content = chapter?.content || '';
    expect(content).toContain('第一段正文');
    expect(content).toContain('第二段正文');
    expect(content).not.toContain('右侧广告');
    expect(content).not.toContain('底部广告');
    expect(content).not.toContain('最新网址');
    expect(content).not.toContain('上一章');
    expect(content).not.toContain('下一章');

    const parsedContent = makeDoc();
    parsedContent.body.innerHTML = content;
    const paragraphs = Array.from(parsedContent.querySelectorAll('p')).filter(paragraph =>
      /第一段正文|第二段正文/.test(paragraph.textContent || '')
    );
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]?.textContent).toBe('第一段正文，皇城之外风声渐急。');
    expect(paragraphs[1]?.textContent).toBe('第二段正文，众人沿着长街向前推进。');
    expect(
      Array.from(parsedContent.body.querySelector('div')?.childNodes || []).some(
        node => node.nodeType === 3 && !!node.nodeValue?.trim()
      )
    ).toBe(false);
  });

  it('does not throw when beforeParse receives a document without body', async () => {
    const doc = document.implementation.createHTMLDocument('');
    doc.documentElement.removeChild(doc.body);
    doc.head.innerHTML = `
      <script>
        var bookinfo = {
          articlename: '漫威：蜘蛛侠？不，我是超人！',
          chaptername: '第41章 你们才是真正的英雄（求追读）',
          index_page: '/book/54141/',
          preview_page: '/txt/54141/34953496',
          next_page: '/txt/54141/34953498'
        };
      </script>
    `;

    const chapter = await new Parser().parse(doc, 'https://www.69shuba.com/txt/54141/34953497');

    expect(chapter).toBeNull();
    expect(doc.querySelector<HTMLAnchorElement>('#mnr-69shu-next')?.href).toBe(
      'https://www.69shuba.com/txt/54141/34953498'
    );
  });

  it('disables section merging for numeric chapter URLs', () => {
    expect(shu69Rule.advanced?.noSection).toBe(true);
  });

  it('does not fetch the next numeric chapter as a section page', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('should not fetch section pages for 69shu');
    });

    const chapter = await createSectionMerger(new Parser()).merge(makeDoc(), url, { fetcher });

    expect(fetcher).not.toHaveBeenCalled();
    expect(chapter?.title).toBe('第249章 打穿京营，夺下京城');
    expect(chapter?.nextUrl).toBe('https://www.69shuba.com/txt/58672/38147714');
  });
});
