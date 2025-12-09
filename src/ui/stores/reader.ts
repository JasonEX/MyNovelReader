/**
 * Reader Store - Manages reading state with infinite scroll support
 */

import { computed, ref } from 'vue';
import { type ConversionMode, convertHTML } from '@/core/converter';
import { defineStore } from 'pinia';
import { getParser } from '@/core/parser';
import type { ParsedChapter } from '@/core/parser';
import type { SiteRule } from '@/core/rules/types';

export interface ReadingProgress {
  /** Chapter URL */
  url: string;
  /** Scroll position (0-100%) */
  scrollPercent: number;
  /** Last read timestamp */
  lastRead: number;
}

/** Chapter entry for infinite scroll */
export interface ChapterEntry {
  chapter: ParsedChapter;
  rule?: SiteRule;
  id: string; // unique ID for Vue key
}

export const useReaderStore = defineStore('reader', () => {
  // State
  const isActive = ref(false);
  const isLoading = ref(false);
  const isLoadingPrev = ref(false);
  const isLoadingNext = ref(false);
  const chapters = ref<ChapterEntry[]>([]);
  const currentChapterIndex = ref(0);
  const error = ref<string | null>(null);
  const scrollPercent = ref(0);
  const history = ref<string[]>([]);
  const loadedUrls = ref<Set<string>>(new Set());
  const originalContents = ref<Map<string, string>>(new Map()); // id -> original HTML
  const currentConversionMode = ref<ConversionMode>('none');

  // Getters - for compatibility
  const chapter = computed(() => chapters.value[currentChapterIndex.value]?.chapter || null);
  const rule = computed(() => chapters.value[currentChapterIndex.value]?.rule || null);
  const title = computed(() => chapter.value?.title || '');
  const bookTitle = computed(() => chapter.value?.bookTitle || '');
  const content = computed(() => chapter.value?.content || '');
  const hasNext = computed(() => {
    const lastChapter = chapters.value[chapters.value.length - 1];
    return !!lastChapter?.chapter.nextUrl;
  });
  const hasPrev = computed(() => {
    const firstChapter = chapters.value[0];
    return !!firstChapter?.chapter.prevUrl;
  });
  const hasIndex = computed(() => !!chapter.value?.indexUrl);
  const confidence = computed(() => chapter.value?.confidence || 0);
  const method = computed(() => chapter.value?.method || 'detection');

  // Actions
  function activate() {
    isActive.value = true;
    error.value = null;
  }

  function deactivate() {
    isActive.value = false;
    chapters.value = [];
    currentChapterIndex.value = 0;
    error.value = null;
    loadedUrls.value.clear();
  }

  function setChapter(newChapter: ParsedChapter, newRule?: SiteRule) {
    const id = `chapter-${Date.now()}-0`;
    // Clear existing chapters and set the initial one
    chapters.value = [
      {
        chapter: newChapter,
        rule: newRule,
        id,
      },
    ];
    currentChapterIndex.value = 0;
    isLoading.value = false;
    error.value = null;
    loadedUrls.value.clear();
    loadedUrls.value.add(newChapter.url);

    // Store original content for text conversion
    originalContents.value.clear();
    originalContents.value.set(id, newChapter.content);

    // Add to history
    if (newChapter.url && !history.value.includes(newChapter.url)) {
      history.value.push(newChapter.url);
      if (history.value.length > 100) {
        history.value = history.value.slice(-100);
      }
    }
  }

  /** Load next chapter and append to list */
  async function loadNextChapter(): Promise<boolean> {
    const lastChapter = chapters.value[chapters.value.length - 1];
    if (!lastChapter?.chapter.nextUrl || isLoadingNext.value) {
      return false;
    }

    const nextUrl = lastChapter.chapter.nextUrl;
    if (loadedUrls.value.has(nextUrl)) {
      return false;
    }

    isLoadingNext.value = true;

    try {
      // Always use referer for better compatibility with anti-scraping
      const referer = lastChapter.chapter.url;

      const doc = await fetchAndParseUrl(nextUrl, referer);
      if (!doc) {
        throw new Error('Failed to fetch page');
      }

      const parser = getParser();
      const parsed = await parser.parse(doc, nextUrl);
      if (!parsed) {
        throw new Error('Failed to parse chapter');
      }

      // Add to chapters list
      const id = `chapter-${Date.now()}-${chapters.value.length}`;
      chapters.value.push({
        chapter: parsed,
        rule: parsed.rule,
        id,
      });
      loadedUrls.value.add(nextUrl);

      // Store original content for text conversion
      originalContents.value.set(id, parsed.content);

      // Apply current conversion mode if active
      if (currentConversionMode.value !== 'none') {
        const converted = await convertHTML(parsed.content, currentConversionMode.value);
        const entry = chapters.value.find(e => e.id === id);
        if (entry) {
          entry.chapter = { ...entry.chapter, content: converted };
        }
      }

      // Add to history
      if (!history.value.includes(nextUrl)) {
        history.value.push(nextUrl);
      }

      return true;
    } catch (e) {
      console.error('[MNR] Failed to load next chapter:', e);
      error.value = '加载下一章失败';
      return false;
    } finally {
      isLoadingNext.value = false;
    }
  }

  /** Load previous chapter and prepend to list */
  async function loadPrevChapter(): Promise<boolean> {
    const firstChapter = chapters.value[0];
    if (!firstChapter?.chapter.prevUrl || isLoadingPrev.value) {
      return false;
    }

    const prevUrl = firstChapter.chapter.prevUrl;

    // Don't load if prevUrl is the index/TOC page (with URL normalization)
    const normalizeUrl = (url: string) => url.replace(/\/$/, '').replace(/\/index\.html?$/, '');
    if (
      firstChapter.chapter.indexUrl &&
      normalizeUrl(prevUrl) === normalizeUrl(firstChapter.chapter.indexUrl)
    ) {
      return false;
    }

    if (loadedUrls.value.has(prevUrl)) {
      return false;
    }

    isLoadingPrev.value = true;

    try {
      // Always use referer for better compatibility with anti-scraping
      const referer = firstChapter.chapter.url;

      const doc = await fetchAndParseUrl(prevUrl, referer);
      if (!doc) {
        throw new Error('Failed to fetch page');
      }

      const parser = getParser();
      const parsed = await parser.parse(doc, prevUrl);
      if (!parsed) {
        throw new Error('Failed to parse chapter');
      }

      // Check if this is a TOC page using multiple heuristics
      const isTocPage = detectTocPage(parsed.content, prevUrl, firstChapter.chapter.url);
      if (isTocPage) {
        loadedUrls.value.add(prevUrl); // Mark as loaded to prevent retry
        return false;
      }

      // Check if the loaded page's "next" URL points to our current first chapter
      // This would indicate we're trying to load the page BEFORE the first chapter
      if (
        parsed.nextUrl &&
        normalizeUrl(parsed.nextUrl) === normalizeUrl(firstChapter.chapter.url)
      ) {
        // This is fine, it's actually the previous chapter
      } else if (parsed.prevUrl && !parsed.nextUrl) {
        // Page has prev but no next - likely a TOC or non-chapter page
        loadedUrls.value.add(prevUrl);
        return false;
      }

      // Prepend to chapters list
      const id = `chapter-${Date.now()}-prev-${chapters.value.length}`;
      chapters.value.unshift({
        chapter: parsed,
        rule: parsed.rule,
        id,
      });
      loadedUrls.value.add(prevUrl);
      currentChapterIndex.value++;

      // Store original content for text conversion
      originalContents.value.set(id, parsed.content);

      // Apply current conversion mode if active
      if (currentConversionMode.value !== 'none') {
        const converted = await convertHTML(parsed.content, currentConversionMode.value);
        const entry = chapters.value.find(e => e.id === id);
        if (entry) {
          entry.chapter = { ...entry.chapter, content: converted };
        }
      }

      // Add to history
      if (!history.value.includes(prevUrl)) {
        history.value.unshift(prevUrl);
      }

      return true;
    } catch (e) {
      console.error('[MNR] Failed to load previous chapter:', e);
      error.value = '加载上一章失败';
      return false;
    } finally {
      isLoadingPrev.value = false;
    }
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  function setError(msg: string) {
    error.value = msg;
    isLoading.value = false;
  }

  function clearError() {
    error.value = null;
  }

  function updateScroll(percent: number) {
    scrollPercent.value = Math.max(0, Math.min(100, percent));
  }

  /** Update current chapter index and browser URL */
  function setCurrentChapter(index: number) {
    if (index < 0 || index >= chapters.value.length) return;
    if (currentChapterIndex.value === index) return;

    currentChapterIndex.value = index;
    const chapterEntry = chapters.value[index];
    if (chapterEntry?.chapter.url) {
      // Update browser URL without reloading
      try {
        window.history.replaceState({ mnrChapter: index }, '', chapterEntry.chapter.url);
      } catch {
        // Ignore errors (cross-origin restrictions etc.)
      }
    }
  }

  function getProgress(): ReadingProgress | null {
    if (!chapter.value?.url) return null;
    return {
      url: chapter.value.url,
      scrollPercent: scrollPercent.value,
      lastRead: Date.now(),
    };
  }

  /** Apply text conversion to all chapters */
  async function applyTextConversion(mode: ConversionMode): Promise<void> {
    currentConversionMode.value = mode;

    if (mode === 'none') {
      // Restore original content
      for (const entry of chapters.value) {
        const original = originalContents.value.get(entry.id);
        if (original && entry.chapter.content !== original) {
          entry.chapter = { ...entry.chapter, content: original };
        }
      }
    } else {
      // Convert all chapters
      for (const entry of chapters.value) {
        const original = originalContents.value.get(entry.id);
        if (original) {
          const converted = await convertHTML(original, mode);
          entry.chapter = { ...entry.chapter, content: converted };
        }
      }
    }
  }

  function $reset() {
    isActive.value = false;
    isLoading.value = false;
    isLoadingPrev.value = false;
    isLoadingNext.value = false;
    chapters.value = [];
    currentChapterIndex.value = 0;
    error.value = null;
    scrollPercent.value = 0;
    loadedUrls.value.clear();
    originalContents.value.clear();
    currentConversionMode.value = 'none';
  }

  return {
    // State
    isActive,
    isLoading,
    isLoadingPrev,
    isLoadingNext,
    chapters,
    currentChapterIndex,
    chapter,
    rule,
    error,
    scrollPercent,
    history,

    // Getters
    title,
    bookTitle,
    content,
    hasNext,
    hasPrev,
    hasIndex,
    confidence,
    method,

    // Actions
    activate,
    deactivate,
    setChapter,
    setCurrentChapter,
    loadNextChapter,
    loadPrevChapter,
    setLoading,
    setError,
    clearError,
    updateScroll,
    getProgress,
    applyTextConversion,
    $reset,
  };
});

/** Get GM_xmlhttpRequest function */
function getGmXhr(): typeof GM_xmlhttpRequest | null {
  if (typeof GM_xmlhttpRequest === 'function') {
    return GM_xmlhttpRequest;
  }
  return null;
}

/** Fetch URL and return parsed Document */
async function fetchAndParseUrl(url: string, referer?: string): Promise<Document | null> {
  const gmXhr = getGmXhr();

  if (!gmXhr) {
    console.error('[MNR] GM_xmlhttpRequest not available');
    return null;
  }

  return new Promise(resolve => {
    const headers: Record<string, string> = {
      Accept: 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    };
    if (referer) {
      headers['Referer'] = referer;
    }
    gmXhr({
      method: 'GET',
      url,
      headers,
      overrideMimeType: 'text/html;charset=' + document.characterSet,
      onload: response => {
        if (response.status >= 200 && response.status < 300) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            // Set base URL for relative links
            const base = doc.createElement('base');
            base.href = url;
            doc.head.insertBefore(base, doc.head.firstChild);
            // Store URL in a custom property (location may not be configurable)
            (doc as Document & { _mnrUrl: string })._mnrUrl = url;
            resolve(doc);
          } catch (e) {
            console.error('[MNR] Parse error:', e);
            resolve(null);
          }
        } else {
          console.error('[MNR] HTTP error:', response.status);
          resolve(null);
        }
      },
      onerror: err => {
        console.error('[MNR] Request error:', err);
        resolve(null);
      },
      ontimeout: () => {
        console.error('[MNR] Request timeout');
        resolve(null);
      },
    });
  });
}

