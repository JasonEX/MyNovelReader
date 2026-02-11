/**
 * Reader Store - Cache Persistence
 * Manages persisting / restoring cached chapters to GM storage.
 */

import type { CachedChapter, PersistedBookCache } from './types';

// ============ Types ============

export type CacheBookKey = {
  bookId: string;
  indexUrl: string;
};

export type PersistedBookCacheV2Index = {
  version: 2;
  bookId: string;
  indexUrl: string;
  urls: string[];
  lastUpdated: number;
};

// ============ Pure Helpers ============

export function generateBookId(indexUrl: string): string {
  try {
    const url = new URL(indexUrl);
    // Use pathname as book ID (usually contains book identifier)
    return url.hostname + url.pathname.replace(/\//g, '_');
  } catch {
    // Fallback to simple hash
    return btoa(indexUrl).slice(0, 32);
  }
}

export function encodeBase64UrlUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function parseStoredJson<T>(stored: unknown): T | null {
  if (stored === null || stored === undefined) return null;
  if (typeof stored === 'string') {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }
  if (typeof stored === 'object') {
    return stored as T;
  }
  return null;
}

export function getCacheV1Key(bookId: string): string {
  return `mnr_cache_${bookId}`;
}

export function getCacheV2IndexKey(bookId: string): string {
  return `mnr_cache_v2_index_${bookId}`;
}

export function getCacheV2ChapterKey(bookId: string, url: string): string {
  return `mnr_cache_v2_chapter_${bookId}_${encodeBase64UrlUtf8(url)}`;
}

// ============ Store-dependent Functions ============

/**
 * Get the cache book key for the given index URL.
 */
export function getCurrentBookCacheKey(indexUrl: string | undefined): CacheBookKey | null {
  if (!indexUrl) return null;
  return { bookId: generateBookId(indexUrl), indexUrl };
}

/**
 * Persist a single cached chapter to GM storage.
 */
export function persistCachedChapter(
  cacheBook: CacheBookKey,
  url: string,
  cached: CachedChapter
): boolean {
  if (typeof GM_setValue === 'undefined') return false;
  try {
    GM_setValue(getCacheV2ChapterKey(cacheBook.bookId, url), JSON.stringify(cached));
    return true;
  } catch (e) {
    console.error('[MNR] Failed to persist cached chapter:', e);
    return false;
  }
}

/**
 * Load a single persisted chapter from GM storage.
 */
export function getPersistedCachedChapter(
  cacheBook: CacheBookKey,
  url: string
): CachedChapter | null {
  if (typeof GM_getValue === 'undefined') return null;

  try {
    const storedV2 = GM_getValue<unknown>(getCacheV2ChapterKey(cacheBook.bookId, url), null);
    const cachedV2 = parseStoredJson<CachedChapter>(storedV2);
    if (cachedV2?.chapter?.url) {
      return cachedV2;
    }

    const storedV1 = GM_getValue<unknown>(getCacheV1Key(cacheBook.bookId), null);
    const dataV1 = parseStoredJson<PersistedBookCache>(storedV1);
    const cachedV1 = dataV1?.chapters?.[url];
    if (cachedV1?.chapter?.url) {
      return cachedV1;
    }
  } catch (e) {
    console.error('[MNR] Failed to load persisted chapter:', e);
  }
  return null;
}

/**
 * Persist all in-memory cached chapters and write the V2 index.
 */
export function persistCache(
  cacheBook: CacheBookKey,
  cachedContents: Map<string, CachedChapter>,
  persistedUrls: Set<string>
): Set<string> {
  if (typeof GM_setValue === 'undefined') return persistedUrls;

  const persistedSet = new Set(persistedUrls);
  for (const [url, cached] of cachedContents) {
    const persisted = persistCachedChapter(cacheBook, url, cached);
    if (persisted) {
      persistedSet.add(url);
    }
  }
  if (persistedSet.size === 0) return persistedSet;

  const indexData: PersistedBookCacheV2Index = {
    version: 2,
    bookId: cacheBook.bookId,
    indexUrl: cacheBook.indexUrl,
    urls: Array.from(persistedSet),
    lastUpdated: Date.now(),
  };

  try {
    GM_setValue(getCacheV2IndexKey(cacheBook.bookId), JSON.stringify(indexData));
  } catch (e) {
    console.error('[MNR] Failed to persist cache index:', e);
  }
  return persistedSet;
}

/**
 * Restore persisted URL set from GM storage.
 * Returns the set of URLs that are persisted, or null if nothing found.
 */
export function restoreCache(cacheBook: CacheBookKey): Set<string> | null {
  if (typeof GM_getValue === 'undefined') return null;

  try {
    const storedV2 = GM_getValue<unknown>(getCacheV2IndexKey(cacheBook.bookId), null);
    const dataV2 = parseStoredJson<PersistedBookCacheV2Index>(storedV2);
    if (dataV2?.version === 2 && Array.isArray(dataV2.urls)) {
      return new Set(dataV2.urls);
    }

    const storedV1 = GM_getValue<unknown>(getCacheV1Key(cacheBook.bookId), null);
    const dataV1 = parseStoredJson<PersistedBookCache>(storedV1);
    if (dataV1?.chapters && typeof dataV1.chapters === 'object') {
      return new Set(Object.keys(dataV1.chapters));
    }
  } catch (e) {
    console.error('[MNR] Failed to restore cache:', e);
  }
  return null;
}

/**
 * Clear all persisted cache for a book.
 */
export function clearPersistedCache(cacheBook: CacheBookKey, persistedUrls: Set<string>): void {
  if (typeof GM_deleteValue === 'undefined') return;

  let urls = new Set(persistedUrls);

  if (typeof GM_getValue !== 'undefined') {
    const storedIndex = GM_getValue<unknown>(getCacheV2IndexKey(cacheBook.bookId), null);
    const dataV2 = parseStoredJson<PersistedBookCacheV2Index>(storedIndex);
    if (dataV2?.version === 2 && Array.isArray(dataV2.urls)) {
      urls = new Set(dataV2.urls);
    }
  }

  try {
    const chapterKeyPrefix = `mnr_cache_v2_chapter_${cacheBook.bookId}_`;
    if (urls.size > 0) {
      for (const url of urls) {
        GM_deleteValue(getCacheV2ChapterKey(cacheBook.bookId, url));
      }
    } else if (typeof GM_listValues === 'function') {
      for (const key of GM_listValues()) {
        if (key.startsWith(chapterKeyPrefix)) {
          GM_deleteValue(key);
        }
      }
    }

    GM_deleteValue(getCacheV2IndexKey(cacheBook.bookId));
    GM_deleteValue(getCacheV1Key(cacheBook.bookId));
  } catch (e) {
    console.error('[MNR] Failed to clear cache:', e);
  }
}
