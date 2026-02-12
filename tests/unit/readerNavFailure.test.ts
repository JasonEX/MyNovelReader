import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  calculateBackoff,
  extractBookId,
  extractChapterNumber,
  extractTocPaginationSeed,
  extractUrlPattern,
  isTocNextPageText,
  isValidTocPaginationUrl,
  normalizeTextForVipDetection,
  normalizeTocPagerText,
  normalizeUrl,
  normalizeUrlForBlock,
  normalizeUrlForCompare,
  normalizeUrlForFetch,
  resolveUrl,
} from '@/ui/stores/reader/utils';
import { clearNavFailure, getNavRetryState, recordNavFailure } from '@/ui/stores/reader/navFailure';

// Also import from barrel to cover index.ts re-exports
import { MAX_NAV_FAILURES, MAX_SESSION_CACHE } from '@/ui/stores/reader/index';

type NavFailureMap = Map<string, { count: number; nextRetryAt: number }>;

describe('calculateBackoff', () => {
  it('returns base delay for first failure', () => {
    expect(calculateBackoff(1)).toBe(1500);
  });

  it('doubles delay for each subsequent failure', () => {
    expect(calculateBackoff(2)).toBe(3000);
    expect(calculateBackoff(3)).toBe(6000);
    expect(calculateBackoff(4)).toBe(12000);
  });

  it('caps at maxMs', () => {
    expect(calculateBackoff(10)).toBe(30000);
    expect(calculateBackoff(20)).toBe(30000);
  });

  it('respects custom baseMs and maxMs', () => {
    expect(calculateBackoff(1, 1000, 5000)).toBe(1000);
    expect(calculateBackoff(3, 1000, 5000)).toBe(4000);
    expect(calculateBackoff(4, 1000, 5000)).toBe(5000); // capped
  });
});

