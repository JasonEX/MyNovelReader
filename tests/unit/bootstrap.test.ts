import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

let configStore: {
  load: () => Promise<void>;
  protection: {
    blockRedirects: boolean;
    enableRightClick: boolean;
    enableSelection: boolean;
    blockPopups: boolean;
    mode: 'normal' | 'aggressive';
  };
};
let ruleStore: { initialize: () => Promise<void> };
let readerStore: {
  activate: () => void;
  deactivate: () => void;
  setChapter: (chapter: { url?: string }, rule?: unknown) => void;
  currentChapterIndex: number;
  chapters: Array<{ chapter: { url?: string } }>;
};

const {
  mockActivateProtection,
  mockGetAutoEnableManager,
  mockGetSitePreference,
  mockSetSitePreference,
} = vi.hoisted(() => ({
  mockActivateProtection: vi.fn(),
  mockGetAutoEnableManager: vi.fn(),
  mockGetSitePreference: vi.fn(),
  mockSetSitePreference: vi.fn(),
}));

vi.mock('@/core', () => ({
  getAutoEnableManager: (opts: unknown) => mockGetAutoEnableManager(opts),
  getSiteProtection: () => ({ activate: mockActivateProtection }),
}));

vi.mock('@/core/rules/RuleStorage', () => ({
  getRuleStorage: () => ({
    getSitePreference: mockGetSitePreference,
    setSitePreference: mockSetSitePreference,
  }),
}));

vi.mock('@/ui/stores', () => ({
  useConfigStore: () => configStore,
  useRuleStore: () => ruleStore,
  useReaderStore: () => readerStore,
  THEMES: [],
}));

vi.mock('@/ui/components/reader', async () => {
  const { defineComponent, h } = await import('vue');
  return {
    ReaderView: defineComponent({
      name: 'ReaderViewStub',
      render: () => h('div', { id: 'reader-view-stub' }, 'reader'),
    }),
  };
});

vi.mock('@/ui/components/detection', async () => {
  const { defineComponent } = await import('vue');
  return {
    DetectionPrompt: defineComponent({
      name: 'DetectionPromptStub',
      props: {
        onRespond: { type: Function, required: false },
      },
      setup(props) {
        Promise.resolve().then(() => {
          (
            props as unknown as {
              onRespond?: (r: { accepted: boolean; saveForDomain: boolean }) => void;
            }
          ).onRespond?.({ accepted: true, saveForDomain: false });
        });
        return () => null;
      },
    }),
  };
});

