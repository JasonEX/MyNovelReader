/**
 * TOC Manager Module
 *
 * Handles table of contents loading and management.
 *
 * @module TOCManager
 */

import { getParser } from '@/core/parser';

import { fetchAndParseUrl, normalizeUrlForFetch } from './utils';
import type { TocEntry } from './types';

/**
 * TOC Manager - handles TOC loading and management
 */
export class TOCManager {
  private loading = false;
  private abort: (() => void) | null = null;

  /**
   * Check if currently loading TOC
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Get abort controller
   */
  getAbortController(): (() => void) | null {
    return this.abort;
  }

  /**
   * Set abort controller
   */
  setAbortController(abort: (() => void) | null): void {
    this.abort = abort;
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  /**
   * Load TOC entries from an index page
   *
   * @param indexUrl - URL of the index page
   * @param currentUrl - Current chapter URL (for reference)
   * @returns Promise resolving to array of TOC entries
   */
  async loadTocEntries(
    indexUrl: string,
    currentUrl: string,
    setAbort: (abort: () => void) => void
  ): Promise<TocEntry[]> {
    this.loading = true;

    try {
      const { promise, abort } = fetchAndParseUrl(indexUrl, currentUrl);
      setAbort(abort);
      this.abort = abort;

      const result = await promise;
      this.abort = null;

      if (!result.doc) {
        return [];
      }

      const parser = getParser();
      const toc = await parser.parseToc(result.doc, indexUrl);

      return toc || [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * Filter and deduplicate TOC entries
   *
   * @param toc - Array of TOC entries
   * @param loadedUrls - Set of already loaded URLs
   * @returns Filtered and deduplicated TOC entries
   */
  filterToc(toc: TocEntry[], loadedUrls: Set<string>): TocEntry[] {
    // Deduplicate based on URL
    const seen = new Set<string>();
    const filtered: TocEntry[] = [];

    for (const entry of toc) {
      const normalizedUrl = normalizeUrlForFetch(entry.url);
      if (seen.has(normalizedUrl)) continue;
      seen.add(normalizedUrl);

      // Skip already loaded URLs
      if (!loadedUrls.has(normalizedUrl)) {
        filtered.push(entry);
      }
    }

    return filtered;
  }

  /**
   * Sort TOC entries by chapter number
   *
   * @param toc - Array of TOC entries
   * @returns Sorted TOC entries
   */
  sortToc(toc: TocEntry[]): TocEntry[] {
    return toc.slice().sort((a, b) => {
      // Try to extract chapter numbers and sort numerically
      const aNum = this.extractChapterNumber(a.title);
      const bNum = this.extractChapterNumber(b.title);

      if (aNum !== null && bNum !== null) {
        return aNum - bNum;
      }

      // Fall back to string comparison
      return a.title.localeCompare(b.title, 'zh-CN');
    });
  }

  /**
   * Extract chapter number from title
   */
  private extractChapterNumber(title: string): number | null {
    // Match patterns like "第123章", "Chapter 123", "123. Chapter Title"
    const patterns = [/第(\d+)章/, /第(\d+)节/, /chapter\s*(\d+)/i, /^(\d+)[\s.、]/, /(\d+)$/];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return null;
  }

  /**
   * Find current chapter index in TOC
   *
   * @param toc - Array of TOC entries
   * @param currentUrl - Current chapter URL
   * @returns Index of current chapter in TOC, or -1 if not found
   */
  findCurrentChapter(toc: TocEntry[], currentUrl: string): number {
    const normalizedCurrent = normalizeUrlForFetch(currentUrl);
    return toc.findIndex(entry => normalizeUrlForFetch(entry.url) === normalizedCurrent);
  }

  /**
   * Get next batch of TOC entries
   *
   * @param toc - Array of TOC entries
   * @param currentIndex - Current chapter index
   * @param count - Number of entries to return
   * @returns Next batch of TOC entries
   */
  getNextBatch(toc: TocEntry[], currentIndex: number, count: number = 100): TocEntry[] {
    const start = currentIndex + 1;
    return toc.slice(start, start + count);
  }

  /**
   * Get previous batch of TOC entries
   *
   * @param toc - Array of TOC entries
   * @param currentIndex - Current chapter index
   * @param count - Number of entries to return
   * @returns Previous batch of TOC entries
   */
  getPrevBatch(toc: TocEntry[], currentIndex: number, count: number = 100): TocEntry[] {
    const start = Math.max(0, currentIndex - count);
    return toc.slice(start, currentIndex);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.abort) {
      this.abort();
      this.abort = null;
    }
  }
}
