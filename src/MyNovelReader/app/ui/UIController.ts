import Setting from '../../Setting';
import { L_setValue } from '../../lib';

declare const key: {
  (_keyCode: string, _callback: (_event?: KeyboardEvent) => boolean | void): void;
  unbind(_keyCode?: string): void;
};

type ScrollTarget = number | HTMLElement | JQuery<HTMLElement> | null | undefined;
type KeyboardEventLike = KeyboardEvent | JQuery.Event | undefined;

interface UIElements {
  doc: JQuery<HTMLElement>;
  content: JQuery<HTMLElement>;
  menuBar: JQuery<HTMLElement>;
  menuHeader: JQuery<HTMLElement>;
  chapterList: JQuery<HTMLElement>;
  loadingElement: JQuery<HTMLElement>;
  preferencesButton?: JQuery<HTMLElement>;
}

interface UIControllerDependencies {
  scroll: () => void | Promise<void>;
  scrollToArticle: (_elem: ScrollTarget) => void;
  hideMenuList: () => void;
  showPreferences: () => void;
  toggleQuietMode: () => void;
  hidePreferences: () => void;
  openHelp: () => void;
  notice: (_message: string) => void;
  isPreferencesOpen: () => boolean;
  openSpeech: () => void;
  getRemain: () => number;
  getDocumentHeight: () => number;
}

interface UIControllerInitState {
  paused?: boolean;
  indexUrl?: string | null;
  prevUrl?: string | null;
  requestUrl?: string | null;
  lastRequestUrl?: string | null;
}

interface UIControllerInitOptions {
  elements: UIElements;
  dependencies: UIControllerDependencies;
  state?: UIControllerInitState;
  getCurFocusElement: () => HTMLElement | null;
  onPausedChange?: (_paused: boolean) => void;
}

class UIController {
  private static instance: UIController;

  private elements: UIElements | null = null;
  private dependencies: UIControllerDependencies | null = null;
  private cleanupHandlers: Array<() => void> = [];
  private paused = false;
  private indexUrl: string | null = null;
  private prevUrl: string | null = null;
  private requestUrl: string | null = null;
  private lastRequestUrl: string | null = null;
  private getCurFocusElement: (() => HTMLElement | null) | null = null;
  private onPausedChange?: (_paused: boolean) => void;

  private constructor() {}

  static getInstance(): UIController {
    if (!UIController.instance) {
      UIController.instance = new UIController();
    }
    return UIController.instance;
  }

  init(options: UIControllerInitOptions): void {
    const { elements, dependencies, state, getCurFocusElement, onPausedChange } = options;

    this.elements = elements;
    this.dependencies = dependencies;
    this.getCurFocusElement = getCurFocusElement;
    this.onPausedChange = onPausedChange;

    this.updateState({
      paused: state?.paused,
      indexUrl: state?.indexUrl ?? null,
      prevUrl: state?.prevUrl ?? null,
      requestUrl: state?.requestUrl ?? null,
      lastRequestUrl: state?.lastRequestUrl ?? null,
    });
  }

  updateState(state: UIControllerInitState): void {
    if (typeof state.paused === 'boolean') {
      this.paused = state.paused;
    }
    if (state.indexUrl !== undefined) {
      this.indexUrl = state.indexUrl;
    }
    if (state.prevUrl !== undefined) {
      this.prevUrl = state.prevUrl;
    }
    if (state.requestUrl !== undefined) {
      this.requestUrl = state.requestUrl;
    }
    if (state.lastRequestUrl !== undefined) {
      this.lastRequestUrl = state.lastRequestUrl;
    }
  }

