/**
 * AutoEnableManager - Manages automatic detection and enabling of novel reader
 *
 * Flow:
 * 1. Check if domain has saved user rule → auto-launch
 * 2. Check if built-in rule matches → auto-launch
 * 3. Run auto-detection → show prompt if confidence >= threshold
 * 4. User confirms → optionally save rule → launch reader
 */

import { DetectionEngine, type DetectionEngineResult } from '@/core/detection';
import {
  getSiteProtection,
  isCloudflareChallenge,
  type ProtectionOptions,
} from '@/core/protection';
import { type ParsedChapter, Parser } from '@/core/parser';
import { createRuleSaver } from '@/core/auto-enable/RuleSaver';
import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { getPageKind } from '@/core/auto-enable/PageKind';
import { getRuleManager } from '@/core/rules/RuleManager';
import { getRuleStorage } from '@/core/rules/RuleStorage';
import type { SiteRule } from '@/core/rules/types';

/** Auto-enable decision result */
export interface AutoEnableDecision {
  /** Whether to show the reader */
  shouldEnable: boolean;
  /** How the decision was made */
  method:
    | 'user-rule'
    | 'builtin-rule'
    | 'detection'
    | 'manual'
    | 'user-disabled'
    | 'site-preference';
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
  /** Options for site protection */
  protectionOptions?: ProtectionOptions;
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
  private sectionMerger: ReturnType<typeof createSectionMerger>;
  private ruleSaver: ReturnType<typeof createRuleSaver>;
  private promptCallback?: PromptCallback;
  private launchCallback?: LaunchCallback;
  private hasRun = false;
  private currentDecision?: AutoEnableDecision;
  private currentDecisionUrl?: string;

  private recordDecision(url: string, decision: AutoEnableDecision): AutoEnableDecision {
    this.currentDecision = decision;
    this.currentDecisionUrl = url;
    return decision;
  }

  constructor(options: AutoEnableOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.detectionEngine = new DetectionEngine();
    this.parser = new Parser({
      forceDetection: options.forceDetection,
    });
    this.sectionMerger = createSectionMerger(this.parser);
    this.ruleSaver = createRuleSaver();
  }

  updateOptions(options: AutoEnableOptions = {}): void {
    this.options = { ...this.options, ...options };
    if (Object.prototype.hasOwnProperty.call(options, 'forceDetection')) {
      this.parser = new Parser({
        forceDetection: options.forceDetection,
      });
      this.sectionMerger = createSectionMerger(this.parser);
    }
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
    const decide = (decision: AutoEnableDecision): AutoEnableDecision =>
      this.recordDecision(url, decision);

    if (isCloudflareChallenge(doc)) {
      return decide({
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['Cloudflare Challenge 页面，等待验证完成'],
      });
    }

    // Check skip patterns
    if (this.shouldSkip(url)) {
      return decide({
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['URL matches skip pattern'],
      });
    }

    const pageKind = getPageKind(url, doc);
    if (pageKind === 'toc') {
      return decide({
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['目录页，跳过自动启用'],
      });
    }

    if (pageKind !== 'chapter') {
      return decide({
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['非正文页，跳过自动启用'],
      });
    }

    let hostname: string | null = null;
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = null;
    }

    // Check site preference (only applies to chapter pages)
    if (hostname) {
      const storage = getRuleStorage();
      const pref = storage.getSitePreference(hostname);
      if (pref?.enabled === false) {
        // User previously exited reader on this site, don't auto-enable
        // But still show floating button so they can manually enable
        return decide({
          shouldEnable: false,
          method: 'user-disabled',
          confidence: 0,
          reasons: ['用户已关闭该站点自动启用'],
          showFloatingButton: true,
        });
      }
      if (pref?.enabled === true) {
        return decide({
          shouldEnable: true,
          method: 'site-preference',
          confidence: 1,
          reasons: ['用户已为该站点开启自动启用'],
        });
      }
    }

    // Check for saved user / built-in rules first.
    // Explicit rules should still apply even if quickCheck is a false negative.
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
        return decide(decision);
      }
    }

    // Quick check before running full detection
    if (!this.detectionEngine.quickCheck(doc)) {
      return decide({
        shouldEnable: false,
        method: 'manual',
        confidence: 0,
        reasons: ['Page does not appear to be novel content'],
      });
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

    return decide(decision);
  }

  /**
   * Execute the auto-enable flow
   */
  async execute(doc: Document = document): Promise<void> {
    if (this.hasRun) {
      return;
    }
    this.hasRun = true;

    const currentUrl = doc.location?.href || window.location.href;
    const decision =
      this.currentDecision && this.currentDecisionUrl === currentUrl
        ? this.currentDecision
        : await this.check(doc);

    if (!decision.shouldEnable) {
      return;
    }

    // Enable site protection first
    if (this.options.enableProtection) {
      const protection = getSiteProtection();
      protection.activate(this.options.protectionOptions);
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

        const launched = await this.launch(doc, decision);
        if (launched) {
          this.rememberSiteEnabled(doc);
        }
      }
    }
  }

  /**
   * Launch the reader
   */
  private async launch(doc: Document, decision: AutoEnableDecision): Promise<boolean> {
    try {
      const currentUrl = doc.location?.href || window.location.href;
      const chapter = await this.sectionMerger.merge(doc, currentUrl);

      if (chapter && this.launchCallback) {
        this.launchCallback(chapter, decision.rule);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[AutoEnableManager] Parse error:', e);
      return false;
    }
  }

  private rememberSiteEnabled(doc: Document): void {
    const url = doc.location?.href || window.location.href;
    if (getPageKind(url, doc) !== 'chapter') return;

    try {
      const hostname = new URL(url).hostname;
      const storage = getRuleStorage();
      storage.setSitePreference(hostname, { enabled: true, timestamp: Date.now() });
    } catch (e) {
      console.error('[AutoEnableManager] Failed to save site preference:', e);
    }
  }

  /**
   * Save detection result as user rule for current site
   */
  private async saveRuleForCurrentSite(doc: Document, decision: AutoEnableDecision): Promise<void> {
    if (!decision.detection) return;

    await this.ruleSaver.saveFromDetection(doc, decision.detection);
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
    this.currentDecisionUrl = undefined;
  }

  /**
   * Manual enable (force launch without detection)
   */
  async manualEnable(doc: Document = document): Promise<void> {
    // Enable protection
    if (this.options.enableProtection) {
      const protection = getSiteProtection();
      protection.activate(this.options.protectionOptions);
      protection.removeOverlays();
    }

    // Parse and launch
    try {
      const currentUrl = doc.location?.href || window.location.href;
      const chapter = await this.sectionMerger.merge(doc, currentUrl);

      if (chapter && this.launchCallback) {
        this.launchCallback(chapter, undefined);
        this.rememberSiteEnabled(doc);
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
  } else if (options) {
    managerInstance.updateOptions(options);
  }
  return managerInstance;
}
