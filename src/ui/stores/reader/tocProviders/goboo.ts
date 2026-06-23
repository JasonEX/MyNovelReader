function cleanGobooTocTitleForUrl(title: string, url: string): string {
  const trimmed = title.trim();

  try {
    const parsed = new URL(url);
    const gobooChapter = parsed.pathname.match(/^\/gb_\d+\/\d+\/(\d+)(?:\/|$)/);
    if (!gobooChapter) return trimmed;

    const chapterPathId = gobooChapter[1];
    if (!trimmed.startsWith(chapterPathId)) return trimmed;

    const rest = trimmed.slice(chapterPathId.length).trimStart();
    // Goboo catalog items can render as "{link path id}{displayed chapter number} title",
    // e.g. "/17" + "017 ..." => "17017 ...". Keep normal titles like "277 正文".
    if (/^(?:\d{3,4}|第)/.test(rest)) {
      return rest;
    }
  } catch {
    // ignore invalid URL
  }

  return trimmed;
}

export const gobooTocTitleCleaner = {
  id: 'goboo',
  clean: cleanGobooTocTitleForUrl,
};
