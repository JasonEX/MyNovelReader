import Setting from '../Setting';
import { C, sleep } from '../lib';
import { observeElement } from '../libdom';
import { iframeHeight, RequestStatus } from './constants';
import { BaseRequest } from './BaseRequest';
import type { SiteConfig } from '../types';

declare const _: any; // underscore.js global

/**
 * Iframe request implementation for sandboxed sites.
 */
export class IframeRequest extends BaseRequest {
  private iframe: HTMLIFrameElement | null = null;
  private doc: Document | null = null;
  private win: Window | null = null;
  private resolve: ((doc: Document | null) => void) | null = null;

  get display(): boolean {
    return this.iframe !== null && !this.iframe.style.display;
  }

  async send(url: string): Promise<Document | null> {
    if (!this.iframe) {
      this.iframe = createIframe(this.loaded.bind(this), this.siteInfo);
    }
    this.status = RequestStatus.Loading;
    this.doc = this.win = null;

    if (!this.display) {
      this.show();
    }

    const src = url + '#mynovelreader';

    if (this.iframe.src === src) {
      this.iframe.setAttribute('src', 'about:blank');
      await sleep(100);
      this.iframe.setAttribute('src', src);
    } else {
      this.iframe.setAttribute('src', src);
    }

    return new Promise<Document | null>(resolve => {
      this.resolve = resolve;
    });
  }

  private async loaded(): Promise<void> {
    this.doc = this.iframe?.contentDocument ?? null;
    this.win = this.iframe?.contentWindow ?? null;

    if (!this.doc) {
      this.status = RequestStatus.Fail;
      this.hide();
      this.errorHandle();
      this.resolve?.(null);
      C.error('IframeRequest 请求过程出现异常');
      return;
    }

    // Trigger scroll to load lazy content
    this.win?.dispatchEvent(new WheelEvent('mousewheel', { deltaY: -100 }));
    this.win?.scrollTo(0, this.doc.body.scrollHeight - (this.win?.innerHeight ?? 0) * 2);

    if (this.siteInfo.startLaunch) {
      this.siteInfo.startLaunch($(this.doc));
    }

    if (this.siteInfo.mutationSelector) {
      await observeElement(this.doc, this.siteInfo as any);
    } else {
      const timeout = this.siteInfo.timeout || 0;
      if (timeout) {
        await sleep(timeout);
      }
    }
    this.hide();
    this.status = RequestStatus.Finish;
    this.finishHandle();
    this.resolve?.(this.doc);
  }

  getDocument(): Document | null {
    this.status = RequestStatus.Idle;
    return this.doc;
  }

  hide(): void {
    if (this.iframe) {
      this.iframe.style.display = 'none';
    }
  }

  show(): void {
    if (this.iframe) {
      this.iframe.style.display = '';
    }
  }
}

function createIframe(
  onload: () => void,
  { iframeSandbox, withReferer }: SiteConfig
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.name = 'mynovelreader-iframe';
  iframe.style.cssText = `
    width:100%;
    height:${iframeHeight}px;
    border:0!important;
    margin:0!important;
    padding:0!important;
    visibility:hidden!important;
    display:none;
  `;
  if (Setting.preloadNextPage && !withReferer) {
    iframe.referrerPolicy = 'no-referrer';
  }
  if (!_.isUndefined(iframeSandbox)) {
    iframe.sandbox = iframeSandbox as string;
  }
  document.body.appendChild(iframe);
  iframe.onload = onload;
  return iframe;
}
