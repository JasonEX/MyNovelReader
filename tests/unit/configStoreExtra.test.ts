import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { JSDOM } from 'jsdom';

import { useConfigStore } from '@/ui/stores/config';

describe('ConfigStore (extra coverage)', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    globalThis.location = dom.window.location;

    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads valid config from GM_getValue and applies theme/reading/behavior/protection', async () => {
    const config = {
      themeId: 'dark',
      reading: {
        fontSize: 20,
        lineHeight: 2.0,
        fontFamily: 'serif',
        letterSpacing: 0.05,
        paragraphIndent: 2,
        maxWidth: 800,
        padding: 20,
      },
      behavior: {
        autoLoadNext: true,
        autoLoadPrev: false,
        scrollThreshold: 200,
        preloadDistance: 500,
      },
      protection: { blockVisibility: true, blockRedirect: true, blockTimer: true },
      customCSS: '.test { color: red; }',
    };
    const gmGetValue = vi.fn(async () => JSON.stringify(config));
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_getValue', gmGetValue);
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    await store.load();

    expect(store.themeId).toBe('dark');
    expect(store.reading.fontSize).toBe(20);
    expect(store.customCSS).toBe('.test { color: red; }');
  });

  it('loads config from GM_getValue when data is already an object (not string)', async () => {
    const config = {
      themeId: 'sepia',
      reading: { fontSize: 18 },
      behavior: { autoLoadNext: false },
      protection: { blockVisibility: false },
      customCSS: '',
    };
    const gmGetValue = vi.fn(async () => config);
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_getValue', gmGetValue);
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    await store.load();

    expect(store.themeId).toBe('sepia');
  });

  it('handles invalid config data (array instead of object)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const gmGetValue = vi.fn(async () => JSON.stringify([1, 2, 3]));
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_getValue', gmGetValue);
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    await store.load();

    // Should fall back to defaults
    expect(store.themeId).toBe('light');
  });

  it('handles null config data gracefully', async () => {
    const gmGetValue = vi.fn(async () => null);
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_getValue', gmGetValue);
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    await store.load();

    expect(store.themeId).toBe('light');
  });

  it('falls back to localStorage when GM_getValue is not available', async () => {
    const config = { themeId: 'dark' };
    const mockStorage = new Map<string, string>();
    mockStorage.set('mnr-config', JSON.stringify(config));
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => mockStorage.set(key, value),
      removeItem: (key: string) => mockStorage.delete(key),
    });

    const store = useConfigStore();
    await store.load();

    expect(store.themeId).toBe('dark');
  });

  it('save writes to GM_setValue', async () => {
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    await store.save();

    expect(gmSetValue).toHaveBeenCalledWith('mnr-config', expect.any(String));
  });

  it('save falls back to localStorage when GM_setValue is not available', async () => {
    const mockStorage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => mockStorage.set(key, value),
      removeItem: (key: string) => mockStorage.delete(key),
    });

    const store = useConfigStore();
    await store.save();

    const stored = mockStorage.get('mnr-config');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!)).toHaveProperty('themeId');
  });

  it('$reset restores defaults and saves', async () => {
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    store.themeId = 'dark';
    store.$reset();

    expect(store.themeId).toBe('light');
    expect(store.customCSS).toBe('');
  });

  it('updateProtection merges settings', () => {
    const store = useConfigStore();
    store.updateProtection({ blockVisibility: false });
    expect(store.protection.blockVisibility).toBe(false);
  });

  it('setCustomCSS applies CSS to DOM', () => {
    const store = useConfigStore();
    store.setCustomCSS('.test { color: blue; }');
    expect(store.customCSS).toBe('.test { color: blue; }');
    const styleEl = dom.window.document.getElementById('mnr-custom-css');
    expect(styleEl).not.toBeNull();
    expect(styleEl!.textContent).toBe('.test { color: blue; }');
  });

  it('load handles exception gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const gmGetValue = vi.fn(async () => {
      throw new Error('storage error');
    });
    vi.stubGlobal('GM_getValue', gmGetValue);

    const store = useConfigStore();
    await store.load();

    // Should not throw, defaults should be applied
    expect(store.themeId).toBe('light');
  });

  it('save handles exception gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const gmSetValue = vi.fn(async () => {
      throw new Error('storage error');
    });
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    // Should not throw
    await store.save();
  });
});
