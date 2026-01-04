import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';

import type { SiteRule } from '@/core/rules/types';

const {
  mockInitialize,
  mockGetAllUserRules,
  mockGetBuiltInRules,
  mockMatchRule,
  mockGetUserRule,
  mockSaveUserRule,
  mockDeleteUserRule,
} = vi.hoisted(() => ({
  mockInitialize: vi.fn(async () => {}),
  mockGetAllUserRules: vi.fn(async () => new Map<string, SiteRule>()),
  mockGetBuiltInRules: vi.fn(async () => [] as SiteRule[]),
  mockMatchRule: vi.fn(async () => null as unknown),
  mockGetUserRule: vi.fn(() => null),
  mockSaveUserRule: vi.fn(async () => {}),
  mockDeleteUserRule: vi.fn(async () => {}),
}));

vi.mock('@/core/rules/RuleManager', () => ({
  getRuleManager: () => ({
    initialize: mockInitialize,
    getStorage: () => ({ getAllUserRules: mockGetAllUserRules }),
    getBuiltInRules: mockGetBuiltInRules,
    matchRule: mockMatchRule,
    saveUserRule: mockSaveUserRule,
    getUserRule: mockGetUserRule,
    deleteUserRule: mockDeleteUserRule,
  }),
}));

import { useRuleStore } from '@/ui/stores/rule';

describe('RuleStore', () => {
  it('initializes and loads user/built-in rules', async () => {
    setActivePinia(createPinia());

    const userRule: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'example.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };
    const builtInRule: SiteRule = {
      id: 'builtin',
      version: 1,
      match: { pattern: '.*', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'builtin' },
    };

    mockGetAllUserRules.mockResolvedValueOnce(new Map([['example.com', userRule]]));
    mockGetBuiltInRules.mockResolvedValueOnce([builtInRule]);

    const store = useRuleStore();
    await store.initialize();

    expect(mockInitialize).toHaveBeenCalledTimes(1);
    expect(store.userRuleCount).toBe(1);
    expect(store.builtInRuleCount).toBe(1);
    expect(store.totalRuleCount).toBe(2);
    expect(store.getUserRule('example.com')).toEqual(userRule);
    expect(store.hasUserRule('example.com')).toBe(true);
  });

  it('matchRule sets currentRule', async () => {
    setActivePinia(createPinia());

    const rule: SiteRule = {
      id: 'r',
      version: 1,
      match: { pattern: '.*', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'builtin' },
    };
    mockMatchRule.mockResolvedValueOnce({ rule });

    const store = useRuleStore();
    const out = await store.matchRule('https://example.com/');

    expect(out).toEqual(rule);
    expect(store.currentRule).toEqual(rule);
  });

  it('supports editing lifecycle and persistence actions', async () => {
    setActivePinia(createPinia());

    const now = vi.spyOn(Date, 'now').mockReturnValue(123);

    const store = useRuleStore();
    store.startEditing();
    expect(store.isEditing).toBe(true);
    expect(store.editingRule?.id).toBe('user-123');

    store.updateEditingRule({ name: 'demo', content: { selector: '#c' } });
    expect(store.editingRule?.name).toBe('demo');
    expect(store.editingRule?.content.selector).toBe('#c');

    await store.saveEditingRule('example.com');
    expect(mockSaveUserRule).toHaveBeenCalledWith('example.com', expect.any(Object));
    expect(store.hasUserRule('example.com')).toBe(true);
    expect(store.isEditing).toBe(false);
    expect(store.editingRule).toBeNull();

    await store.deleteUserRule('example.com');
    expect(mockDeleteUserRule).toHaveBeenCalledWith('example.com');
    expect(store.hasUserRule('example.com')).toBe(false);

    now.mockRestore();
  });

  it('exports and imports rules', async () => {
    setActivePinia(createPinia());

    const rule: SiteRule = {
      id: 'r',
      version: 1,
      match: { pattern: '.*', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    const store = useRuleStore();
    await store.saveUserRule('example.com', rule);

    const exported = store.exportRules();
    const parsed = JSON.parse(exported) as Array<{ domain: string; rule: SiteRule }>;
    expect(parsed).toEqual([{ domain: 'example.com', rule }]);

    store.$reset();
    expect(store.userRuleCount).toBe(0);

    await store.importRules(exported);
    expect(store.userRuleCount).toBe(1);
    expect(store.getUserRule('example.com')).toEqual(rule);
  });

  it('throws on invalid import format', async () => {
    setActivePinia(createPinia());
    const store = useRuleStore();

    await expect(store.importRules('{"nope":true}')).rejects.toThrow(
      'Invalid format: expected array'
    );
  });
});
