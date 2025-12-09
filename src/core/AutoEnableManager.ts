/**
 * AutoEnableManager - Manages automatic detection and enabling of novel reader
 *
 * Flow:
 * 1. Check if domain has saved user rule → auto-launch
 * 2. Check if built-in rule matches → auto-launch
 * 3. Run auto-detection → show prompt if confidence >= threshold
 * 4. User confirms → optionally save rule → launch reader
 */

import { DetectionEngine, DetectionEngineResult } from '@/core/detection';
import { ParsedChapter, Parser } from '@/core/parser';
import { getRuleManager } from '@/core/rules/RuleManager';
import { getSiteProtection } from '@/core/protection';
import { SiteRule } from '@/core/rules/types';

/** Auto-enable decision result */
export interface AutoEnableDecision {
  /** Whether to show the reader */
  shouldEnable: boolean;
  /** How the decision was made */
  method: 'user-rule' | 'builtin-rule' | 'detection' | 'manual';
  /** Confidence level (0-1) */
  confidence: number;
  /** The rule to use (if any) */
  rule?: SiteRule;
  /** Detection result (if detection was used) */
  detection?: DetectionEngineResult;
  /** Reasons for the decision */
  reasons: string[];
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
    const detection = this.detectionEngine.detect(doc);

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

      if (navigation.next?.selector) {
        rule.navigation.next = navigation.next.selector;
      }
      if (navigation.prev?.selector) {
        rule.navigation.prev = navigation.prev.selector;
      }
      if (navigation.index?.selector) {
        rule.navigation.index = navigation.index.selector;
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
