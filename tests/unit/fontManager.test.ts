import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FontManager } from '../../src/MyNovelReader/app/font/FontManager';

class FakeCSSFontFaceRule {
  style: { fontFamily: string };
  cssText: string;

  constructor(fontFamily: string, cssText: string) {
    this.style = { fontFamily };
    this.cssText = cssText;
  }
}

let fontManager: FontManager;

const resetInstance = () => {
  (FontManager as unknown as { instance?: unknown }).instance = undefined;
};

beforeEach(() => {
  resetInstance();
  (globalThis as unknown as { CSSFontFaceRule: unknown }).CSSFontFaceRule = FakeCSSFontFaceRule;
  Object.defineProperty(document, 'styleSheets', {
    value: [],
    configurable: true,
  });
  Object.defineProperty(document, 'fonts', {
    value: { forEach: (_cb: (_font: { family: string }) => void) => undefined },
    configurable: true,
  });
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  (globalThis as unknown as { GM_addStyle: unknown }).GM_addStyle = (css: string) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  };
  fontManager = FontManager.getInstance();
});

afterEach(() => {
  resetInstance();
});

describe('FontManager.resolveSiteFont', () => {
  it('returns null when site does not request site font', () => {
    const appContext = {} as never;
    const result = fontManager.resolveSiteFont(appContext, {
      siteName: '',
      url: '',
      exampleUrl: '',
    });
    expect(result).toBeNull();
  });

  it('returns trimmed site font family when useSiteFont is a string', () => {
    const appContext = {} as never;
    const result = fontManager.resolveSiteFont(appContext, {
      useSiteFont: '  MySiteFont  ',
    } as never);

    expect(result?.siteFontFamily).toBe('MySiteFont,');
    expect(result?.family).toEqual([]);
  });

  it('prefers appContext.getSiteFontInfo when provided', () => {
    const siteFontInfo = {
      external: [],
      internal: [],
      family: ['Custom'],
      siteFontFamily: 'Custom,',
    };
    const appContext = { getSiteFontInfo: () => siteFontInfo } as never;
    const result = fontManager.resolveSiteFont(appContext, { useSiteFont: true } as never);

    expect(result).toBe(siteFontInfo);
  });
});

describe('FontManager.getSiteFontInfo', () => {
  it('collects font faces, external style sheets, and builds family string', () => {
    const internalRule = new FakeCSSFontFaceRule(
      'My Font',
      '@font-face { font-family: "My Font"; }'
    );
    const styleSheets = [
      { cssRules: [internalRule] },
      {
        href: 'https://cdn.example.com/font.css',
        get cssRules() {
          throw new Error('cross origin');
        },
      },
    ];

    Object.defineProperty(document, 'styleSheets', {
      value: styleSheets,
      configurable: true,
    });
    Object.defineProperty(document, 'fonts', {
      value: {
        forEach: (cb: (_font: { family: string }) => void) => {
          cb({ family: 'SystemFont' });
        },
      },
      configurable: true,
    });

    const info = fontManager.getSiteFontInfo();

    expect(info.internal).toEqual([
      { fontFamily: 'My Font', cssText: '@font-face { font-family: "My Font"; }' },
    ]);
    expect(info.external).toEqual(['https://cdn.example.com/font.css']);
    expect(info.family).toContain('SystemFont');
    expect(info.siteFontFamily).toBe('"My Font",SystemFont,');
  });
});

describe('FontManager.injectSiteFontStyles', () => {
  it('injects internal css into a style element with marker classes', () => {
    const internal = [{ fontFamily: 'Test', cssText: 'body { font-family: Test; }' }];
    const fontInfo = { external: [], internal, family: [], siteFontFamily: 'Test,' };
    const site = { useSiteFont: true } as never;

    const existing = document.createElement('style');
    existing.className = 'siteFont';
    document.head.appendChild(existing);

    fontManager.injectSiteFontStyles(site, fontInfo);

    const injected = Array.from(document.querySelectorAll('style.siteFont'));
    expect(injected).toHaveLength(1);
    expect(injected[0].classList.contains('noRemove')).toBe(true);
    expect(injected[0].textContent).toContain('font-family: Test');
  });
});
