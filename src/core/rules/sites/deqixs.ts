import type { SiteRule } from '../types';

// 得奇小说网
// - 章节页：/{bookId}/{chapterId}.html
// - 分页章节：/{bookId}/{chapterId}_{pageNo}.html
// - 目录页：/{bookId}/
export const deqixsRule: SiteRule = {
  id: 'deqixs',
  name: '得奇小说网',
  version: 1,
  match: {
    pattern: '^https?://www\\.deqixs\\.org/\\d+/\\d+(?:_\\d+)?\\.html(?:[?#].*)?$',
  },
  content: {
    selector: '.con',
    remove: 'script, style, iframe, ins',
  },
  navigation: {
    prev: '.prenext span:first-child a[href$=".html"]',
    index: '.prenext > a',
    next: '.prenext span:last-child a[href$=".html"]',
  },
  title: {
    selector: '.submenu h1',
    replace: '^.*?>\\s*',
    bookSelector: '.submenu h1 > a[href$="/"]',
  },
  toc: {
    excludeAncestors: '.new, .item, h1, h2',
  },
  advanced: {
    checkSection: true,
    sectionDelayMs: 800,
  },
  meta: {
    source: 'builtin',
    exampleUrl: 'https://www.deqixs.org/24/18442_6.html',
  },
};
