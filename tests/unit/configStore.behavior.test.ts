import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { THEMES, useConfigStore } from '@/ui/stores/config';

import { createGmStorageMock, stubGmStorage } from '../testUtils/gmStorage';
import { createDom } from '../testUtils/dom';
import { setupPinia } from '../testUtils/pinia';

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
