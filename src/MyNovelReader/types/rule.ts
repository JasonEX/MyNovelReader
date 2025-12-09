/**
 * Site rule definitions used by the parser and coordinator.
 * Based on `typings/MyNovelReader.d.ts` with added selector flexibility and fixImage flag.
 */
export type SiteConfigs = SiteConfig[];

/** Map used for replacement rules (pattern -> replacement). */
export type ReplaceMap = Record<string, string>;

/** Backward-compatible alias for ReplaceMap (legacy camelCase name). */
export type replaceMap = ReplaceMap;

/** Replacement rule used in site configurations. */
export type RuleReplacement = string | RegExp | ReplaceMap | Array<string | RegExp | ReplaceMap>;

/** Result payload returned by custom content loaders. */
export type ContentResult = { content?: string; html?: string };

/** Callback signature for content loaders using node-style callbacks. */
export type GetContentCallback = (result: ContentResult) => void;

/** Custom content loader allowing promise or callback patterns. */
export type GetContentHandler =
  | (($doc: JQuery<Document>) => Promise<ContentResult | undefined>)
  | (($doc: JQuery<Document>, callback: GetContentCallback) => void);

/** Selector handler that receives the parsed document. */
export type SelectorHandler<T> = ($doc: JQuery<Document>) => T;

/** Selector that accepts a CSS selector string, a handler, or `false` to disable it. */
export type SelectorValue<T> = string | false | SelectorHandler<T>;

/** Selector that resolves to a DOM element locator or a concrete element collection. */
export type ElementSelector = SelectorValue<string | JQuery<HTMLElement> | undefined>;

/** Selector that resolves to text content. */
export type TextSelector = SelectorValue<string>;

/** Selector that resolves to a URL or is disabled. */
export type UrlSelector = SelectorValue<string | undefined>;

export interface SiteConfig {
  siteName: string;
  url: string | RegExp;
  exampleUrl: string;
  titleReg?: RegExp | string;
  titlePos?: number;
  /** Can be a CSS selector, selector tuple [selector, replace], function, or disabled via false. */
  titleSelector?: TextSelector | [string, string?] | string[];
  chapterTitleReplace?: string | RegExp;
  /** Can be a CSS selector, selector tuple [selector, replace], function, or disabled via false. */
  bookTitleSelector?: TextSelector | [string, string?] | string[];
  bookTitleReplace?: RuleReplacement;
  prevSelector?: ElementSelector;
  prevUrl?: UrlSelector;
  nextSelector?: ElementSelector;
  nextUrl?: UrlSelector;
  indexSelector?: ElementSelector;
  indexUrl?: UrlSelector;
  includeUrl?: string | RegExp;
  timeout?: number;
  mutationSelector?: string;
  mutationChildCount?: number;
  mutationChildText?: string;
  mutationCheck?: ($doc: JQuery<Document>) => boolean;
  useiframe?: boolean;
  iframeSandbox?: string;
  contentSelector?: SelectorValue<string | undefined>;
  checkSection?: boolean;
  noSection?: boolean;
  contentRemove?: string;
  useSiteFont?: boolean | string;
  contentReplace?: RuleReplacement;
  contentHandle?: boolean;
  useRawContent?: boolean;
  cloneNode?: boolean;
  withReferer?: boolean;
  contentPatch?: ($doc: JQuery<Document>) => void;
  contentPatchAsync?: ($doc: JQuery<Document>) => Promise<void>;
  getContent?: GetContentHandler;
  handleContentText?: ($content: JQuery<HTMLElement>, info: SiteConfig) => string;
  nDelay?: number;
  style?: string;
  exclude?: string;
  fastboot?: boolean;
  startLaunch?: ($doc: JQuery<Document>) => void;
  startFilter?: ($doc: JQuery<Document>) => void;
  fInit?: () => void;
  isVipChapter?: ($doc: JQuery<Document>) => boolean | undefined;
  /** Whether to normalize images within the content section. */
  fixImage?: boolean;
}

export interface Rule {
  titleRegExp: RegExp;
  titleReplace: RegExp;
  nextSelector: string;
  prevSelector: string;
  nextUrlIgnore: RegExp[];
  nextUrlCompare: RegExp;
  indexSelectors: string[];
  contentSelectors: string[];
  bookTitleSelector: string[];
  bookTitleReplace: Array<string | RegExp>;
  contentRemove: string;
  removeLineRegExp: RegExp;
  replaceBrs: RegExp;
  specialSite: SiteConfigs;
  replace: typeof import('../rule/replace.js').default;
  replaceAll: typeof import('../rule/replaceAll.js').default;
  customRules: Array<SiteConfig>;
  customReplace: ReplaceMap;
  parseCustomReplaceRules: (rules: string) => ReplaceMap;
}
