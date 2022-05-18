// ==UserScript==
// @id             mynovelreader@ywzhaiqi@gmail.com
// @name           My Novel Reader
// @name:zh-CN     小说阅读脚本
// @name:zh-TW     小說閱讀腳本
// @version        6.6.7
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
    PRELOADER: true,                // 提前预读下一页

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
      bookTitleSelector: '.cp-read-novel',
      useiframe: true,
          timeout: 500,
      contentSelector: '#cpReadContent',
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
            '\\(\\)',
        ]
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

      },

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
    "\\[\\]": "",
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

    '[AM]国': '美国',
    '[CZ]国': '中国',
    '[JR]国': '日本',
    'E国': '俄国',
    '[BY]国': '英国',
    'F国': '法国',
    'D国': '德国',

    '迸\\*{2}光': '迸射精光',
    '十之八\\*' : '十之八九',
    
  };

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
    '一秒记住.*',
    '本章未完.*',
    '笔趣阁.*最快更新.*',
    '最新网址：.*',
    // '.*笔下文学更新速度最快.*',
    // '.*(?:下载)?爱阅(?:小说)?app.*?。(?:活动推广期间.*。)?',
    '为您提供.*最快更新',
    '喜欢.*?请大家收藏：\\(.*?\\).*?更新速度最快。',
    '《.*?》无错章节将持续在.*?更新.站内无任何广告.还请大家收藏和推荐.*?！.*?$',

    // 爱阅小说app广告
    '想要看最新章节内容，请下载爱阅小说app，无广告免费阅读最新章节内容。网站已经不更新最新章节内容，最新章节内容已经在爱阅小说APP更新。',
    '特大好消息,退出转码页面,下载爱阅小说app后，全部小说免广告看，还能优先看最新章节。活动推广期间，用户还可以免费领取礼包100块钱话费。',
    '下载爱阅app阅读完整内容，无广告无弹窗。',
    '看最新内容，请下载爱阅小说app阅读最新章节。',
    '网页版章节内容慢，请下载爱阅小说app阅读最新内容。?',
    '领取红包，请下载爱阅app免费看最新内容。',
    '网站即将关闭，下载爱阅app免费看最新内容。?',
    '请退出转码页面，请下载爱阅小说app 阅读最新章节。',

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
    '【认识十年的老书友给我推荐的追书pp，咪咪阅读！真特么好用，开车、睡前都靠这个朗读听书打发时间，这里可以下载.*?】',
    '书友们之前用的小书亭\\s*已经挂了，现在基本上都在用.*?。',
    '推荐一个app，媲美旧版追书神器，可换源书籍全的.*?！',
    'mimiread',
    '咪咪阅读app',

    // 删除组合字符
    // https://en.wikipedia.org/wiki/Combining_character
    '[\\u0300-\\u036F\\u1AB0-\\u1AFF\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F]',

    // 起点新广告
    '本章未完，登录「起点读书」和书友一起读正版原文！新用户立享7天免费畅读，快来试试吧！（新设备新账号可享）',
    '本章未完，登錄「起點讀書」和書友一起讀正版原文！新用戶立享7天免費暢讀，快來試試吧！（新設備新賬號可享）',



    // 短文字替换
    // '\\[txt全集下载\\]',
    // '\\[\\s*超多好看小说\\]',
    // '⊙四⊙五⊙中⊙文☆→',
    // '\\[ads:本站换新网址啦，速记方法：.*?\\]',
    // '[》《｜～]无(?:.|&gt;)错(?:.|&gt;)小说',
    // '`无`错`小说`www.``com', '＋无＋错＋小说＋3w＋＋',
    // '\\|优\\|优\\|小\\|说\\|更\\|新\\|最\\|快Ｘ',
    // '▲∴', '8，ww←',
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

    // '谷[婸秇鯪鐰愱瞻桮袁狲梋荬瑏鐲惗钲鉦鮪歄鎣刬頲櫦磆]',
    '^谷[\\u4e00-\\u9fa5]{0,1}|谷[\\u4e00-\\u9fa5]{0,1}$',
    '^[。？！.?!]'
    
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

  // 正文内容标准化替换

  const replaceNormalize = {
      ',\\s*': '，',
      '\\.$': '。',
      '，$\\s|\\s^，': '，', // 合并每一行以"，"结束的段落
      '，+': '，',
      '"(.*?)"': '“$1”',
      '”“': '”\n“',
      '。([\\u4e00-\\u9fa5])': '。\n$1', // 将一段中的含多个句号的句子每句分为多段
      '(^.*?[.。])(“.*?”)': '$1\n$2', // 将一段中的第一句后接对话（引号）句子的第一句话分段
      '「(.*?)」': '“$1”',
      '『(.)』': '$1', // "『色』": "色",
      '┅{2,10}': '……',
      '。{3,7}': '……',
      '~{2,50}': '——',
      '…{3,40}': '……',
      '－{3,20}': '——'
  };

  // 不转换 ，？：；（）！
  const excludeCharCode = new Set([65292, 65311, 65306, 65307, 65288, 65289, 65281]);

  // 全角转半角
  function toCDB(str) {
      let tmp = '',
          charCode;
      for (let i = 0; i < str.length; i++) {
          charCode = str.charCodeAt(i);
          if (charCode > 65248 && charCode < 65375 && !excludeCharCode.has(charCode)) {
              tmp += String.fromCharCode(charCode - 65248);
          } else {
              tmp += str.charAt(i);
          }
      }
      return tmp
  }

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
    replace, replaceNormalize, replaceAll,

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
          this.doc = info.cloneNode ? doc.cloneNode(true) : doc;
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

          if (Setting.cn2tw) {
              bookTitle = this.convert2tw(bookTitle);
              chapterTitle = this.convert2tw(chapterTitle);
              docTitle = this.convert2tw(docTitle);
          }

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

          if (Setting.cn2tw) {
              text = this.convert2tw(text);
          }

          // try {
          //     text = this.contentCustomReplace(text);
          // } catch(ex) {
          //     console.error('自定义替换错误', ex);
          // }

          // 采用 DOM 方式进行处理
          var $div = $("<div>").html(text);

          // 尝试删除正文中的章节标题
          $div.find('h1, h2, h3').remove();

          if (this.info.useSiteFont) {
              // 删除 i 标签，通常用于自定义字体设置
              unwrapTag($div[0], 'i');
          }

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
          content = this.replaceText(content, Rule.replaceNormalize);
          content = toCDB(content);

          try {
              content = this.contentCustomReplace(content);
          } catch(ex) {
              C.error('自定义替换错误', ex);
          }

          const finalContents = content.split('\n');

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

  var tpl_preferencesHTML = "<form id=\"preferences\" name=\"preferences\">\r\n    <div id=\"setting_table1\">\r\n        <span id=\"top-buttons\">\r\n            <input title=\"部分选项需要刷新页面才能生效\" id=\"save_button\" value=\"√ 确认\" type=\"button\">\r\n            <input title=\"取消本次设定，所有选项还原\" id=\"close_button\" value=\"X 取消\" type=\"button\">\r\n        </span>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                界面语言<select id=\"lang\">\r\n                </select>\r\n            </label>\r\n            <label title=\"将小说网页文本转换为繁体。\\n\\n注意：内置的繁简转换表，只收录了简单的单字转换，启用本功能后，如有错误转换的情形，请利用脚本的自订字词取代规则来修正。\\n例如：「千里之外」，会错误转换成「千里之外」，你可以加入规则「千里之外=千里之外」来自行修正。\">\r\n                <input type=\"checkbox\" id=\"enable-cn2tw\" name=\"enable-cn2tw\"/>网页：转繁体\r\n            </label>\r\n            <label id=\"quietMode\" class=\"right\" title=\"隐藏其他，只保留正文，适用于全屏状态下\">\r\n                <input class=\"key\" type=\"button\" id=\"quietModeKey\"/>安静模式\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"不影响 booklink.me 的启用\">\r\n                <input type=\"checkbox\" id=\"disable-auto-launch\" name=\"disable-auto-launch\"/>强制手动启用\r\n            </label>\r\n            <label title=\"booklink.me 点击的网站强制启用\">\r\n                <input type=\"checkbox\" id=\"booklink-enable\" name=\"booklink-enable\"/>booklink 自动启用\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"debug\" name=\"debug\"/>调试模式\r\n            </label>\r\n            <a href=\"https://greasyfork.org/scripts/292-my-novel-reader/feedback\" target=\"_blank\">反馈地址</a>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"图片章节用夜间模式没法看，这个选项在启动时会自动切换到缺省皮肤\">\r\n                <input type=\"checkbox\" id=\"pic-nightmode-check\" name=\"pic-nightmode-check\"/>\r\n                夜间模式的图片章节检测\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"copyCurTitle\"/>\r\n                打开目录复制当前标题\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"通过快捷键切换\">\r\n                <input type=\"checkbox\" id=\"hide-menu-list\"/>隐藏左侧章节列表\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"hide-footer-nav\"/>隐藏底部导航栏\r\n            </label>\r\n            <label class=\"right\" title=\"导出之后的所有章节\">\r\n                <input type=\"button\" id=\"saveAsTxt\" value=\"存为 txt（测试）\" />\r\n                <input type=\"button\" id=\"speech\" value=\"朗读\" />\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                左侧导航栏切换快捷键：\r\n            </label>\r\n            <input class=\"key\" type=\"button\" id=\"setHideMenuListKey\" />\r\n            <label title=\"通过快捷键切换或在 Greasemonkey 用户脚本命令处打开设置窗口\">\r\n                <input type=\"checkbox\" id=\"hide-preferences-button\"/>隐藏设置按钮\r\n            </label>\r\n            <input class=\"key\" type=\"button\" id=\"openPreferencesKey\"/>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                打开朗读快捷键：\r\n            </label>\r\n            <input class=\"key\" type=\"button\" id=\"setOpenSpeechKey\" />\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                距离底部\r\n                <input type=\"textbox\" id=\"remain-height\" name=\"remain-height\" size=\"5\"/>\r\n                px 加载下一页\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"add-nextpage-to-history\"/>添加下一页到历史记录\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"enable-dblclick-pause\"/>双击暂停翻页\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label>\r\n                <select id=\"skin\">\r\n                </select>\r\n            </label>\r\n            <label>\r\n                字体\r\n                <input type=\"textbox\" id=\"font-family\" style=\"min-width:200px;\"/>\r\n            </label>\r\n            <br/><br/>\r\n            <label>\r\n                字体大小\r\n                <input type=\"textbox\" id=\"font-size\" name=\"font-size\" size=\"6\"/>\r\n            </label>\r\n            <label>\r\n                行高\r\n                <input type=\"textbox\" id=\"text_line_height\" size=\"6\"/>\r\n            </label>\r\n            <label>\r\n                行宽\r\n                <input type=\"textbox\" id=\"content_width\" size=\"6\"/>\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <label title=\"把一大块未分段的内容文本按照句号分段\">\r\n                <input type=\"checkbox\" id=\"split_content\"/>对一坨内容进行强制分段\r\n            </label>\r\n            <label>\r\n                <input type=\"checkbox\" id=\"scroll_animate\"/>章节直达滚动效果\r\n            </label>\r\n        </div>\r\n        <div class=\"form-row\">\r\n            <div class=\"prefs_title\">自定义样式</div>\r\n            <textarea id=\"extra_css\" class=\"prefs_textarea\" placeholder=\"自定义样式\"></textarea>\r\n        </div>\r\n    </div>\r\n    <div id=\"setting_table2\">\r\n        <div class=\"form-row\" title=\"详见脚本代码的 Rule.specialSite\">\r\n            <div class=\"prefs_title\">自定义站点规则</div>\r\n            <textarea id=\"custom_siteinfo\" class=\"prefs_textarea\" placeholder=\"自定义站点规则\" />\r\n        </div>\r\n        <div class=\"form-row\" title=\"一行一个，每行的第一个 = 为分隔符。\\n保存后生效\">\r\n            <div class=\"prefs_title\">自定义替换规则</div>\r\n            <textarea id=\"custom_replace_rules\" class=\"prefs_textarea\" placeholder=\"b[āà]ng=棒\" />\r\n        </div>\r\n    </div>\r\n</form>";

  var tpl_preferencesCSS = ".body {\r\n     color:#333;\r\n     margin: 0 auto;\r\n     background: white;\r\n     padding: 10px;\r\n     height: 420px;\r\n     overflow-y: auto;\r\n }\r\n #top-buttons {\r\n     background: none repeat scroll 0% 0% rgb(255, 255, 255);\r\n     display: block;\r\n     position: absolute;\r\n     top: -35px;\r\n     border-right: 12px solid rgb(224, 224, 224);\r\n     border-top: 12px solid rgb(224, 224, 224);\r\n     border-left: 12px solid rgb(224, 224, 224);\r\n     text-align: center;\r\n }\r\n input {\r\n     font-size: 12px;\r\n     margin-right: 3px;\r\n     vertical-align: middle;\r\n }\r\n .form-row {\r\n     overflow: hidden;\r\n     padding: 8px 12px;\r\n     margin-top: 3px;\r\n     font-size: 11px;\r\n }\r\n .form-row label {\r\n     padding-right: 10px;\r\n }\r\n .form-row input {\r\n     vertical-align: middle;\r\n     margin-top: 0px;\r\n }\r\n textarea, .form-row input {\r\n     padding: 2px 4px;\r\n     border: 1px solid #e5e5e5;\r\n     background: #fff;\r\n     border-radius: 4px;\r\n     color: #666;\r\n     -webkit-transition: all linear .2s;\r\n     transition: all linear .2s;\r\n }\r\n textarea {\r\n     width: 100%;\r\n     overflow: auto;\r\n     vertical-align: top;\r\n }\r\n textarea:focus, input:focus {\r\n     border-color: #99baca;\r\n     outline: 0;\r\n     background: #f5fbfe;\r\n     color: #666;\r\n }\r\n .prefs_title {\r\n     font-size: 12px;\r\n     font-weight: bold;\r\n }\r\n .prefs_textarea {\r\n     font-size: 12px;\r\n     margin-top: 5px;\r\n     height: 100px;\r\n }\r\n .right {\r\n    float: right;\r\n }";

  var Res = {
    CSS_MAIN: tpl_mainCss,

    preferencesHTML: tpl_preferencesHTML
        .uiTrans().replace(/\\n/g, '\n'),

    preferencesCSS: tpl_preferencesCSS,
  };

  var tpl_mainHtml = "<div id=\"container\">\r\n    <div id=\"menu-bar\" title=\"点击显示隐藏章节列表\"></div>\r\n    <div id=\"menu\">\r\n        <div id=\"header\" title=\"打开目录\">\r\n            <a href=\"{indexUrl}\" target=\"_blank\">{bookTitle}</a>\r\n        </div>\r\n        <div id=\"divider\"></div>\r\n        <ul id=\"chapter-list\" title=\"左键滚动，中键打开链接（无阅读模式）\">\r\n        </ul>\r\n    </div>\r\n    <div id=\"mynovelreader-content\"></div>\r\n    <div id=\"loading\" style=\"display:none\"></div>\r\n    <div id=\"preferencesBtn\">\r\n        <img style=\"width:16px\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABwklEQVRIibVVzWrCQBAeQk/bdk+bm0aWDQEPHtwVahdavLU9aw6KAQ+SQ86Sa19Aqu0T9NafSw8ttOgr1CewUB9CBL3Yy26x1qRp0A8GhsnO9yUzmxmAhKjX68cAMAeAufK3C875FQAsAWCp/O3CsqyhFlB+Oti2/cAYewrD8FDHarXahWEYUy1gGMbUdd1z/TwMw0PG2JNt2/ex5IyxR02CEJpIKbuEkJGOrRshZCSl7CKEJjrGGHuIFMjlcs9RZElNcWxGEAQHGONxWnKM8TgIgoPYMkkpL9MKqNx4xNX8LyOEvMeSq5uxMZlz3vN9v+D7foFz3os6V61Wz36QNhqNUyHENaV0CACLTUnFYvF6/WVUbJPIglI6FELctFqtMiT59Ha7TdcFVCxJ6XYs0Gw2T1SJBlsq0ZxSOhBC3Hied/QjSTUoqsn9lSb3o879avI61FXbzTUFACiXy7v70Tqdzj7G+COtwJ+jIpPJvKYl12ZZ1kucwJs+iBD6lFJ2TdOMHB2mab7/a1xXKpW9fD5/6zjO3erCcV33PMnCcRwnfuHEYXVlZrPZQWqiKJRKpe8Bt5Ol73leCQBmADBTfiJ8AebTYCRbI3BUAAAAAElFTkSuQmCC\"/>\r\n    </div>\r\n    <div id=\"alert\" style=\"display: none;\">\r\n        <p id=\"App-notice\"></p>\r\n    </div>\r\n\r\n    <div id=\"app\">\r\n\r\n    </div>\r\n</div>";

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

  const bus = new Vue();

  // 显示 语音朗读 对话框
  const SHOW_SPEECH = 'show-speech';

  const APPEND_NEXT_PAGE = 'appended_next_page';

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
    Reflect,
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
      const proxy = Reflect.construct(target, argumentsList, newTarget);
      proxies.set(proxy, argumentsList[0]);
      return proxy
    }
  });

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

  /** @enum {number} */
  const RequestStatus = {
    Idle: 0,
    Loading: 1,
    Finish: 2,
    Fail: 3
  };

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
    height:${unsafeWindow.innerHeight}px;
    border:0!important;
    margin:0!important;
    padding:0!important;
    visibility:hidden!important;
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
              // 等待 Dom 稳定
              await App$1.DomMutation();
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
              case Setting.getDisableAutoLaunch():
                  return false;
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
              if (!$('.readerbtn').length) {
                  await UI.addButton();
              }
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

          // 初始化 request
          App$1.initRequest();

          // 有些图片网站高度随着图片加载而变长
          setTimeout(App$1.scroll, 1000);

          App$1.cleanAgain();

          {
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
          if (App$1.request.display && Math.floor(App$1.getRemain() - unsafeWindow.innerHeight) < 0) {
              window.scrollTo(0, document.body.scrollHeight - window.innerHeight * 2 + 50);
          }
          if (!App$1.paused && !App$1.working && App$1.getRemain() < Setting.remain_height) {
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
      
          } else {
              App$1.request.hide();
              // App.$loading.html("<a href='" + App.curPageUrl  + "'>无法使用阅读模式，请手动点击下一页</a>").show();
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
              App$1.tmpDoc = htmlDoc;
              App$1.working = false;
              await App$1.scroll();

              // 预读图片
              var existSRC = {};
              $(App$1.tmpDoc).find('img').each(function() {
                  var isrc = $(this).attr('src');
                  if (!isrc || existSRC[isrc] || isrc.slice(0, 4).toLowerCase().startsWith('data')) {
                      return;
                  } else {
                      existSRC[isrc] = true;
                  }
                  var img = document.createElement('img');
                  img.src = isrc;
              });
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

              App$1.$loading.hide();
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

          {
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
          $form.find("#enable-cn2tw").get(0).checked = Setting.cn2tw;
          $form.find("#disable-auto-launch").get(0).checked = Setting.getDisableAutoLaunch();
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

          Setting.setDisableAutoLaunch($form.find("#disable-auto-launch").get(0).checked);

          Setting.cn2tw = $form.find("#enable-cn2tw").get(0).checked;
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
          Setting.hide_preferences_button = $form.find("#hide-preferences-button").get(0).checked;

          var css = $form.find("#extra_css").get(0).value;
          UI.refreshExtraStyle(css);
          Setting.extra_css = css;

          Setting.customSiteinfo = $form.find("#custom_siteinfo").get(0).value;

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

  var getBooleanConfig = function(configName, defaultValue) {
      var config = GM_getValue(configName);
      if(config === undefined) {
          GM_setValue(configName, defaultValue);
          config = defaultValue;
      }
      return config;
  };

  var Setting = {
      getDisableAutoLaunch: function() {  // 强制手动启用模式
          return getBooleanConfig("disable_auto_launch", false);
      },
      setDisableAutoLaunch: function(bool) {
          GM_setValue("disable_auto_launch", bool);
      },

      // 按键调用会遇到问题： Greasemonkey 访问违规：unsafeWindow 无法调用 GM_getValue
      // 故改成这种形式
      copyCurTitle: getBooleanConfig("copyCurTitle", true),
      setCopyCurTitle: function (bool) {
          this.copyCurTitle = !!bool;
          GM_setValue("copyCurTitle", !!bool);
      },

      get cn2tw() {
          if (_.isUndefined(this._cn2tw)) {
              this._cn2tw = getBooleanConfig('cn2tw', this.lang === 'zh-TW' ? true : false);
          }
          return this._cn2tw;
      },
      set cn2tw(bool) {
          GM_setValue('cn2tw', bool);
          this._cn2tw = bool;
      },

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
          UI.hideFooterNavStyle(bool);
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
