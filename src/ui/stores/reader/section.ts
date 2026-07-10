/**
 * Reader Store Section Parsing
 * Handles section/page merging for multi-page chapters
 *
 * Delegates to the core SectionMerger for the actual merge logic.
 */

import { createSectionMerger } from '@/core/auto-enable/SectionMerger';
import { getParser } from '@/core/parser';
import type { ParsedChapter } from '@/core/parser';

/**
 * Parse a chapter with section merging support
 * Handles multi-page chapters by fetching and merging all sections
 */
export async function parseWithSectionMerge(
  parser: ReturnType<typeof getParser>,
  initialDoc: Document,
  url: string,
  options: { signal?: AbortSignal } = {}
): Promise<ParsedChapter | null> {
  const merger = createSectionMerger(parser);
  return merger.merge(initialDoc, url, options);
}
