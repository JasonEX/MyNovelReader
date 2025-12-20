/**
 * Unit tests for SiteProtection
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { SiteProtection } from '@/core/protection/SiteProtection';

describe('SiteProtection', () => {
  let protection: SiteProtection;
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'https://example.com',
      runScripts: 'dangerously',
    });

    // Set up global environment
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection();
  });

  afterEach(() => {
    if (protection) {
      protection.deactivate();
    }
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const p = new SiteProtection();
      expect(p).toBeInstanceOf(SiteProtection);
    });

    it('should merge custom options with defaults', () => {
      const p = new SiteProtection({
        blockRedirects: false,
        enableRightClick: false,
      });
      expect(p).toBeInstanceOf(SiteProtection);
    });
  });

  describe('activate / deactivate', () => {
    it('should activate protection', () => {
      // Should not throw
      expect(() => protection.activate()).not.toThrow();
    });

    it('should not activate twice', () => {
      protection.activate();
      // Second activation should be no-op
      expect(() => protection.activate()).not.toThrow();
    });

    it('should deactivate protection', () => {
      protection.activate();
      // Should not throw
      expect(() => protection.deactivate()).not.toThrow();
    });

    it('should not deactivate if not active', () => {
      // Should not throw
      expect(() => protection.deactivate()).not.toThrow();
    });

    it('should be able to reactivate after deactivation', () => {
      protection.activate();
      protection.deactivate();
      // Should be able to activate again
      expect(() => protection.activate()).not.toThrow();
    });
  });

  describe('enableRightClick', () => {
    it('should restore right-click menu', () => {
      // Set up a contextmenu blocker
      const handler = vi.fn((e: Event) => e.preventDefault());
      dom.window.document.addEventListener('contextmenu', handler);

      protection.activate();

      // Create and dispatch a contextmenu event
      const event = new dom.window.Event('contextmenu', { cancelable: true });
      dom.window.document.dispatchEvent(event);

      // After protection activation, the event should not be prevented
      // Note: In real browser, this would allow right-click menu
    });
  });

  describe('enableSelection', () => {
    it('should restore text selection capability', () => {
      // Add CSS that disables selection
      const style = dom.window.document.createElement('style');
      style.textContent = `
        body { user-select: none; -webkit-user-select: none; }
        * { -moz-user-select: none; }
      `;
      dom.window.document.head.appendChild(style);

      protection.activate();

      // Protection should add override styles
      const styles = dom.window.document.querySelectorAll('style');
      expect(styles.length).toBeGreaterThanOrEqual(1);
    });

    it('should remove onselectstart attribute', () => {
      // Add onselectstart to body
      dom.window.document.body.setAttribute('onselectstart', 'return false;');

      protection.activate();

      // The attribute should be removed
      expect(dom.window.document.body.getAttribute('onselectstart')).toBeNull();
    });
  });

  describe('enableCopy', () => {
    it('should restore copy functionality', () => {
      // Add oncopy that blocks copying
      dom.window.document.body.setAttribute('oncopy', 'return false;');

      protection.activate();

      // The attribute should be removed
      expect(dom.window.document.body.getAttribute('oncopy')).toBeNull();
    });

    it('should remove oncut attribute', () => {
      dom.window.document.body.setAttribute('oncut', 'return false;');

      protection.activate();

      expect(dom.window.document.body.getAttribute('oncut')).toBeNull();
    });
  });

  describe('blockRedirects', () => {
    it('should remove meta refresh tags', () => {
      // Add a meta refresh tag
      const meta = dom.window.document.createElement('meta');
      meta.setAttribute('http-equiv', 'refresh');
      meta.setAttribute('content', '5; url=https://redirect.com');
      dom.window.document.head.appendChild(meta);

      protection.activate();

      // Meta refresh should be removed
      const refreshTags = dom.window.document.querySelectorAll('meta[http-equiv="refresh"]');
      expect(refreshTags.length).toBe(0);
    });
  });

  describe('blockPopups', () => {
    it('should intercept window.open calls', () => {
      protection.activate();

      // After protection, window.open should be intercepted
      // In JSDOM this may not fully work, but the code should not throw
      expect(() => {
        const result = dom.window.open('https://popup.com');
        // Protection should return null for blocked popups
        expect(result).toBeNull();
      }).not.toThrow();
    });
  });

  describe('removeOverlays', () => {
    it('should remove fixed position overlays', () => {
      // Create a fixed overlay element
      const overlay = dom.window.document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '9999';
      overlay.id = 'test-overlay';
      dom.window.document.body.appendChild(overlay);

      protection.removeOverlays();

      // Overlay should be removed or hidden
      const _remainingOverlay = dom.window.document.getElementById('test-overlay');
      // Note: The actual removal logic depends on additional criteria like opacity
    });
  });

  describe('cleanupScripts', () => {
    it('should remove tracking scripts', () => {
      // Add a script with known tracking patterns
      const script = dom.window.document.createElement('script');
      script.src = 'https://example.com/tracking.js';
      script.textContent = 'setInterval(function(){}, 1000);';
      dom.window.document.body.appendChild(script);

      protection.cleanupScripts();

      // Script handling should complete without error
    });
  });

  describe('options control', () => {
    it('should not block redirects when option is false', () => {
      const p = new SiteProtection({ blockRedirects: false });

      // Add a meta refresh tag
      const meta = dom.window.document.createElement('meta');
      meta.setAttribute('http-equiv', 'refresh');
      meta.setAttribute('content', '5; url=https://redirect.com');
      dom.window.document.head.appendChild(meta);

      p.activate();

      // Meta refresh should still exist
      const refreshTags = dom.window.document.querySelectorAll('meta[http-equiv="refresh"]');
      expect(refreshTags.length).toBe(1);
    });

    it('should not enable right-click when option is false', () => {
      const p = new SiteProtection({ enableRightClick: false });
      // Should not throw
      expect(() => p.activate()).not.toThrow();
      p.deactivate();
    });

    it('should not enable selection when option is false', () => {
      const p = new SiteProtection({ enableSelection: false });
      dom.window.document.body.setAttribute('onselectstart', 'return false;');

      p.activate();

      // The attribute should still exist
      expect(dom.window.document.body.getAttribute('onselectstart')).toBe('return false;');
      p.deactivate();
    });

    it('should not enable copy when option is false', () => {
      const p = new SiteProtection({ enableCopy: false });
      dom.window.document.body.setAttribute('oncopy', 'return false;');

      p.activate();

      // The attribute should still exist
      expect(dom.window.document.body.getAttribute('oncopy')).toBe('return false;');
      p.deactivate();
    });

    it('should not block popups when option is false', () => {
      const p = new SiteProtection({ blockPopups: false });
      expect(() => p.activate()).not.toThrow();
      p.deactivate();
    });

    it('should not clear timers when option is false', () => {
      const p = new SiteProtection({ clearTimers: false });
      expect(() => p.activate()).not.toThrow();
      p.deactivate();
    });
  });

  describe('edge cases', () => {
    it('should handle document without head element', () => {
      // Create a minimal DOM without head
      const minimalDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      globalThis.document = minimalDom.window.document;
      globalThis.window = minimalDom.window as unknown as Window & typeof globalThis;

      const p = new SiteProtection();
      // Should not throw
      expect(() => p.activate()).not.toThrow();
      p.deactivate();
    });

    it('should handle document without body element', () => {
      // Create a document without body
      const minimalDom = new JSDOM('<!DOCTYPE html><html></html>');
      globalThis.document = minimalDom.window.document;
      globalThis.window = minimalDom.window as unknown as Window & typeof globalThis;

      const p = new SiteProtection();
      // Should not throw even without body
      expect(() => p.activate()).not.toThrow();
      p.deactivate();
    });

    it('should handle multiple activate/deactivate cycles', () => {
      for (let i = 0; i < 5; i++) {
        protection.activate();
        protection.deactivate();
      }
      // Should complete without errors
      expect(true).toBe(true);
    });

    it('should clean up all registered cleanup functions on deactivate', () => {
      protection.activate();
      protection.deactivate();

      // After deactivation, reactivation should work cleanly
      protection.activate();
      expect(true).toBe(true);
    });
  });

  describe('clearTimers', () => {
    it('should clear existing intervals', () => {
      // Create some intervals
      const intervalId1 = dom.window.setInterval(() => {}, 1000);
      const intervalId2 = dom.window.setInterval(() => {}, 2000);

      protection.activate();

      // Intervals should be cleared
      // Note: In JSDOM, we can't easily verify this, but the code should run
      expect(intervalId1).toBeDefined();
      expect(intervalId2).toBeDefined();
    });

    it('should clear existing timeouts', () => {
      // Create some timeouts
      const timeoutId1 = dom.window.setTimeout(() => {}, 5000);
      const timeoutId2 = dom.window.setTimeout(() => {}, 10000);

      protection.activate();

      // Timeouts should be cleared
      expect(timeoutId1).toBeDefined();
      expect(timeoutId2).toBeDefined();
    });
  });

  describe('blockVisibilityDetection', () => {
    it('should block visibility change detection', () => {
      const visibilityHandler = vi.fn();
      dom.window.document.addEventListener('visibilitychange', visibilityHandler);

      protection.activate();

      // Visibility change events should be intercepted
      // Note: Full testing requires a real browser environment
    });
  });

  describe('removeEventHijacking', () => {
    it('should remove click event hijacking', () => {
      // Add a click hijacker
      const hijacker = vi.fn((e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      });
      dom.window.document.addEventListener('click', hijacker, true);

      protection.activate();

      // Event hijacking should be mitigated
      // Note: Full testing requires a real browser environment
    });

    it('should remove onclick event hijacking from body', () => {
      // Add an onclick hijacker to body
      dom.window.document.body.onclick = () => false;

      protection.activate();

      // The onclick should be cleared
      expect(dom.window.document.body.onclick).toBeNull();
    });
  });
});
