/**
 * ContentDetector - Readability-inspired content area detection
 * Uses heuristic scoring to identify the main content area of a novel page
 */

import {
  ContentCandidate,
  ContentResult,
  KNOWN_CONTENT_SELECTORS,
  NEGATIVE_PATTERNS,
  POSITIVE_PATTERNS,
} from './types';
import { cssEscape } from '@/core/utils';

/** Scoring weights for content detection */
const WEIGHTS = {
  // Positive indicators
  CONTENT_ID_CLASS: 25,
  ARTICLE_TAG: 15,
  HIGH_TEXT_DENSITY: 20,
  PARAGRAPH_COUNT: 10,
  CHINESE_RATIO: 15,
  TEXT_LENGTH_BONUS: 20, // Max bonus for long text

  // Negative indicators
  NAV_HEADER_FOOTER: -25,
  AD_CLASS: -30,
  COMMENT_CLASS: -20,
  HIGH_LINK_DENSITY: -20,
};

/** Minimum text length to consider as valid content */
const MIN_TEXT_LENGTH = 500;

/** Minimum Chinese character ratio for Chinese novels */
const MIN_CHINESE_RATIO = 0.3;

export class ContentDetector {
  /**
   * Detect the main content area of the document
   */
  detect(doc: Document): ContentResult {
    // Strategy 1: Try known selectors first (fast path)
    const selectorResult = this.tryKnownSelectors(doc);
    if (selectorResult) {
      return selectorResult;
    }

    // Strategy 2: Heuristic scoring (slow path)
    const candidates = this.findCandidates(doc);
    if (candidates.length === 0) {
      return this.createEmptyResult();
    }

    const scored = this.scoreCandidates(candidates);
    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (best.score < 10 || best.textLength < MIN_TEXT_LENGTH) {
      return this.createEmptyResult();
    }

    return {
      element: best.element,
      selector: this.generateSelector(best.element),
      confidence: this.normalizeScore(best.score),
      method: 'heuristic',
      preview: this.getPreview(best.element),
    };
  }

  /**
   * Try known content selectors (fast path)
   */
  private tryKnownSelectors(doc: Document): ContentResult | null {
    for (const selector of KNOWN_CONTENT_SELECTORS) {
      try {
        const el = doc.querySelector(selector);
        if (el && this.isValidContent(el)) {
          return {
            element: el,
            selector,
            confidence: 0.9,
            method: 'selector',
            preview: this.getPreview(el),
          };
        }
      } catch {
        // Invalid selector, skip
      }
    }
    return null;
  }

