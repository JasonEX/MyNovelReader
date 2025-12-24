/**
 * Parallel Chapter Loader for Performance Optimization
 *
 * Provides concurrent chapter loading with controlled concurrency (sliding window),
 * randomized jitter delays, timeout handling, adaptive backoff, and automatic retry logic.
 *
 * @module ParallelLoader
 */

import { getParser, type ParsedChapter } from '@/core/parser';
import { fetchAndParseUrl } from '@/core/utils/network';

/** Configuration for parallel loading */
export interface ParallelLoadOptions {
  /** Maximum concurrent requests (default: 1) - reduced for safety */
  maxConcurrent?: number;
  /** Request timeout in milliseconds (default: 15000) */
  timeout?: number;
  /** Number of retries for failed requests (default: 3) */
  retries?: number;
  /** Base delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
  /** Minimum delay between requests in milliseconds (default: 3000) */
  minDelay?: number;
  /** Maximum delay between requests in milliseconds (default: 5000) */
  maxDelay?: number;
  /** Signal to abort loading */
  signal?: AbortSignal;
  /** Callback for progress updates */
  onProgress?: (completed: number, total: number) => void;
  /** Dependency injection for fetcher (primarily for testing) */
  fetcher?: (url: string) => Promise<ParsedChapter | null>;
}

/** Result of a chapter loading attempt */
export interface ChapterLoadResult {
  url: string;
  chapter: ParsedChapter | null;
  success: boolean;
  error?: string;
  fromCache?: boolean;
}

/**
 * Parallel chapter loader with sliding window concurrency and jitter
 *
 * @example
 * ```typescript
 * const loader = new ParallelLoader();
 * const results = await loader.loadChapters(
 *   ['url1', 'url2', 'url3'],
 *   { maxConcurrent: 2, minDelay: 3000, maxDelay: 5000 }
 * );
 * ```
 */
export class ParallelLoader {
  private readonly defaultOptions: Required<Omit<ParallelLoadOptions, 'signal' | 'fetcher'>> = {
    maxConcurrent: 1, // Safer default to avoid anti-crawler triggers
    timeout: 15000,
    retries: 3,
    retryDelay: 1000,
    minDelay: 3000,
    maxDelay: 5000,
    onProgress: () => {},
  };

  /**
   * Load multiple chapters concurrently with sliding window
   *
   * @param urls - Array of chapter URLs to load
   * @param options - Loading options
   * @returns Promise resolving to array of load results
   */
  async loadChapters(
    urls: string[],
    options: ParallelLoadOptions = {}
  ): Promise<ChapterLoadResult[]> {
    const config = { ...this.defaultOptions, ...options };
    const normalizeDelay = (value: unknown, fallback: number): number => {
      if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
      return Math.max(0, value);
    };
    config.maxConcurrent = Math.max(1, config.maxConcurrent);
    config.minDelay = normalizeDelay(config.minDelay, this.defaultOptions.minDelay);
    config.maxDelay = normalizeDelay(config.maxDelay, this.defaultOptions.maxDelay);
    if (config.minDelay > config.maxDelay) {
      [config.minDelay, config.maxDelay] = [config.maxDelay, config.minDelay];
    }
    const total = urls.length;
    let completedCount = 0;
    const results: Array<ChapterLoadResult | undefined> = new Array(total);

    if (total === 0) return [];

    if (config.signal?.aborted) {
      return urls.map(url => ({
        url,
        chapter: null,
        success: false,
        error: 'Request aborted',
      }));
    }

    let currentIndex = 0;
    let activeCount = 0;
    let hasAborted = false;
    const activeAborters = new Set<() => void>();
    let startGate: Promise<void> = Promise.resolve();

    const registerAbort = (abort: () => void): (() => void) => {
      activeAborters.add(abort);
      return () => {
        activeAborters.delete(abort);
      };
    };

    // Listen for abort
    let abortListener: (() => void) | null = null;
    if (config.signal) {
      abortListener = () => {
        hasAborted = true;
        for (const abort of activeAborters) {
          try {
            abort();
          } catch (e) {
            console.warn('[ParallelLoader] Failed to abort request:', e);
          }
        }
      };
      config.signal.addEventListener('abort', abortListener);
    }

    return new Promise<ChapterLoadResult[]>(resolve => {
      const finalize = () => {
        if (abortListener && config.signal) {
          config.signal.removeEventListener('abort', abortListener);
          abortListener = null;
        }

        // Fill unprocessed entries (typically due to abort) to avoid leaking `undefined` to callers.
        for (let i = 0; i < total; i++) {
          if (results[i]) continue;
          results[i] = {
            url: urls[i],
            chapter: null,
            success: false,
            error: hasAborted ? 'Request aborted' : 'Unknown error',
          };
        }

        resolve(results as ChapterLoadResult[]);
      };

      // Helper to process next item
      const next = () => {
        if (hasAborted) {
          // If aborted, wait for active requests to drain then resolve what we have
          if (activeCount === 0) finalize();
          return;
        }

        if (currentIndex >= total) {
          if (activeCount === 0) finalize();
          return;
        }

        // Start new requests up to maxConcurrent
        while (activeCount < config.maxConcurrent && currentIndex < total && !hasAborted) {
          const index = currentIndex++;
          const url = urls[index];
          activeCount++;

          // Apply jitter delay before starting request (except for the very first batch).
          // Use a shared gate to ensure delayed starts don't bunch up when concurrency > 1.
          const delayBeforeStart =
            index < config.maxConcurrent
              ? 0
              : this.getRandomDelay(config.minDelay, config.maxDelay);

          const startTask = async (): Promise<ChapterLoadResult | null> => {
            if (delayBeforeStart > 0) {
              const gate = startGate.then(() => this.delay(delayBeforeStart, config.signal));
              startGate = gate;
              await gate;
            }

            if (hasAborted || config.signal?.aborted) {
              return null;
            }

            return await this.processUrl(url, { ...config, registerAbort });
          };

          startTask()
            .then(result => {
              if (!result) return;
              if (config.signal?.aborted) return;

              results[index] = result;
              completedCount++;
              if (config.onProgress) config.onProgress(completedCount, total);
            })
            .catch(err => {
              console.error(`[ParallelLoader] Critical error processing ${url}:`, err);
              results[index] = {
                url,
                chapter: null,
                success: false,
                error: String(err),
              };
              completedCount++;
              if (config.onProgress) config.onProgress(completedCount, total);
            })
            .finally(() => {
              activeCount--;
              next();
            });
        }
      };

      // Kick off
      next();
    });
  }

