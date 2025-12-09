export type UISkinName = string;
export type UISkinMap = Record<UISkinName, string>;

export interface UITemplates {
  tpl_footer_nav: string;
}

export type UIElement = JQuery<HTMLElement>;
export type UIElementKey = 'menu' | 'menuBar' | 'content' | 'preferencesBtn';
export type UINoticeElement = JQuery<HTMLElement> | HTMLElement | null;

export interface IUIStyleManager {
  refreshMainStyle(): void;
  refreshSkinStyle(skinName: UISkinName, isFirst?: boolean): void;
  refreshExtraStyle(css: string): void;
  calcContentFontSize(fontSizeStr: string): string;
  calcTitleFontSize(fontSizeStr: string): string;
  hideFooterNavStyle(hidden: boolean): void;
  fixMobile(): void;
  getSkinList(): UISkinMap;
  getSiteFontFamily(): string;
}

export interface IUIDOMManager {
  $menu: UIElement;
  $menuBar: UIElement;
  $content: UIElement;
  $preferencesBtn: UIElement;
  menu_list_hiddden: boolean;
  init(): void;
  hideMenuList(hidden?: boolean): void;
  hidePreferencesButton(hidden?: boolean): void;
  hideMenuBar(hidden?: boolean): void;
  getElement(key: UIElementKey): UIElement;
}

export interface IUIPreferencesManager {
  $prefs: UIElement | null;
  $blocker: UIElement | null;
  show(event?: Event): void;
  hide(): void;
  load(): void;
  close(): void;
  save(): void;
  clickHandler(target: HTMLInputElement): Promise<void>;
  cleanPreview(): void;
}

export interface IUINotificationManager {
  noticeDivto?: number;
  notice(htmlText: string, duration?: number): UINoticeElement;
}

export interface IUIInteractionManager {
  _isQuietMode: boolean;
  addButton(): Promise<void>;
  toggleQuietMode(force?: boolean): void;
  openHelp(): void;
}
