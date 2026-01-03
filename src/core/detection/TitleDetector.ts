/**
 * TitleDetector - Detect chapter and book titles
 */

import { TITLE_PATTERN, TitleResult } from './types';
import { cssEscape } from '@/core/utils';

/** Known title selectors from existing codebase */
const KNOWN_TITLE_SELECTORS = [
  'h1.chapter-title',
  'h1.chapter_title',
  '.chapter-title',
  '.chapter_title',
  '.bookname h1',
  'h1.title',
  '.title h1',
  '#chapter_title',
  '.readtitle h1',
  'article h1',
  'h1',
];

/** Known book title selectors */
const KNOWN_BOOK_TITLE_SELECTORS = [
  '.bookname',
  '.book-title',
  '.book_title',
  '.book-name',
  '.book_name',
  '.bookinfo h1',
  '.bookinfo h2',
  '#bookname',
  '#book-info h1',
  '#book-info h2',
  '#info h1',
  '#info h2',
  '.novel-title',
  'h2.title',
  '.layout-tit a[title]',
  '.breadcrumb a:last-of-type',
  '.chapter-nav a:last-of-type',
  '.booknav a:first-of-type',
];

/** Patterns to clean up title text */
const TITLE_CLEANUP_PATTERNS = [
  /^章节目录/,
  /^文章正文/,
  /^正文卷?/,
  /全文免费阅读$/,
  /最新章节$/,
  /[（(]\s*\d+\s*[/／]\s*\d+\s*[）)]\s*$/, // (1/3) pagination suffix
  /\(文\)$/,
  /_.*$/, // Remove trailing "_sitename"
  /-.*小说.*$/i,
];

export class TitleDetector {
  /**
   * Detect chapter and book titles
   */
  detect(doc: Document): TitleResult {
    // Try multiple strategies
    const results = [
      this.detectFromSelector(doc),
      this.detectFromDocumentTitle(doc),
      this.detectFromHeadings(doc),
    ].filter(Boolean) as TitleResult[];

    // Return the result with highest confidence
    if (results.length === 0) {
      return this.createEmptyResult();
    }

    results.sort((a, b) => b.confidence - a.confidence);
    const best = results[0];

    // Also try to detect book title
    const bookTitle = this.detectBookTitle(doc);
    if (bookTitle) {
      best.bookTitle = bookTitle;
    }

    return best;
  }

  /**
   * Detect title using known selectors
   */
  private detectFromSelector(doc: Document): TitleResult | null {
    for (const selector of KNOWN_TITLE_SELECTORS) {
      try {
        const el = doc.querySelector(selector);
        if (el) {
          const text = this.cleanTitle(el.textContent || '');
          if (this.isValidTitle(text)) {
            return {
              chapterTitle: text,
              selector,
              confidence: 0.9,
              method: 'selector',
            };
          }
        }
      } catch {
        continue;
      }
    }
    return null;
  }

  /**
   * Detect title from document.title
   */
  private detectFromDocumentTitle(doc: Document): TitleResult | null {
    const docTitle = doc.title;
    if (!docTitle) return null;

    // Try to extract chapter title using pattern
    const match = docTitle.match(TITLE_PATTERN);
    if (match) {
      // Find the chapter part
      const parts = docTitle.split(/[-_|,，]/).map(s => s.trim());
      for (const part of parts) {
        if (TITLE_PATTERN.test(part)) {
          const cleaned = this.cleanTitle(part);
          if (this.isValidTitle(cleaned)) {
            return {
              chapterTitle: cleaned,
              confidence: 0.7,
              method: 'document-title',
            };
          }
        }
      }
    }

    // Fallback: use first part of document title
    const firstPart = docTitle.split(/[-_|,，]/)[0].trim();
    const cleaned = this.cleanTitle(firstPart);
    if (this.isValidTitle(cleaned)) {
      return {
        chapterTitle: cleaned,
        confidence: 0.5,
        method: 'document-title',
      };
    }

    return null;
  }

