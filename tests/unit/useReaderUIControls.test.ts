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

  function createMockStores() {
    const readerStore = {
      rule: null,
      loadToc: vi.fn(),
      reloadCurrentChapter: vi.fn().mockResolvedValue(undefined),
      showToast: vi.fn(),
    };
    const ruleStore = {
      saveUserRule: vi.fn().mockResolvedValue(undefined),
    };
    const showControls = ref(true);

    return { readerStore, ruleStore, showControls };
  }

  it('initializes with correct default state', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    expect(controls.settingsVisible.value).toBe(false);
    expect(controls.ruleEditorVisible.value).toBe(false);
    expect(controls.isPickerActive.value).toBe(false);
    expect(controls.drawerOpen.value).toBe(false);
  });

  it('toggleDrawer opens drawer and loads TOC', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.toggleDrawer();
    expect(controls.drawerOpen.value).toBe(true);
    expect(readerStore.loadToc).toHaveBeenCalled();
  });

  it('toggleDrawer closes drawer without loading TOC', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    // Open first
    controls.toggleDrawer();
    expect(controls.drawerOpen.value).toBe(true);

    // Close
    controls.toggleDrawer();
    expect(controls.drawerOpen.value).toBe(false);
    expect(readerStore.loadToc).toHaveBeenCalledTimes(1); // Only called once on open
  });

  it('openSettings sets settingsVisible and hides controls', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.openSettings();
    expect(controls.settingsVisible.value).toBe(true);
    expect(showControls.value).toBe(false);
  });

  it('openRuleEditor hides settings, shows editor, hides controls', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.openSettings();
    controls.openRuleEditor();
    expect(controls.settingsVisible.value).toBe(false);
    expect(controls.ruleEditorVisible.value).toBe(true);
    expect(showControls.value).toBe(false);
  });

  it('handleRuleSave saves rule and reloads chapter', async () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.ruleEditorVisible.value = true;
    const rule = { contentSelector: '.content' } as any;
    await controls.handleRuleSave(rule);

    expect(ruleStore.saveUserRule).toHaveBeenCalledWith('example.com', rule);
    expect(readerStore.reloadCurrentChapter).toHaveBeenCalled();
    expect(controls.ruleEditorVisible.value).toBe(false);
  });

  it('handleRuleSave shows error toast on failure', async () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    ruleStore.saveUserRule.mockRejectedValue(new Error('save failed'));

    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.ruleEditorVisible.value = true;
    await controls.handleRuleSave({ contentSelector: '.content' } as any);

    expect(readerStore.showToast).toHaveBeenCalledWith('保存失败', 'error');
    expect(controls.ruleEditorVisible.value).toBe(false);
  });

  it('handleRuleReset reloads chapter and hides settings', async () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.settingsVisible.value = true;
    await controls.handleRuleReset();

    expect(controls.settingsVisible.value).toBe(false);
    expect(readerStore.reloadCurrentChapter).toHaveBeenCalled();
  });

  it('handleEscape closes drawer first', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.drawerOpen.value = true;
    controls.ruleEditorVisible.value = true;
    controls.settingsVisible.value = true;

    controls.handleEscape();
    expect(controls.drawerOpen.value).toBe(false);
    // Others remain
    expect(controls.ruleEditorVisible.value).toBe(true);
    expect(controls.settingsVisible.value).toBe(true);
  });

  it('handleEscape closes rule editor if drawer is closed', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.ruleEditorVisible.value = true;
    controls.settingsVisible.value = true;

    controls.handleEscape();
    expect(controls.ruleEditorVisible.value).toBe(false);
    expect(controls.settingsVisible.value).toBe(true);
  });

  it('handleEscape closes settings if nothing else is open', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.settingsVisible.value = true;

    controls.handleEscape();
    expect(controls.settingsVisible.value).toBe(false);
  });

  it('toggleSettings toggles when ruleEditor is not visible', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(true);

    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(false);
  });

  it('toggleSettings does nothing when ruleEditor is visible', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.ruleEditorVisible.value = true;
    controls.toggleSettings();
    expect(controls.settingsVisible.value).toBe(false);
  });

  it('toggleRuleEditor toggles when settings is not visible', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.toggleRuleEditor();
    expect(controls.ruleEditorVisible.value).toBe(true);

    controls.toggleRuleEditor();
    expect(controls.ruleEditorVisible.value).toBe(false);
  });

  it('toggleRuleEditor does nothing when settings is visible', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    controls.settingsVisible.value = true;
    controls.toggleRuleEditor();
    expect(controls.ruleEditorVisible.value).toBe(false);
  });

  it('currentRule returns the reader store rule', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();
    const mockRule = { contentSelector: '.test' };
    readerStore.rule = mockRule;

    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    expect(controls.currentRule.value).toBe(mockRule);
  });

  it('currentDomain extracts hostname from window.location', () => {
    const { readerStore, ruleStore, showControls } = createMockStores();

    const controls = useReaderUIControls({
      readerStore: readerStore as any,
      ruleStore: ruleStore as any,
      showControls,
    });

    expect(controls.currentDomain.value).toBe('example.com');
  });
});
