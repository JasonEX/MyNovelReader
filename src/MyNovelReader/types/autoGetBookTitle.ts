/**
 * Auto-detect book title from a parsed document.
 */
export type AutoGetBookTitle = ($doc: JQuery<Document>) => string;

declare const autoGetBookTitle: AutoGetBookTitle;

export default autoGetBookTitle;
