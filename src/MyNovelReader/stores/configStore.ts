import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ConfigState {
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
}

export const useConfigStore = defineStore('config', () => {
  const fontSize = ref<ConfigState['fontSize']>(18);
  const fontFamily = ref<ConfigState['fontFamily']>('sans-serif');
  const backgroundColor = ref<ConfigState['backgroundColor']>('#ffffff');

  const setConfig = (updates: Partial<ConfigState>): void => {
    if (typeof updates.fontSize === 'number') {
      fontSize.value = updates.fontSize;
    }
    if (typeof updates.fontFamily === 'string') {
      fontFamily.value = updates.fontFamily;
    }
    if (typeof updates.backgroundColor === 'string') {
      backgroundColor.value = updates.backgroundColor;
    }
  };

  const reset = (): void => {
    fontSize.value = 18;
    fontFamily.value = 'sans-serif';
    backgroundColor.value = '#ffffff';
  };

  return {
    fontSize,
    fontFamily,
    backgroundColor,
    setConfig,
    reset,
  };
});
