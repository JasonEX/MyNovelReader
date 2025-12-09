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

/** Title configuration */
export interface TitleConfig {
  /** CSS selector for chapter title */
  selector?: string;
  /** Regex pattern to extract from document.title */
  pattern?: string;
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
  /**
   * Check for multi-page chapters (一章分多页)
   * When true, detects URL patterns like `_2.html` or `-2.html`
   * and merges consecutive section pages into a single chapter
   */
  checkSection?: boolean;
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

/** JavaScript hooks for advanced customization */
export interface HooksConfig {
  /** JS code to run before parsing (receives: doc) */
  beforeParse?: string;
  /** JS code to run after parsing (receives: content, returns: content) */
  afterParse?: string;
  /** JS code to patch content DOM (receives: $doc) */
  contentPatch?: string;
  /** JS code for VIP chapter detection (receives: $doc, returns: boolean) */
  isVipChapter?: string;
  /** JS code to run on page load */
  onLoad?: string;
}

/** Rule metadata */
export interface RuleMeta {
  /** Rule author */
  author?: string;
  /** Rule source: builtin, user, or community */
  source: 'builtin' | 'user' | 'community';
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
  source: 'user' | 'community' | 'builtin' | 'detection';
  matchedPattern: string;
}

/** Storage key constants */
export const STORAGE_KEYS = {
  USER_RULES: 'mnr_user_rules',
  RULE_PREFIX: 'mnr_rule_',
  COMMUNITY_RULES_URL: 'mnr_community_rules_url',
  LAST_COMMUNITY_UPDATE: 'mnr_community_rules_updated',
} as const;

/** Default community rules URL */
export const DEFAULT_COMMUNITY_RULES_URL =
  'https://raw.githubusercontent.com/JasonEX/MyNovelReader/master/rules/community.json';
