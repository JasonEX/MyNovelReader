export interface AppStatus {
  isEnabled: boolean;
  currentUrl: string | null;
  activeUrl: string | null;
}

export interface IAppContext {
  // 状态查询
  getStatus(): AppStatus;
  getSiteFontFamily(): string;
  getPreviewArticle(): HTMLElement | null;

  // 操作
  toggle(): Promise<void>;
  openUrl(url: string): void;
  openCurrent(): void;
  saveAsTxt(): Promise<void>;
  applyCustomReplaceRules(rulesText: string): { html: string };
}

export type IUIService = IAppContext;
