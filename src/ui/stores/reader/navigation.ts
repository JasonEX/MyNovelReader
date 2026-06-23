/**
 * Reader Store - Chapter Navigation
 * Handles loading chapters (next/prev), inserting from cache, and navigation guards.
 */

import type { CachedChapter, ChapterEntry, LoadSource } from './types';
import { type ConversionMode, convertHTML } from '@/core/converter';
import { fetchAndParseUrl } from '@/core/utils/network';
import { getParser } from '@/core/parser';
import { isCloudflareChallenge } from '@/core/protection';
import type { Ref } from 'vue';

import { clearNavFailure, recordNavFailure } from './navFailure';
import { detectTocPage, isInvalidChapterUrl, isVipChapterPage } from './detection';
import { MAX_CACHED_CHAPTERS, MAX_NAV_FAILURES, MAX_SESSION_CACHE, VIP_BLOCK_TOAST } from './types';
import { normalizeUrl, normalizeUrlForBlock, normalizeUrlForFetch } from './utils';
import { parseWithSectionMerge } from './section';
import { trimCachedContents } from './trim';

// ============ Context Interface ============

export interface NavigationContext {
  // State refs
  chapters: Ref<ChapterEntry[]>;
  currentChapterIndex: Ref<number>;
  isLoading: Ref<boolean>;
  isLoadingNext: Ref<boolean>;
  isLoadingPrev: Ref<boolean>;
  pendingNextAbort: Ref<(() => void) | null>;
  pendingPrevAbort: Ref<(() => void) | null>;
  reloadAbort: Ref<(() => void) | null>;
  loadedUrls: Ref<Set<string>>;
  vipBlockedUrls: Ref<Set<string>>;
  blockedNavUrls: Ref<Set<string>>;
  cachedContents: Ref<Map<string, CachedChapter>>;
  persistedUrls: Ref<Set<string>>;
  originalContents: Ref<Map<string, string>>;
  originalTitles: Ref<Map<string, { title: string; bookTitle?: string }>>;
  currentConversionMode: Ref<ConversionMode>;
  navFailures: Map<string, { count: number; nextRetryAt: number }>;
  history: Ref<string[]>;

  // Stale guards
  runtime: {
    bumpView: () => number;
    isViewStale: (runId: number) => boolean;
    viewId: () => number;
  };

  // Callbacks
  showToast: (msg: string, type: 'info' | 'error', duration?: number) => void;
  setError: (msg: string) => void;
  applyConversionToChapterEntry: (entryId: string, mode: ConversionMode) => Promise<void>;
  getPersistedCachedChapter: (url: string) => Promise<CachedChapter | null>;
}

// ============ Factory ============

