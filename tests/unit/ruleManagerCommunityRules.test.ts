import { afterEach, describe, expect, it, vi } from 'vitest';
import { RuleManager } from '@/core/rules/RuleManager';

describe('RuleManager (community rules)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('strips JS hooks from fetched community rules', async () => {
    const communityRule = {
      id: 'community-1',
      version: 1,
      match: { pattern: 'example\\.com' },
      content: { selector: '#content' },
      hooks: {
        beforeParse: 'throw new Error("pwn")',
      },
      meta: { source: 'community' as const },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => [communityRule],
      }))
    );

    // Stub GM_* storage APIs used by RuleStorage.
    // @ts-expect-error - userscript global stub
    vi.stubGlobal('GM_listValues', () => []);
    // @ts-expect-error - userscript global stub
    vi.stubGlobal('GM_getValue', () => null);
    // @ts-expect-error - userscript global stub
    vi.stubGlobal('GM_setValue', () => {});
    // @ts-expect-error - userscript global stub
    vi.stubGlobal('GM_deleteValue', () => {});

    const manager = new RuleManager();
    await manager.initialize();
    await (manager as unknown as { loadCommunityRules: () => Promise<void> }).loadCommunityRules();

    const match = await manager.matchRule('https://example.com/chapter/1');

    expect(match?.source).toBe('community');
    expect(match?.rule.hooks).toBeUndefined();
    expect(match?.rule.meta?.source).toBe('community');
  });
});
