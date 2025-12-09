/**
 * SiteProtection - Protect against common anti-user techniques on novel sites
 *
 * Handles:
 * - Click event hijacking
 * - Invisible/timed/conditional redirects
 * - Right-click disabled
 * - Copy/select disabled
 * - Keyboard shortcuts blocked
 * - DevTools detection
 */

export interface ProtectionOptions {
  /** Block unwanted redirects */
  blockRedirects?: boolean;
  /** Restore right-click menu */
  enableRightClick?: boolean;
  /** Restore text selection */
  enableSelection?: boolean;
  /** Restore copy functionality */
  enableCopy?: boolean;
  /** Block popup windows */
  blockPopups?: boolean;
  /** Remove event hijacking */
  removeEventHijacking?: boolean;
  /** Block visibility change detection */
  blockVisibilityDetection?: boolean;
}

const DEFAULT_OPTIONS: ProtectionOptions = {
  blockRedirects: true,
  enableRightClick: true,
  enableSelection: true,
  enableCopy: true,
  blockPopups: true,
  removeEventHijacking: true,
  blockVisibilityDetection: true,
};

export class SiteProtection {
  private options: ProtectionOptions;
  private originalHandlers: Map<string, EventListener[]> = new Map();
  private cleanupFunctions: (() => void)[] = [];
  private isActive = false;

