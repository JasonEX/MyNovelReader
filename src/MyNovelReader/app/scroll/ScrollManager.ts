import Setting from '../../Setting';
import { C } from '../../lib';
import { iframeHeight, RequestStatus } from '../../request';
import type { IParser as ParserInstance } from '../../../typings/MyNovelReader';

interface RequestLike {
  status: RequestStatus;
  display?: boolean;
  getDocument: () => Document | null;
}

interface ScrollManagerDependencies {
  loadingElement: JQuery<HTMLElement>;
  chapterList: JQuery<HTMLElement>;
  doRequest: () => Promise<void>;
  onLoaded: (_doc: Document | null) => Promise<void>;
  getRequest: () => RequestLike | null;
}

interface ScrollManagerInitOptions {
  isEnabled: boolean;
  paused: boolean;
  isTheEnd?: boolean | 'vip';
  curPageUrl?: string;
  parsers?: ParserInstance[];
  dependencies: ScrollManagerDependencies;
  preloadNextPagePromiseResolve?: (() => void) | null;
}

class ScrollManager {
  private static instance: ScrollManager;

  private isEnabled = false;
  private paused = false;
  private isTheEnd: boolean | 'vip' = false;
  private curFocusElement: HTMLElement | null = null;
  private curFocusIndex = 1;
  private scrollOffsets: number[] = [];
  private scrollItems: HTMLElement[] = [];
  private menuItems: HTMLElement[] = [];
  private parsers: ParserInstance[] = [];
  private activeUrl: string | null = null;
  private lastId = '';
  private curPageUrl = '';
  private preloadNextPagePromiseResolve: (() => void) | null = null;

  private dependencies: ScrollManagerDependencies | null = null;

