/**
 * SiteProtection - Protect against common anti-user techniques on novel sites.
 *
 * This class is the lifecycle/orchestration shell. The heavier protection
 * routines live in focused modules under this directory.
 */

import { enableCopy, enableRightClick, enableSelection, unlockKeyboard } from './selection';
import {
  getEffectiveProtectionOptions,
  isCloudflareChallenge,
  type ProtectionOptions,
  withDefaultProtectionOptions,
} from './options';
import { blockPopups } from './popup';
import { blockRedirects } from './redirect';
import { clearAllTimers } from './timers';
import { removeOverlays as removePageOverlays } from './overlay';

export { isCloudflareChallenge };
export type { ProtectionOptions };

export class SiteProtection {
  private options: ProtectionOptions;
  private cleanupFunctions: (() => void)[] = [];
  private isActive = false;

  constructor(options: ProtectionOptions = {}) {
    this.options = withDefaultProtectionOptions(options);
  }

  /**
   * Activate all protection measures.
   */
  activate(options?: ProtectionOptions): void {
    if (options) {
      this.options = withDefaultProtectionOptions(options);
    }

    // If already active and options are provided, re-apply with new options.
    // This allows us to activate early with safe defaults (e.g. document-start),
    // then reconfigure after user settings are loaded.
    if (this.isActive) {
      if (!options) return;
      this.deactivate();
    }
    this.isActive = true;

    const effectiveOptions = getEffectiveProtectionOptions(this.options);

    // Clear timers first to reduce CPU usage from tracking scripts.
    if (effectiveOptions.clearTimers) {
      clearAllTimers();
    }

    if (effectiveOptions.blockRedirects) {
      this.cleanupFunctions.push(
        blockRedirects({ cleanupScripts: !!effectiveOptions.cleanupScripts })
      );
    }

    if (effectiveOptions.enableRightClick) {
      this.cleanupFunctions.push(enableRightClick());
    }

    if (effectiveOptions.enableSelection) {
      this.cleanupFunctions.push(enableSelection());
    }

    if (effectiveOptions.enableCopy) {
      this.cleanupFunctions.push(enableCopy());
    }

    if (effectiveOptions.unlockKeyboard) {
      this.cleanupFunctions.push(unlockKeyboard());
    }

    if (effectiveOptions.blockPopups) {
      this.cleanupFunctions.push(blockPopups());
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
   * Deactivate all protection measures.
   */
  deactivate(): void {
    if (!this.isActive) return;

    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    this.isActive = false;
  }

  /**
   * Remove all annoying overlays (ad overlays, modal blockers).
   */
  removeOverlays(): void {
    removePageOverlays();
  }

  /**
   * Clean up suspicious scripts.
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

  /**
   * Remove event hijacking (click interception, etc.).
   */
  private removeEventHijacking(): void {
    // Block click hijacking on document/body.
    const clickBlocker = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // If clicking on a legitimate link/button, allow it.
      const clickableParent = target.closest('a, button, [role="button"]');
      if (clickableParent) {
        // Check if the link is being hijacked.
        if (clickableParent instanceof HTMLAnchorElement) {
          const href = clickableParent.getAttribute('href');
          // Allow normal links, block javascript: or suspicious hrefs.
          if (href && !href.startsWith('javascript:') && href !== '#') {
            return true;
          }
        }
      }

      // Stop propagation if this click might be hijacked.
      if (e.target === document.body || e.target === document.documentElement) {
        e.stopPropagation();
      }
    };

    document.addEventListener('click', clickBlocker, true);

    // Remove onclick from body/html.
    if (document.body) {
      document.body.onclick = null;
    }
    document.documentElement.onclick = null;

    // Block mousedown/mouseup hijacking.
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
   * Block visibility change detection (prevents pausing/ads on tab switch).
   */
  private blockVisibilityDetection(): void {
    // Save original descriptors before overwriting.
    // Check the instance (document) first, then fall back to the prototype (Document.prototype).
    const docProto = Object.getPrototypeOf(document) as object | null;

    const savedHidden: {
      descriptor: PropertyDescriptor | undefined;
      owner: 'instance' | 'prototype' | 'none';
    } = (() => {
      const ownDesc = Object.getOwnPropertyDescriptor(document, 'hidden');
      if (ownDesc) return { descriptor: ownDesc, owner: 'instance' as const };
      if (docProto) {
        const protoDesc = Object.getOwnPropertyDescriptor(docProto, 'hidden');
        if (protoDesc) return { descriptor: protoDesc, owner: 'prototype' as const };
      }
      return { descriptor: undefined, owner: 'none' as const };
    })();

    const savedVisibilityState: {
      descriptor: PropertyDescriptor | undefined;
      owner: 'instance' | 'prototype' | 'none';
    } = (() => {
      const ownDesc = Object.getOwnPropertyDescriptor(document, 'visibilityState');
      if (ownDesc) return { descriptor: ownDesc, owner: 'instance' as const };
      if (docProto) {
        const protoDesc = Object.getOwnPropertyDescriptor(docProto, 'visibilityState');
        if (protoDesc) return { descriptor: protoDesc, owner: 'prototype' as const };
      }
      return { descriptor: undefined, owner: 'none' as const };
    })();

    // Override visibility state.
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    // Block visibility change events.
    const visibilityBlocker = (e: Event) => {
      e.stopImmediatePropagation();
    };

    document.addEventListener('visibilitychange', visibilityBlocker, true);

    // Block blur/focus detection on window.
    const blurBlocker = (e: Event) => {
      if (e.target === window || e.target === document) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('blur', blurBlocker, true);
    window.addEventListener('focus', blurBlocker, true);

    const restoreDescriptor = (
      prop: string,
      saved: { descriptor: PropertyDescriptor | undefined; owner: string }
    ) => {
      try {
        if (saved.owner === 'instance' && saved.descriptor) {
          Object.defineProperty(document, prop, saved.descriptor);
        } else {
          // Was on prototype or didn't exist: delete the own property so the
          // prototype value (if any) shows through again.
          delete (document as unknown as Record<string, unknown>)[prop];
        }
      } catch {
        // Property may be non-configurable in some environments; swallow the error.
      }
    };

    this.cleanupFunctions.push(() => {
      document.removeEventListener('visibilitychange', visibilityBlocker, true);
      window.removeEventListener('blur', blurBlocker, true);
      window.removeEventListener('focus', blurBlocker, true);

      restoreDescriptor('hidden', savedHidden);
      restoreDescriptor('visibilityState', savedVisibilityState);
    });
  }
}

// Singleton instance
let protectionInstance: SiteProtection | null = null;

/**
 * Get the singleton SiteProtection instance.
 */
export function getSiteProtection(): SiteProtection {
  if (!protectionInstance) {
    protectionInstance = new SiteProtection();
  }
  return protectionInstance;
}
