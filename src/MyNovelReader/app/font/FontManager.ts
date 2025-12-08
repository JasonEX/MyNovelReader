import type { AppContext, SiteFontInfo } from '../core/AppState';
import type { SiteConfig } from '../../../typings/MyNovelReader';

class FontManager {
  private static instance: FontManager;

  private constructor() {}

  static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  resolveSiteFont(appContext: AppContext, site: SiteConfig | null): SiteFontInfo | null {
    if (!site?.useSiteFont) {
      return null;
    }

    if (typeof site.useSiteFont === 'string') {
      const trimmed = site.useSiteFont.trim();
      const siteFontFamily = trimmed
        ? trimmed.endsWith(',')
          ? trimmed
          : `${trimmed},`
        : undefined;
      return { external: [], internal: [], family: [], siteFontFamily };
    }

    const siteFontInfo =
      (typeof appContext.getSiteFontInfo === 'function' ? appContext.getSiteFontInfo() : null) ??
      this.getSiteFontInfo();

    return siteFontInfo;
  }

  getSiteFontInfo(): SiteFontInfo {
    const fonts: SiteFontInfo = { external: [], internal: [], family: [] };

    try {
      if (document.fonts && typeof document.fonts.forEach === 'function') {
        document.fonts.forEach(font => fonts.family.push(font.family));
      }
    } catch {
      // ignore font read errors caused by browser limitations
    }

    for (const styleSheet of Array.from(document.styleSheets ?? [])) {
      try {
        for (const cssRule of Array.from(styleSheet.cssRules ?? [])) {
          if (cssRule instanceof CSSFontFaceRule) {
            const fontFamily = cssRule.style.fontFamily;
            const cssText = cssRule.cssText;
            if (!fonts.internal.find(item => item.fontFamily === fontFamily)) {
              fonts.internal.push({ fontFamily, cssText });
            }
          }
        }
      } catch {
        const href = styleSheet.href;
        if (href && !fonts.external.includes(href)) {
          fonts.external.push(href);
        }
      }
    }

    const familyList: string[] = [];

    fonts.internal.forEach(font => {
      if (!familyList.includes(font.fontFamily)) {
        familyList.push(font.fontFamily);
      }
    });

    fonts.family.forEach(fontFamily => {
      if (!familyList.includes(fontFamily)) {
        familyList.push(fontFamily);
      }
    });

    if (familyList.length) {
      fonts.siteFontFamily = familyList
        .map(fontName => (fontName.includes(' ') ? `"${fontName}"` : fontName))
        .join(',');
      fonts.siteFontFamily += ',';
    }

    return fonts;
  }

  injectSiteFontStyles(site: SiteConfig | null, fontInfo: SiteFontInfo | null): void {
    if (!site?.useSiteFont || !fontInfo) {
      return;
    }

    const internalCss = fontInfo.internal?.map(font => font.cssText).join('\n') ?? '';

    if (!internalCss.trim()) {
      return;
    }

    document.querySelectorAll('style.siteFont').forEach(style => style.remove());

    const styleElement =
      (GM_addStyle(internalCss) as unknown as HTMLStyleElement | null | undefined) ?? null;

    if (styleElement instanceof HTMLStyleElement) {
      styleElement.classList.add('noRemove', 'siteFont');
      return;
    }

    const fallbackStyle = document.createElement('style');
    fallbackStyle.className = 'noRemove siteFont';
    fallbackStyle.textContent = internalCss;
    document.head.appendChild(fallbackStyle);
  }
}

const fontManager = FontManager.getInstance();

export { FontManager, fontManager };
export default fontManager;
