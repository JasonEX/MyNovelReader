import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, nextTick } from 'vue';

import DetectionPrompt from '@/ui/components/detection/DetectionPrompt.vue';
import SettingsPanel from '@/ui/components/settings/SettingsPanel.vue';
import settingsPanelSource from '@/ui/components/settings/SettingsPanel.vue?raw';

import { createGmStorageMock, stubGmStorage } from '../../../testUtils/gmStorage';
import { createDom } from '../../../testUtils/dom';
import { setupPinia } from '../../../testUtils/pinia';

function injectSfcStyle(source: string) {
  const style = source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1];
  if (!style) {
    throw new Error('Style block not found');
  }

  const styleEl = document.createElement('style');
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
}

describe('UI component smoke', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();

    createDom('https://example.com/');
    setupPinia();

    const gm = createGmStorageMock();
    stubGmStorage(gm);
  });

  it('DetectionPrompt mounts and emits respond on accept', async () => {
    const onRespond = vi.fn();

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    const app = createApp({
      render: () =>
        h(DetectionPrompt, {
          visible: true,
          decision: {
            shouldEnable: true,
            method: 'detection',
            confidence: 0.9,
            reasons: ['找到正文', '检测到标题'],
          },
          onRespond,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    const acceptBtn = document.querySelector('.mnr-btn-primary') as HTMLButtonElement | null;
    expect(acceptBtn).not.toBeNull();
    acceptBtn?.click();
    await nextTick();

    expect(onRespond).toHaveBeenCalledWith({ accepted: true, saveForDomain: true });

    app.unmount();
    mountEl.remove();
  });

  it('SettingsPanel mounts and emits close on close button click', async () => {
    const onClose = vi.fn();
    injectSfcStyle(settingsPanelSource);

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    const app = createApp({
      render: () =>
        h(SettingsPanel, {
          visible: true,
          domain: 'example.com',
          onClose,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    const sliderLabels = Array.from(document.querySelectorAll<HTMLElement>('.mnr-slider-label'));
    const contentWidthLabels = sliderLabels.filter(label => label.textContent?.includes('⊏'));
    expect(contentWidthLabels.map(label => label.textContent)).toEqual(['⊏⊐', '⊏ ⊐']);
    for (const label of contentWidthLabels) {
      const style = window.getComputedStyle(label);
      expect(style.whiteSpace).toBe('nowrap');
      expect(style.flexShrink).toBe('0');
    }

    const closeBtn = document.querySelector('.mnr-close-btn') as HTMLButtonElement | null;
    expect(closeBtn).not.toBeNull();
    closeBtn?.click();
    await nextTick();

    expect(onClose).toHaveBeenCalledTimes(1);

    app.unmount();
    mountEl.remove();
  });
});
