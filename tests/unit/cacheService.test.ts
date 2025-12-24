import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CacheService, getCacheService } from '../../src/core/cache/CacheService';

describe('CacheService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should not auto-save before persistent cache load completes', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const initialCache = [
      [
        'url1',
        {
          chapter: { title: 't', content: 'c', url: 'url1', prevUrl: '', nextUrl: '' },
          cachedAt: Date.now(),
        },
      ],
    ];
    localStorage.setItem('mnr_cache', JSON.stringify(initialCache));

    const originalLoad = CacheService.prototype.loadFromStorage;
    vi.spyOn(CacheService.prototype, 'loadFromStorage').mockImplementation(async function (
      key?: string
    ) {
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      return originalLoad.call(this, key);
    });

    // Very short auto-save interval; if auto-save starts before load finishes, it can overwrite storage.
    const service = new CacheService({ enablePersistent: true, autoSaveInterval: 10 });

    // Before the mocked load completes, storage should remain intact.
    await vi.advanceTimersByTimeAsync(20);
    const early = localStorage.getItem('mnr_cache');
    expect(early).not.toBeNull();
    expect(JSON.parse(early!)).toHaveLength(1);

    // After load completes and auto-save runs, storage should still not be empty.
    await vi.advanceTimersByTimeAsync(1015);
    const late = localStorage.getItem('mnr_cache');
    expect(late).not.toBeNull();
    expect(JSON.parse(late!)).toHaveLength(1);

    service.destroy();
  });

  it('should prune expired persistent entries on load', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const now = Date.now();
    const initialCache = [
      [
        'url1',
        {
          chapter: { title: 't', content: 'c', url: 'url1', prevUrl: '', nextUrl: '' },
          cachedAt: now - 2000,
        },
      ],
      [
        'url2',
        {
          chapter: { title: 't', content: 'c', url: 'url2', prevUrl: '', nextUrl: '' },
          cachedAt: now,
        },
      ],
    ];
    localStorage.setItem('mnr_cache', JSON.stringify(initialCache));

    const service = new CacheService({
      enablePersistent: true,
      autoSaveInterval: 1000000,
      maxAge: 1000,
    });
    await service.init();

    expect(service.getChapter('url1')).toBeUndefined();
    expect(service.getChapter('url2')).toBeDefined();
    expect(service.getStatistics().persistentEntries).toBe(1);

    service.destroy();
  });

  it('should prune expired entries before saving to storage', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const service = new CacheService({
      enablePersistent: true,
      autoSaveInterval: 1000000,
      maxAge: 1000,
    });
    await service.init();

    service.addChapter('url1', {
      chapter: { title: 't', content: 'c', url: 'url1', prevUrl: '', nextUrl: '' },
      cachedAt: Date.now(),
    });

    await service.saveToStorage();
    expect(JSON.parse(localStorage.getItem('mnr_cache')!)).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(2000);
    await service.saveToStorage();
    expect(JSON.parse(localStorage.getItem('mnr_cache')!)).toHaveLength(0);

    service.destroy();
  });

  it('getCacheService should return distinct instances for persistent/non-persistent modes', () => {
    const persistent = getCacheService({ enablePersistent: true, autoSaveInterval: 1000000 });
    const nonPersistent = getCacheService({ enablePersistent: false });

    expect(nonPersistent).not.toBe(persistent);

    persistent.destroy();
    nonPersistent.destroy();
  });

  it('getCacheService should apply updated options on subsequent calls', async () => {
    const service = getCacheService({ enablePersistent: false, maxAge: 5 });

    service.addChapter('url1', {
      chapter: { title: 't', content: 'c', url: 'url1', prevUrl: '', nextUrl: '' },
      cachedAt: Date.now(),
    });

    await vi.advanceTimersByTimeAsync(10);

    const updated = getCacheService({ enablePersistent: false, maxAge: 1000 });
    expect(updated).toBe(service);
    expect(updated.getChapter('url1')).toBeDefined();

    updated.destroy();
  });
});
