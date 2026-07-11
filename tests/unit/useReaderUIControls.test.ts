import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { ref } from 'vue';

import { useReaderUIControls } from '@/ui/composables/reader/useReaderUIControls';

describe('useReaderUIControls', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });

    // test env
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    // test env
    globalThis.document = dom.window.document;
    // test env
    globalThis.location = dom.window.location;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function createControls() {
    const readerStore = {
      loadToc: vi.fn(),
    };
    const showControls = ref(true);
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      showControls,
    });

    return { controls, readerStore, showControls };
  }

  it('initializes with correct default state', () => {
    const { controls } = createControls();

    expect(controls.settingsVisible.value).toBe(false);
    expect(controls.drawerOpen.value).toBe(false);
    expect(controls.hasOpenPanel.value).toBe(false);
  });

  it('toggleDrawer opens drawer and loads TOC', () => {
    const { controls, readerStore, showControls } = createControls();

    controls.toggleDrawer();
    expect(controls.drawerOpen.value).toBe(true);
    expect(controls.hasOpenPanel.value).toBe(true);
    expect(showControls.value).toBe(false);
    expect(readerStore.loadToc).toHaveBeenCalled();
  });

  it('toggleDrawer closes drawer without loading TOC again', () => {
    const { controls, readerStore, showControls } = createControls();

    controls.toggleDrawer();
    controls.toggleDrawer();

    expect(controls.drawerOpen.value).toBe(false);
    expect(showControls.value).toBe(true);
    expect(readerStore.loadToc).toHaveBeenCalledTimes(1);
  });

  it('openSettings sets settingsVisible and hides controls', () => {
    const { controls, showControls } = createControls();

    controls.openSettings();
    expect(controls.settingsVisible.value).toBe(true);
    expect(controls.drawerOpen.value).toBe(false);
    expect(controls.hasOpenPanel.value).toBe(true);
    expect(showControls.value).toBe(false);
  });

  it('keeps drawer and settings mutually exclusive', () => {
    const { controls, showControls } = createControls();

    controls.toggleDrawer();
    controls.openSettings();

    expect(controls.drawerOpen.value).toBe(false);
    expect(controls.settingsVisible.value).toBe(true);
    expect(showControls.value).toBe(false);

    controls.toggleDrawer();

    expect(controls.settingsVisible.value).toBe(false);
    expect(controls.drawerOpen.value).toBe(true);
    expect(showControls.value).toBe(false);
  });

  it('closes only the currently active panel', () => {
    const { controls, showControls } = createControls();

    controls.toggleDrawer();
    controls.closeDrawer();
    expect(controls.hasOpenPanel.value).toBe(false);
    expect(showControls.value).toBe(true);

    controls.openSettings();
    controls.closeSettings();
    expect(controls.hasOpenPanel.value).toBe(false);
    expect(showControls.value).toBe(true);
  });

  it('toggleSettings toggles settings visibility', () => {
    const { controls, showControls } = createControls();

    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(true);
    expect(showControls.value).toBe(false);

    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(false);
    expect(showControls.value).toBe(true);
  });

  it('restores the toolbar state that preceded a keyboard-opened panel', () => {
    const { controls, showControls } = createControls();
    showControls.value = false;

    controls.openSettings();
    controls.closeSettings();

    expect(showControls.value).toBe(false);
  });
});
