import type { SiteRule } from '../types';

type SiteRuleModule = Record<string, unknown>;

// New site rule files are picked up automatically when they export a SiteRule-shaped object.
const modules = import.meta.glob<SiteRuleModule>(['./*.ts', '!./index.ts'], { eager: true });

function isSiteRule(value: unknown): value is SiteRule {
  if (!value || typeof value !== 'object') return false;

  const maybe = value as Partial<SiteRule>;
  return (
    typeof maybe.id === 'string' &&
    typeof maybe.version === 'number' &&
    !!maybe.match &&
    typeof maybe.match.pattern === 'string' &&
    !!maybe.content &&
    typeof maybe.content.selector === 'string'
  );
}

export const siteRules: SiteRule[] = Object.keys(modules)
  .sort()
  .flatMap(path => Object.values(modules[path]).filter(isSiteRule));
