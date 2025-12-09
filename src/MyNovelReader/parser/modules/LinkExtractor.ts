import type { IParser } from '../types';
import type { UnderscoreStatic } from 'underscore';
import config from '../../config';
import Rule from '../../rule';
import { executeSelector, type LegacySelectorValue, parseSelector } from '../../rule/selector';
import { C, toRE, wildcardToRegExpStr } from '../../lib';

declare const _: UnderscoreStatic;

export default class LinkExtractor {
  private parser: IParser;
  private anchor?: HTMLAnchorElement;

  constructor(parser: IParser) {
    this.parser = parser;
  }

  extract(parser?: IParser): { prev: string; next: string; index: string } {
    if (parser) {
      this.parser = parser;
    }

    const prev = this.getPrevUrl();
    const index = this.getIndexUrl();
    const next = this.getNextUrl();

    return { prev, next, index };
  }

  getIndexUrl() {
    let url = '';
    const selector = this.parser.info.indexSelector ?? this.parser.info.indexUrl;

    if (selector === false) {
      this.parser.indexUrl = url;
      return url;
    }

    const indexLink = this.executeLinkSelector(selector, '执行获取目录链接函数规则出错') as
      | JQuery<HTMLElement>
      | string
      | null;

    url = this.checkLinks(indexLink as JQuery<HTMLElement>);

    if (!url) {
      const selectors = Rule.indexSelectors;
      for (let i = 0; i < selectors.length; i += 1) {
        const fallbackLink = this.parser.$doc.find(selectors[i]);
        if (fallbackLink.length > 0) {
          url = this.checkLinks(fallbackLink);
          break;
        }
      }
    }

    if (url) {
      C.log('找到目录链接: ' + url);
    } else {
      C.log('无法找到目录链接.');
    }

    this.parser.indexUrl = url;
    return url;
  }

  getNextUrl() {
    let url = '';
    const selector = this.parser.info.nextSelector || this.parser.info.nextUrl;
    const noSection = this.parser.info.noSection;

    if (selector === false) {
      this.parser.nextUrl = url;
      return url;
    }

    let urlElement: JQuery<HTMLElement> | undefined | string | null;
    let isSectionUrl = false;

    if (selector) {
      urlElement = this.executeLinkSelector(selector, '执行获取下一页链接函数规则出错');
      url = this.checkLinks(urlElement as JQuery<HTMLElement>);
    }

    if (!url) {
      urlElement = this.parser.$doc.find(Rule.nextSelector);
      url = this.checkLinks(urlElement as JQuery<HTMLElement>);
    }

    if (!noSection && url && urlElement && !_.isString(urlElement)) {
      const t = urlElement.text();
      if (!this.parser.isSection && (t.includes('页') || t.includes('頁'))) {
        isSectionUrl = true;
      }
    }

    if (url) {
      C.log('找到下一页链接: ' + url);
    } else {
      C.log('无法找到下一页链接');
    }

    this.parser.nextUrl = url || '';

    if (!isSectionUrl) {
      this.parser.isTheEnd = !this.checkNextUrl(url);
      if (this.parser.isTheEnd) {
        C.log('已到达最后一页');
        this.parser.theEndColor = config.end_color;
      }
    }

    return url;
  }

  getPrevUrl() {
    let url = '';
    const selector = this.parser.info.prevSelector || this.parser.info.prevUrl;
    const noSection = this.parser.info.noSection;

    if (selector === false) {
      this.parser.prevUrl = url;
      return url;
    }

    let urlElement: JQuery<HTMLElement> | undefined | string | null;

    if (selector) {
      urlElement = this.executeLinkSelector(selector, '执行获取上一页链接函数规则出错');
      url = this.checkLinks(urlElement as JQuery<HTMLElement>);
    }

    if (!url) {
      urlElement = this.parser.$doc.find(Rule.prevSelector);
      url = this.checkLinks(urlElement as JQuery<HTMLElement>);
    }

    if (!noSection && url && urlElement && !_.isString(urlElement)) {
      const t = urlElement.text();
      if (url && !this.parser.isSection && (t.includes('页') || t.includes('頁'))) {
        C.log('检测到多页章节链接，开启多页章节合并为一章模式');
        this.parser.isSection = true;
      }
    }

    if (url) {
      C.log('找到上一页链接: ' + url);
    } else {
      C.log('无法找到上一页链接');
    }

    this.parser.prevUrl = url || '';
    return url;
  }

