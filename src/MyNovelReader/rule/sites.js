import getMiddleStr from '../utils/string'
import { C, Request, toRE } from '../lib';

// ===== 自定义站点规则 =====

const sites = [
  // 详细版规则示例。注：该网站已无法访问。
  {siteName: "泡书吧",                                               // 站点名字... (可选)
      url: "^https?://www\\.paoshu8\\.net/Html/\\S+\\.shtm$",          // // 站点正则... (~~必须~~)

      // 获取标题
      titleReg: /(.*?)最新章节 [-_\\\/](.*?)[-_\/].*/,         // 书籍标题、章节标题正则 (可选)
      titlePos: 0,                                          // 书籍标题位置：0 或 1 (可选，默认为 0)
      titleSelector: "#title h1",

      indexSelector: "a:contains('回目录')",                    // 首页链接 jQuery 选择器 (不填则尝试自动搜索)
      prevSelector: "a:contains('翻上页')",                      // 上一页链接 jQuery 选择器 (不填则尝试自动搜索)
      nextSelector: "a:contains('翻下页')",                     // 下一页链接 jQuery 选择器  (不填则尝试自动搜索)

      // nDelay: 500,  // 延迟0.5秒加载下一页
      // style: '',  // 站点样式

      // 获取内容
      contentSelector: "#BookText",                             // 内容 jQuery 选择器 (不填则尝试自动搜索)
      useiframe: false,                                          // (可选)下一页加载是否使用 iframe
      // mutationSelector: "#chaptercontainer",                    // (可选)内容生成监视器
      // 对内容的处理
      contentHandle: false,   // (可选)是否对内容进行特殊处理，诸如拼音字修复等，诸如起点等网站可禁用
      fixImage: true,         // (可选)，图片居中，不分大小
      contentReplace: /(\*W|（w|\(w).{10,25}(吧\*|）|\))|看小说就上|本书首发|泡.{1,6}吧|百度搜索阅读最新最全的小说|http:\/\/www.paoshu8.com\/|无弹窗/g,                                // 需要移除的内容正则 (可选)
      contentPatch: function(fakeStub){                          // (可选)内容补丁。解决翻页是脚本的情况
          var $next = fakeStub.find('#LinkMenu');
          $next.html($next.html().replace(/<script>ShowLinkMenu.*?(<a.*?a>).*?(<a.*?a>).*?script>/,'$1$2') +
              '<a href=\'List.shtm\'>回目录</a>');
      }
  },
  {siteName: '起点新版-阅文',
    url: '^https?://(?:read|vipreader)\\.qidian\\.com/chapter/.*',
    exclude: ' /lastpage/',
    bookTitleSelector: '#bookImg',
    titleSelector: 'h3.j_chapterName',

    prevSelector: '#j_chapterPrev',
    nextSelector: '#j_chapterNext',
    indexSelector: '.chapter-control a:contains("目录"), #my_index',
    // indexSelector: function(obj) {
    //     var url = obj.find(".chapter-control a:contains('目录')").attr('href');
    //     return url;
    // },

    contentSelector: '.read-content.j_readContent',
    contentHandle: false,
    contentRemove: '',
    fastboot: true,
    contentReplace: [
        '手机用户请到m.qidian.com阅读。',
        '起点中文网www.qidian.com欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在起点原创！.*'
    ],
    isVipChapter: function($doc) {
        if ($doc.find('.vip-limit-wrap').length) {
            return true;
        }
    },
    contentPatch: function($doc) {
        // 移除本章说评论数气泡
        $doc.find('.review-count').remove()

        $doc.find('.content-wrap').contents().unwrap()

        $doc.find('.read-content.j_readContent style').remove()

        const cId = $doc.find('.read-content.j_readContent').attr('id').slice(2)
        const style = $doc.find('link[href^=blob]').attr('class', 'noRemove')

        if (style.length) {
            this.$content = $doc.find('.read-content.j_readContent')
                .prepend($(`<style>
                #j_${cId} p[class^='p'] {
                    display: flex;
                    display: -ms-flexbox;
                    flex-wrap: wrap;
                    align-items: flex-end;
                }
                #j_${cId} p {
                    line-height: 1.8;
                    overflow: hidden;
                    margin: 0.8em 0;
                }</style>`))
                .prepend(style)
                .wrapInner(`<div id="j_${cId}">`)
        }

        // 滚屏的方式无法获取下一页
        if ($doc.find('#j_chapterPrev').length === 0) {
            var $node = $doc.find('div[id^="chapter-"]');
            // 加上一页链接
            $('<div id="j_chapterPrev">')
                .attr('href', $node.attr('data-purl'))
                .appendTo($doc.find('body'));
            // 加下一页链接
            $('<div id="j_chapterNext">')
                .attr('href', $node.attr('data-nurl'))
                .appendTo($doc.find('body'));
            // 目录
            var indexUrl = $('#bookImg').attr('href') + '#Catalog';
            $('<div id="my_index">目录</div>')
                .attr('href', indexUrl)
                .appendTo($doc.find('body'));
        }
    },
    startLaunch($doc) {
        const win = $doc[0].defaultView
        if (win.g_data.chapter.vipStatus === 1) { // 是 vip 章节
            this.useiframe = true;
            this.mutationSelector = '.read-content.j_readContent'
            this.mutationChildCount = 0
        }
        if (win.g_data.chapter.cES === 2) { // vip 加密 + Html、Css 混淆章节
            this.useRawContent = true;
            this.cloneNode = true;
        }
    },
  },
  {siteName: "创世中文网",
      url: "^https?://(?:chuangshi|yunqi)\\.qq\\.com/|^http://dushu\\.qq\\.com/read.html\\?bid=",
      bookTitleSelector: '.bookNav > a:last()',
      titleSelector: '.story_title > h1',

      nextSelector: '#rightFloatBar_nextChapterBtn',
      prevSelector: '#rightFloatBar_preChapterBtn',
      indexSelector: function() {
          var m = location.href.match(/\/bk\/\w+\/(.*?)-r-\d+.html/);
          if (m) {
              return 'http://chuangshi.qq.com/bk/ls/' + m[1] + '-l.html';
          } else {
              return 'http://chuangshi.qq.com/bk/ls/' + unsafeWindow.bid + '-l.html';
          }
      },

      contentSelector: ".bookreadercontent",
      contentHandle: false,
      mutationSelector: "#chaptercontainer",  // 内容生成监视器，第一次运行用到，以后用下面的 getContent 函数
          mutationChildCount: 1,
      useSiteFont: true,
      startFilter: function() {
          // 下一页需要提前加 1
          unsafeWindow.uuid = parseInt(unsafeWindow.uuid) + 1 + '';
      },
      getContent: function($doc, callback) {  // this 指 parser
          function _getReadPageUrl(uuid) {
              if (!uuid) {
                  return 'javascript:void(0);';
              }
              var url = location.href.replace(/[?|#].*/gi, '');
              return url.replace(/(\d)+\.html/, uuid + '.html');
          }

          function getPageUrlHtml(preChapterUUID, nextChapterUUID) {
              var preReadUrl = _getReadPageUrl(preChapterUUID),
                  nextReadUrl = _getReadPageUrl(nextChapterUUID);

              return '<a id="rightFloatBar_preChapterBtn" href="' + preReadUrl + '">上一页</a>' +
                      '<a id="rightFloatBar_nextChapterBtn" href="' + nextReadUrl + '">下一页</a>' + '\n';
          }

          var done = function (data) {
              unsafeWindow.uuid = data.nextuuid;  // 给下一页用

              callback({
                  html: getPageUrlHtml(data.preuuid, data.nextuuid) + data.Content
              });
          };
          exportFunction(done, unsafeWindow, { defineAs: "gm_mnr_cs_callback" });

          unsafeWindow.CS.page.read.main.getChapterContent(unsafeWindow.bid, unsafeWindow.uuid,
              unsafeWindow.gm_mnr_cs_callback);
      },
  },
  {siteName: "纵横中文网",
      url: "^https?://book\\.zongheng\\.com/\\S+\\/\\d+\\.html$",
      contentHandle: false,
      // titleReg: "(.*?)-(.*)",
      titleSelector: "em[itemprop='headline']",
      bookTitleSelector: ".tc h2",
      contentSelector: '#readerFt',
      contentPatch: function(fakeStub){
          fakeStub.find('.watermark').remove();
          // 给第几章添加空格
          var chapterTitle = fakeStub.find(".tc > h2").text();
          var chapterTitle1 = fakeStub.find(".tc > h2 em").text();
          if(chapterTitle1) {
              chapterTitle = chapterTitle.replace(chapterTitle1, " ") + chapterTitle1;
          }
          fakeStub.find("title").text(
              fakeStub.find(".tc > h1").text() + "-" + chapterTitle
          );
      }
  },
  {siteName: "晋江文学网",
      url: /^https?:\/\/(www|my)\.jjwxc\.net\/onebook(|_vip)\.php\S*/,
      titleReg: /《(.*?)》.*[ˇ^](.*?)[ˇ^].*/,
      titlePos: 0,
    //   titleSelector: 'h2',
      titleSelector: '#chapter_list > option:first',
      // bookTitleSelector: 'h1 .bigtext',
      indexSelector: ".noveltitle > h1 > a",
      contentSelector: '.noveltext',
      contentHandle: false,
      contentRemove: 'font[color], hr',
      contentPatchAsync: async function ($doc) {
          // 移除 h2 的标题
          $doc.find('div:has(>h2)').remove();
          $doc.find('#six_list, #sendKingTickets').parent().remove();
          $doc.find("div.noveltext").find("div:first, h1").remove();

          $doc.find("div[align=right], .readsmall").remove()
          
          // 移除VIP章节方块
          var $node = $doc.find('.noveltext');
          if ($node.attr("class").split(/\s+/).length === 2) {
              var fontName = $node.attr("class").split(/\s+/)[1];
              const html = await replaceJjwxcCharacter(fontName, $node.html())
              $node.html(html);
          }
      },
      contentReplace: [
          '@无限好文，尽在晋江文学城'
      ]
  },
  {siteName: '晋江文学城_手机版',
      url: '^https?://(?:wap|m)\\.jjwxc\\.(?:net|com)/(?:book2|vip)/\\d+/\\d+',
      titleReg: /《(.*?)》.*[ˇ^](.*?)[ˇ^].*/,
      titlePos: 0,
      titleSelector: 'h2',
      contentSelector: 'div.grid-c > div > .b.module > div:first',
  },
  {siteName: "潇湘书院",
      url: "^https?://www\\.xxsy\\.net/chapter/.*\\.html",
      titleReg: "(.*?)_(.*)_全文阅读",
      nextSelector: ".chapter-next",
      indexSelector: '.bread > a:last()',
      contentSelector: "#auto-chapter",
      contentHandle: false,
      contentReplace: "本书由潇湘书院首发，请勿转载！",
  },
  {siteName: "逐浪",
      url: /^https?:\/\/book\.zhulang\.com\/.*\.html/,
      titleReg: /(.*?)-(.*)/,
      contentSelector: "#readpage_leftntxt",
      contentHandle: false,
      contentPatch: function(fakeStub){
          var title = fakeStub.find(".readpage_leftnzgx a:first").text() + "-" +
              fakeStub.find(".readpage_leftntit").text();
          fakeStub.find('title').html(title);
      }
  },
  {siteName: "小说阅读网",
      url: "^https?://www\\.readnovel\\.com/novel/.*\\.html",
      titleSelector: ".bgtop > h1",
      bookTitleSelector: ".nownav > a:eq(4)",
      contentSelector: "#article, .zhangjie",
      contentRemove: "div[style], .miaoshu, .zhichi, .bottomAdbanner",
      contentPatch: function(fakeStub) {
          // 删除标题不需要的部分
          fakeStub.find(".bgtop > h1 > span").remove();
      }
  },
  {siteName: "百度贴吧（手动启用）",
      enable: false,
      url: /^https?:\/\/tieba\.baidu.com\/p\//,
      titleSelector: "h1.core_title_txt",
      bookTitleSelector: ".card_title_fname",
      nextSelector: false,
      indexSelector: 'a.card_title_fname',
      prevSelector: false,

      contentSelector: "#j_p_postlist",
      contentRemove: "#sofa_post, .d_author, .share_btn_wrapper, .core_reply, .j_user_sign",
      style: ".clear { border-top:1px solid #cccccc; margin-bottom: 50px; visibility: visible !important;}",  // 显示楼层的分割线
  },
  {siteName: "天涯书库",
      url: /www\.ty2016\.com\/.+\.html$/,
      titleSelector: "h1",
      bookTitleSelector: ".crumb a[href='./']",

      indexSelector: "td a[href='./']",

      contentSelector: "#main",
      contentRemove: '.crumb, table',
      contentHandle: false,
  },
  {siteName: "书迷楼",
      url: /^https?:\/\/www\.shumil\.(?:co|us|com)\/.*html$/,
      titleReg: /(.*) (.*?) 书迷楼/,
      titlePos: 1,
      contentSelector: "#content",
      contentRemove: 'a, center',
      contentReplace: [
          'div lign="ener"&gt;|.*更多章节请到网址隆重推荐去除广告全文字小说阅读器',
          '起点中文网www.qidian.com欢迎广大书.*',
          '书迷楼最快更新.*',
          '更新最快最稳定',
          '\\(\\.\\)R?U',
          {'<p>\\?\\?': '<p>'},
          '\\(www.\\)',
          '章节更新最快',
          '-乐-读-小-说--乐读x-',
          '《乐》《读》小说.乐读.Com',
          '纯文字在线阅读本站域名手机同步阅读请访问',
          '-优－优－小－说－更－新－最－快-www.uuxs.cc-',
          '\\(本章免费\\)',
          '请大家搜索（书迷楼）看最全！更新最快的小说',
          '书迷楼www.shumilou.co',
          'shumil.com',
          '书迷楼 （）',
          '书迷楼',
      ],
      fixImage: true,
      contentPatch: function(fakeStub){
          fakeStub.find("#content").find("div.title:last")
              .appendTo(fakeStub.find('body'));
          fakeStub.find("#content").find("div.title, p > b, div[style]").remove();
      }
  },
  {siteName: "17k小说网",
      url: /^https?:\/\/\S+\.17k\.com\/chapter\/\S+\/\d+\.html$/,
      titleReg: /(.*?)-(.*?)-.*/,
      contentSelector: "#chapterContent",
      contentRemove: ".chapter_update_time, h1, .qrcode, #authorSpenk, .like_box, #hotRecommend, .ct0416, .recent_read, #miniVoteBox",
      contentReplace: [
          '本书首发来自17K小说网，第一时间看正版内容！'
      ],
      contentPatchAsync: function($doc, callback) {
          if (unsafeWindow.console.clear) {
              unsafeWindow.console.clear = null;
          }

          function waitFor(condition, callback, timeout, timeoutFn) {timeout = timeout || 30 * 1000;timeoutFn = timeoutFn || function() {};var startTime = Date.now();var timeId = setInterval(function() {    if (condition()) {        callback();        clearInterval(timeId);    } else if ((Date.now() - startTime) > timeout) {        timeoutFn();        clearInterval(timeId);    }}, 500);}

          var Q = unsafeWindow.Q

          // 计算上一章节下一章节
          function calPages() {
              var json = Q.bookBigData.json
              var bookId = Q.bookid;

              for (var i=0, c; c = json.list[i]; i++) {
                  if (c == Q.chapterid) {
                      var prevChapter = (0 === i ? null : json.list[i - 1])
                      var nextChapter = (i + 1 < json.list.length ? json.list[i + 1] : null)

                      if (nextChapter) {
                          var nextUrl = '/chapter/' + bookId + '/' + nextChapter + '.html';
                          $doc.find('a:contains(下一章)')
                              .attr('href', nextUrl);

                          Q.chapterid = nextChapter;
                      }
                      if (prevChapter) {
                          var prevUrl = '/chapter/' + bookId + '/' + prevChapter + '.html';
                          $doc.find('a:contains(上一章)')
                              .attr('href', prevUrl);
                      }

                      break;
                  }
              }
          }

          if (!Q.bookBigData.json) {
              waitFor(function() {
                  return !!Q.bookBigData.json;
              }, function() {
                  calPages();
                  callback()
              })
          } else {
              calPages();
              callback()
          }
      }
  },
  {siteName: "侠客中文网",
      url: /^https?:\/\/www\.xkzw\.org\/\w+\/\d+\.html/,
      contentSelector: ".readmain_inner .cont",
      contentPatch: function(fakeStub){
          fakeStub.find('title').html(fakeStub.find('.readmain_inner h2').text());
      }
  },
  {siteName: "ChinaUnix.net",
      url: /^https?:\/\/bbs\.chinaunix\.net\/thread-.*\.html/,
      contentSelector: ".t_f:first"
  },
  {siteName: "123du 小说",
      url: /^https?:\/\/www\.123du\.(?:net|cc)\//,
      titleReg: "(.*)-(.*) 百家乐",
      titlePos: 1,
      contentSelector: "#content, #contents",
      contentReplace: "一秒记住.www.*|小说最新更新，来123读书www.123du.net",
      contentRemove: "a",
      contentPatch: function(fakeStub){
          var content = fakeStub.find("#DivContentBG").html().match(/第\d*页([\s\S]*)一秒记住/)[1];
          $('<div id="content"/>').html(content).appendTo(fakeStub.find('body'));
      }
  },
  {siteName: "塔读文学",
      url: "^https?://www\\.tadu\\.com/book/\\d+/\\d+/",
      bookTitleSelector: '.book-name_ a:first',
      nDelay: 2000,  // 延迟2秒加载下一页
      contentSelector: "#partContent",
      contentPatch: function(fakeStub){
          var m = fakeStub.find("body").html().match(/\.html\(unescape\("(.*)"\)/);
          if(m){
              var unescapeContent = m[1];
              fakeStub.find("#partContent").html(unescape(unescapeContent));
          }
      }
  },
  {siteName: "顶点小说",
      url: "^https?://www\\.(?:23us|x23us|23wx|xs222)\\.(?:com|cc)/html/\\d+/\\d+/\\d+\\.html$",
      bookTitleSelector: '.crumbs > div > a:last, #amain > dl > dt > a:last',
      indexSelector: "#footlink a:contains('返回目录')",
      prevSelector: "#footlink a:contains('上一页')",
      nextSelector: "#footlink a:contains('下一页')",
      contentSelector: "#contents",
      contentReplace: [
          "\\(看小说到顶点小说网.*\\)|\\(\\)|【记住本站只需一秒钟.*】",
          '一秒记住【.*读及下载。',
          'www.xstxt.org',
          'wenxuemi.com',
          '23us．com',
          '顶点小说 Ｘ２３ＵＳ．com更新最快',
          'www．23us．cc更新最快',
          '免费小说门户',
          '\\|顶\\|点\\|小\\|說\\|網更新最快',
          '\\\\\\|顶\\\\\\|点\\\\\\|小\\\\\\|说\\\\\\|2\\|3\\|u\\|s\\|.\\|c\\|c\\|',
      ],
      contentPatch: function(fakeStub){
          var temp=fakeStub.find('title').text();
          var realtitle = temp.replace(/第.*卷\s/,'');
          fakeStub.find('title').html(realtitle);
      }
  },
  {siteName: '23中文',
      url: '^https?://www\\.23zw\\.(com|me)/.*\\.html',
      contentSelector: '#chapter_content',
      contentRemove: 'h1',
      contentReplace: [
          '的朋友，你可以即可第一时间找到本站哦。',
          '手机看小说哪家强\\?手机阅读网',
          '，最快更新.*?最新章节！',
          '看.*?最新章节到长风文学',
          '本文由首发',
          '章节更新最快',
          '顶点小说.23us.。',
          '\\(顶点小说\\)',
          '看最新最全',
          'R1152',
          '\\.n√et',
          '中文网',
          '更新最快',
          '&amp;aaaa',
          '更多精彩小说请访问',
      ]
  },
  {siteName: "3Z中文网",
      url: "^https?://www\\.zzzcn\\.com\\/(3z\\d+/\\d+\\/|modules\\/article\\/App\\.php\\?aid=\\d+&cid=\\d+){1}$",
      // titleReg: "(.*?)-(.*)TXT下载",
      contentSelector: "#content3zcn",
      indexSelector: "a:contains('返回目录')",
      prevSelector: "a:contains('上 一 页')",
      nextSelector: "a:contains('下 一 页'), a:contains('返回书架')",
      contentReplace: [
          /[{(][a-z\/.]+(?:首发文字|更新超快)[})]/ig,
          "手机小说站点（wap.zzzcn.com）",
          "一秒记住.*为您提供精彩小说阅读。",
      ],
      contentPatch: function(fakeStub){
          fakeStub.find("a:contains('返回书架')").html("下 一 页").attr("href", fakeStub.find("a:contains('返回目录')").attr("href"));
          fakeStub.find("#content3zcn").find(".titlePos, font.tips, a").remove();
      }
  },
  {siteName: "书哈哈小说网",
      url: "^https?://(?:read|www)\\.shuhaha\\.com/Html/Book/\\d+/\\d+/\\d+\\.html",
      titleSelector: "#htmltimu",
      bookTitleSelector: [".srcbox > a:nth-child(2)", /目录$/],
      contentSelector: "#BookText",
      contentRemove: 'a[href*="www.shuhaha.com"]',
      contentReplace: [
          '‘‘', '’’',
          '（\\.shuh&amp;n）',
          /<p[^>]*>(&nbsp;){4}网<\/p>/gi
      ]
  },
  {siteName: "SF 轻小说",
      url: '^https?://book.sfacg.com/Novel/\\d+/\\d+/\\d+/',
      titleReg: '(.*?)-(.*?)-.*',
      contentSelector: '#ChapterBody',
  },
  {siteName: "武林中文网",
      url: '^https?://www\\.50zw\\.(com|co|la)/book_\\d+/\\d+\\.html',
      bookTitleSelector: '.srcbox > a:last',
      contentReplace: [
          '更新最快【】',
          '&lt;/dd&gt;',
          '&lt;center&gt; &lt;fon color=red&gt;',
          '一秒记住【武林中文网.*',
          '武林中文网 www.*',
      ]
  },
  {siteName: "乡村小说网",
      url: '^https?://www\\.xiangcunxiaoshuo\\.com/shu/\\d+/\\d+\\.html',
      // bookTitleSelector: '.read_m > .list',
      titleReg: '(.*?)_(.*?)_.*_.*',
      contentSelector: '.yd_text2',
      contentReplace: [
          '[ｗＷw]+．２３ｕＳ．(?:ｃｏＭ|com)',
          '乡&amp;村&amp;.*?\\.co[mＭ]',
      ]
  },
  {siteName: "小说巴士",
      url: "^https?://www\\.xs84\\.com/\\d+_\\d+/",
      bookTitleSelector: ".con_top a:last",
      contentReplace: [
          "§推荐一个无广告的小说站.*? §",
          "☆本站最快更新.*?☆",
          "纯文字在线阅读.*?</br>",
          "www.X S 8 4.com",
          "《》 www.obr />",
          "。。 w.2.obr",
          "\\[w w w.x s.*?.c o m 小说.*?\\]",
          "╂上.*?╂",
          "\\*\\*顶\\*\\*点.{0,3}小说",
          "___小.说.巴.士 www.xS84.com___",
      ],
      contentPatch: function() {
          $('<script>')
              .text('clearInterval(show);')
              .appendTo('body')
              .remove();
      }
  },
  {siteName: "热门小说网",
      url: '^https?://www.remenxs.com/du_\\d+/\\d+/',
      bookTitleSelector: 'section.readhead > div.read_t > div.lf > a:nth-child(2)',
      nextSelector: '.pagego > font:contains("下一章") + a',
      prevSelector: '.pagego > font:contains("上一章") + a',
      contentSelector: ".yd_text2",
      contentRemove: '.adrs, .con_w, a',
      contentReplace: [
          '您可以在百度里搜索“.*',
          '为了方便下次阅读，你可以点击下方的.*'
      ]
  },
  

  // === 内容补丁
//   {siteName: "给力文学小说阅读网",
//       url: "^https?://www\\.geiliwx\\.com/.*\\.shtml",
//       titleReg: "-?(.*)_(.*)最新章节_给力",
//       titlePos: 1,
//       contentRemove: 'h1, font[color], center',
//       contentReplace: [
//           "网站升级完毕！感谢对给力文学网的支持！",
//           "（百度搜索给力文学网更新最快最稳定\\)",
//           "【sogou,360,soso搜免费下载小说】",
//           "\\[乐\\]\\[读\\]小说.２3.[Ｃc]m",
//           "给力文学网",
//           "看最快更新",
//           "小说网不跳字",
//           "\\.com",
//           "BAIDU_CLB_fillSlot\\(.*",
//           "--小-说-www-23wx-com",
//           "&nbsp;&nbsp;，请",
//           '\\.www\\.GEILIWX开心阅读每一天',
//       ],
//       contentPatch: function(d) {
//           if (!d.find('#content').length) {
//               var html = d.find('body').html();
//               var content = html.match(/<!--go-->([\s\S]*?)<!--over-->/i)[1];

//               content = $('<div id="content">').html(content);
//               if (content.find('#adright').size()) {
//                   content = content.find('#adright');
//               }
//               content.appendTo(d.find('body'));
//           }
//       }
//   },

  // ================== 采用 iframe 方式获取的 ====================
//   {siteName: "16K小说网",
//       url: "^https?://www\\.16kbook\\.org/Html/Book/\\d+/\\d+/\\d+\\.shtml$",
//       titleReg: '(\\S+) (.*)- 16K小说网',
//       useiframe: true,
//       contentRemove: '.bdlikebutton',
//       contentReplace: {
//           '(<center>)?<?img src..(http://www.16kbook.org)?(/tu/\\S+\\.jpg).(>| alt."\\d+_\\d+_\\d*\\.jpg" />)(</center>)?': "$3",
//           "/tu/shijie.jpg":"世界", "/tu/xiangdao.jpg":"想到", "/tu/danshi.jpg":"但是", "/tu/huilai.jpg":"回来", "/tu/yijing.jpg":"已经", "/tu/zhende.jpg":"真的", "/tu/liliang.jpg":"力量", "/tu/le.jpg":"了", "/tu/da.jpg":"大", "/tu/shengli.jpg":"胜利", "/tu/xiwang.jpg":"希望", "/tu/wandan.jpg":"完蛋", "/tu/de.jpg":"的",
//           "16kbook\\s*(首发更新|小说网)": "",
//       }
//   },
//   {siteName: "读读看",
//       url: "^https?://www\\.dudukan\\.net/html/.*\\.html$",
//       contentReplace: "看小说“就爱读书”|binhuo|www\\.92to\\.com",
//       useiframe: true,
//       mutationSelector: "#main",
//       mutationChildCount: 0,
//   },
  // 2页合并一章
  {siteName: "读零零（有问题，只显示一半内容）",
      url: "https?://www\\.du00\\.(?:com|cc)/read/\\d+/\\d+/[\\d_]+\\.html",
      titleReg: "(.*?)(?:第\\d+段)?,(.*) - 读零零小说网",
      titlePos: 1,
      // prevSelector: "#footlink a:first",
      // indexSelector: "#footlink a:contains('目录')",
      // nextSelector: "#footlink a:last",
      // 内容
      contentSelector: "#pagecontent, .divimage",
      // useiframe: true,
      // mutationSelector: "#pagecontent",
      // mutationChildCount: 2,
      contentRemove: "font",
      contentReplace: [
          "读零零小说网欢迎您的光临.*?txt格式下载服务",
          "，好看的小说:|本书最新免费章节请访问。",
          "\\*文學馆\\*",
          "\\(未完待续请搜索，小说更好更新更快!",
          "www\\.DU00\\.com",
      ],
      checkSection: true
  },
  {siteName: "78小说网",
      url: "^https?://www\\.78xs\\.com/article/\\d+/\\d+/\\d+.shtml$",
      contentHandle: false,
      titleReg: "(.*?) (?:正文 )?(.*) 78小说网",
      indexSelector: "a:contains('目 录')",
      prevSelector: "a:contains('上一章')",
      nextSelector: "a:contains('下一章')",
      contentSelector: "#content",
      useiframe: true,
      contentReplace: [
          "//.*?78xs.*?//",
          "\\(全文字小说更新最快\\)",
      ],
      contentPatch: function(fakeStub){
          fakeStub.find('p.title').empty();                      // 去掉内容中带的章节标题
      }
  },
  // ================== 采用 iframe 并存在 mutationSelector 的 ====================
  {siteName: '全本小说网',
    exampleUrl: 'http://www.quanben.io/n/wuxianwanxiangtongminglu/1.html',
    url: '^https?://www\\.quanben\\.io/.*?/.*?/\\d+\\.html',
    bookTitleSelector: '.name',
    useiframe: true,
    mutationSelector: "#content",  // 内容生成监视器
        // mutationChildCount: 5,
        mutationChildText: '请到 quanben.io阅读完整章节内容',
  },
  {siteName: '刺猬猫',
    exampleUrl: 'https://www.ciweimao.com/chapter/102930784',
    url: '^https?://www\\.ciweimao\\.com/chapter/\\d+',
    bookTitleSelector: '.breadcrumb > a:last()',
    useiframe: true,
    mutationSelector: "#J_BookRead",  // 内容生成监视器
        mutationChildCount: 1,
    contentSelector: '#J_BookRead',
    contentRemove: 'i.J_Num, .chapter span',
  },
  // 上下页链接难搞
  {siteName: '长佩文学网',
    exampleUrl: 'https://www.gongzicp.com/read-246381.html',
    url: '^https?://www\\.gongzicp\\.com/read-\\d+\\.html',
    bookTitleSelector: '.novel',
    useiframe: true,
    contentSelector: '.content',
    mutationSelector: '.novel',
    mutationChildCount: 2,
    contentReplace: [
        '来源长佩文学网（https://www.gongzicp.com）',
    ]
  },
  // 未完成
    // {siteName: '阿拉法小说网',
    //     exampleUrl: 'https://www.alfagame.net/chapter_www.html?1#mybookid=80&bookid=902&chapterid=856587',
    //     url: '^https://www\\.alfagame\\.net/chapter_www\\.html\\?1#mybookid=\\d+&bookid=\\d+&chapterid=\\d+',
    //     bookTitleSelector: '.chapter-nav > p > a:last()',
    //     useiframe: true,
    //     mutationSelector: "#txt",  // 内容生成监视器
    //         mutationChildCount: 0,
    //     contentSelector: '#txt',
    // },

  // ===========================================================
  {siteName: "E品中文网",
      url: "^https?://www\\.epzww\\.com/book/\\d+/\\d+",
      titleReg: "(.*?),(.*?),",
      contentSelector: "#showcontent",
  },
  {siteName: "飘天文学",
      url: "^https?://www\\.ptwxz\\.(net|com)/html/\\d+/\\d+/\\d+\\.html",
      // titleReg: "(.*)最新章节,(.*),飘天文学",
      bookTitleSelector: '#content > h1 > a',
      contentSelector: "#content",
      useiframe: true,  // 否则 content 在 body 下面
      contentRemove: "h1, table, .toplink",
      contentReplace: [
          /[{〖]请在百度搜索.*[}〗]|.(?:百度搜索飄天|无弹窗小说网).*\.Net.|\[飄天.*无弹窗小说网\]/ig,
          '\\{飘天文学www.piaotian.net感谢各位书友的支持，您的支持就是我们最大的动力\\}',
          '章节更新最快',
          '支持网站发展，逛淘宝买东西.*',
          '天才壹秒記住，為您提供精彩閱讀。.*'
      ],
  },
  {siteName: "一起阅",
      url: "^https?://www\\.17yue\\.com/\\w+/\\d+/\\d+\\.html",
      useiframe: true,
  },
  {siteName: "诺秋网",
      url: "^https?://www\\.nuoqiu\\.com/static/\\d+/\\d+\\.html",
      titleReg: "(.*) (.*) 诺秋网",
      titlePos: 1,
      useiframe: true,
      contentReplace: "┏━━━━━━━━━━━━━━━━━━━━━━━━━┓[\\s\\S]+诺秋网文字更新最快……】@！！"
  },
  {siteName: "努努书坊",
      url: "^https?://(?:book\\.kanunu\\.org|www\\.kanunu8\\.com)/.*/\\d+\\.html",
      titleReg: /(.*) - (.*) - 小说在线阅读 - .* - 努努书坊/,
      titlePos: 1,
      contentSelector: "table:eq(4) p",
      indexSelector: "a[href^='./']",
  },
  {siteName: "都来读小说网",
      url: /^https?:\/\/www\.doulaidu\.com\/[^\/]+\/\d+\/\d+\.html/,
      useiframe: true,
      contentReplace: [
          /www．.+．(?:com|net)/ig,
          /都来读小说网首发|www\.[a-z0-9]+\.(?:org|com)/ig,
      ]
  },
  {siteName: "UU看书",
      url: "^https?://www\\.uukanshu\\.(?:com|net)/.*/\\d+/\\d+.html",
      contentReplace: [
          /* 替换以下
              ＵU看书 www.uukanｓhｕ.net
              'UU看书 www.uｕkanshu.net '
              'UU看书 www.uuｋanshu．net'
              'ＵU看书 www.ｕuｋanｓhu.net'
              'UU看书 www.uuｋanshu.net '
              'ＵU看书www．uukansｈu.net '
              'UU看书 www.uukanshu.net'
              'ＵU看书 www.uukanshu.net'
              'ＵU看书 www.ｕukanshu.net '
              'UU看书 www.uukａnshu.net '
              ‘UU看书 www.uukanshu．net ’
              ‘UU看书 www.uukａnｓhu．net ’
              ‘UU看书 www.uｕkansｈu．net ’
              UU看书 www.ｕukaｎshu.net
          */
          /[ＵｕUu]+看书\s*www.[ＵｕUu]+[kｋ][aａ][nｎ][ｓs][hｈ][ＵｕUu].[nｎ][eｅ][tｔ]\s*/g,
          '[UＵ]*看书[（\\(].*?[）\\)]文字首发。',
          '请记住本书首发域名：。笔趣阁手机版阅读网址：',
        //   '\\(\\)',
      ],
      contentRemove: '.ad_content'
  },
  {siteName: "天涯武库",
      url: /wx\.ty2016\.com\/.+\.html$/,
      bookTitleSelector: "td[width='800'][height='25']>a[href='./']",
      titleSelector: "strong>font",
      indexSelector: "td a[href='./']",
      nextSelector: "td[width='28%'] a",

      contentSelector: "td[width='760'] p",
      contentHandle: false,
  },
  {siteName: "黄金屋中文网",
      url: /www\.hjwzw\.com\/Book\/Read\/\d+[,_]\d+$/,
      titleSelector: "h1",
      indexSelector: "td a[href='./']",
      contentSelector: "#AllySite+div",
      contentRemove: "b, b+p",
      contentReplace: [
          "请记住本站域名:"
      ]
  },
  {siteName: "更新吧",
      url: "^https?://www\\.gengxin8\\.com/read/\\d+/\\d+.html$",
      bookTitleSelector: '.left a:last',
      contentSelector: "#chaptertxt",
      useiframe: true,
  },
  {siteName: "闪文书库",
      url: "^https?://read\\.shanwen\\.com/html/\\d+/\\d+/\\d+\\.html",
      titleSelector: '.newstitle',
      contentRemove: '#titlebottom',
      contentReplace: [
          '闪文网址中的.*?注册会员</a>'
      ]
  },
  {siteName: "去读读",
      url: "^https?://www\\.qududu\\.net/book/\\d+/\\d+/\\d+\\.html",
      contentSelector: "#kui-page-read-txt",
  },
  {siteName: "我文阁小说网",
      url: "^https?://www\\.mytxt\\.cc/read/\\d+/\\d+\\.html",
      titleReg: '(.*?)_(.*?)_',
      contentSelector: 'div[class^="detail_con_"]',
      contentRemove: 'p[style="font-size:11.3px;"]',
  },
  {siteName: "百度阅读",
      url: "^https://yd\\.baidu\\.com/view/.*?\\?cn=.*",
      titleSelector: '.catHead > p',
      bookTitleSelector: '.catHead > h1',
      contentSelector: ".r_c",
      contentPatch: function($doc) {
        // 移除书名中不需要的
        var $bookTitle = $doc.find('.catHead > h1');
        $bookTitle.find('a').remove();
        $bookTitle.text($bookTitle.text().replace('> ', ''));
      }
  },

  // ===== 特殊的获取下一页链接
//   {siteName: "看书啦",
//       url: "^https?://www.kanshu.la/book/\\w+/\\d+\\.shtml",
//       titleReg: "(.*)-(.*)-看书啦",
//       titlePos: 1,
//       nextUrl: function($doc){
//           var html = $doc.find('script:contains(next_page = ")').html();
//           var m = html.match(/next_page = "(.*?)";/);
//           if (m) return m[1];
//       },
//       prevUrl: function($doc){
//           var html = $doc.find('script:contains(preview_page = ")').html();
//           var m = html.match(/preview_page = "(.*?)";/);
//           if (m) return m[1];
//       }
//   },
  {siteName: '书海小说',
     url: '^https?://www\\.shuhai\\.com/read/\\d+/\\d+\\.html',
     bookTitleSelector: '.path2 a:nth-of-type(3)',
     titleSelector: '.read_top h1',
     prevSelector: '.read .read_dwn p a:nth-of-type(1)',
     indexSelector: '.read .read_dwn p a:nth-of-type(2)',
     nextSelector: '.read .read_dwn p a:nth-of-type(3)',
     contentSelector: '.read .txt',
  },
  {siteName: '书轩网',
      url: '^https?://www.bookxuan.com/\\d+_\\d+/\\d+.html',
      bookTitleSelector: '.con_top a:last',
      contentReplace: [
          { '&amp;quot;': '"', },
          'getreadset;',
          '&lt;div class="divimage"&gt;&lt;img src="',
      ],
      contentPatch: function($doc) {
          $doc.find('#content[title="书，轩，网"]').remove();
      }
  },
  {siteName: '大家读书院',
      url: '^https?://www.dajiadu.net/files/article/html/\\d+/\\d+/\\d+.html',
      contentSelector: '#content, #content1',
      contentRemove: '.copy',
  },
  {siteName: "露西弗俱乐部",
    exampleUrl: 'https://www.lucifer-club.com/chapter-83716-1.html',
    url: /^https:\/\/www\.lucifer\-club\.com\/.*\.html/,
    bookTitleSelector: "#luf_local > a:nth-child(3)",

    indexSelector: '.luf_news_title > a:contains("目录")',

    contentSelector: "#luf_news_contents",
    contentHandle: false,
    contentRemove: "> form, #luf_local, .luf_top_ad, .luf_news_title, .luf_page_control, .luf_comment",
    contentReplace: [
        '保护版权 尊重作者 @ 露西弗俱乐部 www.lucifer-club.com',
    ],
  },
  {siteName: '英文小说网',
    url: '^https?://novel\\.tingroom\\.com/.*/\\d+/\\d+\\.html',

    bookTitleSelector: '.gundong1  a:nth-child(3)',
    titleSelector: '#tt_text p:nth-child(2)',

    indexSelector: ".book_showtitle",
    prevSelector: "#zhang_top",
    nextSelector: "#zhang_down",

    contentSelector: "#tt_text",
    contentRemove: "#tt_text tbody tr",
    contentReplace: [
        '欢迎访问英文小说网http://novel.tingroom.com'
    ],
  },
  {siteName: '笔趣阁 nuanyuehanxing',
    url: '^https?://www\\.nuanyuehanxing\\.com/\\w+/\\d+/\\d+\\.html',
    bookTitleSelector: '.bookname',
    timeout: 500,
    useiframe: true,
    contentRemove: 'a',
  },

  // 这网站为了防抓取，内容顺序都是不对的，只好采用 iframe 方式
  {siteName: '和图书',
    exampleUrl: 'http://www.hetushu.com/book/1421/964983.html',
    url: '^https?://www.hetushu.com/book/\\d+/\\d+.html',
    bookTitleSelector: '#left h3',
    nextSelector: 'a#next',
    prevSelector: 'a#pre',
    indexSelector: '#left h3 a',
    useiframe: true,
    // 后面的是 和图书 的干扰码
    contentRemove: 'h2, acronym, bdo, big, cite, code, dfn, kbd, q, s, samp, strike, tt, u, var, ins',
    contentPatch: function($doc) {
        // 转换 div 到 p
        $doc.find('#content div').each(function() {
            let html = $(this).html()
            $(this).replaceWith(
                $('<p>').html(html)
            )
        })
    }
  },

  // 移动版
  {siteName: "掌阅手机网",
      url: "https?://wap\\.yc\\.ireader\\.com\\.cn/book/\\d+/\\d+/",
      titleReg: "(.*?),.*?作品 - 掌阅小说网",
      titlePos: 0,
      titleSelector: "h4",
      contentSelector: "div.text",
      isVipChapter: function ($doc) {
          if ($doc.find('.vipzj').length) {
              return true;
          }
      }
  },

  {siteName: "69书吧",
    url: "https?://www\\.69shu\\.com/txt/\\d+/\\d+",
    // contentHandle: false,
    titleSelector: 'h1',
    contentSelector: ".txtnav",
    contentRemove: ".txtinfo.hide720, #txtright, .bottom-ad",
    nextSelector: '.page1 a:nth-child(4)',
    prevSelector: '.page1 a:nth-child(1)',
    indexSelector: '.page1 a:nth-child(3)',
    },

  {siteName: "读万卷",
    url: "https?://www\\.duwanjuan\\.com/html/\\d+/\\d+/\\d+\\.html",
    titleSelector: 'h1',
    contentSelector: "#acontent",
    contentRemove: ".tishi",
    nextSelector: '.footlink a:nth-child(3)',
    prevSelector: '.footlink a:nth-child(1)',
    indexSelector: '.footlink a:nth-child(2)',
    contentReplace: ['\\(读万卷 www.duwanjuan.com\\)','读万卷 www\\.duwanjuan\\.com'],
    },

  {siteName: "书山中文网",
    url: "https?://shushan\\.zhangyue\\.net/book/\\d+/\\d+/",
    contentSelector: ".art_con",
    nextSelector: '.next-cha',
    prevSelector: '.last-cha',
    indexSelector: 'a:contains(书页)',
    },
  
  {siteName: "微信读书",
    url: "https?://weread\\.qq\\.com/web/reader/.*?",
    contentSelector: ".wr_canvasContainer",
    nextSelector: '#nextchapter',
    prevSelector: '#prevchapter',
    indexSelector: '#bookindex',
    titleSelector: '.chapterTitle',
    contentHandle: false,
    useRawContent: true, // 完全关闭 handleContentText 内容处理函数，使用原始内容
    useiframe: true,
    mutationSelector: '.wr_canvasContainer',
    mutationChildCount: 1,
    contentPatchAsync: async function ($doc) {
        // ---------------参数编解码---------------
        // 编码
        function encode(plainText) {
            if (('number' == typeof plainText && (plainText = plainText.toString()), 'string' != typeof plainText))
                return plainText
            var md5Hash = CryptoJS.MD5(plainText).toString(CryptoJS.enc.Hex),
                _0xf208b6 = md5Hash.substr(0, 3),
                _0x2045c1 = (function (plainText) {
                    if (/^\d*$/.test(plainText)) {
                        for (
                            var _0x1c7c70 = plainText.length, _0x9fd207 = [], _0x2fd6ee = 0;
                            _0x2fd6ee < _0x1c7c70;
                            _0x2fd6ee += 9
                        ) {
                            var _0x4089d1 = plainText.slice(_0x2fd6ee, Math.min(_0x2fd6ee + 9, _0x1c7c70))
                            _0x9fd207.push(parseInt(_0x4089d1).toString(16))
                        }
                        return ['3', _0x9fd207]
                    }
                    for (var _0x4b46c9 = '', _0x1f2538 = 0; _0x1f2538 < plainText.length; _0x1f2538++)
                        _0x4b46c9 += plainText.charCodeAt(_0x1f2538).toString(16)
                    return ['4', [_0x4b46c9]]
                })(plainText)
            ;(_0xf208b6 += _0x2045c1[0]), (_0xf208b6 += 2 + md5Hash.substr(md5Hash.length - 2, 2))
            for (var _0x59bebd = _0x2045c1[1], _0x1aafd3 = 0; _0x1aafd3 < _0x59bebd.length; _0x1aafd3++) {
                var _0x1af4ac = _0x59bebd[_0x1aafd3].length.toString(16)
                1 === _0x1af4ac.length && (_0x1af4ac = '0' + _0x1af4ac),
                    (_0xf208b6 += _0x1af4ac),
                    (_0xf208b6 += _0x59bebd[_0x1aafd3]),
                    _0x1aafd3 < _0x59bebd.length - 1 && (_0xf208b6 += 'g')
            }
            return (
                _0xf208b6.length < 20 && (_0xf208b6 += md5Hash.substr(0, 20 - _0xf208b6.length)),
                (_0xf208b6 += CryptoJS.MD5(_0xf208b6).toString(CryptoJS.enc.Hex).substr(0, 3))
            )
        }
        // 解码
        function decode(encodedText) {
            if ('string' != typeof encodedText || encodedText.length <= 3) return ''
            for (
                var _0x25eace = encodedText.charAt(3),
                    _0x6aad1d = 5 + parseInt(encodedText.charAt(4)),
                    _0x23fa2c = encodedText.length - 3,
                    _0xb4db26 = '',
                    _0x2bf2ee = _0x6aad1d;
                _0x2bf2ee < _0x23fa2c && (_0x2bf2ee === _0x6aad1d || 'g' === encodedText.charAt(_0x2bf2ee));

            ) {
                if ((_0x2bf2ee !== _0x6aad1d && _0x2bf2ee++, _0x2bf2ee + 2 > _0x23fa2c)) return ''
                var _0x436006 = parseInt(encodedText.substr(_0x2bf2ee, 2), 16)
                if (_0x2bf2ee + 2 + _0x436006 > _0x23fa2c) return ''
                var _0x3f72db = encodedText.substr(_0x2bf2ee + 2, _0x436006),
                    _0x41cdae = ''
                if ('3' === _0x25eace) {
                    var _0x3c987c = parseInt(_0x3f72db, 16)
                    if (isNaN(_0x3c987c)) return ''
                    _0x41cdae = '' + _0x3c987c
                } else
                    for (var _0x293868 = 0, _0x14b43a = _0x3f72db.length; _0x293868 < _0x14b43a; _0x293868 += 2) {
                        var _0x4f2610 = parseInt(_0x3f72db.substr(_0x293868, 2), 16)
                        _0x41cdae += String.fromCharCode(_0x4f2610)
                    }
                ;(_0xb4db26 += _0x41cdae), (_0x2bf2ee = _0x2bf2ee + 2 + _0x436006)
            }
            return _0xb4db26
        }
        // ---------------参数编解码---------------

        if (!this.__weReadJson) {
            var reqObj = {
                url: this.curPageUrl,
                method: "GET",
                overrideMimeType: "text/html;charset=utf-8",
                headers: {},
            };
            const res = await Request(reqObj)
            var text = res.responseText;
            this.__weReadJson = JSON.parse(getMiddleStr(text, 'window.__INITIAL_STATE__=', ';'))
        }

        var chapterList = this.__weReadJson.reader.chapterInfos

        const re = /\/web\/reader\/([0-9a-f]+)k?([0-9a-f]+)?/g
        const matchs = [...this.curPageUrl.matchAll(re)]
        let bookId,
            chapterUid = null
        if (matchs) {
            bookId = decode(matchs[0][1])
            if (matchs[0].length === 3) {
                chapterUid = parseInt(decode(matchs[0][2]))
            }
        }

        var currentChapter = chapterList.find(e => e.chapterUid === chapterUid)

        var { chapterIdx } = currentChapter || { chapterIdx: 1 }

        var nextUrl, prevUrl, indexUrl

        indexUrl = '/web/reader/' + encode(bookId)

        if (chapterIdx === chapterList.length) {
            nextUrl = ''
        } else {
            var nextChapterUid = chapterList[chapterIdx].chapterUid
            nextUrl = indexUrl + 'k' + encode(nextChapterUid)
        }

        if (chapterUid && chapterUid > 1) {
            var prevChapterUid = chapterList[chapterIdx - 2].chapterUid
            prevUrl = indexUrl + 'k' + encode(prevChapterUid)
        } else {
            prevUrl = ''
        }

        var dataUrls = []

        $doc.find('.wr_canvasContainer canvas').each(function () {
            dataUrls.push(this.toDataURL())
            $(this).remove()
        })

        var $body = $doc.find('body')
        if (nextUrl) {
            // 加上一页链接
            $('<div id="nextchapter">').attr('href', nextUrl).appendTo($body)
        }
        if (prevUrl) {
            // 加下一页链接
            $('<div id="prevchapter">').attr('href', prevUrl).appendTo($body)
        }
        // 目录
        $('<div id="bookindex">目录</div>').attr('href', indexUrl).appendTo($body)
        // 正文
        var $container = $doc.find('.wr_canvasContainer')
        for (const dataUrl of dataUrls) {
            $('<img>').attr('src', dataUrl).appendTo($container)
        }
        
    }
    },

    {siteName: "飞卢小说网",
        url: "^https?://b\\.faloo\\.com/\\d+_\\d+\\.html",
        titleSelector: "h1",
        bookTitleSelector: "#novelName",

        nextSelector: "a#next_page",
        prevSelector: "a#pre_page",
        indexSelector: "a#huimulu",

        contentSelector: ".noveContent",
    
        contentReplace: [
            "飞卢小说网 b.faloo.com 欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在飞卢小说网！",
        ],
    },

    {siteName: '小说321',
        url: 'https?://www\\.xs321\\.net/book/\\d+/\\d+/\\d+(_\\d+)?.html',
        useSiteFont: true,
        checkSection: true,
        contentReplace: ['.*www\\.xs321\\.net.*',
                        '本章未完，请点击下一页继续阅读！']
    },

    {siteName: '45中文',
        url: 'https?://v1\\.45zw\\.com/book/\\d+/\\d+(_\\d+)?.html',
        useSiteFont: true,
        checkSection: true,
        contentSelector: '#booktxt',
        contentRemove: 'div',

    },

    {siteName: '斋书院',
        url: 'https?://www\\.zhaishuyuan\\.org/book/\\d+/\\d+(_\\d+)?.html',
        checkSection: true,
    },

    {siteName: '123读',
        url: 'https?://www\\.123ds\\.org/dudu-\\d+/\\d+/\\d+(-\\d+)?.html',
        checkSection: true,
        useiframe: true,
        contentSelector: '#DivContentBG > div:nth-child(9)',
        contentReplace: ['…。。\\s本章未完，请点击下一页继续阅读！',
                        '本文来源：123读书网。',
                        '\\*[,，]转载请注明处：123ds.org 。',
                        {'。.*提醒你：看后求收藏123读书网，接着再看好方便。':'。'}]

    },

    {siteName: 'YY文轩',
        url: 'https?://www\\.yywenxuan\\.com/\\d+/\\d+\\.html',
        useiframe: true,

    },

    {siteName: '霹雳书坊',
        url: 'https?://(?:www|m).pilibook.com/\\d+/\\d+/\\d+.html',
        exampleUrl: 'https://www.pilibook.com/2/2781/692547.html',

        nextSelector($doc) {
            return $doc.find('img[src="https://m.pilibook.com/17mb/style/03.png"]')
                .parent()
                .attr('href')
        },
        prevSelector($doc) {
            return $doc.find('img[src="https://m.pilibook.com/17mb/style/01.png"]')
                .parent()
                .attr('href')
        },
        indexSelector($doc) {
            return $doc.find('img[src="https://m.pilibook.com/17mb/style/05.png"]')
                .parent()
                .attr('href')
        },

    },

    {siteName: '飞速中文',
        url: 'https://(?:www.)?(?:feiszw|xn--fiq228cu93a4kh).com/Html/\\d+/\\d+.html',
        exampleUrl: 'https://www.feiszw.com/Html/21975/18399024.html',

        contentRemove: 'p[style], .l',
        noSection: true,

    },

    {siteName: '搜小说/搜书网/酷笔记',
        url: 'www.(?:so(?:xs)?(?:cc)?(?:shuw)?w?|kubiji).(?:cc|com|net|org)',

        contentReplace: ['您可以在百度里搜索.*查找最新章节！'],
        contentPatch($doc) {
            $doc.find('p').remove()
        },

        nextSelector: '.pagego > a:nth-child(5)',
        indexSelector: '.pagego > a:nth-child(3)',
        prevSelector: '.pagego > a:nth-child(2)',
    },

    {siteName: '中文成人文学网',
        url:'https?://book.xbookcn.net/\\d+/\\d+/.*.html',
        exampleUrl: 'https://book.xbookcn.net/2000/03/1_40.html',

        contentSelector: '.post-body',
        bookTitleSelector: '.post-labels > a',
        nextSelector: '#Blog1_blog-pager-older-link',
        indexSelector: '.post-labels > a',
        prevSelector: '#Blog1_blog-pager-newer-link',
    },

    {siteName: '顶点小说',
        url: 'http://www\\.ddxs\\.com/.*?/\\d+.html',
        exampleUrl: 'http://www.ddxs.com/yuanzun/1.html',

        contentSelector: '#contents',
        bookTitleSelector: 'dl > dt > a:last',
        noSection: true,

    },

    {siteName: '爱好中文网',
        url: 'https?://www.ah123z.com/\\d+/\\d+/\\d+.html',
        exampleUrl: 'https://www.ah123z.com/10/10110/6319325.html',

        contentSelector: '#content',
        bookTitleSelector: '.topmenu a:last',
        noSection: true,

    },

    {siteName: '铅笔小说',
        url: 'https?://www.23qb.com/book/\\d+/\\d+(?:_\\d+)?.html',
        exampleUrl: 'https://www.23qb.com/book/187203/70954846.html',

        contentPatch($doc) {
            const re = toRE("\\{url_previous:'(.*?)',url_next:'(.*?)',url_index:'(.*?)',\\}")
            const ReadParams = $doc.find('script:contains(ReadParams)').text()
            const [_, url_previous, url_next, url_index] = re.exec(ReadParams)
            let previousName = $doc.find('#readbg > p > a:nth-child(1)').text()
            switch (previousName) {
                case '<-':
                    previousName = '上一页'
                    break;
                case '<<':
                    previousName = '上一章'
                    break;
                default:
                    break;
            }
            let nextName = $doc.find('#readbg > p > a:nth-child(5)').text()
            switch (nextName) {
                case '->':
                    nextName = '下一页'
                    break;
                case '>>':
                    nextName = '下一章'
                    break;
                default:
                    break;
            }
            const body = $doc.find('body')

            $doc.find('p:contains(（继续下一页）)').remove()

            $('<a>').attr('href', url_previous).text(previousName).appendTo(body)
            $('<a>').attr('href', url_next).text(nextName).appendTo(body)
            $('<a>').attr('href', url_index).text('目录').appendTo(body)

        },
        contentReplace: ['铅笔小说 23qb.com']
    },

    {siteName: '爱尚小说',
        url: 'https://www.asxs.com/view/\\d+/\\d+.html',
        exampleUrl: 'https://www.asxs.com/view/174811/2330811.html',

        noSection: true

    }

];

export default sites