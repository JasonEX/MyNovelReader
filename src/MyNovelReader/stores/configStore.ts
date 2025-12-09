import { defineStore } from 'pinia';
import { type Ref, ref, type ShallowRef, shallowRef } from 'vue';
import config from '../config';
import { toggleConsole } from '../utils/console';
import type { ChineseConversionMode, Language, LaunchMode } from '../types/Setting';

export interface ConfigState {
  copyCurTitle: boolean;
  booklink_enable: boolean;
  debug: boolean;
  addToHistory: boolean;
  dblclickPause: boolean;
  remain_height: number;
  lang: Language;
  font_family: string;
  font_size: string;
  text_line_height: string;
  paragraph_height: string;
  content_width: string;
  extra_css: string;
  customSiteinfo: string;
  customReplaceRules: string;
  skin_name: string;
  menu_list_hiddden: boolean;
  hide_footer_nav: boolean;
  hide_preferences_button: boolean;
  quietModeKey: string;
  openPreferencesKey: string;
  hideMenuListKey: string;
  openSpeechKey: string;
  picNightModeCheck: boolean;
  split_content: boolean;
  scrollAnimate: boolean;
  launchMode: LaunchMode;
  preloadNextPage: boolean;
  chineseConversion: ChineseConversionMode;
  contentNormalize: boolean;
  mergeQoutesContent: boolean;
  fastboot: boolean;
  removeDomainLine: boolean;
}

type SettingKey = keyof ConfigState;

const normalizeLang = (value: string): Language => (value === 'zh-TW' ? 'zh-TW' : 'zh-CN');

const detectLang = (): Language => {
  const locale = typeof navigator === 'object' ? navigator.language : 'zh-CN';
  return locale === 'zh-TW' || locale === 'zh-HK' ? 'zh-TW' : 'zh-CN';
};

const readBoolean = (key: string, defaultValue: boolean): boolean => {
  const stored = GM_getValue<boolean | undefined>(key, defaultValue);
  if (stored === undefined) {
    GM_setValue(key, defaultValue);
    return defaultValue;
  }
  return Boolean(stored);
};

