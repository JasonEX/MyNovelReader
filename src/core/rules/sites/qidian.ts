import type { BeforeParseHook, SiteRule } from '../types';

type QidianPageContext = {
  pageContext?: {
    pageProps?: {
      pageData?: {
        bookInfo?: {
          bookId?: number | string;
        };
        chapterInfo?: {
          next?: number | string;
          prev?: number | string;
        };
      };
    };
  };
};

function hasQidianChapterId(value: number | string | undefined): value is number | string {
  return value !== undefined && value !== null && String(value) !== '-1' && String(value) !== '';
}

const qidianBeforeParse: BeforeParseHook = (doc, url) => {
  // Remove review count from title.
  try {
    const reviews = doc.querySelectorAll('h1 .review');
    reviews.forEach(el => el.remove());
  } catch (e) {
    console.debug('[MNR] Failed to remove review elements:', e);
  }

  try {
    const script = doc.querySelector('#vite-plugin-ssr_pageContext');
    if (!script) return;

    const data = JSON.parse(script.textContent || '{}') as QidianPageContext;
    const pageData = data.pageContext?.pageProps?.pageData;
    if (!pageData) return;

    const bookId = pageData.bookInfo?.bookId;
    const chapterInfo = pageData.chapterInfo;
    const host = url ? new URL(url).hostname : location.hostname;
    const navContainer = doc.createElement('div');
    navContainer.id = 'mnr-qidian-nav';
    navContainer.style.display = 'none';

    if (bookId && hasQidianChapterId(chapterInfo?.prev)) {
      const prev = doc.createElement('a');
      prev.id = 'mnr-qidian-prev';
      prev.href = `//${host}/chapter/${bookId}/${chapterInfo.prev}/`;
      prev.textContent = '上一章';
      navContainer.appendChild(prev);
    }

    if (bookId && hasQidianChapterId(chapterInfo?.next)) {
      const next = doc.createElement('a');
      next.id = 'mnr-qidian-next';
      next.href = `//${host}/chapter/${bookId}/${chapterInfo.next}/`;
      next.textContent = '下一章';
      navContainer.appendChild(next);
    }

    if (bookId) {
      const index = doc.createElement('a');
      index.id = 'mnr-qidian-index';
      // The /catalog/ route can return 406 to fetch/GM requests on newer Qidian pages.
      // The book detail page contains the same chapter links and is more stable to parse.
      index.href = `//${host}/book/${bookId}/`;
      index.textContent = '目录';
      navContainer.appendChild(index);
    }

    doc.body.appendChild(navContainer);
  } catch (e) {
    console.warn('[MyNovelReader] Qidian beforeParse error:', e);
  }
};

const qidianContent: SiteRule['content'] = {
  selector: 'main[id^="c-"]',
  remove: '.review, #r-titlePage, .tooltip-wrapper, .chapter-end-qrcode, section[id^="r-"]',
};

const qidianNavigation: SiteRule['navigation'] = {
  // #mnr-qidian-* are created by beforeParse hook from JSON data.
  // Fallback selectors cover older DOM-rendered pages.
  prev: '#mnr-qidian-prev, .nav-btn-group a:contains("上一章"), a.nav-btn:contains("上一章")',
  index: '#mnr-qidian-index',
  next: '#mnr-qidian-next, .nav-btn-group a:contains("下一章"), a.nav-btn:contains("下一章")',
};

const qidianTitle: SiteRule['title'] = {
  selector: 'h1.title, h1.text-1\\.3em, #r-nav-chapter-title',
};

const qidianHooks: SiteRule['hooks'] = {
  beforeParse: qidianBeforeParse,
};

export const qidianMobileRule: SiteRule = {
  id: 'qidian-mobile',
  name: '起点中文网手机版',
  version: 1,
  match: {
    pattern: '^https?://m\\.qidian\\.com/chapter/.*',
  },
  content: {
    ...qidianContent,
  },
  navigation: {
    ...qidianNavigation,
  },
  title: {
    ...qidianTitle,
  },
  hooks: {
    ...qidianHooks,
  },
  advanced: {
    mutationSelector: 'main[id^="c-"]',
    mutationChildCount: 0,
  },
  meta: { source: 'builtin' },
};

export const qidianRule: SiteRule = {
  id: 'qidian',
  name: '起点中文网',
  version: 9,
  match: {
    pattern: '^https?://www\\.qidian\\.com/chapter/.*',
  },
  content: {
    ...qidianContent,
  },
  navigation: {
    ...qidianNavigation,
  },
  title: {
    ...qidianTitle,
  },
  hooks: {
    ...qidianHooks,
  },
  advanced: {
    useIframe: true,
    mutationSelector: 'main[id^="c-"]',
    mutationChildCount: 0,
  },
  meta: { source: 'builtin' },
};
