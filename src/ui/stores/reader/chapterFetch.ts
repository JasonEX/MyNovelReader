import { MAX_NAV_FAILURES, VIP_BLOCK_TOAST } from './types';
import type { ParsedChapter, Parser } from '@/core/parser';

import { fetchAndParseUrl } from '@/core/utils/network';
import { fetchCiweimaoApiDocument } from '@/core/rules/sites/ciweimao';
import { isCloudflareChallenge } from '@/core/protection';
import { isVipChapterPage } from './detection';
import type { LoadSource } from './types';
import type { NavigationContext } from './navigationContext';
import { normalizeUrlForBlock } from './utils';
import { parseWithSectionMerge } from './section';
import type { PreparedChapterLoad } from './chapterLoadGuards';
import { recordNavFailure } from './navFailure';

export type FetchDocumentResult = Document | 'abort' | null;
export type ParsedCandidateResult = ParsedChapter | 'abort' | 'blocked' | null;

export function loadDocumentInIframe(
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

export async function loadFetchDocument(
  ctx: NavigationContext,
  load: PreparedChapterLoad,
  runId: number,
  referer: string
): Promise<FetchDocumentResult> {
  const ciweimaoDoc = await loadCiweimaoApiDocument(load);
  if (ciweimaoDoc) return ciweimaoDoc;

  const fetchLoader = fetchAndParseUrl(load.targetUrl, referer);
  const abort = fetchLoader.abort;
  if (ctx.runtime.isViewStale(runId)) {
    abort();
    return 'abort';
  }
  load.pendingAbortRef.value = abort;

  const fetchResult = await fetchLoader.promise;
  if (ctx.runtime.isViewStale(runId)) {
    abort();
    return 'abort';
  }
  clearPendingAbort(load, abort);

  if (fetchResult.error === 'abort') {
    return 'abort';
  }
  return fetchResult.doc;
}

async function loadCiweimaoApiDocument(load: PreparedChapterLoad): Promise<Document | null> {
  const ruleId = load.refChapter.rule?.id || load.refChapter.chapter.rule?.id || '';
  if (ruleId !== 'ciweimao' && ruleId !== 'ciweimao-wap') return null;

  return fetchCiweimaoApiDocument(load.targetUrl, {
    bookTitle: load.refChapter.chapter.bookTitle,
    indexUrl: load.refChapter.chapter.indexUrl,
    url: load.refChapter.chapter.url,
  });
}

export async function parseCandidateDocument(
  ctx: NavigationContext,
  load: PreparedChapterLoad,
  parser: Parser,
  doc: Document,
  runId: number,
  _referer: string,
  source: LoadSource
): Promise<ParsedCandidateResult> {
  if (isCloudflareChallenge(doc)) {
    const count = recordNavFailure(ctx.navFailures, load.navKey, {
      maxFailures: MAX_NAV_FAILURES,
    });
    if (source === 'manual' || count === 1) {
      ctx.showToast('Cloudflare 验证页面，请在新标签页中完成验证后重试', 'info', 4000);
    }
    return 'blocked';
  }

  if (isVipChapterPage(doc)) {
    ctx.vipBlockedUrls.value.add(normalizeUrlForBlock(load.targetUrl));
    ctx.showToast(VIP_BLOCK_TOAST, 'info', 3000);
    return 'blocked';
  }

  const controller = new AbortController();
  const abort = () => controller.abort();
  load.pendingAbortRef.value = abort;

  try {
    const parsed = await parseWithSectionMerge(parser, doc, load.targetUrl, {
      signal: controller.signal,
    });
    if (controller.signal.aborted || ctx.runtime.isViewStale(runId)) {
      return 'abort';
    }
    return parsed;
  } finally {
    clearPendingAbort(load, abort);
  }
}

export function clearPendingAbort(load: PreparedChapterLoad, abort: () => void): void {
  if (load.pendingAbortRef.value === abort) {
    load.pendingAbortRef.value = null;
  }
}
