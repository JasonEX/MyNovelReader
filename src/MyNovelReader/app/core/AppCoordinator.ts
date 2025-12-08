/* eslint-disable no-unused-vars */
import type { IParser as ParserInstance, SiteConfig } from '../../../typings/MyNovelReader';
import type { AppContext } from './AppState';
import Setting from '../../Setting';
import { C, L_removeValue, L_setValue } from '../../lib';
import { envCheckInit } from '../../envCheck';
import Parser from '../../parser';
import UI from '../../UI';
import { cleanupEvents } from '../../inject';
import { runVue } from '../index';
import documentManager from '../document/DocumentManager';
import requestManager from '../request/RequestManager';
import uiController from '../ui/UIController';
import bus, { SHOW_SPEECH } from '../bus';
import siteManagerInstance, { SiteManager } from '../site/SiteManager';
import fontManagerInstance, { FontManager } from '../font/FontManager';

type AutoLaunchResult = boolean | -1;

class AppCoordinator {
  private static instance: AppCoordinator;

  private constructor(
    private readonly siteManager: SiteManager,
    private readonly fontManager: FontManager
  ) {}

  static getInstance(
    manager: SiteManager = siteManagerInstance,
    fontManager: FontManager = fontManagerInstance
  ): AppCoordinator {
    if (!AppCoordinator.instance) {
      AppCoordinator.instance = new AppCoordinator(manager, fontManager);
    }
    return AppCoordinator.instance;
  }

  checkEnvironment(): boolean {
    if (['mynovelreader-iframe', 'superpreloader-iframe'].includes(window.name)) {
      return false;
    }

    if (window.location.href.indexOf('#mynovelreader') > -1) {
      history.replaceState({}, '', window.location.href.replace('#mynovelreader', ''));
      return false;
    }

    let parent: Window & typeof globalThis = window;
    let nestCount = 0;

    try {
      while (parent !== window.top) {
        nestCount += 1;
        parent = parent.parent as Window & typeof globalThis;
      }
    } catch (e) {
      // 跨域访问限制，假设嵌套层级为 0
      C.warn('无法检查窗口嵌套层级（跨域限制）', e);
    }

    if (nestCount > 2) {
      C.error('窗口的嵌套层级过深。');
      return false;
    }

    if (Setting.debug) {
      envCheckInit();
    }

    return true;
  }

  loadCustomSetting(): void {
    this.siteManager.loadCustomSetting();
  }

  resolveSite(): SiteConfig {
    return this.siteManager.getCurSiteInfo() ?? this.createEmptySite();
  }

  isAutoLaunch(site: SiteConfig): AutoLaunchResult {
    return this.siteManager.isAutoLaunch(site);
  }

  async toggle(appContext: AppContext): Promise<void> {
    if (appContext.isEnabled) {
      GM_setValue('auto_enable', false);
      L_setValue('mynoverlreader_disable_once', 'true');
      appContext.isEnabled = false;

      const targetUrl = appContext.activeUrl || appContext.curPageUrl || window.location.href;
      if (targetUrl) {
        location.href = targetUrl;
      }
      location.reload();
      return;
    }

    GM_setValue('auto_enable', true);
    L_removeValue('mynoverlreader_disable_once');
    appContext.isEnabled = true;
    await this.launch(appContext);
  }

  async launch(appContext: AppContext): Promise<void> {
    if (document.body && document.body.getAttribute('name') === 'MyNovelReader') {
      // 已经在阅读模式，直接返回
      return;
    }

    appContext.parsedPages = appContext.parsedPages || {};

    const site = (appContext.site as SiteConfig | null) ?? this.resolveSite();
    appContext.site = site;
    documentManager.setSite(site ?? null);

    this.runSiteFilter(site);

    appContext.siteFontInfo = this.fontManager.resolveSiteFont(appContext, site);

    const parser = new Parser(site, document);
    const hasContent = !!parser.hasContent();
    if (hasContent) {
      cleanupEvents();
      if (document.body) {
        document.body.setAttribute('name', 'MyNovelReader');
      }
      appContext.parsedPages[window.location.href] = true;
      await parser.getAll();
      await this.processPage(appContext, parser as unknown as ParserInstance);
    } else {
      appContext.isEnabled = true;
      $('.readerbtn').remove();
      await UI.addButton();
      $('.readerbtn').text('无内容');
      C.error('当前页面没有找到内容');
    }

    if (site && typeof site.fInit === 'function') {
      site.fInit();
    }
  }

  async processPage(appContext: AppContext, parser: ParserInstance): Promise<void> {
    documentManager.setSite((appContext.site as SiteConfig | null) ?? null);

    if (document.body) {
      document.body.innerHTML = '';
    }

    documentManager.prepDocument();
    documentManager.initDocument(parser);

    runVue();

    const $doc = $(document);
    const $menuBar = $doc.find('#menu-bar');
    const $menu = $doc.find('#menu');
    const $content = $doc.find('#mynovelreader-content');
    const $loading = $doc.find('#loading');
    const $preferencesBtn = $doc.find('#preferencesBtn');
    const $menuHeader = $menu.find('#chapter-list');
    const $chapterList = $menu.find('#chapter-list');

    Object.assign(appContext, {
      $doc,
      $menuBar,
      $menu,
      $content,
      $loading,
      $preferencesBtn,
      $menuHeader,
      $chapterList,
      indexUrl: parser.indexUrl,
      prevUrl: parser.prevUrl,
      oArticles: [],
      parsers: [],
    });

    if (parser.prevUrl) {
      $('<li>')
        .addClass('chapter')
        .append(
          $('<div>')
            .attr({
              realHref: parser.prevUrl,
              onclick: 'return false;',
            })
            .text(this.translate('上一章'))
        )
        .prependTo($chapterList);
    }

    if (appContext.site?.style) {
      GM_addStyle(appContext.site.style);
    }

    this.fontManager.injectSiteFontStyles(
      appContext.site as SiteConfig | null,
      appContext.siteFontInfo
    );

    if (typeof appContext.appendPage === 'function') {
      appContext.appendPage(parser, true);
    }

    this.initUI(appContext);

    appContext.curFocusElement = $('article:first').get(0) ?? null;
    appContext.requestUrl = parser.nextUrl;
    appContext.isTheEnd = parser.isTheEnd as boolean | 'vip';
    appContext.curPageUrl = this.getCurPageUrl(appContext);
    appContext.isEnabled = true;
    await UI.addButton();

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    this.setupRequestHandlers(appContext);

    setTimeout(() => {
      void appContext.scroll?.();
    }, 1000);

    documentManager.cleanAgain();

    if (Setting.preloadNextPage) {
      await appContext.doRequest?.();
    }
  }

