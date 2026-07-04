import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildDiagnosticInfo, copyDiagnosticInfo } from '@/ui/debug/diagnostics';
import { clearDebugEvents, recordDebugEvent } from '@/core/debug/events';
import { createGmStorageMock, stubGmStorage } from '../testUtils/gmStorage';
import { redactUrl, toDebugValue } from '@/core/debug/diagnostics';
import { createDom } from '../testUtils/dom';
import { setupPinia } from '../testUtils/pinia';
import { useConfigStore } from '@/ui/stores/config';
import { useReaderStore } from '@/ui/stores/reader';

describe('debug diagnostics', () => {
  beforeEach(() => {
    setupPinia();
    clearDebugEvents();
    createDom(
      'https://example.com/book/1?page=1&token=secret-token&__cf_chl_f_tk=cf-secret',
      '<!doctype html><html><head><title>Host title</title></head><body><main>host page</main></body></html>'
    );
    stubGmStorage(createGmStorageMock());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('redacts sensitive URL query parameters while preserving useful ones', () => {
    const redacted = redactUrl(
      'https://user:pass@example.com/chapter/1?page=1&token=abc&sign=def&search=keep'
    );

    expect(redacted).toBe(
      'https://__redacted__:__redacted__@example.com/chapter/1?page=1&token=__redacted__&sign=__redacted__&search=keep'
    );
  });

  it('redacts URL substrings inside debug strings', () => {
    const value = toDebugValue({
      message: 'failed at https://example.com/chapter/1?token=embedded-secret&page=1',
    });
    const text = JSON.stringify(value);

    expect(text).toContain('page=1');
    expect(text).toContain('__redacted__');
    expect(text).not.toContain('embedded-secret');
  });

  it('builds a serializable snapshot without leaking chapter body text', () => {
    const configStore = useConfigStore();
    const readerStore = useReaderStore();
    const secretBody = '<p>VERY_SECRET_CHAPTER_BODY</p>';

    readerStore.activate();
    readerStore.setChapter({
      title: '第1章',
      bookTitle: '示例书',
      content: secretBody,
      rawContent: `${secretBody}<p>RAW_SECRET</p>`,
      url: 'https://example.com/book/1?token=chapter-token&page=1',
      prevUrl: 'https://example.com/book/0?session=prev-secret',
      nextUrl: 'https://example.com/book/2?sign=next-secret',
      indexUrl: 'https://example.com/book/index?page=1',
      confidence: 1,
      method: 'rule',
    });
    recordDebugEvent('test.event', { url: 'https://example.com/a?token=event-secret' });

    const info = buildDiagnosticInfo({ readerStore, configStore });
    const text = JSON.stringify(info);

    expect(info.schema).toBe('mnr-debug-v1');
    expect(text).toContain('page=1');
    expect(text).toContain('__redacted__');
    expect(text).not.toContain('VERY_SECRET_CHAPTER_BODY');
    expect(text).not.toContain('RAW_SECRET');
    expect(text).not.toContain('chapter-token');
    expect(text).not.toContain('prev-secret');
    expect(text).not.toContain('next-secret');
    expect(text).not.toContain('event-secret');
    expect(() => JSON.stringify(info)).not.toThrow();
  });

  it('copies diagnostic JSON through GM_setClipboard and reports success', async () => {
    const gmSetClipboard = vi.fn();
    const notify = vi.fn();
    vi.stubGlobal('GM_setClipboard', gmSetClipboard);

    const result = await copyDiagnosticInfo({ notify });

    expect(result.ok).toBe(true);
    expect(gmSetClipboard).toHaveBeenCalledTimes(1);
    expect(JSON.parse(gmSetClipboard.mock.calls[0][0])).toMatchObject({
      schema: 'mnr-debug-v1',
    });
    expect(notify).toHaveBeenCalledWith('诊断信息已复制', 'info');
  });
});
