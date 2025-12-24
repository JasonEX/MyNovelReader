import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParallelLoader } from '../../src/core/optimization/ParallelLoader';
import type { ParsedChapter } from '../../src/core/parser';

describe('ParallelLoader', () => {
  let loader: ParallelLoader;

  beforeEach(() => {
    loader = new ParallelLoader();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const mockChapter = (url: string): ParsedChapter => ({
    title: `Chapter ${url}`,
    content: `Content for ${url}`,
    url,
    prevUrl: '',
    nextUrl: '',
  });

  it('should load single chapter successfully', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockChapter('http://example.com/1'));

    const loadPromise = loader.loadChapters(['http://example.com/1'], {
      fetcher,
      maxConcurrent: 1,
      minDelay: 0,
      maxDelay: 0,
    });

    // Fast-forward any internal delays (microtasks)
    await vi.runAllTimersAsync();
    const results = await loadPromise;

    expect(results).toHaveLength(1);
    expect(results[0].success).toBe(true);
    expect(results[0].chapter?.url).toBe('http://example.com/1');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should respect concurrency limits', async () => {
    let activeRequests = 0;
    let maxActive = 0;

    const fetcher = vi.fn().mockImplementation(async url => {
      activeRequests++;
      maxActive = Math.max(maxActive, activeRequests);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      activeRequests--;
      return mockChapter(url);
    });

    const urls = Array.from({ length: 5 }, (_, i) => `http://example.com/${i}`);

    const loadPromise = loader.loadChapters(urls, {
      fetcher,
      maxConcurrent: 2,
      minDelay: 10,
      maxDelay: 10,
    });

    // Advance time enough for all to complete (5 items, 2 concurrent, ~100ms each + delays)
    await vi.advanceTimersByTimeAsync(1000);
    const results = await loadPromise;

    expect(results).toHaveLength(5);
    expect(maxActive).toBeLessThanOrEqual(2);
    expect(fetcher).toHaveBeenCalledTimes(5);
  });

  it('should retry failed requests', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue(mockChapter('http://example.com/retry'));

    const loadPromise = loader.loadChapters(['http://example.com/retry'], {
      fetcher,
      retries: 3,
      retryDelay: 1000,
      minDelay: 0,
      maxDelay: 0,
    });

    // Advance time for retries (backoff: 1000, 2000...)
    // Need to advance multiple times or enough total time
    await vi.advanceTimersByTimeAsync(10000);

    const results = await loadPromise;

    expect(results[0].success).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it('should handle eventual failure after retries', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Persistent Fail'));

    const loadPromise = loader.loadChapters(['http://example.com/fail'], {
      fetcher,
      retries: 2,
      retryDelay: 100,
      minDelay: 0,
      maxDelay: 0,
    });

    // Advance time enough for initial + 2 retries
    await vi.advanceTimersByTimeAsync(5000);
    const results = await loadPromise;

    expect(results[0].success).toBe(false);
    expect(results[0].error).toContain('Persistent Fail');
    expect(fetcher).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should not start requests if aborted immediately', async () => {
    const controller = new AbortController();
    const fetcher = vi.fn().mockResolvedValue(mockChapter('url'));

    // Abort BEFORE calling loadChapters
    controller.abort();

    const results = await loader.loadChapters(['http://example.com/1'], {
      fetcher,
      signal: controller.signal,
    });

    expect(results).toHaveLength(1);
    expect(results[0].success).toBe(false);
    expect(results[0].error).toBe('Request aborted');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should stop new requests when aborted mid-flight', async () => {
    const controller = new AbortController();
    const fetcher = vi.fn().mockImplementation(async url => {
      // Long delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      return mockChapter(url);
    });

    // Start 3 tasks, maxConcurrent 1. Task 1 starts immediately.
    const loadPromise = loader.loadChapters(['1', '2', '3'], {
      fetcher,
      maxConcurrent: 1,
      signal: controller.signal,
    });

    // Abort shortly after start
    await vi.advanceTimersByTimeAsync(100);
    controller.abort();

    // Advance enough to finish the first (in-flight) request
    await vi.advanceTimersByTimeAsync(6000);

    const results = await loadPromise;

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(results).toHaveLength(3);
    expect(results.every(r => r.success === false)).toBe(true);
  });

  it('should apply jitter delays between requests', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockChapter('url'));
    const urls = ['url1', 'url2', 'url3'];

    const loadPromise = loader.loadChapters(urls, {
      fetcher,
      maxConcurrent: 1, // Serial
      minDelay: 100,
      maxDelay: 100, // Fixed delay
    });

    await vi.runAllTimersAsync();
    const results = await loadPromise;
    expect(results).toHaveLength(3);
  });

  it('should wait minDelay before starting subsequent requests', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockChapter('url'));

    const loadPromise = loader.loadChapters(['url1', 'url2'], {
      fetcher,
      maxConcurrent: 1,
      minDelay: 100,
      maxDelay: 100,
      retries: 0,
    });

    // First request starts immediately.
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Give promise chain a chance to schedule the next request with delay.
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }

    await vi.advanceTimersByTimeAsync(99);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }
    expect(fetcher).toHaveBeenCalledTimes(2);

    await vi.runAllTimersAsync();
    const results = await loadPromise;
    expect(results).toHaveLength(2);
  });

  it('should normalize misordered jitter bounds (minDelay > maxDelay)', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockChapter('url'));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const loadPromise = loader.loadChapters(['url1', 'url2'], {
      fetcher,
      maxConcurrent: 1,
      minDelay: 500,
      maxDelay: 100,
      retries: 0,
    });

    // First request starts immediately.
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Give promise chain a chance to schedule the next request with delay.
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }

    // Normalized delay is deterministic due to stubbed Math.random(): 300ms.
    await vi.advanceTimersByTimeAsync(299);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }
    expect(fetcher).toHaveBeenCalledTimes(2);

    await vi.runAllTimersAsync();
    const results = await loadPromise;
    expect(results).toHaveLength(2);
  });

  it('should report progress', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockChapter('url'));
    const onProgress = vi.fn();

    const loadPromise = loader.loadChapters(['url1', 'url2'], {
      fetcher,
      onProgress,
      minDelay: 0,
      maxDelay: 0,
    });

    await vi.runAllTimersAsync();
    await loadPromise;

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenLastCalledWith(2, 2);
  });
});
