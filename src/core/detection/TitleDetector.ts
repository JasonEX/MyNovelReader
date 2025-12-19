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
  '#bookname',
  '.novel-title',
  'h2.title',
  '.layout-tit a[title]',
  '.breadcrumb a:last-of-type',
  '.chapter-nav a:last-of-type',
];

/** Patterns to clean up title text */
const TITLE_CLEANUP_PATTERNS = [
  /^章节目录/,
  /^文章正文/,
  /^正文卷?/,
  /全文免费阅读$/,
  /最新章节$/,
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
    for (const h1 of h1s) {
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
    for (const h2 of h2s) {
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
    const isValidBookTitle = (text: string): boolean => {
      if (!text || text.length < 2 || text.length > 100) return false;
      const normalized = text.replace(/\s+/g, '').toLowerCase();
      if (normalized.includes('天天看小说') || normalized.includes('天天看小說')) return false;
      if (normalized.startsWith('⚡')) return false;
      return true;
    };

    for (const selector of KNOWN_BOOK_TITLE_SELECTORS) {
      try {
        const el = doc.querySelector(selector);
        if (el) {
          const text = (el.textContent || '').trim();
          if (text.length > 0 && text.length < 50 && isValidBookTitle(text)) {
            return this.cleanBookTitle(text);
          }
        }
      } catch {
        continue;
      }
    }

    // Try to extract from document title
    const docTitle = doc.title;

    // Prefer explicit 《书名》 pattern
    const bracketMatch = docTitle.match(/《([^》]+)》/);
    if (bracketMatch) {
      const candidate = this.cleanBookTitle(bracketMatch[1]);
      if (isValidBookTitle(candidate)) {
        return candidate;
      }
    }

    // Try to strip chapter information from the first part
    const parts = docTitle
      .split(/[-_|,，]/)
      .map(s => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      const firstPart = parts[0];
      const withoutChapter = this.cleanBookTitle(
        firstPart.replace(TITLE_PATTERN, '').replace(/《|》/g, '')
      );
      if (withoutChapter && isValidBookTitle(withoutChapter)) {
        return withoutChapter;
      }

      // Find the first non-chapter part as book title
      for (const part of parts) {
        if (TITLE_PATTERN.test(part)) continue;
        const cleanedPart = this.cleanBookTitle(part.replace(/《|》/g, ''));
        if (isValidBookTitle(cleanedPart)) {
          return cleanedPart;
        }
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
      if (
        bookPart.length > 0 &&
        bookPart.length < 50 &&
        !TITLE_PATTERN.test(bookPart) &&
        isValidBookTitle(bookPart)
      ) {
        return this.cleanBookTitle(bookPart);
      }
    }

    return undefined;
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
    return text
      .replace(/全文阅读$/, '')
      .replace(/在线阅读$/, '')
      .replace(/最新章节$/, '')
      .trim();
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
