import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  executeSelector,
  findBySelector,
  parseSelector,
} from '../../src/MyNovelReader/rule/selector';

interface MiniJQuery<T extends Element | Document = Element> {
  length: number;
  [index: number]: T;
  find: (selector: string) => MiniJQuery<Element>;
}

type QueryTarget = Document | Element | Array<Element | Document> | NodeListOf<Element>;

const createMiniJquery = () => {
  const build = (nodes: (Element | Document)[]): MiniJQuery => {
    const collection = {
      length: nodes.length,
      find(selector: string) {
        if (!this.length) {
          return build([]);
        }
        const context = this[0] as Element | Document;
        const results = Array.from((context as Document | Element).querySelectorAll(selector));
        return build(results);
      },
    } as MiniJQuery;

    nodes.forEach((node, index) => {
      (collection as unknown as Record<number, Element | Document>)[index] = node;
    });

    return collection;
  };

  const mini = (target: QueryTarget): MiniJQuery => {
    if (Array.isArray(target)) {
      return build(target);
    }

    if (target instanceof Document || target instanceof Element) {
      return build([target]);
    }

    return build(Array.from(target));
  };

  return mini;
};

const setupDom = (html: string) => {
  document.body.innerHTML = html;
  const jquery = createMiniJquery();
  vi.stubGlobal('$', jquery);
  return jquery(document) as unknown as JQuery<Document>;
};

afterEach(() => {
  vi.unstubAllGlobals?.();
  document.body.innerHTML = '';
});

describe('parseSelector', () => {
  it('parses string selectors as jquery type', () => {
    const parsed = parseSelector('.entry > a');
    expect(parsed).toEqual({ type: 'jquery', selector: '.entry > a' });
  });

  it('parses xpath prefix', () => {
    const parsed = parseSelector('xpath://div[@id="target"]');
    expect(parsed).toEqual({ type: 'xpath', selector: '//div[@id="target"]' });
  });

  it('parses tuple with string replace', () => {
    const parsed = parseSelector(['.title', 'foo']);
    expect(parsed).toEqual({ type: 'jquery', selector: '.title', replace: 'foo' });
  });

  it('parses tuple with regex replace', () => {
    const replace = /foo/gi;
    const parsed = parseSelector(['xpath://span', replace]);
    expect(parsed).toEqual({ type: 'xpath', selector: '//span', replace });
  });

  it('parses function selectors', () => {
    const handler = () => 'ok';
    const parsed = parseSelector(handler);
    expect(parsed).toEqual({ type: 'function', selector: handler });
  });

  it('returns null for disabled selectors', () => {
    expect(parseSelector(false)).toBeNull();
    expect(parseSelector(null)).toBeNull();
    expect(parseSelector(undefined)).toBeNull();
  });
});

describe('executeSelector', () => {
  it('executes jquery selectors', () => {
    const $doc = setupDom('<div><span class="hit">hello</span><span>other</span></div>');

    const result = executeSelector({ type: 'jquery', selector: '.hit' }, $doc);

    expect(result).not.toBeNull();
    const elements = result as unknown as MiniJQuery<Element>;
    expect(elements.length).toBe(1);
    expect(elements[0].textContent).toBe('hello');
  });

  it('executes XPath selectors', () => {
    const $doc = setupDom('<section><p id="target">text</p></section>');

    const result = executeSelector({ type: 'xpath', selector: '//p[@id="target"]' }, $doc);

    expect(result).not.toBeNull();
    const elements = result as unknown as MiniJQuery<Element>;
    expect(elements.length).toBe(1);
    expect(elements[0].id).toBe('target');
  });

  it('executes function selectors', () => {
    const $doc = setupDom('<div></div>');
    const handler = vi.fn(() => 'handled');

    const result = executeSelector({ type: 'function', selector: handler }, $doc);

    expect(handler).toHaveBeenCalledWith($doc);
    expect(result).toBe('handled');
  });

  it('returns null when no element matches', () => {
    const $doc = setupDom('<div class="other"></div>');

    const result = executeSelector({ type: 'jquery', selector: '.missing' }, $doc);

    expect(result).toBeNull();
  });
});

describe('findBySelector', () => {
  it('parses and executes selectors end-to-end', () => {
    const $doc = setupDom('<main><div data-id="target"></div></main>');

    const result = findBySelector('xpath://div[@data-id="target"]', $doc);

    expect(result).not.toBeNull();
    const elements = result as unknown as MiniJQuery<Element>;
    expect(elements.length).toBe(1);
    expect(elements[0].getAttribute('data-id')).toBe('target');
  });

  it('returns null when selector is disabled', () => {
    const $doc = setupDom('<div></div>');

    const result = findBySelector(false, $doc);

    expect(result).toBeNull();
  });
});