  /**
   * Process a single URL with retries and timeout
   */
  private async processUrl(
    url: string,
    config: Required<Omit<ParallelLoadOptions, 'signal' | 'fetcher'>> & {
      fetcher?: ParallelLoadOptions['fetcher'];
      signal?: AbortSignal;
      registerAbort?: (abort: () => void) => () => void;
    }
  ): Promise<ChapterLoadResult> {
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      if (config.signal?.aborted) {
        return {
          url,
          chapter: null,
          success: false,
          error: 'Request aborted',
        };
      }

      try {
        // Add exponential backoff delay for retries
        if (attempt > 0) {
          const backoff = config.retryDelay * Math.pow(2, attempt - 1);
          // Add some jitter to backoff
          const jitter = backoff * 0.2 * Math.random();
          await this.delay(backoff + jitter, config.signal);
          if (config.signal?.aborted) {
            return {
              url,
              chapter: null,
              success: false,
              error: 'Request aborted',
            };
          }
        }

        const chapter = await this.loadChapterWithTimeout(
          url,
          config.timeout,
          config.fetcher,
          config.signal,
          config.registerAbort
        );

        if (chapter) {
          return { url, chapter, success: true };
        } else {
          lastError = 'Failed to parse chapter content';
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        if (config.signal?.aborted || lastError === 'Request aborted') {
          return {
            url,
            chapter: null,
            success: false,
            error: 'Request aborted',
          };
        }
      }
    }

    return {
      url,
      chapter: null,
      success: false,
      error: lastError || 'Unknown error',
    };
  }