describe('bootstrap', () => {
  let dom: JSDOM;

  beforeEach(() => {
    vi.resetModules();
    mockActivateProtection.mockReset();
    mockGetAutoEnableManager.mockReset();
    mockGetSitePreference.mockReset();
    mockSetSitePreference.mockReset();

    configStore = {
      load: vi.fn(async () => {}),
      protection: {
        blockRedirects: true,
        enableRightClick: false,
        enableSelection: false,
        blockPopups: true,
        mode: 'normal',
      },
    };
    ruleStore = { initialize: vi.fn(async () => {}) };
    readerStore = {
      activate: vi.fn(),
      deactivate: vi.fn(),
      setChapter: vi.fn((chapter: { url?: string }) => {
        readerStore.chapters = [{ chapter: { url: chapter.url } }];
        readerStore.currentChapterIndex = 0;
      }),
      currentChapterIndex: 0,
      chapters: [],
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('activates early protection for chapter-like URLs (conservative)', async () => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/12345.html',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = dom.window.sessionStorage;

    await import('@/bootstrap');

    expect(mockActivateProtection).toHaveBeenCalledWith(
      expect.objectContaining({
        blockRedirects: true,
        blockPopups: true,
        clearTimers: true,
      })
    );
  });

  it('shows floating button when skip flag is set', async () => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/index.html',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = dom.window.sessionStorage;

    const manager = {
      check: vi.fn(async () => ({ shouldEnable: true })),
      setPromptCallback: vi.fn(),
      setLaunchCallback: vi.fn(),
      execute: vi.fn(async () => {}),
      manualEnable: vi.fn(async () => {}),
    };
    mockGetAutoEnableManager.mockReturnValue(manager);

    const bootstrap = await import('@/bootstrap');

    sessionStorage.setItem('mnr_skip_auto_enable', Date.now().toString());
    await bootstrap.initialize();

    expect(document.getElementById('mnr-floating-btn')).not.toBeNull();
    expect(sessionStorage.getItem('mnr_skip_auto_enable')).toBeNull();
    expect(manager.check).not.toHaveBeenCalled();
    expect(configStore.load).toHaveBeenCalledTimes(1);
    expect(ruleStore.initialize).toHaveBeenCalledTimes(1);
  });

  it('runs auto-enable prompt and mounts reader UI when accepted', async () => {
    vi.useFakeTimers();

    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/book/1',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = dom.window.sessionStorage;

    const decision = { shouldEnable: true, method: 'detection' };
    const chapter = { title: 't', content: 'c', rawContent: 'c', url: dom.window.location.href };

    let promptCb: ((d: unknown) => Promise<unknown>) | null = null;
    let launchCb: ((c: unknown, r?: unknown) => void) | null = null;

    const manager = {
      check: vi.fn(async () => decision),
      setPromptCallback: vi.fn((cb: (d: unknown) => Promise<unknown>) => {
        promptCb = cb;
      }),
      setLaunchCallback: vi.fn((cb: (c: unknown, r?: unknown) => void) => {
        launchCb = cb;
      }),
      execute: vi.fn(async () => {
        if (promptCb) {
          const res = (await promptCb(decision)) as { accepted?: boolean };
          if (res?.accepted && launchCb) launchCb(chapter);
        } else if (launchCb) {
          launchCb(chapter);
        }
      }),
      manualEnable: vi.fn(async () => {}),
    };
    mockGetAutoEnableManager.mockReturnValue(manager);

    const bootstrap = await import('@/bootstrap');

    const initPromise = bootstrap.initialize();
    await vi.runAllTimersAsync();
    await initPromise;

    expect(bootstrap.isActive()).toBe(true);
    expect(document.getElementById('mnr-reader-root')).not.toBeNull();
    expect(document.getElementById('mnr-hide-original')).not.toBeNull();
    expect(readerStore.activate).toHaveBeenCalledTimes(1);
    expect(readerStore.setChapter).toHaveBeenCalledTimes(1);

    const host = document.getElementById('mnr-reader-root') as HTMLElement;
    expect(host.shadowRoot?.querySelector('#reader-view-stub')).not.toBeNull();
  });

  it('closeReader restores page and saves site preference for chapter pages', async () => {
    // Import the module on a non-chapter page to avoid auto-bootstrap side effects.
    const domInit = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/index.html',
      pretendToBeVisual: true,
    });
    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = domInit.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = domInit.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = domInit.window.sessionStorage;

    const bootstrap = await import('@/bootstrap');

    // Switch to a chapter URL before initializing (entryPageKind should be 'chapter').
    const domChapter = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/chapter/1',
      pretendToBeVisual: true,
    });
    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = domChapter.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = domChapter.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = domChapter.window.sessionStorage;

    const decision = { shouldEnable: true, method: 'detection' };
    const chapter = {
      title: 't',
      content: 'c',
      rawContent: 'c',
      url: domChapter.window.location.href,
    };
    let launchCb: ((c: unknown) => void) | null = null;

    const manager = {
      check: vi.fn(async () => decision),
      setPromptCallback: vi.fn(),
      setLaunchCallback: vi.fn((cb: (c: unknown) => void) => {
        launchCb = cb;
      }),
      execute: vi.fn(async () => {
        launchCb?.(chapter);
      }),
      manualEnable: vi.fn(async () => {}),
    };
    mockGetAutoEnableManager.mockReturnValue(manager);

    await bootstrap.initialize();
    expect(bootstrap.isActive()).toBe(true);

    bootstrap.closeReader();

    expect(mockSetSitePreference).toHaveBeenCalledWith(
      'example.com',
      expect.objectContaining({ enabled: false })
    );
    expect(readerStore.deactivate).toHaveBeenCalledTimes(1);
    expect(document.getElementById('mnr-reader-root')).toBeNull();
    expect(document.getElementById('mnr-hide-original')).toBeNull();
    expect(document.getElementById('mnr-floating-btn')).not.toBeNull();
    expect(bootstrap.isActive()).toBe(false);
  });

  it('manualEnable hides floating button and calls manager.manualEnable', async () => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/index.html',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = dom.window.sessionStorage;

    const manager = {
      check: vi.fn(async () => ({ shouldEnable: false })),
      setPromptCallback: vi.fn(),
      setLaunchCallback: vi.fn(),
      execute: vi.fn(async () => {}),
      manualEnable: vi.fn(async () => {}),
    };
    mockGetAutoEnableManager.mockReturnValue(manager);

    const bootstrap = await import('@/bootstrap');

    const button = document.createElement('button');
    button.id = 'mnr-floating-btn';
    document.body.appendChild(button);

    await bootstrap.manualEnable();

    expect(document.getElementById('mnr-floating-btn')).toBeNull();
    expect(manager.manualEnable).toHaveBeenCalledTimes(1);
  });
});
