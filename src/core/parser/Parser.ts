/**
 * Parser - Main content parser using detection engine and rules
 */

import { ContentProcessor, ProcessingOptions } from './ContentProcessor';
import { DetectionEngine, DetectionEngineResult } from '@/core/detection';
import { RuleMatchResult, SiteRule } from '@/core/rules/types';
import { getRuleManager } from '@/core/rules/RuleManager';

/** Parsed chapter data */
export interface ParsedChapter {
  /** Chapter title */
  title: string;
  /** Book title (if detected) */
  bookTitle?: string;
  /** Processed HTML content */
  content: string;
  /** Raw HTML content (before processing) */
  rawContent: string;
  /** Previous chapter URL */
  prevUrl?: string;
  /** Next chapter URL */
  nextUrl?: string;
  /** Index/TOC URL */
  indexUrl?: string;
  /** Current page URL */
  url: string;
  /** Detection confidence */
  confidence: number;
  /** Rule used (if any) */
  rule?: SiteRule;
  /** Detection method */
  method: 'rule' | 'detection' | 'mixed';
}

/** Parser options */
export interface ParserOptions {
  /** Force use detection even if rule exists */
  forceDetection?: boolean;
  /** Processing options */
  processing?: ProcessingOptions;
}

export class Parser {
  private detectionEngine: DetectionEngine;
  private contentProcessor: ContentProcessor;
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.detectionEngine = new DetectionEngine();
    this.contentProcessor = new ContentProcessor(options.processing);
    this.options = options;
  }

  /**
   * Parse the current page
   */
  async parse(doc: Document = document, explicitUrl?: string): Promise<ParsedChapter | null> {
    const url = explicitUrl || doc.location?.href || window.location.href;

    // Try to match a rule first
    const ruleManager = getRuleManager();
    await ruleManager.initialize();
    const ruleMatch = await ruleManager.matchRule(url);

    if (ruleMatch && !this.options.forceDetection) {
      // Use rule-based parsing
      return this.parseWithRule(doc, url, ruleMatch);
    }

    // Use detection-based parsing
    return this.parseWithDetection(doc, url);
  }

  /**
   * Parse using a matched rule
   */
  private parseWithRule(
    doc: Document,
    url: string,
    ruleMatch: RuleMatchResult
  ): ParsedChapter | null {
    const rule = ruleMatch.rule;

    // Execute beforeParse hook if present
    if (rule.hooks?.beforeParse) {
      try {
        const fn = new Function('doc', rule.hooks.beforeParse);
        fn(doc);
      } catch (e) {
        console.warn('[Parser] beforeParse hook error:', e);
      }
    }

    // Extract content
    const contentElement = this.selectElement(doc, rule.content.selector);
    if (!contentElement) {
      // Fallback to detection if rule selector fails
      return this.parseWithDetection(doc, url, rule);
    }

    // Extract navigation from rule selectors
    let navigation = this.extractNavigation(doc, rule);

    // Fallback to detection-based navigation if rule selectors didn't find links
    if (!navigation.next || !navigation.prev) {
      const detectedNav = this.detectionEngine.detect(doc, url).results.navigation;
      if (!navigation.next && detectedNav.next?.url) {
        navigation.next = detectedNav.next.url;
      }
      if (!navigation.prev && detectedNav.prev?.url) {
        navigation.prev = detectedNav.prev.url;
      }
      if (!navigation.index && detectedNav.index?.url) {
        navigation.index = detectedNav.index.url;
      }
    }

    // Extract title
    const title = this.extractTitle(doc, rule);

    // Process content with title info for duplicate cleaning
    const processingOptions: ProcessingOptions = {
      removeSelectors: rule.content.remove,
      replaceRules: rule.content.replace,
      removeAds: rule.processing?.removeAds !== false,
      normalizeWhitespace: rule.processing?.normalizeWhitespace !== false,
      fixImages: rule.processing?.fixImages !== false,
      useRawContent: rule.processing?.useRawContent,
      chapterTitle: title.chapter,
      bookTitle: title.book,
    };

    this.contentProcessor.setOptions(processingOptions);
    const rawContent = contentElement.innerHTML;
    const content = this.contentProcessor.process(contentElement, doc);

    return {
      title: title.chapter,
      bookTitle: title.book,
      content,
      rawContent,
      prevUrl: navigation.prev,
      nextUrl: navigation.next,
      indexUrl: navigation.index,
      url,
      confidence: 1.0,
      rule,
      method: 'rule',
    };
  }

  /**
   * Parse using detection engine
   */
  private parseWithDetection(
    doc: Document,
    url: string,
    fallbackRule?: SiteRule
  ): ParsedChapter | null {
    const detection = this.detectionEngine.detect(doc, url);

    if (!detection.results.content.element) {
      return null;
    }

    const contentElement = detection.results.content.element;

    // Use detection results for navigation, with fallback to rule if available
    const navigation = {
      prev: detection.results.navigation.prev?.url,
      next: detection.results.navigation.next?.url,
      index: detection.results.navigation.index?.url,
    };

    // Override with rule navigation if available
    if (fallbackRule?.navigation) {
      const ruleNav = this.extractNavigation(doc, fallbackRule);
      if (ruleNav.prev) navigation.prev = ruleNav.prev;
      if (ruleNav.next) navigation.next = ruleNav.next;
      if (ruleNav.index) navigation.index = ruleNav.index;
    }

    // Get title info for duplicate cleaning
    const chapterTitle = detection.results.title.chapterTitle || '';
    const bookTitle = detection.results.title.bookTitle;

    // Process content with title info
    const processingOptions: ProcessingOptions = {
      removeSelectors: fallbackRule?.content.remove,
      replaceRules: fallbackRule?.content.replace,
      chapterTitle,
      bookTitle,
    };

    this.contentProcessor.setOptions(processingOptions);
    const rawContent = contentElement.innerHTML;
    const content = this.contentProcessor.process(contentElement, doc);

    return {
      title: chapterTitle || 'Unknown Chapter',
      bookTitle,
      content,
      rawContent,
      prevUrl: navigation.prev,
      nextUrl: navigation.next,
      indexUrl: navigation.index,
      url,
      confidence: detection.confidence.overall,
      rule: fallbackRule,
      method: fallbackRule ? 'mixed' : 'detection',
    };
  }

  /**
   * Quick check if page looks like a novel chapter
   */
  quickCheck(doc: Document = document): boolean {
    return this.detectionEngine.quickCheck(doc);
  }

  /**
   * Get detection results without parsing
   */
  detect(doc: Document = document, url?: string): DetectionEngineResult {
    return this.detectionEngine.detect(doc, url || doc.location?.href || window.location.href);
  }

  /**
   * Extract navigation links using rule
   */
  private extractNavigation(
    doc: Document,
    rule: SiteRule
  ): { prev?: string; next?: string; index?: string } {
    const result: { prev?: string; next?: string; index?: string } = {};

    if (rule.navigation?.prev && rule.navigation.prev !== false) {
      const el = this.selectElement(doc, rule.navigation.prev);
      if (el instanceof HTMLAnchorElement) {
        result.prev = el.href;
      }
    }

    if (rule.navigation?.next && rule.navigation.next !== false) {
      const el = this.selectElement(doc, rule.navigation.next);
      if (el instanceof HTMLAnchorElement) {
        result.next = el.href;
      }
    }

    if (rule.navigation?.index && rule.navigation.index !== false) {
      const el = this.selectElement(doc, rule.navigation.index);
      if (el instanceof HTMLAnchorElement) {
        result.index = el.href;
      }
    }

    return result;
  }

  /**
   * Extract title using rule
   */
  private extractTitle(doc: Document, rule: SiteRule): { chapter: string; book?: string } {
    let chapter = '';
    let book: string | undefined;

    // Try rule's title selector
    if (rule.title?.selector) {
      const el = this.selectElement(doc, rule.title.selector);
      if (el) {
        chapter = el.textContent?.trim() || '';
      }
    }

    // Try rule's title pattern on document.title
    if (!chapter && rule.title?.pattern) {
      const match = doc.title.match(new RegExp(rule.title.pattern));
      if (match) {
        // Support patternIndex to specify which capture group to use
        const patternIndex = (rule.title as { patternIndex?: number }).patternIndex ?? 1;
        chapter = match[patternIndex] || match[1] || match[0];

        // Also extract book title from pattern if configured
        const bookPatternIndex = (rule.title as { bookPatternIndex?: number }).bookPatternIndex;
        if (bookPatternIndex && match[bookPatternIndex]) {
          book = match[bookPatternIndex];
        }
      }
    }

    // Fallback to detection
    if (!chapter) {
      const currentUrl =
        doc.location?.href ||
        (doc as Document & { _mnrUrl?: string })._mnrUrl ||
        window.location.href;
      const detection = this.detectionEngine.detect(doc, currentUrl);
      chapter = detection.results.title.chapterTitle;
      book = book || detection.results.title.bookTitle;
    }

    // Try book title selector
    if (!book && rule.title?.bookSelector) {
      const el = this.selectElement(doc, rule.title.bookSelector);
      if (el) {
        book = el.textContent?.trim();
      }
    }

    // Apply title cleanup
    if (rule.title?.replace && chapter) {
      try {
        chapter = chapter.replace(new RegExp(rule.title.replace), '').trim();
      } catch {
        // Invalid regex
      }
    }

    return { chapter, book };
  }

  /**
   * Select element with error handling
   */
  private selectElement(doc: Document, selector: string): Element | null {
    const selectors = selector
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    for (const sel of selectors) {
      const el = this.smartSelect(doc, sel);
      if (el) return el;
    }

    return null;
  }

  /**
   * Minimal jQuery-like selector support (:contains, :eq, :last)
   */
  private smartSelect(doc: Document, selector: string): Element | null {
    // Try native selector first
    try {
      const native = doc.querySelector(selector);
      if (native) return native;
    } catch {
      // ignore and try custom parsing
    }

    // Handle :eq(n)
    const eqMatch = selector.match(/^(.*):eq\(([-]?\d+)\)$/);
    if (eqMatch) {
      const baseSel = eqMatch[1] || '*';
      const index = parseInt(eqMatch[2], 10);
      try {
        const nodes = Array.from(doc.querySelectorAll(baseSel));
        if (nodes.length === 0) return null;
        const idx = index >= 0 ? index : nodes.length + index;
        return nodes[idx] || null;
      } catch {
        return null;
      }
    }

    // Handle :last
    const lastMatch = selector.match(/^(.*):last(?:\(\))?$/);
    if (lastMatch) {
      const baseSel = lastMatch[1] || '*';
      try {
        const nodes = Array.from(doc.querySelectorAll(baseSel));
        return nodes.length ? nodes[nodes.length - 1] : null;
      } catch {
        return null;
      }
    }

    // Handle :first
    const firstMatch = selector.match(/^(.*):first(?:\(\))?$/);
    if (firstMatch) {
      const baseSel = firstMatch[1] || '*';
      try {
        const nodes = Array.from(doc.querySelectorAll(baseSel));
        return nodes.length ? nodes[0] : null;
      } catch {
        return null;
      }
    }

    // Handle one or more :contains("text")
    let currentSel = selector;
    const containsTexts: string[] = [];
    const containsRegex = /^(.*):contains\((['"]?)(.*?)\2\)$/;

    while (true) {
      const match = currentSel.match(containsRegex);
      if (!match) break;
      containsTexts.unshift(match[3]); // applied inner-most last
      currentSel = match[1];
    }

    if (containsTexts.length > 0) {
      const baseSel = currentSel.trim() || '*';
      try {
        let candidates = Array.from(doc.querySelectorAll(baseSel));
        for (const text of containsTexts) {
          candidates = candidates.filter(el => (el.textContent || '').includes(text));
        }
        return candidates[0] || null;
      } catch {
        return null;
      }
    }

    return null;
  }

  /**
   * Execute rule hooks
   */
  async executeHooks(rule: SiteRule, doc: Document, content: string): Promise<string> {
    let result = content;

    if (rule.hooks?.beforeParse) {
      try {
        const fn = new Function('doc', rule.hooks.beforeParse);
        fn(doc);
      } catch (e) {
        console.warn('[Parser] beforeParse hook error:', e);
      }
    }

    if (rule.hooks?.afterParse) {
      try {
        const fn = new Function('content', `return (${rule.hooks.afterParse})(content)`);
        result = fn(result) || result;
      } catch (e) {
        console.warn('[Parser] afterParse hook error:', e);
      }
    }

    return result;
  }
}

// Singleton instance
let parserInstance: Parser | null = null;

/**
 * Get the singleton Parser instance
 */
export function getParser(): Parser {
  if (!parserInstance) {
    parserInstance = new Parser();
  }
  return parserInstance;
}
