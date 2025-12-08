import config from '../../config';
import Parser from '../../parser';
import { loading } from '../../components/message';
import { saveAs, isWindows } from '../../utils';
import getNumFromChapterTitle from '../../utils/getNumFromChapterTitle';
import { sleep, C } from '../../lib';
import { HttpRequest, IframeRequest } from '../../request';
import type { IParser as ParserInstance, SiteConfig } from '../../../typings/MyNovelReader';

type RequestLike = HttpRequest | IframeRequest;

interface SaveOptions {
  site: SiteConfig | null;
  parsers: ParserInstance[];
  curPageUrl?: string;
}

interface FileNameInfo {
  bookTitle: string;
  start: number;
  end: number;
  ext: string;
}

class SaveManager {
  private static instance: SaveManager;

  private isSaving = false;
  private chapters: string[] = [];
  private lastRequestUrl = '';
  private curPageUrl = '';
  private site: SiteConfig | null = null;
  private httpRequest: HttpRequest | null = null;
  private iframeRequest: IframeRequest | null = null;
  private fileName: FileNameInfo = { bookTitle: '', start: 0, end: 0, ext: '.txt' };

  static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  isSavingInProgress(): boolean {
    return this.isSaving;
  }

  async saveAsTxt(options: SaveOptions): Promise<void> {
    const { site, parsers, curPageUrl } = options;
    if (!site) {
      C.error('SaveManager: site is not ready, skip saving.');
      return;
    }

    if (!parsers || !parsers.length) {
      C.warn('SaveManager: no parsed chapters to save.');
      return;
    }

    if (this.isSaving) {
      alert('正在保存中，请稍后');
      return;
    }

    this.isSaving = true;
    this.resetState(site, curPageUrl || window.location.href);

    try {
      this.prepareFileName(parsers[0]);
      parsers.forEach(parser => {
        this.addChapter(parser);
      });

      const lastParser = parsers[parsers.length - 1];
      await this.getOnePage(null, lastParser.nextUrl);
    } finally {
      this.isSaving = false;
    }
  }

  private resetState(site: SiteConfig, curPageUrl: string): void {
    this.site = site;
    this.curPageUrl = curPageUrl;
    this.lastRequestUrl = '';
    this.chapters = [];
    this.fileName = { bookTitle: '', start: 0, end: 0, ext: '.txt' };
    this.httpRequest = new HttpRequest(site);
    this.iframeRequest = new IframeRequest(site);
  }

  private prepareFileName(parser: ParserInstance): void {
    this.fileName.bookTitle = parser.bookTitle || '未知名称';
    this.setStart(parser.chapterTitle);
    this.setEnd(parser.chapterTitle);
  }

  private setStart(chapterTitle: string): void {
    const start = this.extractChapterNumber(chapterTitle);
    if (start) {
      this.fileName.start = start;
    }
  }

  private setEnd(chapterTitle: string): void {
    const end = this.extractChapterNumber(chapterTitle);
    if (end) {
      this.fileName.end = end;
    }
  }

  private extractChapterNumber(chapterTitle: string): number {
    return getNumFromChapterTitle(chapterTitle) || 0;
  }

  private addChapter(parser: ParserInstance): void {
    const html = this.renderChapter(parser);
    this.chapters.push(html);
    const message = `已下载 ${this.chapters.length} 章，${parser.chapterTitle || ''}`;
    loading(message, 0);
    this.setEnd(parser.chapterTitle);
  }

  private renderChapter(parser: ParserInstance): string {
    const nano = ($ as JQueryStatic & { nano?: (_tpl: string, _data: unknown) => string }).nano;
    if (typeof nano === 'function') {
      return nano('{chapterTitle}\n\n{contentTxt}', parser);
    }
    return `${parser.chapterTitle}\n\n${parser.contentTxt}`;
  }

  private async getOnePage(parser: ParserInstance | null, nextUrl?: string | null): Promise<void> {
    let currentNextUrl = nextUrl ?? '';
    let isEnd = false;

    if (parser && parser.content) {
      this.addChapter(parser);
      currentNextUrl = parser.nextUrl;
      isEnd = !!parser.isTheEnd;
    }

    if (!currentNextUrl || isEnd) {
      C.log('全部获取完毕');
      this.finish(parser ?? undefined);
      return;
    }

    await sleep(config.download_delay);
    await this.getNextPage(currentNextUrl);
  }

  private async getNextPage(nextUrl: string): Promise<void> {
    if (!this.site) {
      C.error('SaveManager: site is not available when fetching next page.');
      return;
    }

    C.log('[存为txt]正在获取：', nextUrl);

    const referer = this.lastRequestUrl || this.curPageUrl || window.location.href;
    this.lastRequestUrl = nextUrl;

    const request = this.getRequest();
    if (!request) {
      C.error('SaveManager: request is not initialized.');
      this.finish();
      return;
    }

    const doc = this.site.withReferer
      ? await (request as HttpRequest).send(nextUrl, referer)
      : await request.send(nextUrl);

    if (doc) {
      const parser = new Parser(this.site, doc, nextUrl);
      const parserResult = (await parser.getAll()) as ParserInstance;
      await this.getOnePage(parserResult);
    } else {
      C.error('超时或连接出错');
      this.finish();
    }
  }

  private getRequest(): RequestLike | null {
    if (!this.site) {
      return null;
    }
    return this.site.useiframe ? this.iframeRequest : this.httpRequest;
  }

  private finish(parser?: ParserInstance): void {
    if (parser) {
      this.setEnd(parser.chapterTitle);
    }

    let allTxt = this.chapters.join('\n\n');
    if (isWindows) {
      allTxt = allTxt.replace(/\n/g, '\r\n');
    }

    const filename = this.buildFileName();
    saveAs(allTxt, filename);
  }

  private buildFileName(): string {
    const start = this.fileName.start || '';
    const end = this.fileName.end || '';
    const count = this.chapters.length;
    const bookTitle = this.fileName.bookTitle || '未知名称';

    return `${bookTitle}(${start} - ${end},共${count}章)${this.fileName.ext}`;
  }
}

const saveManager = SaveManager.getInstance();

export { SaveManager };
export default saveManager;