export function createNavigation(ctx: NavigationContext) {
  function loadDocumentInIframe(
    url: string,
    timeoutMs: number = 15000
  ): { promise: Promise<{ doc: Document; cleanup: () => void } | null>; abort: () => void } {
    let iframe: HTMLIFrameElement | null = null;
    let timeoutId: number | null = null;
    let settled = false;
    let resolveResult: ((result: { doc: Document; cleanup: () => void } | null) => void) | null =
      null;

    const clearTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const cleanup = () => {
      clearTimer();
      if (iframe) {
        iframe.remove();
        iframe = null;
      }
    };

    const finish = (result: { doc: Document; cleanup: () => void } | null) => {
      if (settled) return;
      settled = true;
      if (result) {
        clearTimer();
      } else {
        cleanup();
      }
      resolveResult?.(result);
    };

    const promise = new Promise<{ doc: Document; cleanup: () => void } | null>(resolve => {
      resolveResult = resolve;
      iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      iframe.style.cssText = [
        'position:absolute',
        'display:block!important',
        'left:-10000px',
        'top:0',
        'width:1200px',
        'height:8000px',
        'opacity:0',
        'pointer-events:none',
        'border:0',
      ].join(';');

      iframe.onload = () => {
        window.setTimeout(() => {
          try {
            const doc = iframe?.contentDocument;
            if (!doc) {
              finish(null);
              return;
            }
            finish({ doc, cleanup });
          } catch {
            finish(null);
          }
        }, 300);
      };
      iframe.onerror = () => finish(null);

      timeoutId = window.setTimeout(() => finish(null), timeoutMs);
      const parent = document.body || document.documentElement;
      if (!parent) {
        finish(null);
        return;
      }
      parent.appendChild(iframe);
      iframe.src = url;
    });

    return {
      promise,
      abort: () => finish(null),
    };
  }

  /** Helper: Insert a chapter from cache to chapters list */
  async function insertCachedChapter(
    cached: CachedChapter,
    position: 'append' | 'prepend'
  ): Promise<boolean> {
    const suffix = position === 'append' ? 'cached' : 'cached-prev';
    const id = `chapter-${Date.now()}-${suffix}-${ctx.chapters.value.length}`;
    const entry = {
      chapter: { ...cached.chapter },
      rule: cached.rule,
      id,
    };

    if (position === 'append') {
      ctx.chapters.value.push(entry);
    } else {
      ctx.chapters.value.unshift(entry);
      ctx.currentChapterIndex.value++;
    }
    ctx.loadedUrls.value.add(entry.chapter.url);

    // Store original content for text conversion
    ctx.originalContents.value.set(id, cached.chapter.content);
    ctx.originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle,
    });

    if (ctx.currentConversionMode.value !== 'none') {
      await ctx.applyConversionToChapterEntry(id, ctx.currentConversionMode.value);
    }

    // Trim cached chapters to limit memory
    if (ctx.chapters.value.length > MAX_CACHED_CHAPTERS) {
      if (position === 'append' && ctx.currentChapterIndex.value > 2) {
        // Trim from beginning when appending
        const removed = ctx.chapters.value.shift();
        if (removed) {
          ctx.loadedUrls.value.delete(removed.chapter.url);
          ctx.originalContents.value.delete(removed.id);
          ctx.originalTitles.value.delete(removed.id);
          ctx.currentChapterIndex.value = Math.max(0, ctx.currentChapterIndex.value - 1);
        }
      } else if (position === 'prepend') {
        // Trim from end when prepending
        const removed = ctx.chapters.value.pop();
        if (removed) {
          ctx.loadedUrls.value.delete(removed.chapter.url);
          ctx.originalContents.value.delete(removed.id);
          ctx.originalTitles.value.delete(removed.id);
        }
      }
    }

    return true;
  }

  /** Unified chapter loading function */
  async function loadChapter(direction: 'next' | 'prev', source: LoadSource): Promise<boolean> {
    const runId = ctx.runtime.viewId();
    const isNext = direction === 'next';
    const refChapter = isNext
      ? ctx.chapters.value[ctx.chapters.value.length - 1]
      : ctx.chapters.value[0];
    const isLoadingRef = isNext ? ctx.isLoadingNext : ctx.isLoadingPrev;
    const pendingAbortRef = isNext ? ctx.pendingNextAbort : ctx.pendingPrevAbort;
    const endMessage = isNext ? '已经是最后一章了' : '已经是第一章了';
    const errorMessage = isNext ? '加载下一章失败' : '加载上一章失败';

    if (isLoadingRef.value) {
      return false;
    }

    const rawTargetUrl = isNext ? refChapter?.chapter.nextUrl : refChapter?.chapter.prevUrl;
    if (!rawTargetUrl) {
      if (source === 'manual') {
        ctx.showToast(endMessage, 'info');
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
      normalizeUrl(targetUrl) === normalizeUrl(refChapter.chapter.indexUrl)
    ) {
      ctx.blockedNavUrls.value.add(normalizeUrlForBlock(targetUrl));
      if (source === 'manual') {
        ctx.showToast(endMessage, 'info');
      }
      return false;
    }

    // Don't load VIP chapters (cached for this session)
    if (ctx.vipBlockedUrls.value.has(normalizeUrlForBlock(targetUrl))) {
      ctx.showToast(VIP_BLOCK_TOAST, 'info', 3000);
      return false;
    }

    const navKey = normalizeUrlForBlock(targetUrl);
    if (ctx.blockedNavUrls.value.has(navKey)) {
      if (source === 'manual') {
        ctx.showToast(endMessage, 'info');
      }
      return false;
    }

    const failure = ctx.navFailures.get(navKey);
    if (failure && Date.now() < failure.nextRetryAt) {
      if (source === 'manual') {
        ctx.showToast('加载失败过于频繁，请稍后重试', 'info', 2000);
      }
      return false;
    }

    if (ctx.loadedUrls.value.has(targetUrl)) {
      return false;
    }

    // Prefer cached content if available (avoid refetching on race/abort failures).
    const cached = ctx.cachedContents.value.get(targetUrl);
    if (cached) {
      return insertCachedChapter(cached, isNext ? 'append' : 'prepend');
    }
    if (ctx.persistedUrls.value.has(targetUrl)) {
      const persisted = await ctx.getPersistedCachedChapter(targetUrl);
      if (ctx.runtime.isViewStale(runId)) return false;
      if (persisted) {
        const sessionCached: CachedChapter = { ...persisted, cachedAt: Date.now() };
        ctx.cachedContents.value.set(targetUrl, sessionCached);
        trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
        return insertCachedChapter(sessionCached, isNext ? 'append' : 'prepend');
      }
    }

    isLoadingRef.value = true;

    // Cancel in-flight request
    if (pendingAbortRef.value) {
      pendingAbortRef.value();
      pendingAbortRef.value = null;
    }

    // Pre-fetch validation: check if URL looks like a valid chapter page
    if (isInvalidChapterUrl(targetUrl, refChapter.chapter.url)) {
      isLoadingRef.value = false;
      ctx.blockedNavUrls.value.add(navKey);
      if (source === 'manual') {
        ctx.showToast(endMessage, 'info');
      }
      return false;
    }

    try {
      const referer = refChapter.chapter.url;
      const iframeLoader = refChapter.rule?.advanced?.useIframe
        ? loadDocumentInIframe(targetUrl)
        : null;
      const fetchLoader = iframeLoader ? null : fetchAndParseUrl(targetUrl, referer);
      const abort = iframeLoader ? iframeLoader.abort : fetchLoader!.abort;
      if (ctx.runtime.isViewStale(runId)) {
        abort();
        return false;
      }
      pendingAbortRef.value = abort;

      const iframeResult = iframeLoader ? await iframeLoader.promise : null;
      const fetchResult = fetchLoader ? await fetchLoader.promise : null;
      if (ctx.runtime.isViewStale(runId)) {
        abort();
        return false;
      }
      pendingAbortRef.value = null;
      if (fetchResult?.error === 'abort') {
        return false;
      }
      const doc = iframeResult?.doc || fetchResult?.doc || null;
      const cleanupIframe = iframeResult?.cleanup;
      if (!doc) {
        const count = recordNavFailure(ctx.navFailures, navKey, { maxFailures: MAX_NAV_FAILURES });
        if (source === 'manual' || count === 1) {
          ctx.showToast(errorMessage, 'error', 2500);
        }
        return false;
      }

      // Cloudflare challenge page: the actual chapter was not returned.
      // Treat as a transient failure so the backoff/retry mechanism kicks in.
      if (isCloudflareChallenge(doc)) {
        const count = recordNavFailure(ctx.navFailures, navKey, { maxFailures: MAX_NAV_FAILURES });
        if (source === 'manual' || count === 1) {
          ctx.showToast('Cloudflare 验证页面，请在新标签页中完成验证后重试', 'info', 4000);
        }
        cleanupIframe?.();
        return false;
      }

      // VIP page detection: do not parse / load, just toast and block it for this session
      if (isVipChapterPage(doc)) {
        ctx.vipBlockedUrls.value.add(normalizeUrlForBlock(targetUrl));
        ctx.showToast(VIP_BLOCK_TOAST, 'info', 3000);
        cleanupIframe?.();
        return false;
      }

      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, doc, targetUrl, referer);
      cleanupIframe?.();
      if (ctx.runtime.isViewStale(runId)) {
        return false;
      }
      if (!parsed) {
        const count = recordNavFailure(ctx.navFailures, navKey, { maxFailures: MAX_NAV_FAILURES });
        if (source === 'manual' || count === 1) {
          ctx.showToast(errorMessage, 'error', 2500);
        }
        return false;
      }

      if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
      if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
      if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);

      // Check if this is a TOC page
      const isTocPage = detectTocPage(parsed.content, targetUrl, refChapter.chapter.url);
      if (isTocPage) {
        ctx.blockedNavUrls.value.add(navKey);
        if (source === 'manual') {
          ctx.showToast(endMessage, 'info');
        }
        return false;
      }

      // Additional validation for prev: check if page has prev but no next
      if (!isNext) {
        if (
          parsed.nextUrl &&
          normalizeUrl(parsed.nextUrl) === normalizeUrl(refChapter.chapter.url)
        ) {
          // This is fine, it's actually the previous chapter
        } else if (parsed.prevUrl && !parsed.nextUrl) {
          // Page has prev but no next - likely a TOC or non-chapter page
          ctx.blockedNavUrls.value.add(navKey);
          return false;
        }
      }

      // Add to chapters list
      const suffix = isNext ? '' : 'prev-';
      const id = `chapter-${Date.now()}-${suffix}${ctx.chapters.value.length}`;
      const entry = {
        chapter: parsed,
        rule: parsed.rule,
        id,
      };

      if (isNext) {
        ctx.chapters.value.push(entry);
      } else {
        ctx.chapters.value.unshift(entry);
        ctx.currentChapterIndex.value++;
      }
      clearNavFailure(ctx.navFailures, navKey);
      ctx.loadedUrls.value.add(parsed.url);

      // Store original content for text conversion
      ctx.originalContents.value.set(id, parsed.content);
      ctx.originalTitles.value.set(id, { title: parsed.title, bookTitle: parsed.bookTitle });

      // Also store in cachedContents for quick jump
      ctx.cachedContents.value.set(parsed.url, {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      });

      // Trim in-memory session cache (LRU) to keep memory bounded.
      trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);

      // Apply current conversion mode if active
      if (ctx.currentConversionMode.value !== 'none') {
        await ctx.applyConversionToChapterEntry(id, ctx.currentConversionMode.value);
      }

      // Add to history
      if (!ctx.history.value.includes(parsed.url)) {
        if (isNext) {
          ctx.history.value.push(parsed.url);
        } else {
          ctx.history.value.unshift(parsed.url);
        }
      }

      // Trim cached chapters to limit memory
      if (ctx.chapters.value.length > MAX_CACHED_CHAPTERS) {
        if (isNext && ctx.currentChapterIndex.value > 2) {
          const removed = ctx.chapters.value.shift();
          if (removed) {
            ctx.loadedUrls.value.delete(removed.chapter.url);
            ctx.originalContents.value.delete(removed.id);
            ctx.originalTitles.value.delete(removed.id);
            ctx.currentChapterIndex.value = Math.max(0, ctx.currentChapterIndex.value - 1);
          }
        } else if (!isNext) {
          const removed = ctx.chapters.value.pop();
          if (removed) {
            ctx.loadedUrls.value.delete(removed.chapter.url);
            ctx.originalContents.value.delete(removed.id);
            ctx.originalTitles.value.delete(removed.id);
          }
        }
      }

      return true;
    } catch (e) {
      if (!ctx.runtime.isViewStale(runId)) {
        console.error(`[MNR] Failed to load ${direction} chapter:`, e);
        ctx.setError(errorMessage);
      }
      return false;
    } finally {
      if (!ctx.runtime.isViewStale(runId)) {
        isLoadingRef.value = false;
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

    ctx.chapters.value = [];
    ctx.currentChapterIndex.value = 0;
    ctx.loadedUrls.value.clear();
    ctx.originalContents.value.clear();
    ctx.originalTitles.value.clear();

    const id = `chapter-${Date.now()}-jump-0`;
    ctx.chapters.value.push({
      chapter: { ...cached.chapter },
      rule: cached.rule,
      id,
    });
    ctx.loadedUrls.value.add(url);

    ctx.originalContents.value.set(id, cached.chapter.content);
    ctx.originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle,
    });

    if (ctx.currentConversionMode.value !== 'none') {
      await ctx.applyConversionToChapterEntry(id, ctx.currentConversionMode.value);
    }

    return true;
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

  return {
    insertCachedChapter,
    loadChapter,
    loadNextChapter,
    loadPrevChapter,
    rebuildChaptersAround,
    reloadCurrentChapter,
  };
}
