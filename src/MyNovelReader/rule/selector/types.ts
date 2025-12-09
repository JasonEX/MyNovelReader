// Supports CSS/jQuery selectors, XPath, and function handlers.
export type SelectorType = 'jquery' | 'xpath' | 'function';

export type SelectorTuple = [string, (string | RegExp)?];

export type SelectorHandler<T = unknown> = ($doc: JQuery<Document>) => T;

// Accepts legacy string/jQuery selectors, tuple with replace regex, or function handlers.
export type RuleSelectorValue<T = unknown> = string | SelectorTuple | SelectorHandler<T>;

// Backward-compatible support for existing rule shapes; false disables the selector.
export type LegacySelectorValue<T = unknown> = RuleSelectorValue<T> | false;

export interface ParsedSelector<T = unknown> {
  type: SelectorType;
  selector: string | SelectorHandler<T>;
  replace?: string | RegExp;
}
