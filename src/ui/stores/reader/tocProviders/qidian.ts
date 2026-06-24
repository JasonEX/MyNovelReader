import { extractBookId, normalizeUrlForFetch, resolveUrl } from '../utils';
import type { SiteRule } from '@/core/rules/types';
import type { TocEntry } from '../types';

type QidianCategoryChapter = {
  id?: number | string;
  chapterId?: number | string;
  cN?: string;
  chapterName?: string;
  cU?: string;
};

type QidianCategoryVolume = {
  cs?: QidianCategoryChapter[];
};

type QidianCategoryResponse = {
  code?: number;
  msg?: string;
  data?: {
    vs?: QidianCategoryVolume[];
  };
};

function isQidianHost(hostname: string): boolean {
  return /(^|\.)qidian\.com$/i.test(hostname);
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;

  const encodedName = encodeURIComponent(name);
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq);
    if (key === name || key === encodedName) {
      return decodeURIComponent(trimmed.slice(eq + 1));
    }
  }

  return null;
}

function resolveQidianPageUrl(indexUrl: string, currentUrl: string): URL | null {
  const fallbackBase =
    (typeof location !== 'undefined' && typeof location.href === 'string' && location.href) ||
    'https://www.qidian.com/';

  for (const candidate of [currentUrl, indexUrl]) {
    const abs = resolveUrl(candidate, fallbackBase);
    if (!abs) continue;

    try {
      const url = new URL(abs);
      if (isQidianHost(url.hostname)) return url;
    } catch {
      // ignore invalid URL
    }
  }

  return null;
}

function isQidianTocRequest(indexUrl: string, currentUrl: string, rule?: SiteRule): boolean {
  if (rule?.id === 'qidian' || rule?.id === 'qidian-mobile') return true;
  return !!resolveQidianPageUrl(indexUrl, currentUrl);
}

function buildQidianCategoryUrl(indexUrl: string, currentUrl: string): string | null {
  const bookId = extractBookId(currentUrl) || extractBookId(indexUrl);
  const pageUrl = resolveQidianPageUrl(indexUrl, currentUrl);
  if (!bookId || !pageUrl) return null;

  const apiUrl = new URL('/webcommon/book/category', pageUrl.origin);
  const csrfToken = getCookieValue('_csrfToken');
  if (csrfToken) {
    apiUrl.searchParams.set('_csrfToken', csrfToken);
  }
  apiUrl.searchParams.set('bookId', bookId);

  return apiUrl.toString();
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

async function requestQidianCategoryNative(
  apiUrl: string,
  setAbort: (abort: (() => void) | null) => void
): Promise<QidianCategoryResponse | null> {
  const fetcher = getNativeFetch();
  if (!fetcher) return null;

  const controller = new AbortController();
  setAbort(() => controller.abort());

  try {
    const response = await fetcher(apiUrl, {
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return (await response.json()) as QidianCategoryResponse;
  } catch {
    return null;
  } finally {
    setAbort(null);
  }
}

async function requestQidianCategoryGm(
  apiUrl: string,
  currentUrl: string,
  setAbort: (abort: (() => void) | null) => void
): Promise<QidianCategoryResponse | null> {
  const gmXhr = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null;
  if (!gmXhr) return null;

  return new Promise(resolve => {
    let settled = false;
    const finish = (value: QidianCategoryResponse | null) => {
      if (settled) return;
      settled = true;
      setAbort(null);
      resolve(value);
    };

    const headers: Record<string, string> = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (currentUrl) {
      headers.Referer = currentUrl;
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
        try {
          finish(JSON.parse(response.responseText) as QidianCategoryResponse);
        } catch {
          finish(null);
        }
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

function dedupeQidianTocEntries(candidates: TocEntry[]): TocEntry[] {
  const seenUrls = new Set<string>();
  const results: TocEntry[] = [];

  for (let i = candidates.length - 1; i >= 0; i--) {
    const entry = candidates[i];
    if (seenUrls.has(entry.url)) continue;
    seenUrls.add(entry.url);
    results.unshift(entry);
  }

  return results;
}

function qidianCategoryToEntries(
  response: QidianCategoryResponse | null,
  indexUrl: string,
  currentUrl: string
): TocEntry[] {
  if (!response || response.code !== 0) return [];

  const bookId = extractBookId(currentUrl) || extractBookId(indexUrl);
  const pageUrl = resolveQidianPageUrl(indexUrl, currentUrl);
  if (!bookId || !pageUrl) return [];

  const entries: TocEntry[] = [];
  const volumes = response.data?.vs || [];

  for (const volume of volumes) {
    for (const chapter of volume.cs || []) {
      const rawTitle = chapter.cN || chapter.chapterName || '';
      const title = rawTitle.trim() || `章节 ${entries.length + 1}`;
      const explicitUrl = typeof chapter.cU === 'string' ? chapter.cU.trim() : '';
      const chapterId = chapter.id ?? chapter.chapterId;

      let url = explicitUrl ? resolveUrl(explicitUrl, pageUrl.href) : null;
      if (!url && chapterId !== undefined && chapterId !== null) {
        url = new URL(`/chapter/${bookId}/${String(chapterId)}/`, pageUrl.origin).toString();
      }
      if (!url) continue;

      entries.push({
        title,
        url: normalizeUrlForFetch(url),
      });
    }
  }

  return dedupeQidianTocEntries(entries);
}

async function loadQidianTocEntries(
  indexUrl: string,
  currentUrl: string,
  setAbort: (abort: (() => void) | null) => void
): Promise<TocEntry[]> {
  const apiUrl = buildQidianCategoryUrl(indexUrl, currentUrl);
  if (!apiUrl) return [];

  const nativeResponse = await requestQidianCategoryNative(apiUrl, setAbort);
  if (nativeResponse?.code === 0) {
    return qidianCategoryToEntries(nativeResponse, indexUrl, currentUrl);
  }

  const gmResponse = await requestQidianCategoryGm(apiUrl, currentUrl || indexUrl, setAbort);
  return qidianCategoryToEntries(gmResponse, indexUrl, currentUrl);
}

export const qidianTocLoader = {
  id: 'qidian',
  matches: (context: { currentUrl: string; indexUrl: string; rule?: SiteRule }) =>
    isQidianTocRequest(context.indexUrl, context.currentUrl, context.rule),
  load: (context: {
    currentUrl: string;
    indexUrl: string;
    setAbort: (abort: (() => void) | null) => void;
  }) => loadQidianTocEntries(context.indexUrl, context.currentUrl, context.setAbort),
};
