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

/** Known book-title classes that can be read without a full selector scan. */
const BOOK_TITLE_CLASS_NAMES = [
  'bookname',
  'book-title',
  'book_title',
  'book-name',
  'book_name',
  'novel-title',
] as const;

const BOOK_TITLE_HEADING_CONTAINER_IDS = ['book-info', 'info'] as const;

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

const STRONG_BOOK_TITLE_SCORE = 3;
const DIRECTORY_LINK_SCAN_LIMIT = 200;

const GENERIC_BOOK_LABEL_PATTERN =
  /^(?:首页|主页|home|index|返回|返回目录|目录|章节目录|章節目錄|章节列表|章節列表|章节|章節|最新章节|最新章節|正文|内容|內容|简介|簡介|作品信息|书籍信息|書籍信息|小说|小說|阅读|閱讀|catalog|toc|contents?)$/i;

const BREADCRUMB_IGNORE_PATTERN =
  /^(?:首页|主页|home|index|返回|返回目录|目录|章节目录|章節目錄|章节列表|章節列表|章节|章節)$/i;

const SITE_TITLE_WORDS = [
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
] as const;

const BREADCRUMB_SELECTORS = [
  '[class*="breadcrumb"]',
  '[class*="crumb"]',
  '[class*="bread"]',
  'nav[aria-label*="breadcrumb"]',
] as const;

const EXPLICIT_BOOK_META_NAMES = ['og:novel:book_name', 'og:book:title', 'book_name'] as const;

const GENERIC_TITLE_META_NAMES = ['og:title', 'twitter:title'] as const;

const SCRIPT_TEXT_SELECTORS = [
  'script:not([type])',
  'script[type="text/javascript"]',
  'script[type="application/javascript"]',
] as const;

const SCRIPT_BOOK_TITLE_PATTERNS = [
  /bookName\s*[:=]\s*["']([^"'\n]{2,80})["']/i,
  /book_name\s*[:=]\s*["']([^"'\n]{2,80})["']/i,
  /bookTitle\s*[:=]\s*["']([^"'\n]{2,80})["']/i,
  /book_title\s*[:=]\s*["']([^"'\n]{2,80})["']/i,
  /novelName\s*[:=]\s*["']([^"'\n]{2,80})["']/i,
  /novel_title\s*[:=]\s*["']([^"'\n]{2,80})["']/i,
  new RegExp('lastread\\.set\\([^,]*,[^,]*,\\s*["\\\']([^"\\\'\\r\\n]{2,80})["\\\']', 'i'),
] as const;

const STRUCTURED_BOOK_TITLE_KEYS = [
  'bookName',
  'book_name',
  'bookTitle',
  'book_title',
  'novelName',
  'novel_name',
  'novelTitle',
  'novel_title',
] as const;

const STRUCTURED_BOOK_CONTAINER_KEYS = [
  'bookInfo',
  'book',
  'novel',
  'novelInfo',
  'info',
  'data',
] as const;

