/**
 * Navigation Module
 *
 * Handles navigation state and utilities.
 *
 * @module Navigation
 */

import { normalizeCiwemaoChapterUrl, normalizeUrl } from '@/core/utils';

import type { ChapterEntry } from './types';
import { normalizeUrlForBlock } from './utils';

/**
 * Navigation Manager - handles navigation state and utilities
 */
export class NavigationManager {
  private history: string[] = [];
  private blockedNavUrls = new Set<string>();

  /**
   * Get navigation history
   */
  getHistory(): string[] {
    return this.history;
  }

  /**
   * Get blocked navigation URLs
   */
  getBlockedNavUrls(): Set<string> {
    return this.blockedNavUrls;
  }

  /**
   * Add URL to history
   *
   * @param url - URL to add
   * @param append - Whether to append (true) or prepend (false)
   */
  addToHistory(url: string, append = true): void {
    if (!this.history.includes(url)) {
      if (append) {
        this.history.push(url);
      } else {
        this.history.unshift(url);
      }
    }
  }

  /**
   * Check if a URL is blocked
   *
   * @param url - URL to check
   * @returns true if blocked
   */
  isUrlBlocked(url: string): boolean {
    return this.blockedNavUrls.has(normalizeUrlForBlock(url));
  }

  /**
   * Block a navigation URL
   *
   * @param url - URL to block
   */
  blockUrl(url: string): void {
    this.blockedNavUrls.add(normalizeUrlForBlock(url));
  }

  /**
   * Clear blocked URLs
   */
  clearBlockedUrls(): void {
    this.blockedNavUrls.clear();
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Check if there's a next chapter available
   *
   * @param chapters - Current chapters list
   * @param vipBlockedUrls - VIP blocked URLs
   * @returns true if next chapter is available
   */
  hasNext(chapters: ChapterEntry[], vipBlockedUrls: Set<string>): boolean {
    const lastChapter = chapters[chapters.length - 1];
    const nextUrl = lastChapter?.chapter.nextUrl;
    if (!nextUrl) return false;
    if (this.isUrlBlocked(nextUrl)) return false;
    return !vipBlockedUrls.has(normalizeUrlForBlock(nextUrl));
  }

  /**
   * Check if there's a previous chapter available
   *
   * @param chapters - Current chapters list
   * @param vipBlockedUrls - VIP blocked URLs
   * @returns true if previous chapter is available
   */
  hasPrev(chapters: ChapterEntry[], vipBlockedUrls: Set<string>): boolean {
    const firstChapter = chapters[0];
    const prevUrl = firstChapter?.chapter.prevUrl;
    if (!prevUrl) return false;
    if (this.isUrlBlocked(prevUrl)) return false;
    return !vipBlockedUrls.has(normalizeUrlForBlock(prevUrl));
  }

  /**
   * Get VIP block toast message for a direction
   *
   * @param chapters - Current chapters list
   * @param vipBlockedUrls - VIP blocked URLs
   * @param direction - Direction to check
   * @param vipBlockToast - Toast message for VIP blocks
   * @returns Toast message or null
   */
  getVipBlockedToast(
    chapters: ChapterEntry[],
    vipBlockedUrls: Set<string>,
    direction: 'next' | 'prev',
    vipBlockToast: string
  ): string | null {
    const entry = direction === 'next' ? chapters[chapters.length - 1] : chapters[0];
    const navUrl = direction === 'next' ? entry?.chapter.nextUrl : entry?.chapter.prevUrl;
    if (!navUrl) return null;
    return vipBlockedUrls.has(normalizeUrlForBlock(navUrl)) ? vipBlockToast : null;
  }

  /**
   * Normalize URL for blocking/checking
   *
   * @param url - URL to normalize
   * @returns Normalized URL
   */
  normalizeUrlForBlock(url: string): string {
    const normalized = normalizeCiwemaoChapterUrl(url);
    try {
      const u = new URL(normalized);
      u.hash = '';
      return normalizeUrl(u.toString());
    } catch {
      return normalizeUrl(normalized.replace(/#.*$/, ''));
    }
  }
}

/**
 * Create navigation manager instance
 */
export function createNavigationManager(): NavigationManager {
  return new NavigationManager();
}
