import { type ConversionMode, convertHTML, convertText } from '@/core/converter';
import { getParserExtensions } from '@/core/parser/ParserExtensions';
import type { ParsedChapter } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';

import {
  detectTocPage,
  isInvalidChapterUrl,
  normalizeUrlForBlock,
  normalizeUrlForFetch,
} from './utils';

/** Load direction */
export type LoadDirection = 'next' | 'prev';

/** Load source */
export type LoadSource = 'auto' | 'manual';

/** Chapter entry for display */
export interface ChapterEntry {
  chapter: ParsedChapter;
  rule?: SiteRule;
  id: string;
}

/** Cached chapter */
export interface CachedChapter {
  chapter: ParsedChapter;
  rule?: SiteRule;
  cachedAt: number;
}

export interface ChapterCacheStore {
  get: (url: string) => CachedChapter | undefined;
  has: (url: string) => boolean;
  set: (url: string, val: CachedChapter) => void;
  delete: (url: string) => void;
  clear: () => void;
}

/** Chapter load options */
export interface ChapterLoadOptions {
  /** Maximum cached chapters to keep in memory */
  maxCachedChapters?: number;
  /** VIP block toast message */
  vipBlockToast?: string;
  /** End message for navigation */
  endMessages?: {
    next?: string;
    prev?: string;
  };
  /** Error messages */
  errorMessages?: {
    next?: string;
    prev?: string;
  };
}

/**
 * Chapter Loader - handles loading chapters with validation and section merging
 */
export class ChapterLoader {
  private readonly maxCachedChapters: number;
  private readonly vipBlockToast: string;
  private readonly endMessages: { next: string; prev: string };
  private readonly errorMessages: { next: string; prev: string };

  // Loading state refs (managed externally via context)
  private isLoadingNext = false;
  private isLoadingPrev = false;

  constructor(options: ChapterLoadOptions = {}) {
    this.maxCachedChapters = options.maxCachedChapters ?? 8;
    this.vipBlockToast = options.vipBlockToast ?? '该章节为VIP/付费内容，无法加载';
    this.endMessages = {
      next: options.endMessages?.next ?? '已经是最后一章了',
      prev: options.endMessages?.prev ?? '已经是第一章了',
    };
    this.errorMessages = {
      next: options.errorMessages?.next ?? '加载下一章失败',
      prev: options.errorMessages?.prev ?? '加载上一章失败',
    };
  }

  /**
   * Check if currently loading in a direction
   */
  isLoading(direction: LoadDirection): boolean {
    return direction === 'next' ? this.isLoadingNext : this.isLoadingPrev;
  }

  /**
   * Set loading state for a direction
   */
  setLoading(direction: LoadDirection, loading: boolean): void {
    if (direction === 'next') {
      this.isLoadingNext = loading;
    } else {
      this.isLoadingPrev = loading;
    }
  }

