import type { ReplacementRule } from '../types';
import type { ReplaceMap } from '../../types/rule';
import {
  contentCustomReplace as baseContentCustomReplace,
  contentReplacements as baseContentReplacements,
  convert2tw as baseConvert2tw,
  replaceHtml as baseReplaceHtml,
  replaceText as baseReplaceText,
} from './ParserUtils';

export default class TextReplacer {
  replaceHtml(text: string, replaceRule?: ReplacementRule): string {
    return baseReplaceHtml(text, replaceRule);
  }

  replaceText(text: string, rule: ReplacementRule): string {
    return baseReplaceText(text, rule);
  }

  contentReplacements(text: string, rule: ReplaceMap): string {
    return baseContentReplacements(text, rule);
  }

  contentCustomReplace(text: string): string {
    return baseContentCustomReplace(text);
  }

  convert2tw(text: string | null | undefined): string | null | undefined {
    return baseConvert2tw(text);
  }
}
