import Parser from '../../parser';
import Setting from '../../Setting';
import { C, sleep } from '../../lib';
import { HttpRequest, IframeRequest } from '../../request';
import type { IParser as ParserInstance, SiteConfig } from '../../../typings/MyNovelReader';

interface RequestManagerDependencies {
  loadingElement: JQuery<HTMLElement>;
  appendPage: (_parser: ParserInstance) => void | Promise<void>;
  removeListener: () => void;
  onScroll: () => void | Promise<void>;
  onScrollForce: () => void | Promise<void>;
}

interface RequestManagerInitOptions {
  site: SiteConfig;
  parsedPages?: Record<string, boolean>;
  requestUrl: string | null;
  lastRequestUrl?: string | null;
  curPageUrl: string;
  isTheEnd?: boolean | 'vip';
  dependencies: RequestManagerDependencies;
}

const LOADING_IMG_SRC =
  'data:image/gif;base64,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';

class RequestManager {
  private static instance: RequestManager;

  private site: SiteConfig | null = null;
  private parsedPages: Record<string, boolean> = {};
  private requestUrl: string | null = null;
  private lastRequestUrl: string | null = null;
  private curPageUrl = '';
  private isTheEnd: boolean | 'vip' = false;
  private preloadNextPagePromiseResolve: (() => void) | null = null;

  private httpRequest: HttpRequest | null = null;
  private iframeRequest: IframeRequest | null = null;
  private request: HttpRequest | IframeRequest | null = null;
  private dependencies: RequestManagerDependencies | null = null;

  private constructor() {}

  static getInstance(): RequestManager {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  init(options: RequestManagerInitOptions): void {
    const { site, dependencies, parsedPages, requestUrl, lastRequestUrl, curPageUrl, isTheEnd } =
      options;
    this.site = site;
    this.dependencies = dependencies;
    this.parsedPages = parsedPages ? { ...parsedPages } : {};
    this.requestUrl = requestUrl ?? null;
    this.lastRequestUrl = lastRequestUrl ?? null;
    this.curPageUrl = curPageUrl;
    this.isTheEnd = isTheEnd ?? false;
    this.preloadNextPagePromiseResolve = null;

    this.initRequest();
  }

  getRequest(): HttpRequest | IframeRequest | null {
    return this.request;
  }

  getRequestUrl(): string | null {
    return this.requestUrl;
  }

  getLastRequestUrl(): string | null {
    return this.lastRequestUrl;
  }

  getCurPageUrl(): string {
    return this.curPageUrl;
  }

  setRequestUrl(url: string | null): void {
    this.requestUrl = url;
  }

  setLastRequestUrl(url: string | null): void {
    this.lastRequestUrl = url;
  }

  getIsTheEnd(): boolean | 'vip' {
    return this.isTheEnd;
  }

  setIsTheEnd(value: boolean | 'vip'): void {
    this.isTheEnd = value;
  }

  resolvePreload(): void {
    if (this.preloadNextPagePromiseResolve) {
      this.preloadNextPagePromiseResolve();
      this.preloadNextPagePromiseResolve = null;
    }
  }

  private initRequest(): void {
    if (!this.site || !this.dependencies) {
      return;
    }

    this.httpRequest = new HttpRequest(this.site);
    this.iframeRequest = new IframeRequest(this.site);
    this.request = this.site.useiframe ? this.iframeRequest : this.httpRequest;

    this.httpRequest.setErrorHandle(() => {
      void this.dependencies?.onScrollForce();
    });
    this.httpRequest.setFinishHandle(() => {
      void this.dependencies?.onScroll();
    });

    this.iframeRequest.setErrorHandle(() => {
      void this.dependencies?.onScrollForce();
    });
    this.iframeRequest.setFinishHandle(() => {
      void this.dependencies?.onScroll();
    });
  }

  async doRequest(): Promise<void> {
    if (!this.site || !this.dependencies) {
      return;
    }

    const nextUrl = this.requestUrl;
    const referer = this.lastRequestUrl || this.curPageUrl;
    this.lastRequestUrl = this.requestUrl;

    if (nextUrl && !this.isTheEnd && !(nextUrl in this.parsedPages)) {
      this.curPageUrl = nextUrl;
      this.requestUrl = null;

      const useIframe = !!this.site.useiframe;

      this.showLoading(nextUrl, useIframe);

      await sleep(this.site.nDelay || 0);

      this.request = useIframe ? this.iframeRequest : this.httpRequest;

      C.log('获取下一页', nextUrl);
      if (this.site.withReferer) {
        void this.request?.send(nextUrl, referer);
      } else {
        void this.request?.send(nextUrl);
      }
    }
  }

  async loaded(doc: Document | null): Promise<void> {
    if (!this.site || !doc) {
      return;
    }

    const parser = new Parser(this.site, doc, this.curPageUrl);
    const parserResult = (await parser.getAll()) as ParserInstance;
    await this.addNextPage(parserResult);
  }

  private async addNextPage(parser: ParserInstance): Promise<void> {
    if (parser.content) {
      await this.dependencies?.appendPage(parser);

      this.requestUrl = parser.nextUrl;
      this.isTheEnd = parser.isTheEnd as boolean | 'vip';

      await this.afterLoad();
    } else {
      this.dependencies?.removeListener();

      const msg = parser.isTheEnd === 'vip' ? 'vip 章节，需付费。' : '错误：没有找到下一页的内容。';
      this.dependencies?.loadingElement
        ?.html(
          `<a href="${this.curPageUrl}">${this.translate(msg)}${this.translate(
            '点此打开下一页。'
          )}</a>`
        )
        .show();
    }
  }

  private async afterLoad(): Promise<void> {
    if (Setting.preloadNextPage) {
      await new Promise<void>(resolve => {
        this.preloadNextPagePromiseResolve = resolve;
      });
      await sleep(200);
      void this.doRequest();
    }
  }

  private translate(text: string): string {
    const translator = (text as unknown as { uiTrans?: () => string }).uiTrans;
    if (typeof translator === 'function') {
      return translator.call(text);
    }
    return text;
  }

  private showLoading(nextUrl: string, useIframe: boolean): void {
    const loadingElement = this.dependencies?.loadingElement;
    if (!loadingElement) {
      return;
    }

    loadingElement
      .show()
      .html('')
      .append($('<img>').attr('src', LOADING_IMG_SRC))
      .append(
        `<a href="${nextUrl}" title="点击打开下一页链接" tabindex="-1">${this.translate(
          '正在载入下一页'
        )}${useIframe ? '(iframe)' : ''}...</a>`
      );
  }
}

const requestManager = RequestManager.getInstance();

export { RequestManager, requestManager };
export default requestManager;
