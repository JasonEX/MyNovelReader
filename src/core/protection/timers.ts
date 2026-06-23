/**
 * Clear all intervals and timeouts to reduce CPU usage.
 * Many novel sites use tracking scripts that create intervals causing high CPU/GC.
 */
export function clearAllTimers(): void {
  const highestId = window.setInterval(() => {}, 0);

  for (let i = 0; i <= highestId; i++) {
    window.clearInterval(i);
  }

  const highestTimeoutId = window.setTimeout(() => {}, 0);
  for (let i = 0; i <= highestTimeoutId; i++) {
    window.clearTimeout(i);
  }
}
