/**
 * Network Utilities
 *
 * Handles HTTP requests, CORS (via GM_xmlhttpRequest), and basic parsing.
 */

import { normalizeCiwemaoChapterUrl } from './index';

/** Result of fetchAndParseUrl operation */
export interface FetchAndParseResult {
  doc: Document | null;
  status: number | null;
  finalUrl: string | null;
  error:
    | 'abort'
    | 'http'
    | 'network'
    | 'parse'
    | 'timeout'
    | 'missing-gm-xhr'
    | 'invalid-url'
    | null;
}

/** Return type of GM_xmlhttpRequest call */
interface GmXhrReturn {
  abort: () => void;
}

/**
 * Get GM_xmlhttpRequest function
 */
export function getGmXhr(): typeof GM_xmlhttpRequest | null {
  if (typeof GM_xmlhttpRequest === 'function') {
    return GM_xmlhttpRequest;
  }
  return null;
}

/**
 * Normalize URL for fetching (removes hash, handles special cases)
 */
export function normalizeUrlForFetch(url: string): string {
  const normalized = normalizeCiwemaoChapterUrl(url);
  try {
    const u = new URL(normalized);
    u.hash = '';
    return u.toString();
  } catch {
    return normalized.replace(/#.*$/, '');
  }
}

function getDefaultBaseUrl(): string | undefined {
  if (typeof location !== 'undefined' && typeof location.href === 'string') {
    return location.href;
  }
  if (typeof document !== 'undefined' && typeof document.baseURI === 'string') {
    return document.baseURI;
  }
  return undefined;
}

function normalizeHostname(hostname: string): string {
  const trimmed = hostname.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).toLowerCase();
  }
  return trimmed.toLowerCase();
}

function isPrivateNetworkHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  if (!host) return true;

  if (host === 'localhost') return true;
  if (host === '0.0.0.0') return true;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const parts = ipv4.slice(1).map(n => parseInt(n, 10));
    if (parts.some(n => !Number.isFinite(n) || n < 0 || n > 255)) return true;

    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    return false;
  }

  // IPv6 (URL.hostname includes brackets in some runtimes, normalizeHostname removes them)
  if (host === '::1') return true; // loopback
  if (host.startsWith('fe80:')) return true; // link-local
  if (host.startsWith('fc') || host.startsWith('fd')) return true; // unique local (fc00::/7)

  return false;
}

function parseHttpUrl(url: string): URL | null {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u;
  } catch {
    return null;
  }
}

