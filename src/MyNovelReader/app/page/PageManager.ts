import Setting from '../../Setting';
import config from '../../config';
import UI from '../../UI';
import bus, { APPEND_NEXT_PAGE } from '../bus';
import scrollManager from '../scroll/ScrollManager';
import type { IParser as ParserInstance } from '../../../typings/MyNovelReader';

interface PageManagerCache {
  menuItems: JQuery<HTMLElement>;
  scrollItems: JQuery<HTMLElement>;
  scrollOffsets: number[];
}

interface PageManagerInitOptions {
  contentElement: HTMLElement | null;
  chapterListElement: HTMLElement | null;
  getPageNum: () => number;
  setPageNum: (_pageNum: number) => void;
  oArticles: string[];
  parsers: ParserInstance[];
  onCacheReset?: (_cache: PageManagerCache) => void;
}

class PageManager {
  private static instance: PageManager;

  private contentElement: HTMLElement | null = null;
  private chapterListElement: HTMLElement | null = null;
  private getPageNum: () => number = () => 1;
  private setPageNum: (_pageNum: number) => void = () => {};
  private oArticles: string[] = [];
  private parsers: ParserInstance[] = [];
  private onCacheReset?: (_cache: PageManagerCache) => void;

  private constructor() {}

  static getInstance(): PageManager {
    if (!PageManager.instance) {
      PageManager.instance = new PageManager();
    }
    return PageManager.instance;
  }

  init(options: PageManagerInitOptions): void {
    const {
      contentElement,
      chapterListElement,
      getPageNum,
      setPageNum,
      oArticles,
      parsers,
      onCacheReset,
    } = options;

    this.contentElement = contentElement;
    this.chapterListElement = chapterListElement;
    this.getPageNum = getPageNum;
    this.setPageNum = setPageNum;
    this.oArticles = oArticles;
    this.parsers = parsers;
    this.onCacheReset = onCacheReset;
  }

  appendPage(parser: ParserInstance, isFirst = false): void {
    if (!this.contentElement || !this.chapterListElement) {
      return;
    }

    const currentPageNum = this.getPageNum();
    const chapters = this.contentElement.querySelectorAll('article');
    const lastChapter = chapters.length ? (chapters[chapters.length - 1] as HTMLElement) : null;

    const targetChapter =
      lastChapter && parser.isSection
        ? this.appendSection(lastChapter, parser)
        : this.createArticle(currentPageNum, parser);

    if (!lastChapter || !parser.isSection) {
      this.addChapterListItem(currentPageNum, parser, isFirst);
      this.resetCache();
    }

    this.setPageNum(currentPageNum + 1);

    if (targetChapter) {
      this.oArticles.push(targetChapter.outerHTML);
    }
    this.parsers.push(parser);

    bus.emit(APPEND_NEXT_PAGE);
  }

  resetCache(): void {
    if (!this.chapterListElement) {
      return;
    }

    const menuItems = $(this.chapterListElement).find('div');
    const scrollItems = $('article[id^=page-]');
    const scrollOffsets = scrollItems
      .map(function mapOffsets() {
        return $(this).offset()?.top ?? 0;
      })
      .get();

    this.onCacheReset?.({ menuItems, scrollItems, scrollOffsets });

    scrollManager.resetCache();
  }

  fixImageFloats(articleContent?: HTMLElement | Document | null): void {
    if (!config.fixImageFloats) return;

    const rootElement =
      articleContent instanceof Document ? articleContent.body : articleContent || document.body;

    if (!rootElement) {
      return;
    }

    const containerWidth = Math.max(
      0,
      Math.min(rootElement.offsetWidth || rootElement.clientWidth || 0, 800)
    );

    const imageWidthThreshold = containerWidth * 0.55;

    if (!imageWidthThreshold) {
      return;
    }

    const images = rootElement.querySelectorAll<HTMLImageElement>('img:not(.blockImage)');

    images.forEach(image => {
      const imageWidth = image.offsetWidth || image.clientWidth || 0;
      if (imageWidth > imageWidthThreshold) {
        image.classList.add('blockImage');
      }
    });
  }

  private appendSection(chapterElement: HTMLElement, parser: ParserInstance): HTMLElement {
    const lastParagraph = chapterElement.querySelector('p:last-of-type');
    const lastText = (lastParagraph?.textContent || '').trimEnd();
    if (lastParagraph) {
      lastParagraph.remove();
    }

    const newPageHtml = parser.content.replace(/<p>\s+/, `<p>${lastText}`);

    chapterElement.querySelector('.chapter-footer-nav')?.remove();
    chapterElement.insertAdjacentHTML('beforeend', newPageHtml);

    if (!Setting.hide_footer_nav) {
      const footerHtml = this.renderFooter(parser);
      if (footerHtml) {
        chapterElement.insertAdjacentHTML('beforeend', footerHtml);
      }
    }

    return chapterElement;
  }

  private createArticle(pageNum: number, parser: ParserInstance): HTMLElement {
    const article = document.createElement('article');
    article.id = `page-${pageNum}`;

    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = parser.chapterTitle;
    article.appendChild(title);

    article.insertAdjacentHTML('beforeend', parser.content);

    if (!Setting.hide_footer_nav) {
      const footerHtml = this.renderFooter(parser);
      if (footerHtml) {
        article.insertAdjacentHTML('beforeend', footerHtml);
      }
    }

    this.contentElement?.appendChild(article);

    return article;
  }

  private renderFooter(parser: ParserInstance): string {
    const nano = ($ as JQueryStatic & { nano?: (_tpl: string, _data: unknown) => string }).nano;
    if (typeof nano === 'function') {
      return nano(UI.tpl_footer_nav, parser);
    }
    return '';
  }

  private addChapterListItem(pageNum: number, parser: ParserInstance, isFirst: boolean): void {
    if (!this.chapterListElement) {
      return;
    }

    const chapterItem = document.createElement('li');
    chapterItem.className = 'chapter';

    const chapterLink = document.createElement('div');
    chapterLink.setAttribute('href', `#page-${pageNum}`);
    chapterLink.setAttribute('realHref', parser.curPageUrl);
    chapterLink.setAttribute('onclick', 'return false;');
    chapterLink.setAttribute('title', parser.chapterTitle);
    chapterLink.textContent = parser.chapterTitle;

    chapterItem.appendChild(chapterLink);

    if (this.chapterListElement.firstChild) {
      this.chapterListElement.insertBefore(chapterItem, this.chapterListElement.firstChild);
    } else {
      this.chapterListElement.appendChild(chapterItem);
    }

    if (isFirst) {
      chapterItem.classList.add('active');
    }
  }
}

const pageManager = PageManager.getInstance();

export { PageManager, pageManager };
export default pageManager;
