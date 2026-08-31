export const MAX_CUSTOM_PARAGRAPH_FILTERS = 1000;
export const MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS = 20;
export const MAX_CUSTOM_PARAGRAPH_SITE_FILTERS = 80;
export const MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH = 256;

const CUSTOM_PARAGRAPH_FILTER_HOST_PREFIX = '@host=';

export interface CustomParagraphFilterError {
  line: number;
  message: string;
}

export interface CompiledCustomParagraphFilters {
  globalPatterns: RegExp[];
  patternsByHostname: Map<string, RegExp[]>;
  errors: CustomParagraphFilterError[];
}

export interface AppendScopedCustomParagraphFilterResult {
  source: string;
  error: string | null;
}

export function normalizeCustomParagraphFilterHostname(hostname: string): string | null {
  const candidate = hostname.trim().toLowerCase().replace(/\.$/u, '');
  if (!candidate || /[\s\\/?#@]/u.test(candidate)) return null;

  try {
    const parsed = new URL(`https://${candidate}/`);
    if (parsed.username || parsed.password || parsed.port || parsed.pathname !== '/') return null;
    return parsed.hostname.toLowerCase().replace(/\.$/u, '') || null;
  } catch {
    return null;
  }
}

export function getCustomParagraphFilterHostname(url?: string): string | null {
  if (!url) return null;

  try {
    return normalizeCustomParagraphFilterHostname(new URL(url).hostname);
  } catch {
    return null;
  }
}

export function formatScopedCustomParagraphFilter(
  hostname: string,
  patternSource: string
): string | null {
  const normalizedHostname = normalizeCustomParagraphFilterHostname(hostname);
  const normalizedPattern = patternSource.trim();
  if (!normalizedHostname || !normalizedPattern) return null;
  return `${CUSTOM_PARAGRAPH_FILTER_HOST_PREFIX}${normalizedHostname} ${normalizedPattern}`;
}

/** Append one complete exact-hostname rule while preserving all resource limits. */
export function appendScopedCustomParagraphFilter(
  source: string,
  hostname: string,
  patternSource: string
): AppendScopedCustomParagraphFilterResult {
  const normalizedHostname = normalizeCustomParagraphFilterHostname(hostname);
  if (!normalizedHostname) return { source, error: '无法识别当前章节 hostname' };

  const scopedRule = formatScopedCustomParagraphFilter(normalizedHostname, patternSource);
  if (!scopedRule) return { source, error: '请输入正则表达式' };

  const candidateError = compileCustomParagraphFilters(scopedRule).errors[0];
  if (candidateError) return { source, error: candidateError.message };

  const totalRuleCount = source.split(/\r?\n/u).filter(line => line.trim()).length;
  if (totalRuleCount >= MAX_CUSTOM_PARAGRAPH_FILTERS) {
    return {
      source,
      error: `全部网站合计最多支持 ${MAX_CUSTOM_PARAGRAPH_FILTERS} 条规则`,
    };
  }

  const compiled = compileCustomParagraphFilters(source);
  const siteRuleCount = compiled.patternsByHostname.get(normalizedHostname)?.length || 0;
  if (siteRuleCount >= MAX_CUSTOM_PARAGRAPH_SITE_FILTERS) {
    return {
      source,
      error: `每个网站最多支持 ${MAX_CUSTOM_PARAGRAPH_SITE_FILTERS} 条规则`,
    };
  }

  const separator = !source || /\r?\n$/u.test(source) ? '' : '\n';
  return { source: `${source}${separator}${scopedRule}`, error: null };
}

/** Compile global and exact-hostname regular expressions from non-empty lines. */
export function compileCustomParagraphFilters(source: string): CompiledCustomParagraphFilters {
  const globalPatterns: RegExp[] = [];
  const patternsByHostname = new Map<string, RegExp[]>();
  const errors: CustomParagraphFilterError[] = [];
  const reportedSiteLimits = new Set<string>();
  let totalRuleCount = 0;
  let reportedGlobalLimit = false;

  for (const [index, rawLine] of source.split(/\r?\n/u).entries()) {
    const line = rawLine.trim();
    if (!line) continue;

    totalRuleCount += 1;
    if (totalRuleCount > MAX_CUSTOM_PARAGRAPH_FILTERS) {
      errors.push({
        line: index + 1,
        message: `全部网站合计最多支持 ${MAX_CUSTOM_PARAGRAPH_FILTERS} 条规则`,
      });
      break;
    }

    let hostname: string | null = null;
    let patternSource = line;
    if (line.startsWith(CUSTOM_PARAGRAPH_FILTER_HOST_PREFIX)) {
      const scopedMatch = /^@host=(\S+)\s+(.+)$/u.exec(line);
      if (!scopedMatch) {
        errors.push({ line: index + 1, message: '作用域规则格式应为 @host=域名 正则' });
        continue;
      }

      hostname = normalizeCustomParagraphFilterHostname(scopedMatch[1] || '');
      if (!hostname) {
        errors.push({ line: index + 1, message: 'hostname 无效' });
        continue;
      }
      patternSource = (scopedMatch[2] || '').trim();
    }

    if (patternSource.length > MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH) {
      errors.push({
        line: index + 1,
        message: `单条规则不能超过 ${MAX_CUSTOM_PARAGRAPH_FILTER_LENGTH} 个字符`,
      });
      continue;
    }

    let pattern: RegExp;
    try {
      pattern = new RegExp(patternSource, 'iu');
    } catch {
      errors.push({ line: index + 1, message: '不是有效的正则表达式' });
      continue;
    }

    if (!hostname) {
      if (globalPatterns.length >= MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS) {
        if (!reportedGlobalLimit) {
          errors.push({
            line: index + 1,
            message: `全局最多支持 ${MAX_CUSTOM_PARAGRAPH_GLOBAL_FILTERS} 条规则`,
          });
          reportedGlobalLimit = true;
        }
        continue;
      }
      globalPatterns.push(pattern);
      continue;
    }

    const sitePatterns = patternsByHostname.get(hostname) || [];
    if (sitePatterns.length >= MAX_CUSTOM_PARAGRAPH_SITE_FILTERS) {
      if (!reportedSiteLimits.has(hostname)) {
        errors.push({
          line: index + 1,
          message: `每个网站最多支持 ${MAX_CUSTOM_PARAGRAPH_SITE_FILTERS} 条规则`,
        });
        reportedSiteLimits.add(hostname);
      }
      continue;
    }
    sitePatterns.push(pattern);
    patternsByHostname.set(hostname, sitePatterns);
  }

  return { globalPatterns, patternsByHostname, errors };
}

export function getCustomParagraphFiltersForHostname(
  compiled: CompiledCustomParagraphFilters,
  hostname: string | null
): readonly RegExp[] {
  const normalizedHostname = hostname ? normalizeCustomParagraphFilterHostname(hostname) : null;
  const sitePatterns = normalizedHostname
    ? compiled.patternsByHostname.get(normalizedHostname)
    : undefined;

  if (!sitePatterns || sitePatterns.length === 0) return compiled.globalPatterns;
  if (compiled.globalPatterns.length === 0) return sitePatterns;
  return [...compiled.globalPatterns, ...sitePatterns];
}

export function getCustomParagraphFiltersForUrl(
  compiled: CompiledCustomParagraphFilters,
  url?: string
): readonly RegExp[] {
  return getCustomParagraphFiltersForHostname(compiled, getCustomParagraphFilterHostname(url));
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
