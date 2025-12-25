/**
 * Section (multi-page chapter) URL helpers
 *
 * Shared parsing for common multi-page chapter URL shapes.
 */

export interface ChapterSectionPathInfo {
  /** Stable identifier for the chapter path (used for equality checks). */
  chapterKey: string;
  /** Section/page number (1-based). */
  section: number;
}

/**
 * Parse section/page info from a URL pathname.
 *
 * Examples:
 * - /123.html -> { chapterKey: "/123", section: 1 }
 * - /123_2.html -> { chapterKey: "/123", section: 2 }
 * - /book/123/2.html -> { chapterKey: "/book/123", section: 2 }
 * - /xs_xxx/89812/1358/2 -> { chapterKey: "/xs_xxx/89812/1358", section: 2 }
 */
export function parseChapterSectionFromPathname(pathname: string): ChapterSectionPathInfo | null {
  if (!pathname) return null;
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // 1) /123_2.html or /123-2.html
  let match = normalized.match(/^(.*\/\d+)[_-](\d+)\.html?$/i);
  if (match) {
    const section = parseInt(match[2], 10);
    if (section >= 1 && section <= 99) {
      return { chapterKey: match[1], section };
    }
  }

  // 2) /123/2.html
  match = normalized.match(/^(.*\/\d+)\/(\d+)\.html?$/i);
  if (match) {
    const section = parseInt(match[2], 10);
    // Treat as section only when the page number is small; otherwise it is likely /{bookId}/{chapterId}.html.
    if (section >= 1 && section <= 99) {
      return { chapterKey: match[1], section };
    }
  }

  // 3) /123.html
  match = normalized.match(/^(.*\/\d+)\.html?$/i);
  if (match) {
    return { chapterKey: match[1], section: 1 };
  }

  // 4) Extensionless pagination: /{...}/{chapterId}/{page}
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length >= 3) {
    const pagePart = parts[parts.length - 1];
    const chapterPart = parts[parts.length - 2];

    if (/^\d{1,2}$/.test(pagePart) && /^\d{3,}$/.test(chapterPart)) {
      const section = parseInt(pagePart, 10);
      const numericSegments = parts.slice(0, -1).filter(p => /^\d{3,}$/.test(p));

      // Require at least 2 "big" numeric segments to avoid misclassifying /{bookId}/{chapterNo}.
      if (numericSegments.length >= 2 && section >= 1 && section <= 99) {
        return { chapterKey: `/${parts.slice(0, -1).join('/')}`, section };
      }
    }
  }

  // 5) Extensionless chapter: /{...}/{chapterId}
  match = normalized.match(/^(.*\/\d{3,})(?:\/)?$/);
  if (match) {
    return { chapterKey: match[1], section: 1 };
  }

  return null;
}