describe('recordNavFailure', () => {
  let failures: NavFailureMap;

  beforeEach(() => {
    failures = new Map();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('records first failure with count=1 and correct backoff', () => {
    const count = recordNavFailure(failures, 'url1', { maxFailures: 200 });
    expect(count).toBe(1);
    expect(failures.get('url1')).toBeDefined();
    expect(failures.get('url1')!.count).toBe(1);
    // backoff for count=1 is 1500ms
    expect(failures.get('url1')!.nextRetryAt).toBe(Date.now() + 1500);
  });

  it('increments count on subsequent failures with exponential backoff', () => {
    recordNavFailure(failures, 'url1', { maxFailures: 200 });
    const count2 = recordNavFailure(failures, 'url1', { maxFailures: 200 });
    expect(count2).toBe(2);
    expect(failures.get('url1')!.count).toBe(2);
    // backoff for count=2 is 3000ms
    expect(failures.get('url1')!.nextRetryAt).toBe(Date.now() + 3000);
  });

  it('trims failures when exceeding maxFailures', () => {
    // Fill up to max
    for (let i = 0; i < 3; i++) {
      vi.setSystemTime(new Date(Date.now() + i * 1000));
      recordNavFailure(failures, `url${i}`, { maxFailures: 3 });
    }
    expect(failures.size).toBe(3);

    // Adding one more should trim the oldest
    vi.setSystemTime(new Date(Date.now() + 5000));
    recordNavFailure(failures, 'url_new', { maxFailures: 3 });
    expect(failures.size).toBe(3);
    // url0 had the earliest nextRetryAt, should be trimmed
    expect(failures.has('url0')).toBe(false);
    expect(failures.has('url_new')).toBe(true);
  });
});

describe('getNavRetryState', () => {
  let failures: NavFailureMap;

  beforeEach(() => {
    failures = new Map();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns non-blocked state for unknown key', () => {
    const state = getNavRetryState(failures, 'unknown');
    expect(state).toEqual({ blocked: false, count: 0 });
  });

  it('returns blocked state when within backoff period', () => {
    failures.set('url1', { count: 2, nextRetryAt: Date.now() + 5000 });
    const state = getNavRetryState(failures, 'url1');
    expect(state.blocked).toBe(true);
    expect(state.count).toBe(2);
  });

  it('returns non-blocked state when backoff period has passed', () => {
    failures.set('url1', { count: 2, nextRetryAt: Date.now() - 1000 });
    const state = getNavRetryState(failures, 'url1');
    expect(state.blocked).toBe(false);
    expect(state.count).toBe(2);
  });

  it('returns non-blocked when nextRetryAt equals now', () => {
    failures.set('url1', { count: 1, nextRetryAt: Date.now() });
    const state = getNavRetryState(failures, 'url1');
    expect(state.blocked).toBe(false);
    expect(state.count).toBe(1);
  });
});

describe('clearNavFailure', () => {
  it('removes the failure record for a key', () => {
    const failures: NavFailureMap = new Map();
    failures.set('url1', { count: 3, nextRetryAt: Date.now() + 10000 });
    failures.set('url2', { count: 1, nextRetryAt: Date.now() + 1000 });

    clearNavFailure(failures, 'url1');
    expect(failures.has('url1')).toBe(false);
    expect(failures.has('url2')).toBe(true);
  });

  it('is a no-op for non-existent key', () => {
    const failures: NavFailureMap = new Map();
    failures.set('url1', { count: 1, nextRetryAt: Date.now() });

    clearNavFailure(failures, 'nonexistent');
    expect(failures.size).toBe(1);
  });
});

// ============ Additional utils.ts coverage ============

describe('reader/utils barrel re-exports', () => {
  it('re-exports constants from index.ts', () => {
    expect(MAX_NAV_FAILURES).toBe(200);
    expect(MAX_SESSION_CACHE).toBe(500);
  });
});

describe('extractTocPaginationSeed', () => {
  it('extracts 3+ digit number from pathname', () => {
    expect(extractTocPaginationSeed('https://example.com/book/12345/')).toBe('12345');
  });

  it('returns null when no 3+ digit number in path', () => {
    expect(extractTocPaginationSeed('https://example.com/book/ab/')).toBeNull();
  });

  it('returns null for invalid URL', () => {
    expect(extractTocPaginationSeed('not a url')).toBeNull();
  });

  it('returns null for short numbers', () => {
    expect(extractTocPaginationSeed('https://example.com/book/12/')).toBeNull();
  });
});

describe('isValidTocPaginationUrl', () => {
  it('returns true for same-origin http(s) URL without seed', () => {
    expect(
      isValidTocPaginationUrl('https://example.com/page/2', 'https://example.com/book/ab/')
    ).toBe(true);
  });

  it('returns false for cross-origin URL', () => {
    expect(
      isValidTocPaginationUrl('https://other.com/page/2', 'https://example.com/book/123/')
    ).toBe(false);
  });

  it('returns false for non-http protocol', () => {
    expect(
      isValidTocPaginationUrl('ftp://example.com/page/2', 'https://example.com/book/123/')
    ).toBe(false);
  });

  it('returns false when seed is present but candidate lacks it', () => {
    expect(
      isValidTocPaginationUrl('https://example.com/other/page', 'https://example.com/book/12345/')
    ).toBe(false);
  });

  it('returns true when candidate includes the seed', () => {
    expect(
      isValidTocPaginationUrl(
        'https://example.com/book/12345/page/2',
        'https://example.com/book/12345/'
      )
    ).toBe(true);
  });

  it('returns false for invalid URLs', () => {
    expect(isValidTocPaginationUrl('not a url', 'https://example.com/')).toBe(false);
  });
});

describe('normalizeUrlForFetch', () => {
  it('removes hash from URL', () => {
    expect(normalizeUrlForFetch('https://example.com/page#section')).toBe(
      'https://example.com/page'
    );
  });

  it('handles invalid URL by stripping hash with regex', () => {
    expect(normalizeUrlForFetch('not-a-url#hash')).toBe('not-a-url');
  });
});

describe('normalizeUrl', () => {
  it('removes trailing slash', () => {
    expect(normalizeUrl('https://example.com/page/')).toBe('https://example.com/page');
  });

  it('removes /index.html', () => {
    expect(normalizeUrl('https://example.com/page/index.html')).toBe('https://example.com/page');
  });

  it('removes /index.htm', () => {
    expect(normalizeUrl('https://example.com/page/index.htm')).toBe('https://example.com/page');
  });
});

describe('normalizeUrlForBlock', () => {
  it('combines fetch and comparison normalization', () => {
    expect(normalizeUrlForBlock('https://example.com/page/#hash')).toBe('https://example.com/page');
  });

  it('handles invalid URL gracefully', () => {
    expect(normalizeUrlForBlock('not-a-url#hash')).toBe('not-a-url');
  });
});

describe('resolveUrl', () => {
  it('resolves relative URL', () => {
    expect(resolveUrl('/chapter/2', 'https://example.com/chapter/1')).toBe(
      'https://example.com/chapter/2'
    );
  });

  it('returns null for invalid URL', () => {
    expect(resolveUrl('://invalid', '://also-invalid')).toBeNull();
  });
});

describe('extractUrlPattern', () => {
  it('replaces numbers with {N}', () => {
    expect(extractUrlPattern('https://example.com/chapter/123/456.html')).toBe(
      '/chapter/{N}/{N}.html'
    );
  });

  it('handles invalid URL by replacing numbers in raw string', () => {
    expect(extractUrlPattern('not-a-url/123/456')).toBe('not-a-url/{N}/{N}');
  });
});

describe('extractBookId', () => {
  it('extracts from /book/123 pattern', () => {
    expect(extractBookId('https://example.com/book/123/chapter/1')).toBe('123');
  });

  it('extracts from /chapter/123/ pattern', () => {
    expect(extractBookId('https://example.com/chapter/456/')).toBe('456');
  });

  it('extracts from /123/456.html pattern', () => {
    expect(extractBookId('https://example.com/123/456.html')).toBe('123');
  });

  it('extracts from /123_456.html pattern', () => {
    expect(extractBookId('https://example.com/123_456.html')).toBe('123');
  });

  it('extracts from query param book_id', () => {
    expect(extractBookId('https://example.com/read?book_id=789')).toBe('789');
  });

  it('returns null when no pattern matches', () => {
    expect(extractBookId('https://example.com/about')).toBeNull();
  });

  it('returns null for invalid URL', () => {
    expect(extractBookId('not a url')).toBeNull();
  });
});

describe('extractChapterNumber', () => {
  it('extracts from 第123章', () => {
    expect(extractChapterNumber('第123章 标题')).toBe(123);
  });

  it('extracts from 第 45 话', () => {
    expect(extractChapterNumber('第 45 话')).toBe(45);
  });

  it('extracts from leading number with dot', () => {
    expect(extractChapterNumber('99. 标题')).toBe(99);
  });

  it('extracts from Chapter 10', () => {
    expect(extractChapterNumber('Chapter 10: Title')).toBe(10);
  });

  it('returns null for no match', () => {
    expect(extractChapterNumber('序章 开始')).toBeNull();
  });
});

describe('normalizeTocPagerText', () => {
  it('collapses whitespace and trims', () => {
    expect(normalizeTocPagerText('  下 一 页  ')).toBe('下一页');
  });
});

describe('isTocNextPageText', () => {
  it('detects 下一页', () => {
    expect(isTocNextPageText('下一页')).toBe(true);
  });

  it('detects 下页', () => {
    expect(isTocNextPageText('下页')).toBe(true);
  });

  it('detects 下一頁 (traditional)', () => {
    expect(isTocNextPageText('下一頁')).toBe(true);
  });

  it('detects "next"', () => {
    expect(isTocNextPageText('next')).toBe(true);
  });

  it('detects "next page"', () => {
    expect(isTocNextPageText('Next Page')).toBe(true);
  });

  it('rejects "next chapter"', () => {
    expect(isTocNextPageText('next chapter')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isTocNextPageText('')).toBe(false);
  });

  it('rejects unrelated text', () => {
    expect(isTocNextPageText('第一章')).toBe(false);
  });
});

describe('normalizeUrlForCompare', () => {
  it('removes hash from URL', () => {
    expect(normalizeUrlForCompare('https://example.com/page#section')).toBe(
      'https://example.com/page'
    );
  });

  it('returns raw string for invalid URL', () => {
    expect(normalizeUrlForCompare('not-a-url')).toBe('not-a-url');
  });
});

describe('normalizeTextForVipDetection', () => {
  it('strips whitespace, ideographic space, punctuation and lowercases', () => {
    expect(normalizeTextForVipDetection('VIP 章节，需要付费！')).toBe('vip章节需要付费');
  });

  it('handles empty string', () => {
    expect(normalizeTextForVipDetection('')).toBe('');
  });
});
