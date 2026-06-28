/**
 * Reader Store - Batch Cache All
 * Handles caching all chapters from TOC sequentially with persistence.
 */

import type { CachedChapter, CacheProgressState } from './types';
import type { ComputedRef, Ref } from 'vue';
import { fetchAndParseUrl } from '@/core/utils/network';
import { getParser } from '@/core/parser';
import type { ParsedChapter } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';

import {
  getCurrentBookCacheKey,
  persistCachedChapter,
  persistCacheIndex,
  PERSISTED_CACHE_INDEX_CHECKPOINT_CHAPTERS,
} from './persistence';
import { loadTocEntriesPaged } from './toc';
import { MAX_SESSION_CACHE } from './types';
import { normalizeUrlForFetch } from './utils';
import { parseWithSectionMerge } from './section';
import { trimCachedContents } from './trim';

// ============ Context Interface ============

export interface CacheAllContext {
  // State refs
  cacheProgress: Ref<CacheProgressState>;
  cacheQueue: Ref<string[]>;
  cacheAbort: Ref<(() => void) | null>;
  loadedUrls: Ref<Set<string>>;
  cachedContents: Ref<Map<string, CachedChapter>>;
  persistedUrls: Ref<Set<string>>;

  // Computed
  chapter: ComputedRef<ParsedChapter | null>;
  rule: ComputedRef<SiteRule | null>;
  chapters: Ref<Array<{ chapter: ParsedChapter }>>;

  // Session management
  runtime: {
    isSessionStale: (runId: number) => boolean;
    sessionId: () => number;
  };

  // Callbacks
  restoreCache: () => Promise<void>;
  persistCache: () => Promise<void>;
}

// ============ Factory ============

