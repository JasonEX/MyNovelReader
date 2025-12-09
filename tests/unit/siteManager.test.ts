import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SiteConfig } from '../../src/typings/MyNovelReader';
import { SiteManager } from '../../src/MyNovelReader/app/site/SiteManager';

const settingMock = vi.hoisted(() => ({
  customSiteinfo: '',
  customReplaceRules: '',
  booklink_enable: false,
  launchMode: 'auto',
}));

const ruleModuleMock = vi.hoisted(() => ({
  customRules: [] as SiteConfig[],
  specialSite: [] as SiteConfig[],
  customReplace: {} as Record<string, string>,
  parseCustomReplaceRules: vi.fn(),
  titleRegExp: /小说/,
}));

const CMock = vi.hoisted(() => ({ log: vi.fn(), error: vi.fn() }));
const L_getValue = vi.hoisted(() => vi.fn());
const L_removeValue = vi.hoisted(() => vi.fn());
const toRE = vi.hoisted(
  () => (pattern: string | RegExp) => (pattern instanceof RegExp ? pattern : new RegExp(pattern))
);

vi.mock('../../src/MyNovelReader/Setting', () => ({
  default: settingMock,
}));

vi.mock('../../src/MyNovelReader/rule', () => ({
  __esModule: true,
  default: ruleModuleMock,
}));

vi.mock('../../src/MyNovelReader/lib', () => ({
  C: CMock,
  L_getValue,
  L_removeValue,
  toRE,
}));

vi.mock('../../src/MyNovelReader/config', () => ({
  __esModule: true,
  default: { soduso: false },
}));

const resetInstance = () => {
  (SiteManager as unknown as { instance?: unknown }).instance = undefined;
};

let gmGetValueMock: ReturnType<typeof vi.fn>;

const setLocation = (href: string) => {
  const url = new URL(href);
  Object.defineProperty(window, 'location', {
    value: { href: url.href, host: url.host } as Location,
    configurable: true,
  });
};

beforeEach(() => {
  resetInstance();
  ruleModuleMock.customRules.length = 0;
  ruleModuleMock.specialSite.length = 0;
  settingMock.booklink_enable = false;
  settingMock.launchMode = 'auto';
  L_getValue.mockReset();
  L_removeValue.mockReset();
  gmGetValueMock = vi.fn();
  vi.stubGlobal('GM_getValue', gmGetValueMock);
  vi.stubGlobal('$', undefined);
  Object.defineProperty(document, 'referrer', { value: '', configurable: true });
  setLocation('https://example.com');
});

afterEach(() => {
  resetInstance();
  vi.restoreAllMocks();
  vi.unstubAllGlobals?.();
});

describe('SiteManager.getCurSiteInfo', () => {
  it('matches current url against available rules', () => {
    ruleModuleMock.customRules.push({ url: 'example.com', siteName: 'Example' } as SiteConfig);
    const manager = SiteManager.getInstance();

    setLocation('https://example.com/book/1');

    const info = manager.getCurSiteInfo();

    expect(info?.siteName).toBe('Example');
  });

  it('returns null when no rules match', () => {
    const manager = SiteManager.getInstance();

    setLocation('https://no-match.com');

    expect(manager.getCurSiteInfo()).toBeNull();
  });
});

describe('SiteManager.isAutoLaunch', () => {
  it('returns false and clears disable flag when disabled once', () => {
    const manager = SiteManager.getInstance();
    L_getValue.mockReturnValue('true');

    const result = manager.isAutoLaunch({} as SiteConfig);

    expect(result).toBe(false);
    expect(L_removeValue).toHaveBeenCalledWith('mynoverlreader_disable_once');
  });

  it('enables auto launch when referred from booklink', () => {
    const manager = SiteManager.getInstance();
    settingMock.booklink_enable = true;
    L_getValue.mockReturnValue('');
    Object.defineProperty(document, 'referrer', {
      value: 'https://booklink.me/abc',
      configurable: true,
    });

    expect(manager.isAutoLaunch({} as SiteConfig)).toBe(true);
  });

  it('returns -1 on tieba when title does not match blocklist', () => {
    const manager = SiteManager.getInstance();
    setLocation('https://tieba.baidu.com/p/1');
    vi.stubGlobal(
      '$',
      vi.fn(() => ({ text: () => '普通帖子' }))
    );
    ruleModuleMock.titleRegExp = /小说/;

    expect(manager.isAutoLaunch({} as SiteConfig)).toBe(-1);
  });

  it('honors manual launch mode', () => {
    const manager = SiteManager.getInstance();
    settingMock.launchMode = 'manual';

    expect(manager.isAutoLaunch({} as SiteConfig)).toBe(false);
  });

  it('auto launches when launchMode is auto', () => {
    const manager = SiteManager.getInstance();
    settingMock.launchMode = 'auto';
    gmGetValueMock.mockReturnValueOnce(false);

    expect(manager.isAutoLaunch({} as SiteConfig)).toBe(true);
  });

  it('respects GM auto flag even if mode is unknown', () => {
    const manager = SiteManager.getInstance();
    settingMock.launchMode = 'unknown';
    gmGetValueMock.mockReturnValueOnce(true);

    expect(manager.isAutoLaunch({} as SiteConfig)).toBe(true);
  });
});
