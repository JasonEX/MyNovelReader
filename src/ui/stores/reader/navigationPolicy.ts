import type { LoadSource } from './types';

export type NavigationBlockReason = 'index-target' | 'invalid-target' | 'toc-page' | 'prev-page';

/**
 * Automatic preload is speculative: it may fail because the site throttled, served
 * a transient page, or delayed content. Keep permanent navigation state changes
 * for explicit user actions so a bad preload cannot make the reader look ended.
 */
export function shouldPersistNavigationBlock(source: LoadSource, _reason: NavigationBlockReason) {
  return source === 'manual';
}

/**
 * Backoff protects automatic retries from looking like polling. Manual actions
 * should remain available because they are explicit reading/navigation intent.
 */
export function shouldUseNavigationFailureCooldown(source: LoadSource): boolean {
  return source === 'auto';
}
