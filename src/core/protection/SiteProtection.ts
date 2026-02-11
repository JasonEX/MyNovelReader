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
  /** Intercept keyboard listeners to prevent key blocking */
  unlockKeyboard?: boolean;
  /** Block popup windows */
  blockPopups?: boolean;
  /** Remove event hijacking */
  removeEventHijacking?: boolean;
  /** Block visibility change detection */
  blockVisibilityDetection?: boolean;
  /** Clear all timers (setInterval/setTimeout) to reduce CPU usage */
  clearTimers?: boolean;
  /** Clean up suspicious scripts (aggressive) */
  cleanupScripts?: boolean;
}

export const isCloudflareChallenge = (doc: Document = document): boolean => {
  const pathname = doc.location?.pathname || window.location.pathname;
  if (pathname.startsWith('/cdn-cgi/')) return true;

  const selectors = [
    '[id*="cf-chl"]',
    '[class*="cf-chl"]',
    'form[action*="/cdn-cgi/"]',
    'script[src*="/cdn-cgi/challenge-platform"]',
    'link[href*="/cdn-cgi/challenge-platform"]',
    'iframe[src*="challenges.cloudflare.com"]',
    'iframe[src*="captcha.cloudflare.com"]',
  ];

  return doc.querySelector(selectors.join(',')) !== null;
};

const DEFAULT_OPTIONS: ProtectionOptions = {
  blockRedirects: true,
  enableRightClick: true,
  enableSelection: true,
  enableCopy: true,
  unlockKeyboard: true,
  blockPopups: true,
  removeEventHijacking: true,
  blockVisibilityDetection: true,
  clearTimers: true,
  cleanupScripts: false,
};

export class SiteProtection {
  private options: ProtectionOptions;
  private cleanupFunctions: (() => void)[] = [];
  private isActive = false;

