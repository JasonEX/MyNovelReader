/** DOM utilities shared across the reader. */

export interface ObserveElementOptions {
  contentSelector?: string;
  mutationSelector?: string;
  mutationChildText?: string;
  mutationChildCount?: number;
  mutationCheck?: ($doc: JQuery<Document>) => boolean;
}

/** Wait for dynamic DOM changes before resolving. */
export declare function observeElement(
  doc: Document,
  options: ObserveElementOptions
): Promise<void> | void;

/** Resolve once DOM mutations settle (debounced). */
export declare function domMutation(): Promise<void>;

/** Strip HTML wrappers and clean spacing. */
export declare function htmlFmt(text: string, otherRegex?: RegExp): string;

/** Remove comments and normalize content from a document. */
export declare function cleanHTML(doc: Document): string;

/** Render normalized text as HTML paragraphs. */
export declare function renderHTML(text: string): string;