  constructor(options: ProtectionOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Activate all protection measures
   */
  activate(): void {
    if (this.isActive) return;
    this.isActive = true;

    if (this.options.blockRedirects) {
      this.blockRedirects();
    }

    if (this.options.enableRightClick) {
      this.enableRightClick();
    }

    if (this.options.enableSelection) {
      this.enableSelection();
    }

    if (this.options.enableCopy) {
      this.enableCopy();
    }

    if (this.options.blockPopups) {
      this.blockPopups();
    }

    if (this.options.removeEventHijacking) {
      this.removeEventHijacking();
    }

    if (this.options.blockVisibilityDetection) {
      this.blockVisibilityDetection();
    }
  }

  /**
   * Deactivate all protection measures
   */
  deactivate(): void {
    if (!this.isActive) return;

    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    this.isActive = false;
  }

  /**
   * Block unwanted redirects (meta refresh, location change, etc.)
   */
  private blockRedirects(): void {
    // Block meta refresh redirects
    const metaRefresh = document.querySelectorAll('meta[http-equiv="refresh"]');
    metaRefresh.forEach(meta => meta.remove());

    // Override location change methods (may fail in some environments where these are read-only)
    const originalAssign = window.location.assign.bind(window.location);
    const originalReplace = window.location.replace.bind(window.location);

    const isAllowedNavigation = (url: string): boolean => {
      try {
        const targetUrl = new URL(url, window.location.href);
        // Allow same-origin navigations
        if (targetUrl.origin === window.location.origin) {
          // Block common ad/redirect patterns
          const blockedPatterns = [
            /ad[s]?[_-]?/i,
            /click[_-]?track/i,
            /redirect/i,
            /jump[_-]?to/i,
            /go[_-]?to[_-]?url/i,
            /link[_-]?out/i,
            /external/i,
          ];
          return !blockedPatterns.some(p => p.test(targetUrl.pathname));
        }
        return false;
      } catch {
        return false;
      }
    };

    // Try to override location methods - may fail in Firefox userscript environments
    let locationOverrideSucceeded = false;
    try {
      Object.defineProperty(window.location, 'assign', {
        value: (url: string) => {
          if (isAllowedNavigation(url)) {
            originalAssign(url);
          }
          // Blocked navigation - do nothing
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window.location, 'replace', {
        value: (url: string) => {
          if (isAllowedNavigation(url)) {
            originalReplace(url);
          }
          // Blocked navigation - do nothing
        },
        writable: true,
        configurable: true,
      });
      locationOverrideSucceeded = true;
    } catch {
      // In Firefox userscript environments, location properties are often read-only
    }

    // Intercept setTimeout/setInterval for timed redirects
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    const suspiciousPatterns = [/location\s*[.=]/i, /window\.open/i, /href\s*=/i, /navigate/i];

    const isSuspiciousCallback = (callback: unknown): boolean => {
      // Only check string callbacks (legacy setTimeout("code", delay) pattern)
      // Don't check function callbacks as .toString() is very expensive
      // and causes high CPU usage on sites with many timers
      if (typeof callback === 'string') {
        return suspiciousPatterns.some(p => p.test(callback));
      }
      return false;
    };

    // @ts-expect-error - Overriding setTimeout
    window.setTimeout = (callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (isSuspiciousCallback(callback) && (delay || 0) > 0) {
        return 0;
      }
      return originalSetTimeout(callback, delay, ...args);
    };

    // @ts-expect-error - Overriding setInterval
    window.setInterval = (callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (isSuspiciousCallback(callback)) {
        return 0;
      }
      return originalSetInterval(callback, delay, ...args);
    };

    this.cleanupFunctions.push(() => {
      if (locationOverrideSucceeded) {
        try {
          Object.defineProperty(window.location, 'assign', {
            value: originalAssign,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(window.location, 'replace', {
            value: originalReplace,
            writable: true,
            configurable: true,
          });
        } catch {
          // Ignore errors during cleanup
        }
      }
      // @ts-expect-error - Restoring setTimeout
      window.setTimeout = originalSetTimeout;
      // @ts-expect-error - Restoring setInterval
      window.setInterval = originalSetInterval;
    });
  }

  /**
   * Enable right-click context menu
   */
  private enableRightClick(): void {
    const handler = (e: Event) => {
      e.stopPropagation();
      return true;
    };

    // Remove existing contextmenu blockers
    document.addEventListener('contextmenu', handler, true);

    // Override oncontextmenu
    const originalOnContextMenu = document.oncontextmenu;
    document.oncontextmenu = null;

    // Remove from body as well
    if (document.body) {
      document.body.oncontextmenu = null;
    }

    // Remove inline handlers
    document.querySelectorAll('[oncontextmenu]').forEach(el => {
      el.removeAttribute('oncontextmenu');
    });

    this.cleanupFunctions.push(() => {
      document.removeEventListener('contextmenu', handler, true);
      document.oncontextmenu = originalOnContextMenu;
    });
  }

  /**
   * Enable text selection
   */
  private enableSelection(): void {
    const handler = (e: Event) => {
      e.stopPropagation();
      return true;
    };

    document.addEventListener('selectstart', handler, true);

    // Remove CSS that prevents selection
    const style = document.createElement('style');
    style.id = 'mnr-enable-selection';
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Remove inline handlers
    document.querySelectorAll('[onselectstart]').forEach(el => {
      el.removeAttribute('onselectstart');
    });

    // Remove unselectable attribute
    document.querySelectorAll('[unselectable]').forEach(el => {
      el.removeAttribute('unselectable');
    });

    this.cleanupFunctions.push(() => {
      document.removeEventListener('selectstart', handler, true);
      style.remove();
    });
  }

  /**
   * Enable copy functionality
   */
  private enableCopy(): void {
    const handler = (e: Event) => {
      e.stopPropagation();
      return true;
    };

    document.addEventListener('copy', handler, true);
    document.addEventListener('cut', handler, true);

    // Remove inline handlers
    document.querySelectorAll('[oncopy], [oncut]').forEach(el => {
      el.removeAttribute('oncopy');
      el.removeAttribute('oncut');
    });

    this.cleanupFunctions.push(() => {
      document.removeEventListener('copy', handler, true);
      document.removeEventListener('cut', handler, true);
    });
  }

  /**
   * Block popup windows
   */
  private blockPopups(): void {
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

    this.cleanupFunctions.push(() => {
      window.open = originalOpen;
    });
  }

  /**
   * Remove event hijacking (click interception, etc.)
   */
  private removeEventHijacking(): void {
    // Block click hijacking on document/body
    const clickBlocker = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // If clicking on a legitimate link/button, allow it
      const clickableParent = target.closest('a, button, [role="button"]');
      if (clickableParent) {
        // Check if the link is being hijacked
        if (clickableParent instanceof HTMLAnchorElement) {
          const href = clickableParent.getAttribute('href');
          // Allow normal links, block javascript: or suspicious hrefs
          if (href && !href.startsWith('javascript:') && href !== '#') {
            return true;
          }
        }
      }

      // Stop propagation if this click might be hijacked
      if (e.target === document.body || e.target === document.documentElement) {
        e.stopPropagation();
      }
    };

    document.addEventListener('click', clickBlocker, true);

    // Remove onclick from body/html
    if (document.body) {
      document.body.onclick = null;
    }
    document.documentElement.onclick = null;

    // Block mousedown/mouseup hijacking
    const mouseBlocker = (e: MouseEvent) => {
      if (e.target === document.body || e.target === document.documentElement) {
        e.stopPropagation();
      }
    };

    document.addEventListener('mousedown', mouseBlocker, true);
    document.addEventListener('mouseup', mouseBlocker, true);

    this.cleanupFunctions.push(() => {
      document.removeEventListener('click', clickBlocker, true);
      document.removeEventListener('mousedown', mouseBlocker, true);
      document.removeEventListener('mouseup', mouseBlocker, true);
    });
  }

  /**
   * Block visibility change detection (prevents pausing/ads on tab switch)
   */
  private blockVisibilityDetection(): void {
    // Override visibility state
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    // Block visibility change events
    const visibilityBlocker = (e: Event) => {
      e.stopImmediatePropagation();
    };

    document.addEventListener('visibilitychange', visibilityBlocker, true);

    // Block blur/focus detection on window
    const blurBlocker = (e: Event) => {
      if (e.target === window || e.target === document) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('blur', blurBlocker, true);
    window.addEventListener('focus', blurBlocker, true);

    this.cleanupFunctions.push(() => {
      document.removeEventListener('visibilitychange', visibilityBlocker, true);
      window.removeEventListener('blur', blurBlocker, true);
      window.removeEventListener('focus', blurBlocker, true);
      // Note: Can't restore property descriptors easily
    });
  }

  /**
   * Remove all annoying overlays (ad overlays, modal blockers)
   */
  removeOverlays(): void {
    const overlaySelectors = [
      // Common overlay classes/ids
      '[class*="overlay"]',
      '[class*="modal"]',
      '[class*="popup"]',
      '[class*="mask"]',
      '[class*="blocker"]',
      '[id*="overlay"]',
      '[id*="modal"]',
      '[id*="popup"]',
      // Fixed/absolute position elements covering viewport
    ];

    document.querySelectorAll(overlaySelectors.join(', ')).forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Check if it's a full-page overlay
      const isFullPage =
        rect.width >= window.innerWidth * 0.8 && rect.height >= window.innerHeight * 0.8;

      const isFixed = style.position === 'fixed' || style.position === 'absolute';

      const hasHighZIndex = parseInt(style.zIndex) > 1000;

      if (isFullPage && isFixed && hasHighZIndex) {
        (el as HTMLElement).style.display = 'none';
      }
    });

    // Re-enable scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  /**
   * Clean up suspicious scripts
   */
  cleanupScripts(): void {
    const suspiciousPatterns = [/ad[s]?\./i, /track(er|ing)/i, /analytics/i, /popup/i, /redirect/i];

    document.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src') || '';
      if (suspiciousPatterns.some(p => p.test(src))) {
        script.remove();
      }
    });
  }
}

// Singleton instance
let protectionInstance: SiteProtection | null = null;

/**
 * Get the singleton SiteProtection instance
 */
export function getSiteProtection(): SiteProtection {
  if (!protectionInstance) {
    protectionInstance = new SiteProtection();
  }
  return protectionInstance;
}
