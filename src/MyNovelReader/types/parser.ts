/** Parser related type definitions. */
import type { ReplaceMap, SiteConfig } from './rule';

/**
 * Replacement rule accepted by Parser.replaceText and SiteConfig.contentReplace.
 * It mirrors the legacy rule shape but keeps explicit, typed entries only.
 */
export type ReplacementRule = string | RegExp | ReplaceMap | Array<string | RegExp | ReplaceMap>;

/**
 * Parsed result of a single page. Matches the public surface of `Parser`.
 */
export interface IParser {
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
  originChapterTitle?: string;
  docTitle: string;
  indexUrl: string;
  prevUrl: string;
  nextUrl: string;
  theEndColor?: string;
  /** Text-only version of the parsed HTML content. */
  readonly contentTxt: string;
}

/** Asynchronous result returned by Parser.getAll(). */
export type ParserResult = Promise<IParser>;
