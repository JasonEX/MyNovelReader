// ==UserScript==
// @id             mynovelreader@ywzhaiqi@gmail.com
// @name           My Novel Reader
// @name:zh-CN     小说阅读脚本
// @name:zh-TW     小說閱讀腳本
// @version        7.6.3
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

// @connect        *
// @connect        *://*.qidian.com/
// @connect        bgme.bid

// @match          *://vipreader.qidian.com/chapter/*/*
// @match          *://www.qdmm.com/BookReader/*,*.aspx
// @match          *://chuangshi.qq.com/read/bookreader/*.html*
// @match          *://chuangshi.qq.com/*bk/*/*-r-*.html*
// @match          *://yunqi.qq.com/*bk/*/*.html
// @match          *://dushu.qq.com/read.html?bid=*
// @match          *://www.jjwxc.net/onebook.php?novelid=*&chapterid=*
// @match          *://my.jjwxc.net/onebook_vip.php?novelid=*&chapterid=*
// @match          *://book.zongheng.com/chapter/*/*.html
// @match          *://www.xxsy.net/chapter/*.html
// @match          *://book.zhulang.com/*/*.html
// @match          *://www.17k.com/chapter/*/*.html
// @match          *://mm.17k.com/chapter/*/*.html
// @match          *://www.kanxia.net/k/*/*/*.html
// @match          *://www.xkzw.org/*/*.html
// @match          *://shouda8.com/*/*.html
// @match          *://novel.hongxiu.com/*/*/*.shtml
// @match          *://www.readnovel.com/novel/*.html
// @match          *://shushan.zhangyue.net/book/*/*/
// @match          *://weread.qq.com/web/reader/*
// @match          *://www.qimao.com/shuku/*-*/
// @match          *://www.qidian.com/chapter/*/*
// @match          *://m.qidian.com/chapter/*/*
// @match          *://www.tianyabook.com/*/*.html

// @match          *://tieba.baidu.com/p/*
// @match          *://booklink.me/*

// booklink.me
// @match          *://www.dudukan.net/html/*/*/*.html
// @match          *://www.tadu.com/book/*/*/
// @exclude        *://www.tadu.com/book/*/toc/
// @match          *://www.du00.com/read/*/*/*.html
// @match          *://www.50zw.com/book_*/*.html
// @match          *://www.wenxue8.org/html/*/*/*.html
// @match          *://www.bixia.org/book/*/*.html
// @match          *://www.67book.net/book/*/*.html
// @match          *://www.50zw.org/book/*/*.html
// @match          *://www.luoqiuzw.com/book/*/*.html
// @match          *://www.xiaoshuo.cc/*/*.html
// @match          *://www.tyue.net/*/*.html
// @match          *://www.biduoxs.com/biquge/*/*.html
// @match          *://www.aixswx.com/xs/*/*/*.html
// @match          *://www.wucuoxs.com/*/*.html
// @match          *://www.7017k.com/*/*.html
// @match          *://www.piaotianwenxue.com/book/*/*/*.html
// @match          *://www.txtshuku.org/so/*/*.html
// @match          *://www.wcxsw.org/*/*.html
// @match          *://www.min-yuan.com/book/*/*.html
// @match          *://www.tatajk.net/book/*/*.html
// @match          *://www.147xs.org/book/*/*.html
// @match          *://www.biqugeso.org/biquge_*/*.html


