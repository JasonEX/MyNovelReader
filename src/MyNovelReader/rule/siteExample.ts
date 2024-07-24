// 小説閲讀腳本自定義站點規則説明

// 注意：除了 url 选项，其他的都是可选的
// 最好填一下siteName、exampleUrl，便于处理

/**
 * @author Paul-16098
 * @var 2024/7/24 19:57 UTC+8
 */
interface SiteRule {
  /**
   * 站點名
   * @author Paul-16098
   *
   * @type {?string}
   */
  siteName?: string;

  /**
   * 正文頁 URL 正則（必填）
   * @author Paul-16098
   *
   * @type {(string | RegExp)}
   */
  url: string | RegExp;

  /**
   * 章節正文 URL 示例
   * @author Paul-16098
   *
   * @type {?string}
   */
  exampleUrl?: string;

  // ===== 獲取書名、章節名 =====

  /**
   * 章節和書籍標題匹配正則（從網頁標題中獲取，最多兩個捕獲組）
   * @author Paul-16098
   *
   * @type {?RegExp}
   */
  titleReg?: RegExp;

  /**
   * 書籍標題位置（正則捕獲分組位置） 可選 0 或 1，默認為 0
   * @default 0
   * @author Paul-16098
   *
   * @type {?(0 | 1)}
   */
  titlePos?: 0 | 1;

  /**
   * 如果有 titleSelector 則覆蓋從 titleReg 中獲取的 *章節標題*
   * $doc = jQuery(document);
   * string=章節標題jQuery 選擇器
   * [string, string]:0=章節標題 jQuery 選擇器;1=章節標題淨化正則
   * Function=返回章節標題
   * @author Paul-16098
   *
   * @type {?(string|[string, string]|(($doc: JQuery<Document>) => string))}
   */
  titleSelector?:
    | string
    | [string, string]
    | (($doc: JQuery<Document>) => string);

  /**
   * 章節標題淨化正則
   * @author Paul-16098
   *
   * @type {?(string | RegExp)}
   */
  chapterTitleReplace?: string | RegExp;

  /**
   * $doc = jQuery(document);
   * string=章節標題jQuery 選擇器
   * [string, string]:0=章節標題 jQuery 選擇器;1=章節標題淨化正則
   * Function=返回章節標題
   * @author Paul-16098
   *
   * @type {?(string|[string, string]|(($doc: JQuery<Document>) => string))}
   */
  bookTitleSelector?:
    | string
    | [string, string]
    | (($doc: JQuery<Document>) => string);

  /**
   * 如果沒有 titleReg 和 bookTitleSelector 規則
   * 或這兩個規則都取不到標題，則 bookTitleReplace 可選以下形式的規則
   * >- key 是正則文本， value 是用於被替換為的內容
   * >- 多種形式混合，可嵌套數組
   *
   * @author Paul-16098
   *
   * @type {?(string|RegExp|{ key: string }|[string, RegExp, { key: string }])}
   */
  bookTitleReplace?:
    | string
    | RegExp
    | { key: string } //
    | [string, RegExp, { key: string }]; //

  // ===== 獲取書籍上一章、下一章、目錄頁的 URL =====
  /**
   * 別稱: prevUrl
   * $doc=JQuery(document)
   * string=上一章鏈接 jQuery 選擇器
   * Fn=返回上一章 URL
   * @author Paul-16098
   *
   * @type {?(string|(($doc: JQuery<Document>) => string))}
   */
  prevSelector?: string | (($doc: JQuery<Document>) => string);

  /**
   * 別稱: nextUrl
   * $doc=JQuery(document)
   * string=下一章鏈接 jQuery 選擇器
   * Fn=返回下一章 URL
   * @author Paul-16098
   *
   * @type {?(string|(($doc: JQuery<Document>) => string))}
   */
  nextSelector?: string | (($doc: JQuery<Document>) => string);

  /**
   * 別稱: indexUrl
   * string=目錄頁鏈接 jQuery 選擇器
   * Fn=返回目錄頁 URL
   * @author Paul-16098
   *
   * @type {?(string|(($doc: JQuery<Document>) => string))}
   */
  indexSelector?: string | (($doc: JQuery<Document>) => string);

  // ===== 獲取內容 =====
  /**
   * 延遲啓動時間，用於等待網頁加載完成，單位ms，如果有 mutationSelector 規則，則該選項無效
   * @author Paul-16098
   *
   * @type {?Number}
   */
  timeout?: Number;
  /**
   * 內容生成監視器，檢測到該節點的孩子數量發生變化就會觸發加載，使用 jQuery 選擇器
   * @author Paul-16098
   *
   * @type {?string}
   */
  mutationSelector?: string;
  /**
   * 節點孩子數量，小於等於該數字則認為需要等待內容生成
   * @author Paul-16098
   *
   * @type {?number}
   */
  mutationChildCount?: number;
  /**
   * 判斷文本，該節點如果含有該文本則認為需要等待內容生成
   * @author Paul-16098
   *
   * @type {?string}
   */
  mutationChildText?: string;
  /**
   * 檢查函數，確保內容生成後頁面中的其他元素已加載
   * $doc=JQuery(document)
   * @author Paul-16098
   *
   * @type {?(: JQuery<Document>) => any}
   */
  mutationCheck?: ($doc: JQuery<Document>) => any;
  /**
   * 使用 iframe 加載完整網頁，如果章節內容是動態加載的需要開啓
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  useiframe?: boolean;

  /**
   * 設置 iframe 的 sandbox 屬性
   * 詳見 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe#sandbox
   *
   * @author Paul-16098
   *
   * @type {?(undefined | string)}
   */
  iframeSandbox?: undefined | string;

