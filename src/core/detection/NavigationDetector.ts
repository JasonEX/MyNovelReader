/**
 * NavigationDetector - Detect prev/next/index navigation links
 * Also detects multi-page chapters (分页章节)
 */

import { CHAPTER_TEXT_PATTERNS, SECTION_TEXT_PATTERNS } from '@/core/constants';
import { generateCssSelector, isSectionLikeUrl } from '@/core/utils';
import { NAV_PATTERNS, NavigationResult, NavLinkResult, SectionDetectionResult } from './types';
import { parseChapterSectionFromPathname } from '@/core/utils/sectionPath';

/** URLs to ignore as navigation links */
const INVALID_URL_PATTERNS = [
  /(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
  /^javascript:/i,
  /BuyChapterUnLogin/i,
  /\/0\.html$/i,
  // Ciweimao: non-chapter endpoints under /chapter/
  /\/chapter\/get_par_tsu_list(?:$|[/?#])/i,
  /\/chapter\/ajax_get_session_code(?:$|[/?#])/i,
  /\/chapter\/get_book_chapter_detail_info(?:$|[/?#])/i,
  // Homepage/root path patterns
  /^https?:\/\/[^/]+\/?$/i, // Root domain only (e.g., https://www.qidian.com/)
  /^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php|aspx)?$/i, // /index.html, /home.php
  /^https?:\/\/[^/]+\/\?/i, // Root with query string (e.g., https://example.com/?ref=xxx)
];

export class NavigationDetector {
  private resolveBaseUrl(doc: Document, currentUrl?: string): string {
    const candidates: Array<string | undefined> = [
      currentUrl,
      doc.location?.href,
      (doc as Document & { _mnrUrl?: string })._mnrUrl,
      typeof window !== 'undefined' ? window.location.href : undefined,
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      try {
        const u = new URL(candidate);
        if (u.protocol === 'http:' || u.protocol === 'https:') {
          return u.toString();
        }
      } catch {
        // ignore
      }
    }

    return candidates.find(Boolean) || '';
  }

  private resolveLinkUrl(anchor: HTMLAnchorElement, baseUrl: string): string | null {
    const rawHref = anchor.getAttribute('href');
    if (!rawHref) return null;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawHref, baseUrl);
    } catch {
      return null;
    }

    // Only allow http(s) navigation targets.
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }

    return parsedUrl.toString();
  }

  /**
   * Detect all navigation links in the document
   */
  detect(doc: Document, currentUrl?: string): NavigationResult {
    const resolvedCurrentUrl = this.resolveBaseUrl(doc, currentUrl);
    return {
      next: this.findNavLink(doc, 'next', resolvedCurrentUrl),
      prev: this.findNavLink(doc, 'prev', resolvedCurrentUrl),
      index: this.findNavLink(doc, 'index', resolvedCurrentUrl),
    };
  }

  /**
   * Find a specific navigation link
   */
  private findNavLink(
    doc: Document,
    type: 'next' | 'prev' | 'index',
    currentUrl: string
  ): NavLinkResult | null {
    const patterns = NAV_PATTERNS[type];

    // Strategy 1: rel attribute (highest confidence)
    if (type !== 'index') {
      const relLink = doc.querySelector(`a[rel="${type}"]`);
      const href = relLink ? this.resolveLinkUrl(relLink as HTMLAnchorElement, currentUrl) : null;
      if (
        relLink &&
        href &&
        this.isValidLink(relLink as HTMLAnchorElement, type, currentUrl, href)
      ) {
        return {
          element: relLink as HTMLAnchorElement,
          url: href,
          selector: this.generateSelector(relLink as HTMLAnchorElement),
          confidence: 0.95,
          method: 'rel-attribute',
          text: relLink.textContent?.trim(),
        };
      }
    }

    // Strategy 2: Text matching
    const links = doc.querySelectorAll('a[href]');
    const candidates: Array<{
      element: HTMLAnchorElement;
      score: number;
      text: string;
      href: string;
    }> = [];

    for (const link of links) {
      const anchor = link as HTMLAnchorElement;
      const text = anchor.textContent?.trim() || '';
      const href = this.resolveLinkUrl(anchor, currentUrl);

      // Skip invalid hrefs
      if (!href || !this.isValidLink(anchor, type, currentUrl, href)) continue;

      // Score based on text matching
      let score = 0;
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          score += 10;
          // Exact/short match bonus
          if (text.length <= 5) score += 5;
        }
      }

      // Prefer real chapter navigation over section pagination when both exist.
      // This keeps "下一章/上一章" higher than "下一页/上一页" for next/prev detection.
      if (type === 'next' || type === 'prev') {
        const isChapter = CHAPTER_TEXT_PATTERNS.some(p => p.test(text));
        const isSection = SECTION_TEXT_PATTERNS.some(p => p.test(text));
        if (isChapter) score += 3;
        if (isSection && !isChapter) score -= 2;
      }

      // For index links, also recognize book title links (wrapped in 《》)
      // Many sites use book title as the index/catalog link
      if (type === 'index') {
        // Book title pattern: 《书名》
        if (/^《.+》$/.test(text)) {
          score += 8;
        }
        // URL points to directory (ends with / or is index.html)
        const href = anchor.href;
        if (href.endsWith('/') || /\/index\.html?$/i.test(href)) {
          score += 3;
        }
      }

      // Check title attribute too
      const title = anchor.title || '';
      for (const pattern of patterns) {
        if (pattern.test(title)) {
          score += 5;
        }
      }

      // Position bonus (nav links often at top/bottom of page)
      try {
        const rect = anchor.getBoundingClientRect();
        if (rect.top < 300 || rect.top > document.documentElement.scrollHeight - 300) {
          score += 2;
        }
      } catch {
        // getBoundingClientRect may fail in some contexts
      }

      // Penalty for long text (likely not a nav link)
      if (text.length > 20) {
        score -= 5;
      }

      if (score > 0) {
        candidates.push({ element: anchor, score, text, href });
      }
    }

    if (candidates.length === 0) return null;

    // Sort by score and return best
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    return {
      element: best.element,
      url: best.href,
      selector: this.generateSelector(best.element),
      confidence: Math.min(best.score / 15, 0.9),
      method: 'text-matching',
      text: best.text,
    };
  }

  /**
   * Check if a link is valid for navigation
   */
  private isValidLink(
    anchor: HTMLAnchorElement,
    purpose: 'next' | 'prev' | 'index',
    currentUrl: string,
    href: string
  ): boolean {
    const text = anchor.textContent?.trim() || '';

    // Must have href
    if (!href) return false;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(href);
    } catch {
      return false;
    }

    // Only allow http(s) navigation targets.
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }

    // Skip invalid URL patterns
    // NOTE: index/list URLs are often valid *for目录页*; don't filter them for index purpose.
    for (const pattern of INVALID_URL_PATTERNS) {
      if (pattern.test(href)) {
        if (purpose === 'index') {
          // If link text looks like directory or book title, allow list/index pages.
          const looksLikeIndex = NAV_PATTERNS.index.some(p => p.test(text));
          const looksLikeBookTitle = /^《.+》$/.test(text);
          if (looksLikeIndex || looksLikeBookTitle) continue;
        }
        return false;
      }
    }

    // Skip anchor-only links (unless they contain chapter info)
    if (href.includes('#') && !href.includes('#chapter')) {
      try {
        const currentPathname = new URL(currentUrl).pathname;
        if (parsedUrl.pathname === currentPathname) {
          return false;
        }
      } catch {
        // If URL parsing fails, fall through and treat as potentially valid.
      }
    }

    // Skip URLs that are clearly not chapter pages
    try {
      const pathname = parsedUrl.pathname;

      // Skip if pathname is too short (likely homepage or section page)
      // But allow for index purpose if it looks like a book directory
      if (pathname === '/' || pathname.length < 3) {
        // For index links, allow directory paths like /book3/7748/
        if (purpose === 'index' && pathname.length >= 3) {
          // Allow if it looks like a book title link
          const looksLikeBookTitle = /^《.+》$/.test(text);
          if (looksLikeBookTitle) {
            return true;
          }
        }
        return false;
      }

      // 如果只有一个路径部分，检查是否像章节 URL
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length < 2) {
        // 单路径部分：必须包含数字才可能是章节
        // 允许: /412421_1.html, /123.html, /chapter123
        // 排除: /book, /novel, /index.html (无数字)
        const part = pathParts[0] || '';
        if (!/\d/.test(part)) {
          // Some sites use slug-like chapter URLs without digits (e.g. /next.html).
          // Allow them only when link text strongly indicates navigation purpose.
          const looksLikeNav =
            NAV_PATTERNS[purpose].some(p => p.test(text)) ||
            CHAPTER_TEXT_PATTERNS.some(p => p.test(text)) ||
            SECTION_TEXT_PATTERNS.some(p => p.test(text));

          if (!looksLikeNav) {
            return false;
          }
        }
      }

      // For index purpose, allow directory paths (ending with /)
      if (purpose === 'index' && pathname.endsWith('/')) {
        return true;
      }

      // Skip common non-chapter paths
      const nonChapterPaths = [
        /^\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)/i,
        /^\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i, // /book/ or /book/123/ without chapter
      ];
      for (const pattern of nonChapterPaths) {
        if (pattern.test(pathname)) return false;
      }
    } catch {
      // URL parsing failed, continue
    }

    return true;
  }

  /**
   * Validate navigation by comparing URLs
   * Useful to ensure next/prev links follow expected pattern
   */
  validateNavigation(currentUrl: string, navigation: NavigationResult): NavigationResult {
    // Extract chapter number from current URL if possible
    const currentNum = this.extractChapterNumber(currentUrl);
    if (currentNum === null) return navigation;

    // Validate next link
    if (navigation.next) {
      const nextNum = this.extractChapterNumber(navigation.next.url);
      if (nextNum !== null && nextNum !== currentNum + 1) {
        // Reduce confidence if chapter numbers don't match expected pattern
        navigation.next.confidence *= 0.7;
      }
    }

    // Validate prev link
    if (navigation.prev) {
      const prevNum = this.extractChapterNumber(navigation.prev.url);
      if (prevNum !== null && prevNum !== currentNum - 1) {
        navigation.prev.confidence *= 0.7;
      }
    }

    return navigation;
  }

  /**
   * Try to extract chapter number from URL
   */
  private extractChapterNumber(url: string): number | null {
    // Common patterns: /123.html, /chapter/123, /123_456.html
    const patterns = [
      /\/(\d+)\.html?$/i,
      /\/chapter\/(\d+)/i,
      /\/(\d+)_\d+\.html?$/i,
      /_(\d+)\.html?$/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return null;
  }

  /**
   * Detect if current page is part of a multi-page chapter (分页章节)
   * This enables automatic section merging without manual rule configuration
   */
  detectSection(
    doc: Document,
    currentUrl: string,
    navigation: NavigationResult
  ): SectionDetectionResult {
    const result: SectionDetectionResult = {
      isSection: false,
      currentSection: null,
      nextSectionUrl: null,
      nextChapterUrl: null,
      confidence: 0,
      method: 'none',
    };

    // Strategy 1: Check current URL pattern
    const urlSectionInfo = this.extractSectionFromUrl(currentUrl);
    if (urlSectionInfo) {
      result.isSection = true;
      result.currentSection = urlSectionInfo.section;
      result.confidence = 0.8;
      result.method = 'url-pattern';
    }

    // Strategy 2: Check navigation link text
    if (navigation.next) {
      const nextText = navigation.next.text || '';
      const isNextSection = SECTION_TEXT_PATTERNS.some(p => p.test(nextText));
      const isNextChapter = CHAPTER_TEXT_PATTERNS.some(p => p.test(nextText));

      if (isNextSection && !isNextChapter) {
        const nextUrl = navigation.next.url;
        const comparison = this.compareUrlsForSection(currentUrl, nextUrl);
        if (comparison.isSection) {
          // "下一页" type link - this is a section navigation within the same chapter
          result.isSection = true;
          result.nextSectionUrl = nextUrl;
          result.confidence = Math.max(result.confidence, 0.9);
          result.method = 'link-text';
        } else {
          // Some templates use "下一页" as cross-chapter navigation (上一页/下一页 across chapters).
          // Treat it as next chapter candidate, not a section page.
          result.nextChapterUrl = result.nextChapterUrl || nextUrl;
        }
      } else if (isNextChapter) {
        // "下一章" type link - this is chapter navigation
        result.nextChapterUrl = navigation.next.url;
      }
    }

    // Strategy 3: Compare current URL with next URL pattern
    if (navigation.next && !result.isSection) {
      const nextUrl = navigation.next.url;
      const comparison = this.compareUrlsForSection(currentUrl, nextUrl);

      if (comparison.isSection) {
        result.isSection = true;
        result.nextSectionUrl = nextUrl;
        result.confidence = Math.max(result.confidence, comparison.confidence);
        result.method = 'url-comparison';
      }
    }

    // Strategy 4: Check prev link for section indicators
    if (navigation.prev && !result.isSection) {
      const prevText = navigation.prev.text || '';
      const isPrevSection = SECTION_TEXT_PATTERNS.some(p => p.test(prevText));

      if (isPrevSection) {
        const prevUrl = navigation.prev.url;
        // Validate it's the previous section within the same chapter.
        // compareUrlsForSection expects current->next, so use prev as current and currentUrl as next.
        const comparison = this.compareUrlsForSection(prevUrl, currentUrl);
        if (comparison.isSection) {
          result.isSection = true;
          result.currentSection = this.extractSectionFromUrl(currentUrl)?.section ?? null;
          result.confidence = Math.max(result.confidence, 0.85);
          result.method = 'link-text';
        }
      }
    }

    // Strategy 5: Even if navigation.next prefers "下一章", still try to find an explicit "下一页" link.
    // Some templates show both links, and we must not stop merging early.
    if (!result.nextSectionUrl) {
      const nextSectionUrl = this.findNextSectionUrl(doc, currentUrl);
      if (nextSectionUrl) {
        result.isSection = true;
        result.nextSectionUrl = nextSectionUrl;
        result.confidence = Math.max(result.confidence, 0.9);
        if (result.method === 'none') result.method = 'link-text';
      }
    }

    // If we detected a section but don't have nextChapterUrl, try to find it
    if (result.isSection && !result.nextChapterUrl) {
      result.nextChapterUrl = this.findNextChapterUrl(doc, currentUrl, navigation);
    }

    return result;
  }

  /**
   * Extract section number from URL
   * Returns { section } or null
   */
  private extractSectionFromUrl(url: string): { section: number } | null {
    try {
      const parsed = new URL(url);
      const info = parseChapterSectionFromPathname(parsed.pathname);
      if (!info) return null;
      if (info.section > 1) {
        return { section: info.section };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Compare two URLs to detect section relationship
   */
  private compareUrlsForSection(
    currentUrl: string,
    nextUrl: string
  ): { isSection: boolean; confidence: number } {
    try {
      const current = new URL(currentUrl);
      const next = new URL(nextUrl);

      // Must be same host
      if (current.host !== next.host) {
        return { isSection: false, confidence: 0 };
      }

      const currentPath = current.pathname;
      const nextPath = next.pathname;

      // Fast path: strict section-like detection (includes query-based pagination).
      if (isSectionLikeUrl(currentUrl, nextUrl)) {
        const currentInfo = parseChapterSectionFromPathname(currentPath);
        const nextInfo = parseChapterSectionFromPathname(nextPath);
        if (
          currentInfo &&
          nextInfo &&
          currentInfo.chapterKey === nextInfo.chapterKey &&
          nextInfo.section === currentInfo.section + 1 &&
          nextInfo.section > 1
        ) {
          return { isSection: true, confidence: 0.95 };
        }

        // Query-based (or non-path) pagination: reliable enough but slightly lower confidence.
        return { isSection: true, confidence: 0.85 };
      }

      const currentInfo = parseChapterSectionFromPathname(currentPath);
      const nextInfo = parseChapterSectionFromPathname(nextPath);
      if (currentInfo && nextInfo && currentInfo.chapterKey !== nextInfo.chapterKey) {
        // Different chapter => not a section transition; avoid similarity false positives like /123.html -> /999.html.
        return { isSection: false, confidence: 0 };
      }

      // Pattern 3: URLs are very similar except for a number
      const similarity = this.calculateUrlSimilarity(currentPath, nextPath);
      if (similarity > 0.8) {
        return { isSection: true, confidence: similarity * 0.7 };
      }

      return { isSection: false, confidence: 0 };
    } catch {
      return { isSection: false, confidence: 0 };
    }
  }

  /**
   * Calculate similarity between two URL paths
   */
  private calculateUrlSimilarity(path1: string, path2: string): number {
    // Remove numbers and compare structure
    const normalize = (p: string) => p.replace(/\d+/g, '#');
    const n1 = normalize(path1);
    const n2 = normalize(path2);

    if (n1 === n2) return 1.0;
    if (n1.length === 0 || n2.length === 0) return 0;

    // Simple character-based similarity
    const longer = n1.length > n2.length ? n1 : n2;
    const shorter = n1.length > n2.length ? n2 : n1;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (shorter[i] === longer[i]) matches++;
    }

    return matches / longer.length;
  }

  private findNextSectionUrl(doc: Document, currentUrl: string): string | null {
    const links = Array.from(doc.querySelectorAll('a[href]')) as HTMLAnchorElement[];

    const normalizeText = (text: string): string => text.replace(/\s+/g, '').trim();
    const isNextSectionText = (text: string): boolean => {
      const t = normalizeText(text);
      if (!t) return false;
      // Only accept forward paging labels ("下一页/下页"), avoid picking "上一页".
      if (
        t.includes('下一页') ||
        t.includes('下页') ||
        t.includes('下一頁') ||
        t.includes('下頁')
      ) {
        return true;
      }
      // Conservative English fallback
      if (t.toLowerCase().includes('next') && !t.toLowerCase().includes('chapter')) {
        return true;
      }
      return false;
    };

    const candidates: Array<{ url: string; score: number }> = [];
    for (const a of links) {
      const text = (a.textContent || '').trim();
      if (!text) continue;

      const href = this.resolveLinkUrl(a, currentUrl);
      if (!href) continue;

      const isSection = SECTION_TEXT_PATTERNS.some(p => p.test(text));
      const isChapter = CHAPTER_TEXT_PATTERNS.some(p => p.test(text));
      if (!isSection || isChapter) continue;
      if (!isNextSectionText(text)) continue;
      if (!this.isValidLink(a, 'next', currentUrl, href)) continue;

      const comparison = this.compareUrlsForSection(currentUrl, href);
      if (!comparison.isSection) continue;

      let score = 50;
      if (text.length <= 5) score += 5;
      const rel = (a.getAttribute('rel') || '').toLowerCase();
      if (rel.includes('next')) score += 5;
      if (a.closest('.pager, .pagination, .page, nav, footer')) score += 2;
      score += Math.round(comparison.confidence * 10);

      candidates.push({ url: href, score });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].url;
  }

  /**
   * Try to find the next chapter URL (skipping remaining sections)
   */
  private findNextChapterUrl(
    doc: Document,
    currentUrl: string,
    _navigation: NavigationResult
  ): string | null {
    // Look for links with "下一章/下一节/后一章/next" text (forward only)
    const links = doc.querySelectorAll('a[href]');

    for (const link of links) {
      const anchor = link as HTMLAnchorElement;
      const text = anchor.textContent?.trim() || '';
      const href = this.resolveLinkUrl(anchor, currentUrl);
      if (!href) continue;
      const normalizedText = text.replace(/\s+/g, '').trim();
      const isForward =
        /下一/.test(normalizedText) ||
        /下[章节篇话]/.test(normalizedText) ||
        /后一章/.test(normalizedText) ||
        /next/i.test(normalizedText);
      if (!isForward) continue;

      // Must match chapter pattern, not section pattern
      const isChapter = CHAPTER_TEXT_PATTERNS.some(p => p.test(text));
      const isSection = SECTION_TEXT_PATTERNS.some(p => p.test(text));

      if (isChapter && !isSection && this.isValidLink(anchor, 'next', currentUrl, href)) {
        // Verify it's a different chapter, not the same chapter's section
        const comparison = this.compareUrlsForSection(currentUrl, href);
        if (!comparison.isSection) {
          return href;
        }
      }
    }

    return null;
  }

  /**
   * Generate a CSS selector for a link element
   */
  private generateSelector(element: Element): string {
    return generateCssSelector(element);
  }
}