export function createCacheAll(ctx: CacheAllContext) {
  /**
   * Batch cache chapters (best-effort, sequential)
   * Persists chapters to storage (best-effort); in-memory cache is LRU-capped.
   */
  async function startCacheAll(urls?: string[]): Promise<void> {
    const runId = ctx.runtime.sessionId();
    if (ctx.cacheProgress.value.running) return;

    const seenUrls = new Set<string>();

    // Ensure we have the latest persistedUrls before building the task list.
    await ctx.restoreCache();
    if (ctx.runtime.isSessionStale(runId)) return;
    const persistedSet = new Set(ctx.persistedUrls.value);
    const cacheBook = getCurrentBookCacheKey(ctx.chapter.value?.indexUrl);

    let taskList = urls ? [...urls] : []; // No limit
    ctx.cacheQueue.value = [...taskList];

    // 目录列表：current.indexUrl -> 解析出章节列表，缓存全本
    if (!taskList.length) {
      const indexUrl = ctx.chapter.value?.indexUrl;
      const currentUrl = ctx.chapter.value?.url;
      if (indexUrl) {
        const tocEntries = await loadTocEntriesPaged(
          indexUrl,
          currentUrl || indexUrl,
          ctx.rule.value ?? undefined,
          abort => {
            if (!ctx.runtime.isSessionStale(runId)) {
              ctx.cacheAbort.value = abort;
            }
          }
        );
        if (ctx.runtime.isSessionStale(runId)) return;
        ctx.cacheAbort.value = null;

        const tocLinks = tocEntries.map(e => normalizeUrlForFetch(e.url)).slice(0, 10000);
        // Cache entire book, filter already cached/persisted
        taskList = tocLinks.filter(
          u =>
            !ctx.loadedUrls.value.has(u) && !ctx.cachedContents.value.has(u) && !persistedSet.has(u)
        );
        ctx.cacheQueue.value = [...taskList];
      }
    }

    // Total is actual list length
    const estimatedTotal = taskList.length;
    if (ctx.runtime.isSessionStale(runId)) return;
    if (estimatedTotal === 0) {
      ctx.cacheProgress.value = { done: 0, total: 0, running: false };
      return;
    }
    ctx.cacheProgress.value = { done: 0, total: estimatedTotal, running: true };

    let nextUrl: string | undefined | null = taskList.shift();
    let referer =
      ctx.chapters.value[ctx.chapters.value.length - 1]?.chapter.url || ctx.chapter.value?.url;
    let persistedSinceIndexWrite = 0;
    let hasWrittenIndexCheckpoint = false;

    while (ctx.cacheProgress.value.running && nextUrl) {
      const targetUrl = normalizeUrlForFetch(nextUrl);

      // 去重 - check loadedUrls, session cache, and persisted cache
      if (
        seenUrls.has(targetUrl) ||
        ctx.loadedUrls.value.has(targetUrl) ||
        ctx.cachedContents.value.has(targetUrl) ||
        persistedSet.has(targetUrl)
      ) {
        ctx.cacheProgress.value = {
          ...ctx.cacheProgress.value,
          done: ctx.cacheProgress.value.done + 1,
        };
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      const { promise, abort } = fetchAndParseUrl(targetUrl, referer);
      if (ctx.runtime.isSessionStale(runId)) {
        abort();
        break;
      }
      ctx.cacheAbort.value = abort;
      const result = await promise;
      if (ctx.runtime.isSessionStale(runId)) {
        abort();
        break;
      }
      ctx.cacheAbort.value = null;
      if (result.error === 'abort') {
        break;
      }
      if (!result.doc) {
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, result.doc, targetUrl, referer);
      if (ctx.runtime.isSessionStale(runId)) {
        break;
      }
      if (!parsed) {
        nextUrl = taskList.shift() ?? null;
        continue;
      }

      // Store in cachedContents (not chapters - for memory efficiency)
      const cached: CachedChapter = {
        chapter: parsed,
        rule: parsed.rule,
        cachedAt: Date.now(),
      };
      ctx.cachedContents.value.set(parsed.url, cached);
      seenUrls.add(parsed.url);

      // Trim session cache (LRU) to avoid unbounded memory usage during cache-all.
      trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);

      // Persist chapter (best-effort) while caching to avoid holding everything in memory.
      if (cacheBook) {
        const persisted = persistCachedChapter(cacheBook, parsed.url, cached);
        if (persisted) {
          persistedSet.add(parsed.url);
          persistedSinceIndexWrite += 1;
          if (
            !hasWrittenIndexCheckpoint ||
            persistedSinceIndexWrite >= PERSISTED_CACHE_INDEX_CHECKPOINT_CHAPTERS
          ) {
            if (persistCacheIndex(cacheBook, persistedSet)) {
              persistedSinceIndexWrite = 0;
              hasWrittenIndexCheckpoint = true;
            }
          }
        }
      }

      // Mark as loaded for deduplication
      ctx.cacheProgress.value = {
        ...ctx.cacheProgress.value,
        done: ctx.cacheProgress.value.done + 1,
      };

      // 下一章 URL 优先：显式队列 > 检测器返回 nextUrl（分页合并后 nextUrl 已指向下一章）
      referer = parsed.url;
      nextUrl = taskList.shift() ?? (parsed.nextUrl ? normalizeUrlForFetch(parsed.nextUrl) : null);

      // If following nextUrl chain, update total estimate
      if (taskList.length === 0 && nextUrl) {
        const normalizedNext = normalizeUrlForFetch(nextUrl);
        if (
          !seenUrls.has(normalizedNext) &&
          !ctx.loadedUrls.value.has(normalizedNext) &&
          !ctx.cachedContents.value.has(normalizedNext) &&
          !persistedSet.has(normalizedNext)
        ) {
          ctx.cacheProgress.value = {
            ...ctx.cacheProgress.value,
            total: ctx.cacheProgress.value.done + 1,
          };
        }
      }
    }

    if (ctx.runtime.isSessionStale(runId)) return;
    // Final total update
    ctx.cacheProgress.value = {
      ...ctx.cacheProgress.value,
      total: ctx.cacheProgress.value.done,
      running: false,
    };
    ctx.cacheAbort.value = null;

    // Persist cache after completion
    if (cacheBook && persistedSet.size > 0) {
      ctx.persistedUrls.value = persistedSet;
    }
    await ctx.persistCache();
  }

  function cancelCacheAll(): void {
    ctx.cacheProgress.value = { done: 0, total: 0, running: false };
    ctx.cacheQueue.value = [];
    ctx.cacheAbort.value?.();
    ctx.cacheAbort.value = null;
  }

  return { startCacheAll, cancelCacheAll };
}
