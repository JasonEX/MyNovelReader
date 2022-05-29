// ==UserScript==
// @id             mynovelreader@ywzhaiqi@gmail.com
// @name           My Novel Reader
// @name:zh-CN     小说阅读脚本
// @name:zh-TW     小說閱讀腳本
// @version        6.8.8
// @namespace      https://github.com/ywzhaiqi
// @author         ywzhaiqi
// @contributor    Roger Au, shyangs, JixunMoe、akiba9527 及其他网友
// @description    小说阅读脚本，统一阅读样式，内容去广告、修正拼音字、段落整理，自动下一页
// @description:zh-CN  小说阅读脚本，统一阅读样式，内容去广告、修正拼音字、段落整理，自动下一页
// @description:zh-TW  小說閱讀腳本，統一閱讀樣式，內容去廣告、修正拼音字、段落整理，自動下一頁
// @license        GPL version 3
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceURL
// @grant          GM_openInTab
// @grant          GM_setClipboard
// @grant          GM_registerMenuCommand
// @grant          GM_info
// @grant          unsafeWindow
// @homepageURL    https://greasyfork.org/scripts/292/
// @require        https://cdn.staticfile.org/vue/2.2.6/vue.min.js
// @require        https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require        https://cdn.staticfile.org/underscore.js/1.7.0/underscore-min.js
// @require        https://cdn.staticfile.org/keymaster/1.6.1/keymaster.min.js
// @require        https://cdn.staticfile.org/crypto-js/4.1.1/crypto-js.min.js
// @require        https://greasyfork.org/scripts/2672-meihua-cn2tw/code/Meihua_cn2tw.js?version=7375
// 晋江文学城防盗字体对照表
// @require        https://greasyfork.org/scripts/425673-%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E9%98%B2%E7%9B%97%E5%AD%97%E7%AC%A6%E8%A7%A3%E7%A0%81/code/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E9%98%B2%E7%9B%97%E5%AD%97%E7%AC%A6%E8%A7%A3%E7%A0%81.js?version=987740

// @connect        *
// @connect        *://*.qidian.com/

// @include        *://vipreader.qidian.com/chapter/*/*
// @include        *://www.qdmm.com/BookReader/*,*.aspx
// @include        *://chuangshi.qq.com/read/bookreader/*.html*
// @include        *://chuangshi.qq.com/*bk/*/*-r-*.html*
// @include        *://yunqi.qq.com/*bk/*/*.html
// @include        *://dushu.qq.com/read.html?bid=*
// @include        *://www.jjwxc.net/onebook.php?novelid=*
// @include        *://my.jjwxc.net/onebook_vip.php?novelid=*&chapterid=*
// @include        *://book.zongheng.com/chapter/*/*.html
// @include        *://www.xxsy.net/chapter/*.html
// @include        *://book.zhulang.com/*/*.html
// @include        *://www.17k.com/chapter/*/*.html
// @include        *://mm.17k.com/chapter/*/*.html
// @include        *://www.kanxia.net/k/*/*/*.html
// @include        *://www.xkzw.org/*/*.html
// @include        *://shouda8.com/*/*.html
// @include        *://novel.hongxiu.com/*/*/*.shtml
// @include        *://www.readnovel.com/novel/*.html
// @include        *://shushan.zhangyue.net/book/*/*/
// @include        *://weread.qq.com/web/reader/*
// @match          *://www.qimao.com/shuku/*-*/
// http://www.tianyabook.com/*/*.htm

// @include        *://tieba.baidu.com/p/*
// @include        *://booklink.me/*

// booklink.me
// @include        *://www.shumil.co/*/*.html
// @include        *://www.dudukan.net/html/*/*/*.html
// @include        *://www.tadu.com/book/*/*/
// @exclude        *://www.tadu.com/book/*/toc/
// @include        *://www.du00.com/read/*/*/*.html
// @include        *://www.23zw.com/olread/*/*/*.html
// @include        *://www.50zw.com/book_*/*.html
// @include        *://www.xiangcunxiaoshuo.com/shu/*/*.html
// @include        *://www.wenxue8.org/html/*/*/*.html
// @match          *://www.bixia.org/book/*/*.html
// @match          *://www.67book.net/book/*/*.html
// @match          *://www.50zw.org/book/*/*.html
// @match          *://www.mijiashe.com/*/*.html
// @match          *://www.luoqiuzw.com/book/*/*.html
// @match          *://www.xiaoshuo.cc/*/*.html
// @match          *://www.tyue.net/*/*.html
// @match          *://www.biduoxs.com/biquge/*/*.html
// @match          *://www.aixswx.com/xs/*/*/*.html
// @match          *://www.babayu.com/kanshu/*.html
// @match          *://www.wucuoxs.com/*/*.html
// @match          *://www.ouoou.com/*/*.html
// @match          *://www.7017k.com/*/*.html
// @match          *://www.piaotianwenxue.com/book/*/*/*.html

// @include        *://www.xs84.com/*_*/*

//www.verydu.net
//         http://www.yawen8.com/*/*/*.html

// 其它网站
// @include        *://book.sfacg.com/Novel/*/*/*/
// @include        *://www.shuhaha.com/Html/Book/*/*/*.html
// @include        *://www.ttzw.com/book/*/*.html
// @include        *://www.uukanshu.com/*/*/*.html
// @include        *://www.uukanshu.net/*/*/*.html
// @include        *://www.shenmaxiaoshuo.com/ml-*-*/
// @include        *://www.doulaidu.com/*/*/*.html
// @include        *://www.wtcxs.com/files/article/html/*/*/*.html
// @include        *://book.kanunu.org/*/*/*.html
// @include        *://www.kanunu8.com/book*/*.html
// @include        *://www.nuoqiu.com/static/*/*.html
// @include        *://www.17yue.com/*/*/*.html
// @include        *://www.epzww.com/book/*/*
// @include        *://www.23us.cc/html/*/*/*.html
// @include        *://www.59shuku.com/xiaoshuo/*/*.htm
// @include        *://www.16kbook.org/Html/Book/*/*/*.shtml
// @include        *://www.1kanshu.com/files/article/html/*/*/*.html
// @include        *://www.biqudu.com/*/*.html
// @include        *://www.biquge.la/book/*/*.html
// @include        *://www.biquge.tv/*/*.html
// @include        *://www.biquge5200.com/*/*.html
// @include        *://www.biqugezw.com/*/*.html
// @include        *://www.bequgezw.com/*/*/*.html
// @include        *://www.biqubao.com/book/*/*.html
// @include        *://www.biquwu.cc/biquge/*/*.html
// @include        *://www.qududu.com/book/*/*/*.html
// @include        *://www.123du.cc/dudu-*/*/*.html
// @include        *://www.xiaoyanwenxue.com/files/article/html/*/*/*.html
// @include        *://www.dajiadu.net/files/article/html/*/*/*.html
// @include        *://www.dushuge.net/html/*/*/*.html
// @include        *://www.moneyren.com/book/*/*/*.shtml
// @include        *://www.bookba.net/Html/Book/*/*/*.html
// @include        *://www.moksos.com/*/*/*.html
// @include        *://www.dawenxue.net/html/*/*/*.html
// @include        *://www.yanmoxuan.org/book/*/*/*.html
// @include        *://www.69zw.com/xiaoshuo/*/*/*.html
// @include        *://www.bxwx.org/b/*/*/*.html
// @include        *://www.bxzw.org/*/*/*/*.shtml
// @include        *://www.dyzww.com/cn/*/*/*.html
// @include        *://www.epzw.com/files/article/html/*/*/*.html
// @include        *://b.faloo.com/p/*/*.html
// @include        *://b.faloo.com/*_*.html
// @include        *://www.3dllc.com/html/*/*/*.html
// @include        *://www.xstxt.com/*/*/
// @include        *://www.zzzcn.com/3z*/*/
// @include        *://www.zzzcn.com/modules/article/App.php*
// @include        *://xs321.net/*/*/
// @include        *://read.guanhuaju.com/files/article/html/*/*/*.html
// @include        *://5ycn.com/*/*/*.html
// @include        *://*zbzw.com/*/*.html
// @include        *://www.aiqis.com/*/*.html
// @include        *://www.5kwx.com/book/*/*/*.html
// @include        *://www.chinaisbn.com/*/*/*.html
// @include        *://www.caihongwenxue.com/Html/Book/*/*/*.html
// @include        *://www.woaixiaoshuo.com/xiaoshuo/*/*/*.html
// @include        *://www.ty2016.com/book/*/*.html
// @include        *://wx.ty2016.com/*/*/*.html
// @include        *://www.my285.com/*/*/*/*.htm
// @include        *://www.5858xs.com/html/*/*/*.html
// @include        *://book.58xs.com/html/*/*/*.html
// @include        *://www.hjwzw.com/Book/Read/*,*
// @include        *://www.hjwzw.com/Book/Read/*_*
// @include        *://www.365essay.com/*/*.htm
// @include        *://www.gengxin8.com/read/*/*.html
// @include        *://www.wuruo.com/files/article/html/*/*/*.html
// @include        *://*.8shuw.net/book/*/*.html
// @include        *://www.pashuw.com/BookReader/*/*.html
// @include        *://www.qqxs.cc/xs/*/*/*.html
// @include        *://www.69shu.com/txt/*/*
// @include        *://www.e8zw.com/book/*/*/*.html
// @include        *://www.yfzww.com/books/*/*/*.htm
// @include        *://www.77nt.com/*/*.html
// @include        *://www.quanbenba.com/yuedu/*/*/*.html
// @include        *://www.sto.cc/book-*-*.html
// @include        *://www.151xs.com/wuxiazuoxiong/*/chapter/*/
// @include        *://www.33yq.com/read/*/*/*.shtml
// @include        *://www.50zw.co/book_*/*.html
// @include        *://www.bqg5200.com/xiaoshuo/*/*/*.html
// @include        *://www.biquge5200.cc/*/*.html
// @include        *://www.50zw.la/book_*/*.html
// @include        *://www.54tushu.com/book_library/chaptershow/theId/*.html
// @include        *://www.snwx8.com/book/*/*/*.html
// @include        *://read.qidian.com/chapter/*
// @include        *://www.ptwxz.com/html/*/*/*.html
// @include        *://www.dhzw.org/book/*/*/*.html
// @include        *://www.miaobige.com/*/*/*.html
// @include        *://www.52dsm.com/chapter/*/*.html
// @include        *://www.banfusheng.com/chapter/*/*.html
// @include        *://www.shuhai.com/read/*/*.html
// @include        *://www.hbooker.com/chapter/*
// @include        *://www.paomov.com/*/*/*.html
// @include        *://www.moyuanwenxue.com/xiaoshuo/*/*/*.htm
// @include        *://www.mywenxue.com/xiaoshuo/*/*/*.htm
// @include        *://www.yueduyue.com/*/*.html
// @include        *://www.67shu.com/*/*/*.html
// @include        *://www.wangshu.la/books/*/*/*.html
// @include        *://www.ymoxuan.com/book/*/*/*.html
// @include        *://www.67shu.com/*/*/*.html
// @include        *://www.bookxuan.com/*/*.html
// @include        *://www.wutuxs.com/html/*/*/*.html
// @include        *://www.23qb.com/book/*/*.html
// @include        *://www.niepo.net/html/*/*/*.html
// @include        *://www.booktxt.net/*/*.html
// @include        *://www.booktxt.com/*/*.html
// @include        *://www.lewenxiaoshuo.com/books/*/*.html
// @include        *://www.heihei66.com/*/*/*.html
// @include        *://www.111bz.net/*/*.html
// @include        *://www.biqukan.com/*_*/*.html
// @include        *://www.4xiaoshuo.com/*/*/*.html
// @include        *://www.woquge.com/*/*.html
// @include        *://www.lucifer-club.com/chapter-*-*.html
// @include        *://www.011bz.com/*/*.html
// @include        *://www.quanben.io/*/*/*.html
// @include        *://www.b5200.org/*/*.html
// @include        *://www.b5200.net/*/*.html
// @include        *://www.cangqionglongqi.com/*/*.html
// @include        https://xhhread.com/read/read*.jhtml?chapterid=*
// @include        *://novel.tingroom.com/*/*/*.html
// @include        *://www.liewen.cc/b/*/*/*.html
// @include        *://www.pbtxt.com/*/*.html
// @include        *://www.dingdiann.com/*/*.html
// @include        *://www.mytxt.cc/read/*/*.html
// @include        *://yd.baidu.com/view/*?cn=*
// @include        *://www.88dus.com/xiaoshuo/*/*/*.html
// @include        *://m.yushuwu.com/novel/*/*.html
// @include        *://www.sbkk88.com/*/*/*.html
// @include        *://www.ciweimao.com/chapter/*
// @include        *://www.xinshubao.net/*/*/*.html
// @include        *://www.okdd.net/html/*/*/*.shtml
// @include        *://www.aixs.org/xs/*/*/*.html
// @include        *://www.kayege.com/book/*/*.html
// @include        *://m.zwduxs.com/*_*/*.html
// @include        *://www.23us.la/html/*/*/*.html
// @include        *://www.shuyaya.cc/read/*/*.html
// @include        *://www.58xs.tw/html/*/*/*.html
// @include        *://www.xbiquge.cc/book/*/*.html
// @include        *://www.pengchang-cn.com/*/*/*.html
// @include        *://www.69shu.la/69shu/*/*/*.html
// @include        *://www.biqux.com/*/*.html
// @include        *://houweidong.com/*.html
// @include        *://book.janpn.com/book/*/*/*.html
// @include        *://www.xs52.com/xiaoshuo/*/*/*.html
// @include        *://www.luoxia.com/hch/*.htm
// @include        *://www.juhezw.com/read/*/*.html
// @include        *://www.ranwen.la/files/article/*/*/*.html
// @include        *://www.zhaishuyuan.com/chapter/*/*
// @include        *://www.ciymao.com/chapter/*/*.html
// @include        *://www.3xs.cc/*/*.html
// @include        *://www.nuanyuehanxing.com/*/*/*.html
// @include        *://xrzww.com/module/novel/read.php*
// @include        *://www.wanbentxt.com/*/*.html
// @include        *://www.35xs.co/book/*/*.html
// @include        *://www.gongzicp.com/read-*.html
// @include        *://www.alfagame.net/chapter_www.html?1*
// @include        *://www.69shu.com/txt/*/*
// @include        *://www.duwanjuan.com/html/*/*/*.html
// @include        *://www.imiaobige.com/read/*/*.html
// @include        *://www.ixs.la/*/*.html
// @include        *://www.xs321.net/book/*/*/*.html
// @include        *://www.hetushu.com/book/*/*.html
// @include        *://v1.45zw.com/book/*/*.html
// @include        *://www.zhaishuyuan.org/book/*/*.html
// @include        *://www.00ksw.com/html/*/*/*.html
// @include        *://www.99bxwx.com/b/*/*.html
// @include        *://www.cnhxfilm.com/book/*/*.html
// @match          *://www.vipkanshu.vip/shu/*/*.html
// @match          *://www.81zw.com/book/*/*.html
// @match          *://www.biqu5200.net/*/*.html
// @match          *://www.biqusa.com/*/*.html
// @match          *://www.biququ.com/html/*/*.html
// @match          *://www.ddxs.com/*/*.html
// @match          *://www.biqugetv.com/*/*.html
// @match          *://www.feiszw.com/Html/*/*.html
// @match          *://www.xn--fiq228cu93a4kh.com/Html/*/*.html
// @match          *://www.555x.org/read/*/*.html
// @match          *://www.soxs.cc/*/*.html
// @match          *://www.soxscc.cc/*/*.html
// @match          *://www.soxscc.net/*/*.html
// @match          *://www.soxscc.org/*/*.html
// @match          *://www.soshuw.com/*/*.html
// @match          *://www.soshuwu.com/*/*.html
// @match          *://www.soshuwu.org/*/*.html
// @match          *://www.kubiji.net/*/*.html
// @match          *://www.imbg.com/read/*/*.html
// @match          *://www.linovelib.com/novel/*/*.html
// @match          *://www.shuquge.com/txt/*/*.html
// @match          *://www.uuks.org/b/*/*.html
// @match          *://www.230book.net/book/*/*.html
// @match          *://www.exiaoshuo.com/*/*/
// @match          *://www.877zw.com/*/*.html
// @match          *://www.zhuixsw.com/*/*.html
// @match          *://www.ddxs.com/*/*.html
// @match          *://www.ah123z.com/*/*/*.html
// @match          *://www.bqxs520.com/*/*.html
// @match          *://www.bidige.com/book/*/*.html
// @match          *://www.yushubo.com/read_*.html
// @match          *://www.bqwxg8.com/wenzhang/*/*/*.html
// @match          *://www.zpxsw.com/*/*.html
// @match          *://www.xbiqukan.com/book/*/*.html
// @match          *://www.cxbz958.com/*/*.html
// @match          *://www.51kanshu.cc/book/*/*.html
// @match          *://www.mibaoge.com/*/*.html
// @match          *://www.asxs.com/view/*/*.html

// NSFW
// @match          *://book.xbookcn.net/*/*/*.html

// 移动版
// @include        *://wap.yc.ireader.com.cn/book/*/*/
// @include        *://m.jjwxc.net/book2/*/*
// @include        *://m.jjwxc.com/book2/*/*
// @include        *://wap.jjwxc.net/book2/*/*
// @include        *://wap.jjwxc.com/book2/*/*
// @include        *://wap.jjwxc.com/vip/*/*?ctime=*
// @include        *://wap.jjwxc.com/vip/*/*
// @include        *://wap.jjwxc.net/vip/*/*
// @include        *://m.jjwxc.net/vip/*/*
// @include        *://m.jjwxc.com/vip/*/*

// @exclude        */List.htm
// @exclude        */List.html
// @exclude        */List.shtml
// @exclude        */index.htm
// @exclude        */index.html
// @exclude        */index.shtml
// @exclude        */Default.htm
// @exclude        */Default.html
// @exclude        */Default.shtml

// @run-at         document-body
// ==/UserScript==

/* This script build by rollup. */
(function (Vue) {
  'use strict';

  

  function __$styleInject ( css ) {
      if(!css) return ;
  
      if(typeof(window) == 'undefined') return ;
      let style = document.createElement('style');
      style.setAttribute('media', 'screen');
      style.setAttribute('class', 'noRemove');
  
      style.innerHTML = css;
      document.head.appendChild(style);
      return css;
  }

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;

  // 其它设置
  const config = {
    lang: 'zh-CN',

    soduso: false,                  // www.sodu.so 跳转
    // content_replacements: true,     // 小说屏蔽字修复
    fixImageFloats: true,           // 图片居中修正
    paragraphBlank: true,           // 统一段落开头的空格为 2个全角空格
    end_color: "#666666",           // 最后一页的链接颜色
    // PRELOADER: true,                // 提前预读下一页

    xhr_time: 15 * 1000,
    download_delay: 0,  // 毫秒。0 毫秒下载起点 vip 限时免费章节会被封
    dumpContentMinLength: 3,        // 检测重复内容的最小行数
  };

  var uiTrans = {
      "将小说网页文本转换为繁体。\n\n注意：内置的繁简转换表，只收录了简单的单字转换，启用本功能后，如有错误转换的情形，请利用脚本的自订字词取代规则来修正。\n例如：「千里之外」，会错误转换成「千里之外」，你可以加入规则「千里之外=千里之外」来自行修正。": "將小說網頁文字轉換為繁體。\n\n注意：內建的繁簡轉換表，只收錄了簡單的單字轉換，啟用本功能後，如有錯誤轉換的情形，請利用腳本的自訂字詞取代規則來修正。\n例如：「千里之外」，會錯誤轉換成「千裡之外」，你可以加入規則「千裡之外=千里之外」來自行修正。",
      "图片章节用夜间模式没法看，这个选项在启动时会自动切换到缺省皮肤": "圖片章節無法以夜間模式觀看，這個選項在啟動時會自動切換到預設佈景",
      "通过快捷键切换或在 Greasemonkey 用户脚本命令处打开设置窗口": "通過熱鍵切換或在 Greasemonkey 使用者腳本命令處開啟設定視窗",
      "隐藏后通过快捷键或 Greasemonkey 用户脚本命令处调用": "隱藏後通過熱鍵或 Greasemonkey 使用者腳本命令處調用",
      "一行一个，每行第一个 = 为分隔符\n需要刷新页面生效": "一行一條規則，每一行第一個 = 為分隔符\n（需重新載入頁面才能生效）",
      "错误：没有找到下一页的内容，使用右键翻到下一页": "錯誤：沒有找到下一頁的內容，使用右鍵翻到下一頁",
      "左键滚动，中键打开链接（无阅读模式）": "左鍵捲動畫面至該章節，中鍵開啟連結（無閱讀模式）",
      "请输入切换左侧章节列表的快捷键：": "請輸入切換左側章節列表的熱鍵：",
      "详见脚本代码的 Rule.specialSite": "詳見腳本代碼的 Rule.specialSite",
      "booklink.me 点击的网站强制启用": "booklink.me 點擊的網站強制啟用",
      "部分选项需要刷新页面才能生效": "部份選項需重新載入頁面才能生效",
      "取消本次设定，所有选项还原": "取消本次設定，所有選項還原",
      "不影响 booklink.me 的启用": "不影響 booklink.me 的啟用",
      "请输入打开设置的快捷键：": "請輸入開啟設定視窗的熱鍵：",
      "微软雅黑,宋体,黑体,楷体": "Microsoft YaHei,新細明體,PMingLiU,MingLiU,細明體,標楷體",
      "夜间模式的图片章节检测": "夜間模式的圖片章節檢測",
      "点击显示隐藏章节列表": "點此以顯示或隱藏章節列表",
      "添加下一页到历史记录": "加入下一頁到歷史記錄",
      "booklink 自动启用": "booklink 自動啟用",
      "Enter 键打开目录": "Enter 鍵開啟目錄",
      "隐藏左侧章节列表": "隱藏左側章節列表",
      "小说阅读脚本设置":"小說閱讀腳本設定",
      "已到达最后一页": "已到達最後一頁",
      "正在载入下一页": "正在載入下一頁",
      "通过快捷键切换": "通過熱鍵切換",
      "隐藏底部导航栏": "隱藏底部導航列",
      "隐藏左侧导航条": "隱藏左側章節列表彈出鈕",
      "主页链接没有找到": "未找到主頁連結",
      "自定义站点规则": "自訂網站規則",
      "自定义替换规则": "自訂字詞取代規則",
      "网页：转繁体": "網頁：轉繁體",
      "双击暂停翻页": "雙擊暫停翻頁",
      "隐藏设置按钮": "隱藏設定按鈕",
      "强制手动启用": "強制手動啟用",
      "调用阅读器": "調用閱讀器",
      "自定义样式": "自訂樣式",
      "界面语言": "介面語言",
      "打开目录": "開啟本書目錄頁",
      "自动翻页": "自動翻頁",
      "缺省皮肤": "預設佈景",
      "暗色皮肤": "暗色佈景",
      "夜间模式": "夜間模式",
      "夜间模式1": "夜間模式1",
      "夜间模式2": "夜間模式2",
      "橙色背景": "橙色背景",
      "绿色背景": "綠色背景",
      "绿色背景2": "綠色背景2",
      "蓝色背景": "藍色背景",
      "棕黄背景": "棕黃背景",
      "经典皮肤": "經典背景",
      "阅读模式": "閱讀模式",
      "调试模式": "偵錯模式",
      "反馈地址": "反饋與討論",
      "安静模式": "安靜模式",
      "√ 确认": "√ 確定",
      "X 取消": "X 取消",
      "上一页": "上一頁",
      "下一页": "下一頁",
      "状态": "狀態",
      "已经": "已經",
      "暂停": "暫停",
      "启用": "啟用",
      "退出": "離開",
      "测试": "測試",
      "距离": "距離",
      "加载": "載入",
      "字体": "字型",
      "行高": "行距",
      "行宽": "版面寬度",
      "目录": "目錄"
  };

  if(!String.prototype.uiTrans){
      Object.defineProperty(String.prototype, 'uiTrans', {
          value: function(){
              var _this = this.valueOf(), key, regexp;
              if(config.lang !== 'zh-TW') return _this;

              if(uiTrans.hasOwnProperty(_this)) return uiTrans[_this];

              for (key in uiTrans) {
                  regexp = new RegExp(key, 'g');
                  _this = _this.replace(regexp, uiTrans[key]);
              }
              return _this;
          },
          enumerable: false
      });
  }

  // 参考 https://github.com/madrobby/zepto/blob/master/src/detect.js

  const ua = navigator.userAgent;
  const platform = navigator.platform;

  const isFirefox = ua.match(/Firefox\/([\d.]+)/);

  const isChrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);

  const isWindows = /Win\d{2}|Windows/.test(platform);

  //------------------- 辅助函数 ----------------------------------------

  var nullFn = function() {};

  // @require https://greasyfork.org/scripts/2599-gm-2-port-function-override-helper/code/GM%202%20port%20-%20Function%20Override%20Helper.js?version=184155
  // Check if is GM 2.x
  if (typeof window.exportFunction == 'undefined') {
      // For GM 1.x backward compatibility, should work.
      window.exportFunction = (function(foo, scope, defAs) {
          scope[defAs.defineAs] = foo;
      }).bind(unsafeWindow);
  }

  var C;

  function toggleConsole(debug) {
      if (debug) {
          C = {...unsafeWindow.console};
      } else {
          C = {
              log: nullFn,
              debug: nullFn,
              error: unsafeWindow.console.error,
              group: nullFn,
              groupCollapsed: nullFn,
              groupEnd: nullFn,
              time: nullFn,
              timeEnd: nullFn,
          };
      }
  }

  function L_getValue(key) { // 个别用户禁用本地存储会报错
      try {
          return localStorage.getItem(key);
      } catch (e) {}
  }

  function L_setValue(key, value) {
      try {
          localStorage.setItem(key, value);
      } catch (e) {}
  }

  function L_removeValue(key) {
      try {
          localStorage.removeItem(key);
      } catch (e) {}
  }


  function parseHTML(str) {
      var doc;
      try {
          // firefox and chrome 30+，Opera 12 会报错
          doc = new DOMParser().parseFromString(str, "text/html");
      } catch (ex) {}

      if (!doc) {
          doc = document.implementation.createHTMLDocument("");
          doc.querySelector("html").innerHTML = str;
      }
      return doc;
  }

  const _regexCache = {};

  function toRE(obj, flag = 'igm') {
      if (obj instanceof RegExp) {
          return obj;
      } else if (_regexCache[obj] && _regexCache[obj][flag]) {
          const re = _regexCache[obj][flag];
          re.lastIndex = 0;
          return re
      } else if (!_regexCache[obj]) {
          const re = new RegExp(obj, flag);
          _regexCache[obj] = { [flag]: re };
          return re
      } else if (!_regexCache[obj][flag]) {
          const re = new RegExp(obj, flag);
          _regexCache[obj][flag] = re;
          return re
      }
  }

  function toReStr(str) {  // 处理字符串，否则可能会无法用正则替换
      return str.replace(/[()\[\]{}|+.,^$?\\*]/g, "\\$&");
  }

  function wildcardToRegExpStr(urlstr) {
      if (urlstr.source) return urlstr.source;
      var reg = urlstr.replace(/[()\[\]{}|+.,^$?\\]/g, "\\$&").replace(/\*+/g, function(str){
          return str === "*" ? ".*" : "[^/]*";
      });
      return "^" + reg + "$";
  }

  function getUrlHost(url) {
      var a = document.createElement('a');
      a.href = url;
      return a.host;
  }

  function sleep(timeout) {
      return new Promise(resolve => setTimeout(resolve, timeout))
  }

  // 等待 DOMContentLoaded 事件触发
  function DOMContentLoaded(){
      return new Promise(resolve => $(resolve))
  }

  // GM_xmlhttpRequest Promise 版
  function Request(options) {
      return new Promise((resolve, reject) => {
          options.onerror = options.ontimeout = reject;
          options.onload = resolve;
          GM_xmlhttpRequest(options);
      })
  }

  // https://stackoverflow.com/a/4232971
  // 删除包裹着文本的标签
  function unwrapTag(doc, tagName) {
      const tags = doc.getElementsByTagName(tagName);

      while (tags.length) {
          var parent = tags[0].parentNode;
          while (tags[0].firstChild) {
              parent.insertBefore(tags[0].firstChild, tags[0]);
          }
          parent.removeChild(tags[0]);
      }
      doc.normalize();
  }

  // https://stackoverflow.com/a/4399718
  // 获取所有文本节点
  function getTextNodesIn(node, includeWhitespaceNodes) {
      var textNodes = [],
          nonWhitespaceMatcher = /\S/;

      function getTextNodes(node) {
          if (node.nodeType == 3) {
              if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
                  textNodes.push(node);
              }
          } else {
              for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                  getTextNodes(node.childNodes[i]);
              }
          }
      }
      node.normalize();
      getTextNodes(node);
      return textNodes
  }


  // 模板
  $.nano = function(template, data) {
      return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
          var keys = key.split("."),
              v = data[keys.shift()];
          try {
              for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
          } catch (e) {}
          return (typeof v !== "undefined" && v !== null) ? v : "";
      });
  };

  // jQuery text 完全匹配. e.g. a:econtains('最新章节')
  $.expr[":"].econtains = function(obj, index, meta, stack) {
      return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
  };

  /* jshint ignore: start */

  function $x(aXPath, aContext) {
      var nodes = [];
      var doc = document;
      aContext = aContext || doc;

      try {
          var results = doc.evaluate(aXPath, aContext, null,
              XPathResult.ANY_TYPE, null);
          var node;
          while (node = results.iterateNext()) {
              nodes.push(node);
          }
      } catch (ex) {}

      return nodes;
  }

  if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(str) {
          return this.slice(0, str.length) == str;
      };
  }

  if (typeof String.prototype.endsWith != 'function') {
      String.prototype.endsWith = function(str) {
          return this.slice(-str.length) == str;
      };
  }

  if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
          if (typeof start !== 'number') {
              start = 0;
          }
          if (start + search.length > this.length) {
              return false;
          } else {
              return this.indexOf(search, start) !== -1;
          }
      };
  }


  /*
   * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
   */
  jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return -d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return (b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return (b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return -d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return (b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return (b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return -d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return -d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return 0==b?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return 0==b?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return -d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return (b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;return 0==b?c:1==(b/=e)?c+d:(g||(g=.3*e),h<Math.abs(d)?(h=d,f=g/4):f=g/(2*Math.PI)*Math.asin(d/h),-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c)},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;return 0==b?c:1==(b/=e)?c+d:(g||(g=.3*e),h<Math.abs(d)?(h=d,f=g/4):f=g/(2*Math.PI)*Math.asin(d/h),h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c)},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;return 0==b?c:2==(b/=e/2)?c+d:(g||(g=e*.3*1.5),h<Math.abs(d)?(h=d,f=g/4):f=g/(2*Math.PI)*Math.asin(d/h),1>b?-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:.5*h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+d+c)},easeInBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),(b/=e/2)<1?d/2*b*b*(((f*=1.525)+1)*b-f)+c:d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){return (b/=e)<1/2.75?d*7.5625*b*b+c:2/2.75>b?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:2.5/2.75>b?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(a,b,c,d,e){return e/2>b?.5*jQuery.easing.easeInBounce(a,2*b,0,d,e)+c:.5*jQuery.easing.easeOutBounce(a,2*b-e,0,d,e)+.5*d+c}});

  /* jshint ignore: end */

  // import UI from './UI'

  var getBooleanConfig = function(configName, defaultValue) {
      var config = GM_getValue(configName);
      if(config === undefined) {
          GM_setValue(configName, defaultValue);
          config = defaultValue;
      }
      return config;
  };

  const Setting = {
      // getDisableAutoLaunch: function() {  // 强制手动启用模式
      //     return getBooleanConfig("disable_auto_launch", false);
      // },
      // setDisableAutoLaunch: function(bool) {
      //     GM_setValue("disable_auto_launch", bool);
      // },

      // 按键调用会遇到问题： Greasemonkey 访问违规：unsafeWindow 无法调用 GM_getValue
      // 故改成这种形式
      copyCurTitle: getBooleanConfig("copyCurTitle", true),
      setCopyCurTitle: function (bool) {
          this.copyCurTitle = !!bool;
          GM_setValue("copyCurTitle", !!bool);
      },

      // get cn2tw() {
      //     if (_.isUndefined(this._cn2tw)) {
      //         this._cn2tw = getBooleanConfig('cn2tw', this.lang === 'zh-TW' ? true : false);
      //     }
      //     return this._cn2tw;
      // },
      // set cn2tw(bool) {
      //     GM_setValue('cn2tw', bool);
      //     this._cn2tw = bool;
      // },

      get booklink_enable() {  // booklink.me 跳转的自动启动
          return getBooleanConfig("booklink_enable", true);
      },
      set booklink_enable(bool) {
          GM_setValue("booklink_enable", bool);
      },

      get debug() {  // 调试
          if (_.isUndefined(this._debug)) {
              this._debug = getBooleanConfig("debug", false);
          }
          return this._debug;
      },
      set debug(bool) {
          this._debug = bool;
          GM_setValue("debug", bool);
          toggleConsole(bool);
      },

      get addToHistory() {
          if (_.isUndefined(this._addToHistory)) {
              this._addToHistory = getBooleanConfig("add_nextpage_to_history", true);
          }
          return this._addToHistory;
      },
      set addToHistory(bool) {
          this._addToHistory = bool;
          GM_setValue("add_nextpage_to_history", bool);
      },

      get dblclickPause() {
          return getBooleanConfig('dblclick_pause', true);
      },
      set dblclickPause(bool) {
          GM_setValue('dblclick_pause', bool);
      },

      get remain_height() {  // 距离底部多少高度（px）开始加载下一页
          if(_.isUndefined(this._remain_height)){
              this._remain_height = parseInt(GM_getValue("remain_height"), 10) || 400;
          }
          return this._remain_height;
      },
      set remain_height(val) {
          this._remain_height = val;
          GM_setValue("remain_height", val);
      },

      get lang() {
          if (_.isUndefined(this._lang)) {
              this._lang = GM_getValue("lang") || ((navigator.language === "zh-TW" || navigator.language === "zh-HK") ? "zh-TW" : "zh-CN");
          }
          return this._lang;
      },
      set lang(val) {
          this._lang = val;
          config.lang = val;
          GM_setValue("lang", val);
      },

      get font_family() {
          return GM_getValue("font_family") || "微软雅黑,宋体,黑体,楷体".uiTrans();
      },
      set font_family(val) {
          GM_setValue("font_family", val);
      },

      get font_size() {  // 字体大小
          return GM_getValue("font_size") || "18px";
      },
      set font_size(val) {
          GM_setValue("font_size", val);
      },

      get text_line_height(){
          return GM_getValue("text_line_height") || "2em";
      },
      set text_line_height(val){
          GM_setValue("text_line_height", val);
      },

      get content_width() {  // 内容宽度
          return GM_getValue("content_width") || "800px";
      },
      set content_width(val) {
          GM_setValue("content_width", val);
      },

      get extra_css() {
          return GM_getValue("extra_css", "");
      },
      set extra_css(val) {
          GM_setValue("extra_css", val);
      },

      get customSiteinfo() {
          return GM_getValue('custom_siteinfo', '[]');
      },
      set customSiteinfo(val) {
          GM_setValue('custom_siteinfo', val);
      },

      get customReplaceRules() {
          var rules = GM_getValue('custom_replace_rules', 'b[āà]ng=棒\n『(.)』=$1');

          return rules;
      },
      set customReplaceRules(val) {
          GM_setValue('custom_replace_rules', val);
      },

      get skin_name() {
          return GM_getValue("skin_name") || "缺省皮肤".uiTrans();
      },
      set skin_name(val) {
          GM_setValue("skin_name", val);
      },

      get menu_list_hiddden() {
          return getBooleanConfig("menu_list_hiddden", false);
      },
      set menu_list_hiddden(bool) {
          GM_setValue("menu_list_hiddden", bool);
      },

      get hide_footer_nav() {
          return getBooleanConfig("hide_footer_nav", true);
      },
      set hide_footer_nav(bool) {
          GM_setValue("hide_footer_nav", bool);
      },

      get hide_preferences_button() {
          return getBooleanConfig("hide_preferences_button", false);
      },
      set hide_preferences_button(bool) {
          GM_setValue('hide_preferences_button', bool);
      },

      // === 快捷键

      // 安静模式切换快捷键
      get quietModeKey() {
          if (this._quietModeKey) {
              return this._quietModeKey;
          }
          this._quietModeKey = GM_getValue('quietModeKey') || 'q';

          return this._quietModeKey;
      },
      set quietModeKey(keyCode) {
          this._quietModeKey = keyCode;
          GM_setValue('quietModeKey', keyCode);
      },

      // 打开设置窗口的快捷键
      get openPreferencesKey() {
          if (this._openPreferencesKey) {
              return this._openPreferencesKey;
          }
          this._openPreferencesKey = GM_getValue('open_preferences_key') || 's';

          return this._openPreferencesKey;
      },
      set openPreferencesKey(keyCode) {
          this._openPreferencesKey = keyCode;
          GM_setValue('open_preferences_key', keyCode);
      },

      // 隐藏左侧章节列表的快捷键
      get hideMenuListKey() {  // 默认为 c
          // 'C'.charCodeAt(0) = 67
          if (this._hideMenuListKey) {
              return this._hideMenuListKey;
          }
          this._hideMenuListKey = GM_getValue('hide_menulist_key') || 'c';

          return this._hideMenuListKey;
      },
      set hideMenuListKey(key) {
          this._hideMenuListKey = key;
          GM_setValue("hide_menulist_key", key);
      },

      // 打开朗读快捷键
      get openSpeechKey() {
          return GM_getValue('openSpeechKey') || 'a';
      },
      set openSpeechKey(key) {
          GM_setValue('openSpeechKey', key);
      },

      get picNightModeCheck() {
          return getBooleanConfig('picNightModeCheck', true);
      },
      set picNightModeCheck(bool) {
          GM_setValue('picNightModeCheck', bool);
      },

      get split_content() {
          if (_.isUndefined(this._split_content)) {
              this._split_content = GM_getValue('split_content', true);
          }
          return this._split_content;
      },
      set split_content(bool) {
          this._split_content = bool;
          GM_setValue('split_content', bool);
      },

      get scrollAnimate() {
          return GM_getValue('scrollAnimate', false);
      },
      set scrollAnimate(bool) {
          GM_setValue('scrollAnimate', bool);
      },

      get launchMode() {
          return GM_getValue('launchMode', 'memory');
      },
      set launchMode(value) {
          GM_setValue('launchMode', value);
      },

      get preloadNextPage() {
          return GM_getValue('preloadNextPage', true);
      },
      set preloadNextPage(bool) {
          GM_setValue('preloadNextPage', bool);
      },

      get chineseConversion() {
          return GM_getValue('chineseConversion', this.lang === 'zh-TW' ? 'to-tw' : 'disable');
      },
      set chineseConversion(value) {
          GM_setValue('chineseConversion', value);
      },

      // 内容标准化
      get contentNormalize() {
          return GM_getValue('contentNormalize', true);
      },
      set contentNormalize(bool) {
          GM_setValue('contentNormalize', bool);
      },
      // 合并双引号中的多行内容
      get mergeQoutesContent() {
          return GM_getValue('mergeQoutesContent', false);
      },
      set mergeQoutesContent(bool) {
          GM_setValue('mergeQoutesContent', bool);
      },
  };

  function getMiddleStr(str, leftStr, rightStr) {
      var leftIndex = str.indexOf(leftStr) + leftStr.length;
      var rightIndex = str.indexOf(rightStr, leftIndex);
      if (leftIndex > -1 && rightIndex > -1) {
          return str.substring(leftIndex, rightIndex)
      } else {
          return ''
      }
  }

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
          $doc.find('.review-count').remove();

          $doc.find('.content-wrap').contents().unwrap();

          $doc.find('.read-content.j_readContent style').remove();

          const cId = $doc.find('.read-content.j_readContent').attr('id').slice(2);
          const style = $doc.find('link[href^=blob]').attr('class', 'noRemove');

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
                  .wrapInner(`<div id="j_${cId}">`);
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
          const win = $doc[0].defaultView;
          if (win.g_data.chapter.vipStatus === 1) { // 是 vip 章节
              this.useiframe = true;
              this.mutationSelector = '.read-content.j_readContent';
              this.mutationChildCount = 0;
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

            $doc.find("div[align=right], .readsmall").remove();
            
            // 移除VIP章节方块
            var $node = $doc.find('.noveltext');
            if ($node.attr("class").split(/\s+/).length === 2) {
                var fontName = $node.attr("class").split(/\s+/)[1];
                const html = await replaceJjwxcCharacter(fontName, $node.html());
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

            var Q = unsafeWindow.Q;

            // 计算上一章节下一章节
            function calPages() {
                var json = Q.bookBigData.json;
                var bookId = Q.bookid;

                for (var i=0, c; c = json.list[i]; i++) {
                    if (c == Q.chapterid) {
                        var prevChapter = (0 === i ? null : json.list[i - 1]);
                        var nextChapter = (i + 1 < json.list.length ? json.list[i + 1] : null);

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
                    callback();
                });
            } else {
                calPages();
                callback();
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
              let html = $(this).html();
              $(this).replaceWith(
                  $('<p>').html(html)
              );
          });
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
                              var _0x4089d1 = plainText.slice(_0x2fd6ee, Math.min(_0x2fd6ee + 9, _0x1c7c70));
                              _0x9fd207.push(parseInt(_0x4089d1).toString(16));
                          }
                          return ['3', _0x9fd207]
                      }
                      for (var _0x4b46c9 = '', _0x1f2538 = 0; _0x1f2538 < plainText.length; _0x1f2538++)
                          _0x4b46c9 += plainText.charCodeAt(_0x1f2538).toString(16);
                      return ['4', [_0x4b46c9]]
                  })(plainText)
              ;(_0xf208b6 += _0x2045c1[0]), (_0xf208b6 += 2 + md5Hash.substr(md5Hash.length - 2, 2));
              for (var _0x59bebd = _0x2045c1[1], _0x1aafd3 = 0; _0x1aafd3 < _0x59bebd.length; _0x1aafd3++) {
                  var _0x1af4ac = _0x59bebd[_0x1aafd3].length.toString(16);
                  1 === _0x1af4ac.length && (_0x1af4ac = '0' + _0x1af4ac),
                      (_0xf208b6 += _0x1af4ac),
                      (_0xf208b6 += _0x59bebd[_0x1aafd3]),
                      _0x1aafd3 < _0x59bebd.length - 1 && (_0xf208b6 += 'g');
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
                  var _0x436006 = parseInt(encodedText.substr(_0x2bf2ee, 2), 16);
                  if (_0x2bf2ee + 2 + _0x436006 > _0x23fa2c) return ''
                  var _0x3f72db = encodedText.substr(_0x2bf2ee + 2, _0x436006),
                      _0x41cdae = '';
                  if ('3' === _0x25eace) {
                      var _0x3c987c = parseInt(_0x3f72db, 16);
                      if (isNaN(_0x3c987c)) return ''
                      _0x41cdae = '' + _0x3c987c;
                  } else
                      for (var _0x293868 = 0, _0x14b43a = _0x3f72db.length; _0x293868 < _0x14b43a; _0x293868 += 2) {
                          var _0x4f2610 = parseInt(_0x3f72db.substr(_0x293868, 2), 16);
                          _0x41cdae += String.fromCharCode(_0x4f2610);
                      }
  (_0xb4db26 += _0x41cdae), (_0x2bf2ee = _0x2bf2ee + 2 + _0x436006);
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
              const res = await Request(reqObj);
              var text = res.responseText;
              this.__weReadJson = JSON.parse(getMiddleStr(text, 'window.__INITIAL_STATE__=', ';'));
          }

          var chapterList = this.__weReadJson.reader.chapterInfos;

          const re = /\/web\/reader\/([0-9a-f]+)k?([0-9a-f]+)?/g;
          const matchs = [...this.curPageUrl.matchAll(re)];
          let bookId,
              chapterUid = null;
          if (matchs) {
              bookId = decode(matchs[0][1]);
              if (matchs[0].length === 3) {
                  chapterUid = parseInt(decode(matchs[0][2]));
              }
          }

          var currentChapter = chapterList.find(e => e.chapterUid === chapterUid);

          var { chapterIdx } = currentChapter || { chapterIdx: 1 };

          var nextUrl, prevUrl, indexUrl;

          indexUrl = '/web/reader/' + encode(bookId);

          if (chapterIdx === chapterList.length) {
              nextUrl = '';
          } else {
              var nextChapterUid = chapterList[chapterIdx].chapterUid;
              nextUrl = indexUrl + 'k' + encode(nextChapterUid);
          }

          if (chapterUid && chapterUid > 1) {
              var prevChapterUid = chapterList[chapterIdx - 2].chapterUid;
              prevUrl = indexUrl + 'k' + encode(prevChapterUid);
          } else {
              prevUrl = '';
          }

          var dataUrls = [];

          $doc.find('.wr_canvasContainer canvas').each(function () {
              dataUrls.push(this.toDataURL());
              $(this).remove();
          });

          var $body = $doc.find('body');
          if (nextUrl) {
              // 加上一页链接
              $('<div id="nextchapter">').attr('href', nextUrl).appendTo($body);
          }
          if (prevUrl) {
              // 加下一页链接
              $('<div id="prevchapter">').attr('href', prevUrl).appendTo($body);
          }
          // 目录
          $('<div id="bookindex">目录</div>').attr('href', indexUrl).appendTo($body);
          // 正文
          var $container = $doc.find('.wr_canvasContainer');
          for (const dataUrl of dataUrls) {
              $('<img>').attr('src', dataUrl).appendTo($container);
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
              $doc.find('p').remove();
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
          useSiteFont: true,

      },

      {siteName: '铅笔小说',
          url: 'https?://www.23qb.com/book/\\d+/\\d+(?:_\\d+)?.html',
          exampleUrl: 'https://www.23qb.com/book/187203/70954846.html',

          contentPatch($doc) {
              const re = toRE("\\{url_previous:'(.*?)',url_next:'(.*?)',url_index:'(.*?)',\\}");
              const ReadParams = $doc.find('script:contains(ReadParams)').text();
              const [_, url_previous, url_next, url_index] = re.exec(ReadParams);
              let previousName = $doc.find('#readbg > p > a:nth-child(1)').text();
              switch (previousName) {
                  case '<-':
                      previousName = '上一页';
                      break;
                  case '<<':
                      previousName = '上一章';
                      break;
              }
              let nextName = $doc.find('#readbg > p > a:nth-child(5)').text();
              switch (nextName) {
                  case '->':
                      nextName = '下一页';
                      break;
                  case '>>':
                      nextName = '下一章';
                      break;
              }
              const body = $doc.find('body');

              $doc.find('p:contains(（继续下一页）)').remove();

              $('<a>').attr('href', url_previous).text(previousName).appendTo(body);
              $('<a>').attr('href', url_next).text(nextName).appendTo(body);
              $('<a>').attr('href', url_index).text('目录').appendTo(body);

          },
          contentReplace: ['铅笔小说 23qb.com']
      },

      {siteName: '爱尚小说',
          url: 'https://www.asxs.com/view/\\d+/\\d+.html',
          exampleUrl: 'https://www.asxs.com/view/174811/2330811.html',

          noSection: true

      }

  ];

  // ===== 小说拼音字、屏蔽字修复 =====
  // 运行在未替换 <br> 之前，.* 可能会造成全部替换
  const replace = {
    // ===格式整理===
    // "\\(|\\[|\\{|（|【|｛":"（",
    // "\\)|\\]|\\}|）|】|｝":"）",

    // 需要？
    //",\\s*": "，",
    // ":": "：", "\\?":"？",  // 会造成起点的图片无法替换

    "\\*|＊": "*",
    "[wWｗＷ]{3}": "www",
    "w{3}(\u3001|\u3002)": "www.",
    "[cCｃＣ][oOｏＯ][mMｍＭ]": "com",
    "[nNｎＮ][eｅEＥ][tｔTＴ]": "net",
    "[cCｃＣ][nNｎＮ]": "cn",
    "(\\.|\u3001|\u3002)com": ".com",
    "(\\.|\u3001|\u3002)net": ".net",
    "(\\.|\u3001|\u3002)cn": ".cn",
    "[pPｐＰ][sSｓＳ][:：]": "ps:",
    // "。{5,7}": "……", "~{2,50}": "——", "…{3,40}": "……", "－{3,20}": "——",
    //"。(,|，|。)": "。",
    // "？(,|，)": "？",
    //"”(,|，|。)": "”",
    "@{3,}": "",

    // === 段末的多余的r ===
    "\\\\r<br>": "<br>",

    // === 一些特殊的替换 ===
    "\\[+CP.*(http://file.*\\.jpg)\\]+": "<img src='$1'>",
    // "『(.)』": "$1",  // "『色』": "色",

    // === 去广告 ===
    "\\[搜索最新更新尽在[a-z\\.]+\\]": "",
    "<a>手机用户请到m.qidian.com阅读。</a>": "",
    ".{2,4}中文网欢迎广大书友": "",
    // "访问下载txt小说|◎雲來閣免费万本m.yunlaige.com◎": "",
    // "〖∷更新快∷无弹窗∷纯文字∷.*?〗": "",
    // '超快稳定更新小说[,，]': '', "本文由　。。　首发": "",
    // '”小说“小说章节更新最快': '',
    '如果觉得好看，请把本站网址推荐给您的朋友吧！': '',
    '本站手机网址：&nbsp;&nbsp;请互相通知向您QQ群【微博/微信】论坛贴吧推荐宣传介绍!': '',
    // "fqXSw\\.com": "", "\\.5ｄｕ|\\.５du５\\.": "",
    // "\\[\\]": "",
    // "如果您觉得网不错就多多分享本站谢谢各位读者的支持": "",
    // "全文字无广告|\\(看书窝&nbsp;看书窝&nbsp;无弹窗全文阅读\\)": "",
    // "。。+[\\s　]*看最新最全小说": "",
    "水印广告测试": "",
    // "\\(平南文学网\\)": "", "讀蕶蕶尐說網": "",
    // "比奇提示：如何快速搜自己要找的书籍": "", "《百度书名\\+比奇》即可快速直达": "",
    // "~无~错~小~说": "",

    "\\(一秒记住小说界\\）|\\*一秒记住\\*": "",
    // "uutxt\\.org|3vbook\\.cn|www\\.qbwx\\.com|WWw\\.YaNkuai\\.com|www\\.btzw\\.com|www\\.23uS\\.com": "",
    // "txt53712/": "",
    "\xa0{4,12}": "\xa0\xa0\xa0\xa0\xa0\xa0\xa0",

    // === 通用去广告
    // "[wｗＷ]{1,3}[．\\.]２３ｕＳ[．\\.](?:ｃｏＭ|com)": "",

    // === 星号屏蔽字还原 ===
    // === 八九 ===
    "十有(\\*{2})": "十有八九",
    "十有bā'九": "十有八九",
    "(\\*{2})不离十": "八九不离十",
    "(\\*{2})点": "八九点",
    "(\\*{2})个": "八九个",
    "(\\*{2})岁": "八九岁",
    "(\\*{2})成": "八九成",
    "(\\*{2})年": "八九年",
    "一八(\\*{2})": "一八八九",

    // === SM ===
    "G(\\*{2})": "GSM",

    // === 情色 ===
    "感(\\*{2})彩": "感情色彩",

    // === 大法 ===
    "强(\\*{2})u5B9D": "强大法宝",
    "强(\\*{2})宝": "强大法宝",
    "种魔(\\*{2})": "种魔大法",
    "巨(\\*{2})": "巨大法",
    "强(\\*{2})术": "强大法术",
    "(\\*{2})师": "大法师",

    // === 肉体 ===
    "(\\*{2})凡胎": "肉体凡胎",
    "夺取她的(\\*{2})": "夺取她的肉体",
    "夺取他的(\\*{2})": "夺取他的肉体",
    "(\\*{2})与精神": "肉体与精神",
    "(\\*{2})素材": "肉体素材",
    "(\\*{2})材料": "肉体材料",
    "在(\\*{2})上": "在肉体上",

    // === 赤裸 ===
    "(\\*{4})着": "赤裸着",
    "(\\*{2})裸": "赤裸裸",
    "浑身(\\*{2})": "浑身赤裸",

    // === 射 ===
    "枪(\\*{4})": "枪发射",
    "(\\*{4})而出": "喷射而出",
    "光(\\*{2})": "光四射",

    // === 鱼水 ===
    "(\\*{2})之欢": "鱼水之欢",

    // === 国军 ===
    "(\\*{2})队": "国军队",
    "(\\*{2})舰": "国军舰",
    "(\\*{2})方": "国军方",

    // === 露阴 ===
    "暴(\\*{2})谋": "暴露阴谋",

    // === 欲望 ===
    "的(\\*{2})是无止境的": "的欲望是无止境的",
    "邪恶的(\\*{2})": "邪恶的欲望",
    "被(\\*{2})支配": "被欲望支配",
    "掀桌的(\\*{2})": "掀桌的欲望",
    "控制不住(\\*{2})": "控制不住欲望",
    "求生的(\\*{2})": "求生的欲望",
    "求生(\\*{2})": "求生欲望",
    "购买(\\*{2})": "购买欲望",
    "永无止境的(\\*{2})": "永无止境的欲望",
    "(\\*{2})的发泄": "欲望的发泄",
    "发泄(\\*{2})": "发泄欲望",
    "杀戮(\\*{2})": "杀戮欲望",
    "(\\*{2})和本能": "欲望和本能",

    // === 呻吟 ===
    "不堪重负的(\\*{2})": "不堪重负的呻吟",
    "(\\*{2})声": "呻吟声",
    "颤抖(\\*{2})": "颤抖呻吟",
    "(\\*{2})颤抖": "呻吟颤抖",

    // === 独立 ===
    "宣布(\\*{2})": "宣布独立",
    "(\\*{2})空间": "独立空间",

    // === 荡漾 ===
    "波纹(\\*{2})": "波纹荡漾",

    // === 喘息 ===
    "(\\*{2})之机": "喘息之机",

    // === 大波 ===
    "一(\\*{2})": "一大波",

    // === 上供 ===
    "(\\*{2})奉": "上供奉",

    // === 奸淫 ===
    "(\\*{2})掳掠": "奸淫掳掠",

    // === 失身 ===
    "有(\\*{2})份": "有失身份",

    // === 六合 ===
    "(\\*{2})八荒": "六合八荒",

    // === 人祸 ===
    "天灾(\\*{2})": "天灾人祸",

    // === 轮红 ===
    "一(\\*{2})日": "一轮红日",

    // === 西藏 ===
    "东躲(\\*{2})": "东躲西藏",

    // === 被操 ===
    "(\\*{2})纵": "被操纵",

    // === 穷屌 ===
    "(\\*{2})丝": "穷屌丝",

    // === 销魂 ===
    "(\\*{2})滋味": "销魂滋味",

    // === 色水 ===
    "血(\\*{2})晶": "血色水晶",

    // === 偷用 ===
    "偷(\\*{2})": "偷偷用",

    // === 乳交 ===
    "水(\\*{2})融": "水乳交融",


    // === 多字替换 ===
    "cao之过急": "操之过急", "chunguang大泄": "春光大泄",
    "大公无si": "大公无私",
    "fu道人家": "妇道人家", "放sōng'xià来": "放松下来",
    "奸yin掳掠": "奸淫掳掠",
    "空dangdang": "空荡荡",
    "突发qing况": "突发情况",
    "yin奉阳违": "阴奉阳违", "一yin一阳": "一阴一阳",

    // === 双字替换 ===
    "暧m[eè][iì]":"暧昧",
    "bàn\\s*fǎ":"办法", "bucuo":"不错", "不liáng":"不良", "b[ěe]i(\\s|&nbsp;)*j[īi]ng":"北京", "bǐ\\s*shǒu":"匕首", "半shen":"半身", "b[ìi]j[ìi]ng":"毕竟", "报(了?)jing":"报$1警", "bèi'pò":"被迫", "包yǎng":"包养", "(?:biǎo|婊\\\\?)子":"婊子", "biǎo\\s*xiàn\\s*":"表现",
    "chifan":"吃饭", "ch[oō]ngd[oò]ng":"冲动", "chong物":"宠物", "cao(练|作)":"操$1", "出gui":"出轨", "chu\\s*xian":"出现", "缠mian":"缠绵", "成shu":"成熟", "(?:赤|chi)\\s*lu[oǒ]":"赤裸", "春guang":"春光", "chun风":"春风", "chuang伴":"床伴", "沉mi":"沉迷", "沉lun":"沉沦", "刺ji":"刺激", "chao红":"潮红", "初chun":"初春", "＂ｃｈｉ\\s*ｌｕｏ＂":"赤裸", "cí\\s*zhí":"辞职",
    "dān\\s*xīn":"当心", "dang校":"党校", "da子":"鞑子", "大tui":"大腿", "dǎ\\s*suàn":"打算", "dá\\s*àn":"答案", "dài\\s*lǐ":"代理", "dengdai":"等待", "电huà":"电话", "diàn\\s*huà":"电话", "diàn\\s*yǐng":"电影", "diao丝":"屌丝", "d[úu](?:\\s|&nbsp;|<br/>)*l[ìi]":"独立", "d[uú]\\s{0,2}c[áa]i":"独裁", "d?[iì]f[āa]ng":"地方", "d[ìi]\\s*d[ūu]":"帝都", "di国|帝guo":"帝国", "du[oò]落":"堕落", "坠luò":"坠落",
    "f[ǎa]ngf[óo]":"仿佛", "fei踢":"飞踢", "fēi\\s*wén":"飞吻", "feng流":"风流", "风liu":"风流", "f[èe]nn[ùu]":"愤怒", "fǎn\\s*yīng":"反应", "fú\\s*wù":"服务", "fù\\s*chóu":"复仇",
    "gao潮":"高潮", "高氵朝":"高潮", "gāo\\s*xìng\\s*":"高兴", "干chai":"干柴", "勾yin":"勾引", "gu[oò]ch[ée]ng":"过程", "gu[āa]n\\s*x[iì]":"关系", "官\\s*fāng":"官方", "g[ǎa]nji[àa]o":"感觉", "国wu院":"国务院", "gù\\s*yì\\s*":"故意", "guofen":"过分", "guān\\s*fāng":"官方",
    "hā\\s*hā\\s*":"哈哈", "h[aǎ]ode":"好的", "hù士":"护士", "火qiang":"火枪", "huó\\s*dòng":"活动", "há'guó":"韩国", "han住":"含住", "hai洛因":"海洛因", "红fen":"红粉", "火yao":"火药", "h[ǎa]oxi[àa]ng":"好像", "hu[áa]ngs[èe]":"黄色", "皇d[ìi]":"皇帝", "昏昏yu睡":"昏昏欲睡", "回dang":"回荡", "huí\\s*qù\\s*":"回去", "hé\\s*shì\\s*":"合适", "hàn\\s*jiān":"汉奸",
    "jian(臣|细)":"奸$1", "奸yin":"奸淫", "jiànmiàn":"见面", "jian货":"贱货", "jing察":"警察", "jǐng\\s*chá":"警察", "j[ìi]nháng":"进行", "jīng\\s*guò":"经过", "ji烈":"激烈", "j[iì](nv|女)":"妓女", "jirou":"鸡肉", "ji者":"记者", "jì\\s*xù\\s*":"继续", "ju花":"菊花", "j[īi]动":"激动", "jili[èe]":"激烈", "肌r[òo]u":"肌肉", "ji射":"激射", "ji[ēe]ch[uù]":"接触", "jiù\\s*shì":"就是", "j[ùu]li[èe]":"剧烈", "jǐng惕":"警惕", "节cao":"节操", "浸yin":"浸淫", "jù\\s*jué\\s*":"拒绝", "jue色":"角色",
    "k[ěe]n[ée]ng":"可能", "开bao":"开苞", "k[àa]o近":"靠近", "口wen":"口吻", "kankan":"看看",
    "ling辱":"凌辱", "luan蛋":"卵蛋", "脸sè":"脸色", "lu出":"露出", "流máng":"流氓", "lun理":"伦理", "lì\\s*qì":"力气", "lán\\s*jié":"拦截", "lìng\\s*lèi":"另类", "lè\\s*suǒ":"勒索", "lòudòng":"漏洞",
    "m[ǎa]ny[ìi]":"满意", "m[ǎa]sh[àa]ng":"马上", "m[ée]iy[oǒ]u":"没有", "mei国":"美国", "měi\\s*nǚ":"美女", "mèi\\s*mèi":"妹妹", "m[íi]ngb[áa]i":"明白", "迷huan":"迷幻", "mi茫":"迷茫", "mó\\s*yàng":"模样", "m[íi]n\\s{0,2}zh[ǔu]":"民主", "迷jian":"迷奸", "mimi糊糊":"迷迷糊糊", "mì\\s*shū":"秘书", "末(?:\\s|<br/?>)*ì":"末日", "面se":"面色", "mengmeng":"蒙蒙", "màn\\s*huà":"漫画",
    "nàme":"那么", "n[ǎa]o\\s*d[àa]i":"脑袋", "n[ée]ngg[oò]u":"能够", "nán\\s{0,2}hǎi":"那会", "内jian":"内奸", "[内內]y[iī]":"内衣", "内ku":"内裤",
    "pi[áa]o客":"嫖客", "p[áa]ngbi[āa]n":"旁边",
    "q[íi]gu[àa]i":"奇怪", "qì\\s*chē":"汽车", "qing\\s*(ren|人)":"情人", "qin兽":"禽兽", "q[iī]ngch[uǔ]":"清楚", "què\\s*dìng":"确定", "球mi":"球迷", "青chun":"青春", "青lou":"青楼", "qingkuang":"情况", "qiang[　\\s]*jian":"强奸",
    "re\\s*nao":"热闹", "r[úu]gu[oǒ]":"如果", "r[oó]ngy[ìi]":"容易", "ru(房|白色)":"乳$1", "rén员":"人员", "rén形":"人形", "人chao":"人潮", "renmen":"人名", "ruǎn\\s*jiàn":"软件", "rì\\s*běn":"日本", "日\\s*běn":"日本",
    "shàng\\s*mén":"上门", "上jiang":"上将", "she(门|术|手|程|击)":"射$1", "sudu":"速度", "shú\\s*nǚ":"熟女", "shuijue":"睡觉", "shide":"是的", "sh[iì]ji[eè]":"世界", "sh[ií]ji[aā]n":"时间", "sh[ií]h[oò]u":"时候", "sh[ií]me":"什么", "si人":"私人", "shi女":"侍女", "shi身":"失身", "sh[ūu]j[ìi]":"书记", "shu女":"熟女", "shu[　\\s]?xiong":"酥胸", "(?:上|shang)chuang":"上床", "shǒu\\s*jī":"手机", "呻y[íi]n":"呻吟", "sh[ēe]ngzh[íi]":"生殖", "深gu":"深谷", "双xiu":"双修", "生r[ìi]":"生日", "si盐":"私盐", "shi卫":"侍卫", "si下":"私下", "sao扰":"骚扰", "ｓｈｕａｎｇ\\s*ｆｅｎｇ":"双峰", "shǎo\\s*fù":"少妇", "shì\\s*pín":"视频", "shè\\s*xiàng":"摄像",
    "t[uū]r[áa]n":"突然", "tiaojiao":"调教", "tí\\s*gòng":"提供", "偷qing":"偷情", "推dao":"推倒", "脱guang":"脱光", "t[èe]bi[ée]":"特别", "t[ōo]nggu[òo]":"通过", "同ju":"同居", "tian来tian去":"舔来舔去",
    "w[ēe]ixi[ée]":"威胁", "wèizh[ìi]":"位置", "wei员":"委员", "w[èe]nti":"问题", "wèi\\s*dào\\s*":"味道", "wú\\s*nài":"无奈", "wǔ\\s*qì":"武器",  "weilai":"未来",
    "xiu长":"修长", "亵du":"亵渎", "xing福":"幸福", "xìng\\s*yùn":"幸运", "小bo":"小波", "小niū":"小妞", "xiong([^a-z])":"胸$1", "小tui":"小腿", "xiang港":"香港", "xiàohuà":"笑话", "xiāo\\s*shòu":"销售", "xiàn\\'zhì":"限制", "xiàn\\s*jīn":"现金", "xiāng\\s*zǐ":"箱子", "xiōng\\s*dì":"兄弟", "选zé":"选择", "xìn\\s*hào":"信号", "xìng\\s*gǎn":"性感", "xiǎo\\s*jiě":"小姐", "xìn\\s*hào":"信号", "xià\\s*zhù":"下注",
    "yì\\s*wài\\s*":"意外", "yin(冷|暗|谋|险|沉|沟|癸派|后)":"阴$1", "y[iī]y[àa]ng":"一样", "y[īi]di[ǎa]n":"一点", "yī\\s*zhèn":"一阵", "y[ǐi]j[īi]ng":"已经", "疑huo":"疑惑", "yí\\s*huò":"疑惑", "影mi":"影迷", "yin荡":"淫荡", "yin贼":"淫贼", "阳w[ěe]i":"阳痿", "yao头":"摇头", "yaotou":"摇头", "摇tou":"摇头", "yezhan":"野战", "you饵":"诱饵", "(?:you|诱)(?:惑|huo)":"诱惑", "you导":"诱导", "引you":"引诱", "you人":"诱人", "youshi":"有事", "you\\s*xiu":"优秀", "御yòng":"御用", "旖ni":"旖旎", "yu念":"欲念", "you敌深入":"诱敌深入", "影she":"影射", "牙qian":"牙签", "一yè情":"一夜情", "yīng\\s*yǔ":"英语",
    "z[iì]j[iǐ]":"自己", "z[ìi](?:\\s|<br/?>|&nbsp;)*y[oó]u":"自由", "zh[iī]d?[àa]u?o":"知道", "zixin":"自信", "zhì'fú":"制服", "zhì\\s*fú":"制服", "zha药":"炸药", "zhan有":"占有", "zhào\\s*piàn":"照片", "zhè\\s*gè":"这个", "政f[ǔu]|zheng府":"政府", "zh[èe]ng\\s{0,2}f[uǔ]":"政府", "zong理":"总理", "zh[ōo]ngy[āa]ng":"中央", "中yang":"中央", "zu[oǒ]\\s*y[oò]u":"左右", "zhǔ\\s*dòng":"主动", "zh[oō]uw[ée]i":"周围", "zhōu\\s*nián":"周年", "中nan海":"中南海", "中j委":"中纪委", "中zu部":"中组部", "政zhi局":"政治局", "(昨|一|时|余)(?:<br/?>|&nbsp;|\\s)*ì":"$1日", "照she":"照射", "zhǔn\\s*bèi\\s*":"准备", "zhu义":"主义",

    "</p>\\n<p>\\s*ì":"日",

    '曹艹': '曹操',
    'JI昂': '激昂',
    '□□无暇': '自顾无暇',
    '法律/界': '法律界',
    '人/类': '人类',
    '恐怖/主义': '恐怖主义',
    '颠/覆': '颠覆',
    '民.事.司.法.裁.判': '民事司法裁判',
    '南海/问题': '南海问题',
    '圈圈/功': '法轮功',
    '镇/压': '镇压',
    '赤.裸': '赤裸',
    '欲·望': '欲望',
    'nv真': '女真',
    '土gai': '土改',
    '狗·屎': '狗屎',
    'du立': '独立',
    '发sao': '发骚',
    '奸/夫/淫/妇': '奸夫淫妇',
    '爱qing': '爱情',
    '抚mo': '抚摸',
    '神qing': '神情',
    '公~务~员': '公务员',
    '原着': '原著',
    '□□部分': '高潮部分',
    '角□□面': '角色情面',
    '艹': '操',
    '淫/靡/香/艳': '淫靡香艳',
    '毒丨药': '毒药',
    '登6': '登陆',
    '天□□美': '天性爱美',
    '双丨飞': '双飞',
    '高chao': '高潮',
    'pi股': '屁股',
    '情/趣': '情趣',
    '情/欲': '情欲',
    '炸/弹': '炸弹',
    '赤/身': '赤身',
    '果/体': '裸体',
    'zhong国': '中国',
    '帝国#主义': '帝国主义',
    '形形□□': '形形色色',
    'yuwang': '欲望',
    'shuangtui': '双腿',
    '城／管': '城管',
    '调丨教': '调教',
    '银/行/卡': '银行卡',
    '裸/体': '裸体',
    '光/裸': '光裸',
    '嫩/女': '嫩女',
    '维/谷': '维谷',
    '开□□谈': '开始交谈',
    '破碎的□□': '破碎的呻吟',
    'pi霜': '砒霜',
    'ma醉': '麻醉',
    '麻zui': '麻醉',
    'nue杀': '虐杀',
    '后gong': '后宫',
    '林荫dao': '林荫道',
    '分/身': '分身',
    '克/隆': '克隆',
    '性/需要': '性需要',
    '黑/帮': '黑帮',
    '政-府': '政府',
    '八/九': '八九',
    '不～着~寸～缕': '不着寸缕',
    '肉~体': '肉体',
    '蹲□子': '蹲下身子',
    'ji情': '激情',
    'xie恶': '邪恶',
    'Z国': '中国',
    '创/世': '创世',
    '紫jin城': '紫禁城',
    '□□在外': '裸露在外',
    '光怪6离': '光怪陆离',
    '邪/教': '邪教',
    '粗bao': '粗暴',
    'yin邪': '淫邪',
    '小biao砸': '小婊砸',

    '牛1b': '牛b', '微1博': '微博', '内1衣': '内衣',

    '虫\\*{2}流': '虫族交流', '合成\\*{2}流': '合成兽交流',
    '东XZ': '东西藏', '东躲XZ': '东躲西藏',
    '幸苦': '辛苦', '就就给': '就交给', 
    'DU犯': '毒贩', '网络招piao': '网络招嫖', 
    '犯du': '贩毒', 
    'ZZ秩序': '政治秩序',
    '(市|世界|国)ZF': '$1政府',
    'Z-F': '政府',
    'GS勾结': '官商勾结',
    '高级GY': '高级官员',
    'guo家': '国家',
    '加na大': '加拿大',
    'jian杀': '奸杀',
    '火jian弹': '火箭弹',
    'zha弹': '炸弹',
    'GW员': '公务员',
    'jun火': '军火',
    '外jun': '外军',
    'JDZ瓷器': '景德镇瓷器',
    'zz正确': '政治正确',
    'WJ特战': '武警特战',
    '\\*{2}手': '兽交手',
    '[÷➗]生CH': '畜生策划',

    '[AM霉]国': '美国',
    '[CZ]国': '中国',
    '[JR]国': '日本',
    'E国': '俄国',
    '[BY]国': '英国',
    'F国': '法国',
    'D国': '德国',

    '迸\\*{2}光': '迸射精光',
    '十之八\\*' : '十之八九',

    '\\.asxs\\.': '起点',
    
  };

  const r = String.raw;

  const replaceAll = [
    // 长文字替换
    // 排序代码：newArr = arr.sort((a, b) => { var diff = a.charCodeAt(1) - b.charCodeAt(1); if (diff == 0) return b.length - a.length; return diff; })
    '本站域名已经更换为.*，老域名(?:已经|即将)停用，请大家重新收藏，并使用新域名访问。',
    // "\\(跪求订阅、打赏、催更票、月票、鲜花的支持!\\)",
    // "\\(?未完待续请搜索飄天文學，小说更好更新更快!",
    // "\\(跪求订阅、打赏、催更票、月票、鲜花的支持!",
    // "狂沙文学网 www.kuangsha.net",
    // "\\(看小说到网\\)",
    "\\(未完待续。\\)",
    "\\(本章完\\)",
    // "16977小游戏每天更新好玩的小游戏，等你来发现！",
    // "（800小说网 www.800Book.net 提供Txt免费下载）最新章节全文阅读-..-",
    // "（800小说网 www.800Book.net 提供Txt免费下载）",
    // "\\[800\\]\\[站页面清爽，广告少，",
    // "\\[看本书最新章节请到求书 .\\]",
    // "（\\s*君子聚义堂）",
    // "readx;",
    // "txt电子书下载/",
    // "txt全集下载",
    // "txt小说下载",
    // "\\|优\\|优\\|小\\|说\\|更\\|新\\|最\\|快\\|www.uuxs.cc\\|",
    // "\\|每两个看言情的人当中，就有一个注册过可°乐°小°说°网的账号。",
    // "思ˊ路ˋ客，更新最快的！",
    // "恋上你看书网 630bookla ，最快更新.*",
    "[，,]举报后维护人员会在两分钟内校正章节内容[，,]请耐心等待[，,]并刷新页面。",
    // "追书必备",
    // "-优－优－小－说－更－新－最－快-www.ＵＵＸＳ.ＣＣ-",
    // "-优－优－小－说－更－新－最－快x",
    // "来可乐网看小说",
    // "纯文字在线阅读本站域名手机同步阅读请访问",
    // "本文由　　首发",
    // "樂文小说",
    // '最快更新无错小说阅读，请访问 请收藏本站阅读最新小说!',
    // "最新章节全文阅读看书神器\\.yankuai\\.",
    // "最新章节全文阅读（..首发）",
    // "最新章节全文阅读【首发】",
    // "最新章节全文阅读",
    // "看本书最新章节请到800小说网（www.800book.net）",
    "（本章未完，请翻页）",
    // "手机用户请浏览m.biqugezw.com阅读，更优质的阅读体验。",
    // "手机用户请浏览阅读，更优质的阅读体验。",
    // "阅读，更优质的阅读体验。",
    // "手机最省流量无广告的站点。",
    // "手机看小说哪家强手机阅",
    // "如果你喜欢本站[〖]?一定要记住[】]?(?:网址|地址)哦",
    // "看清爽的小说就到",
    // "请用搜索引擎(?:搜索关键词)?.*?完美破防盗章节，各种小说任你观看",
    // "完美破防盗章节，请用搜索引擎各种小说任你观看",
    // "破防盗章节，请用搜索引擎各种小说任你观看",
    // "(?:搜索引擎)?各种小说任你观看，破防盗章节",
    "章节错误，点此举报\\(免注册\\)",
    // "热门小说最新章节全文阅读.。 更新好快。",
    // "【阅读本书最新章节，请搜索800】",
    // "亲，百度搜索眼&amp;快，大量小说免费看。",
    // "亲，眼&快，大量小说免费看。",
    // '下载免费阅读器!!',
    // '笔趣阁&nbsp;.，最快更新.*最新章节！',
    // '请大家搜索（书迷楼）看最全！更新最快的小说',
    // '更新快无广告。',
    // '【鳳.{1,2}凰.{1,2}小说网 更新快 无弹窗 请搜索f.h.xiao.shuo.c.o.m】',
    // '【可换源APP看书软件：书掌柜APP或直接访问官方网站shuzh.net】',
    // '[●★▲]手机下载APP看书神器.*',
    // "m.?手机最省流量的站点。",
    // 'm.?手机最省流量.无广告的站点。',
    // '底部字链推广位',
    // 'us最快',
    // 'APPapp',
    // '久看中文网首发',
    // '顶点小说 ２３ＵＳ．com更新最快',
    '7017k',
    '没有弹窗,更新及时 !',
    '如果你还没注册会员就先注册个会员吧，使用书架书签更方便哦。',
    '内容更新后，请重新刷新页面，即可获取最新更新！',
    '如果此章是作者求票之类废话的，请跳过继续看下一章',
    '提示：担心找不到本站？在也可以直接',
    '输入小说名可以少字但不要错字',
    '本网站提供的最新小说，电子书资源均系收集于网络，本网站只提供web页面服务，并不提供小资源存储，也不参与上传等服务。',
    '您可以按"CRTLD"将"傲宇阁"加入收藏夹！方便下次阅读。',
    '我是超级大美女，每天要美美的，做个精致的女人，让我身边的每个人感受到我的美丽！详情搜索微信公众号我是超级大美女或者复制微信号meinv92k扫描下面二维码快速加入！',
    '温馨提示：按回车\\[Enter\\]键返回书目，按←键返回上一页，按→键进入下一页。',
    '手机阅读点这里',
    '手机阅读请访问',
    '&#x25B2;&#x624B;&#x673a;&#x4e0B;&#x8f7d;app&#x770B;&#x4e66;&#x795e;&#x5668;&#xff0c;&#x767e;&#x5ea6;&#x641c;&#x5173;&#x952e;&#x8Bcd;&#xff1a;&#x4e66;&#x638c;&#x67dc;app&#x6216;&#x76f4;&#x63a5;&#x8BBf;&#x95ee;&#x5B98;&#x65B9;&#x7f51;&#x7ad9;;#x25B2;',
    '亲,点击进去,给个好评呗,分数越高更新越快,据说给新打满分的最后都找到了漂亮的老婆哦!',
    '猫扑中文',
    '点击下载本站APP,海量小说，免费畅读！',
    ', 报送后维护人员会在两分钟内校正章节内容,请耐心等待。',
    '举报后请耐心等待,并刷新页面。',
    r`try\{mad1\('gad2'\);\} catch\(ex\)\{\}`,
    '：。：',
    '『加入书签，方便阅读』',
    r`本章节内容更新中\.\.\.`,
    '【本站首发，最快更新】',
    r`chaptererror\(\);`,

    '这候.*?章汜[。.]?',
    '强牺.*?读牺[。.]?',
    '制大.*?制枭[。.]?',
    
    // 复杂规则的替换
    // '(看小说到|爱玩爱看就来|就爱上|喜欢)?(\\s|<|>|&| |[+@＠=:;｀`%？》《〈︾-])?[乐樂](\\s|&lt;|&gt;|&amp;|&nbsp;|[+@＠=:;｀`%？》《〈︾-])?[文].*?[说說][网]?[|]?(.*(3w|[ｗωＷw]{1,3}|[Ｍm]).*[ｍＭm])?[}。\\s]?(乐文小说)?',
    // '(本文由|小说)?(\\s| )?((3w|[wＷｗ]{1,3}|[Ｍm]).)?\\s?[lしｌL][ｗωＷw][ｘχＸx][ｓＳs][５5][２2][０0].*[ｍＭm][|\\s]?(首发(哦亲)?)?',
    '([『【↑△↓＠︾]+[\u4E00-\u9FA5]){2,6}[】|]',
    /[ＵｕUu]+看书\s*www.[ＵｕUu]+[kｋ][aａ][nｎ][ｓs][hｈ][ＵｕUu].[cｃ][oｏ][mｍ]\s*/g,

    // 包含 \P 的替换
    '\\P{1,2}[顶頂].{1,3}[点小].*?o?[mw，]',
    '\\P.?长.{1,2}风.{1,2}文.{1,2}学.*?[tx]',
    '\\P无.错.*?[cＣ][oＯ][mＭ]',
    // '[;\\(]顶.{0,2}点.小说',
    // '2长2风2文2学，w￠＄',
    // '》长>风》',

    // 包含 .* 的，可能有多余的替换
    '看无防盗章节的小说，请用搜索引擎搜索关键词.*',
    '(?:完美)?破防盗章节，请用搜索引擎搜索关键词.*',
    '搜索引擎搜索关键词，各种任你观看，破防盗章节',
    // '.*搜索引擎搜索关键词.*',
    '破防盗完美章节，请用搜索引擎.*各种小说任你观看',
    // '如您已(?:閱讀|阅读)到此章节.*?敬请记住我们新的网址\\s*。',
    '如您已(?:閱讀|阅读)到此章[节節].*?(?:敬请记住我们新的网址|敬請記住我們新的網址).*',
    // '↗百度搜：.*?直达网址.*?↖',
    // "[:《〈｜~∨∟∑]{1,2}长.{1,2}风.*?et",
    '\\[限时抢购\\].*',
    '支持网站发展.逛淘宝买东西就从这里进.*',
    'ps[：:]想听到更多你们的声音，想收到更多你们的建议，现在就搜索微信公众号“qdread”并加关注，给.*?更多支持！',
    '(?:ps[:：])?看《.*?》背后的独家故事.*?告诉我吧！',
    '（?天上掉馅饼的好活动.*?微信公众号！）?',
    '（微信添加.*qdread微信公众号！）',
    // 'jiemei如您已阅读到此章节，请移步到.*?\\[ads:本站换新网址啦，速记方法：，.\\]',
    // '先给自己定个小目标：比如收藏笔趣阁.*',
    '请记住本书首发域名.*',
    '记住手机版网址.*',
    // '.*关注微信公众号.*',
    '天才一秒记住本站地址：.*?最快更新！无广告！',
    '先定个小目标，比如1秒记住：.*',
    '(?:天才)?一秒记住.*',
    '(?:天才)?1秒记住.*',
    '本章未完.*',
    '笔趣阁.*最快更新.*',
    '最新网址：.*?[ \\xa0\\u3000]',
    '最新网址：.*',
    '^先定个小目标，比如1秒记住： .*',
    '^热门推荐：.*',
    '^更新最快.*',
    '^.*请你先收藏此页吧，方便等下阅读咯……',
    '^.*更新中……努力更新中…….*',
    '^本站已更改域名，最新域名：.*',
    '^.*正在手打中，请稍等片刻[，。].*',
    '^.*全文字更新,牢记网址:.*',
    '^小说分类：.*',
    '^本书来源.*',
    '^本书来自.*',
    '新阅读网址：.*?，感謝支持，希望大家能支持一下手机网站：.*',
    '【本章节首发.*?,请记住网址（.*?）】.*',
    '\\[记住网址.*?\\]',
    '(?:8\\)|a)更多精彩小说，欢迎访问.*',
    '▲手机下载app看书神器，百度搜关键词：.*?或直接访问官方网站.*?▲',
    '手机用户看.*?请浏览.*?，更优质的用户体验。',
    '，最快更新.*?最新章节！',
    '推荐.*?大神.*?新书:.*',
    '^.*欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在.*',
    '^恋上你看书网.*',
    '(?:您可以在百度里搜索)?“.*?”查找最新章节！',
    '“.*?\\(.*?\\)”',
    '为了方便下次阅读，你可以在?点击下方的"收藏"记录本次（.*?）阅读记录，下次打开书架即可看到！',
    '(?:喜欢《.*?》)请向你的朋友（QQ、博客、微信等方式）推荐本书，谢谢您的支持！！',
    '^.*手机阅读地址.*',

    // '.*笔下文学更新速度最快.*',
    // '.*(?:下载)?爱阅(?:小说)?app.*?。(?:活动推广期间.*。)?',
    '为您提供.*最快更新',
    '喜欢.*?请大家收藏：\\(.*?\\).*?更新速度最快。',
    '《.*?》无错章节将持续在.*?更新.站内无任何广告.还请大家收藏和推荐.*?！.*?$',
    '注：如你看到本章节内容是防盗错误内容、本书断更等问题请登录后→→',
    '手机站全新改版升级地址：.*?，数据和书签与电脑站同步，无广告清新阅读！',
    '亲，本章已完，祝您阅读愉快！\\^0\\^',
    '第.*?章.*?免费阅读[.。]?',
    'Copyright.*?联系我们：.*',
    '^正文$',
    '.杂.志.虫.',
    '^作者：.*?分类：.*',
    '^@@\\?\\s*',
    '\\)(?: 下载免费阅读器)?!!$',
    '^txt下载地址：.*',
    '^.*手机版阅读网址：.*',
    '^(?:本书)?手机阅读：.*',
    '/txt/\\d+/',

    // 爱阅小说app广告
    '想要看最新章节内容，请下载爱阅小说app，无广告免费阅读最新章节内容。网站已经不更新最新章节内容，最新章节内容已经在爱阅小说APP更新。',
    '特大好消息,退出转码页面,下载爱阅小说app后，全部小说免广告看，还能优先看最新章节。活动推广期间，用户还可以免费领取礼包100块钱话费。',
    '下载爱阅app阅读完整内容，无广告无弹窗。',
    '看最新内容，请下载爱阅小说app阅读最新章节。',
    '网页版章节内容慢，请下载爱阅小说app阅读最新内容。?',
    '领取红包，请下载爱阅app免费看最新内容。',
    '网站即将关闭，下载爱阅app免费看最新内容。?',
    '请退出转码页面，请下载爱阅小说app 阅读最新章节。',
    '下载app爱阅小说免费看最新内容',
    '爱阅小说app',

    // 咪咪阅读app广告
    // '广个告，【\\咪\\咪\\阅读\\app\\mimiread\\】真心不错，值得装个，毕竟可以缓存看书，离线朗读！'
    // '插播一个app:完美复刻追书神器旧版本可换源的APP——咪咪阅读mimiread。'
    '广个告，【.*?】真心不错，值得装个，(?:毕竟可以缓存看书，离线朗读|竟然安卓苹果手机都支持|毕竟书源多，书籍全，更新快)！',
    '^(?:广个告|插一句)，我最近在用的小说app，【.*?】安卓苹果手机都支持！',
    '插播一个app: ?完美复刻追书神器旧版本可换源的APP.*?。',
    '【?推荐下，咪咪阅读追书真的好用，这里下载.*大家去快可以试试吧。】?',
    '【?话说，目前朗读听书最好用的.*?安装最新版。】?',
    '【讲真，最近一直用咪咪阅读看书追更，换源切换，朗读音色多， 安卓苹果均可。】',
    '插一句，【.*?】真心不错，值得装个，毕竟书源多，书籍全，快！',
    '插一句，我最近在用的(?:追|看)书.*?(?:缓存看书，离线朗读|书源多，书籍全，更新快)！',
    '推荐下，我最近在用的看书app，【.*?】书源多，书籍全，更新快！',
    '推荐下，【.*?】真心不错，值得书友都装个，安卓苹果手机都支持！',
    '求助下，【.*?】可以像偷菜一样的偷书票了，快来偷好友的书票投给我的书吧。',
    '【认识十年的老书友给我推荐的追书app，咪咪阅读！真特么好用，开车、睡前都靠这个朗读听书打发时间，这里可以下载.*?】',
    '书友们之前用的小书亭\\s*已经挂了，现在基本上都在用.*?。',
    '推荐一个app，媲美旧版追书神器，可换源书籍全的.*?！',
    '【告知书友，时代在变化，免费站点难以长存，手机app多书源站点切换看书大势所趋，站长给你推荐的这个咪咪阅读app，听书音色多、换源、找书都好使！】',
    '【告知苹果书友，以后能免费稳定看书的网站、app只会更少，站长推荐赶快安装一个专为苹果书友打造的听书，换源，找书都很棒的咪咪阅读，解决书荒不迷路！】',
    '【告知安卓书友，越来越多免费站点将会关闭失效，安卓app鱼目混珠，找一个安全稳定看书的app非常有必要，站长强烈推荐咪咪阅读，听书、换源、找书超好使！】',
    'mimiread',
    '咪咪阅读app',
    '【.*咪咪阅读.* 】',

    // 悠阅书城app广告
    '^【?(?:悠阅书城|悠閱書城).*',
    // '【悠阅书城APP，免费看小说全网无广告，IOS需海外苹果ID下载】',
    // '【悠閱書城一個免費看書的換源APP軟體，安卓手機需下載安裝，蘋果手機需登陸非中國大陸賬戶下載安裝】',
    // '【悠阅书城的換源app軟體，安卓手機需google 下載安裝，蘋果手機需登陸非中國大陸賬戶下載安裝】',
    // '【悠閱書城一個免費看書的換源APP軟體，安卓手機需Google 下載安裝，蘋果手機需登陸非中國大陸賬戶下載安裝】',
    // '【悠阅书城uc书盟的換源app軟體，安卓手機需下載安裝，蘋果手機需登陸非中國大陸賬戶下載安裝】',
    // '【悠阅书城小说的換源app軟體，安卓手機需google 下載安裝，蘋果手機需登陸非中國大陸賬戶下載安裝】',

    // 删除组合字符
    // https://en.wikipedia.org/wiki/Combining_character
    // '[\\u0300-\\u036F\\u1AB0-\\u1AFF\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F]',

    // 起点新广告
    '本.章.未.完.，.登.录.「.起.点.读.书.」.和.书.友.一.起.读.正.版.原.文.！.新.用.户.立.享.7.天.免.费.畅.读.，.快.来.试.试.吧.！.(?:（.新.设.备.新.账.号.可.享.）.)?',
    '本.章.未.完.，.登.錄.「.起.點.讀.書.」.和.書.友.一.起.讀.正.版.原.文.！.新.用.戶.立.享.7.天.免.費.暢.讀.，.快.來.試.試.吧.！.(?:（.新.設.備.新.賬.號.可.享.）.)?',



    // 短文字替换
    // '\\[txt全集下载\\]',
    // '\\[\\s*超多好看小说\\]',
    // '⊙四⊙五⊙中⊙文☆→',
    // '\\[ads:本站换新网址啦，速记方法：.*?\\]',
    // '[》《｜～]无(?:.|&gt;)错(?:.|&gt;)小说',
    // '`无`错`小说`www.``com', '＋无＋错＋小说＋3w＋＋',
    // '\\|优\\|优\\|小\\|说\\|更\\|新\\|最\\|快Ｘ',
    '▲∴', '8，ww←',
    // /www.23＋?[Ｗw][Ｘx].[Ｃc]om/ig,
    // /热门推荐:、+/g,
    // /h2&gt;/g,
    // '[《〈》>\\+｜～［\\]]无\\1错\\1', '》无>错》',

    // '女凤免费小说抢先看', '女凤小说网全文字 无广告',
    // '乐文小说网?', '《乐〈文《小说', '乐文移动网', '頂点小说', '頂點小說',
    // '追小说哪里快去眼快',
    // '\\[书库\\].\\[774\\]\\[buy\\].kuai',
    // 'www.938xs.com',
    // '小說，.biquge5200.',
    
    /'ads_wz_txt;',|百度搜索|无弹窗小说网|更新快无弹窗纯文字|高品质更新|小说章节更新最快|\(百度搜.\)|全文字手打|“”&nbsp;看|无.弹.窗.小.说.网|追书网|〖∷∷无弹窗∷纯文字∷ 〗/g,
    
    // '谷[婸秇鯪鐰愱瞻桮袁狲梋荬瑏鐲惗钲鉦鮪歄鎣刬頲櫦磆铩睎]',
    // '^谷[\\u4e00-\\u9fa5]{0,1}|谷[\\u4e00-\\u9fa5]{0,1}$',
    '谷.\\s*<?/span>?',
    '^谷[\\u4e00-\\u9fa5]$',
    '谷[\\u4e00-\\u9fa5]?$',

    // 低优先级替换
    ' https?://.*',
    '^.*\\(?https?://.*',
    '\\(\\)',
    '\\[\\]',
    '【】',
    '^[。？！.?!`|]',
    '^[…()]$'
    
  ];

  // import _ from 'underscore'

  // 单字替换，可能会误替换，所以需要特殊处理
  var oneWordReplace = {
    "b[āà]ng":"棒","bào":"爆","bà":"吧","bī":"逼","bō":"波", "biàn":"便",
    "cāo":"操", "cǎo":"草", "cào":"操", "chāng":"娼", "chang":"娼", "cháo":"潮", "chā":"插", "chéng":"成", "chōu":"抽", "chuáng":"床", "chún":"唇", "chūn":"春", "cuō":"搓", "cū":"粗",
    "dǎng":"党", "dàng":"荡", "dāo":"刀", "dòng":"洞", "diao":"屌", "diǎn":"点",
    "fǎ":"法", "féi":"肥", "fù":"妇",
    "guān":"官",
    "hán":"含", "hóu":"喉", "hòu":"后", "h(u)?ā":"花", "huá":"华", "huì":"会", "huò":"惑", "hùn":"混", "hún":"魂",
    "jiǔ":"九", "j[īi]ng":"精", "jìn":"禁", "jǐng":"警", "jiāng":"江", "jiān":"奸", "jiāo":"交", "jūn":"军", "jū":"拘", "jú":"局", "jī":"激", "激ān":"奸",
    "kù":"裤", "kàn":"看",
    "[1l]àng":"浪", "liáo":"撩", "liú":"流", "lì":"莉", "liè":"烈", "[1l]uàn":"乱", "lún":"伦", "luǒ":"裸", "lòu":"露", "[l1]ù":"露", "lǜ":"绿", "liàn":"练",
    "mǎi":"买", "mài":"卖", "máo":"毛", "mā":"妈", "méng":"蒙", "mén":"门", "miè":"灭", "mí":"迷", "mì":"蜜", "mō":"摸", "miàn":"面",
    "nǎi":"奶", "nèn":"嫩", "niào":"尿", "niē":"捏", "nòng":"弄", "nǚ":"女",
    "pào":"炮", "piàn":"片", "pò":"破",
    "qi[āa]ng":"枪", "qíng":"情", "qīn":"亲", "qiú":"求", "quán":"全", "qù":"去",
    "rén":"人", "r[ìi]":"日", "rǔ":"乳",

    // s
    "sǎ":"洒", "sāo":"骚", "sǎo":"骚", "sè":"色", "se":"色", "shā":"杀",
    "shēn":"身", "shēn":"呻",   // 2个重复的，误替换且是单字怎么办
    "shén":"神", "shè":"射", "shǐ":"屎", "shì":"侍", "sǐ":"死", "sī":"私", "shǔn":"吮", "sǔn":"吮", "sū":"酥", "shào":"绍",

    "tān":"贪", "tiǎn":"舔", "t[ǐi]ng":"挺", "tǐ":"体", "tǒng":"捅", "tōu":"偷", "tou":"偷", "tuǐ":"腿", "tūn":"吞", "tún":"臀", "tiáo":"调", "tài":"态", "tào":"套",
    "wēn":"温", "wěn":"吻",
    "xiǎo":"小", "xiào":"笑", "xìng":"性", "xing":"性", "xiōng":"胸", "xī":"吸", "xí":"习", "xì":"系", "xìn":"信", "xué":"穴", "xuè":"穴", "xùe":"穴",  "xuan":"宣", "xiàng":"象",
    "yāng":"央", "yàn":"艳", "yīn":"阴", "yào":"药", "yé":"爷", "yòu":"诱", "zàng":"脏", "y[ùu]":"欲", "yín":"淫", "yì":"意", "yà":"讶",
    "zhēn":"针", "zēn":"针", "zhà":"炸", "zhèng":"政", "zǒu":"走", "zuì":"罪", "zuò":"做", "zhōng":"中",
  };

  var replaceFix = {
    // ===误替换还原===
    "碧欲":"碧玉", "美欲":"美玉","欲石":"玉石","惜欲":"惜玉","宝欲":"宝玉",
    "品性":"品行", "德性":"德行",
    "波ok":"book", "波SS":"BOSS",

    // ===其他修正===
    "弥俩":"你俩",
    "妳":"你",
    // "圞|垩|卝|龘":"",
    "大6":"大陆",
  };

  function extendRule(replaceRule) {
    _.each(oneWordReplace, function(value, key) {
      // 这个替换会把 yùn 替换为 yù
      // replace['\\b' + key + '(?:\\b|\\s*)'] = value;

      // 这个不会替换 rén： shā rén偿命 => 杀 rén偿命
      // replaceRule['([^a-z\\s])' + key + '(?![a-z])'] = '$1' + value;

      replaceRule['\\b' + key + '(?![a-z])'] = value;
    });

    _.extend(replaceRule, replaceFix);
  }
  // test()

  // Unicode/2000-2FFF：http://zh.wikibooks.org/wiki/Unicode/2000-2FFF
  // Unicode/F000-FFFF：https://zh.wikibooks.org/wiki/Unicode/F000-FFFF

  // replace 中的简写
  var CHAR_ALIAS = {
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
    nextUrlCompare: /\/\d+(_\d+)?\.html?$|\/wcxs-\d+-\d+\/$|chapter-\d+\.html$|\/\d+_\d+\/$|\/\d+\/\d+$/i,  // 忽略的下一页链接（特殊），跟上一页比较

    // 按顺序匹配，匹配到则停止。econtains 完全相等
    indexSelectors: ["a[href='index.html']", "a:contains('返回书目')", "a:contains('章节目录')", "a:contains('章节列表')",
        "a:econtains('最新章节')", "a:contains('回目录')","a:contains('回书目')", "a:contains('目 录')", "a:contains('目录')"],

    contentSelectors: ["#pagecontent", "#contentbox", "#bmsy_content", "#bookpartinfo", "#htmlContent",
        "#text_area", "#chapter_content", "#chapterContent", "#chaptercontent", "#partbody", "#BookContent", "#read-content",
        "#article_content", "#BookTextRead", "#booktext", "#book_text", "#BookText", "#BookTextt", "#readtext", "#readcon", "#read",
        "#TextContent", "#txtContent" , "#text_c", "#txt_td", "#TXT", "#txt", "#zjneirong",
        "#contentTxt", "#oldtext", "#a_content", "#contents", "#content2", "#contentts", "#content1", "#content", 
        "#booktxt", "#nr", "#rtext", "#articlecontent", "#novelcontent", "#text-content",
        "#ChapterContents", "#acontent", "#chapterinfo",
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
      '.con_top > a:last',
      '.breadCrumb > a:last',
      '.bookNav > a:last',
      '.srcbox > a:last',
      '.con_top > a:last',
      '.location > a:last',
      '.nav > a:last',
      '.DivCurrentPos > a:last',
      '.layout-tit > a:last',
      '.ymdz > a:last',
      '.articletitle > a',
      '.chepnav > a:last',
      '.weizhi a:last',
      '.cover-nav a:last',
      '.path > .p > a:last',
      '.path a:last',
      '.readNav a:last',
      '.chapter-nav a:last',
      '.bread > a:nth-child(3)',
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

  extendRule(Rule.replace);

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
  }

  var tpl_mainHtml = "<div id=\"container\">\r\n    <div id=\"menu-bar\" title=\"点击显示隐藏章节列表\"></div>\r\n    <div id=\"menu\">\r\n        <div id=\"header\" title=\"打开目录\">\r\n            <a href=\"{indexUrl}\" target=\"_blank\">{bookTitle}</a>\r\n        </div>\r\n        <div id=\"divider\"></div>\r\n        <ul id=\"chapter-list\" title=\"左键滚动，中键打开链接（无阅读模式）\">\r\n        </ul>\r\n    </div>\r\n    <div id=\"mynovelreader-content\"></div>\r\n    <div id=\"loading\" style=\"display:none\"></div>\r\n    <div id=\"preferencesBtn\">\r\n        <img style=\"width:16px\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABwklEQVRIibVVzWrCQBAeQk/bdk+bm0aWDQEPHtwVahdavLU9aw6KAQ+SQ86Sa19Aqu0T9NafSw8ttOgr1CewUB9CBL3Yy26x1qRp0A8GhsnO9yUzmxmAhKjX68cAMAeAufK3C875FQAsAWCp/O3CsqyhFlB+Oti2/cAYewrD8FDHarXahWEYUy1gGMbUdd1z/TwMw0PG2JNt2/ex5IyxR02CEJpIKbuEkJGOrRshZCSl7CKEJjrGGHuIFMjlcs9RZElNcWxGEAQHGONxWnKM8TgIgoPYMkkpL9MKqNx4xNX8LyOEvMeSq5uxMZlz3vN9v+D7foFz3os6V61Wz36QNhqNUyHENaV0CACLTUnFYvF6/WVUbJPIglI6FELctFqtMiT59Ha7TdcFVCxJ6XYs0Gw2T1SJBlsq0ZxSOhBC3Hied/QjSTUoqsn9lSb3o879avI61FXbzTUFACiXy7v70Tqdzj7G+COtwJ+jIpPJvKYl12ZZ1kucwJs+iBD6lFJ2TdOMHB2mab7/a1xXKpW9fD5/6zjO3erCcV33PMnCcRwnfuHEYXVlZrPZQWqiKJRKpe8Bt5Ol73leCQBmADBTfiJ8AebTYCRbI3BUAAAAAElFTkSuQmCC\"/>\r\n    </div>\r\n    <div id=\"alert\" style=\"display: none;\">\r\n        <p id=\"App-notice\"></p>\r\n    </div>\r\n\r\n    <div id=\"app\">\r\n\r\n    </div>\r\n</div>";

  const autoBookTitleSelector = Rule.bookTitleSelector;

  function autoGetBookTitle($doc) {
      let bookTitle = '';
      // 依次获取
      for (let s of autoBookTitleSelector) {
          let $node = $doc.find(s);
          if ($node.length === 1) {
              bookTitle = $node.text();
              break
          }
      }

      // 排除一些无效的？
      C.log('autoGetBookTitle', bookTitle);

      return bookTitle
  }

  // 正文内容标准化替换

  function generateNormalizeMap(params) {
    return [
      ['[,，]\\s*|\\s^，', '，'], // 合并每一行以"，"结束的段落
      ['\\. *$', '。'],
      ['([。！？”]) +', '$1'],
      ['，+', '，'],
      ['"(.*?)"', '“$1”'],
      ['”“', '”\n“'], // 将一段中的相邻的对话分段
      [
        // 将一段中的含多个句号、感叹号、问号的句子每句分为多段
        '([。！？])([\\u4e00-\\u9fa5“])',
        '$1\n$2'
      ],
      [
        // 将一段中的第一句后接对话（引号）句子的第一句话分段
        '(^.*?[.。])(“.*?”)',
        '$1\n$2'
      ],
      [
        // 将一段中的右引号后面的内容分为一段
        '([。！？])”([\\u4e00-\\u9fa5“])',
        '$1”\n$2'
      ],
      Setting.mergeQoutesContent
        ? [
            // 将引号内的内容合并为一行
            '“([\\s\\S]*?)”',
            match => match.replaceAll('\n', '')
          ]
        : undefined,
      ['「(.*?)」', '“$1”'],
      ['『(.)』', '$1'],
      ['!', '！'],
      ['[┅。…·]{3,20}', '……'],
      ['[~－]{3,50}', '——']
    ].filter(row => !!row)
  }

  let replaceNormalizeMap = null;

  // 不转换 ，？：；（）！
  const excludeCharCode = new Set([
    65292, 65311, 65306, 65307, 65288, 65289, 65281
  ]);

  // 全角转半角
  function toCDB(str) {
    let tmp = '',
      charCode;
    for (let i = 0; i < str.length; i++) {
      charCode = str.charCodeAt(i);
      if (
        charCode > 65248 &&
        charCode < 65375 &&
        !excludeCharCode.has(charCode)
      ) {
        tmp += String.fromCharCode(charCode - 65248);
      } else {
        tmp += str.charAt(i);
      }
    }
    return tmp
  }

  function replaceNormalize(text) {
    if (!replaceNormalizeMap) replaceNormalizeMap = generateNormalizeMap();
    for (const [key, value] of replaceNormalizeMap) {
      text = text.replace(toRE(key), value);
    }
    return text
  }

  // 等待页面上的元素出现
  function observeElement(
    doc,
    { contentSelector, mutationSelector, mutationChildText, mutationChildCount }
  ) {
    var shouldAdd = false;
    var $doc = $(doc);

    var contentSize = $doc.find(contentSelector).size();

    if (contentSize && !mutationSelector) {
      shouldAdd = false;
    } else {
      var target = $doc.find(mutationSelector)[0];

      if (target) {
        var beforeTargetChilren = target.children.length;
        C.log(`target.children.length = ${target.children.length}`, target);

        if (mutationChildText) {
          if (target.textContent.indexOf(mutationChildText) > -1) {
            shouldAdd = true;
          }
        } else {
          if (
            mutationChildCount === undefined ||
            target.children.length <= mutationChildCount
          ) {
            shouldAdd = true;
          }
        }
      }
    }

    if (shouldAdd) {
      return new Promise(resolve => {
        var observer = new MutationObserver(function () {
          target = $doc.find(mutationSelector)[0];
          var nodeAdded = target.children.length > beforeTargetChilren;

          if (nodeAdded) {
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(document, {
          childList: true,
          subtree: true
        });

        C.log('添加 MutationObserve 成功：', mutationSelector);
      })
    }
  }

  // 将非p标签段落转换为p标签段落
  function toParagraphNode(node) {
    if (node.tagName && node.tagName !== 'P') {
      const p = document.createElement('p');
      node.childNodes.forEach(node => p.appendChild(node));
      node.replaceWith(p);
    }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var cjkConv = createCommonjsModule(function (module, exports) {
  !function(h,z){module.exports=z();}(commonjsGlobal,(function(){var h="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function z(h){return h&&h.__esModule&&Object.prototype.hasOwnProperty.call(h,"default")?h.default:h}function t(h){if(h.__esModule)return h;var z=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(h).forEach((function(t){var s=Object.getOwnPropertyDescriptor(h,t);Object.defineProperty(z,t,s.get?s:{enumerable:!0,get:function(){return h[t]}});})),z}var s={},p=function(h,z){return p=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(h,z){h.__proto__=z;}||function(h,z){for(var t in z)Object.prototype.hasOwnProperty.call(z,t)&&(h[t]=z[t]);},p(h,z)};var j=function(){return j=Object.assign||function(h){for(var z,t=1,s=arguments.length;t<s;t++)for(var p in z=arguments[t])Object.prototype.hasOwnProperty.call(z,p)&&(h[p]=z[p]);return h},j.apply(this,arguments)};var e=Object.create?function(h,z,t,s){void 0===s&&(s=t);var p=Object.getOwnPropertyDescriptor(z,t);p&&!("get"in p?!z.__esModule:p.writable||p.configurable)||(p={enumerable:!0,get:function(){return z[t]}}),Object.defineProperty(h,s,p);}:function(h,z,t,s){void 0===s&&(s=t),h[s]=z[t];};function r(h){var z="function"==typeof Symbol&&Symbol.iterator,t=z&&h[z],s=0;if(t)return t.call(h);if(h&&"number"==typeof h.length)return {next:function(){return h&&s>=h.length&&(h=void 0),{value:h&&h[s++],done:!h}}};throw new TypeError(z?"Object is not iterable.":"Symbol.iterator is not defined.")}function n(h,z){var t="function"==typeof Symbol&&h[Symbol.iterator];if(!t)return h;var s,p,j=t.call(h),e=[];try{for(;(void 0===z||z-- >0)&&!(s=j.next()).done;)e.push(s.value);}catch(h){p={error:h};}finally{try{s&&!s.done&&(t=j.return)&&t.call(j);}finally{if(p)throw p.error}}return e}function u(h){return this instanceof u?(this.v=h,this):new u(h)}var o=Object.create?function(h,z){Object.defineProperty(h,"default",{enumerable:!0,value:z});}:function(h,z){h.default=z;};var i=Object.freeze({__proto__:null,__extends:function(h,z){if("function"!=typeof z&&null!==z)throw new TypeError("Class extends value "+String(z)+" is not a constructor or null");function t(){this.constructor=h;}p(h,z),h.prototype=null===z?Object.create(z):(t.prototype=z.prototype,new t);},get __assign(){return j},__rest:function(h,z){var t={};for(var s in h)Object.prototype.hasOwnProperty.call(h,s)&&z.indexOf(s)<0&&(t[s]=h[s]);if(null!=h&&"function"==typeof Object.getOwnPropertySymbols){var p=0;for(s=Object.getOwnPropertySymbols(h);p<s.length;p++)z.indexOf(s[p])<0&&Object.prototype.propertyIsEnumerable.call(h,s[p])&&(t[s[p]]=h[s[p]]);}return t},__decorate:function(h,z,t,s){var p,j=arguments.length,e=j<3?z:null===s?s=Object.getOwnPropertyDescriptor(z,t):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)e=Reflect.decorate(h,z,t,s);else for(var r=h.length-1;r>=0;r--)(p=h[r])&&(e=(j<3?p(e):j>3?p(z,t,e):p(z,t))||e);return j>3&&e&&Object.defineProperty(z,t,e),e},__param:function(h,z){return function(t,s){z(t,s,h);}},__metadata:function(h,z){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(h,z)},__awaiter:function(h,z,t,s){return new(t||(t=Promise))((function(p,j){function e(h){try{n(s.next(h));}catch(h){j(h);}}function r(h){try{n(s.throw(h));}catch(h){j(h);}}function n(h){var z;h.done?p(h.value):(z=h.value,z instanceof t?z:new t((function(h){h(z);}))).then(e,r);}n((s=s.apply(h,z||[])).next());}))},__generator:function(h,z){var t,s,p,j,e={label:0,sent:function(){if(1&p[0])throw p[1];return p[1]},trys:[],ops:[]};return j={next:r(0),throw:r(1),return:r(2)},"function"==typeof Symbol&&(j[Symbol.iterator]=function(){return this}),j;function r(j){return function(r){return function(j){if(t)throw new TypeError("Generator is already executing.");for(;e;)try{if(t=1,s&&(p=2&j[0]?s.return:j[0]?s.throw||((p=s.return)&&p.call(s),0):s.next)&&!(p=p.call(s,j[1])).done)return p;switch(s=0,p&&(j=[2&j[0],p.value]),j[0]){case 0:case 1:p=j;break;case 4:return e.label++,{value:j[1],done:!1};case 5:e.label++,s=j[1],j=[0];continue;case 7:j=e.ops.pop(),e.trys.pop();continue;default:if(!(p=e.trys,(p=p.length>0&&p[p.length-1])||6!==j[0]&&2!==j[0])){e=0;continue}if(3===j[0]&&(!p||j[1]>p[0]&&j[1]<p[3])){e.label=j[1];break}if(6===j[0]&&e.label<p[1]){e.label=p[1],p=j;break}if(p&&e.label<p[2]){e.label=p[2],e.ops.push(j);break}p[2]&&e.ops.pop(),e.trys.pop();continue}j=z.call(h,e);}catch(h){j=[6,h],s=0;}finally{t=p=0;}if(5&j[0])throw j[1];return {value:j[0]?j[1]:void 0,done:!0}}([j,r])}}},__createBinding:e,__exportStar:function(h,z){for(var t in h)"default"===t||Object.prototype.hasOwnProperty.call(z,t)||e(z,h,t);},__values:r,__read:n,__spread:function(){for(var h=[],z=0;z<arguments.length;z++)h=h.concat(n(arguments[z]));return h},__spreadArrays:function(){for(var h=0,z=0,t=arguments.length;z<t;z++)h+=arguments[z].length;var s=Array(h),p=0;for(z=0;z<t;z++)for(var j=arguments[z],e=0,r=j.length;e<r;e++,p++)s[p]=j[e];return s},__spreadArray:function(h,z,t){if(t||2===arguments.length)for(var s,p=0,j=z.length;p<j;p++)!s&&p in z||(s||(s=Array.prototype.slice.call(z,0,p)),s[p]=z[p]);return h.concat(s||Array.prototype.slice.call(z))},__await:u,__asyncGenerator:function(h,z,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s,p=t.apply(h,z||[]),j=[];return s={},e("next"),e("throw"),e("return"),s[Symbol.asyncIterator]=function(){return this},s;function e(h){p[h]&&(s[h]=function(z){return new Promise((function(t,s){j.push([h,z,t,s])>1||r(h,z);}))});}function r(h,z){try{(t=p[h](z)).value instanceof u?Promise.resolve(t.value.v).then(n,o):i(j[0][2],t);}catch(h){i(j[0][3],h);}var t;}function n(h){r("next",h);}function o(h){r("throw",h);}function i(h,z){h(z),j.shift(),j.length&&r(j[0][0],j[0][1]);}},__asyncDelegator:function(h){var z,t;return z={},s("next"),s("throw",(function(h){throw h})),s("return"),z[Symbol.iterator]=function(){return this},z;function s(s,p){z[s]=h[s]?function(z){return (t=!t)?{value:u(h[s](z)),done:"return"===s}:p?p(z):z}:p;}},__asyncValues:function(h){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var z,t=h[Symbol.asyncIterator];return t?t.call(h):(h=r(h),z={},s("next"),s("throw"),s("return"),z[Symbol.asyncIterator]=function(){return this},z);function s(t){z[t]=h[t]&&function(z){return new Promise((function(s,p){(function(h,z,t,s){Promise.resolve(s).then((function(z){h({value:z,done:t});}),z);})(s,p,(z=h[t](z)).done,z.value);}))};}},__makeTemplateObject:function(h,z){return Object.defineProperty?Object.defineProperty(h,"raw",{value:z}):h.raw=z,h},__importStar:function(h){if(h&&h.__esModule)return h;var z={};if(null!=h)for(var t in h)"default"!==t&&Object.prototype.hasOwnProperty.call(h,t)&&e(z,h,t);return o(z,h),z},__importDefault:function(h){return h&&h.__esModule?h:{default:h}},__classPrivateFieldGet:function(h,z,t,s){if("a"===t&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof z?h!==z||!s:!z.has(h))throw new TypeError("Cannot read private member from an object whose class did not declare it");return "m"===t?s:"a"===t?s.call(h):s?s.value:z.get(h)},__classPrivateFieldSet:function(h,z,t,s,p){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!p)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof z?h!==z||!p:!z.has(h))throw new TypeError("Cannot write private member to an object whose class did not declare it");return "a"===s?p.call(h,t):p?p.value=t:z.set(h,t),t},__classPrivateFieldIn:function(h,z){if(null===z||"object"!=typeof z&&"function"!=typeof z)throw new TypeError("Cannot use 'in' operator on non-object");return "function"==typeof h?z===h:h.has(z)}}),a=t(i),c={},l={},f={},g={},_={};!function(h){Object.defineProperty(h,"__esModule",{value:!0}),h._re_cjk_conv=void 0,h._re_cjk_conv=function(h,z){return -1===(h=h||"u").indexOf("u")&&(h+="u"),new RegExp(`[\\u2e80-\\u2e99\\u2e9b-\\u2ef3\\u2f00-\\u2fd5\\u3038-\\u303b\\u3400-\\u4db5\\u4E00-\\u9FFF\\u{20000}-\\u{2FA1F}${z||""}]`,h)},h.default=h;}(_);var d={exports:{}},y={exports:{}};!function(z,t){z.exports=function(){var z="function"==typeof Promise,t="object"==typeof self?self:h,s="undefined"!=typeof Symbol,p="undefined"!=typeof Map,j="undefined"!=typeof Set,e="undefined"!=typeof WeakMap,r="undefined"!=typeof WeakSet,n="undefined"!=typeof DataView,u=s&&void 0!==Symbol.iterator,o=s&&void 0!==Symbol.toStringTag,i=j&&"function"==typeof Set.prototype.entries,a=p&&"function"==typeof Map.prototype.entries,c=i&&Object.getPrototypeOf((new Set).entries()),l=a&&Object.getPrototypeOf((new Map).entries()),f=u&&"function"==typeof Array.prototype[Symbol.iterator],g=f&&Object.getPrototypeOf([][Symbol.iterator]()),_=u&&"function"==typeof String.prototype[Symbol.iterator],d=_&&Object.getPrototypeOf(""[Symbol.iterator]()),y=8,b=-1;function v(h){var s=typeof h;if("object"!==s)return s;if(null===h)return "null";if(h===t)return "global";if(Array.isArray(h)&&(!1===o||!(Symbol.toStringTag in h)))return "Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&h===window.location)return "Location";if("object"==typeof window.document&&h===window.document)return "Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&h===window.navigator.mimeTypes)return "MimeTypeArray";if("object"==typeof window.navigator.plugins&&h===window.navigator.plugins)return "PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&h instanceof window.HTMLElement){if("BLOCKQUOTE"===h.tagName)return "HTMLQuoteElement";if("TD"===h.tagName)return "HTMLTableDataCellElement";if("TH"===h.tagName)return "HTMLTableHeaderCellElement"}}var u=o&&h[Symbol.toStringTag];if("string"==typeof u)return u;var i=Object.getPrototypeOf(h);return i===RegExp.prototype?"RegExp":i===Date.prototype?"Date":z&&i===Promise.prototype?"Promise":j&&i===Set.prototype?"Set":p&&i===Map.prototype?"Map":r&&i===WeakSet.prototype?"WeakSet":e&&i===WeakMap.prototype?"WeakMap":n&&i===DataView.prototype?"DataView":p&&i===l?"Map Iterator":j&&i===c?"Set Iterator":f&&i===g?"Array Iterator":_&&i===d?"String Iterator":null===i?"Object":Object.prototype.toString.call(h).slice(y,b)}return v}();}(y);var b=y.exports;function v(){this._key="chai/deep-eql__"+Math.random()+Date.now();}v.prototype={get:function(h){return h[this._key]},set:function(h,z){Object.isExtensible(h)&&Object.defineProperty(h,this._key,{value:z,configurable:!0});}};var O="function"==typeof WeakMap?WeakMap:v;function A(h,z,t){if(!t||C(h)||C(z))return null;var s=t.get(h);if(s){var p=s.get(z);if("boolean"==typeof p)return p}return null}function w(h,z,t,s){if(t&&!C(h)&&!C(z)){var p=t.get(h);p?p.set(z,s):((p=new O).set(z,s),t.set(h,p));}}function T(h,z,t){if(t&&t.comparator)return E(h,z,t);var s=m(h,z);return null!==s?s:E(h,z,t)}function m(h,z){return h===z?0!==h||1/h==1/z:h!=h&&z!=z||!C(h)&&!C(z)&&null}function E(h,z,t){(t=t||{}).memoize=!1!==t.memoize&&(t.memoize||new O);var s=t&&t.comparator,p=A(h,z,t.memoize);if(null!==p)return p;var j=A(z,h,t.memoize);if(null!==j)return j;if(s){var e=s(h,z);if(!1===e||!0===e)return w(h,z,t.memoize,e),e;var r=m(h,z);if(null!==r)return r}var n=b(h);if(n!==b(z))return w(h,z,t.memoize,!1),!1;w(h,z,t.memoize,!0);var u=function(h,z,t,s){switch(t){case"String":case"Number":case"Boolean":case"Date":return T(h.valueOf(),z.valueOf());case"Promise":case"Symbol":case"function":case"WeakMap":case"WeakSet":return h===z;case"Error":return k(h,z,["name","message","code"],s);case"Arguments":case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"Array":return P(h,z,s);case"RegExp":return function(h,z){return h.toString()===z.toString()}(h,z);case"Generator":return function(h,z,t){return P(R(h),R(z),t)}(h,z,s);case"DataView":return P(new Uint8Array(h.buffer),new Uint8Array(z.buffer),s);case"ArrayBuffer":return P(new Uint8Array(h),new Uint8Array(z),s);case"Set":case"Map":return S(h,z,s);default:return function(h,z,t){var s=I(h),p=I(z),j=x(h),e=x(z);j&&(s=s.concat(j));e&&(p=p.concat(e));if(s.length&&s.length===p.length)return s.sort(),p.sort(),!1!==P(s,p)&&k(h,z,s,t);var r=M(h),n=M(z);if(r.length&&r.length===n.length)return r.sort(),n.sort(),P(r,n,t);if(0===s.length&&0===r.length&&0===p.length&&0===n.length)return !0;return !1}(h,z,s)}}(h,z,n,t);return w(h,z,t.memoize,u),u}function S(h,z,t){if(h.size!==z.size)return !1;if(0===h.size)return !0;var s=[],p=[];return h.forEach((function(h,z){s.push([h,z]);})),z.forEach((function(h,z){p.push([h,z]);})),P(s.sort(),p.sort(),t)}function P(h,z,t){var s=h.length;if(s!==z.length)return !1;if(0===s)return !0;for(var p=-1;++p<s;)if(!1===T(h[p],z[p],t))return !1;return !0}function M(h){if(function(h){return "undefined"!=typeof Symbol&&"object"==typeof h&&void 0!==Symbol.iterator&&"function"==typeof h[Symbol.iterator]}(h))try{return R(h[Symbol.iterator]())}catch(h){return []}return []}function R(h){for(var z=h.next(),t=[z.value];!1===z.done;)z=h.next(),t.push(z.value);return t}function I(h){var z=[];for(var t in h)z.push(t);return z}function x(h){return Object.getOwnPropertySymbols(h)}function k(h,z,t,s){var p=t.length;if(0===p)return !0;for(var j=0;j<p;j+=1)if(!1===T(h[t[j]],z[t[j]],s))return !1;return !0}function C(h){return null===h||"object"!=typeof h}d.exports=T,d.exports.MemoizeMap=O;var D=d.exports,F="object"==typeof commonjsGlobal&&commonjsGlobal&&commonjsGlobal.Object===Object&&commonjsGlobal,L="object"==typeof self&&self&&self.Object===Object&&self,B=F||L||Function("return this")(),H=B.Symbol,N=Object.prototype,G=N.hasOwnProperty,K=N.toString,Z=H?H.toStringTag:void 0;var U=Object.prototype.toString;var Y=H?H.toStringTag:void 0;function W(h){return null==h?void 0===h?"[object Undefined]":"[object Null]":Y&&Y in Object(h)?function(h){var z=G.call(h,Z),t=h[Z];try{h[Z]=void 0;var s=!0;}catch(h){}var p=K.call(h);return s&&(z?h[Z]=t:delete h[Z]),p}(h):function(h){return U.call(h)}(h)}function $(h){return null!=h&&"object"==typeof h}function J(h){return "symbol"==typeof h||$(h)&&"[object Symbol]"==W(h)}var q=Array.isArray,V=H?H.prototype:void 0,X=V?V.toString:void 0;function Q(h){if("string"==typeof h)return h;if(q(h))return function(h,z){for(var t=-1,s=null==h?0:h.length,p=Array(s);++t<s;)p[t]=z(h[t],t,h);return p}(h,Q)+"";if(J(h))return X?X.call(h):"";var z=h+"";return "0"==z&&1/h==-Infinity?"-0":z}var hh=/\s/;var zh=/^\s+/;function th(h){return h?h.slice(0,function(h){for(var z=h.length;z--&&hh.test(h.charAt(z)););return z}(h)+1).replace(zh,""):h}function sh(h){var z=typeof h;return null!=h&&("object"==z||"function"==z)}var ph=/^[-+]0x[0-9a-f]+$/i,jh=/^0b[01]+$/i,eh=/^0o[0-7]+$/i,rh=parseInt;var nh=1/0;function uh(h){return h?(h=function(h){if("number"==typeof h)return h;if(J(h))return NaN;if(sh(h)){var z="function"==typeof h.valueOf?h.valueOf():h;h=sh(z)?z+"":z;}if("string"!=typeof h)return 0===h?h:+h;h=th(h);var t=jh.test(h);return t||eh.test(h)?rh(h.slice(2),t?2:8):ph.test(h)?NaN:+h}(h))===nh||h===-1/0?17976931348623157e292*(h<0?-1:1):h==h?h:0:0===h?h:0}function oh(h){var z=uh(h),t=z%1;return z==z?t?z-t:z:0}function ih(h){return h}function ah(h){if(!sh(h))return !1;var z=W(h);return "[object Function]"==z||"[object GeneratorFunction]"==z||"[object AsyncFunction]"==z||"[object Proxy]"==z}var ch,lh=B["__core-js_shared__"],fh=(ch=/[^.]+$/.exec(lh&&lh.keys&&lh.keys.IE_PROTO||""))?"Symbol(src)_1."+ch:"";var gh=Function.prototype.toString;function _h(h){if(null!=h){try{return gh.call(h)}catch(h){}try{return h+""}catch(h){}}return ""}var dh=/^\[object .+?Constructor\]$/,yh=Function.prototype,bh=Object.prototype,vh=yh.toString,Oh=bh.hasOwnProperty,Ah=RegExp("^"+vh.call(Oh).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function wh(h){return !(!sh(h)||(z=h,fh&&fh in z))&&(ah(h)?Ah:dh).test(_h(h));var z;}function Th(h,z){var t=function(h,z){return null==h?void 0:h[z]}(h,z);return wh(t)?t:void 0}var mh=Th(B,"WeakMap");function Eh(h,z,t,s){for(var p=h.length,j=t+(s?1:-1);s?j--:++j<p;)if(z(h[j],j,h))return j;return -1}var Sh=/^(?:0|[1-9]\d*)$/;function Ph(h,z){var t=typeof h;return !!(z=null==z?9007199254740991:z)&&("number"==t||"symbol"!=t&&Sh.test(h))&&h>-1&&h%1==0&&h<z}function Mh(h,z){return h===z||h!=h&&z!=z}function Rh(h){return "number"==typeof h&&h>-1&&h%1==0&&h<=9007199254740991}var Ih=Object.prototype;function xh(h){return $(h)&&"[object Arguments]"==W(h)}var kh=Object.prototype,Ch=kh.hasOwnProperty,Dh=kh.propertyIsEnumerable,Fh=xh(function(){return arguments}())?xh:function(h){return $(h)&&Ch.call(h,"callee")&&!Dh.call(h,"callee")},Lh=Fh;var Bh=exports&&!exports.nodeType&&exports,Hh=Bh&&"object"=='object'&&module&&!module.nodeType&&module,Nh=Hh&&Hh.exports===Bh?B.Buffer:void 0,Gh=(Nh?Nh.isBuffer:void 0)||function(){return !1},Kh={};Kh["[object Float32Array]"]=Kh["[object Float64Array]"]=Kh["[object Int8Array]"]=Kh["[object Int16Array]"]=Kh["[object Int32Array]"]=Kh["[object Uint8Array]"]=Kh["[object Uint8ClampedArray]"]=Kh["[object Uint16Array]"]=Kh["[object Uint32Array]"]=!0,Kh["[object Arguments]"]=Kh["[object Array]"]=Kh["[object ArrayBuffer]"]=Kh["[object Boolean]"]=Kh["[object DataView]"]=Kh["[object Date]"]=Kh["[object Error]"]=Kh["[object Function]"]=Kh["[object Map]"]=Kh["[object Number]"]=Kh["[object Object]"]=Kh["[object RegExp]"]=Kh["[object Set]"]=Kh["[object String]"]=Kh["[object WeakMap]"]=!1;var Zh,Uh=exports&&!exports.nodeType&&exports,Yh=Uh&&"object"=='object'&&module&&!module.nodeType&&module,Wh=Yh&&Yh.exports===Uh&&F.process,$h=function(){try{var h=Yh&&Yh.require&&Yh.require("util").types;return h||Wh&&Wh.binding&&Wh.binding("util")}catch(h){}}(),Jh=$h&&$h.isTypedArray,qh=Jh?(Zh=Jh,function(h){return Zh(h)}):function(h){return $(h)&&Rh(h.length)&&!!Kh[W(h)]},Vh=Object.prototype.hasOwnProperty;function Xh(h,z){var t=q(h),s=!t&&Lh(h),p=!t&&!s&&Gh(h),j=!t&&!s&&!p&&qh(h),e=t||s||p||j,r=e?function(h,z){for(var t=-1,s=Array(h);++t<h;)s[t]=z(t);return s}(h.length,String):[],n=r.length;for(var u in h)!z&&!Vh.call(h,u)||e&&("length"==u||p&&("offset"==u||"parent"==u)||j&&("buffer"==u||"byteLength"==u||"byteOffset"==u)||Ph(u,n))||r.push(u);return r}var Qh=function(h,z){return function(t){return h(z(t))}}(Object.keys,Object),hz=Qh,zz=Object.prototype.hasOwnProperty;function tz(h){if(t=(z=h)&&z.constructor,z!==("function"==typeof t&&t.prototype||Ih))return hz(h);var z,t,s=[];for(var p in Object(h))zz.call(h,p)&&"constructor"!=p&&s.push(p);return s}function sz(h){return null!=(z=h)&&Rh(z.length)&&!ah(z)?Xh(h):tz(h);var z;}var pz=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,jz=/^\w*$/;function ez(h,z){if(q(h))return !1;var t=typeof h;return !("number"!=t&&"symbol"!=t&&"boolean"!=t&&null!=h&&!J(h))||(jz.test(h)||!pz.test(h)||null!=z&&h in Object(z))}var rz=Th(Object,"create");var nz=Object.prototype.hasOwnProperty;var uz=Object.prototype.hasOwnProperty;function oz(h){var z=-1,t=null==h?0:h.length;for(this.clear();++z<t;){var s=h[z];this.set(s[0],s[1]);}}function iz(h,z){for(var t=h.length;t--;)if(Mh(h[t][0],z))return t;return -1}oz.prototype.clear=function(){this.__data__=rz?rz(null):{},this.size=0;},oz.prototype.delete=function(h){var z=this.has(h)&&delete this.__data__[h];return this.size-=z?1:0,z},oz.prototype.get=function(h){var z=this.__data__;if(rz){var t=z[h];return "__lodash_hash_undefined__"===t?void 0:t}return nz.call(z,h)?z[h]:void 0},oz.prototype.has=function(h){var z=this.__data__;return rz?void 0!==z[h]:uz.call(z,h)},oz.prototype.set=function(h,z){var t=this.__data__;return this.size+=this.has(h)?0:1,t[h]=rz&&void 0===z?"__lodash_hash_undefined__":z,this};var az=Array.prototype.splice;function cz(h){var z=-1,t=null==h?0:h.length;for(this.clear();++z<t;){var s=h[z];this.set(s[0],s[1]);}}cz.prototype.clear=function(){this.__data__=[],this.size=0;},cz.prototype.delete=function(h){var z=this.__data__,t=iz(z,h);return !(t<0)&&(t==z.length-1?z.pop():az.call(z,t,1),--this.size,!0)},cz.prototype.get=function(h){var z=this.__data__,t=iz(z,h);return t<0?void 0:z[t][1]},cz.prototype.has=function(h){return iz(this.__data__,h)>-1},cz.prototype.set=function(h,z){var t=this.__data__,s=iz(t,h);return s<0?(++this.size,t.push([h,z])):t[s][1]=z,this};var lz=Th(B,"Map");function fz(h,z){var t=h.__data__;return function(h){var z=typeof h;return "string"==z||"number"==z||"symbol"==z||"boolean"==z?"__proto__"!==h:null===h}(z)?t["string"==typeof z?"string":"hash"]:t.map}function gz(h){var z=-1,t=null==h?0:h.length;for(this.clear();++z<t;){var s=h[z];this.set(s[0],s[1]);}}gz.prototype.clear=function(){this.size=0,this.__data__={hash:new oz,map:new(lz||cz),string:new oz};},gz.prototype.delete=function(h){var z=fz(this,h).delete(h);return this.size-=z?1:0,z},gz.prototype.get=function(h){return fz(this,h).get(h)},gz.prototype.has=function(h){return fz(this,h).has(h)},gz.prototype.set=function(h,z){var t=fz(this,h),s=t.size;return t.set(h,z),this.size+=t.size==s?0:1,this};function _z(h,z){if("function"!=typeof h||null!=z&&"function"!=typeof z)throw new TypeError("Expected a function");var t=function(){var s=arguments,p=z?z.apply(this,s):s[0],j=t.cache;if(j.has(p))return j.get(p);var e=h.apply(this,s);return t.cache=j.set(p,e)||j,e};return t.cache=new(_z.Cache||gz),t}_z.Cache=gz;var dz=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,yz=/\\(\\)?/g,bz=function(h){var z=_z(h,(function(h){return 500===t.size&&t.clear(),h})),t=z.cache;return z}((function(h){var z=[];return 46===h.charCodeAt(0)&&z.push(""),h.replace(dz,(function(h,t,s,p){z.push(s?p.replace(yz,"$1"):t||h);})),z})),vz=bz;function Oz(h,z){return q(h)?h:ez(h,z)?[h]:vz(function(h){return null==h?"":Q(h)}(h))}function Az(h){if("string"==typeof h||J(h))return h;var z=h+"";return "0"==z&&1/h==-Infinity?"-0":z}function wz(h,z){for(var t=0,s=(z=Oz(z,h)).length;null!=h&&t<s;)h=h[Az(z[t++])];return t&&t==s?h:void 0}function Tz(h){var z=this.__data__=new cz(h);this.size=z.size;}Tz.prototype.clear=function(){this.__data__=new cz,this.size=0;},Tz.prototype.delete=function(h){var z=this.__data__,t=z.delete(h);return this.size=z.size,t},Tz.prototype.get=function(h){return this.__data__.get(h)},Tz.prototype.has=function(h){return this.__data__.has(h)},Tz.prototype.set=function(h,z){var t=this.__data__;if(t instanceof cz){var s=t.__data__;if(!lz||s.length<199)return s.push([h,z]),this.size=++t.size,this;t=this.__data__=new gz(s);}return t.set(h,z),this.size=t.size,this};var mz=Object.prototype.propertyIsEnumerable,Ez=Object.getOwnPropertySymbols,Sz=Ez?function(h){return null==h?[]:(h=Object(h),function(h,z){for(var t=-1,s=null==h?0:h.length,p=0,j=[];++t<s;){var e=h[t];z(e,t,h)&&(j[p++]=e);}return j}(Ez(h),(function(z){return mz.call(h,z)})))}:function(){return []};function Pz(h){return function(h,z,t){var s=z(h);return q(h)?s:function(h,z){for(var t=-1,s=z.length,p=h.length;++t<s;)h[p+t]=z[t];return h}(s,t(h))}(h,sz,Sz)}var Mz=Th(B,"DataView"),Rz=Th(B,"Promise"),Iz=Th(B,"Set"),xz="[object Map]",kz="[object Promise]",Cz="[object Set]",Dz="[object WeakMap]",Fz="[object DataView]",Lz=_h(Mz),Bz=_h(lz),Hz=_h(Rz),Nz=_h(Iz),Gz=_h(mh),Kz=W;(Mz&&Kz(new Mz(new ArrayBuffer(1)))!=Fz||lz&&Kz(new lz)!=xz||Rz&&Kz(Rz.resolve())!=kz||Iz&&Kz(new Iz)!=Cz||mh&&Kz(new mh)!=Dz)&&(Kz=function(h){var z=W(h),t="[object Object]"==z?h.constructor:void 0,s=t?_h(t):"";if(s)switch(s){case Lz:return Fz;case Bz:return xz;case Hz:return kz;case Nz:return Cz;case Gz:return Dz}return z});var Zz=Kz,Uz=B.Uint8Array;function Yz(h){var z=-1,t=null==h?0:h.length;for(this.__data__=new gz;++z<t;)this.add(h[z]);}function Wz(h,z){for(var t=-1,s=null==h?0:h.length;++t<s;)if(z(h[t],t,h))return !0;return !1}Yz.prototype.add=Yz.prototype.push=function(h){return this.__data__.set(h,"__lodash_hash_undefined__"),this},Yz.prototype.has=function(h){return this.__data__.has(h)};function $z(h,z,t,s,p,j){var e=1&t,r=h.length,n=z.length;if(r!=n&&!(e&&n>r))return !1;var u=j.get(h),o=j.get(z);if(u&&o)return u==z&&o==h;var i=-1,a=!0,c=2&t?new Yz:void 0;for(j.set(h,z),j.set(z,h);++i<r;){var l=h[i],f=z[i];if(s)var g=e?s(f,l,i,z,h,j):s(l,f,i,h,z,j);if(void 0!==g){if(g)continue;a=!1;break}if(c){if(!Wz(z,(function(h,z){if(e=z,!c.has(e)&&(l===h||p(l,h,t,s,j)))return c.push(z);var e;}))){a=!1;break}}else if(l!==f&&!p(l,f,t,s,j)){a=!1;break}}return j.delete(h),j.delete(z),a}function Jz(h){var z=-1,t=Array(h.size);return h.forEach((function(h,s){t[++z]=[s,h];})),t}function qz(h){var z=-1,t=Array(h.size);return h.forEach((function(h){t[++z]=h;})),t}var Vz=H?H.prototype:void 0,Xz=Vz?Vz.valueOf:void 0;var Qz=Object.prototype.hasOwnProperty;var ht="[object Arguments]",zt="[object Array]",tt="[object Object]",st=Object.prototype.hasOwnProperty;function pt(h,z,t,s,p,j){var e=q(h),r=q(z),n=e?zt:Zz(h),u=r?zt:Zz(z),o=(n=n==ht?tt:n)==tt,i=(u=u==ht?tt:u)==tt,a=n==u;if(a&&Gh(h)){if(!Gh(z))return !1;e=!0,o=!1;}if(a&&!o)return j||(j=new Tz),e||qh(h)?$z(h,z,t,s,p,j):function(h,z,t,s,p,j,e){switch(t){case"[object DataView]":if(h.byteLength!=z.byteLength||h.byteOffset!=z.byteOffset)return !1;h=h.buffer,z=z.buffer;case"[object ArrayBuffer]":return !(h.byteLength!=z.byteLength||!j(new Uz(h),new Uz(z)));case"[object Boolean]":case"[object Date]":case"[object Number]":return Mh(+h,+z);case"[object Error]":return h.name==z.name&&h.message==z.message;case"[object RegExp]":case"[object String]":return h==z+"";case"[object Map]":var r=Jz;case"[object Set]":var n=1&s;if(r||(r=qz),h.size!=z.size&&!n)return !1;var u=e.get(h);if(u)return u==z;s|=2,e.set(h,z);var o=$z(r(h),r(z),s,p,j,e);return e.delete(h),o;case"[object Symbol]":if(Xz)return Xz.call(h)==Xz.call(z)}return !1}(h,z,n,t,s,p,j);if(!(1&t)){var c=o&&st.call(h,"__wrapped__"),l=i&&st.call(z,"__wrapped__");if(c||l){var f=c?h.value():h,g=l?z.value():z;return j||(j=new Tz),p(f,g,t,s,j)}}return !!a&&(j||(j=new Tz),function(h,z,t,s,p,j){var e=1&t,r=Pz(h),n=r.length;if(n!=Pz(z).length&&!e)return !1;for(var u=n;u--;){var o=r[u];if(!(e?o in z:Qz.call(z,o)))return !1}var i=j.get(h),a=j.get(z);if(i&&a)return i==z&&a==h;var c=!0;j.set(h,z),j.set(z,h);for(var l=e;++u<n;){var f=h[o=r[u]],g=z[o];if(s)var _=e?s(g,f,o,z,h,j):s(f,g,o,h,z,j);if(!(void 0===_?f===g||p(f,g,t,s,j):_)){c=!1;break}l||(l="constructor"==o);}if(c&&!l){var d=h.constructor,y=z.constructor;d==y||!("constructor"in h)||!("constructor"in z)||"function"==typeof d&&d instanceof d&&"function"==typeof y&&y instanceof y||(c=!1);}return j.delete(h),j.delete(z),c}(h,z,t,s,p,j))}function jt(h,z,t,s,p){return h===z||(null==h||null==z||!$(h)&&!$(z)?h!=h&&z!=z:pt(h,z,t,s,jt,p))}function et(h){return h==h&&!sh(h)}function rt(h,z){return function(t){return null!=t&&(t[h]===z&&(void 0!==z||h in Object(t)))}}function nt(h){var z=function(h){for(var z=sz(h),t=z.length;t--;){var s=z[t],p=h[s];z[t]=[s,p,et(p)];}return z}(h);return 1==z.length&&z[0][2]?rt(z[0][0],z[0][1]):function(t){return t===h||function(h,z,t,s){var p=t.length,j=p,e=!s;if(null==h)return !j;for(h=Object(h);p--;){var r=t[p];if(e&&r[2]?r[1]!==h[r[0]]:!(r[0]in h))return !1}for(;++p<j;){var n=(r=t[p])[0],u=h[n],o=r[1];if(e&&r[2]){if(void 0===u&&!(n in h))return !1}else {var i=new Tz;if(s)var a=s(u,o,n,h,z,i);if(!(void 0===a?jt(o,u,3,s,i):a))return !1}}return !0}(t,h,z)}}function ut(h,z){return null!=h&&z in Object(h)}function ot(h,z){return null!=h&&function(h,z,t){for(var s=-1,p=(z=Oz(z,h)).length,j=!1;++s<p;){var e=Az(z[s]);if(!(j=null!=h&&t(h,e)))break;h=h[e];}return j||++s!=p?j:!!(p=null==h?0:h.length)&&Rh(p)&&Ph(e,p)&&(q(h)||Lh(h))}(h,z,ut)}function it(h,z){return ez(h)&&et(z)?rt(Az(h),z):function(t){var s=function(h,z,t){var s=null==h?void 0:wz(h,z);return void 0===s?t:s}(t,h);return void 0===s&&s===z?ot(t,h):jt(z,s,3)}}function at(h){return ez(h)?(z=Az(h),function(h){return null==h?void 0:h[z]}):function(h){return function(z){return wz(z,h)}}(h);var z;}function ct(h){return "function"==typeof h?h:null==h?ih:"object"==typeof h?q(h)?it(h[0],h[1]):nt(h):at(h)}var lt=Math.max;function ft(h,z,t){var s=null==h?0:h.length;if(!s)return -1;var p=null==t?0:oh(t);return p<0&&(p=lt(s+p,0)),Eh(h,ct(z),p)}var gt=Math.max,_t=Math.min;function dt(h,z,t){var s=null==h?0:h.length;if(!s)return -1;var p=s-1;return void 0!==t&&(p=oh(t),p=t<0?gt(s+p,0):_t(p,s-1)),Eh(h,ct(z),p,!0)}function yt(h,z){return D(h,z)}function bt(h={}){const z=h.checker||vt,t=h.filter||null,s=h.removeFromFirst?dt:ft;return (h,p,j)=>s(j,(t=>z(t,h,j,j)))==p&&(!t||t(h))}function vt(h,z,t,s){return D(h,z)}function Ot(h,z={}){if(!Array.isArray(h))throw new TypeError(`Expected an Array but got ${typeof h}.`);const t=bt(z);if(z.overwrite){let z=h.length;for(;z--;){t(h[z],z,h)||h.splice(z,1);}return h}return h.filter(t)}function At(h,z={}){return Ot(h,{...z,overwrite:!0})}function wt(...h){return h.length>1?Ot(h):Ot(h[0])}function Tt(...h){return h.length>1?At(h):At(h[0])}wt.array_unique=Ot,wt.array_unique_overwrite=At,wt.lazy_unique_overwrite=Tt,wt.equals=yt,wt.defaultFilter=bt,wt.defaultChecker=vt,wt.lazy_unique=wt,wt.default=wt,Object.defineProperty(wt,"__esModule",{value:!0});var mt=t(Object.freeze({__proto__:null,array_unique:Ot,array_unique_overwrite:At,default:wt,defaultChecker:vt,defaultFilter:bt,equals:yt,lazy_unique:wt,lazy_unique_overwrite:Tt}));Object.defineProperty(g,"__esModule",{value:!0}),g.SAFE_MODE_CHAR=g.REGEXP_TEST=g.defaultOptions=void 0;const Et=_,St=mt;g.defaultOptions=Object.freeze({safe:!0}),g.REGEXP_TEST=(0, Et._re_cjk_conv)("ug"),g.SAFE_MODE_CHAR=(0, St.array_unique)(["后","里","餵","志","布","佈","系","繫","梁","樑","衝","沖","谷","穀","注","克"]),Object.defineProperty(f,"__esModule",{value:!0}),f._call=f.getOptions=f.getOptionsSkip=void 0;const Pt=g;function Mt(h,z=Pt.SAFE_MODE_CHAR){return h.skip?"string"==typeof h.skip?h.skip+=z.join(""):Array.isArray(h.skip)?h.skip=h.skip.slice().concat(z):h.table=z.reduce((function(h,z){return h[z]=z,h}),Object.assign({},h.table||{})):h.skip=z.slice(),h}function Rt(h={},z=Pt.defaultOptions,t=Pt.SAFE_MODE_CHAR){return (h=Object.assign({},z,h)).safe&&(h=Mt(h,t)),h}f.getOptionsSkip=Mt,f.getOptions=Rt,f._call=function(h,z,t={},...s){if((t=Rt(t)).skip||t.table||t.tableOnly){let{skip:p,table:j,tableOnly:e}=t,r=!e;if(e&&!j)throw new Error(`table is ${j}`);return z.replace(Pt.REGEXP_TEST,(function(z){if(p&&-1!==p.indexOf(z))return z;if(j&&"function"==typeof j){let p=j(h,z,t,...s);if(null!=p)return p}else {if(j&&j[z])return j[z];if(r)return h(z)}return z}))}return h(z,t,...s)};var It={},xt={},kt={};Object.defineProperty(kt,"__esModule",{value:!0}),kt.table_tw2cn=kt.table_cn2tw=void 0,kt.table_cn2tw={"万":"萬","与":"與","丑":"醜","专":"專","业":"業","丛":"叢","东":"東","丝":"絲","丢":"丟","两":"兩","严":"嚴","并":"並","丧":"喪","个":"個","丬":"爿","丰":"豐","临":"臨","为":"為","丽":"麗","举":"舉","么":"麼","义":"義","乌":"烏","乐":"樂","乔":"喬","习":"習","乡":"鄉","书":"書","买":"買","乱":"亂","干":"幹","争":"爭","于":"於","亏":"虧","云":"雲","亘":"亘","亚":"亞","产":"產","亩":"畝","亲":"親","亵":"褻","亸":"嚲","亿":"億","仅":"僅","仆":"僕","从":"從","仑":"侖","仓":"倉","仪":"儀","们":"們","价":"價","众":"眾","优":"優","伙":"伙","会":"會","伛":"傴","伞":"傘","伟":"偉","传":"傳","伤":"傷","伥":"倀","伦":"倫","伧":"傖","伪":"偽","伫":"佇","体":"體","余":"餘","佣":"傭","佥":"僉","来":"來","侠":"俠","侣":"侶","侥":"僥","侦":"偵","侧":"側","侨":"僑","侩":"儈","侪":"儕","侬":"儂","俣":"俁","俦":"儔","俨":"儼","俩":"倆","俪":"儷","俭":"儉","债":"債","倾":"傾","偬":"傯","偻":"僂","偾":"僨","偿":"償","杰":"傑","备":"備","傥":"儻","傧":"儐","储":"儲","傩":"儺","当":"當","尽":"盡","罗":"羅","攒":"攢","儿":"兒","兑":"兌","兖":"兗","党":"黨","内":"內","兰":"蘭","关":"關","兴":"興","兹":"茲","养":"養","兽":"獸","冁":"囅","冈":"岡","册":"冊","写":"寫","军":"軍","农":"農","冢":"塚","幂":"冪","冯":"馮","冲":"衝","决":"決","况":"況","冻":"凍","净":"淨","涂":"涂","凄":"淒","凉":"涼","凌":"凌","减":"減","凑":"湊","凛":"凜","渎":"瀆","几":"幾","凤":"鳳","处":"處","凫":"鳧","凭":"憑","凯":"凱","击":"擊","凿":"鑿","刍":"芻","划":"劃","刘":"劉","则":"則","刚":"剛","创":"創","删":"刪","别":"別","刭":"剄","刽":"劊","刿":"劌","剀":"剴","剂":"劑","剐":"剮","剑":"劍","剥":"剝","剧":"劇","札":"札","劝":"勸","办":"辦","务":"務","劢":"勱","动":"動","励":"勵","劲":"勁","劳":"勞","势":"勢","勋":"勛","勐":"勐","勚":"勩","胜":"勝","绩":"績","匀":"勻","匦":"匭","匮":"匱","汇":"匯","奁":"奩","椟":"櫝","区":"區","医":"醫","华":"華","协":"協","单":"單","卖":"賣","卜":"蔔","卢":"盧","卤":"滷","卧":"臥","卫":"衛","却":"卻","卺":"巹","厂":"廠","厅":"廳","历":"歷","厉":"厲","压":"壓","厌":"厭","厍":"厙","厕":"廁","厢":"廂","厣":"厴","厦":"廈","厨":"廚","厩":"廄","厮":"廝","县":"縣","叁":"叄","参":"參","叆":"靉","叇":"靆","双":"雙","发":"發","变":"變","叙":"敘","叠":"疊","叶":"葉","号":"號","叹":"嘆","叽":"嘰","吁":"吁","咤":"吒","吓":"嚇","吕":"呂","吗":"嗎","吣":"唚","吨":"噸","听":"聽","启":"啟","吴":"吳","呒":"嘸","呓":"囈","呕":"嘔","呖":"嚦","呗":"唄","员":"員","呙":"咼","呛":"嗆","呜":"嗚","咏":"詠","咔":"咔","咙":"嚨","咛":"嚀","咝":"噝","咨":"諮","咴":"噅","咸":"鹹","哌":"呱","响":"響","哑":"啞","哒":"噠","哓":"嘵","哔":"嗶","哕":"噦","哗":"嘩","哙":"噲","哜":"嚌","哝":"噥","哟":"喲","唣":"唕","唛":"嘜","唝":"嗊","唠":"嘮","唡":"啢","唢":"嗩","唤":"喚","唿":"唿","问":"問","衔":"銜","啧":"嘖","啬":"嗇","啭":"囀","啮":"齧","啰":"囉","啴":"嘽","啸":"嘯","喷":"噴","喽":"嘍","喾":"嚳","嗫":"囁","嗬":"嗬","嗳":"噯","尝":"嘗","嘘":"噓","嘤":"嚶","嘱":"囑","恶":"惡","噜":"嚕","噼":"噼","嚣":"囂","嚯":"嚯","苏":"蘇","团":"團","囱":"囪","园":"園","国":"國","围":"圍","囵":"圇","图":"圖","圆":"圓","圣":"聖","圹":"壙","场":"場","坂":"阪","坏":"壞","块":"塊","坚":"堅","坛":"壇","坜":"壢","坝":"壩","坞":"塢","坟":"墳","坠":"墜","垧":"坰","垄":"壟","垅":"壠","垆":"壚","垒":"壘","垦":"墾","垩":"堊","垫":"墊","垭":"埡","垯":"墶","垱":"壋","垲":"塏","垴":"堖","埯":"垵","埘":"塒","埙":"塤","埚":"堝","埝":"墊","执":"執","堑":"塹","堕":"墮","阶":"階","尧":"堯","报":"報","碱":"鹼","塆":"壪","茔":"塋","塬":"原","尘":"塵","砖":"磚","墙":"牆","硗":"磽","壮":"壯","声":"聲","壳":"殻","壶":"壺","壸":"壼","寿":"壽","复":"復","够":"夠","梦":"夢","头":"頭","夸":"誇","夹":"夾","夺":"奪","奂":"奐","奋":"奮","奖":"獎","奥":"奧","妆":"妝","妇":"婦","妈":"媽","妩":"嫵","妪":"嫗","妫":"媯","姗":"姍","姜":"姜","娄":"婁","娅":"婭","娆":"嬈","娇":"嬌","娈":"孌","娱":"娛","娲":"媧","娴":"嫻","婳":"嫿","婴":"嬰","婵":"嬋","婶":"嬸","媪":"媼","袅":"裊","嫒":"嬡","嫔":"嬪","嫱":"嬙","嬷":"嬤","懒":"懶","孙":"孫","学":"學","孪":"孿","宁":"寧","宝":"寶","实":"實","宠":"寵","审":"審","宪":"憲","宫":"宮","宽":"寬","宾":"賓","寝":"寢","对":"對","寻":"尋","导":"導","将":"將","尔":"爾","尴":"尷","尸":"屍","层":"層","屃":"屓","届":"屆","屉":"屜","属":"屬","屡":"屢","屦":"屨","屿":"嶼","岁":"歲","岂":"豈","岖":"嶇","岗":"崗","岘":"峴","岙":"嶴","岚":"嵐","岛":"島","岭":"嶺","岳":"嶽","岽":"崬","岿":"巋","峃":"嶨","峄":"嶧","峡":"峽","峣":"嶢","峤":"嶠","峥":"崢","峦":"巒","崂":"嶗","崃":"崍","崄":"嶮","崭":"嶄","嵛":"崳","嵘":"嶸","嵚":"嶔","嵝":"嶁","嵴":"脊","巅":"巔","巩":"鞏","巯":"巰","币":"幣","帅":"帥","师":"師","帏":"幃","帐":"帳","帘":"簾","帜":"幟","带":"帶","帧":"幀","帮":"幫","帱":"幬","帻":"幘","帼":"幗","幞":"襆","襕":"幱","幺":"么","广":"廣","庄":"莊","庆":"慶","庐":"廬","庑":"廡","库":"庫","应":"應","庙":"廟","庞":"龐","废":"廢","庼":"廎","荫":"蔭","廪":"廩","开":"開","异":"異","弃":"棄","张":"張","弥":"彌","弪":"弳","弯":"彎","强":"強","弹":"彈","归":"歸","录":"錄","彟":"彠","彦":"彥","彻":"徹","径":"徑","徕":"徠","御":"御","忆":"憶","忏":"懺","忧":"憂","忾":"愾","怀":"懷","态":"態","怂":"慫","怃":"憮","怄":"慪","怅":"悵","怆":"愴","怜":"憐","总":"總","怼":"懟","怿":"懌","恋":"戀","耻":"恥","恳":"懇","恸":"慟","恹":"懨","恺":"愷","恻":"惻","恼":"惱","恽":"惲","悦":"悅","悫":"愨","悬":"懸","悭":"慳","悯":"憫","闷":"悶","惊":"驚","惧":"懼","惨":"慘","惩":"懲","惫":"憊","惬":"愜","惭":"慚","惮":"憚","惯":"慣","愍":"湣","爱":"愛","愠":"慍","愤":"憤","愦":"憒","愿":"願","慑":"懾","慭":"憖","虑":"慮","憷":"憷","懔":"懍","懑":"懣","欢":"歡","戆":"戇","戋":"戔","戏":"戲","戗":"戧","战":"戰","戬":"戩","户":"戶","扎":"扎","扑":"撲","扦":"扦","扩":"擴","扪":"捫","扫":"掃","扬":"揚","扰":"擾","抚":"撫","抛":"拋","抟":"摶","抠":"摳","抡":"掄","抢":"搶","护":"護","担":"擔","拟":"擬","拢":"攏","拣":"揀","拥":"擁","拦":"攔","拧":"擰","拨":"撥","择":"擇","挂":"掛","挚":"摯","挛":"攣","挜":"掗","挝":"撾","挞":"撻","挟":"挾","挠":"撓","挡":"擋","挢":"撟","挣":"掙","挤":"擠","挥":"揮","挦":"撏","捞":"撈","损":"損","捡":"撿","换":"換","捣":"搗","据":"據","捻":"捻","掳":"擄","掴":"摑","掷":"擲","掸":"撣","掺":"摻","掼":"摜","揸":"摣","揽":"攬","揿":"撳","搀":"攙","搁":"擱","搂":"摟","搅":"攪","构":"構","摇":"搖","携":"攜","摄":"攝","摅":"攄","摆":"擺","摈":"擯","摊":"攤","撄":"攖","撑":"撐","撵":"攆","撷":"擷","撸":"擼","撺":"攛","擞":"擻","敌":"敵","败":"敗","敛":"斂","数":"數","驱":"驅","毙":"斃","斋":"齋","斓":"斕","斗":"鬥","斩":"斬","断":"斷","无":"無","旧":"舊","时":"時","旷":"曠","旸":"暘","昙":"曇","昼":"晝","昽":"曨","显":"顯","晋":"晉","晒":"曬","晓":"曉","晔":"曄","晕":"暈","晖":"暉","暂":"暫","畅":"暢","暧":"曖","胧":"朧","术":"術","朴":"樸","机":"機","杀":"殺","杂":"雜","权":"權","条":"條","杨":"楊","杩":"榪","极":"極","枞":"樅","枢":"樞","枣":"棗","枥":"櫪","枧":"梘","枨":"棖","枪":"槍","枫":"楓","枭":"梟","柜":"櫃","柠":"檸","栅":"柵","柽":"檉","栀":"梔","标":"標","栈":"棧","栉":"櫛","栊":"櫳","栋":"棟","栌":"櫨","栎":"櫟","栏":"欄","树":"樹","栖":"棲","样":"樣","栾":"欒","桊":"棬","桠":"椏","桡":"橈","桢":"楨","档":"檔","桤":"榿","桥":"橋","桦":"樺","桧":"檜","桨":"槳","桩":"樁","梼":"檮","梾":"棶","检":"檢","棂":"欞","椁":"槨","椠":"槧","椤":"欏","椭":"橢","楼":"樓","榄":"欖","榇":"櫬","榈":"櫚","榉":"櫸","荣":"榮","盘":"盤","槚":"檟","槛":"檻","槟":"檳","槠":"櫧","规":"規","横":"橫","樯":"檣","樱":"櫻","橥":"櫫","橱":"櫥","橹":"櫓","橼":"櫞","檩":"檁","檐":"檐","苘":"檾","欤":"歟","欧":"歐","钦":"欽","歼":"殲","殁":"歿","殇":"殤","残":"殘","殒":"殞","殓":"殮","殚":"殫","殡":"殯","殴":"毆","毁":"毀","毂":"轂","毕":"畢","毡":"氈","绒":"絨","毵":"毿","牦":"氂","氇":"氌","气":"氣","氢":"氫","氩":"氬","氲":"氳","汉":"漢","污":"污","汤":"湯","汹":"洶","没":"沒","沓":"沓","沟":"溝","沣":"灃","沤":"漚","沥":"瀝","沦":"淪","沧":"滄","沨":"渢","沩":"溈","沪":"滬","沵":"濔","泞":"濘","泪":"淚","泶":"澩","泷":"瀧","泸":"瀘","泺":"濼","泻":"瀉","泼":"潑","泽":"澤","泾":"涇","洁":"潔","洒":"灑","洼":"窪","浃":"浹","浅":"淺","浆":"漿","浇":"澆","浈":"湞","浉":"溮","浊":"濁","测":"測","浍":"澮","济":"濟","浏":"瀏","浐":"滻","浑":"渾","浒":"滸","浓":"濃","浔":"潯","浕":"濜","涌":"涌","莅":"蒞","涛":"濤","涝":"澇","涞":"淶","涟":"漣","涠":"潿","涡":"渦","涢":"溳","涣":"渙","涤":"滌","润":"潤","涧":"澗","涨":"漲","涩":"澀","淀":"澱","渌":"淥","渊":"淵","渍":"漬","渐":"漸","渑":"澠","渔":"漁","渖":"瀋","渗":"滲","温":"溫","游":"游","湾":"灣","湿":"濕","溃":"潰","溅":"濺","溆":"漵","溇":"漊","灭":"滅","荥":"滎","滗":"潷","滚":"滾","滞":"滯","滟":"灧","滠":"灄","满":"滿","滢":"瀅","滤":"濾","滥":"濫","滦":"灤","滨":"濱","滩":"灘","滪":"澦","漤":"灠","颍":"潁","潆":"瀠","潇":"瀟","潋":"瀲","潍":"濰","潜":"潛","潴":"瀦","澜":"瀾","濑":"瀨","濒":"瀕","阔":"闊","灏":"灝","灯":"燈","灵":"靈","灾":"災","灿":"燦","炀":"煬","炉":"爐","炖":"燉","炜":"煒","炝":"熗","点":"點","炼":"煉","炽":"熾","烁":"爍","烂":"爛","烃":"烴","烛":"燭","烟":"煙","烦":"煩","烧":"燒","烨":"燁","烩":"燴","烫":"燙","烬":"燼","热":"熱","焕":"煥","焖":"燜","焘":"燾","煅":"煆","辉":"輝","茕":"煢","煳":"糊","煺":"退","荧":"熒","熘":"溜","颎":"熲","营":"營","爷":"爺","笺":"箋","牍":"牘","闸":"閘","牵":"牽","牺":"犧","犊":"犢","荦":"犖","犟":"犟","犭":"犬","状":"狀","犷":"獷","犸":"獁","犹":"猶","狈":"狽","狍":"麅","狝":"獮","狞":"獰","独":"獨","狭":"狹","狮":"獅","狯":"獪","狰":"猙","狱":"獄","狲":"猻","猃":"獫","猎":"獵","猕":"獼","猡":"玀","猪":"豬","猫":"貓","猬":"蝟","献":"獻","獭":"獺","获":"獲","玑":"璣","玙":"璵","玚":"瑒","玛":"瑪","珏":"玨","玮":"瑋","环":"環","现":"現","玱":"瑲","玺":"璽","珉":"瑉","珐":"琺","珑":"瓏","珰":"璫","珲":"琿","琎":"璡","琏":"璉","琐":"瑣","琼":"瓊","瑶":"瑤","莹":"瑩","瑷":"璦","璇":"璿","璎":"瓔","瓒":"瓚","瓮":"瓮","瓯":"甌","罂":"罌","电":"電","画":"畫","畴":"疇","疖":"癤","疗":"療","疟":"瘧","疠":"癘","疡":"瘍","疬":"癧","疮":"瘡","疯":"瘋","疱":"皰","疴":"痾","痈":"癰","痉":"痙","痒":"癢","痖":"瘂","痨":"癆","痪":"瘓","痫":"癇","痴":"痴","瘅":"癉","瘆":"瘮","瘗":"瘞","瘘":"瘺","瘪":"癟","瘫":"癱","瘾":"癮","瘿":"癭","癞":"癩","癣":"癬","癫":"癲","癯":"臒","皑":"皚","皱":"皺","皲":"皸","盏":"盞","盐":"鹽","监":"監","盖":"蓋","盗":"盜","荡":"蕩","眍":"瞘","视":"視","眦":"眥","眬":"矓","着":"著","睁":"睜","睐":"睞","睑":"瞼","瞆":"瞶","瞒":"瞞","瞩":"矚","矫":"矯","矶":"磯","硅":"硅","矾":"礬","矿":"礦","砀":"碭","码":"碼","砗":"硨","砚":"硯","砜":"碸","砺":"礪","砻":"礱","砾":"礫","础":"礎","硁":"硜","硕":"碩","硖":"硤","硙":"磑","硚":"礄","确":"確","碜":"磣","硷":"鹼","碍":"礙","碛":"磧","碹":"碹","磙":"滾","礼":"禮","祎":"禕","祢":"禰","祯":"禎","祷":"禱","祸":"禍","禄":"祿","禀":"稟","禅":"禪","离":"離","秃":"禿","秆":"稈","籼":"秈","种":"種","积":"積","称":"稱","秽":"穢","秾":"穠","税":"稅","稆":"穭","稣":"穌","稳":"穩","谷":"穀","颖":"穎","穑":"穡","颓":"穨","穷":"窮","窃":"竊","窍":"竅","窑":"窯","窜":"竄","窝":"窩","窥":"窺","窦":"竇","窭":"窶","竖":"豎","竞":"競","笃":"篤","笋":"筍","笔":"筆","笕":"筧","笼":"籠","笾":"籩","筑":"築","筚":"篳","筛":"篩","筜":"簹","筝":"箏","筹":"籌","签":"簽","简":"簡","箓":"籙","箦":"簀","箧":"篋","箨":"籜","箩":"籮","箪":"簞","箫":"簫","节":"節","范":"範","篑":"簣","篓":"簍","篮":"籃","篱":"籬","簖":"籪","籁":"籟","钥":"鑰","籴":"糴","类":"類","粜":"糶","粝":"糲","粤":"粵","粪":"糞","粮":"糧","糁":"糝","糇":"餱","纟":"糹","纠":"糾","纪":"紀","纣":"紂","约":"約","红":"紅","纡":"紆","纥":"紇","纨":"紈","纫":"紉","纹":"紋","纳":"納","纽":"紐","纾":"紓","纯":"純","纰":"紕","纼":"紖","纱":"紗","纮":"紘","纸":"紙","级":"級","纷":"紛","纭":"紜","纴":"紝","纺":"紡","紧":"緊","细":"細","绂":"紱","绁":"紲","绅":"紳","纻":"紵","绍":"紹","绀":"紺","绋":"紼","绐":"紿","绌":"絀","终":"終","组":"組","绊":"絆","绗":"絎","结":"結","绝":"絕","绦":"絛","绔":"絝","绞":"絞","络":"絡","绚":"絢","给":"給","绖":"絰","统":"統","绛":"絳","絷":"縶","绢":"絹","绑":"綁","绡":"綃","绠":"綆","绨":"綈","绣":"綉","绤":"綌","绥":"綏","经":"經","综":"綜","缍":"綞","绿":"綠","绸":"綢","绻":"綣","线":"線","绶":"綬","维":"維","绹":"綯","绾":"綰","纲":"綱","网":"網","绷":"綳","缀":"綴","纶":"綸","绺":"綹","绮":"綺","绽":"綻","绰":"綽","绫":"綾","绵":"綿","绲":"緄","缁":"緇","绯":"緋","缗":"緡","绪":"緒","绬":"緓","绱":"緔","缃":"緗","缄":"緘","缂":"緙","缉":"緝","缎":"緞","缔":"締","缘":"緣","缌":"緦","编":"編","缓":"緩","缅":"緬","纬":"緯","缑":"緱","缈":"緲","练":"練","缏":"緶","缇":"緹","缊":"縕","萦":"縈","缙":"縉","缢":"縊","缒":"縋","绉":"縐","缣":"縑","缞":"縗","缚":"縛","缜":"縝","缟":"縞","缛":"縟","缝":"縫","缡":"縭","缩":"縮","纵":"縱","缧":"縲","纤":"纖","缦":"縵","缕":"縷","缥":"縹","缫":"繅","缪":"繆","襁":"繈","缯":"繒","织":"織","缮":"繕","缭":"繚","绕":"繞","缋":"繢","绳":"繩","绘":"繪","茧":"繭","缰":"繮","缳":"繯","缲":"繰","缴":"繳","绎":"繹","继":"繼","缤":"繽","缱":"繾","颣":"纇","缬":"纈","纩":"纊","续":"續","缠":"纏","缨":"纓","缵":"纘","缆":"纜","缐":"線","钵":"缽","罚":"罰","罢":"罷","罴":"羆","骂":"罵","羁":"羈","芈":"羋","羟":"羥","羡":"羨","翘":"翹","翙":"翽","翚":"翬","锄":"鋤","耢":"耮","耧":"耬","耸":"聳","聂":"聶","聋":"聾","职":"職","聍":"聹","联":"聯","闻":"聞","聩":"聵","聪":"聰","肃":"肅","肠":"腸","肤":"膚","肷":"膁","肾":"腎","肿":"腫","胀":"脹","胁":"脅","胆":"膽","胨":"腖","胪":"臚","胫":"脛","胶":"膠","脉":"脈","脍":"膾","脏":"髒","脐":"臍","脑":"腦","脓":"膿","脔":"臠","脚":"腳","脱":"脫","脶":"腡","脸":"臉","腊":"臘","腌":"醃","腘":"膕","腭":"齶","腻":"膩","腼":"靦","腽":"膃","腾":"騰","膑":"臏","臜":"臢","舆":"輿","铺":"鋪","馆":"館","舣":"艤","舰":"艦","舱":"艙","舻":"艫","艰":"艱","艳":"艷","艹":"艸","艺":"藝","芗":"薌","芜":"蕪","芦":"蘆","苁":"蓯","苇":"葦","苈":"藶","苋":"莧","苌":"萇","苍":"蒼","苎":"苧","苹":"蘋","茎":"莖","茏":"蘢","茑":"蔦","荆":"荊","荐":"薦","荙":"薘","荚":"莢","荛":"蕘","荜":"蓽","荞":"蕎","荟":"薈","荠":"薺","荤":"葷","荨":"蕁","荩":"藎","荪":"蓀","荬":"蕒","荭":"葒","荮":"葤","药":"藥","莜":"蓧","莱":"萊","莲":"蓮","莳":"蒔","莴":"萵","莶":"薟","莸":"蕕","莺":"鶯","莼":"蓴","萚":"蘀","萝":"蘿","萤":"螢","萧":"蕭","萨":"薩","葱":"蔥","蒇":"蕆","蒉":"蕢","蒋":"蔣","蒌":"蔞","蓝":"藍","蓟":"薊","蓠":"蘺","蓣":"蕷","蓥":"鎣","蓦":"驀","蔷":"薔","蔹":"蘞","蔺":"藺","蔼":"藹","蕲":"蘄","蕴":"蘊","薮":"藪","藁":"槁","藓":"蘚","虏":"虜","虚":"虛","虫":"蟲","虬":"虯","虮":"蟣","虽":"雖","虾":"蝦","虿":"蠆","蚀":"蝕","蚁":"蟻","蚂":"螞","蚕":"蠶","蚝":"蠔","蚬":"蜆","蛊":"蠱","蛎":"蠣","蛏":"蟶","蛮":"蠻","蛰":"蟄","蛱":"蛺","蛲":"蟯","蛳":"螄","蛴":"蠐","蜕":"蛻","蜗":"蝸","蜡":"蠟","蝇":"蠅","蝈":"蟈","蝉":"蟬","蝎":"蠍","蝼":"螻","蝾":"蠑","螀":"螿","螨":"蟎","蟏":"蠨","衅":"釁","补":"補","衬":"襯","衮":"袞","袄":"襖","袆":"褘","袜":"襪","袭":"襲","袯":"襏","装":"裝","裆":"襠","裈":"褌","里":"裡","裢":"褳","裣":"襝","裤":"褲","裥":"襇","褛":"褸","褴":"襤","见":"見","觃":"覎","觅":"覓","觇":"覘","觋":"覡","觍":"覥","觎":"覦","觊":"覬","觏":"覯","觑":"覷","觐":"覲","觉":"覺","览":"覽","觌":"覿","观":"觀","觞":"觴","触":"觸","觯":"觶","讠":"訁","订":"訂","讣":"訃","计":"計","讯":"訊","讧":"訌","讨":"討","讦":"訐","讱":"訒","训":"訓","讪":"訕","讫":"訖","记":"記","讹":"訛","讶":"訝","讼":"訟","诀":"訣","讷":"訥","谌":"諶","讻":"訩","访":"訪","设":"設","许":"許","诉":"訴","诃":"訶","诊":"診","证":"證","诂":"詁","诋":"詆","讵":"詎","诈":"詐","诒":"詒","诏":"詔","评":"評","诐":"詖","诇":"詗","诎":"詘","诅":"詛","词":"詞","詟":"讋","诩":"詡","询":"詢","诣":"詣","试":"試","诗":"詩","诧":"詫","诟":"詬","诡":"詭","诠":"詮","诘":"詰","话":"話","该":"該","详":"詳","诜":"詵","诙":"詼","诖":"詿","诔":"誄","诛":"誅","诓":"誆","誉":"譽","誊":"謄","认":"認","诳":"誑","诶":"誒","诞":"誕","诱":"誘","诮":"誚","语":"語","诚":"誠","诫":"誡","诬":"誣","误":"誤","诰":"誥","诵":"誦","诲":"誨","说":"說","谁":"誰","课":"課","谇":"誶","诽":"誹","谊":"誼","调":"調","谄":"諂","谆":"諄","谈":"談","诿":"諉","请":"請","诤":"諍","诹":"諏","诼":"諑","谅":"諒","论":"論","谂":"諗","谀":"諛","谍":"諜","谞":"諝","谝":"諞","谥":"謚","诨":"諢","谔":"諤","谛":"諦","谐":"諧","谏":"諫","谕":"諭","讳":"諱","谙":"諳","讽":"諷","诸":"諸","谚":"諺","谖":"諼","诺":"諾","谋":"謀","谒":"謁","谓":"謂","诌":"謅","谎":"謊","谜":"謎","谧":"謐","谑":"謔","谡":"謖","谤":"謗","谦":"謙","讲":"講","谢":"謝","谣":"謠","谟":"謨","谪":"謫","谬":"謬","讴":"謳","谨":"謹","谩":"謾","谲":"譎","讥":"譏","谮":"譖","识":"識","谯":"譙","谭":"譚","谱":"譜","谵":"譫","译":"譯","议":"議","谴":"譴","诪":"譸","谫":"譾","读":"讀","雠":"讎","谗":"讒","让":"讓","谰":"讕","谶":"讖","赞":"贊","谠":"讜","谳":"讞","谘":"諮","豮":"豶","贝":"貝","贞":"貞","贠":"貟","负":"負","财":"財","贡":"貢","贫":"貧","货":"貨","贩":"販","贪":"貪","贯":"貫","责":"責","贮":"貯","贳":"貰","赀":"貲","贰":"貳","贵":"貴","贬":"貶","贷":"貸","贶":"貺","费":"費","贴":"貼","贻":"貽","贸":"貿","贺":"賀","贲":"賁","赂":"賂","赁":"賃","贿":"賄","赅":"賅","资":"資","贾":"賈","贼":"賊","赃":"贓","赈":"賑","赊":"賒","赇":"賕","赒":"賙","赉":"賚","赐":"賜","赏":"賞","赔":"賠","赓":"賡","贤":"賢","贱":"賤","赋":"賦","赕":"賧","质":"質","赍":"賫","账":"賬","赌":"賭","赆":"贐","赖":"賴","赗":"賵","赚":"賺","赙":"賻","购":"購","赛":"賽","赜":"賾","贽":"贄","赘":"贅","赟":"贇","赠":"贈","赝":"贋","赡":"贍","赢":"贏","赑":"贔","赎":"贖","赣":"贛","赪":"赬","赵":"趙","赶":"趕","趋":"趨","趱":"趲","趸":"躉","跃":"躍","跄":"蹌","跖":"跖","跞":"躒","迹":"跡","践":"踐","跶":"躂","跷":"蹺","跸":"蹕","跹":"躚","跻":"躋","踊":"踴","踌":"躊","踪":"蹤","踬":"躓","踯":"躑","蹑":"躡","蹒":"蹣","蹰":"躕","蹿":"躥","躏":"躪","躜":"躦","躯":"軀","车":"車","轧":"軋","轨":"軌","轪":"軑","轩":"軒","轫":"軔","轭":"軛","软":"軟","轷":"軤","轸":"軫","轱":"軲","轴":"軸","轵":"軹","轺":"軺","轲":"軻","轶":"軼","轼":"軾","较":"較","辂":"輅","辁":"輇","辀":"輈","载":"載","轾":"輊","辄":"輒","辅":"輔","轻":"輕","辆":"輛","辎":"輜","辋":"輞","辍":"輟","辊":"輥","辇":"輦","辈":"輩","轮":"輪","辌":"輬","辑":"輯","辏":"輳","输":"輸","辐":"輻","辒":"轀","辗":"輾","辖":"轄","辕":"轅","辘":"轆","转":"轉","辙":"轍","轿":"轎","辚":"轔","轰":"轟","辔":"轡","轹":"轢","轳":"轤","辞":"辭","辩":"辯","辫":"辮","边":"邊","辽":"遼","达":"達","迁":"遷","过":"過","迈":"邁","运":"運","还":"還","这":"這","进":"進","远":"遠","违":"違","连":"連","迟":"遲","迩":"邇","迳":"逕","适":"適","选":"選","逊":"遜","递":"遞","逦":"邐","逻":"邏","遗":"遺","遥":"遙","邓":"鄧","邝":"鄺","邬":"鄔","邮":"郵","邹":"鄒","邺":"鄴","邻":"鄰","郁":"郁","郄":"郤","郏":"郟","郐":"鄶","郑":"鄭","郓":"鄆","郦":"酈","郧":"鄖","郸":"鄲","酝":"醞","酦":"醱","酰":"醯","酱":"醬","酽":"釅","酾":"釃","酿":"釀","释":"釋","钆":"釓","钇":"釔","钌":"釕","钊":"釗","钉":"釘","钋":"釙","针":"針","钓":"釣","钐":"釤","钏":"釧","钒":"釩","钗":"釵","钍":"釷","钕":"釹","钎":"釺","钯":"鈀","钫":"鈁","钘":"鈃","钭":"鈄","钚":"鈈","钠":"鈉","钝":"鈍","钩":"鈎","钤":"鈐","钣":"鈑","钑":"鈒","钞":"鈔","钮":"鈕","钧":"鈞","钟":"鐘","钙":"鈣","钬":"鈥","钛":"鈦","钪":"鈧","铌":"鈮","铈":"鈰","钶":"鈳","铃":"鈴","钴":"鈷","钹":"鈸","铍":"鈹","钰":"鈺","钸":"鈽","铀":"鈾","钿":"鈿","钾":"鉀","铁":"鐵","钻":"鑽","铊":"鉈","铉":"鉉","铋":"鉍","铂":"鉑","钷":"鉕","钳":"鉗","铆":"鉚","铅":"鉛","钺":"鉞","钲":"鉦","钼":"鉬","钽":"鉭","锎":"鐦","鉴":"鑑","铏":"鉶","铰":"鉸","铒":"鉺","铬":"鉻","铪":"鉿","银":"銀","铳":"銃","铜":"銅","铚":"銍","铣":"銑","铨":"銓","铢":"銖","铭":"銘","铫":"銚","铦":"銛","铑":"銠","铷":"銣","铱":"銥","铟":"銦","铵":"銨","铥":"銩","铕":"銪","铯":"銫","铐":"銬","銮":"鑾","铞":"銱","锐":"銳","销":"銷","锈":"銹","锑":"銻","锉":"銼","铝":"鋁","镅":"鎇","锒":"鋃","锌":"鋅","钡":"鋇","铤":"鋌","铗":"鋏","锋":"鋒","铻":"鋙","镯":"鐲","锊":"鋝","锓":"鋟","铘":"鋣","锃":"鋥","锔":"鋦","锇":"鋨","铓":"鋩","铖":"鋮","锆":"鋯","锂":"鋰","铽":"鋱","锍":"鋶","锯":"鋸","钢":"鋼","锞":"錁","锖":"錆","锫":"錇","锩":"錈","铔":"錏","锥":"錐","锕":"錒","锟":"錕","锤":"錘","锱":"錙","铮":"錚","锛":"錛","锬":"錟","锭":"錠","锜":"錡","钱":"錢","锦":"錦","锚":"錨","锠":"錩","锡":"錫","锢":"錮","错":"錯","锰":"錳","铼":"錸","镎":"鎿","錾":"鏨","锝":"鍀","锨":"鍁","锪":"鍃","钔":"鍆","锴":"鍇","锳":"鍈","锅":"鍋","镀":"鍍","锷":"鍔","铡":"鍘","钖":"鍚","锻":"鍛","锽":"鍠","锸":"鍤","锲":"鍥","锘":"鍩","锹":"鍬","锾":"鍰","键":"鍵","锶":"鍶","锗":"鍺","镁":"鎂","锿":"鎄","镑":"鎊","镕":"鎔","锁":"鎖","镉":"鎘","镈":"鎛","镃":"鎡","钨":"鎢","镏":"鎦","铠":"鎧","铩":"鎩","锼":"鎪","镐":"鎬","镇":"鎮","镒":"鎰","镋":"鎲","镍":"鎳","镓":"鎵","镌":"鎸","镞":"鏃","链":"鏈","镆":"鏌","镙":"鏍","镠":"鏐","镝":"鏑","铿":"鏗","锵":"鏘","镗":"鏜","镘":"鏝","镛":"鏞","镜":"鏡","镖":"鏢","镂":"鏤","镚":"鏰","铧":"鏵","镤":"鏷","镪":"鏹","铙":"鐃","铴":"鐋","镣":"鐐","铹":"鐒","镦":"鐓","镡":"鐔","镫":"鐙","镢":"鐝","镨":"鐠","锏":"鐧","镄":"鐨","镰":"鐮","镭":"鐳","镮":"鐶","铎":"鐸","铛":"鐺","镱":"鐿","铸":"鑄","镬":"鑊","镔":"鑌","镲":"鑔","锧":"鑕","镴":"鑞","铄":"鑠","镳":"鑣","镥":"鑥","镧":"鑭","镵":"鑱","镶":"鑲","镊":"鑷","镩":"鑹","锣":"鑼","锺":"鍾","长":"長","门":"門","闩":"閂","闪":"閃","闫":"閆","闬":"閈","闭":"閉","闶":"閌","闳":"閎","闰":"閏","闲":"閑","间":"間","闵":"閔","闹":"鬧","阂":"閡","阁":"閣","阀":"閥","闺":"閨","闽":"閩","阃":"閫","阆":"閬","闾":"閭","阅":"閱","阊":"閶","阉":"閹","阎":"閻","阏":"閼","阍":"閽","阈":"閾","阌":"閿","阒":"闃","闱":"闈","阕":"闋","阑":"闌","阇":"闍","阗":"闐","阘":"闒","闿":"闓","阖":"闔","阙":"闕","闯":"闖","阚":"闞","阓":"闠","阐":"闡","阛":"闤","闼":"闥","阄":"鬮","阋":"鬩","队":"隊","阳":"陽","阴":"陰","阵":"陣","际":"際","陆":"陸","陇":"隴","陈":"陳","陉":"陘","陕":"陝","陧":"隉","陨":"隕","险":"險","随":"隨","隐":"隱","隶":"隸","隽":"雋","难":"難","雏":"雛","鸡":"雞","雳":"靂","雾":"霧","霁":"霽","霉":"霉","霭":"靄","靓":"靚","静":"靜","靥":"靨","韧":"韌","鼗":"鞀","鞑":"韃","鞒":"鞽","鞯":"韉","鞴":"韝","韦":"韋","韨":"韍","韩":"韓","韪":"韙","韬":"韜","韫":"韞","韵":"韻","页":"頁","顶":"頂","顷":"頃","项":"項","顺":"順","顸":"頇","须":"須","顼":"頊","颂":"頌","颀":"頎","颃":"頏","预":"預","顽":"頑","颁":"頒","顿":"頓","颇":"頗","领":"領","颌":"頜","颉":"頡","颐":"頤","颏":"頦","颒":"頮","颊":"頰","颋":"頲","颕":"頴","颔":"頷","颈":"頸","频":"頻","颗":"顆","题":"題","额":"額","颚":"顎","颜":"顏","颙":"顒","颛":"顓","颡":"顙","颠":"顛","颟":"顢","颢":"顥","顾":"顧","颤":"顫","颥":"顬","颦":"顰","颅":"顱","颞":"顳","颧":"顴","风":"風","飐":"颭","飑":"颮","飒":"颯","飓":"颶","飔":"颸","飖":"颻","飕":"颼","飗":"飀","飘":"飄","飙":"飆","飏":"颺","飚":"飈","飞":"飛","饥":"飢","饤":"飣","饦":"飥","飨":"饗","饨":"飩","饪":"飪","饫":"飫","饬":"飭","饭":"飯","饮":"飲","饴":"飴","饲":"飼","饱":"飽","饰":"飾","饳":"飿","饺":"餃","饸":"餄","饼":"餅","饷":"餉","饵":"餌","餍":"饜","饹":"餎","饻":"餏","饽":"餑","馁":"餒","饿":"餓","馂":"餕","饾":"餖","馄":"餛","馃":"餜","饯":"餞","馅":"餡","饧":"餳","馉":"餶","馇":"餷","馎":"餺","饩":"餼","馈":"饋","馏":"餾","馊":"餿","馌":"饁","馍":"饃","馒":"饅","馐":"饈","馑":"饉","馓":"饊","馔":"饌","饶":"饒","馋":"饞","馕":"饢","馀":"餘","马":"馬","驭":"馭","驮":"馱","驰":"馳","驯":"馴","驲":"馹","驳":"駁","驻":"駐","驽":"駑","驹":"駒","驵":"駔","驾":"駕","骀":"駘","驸":"駙","驶":"駛","驼":"駝","驷":"駟","骈":"駢","骇":"駭","骃":"駰","骆":"駱","骎":"駸","骏":"駿","骋":"騁","骍":"騂","骓":"騅","骔":"騌","骒":"騍","骑":"騎","骐":"騏","验":"驗","骛":"騖","骗":"騙","骙":"騤","骞":"騫","骘":"騭","骝":"騮","驺":"騶","骚":"騷","骟":"騸","骡":"騾","骜":"驁","骖":"驂","骠":"驃","骢":"驄","骅":"驊","骕":"驌","骁":"驍","骣":"驏","骄":"驕","驿":"驛","骤":"驟","驴":"驢","骧":"驤","骥":"驥","骦":"驦","骊":"驪","骉":"驫","鲠":"鯁","髅":"髏","髋":"髖","髌":"髕","鬓":"鬢","魇":"魘","魉":"魎","鱼":"魚","鱽":"魛","鱾":"魢","鲀":"魨","鲁":"魯","鲂":"魴","鱿":"魷","鲄":"魺","鲅":"鮁","鲆":"鮃","鲌":"鮊","鲉":"鮋","鲧":"鯀","鲏":"鮍","鲇":"鮎","鲐":"鮐","鲍":"鮑","鲋":"鮒","鲊":"鮓","鲒":"鮚","鲘":"鮜","鲕":"鮞","鲖":"鮦","鲔":"鮪","鲛":"鮫","鲑":"鮭","鲜":"鮮","鲓":"鮳","鲪":"鮶","鳀":"鯷","鲝":"鮺","鲩":"鯇","鲤":"鯉","鲨":"鯊","鲬":"鯒","鲻":"鯔","鲯":"鯕","鲭":"鯖","鲞":"鯗","鲷":"鯛","鲴":"鯝","鲱":"鯡","鲵":"鯢","鲲":"鯤","鲳":"鯧","鲸":"鯨","鲮":"鯪","鲰":"鯫","鲶":"鯰","鲺":"鯴","鲹":"鰺","鲫":"鯽","鳊":"鯿","鳈":"鰁","鲗":"鰂","鳂":"鰃","鲽":"鰈","鳇":"鰉","鳅":"鰍","鲾":"鰏","鳄":"鱷","鳆":"鰒","鳃":"鰓","鳁":"鰮","鳒":"鰜","鳑":"鰟","鳋":"鰠","鲥":"鰣","鳏":"鰥","鳎":"鰨","鳐":"鰩","鳍":"鰭","鲢":"鰱","鳌":"鰲","鳓":"鰳","鳘":"鰵","鲦":"鰷","鲣":"鰹","鳗":"鰻","鳛":"鰼","鳔":"鰾","鳉":"鱂","鳙":"鱅","鳕":"鱈","鳖":"鱉","鳟":"鱒","鳝":"鱔","鳜":"鱖","鳞":"鱗","鲟":"鱘","鲼":"鱝","鲎":"鱟","鲙":"鱠","鳣":"鱣","鳡":"鱤","鳢":"鱧","鲿":"鱨","鲚":"鱭","鳠":"鱯","鲈":"鱸","鲡":"鱺","鸟":"鳥","鸠":"鳩","鸤":"鳲","鸣":"鳴","鸢":"鳶","鸩":"鴆","鸨":"鴇","鸦":"鴉","鸰":"鴒","鸵":"鴕","鸳":"鴛","鸲":"鴝","鸮":"鴞","鸱":"鴟","鸪":"鴣","鸯":"鴦","鸭":"鴨","鸴":"鷽","鸸":"鴯","鸹":"鴰","鸻":"鴴","鸿":"鴻","鸽":"鴿","鸺":"鵂","鸼":"鵃","鹀":"鵐","鹃":"鵑","鹆":"鵒","鹁":"鵓","鹈":"鵜","鹅":"鵝","鹄":"鵠","鹉":"鵡","鹌":"鵪","鹏":"鵬","鹐":"鵮","鹎":"鵯","鹊":"鵲","鹓":"鵷","鹍":"鵾","鸫":"鶇","鹑":"鶉","鹒":"鶊","鹋":"鶓","鹙":"鶖","鹕":"鶘","鹗":"鶚","鹖":"鶡","鹛":"鶥","鹜":"鶩","鸧":"鶬","鹟":"鶲","鹤":"鶴","鹠":"鶹","鹡":"鶺","鹘":"鶻","鹣":"鶼","鹚":"鶿","鹢":"鷁","鹞":"鷂","鹝":"鷊","鹧":"鷓","鹥":"鷖","鸥":"鷗","鸷":"鷙","鹨":"鷚","鸶":"鷥","鹪":"鷦","鹔":"鷫","鹩":"鷯","鹫":"鷲","鹇":"鷳","鹬":"鷸","鹰":"鷹","鹭":"鷺","鹯":"鸇","鹱":"鸌","鹲":"鸏","鸬":"鸕","鹴":"鸘","鹦":"鸚","鹳":"鸛","鹂":"鸝","鸾":"鸞","鹾":"鹺","麦":"麥","麸":"麩","黄":"黃","黉":"黌","黡":"黶","黩":"黷","黪":"黲","黾":"黽","鼋":"黿","鼌":"鼂","鼍":"鼉","鼹":"鼴","齄":"齇","齐":"齊","齑":"齏","齿":"齒","龀":"齔","龁":"齕","龂":"齗","龅":"齙","龇":"齜","龃":"齟","龆":"齠","龄":"齡","龈":"齦","龊":"齪","龉":"齬","龋":"齲","龌":"齷","龙":"龍","龚":"龔","龛":"龕","龟":"龜","䌶":"䊷","䜥":"𧩙","伣":"俔","俫":"倈","刹":"剎","厐":"龎","厘":"釐","呐":"吶","㖞":"喎","𡒄":"壈","姹":"奼","弑":"弒","彝":"彞","恒":"恆","悮":"悞","戯":"戱","挽":"挽","捝":"挩","揾":"搵","㧑":"撝","㧟":"擓","杆":"桿","栗":"栗","梿":"槤","棁":"梲","榅":"榲","㱮":"殨","灶":"灶","煴":"熅","疭":"瘲","䁖":"瞜","祃":"禡","窎":"窵","䇲":"筴","筼":"篔","䌷":"紬","䌹":"絅","䌸":"縳","䍁":"繸","肮":"骯","肴":"餚","蔂":"虆","蕰":"薀","蘖":"櫱","訚":"誾","䜣":"訢","讬":"託","酂":"酇","钅":"釒","钜":"鉅","铇":"鉋","镟":"鏇","霡":"霢","饣":"飠","鲃":"䰾","鳚":"䲁","䴓":"鳾","䴕":"鴷","䴔":"鵁","䴖":"鶄","䴗":"鶪","䴘":"鷈","䴙":"鷿","麽":"麼","后":"後","凃":"塗","㑩":"儸","准":"準","𫔀":"鍊","面":"麵","舍":"捨","松":"鬆","𫔮":"閒","痳":"痲","占":"佔","借":"藉","制":"製","征":"徵","喂":"餵","只":"隻","炮":"砲","奸":"姦","困":"睏","志":"誌","布":"佈","系":"繫","分":"份","梁":"樑","䌽":"綵","板":"闆","注":"註","克":"剋","唇":"唇","𪸩":"煇","𫗭":"餵","𫗪":"餧","鹹":"咸","刬":"剗","铲":"鏟","采":"採","昵":"暱","𫄤":"繨","㓥":"劏","㳽":"瀰","𫔇":"鎞","汙":"汙","遊":"遊","夥":"夥","哢":"哢","淩":"淩","紮":"紮","癡":"癡","薑":"薑","扡":"扡","撚":"撚","遝":"遝","竈":"竈","黴":"黴","欲":"欲","慾":"慾","讚":"讚","菸":"菸","拾":"拾","十":"十","証":"証","捲":"捲","卷":"卷","燻":"燻","熏":"熏","籲":"籲","龥":"龥","蹠":"蹠","矽":"矽","脩":"脩","修":"修","剷":"剷","劈":"劈","擗":"擗","核":"核","覈":"覈","呼":"呼","呵":"呵","脣":"脣","升":"升","昇":"昇","磐":"磐","溪":"溪","渓":"渓","谿":"谿","嵠":"嵠","祐":"祐","佑":"佑","媮":"媮","偷":"偷","罋":"罋","甕":"甕","闇":"闇","暗":"暗","痺":"痺","痹":"痹","雇":"雇","僱":"僱","秘":"秘","祕":"祕","周":"周","週":"週","闢":"闢","簷":"簷","湧":"湧","家":"家","傢":"傢","亙":"亙","洩":"洩","泄":"泄","珮":"珮","佩":"佩","尅":"尅","剿":"剿","勦":"勦","沉":"沉","沈":"沈","搾":"搾","榨":"榨","筱":"筱","篠":"篠","陞":"陞","獃":"獃","盃":"盃","牋":"牋","竝":"竝","弔":"弔","徬":"徬","彷":"彷","喦":"喦","巖":"巖","岩":"岩","劄":"劄","噪":"噪","譟":"譟","彫":"彫","雕":"雕","衊":"衊","蔑":"蔑","蒙":"蒙","濛":"濛","矇":"矇","懞":"懞","啣":"啣","嫺":"嫺","鞦":"鞦","鬨":"鬨","譁":"譁","箇":"箇","猛":"猛"},kt.table_tw2cn={"萬":"万","與":"与","醜":"丑","專":"专","業":"业","叢":"丛","東":"东","絲":"丝","丟":"丢","兩":"两","嚴":"严","並":"并","喪":"丧","個":"个","爿":"丬","豐":"丰","臨":"临","為":"为","麗":"丽","舉":"举","麼":"么","義":"义","烏":"乌","樂":"乐","喬":"乔","習":"习","鄉":"乡","書":"书","買":"买","亂":"乱","乾":"干","爭":"争","於":"于","虧":"亏","雲":"云","亙":"亙","亞":"亚","產":"产","畝":"亩","親":"亲","褻":"亵","嚲":"亸","億":"亿","僅":"仅","僕":"仆","從":"从","侖":"仑","倉":"仓","儀":"仪","們":"们","價":"价","伕":"夫","眾":"众","優":"优","夥":"夥","會":"会","傴":"伛","傘":"伞","偉":"伟","傳":"传","傷":"伤","倀":"伥","倫":"伦","傖":"伧","偽":"伪","佇":"伫","佈":"布","體":"体","佔":"占","佘":"佘","餘":"馀","傭":"佣","僉":"佥","併":"并","來":"来","俠":"侠","侶":"侣","僥":"侥","偵":"侦","側":"侧","僑":"侨","儈":"侩","儕":"侪","儂":"侬","侷":"局","俁":"俣","係":"系","儔":"俦","儼":"俨","倆":"俩","儷":"俪","儉":"俭","倖":"幸","倣":"仿","債":"债","傾":"倾","傯":"偬","偸":"偷","偺":"咱","僂":"偻","僨":"偾","償":"偿","傑":"杰","備":"备","傚":"效","傢":"傢","儻":"傥","儐":"傧","儲":"储","儺":"傩","僞":"伪","僱":"僱","儅":"儅","儘":"尽","儸":"㑩","儹":"攒","兒":"儿","兇":"凶","兌":"兑","兗":"兖","黨":"党","內":"内","蘭":"兰","關":"关","興":"兴","茲":"兹","養":"养","獸":"兽","囅":"冁","岡":"冈","冊":"册","寫":"写","軍":"军","農":"农","塚":"冢","冪":"幂","馮":"冯","沖":"冲","決":"决","況":"况","凍":"冻","淨":"净","凃":"涂","淒":"凄","涼":"凉","淩":"淩","減":"减","湊":"凑","凜":"凛","凟":"渎","幾":"几","鳳":"凤","処":"处","鳧":"凫","憑":"凭","凱":"凯","凴":"凭","擊":"击","鑿":"凿","芻":"刍","劃":"划","劉":"刘","則":"则","剛":"刚","創":"创","刪":"删","別":"别","剄":"刭","劊":"刽","劌":"刿","剴":"剀","劑":"剂","剋":"克","剮":"剐","劍":"剑","剝":"剥","劇":"剧","劄":"劄","劒":"剑","勸":"劝","辦":"办","務":"务","勱":"劢","動":"动","勵":"励","勁":"劲","勞":"劳","勢":"势","勳":"勋","勗":"勖","勩":"勚","勛":"勋","勝":"胜","勣":"绩","勦":"勦","勻":"匀","匭":"匦","匱":"匮","匯":"汇","匲":"奁","匳":"奁","匵":"椟","區":"区","醫":"医","華":"华","協":"协","單":"单","賣":"卖","蔔":"卜","盧":"卢","鹵":"卤","臥":"卧","衛":"卫","卻":"却","卹":"恤","巹":"卺","廠":"厂","廳":"厅","曆":"历","厲":"厉","壓":"压","厭":"厌","厙":"厍","廁":"厕","厛":"厅","厠":"厕","廂":"厢","厴":"厣","厤":"历","廈":"厦","廚":"厨","廄":"厩","廝":"厮","厰":"厂","縣":"县","參":"参","靉":"叆","靆":"叇","雙":"双","發":"发","變":"变","敘":"叙","疊":"叠","葉":"叶","號":"号","歎":"叹","嘰":"叽","籲":"籲","吒":"吒","嚇":"吓","呂":"吕","嗎":"吗","唚":"吣","噸":"噸","聽":"听","啟":"启","吳":"吴","嘸":"呒","囈":"呓","嘔":"呕","嚦":"呖","唄":"呗","員":"员","咼":"呙","嗆":"呛","嗚":"呜","詠":"咏","哢":"哢","嚨":"咙","嚀":"咛","噝":"咝","諮":"谘","噅":"咴","鹹":"咸","響":"响","啞":"哑","噠":"哒","嘵":"哓","嗶":"哔","噦":"哕","嘩":"哗","噲":"哙","嚌":"哜","噥":"哝","喲":"哟","唕":"唣","嘜":"唛","嗊":"唝","嘮":"唠","啢":"唡","嗩":"唢","喚":"唤","唸":"念","問":"问","啓":"启","啗":"啖","啣":"啣","嘖":"啧","嗇":"啬","囀":"啭","齧":"啮","囉":"啰","嘽":"啴","嘯":"啸","喒":"咱","喦":"喦","喫":"吃","噴":"喷","嘍":"喽","嚳":"喾","囁":"嗫","噯":"嗳","嘆":"叹","嘗":"尝","噓":"嘘","嚶":"嘤","囑":"嘱","噁":"恶","嚕":"噜","噹":"当","嚐":"尝","嚙":"啮","囂":"嚣","嚥":"咽","嚮":"向","謔":"谑","嚻":"嚣","囌":"苏","囘":"回","團":"团","囪":"囱","囬":"回","園":"园","囯":"国","圍":"围","圇":"囵","國":"国","圖":"图","圓":"圆","聖":"圣","壙":"圹","場":"场","壞":"坏","塊":"块","堅":"坚","壇":"坛","壢":"坜","壩":"坝","塢":"坞","墳":"坟","墜":"坠","坰":"垧","壟":"垄","壚":"垆","壘":"垒","墾":"垦","堊":"垩","墊":"垫","埡":"垭","墶":"垯","壋":"垱","塏":"垲","堖":"垴","垵":"埯","垻":"坝","塒":"埘","塤":"埙","堝":"埚","埰":"采","執":"执","塹":"堑","墮":"堕","堦":"阶","堯":"尧","報":"报","堿":"碱","壪":"塆","塋":"茔","塗":"凃","塲":"场","塵":"尘","塼":"砖","牆":"墙","墝":"硗","墰":"坛","墻":"墙","壎":"埙","壜":"坛","壠":"垅","壯":"壮","聲":"声","殼":"壳","壺":"壶","壼":"壸","壽":"寿","夀":"寿","處":"处","複":"复","夠":"够","夢":"梦","頭":"头","誇":"夸","夾":"夹","奪":"夺","奩":"奁","奐":"奂","奮":"奋","獎":"奖","奧":"奥","妝":"妆","婦":"妇","媽":"妈","嫵":"妩","嫗":"妪","媯":"妫","姍":"姗","薑":"薑","姦":"奸","姪":"侄","婁":"娄","婭":"娅","嬈":"娆","嬌":"娇","孌":"娈","娛":"娱","娬":"妩","媧":"娲","嫻":"娴","婬":"淫","嫿":"婳","嬰":"婴","嬋":"婵","嬸":"婶","媼":"媪","媮":"媮","嫋":"袅","嬡":"嫒","嬪":"嫔","嬙":"嫱","嫺":"嫺","嬀":"妫","嬝":"袅","嬤":"嬷","嬭":"奶","嬾":"懒","孃":"娘","孫":"孙","學":"学","孿":"孪","寧":"宁","寶":"宝","實":"实","寵":"宠","審":"审","憲":"宪","宮":"宫","寬":"宽","賓":"宾","寢":"寝","對":"对","尋":"寻","導":"导","尅":"尅","將":"将","爾":"尔","尲":"尴","尷":"尴","屍":"尸","盡":"尽","層":"层","屭":"屃","屆":"届","屜":"屉","屓":"屃","屬":"属","屢":"屡","屨":"屦","嶼":"屿","歲":"岁","豈":"岂","嶇":"岖","崗":"岗","峴":"岘","嶴":"岙","嵐":"岚","島":"岛","嶺":"岭","嶽":"岳","崠":"岽","巋":"岿","嶨":"峃","嶧":"峄","峽":"峡","嶢":"峣","嶠":"峤","崢":"峥","巒":"峦","嶗":"崂","崍":"崃","嶮":"崄","崐":"昆","崑":"昆","崙":"仑","崬":"岽","嶄":"崭","崳":"嵛","嵗":"岁","嶸":"嵘","嶔":"嵚","嶁":"嵝","巔":"巅","巖":"巖","鞏":"巩","巰":"巯","幣":"币","帥":"帅","師":"师","幃":"帏","帳":"帐","簾":"帘","幟":"帜","帶":"带","幀":"帧","幫":"帮","幬":"帱","幘":"帻","幗":"帼","襆":"幞","幱":"襕","幹":"干","廣":"广","莊":"庄","慶":"庆","廬":"庐","廡":"庑","庫":"库","應":"应","廟":"庙","龐":"庞","廢":"废","廎":"庼","廕":"荫","廩":"廪","廻":"回","廼":"乃","開":"开","異":"异","棄":"弃","弔":"弔","張":"张","彌":"弥","弳":"弪","彎":"弯","強":"强","彈":"弹","彆":"别","彊":"强","歸":"归","當":"当","錄":"录","彙":"汇","彜":"彝","彞":"彝","彠":"彟","彥":"彦","彫":"彫","徹":"彻","彿":"佛","徑":"径","徠":"徕","禦":"御","復":"复","徬":"徬","徴":"征","徵":"征","憶":"忆","懺":"忏","憂":"忧","愾":"忾","懷":"怀","態":"态","慫":"怂","憮":"怃","慪":"怄","悵":"怅","愴":"怆","憐":"怜","總":"总","懟":"怼","懌":"怿","恆":"恒","戀":"恋","恥":"耻","懇":"恳","惡":"恶","慟":"恸","懨":"恹","愷":"恺","惻":"恻","惱":"恼","惲":"恽","悅":"悦","愨":"悫","懸":"悬","慳":"悭","憫":"悯","悶":"闷","悽":"悽","驚":"惊","懼":"惧","慘":"惨","懲":"惩","憊":"惫","愜":"惬","慚":"惭","憚":"惮","慣":"惯","湣":"愍","愛":"爱","慍":"愠","憤":"愤","憒":"愦","願":"愿","慄":"栗","慇":"殷","懾":"慑","慙":"惭","慤":"悫","憖":"慭","慮":"虑","慴":"慑","慼":"戚","慾":"慾","懍":"懔","懣":"懑","懶":"懒","懕":"恹","懞":"懞","懽":"欢","戇":"戆","戔":"戋","戲":"戏","戧":"戗","戰":"战","戩":"戬","戯":"戏","戶":"户","紮":"紮","撲":"扑","扡":"扡","擴":"扩","捫":"扪","掃":"扫","揚":"扬","擾":"扰","撫":"抚","拋":"抛","摶":"抟","摳":"抠","掄":"抡","搶":"抢","護":"护","擔":"担","擬":"拟","攏":"拢","揀":"拣","擁":"拥","攔":"拦","擰":"拧","撥":"拨","擇":"择","掛":"挂","摯":"挚","攣":"挛","掗":"挜","撾":"挝","撻":"挞","挾":"挟","撓":"挠","擋":"挡","撟":"挢","掙":"挣","擠":"挤","揮":"挥","撏":"挦","撈":"捞","損":"损","撿":"捡","換":"换","搗":"捣","捨":"舍","據":"据","捲":"捲","撚":"撚","採":"采","擄":"掳","摑":"掴","擲":"掷","撣":"掸","摻":"掺","摜":"掼","摣":"揸","揹":"背","攬":"揽","撳":"揿","攙":"搀","擱":"搁","摟":"搂","攪":"搅","搆":"构","搇":"揿","搖":"摇","攜":"携","搾":"搾","攝":"摄","攄":"摅","擺":"摆","擯":"摈","攤":"摊","摺":"折","攖":"撄","撐":"撑","攆":"撵","擷":"撷","擼":"撸","攛":"撺","擕":"携","擻":"擞","擡":"抬","擣":"捣","擧":"举","攢":"攒","攩":"挡","攷":"考","敵":"敌","敍":"叙","敗":"败","斂":"敛","敭":"扬","數":"数","敺":"驱","斃":"毙","齋":"斋","斕":"斓","鬥":"斗","斬":"斩","斷":"断","旂":"旗","無":"无","舊":"旧","時":"时","曠":"旷","暘":"旸","昇":"昇","曇":"昙","晝":"昼","曨":"昽","顯":"显","晉":"晋","曬":"晒","曉":"晓","曄":"晔","暈":"晕","暉":"晖","暫":"暂","暢":"畅","曖":"暧","暱":"昵","曏":"向","曡":"叠","朧":"胧","術":"术","樸":"朴","機":"机","殺":"杀","雜":"杂","權":"权","條":"条","楊":"杨","榪":"杩","極":"极","構":"构","樅":"枞","樞":"枢","棗":"枣","櫪":"枥","梘":"枧","棖":"枨","槍":"枪","楓":"枫","梟":"枭","枴":"拐","櫃":"柜","檸":"柠","柵":"栅","柺":"拐","檉":"柽","梔":"栀","標":"标","棧":"栈","櫛":"栉","櫳":"栊","棟":"栋","櫨":"栌","櫟":"栎","欄":"栏","樹":"树","棲":"栖","樣":"样","欒":"栾","棬":"桊","椏":"桠","橈":"桡","楨":"桢","榿":"桤","橋":"桥","樺":"桦","檜":"桧","槳":"桨","樁":"桩","桿":"杆","梱":"捆","檮":"梼","棶":"梾","檢":"检","欞":"棂","槨":"椁","櫝":"椟","槧":"椠","欏":"椤","橢":"椭","樓":"楼","欖":"榄","櫬":"榇","櫚":"榈","櫸":"榉","榦":"干","榮":"荣","槃":"盘","槓":"杠","檟":"槚","檻":"槛","檳":"槟","櫧":"槠","槼":"规","樑":"梁","橫":"横","檣":"樯","櫻":"樱","樷":"丛","櫫":"橥","橰":"槔","櫥":"橱","櫓":"橹","櫞":"橼","檁":"檩","簷":"簷","檯":"台","檾":"苘","櫂":"棹","櫺":"棂","欑":"攒","歡":"欢","歟":"欤","歐":"欧","欽":"钦","歗":"啸","歛":"敛","歷":"历","殲":"歼","歿":"殁","殤":"殇","殘":"残","殞":"殒","殮":"殓","殫":"殚","殯":"殡","毆":"殴","毀":"毁","轂":"毂","毉":"医","畢":"毕","氈":"毡","毧":"绒","毬":"球","毿":"毵","氂":"牦","氌":"氇","氊":"毡","氣":"气","氫":"氢","氬":"氩","氳":"氲","氾":"泛","漢":"汉","汎":"泛","汙":"汙","汚":"污","湯":"汤","洶":"汹","沍":"冱","沒":"没","遝":"遝","溝":"沟","灃":"沣","漚":"沤","瀝":"沥","淪":"沦","滄":"沧","渢":"沨","溈":"沩","滬":"沪","濔":"沵","濘":"泞","淚":"泪","澩":"泶","瀧":"泷","瀘":"泸","濼":"泺","瀉":"泻","潑":"泼","澤":"泽","涇":"泾","潔":"洁","灑":"洒","洩":"洩","窪":"洼","浹":"浃","淺":"浅","漿":"浆","澆":"浇","湞":"浈","溮":"浉","濁":"浊","測":"测","澮":"浍","濟":"济","瀏":"浏","滻":"浐","渾":"浑","滸":"浒","濃":"浓","潯":"浔","濜":"浕","湧":"湧","涖":"莅","濤":"涛","澇":"涝","淶":"涞","漣":"涟","潿":"涠","渦":"涡","溳":"涢","渙":"涣","滌":"涤","潤":"润","澗":"涧","漲":"涨","澀":"涩","澱":"淀","淥":"渌","淵":"渊","漬":"渍","瀆":"渎","漸":"渐","澠":"渑","漁":"渔","瀋":"沈","滲":"渗","溫":"温","遊":"遊","灣":"湾","濕":"湿","潰":"溃","濺":"溅","漵":"溆","漊":"溇","準":"准","溼":"湿","滅":"灭","滎":"荥","潷":"滗","滙":"汇","滾":"滚","滯":"滞","灩":"滟","灄":"滠","滿":"满","瀅":"滢","濾":"滤","濫":"滥","灤":"滦","濱":"滨","灘":"滩","澦":"滪","滷":"卤","潁":"颍","瀠":"潆","瀟":"潇","瀲":"潋","濰":"潍","潙":"沩","潛":"潜","潟":"舄","瀦":"潴","澁":"涩","澂":"澄","瀾":"澜","瀨":"濑","瀕":"濒","濛":"濛","濬":"浚","濶":"阔","瀰":"㳽","灝":"灏","灕":"漓","灧":"滟","燈":"灯","靈":"灵","災":"灾","燦":"灿","煬":"炀","爐":"炉","燉":"炖","煒":"炜","熗":"炝","炤":"照","點":"点","煉":"炼","熾":"炽","爍":"烁","爛":"烂","烴":"烃","燭":"烛","煙":"烟","煩":"烦","燒":"烧","燁":"烨","燴":"烩","燙":"烫","燼":"烬","熱":"热","煥":"焕","燜":"焖","燾":"焘","煆":"煅","煖":"暖","煢":"茕","熒":"荧","熲":"颎","燄":"焰","燐":"磷","營":"营","燬":"毁","燻":"燻","燿":"耀","爗":"烨","爲":"为","爺":"爷","牀":"床","牋":"牋","牘":"牍","牐":"闸","犛":"牦","牴":"抵","牽":"牵","犧":"牺","犢":"犊","犖":"荦","狀":"状","獷":"犷","獁":"犸","猶":"犹","狽":"狈","麅":"狍","獮":"狝","獰":"狞","獨":"独","狹":"狭","獅":"狮","獪":"狯","猙":"狰","獄":"狱","猻":"狲","獫":"猃","獵":"猎","獼":"猕","玀":"猡","豬":"猪","貓":"猫","蝟":"猬","獻":"献","獃":"獃","獺":"獭","獲":"获","玆":"兹","璣":"玑","璵":"玙","瑒":"玚","瑪":"玛","玨":"珏","瑋":"玮","環":"环","現":"现","瑲":"玱","璽":"玺","瑉":"珉","琺":"珐","瓏":"珑","珮":"珮","璫":"珰","琿":"珲","琍":"璃","璡":"琎","璉":"琏","瑣":"琐","琯":"管","瓊":"琼","瑤":"瑶","瑩":"莹","瑯":"琅","璦":"瑷","璿":"璇","瓔":"璎","瓚":"瓒","甕":"甕","甌":"瓯","甎":"砖","甖":"罂","産":"产","甦":"苏","甯":"宁","電":"电","畫":"画","畱":"留","疇":"畴","癤":"疖","療":"疗","瘧":"疟","癘":"疠","瘍":"疡","鬁":"疬","瘡":"疮","瘋":"疯","皰":"疱","癰":"痈","痙":"痉","癢":"痒","瘂":"痖","痠":"酸","癆":"痨","瘓":"痪","癇":"痫","癡":"癡","痺":"痺","癉":"瘅","瘮":"瘆","瘉":"愈","瘞":"瘗","瘺":"瘘","癟":"瘪","癱":"瘫","瘻":"瘘","癮":"瘾","癭":"瘿","癒":"愈","癩":"癞","癬":"癣","癥":"症","癧":"疬","癲":"癫","臒":"癯","皚":"皑","皺":"皱","皸":"皲","盃":"盃","盞":"盏","鹽":"盐","監":"监","蓋":"盖","盜":"盗","盤":"盘","盪":"荡","瞘":"眍","眎":"视","眡":"视","眥":"眦","矓":"眬","著":"着","睜":"睁","睏":"困","睞":"睐","瞼":"睑","瞞":"瞒","矚":"瞩","矇":"矇","矯":"矫","磯":"矶","矽":"矽","礬":"矾","礦":"矿","碭":"砀","碼":"码","磚":"砖","硨":"砗","硯":"砚","碸":"砜","砲":"炮","礪":"砺","礱":"砻","礫":"砾","礎":"础","硜":"硁","硃":"朱","碩":"硕","硤":"硖","磽":"硗","磑":"硙","礄":"硚","確":"确","硶":"碜","鹼":"硷","礙":"碍","磧":"碛","磣":"碜","镟":"碹","磐":"磐","礮":"炮","禮":"礼","禕":"祎","祐":"祐","祕":"祕","禰":"祢","禎":"祯","禱":"祷","禍":"祸","祿":"禄","稟":"禀","禪":"禅","離":"离","禿":"秃","稈":"秆","秈":"籼","種":"种","積":"积","稱":"称","穢":"秽","穠":"秾","稅":"税","穭":"稆","稜":"棱","穌":"稣","稭":"秸","穩":"稳","穀":"谷","穎":"颖","穡":"穑","穨":"颓","穫":"获","窮":"穷","竊":"窃","竅":"窍","窯":"窑","竄":"窜","窩":"窝","窺":"窥","竇":"窦","窶":"窭","窰":"窑","竈":"竈","豎":"竖","竝":"竝","競":"竞","竪":"竖","篤":"笃","筍":"笋","筆":"笔","筧":"笕","箋":"笺","籠":"笼","籩":"笾","築":"筑","篳":"筚","篩":"筛","簹":"筜","箏":"筝","籌":"筹","簽":"签","簡":"简","箇":"箇","籙":"箓","箠":"棰","簀":"箦","篋":"箧","籜":"箨","籮":"箩","簞":"箪","簫":"箫","節":"节","範":"范","簣":"篑","簍":"篓","篛":"箬","篠":"篠","籃":"篮","籬":"篱","簑":"蓑","籪":"簖","籟":"籁","籐":"藤","籢":"奁","籤":"签","籥":"钥","糴":"籴","類":"类","糶":"粜","糲":"粝","粵":"粤","粧":"妆","糞":"粪","粬":"曲","糧":"粮","糝":"糁","餱":"糇","糢":"模","糰":"团","糸":"纟","糾":"纠","紀":"纪","紂":"纣","約":"约","紅":"红","紆":"纡","紇":"纥","紈":"纨","紉":"纫","紋":"纹","納":"纳","紐":"纽","紓":"纾","純":"纯","紕":"纰","紖":"纼","紗":"纱","紘":"纮","紙":"纸","級":"级","紛":"纷","紜":"纭","紝":"纴","紡":"纺","紥":"扎","緊":"紧","細":"细","紱":"绂","紲":"绁","紳":"绅","紵":"纻","紹":"绍","紺":"绀","紼":"绋","紿":"绐","絀":"绌","終":"终","絃":"弦","組":"组","絆":"绊","絍":"纴","絎":"绗","絏":"绁","結":"结","絕":"绝","絛":"绦","絝":"绔","絞":"绞","絡":"络","絢":"绚","給":"给","絨":"绒","絰":"绖","統":"统","絳":"绛","縶":"絷","絹":"绢","綁":"绑","綃":"绡","綆":"绠","綈":"绨","綉":"绣","綌":"绤","綏":"绥","綑":"捆","經":"经","綜":"综","綞":"缍","綠":"绿","綢":"绸","綣":"绻","綫":"线","綬":"绶","維":"维","綯":"绹","綰":"绾","綱":"纲","網":"网","綳":"绷","綴":"缀","綵":"䌽","綸":"纶","綹":"绺","綺":"绮","綻":"绽","綽":"绰","綾":"绫","綿":"绵","緄":"绲","緇":"缁","緋":"绯","緍":"缗","緒":"绪","緓":"绬","緔":"绱","緗":"缃","緘":"缄","緙":"缂","線":"缐","緜":"绵","緝":"缉","緞":"缎","締":"缔","緡":"缗","緣":"缘","緤":"绁","緦":"缌","編":"编","緩":"缓","緬":"缅","緯":"纬","緱":"缑","緲":"缈","練":"练","緶":"缏","緹":"缇","緻":"致","緼":"缊","縂":"总","縈":"萦","縉":"缙","縊":"缢","縋":"缒","縐":"绉","縑":"缣","縕":"缊","縗":"缞","縚":"绦","縛":"缚","縝":"缜","縞":"缟","縟":"缛","縧":"绦","縫":"缝","縭":"缡","縮":"缩","縯":"演","縱":"纵","縲":"缧","縴":"纤","縵":"缦","縷":"缕","縹":"缥","績":"绩","繃":"绷","繅":"缫","繆":"缪","繈":"襁","繒":"缯","織":"织","繕":"缮","繖":"伞","繙":"翻","繚":"缭","繞":"绕","繡":"绣","繢":"缋","繦":"襁","繩":"绳","繪":"绘","繫":"系","繭":"茧","繮":"缰","繯":"缳","繰":"缲","繳":"缴","繹":"绎","繼":"继","繽":"缤","繾":"缱","纇":"颣","纈":"缬","纊":"纩","續":"续","纍":"累","纏":"缠","纓":"缨","纖":"纤","纘":"缵","纜":"缆","韁":"缰","缽":"钵","罌":"罂","罈":"坛","罋":"罋","罎":"坛","罏":"垆","羅":"罗","罰":"罚","罷":"罢","羆":"罴","罵":"骂","罸":"罚","羈":"羁","羋":"芈","羥":"羟","羨":"羡","羢":"绒","羶":"膻","翹":"翘","翽":"翙","翬":"翚","翺":"翱","耑":"端","耡":"锄","耮":"耢","耬":"耧","聳":"耸","聶":"聂","聾":"聋","職":"职","聹":"聍","聯":"联","聞":"闻","聵":"聩","聰":"聪","聼":"听","肅":"肃","腸":"肠","膚":"肤","膁":"肷","腎":"肾","腫":"肿","脹":"胀","脅":"胁","膽":"胆","腖":"胨","臚":"胪","脛":"胫","膠":"胶","脇":"胁","脈":"脉","膾":"脍","髒":"脏","臍":"脐","腦":"脑","膿":"脓","臠":"脔","腳":"脚","脣":"脣","脩":"脩","脫":"脱","腡":"脶","臉":"脸","臘":"腊","醃":"腌","膕":"腘","齶":"腭","膩":"腻","靦":"腼","膃":"腽","騰":"腾","臏":"膑","臢":"臜","臟":"脏","臯":"皋","臺":"台","輿":"舆","舖":"铺","舘":"馆","艤":"舣","艦":"舰","艙":"舱","艫":"舻","艢":"樯","艣":"橹","艪":"橹","艱":"艰","豔":"艳","艷":"艳","艸":"艸","藝":"艺","薌":"芗","蕪":"芜","蘆":"芦","蓯":"苁","葦":"苇","藶":"苈","莧":"苋","萇":"苌","蒼":"苍","苧":"苎","蘇":"苏","蘋":"苹","莖":"茎","蘢":"茏","蔦":"茑","荊":"荆","薦":"荐","薘":"荙","莢":"荚","蕘":"荛","蓽":"荜","蕎":"荞","薈":"荟","薺":"荠","蕩":"荡","葷":"荤","蕁":"荨","藎":"荩","蓀":"荪","蔭":"荫","蕒":"荬","葒":"荭","葤":"荮","藥":"药","蒞":"莅","蓧":"莜","萊":"莱","蓮":"莲","蒔":"莳","萵":"莴","薟":"莶","蕕":"莸","鶯":"莺","蓴":"莼","菴":"庵","菸":"菸","蘀":"萚","蘿":"萝","螢":"萤","蕭":"萧","薩":"萨","葠":"参","葯":"药","蔥":"葱","蕆":"蒇","蕢":"蒉","蔣":"蒋","蔞":"蒌","蒐":"搜","蒓":"莼","蓆":"席","藍":"蓝","薊":"蓟","蘺":"蓠","蓡":"参","蕷":"蓣","鎣":"蓥","驀":"蓦","蔆":"菱","蔴":"麻","薔":"蔷","蘞":"蔹","藺":"蔺","藹":"蔼","蕓":"芸","蘄":"蕲","蘊":"蕴","藪":"薮","薰":"熏","蘚":"藓","虜":"虏","虛":"虚","蟲":"虫","虯":"虬","蟣":"虮","雖":"虽","蝦":"虾","蠆":"虿","蝕":"蚀","蟻":"蚁","螞":"蚂","蠶":"蚕","蠔":"蚝","蜆":"蚬","蠱":"蛊","蠣":"蛎","蟶":"蛏","蠻":"蛮","蟄":"蛰","蛺":"蛱","蟯":"蛲","螄":"蛳","蠐":"蛴","蛻":"蜕","蝸":"蜗","蠟":"蜡","蠅":"蝇","蟈":"蝈","蟬":"蝉","蠍":"蝎","蝨":"虱","螻":"蝼","蠑":"蝾","螿":"螀","螘":"蚁","蟎":"螨","蠨":"蟏","釁":"衅","衆":"众","衊":"衊","銜":"衔","衚":"胡","衝":"冲","衞":"卫","補":"补","襯":"衬","袞":"衮","衹":"只","襖":"袄","褘":"袆","襪":"袜","襲":"袭","襏":"袯","裝":"装","襠":"裆","褌":"裈","裊":"袅","裌":"夹","裏":"里","裡":"里","褳":"裢","襝":"裣","褲":"裤","襇":"裥","製":"制","褸":"褛","襤":"褴","襍":"杂","襴":"襕","覈":"覈","見":"见","覎":"觃","規":"规","覓":"觅","覔":"觅","視":"视","覘":"觇","覜":"眺","覡":"觋","覥":"觍","覦":"觎","覬":"觊","覯":"觏","覰":"觑","覲":"觐","覷":"觑","覺":"觉","覻":"觑","覽":"览","覿":"觌","觀":"观","觝":"抵","觴":"觞","觸":"触","觶":"觯","訁":"讠","訂":"订","訃":"讣","計":"计","訊":"讯","訌":"讧","討":"讨","訏":"吁","訐":"讦","訒":"讱","訓":"训","訕":"讪","訖":"讫","託":"讬","記":"记","訛":"讹","訝":"讶","訟":"讼","訢":"䜣","訣":"诀","訥":"讷","訦":"谌","訩":"讻","訪":"访","設":"设","許":"许","訴":"诉","訶":"诃","診":"诊","註":"注","証":"証","詁":"诂","詆":"诋","詎":"讵","詐":"诈","詒":"诒","詔":"诏","評":"评","詖":"诐","詗":"诇","詘":"诎","詛":"诅","詞":"词","讋":"詟","詡":"诩","詢":"询","詣":"诣","試":"试","詩":"诗","詫":"诧","詬":"诟","詭":"诡","詮":"诠","詰":"诘","話":"话","該":"该","詳":"详","詵":"诜","詼":"诙","詾":"讻","詿":"诖","誄":"诔","誅":"诛","誆":"诓","譽":"誉","謄":"誊","誌":"志","認":"认","誑":"诳","誒":"诶","誕":"诞","誘":"诱","誚":"诮","語":"语","誠":"诚","誡":"诫","誣":"诬","誤":"误","誥":"诰","誦":"诵","誨":"诲","說":"说","説":"说","誰":"谁","課":"课","誶":"谇","誹":"诽","誼":"谊","調":"调","諂":"谄","諄":"谆","談":"谈","諉":"诿","請":"请","諍":"诤","諏":"诹","諑":"诼","諒":"谅","論":"论","諗":"谂","諛":"谀","諜":"谍","諝":"谞","諞":"谝","諡":"谥","諢":"诨","諤":"谔","諦":"谛","諧":"谐","諫":"谏","諭":"谕","諱":"讳","諳":"谙","諶":"谌","諷":"讽","諸":"诸","諺":"谚","諼":"谖","諾":"诺","謀":"谋","謁":"谒","謂":"谓","謅":"诌","謊":"谎","謎":"谜","謐":"谧","謖":"谡","謗":"谤","謙":"谦","謚":"谥","講":"讲","謝":"谢","謠":"谣","謨":"谟","謫":"谪","謬":"谬","謳":"讴","謹":"谨","謾":"谩","譁":"譁","譆":"嘻","證":"证","譌":"讹","譎":"谲","譏":"讥","譖":"谮","識":"识","譙":"谯","譚":"谭","譜":"谱","譟":"譟","譫":"谵","譭":"毁","譯":"译","議":"议","譴":"谴","譸":"诪","譾":"谫","讀":"读","讁":"谪","讅":"审","讌":"燕","讎":"雠","讐":"雠","讒":"谗","讓":"让","讕":"谰","讖":"谶","讚":"讚","讛":"呓","讜":"谠","讞":"谳","谿":"谿","豶":"豮","貍":"狸","貝":"贝","貞":"贞","貟":"贠","負":"负","財":"财","貢":"贡","貧":"贫","貨":"货","販":"贩","貪":"贪","貫":"贯","責":"责","貯":"贮","貰":"贳","貲":"赀","貳":"贰","貴":"贵","貶":"贬","貸":"贷","貺":"贶","費":"费","貼":"贴","貽":"贻","貿":"贸","賀":"贺","賁":"贲","賂":"赂","賃":"赁","賄":"贿","賅":"赅","資":"资","賈":"贾","賉":"恤","賊":"贼","賍":"赃","賑":"赈","賒":"赊","賔":"宾","賕":"赇","賙":"赒","賚":"赉","賛":"赞","賜":"赐","賞":"赏","賠":"赔","賡":"赓","賢":"贤","賤":"贱","賦":"赋","賧":"赕","質":"质","賫":"赍","賬":"账","賭":"赌","賮":"赆","賴":"赖","賵":"赗","賸":"剩","賺":"赚","賻":"赙","購":"购","賽":"赛","賾":"赜","贄":"贽","贅":"赘","贇":"赟","贈":"赠","贊":"赞","贋":"赝","贍":"赡","贏":"赢","贐":"赆","贓":"赃","贔":"赑","贖":"赎","贗":"赝","贛":"赣","贜":"赃","齎":"赍","赬":"赪","趙":"赵","趕":"赶","趨":"趋","趲":"趱","躉":"趸","躍":"跃","蹌":"跄","蹠":"蹠","躒":"跞","跡":"迹","踐":"践","躂":"跶","蹺":"跷","蹕":"跸","躚":"跹","躋":"跻","跼":"局","踴":"踊","躊":"踌","踡":"蜷","蹤":"踪","躓":"踬","躑":"踯","躡":"蹑","蹣":"蹒","蹟":"迹","躕":"蹰","躥":"蹿","躪":"躏","躦":"躜","軀":"躯","躰":"体","軃":"亸","車":"车","軋":"轧","軌":"轨","軑":"轪","軒":"轩","軔":"轫","軛":"轭","軟":"软","軤":"轷","軫":"轸","軲":"轱","軸":"轴","軹":"轵","軺":"轺","軻":"轲","軼":"轶","軾":"轼","較":"较","輅":"辂","輇":"辁","輈":"辀","載":"载","輊":"轾","輒":"辄","輓":"挽","輔":"辅","輕":"轻","輛":"辆","輜":"辎","輝":"辉","輞":"辋","輟":"辍","輥":"辊","輦":"辇","輩":"辈","輪":"轮","輬":"辌","輭":"软","輯":"辑","輳":"辏","輸":"输","輻":"辐","輼":"辒","輾":"辗","轀":"辒","轄":"辖","轅":"辕","轆":"辘","轉":"转","轍":"辙","轎":"轿","轔":"辚","轟":"轰","轡":"辔","轢":"轹","轤":"轳","辭":"辞","辤":"辞","辯":"辩","辮":"辫","辳":"农","邊":"边","遼":"辽","達":"达","遷":"迁","迆":"迤","過":"过","邁":"迈","運":"运","還":"还","這":"这","進":"进","遠":"远","違":"违","連":"连","遲":"迟","邇":"迩","逕":"迳","迴":"回","迺":"乃","適":"适","選":"选","遜":"逊","遞":"递","邐":"逦","週":"週","邏":"逻","遺":"遗","遙":"遥","鄧":"邓","鄺":"邝","鄔":"邬","郵":"邮","鄒":"邹","鄴":"邺","鄰":"邻","鬱":"郁","郃":"合","郤":"郄","郟":"郏","鄶":"郐","鄭":"郑","鄆":"郓","酈":"郦","鄖":"郧","鄲":"郸","鄕":"乡","鄘":"墉","醞":"酝","醱":"酦","酧":"酬","醯":"酰","醬":"酱","釅":"酽","釃":"酾","釀":"酿","醖":"酝","醻":"酬","醼":"燕","釋":"释","釐":"厘","釓":"钆","釔":"钇","釕":"钌","釗":"钊","釘":"钉","釙":"钋","針":"针","釣":"钓","釤":"钐","釦":"扣","釧":"钏","釩":"钒","釬":"焊","釵":"钗","釷":"钍","釹":"钕","釺":"钎","鈀":"钯","鈁":"钫","鈃":"钘","鈄":"钭","鈅":"钥","鈈":"钚","鈉":"钠","鈍":"钝","鈎":"钩","鈐":"钤","鈑":"钣","鈒":"钑","鈔":"钞","鈕":"钮","鈞":"钧","鈡":"钟","鈣":"钙","鈥":"钬","鈦":"钛","鈧":"钪","鈮":"铌","鈰":"铈","鈳":"钶","鈴":"铃","鈷":"钴","鈸":"钹","鈹":"铍","鈺":"钰","鈽":"钸","鈾":"铀","鈿":"钿","鉀":"钾","鉄":"铁","鉆":"钻","鉈":"铊","鉉":"铉","鉋":"铇","鉍":"铋","鉑":"铂","鉕":"钷","鉗":"钳","鉚":"铆","鉛":"铅","鉞":"钺","鉢":"钵","鉤":"钩","鉦":"钲","鉬":"钼","鉭":"钽","鉲":"锎","鑒":"鉴","鉶":"铏","鉸":"铰","鉺":"铒","鉻":"铬","鉿":"铪","銀":"银","銃":"铳","銅":"铜","銍":"铚","銑":"铣","銓":"铨","銕":"铁","銖":"铢","銘":"铭","銚":"铫","銛":"铦","銠":"铑","銣":"铷","銥":"铱","銦":"铟","銨":"铵","銩":"铥","銪":"铕","銫":"铯","銬":"铐","鑾":"銮","銱":"铞","銲":"焊","銳":"锐","銷":"销","銹":"锈","銻":"锑","銼":"锉","鋁":"铝","鋂":"镅","鋃":"锒","鋅":"锌","鋇":"钡","鋌":"铤","鋏":"铗","鋒":"锋","鋙":"铻","鋜":"镯","鋝":"锊","鋟":"锓","鋣":"铘","鋤":"锄","鋥":"锃","鋦":"锔","鋨":"锇","鋩":"铓","鋪":"铺","鋮":"铖","鋯":"锆","鋰":"锂","鋱":"铽","鋶":"锍","鋸":"锯","鋻":"鉴","鋼":"钢","錁":"锞","錆":"锖","錇":"锫","錈":"锩","錏":"铔","錐":"锥","錒":"锕","錕":"锟","錘":"锤","錙":"锱","錚":"铮","錛":"锛","錟":"锬","錠":"锭","錡":"锜","錢":"钱","錦":"锦","錨":"锚","錩":"锠","錫":"锡","錮":"锢","錯":"错","錳":"锰","錶":"表","錸":"铼","錼":"镎","鏨":"錾","鍀":"锝","鍁":"锨","鍃":"锪","鍆":"钔","鍇":"锴","鍈":"锳","鍊":"炼","鍋":"锅","鍍":"镀","鍔":"锷","鍘":"铡","鍚":"钖","鍛":"锻","鍠":"锽","鍤":"锸","鍥":"锲","鍩":"锘","鍫":"锹","鍬":"锹","鍰":"锾","鍵":"键","鍶":"锶","鍺":"锗","鍼":"针","鍾":"锺","鎂":"镁","鎄":"锿","鎇":"镅","鎊":"镑","鎋":"辖","鎔":"镕","鎖":"锁","鎘":"镉","鎚":"锤","鎛":"镈","鎡":"镃","鎢":"钨","鎦":"镏","鎧":"铠","鎩":"铩","鎪":"锼","鎬":"镐","鎮":"镇","鎰":"镒","鎲":"镋","鎳":"镍","鎵":"镓","鎸":"镌","鎿":"镎","鏃":"镞","鏇":"镟","鏈":"链","鏌":"镆","鏍":"镙","鏐":"镠","鏑":"镝","鏗":"铿","鏘":"锵","鏚":"戚","鏜":"镗","鏝":"镘","鏞":"镛","鏡":"镜","鏢":"镖","鏤":"镂","鏰":"镚","鏵":"铧","鏷":"镤","鏹":"镪","鏽":"锈","鐃":"铙","鐋":"铴","鐐":"镣","鐒":"铹","鐓":"镦","鐔":"镡","鐘":"钟","鐙":"镫","鐝":"镢","鐠":"镨","鐦":"锎","鐧":"锏","鐨":"镄","鐫":"镌","鐮":"镰","鐲":"镯","鐳":"镭","鐵":"铁","鐶":"镮","鐸":"铎","鐺":"铛","鐿":"镱","鑄":"铸","鑊":"镬","鑌":"镔","鑑":"鉴","鑔":"镲","鑕":"锧","鑛":"矿","鑞":"镴","鑠":"铄","鑣":"镳","鑤":"刨","鑥":"镥","鑪":"炉","鑭":"镧","鑰":"钥","鑱":"镵","鑲":"镶","鑷":"镊","鑹":"镩","鑼":"锣","鑽":"钻","钁":"镢","钂":"镋","長":"长","門":"门","閂":"闩","閃":"闪","閆":"闫","閈":"闬","閉":"闭","閌":"闶","閎":"闳","閏":"闰","閑":"闲","閒":"闲","間":"间","閔":"闵","閘":"闸","閙":"闹","閡":"阂","関":"关","閣":"阁","閤":"合","閥":"阀","閨":"闺","閩":"闽","閫":"阃","閬":"阆","閭":"闾","閱":"阅","閲":"阅","閶":"阊","閹":"阉","閻":"阎","閼":"阏","閽":"阍","閾":"阈","閿":"阌","闃":"阒","闆":"板","闈":"闱","闊":"阔","闋":"阕","闌":"阑","闍":"阇","闐":"阗","闒":"阘","闓":"闿","闔":"阖","闕":"阙","闖":"闯","闚":"窥","闞":"阚","闠":"阓","闡":"阐","闢":"闢","闤":"阛","闥":"闼","鬧":"闹","鬮":"阄","鬩":"阋","隊":"队","阬":"坑","阯":"址","陽":"阳","陰":"阴","陣":"阵","階":"阶","際":"际","陸":"陆","隴":"陇","陳":"陈","陘":"陉","陝":"陕","陞":"陞","隉":"陧","隕":"陨","險":"险","隂":"阴","隄":"堤","隨":"随","隱":"隐","隖":"坞","隣":"邻","隸":"隶","隷":"隶","隻":"只","雋":"隽","難":"难","雛":"雏","雞":"鸡","靂":"雳","霧":"雾","霽":"霁","黴":"黴","霑":"沾","霛":"灵","霤":"溜","靄":"霭","靚":"靓","靜":"静","靨":"靥","靭":"韧","鞀":"鼗","鞉":"鼗","韃":"鞑","鞽":"鞒","鞦":"鞦","韉":"鞯","韝":"鞴","韆":"千","韋":"韦","韌":"韧","韍":"韨","韓":"韩","韙":"韪","韜":"韬","韞":"韫","韤":"袜","韻":"韵","頁":"页","頂":"顶","頃":"顷","項":"项","順":"顺","頇":"顸","須":"须","頊":"顼","頌":"颂","頎":"颀","頏":"颃","預":"预","頑":"顽","頒":"颁","頓":"顿","頗":"颇","領":"领","頜":"颌","頡":"颉","頤":"颐","頦":"颏","頫":"俯","頮":"颒","頰":"颊","頲":"颋","頴":"颕","頷":"颔","頸":"颈","頹":"颓","頻":"频","頽":"颓","顆":"颗","題":"题","額":"额","顎":"颚","顏":"颜","顒":"颙","顓":"颛","顔":"颜","顙":"颡","顛":"颠","顢":"颟","顥":"颢","顧":"顾","顫":"颤","顬":"颥","顰":"颦","顱":"颅","顳":"颞","顴":"颧","風":"风","颭":"飐","颮":"飑","颯":"飒","颱":"台","颳":"刮","颶":"飓","颸":"飔","颺":"飏","颻":"飖","颼":"飕","飀":"飗","飃":"飘","飄":"飘","飆":"飙","飇":"飙","飈":"飚","飛":"飞","飢":"饥","飣":"饤","飥":"饦","饗":"飨","飩":"饨","飪":"饪","飫":"饫","飭":"饬","飯":"饭","飲":"饮","飴":"饴","飼":"饲","飽":"饱","飾":"饰","飿":"饳","餃":"饺","餄":"饸","餅":"饼","餉":"饷","餌":"饵","饜":"餍","餎":"饹","餏":"饻","餑":"饽","餒":"馁","餓":"饿","餕":"馂","餖":"饾","餚":"肴","餛":"馄","餜":"馃","餞":"饯","餡":"馅","館":"馆","餳":"饧","餵":"𫗭","餶":"馉","餷":"馇","餺":"馎","餼":"饩","餽":"馈","餾":"馏","餿":"馊","饁":"馌","饃":"馍","饅":"馒","饈":"馐","饉":"馑","饊":"馓","饋":"馈","饌":"馔","饑":"饥","饒":"饶","饝":"馍","饞":"馋","饢":"馕","馬":"马","馭":"驭","馱":"驮","馳":"驰","馴":"驯","馹":"驲","駁":"驳","駐":"驻","駑":"驽","駒":"驹","駔":"驵","駕":"驾","駘":"骀","駙":"驸","駛":"驶","駝":"驼","駟":"驷","駡":"骂","駢":"骈","駭":"骇","駮":"驳","駰":"骃","駱":"骆","駸":"骎","駿":"骏","騁":"骋","騂":"骍","騅":"骓","騌":"骔","騍":"骒","騎":"骑","騏":"骐","騐":"验","騖":"骛","騗":"骗","騙":"骗","騣":"鬃","騤":"骙","騫":"骞","騭":"骘","騮":"骝","騶":"驺","騷":"骚","騸":"骟","騾":"骡","驁":"骜","驂":"骖","驃":"骠","驄":"骢","驅":"驱","驊":"骅","驌":"骕","驍":"骁","驏":"骣","驕":"骄","驗":"验","驘":"骡","驛":"驿","驟":"骤","驢":"驴","驤":"骧","驥":"骥","驦":"骦","驪":"骊","驫":"骉","骾":"鲠","髏":"髅","髖":"髋","髕":"髌","髩":"鬓","髮":"发","鬆":"松","鬍":"胡","鬢":"鬓","鬚":"须","鬦":"斗","鬨":"鬨","鬭":"斗","魘":"魇","魎":"魉","魚":"鱼","魛":"鱽","魢":"鱾","魨":"鲀","魯":"鲁","魴":"鲂","魷":"鱿","魺":"鲄","鮁":"鲅","鮃":"鲆","鮊":"鲌","鮋":"鲉","鮌":"鲧","鮍":"鲏","鮎":"鲇","鮐":"鲐","鮑":"鲍","鮒":"鲋","鮓":"鲊","鮚":"鲒","鮜":"鲘","鮞":"鲕","鮦":"鲖","鮪":"鲔","鮫":"鲛","鮭":"鲑","鮮":"鲜","鮳":"鲓","鮶":"鲪","鮷":"鳀","鮺":"鲝","鯀":"鲧","鯁":"鲠","鯇":"鲩","鯉":"鲤","鯊":"鲨","鯒":"鲬","鯔":"鲻","鯕":"鲯","鯖":"鲭","鯗":"鲞","鯛":"鲷","鯝":"鲴","鯡":"鲱","鯢":"鲵","鯤":"鲲","鯧":"鲳","鯨":"鲸","鯪":"鲮","鯫":"鲰","鯰":"鲶","鯴":"鲺","鯵":"鲹","鯷":"鳀","鯽":"鲫","鯿":"鳊","鰁":"鳈","鰂":"鲗","鰃":"鳂","鰈":"鲽","鰉":"鳇","鰌":"鳅","鰍":"鳅","鰏":"鲾","鰐":"鳄","鰒":"鳆","鰓":"鳃","鰛":"鳁","鰜":"鳒","鰟":"鳑","鰠":"鳋","鰣":"鲥","鰥":"鳏","鰨":"鳎","鰩":"鳐","鰭":"鳍","鰮":"鳁","鰱":"鲢","鰲":"鳌","鰳":"鳓","鰵":"鳘","鰷":"鲦","鰹":"鲣","鰺":"鲹","鰻":"鳗","鰼":"鳛","鰾":"鳔","鱂":"鳉","鱅":"鳙","鱈":"鳕","鱉":"鳖","鱒":"鳟","鱓":"鳝","鱔":"鳝","鱖":"鳜","鱗":"鳞","鱘":"鲟","鱝":"鲼","鱟":"鲎","鱠":"鲙","鱣":"鳣","鱤":"鳡","鱧":"鳢","鱨":"鲿","鱭":"鲚","鱯":"鳠","鱷":"鳄","鱸":"鲈","鱺":"鲡","鼇":"鳌","鳥":"鸟","鳩":"鸠","鳲":"鸤","鳴":"鸣","鳶":"鸢","鴆":"鸩","鴇":"鸨","鴉":"鸦","鴒":"鸰","鴕":"鸵","鴛":"鸳","鴝":"鸲","鴞":"鸮","鴟":"鸱","鴣":"鸪","鴦":"鸯","鴨":"鸭","鴬":"鸴","鴯":"鸸","鴰":"鸹","鴴":"鸻","鴻":"鸿","鴿":"鸽","鵂":"鸺","鵃":"鸼","鵐":"鹀","鵑":"鹃","鵒":"鹆","鵓":"鹁","鵜":"鹈","鵝":"鹅","鵞":"鹅","鵠":"鹄","鵡":"鹉","鵪":"鹌","鵬":"鹏","鵮":"鹐","鵯":"鹎","鵲":"鹊","鵶":"鸦","鵷":"鹓","鵾":"鹍","鶇":"鸫","鶉":"鹑","鶊":"鹒","鶓":"鹋","鶖":"鹙","鶘":"鹕","鶚":"鹗","鶡":"鹖","鶤":"鹍","鶥":"鹛","鶩":"鹜","鶬":"鸧","鶲":"鹟","鶴":"鹤","鶹":"鹠","鶺":"鹡","鶻":"鹘","鶼":"鹣","鶿":"鹚","鷀":"鹚","鷁":"鹢","鷂":"鹞","鷄":"鸡","鷊":"鹝","鷓":"鹧","鷖":"鹥","鷗":"鸥","鷙":"鸷","鷚":"鹨","鷥":"鸶","鷦":"鹪","鷫":"鹔","鷯":"鹩","鷰":"燕","鷲":"鹫","鷳":"鹇","鷴":"鹇","鷸":"鹬","鷹":"鹰","鷺":"鹭","鷼":"鹇","鸇":"鹯","鸌":"鹱","鸎":"莺","鸏":"鹲","鸕":"鸬","鸘":"鹴","鸚":"鹦","鸛":"鹳","鸝":"鹂","鸞":"鸾","鹺":"鹾","麥":"麦","麩":"麸","麪":"面","麯":"曲","麴":"曲","麵":"面","麽":"么","黃":"黄","黌":"黉","黶":"黡","黷":"黩","黲":"黪","黽":"黾","黿":"鼋","鼂":"鼌","鼈":"鳖","鼉":"鼍","鼕":"冬","鼴":"鼹","齇":"齄","齊":"齐","齏":"齑","齒":"齿","齔":"龀","齕":"龁","齗":"龂","齙":"龅","齜":"龇","齟":"龃","齠":"龆","齡":"龄","齣":"齣","齦":"龈","齪":"龊","齬":"龉","齲":"龋","齷":"龌","龍":"龙","龔":"龚","龕":"龛","龜":"龟","䊷":"䌶","𧩙":"䜥","余":"余","俔":"伣","倈":"俫","凈":"净","剎":"刹","叄":"叁","吶":"呐","喎":"㖞","壈":"𡒄","奬":"奖","奼":"姹","幺":"么","弒":"弑","彔":"录","後":"后","悞":"悮","戱":"戯","拾":"拾","挩":"捝","搵":"揾","撝":"㧑","擓":"㧟","暨":"及","朮":"术","杴":"锨","梲":"棁","榲":"榅","槤":"梿","檔":"档","櫱":"蘖","殨":"㱮","殻":"壳","沈":"沈","澐":"沄","灠":"漤","熅":"煴","畵":"画","痾":"疴","瘲":"疭","瞜":"䁖","瞭":"了","瞶":"瞆","礆":"硷","禡":"祃","窵":"窎","筴":"䇲","篔":"筼","籖":"签","糹":"纟","紬":"䌷","絅":"䌹","絶":"绝","緑":"绿","縳":"䌸","繸":"䍁","纔":"才","苎":"苧","薀":"蕰","薴":"苧","藉":"借","藴":"蕴","虆":"蔂","衕":"同","覆":"复","誾":"訚","謡":"谣","謭":"谫","酇":"酂","釒":"钅","鉅":"钜","鋭":"锐","録":"录","闇":"闇","阪":"坂","霢":"霡","鞝":"绱","飠":"饣","骯":"肮","鮝":"鲞","䰾":"鲃","䲁":"鳚","鳬":"凫","鳾":"䴓","鴷":"䴕","鵁":"䴔","鶄":"䴖","鶪":"䴗","鷈":"䴘","鷽":"鸴","鷿":"䴙","麫":"面","龎":"厐","㑹":"会","涂":"涂","錬":"炼","壊":"坏","丑":"丑","么":"么","几":"几","后":"后","斗":"斗","干":"干","虫":"虫","岳":"岳","卜":"卜","于":"于","里":"里","范":"范","朴":"朴","咨":"咨","划":"划","杰":"杰","面":"面","舍":"舍","松":"松","云":"云","咸":"鹹","折":"折","同":"同","胡":"胡","症":"症","郁":"郁","采":"采","栖":"栖","踪":"踪","昵":"昵","厘":"厘","痲":"痳","痳":"痳","怜":"怜","占":"占","借":"借","吨":"吨","制":"制","征":"征","向":"向","喂":"喂","只":"只","困":"困","志":"志","布":"布","系":"系","份":"分","分":"分","梁":"梁","谷":"谷","板":"板","祢":"祢","注":"注","恒":"恒","晒":"晒","杆":"杆","坂":"坂","克":"克","咏":"咏","袜":"袜","仆":"仆","餧":"𫗪","剗":"刬","鏟":"铲","繨":"𫄤","劏":"㓥","鎞":"𫔇","札":"札","污":"污","游":"游","伙":"伙","御":"御","咔":"咔","凌":"凌","扎":"扎","痴":"痴","嚯":"嚯","姜":"姜","扦":"扦","捻":"捻","沓":"沓","栗":"栗","挽":"挽","灶":"灶","霉":"霉","欲":"欲","十":"十","卷":"卷","熏":"熏","吁":"吁","龥":"龥","跖":"跖","硅":"硅","修":"修","犟":"犟","剷":"剷","噼":"噼","劈":"劈","擗":"擗","核":"核","憷":"憷","呼":"呼","唿":"唿","嗬":"嗬","呵":"呵","唇":"唇","升":"升","溪":"溪","渓":"渓","嵠":"嵠","佑":"佑","偷":"偷","瓮":"瓮","暗":"暗","痹":"痹","雇":"雇","秘":"秘","周":"周","檐":"檐","涌":"涌","家":"家","亘":"亘","泄":"泄","佩":"佩","剿":"剿","沉":"沉","榨":"榨","筱":"筱","彷":"彷","岩":"岩","噪":"噪","雕":"雕","蔑":"蔑","蒙":"蒙","碹":"碹","勐":"勐","猛":"猛"};var Ct={},Dt={},Ft={},Lt={};function Bt(h,z){let t=Object.getOwnPropertyDescriptors(h.prototype),s=Object.keys(t).reduce((function(s,p){return (z||!t[p].get&&!t[p].set)&&(s[p]=h.prototype[p]),s}),{});return Object.assign({},h.prototype,s)}!function(h){function z(h){if("string"!=typeof h)throw new Error("string cannot be undefined or null");const z=[];let s=0,p=0;for(;s<h.length;)p+=t(s+p,h),n(h[s+p])&&p++,e(h[s+p])&&p++,r(h[s+p])&&p++,u(h[s+p])?p++:(z.push(h.substring(s,s+p)),s+=p,p=0);return z}function t(h,z){const t=z[h];if(!s(t)||h===z.length-1)return 1;const e=t+z[h+1];let r=z.substring(h+2,h+5);return p(e)&&p(r)||j(r)?4:2}function s(z){return z&&i(z[0].charCodeAt(0),h.HIGH_SURROGATE_START,h.HIGH_SURROGATE_END)}function p(z){return i(o(z),h.REGIONAL_INDICATOR_START,h.REGIONAL_INDICATOR_END)}function j(z){return i(o(z),h.FITZPATRICK_MODIFIER_START,h.FITZPATRICK_MODIFIER_END)}function e(z){return "string"==typeof z&&i(z.charCodeAt(0),h.VARIATION_MODIFIER_START,h.VARIATION_MODIFIER_END)}function r(z){return "string"==typeof z&&i(z.charCodeAt(0),h.DIACRITICAL_MARKS_START,h.DIACRITICAL_MARKS_END)}function n(z){return "string"==typeof z&&-1!==h.GRAPHEMS.indexOf(z.charCodeAt(0))}function u(z){return "string"==typeof z&&z.charCodeAt(0)===h.ZWJ}function o(z){return (z.charCodeAt(0)-h.HIGH_SURROGATE_START<<10)+(z.charCodeAt(1)-h.LOW_SURROGATE_START)+65536}function i(h,z,t){return h>=z&&h<=t}function a(h,t,s){const p=z(h);if(void 0===t)return h;if(t>=p.length)return "";const j=p.length-t;let e=t+(void 0===s?j:s);return e>t+j&&(e=void 0),p.slice(t,e).join("")}Object.defineProperty(h,"__esModule",{value:!0}),h.substr=h.substring=h.betweenInclusive=h.codePointFromSurrogatePair=h.isZeroWidthJoiner=h.isGraphem=h.isDiacriticalMark=h.isVariationSelector=h.isFitzpatrickModifier=h.isRegionalIndicator=h.isFirstOfSurrogatePair=h.nextUnits=h.runes=h.GRAPHEMS=h.ZWJ=h.DIACRITICAL_MARKS_END=h.DIACRITICAL_MARKS_START=h.VARIATION_MODIFIER_END=h.VARIATION_MODIFIER_START=h.FITZPATRICK_MODIFIER_END=h.FITZPATRICK_MODIFIER_START=h.REGIONAL_INDICATOR_END=h.REGIONAL_INDICATOR_START=h.LOW_SURROGATE_START=h.HIGH_SURROGATE_END=h.HIGH_SURROGATE_START=void 0,h.HIGH_SURROGATE_START=55296,h.HIGH_SURROGATE_END=56319,h.LOW_SURROGATE_START=56320,h.REGIONAL_INDICATOR_START=127462,h.REGIONAL_INDICATOR_END=127487,h.FITZPATRICK_MODIFIER_START=127995,h.FITZPATRICK_MODIFIER_END=127999,h.VARIATION_MODIFIER_START=65024,h.VARIATION_MODIFIER_END=65039,h.DIACRITICAL_MARKS_START=8400,h.DIACRITICAL_MARKS_END=8447,h.ZWJ=8205,h.GRAPHEMS=[776,2359,2359,2367,2367,2984,3007,3021,3633,3635,3648,3657,4352,4449,4520],h.runes=z,h.nextUnits=t,h.isFirstOfSurrogatePair=s,h.isRegionalIndicator=p,h.isFitzpatrickModifier=j,h.isVariationSelector=e,h.isDiacriticalMark=r,h.isGraphem=n,h.isZeroWidthJoiner=u,h.codePointFromSurrogatePair=o,h.betweenInclusive=i,h.substring=a,h.substr=a,z.substr=a,z.substring=a,z.default=z,z.runes=z,Object.defineProperty(z,"__esModule",{value:!0}),h.default=z;}(Lt),Bt.classPrototype=Bt,Bt.default=Bt;var Ht=Bt;!function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.UString=h.STRING_PROTOTYPE=void 0;const z=a,t=z.__importDefault(Lt),s=z.__importDefault(Ht);h.STRING_PROTOTYPE=Object.getOwnPropertyNames(String.prototype);class p extends String{constructor(h,...z){super(h),this._arr=null;let t=Object.getOwnPropertyDescriptor(this,"_arr");Object.defineProperty(this,"_arr",Object.assign(t,{configurable:!0,enumerable:!1}));}[Symbol.iterator](){return p.toArray(this)[Symbol.iterator]()}static isString(h){return "string"==typeof h||h instanceof String}static toArray(h){return h instanceof p?h.toArray():(0, t.default)(String(h))}toArray(){return this._arr||(this._arr=(0, t.default)(String(this))),this._arr}split(h,z){let t,s=String(this);return ""===h?(t=p.toArray(this),void 0!==z&&(t=t.slice(0,z))):t=String.prototype.split.call(s,h,z),t}substr(h,z){return p.toArray(this).slice(h).slice(0,z).join("")}substring(h,z){return (Number.isNaN(h)||h<0)&&(h=0),"number"==typeof z&&((Number.isNaN(z)||z<0)&&(z=0),h>z&&([h,z]=[z,h])),this.slice(h,z)}indexOf(h,z=0){let t=p.toArray(this);if(z=Math.max(0,Math.min(t.length,z)),""===(h=String(h)))return z;t=t.slice(z);let s=p.toArray(h),j=0,e=0,r=s[s.length-1];do{if(j=t.indexOf(s[0],e),-1!=j){if(t.slice(j,j+s.length).join("")==h)return z+j;e=j,s.length>1&&(j=t.indexOf(r,j+1),e=j-s.length);}e++;}while(-1!=j&&e<t.length);return -1}includes(h,z=0){return -1!==p.toArray(this).slice(z).join("").indexOf(h)}slice(h,z){return p.toArray(this).slice(h,z).join("")}charAt(h){return this.substr(h,1)}startsWith(h,z){return 0==this.substr(!z||z<0?0:+z,h.length).indexOf(h)}endsWith(h,z){let t=p.toArray(this),s=p.toArray(h);return (void 0===z||z>t.length)&&(z=t.length),this.substring(z-s.length,z)===h}padEnd(h,z){h>>=0,z=String(void 0!==z?z:" ");let t=this.split(""),s=this.split.call(z,"");return t.length>h?String(this):((h-=t.length)>s.length&&(z+=z.repeat(h/s.length),s=new p(z)),String(this)+s.slice(0,h))}padStart(h,z){h>>=0,z=String(void 0!==z?z:" ");let t=this.split(""),s=this.split.call(z,"");return t.length>h?String(this):((h-=t.length)>s.length&&(z+=z.repeat(h/s.length),s=new p(z)),s.slice(0,h)+String(this))}codePointAt(h){return this.toArray()[h].codePointAt(0)}static create(h,...z){return new this(h,...z)}static get support(){let z=(0, s.default)(this);return Object.keys(z).reduce((function(z,t){return h.STRING_PROTOTYPE.includes(t)&&(z[t]=!0),z}),{})}static indexOf(h,z,t=0){return this.create(h).indexOf(z,t)}static includes(h,z,t=0){return this.create(h).includes(z,t)}static split(h,z,t){return this.create(h).split(z,t)}static substr(h,z,t){return this.create(h).substr(z,t)}static substring(h,z,t){return this.create(h).substring(z,t)}static slice(h,z,t){return this.create(h).slice(z,t)}static charAt(h,z){return this.create(h).charAt(z)}static padEnd(h,z,t){return this.create(h).padEnd(z,t)}static padStart(h,z,t){return this.create(h).padStart(z,t)}static startsWith(h,z,t){return this.create(h).startsWith(z,t)}static endsWith(h,z,t){return this.create(h).endsWith(z,t)}get charLength(){return p.toArray(this).length}size(){return p.toArray(this).length}static size(h){return this.create(h).size()}static codePointAt(h,z){return this.create(h).codePointAt(z)}}h.UString=p,p.UString=p,p.default=p,h.default=p,Object.defineProperty(p,"__esModule",{value:!0}),p.default=p.UString=p;}(Ft);var Nt=Ft.UString;Object.defineProperty(Dt,"__esModule",{value:!0}),Dt.textMap4=Dt.textMap3=Dt.textMap2=Dt.textMap1=Dt.charMap=void 0;const Gt=a.__importDefault(Nt),Kt=g;function Zt(h,z){let t=z[h];return "string"==typeof t?t:h}Dt.charMap=Zt,Dt.textMap1=function(h,z){let t=[],s=h.length;for(let p=0;p<s;p++)t[p]=Zt(h[p],z);return t.join("")},Dt.textMap2=function(h,z){let t=Gt.default.split(h,""),s=t.length;for(let h=0;h<s;h++)t[h]=Zt(t[h],z);return t.join("")},Dt.textMap3=function(h,z){let t=h.split(/(?:)/u),s=t.length;for(let h=0;h<s;h++)t[h]=Zt(t[h],z);return t.join("")},Dt.textMap4=function(h,z){return h.replace(Kt.REGEXP_TEST,(function(h){return Zt(h,z)}))},function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.textMap=void 0;const z=Dt;Object.defineProperty(h,"textMap",{enumerable:!0,get:function(){return z.textMap4}}),h.default=z.textMap4;}(Ct),Object.defineProperty(xt,"__esModule",{value:!0}),xt._tw2cn=xt._cn2tw=void 0;const Ut=kt,Yt=Ct;xt._cn2tw=function(h){return (0, Yt.textMap)(h,Ut.table_cn2tw)},xt._tw2cn=function(h){return (0, Yt.textMap)(h,Ut.table_tw2cn)};var Wt={};Object.defineProperty(Wt,"__esModule",{value:!0}),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.tw2cn=h.cn2tw=void 0;const z=f,t=xt;function s(h,s={},...p){return (0, z._call)(t._cn2tw,h,s,...p)}function p(h,s={},...p){return (0, z._call)(t._tw2cn,h,s,...p)}a.__exportStar(Wt,h),h.cn2tw=s,h.tw2cn=p,h.default={cn2tw:s,tw2cn:p};}(It),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.SAFE_MODE_CHAR=h.getOptionsSkip=h.REGEXP_TEST=h.defaultOptions=h.getOptions=h._call=h.table_tw2cn=h.table_cn2tw=h._tw2cn=h._cn2tw=h.tw2cn=h.cn2tw=void 0;const z=f;Object.defineProperty(h,"_call",{enumerable:!0,get:function(){return z._call}}),Object.defineProperty(h,"getOptions",{enumerable:!0,get:function(){return z.getOptions}}),Object.defineProperty(h,"getOptionsSkip",{enumerable:!0,get:function(){return z.getOptionsSkip}});const t=g;Object.defineProperty(h,"defaultOptions",{enumerable:!0,get:function(){return t.defaultOptions}}),Object.defineProperty(h,"REGEXP_TEST",{enumerable:!0,get:function(){return t.REGEXP_TEST}}),Object.defineProperty(h,"SAFE_MODE_CHAR",{enumerable:!0,get:function(){return t.SAFE_MODE_CHAR}});const s=It;Object.defineProperty(h,"cn2tw",{enumerable:!0,get:function(){return s.cn2tw}}),Object.defineProperty(h,"tw2cn",{enumerable:!0,get:function(){return s.tw2cn}});const p=xt;Object.defineProperty(h,"_cn2tw",{enumerable:!0,get:function(){return p._cn2tw}}),Object.defineProperty(h,"_tw2cn",{enumerable:!0,get:function(){return p._tw2cn}});const j=kt;Object.defineProperty(h,"table_cn2tw",{enumerable:!0,get:function(){return j.table_cn2tw}}),Object.defineProperty(h,"table_tw2cn",{enumerable:!0,get:function(){return j.table_tw2cn}}),h.default=h;}(l);var $t={},Jt={},qt={};Object.defineProperty(qt,"__esModule",{value:!0}),qt._get=qt._update=void 0,qt._update=function(h,z){return Object.keys(z).reduce((function(h,t){return h[z[t]]=t,h}),{})},qt._get=function(h,z,...t){return [].concat(z).concat(...t).filter((function(h){return h}))};var Vt={};Object.defineProperty(Vt,"__esModule",{value:!0}),Vt._table_cn=Vt.table_jp=Vt.table_plus=void 0,Vt.table_plus={"劍":["劍","剑","剣","劎","劒","剱","劔"],"砲":["砲","炮"],"偽":["偽","僞"],"內":["內","内"],"鬥":["鬭","鬥","闘","鬪"],"鶏":["鶏","鷄","雞","鸡"],"兎":["兎","兔"],"坏":["坯","坏","壊","壞"],"殻":["殻","殼","壳"],"像":["像","象"],"蘇":["苏","蘇","囌"],"館":["館","館","舘","馆"],"鳥":["鳥","鸟","𫠓"],"視":["視","視","视","眎"],"険":["険","險","险","嶮","崄"],"絶":["絶","絕","绝"],"鉄":["鉄","鐵","铁","鐡"],"諸":["諸","諸","诸"],"尋":["尋","寻","𡬶"],"裡":["裡","裏","里"],"鑑":["鑑","鉴","鑒"],"麵":["麵","麪","麺"],"歲":["歲","歳","岁"],"鐘":["鐘","鍾","钟","锺"],"會":["會","会","㑹"],"塗":["塗","凃","涂"],"髮":["髮","髪"],"話":["話","话","䛡"],"閤":["閤","阁"],"蔘":["蔘","參","参"],"労":["労","勞","劳"],"国":["国","囯","國"],"罵":["罵","骂","駡"],"対":["対","對","对"],"鏽":["鏽","銹","锈"],"駄":["駄","䭾","馱","驮"],"薩":["薩","萨","蕯"],"単":["単","單","单"],"継":["継","繼","继"],"驗":["驗","验","騐","験"],"歴":["歴","歷"],"暦":["暦","曆"],"団":["团","団","團"],"麼":["麼","麽","庅"],"戰":["戦","戰","战"],"乡":["郷","鄕","鄉","鄊","乡"],"勉":["勉","勉"],"餘":["餘","馀","余"],"網":["網","䋄","䋞","网"],"託":["託","讬","托"],"纖":["纖","纤","縴","繊"],"鍊":["鍊","錬","𫔀","炼","煉"],"擊":["撃","擊","击"],"實":["實","実","实","寔"],"於":["於","扵"],"證":["證","証","证"],"據":["據","据","拠"],"處":["處","处","䖏","処"],"瞪":["瞪","瞠","眙"],"肢":["肢","胑"],"肉":["肉","宍","𠕎"],"憂":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"繫":["繫","繋"],"廻":["廻","迴"],"録":["録","錄","录"],"鎗":["鎗","槍","枪"],"悠":["悠","滺"],"壶":["壶","壺","壷"],"茲":["茲","兹","玆"],"蓋":["蓋","盖","葢"],"蹟":["蹟","跡","迹"],"癒":["癒","瘉"],"辺":["辺","邊","边","邉"],"準":["準","凖"],"衛":["衛","衞","卫"],"晚":["晚","晩"],"裸":["裸","躶"],"亀":["亀","龜","龟","𪚧","𪚿","𠃾"],"凼":["凼","氹"],"艸":["艸","草"],"箚":["箚","剳"],"复":["复","復","複"],"污":["污","汙","汚"],"伙":["伙","夥"],"御":["御","禦"],"鬱":["鬱","郁"],"淩":["淩","凌"],"紮":["紮","扎"],"痴":["痴","癡"],"栖":["栖","棲"],"犇":["犇","奔"],"範":["範","范"],"薑":["薑","姜","葁"],"樸":["樸","朴"],"諮":["諮","谘","咨"],"撚":["撚","捻"],"喂":["喂","餵","餧","𫗭"],"淨":["淨","凈","净"],"栗":["栗","慄"],"挽":["挽","輓"],"灶":["灶","竈"],"線":["線","缐","綫","线"],"盡":["盡","尽","儘"],"黴":["黴","霉"],"周":["周","週"],"並":["並","并","併"],"讚":["讚","讃"],"観":["観","觀","观","覌"],"遊":["遊","游"],"启":["启","啓","啟","啔"],"廄":["廄","厩","廐","廏"],"氣":["気","氣","气"],"欲":["慾","欲"],"傑":["傑","杰"],"鍛":["鍛","锻","煅"],"徵":["徵","徴"],"閒":["閒","𫔮","閑","闲"],"贊":["贊","赞","賛"],"櫻":["櫻","桜","樱"],"尨":["尨","狵"],"圈":["圈","圏"],"凶":["凶","兇"],"浜":["浜","濱","滨"],"煙":["煙","烟","菸"],"黒":["黒","黑"],"樂":["樂","乐","楽"],"薬":["薬","藥","药","葯","𣛙"],"劵":["劵","券","卷"],"貳":["貳","贰","弐","貮","𢎐","二"],"隷":["隷","隸","隶"],"姫":["姫","姬"],"燻":["燻","熏"],"籲":["籲","龥"],"齧":["齧","啮","𪘂","囓","噛","嚙"],"鹼":["鹼","碱","硷"],"咸":["咸","鹹"],"穗":["穗","穂"],"廢":["廢","廃","废"],"蹠":["蹠","跖"],"吒":["吒","咤"],"剷":["剷","鏟","铲","刬","剗"],"擗":["擗","劈"],"核":["核","覈"],"脣":["脣","唇"],"升":["升","昇"],"磐":["磐","盤","盘"],"溪":["溪","渓"],"谿":["谿","嵠"],"折":["折","摺"],"祐":["祐","佑"],"瓮":["瓮","罋","甕"],"蹤":["蹤","踪","踨"],"暗":["闇","暗"],"昵":["昵","暱"],"布":["布","佈"],"為":["為","为","爲"],"綳":["綳","繃","绷"],"痺":["痺","痹"],"痲":["痲","痳"],"雇":["雇","僱"],"敘":["敘","叙","敍"],"盪":["盪","蕩","荡"],"勛":["勛","勳","勋","勲"],"祕":["祕","秘"],"牆":["牆","墙","墻"],"爾":["爾","尔","尓"],"焰":["焰","焔"],"默":["默","黙"],"壓":["壓","压","圧"],"廸":["廸","迪"],"曉":["曉","晓","暁"],"霸":["霸","覇"],"霊":["霊","靈","灵"],"泪":["泪","涙","淚"],"牺":["牺","犠","犧"],"藉":["藉","耤"],"噸":["噸","吨"],"俱":["俱","倶"],"粽":["粽","糉","糭"],"向":["向","曏","嚮"],"悽":["悽","淒","凄"],"鱷":["鱷","鰐","鳄"],"滷":["滷","鹵","卤"],"颜":["颜","顏","顔"],"衝":["衝","沖","冲"],"樑":["樑","梁"],"砂":["砂","沙"],"炭":["炭","碳"],"糸":["糸","絲","丝"],"簷":["簷","檐"],"涌":["涌","湧"],"糓":["穀","糓"],"両":["両","两","兩"],"家":["家","傢"],"妳":["妳","你"],"她":["她","他"],"藤":["藤","籐","籘"],"嬉":["嬉","嘻"],"亘":["亘","亙"],"恆":["恆","恒"],"鶇":["鶇","鶫","鸫"],"姉":["姉","姐","姊"],"剁":["剁","刴"],"泄":["泄","洩"],"舖":["舖","铺","鋪","舗"],"效":["效","効"],"喻":["喻","喩"],"插":["挿","插","揷"],"銳":["銳","鋭","锐"],"權":["權","権","权"],"経":["経","經","经"],"歓":["歓","歡","欢"],"孃":["嬢","孃"],"済":["済","濟","济"],"收":["収","收"],"綠":["綠","緑","绿"],"唖":["唖","啞","哑"],"剿":["剿","勦","𠞰"],"禍":["禍","禍","祸"],"営":["營","営","营"],"産":["產","産","产"],"査":["查","査"],"絵":["繪","絵","绘"],"懐":["懷","懐","怀"],"釈":["釋","釈","释"],"蔵":["藏","蔵"],"娯":["娛","娯","娱"],"焼":["燒","焼","烧"],"拡":["擴","拡","扩"],"賎":["賤","賎","贱"],"銭":["錢","銭","钱"],"雑":["雜","雑","杂"],"聴":["聽","聴","听"],"帯":["帶","帯","带"],"閲":["閲","阅"],"覧":["覽","覧","览"],"悪":["惡","悪","恶"],"亜":["亞","亜","亚"],"氷":["冰","氷"],"县":["県","縣","县"],"肅":["粛","肅","肃"],"専":["專","専","专"],"様":["樣","様","样"],"関":["關","関","关"],"檢":["検","檢","检"],"侮":["侮","侮"],"沉":["沉","沈"],"嚐":["嚐","嘗","尝"],"搾":["搾","榨"],"获":["获","獲","穫"],"繮":["繮","缰","韁"],"贋":["贋","贗","赝"],"獃":["呆"],"杯":["杯","盃"],"呪":["呪","咒","詋"],"䇳":["䇳","笺","箋","牋"],"竝":["竝","𠀤"],"彷":["彷","徬"],"贑":["贑","𫎬"],"崖":["崖","崕","厓"],"岩":["岩","巖","巗","巌"],"灕":["灕","漓"],"粘":["粘","黏"],"娴":["娴","嫺","嫻"],"哗":["哗","嘩","譁"],"拔":["拔","抜"],"湿":["湿","溼","濕"],"稻":["稻","稲"],"楕":["楕","椭","橢"],"毎":["毎","每"],"篦":["篦","箆"],"騨":["騨","驒","驔"],"猛":["猛","勐"],"吿":["吿","告"],"刃":["刃","刄"],"教":["教","敎"],"蛎":["蛎","蜊","蠣"],"步":["步","歩"],"劫":["刦","刧","刼","劫"],"剑":["劍","剑","剣","劎","劒","剱","劔"],"剣":["劍","剑","剣","劎","劒","剱","劔"],"劎":["劍","剑","剣","劎","劒","剱","劔"],"劒":["劍","剑","剣","劎","劒","剱","劔"],"剱":["劍","剑","剣","劎","劒","剱","劔"],"劔":["劍","剑","剣","劎","劒","剱","劔"],"炮":["砲","炮"],"僞":["偽","僞"],"内":["內","内"],"鬭":["鬭","鬥","闘","鬪"],"闘":["鬭","鬥","闘","鬪"],"鬪":["鬭","鬥","闘","鬪"],"鷄":["鶏","鷄","雞","鸡"],"雞":["鶏","鷄","雞","鸡"],"鸡":["鶏","鷄","雞","鸡"],"兔":["兎","兔"],"坯":["坯","坏","壊","壞"],"壊":["坯","坏","壊","壞"],"壞":["坯","坏","壊","壞"],"殼":["殻","殼","壳"],"壳":["殻","殼","壳"],"象":["像","象"],"苏":["苏","蘇","囌"],"囌":["苏","蘇","囌"],"館":["館","館","舘","馆"],"舘":["館","館","舘","馆"],"馆":["館","館","舘","馆"],"鸟":["鳥","鸟","𫠓"],"𫠓":["鳥","鸟","𫠓"],"視":["視","視","视","眎"],"视":["視","視","视","眎"],"眎":["視","視","视","眎"],"險":["険","險","险","嶮","崄"],"险":["険","險","险","嶮","崄"],"嶮":["険","險","险","嶮","崄"],"崄":["険","險","险","嶮","崄"],"絕":["絶","絕","绝"],"绝":["絶","絕","绝"],"鐵":["鉄","鐵","铁","鐡"],"铁":["鉄","鐵","铁","鐡"],"鐡":["鉄","鐵","铁","鐡"],"諸":["諸","諸","诸"],"诸":["諸","諸","诸"],"寻":["尋","寻","𡬶"],"𡬶":["尋","寻","𡬶"],"裏":["裡","裏","里"],"里":["裡","裏","里"],"鉴":["鑑","鉴","鑒"],"鑒":["鑑","鉴","鑒"],"麪":["麵","麪","麺"],"麺":["麵","麪","麺"],"歳":["歲","歳","岁"],"岁":["歲","歳","岁"],"鍾":["鐘","鍾","钟","锺"],"钟":["鐘","鍾","钟","锺"],"锺":["鐘","鍾","钟","锺"],"会":["會","会","㑹"],"㑹":["會","会","㑹"],"凃":["塗","凃","涂"],"涂":["塗","凃","涂"],"髪":["髮","髪"],"话":["話","话","䛡"],"䛡":["話","话","䛡"],"阁":["閤","阁"],"參":["蔘","參","参"],"参":["蔘","參","参"],"勞":["労","勞","劳"],"劳":["労","勞","劳"],"囯":["国","囯","國"],"國":["国","囯","國"],"骂":["罵","骂","駡"],"駡":["罵","骂","駡"],"對":["対","對","对"],"对":["対","對","对"],"銹":["鏽","銹","锈"],"锈":["鏽","銹","锈"],"䭾":["駄","䭾","馱","驮"],"馱":["駄","䭾","馱","驮"],"驮":["駄","䭾","馱","驮"],"萨":["薩","萨","蕯"],"蕯":["薩","萨","蕯"],"單":["単","單","单"],"单":["単","單","单"],"繼":["継","繼","继"],"继":["継","繼","继"],"验":["驗","验","騐","験"],"騐":["驗","验","騐","験"],"験":["驗","验","騐","験"],"歷":["歴","歷"],"曆":["暦","曆"],"团":["团","団","團"],"團":["团","団","團"],"麽":["麼","麽","庅"],"庅":["麼","麽","庅"],"戦":["戦","戰","战"],"战":["戦","戰","战"],"郷":["郷","鄕","鄉","鄊","乡"],"鄕":["郷","鄕","鄉","鄊","乡"],"鄉":["郷","鄕","鄉","鄊","乡"],"鄊":["郷","鄕","鄉","鄊","乡"],"勉":["勉","勉"],"馀":["餘","馀","余"],"余":["餘","馀","余"],"䋄":["網","䋄","䋞","网"],"䋞":["網","䋄","䋞","网"],"网":["網","䋄","䋞","网"],"讬":["託","讬","托"],"托":["託","讬","托"],"纤":["纖","纤","縴","繊"],"縴":["纖","纤","縴","繊"],"繊":["纖","纤","縴","繊"],"錬":["鍊","錬","𫔀","炼","煉"],"𫔀":["鍊","錬","𫔀","炼","煉"],"炼":["鍊","錬","𫔀","炼","煉"],"煉":["鍊","錬","𫔀","炼","煉"],"撃":["撃","擊","击"],"击":["撃","擊","击"],"実":["實","実","实","寔"],"实":["實","実","实","寔"],"寔":["實","実","实","寔"],"扵":["於","扵"],"証":["證","証","证"],"证":["證","証","证"],"据":["據","据","拠"],"拠":["據","据","拠"],"处":["處","处","䖏","処"],"䖏":["處","处","䖏","処"],"処":["處","处","䖏","処"],"瞠":["瞪","瞠","眙"],"眙":["瞪","瞠","眙"],"胑":["肢","胑"],"宍":["肉","宍","𠕎"],"𠕎":["肉","宍","𠕎"],"𢝊":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"𢚧":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"𢟜":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"懮":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"𨗫":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"繋":["繫","繋"],"迴":["廻","迴"],"錄":["録","錄","录"],"录":["録","錄","录"],"槍":["鎗","槍","枪"],"枪":["鎗","槍","枪"],"滺":["悠","滺"],"壺":["壶","壺","壷"],"壷":["壶","壺","壷"],"兹":["茲","兹","玆"],"玆":["茲","兹","玆"],"盖":["蓋","盖","葢"],"葢":["蓋","盖","葢"],"跡":["蹟","跡","迹"],"迹":["蹟","跡","迹"],"瘉":["癒","瘉"],"邊":["辺","邊","边","邉"],"边":["辺","邊","边","邉"],"邉":["辺","邊","边","邉"],"凖":["準","凖"],"衞":["衛","衞","卫"],"卫":["衛","衞","卫"],"晩":["晚","晩"],"躶":["裸","躶"],"龜":["亀","龜","龟","𪚧","𪚿","𠃾"],"龟":["亀","龜","龟","𪚧","𪚿","𠃾"],"𪚧":["亀","龜","龟","𪚧","𪚿","𠃾"],"𪚿":["亀","龜","龟","𪚧","𪚿","𠃾"],"𠃾":["亀","龜","龟","𪚧","𪚿","𠃾"],"氹":["凼","氹"],"草":["艸","草"],"剳":["箚","剳"],"復":["复","復","複"],"複":["复","復","複"],"汙":["污","汙","汚"],"汚":["污","汙","汚"],"夥":["伙","夥"],"禦":["御","禦"],"郁":["鬱","郁"],"凌":["淩","凌"],"扎":["紮","扎"],"癡":["痴","癡"],"棲":["栖","棲"],"奔":["犇","奔"],"范":["範","范"],"姜":["薑","姜","葁"],"葁":["薑","姜","葁"],"朴":["樸","朴"],"谘":["諮","谘","咨"],"咨":["諮","谘","咨"],"捻":["撚","捻"],"餵":["喂","餵","餧","𫗭"],"餧":["喂","餵","餧","𫗭"],"𫗭":["喂","餵","餧","𫗭"],"凈":["淨","凈","净"],"净":["淨","凈","净"],"慄":["栗","慄"],"輓":["挽","輓"],"竈":["灶","竈"],"缐":["線","缐","綫","线"],"綫":["線","缐","綫","线"],"线":["線","缐","綫","线"],"尽":["盡","尽","儘"],"儘":["盡","尽","儘"],"霉":["黴","霉"],"週":["周","週"],"并":["並","并","併"],"併":["並","并","併"],"讃":["讚","讃"],"觀":["観","觀","观","覌"],"观":["観","觀","观","覌"],"覌":["観","觀","观","覌"],"游":["遊","游"],"啓":["启","啓","啟","啔"],"啟":["启","啓","啟","啔"],"啔":["启","啓","啟","啔"],"厩":["廄","厩","廐","廏"],"廐":["廄","厩","廐","廏"],"廏":["廄","厩","廐","廏"],"気":["気","氣","气"],"气":["気","氣","气"],"慾":["慾","欲"],"杰":["傑","杰"],"锻":["鍛","锻","煅"],"煅":["鍛","锻","煅"],"徴":["徵","徴"],"𫔮":["閒","𫔮","閑","闲"],"閑":["閒","𫔮","閑","闲"],"闲":["閒","𫔮","閑","闲"],"赞":["贊","赞","賛"],"賛":["贊","赞","賛"],"桜":["櫻","桜","樱"],"樱":["櫻","桜","樱"],"狵":["尨","狵"],"圏":["圈","圏"],"兇":["凶","兇"],"濱":["浜","濱","滨"],"滨":["浜","濱","滨"],"烟":["煙","烟","菸"],"菸":["煙","烟","菸"],"黑":["黒","黑"],"乐":["樂","乐","楽"],"楽":["樂","乐","楽"],"藥":["薬","藥","药","葯","𣛙"],"药":["薬","藥","药","葯","𣛙"],"葯":["薬","藥","药","葯","𣛙"],"𣛙":["薬","藥","药","葯","𣛙"],"券":["劵","券","卷"],"卷":["劵","券","卷"],"贰":["貳","贰","弐","貮","𢎐","二"],"弐":["貳","贰","弐","貮","𢎐","二"],"貮":["貳","贰","弐","貮","𢎐","二"],"𢎐":["貳","贰","弐","貮","𢎐","二"],"二":["貳","贰","弐","貮","𢎐","二"],"隸":["隷","隸","隶"],"隶":["隷","隸","隶"],"姬":["姫","姬"],"熏":["燻","熏"],"龥":["籲","龥"],"啮":["齧","啮","𪘂","囓","噛","嚙"],"𪘂":["齧","啮","𪘂","囓","噛","嚙"],"囓":["齧","啮","𪘂","囓","噛","嚙"],"噛":["齧","啮","𪘂","囓","噛","嚙"],"嚙":["齧","啮","𪘂","囓","噛","嚙"],"碱":["鹼","碱","硷"],"硷":["鹼","碱","硷"],"鹹":["咸","鹹"],"穂":["穗","穂"],"廃":["廢","廃","废"],"废":["廢","廃","废"],"跖":["蹠","跖"],"咤":["吒","咤"],"鏟":["剷","鏟","铲","刬","剗"],"铲":["剷","鏟","铲","刬","剗"],"刬":["剷","鏟","铲","刬","剗"],"剗":["剷","鏟","铲","刬","剗"],"劈":["擗","劈"],"覈":["核","覈"],"唇":["脣","唇"],"昇":["升","昇"],"盤":["磐","盤","盘"],"盘":["磐","盤","盘"],"渓":["溪","渓"],"嵠":["谿","嵠"],"摺":["折","摺"],"佑":["祐","佑"],"罋":["瓮","罋","甕"],"甕":["瓮","罋","甕"],"踪":["蹤","踪","踨"],"踨":["蹤","踪","踨"],"闇":["闇","暗"],"暱":["昵","暱"],"佈":["布","佈"],"为":["為","为","爲"],"爲":["為","为","爲"],"繃":["綳","繃","绷"],"绷":["綳","繃","绷"],"痹":["痺","痹"],"痳":["痲","痳"],"僱":["雇","僱"],"叙":["敘","叙","敍"],"敍":["敘","叙","敍"],"蕩":["盪","蕩","荡"],"荡":["盪","蕩","荡"],"勳":["勛","勳","勋","勲"],"勋":["勛","勳","勋","勲"],"勲":["勛","勳","勋","勲"],"秘":["祕","秘"],"墙":["牆","墙","墻"],"墻":["牆","墙","墻"],"尔":["爾","尔","尓"],"尓":["爾","尔","尓"],"焔":["焰","焔"],"黙":["默","黙"],"压":["壓","压","圧"],"圧":["壓","压","圧"],"迪":["廸","迪"],"晓":["曉","晓","暁"],"暁":["曉","晓","暁"],"覇":["霸","覇"],"靈":["霊","靈","灵"],"灵":["霊","靈","灵"],"涙":["泪","涙","淚"],"淚":["泪","涙","淚"],"犠":["牺","犠","犧"],"犧":["牺","犠","犧"],"耤":["藉","耤"],"吨":["噸","吨"],"倶":["俱","倶"],"糉":["粽","糉","糭"],"糭":["粽","糉","糭"],"曏":["向","曏","嚮"],"嚮":["向","曏","嚮"],"淒":["悽","淒","凄"],"凄":["悽","淒","凄"],"鰐":["鱷","鰐","鳄"],"鳄":["鱷","鰐","鳄"],"鹵":["滷","鹵","卤"],"卤":["滷","鹵","卤"],"顏":["颜","顏","顔"],"顔":["颜","顏","顔"],"沖":["衝","沖","冲"],"冲":["衝","沖","冲"],"梁":["樑","梁"],"沙":["砂","沙"],"碳":["炭","碳"],"絲":["糸","絲","丝"],"丝":["糸","絲","丝"],"檐":["簷","檐"],"湧":["涌","湧"],"穀":["穀","糓"],"两":["両","两","兩"],"兩":["両","两","兩"],"傢":["家","傢"],"你":["妳","你"],"他":["她","他"],"籐":["藤","籐","籘"],"籘":["藤","籐","籘"],"嘻":["嬉","嘻"],"亙":["亘","亙"],"恒":["恆","恒"],"鶫":["鶇","鶫","鸫"],"鸫":["鶇","鶫","鸫"],"姐":["姉","姐","姊"],"姊":["姉","姐","姊"],"刴":["剁","刴"],"洩":["泄","洩"],"铺":["舖","铺","鋪","舗"],"鋪":["舖","铺","鋪","舗"],"舗":["舖","铺","鋪","舗"],"効":["效","効"],"喩":["喻","喩"],"挿":["挿","插","揷"],"揷":["挿","插","揷"],"鋭":["銳","鋭","锐"],"锐":["銳","鋭","锐"],"権":["權","権","权"],"权":["權","権","权"],"經":["経","經","经"],"经":["経","經","经"],"歡":["歓","歡","欢"],"欢":["歓","歡","欢"],"嬢":["嬢","孃"],"濟":["済","濟","济"],"济":["済","濟","济"],"収":["収","收"],"緑":["綠","緑","绿"],"绿":["綠","緑","绿"],"啞":["唖","啞","哑"],"哑":["唖","啞","哑"],"勦":["剿","勦","𠞰"],"𠞰":["剿","勦","𠞰"],"禍":["禍","禍","祸"],"祸":["禍","禍","祸"],"營":["營","営","营"],"营":["營","営","营"],"產":["產","産","产"],"产":["產","産","产"],"查":["查","査"],"繪":["繪","絵","绘"],"绘":["繪","絵","绘"],"懷":["懷","懐","怀"],"怀":["懷","懐","怀"],"釋":["釋","釈","释"],"释":["釋","釈","释"],"藏":["藏","蔵"],"娛":["娛","娯","娱"],"娱":["娛","娯","娱"],"燒":["燒","焼","烧"],"烧":["燒","焼","烧"],"擴":["擴","拡","扩"],"扩":["擴","拡","扩"],"賤":["賤","賎","贱"],"贱":["賤","賎","贱"],"錢":["錢","銭","钱"],"钱":["錢","銭","钱"],"雜":["雜","雑","杂"],"杂":["雜","雑","杂"],"聽":["聽","聴","听"],"听":["聽","聴","听"],"帶":["帶","帯","带"],"带":["帶","帯","带"],"阅":["閲","阅"],"覽":["覽","覧","览"],"览":["覽","覧","览"],"惡":["惡","悪","恶"],"恶":["惡","悪","恶"],"亞":["亞","亜","亚"],"亚":["亞","亜","亚"],"冰":["冰","氷"],"県":["県","縣","县"],"縣":["県","縣","县"],"粛":["粛","肅","肃"],"肃":["粛","肅","肃"],"專":["專","専","专"],"专":["專","専","专"],"樣":["樣","様","样"],"样":["樣","様","样"],"關":["關","関","关"],"关":["關","関","关"],"検":["検","檢","检"],"检":["検","檢","检"],"侮":["侮","侮"],"沈":["沉","沈"],"嘗":["嚐","嘗","尝"],"尝":["嚐","嘗","尝"],"榨":["搾","榨"],"獲":["获","獲","穫"],"穫":["获","獲","穫"],"缰":["繮","缰","韁"],"韁":["繮","缰","韁"],"贗":["贋","贗","赝"],"赝":["贋","贗","赝"],"呆":["呆"],"盃":["杯","盃"],"咒":["呪","咒","詋"],"詋":["呪","咒","詋"],"笺":["䇳","笺","箋","牋"],"箋":["䇳","笺","箋","牋"],"牋":["䇳","笺","箋","牋"],"𠀤":["竝","𠀤"],"徬":["彷","徬"],"𫎬":["贑","𫎬"],"崕":["崖","崕","厓"],"厓":["崖","崕","厓"],"巖":["岩","巖","巗","巌"],"巗":["岩","巖","巗","巌"],"巌":["岩","巖","巗","巌"],"漓":["灕","漓"],"黏":["粘","黏"],"嫺":["娴","嫺","嫻"],"嫻":["娴","嫺","嫻"],"嘩":["哗","嘩","譁"],"譁":["哗","嘩","譁"],"抜":["拔","抜"],"溼":["湿","溼","濕"],"濕":["湿","溼","濕"],"稲":["稻","稲"],"椭":["楕","椭","橢"],"橢":["楕","椭","橢"],"每":["毎","每"],"箆":["篦","箆"],"驒":["騨","驒","驔"],"驔":["騨","驒","驔"],"勐":["猛","勐"],"告":["吿","告"],"刄":["刃","刄"],"敎":["教","敎"],"蜊":["蛎","蜊","蠣"],"蠣":["蛎","蜊","蠣"],"歩":["步","歩"],"刦":["刦","刧","刼","劫"],"刧":["刦","刧","刼","劫"],"刼":["刦","刧","刼","劫"]},Vt.table_jp={"の":["の","之","的"],"と":["と","與","与"],"画":["划","画","劃","畫"],"闘":["斗","鬭","鬥","闘","鬪"],"鬥":["斗","鬭","鬥","闘","鬪"],"鬭":["斗","鬭","鬥","闘","鬪"],"鬪":["斗","鬭","鬥","闘","鬪"],"闇":["暗","闇"],"図":["図","圖","图"],"当":["当","噹","當","儅"],"閤":["合","閤","阁"],"阁":["合","閤","阁"],"罗":["羅","罗","儸","㑩","囉","啰"],"干":["幹","乾","干"],"幹":["幹","干"],"乾":["干","乾","亁","乹"],"亁":["乾","亁","乹"],"乹":["乾","亁","乹"],"历":["历","歴","歷","暦","曆"],"歴":["历","歴","歷"],"歷":["历","歴","歷"],"暦":["历","暦","曆"],"曆":["历","暦","曆"],"呻":["呻","申"],"覆":["覆","复"],"复":["覆","复","復","複"],"勉":["免","勉","勉"],"勉":["免","勉","勉"],"甦":["甦","蘇","苏"],"忧":["憂","優"],"鹹":["咸","鹹"],"准":["準","准"],"準":["準","准","凖"],"袮":["袮","祢"],"儘":["儘","侭","盡","尽"],"侭":["儘","侭"],"脏":["脏","髒","臟"],"发":["髮","髪","发"],"髮":["發","发","髮","髪"],"慾":["慾","欲"],"讚":["讃","讚","贊","赞","賛"],"冲":["冲","沖","衝"],"面":["麵","麪","麺"],"鬚":["鬚","須","须"],"揹":["揹","背"],"捲":["捲","卷","巻"],"卷":["捲","卷","巻","劵","券"],"巻":["捲","卷","巻","劵","券"],"苏":["苏","蘇","甦","囌"],"瀏":["瀏","浏","刘"],"浏":["瀏","浏","刘"],"吁":["籲","吁"],"囉":["囉","啰","罗","羅"],"啰":["囉","啰","罗","羅"],"修":["修","俢"],"犟":["犟","強","强"],"嗬":["嗬","呵"],"唿":["唿","呼"],"媮":["媮","偷"],"采":["采","採"],"彩":["彩","采"],"𠩺":["𠩺","釐"],"恶":["恶","噁","惡","悪"],"炰":["炰","炮"],"辟":["辟","闢","避"],"避":["辟","避"],"闢":["辟","闢"],"滷":["魯","鲁","滷","鹵","卤"],"鹵":["魯","鲁","滷","鹵","卤"],"卤":["魯","鲁","滷","鹵","卤"],"儓":["儓","檯"],"檯":["儓","檯"],"台":["台","檯","臺","颱"],"練":["炼"],"练":["炼"],"繫":["系","繫","繋"],"繋":["系","繫","繋"],"糓":["谷","穀","糓"],"穀":["谷","穀","糓"],"版":["板"],"祕":["密","祕","秘"],"秘":["密","祕","秘"],"汇":["彙","匯"],"倂":["倂","併"],"併":["倂","併","並","并"],"幷":["并"],"并":["幷","並","并","併"],"矇":["蒙"],"濛":["蒙"],"懞":["蒙"],"煇":["煇","辉","𪸩"],"𪸩":["煇","辉","𪸩"],"签":["籤","簽"],"劍":["劍","剑","剣","劎","劒","剱","劔"],"砲":["砲","炮"],"偽":["偽","僞"],"內":["內","内"],"鶏":["鶏","鷄","雞","鸡"],"兎":["兎","兔"],"坏":["坯","坏","壊","壞"],"殻":["殻","殼","壳"],"像":["像","象"],"蘇":["苏","蘇","囌"],"館":["館","館","舘","馆"],"鳥":["鳥","鸟","𫠓"],"視":["視","視","视","眎"],"険":["険","險","险","嶮","崄"],"絶":["絶","絕","绝"],"鉄":["鉄","鐵","铁","鐡"],"諸":["諸","諸","诸"],"尋":["尋","寻","𡬶"],"裡":["裡","裏","里"],"鑑":["鑑","鉴","鑒"],"麵":["麵","麪","麺"],"歲":["歲","歳","岁"],"鐘":["鐘","鍾","钟","锺"],"會":["會","会","㑹"],"塗":["塗","凃","涂"],"話":["話","话","䛡"],"蔘":["蔘","參","参"],"労":["労","勞","劳"],"国":["国","囯","國"],"罵":["罵","骂","駡"],"対":["対","對","对"],"鏽":["鏽","銹","锈"],"駄":["駄","䭾","馱","驮"],"薩":["薩","萨","蕯"],"単":["単","單","单"],"継":["継","繼","继"],"驗":["驗","验","騐","験"],"団":["团","団","團"],"麼":["麼","麽","庅"],"戰":["戦","戰","战"],"乡":["郷","鄕","鄉","鄊","乡"],"餘":["餘","馀","余"],"網":["網","䋄","䋞","网"],"託":["託","讬","托"],"纖":["纖","纤","縴","繊"],"鍊":["鍊","錬","𫔀","炼","煉"],"擊":["撃","擊","击"],"實":["實","実","实","寔"],"於":["於","扵"],"證":["證","証","证"],"據":["據","据","拠"],"處":["處","处","䖏","処"],"瞪":["瞪","瞠","眙"],"肢":["肢","胑"],"肉":["肉","宍","𠕎"],"憂":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"廻":["廻","迴"],"録":["録","錄","录"],"鎗":["鎗","槍","枪"],"悠":["悠","滺"],"壶":["壶","壺","壷"],"茲":["茲","兹","玆"],"蓋":["蓋","盖","葢"],"蹟":["蹟","跡","迹"],"癒":["癒","瘉"],"辺":["辺","邊","边","邉"],"衛":["衛","衞","卫"],"晚":["晚","晩"],"裸":["裸","躶"],"亀":["亀","龜","龟","𪚧","𪚿","𠃾"],"凼":["凼","氹"],"艸":["艸","草"],"箚":["箚","剳"],"污":["污","汙","汚"],"伙":["伙","夥"],"御":["御","禦"],"鬱":["鬱","郁"],"淩":["淩","凌"],"紮":["紮","扎"],"痴":["痴","癡"],"栖":["栖","棲"],"犇":["犇","奔"],"範":["範","范"],"薑":["薑","姜","葁"],"樸":["樸","朴"],"諮":["諮","谘","咨"],"撚":["撚","捻"],"喂":["喂","餵","餧","𫗭"],"淨":["淨","凈","净"],"栗":["栗","慄"],"挽":["挽","輓"],"灶":["灶","竈"],"線":["線","缐","綫","线"],"盡":["盡","尽","儘"],"黴":["黴","霉"],"周":["周","週"],"並":["並","并","併"],"観":["観","觀","观","覌"],"遊":["遊","游"],"启":["启","啓","啟","啔"],"廄":["廄","厩","廐","廏"],"氣":["気","氣","气"],"欲":["慾","欲"],"傑":["傑","杰"],"鍛":["鍛","锻","煅"],"徵":["徵","徴"],"閒":["閒","𫔮","閑","闲"],"贊":["贊","赞","賛"],"櫻":["櫻","桜","樱"],"尨":["尨","狵"],"圈":["圈","圏"],"凶":["凶","兇"],"浜":["浜","濱","滨"],"煙":["煙","烟","菸"],"黒":["黒","黑"],"樂":["樂","乐","楽"],"薬":["薬","藥","药","葯","𣛙"],"劵":["劵","券","卷"],"貳":["貳","贰","弐","貮","𢎐","二"],"隷":["隷","隸","隶"],"姫":["姫","姬"],"燻":["燻","熏"],"籲":["籲","龥"],"齧":["齧","啮","𪘂","囓","噛","嚙"],"鹼":["鹼","碱","硷"],"咸":["咸","鹹"],"穗":["穗","穂"],"廢":["廢","廃","废"],"蹠":["蹠","跖"],"吒":["吒","咤"],"剷":["剷","鏟","铲","刬","剗"],"擗":["擗","劈"],"核":["核","覈"],"脣":["脣","唇"],"升":["升","昇"],"磐":["磐","盤","盘"],"溪":["溪","渓"],"谿":["谿","嵠"],"折":["折","摺"],"祐":["祐","佑"],"瓮":["瓮","罋","甕"],"蹤":["蹤","踪","踨"],"暗":["闇","暗"],"昵":["昵","暱"],"布":["布","佈"],"為":["為","为","爲"],"綳":["綳","繃","绷"],"痺":["痺","痹"],"痲":["痲","痳"],"雇":["雇","僱"],"敘":["敘","叙","敍"],"盪":["盪","蕩","荡"],"勛":["勛","勳","勋","勲"],"牆":["牆","墙","墻"],"爾":["爾","尔","尓"],"焰":["焰","焔"],"默":["默","黙"],"壓":["壓","压","圧"],"廸":["廸","迪"],"曉":["曉","晓","暁"],"霸":["霸","覇"],"霊":["霊","靈","灵"],"泪":["泪","涙","淚"],"牺":["牺","犠","犧"],"藉":["藉","耤"],"噸":["噸","吨"],"俱":["俱","倶"],"粽":["粽","糉","糭"],"向":["向","曏","嚮"],"悽":["悽","淒","凄"],"鱷":["鱷","鰐","鳄"],"颜":["颜","顏","顔"],"衝":["衝","沖","冲"],"樑":["樑","梁"],"砂":["砂","沙"],"炭":["炭","碳"],"糸":["糸","絲","丝"],"簷":["簷","檐"],"涌":["涌","湧"],"両":["両","两","兩"],"家":["家","傢"],"妳":["妳","你"],"她":["她","他"],"藤":["藤","籐","籘"],"嬉":["嬉","嘻"],"亘":["亘","亙"],"恆":["恆","恒"],"鶇":["鶇","鶫","鸫"],"姉":["姉","姐","姊"],"剁":["剁","刴"],"泄":["泄","洩"],"舖":["舖","铺","鋪","舗"],"效":["效","効"],"喻":["喻","喩"],"插":["挿","插","揷"],"銳":["銳","鋭","锐"],"權":["權","権","权"],"経":["経","經","经"],"歓":["歓","歡","欢"],"孃":["嬢","孃"],"済":["済","濟","济"],"收":["収","收"],"綠":["綠","緑","绿"],"唖":["唖","啞","哑"],"剿":["剿","勦","𠞰"],"禍":["禍","禍","祸"],"営":["營","営","营"],"産":["產","産","产"],"査":["查","査"],"絵":["繪","絵","绘"],"懐":["懷","懐","怀"],"釈":["釋","釈","释"],"蔵":["藏","蔵"],"娯":["娛","娯","娱"],"焼":["燒","焼","烧"],"拡":["擴","拡","扩"],"賎":["賤","賎","贱"],"銭":["錢","銭","钱"],"雑":["雜","雑","杂"],"聴":["聽","聴","听"],"帯":["帶","帯","带"],"閲":["閲","阅"],"覧":["覽","覧","览"],"悪":["惡","悪","恶"],"亜":["亞","亜","亚"],"氷":["冰","氷"],"县":["県","縣","县"],"肅":["粛","肅","肃"],"専":["專","専","专"],"様":["樣","様","样"],"関":["關","関","关"],"檢":["検","檢","检"],"侮":["侮","侮"],"沉":["沉","沈"],"嚐":["嚐","嘗","尝"],"搾":["搾","榨"],"获":["获","獲","穫"],"繮":["繮","缰","韁"],"贋":["贋","贗","赝"],"獃":["呆"],"杯":["杯","盃"],"呪":["呪","咒","詋"],"䇳":["䇳","笺","箋","牋"],"竝":["竝","𠀤"],"彷":["彷","徬"],"贑":["贑","𫎬"],"崖":["崖","崕","厓"],"岩":["岩","巖","巗","巌"],"灕":["灕","漓"],"粘":["粘","黏"],"娴":["娴","嫺","嫻"],"哗":["哗","嘩","譁"],"拔":["拔","抜"],"湿":["湿","溼","濕"],"稻":["稻","稲"],"楕":["楕","椭","橢"],"毎":["毎","每"],"篦":["篦","箆"],"騨":["騨","驒","驔"],"猛":["猛","勐"],"吿":["吿","告"],"刃":["刃","刄"],"教":["教","敎"],"蛎":["蛎","蜊","蠣"],"步":["步","歩"],"劫":["刦","刧","刼","劫"],"剑":["劍","剑","剣","劎","劒","剱","劔"],"剣":["劍","剑","剣","劎","劒","剱","劔"],"劎":["劍","剑","剣","劎","劒","剱","劔"],"劒":["劍","剑","剣","劎","劒","剱","劔"],"剱":["劍","剑","剣","劎","劒","剱","劔"],"劔":["劍","剑","剣","劎","劒","剱","劔"],"炮":["砲","炮"],"僞":["偽","僞"],"内":["內","内"],"鷄":["鶏","鷄","雞","鸡"],"雞":["鶏","鷄","雞","鸡"],"鸡":["鶏","鷄","雞","鸡"],"兔":["兎","兔"],"坯":["坯","坏","壊","壞"],"壊":["坯","坏","壊","壞"],"壞":["坯","坏","壊","壞"],"殼":["殻","殼","壳"],"壳":["殻","殼","壳"],"象":["像","象"],"囌":["苏","蘇","囌"],"館":["館","館","舘","馆"],"舘":["館","館","舘","馆"],"馆":["館","館","舘","馆"],"鸟":["鳥","鸟","𫠓"],"𫠓":["鳥","鸟","𫠓"],"視":["視","視","视","眎"],"视":["視","視","视","眎"],"眎":["視","視","视","眎"],"險":["険","險","险","嶮","崄"],"险":["険","險","险","嶮","崄"],"嶮":["険","險","险","嶮","崄"],"崄":["険","險","险","嶮","崄"],"絕":["絶","絕","绝"],"绝":["絶","絕","绝"],"鐵":["鉄","鐵","铁","鐡"],"铁":["鉄","鐵","铁","鐡"],"鐡":["鉄","鐵","铁","鐡"],"諸":["諸","諸","诸"],"诸":["諸","諸","诸"],"寻":["尋","寻","𡬶"],"𡬶":["尋","寻","𡬶"],"裏":["裡","裏","里"],"里":["裡","裏","里"],"鉴":["鑑","鉴","鑒"],"鑒":["鑑","鉴","鑒"],"麪":["麵","麪","麺"],"麺":["麵","麪","麺"],"歳":["歲","歳","岁"],"岁":["歲","歳","岁"],"鍾":["鐘","鍾","钟","锺"],"钟":["鐘","鍾","钟","锺"],"锺":["鐘","鍾","钟","锺"],"会":["會","会","㑹"],"㑹":["會","会","㑹"],"凃":["塗","凃","涂"],"涂":["塗","凃","涂"],"髪":["髮","髪"],"话":["話","话","䛡"],"䛡":["話","话","䛡"],"參":["蔘","參","参"],"参":["蔘","參","参"],"勞":["労","勞","劳"],"劳":["労","勞","劳"],"囯":["国","囯","國"],"國":["国","囯","國"],"骂":["罵","骂","駡"],"駡":["罵","骂","駡"],"對":["対","對","对"],"对":["対","對","对"],"銹":["鏽","銹","锈"],"锈":["鏽","銹","锈"],"䭾":["駄","䭾","馱","驮"],"馱":["駄","䭾","馱","驮"],"驮":["駄","䭾","馱","驮"],"萨":["薩","萨","蕯"],"蕯":["薩","萨","蕯"],"單":["単","單","单"],"单":["単","單","单"],"繼":["継","繼","继"],"继":["継","繼","继"],"验":["驗","验","騐","験"],"騐":["驗","验","騐","験"],"験":["驗","验","騐","験"],"团":["团","団","團"],"團":["团","団","團"],"麽":["麼","麽","庅"],"庅":["麼","麽","庅"],"戦":["戦","戰","战"],"战":["戦","戰","战"],"郷":["郷","鄕","鄉","鄊","乡"],"鄕":["郷","鄕","鄉","鄊","乡"],"鄉":["郷","鄕","鄉","鄊","乡"],"鄊":["郷","鄕","鄉","鄊","乡"],"馀":["餘","馀","余"],"余":["餘","馀","余"],"䋄":["網","䋄","䋞","网"],"䋞":["網","䋄","䋞","网"],"网":["網","䋄","䋞","网"],"讬":["託","讬","托"],"托":["託","讬","托"],"纤":["纖","纤","縴","繊"],"縴":["纖","纤","縴","繊"],"繊":["纖","纤","縴","繊"],"錬":["鍊","錬","𫔀","炼","煉"],"𫔀":["鍊","錬","𫔀","炼","煉"],"炼":["鍊","錬","𫔀","炼","煉"],"煉":["鍊","錬","𫔀","炼","煉"],"撃":["撃","擊","击"],"击":["撃","擊","击"],"実":["實","実","实","寔"],"实":["實","実","实","寔"],"寔":["實","実","实","寔"],"扵":["於","扵"],"証":["證","証","证"],"证":["證","証","证"],"据":["據","据","拠"],"拠":["據","据","拠"],"处":["處","处","䖏","処"],"䖏":["處","处","䖏","処"],"処":["處","处","䖏","処"],"瞠":["瞪","瞠","眙"],"眙":["瞪","瞠","眙"],"胑":["肢","胑"],"宍":["肉","宍","𠕎"],"𠕎":["肉","宍","𠕎"],"𢝊":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"𢚧":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"𢟜":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"懮":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"𨗫":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"迴":["廻","迴"],"錄":["録","錄","录"],"录":["録","錄","录"],"槍":["鎗","槍","枪"],"枪":["鎗","槍","枪"],"滺":["悠","滺"],"壺":["壶","壺","壷"],"壷":["壶","壺","壷"],"兹":["茲","兹","玆"],"玆":["茲","兹","玆"],"盖":["蓋","盖","葢"],"葢":["蓋","盖","葢"],"跡":["蹟","跡","迹"],"迹":["蹟","跡","迹"],"瘉":["癒","瘉"],"邊":["辺","邊","边","邉"],"边":["辺","邊","边","邉"],"邉":["辺","邊","边","邉"],"凖":["準","凖"],"衞":["衛","衞","卫"],"卫":["衛","衞","卫"],"晩":["晚","晩"],"躶":["裸","躶"],"龜":["亀","龜","龟","𪚧","𪚿","𠃾"],"龟":["亀","龜","龟","𪚧","𪚿","𠃾"],"𪚧":["亀","龜","龟","𪚧","𪚿","𠃾"],"𪚿":["亀","龜","龟","𪚧","𪚿","𠃾"],"𠃾":["亀","龜","龟","𪚧","𪚿","𠃾"],"氹":["凼","氹"],"草":["艸","草"],"剳":["箚","剳"],"復":["复","復","複"],"複":["复","復","複"],"汙":["污","汙","汚"],"汚":["污","汙","汚"],"夥":["伙","夥"],"禦":["御","禦"],"郁":["鬱","郁"],"凌":["淩","凌"],"扎":["紮","扎"],"癡":["痴","癡"],"棲":["栖","棲"],"奔":["犇","奔"],"范":["範","范"],"姜":["薑","姜","葁"],"葁":["薑","姜","葁"],"朴":["樸","朴"],"谘":["諮","谘","咨"],"咨":["諮","谘","咨"],"捻":["撚","捻"],"餵":["喂","餵","餧","𫗭"],"餧":["喂","餵","餧","𫗭"],"𫗭":["喂","餵","餧","𫗭"],"凈":["淨","凈","净"],"净":["淨","凈","净"],"慄":["栗","慄"],"輓":["挽","輓"],"竈":["灶","竈"],"缐":["線","缐","綫","线"],"綫":["線","缐","綫","线"],"线":["線","缐","綫","线"],"尽":["盡","尽","儘"],"霉":["黴","霉"],"週":["周","週"],"讃":["讚","讃"],"觀":["観","觀","观","覌"],"观":["観","觀","观","覌"],"覌":["観","觀","观","覌"],"游":["遊","游"],"啓":["启","啓","啟","啔"],"啟":["启","啓","啟","啔"],"啔":["启","啓","啟","啔"],"厩":["廄","厩","廐","廏"],"廐":["廄","厩","廐","廏"],"廏":["廄","厩","廐","廏"],"気":["気","氣","气"],"气":["気","氣","气"],"杰":["傑","杰"],"锻":["鍛","锻","煅"],"煅":["鍛","锻","煅"],"徴":["徵","徴"],"𫔮":["閒","𫔮","閑","闲"],"閑":["閒","𫔮","閑","闲"],"闲":["閒","𫔮","閑","闲"],"赞":["贊","赞","賛"],"賛":["贊","赞","賛"],"桜":["櫻","桜","樱"],"樱":["櫻","桜","樱"],"狵":["尨","狵"],"圏":["圈","圏"],"兇":["凶","兇"],"濱":["浜","濱","滨"],"滨":["浜","濱","滨"],"烟":["煙","烟","菸"],"菸":["煙","烟","菸"],"黑":["黒","黑"],"乐":["樂","乐","楽"],"楽":["樂","乐","楽"],"藥":["薬","藥","药","葯","𣛙"],"药":["薬","藥","药","葯","𣛙"],"葯":["薬","藥","药","葯","𣛙"],"𣛙":["薬","藥","药","葯","𣛙"],"券":["劵","券","卷"],"贰":["貳","贰","弐","貮","𢎐","二"],"弐":["貳","贰","弐","貮","𢎐","二"],"貮":["貳","贰","弐","貮","𢎐","二"],"𢎐":["貳","贰","弐","貮","𢎐","二"],"二":["貳","贰","弐","貮","𢎐","二"],"隸":["隷","隸","隶"],"隶":["隷","隸","隶"],"姬":["姫","姬"],"熏":["燻","熏"],"龥":["籲","龥"],"啮":["齧","啮","𪘂","囓","噛","嚙"],"𪘂":["齧","啮","𪘂","囓","噛","嚙"],"囓":["齧","啮","𪘂","囓","噛","嚙"],"噛":["齧","啮","𪘂","囓","噛","嚙"],"嚙":["齧","啮","𪘂","囓","噛","嚙"],"碱":["鹼","碱","硷"],"硷":["鹼","碱","硷"],"穂":["穗","穂"],"廃":["廢","廃","废"],"废":["廢","廃","废"],"跖":["蹠","跖"],"咤":["吒","咤"],"鏟":["剷","鏟","铲","刬","剗"],"铲":["剷","鏟","铲","刬","剗"],"刬":["剷","鏟","铲","刬","剗"],"剗":["剷","鏟","铲","刬","剗"],"劈":["擗","劈"],"覈":["核","覈"],"唇":["脣","唇"],"昇":["升","昇"],"盤":["磐","盤","盘"],"盘":["磐","盤","盘"],"渓":["溪","渓"],"嵠":["谿","嵠"],"摺":["折","摺"],"佑":["祐","佑"],"罋":["瓮","罋","甕"],"甕":["瓮","罋","甕"],"踪":["蹤","踪","踨"],"踨":["蹤","踪","踨"],"暱":["昵","暱"],"佈":["布","佈"],"为":["為","为","爲"],"爲":["為","为","爲"],"繃":["綳","繃","绷"],"绷":["綳","繃","绷"],"痹":["痺","痹"],"痳":["痲","痳"],"僱":["雇","僱"],"叙":["敘","叙","敍"],"敍":["敘","叙","敍"],"蕩":["盪","蕩","荡"],"荡":["盪","蕩","荡"],"勳":["勛","勳","勋","勲"],"勋":["勛","勳","勋","勲"],"勲":["勛","勳","勋","勲"],"墙":["牆","墙","墻"],"墻":["牆","墙","墻"],"尔":["爾","尔","尓"],"尓":["爾","尔","尓"],"焔":["焰","焔"],"黙":["默","黙"],"压":["壓","压","圧"],"圧":["壓","压","圧"],"迪":["廸","迪"],"晓":["曉","晓","暁"],"暁":["曉","晓","暁"],"覇":["霸","覇"],"靈":["霊","靈","灵"],"灵":["霊","靈","灵"],"涙":["泪","涙","淚"],"淚":["泪","涙","淚"],"犠":["牺","犠","犧"],"犧":["牺","犠","犧"],"耤":["藉","耤"],"吨":["噸","吨"],"倶":["俱","倶"],"糉":["粽","糉","糭"],"糭":["粽","糉","糭"],"曏":["向","曏","嚮"],"嚮":["向","曏","嚮"],"淒":["悽","淒","凄"],"凄":["悽","淒","凄"],"鰐":["鱷","鰐","鳄"],"鳄":["鱷","鰐","鳄"],"顏":["颜","顏","顔"],"顔":["颜","顏","顔"],"沖":["衝","沖","冲"],"梁":["樑","梁"],"沙":["砂","沙"],"碳":["炭","碳"],"絲":["糸","絲","丝"],"丝":["糸","絲","丝"],"檐":["簷","檐"],"湧":["涌","湧"],"两":["両","两","兩"],"兩":["両","两","兩"],"傢":["家","傢"],"你":["妳","你"],"他":["她","他"],"籐":["藤","籐","籘"],"籘":["藤","籐","籘"],"嘻":["嬉","嘻"],"亙":["亘","亙"],"恒":["恆","恒"],"鶫":["鶇","鶫","鸫"],"鸫":["鶇","鶫","鸫"],"姐":["姉","姐","姊"],"姊":["姉","姐","姊"],"刴":["剁","刴"],"洩":["泄","洩"],"铺":["舖","铺","鋪","舗"],"鋪":["舖","铺","鋪","舗"],"舗":["舖","铺","鋪","舗"],"効":["效","効"],"喩":["喻","喩"],"挿":["挿","插","揷"],"揷":["挿","插","揷"],"鋭":["銳","鋭","锐"],"锐":["銳","鋭","锐"],"権":["權","権","权"],"权":["權","権","权"],"經":["経","經","经"],"经":["経","經","经"],"歡":["歓","歡","欢"],"欢":["歓","歡","欢"],"嬢":["嬢","孃"],"濟":["済","濟","济"],"济":["済","濟","济"],"収":["収","收"],"緑":["綠","緑","绿"],"绿":["綠","緑","绿"],"啞":["唖","啞","哑"],"哑":["唖","啞","哑"],"勦":["剿","勦","𠞰"],"𠞰":["剿","勦","𠞰"],"禍":["禍","禍","祸"],"祸":["禍","禍","祸"],"營":["營","営","营"],"营":["營","営","营"],"產":["產","産","产"],"产":["產","産","产"],"查":["查","査"],"繪":["繪","絵","绘"],"绘":["繪","絵","绘"],"懷":["懷","懐","怀"],"怀":["懷","懐","怀"],"釋":["釋","釈","释"],"释":["釋","釈","释"],"藏":["藏","蔵"],"娛":["娛","娯","娱"],"娱":["娛","娯","娱"],"燒":["燒","焼","烧"],"烧":["燒","焼","烧"],"擴":["擴","拡","扩"],"扩":["擴","拡","扩"],"賤":["賤","賎","贱"],"贱":["賤","賎","贱"],"錢":["錢","銭","钱"],"钱":["錢","銭","钱"],"雜":["雜","雑","杂"],"杂":["雜","雑","杂"],"聽":["聽","聴","听"],"听":["聽","聴","听"],"帶":["帶","帯","带"],"带":["帶","帯","带"],"阅":["閲","阅"],"覽":["覽","覧","览"],"览":["覽","覧","览"],"惡":["惡","悪","恶"],"亞":["亞","亜","亚"],"亚":["亞","亜","亚"],"冰":["冰","氷"],"県":["県","縣","县"],"縣":["県","縣","县"],"粛":["粛","肅","肃"],"肃":["粛","肅","肃"],"專":["專","専","专"],"专":["專","専","专"],"樣":["樣","様","样"],"样":["樣","様","样"],"關":["關","関","关"],"关":["關","関","关"],"検":["検","檢","检"],"检":["検","檢","检"],"侮":["侮","侮"],"沈":["沉","沈"],"嘗":["嚐","嘗","尝"],"尝":["嚐","嘗","尝"],"榨":["搾","榨"],"獲":["获","獲","穫"],"穫":["获","獲","穫"],"缰":["繮","缰","韁"],"韁":["繮","缰","韁"],"贗":["贋","贗","赝"],"赝":["贋","贗","赝"],"呆":["呆"],"盃":["杯","盃"],"咒":["呪","咒","詋"],"詋":["呪","咒","詋"],"笺":["䇳","笺","箋","牋"],"箋":["䇳","笺","箋","牋"],"牋":["䇳","笺","箋","牋"],"𠀤":["竝","𠀤"],"徬":["彷","徬"],"𫎬":["贑","𫎬"],"崕":["崖","崕","厓"],"厓":["崖","崕","厓"],"巖":["岩","巖","巗","巌"],"巗":["岩","巖","巗","巌"],"巌":["岩","巖","巗","巌"],"漓":["灕","漓"],"黏":["粘","黏"],"嫺":["娴","嫺","嫻"],"嫻":["娴","嫺","嫻"],"嘩":["哗","嘩","譁"],"譁":["哗","嘩","譁"],"抜":["拔","抜"],"溼":["湿","溼","濕"],"濕":["湿","溼","濕"],"稲":["稻","稲"],"椭":["楕","椭","橢"],"橢":["楕","椭","橢"],"每":["毎","每"],"箆":["篦","箆"],"驒":["騨","驒","驔"],"驔":["騨","驒","驔"],"勐":["猛","勐"],"告":["吿","告"],"刄":["刃","刄"],"敎":["教","敎"],"蜊":["蛎","蜊","蠣"],"蠣":["蛎","蜊","蠣"],"歩":["步","歩"],"刦":["刦","刧","刼","劫"],"刧":["刦","刧","刼","劫"],"刼":["刦","刧","刼","劫"]},Vt._table_cn={"羅":"罗","惡":"恶","蘇":"苏","館":"馆"};var Xt={};Object.defineProperty(Xt,"__esModule",{value:!0}),Xt.table_plus_core=Xt.table_jp_core=Xt._table_tw=void 0,Xt._table_tw={"罗":"羅","恶":"惡","苏":"蘇","馆":"館"},Xt.table_jp_core={"の":["の","之","的"],"と":["と","與","与"],"画":["划","画","劃","畫"],"闘":["斗"],"鬥":["斗"],"鬭":["斗"],"鬪":["斗"],"闇":["暗"],"図":["図","圖","图"],"当":["当","噹","當","儅"],"閤":["合"],"阁":["合"],"罗":["羅","罗","儸","㑩","囉","啰"],"干":["幹","乾","干"],"幹":["幹","干"],"乾":["干","乾","亁","乹"],"亁":["乾","亁","乹"],"乹":["乾","亁","乹"],"历":["历","歴","歷","暦","曆"],"歴":["历"],"歷":["历"],"暦":["历"],"曆":["历"],"呻":["呻","申"],"覆":["覆","复"],"复":["覆"],"勉":["免"],"勉":["免"],"甦":["甦","蘇","苏"],"忧":["憂","優"],"鹹":["咸","鹹"],"准":["準","准"],"準":["準","准"],"袮":["袮","祢"],"儘":["儘","侭"],"侭":["儘","侭"],"脏":["脏","髒","臟"],"发":["髮","髪","发"],"髮":["發","发"],"慾":["慾","欲"],"讚":["讃","讚","贊","赞","賛"],"冲":["冲","沖","衝"],"面":["麵","麪","麺"],"鬚":["鬚","須","须"],"揹":["揹","背"],"捲":["捲","卷","巻"],"卷":["捲","卷","巻","劵","券"],"巻":["捲","卷","巻","劵","券"],"苏":["苏","蘇","甦"],"瀏":["瀏","浏","刘"],"浏":["瀏","浏","刘"],"吁":["籲","吁"],"囉":["囉","啰","罗","羅"],"啰":["囉","啰","罗","羅"],"修":["修","俢"],"犟":["犟","強","强"],"嗬":["嗬","呵"],"唿":["唿","呼"],"媮":["媮","偷"],"采":["采","採"],"彩":["彩","采"],"𠩺":["𠩺","釐"],"恶":["恶","噁","惡"],"炰":["炰","炮"],"辟":["辟","闢","避"],"避":["辟","避"],"闢":["辟","闢"],"滷":["魯","鲁"],"鹵":["魯","鲁"],"卤":["魯","鲁"],"儓":["儓","檯"],"檯":["儓","檯"],"台":["台","檯","臺","颱"],"練":["炼"],"练":["炼"],"繫":["系"],"繋":["系"],"糓":["谷"],"穀":["谷"],"版":["板"],"祕":["密"],"秘":["密"],"汇":["彙","匯"],"倂":["倂","併"],"併":["倂","併"],"幷":["并"],"并":["幷"],"矇":["蒙"],"濛":["蒙"],"懞":["蒙"],"煇":["煇","辉","𪸩"],"𪸩":["煇","辉","𪸩"],"签":["籤","簽"]},Xt.table_plus_core={"劍":["劍","剑","剣","劎","劒","剱","劔"],"砲":["砲","炮"],"偽":["偽","僞"],"內":["內","内"],"鬥":["鬭","鬥","闘","鬪"],"鶏":["鶏","鷄","雞","鸡"],"兎":["兎","兔"],"坏":["坯","坏","壊","壞"],"殻":["殻","殼","壳"],"像":["像","象"],"蘇":["苏","蘇","囌"],"館":["館","館","舘","馆"],"鳥":["鳥","鸟","𫠓"],"視":["視","視","视","眎"],"険":["険","險","险","嶮","崄"],"絶":["絶","絕","绝"],"鉄":["鉄","鐵","铁","鐡"],"諸":["諸","諸","诸"],"尋":["尋","寻","𡬶"],"裡":["裡","裏","里"],"鑑":["鑑","鉴","鑒"],"麵":["麵","麪","麺"],"歲":["歲","歳","岁"],"鐘":["鐘","鍾","钟","锺"],"會":["會","会","㑹"],"塗":["塗","凃","涂"],"髮":["髮","髪"],"話":["話","话","䛡"],"閤":["閤","阁"],"蔘":["蔘","參","参"],"労":["労","勞","劳"],"国":["国","囯","國"],"罵":["罵","骂","駡"],"対":["対","對","对"],"鏽":["鏽","銹","锈"],"駄":["駄","䭾","馱","驮"],"薩":["薩","萨","蕯"],"単":["単","單","单"],"継":["継","繼","继"],"驗":["驗","验","騐","験"],"歴":["歴","歷"],"暦":["暦","曆"],"団":["团","団","團"],"麼":["麼","麽","庅"],"戰":["戦","戰","战"],"乡":["郷","鄕","鄉","鄊","乡"],"勉":["勉","勉"],"餘":["餘","馀","余"],"網":["網","䋄","䋞","网"],"託":["託","讬","托"],"纖":["纖","纤","縴","繊"],"鍊":["鍊","錬","𫔀","炼","煉"],"擊":["撃","擊","击"],"實":["實","実","实","寔"],"於":["於","扵"],"證":["證","証","证"],"據":["據","据","拠"],"處":["處","处","䖏","処"],"瞪":["瞪","瞠","眙"],"肢":["肢","胑"],"肉":["肉","宍","𠕎"],"憂":["憂","𢝊","𢚧","𢟜","懮","𨗫"],"繫":["繫","繋"],"廻":["廻","迴"],"録":["録","錄","录"],"鎗":["鎗","槍","枪"],"悠":["悠","滺"],"壶":["壶","壺","壷"],"茲":["茲","兹","玆"],"蓋":["蓋","盖","葢"],"蹟":["蹟","跡","迹"],"癒":["癒","瘉"],"辺":["辺","邊","边","邉"],"準":["準","凖"],"衛":["衛","衞","卫"],"晚":["晚","晩"],"裸":["裸","躶"],"亀":["亀","龜","龟","𪚧","𪚿","𠃾"],"凼":["凼","氹"],"艸":["艸","草"],"箚":["箚","剳"],"复":["复","復","複"],"污":["污","汙","汚"],"伙":["伙","夥"],"御":["御","禦"],"鬱":["鬱","郁"],"淩":["淩","凌"],"紮":["紮","扎"],"痴":["痴","癡"],"栖":["栖","棲"],"犇":["犇","奔"],"範":["範","范"],"薑":["薑","姜","葁"],"樸":["樸","朴"],"諮":["諮","谘","咨"],"撚":["撚","捻"],"喂":["喂","餵","餧","𫗭"],"淨":["淨","凈","净"],"栗":["栗","慄"],"挽":["挽","輓"],"灶":["灶","竈"],"線":["線","缐","綫","线"],"盡":["盡","尽","儘"],"黴":["黴","霉"],"周":["周","週"],"並":["並","并","併"],"讚":["讚","讃"],"観":["観","觀","观","覌"],"遊":["遊","游"],"启":["启","啓","啟","啔"],"廄":["廄","厩","廐","廏"],"氣":["気","氣","气"],"欲":["慾","欲"],"傑":["傑","杰"],"鍛":["鍛","锻","煅"],"徵":["徵","徴"],"閒":["閒","𫔮","閑","闲"],"贊":["贊","赞","賛"],"櫻":["櫻","桜","樱"],"尨":["尨","狵"],"圈":["圈","圏"],"凶":["凶","兇"],"浜":["浜","濱","滨"],"煙":["煙","烟","菸"],"黒":["黒","黑"],"樂":["樂","乐","楽"],"薬":["薬","藥","药","葯","𣛙"],"劵":["劵","券","卷"],"貳":["貳","贰","弐","貮","𢎐","二"],"隷":["隷","隸","隶"],"姫":["姫","姬"],"燻":["燻","熏"],"籲":["籲","龥"],"齧":["齧","啮","𪘂","囓","噛","嚙"],"鹼":["鹼","碱","硷"],"咸":["咸","鹹"],"穗":["穗","穂"],"廢":["廢","廃","废"],"蹠":["蹠","跖"],"吒":["吒","咤"],"剷":["剷","鏟","铲","刬","剗"],"擗":["擗","劈"],"核":["核","覈"],"脣":["脣","唇","唇"],"升":["升","昇"],"磐":["磐","盤","盘"],"溪":["溪","渓"],"谿":["谿","嵠"],"折":["折","摺"],"祐":["祐","佑"],"瓮":["瓮","罋","甕"],"蹤":["蹤","踪","踨"],"暗":["闇","暗"],"昵":["昵","暱"],"布":["布","佈"],"為":["為","为","爲"],"綳":["綳","繃","绷"],"痺":["痺","痹"],"痲":["痲","痳"],"雇":["雇","僱"],"敘":["敘","叙","敍"],"盪":["盪","蕩","荡"],"勛":["勛","勳","勋","勲"],"祕":["祕","秘"],"牆":["牆","墙","墻"],"爾":["爾","尔","尓"],"焰":["焰","焔"],"默":["默","黙"],"壓":["壓","压","圧"],"廸":["廸","迪"],"曉":["曉","晓","暁"],"霸":["霸","覇"],"霊":["霊","靈","灵"],"泪":["泪","涙","淚"],"牺":["牺","犠","犧"],"藉":["藉","耤"],"噸":["噸","吨"],"俱":["俱","倶"],"粽":["粽","糉","糭"],"向":["向","曏","嚮"],"悽":["悽","淒","凄"],"鱷":["鱷","鰐","鳄"],"滷":["滷","鹵","卤"],"颜":["颜","顏","顔"],"衝":["衝","沖","冲"],"樑":["樑","梁"],"砂":["砂","沙"],"炭":["炭","碳"],"糸":["糸","絲","丝"],"簷":["簷","檐"],"涌":["涌","湧"],"糓":["穀","糓"],"両":["両","两","兩"],"家":["家","傢"],"妳":["妳","你"],"她":["她","他"],"藤":["藤","籐","籘"],"嬉":["嬉","嘻"],"亘":["亘","亙"],"恆":["恆","恒"],"鶇":["鶇","鶫","鸫"],"姉":["姉","姐","姊"],"剁":["剁","刴"],"泄":["泄","洩"],"舖":["舖","铺","鋪","舗"],"效":["效","効"],"喻":["喻","喩"],"插":["挿","插","揷"],"銳":["銳","鋭","锐"],"權":["權","権","权"],"経":["経","經","经"],"歓":["歓","歡","欢"],"孃":["嬢","孃"],"済":["済","濟","济"],"收":["収","收"],"綠":["綠","緑","绿"],"唖":["唖","啞","哑"],"剿":["剿","勦","𠞰"],"禍":["禍","禍","祸"],"営":["營","営","营"],"産":["產","産","产"],"査":["查","査"],"絵":["繪","絵","绘"],"懐":["懷","懐","怀"],"釈":["釋","釈","释"],"蔵":["藏","蔵"],"娯":["娛","娯","娱"],"焼":["燒","焼","烧"],"拡":["擴","拡","扩"],"賎":["賤","賎","贱"],"銭":["錢","銭","钱"],"雑":["雜","雑","杂"],"聴":["聽","聴","听"],"帯":["帶","帯","带"],"閲":["閲","阅"],"覧":["覽","覧","览"],"悪":["惡","悪","恶"],"亜":["亞","亜","亚"],"氷":["冰","氷"],"县":["県","縣","县"],"肅":["粛","肅","肃"],"専":["專","専","专"],"様":["樣","様","样"],"関":["關","関","关"],"檢":["検","檢","检"],"侮":["侮","侮"],"沉":["沉","沈"],"嚐":["嚐","嘗","尝"],"搾":["搾","榨"],"获":["获","獲","穫"],"繮":["繮","缰","韁"],"贋":["贋","贗","赝"],"獃":["呆"],"杯":["杯","盃"],"呪":["呪","咒","詋"],"䇳":["䇳","笺","箋","牋"],"竝":["竝","𠀤"],"彷":["彷","徬"],"贑":["贑","𫎬"],"崖":["崖","崕","厓"],"岩":["岩","巖","巗","巌"],"灕":["灕","漓"],"粘":["粘","黏"],"娴":["娴","嫺","嫻"],"哗":["哗","嘩","譁"],"拔":["拔","抜"],"湿":["湿","溼","濕"],"稻":["稻","稲"],"楕":["楕","椭","橢"],"毎":["毎","每"],"篦":["篦","箆"],"騨":["騨","驒","驔"],"猛":["猛","勐"],"吿":["吿","告"],"刃":["刃","刄"],"教":["教","敎"],"蛎":["蛎","蜊","蠣"],"步":["步","歩"],"劫":["刦","刧","刼","劫"]},function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.cn=h.tw=h.jp=void 0;const z=qt,t=Vt,s=Xt,p=It;h.jp=function(h,s={}){let p=[];return p=(0, z._get)(p,t.table_jp[h]),p},h.tw=function(h,t={}){let j=[];return j=(0, z._get)(j,s._table_tw[h],(0, p.cn2tw)(h,t)),j},h.cn=function(h,s={}){let j=[];return j=(0, z._get)(j,t._table_cn[h],(0, p.tw2cn)(h,s)),j},h.default=h;}(Jt);var Qt={};Object.defineProperty(Qt,"__esModule",{value:!0}),Qt._wrapFn=Qt._get=void 0;const hs=mt,zs=qt,ts=a.__importDefault(Jt);Qt._get=function(h,z,...t){return h=(0, zs._get)(h,z,...t),(0, hs.array_unique)(h).sort()},Qt._wrapFn=function(h){return function(z,t={}){if(!z)return null;if(t.skip&&-1!=t.skip.indexOf(z))return [z];let s=ts.default[h](z,t);return s=(0, hs.array_unique)(s),s.sort(),s}};var ss={};Object.defineProperty(ss,"__esModule",{value:!0});var ps={},js={},es={};Object.defineProperty(es,"__esModule",{value:!0}),es.TABLE_SAFE=es.TABLE=es.TABLE_KEYS=void 0,es.TABLE_KEYS=["jp","zht","zhs"],es.TABLE={jp:{"会":{jp:"会",zht:"會",zhs:"会"},"箋":{jp:"箋",zht:"箋",zhs:"笺"},"網":{jp:"網",zht:"網",zhs:"网"},"処":{jp:"処",zht:"處",zhs:"处"},"話":{jp:"話",zht:"話",zhs:"话"},"駄":{jp:"駄",zht:"馱",zhs:"驮"},"馱":{jp:"馱",zht:"馱",zhs:"驮"},"万":{jp:"万",zht:"萬",zhs:"万"},"与":{jp:"与",zht:"與",zhs:"与"},"醜":{jp:"醜",zht:"醜",zhs:"丑"},"専":{jp:"専",zht:"專",zhs:"专"},"業":{jp:"業",zht:"業",zhs:"业"},"東":{jp:"東",zht:"東",zhs:"东"},"絲":{jp:"絲",zht:"絲",zhs:"丝"},"糸":{jp:"糸",zht:"絲",zhs:"丝"},"両":{jp:"両",zht:"兩",zhs:"两"},"厳":{jp:"厳",zht:"嚴",zhs:"严"},"並":{jp:"並",zht:"並",zhs:"并"},"喪":{jp:"喪",zht:"喪",zhs:"丧"},"個":{jp:"個",zht:"個",zhs:"个"},"豊":{jp:"豊",zht:"豐",zhs:"丰"},"臨":{jp:"臨",zht:"臨",zhs:"临"},"為":{jp:"為",zht:"為",zhs:"为"},"麗":{jp:"麗",zht:"麗",zhs:"丽"},"挙":{jp:"挙",zht:"舉",zhs:"举"},"廼":{jp:"廼",zht:"迺",zhs:"迺"},"義":{jp:"義",zht:"義",zhs:"义"},"楽":{jp:"楽",zht:"樂",zhs:"乐"},"乗":{jp:"乗",zht:"乘",zhs:"乘"},"習":{jp:"習",zht:"習",zhs:"习"},"郷":{jp:"郷",zht:"鄉",zhs:"乡"},"書":{jp:"書",zht:"書",zhs:"书"},"買":{jp:"買",zht:"買",zhs:"买"},"乱":{jp:"乱",zht:"亂",zhs:"乱"},"乾":{jp:"乾",zht:"乾",zhs:"干"},"亀":{jp:"亀",zht:"龜",zhs:"龟"},"予":{jp:"予",zht:"預",zhs:"预"},"弐":{jp:"弐",zht:"貳",zhs:"贰"},"雲":{jp:"雲",zht:"雲",zhs:"云"},"亜":{jp:"亜",zht:"亞",zhs:"亚"},"産":{jp:"産",zht:"產",zhs:"产"},"畝":{jp:"畝",zht:"畝",zhs:"亩"},"親":{jp:"親",zht:"親",zhs:"亲"},"億":{jp:"億",zht:"億",zhs:"亿"},"僕":{jp:"僕",zht:"僕",zhs:"仆"},"従":{jp:"従",zht:"從",zhs:"从"},"仏":{jp:"仏",zht:"佛",zhs:"佛"},"倉":{jp:"倉",zht:"倉",zhs:"仓"},"儀":{jp:"儀",zht:"儀",zhs:"仪"},"仮":{jp:"仮",zht:"假",zhs:"假"},"価":{jp:"価",zht:"價",zhs:"价"},"衆":{jp:"衆",zht:"眾",zhs:"众"},"優":{jp:"優",zht:"優",zhs:"优"},"伝":{jp:"伝",zht:"傳",zhs:"传"},"傘":{jp:"傘",zht:"傘",zhs:"伞"},"偉":{jp:"偉",zht:"偉",zhs:"伟"},"傷":{jp:"傷",zht:"傷",zhs:"伤"},"倫":{jp:"倫",zht:"倫",zhs:"伦"},"偽":{jp:"偽",zht:"偽",zhs:"伪"},"体":{jp:"体",zht:"體",zhs:"体"},"余":{jp:"余",zht:"餘",zhs:"余"},"来":{jp:"来",zht:"來",zhs:"来"},"偵":{jp:"偵",zht:"偵",zhs:"侦"},"側":{jp:"側",zht:"側",zhs:"侧"},"倹":{jp:"倹",zht:"儉",zhs:"俭"},"倶":{jp:"倶",zht:"俱",zhs:"俱"},"債":{jp:"債",zht:"債",zhs:"债"},"傾":{jp:"傾",zht:"傾",zhs:"倾"},"償":{jp:"償",zht:"償",zhs:"偿"},"傑":{jp:"傑",zht:"傑",zhs:"杰"},"備":{jp:"備",zht:"備",zhs:"备"},"当":{jp:"当",zht:"當",zhs:"当"},"尽":{jp:"尽",zht:"盡",zhs:"尽"},"児":{jp:"児",zht:"兒",zhs:"儿"},"党":{jp:"党",zht:"黨",zhs:"党"},"内":{jp:"内",zht:"內",zhs:"内"},"関":{jp:"関",zht:"關",zhs:"关"},"興":{jp:"興",zht:"興",zhs:"兴"},"養":{jp:"養",zht:"養",zhs:"养"},"獣":{jp:"獣",zht:"獸",zhs:"兽"},"円":{jp:"円",zht:"圓",zhs:"圆"},"写":{jp:"写",zht:"寫",zhs:"写"},"軍":{jp:"軍",zht:"軍",zhs:"军"},"農":{jp:"農",zht:"農",zhs:"农"},"冨":{jp:"冨",zht:"富",zhs:"富"},"氷":{jp:"氷",zht:"冰",zhs:"冰"},"衝":{jp:"衝",zht:"衝",zhs:"冲"},"決":{jp:"決",zht:"決",zhs:"决"},"凍":{jp:"凍",zht:"凍",zhs:"冻"},"塗":{jp:"塗",zht:"塗",zhs:"涂"},"凄":{jp:"凄",zht:"淒",zhs:"凄"},"准":{jp:"准",zht:"準",zhs:"准"},"準":{jp:"準",zht:"準",zhs:"准"},"幾":{jp:"幾",zht:"幾",zhs:"几"},"撃":{jp:"撃",zht:"擊",zhs:"击"},"画":{jp:"画",zht:"劃",zhs:"划"},"則":{jp:"則",zht:"則",zhs:"则"},"剛":{jp:"剛",zht:"剛",zhs:"刚"},"創":{jp:"創",zht:"創",zhs:"创"},"別":{jp:"別",zht:"別",zhs:"别"},"製":{jp:"製",zht:"製",zhs:"制"},"券":{jp:"券",zht:"卷",zhs:"卷"},"巻":{jp:"巻",zht:"卷",zhs:"卷"},"刹":{jp:"刹",zht:"剎",zhs:"刹"},"剤":{jp:"剤",zht:"劑",zhs:"剂"},"剣":{jp:"剣",zht:"劍",zhs:"剑"},"劇":{jp:"劇",zht:"劇",zhs:"剧"},"剰":{jp:"剰",zht:"剩",zhs:"剩"},"勧":{jp:"勧",zht:"勸",zhs:"劝"},"務":{jp:"務",zht:"務",zhs:"务"},"動":{jp:"動",zht:"動",zhs:"动"},"励":{jp:"励",zht:"勵",zhs:"励"},"労":{jp:"労",zht:"勞",zhs:"劳"},"効":{jp:"効",zht:"效",zhs:null},"勢":{jp:"勢",zht:"勢",zhs:"势"},"勲":{jp:"勲",zht:"勳",zhs:"勋"},"勝":{jp:"勝",zht:"勝",zhs:"胜"},"区":{jp:"区",zht:"區",zhs:"区"},"医":{jp:"医",zht:"醫",zhs:"医"},"華":{jp:"華",zht:"華",zhs:"华"},"協":{jp:"協",zht:"協",zhs:"协"},"単":{jp:"単",zht:"單",zhs:"单"},"売":{jp:"売",zht:"賣",zhs:"卖"},"衛":{jp:"衛",zht:"衛",zhs:"卫"},"庁":{jp:"庁",zht:"廳",zhs:"厅"},"歴":{jp:"歴",zht:"歷",zhs:"历"},"暦":{jp:"暦",zht:"曆",zhs:"历"},"圧":{jp:"圧",zht:"壓",zhs:"压"},"県":{jp:"県",zht:"縣",zhs:"县"},"参":{jp:"参",zht:"參",zhs:"参"},"双":{jp:"双",zht:"雙",zhs:"双"},"収":{jp:"収",zht:"收",zhs:"收"},"発":{jp:"発",zht:"發",zhs:"发"},"変":{jp:"変",zht:"變",zhs:"变"},"畳":{jp:"畳",zht:"疊",zhs:"叠"},"号":{jp:"号",zht:"號",zhs:"号"},"嘆":{jp:"嘆",zht:"嘆",zhs:"叹"},"嚇":{jp:"嚇",zht:"嚇",zhs:"吓"},"聴":{jp:"聴",zht:"聽",zhs:"听"},"啓":{jp:"啓",zht:"啟",zhs:"启"},"員":{jp:"員",zht:"員",zhs:"员"},"諮":{jp:"諮",zht:"諮",zhs:"谘"},"鹹":{jp:"鹹",zht:"鹹",zhs:"咸"},"響":{jp:"響",zht:"響",zhs:"响"},"問":{jp:"問",zht:"問",zhs:"问"},"営":{jp:"営",zht:"營",zhs:"营"},"噴":{jp:"噴",zht:"噴",zhs:"喷"},"嘱":{jp:"嘱",zht:"囑",zhs:"嘱"},"蘇":{jp:"蘇",zht:"蘇",zhs:"苏"},"団":{jp:"団",zht:"團",zhs:"团"},"園":{jp:"園",zht:"園",zhs:"园"},"国":{jp:"国",zht:"國",zhs:"国"},"囲":{jp:"囲",zht:"圍",zhs:"围"},"図":{jp:"図",zht:"圖",zhs:"图"},"圏":{jp:"圏",zht:"圈",zhs:"圈"},"聖":{jp:"聖",zht:"聖",zhs:"圣"},"場":{jp:"場",zht:"場",zhs:"场"},"壊":{jp:"壊",zht:"壞",zhs:"坏"},"塊":{jp:"塊",zht:"塊",zhs:"块"},"堅":{jp:"堅",zht:"堅",zhs:"坚"},"壇":{jp:"壇",zht:"壇",zhs:"坛"},"墳":{jp:"墳",zht:"墳",zhs:"坟"},"墜":{jp:"墜",zht:"墜",zhs:"坠"},"塁":{jp:"塁",zht:"壘",zhs:"垒"},"墾":{jp:"墾",zht:"墾",zhs:"垦"},"執":{jp:"執",zht:"執",zhs:"执"},"堕":{jp:"堕",zht:"墮",zhs:"堕"},"報":{jp:"報",zht:"報",zhs:"报"},"塩":{jp:"塩",zht:"鹽",zhs:"盐"},"増":{jp:"増",zht:"增",zhs:"增"},"壌":{jp:"壌",zht:"壤",zhs:"壤"},"壮":{jp:"壮",zht:"壯",zhs:"壮"},"声":{jp:"声",zht:"聲",zhs:"声"},"壱":{jp:"壱",zht:"壹",zhs:"壹"},"殻":{jp:"殻",zht:"殻",zhs:"壳"},"殼":{jp:"殼",zht:"殼",zhs:"壳"},"寿":{jp:"寿",zht:"壽",zhs:"寿"},"復":{jp:"復",zht:"復",zhs:"复"},"複":{jp:"複",zht:"複",zhs:"复"},"夢":{jp:"夢",zht:"夢",zhs:"梦"},"頭":{jp:"頭",zht:"頭",zhs:"头"},"誇":{jp:"誇",zht:"誇",zhs:"夸"},"奪":{jp:"奪",zht:"奪",zhs:"夺"},"奮":{jp:"奮",zht:"奮",zhs:"奋"},"奨":{jp:"奨",zht:"獎",zhs:"奖"},"粧":{jp:"粧",zht:"妝",zhs:"妆"},"婦":{jp:"婦",zht:"婦",zhs:"妇"},"姉":{jp:"姉",zht:"姐",zhs:"姐"},"姫":{jp:"姫",zht:"姬",zhs:"姬"},"嬢":{jp:"嬢",zht:"孃",zhs:"娘"},"娯":{jp:"娯",zht:"娛",zhs:"娱"},"孫":{jp:"孫",zht:"孫",zhs:"孙"},"学":{jp:"学",zht:"學",zhs:"学"},"寧":{jp:"寧",zht:"寧",zhs:"宁"},"宝":{jp:"宝",zht:"寶",zhs:"宝"},"実":{jp:"実",zht:"實",zhs:"实"},"審":{jp:"審",zht:"審",zhs:"审"},"憲":{jp:"憲",zht:"憲",zhs:"宪"},"宮":{jp:"宮",zht:"宮",zhs:"宫"},"寬":{jp:"寬",zht:"寬",zhs:"宽"},"賓":{jp:"賓",zht:"賓",zhs:"宾"},"秘":{jp:"秘",zht:"祕",zhs:"秘"},"寛":{jp:"寛",zht:"寬",zhs:"宽"},"寝":{jp:"寝",zht:"寢",zhs:"寝"},"対":{jp:"対",zht:"對",zhs:"对"},"尋":{jp:"尋",zht:"尋",zhs:"寻"},"導":{jp:"導",zht:"導",zhs:"导"},"将":{jp:"将",zht:"將",zhs:"将"},"層":{jp:"層",zht:"層",zhs:"层"},"属":{jp:"属",zht:"屬",zhs:"属"},"歳":{jp:"歳",zht:"歲",zhs:"岁"},"島":{jp:"島",zht:"島",zhs:"岛"},"巌":{jp:"巌",zht:"巖",zhs:"巖"},"峡":{jp:"峡",zht:"峽",zhs:"峡"},"険":{jp:"険",zht:"險",zhs:"险"},"幣":{jp:"幣",zht:"幣",zhs:"币"},"帥":{jp:"帥",zht:"帥",zhs:"帅"},"師":{jp:"師",zht:"師",zhs:"师"},"帳":{jp:"帳",zht:"帳",zhs:"帐"},"帶":{jp:"帶",zht:"帶",zhs:"带"},"帯":{jp:"帯",zht:"帶",zhs:"带"},"帰":{jp:"帰",zht:"歸",zhs:"归"},"幹":{jp:"幹",zht:"幹",zhs:"干"},"広":{jp:"広",zht:"廣",zhs:"广"},"庄":{jp:"庄",zht:"莊",zhs:"庄"},"慶":{jp:"慶",zht:"慶",zhs:"庆"},"庫":{jp:"庫",zht:"庫",zhs:"库"},"応":{jp:"応",zht:"應",zhs:"应"},"廃":{jp:"廃",zht:"廢",zhs:"废"},"開":{jp:"開",zht:"開",zhs:"开"},"弁":{jp:"弁",zht:"辨",zhs:"辨"},"異":{jp:"異",zht:"異",zhs:"异"},"棄":{jp:"棄",zht:"棄",zhs:"弃"},"弍":{jp:"弍",zht:"貳",zhs:"贰"},"張":{jp:"張",zht:"張",zhs:"张"},"弥":{jp:"弥",zht:"彌",zhs:"弥"},"強":{jp:"強",zht:"強",zhs:"强"},"弾":{jp:"弾",zht:"彈",zhs:"弹"},"録":{jp:"録",zht:"錄",zhs:"录"},"彦":{jp:"彦",zht:"彥",zhs:"彥"},"徹":{jp:"徹",zht:"徹",zhs:"彻"},"徴":{jp:"徴",zht:"徵",zhs:"征"},"径":{jp:"径",zht:"徑",zhs:"径"},"徳":{jp:"徳",zht:"德",zhs:"德"},"憶":{jp:"憶",zht:"憶",zhs:"忆"},"誌":{jp:"誌",zht:"誌",zhs:"志"},"憂":{jp:"憂",zht:"憂",zhs:"忧"},"懐":{jp:"懐",zht:"懷",zhs:"怀"},"態":{jp:"態",zht:"態",zhs:"态"},"総":{jp:"総",zht:"總",zhs:"总"},"恒":{jp:"恒",zht:"恆",zhs:"恒"},"恋":{jp:"恋",zht:"戀",zhs:"恋"},"懇":{jp:"懇",zht:"懇",zhs:"恳"},"恵":{jp:"恵",zht:"惠",zhs:"惠"},"悪":{jp:"悪",zht:"惡",zhs:"恶"},"悩":{jp:"悩",zht:"惱",zhs:"恼"},"悦":{jp:"悦",zht:"悅",zhs:"悅"},"懸":{jp:"懸",zht:"懸",zhs:"悬"},"驚":{jp:"驚",zht:"驚",zhs:"惊"},"惨":{jp:"惨",zht:"慘",zhs:"惨"},"懲":{jp:"懲",zht:"懲",zhs:"惩"},"愛":{jp:"愛",zht:"愛",zhs:"爱"},"憤":{jp:"憤",zht:"憤",zhs:"愤"},"願":{jp:"願",zht:"願",zhs:"愿"},"慮":{jp:"慮",zht:"慮",zhs:"虑"},"戯":{jp:"戯",zht:"戲",zhs:"戏"},"戦":{jp:"戦",zht:"戰",zhs:"战"},"戸":{jp:"戸",zht:"戶",zhs:"户"},"払":{jp:"払",zht:"拂",zhs:"拂"},"拡":{jp:"拡",zht:"擴",zhs:"扩"},"掃":{jp:"掃",zht:"掃",zhs:"扫"},"揚":{jp:"揚",zht:"揚",zhs:"扬"},"抜":{jp:"抜",zht:"拔",zhs:null},"択":{jp:"択",zht:"擇",zhs:"择"},"護":{jp:"護",zht:"護",zhs:"护"},"担":{jp:"担",zht:"擔",zhs:"担"},"拝":{jp:"拝",zht:"拜",zhs:"拜"},"擬":{jp:"擬",zht:"擬",zhs:"拟"},"拠":{jp:"拠",zht:"據",zhs:"据"},"擁":{jp:"擁",zht:"擁",zhs:"拥"},"挟":{jp:"挟",zht:"挾",zhs:"挟"},"揮":{jp:"揮",zht:"揮",zhs:"挥"},"揷":{jp:"揷",zht:"插",zhs:"插"},"挿":{jp:"挿",zht:"插",zhs:"插"},"損":{jp:"損",zht:"損",zhs:"损"},"捨":{jp:"捨",zht:"捨",zhs:"舍"},"掲":{jp:"掲",zht:"揭",zhs:"揭"},"掴":{jp:"掴",zht:"摑",zhs:"掴"},"揺":{jp:"揺",zht:"搖",zhs:"摇"},"摂":{jp:"摂",zht:"攝",zhs:"摄"},"撮":{jp:"撮",zht:"攝",zhs:"摄"},"敵":{jp:"敵",zht:"敵",zhs:"敌"},"敗":{jp:"敗",zht:"敗",zhs:"败"},"数":{jp:"数",zht:"數",zhs:"数"},"斉":{jp:"斉",zht:"齊",zhs:"齐"},"斎":{jp:"斎",zht:"齋",zhs:"斋"},"闘":{jp:"闘",zht:"鬥",zhs:"斗"},"鬪":{jp:"鬪",zht:"鬥",zhs:"斗"},"断":{jp:"断",zht:"斷",zhs:"断"},"旧":{jp:"旧",zht:"舊",zhs:"旧"},"時":{jp:"時",zht:"時",zhs:"时"},"曇":{jp:"曇",zht:"曇",zhs:"昙"},"昼":{jp:"昼",zht:"晝",zhs:"昼"},"顕":{jp:"顕",zht:"顯",zhs:"显"},"暁":{jp:"暁",zht:"曉",zhs:"晓"},"晩":{jp:"晩",zht:"晚",zhs:"晚"},"暫":{jp:"暫",zht:"暫",zhs:"暂"},"曽":{jp:"曽",zht:"曾",zhs:"曾"},"術":{jp:"術",zht:"術",zhs:"术"},"樸":{jp:"樸",zht:"樸",zhs:"朴"},"機":{jp:"機",zht:"機",zhs:"机"},"殺":{jp:"殺",zht:"殺",zhs:"杀"},"雑":{jp:"雑",zht:"雜",zhs:"杂"},"権":{jp:"権",zht:"權",zhs:"权"},"条":{jp:"条",zht:"條",zhs:"条"},"極":{jp:"極",zht:"極",zhs:"极"},"枢":{jp:"枢",zht:"樞",zhs:"枢"},"槍":{jp:"槍",zht:"槍",zhs:"枪"},"査":{jp:"査",zht:"查",zhs:"查"},"栄":{jp:"栄",zht:"榮",zhs:"荣"},"標":{jp:"標",zht:"標",zhs:"标"},"桟":{jp:"桟",zht:"棧",zhs:"栈"},"棟":{jp:"棟",zht:"棟",zhs:"栋"},"欄":{jp:"欄",zht:"欄",zhs:"栏"},"樹":{jp:"樹",zht:"樹",zhs:"树"},"様":{jp:"様",zht:"樣",zhs:"样"},"桜":{jp:"桜",zht:"櫻",zhs:"樱"},"橋":{jp:"橋",zht:"橋",zhs:"桥"},"検":{jp:"検",zht:"檢",zhs:"检"},"楼":{jp:"楼",zht:"樓",zhs:"楼"},"歓":{jp:"歓",zht:"歡",zhs:"欢"},"欧":{jp:"欧",zht:"歐",zhs:"欧"},"歩":{jp:"歩",zht:"步",zhs:"步"},"歯":{jp:"歯",zht:"齒",zhs:"齿"},"残":{jp:"残",zht:"殘",zhs:"残"},"殴":{jp:"殴",zht:"毆",zhs:"殴"},"気":{jp:"気",zht:"氣",zhs:"气"},"漢":{jp:"漢",zht:"漢",zhs:"汉"},"湯":{jp:"湯",zht:"湯",zhs:"汤"},"溝":{jp:"溝",zht:"溝",zhs:"沟"},"沢":{jp:"沢",zht:"澤",zhs:"泽"},"涙":{jp:"涙",zht:"淚",zhs:"泪"},"滝":{jp:"滝",zht:"瀧",zhs:"泷"},"潔":{jp:"潔",zht:"潔",zhs:"洁"},"浅":{jp:"浅",zht:"淺",zhs:"浅"},"濁":{jp:"濁",zht:"濁",zhs:"浊"},"測":{jp:"測",zht:"測",zhs:"测"},"済":{jp:"済",zht:"濟",zhs:"济"},"濃":{jp:"濃",zht:"濃",zhs:"浓"},"浜":{jp:"浜",zht:"濱",zhs:"滨"},"渋":{jp:"渋",zht:"涉",zhs:"涉"},"渦":{jp:"渦",zht:"渦",zhs:"涡"},"潤":{jp:"潤",zht:"潤",zhs:"润"},"漬":{jp:"漬",zht:"漬",zhs:"渍"},"漸":{jp:"漸",zht:"漸",zhs:"渐"},"渓":{jp:"渓",zht:"溪",zhs:"溪"},"漁":{jp:"漁",zht:"漁",zhs:"渔"},"湾":{jp:"湾",zht:"灣",zhs:"湾"},"湿":{jp:"湿",zht:"濕",zhs:"湿"},"満":{jp:"満",zht:"滿",zhs:"满"},"滅":{jp:"滅",zht:"滅",zhs:"灭"},"滞":{jp:"滞",zht:"滯",zhs:"滞"},"濫":{jp:"濫",zht:"濫",zhs:"滥"},"瀬":{jp:"瀬",zht:"瀨",zhs:"濑"},"灯":{jp:"灯",zht:"燈",zhs:"灯"},"霊":{jp:"霊",zht:"靈",zhs:"灵"},"炉":{jp:"炉",zht:"爐",zhs:"炉"},"点":{jp:"点",zht:"點",zhs:"点"},"錬":{jp:"錬",zht:"鍊",zhs:"炼"},"練":{jp:"練",zht:"練",zhs:"练"},"煙":{jp:"煙",zht:"煙",zhs:"烟"},"煩":{jp:"煩",zht:"煩",zhs:"烦"},"焼":{jp:"焼",zht:"燒",zhs:"烧"},"熱":{jp:"熱",zht:"熱",zhs:"热"},"焔":{jp:"焔",zht:"焰",zhs:"焰"},"鍛":{jp:"鍛",zht:"鍛",zhs:"锻"},"犠":{jp:"犠",zht:"犧",zhs:"牺"},"状":{jp:"状",zht:"狀",zhs:"状"},"猶":{jp:"猶",zht:"猶",zhs:"犹"},"独":{jp:"独",zht:"獨",zhs:"独"},"狭":{jp:"狭",zht:"狹",zhs:"狭"},"獄":{jp:"獄",zht:"獄",zhs:"狱"},"猟":{jp:"猟",zht:"獵",zhs:"猎"},"猫":{jp:"猫",zht:"貓",zhs:"猫"},"献":{jp:"献",zht:"獻",zhs:"献"},"獲":{jp:"獲",zht:"獲",zhs:"获"},"穫":{jp:"穫",zht:"穫",zhs:"获"},"環":{jp:"環",zht:"環",zhs:"环"},"現":{jp:"現",zht:"現",zhs:"现"},"璽":{jp:"璽",zht:"璽",zhs:"玺"},"甦":{jp:"甦",zht:"甦",zhs:"苏"},"電":{jp:"電",zht:"電",zhs:"电"},"療":{jp:"療",zht:"療",zhs:"疗"},"監":{jp:"監",zht:"監",zhs:"监"},"蓋":{jp:"蓋",zht:"蓋",zhs:"盖"},"盤":{jp:"盤",zht:"盤",zhs:"盘"},"視":{jp:"視",zht:"視",zhs:"视"},"着":{jp:"着",zht:"著",zhs:"著"},"矯":{jp:"矯",zht:"矯",zhs:"矫"},"鉱":{jp:"鉱",zht:"礦",zhs:"矿"},"砕":{jp:"砕",zht:"碎",zhs:"碎"},"礎":{jp:"礎",zht:"礎",zhs:"础"},"確":{jp:"確",zht:"確",zhs:"确"},"礼":{jp:"礼",zht:"禮",zhs:"礼"},"禍":{jp:"禍",zht:"禍",zhs:"祸"},"禅":{jp:"禅",zht:"禪",zhs:"禅"},"離":{jp:"離",zht:"離",zhs:"离"},"種":{jp:"種",zht:"種",zhs:"种"},"積":{jp:"積",zht:"積",zhs:"积"},"称":{jp:"称",zht:"稱",zhs:"称"},"稲":{jp:"稲",zht:"稻",zhs:"稻"},"穏":{jp:"穏",zht:"穩",zhs:"稳"},"穀":{jp:"穀",zht:"穀",zhs:"谷"},"穂":{jp:"穂",zht:"穗",zhs:"穗"},"窮":{jp:"窮",zht:"窮",zhs:"穷"},"窃":{jp:"窃",zht:"竊",zhs:"窃"},"窓":{jp:"窓",zht:"窗",zhs:"窗"},"竜":{jp:"竜",zht:"龍",zhs:"龙"},"競":{jp:"競",zht:"競",zhs:"竞"},"篤":{jp:"篤",zht:"篤",zhs:"笃"},"筆":{jp:"筆",zht:"筆",zhs:"笔"},"築":{jp:"築",zht:"築",zhs:"筑"},"簡":{jp:"簡",zht:"簡",zhs:"简"},"箇":{jp:"箇",zht:"個",zhs:"个"},"節":{jp:"節",zht:"節",zhs:"节"},"範":{jp:"範",zht:"範",zhs:"范"},"類":{jp:"類",zht:"類",zhs:"类"},"粋":{jp:"粋",zht:"粹",zhs:"粹"},"粛":{jp:"粛",zht:"肅",zhs:"肃"},"糧":{jp:"糧",zht:"糧",zhs:"粮"},"糾":{jp:"糾",zht:"糾",zhs:"纠"},"紀":{jp:"紀",zht:"紀",zhs:"纪"},"約":{jp:"約",zht:"約",zhs:"约"},"紅":{jp:"紅",zht:"紅",zhs:"红"},"紋":{jp:"紋",zht:"紋",zhs:"纹"},"納":{jp:"納",zht:"納",zhs:"纳"},"純":{jp:"純",zht:"純",zhs:"纯"},"紙":{jp:"紙",zht:"紙",zhs:"纸"},"級":{jp:"級",zht:"級",zhs:"级"},"紛":{jp:"紛",zht:"紛",zhs:"纷"},"紡":{jp:"紡",zht:"紡",zhs:"纺"},"緊":{jp:"緊",zht:"緊",zhs:"紧"},"細":{jp:"細",zht:"細",zhs:"细"},"紳":{jp:"紳",zht:"紳",zhs:"绅"},"紹":{jp:"紹",zht:"紹",zhs:"绍"},"紺":{jp:"紺",zht:"紺",zhs:"绀"},"終":{jp:"終",zht:"終",zhs:"终"},"組":{jp:"組",zht:"組",zhs:"组"},"経":{jp:"経",zht:"經",zhs:"经"},"結":{jp:"結",zht:"結",zhs:"结"},"絶":{jp:"絶",zht:"絶",zhs:"绝"},"絞":{jp:"絞",zht:"絞",zhs:"绞"},"絡":{jp:"絡",zht:"絡",zhs:"络"},"給":{jp:"給",zht:"給",zhs:"给"},"統":{jp:"統",zht:"統",zhs:"统"},"絵":{jp:"絵",zht:"繪",zhs:"绘"},"絹":{jp:"絹",zht:"絹",zhs:"绢"},"継":{jp:"継",zht:"繼",zhs:"继"},"続":{jp:"続",zht:"續",zhs:"续"},"緑":{jp:"緑",zht:"綠",zhs:"绿"},"線":{jp:"線",zht:"線",zhs:"线"},"維":{jp:"維",zht:"維",zhs:"维"},"綱":{jp:"綱",zht:"綱",zhs:"纲"},"綿":{jp:"綿",zht:"綿",zhs:"绵"},"緒":{jp:"緒",zht:"緒",zhs:"绪"},"締":{jp:"締",zht:"締",zhs:"缔"},"縁":{jp:"縁",zht:"緣",zhs:"缘"},"編":{jp:"編",zht:"編",zhs:"编"},"緩":{jp:"緩",zht:"緩",zhs:"缓"},"緯":{jp:"緯",zht:"緯",zhs:"纬"},"縄":{jp:"縄",zht:"繩",zhs:"绳"},"縛":{jp:"縛",zht:"縛",zhs:"缚"},"縦":{jp:"縦",zht:"縱",zhs:"纵"},"縫":{jp:"縫",zht:"縫",zhs:"缝"},"縮":{jp:"縮",zht:"縮",zhs:"缩"},"繊":{jp:"繊",zht:"纖",zhs:"纤"},"績":{jp:"績",zht:"績",zhs:"绩"},"織":{jp:"織",zht:"織",zhs:"织"},"繕":{jp:"繕",zht:"繕",zhs:"缮"},"繭":{jp:"繭",zht:"繭",zhs:"茧"},"繰":{jp:"繰",zht:"繰",zhs:"缲"},"缶":{jp:"缶",zht:"罐",zhs:"罐"},"鉢":{jp:"鉢",zht:"鉢",zhs:"钵"},"羅":{jp:"羅",zht:"羅",zhs:"罗"},"罸":{jp:"罸",zht:"罰",zhs:"罚"},"罷":{jp:"罷",zht:"罷",zhs:"罢"},"罵":{jp:"罵",zht:"罵",zhs:"骂"},"職":{jp:"職",zht:"職",zhs:"职"},"聞":{jp:"聞",zht:"聞",zhs:"闻"},"聡":{jp:"聡",zht:"聰",zhs:"聪"},"腸":{jp:"腸",zht:"腸",zhs:"肠"},"膚":{jp:"膚",zht:"膚",zhs:"肤"},"脹":{jp:"脹",zht:"脹",zhs:"胀"},"脅":{jp:"脅",zht:"脅",zhs:"胁"},"胆":{jp:"胆",zht:"膽",zhs:"胆"},"臓":{jp:"臓",zht:"臟",zhs:"脏"},"脳":{jp:"脳",zht:"腦",zhs:"脑"},"脚":{jp:"脚",zht:"腳",zhs:"脚"},"騰":{jp:"騰",zht:"騰",zhs:"腾"},"舗":{jp:"舗",zht:"舖",zhs:"铺"},"館":{jp:"館",zht:"館",zhs:"馆"},"艦":{jp:"艦",zht:"艦",zhs:"舰"},"芸":{jp:"芸",zht:"藝",zhs:"艺"},"茎":{jp:"茎",zht:"莖",zhs:"茎"},"薦":{jp:"薦",zht:"薦",zhs:"荐"},"荘":{jp:"荘",zht:"莊",zhs:"庄"},"薬":{jp:"薬",zht:"藥",zhs:"药"},"蛍":{jp:"蛍",zht:"螢",zhs:"萤"},"蒋":{jp:"蒋",zht:"蔣",zhs:"蒋"},"蔵":{jp:"蔵",zht:"藏",zhs:"藏"},"虜":{jp:"虜",zht:"虜",zhs:"虏"},"虚":{jp:"虚",zht:"虛",zhs:"虚"},"虫":{jp:"虫",zht:"蟲",zhs:"虫"},"蝕":{jp:"蝕",zht:"蝕",zhs:"蚀"},"蚕":{jp:"蚕",zht:"蠶",zhs:"蚕"},"蛮":{jp:"蛮",zht:"蠻",zhs:"蛮"},"補":{jp:"補",zht:"補",zhs:"补"},"襲":{jp:"襲",zht:"襲",zhs:"袭"},"装":{jp:"装",zht:"裝",zhs:"装"},"裏":{jp:"裏",zht:"裡",zhs:"里"},"覇":{jp:"覇",zht:"霸",zhs:"霸"},"見":{jp:"見",zht:"見",zhs:"见"},"観":{jp:"観",zht:"觀",zhs:"观"},"規":{jp:"規",zht:"規",zhs:"规"},"覚":{jp:"覚",zht:"覺",zhs:"觉"},"覧":{jp:"覧",zht:"覽",zhs:"览"},"触":{jp:"触",zht:"觸",zhs:"触"},"訂":{jp:"訂",zht:"訂",zhs:"订"},"計":{jp:"計",zht:"計",zhs:"计"},"討":{jp:"討",zht:"討",zhs:"讨"},"訓":{jp:"訓",zht:"訓",zhs:"训"},"記":{jp:"記",zht:"記",zhs:"记"},"訟":{jp:"訟",zht:"訟",zhs:"讼"},"訪":{jp:"訪",zht:"訪",zhs:"访"},"設":{jp:"設",zht:"設",zhs:"设"},"許":{jp:"許",zht:"許",zhs:"许"},"訳":{jp:"訳",zht:"譯",zhs:"译"},"訴":{jp:"訴",zht:"訴",zhs:"诉"},"診":{jp:"診",zht:"診",zhs:"诊"},"証":{jp:"証",zht:"證",zhs:"证"},"詐":{jp:"詐",zht:"詐",zhs:"诈"},"詔":{jp:"詔",zht:"詔",zhs:"诏"},"評":{jp:"評",zht:"評",zhs:"评"},"詛":{jp:"詛",zht:"詛",zhs:"诅"},"詞":{jp:"詞",zht:"詞",zhs:"词"},"試":{jp:"試",zht:"試",zhs:"试"},"詩":{jp:"詩",zht:"詩",zhs:"诗"},"詰":{jp:"詰",zht:"詰",zhs:"诘"},"該":{jp:"該",zht:"該",zhs:"该"},"詳":{jp:"詳",zht:"詳",zhs:"详"},"誉":{jp:"誉",zht:"譽",zhs:"誉"},"謄":{jp:"謄",zht:"謄",zhs:"誊"},"認":{jp:"認",zht:"認",zhs:"认"},"誕":{jp:"誕",zht:"誕",zhs:"诞"},"誘":{jp:"誘",zht:"誘",zhs:"诱"},"語":{jp:"語",zht:"語",zhs:"语"},"誠":{jp:"誠",zht:"誠",zhs:"诚"},"誤":{jp:"誤",zht:"誤",zhs:"误"},"説":{jp:"説",zht:"說",zhs:"说"},"読":{jp:"読",zht:"讀",zhs:"读"},"誰":{jp:"誰",zht:"誰",zhs:"谁"},"課":{jp:"課",zht:"課",zhs:"课"},"調":{jp:"調",zht:"調",zhs:"调"},"談":{jp:"談",zht:"談",zhs:"谈"},"請":{jp:"請",zht:"請",zhs:"请"},"論":{jp:"論",zht:"論",zhs:"论"},"諭":{jp:"諭",zht:"諭",zhs:"谕"},"諸":{jp:"諸",zht:"諸",zhs:"诸"},"諾":{jp:"諾",zht:"諾",zhs:"诺"},"謀":{jp:"謀",zht:"謀",zhs:"谋"},"謁":{jp:"謁",zht:"謁",zhs:"谒"},"謎":{jp:"謎",zht:"謎",zhs:"谜"},"謙":{jp:"謙",zht:"謙",zhs:"谦"},"講":{jp:"講",zht:"講",zhs:"讲"},"謝":{jp:"謝",zht:"謝",zhs:"谢"},"謡":{jp:"謡",zht:"謠",zhs:"谣"},"謹":{jp:"謹",zht:"謹",zhs:"谨"},"識":{jp:"識",zht:"識",zhs:"识"},"譜":{jp:"譜",zht:"譜",zhs:"谱"},"議":{jp:"議",zht:"議",zhs:"议"},"譲":{jp:"譲",zht:"讓",zhs:"让"},"貝":{jp:"貝",zht:"貝",zhs:"贝"},"貞":{jp:"貞",zht:"貞",zhs:"贞"},"負":{jp:"負",zht:"負",zhs:"负"},"財":{jp:"財",zht:"財",zhs:"财"},"貢":{jp:"貢",zht:"貢",zhs:"贡"},"貧":{jp:"貧",zht:"貧",zhs:"贫"},"貨":{jp:"貨",zht:"貨",zhs:"货"},"販":{jp:"販",zht:"販",zhs:"贩"},"貪":{jp:"貪",zht:"貪",zhs:"贪"},"責":{jp:"責",zht:"責",zhs:"责"},"貯":{jp:"貯",zht:"貯",zhs:"贮"},"貴":{jp:"貴",zht:"貴",zhs:"贵"},"貸":{jp:"貸",zht:"貸",zhs:"贷"},"費":{jp:"費",zht:"費",zhs:"费"},"貿":{jp:"貿",zht:"貿",zhs:"贸"},"賀":{jp:"賀",zht:"賀",zhs:"贺"},"賃":{jp:"賃",zht:"賃",zhs:"赁"},"賄":{jp:"賄",zht:"賄",zhs:"贿"},"資":{jp:"資",zht:"資",zhs:"资"},"賊":{jp:"賊",zht:"賊",zhs:"贼"},"賎":{jp:"賎",zht:"賤",zhs:"贱"},"賛":{jp:"賛",zht:"贊",zhs:"赞"},"賜":{jp:"賜",zht:"賜",zhs:"赐"},"賞":{jp:"賞",zht:"賞",zhs:"赏"},"賠":{jp:"賠",zht:"賠",zhs:"赔"},"賢":{jp:"賢",zht:"賢",zhs:"贤"},"賦":{jp:"賦",zht:"賦",zhs:"赋"},"質":{jp:"質",zht:"質",zhs:"质"},"頼":{jp:"頼",zht:"賴",zhs:"赖"},"贈":{jp:"贈",zht:"贈",zhs:"赠"},"贓":{jp:"贓",zht:"贓",zhs:"赃"},"躍":{jp:"躍",zht:"躍",zhs:"跃"},"践":{jp:"践",zht:"踐",zhs:"践"},"踪":{jp:"踪",zht:"蹤",zhs:"踪"},"車":{jp:"車",zht:"車",zhs:"车"},"軌":{jp:"軌",zht:"軌",zhs:"轨"},"軒":{jp:"軒",zht:"軒",zhs:"轩"},"軟":{jp:"軟",zht:"軟",zhs:"软"},"転":{jp:"転",zht:"轉",zhs:"转"},"軸":{jp:"軸",zht:"軸",zhs:"轴"},"軽":{jp:"軽",zht:"輕",zhs:"轻"},"較":{jp:"較",zht:"較",zhs:"较"},"載":{jp:"載",zht:"載",zhs:"载"},"輝":{jp:"輝",zht:"輝",zhs:"辉"},"輩":{jp:"輩",zht:"輩",zhs:"辈"},"輪":{jp:"輪",zht:"輪",zhs:"轮"},"輸":{jp:"輸",zht:"輸",zhs:"输"},"轄":{jp:"轄",zht:"轄",zhs:"辖"},"辞":{jp:"辞",zht:"辭",zhs:"辞"},"辺":{jp:"辺",zht:"邊",zhs:"边"},"達":{jp:"達",zht:"達",zhs:"达"},"遷":{jp:"遷",zht:"遷",zhs:"迁"},"過":{jp:"過",zht:"過",zhs:"过"},"運":{jp:"運",zht:"運",zhs:"运"},"還":{jp:"還",zht:"還",zhs:"还"},"進":{jp:"進",zht:"進",zhs:"进"},"遠":{jp:"遠",zht:"遠",zhs:"远"},"違":{jp:"違",zht:"違",zhs:"违"},"連":{jp:"連",zht:"連",zhs:"连"},"遅":{jp:"遅",zht:"遲",zhs:"迟"},"適":{jp:"適",zht:"適",zhs:"适"},"選":{jp:"選",zht:"選",zhs:"选"},"逓":{jp:"逓",zht:"遞",zhs:"递"},"遺":{jp:"遺",zht:"遺",zhs:"遗"},"遥":{jp:"遥",zht:"遙",zhs:"遥"},"郵":{jp:"郵",zht:"郵",zhs:"邮"},"隣":{jp:"隣",zht:"鄰",zhs:"邻"},"酔":{jp:"酔",zht:"醉",zhs:"醉"},"醸":{jp:"醸",zht:"釀",zhs:"酿"},"釈":{jp:"釈",zht:"釋",zhs:"释"},"針":{jp:"針",zht:"針",zhs:"针"},"釣":{jp:"釣",zht:"釣",zhs:"钓"},"鈍":{jp:"鈍",zht:"鈍",zhs:"钝"},"鈴":{jp:"鈴",zht:"鈴",zhs:"铃"},"鉄":{jp:"鉄",zht:"鐵",zhs:"铁"},"鉛":{jp:"鉛",zht:"鉛",zhs:"铅"},"鑑":{jp:"鑑",zht:"鑑",zhs:"鉴"},"銀":{jp:"銀",zht:"銀",zhs:"银"},"銃":{jp:"銃",zht:"銃",zhs:"铳"},"銅":{jp:"銅",zht:"銅",zhs:"铜"},"銑":{jp:"銑",zht:"銑",zhs:"铣"},"銘":{jp:"銘",zht:"銘",zhs:"铭"},"銭":{jp:"銭",zht:"錢",zhs:"钱"},"鋭":{jp:"鋭",zht:"鋭",zhs:"锐"},"鋳":{jp:"鋳",zht:"鑄",zhs:"铸"},"鋼":{jp:"鋼",zht:"鋼",zhs:"钢"},"錘":{jp:"錘",zht:"錘",zhs:"锤"},"錠":{jp:"錠",zht:"錠",zhs:"锭"},"錯":{jp:"錯",zht:"錯",zhs:"错"},"鍾":{jp:"鍾",zht:"鍾",zhs:"钟"},"鎖":{jp:"鎖",zht:"鎖",zhs:"锁"},"鎮":{jp:"鎮",zht:"鎮",zhs:"镇"},"鏡":{jp:"鏡",zht:"鏡",zhs:"镜"},"長":{jp:"長",zht:"長",zhs:"长"},"門":{jp:"門",zht:"門",zhs:"门"},"閉":{jp:"閉",zht:"閉",zhs:"闭"},"閑":{jp:"閑",zht:"閒",zhs:"闲"},"間":{jp:"間",zht:"間",zhs:"间"},"閣":{jp:"閣",zht:"閣",zhs:"阁"},"閥":{jp:"閥",zht:"閥",zhs:"阀"},"閲":{jp:"閲",zht:"閲",zhs:"阅"},"隊":{jp:"隊",zht:"隊",zhs:"队"},"陽":{jp:"陽",zht:"陽",zhs:"阳"},"陰":{jp:"陰",zht:"陰",zhs:"阴"},"陣":{jp:"陣",zht:"陣",zhs:"阵"},"階":{jp:"階",zht:"階",zhs:"阶"},"際":{jp:"際",zht:"際",zhs:"际"},"陸":{jp:"陸",zht:"陸",zhs:"陆"},"陳":{jp:"陳",zht:"陳",zhs:"陈"},"陥":{jp:"陥",zht:"陷",zhs:"陷"},"随":{jp:"随",zht:"隨",zhs:"随"},"隠":{jp:"隠",zht:"隱",zhs:"隐"},"隷":{jp:"隷",zht:"隷",zhs:"隶"},"難":{jp:"難",zht:"難",zhs:"难"},"鶏":{jp:"鶏",zht:"雞",zhs:"鸡"},"霧":{jp:"霧",zht:"霧",zhs:"雾"},"静":{jp:"静",zht:"靜",zhs:"静"},"頂":{jp:"頂",zht:"頂",zhs:"顶"},"項":{jp:"項",zht:"項",zhs:"项"},"順":{jp:"順",zht:"順",zhs:"顺"},"預":{jp:"預",zht:"預",zhs:"预"},"頑":{jp:"頑",zht:"頑",zhs:"顽"},"頒":{jp:"頒",zht:"頒",zhs:"颁"},"領":{jp:"領",zht:"領",zhs:"领"},"頻":{jp:"頻",zht:"頻",zhs:"频"},"題":{jp:"題",zht:"題",zhs:"题"},"額":{jp:"額",zht:"額",zhs:"额"},"顔":{jp:"顔",zht:"顏",zhs:"颜"},"風":{jp:"風",zht:"風",zhs:"风"},"飛":{jp:"飛",zht:"飛",zhs:"飞"},"飢":{jp:"飢",zht:"饑",zhs:"饥"},"飯":{jp:"飯",zht:"飯",zhs:"饭"},"飲":{jp:"飲",zht:"飲",zhs:"饮"},"飼":{jp:"飼",zht:"飼",zhs:"饲"},"飽":{jp:"飽",zht:"飽",zhs:"饱"},"飾":{jp:"飾",zht:"飾",zhs:"饰"},"餓":{jp:"餓",zht:"餓",zhs:"饿"},"馬":{jp:"馬",zht:"馬",zhs:"马"},"駅":{jp:"駅",zht:"驛",zhs:"驿"},"駆":{jp:"駆",zht:"驅",zhs:"驱"},"駐":{jp:"駐",zht:"駐",zhs:"驻"},"騎":{jp:"騎",zht:"騎",zhs:"骑"},"験":{jp:"験",zht:"驗",zhs:"验"},"騒":{jp:"騒",zht:"騷",zhs:"骚"},"騨":{jp:"騨",zht:"驔",zhs:"驔"},"髄":{jp:"髄",zht:"髓",zhs:"髓"},"髪":{jp:"髪",zht:"髮",zhs:null},"魚":{jp:"魚",zht:"魚",zhs:"鱼"},"魯":{jp:"魯",zht:"魯",zhs:"鲁"},"鮮":{jp:"鮮",zht:"鮮",zhs:"鲜"},"鯨":{jp:"鯨",zht:"鯨",zhs:"鲸"},"鳥":{jp:"鳥",zht:"鳥",zhs:"鸟"},"鳴":{jp:"鳴",zht:"鳴",zhs:"鸣"},"鶫":{jp:"鶫",zht:"鶇",zhs:"鸫"},"鶇":{jp:"鶇",zht:"鶇",zhs:"鸫"},"麦":{jp:"麦",zht:"麥",zhs:"麦"},"黄":{jp:"黄",zht:"黃",zhs:"黄"},"黒":{jp:"黒",zht:"黑",zhs:"黑"},"黙":{jp:"黙",zht:"默",zhs:"默"},"齢":{jp:"齢",zht:"齡",zhs:"龄"}},zht:{"會":{jp:"会",zht:"會",zhs:"会"},"箋":{jp:"箋",zht:"箋",zhs:"笺"},"網":{jp:"網",zht:"網",zhs:"网"},"處":{jp:"処",zht:"處",zhs:"处"},"話":{jp:"話",zht:"話",zhs:"话"},"馱":{jp:"駄",zht:"馱",zhs:"驮"},"萬":{jp:"万",zht:"萬",zhs:"万"},"與":{jp:"与",zht:"與",zhs:"与"},"醜":{jp:"醜",zht:"醜",zhs:"丑"},"專":{jp:"専",zht:"專",zhs:"专"},"業":{jp:"業",zht:"業",zhs:"业"},"東":{jp:"東",zht:"東",zhs:"东"},"絲":{jp:"絲",zht:"絲",zhs:"丝"},"兩":{jp:"両",zht:"兩",zhs:"两"},"嚴":{jp:"厳",zht:"嚴",zhs:"严"},"並":{jp:"並",zht:"並",zhs:"并"},"喪":{jp:"喪",zht:"喪",zhs:"丧"},"個":{jp:"個",zht:"個",zhs:"个"},"豐":{jp:"豊",zht:"豐",zhs:"丰"},"臨":{jp:"臨",zht:"臨",zhs:"临"},"為":{jp:"為",zht:"為",zhs:"为"},"麗":{jp:"麗",zht:"麗",zhs:"丽"},"舉":{jp:"挙",zht:"舉",zhs:"举"},"迺":{jp:"廼",zht:"迺",zhs:"迺"},"義":{jp:"義",zht:"義",zhs:"义"},"樂":{jp:"楽",zht:"樂",zhs:"乐"},"乘":{jp:"乗",zht:"乘",zhs:"乘"},"習":{jp:"習",zht:"習",zhs:"习"},"鄉":{jp:"郷",zht:"鄉",zhs:"乡"},"書":{jp:"書",zht:"書",zhs:"书"},"買":{jp:"買",zht:"買",zhs:"买"},"亂":{jp:"乱",zht:"亂",zhs:"乱"},"乾":{jp:"乾",zht:"乾",zhs:"干"},"龜":{jp:"亀",zht:"龜",zhs:"龟"},"預":{jp:"予",zht:"預",zhs:"预"},"貳":{jp:"弐",zht:"貳",zhs:"贰"},"雲":{jp:"雲",zht:"雲",zhs:"云"},"亞":{jp:"亜",zht:"亞",zhs:"亚"},"產":{jp:"産",zht:"產",zhs:"产"},"畝":{jp:"畝",zht:"畝",zhs:"亩"},"親":{jp:"親",zht:"親",zhs:"亲"},"億":{jp:"億",zht:"億",zhs:"亿"},"僕":{jp:"僕",zht:"僕",zhs:"仆"},"從":{jp:"従",zht:"從",zhs:"从"},"佛":{jp:"仏",zht:"佛",zhs:"佛"},"倉":{jp:"倉",zht:"倉",zhs:"仓"},"儀":{jp:"儀",zht:"儀",zhs:"仪"},"假":{jp:"仮",zht:"假",zhs:"假"},"價":{jp:"価",zht:"價",zhs:"价"},"眾":{jp:"衆",zht:"眾",zhs:"众"},"優":{jp:"優",zht:"優",zhs:"优"},"傳":{jp:"伝",zht:"傳",zhs:"传"},"傘":{jp:"傘",zht:"傘",zhs:"伞"},"偉":{jp:"偉",zht:"偉",zhs:"伟"},"傷":{jp:"傷",zht:"傷",zhs:"伤"},"倫":{jp:"倫",zht:"倫",zhs:"伦"},"偽":{jp:"偽",zht:"偽",zhs:"伪"},"體":{jp:"体",zht:"體",zhs:"体"},"餘":{jp:"余",zht:"餘",zhs:"余"},"來":{jp:"来",zht:"來",zhs:"来"},"偵":{jp:"偵",zht:"偵",zhs:"侦"},"側":{jp:"側",zht:"側",zhs:"侧"},"儉":{jp:"倹",zht:"儉",zhs:"俭"},"俱":{jp:"倶",zht:"俱",zhs:"俱"},"債":{jp:"債",zht:"債",zhs:"债"},"傾":{jp:"傾",zht:"傾",zhs:"倾"},"償":{jp:"償",zht:"償",zhs:"偿"},"傑":{jp:"傑",zht:"傑",zhs:"杰"},"備":{jp:"備",zht:"備",zhs:"备"},"當":{jp:"当",zht:"當",zhs:"当"},"盡":{jp:"尽",zht:"盡",zhs:"尽"},"兒":{jp:"児",zht:"兒",zhs:"儿"},"黨":{jp:"党",zht:"黨",zhs:"党"},"內":{jp:"内",zht:"內",zhs:"内"},"關":{jp:"関",zht:"關",zhs:"关"},"興":{jp:"興",zht:"興",zhs:"兴"},"養":{jp:"養",zht:"養",zhs:"养"},"獸":{jp:"獣",zht:"獸",zhs:"兽"},"圓":{jp:"円",zht:"圓",zhs:"圆"},"寫":{jp:"写",zht:"寫",zhs:"写"},"軍":{jp:"軍",zht:"軍",zhs:"军"},"農":{jp:"農",zht:"農",zhs:"农"},"富":{jp:"冨",zht:"富",zhs:"富"},"冰":{jp:"氷",zht:"冰",zhs:"冰"},"衝":{jp:"衝",zht:"衝",zhs:"冲"},"決":{jp:"決",zht:"決",zhs:"决"},"凍":{jp:"凍",zht:"凍",zhs:"冻"},"塗":{jp:"塗",zht:"塗",zhs:"涂"},"淒":{jp:"凄",zht:"淒",zhs:"凄"},"悽":{jp:"凄",zht:"悽",zhs:"凄"},"準":{jp:"准",zht:"準",zhs:"准"},"幾":{jp:"幾",zht:"幾",zhs:"几"},"擊":{jp:"撃",zht:"擊",zhs:"击"},"劃":{jp:"画",zht:"劃",zhs:"划"},"畫":{jp:"画",zht:"畫",zhs:"画"},"則":{jp:"則",zht:"則",zhs:"则"},"剛":{jp:"剛",zht:"剛",zhs:"刚"},"創":{jp:"創",zht:"創",zhs:"创"},"別":{jp:"別",zht:"別",zhs:"别"},"製":{jp:"製",zht:"製",zhs:"制"},"卷":{jp:"券",zht:"卷",zhs:"卷"},"剎":{jp:"刹",zht:"剎",zhs:"刹"},"劑":{jp:"剤",zht:"劑",zhs:"剂"},"劍":{jp:"剣",zht:"劍",zhs:"剑"},"劇":{jp:"劇",zht:"劇",zhs:"剧"},"剩":{jp:"剰",zht:"剩",zhs:"剩"},"勸":{jp:"勧",zht:"勸",zhs:"劝"},"務":{jp:"務",zht:"務",zhs:"务"},"動":{jp:"動",zht:"動",zhs:"动"},"勵":{jp:"励",zht:"勵",zhs:"励"},"勞":{jp:"労",zht:"勞",zhs:"劳"},"效":{jp:"効",zht:"效",zhs:null},"勢":{jp:"勢",zht:"勢",zhs:"势"},"勳":{jp:"勲",zht:"勳",zhs:"勋"},"勝":{jp:"勝",zht:"勝",zhs:"胜"},"區":{jp:"区",zht:"區",zhs:"区"},"醫":{jp:"医",zht:"醫",zhs:"医"},"華":{jp:"華",zht:"華",zhs:"华"},"協":{jp:"協",zht:"協",zhs:"协"},"單":{jp:"単",zht:"單",zhs:"单"},"賣":{jp:"売",zht:"賣",zhs:"卖"},"衛":{jp:"衛",zht:"衛",zhs:"卫"},"廳":{jp:"庁",zht:"廳",zhs:"厅"},"歷":{jp:"歴",zht:"歷",zhs:"历"},"曆":{jp:"暦",zht:"曆",zhs:"历"},"壓":{jp:"圧",zht:"壓",zhs:"压"},"縣":{jp:"県",zht:"縣",zhs:"县"},"參":{jp:"参",zht:"參",zhs:"参"},"雙":{jp:"双",zht:"雙",zhs:"双"},"收":{jp:"収",zht:"收",zhs:"收"},"發":{jp:"発",zht:"發",zhs:"发"},"變":{jp:"変",zht:"變",zhs:"变"},"疊":{jp:"畳",zht:"疊",zhs:"叠"},"號":{jp:"号",zht:"號",zhs:"号"},"嘆":{jp:"嘆",zht:"嘆",zhs:"叹"},"嚇":{jp:"嚇",zht:"嚇",zhs:"吓"},"聽":{jp:"聴",zht:"聽",zhs:"听"},"啟":{jp:"啓",zht:"啟",zhs:"启"},"員":{jp:"員",zht:"員",zhs:"员"},"諮":{jp:"諮",zht:"諮",zhs:"谘"},"鹹":{jp:"鹹",zht:"鹹",zhs:"咸"},"響":{jp:"響",zht:"響",zhs:"响"},"問":{jp:"問",zht:"問",zhs:"问"},"營":{jp:"営",zht:"營",zhs:"营"},"噴":{jp:"噴",zht:"噴",zhs:"喷"},"囑":{jp:"嘱",zht:"囑",zhs:"嘱"},"蘇":{jp:"蘇",zht:"蘇",zhs:"苏"},"團":{jp:"団",zht:"團",zhs:"团"},"園":{jp:"園",zht:"園",zhs:"园"},"國":{jp:"国",zht:"國",zhs:"国"},"圍":{jp:"囲",zht:"圍",zhs:"围"},"圖":{jp:"図",zht:"圖",zhs:"图"},"圈":{jp:"圏",zht:"圈",zhs:"圈"},"聖":{jp:"聖",zht:"聖",zhs:"圣"},"場":{jp:"場",zht:"場",zhs:"场"},"壞":{jp:"壊",zht:"壞",zhs:"坏"},"塊":{jp:"塊",zht:"塊",zhs:"块"},"堅":{jp:"堅",zht:"堅",zhs:"坚"},"壇":{jp:"壇",zht:"壇",zhs:"坛"},"墳":{jp:"墳",zht:"墳",zhs:"坟"},"墜":{jp:"墜",zht:"墜",zhs:"坠"},"壘":{jp:"塁",zht:"壘",zhs:"垒"},"墾":{jp:"墾",zht:"墾",zhs:"垦"},"執":{jp:"執",zht:"執",zhs:"执"},"墮":{jp:"堕",zht:"墮",zhs:"堕"},"報":{jp:"報",zht:"報",zhs:"报"},"鹽":{jp:"塩",zht:"鹽",zhs:"盐"},"增":{jp:"増",zht:"增",zhs:"增"},"壤":{jp:"壌",zht:"壤",zhs:"壤"},"壯":{jp:"壮",zht:"壯",zhs:"壮"},"聲":{jp:"声",zht:"聲",zhs:"声"},"壹":{jp:"壱",zht:"壹",zhs:"壹"},"殻":{jp:"殻",zht:"殻",zhs:"壳"},"殼":{jp:"殼",zht:"殼",zhs:"壳"},"壽":{jp:"寿",zht:"壽",zhs:"寿"},"復":{jp:"復",zht:"復",zhs:"复"},"複":{jp:"複",zht:"複",zhs:"复"},"夢":{jp:"夢",zht:"夢",zhs:"梦"},"頭":{jp:"頭",zht:"頭",zhs:"头"},"誇":{jp:"誇",zht:"誇",zhs:"夸"},"奪":{jp:"奪",zht:"奪",zhs:"夺"},"奮":{jp:"奮",zht:"奮",zhs:"奋"},"獎":{jp:"奨",zht:"獎",zhs:"奖"},"妝":{jp:"粧",zht:"妝",zhs:"妆"},"婦":{jp:"婦",zht:"婦",zhs:"妇"},"姐":{jp:"姉",zht:"姐",zhs:"姐"},"姬":{jp:"姫",zht:"姬",zhs:"姬"},"孃":{jp:"嬢",zht:"孃",zhs:"娘"},"娛":{jp:"娯",zht:"娛",zhs:"娱"},"孫":{jp:"孫",zht:"孫",zhs:"孙"},"學":{jp:"学",zht:"學",zhs:"学"},"寧":{jp:"寧",zht:"寧",zhs:"宁"},"寶":{jp:"宝",zht:"寶",zhs:"宝"},"實":{jp:"実",zht:"實",zhs:"实"},"審":{jp:"審",zht:"審",zhs:"审"},"憲":{jp:"憲",zht:"憲",zhs:"宪"},"宮":{jp:"宮",zht:"宮",zhs:"宫"},"寬":{jp:"寬",zht:"寬",zhs:"宽"},"賓":{jp:"賓",zht:"賓",zhs:"宾"},"祕":{jp:"秘",zht:"祕",zhs:"秘"},"寢":{jp:"寝",zht:"寢",zhs:"寝"},"對":{jp:"対",zht:"對",zhs:"对"},"尋":{jp:"尋",zht:"尋",zhs:"寻"},"導":{jp:"導",zht:"導",zhs:"导"},"將":{jp:"将",zht:"將",zhs:"将"},"層":{jp:"層",zht:"層",zhs:"层"},"屬":{jp:"属",zht:"屬",zhs:"属"},"歲":{jp:"歳",zht:"歲",zhs:"岁"},"島":{jp:"島",zht:"島",zhs:"岛"},"巖":{jp:"巌",zht:"巖",zhs:"巖"},"峽":{jp:"峡",zht:"峽",zhs:"峡"},"險":{jp:"険",zht:"險",zhs:"险"},"幣":{jp:"幣",zht:"幣",zhs:"币"},"帥":{jp:"帥",zht:"帥",zhs:"帅"},"師":{jp:"師",zht:"師",zhs:"师"},"帳":{jp:"帳",zht:"帳",zhs:"帐"},"帶":{jp:"帶",zht:"帶",zhs:"带"},"歸":{jp:"帰",zht:"歸",zhs:"归"},"幹":{jp:"幹",zht:"幹",zhs:"干"},"廣":{jp:"広",zht:"廣",zhs:"广"},"莊":{jp:"庄",zht:"莊",zhs:"庄"},"慶":{jp:"慶",zht:"慶",zhs:"庆"},"庫":{jp:"庫",zht:"庫",zhs:"库"},"應":{jp:"応",zht:"應",zhs:"应"},"廢":{jp:"廃",zht:"廢",zhs:"废"},"開":{jp:"開",zht:"開",zhs:"开"},"辨":{jp:"弁",zht:"辨",zhs:"辨"},"瓣":{jp:"弁",zht:"瓣",zhs:"辨"},"辯":{jp:"弁",zht:"辯",zhs:"辨"},"異":{jp:"異",zht:"異",zhs:"异"},"棄":{jp:"棄",zht:"棄",zhs:"弃"},"張":{jp:"張",zht:"張",zhs:"张"},"彌":{jp:"弥",zht:"彌",zhs:"弥"},"強":{jp:"強",zht:"強",zhs:"强"},"彈":{jp:"弾",zht:"彈",zhs:"弹"},"錄":{jp:"録",zht:"錄",zhs:"录"},"彥":{jp:"彦",zht:"彥",zhs:"彥"},"徹":{jp:"徹",zht:"徹",zhs:"彻"},"徵":{jp:"徴",zht:"徵",zhs:"征"},"徑":{jp:"径",zht:"徑",zhs:"径"},"德":{jp:"徳",zht:"德",zhs:"德"},"憶":{jp:"憶",zht:"憶",zhs:"忆"},"誌":{jp:"誌",zht:"誌",zhs:"志"},"憂":{jp:"憂",zht:"憂",zhs:"忧"},"懷":{jp:"懐",zht:"懷",zhs:"怀"},"態":{jp:"態",zht:"態",zhs:"态"},"總":{jp:"総",zht:"總",zhs:"总"},"恆":{jp:"恒",zht:"恆",zhs:"恒"},"戀":{jp:"恋",zht:"戀",zhs:"恋"},"懇":{jp:"懇",zht:"懇",zhs:"恳"},"惠":{jp:"恵",zht:"惠",zhs:"惠"},"惡":{jp:"悪",zht:"惡",zhs:"恶"},"惱":{jp:"悩",zht:"惱",zhs:"恼"},"悅":{jp:"悦",zht:"悅",zhs:"悅"},"懸":{jp:"懸",zht:"懸",zhs:"悬"},"驚":{jp:"驚",zht:"驚",zhs:"惊"},"慘":{jp:"惨",zht:"慘",zhs:"惨"},"懲":{jp:"懲",zht:"懲",zhs:"惩"},"愛":{jp:"愛",zht:"愛",zhs:"爱"},"憤":{jp:"憤",zht:"憤",zhs:"愤"},"願":{jp:"願",zht:"願",zhs:"愿"},"慮":{jp:"慮",zht:"慮",zhs:"虑"},"戲":{jp:"戯",zht:"戲",zhs:"戏"},"戰":{jp:"戦",zht:"戰",zhs:"战"},"戶":{jp:"戸",zht:"戶",zhs:"户"},"拂":{jp:"払",zht:"拂",zhs:"拂"},"擴":{jp:"拡",zht:"擴",zhs:"扩"},"掃":{jp:"掃",zht:"掃",zhs:"扫"},"揚":{jp:"揚",zht:"揚",zhs:"扬"},"拔":{jp:"抜",zht:"拔",zhs:null},"擇":{jp:"択",zht:"擇",zhs:"择"},"護":{jp:"護",zht:"護",zhs:"护"},"擔":{jp:"担",zht:"擔",zhs:"担"},"拜":{jp:"拝",zht:"拜",zhs:"拜"},"擬":{jp:"擬",zht:"擬",zhs:"拟"},"據":{jp:"拠",zht:"據",zhs:"据"},"擁":{jp:"擁",zht:"擁",zhs:"拥"},"挾":{jp:"挟",zht:"挾",zhs:"挟"},"揮":{jp:"揮",zht:"揮",zhs:"挥"},"插":{jp:"揷",zht:"插",zhs:"插"},"損":{jp:"損",zht:"損",zhs:"损"},"捨":{jp:"捨",zht:"捨",zhs:"舍"},"揭":{jp:"掲",zht:"揭",zhs:"揭"},"摑":{jp:"掴",zht:"摑",zhs:"掴"},"搖":{jp:"揺",zht:"搖",zhs:"摇"},"攝":{jp:"摂",zht:"攝",zhs:"摄"},"敵":{jp:"敵",zht:"敵",zhs:"敌"},"敗":{jp:"敗",zht:"敗",zhs:"败"},"數":{jp:"数",zht:"數",zhs:"数"},"齊":{jp:"斉",zht:"齊",zhs:"齐"},"齋":{jp:"斎",zht:"齋",zhs:"斋"},"鬥":{jp:"闘",zht:"鬥",zhs:"斗"},"斷":{jp:"断",zht:"斷",zhs:"断"},"舊":{jp:"旧",zht:"舊",zhs:"旧"},"時":{jp:"時",zht:"時",zhs:"时"},"曇":{jp:"曇",zht:"曇",zhs:"昙"},"晝":{jp:"昼",zht:"晝",zhs:"昼"},"顯":{jp:"顕",zht:"顯",zhs:"显"},"曉":{jp:"暁",zht:"曉",zhs:"晓"},"晚":{jp:"晩",zht:"晚",zhs:"晚"},"暫":{jp:"暫",zht:"暫",zhs:"暂"},"曾":{jp:"曽",zht:"曾",zhs:"曾"},"術":{jp:"術",zht:"術",zhs:"术"},"樸":{jp:"樸",zht:"樸",zhs:"朴"},"機":{jp:"機",zht:"機",zhs:"机"},"殺":{jp:"殺",zht:"殺",zhs:"杀"},"雜":{jp:"雑",zht:"雜",zhs:"杂"},"權":{jp:"権",zht:"權",zhs:"权"},"條":{jp:"条",zht:"條",zhs:"条"},"極":{jp:"極",zht:"極",zhs:"极"},"樞":{jp:"枢",zht:"樞",zhs:"枢"},"槍":{jp:"槍",zht:"槍",zhs:"枪"},"查":{jp:"査",zht:"查",zhs:"查"},"榮":{jp:"栄",zht:"榮",zhs:"荣"},"標":{jp:"標",zht:"標",zhs:"标"},"棧":{jp:"桟",zht:"棧",zhs:"栈"},"棟":{jp:"棟",zht:"棟",zhs:"栋"},"欄":{jp:"欄",zht:"欄",zhs:"栏"},"樹":{jp:"樹",zht:"樹",zhs:"树"},"樣":{jp:"様",zht:"樣",zhs:"样"},"櫻":{jp:"桜",zht:"櫻",zhs:"樱"},"橋":{jp:"橋",zht:"橋",zhs:"桥"},"檢":{jp:"検",zht:"檢",zhs:"检"},"樓":{jp:"楼",zht:"樓",zhs:"楼"},"歡":{jp:"歓",zht:"歡",zhs:"欢"},"歐":{jp:"欧",zht:"歐",zhs:"欧"},"步":{jp:"歩",zht:"步",zhs:"步"},"齒":{jp:"歯",zht:"齒",zhs:"齿"},"殘":{jp:"残",zht:"殘",zhs:"残"},"毆":{jp:"殴",zht:"毆",zhs:"殴"},"氣":{jp:"気",zht:"氣",zhs:"气"},"漢":{jp:"漢",zht:"漢",zhs:"汉"},"湯":{jp:"湯",zht:"湯",zhs:"汤"},"溝":{jp:"溝",zht:"溝",zhs:"沟"},"澤":{jp:"沢",zht:"澤",zhs:"泽"},"淚":{jp:"涙",zht:"淚",zhs:"泪"},"瀧":{jp:"滝",zht:"瀧",zhs:"泷"},"潔":{jp:"潔",zht:"潔",zhs:"洁"},"淺":{jp:"浅",zht:"淺",zhs:"浅"},"濁":{jp:"濁",zht:"濁",zhs:"浊"},"測":{jp:"測",zht:"測",zhs:"测"},"濟":{jp:"済",zht:"濟",zhs:"济"},"濃":{jp:"濃",zht:"濃",zhs:"浓"},"濱":{jp:"浜",zht:"濱",zhs:"滨"},"涉":{jp:"渋",zht:"涉",zhs:"涉"},"澀":{jp:"渋",zht:"澀",zhs:"涉"},"渦":{jp:"渦",zht:"渦",zhs:"涡"},"潤":{jp:"潤",zht:"潤",zhs:"润"},"漬":{jp:"漬",zht:"漬",zhs:"渍"},"漸":{jp:"漸",zht:"漸",zhs:"渐"},"溪":{jp:"渓",zht:"溪",zhs:"溪"},"漁":{jp:"漁",zht:"漁",zhs:"渔"},"灣":{jp:"湾",zht:"灣",zhs:"湾"},"濕":{jp:"湿",zht:"濕",zhs:"湿"},"滿":{jp:"満",zht:"滿",zhs:"满"},"滅":{jp:"滅",zht:"滅",zhs:"灭"},"滯":{jp:"滞",zht:"滯",zhs:"滞"},"濫":{jp:"濫",zht:"濫",zhs:"滥"},"瀨":{jp:"瀬",zht:"瀨",zhs:"濑"},"燈":{jp:"灯",zht:"燈",zhs:"灯"},"靈":{jp:"霊",zht:"靈",zhs:"灵"},"爐":{jp:"炉",zht:"爐",zhs:"炉"},"點":{jp:"点",zht:"點",zhs:"点"},"鍊":{jp:"錬",zht:"鍊",zhs:"炼"},"練":{jp:"練",zht:"練",zhs:"练"},"煙":{jp:"煙",zht:"煙",zhs:"烟"},"煩":{jp:"煩",zht:"煩",zhs:"烦"},"燒":{jp:"焼",zht:"燒",zhs:"烧"},"熱":{jp:"熱",zht:"熱",zhs:"热"},"焰":{jp:"焔",zht:"焰",zhs:"焰"},"鍛":{jp:"鍛",zht:"鍛",zhs:"锻"},"犧":{jp:"犠",zht:"犧",zhs:"牺"},"狀":{jp:"状",zht:"狀",zhs:"状"},"猶":{jp:"猶",zht:"猶",zhs:"犹"},"獨":{jp:"独",zht:"獨",zhs:"独"},"狹":{jp:"狭",zht:"狹",zhs:"狭"},"獄":{jp:"獄",zht:"獄",zhs:"狱"},"獵":{jp:"猟",zht:"獵",zhs:"猎"},"貓":{jp:"猫",zht:"貓",zhs:"猫"},"獻":{jp:"献",zht:"獻",zhs:"献"},"獲":{jp:"獲",zht:"獲",zhs:"获"},"穫":{jp:"穫",zht:"穫",zhs:"获"},"環":{jp:"環",zht:"環",zhs:"环"},"現":{jp:"現",zht:"現",zhs:"现"},"璽":{jp:"璽",zht:"璽",zhs:"玺"},"甦":{jp:"甦",zht:"甦",zhs:"苏"},"電":{jp:"電",zht:"電",zhs:"电"},"療":{jp:"療",zht:"療",zhs:"疗"},"監":{jp:"監",zht:"監",zhs:"监"},"蓋":{jp:"蓋",zht:"蓋",zhs:"盖"},"盤":{jp:"盤",zht:"盤",zhs:"盘"},"視":{jp:"視",zht:"視",zhs:"视"},"著":{jp:"着",zht:"著",zhs:"著"},"矯":{jp:"矯",zht:"矯",zhs:"矫"},"礦":{jp:"鉱",zht:"礦",zhs:"矿"},"碎":{jp:"砕",zht:"碎",zhs:"碎"},"礎":{jp:"礎",zht:"礎",zhs:"础"},"確":{jp:"確",zht:"確",zhs:"确"},"禮":{jp:"礼",zht:"禮",zhs:"礼"},"禍":{jp:"禍",zht:"禍",zhs:"祸"},"禪":{jp:"禅",zht:"禪",zhs:"禅"},"離":{jp:"離",zht:"離",zhs:"离"},"種":{jp:"種",zht:"種",zhs:"种"},"積":{jp:"積",zht:"積",zhs:"积"},"稱":{jp:"称",zht:"稱",zhs:"称"},"稻":{jp:"稲",zht:"稻",zhs:"稻"},"穩":{jp:"穏",zht:"穩",zhs:"稳"},"穀":{jp:"穀",zht:"穀",zhs:"谷"},"穗":{jp:"穂",zht:"穗",zhs:"穗"},"窮":{jp:"窮",zht:"窮",zhs:"穷"},"竊":{jp:"窃",zht:"竊",zhs:"窃"},"窗":{jp:"窓",zht:"窗",zhs:"窗"},"龍":{jp:"竜",zht:"龍",zhs:"龙"},"競":{jp:"競",zht:"競",zhs:"竞"},"篤":{jp:"篤",zht:"篤",zhs:"笃"},"筆":{jp:"筆",zht:"筆",zhs:"笔"},"築":{jp:"築",zht:"築",zhs:"筑"},"簡":{jp:"簡",zht:"簡",zhs:"简"},"節":{jp:"節",zht:"節",zhs:"节"},"範":{jp:"範",zht:"範",zhs:"范"},"類":{jp:"類",zht:"類",zhs:"类"},"粹":{jp:"粋",zht:"粹",zhs:"粹"},"肅":{jp:"粛",zht:"肅",zhs:"肃"},"糧":{jp:"糧",zht:"糧",zhs:"粮"},"糾":{jp:"糾",zht:"糾",zhs:"纠"},"紀":{jp:"紀",zht:"紀",zhs:"纪"},"約":{jp:"約",zht:"約",zhs:"约"},"紅":{jp:"紅",zht:"紅",zhs:"红"},"紋":{jp:"紋",zht:"紋",zhs:"纹"},"納":{jp:"納",zht:"納",zhs:"纳"},"純":{jp:"純",zht:"純",zhs:"纯"},"紙":{jp:"紙",zht:"紙",zhs:"纸"},"級":{jp:"級",zht:"級",zhs:"级"},"紛":{jp:"紛",zht:"紛",zhs:"纷"},"紡":{jp:"紡",zht:"紡",zhs:"纺"},"緊":{jp:"緊",zht:"緊",zhs:"紧"},"細":{jp:"細",zht:"細",zhs:"细"},"紳":{jp:"紳",zht:"紳",zhs:"绅"},"紹":{jp:"紹",zht:"紹",zhs:"绍"},"紺":{jp:"紺",zht:"紺",zhs:"绀"},"終":{jp:"終",zht:"終",zhs:"终"},"組":{jp:"組",zht:"組",zhs:"组"},"經":{jp:"経",zht:"經",zhs:"经"},"結":{jp:"結",zht:"結",zhs:"结"},"絶":{jp:"絶",zht:"絶",zhs:"绝"},"絕":{jp:"絶",zht:"絕",zhs:"绝"},"絞":{jp:"絞",zht:"絞",zhs:"绞"},"絡":{jp:"絡",zht:"絡",zhs:"络"},"給":{jp:"給",zht:"給",zhs:"给"},"統":{jp:"統",zht:"統",zhs:"统"},"繪":{jp:"絵",zht:"繪",zhs:"绘"},"絹":{jp:"絹",zht:"絹",zhs:"绢"},"繼":{jp:"継",zht:"繼",zhs:"继"},"續":{jp:"続",zht:"續",zhs:"续"},"綠":{jp:"緑",zht:"綠",zhs:"绿"},"線":{jp:"線",zht:"線",zhs:"线"},"維":{jp:"維",zht:"維",zhs:"维"},"綱":{jp:"綱",zht:"綱",zhs:"纲"},"綿":{jp:"綿",zht:"綿",zhs:"绵"},"緒":{jp:"緒",zht:"緒",zhs:"绪"},"締":{jp:"締",zht:"締",zhs:"缔"},"緣":{jp:"縁",zht:"緣",zhs:"缘"},"編":{jp:"編",zht:"編",zhs:"编"},"緩":{jp:"緩",zht:"緩",zhs:"缓"},"緯":{jp:"緯",zht:"緯",zhs:"纬"},"繩":{jp:"縄",zht:"繩",zhs:"绳"},"縛":{jp:"縛",zht:"縛",zhs:"缚"},"縱":{jp:"縦",zht:"縱",zhs:"纵"},"縫":{jp:"縫",zht:"縫",zhs:"缝"},"縮":{jp:"縮",zht:"縮",zhs:"缩"},"纖":{jp:"繊",zht:"纖",zhs:"纤"},"績":{jp:"績",zht:"績",zhs:"绩"},"織":{jp:"織",zht:"織",zhs:"织"},"繕":{jp:"繕",zht:"繕",zhs:"缮"},"繭":{jp:"繭",zht:"繭",zhs:"茧"},"繰":{jp:"繰",zht:"繰",zhs:"缲"},"罐":{jp:"缶",zht:"罐",zhs:"罐"},"鉢":{jp:"鉢",zht:"鉢",zhs:"钵"},"羅":{jp:"羅",zht:"羅",zhs:"罗"},"罰":{jp:"罸",zht:"罰",zhs:"罚"},"罷":{jp:"罷",zht:"罷",zhs:"罢"},"罵":{jp:"罵",zht:"罵",zhs:"骂"},"職":{jp:"職",zht:"職",zhs:"职"},"聞":{jp:"聞",zht:"聞",zhs:"闻"},"聰":{jp:"聡",zht:"聰",zhs:"聪"},"腸":{jp:"腸",zht:"腸",zhs:"肠"},"膚":{jp:"膚",zht:"膚",zhs:"肤"},"脹":{jp:"脹",zht:"脹",zhs:"胀"},"脅":{jp:"脅",zht:"脅",zhs:"胁"},"膽":{jp:"胆",zht:"膽",zhs:"胆"},"臟":{jp:"臓",zht:"臟",zhs:"脏"},"腦":{jp:"脳",zht:"腦",zhs:"脑"},"腳":{jp:"脚",zht:"腳",zhs:"脚"},"騰":{jp:"騰",zht:"騰",zhs:"腾"},"舖":{jp:"舗",zht:"舖",zhs:"铺"},"館":{jp:"館",zht:"館",zhs:"馆"},"艦":{jp:"艦",zht:"艦",zhs:"舰"},"藝":{jp:"芸",zht:"藝",zhs:"艺"},"莖":{jp:"茎",zht:"莖",zhs:"茎"},"薦":{jp:"薦",zht:"薦",zhs:"荐"},"藥":{jp:"薬",zht:"藥",zhs:"药"},"螢":{jp:"蛍",zht:"螢",zhs:"萤"},"蔣":{jp:"蒋",zht:"蔣",zhs:"蒋"},"藏":{jp:"蔵",zht:"藏",zhs:"藏"},"虜":{jp:"虜",zht:"虜",zhs:"虏"},"虛":{jp:"虚",zht:"虛",zhs:"虚"},"蟲":{jp:"虫",zht:"蟲",zhs:"虫"},"蝕":{jp:"蝕",zht:"蝕",zhs:"蚀"},"蠶":{jp:"蚕",zht:"蠶",zhs:"蚕"},"蠻":{jp:"蛮",zht:"蠻",zhs:"蛮"},"補":{jp:"補",zht:"補",zhs:"补"},"襲":{jp:"襲",zht:"襲",zhs:"袭"},"裝":{jp:"装",zht:"裝",zhs:"装"},"裡":{jp:"裏",zht:"裡",zhs:"里"},"霸":{jp:"覇",zht:"霸",zhs:"霸"},"見":{jp:"見",zht:"見",zhs:"见"},"觀":{jp:"観",zht:"觀",zhs:"观"},"規":{jp:"規",zht:"規",zhs:"规"},"覺":{jp:"覚",zht:"覺",zhs:"觉"},"覽":{jp:"覧",zht:"覽",zhs:"览"},"觸":{jp:"触",zht:"觸",zhs:"触"},"訂":{jp:"訂",zht:"訂",zhs:"订"},"計":{jp:"計",zht:"計",zhs:"计"},"討":{jp:"討",zht:"討",zhs:"讨"},"訓":{jp:"訓",zht:"訓",zhs:"训"},"記":{jp:"記",zht:"記",zhs:"记"},"訟":{jp:"訟",zht:"訟",zhs:"讼"},"訪":{jp:"訪",zht:"訪",zhs:"访"},"設":{jp:"設",zht:"設",zhs:"设"},"許":{jp:"許",zht:"許",zhs:"许"},"譯":{jp:"訳",zht:"譯",zhs:"译"},"訴":{jp:"訴",zht:"訴",zhs:"诉"},"診":{jp:"診",zht:"診",zhs:"诊"},"證":{jp:"証",zht:"證",zhs:"证"},"詐":{jp:"詐",zht:"詐",zhs:"诈"},"詔":{jp:"詔",zht:"詔",zhs:"诏"},"評":{jp:"評",zht:"評",zhs:"评"},"詛":{jp:"詛",zht:"詛",zhs:"诅"},"詞":{jp:"詞",zht:"詞",zhs:"词"},"試":{jp:"試",zht:"試",zhs:"试"},"詩":{jp:"詩",zht:"詩",zhs:"诗"},"詰":{jp:"詰",zht:"詰",zhs:"诘"},"該":{jp:"該",zht:"該",zhs:"该"},"詳":{jp:"詳",zht:"詳",zhs:"详"},"譽":{jp:"誉",zht:"譽",zhs:"誉"},"謄":{jp:"謄",zht:"謄",zhs:"誊"},"認":{jp:"認",zht:"認",zhs:"认"},"誕":{jp:"誕",zht:"誕",zhs:"诞"},"誘":{jp:"誘",zht:"誘",zhs:"诱"},"語":{jp:"語",zht:"語",zhs:"语"},"誠":{jp:"誠",zht:"誠",zhs:"诚"},"誤":{jp:"誤",zht:"誤",zhs:"误"},"說":{jp:"説",zht:"說",zhs:"说"},"讀":{jp:"読",zht:"讀",zhs:"读"},"誰":{jp:"誰",zht:"誰",zhs:"谁"},"課":{jp:"課",zht:"課",zhs:"课"},"調":{jp:"調",zht:"調",zhs:"调"},"談":{jp:"談",zht:"談",zhs:"谈"},"請":{jp:"請",zht:"請",zhs:"请"},"論":{jp:"論",zht:"論",zhs:"论"},"諭":{jp:"諭",zht:"諭",zhs:"谕"},"諸":{jp:"諸",zht:"諸",zhs:"诸"},"諾":{jp:"諾",zht:"諾",zhs:"诺"},"謀":{jp:"謀",zht:"謀",zhs:"谋"},"謁":{jp:"謁",zht:"謁",zhs:"谒"},"謎":{jp:"謎",zht:"謎",zhs:"谜"},"謙":{jp:"謙",zht:"謙",zhs:"谦"},"講":{jp:"講",zht:"講",zhs:"讲"},"謝":{jp:"謝",zht:"謝",zhs:"谢"},"謠":{jp:"謡",zht:"謠",zhs:"谣"},"謹":{jp:"謹",zht:"謹",zhs:"谨"},"識":{jp:"識",zht:"識",zhs:"识"},"譜":{jp:"譜",zht:"譜",zhs:"谱"},"議":{jp:"議",zht:"議",zhs:"议"},"讓":{jp:"譲",zht:"讓",zhs:"让"},"貝":{jp:"貝",zht:"貝",zhs:"贝"},"貞":{jp:"貞",zht:"貞",zhs:"贞"},"負":{jp:"負",zht:"負",zhs:"负"},"財":{jp:"財",zht:"財",zhs:"财"},"貢":{jp:"貢",zht:"貢",zhs:"贡"},"貧":{jp:"貧",zht:"貧",zhs:"贫"},"貨":{jp:"貨",zht:"貨",zhs:"货"},"販":{jp:"販",zht:"販",zhs:"贩"},"貪":{jp:"貪",zht:"貪",zhs:"贪"},"責":{jp:"責",zht:"責",zhs:"责"},"貯":{jp:"貯",zht:"貯",zhs:"贮"},"貴":{jp:"貴",zht:"貴",zhs:"贵"},"貸":{jp:"貸",zht:"貸",zhs:"贷"},"費":{jp:"費",zht:"費",zhs:"费"},"貿":{jp:"貿",zht:"貿",zhs:"贸"},"賀":{jp:"賀",zht:"賀",zhs:"贺"},"賃":{jp:"賃",zht:"賃",zhs:"赁"},"賄":{jp:"賄",zht:"賄",zhs:"贿"},"資":{jp:"資",zht:"資",zhs:"资"},"賊":{jp:"賊",zht:"賊",zhs:"贼"},"賤":{jp:"賎",zht:"賤",zhs:"贱"},"贊":{jp:"賛",zht:"贊",zhs:"赞"},"賜":{jp:"賜",zht:"賜",zhs:"赐"},"賞":{jp:"賞",zht:"賞",zhs:"赏"},"賠":{jp:"賠",zht:"賠",zhs:"赔"},"賢":{jp:"賢",zht:"賢",zhs:"贤"},"賦":{jp:"賦",zht:"賦",zhs:"赋"},"質":{jp:"質",zht:"質",zhs:"质"},"賴":{jp:"頼",zht:"賴",zhs:"赖"},"贈":{jp:"贈",zht:"贈",zhs:"赠"},"贓":{jp:"贓",zht:"贓",zhs:"赃"},"躍":{jp:"躍",zht:"躍",zhs:"跃"},"踐":{jp:"践",zht:"踐",zhs:"践"},"蹤":{jp:"踪",zht:"蹤",zhs:"踪"},"車":{jp:"車",zht:"車",zhs:"车"},"軌":{jp:"軌",zht:"軌",zhs:"轨"},"軒":{jp:"軒",zht:"軒",zhs:"轩"},"軟":{jp:"軟",zht:"軟",zhs:"软"},"轉":{jp:"転",zht:"轉",zhs:"转"},"軸":{jp:"軸",zht:"軸",zhs:"轴"},"輕":{jp:"軽",zht:"輕",zhs:"轻"},"較":{jp:"較",zht:"較",zhs:"较"},"載":{jp:"載",zht:"載",zhs:"载"},"輝":{jp:"輝",zht:"輝",zhs:"辉"},"輩":{jp:"輩",zht:"輩",zhs:"辈"},"輪":{jp:"輪",zht:"輪",zhs:"轮"},"輸":{jp:"輸",zht:"輸",zhs:"输"},"轄":{jp:"轄",zht:"轄",zhs:"辖"},"辭":{jp:"辞",zht:"辭",zhs:"辞"},"邊":{jp:"辺",zht:"邊",zhs:"边"},"達":{jp:"達",zht:"達",zhs:"达"},"遷":{jp:"遷",zht:"遷",zhs:"迁"},"過":{jp:"過",zht:"過",zhs:"过"},"運":{jp:"運",zht:"運",zhs:"运"},"還":{jp:"還",zht:"還",zhs:"还"},"進":{jp:"進",zht:"進",zhs:"进"},"遠":{jp:"遠",zht:"遠",zhs:"远"},"違":{jp:"違",zht:"違",zhs:"违"},"連":{jp:"連",zht:"連",zhs:"连"},"遲":{jp:"遅",zht:"遲",zhs:"迟"},"適":{jp:"適",zht:"適",zhs:"适"},"選":{jp:"選",zht:"選",zhs:"选"},"遞":{jp:"逓",zht:"遞",zhs:"递"},"遺":{jp:"遺",zht:"遺",zhs:"遗"},"遙":{jp:"遥",zht:"遙",zhs:"遥"},"郵":{jp:"郵",zht:"郵",zhs:"邮"},"鄰":{jp:"隣",zht:"鄰",zhs:"邻"},"醉":{jp:"酔",zht:"醉",zhs:"醉"},"釀":{jp:"醸",zht:"釀",zhs:"酿"},"釋":{jp:"釈",zht:"釋",zhs:"释"},"針":{jp:"針",zht:"針",zhs:"针"},"釣":{jp:"釣",zht:"釣",zhs:"钓"},"鈍":{jp:"鈍",zht:"鈍",zhs:"钝"},"鈴":{jp:"鈴",zht:"鈴",zhs:"铃"},"鐵":{jp:"鉄",zht:"鐵",zhs:"铁"},"鉛":{jp:"鉛",zht:"鉛",zhs:"铅"},"鑑":{jp:"鑑",zht:"鑑",zhs:"鉴"},"銀":{jp:"銀",zht:"銀",zhs:"银"},"銃":{jp:"銃",zht:"銃",zhs:"铳"},"銅":{jp:"銅",zht:"銅",zhs:"铜"},"銑":{jp:"銑",zht:"銑",zhs:"铣"},"銘":{jp:"銘",zht:"銘",zhs:"铭"},"錢":{jp:"銭",zht:"錢",zhs:"钱"},"鋭":{jp:"鋭",zht:"鋭",zhs:"锐"},"鑄":{jp:"鋳",zht:"鑄",zhs:"铸"},"鋼":{jp:"鋼",zht:"鋼",zhs:"钢"},"錘":{jp:"錘",zht:"錘",zhs:"锤"},"錠":{jp:"錠",zht:"錠",zhs:"锭"},"錯":{jp:"錯",zht:"錯",zhs:"错"},"鍾":{jp:"鍾",zht:"鍾",zhs:"钟"},"鎖":{jp:"鎖",zht:"鎖",zhs:"锁"},"鎮":{jp:"鎮",zht:"鎮",zhs:"镇"},"鏡":{jp:"鏡",zht:"鏡",zhs:"镜"},"長":{jp:"長",zht:"長",zhs:"长"},"門":{jp:"門",zht:"門",zhs:"门"},"閉":{jp:"閉",zht:"閉",zhs:"闭"},"閒":{jp:"閑",zht:"閒",zhs:"闲"},"間":{jp:"間",zht:"間",zhs:"间"},"閣":{jp:"閣",zht:"閣",zhs:"阁"},"閥":{jp:"閥",zht:"閥",zhs:"阀"},"閲":{jp:"閲",zht:"閲",zhs:"阅"},"隊":{jp:"隊",zht:"隊",zhs:"队"},"陽":{jp:"陽",zht:"陽",zhs:"阳"},"陰":{jp:"陰",zht:"陰",zhs:"阴"},"陣":{jp:"陣",zht:"陣",zhs:"阵"},"階":{jp:"階",zht:"階",zhs:"阶"},"際":{jp:"際",zht:"際",zhs:"际"},"陸":{jp:"陸",zht:"陸",zhs:"陆"},"陳":{jp:"陳",zht:"陳",zhs:"陈"},"陷":{jp:"陥",zht:"陷",zhs:"陷"},"隨":{jp:"随",zht:"隨",zhs:"随"},"隱":{jp:"隠",zht:"隱",zhs:"隐"},"隷":{jp:"隷",zht:"隷",zhs:"隶"},"隸":{jp:"隷",zht:"隸",zhs:"隶"},"難":{jp:"難",zht:"難",zhs:"难"},"雞":{jp:"鶏",zht:"雞",zhs:"鸡"},"鷄":{jp:"鶏",zht:"鷄",zhs:"鸡"},"霧":{jp:"霧",zht:"霧",zhs:"雾"},"靜":{jp:"静",zht:"靜",zhs:"静"},"頂":{jp:"頂",zht:"頂",zhs:"顶"},"項":{jp:"項",zht:"項",zhs:"项"},"順":{jp:"順",zht:"順",zhs:"顺"},"頑":{jp:"頑",zht:"頑",zhs:"顽"},"頒":{jp:"頒",zht:"頒",zhs:"颁"},"領":{jp:"領",zht:"領",zhs:"领"},"頻":{jp:"頻",zht:"頻",zhs:"频"},"題":{jp:"題",zht:"題",zhs:"题"},"額":{jp:"額",zht:"額",zhs:"额"},"顏":{jp:"顔",zht:"顏",zhs:"颜"},"風":{jp:"風",zht:"風",zhs:"风"},"飛":{jp:"飛",zht:"飛",zhs:"飞"},"饑":{jp:"飢",zht:"饑",zhs:"饥"},"飯":{jp:"飯",zht:"飯",zhs:"饭"},"飲":{jp:"飲",zht:"飲",zhs:"饮"},"飼":{jp:"飼",zht:"飼",zhs:"饲"},"飽":{jp:"飽",zht:"飽",zhs:"饱"},"飾":{jp:"飾",zht:"飾",zhs:"饰"},"餓":{jp:"餓",zht:"餓",zhs:"饿"},"馬":{jp:"馬",zht:"馬",zhs:"马"},"驛":{jp:"駅",zht:"驛",zhs:"驿"},"驅":{jp:"駆",zht:"驅",zhs:"驱"},"駐":{jp:"駐",zht:"駐",zhs:"驻"},"騎":{jp:"騎",zht:"騎",zhs:"骑"},"驗":{jp:"験",zht:"驗",zhs:"验"},"騷":{jp:"騒",zht:"騷",zhs:"骚"},"驔":{jp:"騨",zht:"驔",zhs:"驔"},"髓":{jp:"髄",zht:"髓",zhs:"髓"},"髮":{jp:"髪",zht:"髮",zhs:null},"魚":{jp:"魚",zht:"魚",zhs:"鱼"},"魯":{jp:"魯",zht:"魯",zhs:"鲁"},"鮮":{jp:"鮮",zht:"鮮",zhs:"鲜"},"鯨":{jp:"鯨",zht:"鯨",zhs:"鲸"},"鳥":{jp:"鳥",zht:"鳥",zhs:"鸟"},"鳴":{jp:"鳴",zht:"鳴",zhs:"鸣"},"鶇":{jp:"鶫",zht:"鶇",zhs:"鸫"},"麥":{jp:"麦",zht:"麥",zhs:"麦"},"黃":{jp:"黄",zht:"黃",zhs:"黄"},"黑":{jp:"黒",zht:"黑",zhs:"黑"},"默":{jp:"黙",zht:"默",zhs:"默"},"齡":{jp:"齢",zht:"齡",zhs:"龄"}},zhs:{"会":{jp:"会",zht:"會",zhs:"会"},"笺":{jp:"箋",zht:"箋",zhs:"笺"},"网":{jp:"網",zht:"網",zhs:"网"},"处":{jp:"処",zht:"處",zhs:"处"},"话":{jp:"話",zht:"話",zhs:"话"},"驮":{jp:"駄",zht:"馱",zhs:"驮"},"万":{jp:"万",zht:"萬",zhs:"万"},"与":{jp:"与",zht:"與",zhs:"与"},"丑":{jp:"醜",zht:"醜",zhs:"丑"},"专":{jp:"専",zht:"專",zhs:"专"},"业":{jp:"業",zht:"業",zhs:"业"},"东":{jp:"東",zht:"東",zhs:"东"},"丝":{jp:"絲",zht:"絲",zhs:"丝"},"两":{jp:"両",zht:"兩",zhs:"两"},"严":{jp:"厳",zht:"嚴",zhs:"严"},"并":{jp:"並",zht:"並",zhs:"并"},"丧":{jp:"喪",zht:"喪",zhs:"丧"},"个":{jp:"個",zht:"個",zhs:"个"},"丰":{jp:"豊",zht:"豐",zhs:"丰"},"临":{jp:"臨",zht:"臨",zhs:"临"},"为":{jp:"為",zht:"為",zhs:"为"},"丽":{jp:"麗",zht:"麗",zhs:"丽"},"举":{jp:"挙",zht:"舉",zhs:"举"},"迺":{jp:"廼",zht:"迺",zhs:"迺"},"义":{jp:"義",zht:"義",zhs:"义"},"乐":{jp:"楽",zht:"樂",zhs:"乐"},"乘":{jp:"乗",zht:"乘",zhs:"乘"},"习":{jp:"習",zht:"習",zhs:"习"},"乡":{jp:"郷",zht:"鄉",zhs:"乡"},"书":{jp:"書",zht:"書",zhs:"书"},"买":{jp:"買",zht:"買",zhs:"买"},"乱":{jp:"乱",zht:"亂",zhs:"乱"},"干":{jp:"乾",zht:"乾",zhs:"干"},"龟":{jp:"亀",zht:"龜",zhs:"龟"},"预":{jp:"予",zht:"預",zhs:"预"},"贰":{jp:"弐",zht:"貳",zhs:"贰"},"云":{jp:"雲",zht:"雲",zhs:"云"},"亚":{jp:"亜",zht:"亞",zhs:"亚"},"产":{jp:"産",zht:"產",zhs:"产"},"亩":{jp:"畝",zht:"畝",zhs:"亩"},"亲":{jp:"親",zht:"親",zhs:"亲"},"亿":{jp:"億",zht:"億",zhs:"亿"},"仆":{jp:"僕",zht:"僕",zhs:"仆"},"从":{jp:"従",zht:"從",zhs:"从"},"佛":{jp:"仏",zht:"佛",zhs:"佛"},"仓":{jp:"倉",zht:"倉",zhs:"仓"},"仪":{jp:"儀",zht:"儀",zhs:"仪"},"假":{jp:"仮",zht:"假",zhs:"假"},"价":{jp:"価",zht:"價",zhs:"价"},"众":{jp:"衆",zht:"眾",zhs:"众"},"优":{jp:"優",zht:"優",zhs:"优"},"传":{jp:"伝",zht:"傳",zhs:"传"},"伞":{jp:"傘",zht:"傘",zhs:"伞"},"伟":{jp:"偉",zht:"偉",zhs:"伟"},"伤":{jp:"傷",zht:"傷",zhs:"伤"},"伦":{jp:"倫",zht:"倫",zhs:"伦"},"伪":{jp:"偽",zht:"偽",zhs:"伪"},"体":{jp:"体",zht:"體",zhs:"体"},"余":{jp:"余",zht:"餘",zhs:"余"},"来":{jp:"来",zht:"來",zhs:"来"},"侦":{jp:"偵",zht:"偵",zhs:"侦"},"侧":{jp:"側",zht:"側",zhs:"侧"},"俭":{jp:"倹",zht:"儉",zhs:"俭"},"俱":{jp:"倶",zht:"俱",zhs:"俱"},"债":{jp:"債",zht:"債",zhs:"债"},"倾":{jp:"傾",zht:"傾",zhs:"倾"},"偿":{jp:"償",zht:"償",zhs:"偿"},"杰":{jp:"傑",zht:"傑",zhs:"杰"},"备":{jp:"備",zht:"備",zhs:"备"},"当":{jp:"当",zht:"當",zhs:"当"},"尽":{jp:"尽",zht:"盡",zhs:"尽"},"儿":{jp:"児",zht:"兒",zhs:"儿"},"党":{jp:"党",zht:"黨",zhs:"党"},"内":{jp:"内",zht:"內",zhs:"内"},"关":{jp:"関",zht:"關",zhs:"关"},"兴":{jp:"興",zht:"興",zhs:"兴"},"养":{jp:"養",zht:"養",zhs:"养"},"兽":{jp:"獣",zht:"獸",zhs:"兽"},"圆":{jp:"円",zht:"圓",zhs:"圆"},"写":{jp:"写",zht:"寫",zhs:"写"},"军":{jp:"軍",zht:"軍",zhs:"军"},"农":{jp:"農",zht:"農",zhs:"农"},"富":{jp:"冨",zht:"富",zhs:"富"},"冰":{jp:"氷",zht:"冰",zhs:"冰"},"冲":{jp:"衝",zht:"衝",zhs:"冲"},"决":{jp:"決",zht:"決",zhs:"决"},"冻":{jp:"凍",zht:"凍",zhs:"冻"},"涂":{jp:"塗",zht:"塗",zhs:"涂"},"凄":{jp:"凄",zht:"淒",zhs:"凄"},"准":{jp:"准",zht:"準",zhs:"准"},"几":{jp:"幾",zht:"幾",zhs:"几"},"击":{jp:"撃",zht:"擊",zhs:"击"},"划":{jp:"画",zht:"劃",zhs:"划"},"画":{jp:"画",zht:"畫",zhs:"画"},"则":{jp:"則",zht:"則",zhs:"则"},"刚":{jp:"剛",zht:"剛",zhs:"刚"},"创":{jp:"創",zht:"創",zhs:"创"},"别":{jp:"別",zht:"別",zhs:"别"},"制":{jp:"製",zht:"製",zhs:"制"},"卷":{jp:"券",zht:"卷",zhs:"卷"},"刹":{jp:"刹",zht:"剎",zhs:"刹"},"剂":{jp:"剤",zht:"劑",zhs:"剂"},"剑":{jp:"剣",zht:"劍",zhs:"剑"},"剧":{jp:"劇",zht:"劇",zhs:"剧"},"剩":{jp:"剰",zht:"剩",zhs:"剩"},"劝":{jp:"勧",zht:"勸",zhs:"劝"},"务":{jp:"務",zht:"務",zhs:"务"},"动":{jp:"動",zht:"動",zhs:"动"},"励":{jp:"励",zht:"勵",zhs:"励"},"劳":{jp:"労",zht:"勞",zhs:"劳"},"势":{jp:"勢",zht:"勢",zhs:"势"},"勋":{jp:"勲",zht:"勳",zhs:"勋"},"胜":{jp:"勝",zht:"勝",zhs:"胜"},"区":{jp:"区",zht:"區",zhs:"区"},"医":{jp:"医",zht:"醫",zhs:"医"},"华":{jp:"華",zht:"華",zhs:"华"},"协":{jp:"協",zht:"協",zhs:"协"},"单":{jp:"単",zht:"單",zhs:"单"},"卖":{jp:"売",zht:"賣",zhs:"卖"},"卫":{jp:"衛",zht:"衛",zhs:"卫"},"厅":{jp:"庁",zht:"廳",zhs:"厅"},"历":{jp:"歴",zht:"歷",zhs:"历"},"压":{jp:"圧",zht:"壓",zhs:"压"},"县":{jp:"県",zht:"縣",zhs:"县"},"参":{jp:"参",zht:"參",zhs:"参"},"双":{jp:"双",zht:"雙",zhs:"双"},"收":{jp:"収",zht:"收",zhs:"收"},"发":{jp:"発",zht:"發",zhs:"发"},"变":{jp:"変",zht:"變",zhs:"变"},"叠":{jp:"畳",zht:"疊",zhs:"叠"},"号":{jp:"号",zht:"號",zhs:"号"},"叹":{jp:"嘆",zht:"嘆",zhs:"叹"},"吓":{jp:"嚇",zht:"嚇",zhs:"吓"},"听":{jp:"聴",zht:"聽",zhs:"听"},"启":{jp:"啓",zht:"啟",zhs:"启"},"员":{jp:"員",zht:"員",zhs:"员"},"谘":{jp:"諮",zht:"諮",zhs:"谘"},"咸":{jp:"鹹",zht:"鹹",zhs:"咸"},"响":{jp:"響",zht:"響",zhs:"响"},"问":{jp:"問",zht:"問",zhs:"问"},"营":{jp:"営",zht:"營",zhs:"营"},"喷":{jp:"噴",zht:"噴",zhs:"喷"},"嘱":{jp:"嘱",zht:"囑",zhs:"嘱"},"苏":{jp:"蘇",zht:"蘇",zhs:"苏"},"团":{jp:"団",zht:"團",zhs:"团"},"园":{jp:"園",zht:"園",zhs:"园"},"国":{jp:"国",zht:"國",zhs:"国"},"围":{jp:"囲",zht:"圍",zhs:"围"},"图":{jp:"図",zht:"圖",zhs:"图"},"圈":{jp:"圏",zht:"圈",zhs:"圈"},"圣":{jp:"聖",zht:"聖",zhs:"圣"},"场":{jp:"場",zht:"場",zhs:"场"},"坏":{jp:"壊",zht:"壞",zhs:"坏"},"块":{jp:"塊",zht:"塊",zhs:"块"},"坚":{jp:"堅",zht:"堅",zhs:"坚"},"坛":{jp:"壇",zht:"壇",zhs:"坛"},"坟":{jp:"墳",zht:"墳",zhs:"坟"},"坠":{jp:"墜",zht:"墜",zhs:"坠"},"垒":{jp:"塁",zht:"壘",zhs:"垒"},"垦":{jp:"墾",zht:"墾",zhs:"垦"},"执":{jp:"執",zht:"執",zhs:"执"},"堕":{jp:"堕",zht:"墮",zhs:"堕"},"报":{jp:"報",zht:"報",zhs:"报"},"盐":{jp:"塩",zht:"鹽",zhs:"盐"},"增":{jp:"増",zht:"增",zhs:"增"},"壤":{jp:"壌",zht:"壤",zhs:"壤"},"壮":{jp:"壮",zht:"壯",zhs:"壮"},"声":{jp:"声",zht:"聲",zhs:"声"},"壹":{jp:"壱",zht:"壹",zhs:"壹"},"壳":{jp:"殻",zht:"殻",zhs:"壳"},"寿":{jp:"寿",zht:"壽",zhs:"寿"},"复":{jp:"復",zht:"復",zhs:"复"},"梦":{jp:"夢",zht:"夢",zhs:"梦"},"头":{jp:"頭",zht:"頭",zhs:"头"},"夸":{jp:"誇",zht:"誇",zhs:"夸"},"夺":{jp:"奪",zht:"奪",zhs:"夺"},"奋":{jp:"奮",zht:"奮",zhs:"奋"},"奖":{jp:"奨",zht:"獎",zhs:"奖"},"妆":{jp:"粧",zht:"妝",zhs:"妆"},"妇":{jp:"婦",zht:"婦",zhs:"妇"},"姐":{jp:"姉",zht:"姐",zhs:"姐"},"姬":{jp:"姫",zht:"姬",zhs:"姬"},"娘":{jp:"嬢",zht:"孃",zhs:"娘"},"娱":{jp:"娯",zht:"娛",zhs:"娱"},"孙":{jp:"孫",zht:"孫",zhs:"孙"},"学":{jp:"学",zht:"學",zhs:"学"},"宁":{jp:"寧",zht:"寧",zhs:"宁"},"宝":{jp:"宝",zht:"寶",zhs:"宝"},"实":{jp:"実",zht:"實",zhs:"实"},"审":{jp:"審",zht:"審",zhs:"审"},"宪":{jp:"憲",zht:"憲",zhs:"宪"},"宫":{jp:"宮",zht:"宮",zhs:"宫"},"宽":{jp:"寬",zht:"寬",zhs:"宽"},"宾":{jp:"賓",zht:"賓",zhs:"宾"},"秘":{jp:"秘",zht:"祕",zhs:"秘"},"寝":{jp:"寝",zht:"寢",zhs:"寝"},"对":{jp:"対",zht:"對",zhs:"对"},"寻":{jp:"尋",zht:"尋",zhs:"寻"},"导":{jp:"導",zht:"導",zhs:"导"},"将":{jp:"将",zht:"將",zhs:"将"},"层":{jp:"層",zht:"層",zhs:"层"},"属":{jp:"属",zht:"屬",zhs:"属"},"岁":{jp:"歳",zht:"歲",zhs:"岁"},"岛":{jp:"島",zht:"島",zhs:"岛"},"巖":{jp:"巌",zht:"巖",zhs:"巖"},"峡":{jp:"峡",zht:"峽",zhs:"峡"},"险":{jp:"険",zht:"險",zhs:"险"},"币":{jp:"幣",zht:"幣",zhs:"币"},"帅":{jp:"帥",zht:"帥",zhs:"帅"},"师":{jp:"師",zht:"師",zhs:"师"},"帐":{jp:"帳",zht:"帳",zhs:"帐"},"带":{jp:"帶",zht:"帶",zhs:"带"},"归":{jp:"帰",zht:"歸",zhs:"归"},"广":{jp:"広",zht:"廣",zhs:"广"},"庄":{jp:"庄",zht:"莊",zhs:"庄"},"庆":{jp:"慶",zht:"慶",zhs:"庆"},"库":{jp:"庫",zht:"庫",zhs:"库"},"应":{jp:"応",zht:"應",zhs:"应"},"废":{jp:"廃",zht:"廢",zhs:"废"},"开":{jp:"開",zht:"開",zhs:"开"},"辨":{jp:"弁",zht:"辨",zhs:"辨"},"瓣":{jp:"弁",zht:"辨",zhs:"瓣"},"辩":{jp:"弁",zht:"辨",zhs:"辩"},"异":{jp:"異",zht:"異",zhs:"异"},"弃":{jp:"棄",zht:"棄",zhs:"弃"},"张":{jp:"張",zht:"張",zhs:"张"},"弥":{jp:"弥",zht:"彌",zhs:"弥"},"强":{jp:"強",zht:"強",zhs:"强"},"弹":{jp:"弾",zht:"彈",zhs:"弹"},"录":{jp:"録",zht:"錄",zhs:"录"},"彥":{jp:"彦",zht:"彥",zhs:"彥"},"彻":{jp:"徹",zht:"徹",zhs:"彻"},"征":{jp:"徴",zht:"徵",zhs:"征"},"径":{jp:"径",zht:"徑",zhs:"径"},"德":{jp:"徳",zht:"德",zhs:"德"},"忆":{jp:"憶",zht:"憶",zhs:"忆"},"志":{jp:"誌",zht:"誌",zhs:"志"},"忧":{jp:"憂",zht:"憂",zhs:"忧"},"怀":{jp:"懐",zht:"懷",zhs:"怀"},"态":{jp:"態",zht:"態",zhs:"态"},"总":{jp:"総",zht:"總",zhs:"总"},"恒":{jp:"恒",zht:"恆",zhs:"恒"},"恋":{jp:"恋",zht:"戀",zhs:"恋"},"恳":{jp:"懇",zht:"懇",zhs:"恳"},"惠":{jp:"恵",zht:"惠",zhs:"惠"},"恶":{jp:"悪",zht:"惡",zhs:"恶"},"恼":{jp:"悩",zht:"惱",zhs:"恼"},"悅":{jp:"悦",zht:"悅",zhs:"悅"},"悬":{jp:"懸",zht:"懸",zhs:"悬"},"惊":{jp:"驚",zht:"驚",zhs:"惊"},"惨":{jp:"惨",zht:"慘",zhs:"惨"},"惩":{jp:"懲",zht:"懲",zhs:"惩"},"爱":{jp:"愛",zht:"愛",zhs:"爱"},"愤":{jp:"憤",zht:"憤",zhs:"愤"},"愿":{jp:"願",zht:"願",zhs:"愿"},"虑":{jp:"慮",zht:"慮",zhs:"虑"},"戏":{jp:"戯",zht:"戲",zhs:"戏"},"战":{jp:"戦",zht:"戰",zhs:"战"},"户":{jp:"戸",zht:"戶",zhs:"户"},"拂":{jp:"払",zht:"拂",zhs:"拂"},"扩":{jp:"拡",zht:"擴",zhs:"扩"},"扫":{jp:"掃",zht:"掃",zhs:"扫"},"扬":{jp:"揚",zht:"揚",zhs:"扬"},"择":{jp:"択",zht:"擇",zhs:"择"},"护":{jp:"護",zht:"護",zhs:"护"},"担":{jp:"担",zht:"擔",zhs:"担"},"拜":{jp:"拝",zht:"拜",zhs:"拜"},"拟":{jp:"擬",zht:"擬",zhs:"拟"},"据":{jp:"拠",zht:"據",zhs:"据"},"拥":{jp:"擁",zht:"擁",zhs:"拥"},"挟":{jp:"挟",zht:"挾",zhs:"挟"},"挥":{jp:"揮",zht:"揮",zhs:"挥"},"插":{jp:"揷",zht:"插",zhs:"插"},"损":{jp:"損",zht:"損",zhs:"损"},"舍":{jp:"捨",zht:"捨",zhs:"舍"},"揭":{jp:"掲",zht:"揭",zhs:"揭"},"掴":{jp:"掴",zht:"摑",zhs:"掴"},"摇":{jp:"揺",zht:"搖",zhs:"摇"},"摄":{jp:"摂",zht:"攝",zhs:"摄"},"敌":{jp:"敵",zht:"敵",zhs:"敌"},"败":{jp:"敗",zht:"敗",zhs:"败"},"数":{jp:"数",zht:"數",zhs:"数"},"齐":{jp:"斉",zht:"齊",zhs:"齐"},"斋":{jp:"斎",zht:"齋",zhs:"斋"},"斗":{jp:"闘",zht:"鬥",zhs:"斗"},"断":{jp:"断",zht:"斷",zhs:"断"},"旧":{jp:"旧",zht:"舊",zhs:"旧"},"时":{jp:"時",zht:"時",zhs:"时"},"昙":{jp:"曇",zht:"曇",zhs:"昙"},"昼":{jp:"昼",zht:"晝",zhs:"昼"},"显":{jp:"顕",zht:"顯",zhs:"显"},"晓":{jp:"暁",zht:"曉",zhs:"晓"},"晚":{jp:"晩",zht:"晚",zhs:"晚"},"暂":{jp:"暫",zht:"暫",zhs:"暂"},"曾":{jp:"曽",zht:"曾",zhs:"曾"},"术":{jp:"術",zht:"術",zhs:"术"},"朴":{jp:"樸",zht:"樸",zhs:"朴"},"机":{jp:"機",zht:"機",zhs:"机"},"杀":{jp:"殺",zht:"殺",zhs:"杀"},"杂":{jp:"雑",zht:"雜",zhs:"杂"},"权":{jp:"権",zht:"權",zhs:"权"},"条":{jp:"条",zht:"條",zhs:"条"},"极":{jp:"極",zht:"極",zhs:"极"},"枢":{jp:"枢",zht:"樞",zhs:"枢"},"枪":{jp:"槍",zht:"槍",zhs:"枪"},"查":{jp:"査",zht:"查",zhs:"查"},"荣":{jp:"栄",zht:"榮",zhs:"荣"},"标":{jp:"標",zht:"標",zhs:"标"},"栈":{jp:"桟",zht:"棧",zhs:"栈"},"栋":{jp:"棟",zht:"棟",zhs:"栋"},"栏":{jp:"欄",zht:"欄",zhs:"栏"},"树":{jp:"樹",zht:"樹",zhs:"树"},"样":{jp:"様",zht:"樣",zhs:"样"},"樱":{jp:"桜",zht:"櫻",zhs:"樱"},"桥":{jp:"橋",zht:"橋",zhs:"桥"},"检":{jp:"検",zht:"檢",zhs:"检"},"楼":{jp:"楼",zht:"樓",zhs:"楼"},"欢":{jp:"歓",zht:"歡",zhs:"欢"},"欧":{jp:"欧",zht:"歐",zhs:"欧"},"步":{jp:"歩",zht:"步",zhs:"步"},"齿":{jp:"歯",zht:"齒",zhs:"齿"},"残":{jp:"残",zht:"殘",zhs:"残"},"殴":{jp:"殴",zht:"毆",zhs:"殴"},"气":{jp:"気",zht:"氣",zhs:"气"},"汉":{jp:"漢",zht:"漢",zhs:"汉"},"汤":{jp:"湯",zht:"湯",zhs:"汤"},"沟":{jp:"溝",zht:"溝",zhs:"沟"},"泽":{jp:"沢",zht:"澤",zhs:"泽"},"泪":{jp:"涙",zht:"淚",zhs:"泪"},"泷":{jp:"滝",zht:"瀧",zhs:"泷"},"洁":{jp:"潔",zht:"潔",zhs:"洁"},"浅":{jp:"浅",zht:"淺",zhs:"浅"},"浊":{jp:"濁",zht:"濁",zhs:"浊"},"测":{jp:"測",zht:"測",zhs:"测"},"济":{jp:"済",zht:"濟",zhs:"济"},"浓":{jp:"濃",zht:"濃",zhs:"浓"},"滨":{jp:"浜",zht:"濱",zhs:"滨"},"涉":{jp:"渋",zht:"涉",zhs:"涉"},"涩":{jp:"渋",zht:"涉",zhs:"涩"},"涡":{jp:"渦",zht:"渦",zhs:"涡"},"润":{jp:"潤",zht:"潤",zhs:"润"},"渍":{jp:"漬",zht:"漬",zhs:"渍"},"渐":{jp:"漸",zht:"漸",zhs:"渐"},"溪":{jp:"渓",zht:"溪",zhs:"溪"},"渔":{jp:"漁",zht:"漁",zhs:"渔"},"湾":{jp:"湾",zht:"灣",zhs:"湾"},"湿":{jp:"湿",zht:"濕",zhs:"湿"},"满":{jp:"満",zht:"滿",zhs:"满"},"灭":{jp:"滅",zht:"滅",zhs:"灭"},"滞":{jp:"滞",zht:"滯",zhs:"滞"},"滥":{jp:"濫",zht:"濫",zhs:"滥"},"濑":{jp:"瀬",zht:"瀨",zhs:"濑"},"灯":{jp:"灯",zht:"燈",zhs:"灯"},"灵":{jp:"霊",zht:"靈",zhs:"灵"},"炉":{jp:"炉",zht:"爐",zhs:"炉"},"点":{jp:"点",zht:"點",zhs:"点"},"炼":{jp:"錬",zht:"鍊",zhs:"炼"},"练":{jp:"練",zht:"練",zhs:"练"},"烟":{jp:"煙",zht:"煙",zhs:"烟"},"烦":{jp:"煩",zht:"煩",zhs:"烦"},"烧":{jp:"焼",zht:"燒",zhs:"烧"},"热":{jp:"熱",zht:"熱",zhs:"热"},"焰":{jp:"焔",zht:"焰",zhs:"焰"},"锻":{jp:"鍛",zht:"鍛",zhs:"锻"},"牺":{jp:"犠",zht:"犧",zhs:"牺"},"状":{jp:"状",zht:"狀",zhs:"状"},"犹":{jp:"猶",zht:"猶",zhs:"犹"},"独":{jp:"独",zht:"獨",zhs:"独"},"狭":{jp:"狭",zht:"狹",zhs:"狭"},"狱":{jp:"獄",zht:"獄",zhs:"狱"},"猎":{jp:"猟",zht:"獵",zhs:"猎"},"猫":{jp:"猫",zht:"貓",zhs:"猫"},"献":{jp:"献",zht:"獻",zhs:"献"},"获":{jp:"獲",zht:"獲",zhs:"获"},"环":{jp:"環",zht:"環",zhs:"环"},"现":{jp:"現",zht:"現",zhs:"现"},"玺":{jp:"璽",zht:"璽",zhs:"玺"},"电":{jp:"電",zht:"電",zhs:"电"},"疗":{jp:"療",zht:"療",zhs:"疗"},"监":{jp:"監",zht:"監",zhs:"监"},"盖":{jp:"蓋",zht:"蓋",zhs:"盖"},"盘":{jp:"盤",zht:"盤",zhs:"盘"},"视":{jp:"視",zht:"視",zhs:"视"},"著":{jp:"着",zht:"著",zhs:"著"},"矫":{jp:"矯",zht:"矯",zhs:"矫"},"矿":{jp:"鉱",zht:"礦",zhs:"矿"},"碎":{jp:"砕",zht:"碎",zhs:"碎"},"础":{jp:"礎",zht:"礎",zhs:"础"},"确":{jp:"確",zht:"確",zhs:"确"},"礼":{jp:"礼",zht:"禮",zhs:"礼"},"祸":{jp:"禍",zht:"禍",zhs:"祸"},"禅":{jp:"禅",zht:"禪",zhs:"禅"},"离":{jp:"離",zht:"離",zhs:"离"},"种":{jp:"種",zht:"種",zhs:"种"},"积":{jp:"積",zht:"積",zhs:"积"},"称":{jp:"称",zht:"稱",zhs:"称"},"稻":{jp:"稲",zht:"稻",zhs:"稻"},"稳":{jp:"穏",zht:"穩",zhs:"稳"},"谷":{jp:"穀",zht:"穀",zhs:"谷"},"穗":{jp:"穂",zht:"穗",zhs:"穗"},"穷":{jp:"窮",zht:"窮",zhs:"穷"},"窃":{jp:"窃",zht:"竊",zhs:"窃"},"窗":{jp:"窓",zht:"窗",zhs:"窗"},"龙":{jp:"竜",zht:"龍",zhs:"龙"},"竞":{jp:"競",zht:"競",zhs:"竞"},"笃":{jp:"篤",zht:"篤",zhs:"笃"},"笔":{jp:"筆",zht:"筆",zhs:"笔"},"筑":{jp:"築",zht:"築",zhs:"筑"},"简":{jp:"簡",zht:"簡",zhs:"简"},"节":{jp:"節",zht:"節",zhs:"节"},"范":{jp:"範",zht:"範",zhs:"范"},"类":{jp:"類",zht:"類",zhs:"类"},"粹":{jp:"粋",zht:"粹",zhs:"粹"},"肃":{jp:"粛",zht:"肅",zhs:"肃"},"粮":{jp:"糧",zht:"糧",zhs:"粮"},"纠":{jp:"糾",zht:"糾",zhs:"纠"},"纪":{jp:"紀",zht:"紀",zhs:"纪"},"约":{jp:"約",zht:"約",zhs:"约"},"红":{jp:"紅",zht:"紅",zhs:"红"},"纹":{jp:"紋",zht:"紋",zhs:"纹"},"纳":{jp:"納",zht:"納",zhs:"纳"},"纯":{jp:"純",zht:"純",zhs:"纯"},"纸":{jp:"紙",zht:"紙",zhs:"纸"},"级":{jp:"級",zht:"級",zhs:"级"},"纷":{jp:"紛",zht:"紛",zhs:"纷"},"纺":{jp:"紡",zht:"紡",zhs:"纺"},"紧":{jp:"緊",zht:"緊",zhs:"紧"},"细":{jp:"細",zht:"細",zhs:"细"},"绅":{jp:"紳",zht:"紳",zhs:"绅"},"绍":{jp:"紹",zht:"紹",zhs:"绍"},"绀":{jp:"紺",zht:"紺",zhs:"绀"},"终":{jp:"終",zht:"終",zhs:"终"},"组":{jp:"組",zht:"組",zhs:"组"},"经":{jp:"経",zht:"經",zhs:"经"},"结":{jp:"結",zht:"結",zhs:"结"},"绝":{jp:"絶",zht:"絶",zhs:"绝"},"绞":{jp:"絞",zht:"絞",zhs:"绞"},"络":{jp:"絡",zht:"絡",zhs:"络"},"给":{jp:"給",zht:"給",zhs:"给"},"统":{jp:"統",zht:"統",zhs:"统"},"绘":{jp:"絵",zht:"繪",zhs:"绘"},"绢":{jp:"絹",zht:"絹",zhs:"绢"},"继":{jp:"継",zht:"繼",zhs:"继"},"续":{jp:"続",zht:"續",zhs:"续"},"绿":{jp:"緑",zht:"綠",zhs:"绿"},"线":{jp:"線",zht:"線",zhs:"线"},"维":{jp:"維",zht:"維",zhs:"维"},"纲":{jp:"綱",zht:"綱",zhs:"纲"},"绵":{jp:"綿",zht:"綿",zhs:"绵"},"绪":{jp:"緒",zht:"緒",zhs:"绪"},"缔":{jp:"締",zht:"締",zhs:"缔"},"缘":{jp:"縁",zht:"緣",zhs:"缘"},"编":{jp:"編",zht:"編",zhs:"编"},"缓":{jp:"緩",zht:"緩",zhs:"缓"},"纬":{jp:"緯",zht:"緯",zhs:"纬"},"绳":{jp:"縄",zht:"繩",zhs:"绳"},"缚":{jp:"縛",zht:"縛",zhs:"缚"},"纵":{jp:"縦",zht:"縱",zhs:"纵"},"缝":{jp:"縫",zht:"縫",zhs:"缝"},"缩":{jp:"縮",zht:"縮",zhs:"缩"},"纤":{jp:"繊",zht:"纖",zhs:"纤"},"绩":{jp:"績",zht:"績",zhs:"绩"},"织":{jp:"織",zht:"織",zhs:"织"},"缮":{jp:"繕",zht:"繕",zhs:"缮"},"茧":{jp:"繭",zht:"繭",zhs:"茧"},"缲":{jp:"繰",zht:"繰",zhs:"缲"},"罐":{jp:"缶",zht:"罐",zhs:"罐"},"钵":{jp:"鉢",zht:"鉢",zhs:"钵"},"罗":{jp:"羅",zht:"羅",zhs:"罗"},"罚":{jp:"罸",zht:"罰",zhs:"罚"},"罢":{jp:"罷",zht:"罷",zhs:"罢"},"骂":{jp:"罵",zht:"罵",zhs:"骂"},"职":{jp:"職",zht:"職",zhs:"职"},"闻":{jp:"聞",zht:"聞",zhs:"闻"},"聪":{jp:"聡",zht:"聰",zhs:"聪"},"肠":{jp:"腸",zht:"腸",zhs:"肠"},"肤":{jp:"膚",zht:"膚",zhs:"肤"},"胀":{jp:"脹",zht:"脹",zhs:"胀"},"胁":{jp:"脅",zht:"脅",zhs:"胁"},"胆":{jp:"胆",zht:"膽",zhs:"胆"},"脏":{jp:"臓",zht:"臟",zhs:"脏"},"脑":{jp:"脳",zht:"腦",zhs:"脑"},"脚":{jp:"脚",zht:"腳",zhs:"脚"},"腾":{jp:"騰",zht:"騰",zhs:"腾"},"铺":{jp:"舗",zht:"舖",zhs:"铺"},"馆":{jp:"館",zht:"館",zhs:"馆"},"舰":{jp:"艦",zht:"艦",zhs:"舰"},"艺":{jp:"芸",zht:"藝",zhs:"艺"},"茎":{jp:"茎",zht:"莖",zhs:"茎"},"荐":{jp:"薦",zht:"薦",zhs:"荐"},"药":{jp:"薬",zht:"藥",zhs:"药"},"萤":{jp:"蛍",zht:"螢",zhs:"萤"},"蒋":{jp:"蒋",zht:"蔣",zhs:"蒋"},"藏":{jp:"蔵",zht:"藏",zhs:"藏"},"虏":{jp:"虜",zht:"虜",zhs:"虏"},"虚":{jp:"虚",zht:"虛",zhs:"虚"},"虫":{jp:"虫",zht:"蟲",zhs:"虫"},"蚀":{jp:"蝕",zht:"蝕",zhs:"蚀"},"蚕":{jp:"蚕",zht:"蠶",zhs:"蚕"},"蛮":{jp:"蛮",zht:"蠻",zhs:"蛮"},"补":{jp:"補",zht:"補",zhs:"补"},"袭":{jp:"襲",zht:"襲",zhs:"袭"},"装":{jp:"装",zht:"裝",zhs:"装"},"里":{jp:"裏",zht:"裡",zhs:"里"},"霸":{jp:"覇",zht:"霸",zhs:"霸"},"见":{jp:"見",zht:"見",zhs:"见"},"观":{jp:"観",zht:"觀",zhs:"观"},"规":{jp:"規",zht:"規",zhs:"规"},"觉":{jp:"覚",zht:"覺",zhs:"觉"},"览":{jp:"覧",zht:"覽",zhs:"览"},"触":{jp:"触",zht:"觸",zhs:"触"},"订":{jp:"訂",zht:"訂",zhs:"订"},"计":{jp:"計",zht:"計",zhs:"计"},"讨":{jp:"討",zht:"討",zhs:"讨"},"训":{jp:"訓",zht:"訓",zhs:"训"},"记":{jp:"記",zht:"記",zhs:"记"},"讼":{jp:"訟",zht:"訟",zhs:"讼"},"访":{jp:"訪",zht:"訪",zhs:"访"},"设":{jp:"設",zht:"設",zhs:"设"},"许":{jp:"許",zht:"許",zhs:"许"},"译":{jp:"訳",zht:"譯",zhs:"译"},"诉":{jp:"訴",zht:"訴",zhs:"诉"},"诊":{jp:"診",zht:"診",zhs:"诊"},"证":{jp:"証",zht:"證",zhs:"证"},"诈":{jp:"詐",zht:"詐",zhs:"诈"},"诏":{jp:"詔",zht:"詔",zhs:"诏"},"评":{jp:"評",zht:"評",zhs:"评"},"诅":{jp:"詛",zht:"詛",zhs:"诅"},"词":{jp:"詞",zht:"詞",zhs:"词"},"试":{jp:"試",zht:"試",zhs:"试"},"诗":{jp:"詩",zht:"詩",zhs:"诗"},"诘":{jp:"詰",zht:"詰",zhs:"诘"},"该":{jp:"該",zht:"該",zhs:"该"},"详":{jp:"詳",zht:"詳",zhs:"详"},"誉":{jp:"誉",zht:"譽",zhs:"誉"},"誊":{jp:"謄",zht:"謄",zhs:"誊"},"认":{jp:"認",zht:"認",zhs:"认"},"诞":{jp:"誕",zht:"誕",zhs:"诞"},"诱":{jp:"誘",zht:"誘",zhs:"诱"},"语":{jp:"語",zht:"語",zhs:"语"},"诚":{jp:"誠",zht:"誠",zhs:"诚"},"误":{jp:"誤",zht:"誤",zhs:"误"},"说":{jp:"説",zht:"說",zhs:"说"},"读":{jp:"読",zht:"讀",zhs:"读"},"谁":{jp:"誰",zht:"誰",zhs:"谁"},"课":{jp:"課",zht:"課",zhs:"课"},"调":{jp:"調",zht:"調",zhs:"调"},"谈":{jp:"談",zht:"談",zhs:"谈"},"请":{jp:"請",zht:"請",zhs:"请"},"论":{jp:"論",zht:"論",zhs:"论"},"谕":{jp:"諭",zht:"諭",zhs:"谕"},"诸":{jp:"諸",zht:"諸",zhs:"诸"},"诺":{jp:"諾",zht:"諾",zhs:"诺"},"谋":{jp:"謀",zht:"謀",zhs:"谋"},"谒":{jp:"謁",zht:"謁",zhs:"谒"},"谜":{jp:"謎",zht:"謎",zhs:"谜"},"谦":{jp:"謙",zht:"謙",zhs:"谦"},"讲":{jp:"講",zht:"講",zhs:"讲"},"谢":{jp:"謝",zht:"謝",zhs:"谢"},"谣":{jp:"謡",zht:"謠",zhs:"谣"},"谨":{jp:"謹",zht:"謹",zhs:"谨"},"识":{jp:"識",zht:"識",zhs:"识"},"谱":{jp:"譜",zht:"譜",zhs:"谱"},"议":{jp:"議",zht:"議",zhs:"议"},"让":{jp:"譲",zht:"讓",zhs:"让"},"贝":{jp:"貝",zht:"貝",zhs:"贝"},"贞":{jp:"貞",zht:"貞",zhs:"贞"},"负":{jp:"負",zht:"負",zhs:"负"},"财":{jp:"財",zht:"財",zhs:"财"},"贡":{jp:"貢",zht:"貢",zhs:"贡"},"贫":{jp:"貧",zht:"貧",zhs:"贫"},"货":{jp:"貨",zht:"貨",zhs:"货"},"贩":{jp:"販",zht:"販",zhs:"贩"},"贪":{jp:"貪",zht:"貪",zhs:"贪"},"责":{jp:"責",zht:"責",zhs:"责"},"贮":{jp:"貯",zht:"貯",zhs:"贮"},"贵":{jp:"貴",zht:"貴",zhs:"贵"},"贷":{jp:"貸",zht:"貸",zhs:"贷"},"费":{jp:"費",zht:"費",zhs:"费"},"贸":{jp:"貿",zht:"貿",zhs:"贸"},"贺":{jp:"賀",zht:"賀",zhs:"贺"},"赁":{jp:"賃",zht:"賃",zhs:"赁"},"贿":{jp:"賄",zht:"賄",zhs:"贿"},"资":{jp:"資",zht:"資",zhs:"资"},"贼":{jp:"賊",zht:"賊",zhs:"贼"},"贱":{jp:"賎",zht:"賤",zhs:"贱"},"赞":{jp:"賛",zht:"贊",zhs:"赞"},"赐":{jp:"賜",zht:"賜",zhs:"赐"},"赏":{jp:"賞",zht:"賞",zhs:"赏"},"赔":{jp:"賠",zht:"賠",zhs:"赔"},"贤":{jp:"賢",zht:"賢",zhs:"贤"},"赋":{jp:"賦",zht:"賦",zhs:"赋"},"质":{jp:"質",zht:"質",zhs:"质"},"赖":{jp:"頼",zht:"賴",zhs:"赖"},"赠":{jp:"贈",zht:"贈",zhs:"赠"},"赃":{jp:"贓",zht:"贓",zhs:"赃"},"跃":{jp:"躍",zht:"躍",zhs:"跃"},"践":{jp:"践",zht:"踐",zhs:"践"},"踪":{jp:"踪",zht:"蹤",zhs:"踪"},"车":{jp:"車",zht:"車",zhs:"车"},"轨":{jp:"軌",zht:"軌",zhs:"轨"},"轩":{jp:"軒",zht:"軒",zhs:"轩"},"软":{jp:"軟",zht:"軟",zhs:"软"},"转":{jp:"転",zht:"轉",zhs:"转"},"轴":{jp:"軸",zht:"軸",zhs:"轴"},"轻":{jp:"軽",zht:"輕",zhs:"轻"},"较":{jp:"較",zht:"較",zhs:"较"},"载":{jp:"載",zht:"載",zhs:"载"},"辉":{jp:"輝",zht:"輝",zhs:"辉"},"辈":{jp:"輩",zht:"輩",zhs:"辈"},"轮":{jp:"輪",zht:"輪",zhs:"轮"},"输":{jp:"輸",zht:"輸",zhs:"输"},"辖":{jp:"轄",zht:"轄",zhs:"辖"},"辞":{jp:"辞",zht:"辭",zhs:"辞"},"边":{jp:"辺",zht:"邊",zhs:"边"},"达":{jp:"達",zht:"達",zhs:"达"},"迁":{jp:"遷",zht:"遷",zhs:"迁"},"过":{jp:"過",zht:"過",zhs:"过"},"运":{jp:"運",zht:"運",zhs:"运"},"还":{jp:"還",zht:"還",zhs:"还"},"进":{jp:"進",zht:"進",zhs:"进"},"远":{jp:"遠",zht:"遠",zhs:"远"},"违":{jp:"違",zht:"違",zhs:"违"},"连":{jp:"連",zht:"連",zhs:"连"},"迟":{jp:"遅",zht:"遲",zhs:"迟"},"适":{jp:"適",zht:"適",zhs:"适"},"选":{jp:"選",zht:"選",zhs:"选"},"递":{jp:"逓",zht:"遞",zhs:"递"},"遗":{jp:"遺",zht:"遺",zhs:"遗"},"遥":{jp:"遥",zht:"遙",zhs:"遥"},"邮":{jp:"郵",zht:"郵",zhs:"邮"},"邻":{jp:"隣",zht:"鄰",zhs:"邻"},"醉":{jp:"酔",zht:"醉",zhs:"醉"},"酿":{jp:"醸",zht:"釀",zhs:"酿"},"释":{jp:"釈",zht:"釋",zhs:"释"},"针":{jp:"針",zht:"針",zhs:"针"},"钓":{jp:"釣",zht:"釣",zhs:"钓"},"钝":{jp:"鈍",zht:"鈍",zhs:"钝"},"铃":{jp:"鈴",zht:"鈴",zhs:"铃"},"铁":{jp:"鉄",zht:"鐵",zhs:"铁"},"铅":{jp:"鉛",zht:"鉛",zhs:"铅"},"鉴":{jp:"鑑",zht:"鑑",zhs:"鉴"},"银":{jp:"銀",zht:"銀",zhs:"银"},"铳":{jp:"銃",zht:"銃",zhs:"铳"},"铜":{jp:"銅",zht:"銅",zhs:"铜"},"铣":{jp:"銑",zht:"銑",zhs:"铣"},"铭":{jp:"銘",zht:"銘",zhs:"铭"},"钱":{jp:"銭",zht:"錢",zhs:"钱"},"锐":{jp:"鋭",zht:"鋭",zhs:"锐"},"铸":{jp:"鋳",zht:"鑄",zhs:"铸"},"钢":{jp:"鋼",zht:"鋼",zhs:"钢"},"锤":{jp:"錘",zht:"錘",zhs:"锤"},"锭":{jp:"錠",zht:"錠",zhs:"锭"},"错":{jp:"錯",zht:"錯",zhs:"错"},"钟":{jp:"鍾",zht:"鍾",zhs:"钟"},"锁":{jp:"鎖",zht:"鎖",zhs:"锁"},"镇":{jp:"鎮",zht:"鎮",zhs:"镇"},"镜":{jp:"鏡",zht:"鏡",zhs:"镜"},"长":{jp:"長",zht:"長",zhs:"长"},"门":{jp:"門",zht:"門",zhs:"门"},"闭":{jp:"閉",zht:"閉",zhs:"闭"},"闲":{jp:"閑",zht:"閒",zhs:"闲"},"间":{jp:"間",zht:"間",zhs:"间"},"阁":{jp:"閣",zht:"閣",zhs:"阁"},"阀":{jp:"閥",zht:"閥",zhs:"阀"},"阅":{jp:"閲",zht:"閲",zhs:"阅"},"队":{jp:"隊",zht:"隊",zhs:"队"},"阳":{jp:"陽",zht:"陽",zhs:"阳"},"阴":{jp:"陰",zht:"陰",zhs:"阴"},"阵":{jp:"陣",zht:"陣",zhs:"阵"},"阶":{jp:"階",zht:"階",zhs:"阶"},"际":{jp:"際",zht:"際",zhs:"际"},"陆":{jp:"陸",zht:"陸",zhs:"陆"},"陈":{jp:"陳",zht:"陳",zhs:"陈"},"陷":{jp:"陥",zht:"陷",zhs:"陷"},"随":{jp:"随",zht:"隨",zhs:"随"},"隐":{jp:"隠",zht:"隱",zhs:"隐"},"隶":{jp:"隷",zht:"隷",zhs:"隶"},"难":{jp:"難",zht:"難",zhs:"难"},"鸡":{jp:"鶏",zht:"雞",zhs:"鸡"},"雾":{jp:"霧",zht:"霧",zhs:"雾"},"静":{jp:"静",zht:"靜",zhs:"静"},"顶":{jp:"頂",zht:"頂",zhs:"顶"},"项":{jp:"項",zht:"項",zhs:"项"},"顺":{jp:"順",zht:"順",zhs:"顺"},"顽":{jp:"頑",zht:"頑",zhs:"顽"},"颁":{jp:"頒",zht:"頒",zhs:"颁"},"领":{jp:"領",zht:"領",zhs:"领"},"频":{jp:"頻",zht:"頻",zhs:"频"},"题":{jp:"題",zht:"題",zhs:"题"},"额":{jp:"額",zht:"額",zhs:"额"},"颜":{jp:"顔",zht:"顏",zhs:"颜"},"风":{jp:"風",zht:"風",zhs:"风"},"飞":{jp:"飛",zht:"飛",zhs:"飞"},"饥":{jp:"飢",zht:"饑",zhs:"饥"},"饭":{jp:"飯",zht:"飯",zhs:"饭"},"饮":{jp:"飲",zht:"飲",zhs:"饮"},"饲":{jp:"飼",zht:"飼",zhs:"饲"},"饱":{jp:"飽",zht:"飽",zhs:"饱"},"饰":{jp:"飾",zht:"飾",zhs:"饰"},"饿":{jp:"餓",zht:"餓",zhs:"饿"},"马":{jp:"馬",zht:"馬",zhs:"马"},"驿":{jp:"駅",zht:"驛",zhs:"驿"},"驱":{jp:"駆",zht:"驅",zhs:"驱"},"驻":{jp:"駐",zht:"駐",zhs:"驻"},"骑":{jp:"騎",zht:"騎",zhs:"骑"},"验":{jp:"験",zht:"驗",zhs:"验"},"骚":{jp:"騒",zht:"騷",zhs:"骚"},"驔":{jp:"騨",zht:"驔",zhs:"驔"},"髓":{jp:"髄",zht:"髓",zhs:"髓"},"鱼":{jp:"魚",zht:"魚",zhs:"鱼"},"鲁":{jp:"魯",zht:"魯",zhs:"鲁"},"鲜":{jp:"鮮",zht:"鮮",zhs:"鲜"},"鲸":{jp:"鯨",zht:"鯨",zhs:"鲸"},"鸟":{jp:"鳥",zht:"鳥",zhs:"鸟"},"鸣":{jp:"鳴",zht:"鳴",zhs:"鸣"},"鸫":{jp:"鶫",zht:"鶇",zhs:"鸫"},"麦":{jp:"麦",zht:"麥",zhs:"麦"},"黄":{jp:"黄",zht:"黃",zhs:"黄"},"黑":{jp:"黒",zht:"黑",zhs:"黑"},"默":{jp:"黙",zht:"默",zhs:"默"},"龄":{jp:"齢",zht:"齡",zhs:"龄"}}},es.TABLE_SAFE={jp:{"会":{jp:"会",zht:"會",zhs:"会"},"箋":{jp:"箋",zht:"箋",zhs:"笺"},"網":{jp:"網",zht:"網",zhs:"网"},"処":{jp:"処",zht:"處",zhs:"处"},"話":{jp:"話",zht:"話",zhs:"话"},"万":{jp:"万",zht:"萬",zhs:"万"},"与":{jp:"与",zht:"與",zhs:"与"},"醜":{jp:"醜",zht:"醜",zhs:"丑"},"専":{jp:"専",zht:"專",zhs:"专"},"業":{jp:"業",zht:"業",zhs:"业"},"東":{jp:"東",zht:"東",zhs:"东"},"両":{jp:"両",zht:"兩",zhs:"两"},"厳":{jp:"厳",zht:"嚴",zhs:"严"},"並":{jp:"並",zht:"並",zhs:"并"},"喪":{jp:"喪",zht:"喪",zhs:"丧"},"豊":{jp:"豊",zht:"豐",zhs:"丰"},"臨":{jp:"臨",zht:"臨",zhs:"临"},"為":{jp:"為",zht:"為",zhs:"为"},"麗":{jp:"麗",zht:"麗",zhs:"丽"},"挙":{jp:"挙",zht:"舉",zhs:"举"},"廼":{jp:"廼",zht:"迺",zhs:"迺"},"義":{jp:"義",zht:"義",zhs:"义"},"楽":{jp:"楽",zht:"樂",zhs:"乐"},"乗":{jp:"乗",zht:"乘",zhs:"乘"},"習":{jp:"習",zht:"習",zhs:"习"},"郷":{jp:"郷",zht:"鄉",zhs:"乡"},"書":{jp:"書",zht:"書",zhs:"书"},"買":{jp:"買",zht:"買",zhs:"买"},"乱":{jp:"乱",zht:"亂",zhs:"乱"},"亀":{jp:"亀",zht:"龜",zhs:"龟"},"弐":{jp:"弐",zht:"貳",zhs:"贰"},"雲":{jp:"雲",zht:"雲",zhs:"云"},"亜":{jp:"亜",zht:"亞",zhs:"亚"},"産":{jp:"産",zht:"產",zhs:"产"},"畝":{jp:"畝",zht:"畝",zhs:"亩"},"親":{jp:"親",zht:"親",zhs:"亲"},"億":{jp:"億",zht:"億",zhs:"亿"},"僕":{jp:"僕",zht:"僕",zhs:"仆"},"従":{jp:"従",zht:"從",zhs:"从"},"仏":{jp:"仏",zht:"佛",zhs:"佛"},"倉":{jp:"倉",zht:"倉",zhs:"仓"},"儀":{jp:"儀",zht:"儀",zhs:"仪"},"仮":{jp:"仮",zht:"假",zhs:"假"},"価":{jp:"価",zht:"價",zhs:"价"},"衆":{jp:"衆",zht:"眾",zhs:"众"},"優":{jp:"優",zht:"優",zhs:"优"},"伝":{jp:"伝",zht:"傳",zhs:"传"},"傘":{jp:"傘",zht:"傘",zhs:"伞"},"偉":{jp:"偉",zht:"偉",zhs:"伟"},"傷":{jp:"傷",zht:"傷",zhs:"伤"},"倫":{jp:"倫",zht:"倫",zhs:"伦"},"偽":{jp:"偽",zht:"偽",zhs:"伪"},"体":{jp:"体",zht:"體",zhs:"体"},"余":{jp:"余",zht:"餘",zhs:"余"},"来":{jp:"来",zht:"來",zhs:"来"},"偵":{jp:"偵",zht:"偵",zhs:"侦"},"側":{jp:"側",zht:"側",zhs:"侧"},"倹":{jp:"倹",zht:"儉",zhs:"俭"},"倶":{jp:"倶",zht:"俱",zhs:"俱"},"債":{jp:"債",zht:"債",zhs:"债"},"傾":{jp:"傾",zht:"傾",zhs:"倾"},"償":{jp:"償",zht:"償",zhs:"偿"},"傑":{jp:"傑",zht:"傑",zhs:"杰"},"備":{jp:"備",zht:"備",zhs:"备"},"当":{jp:"当",zht:"當",zhs:"当"},"尽":{jp:"尽",zht:"盡",zhs:"尽"},"児":{jp:"児",zht:"兒",zhs:"儿"},"党":{jp:"党",zht:"黨",zhs:"党"},"内":{jp:"内",zht:"內",zhs:"内"},"関":{jp:"関",zht:"關",zhs:"关"},"興":{jp:"興",zht:"興",zhs:"兴"},"養":{jp:"養",zht:"養",zhs:"养"},"獣":{jp:"獣",zht:"獸",zhs:"兽"},"円":{jp:"円",zht:"圓",zhs:"圆"},"写":{jp:"写",zht:"寫",zhs:"写"},"軍":{jp:"軍",zht:"軍",zhs:"军"},"農":{jp:"農",zht:"農",zhs:"农"},"冨":{jp:"冨",zht:"富",zhs:"富"},"氷":{jp:"氷",zht:"冰",zhs:"冰"},"衝":{jp:"衝",zht:"衝",zhs:"冲"},"決":{jp:"決",zht:"決",zhs:"决"},"凍":{jp:"凍",zht:"凍",zhs:"冻"},"塗":{jp:"塗",zht:"塗",zhs:"涂"},"幾":{jp:"幾",zht:"幾",zhs:"几"},"撃":{jp:"撃",zht:"擊",zhs:"击"},"画":{jp:"画",zht:"劃",zhs:"划"},"則":{jp:"則",zht:"則",zhs:"则"},"剛":{jp:"剛",zht:"剛",zhs:"刚"},"創":{jp:"創",zht:"創",zhs:"创"},"別":{jp:"別",zht:"別",zhs:"别"},"製":{jp:"製",zht:"製",zhs:"制"},"巻":{jp:"巻",zht:"卷",zhs:"卷"},"刹":{jp:"刹",zht:"剎",zhs:"刹"},"剤":{jp:"剤",zht:"劑",zhs:"剂"},"剣":{jp:"剣",zht:"劍",zhs:"剑"},"劇":{jp:"劇",zht:"劇",zhs:"剧"},"剰":{jp:"剰",zht:"剩",zhs:"剩"},"勧":{jp:"勧",zht:"勸",zhs:"劝"},"務":{jp:"務",zht:"務",zhs:"务"},"動":{jp:"動",zht:"動",zhs:"动"},"励":{jp:"励",zht:"勵",zhs:"励"},"労":{jp:"労",zht:"勞",zhs:"劳"},"勢":{jp:"勢",zht:"勢",zhs:"势"},"勲":{jp:"勲",zht:"勳",zhs:"勋"},"勝":{jp:"勝",zht:"勝",zhs:"胜"},"区":{jp:"区",zht:"區",zhs:"区"},"医":{jp:"医",zht:"醫",zhs:"医"},"華":{jp:"華",zht:"華",zhs:"华"},"協":{jp:"協",zht:"協",zhs:"协"},"単":{jp:"単",zht:"單",zhs:"单"},"売":{jp:"売",zht:"賣",zhs:"卖"},"衛":{jp:"衛",zht:"衛",zhs:"卫"},"庁":{jp:"庁",zht:"廳",zhs:"厅"},"圧":{jp:"圧",zht:"壓",zhs:"压"},"県":{jp:"県",zht:"縣",zhs:"县"},"参":{jp:"参",zht:"參",zhs:"参"},"双":{jp:"双",zht:"雙",zhs:"双"},"収":{jp:"収",zht:"收",zhs:"收"},"発":{jp:"発",zht:"發",zhs:"发"},"変":{jp:"変",zht:"變",zhs:"变"},"畳":{jp:"畳",zht:"疊",zhs:"叠"},"号":{jp:"号",zht:"號",zhs:"号"},"嘆":{jp:"嘆",zht:"嘆",zhs:"叹"},"嚇":{jp:"嚇",zht:"嚇",zhs:"吓"},"聴":{jp:"聴",zht:"聽",zhs:"听"},"啓":{jp:"啓",zht:"啟",zhs:"启"},"員":{jp:"員",zht:"員",zhs:"员"},"諮":{jp:"諮",zht:"諮",zhs:"谘"},"鹹":{jp:"鹹",zht:"鹹",zhs:"咸"},"響":{jp:"響",zht:"響",zhs:"响"},"問":{jp:"問",zht:"問",zhs:"问"},"営":{jp:"営",zht:"營",zhs:"营"},"噴":{jp:"噴",zht:"噴",zhs:"喷"},"嘱":{jp:"嘱",zht:"囑",zhs:"嘱"},"蘇":{jp:"蘇",zht:"蘇",zhs:"苏"},"団":{jp:"団",zht:"團",zhs:"团"},"園":{jp:"園",zht:"園",zhs:"园"},"国":{jp:"国",zht:"國",zhs:"国"},"囲":{jp:"囲",zht:"圍",zhs:"围"},"図":{jp:"図",zht:"圖",zhs:"图"},"圏":{jp:"圏",zht:"圈",zhs:"圈"},"聖":{jp:"聖",zht:"聖",zhs:"圣"},"場":{jp:"場",zht:"場",zhs:"场"},"壊":{jp:"壊",zht:"壞",zhs:"坏"},"塊":{jp:"塊",zht:"塊",zhs:"块"},"堅":{jp:"堅",zht:"堅",zhs:"坚"},"壇":{jp:"壇",zht:"壇",zhs:"坛"},"墳":{jp:"墳",zht:"墳",zhs:"坟"},"墜":{jp:"墜",zht:"墜",zhs:"坠"},"塁":{jp:"塁",zht:"壘",zhs:"垒"},"墾":{jp:"墾",zht:"墾",zhs:"垦"},"執":{jp:"執",zht:"執",zhs:"执"},"堕":{jp:"堕",zht:"墮",zhs:"堕"},"報":{jp:"報",zht:"報",zhs:"报"},"塩":{jp:"塩",zht:"鹽",zhs:"盐"},"増":{jp:"増",zht:"增",zhs:"增"},"壌":{jp:"壌",zht:"壤",zhs:"壤"},"壮":{jp:"壮",zht:"壯",zhs:"壮"},"声":{jp:"声",zht:"聲",zhs:"声"},"壱":{jp:"壱",zht:"壹",zhs:"壹"},"寿":{jp:"寿",zht:"壽",zhs:"寿"},"夢":{jp:"夢",zht:"夢",zhs:"梦"},"頭":{jp:"頭",zht:"頭",zhs:"头"},"誇":{jp:"誇",zht:"誇",zhs:"夸"},"奪":{jp:"奪",zht:"奪",zhs:"夺"},"奮":{jp:"奮",zht:"奮",zhs:"奋"},"奨":{jp:"奨",zht:"獎",zhs:"奖"},"粧":{jp:"粧",zht:"妝",zhs:"妆"},"婦":{jp:"婦",zht:"婦",zhs:"妇"},"姉":{jp:"姉",zht:"姐",zhs:"姐"},"姫":{jp:"姫",zht:"姬",zhs:"姬"},"嬢":{jp:"嬢",zht:"孃",zhs:"娘"},"娯":{jp:"娯",zht:"娛",zhs:"娱"},"孫":{jp:"孫",zht:"孫",zhs:"孙"},"学":{jp:"学",zht:"學",zhs:"学"},"寧":{jp:"寧",zht:"寧",zhs:"宁"},"宝":{jp:"宝",zht:"寶",zhs:"宝"},"実":{jp:"実",zht:"實",zhs:"实"},"審":{jp:"審",zht:"審",zhs:"审"},"憲":{jp:"憲",zht:"憲",zhs:"宪"},"宮":{jp:"宮",zht:"宮",zhs:"宫"},"賓":{jp:"賓",zht:"賓",zhs:"宾"},"秘":{jp:"秘",zht:"祕",zhs:"秘"},"寝":{jp:"寝",zht:"寢",zhs:"寝"},"対":{jp:"対",zht:"對",zhs:"对"},"尋":{jp:"尋",zht:"尋",zhs:"寻"},"導":{jp:"導",zht:"導",zhs:"导"},"将":{jp:"将",zht:"將",zhs:"将"},"層":{jp:"層",zht:"層",zhs:"层"},"属":{jp:"属",zht:"屬",zhs:"属"},"歳":{jp:"歳",zht:"歲",zhs:"岁"},"島":{jp:"島",zht:"島",zhs:"岛"},"巌":{jp:"巌",zht:"巖",zhs:"巖"},"峡":{jp:"峡",zht:"峽",zhs:"峡"},"険":{jp:"険",zht:"險",zhs:"险"},"幣":{jp:"幣",zht:"幣",zhs:"币"},"帥":{jp:"帥",zht:"帥",zhs:"帅"},"師":{jp:"師",zht:"師",zhs:"师"},"帳":{jp:"帳",zht:"帳",zhs:"帐"},"帰":{jp:"帰",zht:"歸",zhs:"归"},"広":{jp:"広",zht:"廣",zhs:"广"},"慶":{jp:"慶",zht:"慶",zhs:"庆"},"庫":{jp:"庫",zht:"庫",zhs:"库"},"応":{jp:"応",zht:"應",zhs:"应"},"廃":{jp:"廃",zht:"廢",zhs:"废"},"開":{jp:"開",zht:"開",zhs:"开"},"弁":{jp:"弁",zht:"辨",zhs:"辨"},"異":{jp:"異",zht:"異",zhs:"异"},"棄":{jp:"棄",zht:"棄",zhs:"弃"},"張":{jp:"張",zht:"張",zhs:"张"},"弥":{jp:"弥",zht:"彌",zhs:"弥"},"強":{jp:"強",zht:"強",zhs:"强"},"弾":{jp:"弾",zht:"彈",zhs:"弹"},"録":{jp:"録",zht:"錄",zhs:"录"},"彦":{jp:"彦",zht:"彥",zhs:"彥"},"徹":{jp:"徹",zht:"徹",zhs:"彻"},"徴":{jp:"徴",zht:"徵",zhs:"征"},"径":{jp:"径",zht:"徑",zhs:"径"},"徳":{jp:"徳",zht:"德",zhs:"德"},"憶":{jp:"憶",zht:"憶",zhs:"忆"},"誌":{jp:"誌",zht:"誌",zhs:"志"},"憂":{jp:"憂",zht:"憂",zhs:"忧"},"懐":{jp:"懐",zht:"懷",zhs:"怀"},"態":{jp:"態",zht:"態",zhs:"态"},"総":{jp:"総",zht:"總",zhs:"总"},"恒":{jp:"恒",zht:"恆",zhs:"恒"},"恋":{jp:"恋",zht:"戀",zhs:"恋"},"懇":{jp:"懇",zht:"懇",zhs:"恳"},"恵":{jp:"恵",zht:"惠",zhs:"惠"},"悪":{jp:"悪",zht:"惡",zhs:"恶"},"悩":{jp:"悩",zht:"惱",zhs:"恼"},"悦":{jp:"悦",zht:"悅",zhs:"悅"},"懸":{jp:"懸",zht:"懸",zhs:"悬"},"驚":{jp:"驚",zht:"驚",zhs:"惊"},"惨":{jp:"惨",zht:"慘",zhs:"惨"},"懲":{jp:"懲",zht:"懲",zhs:"惩"},"愛":{jp:"愛",zht:"愛",zhs:"爱"},"憤":{jp:"憤",zht:"憤",zhs:"愤"},"願":{jp:"願",zht:"願",zhs:"愿"},"慮":{jp:"慮",zht:"慮",zhs:"虑"},"戯":{jp:"戯",zht:"戲",zhs:"戏"},"戦":{jp:"戦",zht:"戰",zhs:"战"},"戸":{jp:"戸",zht:"戶",zhs:"户"},"払":{jp:"払",zht:"拂",zhs:"拂"},"拡":{jp:"拡",zht:"擴",zhs:"扩"},"掃":{jp:"掃",zht:"掃",zhs:"扫"},"揚":{jp:"揚",zht:"揚",zhs:"扬"},"択":{jp:"択",zht:"擇",zhs:"择"},"護":{jp:"護",zht:"護",zhs:"护"},"担":{jp:"担",zht:"擔",zhs:"担"},"拝":{jp:"拝",zht:"拜",zhs:"拜"},"擬":{jp:"擬",zht:"擬",zhs:"拟"},"拠":{jp:"拠",zht:"據",zhs:"据"},"擁":{jp:"擁",zht:"擁",zhs:"拥"},"挟":{jp:"挟",zht:"挾",zhs:"挟"},"揮":{jp:"揮",zht:"揮",zhs:"挥"},"挿":{jp:"挿",zht:"插",zhs:"插"},"損":{jp:"損",zht:"損",zhs:"损"},"捨":{jp:"捨",zht:"捨",zhs:"舍"},"掲":{jp:"掲",zht:"揭",zhs:"揭"},"掴":{jp:"掴",zht:"摑",zhs:"掴"},"揺":{jp:"揺",zht:"搖",zhs:"摇"},"敵":{jp:"敵",zht:"敵",zhs:"敌"},"敗":{jp:"敗",zht:"敗",zhs:"败"},"数":{jp:"数",zht:"數",zhs:"数"},"斉":{jp:"斉",zht:"齊",zhs:"齐"},"斎":{jp:"斎",zht:"齋",zhs:"斋"},"断":{jp:"断",zht:"斷",zhs:"断"},"旧":{jp:"旧",zht:"舊",zhs:"旧"},"時":{jp:"時",zht:"時",zhs:"时"},"曇":{jp:"曇",zht:"曇",zhs:"昙"},"昼":{jp:"昼",zht:"晝",zhs:"昼"},"顕":{jp:"顕",zht:"顯",zhs:"显"},"暁":{jp:"暁",zht:"曉",zhs:"晓"},"晩":{jp:"晩",zht:"晚",zhs:"晚"},"暫":{jp:"暫",zht:"暫",zhs:"暂"},"曽":{jp:"曽",zht:"曾",zhs:"曾"},"術":{jp:"術",zht:"術",zhs:"术"},"樸":{jp:"樸",zht:"樸",zhs:"朴"},"機":{jp:"機",zht:"機",zhs:"机"},"殺":{jp:"殺",zht:"殺",zhs:"杀"},"雑":{jp:"雑",zht:"雜",zhs:"杂"},"権":{jp:"権",zht:"權",zhs:"权"},"条":{jp:"条",zht:"條",zhs:"条"},"極":{jp:"極",zht:"極",zhs:"极"},"枢":{jp:"枢",zht:"樞",zhs:"枢"},"槍":{jp:"槍",zht:"槍",zhs:"枪"},"査":{jp:"査",zht:"查",zhs:"查"},"栄":{jp:"栄",zht:"榮",zhs:"荣"},"標":{jp:"標",zht:"標",zhs:"标"},"桟":{jp:"桟",zht:"棧",zhs:"栈"},"棟":{jp:"棟",zht:"棟",zhs:"栋"},"欄":{jp:"欄",zht:"欄",zhs:"栏"},"樹":{jp:"樹",zht:"樹",zhs:"树"},"様":{jp:"様",zht:"樣",zhs:"样"},"桜":{jp:"桜",zht:"櫻",zhs:"樱"},"橋":{jp:"橋",zht:"橋",zhs:"桥"},"検":{jp:"検",zht:"檢",zhs:"检"},"楼":{jp:"楼",zht:"樓",zhs:"楼"},"歓":{jp:"歓",zht:"歡",zhs:"欢"},"欧":{jp:"欧",zht:"歐",zhs:"欧"},"歩":{jp:"歩",zht:"步",zhs:"步"},"歯":{jp:"歯",zht:"齒",zhs:"齿"},"残":{jp:"残",zht:"殘",zhs:"残"},"殴":{jp:"殴",zht:"毆",zhs:"殴"},"気":{jp:"気",zht:"氣",zhs:"气"},"漢":{jp:"漢",zht:"漢",zhs:"汉"},"湯":{jp:"湯",zht:"湯",zhs:"汤"},"溝":{jp:"溝",zht:"溝",zhs:"沟"},"沢":{jp:"沢",zht:"澤",zhs:"泽"},"涙":{jp:"涙",zht:"淚",zhs:"泪"},"滝":{jp:"滝",zht:"瀧",zhs:"泷"},"潔":{jp:"潔",zht:"潔",zhs:"洁"},"浅":{jp:"浅",zht:"淺",zhs:"浅"},"濁":{jp:"濁",zht:"濁",zhs:"浊"},"測":{jp:"測",zht:"測",zhs:"测"},"済":{jp:"済",zht:"濟",zhs:"济"},"濃":{jp:"濃",zht:"濃",zhs:"浓"},"浜":{jp:"浜",zht:"濱",zhs:"滨"},"渋":{jp:"渋",zht:"涉",zhs:"涉"},"渦":{jp:"渦",zht:"渦",zhs:"涡"},"潤":{jp:"潤",zht:"潤",zhs:"润"},"漬":{jp:"漬",zht:"漬",zhs:"渍"},"漸":{jp:"漸",zht:"漸",zhs:"渐"},"渓":{jp:"渓",zht:"溪",zhs:"溪"},"漁":{jp:"漁",zht:"漁",zhs:"渔"},"湾":{jp:"湾",zht:"灣",zhs:"湾"},"湿":{jp:"湿",zht:"濕",zhs:"湿"},"満":{jp:"満",zht:"滿",zhs:"满"},"滅":{jp:"滅",zht:"滅",zhs:"灭"},"滞":{jp:"滞",zht:"滯",zhs:"滞"},"濫":{jp:"濫",zht:"濫",zhs:"滥"},"瀬":{jp:"瀬",zht:"瀨",zhs:"濑"},"灯":{jp:"灯",zht:"燈",zhs:"灯"},"霊":{jp:"霊",zht:"靈",zhs:"灵"},"炉":{jp:"炉",zht:"爐",zhs:"炉"},"点":{jp:"点",zht:"點",zhs:"点"},"錬":{jp:"錬",zht:"鍊",zhs:"炼"},"練":{jp:"練",zht:"練",zhs:"练"},"煙":{jp:"煙",zht:"煙",zhs:"烟"},"煩":{jp:"煩",zht:"煩",zhs:"烦"},"焼":{jp:"焼",zht:"燒",zhs:"烧"},"熱":{jp:"熱",zht:"熱",zhs:"热"},"焔":{jp:"焔",zht:"焰",zhs:"焰"},"鍛":{jp:"鍛",zht:"鍛",zhs:"锻"},"犠":{jp:"犠",zht:"犧",zhs:"牺"},"状":{jp:"状",zht:"狀",zhs:"状"},"猶":{jp:"猶",zht:"猶",zhs:"犹"},"独":{jp:"独",zht:"獨",zhs:"独"},"狭":{jp:"狭",zht:"狹",zhs:"狭"},"獄":{jp:"獄",zht:"獄",zhs:"狱"},"猟":{jp:"猟",zht:"獵",zhs:"猎"},"猫":{jp:"猫",zht:"貓",zhs:"猫"},"献":{jp:"献",zht:"獻",zhs:"献"},"環":{jp:"環",zht:"環",zhs:"环"},"現":{jp:"現",zht:"現",zhs:"现"},"璽":{jp:"璽",zht:"璽",zhs:"玺"},"電":{jp:"電",zht:"電",zhs:"电"},"療":{jp:"療",zht:"療",zhs:"疗"},"監":{jp:"監",zht:"監",zhs:"监"},"蓋":{jp:"蓋",zht:"蓋",zhs:"盖"},"盤":{jp:"盤",zht:"盤",zhs:"盘"},"視":{jp:"視",zht:"視",zhs:"视"},"着":{jp:"着",zht:"著",zhs:"著"},"矯":{jp:"矯",zht:"矯",zhs:"矫"},"鉱":{jp:"鉱",zht:"礦",zhs:"矿"},"砕":{jp:"砕",zht:"碎",zhs:"碎"},"礎":{jp:"礎",zht:"礎",zhs:"础"},"確":{jp:"確",zht:"確",zhs:"确"},"礼":{jp:"礼",zht:"禮",zhs:"礼"},"禍":{jp:"禍",zht:"禍",zhs:"祸"},"禅":{jp:"禅",zht:"禪",zhs:"禅"},"離":{jp:"離",zht:"離",zhs:"离"},"種":{jp:"種",zht:"種",zhs:"种"},"積":{jp:"積",zht:"積",zhs:"积"},"称":{jp:"称",zht:"稱",zhs:"称"},"稲":{jp:"稲",zht:"稻",zhs:"稻"},"穏":{jp:"穏",zht:"穩",zhs:"稳"},"穀":{jp:"穀",zht:"穀",zhs:"谷"},"穂":{jp:"穂",zht:"穗",zhs:"穗"},"窮":{jp:"窮",zht:"窮",zhs:"穷"},"窃":{jp:"窃",zht:"竊",zhs:"窃"},"窓":{jp:"窓",zht:"窗",zhs:"窗"},"竜":{jp:"竜",zht:"龍",zhs:"龙"},"競":{jp:"競",zht:"競",zhs:"竞"},"篤":{jp:"篤",zht:"篤",zhs:"笃"},"筆":{jp:"筆",zht:"筆",zhs:"笔"},"築":{jp:"築",zht:"築",zhs:"筑"},"簡":{jp:"簡",zht:"簡",zhs:"简"},"節":{jp:"節",zht:"節",zhs:"节"},"範":{jp:"範",zht:"範",zhs:"范"},"類":{jp:"類",zht:"類",zhs:"类"},"粋":{jp:"粋",zht:"粹",zhs:"粹"},"粛":{jp:"粛",zht:"肅",zhs:"肃"},"糧":{jp:"糧",zht:"糧",zhs:"粮"},"糾":{jp:"糾",zht:"糾",zhs:"纠"},"紀":{jp:"紀",zht:"紀",zhs:"纪"},"約":{jp:"約",zht:"約",zhs:"约"},"紅":{jp:"紅",zht:"紅",zhs:"红"},"紋":{jp:"紋",zht:"紋",zhs:"纹"},"納":{jp:"納",zht:"納",zhs:"纳"},"純":{jp:"純",zht:"純",zhs:"纯"},"紙":{jp:"紙",zht:"紙",zhs:"纸"},"級":{jp:"級",zht:"級",zhs:"级"},"紛":{jp:"紛",zht:"紛",zhs:"纷"},"紡":{jp:"紡",zht:"紡",zhs:"纺"},"緊":{jp:"緊",zht:"緊",zhs:"紧"},"細":{jp:"細",zht:"細",zhs:"细"},"紳":{jp:"紳",zht:"紳",zhs:"绅"},"紹":{jp:"紹",zht:"紹",zhs:"绍"},"紺":{jp:"紺",zht:"紺",zhs:"绀"},"終":{jp:"終",zht:"終",zhs:"终"},"組":{jp:"組",zht:"組",zhs:"组"},"経":{jp:"経",zht:"經",zhs:"经"},"結":{jp:"結",zht:"結",zhs:"结"},"絶":{jp:"絶",zht:"絕",zhs:"绝"},"絞":{jp:"絞",zht:"絞",zhs:"绞"},"絡":{jp:"絡",zht:"絡",zhs:"络"},"給":{jp:"給",zht:"給",zhs:"给"},"統":{jp:"統",zht:"統",zhs:"统"},"絵":{jp:"絵",zht:"繪",zhs:"绘"},"絹":{jp:"絹",zht:"絹",zhs:"绢"},"継":{jp:"継",zht:"繼",zhs:"继"},"続":{jp:"続",zht:"續",zhs:"续"},"緑":{jp:"緑",zht:"綠",zhs:"绿"},"線":{jp:"線",zht:"線",zhs:"线"},"維":{jp:"維",zht:"維",zhs:"维"},"綱":{jp:"綱",zht:"綱",zhs:"纲"},"綿":{jp:"綿",zht:"綿",zhs:"绵"},"緒":{jp:"緒",zht:"緒",zhs:"绪"},"締":{jp:"締",zht:"締",zhs:"缔"},"縁":{jp:"縁",zht:"緣",zhs:"缘"},"編":{jp:"編",zht:"編",zhs:"编"},"緩":{jp:"緩",zht:"緩",zhs:"缓"},"緯":{jp:"緯",zht:"緯",zhs:"纬"},"縄":{jp:"縄",zht:"繩",zhs:"绳"},"縛":{jp:"縛",zht:"縛",zhs:"缚"},"縦":{jp:"縦",zht:"縱",zhs:"纵"},"縫":{jp:"縫",zht:"縫",zhs:"缝"},"縮":{jp:"縮",zht:"縮",zhs:"缩"},"繊":{jp:"繊",zht:"纖",zhs:"纤"},"績":{jp:"績",zht:"績",zhs:"绩"},"織":{jp:"織",zht:"織",zhs:"织"},"繕":{jp:"繕",zht:"繕",zhs:"缮"},"繭":{jp:"繭",zht:"繭",zhs:"茧"},"繰":{jp:"繰",zht:"繰",zhs:"缲"},"缶":{jp:"缶",zht:"罐",zhs:"罐"},"鉢":{jp:"鉢",zht:"鉢",zhs:"钵"},"羅":{jp:"羅",zht:"羅",zhs:"罗"},"罸":{jp:"罸",zht:"罰",zhs:"罚"},"罷":{jp:"罷",zht:"罷",zhs:"罢"},"罵":{jp:"罵",zht:"罵",zhs:"骂"},"職":{jp:"職",zht:"職",zhs:"职"},"聞":{jp:"聞",zht:"聞",zhs:"闻"},"聡":{jp:"聡",zht:"聰",zhs:"聪"},"腸":{jp:"腸",zht:"腸",zhs:"肠"},"膚":{jp:"膚",zht:"膚",zhs:"肤"},"脹":{jp:"脹",zht:"脹",zhs:"胀"},"脅":{jp:"脅",zht:"脅",zhs:"胁"},"胆":{jp:"胆",zht:"膽",zhs:"胆"},"臓":{jp:"臓",zht:"臟",zhs:"脏"},"脳":{jp:"脳",zht:"腦",zhs:"脑"},"脚":{jp:"脚",zht:"腳",zhs:"脚"},"騰":{jp:"騰",zht:"騰",zhs:"腾"},"舗":{jp:"舗",zht:"舖",zhs:"铺"},"館":{jp:"館",zht:"館",zhs:"馆"},"艦":{jp:"艦",zht:"艦",zhs:"舰"},"芸":{jp:"芸",zht:"藝",zhs:"艺"},"茎":{jp:"茎",zht:"莖",zhs:"茎"},"薦":{jp:"薦",zht:"薦",zhs:"荐"},"薬":{jp:"薬",zht:"藥",zhs:"药"},"蛍":{jp:"蛍",zht:"螢",zhs:"萤"},"蒋":{jp:"蒋",zht:"蔣",zhs:"蒋"},"蔵":{jp:"蔵",zht:"藏",zhs:"藏"},"虜":{jp:"虜",zht:"虜",zhs:"虏"},"虚":{jp:"虚",zht:"虛",zhs:"虚"},"虫":{jp:"虫",zht:"蟲",zhs:"虫"},"蝕":{jp:"蝕",zht:"蝕",zhs:"蚀"},"蚕":{jp:"蚕",zht:"蠶",zhs:"蚕"},"蛮":{jp:"蛮",zht:"蠻",zhs:"蛮"},"補":{jp:"補",zht:"補",zhs:"补"},"襲":{jp:"襲",zht:"襲",zhs:"袭"},"装":{jp:"装",zht:"裝",zhs:"装"},"裏":{jp:"裏",zht:"裡",zhs:"里"},"覇":{jp:"覇",zht:"霸",zhs:"霸"},"見":{jp:"見",zht:"見",zhs:"见"},"観":{jp:"観",zht:"觀",zhs:"观"},"規":{jp:"規",zht:"規",zhs:"规"},"覚":{jp:"覚",zht:"覺",zhs:"觉"},"覧":{jp:"覧",zht:"覽",zhs:"览"},"触":{jp:"触",zht:"觸",zhs:"触"},"訂":{jp:"訂",zht:"訂",zhs:"订"},"計":{jp:"計",zht:"計",zhs:"计"},"討":{jp:"討",zht:"討",zhs:"讨"},"訓":{jp:"訓",zht:"訓",zhs:"训"},"記":{jp:"記",zht:"記",zhs:"记"},"訟":{jp:"訟",zht:"訟",zhs:"讼"},"訪":{jp:"訪",zht:"訪",zhs:"访"},"設":{jp:"設",zht:"設",zhs:"设"},"許":{jp:"許",zht:"許",zhs:"许"},"訳":{jp:"訳",zht:"譯",zhs:"译"},"訴":{jp:"訴",zht:"訴",zhs:"诉"},"診":{jp:"診",zht:"診",zhs:"诊"},"証":{jp:"証",zht:"證",zhs:"证"},"詐":{jp:"詐",zht:"詐",zhs:"诈"},"詔":{jp:"詔",zht:"詔",zhs:"诏"},"評":{jp:"評",zht:"評",zhs:"评"},"詛":{jp:"詛",zht:"詛",zhs:"诅"},"詞":{jp:"詞",zht:"詞",zhs:"词"},"試":{jp:"試",zht:"試",zhs:"试"},"詩":{jp:"詩",zht:"詩",zhs:"诗"},"詰":{jp:"詰",zht:"詰",zhs:"诘"},"該":{jp:"該",zht:"該",zhs:"该"},"詳":{jp:"詳",zht:"詳",zhs:"详"},"誉":{jp:"誉",zht:"譽",zhs:"誉"},"謄":{jp:"謄",zht:"謄",zhs:"誊"},"認":{jp:"認",zht:"認",zhs:"认"},"誕":{jp:"誕",zht:"誕",zhs:"诞"},"誘":{jp:"誘",zht:"誘",zhs:"诱"},"語":{jp:"語",zht:"語",zhs:"语"},"誠":{jp:"誠",zht:"誠",zhs:"诚"},"誤":{jp:"誤",zht:"誤",zhs:"误"},"説":{jp:"説",zht:"說",zhs:"说"},"読":{jp:"読",zht:"讀",zhs:"读"},"誰":{jp:"誰",zht:"誰",zhs:"谁"},"課":{jp:"課",zht:"課",zhs:"课"},"調":{jp:"調",zht:"調",zhs:"调"},"談":{jp:"談",zht:"談",zhs:"谈"},"請":{jp:"請",zht:"請",zhs:"请"},"論":{jp:"論",zht:"論",zhs:"论"},"諭":{jp:"諭",zht:"諭",zhs:"谕"},"諸":{jp:"諸",zht:"諸",zhs:"诸"},"諾":{jp:"諾",zht:"諾",zhs:"诺"},"謀":{jp:"謀",zht:"謀",zhs:"谋"},"謁":{jp:"謁",zht:"謁",zhs:"谒"},"謎":{jp:"謎",zht:"謎",zhs:"谜"},"謙":{jp:"謙",zht:"謙",zhs:"谦"},"講":{jp:"講",zht:"講",zhs:"讲"},"謝":{jp:"謝",zht:"謝",zhs:"谢"},"謡":{jp:"謡",zht:"謠",zhs:"谣"},"謹":{jp:"謹",zht:"謹",zhs:"谨"},"識":{jp:"識",zht:"識",zhs:"识"},"譜":{jp:"譜",zht:"譜",zhs:"谱"},"議":{jp:"議",zht:"議",zhs:"议"},"譲":{jp:"譲",zht:"讓",zhs:"让"},"貝":{jp:"貝",zht:"貝",zhs:"贝"},"貞":{jp:"貞",zht:"貞",zhs:"贞"},"負":{jp:"負",zht:"負",zhs:"负"},"財":{jp:"財",zht:"財",zhs:"财"},"貢":{jp:"貢",zht:"貢",zhs:"贡"},"貧":{jp:"貧",zht:"貧",zhs:"贫"},"貨":{jp:"貨",zht:"貨",zhs:"货"},"販":{jp:"販",zht:"販",zhs:"贩"},"貪":{jp:"貪",zht:"貪",zhs:"贪"},"責":{jp:"責",zht:"責",zhs:"责"},"貯":{jp:"貯",zht:"貯",zhs:"贮"},"貴":{jp:"貴",zht:"貴",zhs:"贵"},"貸":{jp:"貸",zht:"貸",zhs:"贷"},"費":{jp:"費",zht:"費",zhs:"费"},"貿":{jp:"貿",zht:"貿",zhs:"贸"},"賀":{jp:"賀",zht:"賀",zhs:"贺"},"賃":{jp:"賃",zht:"賃",zhs:"赁"},"賄":{jp:"賄",zht:"賄",zhs:"贿"},"資":{jp:"資",zht:"資",zhs:"资"},"賊":{jp:"賊",zht:"賊",zhs:"贼"},"賎":{jp:"賎",zht:"賤",zhs:"贱"},"賛":{jp:"賛",zht:"贊",zhs:"赞"},"賜":{jp:"賜",zht:"賜",zhs:"赐"},"賞":{jp:"賞",zht:"賞",zhs:"赏"},"賠":{jp:"賠",zht:"賠",zhs:"赔"},"賢":{jp:"賢",zht:"賢",zhs:"贤"},"賦":{jp:"賦",zht:"賦",zhs:"赋"},"質":{jp:"質",zht:"質",zhs:"质"},"頼":{jp:"頼",zht:"賴",zhs:"赖"},"贈":{jp:"贈",zht:"贈",zhs:"赠"},"贓":{jp:"贓",zht:"贓",zhs:"赃"},"躍":{jp:"躍",zht:"躍",zhs:"跃"},"践":{jp:"践",zht:"踐",zhs:"践"},"踪":{jp:"踪",zht:"蹤",zhs:"踪"},"車":{jp:"車",zht:"車",zhs:"车"},"軌":{jp:"軌",zht:"軌",zhs:"轨"},"軒":{jp:"軒",zht:"軒",zhs:"轩"},"軟":{jp:"軟",zht:"軟",zhs:"软"},"転":{jp:"転",zht:"轉",zhs:"转"},"軸":{jp:"軸",zht:"軸",zhs:"轴"},"軽":{jp:"軽",zht:"輕",zhs:"轻"},"較":{jp:"較",zht:"較",zhs:"较"},"載":{jp:"載",zht:"載",zhs:"载"},"輝":{jp:"輝",zht:"輝",zhs:"辉"},"輩":{jp:"輩",zht:"輩",zhs:"辈"},"輪":{jp:"輪",zht:"輪",zhs:"轮"},"輸":{jp:"輸",zht:"輸",zhs:"输"},"轄":{jp:"轄",zht:"轄",zhs:"辖"},"辞":{jp:"辞",zht:"辭",zhs:"辞"},"辺":{jp:"辺",zht:"邊",zhs:"边"},"達":{jp:"達",zht:"達",zhs:"达"},"遷":{jp:"遷",zht:"遷",zhs:"迁"},"過":{jp:"過",zht:"過",zhs:"过"},"運":{jp:"運",zht:"運",zhs:"运"},"還":{jp:"還",zht:"還",zhs:"还"},"進":{jp:"進",zht:"進",zhs:"进"},"遠":{jp:"遠",zht:"遠",zhs:"远"},"違":{jp:"違",zht:"違",zhs:"违"},"連":{jp:"連",zht:"連",zhs:"连"},"遅":{jp:"遅",zht:"遲",zhs:"迟"},"適":{jp:"適",zht:"適",zhs:"适"},"選":{jp:"選",zht:"選",zhs:"选"},"逓":{jp:"逓",zht:"遞",zhs:"递"},"遺":{jp:"遺",zht:"遺",zhs:"遗"},"遥":{jp:"遥",zht:"遙",zhs:"遥"},"郵":{jp:"郵",zht:"郵",zhs:"邮"},"隣":{jp:"隣",zht:"鄰",zhs:"邻"},"酔":{jp:"酔",zht:"醉",zhs:"醉"},"醸":{jp:"醸",zht:"釀",zhs:"酿"},"釈":{jp:"釈",zht:"釋",zhs:"释"},"針":{jp:"針",zht:"針",zhs:"针"},"釣":{jp:"釣",zht:"釣",zhs:"钓"},"鈍":{jp:"鈍",zht:"鈍",zhs:"钝"},"鈴":{jp:"鈴",zht:"鈴",zhs:"铃"},"鉄":{jp:"鉄",zht:"鐵",zhs:"铁"},"鉛":{jp:"鉛",zht:"鉛",zhs:"铅"},"鑑":{jp:"鑑",zht:"鑑",zhs:"鉴"},"銀":{jp:"銀",zht:"銀",zhs:"银"},"銃":{jp:"銃",zht:"銃",zhs:"铳"},"銅":{jp:"銅",zht:"銅",zhs:"铜"},"銑":{jp:"銑",zht:"銑",zhs:"铣"},"銘":{jp:"銘",zht:"銘",zhs:"铭"},"銭":{jp:"銭",zht:"錢",zhs:"钱"},"鋭":{jp:"鋭",zht:"鋭",zhs:"锐"},"鋳":{jp:"鋳",zht:"鑄",zhs:"铸"},"鋼":{jp:"鋼",zht:"鋼",zhs:"钢"},"錘":{jp:"錘",zht:"錘",zhs:"锤"},"錠":{jp:"錠",zht:"錠",zhs:"锭"},"錯":{jp:"錯",zht:"錯",zhs:"错"},"鍾":{jp:"鍾",zht:"鍾",zhs:"钟"},"鎖":{jp:"鎖",zht:"鎖",zhs:"锁"},"鎮":{jp:"鎮",zht:"鎮",zhs:"镇"},"鏡":{jp:"鏡",zht:"鏡",zhs:"镜"},"長":{jp:"長",zht:"長",zhs:"长"},"門":{jp:"門",zht:"門",zhs:"门"},"閉":{jp:"閉",zht:"閉",zhs:"闭"},"閑":{jp:"閑",zht:"閒",zhs:"闲"},"間":{jp:"間",zht:"間",zhs:"间"},"閣":{jp:"閣",zht:"閣",zhs:"阁"},"閥":{jp:"閥",zht:"閥",zhs:"阀"},"閲":{jp:"閲",zht:"閲",zhs:"阅"},"隊":{jp:"隊",zht:"隊",zhs:"队"},"陽":{jp:"陽",zht:"陽",zhs:"阳"},"陰":{jp:"陰",zht:"陰",zhs:"阴"},"陣":{jp:"陣",zht:"陣",zhs:"阵"},"階":{jp:"階",zht:"階",zhs:"阶"},"際":{jp:"際",zht:"際",zhs:"际"},"陸":{jp:"陸",zht:"陸",zhs:"陆"},"陳":{jp:"陳",zht:"陳",zhs:"陈"},"陥":{jp:"陥",zht:"陷",zhs:"陷"},"随":{jp:"随",zht:"隨",zhs:"随"},"隠":{jp:"隠",zht:"隱",zhs:"隐"},"隷":{jp:"隷",zht:"隸",zhs:"隶"},"難":{jp:"難",zht:"難",zhs:"难"},"霧":{jp:"霧",zht:"霧",zhs:"雾"},"静":{jp:"静",zht:"靜",zhs:"静"},"頂":{jp:"頂",zht:"頂",zhs:"顶"},"項":{jp:"項",zht:"項",zhs:"项"},"順":{jp:"順",zht:"順",zhs:"顺"},"頑":{jp:"頑",zht:"頑",zhs:"顽"},"頒":{jp:"頒",zht:"頒",zhs:"颁"},"領":{jp:"領",zht:"領",zhs:"领"},"頻":{jp:"頻",zht:"頻",zhs:"频"},"題":{jp:"題",zht:"題",zhs:"题"},"額":{jp:"額",zht:"額",zhs:"额"},"顔":{jp:"顔",zht:"顏",zhs:"颜"},"風":{jp:"風",zht:"風",zhs:"风"},"飛":{jp:"飛",zht:"飛",zhs:"飞"},"飢":{jp:"飢",zht:"饑",zhs:"饥"},"飯":{jp:"飯",zht:"飯",zhs:"饭"},"飲":{jp:"飲",zht:"飲",zhs:"饮"},"飼":{jp:"飼",zht:"飼",zhs:"饲"},"飽":{jp:"飽",zht:"飽",zhs:"饱"},"飾":{jp:"飾",zht:"飾",zhs:"饰"},"餓":{jp:"餓",zht:"餓",zhs:"饿"},"馬":{jp:"馬",zht:"馬",zhs:"马"},"駅":{jp:"駅",zht:"驛",zhs:"驿"},"駆":{jp:"駆",zht:"驅",zhs:"驱"},"駐":{jp:"駐",zht:"駐",zhs:"驻"},"騎":{jp:"騎",zht:"騎",zhs:"骑"},"験":{jp:"験",zht:"驗",zhs:"验"},"騒":{jp:"騒",zht:"騷",zhs:"骚"},"騨":{jp:"騨",zht:"驔",zhs:"驔"},"髄":{jp:"髄",zht:"髓",zhs:"髓"},"魚":{jp:"魚",zht:"魚",zhs:"鱼"},"魯":{jp:"魯",zht:"魯",zhs:"鲁"},"鮮":{jp:"鮮",zht:"鮮",zhs:"鲜"},"鯨":{jp:"鯨",zht:"鯨",zhs:"鲸"},"鳥":{jp:"鳥",zht:"鳥",zhs:"鸟"},"鳴":{jp:"鳴",zht:"鳴",zhs:"鸣"},"麦":{jp:"麦",zht:"麥",zhs:"麦"},"黄":{jp:"黄",zht:"黃",zhs:"黄"},"黒":{jp:"黒",zht:"黑",zhs:"黑"},"黙":{jp:"黙",zht:"默",zhs:"默"},"齢":{jp:"齢",zht:"齡",zhs:"龄"}},zht:{"會":{jp:"会",zht:"會",zhs:"会"},"箋":{jp:"箋",zht:"箋",zhs:"笺"},"網":{jp:"網",zht:"網",zhs:"网"},"處":{jp:"処",zht:"處",zhs:"处"},"話":{jp:"話",zht:"話",zhs:"话"},"萬":{jp:"万",zht:"萬",zhs:"万"},"與":{jp:"与",zht:"與",zhs:"与"},"醜":{jp:"醜",zht:"醜",zhs:"丑"},"專":{jp:"専",zht:"專",zhs:"专"},"業":{jp:"業",zht:"業",zhs:"业"},"東":{jp:"東",zht:"東",zhs:"东"},"兩":{jp:"両",zht:"兩",zhs:"两"},"嚴":{jp:"厳",zht:"嚴",zhs:"严"},"並":{jp:"並",zht:"並",zhs:"并"},"喪":{jp:"喪",zht:"喪",zhs:"丧"},"豐":{jp:"豊",zht:"豐",zhs:"丰"},"臨":{jp:"臨",zht:"臨",zhs:"临"},"為":{jp:"為",zht:"為",zhs:"为"},"麗":{jp:"麗",zht:"麗",zhs:"丽"},"舉":{jp:"挙",zht:"舉",zhs:"举"},"迺":{jp:"廼",zht:"迺",zhs:"迺"},"義":{jp:"義",zht:"義",zhs:"义"},"樂":{jp:"楽",zht:"樂",zhs:"乐"},"乘":{jp:"乗",zht:"乘",zhs:"乘"},"習":{jp:"習",zht:"習",zhs:"习"},"鄉":{jp:"郷",zht:"鄉",zhs:"乡"},"書":{jp:"書",zht:"書",zhs:"书"},"買":{jp:"買",zht:"買",zhs:"买"},"亂":{jp:"乱",zht:"亂",zhs:"乱"},"龜":{jp:"亀",zht:"龜",zhs:"龟"},"貳":{jp:"弐",zht:"貳",zhs:"贰"},"雲":{jp:"雲",zht:"雲",zhs:"云"},"亞":{jp:"亜",zht:"亞",zhs:"亚"},"產":{jp:"産",zht:"產",zhs:"产"},"畝":{jp:"畝",zht:"畝",zhs:"亩"},"親":{jp:"親",zht:"親",zhs:"亲"},"億":{jp:"億",zht:"億",zhs:"亿"},"僕":{jp:"僕",zht:"僕",zhs:"仆"},"從":{jp:"従",zht:"從",zhs:"从"},"佛":{jp:"仏",zht:"佛",zhs:"佛"},"倉":{jp:"倉",zht:"倉",zhs:"仓"},"儀":{jp:"儀",zht:"儀",zhs:"仪"},"假":{jp:"仮",zht:"假",zhs:"假"},"價":{jp:"価",zht:"價",zhs:"价"},"眾":{jp:"衆",zht:"眾",zhs:"众"},"優":{jp:"優",zht:"優",zhs:"优"},"傳":{jp:"伝",zht:"傳",zhs:"传"},"傘":{jp:"傘",zht:"傘",zhs:"伞"},"偉":{jp:"偉",zht:"偉",zhs:"伟"},"傷":{jp:"傷",zht:"傷",zhs:"伤"},"倫":{jp:"倫",zht:"倫",zhs:"伦"},"偽":{jp:"偽",zht:"偽",zhs:"伪"},"體":{jp:"体",zht:"體",zhs:"体"},"餘":{jp:"余",zht:"餘",zhs:"余"},"來":{jp:"来",zht:"來",zhs:"来"},"偵":{jp:"偵",zht:"偵",zhs:"侦"},"側":{jp:"側",zht:"側",zhs:"侧"},"儉":{jp:"倹",zht:"儉",zhs:"俭"},"俱":{jp:"倶",zht:"俱",zhs:"俱"},"債":{jp:"債",zht:"債",zhs:"债"},"傾":{jp:"傾",zht:"傾",zhs:"倾"},"償":{jp:"償",zht:"償",zhs:"偿"},"傑":{jp:"傑",zht:"傑",zhs:"杰"},"備":{jp:"備",zht:"備",zhs:"备"},"當":{jp:"当",zht:"當",zhs:"当"},"盡":{jp:"尽",zht:"盡",zhs:"尽"},"兒":{jp:"児",zht:"兒",zhs:"儿"},"黨":{jp:"党",zht:"黨",zhs:"党"},"內":{jp:"内",zht:"內",zhs:"内"},"關":{jp:"関",zht:"關",zhs:"关"},"興":{jp:"興",zht:"興",zhs:"兴"},"養":{jp:"養",zht:"養",zhs:"养"},"獸":{jp:"獣",zht:"獸",zhs:"兽"},"圓":{jp:"円",zht:"圓",zhs:"圆"},"寫":{jp:"写",zht:"寫",zhs:"写"},"軍":{jp:"軍",zht:"軍",zhs:"军"},"農":{jp:"農",zht:"農",zhs:"农"},"富":{jp:"冨",zht:"富",zhs:"富"},"冰":{jp:"氷",zht:"冰",zhs:"冰"},"衝":{jp:"衝",zht:"衝",zhs:"冲"},"決":{jp:"決",zht:"決",zhs:"决"},"凍":{jp:"凍",zht:"凍",zhs:"冻"},"塗":{jp:"塗",zht:"塗",zhs:"涂"},"幾":{jp:"幾",zht:"幾",zhs:"几"},"擊":{jp:"撃",zht:"擊",zhs:"击"},"劃":{jp:"画",zht:"劃",zhs:"划"},"畫":{jp:"画",zht:"畫",zhs:"画"},"則":{jp:"則",zht:"則",zhs:"则"},"剛":{jp:"剛",zht:"剛",zhs:"刚"},"創":{jp:"創",zht:"創",zhs:"创"},"別":{jp:"別",zht:"別",zhs:"别"},"製":{jp:"製",zht:"製",zhs:"制"},"卷":{jp:"巻",zht:"卷",zhs:"卷"},"剎":{jp:"刹",zht:"剎",zhs:"刹"},"劑":{jp:"剤",zht:"劑",zhs:"剂"},"劍":{jp:"剣",zht:"劍",zhs:"剑"},"劇":{jp:"劇",zht:"劇",zhs:"剧"},"剩":{jp:"剰",zht:"剩",zhs:"剩"},"勸":{jp:"勧",zht:"勸",zhs:"劝"},"務":{jp:"務",zht:"務",zhs:"务"},"動":{jp:"動",zht:"動",zhs:"动"},"勵":{jp:"励",zht:"勵",zhs:"励"},"勞":{jp:"労",zht:"勞",zhs:"劳"},"勢":{jp:"勢",zht:"勢",zhs:"势"},"勳":{jp:"勲",zht:"勳",zhs:"勋"},"勝":{jp:"勝",zht:"勝",zhs:"胜"},"區":{jp:"区",zht:"區",zhs:"区"},"醫":{jp:"医",zht:"醫",zhs:"医"},"華":{jp:"華",zht:"華",zhs:"华"},"協":{jp:"協",zht:"協",zhs:"协"},"單":{jp:"単",zht:"單",zhs:"单"},"賣":{jp:"売",zht:"賣",zhs:"卖"},"衛":{jp:"衛",zht:"衛",zhs:"卫"},"廳":{jp:"庁",zht:"廳",zhs:"厅"},"壓":{jp:"圧",zht:"壓",zhs:"压"},"縣":{jp:"県",zht:"縣",zhs:"县"},"參":{jp:"参",zht:"參",zhs:"参"},"雙":{jp:"双",zht:"雙",zhs:"双"},"收":{jp:"収",zht:"收",zhs:"收"},"發":{jp:"発",zht:"發",zhs:"发"},"變":{jp:"変",zht:"變",zhs:"变"},"疊":{jp:"畳",zht:"疊",zhs:"叠"},"號":{jp:"号",zht:"號",zhs:"号"},"嘆":{jp:"嘆",zht:"嘆",zhs:"叹"},"嚇":{jp:"嚇",zht:"嚇",zhs:"吓"},"聽":{jp:"聴",zht:"聽",zhs:"听"},"啟":{jp:"啓",zht:"啟",zhs:"启"},"員":{jp:"員",zht:"員",zhs:"员"},"諮":{jp:"諮",zht:"諮",zhs:"谘"},"鹹":{jp:"鹹",zht:"鹹",zhs:"咸"},"響":{jp:"響",zht:"響",zhs:"响"},"問":{jp:"問",zht:"問",zhs:"问"},"營":{jp:"営",zht:"營",zhs:"营"},"噴":{jp:"噴",zht:"噴",zhs:"喷"},"囑":{jp:"嘱",zht:"囑",zhs:"嘱"},"蘇":{jp:"蘇",zht:"蘇",zhs:"苏"},"團":{jp:"団",zht:"團",zhs:"团"},"園":{jp:"園",zht:"園",zhs:"园"},"國":{jp:"国",zht:"國",zhs:"国"},"圍":{jp:"囲",zht:"圍",zhs:"围"},"圖":{jp:"図",zht:"圖",zhs:"图"},"圈":{jp:"圏",zht:"圈",zhs:"圈"},"聖":{jp:"聖",zht:"聖",zhs:"圣"},"場":{jp:"場",zht:"場",zhs:"场"},"壞":{jp:"壊",zht:"壞",zhs:"坏"},"塊":{jp:"塊",zht:"塊",zhs:"块"},"堅":{jp:"堅",zht:"堅",zhs:"坚"},"壇":{jp:"壇",zht:"壇",zhs:"坛"},"墳":{jp:"墳",zht:"墳",zhs:"坟"},"墜":{jp:"墜",zht:"墜",zhs:"坠"},"壘":{jp:"塁",zht:"壘",zhs:"垒"},"墾":{jp:"墾",zht:"墾",zhs:"垦"},"執":{jp:"執",zht:"執",zhs:"执"},"墮":{jp:"堕",zht:"墮",zhs:"堕"},"報":{jp:"報",zht:"報",zhs:"报"},"鹽":{jp:"塩",zht:"鹽",zhs:"盐"},"增":{jp:"増",zht:"增",zhs:"增"},"壤":{jp:"壌",zht:"壤",zhs:"壤"},"壯":{jp:"壮",zht:"壯",zhs:"壮"},"聲":{jp:"声",zht:"聲",zhs:"声"},"壹":{jp:"壱",zht:"壹",zhs:"壹"},"壽":{jp:"寿",zht:"壽",zhs:"寿"},"夢":{jp:"夢",zht:"夢",zhs:"梦"},"頭":{jp:"頭",zht:"頭",zhs:"头"},"誇":{jp:"誇",zht:"誇",zhs:"夸"},"奪":{jp:"奪",zht:"奪",zhs:"夺"},"奮":{jp:"奮",zht:"奮",zhs:"奋"},"獎":{jp:"奨",zht:"獎",zhs:"奖"},"妝":{jp:"粧",zht:"妝",zhs:"妆"},"婦":{jp:"婦",zht:"婦",zhs:"妇"},"姐":{jp:"姉",zht:"姐",zhs:"姐"},"姬":{jp:"姫",zht:"姬",zhs:"姬"},"孃":{jp:"嬢",zht:"孃",zhs:"娘"},"娛":{jp:"娯",zht:"娛",zhs:"娱"},"孫":{jp:"孫",zht:"孫",zhs:"孙"},"學":{jp:"学",zht:"學",zhs:"学"},"寧":{jp:"寧",zht:"寧",zhs:"宁"},"寶":{jp:"宝",zht:"寶",zhs:"宝"},"實":{jp:"実",zht:"實",zhs:"实"},"審":{jp:"審",zht:"審",zhs:"审"},"憲":{jp:"憲",zht:"憲",zhs:"宪"},"宮":{jp:"宮",zht:"宮",zhs:"宫"},"賓":{jp:"賓",zht:"賓",zhs:"宾"},"祕":{jp:"秘",zht:"祕",zhs:"秘"},"寢":{jp:"寝",zht:"寢",zhs:"寝"},"對":{jp:"対",zht:"對",zhs:"对"},"尋":{jp:"尋",zht:"尋",zhs:"寻"},"導":{jp:"導",zht:"導",zhs:"导"},"將":{jp:"将",zht:"將",zhs:"将"},"層":{jp:"層",zht:"層",zhs:"层"},"屬":{jp:"属",zht:"屬",zhs:"属"},"歲":{jp:"歳",zht:"歲",zhs:"岁"},"島":{jp:"島",zht:"島",zhs:"岛"},"巖":{jp:"巌",zht:"巖",zhs:"巖"},"峽":{jp:"峡",zht:"峽",zhs:"峡"},"險":{jp:"険",zht:"險",zhs:"险"},"幣":{jp:"幣",zht:"幣",zhs:"币"},"帥":{jp:"帥",zht:"帥",zhs:"帅"},"師":{jp:"師",zht:"師",zhs:"师"},"帳":{jp:"帳",zht:"帳",zhs:"帐"},"歸":{jp:"帰",zht:"歸",zhs:"归"},"廣":{jp:"広",zht:"廣",zhs:"广"},"慶":{jp:"慶",zht:"慶",zhs:"庆"},"庫":{jp:"庫",zht:"庫",zhs:"库"},"應":{jp:"応",zht:"應",zhs:"应"},"廢":{jp:"廃",zht:"廢",zhs:"废"},"開":{jp:"開",zht:"開",zhs:"开"},"辨":{jp:"弁",zht:"辨",zhs:"辨"},"瓣":{jp:"弁",zht:"瓣",zhs:"辨"},"辯":{jp:"弁",zht:"辯",zhs:"辨"},"異":{jp:"異",zht:"異",zhs:"异"},"棄":{jp:"棄",zht:"棄",zhs:"弃"},"張":{jp:"張",zht:"張",zhs:"张"},"彌":{jp:"弥",zht:"彌",zhs:"弥"},"強":{jp:"強",zht:"強",zhs:"强"},"彈":{jp:"弾",zht:"彈",zhs:"弹"},"錄":{jp:"録",zht:"錄",zhs:"录"},"彥":{jp:"彦",zht:"彥",zhs:"彥"},"徹":{jp:"徹",zht:"徹",zhs:"彻"},"徵":{jp:"徴",zht:"徵",zhs:"征"},"徑":{jp:"径",zht:"徑",zhs:"径"},"德":{jp:"徳",zht:"德",zhs:"德"},"憶":{jp:"憶",zht:"憶",zhs:"忆"},"誌":{jp:"誌",zht:"誌",zhs:"志"},"憂":{jp:"憂",zht:"憂",zhs:"忧"},"懷":{jp:"懐",zht:"懷",zhs:"怀"},"態":{jp:"態",zht:"態",zhs:"态"},"總":{jp:"総",zht:"總",zhs:"总"},"恆":{jp:"恒",zht:"恆",zhs:"恒"},"戀":{jp:"恋",zht:"戀",zhs:"恋"},"懇":{jp:"懇",zht:"懇",zhs:"恳"},"惠":{jp:"恵",zht:"惠",zhs:"惠"},"惡":{jp:"悪",zht:"惡",zhs:"恶"},"惱":{jp:"悩",zht:"惱",zhs:"恼"},"悅":{jp:"悦",zht:"悅",zhs:"悅"},"懸":{jp:"懸",zht:"懸",zhs:"悬"},"驚":{jp:"驚",zht:"驚",zhs:"惊"},"慘":{jp:"惨",zht:"慘",zhs:"惨"},"懲":{jp:"懲",zht:"懲",zhs:"惩"},"愛":{jp:"愛",zht:"愛",zhs:"爱"},"憤":{jp:"憤",zht:"憤",zhs:"愤"},"願":{jp:"願",zht:"願",zhs:"愿"},"慮":{jp:"慮",zht:"慮",zhs:"虑"},"戲":{jp:"戯",zht:"戲",zhs:"戏"},"戰":{jp:"戦",zht:"戰",zhs:"战"},"戶":{jp:"戸",zht:"戶",zhs:"户"},"拂":{jp:"払",zht:"拂",zhs:"拂"},"擴":{jp:"拡",zht:"擴",zhs:"扩"},"掃":{jp:"掃",zht:"掃",zhs:"扫"},"揚":{jp:"揚",zht:"揚",zhs:"扬"},"擇":{jp:"択",zht:"擇",zhs:"择"},"護":{jp:"護",zht:"護",zhs:"护"},"擔":{jp:"担",zht:"擔",zhs:"担"},"拜":{jp:"拝",zht:"拜",zhs:"拜"},"擬":{jp:"擬",zht:"擬",zhs:"拟"},"據":{jp:"拠",zht:"據",zhs:"据"},"擁":{jp:"擁",zht:"擁",zhs:"拥"},"挾":{jp:"挟",zht:"挾",zhs:"挟"},"揮":{jp:"揮",zht:"揮",zhs:"挥"},"插":{jp:"挿",zht:"插",zhs:"插"},"損":{jp:"損",zht:"損",zhs:"损"},"捨":{jp:"捨",zht:"捨",zhs:"舍"},"揭":{jp:"掲",zht:"揭",zhs:"揭"},"摑":{jp:"掴",zht:"摑",zhs:"掴"},"搖":{jp:"揺",zht:"搖",zhs:"摇"},"敵":{jp:"敵",zht:"敵",zhs:"敌"},"敗":{jp:"敗",zht:"敗",zhs:"败"},"數":{jp:"数",zht:"數",zhs:"数"},"齊":{jp:"斉",zht:"齊",zhs:"齐"},"齋":{jp:"斎",zht:"齋",zhs:"斋"},"斷":{jp:"断",zht:"斷",zhs:"断"},"舊":{jp:"旧",zht:"舊",zhs:"旧"},"時":{jp:"時",zht:"時",zhs:"时"},"曇":{jp:"曇",zht:"曇",zhs:"昙"},"晝":{jp:"昼",zht:"晝",zhs:"昼"},"顯":{jp:"顕",zht:"顯",zhs:"显"},"曉":{jp:"暁",zht:"曉",zhs:"晓"},"晚":{jp:"晩",zht:"晚",zhs:"晚"},"暫":{jp:"暫",zht:"暫",zhs:"暂"},"曾":{jp:"曽",zht:"曾",zhs:"曾"},"術":{jp:"術",zht:"術",zhs:"术"},"樸":{jp:"樸",zht:"樸",zhs:"朴"},"機":{jp:"機",zht:"機",zhs:"机"},"殺":{jp:"殺",zht:"殺",zhs:"杀"},"雜":{jp:"雑",zht:"雜",zhs:"杂"},"權":{jp:"権",zht:"權",zhs:"权"},"條":{jp:"条",zht:"條",zhs:"条"},"極":{jp:"極",zht:"極",zhs:"极"},"樞":{jp:"枢",zht:"樞",zhs:"枢"},"槍":{jp:"槍",zht:"槍",zhs:"枪"},"查":{jp:"査",zht:"查",zhs:"查"},"榮":{jp:"栄",zht:"榮",zhs:"荣"},"標":{jp:"標",zht:"標",zhs:"标"},"棧":{jp:"桟",zht:"棧",zhs:"栈"},"棟":{jp:"棟",zht:"棟",zhs:"栋"},"欄":{jp:"欄",zht:"欄",zhs:"栏"},"樹":{jp:"樹",zht:"樹",zhs:"树"},"樣":{jp:"様",zht:"樣",zhs:"样"},"櫻":{jp:"桜",zht:"櫻",zhs:"樱"},"橋":{jp:"橋",zht:"橋",zhs:"桥"},"檢":{jp:"検",zht:"檢",zhs:"检"},"樓":{jp:"楼",zht:"樓",zhs:"楼"},"歡":{jp:"歓",zht:"歡",zhs:"欢"},"歐":{jp:"欧",zht:"歐",zhs:"欧"},"步":{jp:"歩",zht:"步",zhs:"步"},"齒":{jp:"歯",zht:"齒",zhs:"齿"},"殘":{jp:"残",zht:"殘",zhs:"残"},"毆":{jp:"殴",zht:"毆",zhs:"殴"},"氣":{jp:"気",zht:"氣",zhs:"气"},"漢":{jp:"漢",zht:"漢",zhs:"汉"},"湯":{jp:"湯",zht:"湯",zhs:"汤"},"溝":{jp:"溝",zht:"溝",zhs:"沟"},"澤":{jp:"沢",zht:"澤",zhs:"泽"},"淚":{jp:"涙",zht:"淚",zhs:"泪"},"瀧":{jp:"滝",zht:"瀧",zhs:"泷"},"潔":{jp:"潔",zht:"潔",zhs:"洁"},"淺":{jp:"浅",zht:"淺",zhs:"浅"},"濁":{jp:"濁",zht:"濁",zhs:"浊"},"測":{jp:"測",zht:"測",zhs:"测"},"濟":{jp:"済",zht:"濟",zhs:"济"},"濃":{jp:"濃",zht:"濃",zhs:"浓"},"濱":{jp:"浜",zht:"濱",zhs:"滨"},"涉":{jp:"渋",zht:"涉",zhs:"涉"},"澀":{jp:"渋",zht:"澀",zhs:"涉"},"渦":{jp:"渦",zht:"渦",zhs:"涡"},"潤":{jp:"潤",zht:"潤",zhs:"润"},"漬":{jp:"漬",zht:"漬",zhs:"渍"},"漸":{jp:"漸",zht:"漸",zhs:"渐"},"溪":{jp:"渓",zht:"溪",zhs:"溪"},"漁":{jp:"漁",zht:"漁",zhs:"渔"},"灣":{jp:"湾",zht:"灣",zhs:"湾"},"濕":{jp:"湿",zht:"濕",zhs:"湿"},"滿":{jp:"満",zht:"滿",zhs:"满"},"滅":{jp:"滅",zht:"滅",zhs:"灭"},"滯":{jp:"滞",zht:"滯",zhs:"滞"},"濫":{jp:"濫",zht:"濫",zhs:"滥"},"瀨":{jp:"瀬",zht:"瀨",zhs:"濑"},"燈":{jp:"灯",zht:"燈",zhs:"灯"},"靈":{jp:"霊",zht:"靈",zhs:"灵"},"爐":{jp:"炉",zht:"爐",zhs:"炉"},"點":{jp:"点",zht:"點",zhs:"点"},"鍊":{jp:"錬",zht:"鍊",zhs:"炼"},"練":{jp:"練",zht:"練",zhs:"练"},"煙":{jp:"煙",zht:"煙",zhs:"烟"},"煩":{jp:"煩",zht:"煩",zhs:"烦"},"燒":{jp:"焼",zht:"燒",zhs:"烧"},"熱":{jp:"熱",zht:"熱",zhs:"热"},"焰":{jp:"焔",zht:"焰",zhs:"焰"},"鍛":{jp:"鍛",zht:"鍛",zhs:"锻"},"犧":{jp:"犠",zht:"犧",zhs:"牺"},"狀":{jp:"状",zht:"狀",zhs:"状"},"猶":{jp:"猶",zht:"猶",zhs:"犹"},"獨":{jp:"独",zht:"獨",zhs:"独"},"狹":{jp:"狭",zht:"狹",zhs:"狭"},"獄":{jp:"獄",zht:"獄",zhs:"狱"},"獵":{jp:"猟",zht:"獵",zhs:"猎"},"貓":{jp:"猫",zht:"貓",zhs:"猫"},"獻":{jp:"献",zht:"獻",zhs:"献"},"環":{jp:"環",zht:"環",zhs:"环"},"現":{jp:"現",zht:"現",zhs:"现"},"璽":{jp:"璽",zht:"璽",zhs:"玺"},"電":{jp:"電",zht:"電",zhs:"电"},"療":{jp:"療",zht:"療",zhs:"疗"},"監":{jp:"監",zht:"監",zhs:"监"},"蓋":{jp:"蓋",zht:"蓋",zhs:"盖"},"盤":{jp:"盤",zht:"盤",zhs:"盘"},"視":{jp:"視",zht:"視",zhs:"视"},"著":{jp:"着",zht:"著",zhs:"著"},"矯":{jp:"矯",zht:"矯",zhs:"矫"},"礦":{jp:"鉱",zht:"礦",zhs:"矿"},"碎":{jp:"砕",zht:"碎",zhs:"碎"},"礎":{jp:"礎",zht:"礎",zhs:"础"},"確":{jp:"確",zht:"確",zhs:"确"},"禮":{jp:"礼",zht:"禮",zhs:"礼"},"禍":{jp:"禍",zht:"禍",zhs:"祸"},"禪":{jp:"禅",zht:"禪",zhs:"禅"},"離":{jp:"離",zht:"離",zhs:"离"},"種":{jp:"種",zht:"種",zhs:"种"},"積":{jp:"積",zht:"積",zhs:"积"},"稱":{jp:"称",zht:"稱",zhs:"称"},"稻":{jp:"稲",zht:"稻",zhs:"稻"},"穩":{jp:"穏",zht:"穩",zhs:"稳"},"穀":{jp:"穀",zht:"穀",zhs:"谷"},"穗":{jp:"穂",zht:"穗",zhs:"穗"},"窮":{jp:"窮",zht:"窮",zhs:"穷"},"竊":{jp:"窃",zht:"竊",zhs:"窃"},"窗":{jp:"窓",zht:"窗",zhs:"窗"},"龍":{jp:"竜",zht:"龍",zhs:"龙"},"競":{jp:"競",zht:"競",zhs:"竞"},"篤":{jp:"篤",zht:"篤",zhs:"笃"},"筆":{jp:"筆",zht:"筆",zhs:"笔"},"築":{jp:"築",zht:"築",zhs:"筑"},"簡":{jp:"簡",zht:"簡",zhs:"简"},"節":{jp:"節",zht:"節",zhs:"节"},"範":{jp:"範",zht:"範",zhs:"范"},"類":{jp:"類",zht:"類",zhs:"类"},"粹":{jp:"粋",zht:"粹",zhs:"粹"},"肅":{jp:"粛",zht:"肅",zhs:"肃"},"糧":{jp:"糧",zht:"糧",zhs:"粮"},"糾":{jp:"糾",zht:"糾",zhs:"纠"},"紀":{jp:"紀",zht:"紀",zhs:"纪"},"約":{jp:"約",zht:"約",zhs:"约"},"紅":{jp:"紅",zht:"紅",zhs:"红"},"紋":{jp:"紋",zht:"紋",zhs:"纹"},"納":{jp:"納",zht:"納",zhs:"纳"},"純":{jp:"純",zht:"純",zhs:"纯"},"紙":{jp:"紙",zht:"紙",zhs:"纸"},"級":{jp:"級",zht:"級",zhs:"级"},"紛":{jp:"紛",zht:"紛",zhs:"纷"},"紡":{jp:"紡",zht:"紡",zhs:"纺"},"緊":{jp:"緊",zht:"緊",zhs:"紧"},"細":{jp:"細",zht:"細",zhs:"细"},"紳":{jp:"紳",zht:"紳",zhs:"绅"},"紹":{jp:"紹",zht:"紹",zhs:"绍"},"紺":{jp:"紺",zht:"紺",zhs:"绀"},"終":{jp:"終",zht:"終",zhs:"终"},"組":{jp:"組",zht:"組",zhs:"组"},"經":{jp:"経",zht:"經",zhs:"经"},"結":{jp:"結",zht:"結",zhs:"结"},"絕":{jp:"絶",zht:"絕",zhs:"绝"},"絞":{jp:"絞",zht:"絞",zhs:"绞"},"絡":{jp:"絡",zht:"絡",zhs:"络"},"給":{jp:"給",zht:"給",zhs:"给"},"統":{jp:"統",zht:"統",zhs:"统"},"繪":{jp:"絵",zht:"繪",zhs:"绘"},"絹":{jp:"絹",zht:"絹",zhs:"绢"},"繼":{jp:"継",zht:"繼",zhs:"继"},"續":{jp:"続",zht:"續",zhs:"续"},"綠":{jp:"緑",zht:"綠",zhs:"绿"},"線":{jp:"線",zht:"線",zhs:"线"},"維":{jp:"維",zht:"維",zhs:"维"},"綱":{jp:"綱",zht:"綱",zhs:"纲"},"綿":{jp:"綿",zht:"綿",zhs:"绵"},"緒":{jp:"緒",zht:"緒",zhs:"绪"},"締":{jp:"締",zht:"締",zhs:"缔"},"緣":{jp:"縁",zht:"緣",zhs:"缘"},"編":{jp:"編",zht:"編",zhs:"编"},"緩":{jp:"緩",zht:"緩",zhs:"缓"},"緯":{jp:"緯",zht:"緯",zhs:"纬"},"繩":{jp:"縄",zht:"繩",zhs:"绳"},"縛":{jp:"縛",zht:"縛",zhs:"缚"},"縱":{jp:"縦",zht:"縱",zhs:"纵"},"縫":{jp:"縫",zht:"縫",zhs:"缝"},"縮":{jp:"縮",zht:"縮",zhs:"缩"},"纖":{jp:"繊",zht:"纖",zhs:"纤"},"績":{jp:"績",zht:"績",zhs:"绩"},"織":{jp:"織",zht:"織",zhs:"织"},"繕":{jp:"繕",zht:"繕",zhs:"缮"},"繭":{jp:"繭",zht:"繭",zhs:"茧"},"繰":{jp:"繰",zht:"繰",zhs:"缲"},"罐":{jp:"缶",zht:"罐",zhs:"罐"},"鉢":{jp:"鉢",zht:"鉢",zhs:"钵"},"羅":{jp:"羅",zht:"羅",zhs:"罗"},"罰":{jp:"罸",zht:"罰",zhs:"罚"},"罷":{jp:"罷",zht:"罷",zhs:"罢"},"罵":{jp:"罵",zht:"罵",zhs:"骂"},"職":{jp:"職",zht:"職",zhs:"职"},"聞":{jp:"聞",zht:"聞",zhs:"闻"},"聰":{jp:"聡",zht:"聰",zhs:"聪"},"腸":{jp:"腸",zht:"腸",zhs:"肠"},"膚":{jp:"膚",zht:"膚",zhs:"肤"},"脹":{jp:"脹",zht:"脹",zhs:"胀"},"脅":{jp:"脅",zht:"脅",zhs:"胁"},"膽":{jp:"胆",zht:"膽",zhs:"胆"},"臟":{jp:"臓",zht:"臟",zhs:"脏"},"腦":{jp:"脳",zht:"腦",zhs:"脑"},"腳":{jp:"脚",zht:"腳",zhs:"脚"},"騰":{jp:"騰",zht:"騰",zhs:"腾"},"舖":{jp:"舗",zht:"舖",zhs:"铺"},"館":{jp:"館",zht:"館",zhs:"馆"},"艦":{jp:"艦",zht:"艦",zhs:"舰"},"藝":{jp:"芸",zht:"藝",zhs:"艺"},"莖":{jp:"茎",zht:"莖",zhs:"茎"},"薦":{jp:"薦",zht:"薦",zhs:"荐"},"藥":{jp:"薬",zht:"藥",zhs:"药"},"螢":{jp:"蛍",zht:"螢",zhs:"萤"},"蔣":{jp:"蒋",zht:"蔣",zhs:"蒋"},"藏":{jp:"蔵",zht:"藏",zhs:"藏"},"虜":{jp:"虜",zht:"虜",zhs:"虏"},"虛":{jp:"虚",zht:"虛",zhs:"虚"},"蟲":{jp:"虫",zht:"蟲",zhs:"虫"},"蝕":{jp:"蝕",zht:"蝕",zhs:"蚀"},"蠶":{jp:"蚕",zht:"蠶",zhs:"蚕"},"蠻":{jp:"蛮",zht:"蠻",zhs:"蛮"},"補":{jp:"補",zht:"補",zhs:"补"},"襲":{jp:"襲",zht:"襲",zhs:"袭"},"裝":{jp:"装",zht:"裝",zhs:"装"},"裡":{jp:"裏",zht:"裡",zhs:"里"},"霸":{jp:"覇",zht:"霸",zhs:"霸"},"見":{jp:"見",zht:"見",zhs:"见"},"觀":{jp:"観",zht:"觀",zhs:"观"},"規":{jp:"規",zht:"規",zhs:"规"},"覺":{jp:"覚",zht:"覺",zhs:"觉"},"覽":{jp:"覧",zht:"覽",zhs:"览"},"觸":{jp:"触",zht:"觸",zhs:"触"},"訂":{jp:"訂",zht:"訂",zhs:"订"},"計":{jp:"計",zht:"計",zhs:"计"},"討":{jp:"討",zht:"討",zhs:"讨"},"訓":{jp:"訓",zht:"訓",zhs:"训"},"記":{jp:"記",zht:"記",zhs:"记"},"訟":{jp:"訟",zht:"訟",zhs:"讼"},"訪":{jp:"訪",zht:"訪",zhs:"访"},"設":{jp:"設",zht:"設",zhs:"设"},"許":{jp:"許",zht:"許",zhs:"许"},"譯":{jp:"訳",zht:"譯",zhs:"译"},"訴":{jp:"訴",zht:"訴",zhs:"诉"},"診":{jp:"診",zht:"診",zhs:"诊"},"證":{jp:"証",zht:"證",zhs:"证"},"詐":{jp:"詐",zht:"詐",zhs:"诈"},"詔":{jp:"詔",zht:"詔",zhs:"诏"},"評":{jp:"評",zht:"評",zhs:"评"},"詛":{jp:"詛",zht:"詛",zhs:"诅"},"詞":{jp:"詞",zht:"詞",zhs:"词"},"試":{jp:"試",zht:"試",zhs:"试"},"詩":{jp:"詩",zht:"詩",zhs:"诗"},"詰":{jp:"詰",zht:"詰",zhs:"诘"},"該":{jp:"該",zht:"該",zhs:"该"},"詳":{jp:"詳",zht:"詳",zhs:"详"},"譽":{jp:"誉",zht:"譽",zhs:"誉"},"謄":{jp:"謄",zht:"謄",zhs:"誊"},"認":{jp:"認",zht:"認",zhs:"认"},"誕":{jp:"誕",zht:"誕",zhs:"诞"},"誘":{jp:"誘",zht:"誘",zhs:"诱"},"語":{jp:"語",zht:"語",zhs:"语"},"誠":{jp:"誠",zht:"誠",zhs:"诚"},"誤":{jp:"誤",zht:"誤",zhs:"误"},"說":{jp:"説",zht:"說",zhs:"说"},"讀":{jp:"読",zht:"讀",zhs:"读"},"誰":{jp:"誰",zht:"誰",zhs:"谁"},"課":{jp:"課",zht:"課",zhs:"课"},"調":{jp:"調",zht:"調",zhs:"调"},"談":{jp:"談",zht:"談",zhs:"谈"},"請":{jp:"請",zht:"請",zhs:"请"},"論":{jp:"論",zht:"論",zhs:"论"},"諭":{jp:"諭",zht:"諭",zhs:"谕"},"諸":{jp:"諸",zht:"諸",zhs:"诸"},"諾":{jp:"諾",zht:"諾",zhs:"诺"},"謀":{jp:"謀",zht:"謀",zhs:"谋"},"謁":{jp:"謁",zht:"謁",zhs:"谒"},"謎":{jp:"謎",zht:"謎",zhs:"谜"},"謙":{jp:"謙",zht:"謙",zhs:"谦"},"講":{jp:"講",zht:"講",zhs:"讲"},"謝":{jp:"謝",zht:"謝",zhs:"谢"},"謠":{jp:"謡",zht:"謠",zhs:"谣"},"謹":{jp:"謹",zht:"謹",zhs:"谨"},"識":{jp:"識",zht:"識",zhs:"识"},"譜":{jp:"譜",zht:"譜",zhs:"谱"},"議":{jp:"議",zht:"議",zhs:"议"},"讓":{jp:"譲",zht:"讓",zhs:"让"},"貝":{jp:"貝",zht:"貝",zhs:"贝"},"貞":{jp:"貞",zht:"貞",zhs:"贞"},"負":{jp:"負",zht:"負",zhs:"负"},"財":{jp:"財",zht:"財",zhs:"财"},"貢":{jp:"貢",zht:"貢",zhs:"贡"},"貧":{jp:"貧",zht:"貧",zhs:"贫"},"貨":{jp:"貨",zht:"貨",zhs:"货"},"販":{jp:"販",zht:"販",zhs:"贩"},"貪":{jp:"貪",zht:"貪",zhs:"贪"},"責":{jp:"責",zht:"責",zhs:"责"},"貯":{jp:"貯",zht:"貯",zhs:"贮"},"貴":{jp:"貴",zht:"貴",zhs:"贵"},"貸":{jp:"貸",zht:"貸",zhs:"贷"},"費":{jp:"費",zht:"費",zhs:"费"},"貿":{jp:"貿",zht:"貿",zhs:"贸"},"賀":{jp:"賀",zht:"賀",zhs:"贺"},"賃":{jp:"賃",zht:"賃",zhs:"赁"},"賄":{jp:"賄",zht:"賄",zhs:"贿"},"資":{jp:"資",zht:"資",zhs:"资"},"賊":{jp:"賊",zht:"賊",zhs:"贼"},"賤":{jp:"賎",zht:"賤",zhs:"贱"},"贊":{jp:"賛",zht:"贊",zhs:"赞"},"賜":{jp:"賜",zht:"賜",zhs:"赐"},"賞":{jp:"賞",zht:"賞",zhs:"赏"},"賠":{jp:"賠",zht:"賠",zhs:"赔"},"賢":{jp:"賢",zht:"賢",zhs:"贤"},"賦":{jp:"賦",zht:"賦",zhs:"赋"},"質":{jp:"質",zht:"質",zhs:"质"},"賴":{jp:"頼",zht:"賴",zhs:"赖"},"贈":{jp:"贈",zht:"贈",zhs:"赠"},"贓":{jp:"贓",zht:"贓",zhs:"赃"},"躍":{jp:"躍",zht:"躍",zhs:"跃"},"踐":{jp:"践",zht:"踐",zhs:"践"},"蹤":{jp:"踪",zht:"蹤",zhs:"踪"},"車":{jp:"車",zht:"車",zhs:"车"},"軌":{jp:"軌",zht:"軌",zhs:"轨"},"軒":{jp:"軒",zht:"軒",zhs:"轩"},"軟":{jp:"軟",zht:"軟",zhs:"软"},"轉":{jp:"転",zht:"轉",zhs:"转"},"軸":{jp:"軸",zht:"軸",zhs:"轴"},"輕":{jp:"軽",zht:"輕",zhs:"轻"},"較":{jp:"較",zht:"較",zhs:"较"},"載":{jp:"載",zht:"載",zhs:"载"},"輝":{jp:"輝",zht:"輝",zhs:"辉"},"輩":{jp:"輩",zht:"輩",zhs:"辈"},"輪":{jp:"輪",zht:"輪",zhs:"轮"},"輸":{jp:"輸",zht:"輸",zhs:"输"},"轄":{jp:"轄",zht:"轄",zhs:"辖"},"辭":{jp:"辞",zht:"辭",zhs:"辞"},"邊":{jp:"辺",zht:"邊",zhs:"边"},"達":{jp:"達",zht:"達",zhs:"达"},"遷":{jp:"遷",zht:"遷",zhs:"迁"},"過":{jp:"過",zht:"過",zhs:"过"},"運":{jp:"運",zht:"運",zhs:"运"},"還":{jp:"還",zht:"還",zhs:"还"},"進":{jp:"進",zht:"進",zhs:"进"},"遠":{jp:"遠",zht:"遠",zhs:"远"},"違":{jp:"違",zht:"違",zhs:"违"},"連":{jp:"連",zht:"連",zhs:"连"},"遲":{jp:"遅",zht:"遲",zhs:"迟"},"適":{jp:"適",zht:"適",zhs:"适"},"選":{jp:"選",zht:"選",zhs:"选"},"遞":{jp:"逓",zht:"遞",zhs:"递"},"遺":{jp:"遺",zht:"遺",zhs:"遗"},"遙":{jp:"遥",zht:"遙",zhs:"遥"},"郵":{jp:"郵",zht:"郵",zhs:"邮"},"鄰":{jp:"隣",zht:"鄰",zhs:"邻"},"醉":{jp:"酔",zht:"醉",zhs:"醉"},"釀":{jp:"醸",zht:"釀",zhs:"酿"},"釋":{jp:"釈",zht:"釋",zhs:"释"},"針":{jp:"針",zht:"針",zhs:"针"},"釣":{jp:"釣",zht:"釣",zhs:"钓"},"鈍":{jp:"鈍",zht:"鈍",zhs:"钝"},"鈴":{jp:"鈴",zht:"鈴",zhs:"铃"},"鐵":{jp:"鉄",zht:"鐵",zhs:"铁"},"鉛":{jp:"鉛",zht:"鉛",zhs:"铅"},"鑑":{jp:"鑑",zht:"鑑",zhs:"鉴"},"銀":{jp:"銀",zht:"銀",zhs:"银"},"銃":{jp:"銃",zht:"銃",zhs:"铳"},"銅":{jp:"銅",zht:"銅",zhs:"铜"},"銑":{jp:"銑",zht:"銑",zhs:"铣"},"銘":{jp:"銘",zht:"銘",zhs:"铭"},"錢":{jp:"銭",zht:"錢",zhs:"钱"},"鋭":{jp:"鋭",zht:"鋭",zhs:"锐"},"鑄":{jp:"鋳",zht:"鑄",zhs:"铸"},"鋼":{jp:"鋼",zht:"鋼",zhs:"钢"},"錘":{jp:"錘",zht:"錘",zhs:"锤"},"錠":{jp:"錠",zht:"錠",zhs:"锭"},"錯":{jp:"錯",zht:"錯",zhs:"错"},"鍾":{jp:"鍾",zht:"鍾",zhs:"钟"},"鎖":{jp:"鎖",zht:"鎖",zhs:"锁"},"鎮":{jp:"鎮",zht:"鎮",zhs:"镇"},"鏡":{jp:"鏡",zht:"鏡",zhs:"镜"},"長":{jp:"長",zht:"長",zhs:"长"},"門":{jp:"門",zht:"門",zhs:"门"},"閉":{jp:"閉",zht:"閉",zhs:"闭"},"閒":{jp:"閑",zht:"閒",zhs:"闲"},"間":{jp:"間",zht:"間",zhs:"间"},"閣":{jp:"閣",zht:"閣",zhs:"阁"},"閥":{jp:"閥",zht:"閥",zhs:"阀"},"閲":{jp:"閲",zht:"閲",zhs:"阅"},"隊":{jp:"隊",zht:"隊",zhs:"队"},"陽":{jp:"陽",zht:"陽",zhs:"阳"},"陰":{jp:"陰",zht:"陰",zhs:"阴"},"陣":{jp:"陣",zht:"陣",zhs:"阵"},"階":{jp:"階",zht:"階",zhs:"阶"},"際":{jp:"際",zht:"際",zhs:"际"},"陸":{jp:"陸",zht:"陸",zhs:"陆"},"陳":{jp:"陳",zht:"陳",zhs:"陈"},"陷":{jp:"陥",zht:"陷",zhs:"陷"},"隨":{jp:"随",zht:"隨",zhs:"随"},"隱":{jp:"隠",zht:"隱",zhs:"隐"},"隸":{jp:"隷",zht:"隸",zhs:"隶"},"難":{jp:"難",zht:"難",zhs:"难"},"霧":{jp:"霧",zht:"霧",zhs:"雾"},"靜":{jp:"静",zht:"靜",zhs:"静"},"頂":{jp:"頂",zht:"頂",zhs:"顶"},"項":{jp:"項",zht:"項",zhs:"项"},"順":{jp:"順",zht:"順",zhs:"顺"},"頑":{jp:"頑",zht:"頑",zhs:"顽"},"頒":{jp:"頒",zht:"頒",zhs:"颁"},"領":{jp:"領",zht:"領",zhs:"领"},"頻":{jp:"頻",zht:"頻",zhs:"频"},"題":{jp:"題",zht:"題",zhs:"题"},"額":{jp:"額",zht:"額",zhs:"额"},"顏":{jp:"顔",zht:"顏",zhs:"颜"},"風":{jp:"風",zht:"風",zhs:"风"},"飛":{jp:"飛",zht:"飛",zhs:"飞"},"饑":{jp:"飢",zht:"饑",zhs:"饥"},"飯":{jp:"飯",zht:"飯",zhs:"饭"},"飲":{jp:"飲",zht:"飲",zhs:"饮"},"飼":{jp:"飼",zht:"飼",zhs:"饲"},"飽":{jp:"飽",zht:"飽",zhs:"饱"},"飾":{jp:"飾",zht:"飾",zhs:"饰"},"餓":{jp:"餓",zht:"餓",zhs:"饿"},"馬":{jp:"馬",zht:"馬",zhs:"马"},"驛":{jp:"駅",zht:"驛",zhs:"驿"},"驅":{jp:"駆",zht:"驅",zhs:"驱"},"駐":{jp:"駐",zht:"駐",zhs:"驻"},"騎":{jp:"騎",zht:"騎",zhs:"骑"},"驗":{jp:"験",zht:"驗",zhs:"验"},"騷":{jp:"騒",zht:"騷",zhs:"骚"},"驔":{jp:"騨",zht:"驔",zhs:"驔"},"髓":{jp:"髄",zht:"髓",zhs:"髓"},"魚":{jp:"魚",zht:"魚",zhs:"鱼"},"魯":{jp:"魯",zht:"魯",zhs:"鲁"},"鮮":{jp:"鮮",zht:"鮮",zhs:"鲜"},"鯨":{jp:"鯨",zht:"鯨",zhs:"鲸"},"鳥":{jp:"鳥",zht:"鳥",zhs:"鸟"},"鳴":{jp:"鳴",zht:"鳴",zhs:"鸣"},"麥":{jp:"麦",zht:"麥",zhs:"麦"},"黃":{jp:"黄",zht:"黃",zhs:"黄"},"黑":{jp:"黒",zht:"黑",zhs:"黑"},"默":{jp:"黙",zht:"默",zhs:"默"},"齡":{jp:"齢",zht:"齡",zhs:"龄"}},zhs:{"会":{jp:"会",zht:"會",zhs:"会"},"笺":{jp:"箋",zht:"箋",zhs:"笺"},"网":{jp:"網",zht:"網",zhs:"网"},"处":{jp:"処",zht:"處",zhs:"处"},"话":{jp:"話",zht:"話",zhs:"话"},"万":{jp:"万",zht:"萬",zhs:"万"},"与":{jp:"与",zht:"與",zhs:"与"},"丑":{jp:"醜",zht:"醜",zhs:"丑"},"专":{jp:"専",zht:"專",zhs:"专"},"业":{jp:"業",zht:"業",zhs:"业"},"东":{jp:"東",zht:"東",zhs:"东"},"两":{jp:"両",zht:"兩",zhs:"两"},"严":{jp:"厳",zht:"嚴",zhs:"严"},"并":{jp:"並",zht:"並",zhs:"并"},"丧":{jp:"喪",zht:"喪",zhs:"丧"},"丰":{jp:"豊",zht:"豐",zhs:"丰"},"临":{jp:"臨",zht:"臨",zhs:"临"},"为":{jp:"為",zht:"為",zhs:"为"},"丽":{jp:"麗",zht:"麗",zhs:"丽"},"举":{jp:"挙",zht:"舉",zhs:"举"},"迺":{jp:"廼",zht:"迺",zhs:"迺"},"义":{jp:"義",zht:"義",zhs:"义"},"乐":{jp:"楽",zht:"樂",zhs:"乐"},"乘":{jp:"乗",zht:"乘",zhs:"乘"},"习":{jp:"習",zht:"習",zhs:"习"},"乡":{jp:"郷",zht:"鄉",zhs:"乡"},"书":{jp:"書",zht:"書",zhs:"书"},"买":{jp:"買",zht:"買",zhs:"买"},"乱":{jp:"乱",zht:"亂",zhs:"乱"},"龟":{jp:"亀",zht:"龜",zhs:"龟"},"贰":{jp:"弐",zht:"貳",zhs:"贰"},"云":{jp:"雲",zht:"雲",zhs:"云"},"亚":{jp:"亜",zht:"亞",zhs:"亚"},"产":{jp:"産",zht:"產",zhs:"产"},"亩":{jp:"畝",zht:"畝",zhs:"亩"},"亲":{jp:"親",zht:"親",zhs:"亲"},"亿":{jp:"億",zht:"億",zhs:"亿"},"仆":{jp:"僕",zht:"僕",zhs:"仆"},"从":{jp:"従",zht:"從",zhs:"从"},"佛":{jp:"仏",zht:"佛",zhs:"佛"},"仓":{jp:"倉",zht:"倉",zhs:"仓"},"仪":{jp:"儀",zht:"儀",zhs:"仪"},"假":{jp:"仮",zht:"假",zhs:"假"},"价":{jp:"価",zht:"價",zhs:"价"},"众":{jp:"衆",zht:"眾",zhs:"众"},"优":{jp:"優",zht:"優",zhs:"优"},"传":{jp:"伝",zht:"傳",zhs:"传"},"伞":{jp:"傘",zht:"傘",zhs:"伞"},"伟":{jp:"偉",zht:"偉",zhs:"伟"},"伤":{jp:"傷",zht:"傷",zhs:"伤"},"伦":{jp:"倫",zht:"倫",zhs:"伦"},"伪":{jp:"偽",zht:"偽",zhs:"伪"},"体":{jp:"体",zht:"體",zhs:"体"},"余":{jp:"余",zht:"餘",zhs:"余"},"来":{jp:"来",zht:"來",zhs:"来"},"侦":{jp:"偵",zht:"偵",zhs:"侦"},"侧":{jp:"側",zht:"側",zhs:"侧"},"俭":{jp:"倹",zht:"儉",zhs:"俭"},"俱":{jp:"倶",zht:"俱",zhs:"俱"},"债":{jp:"債",zht:"債",zhs:"债"},"倾":{jp:"傾",zht:"傾",zhs:"倾"},"偿":{jp:"償",zht:"償",zhs:"偿"},"杰":{jp:"傑",zht:"傑",zhs:"杰"},"备":{jp:"備",zht:"備",zhs:"备"},"当":{jp:"当",zht:"當",zhs:"当"},"尽":{jp:"尽",zht:"盡",zhs:"尽"},"儿":{jp:"児",zht:"兒",zhs:"儿"},"党":{jp:"党",zht:"黨",zhs:"党"},"内":{jp:"内",zht:"內",zhs:"内"},"关":{jp:"関",zht:"關",zhs:"关"},"兴":{jp:"興",zht:"興",zhs:"兴"},"养":{jp:"養",zht:"養",zhs:"养"},"兽":{jp:"獣",zht:"獸",zhs:"兽"},"圆":{jp:"円",zht:"圓",zhs:"圆"},"写":{jp:"写",zht:"寫",zhs:"写"},"军":{jp:"軍",zht:"軍",zhs:"军"},"农":{jp:"農",zht:"農",zhs:"农"},"富":{jp:"冨",zht:"富",zhs:"富"},"冰":{jp:"氷",zht:"冰",zhs:"冰"},"冲":{jp:"衝",zht:"衝",zhs:"冲"},"决":{jp:"決",zht:"決",zhs:"决"},"冻":{jp:"凍",zht:"凍",zhs:"冻"},"涂":{jp:"塗",zht:"塗",zhs:"涂"},"几":{jp:"幾",zht:"幾",zhs:"几"},"击":{jp:"撃",zht:"擊",zhs:"击"},"划":{jp:"画",zht:"劃",zhs:"划"},"画":{jp:"画",zht:"畫",zhs:"画"},"则":{jp:"則",zht:"則",zhs:"则"},"刚":{jp:"剛",zht:"剛",zhs:"刚"},"创":{jp:"創",zht:"創",zhs:"创"},"别":{jp:"別",zht:"別",zhs:"别"},"制":{jp:"製",zht:"製",zhs:"制"},"卷":{jp:"巻",zht:"卷",zhs:"卷"},"刹":{jp:"刹",zht:"剎",zhs:"刹"},"剂":{jp:"剤",zht:"劑",zhs:"剂"},"剑":{jp:"剣",zht:"劍",zhs:"剑"},"剧":{jp:"劇",zht:"劇",zhs:"剧"},"剩":{jp:"剰",zht:"剩",zhs:"剩"},"劝":{jp:"勧",zht:"勸",zhs:"劝"},"务":{jp:"務",zht:"務",zhs:"务"},"动":{jp:"動",zht:"動",zhs:"动"},"励":{jp:"励",zht:"勵",zhs:"励"},"劳":{jp:"労",zht:"勞",zhs:"劳"},"势":{jp:"勢",zht:"勢",zhs:"势"},"勋":{jp:"勲",zht:"勳",zhs:"勋"},"胜":{jp:"勝",zht:"勝",zhs:"胜"},"区":{jp:"区",zht:"區",zhs:"区"},"医":{jp:"医",zht:"醫",zhs:"医"},"华":{jp:"華",zht:"華",zhs:"华"},"协":{jp:"協",zht:"協",zhs:"协"},"单":{jp:"単",zht:"單",zhs:"单"},"卖":{jp:"売",zht:"賣",zhs:"卖"},"卫":{jp:"衛",zht:"衛",zhs:"卫"},"厅":{jp:"庁",zht:"廳",zhs:"厅"},"压":{jp:"圧",zht:"壓",zhs:"压"},"县":{jp:"県",zht:"縣",zhs:"县"},"参":{jp:"参",zht:"參",zhs:"参"},"双":{jp:"双",zht:"雙",zhs:"双"},"收":{jp:"収",zht:"收",zhs:"收"},"发":{jp:"発",zht:"發",zhs:"发"},"变":{jp:"変",zht:"變",zhs:"变"},"叠":{jp:"畳",zht:"疊",zhs:"叠"},"号":{jp:"号",zht:"號",zhs:"号"},"叹":{jp:"嘆",zht:"嘆",zhs:"叹"},"吓":{jp:"嚇",zht:"嚇",zhs:"吓"},"听":{jp:"聴",zht:"聽",zhs:"听"},"启":{jp:"啓",zht:"啟",zhs:"启"},"员":{jp:"員",zht:"員",zhs:"员"},"谘":{jp:"諮",zht:"諮",zhs:"谘"},"咸":{jp:"鹹",zht:"鹹",zhs:"咸"},"响":{jp:"響",zht:"響",zhs:"响"},"问":{jp:"問",zht:"問",zhs:"问"},"营":{jp:"営",zht:"營",zhs:"营"},"喷":{jp:"噴",zht:"噴",zhs:"喷"},"嘱":{jp:"嘱",zht:"囑",zhs:"嘱"},"苏":{jp:"蘇",zht:"蘇",zhs:"苏"},"团":{jp:"団",zht:"團",zhs:"团"},"园":{jp:"園",zht:"園",zhs:"园"},"国":{jp:"国",zht:"國",zhs:"国"},"围":{jp:"囲",zht:"圍",zhs:"围"},"图":{jp:"図",zht:"圖",zhs:"图"},"圈":{jp:"圏",zht:"圈",zhs:"圈"},"圣":{jp:"聖",zht:"聖",zhs:"圣"},"场":{jp:"場",zht:"場",zhs:"场"},"坏":{jp:"壊",zht:"壞",zhs:"坏"},"块":{jp:"塊",zht:"塊",zhs:"块"},"坚":{jp:"堅",zht:"堅",zhs:"坚"},"坛":{jp:"壇",zht:"壇",zhs:"坛"},"坟":{jp:"墳",zht:"墳",zhs:"坟"},"坠":{jp:"墜",zht:"墜",zhs:"坠"},"垒":{jp:"塁",zht:"壘",zhs:"垒"},"垦":{jp:"墾",zht:"墾",zhs:"垦"},"执":{jp:"執",zht:"執",zhs:"执"},"堕":{jp:"堕",zht:"墮",zhs:"堕"},"报":{jp:"報",zht:"報",zhs:"报"},"盐":{jp:"塩",zht:"鹽",zhs:"盐"},"增":{jp:"増",zht:"增",zhs:"增"},"壤":{jp:"壌",zht:"壤",zhs:"壤"},"壮":{jp:"壮",zht:"壯",zhs:"壮"},"声":{jp:"声",zht:"聲",zhs:"声"},"壹":{jp:"壱",zht:"壹",zhs:"壹"},"寿":{jp:"寿",zht:"壽",zhs:"寿"},"梦":{jp:"夢",zht:"夢",zhs:"梦"},"头":{jp:"頭",zht:"頭",zhs:"头"},"夸":{jp:"誇",zht:"誇",zhs:"夸"},"夺":{jp:"奪",zht:"奪",zhs:"夺"},"奋":{jp:"奮",zht:"奮",zhs:"奋"},"奖":{jp:"奨",zht:"獎",zhs:"奖"},"妆":{jp:"粧",zht:"妝",zhs:"妆"},"妇":{jp:"婦",zht:"婦",zhs:"妇"},"姐":{jp:"姉",zht:"姐",zhs:"姐"},"姬":{jp:"姫",zht:"姬",zhs:"姬"},"娘":{jp:"嬢",zht:"孃",zhs:"娘"},"娱":{jp:"娯",zht:"娛",zhs:"娱"},"孙":{jp:"孫",zht:"孫",zhs:"孙"},"学":{jp:"学",zht:"學",zhs:"学"},"宁":{jp:"寧",zht:"寧",zhs:"宁"},"宝":{jp:"宝",zht:"寶",zhs:"宝"},"实":{jp:"実",zht:"實",zhs:"实"},"审":{jp:"審",zht:"審",zhs:"审"},"宪":{jp:"憲",zht:"憲",zhs:"宪"},"宫":{jp:"宮",zht:"宮",zhs:"宫"},"宾":{jp:"賓",zht:"賓",zhs:"宾"},"秘":{jp:"秘",zht:"祕",zhs:"秘"},"寝":{jp:"寝",zht:"寢",zhs:"寝"},"对":{jp:"対",zht:"對",zhs:"对"},"寻":{jp:"尋",zht:"尋",zhs:"寻"},"导":{jp:"導",zht:"導",zhs:"导"},"将":{jp:"将",zht:"將",zhs:"将"},"层":{jp:"層",zht:"層",zhs:"层"},"属":{jp:"属",zht:"屬",zhs:"属"},"岁":{jp:"歳",zht:"歲",zhs:"岁"},"岛":{jp:"島",zht:"島",zhs:"岛"},"巖":{jp:"巌",zht:"巖",zhs:"巖"},"峡":{jp:"峡",zht:"峽",zhs:"峡"},"险":{jp:"険",zht:"險",zhs:"险"},"币":{jp:"幣",zht:"幣",zhs:"币"},"帅":{jp:"帥",zht:"帥",zhs:"帅"},"师":{jp:"師",zht:"師",zhs:"师"},"帐":{jp:"帳",zht:"帳",zhs:"帐"},"归":{jp:"帰",zht:"歸",zhs:"归"},"广":{jp:"広",zht:"廣",zhs:"广"},"庆":{jp:"慶",zht:"慶",zhs:"庆"},"库":{jp:"庫",zht:"庫",zhs:"库"},"应":{jp:"応",zht:"應",zhs:"应"},"废":{jp:"廃",zht:"廢",zhs:"废"},"开":{jp:"開",zht:"開",zhs:"开"},"辨":{jp:"弁",zht:"辨",zhs:"辨"},"瓣":{jp:"弁",zht:"辨",zhs:"瓣"},"辩":{jp:"弁",zht:"辨",zhs:"辩"},"异":{jp:"異",zht:"異",zhs:"异"},"弃":{jp:"棄",zht:"棄",zhs:"弃"},"张":{jp:"張",zht:"張",zhs:"张"},"弥":{jp:"弥",zht:"彌",zhs:"弥"},"强":{jp:"強",zht:"強",zhs:"强"},"弹":{jp:"弾",zht:"彈",zhs:"弹"},"录":{jp:"録",zht:"錄",zhs:"录"},"彥":{jp:"彦",zht:"彥",zhs:"彥"},"彻":{jp:"徹",zht:"徹",zhs:"彻"},"征":{jp:"徴",zht:"徵",zhs:"征"},"径":{jp:"径",zht:"徑",zhs:"径"},"德":{jp:"徳",zht:"德",zhs:"德"},"忆":{jp:"憶",zht:"憶",zhs:"忆"},"志":{jp:"誌",zht:"誌",zhs:"志"},"忧":{jp:"憂",zht:"憂",zhs:"忧"},"怀":{jp:"懐",zht:"懷",zhs:"怀"},"态":{jp:"態",zht:"態",zhs:"态"},"总":{jp:"総",zht:"總",zhs:"总"},"恒":{jp:"恒",zht:"恆",zhs:"恒"},"恋":{jp:"恋",zht:"戀",zhs:"恋"},"恳":{jp:"懇",zht:"懇",zhs:"恳"},"惠":{jp:"恵",zht:"惠",zhs:"惠"},"恶":{jp:"悪",zht:"惡",zhs:"恶"},"恼":{jp:"悩",zht:"惱",zhs:"恼"},"悅":{jp:"悦",zht:"悅",zhs:"悅"},"悬":{jp:"懸",zht:"懸",zhs:"悬"},"惊":{jp:"驚",zht:"驚",zhs:"惊"},"惨":{jp:"惨",zht:"慘",zhs:"惨"},"惩":{jp:"懲",zht:"懲",zhs:"惩"},"爱":{jp:"愛",zht:"愛",zhs:"爱"},"愤":{jp:"憤",zht:"憤",zhs:"愤"},"愿":{jp:"願",zht:"願",zhs:"愿"},"虑":{jp:"慮",zht:"慮",zhs:"虑"},"戏":{jp:"戯",zht:"戲",zhs:"戏"},"战":{jp:"戦",zht:"戰",zhs:"战"},"户":{jp:"戸",zht:"戶",zhs:"户"},"拂":{jp:"払",zht:"拂",zhs:"拂"},"扩":{jp:"拡",zht:"擴",zhs:"扩"},"扫":{jp:"掃",zht:"掃",zhs:"扫"},"扬":{jp:"揚",zht:"揚",zhs:"扬"},"择":{jp:"択",zht:"擇",zhs:"择"},"护":{jp:"護",zht:"護",zhs:"护"},"担":{jp:"担",zht:"擔",zhs:"担"},"拜":{jp:"拝",zht:"拜",zhs:"拜"},"拟":{jp:"擬",zht:"擬",zhs:"拟"},"据":{jp:"拠",zht:"據",zhs:"据"},"拥":{jp:"擁",zht:"擁",zhs:"拥"},"挟":{jp:"挟",zht:"挾",zhs:"挟"},"挥":{jp:"揮",zht:"揮",zhs:"挥"},"插":{jp:"挿",zht:"插",zhs:"插"},"损":{jp:"損",zht:"損",zhs:"损"},"舍":{jp:"捨",zht:"捨",zhs:"舍"},"揭":{jp:"掲",zht:"揭",zhs:"揭"},"掴":{jp:"掴",zht:"摑",zhs:"掴"},"摇":{jp:"揺",zht:"搖",zhs:"摇"},"敌":{jp:"敵",zht:"敵",zhs:"敌"},"败":{jp:"敗",zht:"敗",zhs:"败"},"数":{jp:"数",zht:"數",zhs:"数"},"齐":{jp:"斉",zht:"齊",zhs:"齐"},"斋":{jp:"斎",zht:"齋",zhs:"斋"},"断":{jp:"断",zht:"斷",zhs:"断"},"旧":{jp:"旧",zht:"舊",zhs:"旧"},"时":{jp:"時",zht:"時",zhs:"时"},"昙":{jp:"曇",zht:"曇",zhs:"昙"},"昼":{jp:"昼",zht:"晝",zhs:"昼"},"显":{jp:"顕",zht:"顯",zhs:"显"},"晓":{jp:"暁",zht:"曉",zhs:"晓"},"晚":{jp:"晩",zht:"晚",zhs:"晚"},"暂":{jp:"暫",zht:"暫",zhs:"暂"},"曾":{jp:"曽",zht:"曾",zhs:"曾"},"术":{jp:"術",zht:"術",zhs:"术"},"朴":{jp:"樸",zht:"樸",zhs:"朴"},"机":{jp:"機",zht:"機",zhs:"机"},"杀":{jp:"殺",zht:"殺",zhs:"杀"},"杂":{jp:"雑",zht:"雜",zhs:"杂"},"权":{jp:"権",zht:"權",zhs:"权"},"条":{jp:"条",zht:"條",zhs:"条"},"极":{jp:"極",zht:"極",zhs:"极"},"枢":{jp:"枢",zht:"樞",zhs:"枢"},"枪":{jp:"槍",zht:"槍",zhs:"枪"},"查":{jp:"査",zht:"查",zhs:"查"},"荣":{jp:"栄",zht:"榮",zhs:"荣"},"标":{jp:"標",zht:"標",zhs:"标"},"栈":{jp:"桟",zht:"棧",zhs:"栈"},"栋":{jp:"棟",zht:"棟",zhs:"栋"},"栏":{jp:"欄",zht:"欄",zhs:"栏"},"树":{jp:"樹",zht:"樹",zhs:"树"},"样":{jp:"様",zht:"樣",zhs:"样"},"樱":{jp:"桜",zht:"櫻",zhs:"樱"},"桥":{jp:"橋",zht:"橋",zhs:"桥"},"检":{jp:"検",zht:"檢",zhs:"检"},"楼":{jp:"楼",zht:"樓",zhs:"楼"},"欢":{jp:"歓",zht:"歡",zhs:"欢"},"欧":{jp:"欧",zht:"歐",zhs:"欧"},"步":{jp:"歩",zht:"步",zhs:"步"},"齿":{jp:"歯",zht:"齒",zhs:"齿"},"残":{jp:"残",zht:"殘",zhs:"残"},"殴":{jp:"殴",zht:"毆",zhs:"殴"},"气":{jp:"気",zht:"氣",zhs:"气"},"汉":{jp:"漢",zht:"漢",zhs:"汉"},"汤":{jp:"湯",zht:"湯",zhs:"汤"},"沟":{jp:"溝",zht:"溝",zhs:"沟"},"泽":{jp:"沢",zht:"澤",zhs:"泽"},"泪":{jp:"涙",zht:"淚",zhs:"泪"},"泷":{jp:"滝",zht:"瀧",zhs:"泷"},"洁":{jp:"潔",zht:"潔",zhs:"洁"},"浅":{jp:"浅",zht:"淺",zhs:"浅"},"浊":{jp:"濁",zht:"濁",zhs:"浊"},"测":{jp:"測",zht:"測",zhs:"测"},"济":{jp:"済",zht:"濟",zhs:"济"},"浓":{jp:"濃",zht:"濃",zhs:"浓"},"滨":{jp:"浜",zht:"濱",zhs:"滨"},"涉":{jp:"渋",zht:"涉",zhs:"涉"},"涩":{jp:"渋",zht:"涉",zhs:"涩"},"涡":{jp:"渦",zht:"渦",zhs:"涡"},"润":{jp:"潤",zht:"潤",zhs:"润"},"渍":{jp:"漬",zht:"漬",zhs:"渍"},"渐":{jp:"漸",zht:"漸",zhs:"渐"},"溪":{jp:"渓",zht:"溪",zhs:"溪"},"渔":{jp:"漁",zht:"漁",zhs:"渔"},"湾":{jp:"湾",zht:"灣",zhs:"湾"},"湿":{jp:"湿",zht:"濕",zhs:"湿"},"满":{jp:"満",zht:"滿",zhs:"满"},"灭":{jp:"滅",zht:"滅",zhs:"灭"},"滞":{jp:"滞",zht:"滯",zhs:"滞"},"滥":{jp:"濫",zht:"濫",zhs:"滥"},"濑":{jp:"瀬",zht:"瀨",zhs:"濑"},"灯":{jp:"灯",zht:"燈",zhs:"灯"},"灵":{jp:"霊",zht:"靈",zhs:"灵"},"炉":{jp:"炉",zht:"爐",zhs:"炉"},"点":{jp:"点",zht:"點",zhs:"点"},"炼":{jp:"錬",zht:"鍊",zhs:"炼"},"练":{jp:"練",zht:"練",zhs:"练"},"烟":{jp:"煙",zht:"煙",zhs:"烟"},"烦":{jp:"煩",zht:"煩",zhs:"烦"},"烧":{jp:"焼",zht:"燒",zhs:"烧"},"热":{jp:"熱",zht:"熱",zhs:"热"},"焰":{jp:"焔",zht:"焰",zhs:"焰"},"锻":{jp:"鍛",zht:"鍛",zhs:"锻"},"牺":{jp:"犠",zht:"犧",zhs:"牺"},"状":{jp:"状",zht:"狀",zhs:"状"},"犹":{jp:"猶",zht:"猶",zhs:"犹"},"独":{jp:"独",zht:"獨",zhs:"独"},"狭":{jp:"狭",zht:"狹",zhs:"狭"},"狱":{jp:"獄",zht:"獄",zhs:"狱"},"猎":{jp:"猟",zht:"獵",zhs:"猎"},"猫":{jp:"猫",zht:"貓",zhs:"猫"},"献":{jp:"献",zht:"獻",zhs:"献"},"环":{jp:"環",zht:"環",zhs:"环"},"现":{jp:"現",zht:"現",zhs:"现"},"玺":{jp:"璽",zht:"璽",zhs:"玺"},"电":{jp:"電",zht:"電",zhs:"电"},"疗":{jp:"療",zht:"療",zhs:"疗"},"监":{jp:"監",zht:"監",zhs:"监"},"盖":{jp:"蓋",zht:"蓋",zhs:"盖"},"盘":{jp:"盤",zht:"盤",zhs:"盘"},"视":{jp:"視",zht:"視",zhs:"视"},"著":{jp:"着",zht:"著",zhs:"著"},"矫":{jp:"矯",zht:"矯",zhs:"矫"},"矿":{jp:"鉱",zht:"礦",zhs:"矿"},"碎":{jp:"砕",zht:"碎",zhs:"碎"},"础":{jp:"礎",zht:"礎",zhs:"础"},"确":{jp:"確",zht:"確",zhs:"确"},"礼":{jp:"礼",zht:"禮",zhs:"礼"},"祸":{jp:"禍",zht:"禍",zhs:"祸"},"禅":{jp:"禅",zht:"禪",zhs:"禅"},"离":{jp:"離",zht:"離",zhs:"离"},"种":{jp:"種",zht:"種",zhs:"种"},"积":{jp:"積",zht:"積",zhs:"积"},"称":{jp:"称",zht:"稱",zhs:"称"},"稻":{jp:"稲",zht:"稻",zhs:"稻"},"稳":{jp:"穏",zht:"穩",zhs:"稳"},"谷":{jp:"穀",zht:"穀",zhs:"谷"},"穗":{jp:"穂",zht:"穗",zhs:"穗"},"穷":{jp:"窮",zht:"窮",zhs:"穷"},"窃":{jp:"窃",zht:"竊",zhs:"窃"},"窗":{jp:"窓",zht:"窗",zhs:"窗"},"龙":{jp:"竜",zht:"龍",zhs:"龙"},"竞":{jp:"競",zht:"競",zhs:"竞"},"笃":{jp:"篤",zht:"篤",zhs:"笃"},"笔":{jp:"筆",zht:"筆",zhs:"笔"},"筑":{jp:"築",zht:"築",zhs:"筑"},"简":{jp:"簡",zht:"簡",zhs:"简"},"节":{jp:"節",zht:"節",zhs:"节"},"范":{jp:"範",zht:"範",zhs:"范"},"类":{jp:"類",zht:"類",zhs:"类"},"粹":{jp:"粋",zht:"粹",zhs:"粹"},"肃":{jp:"粛",zht:"肅",zhs:"肃"},"粮":{jp:"糧",zht:"糧",zhs:"粮"},"纠":{jp:"糾",zht:"糾",zhs:"纠"},"纪":{jp:"紀",zht:"紀",zhs:"纪"},"约":{jp:"約",zht:"約",zhs:"约"},"红":{jp:"紅",zht:"紅",zhs:"红"},"纹":{jp:"紋",zht:"紋",zhs:"纹"},"纳":{jp:"納",zht:"納",zhs:"纳"},"纯":{jp:"純",zht:"純",zhs:"纯"},"纸":{jp:"紙",zht:"紙",zhs:"纸"},"级":{jp:"級",zht:"級",zhs:"级"},"纷":{jp:"紛",zht:"紛",zhs:"纷"},"纺":{jp:"紡",zht:"紡",zhs:"纺"},"紧":{jp:"緊",zht:"緊",zhs:"紧"},"细":{jp:"細",zht:"細",zhs:"细"},"绅":{jp:"紳",zht:"紳",zhs:"绅"},"绍":{jp:"紹",zht:"紹",zhs:"绍"},"绀":{jp:"紺",zht:"紺",zhs:"绀"},"终":{jp:"終",zht:"終",zhs:"终"},"组":{jp:"組",zht:"組",zhs:"组"},"经":{jp:"経",zht:"經",zhs:"经"},"结":{jp:"結",zht:"結",zhs:"结"},"绝":{jp:"絶",zht:"絕",zhs:"绝"},"绞":{jp:"絞",zht:"絞",zhs:"绞"},"络":{jp:"絡",zht:"絡",zhs:"络"},"给":{jp:"給",zht:"給",zhs:"给"},"统":{jp:"統",zht:"統",zhs:"统"},"绘":{jp:"絵",zht:"繪",zhs:"绘"},"绢":{jp:"絹",zht:"絹",zhs:"绢"},"继":{jp:"継",zht:"繼",zhs:"继"},"续":{jp:"続",zht:"續",zhs:"续"},"绿":{jp:"緑",zht:"綠",zhs:"绿"},"线":{jp:"線",zht:"線",zhs:"线"},"维":{jp:"維",zht:"維",zhs:"维"},"纲":{jp:"綱",zht:"綱",zhs:"纲"},"绵":{jp:"綿",zht:"綿",zhs:"绵"},"绪":{jp:"緒",zht:"緒",zhs:"绪"},"缔":{jp:"締",zht:"締",zhs:"缔"},"缘":{jp:"縁",zht:"緣",zhs:"缘"},"编":{jp:"編",zht:"編",zhs:"编"},"缓":{jp:"緩",zht:"緩",zhs:"缓"},"纬":{jp:"緯",zht:"緯",zhs:"纬"},"绳":{jp:"縄",zht:"繩",zhs:"绳"},"缚":{jp:"縛",zht:"縛",zhs:"缚"},"纵":{jp:"縦",zht:"縱",zhs:"纵"},"缝":{jp:"縫",zht:"縫",zhs:"缝"},"缩":{jp:"縮",zht:"縮",zhs:"缩"},"纤":{jp:"繊",zht:"纖",zhs:"纤"},"绩":{jp:"績",zht:"績",zhs:"绩"},"织":{jp:"織",zht:"織",zhs:"织"},"缮":{jp:"繕",zht:"繕",zhs:"缮"},"茧":{jp:"繭",zht:"繭",zhs:"茧"},"缲":{jp:"繰",zht:"繰",zhs:"缲"},"罐":{jp:"缶",zht:"罐",zhs:"罐"},"钵":{jp:"鉢",zht:"鉢",zhs:"钵"},"罗":{jp:"羅",zht:"羅",zhs:"罗"},"罚":{jp:"罸",zht:"罰",zhs:"罚"},"罢":{jp:"罷",zht:"罷",zhs:"罢"},"骂":{jp:"罵",zht:"罵",zhs:"骂"},"职":{jp:"職",zht:"職",zhs:"职"},"闻":{jp:"聞",zht:"聞",zhs:"闻"},"聪":{jp:"聡",zht:"聰",zhs:"聪"},"肠":{jp:"腸",zht:"腸",zhs:"肠"},"肤":{jp:"膚",zht:"膚",zhs:"肤"},"胀":{jp:"脹",zht:"脹",zhs:"胀"},"胁":{jp:"脅",zht:"脅",zhs:"胁"},"胆":{jp:"胆",zht:"膽",zhs:"胆"},"脏":{jp:"臓",zht:"臟",zhs:"脏"},"脑":{jp:"脳",zht:"腦",zhs:"脑"},"脚":{jp:"脚",zht:"腳",zhs:"脚"},"腾":{jp:"騰",zht:"騰",zhs:"腾"},"铺":{jp:"舗",zht:"舖",zhs:"铺"},"馆":{jp:"館",zht:"館",zhs:"馆"},"舰":{jp:"艦",zht:"艦",zhs:"舰"},"艺":{jp:"芸",zht:"藝",zhs:"艺"},"茎":{jp:"茎",zht:"莖",zhs:"茎"},"荐":{jp:"薦",zht:"薦",zhs:"荐"},"药":{jp:"薬",zht:"藥",zhs:"药"},"萤":{jp:"蛍",zht:"螢",zhs:"萤"},"蒋":{jp:"蒋",zht:"蔣",zhs:"蒋"},"藏":{jp:"蔵",zht:"藏",zhs:"藏"},"虏":{jp:"虜",zht:"虜",zhs:"虏"},"虚":{jp:"虚",zht:"虛",zhs:"虚"},"虫":{jp:"虫",zht:"蟲",zhs:"虫"},"蚀":{jp:"蝕",zht:"蝕",zhs:"蚀"},"蚕":{jp:"蚕",zht:"蠶",zhs:"蚕"},"蛮":{jp:"蛮",zht:"蠻",zhs:"蛮"},"补":{jp:"補",zht:"補",zhs:"补"},"袭":{jp:"襲",zht:"襲",zhs:"袭"},"装":{jp:"装",zht:"裝",zhs:"装"},"里":{jp:"裏",zht:"裡",zhs:"里"},"霸":{jp:"覇",zht:"霸",zhs:"霸"},"见":{jp:"見",zht:"見",zhs:"见"},"观":{jp:"観",zht:"觀",zhs:"观"},"规":{jp:"規",zht:"規",zhs:"规"},"觉":{jp:"覚",zht:"覺",zhs:"觉"},"览":{jp:"覧",zht:"覽",zhs:"览"},"触":{jp:"触",zht:"觸",zhs:"触"},"订":{jp:"訂",zht:"訂",zhs:"订"},"计":{jp:"計",zht:"計",zhs:"计"},"讨":{jp:"討",zht:"討",zhs:"讨"},"训":{jp:"訓",zht:"訓",zhs:"训"},"记":{jp:"記",zht:"記",zhs:"记"},"讼":{jp:"訟",zht:"訟",zhs:"讼"},"访":{jp:"訪",zht:"訪",zhs:"访"},"设":{jp:"設",zht:"設",zhs:"设"},"许":{jp:"許",zht:"許",zhs:"许"},"译":{jp:"訳",zht:"譯",zhs:"译"},"诉":{jp:"訴",zht:"訴",zhs:"诉"},"诊":{jp:"診",zht:"診",zhs:"诊"},"证":{jp:"証",zht:"證",zhs:"证"},"诈":{jp:"詐",zht:"詐",zhs:"诈"},"诏":{jp:"詔",zht:"詔",zhs:"诏"},"评":{jp:"評",zht:"評",zhs:"评"},"诅":{jp:"詛",zht:"詛",zhs:"诅"},"词":{jp:"詞",zht:"詞",zhs:"词"},"试":{jp:"試",zht:"試",zhs:"试"},"诗":{jp:"詩",zht:"詩",zhs:"诗"},"诘":{jp:"詰",zht:"詰",zhs:"诘"},"该":{jp:"該",zht:"該",zhs:"该"},"详":{jp:"詳",zht:"詳",zhs:"详"},"誉":{jp:"誉",zht:"譽",zhs:"誉"},"誊":{jp:"謄",zht:"謄",zhs:"誊"},"认":{jp:"認",zht:"認",zhs:"认"},"诞":{jp:"誕",zht:"誕",zhs:"诞"},"诱":{jp:"誘",zht:"誘",zhs:"诱"},"语":{jp:"語",zht:"語",zhs:"语"},"诚":{jp:"誠",zht:"誠",zhs:"诚"},"误":{jp:"誤",zht:"誤",zhs:"误"},"说":{jp:"説",zht:"說",zhs:"说"},"读":{jp:"読",zht:"讀",zhs:"读"},"谁":{jp:"誰",zht:"誰",zhs:"谁"},"课":{jp:"課",zht:"課",zhs:"课"},"调":{jp:"調",zht:"調",zhs:"调"},"谈":{jp:"談",zht:"談",zhs:"谈"},"请":{jp:"請",zht:"請",zhs:"请"},"论":{jp:"論",zht:"論",zhs:"论"},"谕":{jp:"諭",zht:"諭",zhs:"谕"},"诸":{jp:"諸",zht:"諸",zhs:"诸"},"诺":{jp:"諾",zht:"諾",zhs:"诺"},"谋":{jp:"謀",zht:"謀",zhs:"谋"},"谒":{jp:"謁",zht:"謁",zhs:"谒"},"谜":{jp:"謎",zht:"謎",zhs:"谜"},"谦":{jp:"謙",zht:"謙",zhs:"谦"},"讲":{jp:"講",zht:"講",zhs:"讲"},"谢":{jp:"謝",zht:"謝",zhs:"谢"},"谣":{jp:"謡",zht:"謠",zhs:"谣"},"谨":{jp:"謹",zht:"謹",zhs:"谨"},"识":{jp:"識",zht:"識",zhs:"识"},"谱":{jp:"譜",zht:"譜",zhs:"谱"},"议":{jp:"議",zht:"議",zhs:"议"},"让":{jp:"譲",zht:"讓",zhs:"让"},"贝":{jp:"貝",zht:"貝",zhs:"贝"},"贞":{jp:"貞",zht:"貞",zhs:"贞"},"负":{jp:"負",zht:"負",zhs:"负"},"财":{jp:"財",zht:"財",zhs:"财"},"贡":{jp:"貢",zht:"貢",zhs:"贡"},"贫":{jp:"貧",zht:"貧",zhs:"贫"},"货":{jp:"貨",zht:"貨",zhs:"货"},"贩":{jp:"販",zht:"販",zhs:"贩"},"贪":{jp:"貪",zht:"貪",zhs:"贪"},"责":{jp:"責",zht:"責",zhs:"责"},"贮":{jp:"貯",zht:"貯",zhs:"贮"},"贵":{jp:"貴",zht:"貴",zhs:"贵"},"贷":{jp:"貸",zht:"貸",zhs:"贷"},"费":{jp:"費",zht:"費",zhs:"费"},"贸":{jp:"貿",zht:"貿",zhs:"贸"},"贺":{jp:"賀",zht:"賀",zhs:"贺"},"赁":{jp:"賃",zht:"賃",zhs:"赁"},"贿":{jp:"賄",zht:"賄",zhs:"贿"},"资":{jp:"資",zht:"資",zhs:"资"},"贼":{jp:"賊",zht:"賊",zhs:"贼"},"贱":{jp:"賎",zht:"賤",zhs:"贱"},"赞":{jp:"賛",zht:"贊",zhs:"赞"},"赐":{jp:"賜",zht:"賜",zhs:"赐"},"赏":{jp:"賞",zht:"賞",zhs:"赏"},"赔":{jp:"賠",zht:"賠",zhs:"赔"},"贤":{jp:"賢",zht:"賢",zhs:"贤"},"赋":{jp:"賦",zht:"賦",zhs:"赋"},"质":{jp:"質",zht:"質",zhs:"质"},"赖":{jp:"頼",zht:"賴",zhs:"赖"},"赠":{jp:"贈",zht:"贈",zhs:"赠"},"赃":{jp:"贓",zht:"贓",zhs:"赃"},"跃":{jp:"躍",zht:"躍",zhs:"跃"},"践":{jp:"践",zht:"踐",zhs:"践"},"踪":{jp:"踪",zht:"蹤",zhs:"踪"},"车":{jp:"車",zht:"車",zhs:"车"},"轨":{jp:"軌",zht:"軌",zhs:"轨"},"轩":{jp:"軒",zht:"軒",zhs:"轩"},"软":{jp:"軟",zht:"軟",zhs:"软"},"转":{jp:"転",zht:"轉",zhs:"转"},"轴":{jp:"軸",zht:"軸",zhs:"轴"},"轻":{jp:"軽",zht:"輕",zhs:"轻"},"较":{jp:"較",zht:"較",zhs:"较"},"载":{jp:"載",zht:"載",zhs:"载"},"辉":{jp:"輝",zht:"輝",zhs:"辉"},"辈":{jp:"輩",zht:"輩",zhs:"辈"},"轮":{jp:"輪",zht:"輪",zhs:"轮"},"输":{jp:"輸",zht:"輸",zhs:"输"},"辖":{jp:"轄",zht:"轄",zhs:"辖"},"辞":{jp:"辞",zht:"辭",zhs:"辞"},"边":{jp:"辺",zht:"邊",zhs:"边"},"达":{jp:"達",zht:"達",zhs:"达"},"迁":{jp:"遷",zht:"遷",zhs:"迁"},"过":{jp:"過",zht:"過",zhs:"过"},"运":{jp:"運",zht:"運",zhs:"运"},"还":{jp:"還",zht:"還",zhs:"还"},"进":{jp:"進",zht:"進",zhs:"进"},"远":{jp:"遠",zht:"遠",zhs:"远"},"违":{jp:"違",zht:"違",zhs:"违"},"连":{jp:"連",zht:"連",zhs:"连"},"迟":{jp:"遅",zht:"遲",zhs:"迟"},"适":{jp:"適",zht:"適",zhs:"适"},"选":{jp:"選",zht:"選",zhs:"选"},"递":{jp:"逓",zht:"遞",zhs:"递"},"遗":{jp:"遺",zht:"遺",zhs:"遗"},"遥":{jp:"遥",zht:"遙",zhs:"遥"},"邮":{jp:"郵",zht:"郵",zhs:"邮"},"邻":{jp:"隣",zht:"鄰",zhs:"邻"},"醉":{jp:"酔",zht:"醉",zhs:"醉"},"酿":{jp:"醸",zht:"釀",zhs:"酿"},"释":{jp:"釈",zht:"釋",zhs:"释"},"针":{jp:"針",zht:"針",zhs:"针"},"钓":{jp:"釣",zht:"釣",zhs:"钓"},"钝":{jp:"鈍",zht:"鈍",zhs:"钝"},"铃":{jp:"鈴",zht:"鈴",zhs:"铃"},"铁":{jp:"鉄",zht:"鐵",zhs:"铁"},"铅":{jp:"鉛",zht:"鉛",zhs:"铅"},"鉴":{jp:"鑑",zht:"鑑",zhs:"鉴"},"银":{jp:"銀",zht:"銀",zhs:"银"},"铳":{jp:"銃",zht:"銃",zhs:"铳"},"铜":{jp:"銅",zht:"銅",zhs:"铜"},"铣":{jp:"銑",zht:"銑",zhs:"铣"},"铭":{jp:"銘",zht:"銘",zhs:"铭"},"钱":{jp:"銭",zht:"錢",zhs:"钱"},"锐":{jp:"鋭",zht:"鋭",zhs:"锐"},"铸":{jp:"鋳",zht:"鑄",zhs:"铸"},"钢":{jp:"鋼",zht:"鋼",zhs:"钢"},"锤":{jp:"錘",zht:"錘",zhs:"锤"},"锭":{jp:"錠",zht:"錠",zhs:"锭"},"错":{jp:"錯",zht:"錯",zhs:"错"},"钟":{jp:"鍾",zht:"鍾",zhs:"钟"},"锁":{jp:"鎖",zht:"鎖",zhs:"锁"},"镇":{jp:"鎮",zht:"鎮",zhs:"镇"},"镜":{jp:"鏡",zht:"鏡",zhs:"镜"},"长":{jp:"長",zht:"長",zhs:"长"},"门":{jp:"門",zht:"門",zhs:"门"},"闭":{jp:"閉",zht:"閉",zhs:"闭"},"闲":{jp:"閑",zht:"閒",zhs:"闲"},"间":{jp:"間",zht:"間",zhs:"间"},"阁":{jp:"閣",zht:"閣",zhs:"阁"},"阀":{jp:"閥",zht:"閥",zhs:"阀"},"阅":{jp:"閲",zht:"閲",zhs:"阅"},"队":{jp:"隊",zht:"隊",zhs:"队"},"阳":{jp:"陽",zht:"陽",zhs:"阳"},"阴":{jp:"陰",zht:"陰",zhs:"阴"},"阵":{jp:"陣",zht:"陣",zhs:"阵"},"阶":{jp:"階",zht:"階",zhs:"阶"},"际":{jp:"際",zht:"際",zhs:"际"},"陆":{jp:"陸",zht:"陸",zhs:"陆"},"陈":{jp:"陳",zht:"陳",zhs:"陈"},"陷":{jp:"陥",zht:"陷",zhs:"陷"},"随":{jp:"随",zht:"隨",zhs:"随"},"隐":{jp:"隠",zht:"隱",zhs:"隐"},"隶":{jp:"隷",zht:"隸",zhs:"隶"},"难":{jp:"難",zht:"難",zhs:"难"},"雾":{jp:"霧",zht:"霧",zhs:"雾"},"静":{jp:"静",zht:"靜",zhs:"静"},"顶":{jp:"頂",zht:"頂",zhs:"顶"},"项":{jp:"項",zht:"項",zhs:"项"},"顺":{jp:"順",zht:"順",zhs:"顺"},"顽":{jp:"頑",zht:"頑",zhs:"顽"},"颁":{jp:"頒",zht:"頒",zhs:"颁"},"领":{jp:"領",zht:"領",zhs:"领"},"频":{jp:"頻",zht:"頻",zhs:"频"},"题":{jp:"題",zht:"題",zhs:"题"},"额":{jp:"額",zht:"額",zhs:"额"},"颜":{jp:"顔",zht:"顏",zhs:"颜"},"风":{jp:"風",zht:"風",zhs:"风"},"飞":{jp:"飛",zht:"飛",zhs:"飞"},"饥":{jp:"飢",zht:"饑",zhs:"饥"},"饭":{jp:"飯",zht:"飯",zhs:"饭"},"饮":{jp:"飲",zht:"飲",zhs:"饮"},"饲":{jp:"飼",zht:"飼",zhs:"饲"},"饱":{jp:"飽",zht:"飽",zhs:"饱"},"饰":{jp:"飾",zht:"飾",zhs:"饰"},"饿":{jp:"餓",zht:"餓",zhs:"饿"},"马":{jp:"馬",zht:"馬",zhs:"马"},"驿":{jp:"駅",zht:"驛",zhs:"驿"},"驱":{jp:"駆",zht:"驅",zhs:"驱"},"驻":{jp:"駐",zht:"駐",zhs:"驻"},"骑":{jp:"騎",zht:"騎",zhs:"骑"},"验":{jp:"験",zht:"驗",zhs:"验"},"骚":{jp:"騒",zht:"騷",zhs:"骚"},"驔":{jp:"騨",zht:"驔",zhs:"驔"},"髓":{jp:"髄",zht:"髓",zhs:"髓"},"鱼":{jp:"魚",zht:"魚",zhs:"鱼"},"鲁":{jp:"魯",zht:"魯",zhs:"鲁"},"鲜":{jp:"鮮",zht:"鮮",zhs:"鲜"},"鲸":{jp:"鯨",zht:"鯨",zhs:"鲸"},"鸟":{jp:"鳥",zht:"鳥",zhs:"鸟"},"鸣":{jp:"鳴",zht:"鳴",zhs:"鸣"},"麦":{jp:"麦",zht:"麥",zhs:"麦"},"黄":{jp:"黄",zht:"黃",zhs:"黄"},"黑":{jp:"黒",zht:"黑",zhs:"黑"},"默":{jp:"黙",zht:"默",zhs:"默"},"龄":{jp:"齢",zht:"齡",zhs:"龄"}}};var rs={};Object.defineProperty(rs,"__esModule",{value:!0}),rs.KEY_ZHS=rs.KEY_ZHT=rs.KEY_JP=void 0,rs.KEY_JP="jp",rs.KEY_ZHT="zht",rs.KEY_ZHS="zhs";var ns={},us={};Object.defineProperty(us,"__esModule",{value:!0}),us._getdata=void 0;const os=es;us._getdata=function(h,z,t,s){var p;return null===(p=(s?os.TABLE_SAFE:os.TABLE)[z][h])||void 0===p?void 0:p[t]},function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.cjk2zhs=h.cjk2zht=h.cjk2jp=h.zh2jp=h.zhs2zht=h.zht2zhs=h.zht2jp=h.zhs2jp=h.jp2zhs=h.jp2zht=void 0;const z=rs,t=es,s=_,p=a.__importDefault(Ft),j=us,e=new RegExp((0, s._re_cjk_conv)("u").source+"+","u"),r={safe:!0};var n;function u(h,t){return e.test(h.toString())?(t=Object.assign({},r,t),p.default.split(h,"").map((function(h){if(t.skip&&-1!=t.skip.indexOf(h))return h;let s;return (s=(0, j._getdata)(h,z.KEY_ZHT,z.KEY_JP,t.safe))||(s=(0, j._getdata)(h,z.KEY_ZHS,z.KEY_JP,t.safe))?s:h})).join("")):h}!function(h){let z=Object.keys(t.TABLE);z.forEach((function(t){z.forEach((function(z){t!=z&&(h[`${t}2${z}`]=function(h,s){return e.test(h.toString())?(s=Object.assign({},r,s),p.default.split(h,"").map((function(h){if(s.skip&&-1!=s.skip.indexOf(h))return h;let p;return (p=(0, j._getdata)(h,t,z,s.safe))?p:h})).join("")):h});}));}));}(n||(n={})),h.jp2zht=n.jp2zht,h.jp2zhs=n.jp2zhs,h.zhs2jp=n.zhs2jp,h.zht2jp=n.zht2jp,h.zht2zhs=n.zht2zhs,h.zhs2zht=n.zhs2zht,h.zh2jp=u,h.cjk2jp=u,h.cjk2zht=function(h,t){return e.test(h.toString())?(t=Object.assign({},r,t),p.default.split(h,"").map((function(h){if(t.skip&&-1!=t.skip.indexOf(h))return h;let s;return (s=(0, j._getdata)(h,z.KEY_JP,z.KEY_ZHT,t.safe))||(s=(0, j._getdata)(h,z.KEY_ZHS,z.KEY_ZHT,t.safe))?s:h})).join("")):h},h.cjk2zhs=function(h,t){return e.test(h.toString())?(t=Object.assign({},r,t),p.default.split(h,"").map((function(h){if(t.skip&&-1!=t.skip.indexOf(h))return h;let s;return (s=(0, j._getdata)(h,z.KEY_JP,z.KEY_ZHS,t.safe))||(s=(0, j._getdata)(h,z.KEY_ZHT,z.KEY_ZHS,t.safe))?s:h})).join("")):h},h.default=h;}(ns);var is={},as={};Object.defineProperty(as,"__esModule",{value:!0}),as.TABLE_SAFE=as.TABLE=void 0,as.TABLE=[[["会"],["會"],["会"]],[["箋"],["箋"],["笺"]],[["網"],["網"],["网"]],[["処"],["處"],["处"]],[["話"],["話"],["话"]],[["駄"],["馱"],["驮"]],[["馱"],["馱"],["驮"]],[["万"],["萬"],["万"]],[["与"],["與"],["与"]],[["醜"],["醜"],["丑"]],[["専"],["專"],["专"]],[["業"],["業"],["业"]],[["東"],["東"],["东"]],[["絲"],["絲"],["丝"]],[["糸"],["絲"],["丝"]],[["両"],["兩"],["两"]],[["厳"],["嚴"],["严"]],[["並"],["並"],["并"]],[["喪"],["喪"],["丧"]],[["個"],["個"],["个"]],[["豊"],["豐"],["丰"]],[["臨"],["臨"],["临"]],[["為"],["為"],["为"]],[["麗"],["麗"],["丽"]],[["挙"],["舉"],["举"]],[["廼"],["迺"],["迺"]],[["義"],["義"],["义"]],[["楽"],["樂"],["乐"]],[["乗"],["乘"],["乘"]],[["習"],["習"],["习"]],[["郷"],["鄉"],["乡"]],[["書"],["書"],["书"]],[["買"],["買"],["买"]],[["乱"],["亂"],["乱"]],[["乾"],["乾"],["干"]],[["亀"],["龜"],["龟"]],[["予"],["預"],["预"]],[["弐"],["貳"],["贰"]],[["雲"],["雲"],["云"]],[["亜"],["亞"],["亚"]],[["産"],["產"],["产"]],[["畝"],["畝"],["亩"]],[["親"],["親"],["亲"]],[["億"],["億"],["亿"]],[["僕"],["僕"],["仆"]],[["従"],["從"],["从"]],[["仏"],["佛"],["佛"]],[["倉"],["倉"],["仓"]],[["儀"],["儀"],["仪"]],[["仮"],["假"],["假"]],[["価"],["價"],["价"]],[["衆"],["眾"],["众"]],[["優"],["優"],["优"]],[["伝"],["傳"],["传"]],[["傘"],["傘"],["伞"]],[["偉"],["偉"],["伟"]],[["傷"],["傷"],["伤"]],[["倫"],["倫"],["伦"]],[["偽"],["偽"],["伪"]],[["体"],["體"],["体"]],[["余"],["餘"],["余"]],[["来"],["來"],["来"]],[["偵"],["偵"],["侦"]],[["側"],["側"],["侧"]],[["倹"],["儉"],["俭"]],[["倶"],["俱"],["俱"]],[["債"],["債"],["债"]],[["傾"],["傾"],["倾"]],[["償"],["償"],["偿"]],[["傑"],["傑"],["杰"]],[["備"],["備"],["备"]],[["当"],["當"],["当"]],[["尽"],["盡"],["尽"]],[["児"],["兒"],["儿"]],[["党"],["黨"],["党"]],[["内"],["內"],["内"]],[["関"],["關"],["关"]],[["興"],["興"],["兴"]],[["養"],["養"],["养"]],[["獣"],["獸"],["兽"]],[["円"],["圓"],["圆"]],[["写"],["寫"],["写"]],[["軍"],["軍"],["军"]],[["農"],["農"],["农"]],[["冨"],["富"],["富"]],[["氷"],["冰"],["冰"]],[["衝"],["衝"],["冲"]],[["決"],["決"],["决"]],[["凍"],["凍"],["冻"]],[["塗"],["塗"],["涂"]],[["凄"],["淒"],["凄"]],[["凄"],["悽"],["凄"]],[["准"],["準"],["准"]],[["準"],["準"],["准"]],[["幾"],["幾"],["几"]],[["撃"],["擊"],["击"]],[["画"],["劃"],["划"]],[["画"],["畫"],["画"]],[["則"],["則"],["则"]],[["剛"],["剛"],["刚"]],[["創"],["創"],["创"]],[["別"],["別"],["别"]],[["製"],["製"],["制"]],[["券"],["卷"],["卷"]],[["巻"],["卷"],["卷"]],[["刹"],["剎"],["刹"]],[["剤"],["劑"],["剂"]],[["剣"],["劍"],["剑"]],[["劇"],["劇"],["剧"]],[["剰"],["剩"],["剩"]],[["勧"],["勸"],["劝"]],[["務"],["務"],["务"]],[["動"],["動"],["动"]],[["励"],["勵"],["励"]],[["労"],["勞"],["劳"]],[["効"],["效"],[null]],[["勢"],["勢"],["势"]],[["勲"],["勳"],["勋"]],[["勝"],["勝"],["胜"]],[["区"],["區"],["区"]],[["医"],["醫"],["医"]],[["華"],["華"],["华"]],[["協"],["協"],["协"]],[["単"],["單"],["单"]],[["売"],["賣"],["卖"]],[["衛"],["衛"],["卫"]],[["庁"],["廳"],["厅"]],[["歴"],["歷"],["历"]],[["暦"],["曆"],["历"]],[["圧"],["壓"],["压"]],[["県"],["縣"],["县"]],[["参"],["參"],["参"]],[["双"],["雙"],["双"]],[["収"],["收"],["收"]],[["発"],["發"],["发"]],[["変"],["變"],["变"]],[["畳"],["疊"],["叠"]],[["号"],["號"],["号"]],[["嘆"],["嘆"],["叹"]],[["嚇"],["嚇"],["吓"]],[["聴"],["聽"],["听"]],[["啓"],["啟"],["启"]],[["員"],["員"],["员"]],[["諮"],["諮"],["谘"]],[["鹹"],["鹹"],["咸"]],[["響"],["響"],["响"]],[["問"],["問"],["问"]],[["営"],["營"],["营"]],[["噴"],["噴"],["喷"]],[["嘱"],["囑"],["嘱"]],[["蘇"],["蘇"],["苏"]],[["団"],["團"],["团"]],[["園"],["園"],["园"]],[["国"],["國"],["国"]],[["囲"],["圍"],["围"]],[["図"],["圖"],["图"]],[["圏"],["圈"],["圈"]],[["聖"],["聖"],["圣"]],[["場"],["場"],["场"]],[["壊"],["壞"],["坏"]],[["塊"],["塊"],["块"]],[["堅"],["堅"],["坚"]],[["壇"],["壇"],["坛"]],[["墳"],["墳"],["坟"]],[["墜"],["墜"],["坠"]],[["塁"],["壘"],["垒"]],[["墾"],["墾"],["垦"]],[["執"],["執"],["执"]],[["堕"],["墮"],["堕"]],[["報"],["報"],["报"]],[["塩"],["鹽"],["盐"]],[["増"],["增"],["增"]],[["壌"],["壤"],["壤"]],[["壮"],["壯"],["壮"]],[["声"],["聲"],["声"]],[["壱"],["壹"],["壹"]],[["殻"],["殻"],["壳"]],[["殼"],["殼"],["壳"]],[["寿"],["壽"],["寿"]],[["復"],["復"],["复"]],[["複"],["複"],["复"]],[["夢"],["夢"],["梦"]],[["頭"],["頭"],["头"]],[["誇"],["誇"],["夸"]],[["奪"],["奪"],["夺"]],[["奮"],["奮"],["奋"]],[["奨"],["獎"],["奖"]],[["粧"],["妝"],["妆"]],[["婦"],["婦"],["妇"]],[["姉"],["姐"],["姐"]],[["姫"],["姬"],["姬"]],[["嬢"],["孃"],["娘"]],[["娯"],["娛"],["娱"]],[["孫"],["孫"],["孙"]],[["学"],["學"],["学"]],[["寧"],["寧"],["宁"]],[["宝"],["寶"],["宝"]],[["実"],["實"],["实"]],[["審"],["審"],["审"]],[["憲"],["憲"],["宪"]],[["宮"],["宮"],["宫"]],[["寬"],["寬"],["宽"]],[["賓"],["賓"],["宾"]],[["秘"],["祕"],["秘"]],[["寛"],["寬"],["宽"]],[["寝"],["寢"],["寝"]],[["対"],["對"],["对"]],[["尋"],["尋"],["寻"]],[["導"],["導"],["导"]],[["将"],["將"],["将"]],[["層"],["層"],["层"]],[["属"],["屬"],["属"]],[["歳"],["歲"],["岁"]],[["島"],["島"],["岛"]],[["巌"],["巖"],["巖"]],[["峡"],["峽"],["峡"]],[["険"],["險"],["险"]],[["幣"],["幣"],["币"]],[["帥"],["帥"],["帅"]],[["師"],["師"],["师"]],[["帳"],["帳"],["帐"]],[["帶"],["帶"],["带"]],[["帯"],["帶"],["带"]],[["帰"],["歸"],["归"]],[["幹"],["幹"],["干"]],[["広"],["廣"],["广"]],[["庄"],["莊"],["庄"]],[["慶"],["慶"],["庆"]],[["庫"],["庫"],["库"]],[["応"],["應"],["应"]],[["廃"],["廢"],["废"]],[["開"],["開"],["开"]],[["弁"],["辨","瓣","辯"],["辨","瓣","辩"]],[["異"],["異"],["异"]],[["棄"],["棄"],["弃"]],[["弍"],["貳"],["贰"]],[["張"],["張"],["张"]],[["弥"],["彌"],["弥"]],[["強"],["強"],["强"]],[["弾"],["彈"],["弹"]],[["録"],["錄"],["录"]],[["彦"],["彥"],["彥"]],[["徹"],["徹"],["彻"]],[["徴"],["徵"],["征"]],[["径"],["徑"],["径"]],[["徳"],["德"],["德"]],[["憶"],["憶"],["忆"]],[["誌"],["誌"],["志"]],[["憂"],["憂"],["忧"]],[["懐"],["懷"],["怀"]],[["態"],["態"],["态"]],[["総"],["總"],["总"]],[["恒"],["恆"],["恒"]],[["恋"],["戀"],["恋"]],[["懇"],["懇"],["恳"]],[["恵"],["惠"],["惠"]],[["悪"],["惡"],["恶"]],[["悩"],["惱"],["恼"]],[["悦"],["悅"],["悅"]],[["懸"],["懸"],["悬"]],[["驚"],["驚"],["惊"]],[["惨"],["慘"],["惨"]],[["懲"],["懲"],["惩"]],[["愛"],["愛"],["爱"]],[["憤"],["憤"],["愤"]],[["願"],["願"],["愿"]],[["慮"],["慮"],["虑"]],[["戯"],["戲"],["戏"]],[["戦"],["戰"],["战"]],[["戸"],["戶"],["户"]],[["払"],["拂"],["拂"]],[["拡"],["擴"],["扩"]],[["掃"],["掃"],["扫"]],[["揚"],["揚"],["扬"]],[["抜"],["拔"],[null]],[["択"],["擇"],["择"]],[["護"],["護"],["护"]],[["担"],["擔"],["担"]],[["拝"],["拜"],["拜"]],[["擬"],["擬"],["拟"]],[["拠"],["據"],["据"]],[["擁"],["擁"],["拥"]],[["挟"],["挾"],["挟"]],[["揮"],["揮"],["挥"]],[["揷"],["插"],["插"]],[["挿"],["插"],["插"]],[["損"],["損"],["损"]],[["捨"],["捨"],["舍"]],[["掲"],["揭"],["揭"]],[["掴"],["摑"],["掴"]],[["揺"],["搖"],["摇"]],[["摂"],["攝"],["摄"]],[["撮"],["攝"],["摄"]],[["敵"],["敵"],["敌"]],[["敗"],["敗"],["败"]],[["数"],["數"],["数"]],[["斉"],["齊"],["齐"]],[["斎"],["齋"],["斋"]],[["闘"],["鬥"],["斗"]],[["鬪"],["鬥"],["斗"]],[["断"],["斷"],["断"]],[["旧"],["舊"],["旧"]],[["時"],["時"],["时"]],[["曇"],["曇"],["昙"]],[["昼"],["晝"],["昼"]],[["顕"],["顯"],["显"]],[["暁"],["曉"],["晓"]],[["晩"],["晚"],["晚"]],[["暫"],["暫"],["暂"]],[["曽"],["曾"],["曾"]],[["術"],["術"],["术"]],[["樸"],["樸"],["朴"]],[["機"],["機"],["机"]],[["殺"],["殺"],["杀"]],[["雑"],["雜"],["杂"]],[["権"],["權"],["权"]],[["条"],["條"],["条"]],[["極"],["極"],["极"]],[["枢"],["樞"],["枢"]],[["槍"],["槍"],["枪"]],[["査"],["查"],["查"]],[["栄"],["榮"],["荣"]],[["標"],["標"],["标"]],[["桟"],["棧"],["栈"]],[["棟"],["棟"],["栋"]],[["欄"],["欄"],["栏"]],[["樹"],["樹"],["树"]],[["様"],["樣"],["样"]],[["桜"],["櫻"],["樱"]],[["橋"],["橋"],["桥"]],[["検"],["檢"],["检"]],[["楼"],["樓"],["楼"]],[["歓"],["歡"],["欢"]],[["欧"],["歐"],["欧"]],[["歩"],["步"],["步"]],[["歯"],["齒"],["齿"]],[["残"],["殘"],["残"]],[["殴"],["毆"],["殴"]],[["気"],["氣"],["气"]],[["漢"],["漢"],["汉"]],[["湯"],["湯"],["汤"]],[["溝"],["溝"],["沟"]],[["沢"],["澤"],["泽"]],[["涙"],["淚"],["泪"]],[["滝"],["瀧"],["泷"]],[["潔"],["潔"],["洁"]],[["浅"],["淺"],["浅"]],[["濁"],["濁"],["浊"]],[["測"],["測"],["测"]],[["済"],["濟"],["济"]],[["濃"],["濃"],["浓"]],[["浜"],["濱"],["滨"]],[["渋"],["涉","澀"],["涉","涩"]],[["渦"],["渦"],["涡"]],[["潤"],["潤"],["润"]],[["漬"],["漬"],["渍"]],[["漸"],["漸"],["渐"]],[["渓"],["溪"],["溪"]],[["漁"],["漁"],["渔"]],[["湾"],["灣"],["湾"]],[["湿"],["濕"],["湿"]],[["満"],["滿"],["满"]],[["滅"],["滅"],["灭"]],[["滞"],["滯"],["滞"]],[["濫"],["濫"],["滥"]],[["瀬"],["瀨"],["濑"]],[["灯"],["燈"],["灯"]],[["霊"],["靈"],["灵"]],[["炉"],["爐"],["炉"]],[["点"],["點"],["点"]],[["錬"],["鍊"],["炼"]],[["練"],["練"],["练"]],[["煙"],["煙"],["烟"]],[["煩"],["煩"],["烦"]],[["焼"],["燒"],["烧"]],[["熱"],["熱"],["热"]],[["焔"],["焰"],["焰"]],[["鍛"],["鍛"],["锻"]],[["犠"],["犧"],["牺"]],[["状"],["狀"],["状"]],[["猶"],["猶"],["犹"]],[["独"],["獨"],["独"]],[["狭"],["狹"],["狭"]],[["獄"],["獄"],["狱"]],[["猟"],["獵"],["猎"]],[["猫"],["貓"],["猫"]],[["献"],["獻"],["献"]],[["獲"],["獲"],["获"]],[["穫"],["穫"],["获"]],[["環"],["環"],["环"]],[["現"],["現"],["现"]],[["璽"],["璽"],["玺"]],[["甦"],["甦"],["苏"]],[["電"],["電"],["电"]],[["療"],["療"],["疗"]],[["監"],["監"],["监"]],[["蓋"],["蓋"],["盖"]],[["盤"],["盤"],["盘"]],[["視"],["視"],["视"]],[["着"],["著"],["著"]],[["矯"],["矯"],["矫"]],[["鉱"],["礦"],["矿"]],[["砕"],["碎"],["碎"]],[["礎"],["礎"],["础"]],[["確"],["確"],["确"]],[["礼"],["禮"],["礼"]],[["禍"],["禍"],["祸"]],[["禅"],["禪"],["禅"]],[["離"],["離"],["离"]],[["種"],["種"],["种"]],[["積"],["積"],["积"]],[["称"],["稱"],["称"]],[["稲"],["稻"],["稻"]],[["穏"],["穩"],["稳"]],[["穀"],["穀"],["谷"]],[["穂"],["穗"],["穗"]],[["窮"],["窮"],["穷"]],[["窃"],["竊"],["窃"]],[["窓"],["窗"],["窗"]],[["竜"],["龍"],["龙"]],[["競"],["競"],["竞"]],[["篤"],["篤"],["笃"]],[["筆"],["筆"],["笔"]],[["築"],["築"],["筑"]],[["簡"],["簡"],["简"]],[["箇"],["個"],["个"]],[["節"],["節"],["节"]],[["範"],["範"],["范"]],[["類"],["類"],["类"]],[["粋"],["粹"],["粹"]],[["粛"],["肅"],["肃"]],[["糧"],["糧"],["粮"]],[["糾"],["糾"],["纠"]],[["紀"],["紀"],["纪"]],[["約"],["約"],["约"]],[["紅"],["紅"],["红"]],[["紋"],["紋"],["纹"]],[["納"],["納"],["纳"]],[["純"],["純"],["纯"]],[["紙"],["紙"],["纸"]],[["級"],["級"],["级"]],[["紛"],["紛"],["纷"]],[["紡"],["紡"],["纺"]],[["緊"],["緊"],["紧"]],[["細"],["細"],["细"]],[["紳"],["紳"],["绅"]],[["紹"],["紹"],["绍"]],[["紺"],["紺"],["绀"]],[["終"],["終"],["终"]],[["組"],["組"],["组"]],[["経"],["經"],["经"]],[["結"],["結"],["结"]],[["絶"],["絶"],["绝"]],[["絶"],["絕"],["绝"]],[["絞"],["絞"],["绞"]],[["絡"],["絡"],["络"]],[["給"],["給"],["给"]],[["統"],["統"],["统"]],[["絵"],["繪"],["绘"]],[["絹"],["絹"],["绢"]],[["継"],["繼"],["继"]],[["続"],["續"],["续"]],[["緑"],["綠"],["绿"]],[["線"],["線"],["线"]],[["維"],["維"],["维"]],[["綱"],["綱"],["纲"]],[["綿"],["綿"],["绵"]],[["緒"],["緒"],["绪"]],[["締"],["締"],["缔"]],[["縁"],["緣"],["缘"]],[["編"],["編"],["编"]],[["緩"],["緩"],["缓"]],[["緯"],["緯"],["纬"]],[["縄"],["繩"],["绳"]],[["縛"],["縛"],["缚"]],[["縦"],["縱"],["纵"]],[["縫"],["縫"],["缝"]],[["縮"],["縮"],["缩"]],[["繊"],["纖"],["纤"]],[["績"],["績"],["绩"]],[["織"],["織"],["织"]],[["繕"],["繕"],["缮"]],[["繭"],["繭"],["茧"]],[["繰"],["繰"],["缲"]],[["缶"],["罐"],["罐"]],[["鉢"],["鉢"],["钵"]],[["羅"],["羅"],["罗"]],[["罸"],["罰"],["罚"]],[["罷"],["罷"],["罢"]],[["罵"],["罵"],["骂"]],[["職"],["職"],["职"]],[["聞"],["聞"],["闻"]],[["聡"],["聰"],["聪"]],[["腸"],["腸"],["肠"]],[["膚"],["膚"],["肤"]],[["脹"],["脹"],["胀"]],[["脅"],["脅"],["胁"]],[["胆"],["膽"],["胆"]],[["臓"],["臟"],["脏"]],[["脳"],["腦"],["脑"]],[["脚"],["腳"],["脚"]],[["騰"],["騰"],["腾"]],[["舗"],["舖"],["铺"]],[["館"],["館"],["馆"]],[["艦"],["艦"],["舰"]],[["芸"],["藝"],["艺"]],[["茎"],["莖"],["茎"]],[["薦"],["薦"],["荐"]],[["荘"],["莊"],["庄"]],[["薬"],["藥"],["药"]],[["蛍"],["螢"],["萤"]],[["蒋"],["蔣"],["蒋"]],[["蔵"],["藏"],["藏"]],[["虜"],["虜"],["虏"]],[["虚"],["虛"],["虚"]],[["虫"],["蟲"],["虫"]],[["蝕"],["蝕"],["蚀"]],[["蚕"],["蠶"],["蚕"]],[["蛮"],["蠻"],["蛮"]],[["補"],["補"],["补"]],[["襲"],["襲"],["袭"]],[["装"],["裝"],["装"]],[["裏"],["裡"],["里"]],[["覇"],["霸"],["霸"]],[["見"],["見"],["见"]],[["観"],["觀"],["观"]],[["規"],["規"],["规"]],[["覚"],["覺"],["觉"]],[["覧"],["覽"],["览"]],[["触"],["觸"],["触"]],[["訂"],["訂"],["订"]],[["計"],["計"],["计"]],[["討"],["討"],["讨"]],[["訓"],["訓"],["训"]],[["記"],["記"],["记"]],[["訟"],["訟"],["讼"]],[["訪"],["訪"],["访"]],[["設"],["設"],["设"]],[["許"],["許"],["许"]],[["訳"],["譯"],["译"]],[["訴"],["訴"],["诉"]],[["診"],["診"],["诊"]],[["証"],["證"],["证"]],[["詐"],["詐"],["诈"]],[["詔"],["詔"],["诏"]],[["評"],["評"],["评"]],[["詛"],["詛"],["诅"]],[["詞"],["詞"],["词"]],[["試"],["試"],["试"]],[["詩"],["詩"],["诗"]],[["詰"],["詰"],["诘"]],[["該"],["該"],["该"]],[["詳"],["詳"],["详"]],[["誉"],["譽"],["誉"]],[["謄"],["謄"],["誊"]],[["認"],["認"],["认"]],[["誕"],["誕"],["诞"]],[["誘"],["誘"],["诱"]],[["語"],["語"],["语"]],[["誠"],["誠"],["诚"]],[["誤"],["誤"],["误"]],[["説"],["說"],["说"]],[["読"],["讀"],["读"]],[["誰"],["誰"],["谁"]],[["課"],["課"],["课"]],[["調"],["調"],["调"]],[["談"],["談"],["谈"]],[["請"],["請"],["请"]],[["論"],["論"],["论"]],[["諭"],["諭"],["谕"]],[["諸"],["諸"],["诸"]],[["諾"],["諾"],["诺"]],[["謀"],["謀"],["谋"]],[["謁"],["謁"],["谒"]],[["謎"],["謎"],["谜"]],[["謙"],["謙"],["谦"]],[["講"],["講"],["讲"]],[["謝"],["謝"],["谢"]],[["謡"],["謠"],["谣"]],[["謹"],["謹"],["谨"]],[["識"],["識"],["识"]],[["譜"],["譜"],["谱"]],[["議"],["議"],["议"]],[["譲"],["讓"],["让"]],[["貝"],["貝"],["贝"]],[["貞"],["貞"],["贞"]],[["負"],["負"],["负"]],[["財"],["財"],["财"]],[["貢"],["貢"],["贡"]],[["貧"],["貧"],["贫"]],[["貨"],["貨"],["货"]],[["販"],["販"],["贩"]],[["貪"],["貪"],["贪"]],[["責"],["責"],["责"]],[["貯"],["貯"],["贮"]],[["貴"],["貴"],["贵"]],[["貸"],["貸"],["贷"]],[["費"],["費"],["费"]],[["貿"],["貿"],["贸"]],[["賀"],["賀"],["贺"]],[["賃"],["賃"],["赁"]],[["賄"],["賄"],["贿"]],[["資"],["資"],["资"]],[["賊"],["賊"],["贼"]],[["賎"],["賤"],["贱"]],[["賛"],["贊"],["赞"]],[["賜"],["賜"],["赐"]],[["賞"],["賞"],["赏"]],[["賠"],["賠"],["赔"]],[["賢"],["賢"],["贤"]],[["賦"],["賦"],["赋"]],[["質"],["質"],["质"]],[["頼"],["賴"],["赖"]],[["贈"],["贈"],["赠"]],[["贓"],["贓"],["赃"]],[["躍"],["躍"],["跃"]],[["践"],["踐"],["践"]],[["踪"],["蹤"],["踪"]],[["車"],["車"],["车"]],[["軌"],["軌"],["轨"]],[["軒"],["軒"],["轩"]],[["軟"],["軟"],["软"]],[["転"],["轉"],["转"]],[["軸"],["軸"],["轴"]],[["軽"],["輕"],["轻"]],[["較"],["較"],["较"]],[["載"],["載"],["载"]],[["輝"],["輝"],["辉"]],[["輩"],["輩"],["辈"]],[["輪"],["輪"],["轮"]],[["輸"],["輸"],["输"]],[["轄"],["轄"],["辖"]],[["辞"],["辭"],["辞"]],[["辺"],["邊"],["边"]],[["達"],["達"],["达"]],[["遷"],["遷"],["迁"]],[["過"],["過"],["过"]],[["運"],["運"],["运"]],[["還"],["還"],["还"]],[["進"],["進"],["进"]],[["遠"],["遠"],["远"]],[["違"],["違"],["违"]],[["連"],["連"],["连"]],[["遅"],["遲"],["迟"]],[["適"],["適"],["适"]],[["選"],["選"],["选"]],[["逓"],["遞"],["递"]],[["遺"],["遺"],["遗"]],[["遥"],["遙"],["遥"]],[["郵"],["郵"],["邮"]],[["隣"],["鄰"],["邻"]],[["酔"],["醉"],["醉"]],[["醸"],["釀"],["酿"]],[["釈"],["釋"],["释"]],[["針"],["針"],["针"]],[["釣"],["釣"],["钓"]],[["鈍"],["鈍"],["钝"]],[["鈴"],["鈴"],["铃"]],[["鉄"],["鐵"],["铁"]],[["鉛"],["鉛"],["铅"]],[["鑑"],["鑑"],["鉴"]],[["銀"],["銀"],["银"]],[["銃"],["銃"],["铳"]],[["銅"],["銅"],["铜"]],[["銑"],["銑"],["铣"]],[["銘"],["銘"],["铭"]],[["銭"],["錢"],["钱"]],[["鋭"],["鋭"],["锐"]],[["鋳"],["鑄"],["铸"]],[["鋼"],["鋼"],["钢"]],[["錘"],["錘"],["锤"]],[["錠"],["錠"],["锭"]],[["錯"],["錯"],["错"]],[["鍾"],["鍾"],["钟"]],[["鎖"],["鎖"],["锁"]],[["鎮"],["鎮"],["镇"]],[["鏡"],["鏡"],["镜"]],[["長"],["長"],["长"]],[["門"],["門"],["门"]],[["閉"],["閉"],["闭"]],[["閑"],["閒"],["闲"]],[["間"],["間"],["间"]],[["閣"],["閣"],["阁"]],[["閥"],["閥"],["阀"]],[["閲"],["閲"],["阅"]],[["隊"],["隊"],["队"]],[["陽"],["陽"],["阳"]],[["陰"],["陰"],["阴"]],[["陣"],["陣"],["阵"]],[["階"],["階"],["阶"]],[["際"],["際"],["际"]],[["陸"],["陸"],["陆"]],[["陳"],["陳"],["陈"]],[["陥"],["陷"],["陷"]],[["随"],["隨"],["随"]],[["隠"],["隱"],["隐"]],[["隷"],["隷"],["隶"]],[["隷"],["隸"],["隶"]],[["難"],["難"],["难"]],[["鶏"],["雞"],["鸡"]],[["鶏"],["鷄"],["鸡"]],[["霧"],["霧"],["雾"]],[["静"],["靜"],["静"]],[["頂"],["頂"],["顶"]],[["項"],["項"],["项"]],[["順"],["順"],["顺"]],[["預"],["預"],["预"]],[["頑"],["頑"],["顽"]],[["頒"],["頒"],["颁"]],[["領"],["領"],["领"]],[["頻"],["頻"],["频"]],[["題"],["題"],["题"]],[["額"],["額"],["额"]],[["顔"],["顏"],["颜"]],[["風"],["風"],["风"]],[["飛"],["飛"],["飞"]],[["飢"],["饑"],["饥"]],[["飯"],["飯"],["饭"]],[["飲"],["飲"],["饮"]],[["飼"],["飼"],["饲"]],[["飽"],["飽"],["饱"]],[["飾"],["飾"],["饰"]],[["餓"],["餓"],["饿"]],[["馬"],["馬"],["马"]],[["駅"],["驛"],["驿"]],[["駆"],["驅"],["驱"]],[["駐"],["駐"],["驻"]],[["騎"],["騎"],["骑"]],[["験"],["驗"],["验"]],[["騒"],["騷"],["骚"]],[["騨"],["驔"],["驔"]],[["髄"],["髓"],["髓"]],[["髪"],["髮"],[null]],[["魚"],["魚"],["鱼"]],[["魯"],["魯"],["鲁"]],[["鮮"],["鮮"],["鲜"]],[["鯨"],["鯨"],["鲸"]],[["鳥"],["鳥"],["鸟"]],[["鳴"],["鳴"],["鸣"]],[["鶫"],["鶇"],["鸫"]],[["鶇"],["鶇"],["鸫"]],[["麦"],["麥"],["麦"]],[["黄"],["黃"],["黄"]],[["黒"],["黑"],["黑"]],[["黙"],["默"],["默"]],[["齢"],["齡"],["龄"]]],as.TABLE_SAFE=[[["会"],["會"],["会"]],[["箋"],["箋"],["笺"]],[["網"],["網"],["网"]],[["処"],["處"],["处"]],[["話"],["話"],["话"]],[["万"],["萬"],["万"]],[["与"],["與"],["与"]],[["醜"],["醜"],["丑"]],[["専"],["專"],["专"]],[["業"],["業"],["业"]],[["東"],["東"],["东"]],[["両"],["兩"],["两"]],[["厳"],["嚴"],["严"]],[["並"],["並"],["并"]],[["喪"],["喪"],["丧"]],[["豊"],["豐"],["丰"]],[["臨"],["臨"],["临"]],[["為"],["為"],["为"]],[["麗"],["麗"],["丽"]],[["挙"],["舉"],["举"]],[["廼"],["迺"],["迺"]],[["義"],["義"],["义"]],[["楽"],["樂"],["乐"]],[["乗"],["乘"],["乘"]],[["習"],["習"],["习"]],[["郷"],["鄉"],["乡"]],[["書"],["書"],["书"]],[["買"],["買"],["买"]],[["乱"],["亂"],["乱"]],[["亀"],["龜"],["龟"]],[["弐"],["貳"],["贰"]],[["雲"],["雲"],["云"]],[["亜"],["亞"],["亚"]],[["産"],["產"],["产"]],[["畝"],["畝"],["亩"]],[["親"],["親"],["亲"]],[["億"],["億"],["亿"]],[["僕"],["僕"],["仆"]],[["従"],["從"],["从"]],[["仏"],["佛"],["佛"]],[["倉"],["倉"],["仓"]],[["儀"],["儀"],["仪"]],[["仮"],["假"],["假"]],[["価"],["價"],["价"]],[["衆"],["眾"],["众"]],[["優"],["優"],["优"]],[["伝"],["傳"],["传"]],[["傘"],["傘"],["伞"]],[["偉"],["偉"],["伟"]],[["傷"],["傷"],["伤"]],[["倫"],["倫"],["伦"]],[["偽"],["偽"],["伪"]],[["体"],["體"],["体"]],[["余"],["餘"],["余"]],[["来"],["來"],["来"]],[["偵"],["偵"],["侦"]],[["側"],["側"],["侧"]],[["倹"],["儉"],["俭"]],[["倶"],["俱"],["俱"]],[["債"],["債"],["债"]],[["傾"],["傾"],["倾"]],[["償"],["償"],["偿"]],[["傑"],["傑"],["杰"]],[["備"],["備"],["备"]],[["当"],["當"],["当"]],[["尽"],["盡"],["尽"]],[["児"],["兒"],["儿"]],[["党"],["黨"],["党"]],[["内"],["內"],["内"]],[["関"],["關"],["关"]],[["興"],["興"],["兴"]],[["養"],["養"],["养"]],[["獣"],["獸"],["兽"]],[["円"],["圓"],["圆"]],[["写"],["寫"],["写"]],[["軍"],["軍"],["军"]],[["農"],["農"],["农"]],[["冨"],["富"],["富"]],[["氷"],["冰"],["冰"]],[["衝"],["衝"],["冲"]],[["決"],["決"],["决"]],[["凍"],["凍"],["冻"]],[["塗"],["塗"],["涂"]],[["幾"],["幾"],["几"]],[["撃"],["擊"],["击"]],[["画"],["劃"],["划"]],[["画"],["畫"],["画"]],[["則"],["則"],["则"]],[["剛"],["剛"],["刚"]],[["創"],["創"],["创"]],[["別"],["別"],["别"]],[["製"],["製"],["制"]],[["巻"],["卷"],["卷"]],[["刹"],["剎"],["刹"]],[["剤"],["劑"],["剂"]],[["剣"],["劍"],["剑"]],[["劇"],["劇"],["剧"]],[["剰"],["剩"],["剩"]],[["勧"],["勸"],["劝"]],[["務"],["務"],["务"]],[["動"],["動"],["动"]],[["励"],["勵"],["励"]],[["労"],["勞"],["劳"]],[["勢"],["勢"],["势"]],[["勲"],["勳"],["勋"]],[["勝"],["勝"],["胜"]],[["区"],["區"],["区"]],[["医"],["醫"],["医"]],[["華"],["華"],["华"]],[["協"],["協"],["协"]],[["単"],["單"],["单"]],[["売"],["賣"],["卖"]],[["衛"],["衛"],["卫"]],[["庁"],["廳"],["厅"]],[["圧"],["壓"],["压"]],[["県"],["縣"],["县"]],[["参"],["參"],["参"]],[["双"],["雙"],["双"]],[["収"],["收"],["收"]],[["発"],["發"],["发"]],[["変"],["變"],["变"]],[["畳"],["疊"],["叠"]],[["号"],["號"],["号"]],[["嘆"],["嘆"],["叹"]],[["嚇"],["嚇"],["吓"]],[["聴"],["聽"],["听"]],[["啓"],["啟"],["启"]],[["員"],["員"],["员"]],[["諮"],["諮"],["谘"]],[["鹹"],["鹹"],["咸"]],[["響"],["響"],["响"]],[["問"],["問"],["问"]],[["営"],["營"],["营"]],[["噴"],["噴"],["喷"]],[["嘱"],["囑"],["嘱"]],[["蘇"],["蘇"],["苏"]],[["団"],["團"],["团"]],[["園"],["園"],["园"]],[["国"],["國"],["国"]],[["囲"],["圍"],["围"]],[["図"],["圖"],["图"]],[["圏"],["圈"],["圈"]],[["聖"],["聖"],["圣"]],[["場"],["場"],["场"]],[["壊"],["壞"],["坏"]],[["塊"],["塊"],["块"]],[["堅"],["堅"],["坚"]],[["壇"],["壇"],["坛"]],[["墳"],["墳"],["坟"]],[["墜"],["墜"],["坠"]],[["塁"],["壘"],["垒"]],[["墾"],["墾"],["垦"]],[["執"],["執"],["执"]],[["堕"],["墮"],["堕"]],[["報"],["報"],["报"]],[["塩"],["鹽"],["盐"]],[["増"],["增"],["增"]],[["壌"],["壤"],["壤"]],[["壮"],["壯"],["壮"]],[["声"],["聲"],["声"]],[["壱"],["壹"],["壹"]],[["寿"],["壽"],["寿"]],[["夢"],["夢"],["梦"]],[["頭"],["頭"],["头"]],[["誇"],["誇"],["夸"]],[["奪"],["奪"],["夺"]],[["奮"],["奮"],["奋"]],[["奨"],["獎"],["奖"]],[["粧"],["妝"],["妆"]],[["婦"],["婦"],["妇"]],[["姉"],["姐"],["姐"]],[["姫"],["姬"],["姬"]],[["嬢"],["孃"],["娘"]],[["娯"],["娛"],["娱"]],[["孫"],["孫"],["孙"]],[["学"],["學"],["学"]],[["寧"],["寧"],["宁"]],[["宝"],["寶"],["宝"]],[["実"],["實"],["实"]],[["審"],["審"],["审"]],[["憲"],["憲"],["宪"]],[["宮"],["宮"],["宫"]],[["賓"],["賓"],["宾"]],[["秘"],["祕"],["秘"]],[["寝"],["寢"],["寝"]],[["対"],["對"],["对"]],[["尋"],["尋"],["寻"]],[["導"],["導"],["导"]],[["将"],["將"],["将"]],[["層"],["層"],["层"]],[["属"],["屬"],["属"]],[["歳"],["歲"],["岁"]],[["島"],["島"],["岛"]],[["巌"],["巖"],["巖"]],[["峡"],["峽"],["峡"]],[["険"],["險"],["险"]],[["幣"],["幣"],["币"]],[["帥"],["帥"],["帅"]],[["師"],["師"],["师"]],[["帳"],["帳"],["帐"]],[["帰"],["歸"],["归"]],[["広"],["廣"],["广"]],[["慶"],["慶"],["庆"]],[["庫"],["庫"],["库"]],[["応"],["應"],["应"]],[["廃"],["廢"],["废"]],[["開"],["開"],["开"]],[["弁"],["辨","瓣","辯"],["辨","瓣","辩"]],[["異"],["異"],["异"]],[["棄"],["棄"],["弃"]],[["張"],["張"],["张"]],[["弥"],["彌"],["弥"]],[["強"],["強"],["强"]],[["弾"],["彈"],["弹"]],[["録"],["錄"],["录"]],[["彦"],["彥"],["彥"]],[["徹"],["徹"],["彻"]],[["徴"],["徵"],["征"]],[["径"],["徑"],["径"]],[["徳"],["德"],["德"]],[["憶"],["憶"],["忆"]],[["誌"],["誌"],["志"]],[["憂"],["憂"],["忧"]],[["懐"],["懷"],["怀"]],[["態"],["態"],["态"]],[["総"],["總"],["总"]],[["恒"],["恆"],["恒"]],[["恋"],["戀"],["恋"]],[["懇"],["懇"],["恳"]],[["恵"],["惠"],["惠"]],[["悪"],["惡"],["恶"]],[["悩"],["惱"],["恼"]],[["悦"],["悅"],["悅"]],[["懸"],["懸"],["悬"]],[["驚"],["驚"],["惊"]],[["惨"],["慘"],["惨"]],[["懲"],["懲"],["惩"]],[["愛"],["愛"],["爱"]],[["憤"],["憤"],["愤"]],[["願"],["願"],["愿"]],[["慮"],["慮"],["虑"]],[["戯"],["戲"],["戏"]],[["戦"],["戰"],["战"]],[["戸"],["戶"],["户"]],[["払"],["拂"],["拂"]],[["拡"],["擴"],["扩"]],[["掃"],["掃"],["扫"]],[["揚"],["揚"],["扬"]],[["択"],["擇"],["择"]],[["護"],["護"],["护"]],[["担"],["擔"],["担"]],[["拝"],["拜"],["拜"]],[["擬"],["擬"],["拟"]],[["拠"],["據"],["据"]],[["擁"],["擁"],["拥"]],[["挟"],["挾"],["挟"]],[["揮"],["揮"],["挥"]],[["挿"],["插"],["插"]],[["損"],["損"],["损"]],[["捨"],["捨"],["舍"]],[["掲"],["揭"],["揭"]],[["掴"],["摑"],["掴"]],[["揺"],["搖"],["摇"]],[["敵"],["敵"],["敌"]],[["敗"],["敗"],["败"]],[["数"],["數"],["数"]],[["斉"],["齊"],["齐"]],[["斎"],["齋"],["斋"]],[["断"],["斷"],["断"]],[["旧"],["舊"],["旧"]],[["時"],["時"],["时"]],[["曇"],["曇"],["昙"]],[["昼"],["晝"],["昼"]],[["顕"],["顯"],["显"]],[["暁"],["曉"],["晓"]],[["晩"],["晚"],["晚"]],[["暫"],["暫"],["暂"]],[["曽"],["曾"],["曾"]],[["術"],["術"],["术"]],[["樸"],["樸"],["朴"]],[["機"],["機"],["机"]],[["殺"],["殺"],["杀"]],[["雑"],["雜"],["杂"]],[["権"],["權"],["权"]],[["条"],["條"],["条"]],[["極"],["極"],["极"]],[["枢"],["樞"],["枢"]],[["槍"],["槍"],["枪"]],[["査"],["查"],["查"]],[["栄"],["榮"],["荣"]],[["標"],["標"],["标"]],[["桟"],["棧"],["栈"]],[["棟"],["棟"],["栋"]],[["欄"],["欄"],["栏"]],[["樹"],["樹"],["树"]],[["様"],["樣"],["样"]],[["桜"],["櫻"],["樱"]],[["橋"],["橋"],["桥"]],[["検"],["檢"],["检"]],[["楼"],["樓"],["楼"]],[["歓"],["歡"],["欢"]],[["欧"],["歐"],["欧"]],[["歩"],["步"],["步"]],[["歯"],["齒"],["齿"]],[["残"],["殘"],["残"]],[["殴"],["毆"],["殴"]],[["気"],["氣"],["气"]],[["漢"],["漢"],["汉"]],[["湯"],["湯"],["汤"]],[["溝"],["溝"],["沟"]],[["沢"],["澤"],["泽"]],[["涙"],["淚"],["泪"]],[["滝"],["瀧"],["泷"]],[["潔"],["潔"],["洁"]],[["浅"],["淺"],["浅"]],[["濁"],["濁"],["浊"]],[["測"],["測"],["测"]],[["済"],["濟"],["济"]],[["濃"],["濃"],["浓"]],[["浜"],["濱"],["滨"]],[["渋"],["涉","澀"],["涉","涩"]],[["渦"],["渦"],["涡"]],[["潤"],["潤"],["润"]],[["漬"],["漬"],["渍"]],[["漸"],["漸"],["渐"]],[["渓"],["溪"],["溪"]],[["漁"],["漁"],["渔"]],[["湾"],["灣"],["湾"]],[["湿"],["濕"],["湿"]],[["満"],["滿"],["满"]],[["滅"],["滅"],["灭"]],[["滞"],["滯"],["滞"]],[["濫"],["濫"],["滥"]],[["瀬"],["瀨"],["濑"]],[["灯"],["燈"],["灯"]],[["霊"],["靈"],["灵"]],[["炉"],["爐"],["炉"]],[["点"],["點"],["点"]],[["錬"],["鍊"],["炼"]],[["練"],["練"],["练"]],[["煙"],["煙"],["烟"]],[["煩"],["煩"],["烦"]],[["焼"],["燒"],["烧"]],[["熱"],["熱"],["热"]],[["焔"],["焰"],["焰"]],[["鍛"],["鍛"],["锻"]],[["犠"],["犧"],["牺"]],[["状"],["狀"],["状"]],[["猶"],["猶"],["犹"]],[["独"],["獨"],["独"]],[["狭"],["狹"],["狭"]],[["獄"],["獄"],["狱"]],[["猟"],["獵"],["猎"]],[["猫"],["貓"],["猫"]],[["献"],["獻"],["献"]],[["環"],["環"],["环"]],[["現"],["現"],["现"]],[["璽"],["璽"],["玺"]],[["電"],["電"],["电"]],[["療"],["療"],["疗"]],[["監"],["監"],["监"]],[["蓋"],["蓋"],["盖"]],[["盤"],["盤"],["盘"]],[["視"],["視"],["视"]],[["着"],["著"],["著"]],[["矯"],["矯"],["矫"]],[["鉱"],["礦"],["矿"]],[["砕"],["碎"],["碎"]],[["礎"],["礎"],["础"]],[["確"],["確"],["确"]],[["礼"],["禮"],["礼"]],[["禍"],["禍"],["祸"]],[["禅"],["禪"],["禅"]],[["離"],["離"],["离"]],[["種"],["種"],["种"]],[["積"],["積"],["积"]],[["称"],["稱"],["称"]],[["稲"],["稻"],["稻"]],[["穏"],["穩"],["稳"]],[["穀"],["穀"],["谷"]],[["穂"],["穗"],["穗"]],[["窮"],["窮"],["穷"]],[["窃"],["竊"],["窃"]],[["窓"],["窗"],["窗"]],[["竜"],["龍"],["龙"]],[["競"],["競"],["竞"]],[["篤"],["篤"],["笃"]],[["筆"],["筆"],["笔"]],[["築"],["築"],["筑"]],[["簡"],["簡"],["简"]],[["節"],["節"],["节"]],[["範"],["範"],["范"]],[["類"],["類"],["类"]],[["粋"],["粹"],["粹"]],[["粛"],["肅"],["肃"]],[["糧"],["糧"],["粮"]],[["糾"],["糾"],["纠"]],[["紀"],["紀"],["纪"]],[["約"],["約"],["约"]],[["紅"],["紅"],["红"]],[["紋"],["紋"],["纹"]],[["納"],["納"],["纳"]],[["純"],["純"],["纯"]],[["紙"],["紙"],["纸"]],[["級"],["級"],["级"]],[["紛"],["紛"],["纷"]],[["紡"],["紡"],["纺"]],[["緊"],["緊"],["紧"]],[["細"],["細"],["细"]],[["紳"],["紳"],["绅"]],[["紹"],["紹"],["绍"]],[["紺"],["紺"],["绀"]],[["終"],["終"],["终"]],[["組"],["組"],["组"]],[["経"],["經"],["经"]],[["結"],["結"],["结"]],[["絶"],["絕"],["绝"]],[["絞"],["絞"],["绞"]],[["絡"],["絡"],["络"]],[["給"],["給"],["给"]],[["統"],["統"],["统"]],[["絵"],["繪"],["绘"]],[["絹"],["絹"],["绢"]],[["継"],["繼"],["继"]],[["続"],["續"],["续"]],[["緑"],["綠"],["绿"]],[["線"],["線"],["线"]],[["維"],["維"],["维"]],[["綱"],["綱"],["纲"]],[["綿"],["綿"],["绵"]],[["緒"],["緒"],["绪"]],[["締"],["締"],["缔"]],[["縁"],["緣"],["缘"]],[["編"],["編"],["编"]],[["緩"],["緩"],["缓"]],[["緯"],["緯"],["纬"]],[["縄"],["繩"],["绳"]],[["縛"],["縛"],["缚"]],[["縦"],["縱"],["纵"]],[["縫"],["縫"],["缝"]],[["縮"],["縮"],["缩"]],[["繊"],["纖"],["纤"]],[["績"],["績"],["绩"]],[["織"],["織"],["织"]],[["繕"],["繕"],["缮"]],[["繭"],["繭"],["茧"]],[["繰"],["繰"],["缲"]],[["缶"],["罐"],["罐"]],[["鉢"],["鉢"],["钵"]],[["羅"],["羅"],["罗"]],[["罸"],["罰"],["罚"]],[["罷"],["罷"],["罢"]],[["罵"],["罵"],["骂"]],[["職"],["職"],["职"]],[["聞"],["聞"],["闻"]],[["聡"],["聰"],["聪"]],[["腸"],["腸"],["肠"]],[["膚"],["膚"],["肤"]],[["脹"],["脹"],["胀"]],[["脅"],["脅"],["胁"]],[["胆"],["膽"],["胆"]],[["臓"],["臟"],["脏"]],[["脳"],["腦"],["脑"]],[["脚"],["腳"],["脚"]],[["騰"],["騰"],["腾"]],[["舗"],["舖"],["铺"]],[["館"],["館"],["馆"]],[["艦"],["艦"],["舰"]],[["芸"],["藝"],["艺"]],[["茎"],["莖"],["茎"]],[["薦"],["薦"],["荐"]],[["薬"],["藥"],["药"]],[["蛍"],["螢"],["萤"]],[["蒋"],["蔣"],["蒋"]],[["蔵"],["藏"],["藏"]],[["虜"],["虜"],["虏"]],[["虚"],["虛"],["虚"]],[["虫"],["蟲"],["虫"]],[["蝕"],["蝕"],["蚀"]],[["蚕"],["蠶"],["蚕"]],[["蛮"],["蠻"],["蛮"]],[["補"],["補"],["补"]],[["襲"],["襲"],["袭"]],[["装"],["裝"],["装"]],[["裏"],["裡"],["里"]],[["覇"],["霸"],["霸"]],[["見"],["見"],["见"]],[["観"],["觀"],["观"]],[["規"],["規"],["规"]],[["覚"],["覺"],["觉"]],[["覧"],["覽"],["览"]],[["触"],["觸"],["触"]],[["訂"],["訂"],["订"]],[["計"],["計"],["计"]],[["討"],["討"],["讨"]],[["訓"],["訓"],["训"]],[["記"],["記"],["记"]],[["訟"],["訟"],["讼"]],[["訪"],["訪"],["访"]],[["設"],["設"],["设"]],[["許"],["許"],["许"]],[["訳"],["譯"],["译"]],[["訴"],["訴"],["诉"]],[["診"],["診"],["诊"]],[["証"],["證"],["证"]],[["詐"],["詐"],["诈"]],[["詔"],["詔"],["诏"]],[["評"],["評"],["评"]],[["詛"],["詛"],["诅"]],[["詞"],["詞"],["词"]],[["試"],["試"],["试"]],[["詩"],["詩"],["诗"]],[["詰"],["詰"],["诘"]],[["該"],["該"],["该"]],[["詳"],["詳"],["详"]],[["誉"],["譽"],["誉"]],[["謄"],["謄"],["誊"]],[["認"],["認"],["认"]],[["誕"],["誕"],["诞"]],[["誘"],["誘"],["诱"]],[["語"],["語"],["语"]],[["誠"],["誠"],["诚"]],[["誤"],["誤"],["误"]],[["説"],["說"],["说"]],[["読"],["讀"],["读"]],[["誰"],["誰"],["谁"]],[["課"],["課"],["课"]],[["調"],["調"],["调"]],[["談"],["談"],["谈"]],[["請"],["請"],["请"]],[["論"],["論"],["论"]],[["諭"],["諭"],["谕"]],[["諸"],["諸"],["诸"]],[["諾"],["諾"],["诺"]],[["謀"],["謀"],["谋"]],[["謁"],["謁"],["谒"]],[["謎"],["謎"],["谜"]],[["謙"],["謙"],["谦"]],[["講"],["講"],["讲"]],[["謝"],["謝"],["谢"]],[["謡"],["謠"],["谣"]],[["謹"],["謹"],["谨"]],[["識"],["識"],["识"]],[["譜"],["譜"],["谱"]],[["議"],["議"],["议"]],[["譲"],["讓"],["让"]],[["貝"],["貝"],["贝"]],[["貞"],["貞"],["贞"]],[["負"],["負"],["负"]],[["財"],["財"],["财"]],[["貢"],["貢"],["贡"]],[["貧"],["貧"],["贫"]],[["貨"],["貨"],["货"]],[["販"],["販"],["贩"]],[["貪"],["貪"],["贪"]],[["責"],["責"],["责"]],[["貯"],["貯"],["贮"]],[["貴"],["貴"],["贵"]],[["貸"],["貸"],["贷"]],[["費"],["費"],["费"]],[["貿"],["貿"],["贸"]],[["賀"],["賀"],["贺"]],[["賃"],["賃"],["赁"]],[["賄"],["賄"],["贿"]],[["資"],["資"],["资"]],[["賊"],["賊"],["贼"]],[["賎"],["賤"],["贱"]],[["賛"],["贊"],["赞"]],[["賜"],["賜"],["赐"]],[["賞"],["賞"],["赏"]],[["賠"],["賠"],["赔"]],[["賢"],["賢"],["贤"]],[["賦"],["賦"],["赋"]],[["質"],["質"],["质"]],[["頼"],["賴"],["赖"]],[["贈"],["贈"],["赠"]],[["贓"],["贓"],["赃"]],[["躍"],["躍"],["跃"]],[["践"],["踐"],["践"]],[["踪"],["蹤"],["踪"]],[["車"],["車"],["车"]],[["軌"],["軌"],["轨"]],[["軒"],["軒"],["轩"]],[["軟"],["軟"],["软"]],[["転"],["轉"],["转"]],[["軸"],["軸"],["轴"]],[["軽"],["輕"],["轻"]],[["較"],["較"],["较"]],[["載"],["載"],["载"]],[["輝"],["輝"],["辉"]],[["輩"],["輩"],["辈"]],[["輪"],["輪"],["轮"]],[["輸"],["輸"],["输"]],[["轄"],["轄"],["辖"]],[["辞"],["辭"],["辞"]],[["辺"],["邊"],["边"]],[["達"],["達"],["达"]],[["遷"],["遷"],["迁"]],[["過"],["過"],["过"]],[["運"],["運"],["运"]],[["還"],["還"],["还"]],[["進"],["進"],["进"]],[["遠"],["遠"],["远"]],[["違"],["違"],["违"]],[["連"],["連"],["连"]],[["遅"],["遲"],["迟"]],[["適"],["適"],["适"]],[["選"],["選"],["选"]],[["逓"],["遞"],["递"]],[["遺"],["遺"],["遗"]],[["遥"],["遙"],["遥"]],[["郵"],["郵"],["邮"]],[["隣"],["鄰"],["邻"]],[["酔"],["醉"],["醉"]],[["醸"],["釀"],["酿"]],[["釈"],["釋"],["释"]],[["針"],["針"],["针"]],[["釣"],["釣"],["钓"]],[["鈍"],["鈍"],["钝"]],[["鈴"],["鈴"],["铃"]],[["鉄"],["鐵"],["铁"]],[["鉛"],["鉛"],["铅"]],[["鑑"],["鑑"],["鉴"]],[["銀"],["銀"],["银"]],[["銃"],["銃"],["铳"]],[["銅"],["銅"],["铜"]],[["銑"],["銑"],["铣"]],[["銘"],["銘"],["铭"]],[["銭"],["錢"],["钱"]],[["鋭"],["鋭"],["锐"]],[["鋳"],["鑄"],["铸"]],[["鋼"],["鋼"],["钢"]],[["錘"],["錘"],["锤"]],[["錠"],["錠"],["锭"]],[["錯"],["錯"],["错"]],[["鍾"],["鍾"],["钟"]],[["鎖"],["鎖"],["锁"]],[["鎮"],["鎮"],["镇"]],[["鏡"],["鏡"],["镜"]],[["長"],["長"],["长"]],[["門"],["門"],["门"]],[["閉"],["閉"],["闭"]],[["閑"],["閒"],["闲"]],[["間"],["間"],["间"]],[["閣"],["閣"],["阁"]],[["閥"],["閥"],["阀"]],[["閲"],["閲"],["阅"]],[["隊"],["隊"],["队"]],[["陽"],["陽"],["阳"]],[["陰"],["陰"],["阴"]],[["陣"],["陣"],["阵"]],[["階"],["階"],["阶"]],[["際"],["際"],["际"]],[["陸"],["陸"],["陆"]],[["陳"],["陳"],["陈"]],[["陥"],["陷"],["陷"]],[["随"],["隨"],["随"]],[["隠"],["隱"],["隐"]],[["隷"],["隸"],["隶"]],[["難"],["難"],["难"]],[["霧"],["霧"],["雾"]],[["静"],["靜"],["静"]],[["頂"],["頂"],["顶"]],[["項"],["項"],["项"]],[["順"],["順"],["顺"]],[["頑"],["頑"],["顽"]],[["頒"],["頒"],["颁"]],[["領"],["領"],["领"]],[["頻"],["頻"],["频"]],[["題"],["題"],["题"]],[["額"],["額"],["额"]],[["顔"],["顏"],["颜"]],[["風"],["風"],["风"]],[["飛"],["飛"],["飞"]],[["飢"],["饑"],["饥"]],[["飯"],["飯"],["饭"]],[["飲"],["飲"],["饮"]],[["飼"],["飼"],["饲"]],[["飽"],["飽"],["饱"]],[["飾"],["飾"],["饰"]],[["餓"],["餓"],["饿"]],[["馬"],["馬"],["马"]],[["駅"],["驛"],["驿"]],[["駆"],["驅"],["驱"]],[["駐"],["駐"],["驻"]],[["騎"],["騎"],["骑"]],[["験"],["驗"],["验"]],[["騒"],["騷"],["骚"]],[["騨"],["驔"],["驔"]],[["髄"],["髓"],["髓"]],[["魚"],["魚"],["鱼"]],[["魯"],["魯"],["鲁"]],[["鮮"],["鮮"],["鲜"]],[["鯨"],["鯨"],["鲸"]],[["鳥"],["鳥"],["鸟"]],[["鳴"],["鳴"],["鸣"]],[["麦"],["麥"],["麦"]],[["黄"],["黃"],["黄"]],[["黒"],["黑"],["黑"]],[["黙"],["默"],["默"]],[["齢"],["齡"],["龄"]]],function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.ZHJP_TABLE_SAFE=h.ZHJP_TABLE=h.TABLE_SAFE=h.TABLE=void 0;const z=a,t=as;Object.defineProperty(h,"TABLE",{enumerable:!0,get:function(){return t.TABLE}}),Object.defineProperty(h,"TABLE_SAFE",{enumerable:!0,get:function(){return t.TABLE_SAFE}});const s=as;Object.defineProperty(h,"ZHJP_TABLE",{enumerable:!0,get:function(){return s.TABLE}}),Object.defineProperty(h,"ZHJP_TABLE_SAFE",{enumerable:!0,get:function(){return s.TABLE_SAFE}}),z.__exportStar(as,h),h.default=t.TABLE;}(is),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.defaultOptions=h.TABLE_SAFE=h.TABLE=h.ZHJP_TABLE_SAFE=h.ZHJP_TABLE=void 0;const z=a,t=es;Object.defineProperty(h,"TABLE",{enumerable:!0,get:function(){return t.TABLE}}),Object.defineProperty(h,"TABLE_SAFE",{enumerable:!0,get:function(){return t.TABLE_SAFE}}),z.__exportStar(rs,h),z.__exportStar(ns,h);const s=is;Object.defineProperty(h,"ZHJP_TABLE",{enumerable:!0,get:function(){return s.ZHJP_TABLE}}),Object.defineProperty(h,"ZHJP_TABLE_SAFE",{enumerable:!0,get:function(){return s.ZHJP_TABLE_SAFE}}),h.defaultOptions={safe:!0},h.default=h;}(js);var cs={};!function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.lazyAll=h.jp2zh=h.zh2jp=h.zhs2jp=h.zht2jp=h.jp2zhs=h.jp2zht=h._fromA2B=void 0;const z=mt,t=rs,s=es;function p(h,t,p,j={}){const e=j&&j.safe?s.TABLE_SAFE:s.TABLE;if(e[t]&&e[p]){let s=[];return e[t][h]&&(e[t][h][p]&&s.push(e[t][h][p]),Object.values(e[p]).forEach((z=>{z[t]===h&&z[p]&&s.push(z[p]);})),j&&j.includeSelf&&s.push(h),s=(0, z.array_unique_overwrite)(s)),s}throw new RangeError(`${t}, ${p} is not exists in TABLE`)}function j(h,z){return p(h,t.KEY_JP,t.KEY_ZHT,z)}function e(h,z){return p(h,t.KEY_JP,t.KEY_ZHS,z)}function r(h,z){return p(h,t.KEY_ZHT,t.KEY_JP,z)}function n(h,z){return p(h,t.KEY_ZHS,t.KEY_JP,z)}function u(h,t){let s=r(h,t).concat(n(h,t));return (0, z.array_unique_overwrite)(s)}function o(h,t){let s=j(h,t).concat(e(h,t));return (0, z.array_unique_overwrite)(s)}h._fromA2B=p,h.jp2zht=j,h.jp2zhs=e,h.zht2jp=r,h.zhs2jp=n,h.zh2jp=u,h.jp2zh=o,h.lazyAll=function(h,t){let s=u(h,t).reduce(((h,z)=>(h.push(z,...o(z,t)),h)),[]).concat(o(h,t).reduce(((h,z)=>(h.push(z,...u(z,t)),h)),[]));return (0, z.array_unique_overwrite)(s)},h.default=h;}(cs);var ls={},fs={},gs={};Object.defineProperty(gs,"__esModule",{value:!0}),gs.reToStringList=void 0;const _s=a.__importDefault(Nt),ds=mt;gs.reToStringList=function(h,z){const t=h.source.replace(/^.*\[|\].*$/gu,""),s=_s.default.split(t,"").concat(z).sort();return (0, ds.array_unique_overwrite)(s)},Object.defineProperty(fs,"__esModule",{value:!0}),fs._greedyTableBuild=void 0;const ys=mt,bs=gs;fs._greedyTableBuild=function(h){const z=h;let t,s;t=new Map;const p=z.reduce((function(h,z){const s=(0, bs.reToStringList)(z[0],z[1]);return s.forEach((h=>{t.set(h,s);})),h.push(...s),h}),[]);return s=new RegExp(`[${(0, ys.array_unique)(p).join("")}]`,"u"),{_greedyTableCacheRegexp:z,_greedyTableCacheMap:t,_greedyTableCacheTest:s}};var vs={},Os={};Object.defineProperty(Os,"__esModule",{value:!0}),Os._greedyTableCacheRegexp=void 0,Os._greedyTableCacheRegexp=[[/[噁悪惡]/g,"恶"],[/[繋繫係]/g,"系"],[/[糊鬍葫衚楜煳]/g,"胡"],[/[儅噹當]/g,"当"],[/[復複覆]/g,"复"],[/[囌蘇甦]/g,"苏"],[/[採彩睬踩埰綵䌽倸]/g,"采"],[/[囉啰羅㑩儸萝蘿箩籮]/g,"罗"],[/[浏瀏劉]/g,"刘"],[/[劵卷巻捲蜷]/g,"券"],[/[划劃畫]/g,"画"],[/[鬥闘鬭鬪]/g,"斗"],[/[乾亁乹幹]/g,"干"],[/[図图]/g,"圖"],[/[暦曆歴歷]/g,"历"],[/[麪麵麺]/g,"面"],[/[讃讚賛贊赞]/g,"赞"],[/[發髪髮]/g,"发"],[/[侭儘盡]/g,"尽"],[/[優忧憂]/g,"忧"],[/[俱倶]/g,"具"],[/[之的得]/g,"の"],[/[與与]/g,"と"],[/[她他牠祂佗]/g,"它"],[/[支隻枝祇]/g,"只"],[/[炮砲炰]/g,"泡"],[/[仲㊥]/g,"中"],[/[原]/g,"元"],[/[迴廻]/g,"回"],[/[避闢]/g,"辟"],[/[滷鹵卤鲁]/g,"魯"],[/[檯臺颱儓]/g,"台"],[/[宻祕秘]/g,"密"],[/[謎谜]/g,"迷"],[/[砂莎紗纱]/g,"沙"],[/[編篇编]/g,"篇"],[/[冶]/g,"治"],[/[䃛炼練练錬鍊鏈链𧹯𫔀]/gu,"煉"],[/[亞亚婭娅椏桠亜]/gu,"亚"],[/[塞賽]/gu,"赛"],[/[腾騰籐籘]/gu,"藤"],[/[妳祢禰]/gu,"你"],[/[喰飠⻞飧蝕蚀]/gu,"食"],[/[瑪馬玛]/gu,"马"],[/[餸餚]/gu,"餚"],[/[裸]/gu,"果"],[/[凱凯鎧铠]/gu,"凱"],[/[帖贴]/gu,"貼"],[/[甚]/gu,"什"],[/[聯联連连]/gu,"連"],[/[像]/gu,"象"],[/[藉]/gu,"借"],[/[蕾鐳镭靁]/gu,"雷"],[/[訂订釘钉]/gu,"定"],[/[嚮]/gu,"向"],[/[糸糹丝]/gu,"絲"],[/[筒]/gu,"桶"],[/[兹玆滋]/gu,"茲"],[/[呐訥讷]/gu,"吶"],[/[穀糓]/gu,"谷"],[/[两兩倆俩]/gu,"両"],[/[帳賬账]/gu,"帐"],[/[板版闆阪]/gu,"坂"],[/[待獃]/gu,"呆"],[/[熔鎔镕融螎]/gu,"溶"],[/[匯汇]/gu,"彙"],[/[彿仏拂弗]/gu,"佛"],[/[阿]/gu,"啊"],[/[家]/gu,"傢"],[/[曝爆]/gu,"暴"],[/[䋄䋞冈刚剛堈岗岡崗綱網纲缸鋼钢]/gu,"网"],[/[註]/gu,"注"],[/[灌贯潅]/gu,"貫"],[/[倒]/gu,"到"],[/[儭秤称稱衬襯]/gu,"平"],[/[勛勲勳]/gu,"勋"],[/[麗丽莉]/gu,"利"],[/[已巳]/gu,"己"],[/[嗬]/gu,"呵"],[/[哊哟唷唹喲]/gu,"呦"],[/[婕杰洁潔絜]/gu,"傑"],[/[嘻]/gu,"嬉"],[/[痲痳嘛]/gu,"麻"],[/[狗]/gu,"犬"],[/[亙恆恒]/gu,"亘"],[/[附副]/gu,"付"],[/[伽枷珈迦]/gu,"加"],[/[褔]/gu,"福"],[/[捱]/gu,"挨"],[/[拼]/gu,"拚"],[/[飄飘飃]/gu,"漂"],[/[佔沾]/gu,"占"],[/[気氣汽滊炁]/gu,"气"],[/[撩遼]/gu,"辽"],[/[做]/gu,"作"],[/[搜捜]/gu,"蒐"],[/[叟傁]/gu,"叟"],[/[谢榭]/gu,"謝"],[/[形行]/gu,"型"],[/[雇頋顧顾]/gu,"僱"],[/[廬芦蘆]/gu,"庐"],[/[耽躭]/gu,"眈"],[/[傹竟競竸誩𥪰𧡟𧫘𧫙𧮣𨐼]/gu,"竞"],[/[殖]/gu,"植"],[/[佬姥]/gu,"老"],[/[倖]/gu,"幸"],[/[㠪炬矩鉅钜榘]/gu,"巨"],[/[刴剁剐剮劏]/gu,"㓥"],[/[枏楠]/gu,"南"],[/[璐𡽘𨱴]/gu,"路"],[/[侂拓杔託讬拖拕]/gu,"托"],[/[悕睎稀]/gu,"希"],[/[帼幗国國]/gu,"囯"],[/[返]/gu,"反"],[/[扬揚旸暘杨楊炀烊煬阳陽]/gu,"佯"],[/[来莱萊]/gu,"來"],[/[葆堡褓緥]/gu,"保"],[/[渡]/gu,"度"],[/[剳札箚紮劄]/gu,"扎"],[/[媞提湜禔緹缇隄]/gu,"堤"],[/[臘蜡蠟]/gu,"腊"],[/[鬱𨚼𨟝]/gu,"郁"],[/[擀杆桿]/gu,"扞"],[/[脼郞𥇑]/gu,"郎"],[/[芭]/gu,"巴"],[/[涅湼]/gu,"捏"],[/[择擇沢泽澤]/gu,"択"],[/[幵開]/gu,"开"],[/[珮]/gu,"佩"],[/[喩籲龥吁]/gu,"喻"],[/[值値]/gu,"直"],[/[臓臟贓赃髒]/gu,"脏"],[/[㊤]/gu,"上"],[/[㊦]/gu,"下"],[/[唿]/gu,"呼"],[/[詳详]/gu,"祥"],[/[妮泥]/gu,"尼"],[/[剋尅]/gu,"克"],[/[撥播]/gu,"拨"],[/[挿揷]/gu,"插"],[/[汀]/gu,"丁"],[/[娜哪]/gu,"那"],[/[菈]/gu,"拉"],[/[玲琳鈴铃淋]/gu,"林"],[/[銘铭]/gu,"名"],[/[齣]/gu,"出"],[/[欸誒诶]/gu,"唉"],[/[哞姆]/gu,"呣"],[/[㖿吔]/gu,"耶"],[/[魅]/gu,"媚"],[/[扉斐緋绯翡菲蜚誹诽霏非]/gu,"匪"],[/[衩釵钗]/gu,"叉"],[/[淇琪祺]/gu,"其"],[/[壇談譚谈谭]/gu,"坛"],[/[材柴]/gu,"才"],[/[唸]/gu,"念"],[/[趾]/gu,"指"],[/[仕]/gu,"士"],[/[嬢孃]/gu,"娘"],[/[哑唖瘂痖]/gu,"啞"],[/[动働仂]/gu,"動"],[/[查査]/gu,"察"],[/[鉄銕鐡鐵铁𨫓]/gu,"鉃"],[/[归歸皈]/gu,"帰"],[/[瘡疮創]/gu,"创"],[/[拷烤]/gu,"考"],[/[込]/gu,"入"],[/[伦侖倫]/gu,"仑"],[/[仔]/gu,"子"],[/[彎湾灣]/gu,"弯"],[/[荧萤蛍螢]/gu,"熒"],[/[挣掙爭]/gu,"争"],[/[漲胀脹]/gu,"涨"],[/[無冇沒没]/gu,"无"],[/[噸訰]/gu,"吨"],[/[鈎鉤钩]/gu,"勾"],[/[沉]/gu,"沈"],[/[畳疊迭]/gu,"叠"],[/[繮缰韁僵疆]/gu,"殭"],[/[背]/gu,"揹"],[/[団團糰]/gu,"团"],[/[榚]/gu,"糕"],[/[須须鬚]/gu,"需"],[/[紆紓纡纾]/gu,"抒"],[/[洲]/gu,"州"],[/[厰場廠场]/gu,"厂"],[/[筿篠]/gu,"筱"],[/[跟]/gu,"根"],[/[㬅嫚曼熳蔓]/gu,"漫"],[/[昇陞]/gu,"升"],[/[煙腌菸醃]/gu,"烟"],[/[錄録陆陸]/gu,"录"],[/[擄虏虜]/gu,"掳"],[/[翹跷蹺]/gu,"翘"],[/[腳角]/gu,"脚"],[/[词辞辭]/gu,"詞"],[/[意義]/gu,"义"],[/[梗]/gu,"哏"],[/[咫尺]/gu,"呎"],[/[怜憐]/gu,"伶"],[/[荽萎]/gu,"委"],[/[岺嶺阾領领]/gu,"岭"],[/[決絕絶绝訣诀]/gu,"决"],[/[嶽𡶦]/gu,"岳"],[/[授]/gu,"受"],[/[線线缐腺]/gu,"綫"],[/[壱壹]/gu,"一"],[/[荒]/gu,"慌"],[/[廷]/gu,"庭"],[/[喧暄諠煊]/gu,"宣"],[/[略畧]/gu,"掠"],[/[牋笺签箋簽籖籤]/gu,"䇳"],[/[幺庅麼麽]/gu,"么"],[/[芒茫]/gu,"杧"],[/[跃躍]/gu,"趯"],[/[弥彌瀰弭㳽]/gu,"米"],[/[袜襪]/gu,"抹"],[/[囪囱窓窗窻]/gu,"䆫"],[/[凾涵]/gu,"函"],[/[耸聳]/gu,"悚"],[/[落]/gu,"洛"],[/[標鏢鑣镳镖]/gu,"标"],[/[恠]/gu,"怪"],[/[併倂并幷竝𠀤]/gu,"並"],[/[鶫鸫𪂝]/gu,"鶇"],[/[鉑铂]/gu,"白"],[/[弔]/gu,"吊"],[/[誡诫𢌵]/gu,"戒"],[/[窟]/gu,"堀"],[/[厲砺礪]/gu,"厉"],[/[島嶋]/gu,"岛"],[/[再]/gu,"在"],[/[淪輪轮]/gu,"沦"],[/[磨]/gu,"摩"],[/[傍彷徬]/gu,"旁"],[/[戇灨贑贛赣𥫔𧹄𧹉]/gu,"戆"],[/[萨蕯薩]/gu,"撒"],[/[崕漄厓]/gu,"崖"],[/[巌壧嵒巖巗碞礹𡾏]/gu,"岩"],[/[譟]/gu,"噪"],[/[彫琱雕鵰]/gu,"凋"],[/[衊]/gu,"蔑"],[/[汚污誣诬]/gu,"汙"],[/[闇黯]/gu,"暗"],[/[幪懞懵曚朦濛矇]/gu,"蒙"],[/[摆襬]/gu,"擺"],[/[搀摻攙]/gu,"掺"],[/[啣銜]/gu,"衔"],[/[媮]/gu,"偷"],[/[漩碹鏇镟]/gu,"旋"],[/[澹]/gu,"淡"],[/[惶徨]/gu,"皇"],[/[鞦]/gu,"秋"],[/[閧鬨]/gu,"哄"],[/[嗯摁]/gu,"恩"],[/[楔偰]/gu,"契"],[/[座]/gu,"坐"],[/[崎嵜碕]/gu,"埼"],[/[徴徵怔愣]/gu,"征"],[/[份芬]/gu,"分"],[/[嫒嬡爱瑷璦]/gu,"愛"],[/[性]/gu,"姓"],[/[嬌驕骄]/gu,"娇"],[/[招]/gu,"召"],[/[薇]/gu,"微"],[/[熬璈遨傲]/gu,"敖"],[/[奧澳袄襖]/gu,"奥"],[/[震]/gu,"振"],[/[恬]/gu,"忝"],[/[擔檐簷]/gu,"担"],[/[瞑]/gu,"冥"],[/[妇媍]/gu,"婦"],[/[䰗阄鬮𨷺]/gu,"䦰"],[/[箒菷掃扫]/gu,"帚"],[/[拣揀撿检検檢]/gu,"捡"],[/[濂簾]/gu,"帘"],[/[妓技]/gu,"伎"],[/[珐琺]/gu,"法"],[/[暉煇輝辉𪸩]/gu,"晖"],[/[炫眩]/gu,"昡"],[/[逾]/gu,"踰"],[/[茜]/gu,"西"],[/[堪]/gu,"勘"],[/[篱籬]/gu,"筣"],[/[箆篦]/gu,"笓"],[/[倉怆愴沧滄舱艙苍蒼]/gu,"仓"],[/[幾机機]/gu,"几"],[/[徹澈]/gu,"彻"],[/[個各箇]/gu,"个"],[/[乆灸玖镹]/gu,"久"],[/[鳞麐麟]/gu,"鱗"],[/[翦]/gu,"剪"],[/[僖憙禧囍]/gu,"喜"],[/[㷉慰熨罻]/gu,"尉"],[/[勐]/gu,"猛"],[/[湌飡]/gu,"餐"],[/[逬]/gu,"迸"],[/[埜]/gu,"野"],[/[吐]/gu,"土"],[/[婉惌琬碗]/gu,"宛"],[/[鈺]/gu,"玉"],[/[妤兪伃諭谕瑜]/gu,"俞"],[/[毓]/gu,"育"],[/[椿樁]/gu,"桩"],[/[旦]/gu,"但"],[/[嵌]/gu,"崁"],[/[踏]/gu,"塌"],[/[陌默黙]/gu,"漠"],[/[絀绌黜]/gu,"拙"],[/[洽]/gu,"恰"],[/[鱼渔漁䁩䐳䲆𩵋𤉯𤋳𩥭𩺰]/gu,"魚"],[/[奖奨獎奬]/gu,"奖"],[/[劫刦𠛗刧刼𠉨㤼𠞏]/gu,"劫"],[/[吒咤詫诧]/gu,"吒"],[/[殒殞磒陨隕]/gu,"殒"],[/[佰百𦣻]/gu,"百"],[/[滥濫烂爛]/gu,"滥"],[/[勿毋]/gu,"勿"],[/[裏裡里𥚃]/gu,"裏"]],function(h){Object.defineProperty(h,"__esModule",{value:!0}),h._greedyTableCacheMap=h._greedyTableCacheTest=h._greedyTableCacheRegexp=void 0;const z=Os;Object.defineProperty(h,"_greedyTableCacheRegexp",{enumerable:!0,get:function(){return z._greedyTableCacheRegexp}}),h._greedyTableCacheTest=/[噁恶悪惡係系繋繫楜煳糊胡葫衚鬍儅噹当當复復複覆囌甦苏蘇䌽倸埰彩採睬綵踩采㑩儸啰囉箩籮罗羅萝蘿刘劉浏瀏券劵卷巻捲蜷划劃画畫斗闘鬥鬪鬭乹乾亁干幹図图圖历暦曆歴歷面麪麵麺讃讚賛贊赞发發髪髮侭儘尽盡優忧憂俱倶具の之得的と与與他佗她它牠祂只支枝祇隻泡炮炰砲㊥中仲元原回廻迴辟避闢卤滷魯鲁鹵儓台檯臺颱宻密祕秘謎谜迷沙砂紗纱莎篇編编冶治䃛炼煉練练錬鍊鏈链𧹯𫔀亚亜亞娅婭桠椏塞賽赛籐籘腾藤騰你妳祢禰⻞喰蚀蝕食飠飧玛瑪馬马餚餸果裸凯凱鎧铠帖貼贴什甚联聯连連像象借藉蕾鐳镭雷靁定訂订釘钉向嚮丝糸糹絲桶筒兹滋玆茲吶呐訥讷穀糓谷両两俩倆兩帐帳賬账坂板版闆阪呆待獃溶熔融螎鎔镕匯彙汇仏佛弗彿拂啊阿傢家暴曝爆䋄䋞冈刚剛堈岗岡崗綱網纲缸网鋼钢注註潅灌貫贯倒到儭平秤称稱衬襯勋勛勲勳丽利莉麗己已巳呵嗬呦哊哟唷唹喲傑婕杰洁潔絜嘻嬉嘛痲痳麻犬狗亘亙恆恒付副附伽加枷珈迦福褔挨捱拚拼漂飃飄飘佔占沾气気氣汽滊炁撩辽遼作做捜搜蒐傁叟榭謝谢型形行僱雇頋顧顾庐廬芦蘆眈耽躭傹竞竟競竸誩𥪰𧡟𧫘𧫙𧮣𨐼植殖佬姥老倖幸㠪巨榘炬矩鉅钜㓥刴剁剐剮劏南枏楠璐路𡽘𨱴侂托拓拕拖杔託讬希悕睎稀囯国國帼幗反返佯扬揚旸暘杨楊炀烊煬阳陽來来莱萊保堡緥葆褓度渡剳劄扎札箚紮堤媞提湜禔緹缇隄腊臘蜡蠟郁鬱𨚼𨟝扞擀杆桿脼郎郞𥇑巴芭捏涅湼択择擇沢泽澤幵开開佩珮吁喩喻籲龥値值直脏臓臟贓赃髒㊤上㊦下呼唿祥詳详妮尼泥克剋尅拨撥播挿插揷丁汀哪娜那拉菈林淋玲琳鈴铃名銘铭出齣唉欸誒诶呣哞姆㖿吔耶媚魅匪扉斐緋绯翡菲蜚誹诽霏非叉衩釵钗其淇琪祺坛壇談譚谈谭才材柴唸念指趾仕士娘嬢孃哑唖啞痖瘂仂働动動察查査鉃鉄銕鐡鐵铁𨫓帰归歸皈创創疮瘡拷烤考入込仑伦侖倫仔子弯彎湾灣熒荧萤蛍螢争挣掙爭涨漲胀脹冇无沒没無吨噸訰勾鈎鉤钩沈沉叠畳疊迭僵殭疆繮缰韁揹背团団團糰榚糕需須须鬚抒紆紓纡纾州洲厂厰场場廠筱筿篠根跟㬅嫚曼漫熳蔓升昇陞烟煙腌菸醃录錄録陆陸掳擄虏虜翘翹跷蹺脚腳角詞词辞辭义意義哏梗呎咫尺伶怜憐委荽萎岭岺嶺阾領领决決絕絶绝訣诀岳嶽𡶦受授綫線线缐腺一壱壹慌荒庭廷喧宣暄煊諠掠略畧䇳牋笺签箋簽籖籤么幺庅麼麽杧芒茫趯跃躍㳽弥弭彌瀰米抹袜襪䆫囪囱窓窗窻函凾涵悚耸聳洛落标標鏢鑣镖镳怪恠並併倂并幷竝𠀤鶇鶫鸫𪂝白鉑铂吊弔戒誡诫𢌵堀窟厉厲砺礪岛島嶋再在沦淪輪轮摩磨傍彷徬旁戆戇灨贑贛赣𥫔𧹄𧹉撒萨蕯薩厓崕崖漄壧岩嵒巌巖巗碞礹𡾏噪譟凋彫琱雕鵰蔑衊汙汚污誣诬暗闇黯幪懞懵曚朦濛矇蒙摆擺襬掺搀摻攙啣衔銜偷媮旋漩碹鏇镟淡澹徨惶皇秋鞦哄閧鬨嗯恩摁偰契楔坐座埼崎嵜碕征徴徵怔愣份分芬嫒嬡愛爱瑷璦姓性娇嬌驕骄召招微薇傲敖熬璈遨奥奧澳袄襖振震忝恬担擔檐簷冥瞑妇婦媍䦰䰗阄鬮𨷺帚扫掃箒菷拣捡揀撿检検檢帘濂簾伎妓技法珐琺晖暉煇輝辉𪸩昡炫眩踰逾茜西勘堪筣篱籬笓箆篦仓倉怆愴沧滄舱艙苍蒼几幾机機彻徹澈个個各箇久乆灸玖镹鱗鳞麐麟剪翦僖喜囍憙禧㷉尉慰熨罻勐猛湌飡餐迸逬埜野吐土婉宛惌琬碗玉鈺伃俞兪妤瑜諭谕毓育桩椿樁但旦崁嵌塌踏漠陌默黙拙絀绌黜恰洽䁩䐳䲆渔漁魚鱼𤉯𤋳𩥭𩵋𩺰奖奨奬獎㤼刦刧刼劫𠉨𠛗𠞏吒咤詫诧殒殞磒陨隕佰百𦣻滥濫烂爛勿毋裏裡里𥚃]/u,h._greedyTableCacheMap=new Map([["噁",["噁","恶","悪","惡"]],["恶",["噁","恶","悪","惡"]],["悪",["噁","恶","悪","惡"]],["惡",["噁","恶","悪","惡"]],["係",["係","系","繋","繫"]],["系",["係","系","繋","繫"]],["繋",["係","系","繋","繫"]],["繫",["係","系","繋","繫"]],["楜",["楜","煳","糊","胡","葫","衚","鬍"]],["煳",["楜","煳","糊","胡","葫","衚","鬍"]],["糊",["楜","煳","糊","胡","葫","衚","鬍"]],["胡",["楜","煳","糊","胡","葫","衚","鬍"]],["葫",["楜","煳","糊","胡","葫","衚","鬍"]],["衚",["楜","煳","糊","胡","葫","衚","鬍"]],["鬍",["楜","煳","糊","胡","葫","衚","鬍"]],["儅",["儅","噹","当","當"]],["噹",["儅","噹","当","當"]],["当",["儅","噹","当","當"]],["當",["儅","噹","当","當"]],["复",["复","復","複","覆"]],["復",["复","復","複","覆"]],["複",["复","復","複","覆"]],["覆",["复","復","複","覆"]],["囌",["囌","甦","苏","蘇"]],["甦",["囌","甦","苏","蘇"]],["苏",["囌","甦","苏","蘇"]],["蘇",["囌","甦","苏","蘇"]],["䌽",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["倸",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["埰",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["彩",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["採",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["睬",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["綵",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["踩",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["采",["䌽","倸","埰","彩","採","睬","綵","踩","采"]],["㑩",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["儸",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["啰",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["囉",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["箩",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["籮",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["罗",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["羅",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["萝",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["蘿",["㑩","儸","啰","囉","箩","籮","罗","羅","萝","蘿"]],["刘",["刘","劉","浏","瀏"]],["劉",["刘","劉","浏","瀏"]],["浏",["刘","劉","浏","瀏"]],["瀏",["刘","劉","浏","瀏"]],["券",["券","劵","卷","巻","捲","蜷"]],["劵",["券","劵","卷","巻","捲","蜷"]],["卷",["券","劵","卷","巻","捲","蜷"]],["巻",["券","劵","卷","巻","捲","蜷"]],["捲",["券","劵","卷","巻","捲","蜷"]],["蜷",["券","劵","卷","巻","捲","蜷"]],["划",["划","劃","画","畫"]],["劃",["划","劃","画","畫"]],["画",["划","劃","画","畫"]],["畫",["划","劃","画","畫"]],["斗",["斗","闘","鬥","鬪","鬭"]],["闘",["斗","闘","鬥","鬪","鬭"]],["鬥",["斗","闘","鬥","鬪","鬭"]],["鬪",["斗","闘","鬥","鬪","鬭"]],["鬭",["斗","闘","鬥","鬪","鬭"]],["乹",["乹","乾","亁","干","幹"]],["乾",["乹","乾","亁","干","幹"]],["亁",["乹","乾","亁","干","幹"]],["干",["乹","乾","亁","干","幹"]],["幹",["乹","乾","亁","干","幹"]],["図",["図","图","圖"]],["图",["図","图","圖"]],["圖",["図","图","圖"]],["历",["历","暦","曆","歴","歷"]],["暦",["历","暦","曆","歴","歷"]],["曆",["历","暦","曆","歴","歷"]],["歴",["历","暦","曆","歴","歷"]],["歷",["历","暦","曆","歴","歷"]],["面",["面","麪","麵","麺"]],["麪",["面","麪","麵","麺"]],["麵",["面","麪","麵","麺"]],["麺",["面","麪","麵","麺"]],["讃",["讃","讚","賛","贊","赞"]],["讚",["讃","讚","賛","贊","赞"]],["賛",["讃","讚","賛","贊","赞"]],["贊",["讃","讚","賛","贊","赞"]],["赞",["讃","讚","賛","贊","赞"]],["发",["发","發","髪","髮"]],["發",["发","發","髪","髮"]],["髪",["发","發","髪","髮"]],["髮",["发","發","髪","髮"]],["侭",["侭","儘","尽","盡"]],["儘",["侭","儘","尽","盡"]],["尽",["侭","儘","尽","盡"]],["盡",["侭","儘","尽","盡"]],["優",["優","忧","憂"]],["忧",["優","忧","憂"]],["憂",["優","忧","憂"]],["俱",["俱","倶","具"]],["倶",["俱","倶","具"]],["具",["俱","倶","具"]],["の",["の","之","得","的"]],["之",["の","之","得","的"]],["得",["の","之","得","的"]],["的",["の","之","得","的"]],["と",["と","与","與"]],["与",["と","与","與"]],["與",["と","与","與"]],["他",["他","佗","她","它","牠","祂"]],["佗",["他","佗","她","它","牠","祂"]],["她",["他","佗","她","它","牠","祂"]],["它",["他","佗","她","它","牠","祂"]],["牠",["他","佗","她","它","牠","祂"]],["祂",["他","佗","她","它","牠","祂"]],["只",["只","支","枝","祇","隻"]],["支",["只","支","枝","祇","隻"]],["枝",["只","支","枝","祇","隻"]],["祇",["只","支","枝","祇","隻"]],["隻",["只","支","枝","祇","隻"]],["泡",["泡","炮","炰","砲"]],["炮",["泡","炮","炰","砲"]],["炰",["泡","炮","炰","砲"]],["砲",["泡","炮","炰","砲"]],["㊥",["㊥","中","仲"]],["中",["㊥","中","仲"]],["仲",["㊥","中","仲"]],["元",["元","原"]],["原",["元","原"]],["回",["回","廻","迴"]],["廻",["回","廻","迴"]],["迴",["回","廻","迴"]],["辟",["辟","避","闢"]],["避",["辟","避","闢"]],["闢",["辟","避","闢"]],["卤",["卤","滷","魯","鲁","鹵"]],["滷",["卤","滷","魯","鲁","鹵"]],["魯",["卤","滷","魯","鲁","鹵"]],["鲁",["卤","滷","魯","鲁","鹵"]],["鹵",["卤","滷","魯","鲁","鹵"]],["儓",["儓","台","檯","臺","颱"]],["台",["儓","台","檯","臺","颱"]],["檯",["儓","台","檯","臺","颱"]],["臺",["儓","台","檯","臺","颱"]],["颱",["儓","台","檯","臺","颱"]],["宻",["宻","密","祕","秘"]],["密",["宻","密","祕","秘"]],["祕",["宻","密","祕","秘"]],["秘",["宻","密","祕","秘"]],["謎",["謎","谜","迷"]],["谜",["謎","谜","迷"]],["迷",["謎","谜","迷"]],["沙",["沙","砂","紗","纱","莎"]],["砂",["沙","砂","紗","纱","莎"]],["紗",["沙","砂","紗","纱","莎"]],["纱",["沙","砂","紗","纱","莎"]],["莎",["沙","砂","紗","纱","莎"]],["篇",["篇","編","编"]],["編",["篇","編","编"]],["编",["篇","編","编"]],["冶",["冶","治"]],["治",["冶","治"]],["䃛",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["炼",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["煉",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["練",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["练",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["錬",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["鍊",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["鏈",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["链",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["𧹯",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["𫔀",["䃛","炼","煉","練","练","錬","鍊","鏈","链","𧹯","𫔀"]],["亚",["亚","亜","亞","娅","婭","桠","椏"]],["亜",["亚","亜","亞","娅","婭","桠","椏"]],["亞",["亚","亜","亞","娅","婭","桠","椏"]],["娅",["亚","亜","亞","娅","婭","桠","椏"]],["婭",["亚","亜","亞","娅","婭","桠","椏"]],["桠",["亚","亜","亞","娅","婭","桠","椏"]],["椏",["亚","亜","亞","娅","婭","桠","椏"]],["塞",["塞","賽","赛"]],["賽",["塞","賽","赛"]],["赛",["塞","賽","赛"]],["籐",["籐","籘","腾","藤","騰"]],["籘",["籐","籘","腾","藤","騰"]],["腾",["籐","籘","腾","藤","騰"]],["藤",["籐","籘","腾","藤","騰"]],["騰",["籐","籘","腾","藤","騰"]],["你",["你","妳","祢","禰"]],["妳",["你","妳","祢","禰"]],["祢",["你","妳","祢","禰"]],["禰",["你","妳","祢","禰"]],["⻞",["⻞","喰","蚀","蝕","食","飠","飧"]],["喰",["⻞","喰","蚀","蝕","食","飠","飧"]],["蚀",["⻞","喰","蚀","蝕","食","飠","飧"]],["蝕",["⻞","喰","蚀","蝕","食","飠","飧"]],["食",["⻞","喰","蚀","蝕","食","飠","飧"]],["飠",["⻞","喰","蚀","蝕","食","飠","飧"]],["飧",["⻞","喰","蚀","蝕","食","飠","飧"]],["玛",["玛","瑪","馬","马"]],["瑪",["玛","瑪","馬","马"]],["馬",["玛","瑪","馬","马"]],["马",["玛","瑪","馬","马"]],["餚",["餚","餸"]],["餸",["餚","餸"]],["果",["果","裸"]],["裸",["果","裸"]],["凯",["凯","凱","鎧","铠"]],["凱",["凯","凱","鎧","铠"]],["鎧",["凯","凱","鎧","铠"]],["铠",["凯","凱","鎧","铠"]],["帖",["帖","貼","贴"]],["貼",["帖","貼","贴"]],["贴",["帖","貼","贴"]],["什",["什","甚"]],["甚",["什","甚"]],["联",["联","聯","连","連"]],["聯",["联","聯","连","連"]],["连",["联","聯","连","連"]],["連",["联","聯","连","連"]],["像",["像","象"]],["象",["像","象"]],["借",["借","藉"]],["藉",["借","藉"]],["蕾",["蕾","鐳","镭","雷","靁"]],["鐳",["蕾","鐳","镭","雷","靁"]],["镭",["蕾","鐳","镭","雷","靁"]],["雷",["蕾","鐳","镭","雷","靁"]],["靁",["蕾","鐳","镭","雷","靁"]],["定",["定","訂","订","釘","钉"]],["訂",["定","訂","订","釘","钉"]],["订",["定","訂","订","釘","钉"]],["釘",["定","訂","订","釘","钉"]],["钉",["定","訂","订","釘","钉"]],["向",["向","嚮"]],["嚮",["向","嚮"]],["丝",["丝","糸","糹","絲"]],["糸",["丝","糸","糹","絲"]],["糹",["丝","糸","糹","絲"]],["絲",["丝","糸","糹","絲"]],["桶",["桶","筒"]],["筒",["桶","筒"]],["兹",["兹","滋","玆","茲"]],["滋",["兹","滋","玆","茲"]],["玆",["兹","滋","玆","茲"]],["茲",["兹","滋","玆","茲"]],["吶",["吶","呐","訥","讷"]],["呐",["吶","呐","訥","讷"]],["訥",["吶","呐","訥","讷"]],["讷",["吶","呐","訥","讷"]],["穀",["穀","糓","谷"]],["糓",["穀","糓","谷"]],["谷",["穀","糓","谷"]],["両",["両","两","俩","倆","兩"]],["两",["両","两","俩","倆","兩"]],["俩",["両","两","俩","倆","兩"]],["倆",["両","两","俩","倆","兩"]],["兩",["両","两","俩","倆","兩"]],["帐",["帐","帳","賬","账"]],["帳",["帐","帳","賬","账"]],["賬",["帐","帳","賬","账"]],["账",["帐","帳","賬","账"]],["坂",["坂","板","版","闆","阪"]],["板",["坂","板","版","闆","阪"]],["版",["坂","板","版","闆","阪"]],["闆",["坂","板","版","闆","阪"]],["阪",["坂","板","版","闆","阪"]],["呆",["呆","待","獃"]],["待",["呆","待","獃"]],["獃",["呆","待","獃"]],["溶",["溶","熔","融","螎","鎔","镕"]],["熔",["溶","熔","融","螎","鎔","镕"]],["融",["溶","熔","融","螎","鎔","镕"]],["螎",["溶","熔","融","螎","鎔","镕"]],["鎔",["溶","熔","融","螎","鎔","镕"]],["镕",["溶","熔","融","螎","鎔","镕"]],["匯",["匯","彙","汇"]],["彙",["匯","彙","汇"]],["汇",["匯","彙","汇"]],["仏",["仏","佛","弗","彿","拂"]],["佛",["仏","佛","弗","彿","拂"]],["弗",["仏","佛","弗","彿","拂"]],["彿",["仏","佛","弗","彿","拂"]],["拂",["仏","佛","弗","彿","拂"]],["啊",["啊","阿"]],["阿",["啊","阿"]],["傢",["傢","家"]],["家",["傢","家"]],["暴",["暴","曝","爆"]],["曝",["暴","曝","爆"]],["爆",["暴","曝","爆"]],["䋄",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["䋞",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["冈",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["刚",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["剛",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["堈",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["岗",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["岡",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["崗",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["綱",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["網",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["纲",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["缸",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["网",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["鋼",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["钢",["䋄","䋞","冈","刚","剛","堈","岗","岡","崗","綱","網","纲","缸","网","鋼","钢"]],["注",["注","註"]],["註",["注","註"]],["潅",["潅","灌","貫","贯"]],["灌",["潅","灌","貫","贯"]],["貫",["潅","灌","貫","贯"]],["贯",["潅","灌","貫","贯"]],["倒",["倒","到"]],["到",["倒","到"]],["儭",["儭","平","秤","称","稱","衬","襯"]],["平",["儭","平","秤","称","稱","衬","襯"]],["秤",["儭","平","秤","称","稱","衬","襯"]],["称",["儭","平","秤","称","稱","衬","襯"]],["稱",["儭","平","秤","称","稱","衬","襯"]],["衬",["儭","平","秤","称","稱","衬","襯"]],["襯",["儭","平","秤","称","稱","衬","襯"]],["勋",["勋","勛","勲","勳"]],["勛",["勋","勛","勲","勳"]],["勲",["勋","勛","勲","勳"]],["勳",["勋","勛","勲","勳"]],["丽",["丽","利","莉","麗"]],["利",["丽","利","莉","麗"]],["莉",["丽","利","莉","麗"]],["麗",["丽","利","莉","麗"]],["己",["己","已","巳"]],["已",["己","已","巳"]],["巳",["己","已","巳"]],["呵",["呵","嗬"]],["嗬",["呵","嗬"]],["呦",["呦","哊","哟","唷","唹","喲"]],["哊",["呦","哊","哟","唷","唹","喲"]],["哟",["呦","哊","哟","唷","唹","喲"]],["唷",["呦","哊","哟","唷","唹","喲"]],["唹",["呦","哊","哟","唷","唹","喲"]],["喲",["呦","哊","哟","唷","唹","喲"]],["傑",["傑","婕","杰","洁","潔","絜"]],["婕",["傑","婕","杰","洁","潔","絜"]],["杰",["傑","婕","杰","洁","潔","絜"]],["洁",["傑","婕","杰","洁","潔","絜"]],["潔",["傑","婕","杰","洁","潔","絜"]],["絜",["傑","婕","杰","洁","潔","絜"]],["嘻",["嘻","嬉"]],["嬉",["嘻","嬉"]],["嘛",["嘛","痲","痳","麻"]],["痲",["嘛","痲","痳","麻"]],["痳",["嘛","痲","痳","麻"]],["麻",["嘛","痲","痳","麻"]],["犬",["犬","狗"]],["狗",["犬","狗"]],["亘",["亘","亙","恆","恒"]],["亙",["亘","亙","恆","恒"]],["恆",["亘","亙","恆","恒"]],["恒",["亘","亙","恆","恒"]],["付",["付","副","附"]],["副",["付","副","附"]],["附",["付","副","附"]],["伽",["伽","加","枷","珈","迦"]],["加",["伽","加","枷","珈","迦"]],["枷",["伽","加","枷","珈","迦"]],["珈",["伽","加","枷","珈","迦"]],["迦",["伽","加","枷","珈","迦"]],["福",["福","褔"]],["褔",["福","褔"]],["挨",["挨","捱"]],["捱",["挨","捱"]],["拚",["拚","拼"]],["拼",["拚","拼"]],["漂",["漂","飃","飄","飘"]],["飃",["漂","飃","飄","飘"]],["飄",["漂","飃","飄","飘"]],["飘",["漂","飃","飄","飘"]],["佔",["佔","占","沾"]],["占",["佔","占","沾"]],["沾",["佔","占","沾"]],["气",["气","気","氣","汽","滊","炁"]],["気",["气","気","氣","汽","滊","炁"]],["氣",["气","気","氣","汽","滊","炁"]],["汽",["气","気","氣","汽","滊","炁"]],["滊",["气","気","氣","汽","滊","炁"]],["炁",["气","気","氣","汽","滊","炁"]],["撩",["撩","辽","遼"]],["辽",["撩","辽","遼"]],["遼",["撩","辽","遼"]],["作",["作","做"]],["做",["作","做"]],["捜",["捜","搜","蒐"]],["搜",["捜","搜","蒐"]],["蒐",["捜","搜","蒐"]],["傁",["傁","叟"]],["叟",["傁","叟"]],["榭",["榭","謝","谢"]],["謝",["榭","謝","谢"]],["谢",["榭","謝","谢"]],["型",["型","形","行"]],["形",["型","形","行"]],["行",["型","形","行"]],["僱",["僱","雇","頋","顧","顾"]],["雇",["僱","雇","頋","顧","顾"]],["頋",["僱","雇","頋","顧","顾"]],["顧",["僱","雇","頋","顧","顾"]],["顾",["僱","雇","頋","顧","顾"]],["庐",["庐","廬","芦","蘆"]],["廬",["庐","廬","芦","蘆"]],["芦",["庐","廬","芦","蘆"]],["蘆",["庐","廬","芦","蘆"]],["眈",["眈","耽","躭"]],["耽",["眈","耽","躭"]],["躭",["眈","耽","躭"]],["傹",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["竞",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["竟",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["競",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["竸",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["誩",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["𥪰",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["𧡟",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["𧫘",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["𧫙",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["𧮣",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["𨐼",["傹","竞","竟","競","竸","誩","𥪰","𧡟","𧫘","𧫙","𧮣","𨐼"]],["植",["植","殖"]],["殖",["植","殖"]],["佬",["佬","姥","老"]],["姥",["佬","姥","老"]],["老",["佬","姥","老"]],["倖",["倖","幸"]],["幸",["倖","幸"]],["㠪",["㠪","巨","榘","炬","矩","鉅","钜"]],["巨",["㠪","巨","榘","炬","矩","鉅","钜"]],["榘",["㠪","巨","榘","炬","矩","鉅","钜"]],["炬",["㠪","巨","榘","炬","矩","鉅","钜"]],["矩",["㠪","巨","榘","炬","矩","鉅","钜"]],["鉅",["㠪","巨","榘","炬","矩","鉅","钜"]],["钜",["㠪","巨","榘","炬","矩","鉅","钜"]],["㓥",["㓥","刴","剁","剐","剮","劏"]],["刴",["㓥","刴","剁","剐","剮","劏"]],["剁",["㓥","刴","剁","剐","剮","劏"]],["剐",["㓥","刴","剁","剐","剮","劏"]],["剮",["㓥","刴","剁","剐","剮","劏"]],["劏",["㓥","刴","剁","剐","剮","劏"]],["南",["南","枏","楠"]],["枏",["南","枏","楠"]],["楠",["南","枏","楠"]],["璐",["璐","路","𡽘","𨱴"]],["路",["璐","路","𡽘","𨱴"]],["𡽘",["璐","路","𡽘","𨱴"]],["𨱴",["璐","路","𡽘","𨱴"]],["侂",["侂","托","拓","拕","拖","杔","託","讬"]],["托",["侂","托","拓","拕","拖","杔","託","讬"]],["拓",["侂","托","拓","拕","拖","杔","託","讬"]],["拕",["侂","托","拓","拕","拖","杔","託","讬"]],["拖",["侂","托","拓","拕","拖","杔","託","讬"]],["杔",["侂","托","拓","拕","拖","杔","託","讬"]],["託",["侂","托","拓","拕","拖","杔","託","讬"]],["讬",["侂","托","拓","拕","拖","杔","託","讬"]],["希",["希","悕","睎","稀"]],["悕",["希","悕","睎","稀"]],["睎",["希","悕","睎","稀"]],["稀",["希","悕","睎","稀"]],["囯",["囯","国","國","帼","幗"]],["国",["囯","国","國","帼","幗"]],["國",["囯","国","國","帼","幗"]],["帼",["囯","国","國","帼","幗"]],["幗",["囯","国","國","帼","幗"]],["反",["反","返"]],["返",["反","返"]],["佯",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["扬",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["揚",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["旸",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["暘",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["杨",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["楊",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["炀",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["烊",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["煬",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["阳",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["陽",["佯","扬","揚","旸","暘","杨","楊","炀","烊","煬","阳","陽"]],["來",["來","来","莱","萊"]],["来",["來","来","莱","萊"]],["莱",["來","来","莱","萊"]],["萊",["來","来","莱","萊"]],["保",["保","堡","緥","葆","褓"]],["堡",["保","堡","緥","葆","褓"]],["緥",["保","堡","緥","葆","褓"]],["葆",["保","堡","緥","葆","褓"]],["褓",["保","堡","緥","葆","褓"]],["度",["度","渡"]],["渡",["度","渡"]],["剳",["剳","劄","扎","札","箚","紮"]],["劄",["剳","劄","扎","札","箚","紮"]],["扎",["剳","劄","扎","札","箚","紮"]],["札",["剳","劄","扎","札","箚","紮"]],["箚",["剳","劄","扎","札","箚","紮"]],["紮",["剳","劄","扎","札","箚","紮"]],["堤",["堤","媞","提","湜","禔","緹","缇","隄"]],["媞",["堤","媞","提","湜","禔","緹","缇","隄"]],["提",["堤","媞","提","湜","禔","緹","缇","隄"]],["湜",["堤","媞","提","湜","禔","緹","缇","隄"]],["禔",["堤","媞","提","湜","禔","緹","缇","隄"]],["緹",["堤","媞","提","湜","禔","緹","缇","隄"]],["缇",["堤","媞","提","湜","禔","緹","缇","隄"]],["隄",["堤","媞","提","湜","禔","緹","缇","隄"]],["腊",["腊","臘","蜡","蠟"]],["臘",["腊","臘","蜡","蠟"]],["蜡",["腊","臘","蜡","蠟"]],["蠟",["腊","臘","蜡","蠟"]],["郁",["郁","鬱","𨚼","𨟝"]],["鬱",["郁","鬱","𨚼","𨟝"]],["𨚼",["郁","鬱","𨚼","𨟝"]],["𨟝",["郁","鬱","𨚼","𨟝"]],["扞",["扞","擀","杆","桿"]],["擀",["扞","擀","杆","桿"]],["杆",["扞","擀","杆","桿"]],["桿",["扞","擀","杆","桿"]],["脼",["脼","郎","郞","𥇑"]],["郎",["脼","郎","郞","𥇑"]],["郞",["脼","郎","郞","𥇑"]],["𥇑",["脼","郎","郞","𥇑"]],["巴",["巴","芭"]],["芭",["巴","芭"]],["捏",["捏","涅","湼"]],["涅",["捏","涅","湼"]],["湼",["捏","涅","湼"]],["択",["択","择","擇","沢","泽","澤"]],["择",["択","择","擇","沢","泽","澤"]],["擇",["択","择","擇","沢","泽","澤"]],["沢",["択","择","擇","沢","泽","澤"]],["泽",["択","择","擇","沢","泽","澤"]],["澤",["択","择","擇","沢","泽","澤"]],["幵",["幵","开","開"]],["开",["幵","开","開"]],["開",["幵","开","開"]],["佩",["佩","珮"]],["珮",["佩","珮"]],["吁",["吁","喩","喻","籲","龥"]],["喩",["吁","喩","喻","籲","龥"]],["喻",["吁","喩","喻","籲","龥"]],["籲",["吁","喩","喻","籲","龥"]],["龥",["吁","喩","喻","籲","龥"]],["値",["値","值","直"]],["值",["値","值","直"]],["直",["値","值","直"]],["脏",["脏","臓","臟","贓","赃","髒"]],["臓",["脏","臓","臟","贓","赃","髒"]],["臟",["脏","臓","臟","贓","赃","髒"]],["贓",["脏","臓","臟","贓","赃","髒"]],["赃",["脏","臓","臟","贓","赃","髒"]],["髒",["脏","臓","臟","贓","赃","髒"]],["㊤",["㊤","上"]],["上",["㊤","上"]],["㊦",["㊦","下"]],["下",["㊦","下"]],["呼",["呼","唿"]],["唿",["呼","唿"]],["祥",["祥","詳","详"]],["詳",["祥","詳","详"]],["详",["祥","詳","详"]],["妮",["妮","尼","泥"]],["尼",["妮","尼","泥"]],["泥",["妮","尼","泥"]],["克",["克","剋","尅"]],["剋",["克","剋","尅"]],["尅",["克","剋","尅"]],["拨",["拨","撥","播"]],["撥",["拨","撥","播"]],["播",["拨","撥","播"]],["挿",["挿","插","揷"]],["插",["挿","插","揷"]],["揷",["挿","插","揷"]],["丁",["丁","汀"]],["汀",["丁","汀"]],["哪",["哪","娜","那"]],["娜",["哪","娜","那"]],["那",["哪","娜","那"]],["拉",["拉","菈"]],["菈",["拉","菈"]],["林",["林","淋","玲","琳","鈴","铃"]],["淋",["林","淋","玲","琳","鈴","铃"]],["玲",["林","淋","玲","琳","鈴","铃"]],["琳",["林","淋","玲","琳","鈴","铃"]],["鈴",["林","淋","玲","琳","鈴","铃"]],["铃",["林","淋","玲","琳","鈴","铃"]],["名",["名","銘","铭"]],["銘",["名","銘","铭"]],["铭",["名","銘","铭"]],["出",["出","齣"]],["齣",["出","齣"]],["唉",["唉","欸","誒","诶"]],["欸",["唉","欸","誒","诶"]],["誒",["唉","欸","誒","诶"]],["诶",["唉","欸","誒","诶"]],["呣",["呣","哞","姆"]],["哞",["呣","哞","姆"]],["姆",["呣","哞","姆"]],["㖿",["㖿","吔","耶"]],["吔",["㖿","吔","耶"]],["耶",["㖿","吔","耶"]],["媚",["媚","魅"]],["魅",["媚","魅"]],["匪",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["扉",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["斐",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["緋",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["绯",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["翡",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["菲",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["蜚",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["誹",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["诽",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["霏",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["非",["匪","扉","斐","緋","绯","翡","菲","蜚","誹","诽","霏","非"]],["叉",["叉","衩","釵","钗"]],["衩",["叉","衩","釵","钗"]],["釵",["叉","衩","釵","钗"]],["钗",["叉","衩","釵","钗"]],["其",["其","淇","琪","祺"]],["淇",["其","淇","琪","祺"]],["琪",["其","淇","琪","祺"]],["祺",["其","淇","琪","祺"]],["坛",["坛","壇","談","譚","谈","谭"]],["壇",["坛","壇","談","譚","谈","谭"]],["談",["坛","壇","談","譚","谈","谭"]],["譚",["坛","壇","談","譚","谈","谭"]],["谈",["坛","壇","談","譚","谈","谭"]],["谭",["坛","壇","談","譚","谈","谭"]],["才",["才","材","柴"]],["材",["才","材","柴"]],["柴",["才","材","柴"]],["唸",["唸","念"]],["念",["唸","念"]],["指",["指","趾"]],["趾",["指","趾"]],["仕",["仕","士"]],["士",["仕","士"]],["娘",["娘","嬢","孃"]],["嬢",["娘","嬢","孃"]],["孃",["娘","嬢","孃"]],["哑",["哑","唖","啞","痖","瘂"]],["唖",["哑","唖","啞","痖","瘂"]],["啞",["哑","唖","啞","痖","瘂"]],["痖",["哑","唖","啞","痖","瘂"]],["瘂",["哑","唖","啞","痖","瘂"]],["仂",["仂","働","动","動"]],["働",["仂","働","动","動"]],["动",["仂","働","动","動"]],["動",["仂","働","动","動"]],["察",["察","查","査"]],["查",["察","查","査"]],["査",["察","查","査"]],["鉃",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["鉄",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["銕",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["鐡",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["鐵",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["铁",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["𨫓",["鉃","鉄","銕","鐡","鐵","铁","𨫓"]],["帰",["帰","归","歸","皈"]],["归",["帰","归","歸","皈"]],["歸",["帰","归","歸","皈"]],["皈",["帰","归","歸","皈"]],["创",["创","創","疮","瘡"]],["創",["创","創","疮","瘡"]],["疮",["创","創","疮","瘡"]],["瘡",["创","創","疮","瘡"]],["拷",["拷","烤","考"]],["烤",["拷","烤","考"]],["考",["拷","烤","考"]],["入",["入","込"]],["込",["入","込"]],["仑",["仑","伦","侖","倫"]],["伦",["仑","伦","侖","倫"]],["侖",["仑","伦","侖","倫"]],["倫",["仑","伦","侖","倫"]],["仔",["仔","子"]],["子",["仔","子"]],["弯",["弯","彎","湾","灣"]],["彎",["弯","彎","湾","灣"]],["湾",["弯","彎","湾","灣"]],["灣",["弯","彎","湾","灣"]],["熒",["熒","荧","萤","蛍","螢"]],["荧",["熒","荧","萤","蛍","螢"]],["萤",["熒","荧","萤","蛍","螢"]],["蛍",["熒","荧","萤","蛍","螢"]],["螢",["熒","荧","萤","蛍","螢"]],["争",["争","挣","掙","爭"]],["挣",["争","挣","掙","爭"]],["掙",["争","挣","掙","爭"]],["爭",["争","挣","掙","爭"]],["涨",["涨","漲","胀","脹"]],["漲",["涨","漲","胀","脹"]],["胀",["涨","漲","胀","脹"]],["脹",["涨","漲","胀","脹"]],["冇",["冇","无","沒","没","無"]],["无",["冇","无","沒","没","無"]],["沒",["冇","无","沒","没","無"]],["没",["冇","无","沒","没","無"]],["無",["冇","无","沒","没","無"]],["吨",["吨","噸","訰"]],["噸",["吨","噸","訰"]],["訰",["吨","噸","訰"]],["勾",["勾","鈎","鉤","钩"]],["鈎",["勾","鈎","鉤","钩"]],["鉤",["勾","鈎","鉤","钩"]],["钩",["勾","鈎","鉤","钩"]],["沈",["沈","沉"]],["沉",["沈","沉"]],["叠",["叠","畳","疊","迭"]],["畳",["叠","畳","疊","迭"]],["疊",["叠","畳","疊","迭"]],["迭",["叠","畳","疊","迭"]],["僵",["僵","殭","疆","繮","缰","韁"]],["殭",["僵","殭","疆","繮","缰","韁"]],["疆",["僵","殭","疆","繮","缰","韁"]],["繮",["僵","殭","疆","繮","缰","韁"]],["缰",["僵","殭","疆","繮","缰","韁"]],["韁",["僵","殭","疆","繮","缰","韁"]],["揹",["揹","背"]],["背",["揹","背"]],["团",["团","団","團","糰"]],["団",["团","団","團","糰"]],["團",["团","団","團","糰"]],["糰",["团","団","團","糰"]],["榚",["榚","糕"]],["糕",["榚","糕"]],["需",["需","須","须","鬚"]],["須",["需","須","须","鬚"]],["须",["需","須","须","鬚"]],["鬚",["需","須","须","鬚"]],["抒",["抒","紆","紓","纡","纾"]],["紆",["抒","紆","紓","纡","纾"]],["紓",["抒","紆","紓","纡","纾"]],["纡",["抒","紆","紓","纡","纾"]],["纾",["抒","紆","紓","纡","纾"]],["州",["州","洲"]],["洲",["州","洲"]],["厂",["厂","厰","场","場","廠"]],["厰",["厂","厰","场","場","廠"]],["场",["厂","厰","场","場","廠"]],["場",["厂","厰","场","場","廠"]],["廠",["厂","厰","场","場","廠"]],["筱",["筱","筿","篠"]],["筿",["筱","筿","篠"]],["篠",["筱","筿","篠"]],["根",["根","跟"]],["跟",["根","跟"]],["㬅",["㬅","嫚","曼","漫","熳","蔓"]],["嫚",["㬅","嫚","曼","漫","熳","蔓"]],["曼",["㬅","嫚","曼","漫","熳","蔓"]],["漫",["㬅","嫚","曼","漫","熳","蔓"]],["熳",["㬅","嫚","曼","漫","熳","蔓"]],["蔓",["㬅","嫚","曼","漫","熳","蔓"]],["升",["升","昇","陞"]],["昇",["升","昇","陞"]],["陞",["升","昇","陞"]],["烟",["烟","煙","腌","菸","醃"]],["煙",["烟","煙","腌","菸","醃"]],["腌",["烟","煙","腌","菸","醃"]],["菸",["烟","煙","腌","菸","醃"]],["醃",["烟","煙","腌","菸","醃"]],["录",["录","錄","録","陆","陸"]],["錄",["录","錄","録","陆","陸"]],["録",["录","錄","録","陆","陸"]],["陆",["录","錄","録","陆","陸"]],["陸",["录","錄","録","陆","陸"]],["掳",["掳","擄","虏","虜"]],["擄",["掳","擄","虏","虜"]],["虏",["掳","擄","虏","虜"]],["虜",["掳","擄","虏","虜"]],["翘",["翘","翹","跷","蹺"]],["翹",["翘","翹","跷","蹺"]],["跷",["翘","翹","跷","蹺"]],["蹺",["翘","翹","跷","蹺"]],["脚",["脚","腳","角"]],["腳",["脚","腳","角"]],["角",["脚","腳","角"]],["詞",["詞","词","辞","辭"]],["词",["詞","词","辞","辭"]],["辞",["詞","词","辞","辭"]],["辭",["詞","词","辞","辭"]],["义",["义","意","義"]],["意",["义","意","義"]],["義",["义","意","義"]],["哏",["哏","梗"]],["梗",["哏","梗"]],["呎",["呎","咫","尺"]],["咫",["呎","咫","尺"]],["尺",["呎","咫","尺"]],["伶",["伶","怜","憐"]],["怜",["伶","怜","憐"]],["憐",["伶","怜","憐"]],["委",["委","荽","萎"]],["荽",["委","荽","萎"]],["萎",["委","荽","萎"]],["岭",["岭","岺","嶺","阾","領","领"]],["岺",["岭","岺","嶺","阾","領","领"]],["嶺",["岭","岺","嶺","阾","領","领"]],["阾",["岭","岺","嶺","阾","領","领"]],["領",["岭","岺","嶺","阾","領","领"]],["领",["岭","岺","嶺","阾","領","领"]],["决",["决","決","絕","絶","绝","訣","诀"]],["決",["决","決","絕","絶","绝","訣","诀"]],["絕",["决","決","絕","絶","绝","訣","诀"]],["絶",["决","決","絕","絶","绝","訣","诀"]],["绝",["决","決","絕","絶","绝","訣","诀"]],["訣",["决","決","絕","絶","绝","訣","诀"]],["诀",["决","決","絕","絶","绝","訣","诀"]],["岳",["岳","嶽","𡶦"]],["嶽",["岳","嶽","𡶦"]],["𡶦",["岳","嶽","𡶦"]],["受",["受","授"]],["授",["受","授"]],["綫",["綫","線","线","缐","腺"]],["線",["綫","線","线","缐","腺"]],["线",["綫","線","线","缐","腺"]],["缐",["綫","線","线","缐","腺"]],["腺",["綫","線","线","缐","腺"]],["一",["一","壱","壹"]],["壱",["一","壱","壹"]],["壹",["一","壱","壹"]],["慌",["慌","荒"]],["荒",["慌","荒"]],["庭",["庭","廷"]],["廷",["庭","廷"]],["喧",["喧","宣","暄","煊","諠"]],["宣",["喧","宣","暄","煊","諠"]],["暄",["喧","宣","暄","煊","諠"]],["煊",["喧","宣","暄","煊","諠"]],["諠",["喧","宣","暄","煊","諠"]],["掠",["掠","略","畧"]],["略",["掠","略","畧"]],["畧",["掠","略","畧"]],["䇳",["䇳","牋","笺","签","箋","簽","籖","籤"]],["牋",["䇳","牋","笺","签","箋","簽","籖","籤"]],["笺",["䇳","牋","笺","签","箋","簽","籖","籤"]],["签",["䇳","牋","笺","签","箋","簽","籖","籤"]],["箋",["䇳","牋","笺","签","箋","簽","籖","籤"]],["簽",["䇳","牋","笺","签","箋","簽","籖","籤"]],["籖",["䇳","牋","笺","签","箋","簽","籖","籤"]],["籤",["䇳","牋","笺","签","箋","簽","籖","籤"]],["么",["么","幺","庅","麼","麽"]],["幺",["么","幺","庅","麼","麽"]],["庅",["么","幺","庅","麼","麽"]],["麼",["么","幺","庅","麼","麽"]],["麽",["么","幺","庅","麼","麽"]],["杧",["杧","芒","茫"]],["芒",["杧","芒","茫"]],["茫",["杧","芒","茫"]],["趯",["趯","跃","躍"]],["跃",["趯","跃","躍"]],["躍",["趯","跃","躍"]],["㳽",["㳽","弥","弭","彌","瀰","米"]],["弥",["㳽","弥","弭","彌","瀰","米"]],["弭",["㳽","弥","弭","彌","瀰","米"]],["彌",["㳽","弥","弭","彌","瀰","米"]],["瀰",["㳽","弥","弭","彌","瀰","米"]],["米",["㳽","弥","弭","彌","瀰","米"]],["抹",["抹","袜","襪"]],["袜",["抹","袜","襪"]],["襪",["抹","袜","襪"]],["䆫",["䆫","囪","囱","窓","窗","窻"]],["囪",["䆫","囪","囱","窓","窗","窻"]],["囱",["䆫","囪","囱","窓","窗","窻"]],["窓",["䆫","囪","囱","窓","窗","窻"]],["窗",["䆫","囪","囱","窓","窗","窻"]],["窻",["䆫","囪","囱","窓","窗","窻"]],["函",["函","凾","涵"]],["凾",["函","凾","涵"]],["涵",["函","凾","涵"]],["悚",["悚","耸","聳"]],["耸",["悚","耸","聳"]],["聳",["悚","耸","聳"]],["洛",["洛","落"]],["落",["洛","落"]],["标",["标","標","鏢","鑣","镖","镳"]],["標",["标","標","鏢","鑣","镖","镳"]],["鏢",["标","標","鏢","鑣","镖","镳"]],["鑣",["标","標","鏢","鑣","镖","镳"]],["镖",["标","標","鏢","鑣","镖","镳"]],["镳",["标","標","鏢","鑣","镖","镳"]],["怪",["怪","恠"]],["恠",["怪","恠"]],["並",["並","併","倂","并","幷","竝","𠀤"]],["併",["並","併","倂","并","幷","竝","𠀤"]],["倂",["並","併","倂","并","幷","竝","𠀤"]],["并",["並","併","倂","并","幷","竝","𠀤"]],["幷",["並","併","倂","并","幷","竝","𠀤"]],["竝",["並","併","倂","并","幷","竝","𠀤"]],["𠀤",["並","併","倂","并","幷","竝","𠀤"]],["鶇",["鶇","鶫","鸫","𪂝"]],["鶫",["鶇","鶫","鸫","𪂝"]],["鸫",["鶇","鶫","鸫","𪂝"]],["𪂝",["鶇","鶫","鸫","𪂝"]],["白",["白","鉑","铂"]],["鉑",["白","鉑","铂"]],["铂",["白","鉑","铂"]],["吊",["吊","弔"]],["弔",["吊","弔"]],["戒",["戒","誡","诫","𢌵"]],["誡",["戒","誡","诫","𢌵"]],["诫",["戒","誡","诫","𢌵"]],["𢌵",["戒","誡","诫","𢌵"]],["堀",["堀","窟"]],["窟",["堀","窟"]],["厉",["厉","厲","砺","礪"]],["厲",["厉","厲","砺","礪"]],["砺",["厉","厲","砺","礪"]],["礪",["厉","厲","砺","礪"]],["岛",["岛","島","嶋"]],["島",["岛","島","嶋"]],["嶋",["岛","島","嶋"]],["再",["再","在"]],["在",["再","在"]],["沦",["沦","淪","輪","轮"]],["淪",["沦","淪","輪","轮"]],["輪",["沦","淪","輪","轮"]],["轮",["沦","淪","輪","轮"]],["摩",["摩","磨"]],["磨",["摩","磨"]],["傍",["傍","彷","徬","旁"]],["彷",["傍","彷","徬","旁"]],["徬",["傍","彷","徬","旁"]],["旁",["傍","彷","徬","旁"]],["戆",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["戇",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["灨",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["贑",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["贛",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["赣",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["𥫔",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["𧹄",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["𧹉",["戆","戇","灨","贑","贛","赣","𥫔","𧹄","𧹉"]],["撒",["撒","萨","蕯","薩"]],["萨",["撒","萨","蕯","薩"]],["蕯",["撒","萨","蕯","薩"]],["薩",["撒","萨","蕯","薩"]],["厓",["厓","崕","崖","漄"]],["崕",["厓","崕","崖","漄"]],["崖",["厓","崕","崖","漄"]],["漄",["厓","崕","崖","漄"]],["壧",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["岩",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["嵒",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["巌",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["巖",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["巗",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["碞",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["礹",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["𡾏",["壧","岩","嵒","巌","巖","巗","碞","礹","𡾏"]],["噪",["噪","譟"]],["譟",["噪","譟"]],["凋",["凋","彫","琱","雕","鵰"]],["彫",["凋","彫","琱","雕","鵰"]],["琱",["凋","彫","琱","雕","鵰"]],["雕",["凋","彫","琱","雕","鵰"]],["鵰",["凋","彫","琱","雕","鵰"]],["蔑",["蔑","衊"]],["衊",["蔑","衊"]],["汙",["汙","汚","污","誣","诬"]],["汚",["汙","汚","污","誣","诬"]],["污",["汙","汚","污","誣","诬"]],["誣",["汙","汚","污","誣","诬"]],["诬",["汙","汚","污","誣","诬"]],["暗",["暗","闇","黯"]],["闇",["暗","闇","黯"]],["黯",["暗","闇","黯"]],["幪",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["懞",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["懵",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["曚",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["朦",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["濛",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["矇",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["蒙",["幪","懞","懵","曚","朦","濛","矇","蒙"]],["摆",["摆","擺","襬"]],["擺",["摆","擺","襬"]],["襬",["摆","擺","襬"]],["掺",["掺","搀","摻","攙"]],["搀",["掺","搀","摻","攙"]],["摻",["掺","搀","摻","攙"]],["攙",["掺","搀","摻","攙"]],["啣",["啣","衔","銜"]],["衔",["啣","衔","銜"]],["銜",["啣","衔","銜"]],["偷",["偷","媮"]],["媮",["偷","媮"]],["旋",["旋","漩","碹","鏇","镟"]],["漩",["旋","漩","碹","鏇","镟"]],["碹",["旋","漩","碹","鏇","镟"]],["鏇",["旋","漩","碹","鏇","镟"]],["镟",["旋","漩","碹","鏇","镟"]],["淡",["淡","澹"]],["澹",["淡","澹"]],["徨",["徨","惶","皇"]],["惶",["徨","惶","皇"]],["皇",["徨","惶","皇"]],["秋",["秋","鞦"]],["鞦",["秋","鞦"]],["哄",["哄","閧","鬨"]],["閧",["哄","閧","鬨"]],["鬨",["哄","閧","鬨"]],["嗯",["嗯","恩","摁"]],["恩",["嗯","恩","摁"]],["摁",["嗯","恩","摁"]],["偰",["偰","契","楔"]],["契",["偰","契","楔"]],["楔",["偰","契","楔"]],["坐",["坐","座"]],["座",["坐","座"]],["埼",["埼","崎","嵜","碕"]],["崎",["埼","崎","嵜","碕"]],["嵜",["埼","崎","嵜","碕"]],["碕",["埼","崎","嵜","碕"]],["征",["征","徴","徵","怔","愣"]],["徴",["征","徴","徵","怔","愣"]],["徵",["征","徴","徵","怔","愣"]],["怔",["征","徴","徵","怔","愣"]],["愣",["征","徴","徵","怔","愣"]],["份",["份","分","芬"]],["分",["份","分","芬"]],["芬",["份","分","芬"]],["嫒",["嫒","嬡","愛","爱","瑷","璦"]],["嬡",["嫒","嬡","愛","爱","瑷","璦"]],["愛",["嫒","嬡","愛","爱","瑷","璦"]],["爱",["嫒","嬡","愛","爱","瑷","璦"]],["瑷",["嫒","嬡","愛","爱","瑷","璦"]],["璦",["嫒","嬡","愛","爱","瑷","璦"]],["姓",["姓","性"]],["性",["姓","性"]],["娇",["娇","嬌","驕","骄"]],["嬌",["娇","嬌","驕","骄"]],["驕",["娇","嬌","驕","骄"]],["骄",["娇","嬌","驕","骄"]],["召",["召","招"]],["招",["召","招"]],["微",["微","薇"]],["薇",["微","薇"]],["傲",["傲","敖","熬","璈","遨"]],["敖",["傲","敖","熬","璈","遨"]],["熬",["傲","敖","熬","璈","遨"]],["璈",["傲","敖","熬","璈","遨"]],["遨",["傲","敖","熬","璈","遨"]],["奥",["奥","奧","澳","袄","襖"]],["奧",["奥","奧","澳","袄","襖"]],["澳",["奥","奧","澳","袄","襖"]],["袄",["奥","奧","澳","袄","襖"]],["襖",["奥","奧","澳","袄","襖"]],["振",["振","震"]],["震",["振","震"]],["忝",["忝","恬"]],["恬",["忝","恬"]],["担",["担","擔","檐","簷"]],["擔",["担","擔","檐","簷"]],["檐",["担","擔","檐","簷"]],["簷",["担","擔","檐","簷"]],["冥",["冥","瞑"]],["瞑",["冥","瞑"]],["妇",["妇","婦","媍"]],["婦",["妇","婦","媍"]],["媍",["妇","婦","媍"]],["䦰",["䦰","䰗","阄","鬮","𨷺"]],["䰗",["䦰","䰗","阄","鬮","𨷺"]],["阄",["䦰","䰗","阄","鬮","𨷺"]],["鬮",["䦰","䰗","阄","鬮","𨷺"]],["𨷺",["䦰","䰗","阄","鬮","𨷺"]],["帚",["帚","扫","掃","箒","菷"]],["扫",["帚","扫","掃","箒","菷"]],["掃",["帚","扫","掃","箒","菷"]],["箒",["帚","扫","掃","箒","菷"]],["菷",["帚","扫","掃","箒","菷"]],["拣",["拣","捡","揀","撿","检","検","檢"]],["捡",["拣","捡","揀","撿","检","検","檢"]],["揀",["拣","捡","揀","撿","检","検","檢"]],["撿",["拣","捡","揀","撿","检","検","檢"]],["检",["拣","捡","揀","撿","检","検","檢"]],["検",["拣","捡","揀","撿","检","検","檢"]],["檢",["拣","捡","揀","撿","检","検","檢"]],["帘",["帘","濂","簾"]],["濂",["帘","濂","簾"]],["簾",["帘","濂","簾"]],["伎",["伎","妓","技"]],["妓",["伎","妓","技"]],["技",["伎","妓","技"]],["法",["法","珐","琺"]],["珐",["法","珐","琺"]],["琺",["法","珐","琺"]],["晖",["晖","暉","煇","輝","辉","𪸩"]],["暉",["晖","暉","煇","輝","辉","𪸩"]],["煇",["晖","暉","煇","輝","辉","𪸩"]],["輝",["晖","暉","煇","輝","辉","𪸩"]],["辉",["晖","暉","煇","輝","辉","𪸩"]],["𪸩",["晖","暉","煇","輝","辉","𪸩"]],["昡",["昡","炫","眩"]],["炫",["昡","炫","眩"]],["眩",["昡","炫","眩"]],["踰",["踰","逾"]],["逾",["踰","逾"]],["茜",["茜","西"]],["西",["茜","西"]],["勘",["勘","堪"]],["堪",["勘","堪"]],["筣",["筣","篱","籬"]],["篱",["筣","篱","籬"]],["籬",["筣","篱","籬"]],["笓",["笓","箆","篦"]],["箆",["笓","箆","篦"]],["篦",["笓","箆","篦"]],["仓",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["倉",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["怆",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["愴",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["沧",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["滄",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["舱",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["艙",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["苍",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["蒼",["仓","倉","怆","愴","沧","滄","舱","艙","苍","蒼"]],["几",["几","幾","机","機"]],["幾",["几","幾","机","機"]],["机",["几","幾","机","機"]],["機",["几","幾","机","機"]],["彻",["彻","徹","澈"]],["徹",["彻","徹","澈"]],["澈",["彻","徹","澈"]],["个",["个","個","各","箇"]],["個",["个","個","各","箇"]],["各",["个","個","各","箇"]],["箇",["个","個","各","箇"]],["久",["久","乆","灸","玖","镹"]],["乆",["久","乆","灸","玖","镹"]],["灸",["久","乆","灸","玖","镹"]],["玖",["久","乆","灸","玖","镹"]],["镹",["久","乆","灸","玖","镹"]],["鱗",["鱗","鳞","麐","麟"]],["鳞",["鱗","鳞","麐","麟"]],["麐",["鱗","鳞","麐","麟"]],["麟",["鱗","鳞","麐","麟"]],["剪",["剪","翦"]],["翦",["剪","翦"]],["僖",["僖","喜","囍","憙","禧"]],["喜",["僖","喜","囍","憙","禧"]],["囍",["僖","喜","囍","憙","禧"]],["憙",["僖","喜","囍","憙","禧"]],["禧",["僖","喜","囍","憙","禧"]],["㷉",["㷉","尉","慰","熨","罻"]],["尉",["㷉","尉","慰","熨","罻"]],["慰",["㷉","尉","慰","熨","罻"]],["熨",["㷉","尉","慰","熨","罻"]],["罻",["㷉","尉","慰","熨","罻"]],["勐",["勐","猛"]],["猛",["勐","猛"]],["湌",["湌","飡","餐"]],["飡",["湌","飡","餐"]],["餐",["湌","飡","餐"]],["迸",["迸","逬"]],["逬",["迸","逬"]],["埜",["埜","野"]],["野",["埜","野"]],["吐",["吐","土"]],["土",["吐","土"]],["婉",["婉","宛","惌","琬","碗"]],["宛",["婉","宛","惌","琬","碗"]],["惌",["婉","宛","惌","琬","碗"]],["琬",["婉","宛","惌","琬","碗"]],["碗",["婉","宛","惌","琬","碗"]],["玉",["玉","鈺"]],["鈺",["玉","鈺"]],["伃",["伃","俞","兪","妤","瑜","諭","谕"]],["俞",["伃","俞","兪","妤","瑜","諭","谕"]],["兪",["伃","俞","兪","妤","瑜","諭","谕"]],["妤",["伃","俞","兪","妤","瑜","諭","谕"]],["瑜",["伃","俞","兪","妤","瑜","諭","谕"]],["諭",["伃","俞","兪","妤","瑜","諭","谕"]],["谕",["伃","俞","兪","妤","瑜","諭","谕"]],["毓",["毓","育"]],["育",["毓","育"]],["桩",["桩","椿","樁"]],["椿",["桩","椿","樁"]],["樁",["桩","椿","樁"]],["但",["但","旦"]],["旦",["但","旦"]],["崁",["崁","嵌"]],["嵌",["崁","嵌"]],["塌",["塌","踏"]],["踏",["塌","踏"]],["漠",["漠","陌","默","黙"]],["陌",["漠","陌","默","黙"]],["默",["漠","陌","默","黙"]],["黙",["漠","陌","默","黙"]],["拙",["拙","絀","绌","黜"]],["絀",["拙","絀","绌","黜"]],["绌",["拙","絀","绌","黜"]],["黜",["拙","絀","绌","黜"]],["恰",["恰","洽"]],["洽",["恰","洽"]],["䁩",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["䐳",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["䲆",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["渔",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["漁",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["魚",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["鱼",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["𤉯",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["𤋳",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["𩥭",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["𩵋",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["𩺰",["䁩","䐳","䲆","渔","漁","魚","鱼","𤉯","𤋳","𩥭","𩵋","𩺰"]],["奖",["奖","奨","奬","獎"]],["奨",["奖","奨","奬","獎"]],["奬",["奖","奨","奬","獎"]],["獎",["奖","奨","奬","獎"]],["㤼",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["刦",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["刧",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["刼",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["劫",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["𠉨",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["𠛗",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["𠞏",["㤼","刦","刧","刼","劫","𠉨","𠛗","𠞏"]],["吒",["吒","咤","詫","诧"]],["咤",["吒","咤","詫","诧"]],["詫",["吒","咤","詫","诧"]],["诧",["吒","咤","詫","诧"]],["殒",["殒","殞","磒","陨","隕"]],["殞",["殒","殞","磒","陨","隕"]],["磒",["殒","殞","磒","陨","隕"]],["陨",["殒","殞","磒","陨","隕"]],["隕",["殒","殞","磒","陨","隕"]],["佰",["佰","百","𦣻"]],["百",["佰","百","𦣻"]],["𦣻",["佰","百","𦣻"]],["滥",["滥","濫","烂","爛"]],["濫",["滥","濫","烂","爛"]],["烂",["滥","濫","烂","爛"]],["爛",["滥","濫","烂","爛"]],["勿",["勿","毋"]],["毋",["勿","毋"]],["裏",["裏","裡","里","𥚃"]],["裡",["裏","裡","里","𥚃"]],["里",["裏","裡","里","𥚃"]],["𥚃",["裏","裡","里","𥚃"]]]);}(vs),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.greedyTableReplace=h.greedyTableCharArray=h.greedyTableTest=h._greedyTableBuild=h._greedyTableCacheRegexp=h._greedyTableCacheMap=h._greedyTableCacheTest=void 0;const z=fs;Object.defineProperty(h,"_greedyTableBuild",{enumerable:!0,get:function(){return z._greedyTableBuild}});const t=vs;function s(h){return t._greedyTableCacheTest.test(h)}Object.defineProperty(h,"_greedyTableCacheTest",{enumerable:!0,get:function(){return t._greedyTableCacheTest}}),Object.defineProperty(h,"_greedyTableCacheMap",{enumerable:!0,get:function(){return t._greedyTableCacheMap}}),Object.defineProperty(h,"_greedyTableCacheRegexp",{enumerable:!0,get:function(){return t._greedyTableCacheRegexp}}),h.greedyTableTest=s,h.greedyTableCharArray=function(h){return t._greedyTableCacheMap.get(h)},h.greedyTableReplace=function(h){return s(h)?t._greedyTableCacheRegexp.reduce((function(h,z){return h.replace(z[0],z[1])}),h):h},h.default=h;}(ls),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.auto=h.jp=h.cn=h.tw=void 0;const z=a,t=js,s=z.__importDefault(Jt),p=z.__importDefault(cs),j=ls,e=Qt;z.__exportStar(ss,h),h.tw=(0, e._wrapFn)("tw"),h.cn=(0, e._wrapFn)("cn"),h.jp=(0, e._wrapFn)("jp"),h.auto=function(h,z={}){if(!h)return null;if(z.skip&&-1!=z.skip.indexOf(h))return [h];let r=(0, t.jp2zht)(h),n=(0, t.jp2zhs)(h),u=0|z.greedyTable;return (0, e._get)([],h,s.default.tw(h,z),s.default.cn(h,z),(!z.skip||-1==z.skip.indexOf(r))&&s.default.cn(r,z),(!z.skip||-1==z.skip.indexOf(n))&&s.default.tw(n,z),s.default.jp(h,z),u&&(0, t.cjk2jp)(h),u&&(0, t.cjk2zhs)(h),u&&(0, t.cjk2zht)(h),u&&p.default.zh2jp(h,{safe:u<=1}),u&&p.default.jp2zh(h,{safe:u<=1}),u>1&&(0, j.greedyTableCharArray)(h))},h.default=h;}(ps),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h._get=h.libTable=void 0;const z=a,t=z.__importDefault(Jt);h.libTable=t.default;const s=Qt;Object.defineProperty(h,"_get",{enumerable:!0,get:function(){return s._get}}),z.__exportStar(ss,h),z.__exportStar(ps,h),h.default=h;}($t);var As={};!function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.cjk2jp=h.cjk2zht=h.jp2zht=h.jp2zhs=h.cjk2zhs=h.zht2zhs=h.zhs2zht=h.zhs2jp=h.zht2jp=h.zh2jp=void 0;var z=js;Object.defineProperty(h,"zh2jp",{enumerable:!0,get:function(){return z.zh2jp}}),Object.defineProperty(h,"zht2jp",{enumerable:!0,get:function(){return z.zht2jp}}),Object.defineProperty(h,"zhs2jp",{enumerable:!0,get:function(){return z.zhs2jp}}),Object.defineProperty(h,"zhs2zht",{enumerable:!0,get:function(){return z.zhs2zht}}),Object.defineProperty(h,"zht2zhs",{enumerable:!0,get:function(){return z.zht2zhs}}),Object.defineProperty(h,"cjk2zhs",{enumerable:!0,get:function(){return z.cjk2zhs}}),Object.defineProperty(h,"jp2zhs",{enumerable:!0,get:function(){return z.jp2zhs}}),Object.defineProperty(h,"jp2zht",{enumerable:!0,get:function(){return z.jp2zht}}),Object.defineProperty(h,"cjk2zht",{enumerable:!0,get:function(){return z.cjk2zht}}),Object.defineProperty(h,"cjk2jp",{enumerable:!0,get:function(){return z.cjk2jp}}),h.default=h;}(As);var ws={},Ts={};!function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.zh=h.jp=h.word=h.filename=void 0;const z=js,t=It;function s(h,t={}){return p((0, z.zh2jp)(p(h),{skip:"竜龍制征里像拜冰澤涉丑兒娘姐姉志儿從辨勞"+(t.skip||""),safe:"boolean"!=typeof t.safe||t.safe})).replace(/诅/g,"詛").replace(/复仇/g,"復仇").replace(/戦斗/g,"戦闘").replace(/^プロローグ/,"序").replace(/^エピローグ/,"終章").replace(/総/g,"總").replace(/帰|归/g,"歸").replace(/辺/g,"邊").replace(/対/g,"對").replace(/独/g,"獨").replace(/実/g,"實").replace(/決斗/g,"決闘").replace(/仮/g,"假").replace(/戦/g,"戰")}function p(h,z={}){return h.replace(/[\u2000-\u200F]/g,"").replace(/[\u2028-\u202F]/g,"").replace(/[\u205F-\u2060]/g,"").replace(/与/g,"與").replace(/[亜亚亞]/g,"亞").replace(/価/,"價").replace(/[觉覚覺]/g,"覺").replace(/亏/g,"虧").replace(/[·‧・···•]/g,"・").replace(/泽/g,"澤").replace(/^(?:后)(記|日)/,"後$1").replace(/(身)(?:后)/,"$1後").replace(/(?:后)(悔)/,"後$1").replace(/回复/g,"回復").replace(/复(仇|讐)/g,"復$1").replace(/里面/g,"裡面").replace(/([今此])后/g,"$1後").replace(/[么预枪丛迈这个尔儿从龙丝风劳弃别驯卢妈称号]+/gu,(function(h){return (0, t.cn2tw)(h)}))}h.filename=function(h,z={}){return s(h,z).replace(/·/g,"・")},h.word=function(h,z={}){return s(h,z)},h.jp=s,h.zh=p,h.default=h;}(Ts),function(h){Object.defineProperty(h,"__esModule",{value:!0});const z=a;z.__exportStar(Ts,h);const t=z.__importDefault(Ts);h.default=t.default;}(ws),function(z){var t=h&&h.__importDefault||function(h){return h&&h.__esModule?h:{default:h}};Object.defineProperty(z,"__esModule",{value:!0}),z.novelFilename=z.cjk2jp=z.cjk2zhs=z.cjk2zht=z.jp2zhs=z.jp2zht=z.zh2jp=z.jpConvert=z.zhTable=z.cn2tw=z.tw2cn=z.zhConvert=void 0;var s=l;Object.defineProperty(z,"zhConvert",{enumerable:!0,get:function(){return t(s).default}}),Object.defineProperty(z,"tw2cn",{enumerable:!0,get:function(){return s.tw2cn}}),Object.defineProperty(z,"cn2tw",{enumerable:!0,get:function(){return s.cn2tw}});var p=$t;Object.defineProperty(z,"zhTable",{enumerable:!0,get:function(){return t(p).default}});var j=As;Object.defineProperty(z,"jpConvert",{enumerable:!0,get:function(){return t(j).default}}),Object.defineProperty(z,"zh2jp",{enumerable:!0,get:function(){return j.zh2jp}}),Object.defineProperty(z,"jp2zht",{enumerable:!0,get:function(){return j.jp2zht}}),Object.defineProperty(z,"jp2zhs",{enumerable:!0,get:function(){return j.jp2zhs}}),Object.defineProperty(z,"cjk2zht",{enumerable:!0,get:function(){return j.cjk2zht}}),Object.defineProperty(z,"cjk2zhs",{enumerable:!0,get:function(){return j.cjk2zhs}}),Object.defineProperty(z,"cjk2jp",{enumerable:!0,get:function(){return j.cjk2jp}});var e=ws;Object.defineProperty(z,"novelFilename",{enumerable:!0,get:function(){return t(e).default}}),z.default=z;}(c);var ms={},Es="1.2.139";return function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.version=void 0,h.default=h.version,Object.defineProperty(h,"version",{get:()=>Es}),Object.defineProperty(h,"default",{get:()=>h.version});}(ms),function(h){Object.defineProperty(h,"__esModule",{value:!0}),h.cjkConv=void 0;const z=a,t=z.__importDefault(c);h.cjkConv=t.default,z.__exportStar(ms,h),z.__exportStar(c,h),h.default=t.default;}(s),z(s)}));
  });

  function chineseConversion(text) {
    switch (Setting.chineseConversion) {
      case 'disable':
        return text
      case 'to-cn':
        return cjkConv.tw2cn(text)
      case 'to-tw':
        return cjkConv.cn2tw(text)
    }
  }

  function getElemFontSize(_heading) {
      var fontSize = 0;
      var _heading_style = window.getComputedStyle(_heading, null);
      if (_heading_style) {
          // firefox57 2017年9月10日 会错误
          try {
              var str = _heading_style.getPropertyValue("font-size") || 0;
              fontSize = parseInt(str, 10);
          } catch(e) { }
      }

      return fontSize
  }

  function Parser(){
      this.init.apply(this, arguments);
  }

  Parser.prototype = {
      constructor: Parser,
      get contentTxt() {  // callback 才有用
          var text = $('<div>').html(this.content).text().trim();

          // 解决第二个段落和第一个锻炼合在一起的问题
          text = text.replace(/([^\n])　　/, '$1\n　　');

          return text;
      },

      init: function (info, doc, curPageUrl) {
          this.info = info || {};
          this.doc = (info.cloneNode && doc.defaultView) ? doc.cloneNode(true) : doc;
          this.$doc = $(this.doc);
          this.curPageUrl = curPageUrl || doc.URL;
          this._curPageHost = getUrlHost(this.curPageUrl);  // 当前页的 host，后面用到

          // 设置初始值
          this.isTheEnd = false;
          this.isSection = false;

          if (doc.defaultView && doc.defaultView.$cleanupEvents) {
              doc.defaultView.$cleanupEvents(true);
          }
          
      },
      applyPatch: function(){
          var contentPatch = this.info.contentPatch;
          if(contentPatch){
              try {
                  contentPatch.call(this, this.$doc);
                  C.log("Apply Content Patch Success.");
              } catch (e) {
                  C.log("Error: Content Patch Error!", e);
              }
          }
      },
      applyAsyncPatch: async function() {
          var contentPatch = this.info.contentPatchAsync;
          if(contentPatch){
              try {
                  await contentPatch.call(this, this.$doc);
                  C.log("Apply Content Patch[Async] Success.");
              } catch (e) {
                  C.log("Error: Content Patch[Async] Error!", e);
              }
          }
      },
      getAll: async function(){

          C.log('开始解析页面');

          this.applyPatch();

          await this.applyAsyncPatch();

          await this.preProcessDoc();

          this.parse();

          return this;
      },
      preProcessDoc: async function() {
          let data;

          if (!this.hasContent() && this.info.getContent) {
              C.log('开始 info.getContent');
              data = await this.info.getContent.call(this, this.$doc);
          } /* else {
              // 特殊处理，例如起点
              var ajaxScript = this.$doc.find('.' + READER_AJAX);
              if (ajaxScript.length > 0) {
                  var url = ajaxScript.attr('src');
                  if(!url) return;
                  var charset = ajaxScript.attr('charset') || 'utf-8';

                  C.log('Ajax 获取内容: ', url, ". charset=" + charset);

                  var reqObj = {
                      url: url,
                      method: "GET",
                      overrideMimeType: "text/html;charset=" + charset,
                      headers: {},
                  };

                  // Jixun: Allow post data
                  var postData = ajaxScript.data('post');

                  if (postData) {
                      reqObj.method = 'POST';
                      reqObj.data = $.param(postData);
                      reqObj.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                  }

                  let res = await Request(reqObj)
                  var text = res.responseText;
                  text = text.replace(/document.write(ln)?\('/, "")
                          .replace("');", "")
                          .replace(/[\n\r]+/g, '</p><p>');

                  data = { content: text }

              }
          } */
          if (data) {
              var div;
              if (data.content) {
                  div = $('<div id="content"></div>').html(data.content);
              } else if (data.html) {
                  div = $('<div></div>').html(data.html);
              }

              this.$doc.find('body').prepend(div);
          }

      },
      parse: function() {
          C.group('开始获取链接');
          this.getPrevUrl();
          this.getIndexUrl();
          this.getNextUrl();
          C.groupEnd();

          C.group('开始获取标题');
          this.getTitles();
          C.groupEnd();

          this.getContent();
      },

      hasContent: function() {
          if (this.$content) {
              return this.$content > 0;
          }

          var $content;

          // var $ajaxScript = this.$doc.find('.' + READER_AJAX);
          // if ($ajaxScript.length > 0) {
          //     return true;
          // }

          // 排除 qidian 需付费的页面
          if (this.info.isVipChapter) {
              if (this.info.isVipChapter(this.$doc)) {
                  this.isTheEnd = 'vip';
                  return false;
              }
          }

          if(this.info.contentSelector){
              $content = this.$doc.find(this.info.contentSelector);
          }

          if (!$content || !$content.length) {
              // 移除不可见元素，仅使用 iframe 加载时可用
              if (this.info.useiframe) {
                  const hiddenElements = this.$doc.find('div').filter(':hidden');
                  if (hiddenElements) {
                      C.log('发现隐藏元素：', hiddenElements);
                      hiddenElements.remove();
                  }
              }
              
              // 按照顺序选取
              var selectors = Rule.contentSelectors;
              for(var i = 0, l = selectors.length; i < l; i++){
                  $content = this.$doc.find(selectors[i]);
                  if($content.length){
                      C.log("自动查找内容选择器: " + selectors[i]);
                      break;
                  }
              }
          }

          this.$content = $content;
          // C.debug($content);

          return $content.size() > 0;
      },
      // 获取书名和章节标题
      getTitles: function(){
          var info = this.info,
              chapterTitle,
              bookTitle,
              docTitle = this.$doc.find("title").text();

          // 获取章节标题
          if (info.titleReg){
              var matches = docTitle.match(toRE(info.titleReg, 'i'));
              if(matches && matches.length >= 2){
                  var titlePos = ( info.titlePos || 0 ) + 1;
                  var chapterPos = (titlePos == 1) ? 2 : 1;

                  bookTitle = matches[titlePos];
                  chapterTitle = matches[chapterPos];
              }

              C.log("TitleReg:", info.titleReg, matches);
          }

          // 如果有 titleSelector 则覆盖从 titleReg 中获取的
          var tmpChapterTitle = this.getTitleFromRule(info.titleSelector);
          if (tmpChapterTitle) {
              chapterTitle = tmpChapterTitle;
          }

          if(!chapterTitle){
              chapterTitle = this.autoGetChapterTitle(this.doc);
          }
          if (info.chapterTitleReplace) {
              chapterTitle = chapterTitle.replace(toRE(info.chapterTitleReplace), '');
          }

          // get bookTitle
          if (!bookTitle && info.bookTitleSelector) {
              bookTitle = this.getTitleFromRule(info.bookTitleSelector);
          }
          if (!bookTitle) {
              bookTitle = autoGetBookTitle(this.$doc);
              bookTitle = this.replaceText(bookTitle, Rule.bookTitleReplace);
          }
          if (info.bookTitleReplace) {
              bookTitle = bookTitle.replace(toRE(info.bookTitleReplace), '');
          }

          // 标题间增加一个空格，不准确，已注释
          chapterTitle = chapterTitle
                  .replace(Rule.titleReplace, "")
                  .trim();
                  // .replace(/(第?\S+?[章节卷回])(.*)/, "$1 $2");

          if (chapterTitle.startsWith(bookTitle)) {
              chapterTitle = chapterTitle.replace(bookTitle, '').trim();
          }

          bookTitle = bookTitle.replace(/(?:最新章节|章节目录)$/, '');

          docTitle = bookTitle ?
                  bookTitle + ' - ' + chapterTitle :
                  docTitle;

          // if (Setting.cn2tw) {
          //     bookTitle = this.convert2tw(bookTitle);
          //     chapterTitle = this.convert2tw(chapterTitle);
          //     docTitle = this.convert2tw(docTitle);
          // }

          bookTitle = chineseConversion(bookTitle);
          chapterTitle = chineseConversion(chapterTitle);
          docTitle = chineseConversion(docTitle);

          this.bookTitle = (bookTitle || '目录').trim();
          this.chapterTitle = chapterTitle;
          this.docTitle = docTitle;

          C.log("Book Title: " + this.bookTitle);
          C.log("Chapter Title: " + this.chapterTitle);
          C.log("Document Title: " + this.docTitle);
      },
      getTitleFromRule: function(selectorOrArray) {
          var title = '';
          if (!selectorOrArray) {
              return '';
          }

          var selector,
              replace;

          if (_.isArray(selectorOrArray)) {
              selector = selectorOrArray[0];
              replace = selectorOrArray[1];
          } else {
              selector = selectorOrArray;
          }

          var $title = this.$doc.find(selector);
          if (!$title.length) {
              C.error('无法找到标题', selector, this.doc);
              return '';
          }

          title = $title.remove().first().text().trim();

          if (replace) {
              title = title.replace(toRE(replace), '');
          }

          return title;
      },
      // 智能获取章节标题
      autoGetChapterTitle: function (document) {
          var
              _main_selector = "h1, h2, h3",
              _second_selector = "#TextTitle, #title, .ChapterName, #lbChapterName, div.h1, #nr_title",
              _positive_regexp = Rule.titleRegExp,
              // _positive_regexp = /第?\S+[章节卷回]|\d{2,4}/,
              // _negative_regexp = /[上前下后][一]?[页张个篇章节步]/,
              _title_remove_regexp = /最新章节|书书网/,
              $doc = $(document),
              _document_title = document.title || $doc.find("title").text(),
              _search_document_title = ' ' + _document_title.replace(/\s+/gi, ' ') + ' '
          ;

          var _headings = $doc.find(_main_selector);
          // 加上 second selector 并去除包含的
          $doc.find(_second_selector).each(function(){
              if($(this).find(_main_selector).length === 0){
                  _headings.push(this);
              }
          });

          var possibleTitles = {},
              _heading_text;

          C.groupCollapsed('自动查找章节标题');

          $(_headings).each(function(){
              var _heading = this,
                  _heading_text = _heading.textContent.trim();

              if (!_heading_text || _heading_text in possibleTitles) {
                  return;
              }

              C.group('开始计算 "' + _heading_text + '" 的得分');

              // h1 为 1， h2 为 2
              var
                  nodeNum = parseInt(_heading.nodeName.slice(1), 10) || 10,
                  score = 10 / nodeNum,
                  _heading_words = _heading_text.replace(/\s+/g, " ").split(" "),
                  _matched_words = ""
              ;

              C.log("初始得分：" + score);

              // 后面这种是特殊的判断
              if (_positive_regexp.test(_heading_text) || /\d{2,4}/.test(_heading_text)) {
                  score += 50;
              }
              // if(_negative_regexp.test(_heading_text)){
              //     score -= 100;
              // }

              C.log("符合正则计算后得分：" + score);

              //  count words present in title
              for (var j = 0, _j = _heading_words.length; j < _j; j++) {
                  if (_search_document_title.indexOf(_heading_words[j]) > -1) {
                      _matched_words += _heading_words[j] + ' ';
                  }
              }
              score += _matched_words.length * 1.5;

              C.log("跟页面标题比较后得分：" + score);

              var _font_size_add_score = getElemFontSize(_heading) * 1.5;
              score +=  _font_size_add_score;

              C.log("计算大小后得分：" + score);

              possibleTitles[_heading_text] = score;

              C.groupEnd();
          });

          // 找到分数最高的值
          var topScoreTitle,
              score_tmp = 0;
          for (_heading_text in possibleTitles) {
              if (possibleTitles[_heading_text] > score_tmp) {
                  topScoreTitle = _heading_text;
                  score_tmp = possibleTitles[_heading_text];
              }
          }

          var curTitle = topScoreTitle;
          if (!curTitle) {
              curTitle = _document_title;

              // 下面的正则从
              //     Firefox-Firefox浏览器论坛-卡饭论坛 - 互助分享 - 大气谦和!
              // 变为
              //     Firefox-Firefox浏览器论坛-卡饭论坛
              curTitle = curTitle.replace(/\s-\s.*/i, "")
                  .replace(/_[^\[\]【】]+$/, "");
              curTitle = curTitle.trim();
              curTitle = curTitle.replace(_title_remove_regexp, '');
          }

          curTitle = curTitle.replace(Rule.titleReplace, "");

          C.groupEnd();

          return curTitle;
      },

      // 获取和处理内容
      getContent: function(){

          this.hasContent();

          if (!this.$content || this.$content.size() <= 0) {
              // callback(this);
              C.error('没有找到内容', this.$doc);
              return;
          }

          this.content = this.handleContentText(this.$content.html(), this.info);
      },
      handleContentText: function(text, info){
          if(!text) return null;

          if (info.useRawContent) {
              C.log('内容处理已被自定义站点规则 useRawContent 关闭');
              // 繁简转换
              text = chineseConversion(text);
              return text
          }


          // 贴吧的内容处理比较耗时间
          C.group('开始内容处理');
          C.time('内容处理');

          var contentHandle = (typeof(info.contentHandle) == 'undefined') ? true : info.contentHandle;

          // 拼音字、屏蔽字修复
          // if(contentHandle){
          //     text = this.replaceHtml(text, Rule.replace);
          // }

          /* Turn all double br's into p's */
          text = text.replace(Rule.replaceBrs, '</p>\n<p>');
          text = text.replace(/<\/p><p>/g, "</p>\n<p>");

          // GM_setClipboard(text);

          // // 规则替换
          // if (info.contentReplace) {
          //     text = this.replaceText(text, info.contentReplace);
          // }

          // // 移除文字广告等
          // text = this.replaceText(text, Rule.replaceAll);

          // 去除内容中的标题
          if(this.chapterTitle && Rule.titleRegExp.test(this.chapterTitle)){
              try {
                  var reg = toReStr(this.chapterTitle).replace(/\s+/g, '\\s*');
                  // reg = new RegExp(reg, 'ig');
                  text = text.replace(toRE(reg), "");
                  C.log('去除内容中的标题', reg);
              } catch(e) {
                  C.error(e);
              }
          }

          if (this.bookTitle) {
              var regStr = '（' + toReStr(this.bookTitle) + '\\d*章）';
              text = text.replace(toRE(regStr), "");
          }

          // if (Setting.cn2tw) {
          //     text = this.convert2tw(text);
          // }

          // try {
          //     text = this.contentCustomReplace(text);
          // } catch(ex) {
          //     console.error('自定义替换错误', ex);
          // }

          // 采用 DOM 方式进行处理
          var $div = $("<div>").html(text);

          // 尝试删除正文中的章节标题
          $div.find('h1, h2, h3').remove();

          // 删除带默认样式的标签
          const styledTags = ['i', 'b', 'em', 'strong'];
          styledTags.forEach(name => unwrapTag($div[0], name));

          // contentRemove
          $div.find(Rule.contentRemove).remove();
          if(info.contentRemove){
              $div.find(info.contentRemove).remove();
          }

          // 净化文本节点内容
          // 会进行拼音字修复，规则替换，广告净化，自定义替换
          this.clearContent($div[0], info);

          // 给独立的文本加上 p
          var $contents = $div.contents();
          if ($contents.length === 1) {   // 可能里面还包裹着一个 div
              $contents = $contents.contents();
          }
          $contents.filter(function() {
              return this.nodeType == 3 &&
                  this.textContent != '\n' &&
                  (!this.nextElementSibling || this.nextElementSibling.nodeName != 'A') &&
                  (!this.previousElementSibling || this.previousElementSibling.nodeName != 'A');
          }).wrap('<p>');

          // 删除无效的 p，排除对大块文本的判断
          $div.find('p, h1').filter(function() {
              var $this = $(this);
              if ($this.find('img').size())  // 排除有图片的
                  return false;

              // 有效文本（排除注释、换行符、空白）个数为 0
              return $this.contents().filter(function() {
                  return this.nodeType != 8 &&
                          !this.textContent.match(/^\s*$/);
              }).size() == 0;
          }).remove();

          // 把一大块的文本分段
          if (Setting.split_content) {
              var $p = $div.find('p'),
                  $newP;
              if ($p.length == 0 ) {
                  $newP = $div;
              } else if ($p.length == 1) {
                  $newP = $p;
              }

              if ($newP) {
                  $newP.replaceWith('<p>' + this.splitContent($newP.html()).join('</p>\n<p>') + '</p>');
              }
          }

          if(contentHandle){
              $div.filter('br').remove();

              $div.find('*').removeAttr('style');
          }

          // $div.find('p').removeAttr('class');

          // 图片居中，所有图像？
          // if(info.fixImage){
          //     $div.find("img").each(function(){
          //         this.className += " blockImage";
          //     });
          // }

          text = $div.html();

          // 修复第一行可能是空的情况
          text = text.replace(/(?:\s|&nbsp;)+<p>/, "<p>");

          // 修复当行就一个字符的
          text = text.replace(/<\/p><p>([。])/, "$1");

          {
              text = text.replace(/<p[^>]*>(?:\s|&nbsp;)*/g, "<p>　　");
                      // .replace(/<p>/g, "<p>　　");
          }

          // 删除空白的、单个字符的 p
          text = text.replace(Rule.removeLineRegExp, "");

          // text = this.removeDump(text)

          C.timeEnd('内容处理');
          C.groupEnd();

          return text;
      },
      clearContent: function(dom, info) {
          const textNodes = getTextNodesIn(dom);

          // 获取节点文本并去重
          // 例如 https://www.biquge.name/html/3/3165/71213641.html
          const contents = textNodes.map(node => node.data.trim().replace(/\s+/g, ' '));
          const deDupeConetents = [...new Set(contents)];

          let content;

          // 查重率超过 10% 则使用去重后内容
          const dupeRate = (contents.length - deDupeConetents.length) / contents.length;
          if (dupeRate > 0.1) {
              content = deDupeConetents.join('\n');
              C.log(`去除了 ${contents.length - deDupeConetents.length} 段重复内容`);
          } else {
              content = contents.join('\n');
          }

          var contentHandle = (typeof(info.contentHandle) == 'undefined') ? true : info.contentHandle;

          C.log(`本章字数：${content.length}`);

          // 拼音字、屏蔽字修复
          if (contentHandle) {
              content = this.replaceText(content, Rule.replace);
          }

          // 删除含网站域名行文本
          const removeText = [];
          const hostRe = toRE(`^.*?${this._curPageHost}.*?$`);
          content = content.replace(hostRe, match => {
              removeText.push(match);
              return ''
          });  
          C.log(`删除含网站域名行`, hostRe, removeText);

          // 规则替换
          if (info.contentReplace) {
              content = this.replaceText(content, info.contentReplace);
          }

          content = this.replaceText(content, Rule.replaceAll);
          
          // 内容标准化处理
          if (Setting.contentNormalize) {
              content = replaceNormalize(content);
              content = toCDB(content);
          }

          try {
              content = this.contentCustomReplace(content);
          } catch(ex) {
              C.error('自定义替换错误', ex);
          }

          // 繁简转换
          content = chineseConversion(content);

          const finalContents = content.split('\n');

          textNodes
              .filter(node => node.parentNode !== dom)
              .forEach(node => toParagraphNode(node.parentNode));

          if (finalContents.length <= textNodes.length) {
              textNodes.forEach((node, index) => {
                  if (!finalContents[index]) {
                      node.data = '';
                  } else if (node.data.trim() !== finalContents[index]) {
                      node.data = finalContents[index];
                  }
              });
          } else {
              finalContents.forEach((text, index) => {
                  if (!textNodes[index]) {
                      $('<p>').text(text).appendTo(dom);
                  } else if (textNodes[index].data.trim() !== text) {
                      textNodes[index].data = text;
                  }
              });
          }

      },
      normalizeContent: function(html) {
          html = html.replace(/<\/p><p>/g, '</p>\n<p>');

          return html;
      },
      /**
       * 移除内容中大块的重复。
       * 例如：http://www.wangshuge.com/books/109/109265/28265316.html
       *
       * @param  {string} html 内容
       * @return {string}      处理后的内容
       */
      removeDump: function(html) {
          html = this.normalizeContent(html);
          var newContent = html;

          var lines = html.split('\n');
          var firstLine = lines[0];
          // 有重复
          if (firstLine.length > 10) {
              // 因为 indexOf 只查找第一个
              var dumpIndex = lines.slice(1).indexOf(firstLine) + 1;
              if (dumpIndex >= config.dumpContentMinLength) {
                  var firstPart = lines.slice(0, dumpIndex).join('\n');
                  var restPart = lines.slice(dumpIndex).join('\n')
                      .replace(/^<\/p>\n/, '');
                  if (restPart.startsWith(firstPart)) {
                      newContent = restPart;
                  }
              }
          }

          return newContent;
      },
      replaceHtml: function(text, replaceRule) {  // replaceRule 给“自定义替换规则直接生效”用
          if (!replaceRule) {
              replaceRule = Rule.replace;
          }

          // 先提取出 img
          var imgs = {};
          var i = 0;
          text = text.replace(/<(img|a)[^>]*>/g, function(img){
              imgs[i] = img;
              return "{" + (i++) + "}";
          });

          // 修正拼音字等
          text = this.contentReplacements(text, replaceRule);

          // 还原图片
          text = $.nano(text, imgs);

          return text;
      },
      contentReplacements: function (text, rule) {
          if (!text) return text;

          for (var key in rule) {
              text = text.replace(toRE(key, "ig"), rule[key]);
          }
          return text;
      },
      replaceText: function(text, rule){
          var self = this;
          switch(true) {
              case _.isRegExp(rule):
                  text = text.replace(rule, '');
                  break;
              case _.isString(rule):
                  // 还原简写
                  _.each(CHAR_ALIAS, function(value, key) {
                      rule = rule.replace(key, value);
                  });
                  text = text.replace(toRE(rule), '');
                  break;
              case _.isArray(rule):
                  rule.forEach(function(r){
                      text = self.replaceText(text, r);
                  });
                  break;
              case _.isObject(rule):
                  var key;
                  for(key in rule){
                      text = text.replace(toRE(key), rule[key]);
                  }
                  break;
          }
          return text;
      },
      convert2tw: function (text) {
          if (!text) return text;

          var ii, len, str;
          str = text.split("");
          len = str.length;
          for (ii = 0; ii < len; ii++) {
              str[ii] = cn2tw[str[ii]] || str[ii];
          }

          str = str.join("");

          return str;
      },
      contentCustomReplace: function (text) {
          if (!text) return text;

          for (var key in Rule.customReplace) {
              text = text.replace(toRE(key), Rule.customReplace[key]);
          }
          return text;
      },
      splitContent: function (text) {  // 有些章节整个都集中在一起，没有分段，这个函数用于简易分段
          if (text.indexOf('。') == -1) {
              return [text];
          }

          var hasMark = false,
              lines = [],
              charCotainer = [];

          text.split('').forEach(function(c) {
              charCotainer.push(c);

              if (c == '“') {
                  hasMark = true;
              } else if (c == '”') {
                  hasMark = false;
              } else if (c == '。' && !hasMark) {
                  lines.push(charCotainer.join(''));
                  charCotainer = [];
              }
          });

          return lines;
      },

      getIndexUrl: function(){
          var url = '',
              selector = this.info.indexSelector || this.info.indexUrl;

          if (selector === false) {
              this.indexUrl = url;
              return url;
          }

          // 先尝试站点规则
          if (selector && _.isFunction(selector)) {
              url = selector(this.$doc);
          } else if(this.info.indexSelector){
              url = this.$doc.find(this.info.indexSelector);
          }

          // 再尝试通用规则
          if (!url || !url.length) {
              var selectors = Rule.indexSelectors;
              var _indexLink;
              // 按照顺序选取目录链接
              for(var i = 0, l = selectors.length; i < l; i++){
                  _indexLink = this.$doc.find(selectors[i]);
                  if(_indexLink.length > 0){
                      url = _indexLink;
                      break;
                  }
              }
          }

          if(url){
              url = this.checkLinks(url);
              C.log("找到目录链接: " + url);
          }

          if (!url) {
              C.log("无法找到目录链接.");
          }

          this.indexUrl = url;
          return url;
      },
      getNextUrl: function(){
          var url = '',
              selector = this.info.nextSelector || this.info.nextUrl,
              noSection = this.info.noSection;

          if (selector === false) {
              this.nextUrl = url;
              return url;
          }

          var urlElement, isSectionUrl = false;

          // 先尝试站点规则
          if (selector) {
              if (_.isFunction(selector)) {
                  urlElement = selector(this.$doc);
              } else {
                  urlElement = this.$doc.find(selector);
              }

              url = this.checkLinks(urlElement);
          }

          // 再尝试通用规则
          if (!url) {
              urlElement = this.$doc.find(Rule.nextSelector);
              url = this.checkLinks(urlElement);
          }

          if (!noSection && url && urlElement && !_.isString(urlElement)) {
              // 一般下一章按钮文本含页就是多页章节
              if (!this.isSection && urlElement.text().includes('页')) {
                  isSectionUrl = true;
              }
          }

          if (url) {
              C.log("找到下一页链接: " + url);
          } else {
              C.log("无法找到下一页链接");
          }

          this.nextUrl = url || '';

          if (!isSectionUrl) {
              this.isTheEnd = !this.checkNextUrl(url);
              if (this.isTheEnd) {
                  C.log('已到达最后一页');
                  this.theEndColor = config.end_color;
              }
          }
          
          return url;
      },
      // 获取上下页及目录页链接
      getPrevUrl: function(){
          var url = '',
              selector = this.info.prevSelector || this.info.prevUrl,
              noSection = this.info.noSection;

          if (selector === false) {
              this.prevUrl = url;
              return url;
          }

          var urlElement;

          // 先尝试站点规则
          if (selector) {
              if (_.isFunction(selector)) {
                  urlElement = selector(this.$doc);
              } else {
                  urlElement = this.$doc.find(selector);
              }

              url = this.checkLinks(urlElement);
          }

          // 再尝试通用规则
          if (!url) {
              urlElement = this.$doc.find(Rule.prevSelector);
              url = this.checkLinks(urlElement);
          }

          if (!noSection && url && urlElement && !_.isString(urlElement)) {
              // 一般上一章按钮文本含页就是多页章节
              if (url && !this.isSection && urlElement.text().includes('页')) {
                  C.log('检测到多页章节链接，开启多页章节合并为一章模式');
                  this.isSection = true;
              }
          }

          if (url) {
              C.log("找到上一页链接: " + url);
          } else {
              C.log("无法找到上一页链接");
          }

          this.prevUrl = url || '';
          return url;
      },
      checkNextUrl: function(url){
          const sectionUrlRegex = /\/\d+[_-]\d+\.html$/;
          if (url && this.info.checkSection) {
              if (!sectionUrlRegex.test(this.curPageUrl) &&
                  !sectionUrlRegex.test(this.prevUrl)) {
                  this.isSection = false;
              } else if (sectionUrlRegex.test(this.curPageUrl)) {
                  this.isSection = true;
              } else {
                  this.isSection = false;
              }

              if (this.isSection && url == this.indexUrl) {
                  return false
              } else {
                  return true
              }
          }

          // 跟 include 比较
          var includeUrl = this.info.includeUrl || this.getIncludeUrl();
          if (!toRE(includeUrl).test(url))
              return false;

          switch(true){
              case url === '':
                  return false
              case this.info.exclude && toRE(this.info.exclude).test(url):
                  return false
              case Rule.nextUrlIgnore.some(function(re) { return toRE(re).test(url) }):
                  return false
              case url === this.indexUrl:
                  return false
              case url === this.prevUrl:
                  return false
              case url === this.curPageUrl:
                  return false
              case this.prevUrl !== this.indexUrl && Rule.nextUrlCompare.test(this.prevUrl.split('?')[0]) && !Rule.nextUrlCompare.test(url.split('?')[0]):
                  return false
              default:
                  return true
          }
      },
      getIncludeUrl: function() {
          var includeUrl = this.info.url;

          if (!includeUrl && typeof GM_info !== 'undefined') {
              var locationHref = location.href;
              GM_info.script.includes.some(function(includeStr) {
                  var iUrl = wildcardToRegExpStr(includeStr);
                  if (toRE(iUrl).test(locationHref)) {
                      includeUrl = iUrl;
                      return true;
                  }
              });
          }

          this.info.includeUrl = includeUrl;
          return includeUrl;
      },
      checkLinks: function(links){
          var self = this;
          var url = '';

          if (!links) return ''

          if (_.isString(links)) {
              return this.getFullHref(links);
          }

          links && links.each(function(){
              url = $(this).attr("href");
              if(!url || url.indexOf("#") === 0 || url.indexOf("javascript:") === 0)
                  return;

              url = self.getFullHref(this);
              return false;
          });

          return url;
      },
      getLinkUrl: function(linkOrUrl) {
          // if (linkOrUrl && )
          return linkOrUrl;
      },
      getFullHref: function(href) {
          if(!href) return '';

          if (!_.isString(href)) {
              href = href.getAttribute('href');
          }

          if (/^https?:\/\//.test(href)) {
              return href;
          }

          var a = this.a;
          if (!a) {
              this.a = a = document.createElement('a');
          }
          a.href = href.trim();

          // // 检测 host 是否和 当前页的一致
          // if (a.host != this._curPageHost) {
          //     a.host = this._curPageHost;
          // }

          return a.href;
      },
  };

  var tpl_mainCss = "@font-face {\r\n    font-family: 'FontAwesome';\r\n    src: url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?v=4.7.0');\r\n    src: url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');\r\n    src: url('data:application/font-woff2;base64,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') format('woff2');\r\n    font-weight: normal;\r\n    font-style: normal;\r\n  }\r\n\r\nbody > a { display:none !important; }\r\n.hidden {\r\n    display: none;\r\n}\r\n.quiet-mode {\r\n    display: none;\r\n}\r\nbody {\r\n    background: #F3F2EE;\r\n    color: #1F0909;\r\n    padding: 0px;\r\n    margin: 0px;\r\n    font-family: \"Microsoft YaHei UI\", 微软雅黑, 新宋体, 宋体, arial;\r\n}\r\na { color: #065488; }\r\na:link { text-decoration: none; }\r\n\r\n#mynovelreader-content {\r\n    width: auto;\r\n    max-width: {content_width};\r\n    font-size: {font_size};\r\n    font-family: {font_family};\r\n    line-height: {text_line_height};\r\n    margin-left:auto;\r\n    margin-right:auto;\r\n    padding-bottom: 15px;\r\n}\r\n#mynovelreader-content img{\r\n    max-width: 100%;\r\n}\r\n\r\narticle {\r\n    margin-top: 55px;\r\n    word-wrap: break-word;\r\n}\r\n\r\narticle h1 {\r\n    clear: both;\r\n    line-height: 50px;\r\n    font-size: {title_font_size};\r\n    font-weight: normal;\r\n    margin: 25px -20px;\r\n    padding: 0 20px 10px;\r\n    border-bottom: 1px solid rgba(0,0,0,.25);\r\n    font-weight: normal;\r\n    text-transform: none;\r\n}\r\n\r\narticle li {\r\n    list-style: none;\r\n}\r\n\r\n.chapter-footer-nav {\r\n    text-align:center;\r\n    font-size:0.9em;\r\n    margin:-10px 0px 30px 0px;\r\n}\r\n#loading {\r\n    color: white;\r\n    text-align: center;\r\n    font: 12px \"微软雅黑\", \"宋体\", \"Times New Roman\", \"Verdana\";\r\n    margin-top: 20px;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n    width: 376px;\r\n    height: 32px;\r\n    line-height: 32px;\r\n    border-radius: 20px;\r\n    border: 1px solid #666;\r\n    background-color: #333;\r\n}\r\n#loading img {\r\n    vertical-align: middle;\r\n}\r\n#loading a {\r\n    color: white;\r\n}\r\n#preferencesBtn{\r\n    position: fixed;\r\n    top: 10px;\r\n    right: 10px;\r\n    z-index: 1597;\r\n}\r\n\r\n#alert {\r\n    position: fixed;\r\n    z-index: 100;\r\n    float: auto;\r\n    width: auto;\r\n    height: auto;\r\n    top: 30px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n    background: rgba(215, 240, 253, 0.65);\r\n    color: #2d7091;\r\n    border: 1px solid rgba(45,112,145,0.3);\r\n    border-radius: 4px;\r\n}\r\n#alert p {\r\n    font-size: 15px;\r\n    margin: 6px;\r\n}\r\n\r\n#message {\r\n    position: fixed;\r\n    z-index: 1010;\r\n    width: auto;\r\n    height: auto;\r\n    top: 10px;\r\n    left: 500px;\r\n\r\n    padding: 8px 16px;\r\n    border-radius: 4px;\r\n    box-shadow: 0 2px 8px rgba(0,0,0,.2);\r\n    background: #fff;\r\n    display: inline-block;\r\n    pointer-events: all;\r\n\r\n    font-size: 12px;\r\n}\r\n#message .fa-spinner {\r\n    font-size: 13px;\r\n    margin-right: 4px;\r\n}\r\n#message p {\r\n    margin: 0;\r\n}\r\n\r\nimg.blockImage {clear: both;float: none;display: block;margin-left: auto;margin-right: auto;}\r\n\r\n#menu-bar {\r\n    border: solid rgba(0, 100, 255, .9);\r\n    border-width: 3px 2px 3px 0px;\r\n    position: fixed;\r\n    left: 0px;\r\n    top: 40%;\r\n    height: 100px;\r\n    width: 2px;\r\n    z-index: 199;\r\n    {menu-bar-hidden}\r\n}\r\n#menu-bar {\r\n    top: 0px;\r\n    height: 100%;\r\n    width: 1px;\r\n    background: transparent;\r\n    border: none;\r\n}\r\n#menu {\r\n    position: fixed;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    z-index: 100;\r\n    width: 270px;\r\n    max-width: 100%;\r\n    background: #333;\r\n    overflow-y: auto;\r\n}\r\n#menu:after {\r\n    content: \"\";\r\n    display: block;\r\n    position: absolute;\r\n    top: 46px;\r\n    bottom: 0;\r\n    right: 0;\r\n    width: 1px;\r\n    background: rgba(0,0,0,0.6);\r\n    box-shadow: 0 0 5px 2px rgba(0,0,0,0.6);\r\n}\r\n#header{\r\n    color: #777;\r\n    margin-top: 0;\r\n    border-top: 1px solid rgba(0,0,0,0.3);\r\n    background: #404040;\r\n    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);\r\n    text-shadow: 0 1px 0 rgba(0,0,0,0.5);\r\n    padding: 10px 12px;\r\n    text-transform: uppercase;\r\n    font-weight: bold;\r\n    font-size: 20px;\r\n}\r\n#header a {\r\n    color: #777777;\r\n}\r\n#divider {\r\n    position: relative;\r\n    z-index: 300;\r\n    border-top: 1px solid rgba(255,255,255,0.01);\r\n    border-bottom: 1px solid rgba(0,0,0,0.3);\r\n    margin: 0;\r\n    height: 4px;\r\n    background: rgba(0,0,0,0.2);\r\n    box-shadow: 0 1px 0 rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.3);\r\n}\r\n#chapter-list {\r\n    position: relative;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 200;\r\n    margin: 0;\r\n    padding: 0;\r\n    cursor: pointer;\r\n    list-style: none;\r\n    overflow-y: auto;\r\n}\r\n.chapter {\r\n    list-style: none;\r\n}\r\n.chapter:last-child {\r\n    border-bottom: 1px solid rgba(0,0,0,0.3);\r\n    box-shadow: 0 1px 0 rgba(255,255,255,0.05);\r\n}\r\n.chapter div {\r\n    color: #ccc;\r\n    font-size: 15px;\r\n    padding: 8px 20px;\r\n    border-top: 1px solid rgba(0,0,0,0.3);\r\n    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);\r\n    text-shadow: 0 1px 0 rgba(0,0,0,0.5);\r\n    display: block;\r\n    text-decoration: none;\r\n    text-overflow: ellipsis;\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n    cursor: pointer;\r\n}\r\n.chapter div:before {\r\n    content: \"\\f105\";\r\n    width: 20px;\r\n    margin-left: -10px;\r\n    float: left;\r\n    font-family: \"FontAwesome\" !important;\r\n    text-align: center;\r\n}\r\n.chapter div:hover {\r\n    background: #404040;\r\n    color: #fff;\r\n    outline: 0;\r\n}\r\n.chapter.active div {\r\n    background: #1a1a1a;\r\n    color: #fff;\r\n    font-size: 16px;\r\n    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);\r\n}\r\n::-webkit-scrollbar {\r\n    height: 9px !important;\r\n    width: 9px !important;\r\n}\r\n::-webkit-scrollbar-thumb {\r\n    background-color: #7D7D7D !important;\r\n    border-radius: 3px !important;\r\n}\r\n::-webkit-scrollbar-track-piece {\r\n    background-color: rgba(0,0,0,.25) !important;\r\n}\r\n";

  var tpl_preferencesHTML = "<form id=\"preferences\" name=\"preferences\">\r\n    <div id=\"setting_table1\">\r\n        <span id=\"top-buttons\">\r\n            <input title=\"部分选项需要刷新页面才能生效\" id=\"save_button\" value=\"√ 确认\" type=\"button\">\r\n            <input title=\"取消本次设定，所有选项还原\" id=\"close_button\" value=\"X 取消\" type=\"button\">\r\n        </span>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                界面语言<select id=\"lang\">\r\n                </select>\r\n            </label>\r\n            <!-- <label title=\"将小说网页文本转换为繁体。\\n\\n注意：内置的繁简转换表，只收录了简单的单字转换，启用本功能后，如有错误转换的情形，请利用脚本的自订字词取代规则来修正。\\n例如：「千里之外」，会错误转换成「千里之外」，你可以加入规则「千里之外=千里之外」来自行修正。\">\r\n                <input type=\"checkbox\" id=\"enable-cn2tw\" name=\"enable-cn2tw\"/>网页：转繁体\r\n            </label> -->\r\n            <label>\r\n                <input type=\"checkbox\" id=\"debug\" name=\"debug\"/>调试模式\r\n            </label>\r\n            <a href=\"https://greasyfork.org/scripts/292-my-novel-reader/feedback\" target=\"_blank\">反馈地址</a>\r\n            <label id=\"quietMode\" class=\"right\" title=\"隐藏其他，只保留正文，适用于全屏状态下\">\r\n                <input class=\"key\" type=\"button\" id=\"quietModeKey\"/>安静模式\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <fieldset id=\"launch-mode\" style=\"width: 195px; display: inline-block;\">\r\n                <legend title=\"不影响 booklink.me 的启用\" style=\"cursor: default;\">启动模式</legend>\r\n                <input type=\"radio\" id=\"launch-mode-memory\" name=\"launch-mode\" value=\"memory\">\r\n                <label for=\"launch-mode-memory\">记忆</label>\r\n                <input type=\"radio\" id=\"launch-mode-auto\" name=\"launch-mode\" value=\"auto\">\r\n                <label for=\"launch-mode-auto\">自动</label>\r\n                <input type=\"radio\" id=\"launch-mode-manual\" name=\"launch-mode\" value=\"manual\">\r\n                <label for=\"launch-mode-manual\">手动</label>\r\n            </fieldset>\r\n            <fieldset id=\"chinese-conversion\" style=\"width: 195px; display: inline-block;\">\r\n                <legend style=\"cursor: default;\">繁简转换</legend>\r\n                <input type=\"radio\" id=\"chinese-conversion-disable\" name=\"chinese-conversion\" value=\"disable\">\r\n                <label for=\"chinese-conversion-disable\">关闭</label>\r\n                <input type=\"radio\" id=\"chinese-conversion-to-cn\" name=\"chinese-conversion\" value=\"to-cn\">\r\n                <label for=\"chinese-conversion-to-cn\">简体</label>\r\n                <input type=\"radio\" id=\"chinese-conversion-to-tw\" name=\"chinese-conversion\" value=\"to-tw\">\r\n                <label for=\"chinese-conversion-to-tw\">繁体</label>\r\n            </fieldset>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <fieldset id=\"content-normalize\">\r\n                <legend style=\"cursor: default;\">\r\n                    <label title=\"包含自动分段/合并、标点符号替换等功能\">\r\n                        <input type=\"checkbox\" id=\"enable-content-normalize\" name=\"content-normalize\"/>内容标准化\r\n                    </label>\r\n                </legend>\r\n                <label>\r\n                    <input type=\"checkbox\" name=\"content-normalize\" id=\"merge-qoutes-content\">合并双引号中的多行内容\r\n                </label>\r\n            </fieldset>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label style=\"display: inline-block;\">\r\n                <input type=\"checkbox\" id=\"preload-next-page\" name=\"preload-next-page\"/>预载下一页\r\n            </label>\r\n            <!-- <label title=\"不影响 booklink.me 的启用\">\r\n                <input type=\"checkbox\" id=\"disable-auto-launch\" name=\"disable-auto-launch\"/>强制手动启用\r\n            </label> -->\r\n            <label title=\"booklink.me 点击的网站强制启用\">\r\n                <input type=\"checkbox\" id=\"booklink-enable\" name=\"booklink-enable\"/>booklink 自动启用\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"图片章节用夜间模式没法看，这个选项在启动时会自动切换到缺省皮肤\">\r\n                <input type=\"checkbox\" id=\"pic-nightmode-check\" name=\"pic-nightmode-check\"/>\r\n                夜间模式的图片章节检测\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"copyCurTitle\"/>\r\n                打开目录复制当前标题\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"通过快捷键切换\">\r\n                <input type=\"checkbox\" id=\"hide-menu-list\"/>隐藏左侧章节列表\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"hide-footer-nav\"/>隐藏底部导航栏\r\n            </label>\r\n            <label class=\"right\" title=\"导出之后的所有章节\">\r\n                <input type=\"button\" id=\"saveAsTxt\" value=\"存为 txt（测试）\" />\r\n                <input type=\"button\" id=\"speech\" value=\"朗读\" />\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                左侧导航栏切换快捷键：\r\n            </label>\r\n            <input class=\"key\" type=\"button\" id=\"setHideMenuListKey\" />\r\n            <label title=\"通过快捷键切换或在 Greasemonkey 用户脚本命令处打开设置窗口\">\r\n                <input type=\"checkbox\" id=\"hide-preferences-button\"/>隐藏设置按钮\r\n            </label>\r\n            <input class=\"key\" type=\"button\" id=\"openPreferencesKey\"/>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                打开朗读快捷键：\r\n            </label>\r\n            <input class=\"key\" type=\"button\" id=\"setOpenSpeechKey\" />\r\n            <label>\r\n                <input type=\"checkbox\" id=\"enable-dblclick-pause\"/>双击暂停翻页\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                距离底部\r\n                <input type=\"textbox\" id=\"remain-height\" name=\"remain-height\" size=\"5\"/>\r\n                px 加载下一页\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"add-nextpage-to-history\"/>添加下一页到历史记录\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                <select id=\"skin\">\r\n                </select>\r\n            </label>\r\n            <label>\r\n                字体\r\n                <input type=\"textbox\" id=\"font-family\" style=\"min-width:200px;\"/>\r\n            </label>\r\n            <br/><br/>\r\n            <label>\r\n                字体大小\r\n                <input type=\"textbox\" id=\"font-size\" name=\"font-size\" size=\"6\"/>\r\n            </label>\r\n            <label>\r\n                行高\r\n                <input type=\"textbox\" id=\"text_line_height\" size=\"6\"/>\r\n            </label>\r\n            <label>\r\n                行宽\r\n                <input type=\"textbox\" id=\"content_width\" size=\"6\"/>\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"把一大块未分段的内容文本按照句号分段\">\r\n                <input type=\"checkbox\" id=\"split_content\"/>对一坨内容进行强制分段\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"scroll_animate\"/>章节直达滚动效果\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <div class=\"prefs_title\">自定义样式</div>\r\n            <textarea id=\"extra_css\" class=\"prefs_textarea\" placeholder=\"自定义样式\"></textarea>\r\n        </div>\r\n    </div>\r\n    <div id=\"setting_table2\">\r\n        <div class=\"form-row\" title=\"详见脚本代码的 Rule.specialSite\">\r\n            <div class=\"prefs_title\">自定义站点规则</div>\r\n            <textarea id=\"custom_siteinfo\" class=\"prefs_textarea\" placeholder=\"自定义站点规则\" />\r\n        </div>\r\n        <div class=\"form-row\" title=\"一行一个，每行的第一个 = 为分隔符。\\n保存后生效\">\r\n            <div class=\"prefs_title\">自定义替换规则</div>\r\n            <textarea id=\"custom_replace_rules\" class=\"prefs_textarea\" placeholder=\"b[āà]ng=棒\" />\r\n        </div>\r\n    </div>\r\n</form>";

  var tpl_preferencesCSS = ".body {\r\n     color:#333;\r\n     margin: 0 auto;\r\n     background: white;\r\n     padding: 10px;\r\n     height: 420px;\r\n     overflow-y: auto;\r\n }\r\n #top-buttons {\r\n     background: none repeat scroll 0% 0% rgb(255, 255, 255);\r\n     display: block;\r\n     position: absolute;\r\n     top: -35px;\r\n     border-right: 12px solid rgb(224, 224, 224);\r\n     border-top: 12px solid rgb(224, 224, 224);\r\n     border-left: 12px solid rgb(224, 224, 224);\r\n     text-align: center;\r\n }\r\n input {\r\n     font-size: 12px;\r\n     margin-right: 3px;\r\n     vertical-align: middle;\r\n }\r\n .form-row {\r\n     overflow: hidden;\r\n     padding: 8px 12px;\r\n     margin-top: 3px;\r\n     font-size: 11px;\r\n }\r\n .form-row label {\r\n     padding-right: 10px;\r\n }\r\n .form-row input {\r\n     vertical-align: middle;\r\n     margin-top: 0px;\r\n }\r\n textarea, .form-row input {\r\n     padding: 2px 4px;\r\n     border: 1px solid #e5e5e5;\r\n     background: #fff;\r\n     border-radius: 4px;\r\n     color: #666;\r\n     -webkit-transition: all linear .2s;\r\n     transition: all linear .2s;\r\n }\r\n textarea {\r\n     width: 100%;\r\n     overflow: auto;\r\n     vertical-align: top;\r\n }\r\n textarea:focus, input:focus {\r\n     border-color: #99baca;\r\n     outline: 0;\r\n     background: #f5fbfe;\r\n     color: #666;\r\n }\r\n .prefs_title {\r\n     font-size: 12px;\r\n     font-weight: bold;\r\n }\r\n .prefs_textarea {\r\n     font-size: 12px;\r\n     margin-top: 5px;\r\n     height: 100px;\r\n }\r\n .right {\r\n    float: right;\r\n }";

  var Res = {
    CSS_MAIN: tpl_mainCss,

    preferencesHTML: tpl_preferencesHTML
        .uiTrans().replace(/\\n/g, '\n'),

    preferencesCSS: tpl_preferencesCSS,
  };

  const bus = new Vue();

  // 显示 语音朗读 对话框
  const SHOW_SPEECH = 'show-speech';

  const APPEND_NEXT_PAGE = 'appended_next_page';

  var UI = {
      tpl_footer_nav: '\
        <div class="chapter-footer-nav">\
            <a class="prev-page" href="{prevUrl}">上一页</a> | \
            <a class="index-page" href="{indexUrl}" title="Enter 键打开目录">目录</a> | \
            <a class="next-page" style="color:{theEndColor}" href="{nextUrl}">下一页</a>\
        </div>\
        '.uiTrans(),
      skins: {},
      // 站点字体
      siteFontFamily: '',

      init: function(){
          UI.refreshMainStyle();

          UI.refreshSkinStyle(Setting.skin_name, true);

          UI.refreshExtraStyle(Setting.extra_css);

          UI.fixMobile();

          // 初始变量
          UI.$menu = $('#menu');
          UI.$menuBar = $('#menu-bar');
          UI.$content = $('#mynovelreader-content');
          UI.$preferencesBtn = $('#preferencesBtn');

          // 初始化是否隐藏
          if(Setting.hide_footer_nav){
              UI.hideFooterNavStyle(true);
          }

          // UI.toggleQuietMode();  // 初始化安静模式
          UI.hideMenuList(Setting.menu_list_hiddden);  // 初始化章节列表是否隐藏
          UI.hidePreferencesButton(Setting.hide_preferences_button);  // 初始化设置按钮是否隐藏
      },
      refreshMainStyle: function(){
          // 添加站点字体到样式中
          if (App$1.site.useSiteFont && App$1.siteFontInfo) {
              UI.siteFontFamily = App$1.siteFontInfo.siteFontFamily;
          }

          var mainCss = Res.CSS_MAIN
                  .replace("{font_family}", UI.siteFontFamily + Setting.font_family)
                  .replace("{font_size}", UI.calcContentFontSize(Setting.font_size))
                  .replace("{title_font_size}", UI.calcTitleFontSize(Setting.font_size))
                  .replace("{content_width}", Setting.content_width)
                  .replace("{text_line_height}", Setting.text_line_height)
                  .replace("{menu-bar-hidden}", Setting.menu_bar_hidden ? "display:none;" : "");

          if(UI.$mainStyle){
              UI.$mainStyle.text(mainCss);
              return;
          }

          UI.$mainStyle = $('<style id="main">')
              .text(mainCss)
              .appendTo('head');
      },
      hideFooterNavStyle: function(hidden){
          var navStyle = $("#footer_nav_css");
          if(hidden) {
              if(navStyle.length === 0) {
                  $('<style>')
                      .attr("id", "footer_nav_css")
                      .text(".chapter-footer-nav { display: none; }")
                      .appendTo('head');
              }
          } else {
              navStyle.remove();
          }
      },
      hideMenuList: function(hidden){
          if(typeof(hidden) === "undefined"){
              hidden = !UI.menu_list_hiddden;
          }

          if(hidden){
              UI.$menu.addClass('hidden');
              UI.$content.css("margin-left", "");
          }else {
              UI.$menu.removeClass('hidden');
              UI.$content.css("margin-left", "320px");
          }
          UI.menu_list_hiddden = hidden;
      },
      hidePreferencesButton: function(hidden) {
          hidden = _.isUndefined(hidden) ? Setting.hide_preferences_button : hidden;

          UI.$preferencesBtn.toggle(!hidden);
      },
      hideMenuBar: function(hidden) {
          hidden = _.isUndefined(hidden) ? Setting.menu_bar_hidden : hidden;

          UI.$menuBar.toggle(!hidden);
      },
      refreshSkinStyle: function(skin_name, isFirst){
          var $style = $("#skin_style");
          if($style.length === 0){
              $style = $('<style id="skin_style">').appendTo('head');
          }

          // 图片章节夜间模式会变的无法看
          if (isFirst && skin_name.indexOf('夜间'.uiTrans()) != -1 && Setting.picNightModeCheck) {
              setTimeout(function(){
                  var img = $('#mynovelreader-content img')[0];
                  // console.log(img.width, img.height)
                  if (img && img.width > 500 && img.height > 1000) {
                      $style.text(UI.skins['缺省皮肤'.uiTrans()]);
                      return;
                  }
              }, 200);
          }

          $style.text(UI.skins[skin_name]);
      },
      refreshExtraStyle: function(css){
          var style = $("#extra_style");
          if(style.length === 0){
              style = $('<style id="extra_style">').appendTo('head');
          }

          style.text(css);
      },
      toggleQuietMode: function() {
          this._isQuietMode = !this._isQuietMode;
          var selector = '#menu-bar, #menu, #preferencesBtn, .readerbtn';

          if (this.$_quietStyle) {
              this.$_quietStyle.remove();
              this.$_quietStyle = null;
          }

          if (this._isQuietMode) {
              $(selector).addClass("quiet-mode");
          } else {
              $(selector).removeClass("quiet-mode");
          }
      },
      addButton: async function(){
          GM_addStyle('\
            .readerbtn {\
                position: fixed;\
                right: 10px;\
                bottom: 10px;\
                z-index: 2247483648;\
                padding: 20px 5px;\
                width: 50px;\
                height: 20px;\
                line-height: 20px;\
                text-align: center;\
                border: 1px solid;\
                border-color: #888;\
                border-radius: 50%;\
                background: rgba(0,0,0,.5);\
                color: #FFF;\
                font: 12px/1.5 "微软雅黑","宋体",Arial;\
                cursor: pointer;\
                box-sizing: content-box;\
                letter-spacing: normal;\
            }\
        ');

          $("<div>")
              .addClass("readerbtn")
              .html(App$1.isEnabled ? "退出".uiTrans() : "阅读模式".uiTrans())
              .mousedown(async function(event){
                  if(event.which == 1){
                      await App$1.toggle();
                  }else if(event.which == 2){
                      event.preventDefault();
                      L_setValue("mynoverlreader_disable_once", true);

                      var url = App$1.activeUrl || App$1.curPageUrl;
                      App$1.openUrl(url);
                  }
              })
              .appendTo('body');
      },
      calcContentFontSize: function(fontSizeStr) {
          var m = fontSizeStr.match(/([\d\.]+)(px|r?em|pt)/);
          if(m) {
              var size = m[1],
                  type = m[2];
              return parseFloat(size, 10) + type;
          }

          m = fontSizeStr.match(/([\d\.]+)/);
          if (m) {
              return parseFloat(m[1], 10) + 'px';
          }

          return "";
      },
      calcTitleFontSize: function(fontSizeStr){
          var m = fontSizeStr.match(/([\d\.]+)(px|r?em|pt)/);
          if(m) {
              var size = m[1],
                  type = m[2];
              return parseFloat(size, 10) * 1.8 + type;
          }

          m = fontSizeStr.match(/([\d\.]+)/);
          if (m) {
              return parseFloat(m[1], 10) * 1.8 + 'px';
          }

          return "";
      },
      fixMobile: function(){  // 自适应网页设计
          var meta = document.createElement("meta");
          meta.setAttribute("name", "viewport");
          meta.setAttribute("content", "width=device-width, initial-scale=1");
          document.head.appendChild(meta);
      },
      preferencesShow: function(event){
          if($("#reader_preferences").length){
              return;
          }

          UI._loadBlocker();

          UI.$prefs = $('<div id="reader_preferences">')
              .css('cssText', 'position:fixed; top:12%; left:50%; transform: translateX(-50%); width:500px; z-index:300000;')
              .append(
                  $('<style>').text(Res.preferencesCSS))
              .append(
                  $('<div class="body">').html(Res.preferencesHTML))
              .appendTo('body');

          UI.preferencesLoadHandler();
      },
      _loadBlocker: function() {
          UI.$blocker = $('<div>').attr({
              id: 'uil_blocker',
              style: 'position:fixed;top:0px;left:0px;right:0px;bottom:0px;background-color:#000;opacity:0.5;z-index:100000;'
          }).appendTo('body');
      },
      hide: function(){
          if(UI.$prefs) UI.$prefs.remove();
          if(UI.$blocker) UI.$blocker.remove();
          UI.$prefs = null;
          UI.$blocker = null;
      },
      preferencesLoadHandler: function(){
          var $form = $("#preferences");

          // checkbox
          // $form.find("#enable-cn2tw").get(0).checked = Setting.cn2tw;
          // $form.find("#disable-auto-launch").get(0).checked = Setting.getDisableAutoLaunch();
          $form.find("#booklink-enable").get(0).checked = Setting.booklink_enable;
          $form.find("#debug").get(0).checked = Setting.debug;
          $form.find("#quietMode").get(0).checked = Setting.isQuietMode;
          $form.find("#pic-nightmode-check").get(0).checked = Setting.picNightModeCheck;
          $form.find("#copyCurTitle").get(0).checked = Setting.copyCurTitle;

          $form.find("#hide-menu-list").get(0).checked = Setting.menu_list_hiddden;
          $form.find("#hide-footer-nav").get(0).checked = Setting.hide_footer_nav;
          $form.find("#hide-preferences-button").get(0).checked = Setting.hide_preferences_button;
          $form.find("#add-nextpage-to-history").get(0).checked = Setting.addToHistory;
          $form.find("#enable-dblclick-pause").get(0).checked = Setting.dblclickPause;

          $form.find("#font-family").get(0).value = Setting.font_family;
          $form.find("#font-size").get(0).value = Setting.font_size;
          $form.find("#content_width").get(0).value = Setting.content_width;
          $form.find("#text_line_height").get(0).value = Setting.text_line_height;
          $form.find("#split_content").get(0).checked = Setting.split_content;
          $form.find("#scroll_animate").get(0).checked = Setting.scrollAnimate;

          $form.find("#remain-height").get(0).value = Setting.remain_height;
          $form.find("#extra_css").get(0).value = Setting.extra_css;
          $form.find("#custom_siteinfo").get(0).value = Setting.customSiteinfo;
          UI._rules = $form.find("#custom_replace_rules").get(0).value = Setting.customReplaceRules;

          $form.find('#preload-next-page').get(0).checked = Setting.preloadNextPage;

          // 启动模式
          $form.find(`#launch-mode-${Setting.launchMode}`).get(0).checked = true;

          // 繁简转换
          $form.find(`#chinese-conversion-${Setting.chineseConversion}`).get(0).checked = true;

          $form.find('#enable-content-normalize').get(0).checked = Setting.contentNormalize;
          $form.find('#merge-qoutes-content').get(0).checked = Setting.mergeQoutesContent;

          // 界面语言
          var $lang = $form.find("#lang");
          $("<option>").text("zh-CN").appendTo($lang);
          $("<option>").text("zh-TW").appendTo($lang);
          $lang.val(Setting.lang).change(function(){
              var key = $(this).find("option:selected").text();
              Setting.lang = key;
          });

          // 皮肤
          var $skin = $form.find("#skin");
          for(var key in UI.skins){
              $("<option>").text(key).appendTo($skin);
          }
          $skin.val(Setting.skin_name).change(function(){
              var key = $(this).find("option:selected").text();
              UI.refreshSkinStyle(key);
              Setting.skin_name = key;
          });

          // 字体大小等预览
          var preview = _.debounce(function(){
              switch(this.id){
                  case "font-size":
                      var contentFontSize = UI.calcContentFontSize(this.value);
                      var titleFontSize = UI.calcTitleFontSize(this.value);
                      if(titleFontSize) {
                          UI.$content.css("font-size", contentFontSize);
                          UI.$content.find("h1").css("font-size", titleFontSize);
                      }
                      break;
                  case "font-family":
                      UI.$content.css("font-family", UI.siteFontFamily + this.value);
                      break;
                  case "content_width":
                      UI.$content.css("width", this.value);
                      break;
                  case "text_line_height":
                      UI.$content.css("line-height", this.value);
                      break;
              }
          }, 300);
          $form.on("input", "input", preview);

          // 初始化设置按键
          $form.find("#quietModeKey").get(0).value = Setting.quietModeKey;
          $form.find("#openPreferencesKey").get(0).value = Setting.openPreferencesKey;
          $form.find("#setHideMenuListKey").get(0).value = Setting.hideMenuListKey;
          $form.find("#setOpenSpeechKey").get(0).value = Setting.openSpeechKey;

          // 点击事件
          $form.on('click', 'input:checkbox, input:button', function(event){
              UI.preferencesClickHandler(event.target); // 不用 await
          });
      },
      cleanPreview: function() {
          UI.$content.find("h1").css("font-size", "");

          // 恢复初始设置（有误操作）
          // UI.$content.removeAttr('style');
      },
      preferencesClickHandler: async function(target){
          var key;
          switch (target.id) {
              case 'close_button':
                  UI.preferencesCloseHandler();
                  break;
              case 'save_button':
                  UI.preferencesSaveHandler();
                  break;
              case 'debug':
                  Setting.debug = !Setting.debug;
                  toggleConsole(Setting.debug);
                  break;
              case 'quietMode':
                  UI.toggleQuietMode(target.checked);
                  break;
              case 'hide-menu-list':
                  UI.hideMenuList(target.checked);
                  break;
              case 'hide-preferences-button':
                  UI.hidePreferencesButton(target.checked);
                  if (target.checked) {
                      alert('隐藏后通过快捷键或 Greasemonkey 用户脚本命令处调用'.uiTrans());
                  }
                  break;
              case 'hide-footer-nav':
                  break;
              case 'quietModeKey':
                  key = prompt('请输入打开设置的快捷键：'.uiTrans(), Setting.quietModeKey);
                  if (key) {
                      Setting.quietModeKey = key;
                      $(target).val(key);
                  }
                  break;
              case 'openPreferencesKey':
                  key = prompt('请输入打开设置的快捷键：'.uiTrans(), Setting.openPreferencesKey);
                  if (key) {
                      Setting.openPreferencesKey = key;
                      $(target).val(key);
                  }
                  break;
              case 'setHideMenuListKey':
                  key = prompt('请输入切换左侧章节列表的快捷键：'.uiTrans(), Setting.hideMenuListKey);
                  if (key) {
                      Setting.hideMenuListKey = key;
                      $(target).val(key);
                  }
                  break;
              case 'setOpenSpeechKey':
                  key = prompt('请输入打开朗读的快捷键：'.uiTrans(), Setting.openSpeechKey);
                  if (key) {
                      Setting.openSpeechKey = key;
                      $(target).val(key);
                  }
                  break;
              case 'saveAsTxt':
                  UI.preferencesCloseHandler();
                  await App$1.saveAsTxt();
                  break;
              case 'speech':
                  UI.preferencesCloseHandler();
                  bus.$emit(SHOW_SPEECH);
                  break;
          }
      },
      preferencesCloseHandler: function(){
          UI.cleanPreview();

          UI.hide();
      },
      preferencesSaveHandler: function(){
          var $form = $("#preferences");

          // Setting.setDisableAutoLaunch($form.find("#disable-auto-launch").get(0).checked);

          // Setting.cn2tw = $form.find("#enable-cn2tw").get(0).checked;
          Setting.booklink_enable = $form.find("#booklink-enable").get(0).checked;
          Setting.isQuietMode = $form.find("#quietMode").get(0).checked;
          Setting.debug = $form.find("#debug").get(0).checked;
          Setting.picNightModeCheck = $form.find("#pic-nightmode-check").get(0).checked;
          Setting.setCopyCurTitle($form.find("#copyCurTitle").get(0).checked);

          Setting.addToHistory = $form.find("#add-nextpage-to-history").get(0).checked;
          Setting.dblclickPause = $form.find("#enable-dblclick-pause").get(0).checked;

          var skinName = $form.find("#skin").find("option:selected").text();
          Setting.skin_name = skinName;
          UI.refreshSkinStyle(skinName);

          Setting.font_family = $form.find("#font-family").get(0).value;
          UI.$content.css("font-family", Setting.font_family);

          Setting.font_size = $form.find("#font-size").get(0).value;
          Setting.text_line_height = $form.find("#text_line_height").get(0).value;
          Setting.content_width = $form.find("#content_width").get(0).value;
          Setting.remain_height = $form.find("#remain-height").get(0).value;
          Setting.split_content = $form.find("#split_content").get(0).checked;
          Setting.scrollAnimate = $form.find("#scroll_animate").get(0).checked;

          Setting.menu_list_hiddden = $form.find("#hide-menu-list").get(0).checked;
          UI.hideMenuList(Setting.menu_list_hiddden);

          Setting.hide_footer_nav = $form.find("#hide-footer-nav").get(0).checked;
          UI.hideFooterNavStyle(Setting.hide_footer_nav);

          Setting.hide_preferences_button = $form.find("#hide-preferences-button").get(0).checked;

          var css = $form.find("#extra_css").get(0).value;
          UI.refreshExtraStyle(css);
          Setting.extra_css = css;

          Setting.customSiteinfo = $form.find("#custom_siteinfo").get(0).value;

          Setting.preloadNextPage = $form.find("#preload-next-page").get(0).checked;

          // 启动模式
          $form.find('#launch-mode input').each(function () {
              if (this.checked) {
                  Setting.launchMode = this.value;
              }
          });

          // 繁简转换
          $form.find('#chinese-conversion input').each(function () {
              if (this.checked) {
                  Setting.chineseConversion = this.value;
              }
          });

          Setting.contentNormalize = $form.find('#enable-content-normalize').get(0).checked;
          Setting.mergeQoutesContent = $form.find('#merge-qoutes-content').get(0).checked;

          // 自定义替换规则直接生效
          var rules = $form.find("#custom_replace_rules").get(0).value;
          Setting.customReplaceRules = rules;
          if (rules != UI._rules) {
              var contentHtml = App$1.oArticles.join('\n');
              if (rules) {
                  // 转换规则
                  rules = Rule.parseCustomReplaceRules(rules);
                  // 替换
                  contentHtml = Parser.prototype.replaceHtml(contentHtml, rules);
              }

              UI.$content.html(contentHtml);

              App$1.resetCache();

              UI._rules = rules;
          }

          // 重新载入样式
          UI.cleanPreview();
          UI.refreshMainStyle();

          UI.hide();
      },
      openHelp: function() {

      },
      notice: function (htmlText, ms){
          var $noticeDiv = $("#alert");
          if (!ms) {
              ms = 1666;
          }

          clearTimeout(UI.noticeDivto);
          $noticeDiv.find("p").html(htmlText);
          $noticeDiv.fadeIn("fast");

          UI.noticeDivto = setTimeout(function(){
              $noticeDiv.fadeOut(500);
          }, ms);

          return $noticeDiv;
      }
  };

  UI.skins["缺省皮肤".uiTrans()] = "";
  UI.skins["暗色皮肤".uiTrans()] = "body { color: #666; background-color: rgba(0,0,0,.1); }\
                .title { color: #222; }";
  UI.skins["白底黑字".uiTrans()] = "body { color: black; background-color: white;}\
                .title { font-weight: bold; border-bottom: 0.1em solid; margin-bottom: 1.857em; padding-bottom: 0.857em;}";
  UI.skins["夜间模式".uiTrans()] = "body { color: #939392; background: #2d2d2d; } #preferencesBtn { background: white; } #mynovelreader-content img { background-color: #c0c0c0; } .chapter.active div{color: #939392;}";
  UI.skins["夜间模式1".uiTrans()] = "body { color: #679; background-color: black; } #preferencesBtn img { background-color: white !important; } .title { color: #3399FF; background-color: #121212; }";
  UI.skins["夜间模式2".uiTrans()] = "body { color: #AAAAAA; background-color: #121212; } #preferencesBtn img { background-color: white; } #mynovelreader-content img { background-color: #c0c0c0; } .title { color: #3399FF; background-color: #121212; }   body a { color: #E0BC2D; } body a:link { color: #E0BC2D; } body a:visited { color:#AAAAAA; } body a:hover { color: #3399FF; } body a:active { color: #423F3F; }";
  UI.skins["夜间模式（多看）".uiTrans()] = "body { color: #4A4A4A; background: #101819; } #preferencesBtn { background: white; } #mynovelreader-content img { background-color: #c0c0c0; }";

  UI.skins["橙色背景".uiTrans()] = "body { color: #24272c; background-color: #FEF0E1; }";
  UI.skins["绿色背景".uiTrans()] = "body { color: black; background-color: #d8e2c8; }";
  UI.skins["绿色背景2".uiTrans()] = "body { color: black; background-color: #CCE8CF; }";
  UI.skins["蓝色背景".uiTrans()] = "body { color: black; background-color: #E7F4FE; }";
  UI.skins["棕黄背景".uiTrans()] = "body { color: black; background-color: #C2A886; }";
  UI.skins["经典皮肤".uiTrans()] = "body { color: black; background-color: #EAEAEE; } .title { background-color: #f0f0f0; }";

  // UI.skins["起点牛皮纸（深色）".uiTrans()] = "body { color: black; background: url(\"http://qidian.gtimg.com/qd/images/read.qidian.com/theme/body_theme1_bg_2x.0.3.png\"); }";
  // UI.skins["起点牛皮纸（浅色）".uiTrans()] = "body { color: black; background: url(\"http://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_1_bg_2x.0.3.png\"); }";
  // UI.skins["起点黑色".uiTrans()] = "body, #menu, #header { color: #666; background: #111 url(\"https://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_6_bg.45ad3.png\") repeat; } #preferencesBtn { background: white; }";
  UI.skins["起点牛皮纸（深色）".uiTrans()] = "body { color: black; background: url('data:image/png;base64,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'); }";
  UI.skins["起点牛皮纸（浅色）".uiTrans()] = "body { color: black; background: url('data:image/png;base64,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'); }";
  UI.skins["起点黑色".uiTrans()] = "body, #menu, #header { color: #666; background: #111 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAADFBMVEUWGBkYGhsdHyAfISI1t/v6AAAB5ElEQVQozxXQsYoTURSA4f/EeycZsDgDdySDjihk38Hy3GWi2J2BCaziQhaiaB+tt9AFu1kwvYUPsIXNPoB9BAUfwAfwEUzKv/v4odGrroyp9/rUaC6rZ5skv5F8qPsfYYP+yKUMymmAEEeW55oUR4o8jr05KNzJ07yvB7w0KKfLwcQUSjfmMU0PJfPHFoEVU+ohNrcKMEzMQ23FDnVSI2dqtYWI7KlLu6vE4UnyvKc3SJuL7lBbeEEl42ItpGLjzIT8PRJCmkRjVpVpsbJFVN0687okJNZiHAr5Z7MV0BnGIDc+THM1zlbieBc1Fq+tH5BH+OpnbWkj40hSqC8Lw2TvFuF0SUFJCk2IytXbjeqcRAt6NHpnrUkUU4KRzZs8RCK8N/Akn2W04LwxMU/V7XK0bDyN2RxfDyx7I4h5vjZby72V8UnOWumZL3qtYc+8DTE0siSBMXGhywx2dMYPnQHbxdFZ7deiNGxCCtD/QWnbwDoGhRYPDzUdUA3krjpnkvdAgDN4ddLkEQSov9qjd42HaDjI34gEqS9TUueAk+sc4qg5ws407KQYKs8G1jv4xBlqBVk6cb4dISZIwVi1Jzu4+HLk6lyfUxkXvwy+1Q+4WVdHIhwfybZ6CWVhxMEhShOgsP/HOW0MvZJeFwAAAABJRU5ErkJggg==') repeat; } #preferencesBtn { background: white; }";
  UI.skins["绿色亮字".uiTrans()] = "body, #menu, #header, .chapter.active div { color: rgb(187,215,188); background-color: rgb(18,44,20); }";

  UI.skins["图书双层".uiTrans()] = `body { color: #black; background: #ECE8D7 url('https://s3.bmp.ovh/imgs/2022/01/c08287428c0e16e2.png') repeat; } #mynovelreader-content{ letter-spacing: 1.3px; background: #E8E6DA url('https://s3.bmp.ovh/imgs/2022/01/71f45b2d4773b393.png') repeat; padding-left: 4rem ;padding-right: 4rem ; border-style:solid; border-width:1px;border-width:1px; border-color:rgba(211,211,211,0.25); }`;

  let $messageDiv;
  let _messageTimeId;

  function notice(html, duration, noticeType, onClose) {
    if (typeof duration === 'undefined')
        duration = 2000;

    var closeMessage = function() {
        $messageDiv.remove();
        $messageDiv = null;

        if (typeof onClose === 'function') {
            onClose();
        }
    };

    if (!$messageDiv) {
        var iconHtml = '';
        if (noticeType === 'loading') {
            iconHtml = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>';
        }

        $messageDiv = $('<div id="message" class="noRemove">' + iconHtml + '<span id="content"></span></div>')
            .appendTo('body');

        if (duration == 0) {
            $messageDiv.on('click', closeMessage);
        }
    }

    $messageDiv.find('#content').html(html);

    if (duration > 0) {
        clearTimeout(_messageTimeId);
        _messageTimeId = setTimeout(closeMessage, duration);
    }
  }

  function loading(html, duration, onClose) {
    notice(html, duration, 'loading', onClose);
  }

  function saveAs(data, filename) {
    if(!filename) filename = 'console.json';

    if (typeof data == 'object') {
        data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], { type: 'application/octet-stream' });
    var blobUrl = window.URL.createObjectURL(blob);
    var tmpLink = document.createElement('a');
    tmpLink.href = blobUrl;
    tmpLink.style.display = 'none';
    tmpLink.setAttribute('download', filename);
    tmpLink.setAttribute('target', '_blank');
    document.body.appendChild(tmpLink);

    tmpLink.click();
    document.body.removeChild(tmpLink);
    window.URL.revokeObjectURL(blobUrl);
  }

  /**
   * 获取 substring 在 string 所有位置的数组
   *
   * @param {string} substring
   * @param {string} string
   * @returns {number[]}
   */
  function locations(substring, string){
    var a=[],i=-1;
    while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
    return a;
  }

  /**
   * 22000 毫秒 => 00:00:02
   *
   * @param {number} distanceMillis
   * @returns {string}
   */
  function formatMillisencod(distanceMillis) {
    var sec_num = parseInt(Math.abs(distanceMillis) / 1000, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  }

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
  }

  function cnNum2ArabNum(cn){
    var arab, parts, cnChars = '零一二三四五六七八九';

    if (!cn) {
        return 0
    }

    if (cn.indexOf('亿') !== -1){
        parts = cn.split('亿');
        return cnNum2ArabNum(parts[0]) * 1e8 + cnNum2ArabNum(parts[1])
    }

    if (cn.indexOf('万') !== -1){
        parts = cn.split('万');
        return cnNum2ArabNum(parts[0]) * 1e4 + cnNum2ArabNum(parts[1])
    }

    if (cn.indexOf('十') === 0){
        cn = '一' + cn;
    }

    arab = cn
        .replace(/[零一二三四五六七八九]/g, function (a) {
            return '+' + cnChars.indexOf(a)
        })
        .replace(/(十|百|千)/g, function(a, b){
            return '*' + (
                b == '十' ? 1e1 :
                b == '百' ? 1e2 : 1e3
            )
        });

    return (new Function('return ' + arab))()
  }

  function getNumFromChapterTitle(title) {
    if (!title) return;

    var m = title.match(/第(\d+)章|^(\d+)、/);
    if (m) {
      return parseInt(m[1], 10)
    }

    // 第二十二章
    m = title.match(/(?:第|^)([一二两三四五六七八九十○零百千万亿\d]+){1,6}章/);
    if (m) {
      return cnNum2ArabNum(m[1])
    }

    // 九十二 休想套路我
    m = title.match(/^([一二两三四五六七八九十○零百千万亿\d]+){1,6} /);
    if (m) {
      return cnNum2ArabNum(m[1])
    }
  }

  const chapters = [];

  const fileName = {
    bookTitle: '',
    ext: '.txt',
    start: 0,
    end: 0,

    setBookTitle(bookTitle) {
      this.bookTitle = bookTitle;
    },
    setStart(chapterTitle) {
      let num = getNumFromChapterTitle(chapterTitle);
      if (num) {
        this.start = num;
      }
    },
    setEnd(chapterTitle) {
      let num = getNumFromChapterTitle(chapterTitle);
      if (num) {
        this.end = num;
      }
    },

    toString() {
      let start = this.start || '';
      let end = this.end || '';
      let count = chapters.length;

      return `${this.bookTitle || '未知名称'}(${start} - ${end},共${count}章)${this.ext}`
    }
  };

  function toTxt(parser) {
    var html = $.nano('{chapterTitle}\n\n{contentTxt}', parser);
    chapters.push(html);

    var msg = '已下载 ' + chapters.length + ' 章，' +
        (parser.chapterTitle || '');

    loading(msg, 0);
  }
  function finish(parser) {
    var allTxt = chapters.join('\n\n');
    if (isWindows) {
        allTxt = allTxt.replace(/\n/g, '\r\n');
    }

    if (parser) {
      fileName.setEnd(parser.chapterTitle);
    }

    saveAs(allTxt, fileName.toString());
  }
  async function getOnePage(parser, nextUrl) {
    var isEnd = false;
    if (parser) {
        toTxt(parser);
        nextUrl = parser.nextUrl;
        isEnd = parser.isTheEnd;
    }

    if (!nextUrl || isEnd) {
        C.log('全部获取完毕');
        finish(parser);
        return;
    }

    if (App$1.site.useiframe) {
        // App.iframeRequest(nextUrl);
        return;
    }

    sleep(config.download_delay)

    (async function() {
      C.log('[存为txt]正在获取：', nextUrl);
      const doc = await App$1.httpRequest(nextUrl);

      if (doc) {
          var par = new Parser(App$1.site, doc, nextUrl);
          await par.getAll();
          await getOnePage(par);
      } else {
          C.error('超时或连接出错');
          finish();
      }

    })();
  }
  async function run(cachedParsers=[]) {
    C.log(`[存为txt]每章下载延时 ${config.download_delay} 毫秒`);

    cachedParsers.forEach(toTxt);

    var firstParser = cachedParsers[0];
    fileName.setBookTitle(firstParser.bookTitle);
    fileName.setStart(firstParser.chapterTitle);

    var lastParser = cachedParsers[cachedParsers.length - 1];
    await getOnePage(null, lastParser.nextUrl);
  }

  __$styleInject(".speech {\n  position: fixed;\n  z-index: 100;\n  background-color: white;\n  top: 10px;\n  right: 35px;\n}\n");

  __$styleInject(".speech .close-btn {\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n.speech .loader {\n  text-align: center;\n}\n.speech .auto-stop-input {\n  width: 30px;\n}\n.speech .tips {\n  font-size: 0.8em;\n}\n");

  __$styleInject("/*.v-spinner\n{\n    margin: 100px auto;\n    text-align: center;\n}\n*/\n@-webkit-keyframes v-pulseStretchDelay {\n  0%,\n  80% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    -webkit-opacity: 1;\n    opacity: 1;\n  }\n  45% {\n    -webkit-transform: scale(0.1);\n    transform: scale(0.1);\n    -webkit-opacity: 0.7;\n    opacity: 0.7;\n  }\n}\n@keyframes v-pulseStretchDelay {\n  0%,\n  80% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    -webkit-opacity: 1;\n    opacity: 1;\n  }\n  45% {\n    -webkit-transform: scale(0.1);\n    transform: scale(0.1);\n    -webkit-opacity: 0.7;\n    opacity: 0.7;\n  }\n}\n");

  var PulseLoader = {
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.loading),expression:"loading"}],staticClass:"v-spinner"},[_c('div',{staticClass:"v-pulse v-pulse1",style:([_vm.spinnerStyle,_vm.spinnerDelay1])}),_c('div',{staticClass:"v-pulse v-pulse2",style:([_vm.spinnerStyle,_vm.spinnerDelay2])}),_c('div',{staticClass:"v-pulse v-pulse3",style:([_vm.spinnerStyle,_vm.spinnerDelay3])})])},
  staticRenderFns: [],

    name: 'PulseLoader',
    props: {
      loading: {
        type: Boolean,
        default: true
      },
      color: {
        type: String,
        default: '#5dc596'
      },
      size: {
        type: String,
        default: '15px'
      },
      margin: {
        type: String,
        default: '2px'
      },
      radius: {
        type: String,
        default: '100%'
      }
    },
    data () {
      return {
        spinnerStyle: {
        	backgroundColor: this.color,
        	width: this.size,
          height: this.size,
        	margin: this.margin,
        	borderRadius: this.radius,
          display: 'inline-block',
          animationName: 'v-pulseStretchDelay',
          animationDuration: '0.75s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'cubic-bezier(.2,.68,.18,1.08)',
          animationFillMode: 'both'
        },
        spinnerDelay1: {
          animationDelay: '0.12s'
        },
        spinnerDelay2: {
          animationDelay: '0.24s'
        },
        spinnerDelay3: {
          animationDelay: '0.36s'
        }
      }
    }
  };

  const STATE = {
    playing: 1,
    pausing: 2,
    stoping: 0,
  };

  var Speech = {
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"speech"},[(_vm.playState == _vm.STATE.playing)?_c('span',[_c('button',{on:{"click":_vm.pause}},[_vm._v("暂停朗读")]),_vm._v(" "),_c('button',{on:{"click":_vm.stop}},[_vm._v("停止朗读")])]):_c('span',[(_vm.playState == _vm.STATE.stoping)?_c('button',{on:{"click":_vm.start}},[_vm._v("开始朗读")]):_vm._e(),_vm._v(" "),(_vm.playState == _vm.STATE.pausing)?_c('button',{on:{"click":_vm.resume}},[_vm._v("继续朗读")]):_vm._e(),_vm._v(" "),(_vm.elapsedTime)?_c('span',[_vm._v("已朗读 "+_vm._s(_vm.formatMillisencod(_vm.elapsedTime)))]):_c('span',{staticClass:"tips"},[_vm._v("Tips: 可从选择文本处开始朗读")]),_vm._v(" "),_c('button',{staticClass:"close-btn",on:{"click":_vm.closeSpeech}},[_vm._v("X")])]),_vm._v(" "),(_vm.playState == _vm.STATE.playing)?_c('div',{staticClass:"loader"},[_c('pulse-loader')],1):_c('div',[_c('div',[_c('label',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoStop),expression:"autoStop"}],attrs:{"type":"radio","value":"time"},domProps:{"checked":_vm._q(_vm.autoStop,"time")},on:{"change":function($event){_vm.autoStop="time";}}}),_vm._v("\n        定时朗读：\n        "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoStopTime),expression:"autoStopTime"}],staticClass:"auto-stop-input",attrs:{"type":"text"},domProps:{"value":(_vm.autoStopTime)},on:{"input":function($event){if($event.target.composing){ return; }_vm.autoStopTime=$event.target.value;}}}),_vm._v(" "),_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoStopTimeUnit),expression:"autoStopTimeUnit"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.autoStopTimeUnit=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},[_c('option',{attrs:{"value":"minute"}},[_vm._v("分钟")]),_vm._v(" "),_c('option',{attrs:{"value":"hour"}},[_vm._v("小时")])]),_vm._v("\n        后停止\n      ")]),_c('br'),_vm._v(" "),_c('label',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoStop),expression:"autoStop"}],attrs:{"type":"radio","value":"chapter"},domProps:{"checked":_vm._q(_vm.autoStop,"chapter")},on:{"change":function($event){_vm.autoStop="chapter";}}}),_vm._v("\n        定章朗读：\n        "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoStopChapter),expression:"autoStopChapter"}],staticClass:"auto-stop-input",attrs:{"type":"text"},domProps:{"value":(_vm.autoStopChapter)},on:{"input":function($event){if($event.target.composing){ return; }_vm.autoStopChapter=$event.target.value;}}}),_vm._v("章后停止\n      ")]),_c('br'),_vm._v(" "),_c('label',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autoStop),expression:"autoStop"}],attrs:{"type":"radio","value":""},domProps:{"checked":_vm._q(_vm.autoStop,"")},on:{"change":function($event){_vm.autoStop="";}}}),_vm._v("一直朗读")])]),_vm._v(" "),_c('div',[_c('label',{attrs:{"for":"speech-dialog-rate"}},[_vm._v("语速")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.rate),expression:"rate"}],attrs:{"type":"range","min":"0.5","max":"3","step":"0.1","id":"speech-dialog-rate"},domProps:{"value":(_vm.rate)},on:{"__r":function($event){_vm.rate=$event.target.value;}}}),_vm._v(" "),_c('span',{staticClass:"rate-value"},[_vm._v(_vm._s(_vm.rate))])]),_vm._v(" "),_c('div',[_c('label',{attrs:{"for":"speech-dialog-pitch"}},[_vm._v("音高")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.pitch),expression:"pitch"}],attrs:{"type":"range","min":"0","max":"2","step":"0.1","id":"speech-dialog-pitch"},domProps:{"value":(_vm.pitch)},on:{"__r":function($event){_vm.pitch=$event.target.value;}}}),_vm._v(" "),_c('span',{staticClass:"pitch-value"},[_vm._v(_vm._s(_vm.pitch))])]),_vm._v(" "),_c('div',[_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.selectedVoice),expression:"selectedVoice"}],staticClass:"voices",on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.selectedVoice=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},_vm._l((_vm.voiceList),function(voice,index){return _c('option',{key:index,domProps:{"value":index}},[_vm._v("\n          "+_vm._s(voice.name)+" "+_vm._s(voice.lang)+"\n        ")])}),0)])])])},
  staticRenderFns: [],
    name: 'speech',
    data() {
      return {
        text: '',
        // 播放状态
        STATE,
        playState: STATE.stoping,  // 监控朗读的状态
        isPlaying: false,  // 按钮的状态
        elapsedTime: 0,

        voiceList: [],
        selectedVoice: 0,
        rate: 1,
        pitch: 1,

        autoStop: '',
        autoStopTime: 2,  // 2 小时
        autoStopTimeUnit: 'hour',
        autoStopChapter: 5,  // 5章

        synth: window.speechSynthesis,
        utterance: new SpeechSynthesisUtterance(),
      }
    },
    components: {
      PulseLoader
    },
    mounted() {
      // 载入语音列表
      this.voiceList = this.synth.getVoices();
      this.synth.onvoiceschanged = () => {
        this.voiceList = this.synth.getVoices();
      };

      this.loadSetting();
    },
    beforeDestory() {
      clearTimeout(this.autoStopTimeId);
    },
    methods: {
      formatMillisencod,
      closeSpeech() {
        this.$emit('closeSpeech');
      },
      loadSetting() {
        this.rate = GM_getValue('speech.rate', 1);
        this.pitch = GM_getValue('speech.pitch', 1);
        this.selectedVoice = GM_getValue('speech.selectedVoice', 0);

        this.autoStop = GM_getValue('speech.autoStop', '');
        this.autoStopTime = GM_getValue('speech.autoStopTime', 2);
        this.autoStopTimeUnit = GM_getValue('speech.autoStopTimeUnit', 'hour');
        this.autoStopChapter = GM_getValue('speech.autoStopChapter', 5);
      },
      saveSetting() {
        GM_setValue('speech.rate', this.rate);
        GM_setValue('speech.pitch', this.pitch);
        GM_setValue('speech.selectedVoice', this.selectedVoice);

        GM_setValue('speech.autoStop', this.autoStop);
        GM_setValue('speech.autoStopTime', this.autoStopTime);
        GM_setValue('speech.autoStopTimeUnit', this.autoStopTimeUnit);
        GM_setValue('speech.autoStopChapter', this.autoStopChapter);
      },
      async start() {
        this.isPlaying = true;

        // 获取当前所在的章节
        this.speakIndex = App$1.curFocusIndex;
        this.startSpeakIndex = App$1.curFocusIndex;
        let toSpeekText = this.getToSpeekText(true);

        bus.$off(APPEND_NEXT_PAGE, this.waitForNext);
        bus.$on(APPEND_NEXT_PAGE, this.waitForNext);

        // fix 可能的问题：点击开始朗读无效，需要 cancel 才有效
        window.speechSynthesis.cancel();

        this.speak(toSpeekText, this.checkNext);

        if (this.autoStop == 'time') {
          clearTimeout(this.autoStopTimeId);
          this.autoStopTimeId = setTimeout(this.stop, this.getAutoStopMillisecond());
        }

        // 保存设置
        this.saveSetting();
      },
      getAutoStopMillisecond() {
        if (this.autoStopTimeUnit == 'minute') {
          return this.autoStopTime * 60 * 1000
        } else {
          return this.autoStopTime * 3600 * 1000
        }
      },
      async checkNext() {
        if (!this.isPlaying) return

        this.speakIndex += 1;
        await this.checkAgin();
      },
      async checkAgin() {
        let speakedChapters = this.speakIndex - this.startSpeakIndex;
        if (this.autoStop == 'chapter' && speakedChapters >= this.autoStopChapter) {
          this.stop();
          return
        }

        // 是否有新章节
        let nextText = this.getToSpeekText();
        if (nextText) {
          this.isFindingNext = false;
          this.speak(nextText, this.checkNext);

          this.scrollToNext();
        } else {
          this.isFindingNext = true;
          // 加载下一章
          await App$1.scrollForce();
        }
      },
      async waitForNext() {
        if (this.isFindingNext && this.isPlaying) {
          await this.checkAgin();
        }
      },
      scrollToNext() {
        let elem = App$1.scrollItems.get(this.speakIndex);
        if (elem) {
          App$1.scrollToArticle(elem);
        }
      },
      getToSpeekText(fromSelection=false) {
        let startIndex = this.speakIndex;

        // 这是 jQuery 对象
        let text = App$1.scrollItems
          .toArray()
          .filter((elem, i) => {
            return i == startIndex
          })
          // .map(elem => elem.textContent.slice(0, 10))  // debug
          .map(elem => elem.textContent)
          .join('\n');

        if (fromSelection) {
          let newText = this.getSelectionAfterText(text);
          if (newText) {
            return newText
          }
        }

        return text
      },
      getSelectionAfterText(text) {
        const selObj = getSelection();
        const selStr = selObj.toString();
        let afterText;

        if (!selStr) return

        let indexes = locations(selStr, text);
        if (indexes.length == 0) {
          return
        } else if (indexes.length == 1) {
          afterText = text.substring(indexes[0]);
        } else {  // 多个
          indexes = locations(selObj.anchorNode.data, text);
          if (indexes.length == 0) return
          else if (indexes.length == 1) {
            let start = indexes[0] + selObj.anchorOffset;
            afterText = text.substring(start);
          } else {
            console.error('getSelectionAfterText() 无法判断唯一');
          }
        }

        selObj.removeAllRanges();
        return afterText
      },
      speak(text, endFn) {
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.voice = this.voiceList[this.selectedVoice];
        this.utterance.pitch = this.pitch;
        this.utterance.rate = this.rate;

        this.listenForSpeechEvents(endFn);

        this.synth.speak(this.utterance);
      },
      listenForSpeechEvents (endFn) {
        this.utterance.onstart = () => {
          this.playState = STATE.playing;
        };
        this.utterance.onpause = (event) => {
          this.playState = STATE.pausing;
          this.elapsedTime = event.elapsedTime;
        };
        this.utterance.onresume = (e) => {
          this.playState = STATE.playing;
        };
        this.utterance.onend = (event) => {
          this.playState = STATE.stoping;
          // this.elapsedTime = event.elapsedTime
          this.elapsedTime = null;

          if (endFn) {
            endFn();
          }
        };
      },
      pause() {
        this.isPlaying = false;

        this.synth.pause();
      },
      resume() {
        this.isPlaying = true;

        this.synth.resume();
      },
      stop() {
        this.isPlaying = false;

        this.synth.cancel();

        clearTimeout(this.autoStopTimeId);
      }
    }
  };

  var App = {
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[(_vm.speechDialogVisible)?_c('speech',{staticClass:"speech",on:{"closeSpeech":_vm.hideSpeech}}):_vm._e()],1)},
  staticRenderFns: [],
    data() {
      return {
        speechDialogVisible: false,
      }
    },
    components: {
      Speech,
    },
    created() {
      bus.$on(SHOW_SPEECH, this.showSpeech);
    },
    beforeDestory() {
      bus.$off(SHOW_SPEECH, this.hideSpeech);
    },
    methods: {
      showSpeech() {
        this.speechDialogVisible = true;
      },
      hideSpeech() {
        this.speechDialogVisible = false;
      }
    }
  };

  function runVue() {
    new Vue({
      el: '#app',
      render: h => h(App)
    });
  }

  const {
    HTMLElement,
    EventTarget,
    MutationObserver: MutationObserver$1,
    Navigator,
    Proxy,
    Reflect: Reflect$1,
    Object: Object$1,
    setTimeout: setTimeout$1,
    clearTimeout: clearTimeout$1,
    console: console$1
  } = unsafeWindow;

  // 防止 iframe 中的脚本调用 focus 方法导致页面发生滚动
  const _focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function focus() {
    _focus.call(this, { preventScroll: true });
  };

  const clenaupEventArray = [];

  const _addEventListener = EventTarget.prototype.addEventListener;
  function addEventListener(type, listener, options) {
    _addEventListener.apply(this, arguments);
    clenaupEventArray.push(() => {
      try {
        this.removeEventListener(...arguments);
      } catch (e) {}
    });
  }
  EventTarget.prototype.addEventListener = addEventListener;
  document.addEventListener = addEventListener;

  const _observe = MutationObserver$1.prototype.observe;
  const _disconnect = MutationObserver$1.prototype.disconnect;
  function observe(target, options) {
    _observe.apply(this, arguments);
    clenaupEventArray.push(() => {
      try {
        _disconnect.apply(this, arguments);
      } catch (e) {}
    });
  }
  MutationObserver$1.prototype.observe = observe;

  function cleanupEvents(iframe) {
    let func;
    const length = clenaupEventArray.length;
    while ((func = clenaupEventArray.pop())) func();
    C.log(`${iframe ? '[iframe] ' : ''}已移除 ${length} 个事件监听器和观察器`);

    var highestTimeoutId = setTimeout$1(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout$1(i);
    }

    try {
      unsafeWindow.$(unsafeWindow).off();
      unsafeWindow.$(document).off();
    } catch (e) {}
  }

  if (window.name === 'mynovelreader-iframe') {
    unsafeWindow.$cleanupEvents = cleanupEvents;
  }

  Object$1.defineProperty(Navigator.prototype, 'platform', {
    get: function platform() {
      return ''
    }
  });

  console$1.clear = () => {};

  const proxies = new WeakMap();

  unsafeWindow.Proxy = new Proxy(Proxy, {
    construct: function (target, argumentsList, newTarget) {
      const proxy = Reflect$1.construct(target, argumentsList, newTarget);
      proxies.set(proxy, argumentsList[0]);
      return proxy
    }
  });

  /** @enum {number} */
  const RequestStatus = {
    Idle: 0,
    Loading: 1,
    Finish: 2,
    Fail: 3
  };

  const iframeHeight = unsafeWindow.innerHeight;

  class BaseRequest {
    constructor() {
      this.errorHandle = () => {};
      this.finishHnadle = () => {};
    }

    setErrorHandle(func) {
      this.errorHandle = func;
    }

    setFinishHandle(func) {
      this.finishHnadle = func;
    }
  }

  class XmlRequest extends BaseRequest {
    constructor() {
      super();
      this.status = RequestStatus.Idle;
      this.doc = null;
    }

    async send(url) {
      this.status = RequestStatus.Loading;
      this.doc = null;
      const options = {
        url,
        method: 'GET',
        overrideMimeType: 'text/html;charset=' + document.characterSet,
        timeout: config.xhr_time
      };

      let retry = 3;
      let error = null;

      while (retry--) {
        try {
          const res = await Request(options);
          this.doc = parseHTML(res.responseText);
          this.status = RequestStatus.Finish;
          this.finishHnadle();
          break
        } catch (e) {
          error = e;
          C.error(
            `XmlRequest 请求过程出现异常，第 ${3 - retry} 次请求`,
            error
          );
        }
      }

      if (!this.doc) {
        this.status = RequestStatus.Fail;
        this.errorHandle();
        C.error('XmlRequest 请求失败', error);
      }
    }

    getDocument() {
      this.status = RequestStatus.Idle;
      return this.doc
    }

    hide() {}
    show() {}
  }

  class IframeRequest extends BaseRequest {
    constructor() {
      super();
      this.status = RequestStatus.Idle;
      this.iframe = createIframe(this.loaded.bind(this));
      this.doc = null;
      this.win = null;
    }

    get display() {
      return !this.iframe.style.display
    }

    async send(url) {
      this.status = RequestStatus.Loading;
      this.doc = this.win = null;
      
      if (!this.display) {
        this.show();
      }
      this.iframe.setAttribute('src', url);
    }

    async loaded() {
      this.doc = this.iframe.contentDocument;
      this.win = this.iframe.contentWindow;

      if (!this.doc) {
        this.status = RequestStatus.Fail;
        this.hide();
        this.errorHandle();
        C.error('IframeRequest 请求过程出现异常');
        return
      }

      this.win.scrollTo(0, this.doc.body.scrollHeight - this.win.innerHeight * 2);

      if (App$1.site.startLaunch) {
        App$1.site.startLaunch($(this.doc));
      }

      if (App$1.site.mutationSelector) {
        await observeElement(this.doc, App$1.site);
      } else {
        const timeout = App$1.site.timeout || 0;
        if (timeout) {
          await sleep(timeout);
        }
      }
      this.hide();
      this.status = RequestStatus.Finish;
      this.finishHnadle();
    }

    getDocument() {
      this.status = RequestStatus.Idle;
      return this.doc
    }

    hide() {
      this.iframe.style.display = 'none';
    }

    show() {
      this.iframe.style.display = '';
    }
  }

  function createIframe(onload) {
    const iframe = document.createElement('iframe');
    iframe.name = 'mynovelreader-iframe';
    iframe.style.cssText = `
    width:100%;
    height:${iframeHeight}px;
    border:0!important;
    margin:0!important;
    padding:0!important;
    visibility:hidden!important;
    display:none;
  `;
    document.body.appendChild(iframe);
    iframe.onload = onload;
    return iframe
  }

  var App$1 = {
      isEnabled: false,
      parsedPages: {},
      pageNum: 1,
      paused: false,
      curPageUrl: location.href,
      requestUrl: null,
      iframe: null,
      remove: [],
      // 滚动激活相关
      curFocusElement: null,
      curFocusIndex: 1,
      // 站点字体信息
      siteFontInfo: null,
      /**@type {XmlRequest | IframeRequest} */
      request: null,

      init: async function() {
          if (["mynovelreader-iframe", "superpreloader-iframe"].indexOf(window.name) != -1) { // 用于加载下一页的 iframe
              return;
          }

          // 手动调用
          var readx = App$1.launch;

          try {
              exportFunction(readx, unsafeWindow, {defineAs: "readx"});
          } catch(ex) {
              C.error('无法定义 readx 函数');
          }


          App$1.loadCustomSetting();
          App$1.site = App$1.getCurSiteInfo();

          // 等待 DOMContentLoaded 事件触发
          await DOMContentLoaded();

          if (App$1.site.startLaunch) {
              App$1.site.startLaunch($(document));
          }

          var autoLaunch = App$1.isAutoLaunch();

          if (autoLaunch === -1) {
              return;
          } else if (autoLaunch) {
              if (App$1.site.mutationSelector) { // 特殊的启动：等待js把内容生成完毕
                  // await App.addMutationObserve(document);
                  await observeElement(document, App$1.site);
              } else if (App$1.site.timeout) { // 延迟启动
                  await sleep(App$1.site.timeout);
              }
              if (!App$1.site.fastboot) {
                  // 等待 Dom 稳定
                  await App$1.DomMutation();
              }
              await App$1.launch();
          } else {
              await UI.addButton();
          }
      },
      loadCustomSetting: function() {
          var customRules;
          try {
              customRules = eval(Setting.customSiteinfo);
          } catch (e) {
              C.error('载入自定义站点配置错误', e);
          }

          if (_.isArray(customRules)) {
              Rule.customRules = customRules;
              C.log('载入自定义站点规则成功', customRules);
          }

          // load custom replace rules
          Rule.customReplace = Rule.parseCustomReplaceRules(Setting.customReplaceRules);

          C.log('载入自定义替换规则成功', Rule.customReplace);
      },
      getCurSiteInfo: function() {
          var rules = Rule.customRules.concat(Rule.specialSite);
          var locationHref = location.href;

          var info = _.find(rules, function(x) {
              return toRE(x.url).test(locationHref);
          });

          if (!info) {
              info = {};
              C.log("没有找到规则，尝试自动模式。");
          } else {
              C.log("找到规则：", info);
          }
          return info;
      },
      isAutoLaunch: function() {
          var locationHost = location.host,
              referrer = document.referrer;

          switch (true) {
              case L_getValue("mynoverlreader_disable_once") == 'true':
                  L_removeValue("mynoverlreader_disable_once");
                  return false;
              // case location.hostname == 'www.fkzww.net' && !document.title.match(/网文快讯/):  // 啃书只自动启用一个地方
              //     return false;
              case Setting.booklink_enable && /booklink\.me/.test(referrer):
                  return true;
              case locationHost == 'tieba.baidu.com':
                  var title = $('.core_title_txt').text();
                  if (title.match(Rule.titleRegExp)) {
                      return false;
                  } else {
                      return -1;
                  }
              case Setting.launchMode === 'manual':
                  return false
              // case Setting.getDisableAutoLaunch():
              //     return false;
              case Setting.launchMode === 'auto':
              case GM_getValue("auto_enable"):
              case config.soduso :
                  return true;
              default:
                  return false;
          }
      },
      addMutationObserve: function(doc) {
          var shouldAdd = false;
          var $doc = $(doc);

          var contentSize = $doc.find(App$1.site.contentSelector).size();
          if (contentSize && !App$1.site.mutationSelector) {
              shouldAdd = false;
          } else {
              var mutationSelector = App$1.site.mutationSelector;
              var target = $doc.find(mutationSelector)[0];
              if (target) {
                  var beforeTargetChilren = target.children.length;
                  C.log(`target.children.length = ${target.children.length}`, target);
                  if (App$1.site.mutationChildText) {
                      if (target.textContent.indexOf(App$1.site.mutationChildText) > -1) {
                          shouldAdd = true;
                      }
                  } else {
                      var childCount = App$1.site.mutationChildCount;
                      if (childCount === undefined || target.children.length <= childCount) {
                          shouldAdd = true;
                      }
                  }
              }
          }

          if (shouldAdd) {
              return new Promise(resolve => {
                  var observer = new MutationObserver(function (mutations) {
                      target = $doc.find(mutationSelector)[0];
                      var nodeAdded = target.children.length > beforeTargetChilren;

                      if (nodeAdded) {
                          observer.disconnect();
                          resolve();
                      }
                  });

                  observer.observe(document, {
                      childList: true,
                      subtree: true
                  });

                  C.log('添加 MutationObserve 成功：', mutationSelector);
              })
          }
      },
      // 等待 Dom 稳定
      DomMutation: function() {
          return new Promise(resolve => {
              const debounced = _.debounce(() => {
                  observer.disconnect();
                  resolve();
              }, 100);
              const observer = new MutationObserver(() => debounced());
              observer.observe(document,{
                  childList: true,
                  subtree: true
              });
              debounced();
          })
      },
      launch: async function() {
          // 只解析一次，防止多次重复解析一个页面
          if (document.body && document.body.getAttribute("name") == "MyNovelReader") {
              return await App$1.toggle();
          }

          if (!App$1.site) {
              App$1.site = App$1.getCurSiteInfo();
          }

          if (App$1.site.startFilter) {
              try {
                  App$1.site.startFilter();
                  C.log('run startFilter function success');
              } catch (ex) {
                  C.error('运行 startFilter function 错误', ex);
              }
          }

          // 使用站点字体
          if (App$1.site.useSiteFont) {
              if (_.isBoolean(App$1.site.useSiteFont)) {
                  App$1.siteFontInfo = App$1.getSiteFontInfo();
              } else if (_.isString(App$1.site.useSiteFont)) {
                  if (!App$1.site.useSiteFont.trim().endsWith(',')) {
                      App$1.site.useSiteFont = App$1.site.useSiteFont.trim() + ',';
                  }
                  App$1.siteFontInfo = { siteFontFamily: App$1.site.useSiteFont.trim() };
              }
          }

          cleanupEvents();

          var parser = new Parser(App$1.site, document);
          var hasContent = !!parser.hasContent();
          if (hasContent) {
              document.body.setAttribute("name", "MyNovelReader");
              App$1.parsedPages[window.location.href] = true;
              await parser.getAll();
              await App$1.processPage(parser);
          } else {
              App$1.isEnabled = true;
              $('.readerbtn').remove();
              await UI.addButton();
              $('.readerbtn').text('无内容');
              C.error("当前页面没有找到内容");
          }

          // 初始化, 取消页面限制等
          if (App$1.site.fInit)
              App$1.site.fInit();
      },
      processPage: async function(parser) {
          // 对 Document 进行处理
          document.body.innerHTML = '';
          App$1.prepDocument();
          App$1.initDocument(parser);

          runVue();

          // cache vars
          App$1.$doc = $(document);
          App$1.$menuBar = App$1.$doc.find("#menu-bar");
          App$1.$menu = App$1.$doc.find("#menu");
          App$1.$content = App$1.$doc.find("#mynovelreader-content");
          App$1.$loading = App$1.$doc.find("#loading");
          App$1.$preferencesBtn = App$1.$doc.find("#preferencesBtn");

          App$1.$menuHeader = App$1.$menu.find("#chapter-list");
          App$1.$chapterList = App$1.$menu.find("#chapter-list");

          App$1.indexUrl = parser.indexUrl;
          App$1.prevUrl = parser.prevUrl; // 第一个上一页

          App$1.oArticles = [];  // 原始的内容，用于替换的无需刷新
          App$1.parsers = [];

          // 加入上一章的链接
          if (parser.prevUrl) {
              $("<li>")
                  .addClass('chapter')
                  .append(
                      $("<div>")
                      .attr({
                          "realHref": parser.prevUrl,
                          "onclick": "return false;"
                      })
                      .text("上一章".uiTrans())
                  )
                  .prependTo(App$1.$chapterList);
          }

          // 插入站点样式
          if (App$1.site.style) {
              GM_addStyle(App$1.site.style);
          }

          // 插入站点字体样式
          if (App$1.site.useSiteFont && App$1.siteFontInfo) {
              const { external, internal } = App$1.siteFontInfo;
              if (internal) {
                  $('<style class="noRemove siteFont">')
                      .text(internal.map(e => e.cssText).join('\n'))
                      .appendTo('head');
              }
              // 插入外部样式表可能会影响阅读界面样式
              // if (external) {
              //     for (const href of external) {
              //         $('<link class="noRemove siteFont" rel="stylesheet">').attr('href', href).prependTo('head')
              //     }
              // }
          }

          App$1.appendPage(parser, true);

          App$1.registerControls();

          // UI 的初始化
          UI.init();

          App$1.curFocusElement = $("article:first").get(0); // 初始化当前关注的 element
          App$1.requestUrl = parser.nextUrl;
          App$1.isTheEnd = parser.isTheEnd;

          App$1.isEnabled = true;
          await UI.addButton();

          // // 如果已经把当前焦点链接添加到历史记录，则滚动到顶部
          // if (Setting.addToHistory) {
          //     window.scrollTo(0, 0);
          // }

          history.scrollRestoration = 'manual';
          window.scrollTo(0, 0);

          // 初始化 request
          App$1.initRequest();

          // 有些图片网站高度随着图片加载而变长
          setTimeout(App$1.scroll, 1000);

          App$1.cleanAgain();

          if (Setting.preloadNextPage) {
              await App$1.doRequest();
          }
      },
      initRequest: function() {
          App$1.request = App$1.site.useiframe ? new IframeRequest() : new XmlRequest();
          App$1.request.setErrorHandle(App$1.scrollForce);
          App$1.request.setFinishHandle(App$1.scroll);
      },
      prepDocument: function() {
          window.onload = window.onunload = function() {};

          // 破解右键限制
          var doc = document;
          var bd = doc.body;
          bd.onclick = bd.ondblclick = bd.onselectstart = bd.oncopy = bd.onpaste = bd.onkeydown = bd.oncontextmenu = bd.onmousemove = bd.onselectstart = bd.ondragstart = doc.onselectstart = doc.oncopy = doc.onpaste = doc.onkeydown = doc.oncontextmenu = null;
          doc.onclick = doc.ondblclick = doc.onselectstart = doc.oncontextmenu = doc.onmousedown = doc.onkeydown = function() {
              return true;
          };

          doc = document.wrappedJSObject || document;
          doc.onmouseup = null;
          doc.onmousedown = null;
          doc.oncontextmenu = null;

          var arAllElements = document.getElementsByTagName('*');
          for (var i = arAllElements.length - 1; i >= 0; i--) {
              var elmOne = arAllElements[i];
              elmOne = elmOne.wrappedJSObject || elmOne;
              elmOne.onmouseup = null;
              elmOne.onmousedown = null;
          }


          // remove body style
          $('link[rel="stylesheet"], script').remove();
          $('body')
              .removeAttr('style')
              .removeAttr('bgcolor');

          $('style:not(.noRemove)').filter(function() {
              var $style = $(this);
              if($style.text().indexOf('#cVim-link-container') != -1) {  // chrome 的 cVim 扩展
                  return false;
              }
              return true;
          }).remove();

          // 移除 html 标签中非 head 和 body 的元素
          $('html').children().filter(function () {
              let tagName = $(this).prop('tagName').toLowerCase();
              if (tagName !== 'head' && tagName !== 'body') {
                  return true
              }
              return false
          }).remove();
      },
      initDocument: function(parser) {
          document.title = parser.docTitle;

          document.body.innerHTML = $.nano(tpl_mainHtml.uiTrans(), parser);
      },
      clean: function() {
          $('body > *:not("#container, .readerbtn, .noRemove, #reader_preferences, #uil_blocker,iframe[name=\'mynovelreader-iframe\']")').remove();
          $('link[rel="stylesheet"]:not(.noRemove)').remove();
          $('body, #container').removeAttr('style').removeAttr('class');

          if (unsafeWindow.jQuery && location.host.indexOf('qidian') > 0) {
              unsafeWindow.jQuery(document).off("selectstart").off("contextmenu");
          }
      },
      cleanAgain: function() {
          // var host = location.host;
          // if (!host.match(/qidian\.com|zongheng\.com/)) {  // 只在起点、纵横等网站运行
          //     return;
          // }

          // 再次移除其它不相关的，起点，纵横中文有时候有问题
          setTimeout(App$1.clean, 2000);
          setTimeout(App$1.clean, 5000);
          setTimeout(App$1.clean, 8000);
          // TM 用 addEventListener('load') 有问题
          window.onload = function() {
              App$1.clean();
              setTimeout(App$1.clean, 500);
          };
      },
      toggle: async function() {
          if (App$1.isEnabled) { // 退出
              GM_setValue("auto_enable", false);
              L_setValue("mynoverlreader_disable_once", true);

              location.href = App$1.activeUrl || App$1.curPageUrl;
              location.reload();
          } else {
              GM_setValue("auto_enable", true);
              L_removeValue("mynoverlreader_disable_once");
              App$1.isEnabled = true;
              await App$1.launch();
          }
      },
      removeListener: function() {
          C.log("移除各种事件监听");
          App$1.remove.forEach(function(_remove) {
              _remove();
          });
      },
      appendPage: function(parser, isFirst) {
          var chapter = $("article:last");
          if (chapter.length && parser.isSection) { // 每次获取的不是一章，而是一节
              var lastText = chapter.find("p:last").remove().text().trimEnd();
              var newPage = parser.content.replace(/<p>\s+/, "<p>" + lastText);

              chapter
                  .find(".chapter-footer-nav").remove()
                  .end()
                  .append(newPage);

              if (!Setting.hide_footer_nav) {
                  chapter.append($.nano(UI.tpl_footer_nav, parser));
              }

          } else {
              chapter = $("<article>")
                  .attr("id", "page-" + App$1.pageNum)
                  .append(
                      $("<h1>").addClass("title").text(parser.chapterTitle)
                  )
                  .append(parser.content)
                  .appendTo(App$1.$content);

              if (!Setting.hide_footer_nav) {
                  chapter.append($.nano(UI.tpl_footer_nav, parser));
              }

              // App.fixImageFloats(chapter.get(0));

              // 添加到章节列表
              var chapterItem = $("<li>")
                  .addClass('chapter')
                  .append(
                      $("<div>")
                      .attr({
                          href: "#page-" + App$1.pageNum,
                          "realHref": parser.curPageUrl,
                          onclick: "return false;",
                          title: parser.chapterTitle
                      })
                      .text(parser.chapterTitle)
                  )
                  .prependTo(App$1.$chapterList);

              if (isFirst) {
                  chapterItem.addClass('active');
              }

              App$1.pageNum += 1;
              App$1.resetCache();
          }

          App$1.oArticles.push(chapter[0].outerHTML);
          App$1.parsers.push(parser);

          bus.$emit(APPEND_NEXT_PAGE);
      },
      resetCache: function() {  // 更新缓存变量
          App$1.menuItems = App$1.$chapterList.find("div");
          App$1.scrollItems = $("article");
      },
      registerControls: function() {
          // 内容滚动
          var throttled = _.throttle(App$1.scroll, 200);
          $(window).scroll(throttled);

          App$1.registerKeys();

          if (Setting.dblclickPause) {
              App$1.$content.on("dblclick", function() {
                  App$1.pauseHandler();
              });
          }

          // 左侧章节列表
          App$1.$menuHeader.click(function() {
              App$1.copyCurTitle();
          });

          App$1.$menuBar.click(function() {
              UI.hideMenuList();
          });

          App$1.$doc.on("mousedown", "#chapter-list div", function(event) {
              switch (event.which) {
                  case 1:
                      var href = $(this).attr("href");
                      if (href) {
                          App$1.scrollToArticle($(href));
                      } else {
                          location.href = $(this).attr("realHref");
                      }
                      break;
                  case 2: // middle click
                      L_setValue("mynoverlreader_disable_once", true);
                      App$1.openUrl($(this).attr("realHref"));
                      break;
              }
          });

          $("#preferencesBtn").click(function(event) {
              event.preventDefault();
              UI.preferencesShow();
          });

          GM_registerMenuCommand("小说阅读脚本设置".uiTrans(), UI.preferencesShow.bind(UI));
      },
      registerKeys: function() {
          key('enter', function(event) {
              if (UI.$prefs) {
                  return;
              }

              App$1.openUrl(App$1.indexUrl, "主页链接没有找到".uiTrans());
              App$1.copyCurTitle();

              event.stopPropagation();
              event.preventDefault();
          });

          key('left', function(event) {
              var scrollTop = $(window).scrollTop();
              if (scrollTop === 0) {
                  location.href = App$1.prevUrl;
              } else {
                  var offsetTop = $(App$1.curFocusElement).offset().top;
                  // 在视野窗口内
                  if (offsetTop > scrollTop && offsetTop < (scrollTop + $(window).height())) {
                      App$1.scrollToArticle(App$1.curFocusElement.previousSibling || 0);
                  } else {
                      App$1.scrollToArticle(App$1.curFocusElement);
                  }
              }
              return false;
          });

          key('right', function(event) {
              if (App$1.getRemain() === 0) {
                  location.href = App$1.lastRequestUrl || App$1.requestUrl;
              } else {
                  App$1.scrollToArticle(App$1.curFocusElement.nextSibling || App$1.$doc.height());
              }

              event.preventDefault();
              event.stopPropagation();
              return false;
          });

          key('esc', function(){
              if (UI.$prefs) {
                  UI.hide();
                  return false;
              }
          });

          key('shift+/', function() {
              UI.openHelp();
              return false;
          });

          key(Setting.quietModeKey, function(){
              UI.toggleQuietMode();
              return false;
          });

          key(Setting.hideMenuListKey, function(){
              UI.hideMenuList();
              return false;
          });

          key(Setting.openPreferencesKey, function(){
              UI.preferencesShow();
              return false;
          });

          key(Setting.openSpeechKey, function() {
              bus.$emit(SHOW_SPEECH);
              return false;
          });

          // PageUp
          key(',', function() {
              let { scrollX, scrollY, innerHeight } = window;
              window.scrollTo(scrollX, scrollY - innerHeight * .9);
          });
          // PageDown
          key('.', function() {
              let { scrollX, scrollY, innerHeight } = window;
              window.scrollTo(scrollX, scrollY + innerHeight * .9);
          });
      },
      copyCurTitle: function() {
          if (Setting.copyCurTitle) {
              var title = $(App$1.curFocusElement).find(".title").text()
                  .replace(/第?\S+章/, "").trim();

              GM_setClipboard(title, "text");
          }
      },
      scrollToArticle: function(elem) {
          var offsetTop;
          if (typeof elem == "number") {
              offsetTop = elem;
          } else {
              offsetTop = $(elem).offset().top - parseInt($(elem).css("margin-top"), 10);
          }

          if (Setting.scrollAnimate) {
              $("html, body").stop().animate({
                  scrollTop: offsetTop
              }, 750, "easeOutExpo");
          } else {
              $("html, body").stop().scrollTop(offsetTop);
          }
      },
      openUrl: function(url, errorMsg) {
          if (url) {
              // ff30 Greasemonkey 会报错：Greasemonkey 访问违规：unsafeWindow 无法调用 GM_openInTab。新建脚本采用按键调用也这样。
              setTimeout(function() {
                  GM_openInTab(url, false);
              }, 0);
          } else if (errorMsg) {
              UI.notice(errorMsg);
          }
      },
      pauseHandler: async function() {
          App$1.paused = !App$1.paused;
          if (App$1.paused) {
              UI.notice('<b>状态</b>:自动翻页<span style="color:red!important;"><b>暂停</b></span>'.uiTrans());
              App$1.$loading.html('自动翻页已经<span style="color:red!important;"><b>暂停</b></span>'.uiTrans()).show();
          } else {
              UI.notice('<b>状态</b>:自动翻页<span style="color:red!important;"><b>启用</b></span>'.uiTrans());
              await App$1.scroll();
          }
      },
      scroll: async function() {
          if (App$1.request.display && Math.floor(App$1.getRemain() - iframeHeight) < 0) {
              window.scrollTo(0, document.body.scrollHeight - window.innerHeight - iframeHeight  + 51);
          }
          if (
              !App$1.paused &&
              !App$1.working &&
              App$1.getRemain() < Setting.remain_height
          ) {
              await App$1.scrollForce();
          }

          if (App$1.isTheEnd) {
              App$1.$loading.html("已到达最后一页...".uiTrans()).show();
          }

          App$1.updateCurFocusElement();
      },
      scrollForce: async function() {
          // if (App.tmpDoc) {
          //     await App.loaded(App.tmpDoc);
          // } else {
          //     await App.doRequest();
          // }
          switch (App$1.request.status) {
              case RequestStatus.Idle:
                  await App$1.doRequest();
                  break;
              case RequestStatus.Finish:
                  await App$1.loaded(App$1.request.getDocument());
                  break;
              case RequestStatus.Fail:
                  const nextUrl = App$1.curPageUrl;
                  App$1.$loading.html("<a href='" + nextUrl + "'>无法获取下一页，请手动点击</a>").show();
                  break;
          }
      },
      updateCurFocusElement: function() { // 滚动激活章节列表
          // Get container scroll position
          var fromTop = $(window).scrollTop() + $(window).height() / 2;

          // Get id of current scroll item
          var cur = App$1.scrollItems.map(function() {
              if ($(this).offset().top < fromTop)
                  return this;
          });
          // Get the id of the current element
          App$1.curFocusIndex = cur.length - 1;
          cur = cur[cur.length - 1];
          var id = cur ? cur.id : "";

          if (App$1.lastId !== id) {
              App$1.lastId = id;

              var activeItem = App$1.menuItems.filter("[href=#" + id + "]"),
                  activeTitle = activeItem.text(),
                  activeUrl = activeItem.attr("realHref");

              // Set/remove active class
              App$1.menuItems.parent().removeClass("active");
              activeItem.parent().addClass("active");

              App$1.curFocusElement = cur;
              App$1.activeUrl = activeUrl;

              if (Setting.addToHistory) {
                  var curNum = id.match(/\d+/)[0] - 1;  // 当前是第几个
                  var curTitle = App$1.parsers[curNum].docTitle;
                  document.title = curTitle;

                  // 有域名的限制，起点过渡到 vip 章节无法生效
                  var url = activeUrl.replace('http://read.qidian.com', '');
                  try {
                      unsafeWindow.history.pushState(null, curTitle, url);
                  } catch (e) {
                      C.error('添加下一页到历史记录失败', e);
                  }
              }
          }
      },
      getRemain: function() {
          var scrollHeight = Math.max(document.documentElement.scrollHeight,
              document.body.scrollHeight);
          var remain = scrollHeight - window.innerHeight - window.scrollY;
          return remain;
      },
      doRequest: async function() {
          // App.working = true;
          var nextUrl = App$1.requestUrl;
          App$1.lastRequestUrl = App$1.requestUrl;

          if (nextUrl && !App$1.isTheEnd && !(nextUrl in App$1.parsedPages)) {
              App$1.parsedPages[nextUrl] = 0;
              App$1.curPageUrl = App$1.requestUrl;
              App$1.requestUrl = null;

              var useiframe = App$1.site.useiframe;

              App$1.$loading
                  .show()
                  .html("")
                  .append($("<img>").attr("src", "data:image/gif;base64,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"))
                  .append("<a href='" + nextUrl + "' title='点击打开下一页链接'>正在载入下一页".uiTrans() + (useiframe ? "(iframe)" : "") + "...</a>");

              await sleep(App$1.site.nDelay || 0);
              
              // if (useiframe) {
              //     App.iframeRequest(nextUrl); // 不用 await
              // } else {
              //     ;(async () => {
              //         const doc = await App.httpRequest(nextUrl)
              //         App.httpRequestDone(doc, nextUrl) // 不用 await
              //     })()
              // }
              C.log('获取下一页', nextUrl);
              App$1.request.send(nextUrl);
      
          }
      },
      httpRequest: async function(nextUrl) {

          C.log("获取下一页: " + nextUrl);
          App$1.parsedPages[nextUrl] += 1;

          const options = {
              url: nextUrl,
              method: "GET",
              overrideMimeType: "text/html;charset=" + document.characterSet,
              timeout: config.xhr_time,
          };

          let doc = null;
          try {
              const res = await Request(options);
              doc = parseHTML(res.responseText);
          } catch (e) {}

          return doc
      },
      httpRequestDone: async function(doc, nextUrl) {
          if (doc) {
              await App$1.beforeLoad(doc);
              return;
          }

          if (App$1.parsedPages[nextUrl] >= 3) {
              C.error('同一个链接已获取3次', nextUrl);
              App$1.$loading.html("<a href='" + nextUrl  + "'>无法获取下一页，请手动点击</a>").show();
              return;
          }

          // 无内容再次尝试获取
          C.error('连接超时, 再次获取');
          doc = await App$1.httpRequest(nextUrl);
          await App$1.httpRequestDone(doc, nextUrl);
      },
      iframeRequest: async function(nextUrl) {
          C.log("iframeRequest: " + nextUrl);
          if (!App$1.iframe) {
              var i = document.createElement('iframe');
              App$1.iframe = i;
              i.name = 'mynovelreader-iframe';
              i.width = '100%';
              i.height = `${unsafeWindow.innerHeight}px`;
              i.frameBorder = "0";
              i.style.cssText = '\
                margin:0!important;\
                padding:0!important;\
                visibility:hidden!important;\
            ';
              i.src = nextUrl;
              i.addEventListener('load', App$1.iframeLoaded, false);
              App$1.remove.push(function() {
                  i.removeEventListener('load', App$1.iframeLoaded, false);
              });
              document.body.appendChild(i);
          } else {
              App$1.iframe.contentDocument.location.replace(nextUrl);
          }
      },
      iframeLoaded: async function() {
          var iframe = this;
          var body = iframe.contentDocument.body;

          if (body && body.firstChild) {
              var win = iframe.contentWindow;
              var doc = iframe.contentDocument;

              // 滚动最后
              win.scrollTo(0, doc.body.scrollHeight);

              if (App$1.site.startLaunch) {
                  App$1.site.startLaunch($(doc));
              }

              var mutationSelector = App$1.site.mutationSelector;
              if (mutationSelector) {
                  // await App.addMutationObserve(doc);
                  await observeElement(doc, App$1.site);
              } else {
                  var timeout = App$1.site.timeout || 0;
                  await sleep(timeout);
              }
              await App$1.beforeLoad(doc);
          }
      },
      beforeLoad: async function(htmlDoc) {
          {
              await App$1.loaded(htmlDoc);
          }
      },
      loaded: async function(doc) {
          var parser = new Parser(App$1.site, doc, App$1.curPageUrl);
          await parser.getAll();
          await App$1.addNextPage(parser);
          App$1.tmpDoc = null;
      },
      addNextPage: async function(parser) {
          if (parser.content) {
              App$1.appendPage(parser);

              // App.$loading.hide();
              App$1.requestUrl = parser.nextUrl;
              App$1.isTheEnd = parser.isTheEnd;

              await App$1.afterLoad();
          } else {
              App$1.removeListener();

              var msg = (parser.isTheEnd == 'vip') ?
                  'vip 章节，需付费。' :
                  '错误：没有找到下一页的内容。';
              App$1.$loading.html(
                  '<a href="' + App$1.curPageUrl + '">' + msg + '点此打开下一页。</a>'.uiTrans())
                  .show();
          }

          App$1.working = false;
      },
      afterLoad: async function() {
          App$1.tmpDoc = null;

          if (Setting.preloadNextPage) {
              await sleep(200);
              App$1.doRequest();  // 不用 await
          }
      },
      fixImageFloats: function(articleContent) {

          articleContent = articleContent || document;

          var imageWidthThreshold = Math.min(articleContent.offsetWidth, 800) * 0.55,
              images = articleContent.querySelectorAll('img:not(.blockImage)');

          for (var i = 0, il = images.length; i < il; i += 1) {
              var image = images[i];

              if (image.offsetWidth > imageWidthThreshold) {
                  image.className += " blockImage";
              }
          }
      },

      isSaveing: false,
      saveAsTxt: async function() {
          if (App$1.site.useiframe) {
              UI.notice('暂不支持', 3000);
              return;
          }

          if (App$1.isSaveing) {
              alert('正在保存中，请稍后');
              return;
          }

          App$1.isSaveing = true;

          await run(App$1.parsers);
          App$1.isSaveing = false;
      },
      getSiteFontInfo: function () {
          const fonts = { external: [], internal: [], family: [] };
          const { external, internal, family, siteFontFamily } = fonts;

          // 获取所有的字体名字
          for (const font of document.fonts) {
              family.push(font.family);
          }

          // 获取外部 css 地址和内部 css 样式文本
          for (const styleSheet of document.styleSheets) {
              try {
                  for (const cssRule of styleSheet.cssRules) {
                      if (cssRule instanceof CSSFontFaceRule) {
                          const fontFamily = cssRule.style.fontFamily;
                          const cssText = cssRule.cssText;
                          if (!internal.find(o => o.fontFamily === fontFamily)) {
                              internal.push({ fontFamily, cssText });
                          }
                      }
                  }
              } catch (e) {
                  external.push(styleSheet.href);
              }
          }
          
          // 处理成 font-family 样式格式
          let familyList = [];

          // 内部样式优先
          internal.forEach(e => {
              familyList.push(e.fontFamily);
          });

          family.forEach(e => {
              if (!familyList.includes(e)) {
                  familyList.push(e);
              }
          });
          // 含空格字体名补双引号
          familyList = familyList.map(e => {
              if (e.includes(' ')) {
                  return `"${e}"`
              } else {
                  return e
              }
          });

          fonts.siteFontFamily = familyList.join(',') + ',';
          
          return fonts
      }
  };

  var BookLinkMe = {
    clickedColor: "666666",

    init: function() {

        this.addUnreadButton();

        // if (location.pathname.indexOf("/book-") === 0) {
        //     this.chapterPageAddTiebaLink();
        // }
    },
    addUnreadButton: function(){  // 添加一键打开所有未读链接
        var $parent = $('td[colspan="2"]:contains("未读"):first, td[colspan="2"]:contains("未讀"):first');
        if(!$parent.length) return;

        var openAllUnreadLinks = async function(event){
            event.preventDefault();

            var links = $x('./ancestor::table[@width="100%"]/descendant::a[img[@alt="未读"]]', event.target);
            for (let link of links) {
              // 忽略没有盗版的
              let chapterLink = link.parentNode.nextSibling.nextSibling.querySelector('a');
              if (chapterLink.querySelector('font[color*="800000"]')) {
                 continue;
              }

              await delay(200);

              if(isFirefox)
                  link.click();
              else
                  GM_openInTab(link.href);

              // 设置点击后的样式
              // 未读左边的 1x 链接
              link.parentNode.previousSibling.querySelector('font')
                  .setAttribute('color', BookLinkMe.clickedColor);
              chapterLink.classList.add('mclicked');
            }
        };


        $('<a>')
            .attr({ href: 'javascript:;', title: '一键打开所有未读链接', style: 'width:auto;' })
            .click(openAllUnreadLinks)
            .append($('<img src="me.png" style="max-width: 20px;">'))
            .appendTo($parent);
    },
    chapterPageAddTiebaLink: function() {
        var link = $('font:contains("贴吧")').parent().get(0);
        if (!link) return;

        var tiebaUrl = 'http://tieba.baidu.com/f?kw=' + $('h1').text();
        console.log('GM_xmlhttpRequest', tiebaUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: tiebaUrl,
            onload: function(response) {
                var doc = parseHTML(response.responseText);
                BookLinkMe.load(doc);
            }
        });
    },
    load: function(doc) {
        var $data = $(doc).find('.threadlist_text > a').map(function() {
            return {
                title: $(this).text(),
                url: 'http://tieba.baidu.com' + $(this).attr('href')
            }
        });

        var trimTitle = function(title, strict) {
            title = title.trim()
                .replace(/\.\.\.$/, '');

            if (strict) {
                title = title.replace(/第.*?章\s*/, '');
            }

            // if (toNum) {
            //     title = title.replace(/[零一二三四五六七八九十百千万亿]+/, cnNum2ArabNum);
            // }

            return title;
        };

        var findUrl = function(sTitle) {
            if (!sTitle) return;

            var url;
            $data.each(function(i, item) {
                var tiebaTitle = item.title;
                if (tiebaTitle.indexOf(trimTitle(sTitle)) > 0 ||
                    sTitle.indexOf(trimTitle(tiebaTitle, true)) > 0  // 包含贴吧标题的部分
                ) {
                    url = item.url;
                    return true;
                }
            });

            return url;
        };

        $('a:contains("搜索本章节")').each(function(){
            var $this = $(this),
                $thisLine = $this.parent().parent(),
                chapterTitle = $thisLine.prev().find('a[href^="/jump.php"]:first').text();

            var url = findUrl(chapterTitle);
            if (url) {
                $('<a>')
                    .attr({ target: '_blank', href: url })
                    .text('贴吧')
                    .appendTo($this.parent());
            }
        });
    }
  };

  toggleConsole(Setting.debug);

  if (location.host.indexOf('booklink.me') > -1) {
    BookLinkMe.init();
  } else {
    App$1.init();
  }

}(Vue));
