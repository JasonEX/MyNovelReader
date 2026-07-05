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
  mockGetRuleManager,
  mockGetSitePreference,
  mockSetSitePreference,
} = vi.hoisted(() => ({
  mockActivateProtection: vi.fn(),
  mockGetAutoEnableManager: vi.fn(),
  mockGetRuleManager: vi.fn(),
  mockGetSitePreference: vi.fn(),
  mockSetSitePreference: vi.fn(),
}));

vi.mock('@/core/AutoEnableManager', () => ({
  getAutoEnableManager: (opts: unknown) => mockGetAutoEnableManager(opts),
}));

vi.mock('@/core/rules/RuleManager', () => ({
  getRuleManager: () => mockGetRuleManager(),
}));

vi.mock('@/core/protection', () => ({
  getSiteProtection: () => ({ activate: mockActivateProtection }),
}));

vi.mock('@/core/rules/RuleStorage', () => ({
  getRuleStorage: () => ({
    getSitePreference: mockGetSitePreference,
    setSitePreference: mockSetSitePreference,
  }),
}));

vi.mock('@/ui/stores/config', () => ({
  useConfigStore: () => configStore,
}));

vi.mock('@/ui/stores/reader', () => ({
  useReaderStore: () => readerStore,
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
              onRespond?: (r: { accepted: boolean; rememberForSite: boolean }) => void;
            }
          ).onRespond?.({ accepted: true, rememberForSite: false });
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
    mockGetRuleManager.mockReset();
    mockGetSitePreference.mockReset();
    mockSetSitePreference.mockReset();
    mockGetRuleManager.mockReturnValue({
      initialize: vi.fn(async () => {}),
      matchRule: vi.fn(async () => null),
    });

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
        clearTimers: false,
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
  });

  it('auto-bootstraps ambiguous section pages when an explicit rule matches', async () => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/24/18442_6.html',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = dom.window.sessionStorage;
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      get: () => 'complete',
    });

    const ruleManager = {
      initialize: vi.fn(async () => {}),
      matchRule: vi.fn(async () => ({
        rule: {
          id: 'paged-section',
          version: 1,
          match: { pattern: 'example' },
          content: { selector: '.con' },
        },
        source: 'builtin',
        matchedPattern: 'example',
      })),
    };
    mockGetRuleManager.mockReturnValue(ruleManager);

    const manager = {
      check: vi.fn(async () => ({ shouldEnable: true, method: 'builtin-rule' })),
      setPromptCallback: vi.fn(),
      setLaunchCallback: vi.fn(),
      execute: vi.fn(async () => {}),
      manualEnable: vi.fn(async () => {}),
    };
    mockGetAutoEnableManager.mockReturnValue(manager);

    await import('@/bootstrap');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(ruleManager.matchRule).toHaveBeenCalledWith('https://example.com/24/18442_6.html');
    expect(configStore.load).toHaveBeenCalledTimes(1);
    expect(manager.check).toHaveBeenCalledTimes(1);
    expect(manager.execute).toHaveBeenCalledTimes(1);
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
    document.title = 'Original Chapter Title';
    window.history.replaceState({ site: 'original' }, '', window.location.href);

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

    document.title = '第1章 - 示例书';
    window.history.replaceState({ mnr: true, mnrChapter: 0 }, '', window.location.href);

    bootstrap.closeReader();

    expect(mockSetSitePreference).toHaveBeenCalledWith(
      'example.com',
      expect.objectContaining({ enabled: false })
    );
    expect(readerStore.deactivate).toHaveBeenCalledTimes(1);
    expect(document.getElementById('mnr-reader-root')).toBeNull();
    expect(document.getElementById('mnr-hide-original')).toBeNull();
    expect(document.getElementById('mnr-floating-btn')).not.toBeNull();
    expect(document.title).toBe('Original Chapter Title');
    expect(window.history.state).toEqual({ site: 'original' });
    expect(bootstrap.isActive()).toBe(false);
  });

  it('closeReader keeps manual entry for rule-matched ambiguous chapter URLs', async () => {
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

    const domChapter = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://www.deqixs.org/24/18442_6.html',
      pretendToBeVisual: true,
    });
    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = domChapter.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = domChapter.window.document;
    // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
    globalThis.sessionStorage = domChapter.window.sessionStorage;

    const rule = {
      id: 'deqixs',
      version: 1,
      match: { pattern: 'deqixs' },
      content: { selector: '.con' },
      meta: { source: 'builtin' },
    };
    const chapter = {
      title: 't',
      content: 'c',
      rawContent: 'c',
      url: domChapter.window.location.href,
    };
    let launchCb: ((c: unknown, r?: unknown) => void) | null = null;

    const manager = {
      check: vi.fn(async () => ({ shouldEnable: true, method: 'builtin-rule', rule })),
      setPromptCallback: vi.fn(),
      setLaunchCallback: vi.fn((cb: (c: unknown, r?: unknown) => void) => {
        launchCb = cb;
      }),
      execute: vi.fn(async () => {
        launchCb?.(chapter, rule);
      }),
      manualEnable: vi.fn(async () => {}),
    };
    mockGetAutoEnableManager.mockReturnValue(manager);

    await bootstrap.initialize();
    expect(bootstrap.isActive()).toBe(true);

    bootstrap.closeReader();

    expect(mockSetSitePreference).toHaveBeenCalledWith(
      'www.deqixs.org',
      expect.objectContaining({ enabled: false })
    );
    expect(document.getElementById('mnr-floating-btn')).not.toBeNull();
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