/**
 * Detect if content looks like a Table of Contents page
 * Uses multiple heuristics to identify TOC pages
 */
function detectTocPage(content: string, pageUrl: string, currentChapterUrl: string): boolean {
  // Heuristic 0: URL pattern suggests index/book page
  const tocUrlPatterns = [
    /\/book\/\d+\.html?$/i, // /book/123.htm
    /\/book\/\d+\/?$/i, // /book/123/ or /book/123
    /\/novel\/\d+\/?$/i, // /novel/123/
    /\/xiaoshuo\/\d+\/?$/i, // /xiaoshuo/123/
    /\/info\/\d+\.html?$/i, // /info/123.html
    /\/\d+\/index\.html?$/i, // /123/index.html
    /\/booklist/i, // /booklist
    /\/catalog/i, // /catalog
    /\/contents?\.html?$/i, // /content.html or /contents.html
    /\/list\.html?$/i, // /list.html
    /\/toc\.html?$/i, // /toc.html
  ];

  for (const pattern of tocUrlPatterns) {
    if (pattern.test(pageUrl)) {
      return true;
    }
  }

  // Heuristic 0.5: Compare URL structures - chapter URLs usually have different pattern than index
  try {
    const currentPath = new URL(currentChapterUrl).pathname;
    const pagePath = new URL(pageUrl).pathname;

    // If current chapter is like /txt/123/456 but page is like /book/123, it's likely TOC
    const chapterPattern = /\/(txt|read|chapter|article)\/\d+\/\d+/i;
    const bookPattern = /\/(book|novel|info|xiaoshuo)\/\d+/i;

    if (chapterPattern.test(currentPath) && bookPattern.test(pagePath)) {
      return true;
    }
  } catch {
    // URL parsing failed, continue with other checks
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const textContent = tempDiv.textContent || '';
  const textLength = textContent.length;
  const links = tempDiv.querySelectorAll('a');
  const linkCount = links.length;

  // Heuristic 1: Very short content with many links
  if (textLength < 500 && linkCount > 10) {
    return true;
  }

  // Heuristic 2: High link-to-text ratio (TOC pages are mostly links)
  const linkTextLength = Array.from(links).reduce(
    (sum, a) => sum + (a.textContent?.length || 0),
    0
  );
  const linkRatio = textLength > 0 ? linkTextLength / textLength : 0;
  if (linkRatio > 0.6 && linkCount > 8) {
    return true;
  }

  // Heuristic 3: Many links pointing to chapter-like URLs
  const chapterLinkPattern = /\/(chapter|txt|read|book|novel|article)\/|\d+\.html?$/i;
  const chapterLinks = Array.from(links).filter(a => {
    const href = a.getAttribute('href') || '';
    return chapterLinkPattern.test(href);
  });
  if (chapterLinks.length > 10) {
    return true;
  }

  // Heuristic 4: Contains link to the current chapter (we're on a page listing chapters)
  const normalizeUrl = (url: string) => {
    try {
      const u = new URL(url, pageUrl);
      return u.pathname.replace(/\/$/, '');
    } catch {
      return url.replace(/\/$/, '');
    }
  };
  const currentPath = normalizeUrl(currentChapterUrl);
  const hasLinkToCurrentChapter = Array.from(links).some(a => {
    const href = a.getAttribute('href');
    if (!href) return false;
    return normalizeUrl(href) === currentPath;
  });
  if (hasLinkToCurrentChapter && linkCount > 5) {
    return true;
  }

  // Heuristic 5: Title/content contains TOC-related keywords
  const tocKeywords = [
    '目录',
    '章节列表',
    '章节目录',
    '全部章节',
    '最新章节',
    '小说目录',
    'table of contents',
    'toc',
    'catalog',
    'index',
  ];
  const pageText = textContent.toLowerCase();
  const keywordMatches = tocKeywords.filter(kw => pageText.includes(kw.toLowerCase()));
  if (keywordMatches.length >= 2 || (keywordMatches.length >= 1 && linkCount > 15)) {
    return true;
  }

  // Heuristic 6: Content is structured like a list (many similar short links)
  const linkTexts = Array.from(links)
    .map(a => a.textContent?.trim() || '')
    .filter(t => t.length > 0);
  const chapterNamePattern = /^第.{1,10}[章节回话篇集卷]/;
  const chapterNameLinks = linkTexts.filter(t => chapterNamePattern.test(t));
  if (chapterNameLinks.length > 5) {
    return true;
  }

  return false;
}
