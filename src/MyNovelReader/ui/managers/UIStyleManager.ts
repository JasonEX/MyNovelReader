import type { IUIStyleManager, UISkinMap, UISkinName } from '../types';
import Setting from '../../Setting';
import Res from '../../res';
import uiService from '../../app/ui/UIServiceImpl';
import { skins as builtInSkins } from '../constants/skins';

interface UIStyleManagerOptions {
  skins?: UISkinMap;
  documentElement?: HTMLElement;
}

class UIStyleManager implements IUIStyleManager {
  private skins: UISkinMap;

  private documentElement: HTMLElement;

  private mainStyle: JQuery<HTMLElement> | null = null;

  private skinStyle: JQuery<HTMLElement> | null = null;

  private extraStyle: JQuery<HTMLElement> | null = null;

  private siteFontFamily = '';

  constructor(options: UIStyleManagerOptions = {}) {
    this.skins = options.skins ?? builtInSkins;
    this.documentElement = options.documentElement ?? document.documentElement;
  }

  refreshMainStyle(): void {
    const siteFontFamily = uiService.getSiteFontFamily();
    if (siteFontFamily) {
      this.siteFontFamily = siteFontFamily;
    }

    const mainCss = Res.CSS_MAIN.replace(
      '{font_family}',
      this.siteFontFamily + String(Setting.font_family)
    )
      .replace('{font_size}', this.calcContentFontSize(String(Setting.font_size)))
      .replace('{title_font_size}', this.calcTitleFontSize(String(Setting.font_size)))
      .replace('{content_width}', String(Setting.content_width))
      .replace('{text_line_height}', String(Setting.text_line_height))
      .replace('{paragraph_height}', String(Setting.paragraph_height))
      .replace('{menu-bar-hidden}', Setting.menu_bar_hidden ? 'display:none;' : '');

    if (this.mainStyle) {
      this.mainStyle.text(mainCss);
      return;
    }

    this.mainStyle = $('<style id="main">').text(mainCss).appendTo('head');
  }

  refreshSkinStyle(skinName: UISkinName, isFirst?: boolean): void {
    let targetSkinName = skinName;
    if (!targetSkinName) {
      targetSkinName = '缺省皮肤'.uiTrans();
    }

    let styleElement = this.skinStyle ?? $('#skin_style');
    if (styleElement.length === 0) {
      styleElement = $('<style id="skin_style">').appendTo('head');
    }
    this.skinStyle = styleElement;

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

    const dataSkin = skinToDataAttr[targetSkinName] || 'light';
    this.documentElement.setAttribute('data-skin', dataSkin);

    if (isFirst && targetSkinName.indexOf('夜间'.uiTrans()) !== -1 && Setting.picNightModeCheck) {
      setTimeout(() => {
        const img = $('#mynovelreader-content img')[0] as HTMLImageElement | undefined;
        if (img && img.width > 500 && img.height > 1000) {
          this.skinStyle?.text(this.skins['缺省皮肤'.uiTrans()]);
          this.documentElement.setAttribute('data-skin', 'light');
        }
      }, 200);
    }

    styleElement.text(this.skins[targetSkinName]);
  }

  refreshExtraStyle(css: string): void {
    let styleElement = this.extraStyle ?? $('#extra_style');
    if (styleElement.length === 0) {
      styleElement = $('<style id="extra_style">').appendTo('head');
    }
    this.extraStyle = styleElement;

    styleElement.text(css);
  }

  calcContentFontSize(fontSizeStr: string): string {
    let match = fontSizeStr.match(/[\d.]+(px|r?em|pt)/);
    if (match) {
      const size = match[0].match(/[\d.]+/);
      const type = match[1];
      return (size ? parseFloat(size[0]) : 0) + type;
    }

    match = fontSizeStr.match(/([\d.]+)/);
    if (match) {
      return parseFloat(match[1]) + 'px';
    }

    return '';
  }

  calcTitleFontSize(fontSizeStr: string): string {
    let match = fontSizeStr.match(/[\d.]+(px|r?em|pt)/);
    if (match) {
      const size = match[0].match(/[\d.]+/);
      const type = match[1];
      return (size ? parseFloat(size[0]) : 0) * 1.8 + type;
    }

    match = fontSizeStr.match(/([\d.]+)/);
    if (match) {
      return parseFloat(match[1]) * 1.8 + 'px';
    }

    return '';
  }

  hideFooterNavStyle(hidden: boolean): void {
    const navStyle = $('#footer_nav_css');
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
  }

  fixMobile(): void {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1');
    document.head.appendChild(meta);
  }

  getSkinList(): UISkinMap {
    return this.skins;
  }

  getSiteFontFamily(): string {
    return this.siteFontFamily;
  }
}

export default UIStyleManager;
