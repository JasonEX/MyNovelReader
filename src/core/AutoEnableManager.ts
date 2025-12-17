/**
 * AutoEnableManager - Manages automatic detection and enabling of novel reader
 *
 * Flow:
 * 1. Check if domain has saved user rule → auto-launch
 * 2. Check if built-in rule matches → auto-launch
 * 3. Run auto-detection → show prompt if confidence >= threshold
 * 4. User confirms → optionally save rule → launch reader
 */

import { CHAPTER_TEXT_PATTERNS, SECTION_TEXT_PATTERNS } from '@/core/constants';
import { DetectionEngine, DetectionEngineResult } from '@/core/detection';
import { getParser, ParsedChapter, Parser } from '@/core/parser';
import { joinHtml, normalizeAbsoluteUrl } from '@/core/utils';
import { getRuleManager } from '@/core/rules/RuleManager';
import { getRuleStorage } from '@/core/rules/RuleStorage';
import { getSiteProtection } from '@/core/protection';
import { SiteRule } from '@/core/rules/types';

/** Get GM_xmlhttpRequest function */
function getGmXhr(): typeof GM_xmlhttpRequest | null {
  if (typeof GM_xmlhttpRequest === 'function') {
    return GM_xmlhttpRequest;
  }
  return null;
}

/** Fetch URL and return parsed Document */
function fetchUrl(url: string, referer?: string): Promise<Document | null> {
  const gmXhr = getGmXhr();

  if (!gmXhr) {
    return Promise.resolve(null);
  }

  return new Promise<Document | null>(resolve => {
    const headers: Record<string, string> = {
      Accept: 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    };
    if (referer) {
      headers['Referer'] = referer;
    }
    gmXhr({
      method: 'GET',
      url,
      headers,
      overrideMimeType: 'text/html;charset=' + document.characterSet,
      onload: response => {
        if (response.status >= 200 && response.status < 300) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            // Set base URL for relative links
            const base = doc.createElement('base');
            base.href = url;
            doc.head.insertBefore(base, doc.head.firstChild);
            // Store URL in a custom property
            (doc as Document & { _mnrUrl: string })._mnrUrl = url;
            resolve(doc);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      },
      onerror: () => resolve(null),
      ontimeout: () => resolve(null),
    });
  });
}

/**
 * Check if nextUrl looks like a section URL relative to currentUrl
 * E.g., /123.html -> /123_2.html or /123_2.html -> /123_3.html
 */
