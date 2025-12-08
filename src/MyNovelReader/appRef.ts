// 共享 App 引用，用于解决循环依赖

export interface IApp {
  // 状态属性
  isEnabled?: boolean;
  curPageUrl?: string | null;
  activeUrl?: string | null;
  site?: { useSiteFont?: boolean } | null;
  siteFontInfo?: { siteFontFamily?: string } | null;
  curFocusElement?: HTMLElement | null;
  oArticles?: string[];

  // 方法
  toggle?: () => Promise<void> | void;
  openUrl?: (url?: string | null) => void;
  resetCache?: () => void;
  saveAsTxt?: () => Promise<void> | void;
}

let _app: IApp | null = null;

export function setApp(app: IApp): void {
  _app = app;
}

export function getApp(): IApp | null {
  return _app;
}