  private constructor() {}

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager();
    }
    return ScrollManager.instance;
  }

  init(options: ScrollManagerInitOptions): void {
    const {
      isEnabled,
      paused,
      isTheEnd = false,
      curPageUrl = '',
      parsers = [],
      dependencies,
      preloadNextPagePromiseResolve = null,
    } = options;

    this.isEnabled = isEnabled;
    this.paused = paused;
    this.isTheEnd = isTheEnd;
    this.curPageUrl = curPageUrl;
    this.parsers = parsers;
    this.dependencies = dependencies;
    this.preloadNextPagePromiseResolve = preloadNextPagePromiseResolve;
    this.lastId = '';

    this.resetCache();
  }

  setParsers(parsers: ParserInstance[]): void {
    this.parsers = parsers;
  }

  setCurPageUrl(url: string): void {
    this.curPageUrl = url;
  }

  setIsEnabled(value: boolean): void {
    this.isEnabled = value;
  }

  setPaused(value: boolean): void {
    this.paused = value;
  }

  setIsTheEnd(value: boolean | 'vip'): void {
    this.isTheEnd = value;
  }

  setPreloadResolver(resolver: (() => void) | null): void {
    this.preloadNextPagePromiseResolve = resolver;
  }

  getActiveUrl(): string | null {
    return this.activeUrl;
  }

  getCurFocusElement(): HTMLElement | null {
    return this.curFocusElement;
  }

  getCurFocusIndex(): number {
    return this.curFocusIndex;
  }

  getScrollOffsets(): number[] {
    return [...this.scrollOffsets];
  }

  resetCache(): void {
    const deps = this.dependencies;
    if (!deps) {
      this.menuItems = [];
      this.scrollItems = [];
      this.scrollOffsets = [];
      return;
    }

    const chapterRoots = deps.chapterList?.toArray() ?? [];
    this.menuItems = chapterRoots.flatMap(root =>
      Array.from(root.querySelectorAll<HTMLElement>('div'))
    );

    this.scrollItems = Array.from(document.querySelectorAll<HTMLElement>('article[id^=page-]'));
    this.scrollOffsets = this.scrollItems.map(item => {
      const rect = item.getBoundingClientRect();
      return rect.top + window.scrollY;
    });
  }

  async scroll(): Promise<void> {
    if (!this.isEnabled || this.scrollItems.length === 0) {
      return;
    }

    const request = this.dependencies?.getRequest();

    if (request?.display && Math.floor(this.getRemain() - iframeHeight) < 0) {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight - iframeHeight + 51);
    }

    if (!this.paused && this.getRemain() < Setting.remain_height) {
      await this.scrollForce();
    }

    if (this.isTheEnd) {
      this.dependencies?.loadingElement.html(this.translate('已到达最后一页...')).show();
    }

    this.updateCurFocusElement();
  }

  async scrollForce(): Promise<void> {
    const deps = this.dependencies;
    const request = deps?.getRequest();

    if (!deps || !request) {
      return;
    }

    switch (request.status) {
      case RequestStatus.Idle:
        await deps.doRequest();
        break;
      case RequestStatus.Finish:
        await deps.onLoaded(request.getDocument());
        break;
      case RequestStatus.Fail: {
        const nextUrl = this.curPageUrl;
        deps.loadingElement
          .html(`<a href="${nextUrl}">${this.translate('无法获取下一页，请手动点击')}</a>`)
          .show();
        break;
      }
      default:
        break;
    }
  }

  updateCurFocusElement(): void {
    if (this.scrollItems.length === 0) {
      return;
    }

    if (this.scrollOffsets.length !== this.scrollItems.length) {
      this.resetCache();
    }

    if (this.scrollItems.length === 0) {
      return;
    }

    const fromTop = window.scrollY + window.innerHeight / 2;
    let curIndex = -1;

    for (let i = 0; i < this.scrollOffsets.length; i += 1) {
      if (this.scrollOffsets[i] < fromTop) {
        curIndex = i;
      } else {
        break;
      }
    }

    const visitedLength = curIndex + 1;
    this.curFocusIndex = curIndex;
    const cur = curIndex >= 0 ? this.scrollItems[curIndex] : null;
    const id = cur ? cur.id : '';

    if (this.lastId === id) {
      return;
    }

    this.lastId = id;

    const activeItem = this.menuItems.find(item => item.getAttribute('href') === `#${id}`);
    const activeUrl = activeItem?.getAttribute('realHref') ?? null;

    this.menuItems.forEach(item => item.parentElement?.classList.remove('active'));
    activeItem?.parentElement?.classList.add('active');

    this.curFocusElement = cur;
    this.activeUrl = activeUrl;

    if (Setting.addToHistory && id) {
      const matched = id.match(/\d+/);
      const curNum = matched ? Number(matched[0]) - 1 : -1;
      const curTitle = curNum >= 0 && this.parsers[curNum] ? this.parsers[curNum].docTitle : '';

      if (curTitle && activeUrl) {
        const url = activeUrl.replace('http://read.qidian.com', '');
        try {
          history.pushState(null, curTitle, url);
        } catch (e) {
          C.error('添加下一页到历史记录失败', e);
        }

        document.title = curTitle;
      }
    }

    if (this.preloadNextPagePromiseResolve && this.scrollItems.length === visitedLength) {
      this.preloadNextPagePromiseResolve();
      this.preloadNextPagePromiseResolve = null;
    }
  }

  getRemain(): number {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    return scrollHeight - window.innerHeight - window.scrollY;
  }

  scrollToArticle(elem: number | HTMLElement | JQuery<HTMLElement> | null): void {
    if (elem === null || typeof elem === 'undefined') {
      return;
    }

    let offsetTop: number | undefined;
    if (typeof elem === 'number') {
      offsetTop = elem;
    } else {
      const targetElement =
        elem && typeof elem === 'object' && 'jquery' in (elem as JQuery<HTMLElement>)
          ? (elem as JQuery<HTMLElement>).get(0)
          : (elem as HTMLElement | null);

      if (targetElement) {
        const marginTop = parseInt(getComputedStyle(targetElement).marginTop, 10) || 0;
        const rect = targetElement.getBoundingClientRect();
        offsetTop = rect.top + window.scrollY - marginTop;
      }
    }

    if (typeof offsetTop === 'undefined') {
      return;
    }

    if (Setting.scrollAnimate) {
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, offsetTop);
    }
  }

  private translate(text: string): string {
    const translator = (text as unknown as { uiTrans?: () => string }).uiTrans;
    if (typeof translator === 'function') {
      return translator.call(text);
    }
    return text;
  }
}

const scrollManager = ScrollManager.getInstance();

export { ScrollManager, scrollManager };
export default scrollManager;
