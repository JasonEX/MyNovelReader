/// <reference types="jquery" />

export interface DomService {
  $<TElement extends Element = HTMLElement>(
    _selector: JQuery.Selector | TElement | ArrayLike<TElement>,
    _context?: Element | Document | JQuery
  ): JQuery<TElement>;
  createElement<K extends keyof HTMLElementTagNameMap>(_tagName: K): HTMLElementTagNameMap[K];
  querySelector(_selector: string, _root?: Document | HTMLElement): Element | null;
  querySelectorAll(_selector: string, _root?: Document | HTMLElement): NodeListOf<Element>;
}

export class DefaultDomService implements DomService {
  private jquery: JQueryStatic | undefined;

  constructor(jqueryInstance?: JQueryStatic) {
    this.jquery = jqueryInstance ?? (typeof $ !== 'undefined' ? ($ as JQueryStatic) : undefined);
  }

  $<TElement extends Element = HTMLElement>(
    selector: JQuery.Selector | TElement | ArrayLike<TElement>,
    context?: Element | Document | JQuery
  ): JQuery<TElement> {
    if (!this.jquery) {
      throw new Error('jQuery is not available');
    }

    return this.jquery(selector as never, context as never) as unknown as JQuery<TElement>;
  }

  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K] {
    return document.createElement(tagName);
  }

  querySelector(selector: string, root?: Document | HTMLElement): Element | null {
    return (root ?? document).querySelector(selector);
  }

  querySelectorAll(selector: string, root?: Document | HTMLElement): NodeListOf<Element> {
    return (root ?? document).querySelectorAll(selector);
  }
}
