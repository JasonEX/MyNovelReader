import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { createShadowMount, injectShadowCSS } from '@/ui/shadowMount';

describe('shadowMount', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('creates a shadow root mount point and cleans up', () => {
    const { host, shadowRoot, mountPoint, cleanup } = createShadowMount('mnr-test-root');

    expect(host.id).toBe('mnr-test-root');
    expect(document.getElementById('mnr-test-root')).toBe(host);
    expect(shadowRoot).toBe(host.shadowRoot);
    expect(mountPoint.id).toBe('mnr-test-root-mount');
    expect(shadowRoot.contains(mountPoint)).toBe(true);

    expect(window.__MY_NOVEL_READER__?.shadowRoot).toBe(shadowRoot);

    cleanup();
    expect(document.getElementById('mnr-test-root')).toBeNull();
    expect(window.__MY_NOVEL_READER__?.shadowRoot).toBeUndefined();
  });

  it('injects previously collected CSS and supports injecting extra CSS', () => {
    window.__MY_NOVEL_READER__ = { styles: 'body{background:red;}' };

    const { shadowRoot } = createShadowMount('mnr-style-root');
    const appStyle = shadowRoot.querySelector('#mnr-app-styles') as HTMLStyleElement | null;
    expect(appStyle).not.toBeNull();
    expect(appStyle?.textContent).toContain('background:red');

    injectShadowCSS(shadowRoot, 'a{color:blue;}');
    expect(shadowRoot.querySelectorAll('style').length).toBeGreaterThan(1);
    expect(shadowRoot.textContent).toContain('color:blue');
  });
});
