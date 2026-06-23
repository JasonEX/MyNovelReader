import type { BeforeParseHook, SiteRule } from '../types';

const hetushuBeforeParse: BeforeParseHook = async (doc, url, helpers) => {
  try {
    const contentEl = doc.querySelector('#content');
    if (!contentEl) return;

    const win = doc.defaultView || (typeof window !== 'undefined' ? window : null);
    const fallbackUrl =
      typeof window !== 'undefined' && typeof window.location?.href === 'string'
        ? window.location.href
        : '';
    const pageUrl = url || doc.location?.href || fallbackUrl;
    const titleEl = contentEl.querySelector('h2');
    const watermarkSelector =
      'acronym, bdo, big, cite, code, dfn, kbd, q, s, samp, strike, tt, u, var, ins';
    const normalizeWatermarkText = (value: string) =>
      value
        .replace(/[\s\u3000]+/g, '')
        .replace(
          /[ｗwＷW]+[.．•·。]*[hｈ][eｅ][tｔ][uｕ][sｓ][hｈ][uｕ][.．。]*(?:com|ｃｏｍ)(?:[.．。]*(?:com|ｃｏｍ))?/gi,
          ''
        );

    const collectStyleText = async () => {
      const texts = Array.from(doc.querySelectorAll('style'))
        .map(style => style.textContent || '')
        .filter(Boolean);
      const links = Array.from(doc.querySelectorAll('link[rel~="stylesheet"][href]'));
      for (const link of links) {
        if (!helpers?.fetchText) continue;
        try {
          const href = link.getAttribute('href');
          if (!href) continue;
          const styleUrl = new URL(href, pageUrl).href;
          const text = await helpers.fetchText(styleUrl, {
            timeoutMs: 4000,
            withCredentials: true,
          });
          if (text) texts.push(text);
        } catch {
          // Ignore stylesheet fetch failures.
        }
      }
      return texts.join('\n');
    };

    const extractDisplayClasses = (cssText: string) => {
      const block = new Set<string>();
      const none = new Set<string>();
      const ruleRe = /([^{}]+)\{([^{}]+)\}/g;
      let match: RegExpExecArray | null;
      while ((match = ruleRe.exec(cssText))) {
        const selector = match[1] || '';
        const body = match[2] || '';
        if (!selector.includes('#content')) continue;
        const displayBlock = /display\s*:\s*block\b/i.test(body);
        const displayNone = /display\s*:\s*none\b/i.test(body);
        if (!displayBlock && !displayNone) continue;
        const classRe = /#content\s+\.([A-Za-z0-9_-]+)/g;
        let classMatch: RegExpExecArray | null;
        while ((classMatch = classRe.exec(selector))) {
          if (displayBlock) block.add(classMatch[1]);
          if (displayNone) none.add(classMatch[1]);
        }
      }
      return { block, none };
    };

    const styleClasses = extractDisplayClasses(await collectStyleText());
    const hasLayout = (el: Element) => {
      if (!win) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const isVisibleByClass = (el: Element) => {
      const classes = Array.from(el.classList || []);
      if (!classes.length) return false;
      if (classes.some(cls => styleClasses.none.has(cls))) return false;
      if (styleClasses.block.size > 0) return classes.some(cls => styleClasses.block.has(cls));
      return true;
    };
    const isVisible = (el: Element) => {
      if (!win || !hasLayout(el)) return isVisibleByClass(el);
      const style = win.getComputedStyle(el);
      if (style.display === 'none') return false;
      if (style.visibility === 'hidden' || style.visibility === 'collapse') return false;
      if (Number(style.opacity) === 0) return false;
      return true;
    };
    const cleanClone = (el: Element) => {
      const clone = el.cloneNode(true) as Element;
      clone.querySelectorAll(watermarkSelector).forEach(node => node.remove());
      const showText = doc.defaultView?.NodeFilter?.SHOW_TEXT ?? 4;
      const walker = doc.createTreeWalker(clone, showText);
      const textNodes: Node[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(node => {
        const cleaned = normalizeWatermarkText(node.nodeValue || '');
        if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
      });
      return clone;
    };

    const rows = Array.from(contentEl.children)
      .filter(el => el !== titleEl && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE')
      .filter(isVisible)
      .map((el, index) => {
        const rect = win && hasLayout(el) ? el.getBoundingClientRect() : { top: index, left: 0 };
        return {
          index,
          top: rect.top + (win ? win.scrollY : 0),
          left: rect.left + (win ? win.scrollX : 0),
          el,
        };
      })
      .sort((a, b) => a.top - b.top || a.left - b.left || a.index - b.index);

    if (!rows.length) return;
    const fragment = doc.createDocumentFragment();
    if (titleEl) fragment.appendChild(titleEl.cloneNode(true));
    rows.forEach(({ el }) => {
      const paragraph = doc.createElement('p');
      const clone = cleanClone(el);
      paragraph.innerHTML = clone.innerHTML || clone.textContent || '';
      if (paragraph.textContent && paragraph.textContent.replace(/\s+/g, '').trim()) {
        fragment.appendChild(paragraph);
      }
    });

    contentEl.innerHTML = '';
    contentEl.appendChild(fragment);
  } catch (e) {
    console.warn('[MyNovelReader] Hetushu beforeParse error:', e);
  }
};

// 和图书：章节正文通过 CSS/定位打乱顺序，并混入水印标签。
export const hetushuRule: SiteRule = {
  id: 'hetushu',
  name: '和图书',
  version: 2,
  match: {
    pattern: '^https?://www\\.hetushu\\.com/book/\\d+/\\d+\\.html$',
  },
  content: {
    selector: '#content',
    remove: 'h2, acronym, bdo, big, cite, code, dfn, kbd, q, s, samp, strike, tt, u, var, ins',
  },
  navigation: {
    next: 'a#next',
    prev: 'a#pre',
    index: '#left h3 a',
  },
  title: {
    bookSelector: '#left h3',
  },
  hooks: {
    beforeParse: hetushuBeforeParse,
  },
  advanced: {
    useIframe: true,
  },
  meta: { source: 'builtin', exampleUrl: 'https://www.hetushu.com/book/9145/6567989.html' },
};
