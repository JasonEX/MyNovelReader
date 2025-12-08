import Parser from '../../parser';
import Rule from '../../rule';
import { getApp, type IApp } from '../../appRef';
import type { IUIService, AppStatus } from './IAppContext';

class UIServiceImpl implements IUIService {
  getStatus(): AppStatus {
    const app = this.getApp();
    const currentUrl = this.normalizeUrl(app?.curPageUrl);
    const activeUrl = this.normalizeUrl(app?.activeUrl);

    return {
      isEnabled: Boolean(app?.isEnabled),
      currentUrl,
      activeUrl,
    };
  }

  getSiteFontFamily(): string {
    const app = this.getApp();
    const siteUsesFont = Boolean(app?.site?.useSiteFont);
    const siteFontFamily = app?.siteFontInfo?.siteFontFamily;

    if (siteUsesFont && typeof siteFontFamily === 'string') {
      return siteFontFamily;
    }

    return '';
  }

  getPreviewArticle(): HTMLElement | null {
    const app = this.getApp();
    return (app?.curFocusElement as HTMLElement | null) ?? null;
  }

  async toggle(): Promise<void> {
    await this.getApp()?.toggle?.();
  }

  openUrl(url: string): void {
    const target = this.normalizeUrl(url);

    if (!target) {
      return;
    }

    this.getApp()?.openUrl?.(target);
  }

  openCurrent(): void {
    const { activeUrl, currentUrl } = this.getStatus();
    const target = activeUrl || currentUrl;

    if (target) {
      this.openUrl(target);
    }
  }

  async saveAsTxt(): Promise<void> {
    await this.getApp()?.saveAsTxt?.();
  }

  applyCustomReplaceRules(rulesText: string): { html: string } {
    const app = this.getApp();
    const articles = Array.isArray(app?.oArticles) ? app.oArticles : [];
    const html = this.applyRulesOnArticles(articles, rulesText);

    app?.resetCache?.();

    return { html };
  }

  private applyRulesOnArticles(articles: unknown[], rulesText: string): string {
    const contentHtml = articles.map(article => String(article ?? '')).join('\n');

    if (!contentHtml || !rulesText) {
      return contentHtml;
    }

    const replaceRules = Rule.parseCustomReplaceRules(rulesText) as Record<string, string>;
    return Parser.prototype.replaceHtml(contentHtml, replaceRules);
  }

  private getApp(): IApp | null {
    return getApp();
  }

  private normalizeUrl(url: string | null | undefined): string | null {
    if (typeof url !== 'string') {
      return null;
    }
    const trimmed = url.trim();
    return trimmed ? trimmed : null;
  }
}

const uiService = new UIServiceImpl();

export { UIServiceImpl, uiService };
export default uiService;
