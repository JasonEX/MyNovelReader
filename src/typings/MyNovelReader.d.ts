export type SiteConfigs = Array<SiteConfig>

export interface SiteConfig {
  siteName: string
  url: string | RegExp
  exampleUrl: string
  titleReg?: RegExp | string
  titlePos?: number
  titleSelector?: string | Array<string> | (($doc: JQuery<Document>) => string)
  chapterTitleReplace?: string
  bookTitleSelector?: string | Array<string> | (($doc: JQuery<Document>) => string)
  bookTitleReplace?: string | RegExp | replaceMap | Array<string | RegExp | replaceMap>
  prevSelector?: string | (($doc: JQuery<Document>) => string | undefined)
  prevUrl?: string | (($doc: JQuery<Document>) => string | undefined)
  nextSelector?: string | (($doc: JQuery<Document>) => string | undefined)
  nextUrl?: string | (($doc: JQuery<Document>) => string | undefined)
  indexSelector?: string | (($doc: JQuery<Document>) => string | undefined)
  indexUrl?: string | (($doc: JQuery<Document>) => string | undefined)
  timeout?: number
  mutationSelector?: string
  mutationChildCount?: number
  mutationChildText?: string
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
  handleContentText?: ($content: JQuery, info: SiteConfig) => string
  nDelay?: number
  style?: string
  exclude?: string
  fastboot?: boolean
  startLaunch?: ($doc: JQuery<Document>) => void
  startFilter?: ($doc: JQuery<Document>) => void
  fInit?: () => void
  isVipChapter?: ($doc: JQuery<Document>) => boolean | undefined
}

interface replaceMap {
  [key: string]: string
}
