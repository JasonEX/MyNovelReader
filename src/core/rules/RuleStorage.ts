/**
 * GM-backed storage for user rules and site preferences.
 */

import { type SitePreference, type SiteRule, STORAGE_KEYS } from './types';

function sanitizeUserRuleHooks(rule: SiteRule): { sanitized: SiteRule; removedKeys: string[] } {
  const removedKeys: string[] = [];
  const rawHooks = (rule as SiteRule & { hooks?: unknown }).hooks;
  if (rawHooks === undefined) {
    return { sanitized: rule, removedKeys };
  }

  const sanitized: SiteRule = { ...rule };

  if (!rawHooks || typeof rawHooks !== 'object' || Array.isArray(rawHooks)) {
    removedKeys.push('hooks');
    delete (sanitized as SiteRule & { hooks?: unknown }).hooks;
    return { sanitized, removedKeys };
  }

  const hooksObj = rawHooks as Record<string, unknown>;
  for (const key of Object.keys(hooksObj)) {
    if (key !== 'beforeParse') {
      removedKeys.push(key);
    }
  }

  const beforeParse = hooksObj.beforeParse;
  const keepBeforeParse = typeof beforeParse === 'string' && beforeParse.trim().length > 0;
  if (!keepBeforeParse && 'beforeParse' in hooksObj) {
    removedKeys.push('beforeParse');
  }

  if (keepBeforeParse) {
    (sanitized as SiteRule & { hooks?: Record<string, unknown> }).hooks = { beforeParse };
  } else {
    delete (sanitized as SiteRule & { hooks?: unknown }).hooks;
  }

  return { sanitized, removedKeys };
}

function warnDroppedHookFields(ruleId: string, removedKeys: string[]) {
  console.warn('[RuleStorage] Dropped unsupported hooks fields:', ruleId, removedKeys);
}

export class RuleStorage {
  private getRuleStorageKey(domain: string): string {
    return STORAGE_KEYS.RULE_PREFIX + domain;
  }

  private getStoredRule(domain: string): SiteRule | null {
    try {
      const data = GM_getValue<unknown>(this.getRuleStorageKey(domain), null);
      if (typeof data === 'string') {
        try {
          return JSON.parse(data) as SiteRule;
        } catch (e) {
          console.error(`[RuleStorage] Failed to parse rule ${domain}:`, e);
          return null;
        }
      }
      return null;
    } catch (e) {
      console.debug('[RuleStorage] Failed to get rule:', domain, e);
      return null;
    }
  }

  private setStoredRule(domain: string, rule: SiteRule): void {
    GM_setValue(this.getRuleStorageKey(domain), JSON.stringify(rule));
  }

  private deleteStoredRule(domain: string): void {
    GM_deleteValue(this.getRuleStorageKey(domain));
  }

  private getStoredDomains(): string[] {
    const allKeys = GM_listValues();
    return allKeys
      .filter(k => k.startsWith(STORAGE_KEYS.RULE_PREFIX))
      .map(k => k.slice(STORAGE_KEYS.RULE_PREFIX.length));
  }

  private getAllStoredRules(): Map<string, SiteRule> {
    const result = new Map<string, SiteRule>();
    for (const domain of this.getStoredDomains()) {
      const rule = this.getStoredRule(domain);
      if (rule) result.set(domain, rule);
    }
    return result;
  }

  /**
   * Get a rule by domain
   */
  async getUserRule(domain: string): Promise<SiteRule | null> {
    const rule = this.getStoredRule(domain);
    if (!rule) return null;

    const { sanitized, removedKeys } = sanitizeUserRuleHooks(rule);
    if (removedKeys.length > 0) {
      warnDroppedHookFields(domain, removedKeys);
      this.setStoredRule(domain, sanitized);
    }

    return sanitized;
  }

  /**
   * Save a user rule for a domain
   */
  async saveUserRule(domain: string, rule: SiteRule): Promise<void> {
    const ruleToSave: SiteRule = {
      ...rule,
      id: domain,
      meta: {
        ...rule.meta,
        source: 'user',
        updated: Date.now(),
      },
    };

    const { sanitized, removedKeys } = sanitizeUserRuleHooks(ruleToSave);
    if (removedKeys.length > 0) {
      warnDroppedHookFields(domain, removedKeys);
    }
    this.setStoredRule(domain, sanitized);
  }

  /**
   * Delete a user rule
   */
  async deleteUserRule(domain: string): Promise<void> {
    this.deleteStoredRule(domain);
  }

  /**
   * Get all user rules
   */
  async getAllUserRules(): Promise<Map<string, SiteRule>> {
    const all = this.getAllStoredRules();
    const sanitizedRules = new Map<string, SiteRule>();

    for (const [domain, rule] of all) {
      const { sanitized, removedKeys } = sanitizeUserRuleHooks(rule);
      sanitizedRules.set(domain, sanitized);

      if (removedKeys.length > 0) {
        warnDroppedHookFields(domain, removedKeys);
        this.setStoredRule(domain, sanitized);
      }
    }

    return sanitizedRules;
  }

  /**
   * Get all rule domains
   */
  async getAllDomains(): Promise<string[]> {
    return this.getStoredDomains();
  }

  // ========== Site Preferences (for auto-enable behavior) ==========

  /**
   * Get site preference for a domain
   */
  getSitePreference(domain: string): SitePreference | null {
    try {
      const stored = GM_getValue<unknown>(STORAGE_KEYS.SITE_PREFERENCES, {});
      const prefs = (typeof stored === 'object' && stored !== null ? stored : {}) as Record<
        string,
        SitePreference
      >;
      return prefs[domain] || null;
    } catch (e) {
      console.debug('[RuleStorage] Failed to get site preference:', domain, e);
      return null;
    }
  }

  /**
   * Set site preference for a domain
   */
  setSitePreference(domain: string, pref: SitePreference): void {
    try {
      const stored = GM_getValue<unknown>(STORAGE_KEYS.SITE_PREFERENCES, {});
      const prefs = (typeof stored === 'object' && stored !== null ? stored : {}) as Record<
        string,
        SitePreference
      >;
      prefs[domain] = pref;
      GM_setValue(STORAGE_KEYS.SITE_PREFERENCES, prefs);
    } catch (e) {
      console.error('[MNR] Failed to save site preference:', e);
    }
  }

  /**
   * Delete site preference for a domain
   */
  deleteSitePreference(domain: string): void {
    try {
      const stored = GM_getValue<unknown>(STORAGE_KEYS.SITE_PREFERENCES, {});
      const prefs = (typeof stored === 'object' && stored !== null ? stored : {}) as Record<
        string,
        SitePreference
      >;
      delete prefs[domain];
      GM_setValue(STORAGE_KEYS.SITE_PREFERENCES, prefs);
    } catch (e) {
      console.error('[MNR] Failed to delete site preference:', e);
    }
  }
}

// Singleton instance
let storageInstance: RuleStorage | null = null;

/**
 * Get the singleton RuleStorage instance
 */
export function getRuleStorage(): RuleStorage {
  if (!storageInstance) {
    storageInstance = new RuleStorage();
  }
  return storageInstance;
}
