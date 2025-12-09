import config from '../config';
import { C, parseHTML } from '../lib';
import { BaseRequest } from './BaseRequest';
import { RequestStatus } from './constants';
import type { SiteConfig } from '../types';
import type { HttpService } from '../services/httpService';
import { DefaultHttpService } from '../services/httpService';

/**
 * HTTP request implementation using HttpService.
 */
export class HttpRequest extends BaseRequest {
  private doc: Document | null = null;
  private httpService: HttpService;

  constructor(siteInfo: SiteConfig, httpService?: HttpService) {
    super(siteInfo);
    this.httpService = httpService ?? new DefaultHttpService();
  }

  async send(url: string, referer?: string): Promise<Document | null> {
    this.status = RequestStatus.Loading;
    this.doc = null;

    const options = {
      url,
      method: 'GET' as const,
      overrideMimeType: 'text/html;charset=' + document.characterSet,
      timeout: config.xhr_time,
      ...(referer && { headers: { Referer: referer } }),
    };

    let retry = 3;
    let error: Error | GmXhrResponse | null = null;

    while (retry--) {
      try {
        const response = await this.httpService.request(options);
        this.doc = parseHTML(response.responseText);
        this.status = RequestStatus.Finish;
        this.finishHandle();
        break;
      } catch (e) {
        error = e as Error | GmXhrResponse;
        C.error(`HttpRequest 请求过程出现异常，第 ${3 - retry} 次请求`, error);
      }
    }

    if (!this.doc) {
      this.status = RequestStatus.Fail;
      this.errorHandle();
      C.error('HttpRequest 请求失败', error);
    }

    return this.doc;
  }

  getDocument(): Document | null {
    this.status = RequestStatus.Idle;
    return this.doc;
  }

  hide(): void {
    // HTTP request has no UI to hide
  }

  show(): void {
    // HTTP request has no UI to show
  }
}
