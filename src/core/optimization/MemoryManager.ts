/**
 * Memory Manager for Cache Optimization
 *
 * Provides intelligent cache management with LRU eviction,
 * size-based limits, and memory-aware caching strategies.
 *
 * @module MemoryManager
 */

import type { CachedChapter } from '@/ui/stores/reader/types';

/** Cache entry with metadata for LRU tracking */
interface CacheEntry<T> {
  value: T;
  size: number;
  lastAccess: number;
  accessCount: number;
}

/** Configuration for memory manager */
export interface MemoryManagerOptions {
  /** Maximum cache size in bytes (default: 50MB) */
  maxSize?: number;
  /** Maximum number of entries (default: 100) */
  maxEntries?: number;
  /** Target usage percentage for eviction (default: 0.9) */
  evictionThreshold?: number;
  /** Enable size-based eviction (default: true) */
  sizeBasedEviction?: boolean;
}

/** Memory statistics */
export interface MemoryStats {
  totalEntries: number;
  totalSize: number;
  maxEntries: number;
  maxSize: number;
  usagePercentage: number;
  hitRate: number;
  missCount: number;
  hitCount: number;
}

/**
 * Memory-aware cache manager with LRU eviction
 *
 * @example
 * ```typescript
 * const manager = new MemoryManager({ maxSize: 50 * 1024 * 1024 });
 * manager.set('chapter1', chapterData);
 * const data = manager.get('chapter1');
 * const stats = manager.getStats();
 * ```
 */
export class MemoryManager<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly maxSize: number;
  private readonly maxEntries: number;
  private readonly evictionThreshold: number;
  private readonly sizeBasedEviction: boolean;

  // Statistics
  private hitCount = 0;
  private missCount = 0;

  constructor(options: MemoryManagerOptions = {}) {
    this.maxSize = options.maxSize ?? 50 * 1024 * 1024; // 50MB default
    this.maxEntries = options.maxEntries ?? 100;
    this.evictionThreshold = options.evictionThreshold ?? 0.9;
    this.sizeBasedEviction = options.sizeBasedEviction ?? true;
  }

  /**
   * Add or update an entry in the cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param size - Optional size override (in bytes)
   * @returns true if entry was added, false if evicted due to size
   */
  set(key: string, value: T, size?: number): boolean {
    const entrySize = size ?? this.calculateSize(value);

    // Check if single entry exceeds max size
    if (this.sizeBasedEviction && entrySize > this.maxSize) {
      console.warn(
        `[MemoryManager] Entry size (${entrySize}) exceeds max cache size (${this.maxSize})`
      );
      return false;
    }

    // Update existing entry
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      entry.value = value;
      entry.size = entrySize;
      entry.lastAccess = Date.now();
      entry.accessCount++;
      return true;
    }

    // Check if we need to evict entries
    this.ensureSpace(entrySize);

    // Add new entry
    const cacheEntry: CacheEntry<T> = {
      value,
      size: entrySize,
      lastAccess: Date.now(),
      accessCount: 1,
    };

    this.cache.set(key, cacheEntry);
    return true;
  }

  /**
   * Get an entry from the cache
   *
   * @param key - Cache key
   * @returns Cached value or undefined if not found
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return undefined;
    }

    // Update access statistics
    entry.lastAccess = Date.now();
    entry.accessCount++;
    this.hitCount++;

    return entry.value;
  }

  /**
   * Get a value without updating access statistics.
   *
   * @param key - Cache key
   * @returns Cached value or undefined if not found
   */
  peek(key: string): T | undefined {
    const entry = this.cache.get(key);
    return entry?.value;
  }

  /**
   * Check if a key exists in the cache
   *
   * @param key - Cache key
   * @returns true if key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Remove an entry from the cache
   *
   * @param key - Cache key
   * @returns true if entry was removed
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Get cache size statistics
   *
   * @returns Memory statistics
   */
  getStats(): MemoryStats {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }

    const totalAccess = this.hitCount + this.missCount;
    const hitRate = totalAccess > 0 ? this.hitCount / totalAccess : 0;

    return {
      totalEntries: this.cache.size,
      totalSize,
      maxEntries: this.maxEntries,
      maxSize: this.maxSize,
      usagePercentage: this.maxSize > 0 ? (totalSize / this.maxSize) * 100 : 0,
      hitRate,
      hitCount: this.hitCount,
      missCount: this.missCount,
    };
  }

  /**
   * Get all cache keys
   *
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size in bytes
   *
   * @returns Current cache size
   */
  getSize(): number {
    let size = 0;
    for (const entry of this.cache.values()) {
      size += entry.size;
    }
    return size;
  }

  /**
   * Ensure there's enough space for a new entry
   *
   * @param requiredSize - Size required for new entry
   */
  private ensureSpace(requiredSize: number): void {
    const currentSize = this.getSize();
    const projectedSize = currentSize + requiredSize;

    // Evict based on size limit
    if (this.sizeBasedEviction && projectedSize > this.maxSize * this.evictionThreshold) {
      this.evictBySize(projectedSize - this.maxSize * this.evictionThreshold);
    }

    // Evict based on entry count limit
    if (this.cache.size >= this.maxEntries) {
      this.evictByLRU(1);
    }
  }

  /**
   * Evict entries by LRU strategy
   *
   * @param count - Number of entries to evict
   */
  private evictByLRU(count: number): void {
    // Sort entries by last access time (oldest first)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccess - b.lastAccess
    );

    // Remove oldest entries
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Evict entries by size until target size is freed
   *
   * @param targetSize - Target size to free (in bytes)
   */
  private evictBySize(targetSize: number): void {
    let freedSize = 0;

    // Sort entries by access frequency and recency
    const entries = Array.from(this.cache.entries()).sort(([, a], [, b]) => {
      // Primary sort by access count (ascending)
      if (a.accessCount !== b.accessCount) {
        return a.accessCount - b.accessCount;
      }
      // Secondary sort by last access (ascending)
      return a.lastAccess - b.lastAccess;
    });

    // Remove entries until we've freed enough space
    for (const [key, entry] of entries) {
      if (freedSize >= targetSize) {
        break;
      }

      this.cache.delete(key);
      freedSize += entry.size;
    }
  }

  /**
   * Calculate approximate size of a value
   *
   * @param value - Value to calculate size for
   * @returns Approximate size in bytes
   */
  private calculateSize(value: T): number {
    if (value === null || value === undefined) {
      return 0;
    }

    try {
      // For objects, use JSON stringification as a rough estimate
      const str = JSON.stringify(value);
      // UTF-16 encoding uses 2 bytes per character
      return str.length * 2;
    } catch {
      // Fallback: estimate based on typeof
      switch (typeof value) {
        case 'string':
          return (value as string).length * 2;
        case 'number':
          return 8;
        case 'boolean':
          return 4;
        case 'object':
          return 100; // Rough estimate for objects
        default:
          return 50;
      }
    }
  }

  /**
   * Clean up old entries based on access time
   *
   * @param maxAge - Maximum age in milliseconds (default: 1 hour)
   */
  cleanupOldEntries(maxAge: number = 60 * 60 * 1000): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.lastAccess > maxAge) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }

    if (keysToDelete.length > 0) {
      console.log(`[MemoryManager] Cleaned up ${keysToDelete.length} old entries`);
    }
  }

  /**
   * Optimize cache by removing least accessed entries
   *
   * @param keepPercentage - Percentage of entries to keep (default: 0.8)
   */
  optimize(keepPercentage: number = 0.8): void {
    const entries = Array.from(this.cache.entries());
    const targetCount = Math.floor(entries.length * keepPercentage);

    if (entries.length <= targetCount) {
      return; // No optimization needed
    }

    // Sort by access count and recency, keep top entries
    entries.sort(([, a], [, b]) => {
      if (a.accessCount !== b.accessCount) {
        return b.accessCount - a.accessCount; // Descending
      }
      return b.lastAccess - a.lastAccess; // Descending
    });

    // Remove least accessed entries
    for (let i = targetCount; i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }

    console.log(`[MemoryManager] Optimized: removed ${entries.length - targetCount} entries`);
  }
}

