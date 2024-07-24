// 小説閲讀腳本自定義站點規則説明

// 注意：除了 url 选项，其他的都是可选的
// 最好填一下siteName、exampleUrl，便于处理

interface SiteRule {
  /* $doc = jQuery(document);
   */

  siteName?: string; // 站點名
  url: string | RegExp; // 正文頁 URL 正則（必填）
  exampleUrl?: string; // 章節正文 URL 示例

  // ===== 獲取書名、章節名 =====
  titleReg?: RegExp; // 章節和書籍標題匹配正則（從網頁標題中獲取，最多兩個捕獲組）
  titlePos?: 0 | 1; // 書籍標題位置（正則捕獲分組位置） 可選 0 或 1，默認為 0

  // 如果有 titleSelector 則覆蓋從 titleReg 中獲取的 * 章節標題 *
  titleSelector?:
    | string
    | [string, string] // 0:章節標題 jQuery 選擇器;1:章節標題淨化正則
    | (($doc: JQuery<Document>) => string); // 返回章節標題

  chapterTitleReplace?: string | RegExp;

  bookTitleSelector?:
    | string
    | [string, string] // 0:書籍標題 jQuery 選擇器;1:書籍標題淨化正則
    | (($doc: JQuery<Document>) => string); // 返回書籍標題;

  // 如果没有 titleReg 和 bookTitleSelector 规则
  // 或这两个规则都取不到标题，则 bookTitleReplace 可选以下形式的规则
  bookTitleReplace?:
    | string
    | RegExp
    | { key: string } // key 是正则文本， value 是用于被替换为的内容
    | [string, RegExp, { key: string }]; // 多种形式混合，可嵌套数组

  // ===== 获取书籍上一章、下一章、目录页的 URL =====
  prevSelector /* 或 prevUrl */?:
    | string // 上一章链接 jQuery 选择器
    | (($doc: JQuery<Document>) => string); // 返回上一章 URL

  nextSelector /* 或 nextUrl */?:
    | string // 下一章链接 jQuery 选择器
    | (($doc: JQuery<Document>) => string); // 返回下一章 URL

  indexSelector /* 或 indexUrl */?:
    | string // 目录页链接 jQuery 选择器
    | (($doc: JQuery<Document>) => string); // 返回目录页 URL

  // ===== 获取内容 =====
  timeout?: Number; // 延迟启动时间，用于等待网页加载完成，单位ms，如果有 mutationSelector 规则，则该选项无效
  mutationSelector?: string; // 内容生成监视器，检测到该节点的孩子数量发生变化就会触发加载，使用 jQuery 选择器
  mutationChildCount?: number; // 节点孩子数量，小于等于该数字则认为需要等待内容生成
  mutationChildText?: string; // 判断文本，该节点如果含有该文本则认为需要等待内容生成
  mutationCheck?: ($doc: JQuery<Document>) => any; // 检查函数，确保内容生成后页面中的其他元素已加载
  useiframe?: boolean; // 使用 iframe 加载完整网页，如果章节内容是动态加载的需要开启

  // 设置 iframe 的 sandbox 属性，详见 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe#attr-sandbox
  iframeSandbox?: undefined | string;

  contentSelector?: string; // 章节内容 jQuery 选择器
  checkSection?: boolean; // 是否检查章节存在多页，检测到了会尝试合并为一章
  noSection?: boolean; // 关闭多页章节自动合并
  contentRemove?: string; // 被移除元素的 jQuery 选择器
  useSiteFont?:
    | boolean // 当站点使用了静态自定义字体（即原网页文字显示正常，但在阅读模式下出现乱码的情况）启用
    | string; // 字体名（family），多个字体使用逗号分隔，需要在 style 规则中填写 font-face 样式

  // 正文内容净化
  contentReplace?:
    | string
    | RegExp
    | { key: string } // key 是正则文本， value 是用于被替换为的内容
    | [string, RegExp, { key: string }]; // 多种形式混合，可嵌套数组

  contentHandle?: boolean; // 是否对内容进行特殊处理，诸如拼音字修复等，诸如起点等网站可禁用，可提高处理性能
  useRawContent?: boolean; // 使用原始内容，即完全关闭 handleContentText 内容处理函数，自定义替换规则也会被关闭，可提高处理性能

  cloneNode?: boolean; // 克隆文档后再进行处理，可以隔离处理过程中对文档的影响，注意有些元素无法克隆
  withReferer?: boolean; // 发送请求时是否带 Referer 协议头

  // 内容补丁，内容处理前（preProcessDoc）执行
  contentPatch?: (this: "Parser", $doc: JQuery<Document>) => any;

  // 异步内容补丁，需要执行异步代码时使用
  contentPatchAsync?: (this: "Parser", $doc: JQuery<Document>) => Promise<any>;

  // 获取内容，返回html;仅当通用规则和站点规则都获取不到内容时才调用
  getContent?: (
    this: "Parser",
    $doc: JQuery<Document>
  ) => Promise<{
    /* 二选一 */ content?: "章节内容html";
    html?: "章节页面html";
  }>;

  // 内容处理函数;用于增加额外的内容处理逻辑
  handleContentText?: ($content: any, info: any) => string; // 返回HTML文本

  // ===== 其他 =====
  nDelay?: number; // 下一章加载延迟时间，单位 ms
  style?: string; // 自定义站点样式， CSS 样式
  exclude?: string; // 要排除的URL正则
  fastboot?: boolean; // 快速启动，不等待 DOM 变化完成

  // 每次页面加载完成时调用，使用 iframe 请求完成时也会调用
  startLaunch?: (this: object, $doc: JQuery<Document>) => any;

  // 进入阅读模式时调用
  startFilter?: (this: object, $doc: JQuery<Document>) => any;

  // 阅读界面加载完成时调用
  fInit?: (this: object) => any;

  // 判断是否Vip章节，如果是则不再继续加载
  isVipChapter?: (this: object, $doc: JQuery<Document>) => boolean; // 如果是Vip章节返回 true
}
