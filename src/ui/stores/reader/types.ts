/**
 * Reader Store Types and Constants
 */

import type { ParsedChapter } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';

// ============ Constants ============

/** Maximum chapters kept in the display list */
export const MAX_CACHED_CHAPTERS = 8;

/** LRU cache limit for in-memory session cache */
export const MAX_SESSION_CACHE = 500;

/** Max navigation failure records */
export const MAX_NAV_FAILURES = 200;

/** VIP block toast message */
export const VIP_BLOCK_TOAST = '该章节为VIP/付费内容，无法加载';

// ============ Types ============

/** Section detection info */
export type SectionInfo = {
  isSection: boolean;
  nextSectionUrl: string | null;
  nextChapterUrl: string | null;
  confidence: number;
};

/** Load source type */
export type LoadSource = 'auto' | 'manual';

/** Reading progress state */
export interface ReadingProgress {
  /** Chapter URL */
  url: string;
  /** Scroll position (0-100%) */
  scrollPercent: number;
  /** Current chapter (visible) URL */
  chapterUrl: string;
  /** Progress within current chapter (0-100%) */
  chapterPercent: number;
  /** Last read timestamp */
  lastRead: number;
}

/** Cache progress state for UI */
export interface CacheProgressState {
  done: number;
  total: number;
  running: boolean;
}

/** Chapter entry for infinite scroll */
export interface ChapterEntry {
  chapter: ParsedChapter;
  rule?: SiteRule;
  id: string; // unique ID for Vue key
}

/** Table of contents entry */
export interface TocEntry {
  title: string;
  url: string;
}

/** TOC entry with cache status for UI */
export interface TocEntryWithStatus extends TocEntry {
  isCached: boolean;
  isPersisted: boolean;
  isCurrent: boolean;
}

/** Cached chapter content (separate from display chapters) */
export interface CachedChapter {
  chapter: ParsedChapter;
  rule?: SiteRule;
  cachedAt: number;
}

/** Navigation failure record */
export interface NavFailureRecord {
  count: number;
  nextRetryAt: number;
}
