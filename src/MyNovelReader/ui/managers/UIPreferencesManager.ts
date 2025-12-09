import type { UnderscoreStatic } from 'underscore';
import Setting from '../../Setting';
import { toggleConsole } from '../../lib';
import Res from '../../res';
import bus, { SHOW_SPEECH } from '../../app/bus';
import uiService from '../../app/ui/UIServiceImpl';
import type { ConfigState } from '../../stores/configStore';
import type { IUIDOMManager, IUIPreferencesManager, IUIStyleManager, UIElement } from '../types';

declare const _: UnderscoreStatic;

type ConfigUpdates = Partial<ConfigState>;
type CustomReplaceRules = string | Record<string, string>;

interface UIPreferencesManagerDependencies {
  styleManager: IUIStyleManager;
  domManager: IUIDOMManager;
  syncConfigStore: (updates: ConfigUpdates) => void;
  toggleQuietMode: (force?: boolean) => void;
  hideMenuList: (hidden?: boolean) => void;
}

class UIPreferencesManager implements IUIPreferencesManager {
  $prefs: UIElement | null = null;

  $blocker: UIElement | null = null;

  private rules?: CustomReplaceRules;

  private styleManager: IUIStyleManager;

  private domManager: IUIDOMManager;

  private syncConfigStore: (updates: ConfigUpdates) => void;

  private toggleQuietMode: (force?: boolean) => void;

  private hideMenuList: (hidden?: boolean) => void;

  constructor(options: UIPreferencesManagerDependencies) {
    this.styleManager = options.styleManager;
    this.domManager = options.domManager;
    this.syncConfigStore = options.syncConfigStore;
    this.toggleQuietMode = options.toggleQuietMode;
    this.hideMenuList = options.hideMenuList;
  }

  show(event?: Event): void {
    if ($('#reader_preferences').length) {
      return;
    }

    this.loadBlocker();

    this.$prefs = $('<div id="reader_preferences">')
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

    this.load();
    void event;
  }

  hide(): void {
    if (this.$prefs) this.$prefs.remove();
    if (this.$blocker) this.$blocker.remove();
    this.$prefs = null;
    this.$blocker = null;
  }

