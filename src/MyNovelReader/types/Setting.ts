/**
 * Shape of the runtime Setting singleton defined in Setting.js.
 * Defaults for each field are documented alongside the property.
 */
export type Language = 'zh-CN' | 'zh-TW';

export type LaunchMode = 'memory' | 'auto' | 'manual';

export type ChineseConversionMode = 'disable' | 'to-tw' | 'to-cn';

/**
 * Setting uses ES5 getters/setters; fields are read and assigned directly.
 * Only `setCopyCurTitle` is an actual method.
 */
export interface ISetting {
  /** Automatically copy the current chapter title to clipboard. Default: true. */
  copyCurTitle: boolean;
  /** Only explicit method on Setting; persists copyCurTitle. */
  setCopyCurTitle: (value: boolean) => void;
  /** Auto-start when coming from booklink.me. Default: true. */
  booklink_enable: boolean;
  /** Enable debug logging. Default: false. */
  debug: boolean;
  /** Push next-page URL into browser history. Default: true. */
  addToHistory: boolean;
  /** Pause scroll on double click. Default: true. */
  dblclickPause: boolean;
  /** Remaining height in px before loading the next page. Default: 400. */
  remain_height: number;
  /** UI language. Defaults to browser language fallback. */
  lang: Language;
  /** Font family applied to content text. */
  font_family: string;
  /** Content font size, e.g. `18px`. */
  font_size: string;
  /** Line height for text, e.g. `2em`. */
  text_line_height: string;
  /** Paragraph spacing value, e.g. `1em`. */
  paragraph_height: string;
  /** Maximum content width, e.g. `800px`. */
  content_width: string;
  /** Custom CSS appended to the page. */
  extra_css: string;
  /** Custom site rules JSON string. */
  customSiteinfo: string;
  /** Custom replacement rules text block. */
  customReplaceRules: string;
  /** Current skin name. */
  skin_name: string;
  /** Hide the chapter list menu. Default: false. */
  menu_list_hiddden: boolean;
  /** Hide footer navigation bar. Default: true. */
  hide_footer_nav: boolean;
  /** Hide preferences button. Default: false. */
  hide_preferences_button: boolean;
  /** Shortcut to toggle quiet mode. Default: 'q'. */
  quietModeKey: string;
  /** Shortcut to open preferences. Default: 's'. */
  openPreferencesKey: string;
  /** Shortcut to toggle the menu list. Default: 'c'. */
  hideMenuListKey: string;
  /** Shortcut to open speech/tts. Default: 'a'. */
  openSpeechKey: string;
  /** Whether to change skin for image chapters in night mode. Default: true. */
  picNightModeCheck: boolean;
  /** Split long content into paragraphs. Default: false. */
  split_content: boolean;
  /** Animate scroll when jumping. Default: false. */
  scrollAnimate: boolean;
  /** Launch strategy. Default: 'memory'. */
  launchMode: LaunchMode;
  /** Preload next page in the background. Default: true. */
  preloadNextPage: boolean;
  /** Traditional/simplified conversion mode. Default: based on language. */
  chineseConversion: ChineseConversionMode;
  /** Normalize punctuation and layout in content. Default: true. */
  contentNormalize: boolean;
  /** Merge quoted multi-line content. Default: false. */
  mergeQoutesContent: boolean;
  /** Skip waits for faster start. Default: false. */
  fastboot: boolean;
  /** Remove lines containing the current domain. Default: true. */
  removeDomainLine: boolean;
  /**
   * Optional runtime-only flags toggled by the UI but not persisted by Setting.js.
   * Included for compatibility with UI helpers.
   */
  menu_bar_hidden?: boolean;
  isQuietMode?: boolean;
}
