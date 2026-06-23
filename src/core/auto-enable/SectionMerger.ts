/**
 * Section Merger Module
 *
 * Handles merging of multi-page chapters (sections) into single chapters.
 * Extracted from AutoEnableManager to eliminate code duplication.
 *
 * @module SectionMerger
 */

import { CHAPTER_TEXT_PATTERNS, SECTION_TEXT_PATTERNS } from '@/core/constants';
import { getSectionBaseUrl, isSectionLikeUrl, joinHtml, normalizeAbsoluteUrl } from '@/core/utils';
import type { ParsedChapter, Parser } from '@/core/parser';
import { fetchAndParseUrl } from '@/core/utils/network';

/** Section detection result */
export interface SectionInfo {
  isSection: boolean;
  nextSectionUrl: string | null;
  nextChapterUrl: string | null;
  confidence: number;
}

/** Section merge options */
export interface SectionMergeOptions {
  /** Maximum pages to merge (default: 10) */
  maxPages?: number;
  /** Confidence threshold for auto-detection (default: 0.8) */
  confidenceThreshold?: number;
  /** Signal to abort fetching/merging */
  signal?: AbortSignal;
  /** Custom fetcher function */
  fetcher?: (url: string, referrer: string) => Promise<Document | null>;
}

/**
 * Section Merger - combines multi-page chapters
 *
 * @example
 * ```typescript
 * const merger = new SectionMerger(parser);
 * const merged = await merger.merge(doc, url);
 * ```
 */
export class SectionMerger {
  constructor(private parser: Parser) {}

  /**
   * Parse and potentially merge multiple section pages
   *
   * @param doc - Starting document
   * @param url - Starting URL
   * @param options - Merge options
   * @returns Parsed chapter with merged content
   */
  async merge(
    doc: Document,
    url: string,
    options: SectionMergeOptions = {}
  ): Promise<ParsedChapter | null> {
    const maxPages = Math.max(1, options.maxPages ?? 10);
    const confidenceThreshold = options.confidenceThreshold ?? 0.8;

    // Get base URL if this is a section page (e.g. normalize ..._2.html to ..._1.html)
    const baseUrl = getSectionBaseUrl(url);
    let startUrl = url;
    let startDoc = doc;

    // If user opens a later section page, normalize to the first page
    if (baseUrl && baseUrl !== url) {
      const baseDoc = await this.fetchUrl(baseUrl, url, options.fetcher, options.signal);
      if (baseDoc) {
        startUrl = baseUrl;
        startDoc = baseDoc;
      }
    }

    // Parse first page
    const first = await this.parser.parse(startDoc, startUrl);
    if (!first) return null;

    // Check if section merge is disabled by rule
    const disableByRule = !!first.rule?.advanced?.noSection;
    if (disableByRule) return first;

    // Check if section merge is enabled by rule or auto-detection
    const enableByRule = !!first.rule?.advanced?.checkSection;
    const detection = this.parser.detect(startDoc, startUrl);
    const section = detection.results.section as SectionInfo | undefined;
    const hasNextSectionUrl = !!section?.isSection && !!section?.nextSectionUrl;
    const shouldMerge =
      enableByRule || (!!section?.isSection && (section?.confidence || 0) >= confidenceThreshold);

    if (!shouldMerge) {
      // Try to resolve to real next chapter if nextUrl is section-like.
      // If auto-detection already thinks this is a section page and provides nextSectionUrl,
      // keep the section-like nextUrl to avoid accidentally skipping remaining pages.
      if (!hasNextSectionUrl && first.nextUrl && isSectionLikeUrl(startUrl, first.nextUrl)) {
        const realNextChapterUrl = this.findNextChapterUrl(startDoc, startUrl);
        if (realNextChapterUrl) {
          first.nextUrl = realNextChapterUrl;
        }
      }
      return first;
    }

    // Merge sections
    const sectionDelayMs = options.fetcher
      ? 0
      : Math.max(0, first.rule?.advanced?.sectionDelayMs ?? 0);
    return this.mergeSections(
      startUrl,
      first,
      section,
      maxPages,
      sectionDelayMs,
      options.fetcher,
      options.signal
    );
  }

