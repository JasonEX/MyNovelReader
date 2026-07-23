/**
 * Reader Store - Text Conversion
 * Applies Chinese Simplified/Traditional conversion to chapter content and TOC.
 */

import type { ChapterEntry, TocEntry } from './types';
import {
  type ChineseScript,
  type ConversionMode,
  convertHTML,
  convertText,
} from '@/core/converter';
import type { ParsedChapter } from '@/core/parser';

/**
 * Apply text conversion to a single chapter entry (by id).
 * Mutates the entry in-place.
 */
export async function applyConversionToChapterEntry(
  chapters: ChapterEntry[],
  originalContents: Map<string, string>,
  originalTitles: Map<string, { title: string; bookTitle?: string }>,
  entryId: string,
  mode: ConversionMode
): Promise<void> {
  const entry = chapters.find(e => e.id === entryId);
  if (!entry) return;

  const originalContent = originalContents.get(entryId);
  const originalTitle = originalTitles.get(entryId);
  const updates: Partial<ParsedChapter> = {};
  const conversionOptions = { sourceScript: entry.chapter.sourceScript };

  if (mode === 'none') {
    if (originalContent && entry.chapter.content !== originalContent) {
      updates.content = originalContent;
    }
    if (originalTitle) {
      updates.title = originalTitle.title;
      updates.bookTitle = originalTitle.bookTitle;
    }
  } else {
    if (originalContent) {
      updates.content = await convertHTML(originalContent, mode, conversionOptions);
    }
    if (originalTitle) {
      updates.title = await convertText(originalTitle.title, mode, conversionOptions);
      updates.bookTitle = originalTitle.bookTitle
        ? await convertText(originalTitle.bookTitle, mode, conversionOptions)
        : originalTitle.bookTitle;
    }
  }

  if (Object.keys(updates).length > 0) {
    entry.chapter = { ...entry.chapter, ...updates };
  }
}

/**
 * Apply text conversion to TOC entries.
 * Returns a new array of converted TocEntry objects.
 */
export async function applyTocConversion(
  tocOriginal: TocEntry[],
  mode: ConversionMode,
  sourceScript?: ChineseScript
): Promise<TocEntry[]> {
  if (tocOriginal.length === 0) {
    return [];
  }

  if (mode === 'none') {
    return [...tocOriginal];
  }

  return Promise.all(
    tocOriginal.map(async entry => ({
      ...entry,
      title: await convertText(entry.title, mode, { sourceScript }),
    }))
  );
}