  /**
   * Detect title from h1/h2 headings
   */
  private detectFromHeadings(doc: Document): TitleResult | null {
    // Try h1 first
    const h1s = doc.querySelectorAll('h1');
    for (const h1 of Array.from(h1s)) {
      const text = this.cleanTitle(h1.textContent || '');
      if (this.isValidTitle(text) && TITLE_PATTERN.test(text)) {
        return {
          chapterTitle: text,
          selector: this.generateSelector(h1),
          confidence: 0.8,
          method: 'heading',
        };
      }
    }

    // Try h2 if no valid h1 found
    const h2s = doc.querySelectorAll('h2');
    for (const h2 of Array.from(h2s)) {
      const text = this.cleanTitle(h2.textContent || '');
      if (this.isValidTitle(text) && TITLE_PATTERN.test(text)) {
        return {
          chapterTitle: text,
          selector: this.generateSelector(h2),
          confidence: 0.7,
          method: 'heading',
        };
      }
    }

    return null;
  }

  /**
   * Detect book title
   */
  private detectBookTitle(doc: Document): string | undefined {
    const genericLabelPattern =
      /^(?:首页|主页|home|index|返回|返回目录|目录|章节目录|章節目錄|章节列表|章節列表|章节|章節|最新章节|最新章節|正文|内容|內容|简介|簡介|作品信息|书籍信息|書籍信息|小说|小說|阅读|閱讀|catalog|toc|contents?)$/i;
    const breadcrumbIgnorePattern =
      /^(?:首页|主页|home|index|返回|返回目录|目录|章节目录|章節目錄|章节列表|章節列表|章节|章節)$/i;
    const isValidBookTitle = (text: string): boolean => {
      if (!text || text.length < 2 || text.length > 100) return false;
      if (TITLE_PATTERN.test(text)) return false;
      if (genericLabelPattern.test(text.trim())) return false;
      const normalized = text.replace(/\s+/g, '').toLowerCase();
      if (normalized.includes('天天看小说') || normalized.includes('天天看小說')) return false;
      const siteWords = [
        '起点中文网',
        '起点中文網',
        '顶点小说',
        '頂點小說',
        '笔趣阁',
        '筆趣閣',
        '小说网',
        '小說網',
        '小说阅读网',
        '小說閱讀網',
        '小说阅读',
        '小說閱讀',
        '阅读网',
        '閱讀網',
        '书吧',
        '書吧',
        '69书吧',
        '69書吧',
      ];
      if (siteWords.some(word => normalized.includes(word) && normalized.length <= word.length + 4))
        return false;
      if (normalized.startsWith('⚡')) return false;
      return true;
    };

    const candidates = new Map<string, number>();
    const addCandidate = (text: string | null | undefined, weight = 1) => {
      if (!text) return;
      const cleaned = this.cleanBookTitle(text);
      if (!cleaned || !isValidBookTitle(cleaned)) return;
      candidates.set(cleaned, (candidates.get(cleaned) || 0) + weight);
    };

    const anchorText = (el: HTMLAnchorElement): string => {
      return (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const collectFromBreadcrumbs = (): void => {
      const breadcrumbSelectors = [
        '[class*="breadcrumb"]',
        '[class*="crumb"]',
        '[class*="bread"]',
        'nav[aria-label*="breadcrumb"]',
      ];
      const containers = doc.querySelectorAll(breadcrumbSelectors.join(', '));
      for (const container of Array.from(containers)) {
        const links = Array.from(container.querySelectorAll('a')) as HTMLAnchorElement[];
        if (links.length === 0) continue;
        const texts = links.map(anchorText).filter(Boolean);
        const filtered = texts.filter(
          t => !TITLE_PATTERN.test(t) && !breadcrumbIgnorePattern.test(t)
        );
        if (filtered.length === 0) continue;
        const best = filtered.reduce((a, b) => (b.length > a.length ? b : a));
        addCandidate(best, 3);
      }
    };

    const collectFromStructuredData = (): void => {
      const scripts = doc.querySelectorAll(
        'script[type="application/ld+json"], script[type="application/json"]'
      );
      const tryParseJson = (text: string): unknown | undefined => {
        try {
          return JSON.parse(text);
        } catch {
          return undefined;
        }
      };
      const findBookTitle = (value: unknown, depth = 0): string | undefined => {
        if (!value || depth > 4) return undefined;
        if (Array.isArray(value)) {
          for (const item of value) {
            const found = findBookTitle(item, depth + 1);
            if (found) return found;
          }
          return undefined;
        }
        if (typeof value !== 'object') return undefined;
        const obj = value as Record<string, unknown>;
        const directKeys = [
          'bookName',
          'book_name',
          'bookTitle',
          'book_title',
          'novelName',
          'novel_name',
          'novelTitle',
          'novel_title',
        ];
        for (const key of directKeys) {
          const candidate = obj[key];
          if (typeof candidate === 'string') return candidate;
        }
        const type = obj['@type'];
        if (typeof type === 'string' && /book|novel/i.test(type)) {
          const candidate = obj.name || obj.title;
          if (typeof candidate === 'string') return candidate;
        }
        const containerKeys = ['bookInfo', 'book', 'novel', 'novelInfo', 'info', 'data'];
        for (const key of containerKeys) {
          const found = findBookTitle(obj[key], depth + 1);
          if (found) return found;
        }
        for (const key of Object.keys(obj)) {
          if (directKeys.includes(key) || containerKeys.includes(key)) continue;
          const found = findBookTitle(obj[key], depth + 1);
          if (found) return found;
        }
        return undefined;
      };

      for (const script of Array.from(scripts)) {
        const text = script.textContent?.trim();
        if (!text) continue;
        const data = tryParseJson(text);
        if (!data) continue;
        const found = findBookTitle(data);
        if (found) {
          addCandidate(found, 4);
        }
      }
    };

    const collectFromScriptText = (): void => {
      const scriptSelectors = [
        'script:not([type])',
        'script[type="text/javascript"]',
        'script[type="application/javascript"]',
      ];
      const scripts = doc.querySelectorAll(scriptSelectors.join(', '));
      const patterns = [
        /bookName\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
        /book_name\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
        /bookTitle\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
        /book_title\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
        /novelName\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
        /novel_title\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
        new RegExp('lastread\\.set\\([^,]*,[^,]*,\\s*["\\\']([^"\\\'\\r\\n]{2,80})["\\\']', 'i'),
      ];
      for (const script of Array.from(scripts)) {
        const text = script.textContent;
        if (!text || text.length > 200_000) continue;
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match?.[1]) {
            addCandidate(match[1], 3);
          }
        }
      }
    };

    const collectFromSelectors = (selectors: string[], weight = 2): void => {
      for (const selector of selectors) {
        try {
          const el = doc.querySelector(selector);
          if (el) {
            const text = (el.textContent || '').trim();
            addCandidate(text, weight);
          }
        } catch {
          continue;
        }
      }
    };

    // DOM selectors
    collectFromSelectors(KNOWN_BOOK_TITLE_SELECTORS, 3);
    collectFromBreadcrumbs();
    collectFromStructuredData();
    collectFromScriptText();

    // Meta tags commonly used by novel sites
    const metaNames = ['og:novel:book_name', 'og:book:title', 'book_name', 'og:novel:book_name'];
    for (const name of metaNames) {
      const meta =
        doc.querySelector(`meta[name="${cssEscape(name)}"]`) ||
        doc.querySelector(`meta[property="${cssEscape(name)}"]`);
      addCandidate(meta?.getAttribute('content'), 4);
    }

    // Generic meta titles
    const metaTitles = ['og:title', 'twitter:title'];
    for (const name of metaTitles) {
      const meta =
        doc.querySelector(`meta[name="${cssEscape(name)}"]`) ||
        doc.querySelector(`meta[property="${cssEscape(name)}"]`);
      addCandidate(meta?.getAttribute('content'), 2);
    }

    const metaKeywords = doc.querySelector('meta[name="keywords"]');
    if (metaKeywords?.getAttribute('content')) {
      const keywords = (metaKeywords.getAttribute('content') || '')
        .split(/[，,|｜]/)
        .map(s => s.trim())
        .filter(Boolean);
      if (keywords.length > 0) {
        addCandidate(keywords[0], 1);
      }
    }

    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDescription) {
      const bracket = metaDescription.match(/《([^》]+)》/);
      if (bracket) {
        addCandidate(bracket[1], 2);
      }
    }