  registerControls(): void {
    const elements = this.elements;
    const deps = this.dependencies;

    if (!elements || !deps) {
      return;
    }

    this.removeListeners();

    const throttledScroll = this.throttle(() => {
      void deps.scroll();
    }, 250);
    window.addEventListener('scroll', throttledScroll);
    this.addCleanup(() => window.removeEventListener('scroll', throttledScroll));

    this.registerKeys();

    if (Setting.dblclickPause) {
      const handleContentDblclick = () => {
        void this.pauseHandler();
      };
      const contentElement = elements.content.get(0);
      if (contentElement) {
        contentElement.addEventListener('dblclick', handleContentDblclick);
        this.addCleanup(() =>
          contentElement.removeEventListener('dblclick', handleContentDblclick)
        );
      }
    }

    const handleMenuHeaderClick = () => {
      this.copyCurTitle();
    };
    const menuHeaderElement = elements.menuHeader.get(0);
    if (menuHeaderElement) {
      menuHeaderElement.addEventListener('click', handleMenuHeaderClick);
      this.addCleanup(() => menuHeaderElement.removeEventListener('click', handleMenuHeaderClick));
    }

    const handleMenuBarClick = () => {
      deps.hideMenuList();
    };
    const menuBarElement = elements.menuBar.get(0);
    if (menuBarElement) {
      menuBarElement.addEventListener('click', handleMenuBarClick);
      this.addCleanup(() => menuBarElement.removeEventListener('click', handleMenuBarClick));
    }

    const docElement = elements.doc.get(0);
    if (docElement) {
      const handleChapterMouseDown = (event: MouseEvent) => {
        const target = (event.target as HTMLElement | null)?.closest('#chapter-list div');
        if (!target || !docElement.contains(target)) {
          return;
        }

        const which = event.which ?? event.button + 1;

        switch (which) {
          case 1: {
            const href = target.getAttribute('href');
            if (href) {
              const article = document.querySelector<HTMLElement>(href);
              deps.scrollToArticle(article);
            } else {
              const realHref = target.getAttribute('realHref');
              if (realHref) {
                location.href = realHref;
              }
            }
            break;
          }
          case 2: {
            const realHref = target.getAttribute('realHref');
            if (realHref) {
              L_setValue('mynoverlreader_disable_once', 'true');
              this.openUrl(realHref);
            }
            break;
          }
          default:
            break;
        }
      };
      docElement.addEventListener('mousedown', handleChapterMouseDown);
      this.addCleanup(() => docElement.removeEventListener('mousedown', handleChapterMouseDown));
    }

    const preferencesButton = elements.preferencesButton;
    if (preferencesButton) {
      const handlePreferencesClick = (event: Event) => {
        event.preventDefault();
        deps.showPreferences();
      };
      const preferencesButtonElement = preferencesButton.get(0);
      if (preferencesButtonElement) {
        preferencesButtonElement.addEventListener('click', handlePreferencesClick);
        this.addCleanup(() =>
          preferencesButtonElement.removeEventListener('click', handlePreferencesClick)
        );
      }
    }

    GM_registerMenuCommand(this.translate('小说阅读脚本设置'), () => {
      deps.showPreferences();
    });
  }

  removeListeners(): void {
    this.cleanupHandlers.forEach(dispose => {
      dispose();
    });
    this.cleanupHandlers = [];
  }

  registerKeys(): void {
    const deps = this.dependencies;

    if (!deps) {
      return;
    }

    key('enter', event => {
      if (deps.isPreferencesOpen()) {
        return;
      }

      this.openUrl(this.indexUrl, this.translate('主页链接没有找到'));
      this.copyCurTitle();
      this.stopEvent(event);
    });
    this.addCleanup(() => key.unbind('enter'));

    key('left', () => {
      const focusElem = this.getFocusElement();
      const scrollTop = window.scrollY;

      if (!focusElem) {
        return false;
      }

      if (scrollTop === 0) {
        if (this.prevUrl) {
          location.href = this.prevUrl;
        }
        return false;
      }

      const rect = focusElem.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY;
      const windowHeight = window.innerHeight;

      if (offsetTop > scrollTop && offsetTop < scrollTop + windowHeight) {
        deps.scrollToArticle((focusElem.previousElementSibling as HTMLElement | null) || 0);
      } else {
        deps.scrollToArticle(focusElem);
      }

      return false;
    });
    this.addCleanup(() => key.unbind('left'));

    key('right', event => {
      const remain = deps.getRemain();

      if (remain === 0) {
        const targetUrl = this.lastRequestUrl || this.requestUrl;
        if (targetUrl) {
          location.href = targetUrl;
        }
      } else {
        const focusElem = this.getFocusElement();
        const target = (focusElem?.nextElementSibling as HTMLElement | null) ?? null;
        deps.scrollToArticle(target || deps.getDocumentHeight());
      }

      this.stopEvent(event);
      return false;
    });
    this.addCleanup(() => key.unbind('right'));

    key('esc', () => {
      if (deps.isPreferencesOpen()) {
        deps.hidePreferences();
        return false;
      }
    });
    this.addCleanup(() => key.unbind('esc'));

    key('shift+/', () => {
      deps.openHelp();
      return false;
    });
    this.addCleanup(() => key.unbind('shift+/'));

    const quietModeKey = String(Setting.quietModeKey);
    key(quietModeKey, () => {
      deps.toggleQuietMode();
      return false;
    });
    this.addCleanup(() => key.unbind(quietModeKey));

    const hideMenuListKey = String(Setting.hideMenuListKey);
    key(hideMenuListKey, () => {
      deps.hideMenuList();
      return false;
    });
    this.addCleanup(() => key.unbind(hideMenuListKey));

    const openPreferencesKey = String(Setting.openPreferencesKey);
    key(openPreferencesKey, () => {
      deps.showPreferences();
      return false;
    });
    this.addCleanup(() => key.unbind(openPreferencesKey));

    const openSpeechKey = String(Setting.openSpeechKey);
    key(openSpeechKey, () => {
      deps.openSpeech();
      return false;
    });
    this.addCleanup(() => key.unbind(openSpeechKey));

    key(',', () => {
      const { scrollX, scrollY, innerHeight } = window;
      window.scrollTo(scrollX, scrollY - innerHeight * 0.9);
    });
    this.addCleanup(() => key.unbind(','));

    key('.', () => {
      const { scrollX, scrollY, innerHeight } = window;
      window.scrollTo(scrollX, scrollY + innerHeight * 0.9);
    });
    this.addCleanup(() => key.unbind('.'));
  }

