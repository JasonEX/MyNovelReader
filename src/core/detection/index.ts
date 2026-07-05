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
    const navigation = this.navigationDetector.detect(doc, currentUrl);
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
    const navigation = this.navigationDetector.detect(doc, currentUrl);
    return this.navigationDetector.detectSection(doc, currentUrl, navigation);
  }

  /**
   * Quick check if page looks like a novel chapter
   */
  quickCheck(doc: Document = document): boolean {
    const currentUrl = doc.location?.href || window.location.href;
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
        return links.some(a => /下一[章页节篇回]|下页/i.test(a.textContent || ''));
      },
      // Check text content length
      () => {
        const body = doc.body;
        const text = body?.textContent || '';
        return text.length > 3000;
      },
      // Check URL and content length for chapter-like paths
      () => {
        const body = doc.body;
        const text = body?.textContent || '';
        return /\/chapters?\//i.test(currentUrl) && text.length > 1200;
      },
    ];

    // At least 2 indicators should match. Stop as soon as the page is proven
    // chapter-like; later checks may scan many links or the whole body text.
    let matches = 0;
    for (const check of indicators) {
      try {
        if (check()) {
          matches++;
          if (matches >= 2) return true;
        }
      } catch {
        // ignore failed heuristics
      }
    }

    return false;
  }

  /**
   * Generate a selector for a given element
   */
  generateSelector(element: Element): string {
    return this.contentDetector.generateSelector(element);
  }
}

// Export all types and detectors
export * from './types';
export { ContentDetector } from './ContentDetector';
export { NavigationDetector } from './NavigationDetector';
export { TitleDetector } from './TitleDetector';
export { ConfidenceScorer } from './ConfidenceScorer';
