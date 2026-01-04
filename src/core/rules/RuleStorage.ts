/**
 * RuleStorage - Abstract storage layer for site rules
 * Supports IndexedDB (preferred) and GM_setValue fallback
 */

import { SitePreference, SiteRule, STORAGE_KEYS } from './types';

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

/** Storage driver interface */
export interface RuleStorageDriver {
  get(key: string): Promise<SiteRule | null>;
  set(key: string, rule: SiteRule): Promise<void>;
  delete(key: string): Promise<void>;
  getAll(): Promise<Map<string, SiteRule>>;
  getAllKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

/**
 * GM_setValue/getValue driver
 * Fallback for when IndexedDB is not available
 */
class GMStorageDriver implements RuleStorageDriver {
  private prefix: string;

  constructor(prefix: string = STORAGE_KEYS.RULE_PREFIX) {
    this.prefix = prefix;
  }

  async get(key: string): Promise<SiteRule | null> {
    try {
      const data = GM_getValue<unknown>(this.prefix + key, null);
      if (typeof data === 'string') {
        try {
          return JSON.parse(data) as SiteRule;
        } catch (e) {
          console.error(`[RuleStorage] Failed to parse rule ${key}:`, e);
          return null;
        }
      }
      return null;
    } catch (e) {
      console.debug('[RuleStorage] Failed to get rule:', key, e);
      return null;
    }
  }

  async set(key: string, rule: SiteRule): Promise<void> {
    GM_setValue(this.prefix + key, JSON.stringify(rule));
  }

  async delete(key: string): Promise<void> {
    GM_deleteValue(this.prefix + key);
  }

  async getAll(): Promise<Map<string, SiteRule>> {
    const result = new Map<string, SiteRule>();
    const keys = await this.getAllKeys();

    for (const key of keys) {
      const rule = await this.get(key);
      if (rule) {
        result.set(key, rule);
      }
    }

    return result;
  }

  async getAllKeys(): Promise<string[]> {
    const allKeys = GM_listValues();
    return allKeys.filter(k => k.startsWith(this.prefix)).map(k => k.slice(this.prefix.length));
  }

  async clear(): Promise<void> {
    const keys = await this.getAllKeys();
    for (const key of keys) {
      await this.delete(key);
    }
  }
}

/**
 * IndexedDB driver
 * Preferred storage for better performance with large rule sets
 */
class IndexedDBDriver implements RuleStorageDriver {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = 'MyNovelReader', storeName: string = 'rules') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async get(key: string): Promise<SiteRule | null> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async set(key: string, rule: SiteRule): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      // Ensure the key matches the rule id
      const ruleWithKey = { ...rule, id: key };
      const request = store.put(ruleWithKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAll(): Promise<Map<string, SiteRule>> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = new Map<string, SiteRule>();
        for (const rule of request.result) {
          result.set(rule.id, rule);
        }
        resolve(result);
      };
    });
  }

  async getAllKeys(): Promise<string[]> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string[]);
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/**
 * RuleStorage - Main storage class
 * Automatically selects best available driver
 */
export class RuleStorage {
  private driver: RuleStorageDriver;

  constructor() {
    // Use IndexedDB if available, fallback to GM storage
    if (typeof indexedDB !== 'undefined') {
      this.driver = new IndexedDBDriver();
    } else {
      this.driver = new GMStorageDriver();
    }
  }

  /**
   * Get a rule by domain
   */
  async getUserRule(domain: string): Promise<SiteRule | null> {
    const rule = await this.driver.get(domain);
    if (!rule) return null;

    const { sanitized, removedKeys } = sanitizeUserRuleHooks(rule);
    if (removedKeys.length > 0) {
      warnDroppedHookFields(domain, removedKeys);
      await this.driver.set(domain, sanitized);
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
    await this.driver.set(domain, sanitized);
  }

  /**
   * Delete a user rule
   */
  async deleteUserRule(domain: string): Promise<void> {
    await this.driver.delete(domain);
  }

  /**
   * Get all user rules
   */
  async getAllUserRules(): Promise<Map<string, SiteRule>> {
    const all = await this.driver.getAll();
    const sanitizedRules = new Map<string, SiteRule>();

    for (const [domain, rule] of all) {
      const { sanitized, removedKeys } = sanitizeUserRuleHooks(rule);
      sanitizedRules.set(domain, sanitized);

      if (removedKeys.length > 0) {
        warnDroppedHookFields(domain, removedKeys);
        await this.driver.set(domain, sanitized);
      }
    }

    return sanitizedRules;
  }

  /**
   * Get all rule domains
   */
  async getAllDomains(): Promise<string[]> {
    return this.driver.getAllKeys();
  }

  /**
   * Clear all user rules
   */
  async clearAllRules(): Promise<void> {
    await this.driver.clear();
  }

  /**
   * Export rules as JSON
   */
  async exportRules(): Promise<string> {
    const rules = await this.getAllUserRules();
    const rulesArray = Array.from(rules.values());
    return JSON.stringify(rulesArray, null, 2);
  }

  /**
   * Import rules from JSON
   */
  async importRules(json: string, overwrite: boolean = false): Promise<number> {
    let rules: unknown;
    try {
      rules = JSON.parse(json);
    } catch (e) {
      console.error('[MNR] Failed to parse imported rules JSON:', e);
      return 0;
    }

    if (!Array.isArray(rules)) {
      console.error('[MNR] Imported rules JSON must be an array.');
      return 0;
    }
    let count = 0;

    for (const rawRule of rules) {
      if (!rawRule || typeof rawRule !== 'object') continue;
      const rule = rawRule as SiteRule;
      if (!rule.id) continue;

      if (!overwrite) {
        const existing = await this.driver.get(rule.id);
        if (existing) continue;
      }

      const meta =
        typeof rule.meta === 'object' && rule.meta !== null
          ? rule.meta
          : ({} as Record<string, unknown>);
      const ruleToSave: SiteRule = {
        ...rule,
        meta: {
          ...meta,
          source: 'user',
          updated: Date.now(),
        },
      };

      const { sanitized, removedKeys } = sanitizeUserRuleHooks(ruleToSave);
      if (removedKeys.length > 0) {
        warnDroppedHookFields(ruleToSave.id, removedKeys);
      }
      await this.driver.set(ruleToSave.id, sanitized);
      count++;
    }

    return count;
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
