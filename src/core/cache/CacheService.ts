/**
 * Enhanced Cache Service
 *
 * Integrates MemoryManager with GM storage for persistent caching
 * with intelligent memory management and LRU eviction.
 *
 * @module CacheService
 */

import { ChapterCacheManager, getChapterCacheManager } from '@/core/optimization';
import type { CachedChapter } from '@/ui/stores/reader/types';

/** Cache storage options */
export interface CacheStorageOptions {
  /** Enable persistent storage (GM storage) */
  enablePersistent?: boolean;
  /** Auto-save interval in milliseconds (default: 30000) */
  autoSaveInterval?: number;
  /** Maximum age for cache entries in milliseconds (default: 1 hour) */
  maxAge?: number;
}

/** Cache statistics */
export interface CacheStatistics {
  /** Total entries in memory cache */
  memoryEntries: number;
  /** Total entries in persistent storage */
  persistentEntries: number;
  /** Total memory size in bytes */
  memorySize: number;
  /** Cache hit rate */
  hitRate: number;
  /** Total hits */
  hitCount: number;
  /** Total misses */
  missCount: number;
}

/**
 * Enhanced Cache Service
 *
 * Provides intelligent caching with memory management,
 * persistent storage, and automatic cleanup
 */
export class CacheService {
  private memoryManager: ChapterCacheManager;
  private persistentCache = new Map<string, CachedChapter>();
  private options: Required<CacheStorageOptions>;
  private autoSaveTimer: number | null = null;
  private initPromise: Promise<void> | null = null;
  private hitCount = 0;
  private missCount = 0;

  // Statistics
  private stats = {
    memoryEntries: 0,
    persistentEntries: 0,
    memorySize: 0,
    hitRate: 0,
  };

  constructor(options: CacheStorageOptions = {}) {
    this.options = {
      enablePersistent: options.enablePersistent ?? true,
      autoSaveInterval: options.autoSaveInterval ?? 30000,
      maxAge: options.maxAge ?? 60 * 60 * 1000, // 1 hour
    };

    this.memoryManager = getChapterCacheManager({
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 100,
    });

    // Fire-and-forget initialization so consumers can still use the service synchronously,
    // while async callers can await `init()` or `getCacheServiceAsync()`.
    void this.init();
  }

  updateOptions(options: CacheStorageOptions = {}): void {
    const previous = this.options;
    const next: Required<CacheStorageOptions> = {
      enablePersistent: options.enablePersistent ?? previous.enablePersistent,
      autoSaveInterval: options.autoSaveInterval ?? previous.autoSaveInterval,
      maxAge: options.maxAge ?? previous.maxAge,
    };

    this.options = next;

    if (previous.enablePersistent !== next.enablePersistent) {
      if (!next.enablePersistent) {
        this.stopAutoSave();
        this.persistentCache.clear();
        this.initPromise = null;
      } else {
        this.initPromise = null;
        void this.init();
      }
    }

    if (next.enablePersistent && previous.autoSaveInterval !== next.autoSaveInterval) {
      this.stopAutoSave();
      void this.init();
    }

    if (previous.maxAge !== next.maxAge) {
      this.cleanupOldEntries();
    }
  }

  /**
   * Initialize persistent cache and auto-save.
   *
   * Safe to call multiple times.
   */
  async init(): Promise<void> {
    if (!this.options.enablePersistent) {
      return;
    }

    if (!this.initPromise) {
      this.initPromise = this.loadFromStorage();
    }

    await this.initPromise;

    if (this.options.enablePersistent) {
      this.startAutoSave();
    }
  }

  /**
   * Add a chapter to cache
   *
   * @param url - Chapter URL
   * @param chapter - Chapter data
   * @param persistent - Whether to persist to storage
   */
  addChapter(url: string, chapter: CachedChapter, persistent: boolean = true): void {
    const now = Date.now();

    // Add to memory cache
    this.memoryManager.addChapter(url, {
      ...chapter,
      cachedAt: now,
    });

    // Add to persistent cache if enabled
    if (persistent && this.options.enablePersistent) {
      this.persistentCache.set(url, {
        ...chapter,
        cachedAt: now,
      });
    }

    this.updateStats();
  }

  /**
   * Get a chapter from cache
   *
   * @param url - Chapter URL
   * @returns Cached chapter or undefined
   */
  getChapter(url: string): CachedChapter | undefined {
    const now = Date.now();
    const maxAge = this.options.maxAge;

    // Check memory cache first
    const chapter = this.memoryManager.getChapter(url);

    if (chapter) {
      if (!this.isExpired(chapter, now, maxAge)) {
        this.hitCount++;
        return chapter;
      }

      this.memoryManager.removeChapter(url);
      this.updateStats();
    }

    // Check persistent cache
    if (this.options.enablePersistent) {
      const persistentChapter = this.persistentCache.get(url);

      if (persistentChapter) {
        const normalizedPersistent = this.normalizeCachedChapter(persistentChapter, now);

        if (this.isExpired(normalizedPersistent, now, maxAge)) {
          this.persistentCache.delete(url);
          this.updateStats();
        } else {
          // Promote to memory cache
          this.memoryManager.addChapter(url, normalizedPersistent);
          this.hitCount++;
          return normalizedPersistent;
        }
      }
    }

    this.missCount++;
    return undefined;
  }

