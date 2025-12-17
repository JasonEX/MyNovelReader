/**
 * CSS selectors for content processing
 */

/** Default selectors for elements to remove during content processing */
export const REMOVE_SELECTORS = [
  'script',
  'style',
  'iframe',
  'noscript',
  '.ad',
  '.ads',
  '.advertisement',
  '[class*="ad-"]',
  '[id*="ad-"]',
  '.sponsor',
  '.recommend',
  '.related',
  '.comment',
  '.share',
  'ins.adsbygoogle',
];

/** Advertisement text patterns to remove from content */
export const AD_PATTERNS = [
  // Section/page navigation hints (分页提示) - use [（(] and [）)] to match both full-width and half-width
  /[（(]本章未完[，,]?请?点击下一页继续阅读[）)]/gi,
  /本章未完[，,]?请?点击下一页继续.*/gi,
  /请点击下一页继续阅读/gi,
  /点击下一页继续阅读/gi,
  // Page number indicators (页码指示) - match both full-width and half-width parentheses
  /[（(]第\d+[/／]\d+页[）)]/gi,
  /第\d+[/／]\d+页/gi,
  // Standalone orphan parentheses left after cleaning (孤立括号清理)
  /[（(]\s*[）)]/g, // Empty parentheses
  /[（(]\s*$/gm, // Orphan opening parenthesis at end of line
  /^\s*[）)]/gm, // Orphan closing parenthesis at start of line
  // Common site ads
  /手机用户请到.*阅读/gi,
  /请记住本书.*网址/gi,
  /百度搜索.*最新章节/gi,
  /一秒记住.*为您提供/gi,
  /天才一秒记住/gi,
  /笔趣阁.*www\.[a-z]+\.(com|net|org)/gi,
  /https?:\/\/[^\s<>"]+/gi,
  /www\.[a-z0-9]+\.(com|net|org|cc)/gi,
];
