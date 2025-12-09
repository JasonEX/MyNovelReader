import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SaveManager } from '../../src/MyNovelReader/app/save/SaveManager';

const saveAsMock = vi.hoisted(() => vi.fn());
const loadingMock = vi.hoisted(() => vi.fn());
const sleepMock = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const logger = vi.hoisted(() => ({ log: vi.fn(), error: vi.fn(), warn: vi.fn() }));

vi.mock('../../src/MyNovelReader/config', () => ({
  default: { download_delay: 0 },
}));
vi.mock('../../src/MyNovelReader/parser', () => ({
  default: class MockParser {
    site: unknown;
    doc: unknown;
    nextUrl: string | null;
    chapterTitle = '';
    contentTxt = '';
    content = '';
    isTheEnd = false;

    constructor(site: unknown, doc: unknown, nextUrl?: string) {
      this.site = site;
      this.doc = doc;
      this.nextUrl = nextUrl ?? null;
    }

    async getAll() {
      return this as never;
    }
  },
}));
vi.mock('../../src/MyNovelReader/components/message', () => ({ loading: loadingMock }));
vi.mock('../../src/MyNovelReader/utils', () => ({
  saveAs: saveAsMock,
  isWindows: false,
}));
vi.mock('../../src/MyNovelReader/utils/getNumFromChapterTitle', () => ({
  default: (title: string) => {
    const match = title.match(/\d+/);
    return match ? Number(match[0]) : 0;
  },
}));
vi.mock('../../src/MyNovelReader/lib', () => ({
  sleep: sleepMock,
  C: logger,
}));
vi.mock('../../src/MyNovelReader/request', () => ({
  HttpRequest: vi.fn().mockImplementation(() => ({ send: vi.fn().mockResolvedValue(null) })),
  IframeRequest: vi.fn().mockImplementation(() => ({ send: vi.fn().mockResolvedValue(null) })),
}));

const resetInstance = () => {
  (SaveManager as unknown as { instance?: unknown }).instance = undefined;
};

const buildParser = (overrides: Partial<Record<string, unknown>> = {}) =>
  ({
    bookTitle: 'My Book',
    chapterTitle: 'Chapter 1',
    contentTxt: 'Content 1',
    content: '',
    nextUrl: null,
    isTheEnd: false,
    ...overrides,
  }) as never;

beforeEach(() => {
  resetInstance();
  saveAsMock.mockClear();
  loadingMock.mockClear();
  sleepMock.mockClear();
  logger.error.mockClear();
  logger.warn.mockClear();
  (globalThis as unknown as { alert: unknown }).alert = vi.fn();
  (globalThis as unknown as { $: unknown }).$ = Object.assign(() => ({}), { nano: undefined });
});

afterEach(() => {
  resetInstance();
});

describe('SaveManager.saveAsTxt guard clauses', () => {
  it('skips saving when site is missing', async () => {
    const manager = SaveManager.getInstance();

    await manager.saveAsTxt({ site: null as never, parsers: [] });

    expect(logger.error).toHaveBeenCalled();
    expect(manager.isSavingInProgress()).toBe(false);
  });

  it('skips saving when there are no parsed chapters', async () => {
    const manager = SaveManager.getInstance();

    await manager.saveAsTxt({ site: {} as never, parsers: [] });

    expect(logger.warn).toHaveBeenCalled();
    expect(manager.isSavingInProgress()).toBe(false);
  });

  it('alerts when a save is already in progress', async () => {
    const manager = SaveManager.getInstance();
    (manager as unknown as { isSaving: boolean }).isSaving = true;

    await manager.saveAsTxt({ site: {} as never, parsers: [buildParser()] });

    expect(globalThis.alert).toHaveBeenCalled();
  });
});

describe('SaveManager file naming', () => {
  it('aggregates chapters and builds filename with range', async () => {
    const manager = SaveManager.getInstance();
    const parsers = [
      buildParser({ chapterTitle: 'Chapter 1', contentTxt: 'One' }),
      buildParser({ chapterTitle: 'Chapter 2', contentTxt: 'Two', nextUrl: null }),
    ];

    await manager.saveAsTxt({ site: { useiframe: false } as never, parsers });

    expect(saveAsMock).toHaveBeenCalledWith(
      'Chapter 1\n\nOne\n\nChapter 2\n\nTwo',
      'My Book(1 - 2,共2章).txt'
    );
    expect(loadingMock).toHaveBeenCalledTimes(2);
    expect(manager.isSavingInProgress()).toBe(false);
  });

  it('handles missing chapter numbers when building filename', () => {
    const manager = SaveManager.getInstance();
    const internal = manager as unknown as {
      fileName: { bookTitle: string; start: number; end: number; ext: string };
      chapters: string[];
      buildFileName: () => string;
    };
    internal.fileName = { bookTitle: 'Book', start: 0, end: 0, ext: '.txt' };
    internal.chapters = [];

    expect(internal.buildFileName()).toBe('Book( - ,共0章).txt');
  });
});