  /**
   * Load a chapter in the specified direction
   *
   * @param direction - Direction to load ('next' or 'prev')
   * @param source - Source of the load ('auto' or 'manual')
   * @param context - Loading context
   * @returns Promise resolving to true if successful
   */
  async loadChapter(
    direction: LoadDirection,
    source: LoadSource,
    context: ChapterLoaderContext
  ): Promise<boolean> {
    const isNext = direction === 'next';
    const pendingAbortRef = isNext ? context.pendingNextAbort : context.pendingPrevAbort;
    const endMessage = isNext ? this.endMessages.next : this.endMessages.prev;
    const errorMessage = isNext ? this.errorMessages.next : this.errorMessages.prev;
    const refChapter = isNext ? context.chapters[context.chapters.length - 1] : context.chapters[0];
    const isLoadingRef = isNext ? this.isLoadingNext : this.isLoadingPrev;

    if (isLoadingRef) {
      return false;
    }

    const rawTargetUrl = isNext ? refChapter?.chapter.nextUrl : refChapter?.chapter.prevUrl;
    if (!rawTargetUrl) {
      if (source === 'manual') {
        context.showToast(endMessage, 'info');
      }
      return false;
    }

    const targetUrl = normalizeUrlForFetch(rawTargetUrl);
    if (targetUrl !== rawTargetUrl) {
      if (isNext) {
        refChapter.chapter.nextUrl = targetUrl;
      } else {
        refChapter.chapter.prevUrl = targetUrl;
      }
    }

    // Don't load if targetUrl is the index/TOC page
    if (
      refChapter.chapter.indexUrl &&
      context.normalizeUrl(targetUrl) === context.normalizeUrl(refChapter.chapter.indexUrl)
    ) {
      context.blockedNavUrls.add(normalizeUrlForBlock(targetUrl));
      if (source === 'manual') {
        context.showToast(endMessage, 'info');
      }
      return false;
    }

    // Don't load VIP chapters
    if (context.vipBlockedUrls.has(normalizeUrlForBlock(targetUrl))) {
      context.showToast(this.vipBlockToast, 'info', 3000);
      return false;
    }

    const navKey = normalizeUrlForBlock(targetUrl);
    if (context.blockedNavUrls.has(navKey)) {
      if (source === 'manual') {
        context.showToast(endMessage, 'info');
      }
      return false;
    }

    const failure = context.navFailures.get(navKey);
    if (failure && Date.now() < failure.nextRetryAt) {
      if (source === 'manual') {
        context.showToast('加载失败过于频繁，请稍后重试', 'info', 2000);
      }
      return false;
    }

    // Prefer cached content if available
    const cached = context.cachedContents.get(targetUrl);
    if (cached) {
      return context.insertCachedChapter(cached, isNext ? 'append' : 'prepend');
    }
    if (context.loadedUrls.has(targetUrl)) {
      return false;
    }

    this.setLoading(direction, true);

    // Cancel in-flight request
    if (pendingAbortRef.value) {
      pendingAbortRef.value();
      pendingAbortRef.value = null;
    }

    // Pre-fetch validation
    if (isInvalidChapterUrl(targetUrl, refChapter.chapter.url)) {
      this.setLoading(direction, false);
      context.blockedNavUrls.add(navKey);
      if (source === 'manual') {
        context.showToast(endMessage, 'info');
      }
      return false;
    }

    const abortController = new AbortController();
    pendingAbortRef.value = () => abortController.abort();

    try {
      const referer = refChapter.chapter.url;

      // Use ParserExtensions for fetching and merging
      const parserExt = getParserExtensions();

      const parsed = await parserExt.fetchAndParseChapter(
        targetUrl,
        referer,
        abortController.signal
      );

      if (!parsed) {
        if (abortController.signal.aborted) {
          return false;
        }
        this.handleNavFailure(navKey, source, errorMessage, context);
        return false;
      }

      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

      // Check if this is a TOC page
      const isTocPage = detectTocPage(parsed.content, targetUrl, refChapter.chapter.url);
      if (isTocPage) {
        context.blockedNavUrls.add(navKey);
        if (source === 'manual') {
          context.showToast(endMessage, 'info');
        }
        return false;
      }

      // Additional validation for prev
      if (!isNext) {
        if (
          parsed.nextUrl &&
          context.normalizeUrl(parsed.nextUrl) === context.normalizeUrl(refChapter.chapter.url)
        ) {
          // This is fine
        } else if (parsed.prevUrl && !parsed.nextUrl) {
          context.blockedNavUrls.add(navKey);
          return false;
        }
      }

      // Add to chapters list
      return this.addChapter(parsed, isNext, source, context);
    } catch (e) {
      console.error(`[MNR] Failed to load ${direction} chapter:`, e);
      context.setError(errorMessage);
      return false;
    } finally {
      pendingAbortRef.value = null;
      this.setLoading(direction, false);
    }
  }

