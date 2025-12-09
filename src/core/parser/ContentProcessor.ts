/**
 * ContentProcessor - Clean and process extracted content
 */

import { ReplaceRule } from '@/core/rules/types';

/** Common ad patterns to remove */
const AD_PATTERNS = [
  /本章未完[，,]点击下一页继续.*/gi,
  /手机用户请到.*阅读/gi,
  /请记住本书.*网址/gi,
  /百度搜索.*最新章节/gi,
  /一秒记住.*为您提供/gi,
  /天才一秒记住/gi,
  /笔趣阁.*www\.[a-z]+\.(com|net|org)/gi,
  /https?:\/\/[^\s<>"]+/gi,
  /www\.[a-z0-9]+\.(com|net|org|cc)/gi,
];

/** Elements commonly containing ads or unwanted content */
const REMOVE_SELECTORS = [
  'script',
  'style',
  'iframe',
  'noscript',
  '.ad',
  '.ads',
  '.advertisement',
  '[class*="ad-"]',
  '[id*="ad-"]',
  '.sponsor',
  '.recommend',
  '.related',
  '.comment',
  '.share',
  'ins.adsbygoogle',
];

export interface ProcessingOptions {
  /** Remove common ad patterns */
  removeAds?: boolean;
  /** Normalize whitespace */
  normalizeWhitespace?: boolean;
  /** Fix and center images */
  fixImages?: boolean;
  /** Strip inline styles from elements */
  stripInlineStyles?: boolean;
  /** Custom remove selectors */
  removeSelectors?: string;
  /** Custom replace rules */
  replaceRules?: ReplaceRule[];
  /** Use raw content without processing */
  useRawContent?: boolean;
  /** Chapter title for cleaning */
  chapterTitle?: string;
  /** Book title for cleaning */
  bookTitle?: string;
  /** Author name for cleaning */
  authorName?: string;
}

export class ContentProcessor {
  private options: ProcessingOptions;

  constructor(options: ProcessingOptions = {}) {
    this.options = {
      removeAds: true,
      normalizeWhitespace: true,
      fixImages: true,
      stripInlineStyles: true,
      ...options,
    };
  }

  /**
   * Process content element and return cleaned HTML
   */
  process(element: Element, doc: Document): string {
    if (this.options.useRawContent) {
      return element.innerHTML;
    }

    // Clone to avoid modifying original
    const clone = element.cloneNode(true) as Element;

    // Remove unwanted elements
    this.removeUnwantedElements(clone);

    // Apply custom remove selectors
    if (this.options.removeSelectors) {
      this.removeBySelector(clone, this.options.removeSelectors);
    }

    // Strip inline styles
    if (this.options.stripInlineStyles) {
      this.stripInlineStyles(clone);
    }

    // Get text content
    let html = clone.innerHTML;

    // Apply replace rules
    if (this.options.replaceRules) {
      html = this.applyReplaceRules(html, this.options.replaceRules);
    }

    // Remove ad patterns
    if (this.options.removeAds) {
      html = this.removeAdPatterns(html);
    }

    // Normalize whitespace
    if (this.options.normalizeWhitespace) {
      html = this.normalizeWhitespace(html);
    }

    // Fix images
    if (this.options.fixImages) {
      html = this.fixImages(html, doc);
    }

    // Convert br tags to paragraphs
    html = this.convertBrToParagraphs(html);

    // Clean duplicate title/book/author info at start and end
    html = this.cleanDuplicateInfo(html);

    return html;
  }

  /**
   * Process and return plain text
   */
  processToText(element: Element): string {
    const clone = element.cloneNode(true) as Element;
    this.removeUnwantedElements(clone);

    let text = clone.textContent || '';

    if (this.options.removeAds) {
      text = this.removeAdPatterns(text);
    }

    if (this.options.normalizeWhitespace) {
      text = text.replace(/\s+/g, ' ').trim();
    }

    return text;
  }

  /**
   * Remove unwanted elements from content
   */
  private removeUnwantedElements(element: Element): void {
    for (const selector of REMOVE_SELECTORS) {
      try {
        const elements = element.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      } catch {
        // Invalid selector, skip
      }
    }
  }

  /**
   * Remove elements by custom selector
   */
  private removeBySelector(element: Element, selectors: string): void {
    const selectorList = selectors.split(',').map(s => s.trim());
    for (const selector of selectorList) {
      try {
        const elements = element.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      } catch {
        // Invalid selector, skip
      }
    }
  }

  /**
   * Strip inline styles from all elements
   * This prevents original page styles from overriding reader theme
   */
  private stripInlineStyles(element: Element): void {
    // Remove style attribute from the element itself
    element.removeAttribute('style');

    // Remove style attribute from all descendants
    const elementsWithStyle = element.querySelectorAll('[style]');
    elementsWithStyle.forEach(el => {
      el.removeAttribute('style');
    });

    // Also remove bgcolor attribute (old HTML attribute)
    element.removeAttribute('bgcolor');
    const elementsWithBgcolor = element.querySelectorAll('[bgcolor]');
    elementsWithBgcolor.forEach(el => {
      el.removeAttribute('bgcolor');
    });
  }

  /**
   * Apply custom replace rules
   */
  private applyReplaceRules(html: string, rules: ReplaceRule[]): string {
    let result = html;

    for (const rule of rules) {
      try {
        const regex = new RegExp(rule.pattern, rule.flags || 'g');
        result = result.replace(regex, rule.replacement);
      } catch {
        // Invalid regex, skip
      }
    }

    return result;
  }

  /**
   * Remove common ad patterns
   */
  private removeAdPatterns(text: string): string {
    let result = text;

    for (const pattern of AD_PATTERNS) {
      result = result.replace(pattern, '');
    }

    return result;
  }

  /**
   * Normalize whitespace
   */
  private normalizeWhitespace(html: string): string {
    return (
      html
        // Remove empty paragraphs
        .replace(/<p>\s*<\/p>/gi, '')
        // Normalize multiple spaces
        .replace(/[ \t]+/g, ' ')
        // Normalize multiple newlines
        .replace(/\n{3,}/g, '\n\n')
        // Remove leading/trailing whitespace in paragraphs
        .replace(/<p>\s+/gi, '<p>')
        .replace(/\s+<\/p>/gi, '</p>')
    );
  }

  /**
   * Fix and center images
   */
  private fixImages(html: string, doc: Document): string {
    // Create a temporary container
    const temp = doc.createElement('div');
    temp.innerHTML = html;

    const images = temp.querySelectorAll('img');
    images.forEach(img => {
      // Fix lazy load
      const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-original');
      if (dataSrc && !img.src) {
        img.src = dataSrc;
      }

      // Add centering style
      img.style.display = 'block';
      img.style.maxWidth = '100%';
      img.style.margin = '10px auto';
    });

    return temp.innerHTML;
  }

  /**
   * Convert multiple br tags to paragraphs
   */
  private convertBrToParagraphs(html: string): string {
    // Replace multiple br tags with paragraph breaks
    let result = html.replace(/(<br\s*\/?>\s*){2,}/gi, '</p><p>');

    // Wrap content in paragraphs if not already
    if (!result.includes('<p>')) {
      result = '<p>' + result.replace(/<br\s*\/?>/gi, '</p><p>') + '</p>';
    }

    // Clean up empty paragraphs
    result = result.replace(/<p>\s*<\/p>/gi, '');

    return result;
  }

  /**
   * Set processing options
   */
  setOptions(options: Partial<ProcessingOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Clean duplicate book/chapter/author info at start and end of content
   */
  private cleanDuplicateInfo(html: string): string {
    const { chapterTitle } = this.options;

    let result = html;

    // Strategy 1: Clean leading text lines that match chapter title
    if (chapterTitle && chapterTitle.length > 2) {
      // Extract chapter number pattern (e.g., "第1章", "第一章")
      const chapterNumMatch = chapterTitle.match(
        /^(第[一二三四五六七八九十百千\d]+[章节回话篇集卷])/
      );
      const chapterNum = chapterNumMatch ? chapterNumMatch[1] : '';

      // Build patterns to remove duplicate chapter titles at the start
      const titlePatterns: RegExp[] = [];

      // Full title match
      const escapedTitle = this.escapeRegExp(chapterTitle);
      titlePatterns.push(new RegExp(`^\\s*${escapedTitle}\\s*`, 'i'));

      // Title with slight variations (extra dots, spaces, etc.)
      const titleCore = chapterTitle
        .replace(/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]\s*/, '')
        .trim();
      if (titleCore.length > 1) {
        const escapedCore = this.escapeRegExp(titleCore);
        // Match "第X章 ·标题" or "第X章·标题" etc.
        if (chapterNum) {
          const escapedNum = this.escapeRegExp(chapterNum);
          titlePatterns.push(new RegExp(`^\\s*${escapedNum}\\s*[·•.\\s]*${escapedCore}\\s*`, 'i'));
        }
      }

      // Also match just chapter number pattern at start
      if (chapterNum) {
        const escapedNum = this.escapeRegExp(chapterNum);
        titlePatterns.push(new RegExp(`^\\s*${escapedNum}[^<]{0,50}\\s*(?=<|$)`, 'i'));
      }

      // Apply patterns to clean HTML - handle both text nodes and wrapped content
      for (const pattern of titlePatterns) {
        // Clean text at very start (before any tags)
        result = result.replace(pattern, '');

        // Clean inside first few elements
        result = result
          .replace(new RegExp(`(<p[^>]*>)\\s*${pattern.source}`, 'gi'), '$1')
          .replace(new RegExp(`(<div[^>]*>)\\s*${pattern.source}`, 'gi'), '$1')
          .replace(new RegExp(`(<span[^>]*>)\\s*${pattern.source}`, 'gi'), '$1');
      }
    }

    // Strategy 2: Remove elements containing only chapter/book title
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result;

    // Get all direct children and first-level text content
    const children = Array.from(tempDiv.childNodes);
    let removedCount = 0;
    const maxRemove = 3; // Remove at most 3 leading duplicate lines

    for (const child of children) {
      if (removedCount >= maxRemove) break;

      const text = (child.textContent || '').trim();
      if (!text) {
        // Remove empty nodes
        child.parentNode?.removeChild(child);
        continue;
      }

      // Check if this looks like a duplicate title
      if (text.length < 100 && this.looksLikeDuplicateTitle(text)) {
        child.parentNode?.removeChild(child);
        removedCount++;
        continue;
      }

      // Stop if we hit actual content (longer text that's not a title)
      if (text.length > 50 && !this.looksLikeDuplicateTitle(text)) {
        break;
      }
    }

    // Strategy 3: Clean trailing content
    const trailingPatterns = [
      /\s*本章完\s*$/i,
      /\s*\(本章完\)\s*$/i,
      /\s*---+\s*$/,
      /\s*===+\s*$/,
      /\s*\*{3,}\s*$/,
    ];

    result = tempDiv.innerHTML;
    for (const pattern of trailingPatterns) {
      result = result.replace(pattern, '');
    }

    // Clean empty paragraphs that may have been created
    result = result.replace(/<p>\s*<\/p>/gi, '').replace(/<div>\s*<\/div>/gi, '');

    return result;
  }

  /**
   * Check if text looks like a duplicate chapter title
   */
  private looksLikeDuplicateTitle(text: string): boolean {
    const { chapterTitle, bookTitle } = this.options;
    const trimmed = text.trim();

    // Check against known chapter title
    if (chapterTitle) {
      const normalizedTitle = chapterTitle.replace(/\s+/g, '').toLowerCase();
      const normalizedText = trimmed.replace(/\s+/g, '').replace(/[·•.]/g, '').toLowerCase();

      // Exact or near-exact match
      if (normalizedText === normalizedTitle) return true;

      // Text contains the chapter title
      if (normalizedText.includes(normalizedTitle) || normalizedTitle.includes(normalizedText)) {
        return true;
      }

      // Check if it's just a chapter number + similar title
      const titleCore = chapterTitle
        .replace(/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]\s*/, '')
        .trim();
      const textCore = trimmed
        .replace(/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]\s*[·•.\s]*/, '')
        .trim();
      if (titleCore && textCore && this.fuzzyMatch(textCore, titleCore)) {
        return true;
      }
    }

    // Check against book title
    if (bookTitle && this.fuzzyMatch(trimmed, bookTitle)) {
      return true;
    }

    // Common chapter title patterns
    if (/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]/.test(trimmed)) {
      return true;
    }

    // Author line
    if (/^作者[：:]/i.test(trimmed)) {
      return true;
    }

    return false;
  }

  /**
   * Fuzzy match two strings (check if they share significant overlap)
   */
  private fuzzyMatch(text: string, target: string): boolean {
    if (!text || !target) return false;

    const t1 = text.replace(/\s+/g, '').toLowerCase();
    const t2 = target.replace(/\s+/g, '').toLowerCase();

    // Exact match
    if (t1 === t2) return true;

    // One contains the other
    if (t1.includes(t2) || t2.includes(t1)) return true;

    // Check character overlap (at least 70% match)
    if (t2.length >= 3) {
      let matches = 0;
      for (const char of t2) {
        if (t1.includes(char)) matches++;
      }
      if (matches / t2.length >= 0.7) return true;
    }

    return false;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