    // Try to extract from document title
    const docTitle = doc.title;

    // Prefer explicit 《书名》 pattern
    const bracketMatch = docTitle.match(/《([^》]+)》/);
    if (bracketMatch) {
      addCandidate(bracketMatch[1], 1);
    }

    // Try to strip chapter information from the first part
    const parts = docTitle
      .split(/[-_|,，]/)
      .map(s => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      const firstPart = parts[0];
      // Titles like "假名 - 第1章" should prefer the true book name if it repeats elsewhere
      addCandidate(firstPart.replace(TITLE_PATTERN, '').replace(/《|》/g, ''), 1);

      // Find the first non-chapter part as book title
      for (const part of parts) {
        if (TITLE_PATTERN.test(part)) continue;
        addCandidate(part.replace(/《|》/g, ''), 1);
      }
    }

    // Try to extract using existing logic (second/last part)
    const fallbackParts = parts.length
      ? parts
      : docTitle
          .split(/[-_|,，]/)
          .map(s => s.trim())
          .filter(Boolean);
    if (fallbackParts.length >= 2) {
      // Book title is usually the second part or last part
      const bookPart = fallbackParts[1] || fallbackParts[fallbackParts.length - 1];
      addCandidate(bookPart, 1);
    }

    // Directory links often include book title (e.g., 《书名》目录)
    const directoryLinks = Array.from(doc.querySelectorAll('a')).filter(a =>
      /目录|章节/.test(a.textContent || '')
    );
    for (const link of directoryLinks) {
      const text = link.textContent || '';
      const bracket = text.match(/《([^》]+)》/);
      if (bracket) {
        addCandidate(bracket[1], 2);
        continue;
      }
      const cleaned = text.replace(/目录|章节|列表|返回|最新|TXT/gi, '').trim();
      if (cleaned) {
        addCandidate(cleaned, 1);
      }
    }

