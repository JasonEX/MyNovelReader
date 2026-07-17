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

type PersistedBookCacheV2Index = {
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

const PERSISTED_CACHE_MAX_AGE_MS = 30 * DAY_MS;
const PERSISTED_CACHE_GC_INTERVAL_MS = DAY_MS;
const PERSISTED_CACHE_TOUCH_INTERVAL_MS = DAY_MS;
const PERSISTED_CACHE_GC_IDLE_TIMEOUT_MS = 2_000;
const PERSISTED_CACHE_GC_SLICE_BUDGET_MS = 6;
const PERSISTED_CACHE_GC_SLICE_STEPS = 128;
export const PERSISTED_CACHE_GC_LAST_RUN_KEY = 'mnr_cache_v2_gc_last_run';
export const PERSISTED_CACHE_INDEX_CHECKPOINT_CHAPTERS = 50;

type PersistedCacheIndexRecord = {
  key: string;
  bookId: string;
  data: PersistedBookCacheV2Index;
};

type PersistedCacheIndexGroup = PersistedCacheIndexRecord & {
  chapterKeys: string[];
  chapterPrefix: string;
};

type CacheCleanupIdleDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type ScheduledCacheCleanup = {
  iterator: Generator<void, void, unknown> | null;
  maxAgeMs: number;
  now: number;
  protectedBookIds: Set<string>;
};

let scheduledCacheCleanup: ScheduledCacheCleanup | null = null;

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

function decodeBase64UrlUtf8(value: string): string | null {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    let hasNonAsciiByte = false;
    for (let index = 0; index < binary.length; index += 1) {
      if (binary.charCodeAt(index) > 0x7f) {
        hasNonAsciiByte = true;
        break;
      }
    }
    if (!hasNonAsciiByte) return binary;

    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
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

function isPersistedCacheIndex(
  data: PersistedBookCacheV2Index | null
): data is PersistedBookCacheV2Index {
  return data?.version === 2 && Array.isArray(data.urls);
}

function getCacheV2ChapterBookPrefix(bookId: string): string {
  return `${CACHE_V2_CHAPTER_PREFIX}${bookId}_`;
}

function isProtectedChapterKey(key: string, protectedBookIds: Set<string>): boolean {
  for (const bookId of protectedBookIds) {
    if (key.startsWith(getCacheV2ChapterBookPrefix(bookId))) return true;
  }
  return false;
}

function getMonotonicTime(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function scheduleCacheCleanupSlice(
  callback: (deadline: CacheCleanupIdleDeadline | null) => void
): void {
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(deadline => callback(deadline), {
      timeout: PERSISTED_CACHE_GC_IDLE_TIMEOUT_MS,
    });
    return;
  }

  setTimeout(() => callback(null), 0);
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

type OrphanIndexState = {
  recentlyAccessed: boolean;
  urls: string[];
};

function shouldKeepOrphanedChapter(
  cached: CachedChapter,
  now: number,
  protectedBookIds: Set<string>,
  indexStates: Map<string, OrphanIndexState>
): boolean {
  const indexUrl = cached.chapter?.indexUrl;
  const chapterUrl = cached.chapter?.url;
  if (typeof indexUrl !== 'string' || typeof chapterUrl !== 'string') return false;

  const cacheBook = getCurrentBookCacheKey(indexUrl);
  if (!cacheBook) return false;
  if (protectedBookIds.has(cacheBook.bookId)) return true;

  let state = indexStates.get(cacheBook.bookId);
  if (!state) {
    const stored = GM_getValue<unknown>(getCacheV2IndexKey(cacheBook.bookId), null);
    const index = parseStoredJson<PersistedBookCacheV2Index>(stored);
    const lastAccessed = isPersistedCacheIndex(index) ? getIndexAccessTime(index) : null;
    state = {
      recentlyAccessed:
        lastAccessed !== null && now - lastAccessed <= PERSISTED_CACHE_TOUCH_INTERVAL_MS,
      urls: isPersistedCacheIndex(index) ? index.urls : [],
    };
    indexStates.set(cacheBook.bookId, state);
  }

  return state.recentlyAccessed || state.urls.includes(chapterUrl);
}

function cleanupOrphanedChapter(
  key: string,
  now: number,
  maxAgeMs: number,
  protectedBookIds: Set<string>,
  indexStates: Map<string, OrphanIndexState>
): void {
  if (isProtectedChapterKey(key, protectedBookIds)) return;

  const cached = parseStoredJson<CachedChapter>(GM_getValue<unknown>(key, null));
  if (cached?.chapter?.url) {
    const cachedAt = normalizeTimestamp(cached.cachedAt);
    if (cachedAt !== null && now - cachedAt <= maxAgeMs) return;
    if (shouldKeepOrphanedChapter(cached, now, protectedBookIds, indexStates)) return;
  }

  GM_deleteValue(key);
}

function* createPersistedCacheCleanupSteps(
  now: number,
  maxAgeMs: number,
  protectedBookIds: Set<string>
): Generator<void, void, unknown> {
  const storageKeys = GM_listValues();
  const chapterKeys: string[] = [];
  const activeIndexes: PersistedCacheIndexRecord[] = [];
  const expiredIndexes: PersistedCacheIndexRecord[] = [];
  const invalidIndexes: Array<{ key: string; bookId: string }> = [];

  // Classify storage incrementally. The normal healthy-cache path stops after this phase.
  for (const key of storageKeys) {
    if (key.startsWith(CACHE_V2_CHAPTER_PREFIX)) {
      chapterKeys.push(key);
      yield;
      continue;
    }
    if (!key.startsWith(CACHE_V2_INDEX_PREFIX)) {
      yield;
      continue;
    }

    const bookId = key.slice(CACHE_V2_INDEX_PREFIX.length);
    const data = parseStoredJson<PersistedBookCacheV2Index>(GM_getValue<unknown>(key, null));
    if (!bookId || !isPersistedCacheIndex(data)) {
      invalidIndexes.push({ key, bookId });
      yield;
      continue;
    }

    const record = { key, bookId, data };
    const lastAccessed = getIndexAccessTime(data);
    if (!protectedBookIds.has(bookId) && lastAccessed !== null && now - lastAccessed > maxAgeMs) {
      expiredIndexes.push(record);
    } else {
      activeIndexes.push(record);
    }
    yield;
  }

  // Group chapter keys by every valid book prefix before expiration work. This lets cleanup reuse
  // the stored keys instead of re-encoding every indexed URL, which avoids large allocation spikes.
  const indexGroups: PersistedCacheIndexGroup[] = [...activeIndexes, ...expiredIndexes].map(
    record => ({
      ...record,
      chapterKeys: [],
      chapterPrefix: getCacheV2ChapterBookPrefix(record.bookId),
    })
  );
  const indexGroupsByPrefixLength = new Map<number, Map<string, PersistedCacheIndexGroup>>();
  for (const group of indexGroups) {
    let groupsAtLength = indexGroupsByPrefixLength.get(group.chapterPrefix.length);
    if (!groupsAtLength) {
      groupsAtLength = new Map();
      indexGroupsByPrefixLength.set(group.chapterPrefix.length, groupsAtLength);
    }
    groupsAtLength.set(group.chapterPrefix, group);
  }
  const indexPrefixLengths = Array.from(indexGroupsByPrefixLength.keys()).sort((a, b) => b - a);
  const unindexedChapterKeys: string[] = [];
  for (const key of chapterKeys) {
    let group: PersistedCacheIndexGroup | undefined;
    for (const prefixLength of indexPrefixLengths) {
      if (prefixLength > key.length) continue;
      group = indexGroupsByPrefixLength.get(prefixLength)?.get(key.slice(0, prefixLength));
      if (group) break;
    }
    if (group) group.chapterKeys.push(key);
    else unindexedChapterKeys.push(key);
    yield;
  }

  const expiredIndexKeys = new Set(expiredIndexes.map(record => record.key));
  const activeIndexGroups: PersistedCacheIndexGroup[] = [];
  for (const group of indexGroups) {
    if (!expiredIndexKeys.has(group.key)) {
      activeIndexGroups.push(group);
      yield;
      continue;
    }

    if (protectedBookIds.has(group.bookId)) {
      activeIndexGroups.push(group);
      yield;
      continue;
    }

    // Re-read an expired index before deleting it so a book touched by another tab is preserved.
    const current = parseStoredJson<PersistedBookCacheV2Index>(
      GM_getValue<unknown>(group.key, null)
    );
    if (!isPersistedCacheIndex(current)) {
      invalidIndexes.push({ key: group.key, bookId: group.bookId });
      for (const key of group.chapterKeys) {
        unindexedChapterKeys.push(key);
        yield;
      }
      continue;
    }

    const lastAccessed = getIndexAccessTime(current);
    if (
      protectedBookIds.has(group.bookId) ||
      lastAccessed === null ||
      now - lastAccessed <= maxAgeMs
    ) {
      activeIndexGroups.push({ ...group, data: current });
      yield;
      continue;
    }

    const indexedUrls = new Set<string>();
    for (const url of current.urls) {
      if (typeof url === 'string') indexedUrls.add(url);
      yield;
    }

    let deletionAborted = false;
    for (const key of group.chapterKeys) {
      if (protectedBookIds.has(group.bookId)) {
        deletionAborted = true;
        break;
      }

      const chapterUrl = decodeBase64UrlUtf8(key.slice(group.chapterPrefix.length));
      if (chapterUrl !== null && indexedUrls.has(chapterUrl)) {
        GM_deleteValue(key);
      } else {
        unindexedChapterKeys.push(key);
      }
      yield;
    }

    if (deletionAborted) continue;

    // A different tab may have restored and touched this book while the chapter deletions yielded.
    // Keep its fresh index so the active tab can recover any entries removed before the touch.
    const latest = parseStoredJson<PersistedBookCacheV2Index>(
      GM_getValue<unknown>(group.key, null)
    );
    const latestAccessed = isPersistedCacheIndex(latest) ? getIndexAccessTime(latest) : null;
    if (protectedBookIds.has(group.bookId)) {
      yield;
      continue;
    }
    if (
      isPersistedCacheIndex(latest) &&
      (latestAccessed === null || now - latestAccessed <= maxAgeMs)
    ) {
      yield;
      continue;
    }

    GM_deleteValue(group.key);
    yield;
  }

  for (const { key, bookId } of invalidIndexes) {
    if (!bookId || protectedBookIds.has(bookId)) {
      yield;
      continue;
    }
    GM_deleteValue(key);
    yield;
  }

  const orphanIndexStates = new Map<string, OrphanIndexState>();
  for (const key of unindexedChapterKeys) {
    cleanupOrphanedChapter(key, now, maxAgeMs, protectedBookIds, orphanIndexStates);
    yield;
  }

  // Healthy books stop at a count comparison. Exact URL checks are reserved for inconsistent
  // indexes, and both set construction and key decoding remain split across idle slices.
  for (const group of activeIndexGroups) {
    const index = group.data;
    if (group.chapterKeys.length === index.urls.length) {
      yield;
      continue;
    }

    const reachableUrls = new Set<string>();
    for (const url of index.urls) {
      if (typeof url === 'string') {
        reachableUrls.add(url);
      }
      yield;
    }

    for (const key of group.chapterKeys) {
      const chapterUrl = decodeBase64UrlUtf8(key.slice(group.chapterPrefix.length));
      if (chapterUrl === null || !reachableUrls.has(chapterUrl)) {
        cleanupOrphanedChapter(key, now, maxAgeMs, protectedBookIds, orphanIndexStates);
      }
      yield;
    }
  }
}

function runScheduledCacheCleanup(state: ScheduledCacheCleanup): void {
  scheduleCacheCleanupSlice(deadline => {
    if (scheduledCacheCleanup !== state) return;

    try {
      state.iterator ??= createPersistedCacheCleanupSteps(
        state.now,
        state.maxAgeMs,
        state.protectedBookIds
      );

      const startedAt = getMonotonicTime();
      let steps = 0;
      while (steps < PERSISTED_CACHE_GC_SLICE_STEPS) {
        const result = state.iterator.next();
        if (result.done) {
          scheduledCacheCleanup = null;
          return;
        }

        steps += 1;
        const budgetExhausted =
          getMonotonicTime() - startedAt >= PERSISTED_CACHE_GC_SLICE_BUDGET_MS;
        const idleTimeExhausted =
          deadline !== null && !deadline.didTimeout && deadline.timeRemaining() <= 1;
        if (budgetExhausted || idleTimeExhausted) break;
      }

      runScheduledCacheCleanup(state);
    } catch (e) {
      scheduledCacheCleanup = null;
      console.error('[MNR] Failed to cleanup expired caches:', e);
    }
  });
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
    if (!options.force && scheduledCacheCleanup) {
      if (options.currentBookId) {
        scheduledCacheCleanup.protectedBookIds.add(options.currentBookId);
      }
      return;
    }

    if (!options.force) {
      const lastRun = normalizeTimestamp(GM_getValue<unknown>(PERSISTED_CACHE_GC_LAST_RUN_KEY, 0));
      if (lastRun !== null && now - lastRun < gcIntervalMs) return;
    }

    const protectedBookIds = new Set<string>();
    if (options.currentBookId) protectedBookIds.add(options.currentBookId);

    if (options.force) {
      scheduledCacheCleanup = null;
      const iterator = createPersistedCacheCleanupSteps(now, maxAgeMs, protectedBookIds);
      while (!iterator.next().done) {
        // Forced cleanup is intentionally synchronous for explicit callers and deterministic tests.
      }
      GM_setValue(PERSISTED_CACHE_GC_LAST_RUN_KEY, now);
      return;
    }

    // Reserve the daily run before scheduling so multiple tabs do not duplicate maintenance work.
    GM_setValue(PERSISTED_CACHE_GC_LAST_RUN_KEY, now);
    const state: ScheduledCacheCleanup = {
      iterator: null,
      maxAgeMs,
      now,
      protectedBookIds,
    };
    scheduledCacheCleanup = state;
    runScheduledCacheCleanup(state);
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
