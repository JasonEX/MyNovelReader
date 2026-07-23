import { computed, nextTick, type Ref, ref } from 'vue';
import { getDeepActiveElement } from '@/ui/focus';
import type { useReaderStore } from '@/ui/stores/reader';

export interface UseReaderUIControlsOptions {
  readerStore: ReturnType<typeof useReaderStore>;
  showControls: Ref<boolean>;
}

export function useReaderUIControls(options: UseReaderUIControlsOptions) {
  const { readerStore, showControls } = options;
  const activePanel = ref<'drawer' | 'settings' | null>(null);
  const settingsVisible = computed(() => activePanel.value === 'settings');
  const drawerOpen = computed(() => activePanel.value === 'drawer');
  const hasOpenPanel = computed(() => activePanel.value !== null);
  let previouslyFocused: globalThis.HTMLElement | null = null;
  let controlsVisibleBeforePanel = true;

  function setActivePanel(panel: 'drawer' | 'settings' | null) {
    if (activePanel.value === null && panel !== null) {
      previouslyFocused = getDeepActiveElement();
      controlsVisibleBeforePanel = showControls.value;
    }

    activePanel.value = panel;
    showControls.value = panel === null ? controlsVisibleBeforePanel : false;

    if (panel === null && previouslyFocused) {
      const focusTarget = previouslyFocused;
      previouslyFocused = null;
      void nextTick(() => focusTarget.focus({ preventScroll: true }));
    }
  }

  function toggleDrawer() {
    const nextPanel = drawerOpen.value ? null : 'drawer';
    setActivePanel(nextPanel);
    if (nextPanel === 'drawer') readerStore.loadToc();
  }

  function closeDrawer() {
    if (drawerOpen.value) setActivePanel(null);
  }

  function openSettings() {
    setActivePanel('settings');
  }

  function closeSettings() {
    if (settingsVisible.value) setActivePanel(null);
  }

  function toggleSettings() {
    setActivePanel(settingsVisible.value ? null : 'settings');
  }

  return {
    settingsVisible,
    drawerOpen,
    hasOpenPanel,
    toggleDrawer,
    closeDrawer,
    openSettings,
    closeSettings,
    toggleSettings,
  };
}
