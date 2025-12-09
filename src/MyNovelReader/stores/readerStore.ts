import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import type { SiteConfig } from '../../typings/MyNovelReader';
import type { AppState, SiteFontInfo } from '../app/core/AppState';

export interface ReaderState extends Pick<
  AppState,
  | 'isEnabled'
  | 'parsedPages'
  | 'pageNum'
  | 'paused'
  | 'curPageUrl'
  | 'requestUrl'
  | 'lastRequestUrl'
  | 'curFocusElement'
  | 'curFocusIndex'
  | 'scrollOffsets'
  | 'site'
  | 'siteFontInfo'
  | 'isTheEnd'
  | 'activeUrl'
> {
  indexUrl: string | null;
  prevUrl: string | null;
}

const getCurrentUrl = (): string =>
  typeof window !== 'undefined' && typeof window.location !== 'undefined'
    ? window.location.href
    : '';

const createDefaultState = (): ReaderState => ({
  isEnabled: false,
  parsedPages: {},
  pageNum: 1,
  paused: false,
  curPageUrl: getCurrentUrl(),
  requestUrl: null,
  lastRequestUrl: null,
  curFocusElement: null,
  curFocusIndex: 1,
  scrollOffsets: [],
  site: null,
  siteFontInfo: null,
  isTheEnd: false,
  activeUrl: null,
  indexUrl: null,
  prevUrl: null,
});

export const useReaderStore = defineStore('reader', () => {
  const defaults = createDefaultState();

  const isEnabled = ref<ReaderState['isEnabled']>(defaults.isEnabled);
  const parsedPages = shallowRef<ReaderState['parsedPages']>(defaults.parsedPages);
  const pageNum = ref<ReaderState['pageNum']>(defaults.pageNum);
  const paused = ref<ReaderState['paused']>(defaults.paused);
  const curPageUrl = ref<ReaderState['curPageUrl']>(defaults.curPageUrl);
  const requestUrl = ref<ReaderState['requestUrl']>(defaults.requestUrl);
  const lastRequestUrl = ref<ReaderState['lastRequestUrl']>(defaults.lastRequestUrl);
  const curFocusElement = shallowRef<ReaderState['curFocusElement']>(defaults.curFocusElement);
  const curFocusIndex = ref<ReaderState['curFocusIndex']>(defaults.curFocusIndex);
  const scrollOffsets = shallowRef<ReaderState['scrollOffsets']>(defaults.scrollOffsets);
  const site = shallowRef<SiteConfig | null>(defaults.site);
  const siteFontInfo = shallowRef<SiteFontInfo | null>(defaults.siteFontInfo);
  const isTheEnd = ref<AppState['isTheEnd']>(defaults.isTheEnd);
  const activeUrl = ref<ReaderState['activeUrl']>(defaults.activeUrl);
  const indexUrl = ref<ReaderState['indexUrl']>(defaults.indexUrl);
  const prevUrl = ref<ReaderState['prevUrl']>(defaults.prevUrl);

  const currentUrl = computed(() => activeUrl.value ?? curPageUrl.value);
  const hasPendingRequest = computed(
    () => Boolean(requestUrl.value) || Boolean(lastRequestUrl.value)
  );
  const hasSite = computed(() => site.value !== null);

  const getState = (): ReaderState => ({
    isEnabled: isEnabled.value,
    parsedPages: parsedPages.value,
    pageNum: pageNum.value,
    paused: paused.value,
    curPageUrl: curPageUrl.value,
    requestUrl: requestUrl.value,
    lastRequestUrl: lastRequestUrl.value,
    curFocusElement: curFocusElement.value,
    curFocusIndex: curFocusIndex.value,
    scrollOffsets: scrollOffsets.value,
    site: site.value,
    siteFontInfo: siteFontInfo.value,
    isTheEnd: isTheEnd.value,
    activeUrl: activeUrl.value,
    indexUrl: indexUrl.value,
    prevUrl: prevUrl.value,
  });

  const setState = (updates: Partial<ReaderState>): void => {
    if (updates.isEnabled !== undefined) {
      isEnabled.value = updates.isEnabled;
    }
    if (updates.parsedPages !== undefined) {
      parsedPages.value = updates.parsedPages;
    }
    if (updates.pageNum !== undefined) {
      pageNum.value = updates.pageNum;
    }
    if (updates.paused !== undefined) {
      paused.value = updates.paused;
    }
    if (updates.curPageUrl !== undefined) {
      curPageUrl.value = updates.curPageUrl;
    }
    if (updates.requestUrl !== undefined) {
      requestUrl.value = updates.requestUrl;
    }
    if (updates.lastRequestUrl !== undefined) {
      lastRequestUrl.value = updates.lastRequestUrl;
    }
    if (updates.curFocusElement !== undefined) {
      curFocusElement.value = updates.curFocusElement;
    }
    if (updates.curFocusIndex !== undefined) {
      curFocusIndex.value = updates.curFocusIndex;
    }
    if (updates.scrollOffsets !== undefined) {
      scrollOffsets.value = updates.scrollOffsets;
    }
    if (updates.site !== undefined) {
      site.value = updates.site;
    }
    if (updates.siteFontInfo !== undefined) {
      siteFontInfo.value = updates.siteFontInfo;
    }
    if (updates.isTheEnd !== undefined) {
      isTheEnd.value = updates.isTheEnd;
    }
    if (updates.activeUrl !== undefined) {
      activeUrl.value = updates.activeUrl;
    }
    if (updates.indexUrl !== undefined) {
      indexUrl.value = updates.indexUrl;
    }
    if (updates.prevUrl !== undefined) {
      prevUrl.value = updates.prevUrl;
    }
  };

  const reset = (): void => {
    const next = createDefaultState();
    setState(next);
  };

  return {
    isEnabled,
    parsedPages,
    pageNum,
    paused,
    curPageUrl,
    requestUrl,
    lastRequestUrl,
    curFocusElement,
    curFocusIndex,
    scrollOffsets,
    site,
    siteFontInfo,
    isTheEnd,
    activeUrl,
    indexUrl,
    prevUrl,
    currentUrl,
    hasPendingRequest,
    hasSite,
    getState,
    setState,
    reset,
  };
});
