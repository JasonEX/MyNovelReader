/* eslint-disable no-unused-vars, no-useless-escape */
import type { UnderscoreStatic } from 'underscore';
import Setting from './Setting';
import { toggleConsole, L_setValue } from './lib';
import Res from './res';
import bus, { SHOW_SPEECH } from './app/bus';
import uiService from './app/ui/UIServiceImpl';

declare const _: UnderscoreStatic;

type CustomReplaceRules = string | Record<string, string>;

interface UIType {
  tpl_footer_nav: string;
  skins: Record<string, string>;
  siteFontFamily: string;
  menu_list_hiddden: boolean;
  _rules?: CustomReplaceRules;
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
  preferencesShow(event?: Event): void;
  _loadBlocker(): void;
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
  skins: {} as Record<string, string>,
  // 站点字体
  siteFontFamily: '',
  menu_list_hiddden: false,
  _isQuietMode: false,
  $menu: null as unknown as JQuery<HTMLElement>,
  $menuBar: null as unknown as JQuery<HTMLElement>,
  $content: null as unknown as JQuery<HTMLElement>,
  $preferencesBtn: null as unknown as JQuery<HTMLElement>,
  $prefs: null,
  $blocker: null,
  $mainStyle: null,
  $_quietStyle: null,

  init: function () {
    UI.refreshMainStyle();

    UI.refreshSkinStyle(String(Setting.skin_name), true);

    UI.refreshExtraStyle(String(Setting.extra_css));

    UI.fixMobile();

    // 初始变量
    UI.$menu = $('#menu');
    UI.$menuBar = $('#menu-bar');
    UI.$content = $('#mynovelreader-content');
    UI.$preferencesBtn = $('#preferencesBtn');

    // 初始化是否隐藏
    if (Setting.hide_footer_nav) {
      UI.hideFooterNavStyle(true);
    }

    // UI.toggleQuietMode();  // 初始化安静模式
    UI.hideMenuList(Boolean(Setting.menu_list_hiddden)); // 初始化章节列表是否隐藏
    UI.hidePreferencesButton(Boolean(Setting.hide_preferences_button)); // 初始化设置按钮是否隐藏
  },
  refreshMainStyle: function () {
    // 添加站点字体到样式中
    const siteFontFamily = uiService.getSiteFontFamily();
    if (siteFontFamily) {
      UI.siteFontFamily = siteFontFamily;
    }

    const mainCss = Res.CSS_MAIN.replace(
      '{font_family}',
      UI.siteFontFamily + String(Setting.font_family)
    )
      .replace('{font_size}', UI.calcContentFontSize(String(Setting.font_size)))
      .replace('{title_font_size}', UI.calcTitleFontSize(String(Setting.font_size)))
      .replace('{content_width}', String(Setting.content_width))
      .replace('{text_line_height}', String(Setting.text_line_height))
      .replace('{paragraph_height}', String(Setting.paragraph_height))
      .replace('{menu-bar-hidden}', Setting.menu_bar_hidden ? 'display:none;' : '');

    if (UI.$mainStyle) {
      UI.$mainStyle.text(mainCss);
      return;
    }

    UI.$mainStyle = $('<style id="main">').text(mainCss).appendTo('head');
  },
  hideFooterNavStyle: function (hidden) {
    var navStyle = $('#footer_nav_css');
    if (hidden) {
      if (navStyle.length === 0) {
        $('<style>')
          .attr('id', 'footer_nav_css')
          .text('.chapter-footer-nav { display: none; }')
          .appendTo('head');
      }
    } else {
      navStyle.remove();
    }
  },
  hideMenuList: function (hidden) {
    const targetHidden = typeof hidden === 'undefined' ? !UI.menu_list_hiddden : hidden;

    if (targetHidden) {
      UI.$menu.removeClass('menu-open');
      UI.$content.css('margin-left', '');
    } else {
      UI.$menu.addClass('menu-open');
      UI.$content.css('margin-left', '');
    }
    UI.menu_list_hiddden = targetHidden;
  },
  hidePreferencesButton: function (hidden) {
    const shouldHide = _.isUndefined(hidden) ? Boolean(Setting.hide_preferences_button) : hidden;

    UI.$preferencesBtn.toggle(!shouldHide);
  },
  hideMenuBar: function (hidden) {
    const shouldHide = _.isUndefined(hidden) ? Boolean(Setting.menu_bar_hidden) : hidden;

    UI.$menuBar.toggle(!shouldHide);
  },
  refreshSkinStyle: function (skin_name, isFirst) {
    if (!skin_name) {
      skin_name = '缺省皮肤'.uiTrans();
    }

    var $style = $('#skin_style');

    if ($style.length === 0) {
      $style = $('<style id="skin_style">').appendTo('head');
    }

    // 皮肤到 data-skin 属性的映射（使用翻译后的 key）
    const skinToDataAttr: Record<string, string> = {
      ['缺省皮肤'.uiTrans()]: 'light',
      ['暗色皮肤'.uiTrans()]: 'light',
      ['白底黑字'.uiTrans()]: 'light',
      ['夜间模式'.uiTrans()]: 'dark',
      ['夜间模式1'.uiTrans()]: 'dark',
      ['夜间模式2'.uiTrans()]: 'dark',
      ['夜间模式（多看）'.uiTrans()]: 'dark',
      ['橙色背景'.uiTrans()]: 'light',
      ['绿色背景'.uiTrans()]: 'light',
      ['绿色背景2'.uiTrans()]: 'light',
      ['蓝色背景'.uiTrans()]: 'light',
      ['棕黄背景'.uiTrans()]: 'light',
      ['经典皮肤'.uiTrans()]: 'light',
      ['起点牛皮纸（深色）'.uiTrans()]: 'light',
      ['起点牛皮纸（浅色）'.uiTrans()]: 'light',
      ['起点黑色'.uiTrans()]: 'dark',
      ['绿色亮字'.uiTrans()]: 'dark',
      ['图书双层'.uiTrans()]: 'light',
    };

    const dataSkin = skinToDataAttr[skin_name] || 'light';
    document.documentElement.setAttribute('data-skin', dataSkin);

    // 图片章节夜间模式会变的无法看
    if (isFirst && skin_name.indexOf('夜间'.uiTrans()) !== -1 && Setting.picNightModeCheck) {
      setTimeout(function () {
        const img = $('#mynovelreader-content img')[0] as HTMLImageElement | undefined;
        if (img && img.width > 500 && img.height > 1000) {
          $style.text(UI.skins['缺省皮肤'.uiTrans()]);
          document.documentElement.setAttribute('data-skin', 'light');
        }
      }, 200);
    }

    $style.text(UI.skins[skin_name]);
  },
  refreshExtraStyle: function (css) {
    var style = $('#extra_style');
    if (style.length === 0) {
      style = $('<style id="extra_style">').appendTo('head');
    }

    style.text(css);
  },
  toggleQuietMode: function () {
    this._isQuietMode = !this._isQuietMode;
    var selector = '#menu-bar, #menu, #preferencesBtn, .readerbtn';

    if (this.$_quietStyle) {
      this.$_quietStyle.remove();
      this.$_quietStyle = null;
    }

    if (this._isQuietMode) {
      $(selector).addClass('quiet-mode');
    } else {
      $(selector).removeClass('quiet-mode');
    }
  },
  addButton: async function () {
    GM_addStyle(
      '\
            .readerbtn {\
                position: fixed;\
                right: 10px;\
                bottom: 10px;\
                z-index: 2247483648;\
                padding: 20px 5px!important;\
                width: 50px;\
                height: 20px;\
                line-height: 20px!important;\
                text-align: center;\
                border: 1px solid;\
                border-color: #888;\
                border-radius: 50%;\
                background: rgba(0,0,0,.5);\
                color: #FFF;\
                font: 12px/1.5 "微软雅黑","宋体",Arial;\
                cursor: pointer;\
                box-sizing: content-box;\
                letter-spacing: normal;\
            }\
        '
    );

    const { isEnabled } = uiService.getStatus();

    $('<div>')
      .addClass('readerbtn')
      .html(isEnabled ? '退出'.uiTrans() : '阅读模式'.uiTrans())
      .mousedown(async function (event) {
        if (event.which == 1) {
          await uiService.toggle();
        } else if (event.which == 2) {
          event.preventDefault();
          L_setValue('mynoverlreader_disable_once', 'true');

          const { activeUrl, currentUrl } = uiService.getStatus();
          const url = activeUrl || currentUrl;
          if (url) {
            uiService.openUrl(url);
          }
        }
      })
      .appendTo('body');
  },
  calcContentFontSize: function (fontSizeStr) {
    var m = fontSizeStr.match(/[\d\.]+(px|r?em|pt)/);
    if (m) {
      var size = m[0].match(/[\d\.]+/);
      var type = m[1];
      return (size ? parseFloat(size[0]) : 0) + type;
    }

    m = fontSizeStr.match(/([\d\.]+)/);
    if (m) {
      return parseFloat(m[1]) + 'px';
    }

    return '';
  },
  calcTitleFontSize: function (fontSizeStr) {
    var m = fontSizeStr.match(/[\d\.]+(px|r?em|pt)/);
    if (m) {
      var size = m[0].match(/[\d\.]+/);
      var type = m[1];
      return (size ? parseFloat(size[0]) : 0) * 1.8 + type;
    }

    m = fontSizeStr.match(/([\d\.]+)/);
    if (m) {
      return parseFloat(m[1]) * 1.8 + 'px';
    }

    return '';
  },
  fixMobile: function () {
    // 自适应网页设计
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1');
    document.head.appendChild(meta);
  },
  preferencesShow: function (_event) {
    if ($('#reader_preferences').length) {
      return;
    }

    UI._loadBlocker();

    UI.$prefs = $('<div id="reader_preferences">')
      .css(
        'cssText',
        'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:min(500px,90vw); max-height:80vh; z-index:300001; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,0.2); overflow:hidden;'
      )
      .append($('<style>').text(Res.preferencesCSS))
      .append(
        $('<div class="prefs-header">').html(
          '<span>设置</span><span id="top-buttons"><input title="部分选项需要刷新页面才能生效" id="save_button" value="✓ 确认" type="button"><input title="取消本次设定，所有选项还原" id="close_button" value="✕ 取消" type="button"></span>'
        )
      )
      .append($('<div class="body">').html(Res.getPreferencesHTML()))
      .appendTo('body');

    UI.preferencesLoadHandler();
    void _event;
  },
  _loadBlocker: function () {
    UI.$blocker = $('<div>')
      .attr({
        id: 'uil_blocker',
        style:
          'position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:300000;',
      })
      .appendTo('body');
  },
  hide: function () {
    if (UI.$prefs) UI.$prefs.remove();
    if (UI.$blocker) UI.$blocker.remove();
    UI.$prefs = null;
    UI.$blocker = null;
  },
  preferencesLoadHandler: function () {
    const $form = $('#preferences');

    UI.$prefs?.on('click', '#save_button, #close_button', function (event) {
      UI.preferencesClickHandler(event.target as HTMLInputElement);
    });

    const getInput = <T extends HTMLElement = HTMLInputElement>(selector: string): T =>
      $form.find(selector).get(0) as T;

    const setChecked = (selector: string, value: boolean) => {
      getInput<HTMLInputElement>(selector).checked = value;
    };

    const setValue = (selector: string, value: string | number) => {
      getInput<HTMLInputElement>(selector).value = String(value);
    };

    const setTextareaValue = (selector: string, value: string) => {
      getInput<HTMLTextAreaElement>(selector).value = value;
    };

    setChecked('#booklink-enable', Boolean(Setting.booklink_enable));
    setChecked('#debug', Boolean(Setting.debug));
    setChecked('#quietMode', Boolean(Setting.isQuietMode));
    setChecked('#pic-nightmode-check', Boolean(Setting.picNightModeCheck));
    setChecked('#copyCurTitle', Boolean(Setting.copyCurTitle));

    setChecked('#hide-menu-list', Boolean(Setting.menu_list_hiddden));
    setChecked('#hide-footer-nav', Boolean(Setting.hide_footer_nav));
    setChecked('#hide-preferences-button', Boolean(Setting.hide_preferences_button));
    setChecked('#add-nextpage-to-history', Boolean(Setting.addToHistory));
    setChecked('#enable-dblclick-pause', Boolean(Setting.dblclickPause));

    setValue('#font-family', String(Setting.font_family));
    setValue('#font-size', String(Setting.font_size));
    setValue('#content_width', String(Setting.content_width));
    setValue('#text_line_height', String(Setting.text_line_height));
    setValue('#paragraph_height', String(Setting.paragraph_height));
    setChecked('#split_content', Boolean(Setting.split_content));
    setChecked('#scroll_animate', Boolean(Setting.scrollAnimate));

    setValue('#remain-height', String(Setting.remain_height));
    setTextareaValue('#extra_css', String(Setting.extra_css));
    setTextareaValue('#custom_siteinfo', String(Setting.customSiteinfo));
    const customRules = String(Setting.customReplaceRules);
    setTextareaValue('#custom_replace_rules', customRules);
    UI._rules = customRules;

    setChecked('#preload-next-page', Boolean(Setting.preloadNextPage));

    getInput<HTMLInputElement>(`#launch-mode-${Setting.launchMode}`).checked = true;

    getInput<HTMLInputElement>(`#chinese-conversion-${Setting.chineseConversion}`).checked = true;

    setChecked('#enable-content-normalize', Boolean(Setting.contentNormalize));
    setChecked('#merge-qoutes-content', Boolean(Setting.mergeQoutesContent));

    setChecked('#fastboot', Boolean(Setting.fastboot));

    setChecked('#remove-domain-line', Boolean(Setting.removeDomainLine));

    // 界面语言
    var $lang = $form.find('#lang');
    $('<option>').text('zh-CN').appendTo($lang);
    $('<option>').text('zh-TW').appendTo($lang);
    $lang.val(String(Setting.lang)).change(function () {
      var key = $(this).find('option:selected').text();
      Setting.lang = key;
    });

    // 皮肤
    var $skin = $form.find('#skin');
    for (var key in UI.skins) {
      $('<option>').text(key).appendTo($skin);
    }
    $skin.val(String(Setting.skin_name)).change(function () {
      var key = $(this).find('option:selected').text();
      UI.refreshSkinStyle(key);
      Setting.skin_name = key;
    });

    // 字体大小等预览
    var preview = _.debounce(function (this: HTMLInputElement) {
      switch (this.id) {
        case 'font-size':
          var contentFontSize = UI.calcContentFontSize(this.value);
          var titleFontSize = UI.calcTitleFontSize(this.value);
          if (titleFontSize) {
            UI.$content.css('font-size', contentFontSize);
            UI.$content.find('h1').css('font-size', titleFontSize);
          }
          break;
        case 'font-family':
          UI.$content.css('font-family', UI.siteFontFamily + this.value);
          break;
        case 'content_width':
          UI.$content.css('width', this.value);
          break;
        case 'text_line_height':
          UI.$content.css('line-height', this.value);
          break;
        case 'paragraph_height': {
          const focusElement = uiService.getPreviewArticle();
          if (focusElement) {
            $(focusElement).find('p').css('margin', `${this.value} 0`);
          }
          break;
        }
        default:
          break;
      }
    }, 300);
    $form.on('input', 'input', preview);

    // 初始化设置按键
    setValue('#quietModeKey', String(Setting.quietModeKey));
    setValue('#openPreferencesKey', String(Setting.openPreferencesKey));
    setValue('#setHideMenuListKey', String(Setting.hideMenuListKey));
    setValue('#setOpenSpeechKey', String(Setting.openSpeechKey));

    // 点击事件
    $form.on('click', 'input:checkbox, input:button', function (event) {
      UI.preferencesClickHandler(event.target as HTMLInputElement); // 不用 await
    });
  },
  cleanPreview: function () {
    UI.$content.find('h1').css('font-size', '');

    // 恢复初始设置（有误操作）
    // UI.$content.removeAttr('style');
  },
  preferencesClickHandler: async function (target) {
    var key;
    switch (target.id) {
      case 'close_button':
        UI.preferencesCloseHandler();
        break;
      case 'save_button':
        UI.preferencesSaveHandler();
        break;
      case 'debug':
        Setting.debug = !Setting.debug;
        toggleConsole(Setting.debug);
        break;
      case 'quietMode':
        UI.toggleQuietMode(target.checked);
        break;
      case 'hide-menu-list':
        UI.hideMenuList(target.checked);
        break;
      case 'hide-preferences-button':
        UI.hidePreferencesButton(target.checked);
        if (target.checked) {
          alert('隐藏后通过快捷键或 Greasemonkey 用户脚本命令处调用'.uiTrans());
        }
        break;
      case 'hide-footer-nav':
        break;
      case 'quietModeKey':
        key = prompt('请输入打开设置的快捷键：'.uiTrans(), String(Setting.quietModeKey));
        if (key) {
          Setting.quietModeKey = key;
          $(target).val(key);
        }
        break;
      case 'openPreferencesKey':
        key = prompt('请输入打开设置的快捷键：'.uiTrans(), String(Setting.openPreferencesKey));
        if (key) {
          Setting.openPreferencesKey = key;
          $(target).val(key);
        }
        break;
      case 'setHideMenuListKey':
        key = prompt('请输入切换左侧章节列表的快捷键：'.uiTrans(), String(Setting.hideMenuListKey));
        if (key) {
          Setting.hideMenuListKey = key;
          $(target).val(key);
        }
        break;
      case 'setOpenSpeechKey':
        key = prompt('请输入打开朗读的快捷键：'.uiTrans(), String(Setting.openSpeechKey));
        if (key) {
          Setting.openSpeechKey = key;
          $(target).val(key);
        }
        break;
      case 'saveAsTxt':
        UI.preferencesCloseHandler();
        await uiService.saveAsTxt();
        break;
      case 'speech':
        UI.preferencesCloseHandler();
        bus.emit(SHOW_SPEECH);
        break;
      default:
        break;
    }
  },
  preferencesCloseHandler: function () {
    UI.cleanPreview();

    UI.hide();
  },
  preferencesSaveHandler: function () {
    const $form = $('#preferences');

    const getInput = <T extends HTMLElement = HTMLInputElement>(selector: string): T =>
      $form.find(selector).get(0) as T;

    const getChecked = (selector: string): boolean => getInput<HTMLInputElement>(selector).checked;
    const getValue = (selector: string): string => getInput<HTMLInputElement>(selector).value;
    const getTextareaValue = (selector: string): string =>
      getInput<HTMLTextAreaElement>(selector).value;

    // Setting.setDisableAutoLaunch($form.find("#disable-auto-launch").get(0).checked);

    // Setting.cn2tw = $form.find("#enable-cn2tw").get(0).checked;
    Setting.booklink_enable = getChecked('#booklink-enable');
    Setting.isQuietMode = getChecked('#quietMode');
    Setting.debug = getChecked('#debug');
    Setting.picNightModeCheck = getChecked('#pic-nightmode-check');
    Setting.setCopyCurTitle(getChecked('#copyCurTitle'));

    Setting.addToHistory = getChecked('#add-nextpage-to-history');
    Setting.dblclickPause = getChecked('#enable-dblclick-pause');

    var skinName = $form.find('#skin').find('option:selected').text();
    Setting.skin_name = skinName;
    UI.refreshSkinStyle(skinName);

    Setting.font_family = getValue('#font-family');
    UI.$content.css('font-family', Setting.font_family);

    Setting.font_size = getValue('#font-size');
    Setting.text_line_height = getValue('#text_line_height');
    Setting.paragraph_height = getValue('#paragraph_height');
    Setting.content_width = getValue('#content_width');
    Setting.remain_height = getValue('#remain-height');
    Setting.split_content = getChecked('#split_content');
    Setting.scrollAnimate = getChecked('#scroll_animate');

    Setting.menu_list_hiddden = getChecked('#hide-menu-list');
    UI.hideMenuList(Setting.menu_list_hiddden);

    Setting.hide_footer_nav = getChecked('#hide-footer-nav');
    UI.hideFooterNavStyle(Setting.hide_footer_nav);

    Setting.hide_preferences_button = getChecked('#hide-preferences-button');

    const css = getTextareaValue('#extra_css');
    UI.refreshExtraStyle(css);
    Setting.extra_css = css;

    Setting.customSiteinfo = getTextareaValue('#custom_siteinfo');

    Setting.preloadNextPage = getChecked('#preload-next-page');

    // 启动模式
    $form.find('#launch-mode input').each(function () {
      if ((this as HTMLInputElement).checked) {
        Setting.launchMode = (this as HTMLInputElement).value;
      }
    });

    // 繁简转换
    $form.find('#chinese-conversion input').each(function () {
      if ((this as HTMLInputElement).checked) {
        Setting.chineseConversion = (this as HTMLInputElement).value;
      }
    });

    // 内容标准化
    Setting.contentNormalize = getChecked('#enable-content-normalize');
    Setting.mergeQoutesContent = getChecked('#merge-qoutes-content');

    // 快速启动
    Setting.fastboot = getChecked('#fastboot');

    // 删除含网站域名行
    Setting.removeDomainLine = getChecked('#remove-domain-line');

    // 自定义替换规则直接生效
    const rulesText = getTextareaValue('#custom_replace_rules');
    Setting.customReplaceRules = rulesText;
    if (rulesText !== UI._rules) {
      const { html: contentHtml } = uiService.applyCustomReplaceRules(rulesText);
      UI._rules = rulesText;
      UI.$content.html(contentHtml);
    }

    // 重新载入样式
    UI.cleanPreview();
    UI.refreshMainStyle();

    UI.hide();
  },
  openHelp: function () {},
  notice: function (htmlText, ms) {
    var $noticeDiv = $('#alert');
    if (!ms) {
      ms = 1666;
    }

    clearTimeout(UI.noticeDivto);
    $noticeDiv.find('p').html(htmlText);
    $noticeDiv.fadeIn('fast');

    UI.noticeDivto = setTimeout(function () {
      $noticeDiv.fadeOut(500);
    }, ms);

    return $noticeDiv;
  },
};

