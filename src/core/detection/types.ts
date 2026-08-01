/**
 * Detection engine types
 */

/** Result of content area detection */
export interface ContentResult {
  /** The detected content element */
  element: Element | null;
  /** Generated CSS selector for the element */
  selector: string;
  /** Confidence score 0-1 */
  confidence: number;
  /** Detection method used */
  method: 'selector' | 'heuristic' | 'fallback';
  /** Preview text (first 200 chars) */
  preview?: string;
}

/** Result of navigation link detection */
export interface NavLinkResult {
  /** The detected link element */
  element: HTMLAnchorElement;
  /** The URL of the link */
  url: string;
  /** Generated CSS selector for the link */
  selector?: string;
  /** Confidence score 0-1 */
  confidence: number;
  /** Detection method used */
  method: 'rel-attribute' | 'text-matching' | 'pattern';
  /** Link text */
  text?: string;
}

/** Combined navigation detection result */
export interface NavigationResult {
  next: NavLinkResult | null;
  prev: NavLinkResult | null;
  index: NavLinkResult | null;
}

/** Result of title detection */
export interface TitleResult {
  /** Chapter title */
  chapterTitle: string;
  /** Book title (if detected) */
  bookTitle?: string;
  /** CSS selector used */
  selector?: string;
  /** Confidence score 0-1 */
  confidence: number;
  /** Detection method used */
  method: 'selector' | 'document-title' | 'heading' | 'pattern';
}

/** Combined detection results from all detectors */
export interface DetectionResults {
  content: ContentResult;
  navigation: NavigationResult;
  title: TitleResult;
  /** Section detection for multi-page chapters */
  section?: SectionDetectionResult;
}

/** Confidence report with detailed breakdown */
export interface ConfidenceReport {
  /** Overall confidence score 0-1 (weighted average) */
  overall: number;
  /** Content detection confidence */
  content: number;
  /** Navigation detection confidence */
  navigation: number;
  /** Title detection confidence */
  title: number;
  /** Whether overall confidence meets threshold (>= 0.6) */
  isReliable: boolean;
  /** Human-readable reasons for the scores */
  reasons: string[];
}

/** Scoring weights for confidence calculation */
export interface ScoringWeights {
  content: number;
  navigation: number;
  title: number;
}

/** Content candidate during scoring */
export interface ContentCandidate {
  element: Element;
  score: number;
  textLength: number;
  linkDensity: number;
  chineseRatio: number;
}

/** Known content selectors (from existing rule/index.js + migrated rules) */
export const KNOWN_CONTENT_SELECTORS = [
  // ID selectors - primary
  '#pagecontent',
  '#contentbox',
  '#bmsy_content',
  '#bookpartinfo',
  '#htmlContent',
  '#text_area',
  '#chapter_content',
  '#chapterContent',
  '#chaptercontent',
  '#partbody',
  '#BookContent',
  '#read-content',
  '#article_content',
  '#BookTextRead',
  '#booktext',
  '#book_text',
  '#BookText',
  '#BookTextt',
  '#readtext',
  '#readcon',
  '#read',
  '#TextContent',
  '#txtContent',
  '#text_c',
  '#txt_td',
  '#TXT',
  '#txt',
  '#zjneirong',
  '#contentTxt',
  '#oldtext',
  '#a_content',
  '#contents',
  '#content2',
  '#contentts',
  '#content1',
  '#content',
  '#booktxt',
  '#nr',
  '#rtext',
  '#articlecontent',
  '#novelcontent',
  '#text-content',
  '#articlebody',
  '#ChapterContents',
  '#acontent',
  '#chapterinfo',
  '#read_content',
  '#chapter-content',
  // New from rule migration
  '#readerFt',
  '#partContent',
  '#ChapterBody',
  '#showcontent',
  '#luf_news_contents',
  '#tt_text',
  '#J_BookRead',
  '#zjny',
  '#cont-body',
  '#Lab_Contents',
  '#auto-chapter',
  '#readpage_leftntxt',
  // Class selectors
  '.novel_content',
  '.readmain_inner',
  '.noveltext',
  '.booktext',
  '.yd_text2',
  '.articlecontent',
  '.readcontent',
  '.txtnav',
  '.content',
  '.art_con',
  '.article',
  // New from rule migration
  '.read-content',
  '.bookreadercontent',
  '.novelbody',
  '.chapter-item',
  '.noveContent',
  '.con',
  '.Text',
  '.TxtContent',
  '.article-content',
  '.nvl-content',
  '.box_box',
  '.txt_tcontent',
  '.story_content',
  '.chapter_content',
  '.chapter-box',
  // Element selectors
  'article',
] as const;

/** Navigation text patterns */
export const NAV_PATTERNS = {
  next: [
    /下一[页頁章节節篇话話]/,
    /下[页頁章节節话話]/,
    /next/i,
    /^\s*>\s*$/,
    /翻下[页頁]/,
    /[后後]一章/,
    /[继繼][续續][阅閱][读讀]/,
    /下篇/,
    /[后後]篇/,
  ],
  prev: [
    /上一[页頁章节節篇话話]/,
    /上[页頁章节節话話]/,
    /prev/i,
    /^\s*<\s*$/,
    /翻上[页頁]/,
    /前一章/,
    /上篇/,
    /前篇/,
  ],
  index: [
    /^目[录錄]$/,
    /章[节節]目[录錄]/,
    /章[节節]列表/,
    /返回目[录錄]/,
    /回目[录錄]/,
    /回[书書]目/,
    /[书書]目/,
    /[书書][页頁]/,
    /index/i,
    /catalog/i,
  ],
} as const;

/** Title regex for detecting chapter patterns */
export const TITLE_PATTERN =
  /第?\s*[一二两三四五六七八九十○零百千万亿0-9１２３４５６７８９０〇]{1,6}\s*[章回卷节折篇幕集话話]|序章|楔子|番外|后记|尾声|前言|引子|Chapter\s*\d+/i;

/** Positive class/id patterns for content detection */
export const POSITIVE_PATTERNS = [
  /^(content|chapter|article|text|body|main|read|book|novel)/i,
  /内容|正文|章节|小说|阅读/,
];

/** Negative class/id patterns for content detection */
export const NEGATIVE_PATTERNS = [
  /^(nav|header|footer|sidebar|menu|ad|comment|discuss|recommend)/i,
  /(广告|评论|推荐|相关|热门|排行|导航|页眉|页脚)/,
];

/** Section detection result for multi-page chapters (分页章节) */
export interface SectionDetectionResult {
  /** Whether current page is part of multi-page chapter */
  isSection: boolean;
  /** Current section number (1-based, null if not section) */
  currentSection: number | null;
  /** URL for next section (null if this is last section or not a section) */
  nextSectionUrl: string | null;
  /** URL for next chapter (skipping remaining sections) */
  nextChapterUrl: string | null;
  /** Confidence in section detection (0-1) */
  confidence: number;
  /** Detection method */
  method: 'url-pattern' | 'link-text' | 'url-comparison' | 'none';
}
