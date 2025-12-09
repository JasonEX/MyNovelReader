import { $x } from '../../utils/xpath';
import { parseSelector } from './SelectorResolver';
import type { LegacySelectorValue, ParsedSelector, SelectorHandler } from './types';

export function executeSelector<T>(
  parsed: ParsedSelector<T>,
  $doc: JQuery<Document>
): T | JQuery<HTMLElement> | null {
  if (parsed.type === 'function') {
    const handler = parsed.selector as SelectorHandler<T>;
    return handler($doc);
  }

  if (parsed.type === 'xpath') {
    const context = $doc[0] || document;
    const nodes = $x(parsed.selector as string, context);
    const elements = nodes.filter((node): node is HTMLElement => node instanceof HTMLElement);
    const $result = $(elements);
    return $result.length ? $result : null;
  }

  const $result = $doc.find(parsed.selector as string);
  return $result.length ? $result : null;
}

export function findBySelector<T>(
  selector: LegacySelectorValue<T>,
  $doc: JQuery<Document>
): T | JQuery<HTMLElement> | null {
  const parsed = parseSelector(selector);
  if (!parsed) {
    return null;
  }

  return executeSelector(parsed, $doc);
}
