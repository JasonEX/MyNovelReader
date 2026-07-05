import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RuleStorage } from '@/core/rules/RuleStorage';
import type { SiteRule } from '@/core/rules/types';

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
    vi.stubGlobal('GM_deleteValue', (key: string) => {
      gmStore.delete(key);
    });
    vi.stubGlobal('GM_listValues', () => Array.from(gmStore.keys()));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('saves, loads and lists user rules', async () => {
    const storage = new RuleStorage();
    const rule: SiteRule = {
      id: 'will-be-overwritten',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    await storage.saveUserRule('example.com', rule);
    const loaded = await storage.getUserRule('example.com');

    // should not mutate caller's object
    expect(rule.id).toBe('will-be-overwritten');
    expect(rule.meta?.updated).toBeUndefined();

    expect(loaded?.id).toBe('example.com');
    expect(loaded?.meta?.source).toBe('user');

    const domains = await storage.getAllDomains();
    expect(domains).toContain('example.com');
  });

  it('handles invalid JSON in GM storage gracefully', async () => {
    const storage = new RuleStorage();

    // @ts-expect-error - userscript global stub
    GM_setValue('mnr_rule_example.com', '{not-json');

    const loaded = await storage.getUserRule('example.com');
    expect(loaded).toBeNull();
  });

  it('sanitizes unsupported hook fields on load and warns per rule', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const storage = new RuleStorage();

    // Simulate an imported/stored rule payload containing unsupported hook fields.
    // @ts-expect-error - userscript global stub
    GM_setValue(
      'mnr_rule_example.com',
      JSON.stringify({
        id: 'example.com',
        version: 1,
        match: { pattern: 'a', type: 'regex' },
        content: { selector: '#a' },
        meta: { source: 'user' },
        hooks: {
          beforeParse: "doc.body.setAttribute('x', '1')",
          afterParse: '(content) => content',
          onLoad: "console.log('noop')",
        },
      })
    );

    const loaded = await storage.getUserRule('example.com');
    expect(loaded?.hooks).toEqual({ beforeParse: "doc.body.setAttribute('x', '1')" });

    expect(warn).toHaveBeenCalledWith(
      '[RuleStorage] Dropped unsupported hooks fields:',
      'example.com',
      expect.arrayContaining(['afterParse', 'onLoad'])
    );

    const stored = gmStore.get('mnr_rule_example.com');
    expect(typeof stored).toBe('string');
    expect(stored as string).toContain('beforeParse');
    expect(stored as string).not.toContain('afterParse');
    expect(stored as string).not.toContain('onLoad');
  });

  it('sanitizes unsupported hook fields on save and warns per rule', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const storage = new RuleStorage();
    await storage.saveUserRule('example.com', {
      id: 'example.com',
      version: 1,
      match: { pattern: 'a', type: 'regex' },
      content: { selector: '#a' },
      meta: { source: 'user' },
      hooks: {
        beforeParse: "doc.body.setAttribute('x', '1')",
        afterParse: '(content) => content',
      },
    } as SiteRule);

    expect(warn).toHaveBeenCalledWith(
      '[RuleStorage] Dropped unsupported hooks fields:',
      'example.com',
      expect.arrayContaining(['afterParse'])
    );

    const loaded = await storage.getUserRule('example.com');
    expect(loaded?.hooks).toEqual({ beforeParse: "doc.body.setAttribute('x', '1')" });
  });

  it('sets/gets/deletes site preference', () => {
    const storage = new RuleStorage();
    storage.setSitePreference('example.com', { enabled: false, timestamp: 1 });
    expect(storage.getSitePreference('example.com')?.enabled).toBe(false);

    storage.deleteSitePreference('example.com');
    expect(storage.getSitePreference('example.com')).toBeNull();
  });

  it('deletes a user rule', async () => {
    const storage = new RuleStorage();
    const rule: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'a', type: 'regex' },
      content: { selector: '#a' },
      meta: { source: 'user' },
    };

    await storage.saveUserRule('example.com', rule);

    await storage.deleteUserRule('example.com');
    expect(await storage.getUserRule('example.com')).toBeNull();
    expect(await storage.getAllDomains()).toHaveLength(0);
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
