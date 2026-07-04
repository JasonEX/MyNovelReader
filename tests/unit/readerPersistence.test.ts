import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  cleanupExpiredCaches,
  clearPersistedCache,
  encodeBase64UrlUtf8,
  generateBookId,
  getCacheV2ChapterKey,
  getCacheV2IndexKey,
  getCurrentBookCacheKey,
  getPersistedCachedChapter,
  parseStoredJson,
  persistCache,
  persistCachedChapter,
  persistCacheIndex,
  PERSISTED_CACHE_GC_LAST_RUN_KEY,
  restoreCache,
  touchPersistedCache,
} from '@/ui/stores/reader/persistence';
import type { CachedChapter } from '@/ui/stores/reader/types';

describe('persistence pure helpers', () => {
  it('generateBookId uses hostname + pathname', () => {
    const id = generateBookId('https://example.com/book/123/');
    expect(id).toContain('example.com');
    expect(id).toContain('book');
  });

  it('generateBookId falls back to btoa for invalid URL', () => {
    const id = generateBookId('not a url');
    expect(typeof id).toBe('string');
    expect(id.length).toBeLessThanOrEqual(32);
  });

  it('encodeBase64UrlUtf8 produces URL-safe base64', () => {
    const encoded = encodeBase64UrlUtf8('https://example.com/chapter/1');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
  });

  it('parseStoredJson parses JSON string', () => {
    expect(parseStoredJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('parseStoredJson returns null for invalid JSON', () => {
    expect(parseStoredJson('not json')).toBeNull();
  });

  it('parseStoredJson returns null for null/undefined', () => {
    expect(parseStoredJson(null)).toBeNull();
    expect(parseStoredJson(undefined)).toBeNull();
  });

  it('parseStoredJson returns object as-is', () => {
    const obj = { a: 1 };
    expect(parseStoredJson(obj)).toBe(obj);
  });

  it('parseStoredJson returns null for non-object non-string', () => {
    expect(parseStoredJson(42)).toBeNull();
    expect(parseStoredJson(true)).toBeNull();
  });

  it('getCacheV2IndexKey returns expected format', () => {
    expect(getCacheV2IndexKey('book1')).toBe('mnr_cache_v2_index_book1');
  });

  it('getCacheV2ChapterKey includes encoded URL', () => {
    const key = getCacheV2ChapterKey('book1', 'https://example.com/ch/1');
    expect(key).toContain('mnr_cache_v2_chapter_book1_');
  });

  it('getCurrentBookCacheKey returns null for undefined', () => {
    expect(getCurrentBookCacheKey(undefined)).toBeNull();
  });

  it('getCurrentBookCacheKey returns key for valid URL', () => {
    const key = getCurrentBookCacheKey('https://example.com/book/123/');
    expect(key).not.toBeNull();
    expect(key!.bookId).toContain('example.com');
    expect(key!.indexUrl).toBe('https://example.com/book/123/');
  });
});

describe('persistence GM_* functions', () => {
  const storage = new Map<string, unknown>();

  beforeEach(() => {
    storage.clear();
    (globalThis as Record<string, unknown>).GM_setValue = vi.fn((key: string, value: unknown) => {
      storage.set(key, value);
    });
    (globalThis as Record<string, unknown>).GM_getValue = vi.fn(
      <T>(key: string, defaultValue: T): T => {
        const v = storage.get(key);
        return v !== undefined ? (v as unknown as T) : defaultValue;
      }
    );
    (globalThis as Record<string, unknown>).GM_deleteValue = vi.fn((key: string) => {
      storage.delete(key);
    });
    (globalThis as Record<string, unknown>).GM_listValues = vi.fn(() => Array.from(storage.keys()));
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).GM_setValue;
    delete (globalThis as Record<string, unknown>).GM_getValue;
    delete (globalThis as Record<string, unknown>).GM_deleteValue;
    delete (globalThis as Record<string, unknown>).GM_listValues;
  });

  const makeCached = (url: string): CachedChapter =>
    ({
      chapter: { url, title: 'Test', content: '<p>test</p>', bookTitle: 'Book' },
      rule: null,
      cachedAt: Date.now(),
    }) as unknown as CachedChapter;

  const cacheBook = { bookId: 'test_book', indexUrl: 'https://example.com/book/1/' };

  it('persistCachedChapter stores and getPersistedCachedChapter retrieves', () => {
    const cached = makeCached('https://example.com/ch/1');
    const result = persistCachedChapter(cacheBook, 'https://example.com/ch/1', cached);
    expect(result).toBe(true);

    const retrieved = getPersistedCachedChapter(cacheBook, 'https://example.com/ch/1');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.chapter.url).toBe('https://example.com/ch/1');
  });

  it('getPersistedCachedChapter returns null for missing chapter', () => {
    const retrieved = getPersistedCachedChapter(cacheBook, 'https://example.com/ch/999');
    expect(retrieved).toBeNull();
  });

  it('persistCache writes index and chapters', () => {
    const contents = new Map<string, CachedChapter>();
    contents.set('https://example.com/ch/1', makeCached('https://example.com/ch/1'));
    contents.set('https://example.com/ch/2', makeCached('https://example.com/ch/2'));

    const now = vi.spyOn(Date, 'now').mockReturnValue(1234);
    const result = persistCache(cacheBook, contents, new Set());
    now.mockRestore();
    expect(result.size).toBe(2);
    expect(result.has('https://example.com/ch/1')).toBe(true);
    expect(result.has('https://example.com/ch/2')).toBe(true);

    // Index should be written
    const indexKey = getCacheV2IndexKey(cacheBook.bookId);
    expect(storage.has(indexKey)).toBe(true);
    const index = parseStoredJson<{ lastAccessed: number; lastUpdated: number }>(
      storage.get(indexKey)
    );
    expect(index?.lastUpdated).toBe(1234);
    expect(index?.lastAccessed).toBe(1234);
  });

  it('persistCacheIndex writes only the v2 index', () => {
    const result = persistCacheIndex(
      cacheBook,
      new Set(['https://example.com/ch/1', 'https://example.com/ch/2']),
      5678
    );

    expect(result).toBe(true);
    const index = parseStoredJson<{ urls: string[]; lastAccessed: number; lastUpdated: number }>(
      storage.get(getCacheV2IndexKey(cacheBook.bookId))
    );
    expect(index?.urls).toEqual(['https://example.com/ch/1', 'https://example.com/ch/2']);
    expect(index?.lastUpdated).toBe(5678);
    expect(index?.lastAccessed).toBe(5678);
  });

  it('restoreCache reads V2 index', () => {
    const indexData = {
      version: 2,
      bookId: cacheBook.bookId,
      indexUrl: cacheBook.indexUrl,
      urls: ['https://example.com/ch/1', 'https://example.com/ch/2'],
      lastUpdated: Date.now(),
    };
    storage.set(getCacheV2IndexKey(cacheBook.bookId), JSON.stringify(indexData));

    const result = restoreCache(cacheBook);
    expect(result).not.toBeNull();
    expect(result!.size).toBe(2);
  });

  it('restoreCache returns null when nothing stored', () => {
    const result = restoreCache(cacheBook);
    expect(result).toBeNull();
  });

  it('clearPersistedCache removes all cached data', () => {
    // Persist some data first
    const contents = new Map<string, CachedChapter>();
    contents.set('https://example.com/ch/1', makeCached('https://example.com/ch/1'));
    persistCache(cacheBook, contents, new Set());

    const persistedUrls = new Set(['https://example.com/ch/1']);
    clearPersistedCache(cacheBook, persistedUrls);

    // V2 index should be gone
    expect(storage.has(getCacheV2IndexKey(cacheBook.bookId))).toBe(false);
  });

  it('clearPersistedCache uses GM_listValues when no URLs provided', () => {
    // Add some chapter keys directly
    const chapterKey = getCacheV2ChapterKey(cacheBook.bookId, 'https://example.com/ch/1');
    storage.set(chapterKey, 'data');

    clearPersistedCache(cacheBook, new Set());

    expect(storage.has(chapterKey)).toBe(false);
  });

  it('clearPersistedCache reads V2 index for URL list', () => {
    const cached = makeCached('https://example.com/ch/1');
    persistCachedChapter(cacheBook, 'https://example.com/ch/1', cached);

    const indexData = {
      version: 2,
      bookId: cacheBook.bookId,
      indexUrl: cacheBook.indexUrl,
      urls: ['https://example.com/ch/1'],
      lastUpdated: Date.now(),
    };
    storage.set(getCacheV2IndexKey(cacheBook.bookId), JSON.stringify(indexData));

    clearPersistedCache(cacheBook, new Set());

    const chapterKey = getCacheV2ChapterKey(cacheBook.bookId, 'https://example.com/ch/1');
    expect(storage.has(chapterKey)).toBe(false);
  });

  it('touchPersistedCache updates lastAccessed only after the touch interval', () => {
    const indexKey = getCacheV2IndexKey(cacheBook.bookId);
    storage.set(
      indexKey,
      JSON.stringify({
        version: 2,
        bookId: cacheBook.bookId,
        indexUrl: cacheBook.indexUrl,
        urls: ['https://example.com/ch/1'],
        lastUpdated: 100,
        lastAccessed: 100,
      })
    );

    expect(touchPersistedCache(cacheBook, 500, 1000)).toBe(false);
    expect(parseStoredJson<{ lastAccessed: number }>(storage.get(indexKey))?.lastAccessed).toBe(
      100
    );

    expect(touchPersistedCache(cacheBook, 1200, 1000)).toBe(true);
    expect(parseStoredJson<{ lastAccessed: number }>(storage.get(indexKey))?.lastAccessed).toBe(
      1200
    );
  });

  it('cleanupExpiredCaches removes expired books and skips current/fresh books', () => {
    const now = 10_000;
    const maxAgeMs = 1_000;
    const oldBook = { bookId: 'old_book', indexUrl: 'https://example.com/old/' };
    const freshBook = { bookId: 'fresh_book', indexUrl: 'https://example.com/fresh/' };
    const currentBook = { bookId: 'current_book', indexUrl: 'https://example.com/current/' };

    for (const book of [oldBook, freshBook, currentBook]) {
      persistCachedChapter(book, `${book.indexUrl}1.html`, makeCached(`${book.indexUrl}1.html`));
    }
    persistCacheIndex(oldBook, new Set([`${oldBook.indexUrl}1.html`]), now - maxAgeMs - 1);
    persistCacheIndex(freshBook, new Set([`${freshBook.indexUrl}1.html`]), now);
    persistCacheIndex(currentBook, new Set([`${currentBook.indexUrl}1.html`]), now - maxAgeMs - 1);

    cleanupExpiredCaches({
      currentBookId: currentBook.bookId,
      force: true,
      maxAgeMs,
      now,
    });

    expect(storage.has(getCacheV2IndexKey(oldBook.bookId))).toBe(false);
    expect(storage.has(getCacheV2ChapterKey(oldBook.bookId, `${oldBook.indexUrl}1.html`))).toBe(
      false
    );
    expect(storage.has(getCacheV2IndexKey(freshBook.bookId))).toBe(true);
    expect(storage.has(getCacheV2IndexKey(currentBook.bookId))).toBe(true);
    expect(storage.get(PERSISTED_CACHE_GC_LAST_RUN_KEY)).toBe(now);
  });

  it('cleanupExpiredCaches respects the daily run interval', () => {
    const now = 10_000;
    const book = { bookId: 'old_book', indexUrl: 'https://example.com/old/' };
    persistCacheIndex(book, new Set([`${book.indexUrl}1.html`]), 1);
    storage.set(PERSISTED_CACHE_GC_LAST_RUN_KEY, now - 100);

    cleanupExpiredCaches({
      gcIntervalMs: 1_000,
      maxAgeMs: 1,
      now,
    });

    expect(storage.has(getCacheV2IndexKey(book.bookId))).toBe(true);
  });
});

describe('persistence without GM_* globals', () => {
  it('persistCachedChapter returns false without GM_setValue', () => {
    const cached = {
      chapter: { url: 'x', title: 't', content: 'c' },
      rule: null,
      cachedAt: 1,
    } as unknown as CachedChapter;
    expect(persistCachedChapter({ bookId: 'b', indexUrl: 'u' }, 'x', cached)).toBe(false);
  });

  it('getPersistedCachedChapter returns null without GM_getValue', () => {
    expect(getPersistedCachedChapter({ bookId: 'b', indexUrl: 'u' }, 'x')).toBeNull();
  });

  it('restoreCache returns null without GM_getValue', () => {
    expect(restoreCache({ bookId: 'b', indexUrl: 'u' })).toBeNull();
  });

  it('persistCache returns same set without GM_setValue', () => {
    const set = new Set(['url1']);
    const result = persistCache({ bookId: 'b', indexUrl: 'u' }, new Map(), set);
    expect(result).toBe(set);
  });
});
