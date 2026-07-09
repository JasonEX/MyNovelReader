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
import { generateCssSelector } from '@/core/utils';

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

type KnownContentSelector =
  | { selector: string; type: 'id' | 'class' | 'tag'; name: string }
  | { selector: string; type: 'complex' };

function compileKnownContentSelector(selector: string): KnownContentSelector {
  if (/^#[A-Za-z0-9_-]+$/.test(selector)) {
    return { selector, type: 'id', name: selector.slice(1) };
  }
  if (/^\.[A-Za-z0-9_-]+$/.test(selector)) {
    return { selector, type: 'class', name: selector.slice(1) };
  }
  if (/^[A-Za-z][A-Za-z0-9-]*$/.test(selector)) {
    return { selector, type: 'tag', name: selector };
  }
  return { selector, type: 'complex' };
}

const KNOWN_CONTENT_SELECTOR_ENTRIES = KNOWN_CONTENT_SELECTORS.map(compileKnownContentSelector);

function isWhitespaceCode(code: number): boolean {
  return (
    (code >= 0x09 && code <= 0x0d) ||
    code === 0x20 ||
    code === 0xa0 ||
    code === 0x1680 ||
    (code >= 0x2000 && code <= 0x200a) ||
    code === 0x2028 ||
    code === 0x2029 ||
    code === 0x202f ||
    code === 0x205f ||
    code === 0x3000 ||
    code === 0xfeff
  );
}

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
    const scored = this.scoreCandidates(doc);
    if (scored.length === 0) return this.createEmptyResult();

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
    for (const entry of KNOWN_CONTENT_SELECTOR_ENTRIES) {
      const el = this.resolveKnownSelector(doc, entry);
      if (!el) continue;
      if (!this.isVisibleContentElement(el, true)) continue;

      const isValidContent = this.isValidContent(el);
      const isPKeyLoadMoreContent = !isValidContent && this.isPKeyLoadMoreContent(el, doc);
      if (isValidContent || isPKeyLoadMoreContent) {
        return {
          element: el,
          selector: entry.selector,
          confidence: isValidContent ? 0.9 : 0.78,
          method: 'selector',
          preview: this.getPreview(el),
        };
      }
    }
    return null;
  }

  private resolveKnownSelector(doc: Document, entry: KnownContentSelector): Element | null {
    try {
      if (entry.type === 'id') return doc.getElementById(entry.name);
      if (entry.type === 'class') return doc.getElementsByClassName(entry.name).item(0);
      if (entry.type === 'tag') return doc.getElementsByTagName(entry.name).item(0);
      return doc.querySelector(entry.selector);
    } catch {
      return null;
    }
  }

  /**
   * Some templates intentionally truncate正文 in HTML and hide the rest in an encoded `p_key` blob,
   * only revealing it after clicking "加载更多".
   *
   * In this case the visible `.content` is often <500 chars (fails MIN_TEXT_LENGTH), so treat it as
   * valid content when we can reliably detect the pattern.
   */
  private isPKeyLoadMoreContent(element: Element, doc: Document): boolean {
    const rawText = (element.textContent || '').replace(/\s+/g, '').trim();
    if (!rawText) return false;

    const normalized = rawText.replace(/[|｜]/g, '');
    const hasLoadMore = normalized.includes('加载更多');
    const hasBlockedHint =
      normalized.includes('无法显示本章节全部内容') ||
      (normalized.includes('阅读模式') && normalized.includes('无法显示'));
    if (!hasLoadMore && !hasBlockedHint) return false;

    return this.hasInlinePKey(doc);
  }

  private hasInlinePKey(doc: Document): boolean {
    for (const script of doc.querySelectorAll('script')) {
      const text = script.textContent || '';
      if (!text || !text.includes('p_key')) continue;
      if (/p_key\s*=\s*['"][A-Za-z0-9+/=]{80,}['"]/.test(text)) return true;
    }
    return false;
  }

  /**
   * Score all potential content containers in one scan.
   */
  private scoreCandidates(doc: Document): ContentCandidate[] {
    const containers = doc.querySelectorAll('div, article, section, main, td');
    const candidates: ContentCandidate[] = [];

    for (const element of containers) {
      let score = 0;
      const text = element.textContent || '';
      const textLength = text.length;
      if (textLength < MIN_TEXT_LENGTH) continue;

      const idClass = ((element.id || '') + ' ' + (element.className || '')).toLowerCase();
      if (this.isNavigationElement(element, idClass)) continue;

      if (!this.isVisibleContentElement(element)) continue;

      const html = element.innerHTML;
      const htmlLength = html.length;
      const textDensity = textLength / Math.max(htmlLength, 1);
      const chineseRatio = this.calculateChineseRatio(text);
      const linkDensity = this.calculateLinkDensity(element, textLength);
      const paragraphCount = element.querySelectorAll('p, br').length;

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

      candidates.push({ element, score, textLength, linkDensity, chineseRatio });
    }

    return candidates;
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
    const linkDensity = this.calculateLinkDensity(element, text.length);
    if (linkDensity > 0.5) return false;

    return true;
  }

  private isVisibleContentElement(element: Element, checkAncestors = false): boolean {
    const doc = element.ownerDocument;
    const win = doc.defaultView;
    const canReadGlobalStyle = typeof getComputedStyle === 'function';
    let current: Element | null = element;

    while (current) {
      if ((current as HTMLElement).hidden) return false;

      try {
        const style = win
          ? win.getComputedStyle(current)
          : canReadGlobalStyle
            ? getComputedStyle(current)
            : null;
        if (style?.display === 'none') return false;
        if (style?.visibility === 'hidden' || style?.visibility === 'collapse') return false;
      } catch {
        // Some parsed documents do not expose style computation. Treat them as visible.
      }

      if (!checkAncestors || current === doc.body || current === doc.documentElement) break;
      current = current.parentElement;
    }

    return true;
  }

  /**
   * Check if element is a navigation/structural element
   */
  private isNavigationElement(element: Element, idClass?: string): boolean {
    const tagName = element.tagName.toUpperCase();
    if (['NAV', 'HEADER', 'FOOTER', 'ASIDE'].includes(tagName)) {
      return true;
    }

    const names = idClass ?? ((element.id || '') + ' ' + (element.className || '')).toLowerCase();
    return /nav|menu|sidebar|footer|header/.test(names);
  }

  /**
   * Calculate the ratio of link text to total text
   */
  private calculateLinkDensity(element: Element, totalTextLength?: number): number {
    const links = element.querySelectorAll('a');
    let linkText = 0;
    for (const link of links) {
      linkText += link.textContent?.length || 0;
    }
    const totalText = totalTextLength || element.textContent?.length || 1;
    return linkText / totalText;
  }

  /**
   * Calculate the ratio of Chinese characters to total characters
   */
  private calculateChineseRatio(text: string): number {
    let chineseChars = 0;
    let nonWhitespace = 0;

    for (let index = 0; index < text.length; index++) {
      const code = text.charCodeAt(index);
      if (code >= 0x4e00 && code <= 0x9fff) chineseChars += 1;
      if (!isWhitespaceCode(code)) nonWhitespace += 1;
    }

    return chineseChars / Math.max(nonWhitespace, 1);
  }

  /**
   * Generate a CSS selector for the element
   */
  generateSelector(element: Element): string {
    return generateCssSelector(element);
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
