import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PageManager } from '../../src/MyNovelReader/app/page/PageManager';

const scrollReset = vi.hoisted(() => vi.fn());
const busEmit = vi.hoisted(() => vi.fn());

vi.mock('../../src/MyNovelReader/Setting', () => ({
  default: { hide_footer_nav: true },
}));
vi.mock('../../src/MyNovelReader/config', () => ({
  default: { fixImageFloats: true },
}));
vi.mock('../../src/MyNovelReader/UI', () => ({
  default: { tpl_footer_nav: '<footer></footer>' },
}));
vi.mock('../../src/MyNovelReader/app/bus', () => ({
  default: { emit: busEmit },
  APPEND_NEXT_PAGE: 'appended_next_page',
}));
vi.mock('../../src/MyNovelReader/app/scroll/ScrollManager', () => ({
  default: { resetCache: scrollReset },
}));

const resetInstance = () => {
  (PageManager as unknown as { instance?: unknown }).instance = undefined;
};

class JQueryStub {
  private elements: HTMLElement[];

  constructor(elements: Iterable<Element>) {
    this.elements = Array.from(elements).map(el => el as HTMLElement);
  }

  find(selector: string): JQueryStub {
    const matched = this.elements.flatMap(el => Array.from(el.querySelectorAll(selector)));
    return new JQueryStub(matched);
  }

  map(fn: (_this: HTMLElement, _index: number, _element: HTMLElement) => unknown) {
    const results = this.elements.map((el, idx) => fn.call(el, idx, el));
    return {
      get: () => results,
    };
  }

  get(): HTMLElement[] {
    return this.elements;
  }

  offset() {
    const first = this.elements[0];
    return { top: first?.offsetTop ?? 0 };
  }

  height() {
    const first = this.elements[0] as HTMLElement | undefined;
    return first?.clientHeight ?? 0;
  }
}

const jq = (input: string | HTMLElement | Document) => {
  if (typeof input === 'string') {
    const elements = Array.from(document.querySelectorAll(input)).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
    return new JQueryStub(elements as Iterable<HTMLElement>);
  }
  if (input instanceof Document) {
    const html = input.documentElement as HTMLElement;
    return new JQueryStub([html]);
  }
  return new JQueryStub([input]);
};

beforeEach(() => {
  resetInstance();
  scrollReset.mockClear();
  busEmit.mockClear();
  (jq as unknown as { nano?: (_tpl: string, _data: { chapterTitle: string }) => string }).nano = (
    tpl: string,
    data: { chapterTitle: string }
  ) => tpl.replace('{chapterTitle}', data.chapterTitle);
  (globalThis as unknown as { $: unknown }).$ = jq;
  document.body.innerHTML = '';
});

afterEach(() => {
  resetInstance();
});

describe('PageManager.appendPage', () => {
  it('creates new article, menu item, and updates caches when appending first page', () => {
    const contentElement = document.createElement('div');
    const chapterListElement = document.createElement('ul');
    document.body.append(contentElement, chapterListElement);

    const manager = PageManager.getInstance();
    const oArticles: string[] = [];
    const parsers: unknown[] = [];
    const setPageNum = vi.fn();

    manager.init({
      contentElement,
      chapterListElement,
      getPageNum: () => 1,
      setPageNum,
      oArticles,
      parsers: parsers as never[],
    });

    const parser = {
      chapterTitle: 'Chapter 1',
      content: '<p>hello</p>',
      curPageUrl: 'https://example.com/ch1',
      isSection: false,
    } as never;

    manager.appendPage(parser, true);

    const article = contentElement.querySelector('article');
    expect(article?.id).toBe('page-1');
    expect(article?.querySelector('h1')?.textContent).toBe('Chapter 1');

    const menuItems = chapterListElement.querySelectorAll('li.chapter');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].classList.contains('active')).toBe(true);
    expect(setPageNum).toHaveBeenCalledWith(2);
    expect(oArticles).toHaveLength(1);
    expect(parsers).toContain(parser);
    expect(scrollReset).toHaveBeenCalled();
    expect(busEmit).toHaveBeenCalledWith('appended_next_page');
  });

  it('merges sections into existing chapter without duplicating menu items', () => {
    const contentElement = document.createElement('div');
    const chapterListElement = document.createElement('ul');
    document.body.append(contentElement, chapterListElement);

    const existingArticle = document.createElement('article');
    existingArticle.id = 'page-1';
    existingArticle.innerHTML =
      '<p>First part</p><p>Tail</p><div class="chapter-footer-nav">old</div>';
    contentElement.appendChild(existingArticle);

    const manager = PageManager.getInstance();
    const oArticles: string[] = [];
    const parsers: unknown[] = [];

    manager.init({
      contentElement,
      chapterListElement,
      getPageNum: () => 2,
      setPageNum: vi.fn(),
      oArticles,
      parsers: parsers as never[],
    });

    const parser = {
      chapterTitle: 'Chapter 1-2',
      content: '<p> New section</p><div class="chapter-footer-nav">new</div>',
      curPageUrl: 'https://example.com/ch2',
      isSection: true,
    } as never;

    manager.appendPage(parser, false);

    expect(chapterListElement.querySelectorAll('li.chapter')).toHaveLength(0);
    const updated = contentElement.querySelector('article#page-1');
    const footer = updated?.querySelector('.chapter-footer-nav');
    expect(footer?.textContent).toBe('new');
    expect(updated?.textContent).toContain('TailNew section');
    expect(oArticles).toHaveLength(1);
  });
});

describe('PageManager.fixImageFloats', () => {
  it('adds blockImage class to large images when enabled', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'offsetWidth', { value: 800, configurable: true });
    const image = document.createElement('img');
    Object.defineProperty(image, 'offsetWidth', { value: 500, configurable: true });
    container.appendChild(image);

    const manager = PageManager.getInstance();

    manager.fixImageFloats(container);

    expect(image.classList.contains('blockImage')).toBe(true);
  });
});
