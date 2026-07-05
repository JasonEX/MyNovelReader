/**
 * GM-backed storage for site preferences.
 */

import { type SitePreference, STORAGE_KEYS } from './types';

export class RuleStorage {
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
