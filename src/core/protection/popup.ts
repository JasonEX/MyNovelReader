/**
 * Popup blocking helpers.
 */

export function blockPopups(): () => void {
  const originalOpen = window.open;

  window.open = (url?: string | URL, target?: string, features?: string): Window | null => {
    // Allow popups triggered by user action
    const isTrusted = (window.event as Event)?.isTrusted;

    if (isTrusted) {
      // Check if it's a legitimate navigation (same domain chapter link)
      const urlStr = url?.toString() || '';
      try {
        const targetUrl = new URL(urlStr, window.location.href);
        if (targetUrl.origin === window.location.origin) {
          return originalOpen.call(window, url, target, features);
        }
      } catch {
        // Invalid URL
      }
    }

    return null;
  };

  return () => {
    window.open = originalOpen;
  };
}