  /**
   * Load a single chapter with timeout protection
   */
  private async loadChapterWithTimeout(
    url: string,
    timeout: number,
    customFetcher?: ParallelLoadOptions['fetcher'],
    signal?: AbortSignal,
    registerAbort?: (abort: () => void) => () => void
  ): Promise<ParsedChapter | null> {
    // Custom fetchers (primarily used in tests) are not guaranteed to be abortable.
    if (customFetcher) {
      return new Promise<ParsedChapter | null>((resolve, reject) => {
        if (signal?.aborted) {
          reject(new Error('Request aborted'));
          return;
        }

        let settled = false;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const onAbort = () => {
          if (settled) return;
          settled = true;
          if (timer) clearTimeout(timer);
          reject(new Error('Request aborted'));
        };
        signal?.addEventListener('abort', onAbort, { once: true });

        timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          signal?.removeEventListener('abort', onAbort);
          reject(new Error('Request timed out'));
        }, timeout);

        customFetcher(url)
          .then(result => {
            if (settled) return;
            settled = true;
            if (timer) clearTimeout(timer);
            signal?.removeEventListener('abort', onAbort);
            resolve(result);
          })
          .catch(err => {
            if (settled) return;
            settled = true;
            if (timer) clearTimeout(timer);
            signal?.removeEventListener('abort', onAbort);
            reject(err);
          });
      });
    }

    const { promise, abort } = this.createDefaultFetchTask(url, timeout);
    let hasAborted = false;
    const safeAbort = () => {
      if (hasAborted) return;
      hasAborted = true;
      abort();
    };

    const unregisterAbort = registerAbort?.(safeAbort);

    return new Promise<ParsedChapter | null>((resolve, reject) => {
      if (signal?.aborted) {
        unregisterAbort?.();
        safeAbort();
        reject(new Error('Request aborted'));
        return;
      }

      let settled = false;
      const onAbort = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        safeAbort();
        unregisterAbort?.();
        reject(new Error('Request aborted'));
      };

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        signal?.removeEventListener('abort', onAbort);
        safeAbort();
        unregisterAbort?.();
        reject(new Error('Request timed out'));
      }, timeout);

      signal?.addEventListener('abort', onAbort, { once: true });

      promise
        .then(result => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          signal?.removeEventListener('abort', onAbort);
          unregisterAbort?.();
          resolve(result);
        })
        .catch(err => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          signal?.removeEventListener('abort', onAbort);
          unregisterAbort?.();
          reject(err);
        });
    });
  }

  /**
   * Default fetcher using the core parser (abortable).
   */
  private createDefaultFetchTask(
    url: string,
    timeout: number
  ): { promise: Promise<ParsedChapter | null>; abort: () => void } {
    const normalizedUrl = this.normalizeUrl(url);
    const { promise: fetchPromise, abort } = fetchAndParseUrl(normalizedUrl, undefined, {
      timeoutMs: timeout,
      retries: 0,
    });

    const promise = (async (): Promise<ParsedChapter | null> => {
      const result = await fetchPromise;

      if (!result.doc) {
        if (result.error === 'timeout') {
          throw new Error('Request timed out');
        }
        if (result.error === 'abort') {
          throw new Error('Request aborted');
        }
        throw new Error(`Failed to fetch content: ${result.error || 'unknown error'}`);
      }

      const parser = getParser();
      const parsed = await parser.parse(result.doc, normalizedUrl);

      if (!parsed || !parsed.content) {
        throw new Error('Failed to parse chapter content');
      }

      return parsed;
    })();

    return { promise, abort };
  }

  /**
   * Normalize URL for fetching
   */
  private normalizeUrl(url: string): string {
    try {
      const u = new URL(url);
      u.hash = '';
      return u.toString();
    } catch {
      return url.replace(/#.*$/, '');
    }
  }

  /**
   * Get a random delay between min and max
   */
  private getRandomDelay(min: number, max: number): number {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return 0;

    const normalizedMin = Math.min(min, max);
    const normalizedMax = Math.max(min, max);
    return Math.floor(Math.random() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
  }

  /**
   * Create a delay promise
   */
  private delay(ms: number, signal?: AbortSignal): Promise<void> {
    if (!signal) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (signal.aborted) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(timer);
        resolve();
      };
      signal.addEventListener('abort', onAbort, { once: true });
    });
  }
}

/**
 * Create a singleton instance for use throughout the app
 */
let loaderInstance: ParallelLoader | null = null;

/**
 * Get the singleton ParallelLoader instance
 *
 * @param options - Default options for the loader (only applied on first create)
 * @returns ParallelLoader instance
 */
export function getParallelLoader(_options?: ParallelLoadOptions): ParallelLoader {
  if (!loaderInstance) {
    loaderInstance = new ParallelLoader();
  }
  return loaderInstance;
}

/**
 * Convenience function to load chapters with default settings
 */
export async function loadChapters(
  urls: string[],
  options?: ParallelLoadOptions
): Promise<ParsedChapter[]> {
  const loader = getParallelLoader();
  const results = await loader.loadChapters(urls, options);

  // Filter successful results and extract chapters
  return results
    .filter(result => result.success && result.chapter !== null)
    .map(result => result.chapter!);
}
