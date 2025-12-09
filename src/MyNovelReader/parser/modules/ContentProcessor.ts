import type { IParser } from '../types';
import type { SiteConfig } from '../../../typings/MyNovelReader';
import type { UnderscoreStatic } from 'underscore';
import type TextReplacer from './TextReplacer';
import Setting from '../../Setting';
import config from '../../config';
import Rule from '../../rule';
import { C, getTextNodesIn, toRE, toReStr, unwrapTag } from '../../lib';
import { getNormalizeMap, toCDB, toDBC } from '../../rule/replaceNormalize';
import { chineseConversion } from '../../cnConv';
import { cleanHTML, renderHTML } from '../../libdom';
import {
  normalizeContent as normalizeContentUtil,
  removeDump as removeDumpUtil,
  splitContent,
} from './ParserUtils';

declare const _: UnderscoreStatic;

type ParserContext = IParser & {
  textReplacer: TextReplacer;
  hasContent: () => boolean;
};

export default class ContentProcessor {
  private parser: ParserContext;

  constructor(parser: ParserContext) {
    this.parser = parser;
  }

  getContent(parser?: ParserContext) {
    if (parser) {
      this.parser = parser;
    }

    this.parser.hasContent();

    if (!this.parser.$content || this.parser.$content.size() <= 0) {
      C.error('没有找到内容', this.parser.$doc);
      return;
    }

    const handleContentText = this.parser.info.handleContentText;
    if (_.isFunction(handleContentText)) {
      try {
        this.parser.content = handleContentText.call(
          this.parser,
          this.parser.$content[0],
          this.parser.info
        );
      } catch (e) {
        this.parser.content = this.handleContentText2(this.parser.$content[0], this.parser.info);
        C.error('执行内容处理函数规则出错，使用默认函数处理', e);
      }
    } else {
      this.parser.content = this.handleContentText2(this.parser.$content[0], this.parser.info);
    }

    return this.parser.content;
  }

  handleContentText(node: HTMLElement | null, info: Partial<SiteConfig>): string {
    if (!node) return '';

    const siteInfo = info || this.parser.info;

    if (siteInfo.useRawContent) {
      C.log('内容处理已被自定义站点规则 useRawContent 关闭');
      return node.outerHTML;
    }

    C.group('开始内容处理');
    C.time('内容处理');

    const contentHandle =
      typeof siteInfo.contentHandle == 'undefined' ? true : siteInfo.contentHandle;

    const $div = $(node.cloneNode(true));

    const treeWalker = document.createTreeWalker($div[0], NodeFilter.SHOW_COMMENT);

    const comments: Node[] = [];
    while (treeWalker.nextNode()) {
      const currentNode = treeWalker.currentNode;
      if (currentNode) {
        comments.push(currentNode);
      }
    }
    comments.forEach(node => node.parentNode?.removeChild(node));

    $div.find('h1, h2, h3').remove();

    const styledTags = ['i', 'b', 'em', 'strong'];
    styledTags.forEach(name => unwrapTag($div[0] as unknown as Document, name));

    $div.find(Rule.contentRemove).remove();
    if (siteInfo.contentRemove) {
      $div.find(siteInfo.contentRemove).remove();
    }

    const $contents = $div.children();
    if ($contents.length === 1) {
      $contents.children().unwrap();
    }

    this.clearContent($div[0], siteInfo);

    $div
      .find('p, h1, div')
      .filter(function () {
        const $this = $(this);
        if ($this.find('img').size()) return false;

        const hasContent =
          $this.contents().filter(function () {
            return this.nodeType != 8 && !(this.textContent || '').match(/^\s*$/);
          }).length > 0;

        return !hasContent;
      })
      .remove();

    if (Setting.split_content) {
      const $p = $div.find('p');
      let $newP;
      if ($p.length == 0) {
        $newP = $div;
      } else if ($p.length == 1) {
        $newP = $p;
      }

      if ($newP) {
        $newP.replaceWith('<p>' + splitContent($newP.html()).join('</p>\n<p>') + '</p>');
      }
    }

    if (contentHandle) {
      $div.find('*').removeAttr('style');
    }

    let text = $div.html();

    text = text.replace(/(?:\s|&nbsp;)+<p>/, '<p>');
    text = text.replace(/<\/p><p>([。])/, '$1');

    if (config.paragraphBlank) {
      text = text.replace(/<p[^>]*>(?:\s|&nbsp;)*/g, '<p>　　');
    }

    text = text.replace(Rule.removeLineRegExp, '');

    C.timeEnd('内容处理');
    C.groupEnd();

    return text;
  }

