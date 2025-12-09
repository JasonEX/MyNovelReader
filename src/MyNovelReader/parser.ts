/* eslint-disable no-irregular-whitespace */
import type { IParser, SiteConfig } from '../typings/MyNovelReader';
import { C, getUrlHost } from './lib';
import Rule from './rule';
import ContentProcessor from './parser/modules/ContentProcessor';
import LinkExtractor from './parser/modules/LinkExtractor';
import TextReplacer from './parser/modules/TextReplacer';
import TitleParser from './parser/modules/TitleParser';

class Parser implements IParser {
  info: Partial<SiteConfig>;
  doc: Document;
  $doc: JQuery<Document>;
  curPageUrl: string;
  _curPageHost: string;
  isTheEnd: boolean | 'vip';
  isSection: boolean;
  $content?: JQuery<HTMLElement>;
  content: string;
  bookTitle: string;
  chapterTitle: string;
  docTitle: string;
  originChapterTitle?: string;
  indexUrl: string;
  prevUrl: string;
  nextUrl: string;
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
    // callback 才有用
    var text = $('<div>').html(this.content).text().trimRight();

    // 解决第二个段落和第一个锻炼合在一起的问题
    text = text.replace(/([^\n])　　/, '$1\n　　');

    return text;
  }

  init(info, doc, curPageUrl) {
    // 站点规则
    this.info = info || {};
    this.doc = info.cloneNode && doc.defaultView ? doc.cloneNode(true) : doc;
    this.$doc = $(this.doc);
    this.curPageUrl = curPageUrl || doc.URL;
    this._curPageHost = getUrlHost(this.curPageUrl); // 当前页的 host，后面用到

    // 设置初始值
    this.isTheEnd = false;
    this.isSection = false;

    if (doc.defaultView && doc.defaultView.$cleanupEvents) {
      doc.defaultView.$cleanupEvents(true);
    }
  }
  applyPatch() {
    var contentPatch = this.info.contentPatch;
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
    var contentPatch = this.info.contentPatchAsync;
    if (contentPatch) {
      try {
        await contentPatch.call(this, this.$doc);
        C.log('Apply Content Patch[Async] Success.');
      } catch (e) {
        C.log('Error: Content Patch[Async] Error!', e);
      }
    }
  }
  async getAll() {
    C.log('开始解析页面');

    this.applyPatch();

    await this.applyAsyncPatch();

    await this.preProcessDoc();

    this.parse();

    return this;
  }
  async preProcessDoc() {
    let data;

    if (!this.hasContent() && this.info.getContent) {
      C.log('开始 info.getContent');
      data = await this.info.getContent.call(this, this.$doc);
      this.$content = undefined;
    } /* else {
            // 特殊处理，例如起点
            var ajaxScript = this.$doc.find('.' + READER_AJAX);
            if (ajaxScript.length > 0) {
                var url = ajaxScript.attr('src');
                if(!url) return;
                var charset = ajaxScript.attr('charset') || 'utf-8';

                C.log('Ajax 获取内容: ', url, ". charset=" + charset);

                var reqObj = {
                    url: url,
                    method: "GET",
                    overrideMimeType: "text/html;charset=" + charset,
                    headers: {},
                };

                // Jixun: Allow post data
                var postData = ajaxScript.data('post');

                if (postData) {
                    reqObj.method = 'POST';
                    reqObj.data = $.param(postData);
                    reqObj.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }

                let res = await Request(reqObj)
                var text = res.responseText;
                text = text.replace(/document.write(ln)?\('/, "")
                        .replace("');", "")
                        .replace(/[\n\r]+/g, '</p><p>');

                data = { content: text }

            }
        } */
    if (data) {
      var div;
      if (data.content) {
        div = $('<div id="content"></div>').html(data.content);
      } else if (data.html) {
        div = $('<div></div>').html(data.html);
      }

      this.$doc.find('body').prepend(div);
    }
  }
  parse() {
    C.group('开始获取链接');
    this.getPrevUrl();
    this.getIndexUrl();
    this.getNextUrl();
    C.groupEnd();

    C.group('开始获取标题');
    this.titleParser.getTitles();
    C.groupEnd();

    this.getContent();
  }

  hasContent() {
    if (this.$content) {
      return this.$content.size() > 0;
    }

    var $content;

    // var $ajaxScript = this.$doc.find('.' + READER_AJAX);
    // if ($ajaxScript.length > 0) {
    //     return true;
    // }

    // 排除 qidian 需付费的页面
    if (this.info.isVipChapter) {
      if (this.info.isVipChapter(this.$doc)) {
        this.isTheEnd = 'vip';
        return false;
      }
    }

    var contentSelector = this.info.contentSelector;
    if (contentSelector) {
      var resolvedSelector =
        typeof contentSelector === 'function' ? contentSelector(this.$doc) : contentSelector;
      if (typeof resolvedSelector === 'string') {
        $content = this.$doc.find(resolvedSelector);
      }
    }

    if (!$content || !$content.length) {
      // 按照顺序选取
      var selectors = Rule.contentSelectors;
      for (var i = 0, l = selectors.length; i < l; i++) {
        $content = this.$doc.find(selectors[i]);
        if ($content.length) {
          C.log('自动查找内容选择器: ' + selectors[i]);
          break;
        }
      }
    }

    this.$content = $content;
    // C.debug($content);

    return $content.size() > 0;
  }

  // 获取和处理内容
  getContent() {
    return this.contentProcessor.getContent();
  }
  handleContentText(node, info) {
    return this.contentProcessor.handleContentText(node, info);
  }
  clearContent(dom, info) {
    return this.contentProcessor.clearContent(dom, info);
  }
  handleContentText2(node, info) {
    return this.contentProcessor.handleContentText2(node, info);
  }

  getIndexUrl() {
    return this.linkExtractor.getIndexUrl();
  }
  getNextUrl() {
    return this.linkExtractor.getNextUrl();
  }
  // 获取上下页及目录页链接
  getPrevUrl() {
    return this.linkExtractor.getPrevUrl();
  }
  checkNextUrl(url) {
    return this.linkExtractor.checkNextUrl(url);
  }
  getIncludeUrl() {
    return this.linkExtractor.getIncludeUrl();
  }
  checkLinks(links?: JQuery<HTMLElement> | string | null) {
    return this.linkExtractor.checkLinks(links);
  }
  getLinkUrl(linkOrUrl) {
    // if (linkOrUrl && )
    return linkOrUrl;
  }
  getFullHref(href) {
    return this.linkExtractor.getFullHref(href);
  }
}

export default Parser;