  checkNextUrl(url?: string) {
    const sectionUrlRegex = /\/\d+([_-]\d+|\/\d)\.html?$/;
    if (url && this.parser.info.checkSection) {
      if (
        !sectionUrlRegex.test(this.parser.curPageUrl) &&
        !sectionUrlRegex.test(this.parser.prevUrl)
      ) {
        this.parser.isSection = false;
      } else if (sectionUrlRegex.test(this.parser.curPageUrl)) {
        this.parser.isSection = true;
      } else {
        this.parser.isSection = false;
      }
    }

    const includeUrl = this.parser.info.includeUrl || this.getIncludeUrl() || '';
    const normalizedUrl = url || '';
    if (!includeUrl || !toRE(includeUrl).test(normalizedUrl)) return false;

    switch (true) {
      case normalizedUrl === '':
        return false;
      case this.parser.info.exclude && toRE(this.parser.info.exclude).test(normalizedUrl):
        return false;
      case Rule.nextUrlIgnore.some(function (re) {
        return toRE(re).test(normalizedUrl);
      }):
        return false;
      case normalizedUrl === this.parser.indexUrl:
        return false;
      case normalizedUrl === this.parser.prevUrl:
        return false;
      case normalizedUrl === this.parser.curPageUrl:
        return false;
      case !this.parser.isSection &&
        this.parser.prevUrl !== this.parser.indexUrl &&
        Rule.nextUrlCompare.test(this.parser.prevUrl.split('?')[0]) &&
        !Rule.nextUrlCompare.test(normalizedUrl.split('?')[0]):
        return false;
      default:
        return true;
    }
  }

  getIncludeUrl() {
    let includeUrl = this.parser.info.url;

    if (!includeUrl && typeof GM_info !== 'undefined') {
      const locationHref = location.href;
      GM_info.script.includes.some(function (includeStr) {
        const iUrl = wildcardToRegExpStr(includeStr);
        if (toRE(iUrl).test(locationHref)) {
          includeUrl = iUrl;
          return true;
        }
      });
    }

    this.parser.info.includeUrl = includeUrl;
    return includeUrl;
  }

  private executeLinkSelector(
    selector: LegacySelectorValue<string | JQuery<HTMLElement> | undefined> | null | undefined,
    errorMessage: string
  ) {
    const parsed = parseSelector<string | JQuery<HTMLElement> | undefined>(selector);

    if (!parsed) {
      return null;
    }

    if (parsed.type === 'function') {
      try {
        return executeSelector(parsed, this.parser.$doc);
      } catch (e) {
        C.error(errorMessage, e);
        return null;
      }
    }

    return executeSelector(parsed, this.parser.$doc);
  }

  checkLinks(links?: JQuery<HTMLElement> | string | null) {
    let url = '';

    if (!links) return '';

    if (_.isString(links)) {
      return this.getFullHref(links);
    }

    links.each(function (this: Element) {
      const href = $(this).attr('href') || '';
      if (!href || href.indexOf('#') === 0 || href.indexOf('javascript:') === 0) return;

      url = href;
      return false;
    });

    return this.getFullHref(url);
  }

  getFullHref(href: string | HTMLElement) {
    if (!href) return '';

    let normalizedHref: string;

    if (!_.isString(href)) {
      normalizedHref = href.getAttribute('href') || '';
    } else {
      normalizedHref = href;
    }

    if (/^https?:\/\//.test(normalizedHref)) {
      return normalizedHref;
    }

    if (!this.anchor) {
      this.anchor = document.createElement('a');
    }
    this.anchor.href = normalizedHref.trim();

    return this.anchor.href;
  }
}
