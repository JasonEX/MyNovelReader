/**
 * HTML sanitization utilities
 *
 * Uses DOMPurify when available, with an enhanced security-focused fallback.
 * Provides protection against XSS, SVG-based attacks, and other content security risks.
 */

import DOMPurify, { type Config } from 'dompurify';

const SAFE_DATA_ATTR = [
  'data-src',
  'data-original',
  'data-lazy-src',
  'data-original-src',
  'data-srcset',
  'data-url',
  'data-actualsrc',
  'data-echo',
];

/**
 * Enhanced security configuration for DOMPurify
 * - Strict attribute and tag filtering
 * - SVG-specific security measures
 * - Protection against common XSS vectors
 */
const ENHANCED_CONFIG: Config = {
  USE_PROFILES: { html: true },
  // Allow `data:` URIs for <img> so base64 chapter images can render.
  ADD_DATA_URI_TAGS: ['img'],
  // Only allow specific, safe data attributes (not all)
  ADD_ATTR: SAFE_DATA_ATTR,
  // Disable generic data attributes to prevent data-based attacks
  ALLOW_DATA_ATTR: false,
  // Forbid dangerous tags
  FORBID_TAGS: [
    'script',
    'iframe',
    'object',
    'embed',
    'link',
    'meta',
    'style',
    'form',
    'input',
    'button',
  ],
  // Forbid dangerous event handlers and protocols
  FORBID_ATTR: [
    'onload',
    'onclick',
    'onerror',
    'onmouseover',
    'onfocus',
    'onmouseenter',
    'onmouseleave',
    'onkeydown',
    'onkeyup',
    'onkeypress',
    'onmousedown',
    'onmouseup',
    'onmousemove',
    'ontouchstart',
    'ontouchend',
    'onfocusin',
    'onfocusout',
    'onblur',
    'onscroll',
    'onresize',
    'onsubmit',
    'onreset',
    'onchange',
    'oninput',
  ],
  // Enable DOM sanitization
  SANITIZE_DOM: true,
  // Keep text/content when removing forbidden tags (e.g., unwrap <form> but keep inner text).
  KEEP_CONTENT: true,
  // Safe for template usage
  SAFE_FOR_TEMPLATES: true,
  // Allow only safe SVG elements
  ALLOWED_TAGS: [
    // Safe HTML tags
    'p',
    'br',
    'hr',
    'div',
    'span',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'ul',
    'ol',
    'li',
    'blockquote',
    'pre',
    'code',
    'a',
    'img',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'sub',
    'sup',
    'small',
    'big',
    // Safe SVG elements (for images/icons only)
    'svg',
    'g',
    'path',
    'circle',
    'rect',
    'line',
    'polygon',
    'text',
    'tspan',
    'textPath',
    'use',
    'symbol',
    'defs',
  ],
  // Allow safe attributes only
  ALLOWED_ATTR: [
    'href',
    'title',
    'alt',
    'src',
    'width',
    'height',
    'class',
    'id',
    'style',
    'dir',
    ...SAFE_DATA_ATTR,
    'rowspan',
    'colspan',
    'viewBox',
    'xmlns',
    'fill',
    'stroke',
    'd',
    'cx',
    'cy',
    'r',
    'x',
    'y',
    'width',
    'height', // SVG attributes
  ],
};

const DEFAULT_CONFIG: Config = ENHANCED_CONFIG;

let domPurifyHooksInstalled = false;

/**
 * Sanitize SVG content specifically to remove embedded scripts and event handlers
 * This provides an additional layer of security for SVG content
 */
function sanitizeSvgContent(html: string): string {
  // Remove dangerous event handlers from SVG tags
  return (
    html
      .replace(/<svg[^>]*>/gi, match => {
        // Remove all 'on*' event handlers from SVG opening tag
        return match.replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]*)/gi, '');
      })
      // Remove script tags (including those inside SVG)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove vbscript: protocol
      .replace(/vbscript:/gi, '')
      // Remove data: protocol in href (can be used for XSS/phishing)
      .replace(/\s+href\s*=\s*["']\s*data:[^"']*["']/gi, '')
      // Remove expression() in CSS (IE XSS vector)
      .replace(/expression\([^)]*\)/gi, '')
  );
}

/**
 * Basic HTML sanitization fallback
 * Used when DOMPurify is not available
 */
