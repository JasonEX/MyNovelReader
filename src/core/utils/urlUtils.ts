/**
 * URL and HTML utility functions
 */

/**
 * Normalize a URL to an absolute URL
 * @param url - The URL to normalize
 * @param base - Optional base URL (defaults to current location)
 * @returns The absolute URL string
 */
export function normalizeAbsoluteUrl(url: string, base?: string): string {
  try {
    return new URL(url, base || window.location.href).toString();
  } catch {
    return url;
  }
}

/**
 * Join two HTML strings with a paragraph separator
 * @param a - First HTML string
 * @param b - Second HTML string
 * @returns Combined HTML string
 */
export function joinHtml(a: string, b: string): string {
  const left = (a || '').trim();
  const right = (b || '').trim();
  if (!left) return right;
  if (!right) return left;
  return `${left}<p></p>${right}`;
}

/**
 * Normalize Ciweimao "paragraph tsukkomi" pages back to chapter URL.
 *
 * Example:
 * - https://wap.ciweimao.com/chapter/get_par_tsu_list?chapter_id=113493242&data-pgid=0
 *   -> https://wap.ciweimao.com/chapter/113493242
 */
export function normalizeCiwemaoChapterUrl(url: string): string {
  try {
    const u = new URL(url);
    if (
      (u.hostname === 'wap.ciweimao.com' || u.hostname === 'mip.ciweimao.com') &&
      (u.pathname === '/chapter/get_par_tsu_list' || u.pathname === '/chapter/get_par_tsu_list/')
    ) {
      const chapterId = u.searchParams.get('chapter_id');
      if (chapterId && /^\d+$/.test(chapterId)) {
        return `${u.origin}/chapter/${chapterId}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}
