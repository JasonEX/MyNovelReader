/**
 * Repairs confirmed glyph substitutions introduced into novel text as copy deterrents.
 *
 * Keep this list evidence-based and meaning-preserving. Ambiguous characters such as
 * `澹`, `桉`, `勐`, and `莪` must be handled by contextual or site-specific rules instead.
 */
const ANTI_COPY_GLYPH_REPAIRS = [{ source: '伱', replacement: '你' }] as const;

export function repairAntiCopyText(text: string): string {
  let repaired = text;

  for (const { source, replacement } of ANTI_COPY_GLYPH_REPAIRS) {
    if (repaired.includes(source)) {
      repaired = repaired.split(source).join(replacement);
    }
  }

  return repaired;
}
