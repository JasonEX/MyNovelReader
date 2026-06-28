/**
 * Reader Store - Cache Persistence
 * Manages persisting / restoring cached chapters to GM storage.
 */

import type { CachedChapter } from './types';

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
  lastAccessed?: number;
};

export type PersistedCacheCleanupOptions = {
  currentBookId?: string;
  force?: boolean;
  gcIntervalMs?: number;
  maxAgeMs?: number;
  now?: number;
};

const CACHE_V2_INDEX_PREFIX = 'mnr_cache_v2_index_';
const CACHE_V2_CHAPTER_PREFIX = 'mnr_cache_v2_chapter_';
const DAY_MS = 24 * 60 * 60 * 1000;

export const PERSISTED_CACHE_MAX_AGE_MS = 30 * DAY_MS;
export const PERSISTED_CACHE_GC_INTERVAL_MS = DAY_MS;
export const PERSISTED_CACHE_TOUCH_INTERVAL_MS = DAY_MS;
export const PERSISTED_CACHE_GC_LAST_RUN_KEY = 'mnr_cache_v2_gc_last_run';
export const PERSISTED_CACHE_INDEX_CHECKPOINT_CHAPTERS = 50;

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

export function getCacheV2IndexKey(bookId: string): string {
  return `${CACHE_V2_INDEX_PREFIX}${bookId}`;
}

export function getCacheV2ChapterKey(bookId: string, url: string): string {
  return `${CACHE_V2_CHAPTER_PREFIX}${bookId}_${encodeBase64UrlUtf8(url)}`;
}

function normalizeTimestamp(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getIndexAccessTime(index: PersistedBookCacheV2Index): number | null {
  return normalizeTimestamp(index.lastAccessed) ?? normalizeTimestamp(index.lastUpdated);
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

  persistCacheIndex(cacheBook, persistedSet);
  return persistedSet;
}

export function persistCacheIndex(
  cacheBook: CacheBookKey,
  persistedUrls: Set<string>,
  now = Date.now()
): boolean {
  if (typeof GM_setValue === 'undefined' || persistedUrls.size === 0) return false;

  const indexData: PersistedBookCacheV2Index = {
    version: 2,
    bookId: cacheBook.bookId,
    indexUrl: cacheBook.indexUrl,
    urls: Array.from(persistedUrls),
    lastUpdated: now,
    lastAccessed: now,
  };

  try {
    GM_setValue(getCacheV2IndexKey(cacheBook.bookId), JSON.stringify(indexData));
    return true;
  } catch (e) {
    console.error('[MNR] Failed to persist cache index:', e);
    return false;
  }
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
  } catch (e) {
    console.error('[MNR] Failed to restore cache:', e);
  }
  return null;
}

export function touchPersistedCache(
  cacheBook: CacheBookKey,
  now = Date.now(),
  touchIntervalMs = PERSISTED_CACHE_TOUCH_INTERVAL_MS
): boolean {
  if (typeof GM_getValue === 'undefined' || typeof GM_setValue === 'undefined') return false;

  try {
    const indexKey = getCacheV2IndexKey(cacheBook.bookId);
    const stored = GM_getValue<unknown>(indexKey, null);
    const data = parseStoredJson<PersistedBookCacheV2Index>(stored);
    if (data?.version !== 2 || !Array.isArray(data.urls)) return false;

    const lastAccessed = getIndexAccessTime(data);
    if (lastAccessed !== null && now - lastAccessed < touchIntervalMs) {
      return false;
    }

    GM_setValue(indexKey, JSON.stringify({ ...data, lastAccessed: now }));
    return true;
  } catch (e) {
    console.error('[MNR] Failed to touch cache index:', e);
    return false;
  }
}

export function cleanupExpiredCaches(options: PersistedCacheCleanupOptions = {}): void {
  if (
    typeof GM_getValue === 'undefined' ||
    typeof GM_setValue === 'undefined' ||
    typeof GM_deleteValue === 'undefined' ||
    typeof GM_listValues !== 'function'
  ) {
    return;
  }

  const now = options.now ?? Date.now();
  const gcIntervalMs = options.gcIntervalMs ?? PERSISTED_CACHE_GC_INTERVAL_MS;
  const maxAgeMs = options.maxAgeMs ?? PERSISTED_CACHE_MAX_AGE_MS;

  try {
    if (!options.force) {
      const lastRun = normalizeTimestamp(GM_getValue<unknown>(PERSISTED_CACHE_GC_LAST_RUN_KEY, 0));
      if (lastRun !== null && now - lastRun < gcIntervalMs) return;
    }

    for (const key of GM_listValues()) {
      if (!key.startsWith(CACHE_V2_INDEX_PREFIX)) continue;

      const bookId = key.slice(CACHE_V2_INDEX_PREFIX.length);
      if (!bookId || bookId === options.currentBookId) continue;

      const data = parseStoredJson<PersistedBookCacheV2Index>(GM_getValue<unknown>(key, null));
      if (data?.version !== 2 || !Array.isArray(data.urls)) continue;

      const lastAccessed = getIndexAccessTime(data);
      if (lastAccessed === null || now - lastAccessed <= maxAgeMs) continue;

      clearPersistedCache(
        { bookId, indexUrl: typeof data.indexUrl === 'string' ? data.indexUrl : '' },
        new Set(data.urls)
      );
    }

    GM_setValue(PERSISTED_CACHE_GC_LAST_RUN_KEY, now);
  } catch (e) {
    console.error('[MNR] Failed to cleanup expired caches:', e);
  }
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
    const chapterKeyPrefix = `${CACHE_V2_CHAPTER_PREFIX}${cacheBook.bookId}_`;
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
  } catch (e) {
    console.error('[MNR] Failed to clear cache:', e);
  }
}
