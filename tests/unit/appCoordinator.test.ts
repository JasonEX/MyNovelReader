import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Setting from '../../src/MyNovelReader/Setting';
import { AppCoordinator } from '../../src/MyNovelReader/app/core/AppCoordinator';

type SimpleSite = {
  loadCustomSetting: ReturnType<typeof vi.fn>;
  getCurSiteInfo: ReturnType<typeof vi.fn>;
  isAutoLaunch: ReturnType<typeof vi.fn>;
};

type SimpleFont = {
  resolveSiteFont: ReturnType<typeof vi.fn>;
};

const envCheckInit = vi.hoisted(() => vi.fn());
const logger = vi.hoisted(() => ({ warn: vi.fn(), error: vi.fn(), log: vi.fn() }));
const siteManagerMock = vi.hoisted<SimpleSite>(() => ({
  loadCustomSetting: vi.fn(),
  getCurSiteInfo: vi.fn(),
  isAutoLaunch: vi.fn(),
}));
const fontManagerMock = vi.hoisted<SimpleFont>(() => ({
  resolveSiteFont: vi.fn(),
}));

vi.mock('../../src/MyNovelReader/Setting', () => ({
  default: { debug: false, preloadNextPage: false },
}));

vi.mock('../../src/MyNovelReader/envCheck', () => ({ envCheckInit }));

vi.mock('../../src/MyNovelReader/lib', () => ({
  C: logger,
  L_removeValue: vi.fn(),
  L_setValue: vi.fn(),
}));

vi.mock('../../src/MyNovelReader/parser', () => ({ default: vi.fn() }));
vi.mock('../../src/MyNovelReader/UI', () => ({
  default: {
    addButton: vi.fn(),
    init: vi.fn(),
    hideMenuList: vi.fn(),
    preferencesShow: vi.fn(),
    toggleQuietMode: vi.fn(),
    hide: vi.fn(),
    openHelp: vi.fn(),
    notice: vi.fn(),
  },
}));
vi.mock('../../src/MyNovelReader/inject', () => ({ cleanupEvents: vi.fn() }));
vi.mock('../../src/MyNovelReader/app/index', () => ({ runVue: vi.fn() }));
vi.mock('../../src/MyNovelReader/app/document/DocumentManager', () => ({
  default: {
    setSite: vi.fn(),
    prepDocument: vi.fn(),
    initDocument: vi.fn(),
    cleanAgain: vi.fn(),
  },
}));
vi.mock('../../src/MyNovelReader/app/request/RequestManager', () => ({
  default: {
    init: vi.fn(),
    getRequest: vi.fn(),
    getRequestUrl: vi.fn(),
    getLastRequestUrl: vi.fn(),
    getCurPageUrl: vi.fn(),
    getIsTheEnd: vi.fn(),
  },
}));
vi.mock('../../src/MyNovelReader/app/ui/UIController', () => ({
  default: { init: vi.fn(), registerControls: vi.fn() },
}));
vi.mock('../../src/MyNovelReader/app/bus', () => ({
  default: { emit: vi.fn() },
  SHOW_SPEECH: 'show-speech',
}));
vi.mock('../../src/MyNovelReader/app/site/SiteManager', () => {
  class MockSiteManager {
    loadCustomSetting = siteManagerMock.loadCustomSetting;
    getCurSiteInfo = siteManagerMock.getCurSiteInfo;
    isAutoLaunch = siteManagerMock.isAutoLaunch;
  }
  return { default: siteManagerMock, SiteManager: MockSiteManager };
});
vi.mock('../../src/MyNovelReader/app/font/FontManager', () => {
  class MockFontManager {
    resolveSiteFont = fontManagerMock.resolveSiteFont;
  }
  return { default: fontManagerMock, FontManager: MockFontManager };
});

const resetInstance = () => {
  (AppCoordinator as unknown as { instance?: unknown }).instance = undefined;
};

beforeEach(() => {
  resetInstance();
  siteManagerMock.getCurSiteInfo.mockReset();
  siteManagerMock.isAutoLaunch.mockReset();
  window.name = '';
  window.location.href = 'https://example.com/';
});

afterEach(() => {
  resetInstance();
  vi.clearAllMocks();
});

describe('AppCoordinator.checkEnvironment', () => {
  it('returns false when running in blocked iframe name', () => {
    window.name = 'mynovelreader-iframe';
    const coordinator = AppCoordinator.getInstance(
      siteManagerMock as never,
      fontManagerMock as never
    );
    expect(coordinator.checkEnvironment()).toBe(false);
  });

  it('strips hash flag and stops launch when URL contains #mynovelreader', () => {
    const originalLocation = window.location;
    const stubLocation = { href: 'https://example.com/page#mynovelreader' } as Location;
    Object.defineProperty(window, 'location', { value: stubLocation, configurable: true });

    const replaceSpy = vi
      .spyOn(history, 'replaceState')
      .mockImplementation((_state, _title, url) => {
        stubLocation.href = url as string;
      });

    const coordinator = AppCoordinator.getInstance(
      siteManagerMock as never,
      fontManagerMock as never
    );
    const result = coordinator.checkEnvironment();

    expect(replaceSpy).toHaveBeenCalled();
    expect(stubLocation.href).toBe('https://example.com/page');
    expect(result).toBe(false);

    Object.defineProperty(window, 'location', { value: originalLocation, configurable: true });
  });

  it('invokes envCheckInit when debug mode is enabled', () => {
    (Setting as unknown as { debug: boolean }).debug = true;
    const coordinator = AppCoordinator.getInstance(
      siteManagerMock as never,
      fontManagerMock as never
    );

    expect(coordinator.checkEnvironment()).toBe(true);
    expect(envCheckInit).toHaveBeenCalled();
  });
});

describe('AppCoordinator site helpers', () => {
  it('returns empty site when resolver yields nothing', () => {
    siteManagerMock.getCurSiteInfo.mockReturnValueOnce(null);
    const coordinator = AppCoordinator.getInstance(
      siteManagerMock as never,
      fontManagerMock as never
    );

    const site = coordinator.resolveSite();
    expect(site).toEqual({ siteName: '', url: '', exampleUrl: '' });
  });

  it('delegates auto launch decision to site manager', () => {
    siteManagerMock.isAutoLaunch.mockReturnValueOnce(true);
    const coordinator = AppCoordinator.getInstance(
      siteManagerMock as never,
      fontManagerMock as never
    );

    const site = { siteName: 'foo', url: 'http://a', exampleUrl: 'http://a' } as never;
    expect(coordinator.isAutoLaunch(site)).toBe(true);
    expect(siteManagerMock.isAutoLaunch).toHaveBeenCalledWith(site);
  });
});
