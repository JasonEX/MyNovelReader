import { JSDOM } from 'jsdom';

export function createDom(
  url: string = 'https://example.com/',
  html: string = '<!doctype html><html><head></head><body></body></html>'
): JSDOM {
  const dom = new JSDOM(html, { url, pretendToBeVisual: true });

  // @ts-expect-error - test env: assigning jsdom window to globalThis
  globalThis.window = dom.window;
  // @ts-expect-error - test env: assigning jsdom document to globalThis
  globalThis.document = dom.window.document;
  // @ts-expect-error - test env: assigning jsdom location to globalThis
  globalThis.location = dom.window.location;
  // @ts-expect-error - test env: assigning jsdom navigator to globalThis
  globalThis.navigator = dom.window.navigator;
  // @ts-expect-error - test env: assigning jsdom localStorage to globalThis
  globalThis.localStorage = dom.window.localStorage;
  // @ts-expect-error - test env: assigning jsdom sessionStorage to globalThis
  globalThis.sessionStorage = dom.window.sessionStorage;
  // @ts-expect-error - test env: assigning jsdom DOMParser to globalThis
  globalThis.DOMParser = dom.window.DOMParser;
  // @ts-expect-error - test env: assigning jsdom Node to globalThis
  globalThis.Node = dom.window.Node;
  // @ts-expect-error - test env: assigning jsdom HTMLElement to globalThis
  globalThis.HTMLElement = dom.window.HTMLElement;

  return dom;
}
