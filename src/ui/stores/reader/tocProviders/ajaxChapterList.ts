import { normalizeUrlForFetch, resolveUrl } from '../utils';
import type { SpecialTocLoader, SpecialTocLoaderContext } from './index';
import type { TocEntry } from '../types';

type RequestAbortSetter = (abort: (() => void) | null) => void;

interface AjaxChapterListLoaderOptions {
  id: string;
  ruleIds: readonly string[];
  matchesHost: (hostname: string) => boolean;
  matchesChapterPath: (pathname: string) => boolean;
  cleanTitle?: (title: string) => string;
}

function resolvePageUrl(
  indexUrl: string,
  currentUrl: string,
  options: AjaxChapterListLoaderOptions
): URL | null {
  const fallbackBase =
    (typeof location !== 'undefined' && typeof location.href === 'string' && location.href) ||
    'https://example.invalid/';

  for (const candidate of [currentUrl, indexUrl]) {
    const absolute = resolveUrl(candidate, fallbackBase);
    if (!absolute) continue;

    try {
      const url = new URL(absolute);
      if (options.matchesHost(url.hostname)) return url;
    } catch {
      // Ignore invalid URLs and try the other candidate.
    }
  }

  return null;
}

function extractBookId(
  indexUrl: string,
  currentUrl: string,
  pageUrl: URL,
  options: AjaxChapterListLoaderOptions
): string | null {
  for (const candidate of [currentUrl, indexUrl]) {
    const absolute = resolveUrl(candidate, pageUrl.href);
    if (!absolute) continue;

    try {
      const url = new URL(absolute);
      if (!options.matchesHost(url.hostname)) continue;
      const match = url.pathname.match(/^\/(?:txt|book)\/(\d+)(?:\/|\.html?$)/);
      if (match) return match[1];
    } catch {
      // Ignore invalid URLs and try the other candidate.
    }
  }

  return null;
}

function buildChapterListUrl(
  indexUrl: string,
  currentUrl: string,
  options: AjaxChapterListLoaderOptions
): string | null {
  const pageUrl = resolvePageUrl(indexUrl, currentUrl, options);
  if (!pageUrl) return null;

  const bookId = extractBookId(indexUrl, currentUrl, pageUrl, options);
  if (!bookId) return null;

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

async function requestChapterListNative(
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

async function requestChapterListGm(
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
    if (referer) headers.Referer = referer;

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
        // Ignore abort errors from userscript managers.
      }
      finish(null);
    });
  });
}

function parseChapterList(
  html: string,
  apiUrl: string,
  options: AjaxChapterListLoaderOptions
): TocEntry[] {
  if (!html.trim() || typeof DOMParser === 'undefined') return [];

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const anchors = Array.from(doc.querySelectorAll('ul li a[href], a[href*="/txt/"]'));
  const seen = new Set<string>();
  const entries: TocEntry[] = [];

  for (const anchor of anchors) {
    const rawHref = anchor.getAttribute('href')?.trim();
    if (!rawHref) continue;

    const absolute = resolveUrl(rawHref, apiUrl);
    if (!absolute) continue;

    let url: URL;
    try {
      url = new URL(absolute);
    } catch {
      continue;
    }
    if (!options.matchesHost(url.hostname) || !options.matchesChapterPath(url.pathname)) continue;

    const normalizedUrl = normalizeUrlForFetch(url.toString());
    if (seen.has(normalizedUrl)) continue;

    const rawTitle = (anchor.textContent || '').trim();
    const title = (options.cleanTitle?.(rawTitle) || rawTitle).trim();
    seen.add(normalizedUrl);
    entries.push({
      title: title || `章节 ${entries.length + 1}`,
      url: normalizedUrl,
    });
  }

  return entries;
}

async function loadChapterList(
  context: SpecialTocLoaderContext,
  options: AjaxChapterListLoaderOptions
): Promise<TocEntry[]> {
  const apiUrl = buildChapterListUrl(context.indexUrl, context.currentUrl, options);
  if (!apiUrl) return [];

  const nativeHtml = await requestChapterListNative(apiUrl, context.setAbort);
  let entries = nativeHtml ? parseChapterList(nativeHtml, apiUrl, options) : [];
  if (entries.length > 0) return entries;

  const gmHtml = await requestChapterListGm(
    apiUrl,
    context.currentUrl || context.indexUrl,
    context.setAbort
  );
  entries = gmHtml ? parseChapterList(gmHtml, apiUrl, options) : [];
  return entries;
}

export function createAjaxChapterListLoader(
  options: AjaxChapterListLoaderOptions
): SpecialTocLoader {
  return {
    id: options.id,
    matches: context =>
      options.ruleIds.includes(context.rule?.id || '') ||
      resolvePageUrl(context.indexUrl, context.currentUrl, options) !== null,
    load: context => loadChapterList(context, options),
  };
}
