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
import { resolveQidianMobileBookPreviewChapterUrl } from '@/core/rules/sites/qidian';

/** Section detection result */
interface SectionInfo {
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

interface StartPageState {
  doc: Document;
  url: string;
  knownDocs: Map<string, Document>;
}

type SectionMergeState =
  | { kind: 'done'; chapter: ParsedChapter }
  | {
      kind: 'merge';
      nextSectionUrl: string | null;
      nextChapterUrl: string | null;
      sectionDelayMs: number;
    };

interface MergeCursor {
  startUrl: string;
  lastUrl: string;
  mergedContent: string;
  mergedRaw: string;
  nextSectionUrl: string | null;
  nextChapterUrl: string | null;
  seen: Set<string>;
  remainingPages: number;
}

interface LoadedSectionPage {
  doc: Document;
  url: string;
  fromCache: boolean;
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

    if (options.signal?.aborted) return null;

    const qidianBookPreviewUrl = resolveQidianMobileBookPreviewChapterUrl(doc, url);
    if (qidianBookPreviewUrl) {
      const previewChapter = await this.parser.parse(doc, qidianBookPreviewUrl);
      if (previewChapter) return previewChapter;
    }

    const startPage = await this.resolveStartPage(doc, url, options);
    if (!startPage) return null;

    const first = await this.parser.parse(startPage.doc, startPage.url);
    if (!first) return null;

    const state = this.decideSectionMerge(startPage, first, confidenceThreshold, !!options.fetcher);
    if (state.kind === 'done') return state.chapter;

    return this.mergeSections(startPage, first, state, maxPages, options.fetcher, options.signal);
  }

  private async resolveStartPage(
    doc: Document,
    url: string,
    options: SectionMergeOptions
  ): Promise<StartPageState | null> {
    if (options.signal?.aborted) return null;

    let startUrl = url;
    let startDoc = doc;
    const knownDocs = new Map<string, Document>([[normalizeAbsoluteUrl(url, url), doc]]);
    const baseUrl = getSectionBaseUrl(url);

    if (baseUrl && baseUrl !== url) {
      const baseDoc = await this.fetchUrl(baseUrl, url, options.fetcher, options.signal);
      if (options.signal?.aborted) return null;
      if (baseDoc) {
        startUrl = baseUrl;
        startDoc = baseDoc;
        knownDocs.set(normalizeAbsoluteUrl(baseUrl, url), baseDoc);
      }
    }

    return { doc: startDoc, url: startUrl, knownDocs };
  }

  private decideSectionMerge(
    startPage: StartPageState,
    first: ParsedChapter,
    confidenceThreshold: number,
    hasCustomFetcher: boolean
  ): SectionMergeState {
    if (first.rule?.advanced?.noSection) return { kind: 'done', chapter: first };

    const enableByRule = !!first.rule?.advanced?.checkSection;
    const section = this.parser.detectSection(startPage.doc, startPage.url) as
      SectionInfo | undefined;
    const hasNextSectionUrl = !!section?.isSection && !!section.nextSectionUrl;
    const shouldMerge =
      enableByRule || (!!section?.isSection && (section.confidence || 0) >= confidenceThreshold);

    if (!shouldMerge) {
      if (!hasNextSectionUrl && first.nextUrl && isSectionLikeUrl(startPage.url, first.nextUrl)) {
        const realNextChapterUrl = this.findNextChapterUrl(startPage.doc, startPage.url);
        if (realNextChapterUrl) {
          return { kind: 'done', chapter: { ...first, nextUrl: realNextChapterUrl } };
        }
      }
      return { kind: 'done', chapter: first };
    }

    const nextSectionUrl =
      section?.nextSectionUrl ||
      (first.nextUrl && isSectionLikeUrl(startPage.url, first.nextUrl) ? first.nextUrl : null);

    return {
      kind: 'merge',
      nextSectionUrl,
      nextChapterUrl: section?.nextChapterUrl || null,
      sectionDelayMs: hasCustomFetcher ? 0 : Math.max(0, first.rule?.advanced?.sectionDelayMs ?? 0),
    };
  }

