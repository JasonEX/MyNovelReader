/**
 * HTML sanitization utilities
 *
 * Uses DOMPurify when available, with a minimal fallback.
 */

import DOMPurify, { type Config } from 'dompurify';

const DEFAULT_CONFIG: Config = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ['data-src', 'data-original', 'data-lazy-src', 'data-url'],
  ALLOW_DATA_ATTR: true,
};

function basicSanitize(html: string): string {
  if (typeof document === 'undefined') return html;

  const container = document.createElement('div');
  container.innerHTML = html;

  // Remove high-risk elements
  const blockedTags = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'style'];
  blockedTags.forEach(tag => {
    container.querySelectorAll(tag).forEach(el => el.remove());
  });

  // Strip event handlers and javascript: URLs
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        continue;
      }
      if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return container.innerHTML;
}

export function sanitizeHtml(html: string, config: Config = DEFAULT_CONFIG): string {
  if (!html) return html;

  try {
    if (typeof window === 'undefined' || typeof DOMPurify?.sanitize !== 'function') {
      return basicSanitize(html);
    }
    return DOMPurify.sanitize(html, config) as string;
  } catch {
    return basicSanitize(html);
  }
}
