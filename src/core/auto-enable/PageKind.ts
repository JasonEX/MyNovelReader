export type PageKind = 'chapter' | 'toc' | 'other';

const TOC_TITLE_PATTERN =
  /(?:章节目录|章節目錄|章节列表|章節列表|目录|目錄|书目|書目|toc|catalog|contents?)/i;

const TOC_URL_PATTERN =
  /(?:^|\/)(?:catalog|toc|contents?|mulu|dir(?:ectory)?|chapterlist|chapters)(?:\/|$)/i;

const TOC_QUERY_PATTERN = /[?&](?:catalog|toc|contents?)=|[?&](?:mulu|dir)=/i;

// URL-only chapter detection should be conservative to avoid triggering on book/detail/list pages.
// Keep numeric requirements and only add explicit chapter-style segments (e.g. chapters, /novel/chapters/).
// For ambiguous URLs (e.g. numeric .html), fall back to DOM heuristics instead.
const CHAPTER_URL_STRONG_PATTERN =
  /\/(?:chapter|chapters?|read|txt|article|novel\/chapters)\/[^?#]*\d/i;
const CHAPTER_URL_TERMINAL_PATTERN =
  /\/(?:chapter|chapters?|read|txt|article|novel\/chapters)\/(?:[^/?#]+\/)*\d+(?:\.html?)?\/?$/i;

const CHAPTER_LINK_TEXT_PATTERN =
  /第\s*[一二两三四五六七八九十○零百千万亿0-9]{1,9}\s*[章回卷节折篇幕集话話]|Chapter\s*\d+/i;

const NAV_LINK_TEXT_PATTERN = /(?:下一[章页]|上一[章页]|下一章|上一章|next|prev)/i;

function parseHttpUrl(url: string): URL | null {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u;
  } catch {
    return null;
  }
}

function getKindFromUrl(url: string): PageKind {
  const parsed = parseHttpUrl(url);
  if (!parsed) return 'other';

  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();

  // A terminal numeric chapter under an explicit reading path is more specific than
  // the broad `/chapters/` TOC marker used by some sites for both pages.
  if (CHAPTER_URL_TERMINAL_PATTERN.test(pathname)) {
    return 'chapter';
  }

  if (TOC_URL_PATTERN.test(pathname) || TOC_QUERY_PATTERN.test(search)) {
    return 'toc';
  }

  if (CHAPTER_URL_STRONG_PATTERN.test(pathname)) {
    return 'chapter';
  }

  return 'other';
}

function getKindFromTitle(title: string | null | undefined): PageKind {
  if (!title) return 'other';
  if (TOC_TITLE_PATTERN.test(title)) return 'toc';
  return 'other';
}

function getKindFromDom(doc: Document): PageKind {
  const body = doc.body;
  if (!body) return 'other';

  const titleKind = getKindFromTitle(doc.title);
  if (titleKind !== 'other') return titleKind;

  const anchors = Array.from(body.querySelectorAll('a[href]')) as HTMLAnchorElement[];

  let linkTextLength = 0;
  let chapterLikeLinkCount = 0;
  let navLinkCount = 0;

  for (const anchor of anchors) {
    const text = (anchor.textContent || '').trim();
    if (!text) continue;
    linkTextLength += text.length;
    if (CHAPTER_LINK_TEXT_PATTERN.test(text)) chapterLikeLinkCount++;
    if (NAV_LINK_TEXT_PATTERN.test(text)) navLinkCount++;
  }

  const totalTextLength = (body.textContent || '').length;
  const linkDensity = linkTextLength / Math.max(1, totalTextLength);
  const paragraphCount = body.querySelectorAll('p').length;

  // TOC pages usually contain many chapter links with high link-text density.
  if (chapterLikeLinkCount >= 25 && linkDensity >= 0.12) return 'toc';
  if (anchors.length >= 120 && chapterLikeLinkCount >= 15 && linkDensity >= 0.08) return 'toc';

  // Chapter pages usually contain long continuous text and low link density.
  if (
    navLinkCount > 0 &&
    totalTextLength >= 2000 &&
    chapterLikeLinkCount <= 12 &&
    linkDensity < 0.25
  ) {
    return 'chapter';
  }
  if (totalTextLength >= 8000 && chapterLikeLinkCount <= 12 && linkDensity < 0.25) return 'chapter';
  if (
    paragraphCount >= 8 &&
    totalTextLength >= 4000 &&
    chapterLikeLinkCount <= 12 &&
    linkDensity < 0.25
  ) {
    return 'chapter';
  }

  return 'other';
}

export function getPageKind(url: string, doc?: Document): PageKind {
  const kindFromUrl = getKindFromUrl(url);
  if (kindFromUrl !== 'other') return kindFromUrl;

  if (!doc) return 'other';
  return getKindFromDom(doc);
}

export function getPageKindFromUrl(url: string): PageKind {
  return getKindFromUrl(url);
}
