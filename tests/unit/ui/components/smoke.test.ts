import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, nextTick, ref } from 'vue';

import { ReaderEntryButton, ReaderEntryPrompt } from '@/ui/components/entry';
import { THEMES, useConfigStore } from '@/ui/stores/config';
import ChapterDrawer from '@/ui/components/reader/ChapterDrawer.vue';
import FloatingToolbar from '@/ui/components/reader/FloatingToolbar.vue';
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

  it('ReaderEntryPrompt presents a product decision and emits respond on accept', async () => {
    const onRespond = vi.fn();

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    const app = createApp({
      render: () =>
        h(ReaderEntryPrompt, {
          visible: true,
          onRespond,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    expect(document.querySelector('.mnr-entry-prompt-icon svg')).toBeInstanceOf(SVGElement);
    expect(document.querySelector('.mnr-entry-prompt-card')?.textContent).not.toContain(
      '检测置信度'
    );
    expect(document.querySelector('.mnr-entry-prompt-card')?.textContent).not.toContain(
      '未找到下一章链接'
    );
    const acceptBtn = document.querySelector(
      '.mnr-entry-button.primary'
    ) as HTMLButtonElement | null;
    expect(acceptBtn).not.toBeNull();
    acceptBtn?.click();
    await nextTick();

    expect(onRespond).toHaveBeenCalledWith({ accepted: true, rememberForSite: true });

    app.unmount();
    mountEl.remove();
  });

  it('ReaderEntryButton exposes a clear manual reading action', async () => {
    const onEnter = vi.fn();
    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp({ render: () => h(ReaderEntryButton, { onEnter }) });

    app.mount(mountEl);
    await nextTick();

    const button = document.querySelector<HTMLButtonElement>('#mnr-entry-button');
    expect(button?.textContent?.trim()).toBe('进入阅读模式');
    expect(button?.getAttribute('aria-label')).toBe('进入阅读模式');
    expect(button?.querySelector('svg')).toBeInstanceOf(SVGElement);
    button?.click();
    expect(onEnter).toHaveBeenCalledTimes(1);

    app.unmount();
    mountEl.remove();
  });

  it('SettingsPanel delegates protection changes and flushes pending settings on close', async () => {
    const visible = ref(true);
    const onClose = vi.fn(() => {
      visible.value = false;
    });
    const onProtectionModeChange = vi.fn();
    const configStore = useConfigStore();
    injectSfcStyle(settingsPanelSource);

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    const app = createApp({
      render: () =>
        h(SettingsPanel, {
          visible: visible.value,
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
    const customCleanup = document.querySelector<HTMLTextAreaElement>('#mnr-custom-cleanup-regex');
    expect(customCleanup).not.toBeNull();
    expect(document.querySelector('#mnr-custom-css')).not.toBeNull();
    expect(document.querySelector('.mnr-cache-action')).toBeNull();
    expect(document.querySelector('.mnr-settings-footer .mnr-exit-btn')?.textContent).toContain(
      '退出阅读模式'
    );
    const fontSelect = document.querySelector<HTMLSelectElement>('#mnr-font-family');
    expect(fontSelect?.selectedOptions[0]?.textContent?.trim()).toBe('系统默认');

    customCleanup!.value = '[';
    customCleanup!.dispatchEvent(new window.Event('input', { bubbles: true }));
    await nextTick();
    expect(configStore.customCleanupRegex).toBe('[');
    expect(document.querySelector('#mnr-custom-cleanup-error')?.textContent).toContain('第 1 行');

    customCleanup!.value = '测试广告$';
    customCleanup!.dispatchEvent(new window.Event('input', { bubbles: true }));
    await nextTick();
    expect(document.querySelector('#mnr-custom-cleanup-error')).toBeNull();

    const aggressiveButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mnr-segment')
    ).find(button => button.textContent?.trim() === '强力');
    expect(window.getComputedStyle(aggressiveButton!).fontSize).toBe('14px');
    aggressiveButton?.click();
    await nextTick();
    expect(onProtectionModeChange).toHaveBeenCalledWith('aggressive');
    expect(configStore.protection.mode).toBe('standard');

    document.querySelectorAll<HTMLButtonElement>('.mnr-theme-btn')[THEMES.length - 1]?.click();

    const closeBtn = document.querySelector('.mnr-close-btn') as HTMLButtonElement | null;
    expect(closeBtn).not.toBeNull();
    closeBtn?.click();
    await nextTick();

    expect(onClose).toHaveBeenCalledTimes(1);
    await vi.waitFor(() =>
      expect(GM_setValue).toHaveBeenCalledWith('mnr-config', expect.stringContaining('"dark"'))
    );

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
    const onCacheAll = vi.fn();
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
          onCacheAll,
          onClearCache,
        }),
    });

    app.mount(mountEl);
    await nextTick();

    expect(document.querySelectorAll('.mnr-chapter-button').length).toBeLessThan(50);
    const search = document.querySelector<HTMLInputElement>('#mnr-chapter-search');
    expect(search).not.toBeNull();
    expect(document.querySelector('#mnr-offline-title')?.textContent).toBe('离线阅读');
    expect(document.querySelector('.mnr-offline-copy span')?.textContent).toBe('已保存 1 章');
    expect(document.querySelectorAll('.mnr-cache-mark svg')).toHaveLength(0);
    const cacheBookButton = document.querySelector<HTMLButtonElement>(
      '.mnr-offline-action.primary'
    );
    expect(cacheBookButton?.textContent?.trim()).toBe('缓存本书');
    cacheBookButton?.click();
    expect(onCacheAll).toHaveBeenCalledTimes(1);
    const clearCacheButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mnr-offline-action')
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
