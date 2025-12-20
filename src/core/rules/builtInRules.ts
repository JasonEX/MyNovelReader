/**
 * Built-in Rules for MyNovelReader 2.0
 *
 * These are rules that CANNOT be auto-detected and require specific selectors or special processing.
 *
 * Rule Categories:
 * - Category A (deleted): Auto-detectable by detection engine - NOT included here
 * - Category B (simplified): Custom selectors but no special processing
 * - Category C (full): Special processing (contentPatch, useiframe, mutations, etc.)
 *
 * Migration Notes:
 * - Original 96 rules reduced to ~55 essential rules
 * - Detection engine enhanced with 87 known selectors (from 62)
 * - Auto-detection coverage increased to ~85%
 */

import { SiteRule } from './types';

/**
 * Category C: Rules with special processing
 * These require contentPatch, getContent, mutations, iframe, or VIP detection
 */
const specialRules: SiteRule[] = [
  // Qidian (起点) - VIP chapters, dynamic content
  {
    id: 'qidian',
    name: '起点中文网',
    version: 8,
    match: {
      pattern: '^https?://(www|m)\\.qidian\\.com/chapter/.*',
    },
    content: {
      selector: 'main[id^="c-"]',
      remove: '.review, #r-titlePage, .tooltip-wrapper, .chapter-end-qrcode, section[id^="r-"]',
    },
    navigation: {
      // #mnr-qidian-* are created by beforeParse hook from JSON data
      // Fallback selectors for DOM-based navigation
      prev: '#mnr-qidian-prev, .nav-btn-group a:contains("上一章"), a.nav-btn:contains("上一章")',
      index: '#mnr-qidian-index',
      next: '#mnr-qidian-next, .nav-btn-group a:contains("下一章"), a.nav-btn:contains("下一章")',
    },
    title: {
      selector: 'h1.title, h1.text-1\\.3em, #r-nav-chapter-title',
    },
    hooks: {
      // Build navigation links from pageContext JSON (SSR data)
      beforeParse: `
        // Remove review count from title
        try {
          const reviews = doc.querySelectorAll('h1 .review');
          reviews.forEach(el => el.remove());
        } catch (e) {}

        try {
          const script = doc.querySelector('#vite-plugin-ssr_pageContext');
          if (script) {
            const data = JSON.parse(script.textContent);
            const pageData = data.pageContext?.pageProps?.pageData;
            if (pageData) {
              const bookId = pageData.bookInfo?.bookId;
              const chapterInfo = pageData.chapterInfo;
              const host = url ? new URL(url).hostname : location.hostname;
              const navContainer = doc.createElement('div');
              navContainer.id = 'mnr-qidian-nav';
              navContainer.style.display = 'none';
              if (chapterInfo?.prev && chapterInfo.prev !== -1) {
                const prev = doc.createElement('a');
                prev.id = 'mnr-qidian-prev';
                prev.href = '//' + host + '/chapter/' + bookId + '/' + chapterInfo.prev + '/';
                prev.textContent = '上一章';
                navContainer.appendChild(prev);
              }
              if (chapterInfo?.next && chapterInfo.next !== -1) {
                const next = doc.createElement('a');
                next.id = 'mnr-qidian-next';
                next.href = '//' + host + '/chapter/' + bookId + '/' + chapterInfo.next + '/';
                next.textContent = '下一章';
                navContainer.appendChild(next);
              }
              if (bookId) {
                const index = doc.createElement('a');
                index.id = 'mnr-qidian-index';
                index.href = '//' + host + '/book/' + bookId + '/catalog/';
                index.textContent = '目录';
                navContainer.appendChild(index);
              }
              doc.body.appendChild(navContainer);
            }
          }
        } catch (e) {
          console.warn('[MyNovelReader] Qidian beforeParse error:', e);
        }
      `,
    },
    advanced: {
      useIframe: true,
      mutationSelector: 'main[id^="c-"]',
      mutationChildCount: 0,
    },
    meta: { source: 'builtin' },
  },

  // Chuangshi (创世) - Complex getContent
  {
    id: 'chuangshi',
    name: '创世中文网',
    version: 1,
    match: {
      pattern:
        '^https?://(?:chuangshi|yunqi)\\.qq\\.com/|^http://dushu\\.qq\\.com/read.html\\?bid=',
    },
    content: {
      selector: '.bookreadercontent',
    },
    navigation: {
      next: '#rightFloatBar_nextChapterBtn',
      prev: '#rightFloatBar_preChapterBtn',
    },
    title: {
      selector: '.story_title > h1',
      bookSelector: '.bookNav > a:last()',
    },
    processing: {
      removeAds: false,
      useSiteFont: true,
    },
    advanced: {
      mutationSelector: '#chaptercontainer',
      mutationChildCount: 1,
    },
    meta: { source: 'builtin' },
  },

  // Ciweimao (刺猬猫)
  {
    id: 'ciweimao',
    name: '刺猬猫',
    version: 1,
    match: {
      pattern: '^https?://www\\.ciweimao\\.com/chapter/\\d+',
    },
    content: {
      selector: '#J_BookRead',
      remove: 'i.J_Num, .chapter span, #J_BookRead_WaterMark, .watermark',
    },
    title: {
      selector: '.read-hd .chapter',
      bookSelector: '.breadcrumb > a:last()',
    },
    advanced: {
      useIframe: true,
      mutationSelector: '#J_BookRead',
      mutationChildCount: 2,
      timeout: 3000,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.ciweimao.com/chapter/102930784' },
  },

  // Gongzicp (长佩)
  {
    id: 'gongzicp',
    name: '长佩文学网',
    version: 1,
    match: {
      pattern: '^https?://www\\.gongzicp\\.com/read-\\d+\\.html',
    },
    content: {
      selector: '.content',
      replace: [{ pattern: '来源长佩文学网（https://www\\.gongzicp\\.com）', replacement: '' }],
    },
    title: {
      bookSelector: '.novel',
    },
    advanced: {
      useIframe: true,
      mutationSelector: '.novel',
      mutationChildCount: 2,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.gongzicp.com/read-246381.html' },
  },

  // 69shu - iframe + referer
  {
    id: '69shu',
    name: '69书吧',
    version: 1,
    match: {
      pattern:
        'https?://(www\\.)?69(shu|yuedu)[a-z0-9]*?\\.(pro|top|com|cx|net|co|me|biz)/(txt|c|r)/',
    },
    content: {
      selector: '.txtnav',
      remove: '.txtinfo.hide720, #txtright, .bottom-ad, .bottom-ad2',
      replace: [{ pattern: '.*[6六].*[9九].*书.*吧.*', replacement: '' }],
    },
    navigation: {
      next: '.page1 a:nth-child(4)',
      prev: '.page1 a:nth-child(1)',
      index: '.page1 a:nth-child(3)',
    },
    title: {
      selector: 'h1',
      bookSelector: '.txtinfo a:first-child, .con_top a:nth-child(3)',
    },
    advanced: {
      useIframe: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.69shuba.com/txt/46867/31307961' },
  },

  // Hetushu (和图书) - Content order scrambled
  {
    id: 'hetushu',
    name: '和图书',
    version: 1,
    match: {
      pattern: '^https?://www.hetushu.com/book/\\d+/\\d+.html',
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
    advanced: {
      useIframe: true,
    },
    meta: { source: 'builtin', exampleUrl: 'http://www.hetushu.com/book/1421/964983.html' },
  },

  // Weread (微信读书) - Canvas rendering
  {
    id: 'weread',
    name: '微信读书',
    version: 1,
    match: {
      pattern: 'https?://weread\\.qq\\.com/web/reader/.*?',
    },
    content: {
      selector: '.wr_canvasContainer',
    },
    navigation: {
      next: '#nextchapter',
      prev: '#prevchapter',
      index: '#bookindex',
    },
    title: {
      selector: '.chapterTitle',
    },
    processing: {
      removeAds: false,
      useRawContent: true,
    },
    advanced: {
      useIframe: true,
      mutationSelector: '.wr_canvasContainer',
      mutationChildCount: 1,
    },
    meta: { source: 'builtin' },
  },

  // Alafaxs (阿拉法) - iframe + mutation
  {
    id: 'alafaxs',
    name: '阿拉法小说网',
    version: 1,
    match: {
      pattern: 'https?://www.alafaxs.com/du/\\d+/\\d+.html',
    },
    content: {
      selector: '#txt',
    },
    title: {
      bookSelector: '.chapter-nav > p:first > a:last()',
    },
    advanced: {
      useIframe: true,
      mutationSelector: '#txt',
      mutationChildCount: 0,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.alafaxs.com/du/80/856585.html' },
  },

  // Bilinovel (哔哩轻小说) - Section pages
  {
    id: 'bilinovel',
    name: '哔哩轻小说',
    version: 1,
    match: {
      pattern: 'https://(www|tw)\\.(bilinovel|linovelib)\\.com/novel/\\d+/\\d+(_\\d+)?\\.html',
    },
    content: {
      selector: '.acontent, .bcontent',
    },
    navigation: {
      next: '#footlink > a:nth-child(4)',
      prev: '#footlink > a:nth-child(1)',
      index: '#footlink > a:nth-child(2)',
    },
    title: {
      selector: '#atitle',
    },
    advanced: {
      useIframe: true,
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.bilinovel.com/novel/4048/227859.html' },
  },

  // 69shux - New domain
  {
    id: '69shux',
    name: '69shux',
    version: 1,
    match: {
      pattern: 'https://69shux.com/txt/\\d+/\\d+',
    },
    content: {
      selector: '.txtnav',
      remove: '.txtinfo.hide720, #txtright, .err_tips',
    },
    navigation: {
      next: '.page1 a:nth-child(4)',
      prev: '.page1 a:nth-child(1)',
      index: '.page1 a:nth-child(3)',
    },
    title: {
      selector: 'h1',
    },
    advanced: {
      useIframe: true,
      iframeSandbox: 'allow-same-origin allow-scripts',
    },
    meta: { source: 'builtin', exampleUrl: 'https://69shux.com/txt/59608/41087519' },
  },

  // 顶点小说 (ddxsmf) - AJAX + scroll lazy load
  {
    id: 'ddxsmf',
    name: '顶点小说',
    version: 1,
    match: {
      pattern: '^https?://(?:www\\.)?ddxsmf\\.com/read/\\d+/\\d+\\.html(?:[?#].*)?$',
    },
    content: {
      selector: '#chapter-content',
    },
    navigation: {
      prev: '.page-prev',
      next: '.page-next',
      index: '.page-index',
    },
    title: {
      selector: 'h1',
    },
    hooks: {
      beforeParse: `
        try {
          const contentEl = doc.querySelector('#chapter-content');
          if (contentEl) {
            contentEl.setAttribute('data-mnr-loading', '1');
            const currentUrl = url || doc.location?.href || window.location.href;
            const urlObj = new URL(currentUrl);
            const parts = urlObj.pathname.split('/').filter(Boolean);
            try {
              if (parts[0] === 'read' && parts[1] && parts[2]) {
                const aid = parseInt(parts[1], 10);
                const cid = parseInt(parts[2].split('.')[0], 10);
                if (aid && cid && helpers?.fetchJson) {
                  const apiUrl = new URL('/modules/article/ajax_chapter.php', urlObj.origin);
                  apiUrl.searchParams.set('aid', String(aid));
                  apiUrl.searchParams.set('cid', String(cid));
                  const headers = {
                    'X-Requested-With': 'XMLHttpRequest',
                  };
                  if (currentUrl) {
                    headers.Referer = currentUrl;
                  }
                  const payload = await helpers.fetchJson(apiUrl.toString(), {
                    timeoutMs: 4000,
                    headers,
                  });
                  const html = payload?.data?.content;
                  if (html) {
                    contentEl.innerHTML = html;
                  }
                }
              }
            } catch (e) {
              console.warn('[MyNovelReader] ddxsmf content fetch error:', e);
            } finally {
              contentEl.removeAttribute('data-mnr-loading');
            }
          }
          const scripts = Array.from(doc.querySelectorAll('script'))
            .map(script => script.textContent || '')
            .join('\\n');
          const loadIndex = scripts.indexOf('function loadChapter');
          if (loadIndex !== -1) {
            const rest = scripts.slice(loadIndex);
            const endIndex = rest.indexOf('function initPaginationButtons');
            const block = endIndex !== -1 ? rest.slice(0, endIndex) : rest;
            const prevMatch = block.match(
              /direction\\s*===\\s*['"]prev['"][\\s\\S]*?chapterUrl\\s*=\\s*['"]([^'"]*)['"]/
            );
            const nextMatch = block.match(
              /else\\s*\\{[\\s\\S]*?chapterUrl\\s*=\\s*['"]([^'"]*)['"]/
            );
            const normalize = value => {
              try {
                return new URL(value, doc.location?.href || window.location.href).href;
              } catch {
                return value;
              }
            };
            const prevRaw = prevMatch?.[1] || '';
            const nextRaw = nextMatch?.[1] || '';
            const prevUrl = prevRaw && prevRaw !== '#' ? normalize(prevRaw) : '';
            const nextUrl = nextRaw && nextRaw !== '#' ? normalize(nextRaw) : '';
            const prevEl = doc.querySelector('.page-prev');
            const nextEl = doc.querySelector('.page-next');
            if (prevEl && prevUrl && prevUrl !== '#') prevEl.setAttribute('href', prevUrl);
            if (nextEl && nextUrl && nextUrl !== '#') nextEl.setAttribute('href', nextUrl);
          }
          const indexEl = doc.querySelector('.page-index');
          const indexHref = indexEl?.getAttribute('data-href');
          if (indexEl && indexHref) {
            indexEl.setAttribute('href', indexHref);
          }
        } catch (e) {
          console.warn('[MyNovelReader] ddxsmf beforeParse error:', e);
        }
      `,
    },
    advanced: {
      mutationSelector: '#chapter-content',
      mutationChildCount: 1,
      timeout: 2000,
      noSection: true,
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'https://www.ddxsmf.com/read/27543/9719752.html',
    },
  },
];

/**
 * Category B: Rules with custom selectors but no special processing
 * These can't be auto-detected but don't need iframe/mutations
 */
const simplifiedRules: SiteRule[] = [
  // 我的书城网（章节正文存在混入的转义标签和反爬噪声）
  {
    id: 'wodeshucheng',
    name: '我的书城网',
    version: 1,
    match: {
      pattern: '^https?://www\\.wodeshucheng\\.net/.*?\\.html$',
    },
    content: {
      selector: '#content',
      remove: '.appguide-wrap, .section-opt, .btn-addbs, .reader-fun',
      replace: [
        // 清除正文内被转义的段落、换行标签
        { pattern: '&lt;/?p&gt;', replacement: '', flags: 'gi' },
        { pattern: '&lt;br\\s*/?&gt;', replacement: '', flags: 'gi' },
        { pattern: '&lt;script[^>]*&gt;.*?&lt;/script&gt;', replacement: '', flags: 'gi' },
        // 去掉夹杂的反爬噪声（包含反斜杠的乱码片段）
        { pattern: '\\\\[^\\s<]{2,}', replacement: '', flags: 'g' },
        // 清理混杂符号的伪域名/反爬噪声
        {
          pattern: '[a-z0-9](?:[^\\u4e00-\\u9fff\\s]{1,3}[a-z0-9]){4,}',
          replacement: '',
          flags: 'gi',
        },
        // 常见的“更新最快”变体广告（带少量噪声）
        {
          pattern:
            '小[^\\u4e00-\\u9fff]{0,3}说[^\\u4e00-\\u9fff]{0,3}网[^\\u4e00-\\u9fff]{0,6}最[^\\u4e00-\\u9fff]{0,3}新[^\\u4e00-\\u9fff]{0,3}章[^\\u4e00-\\u9fff]{0,3}节[^\\u4e00-\\u9fff]{0,6}更[^\\u4e00-\\u9fff]{0,3}新[^\\u4e00-\\u9fff]{0,3}快',
          replacement: '',
          flags: 'gi',
        },
        // 特定噪声短语（稀有字形混入）
        { pattern: '武\\d?墈书\\s*庚薪嶵筷', replacement: '', flags: 'g' },
        // 清理尾部插入的脚本标记或碎片
        { pattern: 'chapter_\\(\\);?', replacement: '', flags: 'gi' },
        { pattern: 'script\\/script', replacement: '', flags: 'gi' },
        // 移除以“#?”开头的乱码提示
        { pattern: '#\\?[^<\\n]{0,80}', replacement: '', flags: 'g' },
      ],
    },
    navigation: {
      prev: '#prev_url',
      index: '#info_url',
      next: '#next_url',
    },
    title: {
      selector: 'h1.title',
      bookSelector: '.layout-tit a[title]',
    },
    advanced: {
      checkSection: true,
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'https://www.wodeshucheng.net/book_95122894/455913227.html',
    },
  },

  // 零点看书 / 文库吧系（示例：23.225.121.247/ldks/111291/42509753_2.html）
  // 特点：
  // - 同一章分页：/42509753.html -> /42509753_2.html（下一页），最后一页才出现“下一章”
  // - 目录页：/ldks/{bookId}/（章节列表）
  {
    id: 'ldks-2baoe',
    name: '零点看书（ldks）',
    version: 1,
    match: {
      pattern:
        '^https?://(?:23\\.225\\.121\\.247|www\\.2baoe\\.com)/ldks/\\d+/\\d+(?:[_-]\\d+)?\\.html$',
    },
    content: {
      selector: '#content',
      // 正文里不需要标题；导航/脚本也不需要
      remove: 'h1.title, script',
    },
    navigation: {
      prev: '.section-opt a:contains("上一章"), .section-opt a:contains("上一页")',
      index: '.section-opt a:contains("章节列表"), a:contains("章节列表")',
      next: '.section-opt a:contains("下一章"), .section-opt a:contains("下一页")',
    },
    title: {
      selector: 'h1.title',
    },
    advanced: {
      checkSection: true,
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'http://23.225.121.247/ldks/111291/42509753_2.html',
    },
  },

  // Zongheng (纵横中文网)
  {
    id: 'zongheng-book',
    name: '纵横中文网',
    version: 1,
    match: {
      pattern: '^https?://book\\.zongheng\\.com/\\S+\\/\\d+\\.html$',
    },
    content: {
      selector: '#readerFt',
      remove: '.watermark',
    },
    title: {
      selector: "em[itemprop='headline']",
      bookSelector: '.tc h2',
    },
    processing: {
      removeAds: false,
    },
    meta: { source: 'builtin' },
  },
  {
    id: 'zongheng-read',
    name: '纵横中文网-read',
    version: 1,
    match: {
      pattern: 'https?://read\\.zongheng\\.com/chapter/\\d+\\/\\d+\\.html',
    },
    content: {
      selector: '.content',
      remove: '.Jfcounts',
    },
    title: {
      selector: '.title_txtbox',
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'https://read.zongheng.com/chapter/1251858/72302352.html',
    },
  },

  // JJWXC Mobile
  {
    id: 'jjwxc-mobile',
    name: '晋江文学城_手机版',
    version: 1,
    match: {
      pattern: '^https?://(?:wap|m)\\.jjwxc\\.(?:net|com)/(?:book2|vip)/\\d+/\\d+',
    },
    content: {
      selector: 'div.grid-c > div > .b.module > div:first',
    },
    title: {
      selector: 'h2',
      pattern: '《(.*?)》.*[ˇ^](.*?)[ˇ^].*',
    },
    meta: { source: 'builtin' },
  },

  // Xiaoxiang (潇湘书院)
  {
    id: 'xxsy',
    name: '潇湘书院',
    version: 1,
    match: {
      pattern: '^https?://www\\.xxsy\\.net/chapter/.*\\.html',
    },
    content: {
      selector: '#auto-chapter',
      replace: [{ pattern: '本书由潇湘书院首发，请勿转载！', replacement: '' }],
    },
    navigation: {
      next: '.chapter-next',
      index: '.bread > a:last()',
    },
    title: {
      pattern: '(.*?)_(.*)_全文阅读',
    },
    processing: {
      removeAds: false,
    },
    meta: { source: 'builtin' },
  },

  // Zhulang (逐浪)
  {
    id: 'zhulang',
    name: '逐浪',
    version: 1,
    match: {
      pattern: '^https?://book\\.zhulang\\.com/.*\\.html',
    },
    content: {
      selector: '#readpage_leftntxt',
    },
    title: {
      pattern: '(.*?)-(.*)',
    },
    processing: {
      removeAds: false,
    },
    meta: { source: 'builtin' },
  },

  // Readnovel (小说阅读网)
  {
    id: 'readnovel',
    name: '小说阅读网',
    version: 1,
    match: {
      pattern: '^https?://www\\.readnovel\\.com/novel/.*\\.html',
    },
    content: {
      selector: '#article, .zhangjie',
      remove: 'div[style], .miaoshu, .zhichi, .bottomAdbanner',
    },
    title: {
      selector: '.bgtop > h1',
      bookSelector: '.nownav > a:eq(4)',
    },
    meta: { source: 'builtin' },
  },

  // Tieba (贴吧)
  {
    id: 'tieba',
    name: '百度贴吧（手动启用）',
    version: 1,
    match: {
      pattern: '^https?://tieba\\.baidu.com/p/',
    },
    content: {
      selector: '#j_p_postlist',
      remove: '#sofa_post, .d_author, .share_btn_wrapper, .core_reply, .j_user_sign',
    },
    navigation: {
      next: false,
      prev: false,
      index: 'a.card_title_fname',
    },
    title: {
      selector: 'h1.core_title_txt',
      bookSelector: '.card_title_fname',
    },
    style:
      '.clear { border-top:1px solid #cccccc; margin-bottom: 50px; visibility: visible !important;}',
    meta: { source: 'builtin' },
  },

  // 17k
  {
    id: '17k',
    name: '17k小说网',
    version: 1,
    match: {
      pattern: '^https?://\\S+\\.17k\\.com/chapter/\\S+/\\d+\\.html$',
    },
    content: {
      selector: '#chapterContent',
      remove:
        '.chapter_update_time, h1, .qrcode, #authorSpenk, .like_box, #hotRecommend, .ct0416, .recent_read, #miniVoteBox, .copy',
    },
    title: {
      pattern: '(.*?)-(.*?)-.*',
    },
    meta: { source: 'builtin' },
  },

  // Tadu (塔读)
  {
    id: 'tadu',
    name: '塔读文学',
    version: 1,
    match: {
      pattern: '^https?://www\\.tadu\\.com/book/\\d+/\\d+/?',
    },
    content: {
      selector: '#partContent',
    },
    title: {
      selector: 'h4',
      bookSelector: '.chapter_details > span',
    },
    advanced: {
      useIframe: true,
      mutationSelector: '#partContent',
      mutationChildCount: 0,
    },
    meta: { source: 'builtin' },
  },

  // SF
  {
    id: 'sfacg',
    name: 'SF 轻小说',
    version: 1,
    match: {
      pattern: '^https?://book.sfacg.com/Novel/\\d+/\\d+/\\d+/',
    },
    content: {
      selector: '#ChapterBody',
    },
    title: {
      pattern: '(.*?)-(.*?)-.*',
    },
    meta: { source: 'builtin', exampleUrl: 'https://book.sfacg.com/Novel/601991/795722/7137683/' },
  },

  // Piaotia (飘天)
  {
    id: 'piaotia',
    name: '飘天文学',
    version: 1,
    match: {
      pattern: '^https?://www\\.piaotia\\.com/html/\\d+/\\d+/\\d+\\.html',
    },
    content: {
      selector: '#content',
      remove: 'h1, table, .toplink',
    },
    title: {
      bookSelector: '#content > h1 > a',
    },
    advanced: {
      useIframe: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.piaotia.com/html/15/15083/10323993.html' },
  },

  // Shuhai (书海)
  {
    id: 'shuhai',
    name: '书海小说',
    version: 1,
    match: {
      pattern: '^https?://www\\.shuhai\\.com/read/\\d+/\\d+\\.html',
    },
    content: {
      selector: '.chapter-item',
      remove: '.chaper-info',
    },
    title: {
      selector: '.chapter-name',
      bookSelector: '.tip > a:last',
    },
    meta: { source: 'builtin', exampleUrl: 'http://www.shuhai.com/read/110773/1.html' },
  },

  // Lucifer Club
  {
    id: 'lucifer-club',
    name: '露西弗俱乐部',
    version: 1,
    match: {
      pattern: '^https://www\\.lucifer-club\\.com/.*\\.html',
    },
    content: {
      selector: '#luf_news_contents',
      remove: '> form, #luf_local, .luf_top_ad, .luf_news_title, .luf_page_control, .luf_comment',
      replace: [
        { pattern: '保护版权 尊重作者 @ 露西弗俱乐部 www\\.lucifer-club\\.com', replacement: '' },
      ],
    },
    navigation: {
      index: '.luf_news_title > a:contains("目录")',
    },
    title: {
      bookSelector: '#luf_local > a:nth-child(3)',
    },
    processing: {
      removeAds: false,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.lucifer-club.com/chapter-83716-1.html' },
  },

  // Shushan (书山中文网)
  {
    id: 'shushan',
    name: '书山中文网',
    version: 1,
    match: {
      pattern: 'https?://shushan\\.zhangyue\\.net/book/\\d+/\\d+/',
    },
    content: {
      selector: '.art_con',
    },
    navigation: {
      next: '.next-cha',
      prev: '.last-cha',
      index: 'a:contains(书页)',
    },
    meta: { source: 'builtin', exampleUrl: 'https://shushan.zhangyue.net/book/105835/15038074/' },
  },

  // ESJ Zone
  {
    id: 'esjzone',
    name: 'ESJ',
    version: 1,
    match: {
      pattern: '^https?://www\\.esjzone\\.(?:me|cc)/forum/\\d+/\\d+\\.html',
    },
    content: {
      selector: '.mt-3.forum-content',
    },
    navigation: {
      next: '.btn-next.btn-sm.btn-outline-secondary.btn',
      prev: '.btn-prev.btn-sm.btn-outline-secondary.btn',
      index: '.view-all.btn-outline-secondary.btn',
    },
    title: {
      selector: 'h2',
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.esjzone.cc/forum/1677032544/162585.html' },
  },

  // Masiro (真白萌)
  {
    id: 'masiro',
    name: '真白萌',
    version: 1,
    match: {
      pattern: '^https?://masiro\\.me/admin/novelReading',
    },
    content: {
      selector: '.nvl-content.box-body',
    },
    navigation: {
      next: "a:contains('下一话')",
      prev: "a:contains('上一话')",
    },
    meta: { source: 'builtin' },
  },

  // 123du
  {
    id: '123du',
    name: '123读',
    version: 1,
    match: {
      pattern: 'https?://www\\.123dua?\\.(com|vip)/dudu-\\d+/\\d+/\\d+(-\\d+)?\\.html',
    },
    content: {
      selector: '#content',
    },
    navigation: {
      next: '#PageSet a:contains("下一页"), .bottem2 a:contains("下一章")',
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin' },
  },

  // Dbxsc (独步)
  {
    id: 'dbxsc',
    name: '独步小说网',
    version: 1,
    match: {
      pattern: 'https?://www.dbxsc.com/book/.*?/.*?\\.html',
    },
    content: {
      selector: '#cont-body',
    },
    navigation: {
      next: '.col-md-6.text-center a:last',
      prev: '.col-md-6.text-center a:first',
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.dbxsc.com/book/p1693/565590.html' },
  },

  // Ixdzs (爱下电子书)
  {
    id: 'ixdzs',
    name: '爱下电子书',
    version: 1,
    match: {
      pattern: 'https://ixdzs8.com/read/\\d+/p\\d+.html',
    },
    content: {
      selector: '.page-content section',
    },
    navigation: {
      next: '.chapter-next',
      prev: '.chapter-pre',
      index: 'a:contains(书籍页)',
    },
    meta: { source: 'builtin', exampleUrl: 'https://ixdzs8.com/read/42730/p1.html' },
  },

  // Qisxs (奇书网)
  {
    id: 'qisxs',
    name: '奇书网',
    version: 1,
    match: {
      pattern: 'https://www.qisxs.com/.*?/\\d+.html',
    },
    content: {
      selector: '.box_box',
    },
    title: {
      bookSelector: '.info a',
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.qisxs.com/shenhaiyujin/7570735.html' },
  },

  // UUread
  {
    id: 'uuread',
    name: 'UU看书',
    version: 1,
    match: {
      pattern: 'https://www\\.uuread\\.tw/chapter/\\d+/\\d+(_\\d+)?\\.html',
    },
    content: {
      selector: '.txt_tcontent',
    },
    navigation: {
      next: 'a.btn-primary:nth-child(4)',
      prev: 'a.btn-primary:nth-child(1)',
      index: 'a.btn-primary:nth-child(3)',
    },
    title: {
      selector: '.chatit',
      bookSelector: '.bread > li:nth-child(4) > a:nth-child(1)',
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.uuread.tw/chapter/11681/3006418.html' },
  },

  // ==================== Section-related rules (checkSection/noSection) ====================

  // 小说321 - checkSection
  {
    id: 'xs321',
    name: '小说321',
    version: 1,
    match: {
      pattern: 'https?://www\\.xs321\\.net/book/\\d+/\\d+/\\d+(_\\d+)?\\.html',
    },
    content: {
      selector: '#content',
    },
    processing: {
      useSiteFont: true,
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'http://www.xs321.net/book/671/671539/1.html' },
  },

  // 622中文
  {
    id: '622zw',
    name: '622中文',
    version: 1,
    match: {
      pattern: 'https://www.622zw.com/books/\\d+/\\d+(_)?\\d+.html',
    },
    content: {
      selector: '#content',
    },
    title: {
      selector: '.reader-main h1.title',
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.622zw.com/books/175956/57627355.html' },
  },

  // 逛笔趣阁
  {
    id: 'fkxs',
    name: '逛笔趣阁小说网',
    version: 1,
    match: {
      pattern: 'https?://www\\.fkxs\\.net/.*?/.*?\\.html',
    },
    content: {
      selector: '.content',
    },
    navigation: {
      next: '.bottem2 a:nth-child(4)',
      prev: '.bottem2 a:nth-child(2)',
      index: '.bottem2 a:nth-child(3)',
    },
    title: {
      selector: '.bookname h1',
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.fkxs.net/241_241951/117822179.html' },
  },

  // 永久看小说 (09kan.com - 原09k.net已重定向)
  {
    id: '09k',
    name: '永久看小说',
    version: 1,
    match: {
      pattern: 'https://www.(09k|09kan).net/kkb/\\d+/\\d+(-\\d+)?.html',
    },
    content: {
      selector: '#content',
    },
    navigation: {
      next: "#PageSet a:contains('下'):contains('页')",
      prev: "#PageSet a:contains('上'):contains('页')",
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.09k.net/kkb/021338893523/56870262.html' },
  },

  // 语录书院
  {
    id: 'yulusy',
    name: '语录书院',
    version: 1,
    match: {
      pattern: 'https://www.yulusy.com/yulus/\\d+/.*?.html',
    },
    content: {
      selector: '#content',
    },
    navigation: {
      next: "#PageSet a:contains('下'):contains('页')",
      prev: "#PageSet a:contains('上'):contains('页')",
    },
    advanced: {
      checkSection: true,
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'https://www.yulusy.com/yulus/17410287770/59700783-2.html',
    },
  },

  // 乐文小说
  {
    id: 'ilwxs',
    name: '乐文小说',
    version: 2,
    match: {
      pattern: 'https://m\\.ilwxs\\.com/shu/\\d+/\\d+\\.html',
    },
    content: {
      selector: '.content',
    },
    navigation: {
      // The chapter page contains both "书页" (book info) and "目录" (full chapter list).
      // Ensure `indexUrl` points to the real TOC page (/shu/{bookId}/), not /info-{bookId}.html.
      prev: '.pager a:contains("上一章"), .pager a:contains("上一页")',
      next: '.pager a:contains("下一章"), .pager a:contains("下一页")',
      index:
        '.pager a[href^="/shu/"][href$="/"], .pager a[href*="/shu/"][href$="/"], .pager a:contains("目 录"), .pager a:contains("目录")',
    },
    title: {
      selector: '.headline',
      bookSelector: '.path > a:nth-child(2)',
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://m.ilwxs.com/shu/36354/171272950.html' },
  },

  // 飞卢小说网
  {
    id: 'faloo',
    name: '飞卢小说网',
    version: 1,
    match: {
      pattern: '^https?://[a-z]\\.faloo\\.com/\\d+_\\d+\\.html',
    },
    content: {
      selector: '.noveContent',
    },
    navigation: {
      // Faloo uses stable ids for pager buttons; keep :contains fallback for older layouts.
      prev: '#pre_page, a:contains("上一章")',
      next: '#next_page, a:contains("下一章")',
      index: '#huimulu, a:contains("目录")',
    },
    toc: {
      // Exclude "作品相关/小说相关" section in Faloo catalog sidebar.
      excludeAncestors: '.c_con_relation',
    },
    title: {
      // Chapter title is in <h1>; <h2> is site-wide slogan.
      selector: '.c_l_title > h1, h1',
      bookSelector: '#novelName',
      // Strip the leading book title token: "书名  1 章节名" -> "1 章节名"
      replace: '^\\s*\\S+\\s+',
    },
    meta: {
      source: 'builtin',
      autoLaunch: true,
      exampleUrl: 'https://b.faloo.com/412421_1.html',
    },
  },

  // 努努书坊 (kanunu8.com)
  {
    id: 'kanunu8',
    name: '努努书坊',
    version: 1,
    match: {
      pattern: '^https?://www\\.kanunu8\\.com/.+/\\d+\\.html$',
    },
    content: {
      // 内容在宽度为820的td中的p标签
      selector: 'td[width="820"] > p, td[width="820"] p',
    },
    navigation: {
      // 底部导航表格中的链接，使用 td 位置选择
      prev: 'table[width="700"] td:first-child a',
      index: 'table[width="700"] td:nth-child(2) a',
      next: 'table[width="700"] td:last-child a',
    },
    title: {
      selector: 'font[color="#dc143c"][size="4"]',
    },
    toc: {
      // 排除顶部导航栏的分类链接
      excludeAncestors: '#header, .nav, .nav2, td[bgcolor="#A5BDC6"], td[bgcolor="#CEDFE5"]',
    },
    advanced: {
      // 该网站使用"上一页/下一页"作为章节导航文本，但实际上不是分页
      // 禁用分页检测以避免误判
      noSection: true,
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'https://www.kanunu8.com/book3/7748/170164.html',
    },
  },

  // 书海阁小说网 (m.shuhaige.net)
  // 特点：
  // - 目录页：/36354/（章节列表）
  // - 章节页：/36354/55863782.html
  // - 分页章节：/36354/55863791.html -> /36354/55863791_2.html（下一页）
  // - 顶部导航有"书 页"链接，底部导航有"目 录"链接
  // - 需要清洗正文末尾的广告文字和分页提示
  {
    id: 'shuhaige-m',
    name: '书海阁小说网(手机版)',
    version: 1,
    match: {
      // 匹配章节页和分页（如 55863791_2.html）
      pattern: '^https?://m\\.shuhaige\\.net/\\d+/\\d+(?:_\\d+)?\\.html$',
    },
    content: {
      selector: '.content',
      // 清洗正文末尾的广告文字和分页提示
      replace: [
        {
          // 分页提示：小主，这个章节后面还有哦，请点击下一页继续阅读，后面更精彩！
          pattern: '小主，这个章节后面还有哦.*?后面更精彩！',
          replacement: '',
          flags: 'g',
        },
        {
          // 收藏广告：喜欢XXX请大家收藏：(m.shuhaige.net)XXX更新速度全网最快。
          pattern: '喜欢.*?请大家收藏：\\([^)]+\\).*?更新速度全网最快。',
          replacement: '',
          flags: 'g',
        },
      ],
    },
    navigation: {
      // 优先匹配"上一章/下一章"，分页时会自动处理"上一页/下一页"
      prev: '.pager a:contains("上一章"), .pager a:contains("上一页")',
      index: '.pager a[href$="/"]:contains("目"), .pager a:contains("目录")',
      next: '.pager a:contains("下一章"), .pager a:contains("下一页")',
    },
    title: {
      selector: 'h1.headline',
    },
    advanced: {
      // 启用分页检测，自动合并章节内的多个分页
      checkSection: true,
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'https://m.shuhaige.net/36354/55863791.html',
    },
  },
];

/**
 * All built-in rules combined
 */
export const builtInRules: SiteRule[] = [...specialRules, ...simplifiedRules];

/**
 * Get built-in rules count
 */
export function getBuiltInRulesCount(): { total: number; special: number; simplified: number } {
  return {
    total: builtInRules.length,
    special: specialRules.length,
    simplified: simplifiedRules.length,
  };
}

/**
 * Find a built-in rule by URL
 */
export function findBuiltInRule(url: string): SiteRule | undefined {
  for (const rule of builtInRules) {
    try {
      const regex = new RegExp(rule.match.pattern, 'i');
      if (regex.test(url)) {
        // Check excludes
        if (rule.match.exclude) {
          const excluded = rule.match.exclude.some(pattern => {
            const excludeRegex = new RegExp(pattern, 'i');
            return excludeRegex.test(url);
          });
          if (excluded) continue;
        }
        return rule;
      }
    } catch {
      // Invalid regex, skip
    }
  }
  return undefined;
}
