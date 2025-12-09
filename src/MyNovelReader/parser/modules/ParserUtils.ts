import config from '../../config';
import Rule, { CHAR_ALIAS } from '../../rule';
import { cn2twTable } from '../../cnConv/zhConversion';
import { toRE } from '../../lib';
import type { ReplacementRule } from '../types';
import type { ReplaceMap } from '../../types/rule';
import type { UnderscoreStatic } from 'underscore';

declare const _: UnderscoreStatic;

export function getElemFontSize(heading: Element | null): number {
  if (!heading) {
    return 0;
  }

  let fontSize = 0;
  const headingStyle = window.getComputedStyle(heading, null);
  if (headingStyle) {
    // firefox57 2017年9月10日 会错误
    try {
      const str = headingStyle.getPropertyValue('font-size') || '0';
      fontSize = parseInt(str, 10);
    } catch {
      // ignore font-size parse errors
    }
  }

  return fontSize;
}

export function normalizeContent(html: string): string {
  return html.replace(/<\/p><p>/g, '</p>\n<p>');
}

/**
 * 移除内容中大块的重复。
 * 例如：http://www.wangshuge.com/books/109/109265/28265316.html
 *
 * @param  {string} html 内容
 * @return {string}      处理后的内容
 */
export function removeDump(html: string): string {
  const normalized = normalizeContent(html);
  let newContent = normalized;

  const lines = normalized.split('\n');
  const firstLine = lines[0];
  // 有重复
  if (firstLine.length > 10) {
    // 因为 indexOf 只查找第一个
    const dumpIndex = lines.slice(1).indexOf(firstLine) + 1;
    if (dumpIndex >= config.dumpContentMinLength) {
      const firstPart = lines.slice(0, dumpIndex).join('\n');
      const restPart = lines
        .slice(dumpIndex)
        .join('\n')
        .replace(/^<\/p>\n/, '');
      if (restPart.startsWith(firstPart)) {
        newContent = restPart;
      }
    }
  }

  return newContent;
}

export function contentReplacements(text: string, rule: ReplaceMap): string {
  if (!text) return text;

  let replaced = text;
  Object.keys(rule).forEach(key => {
    replaced = replaced.replace(toRE(key, 'ig'), rule[key]);
  });
  return replaced;
}

export function replaceHtml(text: string, replaceRule?: ReplacementRule): string {
  // replaceRule 给“自定义替换规则直接生效”用
  const rule = replaceRule || (Rule.replace as ReplacementRule);

  // 先提取出 img
  const imgs: Record<string, string> = {};
  let i = 0;
  const textWithoutImgs = text.replace(/<(img|a)[^>]*>/g, function (img) {
    imgs[i] = img;
    return '{' + i++ + '}';
  });

  // 修正拼音字等
  const replaced = contentReplacements(textWithoutImgs, rule as ReplaceMap);

  // 还原图片
  return $.nano ? $.nano(replaced, imgs) : replaced;
}

export function replaceText(text: string, rule: ReplacementRule): string {
  if (!rule) return text;

  switch (true) {
    case _.isRegExp(rule):
      return text.replace(rule as RegExp, '');
    case _.isString(rule):
      _.each(CHAR_ALIAS, function (value, key) {
        rule = (rule as string).replace(key, value);
      });
      return text.replace(toRE(rule as string), '');
    case _.isArray(rule):
      (rule as Array<string | RegExp | ReplaceMap>).forEach(r => {
        text = replaceText(text, r as ReplacementRule);
      });
      return text;
    case _.isObject(rule):
      Object.keys(rule as ReplaceMap).forEach(key => {
        text = text.replace(toRE(key), (rule as ReplaceMap)[key]);
      });
      return text;
    default:
      return text;
  }
}

export function convert2tw(text: string | null | undefined) {
  if (!text) return text;

  const chars = text.split('');
  for (let i = 0; i < chars.length; i += 1) {
    chars[i] = cn2twTable[chars[i]] || chars[i];
  }

  return chars.join('');
}

export function contentCustomReplace(text: string): string {
  if (!text) return text;

  let replaced = text;
  for (const key in Rule.customReplace) {
    replaced = replaced.replace(toRE(key), Rule.customReplace[key]);
  }
  return replaced;
}

export function splitContent(text: string): string[] {
  // 有些章节整个都集中在一起，没有分段，这个函数用于简易分段
  if (text.indexOf('。') == -1) {
    return [text];
  }

  let hasMark = false;
  const lines: string[] = [];
  let charCotainer: string[] = [];

  text.split('').forEach(function (c) {
    charCotainer.push(c);

    if (c == '“') {
      hasMark = true;
    } else if (c == '”') {
      hasMark = false;
    } else if (c == '。' && !hasMark) {
      lines.push(charCotainer.join(''));
      charCotainer = [];
    }
  });

  return lines;
}
