/**
 * Unit tests for MemoryManager
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { ChapterCacheManager, MemoryManager } from '@/core/optimization';
import type { CachedChapter } from '@/ui/stores/reader/types';

describe('MemoryManager', () => {
  let manager: MemoryManager<{ data: string }>;

  beforeEach(() => {
    manager = new MemoryManager({ maxSize: 1024, maxEntries: 5 });
  });

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      manager.set('key1', { data: 'value1' });
      const result = manager.get('key1');
      expect(result).toEqual({ data: 'value1' });
    });

    it('should update existing entries', () => {
      manager.set('key1', { data: 'value1' });
      manager.set('key1', { data: 'value2' });
      const result = manager.get('key1');
      expect(result).toEqual({ data: 'value2' });
    });

    it('should return undefined for non-existent keys', () => {
      const result = manager.get('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      manager.set('key1', { data: 'value1' });
      expect(manager.has('key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(manager.has('nonexistent')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should remove entries', () => {
      manager.set('key1', { data: 'value1' });
      const result = manager.delete('key1');
      expect(result).toBe(true);
      expect(manager.has('key1')).toBe(false);
    });

    it('should return false for non-existent keys', () => {
      const result = manager.delete('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      manager.set('key1', { data: 'value1' });
      manager.set('key2', { data: 'value2' });
      manager.clear();
      expect(manager.has('key1')).toBe(false);
      expect(manager.has('key2')).toBe(false);
    });
  });

  describe('size limits', () => {
    it('should enforce max entries limit', () => {
      const smallManager = new MemoryManager<{ data: string }>({
        maxSize: 10000,
        maxEntries: 3,
      });

      smallManager.set('key1', { data: 'a' });
      smallManager.set('key2', { data: 'b' });
      smallManager.set('key3', { data: 'c' });
      smallManager.set('key4', { data: 'd' });

      // Should evict oldest entry (key1)
      expect(smallManager.has('key1')).toBe(false);
      expect(smallManager.has('key4')).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      manager.set('key1', { data: 'a' });
      manager.set('key2', { data: 'b' });

      manager.get('key1'); // hit
      manager.get('key1'); // hit
      manager.get('nonexistent'); // miss

      const stats = manager.getStats();
      expect(stats.totalEntries).toBe(2);
      expect(stats.hitCount).toBe(2);
      expect(stats.missCount).toBe(1);
      expect(stats.hitRate).toBeCloseTo(0.667, 2);
    });
  });
});

describe('ChapterCacheManager', () => {
  let cache: ChapterCacheManager;

  beforeEach(() => {
    cache = new ChapterCacheManager({ maxSize: 1024, maxEntries: 5 });
  });

  describe('addChapter and getChapter', () => {
    it('should store and retrieve chapters', () => {
      const chapter: CachedChapter = {
        chapter: {
          title: 'Chapter 1',
          content: '<p>Content</p>',
          rawContent: '<p>Content</p>',
          url: 'https://example.com/1',
          confidence: 0.9,
          method: 'detection',
        },
        cachedAt: Date.now(),
      };

      cache.addChapter('url1', chapter);
      const result = cache.getChapter('url1');
      expect(result).toEqual(chapter);
    });

    it('should return undefined for non-existent chapters', () => {
      const result = cache.getChapter('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('hasChapter', () => {
    it('should return true for cached chapters', () => {
      const chapter: CachedChapter = {
        chapter: {
          title: 'Chapter 1',
          content: '<p>Content</p>',
          rawContent: '<p>Content</p>',
          url: 'https://example.com/1',
          confidence: 0.9,
          method: 'detection',
        },
        cachedAt: Date.now(),
      };

      cache.addChapter('url1', chapter);
      expect(cache.hasChapter('url1')).toBe(true);
    });
  });

  describe('getCachedUrls', () => {
    it('should return all cached URLs', () => {
      const chapter1: CachedChapter = {
        chapter: {
          title: 'Chapter 1',
          content: '<p>Content 1</p>',
          rawContent: '<p>Content 1</p>',
          url: 'https://example.com/1',
          confidence: 0.9,
          method: 'detection',
        },
        cachedAt: Date.now(),
      };

      const chapter2: CachedChapter = {
        chapter: {
          title: 'Chapter 2',
          content: '<p>Content 2</p>',
          rawContent: '<p>Content 2</p>',
          url: 'https://example.com/2',
          confidence: 0.9,
          method: 'detection',
        },
        cachedAt: Date.now(),
      };

      cache.addChapter('url1', chapter1);
      cache.addChapter('url2', chapter2);

      const urls = cache.getCachedUrls();
      expect(urls).toHaveLength(2);
      expect(urls).toContain('url1');
      expect(urls).toContain('url2');
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      const chapter: CachedChapter = {
        chapter: {
          title: 'Chapter 1',
          content: '<p>Content</p>',
          rawContent: '<p>Content</p>',
          url: 'https://example.com/1',
          confidence: 0.9,
          method: 'detection',
        },
        cachedAt: Date.now(),
      };

      cache.addChapter('url1', chapter);
      cache.getChapter('url1'); // hit
      cache.getChapter('url1'); // hit
      cache.getChapter('nonexistent'); // miss

      const stats = cache.getStats();
      expect(stats.totalEntries).toBe(1);
      expect(stats.hitCount).toBe(2);
      expect(stats.missCount).toBe(1);
    });
  });
});