type BookTitleCandidates = Map<string, number>;

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
    const candidates = new Map<string, number>();

    this.collectBookTitleFromKnownDom(doc, candidates);
    this.collectBookTitleFromBreadcrumbs(doc, candidates);
    this.collectBookTitleFromMeta(doc, candidates);
    this.collectBookTitleFromDocumentTitle(doc, candidates);

    const strongCandidate = this.pickBookTitleCandidate(candidates, STRONG_BOOK_TITLE_SCORE);
    if (strongCandidate) return strongCandidate;

    this.collectBookTitleFromStructuredData(doc, candidates);
    this.collectBookTitleFromScriptText(doc, candidates);
    this.collectBookTitleFromDirectoryLinks(doc, candidates);

    return this.pickBookTitleCandidate(candidates);
  }

  private addBookTitleCandidate(
    candidates: BookTitleCandidates,
    text: string | null | undefined,
    weight = 1
  ): void {
    if (!text) return;
    const cleaned = this.cleanBookTitle(text);
    if (!cleaned || !this.isValidBookTitle(cleaned)) return;
    candidates.set(cleaned, (candidates.get(cleaned) || 0) + weight);
  }

  private pickBookTitleCandidate(
    candidates: BookTitleCandidates,
    minScore = 0
  ): string | undefined {
    const sorted = Array.from(candidates.entries())
      .filter(([, score]) => score >= minScore)
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return b[0].length - a[0].length;
      });

    return sorted[0]?.[0];
  }

  private isValidBookTitle(text: string): boolean {
    if (!text || text.length < 2 || text.length > 100) return false;
    if (TITLE_PATTERN.test(text)) return false;
    if (GENERIC_BOOK_LABEL_PATTERN.test(text.trim())) return false;
    const normalized = text.replace(/\s+/g, '').toLowerCase();
    if (normalized.includes('天天看小说') || normalized.includes('天天看小說')) return false;
    if (
      SITE_TITLE_WORDS.some(
        word => normalized.includes(word) && normalized.length <= word.length + 4
      )
    ) {
      return false;
    }
    if (normalized.startsWith('⚡')) return false;
    return true;
  }

  private collectBookTitleFromKnownDom(doc: Document, candidates: BookTitleCandidates): void {
    this.addBookTitleCandidate(candidates, doc.getElementById('bookname')?.textContent, 3);

    for (const id of BOOK_TITLE_HEADING_CONTAINER_IDS) {
      this.collectHeadingText(doc.getElementById(id), candidates, 3);
    }

    for (const className of BOOK_TITLE_CLASS_NAMES) {
      for (const el of Array.from(doc.getElementsByClassName(className))) {
        this.addBookTitleCandidate(candidates, el.textContent, 3);
      }
    }

    for (const container of Array.from(doc.getElementsByClassName('bookinfo'))) {
      this.collectHeadingText(container, candidates, 3);
    }

    for (const h2 of Array.from(doc.getElementsByTagName('h2'))) {
      if (h2.classList.contains('title')) {
        this.addBookTitleCandidate(candidates, h2.textContent, 3);
      }
    }

    for (const container of Array.from(doc.getElementsByClassName('layout-tit'))) {
      const link = container.querySelector('a[title]');
      this.addBookTitleCandidate(candidates, link?.textContent, 3);
    }

    for (const container of Array.from(doc.getElementsByClassName('booknav'))) {
      const link = container.querySelector('a');
      this.addBookTitleCandidate(candidates, link?.textContent, 3);
    }

    for (const container of Array.from(doc.getElementsByClassName('chapter-nav'))) {
      const links = container.getElementsByTagName('a');
      const link = links.item(links.length - 1);
      this.addBookTitleCandidate(candidates, link?.textContent, 3);
    }
  }

  private collectHeadingText(
    container: Element | null,
    candidates: BookTitleCandidates,
    weight: number
  ): void {
    if (!container) return;
    for (const tagName of ['h1', 'h2'] as const) {
      const heading = container.getElementsByTagName(tagName).item(0);
      if (heading) {
        this.addBookTitleCandidate(candidates, heading.textContent, weight);
      }
    }
  }

  private collectBookTitleFromBreadcrumbs(doc: Document, candidates: BookTitleCandidates): void {
    const containers = doc.querySelectorAll(BREADCRUMB_SELECTORS.join(', '));
    for (const container of Array.from(containers)) {
      const links = Array.from(container.querySelectorAll('a')) as HTMLAnchorElement[];
      if (links.length === 0) continue;
      const texts = links.map(this.getAnchorLabel).filter(Boolean);
      const filtered = texts.filter(
        t => !TITLE_PATTERN.test(t) && !BREADCRUMB_IGNORE_PATTERN.test(t)
      );
      if (filtered.length === 0) continue;
      const best = filtered.reduce((a, b) => (b.length > a.length ? b : a));
      this.addBookTitleCandidate(candidates, best, 3);
    }
  }

  private collectBookTitleFromMeta(doc: Document, candidates: BookTitleCandidates): void {
    const metaContents = this.collectMetaContents(doc);

    for (const name of EXPLICIT_BOOK_META_NAMES) {
      this.addBookTitleCandidate(candidates, metaContents.get(name.toLowerCase()), 4);
    }

    for (const name of GENERIC_TITLE_META_NAMES) {
      this.addBookTitleCandidate(candidates, metaContents.get(name.toLowerCase()), 2);
    }

    const keywordsContent = metaContents.get('keywords');
    if (keywordsContent) {
      const keywords = keywordsContent
        .split(/[，,|｜]/)
        .map(s => s.trim())
        .filter(Boolean);
      if (keywords.length > 0) {
        this.addBookTitleCandidate(candidates, keywords[0], 1);
      }
    }

    const metaDescription = metaContents.get('description');
    if (metaDescription) {
      const bracket = metaDescription.match(/《([^》]+)》/);
      if (bracket) {
        this.addBookTitleCandidate(candidates, bracket[1], 2);
      }
    }
  }

  private collectMetaContents(doc: Document): Map<string, string> {
    const contents = new Map<string, string>();
    const metas = doc.querySelectorAll('meta[name], meta[property]');
    for (const meta of Array.from(metas)) {
      const key = (meta.getAttribute('name') || meta.getAttribute('property') || '')
        .trim()
        .toLowerCase();
      const content = meta.getAttribute('content');
      if (key && content && !contents.has(key)) {
        contents.set(key, content);
      }
    }
    return contents;
  }

  private collectBookTitleFromDocumentTitle(doc: Document, candidates: BookTitleCandidates): void {
    const docTitle = doc.title;

    const bracketMatch = docTitle.match(/《([^》]+)》/);
    if (bracketMatch) {
      this.addBookTitleCandidate(candidates, bracketMatch[1], 1);
    }

    const parts = docTitle
      .split(/[-_|,，]/)
      .map(s => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      const firstPart = parts[0];
      this.addBookTitleCandidate(
        candidates,
        firstPart.replace(TITLE_PATTERN, '').replace(/《|》/g, ''),
        1
      );

      for (const part of parts) {
        if (TITLE_PATTERN.test(part)) continue;
        this.addBookTitleCandidate(candidates, part.replace(/《|》/g, ''), 1);
      }
    }

    if (parts.length >= 2) {
      const bookPart = parts[1] || parts[parts.length - 1];
      this.addBookTitleCandidate(candidates, bookPart, 1);
    }
  }

  private collectBookTitleFromStructuredData(doc: Document, candidates: BookTitleCandidates): void {
    const scripts = doc.querySelectorAll(
      'script[type="application/ld+json"], script[type="application/json"]'
    );
    for (const script of Array.from(scripts)) {
      const text = script.textContent?.trim();
      if (!text) continue;

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        continue;
      }

      const found = this.findBookTitleInStructuredData(data);
      if (found) {
        this.addBookTitleCandidate(candidates, found, 4);
      }
    }
  }

  private findBookTitleInStructuredData(value: unknown, depth = 0): string | undefined {
    if (!value || depth > 4) return undefined;
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = this.findBookTitleInStructuredData(item, depth + 1);
        if (found) return found;
      }
      return undefined;
    }
    if (typeof value !== 'object') return undefined;

    const obj = value as Record<string, unknown>;
    for (const key of STRUCTURED_BOOK_TITLE_KEYS) {
      const candidate = obj[key];
      if (typeof candidate === 'string') return candidate;
    }

    const type = obj['@type'];
    if (typeof type === 'string' && /book|novel/i.test(type)) {
      const candidate = obj.name || obj.title;
      if (typeof candidate === 'string') return candidate;
    }

    for (const key of STRUCTURED_BOOK_CONTAINER_KEYS) {
      const found = this.findBookTitleInStructuredData(obj[key], depth + 1);
      if (found) return found;
    }

    for (const key of Object.keys(obj)) {
      if (
        STRUCTURED_BOOK_TITLE_KEYS.includes(key as (typeof STRUCTURED_BOOK_TITLE_KEYS)[number]) ||
        STRUCTURED_BOOK_CONTAINER_KEYS.includes(
          key as (typeof STRUCTURED_BOOK_CONTAINER_KEYS)[number]
        )
      ) {
        continue;
      }
      const found = this.findBookTitleInStructuredData(obj[key], depth + 1);
      if (found) return found;
    }

    return undefined;
  }

  private collectBookTitleFromScriptText(doc: Document, candidates: BookTitleCandidates): void {
    const scripts = doc.querySelectorAll(SCRIPT_TEXT_SELECTORS.join(', '));
    for (const script of Array.from(scripts)) {
      const text = script.textContent;
      if (!text || text.length > 200_000) continue;
      for (const pattern of SCRIPT_BOOK_TITLE_PATTERNS) {
        const match = text.match(pattern);
        if (match?.[1]) {
          this.addBookTitleCandidate(candidates, match[1], 3);
        }
      }
    }
  }

  private collectBookTitleFromDirectoryLinks(doc: Document, candidates: BookTitleCandidates): void {
    if (doc.links.length > DIRECTORY_LINK_SCAN_LIMIT) return;
    for (const link of Array.from(doc.links)) {
      const text = link.textContent || '';
      if (!/目录|章节/.test(text)) continue;

      const bracket = text.match(/《([^》]+)》/);
      if (bracket) {
        this.addBookTitleCandidate(candidates, bracket[1], 2);
        continue;
      }
      const cleaned = text.replace(/目录|章节|列表|返回|最新|TXT/gi, '').trim();
      if (cleaned) {
        this.addBookTitleCandidate(candidates, cleaned, 1);
      }
    }
  }

  private getAnchorLabel(el: HTMLAnchorElement): string {
    return (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
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
