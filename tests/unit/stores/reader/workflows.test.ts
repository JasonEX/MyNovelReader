import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchAndParseUrl } from '@/core/utils/network';
import { getParser } from '@/core/parser';
import { loadTocEntriesPaged } from '@/ui/stores/reader/toc';
import { parseWithSectionMerge } from '@/ui/stores/reader/section';
import { useReaderStore } from '@/ui/stores/reader';

import { createGmStorageMock, stubGmStorage } from '../../../testUtils/gmStorage';
import { createDom } from '../../../testUtils/dom';
import { setupPinia } from '../../../testUtils/pinia';

const { mockFetchAndParseUrl, mockGetParser, mockLoadTocEntriesPaged, mockParseWithSectionMerge } =
  vi.hoisted(() => ({
    mockFetchAndParseUrl: vi.fn(),
    mockGetParser: vi.fn(),
    mockLoadTocEntriesPaged: vi.fn(),
    mockParseWithSectionMerge: vi.fn(),
  }));

vi.mock('@/core/parser', () => ({
  getParser: mockGetParser,
}));

vi.mock('@/core/utils/network', () => ({
  fetchAndParseUrl: mockFetchAndParseUrl,
}));

vi.mock('@/ui/stores/reader/section', () => ({
  parseWithSectionMerge: mockParseWithSectionMerge,
}));

vi.mock('@/ui/stores/reader/toc', async importOriginal => {
  const actual = await importOriginal<typeof import('@/ui/stores/reader/toc')>();
  return {
    ...actual,
    loadTocEntriesPaged: mockLoadTocEntriesPaged,
  };
});

