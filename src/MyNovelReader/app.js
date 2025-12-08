import Setting from './Setting';
import UI from './UI';
import { setApp } from './appRef';
import { C, sleep, DOMContentLoaded } from './lib';
import saveManager from './app/save/SaveManager';
import './inject';
import { domMutation, observeElement } from './libdom';
import { RequestStatus, iframeHeight } from './request';
import appCoordinator from './app/core/AppCoordinator';
import requestManager from './app/request/RequestManager';
import fontManager from './app/font/FontManager';
import pageManager from './app/page/PageManager';
import uiController from './app/ui/UIController';

var App = {
  isEnabled: false,
  parsedPages: {},
  pageNum: 1,
  paused: false,
  curPageUrl: location.href,
  requestUrl: null,
  lastRequestUrl: null,
  iframe: null,
  remove: [],
  isTheEnd: false,
  activeUrl: null,
  // 滚动激活相关
  curFocusElement: null,
  curFocusIndex: 1,
  scrollOffsets: [],
  // 站点字体信息
  siteFontInfo: null,
  /** @type {import('./request').HttpRequest | import('./request').IframeRequest | null} */
  request: null,
  /** @type {import('./request').HttpRequest | null} */
  httpRequest: null,
  /** @type {import('./request').IframeRequest | null} */
  iframeRequest: null,
  // 站点规则
  site: null,

  init: async function () {
    const coordinator = appCoordinator;

    if (!coordinator.checkEnvironment()) {
      return;
    }

    // 手动调用
    var readx = App.launch;

    try {
      exportFunction(readx, unsafeWindow, { defineAs: 'readx' });
    } catch (ex) {
      C.error('无法定义 readx 函数', ex);
    }

    coordinator.loadCustomSetting();
    App.site = coordinator.resolveSite();

    // 等待 DOMContentLoaded 事件触发
    if (!App.site.fastboot && !Setting.fastboot) {
      await DOMContentLoaded();
    }

    if (App.site.startLaunch) {
      try {
        App.site.startLaunch($(document));
      } catch (e) {
        C.error('执行startLaunch函数出错', e);
      }
    }

    var autoLaunch = coordinator.isAutoLaunch(App.site);

    if (autoLaunch === -1) {
      return;
    } else if (autoLaunch) {
      if (App.site.mutationSelector) {
        // 特殊的启动：等待js把内容生成完毕
        // await App.addMutationObserve(document);
        await observeElement(document, App.site);
      } else if (App.site.timeout) {
        // 延迟启动
        await sleep(App.site.timeout);
      }
      if (!App.site.fastboot && !Setting.fastboot) {
        await domMutation();
      }
      await App.launch();
    } else {
      await domMutation();
      await UI.addButton();
    }
  },
  launch: async function () {
    return await appCoordinator.launch(App);
  },
  processPage: async function (parser) {
    return await appCoordinator.processPage(App, parser);
  },
  toggle: async function () {
    await appCoordinator.toggle(App);
  },
  removeListener: function () {
    C.log('移除各种事件监听');
    uiController.removeListeners();
  },
  initPageManager: function () {
    pageManager.init({
      contentElement: App.$content && App.$content.get ? App.$content.get(0) : null,
      chapterListElement: App.$chapterList && App.$chapterList.get ? App.$chapterList.get(0) : null,
      getPageNum: function () {
        return App.pageNum;
      },
      setPageNum: function (pageNum) {
        App.pageNum = pageNum;
      },
      oArticles: App.oArticles || (App.oArticles = []),
      parsers: App.parsers || (App.parsers = []),
      onCacheReset: function (cache) {
        App.menuItems = cache.menuItems;
        App.scrollItems = cache.scrollItems;
        App.scrollOffsets = cache.scrollOffsets;
      },
    });
  },
  appendPage: function (parser, isFirst) {
    App.initPageManager();
    pageManager.appendPage(parser, Boolean(isFirst));
  },
  resetCache: function () {
    App.initPageManager();
    pageManager.resetCache();
  },
  scrollToArticle: function (elem) {
    var offsetTop;
    if (typeof elem == 'number') {
      offsetTop = elem;
    } else {
      offsetTop = $(elem).offset().top - parseInt($(elem).css('margin-top'), 10);
    }

    if (Setting.scrollAnimate) {
      $('html, body').stop().animate(
        {
          scrollTop: offsetTop,
        },
        750,
        'easeOutExpo'
      );
    } else {
      $('html, body').stop().scrollTop(offsetTop);
    }
  },
  openUrl: function (url, errorMsg) {
    uiController.openUrl(url, errorMsg);
  },
  scroll: async function () {
    if (!App.isEnabled || !App.scrollItems || !App.scrollItems.length) {
      return;
    }

    const request = App.request;
    if (request && request.display && Math.floor(App.getRemain() - iframeHeight) < 0) {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight - iframeHeight + 51);
    }

    if (!App.paused && App.getRemain() < Setting.remain_height) {
      await App.scrollForce();
    }

    if (App.isTheEnd) {
      App.$loading.html('已到达最后一页...'.uiTrans()).show();
    }

    App.updateCurFocusElement();
  },
  scrollForce: async function () {
    if (!App.request) {
      return;
    }

    switch (App.request.status) {
      case RequestStatus.Idle:
        await App.doRequest();
        break;
      case RequestStatus.Finish:
        await App.loaded(App.request.getDocument());
        break;
      case RequestStatus.Fail: {
        const nextUrl = App.curPageUrl;
        App.$loading.html("<a href='" + nextUrl + "'>无法获取下一页，请手动点击</a>").show();
        break;
      }
      default:
        break;
    }
  },
  updateCurFocusElement: function () {
    if (!App.scrollItems || !App.scrollItems.length) {
      return;
    }

    if (!App.scrollOffsets || App.scrollOffsets.length !== App.scrollItems.length) {
      App.resetCache();
    }

    // 滚动激活章节列表
    // Get container scroll position
    var fromTop = $(window).scrollTop() + $(window).height() / 2;
    var curIndex = -1;

    for (var i = 0; i < App.scrollOffsets.length; i++) {
      if (App.scrollOffsets[i] < fromTop) {
        curIndex = i;
      } else {
        break;
      }
    }

    var visitedLength = curIndex + 1;
    // Get the id of the current element
    App.curFocusIndex = curIndex;
    var cur = curIndex >= 0 ? App.scrollItems[curIndex] : null;
    var id = cur ? cur.id : '';

    if (App.lastId !== id) {
      App.lastId = id;

      const activeItem = App.menuItems.filter('[href=#' + id + ']');
      const activeUrl = activeItem.attr('realHref');

      // Set/remove active class
      App.menuItems.parent().removeClass('active');
      activeItem.parent().addClass('active');

      App.curFocusElement = cur;
      App.activeUrl = activeUrl;

      if (Setting.addToHistory) {
        var curNum = id.match(/\d+/)[0] - 1; // 当前是第几个
        var curTitle = App.parsers[curNum].docTitle;

        // 有域名的限制，起点过渡到 vip 章节无法生效
        var url = activeUrl.replace('http://read.qidian.com', '');
        try {
          history.pushState(null, curTitle, url);
        } catch (e) {
          C.error('添加下一页到历史记录失败', e);
        }

        document.title = curTitle;
      }

      if (App.scrollItems.length === visitedLength) {
        requestManager.resolvePreload();
      }
    }
  },
  getRemain: function () {
    var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var remain = scrollHeight - window.innerHeight - window.scrollY;
    return remain;
  },
  doRequest: async function () {},
  loaded: async function () {},
  fixImageFloats: function (articleContent) {
    pageManager.fixImageFloats(articleContent);
  },

  saveAsTxt: async function () {
    await saveManager.saveAsTxt({
      site: App.site,
      parsers: App.parsers || [],
      curPageUrl: App.curPageUrl,
    });
  },
  getSiteFontInfo: function () {
    return fontManager.getSiteFontInfo();
  },
};

// 注册 App 实例到共享引用
setApp(App);

export default App;
