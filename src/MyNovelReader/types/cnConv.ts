/**
 * Text conversion helpers for simplified/traditional Chinese.
 */
import type { ChineseConversionMode } from './Setting';

export interface ChineseConversionOptions {
  /** Mode configured in Setting.chineseConversion. */
  mode: ChineseConversionMode;
}

export type ChineseConversionFn = (text: string) => string;

/** Convert text according to the current chineseConversion setting. */
export declare function chineseConversion(text: string): string;
