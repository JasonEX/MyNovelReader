import type { LegacySelectorValue, ParsedSelector, SelectorHandler, SelectorType } from './types';

const XPATH_PREFIX = 'xpath:';

function normalizeSelector(selector: string): { type: SelectorType; selector: string } {
  if (selector.startsWith(XPATH_PREFIX)) {
    return { type: 'xpath', selector: selector.slice(XPATH_PREFIX.length) };
  }

  return { type: 'jquery', selector };
}

export function parseSelector<T>(
  value: LegacySelectorValue<T> | null | undefined
): ParsedSelector<T> | null {
  if (value === false || value == null) {
    return null;
  }

  if (typeof value === 'function') {
    return { type: 'function', selector: value as SelectorHandler<T> };
  }

  if (Array.isArray(value)) {
    const [selector, replace] = value;
    const normalized = normalizeSelector(selector);
    return { ...normalized, replace };
  }

  const normalized = normalizeSelector(value);
  return normalized;
}