  copyCurTitle(): void {
    if (!Setting.copyCurTitle) {
      return;
    }

    const focusElem = this.getFocusElement();
    if (!focusElem) {
      return;
    }

    const titleElement = focusElem.querySelector('.title');
    const rawTitle = titleElement?.textContent ?? '';
    const title = rawTitle.replace(/第?\S+章/, '').trim();

    if (title) {
      GM_setClipboard(title, 'text');
    }
  }

  openUrl(url?: string | null, errorMsg?: string): void {
    if (url) {
      setTimeout(() => {
        GM_openInTab(url, false);
      }, 0);
    } else if (errorMsg) {
      this.dependencies?.notice(errorMsg);
    }
  }

  async pauseHandler(): Promise<void> {
    const deps = this.dependencies;
    const elements = this.elements;

    if (!deps || !elements) {
      return;
    }

    this.paused = !this.paused;
    this.onPausedChange?.(this.paused);

    if (this.paused) {
      deps.notice(
        this.translate('<b>状态</b>:自动翻页<span style="color:red!important;"><b>暂停</b></span>')
      );
      elements.loadingElement
        .html(this.translate('自动翻页已经<span style="color:red!important;"><b>暂停</b></span>'))
        .show();
    } else {
      deps.notice(
        this.translate('<b>状态</b>:自动翻页<span style="color:red!important;"><b>启用</b></span>')
      );
      await deps.scroll();
    }
  }

  getPaused(): boolean {
    return this.paused;
  }

  private addCleanup(dispose: () => void): void {
    this.cleanupHandlers.push(dispose);
  }

  private getFocusElement(): HTMLElement | null {
    return this.getCurFocusElement ? this.getCurFocusElement() : null;
  }

  private throttle<T extends (..._args: unknown[]) => void>(fn: T, wait: number): T {
    let timeout: number | null = null;
    let last = 0;

    const throttled = ((..._args: Parameters<T>) => {
      const now = Date.now();
      const remaining = wait - (now - last);

      const later = () => {
        last = Date.now();
        timeout = null;
        fn(..._args);
      };

      if (remaining <= 0 || remaining > wait) {
        if (timeout !== null) {
          clearTimeout(timeout);
          timeout = null;
        }
        last = now;
        fn(..._args);
      } else if (timeout === null) {
        timeout = window.setTimeout(later, remaining);
      }
    }) as T;

    return throttled;
  }

  private stopEvent(event?: KeyboardEventLike): void {
    event?.stopPropagation?.();
    event?.preventDefault?.();
  }

  private translate(text: string): string {
    const translator = (text as unknown as { uiTrans?: () => string }).uiTrans;
    if (typeof translator === 'function') {
      return translator.call(text);
    }
    return text;
  }
}

const uiController = UIController.getInstance();

export { UIController, uiController };
export default uiController;
