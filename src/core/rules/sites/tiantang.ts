import { appendHiddenLink } from '../helpers/scriptNavigation';
import type { SiteRule } from '../types';

// Chapter navigation points to /books/{bookId}.html, which only contains
// preview chapters. The full, paged catalog lives beside the chapter pages.
export const tiantangRule: SiteRule = {
  id: 'tiantang',
  name: '格格党（tiantang100）',
  version: 1,
  match: {
    pattern: '^https?://www\\.tiantang100\\.org/\\d+/\\d+/\\d+(?:_\\d+)?\\.html(?:[?#].*)?$',
  },
  content: { selector: '#content' },
  navigation: { index: '#mnr-tiantang-index' },
  hooks: {
    beforeParse(doc, url) {
      if (!url || !new RegExp(tiantangRule.match.pattern).test(url)) return;
      appendHiddenLink(doc, 'mnr-tiantang-index', '.', '目录', url);
    },
  },
  meta: {
    source: 'builtin',
    exampleUrl: 'http://www.tiantang100.org/337/337644/1889083.html',
  },
};
