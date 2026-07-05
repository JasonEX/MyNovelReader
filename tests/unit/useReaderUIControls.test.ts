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

    // @ts-expect-error - test env
    globalThis.window = dom.window;
    // @ts-expect-error - test env
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env
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
  });

  it('toggleDrawer opens drawer and loads TOC', () => {
    const { controls, readerStore } = createControls();

    controls.toggleDrawer();
    expect(controls.drawerOpen.value).toBe(true);
    expect(readerStore.loadToc).toHaveBeenCalled();
  });

  it('toggleDrawer closes drawer without loading TOC again', () => {
    const { controls, readerStore } = createControls();

    controls.toggleDrawer();
    controls.toggleDrawer();

    expect(controls.drawerOpen.value).toBe(false);
    expect(readerStore.loadToc).toHaveBeenCalledTimes(1);
  });

  it('openSettings sets settingsVisible and hides controls', () => {
    const { controls, showControls } = createControls();

    controls.openSettings();
    expect(controls.settingsVisible.value).toBe(true);
    expect(showControls.value).toBe(false);
  });

  it('handleEscape closes drawer before settings', () => {
    const { controls } = createControls();

    controls.drawerOpen.value = true;
    controls.settingsVisible.value = true;

    controls.handleEscape();
    expect(controls.drawerOpen.value).toBe(false);
    expect(controls.settingsVisible.value).toBe(true);
  });

  it('handleEscape closes settings when drawer is closed', () => {
    const { controls } = createControls();

    controls.settingsVisible.value = true;
    controls.handleEscape();

    expect(controls.settingsVisible.value).toBe(false);
  });

  it('toggleSettings toggles settings visibility', () => {
    const { controls } = createControls();

    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(true);

    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(false);
  });
});
