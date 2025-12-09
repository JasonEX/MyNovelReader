import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Setting from '../../src/MyNovelReader/Setting';
import { ScrollManager } from '../../src/MyNovelReader/app/scroll/ScrollManager';
import { RequestStatus } from '../../src/MyNovelReader/request';

const doRequestMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const onLoadedMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const loadingHtmlMock = vi.hoisted(() => vi.fn().mockReturnThis());
const loadingShowMock = vi.hoisted(() => vi.fn().mockReturnThis());
const getRequestMock = vi.hoisted(() => vi.fn());
const requestDoc = vi.hoisted(() => document.implementation.createHTMLDocument('next'));

vi.mock('../../src/MyNovelReader/Setting', () => ({
  default: {
    remain_height: 100,
    addToHistory: true,
    scrollAnimate: false,
  },
}));

vi.mock('../../src/MyNovelReader/request', () => ({
  RequestStatus: { Idle: 0, Loading: 1, Finish: 2, Fail: 3 },
  iframeHeight: 30,
}));

const logErrorMock = vi.hoisted(() => vi.fn());

vi.mock('../../src/MyNovelReader/lib', () => ({
  C: { error: logErrorMock },
}));

const resetInstance = () => {
  (ScrollManager as unknown as { instance?: unknown }).instance = undefined;
};

const buildDependencies = () => ({
  loadingElement: {
    html: loadingHtmlMock,
    show: loadingShowMock,
  } as unknown as JQuery<HTMLElement>,
  chapterList: {
    toArray: () => [],
  } as unknown as JQuery<HTMLElement>,
  doRequest: doRequestMock,
  onLoaded: onLoadedMock,
  getRequest: getRequestMock,
});

beforeEach(() => {
  resetInstance();
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  doRequestMock.mockClear();
  onLoadedMock.mockClear();
  loadingHtmlMock.mockClear();
  loadingShowMock.mockClear();
  getRequestMock.mockReset();
});

afterEach(() => {
  resetInstance();
  vi.restoreAllMocks();
});

describe('ScrollManager.scrollForce', () => {
  it('delegates based on request status', async () => {
    const manager = ScrollManager.getInstance();
    const dependencies = buildDependencies();
    manager.init({
      isEnabled: true,
      paused: false,
      curPageUrl: 'https://example.com/ch1',
      dependencies,
    });

    getRequestMock.mockReturnValueOnce({ status: RequestStatus.Idle, getDocument: () => null });
    await manager.scrollForce();
    expect(doRequestMock).toHaveBeenCalled();

    getRequestMock.mockReturnValueOnce({
      status: RequestStatus.Finish,
      getDocument: () => requestDoc,
    });
    await manager.scrollForce();
    expect(onLoadedMock).toHaveBeenCalledWith(requestDoc);

    getRequestMock.mockReturnValueOnce({ status: RequestStatus.Fail, getDocument: () => null });
    await manager.scrollForce();
    expect(loadingHtmlMock).toHaveBeenCalled();
    expect(loadingShowMock).toHaveBeenCalled();
  });
});

