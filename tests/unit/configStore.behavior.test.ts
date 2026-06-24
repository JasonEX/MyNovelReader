import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { THEMES, useConfigStore } from '@/ui/stores/config';

import { createGmStorageMock, stubGmStorage } from '../testUtils/gmStorage';
import { createDom } from '../testUtils/dom';
import { setupPinia } from '../testUtils/pinia';

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const toLinear = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  const r = toLinear(parseInt(value.slice(0, 2), 16) / 255);
  const g = toLinear(parseInt(value.slice(2, 4), 16) / 255);
  const b = toLinear(parseInt(value.slice(4, 6), 16) / 255);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const lighter = Math.max(luminance(a), luminance(b));
  const darker = Math.min(luminance(a), luminance(b));

  return (lighter + 0.05) / (darker + 0.05);
}

describe('ConfigStore - behavior', () => {
  beforeEach(() => {
    createDom('https://example.com/');
    setupPinia();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('setTheme updates themeId and applies CSS variables', () => {
    const gm = createGmStorageMock();
    stubGmStorage(gm);

    const store = useConfigStore();
    store.setTheme('dark');

    expect(store.themeId).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--mnr-bg')).toBe(
      THEMES.find(t => t.id === 'dark')!.background
    );
    expect(document.documentElement.style.getPropertyValue('--mnr-on-link')).toBe(
      THEMES.find(t => t.id === 'dark')!.onLink
    );
  });

  it('keeps built-in theme colors readable for long-form reading and accent controls', () => {
    for (const theme of THEMES) {
      expect(contrastRatio(theme.background, theme.text), theme.id).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(theme.background, theme.link), theme.id).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.link, theme.onLink), theme.id).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('applyReading writes reading settings to CSS variables', () => {
    const gm = createGmStorageMock();
    stubGmStorage(gm);

    const store = useConfigStore();
    store.updateReading({ fontSize: 20, lineHeight: 2.1, paragraphIndent: 3 });
    store.applyReading();

    const root = document.documentElement.style;
    expect(root.getPropertyValue('--mnr-font-size')).toBe('20px');
    expect(root.getPropertyValue('--mnr-line-height')).toBe('2.1');
    expect(root.getPropertyValue('--mnr-paragraph-indent')).toBe('3em');
  });

  it('setCustomCSS injects/updates the custom style element', () => {
    const gm = createGmStorageMock();
    stubGmStorage(gm);

    const store = useConfigStore();
    store.setCustomCSS('.mnr-test{color:red;}');

    const styleEl = document.getElementById('mnr-custom-css') as HTMLStyleElement | null;
    expect(styleEl).not.toBeNull();
    expect(styleEl?.textContent).toContain('mnr-test');
  });

  it('auto-saves when settings change', async () => {
    const gm = createGmStorageMock();
    stubGmStorage(gm);

    const store = useConfigStore();
    store.updateBehavior({ keyboardNavigation: false });

    await nextTick();

    expect(gm.GM_setValue).toHaveBeenCalledWith(
      'mnr-config',
      expect.stringContaining('"keyboardNavigation":false')
    );
  });

  it('save falls back to localStorage when GM_setValue is unavailable', async () => {
    vi.stubGlobal('GM_setValue', undefined);
    vi.stubGlobal('GM_getValue', undefined);

    const store = useConfigStore();
    store.updateReading({ fontSize: 22 });
    await store.save();

    const stored = localStorage.getItem('mnr-config');
    expect(stored).toContain('"fontSize":22');
  });
});
