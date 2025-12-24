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
import { getSiteProtection, type ProtectionOptions } from '@/core/protection';
import { type ParsedChapter, Parser } from '@/core/parser';
import { createRuleSaver } from '@/core/auto-enable/RuleSaver';
import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { getRuleManager } from '@/core/rules/RuleManager';
import { getRuleStorage } from '@/core/rules/RuleStorage';
import type { SiteRule } from '@/core/rules/types';

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

  constructor(options: AutoEnableOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.detectionEngine = new DetectionEngine();
    this.parser = new Parser({
      forceDetection: options.forceDetection,
    });
    this.sectionMerger = createSectionMerger(this.parser);
    this.ruleSaver = createRuleSaver();
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

        await this.launch(doc, decision);
      }
    }
  }

  /**
   * Launch the reader
   */
  private async launch(doc: Document, decision: AutoEnableDecision): Promise<void> {
    try {
      const currentUrl = doc.location?.href || window.location.href;
      const chapter = await this.sectionMerger.merge(doc, currentUrl);

      if (chapter && this.launchCallback) {
        this.launchCallback(chapter, decision.rule);
      }
    } catch (e) {
      console.error('[AutoEnableManager] Parse error:', e);
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
      protection.activate(this.options.protectionOptions);
      protection.removeOverlays();
    }

    // Parse and launch
    try {
      const currentUrl = doc.location?.href || window.location.href;
      const chapter = await this.sectionMerger.merge(doc, currentUrl);

      if (chapter && this.launchCallback) {
        this.launchCallback(chapter, undefined);
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
