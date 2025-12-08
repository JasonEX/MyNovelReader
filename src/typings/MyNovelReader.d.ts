export type SiteConfigs = Array<SiteConfig>

export interface SiteConfig {
  siteName: string
  url: string | RegExp
  exampleUrl: string
  titleReg?: RegExp | string
  titlePos?: number
  titleSelector?: string | Array<string> | (($doc: JQuery<Document>) => string)
  chapterTitleReplace?: string | RegExp
  bookTitleSelector?: string | Array<string> | (($doc: JQuery<Document>) => string)
  bookTitleReplace?: string | RegExp | replaceMap | Array<string | RegExp | replaceMap>
  prevSelector?: string | false | (($doc: JQuery<Document>) => string | JQuery<HTMLElement> | undefined)
  prevUrl?: string | false | (($doc: JQuery<Document>) => string | undefined)
  nextSelector?: string | false | (($doc: JQuery<Document>) => string | JQuery<HTMLElement> | undefined)
  nextUrl?: string | false | (($doc: JQuery<Document>) => string | undefined)
  indexSelector?: string | false | (($doc: JQuery<Document>) => string | JQuery<HTMLElement> | undefined)
  indexUrl?: string | false | (($doc: JQuery<Document>) => string | undefined)
  includeUrl?: string | RegExp
  timeout?: number
  mutationSelector?: string
  mutationChildCount?: number
  mutationChildText?: string
  mutationCheck?: ($doc: JQuery<Document>) => boolean
  useiframe?: boolean
  iframeSandbox?: undefined | string
  contentSelector?: string
  checkSection?: boolean
  noSection?: boolean
  contentRemove?: string
  useSiteFont?: boolean | string
  contentReplace?: string | RegExp | replaceMap | Array<string | RegExp | replaceMap>
  contentHandle?: boolean
  useRawContent?: boolean
  cloneNode?: boolean
  withReferer?: boolean
  contentPatch?: ($doc: JQuery<Document>) => void
  contentPatchAsync?: ($doc: JQuery<Document>) => Promise<void>
  getContent?: ($doc: JQuery<Document>) => Promise<{ content?: string; html?: string }>
  handleContentText?: ($content: JQuery<HTMLElement>, info: SiteConfig) => string
  nDelay?: number
  style?: string
  exclude?: string
  fastboot?: boolean
  startLaunch?: ($doc: JQuery<Document>) => void
  startFilter?: ($doc: JQuery<Document>) => void
  fInit?: () => void
  isVipChapter?: ($doc: JQuery<Document>) => boolean | undefined
}

export interface replaceMap {
  [key: string]: string
}

export type Nullable<T> = T | null | undefined;

/**
 * Rule configuration values exported from src/MyNovelReader/rule/index.js.
 */
export interface Rule {
  titleRegExp: RegExp
  titleReplace: RegExp
  nextSelector: string
  prevSelector: string
  nextUrlIgnore: RegExp[]
  nextUrlCompare: RegExp
  indexSelectors: string[]
  contentSelectors: string[]
  bookTitleSelector: string[]
  bookTitleReplace: Array<string | RegExp>
  contentRemove: string
  removeLineRegExp: RegExp
  replaceBrs: RegExp
  specialSite: SiteConfigs
  replace: typeof import('../MyNovelReader/rule/replace.js').default
  replaceAll: typeof import('../MyNovelReader/rule/replaceAll.js').default
  customRules: Array<SiteConfig>
  customReplace: Record<string, string>
  parseCustomReplaceRules: (rules: string) => Record<string, string>
}

/**
 * Parser instance shape returned by Parser.getAll().
 * Parser constructor signature: (info, doc, curPageUrl).
 */
export interface IParser {
  info: Partial<SiteConfig>
  doc: Document
  $doc: JQuery<Document>
  curPageUrl: string
  _curPageHost: string
  isTheEnd: boolean | 'vip'
  isSection: boolean
  $content?: JQuery
  content: string
  bookTitle: string
  chapterTitle: string
  originChapterTitle?: string
  docTitle: string
  indexUrl: string
  prevUrl: string
  nextUrl: string
  theEndColor?: string
  readonly contentTxt: string
}

/**
 * Runtime state snapshot for the App controller.
 */
export type { SiteFontInfo, AppState, AppContext } from '../MyNovelReader/app/core/AppState'

declare global {
  interface JQuery<TElement = HTMLElement> {
    size(): number
    push?(...items: TElement[]): number
  }

  interface JQueryStatic {
    nano?(template: string, data: Record<string, string>): string
  }
}

