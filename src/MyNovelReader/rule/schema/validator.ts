import type { SiteConfig } from '../../types/rule';

const selectorKeys: Array<keyof SiteConfig> = [
  'titleSelector',
  'bookTitleSelector',
  'prevSelector',
  'nextSelector',
  'indexSelector',
  'contentSelector',
  'prevUrl',
  'nextUrl',
  'indexUrl',
];

const nodeEnv =
  typeof globalThis !== 'undefined'
    ? (globalThis as Record<string, any>).process?.env?.NODE_ENV
    : undefined;
const viteDev =
  typeof import.meta !== 'undefined' ? (import.meta as Record<string, any>).env?.DEV : undefined;
const isDev = Boolean(viteDev ?? (nodeEnv && nodeEnv !== 'production'));

function warn(context: string, siteName: string, message: string): void {
  console.warn(`[RuleSchema][${context}] ${siteName}: ${message}`);
}

function isValidSelector(value: unknown): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'function' ||
    value === false ||
    Array.isArray(value)
  );
}

export function validateRuleSchemas(rules: unknown, context = 'rules'): void {
  if (!isDev) return;

  if (!Array.isArray(rules)) {
    console.warn(`[RuleSchema] Expected an array for ${context}, got ${typeof rules}`);
    return;
  }

  rules.forEach((rule, index) => {
    if (!rule || typeof rule !== 'object') {
      warn(context, `#${index}`, 'rule must be an object');
      return;
    }

    const ruleObj = rule as SiteConfig & Record<string, unknown>;
    const name = ruleObj.siteName || `#${index}`;

    if (!ruleObj.siteName) {
      warn(context, name, 'missing required field "siteName"');
    }

    const url = ruleObj.url as unknown;
    if (url === undefined || url === null) {
      warn(context, name, 'missing required field "url"');
    } else if (typeof url !== 'string' && !(url instanceof RegExp)) {
      warn(context, name, '"url" should be a string or RegExp');
    }

    selectorKeys.forEach(key => {
      const value = ruleObj[key as keyof SiteConfig] as unknown;
      if (value === undefined) return;

      if (!isValidSelector(value)) {
        warn(context, name, `"${String(key)}" should be string/function/array/false`);
      }
    });
  });
}
