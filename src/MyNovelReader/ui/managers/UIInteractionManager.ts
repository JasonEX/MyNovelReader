import { L_setValue } from '../../lib';
import uiService from '../../app/ui/UIServiceImpl';
import type { IUIInteractionManager } from '../types';

class UIInteractionManager implements IUIInteractionManager {
  _isQuietMode = false;

  $_quietStyle: JQuery<HTMLElement> | null = null;

  toggleQuietMode(force?: boolean): void {
    this._isQuietMode = typeof force === 'boolean' ? force : !this._isQuietMode;
    const selector = '#menu-bar, #menu, #preferencesBtn, .readerbtn';

    if (this.$_quietStyle) {
      this.$_quietStyle.remove();
      this.$_quietStyle = null;
    }

    if (this._isQuietMode) {
      $(selector).addClass('quiet-mode');
    } else {
      $(selector).removeClass('quiet-mode');
    }
  }

  async addButton(): Promise<void> {
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
  }

  openHelp(): void {}
}

export default UIInteractionManager;
