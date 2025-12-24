/**
 * Cache Manager Module
 *
 * Handles chapter caching, bulk loading, and persistence.
 *
 * @module CacheManager
 */

import { getChapterCacheManager } from '@/core/optimization/MemoryManager';
import { getParserExtensions } from '@/core/parser/ParserExtensions';

import type { CachedChapter, CacheProgressState, TocEntry } from './types';
import { normalizeUrlForFetch } from './utils';

const CACHE_MIN_DELAY_MS = 3000;
const CACHE_MAX_DELAY_MS = 5000;
const CACHE_FAIL_BASE_DELAY_MS = 5000;
const CACHE_FAIL_MAX_DELAY_MS = 30000;

/**
 * Cache Manager - handles chapter caching and bulk loading
 */
export class CacheManager {
  private cacheProgress: CacheProgressState;
  private cacheQueue: string[];
  private cacheAbort: (() => void) | null = null;
  private memoryManager = getChapterCacheManager();
  private cacheDelayTimer: ReturnType<typeof setTimeout> | null = null;
  private cacheDelayResolve: (() => void) | null = null;

  constructor() {
    this.cacheProgress = { done: 0, total: 0, running: false };
    this.cacheQueue = [];
  }

  /**
   * Get current cache progress
   */
  getProgress(): CacheProgressState {
    return this.cacheProgress;
  }

  /**
   * Get current cache queue
   */
  getQueue(): string[] {
    return this.cacheQueue;
  }

