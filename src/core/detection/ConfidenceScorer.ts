/**
 * ConfidenceScorer - Calculate overall detection confidence
 */

import { ConfidenceReport, DetectionResults, NavigationResult, ScoringWeights } from './types';

/** Default confidence threshold for reliable detection */
const DEFAULT_THRESHOLD = 0.6;

/** Default scoring weights */
const DEFAULT_WEIGHTS: ScoringWeights = {
  content: 0.5,
  navigation: 0.3,
  title: 0.2,
};

export class ConfidenceScorer {
  private threshold: number;
  private weights: ScoringWeights;

  constructor(threshold: number = DEFAULT_THRESHOLD, weights: ScoringWeights = DEFAULT_WEIGHTS) {
    this.threshold = threshold;
    this.weights = weights;
  }

  /**
   * Calculate confidence report from detection results
   */
  score(results: DetectionResults): ConfidenceReport {
    const contentScore = results.content.confidence;
    const navigationScore = this.scoreNavigation(results.navigation);
    const titleScore = results.title.confidence;

    const overall =
      contentScore * this.weights.content +
      navigationScore * this.weights.navigation +
      titleScore * this.weights.title;

    const reasons = this.generateReasons(results, {
      content: contentScore,
      navigation: navigationScore,
      title: titleScore,
    });

    return {
      overall,
      content: contentScore,
      navigation: navigationScore,
      title: titleScore,
      isReliable: overall >= this.threshold,
      reasons,
    };
  }

  /**
   * Score navigation detection result
   */
  private scoreNavigation(nav: NavigationResult): number {
    let score = 0;
    let count = 0;

    // Next link is most important
    if (nav.next) {
      score += nav.next.confidence * 1.5; // Weight next link higher
      count += 1.5;
    } else {
      // No next link is a significant penalty
      return 0.2;
    }

    if (nav.prev) {
      score += nav.prev.confidence;
      count++;
    }

    if (nav.index) {
      score += nav.index.confidence * 0.5; // Index is nice to have
      count += 0.5;
    }

    return count > 0 ? score / count : 0;
  }

  /**
   * Generate human-readable reasons for the scores
   */
  private generateReasons(
    results: DetectionResults,
    scores: { content: number; navigation: number; title: number }
  ): string[] {
    const reasons: string[] = [];

    // Content reasons
    if (scores.content > 0.8) {
      reasons.push('找到清晰的内容区域');
    } else if (scores.content > 0.5) {
      reasons.push('找到可能的内容区域');
    } else if (scores.content > 0) {
      reasons.push('内容区域检测不确定');
    } else {
      reasons.push('未找到内容区域');
    }

    // Navigation reasons
    if (results.navigation.next) {
      reasons.push('找到下一章链接');
    } else {
      reasons.push('未找到下一章链接');
    }

    if (results.navigation.prev) {
      reasons.push('找到上一章链接');
    }

    if (results.navigation.index) {
      reasons.push('找到目录链接');
    }

    // Title reasons
    if (scores.title > 0.7) {
      reasons.push(`检测到章节标题: "${results.title.chapterTitle.substring(0, 20)}..."`);
    } else if (scores.title > 0.4) {
      reasons.push('章节标题检测不确定');
    }

    // Book title
    if (results.title.bookTitle) {
      reasons.push(`书名: ${results.title.bookTitle}`);
    }

    return reasons;
  }

  /**
   * Create a simple summary string
   */
  createSummary(report: ConfidenceReport): string {
    const percentage = Math.round(report.overall * 100);
    const status = report.isReliable ? '可信' : '不确定';
    return `检测置信度: ${percentage}% (${status})`;
  }

  /**
   * Get threshold value
   */
  getThreshold(): number {
    return this.threshold;
  }

  /**
   * Set threshold value
   */
  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }
}
