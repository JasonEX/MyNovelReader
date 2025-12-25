import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeHtml, sanitizeUrl } from '@/core/utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

describe('sanitizeUrl', () => {
  it('allows http/https', () => {
    expect(sanitizeUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
    expect(sanitizeUrl('http://example.com/a.png')).toBe('http://example.com/a.png');
  });

  it('allows protocol-relative and relative URLs', () => {
    expect(sanitizeUrl('//cdn.example.com/a.jpg')).toBe('//cdn.example.com/a.jpg');
    expect(sanitizeUrl('/images/a.jpg')).toBe('/images/a.jpg');
    expect(sanitizeUrl('./images/a.jpg')).toBe('./images/a.jpg');
    expect(sanitizeUrl('../images/a.jpg')).toBe('../images/a.jpg');
    expect(sanitizeUrl('images/a.jpg')).toBe('images/a.jpg');
  });

  it('blocks data: by default but allows safe raster data images when opted-in', () => {
    const raster = 'data:image/png;base64,AA==';
    expect(sanitizeUrl(raster)).toBe('');
    expect(sanitizeUrl(raster, { allowDataImage: true })).toBe(raster);

    const svg = 'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+';
    expect(sanitizeUrl(svg, { allowDataImage: true })).toBe('');

    const html = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==';
    expect(sanitizeUrl(html, { allowDataImage: true })).toBe('');
  });

  it('allows common non-scriptable schemes in relaxed mode', () => {
    expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
    expect(sanitizeUrl('blob:https://example.com/abc')).toBe('blob:https://example.com/abc');
    expect(sanitizeUrl('ftp://example.com/file.zip')).toBe('ftp://example.com/file.zip');
    expect(sanitizeUrl('about:blank')).toBe('');
  });

  it('blocks non-http schemes in strict mode', () => {
    expect(sanitizeUrl('mailto:test@example.com', { mode: 'strict' })).toBe('');
    expect(sanitizeUrl('blob:https://example.com/abc', { mode: 'strict' })).toBe('');
    expect(sanitizeUrl('ftp://example.com/file.zip', { mode: 'strict' })).toBe('');
  });
});

describe('sanitizeHtml (basicSanitize fallback)', () => {
  let doc: Document;

  beforeEach(() => {
    vi.stubGlobal('window', undefined);
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    doc = dom.window.document;
    globalThis.document = doc;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('preserves safe raster data images in img src', () => {
    const html = '<p>t</p><img src="data:image/png;base64,AA==" alt="a" />';
    const result = sanitizeHtml(html);
    expect(result).toContain('src="data:image/png;base64,AA=="');
  });

  it('removes data: URLs from href', () => {
    const html = '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">x</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('href="data:');
    expect(result).toContain('<a');
  });

  it('removes non-raster data images (e.g. svg) from img src', () => {
    const html = '<img src="data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+" />';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('data:image/svg+xml');
  });

  it('strips inline style attributes (fallback is intentionally strict)', () => {
    const html = '<p style="background-image:url(\'javascript:alert(1)\');color:red">x</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('style=');
    expect(result).toContain('>x<');
  });

  it('unwraps <form> but preserves its content', () => {
    const html = '<form action="/submit"><p>Form content</p></form>';
    const result = sanitizeHtml(html);
    expect(result).toContain('Form content');
    expect(result).not.toContain('<form');
  });

  it('removes event handlers and dangerous href/src protocols', () => {
    const html =
      '<a href="javascript:alert(1)" onclick="evil()">x</a>' +
      '<img src="vbscript:msgbox(1)" onerror="evil()" />';

    const result = sanitizeHtml(html);

    expect(result).not.toContain('onclick=');
    expect(result).not.toContain('onerror=');
    expect(result).not.toContain('href="javascript:');
    expect(result).not.toContain('src="vbscript:');
  });
});

describe('sanitizeHtml (DOMPurify path)', () => {
  it('removes unsafe data:image SVG sources from img via hook', () => {
    const svg = 'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+';
    const html = `<img src="${svg}" />`;
    const result = sanitizeHtml(html);
    expect(result).not.toContain('data:image/svg+xml');
  });

  it('falls back to basicSanitize when DOMPurify throws', () => {
    const spy = vi.spyOn(DOMPurify, 'sanitize').mockImplementation(() => {
      throw new Error('boom');
    });

    const html = '<p>ok</p><script>alert(1)</script>';
    const result = sanitizeHtml(html);

    expect(result).toContain('<p>ok</p>');
    expect(result).not.toContain('<script>');

    spy.mockRestore();
  });

  it('pre-sanitizes SVG content by stripping on* handlers', () => {
    const html = '<svg onload="alert(1)"><circle></circle></svg>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onload=');
    expect(result).toContain('<svg');
  });
});
