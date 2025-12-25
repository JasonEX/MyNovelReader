/**
 * Rule Saver Module
 *
 * Handles creation and saving of auto-generated rules from detection results.
 * Extracted from AutoEnableManager for better separation of concerns.
 *
 * @module RuleSaver
 */

import type { DetectionEngineResult } from '@/core/detection';
import { getRuleManager } from '@/core/rules/RuleManager';
import type { SiteRule } from '@/core/rules/types';

/**
 * Rule Saver - creates and saves rules from detection
 *
 * @example
 * ```typescript
 * const saver = new RuleSaver();
 * await saver.saveFromDetection(doc, detection);
 * ```
 */
export class RuleSaver {
  /**
   * Create a rule from detection results
   *
   * @param hostname - Site hostname
   * @param detection - Detection engine result
   * @returns Generated site rule
   */
  createRuleFromDetection(hostname: string, detection: DetectionEngineResult): SiteRule {
    const content = detection.results.content;
    const navigation = detection.results.navigation;
    const title = detection.results.title;
    const section = detection.results.section;

    // Generate URL pattern from hostname
    const hostPattern = hostname.replace(/\./g, '\\\\.');

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
        created: Date.now(),
      },
    };

    // Enable section merge if auto-detection indicates multi-page chapter
    if (section?.isSection && (section.confidence || 0) >= 0.8) {
      rule.advanced = { checkSection: true };
    }

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
   * Save a rule for the current site
   *
   * @param doc - Document to extract hostname from
   * @param detection - Detection engine result
   * @returns Promise that resolves when rule is saved
   */
  async saveFromDetection(doc: Document, detection: DetectionEngineResult): Promise<void> {
    if (!detection) return;

    const url = doc.location?.href || window.location.href;
    const hostname = new URL(url).hostname;

    // Create rule from detection results
    const rule = this.createRuleFromDetection(hostname, detection);

    // Save the rule
    const ruleManager = getRuleManager();
    await ruleManager.saveUserRule(hostname, rule);
  }

  /**
   * Validate a rule before saving
   *
   * @param rule - Rule to validate
   * @returns true if rule is valid
   */
  validateRule(rule: SiteRule): boolean {
    // Check required fields
    if (!rule.id || !rule.name || !rule.match) {
      return false;
    }

    // Check match pattern
    if (!rule.match.pattern) {
      return false;
    }

    // Check content selector
    if (!rule.content?.selector) {
      return false;
    }

    return true;
  }

  /**
   * Enhance an existing rule with detection results
   *
   * @param existingRule - Existing rule to enhance
   * @param detection - Detection engine result
   * @returns Enhanced rule
   */
  enhanceRule(existingRule: SiteRule, detection: DetectionEngineResult): SiteRule {
    const enhanced: SiteRule = {
      ...existingRule,
      content: { ...existingRule.content },
    };
    const content = detection.results.content;
    const navigation = detection.results.navigation;
    const title = detection.results.title;
    const section = detection.results.section;

    // Update content selector if detected and more specific
    if (content.selector && content.selector !== '#content') {
      enhanced.content = { ...enhanced.content, selector: content.selector };
    }

    // Update navigation if missing
    if (navigation.next || navigation.prev || navigation.index) {
      enhanced.navigation = enhanced.navigation || {};

      if (navigation.next && !enhanced.navigation.next) {
        enhanced.navigation.next = navigation.next.selector || navigation.next.url;
      }
      if (navigation.prev && !enhanced.navigation.prev) {
        enhanced.navigation.prev = navigation.prev.selector || navigation.prev.url;
      }
      if (navigation.index && !enhanced.navigation.index) {
        enhanced.navigation.index = navigation.index.selector || navigation.index.url;
      }
    }

    // Update title selector if detected
    if (title.selector && !enhanced.title) {
      enhanced.title = {
        selector: title.selector,
      };
    }

    // Enable section merge if detected
    if (section?.isSection && (section.confidence || 0) >= 0.8) {
      enhanced.advanced = enhanced.advanced || {};
      enhanced.advanced.checkSection = true;
    }

    // Update metadata
    const source = enhanced.meta?.source ?? 'user';
    enhanced.meta = { ...enhanced.meta, source, updated: Date.now() };

    return enhanced;
  }
}

/**
 * Create a rule saver instance
 *
 * @returns RuleSaver instance
 */
export function createRuleSaver(): RuleSaver {
  return new RuleSaver();
}