describe('ReaderStore - workflows', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();

    setupPinia();
    createDom('https://example.com/book/1/1.html');

    const gm = createGmStorageMock();
    stubGmStorage(gm);

    vi.clearAllMocks();
    mockGetParser.mockReturnValue({} as unknown);
  });

  it('loadToc retries once when first attempt returns empty', async () => {
    vi.useFakeTimers();

    const store = useReaderStore();
    store.setChapter({
      title: '第1章',
      content: '<p>init</p>',
      rawContent: '<p>init</p>',
      url: 'https://example.com/book/1/1.html',
      indexUrl: 'https://example.com/book/1/index.html',
      confidence: 1,
      method: 'rule',
    });

    mockLoadTocEntriesPaged
      .mockImplementationOnce(async (_indexUrl, _currentUrl, _rule, setAbort) => {
        setAbort(() => {});
        return [];
      })
      .mockImplementationOnce(async (_indexUrl, _currentUrl, _rule, setAbort) => {
        setAbort(() => {});
        return [
          { title: '第1章', url: 'https://example.com/book/1/1.html' },
          { title: '第2章', url: 'https://example.com/book/1/2.html' },
        ];
      });

    const p = store.loadToc();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(400);
    await p;

    expect(loadTocEntriesPaged).toHaveBeenCalledTimes(2);
    expect(store.toc).toEqual([
      { title: '第1章', url: 'https://example.com/book/1/1.html' },
      { title: '第2章', url: 'https://example.com/book/1/2.html' },
    ]);
    expect(store.tocLoading).toBe(false);
  });

  it('startCacheAll caches URLs via fetch+parse and persists them (best-effort)', async () => {
    const store = useReaderStore();
    store.setChapter({
      title: '第1章',
      content: '<p>init</p>',
      rawContent: '<p>init</p>',
      url: 'https://example.com/book/1/1.html',
      indexUrl: 'https://example.com/book/1/index.html',
      confidence: 1,
      method: 'rule',
    });

    const doc = new DOMParser().parseFromString('<html><body>ok</body></html>', 'text/html');

    mockFetchAndParseUrl.mockImplementation((url: string) => ({
      promise: Promise.resolve({
        doc,
        status: 200,
        finalUrl: url,
        error: null,
      }),
      abort: vi.fn(),
    }));

    mockParseWithSectionMerge.mockImplementation(async (_parser, _doc, url: string) => ({
      title: 't',
      content: '<p>c</p>',
      rawContent: '<p>c</p>',
      url,
      indexUrl: 'https://example.com/book/1/index.html',
      confidence: 1,
      method: 'rule',
      nextUrl: null,
    }));

    await store.startCacheAll(['https://example.com/book/1/2.html']);

    expect(fetchAndParseUrl).toHaveBeenCalledTimes(1);
    expect(getParser).toHaveBeenCalledTimes(1);
    expect(parseWithSectionMerge).toHaveBeenCalledTimes(1);

    expect(store.cacheProgress.running).toBe(false);
    expect(store.cacheProgress.done).toBe(1);
    expect(store.cachedContents.has('https://example.com/book/1/2.html')).toBe(true);
    expect(store.persistedUrls.has('https://example.com/book/1/2.html')).toBe(true);
  });

  it('cancelCacheAll aborts in-flight request and stops caching', async () => {
    type AbortResult = { doc: null; status: null; finalUrl: null; error: 'abort' };

    const store = useReaderStore();
    store.setChapter({
      title: '第1章',
      content: '<p>init</p>',
      rawContent: '<p>init</p>',
      url: 'https://example.com/book/1/1.html',
      confidence: 1,
      method: 'rule',
    });

    let resolvePromise: ((value: AbortResult) => void) | null = null;
    const promise = new Promise<AbortResult>(resolve => {
      resolvePromise = resolve;
    });

    const abort = vi.fn(() => {
      resolvePromise?.({ doc: null, status: null, finalUrl: null, error: 'abort' });
    });
    mockFetchAndParseUrl.mockReturnValue({ promise, abort });

    const p = store.startCacheAll(['https://example.com/book/1/2.html']);
    await Promise.resolve();

    store.cancelCacheAll();
    await p;

    expect(abort).toHaveBeenCalledTimes(1);
    expect(store.cacheProgress.running).toBe(false);
  });

  it('rebuildChaptersAround replaces current chapters with the cached target', async () => {
    const store = useReaderStore();
    store.setChapter({
      title: '第1章',
      content: '<p>init</p>',
      rawContent: '<p>init</p>',
      url: 'https://example.com/book/1/1.html',
      indexUrl: 'https://example.com/book/1/index.html',
      confidence: 1,
      method: 'rule',
    });

    store.cachedContents.set('https://example.com/book/1/2.html', {
      chapter: {
        title: '第2章',
        content: '<p>c2</p>',
        rawContent: '<p>c2</p>',
        url: 'https://example.com/book/1/2.html',
        indexUrl: 'https://example.com/book/1/index.html',
        confidence: 1,
        method: 'rule',
      },
      cachedAt: 1,
    });

    const ok = await store.rebuildChaptersAround('https://example.com/book/1/2.html');
    expect(ok).toBe(true);
    expect(store.currentChapterIndex).toBe(0);
    expect(store.chapters.length).toBe(1);
    expect(store.chapters[0]?.chapter.url).toBe('https://example.com/book/1/2.html');
  });

  it('reloadCurrentChapter refetches and updates chapter content and cache', async () => {
    const store = useReaderStore();
    store.setChapter({
      title: '第1章',
      content: '<p>old</p>',
      rawContent: '<p>old</p>',
      url: 'https://example.com/book/1/1.html',
      indexUrl: 'https://example.com/book/1/index.html',
      confidence: 1,
      method: 'rule',
    });

    const doc = new DOMParser().parseFromString('<html><body>new</body></html>', 'text/html');
    mockFetchAndParseUrl.mockReturnValue({
      promise: Promise.resolve({
        doc,
        status: 200,
        finalUrl: 'https://example.com/book/1/1.html',
        error: null,
      }),
      abort: vi.fn(),
    });
    mockParseWithSectionMerge.mockResolvedValue({
      title: '第1章(新)',
      content: '<p>new</p>',
      rawContent: '<p>new</p>',
      url: 'https://example.com/book/1/1.html',
      indexUrl: 'https://example.com/book/1/index.html',
      confidence: 1,
      method: 'rule',
      nextUrl: null,
    });

    await store.reloadCurrentChapter();

    expect(fetchAndParseUrl).toHaveBeenCalledTimes(1);
    expect(getParser).toHaveBeenCalledTimes(1);
    expect(parseWithSectionMerge).toHaveBeenCalledTimes(1);
    expect(store.chapters[0]?.chapter.content).toBe('<p>new</p>');
    expect(store.cachedContents.has('https://example.com/book/1/1.html')).toBe(true);

    store.clearError();
  });
});
