/**
 * Cache module exports
 *
 * Provides enhanced caching services with memory management
 * and persistent storage
 */

export {
  CacheService,
  getCacheService,
  getCacheServiceAsync,
  cacheChapter,
  getCachedChapter,
} from './CacheService';

export type { CacheStorageOptions, CacheStatistics } from './CacheService';
