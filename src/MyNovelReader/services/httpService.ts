export type HttpRequestOptions = Omit<xhrParams, 'onload' | 'onerror' | 'ontimeout'> &
  Partial<Pick<xhrParams, 'onload' | 'onerror' | 'ontimeout'>>;

export interface HttpService {
  request(_options: HttpRequestOptions): Promise<GmXhrResponse>;
}

export class DefaultHttpService implements HttpService {
  private gmRequest =
    typeof GM_xmlhttpRequest === 'function'
      ? (GM_xmlhttpRequest as typeof GM_xmlhttpRequest)
      : undefined;

  constructor(gmRequest?: typeof GM_xmlhttpRequest) {
    if (gmRequest) {
      this.gmRequest = gmRequest;
    }
  }

  request(options: HttpRequestOptions): Promise<GmXhrResponse> {
    return new Promise((resolve, reject) => {
      const requester = this.gmRequest;
      if (!requester) {
        reject(new Error('GM_xmlhttpRequest is not available'));
        return;
      }

      const merged: xhrParams = {
        ...options,
        onload: response => {
          options.onload?.(response);
          resolve(response);
        },
        onerror: response => {
          options.onerror?.(response);
          reject(response);
        },
        ontimeout: response => {
          options.ontimeout?.(response);
          reject(response);
        },
      } as xhrParams;

      requester(merged);
    });
  }
}
