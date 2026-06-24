/**
 * SiteRule types - Simplified rule schema for v2.0
 * Reduces 47 fields from v1 to essential fields + hooks
 */

/** Replace rule for content processing */
export interface ReplaceRule {
  /** Regex pattern string */
  pattern: string;
  /** Replacement string */
  replacement: string;
  /** Regex flags (default: 'g') */
  flags?: string;
}

/** URL matching configuration */
export interface UrlMatcher {
  /** Regex pattern or glob string */
  pattern: string;
  /** Pattern type (default: 'regex') */
  type?: 'regex' | 'glob';
  /** URL patterns to exclude */
  exclude?: string[];
}

/** Content configuration */
export interface ContentConfig {
  /** CSS selector for content area */
  selector: string;
  /** Selectors to remove from content */
  remove?: string;
  /** Text replacement rules */
  replace?: ReplaceRule[];
}

/** Navigation configuration */
export interface NavigationConfig {
  /** Next chapter selector (false to disable auto-detection) */
  next?: string | false;
  /** Previous chapter selector */
  prev?: string | false;
  /** Index/TOC selector */
  index?: string | false;
}

/** Table of contents (TOC) parsing configuration */
export interface TocConfig {
  /**
   * Exclude TOC links that are inside these ancestor containers.
   * Comma-separated CSS selectors. If any selector matches `a.closest(sel)`,
   * the link will be skipped.
   *
   * Example (Faloo): '.c_con_relation' to exclude "作品相关/小说相关" section.
   */
  excludeAncestors?: string;
}

/** Title configuration */
export interface TitleConfig {
  /** CSS selector for chapter title */
  selector?: string;
  /** Regex pattern to extract from document.title */
  pattern?: string;
  /** Capture group index for chapter title (default: 1) */
  patternIndex?: number;
  /** Capture group index for book title (optional) */
  bookPatternIndex?: number;
  /** Cleanup pattern */
  replace?: string;
  /** Book title selector */
  bookSelector?: string;
}

/** Content processing configuration */
export interface ProcessingConfig {
  /** Remove common ad patterns */
  removeAds?: boolean;
  /** Normalize whitespace and newlines */
  normalizeWhitespace?: boolean;
  /** Process images (center, fix lazy load) */
  fixImages?: boolean;
  /** Use site's custom font */
  useSiteFont?: boolean | string;
  /** Skip content processing (use raw content) */
  useRawContent?: boolean;
}

/** Advanced features configuration */
export interface AdvancedConfig {
  /** Use iframe to load pages */
  useIframe?: boolean;
  /** Iframe sandbox attributes */
  iframeSandbox?: string;
  /** Mutation observer selector */
  mutationSelector?: string;
  /** Mutation child count threshold */
  mutationChildCount?: number;
  /** Delay before processing (ms) */
  timeout?: number;
  /** Trigger scroll to load lazy content */
  lazyLoadScroll?: boolean;
  /**
   * Check for multi-page chapters (一章分多页)
   * When true, detects URL patterns like `_2.html` or `-2.html`
   * and merges consecutive section pages into a single chapter
   */
  checkSection?: boolean;
  /**
   * Delay between fetching consecutive section pages.
   * Useful for sites with aggressive request-frequency limits.
   */
  sectionDelayMs?: number;
  /**
   * Disable section merging
   * When true, treats each page as independent chapter even if URL looks like section
   */
  noSection?: boolean;
  /**
   * Include Referer header in requests
   * Some sites require this to prevent 403 errors
   */
  withReferer?: boolean;
}

export interface HookFetchOptions {
  timeoutMs?: number;
  headers?: Record<string, string>;
  referrer?: string;
  withCredentials?: boolean;
}

export interface HookHelpers {
  fetchJson: (url: string, options?: HookFetchOptions) => Promise<Record<string, unknown> | null>;
  fetchText: (url: string, options?: HookFetchOptions) => Promise<string | null>;
}

export type BeforeParseHook = (
  doc: Document,
  url?: string,
  helpers?: HookHelpers
) => Promise<void> | void;

/** JavaScript hooks for advanced customization */
export interface HooksConfig {
  /**
   * JS code or a typed built-in function to run before parsing.
   *
   * String hooks are executed as async code with signature:
   *   (doc: Document, url?: string, helpers?: { fetchJson, fetchText }) => Promise<void>
   * Function hooks are intended for built-in rules only; user rules are persisted as JSON and keep
   * using string hooks.
   *
   * Note: Only `beforeParse` is supported. Other legacy hook fields are intentionally not supported
   * to keep the rules schema simple and predictable.
   */
  beforeParse?: string | BeforeParseHook;
}

/** Rule metadata */
export interface RuleMeta {
  /** Rule author */
  author?: string;
  /** Rule source: builtin or user */
  source: 'builtin' | 'user';
  /** Creation timestamp */
  created?: number;
  /** Last update timestamp */
  updated?: number;
  /** Example URL for testing */
  exampleUrl?: string;
  /** Whether to auto-launch on matching sites */
  autoLaunch?: boolean;
}

/**
 * SiteRule - Main rule interface (simplified from v1's 47 fields)
 */
export interface SiteRule {
  // === Identification ===
  /** Unique rule ID (auto-generated UUID) */
  id: string;
  /** Human-readable site name */
  name?: string;
  /** Rule version for updates */
  version: number;

  // === URL Matching ===
  /** URL matching configuration */
  match: UrlMatcher;

  // === Content Selection ===
  /** Content area configuration (required) */
  content: ContentConfig;

  // === Optional Configurations ===
  /** Navigation link configuration */
  navigation?: NavigationConfig;
  /** TOC parsing configuration */
  toc?: TocConfig;
  /** Title extraction configuration */
  title?: TitleConfig;
  /** Content processing configuration */
  processing?: ProcessingConfig;
  /** Advanced features configuration */
  advanced?: AdvancedConfig;
  /** JavaScript hooks for customization */
  hooks?: HooksConfig;
  /** Custom CSS styles */
  style?: string;

  // === Metadata ===
  /** Rule metadata */
  meta?: RuleMeta;
}

/** Rule matching result */
export interface RuleMatchResult {
  rule: SiteRule;
  source: 'user' | 'builtin';
  matchedPattern: string;
}

/** Storage key constants */
export const STORAGE_KEYS = {
  USER_RULES: 'mnr_user_rules',
  RULE_PREFIX: 'mnr_rule_',
  SITE_PREFERENCES: 'mnr_site_prefs',
} as const;

/** Site preference for auto-enable behavior */
export interface SitePreference {
  /** Whether to auto-enable reader on this site (true=auto, false=floating-button-only) */
  enabled: boolean;
  /** When this preference was last updated */
  timestamp: number;
}