  load(): void {
    const $form = $('#preferences');

    this.$prefs?.on('click', '#save_button, #close_button', event => {
      void this.clickHandler(event.target as HTMLInputElement);
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
    this.rules = customRules;

    setChecked('#preload-next-page', Boolean(Setting.preloadNextPage));

    getInput<HTMLInputElement>(`#launch-mode-${Setting.launchMode}`).checked = true;

    getInput<HTMLInputElement>(`#chinese-conversion-${Setting.chineseConversion}`).checked = true;

    setChecked('#enable-content-normalize', Boolean(Setting.contentNormalize));
    setChecked('#merge-qoutes-content', Boolean(Setting.mergeQoutesContent));

    setChecked('#fastboot', Boolean(Setting.fastboot));

    setChecked('#remove-domain-line', Boolean(Setting.removeDomainLine));

    // 界面语言
    const $lang = $form.find('#lang');
    $('<option>').text('zh-CN').appendTo($lang);
    $('<option>').text('zh-TW').appendTo($lang);
    const { styleManager, domManager, syncConfigStore } = this;

    $lang.val(String(Setting.lang)).change(function () {
      const key = $(this).find('option:selected').text() as ConfigState['lang'];
      Setting.lang = key;
      syncConfigStore({ lang: key });
    });

    // 皮肤
    const $skin = $form.find('#skin');
    const skins = this.styleManager.getSkinList();
    for (const key in skins) {
      $('<option>').text(key).appendTo($skin);
    }
    $skin.val(String(Setting.skin_name)).change(() => {
      const key = $skin.find('option:selected').text();
      this.styleManager.refreshSkinStyle(key);
      Setting.skin_name = key;
      this.syncConfigStore({ skin_name: key });
    });

    // 字体大小等预览
    const preview = _.debounce(function (this: HTMLInputElement) {
      switch (this.id) {
        case 'font-size': {
          const contentFontSize = styleManager.calcContentFontSize(this.value);
          const titleFontSize = styleManager.calcTitleFontSize(this.value);
          if (titleFontSize) {
            domManager.$content.css('font-size', contentFontSize);
            domManager.$content.find('h1').css('font-size', titleFontSize);
          }
          break;
        }
        case 'font-family': {
          const siteFontFamily = styleManager.getSiteFontFamily();
          domManager.$content.css('font-family', siteFontFamily + this.value);
          break;
        }
        case 'content_width':
          domManager.$content.css('width', this.value);
          break;
        case 'text_line_height':
          domManager.$content.css('line-height', this.value);
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
    $form.on('click', 'input:checkbox, input:button', event => {
      void this.clickHandler(event.target as HTMLInputElement);
    });
  }

  cleanPreview(): void {
    this.domManager.$content.find('h1').css('font-size', '');
  }

  async clickHandler(target: HTMLInputElement): Promise<void> {
    let key;
    switch (target.id) {
      case 'close_button':
        this.close();
        break;
      case 'save_button':
        this.save();
        break;
      case 'debug':
        Setting.debug = !Setting.debug;
        toggleConsole(Setting.debug);
        this.syncConfigStore({ debug: Setting.debug });
        break;
      case 'quietMode':
        this.toggleQuietMode(target.checked);
        break;
      case 'hide-menu-list':
        this.hideMenuList(target.checked);
        break;
      case 'hide-preferences-button':
        this.domManager.hidePreferencesButton(target.checked);
        if (target.checked) {
          alert('隐藏后通过快捷键或 Greasemonkey 用户脚本命令处调用'.uiTrans());
        }
        break;
      case 'hide-footer-nav':
        break;
      case 'quietModeKey':
        key = prompt('请输入打开设置的快捷键：'.uiTrans(), String(Setting.quietModeKey));
        if (key) {
          const nextKey = String(key);
          Setting.quietModeKey = nextKey;
          $(target).val(nextKey);
          this.syncConfigStore({ quietModeKey: nextKey });
        }
        break;
      case 'openPreferencesKey':
        key = prompt('请输入打开设置的快捷键：'.uiTrans(), String(Setting.openPreferencesKey));
        if (key) {
          const nextKey = String(key);
          Setting.openPreferencesKey = nextKey;
          $(target).val(nextKey);
          this.syncConfigStore({ openPreferencesKey: nextKey });
        }
        break;
      case 'setHideMenuListKey':
        key = prompt('请输入切换左侧章节列表的快捷键：'.uiTrans(), String(Setting.hideMenuListKey));
        if (key) {
          const nextKey = String(key);
          Setting.hideMenuListKey = nextKey;
          $(target).val(nextKey);
          this.syncConfigStore({ hideMenuListKey: nextKey });
        }
        break;
      case 'setOpenSpeechKey':
        key = prompt('请输入打开朗读的快捷键：'.uiTrans(), String(Setting.openSpeechKey));
        if (key) {
          const nextKey = String(key);
          Setting.openSpeechKey = nextKey;
          $(target).val(nextKey);
          this.syncConfigStore({ openSpeechKey: nextKey });
        }
        break;
      case 'saveAsTxt':
        this.close();
        await uiService.saveAsTxt();
        break;
      case 'speech':
        this.close();
        bus.emit(SHOW_SPEECH);
        break;
      default:
        break;
    }
  }

  close(): void {
    this.cleanPreview();
    this.hide();
  }

  save(): void {
    const $form = $('#preferences');

    const getInput = <T extends HTMLElement = HTMLInputElement>(selector: string): T =>
      $form.find(selector).get(0) as T;

    const getChecked = (selector: string): boolean => getInput<HTMLInputElement>(selector).checked;
    const getValue = (selector: string): string => getInput<HTMLInputElement>(selector).value;
    const getTextareaValue = (selector: string): string =>
      getInput<HTMLTextAreaElement>(selector).value;

    const configUpdates: ConfigUpdates = {};

    Setting.booklink_enable = getChecked('#booklink-enable');
    configUpdates.booklink_enable = Setting.booklink_enable;

    Setting.isQuietMode = getChecked('#quietMode');

    Setting.debug = getChecked('#debug');
    configUpdates.debug = Setting.debug;

    Setting.picNightModeCheck = getChecked('#pic-nightmode-check');
    configUpdates.picNightModeCheck = Setting.picNightModeCheck;

    const copyCurTitle = getChecked('#copyCurTitle');
    Setting.setCopyCurTitle(copyCurTitle);
    configUpdates.copyCurTitle = copyCurTitle;

    Setting.addToHistory = getChecked('#add-nextpage-to-history');
    configUpdates.addToHistory = Setting.addToHistory;

    Setting.dblclickPause = getChecked('#enable-dblclick-pause');
    configUpdates.dblclickPause = Setting.dblclickPause;

    const skinName = $form.find('#skin').find('option:selected').text();
    Setting.skin_name = skinName;
    this.styleManager.refreshSkinStyle(skinName);
    configUpdates.skin_name = skinName;

    const fontFamily = getValue('#font-family');
    Setting.font_family = fontFamily;
    this.domManager.$content.css('font-family', Setting.font_family);
    configUpdates.font_family = fontFamily;

    const fontSize = getValue('#font-size');
    Setting.font_size = fontSize;
    configUpdates.font_size = fontSize;

    const textLineHeight = getValue('#text_line_height');
    Setting.text_line_height = textLineHeight;
    configUpdates.text_line_height = textLineHeight;

    const paragraphHeight = getValue('#paragraph_height');
    Setting.paragraph_height = paragraphHeight;
    configUpdates.paragraph_height = paragraphHeight;

    const contentWidth = getValue('#content_width');
    Setting.content_width = contentWidth;
    configUpdates.content_width = contentWidth;

    const parsedRemainHeight = parseInt(getValue('#remain-height'), 10);
    const remainHeight = Number.isFinite(parsedRemainHeight)
      ? parsedRemainHeight
      : Setting.remain_height;
    Setting.remain_height = remainHeight;
    configUpdates.remain_height = remainHeight;

    Setting.split_content = getChecked('#split_content');
    configUpdates.split_content = Setting.split_content;

    Setting.scrollAnimate = getChecked('#scroll_animate');
    configUpdates.scrollAnimate = Setting.scrollAnimate;

    Setting.menu_list_hiddden = getChecked('#hide-menu-list');
    this.hideMenuList(Setting.menu_list_hiddden);
    configUpdates.menu_list_hiddden = Setting.menu_list_hiddden;

    Setting.hide_footer_nav = getChecked('#hide-footer-nav');
    this.styleManager.hideFooterNavStyle(Setting.hide_footer_nav);
    configUpdates.hide_footer_nav = Setting.hide_footer_nav;

    Setting.hide_preferences_button = getChecked('#hide-preferences-button');
    configUpdates.hide_preferences_button = Setting.hide_preferences_button;

    const css = getTextareaValue('#extra_css');
    this.styleManager.refreshExtraStyle(css);
    Setting.extra_css = css;
    configUpdates.extra_css = css;

    const customSiteinfo = getTextareaValue('#custom_siteinfo');
    Setting.customSiteinfo = customSiteinfo;
    configUpdates.customSiteinfo = customSiteinfo;

    Setting.preloadNextPage = getChecked('#preload-next-page');
    configUpdates.preloadNextPage = Setting.preloadNextPage;

    let launchMode = Setting.launchMode as ConfigState['launchMode'];
    $form.find('#launch-mode input').each(function () {
      if ((this as HTMLInputElement).checked) {
        launchMode = (this as HTMLInputElement).value as ConfigState['launchMode'];
        Setting.launchMode = launchMode;
      }
    });
    configUpdates.launchMode = launchMode;

    let chineseConversion = Setting.chineseConversion as ConfigState['chineseConversion'];
    $form.find('#chinese-conversion input').each(function () {
      if ((this as HTMLInputElement).checked) {
        chineseConversion = (this as HTMLInputElement).value as ConfigState['chineseConversion'];
        Setting.chineseConversion = chineseConversion;
      }
    });
    configUpdates.chineseConversion = chineseConversion;

    // 内容标准化
    Setting.contentNormalize = getChecked('#enable-content-normalize');
    configUpdates.contentNormalize = Setting.contentNormalize;

    Setting.mergeQoutesContent = getChecked('#merge-qoutes-content');
    configUpdates.mergeQoutesContent = Setting.mergeQoutesContent;

    // 快速启动
    Setting.fastboot = getChecked('#fastboot');
    configUpdates.fastboot = Setting.fastboot;

    // 删除含网站域名行
    Setting.removeDomainLine = getChecked('#remove-domain-line');
    configUpdates.removeDomainLine = Setting.removeDomainLine;

    // 自定义替换规则直接生效
    const rulesText = getTextareaValue('#custom_replace_rules');
    Setting.customReplaceRules = rulesText;
    configUpdates.customReplaceRules = rulesText;
    if (rulesText !== this.rules) {
      const { html: contentHtml } = uiService.applyCustomReplaceRules(rulesText);
      this.rules = rulesText;
      this.domManager.$content.html(contentHtml);
    }

    configUpdates.lang = Setting.lang as ConfigState['lang'];
    configUpdates.quietModeKey = String(Setting.quietModeKey) as ConfigState['quietModeKey'];
    configUpdates.openPreferencesKey = String(
      Setting.openPreferencesKey
    ) as ConfigState['openPreferencesKey'];
    configUpdates.hideMenuListKey = String(
      Setting.hideMenuListKey
    ) as ConfigState['hideMenuListKey'];
    configUpdates.openSpeechKey = String(Setting.openSpeechKey) as ConfigState['openSpeechKey'];

    this.syncConfigStore(configUpdates);

    // 重新载入样式
    this.cleanPreview();
    this.styleManager.refreshMainStyle();

    this.hide();
  }

  private loadBlocker(): void {
    this.$blocker = $('<div>')
      .attr({
        id: 'uil_blocker',
        style:
          'position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:300000;',
      })
      .appendTo('body');
  }
}

export default UIPreferencesManager;