  clearContent(dom: Node | null, info: Partial<SiteConfig>) {
    if (!dom) return;

    const siteInfo = info || this.parser.info;

    let elements: Node[] = [];
    let brCount = 0;
    $(dom)
      .contents()
      .each(function (_index, element) {
        if (element.nodeName === 'BR') {
          brCount++;
          $(element).remove();
        } else {
          elements.push(element);
        }
        if (brCount === 2) {
          brCount = 0;
          $(elements).wrapAll('<p>');
          elements = [];
        }
      });

    const textNodes = getTextNodesIn(dom, true).filter(node => {
      if (
        node.previousSibling &&
        (node.previousSibling.nodeName === 'IMG' || node.previousSibling.nodeName === 'SPAN')
      ) {
        return false;
      }
      if (
        node.nextSibling &&
        (node.nextSibling.nodeName === 'IMG' || node.nextSibling.nodeName === 'SPAN')
      ) {
        return false;
      }
      if (node.data === '\n') {
        return false;
      }
      return true;
    });

    const contents = textNodes.map(node => node.data.trim().replace(/\s+/g, ' '));
    const deDupeConetents = [...new Set(contents)];

    let content;

    const dupeRate = (contents.length - deDupeConetents.length) / contents.length;
    if (dupeRate > 0.1) {
      content = deDupeConetents.join('\n');
      C.log(`去除了 ${contents.length - deDupeConetents.length} 段重复内容`);
    } else {
      content = contents.join('\n');
    }

    const contentHandle =
      typeof siteInfo.contentHandle == 'undefined' ? true : siteInfo.contentHandle;

    C.log(`本章字数：${content.length}`);

    if (this.parser.chapterTitle) {
      try {
        const reg = toReStr(this.parser.chapterTitle.trim()).replace(/\s+/g, '\\s*');
        content = content.replace(toRE(`^${reg}$`), '');
        C.log('去除内容中的标题', reg);
      } catch (e) {
        C.error(e);
      }
    }

    if (contentHandle) {
      content = this.parser.textReplacer.replaceText(content, Rule.replace);
    }

    const removeText: string[] = [];
    const hostRe = toRE(`^.*?${this.parser._curPageHost}.*?$`);
    content = content.replace(hostRe, match => {
      removeText.push(match);
      return '';
    });
    C.log(`删除含网站域名行`, hostRe, removeText);

    if (siteInfo.contentReplace) {
      content = this.parser.textReplacer.replaceText(content, siteInfo.contentReplace);
    }

    content = this.parser.textReplacer.replaceText(content, Rule.replaceAll);

    if (Setting.contentNormalize) {
      content = this.parser.textReplacer.replaceText(content, getNormalizeMap());
      content = toCDB(content);
    }

    content = chineseConversion(content);

    try {
      content = this.parser.textReplacer.contentCustomReplace(content);
    } catch (ex) {
      C.error('自定义替换错误', ex);
    }

    const finalContents = content.split('\n');

    if (finalContents.length <= textNodes.length) {
      textNodes.forEach((node, index) => {
        if (!finalContents[index]) {
          node.data = '';
        } else if (node.data.trim() !== finalContents[index]) {
          node.data = finalContents[index];
        }
      });
    } else if (textNodes.length) {
      const centerTextNode = textNodes[Math.floor(textNodes.length / 2)];
      if (!centerTextNode || !centerTextNode.parentNode) {
        return;
      }

      const parentNode = $(centerTextNode.parentNode as HTMLElement).closest('div');
      const nodeAncestors = $(centerTextNode).parents().slice(1);
      let appended = false;
      finalContents.forEach((text, index) => {
        const currentNode = textNodes[index];
        if (!currentNode) {
          $('<p>').text(text).appendTo(parentNode);
          return;
        }

        if (currentNode.data.trim() === text) {
          return;
        }

        const textNodeAncestors = $(currentNode).parents().slice(1);
        if (
          !appended &&
          nodeAncestors.not(textNodeAncestors).length === 0 &&
          currentNode.parentNode?.nodeName === 'P'
        ) {
          currentNode.data = text;
        } else {
          appended = true;
          currentNode.parentNode?.removeChild(currentNode);
          $('<p>').text(text).appendTo(parentNode);
        }
      });
    }
  }