function basicSanitize(html: string): string {
  if (typeof document === 'undefined') return html;

  // First apply SVG-specific sanitization
  html = sanitizeSvgContent(html);

  const container = document.createElement('div');
  container.innerHTML = html;

  // Remove high-risk elements
  const blockedTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'link',
    'meta',
    'style',
    'input',
    'button',
    'textarea',
    'select',
  ];
  blockedTags.forEach(tag => {
    container.querySelectorAll(tag).forEach(el => el.remove());
  });

  // Unwrap <form> to keep its content while removing the form element itself.
  container.querySelectorAll('form').forEach(form => {
    const parent = form.parentNode;
    if (!parent) {
      form.remove();
      return;
    }
    while (form.firstChild) {
      parent.insertBefore(form.firstChild, form);
    }
    form.remove();
  });

  // Strip event handlers and dangerous protocols
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    const attrsToRemove: string[] = [];

    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      // Remove all event handlers
      if (name.startsWith('on')) {
        attrsToRemove.push(attr.name);
        continue;
      }

      // Remove dangerous protocols
      if (name === 'href') {
        if (
          value.startsWith('javascript:') ||
          value.startsWith('vbscript:') ||
          value.startsWith('data:')
        ) {
          attrsToRemove.push(attr.name);
          continue;
        }
      }

      if (name === 'src') {
        if (value.startsWith('javascript:') || value.startsWith('vbscript:')) {
          attrsToRemove.push(attr.name);
          continue;
        }

        if (value.startsWith('data:')) {
          const tag = el.tagName.toLowerCase();
          if (tag !== 'img' || !isSafeDataImageUrl(attr.value)) {
            attrsToRemove.push(attr.name);
            continue;
          }
        }
      }

      // Inline CSS is hard to sanitize correctly without a full CSS parser/sanitizer.
      // The fallback intentionally strips `style` attributes entirely (DOMPurify handles CSS sanitization
      // when available).
      if (name === 'style') {
        attrsToRemove.push(attr.name);
        continue;
      }
    }

    // Remove marked attributes
    attrsToRemove.forEach(attrName => el.removeAttribute(attrName));
  }

  return container.innerHTML;
}

/**
 * Main sanitization function
 * Applies enhanced security measures to HTML content
 *
 * @param html - The HTML string to sanitize
 * @param config - Optional DOMPurify configuration (defaults to ENHANCED_CONFIG)
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string, config: Config = DEFAULT_CONFIG): string {
  if (!html) return html;

  try {
    // Apply SVG-specific pre-sanitization
    html = sanitizeSvgContent(html);

    // Use DOMPurify if available
    if (typeof window === 'undefined' || typeof DOMPurify?.sanitize !== 'function') {
      return basicSanitize(html);
    }

    if (!domPurifyHooksInstalled && typeof DOMPurify?.addHook === 'function') {
      DOMPurify.addHook('afterSanitizeAttributes', (node: unknown) => {
        const el = node as Element | null;
        if (!el || (el as unknown as { nodeType?: number }).nodeType !== 1) return;
        if (el.tagName.toLowerCase() !== 'img') return;

        const src = el.getAttribute('src');
        if (!src || !src.trim().toLowerCase().startsWith('data:')) return;
        if (!isSafeDataImageUrl(src)) {
          el.removeAttribute('src');
        }
      });
      domPurifyHooksInstalled = true;
    }

    return DOMPurify.sanitize(html, config) as string;
  } catch {
    // Fallback to basic sanitization on error
    return basicSanitize(html);
  }
}

const SAFE_DATA_IMAGE_MIME_TYPES = new Set([
  'image/apng',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

function isSafeDataImageUrl(url: string): boolean {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (!lower.startsWith('data:image/')) return false;

  const commaIndex = trimmed.indexOf(',');
  if (commaIndex === -1) return false;

  const meta = lower.slice('data:'.length, commaIndex);
  const mime = meta.split(';')[0] || '';
  if (!SAFE_DATA_IMAGE_MIME_TYPES.has(mime)) return false;

  // Require base64 encoding to keep parsing simple/robust (and avoid SVG tricks)
  if (!meta.includes(';base64')) return false;

  return true;
}

export interface SanitizeUrlOptions {
  /**
   * Allow safe `data:image/*` URLs.
   * Only raster images are allowed (no SVG).
   */
  allowDataImage?: boolean;
  /**
   * URL policy mode.
   * - `relaxed`: allow common non-scriptable schemes (e.g. `mailto:`) in addition to http/https/relative.
   * - `strict`: only allow http/https/relative (and safe `data:image/*` when opted-in).
   */
  mode?: 'relaxed' | 'strict';
}

/**
 * Sanitize a URL for use in href/src attributes
 * Provides additional validation for URLs
 *
 * @param url - The URL to sanitize
 * @param options - Optional options for specific contexts (e.g. images)
 * @returns Sanitized URL or empty string if unsafe
 */
export function sanitizeUrl(url: string, options: SanitizeUrlOptions = {}): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (options.allowDataImage && isSafeDataImageUrl(trimmed)) {
    return trimmed;
  }

  // Always block scriptable/dangerous protocols
  const blockedProtocols = ['javascript:', 'vbscript:', 'data:', 'file:'];
  if (blockedProtocols.some(protocol => lower.startsWith(protocol))) {
    return '';
  }

  // Allow http, https, and relative URLs (incl. protocol-relative //)
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    return trimmed;
  }

  if (lower.startsWith('//')) {
    return trimmed;
  }

  const hasExplicitScheme = /^[a-z][a-z0-9+.-]*:/i.test(lower);
  if (hasExplicitScheme) {
    const mode = options.mode ?? 'relaxed';
    if (mode === 'strict') return '';

    // Relaxed: allow common non-scriptable schemes for in-content links.
    const allowedProtocols = ['mailto:', 'tel:', 'blob:', 'ftp:'];
    if (allowedProtocols.some(protocol => lower.startsWith(protocol))) {
      return trimmed;
    }

    return '';
  }

  // Relative URL (including plain `img.jpg`, `/img.jpg`, `./img.jpg`, etc.)
  return trimmed;
}
