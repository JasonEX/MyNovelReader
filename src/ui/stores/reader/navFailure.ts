/**
 * Reader Store - Navigation Failure Backoff
 * Unified retry/backoff logic for chapter navigation failures.
 */

import { calculateBackoff } from './utils';
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
  const backoffMs = calculateBackoff(count);
  failures.set(key, { count, nextRetryAt: Date.now() + backoffMs });
  trimNavFailures(failures, opts.maxFailures);
  return count;
}

/**
 * Clear the failure record for a navigation key (e.g. after a successful load).
 */
export function clearNavFailure(failures: NavFailureMap, key: string): void {
  failures.delete(key);
}