describe('ScrollManager.updateCurFocusElement', () => {
  it('tracks active article, menu item, and history', () => {
    const manager = ScrollManager.getInstance();
    const loadingElement = {
      html: loadingHtmlMock,
      show: loadingShowMock,
    } as unknown as JQuery<HTMLElement>;

    const chapterListRoot = document.createElement('ul');
    const item1Wrapper = document.createElement('li');
    const item1 = document.createElement('div');
    item1.setAttribute('href', '#page-1');
    item1.setAttribute('realHref', 'https://example.com/p1');
    item1Wrapper.appendChild(item1);
    const item2Wrapper = document.createElement('li');
    const item2 = document.createElement('div');
    item2.setAttribute('href', '#page-2');
    item2Wrapper.appendChild(item2);
    chapterListRoot.append(item1Wrapper, item2Wrapper);

    const article1 = document.createElement('article');
    article1.id = 'page-1';
    article1.innerHTML = '<div class="title">Chapter A</div>';
    Object.defineProperty(article1, 'getBoundingClientRect', {
      value: () => ({ top: 0, left: 0, right: 0, bottom: 200, width: 0, height: 200 }),
    });
    const article2 = document.createElement('article');
    article2.id = 'page-2';
    Object.defineProperty(article2, 'getBoundingClientRect', {
      value: () => ({ top: 400, left: 0, right: 0, bottom: 600, width: 0, height: 200 }),
    });
    document.body.append(article1, article2);

    const dependencies = {
      loadingElement,
      chapterList: { toArray: () => [chapterListRoot] } as unknown as JQuery<HTMLElement>,
      doRequest: doRequestMock,
      onLoaded: onLoadedMock,
      getRequest: getRequestMock,
    };

    const pushSpy = vi.spyOn(history, 'pushState');
    pushSpy.mockImplementation(() => undefined);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 50 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 200 });

    manager.init({
      isEnabled: true,
      paused: false,
      curPageUrl: 'https://example.com/ch1',
      parsers: [{ docTitle: 'Chapter A' } as never],
      dependencies,
    });

    manager.updateCurFocusElement();

    expect(manager.getCurFocusElement()).toBe(article1);
    expect(manager.getCurFocusIndex()).toBe(0);
    expect(manager.getActiveUrl()).toBe('https://example.com/p1');
    expect(item1Wrapper.classList.contains('active')).toBe(true);
    expect(item2Wrapper.classList.contains('active')).toBe(false);
    expect(pushSpy).toHaveBeenCalledWith(null, 'Chapter A', 'https://example.com/p1');
    expect(document.title).toBe('Chapter A');
  });
});

describe('ScrollManager.resetCache', () => {
  it('rebuilds offsets when DOM changes', () => {
    const manager = ScrollManager.getInstance();

    const chapterListRoot = document.createElement('ul');
    chapterListRoot.appendChild(document.createElement('div'));

    const article1 = document.createElement('article');
    article1.id = 'page-1';
    Object.defineProperty(article1, 'getBoundingClientRect', {
      value: () => ({ top: 10, left: 0, right: 0, bottom: 110, width: 0, height: 100 }),
    });
    const article2 = document.createElement('article');
    article2.id = 'page-2';
    Object.defineProperty(article2, 'getBoundingClientRect', {
      value: () => ({ top: 300, left: 0, right: 0, bottom: 400, width: 0, height: 100 }),
    });
    document.body.append(article1, article2);

    const dependencies = {
      loadingElement: {
        html: loadingHtmlMock,
        show: loadingShowMock,
      } as unknown as JQuery<HTMLElement>,
      chapterList: { toArray: () => [chapterListRoot] } as unknown as JQuery<HTMLElement>,
      doRequest: doRequestMock,
      onLoaded: onLoadedMock,
      getRequest: getRequestMock,
    };

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 20 });

    manager.init({ isEnabled: true, paused: false, dependencies });
    manager.resetCache();

    expect(manager.getScrollOffsets()).toEqual([30, 320]);
  });
});

describe('ScrollManager.scrollToArticle', () => {
  it('scrolls directly when given an offset', () => {
    const manager = ScrollManager.getInstance();
    const scrollSpy = vi.spyOn(window, 'scrollTo');

    manager.scrollToArticle(250);

    expect(scrollSpy).toHaveBeenCalledWith(0, 250);
  });

  it('scrolls to element position with animation when enabled', () => {
    const manager = ScrollManager.getInstance();
    const target = document.createElement('article');
    Object.defineProperty(target, 'getBoundingClientRect', {
      value: () => ({ top: 300, left: 0, right: 0, bottom: 350, width: 0, height: 50 }),
    });
    document.body.append(target);

    const computedSpy = vi.spyOn(window, 'getComputedStyle');
    computedSpy.mockReturnValue({ marginTop: '20px' } as unknown as CSSStyleDeclaration);

    Setting.scrollAnimate = true;
    const scrollSpy = vi.spyOn(window, 'scrollTo');

    manager.scrollToArticle(target);

    expect(scrollSpy).toHaveBeenCalledWith({ top: 280, behavior: 'smooth' });

    Setting.scrollAnimate = false;
  });
});