  /**
   * Start caching all chapters
   *
   * @param context - Cache context
   * @returns Promise that resolves when caching is complete
   */
  async startCacheAll(context: CacheManagerContext): Promise<void> {
    if (this.cacheProgress.running) return;

    let taskList = context.urls ? [...context.urls] : [];
    this.cacheQueue = [...taskList];

    // Load TOC if no URLs provided
    if (!taskList.length) {
      const indexUrl = context.currentChapter?.indexUrl;
      const currentUrl = context.currentChapter?.url;
      if (indexUrl) {
        const tocEntries = await context.loadTocEntries(indexUrl, currentUrl || indexUrl, abort => {
          this.cacheAbort = abort;
        });
        this.cacheAbort = null;

        if (tocEntries.length > 0) {
          const tocLinks = tocEntries.map(e => e.url).slice(0, 10000);
          taskList = tocLinks.filter(
            u => !context.loadedUrls.has(u) && !this.memoryManager.hasChapter(u)
          );
          this.cacheQueue = [...taskList];
        }
      }
    }

    const estimatedTotal = taskList.length;
    if (estimatedTotal === 0) {
      this.cacheProgress = { done: 0, total: 0, running: false };
      return;
    }
    this.cacheProgress = { done: 0, total: estimatedTotal, running: true };

    let nextUrl: string | undefined | null = taskList.shift();
    let referer =
      context.chapters[context.chapters.length - 1]?.chapter.url || context.currentChapter?.url;

    const parserExt = getParserExtensions();
    let consecutiveFailures = 0;

    while (this.cacheProgress.running && nextUrl) {
      const targetUrl = normalizeUrlForFetch(nextUrl);

      // Deduplication check
      if (context.loadedUrls.has(targetUrl) || this.memoryManager.hasChapter(targetUrl)) {
        this.cacheProgress = { ...this.cacheProgress, done: this.cacheProgress.done + 1 };
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      // Use ParserExtensions for fetching and merging
      // Note: we lose granular abort for single chapter fetch here,
      // but we still check this.cacheProgress.running each loop.
      const parsed = await parserExt.fetchAndParseChapter(targetUrl, referer);

      if (!parsed) {
        consecutiveFailures++;
        nextUrl = taskList.shift() ?? null;
        await this.delay(this.getCacheDelayMs(consecutiveFailures));
        continue;
      }
      consecutiveFailures = 0;

      // Store in memory manager
      this.memoryManager.addChapter(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      context.loadedUrls.add(parsed.url);

      this.cacheProgress = { ...this.cacheProgress, done: this.cacheProgress.done + 1 };

      referer = parsed.url;
      nextUrl = taskList.shift() ?? (parsed.nextUrl ? normalizeUrlForFetch(parsed.nextUrl) : null);

      if (!this.cacheQueue.length && nextUrl && !context.loadedUrls.has(nextUrl)) {
        this.cacheProgress = { ...this.cacheProgress, total: this.cacheProgress.done + 1 };
      }

      context.onProgress?.(this.cacheProgress);

      if (this.cacheProgress.running && nextUrl) {
        await this.delay(this.getCacheDelayMs(consecutiveFailures));
      }
    }

    // Final state update
    this.cacheProgress = {
      ...this.cacheProgress,
      total: this.cacheProgress.done,
      running: false,
    };
    this.cacheAbort = null;

    await this.persistCache(context);
  }

  /**
   * Stop caching
   */
  stopCache(): void {
    this.cacheProgress = { ...this.cacheProgress, running: false };
    if (this.cacheAbort) {
      this.cacheAbort();
      this.cacheAbort = null;
    }
    this.clearDelay();
  }

  /**
   * Persist cache to GM storage
   */
  async persistCache(context: CacheManagerContext): Promise<void> {
    const bookId = context.currentChapter?.bookId;
    if (!bookId) return;

    const indexUrl = context.currentChapter!.indexUrl || context.currentChapter!.url;

    // Build persisted cache object
    const chaptersToPersist: Record<string, CachedChapter> = {};
    let totalSize = 0;
    const maxSize = 4 * 1024 * 1024; // 4MB max per book

    const cachedUrls = this.memoryManager.getCachedUrls();

    for (const url of cachedUrls) {
      if (!context.persistedUrls.has(url)) continue;

      const cached = this.memoryManager.getChapter(url);
      if (!cached) continue;

      const size = cached.chapter.content.length * 2;
      if (totalSize + size > maxSize) break;

      chaptersToPersist[url] = cached;
      totalSize += size;
    }

    const persistedCache = {
      bookId,
      indexUrl,
      chapters: chaptersToPersist,
      lastUpdated: Date.now(),
    };

    try {
      await GM.setValue(`cache_${bookId}`, persistedCache);
    } catch (e) {
      console.error('[MNR] Failed to persist cache:', e);
    }
  }

  /**
   * Restore cache from GM storage
   */
  async restoreCache(context: CacheManagerContext): Promise<number> {
    const bookId = context.currentChapter?.bookId;
    if (!bookId) return 0;

    try {
      const persisted = await GM.getValue<PersistedCache>(`cache_${bookId}`);
      if (!persisted) return 0;

      let restoredCount = 0;
      for (const [url, cached] of Object.entries(persisted.chapters || {})) {
        this.memoryManager.addChapter(url, cached);
        context.persistedUrls.add(url);
        context.loadedUrls.add(url);
        restoredCount++;
      }

      return restoredCount;
    } catch (e) {
      console.error('[MNR] Failed to restore cache:', e);
      return 0;
    }
  }

  /**
   * Clear cache for a book
   */
  async clearBookCache(bookId: string): Promise<void> {
    try {
      await GM.deleteValue(`cache_${bookId}`);
    } catch (e) {
      console.error('[MNR] Failed to clear cache:', e);
    }
  }

  private getCacheDelayMs(consecutiveFailures: number): number {
    const baseDelay = this.getRandomDelay(CACHE_MIN_DELAY_MS, CACHE_MAX_DELAY_MS);
    if (consecutiveFailures <= 0) return baseDelay;

    const backoff = Math.min(
      CACHE_FAIL_BASE_DELAY_MS * Math.pow(2, consecutiveFailures - 1),
      CACHE_FAIL_MAX_DELAY_MS
    );
    const jitter = backoff * 0.2 * Math.random();
    return Math.max(baseDelay, backoff + jitter);
  }

  private getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async delay(ms: number): Promise<void> {
    if (ms <= 0) return;
    if (!this.cacheProgress.running) return;

    await new Promise<void>(resolve => {
      this.cacheDelayResolve = resolve;
      this.cacheDelayTimer = setTimeout(() => {
        this.cacheDelayTimer = null;
        this.cacheDelayResolve = null;
        resolve();
      }, ms);
    });
  }

  private clearDelay(): void {
    if (this.cacheDelayTimer) {
      clearTimeout(this.cacheDelayTimer);
      this.cacheDelayTimer = null;
    }
    if (this.cacheDelayResolve) {
      this.cacheDelayResolve();
      this.cacheDelayResolve = null;
    }
  }
}

/**
 * Persisted cache structure
 */
interface PersistedCache {
  bookId: string;
  indexUrl: string;
  chapters: Record<string, CachedChapter>;
  lastUpdated: number;
}

/**
 * Context for cache manager operations
 */
export interface CacheManagerContext {
  /** URLs to cache (optional) */
  urls?: string[];
  /** Current chapter */
  currentChapter?: ParsedChapter | null;
  /** Existing chapters */
  chapters: { chapter: ParsedChapter; rule?: SiteRule; id: string }[];
  /** Loaded URLs tracking */
  loadedUrls: Set<string>;
  /** Proxy map for cache content (optional, for compatibility) */
  cachedContents?: Map<string, CachedChapter>;
  /** Persisted URLs */
  persistedUrls: Set<string>;
  /** Load TOC entries function */
  loadTocEntries: (
    indexUrl: string,
    currentUrl: string,
    setAbort: (abort: () => void) => void
  ) => Promise<TocEntry[]>;
  /** Progress callback */
  onProgress?: (progress: CacheProgressState) => void;
}
