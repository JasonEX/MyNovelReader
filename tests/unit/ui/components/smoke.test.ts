import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, nextTick } from 'vue';

import ChapterDrawer from '@/ui/components/reader/ChapterDrawer.vue';
import DetectionPrompt from '@/ui/components/detection/DetectionPrompt.vue';
import FloatingToolbar from '@/ui/components/reader/FloatingToolbar.vue';
import SettingsPanel from '@/ui/components/settings/SettingsPanel.vue';
import settingsPanelSource from '@/ui/components/settings/SettingsPanel.vue?raw';
import { THEMES } from '@/ui/stores/config';

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
            reasons: ['找到正文', '检测到标题', '警告：导航不完整'],
          },
          onRespond,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    expect(document.querySelector('.mnr-prompt-icon svg')).toBeNull();
    expect(document.querySelector('.mnr-prompt-icon')).toBeInstanceOf(SVGElement);
    expect(document.querySelectorAll('.mnr-result-icon')).toHaveLength(3);
    const acceptBtn = document.querySelector('.mnr-btn-primary') as HTMLButtonElement | null;
    expect(acceptBtn).not.toBeNull();
    acceptBtn?.click();
    await nextTick();

    expect(onRespond).toHaveBeenCalledWith({ accepted: true, rememberForSite: true });

    app.unmount();
    mountEl.remove();
  });

  it('SettingsPanel mounts and emits close on close button click', async () => {
    const onClose = vi.fn();
    const onProtectionModeChange = vi.fn();
    injectSfcStyle(settingsPanelSource);

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    const app = createApp({
      render: () =>
        h(SettingsPanel, {
          visible: true,
          onClose,
          onProtectionModeChange,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    expect(document.querySelectorAll('.mnr-theme-btn')).toHaveLength(THEMES.length);
    expect(
      Array.from(document.querySelectorAll('.mnr-theme-btn'), button => button.textContent?.trim())
    ).toEqual(['跟随系统', '明亮', '米黄', '绿色', '蓝色', '深色']);
    expect(
      window.getComputedStyle(document.querySelector('.mnr-theme-grid')!).gridTemplateColumns
    ).toContain('repeat(3');
    const sliderIds = [
      'mnr-font-size',
      'mnr-line-height',
      'mnr-letter-spacing',
      'mnr-paragraph-indent',
      'mnr-max-width',
      'mnr-padding',
    ];
    for (const id of sliderIds) {
      expect(document.querySelector(`input#${id}[type="range"]`)).not.toBeNull();
      expect(document.querySelector(`label[for="${id}"]`)).not.toBeNull();
      expect(document.querySelector(`output[for="${id}"]`)).not.toBeNull();
    }

    expect(
      Array.from(document.querySelectorAll('details > summary'), summary =>
        summary.textContent?.trim()
      )
    ).toEqual(['排版细节', '阅读行为', '本站与高级']);
    expect(document.querySelector('#mnr-custom-css')).not.toBeNull();
    expect(document.querySelector('.mnr-cache-action')).toBeNull();
    expect(document.querySelector('.mnr-settings-footer .mnr-exit-btn')?.textContent).toContain(
      '退出阅读模式'
    );
    const fontSelect = document.querySelector<HTMLSelectElement>('#mnr-font-family');
    expect(fontSelect?.selectedOptions[0]?.textContent?.trim()).toBe('系统默认');

    const aggressiveButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mnr-segment')
    ).find(button => button.textContent?.trim() === '强力');
    expect(window.getComputedStyle(aggressiveButton!).fontSize).toBe('14px');
    aggressiveButton?.click();
    await nextTick();
    expect(onProtectionModeChange).toHaveBeenCalledWith('aggressive');

    const closeBtn = document.querySelector('.mnr-close-btn') as HTMLButtonElement | null;
    expect(closeBtn).not.toBeNull();
    closeBtn?.click();
    await nextTick();

    expect(onClose).toHaveBeenCalledTimes(1);

    app.unmount();
    mountEl.remove();
  });

  it('FloatingToolbar keeps only the primary directory and settings actions', async () => {
    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp({ render: () => h(FloatingToolbar, { visible: true }) });

    app.mount(mountEl);
    await nextTick();

    expect(document.querySelectorAll('.mnr-fab')).toHaveLength(2);
    expect(document.querySelectorAll('.mnr-fab svg')).toHaveLength(2);
    expect(document.querySelector('[aria-label="打开目录"]')).not.toBeNull();
    expect(document.querySelector('[aria-label="打开设置"]')).not.toBeNull();
    expect(document.querySelector('[aria-label="缓存管理"]')).toBeNull();

    app.unmount();
    mountEl.remove();
  });

  it('ChapterDrawer searches a large TOC without rendering every row', async () => {
    const onClearCache = vi.fn();
    const chapters = Array.from({ length: 1200 }, (_, index) => ({
      title: `第 ${index + 1} 章`,
      url: `https://example.com/chapter/${index + 1}`,
      isCached: index === 0 || index === 1,
      isPersisted: false,
      isCurrent: index === 599,
    }));
    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp({
      render: () =>
        h(ChapterDrawer, {
          isOpen: true,
          chapters,
          loading: false,
          cacheProgress: { done: 0, total: 0, failed: 0, running: false },
          persistedCount: 1,
          onClearCache,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    expect(document.querySelectorAll('.mnr-chapter-button').length).toBeLessThan(50);
    const search = document.querySelector<HTMLInputElement>('#mnr-chapter-search');
    expect(search).not.toBeNull();
    expect(document.querySelectorAll('.mnr-cache-mark svg')).toHaveLength(2);
    const clearCacheButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mnr-cache-action')
    ).find(button => button.textContent?.trim() === '清除缓存');
    expect(clearCacheButton).not.toBeNull();
    clearCacheButton?.click();
    expect(onClearCache).toHaveBeenCalledTimes(1);
    if (search) {
      search.value = '第 1200 章';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await nextTick();
      expect(document.querySelectorAll('.mnr-chapter-button')).toHaveLength(1);
      expect(document.querySelector('.mnr-chapter-button')?.textContent).toContain('第 1200 章');
    }

    app.unmount();
    mountEl.remove();
  });
});