    if (candidates.size === 0) return undefined;

    const sorted = Array.from(candidates.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].length - a[0].length;
    });

    return sorted[0]?.[0];
  }

  /**
   * Clean up title text
   */
  private cleanTitle(text: string): string {
    let cleaned = text.trim();

    for (const pattern of TITLE_CLEANUP_PATTERNS) {
      cleaned = cleaned.replace(pattern, '');
    }

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Clean up book title
   */
  private cleanBookTitle(text: string): string {
    let cleaned = text.trim();

    const bracketMatch = cleaned.match(/《([^》]+)》/);
    if (bracketMatch) {
      cleaned = bracketMatch[1].trim();
    }

    cleaned = cleaned
      .replace(/^[\]\s"'“”‘’【】[（）()<>《》·•\-—–_~!！?？★☆⚡]+/, '')
      .replace(/[\]\s"'“”‘’【】[（）()<>《》·•\-—–_~!！?？★☆⚡]+$/, '')
      .trim();

    const chapterMatch = cleaned.match(TITLE_PATTERN);
    if (chapterMatch?.index !== undefined && chapterMatch.index > 0) {
      cleaned = cleaned.slice(0, chapterMatch.index).trim();
    }

    const cleanupPatterns = [
      /(?:小说|小說)?(?:全文|在线|線上|免费|免費)?阅读$/i,
      /(?:小说|小說)?(?:最新章节|最新章節)$/i,
      /(?:章节目录|章節目錄|章节列表|章節列表|目录|目錄|列表)$/i,
      /(?:TXT|txt)(?:全集|下载|下載)?$/i,
      /(?:无弹窗|無彈窗)$/i,
    ];
    for (const pattern of cleanupPatterns) {
      cleaned = cleaned.replace(pattern, '').trim();
    }

    const siteSuffixPattern = new RegExp(
      '[-_|—–]\\s*[^-|—–|_]{0,40}(?:' +
        '小说|小說|阅读|閱讀|网|網|站|书屋|書屋|书吧|書吧|笔趣阁|筆趣閣|' +
        '顶点|頂點|起点|起點|中文网|中文網|手机版|手機版|官网|官網|' +
        '小说网|小說網|阅读网|閱讀網).*$',
      'i'
    );
    cleaned = cleaned.replace(siteSuffixPattern, '').trim();

    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Validate if text is a valid chapter title
   */
  private isValidTitle(text: string): boolean {
    // Must have some content
    if (!text || text.length < 2) return false;

    // Must not be too long
    if (text.length > 100) return false;

    // Must not be just whitespace
    if (!/\S/.test(text)) return false;

    return true;
  }

  /**
   * Generate a simple selector for an element
   */
  private generateSelector(element: Element): string {
    if (element.id) {
      return `#${cssEscape(element.id)}`;
    }

    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    if (className) {
      const firstClass = className.split(/\s+/)[0];
      return `${tagName}.${cssEscape(firstClass)}`;
    }

    return tagName;
  }

  /**
   * Create empty result when detection fails
   */
  private createEmptyResult(): TitleResult {
    return {
      chapterTitle: '',
      confidence: 0,
      method: 'pattern',
    };
  }
}