function isSectionLikeUrl(currentUrl: string, nextUrl: string): boolean {
  try {
    const current = new URL(currentUrl);
    const next = new URL(nextUrl);
    if (current.host !== next.host) return false;

    const currentPath = current.pathname;
    const nextPath = next.pathname;

    // Pattern 1: /123.html -> /123_2.html (first page to second page)
    const firstPageMatch = currentPath.match(/\/(\d+)\.html?$/i);
    const secondPageMatch = nextPath.match(/\/(\d+)[_-]2\.html?$/i);
    if (firstPageMatch && secondPageMatch && firstPageMatch[1] === secondPageMatch[1]) {
      return true;
    }

    // Pattern 2: /123_2.html -> /123_3.html (consecutive sections)
    const sectionMatch1 = currentPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
    const sectionMatch2 = nextPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
    if (sectionMatch1 && sectionMatch2 && sectionMatch1[1] === sectionMatch2[1]) {
      const s1 = parseInt(sectionMatch1[2], 10);
      const s2 = parseInt(sectionMatch2[2], 10);
      if (s2 === s1 + 1) return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Find the real next chapter URL from a document
 * Looks for links with "下一章" text that are not section links
 */
function findNextChapterUrl(doc: Document, currentUrl: string): string | null {
  const links = doc.querySelectorAll('a[href]');

  for (const link of links) {
    const anchor = link as HTMLAnchorElement;
    const text = anchor.textContent?.trim() || '';

    // Must match chapter pattern, not section pattern
    const isChapter = CHAPTER_TEXT_PATTERNS.some(p => p.test(text));
    const isSection = SECTION_TEXT_PATTERNS.some(p => p.test(text));

    if (isChapter && !isSection) {
      const href = anchor.href;
      // Verify it's not a section URL
      if (!isSectionLikeUrl(currentUrl, href)) {
        return href;
      }
    }
  }

  return null;
}

/** Auto-enable decision result */
export interface AutoEnableDecision {
  /** Whether to show the reader */
  shouldEnable: boolean;
  /** How the decision was made */
  method: 'user-rule' | 'builtin-rule' | 'detection' | 'manual' | 'user-disabled';
  /** Confidence level (0-1) */
  confidence: number;
  /** The rule to use (if any) */
  rule?: SiteRule;
  /** Detection result (if detection was used) */
  detection?: DetectionEngineResult;
  /** Reasons for the decision */
  reasons: string[];
  /** Whether to show the floating button (even if not auto-enabling) */
  showFloatingButton?: boolean;
}

/** User prompt response */
export interface UserPromptResponse {
  /** User accepted */
  accepted: boolean;
  /** Save rule for future auto-enable */
  saveForDomain: boolean;
}

/** Callback for showing prompt to user */
export type PromptCallback = (decision: AutoEnableDecision) => Promise<UserPromptResponse>;

/** Callback when reader should launch */
export type LaunchCallback = (chapter: ParsedChapter, rule?: SiteRule) => void;

/** Auto-enable options */
export interface AutoEnableOptions {
  /** Minimum confidence for auto-prompt (default: 0.6) */
  confidenceThreshold?: number;
  /** Minimum confidence for auto-launch without prompt (default: 0.9) */
  autoLaunchThreshold?: number;
  /** Enable site protection measures */
  enableProtection?: boolean;
  /** Skip detection if URL matches these patterns */
  skipPatterns?: RegExp[];
  /** Force detection mode (ignore rules) */
  forceDetection?: boolean;
}

const DEFAULT_OPTIONS: AutoEnableOptions = {
  confidenceThreshold: 0.6,
  autoLaunchThreshold: 0.9,
  enableProtection: true,
  skipPatterns: [
    /\/(login|register|auth|account)/i,
    /\/(search|find)/i,
    /\/(cart|checkout|pay)/i,
    /\/(user|profile|setting)/i,
    /\/(forum|comment|review)/i,
    /\/(download|upload)/i,
  ],
};

export class AutoEnableManager {
  private options: AutoEnableOptions;
  private detectionEngine: DetectionEngine;
  private parser: Parser;
  private promptCallback?: PromptCallback;
  private launchCallback?: LaunchCallback;
  private hasRun = false;
  private currentDecision?: AutoEnableDecision;

  constructor(options: AutoEnableOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.detectionEngine = new DetectionEngine();
    this.parser = new Parser({
      forceDetection: options.forceDetection,
    });
  }

  /**
   * Set the callback for prompting user
   */
  setPromptCallback(callback: PromptCallback): void {
    this.promptCallback = callback;
  }

  /**
   * Set the callback for launching reader
   */
  setLaunchCallback(callback: LaunchCallback): void {
    this.launchCallback = callback;
  }

  /**
   * Run the auto-enable check
   */
  async check(doc: Document = document): Promise<AutoEnableDecision> {
    const url = doc.location?.href || window.location.href;
    const hostname = new URL(url).hostname;

    // Check site preference first (user-disabled takes priority)
    const storage = getRuleStorage();
    const pref = storage.getSitePreference(hostname);
    if (pref?.enabled === false) {
      // User previously exited reader on this site, don't auto-enable
      // But still show floating button so they can manually enable
      return {
        shouldEnable: false,
        method: 'user-disabled',
        confidence: 0,
        reasons: ['User previously disabled auto-enable for this site'],
        showFloatingButton: true,
      };
    }

    // Check skip patterns
    if (this.shouldSkip(url)) {
      return {
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['URL matches skip pattern'],
      };
    }

    // Quick check first
    if (!this.detectionEngine.quickCheck(doc)) {
      return {
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['Page does not appear to be novel content'],
      };
    }

    // Check for saved user rule
    if (!this.options.forceDetection) {
      const ruleManager = getRuleManager();
      await ruleManager.initialize();
      const ruleMatch = await ruleManager.matchRule(url);

      if (ruleMatch) {
        const decision: AutoEnableDecision = {
          shouldEnable: true,
          method: ruleMatch.rule.meta?.source === 'user' ? 'user-rule' : 'builtin-rule',
          confidence: 1.0,
          rule: ruleMatch.rule,
          reasons: [
            `Matched ${ruleMatch.rule.meta?.source || 'builtin'} rule: ${ruleMatch.rule.name || ruleMatch.rule.id}`,
          ],
        };
        this.currentDecision = decision;
        return decision;
      }
    }

    // Run detection
    const detection = this.detectionEngine.detect(doc, doc.location?.href || window.location.href);

    const decision: AutoEnableDecision = {
      shouldEnable: detection.confidence.overall >= (this.options.confidenceThreshold || 0.6),
      method: 'detection',
      confidence: detection.confidence.overall,
      detection,
      reasons: detection.confidence.reasons,
    };

    this.currentDecision = decision;
    return decision;
  }

  /**
   * Execute the auto-enable flow
   */
  async execute(doc: Document = document): Promise<void> {
    if (this.hasRun) {
      return;
    }
    this.hasRun = true;

    const decision = await this.check(doc);

    if (!decision.shouldEnable) {
      return;
    }

    // Enable site protection first
    if (this.options.enableProtection) {
      const protection = getSiteProtection();
      protection.activate();
      protection.removeOverlays();
    }

    // Auto-launch for high confidence or rule match
    const shouldAutoLaunch =
      decision.method === 'user-rule' ||
      decision.method === 'builtin-rule' ||
      decision.confidence >= (this.options.autoLaunchThreshold || 0.9);

    if (shouldAutoLaunch) {
      await this.launch(doc, decision);
      return;
    }

    // Show prompt for medium confidence detection
    if (this.promptCallback) {
      const response = await this.promptCallback(decision);

      if (response.accepted) {
        // Save rule if requested
        if (response.saveForDomain) {
          await this.saveRuleForCurrentSite(doc, decision);
        }

        await this.launch(doc, decision);
      }
    }
  }

  /**
   * Launch the reader
   */
  private async launch(doc: Document, decision: AutoEnableDecision): Promise<void> {
    try {
      const chapter = await this.parser.parse(doc);

      if (chapter && this.launchCallback) {
        const currentUrl = doc.location?.href || window.location.href;

        // Check if we need to merge sections
        const enableByRule =
          !!chapter.rule?.advanced?.checkSection && !chapter.rule?.advanced?.noSection;
        const shouldMerge =
          enableByRule && chapter.nextUrl && isSectionLikeUrl(currentUrl, chapter.nextUrl);

        if (shouldMerge) {
          // Merge all section pages
          const merged = await this.mergeSectionPages(chapter, currentUrl);
          this.launchCallback(merged, decision.rule);
        } else {
          // No section merge needed, but still fix nextUrl if it points to a section
          if (chapter.nextUrl && isSectionLikeUrl(currentUrl, chapter.nextUrl)) {
            const realNextChapterUrl = findNextChapterUrl(doc, currentUrl);
            if (realNextChapterUrl) {
              chapter.nextUrl = realNextChapterUrl;
            }
          }
          this.launchCallback(chapter, decision.rule);
        }
      }
    } catch (e) {
      console.error('[AutoEnableManager] Parse error:', e);
    }
  }

  /**
   * Merge all section pages into a single chapter
   */
  private async mergeSectionPages(
    firstChapter: ParsedChapter,
    currentUrl: string
  ): Promise<ParsedChapter> {
    const parser = getParser();
    let mergedContent = firstChapter.content;
    let mergedRaw = firstChapter.rawContent;
    let nextSectionUrl = firstChapter.nextUrl;
    let nextChapterUrl: string | null = null;
    let lastUrl = currentUrl;

    // Merge up to 10 pages to avoid infinite loops
    const seen = new Set<string>([currentUrl]);
    for (let i = 0; i < 10 && nextSectionUrl; i++) {
      const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
      if (seen.has(absNextSection)) break;
      seen.add(absNextSection);

      // Check if this is still a section URL
      if (!isSectionLikeUrl(lastUrl, absNextSection)) {
        // This is the next chapter, not a section
        nextChapterUrl = absNextSection;
        break;
      }

      const nextDoc = await fetchUrl(absNextSection, lastUrl);
      if (!nextDoc) break;

      const nextParsed = await parser.parse(nextDoc, absNextSection);
      if (!nextParsed) break;

      mergedContent = joinHtml(mergedContent, nextParsed.content);
      mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);

      // Check if next page's nextUrl is a section or chapter
      if (nextParsed.nextUrl) {
        if (isSectionLikeUrl(absNextSection, nextParsed.nextUrl)) {
          nextSectionUrl = nextParsed.nextUrl;
        } else {
          // Next page's nextUrl is the next chapter
          nextChapterUrl = nextParsed.nextUrl;
          nextSectionUrl = null;
        }
      } else {
        nextSectionUrl = null;
      }

      lastUrl = absNextSection;
    }

    return {
      ...firstChapter,
      content: mergedContent,
      rawContent: mergedRaw,
      nextUrl: nextChapterUrl || firstChapter.nextUrl,
    };
  }

  /**
   * Save detection result as user rule for current site
   */
  private async saveRuleForCurrentSite(doc: Document, decision: AutoEnableDecision): Promise<void> {
    if (!decision.detection) return;

    const url = doc.location?.href || window.location.href;
    const hostname = new URL(url).hostname;

    // Create rule from detection results
    const rule = this.createRuleFromDetection(hostname, decision.detection);

    const ruleManager = getRuleManager();
    await ruleManager.saveUserRule(hostname, rule);
  }

  /**
   * Create a SiteRule from detection results
   */
  createRuleFromDetection(hostname: string, detection: DetectionEngineResult): SiteRule {
    const content = detection.results.content;
    const navigation = detection.results.navigation;
    const title = detection.results.title;

    // Generate URL pattern from hostname
    const hostPattern = hostname.replace(/\./g, '\\.');

    const rule: SiteRule = {
      id: `user-${hostname}-${Date.now()}`,
      name: `Auto-generated rule for ${hostname}`,
      version: 1,
      match: {
        pattern: `^https?://${hostPattern}/`,
        type: 'regex',
      },
      content: {
        selector: content.selector || '#content',
      },
      meta: {
        source: 'user',
        autoLaunch: true,
        createdAt: new Date().toISOString(),
      },
    };

    // Add navigation if detected
    if (navigation.next || navigation.prev || navigation.index) {
      rule.navigation = {};

      if (navigation.next) {
        rule.navigation.next = navigation.next.selector || navigation.next.url;
      }
      if (navigation.prev) {
        rule.navigation.prev = navigation.prev.selector || navigation.prev.url;
      }
      if (navigation.index) {
        rule.navigation.index = navigation.index.selector || navigation.index.url;
      }
    }

    // Add title selector if detected
    if (title.selector) {
      rule.title = {
        selector: title.selector,
      };
    }

    return rule;
  }

  /**
   * Check if URL should be skipped
   */
  private shouldSkip(url: string): boolean {
    return (this.options.skipPatterns || []).some(pattern => pattern.test(url));
  }

  /**
   * Get the current decision
   */
  getDecision(): AutoEnableDecision | undefined {
    return this.currentDecision;
  }

  /**
   * Reset manager state (for testing)
   */
  reset(): void {
    this.hasRun = false;
    this.currentDecision = undefined;
  }

  /**
   * Manual enable (force launch without detection)
   */
  async manualEnable(doc: Document = document): Promise<void> {
    // Save site preference - user wants reader on this site
    const url = doc.location?.href || window.location.href;
    try {
      const hostname = new URL(url).hostname;
      const storage = getRuleStorage();
      storage.setSitePreference(hostname, { enabled: true, timestamp: Date.now() });
    } catch (e) {
      console.error('[AutoEnableManager] Failed to save site preference:', e);
    }

    // Enable protection
    if (this.options.enableProtection) {
      const protection = getSiteProtection();
      protection.activate();
      protection.removeOverlays();
    }

    // Parse and launch
    try {
      const chapter = await this.parser.parse(doc);

      if (chapter && this.launchCallback) {
        const currentUrl = doc.location?.href || window.location.href;

        // Check if we need to merge sections
        const enableByRule =
          !!chapter.rule?.advanced?.checkSection && !chapter.rule?.advanced?.noSection;
        const shouldMerge =
          enableByRule && chapter.nextUrl && isSectionLikeUrl(currentUrl, chapter.nextUrl);

        if (shouldMerge) {
          // Merge all section pages
          const merged = await this.mergeSectionPages(chapter, currentUrl);
          this.launchCallback(merged, undefined);
        } else {
          // No section merge needed, but still fix nextUrl if it points to a section
          if (chapter.nextUrl && isSectionLikeUrl(currentUrl, chapter.nextUrl)) {
            const realNextChapterUrl = findNextChapterUrl(doc, currentUrl);
            if (realNextChapterUrl) {
              chapter.nextUrl = realNextChapterUrl;
            }
          }
          this.launchCallback(chapter, undefined);
        }
      }
    } catch (e) {
      console.error('[AutoEnableManager] Manual enable error:', e);
    }
  }
}

// Singleton instance
let managerInstance: AutoEnableManager | null = null;

/**
 * Get the singleton AutoEnableManager instance
 */
export function getAutoEnableManager(options?: AutoEnableOptions): AutoEnableManager {
  if (!managerInstance) {
    managerInstance = new AutoEnableManager(options);
  }
  return managerInstance;
}
