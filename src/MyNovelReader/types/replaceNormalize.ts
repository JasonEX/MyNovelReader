/** Normalization helpers used when cleaning novel content. */
export type NormalizeReplacement = string | ((match: string) => string);

export type NormalizeMap = Record<string, NormalizeReplacement>;

/** Build (and memoize) the normalization replacement map. */
export declare function getNormalizeMap(): NormalizeMap;

/** Convert full-width punctuation to half-width except for excluded characters. */
export declare function toCDB(str: string): string;

/** Convert half-width punctuation to full-width for selected characters. */
export declare function toDBC(str: string): string;
