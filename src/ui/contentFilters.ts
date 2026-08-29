export const MAX_CUSTOM_PARAGRAPH_FILTERS = 20;
export const MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH = 256;

export interface CustomParagraphFilterError {
  line: number;
  message: string;
}

export interface CompiledCustomParagraphFilters {
  patterns: RegExp[];
  errors: CustomParagraphFilterError[];
}

/** Compile one raw regular expression per non-empty line. */
export function compileCustomParagraphFilters(source: string): CompiledCustomParagraphFilters {
  const patterns: RegExp[] = [];
  const errors: CustomParagraphFilterError[] = [];
  let ruleCount = 0;

  for (const [index, rawLine] of source.split(/\r?\n/u).entries()) {
    const patternSource = rawLine.trim();
    if (!patternSource) continue;

    ruleCount += 1;
    if (ruleCount > MAX_CUSTOM_PARAGRAPH_FILTERS) {
      errors.push({
        line: index + 1,
        message: `最多支持 ${MAX_CUSTOM_PARAGRAPH_FILTERS} 条规则`,
      });
      break;
    }
    if (patternSource.length > MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH) {
      errors.push({
        line: index + 1,
        message: `单条规则不能超过 ${MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH} 个字符`,
      });
      continue;
    }

    try {
      patterns.push(new RegExp(patternSource, 'iu'));
    } catch {
      errors.push({ line: index + 1, message: '不是有效的正则表达式' });
    }
  }

  return { patterns, errors };
}

/**
 * Remove matching paragraphs from a display-only HTML projection.
 * Canonical chapter content and non-paragraph markup are left untouched.
 */
export function filterCustomParagraphs(html: string, patterns: readonly RegExp[]): string {
  if (!html || patterns.length === 0) return html;

  const template = document.createElement('template');
  template.innerHTML = html;

  for (const paragraph of template.content.querySelectorAll('p')) {
    const text = (paragraph.textContent || '').replace(/\s+/gu, ' ').trim();
    if (patterns.some(pattern => pattern.test(text))) paragraph.remove();
  }

  return template.innerHTML;
}
