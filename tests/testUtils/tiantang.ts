// Reduced markup from the book overview and paged catalog at tiantang100.org.
export const tiantangOrigin = 'http://www.tiantang100.org';
export const tiantangIndexPath = '/books/337644.html';
export const tiantangDirectory = '/337/337644/';
export const tiantangChapterPath = (chapter: number): string =>
  `${tiantangDirectory}${1888827 + chapter}.html`;

function chapterLinks(start: number, end: number): string {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const chapter = start + i;
    return `<a href="${tiantangChapterPath(chapter)}" rel="chapter"><dd>第${chapter}章 测试正文</dd></a>`;
  }).join('');
}

export function makeTiantangOverview(): string {
  return `<div id="list"><dl>
    ${chapterLinks(291, 298)}
    ${chapterLinks(1, 100)}
    <a href="${tiantangDirectory}" rel="chapter"><dt>点击查看全部章节目录</dt></a>
  </dl></div>`;
}

export function makeTiantangToc(page: number): string {
  return `<div id="list"><dl>
    ${chapterLinks((page - 1) * 50 + 1, Math.min(page * 50, 298))}
    ${page < 6 ? `<a href="${tiantangDirectory}${page + 1}/">下一页</a>` : ''}
  </dl></div>`;
}
