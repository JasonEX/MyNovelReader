/**
 * Reader Store Detection Functions
 * Detection utilities for VIP pages, TOC pages, and invalid URLs
 */

import { normalizeCiwemaoChapterUrl } from '@/core/utils';
import { normalizeTextForVipDetection } from './utils';

/**
 * Check if URL is invalid for chapter navigation (homepage, login, etc.)
 * This is a quick pre-fetch check to avoid loading non-chapter pages
 */
export function isInvalidChapterUrl(url: string, currentChapterUrl?: string): boolean {
  try {
    const normalizedUrl = normalizeCiwemaoChapterUrl(url);
    const parsed = new URL(normalizedUrl);
    const pathname = parsed.pathname;

    // Homepage/root path
    if (pathname === '/' || pathname === '') {
      return true;
    }

    // Very short paths are likely not chapter pages
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      // Some sites use single-segment chapter URLs, e.g.:
      // - Faloo: /412421_1.html
      // - Others: /123.html
      // If it doesn't contain digits, it's very likely not a chapter.
      const part = pathParts[0] || '';
      if (!/\d/.test(part)) {
        return true;
      }
    }

    // Common non-chapter URL patterns
    const invalidPatterns = [
      /^https?:\/\/[^/]+\/?$/i, // Root domain
      /^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php)?$/i, // Homepage variants
      /\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)\/?/i,
      /\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i, // Book index without chapter
      /\/(?:list|catalog|toc|contents?)\.?(?:html?)?$/i,
      /\/(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
      // Ciweimao: non-chapter endpoints under /chapter/
      /\/chapter\/get_par_tsu_list(?:$|[/?#])/i,
      /\/chapter\/ajax_get_session_code(?:$|[/?#])/i,
      /\/chapter\/get_book_chapter_detail_info(?:$|[/?#])/i,
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(normalizedUrl) || pattern.test(pathname)) {
        return true;
      }
    }

    // If current chapter URL is provided, check URL structure similarity
    if (currentChapterUrl) {
      const currentParsed = new URL(currentChapterUrl);
      const currentParts = currentParsed.pathname.split('/').filter(Boolean);

      // If current URL has significantly more path depth, target is likely not a chapter
      // e.g., current: /chapter/123/456, target: /book/123 -> invalid
      if (currentParts.length >= 3 && pathParts.length < currentParts.length - 1) {
        return true;
      }

      // Different domain/host -> invalid
      if (parsed.host !== currentParsed.host) {
        return true;
      }
    }

    return false;
  } catch {
    // URL parsing failed
    return false;
  }
}

/**
 * Detect if a fetched page is a VIP / locked chapter page.
 * Conservative heuristics to avoid false positives (e.g. "求订阅" in正文).
 */
export function isVipChapterPage(doc: Document): boolean {
  try {
    const url =
      (doc as Document & { _mnrUrl?: string })._mnrUrl || doc.location?.href || doc.baseURI || '';
    if (/^https?:\/\/(?:www|wap)\.ciweimao\.com\/chapter\/\d+/i.test(url)) {
      const hasChapterShell = !!doc.querySelector('#J_BookCnt, #J_BookRead');
      if (hasChapterShell) return false;
    }
  } catch {
    // Fall through to generic VIP detection.
  }

  const rawText = doc.body?.textContent || '';
  if (!rawText) return false;

  const text = normalizeTextForVipDetection(rawText);

  const patterns: RegExp[] = [
    /本章(?:为|是)?vip章节/,
    /(vip|付费|收费)(?:章节|内容)/,
    /(未订阅|未购买|未解锁).{0,10}(本章|本章节|章节|内容)/,
    /(本章|本章节|章节|内容).{0,12}(?:已)?锁定/,
    /(本章|本章节|章节|内容).{0,12}(?:需|需要).{0,6}(订阅|购买|付费|解锁)/,
    /(订阅|购买|付费|解锁).{0,12}(后|即可|才能|方可|才可).{0,12}(阅读|查看|继续阅读|继续查看)/,
    /(请|需).{0,6}(订阅|购买|付费|解锁).{0,12}(阅读|查看|继续阅读|继续查看)/,
    /立即(订阅|购买|解锁|充值)/,
    /(订阅|购买|解锁)本章/,
  ];

  if (patterns.some(re => re.test(text))) return true;

  // Extra: check common CTA buttons (helps when正文很短且关键字分散在按钮上)
  const ctaText = Array.from(
    doc.querySelectorAll('a,button,input[type="button"],input[type="submit"]')
  )
    .map(el => {
      if (el instanceof HTMLInputElement) return el.value || '';
      return el.textContent || '';
    })
    .join(' ');
  const cta = normalizeTextForVipDetection(ctaText);
  if (/立即(订阅|购买|解锁|充值)/.test(cta) && /(vip|付费|订阅|购买|解锁|锁定)/.test(text)) {
    return true;
  }

  return false;
}

/**
 * Detect if content looks like a Table of Contents page
 * Uses multiple heuristics to identify TOC pages
 */
export function detectTocPage(
  content: string,
  pageUrl: string,
  currentChapterUrl: string
): boolean {
  // Heuristic 0: URL pattern suggests index/book page
  const tocUrlPatterns = [
    /\/book\/\d+\.html?$/i,
    /\/book\/\d+\/?$/i,
    /\/novel\/\d+\/?$/i,
    /\/xiaoshuo\/\d+\/?$/i,
    /\/info\/\d+\.html?$/i,
    /\/\d+\/index\.html?$/i,
    /\/booklist/i,
    /\/catalog/i,
    /\/contents?\.html?$/i,
    /\/list\.html?$/i,
    /\/toc\.html?$/i,
  ];

  for (const pattern of tocUrlPatterns) {
    if (pattern.test(pageUrl)) {
      return true;
    }
  }

  // Heuristic 0.5: Compare URL structures
  try {
    const currentPath = new URL(currentChapterUrl).pathname;
    const pagePath = new URL(pageUrl).pathname;

    const chapterPattern = /\/(txt|read|chapter|article)\/\d+\/\d+/i;
    const bookPattern = /\/(book|novel|info|xiaoshuo)\/\d+/i;

    if (chapterPattern.test(currentPath) && bookPattern.test(pagePath)) {
      return true;
    }
  } catch {
    // URL parsing failed, continue with other checks
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const textContent = tempDiv.textContent || '';
  const textLength = textContent.length;
  const links = tempDiv.querySelectorAll('a');
  const linkCount = links.length;

  // Heuristic 1: Very short content with many links
  if (textLength < 500 && linkCount > 10) {
    return true;
  }

  // Heuristic 2: High link-to-text ratio
  const linkTextLength = Array.from(links).reduce(
    (sum, a) => sum + (a.textContent?.length || 0),
    0
  );
  const linkRatio = textLength > 0 ? linkTextLength / textLength : 0;
  if (linkRatio > 0.6 && linkCount > 8) {
    return true;
  }

  // Heuristic 3: Many links pointing to chapter-like URLs
  const chapterLinkPattern =
    /\/(chapter|txt|read|book|novel|article)\/|\d+\.html?$|\/xs_[^/]+\/\d+\/\d+(?:\/\d+)?/i;
  const chapterLinks = Array.from(links).filter(a => {
    const href = a.getAttribute('href') || '';
    return chapterLinkPattern.test(href);
  });
  if (chapterLinks.length > 10) {
    return true;
  }

  // Heuristic 4: Contains link to the current chapter
  const normalizeUrlLocal = (url: string) => {
    try {
      const u = new URL(url, pageUrl);
      return u.pathname.replace(/\/$/, '');
    } catch {
      return url.replace(/\/$/, '');
    }
  };
  const currentPath = normalizeUrlLocal(currentChapterUrl);
  const hasLinkToCurrentChapter = Array.from(links).some(a => {
    const href = a.getAttribute('href');
    if (!href) return false;
    return normalizeUrlLocal(href) === currentPath;
  });
  if (hasLinkToCurrentChapter && linkCount > 5) {
    return true;
  }

  // Heuristic 5: Title/content contains TOC-related keywords
  const tocKeywords = [
    '目录',
    '章节列表',
    '章节目录',
    '全部章节',
    '最新章节',
    '小说目录',
    'table of contents',
    'toc',
    'catalog',
    'index',
  ];
  const pageText = textContent.toLowerCase();
  const keywordMatches = tocKeywords.filter(kw => pageText.includes(kw.toLowerCase()));
  if (keywordMatches.length >= 2 || (keywordMatches.length >= 1 && linkCount > 15)) {
    return true;
  }

  // Heuristic 6: Content is structured like a list
  const linkTexts = Array.from(links)
    .map(a => a.textContent?.trim() || '')
    .filter(t => t.length > 0);
  const chapterNamePattern = /^第.{1,10}[章节回话篇集卷]/;
  const chapterNameLinks = linkTexts.filter(t => chapterNamePattern.test(t));
  if (chapterNameLinks.length > 5) {
    return true;
  }

  return false;
}
