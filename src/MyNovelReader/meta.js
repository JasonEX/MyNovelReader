// ==UserScript==
// @id             mynovelreader@ywzhaiqi@gmail.com
// @name           My Novel Reader
// @name:zh-CN     小说阅读脚本
// @name:zh-TW     小說閱讀腳本
// @version        6.6.8
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