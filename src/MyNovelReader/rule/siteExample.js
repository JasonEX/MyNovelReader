// 自定义站点规则说明

// 注意：除了 url 选项，其他的都是可选的
// 最好填一下siteName、exampleUrl，便于处理

;({
    // 站点名
    siteName: '',
    // 正文页 URL 正则（必填）
    /* 二选一 */ url: '',
    url: / /,
    exampleUrl: '',// 章节正文URL示例

    // ===== 获取书名、章节名 =====

    titleReg: / /, // 章节和书籍标题匹配正则（从网页标题中获取，最多两个捕获组）
    titlePos: 0, // 书籍标题位置（正则捕获分组位置） 可选 0 或 1，默认为 0

    // 如果有 titleSelector 则覆盖从 titleReg 中获取的 * 章节标题 *

    /* 二选一 */ titleSelector: '', // 章节标题 jQuery 选择器
    titleSelector: [
        'selector', // 章节标题 jQuery 选择器
        'clearRegex' // 章节标题净化正则
    ],
    chapterTitleReplace: '', // 章节标题净化正则

    // 书籍标题
    /* 二选一 */ bookTitleSelector: '', // 书籍标题 jQuery 选择器
    bookTitleSelector: [
        'selector', // 书籍标题 jQuery 选择器
        'clearRegex' // 书籍标题净化正则
    ],
    bookTitleReplace: '', // 书籍标题净化正则

    // 如果没有 titleReg 和 bookTitleSelector 规则
    // 或这两个规则都取不到标题，则 bookTitleReplace 可选以下形式的规则
    bookTitleReplace: / /,
    bookTitleReplace: { key: 'value' }, // key 是正则文本， value 是用于被替换为的内容
    bookTitleReplace: ['', / /, { key: 'value' }], // 多种形式混合，可嵌套数组

    // ===== 获取书籍上一章、下一章、目录页的URL =====

    /* 二选一 */ prevSelector /* 或 prevUrl */: '', // 上一章链接 jQuery 选择器
    prevSelector /* 或 prevUrl */: function ($doc) {
        // $doc = $(document)
        return '' // 返回URL
    },

    /* 二选一 */ nextSelector /* 或 nextUrl */: '', // 下一章链接 jQuery 选择器
    nextSelector /* 或 nextUrl */: function ($doc) {
        // $doc = $(document)
        return '' // 返回URL
    },

    /* 二选一 */ indexSelector /* 或 indexUrl */: '', // 目录页链接 jQuery 选择器
    indexSelector /* 或 indexUrl */: function ($doc) {
        // $doc = $(document)
        return '' // 返回URL
    },

    // ===== 获取内容 =====

    timeout: 0, // 延迟启动时间，用于等待网页加载完成，单位ms，如果有 mutationSelector 规则，则该选项无效
    mutationSelector: '', // 内容生成监视器，检测到该节点的孩子数量发生变化就会触发加载，使用 jQuery 选择器
    mutationChildCount: 0, // 节点孩子数量，小于等于该数字则认为需要等待内容生成
    mutationChildText: '', // 判断文本，该节点如果含有该文本则认为需要等待内容生成

    useiframe: false, // 使用 iframe 加载完整网页，如果章节内容是动态加载的需要开启

    contentSelector: '', // 章节内容 jQuery 选择器
    checkSection: false, // 是否检查章节存在多页，检测到了会尝试合并为一章
    contentRemove: '', // 被移除元素的 jQuery 选择器

    useSiteFont: false, // 当站点使用了静态自定义字体（即原网页文字显示正常，但在阅读模式下出现乱码的情况）启用
    useSiteFont: '', // 字体名（family），多个字体使用逗号分隔，需要在 style 规则中填写 font-face 样式

    // 正文内容净化
    /* 四选一 */ contentReplace: '',
    contentReplace: / /,
    contentReplace: { key: 'value' }, // key 是正则文本， value 是用于被替换为的内容,
    contentReplace: ['', / /, { key: 'value' }], // 多种形式混合，可嵌套数组

    contentHandle: false, // 是否对内容进行特殊处理，诸如拼音字修复等，诸如起点等网站可禁用，可提高处理性能
    useRawContent: false, // 使用原始内容，即完全关闭 handleContentText 内容处理函数，自定义替换规则也会被关闭，可提高处理性能

    // 内容补丁，内容处理前（preProcessDoc）执行
    contentPatch: function ($doc) {
        // $doc = $(document)
        // this 是 App
    },
    // 异步内容补丁，需要执行异步代码时使用
    contentPatchAsync: async function ($doc) {
        // $doc = $(document)
        // this 是 App

    },
    // 获取内容，返回html
    getContent: async function ($doc) {
        // $doc = $(document)
        // this 是 Parser

        return {
            /* 二选一 */ content: '章节内容html',
            html: '章节页面html'
        }
    },

    // ===== 其他 =====

    nDelay: 0, // 下一章加载延迟时间，单位ms
    style: '', // 自定义站点样式， CSS 样式
    exclude: '', // 要排除的URL正则

    // 每次页面加载完成时调用
    startLaunch: function ($doc) {},
    // 正文内容加载完成时调用
    startFilter: function ($doc) {},
    // 阅读界面加载完成时调用
    fInit: function () {},
    // 判断是否Vip章节，如果是则不再继续加载
    isVipChapter: function ($doc) {
        // $doc = $(document)

        return true // 如果是Vip章节返回true
    }
})
