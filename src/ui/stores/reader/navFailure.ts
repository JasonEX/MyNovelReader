/**
 * Reader Store - Navigation Failure Backoff
 * Unified retry/backoff logic for chapter navigation failures.
 */

import { trimNavFailures } from './trim';

type NavFailureMap = Map<string, { count: number; nextRetryAt: number }>;

/**
 * Record a navigation failure with exponential backoff.
 * Returns the updated failure count.
 */
export function recordNavFailure(
  failures: NavFailureMap,
  key: string,
  opts: { maxFailures: number }
): number {
  const prev = failures.get(key);
  const count = (prev?.count || 0) + 1;
  const backoffMs = Math.min(1500 * Math.pow(2, count - 1), 30000);
  failures.set(key, { count, nextRetryAt: Date.now() + backoffMs });
  trimNavFailures(failures, opts.maxFailures);
  return count;
}

/**
 * Check whether a navigation key is still in backoff.
 * Returns `{ blocked: true, ... }` when retry is not yet allowed.
 */
export function getNavRetryState(
  failures: NavFailureMap,
  key: string
): { blocked: boolean; count: number } {
  const failure = failures.get(key);
  if (!failure) return { blocked: false, count: 0 };
  return {
    blocked: Date.now() < failure.nextRetryAt,
    count: failure.count,
  };
}

/**
 * Clear the failure record for a navigation key (e.g. after a successful load).
 */
export function clearNavFailure(failures: NavFailureMap, key: string): void {
  failures.delete(key);
}
