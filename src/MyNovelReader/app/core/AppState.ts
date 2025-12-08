import type { IParser as ParserInstance, SiteConfig } from '../../../typings/MyNovelReader';
import type { HttpRequest, IframeRequest } from '../../request';

export interface SiteFontInfo {
  external: string[];
  internal: Array<{ fontFamily: string; cssText: string }>;
  family: string[];
  siteFontFamily?: string;
}

export interface AppState {
  isEnabled: boolean;
  parsedPages: Record<string, boolean>;
  pageNum: number;
  paused: boolean;
  curPageUrl: string;
  requestUrl: string | null;
  lastRequestUrl: string | null;
  curFocusElement: HTMLElement | null;
  curFocusIndex: number;
  scrollOffsets: number[];
  site: SiteConfig | null;
  siteFontInfo: SiteFontInfo | null;
  isTheEnd: boolean | 'vip';
  activeUrl: string | null;
  remove: Array<() => void>;
  preloadNextPagePromiseResolve: (() => void) | null;
}

export interface AppContext extends AppState {
  iframe?: HTMLIFrameElement | null;
  request?: HttpRequest | IframeRequest | null;
  httpRequest?: HttpRequest | null;
  iframeRequest?: IframeRequest | null;
  oArticles?: unknown[];
  parsers?: ParserInstance[];
  indexUrl?: string;
  prevUrl?: string | null;
  $doc?: JQuery<Document>;
  $menuBar?: JQuery<HTMLElement>;
  $menu?: JQuery<HTMLElement>;
  $content?: JQuery<HTMLElement>;
  $loading?: JQuery<HTMLElement>;
  $preferencesBtn?: JQuery<HTMLElement>;
  $menuHeader?: JQuery<HTMLElement>;
  $chapterList?: JQuery<HTMLElement>;
  appendPage?: (_parser: ParserInstance, _skipScroll?: boolean) => void | Promise<void>;
  scroll?: () => void | Promise<void>;
  scrollForce?: () => void | Promise<void>;
  scrollToArticle?: (_elem: unknown) => void | Promise<void>;
  removeListener?: () => void;
  doRequest?: () => Promise<void>;
  loaded?: (_doc: Document | null) => Promise<void>;
  getRemain?: () => number;
  getSiteFontInfo?: () => SiteFontInfo | null;
}
