import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RuleMatchResult, SiteRule } from '@/core/rules/types';
import { RuleManager } from '@/core/rules/RuleManager';

describe('RuleManager', () => {
  const store = new Map<string, SiteRule>();

  const makeRule = (overrides: Partial<SiteRule>): SiteRule => ({
    id: overrides.id || 'r1',
    name: overrides.name,
    version: overrides.version ?? 1,
    match: overrides.match || { pattern: '.*', type: 'regex' },
    content: overrides.content || { selector: '#content' },
    meta: overrides.meta,
    navigation: overrides.navigation,
    title: overrides.title,
    processing: overrides.processing,
    advanced: overrides.advanced,
    hooks: overrides.hooks,
    style: overrides.style,
    toc: overrides.toc,
  });

  const createManagerWithStorage = () => {
    const manager = new RuleManager();

    const storage = {
      getAllUserRules: vi.fn(async () => new Map(store)),
      saveUserRule: vi.fn(async (domain: string, rule: SiteRule) => {
        store.set(domain, rule);
      }),
      deleteUserRule: vi.fn(async (domain: string) => {
        store.delete(domain);
      }),
      exportRules: vi.fn(async () => JSON.stringify(Array.from(store.values()), null, 2)),
      importRules: vi.fn(async (json: string, overwrite: boolean) => {
        const rules = JSON.parse(json) as SiteRule[];
        let count = 0;
        for (const rule of rules) {
          if (!rule.id) continue;
          if (!overwrite && store.has(rule.id)) continue;
          store.set(rule.id, rule);
          count++;
        }
        return count;
      }),
      clearAllRules: vi.fn(async () => {
        store.clear();
      }),
    };

    // Patch private storage to keep tests deterministic.
    (manager as unknown as { storage: unknown }).storage = storage;
    return { manager, storage };
  };

  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('matches user rule by domain with highest priority', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    const rule = makeRule({
      id: 'user-example',
      match: { pattern: 'example\\.com', type: 'regex' },
      meta: { source: 'user' },
    });
    (manager as unknown as { userRulesCache: Map<string, SiteRule> }).userRulesCache.set(
      'example.com',
      rule
    );

    const result = await manager.matchRule('https://example.com/chapter/1');
    expect(result?.source).toBe('user');
    expect(result?.rule.id).toBe('user-example');
  });

  it('matches user rules by pattern when domain key is different', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    const rule = makeRule({
      id: 'user-pattern',
      match: { pattern: 'foo\\.com', type: 'regex' },
      meta: { source: 'user' },
    });
    (manager as unknown as { userRulesCache: Map<string, SiteRule> }).userRulesCache.set(
      'other.com',
      rule
    );

    const result = await manager.matchRule('https://foo.com/1');
    expect(result?.rule.id).toBe('user-pattern');
  });

  it('supports glob matchers and exclude patterns', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    const rule = makeRule({
      id: 'glob',
      match: { pattern: 'https://*.example.com/*', type: 'glob', exclude: ['skip'] },
      meta: { source: 'user' },
    });
    (manager as unknown as { userRulesCache: Map<string, SiteRule> }).userRulesCache.set('x', rule);

    await expect(manager.matchRule('https://a.example.com/skip')).resolves.toBeNull();

    const matched = await manager.matchRule('https://a.example.com/chapter/1');
    expect(matched?.rule.id).toBe('glob');
  });

  it('falls back to built-in rules', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    (manager as unknown as { builtInRules: SiteRule[] }).builtInRules = [
      makeRule({
        id: 'builtin',
        match: { pattern: 'builtin\\.com', type: 'regex' },
        meta: { source: 'builtin' },
      }),
    ];

    const builtin = await manager.matchRule('https://builtin.com/1');
    expect(builtin?.source).toBe('builtin');
  });

  it('skips invalid rules without throwing', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    (manager as unknown as { builtInRules: SiteRule[] }).builtInRules = [
      makeRule({ id: 'bad', match: { pattern: '[', type: 'regex' }, meta: { source: 'builtin' } }),
    ];

    await expect(manager.matchRule('https://example.com/1')).resolves.toBeNull();
  });

  it('initialize loads user rules and built-in rules', async () => {
    const { manager, storage } = createManagerWithStorage();
    store.set(
      'example.com',
      makeRule({
        id: 'user',
        match: { pattern: 'example\\.com', type: 'regex' },
        meta: { source: 'user' },
      })
    );

    await manager.initialize();
    expect(storage.getAllUserRules).toHaveBeenCalledTimes(1);

    const stats = manager.getStats();
    expect(stats.user).toBe(1);
    expect(stats.builtin).toBeGreaterThan(0);
  });

  it('matchRule triggers initialize on first use', async () => {
    const { manager, storage } = createManagerWithStorage();
    store.set(
      'example.com',
      makeRule({
        id: 'lazy',
        match: { pattern: 'example\\.com', type: 'regex' },
        meta: { source: 'user' },
      })
    );

    const result = await manager.matchRule('https://example.com/chapter/1');
    expect(storage.getAllUserRules).toHaveBeenCalledTimes(1);
    expect(result?.rule.id).toBe('lazy');
  });

  it('exports, imports and clears user rules', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    await manager.saveUserRule(
      'example.com',
      makeRule({
        id: 'example.com',
        match: { pattern: 'example\\.com', type: 'regex' },
        meta: { source: 'user' },
      })
    );

    const exported = await manager.exportUserRules();
    const importedCount = await manager.importUserRules(exported, false);
    expect(importedCount).toBe(0);

    const importedOverwrite = await manager.importUserRules(exported, true);
    expect(importedOverwrite).toBe(1);

    await manager.clearUserRules();
    expect(manager.getAllUserRules().size).toBe(0);
  });

  it('deletes user rules and exposes getters', async () => {
    const { manager, storage } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    await manager.saveUserRule(
      'example.com',
      makeRule({
        id: 'example.com',
        match: { pattern: 'example\\.com', type: 'regex' },
        meta: { source: 'user' },
      })
    );

    expect(manager.getUserRule('example.com')?.id).toBe('example.com');

    await manager.deleteUserRule('example.com');
    expect(storage.deleteUserRule).toHaveBeenCalledWith('example.com');
    expect(manager.getUserRule('example.com')).toBeUndefined();
  });

  it('returns built-in rules and storage instance', () => {
    const { manager, storage } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    const builtins = [makeRule({ id: 'builtin-1', meta: { source: 'builtin' } })];
    (manager as unknown as { builtInRules: SiteRule[] }).builtInRules = builtins;

    expect(manager.getBuiltInRules()).toEqual(builtins);
    expect(manager.getStorage()).toBe(storage);
  });

  it('returns null for malformed URLs without throwing', async () => {
    const { manager } = createManagerWithStorage();
    (manager as unknown as { initialized: boolean }).initialized = true;

    const result: RuleMatchResult | null = await manager.matchRule('not a url');
    expect(result).toBeNull();
  });
});