  constructor(options: ProtectionOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Activate all protection measures
   */
  activate(options?: ProtectionOptions): void {
    if (options) {
      this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    // If already active and options are provided, re-apply with new options.
    // This allows us to activate early with safe defaults (e.g. document-start),
    // then reconfigure after user settings are loaded.
    if (this.isActive) {
      if (!options) return;
      this.deactivate();
    }
    this.isActive = true;

    const isChallenge = isCloudflareChallenge();
    const effectiveOptions = isChallenge
      ? {
          ...this.options,
          blockRedirects: false,
          clearTimers: false,
          removeEventHijacking: false,
        }
      : this.options;

    // Clear timers first to reduce CPU usage from tracking scripts
    if (effectiveOptions.clearTimers) {
      this.clearTimers();
    }

    if (effectiveOptions.blockRedirects) {
      this.blockRedirects();
    }

    if (effectiveOptions.enableRightClick) {
      this.enableRightClick();
    }

    if (effectiveOptions.enableSelection) {
      this.enableSelection();
    }

    if (effectiveOptions.enableCopy) {
      this.enableCopy();
    }

    if (effectiveOptions.unlockKeyboard) {
      this.unlockKeyboard();
    }

    if (effectiveOptions.blockPopups) {
      this.blockPopups();
    }

    if (effectiveOptions.cleanupScripts) {
      this.cleanupScripts();
    }

    if (effectiveOptions.removeEventHijacking) {
      this.removeEventHijacking();
    }

    if (effectiveOptions.blockVisibilityDetection) {
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

        // Allow Cloudflare challenge/captcha pages to prevent verification loops
        const cloudflareHosts = ['challenges.cloudflare.com', 'captcha.cloudflare.com'];
        if (cloudflareHosts.some(h => targetUrl.hostname === h)) {
          return true;
        }

        // Allow same-origin Cloudflare verification paths (e.g. /cdn-cgi/l/chk_jschl)
        if (
          targetUrl.origin === window.location.origin &&
          targetUrl.pathname.startsWith('/cdn-cgi/')
        ) {
          return true;
        }

        // Allow same-origin navigations
        if (targetUrl.origin === window.location.origin) {
          // Block common ad/redirect patterns.
          // Patterns must use word boundaries to avoid false positives:
          // e.g. /ad/ must not match "/read/", "/thread/", "/upload/"
          const blockedPatterns = [
            /(?:^|[/_-])ads?(?:[/_-]|$)/i,
            /(?:^|[/_-])click[_-]?track/i,
            /(?:^|[/_-])redirect(?:[/_-]|$)/i,
            /(?:^|[/_-])jump[_-]?to/i,
            /(?:^|[/_-])go[_-]?to[_-]?url/i,
            /(?:^|[/_-])link[_-]?out/i,
            /(?:^|[/_-])external(?:[/_-]|$)/i,
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
    const locationProto = Object.getPrototypeOf(window.location) as Location | null;
    const originalHrefDesc = locationProto
      ? Object.getOwnPropertyDescriptor(locationProto, 'href')
      : null;
    try {
      const target = locationProto || window.location;

      Object.defineProperty(target, 'assign', {
        value: (url: string) => {
          if (isAllowedNavigation(url)) originalAssign(url);
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(target, 'replace', {
        value: (url: string) => {
          if (isAllowedNavigation(url)) originalReplace(url);
        },
        writable: true,
        configurable: true,
      });

      // Also try to guard location.href setter against unwanted navigation.
      // Many mobile ad scripts use: location.href = 'https://...'
      if (locationProto) {
        if (originalHrefDesc?.set && originalHrefDesc.get) {
          Object.defineProperty(locationProto, 'href', {
            get: originalHrefDesc.get,
            set: function (url: string) {
              if (isAllowedNavigation(url)) {
                originalHrefDesc.set?.call(this, url);
              }
            },
            configurable: true,
          });
        }
      }
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

    window.setTimeout = (callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (isSuspiciousCallback(callback) && (delay || 0) > 0) {
        return 0;
      }
      return originalSetTimeout(callback, delay, ...args);
    };

    window.setInterval = (callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (isSuspiciousCallback(callback)) {
        return 0;
      }
      return originalSetInterval(callback, delay, ...args);
    };

    // Block dynamic injection of third-party scripts/iframes (common on mobile ad-tech).
    // This is conservative: it only affects programmatic insertions, not static HTML.
    const isBlockedExternalUrl = (url: URL, kind: 'script' | 'iframe'): boolean => {
      // Block non-http(s) for scripts/iframes (data:, javascript:, etc.)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return true;
      if (url.origin === window.location.origin) return false;

      // Allow Cloudflare challenge scripts and iframes so CF verification can complete.
      const cfHosts = ['challenges.cloudflare.com', 'captcha.cloudflare.com'];
      if (cfHosts.some(h => url.hostname === h)) return false;
      if (url.pathname.startsWith('/cdn-cgi/')) return false;

      // Always block cross-origin dynamic scripts/iframes to prevent random redirect chains.
      // Users can still navigate manually by clicking normal links.
      return kind === 'script' || kind === 'iframe';
    };

    const isHighEntropyPath = (pathname: string): boolean => {
      // Example: /Ab12Cd34/EFgh5678iJ.js
      return /^\/[A-Za-z0-9]{6,12}\/[A-Za-z0-9]{6,24}\.js(?:$|[?#])/.test(pathname);
    };

    const isLikelyAdScriptPath = (srcUrl: URL): boolean => {
      if (srcUrl.origin !== window.location.origin) return true;
      const path = srcUrl.pathname || '';
      if (path.startsWith('/static/') || path.startsWith('/js/') || path.startsWith('/assets/')) {
        return false;
      }
      return isHighEntropyPath(path);
    };

    const NodeCtor = window.Node;
    const ScriptCtor = window.HTMLScriptElement;
    const IFrameCtor = window.HTMLIFrameElement;
    const ElementCtor = window.Element;
    const DocumentFragmentCtor = window.DocumentFragment;

    const originalAppendChild = NodeCtor.prototype.appendChild;
    const originalInsertBefore = NodeCtor.prototype.insertBefore;

    const shouldBlockNode = (node: Node): boolean => {
      const checkScript = (script: HTMLScriptElement): boolean => {
        const src = script.getAttribute('src') || script.src || '';
        if (!src) return false;
        let u: URL;
        try {
          u = new URL(src, window.location.href);
        } catch {
          return false;
        }
        if (isBlockedExternalUrl(u, 'script')) return true;
        if (this.options.cleanupScripts && isLikelyAdScriptPath(u)) return true;
        return false;
      };

      const checkIFrame = (iframe: HTMLIFrameElement): boolean => {
        const src = iframe.getAttribute('src') || iframe.src || '';
        if (!src) return false;
        let u: URL;
        try {
          u = new URL(src, window.location.href);
        } catch {
          return false;
        }
        if (isBlockedExternalUrl(u, 'iframe')) return true;
        return false;
      };

      if (ScriptCtor && node instanceof ScriptCtor) return checkScript(node as HTMLScriptElement);
      if (IFrameCtor && node instanceof IFrameCtor) return checkIFrame(node as HTMLIFrameElement);

      if (
        (DocumentFragmentCtor && node instanceof DocumentFragmentCtor) ||
        (ElementCtor && node instanceof ElementCtor)
      ) {
        const scripts = node.querySelectorAll('script[src]');
        for (const s of Array.from(scripts)) {
          if (ScriptCtor && s instanceof ScriptCtor && checkScript(s)) return true;
        }
        const iframes = node.querySelectorAll('iframe[src]');
        for (const f of Array.from(iframes)) {
          if (IFrameCtor && f instanceof IFrameCtor && checkIFrame(f)) return true;
        }
      }

      return false;
    };

    NodeCtor.prototype.appendChild = function (node: Node) {
      if (shouldBlockNode(node)) return node;
      return originalAppendChild.call(this, node);
    };

    NodeCtor.prototype.insertBefore = function (newNode: Node, referenceNode: Node | null) {
      if (shouldBlockNode(newNode)) return newNode;
      return originalInsertBefore.call(this, newNode, referenceNode);
    };

    // Aggressive mode: filter document.write/writeln that injects suspicious external scripts.
    const originalWrite = document.write?.bind(document);
    const originalWriteln = document.writeln?.bind(document);
    let writeBuffer = '';
    let isBufferingWrite = false;
    const MAX_BUFFER_LEN = 4096;

    const bufferLooksLikeScriptTag = (buf: string): boolean => /<script/i.test(buf);
    const bufferIsClosed = (buf: string): boolean =>
      /<\/script>/i.test(buf) || /<\\\/script>/i.test(buf);

    const maybeExtractScriptSrc = (buf: string): string | null => {
      const m = buf.match(/<script[^>]*\ssrc\s*=\s*['"]([^'"]+)['"][^>]*>/i);
      return m?.[1] || null;
    };

    const flushWriteBuffer = (writer: (html: string) => void) => {
      if (!writeBuffer) return;
      writer(writeBuffer);
      writeBuffer = '';
      isBufferingWrite = false;
    };

    const handleWriteLike = (writer: (html: string) => void, args: unknown[]) => {
      if (!originalWrite || !originalWriteln) return writer(String(args.join('')));

      const chunk = args.map(a => String(a)).join('');
      const startsScriptLike =
        /<script/i.test(chunk) || (isBufferingWrite && bufferLooksLikeScriptTag(writeBuffer));

      if (!isBufferingWrite && startsScriptLike) {
        isBufferingWrite = true;
        writeBuffer = '';
      }

      if (!isBufferingWrite) {
        writer(chunk);
        return;
      }

      writeBuffer += chunk;
      if (writeBuffer.length > MAX_BUFFER_LEN) {
        // Fail-safe: don't keep buffering indefinitely.
        flushWriteBuffer(writer);
        return;
      }

      if (!bufferIsClosed(writeBuffer)) return;

      const src = maybeExtractScriptSrc(writeBuffer);
      if (src) {
        try {
          const u = new URL(src, window.location.href);
          const shouldBlock = isBlockedExternalUrl(u, 'script') || isLikelyAdScriptPath(u);
          if (shouldBlock) {
            writeBuffer = '';
            isBufferingWrite = false;
            return;
          }
        } catch {
          // Ignore invalid URL, pass through.
        }
      }

      flushWriteBuffer(writer);
    };

    if (this.options.cleanupScripts && originalWrite && originalWriteln) {
      document.write = (...args: unknown[]) => handleWriteLike(originalWrite, args);
      document.writeln = (...args: unknown[]) => handleWriteLike(originalWriteln, args);
    }

    this.cleanupFunctions.push(() => {
      if (locationOverrideSucceeded) {
        try {
          const target = locationProto || window.location;
          Object.defineProperty(target, 'assign', { value: originalAssign, configurable: true });
          Object.defineProperty(target, 'replace', { value: originalReplace, configurable: true });

          if (locationProto && originalHrefDesc) {
            Object.defineProperty(locationProto, 'href', originalHrefDesc);
          }
        } catch {
          // Ignore errors during cleanup
        }
      }
      window.setTimeout = originalSetTimeout;
      window.setInterval = originalSetInterval;

      NodeCtor.prototype.appendChild = originalAppendChild;
      NodeCtor.prototype.insertBefore = originalInsertBefore;

      if (originalWrite) {
        document.write = originalWrite;
      }
      if (originalWriteln) {
        document.writeln = originalWriteln;
      }
    }); // End cleanupFunctions.push
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
   * Intercept keyboard events to prevent sites from blocking keys
   */
  private unlockKeyboard(): void {
    const handler = (e: KeyboardEvent) => {
      if (this.isMnrEvent(e)) {
        return;
      }
      e.stopImmediatePropagation();
      e.stopPropagation();
    };

    const types: Array<keyof DocumentEventMap> = ['keydown', 'keyup', 'keypress'];
    types.forEach(type => document.addEventListener(type, handler, true));

    const originalDocumentHandlers = {
      keydown: document.onkeydown,
      keyup: document.onkeyup,
      keypress: document.onkeypress,
    };

    const originalWindowHandlers = {
      keydown: window.onkeydown,
      keyup: window.onkeyup,
      keypress: window.onkeypress,
    };

    const originalBodyHandlers = document.body
      ? {
          keydown: document.body.onkeydown,
          keyup: document.body.onkeyup,
          keypress: document.body.onkeypress,
        }
      : null;

    const originalHtmlHandlers = {
      keydown: document.documentElement.onkeydown,
      keyup: document.documentElement.onkeyup,
      keypress: document.documentElement.onkeypress,
    };

    document.onkeydown = null;
    document.onkeyup = null;
    document.onkeypress = null;
    window.onkeydown = null;
    window.onkeyup = null;
    window.onkeypress = null;
    document.documentElement.onkeydown = null;
    document.documentElement.onkeyup = null;
    document.documentElement.onkeypress = null;

    if (document.body) {
      document.body.onkeydown = null;
      document.body.onkeyup = null;
      document.body.onkeypress = null;
    }

    // Remove inline handlers
    document.querySelectorAll('[onkeydown], [onkeyup], [onkeypress]').forEach(el => {
      el.removeAttribute('onkeydown');
      el.removeAttribute('onkeyup');
      el.removeAttribute('onkeypress');
    });

    this.cleanupFunctions.push(() => {
      types.forEach(type => document.removeEventListener(type, handler, true));
      document.onkeydown = originalDocumentHandlers.keydown;
      document.onkeyup = originalDocumentHandlers.keyup;
      document.onkeypress = originalDocumentHandlers.keypress;
      window.onkeydown = originalWindowHandlers.keydown;
      window.onkeyup = originalWindowHandlers.keyup;
      window.onkeypress = originalWindowHandlers.keypress;
      document.documentElement.onkeydown = originalHtmlHandlers.keydown;
      document.documentElement.onkeyup = originalHtmlHandlers.keyup;
      document.documentElement.onkeypress = originalHtmlHandlers.keypress;
      if (document.body && originalBodyHandlers) {
        document.body.onkeydown = originalBodyHandlers.keydown;
        document.body.onkeyup = originalBodyHandlers.keyup;
        document.body.onkeypress = originalBodyHandlers.keypress;
      }
    });
  }

  private isMnrEvent(e: Event): boolean {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    for (const node of path) {
      if (node instanceof ShadowRoot) {
        const host = node.host as HTMLElement | null;
        if (host?.id?.startsWith('mnr-')) return true;
      }
      if (node instanceof Element) {
        if (node.id?.startsWith('mnr-')) return true;
        for (const cls of Array.from(node.classList)) {
          if (cls.startsWith('mnr-')) return true;
        }
      }
    }
    return false;
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
    if (!document.body) return;

    const hideElement = (el: HTMLElement) => {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    };

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

    document.querySelectorAll<HTMLElement>(overlaySelectors.join(', ')).forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Check if it's a full-page overlay
      const isFullPage =
        rect.width >= window.innerWidth * 0.8 && rect.height >= window.innerHeight * 0.8;

      const isFixed = style.position === 'fixed' || style.position === 'absolute';

      const zIndex = parseInt(style.zIndex, 10);
      const hasHighZIndex = Number.isFinite(zIndex) && zIndex > 1000;

      if (isFullPage && isFixed && hasHighZIndex) {
        hideElement(el);
      }
    });

    // Some mobile sites inject invisible fixed layers that hijack taps near the top/bottom
    // (e.g. a transparent <a> covering the header). Remove those conservatively.
    const isTransparentColor = (color: string): boolean => {
      const c = (color || '').trim().toLowerCase();
      return c === 'transparent' || c === 'rgba(0, 0, 0, 0)' || c === 'rgba(0,0,0,0)';
    };

    const isMnrHost = (el: HTMLElement): boolean => el.id.startsWith('mnr-');

    const hasVisibleContent = (el: HTMLElement): boolean => {
      const text = (el.textContent || '').trim();
      if (text.length > 0) return true;
      return el.querySelector('img, svg, canvas, video') !== null;
    };

    const looksLikeClickLayer = (el: HTMLElement): boolean => {
      if (isMnrHost(el)) return false;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (style.pointerEvents === 'none') return false;
      if (style.position !== 'fixed' && style.position !== 'absolute') return false;

      const zIndex = parseInt(style.zIndex, 10);
      if (!Number.isFinite(zIndex) || zIndex <= 1000) return false;

      const rect = el.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return false;

      const minWidth = window.innerWidth * 0.6;
      const minHeight = 40;
      const maxHeight = window.innerHeight * 0.6;
      if (rect.width < minWidth || rect.height < minHeight || rect.height > maxHeight) return false;

      const nearTop = rect.top <= 2;
      const nearBottom = rect.bottom >= window.innerHeight - 2;
      if (!nearTop && !nearBottom) return false;

      if (hasVisibleContent(el)) return false;

      const rawOpacity = style.opacity || el.style.opacity || '1';
      const opacity = parseFloat(rawOpacity);
      const bg = style.backgroundColor || el.style.backgroundColor || '';
      const invisible = (Number.isFinite(opacity) && opacity <= 0.08) || isTransparentColor(bg);
      if (!invisible) return false;

      // Require some click/navigation capability to avoid hiding layout helpers.
      const AnchorCtor = window.HTMLAnchorElement;
      if (AnchorCtor && el instanceof AnchorCtor) return true;
      if (el.tagName.toLowerCase() === 'a' && el.hasAttribute('href')) return true;
      if (el.querySelector('a[href]')) return true;
      if (el.hasAttribute('onclick')) return true;
      const maybeOnclick = (el as unknown as { onclick?: unknown }).onclick;
      if (typeof maybeOnclick === 'function') return true;
      return false;
    };

    const candidates = Array.from(
      document.body.querySelectorAll<HTMLElement>('a, div, span, section, header, footer, nav')
    );
    for (const el of candidates) {
      if (looksLikeClickLayer(el)) {
        hideElement(el);
      }
    }

    // Re-enable scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  /**
   * Clear all intervals and timeouts to reduce CPU usage
   * Many novel sites use tracking scripts that create intervals causing high CPU/GC
   */
  private clearTimers(): void {
    // Get the highest timer ID by creating a new one
    const highestId = window.setInterval(() => {}, 0);

    // Clear all intervals
    for (let i = 0; i <= highestId; i++) {
      window.clearInterval(i);
    }

    // Also clear timeouts (they share the same ID space in most browsers)
    const highestTimeoutId = window.setTimeout(() => {}, 0);
    for (let i = 0; i <= highestTimeoutId; i++) {
      window.clearTimeout(i);
    }
  }

  /**
   * Clean up suspicious scripts
   */
  cleanupScripts(): void {
    const suspiciousPatterns = [
      /(^|[\\/._-])(adservice|adserver|adsystem|adsbygoogle|pagead)([\\/._-]|$)/i,
      /(^|[\\/._-])ads([\\/._-]|$)/i,
      /doubleclick/i,
      /googlesyndication|googletagmanager|gtag/i,
      /google-analytics/i,
      /(^|[\\/._-])(analytics|track(er|ing)?|pixel|beacon|telemetry)([\\/._-]|$)/i,
    ];

    const siteHost = window.location.hostname;
    const isSameSite = (host: string): boolean => {
      return host === siteHost || host.endsWith(`.${siteHost}`);
    };

    document.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src') || '';
      let url: URL;
      try {
        url = new URL(src, window.location.href);
      } catch {
        return;
      }

      const target = `${url.hostname}${url.pathname}`;
      const isSuspicious = suspiciousPatterns.some(p => p.test(target));
      if (!isSuspicious) return;

      const isThirdParty = !isSameSite(url.hostname);
      const isHighConfidence =
        /(^|[\\/._-])(adservice|adserver|adsystem|adsbygoogle|pagead)([\\/._-]|$)/i.test(target);

      if (isThirdParty || isHighConfidence) {
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
