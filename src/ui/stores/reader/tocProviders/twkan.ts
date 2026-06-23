import { normalizeUrlForFetch, resolveUrl } from '../utils';
import type { SiteRule } from '@/core/rules/types';
import type { TocEntry } from '../types';

type RequestAbortSetter = (abort: (() => void) | null) => void;

function isTwkanHost(hostname: string): boolean {
  return /^twkan\.com$/i.test(hostname);
}

function resolveTwkanPageUrl(indexUrl: string, currentUrl: string): URL | null {
  const fallbackBase =
    (typeof location !== 'undefined' && typeof location.href === 'string' && location.href) ||
    'https://twkan.com/';

  for (const candidate of [currentUrl, indexUrl]) {
    const abs = resolveUrl(candidate, fallbackBase);
    if (!abs) continue;

    try {
      const url = new URL(abs);
      if (isTwkanHost(url.hostname)) return url;
    } catch {
      // ignore invalid URL
    }
  }

  return null;
}

function extractTwkanBookId(indexUrl: string, currentUrl: string): string | null {
  for (const candidate of [currentUrl, indexUrl]) {
    const pageUrl = resolveTwkanPageUrl(candidate, currentUrl);
    if (!pageUrl) continue;

    const match = pageUrl.pathname.match(/^\/(?:txt|book)\/(\d+)(?:\/|$)/);
    if (match) return match[1];
  }

  return null;
}

function isTwkanTocRequest(indexUrl: string, currentUrl: string, rule?: SiteRule): boolean {
  if (rule?.id === 'twkan') return true;
  return !!resolveTwkanPageUrl(indexUrl, currentUrl);
}

function buildTwkanChapterListUrl(indexUrl: string, currentUrl: string): string | null {
  const pageUrl = resolveTwkanPageUrl(indexUrl, currentUrl);
  const bookId = extractTwkanBookId(indexUrl, currentUrl);
  if (!pageUrl || !bookId) return null;

  return new URL(`/ajax_novels/chapterlist/${bookId}.html`, pageUrl.origin).toString();
}

function getNativeFetch(): typeof fetch | null {
  if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.fetch === 'function') {
    return unsafeWindow.fetch.bind(unsafeWindow) as typeof fetch;
  }
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    return window.fetch.bind(window) as typeof fetch;
  }
  if (typeof fetch === 'function') {
    return fetch;
  }
  return null;
}

async function requestTwkanChapterListNative(
  apiUrl: string,
  setAbort: RequestAbortSetter
): Promise<string | null> {
  const fetcher = getNativeFetch();
  if (!fetcher) return null;

  const controller = new AbortController();
  setAbort(() => controller.abort());

  try {
    const response = await fetcher(apiUrl, {
      credentials: 'include',
      headers: {
        Accept: 'text/html, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    setAbort(null);
  }
}

async function requestTwkanChapterListGm(
  apiUrl: string,
  referer: string,
  setAbort: RequestAbortSetter
): Promise<string | null> {
  const gmXhr = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null;
  if (!gmXhr) return null;

  return new Promise(resolve => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      setAbort(null);
      resolve(value);
    };

    const headers: Record<string, string> = {
      Accept: 'text/html, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (referer) {
      headers.Referer = referer;
    }

    const request = gmXhr({
      method: 'GET',
      url: apiUrl,
      headers,
      timeout: 10000,
      withCredentials: true,
      onload: response => {
        if (response.status < 200 || response.status >= 300) {
          finish(null);
          return;
        }
        finish(response.responseText);
      },
      onerror: () => finish(null),
      onabort: () => finish(null),
      ontimeout: () => finish(null),
    });

    setAbort(() => {
      try {
        request.abort();
      } catch {
        // ignore
      }
      finish(null);
    });
  });
}

function cleanTwkanTocTitle(title: string): string {
  return title.replace(/^\s*\d+[.、\s]+/, '').trim();
}

function parseTwkanChapterList(html: string, apiUrl: string): TocEntry[] {
  if (!html.trim() || typeof DOMParser === 'undefined') return [];

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const anchors = Array.from(doc.querySelectorAll('ul li a[href], a[href*="/txt/"]'));
  const seen = new Set<string>();
  const entries: TocEntry[] = [];

  for (const anchor of anchors) {
    const rawHref = anchor.getAttribute('href')?.trim();
    if (!rawHref) continue;

    const url = resolveUrl(rawHref, apiUrl);
    if (!url) continue;

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      continue;
    }
    if (!isTwkanHost(parsed.hostname) || !/^\/txt\/\d+\/\d+\/?$/.test(parsed.pathname)) continue;

    const normalizedUrl = normalizeUrlForFetch(parsed.toString());
    if (seen.has(normalizedUrl)) continue;

    const title = cleanTwkanTocTitle(anchor.textContent || '') || `章节 ${entries.length + 1}`;
    seen.add(normalizedUrl);
    entries.push({
      title,
      url: normalizedUrl,
    });
  }

  return entries;
}

async function loadTwkanTocEntries(
  indexUrl: string,
  currentUrl: string,
  setAbort: RequestAbortSetter
): Promise<TocEntry[]> {
  const apiUrl = buildTwkanChapterListUrl(indexUrl, currentUrl);
  if (!apiUrl) return [];

  const nativeHtml = await requestTwkanChapterListNative(apiUrl, setAbort);
  let entries = nativeHtml ? parseTwkanChapterList(nativeHtml, apiUrl) : [];
  if (entries.length > 0) return entries;

  const gmHtml = await requestTwkanChapterListGm(apiUrl, currentUrl || indexUrl, setAbort);
  entries = gmHtml ? parseTwkanChapterList(gmHtml, apiUrl) : [];
  return entries;
}

export const twkanTocLoader = {
  id: 'twkan',
  matches: (context: { currentUrl: string; indexUrl: string; rule?: SiteRule }) =>
    isTwkanTocRequest(context.indexUrl, context.currentUrl, context.rule),
  load: (context: {
    currentUrl: string;
    indexUrl: string;
    setAbort: RequestAbortSetter;
  }): Promise<TocEntry[]> =>
    loadTwkanTocEntries(context.indexUrl, context.currentUrl, context.setAbort),
};