  private runSiteFilter(site: SiteConfig | null): void {
    if (site?.startFilter) {
      try {
        site.startFilter($(document));
        C.log('run startFilter function success');
      } catch (ex) {
        C.error('运行 startFilter function 错误', ex);
      }
    }
  }

  private initUI(appContext: AppContext): void {
    UI.init();

    const { $doc, $content, $menuBar, $menuHeader, $chapterList, $loading, $preferencesBtn } =
      appContext;

    if (!$doc || !$content || !$menuBar || !$menuHeader || !$chapterList || !$loading) {
      C.error('初始化 UI 失败，必要元素缺失');
      return;
    }

    uiController.init({
      elements: {
        doc: $doc as unknown as JQuery<HTMLElement>,
        content: $content,
        menuBar: $menuBar,
        menuHeader: $menuHeader,
        chapterList: $chapterList,
        loadingElement: $loading,
        preferencesButton: $preferencesBtn,
      },
      dependencies: {
        scroll: () => appContext.scroll?.(),
        scrollToArticle: (elem: unknown) => {
          if (typeof appContext.scrollToArticle === 'function') {
            appContext.scrollToArticle(elem);
          }
        },
        hideMenuList: () => UI.hideMenuList(),
        showPreferences: () => UI.preferencesShow(),
        toggleQuietMode: () => UI.toggleQuietMode(),
        hidePreferences: () => UI.hide(),
        openHelp: () => UI.openHelp(),
        notice: (message: string) => UI.notice(message),
        isPreferencesOpen: () => !!UI.$prefs,
        openSpeech: () => bus.emit(SHOW_SPEECH),
        getRemain: () => (typeof appContext.getRemain === 'function' ? appContext.getRemain() : 0),
        getDocumentHeight: () => $doc.height?.() ?? document.documentElement.scrollHeight ?? 0,
      },
      state: {
        paused: appContext.paused,
        indexUrl: appContext.indexUrl ?? null,
        prevUrl: appContext.prevUrl ?? null,
        requestUrl: appContext.requestUrl,
        lastRequestUrl: appContext.lastRequestUrl,
      },
      getCurFocusElement: () => appContext.curFocusElement,
      onPausedChange: (paused: boolean) => {
        appContext.paused = paused;
      },
    });

    uiController.registerControls();
  }

  private setupRequestHandlers(appContext: AppContext): void {
    const site = appContext.site as SiteConfig | null;

    if (!site) {
      return;
    }

    const loadingElement = appContext.$loading;

    if (!loadingElement) {
      C.error('缺少 loading 元素，无法初始化请求管理器');
      return;
    }

    const curPageUrl = this.getCurPageUrl(appContext);
    appContext.curPageUrl = curPageUrl;

    requestManager.init({
      site,
      parsedPages: appContext.parsedPages,
      requestUrl: appContext.requestUrl,
      lastRequestUrl: appContext.lastRequestUrl,
      curPageUrl,
      isTheEnd: appContext.isTheEnd,
      dependencies: {
        loadingElement,
        appendPage: async (nextParser: ParserInstance) => {
          if (typeof appContext.appendPage === 'function') {
            await appContext.appendPage(nextParser);
          }
          this.syncRequestState(appContext);
        },
        removeListener: () => appContext.removeListener?.(),
        onScroll: () => appContext.scroll?.(),
        onScrollForce: () => appContext.scrollForce?.(),
      },
    });

    this.syncRequestState(appContext);

    appContext.doRequest = async () => {
      await requestManager.doRequest();
      this.syncRequestState(appContext);
    };

    appContext.loaded = async (doc: Document | null) => {
      await requestManager.loaded(doc);
      this.syncRequestState(appContext);
    };
  }

  private syncRequestState(appContext: AppContext): void {
    appContext.request = requestManager.getRequest();
    appContext.requestUrl = requestManager.getRequestUrl();
    appContext.lastRequestUrl = requestManager.getLastRequestUrl();
    appContext.curPageUrl = requestManager.getCurPageUrl();
    appContext.isTheEnd = requestManager.getIsTheEnd();
  }

  private getCurPageUrl(appContext: AppContext): string {
    if (typeof appContext.curPageUrl === 'string' && appContext.curPageUrl) {
      return appContext.curPageUrl;
    }
    return window.location.href;
  }

  private translate(text: string): string {
    const translator = (text as unknown as { uiTrans?: () => string }).uiTrans;
    return typeof translator === 'function' ? translator.call(text) : text;
  }

  private createEmptySite(): SiteConfig {
    return {
      siteName: '',
      url: '',
      exampleUrl: '',
    };
  }
}

const appCoordinator = AppCoordinator.getInstance();

export { AppCoordinator, appCoordinator };
export default appCoordinator;
