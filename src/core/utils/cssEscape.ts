/**
 * CSS selector escape utility
 * Escapes special characters in CSS selectors (IDs, classes, etc.)
 */

/**
 * Escapes special characters in a string for use in CSS selectors
 * Uses the native CSS.escape when available, falls back to regex replacement
 *
 * @param str - The string to escape
 * @returns The escaped string safe for use in CSS selectors
 *
 * @example
 * cssEscape('foo:bar') // returns 'foo\\:bar'
 * cssEscape('#id.class') // returns '\\#id\\.class'
 */
export function cssEscape(str: string): string {
  if (typeof CSS !== 'undefined' && CSS.escape) {
    return CSS.escape(str);
  }
  // Simple escape for IDs and classes
  return str.replace(/([!"#$%&'()*+,.:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}