  /**
   * Find all potential content containers
   */
  private findCandidates(doc: Document): Element[] {
    const containers = doc.querySelectorAll('div, article, section, main, td');

    return Array.from(containers).filter(el => {
      // Skip elements that are too small
      const text = el.textContent || '';
      if (text.length < MIN_TEXT_LENGTH) return false;

      // Skip navigation elements
      if (this.isNavigationElement(el)) return false;

      // Skip hidden elements
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
      }

      return true;
    });
  }

  /**
   * Score all candidate elements
   */
  private scoreCandidates(candidates: Element[]): ContentCandidate[] {
    return candidates.map(element => {
      let score = 0;
      const text = element.textContent || '';
      const html = element.innerHTML;

      // Calculate metrics
      const textLength = text.length;
      const htmlLength = html.length;
      const textDensity = textLength / Math.max(htmlLength, 1);
      const linkDensity = this.calculateLinkDensity(element);
      const chineseRatio = this.calculateChineseRatio(text);
      const paragraphCount = element.querySelectorAll('p, br').length;

      // Get ID and class names for pattern matching
      const idClass = ((element.id || '') + ' ' + (element.className || '')).toLowerCase();

      // Apply positive scoring rules
      if (POSITIVE_PATTERNS.some(p => p.test(idClass))) {
        score += WEIGHTS.CONTENT_ID_CLASS;
      }

      const tagName = element.tagName.toUpperCase();
      if (tagName === 'ARTICLE' || tagName === 'MAIN') {
        score += WEIGHTS.ARTICLE_TAG;
      }

      if (textDensity > 0.5) {
        score += WEIGHTS.HIGH_TEXT_DENSITY;
      }

      if (paragraphCount > 3) {
        score += WEIGHTS.PARAGRAPH_COUNT;
      }

      if (chineseRatio > 0.7) {
        score += WEIGHTS.CHINESE_RATIO;
      }

      // Apply negative scoring rules
      if (NEGATIVE_PATTERNS.some(p => p.test(idClass))) {
        score += WEIGHTS.NAV_HEADER_FOOTER;
      }

      if (/ad|sponsor|banner|promo/i.test(idClass)) {
        score += WEIGHTS.AD_CLASS;
      }

      if (/comment|discuss|reply/i.test(idClass)) {
        score += WEIGHTS.COMMENT_CLASS;
      }

      if (linkDensity > 0.3) {
        score += WEIGHTS.HIGH_LINK_DENSITY;
      }

      // Boost for longer text (novel chapters are typically long)
      score += Math.min(textLength / 1000, WEIGHTS.TEXT_LENGTH_BONUS);

      return { element, score, textLength, linkDensity, chineseRatio };
    });
  }

  /**
   * Check if element contains valid novel content
   */
  private isValidContent(element: Element): boolean {
    const text = element.textContent || '';

    // Must have minimum text length
    if (text.length < MIN_TEXT_LENGTH) return false;

    // Must have reasonable Chinese character ratio for Chinese novels
    const chineseRatio = this.calculateChineseRatio(text);
    if (chineseRatio < MIN_CHINESE_RATIO) return false;

    // Should not have too many links
    const linkDensity = this.calculateLinkDensity(element);
    if (linkDensity > 0.5) return false;

    return true;
  }

  /**
   * Check if element is a navigation/structural element
   */
  private isNavigationElement(element: Element): boolean {
    const tagName = element.tagName.toUpperCase();
    if (['NAV', 'HEADER', 'FOOTER', 'ASIDE'].includes(tagName)) {
      return true;
    }

    const idClass = ((element.id || '') + ' ' + (element.className || '')).toLowerCase();
    return /nav|menu|sidebar|footer|header/.test(idClass);
  }

  /**
   * Calculate the ratio of link text to total text
   */
  private calculateLinkDensity(element: Element): number {
    const links = element.querySelectorAll('a');
    const linkText = Array.from(links).reduce((sum, a) => sum + (a.textContent?.length || 0), 0);
    const totalText = element.textContent?.length || 1;
    return linkText / totalText;
  }

  /**
   * Calculate the ratio of Chinese characters to total characters
   */
  private calculateChineseRatio(text: string): number {
    const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
    const nonWhitespace = text.replace(/\s/g, '');
    return chineseChars.length / Math.max(nonWhitespace.length, 1);
  }

  /**
   * Generate a CSS selector for the element
   */
  generateSelector(element: Element): string {
    // Try ID first
    if (element.id) {
      return `#${cssEscape(element.id)}`;
    }

    // Try unique class
    const classes = Array.from(element.classList);
    for (const cls of classes) {
      try {
        if (document.querySelectorAll(`.${cssEscape(cls)}`).length === 1) {
          return `.${cssEscape(cls)}`;
        }
      } catch {
        continue;
      }
    }

    // Generate path-based selector
    return this.generatePathSelector(element);
  }

  /**
   * Generate a path-based selector (e.g., body > div:nth-of-type(2) > div)
   */
  private generatePathSelector(element: Element): string {
    const path: string[] = [];
    let current: Element | null = element;

    while (current && current !== document.body && current !== document.documentElement) {
      let segment = current.tagName.toLowerCase();

      if (current.id) {
        segment = `#${cssEscape(current.id)}`;
        path.unshift(segment);
        break;
      }

      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          segment += `:nth-of-type(${index})`;
        }
      }

      path.unshift(segment);
      current = parent;
    }

    return path.join(' > ');
  }

  /**
   * Normalize score to 0-1 range
   */
  private normalizeScore(score: number): number {
    // Expected max score is around 100
    return Math.min(Math.max(score / 100, 0), 1);
  }

  /**
   * Get preview text from element
   */
  private getPreview(element: Element): string {
    const text = element.textContent || '';
    return text.trim().substring(0, 200) + (text.length > 200 ? '...' : '');
  }

  /**
   * Create empty result when detection fails
   */
  private createEmptyResult(): ContentResult {
    return {
      element: null,
      selector: '',
      confidence: 0,
      method: 'fallback',
    };
  }
}
