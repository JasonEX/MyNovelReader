import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ADAPTIVE_PRELOAD_MIN_LEAD_MS,
  type AdaptivePreloadStats,
  countReadableChars,
  createDefaultAdaptivePreloadStats,
  estimateAdaptivePreloadLeadMs,
  estimateReadingCharsPerMs,
  getAdaptivePreloadStatsKey,
  getAdaptivePreloadStorageKey,
  loadAdaptivePreloadStats,
  recordLoadFailure,
  recordLoadSample,
  recordReadingSample,
  saveAdaptivePreloadStats,
} from '@/ui/composables/reader/preloadStats';

describe('adaptive preload stats', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('records load latency with EWMA-style smoothed latency and variance', () => {
    const initial = createDefaultAdaptivePreloadStats('rule@example.com', 1);
    const first = recordLoadSample(initial, 2000, 2);
    const second = recordLoadSample(first, 6000, 3);

    expect(first.loadSamples).toBe(1);
    expect(first.loadSrttMs).toBe(2000);
    expect(first.loadRttVarMs).toBe(1000);

    expect(second.loadSamples).toBe(2);
    expect(second.loadSrttMs).toBeGreaterThan(first.loadSrttMs);
    expect(second.loadRttVarMs).toBeGreaterThan(first.loadRttVarMs);
  });

  it('keeps lead time conservative and adds failure penalty without dropping below the minimum', () => {
    const fast = recordLoadSample(createDefaultAdaptivePreloadStats('rule@example.com'), 300);
    const failed = recordLoadFailure(recordLoadFailure(recordLoadFailure(fast)));

    expect(estimateAdaptivePreloadLeadMs(fast)).toBe(ADAPTIVE_PRELOAD_MIN_LEAD_MS);
    expect(estimateAdaptivePreloadLeadMs(failed)).toBeGreaterThan(
      estimateAdaptivePreloadLeadMs(fast)
    );
  });

  it('records reading speed only for plausible chapter reading sessions and estimates early', () => {
    const initial = createDefaultAdaptivePreloadStats('rule@example.com');
    const tooShort = recordReadingSample(initial, 2000, 3000);
    const recorded = recordReadingSample(initial, 1000, 60000);

    expect(tooShort).toBe(initial);
    expect(recorded.readSamples).toBe(1);
    expect(estimateReadingCharsPerMs(recorded)).toBeGreaterThan(recorded.charsPerMs);
  });

  it('counts readable text while ignoring tags, scripts, styles and spacing', () => {
    expect(
      countReadableChars('<style>.a{}</style><p>你&nbsp;好</p><script>bad()</script><p>世界</p>')
    ).toBe(4);
  });

  it('builds stable per-site stats keys from rule id and normalized host', () => {
    expect(getAdaptivePreloadStatsKey(undefined)).toBe('');
    expect(
      getAdaptivePreloadStatsKey({
        id: 'entry',
        rule: { id: 'goboo', name: 'Goboo', pattern: 'goboo' },
        chapter: {
          url: 'https://m.goboo.cc/gb_1/94443/2',
          title: 't',
          content: '',
          indexUrl: 'https://www.goboo.cc/gb_1/94443/',
          method: 'rule',
          confidence: 100,
        },
      })
    ).toBe('goboo@goboo.cc');
    expect(
      getAdaptivePreloadStatsKey({
        id: 'entry',
        chapter: {
          url: 'https://www.example.com/chapter/1',
          title: 't',
          content: '',
          method: 'rule',
          confidence: 100,
          rule: { id: 'chapter-rule', name: 'Chapter Rule', pattern: 'example' },
        },
      })
    ).toBe('chapter-rule@example.com');

    vi.stubGlobal('window', undefined);
    expect(
      getAdaptivePreloadStatsKey({
        id: 'entry',
        chapter: {
          url: 'https://example.com/chapter/1',
          title: 't',
          content: '',
          method: 'rule',
          confidence: 100,
        },
      })
    ).toBe('');
  });

  it('falls back to defaults for empty keys, invalid GM data, and GM read errors', () => {
    const invalidGet = vi.fn(() => '{bad-json');
    vi.stubGlobal('GM_getValue', invalidGet);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(loadAdaptivePreloadStats('').key).toBe('');
    expect(loadAdaptivePreloadStats('rule@example.com').loadSamples).toBe(0);

    vi.stubGlobal(
      'GM_getValue',
      vi.fn(() => {
        throw new Error('boom');
      })
    );
    expect(loadAdaptivePreloadStats('rule@example.com').readSamples).toBe(0);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it('loads valid GM stats, rejects mismatched objects, and writes through GM storage', () => {
    const stats: AdaptivePreloadStats = {
      ...createDefaultAdaptivePreloadStats('rule@example.com', 1),
      loadSrttMs: 4321,
      loadSamples: 2,
    };
    const storageKey = getAdaptivePreloadStorageKey(stats.key);
    const gmGetValue = vi.fn((key: string, fallback: unknown) =>
      key === storageKey ? JSON.stringify(stats) : fallback
    );
    const gmSetValue = vi.fn();
    vi.stubGlobal('GM_getValue', gmGetValue);
    vi.stubGlobal('GM_setValue', gmSetValue);

    expect(loadAdaptivePreloadStats(stats.key).loadSrttMs).toBe(4321);
    gmGetValue.mockImplementationOnce(() => ({ ...stats, key: 'other@example.com' }));
    expect(loadAdaptivePreloadStats(stats.key).loadSamples).toBe(0);
    gmGetValue.mockImplementationOnce(() => 42);
    expect(loadAdaptivePreloadStats(stats.key).loadSamples).toBe(0);

    saveAdaptivePreloadStats(stats);

    expect(gmSetValue).toHaveBeenCalledWith(storageKey, JSON.stringify(stats));
  });

  it('uses localStorage when GM storage is unavailable', () => {
    vi.stubGlobal('GM_getValue', undefined);
    vi.stubGlobal('GM_setValue', undefined);
    const backing = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => backing.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        backing.set(key, value);
      }),
    });

    const stats = recordLoadSample(createDefaultAdaptivePreloadStats('rule@example.com'), 1234);
    saveAdaptivePreloadStats(stats);

    expect(loadAdaptivePreloadStats(stats.key).loadSrttMs).toBe(1234);
  });

  it('falls back when no supported storage exists or localStorage throws', () => {
    vi.stubGlobal('GM_getValue', undefined);
    vi.stubGlobal('GM_setValue', undefined);
    vi.stubGlobal('localStorage', undefined);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(loadAdaptivePreloadStats('rule@example.com').loadSamples).toBe(0);

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('read failed');
      }),
      setItem: vi.fn(() => {
        throw new Error('write failed');
      }),
    });
    expect(loadAdaptivePreloadStats('rule@example.com').loadSamples).toBe(0);
    expect(() =>
      saveAdaptivePreloadStats(createDefaultAdaptivePreloadStats('rule@example.com'))
    ).not.toThrow();
    expect(consoleError).toHaveBeenCalledTimes(2);
  });

  it('ignores save requests without keys and handles storage write errors', () => {
    const gmSetValue = vi.fn(() => {
      throw new Error('write failed');
    });
    vi.stubGlobal('GM_setValue', gmSetValue);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    saveAdaptivePreloadStats(createDefaultAdaptivePreloadStats(''));
    expect(gmSetValue).not.toHaveBeenCalled();

    expect(() =>
      saveAdaptivePreloadStats(createDefaultAdaptivePreloadStats('rule@example.com'))
    ).not.toThrow();
    expect(gmSetValue).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it('clamps extreme load samples and reduces failure count after success', () => {
    const failed = recordLoadFailure(createDefaultAdaptivePreloadStats('rule@example.com'));
    const verySlow = recordLoadSample(failed, 999_999);
    const veryFast = recordLoadSample(verySlow, 1);
    const cappedFailure = Array.from({ length: 20 }).reduce(
      stats => recordLoadFailure(stats),
      createDefaultAdaptivePreloadStats('rule@example.com')
    );

    expect(verySlow.loadSrttMs).toBe(45_000);
    expect(verySlow.failureCount).toBe(0);
    expect(veryFast.loadSrttMs).toBeLessThan(45_000);
    expect(cappedFailure.failureCount).toBe(10);
  });

  it('clamps extreme reading speeds and rejects implausible sessions', () => {
    const initial = createDefaultAdaptivePreloadStats('rule@example.com');
    const tooFewChars = recordReadingSample(initial, 50, 60_000);
    const tooLong = recordReadingSample(initial, 1000, 60 * 60 * 1000);
    const tooFast = recordReadingSample(initial, 20_000, 10_000);
    const smoothed = recordReadingSample(tooFast, 1000, 120_000);

    expect(tooFewChars).toBe(initial);
    expect(tooLong).toBe(initial);
    expect(tooFast.readSamples).toBe(1);
    expect(tooFast.charsPerMs).toBe(2400 / 60000);
    expect(smoothed.readSamples).toBe(2);
    expect(smoothed.charsPerMs).toBeLessThan(tooFast.charsPerMs);
  });

  it('caps very slow lead estimates at the maximum', () => {
    const slow = recordLoadFailure(
      recordLoadFailure(
        recordLoadSample(createDefaultAdaptivePreloadStats('rule@example.com'), 45000)
      )
    );

    expect(estimateAdaptivePreloadLeadMs(slow)).toBe(45_000);
    expect(
      estimateAdaptivePreloadLeadMs(createDefaultAdaptivePreloadStats('rule@example.com'))
    ).toBe(17_000);
    expect(estimateReadingCharsPerMs(createDefaultAdaptivePreloadStats('rule@example.com'))).toBe(
      (900 / 60000) * 1.25
    );
  });
});
