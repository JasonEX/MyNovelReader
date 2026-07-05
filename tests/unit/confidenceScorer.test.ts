/**
 * Unit tests for ConfidenceScorer
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { ConfidenceScorer } from '@/core/detection/ConfidenceScorer';
import { DetectionResults } from '@/core/detection/types';

describe('ConfidenceScorer', () => {
  let scorer: ConfidenceScorer;

  beforeEach(() => {
    scorer = new ConfidenceScorer();
  });

  describe('score', () => {
    it('should return high confidence for complete detection', () => {
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '#content',
          confidence: 0.9,
          method: 'selector',
        },
        navigation: {
          next: {
            element: null as unknown as HTMLAnchorElement,
            url: '/next.html',
            confidence: 0.9,
            method: 'text-matching',
          },
          prev: {
            element: null as unknown as HTMLAnchorElement,
            url: '/prev.html',
            confidence: 0.8,
            method: 'text-matching',
          },
          index: {
            element: null as unknown as HTMLAnchorElement,
            url: '/index.html',
            confidence: 0.7,
            method: 'text-matching',
          },
        },
        title: {
          chapterTitle: '第一章',
          confidence: 0.8,
          method: 'heading',
        },
      };

      const report = scorer.score(results);

      expect(report.overall).toBeGreaterThan(0.7);
      expect(report.isReliable).toBe(true);
      expect(report.reasons.length).toBeGreaterThan(0);
    });

    it('should return low confidence when content not found', () => {
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '',
          confidence: 0,
          method: 'fallback',
        },
        navigation: {
          next: null,
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '',
          confidence: 0,
          method: 'pattern',
        },
      };

      const report = scorer.score(results);

      expect(report.overall).toBeLessThan(0.3);
      expect(report.isReliable).toBe(false);
    });

    it('should penalize missing next link', () => {
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '#content',
          confidence: 0.9,
          method: 'selector',
        },
        navigation: {
          next: null,
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '第一章',
          confidence: 0.8,
          method: 'heading',
        },
      };

      const report = scorer.score(results);

      // Navigation score should be low without next link
      expect(report.navigation).toBeLessThan(0.3);
    });

    it('should generate meaningful reasons', () => {
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '#content',
          confidence: 0.9,
          method: 'selector',
        },
        navigation: {
          next: {
            element: null as unknown as HTMLAnchorElement,
            url: '/next.html',
            confidence: 0.9,
            method: 'text-matching',
          },
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '第一章 开始',
          bookTitle: '我的小说',
          confidence: 0.8,
          method: 'heading',
        },
      };

      const report = scorer.score(results);

      expect(report.reasons).toContain('找到清晰的内容区域');
      expect(report.reasons).toContain('找到下一章链接');
      expect(report.reasons.some(r => r.includes('书名'))).toBe(true);
    });

    it('should describe uncertain content detection', () => {
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '#content',
          confidence: 0.3,
          method: 'heuristic',
        },
        navigation: {
          next: null,
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '第一章',
          confidence: 0.8,
          method: 'heading',
        },
      };

      const report = scorer.score(results);
      expect(report.reasons).toContain('内容区域检测不确定');
    });
  });

  describe('threshold', () => {
    it('uses the constructor threshold when marking reliability', () => {
      const strictScorer = new ConfidenceScorer(0.8);
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '#content',
          confidence: 0.7,
          method: 'selector',
        },
        navigation: {
          next: {
            element: null as unknown as HTMLAnchorElement,
            url: '/next.html',
            confidence: 0.7,
            method: 'text-matching',
          },
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '第一章',
          confidence: 0.6,
          method: 'heading',
        },
      };

      const report = strictScorer.score(results);

      expect(report.isReliable).toBe(false);
    });
  });

  describe('createSummary', () => {
    it('should create readable summary', () => {
      const results: DetectionResults = {
        content: {
          element: null,
          selector: '#content',
          confidence: 0.85,
          method: 'selector',
        },
        navigation: {
          next: {
            element: null as unknown as HTMLAnchorElement,
            url: '/next.html',
            confidence: 0.9,
            method: 'text-matching',
          },
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '第一章',
          confidence: 0.7,
          method: 'heading',
        },
      };

      const report = scorer.score(results);
      const summary = scorer.createSummary(report);

      expect(summary).toContain('检测置信度');
      expect(summary).toMatch(/\d+%/);
    });
  });
});
