import { JSDOM } from 'jsdom';
import { vi } from 'vitest';

export function createDom(
  url: string = 'https://example.com/',
  html: string = '<!doctype html><html><head></head><body></body></html>'
): JSDOM {
  const dom = new JSDOM(html, { url, pretendToBeVisual: true });

  vi.stubGlobal('window', dom.window);
  vi.stubGlobal('document', dom.window.document);
  vi.stubGlobal('location', dom.window.location);
  vi.stubGlobal('navigator', dom.window.navigator);
  vi.stubGlobal('localStorage', dom.window.localStorage);
  vi.stubGlobal('sessionStorage', dom.window.sessionStorage);
  vi.stubGlobal('DOMParser', dom.window.DOMParser);
  vi.stubGlobal('Node', dom.window.Node);
  vi.stubGlobal('HTMLElement', dom.window.HTMLElement);

  return dom;
}
