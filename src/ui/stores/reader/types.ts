/**
 * Type definitions for reader store modules
 *
 * Centralized type definitions to avoid duplication across modules
 */

import type { ConversionMode } from '@/core/converter';
import type { ParsedChapter } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';

/** Section detection info */
export interface SectionInfo {
  isSection: boolean;
  nextSectionUrl: string | null;
  nextChapterUrl: string | null;
  confidence: number;
}

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

/** Cache progress state */
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

/** Persisted cache structure for GM storage */
export interface PersistedBookCache {
  bookId: string;
  indexUrl: string;
  chapters: Record<string, CachedChapter>;
  lastUpdated: number;
}

/** Chapter load result */
export interface ChapterLoadResult {
  success: boolean;
  chapter: ParsedChapter | null;
  error?: string;
  isVip?: boolean;
  isToc?: boolean;
}

/** Constants */
export const READER_CONSTANTS = {
  MAX_CACHED_CHAPTERS: 8,
  VIP_BLOCK_TOAST: '该章节为VIP/付费内容，无法加载',
} as const;

/** Chapter loader dependencies */
export interface ChapterLoaderDeps {
  chapters: ChapterEntry[];
  currentChapterIndex: number;
  cachedContents: Map<string, CachedChapter>;
  loadedUrls: Set<string>;
  vipBlockedUrls: Set<string>;
  blockedNavUrls: Set<string>;
  originalContents: Map<string, string>;
  originalTitles: Map<string, { title: string; bookTitle?: string }>;
  currentConversionMode: ConversionMode;
  insertChapter: (entry: ChapterEntry, isNext: boolean) => void;
  showToast: (message: string, type: 'info' | 'error', duration?: number) => void;
  addToHistory: (url: string, isNext: boolean) => void;
  setError: (message: string | null) => void;
}

/** Cache manager dependencies */
export interface CacheManagerDeps {
  cachedContents: Map<string, CachedChapter>;
  loadedUrls: Set<string>;
  persistedUrls: Set<string>;
  cacheProgress: CacheProgressState;
  cacheQueue: string[];
}

/** TOC manager dependencies */
export interface TocManagerDeps {
  toc: TocEntry[];
  tocLoading: boolean;
  tocAbort: (() => void) | null;
  setToc: (toc: TocEntry[]) => void;
  setTocLoading: (loading: boolean) => void;
  setTocAbort: (abort: (() => void) | null) => void;
}