UI.skins['缺省皮肤'.uiTrans()] = '';
UI.skins['暗色皮肤'.uiTrans()] =
  'body { color: #666; background-color: rgba(0,0,0,.1); }\
                .title { color: #222; }';
UI.skins['白底黑字'.uiTrans()] =
  'body { color: black; background-color: white;}\
                .title { font-weight: bold; border-bottom: 0.1em solid; margin-bottom: 1.857em; padding-bottom: 0.857em;}';

UI.skins['夜间模式'.uiTrans()] =
  'body { color: #939392; background: #2d2d2d; } #preferencesBtn { filter: invert(90%); } #mynovelreader-content img { background-color: #c0c0c0; } .chapter.active div{color: #939392;}';
UI.skins['夜间模式1'.uiTrans()] =
  'body { color: #679; background-color: black; } #preferencesBtn { filter: invert(90%); } .title { color: #3399FF; background-color: #121212; }';
UI.skins['夜间模式2'.uiTrans()] =
  'body { color: #AAAAAA; background-color: #121212; } #preferencesBtn { filter: invert(90%); } #mynovelreader-content img { background-color: #c0c0c0; } .title { color: #3399FF; background-color: #121212; }   body a { color: #E0BC2D; } body a:link { color: #E0BC2D; } body a:visited { color:#AAAAAA; } body a:hover { color: #3399FF; } body a:active { color: #423F3F; }';
