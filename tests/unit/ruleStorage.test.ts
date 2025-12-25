import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RuleStorage } from '@/core/rules/RuleStorage';
import type { SiteRule } from '@/core/rules/types';

type FakeIdbRequest<T> = {
  result: T;
  error: Error | null;
  onsuccess: ((event: { target: unknown }) => void) | null;
  onerror: (() => void) | null;
  onupgradeneeded: ((event: { target: unknown }) => void) | null;
};

const createRequest = <T>(result: T): FakeIdbRequest<T> => ({
  result,
  error: null,
  onsuccess: null,
  onerror: null,
  onupgradeneeded: null,
});

const createFakeIndexedDB = () => {
  const stores = new Map<string, Map<string, SiteRule>>();

  const createStore = (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    return stores.get(name)!;
  };

  const db = {
    objectStoreNames: {
      contains: (name: string) => stores.has(name),
    },
    createObjectStore: (name: string, _opts: { keyPath: string }) => {
      createStore(name);
      return {};
    },
    transaction: (_storeName: string, _mode: 'readonly' | 'readwrite') => ({
      objectStore: (name: string) => {
        const map = createStore(name);
        return {
          get: (key: string) => {
            const req = createRequest<SiteRule | undefined>(map.get(key));
            queueMicrotask(() => req.onsuccess?.({ target: req }));
            return req;
          },
          put: (value: SiteRule) => {
            map.set(value.id, value);
            const req = createRequest(undefined);
            queueMicrotask(() => req.onsuccess?.({ target: req }));
            return req;
          },
          delete: (key: string) => {
            map.delete(key);
            const req = createRequest(undefined);
            queueMicrotask(() => req.onsuccess?.({ target: req }));
            return req;
          },
          getAll: () => {
            const req = createRequest(Array.from(map.values()));
            queueMicrotask(() => req.onsuccess?.({ target: req }));
            return req;
          },
          getAllKeys: () => {
            const req = createRequest(Array.from(map.keys()));
            queueMicrotask(() => req.onsuccess?.({ target: req }));
            return req;
          },
          clear: () => {
            map.clear();
            const req = createRequest(undefined);
            queueMicrotask(() => req.onsuccess?.({ target: req }));
            return req;
          },
        };
      },
    }),
  };

  return {
    open: (_name: string, _version: number) => {
      const req = createRequest<typeof db>(db);
      queueMicrotask(() => req.onupgradeneeded?.({ target: req }));
      queueMicrotask(() => req.onsuccess?.({ target: req }));
      return req;
    },
  };
};

describe('RuleStorage (GM fallback driver)', () => {
  const gmStore = new Map<string, unknown>();

  beforeEach(() => {
    gmStore.clear();
    vi.stubGlobal('indexedDB', undefined);
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

  it('exports and imports rules (overwrite control)', async () => {
    const ruleA: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'a', type: 'regex' },
      content: { selector: '#a' },
      meta: { source: 'user' },
    };
    const ruleB: SiteRule = {
      id: 'foo.com',
      version: 1,
      match: { pattern: 'b', type: 'regex' },
      content: { selector: '#b' },
      meta: { source: 'user' },
    };

    const storage = new RuleStorage();
    await storage.saveUserRule('example.com', ruleA);
    await storage.saveUserRule('foo.com', ruleB);
    const json = await storage.exportRules();

    gmStore.clear();

    const storage2 = new RuleStorage();
    const countNoOverwrite = await storage2.importRules(json, false);
    expect(countNoOverwrite).toBe(2);

    const countSkipExisting = await storage2.importRules(json, false);
    expect(countSkipExisting).toBe(0);

    const countOverwrite = await storage2.importRules(json, true);
    expect(countOverwrite).toBe(2);
  });

  it('importRules returns 0 for invalid JSON and logs an error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const storage = new RuleStorage();
    const count = await storage.importRules('{not-json', false);

    expect(count).toBe(0);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('importRules returns 0 for non-array JSON and logs an error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const storage = new RuleStorage();
    const count = await storage.importRules(JSON.stringify({ a: 1 }), false);

    expect(count).toBe(0);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('sets/gets/deletes site preference', () => {
    const storage = new RuleStorage();
    storage.setSitePreference('example.com', { enabled: false, timestamp: 1 });
    expect(storage.getSitePreference('example.com')?.enabled).toBe(false);

    storage.deleteSitePreference('example.com');
    expect(storage.getSitePreference('example.com')).toBeNull();
  });

  it('deletes and clears rules via GM storage driver', async () => {
    const storage = new RuleStorage();
    const rule: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'a', type: 'regex' },
      content: { selector: '#a' },
      meta: { source: 'user' },
    };

    await storage.saveUserRule('example.com', rule);
    await storage.saveUserRule('foo.com', { ...rule, id: 'foo.com' });

    await storage.deleteUserRule('example.com');
    expect(await storage.getUserRule('example.com')).toBeNull();

    await storage.clearAllRules();
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

describe('RuleStorage (IndexedDB driver)', () => {
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

    vi.stubGlobal('indexedDB', createFakeIndexedDB() as unknown as IDBFactory);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('persists rules via the IndexedDB driver', async () => {
    const storage = new RuleStorage();
    const rule: SiteRule = {
      id: 'ignored',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    await storage.saveUserRule('example.com', rule);
    const loaded = await storage.getUserRule('example.com');

    expect(loaded?.id).toBe('example.com');
    expect(loaded?.content.selector).toBe('#content');

    const domains = await storage.getAllDomains();
    expect(domains).toContain('example.com');

    await storage.deleteUserRule('example.com');
    expect(await storage.getUserRule('example.com')).toBeNull();
  });

  it('lists and clears rules via IndexedDB driver', async () => {
    const storage = new RuleStorage();
    const rule: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'a', type: 'regex' },
      content: { selector: '#a' },
      meta: { source: 'user' },
    };

    await storage.saveUserRule('example.com', rule);
    const all = await storage.getAllUserRules();
    expect(all.has('example.com')).toBe(true);

    await storage.clearAllRules();
    expect(await storage.getAllDomains()).toHaveLength(0);
  });

  it('caches DB connection across calls', async () => {
    const indexedDb = createFakeIndexedDB();
    const openSpy = vi.spyOn(indexedDb, 'open');
    vi.stubGlobal('indexedDB', indexedDb as unknown as IDBFactory);

    const storage = new RuleStorage();
    await storage.getUserRule('example.com');
    await storage.getAllUserRules();

    expect(openSpy).toHaveBeenCalledTimes(1);
  });
});
