import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ReaderState {
  isEnabled: boolean;
  currentChapter: string;
  chapters: Array<{ title: string; content: string }>;
  isLoading: boolean;
  currentUrl: string;
}

const getDefaultUrl = (): string =>
  typeof window !== 'undefined' && typeof window.location !== 'undefined'
    ? window.location.href
    : '';

export const useReaderStore = defineStore('reader', () => {
  const isEnabled = ref<ReaderState['isEnabled']>(false);
  const currentChapter = ref<ReaderState['currentChapter']>('');
  const chapters = ref<ReaderState['chapters']>([]);
  const isLoading = ref<ReaderState['isLoading']>(false);
  const currentUrl = ref<ReaderState['currentUrl']>(getDefaultUrl());

  const setState = (updates: Partial<ReaderState>): void => {
    if (typeof updates.isEnabled === 'boolean') {
      isEnabled.value = updates.isEnabled;
    }
    if (typeof updates.currentChapter === 'string') {
      currentChapter.value = updates.currentChapter;
    }
    if (updates.chapters) {
      chapters.value = updates.chapters;
    }
    if (typeof updates.isLoading === 'boolean') {
      isLoading.value = updates.isLoading;
    }
    if (typeof updates.currentUrl === 'string') {
      currentUrl.value = updates.currentUrl;
    }
  };

  const reset = (): void => {
    isEnabled.value = false;
    currentChapter.value = '';
    chapters.value = [];
    isLoading.value = false;
    currentUrl.value = getDefaultUrl();
  };

  return {
    isEnabled,
    currentChapter,
    chapters,
    isLoading,
    currentUrl,
    setState,
    reset,
  };
});