UI.skins['夜间模式（多看）'.uiTrans()] =
  'body { color: #4A4A4A; background: #101819; } #preferencesBtn { filter: invert(90%); } #mynovelreader-content img { background-color: #c0c0c0; }';

UI.skins['橙色背景'.uiTrans()] = 'body { color: #24272c; background-color: #FEF0E1; }';
UI.skins['绿色背景'.uiTrans()] = 'body { color: black; background-color: #d8e2c8; }';
UI.skins['绿色背景2'.uiTrans()] = 'body { color: black; background-color: #CCE8CF; }';
UI.skins['蓝色背景'.uiTrans()] = 'body { color: black; background-color: #E7F4FE; }';
UI.skins['棕黄背景'.uiTrans()] = 'body { color: black; background-color: #C2A886; }';
UI.skins['经典皮肤'.uiTrans()] =
  'body { color: black; background-color: #EAEAEE; } .title { background-color: #f0f0f0; }';

// UI.skins["起点牛皮纸（深色）".uiTrans()] = "body { color: black; background: url(\"http://qidian.gtimg.com/qd/images/read.qidian.com/theme/body_theme1_bg_2x.0.3.png\"); }";
// UI.skins["起点牛皮纸（浅色）".uiTrans()] = "body { color: black; background: url(\"http://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_1_bg_2x.0.3.png\"); }";
// UI.skins["起点黑色".uiTrans()] = "body, #menu, #header { color: #666; background: #111 url(\"https://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_6_bg.45ad3.png\") repeat; } #preferencesBtn { background: white; }";
UI.skins['起点牛皮纸（深色）'.uiTrans()] =
  "body { color: black; background: url('data:image/png;base64,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'); }";
