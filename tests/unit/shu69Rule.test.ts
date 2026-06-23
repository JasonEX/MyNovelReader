import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

import { findBuiltInRule } from '@/core/rules/builtInRules';
import { Parser } from '@/core/parser';

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
            <p>第一段正文，皇城之外风声渐急。</p>
            <p>第二段正文，众人沿着长街向前推进。</p>
            <p>请收藏本站，最新网址：www.69shuba.com</p>
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
    const rule = findBuiltInRule(url);

    expect(rule?.id).toBe('69shu');
    expect(rule?.version).toBe(2);
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
  });
});
