import type { SiteRule } from '../types';

// 顶点小说（dingdianzww.org）
// - 章节页：/{bookId}/{chapterId}.html
// - 站点可能带 ?page=1，但当前模板直接返回完整章节，不能按分页章节合并。
// - 旧 ddxsmf.com/read/... 已跳转到本域名路径。
export const dingdianzwwRule: SiteRule = {
  id: 'dingdianzww',
  name: '顶点小说',
  version: 1,
  match: {
    pattern: '^https?://dingdianzww\\.org/\\d+/\\d+\\.html(?:[?#].*)?$',
  },
  content: {
    selector: '.txtnav',
    remove: 'script, style, iframe, ins, .txtinfo.hide720, .readinline, .ad_content',
    replace: [
      {
        pattern: 'PC站点如章节文字不全请用手机访问dingdianzww\\.org',
        replacement: '',
        flags: 'g',
      },
    ],
  },
  navigation: {
    prev: '.page1 a:contains("上一章")',
    index: '.page1 a:contains("章节目录"), .page1 a:contains("目录")',
    next: '.page1 a:contains("下一章")',
  },
  title: {
    selector: '.txtnav > h1, h1',
    bookSelector: '.bread a[href^="/"]:not([href="/index.html"])[href$="/"]',
  },
  advanced: {
    useIframe: true,
    noSection: true,
  },
  meta: {
    source: 'builtin',
    exampleUrl: 'https://dingdianzww.org/27543/13341609.html?page=1',
  },
};
