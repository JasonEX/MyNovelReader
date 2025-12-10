/**
 * DetectionEngine - Main orchestrator for page detection
 */

import { ConfidenceReport, DetectionResults, SectionDetectionResult } from './types';
import { ConfidenceScorer } from './ConfidenceScorer';
import { ContentDetector } from './ContentDetector';
import { NavigationDetector } from './NavigationDetector';
import { TitleDetector } from './TitleDetector';

export interface DetectionEngineResult {
  results: DetectionResults;
  confidence: ConfidenceReport;
}

export class DetectionEngine {
  private contentDetector: ContentDetector;
  private navigationDetector: NavigationDetector;
  private titleDetector: TitleDetector;
  private confidenceScorer: ConfidenceScorer;

  constructor() {
    this.contentDetector = new ContentDetector();
    this.navigationDetector = new NavigationDetector();
    this.titleDetector = new TitleDetector();
    this.confidenceScorer = new ConfidenceScorer();
  }

  /**
   * Run full detection on the document
   */
  detect(
    doc: Document = document,
    currentUrl: string = window.location.href
  ): DetectionEngineResult {
    // Run all detectors
    const content = this.contentDetector.detect(doc);
    const navigation = this.navigationDetector.detect(doc);
    const title = this.titleDetector.detect(doc);

    // Validate navigation against current URL
    const validatedNav = this.navigationDetector.validateNavigation(currentUrl, navigation);

    // Detect multi-page chapter sections
    const section = this.navigationDetector.detectSection(doc, currentUrl, validatedNav);

    const results: DetectionResults = {
      content,
      navigation: validatedNav,
      title,
      section,
    };

    // Calculate confidence
    const confidence = this.confidenceScorer.score(results);

    return { results, confidence };
  }

  /**
   * Detect section only (for use when navigation is already known)
   */
  detectSection(
    doc: Document = document,
    currentUrl: string = window.location.href
  ): SectionDetectionResult {
    const navigation = this.navigationDetector.detect(doc);
    return this.navigationDetector.detectSection(doc, currentUrl, navigation);
  }

  /**
   * Quick check if page looks like a novel chapter
   */
  quickCheck(doc: Document = document): boolean {
    // Check for common novel page indicators
    const indicators = [
      // Check document title
      () => {
        const title = doc.title;
        return /第.{1,10}章|chapter|小说|阅读/i.test(title);
      },
      // Check for known content selectors
      () => {
        const selectors = ['#content', '#chapter_content', '.noveltext', '#BookText'];
        return selectors.some(s => doc.querySelector(s) !== null);
      },
      // Check for navigation links
      () => {
        const links = Array.from(doc.querySelectorAll('a'));
        return links.some(a => /下一[章页]/.test(a.textContent || ''));
      },
      // Check text content length
      () => {
        const body = doc.body;
        const text = body?.textContent || '';
        return text.length > 3000;
      },
    ];

    // At least 2 indicators should match
    const matches = indicators.filter(check => {
      try {
        return check();
      } catch {
        return false;
      }
    });

    return matches.length >= 2;
  }

  /**
   * Generate a selector for a given element
   */
  generateSelector(element: Element): string {
    return this.contentDetector.generateSelector(element);
  }

  /**
   * Get confidence threshold
   */
  getThreshold(): number {
    return this.confidenceScorer.getThreshold();
  }

  /**
   * Set confidence threshold
   */
  setThreshold(threshold: number): void {
    this.confidenceScorer.setThreshold(threshold);
  }
}

// Export all types and detectors
export * from './types';
export { ContentDetector } from './ContentDetector';
export { NavigationDetector } from './NavigationDetector';
export { TitleDetector } from './TitleDetector';
export { ConfidenceScorer } from './ConfidenceScorer';