UI.skins['起点牛皮纸（浅色）'.uiTrans()] =
  "body { color: black; background: url('data:image/png;base64,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'); }";

UI.skins['起点黑色'.uiTrans()] =
  "body, #menu, #header { color: #666; background: #111 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAADFBMVEUWGBkYGhsdHyAfISI1t/v6AAAB5ElEQVQozxXQsYoTURSA4f/EeycZsDgDdySDjihk38Hy3GWi2J2BCaziQhaiaB+tt9AFu1kwvYUPsIXNPoB9BAUfwAfwEUzKv/v4odGrroyp9/rUaC6rZ5skv5F8qPsfYYP+yKUMymmAEEeW55oUR4o8jr05KNzJ07yvB7w0KKfLwcQUSjfmMU0PJfPHFoEVU+ohNrcKMEzMQ23FDnVSI2dqtYWI7KlLu6vE4UnyvKc3SJuL7lBbeEEl42ItpGLjzIT8PRJCmkRjVpVpsbJFVN0687okJNZiHAr5Z7MV0BnGIDc+THM1zlbieBc1Fq+tH5BH+OpnbWkj40hSqC8Lw2TvFuF0SUFJCk2IytXbjeqcRAt6NHpnrUkUU4KRzZs8RCK8N/Akn2W04LwxMU/V7XK0bDyN2RxfDyx7I4h5vjZby72V8UnOWumZL3qtYc+8DTE0siSBMXGhywx2dMYPnQHbxdFZ7deiNGxCCtD/QWnbwDoGhRYPDzUdUA3krjpnkvdAgDN4ddLkEQSov9qjd42HaDjI34gEqS9TUueAk+sc4qg5ws407KQYKs8G1jv4xBlqBVk6cb4dISZIwVi1Jzu4+HLk6lyfUxkXvwy+1Q+4WVdHIhwfybZ6CWVhxMEhShOgsP/HOW0MvZJeFwAAAABJRU5ErkJggg==') repeat; } #preferencesBtn { filter: invert(90%); }";
UI.skins['绿色亮字'.uiTrans()] =
  'body, #menu, #header, .chapter.active div { color: rgb(187,215,188); background-color: rgb(18,44,20); } #preferencesBtn { filter: invert(90%); }';

UI.skins['图书双层'.uiTrans()] =
  `body { color: #black; background: #ECE8D7 url('https://s3.bmp.ovh/imgs/2022/01/c08287428c0e16e2.png') repeat; } #mynovelreader-content{ letter-spacing: 1.3px; background: #E8E6DA url('https://s3.bmp.ovh/imgs/2022/01/71f45b2d4773b393.png') repeat; padding-left: 4rem ;padding-right: 4rem ; border-style:solid; border-width:1px;border-width:1px; border-color:rgba(211,211,211,0.25); }`;

export default UI;
