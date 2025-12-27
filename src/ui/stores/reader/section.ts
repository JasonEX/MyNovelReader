/**
 * Reader Store Section Parsing
 * Handles section/page merging for multi-page chapters
 */

import { getParser, type ParsedChapter } from '@/core/parser';
import { getSectionBaseUrl, isSectionLikeUrl, joinHtml, normalizeAbsoluteUrl } from '@/core/utils';
import { fetchAndParseUrl } from '@/core/utils/network';
import type { SectionInfo } from './types';

/**
 * Parse a chapter with section merging support
 * Handles multi-page chapters by fetching and merging all sections
 */
export async function parseWithSectionMerge(
  parser: ReturnType<typeof getParser>,
  initialDoc: Document,
  url: string,
  referer?: string
): Promise<ParsedChapter | null> {
  const resolvedUrl = normalizeAbsoluteUrl(url, referer);

  // If user opens a later section page, normalize to the first page for stable TOC matching.
  const baseUrl = getSectionBaseUrl(resolvedUrl);
  let startUrl = resolvedUrl;
  let startDoc = initialDoc;
  if (baseUrl && baseUrl !== resolvedUrl) {
    const { promise } = fetchAndParseUrl(baseUrl, referer || resolvedUrl);
    const result = await promise;
    if (result.doc) {
      startUrl = baseUrl;
      startDoc = result.doc;
    }
  }

  const first = await parser.parse(startDoc, startUrl);
  if (!first) return null;

  // Decide whether to attempt section merging: rule says so OR detection says current/next is section-like.
  // If rule explicitly sets noSection: true, skip all section merging (both rule-based and auto-detected).
  const disableByRule = !!first.rule?.advanced?.noSection;
  if (disableByRule) return first;

  const enableByRule = !!first.rule?.advanced?.checkSection;
  const detection = parser.detect(startDoc, startUrl);
  const section: SectionInfo = {
    isSection: !!detection.results.section?.isSection,
    nextSectionUrl: detection.results.section?.nextSectionUrl || null,
    nextChapterUrl: detection.results.section?.nextChapterUrl || null,
    confidence: detection.results.section?.confidence || 0,
  };

  const shouldMerge = enableByRule || (section.isSection && section.confidence >= 0.8);
  if (!shouldMerge) return first;

  let mergedContent = first.content;
  let mergedRaw = first.rawContent;
  let nextSectionUrl = section.nextSectionUrl;
  let nextChapterUrl = section.nextChapterUrl || null;
  let lastUrl = startUrl;

  // When rule enables checkSection but auto-detection didn't find nextSectionUrl,
  // check if first.nextUrl is a section URL (e.g., /123_2.html pattern).
  // This handles cases where rule selector picks "下一页" but auto-detection picks "下一章".
  if (enableByRule && !nextSectionUrl && first.nextUrl) {
    const isSectionUrl = isSectionLikeUrl(startUrl, first.nextUrl);
    if (isSectionUrl) {
      nextSectionUrl = first.nextUrl;
    }
  }

  // Best-effort: merge up to 10 pages (including the first page) to avoid infinite loops.
  const maxPages = 10;
  const maxAdditionalPages = Math.max(0, maxPages - 1);

  const seen = new Set<string>([startUrl]);
  for (let i = 0; i < maxAdditionalPages && nextSectionUrl; i++) {
    const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
    if (seen.has(absNextSection)) break;
    seen.add(absNextSection);

    const { promise } = fetchAndParseUrl(absNextSection, lastUrl);
    const nextResult = await promise;
    if (!nextResult.doc) break;

    const nextParsed = await parser.parse(nextResult.doc, absNextSection);
    if (!nextParsed) break;

    mergedContent = joinHtml(mergedContent, nextParsed.content);
    mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);

    const nextDet = parser.detect(nextResult.doc, absNextSection);
    const s = nextDet.results.section;
    if (s?.nextChapterUrl) nextChapterUrl = s.nextChapterUrl;

    // Prefer auto-detected nextSectionUrl, but fall back to rule-parsed nextUrl if it looks like a section
    nextSectionUrl = s?.nextSectionUrl || null;
    if (enableByRule && !nextSectionUrl && nextParsed.nextUrl) {
      if (isSectionLikeUrl(absNextSection, nextParsed.nextUrl)) {
        nextSectionUrl = nextParsed.nextUrl;
      } else {
        // nextParsed.nextUrl is not a section URL, treat it as next chapter
        if (!nextChapterUrl) nextChapterUrl = nextParsed.nextUrl;
      }
    }
    lastUrl = absNextSection;
  }

  // After merging, nextUrl should point to next *chapter*, not the next page.
  // Keep other fields from the first page (title/book/index/prev).
  return {
    ...first,
    url: startUrl,
    content: mergedContent,
    rawContent: mergedRaw,
    nextUrl: nextChapterUrl || first.nextUrl,
  };
}
