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
    id: 'qidian-www',
    name: '起点新版-20240317',
    version: 1,
    match: {
      pattern: '^https?://(www|m)\\.qidian\\.com/chapter/.*',
    },
    content: {
      selector: 'main[id^="c-"]',
      remove: '.review',
    },
    navigation: {
      // Use detection fallback - Qidian's navigation is dynamically loaded
      next: false, // Let detection handle it
      prev: false, // Let detection handle it
      index: '.catalog, a[href*="/book/"]:contains("目录")',
    },
    title: {
      selector: 'h1.text-1\\.3em',
      pattern: '(.*?)《(.*?)》(.*?)',
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

  // JJWXC (晋江) - Font decoding, VIP
  {
    id: 'jjwxc',
    name: '晋江文学网',
    version: 1,
    match: {
      pattern: '^https?://(www|my)\\.jjwxc\\.net/onebook(_vip)?\\.php',
    },
    content: {
      selector: '.novelbody',
      remove:
        'font[color], hr, div:has(>#yrt3), div:has(>h2), #six_list, #sendKingTickets, div[align=right], .readsmall, script',
    },
    navigation: {
      index: '.noveltitle > h1 > a',
    },
    title: {
      selector: '#chapter_list > option:first',
      pattern: '《(.*?)》.*[ˇ^](.*?)[ˇ^].*',
    },
    processing: {
      removeAds: false,
    },
    advanced: {
      useIframe: true,
      mutationSelector: 'div[id^=content]',
      mutationChildCount: 0,
      iframeSandbox: 'allow-same-origin allow-scripts',
    },
    meta: { source: 'builtin' },
  },

  // Quanben (全本) - iframe + mutation text
  {
    id: 'quanben',
    name: '全本小说网',
    version: 1,
    match: {
      pattern: '^https?://www\\.quanben\\.io/.*?/.*?/\\d+\\.html',
    },
    content: {
      selector: '#content',
    },
    title: {
      bookSelector: '.name',
    },
    advanced: {
      useIframe: true,
      mutationSelector: '#content',
    },
    meta: {
      source: 'builtin',
      exampleUrl: 'http://www.quanben.io/n/wuxianwanxiangtongminglu/1.html',
    },
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
      remove: 'i.J_Num, .chapter span',
    },
    title: {
      bookSelector: '.breadcrumb > a:last()',
    },
    advanced: {
      useIframe: true,
      mutationSelector: '#J_BookRead',
      mutationChildCount: 1,
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
];

/**
 * Category B: Rules with custom selectors but no special processing
 * These can't be auto-detected but don't need iframe/mutations
 */
const simplifiedRules: SiteRule[] = [
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

  // Faloo (飞卢)
  {
    id: 'faloo',
    name: '飞卢小说网',
    version: 1,
    match: {
      pattern: '^https?://b\\.faloo\\.com/\\d+_\\d+\\.html',
    },
    content: {
      selector: '.noveContent',
    },
    navigation: {
      next: 'a#next_page',
      prev: 'a#pre_page',
      index: 'a#huimulu',
    },
    title: {
      selector: 'h1',
      bookSelector: '#novelName',
    },
    meta: { source: 'builtin' },
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
    version: 1,
    match: {
      pattern: 'https://m\\.ilwxs\\.com/shu/\\d+/\\d+\\.html',
    },
    content: {
      selector: '.content',
    },
    navigation: {
      next: 'div.pager:nth-child(5) > a:nth-child(3)',
      prev: 'div.pager:nth-child(5) > a:nth-child(1)',
      index: 'div.pager:nth-child(5) > a:nth-child(2)',
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

  // 书海阁
  {
    id: 'shuhaige',
    name: '书海阁',
    version: 1,
    match: {
      pattern: 'https://m\\.shuhaige\\.net/\\d+/\\d+(_\\d+)?\\.html',
    },
    content: {
      selector: '.content',
    },
    navigation: {
      next: 'div.pager:nth-child(5) > a:nth-child(3)',
      prev: 'div.pager:nth-child(5) > a:nth-child(1)',
      index: 'div.pager:nth-child(5) > a:nth-child(2)',
    },
    title: {
      selector: '.headline',
      bookSelector: '.path > a:nth-child(2)',
    },
    advanced: {
      checkSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://m.shuhaige.net/36354/171272950.html' },
  },

  // ==================== noSection rules (不合并分页) ====================

  // 努努书坊
  {
    id: 'kanunu-nosection',
    name: '努努书坊',
    version: 1,
    match: {
      pattern: '^https?://(?:book\\.kanunu\\.org|www\\.kanunu8\\.com)/.*/\\d+\\.html',
    },
    content: {
      selector: 'table:eq(4) p',
    },
    navigation: {
      index: "a[href^='./']",
    },
    title: {
      pattern: '(.*) - (.*) - 小说在线阅读 - .* - 努努书坊',
    },
    advanced: {
      noSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.kanunu8.com/book3/7748/170164.html' },
  },

  // 飞速中文
  {
    id: 'feiazw',
    name: '飞速中文',
    version: 1,
    match: {
      pattern: 'https://(?:www.)?(?:feiazw|feibzw|xn--fiq228cu93a4kh).com/Html/\\d+/\\d+.html',
    },
    content: {
      selector: '#content',
      remove: 'p[style], .l',
    },
    advanced: {
      noSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.feiazw.com/Html/21975/18399024.html' },
  },

  // 顶点小说
  {
    id: 'ddxs',
    name: '顶点小说',
    version: 1,
    match: {
      pattern: 'https?://www\\.ddxs\\.com/.*?/\\d+.html',
    },
    content: {
      selector: '#contents',
    },
    title: {
      bookSelector: 'dl > dt > a:last',
    },
    advanced: {
      noSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'http://www.ddxs.com/yuanzun/1.html' },
  },

  // 轻小说文库 (wenku8) - noSection
  {
    id: 'wenku8-nosection',
    name: '轻小说文库',
    version: 1,
    match: {
      pattern: 'https://www\\.wenku8\\.net/novel/\\d+/\\d+/\\d+\\.htm',
    },
    content: {
      selector: '#content',
    },
    navigation: {
      next: '#footlink > a:nth-child(4)',
      prev: '#foottext > a:nth-child(3)',
      index: '#footlink > a:nth-child(5)',
    },
    title: {
      selector: '#title',
      bookSelector: '#linkleft > a:nth-child(3)',
    },
    advanced: {
      noSection: true,
    },
    meta: { source: 'builtin', exampleUrl: 'https://www.wenku8.net/novel/2/2449/91347.htm' },
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