  /**
   * Add a parsed chapter to the chapters list
   */
  private addChapter(
    parsed: ParsedChapter,
    isNext: boolean,
    _source: LoadSource,
    context: ChapterLoaderContext
  ): boolean {
    const id = `chapter-${Date.now()}-${isNext ? '' : 'prev-'}${context.chapters.length}`;
    const entry: ChapterEntry = {
      chapter: parsed,
      rule: parsed.rule,
      id,
    };

    if (isNext) {
      context.chapters.push(entry);
    } else {
      context.chapters.unshift(entry);
      context.currentChapterIndex.value++;
    }

    const navKey = normalizeUrlForBlock(parsed.url);
    context.navFailures.delete(navKey);
    context.loadedUrls.add(parsed.url);

    context.originalContents.set(id, parsed.content);
    context.originalTitles.set(id, { title: parsed.title, bookTitle: parsed.bookTitle });

    context.cachedContents.set(parsed.url, {
      chapter: parsed,
      rule: parsed.rule,
      cachedAt: Date.now(),
    });

    if (context.currentConversionMode !== 'none') {
      this.applyConversionToChapterEntry(
        id,
        parsed.content,
        context.currentConversionMode,
        context
      );
    }

    context.addToHistory(parsed.url, isNext);
    this.trimCachedChapters(isNext, context);

    return true;
  }

  /**
   * Apply text conversion to a chapter entry
   */
  private async applyConversionToChapterEntry(
    id: string,
    _content: string,
    mode: ConversionMode,
    context: ChapterLoaderContext
  ): Promise<void> {
    const entry = context.chapters.find(c => c.id === id);
    if (!entry) return;

    const originalContent = context.originalContents.get(id);
    const originalTitle = context.originalTitles.get(id);
    if (!originalContent || !originalTitle) return;

    try {
      if (mode === 't2s' || mode === 't2sc') {
        entry.chapter.content = convertText(originalContent, mode);
      } else if (mode === 's2t' || mode === 's2tc') {
        entry.chapter.content = convertHTML(originalContent, mode);
      }
    } catch (e) {
      console.error('[MNR] Conversion error:', e);
    }
  }

  /**
   * Trim cached chapters to stay within memory limit
   */
  private trimCachedChapters(isNext: boolean, context: ChapterLoaderContext): void {
    if (context.chapters.length > this.maxCachedChapters) {
      if (isNext && context.currentChapterIndex.value > 2) {
        const removed = context.chapters.shift();
        if (removed) {
          context.loadedUrls.delete(removed.chapter.url);
          context.originalContents.delete(removed.id);
          context.originalTitles.delete(removed.id);
          context.currentChapterIndex.value = Math.max(0, context.currentChapterIndex.value - 1);
        }
      } else if (!isNext) {
        const removed = context.chapters.pop();
        if (removed) {
          context.loadedUrls.delete(removed.chapter.url);
          context.originalContents.delete(removed.id);
          context.originalTitles.delete(removed.id);
        }
      }
    }
  }

  /**
   * Handle navigation failure with retry tracking
   */
  private handleNavFailure(
    navKey: string,
    source: LoadSource,
    errorMessage: string,
    context: ChapterLoaderContext
  ): void {
    const prev = context.navFailures.get(navKey);
    const count = (prev?.count || 0) + 1;
    const backoffMs = Math.min(1500 * Math.pow(2, count - 1), 30000);
    context.navFailures.set(navKey, { count, nextRetryAt: Date.now() + backoffMs });
    if (source === 'manual' || count === 1) {
      context.showToast(errorMessage, 'error', 2500);
    }
  }

  destroy(): void {
    this.isLoadingNext = false;
    this.isLoadingPrev = false;
  }
}

/**
 * Context for chapter loading operations
 */
export interface ChapterLoaderContext {
  chapters: ChapterEntry[];
  currentChapterIndex: {
    value: number;
  };
  cachedContents: ChapterCacheStore;
  loadedUrls: Set<string>;
  vipBlockedUrls: Set<string>;
  blockedNavUrls: Set<string>;
  originalContents: Map<string, string>;
  originalTitles: Map<string, { title: string; bookTitle?: string }>;
  currentConversionMode: ConversionMode;
  navFailures: Map<string, { count: number; nextRetryAt: number }>;
  pendingNextAbort: {
    value: (() => void) | null;
  };
  pendingPrevAbort: {
    value: (() => void) | null;
  };
  normalizeUrl: (url: string) => string;
  showToast: (message: string, type: 'info' | 'error', duration?: number) => void;
  addToHistory: (url: string, isNext: boolean) => void;
  setError: (message: string | null) => void;
  insertCachedChapter: (cached: CachedChapter, position: 'append' | 'prepend') => Promise<boolean>;
}

export function createChapterLoader(options?: ChapterLoadOptions): ChapterLoader {
  return new ChapterLoader(options);
}