const readNumber = (key: string, defaultValue: number): number => {
  const stored = GM_getValue<number | string | undefined>(key);
  if (stored === undefined || stored === null) {
    GM_setValue(key, defaultValue);
    return defaultValue;
  }

  const parsed = typeof stored === 'string' ? parseInt(stored, 10) : stored;
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const readString = (key: string, defaultValue: string): string =>
  GM_getValue<string>(key, defaultValue) ?? defaultValue;

const normalizeLaunchMode = (value: string): LaunchMode =>
  value === 'manual' || value === 'auto' ? value : 'memory';

const normalizeChineseConversion = (value: string, lang: Language): ChineseConversionMode => {
  if (value === 'to-cn' || value === 'to-tw') {
    return value;
  }
  if (value === 'disable') {
    return 'disable';
  }
  return lang === 'zh-TW' ? 'to-tw' : 'disable';
};

export const useConfigStore = defineStore('config', () => {
  const copyCurTitle = ref<ConfigState['copyCurTitle']>(readBoolean('copyCurTitle', true));
  const setCopyCurTitle = (value: boolean): void => {
    const normalized = Boolean(value);
    copyCurTitle.value = normalized;
    GM_setValue('copyCurTitle', normalized);
  };

  const booklink_enable = ref<ConfigState['booklink_enable']>(readBoolean('booklink_enable', true));
  const setBooklinkEnable = (value: boolean): void => {
    const normalized = Boolean(value);
    booklink_enable.value = normalized;
    GM_setValue('booklink_enable', normalized);
  };

  const debug = ref<ConfigState['debug']>(readBoolean('debug', false));
  const setDebug = (value: boolean): void => {
    const normalized = Boolean(value);
    debug.value = normalized;
    GM_setValue('debug', normalized);
    toggleConsole(normalized);
  };

  const addToHistory = ref<ConfigState['addToHistory']>(
    readBoolean('add_nextpage_to_history', true)
  );
  const setAddToHistory = (value: boolean): void => {
    const normalized = Boolean(value);
    addToHistory.value = normalized;
    GM_setValue('add_nextpage_to_history', normalized);
  };

  const dblclickPause = ref<ConfigState['dblclickPause']>(readBoolean('dblclick_pause', true));
  const setDblclickPause = (value: boolean): void => {
    const normalized = Boolean(value);
    dblclickPause.value = normalized;
    GM_setValue('dblclick_pause', normalized);
  };

  const remain_height = ref<ConfigState['remain_height']>(readNumber('remain_height', 400));
  const setRemainHeight = (value: number): void => {
    remain_height.value = value;
    GM_setValue('remain_height', value);
  };

  const langInitial = normalizeLang(readString('lang', detectLang()));
  config.lang = langInitial;
  const lang = ref<ConfigState['lang']>(langInitial);
  const setLang = (value: Language): void => {
    const normalized = normalizeLang(value);
    lang.value = normalized;
    config.lang = normalized;
    GM_setValue('lang', normalized);
  };

  const font_family = ref<ConfigState['font_family']>(
    readString('font_family', '微软雅黑,宋体,黑体,楷体'.uiTrans())
  );
  const setFontFamily = (value: string): void => {
    font_family.value = value;
    GM_setValue('font_family', value);
  };

  const font_size = ref<ConfigState['font_size']>(readString('font_size', '18px'));
  const setFontSize = (value: string): void => {
    font_size.value = value;
    GM_setValue('font_size', value);
  };

  const text_line_height = ref<ConfigState['text_line_height']>(
    readString('text_line_height', '2em')
  );
  const setTextLineHeight = (value: string): void => {
    text_line_height.value = value;
    GM_setValue('text_line_height', value);
  };

  const paragraph_height = ref<ConfigState['paragraph_height']>(
    readString('paragraph_height', '1em')
  );
  const setParagraphHeight = (value: string): void => {
    paragraph_height.value = value;
    GM_setValue('paragraph_height', value);
  };

  const content_width = ref<ConfigState['content_width']>(readString('content_width', '800px'));
  const setContentWidth = (value: string): void => {
    content_width.value = value;
    GM_setValue('content_width', value);
  };

  const extra_css = ref<ConfigState['extra_css']>(readString('extra_css', ''));
  const setExtraCss = (value: string): void => {
    extra_css.value = value;
    GM_setValue('extra_css', value);
  };

  const customSiteinfo = shallowRef<ConfigState['customSiteinfo']>(
    readString('custom_siteinfo', '[]')
  );
  const setCustomSiteinfo = (value: string): void => {
    customSiteinfo.value = value;
    GM_setValue('custom_siteinfo', value);
  };

  const customReplaceRules = shallowRef<ConfigState['customReplaceRules']>(
    readString('custom_replace_rules', 'b[āà]ng=棒\n『(.)』=$1')
  );

  const setCustomReplaceRules = (value: string): void => {
    customReplaceRules.value = value;
    GM_setValue('custom_replace_rules', value);
  };

  const skin_name = ref<ConfigState['skin_name']>(readString('skin_name', '缺省皮肤'.uiTrans()));
  const setSkinName = (value: string): void => {
    skin_name.value = value;
    GM_setValue('skin_name', value);
  };

  const menu_list_hiddden = ref<ConfigState['menu_list_hiddden']>(
    readBoolean('menu_list_hiddden', false)
  );
  const setMenuListHidden = (value: boolean): void => {
    const normalized = Boolean(value);
    menu_list_hiddden.value = normalized;
    GM_setValue('menu_list_hiddden', normalized);
  };

  const hide_footer_nav = ref<ConfigState['hide_footer_nav']>(readBoolean('hide_footer_nav', true));
  const setHideFooterNav = (value: boolean): void => {
    const normalized = Boolean(value);
    hide_footer_nav.value = normalized;
    GM_setValue('hide_footer_nav', normalized);
  };

  const hide_preferences_button = ref<ConfigState['hide_preferences_button']>(
    readBoolean('hide_preferences_button', false)
  );
  const setHidePreferencesButton = (value: boolean): void => {
    const normalized = Boolean(value);
    hide_preferences_button.value = normalized;
    GM_setValue('hide_preferences_button', normalized);
  };

  const quietModeKey = ref<ConfigState['quietModeKey']>(readString('quietModeKey', 'q'));
  const setQuietModeKey = (value: string): void => {
    quietModeKey.value = value;
    GM_setValue('quietModeKey', value);
  };

  const openPreferencesKey = ref<ConfigState['openPreferencesKey']>(
    readString('open_preferences_key', 's')
  );
  const setOpenPreferencesKey = (value: string): void => {
    openPreferencesKey.value = value;
    GM_setValue('open_preferences_key', value);
  };

  const hideMenuListKey = ref<ConfigState['hideMenuListKey']>(readString('hide_menulist_key', 'c'));
  const setHideMenuListKey = (value: string): void => {
    hideMenuListKey.value = value;
    GM_setValue('hide_menulist_key', value);
  };

  const openSpeechKey = ref<ConfigState['openSpeechKey']>(readString('openSpeechKey', 'a'));
  const setOpenSpeechKey = (value: string): void => {
    openSpeechKey.value = value;
    GM_setValue('openSpeechKey', value);
  };

  const picNightModeCheck = ref<ConfigState['picNightModeCheck']>(
    readBoolean('picNightModeCheck', true)
  );
  const setPicNightModeCheck = (value: boolean): void => {
    const normalized = Boolean(value);
    picNightModeCheck.value = normalized;
    GM_setValue('picNightModeCheck', normalized);
  };

  const split_content = ref<ConfigState['split_content']>(readBoolean('split_content', false));
  const setSplitContent = (value: boolean): void => {
    const normalized = Boolean(value);
    split_content.value = normalized;
    GM_setValue('split_content', normalized);
  };

  const scrollAnimate = ref<ConfigState['scrollAnimate']>(readBoolean('scrollAnimate', false));
  const setScrollAnimate = (value: boolean): void => {
    const normalized = Boolean(value);
    scrollAnimate.value = normalized;
    GM_setValue('scrollAnimate', normalized);
  };

  const launchMode = ref<ConfigState['launchMode']>(
    normalizeLaunchMode(readString('launchMode', 'memory'))
  );
  const setLaunchMode = (value: LaunchMode): void => {
    const normalized = normalizeLaunchMode(value);
    launchMode.value = normalized;
    GM_setValue('launchMode', normalized);
  };

  const preloadNextPage = ref<ConfigState['preloadNextPage']>(readBoolean('preloadNextPage', true));
  const setPreloadNextPage = (value: boolean): void => {
    const normalized = Boolean(value);
    preloadNextPage.value = normalized;
    GM_setValue('preloadNextPage', normalized);
  };

  const chineseConversion = ref<ConfigState['chineseConversion']>(
    normalizeChineseConversion(
      readString('chineseConversion', langInitial === 'zh-TW' ? 'to-tw' : 'disable'),
      langInitial
    )
  );
  const setChineseConversion = (value: ChineseConversionMode): void => {
    const normalized = normalizeChineseConversion(value, lang.value);
    chineseConversion.value = normalized;
    GM_setValue('chineseConversion', normalized);
  };

  const contentNormalize = ref<ConfigState['contentNormalize']>(
    readBoolean('contentNormalize', true)
  );
  const setContentNormalize = (value: boolean): void => {
    const normalized = Boolean(value);
    contentNormalize.value = normalized;
    GM_setValue('contentNormalize', normalized);
  };

  const mergeQoutesContent = ref<ConfigState['mergeQoutesContent']>(
    readBoolean('mergeQoutesContent', false)
  );
  const setMergeQoutesContent = (value: boolean): void => {
    const normalized = Boolean(value);
    mergeQoutesContent.value = normalized;
    GM_setValue('mergeQoutesContent', normalized);
  };

  const fastboot = ref<ConfigState['fastboot']>(readBoolean('fastboot', false));
  const setFastboot = (value: boolean): void => {
    const normalized = Boolean(value);
    fastboot.value = normalized;
    GM_setValue('fastboot', normalized);
  };

  const removeDomainLine = ref<ConfigState['removeDomainLine']>(
    readBoolean('removeDomainLine', true)
  );
  const setRemoveDomainLine = (value: boolean): void => {
    const normalized = Boolean(value);
    removeDomainLine.value = normalized;
    GM_setValue('removeDomainLine', normalized);
  };

  const settingRefs: { [K in SettingKey]: Ref<ConfigState[K]> | ShallowRef<ConfigState[K]> } = {
    copyCurTitle,
    booklink_enable,
    debug,
    addToHistory,
    dblclickPause,
    remain_height,
    lang,
    font_family,
    font_size,
    text_line_height,
    paragraph_height,
    content_width,
    extra_css,
    customSiteinfo,
    customReplaceRules,
    skin_name,
    menu_list_hiddden,
    hide_footer_nav,
    hide_preferences_button,
    quietModeKey,
    openPreferencesKey,
    hideMenuListKey,
    openSpeechKey,
    picNightModeCheck,
    split_content,
    scrollAnimate,
    launchMode,
    preloadNextPage,
    chineseConversion,
    contentNormalize,
    mergeQoutesContent,
    fastboot,
    removeDomainLine,
  };

  const setters: { [K in SettingKey]: (value: ConfigState[K]) => void } = {
    copyCurTitle: setCopyCurTitle,
    booklink_enable: setBooklinkEnable,
    debug: setDebug,
    addToHistory: setAddToHistory,
    dblclickPause: setDblclickPause,
    remain_height: setRemainHeight,
    lang: setLang,
    font_family: setFontFamily,
    font_size: setFontSize,
    text_line_height: setTextLineHeight,
    paragraph_height: setParagraphHeight,
    content_width: setContentWidth,
    extra_css: setExtraCss,
    customSiteinfo: setCustomSiteinfo,
    customReplaceRules: setCustomReplaceRules,
    skin_name: setSkinName,
    menu_list_hiddden: setMenuListHidden,
    hide_footer_nav: setHideFooterNav,
    hide_preferences_button: setHidePreferencesButton,
    quietModeKey: setQuietModeKey,
    openPreferencesKey: setOpenPreferencesKey,
    hideMenuListKey: setHideMenuListKey,
    openSpeechKey: setOpenSpeechKey,
    picNightModeCheck: setPicNightModeCheck,
    split_content: setSplitContent,
    scrollAnimate: setScrollAnimate,
    launchMode: setLaunchMode,
    preloadNextPage: setPreloadNextPage,
    chineseConversion: setChineseConversion,
    contentNormalize: setContentNormalize,
    mergeQoutesContent: setMergeQoutesContent,
    fastboot: setFastboot,
    removeDomainLine: setRemoveDomainLine,
  };

  const getSetting = <K extends SettingKey>(key: K): ConfigState[K] => settingRefs[key].value;

  const setSetting = <K extends SettingKey>(key: K, value: ConfigState[K]): void => {
    setters[key](value);
  };

  const resetSettings = (): void => {
    setCopyCurTitle(true);
    setBooklinkEnable(true);
    setDebug(false);
    setAddToHistory(true);
    setDblclickPause(true);
    setRemainHeight(400);
    const resetLang = detectLang();
    setLang(resetLang);
    setFontFamily('微软雅黑,宋体,黑体,楷体'.uiTrans());
    setFontSize('18px');
    setTextLineHeight('2em');
    setParagraphHeight('1em');
    setContentWidth('800px');
    setExtraCss('');
    setCustomSiteinfo('[]');
    setCustomReplaceRules('b[āà]ng=棒\n『(.)』=$1');
    setSkinName('缺省皮肤'.uiTrans());
    setMenuListHidden(false);
    setHideFooterNav(true);
    setHidePreferencesButton(false);
    setQuietModeKey('q');
    setOpenPreferencesKey('s');
    setHideMenuListKey('c');
    setOpenSpeechKey('a');
    setPicNightModeCheck(true);
    setSplitContent(false);
    setScrollAnimate(false);
    setLaunchMode('memory');
    setPreloadNextPage(true);
    setChineseConversion(resetLang === 'zh-TW' ? 'to-tw' : 'disable');
    setContentNormalize(true);
    setMergeQoutesContent(false);
    setFastboot(false);
    setRemoveDomainLine(true);
  };

  return {
    copyCurTitle,
    booklink_enable,
    debug,
    addToHistory,
    dblclickPause,
    remain_height,
    lang,
    font_family,
    font_size,
    text_line_height,
    paragraph_height,
    content_width,
    extra_css,
    customSiteinfo,
    customReplaceRules,
    skin_name,
    menu_list_hiddden,
    hide_footer_nav,
    hide_preferences_button,
    quietModeKey,
    openPreferencesKey,
    hideMenuListKey,
    openSpeechKey,
    picNightModeCheck,
    split_content,
    scrollAnimate,
    launchMode,
    preloadNextPage,
    chineseConversion,
    contentNormalize,
    mergeQoutesContent,
    fastboot,
    removeDomainLine,
    getSetting,
    setSetting,
    setCopyCurTitle,
    resetSettings,
  };
});
