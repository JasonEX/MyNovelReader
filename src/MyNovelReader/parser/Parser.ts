import type { IParser, ParserResult, ReplacementRule } from './types';
import type { SiteConfig } from '../types/rule';
import { C, getUrlHost } from '../lib';
import Rule from '../rule';
import { ContentProcessor, LinkExtractor, TextReplacer, TitleParser } from './modules';

export default class Parser implements IParser {
  info: Partial<SiteConfig> = {};
  doc!: Document;
  $doc!: JQuery<Document>;
  curPageUrl = '';
  _curPageHost = '';
  isTheEnd: boolean | 'vip' = false;
  isSection = false;
  $content?: JQuery<HTMLElement>;
  content = '';
  bookTitle = '';
  chapterTitle = '';
  originChapterTitle?: string;
  docTitle = '';
  indexUrl = '';
  prevUrl = '';
  nextUrl = '';
  theEndColor?: string;
  a?: HTMLAnchorElement;

  linkExtractor: LinkExtractor;
  textReplacer: TextReplacer;
  titleParser: TitleParser;
  contentProcessor: ContentProcessor;

  constructor(info?: Partial<SiteConfig>, doc?: Document, curPageUrl?: string) {
    this.textReplacer = new TextReplacer();
    this.init(info, doc, curPageUrl);
    this.linkExtractor = new LinkExtractor(this);
    this.titleParser = new TitleParser(this);
    this.contentProcessor = new ContentProcessor(this);
  }

  get contentTxt() {
    let text = $('<div>').html(this.content).text().trimRight();

    // 解决第二个段落和第一个锻炼合在一起的问题
    text = text.replace(/([^\n])\u3000\u3000/, '$1\n\u3000\u3000');

    return text;
  }

  init(info?: Partial<SiteConfig>, doc?: Document, curPageUrl?: string) {
    const currentDoc = doc ?? document;

    this.info = info || {};
    const clonedDoc =
      this.info.cloneNode && currentDoc.defaultView
        ? (currentDoc.cloneNode(true) as Document)
        : currentDoc;

    this.doc = clonedDoc;
    this.$doc = $(this.doc);
    this.curPageUrl = curPageUrl || currentDoc.URL || '';
    this._curPageHost = getUrlHost(this.curPageUrl);

    this.isTheEnd = false;
    this.isSection = false;

    const cleanupEvents = (
      currentDoc.defaultView as typeof window & {
        $cleanupEvents?: (removeListeners?: boolean) => void;
      }
    )?.$cleanupEvents;

    if (cleanupEvents) {
      cleanupEvents(true);
    }
  }

  applyPatch() {
    const contentPatch = this.info.contentPatch;
    if (contentPatch) {
      try {
        contentPatch.call(this, this.$doc);
        C.log('Apply Content Patch Success.');
      } catch (e) {
        C.log('Error: Content Patch Error!', e);
      }
    }
  }

  async applyAsyncPatch() {
    const contentPatch = this.info.contentPatchAsync;
    if (contentPatch) {
      try {
        await contentPatch.call(this, this.$doc);
        C.log('Apply Content Patch[Async] Success.');
      } catch (e) {
        C.log('Error: Content Patch[Async] Error!', e);
      }
    }
  }

  async getAll(): ParserResult {
    C.log('开始解析页面');

    this.applyPatch();
    await this.applyAsyncPatch();

    await this.preProcessDoc();

    this.parse();

    return this;
  }

  async preProcessDoc() {
    let data: { content?: string; html?: string } | undefined;

    if (!this.hasContent() && this.info.getContent) {
      C.log('开始 info.getContent');
      data = await this.info.getContent.call(this, this.$doc);
      this.$content = undefined;
    }

    if (data) {
      let div: JQuery<HTMLElement> | undefined;
      if (data.content) {
        div = $('<div id="content"></div>').html(data.content);
      } else if (data.html) {
        div = $('<div></div>').html(data.html);
      }

      if (div) {
        this.$doc.find('body').prepend(div);
      }
    }
  }

  parse(): IParser {
    C.group('开始获取链接');
    this.getPrevUrl();
    this.getIndexUrl();
    this.getNextUrl();
    C.groupEnd();

    C.group('开始获取标题');
    this.titleParser.getTitles();
    C.groupEnd();

    this.getContent();

    return this;
  }

  hasContent(): boolean {
    if (this.$content) {
      return this.$content.size() > 0;
    }

    let $content: JQuery<HTMLElement> | undefined;

    if (this.info.isVipChapter) {
      if (this.info.isVipChapter(this.$doc)) {
        this.isTheEnd = 'vip';
        return false;
      }
    }

    const contentSelector = this.info.contentSelector;
    if (contentSelector) {
      const resolvedSelector =
        typeof contentSelector === 'function' ? contentSelector(this.$doc) : contentSelector;
      if (typeof resolvedSelector === 'string') {
        $content = this.$doc.find(resolvedSelector);
      }
    }

    if (!$content || !$content.length) {
      const selectors = Rule.contentSelectors;
      for (let i = 0, l = selectors.length; i < l; i += 1) {
        $content = this.$doc.find(selectors[i]);
        if ($content.length) {
          C.log('自动查找内容选择器: ' + selectors[i]);
          break;
        }
      }
    }

    this.$content = $content;

    return !!($content && $content.size() > 0);
  }

  getContent() {
    return this.contentProcessor.getContent();
  }

  replaceHtml(text: string, replaceRule?: ReplacementRule) {
    return this.textReplacer.replaceHtml(text, replaceRule);
  }

  handleContentText(node: HTMLElement | null, info: Partial<SiteConfig>) {
    return this.contentProcessor.handleContentText(node, info);
  }

  clearContent(dom: Node | null, info: Partial<SiteConfig>) {
    return this.contentProcessor.clearContent(dom, info);
  }

  handleContentText2(node: HTMLElement | null, info: Partial<SiteConfig>) {
    return this.contentProcessor.handleContentText2(node, info);
  }

  getIndexUrl() {
    return this.linkExtractor.getIndexUrl();
  }

  getNextUrl() {
    return this.linkExtractor.getNextUrl();
  }

  getPrevUrl() {
    return this.linkExtractor.getPrevUrl();
  }

  checkNextUrl(url?: string) {
    return this.linkExtractor.checkNextUrl(url);
  }

  getIncludeUrl() {
    return this.linkExtractor.getIncludeUrl();
  }

  checkLinks(links?: JQuery<HTMLElement> | string | null) {
    return this.linkExtractor.checkLinks(links);
  }

  getLinkUrl(linkOrUrl: string) {
    return linkOrUrl;
  }

  getFullHref(href: string | HTMLElement) {
    return this.linkExtractor.getFullHref(href);
  }
}
