/**
 * Optimization module exports
 *
 * Provides performance optimization utilities including
 * parallel loading and memory management
 */

export { ParallelLoader, getParallelLoader, loadChapters } from './ParallelLoader';
export type { ParallelLoadOptions, ChapterLoadResult } from './ParallelLoader';

export { MemoryManager, ChapterCacheManager, getChapterCacheManager } from './MemoryManager';
export type { MemoryManagerOptions, MemoryStats } from './MemoryManager';
