import type { UnderscoreStatic } from 'underscore';
import { getActivePinia } from 'pinia';
import Setting from './Setting';
import {
  UIDOMManager,
  UIInteractionManager,
  UINotificationManager,
  UIPreferencesManager,
  UIStyleManager,
} from './ui/managers';
import { type ConfigState, useConfigStore } from './stores/configStore';

declare const _: UnderscoreStatic;

type ConfigUpdates = Partial<ConfigState>;

let configStoreInstance: ReturnType<typeof useConfigStore> | null = null;

const getConfigStoreInstance = () => {
  if (configStoreInstance) {
    return configStoreInstance;
  }

  const activePinia = getActivePinia();
  if (!activePinia) {
    return null;
  }

  try {
    configStoreInstance = useConfigStore(activePinia);
    return configStoreInstance;
  } catch {
    return null;
  }
};

const syncConfigStore = (updates: ConfigUpdates): void => {
  const store = getConfigStoreInstance();
  if (!store) {
    return;
  }

  (Object.keys(updates) as Array<keyof ConfigState>).forEach(key => {
    const value = updates[key];
    if (typeof value !== 'undefined') {
      store.setSetting(key, value as ConfigState[typeof key]);
    }
  });
};

const styleManager = new UIStyleManager();
const domManager = new UIDOMManager();
const notificationManager = new UINotificationManager();
const interactionManager = new UIInteractionManager();
let preferencesManager: UIPreferencesManager = null as unknown as UIPreferencesManager;

interface UIType {
  tpl_footer_nav: string;
  styleManager: UIStyleManager;
  domManager: UIDOMManager;
  skins: Record<string, string>;
  siteFontFamily: string;
  menu_list_hiddden: boolean;
  _isQuietMode: boolean;
  noticeDivto?: number;
  $menu: JQuery<HTMLElement>;
  $menuBar: JQuery<HTMLElement>;
  $content: JQuery<HTMLElement>;
  $preferencesBtn: JQuery<HTMLElement>;
  $prefs: JQuery<HTMLElement> | null;
  $blocker: JQuery<HTMLElement> | null;
  $mainStyle: JQuery<HTMLElement> | null;
  $_quietStyle: JQuery<HTMLElement> | null;
  init(): void;
  refreshMainStyle(): void;
  hideFooterNavStyle(hidden: boolean): void;
  hideMenuList(hidden?: boolean): void;
  hidePreferencesButton(hidden?: boolean): void;
  hideMenuBar(hidden?: boolean): void;
  refreshSkinStyle(skinName: string, isFirst?: boolean): void;
  refreshExtraStyle(css: string): void;
  toggleQuietMode(force?: boolean): void;
  addButton(): Promise<void>;
  calcContentFontSize(fontSizeStr: string): string;
  calcTitleFontSize(fontSizeStr: string): string;
  fixMobile(): void;
  getSkinList(): Record<string, string>;
  preferencesShow(event?: Event): void;
  hide(): void;
  preferencesLoadHandler(): void;
  cleanPreview(): void;
  preferencesClickHandler(target: HTMLInputElement): Promise<void>;
  preferencesCloseHandler(): void;
  preferencesSaveHandler(): void;
  openHelp(): void;
  notice(htmlText: string, ms?: number): JQuery<HTMLElement>;
}