/**
 * Chapter cache manager specialized for ParsedChapter objects
 */
export class ChapterCacheManager {
  private manager: MemoryManager<CachedChapter>;

  constructor(options?: MemoryManagerOptions) {
    // Default options optimized for chapters
    this.manager = new MemoryManager<CachedChapter>({
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 100,
      ...options,
    });
  }

  /**
   * Add a chapter to the cache
   *
   * @param url - Chapter URL as key
   * @param chapter - Cached chapter data
   */
  addChapter(url: string, chapter: CachedChapter): void {
    this.manager.set(url, chapter);
  }

  /**
   * Get a chapter from the cache
   *
   * @param url - Chapter URL
   * @returns Cached chapter or undefined
   */
  getChapter(url: string): CachedChapter | undefined {
    return this.manager.get(url);
  }

  /**
   * Peek a chapter without updating access stats.
   *
   * @param url - Chapter URL
   * @returns Cached chapter or undefined
   */
  peekChapter(url: string): CachedChapter | undefined {
    return this.manager.peek(url);
  }

  /**
   * Check if a chapter is cached
   *
   * @param url - Chapter URL
   * @returns true if chapter is in cache
   */
  hasChapter(url: string): boolean {
    return this.manager.has(url);
  }

  /**
   * Remove a chapter from cache
   *
   * @param url - Chapter URL
   */
  removeChapter(url: string): void {
    this.manager.delete(url);
  }

  /**
   * Clear all cached chapters
   */
  clear(): void {
    this.manager.clear();
  }

  /**
   * Get cache statistics
   *
   * @returns Cache statistics
   */
  getStats(): MemoryStats {
    return this.manager.getStats();
  }

  /**
   * Get all cached chapter URLs
   *
   * @returns Array of cached URLs
   */
  getCachedUrls(): string[] {
    return this.manager.keys();
  }

  /**
   * Optimize cache by removing least accessed chapters
   */
  optimize(): void {
    this.manager.optimize();
  }

  /**
   * Clean up old chapters
   */
  cleanup(maxAge?: number): void {
    this.manager.cleanupOldEntries(maxAge);
  }
}

/**
 * Singleton instance for global use
 */
let cacheManagerInstance: ChapterCacheManager | null = null;

/**
 * Get the singleton ChapterCacheManager instance
 *
 * @param options - Options for the cache manager
 * @returns ChapterCacheManager instance
 */
export function getChapterCacheManager(options?: MemoryManagerOptions): ChapterCacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new ChapterCacheManager(options);
  }
  return cacheManagerInstance;
}
