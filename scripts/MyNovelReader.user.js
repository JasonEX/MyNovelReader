// ==UserScript==
// @id             mynovelreader@ywzhaiqi@gmail.com
// @name           My Novel Reader
// @name:zh-CN     小说阅读脚本
// @name:zh-TW     小說閱讀腳本
// @version        9.0.0
// @namespace      https://github.com/ywzhaiqi
// @author         ywzhaiqi
// @description    小说阅读脚本，统一阅读样式，内容去广告、修正拼音字、段落整理，自动下一页
// @license        GPL version 3
// @homepageURL    https://greasyfork.org/scripts/292/
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_openInTab
// @grant          GM_setClipboard
// @grant          GM_registerMenuCommand
// @grant          GM_info
// @grant          unsafeWindow
// @connect        *
// @match          *://*/*.html
// @match          *://*/*.htm
// @match          *://*/*.shtml
// @match          *://*/*/*.html
// @match          *://*/*/*/*.html
// @match          *://*/*/*/*/*.html
// @match          *://*/*.php?*
// @match          *://*/txt/*/*
// @match          *://*/book/*/*
// @match          *://*/read/*/*
// @match          *://*/chapter/*/*
// @match          *://*/novel/*/*
// @match          *://www.qidian.com/chapter/*/*
// @match          *://m.qidian.com/chapter/*/*
// @match          *://read.qidian.com/chapter/*
// @match          *://vipreader.qidian.com/chapter/*/*
// @match          *://book.zongheng.com/chapter/*/*.html
// @match          *://read.zongheng.com/chapter/*/*.html
// @match          *://www.17k.com/chapter/*/*.html
// @match          *://www.jjwxc.net/onebook.php?*
// @match          *://my.jjwxc.net/onebook_vip.php?*
// @match          *://book.sfacg.com/Novel/*/*/*/
// @match          *://weread.qq.com/web/reader/*
// @match          *://www.tadu.com/book/*/*/
// @match          *://tieba.baidu.com/p/*
// @match          *://masiro.me/admin/novelReading*
// @exclude        *://*/*/index.html
// @exclude        *://*/*/list.html
// @exclude        *://*/search/*
// @exclude        *://*/login*
// @exclude        *://www.tadu.com/book/*/toc/
// ==/UserScript==
(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode(".mnr-prompt-overlay[data-v-333f72bb]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px}.mnr-prompt-card[data-v-333f72bb]{background:#fff;border-radius:12px;box-shadow:0 4px 24px #00000026;max-width:360px;width:100%;padding:20px;animation:mnr-slide-up-333f72bb .3s ease-out}@keyframes mnr-slide-up-333f72bb{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.mnr-prompt-header[data-v-333f72bb]{display:flex;align-items:center;gap:12px;margin-bottom:16px}.mnr-prompt-icon[data-v-333f72bb]{font-size:28px}.mnr-prompt-title[data-v-333f72bb]{margin:0;font-size:18px;font-weight:600;color:#333}.mnr-confidence[data-v-333f72bb]{margin-bottom:16px}.mnr-confidence-bar[data-v-333f72bb]{height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-bottom:6px}.mnr-confidence-fill[data-v-333f72bb]{height:100%;border-radius:3px;transition:width .3s ease}.mnr-confidence-fill.high[data-v-333f72bb]{background:#4caf50}.mnr-confidence-fill.medium[data-v-333f72bb]{background:#ff9800}.mnr-confidence-fill.low[data-v-333f72bb]{background:#f44336}.mnr-confidence-text[data-v-333f72bb]{font-size:13px;color:#666}.mnr-results[data-v-333f72bb]{list-style:none;padding:0;margin:0 0 16px}.mnr-result-item[data-v-333f72bb]{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:14px}.mnr-result-item.success[data-v-333f72bb]{color:#2e7d32}.mnr-result-item.warning[data-v-333f72bb]{color:#ed6c02}.mnr-result-icon[data-v-333f72bb]{font-weight:700}.mnr-checkbox-label[data-v-333f72bb]{display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 0;font-size:14px;color:#555;border-top:1px solid #eee;margin-bottom:16px}.mnr-checkbox[data-v-333f72bb]{width:18px;height:18px;cursor:pointer;accent-color:#1976d2}.mnr-prompt-actions[data-v-333f72bb]{display:flex;gap:12px}.mnr-btn[data-v-333f72bb]{flex:1;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all .2s ease}.mnr-btn-secondary[data-v-333f72bb]{background:#f5f5f5;color:#666}.mnr-btn-secondary[data-v-333f72bb]:hover{background:#e0e0e0}.mnr-btn-primary[data-v-333f72bb]{background:#1976d2;color:#fff}.mnr-btn-primary[data-v-333f72bb]:hover{background:#1565c0}.mnr-fade-enter-active[data-v-333f72bb],.mnr-fade-leave-active[data-v-333f72bb]{transition:opacity .3s ease}.mnr-fade-enter-from[data-v-333f72bb],.mnr-fade-leave-to[data-v-333f72bb]{opacity:0}@media(prefers-color-scheme:dark){.mnr-prompt-card[data-v-333f72bb]{background:#2a2a2a}.mnr-prompt-title[data-v-333f72bb]{color:#e0e0e0}.mnr-confidence-bar[data-v-333f72bb]{background:#444}.mnr-confidence-text[data-v-333f72bb]{color:#aaa}.mnr-checkbox-label[data-v-333f72bb]{color:#bbb;border-top-color:#444}.mnr-btn-secondary[data-v-333f72bb]{background:#3a3a3a;color:#ccc}.mnr-btn-secondary[data-v-333f72bb]:hover{background:#4a4a4a}}@media(max-width:480px){.mnr-prompt-card[data-v-333f72bb]{padding:16px;margin:8px}.mnr-prompt-title[data-v-333f72bb]{font-size:16px}.mnr-btn[data-v-333f72bb]{padding:12px 16px}}.mnr-progress[data-v-bc314d2a]{position:fixed;top:0;left:0;right:0;height:3px;z-index:1000;transition:opacity .3s ease}.mnr-progress.hidden[data-v-bc314d2a]{opacity:0}.mnr-progress-bar[data-v-bc314d2a]{height:100%;background:linear-gradient(90deg,#1976d2,#42a5f5);transition:width .1s ease-out}.mnr-progress-text[data-v-bc314d2a]{position:absolute;right:8px;top:8px;background:#000000b3;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.mnr-settings-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;z-index:1000;display:flex;justify-content:flex-end}.mnr-settings-panel{width:100%;max-width:360px;height:100%;background:var(--mnr-bg, #fff);display:flex;flex-direction:column;box-shadow:-4px 0 20px #00000026}.mnr-settings-header{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-settings-header h3{margin:0;font-size:18px;color:var(--mnr-text, #333)}.mnr-shortcut-hint{margin-left:auto;margin-right:12px;padding:2px 8px;background:var(--mnr-border, #e0e0e0);border-radius:4px;font-size:12px;font-family:monospace;color:var(--mnr-text, #666)}.mnr-close-btn{background:none;border:none;font-size:20px;cursor:pointer;padding:4px 8px;color:var(--mnr-text, #666)}.mnr-settings-content{flex:1;overflow:auto;padding:16px}.mnr-settings-section{margin-bottom:24px}.mnr-settings-section h4{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--mnr-text, #555)}.mnr-theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mnr-theme-btn{padding:12px 8px;border:2px solid transparent;border-radius:8px;cursor:pointer;font-size:13px;transition:all .2s ease}.mnr-theme-btn.active{border-color:#1976d2}.mnr-slider-row{display:flex;align-items:center;gap:12px}.mnr-slider-label{width:24px;text-align:center;color:var(--mnr-text, #666)}.mnr-slider{flex:1;height:4px;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--mnr-border, #e0e0e0);border-radius:2px}.mnr-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#1976d2;border-radius:50%;cursor:pointer}.mnr-slider-value{width:50px;text-align:right;font-size:13px;color:var(--mnr-text, #666)}.mnr-select{width:100%;padding:10px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);font-size:14px}.mnr-segmented-control{display:flex;border:1px solid var(--mnr-border, #ddd);border-radius:8px;overflow:hidden}.mnr-segment{flex:1;padding:10px 16px;border:none;background:var(--mnr-bg, #fff);color:var(--mnr-text, #666);font-size:14px;cursor:pointer;transition:all .2s ease}.mnr-segment:not(:last-child){border-right:1px solid var(--mnr-border, #ddd)}.mnr-segment:hover{background:var(--mnr-border, #f0f0f0)}.mnr-segment.active{background:#1976d2;color:#fff}.mnr-hint{margin-top:8px;font-size:12px;color:var(--mnr-text, #888);opacity:.8}.mnr-switch-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer;color:var(--mnr-text, #333)}.mnr-switch-row input{width:40px;height:22px;accent-color:#1976d2}.mnr-action-buttons{display:flex;flex-direction:column;gap:8px}.mnr-action-btn{width:100%;padding:12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);font-size:14px;cursor:pointer}.mnr-action-btn:hover{background:var(--mnr-border, #f5f5f5)}.mnr-slide-enter-active,.mnr-slide-leave-active{transition:all .3s ease}.mnr-slide-enter-from,.mnr-slide-leave-to{opacity:0}.mnr-slide-enter-from .mnr-settings-panel,.mnr-slide-leave-to .mnr-settings-panel{transform:translate(100%)}@media(max-width:480px){.mnr-settings-panel{max-width:100%}.mnr-theme-grid{grid-template-columns:repeat(2,1fr)}}.mnr-picker-overlay[data-v-6493a95a]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;pointer-events:none}.mnr-picker-highlight[data-v-6493a95a]{position:fixed;border:2px solid #1976d2;background:#1976d21a;pointer-events:none;transition:all .05s ease;box-sizing:border-box;z-index:999999}.mnr-picker-tooltip[data-v-6493a95a]{position:fixed;background:#333;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;font-family:monospace;max-width:400px;pointer-events:none;z-index:1000000;box-shadow:0 2px 8px #0000004d}.mnr-picker-tag[data-v-6493a95a]{color:#90caf9;margin-bottom:4px}.mnr-picker-selector[data-v-6493a95a]{color:#a5d6a7;word-break:break-all}.mnr-picker-controls[data-v-6493a95a]{position:fixed;bottom:20px;left:50%;transform:translate(-50%);background:#1976d2;color:#fff;padding:12px 20px;border-radius:8px;display:flex;align-items:center;gap:16px;font-size:14px;pointer-events:auto;box-shadow:0 4px 12px #0000004d}.mnr-picker-label[data-v-6493a95a]{font-weight:600}.mnr-picker-hint[data-v-6493a95a]{opacity:.8;font-size:12px}.mnr-picker-cancel[data-v-6493a95a]{background:#fff3;border:none;color:#fff;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px}.mnr-picker-cancel[data-v-6493a95a]:hover{background:#ffffff4d}@media(max-width:480px){.mnr-picker-controls[data-v-6493a95a]{left:10px;right:10px;transform:none;flex-wrap:wrap;justify-content:center}}.mnr-selector-preview[data-v-31cda065]{background:var(--mnr-border, #f8f9fa);border-radius:8px;padding:12px;margin-bottom:12px}.mnr-preview-header[data-v-31cda065]{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.mnr-preview-label[data-v-31cda065]{font-size:13px;font-weight:600;color:var(--mnr-text, #555)}.mnr-preview-actions[data-v-31cda065]{display:flex;gap:4px}.mnr-preview-btn[data-v-31cda065]{background:none;border:1px solid var(--mnr-border, #ddd);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;color:var(--mnr-text, #666)}.mnr-preview-btn[data-v-31cda065]:hover:not(:disabled){opacity:.8}.mnr-preview-btn[data-v-31cda065]:disabled{opacity:.5;cursor:not-allowed}.mnr-preview-btn.mnr-btn-active[data-v-31cda065]{background:var(--mnr-link, #1976d2);color:#fff;border-color:var(--mnr-link, #1976d2)}.mnr-preview-input-row[data-v-31cda065]{margin-bottom:8px}.mnr-preview-input[data-v-31cda065]{width:100%;padding:8px 10px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-size:13px;font-family:monospace;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-preview-input[data-v-31cda065]:focus{outline:none;border-color:var(--mnr-link, #1976d2)}.mnr-preview-selector[data-v-31cda065]{font-family:monospace;font-size:13px;color:var(--mnr-text, #666)}.mnr-preview-match[data-v-31cda065]{font-size:12px;padding:6px 10px;border-radius:4px;margin-bottom:8px}.mnr-preview-match.success[data-v-31cda065]{background:#e8f5e9;color:#2e7d32}.mnr-preview-match.warning[data-v-31cda065]{background:#fff3e0;color:#e65100}.mnr-preview-match.error[data-v-31cda065]{background:#ffebee;color:#c62828}.mnr-preview-content[data-v-31cda065]{border-top:1px solid var(--mnr-border, #e0e0e0);padding-top:8px}.mnr-preview-content-header[data-v-31cda065]{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mnr-text, #666);margin-bottom:6px}.mnr-preview-expand[data-v-31cda065]{background:none;border:none;color:var(--mnr-link, #1976d2);cursor:pointer;font-size:12px}.mnr-preview-text[data-v-31cda065]{font-size:12px;line-height:1.5;color:var(--mnr-text, #444);max-height:80px;overflow:hidden;background:var(--mnr-bg, #fff);padding:8px;border-radius:4px;border:1px solid var(--mnr-border, #e0e0e0)}.mnr-preview-text.expanded[data-v-31cda065]{max-height:300px;overflow:auto}.mnr-highlight-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999998}.mnr-highlight-box{border:3px solid #4caf50;background:#4caf5026;box-sizing:border-box;transition:all .15s ease}.mnr-highlight-label{position:absolute;top:-24px;left:0;background:#4caf50;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:4px 4px 0 0;font-family:sans-serif}.mnr-rule-editor[data-v-2f6fea54]{display:flex;flex-direction:column;height:100%;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);transition:opacity .2s ease,transform .2s ease}.mnr-rule-editor.mnr-editor-hidden[data-v-2f6fea54]{opacity:0;pointer-events:none;transform:translate(-100%)}.mnr-editor-header[data-v-2f6fea54]{position:relative;padding:16px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-editor-title[data-v-2f6fea54]{margin:0 0 12px;font-size:18px;font-weight:600;color:var(--mnr-text, #333)}.mnr-shortcut-hint[data-v-2f6fea54]{position:absolute;top:16px;right:16px;padding:2px 8px;background:var(--mnr-border, #e0e0e0);border-radius:4px;font-size:12px;font-family:monospace;color:var(--mnr-text, #666)}.mnr-editor-tabs[data-v-2f6fea54]{display:flex;gap:4px}.mnr-tab-btn[data-v-2f6fea54]{padding:8px 16px;background:var(--mnr-border, #f5f5f5);border:none;border-radius:6px;cursor:pointer;font-size:14px;color:var(--mnr-text, #666)}.mnr-tab-btn.active[data-v-2f6fea54]{background:var(--mnr-link, #1976d2);color:#fff}.mnr-editor-content[data-v-2f6fea54]{flex:1;overflow:auto;padding:16px}.mnr-form-section[data-v-2f6fea54]{margin-bottom:24px}.mnr-section-title[data-v-2f6fea54]{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--mnr-text, #333);padding-bottom:8px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-form-group[data-v-2f6fea54]{margin-bottom:16px}.mnr-form-group label[data-v-2f6fea54]{display:block;margin-bottom:6px;font-size:13px;font-weight:500;color:var(--mnr-text, #555)}.mnr-form-group input[data-v-2f6fea54],.mnr-form-group textarea[data-v-2f6fea54]{width:100%;padding:10px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-size:14px;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-form-group input[data-v-2f6fea54]:focus,.mnr-form-group textarea[data-v-2f6fea54]:focus{outline:none;border-color:var(--mnr-link, #1976d2)}.mnr-hint[data-v-2f6fea54]{display:block;margin-top:4px;font-size:12px;color:var(--mnr-text, #888);opacity:.7}.mnr-checkbox-row[data-v-2f6fea54]{display:flex;align-items:center;gap:8px;padding:8px 0;cursor:pointer}.mnr-checkbox-row input[data-v-2f6fea54]{width:18px;height:18px}.mnr-code-toolbar[data-v-2f6fea54]{display:flex;gap:8px;margin-bottom:8px}.mnr-format-select[data-v-2f6fea54]{padding:6px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:4px;font-size:13px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-toolbar-btn[data-v-2f6fea54]{padding:6px 12px;background:var(--mnr-border, #f5f5f5);border:1px solid var(--mnr-border, #ddd);border-radius:4px;cursor:pointer;font-size:13px;color:var(--mnr-text, #333)}.mnr-toolbar-btn[data-v-2f6fea54]:hover{opacity:.8}.mnr-code-editor[data-v-2f6fea54]{width:100%;min-height:400px;padding:12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-family:Fira Code,Monaco,monospace;font-size:13px;line-height:1.5;resize:vertical;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-code-error[data-v-2f6fea54]{margin-top:8px;padding:8px 12px;background:#ffebee;color:#c62828;border-radius:4px;font-size:13px}.mnr-hook-editor[data-v-2f6fea54],.mnr-css-editor[data-v-2f6fea54]{min-height:100px;font-family:Fira Code,Monaco,monospace;font-size:13px;line-height:1.5}.mnr-editor-footer[data-v-2f6fea54]{display:flex;justify-content:flex-end;gap:12px;padding:16px;border-top:1px solid var(--mnr-border, #e0e0e0)}.mnr-btn[data-v-2f6fea54]{padding:10px 20px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;border:none}.mnr-btn-secondary[data-v-2f6fea54]{background:var(--mnr-border, #f5f5f5);color:var(--mnr-text, #666)}.mnr-btn-primary[data-v-2f6fea54]{background:var(--mnr-link, #1976d2);color:#fff}.mnr-btn-primary[data-v-2f6fea54]:disabled{opacity:.5;cursor:not-allowed}.mnr-reader[data-v-a7eac65f]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:var(--mnr-bg, #ffffff);color:var(--mnr-text, #1a1a1a);overflow:hidden;display:flex;flex-direction:column}.mnr-reader-header[data-v-a7eac65f]{position:relative;z-index:10;display:flex;align-items:center;padding:12px 16px;background:inherit;border-bottom:1px solid var(--mnr-border, #e5e5e5);transition:transform .3s ease,opacity .3s ease}.mnr-reader-header.hidden[data-v-a7eac65f]{transform:translateY(-100%);opacity:0;position:absolute;width:100%}.mnr-header-left[data-v-a7eac65f],.mnr-header-right[data-v-a7eac65f]{width:48px}.mnr-header-center[data-v-a7eac65f]{flex:1;text-align:center;overflow:hidden}.mnr-header-btn[data-v-a7eac65f]{width:40px;height:40px;border:none;background:transparent;font-size:20px;cursor:pointer;color:var(--mnr-text, #333);border-radius:8px}.mnr-header-btn[data-v-a7eac65f]:hover{background:var(--mnr-border, #e0e0e0)}.mnr-chapter-title[data-v-a7eac65f]{margin:0;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--mnr-text, #333)}.mnr-book-title[data-v-a7eac65f]{font-size:12px;color:var(--mnr-text, #666);opacity:.7}.mnr-reader-main[data-v-a7eac65f]{flex:1;overflow:auto;padding-bottom:40px}.mnr-reader-content[data-v-a7eac65f]{max-width:var(--mnr-max-width, 800px);margin:0 auto;padding:var(--mnr-padding, 20px);font-family:var(--mnr-font-family, system-ui);font-size:var(--mnr-font-size, 18px);line-height:var(--mnr-line-height, 1.8);letter-spacing:var(--mnr-letter-spacing, .05em)}.mnr-reader-content[data-v-a7eac65f] p{text-indent:var(--mnr-paragraph-indent, 2em);margin:0 0 1em}.mnr-reader-content[data-v-a7eac65f] img{max-width:100%;height:auto;display:block;margin:1em auto}.mnr-reader-content[data-v-a7eac65f] a{color:var(--mnr-link, #1976d2)}.mnr-chapter-separator[data-v-a7eac65f]{display:flex;align-items:center;justify-content:center;gap:16px;max-width:var(--mnr-max-width, 800px);margin:40px auto;padding:0 20px}.mnr-separator-line[data-v-a7eac65f]{flex:1;height:1px;background:var(--mnr-border, #e0e0e0)}.mnr-separator-title[data-v-a7eac65f]{font-size:16px;font-weight:600;color:var(--mnr-text, #333);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%}.mnr-chapter-end[data-v-a7eac65f]{max-width:var(--mnr-max-width, 800px);margin:0 auto;padding:40px 20px;text-align:center}.mnr-chapter-end-text[data-v-a7eac65f]{color:var(--mnr-text, #666);opacity:.7;margin-bottom:16px}.mnr-chapter-nav[data-v-a7eac65f]{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}.mnr-chapter-link[data-v-a7eac65f]{padding:12px 24px;color:var(--mnr-link, #1976d2);text-decoration:none;border:1px solid var(--mnr-border, #e0e0e0);border-radius:8px;transition:all .2s ease}.mnr-chapter-link[data-v-a7eac65f]:hover{background:var(--mnr-border, #f0f0f0)}.mnr-loading-prev[data-v-a7eac65f],.mnr-loading-next[data-v-a7eac65f]{display:flex;align-items:center;justify-content:center;gap:12px;padding:24px;color:var(--mnr-text, #666)}.mnr-loading-spinner.small[data-v-a7eac65f]{width:24px;height:24px;border:2px solid var(--mnr-border, #e0e0e0);border-top-color:var(--mnr-link, #1976d2);border-radius:50%;animation:mnr-spin-a7eac65f 1s linear infinite}.mnr-loading-overlay[data-v-a7eac65f]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#fff;z-index:1000}.mnr-loading-spinner[data-v-a7eac65f]{width:40px;height:40px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:mnr-spin-a7eac65f 1s linear infinite}@keyframes mnr-spin-a7eac65f{to{transform:rotate(360deg)}}.mnr-error-toast[data-v-a7eac65f]{position:fixed;bottom:24px;left:50%;transform:translate(-50%);background:#d32f2f;color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;cursor:pointer;z-index:1001;animation:mnr-fade-in-a7eac65f .3s ease}@keyframes mnr-fade-in-a7eac65f{0%{opacity:0;transform:translate(-50%) translateY(20px)}to{opacity:1;transform:translate(-50%) translateY(0)}}@media(min-width:768px){.mnr-reader-header[data-v-a7eac65f]{padding:16px 24px}.mnr-chapter-title[data-v-a7eac65f]{font-size:18px}.mnr-reader-content[data-v-a7eac65f]{padding:30px}}@media(min-width:1024px){.mnr-reader-content[data-v-a7eac65f]{padding:40px}}.mnr-rule-editor-overlay[data-v-a7eac65f]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;transition:opacity .2s ease,visibility .2s ease}.mnr-rule-editor-overlay.mnr-overlay-hidden[data-v-a7eac65f]{opacity:0;visibility:hidden;pointer-events:none}.mnr-rule-editor-container[data-v-a7eac65f]{background:var(--mnr-bg, #fff);border-radius:8px;max-width:800px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 4px 20px #0000004d}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var MyNovelReader = (function(exports) {
  "use strict";// @license        GPL version 3

  const DEFAULT_THRESHOLD = 0.6;
  const DEFAULT_WEIGHTS = {
    content: 0.5,
    navigation: 0.3,
    title: 0.2
  };
  class ConfidenceScorer {
    constructor(threshold = DEFAULT_THRESHOLD, weights = DEFAULT_WEIGHTS) {
      this.threshold = threshold;
      this.weights = weights;
    }
    /**
     * Calculate confidence report from detection results
     */
    score(results) {
      const contentScore = results.content.confidence;
      const navigationScore = this.scoreNavigation(results.navigation);
      const titleScore = results.title.confidence;
      const overall = contentScore * this.weights.content + navigationScore * this.weights.navigation + titleScore * this.weights.title;
      const reasons = this.generateReasons(results, {
        content: contentScore,
        navigation: navigationScore,
        title: titleScore
      });
      return {
        overall,
        content: contentScore,
        navigation: navigationScore,
        title: titleScore,
        isReliable: overall >= this.threshold,
        reasons
      };
    }
    /**
     * Score navigation detection result
     */
    scoreNavigation(nav) {
      let score = 0;
      let count = 0;
      if (nav.next) {
        score += nav.next.confidence * 1.5;
        count += 1.5;
      } else {
        return 0.2;
      }
      if (nav.prev) {
        score += nav.prev.confidence;
        count++;
      }
      if (nav.index) {
        score += nav.index.confidence * 0.5;
        count += 0.5;
      }
      return count > 0 ? score / count : 0;
    }
    /**
     * Generate human-readable reasons for the scores
     */
    generateReasons(results, scores) {
      const reasons = [];
      if (scores.content > 0.8) {
        reasons.push("找到清晰的内容区域");
      } else if (scores.content > 0.5) {
        reasons.push("找到可能的内容区域");
      } else if (scores.content > 0) {
        reasons.push("内容区域检测不确定");
      } else {
        reasons.push("未找到内容区域");
      }
      if (results.navigation.next) {
        reasons.push("找到下一章链接");
      } else {
        reasons.push("未找到下一章链接");
      }
      if (results.navigation.prev) {
        reasons.push("找到上一章链接");
      }
      if (results.navigation.index) {
        reasons.push("找到目录链接");
      }
      if (scores.title > 0.7) {
        reasons.push(`检测到章节标题: "${results.title.chapterTitle.substring(0, 20)}..."`);
      } else if (scores.title > 0.4) {
        reasons.push("章节标题检测不确定");
      }
      if (results.title.bookTitle) {
        reasons.push(`书名: ${results.title.bookTitle}`);
      }
      return reasons;
    }
    /**
     * Create a simple summary string
     */
    createSummary(report) {
      const percentage = Math.round(report.overall * 100);
      const status = report.isReliable ? "可信" : "不确定";
      return `检测置信度: ${percentage}% (${status})`;
    }
    /**
     * Get threshold value
     */
    getThreshold() {
      return this.threshold;
    }
    /**
     * Set threshold value
     */
    setThreshold(threshold) {
      this.threshold = threshold;
    }
  }
  const KNOWN_CONTENT_SELECTORS = [
    // ID selectors - primary
    "#pagecontent",
    "#contentbox",
    "#bmsy_content",
    "#bookpartinfo",
    "#htmlContent",
    "#text_area",
    "#chapter_content",
    "#chapterContent",
    "#chaptercontent",
    "#partbody",
    "#BookContent",
    "#read-content",
    "#article_content",
    "#BookTextRead",
    "#booktext",
    "#book_text",
    "#BookText",
    "#BookTextt",
    "#readtext",
    "#readcon",
    "#read",
    "#TextContent",
    "#txtContent",
    "#text_c",
    "#txt_td",
    "#TXT",
    "#txt",
    "#zjneirong",
    "#contentTxt",
    "#oldtext",
    "#a_content",
    "#contents",
    "#content2",
    "#contentts",
    "#content1",
    "#content",
    "#booktxt",
    "#nr",
    "#rtext",
    "#articlecontent",
    "#novelcontent",
    "#text-content",
    "#articlebody",
    "#ChapterContents",
    "#acontent",
    "#chapterinfo",
    "#read_content",
    "#chapter-content",
    // New from rule migration
    "#readerFt",
    "#partContent",
    "#ChapterBody",
    "#showcontent",
    "#luf_news_contents",
    "#tt_text",
    "#J_BookRead",
    "#zjny",
    "#cont-body",
    "#Lab_Contents",
    "#auto-chapter",
    "#readpage_leftntxt",
    // Class selectors
    ".novel_content",
    ".readmain_inner",
    ".noveltext",
    ".booktext",
    ".yd_text2",
    ".articlecontent",
    ".readcontent",
    ".txtnav",
    ".content",
    ".art_con",
    ".article",
    // New from rule migration
    ".read-content",
    ".bookreadercontent",
    ".novelbody",
    ".chapter-item",
    ".noveContent",
    ".con",
    ".Text",
    ".TxtContent",
    ".article-content",
    ".nvl-content",
    ".box_box",
    ".txt_tcontent",
    ".story_content",
    ".chapter_content",
    // Element selectors
    "article"
  ];
  const NAV_PATTERNS = {
    next: [
      /下一[页章节篇话]/,
      /下[页章话]/,
      /next/i,
      /^\s*>\s*$/,
      /翻下页/,
      /后一章/,
      /继续阅读/,
      /下篇/,
      /后篇/,
      /下一话/
    ],
    prev: [
      /上一[页章节篇话]/,
      /上[页章话]/,
      /prev/i,
      /^\s*<\s*$/,
      /翻上页/,
      /前一章/,
      /上篇/,
      /前篇/,
      /上一话/
    ],
    index: [
      /^目录$/,
      /章节目录/,
      /章节列表/,
      /返回目录/,
      /回目录/,
      /回书目/,
      /书目/,
      /书页/,
      /index/i,
      /catalog/i
    ]
  };
  const TITLE_PATTERN = /第?\s*[一二两三四五六七八九十○零百千万亿0-9１２３４５６７８９０〇]{1,6}\s*[章回卷节折篇幕集话話]|序章|楔子|番外|后记|尾声|前言|引子|Chapter\s*\d+/i;
  const POSITIVE_PATTERNS = [
    /^(content|chapter|article|text|body|main|read|book|novel)/i,
    /内容|正文|章节|小说|阅读/
  ];
  const NEGATIVE_PATTERNS = [
    /^(nav|header|footer|sidebar|menu|ad|comment|discuss|recommend)/i,
    /(广告|评论|推荐|相关|热门|排行|导航|页眉|页脚)/
  ];
  function cssEscape$1(str) {
    if (typeof CSS !== "undefined" && CSS.escape) {
      return CSS.escape(str);
    }
    return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  }
  const WEIGHTS = {
    // Positive indicators
    CONTENT_ID_CLASS: 25,
    ARTICLE_TAG: 15,
    HIGH_TEXT_DENSITY: 20,
    PARAGRAPH_COUNT: 10,
    CHINESE_RATIO: 15,
    TEXT_LENGTH_BONUS: 20,
    // Max bonus for long text
    // Negative indicators
    NAV_HEADER_FOOTER: -25,
    AD_CLASS: -30,
    COMMENT_CLASS: -20,
    HIGH_LINK_DENSITY: -20
  };
  const MIN_TEXT_LENGTH = 500;
  const MIN_CHINESE_RATIO = 0.3;
  class ContentDetector {
    /**
     * Detect the main content area of the document
     */
    detect(doc2) {
      const selectorResult = this.tryKnownSelectors(doc2);
      if (selectorResult) {
        return selectorResult;
      }
      const candidates = this.findCandidates(doc2);
      if (candidates.length === 0) {
        return this.createEmptyResult();
      }
      const scored = this.scoreCandidates(candidates);
      scored.sort((a, b) => b.score - a.score);
      const best = scored[0];
      if (best.score < 10 || best.textLength < MIN_TEXT_LENGTH) {
        return this.createEmptyResult();
      }
      return {
        element: best.element,
        selector: this.generateSelector(best.element),
        confidence: this.normalizeScore(best.score),
        method: "heuristic",
        preview: this.getPreview(best.element)
      };
    }
    /**
     * Try known content selectors (fast path)
     */
    tryKnownSelectors(doc2) {
      for (const selector of KNOWN_CONTENT_SELECTORS) {
        try {
          const el = doc2.querySelector(selector);
          if (el && this.isValidContent(el)) {
            return {
              element: el,
              selector,
              confidence: 0.9,
              method: "selector",
              preview: this.getPreview(el)
            };
          }
        } catch {
        }
      }
      return null;
    }
    /**
     * Find all potential content containers
     */
    findCandidates(doc2) {
      const containers = doc2.querySelectorAll("div, article, section, main, td");
      return Array.from(containers).filter((el) => {
        const text = el.textContent || "";
        if (text.length < MIN_TEXT_LENGTH) return false;
        if (this.isNavigationElement(el)) return false;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") {
          return false;
        }
        return true;
      });
    }
    /**
     * Score all candidate elements
     */
    scoreCandidates(candidates) {
      return candidates.map((element) => {
        let score = 0;
        const text = element.textContent || "";
        const html = element.innerHTML;
        const textLength = text.length;
        const htmlLength = html.length;
        const textDensity = textLength / Math.max(htmlLength, 1);
        const linkDensity = this.calculateLinkDensity(element);
        const chineseRatio = this.calculateChineseRatio(text);
        const paragraphCount = element.querySelectorAll("p, br").length;
        const idClass = ((element.id || "") + " " + (element.className || "")).toLowerCase();
        if (POSITIVE_PATTERNS.some((p2) => p2.test(idClass))) {
          score += WEIGHTS.CONTENT_ID_CLASS;
        }
        const tagName = element.tagName.toUpperCase();
        if (tagName === "ARTICLE" || tagName === "MAIN") {
          score += WEIGHTS.ARTICLE_TAG;
        }
        if (textDensity > 0.5) {
          score += WEIGHTS.HIGH_TEXT_DENSITY;
        }
        if (paragraphCount > 3) {
          score += WEIGHTS.PARAGRAPH_COUNT;
        }
        if (chineseRatio > 0.7) {
          score += WEIGHTS.CHINESE_RATIO;
        }
        if (NEGATIVE_PATTERNS.some((p2) => p2.test(idClass))) {
          score += WEIGHTS.NAV_HEADER_FOOTER;
        }
        if (/ad|sponsor|banner|promo/i.test(idClass)) {
          score += WEIGHTS.AD_CLASS;
        }
        if (/comment|discuss|reply/i.test(idClass)) {
          score += WEIGHTS.COMMENT_CLASS;
        }
        if (linkDensity > 0.3) {
          score += WEIGHTS.HIGH_LINK_DENSITY;
        }
        score += Math.min(textLength / 1e3, WEIGHTS.TEXT_LENGTH_BONUS);
        return { element, score, textLength, linkDensity, chineseRatio };
      });
    }
    /**
     * Check if element contains valid novel content
     */
    isValidContent(element) {
      const text = element.textContent || "";
      if (text.length < MIN_TEXT_LENGTH) return false;
      const chineseRatio = this.calculateChineseRatio(text);
      if (chineseRatio < MIN_CHINESE_RATIO) return false;
      const linkDensity = this.calculateLinkDensity(element);
      if (linkDensity > 0.5) return false;
      return true;
    }
    /**
     * Check if element is a navigation/structural element
     */
    isNavigationElement(element) {
      const tagName = element.tagName.toUpperCase();
      if (["NAV", "HEADER", "FOOTER", "ASIDE"].includes(tagName)) {
        return true;
      }
      const idClass = ((element.id || "") + " " + (element.className || "")).toLowerCase();
      return /nav|menu|sidebar|footer|header/.test(idClass);
    }
    /**
     * Calculate the ratio of link text to total text
     */
    calculateLinkDensity(element) {
      var _a;
      const links = element.querySelectorAll("a");
      const linkText = Array.from(links).reduce((sum, a) => {
        var _a2;
        return sum + (((_a2 = a.textContent) == null ? void 0 : _a2.length) || 0);
      }, 0);
      const totalText = ((_a = element.textContent) == null ? void 0 : _a.length) || 1;
      return linkText / totalText;
    }
    /**
     * Calculate the ratio of Chinese characters to total characters
     */
    calculateChineseRatio(text) {
      const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
      const nonWhitespace = text.replace(/\s/g, "");
      return chineseChars.length / Math.max(nonWhitespace.length, 1);
    }
    /**
     * Generate a CSS selector for the element
     */
    generateSelector(element) {
      if (element.id) {
        return `#${cssEscape$1(element.id)}`;
      }
      const classes = Array.from(element.classList);
      for (const cls of classes) {
        try {
          if (document.querySelectorAll(`.${cssEscape$1(cls)}`).length === 1) {
            return `.${cssEscape$1(cls)}`;
          }
        } catch {
          continue;
        }
      }
      return this.generatePathSelector(element);
    }
    /**
     * Generate a path-based selector (e.g., body > div:nth-of-type(2) > div)
     */
    generatePathSelector(element) {
      const path = [];
      let current = element;
      while (current && current !== document.body && current !== document.documentElement) {
        let segment = current.tagName.toLowerCase();
        if (current.id) {
          segment = `#${cssEscape$1(current.id)}`;
          path.unshift(segment);
          break;
        }
        const parent = current.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter((c) => c.tagName === current.tagName);
          if (siblings.length > 1) {
            const index = siblings.indexOf(current) + 1;
            segment += `:nth-of-type(${index})`;
          }
        }
        path.unshift(segment);
        current = parent;
      }
      return path.join(" > ");
    }
    /**
     * Normalize score to 0-1 range
     */
    normalizeScore(score) {
      return Math.min(Math.max(score / 100, 0), 1);
    }
    /**
     * Get preview text from element
     */
    getPreview(element) {
      const text = element.textContent || "";
      return text.trim().substring(0, 200) + (text.length > 200 ? "..." : "");
    }
    /**
     * Create empty result when detection fails
     */
    createEmptyResult() {
      return {
        element: null,
        selector: "",
        confidence: 0,
        method: "fallback"
      };
    }
  }
  const INVALID_URL_PATTERNS = [
    /(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
    /^javascript:/i,
    /BuyChapterUnLogin/i,
    /\/0\.html$/i
  ];
  const SECTION_TEXT_PATTERNS = [
    /[下上]一?页/,
    // 下一页, 上一页
    /[下上]一?頁/,
    // 繁体
    /第\d+页/,
    // 第2页
    /\(\d+\/\d+\)/
    // (2/5) 分页指示
  ];
  const CHAPTER_TEXT_PATTERNS = [
    /[下上]一?章/,
    // 下一章, 上一章
    /[下上]一?节/,
    // 下一节
    /第.+章/
    // 第X章
  ];
  class NavigationDetector {
    /**
     * Detect all navigation links in the document
     */
    detect(doc2) {
      return {
        next: this.findNavLink(doc2, "next"),
        prev: this.findNavLink(doc2, "prev"),
        index: this.findNavLink(doc2, "index")
      };
    }
    /**
     * Find a specific navigation link
     */
    findNavLink(doc2, type) {
      var _a, _b;
      const patterns = NAV_PATTERNS[type];
      if (type !== "index") {
        const relLink = doc2.querySelector(`a[rel="${type}"]`);
        if (relLink && this.isValidLink(relLink)) {
          return {
            element: relLink,
            url: relLink.href,
            confidence: 0.95,
            method: "rel-attribute",
            text: (_a = relLink.textContent) == null ? void 0 : _a.trim()
          };
        }
      }
      const links = doc2.querySelectorAll("a[href]");
      const candidates = [];
      for (const link of links) {
        const anchor = link;
        const text = ((_b = anchor.textContent) == null ? void 0 : _b.trim()) || "";
        if (!this.isValidLink(anchor)) continue;
        let score = 0;
        for (const pattern of patterns) {
          if (pattern.test(text)) {
            score += 10;
            if (text.length <= 5) score += 5;
          }
        }
        const title = anchor.title || "";
        for (const pattern of patterns) {
          if (pattern.test(title)) {
            score += 5;
          }
        }
        try {
          const rect = anchor.getBoundingClientRect();
          if (rect.top < 300 || rect.top > document.documentElement.scrollHeight - 300) {
            score += 2;
          }
        } catch {
        }
        if (text.length > 20) {
          score -= 5;
        }
        if (score > 0) {
          candidates.push({ element: anchor, score, text });
        }
      }
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      return {
        element: best.element,
        url: best.element.href,
        confidence: Math.min(best.score / 15, 0.9),
        method: "text-matching",
        text: best.text
      };
    }
    /**
     * Check if a link is valid for navigation
     */
    isValidLink(anchor) {
      const href = anchor.href;
      if (!href) return false;
      if (href.startsWith("javascript:")) return false;
      for (const pattern of INVALID_URL_PATTERNS) {
        if (pattern.test(href)) return false;
      }
      if (href.includes("#") && !href.includes("#chapter")) {
        const url = new URL(href);
        if (url.pathname === window.location.pathname) {
          return false;
        }
      }
      return true;
    }
    /**
     * Validate navigation by comparing URLs
     * Useful to ensure next/prev links follow expected pattern
     */
    validateNavigation(currentUrl, navigation) {
      const currentNum = this.extractChapterNumber(currentUrl);
      if (currentNum === null) return navigation;
      if (navigation.next) {
        const nextNum = this.extractChapterNumber(navigation.next.url);
        if (nextNum !== null && nextNum !== currentNum + 1) {
          navigation.next.confidence *= 0.7;
        }
      }
      if (navigation.prev) {
        const prevNum = this.extractChapterNumber(navigation.prev.url);
        if (prevNum !== null && prevNum !== currentNum - 1) {
          navigation.prev.confidence *= 0.7;
        }
      }
      return navigation;
    }
    /**
     * Try to extract chapter number from URL
     */
    extractChapterNumber(url) {
      const patterns = [
        /\/(\d+)\.html?$/i,
        /\/chapter\/(\d+)/i,
        /\/(\d+)_\d+\.html?$/i,
        /_(\d+)\.html?$/i
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return null;
    }
    /**
     * Detect if current page is part of a multi-page chapter (分页章节)
     * This enables automatic section merging without manual rule configuration
     */
    detectSection(doc2, currentUrl, navigation) {
      const result = {
        isSection: false,
        currentSection: null,
        nextSectionUrl: null,
        nextChapterUrl: null,
        confidence: 0,
        method: "none"
      };
      const urlSectionInfo = this.extractSectionFromUrl(currentUrl);
      if (urlSectionInfo) {
        result.isSection = true;
        result.currentSection = urlSectionInfo.section;
        result.confidence = 0.8;
        result.method = "url-pattern";
      }
      if (navigation.next) {
        const nextText = navigation.next.text || "";
        const isNextSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(nextText));
        const isNextChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(nextText));
        if (isNextSection && !isNextChapter) {
          result.isSection = true;
          result.nextSectionUrl = navigation.next.url;
          result.confidence = Math.max(result.confidence, 0.9);
          result.method = "link-text";
        } else if (isNextChapter) {
          result.nextChapterUrl = navigation.next.url;
        }
      }
      if (navigation.next && !result.isSection) {
        const nextUrl = navigation.next.url;
        const comparison = this.compareUrlsForSection(currentUrl, nextUrl);
        if (comparison.isSection) {
          result.isSection = true;
          result.nextSectionUrl = nextUrl;
          result.confidence = Math.max(result.confidence, comparison.confidence);
          result.method = "url-comparison";
        }
      }
      if (navigation.prev && !result.isSection) {
        const prevText = navigation.prev.text || "";
        const isPrevSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(prevText));
        if (isPrevSection) {
          result.isSection = true;
          result.confidence = Math.max(result.confidence, 0.85);
          result.method = "link-text";
        }
      }
      if (result.isSection && !result.nextChapterUrl) {
        result.nextChapterUrl = this.findNextChapterUrl(doc2, currentUrl, navigation);
      }
      return result;
    }
    /**
     * Extract section number from URL
     * Returns { chapter, section } or null
     */
    extractSectionFromUrl(url) {
      const patterns = [/\/(\d+)[_-](\d+)\.html?$/i, /\/(\d+)\/(\d+)\.html?$/i];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          const section = parseInt(match[2], 10);
          if (section > 1) {
            return {
              chapter: parseInt(match[1], 10),
              section
            };
          }
        }
      }
      return null;
    }
    /**
     * Compare two URLs to detect section relationship
     */
    compareUrlsForSection(currentUrl, nextUrl) {
      try {
        const current = new URL(currentUrl);
        const next = new URL(nextUrl);
        if (current.host !== next.host) {
          return { isSection: false, confidence: 0 };
        }
        const currentPath = current.pathname;
        const nextPath = next.pathname;
        const firstPageMatch = currentPath.match(/\/(\d+)\.html?$/i);
        const secondPageMatch = nextPath.match(/\/(\d+)[_-]2\.html?$/i);
        if (firstPageMatch && secondPageMatch && firstPageMatch[1] === secondPageMatch[1]) {
          return { isSection: true, confidence: 0.9 };
        }
        const sectionMatch1 = currentPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
        const sectionMatch2 = nextPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
        if (sectionMatch1 && sectionMatch2) {
          if (sectionMatch1[1] === sectionMatch2[1]) {
            const s1 = parseInt(sectionMatch1[2], 10);
            const s2 = parseInt(sectionMatch2[2], 10);
            if (s2 === s1 + 1) {
              return { isSection: true, confidence: 0.95 };
            }
          }
        }
        const similarity = this.calculateUrlSimilarity(currentPath, nextPath);
        if (similarity > 0.8) {
          return { isSection: true, confidence: similarity * 0.7 };
        }
        return { isSection: false, confidence: 0 };
      } catch {
        return { isSection: false, confidence: 0 };
      }
    }
    /**
     * Calculate similarity between two URL paths
     */
    calculateUrlSimilarity(path1, path2) {
      const normalize = (p2) => p2.replace(/\d+/g, "#");
      const n1 = normalize(path1);
      const n2 = normalize(path2);
      if (n1 === n2) return 1;
      if (n1.length === 0 || n2.length === 0) return 0;
      const longer = n1.length > n2.length ? n1 : n2;
      const shorter = n1.length > n2.length ? n2 : n1;
      let matches = 0;
      for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] === longer[i]) matches++;
      }
      return matches / longer.length;
    }
    /**
     * Try to find the next chapter URL (skipping remaining sections)
     */
    findNextChapterUrl(doc2, currentUrl, _navigation) {
      var _a;
      const links = doc2.querySelectorAll("a[href]");
      for (const link of links) {
        const anchor = link;
        const text = ((_a = anchor.textContent) == null ? void 0 : _a.trim()) || "";
        const isChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text));
        const isSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text));
        if (isChapter && !isSection && this.isValidLink(anchor)) {
          const comparison = this.compareUrlsForSection(currentUrl, anchor.href);
          if (!comparison.isSection) {
            return anchor.href;
          }
        }
      }
      return null;
    }
  }
  function cssEscape(str) {
    if (typeof CSS !== "undefined" && CSS.escape) {
      return CSS.escape(str);
    }
    return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  }
  const KNOWN_TITLE_SELECTORS = [
    "h1.chapter-title",
    "h1.chapter_title",
    ".chapter-title",
    ".chapter_title",
    ".bookname h1",
    ".title h1",
    "#chapter_title",
    ".readtitle h1",
    "article h1",
    "h1"
  ];
  const KNOWN_BOOK_TITLE_SELECTORS = [
    ".bookname",
    ".book-title",
    ".book_title",
    "#bookname",
    ".novel-title",
    "h2.title",
    ".breadcrumb a:last-of-type",
    ".chapter-nav a:last-of-type"
  ];
  const TITLE_CLEANUP_PATTERNS = [
    /^章节目录/,
    /^文章正文/,
    /^正文卷?/,
    /全文免费阅读$/,
    /最新章节$/,
    /\(文\)$/,
    /_.*$/,
    // Remove trailing "_sitename"
    /-.*小说.*$/i
  ];
  class TitleDetector {
    /**
     * Detect chapter and book titles
     */
    detect(doc2) {
      const results = [
        this.detectFromSelector(doc2),
        this.detectFromDocumentTitle(doc2),
        this.detectFromHeadings(doc2)
      ].filter(Boolean);
      if (results.length === 0) {
        return this.createEmptyResult();
      }
      results.sort((a, b) => b.confidence - a.confidence);
      const best = results[0];
      const bookTitle = this.detectBookTitle(doc2);
      if (bookTitle) {
        best.bookTitle = bookTitle;
      }
      return best;
    }
    /**
     * Detect title using known selectors
     */
    detectFromSelector(doc2) {
      for (const selector of KNOWN_TITLE_SELECTORS) {
        try {
          const el = doc2.querySelector(selector);
          if (el) {
            const text = this.cleanTitle(el.textContent || "");
            if (this.isValidTitle(text)) {
              return {
                chapterTitle: text,
                selector,
                confidence: 0.9,
                method: "selector"
              };
            }
          }
        } catch {
          continue;
        }
      }
      return null;
    }
    /**
     * Detect title from document.title
     */
    detectFromDocumentTitle(doc2) {
      const docTitle = doc2.title;
      if (!docTitle) return null;
      const match = docTitle.match(TITLE_PATTERN);
      if (match) {
        const parts = docTitle.split(/[-_|,，]/).map((s) => s.trim());
        for (const part of parts) {
          if (TITLE_PATTERN.test(part)) {
            const cleaned2 = this.cleanTitle(part);
            if (this.isValidTitle(cleaned2)) {
              return {
                chapterTitle: cleaned2,
                confidence: 0.7,
                method: "document-title"
              };
            }
          }
        }
      }
      const firstPart = docTitle.split(/[-_|,，]/)[0].trim();
      const cleaned = this.cleanTitle(firstPart);
      if (this.isValidTitle(cleaned)) {
        return {
          chapterTitle: cleaned,
          confidence: 0.5,
          method: "document-title"
        };
      }
      return null;
    }
    /**
     * Detect title from h1/h2 headings
     */
    detectFromHeadings(doc2) {
      const h1s = doc2.querySelectorAll("h1");
      for (const h1 of h1s) {
        const text = this.cleanTitle(h1.textContent || "");
        if (this.isValidTitle(text) && TITLE_PATTERN.test(text)) {
          return {
            chapterTitle: text,
            selector: this.generateSelector(h1),
            confidence: 0.8,
            method: "heading"
          };
        }
      }
      const h2s = doc2.querySelectorAll("h2");
      for (const h2 of h2s) {
        const text = this.cleanTitle(h2.textContent || "");
        if (this.isValidTitle(text) && TITLE_PATTERN.test(text)) {
          return {
            chapterTitle: text,
            selector: this.generateSelector(h2),
            confidence: 0.7,
            method: "heading"
          };
        }
      }
      return null;
    }
    /**
     * Detect book title
     */
    detectBookTitle(doc2) {
      for (const selector of KNOWN_BOOK_TITLE_SELECTORS) {
        try {
          const el = doc2.querySelector(selector);
          if (el) {
            const text = (el.textContent || "").trim();
            if (text.length > 0 && text.length < 50) {
              return this.cleanBookTitle(text);
            }
          }
        } catch {
          continue;
        }
      }
      const docTitle = doc2.title;
      const parts = docTitle.split(/[-_|,，]/).map((s) => s.trim());
      if (parts.length >= 2) {
        const bookPart = parts[1] || parts[parts.length - 1];
        if (bookPart.length > 0 && bookPart.length < 50 && !TITLE_PATTERN.test(bookPart)) {
          return this.cleanBookTitle(bookPart);
        }
      }
      return void 0;
    }
    /**
     * Clean up title text
     */
    cleanTitle(text) {
      let cleaned = text.trim();
      for (const pattern of TITLE_CLEANUP_PATTERNS) {
        cleaned = cleaned.replace(pattern, "");
      }
      cleaned = cleaned.replace(/\s+/g, " ").trim();
      return cleaned;
    }
    /**
     * Clean up book title
     */
    cleanBookTitle(text) {
      return text.replace(/全文阅读$/, "").replace(/在线阅读$/, "").replace(/最新章节$/, "").trim();
    }
    /**
     * Validate if text is a valid chapter title
     */
    isValidTitle(text) {
      if (!text || text.length < 2) return false;
      if (text.length > 100) return false;
      if (!/\S/.test(text)) return false;
      return true;
    }
    /**
     * Generate a simple selector for an element
     */
    generateSelector(element) {
      if (element.id) {
        return `#${cssEscape(element.id)}`;
      }
      const tagName = element.tagName.toLowerCase();
      const className = element.className;
      if (className) {
        const firstClass = className.split(/\s+/)[0];
        return `${tagName}.${cssEscape(firstClass)}`;
      }
      return tagName;
    }
    /**
     * Create empty result when detection fails
     */
    createEmptyResult() {
      return {
        chapterTitle: "",
        confidence: 0,
        method: "pattern"
      };
    }
  }
  class DetectionEngine {
    constructor() {
      this.contentDetector = new ContentDetector();
      this.navigationDetector = new NavigationDetector();
      this.titleDetector = new TitleDetector();
      this.confidenceScorer = new ConfidenceScorer();
    }
    /**
     * Run full detection on the document
     */
    detect(doc2 = document) {
      const content = this.contentDetector.detect(doc2);
      const navigation = this.navigationDetector.detect(doc2);
      const title = this.titleDetector.detect(doc2);
      const validatedNav = this.navigationDetector.validateNavigation(
        window.location.href,
        navigation
      );
      const section = this.navigationDetector.detectSection(doc2, window.location.href, validatedNav);
      const results = {
        content,
        navigation: validatedNav,
        title,
        section
      };
      const confidence = this.confidenceScorer.score(results);
      return { results, confidence };
    }
    /**
     * Detect section only (for use when navigation is already known)
     */
    detectSection(doc2 = document) {
      const navigation = this.navigationDetector.detect(doc2);
      return this.navigationDetector.detectSection(doc2, window.location.href, navigation);
    }
    /**
     * Quick check if page looks like a novel chapter
     */
    quickCheck(doc2 = document) {
      const indicators = [
        // Check document title
        () => {
          const title = doc2.title;
          return /第.{1,10}章|chapter|小说|阅读/i.test(title);
        },
        // Check for known content selectors
        () => {
          const selectors = ["#content", "#chapter_content", ".noveltext", "#BookText"];
          return selectors.some((s) => doc2.querySelector(s) !== null);
        },
        // Check for navigation links
        () => {
          const links = Array.from(doc2.querySelectorAll("a"));
          return links.some((a) => /下一[章页]/.test(a.textContent || ""));
        },
        // Check text content length
        () => {
          const body = doc2.body;
          const text = (body == null ? void 0 : body.textContent) || "";
          return text.length > 3e3;
        }
      ];
      const matches = indicators.filter((check) => {
        try {
          return check();
        } catch {
          return false;
        }
      });
      return matches.length >= 2;
    }
    /**
     * Generate a selector for a given element
     */
    generateSelector(element) {
      return this.contentDetector.generateSelector(element);
    }
    /**
     * Get confidence threshold
     */
    getThreshold() {
      return this.confidenceScorer.getThreshold();
    }
    /**
     * Set confidence threshold
     */
    setThreshold(threshold) {
      this.confidenceScorer.setThreshold(threshold);
    }
  }
  const AD_PATTERNS = [
    /本章未完[，,]点击下一页继续.*/gi,
    /手机用户请到.*阅读/gi,
    /请记住本书.*网址/gi,
    /百度搜索.*最新章节/gi,
    /一秒记住.*为您提供/gi,
    /天才一秒记住/gi,
    /笔趣阁.*www\.[a-z]+\.(com|net|org)/gi,
    /https?:\/\/[^\s<>"]+/gi,
    /www\.[a-z0-9]+\.(com|net|org|cc)/gi
  ];
  const REMOVE_SELECTORS = [
    "script",
    "style",
    "iframe",
    "noscript",
    ".ad",
    ".ads",
    ".advertisement",
    '[class*="ad-"]',
    '[id*="ad-"]',
    ".sponsor",
    ".recommend",
    ".related",
    ".comment",
    ".share",
    "ins.adsbygoogle"
  ];
  class ContentProcessor {
    constructor(options = {}) {
      this.options = {
        removeAds: true,
        normalizeWhitespace: true,
        fixImages: true,
        stripInlineStyles: true,
        ...options
      };
    }
    /**
     * Process content element and return cleaned HTML
     */
    process(element, doc2) {
      if (this.options.useRawContent) {
        return element.innerHTML;
      }
      const clone = element.cloneNode(true);
      this.removeUnwantedElements(clone);
      if (this.options.removeSelectors) {
        this.removeBySelector(clone, this.options.removeSelectors);
      }
      if (this.options.stripInlineStyles) {
        this.stripInlineStyles(clone);
      }
      let html = clone.innerHTML;
      if (this.options.replaceRules) {
        html = this.applyReplaceRules(html, this.options.replaceRules);
      }
      if (this.options.removeAds) {
        html = this.removeAdPatterns(html);
      }
      if (this.options.normalizeWhitespace) {
        html = this.normalizeWhitespace(html);
      }
      if (this.options.fixImages) {
        html = this.fixImages(html, doc2);
      }
      html = this.convertBrToParagraphs(html);
      html = this.cleanDuplicateInfo(html);
      return html;
    }
    /**
     * Process and return plain text
     */
    processToText(element) {
      const clone = element.cloneNode(true);
      this.removeUnwantedElements(clone);
      let text = clone.textContent || "";
      if (this.options.removeAds) {
        text = this.removeAdPatterns(text);
      }
      if (this.options.normalizeWhitespace) {
        text = text.replace(/\s+/g, " ").trim();
      }
      return text;
    }
    /**
     * Remove unwanted elements from content
     */
    removeUnwantedElements(element) {
      for (const selector of REMOVE_SELECTORS) {
        try {
          const elements = element.querySelectorAll(selector);
          elements.forEach((el) => el.remove());
        } catch {
        }
      }
    }
    /**
     * Remove elements by custom selector
     */
    removeBySelector(element, selectors) {
      const selectorList = selectors.split(",").map((s) => s.trim());
      for (const selector of selectorList) {
        try {
          const elements = element.querySelectorAll(selector);
          elements.forEach((el) => el.remove());
        } catch {
        }
      }
    }
    /**
     * Strip inline styles from all elements
     * This prevents original page styles from overriding reader theme
     */
    stripInlineStyles(element) {
      element.removeAttribute("style");
      const elementsWithStyle = element.querySelectorAll("[style]");
      elementsWithStyle.forEach((el) => {
        el.removeAttribute("style");
      });
      element.removeAttribute("bgcolor");
      const elementsWithBgcolor = element.querySelectorAll("[bgcolor]");
      elementsWithBgcolor.forEach((el) => {
        el.removeAttribute("bgcolor");
      });
    }
    /**
     * Apply custom replace rules
     */
    applyReplaceRules(html, rules) {
      let result = html;
      for (const rule of rules) {
        try {
          const regex = new RegExp(rule.pattern, rule.flags || "g");
          result = result.replace(regex, rule.replacement);
        } catch {
        }
      }
      return result;
    }
    /**
     * Remove common ad patterns
     */
    removeAdPatterns(text) {
      let result = text;
      for (const pattern of AD_PATTERNS) {
        result = result.replace(pattern, "");
      }
      return result;
    }
    /**
     * Normalize whitespace
     */
    normalizeWhitespace(html) {
      return html.replace(/<p>\s*<\/p>/gi, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").replace(/<p>\s+/gi, "<p>").replace(/\s+<\/p>/gi, "</p>");
    }
    /**
     * Fix and center images
     */
    fixImages(html, doc2) {
      const temp = doc2.createElement("div");
      temp.innerHTML = html;
      const images = temp.querySelectorAll("img");
      images.forEach((img) => {
        const dataSrc = img.getAttribute("data-src") || img.getAttribute("data-original");
        if (dataSrc && !img.src) {
          img.src = dataSrc;
        }
        img.style.display = "block";
        img.style.maxWidth = "100%";
        img.style.margin = "10px auto";
      });
      return temp.innerHTML;
    }
    /**
     * Convert multiple br tags to paragraphs
     */
    convertBrToParagraphs(html) {
      let result = html.replace(/(<br\s*\/?>\s*){2,}/gi, "</p><p>");
      if (!result.includes("<p>")) {
        result = "<p>" + result.replace(/<br\s*\/?>/gi, "</p><p>") + "</p>";
      }
      result = result.replace(/<p>\s*<\/p>/gi, "");
      return result;
    }
    /**
     * Set processing options
     */
    setOptions(options) {
      this.options = { ...this.options, ...options };
    }
    /**
     * Clean duplicate book/chapter/author info at start and end of content
     */
    cleanDuplicateInfo(html) {
      var _a, _b;
      const { chapterTitle } = this.options;
      let result = html;
      if (chapterTitle && chapterTitle.length > 2) {
        const chapterNumMatch = chapterTitle.match(
          /^(第[一二三四五六七八九十百千\d]+[章节回话篇集卷])/
        );
        const chapterNum = chapterNumMatch ? chapterNumMatch[1] : "";
        const titlePatterns = [];
        const escapedTitle = this.escapeRegExp(chapterTitle);
        titlePatterns.push(new RegExp(`^\\s*${escapedTitle}\\s*`, "i"));
        const titleCore = chapterTitle.replace(/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]\s*/, "").trim();
        if (titleCore.length > 1) {
          const escapedCore = this.escapeRegExp(titleCore);
          if (chapterNum) {
            const escapedNum = this.escapeRegExp(chapterNum);
            titlePatterns.push(new RegExp(`^\\s*${escapedNum}\\s*[·•.\\s]*${escapedCore}\\s*`, "i"));
          }
        }
        if (chapterNum) {
          const escapedNum = this.escapeRegExp(chapterNum);
          titlePatterns.push(new RegExp(`^\\s*${escapedNum}[^<]{0,50}\\s*(?=<|$)`, "i"));
        }
        for (const pattern of titlePatterns) {
          result = result.replace(pattern, "");
          result = result.replace(new RegExp(`(<p[^>]*>)\\s*${pattern.source}`, "gi"), "$1").replace(new RegExp(`(<div[^>]*>)\\s*${pattern.source}`, "gi"), "$1").replace(new RegExp(`(<span[^>]*>)\\s*${pattern.source}`, "gi"), "$1");
        }
      }
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = result;
      const children = Array.from(tempDiv.childNodes);
      let removedCount = 0;
      const maxRemove = 3;
      for (const child of children) {
        if (removedCount >= maxRemove) break;
        const text = (child.textContent || "").trim();
        if (!text) {
          (_a = child.parentNode) == null ? void 0 : _a.removeChild(child);
          continue;
        }
        if (text.length < 100 && this.looksLikeDuplicateTitle(text)) {
          (_b = child.parentNode) == null ? void 0 : _b.removeChild(child);
          removedCount++;
          continue;
        }
        if (text.length > 50 && !this.looksLikeDuplicateTitle(text)) {
          break;
        }
      }
      const trailingPatterns = [
        /\s*本章完\s*$/i,
        /\s*\(本章完\)\s*$/i,
        /\s*---+\s*$/,
        /\s*===+\s*$/,
        /\s*\*{3,}\s*$/
      ];
      result = tempDiv.innerHTML;
      for (const pattern of trailingPatterns) {
        result = result.replace(pattern, "");
      }
      result = result.replace(/<p>\s*<\/p>/gi, "").replace(/<div>\s*<\/div>/gi, "");
      return result;
    }
    /**
     * Check if text looks like a duplicate chapter title
     */
    looksLikeDuplicateTitle(text) {
      const { chapterTitle, bookTitle } = this.options;
      const trimmed = text.trim();
      if (chapterTitle) {
        const normalizedTitle = chapterTitle.replace(/\s+/g, "").toLowerCase();
        const normalizedText = trimmed.replace(/\s+/g, "").replace(/[·•.]/g, "").toLowerCase();
        if (normalizedText === normalizedTitle) return true;
        if (normalizedText.includes(normalizedTitle) || normalizedTitle.includes(normalizedText)) {
          return true;
        }
        const titleCore = chapterTitle.replace(/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]\s*/, "").trim();
        const textCore = trimmed.replace(/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]\s*[·•.\s]*/, "").trim();
        if (titleCore && textCore && this.fuzzyMatch(textCore, titleCore)) {
          return true;
        }
      }
      if (bookTitle && this.fuzzyMatch(trimmed, bookTitle)) {
        return true;
      }
      if (/^第[一二三四五六七八九十百千\d]+[章节回话篇集卷]/.test(trimmed)) {
        return true;
      }
      if (/^作者[：:]/i.test(trimmed)) {
        return true;
      }
      return false;
    }
    /**
     * Fuzzy match two strings (check if they share significant overlap)
     */
    fuzzyMatch(text, target) {
      if (!text || !target) return false;
      const t1 = text.replace(/\s+/g, "").toLowerCase();
      const t2 = target.replace(/\s+/g, "").toLowerCase();
      if (t1 === t2) return true;
      if (t1.includes(t2) || t2.includes(t1)) return true;
      if (t2.length >= 3) {
        let matches = 0;
        for (const char of t2) {
          if (t1.includes(char)) matches++;
        }
        if (matches / t2.length >= 0.7) return true;
      }
      return false;
    }
    /**
     * Escape special regex characters
     */
    escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  const STORAGE_KEYS = {
    RULE_PREFIX: "mnr_rule_"
  };
  const DEFAULT_COMMUNITY_RULES_URL = "https://raw.githubusercontent.com/JasonEX/MyNovelReader/master/rules/community.json";
  const specialRules = [
    // Qidian (起点) - VIP chapters, dynamic content
    {
      id: "qidian-read",
      name: "起点新版-阅文",
      version: 1,
      match: {
        pattern: "^https?://(?:read|vipreader)\\.qidian\\.com/chapter/.*",
        exclude: ["/lastpage/"]
      },
      content: {
        selector: ".read-content.j_readContent",
        remove: ".review-count"
      },
      navigation: {
        next: "#j_chapterNext",
        prev: "#j_chapterPrev",
        index: '.chapter-control a:contains("目录"), #my_index'
      },
      title: {
        selector: "h3.j_chapterName",
        bookSelector: "#bookImg"
      },
      advanced: {
        mutationSelector: ".read-content.j_readContent",
        mutationChildCount: 0
      },
      meta: { source: "builtin", exampleUrl: "https://read.qidian.com/chapter/..." }
    },
    {
      id: "qidian-www",
      name: "起点新版-20240317",
      version: 1,
      match: {
        pattern: "^https?://(www|m)\\.qidian\\.com/chapter/.*"
      },
      content: {
        selector: 'main[id^="c-"]',
        remove: ".review"
      },
      navigation: {
        // Use detection fallback - Qidian's navigation is dynamically loaded
        next: false,
        // Let detection handle it
        prev: false,
        // Let detection handle it
        index: '.catalog, a[href*="/book/"]:contains("目录")'
      },
      title: {
        selector: "h1.text-1\\.3em",
        pattern: "(.*?)《(.*?)》(.*?)",
        patternIndex: 1,
        // Use match[1] for chapter title
        bookPatternIndex: 2
        // Use match[2] for book title
      },
      advanced: {
        useIframe: true,
        mutationSelector: 'main[id^="c-"]',
        mutationChildCount: 0
      },
      meta: { source: "builtin" }
    },
    // Chuangshi (创世) - Complex getContent
    {
      id: "chuangshi",
      name: "创世中文网",
      version: 1,
      match: {
        pattern: "^https?://(?:chuangshi|yunqi)\\.qq\\.com/|^http://dushu\\.qq\\.com/read.html\\?bid="
      },
      content: {
        selector: ".bookreadercontent"
      },
      navigation: {
        next: "#rightFloatBar_nextChapterBtn",
        prev: "#rightFloatBar_preChapterBtn"
      },
      title: {
        selector: ".story_title > h1",
        bookSelector: ".bookNav > a:last()"
      },
      processing: {
        removeAds: false,
        useSiteFont: true
      },
      advanced: {
        mutationSelector: "#chaptercontainer",
        mutationChildCount: 1
      },
      meta: { source: "builtin" }
    },
    // JJWXC (晋江) - Font decoding, VIP
    {
      id: "jjwxc",
      name: "晋江文学网",
      version: 1,
      match: {
        pattern: "^https?://(www|my)\\.jjwxc\\.net/onebook(_vip)?\\.php"
      },
      content: {
        selector: ".novelbody",
        remove: "font[color], hr, div:has(>#yrt3), div:has(>h2), #six_list, #sendKingTickets, div[align=right], .readsmall, script"
      },
      navigation: {
        index: ".noveltitle > h1 > a"
      },
      title: {
        selector: "#chapter_list > option:first",
        pattern: "《(.*?)》.*[ˇ^](.*?)[ˇ^].*"
      },
      processing: {
        removeAds: false
      },
      advanced: {
        useIframe: true,
        mutationSelector: "div[id^=content]",
        mutationChildCount: 0,
        iframeSandbox: "allow-same-origin allow-scripts"
      },
      meta: { source: "builtin" }
    },
    // Quanben (全本) - iframe + mutation text
    {
      id: "quanben",
      name: "全本小说网",
      version: 1,
      match: {
        pattern: "^https?://www\\.quanben\\.io/.*?/.*?/\\d+\\.html"
      },
      content: {
        selector: "#content"
      },
      title: {
        bookSelector: ".name"
      },
      advanced: {
        useIframe: true,
        mutationSelector: "#content"
      },
      meta: {
        source: "builtin",
        exampleUrl: "http://www.quanben.io/n/wuxianwanxiangtongminglu/1.html"
      }
    },
    // Ciweimao (刺猬猫)
    {
      id: "ciweimao",
      name: "刺猬猫",
      version: 1,
      match: {
        pattern: "^https?://www\\.ciweimao\\.com/chapter/\\d+"
      },
      content: {
        selector: "#J_BookRead",
        remove: "i.J_Num, .chapter span"
      },
      title: {
        bookSelector: ".breadcrumb > a:last()"
      },
      advanced: {
        useIframe: true,
        mutationSelector: "#J_BookRead",
        mutationChildCount: 1
      },
      meta: { source: "builtin", exampleUrl: "https://www.ciweimao.com/chapter/102930784" }
    },
    // Gongzicp (长佩)
    {
      id: "gongzicp",
      name: "长佩文学网",
      version: 1,
      match: {
        pattern: "^https?://www\\.gongzicp\\.com/read-\\d+\\.html"
      },
      content: {
        selector: ".content",
        replace: [{ pattern: "来源长佩文学网（https://www\\.gongzicp\\.com）", replacement: "" }]
      },
      title: {
        bookSelector: ".novel"
      },
      advanced: {
        useIframe: true,
        mutationSelector: ".novel",
        mutationChildCount: 2
      },
      meta: { source: "builtin", exampleUrl: "https://www.gongzicp.com/read-246381.html" }
    },
    // 69shu - iframe + referer
    {
      id: "69shu",
      name: "69书吧",
      version: 1,
      match: {
        pattern: "https?://(www\\.)?69(shu|yuedu)[a-z0-9]*?\\.(pro|top|com|cx|net|co|me|biz)/(txt|c|r)/"
      },
      content: {
        selector: ".txtnav",
        remove: ".txtinfo.hide720, #txtright, .bottom-ad, .bottom-ad2",
        replace: [{ pattern: ".*[6六].*[9九].*书.*吧.*", replacement: "" }]
      },
      navigation: {
        next: ".page1 a:nth-child(4)",
        prev: ".page1 a:nth-child(1)",
        index: ".page1 a:nth-child(3)"
      },
      title: {
        selector: "h1",
        bookSelector: ".txtinfo a:first-child, .con_top a:nth-child(3)"
      },
      advanced: {
        useIframe: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.69shuba.com/txt/46867/31307961" }
    },
    // Hetushu (和图书) - Content order scrambled
    {
      id: "hetushu",
      name: "和图书",
      version: 1,
      match: {
        pattern: "^https?://www.hetushu.com/book/\\d+/\\d+.html"
      },
      content: {
        selector: "#content",
        remove: "h2, acronym, bdo, big, cite, code, dfn, kbd, q, s, samp, strike, tt, u, var, ins"
      },
      navigation: {
        next: "a#next",
        prev: "a#pre",
        index: "#left h3 a"
      },
      title: {
        bookSelector: "#left h3"
      },
      advanced: {
        useIframe: true
      },
      meta: { source: "builtin", exampleUrl: "http://www.hetushu.com/book/1421/964983.html" }
    },
    // Weread (微信读书) - Canvas rendering
    {
      id: "weread",
      name: "微信读书",
      version: 1,
      match: {
        pattern: "https?://weread\\.qq\\.com/web/reader/.*?"
      },
      content: {
        selector: ".wr_canvasContainer"
      },
      navigation: {
        next: "#nextchapter",
        prev: "#prevchapter",
        index: "#bookindex"
      },
      title: {
        selector: ".chapterTitle"
      },
      processing: {
        removeAds: false,
        useRawContent: true
      },
      advanced: {
        useIframe: true,
        mutationSelector: ".wr_canvasContainer",
        mutationChildCount: 1
      },
      meta: { source: "builtin" }
    },
    // Alafaxs (阿拉法) - iframe + mutation
    {
      id: "alafaxs",
      name: "阿拉法小说网",
      version: 1,
      match: {
        pattern: "https?://www.alafaxs.com/du/\\d+/\\d+.html"
      },
      content: {
        selector: "#txt"
      },
      title: {
        bookSelector: ".chapter-nav > p:first > a:last()"
      },
      advanced: {
        useIframe: true,
        mutationSelector: "#txt",
        mutationChildCount: 0
      },
      meta: { source: "builtin", exampleUrl: "https://www.alafaxs.com/du/80/856585.html" }
    },
    // Bilinovel (哔哩轻小说) - Section pages
    {
      id: "bilinovel",
      name: "哔哩轻小说",
      version: 1,
      match: {
        pattern: "https://(www|tw)\\.(bilinovel|linovelib)\\.com/novel/\\d+/\\d+(_\\d+)?\\.html"
      },
      content: {
        selector: ".acontent, .bcontent"
      },
      navigation: {
        next: "#footlink > a:nth-child(4)",
        prev: "#footlink > a:nth-child(1)",
        index: "#footlink > a:nth-child(2)"
      },
      title: {
        selector: "#atitle"
      },
      advanced: {
        useIframe: true,
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.bilinovel.com/novel/4048/227859.html" }
    },
    // 69shux - New domain
    {
      id: "69shux",
      name: "69shux",
      version: 1,
      match: {
        pattern: "https://69shux.com/txt/\\d+/\\d+"
      },
      content: {
        selector: ".txtnav",
        remove: ".txtinfo.hide720, #txtright, .err_tips"
      },
      navigation: {
        next: ".page1 a:nth-child(4)",
        prev: ".page1 a:nth-child(1)",
        index: ".page1 a:nth-child(3)"
      },
      title: {
        selector: "h1"
      },
      advanced: {
        useIframe: true,
        iframeSandbox: "allow-same-origin allow-scripts"
      },
      meta: { source: "builtin", exampleUrl: "https://69shux.com/txt/59608/41087519" }
    }
  ];
  const simplifiedRules = [
    // Zongheng (纵横中文网)
    {
      id: "zongheng-book",
      name: "纵横中文网",
      version: 1,
      match: {
        pattern: "^https?://book\\.zongheng\\.com/\\S+\\/\\d+\\.html$"
      },
      content: {
        selector: "#readerFt",
        remove: ".watermark"
      },
      title: {
        selector: "em[itemprop='headline']",
        bookSelector: ".tc h2"
      },
      processing: {
        removeAds: false
      },
      meta: { source: "builtin" }
    },
    {
      id: "zongheng-read",
      name: "纵横中文网-read",
      version: 1,
      match: {
        pattern: "https?://read\\.zongheng\\.com/chapter/\\d+\\/\\d+\\.html"
      },
      content: {
        selector: ".content",
        remove: ".Jfcounts"
      },
      title: {
        selector: ".title_txtbox"
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://read.zongheng.com/chapter/1251858/72302352.html"
      }
    },
    // JJWXC Mobile
    {
      id: "jjwxc-mobile",
      name: "晋江文学城_手机版",
      version: 1,
      match: {
        pattern: "^https?://(?:wap|m)\\.jjwxc\\.(?:net|com)/(?:book2|vip)/\\d+/\\d+"
      },
      content: {
        selector: "div.grid-c > div > .b.module > div:first"
      },
      title: {
        selector: "h2",
        pattern: "《(.*?)》.*[ˇ^](.*?)[ˇ^].*"
      },
      meta: { source: "builtin" }
    },
    // Xiaoxiang (潇湘书院)
    {
      id: "xxsy",
      name: "潇湘书院",
      version: 1,
      match: {
        pattern: "^https?://www\\.xxsy\\.net/chapter/.*\\.html"
      },
      content: {
        selector: "#auto-chapter",
        replace: [{ pattern: "本书由潇湘书院首发，请勿转载！", replacement: "" }]
      },
      navigation: {
        next: ".chapter-next",
        index: ".bread > a:last()"
      },
      title: {
        pattern: "(.*?)_(.*)_全文阅读"
      },
      processing: {
        removeAds: false
      },
      meta: { source: "builtin" }
    },
    // Zhulang (逐浪)
    {
      id: "zhulang",
      name: "逐浪",
      version: 1,
      match: {
        pattern: "^https?://book\\.zhulang\\.com/.*\\.html"
      },
      content: {
        selector: "#readpage_leftntxt"
      },
      title: {
        pattern: "(.*?)-(.*)"
      },
      processing: {
        removeAds: false
      },
      meta: { source: "builtin" }
    },
    // Readnovel (小说阅读网)
    {
      id: "readnovel",
      name: "小说阅读网",
      version: 1,
      match: {
        pattern: "^https?://www\\.readnovel\\.com/novel/.*\\.html"
      },
      content: {
        selector: "#article, .zhangjie",
        remove: "div[style], .miaoshu, .zhichi, .bottomAdbanner"
      },
      title: {
        selector: ".bgtop > h1",
        bookSelector: ".nownav > a:eq(4)"
      },
      meta: { source: "builtin" }
    },
    // Tieba (贴吧)
    {
      id: "tieba",
      name: "百度贴吧（手动启用）",
      version: 1,
      match: {
        pattern: "^https?://tieba\\.baidu.com/p/"
      },
      content: {
        selector: "#j_p_postlist",
        remove: "#sofa_post, .d_author, .share_btn_wrapper, .core_reply, .j_user_sign"
      },
      navigation: {
        next: false,
        prev: false,
        index: "a.card_title_fname"
      },
      title: {
        selector: "h1.core_title_txt",
        bookSelector: ".card_title_fname"
      },
      style: ".clear { border-top:1px solid #cccccc; margin-bottom: 50px; visibility: visible !important;}",
      meta: { source: "builtin" }
    },
    // 17k
    {
      id: "17k",
      name: "17k小说网",
      version: 1,
      match: {
        pattern: "^https?://\\S+\\.17k\\.com/chapter/\\S+/\\d+\\.html$"
      },
      content: {
        selector: "#chapterContent",
        remove: ".chapter_update_time, h1, .qrcode, #authorSpenk, .like_box, #hotRecommend, .ct0416, .recent_read, #miniVoteBox, .copy"
      },
      title: {
        pattern: "(.*?)-(.*?)-.*"
      },
      meta: { source: "builtin" }
    },
    // Tadu (塔读)
    {
      id: "tadu",
      name: "塔读文学",
      version: 1,
      match: {
        pattern: "^https?://www\\.tadu\\.com/book/\\d+/\\d+/?"
      },
      content: {
        selector: "#partContent"
      },
      title: {
        selector: "h4",
        bookSelector: ".chapter_details > span"
      },
      advanced: {
        useIframe: true,
        mutationSelector: "#partContent",
        mutationChildCount: 0
      },
      meta: { source: "builtin" }
    },
    // SF
    {
      id: "sfacg",
      name: "SF 轻小说",
      version: 1,
      match: {
        pattern: "^https?://book.sfacg.com/Novel/\\d+/\\d+/\\d+/"
      },
      content: {
        selector: "#ChapterBody"
      },
      title: {
        pattern: "(.*?)-(.*?)-.*"
      },
      meta: { source: "builtin", exampleUrl: "https://book.sfacg.com/Novel/601991/795722/7137683/" }
    },
    // Piaotia (飘天)
    {
      id: "piaotia",
      name: "飘天文学",
      version: 1,
      match: {
        pattern: "^https?://www\\.piaotia\\.com/html/\\d+/\\d+/\\d+\\.html"
      },
      content: {
        selector: "#content",
        remove: "h1, table, .toplink"
      },
      title: {
        bookSelector: "#content > h1 > a"
      },
      advanced: {
        useIframe: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.piaotia.com/html/15/15083/10323993.html" }
    },
    // Shuhai (书海)
    {
      id: "shuhai",
      name: "书海小说",
      version: 1,
      match: {
        pattern: "^https?://www\\.shuhai\\.com/read/\\d+/\\d+\\.html"
      },
      content: {
        selector: ".chapter-item",
        remove: ".chaper-info"
      },
      title: {
        selector: ".chapter-name",
        bookSelector: ".tip > a:last"
      },
      meta: { source: "builtin", exampleUrl: "http://www.shuhai.com/read/110773/1.html" }
    },
    // Lucifer Club
    {
      id: "lucifer-club",
      name: "露西弗俱乐部",
      version: 1,
      match: {
        pattern: "^https://www\\.lucifer-club\\.com/.*\\.html"
      },
      content: {
        selector: "#luf_news_contents",
        remove: "> form, #luf_local, .luf_top_ad, .luf_news_title, .luf_page_control, .luf_comment",
        replace: [
          { pattern: "保护版权 尊重作者 @ 露西弗俱乐部 www\\.lucifer-club\\.com", replacement: "" }
        ]
      },
      navigation: {
        index: '.luf_news_title > a:contains("目录")'
      },
      title: {
        bookSelector: "#luf_local > a:nth-child(3)"
      },
      processing: {
        removeAds: false
      },
      meta: { source: "builtin", exampleUrl: "https://www.lucifer-club.com/chapter-83716-1.html" }
    },
    // Faloo (飞卢)
    {
      id: "faloo",
      name: "飞卢小说网",
      version: 1,
      match: {
        pattern: "^https?://b\\.faloo\\.com/\\d+_\\d+\\.html"
      },
      content: {
        selector: ".noveContent"
      },
      navigation: {
        next: "a#next_page",
        prev: "a#pre_page",
        index: "a#huimulu"
      },
      title: {
        selector: "h1",
        bookSelector: "#novelName"
      },
      meta: { source: "builtin" }
    },
    // Shushan (书山中文网)
    {
      id: "shushan",
      name: "书山中文网",
      version: 1,
      match: {
        pattern: "https?://shushan\\.zhangyue\\.net/book/\\d+/\\d+/"
      },
      content: {
        selector: ".art_con"
      },
      navigation: {
        next: ".next-cha",
        prev: ".last-cha",
        index: "a:contains(书页)"
      },
      meta: { source: "builtin", exampleUrl: "https://shushan.zhangyue.net/book/105835/15038074/" }
    },
    // ESJ Zone
    {
      id: "esjzone",
      name: "ESJ",
      version: 1,
      match: {
        pattern: "^https?://www\\.esjzone\\.(?:me|cc)/forum/\\d+/\\d+\\.html"
      },
      content: {
        selector: ".mt-3.forum-content"
      },
      navigation: {
        next: ".btn-next.btn-sm.btn-outline-secondary.btn",
        prev: ".btn-prev.btn-sm.btn-outline-secondary.btn",
        index: ".view-all.btn-outline-secondary.btn"
      },
      title: {
        selector: "h2"
      },
      meta: { source: "builtin", exampleUrl: "https://www.esjzone.cc/forum/1677032544/162585.html" }
    },
    // Masiro (真白萌)
    {
      id: "masiro",
      name: "真白萌",
      version: 1,
      match: {
        pattern: "^https?://masiro\\.me/admin/novelReading"
      },
      content: {
        selector: ".nvl-content.box-body"
      },
      navigation: {
        next: "a:contains('下一话')",
        prev: "a:contains('上一话')"
      },
      meta: { source: "builtin" }
    },
    // 123du
    {
      id: "123du",
      name: "123读",
      version: 1,
      match: {
        pattern: "https?://www\\.123dua?\\.(com|vip)/dudu-\\d+/\\d+/\\d+(-\\d+)?\\.html"
      },
      content: {
        selector: "#content"
      },
      navigation: {
        next: '#PageSet a:contains("下一页"), .bottem2 a:contains("下一章")'
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin" }
    },
    // Dbxsc (独步)
    {
      id: "dbxsc",
      name: "独步小说网",
      version: 1,
      match: {
        pattern: "https?://www.dbxsc.com/book/.*?/.*?\\.html"
      },
      content: {
        selector: "#cont-body"
      },
      navigation: {
        next: ".col-md-6.text-center a:last",
        prev: ".col-md-6.text-center a:first"
      },
      meta: { source: "builtin", exampleUrl: "https://www.dbxsc.com/book/p1693/565590.html" }
    },
    // Ixdzs (爱下电子书)
    {
      id: "ixdzs",
      name: "爱下电子书",
      version: 1,
      match: {
        pattern: "https://ixdzs8.com/read/\\d+/p\\d+.html"
      },
      content: {
        selector: ".page-content section"
      },
      navigation: {
        next: ".chapter-next",
        prev: ".chapter-pre",
        index: "a:contains(书籍页)"
      },
      meta: { source: "builtin", exampleUrl: "https://ixdzs8.com/read/42730/p1.html" }
    },
    // Qisxs (奇书网)
    {
      id: "qisxs",
      name: "奇书网",
      version: 1,
      match: {
        pattern: "https://www.qisxs.com/.*?/\\d+.html"
      },
      content: {
        selector: ".box_box"
      },
      title: {
        bookSelector: ".info a"
      },
      meta: { source: "builtin", exampleUrl: "https://www.qisxs.com/shenhaiyujin/7570735.html" }
    },
    // UUread
    {
      id: "uuread",
      name: "UU看书",
      version: 1,
      match: {
        pattern: "https://www\\.uuread\\.tw/chapter/\\d+/\\d+(_\\d+)?\\.html"
      },
      content: {
        selector: ".txt_tcontent"
      },
      navigation: {
        next: "a.btn-primary:nth-child(4)",
        prev: "a.btn-primary:nth-child(1)",
        index: "a.btn-primary:nth-child(3)"
      },
      title: {
        selector: ".chatit",
        bookSelector: ".bread > li:nth-child(4) > a:nth-child(1)"
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.uuread.tw/chapter/11681/3006418.html" }
    },
    // ==================== Section-related rules (checkSection/noSection) ====================
    // 小说321 - checkSection
    {
      id: "xs321",
      name: "小说321",
      version: 1,
      match: {
        pattern: "https?://www\\.xs321\\.net/book/\\d+/\\d+/\\d+(_\\d+)?\\.html"
      },
      content: {
        selector: "#content"
      },
      processing: {
        useSiteFont: true
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "http://www.xs321.net/book/671/671539/1.html" }
    },
    // 622中文
    {
      id: "622zw",
      name: "622中文",
      version: 1,
      match: {
        pattern: "https://www.622zw.com/books/\\d+/\\d+(_)?\\d+.html"
      },
      content: {
        selector: "#content"
      },
      title: {
        selector: ".reader-main h1.title"
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.622zw.com/books/175956/57627355.html" }
    },
    // 逛笔趣阁
    {
      id: "fkxs",
      name: "逛笔趣阁小说网",
      version: 1,
      match: {
        pattern: "https?://www\\.fkxs\\.net/.*?/.*?\\.html"
      },
      content: {
        selector: ".content"
      },
      navigation: {
        next: ".bottem2 a:nth-child(4)",
        prev: ".bottem2 a:nth-child(2)",
        index: ".bottem2 a:nth-child(3)"
      },
      title: {
        selector: ".bookname h1"
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.fkxs.net/241_241951/117822179.html" }
    },
    // 永久看小说 (09kan.com - 原09k.net已重定向)
    {
      id: "09k",
      name: "永久看小说",
      version: 1,
      match: {
        pattern: "https://www.(09k|09kan).net/kkb/\\d+/\\d+(-\\d+)?.html"
      },
      content: {
        selector: "#content"
      },
      navigation: {
        next: "#PageSet a:contains('下'):contains('页')",
        prev: "#PageSet a:contains('上'):contains('页')"
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.09k.net/kkb/021338893523/56870262.html" }
    },
    // 语录书院
    {
      id: "yulusy",
      name: "语录书院",
      version: 1,
      match: {
        pattern: "https://www.yulusy.com/yulus/\\d+/.*?.html"
      },
      content: {
        selector: "#content"
      },
      navigation: {
        next: "#PageSet a:contains('下'):contains('页')",
        prev: "#PageSet a:contains('上'):contains('页')"
      },
      advanced: {
        checkSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://www.yulusy.com/yulus/17410287770/59700783-2.html"
      }
    },
    // 乐文小说
    {
      id: "ilwxs",
      name: "乐文小说",
      version: 1,
      match: {
        pattern: "https://m\\.ilwxs\\.com/shu/\\d+/\\d+\\.html"
      },
      content: {
        selector: ".content"
      },
      navigation: {
        next: "div.pager:nth-child(5) > a:nth-child(3)",
        prev: "div.pager:nth-child(5) > a:nth-child(1)",
        index: "div.pager:nth-child(5) > a:nth-child(2)"
      },
      title: {
        selector: ".headline",
        bookSelector: ".path > a:nth-child(2)"
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://m.ilwxs.com/shu/36354/171272950.html" }
    },
    // 书海阁
    {
      id: "shuhaige",
      name: "书海阁",
      version: 1,
      match: {
        pattern: "https://m\\.shuhaige\\.net/\\d+/\\d+(_\\d+)?\\.html"
      },
      content: {
        selector: ".content"
      },
      navigation: {
        next: "div.pager:nth-child(5) > a:nth-child(3)",
        prev: "div.pager:nth-child(5) > a:nth-child(1)",
        index: "div.pager:nth-child(5) > a:nth-child(2)"
      },
      title: {
        selector: ".headline",
        bookSelector: ".path > a:nth-child(2)"
      },
      advanced: {
        checkSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://m.shuhaige.net/36354/171272950.html" }
    },
    // ==================== noSection rules (不合并分页) ====================
    // 努努书坊
    {
      id: "kanunu-nosection",
      name: "努努书坊",
      version: 1,
      match: {
        pattern: "^https?://(?:book\\.kanunu\\.org|www\\.kanunu8\\.com)/.*/\\d+\\.html"
      },
      content: {
        selector: "table:eq(4) p"
      },
      navigation: {
        index: "a[href^='./']"
      },
      title: {
        pattern: "(.*) - (.*) - 小说在线阅读 - .* - 努努书坊"
      },
      advanced: {
        noSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.kanunu8.com/book3/7748/170164.html" }
    },
    // 飞速中文
    {
      id: "feiazw",
      name: "飞速中文",
      version: 1,
      match: {
        pattern: "https://(?:www.)?(?:feiazw|feibzw|xn--fiq228cu93a4kh).com/Html/\\d+/\\d+.html"
      },
      content: {
        selector: "#content",
        remove: "p[style], .l"
      },
      advanced: {
        noSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.feiazw.com/Html/21975/18399024.html" }
    },
    // 顶点小说
    {
      id: "ddxs",
      name: "顶点小说",
      version: 1,
      match: {
        pattern: "https?://www\\.ddxs\\.com/.*?/\\d+.html"
      },
      content: {
        selector: "#contents"
      },
      title: {
        bookSelector: "dl > dt > a:last"
      },
      advanced: {
        noSection: true
      },
      meta: { source: "builtin", exampleUrl: "http://www.ddxs.com/yuanzun/1.html" }
    },
    // 轻小说文库 (wenku8) - noSection
    {
      id: "wenku8-nosection",
      name: "轻小说文库",
      version: 1,
      match: {
        pattern: "https://www\\.wenku8\\.net/novel/\\d+/\\d+/\\d+\\.htm"
      },
      content: {
        selector: "#content"
      },
      navigation: {
        next: "#footlink > a:nth-child(4)",
        prev: "#foottext > a:nth-child(3)",
        index: "#footlink > a:nth-child(5)"
      },
      title: {
        selector: "#title",
        bookSelector: "#linkleft > a:nth-child(3)"
      },
      advanced: {
        noSection: true
      },
      meta: { source: "builtin", exampleUrl: "https://www.wenku8.net/novel/2/2449/91347.htm" }
    }
  ];
  const builtInRules = [...specialRules, ...simplifiedRules];
  class GMStorageDriver {
    constructor(prefix = STORAGE_KEYS.RULE_PREFIX) {
      this.prefix = prefix;
    }
    async get(key) {
      try {
        const data = GM_getValue(this.prefix + key, null);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    }
    async set(key, rule) {
      GM_setValue(this.prefix + key, JSON.stringify(rule));
    }
    async delete(key) {
      GM_deleteValue(this.prefix + key);
    }
    async getAll() {
      const result = /* @__PURE__ */ new Map();
      const keys = await this.getAllKeys();
      for (const key of keys) {
        const rule = await this.get(key);
        if (rule) {
          result.set(key, rule);
        }
      }
      return result;
    }
    async getAllKeys() {
      const allKeys = GM_listValues();
      return allKeys.filter((k) => k.startsWith(this.prefix)).map((k) => k.slice(this.prefix.length));
    }
    async clear() {
      const keys = await this.getAllKeys();
      for (const key of keys) {
        await this.delete(key);
      }
    }
  }
  class IndexedDBDriver {
    constructor(dbName = "MyNovelReader", storeName = "rules") {
      this.db = null;
      this.dbName = dbName;
      this.storeName = storeName;
    }
    async getDB() {
      if (this.db) return this.db;
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "id" });
          }
        };
      });
    }
    async get(key) {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
    }
    async set(key, rule) {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const ruleWithKey = { ...rule, id: key };
        const request = store.put(ruleWithKey);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
    async delete(key) {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
    async getAll() {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = /* @__PURE__ */ new Map();
          for (const rule of request.result) {
            result.set(rule.id, rule);
          }
          resolve(result);
        };
      });
    }
    async getAllKeys() {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    }
    async clear() {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
  }
  class RuleStorage {
    constructor() {
      if (typeof indexedDB !== "undefined") {
        this.driver = new IndexedDBDriver();
      } else {
        this.driver = new GMStorageDriver();
      }
    }
    /**
     * Get a rule by domain
     */
    async getUserRule(domain) {
      return this.driver.get(domain);
    }
    /**
     * Save a user rule for a domain
     */
    async saveUserRule(domain, rule) {
      rule.meta = {
        ...rule.meta,
        source: "user",
        updated: Date.now()
      };
      rule.id = domain;
      await this.driver.set(domain, rule);
    }
    /**
     * Delete a user rule
     */
    async deleteUserRule(domain) {
      await this.driver.delete(domain);
    }
    /**
     * Get all user rules
     */
    async getAllUserRules() {
      return this.driver.getAll();
    }
    /**
     * Get all rule domains
     */
    async getAllDomains() {
      return this.driver.getAllKeys();
    }
    /**
     * Clear all user rules
     */
    async clearAllRules() {
      await this.driver.clear();
    }
    /**
     * Export rules as JSON
     */
    async exportRules() {
      const rules = await this.driver.getAll();
      const rulesArray = Array.from(rules.values());
      return JSON.stringify(rulesArray, null, 2);
    }
    /**
     * Import rules from JSON
     */
    async importRules(json, overwrite = false) {
      const rules = JSON.parse(json);
      let count = 0;
      for (const rule of rules) {
        if (!rule.id) continue;
        if (!overwrite) {
          const existing = await this.driver.get(rule.id);
          if (existing) continue;
        }
        await this.driver.set(rule.id, rule);
        count++;
      }
      return count;
    }
  }
  function globToRegex(glob) {
    const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".");
    return new RegExp(`^${escaped}$`, "i");
  }
  function toRegExp(pattern, type = "regex") {
    if (type === "glob") {
      return globToRegex(pattern);
    }
    return new RegExp(pattern, "i");
  }
  class RuleManager {
    constructor() {
      this.builtInRules = [];
      this.communityRules = [];
      this.userRulesCache = /* @__PURE__ */ new Map();
      this.initialized = false;
      this.storage = new RuleStorage();
    }
    /**
     * Initialize the rule manager
     * Loads all rules from various sources
     */
    async initialize() {
      if (this.initialized) return;
      this.userRulesCache = await this.storage.getAllUserRules();
      this.builtInRules = await this.loadBuiltInRules();
      this.loadCommunityRules().catch(() => {
      });
      this.initialized = true;
    }
    /**
     * Match a URL against all rules
     * Priority: user > community > builtin
     */
    async matchRule(url) {
      if (!this.initialized) {
        await this.initialize();
      }
      const domain = this.extractDomain(url);
      const userRule = this.userRulesCache.get(domain);
      if (userRule && this.matchesUrl(userRule, url)) {
        return {
          rule: userRule,
          source: "user",
          matchedPattern: userRule.match.pattern
        };
      }
      for (const [, rule] of this.userRulesCache) {
        if (this.matchesUrl(rule, url)) {
          return {
            rule,
            source: "user",
            matchedPattern: rule.match.pattern
          };
        }
      }
      for (const rule of this.communityRules) {
        if (this.matchesUrl(rule, url)) {
          return {
            rule,
            source: "community",
            matchedPattern: rule.match.pattern
          };
        }
      }
      for (const rule of this.builtInRules) {
        if (this.matchesUrl(rule, url)) {
          return {
            rule,
            source: "builtin",
            matchedPattern: rule.match.pattern
          };
        }
      }
      return null;
    }
    /**
     * Check if a rule matches a URL
     */
    matchesUrl(rule, url) {
      try {
        const regex = toRegExp(rule.match.pattern, rule.match.type);
        if (!regex.test(url)) return false;
        if (rule.match.exclude) {
          for (const exclude of rule.match.exclude) {
            if (new RegExp(exclude, "i").test(url)) {
              return false;
            }
          }
        }
        return true;
      } catch {
        return false;
      }
    }
    /**
     * Save a user rule
     */
    async saveUserRule(domain, rule) {
      await this.storage.saveUserRule(domain, rule);
      this.userRulesCache.set(domain, rule);
    }
    /**
     * Delete a user rule
     */
    async deleteUserRule(domain) {
      await this.storage.deleteUserRule(domain);
      this.userRulesCache.delete(domain);
    }
    /**
     * Get a user rule by domain
     */
    getUserRule(domain) {
      return this.userRulesCache.get(domain);
    }
    /**
     * Get all user rules
     */
    getAllUserRules() {
      return this.userRulesCache;
    }
    /**
     * Get all built-in rules
     */
    getBuiltInRules() {
      return this.builtInRules;
    }
    /**
     * Get the storage instance
     */
    getStorage() {
      return this.storage;
    }
    /**
     * Load built-in rules
     * Uses curated rules from builtInRules.ts (already in v2 format)
     */
    async loadBuiltInRules() {
      return builtInRules;
    }
    /**
     * Load community rules from remote URL
     */
    async loadCommunityRules() {
      try {
        const response = await fetch(DEFAULT_COMMUNITY_RULES_URL);
        if (!response.ok) return;
        const rules = await response.json();
        this.communityRules = rules.filter(this.validateRule);
      } catch {
      }
    }
    /**
     * Validate a rule has required fields
     */
    validateRule(rule) {
      var _a, _b;
      return !!(rule.id && ((_a = rule.match) == null ? void 0 : _a.pattern) && ((_b = rule.content) == null ? void 0 : _b.selector));
    }
    /**
     * Extract domain from URL
     */
    extractDomain(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    }
    /**
     * Export all user rules
     */
    async exportUserRules() {
      return this.storage.exportRules();
    }
    /**
     * Import user rules
     */
    async importUserRules(json, overwrite = false) {
      const count = await this.storage.importRules(json, overwrite);
      this.userRulesCache = await this.storage.getAllUserRules();
      return count;
    }
    /**
     * Clear all user rules
     */
    async clearUserRules() {
      await this.storage.clearAllRules();
      this.userRulesCache.clear();
    }
    /**
     * Get statistics
     */
    getStats() {
      return {
        user: this.userRulesCache.size,
        community: this.communityRules.length,
        builtin: this.builtInRules.length
      };
    }
  }
  let ruleManagerInstance = null;
  function getRuleManager() {
    if (!ruleManagerInstance) {
      ruleManagerInstance = new RuleManager();
    }
    return ruleManagerInstance;
  }
  class Parser {
    constructor(options = {}) {
      this.detectionEngine = new DetectionEngine();
      this.contentProcessor = new ContentProcessor(options.processing);
      this.options = options;
    }
    /**
     * Parse the current page
     */
    async parse(doc2 = document, explicitUrl) {
      var _a;
      const url = explicitUrl || ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const ruleManager = getRuleManager();
      await ruleManager.initialize();
      const ruleMatch = await ruleManager.matchRule(url);
      if (ruleMatch && !this.options.forceDetection) {
        return this.parseWithRule(doc2, url, ruleMatch);
      }
      return this.parseWithDetection(doc2, url);
    }
    /**
     * Parse using a matched rule
     */
    parseWithRule(doc2, url, ruleMatch) {
      var _a, _b, _c, _d, _e, _f, _g;
      const rule = ruleMatch.rule;
      const contentElement = this.selectElement(doc2, rule.content.selector);
      if (!contentElement) {
        return this.parseWithDetection(doc2, url, rule);
      }
      let navigation = this.extractNavigation(doc2, rule);
      if (!navigation.next || !navigation.prev) {
        const detectedNav = this.detectionEngine.detect(doc2).results.navigation;
        if (!navigation.next && ((_a = detectedNav.next) == null ? void 0 : _a.url)) {
          navigation.next = detectedNav.next.url;
        }
        if (!navigation.prev && ((_b = detectedNav.prev) == null ? void 0 : _b.url)) {
          navigation.prev = detectedNav.prev.url;
        }
        if (!navigation.index && ((_c = detectedNav.index) == null ? void 0 : _c.url)) {
          navigation.index = detectedNav.index.url;
        }
      }
      const title = this.extractTitle(doc2, rule);
      const processingOptions = {
        removeSelectors: rule.content.remove,
        replaceRules: rule.content.replace,
        removeAds: ((_d = rule.processing) == null ? void 0 : _d.removeAds) !== false,
        normalizeWhitespace: ((_e = rule.processing) == null ? void 0 : _e.normalizeWhitespace) !== false,
        fixImages: ((_f = rule.processing) == null ? void 0 : _f.fixImages) !== false,
        useRawContent: (_g = rule.processing) == null ? void 0 : _g.useRawContent,
        chapterTitle: title.chapter,
        bookTitle: title.book
      };
      this.contentProcessor.setOptions(processingOptions);
      const rawContent = contentElement.innerHTML;
      const content = this.contentProcessor.process(contentElement, doc2);
      return {
        title: title.chapter,
        bookTitle: title.book,
        content,
        rawContent,
        prevUrl: navigation.prev,
        nextUrl: navigation.next,
        indexUrl: navigation.index,
        url,
        confidence: 1,
        rule,
        method: "rule"
      };
    }
    /**
     * Parse using detection engine
     */
    parseWithDetection(doc2, url, fallbackRule) {
      var _a, _b, _c;
      const detection = this.detectionEngine.detect(doc2);
      if (!detection.results.content.element) {
        return null;
      }
      const contentElement = detection.results.content.element;
      const navigation = {
        prev: (_a = detection.results.navigation.prev) == null ? void 0 : _a.url,
        next: (_b = detection.results.navigation.next) == null ? void 0 : _b.url,
        index: (_c = detection.results.navigation.index) == null ? void 0 : _c.url
      };
      if (fallbackRule == null ? void 0 : fallbackRule.navigation) {
        const ruleNav = this.extractNavigation(doc2, fallbackRule);
        if (ruleNav.prev) navigation.prev = ruleNav.prev;
        if (ruleNav.next) navigation.next = ruleNav.next;
        if (ruleNav.index) navigation.index = ruleNav.index;
      }
      const chapterTitle = detection.results.title.chapterTitle || "";
      const bookTitle = detection.results.title.bookTitle;
      const processingOptions = {
        removeSelectors: fallbackRule == null ? void 0 : fallbackRule.content.remove,
        replaceRules: fallbackRule == null ? void 0 : fallbackRule.content.replace,
        chapterTitle,
        bookTitle
      };
      this.contentProcessor.setOptions(processingOptions);
      const rawContent = contentElement.innerHTML;
      const content = this.contentProcessor.process(contentElement, doc2);
      return {
        title: chapterTitle || "Unknown Chapter",
        bookTitle,
        content,
        rawContent,
        prevUrl: navigation.prev,
        nextUrl: navigation.next,
        indexUrl: navigation.index,
        url,
        confidence: detection.confidence.overall,
        rule: fallbackRule,
        method: fallbackRule ? "mixed" : "detection"
      };
    }
    /**
     * Quick check if page looks like a novel chapter
     */
    quickCheck(doc2 = document) {
      return this.detectionEngine.quickCheck(doc2);
    }
    /**
     * Get detection results without parsing
     */
    detect(doc2 = document) {
      return this.detectionEngine.detect(doc2);
    }
    /**
     * Extract navigation links using rule
     */
    extractNavigation(doc2, rule) {
      var _a, _b, _c;
      const result = {};
      if (((_a = rule.navigation) == null ? void 0 : _a.prev) && rule.navigation.prev !== false) {
        const el = this.selectElement(doc2, rule.navigation.prev);
        if (el instanceof HTMLAnchorElement) {
          result.prev = el.href;
        }
      }
      if (((_b = rule.navigation) == null ? void 0 : _b.next) && rule.navigation.next !== false) {
        const el = this.selectElement(doc2, rule.navigation.next);
        if (el instanceof HTMLAnchorElement) {
          result.next = el.href;
        }
      }
      if (((_c = rule.navigation) == null ? void 0 : _c.index) && rule.navigation.index !== false) {
        const el = this.selectElement(doc2, rule.navigation.index);
        if (el instanceof HTMLAnchorElement) {
          result.index = el.href;
        }
      }
      return result;
    }
    /**
     * Extract title using rule
     */
    extractTitle(doc2, rule) {
      var _a, _b, _c, _d, _e, _f;
      let chapter = "";
      let book;
      if ((_a = rule.title) == null ? void 0 : _a.selector) {
        const el = this.selectElement(doc2, rule.title.selector);
        if (el) {
          chapter = ((_b = el.textContent) == null ? void 0 : _b.trim()) || "";
        }
      }
      if (!chapter && ((_c = rule.title) == null ? void 0 : _c.pattern)) {
        const match = doc2.title.match(new RegExp(rule.title.pattern));
        if (match) {
          const patternIndex = rule.title.patternIndex ?? 1;
          chapter = match[patternIndex] || match[1] || match[0];
          const bookPatternIndex = rule.title.bookPatternIndex;
          if (bookPatternIndex && match[bookPatternIndex]) {
            book = match[bookPatternIndex];
          }
        }
      }
      if (!chapter) {
        const detection = this.detectionEngine.detect(doc2);
        chapter = detection.results.title.chapterTitle;
        book = book || detection.results.title.bookTitle;
      }
      if (!book && ((_d = rule.title) == null ? void 0 : _d.bookSelector)) {
        const el = this.selectElement(doc2, rule.title.bookSelector);
        if (el) {
          book = (_e = el.textContent) == null ? void 0 : _e.trim();
        }
      }
      if (((_f = rule.title) == null ? void 0 : _f.replace) && chapter) {
        try {
          chapter = chapter.replace(new RegExp(rule.title.replace), "").trim();
        } catch {
        }
      }
      return { chapter, book };
    }
    /**
     * Select element with error handling
     */
    selectElement(doc2, selector) {
      try {
        return doc2.querySelector(selector);
      } catch {
        return null;
      }
    }
    /**
     * Execute rule hooks
     */
    async executeHooks(rule, doc2, content) {
      var _a, _b;
      let result = content;
      if ((_a = rule.hooks) == null ? void 0 : _a.beforeParse) {
        try {
          const fn = new Function("doc", rule.hooks.beforeParse);
          fn(doc2);
        } catch (e) {
          console.warn("[Parser] beforeParse hook error:", e);
        }
      }
      if ((_b = rule.hooks) == null ? void 0 : _b.afterParse) {
        try {
          const fn = new Function("content", `return (${rule.hooks.afterParse})(content)`);
          result = fn(result) || result;
        } catch (e) {
          console.warn("[Parser] afterParse hook error:", e);
        }
      }
      return result;
    }
  }
  let parserInstance = null;
  function getParser() {
    if (!parserInstance) {
      parserInstance = new Parser();
    }
    return parserInstance;
  }
  const DEFAULT_OPTIONS$1 = {
    blockRedirects: true,
    enableRightClick: true,
    enableSelection: true,
    enableCopy: true,
    blockPopups: true,
    removeEventHijacking: true,
    blockVisibilityDetection: true
  };
  class SiteProtection {
    constructor(options = {}) {
      this.originalHandlers = /* @__PURE__ */ new Map();
      this.cleanupFunctions = [];
      this.isActive = false;
      this.options = { ...DEFAULT_OPTIONS$1, ...options };
    }
    /**
     * Activate all protection measures
     */
    activate() {
      if (this.isActive) return;
      this.isActive = true;
      if (this.options.blockRedirects) {
        this.blockRedirects();
      }
      if (this.options.enableRightClick) {
        this.enableRightClick();
      }
      if (this.options.enableSelection) {
        this.enableSelection();
      }
      if (this.options.enableCopy) {
        this.enableCopy();
      }
      if (this.options.blockPopups) {
        this.blockPopups();
      }
      if (this.options.removeEventHijacking) {
        this.removeEventHijacking();
      }
      if (this.options.blockVisibilityDetection) {
        this.blockVisibilityDetection();
      }
    }
    /**
     * Deactivate all protection measures
     */
    deactivate() {
      if (!this.isActive) return;
      this.cleanupFunctions.forEach((cleanup) => cleanup());
      this.cleanupFunctions = [];
      this.isActive = false;
    }
    /**
     * Block unwanted redirects (meta refresh, location change, etc.)
     */
    blockRedirects() {
      const metaRefresh = document.querySelectorAll('meta[http-equiv="refresh"]');
      metaRefresh.forEach((meta) => meta.remove());
      const originalAssign = window.location.assign.bind(window.location);
      const originalReplace = window.location.replace.bind(window.location);
      const isAllowedNavigation = (url) => {
        try {
          const targetUrl = new URL(url, window.location.href);
          if (targetUrl.origin === window.location.origin) {
            const blockedPatterns = [
              /ad[s]?[_-]?/i,
              /click[_-]?track/i,
              /redirect/i,
              /jump[_-]?to/i,
              /go[_-]?to[_-]?url/i,
              /link[_-]?out/i,
              /external/i
            ];
            return !blockedPatterns.some((p2) => p2.test(targetUrl.pathname));
          }
          return false;
        } catch {
          return false;
        }
      };
      let locationOverrideSucceeded = false;
      try {
        Object.defineProperty(window.location, "assign", {
          value: (url) => {
            if (isAllowedNavigation(url)) {
              originalAssign(url);
            }
          },
          writable: true,
          configurable: true
        });
        Object.defineProperty(window.location, "replace", {
          value: (url) => {
            if (isAllowedNavigation(url)) {
              originalReplace(url);
            }
          },
          writable: true,
          configurable: true
        });
        locationOverrideSucceeded = true;
      } catch {
      }
      const originalSetTimeout = window.setTimeout;
      const originalSetInterval = window.setInterval;
      const suspiciousPatterns = [/location\s*[.=]/i, /window\.open/i, /href\s*=/i, /navigate/i];
      const isSuspiciousCallback = (callback) => {
        if (typeof callback === "string") {
          return suspiciousPatterns.some((p2) => p2.test(callback));
        }
        return false;
      };
      window.setTimeout = (callback, delay, ...args) => {
        if (isSuspiciousCallback(callback) && (delay || 0) > 0) {
          return 0;
        }
        return originalSetTimeout(callback, delay, ...args);
      };
      window.setInterval = (callback, delay, ...args) => {
        if (isSuspiciousCallback(callback)) {
          return 0;
        }
        return originalSetInterval(callback, delay, ...args);
      };
      this.cleanupFunctions.push(() => {
        if (locationOverrideSucceeded) {
          try {
            Object.defineProperty(window.location, "assign", {
              value: originalAssign,
              writable: true,
              configurable: true
            });
            Object.defineProperty(window.location, "replace", {
              value: originalReplace,
              writable: true,
              configurable: true
            });
          } catch {
          }
        }
        window.setTimeout = originalSetTimeout;
        window.setInterval = originalSetInterval;
      });
    }
    /**
     * Enable right-click context menu
     */
    enableRightClick() {
      const handler = (e) => {
        e.stopPropagation();
        return true;
      };
      document.addEventListener("contextmenu", handler, true);
      const originalOnContextMenu = document.oncontextmenu;
      document.oncontextmenu = null;
      if (document.body) {
        document.body.oncontextmenu = null;
      }
      document.querySelectorAll("[oncontextmenu]").forEach((el) => {
        el.removeAttribute("oncontextmenu");
      });
      this.cleanupFunctions.push(() => {
        document.removeEventListener("contextmenu", handler, true);
        document.oncontextmenu = originalOnContextMenu;
      });
    }
    /**
     * Enable text selection
     */
    enableSelection() {
      const handler = (e) => {
        e.stopPropagation();
        return true;
      };
      document.addEventListener("selectstart", handler, true);
      const style = document.createElement("style");
      style.id = "mnr-enable-selection";
      style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
      document.head.appendChild(style);
      document.querySelectorAll("[onselectstart]").forEach((el) => {
        el.removeAttribute("onselectstart");
      });
      document.querySelectorAll("[unselectable]").forEach((el) => {
        el.removeAttribute("unselectable");
      });
      this.cleanupFunctions.push(() => {
        document.removeEventListener("selectstart", handler, true);
        style.remove();
      });
    }
    /**
     * Enable copy functionality
     */
    enableCopy() {
      const handler = (e) => {
        e.stopPropagation();
        return true;
      };
      document.addEventListener("copy", handler, true);
      document.addEventListener("cut", handler, true);
      document.querySelectorAll("[oncopy], [oncut]").forEach((el) => {
        el.removeAttribute("oncopy");
        el.removeAttribute("oncut");
      });
      this.cleanupFunctions.push(() => {
        document.removeEventListener("copy", handler, true);
        document.removeEventListener("cut", handler, true);
      });
    }
    /**
     * Block popup windows
     */
    blockPopups() {
      const originalOpen = window.open;
      window.open = (url, target, features) => {
        var _a;
        const isTrusted = (_a = window.event) == null ? void 0 : _a.isTrusted;
        if (isTrusted) {
          const urlStr = (url == null ? void 0 : url.toString()) || "";
          try {
            const targetUrl = new URL(urlStr, window.location.href);
            if (targetUrl.origin === window.location.origin) {
              return originalOpen.call(window, url, target, features);
            }
          } catch {
          }
        }
        return null;
      };
      this.cleanupFunctions.push(() => {
        window.open = originalOpen;
      });
    }
    /**
     * Remove event hijacking (click interception, etc.)
     */
    removeEventHijacking() {
      const clickBlocker = (e) => {
        const target = e.target;
        const clickableParent = target.closest('a, button, [role="button"]');
        if (clickableParent) {
          if (clickableParent instanceof HTMLAnchorElement) {
            const href = clickableParent.getAttribute("href");
            if (href && !href.startsWith("javascript:") && href !== "#") {
              return true;
            }
          }
        }
        if (e.target === document.body || e.target === document.documentElement) {
          e.stopPropagation();
        }
      };
      document.addEventListener("click", clickBlocker, true);
      if (document.body) {
        document.body.onclick = null;
      }
      document.documentElement.onclick = null;
      const mouseBlocker = (e) => {
        if (e.target === document.body || e.target === document.documentElement) {
          e.stopPropagation();
        }
      };
      document.addEventListener("mousedown", mouseBlocker, true);
      document.addEventListener("mouseup", mouseBlocker, true);
      this.cleanupFunctions.push(() => {
        document.removeEventListener("click", clickBlocker, true);
        document.removeEventListener("mousedown", mouseBlocker, true);
        document.removeEventListener("mouseup", mouseBlocker, true);
      });
    }
    /**
     * Block visibility change detection (prevents pausing/ads on tab switch)
     */
    blockVisibilityDetection() {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => false
      });
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "visible"
      });
      const visibilityBlocker = (e) => {
        e.stopImmediatePropagation();
      };
      document.addEventListener("visibilitychange", visibilityBlocker, true);
      const blurBlocker = (e) => {
        if (e.target === window || e.target === document) {
          e.stopImmediatePropagation();
        }
      };
      window.addEventListener("blur", blurBlocker, true);
      window.addEventListener("focus", blurBlocker, true);
      this.cleanupFunctions.push(() => {
        document.removeEventListener("visibilitychange", visibilityBlocker, true);
        window.removeEventListener("blur", blurBlocker, true);
        window.removeEventListener("focus", blurBlocker, true);
      });
    }
    /**
     * Remove all annoying overlays (ad overlays, modal blockers)
     */
    removeOverlays() {
      const overlaySelectors = [
        // Common overlay classes/ids
        '[class*="overlay"]',
        '[class*="modal"]',
        '[class*="popup"]',
        '[class*="mask"]',
        '[class*="blocker"]',
        '[id*="overlay"]',
        '[id*="modal"]',
        '[id*="popup"]'
        // Fixed/absolute position elements covering viewport
      ];
      document.querySelectorAll(overlaySelectors.join(", ")).forEach((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const isFullPage = rect.width >= window.innerWidth * 0.8 && rect.height >= window.innerHeight * 0.8;
        const isFixed = style.position === "fixed" || style.position === "absolute";
        const hasHighZIndex = parseInt(style.zIndex) > 1e3;
        if (isFullPage && isFixed && hasHighZIndex) {
          el.style.display = "none";
        }
      });
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    /**
     * Clean up suspicious scripts
     */
    cleanupScripts() {
      const suspiciousPatterns = [/ad[s]?\./i, /track(er|ing)/i, /analytics/i, /popup/i, /redirect/i];
      document.querySelectorAll("script[src]").forEach((script) => {
        const src = script.getAttribute("src") || "";
        if (suspiciousPatterns.some((p2) => p2.test(src))) {
          script.remove();
        }
      });
    }
  }
  let protectionInstance = null;
  function getSiteProtection() {
    if (!protectionInstance) {
      protectionInstance = new SiteProtection();
    }
    return protectionInstance;
  }
  const DEFAULT_OPTIONS = {
    confidenceThreshold: 0.6,
    autoLaunchThreshold: 0.9,
    enableProtection: true,
    skipPatterns: [
      /\/(login|register|auth|account)/i,
      /\/(search|find)/i,
      /\/(cart|checkout|pay)/i,
      /\/(user|profile|setting)/i,
      /\/(forum|comment|review)/i,
      /\/(download|upload)/i
    ]
  };
  class AutoEnableManager {
    constructor(options = {}) {
      this.hasRun = false;
      this.options = { ...DEFAULT_OPTIONS, ...options };
      this.detectionEngine = new DetectionEngine();
      this.parser = new Parser({
        forceDetection: options.forceDetection
      });
    }
    /**
     * Set the callback for prompting user
     */
    setPromptCallback(callback) {
      this.promptCallback = callback;
    }
    /**
     * Set the callback for launching reader
     */
    setLaunchCallback(callback) {
      this.launchCallback = callback;
    }
    /**
     * Run the auto-enable check
     */
    async check(doc2 = document) {
      var _a, _b, _c;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      if (this.shouldSkip(url)) {
        return {
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["URL matches skip pattern"]
        };
      }
      if (!this.detectionEngine.quickCheck(doc2)) {
        return {
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["Page does not appear to be novel content"]
        };
      }
      if (!this.options.forceDetection) {
        const ruleManager = getRuleManager();
        await ruleManager.initialize();
        const ruleMatch = await ruleManager.matchRule(url);
        if (ruleMatch) {
          const decision2 = {
            shouldEnable: true,
            method: ((_b = ruleMatch.rule.meta) == null ? void 0 : _b.source) === "user" ? "user-rule" : "builtin-rule",
            confidence: 1,
            rule: ruleMatch.rule,
            reasons: [
              `Matched ${((_c = ruleMatch.rule.meta) == null ? void 0 : _c.source) || "builtin"} rule: ${ruleMatch.rule.name || ruleMatch.rule.id}`
            ]
          };
          this.currentDecision = decision2;
          return decision2;
        }
      }
      const detection = this.detectionEngine.detect(doc2);
      const decision = {
        shouldEnable: detection.confidence.overall >= (this.options.confidenceThreshold || 0.6),
        method: "detection",
        confidence: detection.confidence.overall,
        detection,
        reasons: detection.confidence.reasons
      };
      this.currentDecision = decision;
      return decision;
    }
    /**
     * Execute the auto-enable flow
     */
    async execute(doc2 = document) {
      if (this.hasRun) {
        return;
      }
      this.hasRun = true;
      const decision = await this.check(doc2);
      if (!decision.shouldEnable) {
        return;
      }
      if (this.options.enableProtection) {
        const protection = getSiteProtection();
        protection.activate();
        protection.removeOverlays();
      }
      const shouldAutoLaunch = decision.method === "user-rule" || decision.method === "builtin-rule" || decision.confidence >= (this.options.autoLaunchThreshold || 0.9);
      if (shouldAutoLaunch) {
        await this.launch(doc2, decision);
        return;
      }
      if (this.promptCallback) {
        const response = await this.promptCallback(decision);
        if (response.accepted) {
          if (response.saveForDomain) {
            await this.saveRuleForCurrentSite(doc2, decision);
          }
          await this.launch(doc2, decision);
        }
      }
    }
    /**
     * Launch the reader
     */
    async launch(doc2, decision) {
      try {
        const chapter = await this.parser.parse(doc2);
        if (chapter && this.launchCallback) {
          this.launchCallback(chapter, decision.rule);
        }
      } catch (e) {
        console.error("[AutoEnableManager] Parse error:", e);
      }
    }
    /**
     * Save detection result as user rule for current site
     */
    async saveRuleForCurrentSite(doc2, decision) {
      var _a;
      if (!decision.detection) return;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const hostname = new URL(url).hostname;
      const rule = this.createRuleFromDetection(hostname, decision.detection);
      const ruleManager = getRuleManager();
      await ruleManager.saveUserRule(hostname, rule);
    }
    /**
     * Create a SiteRule from detection results
     */
    createRuleFromDetection(hostname, detection) {
      var _a, _b, _c;
      const content = detection.results.content;
      const navigation = detection.results.navigation;
      const title = detection.results.title;
      const hostPattern = hostname.replace(/\./g, "\\.");
      const rule = {
        id: `user-${hostname}-${Date.now()}`,
        name: `Auto-generated rule for ${hostname}`,
        version: 1,
        match: {
          pattern: `^https?://${hostPattern}/`,
          type: "regex"
        },
        content: {
          selector: content.selector || "#content"
        },
        meta: {
          source: "user",
          autoLaunch: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      if (navigation.next || navigation.prev || navigation.index) {
        rule.navigation = {};
        if ((_a = navigation.next) == null ? void 0 : _a.selector) {
          rule.navigation.next = navigation.next.selector;
        }
        if ((_b = navigation.prev) == null ? void 0 : _b.selector) {
          rule.navigation.prev = navigation.prev.selector;
        }
        if ((_c = navigation.index) == null ? void 0 : _c.selector) {
          rule.navigation.index = navigation.index.selector;
        }
      }
      if (title.selector) {
        rule.title = {
          selector: title.selector
        };
      }
      return rule;
    }
    /**
     * Check if URL should be skipped
     */
    shouldSkip(url) {
      return (this.options.skipPatterns || []).some((pattern) => pattern.test(url));
    }
    /**
     * Get the current decision
     */
    getDecision() {
      return this.currentDecision;
    }
    /**
     * Reset manager state (for testing)
     */
    reset() {
      this.hasRun = false;
      this.currentDecision = void 0;
    }
    /**
     * Manual enable (force launch without detection)
     */
    async manualEnable(doc2 = document) {
      if (this.options.enableProtection) {
        const protection = getSiteProtection();
        protection.activate();
        protection.removeOverlays();
      }
      try {
        const chapter = await this.parser.parse(doc2);
        if (chapter && this.launchCallback) {
          this.launchCallback(chapter, void 0);
        }
      } catch (e) {
        console.error("[AutoEnableManager] Manual enable error:", e);
      }
    }
  }
  let managerInstance = null;
  function getAutoEnableManager(options) {
    if (!managerInstance) {
      managerInstance = new AutoEnableManager(options);
    }
    return managerInstance;
  }
  const VERSION = "9.0.0";
  const BUILD_DATE = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  /**
  * @vue/shared v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
  };
  const camelizeRE = /-\w/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject$1(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  /**
  * @vue/reactivity v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this._on = 0;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      if (this._on > 0 && --this._on === 0) {
        activeEffectScope = this.prevScope;
        this.prevScope = void 0;
      }
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn, failSilently = false) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }
  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed2 = false) {
    sub.flags |= 8;
    if (isComputed2) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= -17;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
      return;
    }
    computed2.flags |= 2;
    const dep = computed2.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || hasChanged(value, computed2._value)) {
        computed2.flags |= 128;
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      this.__v_skip = true;
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (false) ;
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed2 = link.dep.computed;
      if (computed2 && !link.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    ""
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    ""
  );
  const ARRAY_ITERATE_KEY = Symbol(
    ""
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track();
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger();
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function getDepFromReactive(object, key) {
    const depMap = targetMap.get(object);
    return depMap && depMap.get(key);
  }
  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  function toWrapped(target, item) {
    if (isReadonly(target)) {
      return isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
    }
    return toReactive(item);
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toWrapped(this, value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(
        this,
        "filter",
        fn,
        thisArg,
        (v) => v.map((item) => toWrapped(this, item)),
        arguments
      );
    },
    find(fn, thisArg) {
      return apply(
        this,
        "find",
        fn,
        thisArg,
        (item) => toWrapped(this, item),
        arguments
      );
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(
        this,
        "findLast",
        fn,
        thisArg,
        (item) => toWrapped(this, item),
        arguments
      );
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimization required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", (item) => toWrapped(this, item));
    }
  };
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (!result.done) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toWrapped(self2, item), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn;
    if (arr !== self2) {
      if (!isShallow(self2)) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, toWrapped(self2, item), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = toRaw(self2)[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        const value = targetIsArray && isIntegerKey(key) ? res : res.value;
        return isReadonly2 && isObject(value) ? readonly(value) : value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArrayWithIntegerKey && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0);
          }
          return result;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  function ref(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track();
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger();
        }
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  function toRefs(object) {
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = propertyToRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this["__v_isRef"] = true;
      this._value = void 0;
      this._raw = toRaw(_object);
      let shallow = true;
      let obj = _object;
      if (!isArray(_object) || !isIntegerKey(String(_key))) {
        do {
          shallow = !isProxy(obj) || isShallow(obj);
        } while (shallow && (obj = obj["__v_raw"]));
      }
      this._shallow = shallow;
    }
    get value() {
      let val = this._object[this._key];
      if (this._shallow) {
        val = unref(val);
      }
      return this._value = val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      if (this._shallow && isRef(this._raw[this._key])) {
        const nestedRef = this._object[this._key];
        if (isRef(nestedRef)) {
          nestedRef.value = newVal;
          return;
        }
      }
      this._object[this._key] = newVal;
    }
    get dep() {
      return getDepFromReactive(this._raw, this._key);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    return new ObjectRefImpl(source, key, defaultValue);
  }
  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
      this.next = void 0;
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track();
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    }
  }
  function watch$1(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject$1(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  /**
  * @vue/runtime-core v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
    if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (false) ;
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs();
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        const target = select(targetSelector);
        return target;
      }
    } else {
      return targetSelector;
    }
  };
  const TeleportImpl = {
    name: "Teleport",
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
      const {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: { insert, querySelector, createText, createComment }
      } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if (n1 == null) {
        const placeholder = n2.el = createText("");
        const mainAnchor = n2.anchor = createText("");
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(
              children,
              container2,
              anchor2,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        };
        const mountToTarget = () => {
          const target = n2.target = resolveTarget(n2.props, querySelector);
          const targetAnchor = prepareAnchor(target, n2, createText, insert);
          if (target) {
            if (namespace !== "svg" && isTargetSVG(target)) {
              namespace = "svg";
            } else if (namespace !== "mathml" && isTargetMathML(target)) {
              namespace = "mathml";
            }
            if (parentComponent && parentComponent.isCE) {
              (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = /* @__PURE__ */ new Set())).add(target);
            }
            if (!disabled) {
              mount(target, targetAnchor);
              updateCssVars(n2, false);
            }
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
          updateCssVars(n2, true);
        }
        if (isTeleportDeferred(n2.props)) {
          n2.el.__isMounted = false;
          queuePostRenderEffect(() => {
            mountToTarget();
            delete n2.el.__isMounted;
          }, parentSuspense);
        } else {
          mountToTarget();
        }
      } else {
        if (isTeleportDeferred(n2.props) && n1.el.__isMounted === false) {
          queuePostRenderEffect(() => {
            TeleportImpl.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          }, parentSuspense);
          return;
        }
        n2.el = n1.el;
        n2.targetStart = n1.targetStart;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            currentContainer,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            currentContainer,
            currentAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            false
          );
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
            );
          } else {
            if (n2.props && n1.props && n2.props.to !== n1.props.to) {
              n2.props.to = n1.props.to;
            }
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(
              n2.props,
              querySelector
            );
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
              );
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
            );
          }
        }
        updateCssVars(n2, disabled);
      }
    },
    remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const {
        shapeFlag,
        children,
        anchor,
        targetStart,
        targetAnchor,
        target,
        props
      } = vnode;
      if (target) {
        hostRemove(targetStart);
        hostRemove(targetAnchor);
      }
      doRemove && hostRemove(anchor);
      if (shapeFlag & 16) {
        const shouldRemove = doRemove || !isTeleportDisabled(props);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            shouldRemove,
            !!child.dynamicChildren
          );
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(
            children[i],
            container,
            parentAnchor,
            2
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
    o: { nextSibling, parentNode, querySelector, insert, createText }
  }, hydrateChildren) {
    function hydrateDisabledTeleport(node2, vnode2, targetStart, targetAnchor) {
      vnode2.anchor = hydrateChildren(
        nextSibling(node2),
        vnode2,
        parentNode(node2),
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
      vnode2.targetStart = targetStart;
      vnode2.targetAnchor = targetAnchor;
    }
    const target = vnode.target = resolveTarget(
      vnode.props,
      querySelector
    );
    const disabled = isTeleportDisabled(vnode.props);
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (disabled) {
          hydrateDisabledTeleport(
            node,
            vnode,
            targetNode,
            targetNode && nextSibling(targetNode)
          );
        } else {
          vnode.anchor = nextSibling(node);
          let targetAnchor = targetNode;
          while (targetAnchor) {
            if (targetAnchor && targetAnchor.nodeType === 8) {
              if (targetAnchor.data === "teleport start anchor") {
                vnode.targetStart = targetAnchor;
              } else if (targetAnchor.data === "teleport anchor") {
                vnode.targetAnchor = targetAnchor;
                target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
                break;
              }
            }
            targetAnchor = nextSibling(targetAnchor);
          }
          if (!vnode.targetAnchor) {
            prepareAnchor(target, vnode, createText, insert);
          }
          hydrateChildren(
            targetNode && nextSibling(targetNode),
            vnode,
            target,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
      }
      updateCssVars(vnode, disabled);
    } else if (disabled) {
      if (vnode.shapeFlag & 16) {
        hydrateDisabledTeleport(node, vnode, node, nextSibling(node));
      }
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  function updateCssVars(vnode, isDisabled) {
    const ctx = vnode.ctx;
    if (ctx && ctx.ut) {
      let node, anchor;
      if (isDisabled) {
        node = vnode.el;
        anchor = vnode.anchor;
      } else {
        node = vnode.targetStart;
        anchor = vnode.targetAnchor;
      }
      while (node && node !== anchor) {
        if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
        node = node.nextSibling;
      }
      ctx.ut();
    }
  }
  function prepareAnchor(target, vnode, createText, insert) {
    const targetStart = vnode.targetStart = createText("");
    const targetAnchor = vnode.targetAnchor = createText("");
    targetStart[TeleportEndKey] = targetAnchor;
    if (target) {
      insert(targetStart, target);
      insert(targetAnchor, target);
    }
    return targetAnchor;
  }
  const leaveCbKey = Symbol("_leaveCb");
  const enterCbKey = Symbol("_enterCb");
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const recursiveGetSubtree = (instance) => {
    const subTree = instance.subTree;
    return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        const child = findNonCommentChild(children);
        const rawProps = toRaw(props);
        const { mode } = rawProps;
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getInnerChild$1(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        let enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance,
          // #11061, ensure enterHooks is fresh after clone
          (hooks) => enterHooks = hooks
        );
        if (innerChild.type !== Comment) {
          setTransitionHooks(innerChild, enterHooks);
        }
        let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
        if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
          let leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in" && innerChild.type !== Comment) {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (!(instance.job.flags & 8)) {
                instance.update();
              }
              delete leavingHooks.afterLeave;
              oldInnerChild = void 0;
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el[leaveCbKey] = () => {
                earlyRemove();
                el[leaveCbKey] = void 0;
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
              enterHooks.delayedLeave = () => {
                delayedLeave();
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
            };
          } else {
            oldInnerChild = void 0;
          }
        } else if (oldInnerChild) {
          oldInnerChild = void 0;
        }
        return child;
      };
    }
  };
  function findNonCommentChild(children) {
    let child = children[0];
    if (children.length > 1) {
      for (const c of children) {
        if (c.type !== Comment) {
          child = c;
          break;
        }
      }
    }
    return child;
  }
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance, postClone) {
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1)) done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
          leavingVNode.el[leaveCbKey]();
        }
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el[enterCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey] = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove2) {
        const key2 = String(vnode.key);
        if (el[enterCbKey]) {
          el[enterCbKey](
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        const done = el[leaveCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          remove2();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        const hooks2 = resolveTransitionHooks(
          vnode2,
          props,
          state,
          instance,
          postClone
        );
        if (postClone) postClone(hooks2);
        return hooks2;
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getInnerChild$1(vnode) {
    if (!isKeepAlive(vnode)) {
      if (isTeleport(vnode.type) && vnode.children) {
        return findNonCommentChild(vnode.children);
      }
      return vnode;
    }
    if (vnode.component) {
      return vnode.component.subTree;
    }
    const { shapeFlag, children } = vnode;
    if (children) {
      if (shapeFlag & 16) {
        return children[0];
      }
      if (shapeFlag & 32 && isFunction(children.default)) {
        return children.default();
      }
    }
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128) keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
      return hasOwn(rawSetupState, key);
    };
    if (oldRef != null && oldRef !== ref3) {
      invalidatePendingSetRef(oldRawRef);
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        {
          oldRef.value = null;
        }
        const oldRawRefAtom = oldRawRef;
        if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (canSetSetupRef(ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  const newVal = [refValue];
                  {
                    ref3.value = newVal;
                  }
                  if (rawRef.k) refs[rawRef.k] = newVal;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (canSetSetupRef(ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            {
              ref3.value = value;
            }
            if (rawRef.k) refs[rawRef.k] = value;
          } else ;
        };
        if (value) {
          const job = () => {
            doSet();
            pendingSetRefMap.delete(rawRef);
          };
          job.id = -1;
          pendingSetRefMap.set(rawRef, job);
          queuePostRenderEffect(job, parentSuspense);
        } else {
          invalidatePendingSetRef(rawRef);
          doSet();
        }
      }
    }
  }
  function invalidatePendingSetRef(rawRef) {
    const pendingSetRef = pendingSetRefMap.get(rawRef);
    if (pendingSetRef) {
      pendingSetRef.flags |= 8;
      pendingSetRefMap.delete(rawRef);
    }
  }
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
    const sourceIsArray = isArray(source);
    if (sourceIsArray || isString(source)) {
      const sourceIsReactiveArray = sourceIsArray && isReactive(source);
      let needsWrap = false;
      let isReadonlySource = false;
      if (sourceIsReactiveArray) {
        needsWrap = !isShallow(source);
        isReadonlySource = isReadonly(source);
        source = shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
          i,
          void 0,
          cached
        );
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached)
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => i.props,
      $attrs: (i) => i.attrs,
      $slots: (i) => i.slots,
      $refs: (i) => i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (hasOwn(props, key)) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, props, type }
    }, key) {
      let cssModules;
      return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook$1(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject(data)) ;
      else {
        instance.data = reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook$1(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val,
            enumerable: true
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook$1(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        {
          watch(getter, handler);
        }
      }
    } else if (isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        }
      }
    } else ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app2 = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app2, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app2, ...options);
          } else ;
          return app2;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app2;
        },
        component(name, component) {
          if (!component) {
            return context.components[name];
          }
          context.components[name] = component;
          return app2;
        },
        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }
          context.directives[name] = directive;
          return app2;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = app2._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app2._container = rootContainer;
            rootContainer.__vue_app__ = app2;
            return getComponentPublicInstance(vnode.component);
          }
        },
        onUnmount(cleanupFn) {
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app2._instance,
              16
            );
            render(null, app2._container);
            delete app2._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app2;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app2;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app2;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (currentInstance) {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  function hasInjectionContext() {
    return !!(getCurrentInstance() || currentApp);
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    const baseWatchOptions = extend({}, options);
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch$1(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = false ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            false ? shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (false) ;
        result = normalizeVNode(
          render2.length > 1 ? render2(
            false ? shallowReadonly(props) : props,
            false ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render2(
            false ? shallowReadonly(props) : props,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      setTransitionHooks(root, vnode.transition);
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    }
    return false;
  }
  const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (false) ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def(slots, "_", type, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else ;
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      } else if (ref3 == null && n1 && n1.ref != null) {
        setRef(n1.ref, null, parentSuspense, n1, true);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        const customElement = !!(n1.el && n1.el._isVueCE) ? n1.el : null;
        try {
          if (customElement) {
            customElement._beginPatch();
          }
          patchElement(
            n1,
            n2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } finally {
          if (customElement) {
            customElement._endPatch();
          }
        }
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance, false, optimized);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
          initialVNode.placeholder = placeholder.el;
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent, root, type } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          {
            if (root.ce && // @ts-expect-error _def is private
            root.ce._def.shadowRoot !== false) {
              root.ce._injectChildStyle(type);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
        }
      };
      instance.scope.on();
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect2.run.bind(effect2);
      const job = instance.job = effect2.runIfDirty.bind(effect2);
      job.i = instance;
      job.id = instance.uid;
      effect2.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchorVNode = c2[nextIndex + 1];
          const anchor = nextIndex + 1 < l2 ? (
            // #13559, fallback to el placeholder for unresolved async component
            anchorVNode.el || anchorVNode.placeholder
          ) : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            if (el._isLeaving) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref3 != null) {
        pauseTracking();
        setRef(ref3, null, parentSuspense, vnode, true);
        resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const { bum, scope, job, subTree, um, m, a } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    return {
      render,
      hydrate,
      createApp: createAppAPI(render)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, job }, allowed) {
    if (allowed) {
      effect2.flags |= 32;
      job.flags |= 4;
    } else {
      effect2.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text && // avoid cached text nodes retaining detached dom nodes
        c2.patchFlag !== -1) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      placeholder: vnode.placeholder,
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key])) setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children, optimized || isSSR);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult);
      }
    } else {
      finishComponentSetup(instance);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    } else ;
    finishComponentSetup(instance);
  }
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      track(target, "get", "");
      return target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        attrs: new Proxy(instance.attrs, attrsProxyHandlers),
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])\w/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
        instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    return c;
  };
  function h(type, propsOrChildren, children) {
    try {
      setBlockTracking(-1);
      const l = arguments.length;
      if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type, null, [propsOrChildren]);
          }
          return createVNode(type, propsOrChildren);
        } else {
          return createVNode(type, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type, propsOrChildren, children);
      }
    } finally {
      setBlockTracking(1);
    }
  }
  const version = "3.5.25";
  /**
  * @vue/runtime-dom v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = /* @__PURE__ */ tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
        );
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const vtcKey = Symbol("_vtc");
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = /* @__PURE__ */ extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const decorate$1 = (t) => {
    t.displayName = "Transition";
    t.props = TransitionPropsValidators;
    return t;
  };
  const Transition = /* @__PURE__ */ decorate$1(
    (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
  );
  const callHook = (hook, args = []) => {
    if (isArray(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name = "v",
      type,
      duration,
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
    const finishEnter = (el, isAppear, done, isCancelled) => {
      el._enterCancelled = isCancelled;
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      el._isLeaving = false;
      removeTransitionClass(el, leaveFromClass);
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve = () => finishEnter(el, isAppear, done);
        callHook(hook, [el, resolve]);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        callHook(onBeforeEnter, [el]);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear(el) {
        callHook(onBeforeAppear, [el]);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        el._isLeaving = true;
        const resolve = () => finishLeave(el, done);
        addTransitionClass(el, leaveFromClass);
        if (!el._enterCancelled) {
          forceReflow(el);
          addTransitionClass(el, leaveActiveClass);
        } else {
          addTransitionClass(el, leaveActiveClass);
          forceReflow(el);
        }
        nextFrame(() => {
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
        });
        callHook(onLeave, [el, resolve]);
      },
      onEnterCancelled(el) {
        finishEnter(el, false, void 0, true);
        callHook(onEnterCancelled, [el]);
      },
      onAppearCancelled(el) {
        finishEnter(el, true, void 0, true);
        callHook(onAppearCancelled, [el]);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        callHook(onLeaveCancelled, [el]);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    return res;
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
    (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el[vtcKey] = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve();
      }
    };
    if (explicitTimeout != null) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    if (s === "auto") return 0;
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow(el) {
    const targetDocument = el ? el.ownerDocument : document;
    return targetDocument.body.offsetHeight;
  }
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const vShow = {
    // used for prop mismatch check during hydration
    name: "show",
    beforeMount(el, { value }, { transition }) {
      el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue) return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el[vShowOriginalDisplay] : "none";
    el[vShowHidden] = !value;
  }
  const CSS_VAR_TEXT = Symbol("");
  const displayRE = /(?:^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null) val = "";
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }
  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(attrName || key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          nextValue,
          instance
        );
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return false;
    }
    if (key === "sandbox" && el.tagName === "IFRAME") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  function castValue(value, trim, number) {
    if (trim) value = value.trim();
    if (number) value = looseToNumber(value);
    return value;
  }
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing) return;
        el[assignKey](castValue(el.value, trim, castToNumber));
      });
      if (trim || castToNumber) {
        addEventListener(el, "change", () => {
          el.value = castValue(el.value, trim, castToNumber);
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing) return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy && value === oldValue) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const vModelCheckbox = {
    // #4096 array checkboxes need to be deep traversed
    deep: true,
    created(el, _, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        const modelValue = el._modelValue;
        const elementValue = getValue(el);
        const checked = el.checked;
        const assign2 = el[assignKey];
        if (isArray(modelValue)) {
          const index = looseIndexOf(modelValue, elementValue);
          const found = index !== -1;
          if (checked && !found) {
            assign2(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign2(filtered);
          }
        } else if (isSet(modelValue)) {
          const cloned = new Set(modelValue);
          if (checked) {
            cloned.add(elementValue);
          } else {
            cloned.delete(elementValue);
          }
          assign2(cloned);
        } else {
          assign2(getCheckboxValue(el, checked));
        }
      });
    },
    // set initial checked on mount to wait for true-value/false-value
    mounted: setChecked,
    beforeUpdate(el, binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    let checked;
    if (isArray(value)) {
      checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (isSet(value)) {
      checked = value.has(vnode.props.value);
    } else {
      if (value === oldValue) return;
      checked = looseEqual(value, getCheckboxValue(el, true));
    }
    if (el.checked !== checked) {
      el.checked = checked;
    }
  }
  const vModelSelect = {
    // <select multiple> value need to be deep traversed
    deep: true,
    created(el, { value, modifiers: { number } }, vnode) {
      const isSetModel = isSet(value);
      addEventListener(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
          (o) => number ? looseToNumber(getValue(o)) : getValue(o)
        );
        el[assignKey](
          el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
        );
        el._assigning = true;
        nextTick(() => {
          el._assigning = false;
        });
      });
      el[assignKey] = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
      setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
    },
    updated(el, { value }) {
      if (!el._assigning) {
        setSelected(el, value);
      }
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    const isArrayValue = isArray(value);
    if (isMultiple && !isArrayValue && !isSet(value)) {
      return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        if (isArrayValue) {
          const optionType = typeof optionValue;
          if (optionType === "string" || optionType === "number") {
            option.selected = value.some((v) => String(v) === String(optionValue));
          } else {
            option.selected = looseIndexOf(value, optionValue) > -1;
          }
        } else {
          option.selected = value.has(optionValue);
        }
      } else if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) el.selectedIndex = i;
        return;
      }
    }
    if (!isMultiple && el.selectedIndex !== -1) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    const cache = fn._withMods || (fn._withMods = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }
      return fn(event, ...args);
    }));
  };
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = ((...args) => {
    const app2 = ensureRenderer().createApp(...args);
    const { mount } = app2;
    app2.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app2._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app2;
  });
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  let openccModule = null;
  let toSimplifiedConverter = null;
  let toTraditionalConverter = null;
  let loadPromise = null;
  const OPENCC_CDN = "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js";
  async function loadOpenCC() {
    if (openccModule) return;
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
      if (window.OpenCC) {
        openccModule = window.OpenCC;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = OPENCC_CDN;
      script.async = true;
      script.onload = () => {
        openccModule = window.OpenCC;
        if (openccModule) {
          resolve();
        } else {
          reject(new Error("OpenCC module not found after loading"));
        }
      };
      script.onerror = () => {
        console.error("[ChineseConverter] Failed to load OpenCC from CDN");
        reject(new Error("Failed to load OpenCC"));
      };
      document.head.appendChild(script);
    });
    return loadPromise;
  }
  async function getConverter(mode) {
    if (mode === "none") return null;
    await loadOpenCC();
    if (!openccModule) {
      console.error("[ChineseConverter] OpenCC not available");
      return null;
    }
    if (mode === "sc") {
      if (!toSimplifiedConverter) {
        toSimplifiedConverter = openccModule.Converter({ from: "tw", to: "cn" });
      }
      return toSimplifiedConverter;
    }
    if (mode === "tc") {
      if (!toTraditionalConverter) {
        toTraditionalConverter = openccModule.Converter({ from: "cn", to: "tw" });
      }
      return toTraditionalConverter;
    }
    return null;
  }
  async function convertHTML(html, mode) {
    if (mode === "none" || !html) {
      return html;
    }
    try {
      const converter = await getConverter(mode);
      if (!converter) return html;
      const template = document.createElement("template");
      template.innerHTML = html;
      const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT, null);
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      for (const textNode of textNodes) {
        if (textNode.textContent) {
          textNode.textContent = converter(textNode.textContent);
        }
      }
      return template.innerHTML;
    } catch (error) {
      console.error("[ChineseConverter] HTML conversion error:", error);
      return html;
    }
  }
  /*!
   * pinia v2.3.1
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = effectScope(true);
    const state = scope.run(() => ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = markRaw({
      install(app2) {
        setActivePinia(pinia2);
        {
          pinia2._a = app2;
          app2.provide(piniaSymbol, pinia2);
          app2.config.globalProperties.$pinia = pinia2;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && true) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia2;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && getCurrentScope()) {
      onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia2.state.value[id] = state ? state() : {};
        }
      }
      const localState = toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia2.state.value[$id] = {};
      }
    }
    ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    const action = (fn, name = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name;
        return fn;
      }
      const wrappedAction = function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia2,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = reactive(partialStore);
    pinia2._s.set($id, store);
    const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia2._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia2.state.value[$id][key] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        {
          setupStore[key] = actionValue;
        }
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    {
      assign(store, setupStore);
      assign(toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia2.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia2._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia2, hot) {
      const hasContext = hasInjectionContext();
      pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia2 || (hasContext ? inject(piniaSymbol, null) : null);
      if (pinia2)
        setActivePinia(pinia2);
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
      }
      const store = pinia2._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useReaderStore = /* @__PURE__ */ defineStore("reader", () => {
    const isActive2 = ref(false);
    const isLoading = ref(false);
    const isLoadingPrev = ref(false);
    const isLoadingNext = ref(false);
    const chapters = ref([]);
    const currentChapterIndex = ref(0);
    const error = ref(null);
    const scrollPercent = ref(0);
    const history = ref([]);
    const loadedUrls = ref(/* @__PURE__ */ new Set());
    const originalContents = ref(/* @__PURE__ */ new Map());
    const currentConversionMode = ref("none");
    const chapter = computed(() => {
      var _a;
      return ((_a = chapters.value[currentChapterIndex.value]) == null ? void 0 : _a.chapter) || null;
    });
    const rule = computed(() => {
      var _a;
      return ((_a = chapters.value[currentChapterIndex.value]) == null ? void 0 : _a.rule) || null;
    });
    const title = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.title) || "";
    });
    const bookTitle = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.bookTitle) || "";
    });
    const content = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.content) || "";
    });
    const hasNext = computed(() => {
      const lastChapter = chapters.value[chapters.value.length - 1];
      return !!(lastChapter == null ? void 0 : lastChapter.chapter.nextUrl);
    });
    const hasPrev = computed(() => {
      const firstChapter = chapters.value[0];
      return !!(firstChapter == null ? void 0 : firstChapter.chapter.prevUrl);
    });
    const hasIndex = computed(() => {
      var _a;
      return !!((_a = chapter.value) == null ? void 0 : _a.indexUrl);
    });
    const confidence = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.confidence) || 0;
    });
    const method = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.method) || "detection";
    });
    function activate() {
      isActive2.value = true;
      error.value = null;
    }
    function deactivate() {
      isActive2.value = false;
      chapters.value = [];
      currentChapterIndex.value = 0;
      error.value = null;
      loadedUrls.value.clear();
    }
    function setChapter(newChapter, newRule) {
      const id = `chapter-${Date.now()}-0`;
      chapters.value = [
        {
          chapter: newChapter,
          rule: newRule,
          id
        }
      ];
      currentChapterIndex.value = 0;
      isLoading.value = false;
      error.value = null;
      loadedUrls.value.clear();
      loadedUrls.value.add(newChapter.url);
      originalContents.value.clear();
      originalContents.value.set(id, newChapter.content);
      if (newChapter.url && !history.value.includes(newChapter.url)) {
        history.value.push(newChapter.url);
        if (history.value.length > 100) {
          history.value = history.value.slice(-100);
        }
      }
    }
    async function loadNextChapter() {
      const lastChapter = chapters.value[chapters.value.length - 1];
      if (!(lastChapter == null ? void 0 : lastChapter.chapter.nextUrl) || isLoadingNext.value) {
        return false;
      }
      const nextUrl = lastChapter.chapter.nextUrl;
      if (loadedUrls.value.has(nextUrl)) {
        return false;
      }
      isLoadingNext.value = true;
      try {
        const referer = lastChapter.chapter.url;
        const doc2 = await fetchAndParseUrl(nextUrl, referer);
        if (!doc2) {
          throw new Error("Failed to fetch page");
        }
        const parser = getParser();
        const parsed = await parser.parse(doc2, nextUrl);
        if (!parsed) {
          throw new Error("Failed to parse chapter");
        }
        const id = `chapter-${Date.now()}-${chapters.value.length}`;
        chapters.value.push({
          chapter: parsed,
          rule: parsed.rule,
          id
        });
        loadedUrls.value.add(nextUrl);
        originalContents.value.set(id, parsed.content);
        if (currentConversionMode.value !== "none") {
          const converted = await convertHTML(parsed.content, currentConversionMode.value);
          const entry = chapters.value.find((e) => e.id === id);
          if (entry) {
            entry.chapter = { ...entry.chapter, content: converted };
          }
        }
        if (!history.value.includes(nextUrl)) {
          history.value.push(nextUrl);
        }
        return true;
      } catch (e) {
        console.error("[MNR] Failed to load next chapter:", e);
        error.value = "加载下一章失败";
        return false;
      } finally {
        isLoadingNext.value = false;
      }
    }
    async function loadPrevChapter() {
      const firstChapter = chapters.value[0];
      if (!(firstChapter == null ? void 0 : firstChapter.chapter.prevUrl) || isLoadingPrev.value) {
        return false;
      }
      const prevUrl = firstChapter.chapter.prevUrl;
      const normalizeUrl = (url) => url.replace(/\/$/, "").replace(/\/index\.html?$/, "");
      if (firstChapter.chapter.indexUrl && normalizeUrl(prevUrl) === normalizeUrl(firstChapter.chapter.indexUrl)) {
        return false;
      }
      if (loadedUrls.value.has(prevUrl)) {
        return false;
      }
      isLoadingPrev.value = true;
      try {
        const referer = firstChapter.chapter.url;
        const doc2 = await fetchAndParseUrl(prevUrl, referer);
        if (!doc2) {
          throw new Error("Failed to fetch page");
        }
        const parser = getParser();
        const parsed = await parser.parse(doc2, prevUrl);
        if (!parsed) {
          throw new Error("Failed to parse chapter");
        }
        const isTocPage = detectTocPage(parsed.content, prevUrl, firstChapter.chapter.url);
        if (isTocPage) {
          loadedUrls.value.add(prevUrl);
          return false;
        }
        if (parsed.nextUrl && normalizeUrl(parsed.nextUrl) === normalizeUrl(firstChapter.chapter.url)) {
        } else if (parsed.prevUrl && !parsed.nextUrl) {
          loadedUrls.value.add(prevUrl);
          return false;
        }
        const id = `chapter-${Date.now()}-prev-${chapters.value.length}`;
        chapters.value.unshift({
          chapter: parsed,
          rule: parsed.rule,
          id
        });
        loadedUrls.value.add(prevUrl);
        currentChapterIndex.value++;
        originalContents.value.set(id, parsed.content);
        if (currentConversionMode.value !== "none") {
          const converted = await convertHTML(parsed.content, currentConversionMode.value);
          const entry = chapters.value.find((e) => e.id === id);
          if (entry) {
            entry.chapter = { ...entry.chapter, content: converted };
          }
        }
        if (!history.value.includes(prevUrl)) {
          history.value.unshift(prevUrl);
        }
        return true;
      } catch (e) {
        console.error("[MNR] Failed to load previous chapter:", e);
        error.value = "加载上一章失败";
        return false;
      } finally {
        isLoadingPrev.value = false;
      }
    }
    function setLoading(loading) {
      isLoading.value = loading;
    }
    function setError(msg) {
      error.value = msg;
      isLoading.value = false;
    }
    function clearError() {
      error.value = null;
    }
    function updateScroll(percent) {
      scrollPercent.value = Math.max(0, Math.min(100, percent));
    }
    function setCurrentChapter(index) {
      if (index < 0 || index >= chapters.value.length) return;
      if (currentChapterIndex.value === index) return;
      currentChapterIndex.value = index;
      const chapterEntry = chapters.value[index];
      if (chapterEntry == null ? void 0 : chapterEntry.chapter.url) {
        try {
          window.history.replaceState({ mnrChapter: index }, "", chapterEntry.chapter.url);
        } catch {
        }
      }
    }
    function getProgress() {
      var _a;
      if (!((_a = chapter.value) == null ? void 0 : _a.url)) return null;
      return {
        url: chapter.value.url,
        scrollPercent: scrollPercent.value,
        lastRead: Date.now()
      };
    }
    async function applyTextConversion(mode) {
      currentConversionMode.value = mode;
      if (mode === "none") {
        for (const entry of chapters.value) {
          const original = originalContents.value.get(entry.id);
          if (original && entry.chapter.content !== original) {
            entry.chapter = { ...entry.chapter, content: original };
          }
        }
      } else {
        for (const entry of chapters.value) {
          const original = originalContents.value.get(entry.id);
          if (original) {
            const converted = await convertHTML(original, mode);
            entry.chapter = { ...entry.chapter, content: converted };
          }
        }
      }
    }
    function $reset() {
      isActive2.value = false;
      isLoading.value = false;
      isLoadingPrev.value = false;
      isLoadingNext.value = false;
      chapters.value = [];
      currentChapterIndex.value = 0;
      error.value = null;
      scrollPercent.value = 0;
      loadedUrls.value.clear();
      originalContents.value.clear();
      currentConversionMode.value = "none";
    }
    return {
      // State
      isActive: isActive2,
      isLoading,
      isLoadingPrev,
      isLoadingNext,
      chapters,
      currentChapterIndex,
      chapter,
      rule,
      error,
      scrollPercent,
      history,
      // Getters
      title,
      bookTitle,
      content,
      hasNext,
      hasPrev,
      hasIndex,
      confidence,
      method,
      // Actions
      activate,
      deactivate,
      setChapter,
      setCurrentChapter,
      loadNextChapter,
      loadPrevChapter,
      setLoading,
      setError,
      clearError,
      updateScroll,
      getProgress,
      applyTextConversion,
      $reset
    };
  });
  function getGmXhr() {
    if (typeof GM_xmlhttpRequest === "function") {
      return GM_xmlhttpRequest;
    }
    return null;
  }
  async function fetchAndParseUrl(url, referer) {
    const gmXhr = getGmXhr();
    if (!gmXhr) {
      console.error("[MNR] GM_xmlhttpRequest not available");
      return null;
    }
    return new Promise((resolve) => {
      const headers = {
        Accept: "text/html,application/xhtml+xml,application/xml",
        "Accept-Language": "zh-CN,zh;q=0.9"
      };
      if (referer) {
        headers["Referer"] = referer;
      }
      gmXhr({
        method: "GET",
        url,
        headers,
        overrideMimeType: "text/html;charset=" + document.characterSet,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            try {
              const parser = new DOMParser();
              const doc2 = parser.parseFromString(response.responseText, "text/html");
              const base = doc2.createElement("base");
              base.href = url;
              doc2.head.insertBefore(base, doc2.head.firstChild);
              doc2._mnrUrl = url;
              resolve(doc2);
            } catch (e) {
              console.error("[MNR] Parse error:", e);
              resolve(null);
            }
          } else {
            console.error("[MNR] HTTP error:", response.status);
            resolve(null);
          }
        },
        onerror: (err) => {
          console.error("[MNR] Request error:", err);
          resolve(null);
        },
        ontimeout: () => {
          console.error("[MNR] Request timeout");
          resolve(null);
        }
      });
    });
  }
  function detectTocPage(content, pageUrl, currentChapterUrl) {
    const tocUrlPatterns = [
      /\/book\/\d+\.html?$/i,
      // /book/123.htm
      /\/book\/\d+\/?$/i,
      // /book/123/ or /book/123
      /\/novel\/\d+\/?$/i,
      // /novel/123/
      /\/xiaoshuo\/\d+\/?$/i,
      // /xiaoshuo/123/
      /\/info\/\d+\.html?$/i,
      // /info/123.html
      /\/\d+\/index\.html?$/i,
      // /123/index.html
      /\/booklist/i,
      // /booklist
      /\/catalog/i,
      // /catalog
      /\/contents?\.html?$/i,
      // /content.html or /contents.html
      /\/list\.html?$/i,
      // /list.html
      /\/toc\.html?$/i
      // /toc.html
    ];
    for (const pattern of tocUrlPatterns) {
      if (pattern.test(pageUrl)) {
        return true;
      }
    }
    try {
      const currentPath2 = new URL(currentChapterUrl).pathname;
      const pagePath = new URL(pageUrl).pathname;
      const chapterPattern = /\/(txt|read|chapter|article)\/\d+\/\d+/i;
      const bookPattern = /\/(book|novel|info|xiaoshuo)\/\d+/i;
      if (chapterPattern.test(currentPath2) && bookPattern.test(pagePath)) {
        return true;
      }
    } catch {
    }
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || "";
    const textLength = textContent.length;
    const links = tempDiv.querySelectorAll("a");
    const linkCount = links.length;
    if (textLength < 500 && linkCount > 10) {
      return true;
    }
    const linkTextLength = Array.from(links).reduce(
      (sum, a) => {
        var _a;
        return sum + (((_a = a.textContent) == null ? void 0 : _a.length) || 0);
      },
      0
    );
    const linkRatio = textLength > 0 ? linkTextLength / textLength : 0;
    if (linkRatio > 0.6 && linkCount > 8) {
      return true;
    }
    const chapterLinkPattern = /\/(chapter|txt|read|book|novel|article)\/|\d+\.html?$/i;
    const chapterLinks = Array.from(links).filter((a) => {
      const href = a.getAttribute("href") || "";
      return chapterLinkPattern.test(href);
    });
    if (chapterLinks.length > 10) {
      return true;
    }
    const normalizeUrl = (url) => {
      try {
        const u = new URL(url, pageUrl);
        return u.pathname.replace(/\/$/, "");
      } catch {
        return url.replace(/\/$/, "");
      }
    };
    const currentPath = normalizeUrl(currentChapterUrl);
    const hasLinkToCurrentChapter = Array.from(links).some((a) => {
      const href = a.getAttribute("href");
      if (!href) return false;
      return normalizeUrl(href) === currentPath;
    });
    if (hasLinkToCurrentChapter && linkCount > 5) {
      return true;
    }
    const tocKeywords = [
      "目录",
      "章节列表",
      "章节目录",
      "全部章节",
      "最新章节",
      "小说目录",
      "table of contents",
      "toc",
      "catalog",
      "index"
    ];
    const pageText = textContent.toLowerCase();
    const keywordMatches = tocKeywords.filter((kw) => pageText.includes(kw.toLowerCase()));
    if (keywordMatches.length >= 2 || keywordMatches.length >= 1 && linkCount > 15) {
      return true;
    }
    const linkTexts = Array.from(links).map((a) => {
      var _a;
      return ((_a = a.textContent) == null ? void 0 : _a.trim()) || "";
    }).filter((t) => t.length > 0);
    const chapterNamePattern = /^第.{1,10}[章节回话篇集卷]/;
    const chapterNameLinks = linkTexts.filter((t) => chapterNamePattern.test(t));
    if (chapterNameLinks.length > 5) {
      return true;
    }
    return false;
  }
  const THEMES = [
    {
      id: "light",
      name: "默认",
      background: "#ffffff",
      text: "#1a1a1a",
      link: "#0066cc",
      border: "#e5e5e5"
    },
    {
      id: "dark",
      name: "深色",
      background: "#1e1e1e",
      text: "#d4d4d4",
      link: "#4fc1ff",
      border: "#3c3c3c"
    },
    {
      id: "sepia",
      name: "护眼",
      background: "#f8f1e3",
      text: "#4a4137",
      link: "#8b5a2b",
      border: "#e8dcc8"
    },
    {
      id: "green",
      name: "绿色",
      background: "#e8f5e9",
      text: "#1b5e20",
      link: "#2e7d32",
      border: "#c8e6c9"
    },
    {
      id: "blue",
      name: "蓝色",
      background: "#e3f2fd",
      text: "#0d47a1",
      link: "#1565c0",
      border: "#bbdefb"
    },
    {
      id: "night",
      name: "夜间",
      background: "#0d0d0d",
      text: "#a0a0a0",
      link: "#5dade2",
      border: "#2a2a2a"
    }
  ];
  const DEFAULT_READING = {
    fontFamily: 'system-ui, -apple-system, "Microsoft YaHei", sans-serif',
    fontSize: 18,
    lineHeight: 1.8,
    letterSpacing: 0.05,
    paragraphIndent: 2,
    maxWidth: 800,
    padding: 20,
    textConversion: "none"
  };
  const DEFAULT_BEHAVIOR = {
    autoScrollToPosition: true,
    keyboardNavigation: true,
    swipeGestures: true,
    autoHideHeader: true,
    preloadNext: true,
    showProgress: true
  };
  const DEFAULT_PROTECTION = {
    blockRedirects: true,
    enableRightClick: true,
    enableSelection: true,
    blockPopups: true
  };
  const STORAGE_KEY = "mnr-config";
  const useConfigStore = /* @__PURE__ */ defineStore("config", () => {
    const themeId = ref("light");
    const reading = ref({ ...DEFAULT_READING });
    const behavior = ref({ ...DEFAULT_BEHAVIOR });
    const protection = ref({ ...DEFAULT_PROTECTION });
    const customCSS = ref("");
    const theme = () => {
      return THEMES.find((t) => t.id === themeId.value) || THEMES[0];
    };
    function setTheme(id) {
      if (THEMES.some((t) => t.id === id)) {
        themeId.value = id;
        applyTheme();
      }
    }
    function updateReading(settings) {
      reading.value = { ...reading.value, ...settings };
    }
    function updateBehavior(settings) {
      behavior.value = { ...behavior.value, ...settings };
    }
    function updateProtection(settings) {
      protection.value = { ...protection.value, ...settings };
    }
    function setCustomCSS(css) {
      customCSS.value = css;
      applyCustomCSS();
    }
    function applyTheme() {
      const t = theme();
      const root = document.documentElement;
      root.style.setProperty("--mnr-bg", t.background);
      root.style.setProperty("--mnr-text", t.text);
      root.style.setProperty("--mnr-link", t.link);
      root.style.setProperty("--mnr-border", t.border);
    }
    function applyReading() {
      const r = reading.value;
      const root = document.documentElement;
      root.style.setProperty("--mnr-font-family", r.fontFamily);
      root.style.setProperty("--mnr-font-size", `${r.fontSize}px`);
      root.style.setProperty("--mnr-line-height", `${r.lineHeight}`);
      root.style.setProperty("--mnr-letter-spacing", `${r.letterSpacing}em`);
      root.style.setProperty("--mnr-paragraph-indent", `${r.paragraphIndent}em`);
      root.style.setProperty("--mnr-max-width", `${r.maxWidth}px`);
      root.style.setProperty("--mnr-padding", `${r.padding}px`);
    }
    function applyCustomCSS() {
      let styleEl = document.getElementById("mnr-custom-css");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "mnr-custom-css";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = customCSS.value;
    }
    function applyAll() {
      applyTheme();
      applyReading();
      applyCustomCSS();
    }
    async function load() {
      try {
        let data = null;
        if (typeof GM_getValue !== "undefined") {
          data = await GM_getValue(STORAGE_KEY, null);
        } else if (typeof localStorage !== "undefined") {
          data = localStorage.getItem(STORAGE_KEY);
        }
        if (data) {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          if (parsed.themeId) themeId.value = parsed.themeId;
          if (parsed.reading) reading.value = { ...DEFAULT_READING, ...parsed.reading };
          if (parsed.behavior) behavior.value = { ...DEFAULT_BEHAVIOR, ...parsed.behavior };
          if (parsed.protection) protection.value = { ...DEFAULT_PROTECTION, ...parsed.protection };
          if (parsed.customCSS) customCSS.value = parsed.customCSS;
        }
        applyAll();
      } catch (e) {
        console.error("[ConfigStore] Load error:", e);
      }
    }
    async function save() {
      try {
        const data = JSON.stringify({
          themeId: themeId.value,
          reading: reading.value,
          behavior: behavior.value,
          protection: protection.value,
          customCSS: customCSS.value
        });
        if (typeof GM_setValue !== "undefined") {
          await GM_setValue(STORAGE_KEY, data);
        } else if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_KEY, data);
        }
      } catch (e) {
        console.error("[ConfigStore] Save error:", e);
      }
    }
    watch(
      [themeId, reading, behavior, protection, customCSS],
      () => {
        save();
      },
      { deep: true }
    );
    function $reset() {
      themeId.value = "light";
      reading.value = { ...DEFAULT_READING };
      behavior.value = { ...DEFAULT_BEHAVIOR };
      protection.value = { ...DEFAULT_PROTECTION };
      customCSS.value = "";
      applyAll();
      save();
    }
    return {
      // State
      themeId,
      reading,
      behavior,
      protection,
      customCSS,
      // Getters
      theme,
      // Actions
      setTheme,
      updateReading,
      updateBehavior,
      updateProtection,
      setCustomCSS,
      applyTheme,
      applyReading,
      applyAll,
      load,
      save,
      $reset
    };
  });
  const useRuleStore = /* @__PURE__ */ defineStore("rule", () => {
    const userRules = ref(/* @__PURE__ */ new Map());
    const builtInRules2 = ref([]);
    const isLoading = ref(false);
    const currentRule = ref(null);
    const isEditing = ref(false);
    const editingRule = ref(null);
    const userRuleCount = computed(() => userRules.value.size);
    const builtInRuleCount = computed(() => builtInRules2.value.length);
    const totalRuleCount = computed(() => userRuleCount.value + builtInRuleCount.value);
    const userRuleList = computed(() => Array.from(userRules.value.values()));
    async function initialize2() {
      if (isLoading.value) return;
      isLoading.value = true;
      try {
        const manager = getRuleManager();
        await manager.initialize();
        const storage = manager.getStorage();
        userRules.value = await storage.getAllUserRules();
        builtInRules2.value = await manager.getBuiltInRules();
      } catch (e) {
        console.error("[RuleStore] Initialize error:", e);
      } finally {
        isLoading.value = false;
      }
    }
    async function matchRule(url) {
      try {
        const manager = getRuleManager();
        const result = await manager.matchRule(url);
        currentRule.value = (result == null ? void 0 : result.rule) || null;
        return currentRule.value;
      } catch (e) {
        console.error("[RuleStore] Match error:", e);
        return null;
      }
    }
    async function saveUserRule(domain, rule) {
      try {
        const manager = getRuleManager();
        await manager.saveUserRule(domain, rule);
        userRules.value.set(domain, rule);
      } catch (e) {
        console.error("[RuleStore] Save error:", e);
        throw e;
      }
    }
    async function deleteUserRule(domain) {
      try {
        const manager = getRuleManager();
        await manager.deleteUserRule(domain);
        userRules.value.delete(domain);
      } catch (e) {
        console.error("[RuleStore] Delete error:", e);
        throw e;
      }
    }
    function getUserRule(domain) {
      return userRules.value.get(domain);
    }
    function hasUserRule(domain) {
      return userRules.value.has(domain);
    }
    function startEditing(rule) {
      isEditing.value = true;
      editingRule.value = rule ? { ...rule } : createEmptyRule();
    }
    function stopEditing() {
      isEditing.value = false;
      editingRule.value = null;
    }
    function updateEditingRule(updates) {
      if (editingRule.value) {
        editingRule.value = { ...editingRule.value, ...updates };
      }
    }
    async function saveEditingRule(domain) {
      if (!editingRule.value) return;
      await saveUserRule(domain, editingRule.value);
      stopEditing();
    }
    function createEmptyRule() {
      return {
        id: `user-${Date.now()}`,
        name: "",
        version: 1,
        match: {
          pattern: "",
          type: "regex"
        },
        content: {
          selector: ""
        },
        meta: {
          source: "user",
          autoLaunch: true
        }
      };
    }
    function exportRules() {
      const rules = Array.from(userRules.value.entries()).map(([domain, rule]) => ({
        domain,
        rule
      }));
      return JSON.stringify(rules, null, 2);
    }
    async function importRules(json) {
      try {
        const data = JSON.parse(json);
        if (!Array.isArray(data)) {
          throw new Error("Invalid format: expected array");
        }
        for (const item of data) {
          if (item.domain && item.rule) {
            await saveUserRule(item.domain, item.rule);
          }
        }
      } catch (e) {
        console.error("[RuleStore] Import error:", e);
        throw e;
      }
    }
    function $reset() {
      userRules.value = /* @__PURE__ */ new Map();
      builtInRules2.value = [];
      isLoading.value = false;
      currentRule.value = null;
      isEditing.value = false;
      editingRule.value = null;
    }
    return {
      // State
      userRules,
      builtInRules: builtInRules2,
      isLoading,
      currentRule,
      isEditing,
      editingRule,
      // Getters
      userRuleCount,
      builtInRuleCount,
      totalRuleCount,
      userRuleList,
      // Actions
      initialize: initialize2,
      matchRule,
      saveUserRule,
      deleteUserRule,
      getUserRule,
      hasUserRule,
      startEditing,
      stopEditing,
      updateEditingRule,
      saveEditingRule,
      createEmptyRule,
      exportRules,
      importRules,
      $reset
    };
  });
  const _hoisted_1$6 = {
    class: "mnr-prompt-card",
    role: "dialog",
    "aria-modal": "true"
  };
  const _hoisted_2$5 = { class: "mnr-confidence" };
  const _hoisted_3$5 = { class: "mnr-confidence-bar" };
  const _hoisted_4$5 = { class: "mnr-confidence-text" };
  const _hoisted_5$4 = { class: "mnr-results" };
  const _hoisted_6$4 = { class: "mnr-checkbox-label" };
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "DetectionPrompt",
    props: {
      decision: {},
      visible: { type: Boolean }
    },
    emits: ["respond", "dismiss"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const saveForDomain = ref(true);
      const confidence = computed(() => props.decision.confidence);
      const confidenceClass = computed(() => {
        if (confidence.value >= 0.8) return "high";
        if (confidence.value >= 0.6) return "medium";
        return "low";
      });
      const positiveReasons = computed(() => {
        return props.decision.reasons.filter(
          (r) => r.includes("找到") || r.includes("检测到") || r.includes("成功")
        );
      });
      const negativeReasons = computed(() => {
        return props.decision.reasons.filter(
          (r) => r.includes("未能") || r.includes("置信度") || r.includes("警告")
        );
      });
      function handleAccept() {
        emit2("respond", {
          accepted: true,
          saveForDomain: saveForDomain.value
        });
      }
      function handleDismiss() {
        emit2("respond", {
          accepted: false,
          saveForDomain: false
        });
        emit2("dismiss");
      }
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Teleport, { to: "body" }, [
          createVNode(Transition, { name: "mnr-fade" }, {
            default: withCtx(() => [
              __props.visible ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "mnr-prompt-overlay",
                onClick: withModifiers(handleDismiss, ["self"])
              }, [
                createBaseVNode("div", _hoisted_1$6, [
                  _cache[4] || (_cache[4] = createBaseVNode("div", { class: "mnr-prompt-header" }, [
                    createBaseVNode("span", { class: "mnr-prompt-icon" }, "📖"),
                    createBaseVNode("h3", { class: "mnr-prompt-title" }, "启用 MyNovelReader?")
                  ], -1)),
                  createBaseVNode("div", _hoisted_2$5, [
                    createBaseVNode("div", _hoisted_3$5, [
                      createBaseVNode("div", {
                        class: normalizeClass(["mnr-confidence-fill", confidenceClass.value]),
                        style: normalizeStyle({ width: `${confidence.value * 100}%` })
                      }, null, 6)
                    ]),
                    createBaseVNode("span", _hoisted_4$5, " 检测置信度: " + toDisplayString((confidence.value * 100).toFixed(0)) + "% ", 1)
                  ]),
                  createBaseVNode("ul", _hoisted_5$4, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(positiveReasons.value, (reason) => {
                      return openBlock(), createElementBlock("li", {
                        key: reason,
                        class: "mnr-result-item success"
                      }, [
                        _cache[1] || (_cache[1] = createBaseVNode("span", { class: "mnr-result-icon" }, "✓", -1)),
                        createBaseVNode("span", null, toDisplayString(reason), 1)
                      ]);
                    }), 128)),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(negativeReasons.value, (reason) => {
                      return openBlock(), createElementBlock("li", {
                        key: reason,
                        class: "mnr-result-item warning"
                      }, [
                        _cache[2] || (_cache[2] = createBaseVNode("span", { class: "mnr-result-icon" }, "⚠", -1)),
                        createBaseVNode("span", null, toDisplayString(reason), 1)
                      ]);
                    }), 128))
                  ]),
                  createBaseVNode("label", _hoisted_6$4, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => saveForDomain.value = $event),
                      type: "checkbox",
                      class: "mnr-checkbox"
                    }, null, 512), [
                      [vModelCheckbox, saveForDomain.value]
                    ]),
                    _cache[3] || (_cache[3] = createBaseVNode("span", null, "为此站点自动启用", -1))
                  ]),
                  createBaseVNode("div", { class: "mnr-prompt-actions" }, [
                    createBaseVNode("button", {
                      class: "mnr-btn mnr-btn-secondary",
                      onClick: handleDismiss
                    }, "暂不"),
                    createBaseVNode("button", {
                      class: "mnr-btn mnr-btn-primary",
                      onClick: handleAccept
                    }, "启用阅读器")
                  ])
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const DetectionPrompt = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-333f72bb"]]);
  const _hoisted_1$5 = {
    key: 0,
    class: "mnr-progress-text"
  };
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "ProgressIndicator",
    props: {
      showText: { type: Boolean, default: false },
      autoHide: { type: Boolean, default: true },
      hideDelay: { default: 2e3 }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const percent = ref(0);
      const visible = ref(true);
      let hideTimeout = null;
      function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          percent.value = Math.round(scrollTop / scrollHeight * 100);
        } else {
          percent.value = 100;
        }
        visible.value = true;
        if (props.autoHide) {
          if (hideTimeout) clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            visible.value = false;
          }, props.hideDelay);
        }
      }
      onMounted(() => {
        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
      });
      onUnmounted(() => {
        window.removeEventListener("scroll", updateProgress);
        if (hideTimeout) clearTimeout(hideTimeout);
      });
      __expose({
        percent,
        updateProgress
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["mnr-progress", { hidden: !visible.value }])
        }, [
          createBaseVNode("div", {
            class: "mnr-progress-bar",
            style: normalizeStyle({ width: `${percent.value}%` })
          }, null, 4),
          __props.showText ? (openBlock(), createElementBlock("span", _hoisted_1$5, toDisplayString(percent.value) + "%", 1)) : createCommentVNode("", true)
        ], 2);
      };
    }
  });
  const ProgressIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-bc314d2a"]]);
  const _hoisted_1$4 = { class: "mnr-settings-panel" };
  const _hoisted_2$4 = { class: "mnr-settings-header" };
  const _hoisted_3$4 = { class: "mnr-settings-content" };
  const _hoisted_4$4 = { class: "mnr-settings-section" };
  const _hoisted_5$3 = { class: "mnr-theme-grid" };
  const _hoisted_6$3 = ["onClick"];
  const _hoisted_7$3 = { class: "mnr-settings-section" };
  const _hoisted_8$3 = { class: "mnr-slider-row" };
  const _hoisted_9$3 = ["value"];
  const _hoisted_10$3 = { class: "mnr-slider-value" };
  const _hoisted_11$3 = { class: "mnr-settings-section" };
  const _hoisted_12$3 = { class: "mnr-slider-row" };
  const _hoisted_13$3 = ["value"];
  const _hoisted_14$3 = { class: "mnr-slider-value" };
  const _hoisted_15$2 = { class: "mnr-settings-section" };
  const _hoisted_16$1 = { class: "mnr-slider-row" };
  const _hoisted_17$1 = ["value"];
  const _hoisted_18$1 = { class: "mnr-slider-value" };
  const _hoisted_19$1 = { class: "mnr-settings-section" };
  const _hoisted_20$1 = { class: "mnr-settings-section" };
  const _hoisted_21$1 = { class: "mnr-segmented-control" };
  const _hoisted_22$1 = {
    key: 0,
    class: "mnr-hint"
  };
  const _hoisted_23$1 = { class: "mnr-settings-section" };
  const _hoisted_24$1 = { class: "mnr-switch-row" };
  const _hoisted_25$1 = { class: "mnr-switch-row" };
  const _hoisted_26$1 = { class: "mnr-switch-row" };
  const _hoisted_27$1 = { class: "mnr-switch-row" };
  const _hoisted_28 = { class: "mnr-settings-section" };
  const _hoisted_29 = { class: "mnr-action-buttons" };
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "SettingsPanel",
    props: {
      visible: { type: Boolean }
    },
    emits: ["close", "editRule", "textConversionChange"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const configStore = useConfigStore();
      const themes = THEMES;
      const currentTheme = computed(() => configStore.themeId);
      const fontSize = ref(configStore.reading.fontSize);
      const lineHeight = ref(configStore.reading.lineHeight);
      const maxWidth = ref(configStore.reading.maxWidth);
      const fontFamily = ref(configStore.reading.fontFamily);
      const textConversion = ref(configStore.reading.textConversion);
      const keyboardNav = ref(configStore.behavior.keyboardNavigation);
      const swipeGestures = ref(configStore.behavior.swipeGestures);
      const autoHideHeader = ref(configStore.behavior.autoHideHeader);
      const showProgress = ref(configStore.behavior.showProgress);
      function setTheme(id) {
        configStore.setTheme(id);
      }
      function updateFontSize(e) {
        const value = Number(e.target.value);
        fontSize.value = value;
        configStore.updateReading({ fontSize: value });
        configStore.applyReading();
      }
      function updateLineHeight(e) {
        const value = Number(e.target.value);
        lineHeight.value = value;
        configStore.updateReading({ lineHeight: value });
        configStore.applyReading();
      }
      function updateMaxWidth(e) {
        const value = Number(e.target.value);
        maxWidth.value = value;
        configStore.updateReading({ maxWidth: value });
        configStore.applyReading();
      }
      function updateFontFamily() {
        configStore.updateReading({ fontFamily: fontFamily.value });
        configStore.applyReading();
      }
      function updateTextConversion(mode) {
        textConversion.value = mode;
        configStore.updateReading({ textConversion: mode });
        emit2("textConversionChange", mode);
      }
      function updateBehavior(key, value) {
        configStore.updateBehavior({ [key]: value });
      }
      watch(
        () => props.visible,
        (visible) => {
          if (visible) {
            fontSize.value = configStore.reading.fontSize;
            lineHeight.value = configStore.reading.lineHeight;
            maxWidth.value = configStore.reading.maxWidth;
            fontFamily.value = configStore.reading.fontFamily;
            textConversion.value = configStore.reading.textConversion;
            keyboardNav.value = configStore.behavior.keyboardNavigation;
            swipeGestures.value = configStore.behavior.swipeGestures;
            autoHideHeader.value = configStore.behavior.autoHideHeader;
            showProgress.value = configStore.behavior.showProgress;
          }
        }
      );
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Transition, { name: "mnr-slide" }, {
          default: withCtx(() => [
            __props.visible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "mnr-settings-overlay",
              onClick: _cache[15] || (_cache[15] = withModifiers(($event) => _ctx.$emit("close"), ["self"]))
            }, [
              createBaseVNode("div", _hoisted_1$4, [
                createBaseVNode("div", _hoisted_2$4, [
                  _cache[16] || (_cache[16] = createBaseVNode("h3", null, "阅读设置", -1)),
                  _cache[17] || (_cache[17] = createBaseVNode("span", { class: "mnr-shortcut-hint" }, "S", -1)),
                  createBaseVNode("button", {
                    class: "mnr-close-btn",
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
                  }, "✕")
                ]),
                createBaseVNode("div", _hoisted_3$4, [
                  createBaseVNode("section", _hoisted_4$4, [
                    _cache[18] || (_cache[18] = createBaseVNode("h4", null, "主题", -1)),
                    createBaseVNode("div", _hoisted_5$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(themes), (theme) => {
                        return openBlock(), createElementBlock("button", {
                          key: theme.id,
                          class: normalizeClass(["mnr-theme-btn", { active: currentTheme.value === theme.id }]),
                          style: normalizeStyle({
                            background: theme.background,
                            color: theme.text,
                            borderColor: theme.border
                          }),
                          onClick: ($event) => setTheme(theme.id)
                        }, toDisplayString(theme.name), 15, _hoisted_6$3);
                      }), 128))
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_7$3, [
                    _cache[21] || (_cache[21] = createBaseVNode("h4", null, "字体大小", -1)),
                    createBaseVNode("div", _hoisted_8$3, [
                      _cache[19] || (_cache[19] = createBaseVNode("span", { class: "mnr-slider-label" }, "A", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "14",
                        max: "28",
                        value: fontSize.value,
                        class: "mnr-slider",
                        onInput: updateFontSize
                      }, null, 40, _hoisted_9$3),
                      _cache[20] || (_cache[20] = createBaseVNode("span", {
                        class: "mnr-slider-label",
                        style: { "font-size": "1.2em" }
                      }, "A", -1)),
                      createBaseVNode("span", _hoisted_10$3, toDisplayString(fontSize.value) + "px", 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_11$3, [
                    _cache[24] || (_cache[24] = createBaseVNode("h4", null, "行间距", -1)),
                    createBaseVNode("div", _hoisted_12$3, [
                      _cache[22] || (_cache[22] = createBaseVNode("span", { class: "mnr-slider-label" }, "≡", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "1.4",
                        max: "2.4",
                        step: "0.1",
                        value: lineHeight.value,
                        class: "mnr-slider",
                        onInput: updateLineHeight
                      }, null, 40, _hoisted_13$3),
                      _cache[23] || (_cache[23] = createBaseVNode("span", { class: "mnr-slider-label" }, "☰", -1)),
                      createBaseVNode("span", _hoisted_14$3, toDisplayString(lineHeight.value), 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_15$2, [
                    _cache[27] || (_cache[27] = createBaseVNode("h4", null, "内容宽度", -1)),
                    createBaseVNode("div", _hoisted_16$1, [
                      _cache[25] || (_cache[25] = createBaseVNode("span", { class: "mnr-slider-label" }, "⊏⊐", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "500",
                        max: "1200",
                        step: "50",
                        value: maxWidth.value,
                        class: "mnr-slider",
                        onInput: updateMaxWidth
                      }, null, 40, _hoisted_17$1),
                      _cache[26] || (_cache[26] = createBaseVNode("span", { class: "mnr-slider-label" }, "⊏ ⊐", -1)),
                      createBaseVNode("span", _hoisted_18$1, toDisplayString(maxWidth.value) + "px", 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_19$1, [
                    _cache[29] || (_cache[29] = createBaseVNode("h4", null, "字体", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => fontFamily.value = $event),
                      class: "mnr-select",
                      onChange: updateFontFamily
                    }, [..._cache[28] || (_cache[28] = [
                      createBaseVNode("option", { value: "system-ui, -apple-system, 'Microsoft YaHei', sans-serif" }, " 系统默认 ", -1),
                      createBaseVNode("option", { value: "'Noto Serif SC', 'Source Han Serif SC', serif" }, "思源宋体", -1),
                      createBaseVNode("option", { value: "'PingFang SC', 'Hiragino Sans GB', sans-serif" }, "苹方", -1),
                      createBaseVNode("option", { value: "'Kaiti SC', 'STKaiti', serif" }, "楷体", -1)
                    ])], 544), [
                      [vModelSelect, fontFamily.value]
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_20$1, [
                    _cache[30] || (_cache[30] = createBaseVNode("h4", null, "简繁转换", -1)),
                    createBaseVNode("div", _hoisted_21$1, [
                      createBaseVNode("button", {
                        class: normalizeClass(["mnr-segment", { active: textConversion.value === "none" }]),
                        onClick: _cache[2] || (_cache[2] = ($event) => updateTextConversion("none"))
                      }, " 原文 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["mnr-segment", { active: textConversion.value === "sc" }]),
                        onClick: _cache[3] || (_cache[3] = ($event) => updateTextConversion("sc"))
                      }, " 简体 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["mnr-segment", { active: textConversion.value === "tc" }]),
                        onClick: _cache[4] || (_cache[4] = ($event) => updateTextConversion("tc"))
                      }, " 繁體 ", 2)
                    ]),
                    textConversion.value !== "none" ? (openBlock(), createElementBlock("p", _hoisted_22$1, toDisplayString(textConversion.value === "sc" ? "将繁体转换为简体中文" : "將簡體轉換為繁體中文"), 1)) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("section", _hoisted_23$1, [
                    _cache[35] || (_cache[35] = createBaseVNode("h4", null, "阅读行为", -1)),
                    createBaseVNode("label", _hoisted_24$1, [
                      _cache[31] || (_cache[31] = createBaseVNode("span", null, "键盘导航", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => keyboardNav.value = $event),
                        type: "checkbox",
                        onChange: _cache[6] || (_cache[6] = ($event) => updateBehavior("keyboardNavigation", keyboardNav.value))
                      }, null, 544), [
                        [vModelCheckbox, keyboardNav.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_25$1, [
                      _cache[32] || (_cache[32] = createBaseVNode("span", null, "手势翻页", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => swipeGestures.value = $event),
                        type: "checkbox",
                        onChange: _cache[8] || (_cache[8] = ($event) => updateBehavior("swipeGestures", swipeGestures.value))
                      }, null, 544), [
                        [vModelCheckbox, swipeGestures.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_26$1, [
                      _cache[33] || (_cache[33] = createBaseVNode("span", null, "自动隐藏顶栏", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => autoHideHeader.value = $event),
                        type: "checkbox",
                        onChange: _cache[10] || (_cache[10] = ($event) => updateBehavior("autoHideHeader", autoHideHeader.value))
                      }, null, 544), [
                        [vModelCheckbox, autoHideHeader.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_27$1, [
                      _cache[34] || (_cache[34] = createBaseVNode("span", null, "显示阅读进度", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => showProgress.value = $event),
                        type: "checkbox",
                        onChange: _cache[12] || (_cache[12] = ($event) => updateBehavior("showProgress", showProgress.value))
                      }, null, 544), [
                        [vModelCheckbox, showProgress.value]
                      ])
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_28, [
                    _cache[36] || (_cache[36] = createBaseVNode("h4", null, "操作", -1)),
                    createBaseVNode("div", _hoisted_29, [
                      createBaseVNode("button", {
                        class: "mnr-action-btn",
                        onClick: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("editRule"))
                      }, "编辑站点规则"),
                      createBaseVNode("button", {
                        class: "mnr-action-btn",
                        onClick: _cache[14] || (_cache[14] = ($event) => {
                          _ctx.$emit("close");
                          unref(closeReader)();
                        })
                      }, " 退出阅读模式 ")
                    ])
                  ])
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  });
  const _hoisted_1$3 = { class: "mnr-picker-tag" };
  const _hoisted_2$3 = { class: "mnr-picker-selector" };
  const _hoisted_3$3 = { class: "mnr-picker-controls" };
  const _hoisted_4$3 = { class: "mnr-picker-label" };
  const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    __name: "ElementPicker",
    props: {
      mode: { default: "content" },
      active: { type: Boolean, default: false }
    },
    emits: ["select", "cancel", "update:active"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const isActive2 = ref(false);
      const hoveredElement = ref(null);
      const highlightRect = ref(null);
      const overlayRef = ref(null);
      const mouseX = ref(0);
      const mouseY = ref(0);
      const rafId = ref(null);
      const modeLabels = {
        content: "选择内容区域",
        next: '选择"下一章"链接',
        prev: '选择"上一章"链接',
        index: '选择"目录"链接',
        title: "选择标题元素",
        remove: "选择要移除的元素"
      };
      const modeLabel = computed(() => modeLabels[props.mode]);
      const highlightStyle = computed(() => {
        if (!highlightRect.value) return {};
        const rect = highlightRect.value;
        return {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        };
      });
      const tooltipStyle = computed(() => {
        if (!highlightRect.value) return {};
        const rect = highlightRect.value;
        let top = rect.top - 60;
        let left = rect.left;
        if (top < 10) top = rect.bottom + 10;
        if (left < 10) left = 10;
        if (left > window.innerWidth - 200) left = window.innerWidth - 200;
        return {
          top: `${top}px`,
          left: `${left}px`
        };
      });
      const elementTag = computed(() => {
        if (!hoveredElement.value) return "";
        const el = hoveredElement.value;
        let tag = el.tagName.toLowerCase();
        if (el.id) tag += `#${el.id}`;
        if (el.className && typeof el.className === "string") {
          const classes = el.className.trim().split(/\s+/).slice(0, 2);
          tag += classes.map((c) => `.${c}`).join("");
        }
        return tag;
      });
      const generatedSelector = computed(() => {
        if (!hoveredElement.value) return "";
        return generateSelector(hoveredElement.value);
      });
      function generateSelector(element) {
        if (element.id) {
          const escaped = cssEscape2(element.id);
          return `#${escaped}`;
        }
        if (element.className && typeof element.className === "string") {
          const classes = element.className.trim().split(/\s+/).filter((c) => c.length > 0);
          for (const cls of classes) {
            const selector = `.${cssEscape2(cls)}`;
            try {
              if (document.querySelectorAll(selector).length === 1) {
                return selector;
              }
            } catch {
            }
          }
          if (classes.length >= 2) {
            const selector = classes.slice(0, 3).map((c) => `.${cssEscape2(c)}`).join("");
            try {
              if (document.querySelectorAll(selector).length === 1) {
                return selector;
              }
            } catch {
            }
          }
        }
        return buildPathSelector(element);
      }
      function buildPathSelector(element) {
        const path = [];
        let current = element;
        while (current && current !== document.body && path.length < 5) {
          let selector = current.tagName.toLowerCase();
          if (current.id) {
            selector = `#${cssEscape2(current.id)}`;
            path.unshift(selector);
            break;
          }
          const parent = current.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter((c) => c.tagName === current.tagName);
            if (siblings.length > 1) {
              const index = siblings.indexOf(current) + 1;
              selector += `:nth-child(${index})`;
            }
          }
          path.unshift(selector);
          current = parent;
        }
        return path.join(" > ");
      }
      function cssEscape2(str) {
        if (typeof globalThis.CSS !== "undefined" && globalThis.CSS.escape) {
          return globalThis.CSS.escape(str);
        }
        return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
      }
      function handleMouseMove(e) {
        if (!isActive2.value) return;
        mouseX.value = e.clientX;
        mouseY.value = e.clientY;
      }
      function tick() {
        if (!isActive2.value) return;
        const overlay = overlayRef.value;
        if (overlay) {
          overlay.style.pointerEvents = "none";
        }
        const target = document.elementFromPoint(mouseX.value, mouseY.value);
        if (overlay) {
          overlay.style.pointerEvents = "";
        }
        if (target && !target.closest('[id^="mnr-"]') && !target.closest(".mnr-picker-overlay")) {
          hoveredElement.value = target;
          highlightRect.value = target.getBoundingClientRect();
        }
        rafId.value = globalThis.requestAnimationFrame(tick);
      }
      function handleClick(e) {
        if (!isActive2.value) return;
        const overlay = overlayRef.value;
        if (overlay) {
          overlay.style.pointerEvents = "none";
        }
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (overlay) {
          overlay.style.pointerEvents = "";
        }
        if (!target || target.closest('[id^="mnr-"]') || target.closest(".mnr-picker-overlay")) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const selector = generateSelector(target);
        emit2("select", { element: target, selector });
        deactivate();
      }
      function handleKeyDown(e) {
        if (e.key === "Escape") {
          cancel();
        }
      }
      function handleScroll() {
        if (hoveredElement.value) {
          highlightRect.value = hoveredElement.value.getBoundingClientRect();
        }
      }
      function cancel() {
        emit2("cancel");
        deactivate();
      }
      function activate() {
        isActive2.value = true;
        document.addEventListener("mousemove", handleMouseMove, true);
        document.addEventListener("click", handleClick, true);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        document.body.style.cursor = "crosshair";
        rafId.value = globalThis.requestAnimationFrame(tick);
      }
      function deactivate() {
        isActive2.value = false;
        hoveredElement.value = null;
        highlightRect.value = null;
        document.removeEventListener("mousemove", handleMouseMove, true);
        document.removeEventListener("click", handleClick, true);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("scroll", handleScroll, true);
        document.body.style.cursor = "";
        if (rafId.value !== null) {
          globalThis.cancelAnimationFrame(rafId.value);
          rafId.value = null;
        }
        emit2("update:active", false);
      }
      watch(
        () => props.active,
        (newVal) => {
          if (newVal && !isActive2.value) {
            activate();
          } else if (!newVal && isActive2.value) {
            deactivate();
          }
        },
        { immediate: true }
      );
      onUnmounted(() => {
        if (isActive2.value) {
          deactivate();
        }
      });
      __expose({
        activate,
        deactivate,
        isActive: isActive2
      });
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Teleport, { to: "body" }, [
          isActive2.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "overlayRef",
            ref: overlayRef,
            class: "mnr-picker-overlay"
          }, [
            highlightRect.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "mnr-picker-highlight",
              style: normalizeStyle(highlightStyle.value)
            }, null, 4)) : createCommentVNode("", true),
            hoveredElement.value ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "mnr-picker-tooltip",
              style: normalizeStyle(tooltipStyle.value)
            }, [
              createBaseVNode("div", _hoisted_1$3, toDisplayString(elementTag.value), 1),
              createBaseVNode("div", _hoisted_2$3, toDisplayString(generatedSelector.value), 1)
            ], 4)) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_3$3, [
              createBaseVNode("span", _hoisted_4$3, toDisplayString(modeLabel.value), 1),
              _cache[0] || (_cache[0] = createBaseVNode("span", { class: "mnr-picker-hint" }, "点击选择元素，ESC 取消", -1)),
              createBaseVNode("button", {
                class: "mnr-picker-cancel",
                onClick: cancel
              }, "取消")
            ])
          ], 512)) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const ElementPicker = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-6493a95a"]]);
  const _hoisted_1$2 = { class: "mnr-selector-preview" };
  const _hoisted_2$2 = { class: "mnr-preview-header" };
  const _hoisted_3$2 = { class: "mnr-preview-label" };
  const _hoisted_4$2 = { class: "mnr-preview-actions" };
  const _hoisted_5$2 = ["disabled"];
  const _hoisted_6$2 = { class: "mnr-preview-input-row" };
  const _hoisted_7$2 = {
    key: 1,
    class: "mnr-preview-selector"
  };
  const _hoisted_8$2 = { key: 0 };
  const _hoisted_9$2 = { key: 1 };
  const _hoisted_10$2 = { key: 2 };
  const _hoisted_11$2 = {
    key: 1,
    class: "mnr-preview-content"
  };
  const _hoisted_12$2 = { class: "mnr-preview-content-header" };
  const _hoisted_13$2 = ["innerHTML"];
  const _hoisted_14$2 = {
    key: 0,
    class: "mnr-highlight-overlay"
  };
  const _hoisted_15$1 = { class: "mnr-highlight-label" };
  const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    __name: "SelectorPreview",
    props: {
      label: {},
      selector: { default: "" },
      editable: { type: Boolean, default: true },
      showPreview: { type: Boolean, default: true },
      previewType: { default: "text" }
    },
    emits: ["update:selector", "pick"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const localSelector = ref(props.selector);
      const matchCount = ref(null);
      const previewContent = ref("");
      const expanded = ref(false);
      const isHighlighting = ref(false);
      const highlightRects = ref([]);
      const matchClass = computed(() => {
        if (matchCount.value === null) return "";
        if (matchCount.value === 0) return "error";
        if (matchCount.value === 1) return "success";
        return "warning";
      });
      const sanitizedPreview = computed(() => {
        if (props.previewType === "text") {
          return escapeHtml(previewContent.value);
        }
        return previewContent.value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").slice(0, 2e3);
      });
      function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
      }
      function getHighlightStyle(rect) {
        return {
          position: "absolute",
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        };
      }
      function testSelector() {
        var _a;
        if (!localSelector.value) {
          matchCount.value = null;
          previewContent.value = "";
          return;
        }
        try {
          const elements = document.querySelectorAll(localSelector.value);
          matchCount.value = elements.length;
          if (elements.length > 0) {
            const el = elements[0];
            if (props.previewType === "text") {
              previewContent.value = ((_a = el.textContent) == null ? void 0 : _a.slice(0, 500)) || "";
            } else {
              previewContent.value = el.innerHTML.slice(0, 2e3);
            }
          } else {
            previewContent.value = "";
          }
        } catch {
          matchCount.value = 0;
          previewContent.value = "";
        }
      }
      function updateHighlightRects() {
        var _a;
        if (!localSelector.value) {
          highlightRects.value = [];
          return;
        }
        try {
          const elements = document.querySelectorAll(localSelector.value);
          highlightRects.value = Array.from(elements).map((el) => el.getBoundingClientRect());
          matchCount.value = elements.length;
          if (elements.length > 0) {
            const el = elements[0];
            if (props.previewType === "text") {
              previewContent.value = ((_a = el.textContent) == null ? void 0 : _a.slice(0, 500)) || "";
            } else {
              previewContent.value = el.innerHTML.slice(0, 2e3);
            }
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            previewContent.value = "";
          }
        } catch {
          highlightRects.value = [];
          matchCount.value = 0;
          previewContent.value = "";
        }
      }
      function toggleHighlight() {
        if (isHighlighting.value) {
          stopHighlight();
        } else {
          startHighlight();
        }
      }
      function startHighlight() {
        isHighlighting.value = true;
        updateHighlightRects();
        window.addEventListener("scroll", updateHighlightRects);
        window.addEventListener("resize", updateHighlightRects);
      }
      function stopHighlight() {
        isHighlighting.value = false;
        highlightRects.value = [];
        window.removeEventListener("scroll", updateHighlightRects);
        window.removeEventListener("resize", updateHighlightRects);
      }
      function handleInput() {
        emit2("update:selector", localSelector.value);
        if (isHighlighting.value) {
          stopHighlight();
        }
      }
      function handleBlur() {
        testSelector();
      }
      watch(
        () => props.selector,
        (newVal) => {
          localSelector.value = newVal;
          if (newVal) {
            testSelector();
          }
          if (isHighlighting.value) {
            updateHighlightRects();
          }
        }
      );
      onUnmounted(() => {
        if (isHighlighting.value) {
          stopHighlight();
        }
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$2, [
          createBaseVNode("div", _hoisted_2$2, [
            createBaseVNode("label", _hoisted_3$2, toDisplayString(__props.label), 1),
            createBaseVNode("div", _hoisted_4$2, [
              __props.editable ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "mnr-preview-btn",
                title: "可视化选择",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("pick"))
              }, " 🎯 ")) : createCommentVNode("", true),
              createBaseVNode("button", {
                class: normalizeClass(["mnr-preview-btn", { "mnr-btn-active": isHighlighting.value }]),
                disabled: !localSelector.value,
                title: "高亮选中元素",
                onClick: toggleHighlight
              }, toDisplayString(isHighlighting.value ? "✕" : "👁"), 11, _hoisted_5$2)
            ])
          ]),
          createBaseVNode("div", _hoisted_6$2, [
            __props.editable ? withDirectives((openBlock(), createElementBlock("input", {
              key: 0,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => localSelector.value = $event),
              type: "text",
              class: "mnr-preview-input",
              placeholder: "CSS 选择器",
              onInput: handleInput,
              onBlur: handleBlur
            }, null, 544)), [
              [vModelText, localSelector.value]
            ]) : (openBlock(), createElementBlock("span", _hoisted_7$2, toDisplayString(__props.selector || "未设置"), 1))
          ]),
          matchCount.value !== null ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["mnr-preview-match", matchClass.value])
          }, [
            matchCount.value === 0 ? (openBlock(), createElementBlock("span", _hoisted_8$2, "❌ 未找到匹配元素")) : matchCount.value === 1 ? (openBlock(), createElementBlock("span", _hoisted_9$2, "✓ 找到 1 个元素")) : (openBlock(), createElementBlock("span", _hoisted_10$2, "⚠ 找到 " + toDisplayString(matchCount.value) + " 个元素", 1))
          ], 2)) : createCommentVNode("", true),
          __props.showPreview && previewContent.value ? (openBlock(), createElementBlock("div", _hoisted_11$2, [
            createBaseVNode("div", _hoisted_12$2, [
              _cache[3] || (_cache[3] = createBaseVNode("span", null, "预览", -1)),
              createBaseVNode("button", {
                class: "mnr-preview-expand",
                onClick: _cache[2] || (_cache[2] = ($event) => expanded.value = !expanded.value)
              }, toDisplayString(expanded.value ? "收起" : "展开"), 1)
            ]),
            createBaseVNode("div", {
              class: normalizeClass(["mnr-preview-text", { expanded: expanded.value }]),
              innerHTML: sanitizedPreview.value
            }, null, 10, _hoisted_13$2)
          ])) : createCommentVNode("", true),
          (openBlock(), createBlock(Teleport, { to: "body" }, [
            isHighlighting.value && highlightRects.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_14$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(highlightRects.value, (rect, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: "mnr-highlight-box",
                  style: normalizeStyle(getHighlightStyle(rect))
                }, [
                  createBaseVNode("span", _hoisted_15$1, toDisplayString(index + 1), 1)
                ], 4);
              }), 128))
            ])) : createCommentVNode("", true)
          ]))
        ]);
      };
    }
  });
  const SelectorPreview = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-31cda065"]]);
  const _hoisted_1$1 = { class: "mnr-editor-header" };
  const _hoisted_2$1 = { class: "mnr-editor-title" };
  const _hoisted_3$1 = { class: "mnr-editor-tabs" };
  const _hoisted_4$1 = ["onClick"];
  const _hoisted_5$1 = { class: "mnr-editor-content" };
  const _hoisted_6$1 = { class: "mnr-form-section" };
  const _hoisted_7$1 = { class: "mnr-form-group" };
  const _hoisted_8$1 = { class: "mnr-form-group" };
  const _hoisted_9$1 = { class: "mnr-form-section" };
  const _hoisted_10$1 = { class: "mnr-form-group" };
  const _hoisted_11$1 = { class: "mnr-form-section" };
  const _hoisted_12$1 = { class: "mnr-form-section" };
  const _hoisted_13$1 = { class: "mnr-editor-content" };
  const _hoisted_14$1 = { class: "mnr-code-toolbar" };
  const _hoisted_15 = {
    key: 0,
    class: "mnr-code-error"
  };
  const _hoisted_16 = { class: "mnr-editor-content" };
  const _hoisted_17 = { class: "mnr-form-section" };
  const _hoisted_18 = { class: "mnr-checkbox-row" };
  const _hoisted_19 = { class: "mnr-checkbox-row" };
  const _hoisted_20 = { class: "mnr-checkbox-row" };
  const _hoisted_21 = { class: "mnr-form-section" };
  const _hoisted_22 = { class: "mnr-form-group" };
  const _hoisted_23 = { class: "mnr-form-group" };
  const _hoisted_24 = { class: "mnr-form-section" };
  const _hoisted_25 = { class: "mnr-form-group" };
  const _hoisted_26 = { class: "mnr-editor-footer" };
  const _hoisted_27 = ["disabled"];
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "RuleEditorPanel",
    props: {
      rule: {},
      domain: {}
    },
    emits: ["save", "cancel", "pickerStateChange"],
    setup(__props, { emit: __emit }) {
      var _a, _b, _c, _d, _e, _f;
      const props = __props;
      const emit2 = __emit;
      const tabs = [
        { id: "visual", label: "可视化" },
        { id: "code", label: "代码" },
        { id: "advanced", label: "高级" }
      ];
      const activeTab = ref("visual");
      const createEmptyRule = () => ({
        id: `user-${Date.now()}`,
        name: "",
        version: 1,
        match: {
          pattern: props.domain ? `^https?://${props.domain.replace(/\./g, "\\.")}/` : "",
          type: "regex"
        },
        content: {
          selector: ""
        },
        meta: {
          source: "user",
          autoLaunch: true
        }
      });
      const localRule = reactive(props.rule ? { ...props.rule } : createEmptyRule());
      const navPrev = computed({
        get: () => {
          var _a2;
          return typeof ((_a2 = localRule.navigation) == null ? void 0 : _a2.prev) === "string" ? localRule.navigation.prev : "";
        },
        set: (val) => {
          if (!localRule.navigation) localRule.navigation = {};
          localRule.navigation.prev = val || void 0;
        }
      });
      const navNext = computed({
        get: () => {
          var _a2;
          return typeof ((_a2 = localRule.navigation) == null ? void 0 : _a2.next) === "string" ? localRule.navigation.next : "";
        },
        set: (val) => {
          if (!localRule.navigation) localRule.navigation = {};
          localRule.navigation.next = val || void 0;
        }
      });
      const navIndex = computed({
        get: () => {
          var _a2;
          return typeof ((_a2 = localRule.navigation) == null ? void 0 : _a2.index) === "string" ? localRule.navigation.index : "";
        },
        set: (val) => {
          if (!localRule.navigation) localRule.navigation = {};
          localRule.navigation.index = val || void 0;
        }
      });
      const titleSelector = computed({
        get: () => {
          var _a2;
          return ((_a2 = localRule.title) == null ? void 0 : _a2.selector) || "";
        },
        set: (val) => {
          if (!localRule.title) localRule.title = {};
          localRule.title.selector = val || void 0;
        }
      });
      const processingOptions = reactive({
        removeAds: ((_a = localRule.processing) == null ? void 0 : _a.removeAds) ?? true,
        fixImages: ((_b = localRule.processing) == null ? void 0 : _b.fixImages) ?? true,
        useRawContent: ((_c = localRule.processing) == null ? void 0 : _c.useRawContent) ?? false
      });
      const hookBeforeParse = ref(((_d = localRule.hooks) == null ? void 0 : _d.beforeParse) || "");
      const hookAfterParse = ref(((_e = localRule.hooks) == null ? void 0 : _e.afterParse) || "");
      const customCSS = ref(((_f = localRule.style) == null ? void 0 : _f.customCSS) || "");
      const codeFormat = ref("json");
      const codeContent = ref("");
      const codeError = ref("");
      const pickerActive = ref(false);
      const pickerMode = ref("content");
      const isNew = computed(() => !props.rule);
      const isValid = computed(() => {
        return localRule.match.pattern && localRule.content.selector;
      });
      function startPicking(mode) {
        pickerMode.value = mode;
        pickerActive.value = true;
        emit2("pickerStateChange", true);
      }
      function handlePickerSelect(result) {
        switch (pickerMode.value) {
          case "content":
            localRule.content.selector = result.selector;
            break;
          case "prev":
            navPrev.value = result.selector;
            break;
          case "next":
            navNext.value = result.selector;
            break;
          case "index":
            navIndex.value = result.selector;
            break;
          case "title":
            titleSelector.value = result.selector;
            break;
        }
        pickerActive.value = false;
        emit2("pickerStateChange", false);
      }
      function handlePickerCancel() {
        pickerActive.value = false;
        emit2("pickerStateChange", false);
      }
      function updateCodeFromRule() {
        try {
          if (codeFormat.value === "json") {
            codeContent.value = JSON.stringify(localRule, null, 2);
          } else {
            codeContent.value = jsonToYaml(localRule);
          }
          codeError.value = "";
        } catch (e) {
          codeError.value = `转换错误: ${e}`;
        }
      }
      function parseCode() {
        try {
          let parsed;
          if (codeFormat.value === "json") {
            parsed = JSON.parse(codeContent.value);
          } else {
            parsed = yamlToJson(codeContent.value);
          }
          Object.assign(localRule, parsed);
          codeError.value = "";
        } catch (e) {
          codeError.value = `解析错误: ${e}`;
        }
      }
      function formatCode() {
        parseCode();
        if (!codeError.value) {
          updateCodeFromRule();
        }
      }
      function validateCode() {
        parseCode();
        if (!codeError.value) {
          codeError.value = "✓ 格式正确";
          setTimeout(() => {
            codeError.value = "";
          }, 2e3);
        }
      }
      function jsonToYaml(obj, indent = 0) {
        const spaces = "  ".repeat(indent);
        if (obj === null || obj === void 0) return "null";
        if (typeof obj === "string") return `"${obj}"`;
        if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
        if (Array.isArray(obj)) {
          if (obj.length === 0) return "[]";
          return obj.map((item) => `${spaces}- ${jsonToYaml(item, indent + 1)}`).join("\n");
        }
        if (typeof obj === "object") {
          const entries = Object.entries(obj).filter(([, v]) => v !== void 0);
          if (entries.length === 0) return "{}";
          return entries.map(([k, v]) => {
            const value = jsonToYaml(v, indent + 1);
            if (typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v).length > 0) {
              return `${spaces}${k}:
${value}`;
            }
            return `${spaces}${k}: ${value}`;
          }).join("\n");
        }
        return String(obj);
      }
      function yamlToJson(yaml) {
        const lines = yaml.split("\n");
        const result = {};
        const stack2 = [{ obj: result, indent: -2 }];
        for (const line of lines) {
          if (!line.trim() || line.trim().startsWith("#")) continue;
          const match = line.match(/^(\s*)(\w+):\s*(.*)$/);
          if (!match) continue;
          const indent = match[1].length;
          const key = match[2];
          let value = match[3].trim();
          if (value === "" || value === "{}") {
            value = {};
          } else if (value === "[]") {
            value = [];
          } else if (value === "true") {
            value = true;
          } else if (value === "false") {
            value = false;
          } else if (value === "null") {
            value = null;
          } else if (/^-?\d+(\.\d+)?$/.test(value)) {
            value = Number(value);
          } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          while (stack2.length > 1 && stack2[stack2.length - 1].indent >= indent) {
            stack2.pop();
          }
          const parent = stack2[stack2.length - 1].obj;
          parent[key] = value;
          if (typeof value === "object" && value !== null) {
            stack2.push({ obj: value, indent });
          }
        }
        return result;
      }
      function save() {
        if (!localRule.processing) localRule.processing = {};
        localRule.processing.removeAds = processingOptions.removeAds;
        localRule.processing.fixImages = processingOptions.fixImages;
        localRule.processing.useRawContent = processingOptions.useRawContent;
        if (hookBeforeParse.value || hookAfterParse.value) {
          if (!localRule.hooks) localRule.hooks = {};
          if (hookBeforeParse.value) localRule.hooks.beforeParse = hookBeforeParse.value;
          if (hookAfterParse.value) localRule.hooks.afterParse = hookAfterParse.value;
        }
        if (customCSS.value) {
          if (!localRule.style) localRule.style = {};
          localRule.style.customCSS = customCSS.value;
        }
        if (!localRule.meta) localRule.meta = {};
        localRule.meta.source = "user";
        localRule.meta.updated = Date.now();
        localRule.version = (localRule.version || 0) + 1;
        emit2("save", { ...localRule });
      }
      watch(activeTab, (tab) => {
        if (tab === "code") {
          updateCodeFromRule();
        }
      });
      watch(codeFormat, () => {
        updateCodeFromRule();
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["mnr-rule-editor", { "mnr-editor-hidden": pickerActive.value }])
        }, [
          createBaseVNode("div", _hoisted_1$1, [
            createBaseVNode("h3", _hoisted_2$1, toDisplayString(isNew.value ? "创建规则" : "编辑规则"), 1),
            _cache[23] || (_cache[23] = createBaseVNode("span", { class: "mnr-shortcut-hint" }, "E", -1)),
            createBaseVNode("div", _hoisted_3$1, [
              (openBlock(), createElementBlock(Fragment, null, renderList(tabs, (tab) => {
                return createBaseVNode("button", {
                  key: tab.id,
                  class: normalizeClass(["mnr-tab-btn", { active: activeTab.value === tab.id }]),
                  onClick: ($event) => activeTab.value = tab.id
                }, toDisplayString(tab.label), 11, _hoisted_4$1);
              }), 64))
            ])
          ]),
          withDirectives(createBaseVNode("div", _hoisted_5$1, [
            createBaseVNode("div", _hoisted_6$1, [
              _cache[27] || (_cache[27] = createBaseVNode("h4", { class: "mnr-section-title" }, "基本信息", -1)),
              createBaseVNode("div", _hoisted_7$1, [
                _cache[24] || (_cache[24] = createBaseVNode("label", null, "规则名称", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => localRule.name = $event),
                  type: "text",
                  placeholder: "例如: 起点中文网"
                }, null, 512), [
                  [vModelText, localRule.name]
                ])
              ]),
              createBaseVNode("div", _hoisted_8$1, [
                _cache[25] || (_cache[25] = createBaseVNode("label", null, "URL 匹配模式", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => localRule.match.pattern = $event),
                  type: "text",
                  placeholder: "正则表达式，例如: ^https://www\\\\.example\\\\.com/"
                }, null, 512), [
                  [vModelText, localRule.match.pattern]
                ]),
                _cache[26] || (_cache[26] = createBaseVNode("span", { class: "mnr-hint" }, "正则表达式，匹配当前页面 URL", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_9$1, [
              _cache[30] || (_cache[30] = createBaseVNode("h4", { class: "mnr-section-title" }, "内容选择器", -1)),
              createVNode(SelectorPreview, {
                selector: localRule.content.selector,
                "onUpdate:selector": _cache[2] || (_cache[2] = ($event) => localRule.content.selector = $event),
                label: "正文内容",
                "show-preview": true,
                "preview-type": "html",
                onPick: _cache[3] || (_cache[3] = ($event) => startPicking("content"))
              }, null, 8, ["selector"]),
              createBaseVNode("div", _hoisted_10$1, [
                _cache[28] || (_cache[28] = createBaseVNode("label", null, "移除元素", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => localRule.content.remove = $event),
                  type: "text",
                  placeholder: "例如: .ad, .comment, script"
                }, null, 512), [
                  [vModelText, localRule.content.remove]
                ]),
                _cache[29] || (_cache[29] = createBaseVNode("span", { class: "mnr-hint" }, "要从内容中移除的元素选择器，逗号分隔", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_11$1, [
              _cache[31] || (_cache[31] = createBaseVNode("h4", { class: "mnr-section-title" }, "导航链接", -1)),
              createVNode(SelectorPreview, {
                selector: navPrev.value,
                "onUpdate:selector": _cache[5] || (_cache[5] = ($event) => navPrev.value = $event),
                label: "上一章",
                "show-preview": false,
                onPick: _cache[6] || (_cache[6] = ($event) => startPicking("prev"))
              }, null, 8, ["selector"]),
              createVNode(SelectorPreview, {
                selector: navNext.value,
                "onUpdate:selector": _cache[7] || (_cache[7] = ($event) => navNext.value = $event),
                label: "下一章",
                "show-preview": false,
                onPick: _cache[8] || (_cache[8] = ($event) => startPicking("next"))
              }, null, 8, ["selector"]),
              createVNode(SelectorPreview, {
                selector: navIndex.value,
                "onUpdate:selector": _cache[9] || (_cache[9] = ($event) => navIndex.value = $event),
                label: "目录",
                "show-preview": false,
                onPick: _cache[10] || (_cache[10] = ($event) => startPicking("index"))
              }, null, 8, ["selector"])
            ]),
            createBaseVNode("div", _hoisted_12$1, [
              _cache[32] || (_cache[32] = createBaseVNode("h4", { class: "mnr-section-title" }, "标题", -1)),
              createVNode(SelectorPreview, {
                selector: titleSelector.value,
                "onUpdate:selector": _cache[11] || (_cache[11] = ($event) => titleSelector.value = $event),
                label: "章节标题",
                "show-preview": true,
                "preview-type": "text",
                onPick: _cache[12] || (_cache[12] = ($event) => startPicking("title"))
              }, null, 8, ["selector"])
            ])
          ], 512), [
            [vShow, activeTab.value === "visual"]
          ]),
          withDirectives(createBaseVNode("div", _hoisted_13$1, [
            createBaseVNode("div", _hoisted_14$1, [
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => codeFormat.value = $event),
                class: "mnr-format-select"
              }, [..._cache[33] || (_cache[33] = [
                createBaseVNode("option", { value: "json" }, "JSON", -1),
                createBaseVNode("option", { value: "yaml" }, "YAML", -1)
              ])], 512), [
                [vModelSelect, codeFormat.value]
              ]),
              createBaseVNode("button", {
                class: "mnr-toolbar-btn",
                onClick: formatCode
              }, "格式化"),
              createBaseVNode("button", {
                class: "mnr-toolbar-btn",
                onClick: validateCode
              }, "验证")
            ]),
            withDirectives(createBaseVNode("textarea", {
              "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => codeContent.value = $event),
              class: "mnr-code-editor",
              spellcheck: "false",
              onBlur: parseCode
            }, null, 544), [
              [vModelText, codeContent.value]
            ]),
            codeError.value ? (openBlock(), createElementBlock("div", _hoisted_15, toDisplayString(codeError.value), 1)) : createCommentVNode("", true)
          ], 512), [
            [vShow, activeTab.value === "code"]
          ]),
          withDirectives(createBaseVNode("div", _hoisted_16, [
            createBaseVNode("div", _hoisted_17, [
              _cache[37] || (_cache[37] = createBaseVNode("h4", { class: "mnr-section-title" }, "处理选项", -1)),
              createBaseVNode("label", _hoisted_18, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => processingOptions.removeAds = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, processingOptions.removeAds]
                ]),
                _cache[34] || (_cache[34] = createBaseVNode("span", null, "移除广告", -1))
              ]),
              createBaseVNode("label", _hoisted_19, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => processingOptions.fixImages = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, processingOptions.fixImages]
                ]),
                _cache[35] || (_cache[35] = createBaseVNode("span", null, "修复图片", -1))
              ]),
              createBaseVNode("label", _hoisted_20, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => processingOptions.useRawContent = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, processingOptions.useRawContent]
                ]),
                _cache[36] || (_cache[36] = createBaseVNode("span", null, "使用原始内容（不处理）", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_21, [
              _cache[40] || (_cache[40] = createBaseVNode("h4", { class: "mnr-section-title" }, "自定义钩子", -1)),
              createBaseVNode("div", _hoisted_22, [
                _cache[38] || (_cache[38] = createBaseVNode("label", null, "解析前执行 (beforeParse)", -1)),
                withDirectives(createBaseVNode("textarea", {
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => hookBeforeParse.value = $event),
                  class: "mnr-hook-editor",
                  placeholder: "// JavaScript 代码，参数: doc"
                }, null, 512), [
                  [vModelText, hookBeforeParse.value]
                ])
              ]),
              createBaseVNode("div", _hoisted_23, [
                _cache[39] || (_cache[39] = createBaseVNode("label", null, "解析后执行 (afterParse)", -1)),
                withDirectives(createBaseVNode("textarea", {
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => hookAfterParse.value = $event),
                  class: "mnr-hook-editor",
                  placeholder: "// JavaScript 代码，参数: content"
                }, null, 512), [
                  [vModelText, hookAfterParse.value]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_24, [
              _cache[41] || (_cache[41] = createBaseVNode("h4", { class: "mnr-section-title" }, "自定义 CSS", -1)),
              createBaseVNode("div", _hoisted_25, [
                withDirectives(createBaseVNode("textarea", {
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => customCSS.value = $event),
                  class: "mnr-css-editor",
                  placeholder: "/* 自定义样式 */"
                }, null, 512), [
                  [vModelText, customCSS.value]
                ])
              ])
            ])
          ], 512), [
            [vShow, activeTab.value === "advanced"]
          ]),
          createBaseVNode("div", _hoisted_26, [
            createBaseVNode("button", {
              class: "mnr-btn mnr-btn-secondary",
              onClick: _cache[21] || (_cache[21] = ($event) => _ctx.$emit("cancel"))
            }, "取消"),
            createBaseVNode("button", {
              class: "mnr-btn mnr-btn-primary",
              disabled: !isValid.value,
              onClick: save
            }, "保存规则", 8, _hoisted_27)
          ]),
          createVNode(ElementPicker, {
            active: pickerActive.value,
            "onUpdate:active": _cache[22] || (_cache[22] = ($event) => pickerActive.value = $event),
            mode: pickerMode.value,
            onSelect: handlePickerSelect,
            onCancel: handlePickerCancel
          }, null, 8, ["active", "mode"])
        ], 2);
      };
    }
  });
  const RuleEditorPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2f6fea54"]]);
  const _hoisted_1 = { class: "mnr-reader" };
  const _hoisted_2 = { class: "mnr-header-center" };
  const _hoisted_3 = { class: "mnr-chapter-title" };
  const _hoisted_4 = {
    key: 0,
    class: "mnr-book-title"
  };
  const _hoisted_5 = {
    key: 0,
    class: "mnr-loading-prev"
  };
  const _hoisted_6 = {
    key: 0,
    class: "mnr-chapter-separator"
  };
  const _hoisted_7 = { class: "mnr-separator-title" };
  const _hoisted_8 = ["data-chapter-url", "innerHTML"];
  const _hoisted_9 = {
    key: 1,
    class: "mnr-loading-next"
  };
  const _hoisted_10 = {
    key: 2,
    class: "mnr-chapter-end"
  };
  const _hoisted_11 = { class: "mnr-chapter-nav" };
  const _hoisted_12 = ["href"];
  const _hoisted_13 = { class: "mnr-rule-editor-container" };
  const _hoisted_14 = {
    key: 2,
    class: "mnr-loading-overlay"
  };
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "ReaderView",
    setup(__props) {
      const readerStore = useReaderStore();
      const configStore = useConfigStore();
      const ruleStore = useRuleStore();
      const mainRef = ref(null);
      const settingsVisible = ref(false);
      const ruleEditorVisible = ref(false);
      const isPickerActive = ref(false);
      const headerHidden = ref(false);
      watch(isPickerActive, (active) => {
        const hideStyle = document.getElementById("mnr-hide-original");
        const readerRoot = document.getElementById("mnr-reader-root");
        if (active) {
          if (hideStyle) {
            hideStyle.setAttribute("data-disabled", "true");
            hideStyle.textContent = "";
          }
          if (readerRoot) {
            readerRoot.style.display = "none";
          }
        } else {
          if (hideStyle && hideStyle.hasAttribute("data-disabled")) {
            hideStyle.removeAttribute("data-disabled");
            hideStyle.textContent = `
        body > *:not(#mnr-reader-root):not(#mnr-prompt-root):not(script):not(style) {
          display: none !important;
        }
      `;
          }
          if (readerRoot) {
            readerRoot.style.display = "";
          }
        }
      });
      let lastScrollY = 0;
      let loadDebounceTimer = null;
      const currentRule = computed(() => readerStore.rule);
      const currentDomain = computed(() => {
        try {
          return new URL(window.location.href).hostname;
        } catch {
          return "";
        }
      });
      const chapters = computed(() => readerStore.chapters);
      const currentTitle = computed(() => readerStore.title);
      const bookTitle = computed(() => readerStore.bookTitle);
      const indexUrl = computed(() => {
        var _a;
        return (_a = readerStore.chapter) == null ? void 0 : _a.indexUrl;
      });
      const isLoading = computed(() => readerStore.isLoading);
      const isLoadingPrev = computed(() => readerStore.isLoadingPrev);
      const isLoadingNext = computed(() => readerStore.isLoadingNext);
      const hasNext = computed(() => readerStore.hasNext);
      const hasPrev = computed(() => readerStore.hasPrev);
      const error = computed(() => readerStore.error);
      const showProgress = computed(() => configStore.behavior.showProgress);
      const autoHideHeader = computed(() => configStore.behavior.autoHideHeader);
      function navigate(direction) {
        if (indexUrl.value) {
          window.location.href = indexUrl.value;
        }
      }
      function handleBack() {
        if (indexUrl.value) {
          window.location.href = indexUrl.value;
        } else {
          window.history.back();
        }
      }
      function handleContentClick(e) {
        const target = e.target;
        if (target.tagName === "A") {
          const href = target.getAttribute("href");
          if (href && !href.startsWith("javascript:")) {
            return;
          }
          e.preventDefault();
        }
      }
      function clearError() {
        readerStore.clearError();
      }
      function openRuleEditor() {
        settingsVisible.value = false;
        ruleEditorVisible.value = true;
      }
      async function handleRuleSave(rule) {
        await ruleStore.saveRule(rule);
        ruleEditorVisible.value = false;
      }
      function openSettings() {
        settingsVisible.value = true;
      }
      async function handleTextConversionChange(mode) {
        await readerStore.applyTextConversion(mode);
      }
      function handleScroll() {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        const currentScrollY = mainEl.scrollTop;
        const scrollHeight = mainEl.scrollHeight - mainEl.clientHeight;
        if (autoHideHeader.value) {
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            headerHidden.value = true;
          } else {
            headerHidden.value = false;
          }
        }
        lastScrollY = currentScrollY;
        const chapterEls = mainEl.querySelectorAll(".mnr-reader-content");
        if (chapterEls.length === 0) return;
        let currentChapterEl = null;
        let currentChapterIdx = 0;
        const viewportTop = currentScrollY;
        const viewportBottom = currentScrollY + mainEl.clientHeight;
        for (let i = 0; i < chapterEls.length; i++) {
          const el = chapterEls[i];
          const elTop = el.offsetTop;
          const elBottom = elTop + el.offsetHeight;
          if (elTop <= viewportBottom && elBottom >= viewportTop) {
            currentChapterEl = el;
            currentChapterIdx = i;
            break;
          }
        }
        if (!currentChapterEl) return;
        readerStore.setCurrentChapter(currentChapterIdx);
        const chapterEl = currentChapterEl;
        const chapterTop = chapterEl.offsetTop;
        const chapterHeight = chapterEl.offsetHeight;
        const posInChapter = currentScrollY - chapterTop + mainEl.clientHeight;
        const chapterPercent = Math.round(posInChapter / chapterHeight * 100);
        const clampedPercent = Math.max(0, Math.min(100, chapterPercent));
        if (scrollHeight > 0) {
          const overallPercent = Math.round(currentScrollY / scrollHeight * 100);
          readerStore.updateScroll(overallPercent);
        }
        if (loadDebounceTimer) clearTimeout(loadDebounceTimer);
        const isLastChapter = currentChapterIdx === chapterEls.length - 1;
        if (isLastChapter && clampedPercent >= 70 && hasNext.value && !isLoadingNext.value) {
          loadDebounceTimer = setTimeout(() => {
            readerStore.loadNextChapter();
          }, 200);
        }
        const isFirstChapter = currentChapterIdx === 0;
        if (isFirstChapter && clampedPercent <= 30 && hasPrev.value && !isLoadingPrev.value) {
          loadDebounceTimer = setTimeout(async () => {
            const oldScrollHeight = mainEl.scrollHeight;
            const success = await readerStore.loadPrevChapter();
            if (success) {
              globalThis.requestAnimationFrame(() => {
                const newScrollHeight = mainEl.scrollHeight;
                const addedHeight = newScrollHeight - oldScrollHeight;
                mainEl.scrollTop = currentScrollY + addedHeight;
              });
            }
          }, 200);
        }
      }
      function handleWheel(e) {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        if (e.deltaY < 0 && mainEl.scrollTop <= 0 && hasPrev.value && !isLoadingPrev.value) {
          if (loadDebounceTimer) clearTimeout(loadDebounceTimer);
          loadDebounceTimer = setTimeout(async () => {
            const oldScrollHeight = mainEl.scrollHeight;
            const success = await readerStore.loadPrevChapter();
            if (success) {
              globalThis.requestAnimationFrame(() => {
                const newScrollHeight = mainEl.scrollHeight;
                const addedHeight = newScrollHeight - oldScrollHeight;
                mainEl.scrollTop = addedHeight;
              });
            }
          }, 200);
        }
      }
      function handleKeyDown(e) {
        if (isPickerActive.value) return;
        if (e.key === "Escape") {
          if (ruleEditorVisible.value) {
            ruleEditorVisible.value = false;
            e.preventDefault();
            return;
          }
          if (settingsVisible.value) {
            settingsVisible.value = false;
            e.preventDefault();
            return;
          }
          return;
        }
        if (!configStore.behavior.keyboardNavigation) return;
        const target = e.target;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
          return;
        }
        switch (e.key.toLowerCase()) {
          // 's' or ',' to toggle settings
          case "s":
          case ",":
            if (!ruleEditorVisible.value) {
              settingsVisible.value = !settingsVisible.value;
              e.preventDefault();
            }
            break;
          // 'e' to toggle rule editor
          case "e":
            if (!settingsVisible.value) {
              ruleEditorVisible.value = !ruleEditorVisible.value;
              e.preventDefault();
            }
            break;
          // 'q' to exit reader mode
          case "q":
            e.preventDefault();
            e.stopPropagation();
            exitReader();
            break;
          // Left arrow or 'p' - previous chapter
          case "arrowleft":
          case "p":
            e.preventDefault();
            e.stopPropagation();
            navigateChapter("prev");
            break;
          // Right arrow or 'n' - next chapter
          case "arrowright":
          case "n":
            e.preventDefault();
            e.stopPropagation();
            navigateChapter("next");
            break;
        }
      }
      async function navigateChapter(direction) {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        const currentIdx = readerStore.currentChapterIndex;
        const chaptersCount = readerStore.chapters.length;
        if (direction === "prev") {
          if (currentIdx > 0) {
            jumpToChapter(currentIdx - 1);
          } else if (hasPrev.value && !isLoadingPrev.value) {
            const success = await readerStore.loadPrevChapter();
            if (success) {
              globalThis.requestAnimationFrame(() => jumpToChapter(0));
            }
          }
        } else {
          if (currentIdx < chaptersCount - 1) {
            jumpToChapter(currentIdx + 1);
          } else if (hasNext.value && !isLoadingNext.value) {
            const success = await readerStore.loadNextChapter();
            if (success) {
              globalThis.requestAnimationFrame(() => jumpToChapter(readerStore.chapters.length - 1));
            }
          }
        }
      }
      function jumpToChapter(index) {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        const chapterEls = mainEl.querySelectorAll(".mnr-reader-content");
        if (index < 0 || index >= chapterEls.length) return;
        const targetEl = chapterEls[index];
        mainEl.scrollTo({
          top: targetEl.offsetTop,
          behavior: "smooth"
        });
        readerStore.setCurrentChapter(index);
      }
      function exitReader() {
        closeReader();
      }
      onMounted(async () => {
        configStore.applyAll();
        const textConversion = configStore.reading.textConversion;
        if (textConversion !== "none") {
          await readerStore.applyTextConversion(textConversion);
        }
        if (mainRef.value) {
          mainRef.value.addEventListener("scroll", handleScroll, { passive: true });
          mainRef.value.addEventListener("wheel", handleWheel, { passive: true });
        }
        window.addEventListener("keydown", handleKeyDown, true);
      });
      onUnmounted(() => {
        if (mainRef.value) {
          mainRef.value.removeEventListener("scroll", handleScroll);
          mainRef.value.removeEventListener("wheel", handleWheel);
        }
        window.removeEventListener("keydown", handleKeyDown, true);
        if (loadDebounceTimer) clearTimeout(loadDebounceTimer);
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1, [
          showProgress.value ? (openBlock(), createBlock(ProgressIndicator, {
            key: 0,
            "auto-hide": true
          })) : createCommentVNode("", true),
          createBaseVNode("header", {
            class: normalizeClass(["mnr-reader-header", { hidden: headerHidden.value }])
          }, [
            createBaseVNode("div", { class: "mnr-header-left" }, [
              createBaseVNode("button", {
                class: "mnr-header-btn",
                title: "返回",
                onClick: handleBack
              }, "←")
            ]),
            createBaseVNode("div", _hoisted_2, [
              createBaseVNode("h1", _hoisted_3, toDisplayString(currentTitle.value), 1),
              bookTitle.value ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(bookTitle.value), 1)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", { class: "mnr-header-right" }, [
              createBaseVNode("button", {
                class: "mnr-header-btn",
                title: "设置",
                onClick: openSettings
              }, "⚙")
            ])
          ], 2),
          createBaseVNode("main", {
            ref_key: "mainRef",
            ref: mainRef,
            class: "mnr-reader-main"
          }, [
            isLoadingPrev.value ? (openBlock(), createElementBlock("div", _hoisted_5, [..._cache[4] || (_cache[4] = [
              createBaseVNode("div", { class: "mnr-loading-spinner small" }, null, -1),
              createBaseVNode("span", null, "加载上一章...", -1)
            ])])) : createCommentVNode("", true),
            (openBlock(true), createElementBlock(Fragment, null, renderList(chapters.value, (entry) => {
              return openBlock(), createElementBlock(Fragment, {
                key: entry.id
              }, [
                chapters.value.indexOf(entry) > 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "mnr-separator-line" }, null, -1)),
                  createBaseVNode("span", _hoisted_7, toDisplayString(entry.chapter.title), 1),
                  _cache[6] || (_cache[6] = createBaseVNode("span", { class: "mnr-separator-line" }, null, -1))
                ])) : createCommentVNode("", true),
                createBaseVNode("article", {
                  class: "mnr-reader-content",
                  "data-chapter-url": entry.chapter.url,
                  onClick: handleContentClick,
                  innerHTML: entry.chapter.content
                }, null, 8, _hoisted_8)
              ], 64);
            }), 128)),
            isLoadingNext.value ? (openBlock(), createElementBlock("div", _hoisted_9, [..._cache[7] || (_cache[7] = [
              createBaseVNode("div", { class: "mnr-loading-spinner small" }, null, -1),
              createBaseVNode("span", null, "加载下一章...", -1)
            ])])) : createCommentVNode("", true),
            chapters.value.length > 0 && !hasNext.value && !isLoadingNext.value ? (openBlock(), createElementBlock("div", _hoisted_10, [
              _cache[8] || (_cache[8] = createBaseVNode("p", { class: "mnr-chapter-end-text" }, "— 已是最后一章 —", -1)),
              createBaseVNode("div", _hoisted_11, [
                indexUrl.value ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  href: indexUrl.value,
                  class: "mnr-chapter-link index",
                  onClick: _cache[0] || (_cache[0] = withModifiers(($event) => navigate(), ["prevent"]))
                }, " 返回目录 ", 8, _hoisted_12)) : createCommentVNode("", true)
              ])
            ])) : createCommentVNode("", true)
          ], 512),
          createVNode(_sfc_main$4, {
            visible: settingsVisible.value,
            onClose: _cache[1] || (_cache[1] = ($event) => settingsVisible.value = false),
            onEditRule: openRuleEditor,
            onTextConversionChange: handleTextConversionChange
          }, null, 8, ["visible"]),
          ruleEditorVisible.value ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["mnr-rule-editor-overlay", { "mnr-overlay-hidden": isPickerActive.value }])
          }, [
            createBaseVNode("div", _hoisted_13, [
              createVNode(RuleEditorPanel, {
                rule: currentRule.value,
                domain: currentDomain.value,
                onSave: handleRuleSave,
                onCancel: _cache[2] || (_cache[2] = ($event) => ruleEditorVisible.value = false),
                onPickerStateChange: _cache[3] || (_cache[3] = ($event) => isPickerActive.value = $event)
              }, null, 8, ["rule", "domain"])
            ])
          ], 2)) : createCommentVNode("", true),
          isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_14, [..._cache[9] || (_cache[9] = [
            createBaseVNode("div", { class: "mnr-loading-spinner" }, null, -1),
            createBaseVNode("span", null, "加载中...", -1)
          ])])) : createCommentVNode("", true),
          error.value ? (openBlock(), createElementBlock("div", {
            key: 3,
            class: "mnr-error-toast",
            onClick: clearError
          }, toDisplayString(error.value), 1)) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const ReaderView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a7eac65f"]]);
  const appState = {
    isInitialized: false,
    isActive: false,
    currentDecision: null
  };
  let app = null;
  let pinia = null;
  async function initialize() {
    if (appState.isInitialized) {
      return;
    }
    console.log(`[MNR] MyNovelReader v${VERSION} (${BUILD_DATE})`);
    try {
      pinia = createPinia();
      const configStore = useConfigStore(pinia);
      const ruleStore = useRuleStore(pinia);
      await Promise.all([configStore.load(), ruleStore.initialize()]);
      appState.isInitialized = true;
      await runAutoEnable();
    } catch (e) {
      console.error("[MNR] Initialization error:", e);
    }
  }
  async function runAutoEnable() {
    const manager = getAutoEnableManager({
      enableProtection: true
    });
    manager.setPromptCallback(showPrompt);
    manager.setLaunchCallback(launchReader);
    await manager.execute(document);
  }
  async function showPrompt(decision) {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      container.id = "mnr-prompt-root";
      document.body.appendChild(container);
      const showPrompt2 = ref(true);
      const PromptWrapper = /* @__PURE__ */ defineComponent({
        setup() {
          const handleRespond = (response) => {
            showPrompt2.value = false;
            setTimeout(() => {
              container.remove();
              resolve(response);
            }, 300);
          };
          const handleDismiss = () => {
            showPrompt2.value = false;
            setTimeout(() => {
              container.remove();
              resolve({ accepted: false, saveForDomain: false });
            }, 300);
          };
          return () => h(DetectionPrompt, {
            decision,
            visible: showPrompt2.value,
            onRespond: handleRespond,
            onDismiss: handleDismiss
          });
        }
      });
      const promptApp = createApp(PromptWrapper);
      promptApp.mount(container);
    });
  }
  function launchReader(chapter, rule) {
    if (!pinia) {
      console.error("[MNR] Pinia not initialized");
      return;
    }
    const readerStore = useReaderStore(pinia);
    readerStore.activate();
    readerStore.setChapter(chapter, rule);
    appState.isActive = true;
    mountReaderUI();
  }
  function mountReaderUI() {
    if (document.getElementById("mnr-reader-root")) {
      return;
    }
    const container = document.createElement("div");
    container.id = "mnr-reader-root";
    document.body.appendChild(container);
    app = createApp(ReaderView);
    app.use(pinia);
    app.mount(container);
    hideOriginalContent();
  }
  function hideOriginalContent() {
    const style = document.createElement("style");
    style.id = "mnr-hide-original";
    style.textContent = `
    body > *:not(#mnr-reader-root):not(#mnr-prompt-root):not(script):not(style) {
      display: none !important;
    }
  `;
    document.head.appendChild(style);
  }
  function closeReader() {
    if (!appState.isActive) return;
    if (app) {
      app.unmount();
      app = null;
    }
    const container = document.getElementById("mnr-reader-root");
    if (container) {
      container.remove();
    }
    const hideStyle = document.getElementById("mnr-hide-original");
    if (hideStyle) {
      hideStyle.remove();
    }
    if (pinia) {
      const readerStore = useReaderStore(pinia);
      readerStore.deactivate();
    }
    appState.isActive = false;
    showFloatingButton();
  }
  function showFloatingButton() {
    hideFloatingButton();
    const button = document.createElement("button");
    button.id = "mnr-floating-btn";
    button.innerHTML = "📖";
    button.title = "进入阅读模式";
    button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #4a90d9;
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s, background 0.2s;
  `;
    button.onmouseover = () => {
      button.style.transform = "scale(1.1)";
      button.style.background = "#357abd";
    };
    button.onmouseout = () => {
      button.style.transform = "scale(1)";
      button.style.background = "#4a90d9";
    };
    button.onclick = async () => {
      hideFloatingButton();
      await manualEnable();
    };
    document.body.appendChild(button);
  }
  function hideFloatingButton() {
    const btn = document.getElementById("mnr-floating-btn");
    if (btn) {
      btn.remove();
    }
  }
  async function manualEnable() {
    const manager = getAutoEnableManager();
    manager.setLaunchCallback(launchReader);
    await manager.manualEnable(document);
  }
  function isActive() {
    return appState.isActive;
  }
  function getVersion() {
    return { version: VERSION, buildDate: BUILD_DATE };
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
  exports.AutoEnableManager = AutoEnableManager;
  exports.BUILD_DATE = BUILD_DATE;
  exports.ConfidenceScorer = ConfidenceScorer;
  exports.ContentDetector = ContentDetector;
  exports.ContentProcessor = ContentProcessor;
  exports.DetectionEngine = DetectionEngine;
  exports.NavigationDetector = NavigationDetector;
  exports.Parser = Parser;
  exports.RuleStorage = RuleStorage;
  exports.SiteProtection = SiteProtection;
  exports.THEMES = THEMES;
  exports.TitleDetector = TitleDetector;
  exports.VERSION = VERSION;
  exports.closeReader = closeReader;
  exports.getAutoEnableManager = getAutoEnableManager;
  exports.getParser = getParser;
  exports.getRuleManager = getRuleManager;
  exports.getSiteProtection = getSiteProtection;
  exports.getVersion = getVersion;
  exports.initialize = initialize;
  exports.isActive = isActive;
  exports.manualEnable = manualEnable;
  exports.useConfigStore = useConfigStore;
  exports.useReaderStore = useReaderStore;
  exports.useRuleStore = useRuleStore;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
})({});
