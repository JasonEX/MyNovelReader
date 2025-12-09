/**
 * Core module exports
 */

// Detection engine
export {
  DetectionEngine,
  ContentDetector,
  NavigationDetector,
  TitleDetector,
  ConfidenceScorer,
} from '@/core/detection';

export type {
  DetectionEngineResult,
  ContentDetectionResult,
  NavigationDetectionResult,
  TitleDetectionResult,
  ConfidenceReport,
  NavLinkResult,
} from '@/core/detection';

// Parser
export { Parser, getParser, ContentProcessor } from '@/core/parser';

export type { ParsedChapter, ParserOptions, ProcessingOptions } from '@/core/parser';

// Rules
export { getRuleManager } from '@/core/rules/RuleManager';
export { RuleStorage } from '@/core/rules/RuleStorage';

export type { SiteRule, RuleMatchResult, ReplaceRule } from '@/core/rules/types';

// Protection
export { SiteProtection, getSiteProtection } from '@/core/protection';

export type { ProtectionOptions } from '@/core/protection';

// Auto-enable
export { AutoEnableManager, getAutoEnableManager } from '@/core/AutoEnableManager';

export type {
  AutoEnableDecision,
  AutoEnableOptions,
  UserPromptResponse,
  PromptCallback,
  LaunchCallback,
} from '@/core/AutoEnableManager';
