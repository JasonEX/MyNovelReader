import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { JSDOM } from 'jsdom';

import { useConfigStore } from '@/ui/stores/config';

describe('ConfigStore', () => {
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

  it('applies defaults when stored config JSON is corrupted', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const gmGetValue = vi.fn(async () => '{not-json');
    const gmSetValue = vi.fn(async () => {});
    vi.stubGlobal('GM_getValue', gmGetValue);
    vi.stubGlobal('GM_setValue', gmSetValue);

    const store = useConfigStore();
    await store.load();

    expect(dom.window.document.documentElement.style.getPropertyValue('--mnr-bg')).toBe('#ffffff');
    expect(dom.window.document.getElementById('mnr-custom-css')).not.toBeNull();
    expect(gmSetValue).toHaveBeenCalledWith(
      'mnr-config',
      expect.stringContaining('"themeId":"light"')
    );
  });
});
