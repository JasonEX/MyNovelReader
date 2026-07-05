/**
 * DOM selector utilities
 *
 * Shared helper to generate reasonably stable CSS selectors for detected/picked elements.
 */

import { cssEscape } from './cssEscape';

export interface GenerateCssSelectorOptions {
  /** Document used for uniqueness checks (defaults to element.ownerDocument). */
  doc?: Document;
  /** Maximum number of path segments (defaults to unlimited). */
  maxDepth?: number;
  /** Try combining classes (e.g. `.a.b`) when single classes are not unique. */
  allowClassCombination?: boolean;
  /** Max classes to include in the combination selector. */
  maxClassCombination?: number;
}

function isUniqueSelector(doc: Document, selector: string): boolean {
  try {
    return doc.querySelectorAll(selector).length === 1;
  } catch {
    return false;
  }
}

function buildPathSelector(element: Element, doc: Document, maxDepth: number): string {
  const path: string[] = [];
  let current: Element | null = element;

  while (
    current &&
    current !== doc.body &&
    current !== doc.documentElement &&
    path.length < maxDepth
  ) {
    let segment = current.tagName.toLowerCase();

    const id = (current as HTMLElement).id;
    if (id) {
      segment = `#${cssEscape(id)}`;
      path.unshift(segment);
      break;
    }

    const parent: Element | null = current.parentElement;
    if (parent) {
      const tagName = current.tagName;
      let index = 1;
      let hasSameType = false;

      for (
        let sibling = current.previousElementSibling;
        sibling;
        sibling = sibling.previousElementSibling
      ) {
        if (sibling.tagName !== tagName) continue;
        index++;
        hasSameType = true;
      }

      for (
        let sibling = current.nextElementSibling;
        !hasSameType && sibling;
        sibling = sibling.nextElementSibling
      ) {
        if (sibling.tagName === tagName) hasSameType = true;
      }

      if (hasSameType) {
        segment += `:nth-of-type(${index})`;
      }
    }

    path.unshift(segment);
    current = parent;
  }

  return path.join(' > ');
}

/**
 * Generate a CSS selector for an element.
 *
 * Heuristics:
 * 1) `#id`
 * 2) unique `.class`
 * 3) unique `.a.b.c` (optional)
 * 4) path selector using `:nth-of-type`
 */
export function generateCssSelector(
  element: Element,
  options: GenerateCssSelectorOptions = {}
): string {
  const doc =
    options.doc ||
    element.ownerDocument ||
    (typeof document !== 'undefined' ? document : undefined);
  if (!doc) {
    return element.tagName.toLowerCase();
  }

  const maxDepth = Math.max(1, options.maxDepth ?? Number.POSITIVE_INFINITY);

  const id = (element as HTMLElement).id;
  if (id) {
    return `#${cssEscape(id)}`;
  }

  const classes = Array.from(element.classList || []).filter(Boolean);
  for (const cls of classes) {
    const selector = `.${cssEscape(cls)}`;
    if (isUniqueSelector(doc, selector)) {
      return selector;
    }
  }

  if (options.allowClassCombination && classes.length >= 2) {
    const maxClasses = Math.max(2, options.maxClassCombination ?? 3);
    const selector = classes
      .slice(0, Math.min(maxClasses, classes.length))
      .map(cls => `.${cssEscape(cls)}`)
      .join('');
    if (isUniqueSelector(doc, selector)) {
      return selector;
    }
  }

  const path = buildPathSelector(element, doc, maxDepth);
  return path || element.tagName.toLowerCase();
}
