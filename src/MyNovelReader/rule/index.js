import sites from './sites'
import replace from './replace'
import replaceAll from './replaceAll'
import * as oneWordReplace from './oneWrodReplace'

// Unicode/2000-2FFF：http://zh.wikibooks.org/wiki/Unicode/2000-2FFF
// Unicode/F000-FFFF：https://zh.wikibooks.org/wiki/Unicode/F000-FFFF

// replace 中的简写
export var CHAR_ALIAS = {
  '\\P': '[\\u2000-\\u2FFF\\u3004-\\u303F\\uFE00-\\uFF60\\uFFC0-\\uFFFF]',  // 小说中添加的特殊符号
};

// ===== 自动尝试的规则 =====
var Rule = {
  titleRegExp: /第?\s*[一二两三四五六七八九十○零百千万亿0-9１２３４５６７８９０〇]{1,6}\s*[章回卷节折篇幕集话話]/i,
  titleReplace: /^章节目录|^文章正文|^正文卷?|全文免费阅读|最新章节|\(文\)/,

  // nextRegExp: /[上前下后][一]?[页张个篇章节步]/,
  nextSelector: "a[rel='next'], a:contains('下一页'), a:contains('下一章'), a:contains('下一节'), a:contains('下页'), a:contains('下章')",
  prevSelector: "a[rel='prev'], a:contains('上一页'), a:contains('上一章'), a:contains('上一节'), a:contains('上页'), a:contains('上章')",
  // 忽略的下一页链接，匹配 href
  nextUrlIgnore: [
      /(?:(?:index|list|last|LastPage|end)\.)|BuyChapterUnLogin|^javascript:/i,

      // qidian
      // /BookReader\/LastPageNew\.aspx/i,
      // /read\.qidian\.com\/BookReader\/\d+,0\.aspx$/i,
      /read\.qidian\.com\/$/i,
      // /free\.qidian\.com\/Free\/ShowBook\.aspx\?bookid=/i,

      /book\.zongheng\.com\/readmore/i,
      /www\.shumilou\.com\/to-n-[a-z]+-\d+\.html/i,
      /\/0\.html$/i,
  ],
  nextUrlCompare: /\/\d+([_-]\d+)?\.html?$|\/wcxs-\d+-\d+\/$|chapter-\d+\.html$|\/\d+_\d+\/$|\/\d+\/\d+$/i,  // 忽略的下一页链接（特殊），跟上一页比较

  // 按顺序匹配，匹配到则停止。econtains 完全相等
  indexSelectors: ["a[href='index.html']", "a:contains('返回书目')", "a:contains('章节目录')", "a:contains('章节列表')",
      "a:econtains('最新章节')", "a:contains('回目录')","a:contains('回书目')", "a:contains('目 录')", "a:contains('目录')"],

  contentSelectors: ["#pagecontent", "#contentbox", "#bmsy_content", "#bookpartinfo", "#htmlContent",
      "#text_area", "#chapter_content", "#chapterContent", "#chaptercontent", "#partbody", "#BookContent", "#read-content",
      "#article_content", "#BookTextRead", "#booktext", "#book_text", "#BookText", "#BookTextt", "#readtext", "#readcon", "#read",
      "#TextContent", "#txtContent" , "#text_c", "#txt_td", "#TXT", "#txt", "#zjneirong",
      "#contentTxt", "#oldtext", "#a_content", "#contents", "#content2", "#contentts", "#content1", "#content", 
      "#booktxt", "#nr", "#rtext", "#articlecontent", "#novelcontent", "#text-content", "#articlebody",
      "#ChapterContents", "#acontent", "#chapterinfo", "#read_content", "#chapter-content",
      ".novel_content", ".readmain_inner", ".noveltext", ".booktext", ".yd_text2",
      ".articlecontent", ".readcontent", ".txtnav", ".content", ".art_con", ".article",
      "article",
  ],

  // 尝试查找书名。顶部章节导航的最后一个链接可能是书名。
  bookTitleSelector: [
    '.h1title > .shuming > a[title]',
    '.chapter_nav > div:first > a:last',
    '#header > .readNav > span > a:last',
    'div[align="center"] > .border_b > a:last',
    '.ydselect > .weizhi > a:last',
    '.bdsub > .bdsite > a:last',
    '#sitebar > a:last',
    '.con_top > a:eq(1)',
    '.con_top > a:last',
    '.breadCrumb > a:last',
    '.breadcrumb > a:last',
    '.bookNav > a:last',
    '.srcbox > a:last',
    '.con_top > .nr_s1 > a:last',
    '.location > a:last',
    '.nav > a:last',
    '.DivCurrentPos > a:last',
    '.layout-tit > a:last',
    '.ymdz > a:last',
    '.articletitle > a',
    '.chepnav > a:last',
    '.bread_crumbs a:last',
    '.weizhi a:last',
    '.breadcrumbs a:last',
    '.cover-nav a:last',
    '.path > .p > a:last',
    '.headlink > .linkleft > a:last',
    '.path a:last',
    '.readNav a:last',
    '.chapter-nav a:last',
    '.bread > a:nth-child(3)',
    '.bread a:last',
  ],
  bookTitleReplace: [
      '全文阅读$', '在线阅读$', '最新章节$', '^正文卷',
  ],

  contentRemove: "script, iframe, a, audio, style, button",          // 内容移除选择器
  removeLineRegExp: /<p>[　\s。;，！\.∷〖]*<\/p>/g,  // 移除只有一个字符的行

  // 以下不常改
  replaceBrs: /(<br[^>]*>[ \n\r\t]*){1,}/gi,    // 替换为<p>

  specialSite: sites,
  replace, replaceAll,

  customRules: [],
  customReplace: {},
  parseCustomReplaceRules,

};

// Rule.specialSite = sites

// Rule.replace = replace

oneWordReplace.extendRule(Rule.replace)

// ===== 全局移除，在替换 <br> 为 \n 之后 =====
// Rule.replaceAll = replaceAll


// 自定义的
// Rule.customRules = [];
// Rule.customReplace = {};

function parseCustomReplaceRules(str) {
  var arr = str.split(/\n/);
  var rules = {};
  _.each(arr, function(b) {
      var pos = b.indexOf('=');
      if (pos === -1) return;

      var key = b.substring(0, pos),
          value = b.substring(pos + 1, b.length);
      rules[key] = value;
  });
  return rules;
};

export default Rule