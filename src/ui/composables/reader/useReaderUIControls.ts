import { type Ref, ref } from 'vue';
import type { useReaderStore } from '@/ui/stores/reader';

export interface UseReaderUIControlsOptions {
  readerStore: ReturnType<typeof useReaderStore>;
  showControls: Ref<boolean>;
}

export function useReaderUIControls(options: UseReaderUIControlsOptions) {
  const { readerStore, showControls } = options;

  // UI state
  const settingsVisible = ref(false);
  const drawerOpen = ref(false);

  // Methods
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value;
    if (drawerOpen.value) {
      readerStore.loadToc();
    }
  }

  function openSettings() {
    settingsVisible.value = true;
    showControls.value = false;
  }

  function closeSettings() {
    settingsVisible.value = false;
    showControls.value = true;
  }

  function handleEscape() {
    if (drawerOpen.value) {
      drawerOpen.value = false;
    } else if (settingsVisible.value) {
      closeSettings();
    }
  }

  function toggleSettings() {
    if (settingsVisible.value) {
      closeSettings();
    } else {
      openSettings();
    }
  }

  return {
    settingsVisible,
    drawerOpen,
    toggleDrawer,
    openSettings,
    closeSettings,
    handleEscape,
    toggleSettings,
  };
}
