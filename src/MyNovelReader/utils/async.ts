export function sleep(timeout: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

// Wait for DOMContentLoaded using jQuery ready
export function DOMContentLoaded(): Promise<void> {
  return new Promise(resolve => $(resolve));
}

type RequestOptions = Omit<xhrParams, 'onload' | 'onerror' | 'ontimeout'> &
  Partial<Pick<xhrParams, 'onload' | 'onerror' | 'ontimeout'>>;

// Promise wrapper for GM_xmlhttpRequest
export function Request(options: RequestOptions): Promise<GmXhrResponse> {
  return new Promise((resolve, reject) => {
    options.onerror = response => reject(response);
    options.ontimeout = response => reject(response);
    options.onload = response => resolve(response);
    GM_xmlhttpRequest(options as xhrParams);
  });
}
