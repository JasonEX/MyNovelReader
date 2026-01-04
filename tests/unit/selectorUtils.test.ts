import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { generateCssSelector } from '@/core/utils/selectorUtils';

describe('generateCssSelector', () => {
  let dom: JSDOM;
  let doc: Document;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });
    doc = dom.window.document;

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = doc;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('prefers #id when present', () => {
    doc.body.innerHTML = '<div id="content"></div>';
    const el = doc.querySelector('#content')!;
    expect(generateCssSelector(el)).toBe('#content');
  });

  it('uses a unique .class when possible', () => {
    doc.body.innerHTML = '<div class="unique"></div><div class="other"></div>';
    const el = doc.querySelector('.unique')!;
    expect(generateCssSelector(el)).toBe('.unique');
  });

  it('can combine classes when single classes are not unique', () => {
    doc.body.innerHTML = `
      <div class="a b"></div>
      <div class="a"></div>
      <div class="b"></div>
    `;
    const el = doc.querySelector('div.a.b')!;
    expect(generateCssSelector(el, { allowClassCombination: true })).toBe('.a.b');
  });

  it('falls back to a stable-ish path selector with :nth-of-type', () => {
    doc.body.innerHTML = `
      <div>
        <p>one</p>
        <p>two</p>
      </div>
    `;
    const el = doc.querySelectorAll('p')[1]!;
    expect(generateCssSelector(el)).toBe('div > p:nth-of-type(2)');
  });

  it('falls back to tag name when no document is available', () => {
    vi.stubGlobal('document', undefined);
    const el = { tagName: 'DIV', ownerDocument: undefined } as unknown as Element;
    expect(generateCssSelector(el)).toBe('div');
  });
});
