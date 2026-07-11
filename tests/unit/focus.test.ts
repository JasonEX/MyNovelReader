import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDeepActiveElement } from '@/ui/focus';

import { createDom } from '../testUtils/dom';

describe('focus helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    createDom('https://example.com/');
  });

  it('finds the actual focused control inside nested Shadow DOM roots', () => {
    const outerHost = document.createElement('div');
    const outerRoot = outerHost.attachShadow({ mode: 'open' });
    const innerHost = document.createElement('div');
    const innerRoot = innerHost.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    innerRoot.appendChild(button);
    outerRoot.appendChild(innerHost);
    document.body.appendChild(outerHost);

    button.focus();

    expect(document.activeElement).toBe(outerHost);
    expect(getDeepActiveElement()).toBe(button);
  });
});