  handleContentText2(node: HTMLElement | null, info: Partial<SiteConfig>): string {
    if (!node) return '';

    const siteInfo = info || this.parser.info;

    if (siteInfo.useRawContent) {
      C.log('内容处理已被自定义站点规则 useRawContent 关闭');
      return node.outerHTML;
    }

    C.group('开始内容处理');
    C.time('内容处理');

    const $div = $(node.cloneNode(true));

    $div.find('h1, h2, h3').remove();

    $div.find(Rule.contentRemove).remove();
    if (siteInfo.contentRemove) {
      $div.find(siteInfo.contentRemove).remove();
    }

    let content = cleanHTML($div[0] as unknown as Document);

    C.groupCollapsed('文本内容');
    C.log(content);
    C.groupEnd();

    const contents = content.split('\n');
    const deDupeConetents = [...new Set(contents)];

    const dupeRate = (contents.length - deDupeConetents.length) / contents.length;
    if (dupeRate > 0.1) {
      content = deDupeConetents.join('\n');
      C.log(`去除了 ${contents.length - deDupeConetents.length} 段重复内容`);
    }

    const contentHandle =
      typeof siteInfo.contentHandle == 'undefined' ? true : siteInfo.contentHandle;

    C.log(`本章字数：${content.length}`);

    if (this.parser.originChapterTitle) {
      try {
        let reg = toReStr(this.parser.originChapterTitle.trim()).replace(/\s+/g, '\\s*');
        reg = '(' + this.parser.bookTitle.trim() + '\\s*)*' + '\\s*' + '(' + reg + ')*';
        content = content.replace(toRE(`^${reg}$`), '');
        C.log('去除内容中的标题', reg);
      } catch (e) {
        C.error(e);
      }
    }

    if (contentHandle) {
      content = this.parser.textReplacer.replaceText(content, Rule.replace);
    }

    if (Setting.removeDomainLine) {
      const removeText: string[] = [];
      const hostRe = toRE(`^.*?${this.parser._curPageHost}.*?$`);
      content = content.replace(hostRe, match => {
        removeText.push(match);
        return '';
      });
      C.log(`删除含网站域名行`, hostRe, removeText);
    }

    if (siteInfo.contentReplace) {
      content = this.parser.textReplacer.replaceText(content, siteInfo.contentReplace);
    }

    content = this.parser.textReplacer.replaceText(content, Rule.replaceAll);

    content = chineseConversion(content);

    try {
      content = this.parser.textReplacer.contentCustomReplace(content);
    } catch (ex) {
      C.error('自定义替换错误', ex);
    }

    if (Setting.contentNormalize) {
      content = toDBC(toCDB(content));
      content = this.parser.textReplacer.replaceText(content, getNormalizeMap());
    }

    const contentHTML = renderHTML(content);

    C.timeEnd('内容处理');
    C.groupEnd();

    return contentHTML;
  }

  normalizeContent(html: string): string {
    return normalizeContentUtil(html);
  }

  removeDump(html: string): string {
    return removeDumpUtil(html);
  }
}
