/**
 * Overlay cleanup helpers.
 */

export function removeOverlays(): void {
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
