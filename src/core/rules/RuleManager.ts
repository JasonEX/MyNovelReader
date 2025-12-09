/**
 * RuleManager - Central rule management
 * Handles loading, matching, and prioritizing rules
 */

import { DEFAULT_COMMUNITY_RULES_URL, RuleMatchResult, SiteRule } from './types';
import { builtInRules as curatedBuiltInRules } from './builtInRules';
import { RuleStorage } from './RuleStorage';

/** Glob to regex conversion */
function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

/** Convert pattern string to RegExp */
function toRegExp(pattern: string, type: 'regex' | 'glob' = 'regex'): RegExp {
  if (type === 'glob') {
    return globToRegex(pattern);
  }
  return new RegExp(pattern, 'i');
}

export class RuleManager {
  private storage: RuleStorage;
  private builtInRules: SiteRule[] = [];
  private communityRules: SiteRule[] = [];
  private userRulesCache: Map<string, SiteRule> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.storage = new RuleStorage();
  }

  /**
   * Initialize the rule manager
   * Loads all rules from various sources
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Load user rules from storage
    this.userRulesCache = await this.storage.getAllUserRules();

    // Load built-in rules
    this.builtInRules = await this.loadBuiltInRules();

    // Load community rules (optional, async)
    this.loadCommunityRules().catch(() => {
      // Silently fail for community rules
    });

    this.initialized = true;
  }

  /**
   * Match a URL against all rules
   * Priority: user > community > builtin
   */
  async matchRule(url: string): Promise<RuleMatchResult | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Extract domain from URL
    const domain = this.extractDomain(url);

    // 1. Check user rules first (by domain)
    const userRule = this.userRulesCache.get(domain);
    if (userRule && this.matchesUrl(userRule, url)) {
      return {
        rule: userRule,
        source: 'user',
        matchedPattern: userRule.match.pattern,
      };
    }

    // 2. Check all user rules by pattern
    for (const [, rule] of this.userRulesCache) {
      if (this.matchesUrl(rule, url)) {
        return {
          rule,
          source: 'user',
          matchedPattern: rule.match.pattern,
        };
      }
    }

    // 3. Check community rules
    for (const rule of this.communityRules) {
      if (this.matchesUrl(rule, url)) {
        return {
          rule,
          source: 'community',
          matchedPattern: rule.match.pattern,
        };
      }
    }

    // 4. Check built-in rules
    for (const rule of this.builtInRules) {
      if (this.matchesUrl(rule, url)) {
        return {
          rule,
          source: 'builtin',
          matchedPattern: rule.match.pattern,
        };
      }
    }

    return null;
  }

  /**
   * Check if a rule matches a URL
   */
  private matchesUrl(rule: SiteRule, url: string): boolean {
    try {
      const regex = toRegExp(rule.match.pattern, rule.match.type);
      if (!regex.test(url)) return false;

      // Check excludes
      if (rule.match.exclude) {
        for (const exclude of rule.match.exclude) {
          if (new RegExp(exclude, 'i').test(url)) {
            return false;
          }
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save a user rule
   */
  async saveUserRule(domain: string, rule: SiteRule): Promise<void> {
    await this.storage.saveUserRule(domain, rule);
    this.userRulesCache.set(domain, rule);
  }

  /**
   * Delete a user rule
   */
  async deleteUserRule(domain: string): Promise<void> {
    await this.storage.deleteUserRule(domain);
    this.userRulesCache.delete(domain);
  }

  /**
   * Get a user rule by domain
   */
  getUserRule(domain: string): SiteRule | undefined {
    return this.userRulesCache.get(domain);
  }

  /**
   * Get all user rules
   */
  getAllUserRules(): Map<string, SiteRule> {
    return this.userRulesCache;
  }

  /**
   * Get all built-in rules
   */
  getBuiltInRules(): SiteRule[] {
    return this.builtInRules;
  }

  /**
   * Get the storage instance
   */
  getStorage(): RuleStorage {
    return this.storage;
  }

  /**
   * Load built-in rules
   * Uses curated rules from builtInRules.ts (already in v2 format)
   */
  private async loadBuiltInRules(): Promise<SiteRule[]> {
    // Use curated built-in rules
    return curatedBuiltInRules;
  }

  /**
   * Load community rules from remote URL
   */
  private async loadCommunityRules(): Promise<void> {
    try {
      const response = await fetch(DEFAULT_COMMUNITY_RULES_URL);
      if (!response.ok) return;

      const rules: SiteRule[] = await response.json();
      this.communityRules = rules.filter(this.validateRule);
    } catch {
      // Silently fail
    }
  }

  /**
   * Validate a rule has required fields
   */
  private validateRule(rule: SiteRule): boolean {
    return !!(rule.id && rule.match?.pattern && rule.content?.selector);
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  /**
   * Export all user rules
   */
  async exportUserRules(): Promise<string> {
    return this.storage.exportRules();
  }

  /**
   * Import user rules
   */
  async importUserRules(json: string, overwrite: boolean = false): Promise<number> {
    const count = await this.storage.importRules(json, overwrite);
    // Refresh cache
    this.userRulesCache = await this.storage.getAllUserRules();
    return count;
  }

  /**
   * Clear all user rules
   */
  async clearUserRules(): Promise<void> {
    await this.storage.clearAllRules();
    this.userRulesCache.clear();
  }

  /**
   * Get statistics
   */
  getStats(): { user: number; community: number; builtin: number } {
    return {
      user: this.userRulesCache.size,
      community: this.communityRules.length,
      builtin: this.builtInRules.length,
    };
  }
}

// Singleton instance
let ruleManagerInstance: RuleManager | null = null;

/**
 * Get the singleton RuleManager instance
 */
export function getRuleManager(): RuleManager {
  if (!ruleManagerInstance) {
    ruleManagerInstance = new RuleManager();
  }
  return ruleManagerInstance;
}