  /**
   * Check if a chapter is cached
   *
   * @param url - Chapter URL
   * @returns true if chapter is in cache
   */
  hasChapter(url: string): boolean {
    const now = Date.now();
    const maxAge = this.options.maxAge;

    const memoryChapter = this.memoryManager.peekChapter(url);
    if (memoryChapter) {
      if (!this.isExpired(memoryChapter, now, maxAge)) {
        return true;
      }
      this.memoryManager.removeChapter(url);
      this.updateStats();
    }

    if (!this.options.enablePersistent) {
      return false;
    }

    const persistentChapter = this.persistentCache.get(url);
    if (!persistentChapter) {
      return false;
    }

    const normalizedPersistent = this.normalizeCachedChapter(persistentChapter, now);
    if (!this.isExpired(normalizedPersistent, now, maxAge)) {
      return true;
    }

    this.persistentCache.delete(url);
    this.updateStats();
    return false;
  }

  /**
   * Remove a chapter from cache
   *
   * @param url - Chapter URL
   */
  removeChapter(url: string): void {
    this.memoryManager.removeChapter(url);
    if (this.options.enablePersistent) {
      this.persistentCache.delete(url);
    }
    this.updateStats();
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.memoryManager.clear();
    if (this.options.enablePersistent) {
      this.persistentCache.clear();
      this.clearPersistentStorage();
    }
    this.hitCount = 0;
    this.missCount = 0;
    this.updateStats();
  }

  /**
   * Get all cached URLs
   *
   * @returns Array of cached URLs
   */
  getCachedUrls(): string[] {
    const memoryUrls = this.memoryManager.getCachedUrls();
    const persistentUrls = this.options.enablePersistent
      ? Array.from(this.persistentCache.keys())
      : [];

    // Return unique URLs
    return Array.from(new Set([...memoryUrls, ...persistentUrls]));
  }

  /**
   * Get cache statistics
   *
   * @returns Cache statistics
   */
  getStatistics(): CacheStatistics {
    const memStats = this.memoryManager.getStats();
    const totalAccess = this.hitCount + this.missCount;

    return {
      memoryEntries: memStats.totalEntries,
      persistentEntries: this.persistentCache.size,
      memorySize: memStats.totalSize,
      hitRate: totalAccess > 0 ? this.hitCount / totalAccess : 0,
      hitCount: this.hitCount,
      missCount: this.missCount,
    };
  }

  /**
   * Optimize cache by removing least accessed entries
   */
  optimize(): void {
    this.memoryManager.optimize();
    this.cleanupOldEntries();
    this.updateStats();
  }

  /**
   * Cleanup old cache entries
   */
  cleanupOldEntries(): void {
    const now = Date.now();
    const maxAge = this.options.maxAge;

    // Cleanup memory cache (managed by MemoryManager)
    this.memoryManager.cleanup(maxAge);

    // Cleanup persistent cache
    if (this.options.enablePersistent) {
      for (const [url, chapter] of this.persistentCache.entries()) {
        if (now - chapter.cachedAt > maxAge) {
          this.persistentCache.delete(url);
        }
      }
    }

    this.updateStats();
  }

  /**
   * Save cache to persistent storage
   *
   * @param key - Storage key (default: 'mnr_cache')
   */
  async saveToStorage(key: string = 'mnr_cache'): Promise<void> {
    if (!this.options.enablePersistent) {
      return;
    }

    try {
      await this.init();
      this.cleanupOldEntries();

      const cacheData = Array.from(this.persistentCache.entries());
      const data = JSON.stringify(cacheData);

      if (typeof GM_setValue !== 'undefined') {
        GM_setValue(key, data);
      } else {
        localStorage.setItem(key, data);
      }

      console.log(`[CacheService] Saved ${cacheData.length} chapters to storage`);
    } catch (error) {
      console.error('[CacheService] Failed to save to storage:', error);
    }
  }