  /**
   * Merge multiple section pages into one chapter
   */
  private async mergeSections(
    startPage: StartPageState,
    first: ParsedChapter,
    state: Extract<SectionMergeState, { kind: 'merge' }>,
    maxPages: number,
    fetcher?: SectionMergeOptions['fetcher'],
    signal?: AbortSignal
  ): Promise<ParsedChapter> {
    const cursor = this.createMergeCursor(startPage, first, state, maxPages);

    while (cursor.remainingPages > 0 && cursor.nextSectionUrl) {
      if (signal?.aborted) break;

      if (state.sectionDelayMs > 0) {
        await this.sleep(state.sectionDelayMs, signal);
        if (signal?.aborted) break;
      }

      const page = await this.loadNextSectionPage(cursor, startPage.knownDocs, fetcher, signal);
      if (!page) break;

      const nextParsed = await this.parseLoadedSection(
        page,
        cursor.lastUrl,
        startPage.knownDocs,
        fetcher,
        signal
      );
      if (!nextParsed) break;

      const section = this.parser.detectSection(page.doc, page.url) as SectionInfo | undefined;
      this.advanceMergeCursor(cursor, page.url, nextParsed, section);
      cursor.remainingPages -= 1;
    }

    return this.buildMergedChapter(first, cursor);
  }

  private createMergeCursor(
    startPage: StartPageState,
    first: ParsedChapter,
    state: Extract<SectionMergeState, { kind: 'merge' }>,
    maxPages: number
  ): MergeCursor {
    return {
      startUrl: startPage.url,
      lastUrl: startPage.url,
      mergedContent: first.content,
      mergedRaw: first.rawContent,
      nextSectionUrl: state.nextSectionUrl,
      nextChapterUrl: state.nextChapterUrl,
      seen: new Set([normalizeAbsoluteUrl(startPage.url, startPage.url)]),
      remainingPages: Math.max(0, maxPages - 1),
    };
  }

  private async loadNextSectionPage(
    cursor: MergeCursor,
    knownDocs: Map<string, Document>,
    fetcher?: SectionMergeOptions['fetcher'],
    signal?: AbortSignal
  ): Promise<LoadedSectionPage | null> {
    if (signal?.aborted || !cursor.nextSectionUrl) return null;

    const url = normalizeAbsoluteUrl(cursor.nextSectionUrl, cursor.lastUrl);
    if (cursor.seen.has(url)) return null;
    cursor.seen.add(url);

    const cachedDoc = knownDocs.get(url) ?? null;
    if (cachedDoc) {
      return { doc: cachedDoc, url, fromCache: true };
    }

    const doc = await this.fetchUrl(url, cursor.lastUrl, fetcher, signal);
    if (!doc) return null;

    knownDocs.set(url, doc);
    return { doc, url, fromCache: false };
  }

  private async parseLoadedSection(
    page: LoadedSectionPage,
    referrer: string,
    knownDocs: Map<string, Document>,
    fetcher?: SectionMergeOptions['fetcher'],
    signal?: AbortSignal
  ): Promise<ParsedChapter | null> {
    let parsed = await this.parser.parse(page.doc, page.url);
    if (parsed || !page.fromCache || signal?.aborted) return parsed;

    const doc = await this.fetchUrl(page.url, referrer, fetcher, signal);
    if (!doc) return null;

    knownDocs.set(page.url, doc);
    parsed = await this.parser.parse(doc, page.url);
    return parsed;
  }

  private advanceMergeCursor(
    cursor: MergeCursor,
    pageUrl: string,
    parsed: ParsedChapter,
    section: SectionInfo | undefined
  ): void {
    cursor.mergedContent = joinHtml(cursor.mergedContent, parsed.content);
    cursor.mergedRaw = joinHtml(cursor.mergedRaw, parsed.rawContent);

    if (section?.nextChapterUrl) cursor.nextChapterUrl = section.nextChapterUrl;

    cursor.nextSectionUrl = section?.nextSectionUrl || null;
    if (!cursor.nextSectionUrl && parsed.nextUrl) {
      if (isSectionLikeUrl(pageUrl, parsed.nextUrl)) {
        cursor.nextSectionUrl = parsed.nextUrl;
      } else if (!cursor.nextChapterUrl) {
        cursor.nextChapterUrl = parsed.nextUrl;
      }
    }

    cursor.lastUrl = pageUrl;
  }

  private buildMergedChapter(first: ParsedChapter, cursor: MergeCursor): ParsedChapter {
    return {
      ...first,
      url: cursor.startUrl,
      content: cursor.mergedContent,
      rawContent: cursor.mergedRaw,
      nextUrl: cursor.nextChapterUrl || first.nextUrl,
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