  /**
   * 章節內容 jQuery 選擇器
   * @author Paul-16098
   *
   * @type {?string}
   */
  contentSelector?: string;
  /**
   * 是否檢查章節存在多頁，檢測到了會嘗試合併為一章
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  checkSection?: boolean;
  /**
   * 關閉多頁章節自動合併
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  noSection?: boolean;
  /**
   * 被移除元素的 jQuery 選擇器
   * @author Paul-16098
   *
   * @type {?string}
   */
  contentRemove?: string;
  /**
   * bool=當站點使用了靜態自定義字體（即原網頁文字顯示正常，但在閲讀模式下出現亂碼的情況）啓用
   * str=字體名（family），多個字體使用逗號分隔，需要在 style 規則中填寫 font-face 樣式
   * @author Paul-16098
   *
   * @type {?(boolean|string)}
   */
  useSiteFont?: boolean | string;

  /**
   * 正文內容淨化
   * >- { key: string } - key 是正則文本， value 是用於被替換為的內容
   * >- [string, RegExp, { key: string }] - 多種形式混合，可嵌套數組
   * @author Paul-16098
   *
   * @type {?(string|RegExp|{ key: string }|[string, RegExp, { key: string }])}
   */
  contentReplace?:
    | string
    | RegExp
    | { key: string }
    | [string, RegExp, { key: string }];

  /**
   * 是否對內容進行特殊處理，諸如拼音字修復等，諸如起點等網站可禁用，可提高處理性能
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  contentHandle?: boolean;
  /**
   * 使用原始內容，即完全關閉 handleContentText 內容處理函數，自定義替換規則也會被關閉，可提高處理性能
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  useRawContent?: boolean;

  /**
   * 克隆文檔後再進行處理，可以隔離處理過程中對文檔的影響，注意有些元素無法克隆
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  cloneNode?: boolean;
  /**
   * 發送請求時是否帶 Referer 協議頭
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  withReferer?: boolean;

  /**
   * this: Parser
   * 內容補丁，內容處理前（preProcessDoc）執行
   * @author Paul-16098
   *
   * @type {?($doc: JQuery<Document>) => any}
   */
  contentPatch?: ($doc: JQuery<Document>) => any;

  /**
   * this: Parser
   * 異步內容補丁，需要執行異步代碼時使用
   * @author Paul-16098
   *
   * @type {?($doc: JQuery<Document>) => Promise<any>}
   */
  contentPatchAsync?: ($doc: JQuery<Document>) => Promise<any>;

  /**
   * 獲取內容，返回html;僅當通用規則和站點規則都獲取不到內容時才調用
   * 二選一:{content:"章節內容html";html:"章節頁面html";}
   * @author Paul-16098
   *
   * @type {?($doc: JQuery<Document>) => Promise<{content?:string|html?:string}>}
   */
  getContent?: (
    $doc: JQuery<Document>
  ) => Promise<{ content?: "章節內容html"; html?: "章節頁面html" }>;

  /**
   * 內容處理函數;用於增加額外的內容處理邏輯
   * 返回HTML文本
   * $content: ?,
   * info: ?
   *
   * @author Paul-16098
   *
   * @type {?($content: any, info: any) => string}
   */
  handleContentText?: ($content: any, info: any) => string;

  // ===== 其他 =====
  /**
   * 下一章加載延遲時間，單位 ms
   * @author Paul-16098
   *
   * @type {?number}
   */
  nDelay?: number;
  /**
   * 自定義站點樣式， CSS 樣式
   * @author Paul-16098
   *
   * @type {?string}
   */
  style?: string;
  /**
   * 要排除的URL正則
   * @author Paul-16098
   *
   * @type {?string}
   */
  exclude?: string;
  /**
   * 快速啓動，不等待 DOM 變化完成
   * @author Paul-16098
   *
   * @type {?boolean}
   */
  fastboot?: boolean;

  /**
   * 每次頁面加載完成時調用，使用 iframe 請求完成時也會調用
   * this = 該站點規則 Object
   * $doc=JQuery(document)
   * @author Paul-16098
   *
   * @type {?(this: object, $doc: JQuery<Document>) => any}
   */
  startLaunch?: (this: object, $doc: JQuery<Document>) => any;

  /**
   * 進入閲讀模式時調用
   * this = 該站點規則 Object
   * $doc=JQuery(document)
   * @author Paul-16098
   *
   * @type {?(this: object, $doc: JQuery<Document>) => any}
   */
  startFilter?: (this: object, $doc: JQuery<Document>) => any;

  /**
   * 閲讀界面加載完成時調用
   * this = 該站點規則 Object
   * @author Paul-16098
   *
   * @type {?(this: object) => any}
   */
  fInit?: (this: object) => any;

  /**
   * 判斷是否Vip章節，如果是則不再繼續加載
   * 如果是Vip章節返回 true
   * @returns {Boolean}
   * @author Paul-16098
   *
   * @type {?(this: object, : JQuery<Document>) => boolean}
   */
  isVipChapter?: (this: object, $doc: JQuery<Document>) => boolean;
}