const UI: UIType = {
  tpl_footer_nav: '\
        <div class="chapter-footer-nav">\
            <a class="prev-page" href="{prevUrl}">上一页</a> | \
            <a class="index-page" href="{indexUrl}" title="Enter 键打开目录">目录</a> | \
            <a class="next-page" style="color:{theEndColor}" href="{nextUrl}">下一页</a>\
        </div>\
        '.uiTrans(),
  styleManager: styleManager,
  domManager: domManager,
  skins: styleManager.getSkinList(),
  // 站点字体
  siteFontFamily: '',
  menu_list_hiddden: false,
  get _isQuietMode() {
    return interactionManager._isQuietMode;
  },
  set _isQuietMode(value) {
    interactionManager._isQuietMode = value;
  },
  $menu: null as unknown as JQuery<HTMLElement>,
  $menuBar: null as unknown as JQuery<HTMLElement>,
  $content: null as unknown as JQuery<HTMLElement>,
  $preferencesBtn: null as unknown as JQuery<HTMLElement>,
  get $prefs() {
    return preferencesManager.$prefs;
  },
  set $prefs(value) {
    preferencesManager.$prefs = value;
  },
  get $blocker() {
    return preferencesManager.$blocker;
  },
  set $blocker(value) {
    preferencesManager.$blocker = value;
  },
  $mainStyle: null,
  get $_quietStyle() {
    return interactionManager.$_quietStyle;
  },
  set $_quietStyle(value) {
    interactionManager.$_quietStyle = value;
  },
  get noticeDivto() {
    return notificationManager.noticeDivto;
  },
  set noticeDivto(value) {
    notificationManager.noticeDivto = value;
  },

  init: function () {
    UI.refreshMainStyle();

    UI.refreshSkinStyle(String(Setting.skin_name), true);

    UI.refreshExtraStyle(String(Setting.extra_css));

    UI.fixMobile();

    domManager.init();
    UI.$menu = domManager.getElement('menu');
    UI.$menuBar = domManager.getElement('menuBar');
    UI.$content = domManager.getElement('content');
    UI.$preferencesBtn = domManager.getElement('preferencesBtn');
    UI.menu_list_hiddden = domManager.menu_list_hiddden;

    // 初始化是否隐藏
    if (Setting.hide_footer_nav) {
      UI.hideFooterNavStyle(true);
    }

    // UI.toggleQuietMode();  // 初始化安静模式
    UI.hideMenuList(Boolean(Setting.menu_list_hiddden)); // 初始化章节列表是否隐藏
    UI.hidePreferencesButton(Boolean(Setting.hide_preferences_button)); // 初始化设置按钮是否隐藏
  },
  refreshMainStyle: function () {
    UI.styleManager.refreshMainStyle();
    UI.siteFontFamily = UI.styleManager.getSiteFontFamily();
  },
  hideFooterNavStyle: function (hidden) {
    UI.styleManager.hideFooterNavStyle(hidden);
  },
  hideMenuList: function (hidden) {
    domManager.hideMenuList(hidden);
    UI.menu_list_hiddden = domManager.menu_list_hiddden;
  },
  hidePreferencesButton: function (hidden) {
    domManager.hidePreferencesButton(hidden);
  },
  hideMenuBar: function (hidden) {
    domManager.hideMenuBar(hidden);
  },
  refreshSkinStyle: function (skin_name, isFirst) {
    UI.styleManager.refreshSkinStyle(skin_name, isFirst);
  },
  refreshExtraStyle: function (css) {
    UI.styleManager.refreshExtraStyle(css);
  },
  toggleQuietMode: function (force) {
    interactionManager.toggleQuietMode(force);
  },
  addButton: async function () {
    return interactionManager.addButton();
  },
  calcContentFontSize: function (fontSizeStr) {
    return UI.styleManager.calcContentFontSize(fontSizeStr);
  },
  calcTitleFontSize: function (fontSizeStr) {
    return UI.styleManager.calcTitleFontSize(fontSizeStr);
  },
  fixMobile: function () {
    UI.styleManager.fixMobile();
  },
  getSkinList: function () {
    return UI.styleManager.getSkinList();
  },
  preferencesShow: function (event) {
    preferencesManager.show(event);
  },
  hide: function () {
    preferencesManager.hide();
  },
  preferencesLoadHandler: function () {
    preferencesManager.load();
  },
  cleanPreview: function () {
    preferencesManager.cleanPreview();
  },
  preferencesClickHandler: function (target) {
    return preferencesManager.clickHandler(target);
  },
  preferencesCloseHandler: function () {
    preferencesManager.close();
  },
  preferencesSaveHandler: function () {
    preferencesManager.save();
  },
  openHelp: function () {
    interactionManager.openHelp();
  },
  notice: function (htmlText, ms) {
    return notificationManager.notice(htmlText, ms) as JQuery<HTMLElement>;
  },
};

preferencesManager = new UIPreferencesManager({
  styleManager,
  domManager,
  syncConfigStore,
  toggleQuietMode: force => UI.toggleQuietMode(force),
  hideMenuList: hidden => UI.hideMenuList(hidden),
});

export default UI;
