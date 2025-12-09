import type { IParser } from '../types';
import type { UnderscoreStatic } from 'underscore';
import type TextReplacer from './TextReplacer';
import autoGetBookTitle from '../autoGetBookTitle';
import Rule from '../../rule';
import { executeSelector, parseSelector } from '../../rule/selector';
import { C, toRE } from '../../lib';
import { chineseConversion } from '../../cnConv';
import { getElemFontSize } from './ParserUtils';

declare const _: UnderscoreStatic;

type ParserContext = IParser & { textReplacer: TextReplacer };

export default class TitleParser {
  private parser: ParserContext;

  constructor(parser: ParserContext) {
    this.parser = parser;
  }

  getTitles(parser?: ParserContext) {
    if (parser) {
      this.parser = parser;
    }

    const info = this.parser.info;
    let chapterTitle;
    let bookTitle;
    let docTitle = this.parser.$doc.find('title').text();

    if (info.titleReg) {
      const matches = docTitle.match(toRE(info.titleReg, 'i'));
      if (matches && matches.length >= 2) {
        const titlePos = (info.titlePos || 0) + 1;
        const chapterPos = titlePos == 1 ? 2 : 1;

        bookTitle = matches[titlePos];
        chapterTitle = matches[chapterPos];
      }

      C.log('TitleReg:', info.titleReg, matches);
    }

    const tmpChapterTitle = this.getTitleFromRule(info.titleSelector);
    if (tmpChapterTitle) {
      chapterTitle = tmpChapterTitle;
    }

    if (!chapterTitle) {
      chapterTitle = this.autoGetChapterTitle(this.parser.doc);
    }
    if (info.chapterTitleReplace) {
      chapterTitle = chapterTitle.replace(toRE(info.chapterTitleReplace), '');
    }

    if (!bookTitle && info.bookTitleSelector) {
      bookTitle = this.getTitleFromRule(info.bookTitleSelector);
    }
    if (!bookTitle) {
      bookTitle = autoGetBookTitle(this.parser.$doc);
      bookTitle = this.parser.textReplacer.replaceText(bookTitle, Rule.bookTitleReplace);
    }
    if (info.bookTitleReplace) {
      bookTitle = this.parser.textReplacer.replaceText(bookTitle, info.bookTitleReplace);
    }

    chapterTitle = chapterTitle.replace(Rule.titleReplace, '').trim();

    if (chapterTitle.startsWith(bookTitle)) {
      const _chapterTitle = chapterTitle.replace(bookTitle, '').trim();
      if (_chapterTitle.length > 0) {
        chapterTitle = _chapterTitle;
      }
    }

    bookTitle = bookTitle.replace(/(?:最新章节|章节目录)$/, '');

    docTitle = bookTitle ? bookTitle + ' - ' + chapterTitle : docTitle;

    this.parser.originChapterTitle = chapterTitle;

    bookTitle = chineseConversion(bookTitle);
    chapterTitle = chineseConversion(chapterTitle);
    docTitle = chineseConversion(docTitle);

    this.parser.bookTitle = (bookTitle || '目录').trim();
    this.parser.chapterTitle = chapterTitle;
    this.parser.docTitle = docTitle;

    C.log('Book Title: ' + this.parser.bookTitle);
    C.log('Chapter Title: ' + this.parser.chapterTitle);
    C.log('Document Title: ' + this.parser.docTitle);
  }

  getTitleFromRule(selectorOrArray) {
    if (!selectorOrArray) {
      return '';
    }

    const parsedSelector = parseSelector<string | JQuery<HTMLElement>>(selectorOrArray);
    if (!parsedSelector) {
      return '';
    }

    let result: string | JQuery<HTMLElement> | null;

    if (parsedSelector.type === 'function') {
      try {
        result = executeSelector<string | JQuery<HTMLElement>>(parsedSelector, this.parser.$doc);
      } catch (e) {
        C.error('执行获取标题函数规则出错', e);
        return '';
      }
    } else {
      result = executeSelector(parsedSelector, this.parser.$doc) as JQuery<HTMLElement> | null;
    }

    if (!result || (typeof result !== 'string' && result.length === 0)) {
      C.error('无法找到标题', selectorOrArray, this.parser.doc);
      return '';
    }

    let title =
      typeof result === 'string' ? result : (result as JQuery<HTMLElement>).first().text().trim();

    if (parsedSelector.replace) {
      title = title.replace(toRE(parsedSelector.replace), '');
    }

    return title;
  }

  autoGetChapterTitle(currentDocument: Document) {
    const mainSelector = 'h1, h2, h3';
    const secondSelector = '#TextTitle, #title, .ChapterName, #lbChapterName, div.h1, #nr_title';
    const positiveRegexp = Rule.titleRegExp;
    const titleRemoveRegexp = /最新章节|书书网/;
    const $doc = $(currentDocument);
    const documentTitle = currentDocument.title || $doc.find('title').text();
    const searchDocumentTitle = ` ${documentTitle.replace(/\s+/gi, ' ')} `;
    const headings = $doc.find(mainSelector).toArray() as HTMLElement[];

    $doc.find(secondSelector).each(function () {
      const current = this as HTMLElement;
      if ($(current).find(mainSelector).length === 0) {
        headings.push(current);
      }
    });

    const possibleTitles: Record<string, number> = {};

    C.groupCollapsed('自动查找章节标题');

    $(headings).each(function () {
      const heading = this as HTMLElement;
      const headingText = heading.textContent?.trim() ?? '';

      if (!headingText || headingText in possibleTitles) {
        return;
      }

      C.group(`开始计算 "${headingText}" 的得分`);

      const nodeNum = parseInt(heading.nodeName.slice(1), 10) || 10;
      let score = 10 / nodeNum;
      const headingWords = headingText.replace(/\s+/g, ' ').split(' ');
      let matchedWords = '';
      C.log('初始得分：' + score);

      if (positiveRegexp.test(headingText) || /\d{2,4}/.test(headingText)) {
        score += 50;
      }

      C.log('符合正则计算后得分：' + score);

      for (let j = 0; j < headingWords.length; j += 1) {
        if (searchDocumentTitle.indexOf(headingWords[j]) > -1) {
          matchedWords += headingWords[j] + ' ';
        }
      }
      score += matchedWords.length * 1.5;

      C.log('跟页面标题比较后得分：' + score);

      const fontSizeAddScore = getElemFontSize(heading) * 1.5;
      score += fontSizeAddScore;

      C.log('计算大小后得分：' + score);

      possibleTitles[headingText] = score;

      C.groupEnd();
    });

    let topScoreTitle: string | undefined;
    let scoreTmp = 0;
    Object.keys(possibleTitles).forEach(headingText => {
      if (possibleTitles[headingText] > scoreTmp) {
        topScoreTitle = headingText;
        scoreTmp = possibleTitles[headingText];
      }
    });

    let curTitle = topScoreTitle;
    if (!curTitle) {
      curTitle = documentTitle;

      curTitle = curTitle.replace(/\s-\s.*/i, '').replace(/_[^][\u3010\u3011]+$/, '');
      curTitle = curTitle.trim();
      curTitle = curTitle.replace(titleRemoveRegexp, '');
    }

    curTitle = curTitle.replace(Rule.titleReplace, '');

    C.groupEnd();

    return curTitle;
  }
}