// 其它网站
// @match          *://book.sfacg.com/Novel/*/*/*/
// @match          *://www.ttzw.com/book/*/*.html
// @match          *://www.uukanshu.com/*/*/*.html
// @match          *://www.uukanshu.net/*/*/*.html
// @match          *://book.kanunu.org/*/*/*.html
// @match          *://www.kanunu8.com/book*/*.html
// @match          *://www.epzww.com/book/*/*
// @match          *://www.23us.cc/html/*/*/*.html
// @match          *://www.biqudu.com/*/*.html
// @match          *://www.biquge.la/book/*/*.html
// @match          *://www.biquge.tv/*/*.html
// @match          *://www.biquge5200.com/*/*.html
// @match          *://www.biqugezw.com/*/*.html
// @match          *://www.bequgezw.com/*/*/*.html
// @match          *://www.biqubao.com/book/*/*.html
// @match          *://www.biquwu.cc/biquge/*/*.html
// @match          *://www.qududu.com/book/*/*/*.html
// @match          *://www.moneyren.com/book/*/*/*.shtml
// @match          *://www.moksos.com/*/*/*.html
// @match          *://www.69zw.com/xiaoshuo/*/*/*.html
// @match          *://b.faloo.com/p/*/*.html
// @match          *://b.faloo.com/*_*.html
// @match          *://www.xstxt.com/*/*/
// @match          *://www.my285.com/*/*/*/*.htm
// @match          *://www.hjwzw.com/Book/Read/*,*
// @match          *://www.hjwzw.com/Book/Read/*_*
// @match          *://www.69shuba.com/txt/*/*
// @match          *://www.77nt.com/*/*.html
// @match          *://www.33yq.com/read/*/*/*.shtml
// @match          *://www.bqg5200.com/xiaoshuo/*/*/*.html
// @match          *://www.biquge5200.cc/*/*.html
// @match          *://read.qidian.com/chapter/*
// @match          *://www.ptwxz.com/html/*/*/*.html
// @match          *://www.miaobige.com/*/*/*.html
// @match          *://www.shuhai.com/read/*/*.html
// @match          *://www.23qb.com/book/*/*.html
// @match          *://www.lucifer-club.com/chapter-*-*.html
// @match          *://www.quanben.io/*/*/*.html
// @match          *://www.b5200.org/*/*.html
// @match          *://www.b5200.net/*/*.html
// @match          *://novel.tingroom.com/*/*/*.html
// @match          *://www.ciweimao.com/chapter/*
// @match          *://www.aixs.org/xs/*/*/*.html
// @match          *://m.zwduxs.com/*_*/*.html
// @match          *://www.23us.la/html/*/*/*.html
// @match          *://www.shuyaya.cc/read/*/*.html
// @match          *://www.69shu.la/69shu/*/*/*.html
// @match          *://www.xs52.com/xiaoshuo/*/*/*.html
// @match          *://www.ranwen.la/files/article/*/*/*.html
// @match          *://www.3xs.cc/*/*.html
// @match          *://www.nuanyuehanxing.com/*/*/*.html
// @match          *://www.gongzicp.com/read-*.html
// @match          *://www.duwanjuan.com/html/*/*/*.html
// @match          *://www.xs321.net/book/*/*/*.html
// @match          *://www.hetushu.com/book/*/*.html
// @match          *://www.zhaishuyuan.org/book/*/*.html
// @match          *://www.00ksw.com/html/*/*/*.html
// @match          *://www.99bxwx.com/b/*/*.html
// @match          *://www.81zw.com/book/*/*.html
// @match          *://www.biqu5200.net/*/*.html
// @match          *://www.biqusa.com/*/*.html
// @match          *://www.biququ.com/html/*/*.html
// @match          *://www.ddxs.com/*/*.html
// @match          *://www.biqugetv.com/*/*.html
// @match          *://www.feiazw.com/Html/*/*.html
// @match          *://www.xn--fiq228cu93a4kh.com/Html/*/*.html
// @match          *://www.555x.org/read/*/*.html
// @match          *://www.soxscc.net/*/*.html
// @match          *://www.kubiji.net/*/*.html
// @match          *://www.linovelib.com/novel/*/*.html
// @match          *://www.uuks.org/b/*/*.html
// @match          *://www.230book.net/book/*/*.html
// @match          *://www.exiaoshuo.com/*/*/
// @match          *://www.877zw.com/*/*.html
// @match          *://www.zhuixsw.com/*/*.html
// @match          *://www.ddxs.com/*/*.html
// @match          *://www.bqxs520.com/*/*.html
// @match          *://www.bidige.com/book/*/*.html
// @match          *://www.yushubo.com/read_*.html
// @match          *://www.bqwxg8.com/wenzhang/*/*/*.html
// @match          *://www.zpxsw.com/*/*.html
// @match          *://www.xbiqukan.com/book/*/*.html
// @match          *://www.51kanshu.cc/book/*/*.html
// @match          *://www.mibaoge.com/*/*.html
// @match          *://www.asxs.com/view/*/*.html
// @match          *://www.xinshuw.cc/*/*.html
// @match          *://www.yodu.org/book/*/*.html
// @match          *://www.fantuantanshu.com/*/*.html
// @match          *://www.tsxsw.net/html/*/*/*.html
// @match          *://www.xiaoshuting.org/book/*/*.html
// @match          *://www.xiaoshuting.la/*/*/*.html
// @match          *://www.xiaoshuting.cc/xiaoshuo/*/*/*.html
// @match          *://www.xiaoshuting.info/read/*/*/*.html
// @match          *://www.xiaoshutingapp.com/html/*/*.html
// @match          *://www.fantuankanshu.com/html/*/*/*.html
// @match          *://www.loubiqu.net/html/*/*.html
// @match          *://www.1200ksw.net/html/*/*/*.html
// @match          *://www.ranwena.net/files/article/*/*/*.html
// @match          *://www.biququ.info/html/*/*.html
// @match          *://www.fqxsw.org/html/*/*.html
// @match          *://www.fanqianxs.com/html/*/*.html
// @match          *://www.cxzww.com/read/*/*/*.html
// @match          *://www.mdwenxue.com/book/*/*/*.html
// @match          *://www.yyxs.la/html/*/*/*.html
// @match          *://www.slkslk.com/*/*/*/*.html
// @match          *://www.siluke.com/*/*/*/*.html
// @match          *://www.bqgxsydw.com/html/*/*/*.html
// @match          *://www.lingdiankanshu.com/html/*/*/*.html
// @match          *://www.beqege.cc/*/*.html
// @match          *://www.yqxsw.org/html/*/*/*.html
// @match          *://www.2kxiaoshuo.com/xiaoshuo/*/*/*.html
// @match          *://www.2kxs.la/xiaoshuo/*/*/*.html
// @match          *://www.156n.net/html/*/*/*.html
// @match          *://www.ahzww.org/*/*/*.html
// @match          *://www.31xs.org/*/*/*.html
// @match          *://www.31xs.net/*/*/*.html
// @match          *://www.01xs.com/xiaoshuo/*/*.html
// @match          *://www.biquge.name/html/*/*/*.html
// @match          *://www.yawenba.net/book/*/*.html
// @match          *://www.aiyueshuxiang.com/html/*/*.html
// @match          *://www.zhenhunxiaoshuo.com/*.html
// @match          *://www.360xs.com/mulu/*/*-*.html
// @match          *://www.yywenxuan.com/*/*.html
// @match          *://www.waptxt.com/*/*.html
// @match          *://www.5xw.net/*/*/*.html
// @match          *://www.23tr.com/book/*/*.html
// @match          *://www.gdbzkz.com/*/*.html
// @match          *://www.qb5.tw/book_*/*.html
// @match          *://www.5ycn.com/*/*/*.html
// @match          *://www.dldtxt.com/xs/*/*.html
// @match          *://www.67shu.net/book/*/*.html
// @match          *://www.ibiquge.net/*/*.html
// @match          *://www.xiashu9.com/book/*/*.html
// @match          *://zerifeisheng.com/book/*/*.html
// @match          *://quanxiaoshuo.com/*/*/
// @match          *://www.xbbshuwu.com/*/*.html
// @match          *://www.xygyhd.org/book/*/*.html
// @match          *://www.23xstxt.com/book/*/*/*.html
// @match          *://www.biqiudu.com/novel/*/*.html
// @match          *://www.shubaow.net/*/*.html
// @match          *://www.qingdou.la/*/*.html
// @match          *://www.kanshu5.net/*/*/*.html
// @match          *://www.15zw.net/xs/*/*/*.html
// @match          *://www.mayiwxw.com/*/*.html
// @match          *://www.bg3.co/novel/pagea/*.html
// @match          *://cn.bg3.co/novel/pagea/*.html
// @match          *://tw.bg3.co/novel/pagea/*.html
// @match          *://www.630shu.net/shu/*/*.html
// @match          *://www.lacebridal.net/chapter/*/*
// @match          *://www.xbyuan.com/*/*.html
// @match          *://mjjxs.net/chapter/*/*
// @match          *://mjjxs.com/chapter/*/*
// @match          *://wufangdao.com/html/*/*/*.html
// @match          *://www.jinghuashuge.cc/id/*/*.html
// @match          *://www.qbiqus.com/*/*.html
// @match          *://www.123duw.com/dudu-*/*/*.html
// @match          *://www.123du.vip/dudu-*/*/*.html
// @match          *://www.17yue.com/*/*.html
// @match          *://www.nuoqiu.com/*/*.html
// @match          *://www.dldxs.cc/xs/*/*.html
// @match          *://www.yawen8.com/*/*/*.html
// @match          *://www.bookxuan.org/book/*/*/*.html
// @match          *://www.shenmaxiaoshuo.com/book/*/*.html
// @match          *://www.dldxs.cc/xs/*/*.html
// @match          *://www.16kbook.org/book/*/*.html
// @match          *://www.1kanshu.com/html/*/*.html
// @match          *://www.dawenxue.net/*/*.html
// @match          *://www.tbxsww.com/html/*/*/*.html
// @match          *://www.33yq.org/read/*/*.shtml
// @match          *://www.3uxiaoshuo.com/xiaoshuo/*/*.html
// @match          *://www.zrfsxs.com/xiaoshuo/*/*.html
// @match          *://www.p2wt.com/htm/*/*.html
// @match          *://www.31xs.com/*/*/*.html
// @match          *://www.70sw.net/read/*/*/*.html
// @match          *://www.qisxs.com/*/*.html
// @match          *://www.611zw.com/books/*/*.html
// @match          *://www.bifengzw.com/read/*/*.html
// @match          *://www.ibiquges.com/*/*/*.html
// @match          *://www.zhsxs.com/zhsread/*.html
// @match          *://www.deqixs.com/xiaoshuo/*/*.html
// @match          *://www.gouzaixs.com/xiaoshuo/*/*.html
// @match          *://www.baba5.cc/*/*.html
// @match          *://www.fkxs.net/*/*.html
// @match          *://www.09k.net/kkb/*/*.html

// legado-webui
// @match          *://localhost:5000/bookshelf/*/*/

// 移动版
// @match          *://m.jjwxc.net/book2/*/*
// @match          *://m.jjwxc.com/book2/*/*
// @match          *://wap.jjwxc.net/book2/*/*
// @match          *://wap.jjwxc.com/book2/*/*
// @match          *://wap.jjwxc.com/vip/*/*?ctime=*
// @match          *://wap.jjwxc.com/vip/*/*
// @match          *://wap.jjwxc.net/vip/*/*
// @match          *://m.jjwxc.net/vip/*/*
// @match          *://m.jjwxc.com/vip/*/*
// @match          *://m.xindingdianxsw.com/*/*/*.html
// @match          *://m.123duw.com/dudu-*/*/*.html
// @match          *://m.123du.vip/dudu-*/*/*.html

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