function resolveAndValidateHttpUrl(url: string, base?: string): string | null {
  const normalized = normalizeUrlForFetch(url);

  let resolved: string | null = null;
  try {
    resolved = base ? new URL(normalized, base).toString() : new URL(normalized).toString();
  } catch {
    try {
      const fallbackBase = getDefaultBaseUrl();
      if (!fallbackBase) return null;
      resolved = new URL(normalized, fallbackBase).toString();
    } catch {
      return null;
    }
  }

  try {
    const u = new URL(resolved);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;

    // Block requests to private network hosts unless the current page is on the same host.
    // This mitigates GM_xmlhttpRequest bypassing CORS and accidentally leaking intranet content.
    if (isPrivateNetworkHost(u.hostname)) {
      const baseUrl = parseHttpUrl(base || '') || parseHttpUrl(getDefaultBaseUrl() || '');
      if (!baseUrl || normalizeHostname(baseUrl.hostname) !== normalizeHostname(u.hostname)) {
        return null;
      }
    }

    u.hash = '';
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Fetch a URL and parse it to a Document
 *
 * @param url - URL to fetch
 * @param referer - Referer URL
 * @param options - Options for timeout and retries
 * @returns Object with promise and abort function
 */
export function fetchAndParseUrl(
  url: string,
  referer?: string,
  options: { timeoutMs?: number; retries?: number } = {}
): { promise: Promise<FetchAndParseResult>; abort: () => void } {
  const gmXhr = getGmXhr();
  const requestUrl = resolveAndValidateHttpUrl(url, referer);
  const timeoutMs = options.timeoutMs ?? 15000;
  const maxRetries = Math.max(0, options.retries ?? 1);

  if (!requestUrl) {
    console.error('[MNR] Invalid or unsupported URL:', url);
    return {
      promise: Promise.resolve({
        doc: null,
        status: null,
        finalUrl: null,
        error: 'invalid-url',
      }),
      abort: () => {},
    };
  }

  const parseHtmlToDoc = (html: string, finalUrl: string | null): FetchAndParseResult => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const base = doc.createElement('base');
      base.href = finalUrl || requestUrl;
      if (doc.head) {
        doc.head.insertBefore(base, doc.head.firstChild);
      } else {
        doc.documentElement?.insertBefore(base, doc.documentElement.firstChild);
      }
      (doc as Document & { _mnrUrl: string })._mnrUrl = finalUrl || requestUrl;
      return {
        doc,
        status: 200,
        finalUrl,
        error: null,
      };
    } catch (e) {
      console.error('[MNR] Parse error:', e);
      return {
        doc: null,
        status: null,
        finalUrl,
        error: 'parse',
      };
    }
  };

  let request: GmXhrReturn | null = null;
  let aborted = false;
  let fetchAbortController: AbortController | null = null;
  let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  let timedOut = false;

  const doRequest = (): Promise<FetchAndParseResult> => {
    const headers: Record<string, string> = {
      Accept: 'text/html,application/xhtml+xml,application/xml',
    };

    // `Referer` is a forbidden header for `fetch` in browsers; only apply it for GM XHR.
    const normalizedReferer = referer ? resolveAndValidateHttpUrl(referer) : undefined;

    // Prefer GM_xmlhttpRequest when available (bypasses CORS and supports legacy encodings).
    if (gmXhr) {
      headers['Accept-Language'] = 'zh-CN,zh;q=0.9';
      if (normalizedReferer) {
        headers['Referer'] = normalizedReferer;
      }

      return new Promise(resolve => {
        request = gmXhr({
          method: 'GET',
          url: requestUrl,
          headers,
          timeout: timeoutMs,
          overrideMimeType: 'text/html;charset=' + document.characterSet,
          onload: response => {
            const finalUrl = response.finalUrl
              ? resolveAndValidateHttpUrl(response.finalUrl, requestUrl)
              : null;
            if (response.status >= 200 && response.status < 300) {
              const parsed = parseHtmlToDoc(response.responseText, finalUrl);
              resolve({
                ...parsed,
                status: response.status,
                finalUrl,
              });
              return;
            }

            console.error('[MNR] HTTP error:', response.status);
            resolve({
              doc: null,
              status: response.status,
              finalUrl,
              error: 'http',
            });
          },
          onerror: () => {
            resolve({ doc: null, status: null, finalUrl: null, error: 'network' });
          },
          onabort: () => {
            resolve({ doc: null, status: null, finalUrl: null, error: 'abort' });
          },
          ontimeout: () => {
            console.error('[MNR] Request timeout');
            resolve({ doc: null, status: null, finalUrl: null, error: 'timeout' });
          },
        } as GM_xmlhttpRequestOptions);
      });
    }

    if (typeof fetch !== 'function') {
      console.error('[MNR] GM_xmlhttpRequest not available and fetch is missing');
      return Promise.resolve({
        doc: null,
        status: null,
        finalUrl: null,
        error: 'missing-gm-xhr',
      });
    }

    fetchAbortController = new AbortController();
    timedOut = false;
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }

    timeoutTimer = setTimeout(() => {
      timedOut = true;
      fetchAbortController?.abort();
    }, timeoutMs);

    const fetchInit: RequestInit = {
      method: 'GET',
      headers,
      signal: fetchAbortController.signal,
      credentials: 'include',
      redirect: 'follow',
    };

    // `referrer` is supported in browsers; ignore failures in non-browser runtimes.
    if (normalizedReferer) {
      try {
        fetchInit.referrer = normalizedReferer;
      } catch {
        // ignore
      }
    }

    return fetch(requestUrl, fetchInit)
      .then(async response => {
        const finalUrl = response.url ? resolveAndValidateHttpUrl(response.url, requestUrl) : null;
        const status = response.status;
        if (status >= 200 && status < 300) {
          const html = await response.text();
          const parsed = parseHtmlToDoc(html, finalUrl);
          return { ...parsed, status, finalUrl };
        }

        console.error('[MNR] HTTP error:', status);
        return {
          doc: null,
          status,
          finalUrl,
          error: 'http',
        };
      })
      .catch(err => {
        if (aborted) {
          return { doc: null, status: null, finalUrl: null, error: 'abort' };
        }
        if (timedOut) {
          console.error('[MNR] Request timeout');
          return { doc: null, status: null, finalUrl: null, error: 'timeout' };
        }
        console.error('[MNR] Network error:', err);
        return { doc: null, status: null, finalUrl: null, error: 'network' };
      })
      .finally(() => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
        }
      });
  };

  const shouldRetry = (res: FetchAndParseResult): boolean => {
    if (aborted) return false;
    if (res.error === 'timeout' || res.error === 'network') return true;
    if (res.error === 'http' && res.status && (res.status >= 500 || res.status === 429)) {
      return true;
    }
    return false;
  };

  const promise = (async (): Promise<FetchAndParseResult> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (aborted) return { doc: null, status: null, finalUrl: null, error: 'abort' };

      const res = await doRequest();
      if (!shouldRetry(res) || attempt === maxRetries) {
        return res;
      }

      const delay = Math.min(400 * Math.pow(2, attempt), 2000);
      await new Promise<void>(resolve => globalThis.setTimeout(resolve, delay));
    }

    return { doc: null, status: null, finalUrl: null, error: 'network' };
  })();

  const abort = () => {
    aborted = true;
    try {
      request?.abort();
    } catch {
      // ignore
    }
    try {
      fetchAbortController?.abort();
    } catch {
      // ignore
    }
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
  };

  return { promise, abort };
}