  /**
   * Load cache from persistent storage
   *
   * @param key - Storage key (default: 'mnr_cache')
   */
  async loadFromStorage(key: string = 'mnr_cache'): Promise<void> {
    if (!this.options.enablePersistent) {
      return;
    }

    try {
      let data: string | null = null;

      if (typeof GM_getValue !== 'undefined') {
        data = GM_getValue(key, null);
      } else {
        data = localStorage.getItem(key);
      }

      if (!data) {
        return;
      }

      const cacheData: unknown = JSON.parse(data);
      if (!Array.isArray(cacheData)) {
        return;
      }

      // Restore cache
      const now = Date.now();
      const maxAge = this.options.maxAge;
      let loadedCount = 0;
      let prunedCount = 0;

      for (const entry of cacheData) {
        if (!Array.isArray(entry) || entry.length !== 2) {
          continue;
        }

        const [url, chapter] = entry as [unknown, unknown];
        if (typeof url !== 'string' || !chapter || typeof chapter !== 'object') {
          continue;
        }

        const normalized = this.normalizeCachedChapter(chapter as CachedChapter, now);
        if (this.isExpired(normalized, now, maxAge)) {
          prunedCount++;
          continue;
        }

        this.persistentCache.set(url, normalized);
        loadedCount++;
        // Don't automatically load into memory cache to avoid bloat
      }

      if (prunedCount > 0) {
        console.log(`[CacheService] Pruned ${prunedCount} expired chapters from storage`);
      }

      console.log(`[CacheService] Loaded ${loadedCount} chapters from storage`);
      this.updateStats();
    } catch (error) {
      console.error('[CacheService] Failed to load from storage:', error);
    }
  }

  /**
   * Clear persistent storage
   */
  private clearPersistentStorage(): void {
    try {
      if (typeof GM_deleteValue !== 'undefined') {
        GM_deleteValue('mnr_cache');
      } else {
        localStorage.removeItem('mnr_cache');
      }
    } catch (error) {
      console.error('[CacheService] Failed to clear storage:', error);
    }
  }

  /**
   * Start auto-save timer
   */
  private startAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      return;
    }

    this.autoSaveTimer = window.setTimeout(async () => {
      try {
        await this.saveToStorage();
      } finally {
        this.autoSaveTimer = null;
        this.startAutoSave(); // Schedule next save
      }
    }, this.options.autoSaveInterval);
  }

  /**
   * Stop auto-save timer
   */
  private stopAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    const memStats = this.memoryManager.getStats();

    this.stats = {
      memoryEntries: memStats.totalEntries,
      persistentEntries: this.persistentCache.size,
      memorySize: memStats.totalSize,
      hitRate: memStats.hitRate,
    };
  }

  private normalizeCachedChapter(chapter: CachedChapter, now: number): CachedChapter {
    if (typeof chapter.cachedAt === 'number') {
      return chapter;
    }

    return {
      ...chapter,
      cachedAt: now,
    };
  }

  private isExpired(chapter: CachedChapter, now: number, maxAge: number): boolean {
    return now - chapter.cachedAt > maxAge;
  }

  /**
   * Destroy the cache service
   */
  destroy(): void {
    this.stopAutoSave();
    this.clear();
  }
}

/**
 * Global cache service instance
 */
let persistentCacheServiceInstance: CacheService | null = null;
let nonPersistentCacheServiceInstance: CacheService | null = null;

/**
 * Get the global CacheService instance
 *
 * @param options - Cache options
 * @returns CacheService instance
 */
export function getCacheService(options?: CacheStorageOptions): CacheService {
  const enablePersistent = options?.enablePersistent ?? true;

  if (enablePersistent) {
    if (!persistentCacheServiceInstance) {
      persistentCacheServiceInstance = new CacheService(options);
    } else if (options) {
      persistentCacheServiceInstance.updateOptions(options);
    }
    void persistentCacheServiceInstance.init();
    return persistentCacheServiceInstance;
  }

  if (!nonPersistentCacheServiceInstance) {
    nonPersistentCacheServiceInstance = new CacheService({
      ...(options ?? {}),
      enablePersistent: false,
    });
  } else if (options) {
    nonPersistentCacheServiceInstance.updateOptions({ ...options, enablePersistent: false });
  }

  return nonPersistentCacheServiceInstance;
}

/**
 * Get the global CacheService instance after it has loaded persistent data.
 *
 * Prefer this in async flows where the persistent cache must be ready before first use.
 */
export async function getCacheServiceAsync(options?: CacheStorageOptions): Promise<CacheService> {
  const service = getCacheService(options);
  await service.init();
  return service;
}

/**
 * Convenience function to add a chapter to cache
 *
 * @param url - Chapter URL
 * @param chapter - Chapter data
 */
export function cacheChapter(url: string, chapter: CachedChapter): void {
  const service = getCacheService();
  service.addChapter(url, chapter);
}

/**
 * Convenience function to get a chapter from cache
 *
 * @param url - Chapter URL
 * @returns Cached chapter or undefined
 */
export function getCachedChapter(url: string): CachedChapter | undefined {
  const service = getCacheService();
  return service.getChapter(url);
}
