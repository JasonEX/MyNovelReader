/**
 * Reader Store - Chapter Navigation
 * Coordinates chapter loading, cache rebuilds, and reload actions.
 */

import type { CachedChapter, LoadSource } from './types';
import { clearNavFailure, recordNavFailure } from './navFailure';
import {
  clearPendingAbort,
  loadDocumentInIframe,
  loadFetchDocument,
  parseCandidateDocument,
} from './chapterFetch';
import { getParser, type ParsedChapter } from '@/core/parser';
import {
  insertCachedChapter,
  insertParsedChapter,
  rebuildChaptersFromCache,
} from './chapterListMutations';
import { MAX_NAV_FAILURES, MAX_SESSION_CACHE } from './types';
import { normalizeUrl, normalizeUrlForFetch } from './utils';
import { prepareChapterLoad, validateTargetChapterUrl } from './chapterLoadGuards';
import { convertHTML } from '@/core/converter';
import { detectTocPage } from './detection';
import { fetchAndParseUrl } from '@/core/utils/network';
import type { NavigationContext } from './navigationContext';
import { parseWithSectionMerge } from './section';
import { shouldPersistNavigationBlock } from './navigationPolicy';
import { trimCachedContents } from './trim';

// ============ Factory ============

export function createNavigation(ctx: NavigationContext) {
  /** Unified chapter loading function */
  async function loadChapter(direction: 'next' | 'prev', source: LoadSource): Promise<boolean> {
    const runId = ctx.runtime.viewId();
    const load = prepareChapterLoad(ctx, direction, source);
    if (!load) return false;

    // Prefer cached content if available (avoid refetching on race/abort failures).
    const cached = ctx.cachedContents.value.get(load.targetUrl);
    if (cached) {
      return insertCachedChapter(ctx, cached, load.isNext ? 'append' : 'prepend');
    }
    if (ctx.persistedUrls.value.has(load.targetUrl)) {
      const persisted = await ctx.getPersistedCachedChapter(load.targetUrl);
      if (ctx.runtime.isViewStale(runId)) return false;
      if (persisted) {
        const sessionCached = { ...persisted, cachedAt: Date.now() };
        ctx.cachedContents.value.set(load.targetUrl, sessionCached);
        trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
        return insertCachedChapter(ctx, sessionCached, load.isNext ? 'append' : 'prepend');
      }
    }

    load.isLoadingRef.value = true;

    // Cancel in-flight request
    if (load.pendingAbortRef.value) {
      load.pendingAbortRef.value();
      load.pendingAbortRef.value = null;
    }

    if (!validateTargetChapterUrl(ctx, load, source)) {
      return false;
    }

    try {
      const referer = load.refChapter.chapter.url;
      const parser = getParser();
      let cleanupIframe: (() => void) | null = null;

      const recordLoadFailure = () => {
        const count = recordNavFailure(ctx.navFailures, load.navKey, {
          maxFailures: MAX_NAV_FAILURES,
        });
        if (source === 'manual' || count === 1) {
          ctx.showToast(load.errorMessage, 'error', 2500);
        }
      };

      let parsed: ParsedChapter | null = null;

      if (load.refChapter.rule?.advanced?.useIframe) {
        const iframeLoader = loadDocumentInIframe(load.targetUrl);
        const abort = iframeLoader.abort;
        if (ctx.runtime.isViewStale(runId)) {
          abort();
          return false;
        }
        load.pendingAbortRef.value = abort;

        const iframeResult = await iframeLoader.promise;
        if (ctx.runtime.isViewStale(runId)) {
          iframeResult?.cleanup();
          abort();
          return false;
        }
        clearPendingAbort(load, abort);
        cleanupIframe = iframeResult?.cleanup || null;

        if (iframeResult?.doc) {
          let iframeParsed: ParsedChapter | 'abort' | 'blocked' | null = null;
          try {
            iframeParsed = await parseCandidateDocument(
              ctx,
              load,
              parser,
              iframeResult.doc,
              runId,
              referer,
              source
            );
          } finally {
            cleanupIframe?.();
            cleanupIframe = null;
          }
          if (iframeParsed === 'abort' || iframeParsed === 'blocked') {
            return false;
          }
          parsed = iframeParsed;
        }
      }

      cleanupIframe?.();

      if (!parsed) {
        const fetchDoc = await loadFetchDocument(ctx, load, runId, referer);
        if (fetchDoc === 'abort') {
          return false;
        }
        if (!fetchDoc) {
          recordLoadFailure();
          return false;
        }

        const fetchParsed = await parseCandidateDocument(
          ctx,
          load,
          parser,
          fetchDoc,
          runId,
          referer,
          source
        );
        if (fetchParsed === 'abort' || fetchParsed === 'blocked') {
          return false;
        }
        parsed = fetchParsed;
      }

      if (ctx.runtime.isViewStale(runId)) {
        return false;
      }
      if (!parsed) {
        recordLoadFailure();
        return false;
      }

      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

      // Check if this is a TOC page
      const isTocPage = detectTocPage(parsed.content, load.targetUrl, load.refChapter.chapter.url);
      if (isTocPage) {
        if (shouldPersistNavigationBlock(source, 'toc-page')) {
          ctx.blockedNavUrls.value.add(load.navKey);
        }
        if (source === 'manual') {
          ctx.showToast(load.endMessage, 'info');
        }
        return false;
      }

      // Additional validation for prev: check if page has prev but no next
      if (!load.isNext) {
        if (
          parsed.nextUrl &&
          normalizeUrl(parsed.nextUrl) === normalizeUrl(load.refChapter.chapter.url)
        ) {
          // This is fine, it's actually the previous chapter
        } else if (parsed.prevUrl && !parsed.nextUrl) {
          // Page has prev but no next - likely a TOC or non-chapter page
          if (shouldPersistNavigationBlock(source, 'prev-page')) {
            ctx.blockedNavUrls.value.add(load.navKey);
          }
          return false;
        }
      }

      clearNavFailure(ctx.navFailures, load.navKey);
      return insertParsedChapter(ctx, load, parsed);
    } catch (e) {
      if (!ctx.runtime.isViewStale(runId)) {
        console.error(`[MNR] Failed to load ${direction} chapter:`, e);
        ctx.setError(load.errorMessage);
      }
      return false;
    } finally {
      if (!ctx.runtime.isViewStale(runId)) {
        load.isLoadingRef.value = false;
      }
    }
  }

  /** Load next chapter and append to list */
  async function loadNextChapter(source: LoadSource = 'auto'): Promise<boolean> {
    return loadChapter('next', source);
  }

  /** Load previous chapter and prepend to list */
  async function loadPrevChapter(source: LoadSource = 'manual'): Promise<boolean> {
    return loadChapter('prev', source);
  }

  /**
   * Rebuild chapters array around a target URL (for jumping to cached chapter)
   */
  async function rebuildChaptersAround(targetUrl: string): Promise<boolean> {
    const runId = ctx.runtime.bumpView();
    const url = normalizeUrlForFetch(targetUrl);
    ctx.pendingNextAbort.value?.();
    ctx.pendingNextAbort.value = null;
    ctx.pendingPrevAbort.value?.();
    ctx.pendingPrevAbort.value = null;
    ctx.reloadAbort.value?.();
    ctx.reloadAbort.value = null;
    ctx.isLoading.value = false;
    ctx.isLoadingPrev.value = false;
    ctx.isLoadingNext.value = false;

    // Check cachedContents first
    let cached = ctx.cachedContents.value.get(url);
    if (!cached && ctx.persistedUrls.value.has(url)) {
      const persisted = await ctx.getPersistedCachedChapter(url);
      if (ctx.runtime.isViewStale(runId)) return false;
      if (persisted) {
        cached = { ...persisted, cachedAt: Date.now() };
        ctx.cachedContents.value.set(url, cached);
        trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
      }
    }
    if (!cached) return false;
    if (ctx.runtime.isViewStale(runId)) return false;

    return rebuildChaptersFromCache(ctx, cached, url);
  }

  /**
   * Reload current chapter - refetch and reparse with current rules
   */
  async function reloadCurrentChapter(): Promise<void> {
    const runId = ctx.runtime.viewId();
    const current = ctx.chapters.value[ctx.currentChapterIndex.value];
    if (!current) return;

    const url = current.chapter.url;

    ctx.showToast('正在重新加载...', 'info');

    ctx.reloadAbort.value?.();
    ctx.reloadAbort.value = null;
    const { promise, abort } = fetchAndParseUrl(url, url);
    if (!ctx.runtime.isViewStale(runId)) {
      ctx.reloadAbort.value = abort;
    }
    const result = await promise;
    if (ctx.runtime.isViewStale(runId)) {
      abort();
      return;
    }
    if (ctx.reloadAbort.value === abort) {
      ctx.reloadAbort.value = null;
    }
    if (result.error === 'abort') {
      return;
    }
    if (!result.doc) {
      ctx.showToast('重新加载失败', 'error');
      return;
    }

    const parser = getParser();
    const parsed = await parseWithSectionMerge(parser, result.doc, url, url);
    if (ctx.runtime.isViewStale(runId)) {
      return;
    }

    if (parsed) {
      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

      current.chapter = parsed;
      current.rule = parsed.rule;
      ctx.originalContents.value.set(current.id, parsed.content);

      ctx.cachedContents.value.set(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      if (ctx.currentConversionMode.value !== 'none') {
        const converted = await convertHTML(parsed.content, ctx.currentConversionMode.value);
        current.chapter = { ...current.chapter, content: converted };
      }

      ctx.showToast('规则已应用', 'info');
    } else {
      ctx.showToast('解析失败', 'error');
    }
  }

  function insertCachedChapterForContext(
    cached: CachedChapter,
    position: 'append' | 'prepend'
  ): Promise<boolean> {
    return insertCachedChapter(ctx, cached, position);
  }

  return {
    insertCachedChapter: insertCachedChapterForContext,
    loadChapter,
    loadNextChapter,
    loadPrevChapter,
    rebuildChaptersAround,
    reloadCurrentChapter,
  };
}
