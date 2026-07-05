/**
 * RuleManager - Central rule management
 * Handles loading, matching, and prioritizing rules
 */

import { RuleMatchResult, SiteRule } from './types';
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
  private builtInRules: SiteRule[] = curatedBuiltInRules;
  private userRulesCache: Map<string, SiteRule> = new Map();
  private initialized: boolean = false;
  private compiledCache = new WeakMap<SiteRule, { main: RegExp; excludes: RegExp[] }>();

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

    this.initialized = true;
  }

  /**
   * Match a URL against all rules
   * Priority: user > builtin
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

    // 3. Check built-in rules
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
   * Get or compile and cache the RegExp objects for a rule.
   * Uses WeakMap so entries are GC'd when the rule object is no longer referenced.
   */
  private getCompiledRule(rule: SiteRule): { main: RegExp; excludes: RegExp[] } {
    const cached = this.compiledCache.get(rule);
    if (cached) return cached;

    const main = toRegExp(rule.match.pattern, rule.match.type);
    const excludes = (rule.match.exclude ?? []).map(e => new RegExp(e, 'i'));
    const compiled = { main, excludes };
    this.compiledCache.set(rule, compiled);
    return compiled;
  }

  /**
   * Check if a rule matches a URL
   */
  private matchesUrl(rule: SiteRule, url: string): boolean {
    try {
      const { main, excludes } = this.getCompiledRule(rule);
      if (!main.test(url)) return false;

      for (const exclude of excludes) {
        if (exclude.test(url)) {
          return false;
        }
      }

      return true;
    } catch (e) {
      console.debug('[RuleManager] Rule match error for pattern:', rule.match.pattern, e);
      return false;
    }
  }

  /**
   * Save a user rule
   */
  async saveUserRule(domain: string, rule: SiteRule): Promise<void> {
    await this.storage.saveUserRule(domain, rule);
    const saved = await this.storage.getUserRule(domain);
    if (saved) {
      this.userRulesCache.set(domain, saved);
    } else {
      this.userRulesCache.set(domain, rule);
    }
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
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
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
