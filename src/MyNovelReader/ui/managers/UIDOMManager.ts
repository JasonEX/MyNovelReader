import Setting from '../../Setting';
import type { IUIDOMManager, UIElement, UIElementKey } from '../types';

class UIDOMManager implements IUIDOMManager {
  $menu: UIElement = null as unknown as UIElement;

  $menuBar: UIElement = null as unknown as UIElement;

  $content: UIElement = null as unknown as UIElement;

  $preferencesBtn: UIElement = null as unknown as UIElement;

  menu_list_hiddden = false;

  init(): void {
    this.$menu = $('#menu');
    this.$menuBar = $('#menu-bar');
    this.$content = $('#mynovelreader-content');
    this.$preferencesBtn = $('#preferencesBtn');
  }

  hideMenuList(hidden?: boolean): void {
    const targetHidden = typeof hidden === 'undefined' ? !this.menu_list_hiddden : hidden;

    if (targetHidden) {
      this.$menu.removeClass('menu-open');
      this.$content.css('margin-left', '');
    } else {
      this.$menu.addClass('menu-open');
      this.$content.css('margin-left', '270px');
    }

    this.menu_list_hiddden = targetHidden;
  }

  hidePreferencesButton(hidden?: boolean): void {
    const shouldHide =
      typeof hidden === 'undefined' ? Boolean(Setting.hide_preferences_button) : hidden;

    this.$preferencesBtn.toggle(!shouldHide);
  }

  hideMenuBar(hidden?: boolean): void {
    const shouldHide = typeof hidden === 'undefined' ? Boolean(Setting.menu_bar_hidden) : hidden;

    this.$menuBar.toggle(!shouldHide);
  }

  getElement(key: UIElementKey): UIElement {
    const elementMap: Record<UIElementKey, UIElement> = {
      menu: this.$menu,
      menuBar: this.$menuBar,
      content: this.$content,
      preferencesBtn: this.$preferencesBtn,
    };

    return elementMap[key];
  }
}

export default UIDOMManager;
