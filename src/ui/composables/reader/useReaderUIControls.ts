import { computed, type Ref, ref } from 'vue';
import type { SiteRule } from '@/core/rules/types';
import type { useReaderStore } from '@/ui/stores/reader';
import type { useRuleStore } from '@/ui/stores/rule';

export interface UseReaderUIControlsOptions {
  readerStore: ReturnType<typeof useReaderStore>;
  ruleStore: ReturnType<typeof useRuleStore>;
  showControls: Ref<boolean>;
}

export function useReaderUIControls(options: UseReaderUIControlsOptions) {
  const { readerStore, ruleStore, showControls } = options;

  // UI state
  const settingsVisible = ref(false);
  const ruleEditorVisible = ref(false);
  const isPickerActive = ref(false);
  const drawerOpen = ref(false);

  // Computed
  const currentRule = computed(() => readerStore.rule);
  const currentDomain = computed(() => {
    try {
      return new URL(window.location.href).hostname;
    } catch {
      return '';
    }
  });

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

  function openRuleEditor() {
    settingsVisible.value = false;
    ruleEditorVisible.value = true;
    showControls.value = false;
  }

  async function handleRuleSave(rule: SiteRule) {
    if (currentDomain.value) {
      try {
        await ruleStore.saveUserRule(currentDomain.value, rule);
        await readerStore.reloadCurrentChapter();
      } catch (e) {
        console.error('[MNR] Save rule error:', e);
        readerStore.showToast('保存失败', 'error');
      }
    }
    ruleEditorVisible.value = false;
  }

  async function handleRuleReset() {
    settingsVisible.value = false;
    await readerStore.reloadCurrentChapter();
  }

  function handleEscape() {
    if (drawerOpen.value) {
      drawerOpen.value = false;
    } else if (ruleEditorVisible.value) {
      ruleEditorVisible.value = false;
    } else if (settingsVisible.value) {
      settingsVisible.value = false;
    }
  }

  function toggleSettings() {
    if (!ruleEditorVisible.value) {
      settingsVisible.value = !settingsVisible.value;
    }
  }

  function toggleRuleEditor() {
    if (!settingsVisible.value) {
      ruleEditorVisible.value = !ruleEditorVisible.value;
    }
  }

  return {
    settingsVisible,
    ruleEditorVisible,
    isPickerActive,
    drawerOpen,
    currentRule,
    currentDomain,
    toggleDrawer,
    openSettings,
    openRuleEditor,
    handleRuleSave,
    handleRuleReset,
    handleEscape,
    toggleSettings,
    toggleRuleEditor,
  };
}
