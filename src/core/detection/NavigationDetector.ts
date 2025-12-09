/**
 * NavigationDetector - Detect prev/next/index navigation links
 * Also detects multi-page chapters (分页章节)
 */

import { NAV_PATTERNS, NavigationResult, NavLinkResult, SectionDetectionResult } from './types';

/** URLs to ignore as navigation links */
const INVALID_URL_PATTERNS = [
  /(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
  /^javascript:/i,
  /BuyChapterUnLogin/i,
  /\/0\.html$/i,
];

/** Section URL patterns - indicates multi-page chapter */
const _SECTION_URL_PATTERNS = [
  /\/\d+[_-]\d+\.html?$/i, // /123_2.html or /123-2.html
  /\/\d+\/\d+\.html?$/i, // /123/2.html
  /[_-]\d+\.html?$/i, // anything_2.html
];

/** Section link text patterns - "页" indicates section, "章" indicates chapter */
const SECTION_TEXT_PATTERNS = [
  /[下上]一?页/, // 下一页, 上一页
  /[下上]一?頁/, // 繁体
  /第\d+页/, // 第2页
  /\(\d+\/\d+\)/, // (2/5) 分页指示
];

/** Chapter link text patterns - indicates real chapter navigation */
const CHAPTER_TEXT_PATTERNS = [
  /[下上]一?章/, // 下一章, 上一章
  /[下上]一?节/, // 下一节
  /第.+章/, // 第X章
];

export class NavigationDetector {
  /**
   * Detect all navigation links in the document
   */
  detect(doc: Document): NavigationResult {
    return {
      next: this.findNavLink(doc, 'next'),
      prev: this.findNavLink(doc, 'prev'),
      index: this.findNavLink(doc, 'index'),
    };
  }

  /**
   * Find a specific navigation link
   */
  private findNavLink(doc: Document, type: 'next' | 'prev' | 'index'): NavLinkResult | null {
    const patterns = NAV_PATTERNS[type];

    // Strategy 1: rel attribute (highest confidence)
    if (type !== 'index') {
      const relLink = doc.querySelector(`a[rel="${type}"]`);
      if (relLink && this.isValidLink(relLink as HTMLAnchorElement)) {
        return {
          element: relLink as HTMLAnchorElement,
          url: (relLink as HTMLAnchorElement).href,
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
    }> = [];

    for (const link of links) {
      const anchor = link as HTMLAnchorElement;
      const text = anchor.textContent?.trim() || '';

      // Skip invalid hrefs
      if (!this.isValidLink(anchor)) continue;

      // Score based on text matching
      let score = 0;
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          score += 10;
          // Exact/short match bonus
          if (text.length <= 5) score += 5;
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
        candidates.push({ element: anchor, score, text });
      }
    }

    if (candidates.length === 0) return null;

    // Sort by score and return best
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    return {
      element: best.element,
      url: best.element.href,
      confidence: Math.min(best.score / 15, 0.9),
      method: 'text-matching',
      text: best.text,
    };
  }

  /**
   * Check if a link is valid for navigation
   */
  private isValidLink(anchor: HTMLAnchorElement): boolean {
    const href = anchor.href;

    // Must have href
    if (!href) return false;

    // Skip javascript: links
    if (href.startsWith('javascript:')) return false;

    // Skip invalid URL patterns
    for (const pattern of INVALID_URL_PATTERNS) {
      if (pattern.test(href)) return false;
    }

    // Skip anchor-only links (unless they contain chapter info)
    if (href.includes('#') && !href.includes('#chapter')) {
      const url = new URL(href);
      if (url.pathname === window.location.pathname) {
        return false;
      }
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
        // "下一页" type link - this is a section navigation
        result.isSection = true;
        result.nextSectionUrl = navigation.next.url;
        result.confidence = Math.max(result.confidence, 0.9);
        result.method = 'link-text';
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
        result.isSection = true;
        result.confidence = Math.max(result.confidence, 0.85);
        result.method = 'link-text';
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
   * Returns { chapter, section } or null
   */
  private extractSectionFromUrl(url: string): { chapter: number; section: number } | null {
    // Pattern: /123_2.html -> chapter 123, section 2
    const patterns = [/\/(\d+)[_-](\d+)\.html?$/i, /\/(\d+)\/(\d+)\.html?$/i];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const section = parseInt(match[2], 10);
        // Section number > 1 indicates this is not the first page
        if (section > 1) {
          return {
            chapter: parseInt(match[1], 10),
            section,
          };
        }
      }
    }

    return null;
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

      // Pattern 1: /123.html -> /123_2.html (first page to second page)
      const firstPageMatch = currentPath.match(/\/(\d+)\.html?$/i);
      const secondPageMatch = nextPath.match(/\/(\d+)[_-]2\.html?$/i);
      if (firstPageMatch && secondPageMatch && firstPageMatch[1] === secondPageMatch[1]) {
        return { isSection: true, confidence: 0.9 };
      }

      // Pattern 2: /123_2.html -> /123_3.html (consecutive sections)
      const sectionMatch1 = currentPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
      const sectionMatch2 = nextPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
      if (sectionMatch1 && sectionMatch2) {
        if (sectionMatch1[1] === sectionMatch2[1]) {
          const s1 = parseInt(sectionMatch1[2], 10);
          const s2 = parseInt(sectionMatch2[2], 10);
          if (s2 === s1 + 1) {
            return { isSection: true, confidence: 0.95 };
          }
        }
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

  /**
   * Try to find the next chapter URL (skipping remaining sections)
   */
  private findNextChapterUrl(
    doc: Document,
    currentUrl: string,
    _navigation: NavigationResult
  ): string | null {
    // Look for links with "下一章" text
    const links = doc.querySelectorAll('a[href]');

    for (const link of links) {
      const anchor = link as HTMLAnchorElement;
      const text = anchor.textContent?.trim() || '';

      // Must match chapter pattern, not section pattern
      const isChapter = CHAPTER_TEXT_PATTERNS.some(p => p.test(text));
      const isSection = SECTION_TEXT_PATTERNS.some(p => p.test(text));

      if (isChapter && !isSection && this.isValidLink(anchor)) {
        // Verify it's a different chapter, not the same chapter's section
        const comparison = this.compareUrlsForSection(currentUrl, anchor.href);
        if (!comparison.isSection) {
          return anchor.href;
        }
      }
    }

    return null;
  }
}
