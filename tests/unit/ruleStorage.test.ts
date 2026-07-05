import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RuleStorage } from '@/core/rules/RuleStorage';

describe('RuleStorage', () => {
  const gmStore = new Map<string, unknown>();

  beforeEach(() => {
    gmStore.clear();
    vi.stubGlobal('GM_getValue', (key: string, defaultValue?: unknown) =>
      gmStore.has(key) ? gmStore.get(key) : defaultValue
    );
    vi.stubGlobal('GM_setValue', (key: string, value: unknown) => {
      gmStore.set(key, value);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sets/gets/deletes site preference', () => {
    const storage = new RuleStorage();
    storage.setSitePreference('example.com', { enabled: false, timestamp: 1 });
    expect(storage.getSitePreference('example.com')?.enabled).toBe(false);

    storage.deleteSitePreference('example.com');
    expect(storage.getSitePreference('example.com')).toBeNull();
  });

  it('ignores malformed preference payloads', () => {
    const storage = new RuleStorage();
    gmStore.set('mnr_site_prefs', 'not-an-object');
    expect(storage.getSitePreference('example.com')).toBeNull();
  });

  it('handles site preference storage errors by logging', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('GM_getValue', () => {
      throw new Error('boom');
    });

    const storage = new RuleStorage();
    expect(storage.getSitePreference('example.com')).toBeNull();

    vi.stubGlobal('GM_getValue', () => ({}));
    vi.stubGlobal('GM_setValue', () => {
      throw new Error('boom');
    });

    storage.setSitePreference('example.com', { enabled: true, timestamp: 1 });
    storage.deleteSitePreference('example.com');

    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
