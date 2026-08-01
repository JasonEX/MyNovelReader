import type { SiteRule } from '../types';

// 思兔阅读
// - 章节页：/txt/{bookId}/{chapterId}.html
// - 目录页：/book/{bookId}/index.html
// - 完整目录：/ajax_novels/chapterlist/{bookId}.html
export const sto9Rule: SiteRule = {
  id: 'sto9',
  name: '思兔阅读',
  version: 1,
  match: {
    pattern: '^https?://(?:www\\.)?sto9\\.com/txt/\\d+/\\d+\\.html(?:[?#].*)?$',
  },
  content: {
    selector: '.txtnav',
    remove: 'script, style, iframe, ins, .txtright, .txtad, .txtcenter',
    replace: [
      {
        pattern: '[（(]\\s*還有更新耶\\s*[）)]',
        replacement: '',
        flags: 'g',
      },
    ],
  },
  navigation: {
    prev: '.page1 a:contains("上一章")',
    index: '.page1 a:contains("目錄"), .page1 a:contains("目录")',
    next: '.page1 a:not([href$="/end.html"]):contains("下一章")',
  },
  title: {
    selector: '.txtnav > h1',
    bookSelector: '.bread a[href*="/book/"][href$="/index.html"]',
  },
  meta: {
    source: 'builtin',
    exampleUrl: 'https://sto9.com/txt/7974/7627078.html',
  },
};
