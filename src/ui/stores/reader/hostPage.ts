import type { ParsedChapter } from '@/core/parser';

export interface HostPageSnapshot {
  url: string;
  title: string;
  state: unknown;
}

export function captureHostPageSnapshot(): HostPageSnapshot | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  return {
    url: window.location.href,
    title: document.title,
    state: window.history.state,
  };
}

export function syncHostPageToChapter(chapter: ParsedChapter | null, index: number): void {
  if (!chapter) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const chapterTitle = chapter.title.trim();
  const bookTitle = chapter.bookTitle?.trim() || '';
  const title =
    chapterTitle && bookTitle && chapterTitle !== bookTitle
      ? `${chapterTitle} - ${bookTitle}`
      : chapterTitle || bookTitle;

  if (title) {
    document.title = title;
  }

  if (!chapter.url) return;

  const currentState = window.history.state;
  const stateBase =
    currentState && typeof currentState === 'object' && !Array.isArray(currentState)
      ? currentState
      : {};

  try {
    window.history.replaceState(
      {
        ...stateBase,
        mnr: true,
        mnrChapter: index,
        chapterUrl: chapter.url,
      },
      '',
      chapter.url
    );
  } catch {
    // Some pages can block history mutation; the reader state remains authoritative.
  }
}

export function restoreHostPageSnapshot(snapshot: HostPageSnapshot | null): void {
  if (!snapshot) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  document.title = snapshot.title;

  try {
    window.history.replaceState(snapshot.state ?? null, '', snapshot.url);
  } catch {
    // Best-effort restore only; closing the reader must not fail.
  }
}
