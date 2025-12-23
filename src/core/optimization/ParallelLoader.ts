/**
 * Parallel Chapter Loader for Performance Optimization
 *
 * Provides concurrent chapter loading with controlled concurrency (sliding window),
 * randomized jitter delays, timeout handling, adaptive backoff, and automatic retry logic.
 *
 * @module ParallelLoader
 */

import { getParser } from '@/core/parser';
import type { ParsedChapter } from '@/core/parser';

/** Configuration for parallel loading */
export interface ParallelLoadOptions {
  /** Maximum concurrent requests (default: 2) - reduced for safety */
  maxConcurrent?: number;
  /** Request timeout in milliseconds (default: 15000) */
  timeout?: number;
  /** Number of retries for failed requests (default: 3) */
  retries?: number;
  /** Base delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;
  /** Minimum delay between requests in milliseconds (default: 500) */
  minDelay?: number;
  /** Maximum delay between requests in milliseconds (default: 1500) */
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
 *   { maxConcurrent: 2, minDelay: 500, maxDelay: 1500 }
 * );
 * ```
 */
export class ParallelLoader {
  private readonly defaultOptions: Required<Omit<ParallelLoadOptions, 'signal' | 'fetcher'>> = {
    maxConcurrent: 2, // Conservative default
    timeout: 15000,
    retries: 3,
    retryDelay: 1000,
    minDelay: 500,
    maxDelay: 1500,
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
    const total = urls.length;
    let completedCount = 0;
    const results: ChapterLoadResult[] = new Array(total);

    if (total === 0) return [];

    let currentIndex = 0;
    let activeCount = 0;
    let hasAborted = false;

    // Listen for abort
    if (config.signal) {
      if (config.signal.aborted) return [];
      config.signal.addEventListener('abort', () => {
        hasAborted = true;
      });
    }

    return new Promise<ChapterLoadResult[]>(resolve => {
      // Helper to process next item
      const next = () => {
        if (hasAborted) {
          // If aborted, wait for active requests to drain then resolve what we have
          if (activeCount === 0) resolve(results);
          return;
        }

        if (currentIndex >= total) {
          if (activeCount === 0) resolve(results);
          return;
        }

        // Start new requests up to maxConcurrent
        while (activeCount < config.maxConcurrent && currentIndex < total && !hasAborted) {
          const index = currentIndex++;
          const url = urls[index];
          activeCount++;

          // Apply jitter delay before starting request (except for the very first batch)
          const delay =
            index < config.maxConcurrent
              ? 0
              : this.getRandomDelay(config.minDelay, config.maxDelay);

          this.processUrl(url, config)
            .then(result => {
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
              // Wait for delay then process next
              if (delay > 0) {
                setTimeout(next, delay);
              } else {
                next();
              }
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
    }
  ): Promise<ChapterLoadResult> {
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      try {
        // Add exponential backoff delay for retries
        if (attempt > 0) {
          const backoff = config.retryDelay * Math.pow(2, attempt - 1);
          // Add some jitter to backoff
          const jitter = backoff * 0.2 * Math.random();
          await this.delay(backoff + jitter);
        }

        const chapter = await this.loadChapterWithTimeout(url, config.timeout, config.fetcher);

        if (chapter) {
          return { url, chapter, success: true };
        } else {
          lastError = 'Failed to parse chapter content';
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
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
    customFetcher?: ParallelLoadOptions['fetcher']
  ): Promise<ParsedChapter | null> {
    return new Promise<ParsedChapter | null>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      const fetcher = customFetcher || this.defaultFetcher.bind(this);

      fetcher(url)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  /**
   * Default fetcher using the core parser
   */
  private async defaultFetcher(url: string): Promise<ParsedChapter | null> {
    const parser = getParser();
    const normalizedUrl = this.normalizeUrl(url);
    const result = await parser.parseUrl(normalizedUrl);

    if (!result || !result.content) {
      throw new Error('Empty content received');
    }

    return result;
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
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Create a delay promise
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
