import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import type { SiteRule } from '@/core/rules/types';

const {
  mockInitialize,
  mockGetAllUserRules,
  mockGetUserRule,
  mockSaveUserRule,
  mockDeleteUserRule,
} = vi.hoisted(() => ({
  mockInitialize: vi.fn(async () => {}),
  mockGetAllUserRules: vi.fn(() => new Map<string, SiteRule>()),
  mockGetUserRule: vi.fn(() => null),
  mockSaveUserRule: vi.fn(async () => {}),
  mockDeleteUserRule: vi.fn(async () => {}),
}));

vi.mock('@/core/rules/RuleManager', () => ({
  getRuleManager: () => ({
    initialize: mockInitialize,
    getAllUserRules: mockGetAllUserRules,
    saveUserRule: mockSaveUserRule,
    getUserRule: mockGetUserRule,
    deleteUserRule: mockDeleteUserRule,
  }),
}));

import { useRuleStore } from '@/ui/stores/rule';

describe('RuleStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes and loads user/built-in rules', async () => {
    setActivePinia(createPinia());

    const userRule: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'example.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };
    mockGetAllUserRules.mockReturnValueOnce(new Map([['example.com', userRule]]));

    const store = useRuleStore();
    await store.initialize();

    expect(mockInitialize).toHaveBeenCalledTimes(1);
    expect(store.hasUserRule('example.com')).toBe(true);
  });

  it('saves and deletes user rules', async () => {
    setActivePinia(createPinia());

    const rule: SiteRule = {
      id: 'example.com',
      version: 1,
      match: { pattern: 'example.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    const store = useRuleStore();
    await store.saveUserRule('example.com', rule);
    expect(mockSaveUserRule).toHaveBeenCalledWith('example.com', rule);
    expect(store.hasUserRule('example.com')).toBe(true);

    await store.deleteUserRule('example.com');
    expect(mockDeleteUserRule).toHaveBeenCalledWith('example.com');
    expect(store.hasUserRule('example.com')).toBe(false);
  });
});
