import { getActivePinia } from 'pinia';
import Parser from '../../parser';
import Rule from '../../rule';
import { getApp, type IApp, syncAppToStores } from '../../appRef';
import { useReaderStore } from '../../stores/readerStore';
import type { AppStatus, IUIService } from './IAppContext';

class UIServiceImpl implements IUIService {
  private readerStore: ReturnType<typeof useReaderStore> | null = null;

  getStatus(): AppStatus {
    this.syncStoreState();

    const store = this.getReaderStore();
    const legacyApp = this.getLegacyApp();
    const rawCurrentUrl = (store?.curPageUrl as string | null | undefined) ?? legacyApp?.curPageUrl;
    const rawActiveUrl = (store?.activeUrl as string | null | undefined) ?? legacyApp?.activeUrl;

    return {
      isEnabled: Boolean((store?.isEnabled as boolean | undefined) ?? legacyApp?.isEnabled),
      currentUrl: this.normalizeUrl(rawCurrentUrl),
      activeUrl: this.normalizeUrl(rawActiveUrl),
    };
  }

  getSiteFontFamily(): string {
    this.syncStoreState();

    const store = this.getReaderStore();
    const legacyApp = this.getLegacyApp();
    const siteUsesFont = Boolean(
      store?.site?.useSiteFont ?? (legacyApp?.site as { useSiteFont?: boolean } | null)?.useSiteFont
    );
    const siteFontFamily =
      store?.siteFontInfo?.siteFontFamily ?? legacyApp?.siteFontInfo?.siteFontFamily;

    if (siteUsesFont && typeof siteFontFamily === 'string') {
      return siteFontFamily;
    }

    return '';
  }

  getPreviewArticle(): HTMLElement | null {
    this.syncStoreState();
    const store = this.getReaderStore();

    if (store?.curFocusElement) {
      return (store.curFocusElement as HTMLElement | null) ?? null;
    }

    return (this.getLegacyApp()?.curFocusElement as HTMLElement | null) ?? null;
  }

  async toggle(): Promise<void> {
    await this.getLegacyApp()?.toggle?.();
  }

  openUrl(url: string): void {
    const target = this.normalizeUrl(url);

    if (!target) {
      return;
    }

    this.getLegacyApp()?.openUrl?.(target);
  }

  openCurrent(): void {
    const { activeUrl, currentUrl } = this.getStatus();
    const target = activeUrl || currentUrl;

    if (target) {
      this.openUrl(target);
    }
  }

  async saveAsTxt(): Promise<void> {
    await this.getLegacyApp()?.saveAsTxt?.();
  }

  applyCustomReplaceRules(rulesText: string): { html: string } {
    const app = this.getLegacyApp();
    const articles = this.getArticles(app);
    const html = this.applyRulesOnArticles(articles, rulesText);

    app?.resetCache?.();

    return { html };
  }

  private getReaderStore(): ReturnType<typeof useReaderStore> | null {
    if (this.readerStore) {
      return this.readerStore;
    }

    const activePinia = getActivePinia();
    if (!activePinia) {
      return null;
    }

    this.readerStore = useReaderStore(activePinia);
    return this.readerStore;
  }

  private getLegacyApp(): IApp | null {
    return getApp();
  }

  private syncStoreState(): void {
    syncAppToStores();
  }

  private applyRulesOnArticles(articles: unknown[], rulesText: string): string {
    const contentHtml = articles.map(article => String(article ?? '')).join('\n');

    if (!contentHtml || !rulesText) {
      return contentHtml;
    }

    const replaceRules = Rule.parseCustomReplaceRules(rulesText) as Record<string, string>;
    return Parser.prototype.replaceHtml(contentHtml, replaceRules);
  }

  private getArticles(app: IApp | null): unknown[] {
    if (Array.isArray(app?.oArticles)) {
      return app?.oArticles ?? [];
    }

    const nodes = document.querySelectorAll('article[id^=page-]');
    return Array.from(nodes).map(node => node.outerHTML);
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
