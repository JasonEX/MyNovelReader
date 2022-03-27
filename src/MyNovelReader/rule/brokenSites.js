// 失效网站规则存档

// R.I.P.
// 在检查小说网站失效的时候发现有些小说网站的网页顶部有一句这样的标语：
// (<小说网站名>)还是当年的味道！你知道，有些鸟儿，是注定不会被关在牢笼里的，它们的每一片羽毛都闪耀着自由的光辉。

const brokenSites = [
  // 特殊站点，需再次获取且跨域。添加 class="reader-ajax"，同时需要 src, charset
  {siteName: '起点新版',
      url: '^https?://read\\.qidian\\.com/BookReader/.*\\.aspx',
      bookTitleSelector: '.story_title .textinfo a:nth-child(1)',
      titleSelector: '.story_title h1',

      prevSelector: '#pagePrevRightBtn',
      nextSelector: '#pageNextRightBtn',
      indexSelector: function() {
          return location.href.replace(/,.*?\.aspx$/, '.aspx').replace('BookReaderNew', 'BookReader');
      },

      mutationSelector: "#chaptercontainer",  // 内容生成监视器
          mutationChildCount: 1,
      contentSelector: '#content, .bookreadercontent',
      contentRemove: 'a[href="http://www.qidian.com"]',
      contentReplace: [
          '手机用户请到m.qidian.com阅读。'
      ],
      contentPatch: function(fakeStub){
          fakeStub.find('script[src$=".txt"]').addClass('reader-ajax');
      },
  },
  {siteName: "起点中文、起点女生、起点文学",
  url: "^https?://(www|read|readbook|wwwploy|cga|big5ploy)\\.(qidian|qdmm|qdwenxue)\\.com/BookReader/.*",
  // titleReg: "小说:(.*?)(?:独家首发)/(.*?)/.*",
  titleSelector: "#lbChapterName",
  bookTitleSelector: ".page_site > a:last",
  // contentSelector: "#hdContent",
  nextUrl: function($doc){  // 为了避免起点某次改版后把1页拆成2页，然后造成重复载入第一页的情况
      var html = $doc.find('script:contains(nextpage=)').html();
      if (!html) return;
      var m = html.match(/nextpage='(.*?)'/);
      if (m) return m[1];
  },
  prevUrl: function($doc){
      var html = $doc.find('script:contains(prevpage=)').html();
      if (!html) return;
      var m = html.match(/prevpage='(.*?)'/);
      if (m) return m[1];
  },
  contentReplace: {
      "\\[img=(.*)\\]": "<p><img src='$1'></p><p>",
      "\\[+CP.*(http://file.*\\.jpg)\\]+": "<p><img src='$1'></p><p>",
      "\\[bookid=(\\d+)，bookname=(.*?)\\]": "<a href='http://www.qidian.com/Book/$1.aspx'>$2</a>",
      "www.cmfu.com发布|起点中文网www.qidian.com欢迎广大书友光临阅读.*": "",
      '(<p>\\s+)?<a href="?http://www.(?:qidian|cmfu).com"?>起点中文网.*': '',

      '([\\u4e00-\\u9fa5])[%￥]+([\\u4e00-\\u9fa5])': '$1$2',  // 屏蔽词修正，例如：风%%骚
  },
  contentRemove: "span[id^='ad_'], .read_ma",
  contentPatch: function(fakeStub){
      fakeStub.find('script[src$=".txt"]').addClass('reader-ajax');
  },
},
  {siteName: "起点中文网免费频道",
      url: "^https?://free\\.qidian\\.com/Free/ReadChapter\\.aspx",
      titleSelector: ".title > h3",
      bookTitleSelector: ".site_rect > a:last",
      contentSelector: "#chapter_cont, #content",
      contentRemove: ".nice_books",
      contentReplace: {
          "\\[img=(.*)\\]": "<p><img src='$1'></p><p>",
          "\\[+CP.*(http://file.*\\.jpg)\\]+": "<p><img src='$1'></p><p>",
          "\\[bookid=(\\d+)，bookname=(.*?)\\]": "<a href='http://www.qidian.com/Book/$1.aspx'>$2</a>",
          "www.cmfu.com发布|起点中文网www.qidian.com欢迎广大书友光临阅读.*": "",
          '(<p>\\s+)?<a href="?http://www.(?:qidian|cmfu).com"?>起点中文网.*': ''
      },
      contentPatch: function(fakeStub) {
          fakeStub.find('#chapter_cont, #content > script:first').addClass('reader-ajax');
      }
  },
  // {siteName: "磨铁",
  // 	url: '^https?://www.motie.com/book/\\d+_\\d+',
  // 	contentSelector: '.page-content'
  // },
  // {siteName: "天涯在线书库（部分支持）",
  //     url: /www\.tianyabook\.com\/.*\.htm/,
  //     titleSelector: ".max, h1:first",
  //     bookTitleSelector: "td[width='70%'] > a[href$='index.htm']",
  //     contentSelector: "div > span.middle, #texts",
  //     contentHandle: false,
  // },
  // {siteName: "易读",
  //     url: "^https?://www.yi-see.com/read_\\d+_\\d+.html",
  //     contentSelector: 'table[width="900px"][align="CENTER"]'
  // },
  {siteName: "燃文",
      url: /^https?:\/\/www\.(?:ranwena?\.(cc|net|com)|64mi\.com)\/.*\.html$/,
      titleReg: /(.*?)-(.*?)-燃文/,
      contentSelector: "#oldtext, #contents",
      contentRemove: "div[style], script",
      contentReplace: [
          /\((&nbsp;)*\)/g,
          /最快更新78小说|\(?百度搜.\)|访问下载tXt小说|百度搜\|索|文\|学|文学全文.字手打|\((&nbsp;)+|牛过中文..hjsm..首发.转载请保留|\[本文来自\]|♠思♥路♣客レ|※五月中文网 5y ※|无错不跳字|最快阅读小说大主宰.*|跟我读Ｈ－u－n 请牢记|非常文学|关闭&lt;广告&gt;|w w.*|”娱乐秀”|更多精彩小[说說].*|高速更新/g,
          /[\(\*◎]*(百度搜)?文.?[學学].?[馆館][\)\*）]*|\(百度搜\)/g,
          /提供无弹窗全文字在线阅读.*|高速首发.*如果你觉的本章节还不错的话.*/g,
          /书网∷更新快∷无弹窗∷纯文字∷.t！。/g,
          /一秒记住，本站为您提供热门小说免费阅读。/g,
          /\(更新速度最快记住即可找到\)|芒果直播网|.mgzhibo .|去 读 读|看小说就到/g,
          '火然\\?\\?\\? \\?文&nbsp;&nbsp;ｗ\\?ｗｗ.ｒａｎｗｅｎａ.com',
      ]
  },
  {siteName: "燃文小说网",
      url: "^https?://www\\.ranwenxiaoshuo\\.com/files/article/html/\\d+/\\d+/\\d+\\.html|http://www\\.ranwenxiaoshuo\\.com/\\w+/\\w+-\\d+-\\d+\\.html",
      titleReg: /(.*?)最新章节(.*?)在线阅读.*/,
      contentSelector: "#fontsize",
      contentReplace: "天才一秒记住[\\s\\S]+为您提供精彩小说阅读。",
  },
  {siteName: "燃文小说",
      url: "^https?://www\\.ranwen\\.net/files/article/\\d+/\\d+/\\d+\\.html",
      titleReg: "(\\S+) (.*) - 燃文小说",
      contentReplace: "\\(.*燃文小说.*\\)|【 注册会员可获私人书架，看书更方便！永久地址： 】 "
  },
  {siteName: "无错小说网",
      url: /^https?:\/\/www\.(?:wcxiaoshuo|xiaoshuoz|quledu)\.com\/wcxs[-\d]+\//,
      titleReg: /(.*?)最新章节.*?-(.*?)-.*/,
      titlePos: 1,
      nextSelector: "a#htmlxiazhang",
      prevSelector: "a#htmlshangzhang",
      indexSelector: "a#htmlmulu",
      contentReplace: [
          'ilo-full-src="\\S+\\.jpg" ',
          {
              '(<center>)?<?img src..(http://www.wcxiaoshuo.com)?(/sss/\\S+\\.jpg).(>| alt."\\d+_\\d+_\\d*\\.jpg" />)(</center>)?': '$3',
              "/sss/da.jpg": "打", "/sss/maws.jpg": "吗？", "/sss/baw.jpg": "吧？", "/sss/wuc.jpg": "无", "/sss/maosu.jpg": "：“", "/sss/cuow.jpg": "错", "/sss/ziji.jpg": "自己", "/sss/shenme.jpg": "什么", "/sss/huiqub.jpg": "回去", "/sss/sjian.jpg": "时间", "/sss/zome.jpg": "怎么", "/sss/zhido.jpg": "知道", "/sss/xiaxin.jpg": "相信", "/sss/faxian.jpg": "发现", "/sss/shhua.jpg": "说话", "/sss/dajiex.jpg": "大姐", "/sss/dongxi.jpg": "东西", "/sss/erzib.jpg": "儿子", "/sss/guolair.jpg": "过来", "/sss/xiabang.jpg": "下班", "/sss/zangfl.jpg": "丈夫", "/sss/dianhua.jpg": "电话", "/sss/huilaim.jpg": "回来", "/sss/xiawu.jpg": "下午", "/sss/guoquu.jpg": "过去", "/sss/shangba.jpg": "上班", "/sss/mingtn.jpg": "明天", "/sss/nvrenjj.jpg": "女人", "/sss/shangwo.jpg": "上午", "/sss/shji.jpg": "手机", "/sss/xiaoxinyy.jpg": "小心", "/sss/furene.jpg": "夫人", "/sss/gongzih.jpg": "公子", "/sss/xiansg.jpg": "先生", "/sss/penyouxi.jpg": "朋友", "/sss/xiaoje.jpg": "小姐", "/sss/xifup.jpg": "媳妇", "/sss/nvxudjj.jpg": "女婿", "/sss/xondi.jpg": "兄弟", "/sss/lagong.jpg": "老公", "/sss/lapo.jpg": "老婆", "/sss/meimeid.jpg": "妹妹", "/sss/jiejiev.jpg": "姐姐", "/sss/jiemeiv.jpg": "姐妹", "/sss/xianggx.jpg": "相公", "/sss/6shenumev.jpg": "什么", "/sss/cuoaw.jpg": "错", "/sss/fpefnyoturxi.jpg": "朋友", "/sss/vfsjgigarn.jpg": "时间", "/sss/zzhiedo3.jpg": "知道", "/sss/zibjib.jpg": "自己", "/sss/qdonglxi.jpg": "东西", "/sss/hxiapxint.jpg": "相信", "/sss/fezrormre.jpg": "怎么", "/sss/nvdrfenfjfj.jpg": "女人", "/sss/jhiheejeieev.jpg": "姐姐", "/sss/xdifagojge.jpg": "小姐", "/sss/gggugolgair.jpg": "过来", "/sss/maoashu.jpg": "：“", "/sss/gnxnifawhu.jpg": "下午", "/sss/rgtugoqgugu.jpg": "过去", "/sss/khjukilkaim.jpg": "回来", "/sss/gxhigfadnoxihnyy.jpg": "小心", "/sss/bkbskhhuka.jpg": "说话", "/sss/xeieavnfsg.jpg": "先生", "/sss/yuhhfuiuqub.jpg": "回去", "/sss/pdianphua.jpg": "电话", "/sss/fabxianr.jpg": "发现", "/sss/feilrpto.jpg": "老婆", "/sss/gxronfdri.jpg": "兄弟", "/sss/flfaggofng.jpg": "老公", "/sss/tymyigngtyn.jpg": "明天", "/sss/dfshfhhfjfi.jpg": "手机", "/sss/gstjhranjgwjo.jpg": "上午", "/sss/fmgeyimehid.jpg": "妹妹", "/sss/gxgihftutp.jpg": "媳妇", "/sss/cerztifb.jpg": "儿子", "/sss/gfxgigagbfadng.jpg":"下班", "/sss/gstjhranjg.jpg":"下午", "/sss/hjeirerm6eihv.jpg": "姐妹", "/sss/edajihexr.jpg": "大姐", "/sss/wesfhranrrgba.jpg": "上班", "/sss/gfognggzigh.jpg": "公子", "/sss/frurtefne.jpg": "夫人", "/sss/fzagnggfbl.jpg": "丈夫", "/sss/nvdxfudfjfj.jpg": "女婿", "/sss/xdidafnggx.jpg": "相公", "/sss/zenme.jpg": "怎么", "/sss/gongzi.jpg": "公子", "/sss/ddefr.jpg": "",
          },
          ".*ddefr\\.jpg.*|无(?:错|.*cuoa?w\\.jpg.*)小说网不[少跳]字|w[a-z\\.]*om?|.*由[【无*错】].*会员手打[\\s\\S]*",
          "是 由",
          "无错不跳字|无广告看着就是爽!|一秒记住.*|全文免费阅读.*|8 9 阅阅 读 网|看小说最快更新|“小#说看本书无广告更新最快”",
          "[\\x20-\\x7e》]?无(?:.|&gt;)错.小说.{1,2}[Ｗw]+.*?[cＣ][oＯ][mＭ]",
          "<无-错>",
          "—无—错—小说",
          "\\+无\\+错\\+",
          "&amp;无&amp;错&amp;小说",
          "无错小说 www.quled[Ｕu].com",
      ],
      contentPatch: function(fakeStub){
          // 去除内容开头、结尾的重复标题
          var title = fakeStub.find("#htmltimu").text().replace(/\s+/, "\\s*");
          var content = fakeStub.find("#htmlContent");
          content.find("div[align='center']").remove();
          if(title.match(/第\S+章/)){
              content.html(content.html().replace(new RegExp(title), "").replace(new RegExp(title), ""));
          }
      }
  },
  {siteName: '凤舞文学网',
      url: '^https?://www\\.wenxue8\\.org/html/\\d+/\\d+/\\d+\\.html',
      contentReplace: [
          {
              '<img src="/keywd/R43.gif">':'爱', '<img src="/keywd/A13.gif">': '情', '<img src="/keywd/D10.gif">': '床',
              '<img src="/keywd/Y19.gif">': '奸', '<img src="/keywd/H21.gif">': '屁', '<img src="/keywd/Z23.gif">': '逼',
              '<img src="/keywd/G42.gif">': '身', '<img src="/keywd/Y2.gif">':'性', '<img src="/keywd/D32.gif">':'热',
              '<img src="/keywd/I44.gif">':'挺', '<img src="/keywd/H30.gif">':'贱', '<img src="/keywd/H25.gif">':'荡',
              '<img src="/keywd/V7.gif">':'肉', '<img src="/keywd/O22.gif">':'吮', '<img src="/keywd/H9.gif">':'春',
              '<img src="/keywd/K36.gif">':'日', '<img src="/keywd/O15.gif">':'胸', '<img src="/keywd/S31.gif">':'欲',
              '<img src="/keywd/F20.gif">':'射', '<img src="/keywd/N12.gif">':'禁', '<img src="/keywd/R26.gif">':'殿',
              '<img src="/keywd/X6.gif">':'诱', '<img src="/keywd/U46.gif">': '娇',
              '<img src="/keywd/M24.gif">': '操', '<img src="/keywd/B4.gif">':'骚', '<img src="/keywd/O3.gif">':'阴',
          }
      ]
  },
  {siteName: "冰火中文",
      url: /^https?:\/\/www\.binhuo\.com\/html\/[\d\/]+\.html$/,
      titleReg: /(.*?)最新章节,(.*?)-.*/,
      fixImage: true,
      contentRemove: 'font[color="red"]',
      contentReplace: {
          "&lt;冰火#中文.*|冰火中文&nbsp;(www.)?binhuo.com(?:【首发】|)|冰.火.中文|绿色小说|lvsexs|冰火中文": "",
          "LU5.ｃｏM|lU５.com|LU5.com":"",
          "([^/])www\\.binhuo\\.com(?:\\.com|)": "$1",
          "\\(.*?平南文学网\\)": "",
      },
      contentPatch: function(fakeStub){
          fakeStub.find("#BookText").append(fakeStub.find("img.imagecontent"));
      }
  },
  {siteName: "百晓生",
      url: /^https?:\/\/www\.bxs\.cc\/\d+\/\d+\.html/,
      titleReg: /(.*?)\d*,(.*)/,
      contentRemove: 'a, #txtright',
      contentReplace: [
          /一秒记住【】www.zaidu.cc，本站为您提供热门小说免费阅读。/ig,
          /（文&nbsp;學馆w&nbsp;ww.w&nbsp;xguan.c&nbsp;om）/ig,
          /（百晓生更新最快最稳定\)/g,
          /\((?:&nbsp;)*(?:无弹窗)?全文阅读\)/ig,
          /\[<a.*?首发\[百晓生\] \S+/ig,
          /高速首发.*本章节是地址为/ig,
          /\/\/(?:&nbsp;|访问下载txt小说|高速更新)+\/\//ig,
          /(www\.)?bxs\.cc|www\.bxs(\.com)?/ig,
          /百晓生.不跳字|不跳字。|更新快纯文字/ig,
          /\.\[，！\]/ig,
          /（未完待续&nbsp;http:\/\/www.Bxs.cc&nbsp;89免费小说阅《百晓生文学网》）/g,
          /〖百晓生∷.*〗|《?百晓生文学网》?|最快阅读小说大主宰，尽在百晓生文学网.*|ww.x.om|欢迎大家来到.*?bxs\.cc|百晓生阅读最新最全的小说.*|百晓生网不少字|站长推荐.*|文字首发|百.晓.生.|关闭.*广告.*|飘天文学|本站域名就是.*|\(.{0,5}小说更快更好.{0,5}\)|(请在)?百度搜索.*|一秒记住.*为您提供精彩小说阅读.|百晓生|¤本站网址：¤|\/\/&nbsp;访问下载txt小说\/\/◎◎|纯站点\\".*值得收藏的/ig,
          /文[学學][馆館]|www\.biquge\.cc|(http:\/\/)?www\.Bxs\.cc|(请牢记)?soudu．org/ig,
          /请搜索，小说更好更新更快!|最快文字更新无弹窗无广|\(即可找到本站\)|无广告看着就是爽!|更多全本txt小说请到下载|∷更新快∷∷纯文字∷/ig,
          /永久网址，请牢记！/ig,
          /&nbsp;&gt;<\/p>/ig,
      ],
  },
  {siteName: "浩奇文学网",
      url: /^https?:\/\/www\.haoqi99\.com\/.*\.shtml$/,
      titleReg: /^(.*?)--(.*?)-/,
  },
  {siteName: "书河小说网",
      url: /^https?:\/\/www\.shuhe\.cc\/\d+\/\d+/,
      titleReg: "([^\\d]+)\\d*,(.*?)_",
      contentSelector: "#TXT",
      contentReplace: /一秒记住.*为您提供精彩小说阅读.|\{请在百度搜索.*首发阅读\}|（书河小说网.*?无弹窗）|wxs.o|ww.x.om|[\[【\(].{1,30}[\]\)】]|ff37;.*|书河小说网高速首发.*|TXT下载|全文阅读|第一书河小说网|百书斋.*|首发来自书河小说网|本书最新章节|书河小说网/ig,
  },
  {siteName: "爱收藏",
      url: /^https?:\/\/www\.aishoucang\.com\/\w+\/\d+\.html/,
      titleReg: "(.*?)-(.*?)-爱收藏",
      contentSelector: "#zhutone",
      contentReplace: {
          "<a[^>]*>(.*?)</a>": "$1",
          ".爱收藏[^<]*": ""
      }
  },
  {siteName: "木鱼哥",
      url: /^https?:\/\/(www\.)?muyuge\.(com|net)\/\w+\/\d+\.html/,
      titleSelector: "#yueduye h1",
      bookTitleSelector: ".readerNav > li > a:last",
      indexSelector: ".readerFooterPage a[title='(快捷:回车键)']",
      // useiframe: true,
      // mutationSelector: "#content",
      // mutationChildCount: 1,
      nextSelector: 'a:contains(下章)',
      prevSelector: 'a:contains(上章)',
      indexSelector: 'a:contains(目录)',
      contentRemove: ".vote",
      contentReplace: {
          "<a[^>]*>(.*?)</a>": "$1",
          "看更新最快的小说就搜索—— 木鱼哥——无弹窗，全文字": "",
          "【看最新小说就搜索.*全文字首发】": "",
          "<p>.*?无弹窗</p>":"",
          "bb\\.king|【木&nbsp;鱼&nbsp;哥&nbsp;.*?】|【一秒钟记住本站：muyuge.com.*木鱼哥】":"",
          "——推荐阅读——[\\s\\S]+": "",
          "【\\s*木\\s*鱼\\s*哥.*?】":"",
          "div&gt;|&lt;－》": "",
          "\\(.pn. 平南\\)": "",
      },
      startFilter: function() {
          clearInterval(unsafeWindow.show);
      }
  },
  {siteName: "追书网",
      url: "^https?://www\\.zhuishu\\.net/files/article/html/.*\\.html",
      titleReg: /(?:正文 )?(.*) (\S+) \S+ - .*/,
      titlePos: 1,
      indexSelector: ".pagebottom>a:contains('目录')",
      nextSelector: ".pagebottom>a:contains('下一页')",
      prevSelector: ".pagebottom>a:contains('上一页')",
      fixImage: true,
      contentSelector: "#content",
      contentReplace: {
          "([^/])www\\.ZhuisHu\\.net": "$1",
      },
      contentPatch: function(fakeStub){
          fakeStub.find("#content > .title, #content > .pagebottom").appendTo(fakeStub.find("body"));

          fakeStub.find("#content").find("center, b:contains('最快更新')").remove();
      }
  },
  {siteName: "猪猪岛小说",
      url: "^https?://www\\.zhuzhudao\\.(?:com|cc)/txt/",
      titleReg: "(.*?)最新章节-(.*?)-",
      contentReplace: /[“"”]?猪猪岛小说.*|<\/?a[^>]+>|w+\.zhuZhuDao\.com|看更新最快的.*/ig
  },
  {siteName: "逸名文学屋",
      url: "^https?://(bbs\\.vyming|www\\.9imw)\\.com/novel-read-\\d+-\\d+\\.html",
      contentSelector: "#showcontent",
      bookTitleSelector: ".headinfo a:first",
      contentRemove: "p:contains(精品推荐：), p:contains(，免费小说阅读基地！), a",
      contentReplace: [
          "逸名文学屋："
      ]
  },
  {siteName: "奇书屋",
      url: "^https?://www.qishuwu.com/\\w+/\\d+/",
      titleReg: "(.*)_(.*)_.*_奇书屋",
  },
  {siteName: "看下文学",
      url: "^https?://www\\.kanxia\\.net/k/\\d*/\\d+/\\d+\\.html$",
      titleReg: /(.*?)-(.*)TXT下载_看下文学/,
      contentReplace: /看下文学/g
  },
  {siteName: "青帝文学网",
      url: /^https?:\/\/www\.qingdi\.com\/files\/article\/html\/\d+\/\d+\/\d+\.html$/,
      titleReg: /(.*?)最新章节_(.*?)_青帝文学网_.*/
  },
  {siteName: "动力中文",
      url: "^https?://dlzw\\.cc/article.*\\.html",
      nextSelector: "span:contains('下一篇') > a",
      prevSelector: "span:contains('上一篇') > a",
      indexSelector: "#pt a[href^='http']"
  },
  {siteName: "第一中文",
      url: "^https?://www\\.dyzww\\.com/cn/\\d+/\\d+/\\d+\\.html$" ,
      contentReplace: {
          '<img.*?ait="(.*?)".*?>': "$1",
          'www\\.dyzww\\.com.*|♂|шШщ.*': ""
      }
  },
  {siteName: "来书屋",
      url: "^https?://www.laishuwu.com/html/\\d+/\\d+/\\d+.html",
      titleSelector: ".chaptertitle h2",
      bookTitleSelector: ".chaptertitle h1",
      contentReplace: "txt\\d+/",
  },
  {siteName: "万书吧",
      url: "^https?://www\\.wanshuba\\.com/Html/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*?),(.*?)-万书吧",
      titlePos: 1,
      contentSelector: ".yd_text2",
      contentReplace: [
          "\\[www.*?\\]",
          "\\(&nbsp;&nbsp;\\)",
          "提供无弹窗全文字在线阅读，更新速度更快文章质量更好，如果您觉得不错就多多分享本站!谢谢各位读者的支持!",
          "高速首发.*?，本章节是.*?地址为如果你觉的本章节还不错的话请不要忘记向您qq群和微博里的朋友推荐哦！"
      ]
  },
  {siteName: "大文学",
      url: "^https?://www\\.dawenxue\\.net/html/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*?)-(.*)-大文学",
      contentSelector: "#clickeye_content",
      contentReplace: "\\(?大文学\\s*www\\.dawenxue\\.net\\)?|\\(\\)",
  },
  {siteName: "奇热",
      url: "^https?://www\\.qirexs\\.com/read-\\d+-chapter-\\d+\\.html",
      titleReg: "(.*?)-(.*?)-",
      titlePos: 1,
      contentSelector: "div.page-content .note",
      contentRemove: "a",
      contentReplace: "”奇热小说小说“更新最快|首发,/.奇热小说网阅读网!|奇热小说网提供.*|\\(手机用户请直接访问.*"
  },
  {siteName: "热点",
      url: "^https?://www\\.hotsk\\.com/Html/Book/\\d+/\\d+/\\d+\\.shtml",
      titleReg: "(.*?) 正文 (.*?)- 热点书库 -",
      contentReplace: "\\(热点书库首发:www.hotsk.com\\)|www.zhuZhuDao.com .猪猪岛小说."
  },
  {siteName: "落秋中文",
      url: "^https?://www\\.luoqiu\\.(com|net)/html/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*?)-(.*?)-",
      contentReplace: "&lt;/p&gt;"
  },
  {siteName: "全本小说网",
      url: "^https?://www\\.qb5\\.com/xiaoshuo/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*)_(.*)_",
      contentRemove: "div[class]",
      contentReplace: "全.{0,2}本.{0,2}小.{0,2}说.{0,2}网.{0,2}|[ｗWw ]+.{1,10}[CｃcǒOｍMМ ]+",
  },
  {siteName: "手牵手小说网",
      url: "^https?://www\\.sqsxs\\.com/.*\\d+/\\d+/\\d+\\.html",
      bookTitleSelector: '#sitebar a:last',
      contentReplace: [
          "◆免费◆",
          "★百度搜索，免费阅读万本★|访问下载txt小说.百度搜.|免费电子书下载|\\(百度搜\\)|『文學吧x吧.』|¤本站网址：¤",
          "[☆★◆〓『【◎◇].*?(?:yunlaige|云 来 阁|ｙｕｎｌａｉｇｅ|免费看).*?[☆◆★〓』】◎◇]",
          "【手机小说阅读&nbsp;m.】",
          "BAIDU_CLB_fillSlot.*",
          "&nbsp;关闭</p>",
          "&nbsp;&nbsp;&nbsp;&nbsp;\\?",
          "\\[☆更.新.最.快☆无.弹.窗☆全.免.费\\]",
          '\\(.*?平南文学网\\)',
          '｛首发｝|【首发】',
          '=长=风',
          '-优－优－小－说－更－新－最－快-\\.',
          '发现一家非常好吃的手工曲奇店铺，可搜索淘宝.*',
          '强烈推荐一家手工曲奇店，在淘宝搜索.*',
          { "。\\.": "。" },
      ]
  },
  {siteName: "六月中文网，盗梦人小说网",
      url: "^https?://www\\.(?:6yzw\\.org|6yzw\\.com|daomengren\\.com)/.*\\.html",
      bookTitleSelector: ".con_top>a:last",
      contentRemove: "a[href]",
      contentReplace: [
          "纯文字在线阅读本站域名 520xs.Com 手机同步阅读请访问 M.520xs.Com",
          "{飘天文学[\\s\\S]*您的支持就是我们最大的动力}",
          "(（未完待续），|精彩推荐：，)?最新最快更新热门小说，享受无弹窗阅读就在：",
          "一秒记住【】，本站为您提供热门小说免费阅读。",
          "百度搜索 本书名.*",
          "欢迎您的光临，任何搜索引擎搜索.*给大家带来的不便深感抱歉!！",
          "\\(?&nbsp;&nbsp; ?提供』。如果您喜欢这部作品，欢迎您来创世中文网[\\s\\S]+",
          "[\\(（]未完待续.{1,2}本文字由.*",
          "//添加开头|会员特权抢先体验",
          "更新最快|更新快纯文字|看最新章节|六月中文网|78小说|h﹒c﹒d|穿越小说吧 sj131|\\*五月中文网5.c om\\*",
          "\\d楼[\\d\\-: ]+(?:&nbsp;)+ \\|(?:&nbsp;)+|吧主\\d+(?:&nbsp;)+|支持威武，嘎嘎！",
          "www，|&nbsp;\\\\|“梦”(&nbsp;| )*“小”(&nbsp;| )*(“说” )?“网”|“岛”(&nbsp;| )+“说”",
          /(百度搜索 )?本书名 \+ 盗梦人 看最快更新/ig,
          "520xs.com ”520小说“小说章节更新最快",
          "看最新最全小说|最快更新，(?:无弹窗)?阅读请。",
          "纯文字在线阅读本站域名  手机同步阅读请访问",
          "本文由　……　首发",
          "（首发）|【首发】",
          "&amp;nbsp",
      ]
  },
//   {siteName: "飞卢小说网",
//       url: "^https?://b\\.faloo\\.com/p/\\d+/\\d+\\.html",
//       titleSelector: "#title h1",
//       bookTitleSelector: "div.nav > a:last",
//       bookTitleReplace: '小说$',

//       nextSelector: "a#next_page",
//       prevSelector: "a#pre_page",
//       indexSelector: "a#huimulu",

//       contentSelector: "#main > .main0",
//       contentRemove: "> *:not(#con_imginfo, #content), .p_content_bottom",
//       contentReplace: [
//           "飞卢小说网 b.faloo.com 欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在飞卢小说网！",
//       ],
//       contentPatch: function(fakeStub){
//           fakeStub.find("#content").find(".p_gonggao").remove();
//           // fakeStub.find("#con_imginfo").prependTo("#content");
//       }
//   },
  {siteName: '笔下阁',
      url: "^https?://www\\.bixiage\\.com/\\w+/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*)最新章节免费在线阅读_(.*)_笔下阁",
      indexSelector: ".read_tools a:contains('返回目录')",
      prevSelector: ".read_tools a:contains('上一页')",
      nextSelector: ".read_tools a:contains('下一页')",
      contentReplace: [
          "本书最新免费章节请访问|请记住本站的网址|请使用访问本站",
          "看更新最快的.*www.bixiage.com",
          "笔下阁为您提供全文字小说.*",
          "如果你觉得笔下阁不错.*",
          "本篇是小说.*章节内容，如果你发现内容错误.*"
      ]
  },
  {siteName: '双德小说网',
      url: "^https?://www\\.shuangde\\.cc/.*\\.html",
      bookTitleSelector: '.title > h2 > a',
      contentRemove: '.title, div[align="center"]',
  },
  {siteName: '爱尚小说网',
      url: '^https?://www.a240.com/read/\\d+/\\d+.html',
      titleReg: '(.*) - (.*?) - 爱尚小说网',
      titlePos: 1,
      contentRemove: '.bottem, center',
      contentReplace: '<!--章节内容开始-->'
  },
  {siteName: 'Ｅ度文学网',
      url: '^https?://www.173ed.com/read/\\d+/\\d+.html',
      contentRemove: 'a[href*="173e"]',
      contentReplace: [
          '全文字小说W.*?\\.com',
          'E度文学网更新最快',
          'www\\.♀173ed.com♀'
      ]
  },
  {siteName: "比奇中文网",
      url: "^https?://www\\.biqi\\.me/files/article/html/\\d+/\\d+/\\d+\\.html",
      titleSelector: "#lbChapterName",
      bookTitleSelector: "#TOPNAV td:first > a:last",
      contentReplace: [
          "http://www.biqi.me比奇中文网永久网址，请牢记！",
          "www.biqi.me比奇中文网一直在为提高阅读体验而努力，喜欢请与好友分享！",
          "[｛【]比奇中文网首发www.biqi.me[｝】]",
      ]
  },
  {siteName: "杂书网",
      url: "^https?://www\\.zashu\\.net/books/\\d+/\\d+/\\d+\\.html",
      contentReplace: [
          "吋煜牝咱.*?杂书网(?:杠杠的)?",
          "吋煜牝咱看书神器",
          "(?:吋煜牝咱|飝现洅咱|茇阺畱匝).*?[Ｃc]om",
          "吋煜牝咱",
          "飝现洅咱", "殢萾嘎匝",
          "看小说“杂书网zashu.net”",
          "手机站：m.zashu.net 电脑站：www.zashu.net",
      ]
  },
  {siteName: "123言情",
      url: '^https?://www\\.123yq\\.(com|org)/read/\\d+/\\d+/\\d+\\.shtml',
      bookTitleSelector: '.con_top > a:last',
      contentSelector: "#TXT",
      contentRemove: '.bottem, .red, .contads, a',
  },
  {siteName: "落霞小说",
      url: '^https://www\\.luoxia\\.com/hch/\\d+\\.htm',
      bookTitleSelector: '#bcrumb a[rel="category tag"]',
      contentSelector: "#nr1",
      contentReplace: [
          '-落[-~\\*]霞-小-说w ww ^ lu ox i a^ c o m. 🍌',
          '🌽 落~霞~小~说~w w w - l u ox i a - co m',
          '🍋 落*霞*小*说ww w_L uo x ia_c o m _',
          '🌵 落+霞-小+說 L U ox i a - c o m +',
          '🐕 落·霞*小·说· L u ox i a · c om',
      ]
  },
  {siteName: "联合阅读",
    url: "https?://xrzww\\.com/module/novel/read.php*",
    titleSelector: "#content h2",
    bookTitleSelector: '.title-wrap .percent',
    contentSelector: "#content #contentInner",
  },
  {siteName: '完本神站',
    url: '^https?://www\\.wanbentxt\\.com/\\d+/.*?\\.html',
    bookTitleSelector: '.search > a > span',
    contentSelector: ".readerCon",
    checkSection: true,
    contentReplace: [
        '--&gt;&gt;本章未完，点击下一页继续阅读',
        '提示：浏览器搜索（书名）.*?可以快速找到你在本站看的书！',
    ]
  },
  {siteName: '九桃小说网',
    url: '^https?://www\\.9txs\\.com/book/\\d+/\\d+\\.html',
    bookTitleSelector: '#bookname',
    contentReplace: [
        '您可以在百度里搜索“.*?九桃小说\\(9txs.com\\)”查找最新章节！',
    ]
  },
  {siteName: '闪舞小说网',
    url: '^https://www\\.35xs\\.co/book/\\d+/\\d+\\.html',
    bookTitleSelector: '.bookNav > a:last',
    contentReplace: [
        '小说网..org，最快更新.*?最新章节！',
        '闪舞小说网',
        'www\\.35xss\\.com',
        'www\\.35xs\\.co',
    ]
  },
  {siteName: '卡夜阁',
    url: 'https://www\\.kayege\\.com/book/\\d+/\\d+(?:_\\d+)?\\.html',
    bookTitleSelector: '.box-head h2',
    contentSelector: '#read',
    checkSection: true,
    contentReplace: [
        '--&gt;&gt;\\(第1/2页\\)，请点击下一页继续阅读。',
    ]
  },
  {siteName: "151看书网",
      url: "^https?://www\\.151kan\\.com/kan/.*\\.html",
      contentSelector: "#msg",
      useiframe: true,
      mutationSelector: "#msg",
      contentReplace: [
          /[\/|]?www\.151(?:看|kan)\.com[\/|]?/ig,
          /151看书网(?:纯文字)?/ig,
      ]
  },
  {siteName: "就爱读书",
      url: "^https?://www\\.92to\\.com/\\w+/\\w+/\\d+\\.html$",
      titleReg: "(.*?)-(.*?)-",
      useiframe: true,
      timeout: 500,
      contentReplace: "看小说.就爱.*"
  },
  {siteName: "书书网",
      url: "^https?://www\\.shushuw\\.cn/shu/\\d+/\\d+\\.html",
      titleReg: "(.*) (.*?) 书书网",
      titlePos: 1,
      useiframe: true,
      timeout: 500,
      contentReplace: "！~！[\\s\\S]*"
  },
  {siteName: "找小说网",
      url: "^https?://www\\.zhaoxiaoshuo\\.com/chapter-\\d+-\\d+-\\w+/",
      titleReg: "(.*) - (.*) - 找小说网",
      titlePos: 1,
      useiframe: true,
          timeout: 500,
      contentRemove: "div[style]"
  },
  {siteName: "ABC小说网",
      url: "^https?://www\\.bookabc\\.net/.*\\.html",
      useiframe: true
  },
  {siteName: '斋书苑 | 次元猫',
    exampleUrl: 'https://www.zhaishuyuan.com/chapter/30754/19407713',
    // 或 https://www.ciymao.com/chapter/13140060/18070236.html
    url: '^https?://www\\.(?:zhaishuyuan|ciymao)\\.com/chapter/\\d+/\\d+',
    useiframe: true,
    startFilter: function() {
        unsafeWindow.getDecode();
    }

  },
  {siteName: "哈哈文学",
      url: /^https?:\/\/www\.hahawx\.com\/.*htm/,
      titleReg: /(.*?)-(.*?)-.*/,
      contentSelector: "#chapter_content",
      contentReplace: /(?:好书推荐|书友在看|其他书友正在看|好看的小说|推荐阅读)：。|(?:www|ｗｗｗ|ｂｏｏｋ).*(?:com|net|org|ｃｏｍ|ｎｅｔ)|全文字阅读|无弹窗广告小说网|哈哈文学\(www.hahawx.com\)|souDU.org|Ｓｏｕｄｕ．ｏｒｇ|jīng彩推荐：/ig,
      contentPatch: function(fakeStub){
          var $content = fakeStub.find("#chapter_content");
          var m = $content.find("script").text().match(/output\((\d+), "(\d+\.txt)"\);/);
          if(m && m.length == 3){
              var aid = m[1],
                  files = m[2];
              var subDir = "/" + (Math.floor(aid / 1000) + 1),
                  subDir2 = "/" + (aid - Math.floor(aid / 1000) * 1000);
              $content.attr({
                  class: "reader-ajax",
                  src: "http://r.xsjob.net/novel" + subDir + subDir2 + "/" + files,
                  charset: "gbk"
              });
          }
      }
  },
  {siteName: "好看小說網",
      url: "^https?://tw\\.xiaoshuokan\\.com/haokan/\\d+/\\d+\\.html",
      contentSelector: ".bookcontent",
      prevSelector: "a.redbutt:contains('上一頁')",
      indexSelector: "a.redbutt:contains('返回章節目錄')",
      nextSelector: "a.redbutt:contains('下一頁')",
      contentReplace: "[a-z;&]*w.[xｘ]iaoshuokan.com 好看小說網[a-z;&族】）]*"
  },
  {siteName: "天使小说网",
      url: "^https?://www\\.tsxs\\.cc/files/article/html/\\d+/\\d+/\\d+\\.html",
      contentSelector: "#content"
  },
  {siteName: "紫雨阁小说网",
      url: "^https?://www\\.ziyuge\\.com/\\w+/\\w+/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*?)-正文-(.*?)-紫雨阁小说网",
      contentSelector: ".reader_content",
      nextSelector: "#divNext a",
      prevSelector: "#divPrev a",
      contentReplace: "\\(.*www.ziyuge.com.*\\)"
  },
  {siteName: "破风中文网",
      url: "^https?://www\\.pofeng\\.net/xiaoshuo/\\d+/\\d+\\.html",
      useiframe: true
  },
  {siteName: "读客吧",
      url: "^https?://dukeba\\.com/book/\\d+/\\d+/\\d+\\.shtml",
      useiframe: true,
      contentSelector: "#content > div[style]",
      contentRemove: "a, div[align]:has(font)",
  },
  {siteName: "六九中文",
      url: "^https?://www.(?:69zw|kan7).com/\\w+/\\d+/\\d+/\\d+.html",
      titleSelector: ".chapter_title",
      bookTitleSelector: ".readhead h1",
      contentSelector: ".yd_text2",
      // titleReg: "(.*)?_(.*)-六九中文",
      contentReplace: [
          "[\\*]+本章节来源六九中文.*请到六九中文阅读最新章节[\\*]+|－\\\\[wＷ]+.*书友上传/－",
          "\\\\请到 www.69zw.com 六\\*九.*?/",
          "【 注册会员可获私人书架，看书更方便！：】",
          "首发<br />",
      ]
  },
  {siteName: "免费小说阅读网",
      titleReg: "(.*) , (.*) , 免费小说阅读网",
      titlePos: 1,
      url: "^https?://book\\.yayacms\\.com/\\w+/book_\\d+_\\d+.html",
      contentRemove: "a, div[style]",
      contentReplace: "http://book.YaYaCMS.com/.*|ｂｏｏｋ．ｙａｙａｃｍｓ．ｃｏｍ",
  },
  {siteName: "书农在线书库",
      url: "^https?://www\\.shunong\\.com/yuedu/\\d+/\\d+/\\d+.html",
      contentSelector: ".bookcontent",
  },
  {siteName: "言情后花园",
      url: "^https?://www\\.yqhhy\\.cc/\\d+/\\d+/\\d+\\.html",
      titleReg: "(.*)-(.*)-.*-言情后花园",
      titlePos: 1,
      contentSelector: "#content",
      contentRemove: "a, span[style], script",
      contentReplace: "请记住本站： www.yqhhy.cc|更多，尽在言情后花园。"
  },
  {siteName: "五月中文网",
      url: "^https?://5ycn\\.com/\\d+/\\d+/\\d+\\.html",
      contentRemove: "div[align='center'], a",
  },
  {siteName: "笔下中文",
      url: "^https?://www\\.bxzw\\.org/\\w+/\\d+/\\d+/\\d+\\.shtml",
      contentRemove: "div[align='center'], center, #footlink1",
      contentReplace: "www\\.bxzw\\.org|//无弹窗更新快//|\\(看精品小说请上.*\\)|\\(看.*最新更新章节.*\\)"
  },
  {siteName: "着笔中文网",
      url: "^https?://.*zbzw\\.com/\\w+/\\d+\\.html",
      contentReplace: "精彩小说尽在.*"
  },
  {siteName: "D586小说网",
      url: '^https?://www\\.d586\\.com/',
      contentSelector: ".yd_text2",
      contentRemove: 'a',
      contentReplace: [
          '【www.13800100.com文字首发D5８6小说网】',
          '【☆D5８6小说网☆//文字首发】.*'
      ]
  },
  {siteName: "豌豆文学网",
      url: "^https?://www.wandoou.com/book/\\d+/\\d+\\.html",
      titleReg: '(.*?)最新章节-(.*)-.*无弹窗广告_豌豆文学网',
      contentRemove: "center",
      contentReplace: [
          /[{（]<a href.*[}）]|网欢迎广大书友光临阅读，.*/ig,
          /[レ★]+.*(?:请支持)?豌(?:.|&amp;)?豆.?文.?学.*[レ★]+/ig,
          /[（(【]豌.?豆.?文.?学.*[）)】]/ig,
          /∷更新快∷∷纯文字∷|http:永久网址，请牢记！/ig,
          /(?:{|\\|\/|\()*豌.?豆.?文.?学.?网.*?(?:高速更新|\\\/|})+/ig,
          /更新最快最稳定|看小说“”/ig,
          /&lt;strng&gt;.*?&lt;\/strng&gt;/ig,
          /\(凤舞文学网\)|\( *\)|「启航文字」|79阅.读.网/ig,
          /高速首发.*?本章节是.*/ig,
          /百度搜索自从知道用百度搜索，妈妈再也不用担心我追不到最快更新了/ig,
      ]
  },
  {siteName: "小说TXT",
      url: /^https?:\/\/www\.xshuotxt\.com\//,
      contentReplace: "\\(.*无弹窗全文阅读\\)",
      contentPatch: function(fakeStub) {
          fakeStub.find('#title a').remove();
      }
  },
  {siteName: "吾读小说网",
      url: "^https?://www\\.5du5\\.com/book/.*\\.html",
      contentReplace: '\\(吾读小说网 <a.*无弹窗全文阅读\\)'
  },
  {siteName: "长风文学网",
      url: "^https?://www\\.cfwx\\.net/files/article/html/\\d+/\\d+/\\d+\\.html",
      titleSelector: '.title',
      bookTitleSelector: '.linkleft > a:last',
      contentReplace: [
          '([^\\u4E00-\\u9FFF]+)长\\1风\\1文\\1学[^\\n]+t',
      ]
  },
  {siteName: "云来阁",
      url: "^https?://www\\.yunlaige\\.com/html/\\d+/\\d+/\\d+\\.html",
      titleSelector: '.ctitle',
      bookTitleSelector: '#hlBookName',
      contentSelector: '#content',
      contentRemove: '.bottomlink, a, .cad, .footer, .adbottom',
      contentReplace: [
          '[☆★◆〓『【◎◇].*?(?:yunlaige|云 来 阁|ｙｕｎｌａｉｇｅ).*?[☆◆★〓』】◎◇]',
          '《更新最快小说网站：雲来阁http://WWW.YunLaiGe.COM》',
          '【當你閱讀到此章節，請您移步到雲來閣閱讀最新章節，或者，雲來閣】',
          '【看恐怖小说、玄幻小说、请大家登陆黑岩居http://www.heiyanju.com万本小说免费看】',
          '【本书作者推荐：(?:百度搜索)?云来閣，免费观看本书最快的VIP章节】',
          '搜索引擎搜索关键词\\s*云.来.阁，各种小说任你观看，破防盗章节',
          '搜索关键词 云.来.阁，各种小说任你观看，破防盗章节',
          '◢百度搜索雲来阁，最新最快的小说更新◣',
          '\\(云来阁小说文学网www.yunlaige.com\\)',
          '如您已阅读到此章节，请移步到.*',
          '《想看本书最新章节的书友们，百度搜索一下.*',
          '===百!?度搜索.*?新章节===',
          '【最新更新】',
          '值得您收藏。。',
          '小说“小说章节',
          '纯文字在线阅读本站域名',
          '手机同步阅读请访问',
          '±顶±点±小±说，ww',
          '■dingddian小说，ww∨23w→■m',
          'w∨23w',
          'ｗwｗ23ｗｘｃｏｍ',
          '￥℉頂￥℉点￥℉小￥℉',
          '￡∝頂￡∝点￡∝小￡∝',
          '篮。色。书。巴,',
          '<!--\\?[\\(<]',   // 提取内容后出现的注释标志，造成后面的内容没了
          '看书&nbsp;&nbsp; 要?',
          '喜欢网就上。',
          '无弹窗小说，.*',
          '本书最快更新网站请：.*',
          'V<!--\\?',
          '【云来阁】小说网站，让你体验更新最新最快的章节小说，所有小说秒更新。',
      ]
  },
  {siteName: "乐文小说网",
      url: /^https?:\/\/(www|m)\.lwxs520\.com\/books\/\d+\/\d+\/\d+.html/,
      siteExample: 'http://www.lwxs520.com/books/2/2329/473426.html',
      bookTitleSelector: 'h2',
      chapterTitleReplace: 'WwW.lwxs520.Com|乐文小说网',

      contentRemove: '#content>:not(p)',
      contentReplace: [
          '看小说到乐文小说网www.lwxs520.com',
          '喜欢乐文小说网就上www.*(?:ＣＯＭ|com)',
          '爱玩爱看就来乐文小说网.*',
          '\\(LＷXＳ５２０。\\)',
          'Ｍ.LＷxＳ520.com&nbsp;乐文移动网',
          /乐文小说网值得.+/g,
          '乐\\+文\\+小说&nbsp;Ｗww.しwＸs520.Ｃom',
          '乐文\s*小说 www.lwxs520.com',
          '&乐&文&小说 \\{www\\}.\\{lw\\}\\{xs520\\}.\\{com\\}',
          '<乐-文>小说www.しＷＸS520.com',
          '-乐-文-小-说-www-lwxs520-com',
          '？乐？文？小说 wwＷ.lＷＸs520. ＣＯＭ',
          ';乐;文;小说 www.lw＋xs520.com',
          '小说&nbsp;wＷw.Lwxs520.cＯm',
          'www.LＷＸＳ５２０.com',
          'www.lwxs520.com 首发哦亲',
          '[wＷｗ]+.[lし]w[xχＸ][sS]520.[cｃ][oｏＯ][mＭ]',
          'lwxs520.com\\|?',
          '[しlL][ωＷw][χＸXx][ｓsS]520',
          /\(未完待续.+/g,
          '\\P?[樂乐]\\P文\\P小\\P?说',
          '》乐>文》小说',
          '乐+文+小说',
          '《乐<文《小说',
          '樂文小說',
          ':乐:文:小说',
          '`乐`文`小说`',
          '=乐=文=小说',
          '＠樂＠文＠小＠说|',
          ';乐;文;小说',
          '︾樂︾文︾小︾说\\|',
          '｀乐｀文｀小说｀',
          '@乐@文@小说',
          'lw＋xs520',
          '♂！',
          '3w.',
          '\\(\\)',
      ]
  },
  {siteName: '我爱小说',
      url: '^https?://www\\.woaixiaoshuo\\.com/xiaoshuo/\\d+/\\d+/\\d+\\.html',
      bookTitleSelector: '#lbox > b',
      contentSelector: '#readbox',
      contentRemove: '#papgbutton, #content',
  },
  {siteName: "58小说网",
      url: /^https?:\/\/(www|book)\.(58)?58xs\.com\/html\/\d+\/\d+\/\d+\.html/,
      titleSelector: "h1",
      indexSelector: "#footlink > a:eq(1)",
      prevSelector: "#footlink > a:eq(0)",
      nextSelector: "#footlink > a:eq(2)",
      contentSelector: "#content",
      contentRemove: ".f1, .c1"
  },
  {siteName: "米花在线书库",
      url: /book\.mihua\.net\/\w+\/\d+\/\d+\/.+\.html/,
      titleSelector: "#title",
      contentSelector: "#viewbook"
  },
  {siteName: "天天美文网",
      url: /www\.365essay\.com\/\w+\/.+.htm/,
      titleSelector: ".title > h1",
      contentSelector: "#zoomc td",
      contentRemove: ".page-bottomc"
  },
  {siteName: "梦远书城",
      url: /www\.my285\.com(?:\/\w+){3,5}\/\d+\.htm$/,
      useiframe: true,
      contentSelector: "table:eq(2) tr:eq(3)",
  },
  {siteName: "乐文小说网",
      url: "^https?://www\\.365xs\\.org/books/\\d+/\\d+/\\d+\\.html",
      titleSelector: ".kfyd h1",
      bookTitleSelector: "ul.bread-crumbs a:last",
      contentSelector: "#content",
      // contentReplace: []
  },
  {siteName: "舞若小说网",
      url: "^https?://www\\.wuruo\\.com/files/article/html/\\d+/\\d+/\\d+\\.html",
      bookTitleSelector: ".text a:eq(1)",
      contentSelector: "#zhengwen",
      contentReplace: [
          '【更多精彩小说请访问www.wuruo.com】',
          '（www.wuruo.com舞若小说网首发）',
          '【舞若小说网首发】',
      ]
  },
  {siteName: "大书包小说网",
      url: "^https?://www\\.dashubao\\.com?/book/\\d+/\\d+/\\d+\\.html",
      bookTitleSelector: ".read_t > .lf > a:nth-child(3)",
      contentSelector: ".yd_text2",
      contentReplace: [
      ]
  },
  {siteName: "爬书网",
      url: "^https?://www\\.pashuw\\.com/BookReader/\\d+-\\d+/\\d+\\.html",
      bookTitleSelector: "#paihangbang_select > a:last()",
      nextSelector: "#next2 a",
      prevSelector: "#prev2 a",
      indexSelector: "#fhml2 a",
      contentRemove: '.novel_bot',
  },
  {siteName: "品书网",
      url: "^https?://www\\.vodtw\\.com/Html/Book/\\d+/\\d+/\\d+\\.html",
      bookTitleSelector: '.srcbox > a:last()',
      contentRemove: 'a',
      contentReplace: [
          '品书网 www.voDtw.com◇↓',
          '品书网 www.vodtW.com',
          '品 书 网 （w W W  . V o Dtw . c o M）',
          '复制网址访问\\s*http://[%\\d\\w]+'
      ]
  },
  {siteName: "凤凰小说网",
      url: "^https?://www\\.fhxs\\.com/read/\\d+/\\d+/\\d+\\.shtml",
      bookTitleSelector: '.con_top > a:last()',
      contentRemove: '.bottem',
      contentReplace: [
      ]
  },
  {siteName: "小说巴士",
      url: "^https?://www\\.xsbashi\\.com/\\d+_\\d+/",
      contentReplace: [
          '全文阅读如您已阅读到此章[節节].*?，，，，',
          '看小说首发推荐去眼快看书',
          '最快更新，阅读请。___小/说/巴/士 Www.XSBASHI.coM___',
          '___小/说/巴/士 www.XSBASHI.com___',
          'lala如您已阅读到此章節，請移步到.*?速记方法：，\\]',
          'lala如您已阅读到此章節.*?敬請記住我們新的網址筆-趣-閣',
          '起舞电子书访问:. 。',
          '≧哈，m\\.',
          '\\[\\s*超多好看\\]',
          '热门【首发】',
          '===百度搜索.*?===',
          '===\\*\\*小说巴士.*?===',
      ]
  },
  {siteName: "思兔阅读",
      url: "^https?://\\w+\\.sto\\.cc/book-\\d+-\\d+.html",
      titleReg: "(.*?)_(.*?)_全文在線閱讀_思兔",
      titlePos: 0,
      //bookTitleSelector: "h1",
      prevSelector: "a:contains('上壹頁'), a:contains('上壹页')",
      nextSelector: "a:contains('下壹頁'), a:contains('下壹页')",
      contentSelector: "div#BookContent",
      contentRemove: 'span',
  },
  {siteName: "33言情",
      url: "^https?://www\\.33yq\\.com/read/\\d+/\\d+/\\d+\\.shtml",
      contentRemove: 'a, .bottem, .red',
  },
  {siteName: "巫师图书馆.",
      url: "^https?://www\\.54tushu\\.com/book_library/chaptershow/theId/\\d+\\.html",
      bookTitleSelector: "#m-book-title",
      titleSelector: "div.title",
      prevSelector: "div.pageInfo a:first",
      nextSelector: "div.pageInfo a:last",
      indexSelector: "a[title='返回书页']",
      useiframe: true,
      timeout: 1000,
      contentSelector: "div#ChapterContent",
      contentPatch: function(fakeStub){
        var bookTitle = fakeStub.find('meta[name="keywords"]').attr('content');
        fakeStub.find('body').append('<div id="m-book-title">' + bookTitle + '</div>');
      }
  },
  {siteName: '御宅屋',
    url: '^https?://m\\.yushuwu\\.com/novel/\\d+/\\d+\\.html',
    contentSelector: '#nr',
  },
  {siteName: '随便看看吧',
    url: '^https?://www\\.sbkk88\\.com/.*?/.*?/.*?\\.html',
    bookTitleSelector: '.f_place1 > a:last()',
    nextSelector: 'a.nextPage',
    prevSelector: 'a.prevPage',

    contentSelector: '#f_article',
    contentRemove: '.mingzhuPage',
  },
  {siteName: '新笔趣阁',
    url: '^https?://www\\.3xs\\.cc/\\w+/\\w+\\.html',
    bookTitleSelector: '.info a',
    contentSelector: '.box_box',
  },
  {siteName: "书阁网",
      url: "^https?://www\\.bookgew\\.com/Html/Book/\\d+/\\d+/\\d+\\.htm",
      titleReg: "(.*)-(.*?)-书阁网",
      titlePos: 1,
      // titleSelector: ".newstitle",
      nextUrl: function($doc){
          var html = $doc.find('script:contains(nextpage=)').html();
          var m = html.match(/nextpage="(.*?)";/);
          if (m) return m[1];
      },
      prevUrl: function($doc) {
          var html = $doc.find('script:contains(prevpage=)').html();
          var m = html.match(/prevpage="(.*?)";/);
          if (m) return m[1];
      }
  },
  // {siteName: "雅文言情小说吧",  // 一章分段
  //     url: "^https?://www\\.yawen8\\.com/\\w+/\\d+/\\d+\\.html",
  //     contentSelector: "#content .txtc"
  // }

  {siteName:'妙笔阁',
  url: /^https?:\/\/www\.miaobige\.com\/.*\.html|^https?:\/\/www.(?:52dsm|banfusheng).com\/chapter\/\d+\/\d+.html/i,
  siteExample:'http://www.miaobige.com/book/5_1586/1006320.html',
      // 有的会提示防采集章节
      fInit: function () {
          $('<script>')
              .text('$(document).unbind("contextmenu selectstart")')
              .appendTo(document.body);
      },

      useiframe: true,
      mutationSelector: '#content',
      mutationChildCount: 1,
      startLaunch: function($doc){
          var $content = $doc.find('#content');

          if ($content.text().match(/妙笔阁防盗模式：|小说阅读模式：/)) {
              // 清空不完全的内容节点，通过 mutationSelector 等待内容 完全加载
              $content.html('');
          }
      },
      contentReplace: '妙笔阁，无弹窗，更新快，记住www.miaobige.com',
      // contentPatch: function($doc){
      //     var $content = $doc.find('#content');
      //     var txt = $content.text();

      //     if (0 === txt.trim().indexOf('防采集章节，')) {
      //         var mNewLink = $content.html().match(/http:\/\/www\.miaobige\.com\/book\/(\d)_(\d+)\/(\d+)\.html/i);
      //         if (mNewLink) {
      //             $content .addClass(READER_AJAX)
      //                 .attr({
      //                     src: '/js/ajaxtxt.asp',
      //                     charset: 'gbk'
      //                 })
      //                 .data('post', {
      //                     sid: mNewLink[2],
      //                     zid: mNewLink[3],
      //                     cid: mNewLink[1]
      //                 })
      //                 .text('请等待加载…');
      //         }
      //     }
      // },
      // http://www.miaobige.com/read/11180/5216676.html 章节内容缺失（下面方式过于复杂，无效）
      // contentPatchAsync: function($doc, callback) {
      //     var $content = $doc.find('#content');
      //     var txt = $content.text();

      //     if (txt.indexOf('妙笔阁防盗模式：') > -1) {
      //         // 很复杂。一串看不懂的 js 生成 $.post('/ajax/content/',{sid:11180,zid:15662893,cid:3},function(data){$('#content').html(data);});
      //         var $script = $doc.find('script:contains(H=~[])');
      //         if (!$script.length) {
      //             console.error('查找 script 失败');
      //             return
      //         }

      //         // 临时劫持
      //         var $ = {
      //             post: function(url, data, mCallback) {
      //                 console.log('222222')
      //                 $content.addClass(READER_AJAX)
      //                     .attr({
      //                         src: url,
      //                         charset: 'UTF-8'
      //                     })
      //                     .data('post', data)
      //                     .text('请等待加载…');

      //                 callback()
      //             }
      //         };

      //         console.log('will eval script')
      //         debugger
      //         eval($script.text());

      //         // var funcStr = ''
      //         // var scriptFn = $script.text().trim().replace(/\(\);$/, '');
      //         // eval('funcStr = ' + scriptFn + '.toString()')
      //     } else {
      //         callback()
      //     }
      // }
},
  {siteName: "欢乐书客",
       url: "^https?://www\\.hbooker\\.com/chapter/\\d+",
       bookTitleSelector: ".breakcrumb > a:last",
       titleSelector: "#J_BookCnt h3",
       useiframe: true,
       timeout: 500,
       contentSelector: ".book-read-box .read-bd",
       contentRemove: ".book-read-box .barrage, #J_BtnGuide, .book-read-box .read-bd i.num, .chapter i, .J_Num, .num, .book-read-box .read-hd p:nth-of-type(1) span",

       indexSelector: ".book-read-page a.btn-list",
       nextUrl: function ($doc){
          return $doc.find('#J_BtnPageNext').attr('data-href');
       },
       prevUrl: function ($doc){
          return $doc.find('#J_BtnPagePrev').attr('data-href');
       },
       contentPatch: function($doc) {
          $doc.find('#J_BookCnt h3 i').remove()
       },
       isVipChapter: function($doc) {
          if ($doc.find('#realBookImage').length) {
              return true;
          }
      }
  },
  {siteName: '棉花糖小说网',
       url: '^https?://www\\.mht\\.la/\\d+/\\d+/\\d+\\.html',
       bookTitleSelector: '.nav > a:nth-of-type(3)',
       titleSelector: '.read_title h1',
       prevSelector: '.pagego a:nth-of-type(1)',
       indexSelector: '.pagego a:nth-of-type(2)',
       nextSelector: '.pagego a:nth-of-type(3)',
       contentSelector: '.content',
       contentRemove: 'a, .contads',
       contentReplace: [
           '下载本书最新的txt电子书请点击：',
           '本书手机阅读：',
           '发表书评：',
           '为了方便下次阅读，你可以在点击下方的.*谢谢您的支持！！',
           '手机用户可访问wap.mianhuatang.la观看小说，跟官网同步更新.*',
       ],
  },
  {siteName: '墨缘文学网',
      url: '^https?://www\\.moyuanwenxue\\.com/xiaoshuo/\\d+/\\d+/\\d+\\.htm',
      contentSelector: '#chapterContent',
      contentReplace: [
         {"ＺＨＡＮ":"战"},
         {"LU":"路"},
         {"ＳＨＯＵ　　ＱＩＡＮＧ":"手枪"},
         {"ｓｉ　ｗａｎｇ":"死亡"},
     ],
  },
  // 必须先用键盘箭头翻页后变成 article\reader 的url后才不会有断章现象
  {siteName: "格格党",
      url: 'http://www\\.ggdown\\.com/modules/article/reader\\.php\\?aid=.*',
      siteExample: 'http://www.ggdown.com/modules/article/reader.php?aid=41490&cid=13833393',
      indexSelector: '.link.xb a:contains("返回列表")',
      contentSelector: "#BookText",
      contentReplace: [
          '记住我们的网址噢。百度搜;格！！格！！党.或者直接输域名/g/g/d/o/w/n/./c/o/m',
      ]
  },
  {siteName: "233言情",
      url: 'http://233yq\\.com/xiaoshuo/.*/.*\\.html',
      siteExample: 'http://233yq.com/xiaoshuo/UsRA_mfLLcU/cwsM8t2ibWE.html',
      titleSelector: '.bname h1',
      bookTitleSelector: '.b21 h3:first()',
      contentSelector: ".cn",
      contentRemove: '.bottem',
  },
  {siteName: "笔趣阁",
      url: /^https?:\/\/www\.biquge\.com\.tw\/\d+_\d+\/\d+.html/,
      siteExample: 'http://www.biquge.com.tw/17_17768/8280656.html',
      contentSelector: "#content"
  },
  {siteName: "笔趣看",
    url: /^https?:\/\/www\.biqukan\.com\/\d+_\d+\/\d+.html/,
    bookTitleSelector: '.path .p > a:last',
    contentReplace: [
      'http://www.biqukan.com/.*',
      '请记住本书首发域名：www.biqukan.com.*',
    ]
  },
  {siteName: '大主宰小说网',
      url: 'www\\.daizhuzai\\.com/\\d+/\\d+\\.html',
      bookTitleSelector: '.readbox article .info span:nth-of-type(1) a',
      titleSelector: '.readbox article .title h1 a',
      prevSelector: '.readbox .operate li:nth-of-type(1) a',
      indexSelector: '.readbox .operate li:nth-of-type(2) a',
      nextSelector: '.readbox .operate li:nth-of-type(3) a',
      useiframe: true,
      mutationSelector: "#chaptercontent",
      mutationChildCount: 2,
      timeout: 500,
      contentSelector: '.readbox article .content',
      contentRemove: '',
      contentReplace: [
          { '。&': '。' },
          '△番茄小說○網☆',
          '☆ 番茄○△小說網',
          '番茄小說網☆',
      ],
  },
  {siteName: "墨缘文学网",
      url: "^http://www\\.mywenxue\\.com/xiaoshuo/\\d+/\\d+/\\d+\\.htm",
      bookTitleSelector: '#htmltimu h1 a',
      titleSelector: "#htmltimu h2 span",
      prevSelector: ".papgbutton a:nth-of-type(1)",
      indexSelector: ".papgbutton a:nth-of-type(2)",
      nextSelector: ".papgbutton a:nth-of-type(3)",
      useiframe: true,
      contentSelector: '.contentbox > .contentbox',
      contentRemove: "strong, a",
      contentReplace: [
          { 'ＺＨＡＮ': '战' },
          { 'SI': '思' },
          { 'ｓｉ　ｗａｎｇ': '死亡' },
          { 'ＤＩＮＧ': '订' },
          { 'ＳＨＩ　': '式' },
          { 'LU': '路' },
          { 'ｊｉｎ　ｒｕ': '进入' },
          { 'ｂａｏ　ｚｈａ': '爆炸' },
          { 'ＤＡＯ': '刀' },
          { 'Ｄａｎ': '弹' },
          { 'Ke': '客' },
          { 'ＧＯＵ': '购' },
          { 'ｋｕｏ　ｓａｎ': '扩散' },
          { 'Ｂu': '步' },
          { 'ＳＨＯＵ　　ＱＩＡＮＧ': '手枪' },
          '更多请登录墨缘文学网.*欢迎您的来访 >>>',
          '更多请登录墨缘文学网.*欢迎您的来访\\[ .* \\]',
          '\\( http.*墨缘文学网 \\)',
      ],
  },
  {siteName: '大海中文',
      url: 'http://www\\.dhzw\\.org/book/\\d+/\\d+/\\d+\\.html',
      contentReplace: [
          '恋上你看书网 630bookla.*',
          '\\(\\)',
      ]
  },
  {siteName: '爱上书屋',
      url: 'https?://www.23sw.net/\\d+/\\d+/\\d+.html',
      titleReg: /(.*?) (.*?),/,
      contentReplace: [
          '\\[www.23sw.net\\]',
      ]
  },
  {siteName: '2k小说阅读网',
      url: 'https?://www.2kxs.com/xiaoshuo/\\d+/\\d+/\\d+.html',
      exampleUrl: 'http://www.2kxs.com/xiaoshuo/106/106185/23622820.html',
      contentSelector: '.Text',
      contentRemove: 'a, font, strong',
      contentReplace: [
          '2k小说阅读网',
      ]
  },
  {siteName: "新笔趣阁",
      url: "^http:\/\/www.biqu6.com\/[0-9_]+\/[0-9]+.html$",

      titleReg: /(.*?)章节目录 [-_\\\/](.*?)[-_\/].*/,
      titlePos: 0,
      titleSelector: "#title h1",

      indexSelector: "a:contains('章节目录')",
      prevSelector: "a:contains('上一章')",
      nextSelector: "a:contains('下一章')",

      contentSelector: "#content",
      contentReplace: [
          /\*/g
      ],
  },
  {siteName: "涅破小说网",
      url: "^http://www.niepo.net/html/\\d+/\\d+/\\d+.html",
      contentReplace: [
          '.*最新章节.*http://www.niepo.net/.*'
      ],
  },
  {siteName: '全本小说网',
    url: 'http://www.ybdu.com/xiaoshuo/\\d+/\\d+/\\d+.html',
    contentRemove: '.infos, .chapter_Turnpage',
  },
  {siteName: '连载书',
    exampleUrl: 'http://www.lianzaishu.com/4_4017/2172985.html',
    url: '^https?://www.lianzaishu.com/\\d+_\\d+/\\d+.html',
    bookTitleSelector: '.read-top h2 a',
    contentRemove: 'h1, h2, .textinfo, .adbox, .read-page',
    contentReplace: [
        '&lt;html&gt;', '&lt;/html&gt;',
        '&lt;head&gt;&lt;/head&gt;',
        '&lt;body&gt;', '&lt;/body&gt;',
        '&lt;div&gt;',
    ]
  },
  {siteName: '新笔趣阁5200',
    exampleUrl: 'http://www.b5200.org/78_78809/151096665.html',
    url: '^https?://www\\.b5200\\.(?:org|net)/.*?/\\d+\\.html',
    contentReplace: [
      '网首发',
      '≈bp;≈bp;≈bp;≈bp;',
    ]
  },
  {siteName: '稻草人书屋',
    exampleUrl: 'http://www.daocaorenshuwu.com/book/xianhu/418206.html',
    url: '^http://www\\.daocaorenshuwu\\.com/book/.*/\\d+.html',
    bookTitleSelector: '.container .t10 span a:last()',
    contentSelector: '#cont-body',
    contentReplace: [
        '内容来自[dＤ]ao[cＣ]ao[Ｒr]enshuwu.com',
        'www.daocaorenshuwu.com',
        '稻草人书屋',
    ],
    contentPatch: function($doc) {
        // 干扰符 class 是随机的
        var styleText = $doc.find('#cont-body style').text();
        var m = styleText.match(/(.*?)\{\s*display:\s*none;?\s*\}/);
        if (m) {
            var selector = m[1];
            $doc.find(selector).remove();
        }
    }
  },
  {siteName: '小红花阅读网',
    exampleUrl: 'https://xhhread.com/read/reading.jhtml?chapterid=8aada6395a597779015a93a372c90a55',
    url: '^https?://xhhread\\.com/read/read\\w+\\.jhtml\\?chapterid=.*',
    bookTitleSelector: '.H_book',
    titleSelector: '.reading-title',
    contentPatch: function($doc) {
        // 修正上下页链接
        var rules = {
            '.H_readpreforwap': 'https://xhhread.com/read/readpreforwap.jhtml?chapterid=',
            '.H_content': 'https://xhhread.com/read/contents.jhtml?storyid=',
            '.H_readnextforwap': 'https://xhhread.com/read/readnextforwap.jhtml?chapterid=',
        };

        Object.keys(rules).forEach(function(selector) {
            var $link = $doc.find(selector);
            var chapterId = $link.attr('p');
            if (chapterId) {
                var url = rules[selector];
                $link.attr('href', url + chapterId);
            }
        });
    }
  },
  {siteName: '梧州中文台',
    exampleUrl: 'http://www.gxwztv.com/2/2121/1610090.html',
    url: '^https?://www\\.gxwztv\\.com/\\d+/\\d+/\\d+\\.html',
    bookTitleSelector: '.breadcrumb .active a',
    contentSelector: '#txtContent',
  },
  {siteName: '无敌龙书屋',
    url: '^http://www\\.fkzww\\.com/Html/Book/\\d+/\\d+/\\d+\\.shtml',
    bookTitleSelector: '#SelectInfo > a:eq(1)',
    contentSelector: "#BookTextt",
    useiframe: true,
    contentReplace: [
        '无敌龙中文网欢迎您来，欢迎您再来，记住我们http://www.wudiun.com，<a target="_blank" href="http://www.wudiun.com/User/Regters.aspx">注册会员</a>',
    ],
    // contentPatch: function($doc) {

    // }
  },

]