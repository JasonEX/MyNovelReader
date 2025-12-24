/**
 * Parser Extensions - Enhanced functionality for Parser
 *
 * Adds parallel loading, batch processing, and automatic section merging
 * to the core Parser.
 *
 * @module ParserExtensions
 */

import { fetchAndParseUrl, normalizeUrlForFetch } from '@/core/utils/network';
import { getParser, type ParsedChapter } from './Parser';
import { ParallelLoader, type ParallelLoadOptions } from '@/core/optimization/ParallelLoader';
import { createSectionMerger } from '@/core/auto-enable/SectionMerger';

/**
 * Batch parse result with metadata
 */
export interface BatchParseResult {
  /** Successfully parsed chapters */
  chapters: ParsedChapter[];
  /** Failed URLs with error messages */
  failures: Array<{ url: string; error: string }>;
  /** Total processing time in milliseconds */
  processingTime: number;
  /** Success rate (0-1) */
  successRate: number;
}

/**
 * Parser Extensions - adds parallel loading and batch processing
 */
export class ParserExtensions {
  private parser = getParser();
  private parallelLoader = new ParallelLoader();
  private sectionMerger = createSectionMerger(this.parser);

  /**
   * Fetch, parse and automatically merge sections for a single chapter
   *
   * @param url - The URL to fetch and parse
   * @param referer - Optional referer for the request
   * @param signal - Optional abort signal
   * @returns ParsedChapter or null if failed
   */
  async fetchAndParseChapter(
    url: string,
    referer?: string,
    signal?: AbortSignal
  ): Promise<ParsedChapter | null> {
    try {
      const normalizedUrl = normalizeUrlForFetch(url);
      const currentUrl = normalizeUrlForFetch(window.location.href);
      const normalizedReferer = referer ? normalizeUrlForFetch(referer) : undefined;

      // If caller asks for current page, avoid an extra request.
      if (normalizedUrl === currentUrl) {
        return await this.sectionMerger.merge(document, currentUrl, {
          maxPages: 10,
          confidenceThreshold: 0.8,
          signal,
        });
      }

      // Fetch the target page first, then run merge on that document.
      const { promise, abort } = fetchAndParseUrl(normalizedUrl, normalizedReferer || currentUrl);

      const fetched = await new Promise<Awaited<typeof promise>>(resolve => {
        if (!signal) {
          promise.then(resolve);
          return;
        }

        if (signal.aborted) {
          abort();
          resolve({ doc: null, status: null, finalUrl: null, error: 'abort' });
          return;
        }

        let abortListener: (() => void) | null = null;
        const abortPromise = new Promise<Awaited<typeof promise>>(abortResolve => {
          abortListener = () => {
            abort();
            abortResolve({ doc: null, status: null, finalUrl: null, error: 'abort' });
          };
          signal.addEventListener('abort', abortListener, { once: true });
        });

        Promise.race([promise, abortPromise])
          .then(resolve)
          .finally(() => {
            if (abortListener) {
              signal.removeEventListener('abort', abortListener);
            }
          });
      });
      if (!fetched.doc) return null;

      const startUrl = normalizeUrlForFetch(fetched.finalUrl || normalizedUrl);

      return await this.sectionMerger.merge(fetched.doc, startUrl, {
        maxPages: 10,
        confidenceThreshold: 0.8,
        signal,
      });
    } catch (e) {
      if (signal?.aborted) return null;
      console.error('[ParserExtensions] Failed to fetch and parse chapter:', e);
      return null;
    }
  }

  /**
   * Parse multiple chapters in parallel with section merging
   *
   * @param urls - Array of chapter URLs to parse
   * @param options - Parallel loading options
   * @returns Promise resolving to batch parse result
   */
  async parseBatch(urls: string[], options?: ParallelLoadOptions): Promise<BatchParseResult> {
    const startTime = Date.now();

    // Use parallel loader with a specialized fetcher that handles section merging
    const results = await this.parallelLoader.loadChapters(urls, {
      ...options,
      fetcher: async url => {
        // For batch loading, we want each item to be a fully merged chapter
        return await this.fetchAndParseChapter(url, undefined, options?.signal);
      },
    });

    const chapters: ParsedChapter[] = [];
    const failures: Array<{ url: string; error: string }> = [];

    for (const result of results) {
      if (result.success && result.chapter) {
        chapters.push(result.chapter);
      } else {
        failures.push({
          url: result.url,
          error: result.error || 'Unknown error',
        });
      }
    }

    const processingTime = Date.now() - startTime;
    const successRate = urls.length > 0 ? chapters.length / urls.length : 0;

    return {
      chapters,
      failures,
      processingTime,
      successRate,
    };
  }

  /**
   * Parse chapters with progressive loading (generator)
   */
  async *parseProgressive(
    urls: string[],
    options?: ParallelLoadOptions,
    onProgress?: (current: number, total: number, chapter: ParsedChapter | null) => void
  ): AsyncGenerator<ParsedChapter> {
    const total = urls.length;
    let completed = 0;

    // We use loadChapters directly but handle results as they come via a queue or small batches
    // To keep it simple and truly parallel, we'll use the parallelLoader's onProgress

    const results = await this.parallelLoader.loadChapters(urls, {
      ...options,
      fetcher: async url => await this.fetchAndParseChapter(url, undefined, options?.signal),
      onProgress: (_done, _totalCount) => {
        // This only tells us something finished, not WHICH one
      },
    });

    for (const result of results) {
      completed++;
      if (onProgress) {
        onProgress(completed, total, result.chapter);
      }
      if (result.success && result.chapter) {
        yield result.chapter;
      }
    }
  }

  /**
   * Prefetch chapters into MemoryManager
   */
  async prefetch(urls: string[], maxConcurrent: number = 1): Promise<void> {
    // ParallelLoader will use fetchAndParseChapter which merges sections
    await this.parallelLoader.loadChapters(urls, {
      maxConcurrent,
      timeout: 10000,
      retries: 1,
      fetcher: async url => await this.fetchAndParseChapter(url),
    });
  }
}

/**
 * Global parser extensions instance
 */
let extensionsInstance: ParserExtensions | null = null;

/**
 * Get the global ParserExtensions instance
 */
export function getParserExtensions(): ParserExtensions {
  if (!extensionsInstance) {
    extensionsInstance = new ParserExtensions();
  }
  return extensionsInstance;
}

/**
 * Convenience function to batch parse URLs
 */
export async function parseBatch(
  urls: string[],
  options?: ParallelLoadOptions
): Promise<BatchParseResult> {
  return getParserExtensions().parseBatch(urls, options);
}
