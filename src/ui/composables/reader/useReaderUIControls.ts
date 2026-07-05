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

  function handleEscape() {
    if (drawerOpen.value) {
      drawerOpen.value = false;
    } else if (settingsVisible.value) {
      settingsVisible.value = false;
    }
  }

  function toggleSettings() {
    settingsVisible.value = !settingsVisible.value;
  }

  return {
    settingsVisible,
    drawerOpen,
    toggleDrawer,
    openSettings,
    handleEscape,
    toggleSettings,
  };
}
