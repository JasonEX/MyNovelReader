import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import {
  captureHostPageSnapshot,
  restoreHostPageSnapshot,
  syncHostPageToChapter,
} from '@/ui/stores/reader/hostPage';
import type { ParsedChapter } from '@/core/parser';

describe('hostPage helpers', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM(
      '<!doctype html><html><head><title>Original</title></head><body></body></html>',
      {
        url: 'https://example.com/original.html',
      }
    );
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function makeChapter(overrides: Partial<ParsedChapter> = {}): ParsedChapter {
    return {
      title: 'Chapter 1',
      bookTitle: 'Book',
      content: '<p>Content</p>',
      rawContent: '<p>Raw</p>',
      url: 'https://example.com/chapter/1.html',
      confidence: 1,
      method: 'rule',
      ...overrides,
    };
  }

  it('captures and restores the host page snapshot', () => {
    window.history.replaceState({ from: 'test' }, '', '/original.html');

    const snapshot = captureHostPageSnapshot();
    expect(snapshot).toEqual({
      url: 'https://example.com/original.html',
      title: 'Original',
      state: { from: 'test' },
    });

    syncHostPageToChapter(makeChapter(), 2);
    expect(document.title).toBe('Chapter 1 - Book');
    expect(window.location.href).toBe('https://example.com/chapter/1.html');

    restoreHostPageSnapshot(snapshot);
    expect(document.title).toBe('Original');
    expect(window.location.href).toBe('https://example.com/original.html');
  });

  it('updates the title without touching history when chapter URL is missing', () => {
    const replaceState = vi.spyOn(window.history, 'replaceState');

    syncHostPageToChapter(makeChapter({ url: '' }), 0);

    expect(document.title).toBe('Chapter 1 - Book');
    expect(replaceState).not.toHaveBeenCalled();
  });

  it('treats missing browser globals as a no-op', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    expect(captureHostPageSnapshot()).toBeNull();
    expect(() => syncHostPageToChapter(makeChapter(), 0)).not.toThrow();
    expect(() =>
      restoreHostPageSnapshot({
        url: 'https://example.com/original.html',
        title: 'Original',
        state: null,
      })
    ).not.toThrow();
  });

  it('restores the title even when browser history replacement fails', () => {
    const replaceState = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {
      throw new Error('blocked');
    });

    restoreHostPageSnapshot({
      url: 'https://example.com/original.html',
      title: 'Original',
      state: null,
    });

    expect(replaceState).toHaveBeenCalled();
    expect(document.title).toBe('Original');
  });
});