  /**
   * Merge multiple section pages into one chapter
   */
  private async mergeSections(
    startUrl: string,
    first: ParsedChapter,
    section: SectionInfo | undefined,
    maxPages: number,
    sectionDelayMs: number,
    fetcher?: SectionMergeOptions['fetcher'],
    signal?: AbortSignal
  ): Promise<ParsedChapter> {
    let mergedContent = first.content;
    let mergedRaw = first.rawContent;
    let nextSectionUrl = section?.nextSectionUrl || null;
    let nextChapterUrl: string | null = section?.nextChapterUrl || null;
    let lastUrl = startUrl;

    // If auto-detection didn't find nextSectionUrl, fall back to parsed nextUrl
    if (!nextSectionUrl && first.nextUrl && isSectionLikeUrl(startUrl, first.nextUrl)) {
      nextSectionUrl = first.nextUrl;
    }

    // The first page is already parsed into `first`; only merge the remaining pages.
    const maxAdditionalPages = Math.max(0, maxPages - 1);

    // Merge up to maxPages to avoid infinite loops
    const seen = new Set<string>([startUrl]);
    for (let i = 0; i < maxAdditionalPages && nextSectionUrl; i++) {
      if (signal?.aborted) break;

      const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
      if (seen.has(absNextSection)) break;
      seen.add(absNextSection);

      if (sectionDelayMs > 0) {
        await this.sleep(sectionDelayMs, signal);
        if (signal?.aborted) break;
      }

      const nextDoc = await this.fetchUrl(absNextSection, lastUrl, fetcher, signal);
      if (!nextDoc) break;

      const nextParsed = await this.parser.parse(nextDoc, absNextSection);
      if (!nextParsed) break;

      // Merge content
      mergedContent = joinHtml(mergedContent, nextParsed.content);
      mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);

      // Update navigation URLs
      const nextDet = this.parser.detect(nextDoc, absNextSection);
      const s = nextDet.results.section as SectionInfo | undefined;
      if (s?.nextChapterUrl) nextChapterUrl = s.nextChapterUrl;

      // Determine next section URL
      nextSectionUrl = s?.nextSectionUrl || null;
      if (!nextSectionUrl && nextParsed.nextUrl) {
        if (isSectionLikeUrl(absNextSection, nextParsed.nextUrl)) {
          nextSectionUrl = nextParsed.nextUrl;
        } else if (!nextChapterUrl) {
          nextChapterUrl = nextParsed.nextUrl;
        }
      }

      lastUrl = absNextSection;
    }

    return {
      ...first,
      url: startUrl,
      content: mergedContent,
      rawContent: mergedRaw,
      nextUrl: nextChapterUrl || first.nextUrl,
    };
  }

  private async sleep(ms: number, signal?: AbortSignal): Promise<void> {
    if (ms <= 0 || signal?.aborted) return;

    await new Promise<void>(resolve => {
      const timer = globalThis.setTimeout(resolve, ms);
      if (!signal) return;

      signal.addEventListener(
        'abort',
        () => {
          globalThis.clearTimeout(timer);
          resolve();
        },
        { once: true }
      );
    });
  }

  /**
   * Internal fetch helper
   */
  private async fetchUrl(
    url: string,
    referrer: string,
    customFetcher?: SectionMergeOptions['fetcher'],
    signal?: AbortSignal
  ): Promise<Document | null> {
    if (signal?.aborted) {
      return null;
    }

    if (customFetcher) {
      return await customFetcher(url, referrer);
    }

    const { promise, abort } = fetchAndParseUrl(url, referrer);
    if (!signal) {
      const result = await promise;
      return result.doc;
    }

    if (signal.aborted) {
      abort();
      return null;
    }

    let abortListener: (() => void) | null = null;
    const abortPromise = new Promise<Awaited<typeof promise>>(resolve => {
      abortListener = () => {
        abort();
        resolve({ doc: null, status: null, finalUrl: null, error: 'abort' });
      };
      signal.addEventListener('abort', abortListener, { once: true });
    });

    try {
      const result = await Promise.race([promise, abortPromise]);
      return result.doc;
    } finally {
      if (abortListener) {
        signal.removeEventListener('abort', abortListener);
      }
    }
  }

  /**
   * Find the real next chapter URL (not section URL)
   */
  private findNextChapterUrl(doc: Document, currentUrl: string): string | null {
    const links = doc.querySelectorAll('a[href]');

    const candidates: Array<{ url: string; score: number }> = [];

    for (const link of links) {
      const anchor = link as HTMLAnchorElement;
      const href = anchor.getAttribute('href');
      if (!href) continue;

      const absUrl = normalizeAbsoluteUrl(href, currentUrl);
      if (absUrl === currentUrl || isSectionLikeUrl(currentUrl, absUrl)) continue;

      const text = anchor.textContent?.trim() || '';
      if (!text) continue;

      const normalizedText = text.replace(/\s+/g, '').trim();
      if (!normalizedText) continue;

      const lowerText = normalizedText.toLowerCase();

      // Forward-only hints. Keep it conservative: this is used to skip remaining section pages.
      const isForward =
        /下一/.test(normalizedText) ||
        /下[章节篇话]/.test(normalizedText) ||
        /后一章/.test(normalizedText) ||
        /继续阅读/.test(normalizedText) ||
        /next/i.test(normalizedText);
      if (!isForward) continue;

      const isChapterText = CHAPTER_TEXT_PATTERNS.some(p => p.test(text));
      const isSectionText =
        SECTION_TEXT_PATTERNS.some(p => p.test(text)) ||
        (lowerText.includes('next') &&
          lowerText.includes('page') &&
          !lowerText.includes('chapter'));
      const isEnglishNextChapter = lowerText.includes('next') && lowerText.includes('chapter');

      // Skip pagination links like "下一页/next page".
      if (isSectionText && !isChapterText && !isEnglishNextChapter) continue;

      let score = 0;
      if (isChapterText) score += 50;
      if (isEnglishNextChapter) score += 45;
      if (lowerText === 'next' || lowerText === '>' || lowerText === '»') score += 10;
      if (lowerText.includes('next')) score += 2;
      if (normalizedText.length <= 5) score += 1;

      const rel = (anchor.getAttribute('rel') || '').toLowerCase();
      if (rel.includes('next')) score += 2;

      if (score > 0) {
        candidates.push({ url: absUrl, score });
      }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].url;
  }
}

/**
 * Create a section merger instance
 */
export function createSectionMerger(parser: Parser): SectionMerger {
  return new SectionMerger(parser);
}
