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
  (function(cssCode) {
    try {
      if (typeof window !== "undefined") {
        window.__MNR_STYLES__ = (window.__MNR_STYLES__ || "") + cssCode;
        var styleId = "mnr-global-styles";
        var existingStyle = document.getElementById(styleId);
        if (!existingStyle) {
          existingStyle = document.createElement("style");
          existingStyle.id = styleId;
          document.head.appendChild(existingStyle);
        }
        existingStyle.textContent = window.__MNR_STYLES__;
        if (window.__MNR_SHADOW_ROOT__) {
          var shadowStyle = window.__MNR_SHADOW_ROOT__.querySelector("#mnr-app-styles");
          if (!shadowStyle) {
            shadowStyle = document.createElement("style");
            shadowStyle.id = "mnr-app-styles";
            window.__MNR_SHADOW_ROOT__.appendChild(shadowStyle);
          }
          shadowStyle.textContent = window.__MNR_STYLES__;
        }
      }
    } catch (e) {
      console.error("[MNR] CSS injection error:", e);
    }
  })(".mnr-prompt-overlay[data-v-91cf13cd]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px}.mnr-prompt-card[data-v-91cf13cd]{background:#fff;border-radius:12px;box-shadow:0 4px 24px #00000026;max-width:360px;width:100%;padding:20px;animation:mnr-slide-up-91cf13cd .3s ease-out}@keyframes mnr-slide-up-91cf13cd{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.mnr-prompt-header[data-v-91cf13cd]{display:flex;align-items:center;gap:12px;margin-bottom:16px}.mnr-prompt-icon[data-v-91cf13cd]{font-size:28px}.mnr-prompt-title[data-v-91cf13cd]{margin:0;font-size:18px;font-weight:600;color:#333}.mnr-confidence[data-v-91cf13cd]{margin-bottom:16px}.mnr-confidence-bar[data-v-91cf13cd]{height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-bottom:6px}.mnr-confidence-fill[data-v-91cf13cd]{height:100%;border-radius:3px;transition:width .3s ease}.mnr-confidence-fill.high[data-v-91cf13cd]{background:#4caf50}.mnr-confidence-fill.medium[data-v-91cf13cd]{background:#ff9800}.mnr-confidence-fill.low[data-v-91cf13cd]{background:#f44336}.mnr-confidence-text[data-v-91cf13cd]{font-size:13px;color:#666}.mnr-results[data-v-91cf13cd]{list-style:none;padding:0;margin:0 0 16px}.mnr-result-item[data-v-91cf13cd]{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:14px}.mnr-result-item.success[data-v-91cf13cd]{color:#2e7d32}.mnr-result-item.warning[data-v-91cf13cd]{color:#ed6c02}.mnr-result-icon[data-v-91cf13cd]{font-weight:700}.mnr-checkbox-label[data-v-91cf13cd]{display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 0;font-size:14px;color:#555;border-top:1px solid #eee;margin-bottom:16px}.mnr-checkbox[data-v-91cf13cd]{width:18px;height:18px;cursor:pointer;accent-color:#1976d2}.mnr-prompt-actions[data-v-91cf13cd]{display:flex;gap:12px}.mnr-btn[data-v-91cf13cd]{flex:1;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all .2s ease}.mnr-btn-secondary[data-v-91cf13cd]{background:#f5f5f5;color:#666}.mnr-btn-secondary[data-v-91cf13cd]:hover{background:#e0e0e0}.mnr-btn-primary[data-v-91cf13cd]{background:#1976d2;color:#fff}.mnr-btn-primary[data-v-91cf13cd]:hover{background:#1565c0}.mnr-fade-enter-active[data-v-91cf13cd],.mnr-fade-leave-active[data-v-91cf13cd]{transition:opacity .3s ease}.mnr-fade-enter-from[data-v-91cf13cd],.mnr-fade-leave-to[data-v-91cf13cd]{opacity:0}@media(prefers-color-scheme:dark){.mnr-prompt-card[data-v-91cf13cd]{background:#2a2a2a}.mnr-prompt-title[data-v-91cf13cd]{color:#e0e0e0}.mnr-confidence-bar[data-v-91cf13cd]{background:#444}.mnr-confidence-text[data-v-91cf13cd]{color:#aaa}.mnr-checkbox-label[data-v-91cf13cd]{color:#bbb;border-top-color:#444}.mnr-btn-secondary[data-v-91cf13cd]{background:#3a3a3a;color:#ccc}.mnr-btn-secondary[data-v-91cf13cd]:hover{background:#4a4a4a}}@media(max-width:480px){.mnr-prompt-card[data-v-91cf13cd]{padding:16px;margin:8px}.mnr-prompt-title[data-v-91cf13cd]{font-size:16px}.mnr-btn[data-v-91cf13cd]{padding:12px 16px}}.mnr-progress[data-v-bc314d2a]{position:fixed;top:0;left:0;right:0;height:3px;z-index:1000;transition:opacity .3s ease}.mnr-progress.hidden[data-v-bc314d2a]{opacity:0}.mnr-progress-bar[data-v-bc314d2a]{height:100%;background:linear-gradient(90deg,#1976d2,#42a5f5);transition:width .1s ease-out}.mnr-progress-text[data-v-bc314d2a]{position:absolute;right:8px;top:8px;background:#000000b3;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.mnr-floating-toolbar[data-v-63e5b047]{position:fixed;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;pointer-events:none;z-index:100}.mnr-fab[data-v-63e5b047]{pointer-events:auto;width:44px;height:44px;border-radius:50%;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);border:1px solid var(--mnr-border, #e5e5e5);box-shadow:0 4px 12px #00000026;cursor:pointer;position:relative;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s cubic-bezier(.25,.8,.25,1);-webkit-tap-highlight-color:transparent}.mnr-fab[data-v-63e5b047]:hover{background:var(--mnr-border, #f0f0f0);transform:translateY(-2px);box-shadow:0 6px 16px #0003}.mnr-fab[data-v-63e5b047]:active{transform:scale(.95)}.mnr-fab[data-v-63e5b047]:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}.mnr-fab-group[data-v-63e5b047]{display:flex;gap:12px}.mnr-fab-badge[data-v-63e5b047]{position:absolute;top:-4px;right:-4px;background:var(--mnr-link, #1976d2);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;line-height:1;box-shadow:0 2px 4px #0003}.mnr-icon[data-v-63e5b047]{line-height:1;display:block}.mnr-fade-slide-enter-active[data-v-63e5b047],.mnr-fade-slide-leave-active[data-v-63e5b047]{transition:opacity .3s ease,transform .3s ease}.mnr-fade-slide-enter-from[data-v-63e5b047],.mnr-fade-slide-leave-to[data-v-63e5b047]{opacity:0;transform:translateY(-20px)}.mnr-drawer[data-v-6d373c76]{position:fixed;top:0;left:0;bottom:0;width:85%;max-width:320px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);transform:translate(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);z-index:1001;display:flex;flex-direction:column;box-shadow:4px 0 20px #00000026}.mnr-drawer.open[data-v-6d373c76]{transform:translate(0)}.mnr-drawer-overlay[data-v-6d373c76]{position:fixed;top:0;right:0;bottom:0;left:0;background:#00000080;z-index:1000}.mnr-fade-enter-active[data-v-6d373c76],.mnr-fade-leave-active[data-v-6d373c76]{transition:opacity .3s ease}.mnr-fade-enter-from[data-v-6d373c76],.mnr-fade-leave-to[data-v-6d373c76]{opacity:0}.mnr-drawer-header[data-v-6d373c76]{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid var(--mnr-border, #e5e5e5);flex-shrink:0}.mnr-drawer-title[data-v-6d373c76]{margin:0;font-size:16px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mnr-drawer-close[data-v-6d373c76]{width:32px;height:32px;border:none;background:transparent;color:var(--mnr-text, #333);font-size:18px;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center}.mnr-drawer-close[data-v-6d373c76]:hover{background:var(--mnr-border, #e5e5e5)}.mnr-drawer-content[data-v-6d373c76]{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}.mnr-drawer-loading[data-v-6d373c76]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px 20px;color:var(--mnr-text, #666)}.mnr-loading-spinner.small[data-v-6d373c76]{width:24px;height:24px;border:2px solid var(--mnr-border, #e0e0e0);border-top-color:var(--mnr-link, #1976d2);border-radius:50%;animation:mnr-spin-6d373c76 1s linear infinite}@keyframes mnr-spin-6d373c76{to{transform:rotate(360deg)}}.mnr-drawer-empty[data-v-6d373c76]{padding:40px 20px;text-align:center;color:var(--mnr-text, #666);opacity:.7}.mnr-cache-progress-bar[data-v-6d373c76]{position:sticky;top:0;background:var(--mnr-bg, #fff);padding:12px 16px;border-bottom:1px solid var(--mnr-border, #e5e5e5);z-index:1}.mnr-cache-progress-text[data-v-6d373c76]{font-size:12px;color:var(--mnr-link, #1976d2);margin-bottom:6px}.mnr-cache-progress-track[data-v-6d373c76]{height:4px;background:var(--mnr-border, #e0e0e0);border-radius:2px;overflow:hidden}.mnr-cache-progress-fill[data-v-6d373c76]{height:100%;background:var(--mnr-link, #1976d2);border-radius:2px;transition:width .3s ease}.mnr-cache-stats[data-v-6d373c76]{padding:8px 16px;font-size:12px;border-bottom:1px solid var(--mnr-border, #e5e5e5);display:flex;gap:12px}.mnr-stat-persisted[data-v-6d373c76]{color:#4caf50}.mnr-stat-session[data-v-6d373c76]{color:#9e9e9e}.mnr-chapter-list[data-v-6d373c76]{list-style:none;margin:0;padding:8px 0}.mnr-chapter-list li[data-v-6d373c76]{padding:12px 16px;cursor:pointer;border-left:3px solid transparent;font-size:14px;line-height:1.4;transition:all .15s ease;scroll-margin-block:24px;display:flex;align-items:flex-start;gap:4px}.mnr-chapter-list li[data-v-6d373c76]:hover{background:var(--mnr-border, #f0f0f0)}.mnr-chapter-list li.active[data-v-6d373c76]{background:#1976d21a;border-left-color:var(--mnr-link, #1976d2);font-weight:500;color:var(--mnr-link, #1976d2)}.mnr-chapter-list li.cached[data-v-6d373c76]{color:#9e9e9e}.mnr-chapter-list li.persisted[data-v-6d373c76]{color:#4caf50}.mnr-cached-icon[data-v-6d373c76]{color:#9e9e9e;font-size:12px;flex-shrink:0;margin-top:2px}.mnr-persisted-icon[data-v-6d373c76]{color:#4caf50;font-size:12px;flex-shrink:0;margin-top:2px}@media(min-width:1024px){.mnr-drawer[data-v-6d373c76]{max-width:320px;width:320px}}.mnr-settings-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;z-index:1000;display:flex;justify-content:flex-end}.mnr-settings-panel{width:100%;max-width:360px;height:100%;background:var(--mnr-bg, #fff);display:flex;flex-direction:column;box-shadow:-4px 0 20px #00000026}.mnr-settings-header{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-settings-header h3{margin:0;font-size:18px;color:var(--mnr-text, #333)}.mnr-shortcut-hint{margin-left:auto;margin-right:12px;padding:2px 8px;background:var(--mnr-border, #e0e0e0);border-radius:4px;font-size:12px;font-family:monospace;color:var(--mnr-text, #666)}.mnr-close-btn{background:none;border:none;font-size:20px;cursor:pointer;padding:4px 8px;color:var(--mnr-text, #666)}.mnr-settings-content{flex:1;overflow:auto;padding:16px}.mnr-settings-section{margin-bottom:24px}.mnr-settings-section h4{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--mnr-text, #555)}.mnr-theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mnr-theme-btn{padding:12px 8px;border:2px solid transparent;border-radius:8px;cursor:pointer;font-size:13px;transition:all .2s ease}.mnr-theme-btn.active{border-color:#1976d2}.mnr-slider-row{display:flex;align-items:center;gap:12px}.mnr-slider-label{width:24px;text-align:center;color:var(--mnr-text, #666)}.mnr-slider{flex:1;height:4px;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--mnr-border, #e0e0e0);border-radius:2px}.mnr-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#1976d2;border-radius:50%;cursor:pointer}.mnr-slider-value{width:50px;text-align:right;font-size:13px;color:var(--mnr-text, #666)}.mnr-select{width:100%;padding:10px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);font-size:14px}.mnr-segmented-control{display:flex;border:1px solid var(--mnr-border, #ddd);border-radius:8px;overflow:hidden}.mnr-segment{flex:1;padding:10px 16px;border:none;background:var(--mnr-bg, #fff);color:var(--mnr-text, #666);font-size:14px;cursor:pointer;transition:all .2s ease}.mnr-segment:not(:last-child){border-right:1px solid var(--mnr-border, #ddd)}.mnr-segment:hover{background:var(--mnr-border, #f0f0f0)}.mnr-segment.active{background:#1976d2;color:#fff}.mnr-hint{margin-top:8px;font-size:12px;color:var(--mnr-text, #888);opacity:.8}.mnr-switch-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer;color:var(--mnr-text, #333)}.mnr-switch-row input{width:40px;height:22px;accent-color:#1976d2}.mnr-action-buttons{display:flex;flex-direction:column;gap:8px}.mnr-rule-row{display:flex;gap:8px}.mnr-rule-row .mnr-action-btn{flex:1}.mnr-cache-row{display:flex;gap:8px}.mnr-cache-row .mnr-action-btn{flex:1}.mnr-action-btn{width:100%;padding:12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);font-size:14px;cursor:pointer}.mnr-action-btn:hover{background:var(--mnr-border, #f5f5f5)}.mnr-action-btn--danger{background:#dc3545;color:#fff;border-color:#dc3545}.mnr-action-btn--danger:hover{background:#c82333;border-color:#c82333}.mnr-cache-count{margin-left:4px;opacity:.8}.mnr-slide-enter-active,.mnr-slide-leave-active{transition:all .3s ease}.mnr-slide-enter-from,.mnr-slide-leave-to{opacity:0}.mnr-slide-enter-from .mnr-settings-panel,.mnr-slide-leave-to .mnr-settings-panel{transform:translate(100%)}@media(max-width:480px){.mnr-settings-panel{max-width:100%}.mnr-theme-grid{grid-template-columns:repeat(2,1fr)}}.mnr-picker-overlay[data-v-6493a95a]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;pointer-events:none}.mnr-picker-highlight[data-v-6493a95a]{position:fixed;border:2px solid #1976d2;background:#1976d21a;pointer-events:none;transition:all .05s ease;box-sizing:border-box;z-index:999999}.mnr-picker-tooltip[data-v-6493a95a]{position:fixed;background:#333;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;font-family:monospace;max-width:400px;pointer-events:none;z-index:1000000;box-shadow:0 2px 8px #0000004d}.mnr-picker-tag[data-v-6493a95a]{color:#90caf9;margin-bottom:4px}.mnr-picker-selector[data-v-6493a95a]{color:#a5d6a7;word-break:break-all}.mnr-picker-controls[data-v-6493a95a]{position:fixed;bottom:20px;left:50%;transform:translate(-50%);background:#1976d2;color:#fff;padding:12px 20px;border-radius:8px;display:flex;align-items:center;gap:16px;font-size:14px;pointer-events:auto;box-shadow:0 4px 12px #0000004d}.mnr-picker-label[data-v-6493a95a]{font-weight:600}.mnr-picker-hint[data-v-6493a95a]{opacity:.8;font-size:12px}.mnr-picker-cancel[data-v-6493a95a]{background:#fff3;border:none;color:#fff;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px}.mnr-picker-cancel[data-v-6493a95a]:hover{background:#ffffff4d}@media(max-width:480px){.mnr-picker-controls[data-v-6493a95a]{left:10px;right:10px;transform:none;flex-wrap:wrap;justify-content:center}}.mnr-selector-preview[data-v-31cda065]{background:var(--mnr-border, #f8f9fa);border-radius:8px;padding:12px;margin-bottom:12px}.mnr-preview-header[data-v-31cda065]{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.mnr-preview-label[data-v-31cda065]{font-size:13px;font-weight:600;color:var(--mnr-text, #555)}.mnr-preview-actions[data-v-31cda065]{display:flex;gap:4px}.mnr-preview-btn[data-v-31cda065]{background:none;border:1px solid var(--mnr-border, #ddd);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;color:var(--mnr-text, #666)}.mnr-preview-btn[data-v-31cda065]:hover:not(:disabled){opacity:.8}.mnr-preview-btn[data-v-31cda065]:disabled{opacity:.5;cursor:not-allowed}.mnr-preview-btn.mnr-btn-active[data-v-31cda065]{background:var(--mnr-link, #1976d2);color:#fff;border-color:var(--mnr-link, #1976d2)}.mnr-preview-input-row[data-v-31cda065]{margin-bottom:8px}.mnr-preview-input[data-v-31cda065]{width:100%;padding:8px 10px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-size:13px;font-family:monospace;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-preview-input[data-v-31cda065]:focus{outline:none;border-color:var(--mnr-link, #1976d2)}.mnr-preview-selector[data-v-31cda065]{font-family:monospace;font-size:13px;color:var(--mnr-text, #666)}.mnr-preview-match[data-v-31cda065]{font-size:12px;padding:6px 10px;border-radius:4px;margin-bottom:8px}.mnr-preview-match.success[data-v-31cda065]{background:#e8f5e9;color:#2e7d32}.mnr-preview-match.warning[data-v-31cda065]{background:#fff3e0;color:#e65100}.mnr-preview-match.error[data-v-31cda065]{background:#ffebee;color:#c62828}.mnr-preview-content[data-v-31cda065]{border-top:1px solid var(--mnr-border, #e0e0e0);padding-top:8px}.mnr-preview-content-header[data-v-31cda065]{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mnr-text, #666);margin-bottom:6px}.mnr-preview-expand[data-v-31cda065]{background:none;border:none;color:var(--mnr-link, #1976d2);cursor:pointer;font-size:12px}.mnr-preview-text[data-v-31cda065]{font-size:12px;line-height:1.5;color:var(--mnr-text, #444);max-height:80px;overflow:hidden;background:var(--mnr-bg, #fff);padding:8px;border-radius:4px;border:1px solid var(--mnr-border, #e0e0e0)}.mnr-preview-text.expanded[data-v-31cda065]{max-height:300px;overflow:auto}.mnr-highlight-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999998}.mnr-highlight-box{border:3px solid #4caf50;background:#4caf5026;box-sizing:border-box;transition:all .15s ease}.mnr-highlight-label{position:absolute;top:-24px;left:0;background:#4caf50;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:4px 4px 0 0;font-family:sans-serif}.mnr-rule-editor[data-v-15d78857]{display:flex;flex-direction:column;height:100%;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);transition:opacity .2s ease,transform .2s ease}.mnr-rule-editor.mnr-editor-hidden[data-v-15d78857]{opacity:0;pointer-events:none;transform:translate(-100%)}.mnr-editor-header[data-v-15d78857]{position:relative;padding:16px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-editor-title[data-v-15d78857]{margin:0 0 12px;font-size:18px;font-weight:600;color:var(--mnr-text, #333)}.mnr-shortcut-hint[data-v-15d78857]{position:absolute;top:16px;right:16px;padding:2px 8px;background:var(--mnr-border, #e0e0e0);border-radius:4px;font-size:12px;font-family:monospace;color:var(--mnr-text, #666)}.mnr-editor-tabs[data-v-15d78857]{display:flex;gap:4px}.mnr-tab-btn[data-v-15d78857]{padding:8px 16px;background:var(--mnr-border, #f5f5f5);border:none;border-radius:6px;cursor:pointer;font-size:14px;color:var(--mnr-text, #666)}.mnr-tab-btn.active[data-v-15d78857]{background:var(--mnr-link, #1976d2);color:#fff}.mnr-editor-content[data-v-15d78857]{flex:1;overflow:auto;padding:16px}.mnr-form-section[data-v-15d78857]{margin-bottom:24px}.mnr-section-title[data-v-15d78857]{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--mnr-text, #333);padding-bottom:8px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-form-group[data-v-15d78857]{margin-bottom:16px}.mnr-form-group label[data-v-15d78857]{display:block;margin-bottom:6px;font-size:13px;font-weight:500;color:var(--mnr-text, #555)}.mnr-form-group input[data-v-15d78857],.mnr-form-group textarea[data-v-15d78857]{width:100%;padding:10px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-size:14px;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-form-group input[data-v-15d78857]:focus,.mnr-form-group textarea[data-v-15d78857]:focus{outline:none;border-color:var(--mnr-link, #1976d2)}.mnr-hint[data-v-15d78857]{display:block;margin-top:4px;font-size:12px;color:var(--mnr-text, #888);opacity:.7}.mnr-checkbox-row[data-v-15d78857]{display:flex;align-items:center;gap:8px;padding:8px 0;cursor:pointer}.mnr-checkbox-row input[data-v-15d78857]{width:18px;height:18px}.mnr-code-toolbar[data-v-15d78857]{display:flex;gap:8px;margin-bottom:8px}.mnr-format-select[data-v-15d78857]{padding:6px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:4px;font-size:13px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-toolbar-btn[data-v-15d78857]{padding:6px 12px;background:var(--mnr-border, #f5f5f5);border:1px solid var(--mnr-border, #ddd);border-radius:4px;cursor:pointer;font-size:13px;color:var(--mnr-text, #333)}.mnr-toolbar-btn[data-v-15d78857]:hover{opacity:.8}.mnr-code-editor[data-v-15d78857]{width:100%;min-height:400px;padding:12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-family:Fira Code,Monaco,monospace;font-size:13px;line-height:1.5;resize:vertical;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-code-error[data-v-15d78857]{margin-top:8px;padding:8px 12px;background:#ffebee;color:#c62828;border-radius:4px;font-size:13px}.mnr-hook-editor[data-v-15d78857],.mnr-css-editor[data-v-15d78857]{min-height:100px;font-family:Fira Code,Monaco,monospace;font-size:13px;line-height:1.5}.mnr-editor-footer[data-v-15d78857]{display:flex;justify-content:flex-end;gap:12px;padding:16px;border-top:1px solid var(--mnr-border, #e0e0e0)}.mnr-btn[data-v-15d78857]{padding:10px 20px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;border:none}.mnr-btn-secondary[data-v-15d78857]{background:var(--mnr-border, #f5f5f5);color:var(--mnr-text, #666)}.mnr-btn-primary[data-v-15d78857]{background:var(--mnr-link, #1976d2);color:#fff}.mnr-btn-primary[data-v-15d78857]:disabled{opacity:.5;cursor:not-allowed}.mnr-reader[data-v-77ee432d]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:var(--mnr-bg, #ffffff);color:var(--mnr-text, #1a1a1a);overflow:hidden;display:flex;flex-direction:column}.mnr-reader-main[data-v-77ee432d]{flex:1;overflow:auto;padding-top:68px;padding-bottom:40px;overscroll-behavior:contain}.mnr-reader-content[data-v-77ee432d]{max-width:var(--mnr-max-width, 800px);margin:0 auto;padding:var(--mnr-padding, 20px);font-family:var(--mnr-font-family, system-ui);font-size:var(--mnr-font-size, 18px);line-height:var(--mnr-line-height, 1.8);letter-spacing:var(--mnr-letter-spacing, .05em)}.mnr-reader-content[data-v-77ee432d] p{text-indent:var(--mnr-paragraph-indent, 2em);margin:0 0 1em}.mnr-reader-content[data-v-77ee432d] img{max-width:100%;height:auto;display:block;margin:1em auto}.mnr-reader-content[data-v-77ee432d] a{color:var(--mnr-link, #1976d2)}.mnr-chapter-title[data-v-77ee432d]{font-size:1.5em;font-weight:700;margin:0 0 1em;color:var(--mnr-text, #1a1a1a);line-height:1.4;text-align:center}.mnr-chapter-end[data-v-77ee432d]{max-width:var(--mnr-max-width, 800px);margin:0 auto;padding:40px 20px;text-align:center}.mnr-chapter-end-text[data-v-77ee432d]{color:var(--mnr-text, #666);opacity:.7;margin-bottom:16px}.mnr-chapter-nav[data-v-77ee432d]{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}.mnr-chapter-link[data-v-77ee432d]{padding:12px 24px;color:var(--mnr-link, #1976d2);text-decoration:none;border:1px solid var(--mnr-border, #e0e0e0);border-radius:8px;transition:all .2s ease}.mnr-chapter-link[data-v-77ee432d]:hover{background:var(--mnr-border, #f0f0f0)}.mnr-sentinel[data-v-77ee432d]{height:1px;width:100%;visibility:hidden}.mnr-loading-prev[data-v-77ee432d],.mnr-loading-next[data-v-77ee432d]{display:flex;align-items:center;justify-content:center;gap:12px;padding:24px;color:var(--mnr-text, #666)}.mnr-loading-spinner.small[data-v-77ee432d]{width:24px;height:24px;border:2px solid var(--mnr-border, #e0e0e0);border-top-color:var(--mnr-link, #1976d2);border-radius:50%;animation:mnr-spin-77ee432d 1s linear infinite}.mnr-loading-overlay[data-v-77ee432d]{position:fixed;top:0;left:0;right:0;bottom:0;background:#fffc;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#333;z-index:1000;transition:opacity .3s ease}@media(prefers-color-scheme:dark){.mnr-loading-overlay[data-v-77ee432d]{background:#0009;color:#fff}}.mnr-loading-spinner[data-v-77ee432d]{width:48px;height:48px;border:4px solid rgba(25,118,210,.2);border-top-color:#1976d2;border-radius:50%;animation:mnr-spin-77ee432d .8s cubic-bezier(.4,0,.2,1) infinite}@keyframes mnr-spin-77ee432d{to{transform:rotate(360deg)}}.mnr-toast[data-v-77ee432d]{position:fixed;bottom:32px;left:50%;transform:translate(-50%);background:#1e1e1ee6;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;padding:14px 28px;border-radius:50px;font-size:15px;font-weight:500;cursor:pointer;z-index:1001;box-shadow:0 8px 24px #0003;display:flex;align-items:center;gap:8px;max-width:90vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mnr-toast--error[data-v-77ee432d]{background:#d32f2ff2}.mnr-toast-enter-active[data-v-77ee432d],.mnr-toast-leave-active[data-v-77ee432d]{transition:all .4s cubic-bezier(.175,.885,.32,1.275)}.mnr-toast-enter-from[data-v-77ee432d],.mnr-toast-leave-to[data-v-77ee432d]{opacity:0;transform:translate(-50%) translateY(40px) scale(.9)}@media(min-width:768px){.mnr-reader-content[data-v-77ee432d]{padding:30px}}@media(min-width:1024px){.mnr-reader-content[data-v-77ee432d]{padding:40px}}.mnr-rule-editor-overlay[data-v-77ee432d]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;transition:opacity .2s ease,visibility .2s ease}.mnr-rule-editor-overlay.mnr-overlay-hidden[data-v-77ee432d]{opacity:0;visibility:hidden;pointer-events:none}.mnr-rule-editor-container[data-v-77ee432d]{background:var(--mnr-bg, #fff);border-radius:8px;max-width:800px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 4px 20px #0000004d}");
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
    ".chapter-box",
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
  function cssEscape(str) {
    if (typeof CSS !== "undefined" && CSS.escape) {
      return CSS.escape(str);
    }
    return str.replace(/([!"#$%&'()*+,.:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  }
  function normalizeAbsoluteUrl(url, base) {
    try {
      return new URL(url, base || window.location.href).toString();
    } catch {
      return url;
    }
  }
  function joinHtml(a, b) {
    const left = (a || "").trim();
    const right = (b || "").trim();
    if (!left) return right;
    if (!right) return left;
    return `${left}<p></p>${right}`;
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
        return `#${cssEscape(element.id)}`;
      }
      const classes = Array.from(element.classList);
      for (const cls of classes) {
        try {
          if (document.querySelectorAll(`.${cssEscape(cls)}`).length === 1) {
            return `.${cssEscape(cls)}`;
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
          segment = `#${cssEscape(current.id)}`;
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
  const AD_PATTERNS = [
    // Section/page navigation hints (分页提示) - use [（(] and [）)] to match both full-width and half-width
    /[（(]本章未完[，,]?请?点击下一页继续阅读[）)]/gi,
    /本章未完[，,]?请?点击下一页继续.*/gi,
    /请点击下一页继续阅读/gi,
    /点击下一页继续阅读/gi,
    // Page number indicators (页码指示) - match both full-width and half-width parentheses
    /[（(]第\d+[/／]\d+页[）)]/gi,
    /第\d+[/／]\d+页/gi,
    // Standalone orphan parentheses left after cleaning (孤立括号清理)
    /[（(]\s*[）)]/g,
    // Empty parentheses
    /[（(]\s*$/gm,
    // Orphan opening parenthesis at end of line
    /^\s*[）)]/gm,
    // Orphan closing parenthesis at start of line
    // Common site ads
    /手机用户请到.*阅读/gi,
    /请记住本书.*网址/gi,
    /百度搜索.*最新章节/gi,
    /一秒记住.*为您提供/gi,
    /天才一秒记住/gi,
    /笔趣阁.*www\.[a-z]+\.(com|net|org)/gi,
    /https?:\/\/[^\s<>"]+/gi,
    /www\.[a-z0-9]+\.(com|net|org|cc)/gi
  ];
  const INVALID_URL_PATTERNS = [
    /(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
    /^javascript:/i,
    /BuyChapterUnLogin/i,
    /\/0\.html$/i,
    // Homepage/root path patterns
    /^https?:\/\/[^/]+\/?$/i,
    // Root domain only (e.g., https://www.qidian.com/)
    /^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php|aspx)?$/i,
    // /index.html, /home.php
    /^https?:\/\/[^/]+\/\?/i
    // Root with query string (e.g., https://example.com/?ref=xxx)
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
        if (relLink && this.isValidLink(relLink, type)) {
          return {
            element: relLink,
            url: relLink.href,
            selector: this.generateSelector(relLink),
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
        if (!this.isValidLink(anchor, type)) continue;
        let score = 0;
        for (const pattern of patterns) {
          if (pattern.test(text)) {
            score += 10;
            if (text.length <= 5) score += 5;
          }
        }
        if (type === "next" || type === "prev") {
          const isChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text));
          const isSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text));
          if (isChapter) score += 3;
          if (isSection && !isChapter) score -= 2;
        }
        if (type === "index") {
          if (/^《.+》$/.test(text)) {
            score += 8;
          }
          const href = anchor.href;
          if (href.endsWith("/") || /\/index\.html?$/i.test(href)) {
            score += 3;
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
        selector: this.generateSelector(best.element),
        confidence: Math.min(best.score / 15, 0.9),
        method: "text-matching",
        text: best.text
      };
    }
    /**
     * Check if a link is valid for navigation
     */
    isValidLink(anchor, purpose) {
      var _a;
      const href = anchor.href;
      const text = ((_a = anchor.textContent) == null ? void 0 : _a.trim()) || "";
      if (!href) return false;
      if (href.startsWith("javascript:")) return false;
      for (const pattern of INVALID_URL_PATTERNS) {
        if (pattern.test(href)) {
          if (purpose === "index") {
            const looksLikeIndex = NAV_PATTERNS.index.some((p2) => p2.test(text));
            const looksLikeBookTitle = /^《.+》$/.test(text);
            if (looksLikeIndex || looksLikeBookTitle) continue;
          }
          return false;
        }
      }
      if (href.includes("#") && !href.includes("#chapter")) {
        const url = new URL(href);
        if (url.pathname === window.location.pathname) {
          return false;
        }
      }
      try {
        const url = new URL(href);
        const pathname = url.pathname;
        if (pathname === "/" || pathname.length < 3) {
          if (purpose === "index" && pathname.length >= 3) {
            const looksLikeBookTitle = /^《.+》$/.test(text);
            if (looksLikeBookTitle) {
              return true;
            }
          }
          return false;
        }
        const pathParts = pathname.split("/").filter(Boolean);
        if (pathParts.length < 2) {
          const part = pathParts[0] || "";
          if (!/\d/.test(part)) {
            return false;
          }
        }
        if (purpose === "index" && pathname.endsWith("/")) {
          return true;
        }
        const nonChapterPaths = [
          /^\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)/i,
          /^\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i
          // /book/ or /book/123/ without chapter
        ];
        for (const pattern of nonChapterPaths) {
          if (pattern.test(pathname)) return false;
        }
      } catch {
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
        if (isChapter && !isSection && this.isValidLink(anchor, "next")) {
          const comparison = this.compareUrlsForSection(currentUrl, anchor.href);
          if (!comparison.isSection) {
            return anchor.href;
          }
        }
      }
      return null;
    }
    /**
     * Generate a CSS selector for a link element
     */
    generateSelector(element) {
      if (element.id) {
        return `#${cssEscape(element.id)}`;
      }
      const classList = Array.from(element.classList || []);
      for (const cls of classList) {
        try {
          if (document.querySelectorAll(`.${cssEscape(cls)}`).length === 1) {
            return `.${cssEscape(cls)}`;
          }
        } catch {
          continue;
        }
      }
      return this.generatePathSelector(element);
    }
    /**
     * Generate a path-based selector (e.g., body > div:nth-of-type(2) > a)
     */
    generatePathSelector(element) {
      const path = [];
      let current = element;
      while (current && current !== document.body && current !== document.documentElement) {
        let segment = current.tagName.toLowerCase();
        if (current.id) {
          segment = `#${cssEscape(current.id)}`;
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
    detect(doc2 = document, currentUrl = window.location.href) {
      const content = this.contentDetector.detect(doc2);
      const navigation = this.navigationDetector.detect(doc2);
      const title = this.titleDetector.detect(doc2);
      const validatedNav = this.navigationDetector.validateNavigation(currentUrl, navigation);
      const section = this.navigationDetector.detectSection(doc2, currentUrl, validatedNav);
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
    detectSection(doc2 = document, currentUrl = window.location.href) {
      const navigation = this.navigationDetector.detect(doc2);
      return this.navigationDetector.detectSection(doc2, currentUrl, navigation);
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
          const elements = this.smartQueryAll(element, selector);
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
          const elements = this.smartQueryAll(element, selector);
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
    /**
     * Minimal jQuery-like selector support for content cleaning (:contains, :eq, :first, :last)
     */
    smartQueryAll(root, selector) {
      try {
        return Array.from(root.querySelectorAll(selector));
      } catch {
      }
      const eqMatch = selector.match(/^(.*):eq\(([-]?\d+)\)$/);
      if (eqMatch) {
        const baseSel = eqMatch[1] || "*";
        const index = parseInt(eqMatch[2], 10);
        try {
          const nodes = Array.from(root.querySelectorAll(baseSel));
          if (nodes.length === 0) return [];
          const idx = index >= 0 ? index : nodes.length + index;
          return nodes[idx] ? [nodes[idx]] : [];
        } catch {
          return [];
        }
      }
      const lastMatch = selector.match(/^(.*):last(?:\(\))?$/);
      if (lastMatch) {
        const baseSel = lastMatch[1] || "*";
        try {
          const nodes = Array.from(root.querySelectorAll(baseSel));
          return nodes.length ? [nodes[nodes.length - 1]] : [];
        } catch {
          return [];
        }
      }
      const firstMatch = selector.match(/^(.*):first(?:\(\))?$/);
      if (firstMatch) {
        const baseSel = firstMatch[1] || "*";
        try {
          const nodes = Array.from(root.querySelectorAll(baseSel));
          return nodes.length ? [nodes[0]] : [];
        } catch {
          return [];
        }
      }
      let currentSel = selector;
      const containsTexts = [];
      const containsRegex = /^(.*):contains\((['"]?)(.*?)\2\)$/;
      while (true) {
        const match = currentSel.match(containsRegex);
        if (!match) break;
        containsTexts.unshift(match[3]);
        currentSel = match[1];
      }
      if (containsTexts.length > 0) {
        const baseSel = currentSel.trim() || "*";
        try {
          let candidates = Array.from(root.querySelectorAll(baseSel));
          for (const text of containsTexts) {
            candidates = candidates.filter((el) => (el.textContent || "").includes(text));
          }
          return candidates;
        } catch {
          return [];
        }
      }
      return [];
    }
  }
  const STORAGE_KEYS = {
    USER_RULES: "mnr_user_rules",
    RULE_PREFIX: "mnr_rule_",
    COMMUNITY_RULES_URL: "mnr_community_rules_url",
    LAST_COMMUNITY_UPDATE: "mnr_community_rules_updated",
    SITE_PREFERENCES: "mnr_site_prefs"
  };
  const DEFAULT_COMMUNITY_RULES_URL = "https://raw.githubusercontent.com/JasonEX/MyNovelReader/master/rules/community.json";
  const specialRules = [
    // Qidian (起点) - VIP chapters, dynamic content
    {
      id: "qidian",
      name: "起点中文网",
      version: 8,
      match: {
        pattern: "^https?://(www|m)\\.qidian\\.com/chapter/.*"
      },
      content: {
        selector: 'main[id^="c-"]',
        remove: '.review, #r-titlePage, .tooltip-wrapper, .chapter-end-qrcode, section[id^="r-"]'
      },
      navigation: {
        // #mnr-qidian-* are created by beforeParse hook from JSON data
        // Fallback selectors for DOM-based navigation
        prev: '#mnr-qidian-prev, .nav-btn-group a:contains("上一章"), a.nav-btn:contains("上一章")',
        index: "#mnr-qidian-index",
        next: '#mnr-qidian-next, .nav-btn-group a:contains("下一章"), a.nav-btn:contains("下一章")'
      },
      title: {
        selector: "h1.title, h1.text-1\\.3em, #r-nav-chapter-title"
      },
      hooks: {
        // Build navigation links from pageContext JSON (SSR data)
        beforeParse: `
        // Remove review count from title
        try {
          const reviews = doc.querySelectorAll('h1 .review');
          reviews.forEach(el => el.remove());
        } catch (e) {}

        try {
          const script = doc.querySelector('#vite-plugin-ssr_pageContext');
          if (script) {
            const data = JSON.parse(script.textContent);
            const pageData = data.pageContext?.pageProps?.pageData;
            if (pageData) {
              const bookId = pageData.bookInfo?.bookId;
              const chapterInfo = pageData.chapterInfo;
              const host = url ? new URL(url).hostname : location.hostname;
              const navContainer = doc.createElement('div');
              navContainer.id = 'mnr-qidian-nav';
              navContainer.style.display = 'none';
              if (chapterInfo?.prev && chapterInfo.prev !== -1) {
                const prev = doc.createElement('a');
                prev.id = 'mnr-qidian-prev';
                prev.href = '//' + host + '/chapter/' + bookId + '/' + chapterInfo.prev + '/';
                prev.textContent = '上一章';
                navContainer.appendChild(prev);
              }
              if (chapterInfo?.next && chapterInfo.next !== -1) {
                const next = doc.createElement('a');
                next.id = 'mnr-qidian-next';
                next.href = '//' + host + '/chapter/' + bookId + '/' + chapterInfo.next + '/';
                next.textContent = '下一章';
                navContainer.appendChild(next);
              }
              if (bookId) {
                const index = doc.createElement('a');
                index.id = 'mnr-qidian-index';
                index.href = '//' + host + '/book/' + bookId + '/catalog/';
                index.textContent = '目录';
                navContainer.appendChild(index);
              }
              doc.body.appendChild(navContainer);
            }
          }
        } catch (e) {
          console.warn('[MyNovelReader] Qidian beforeParse error:', e);
        }
      `
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
    // 零点看书 / 文库吧系（示例：23.225.121.247/ldks/111291/42509753_2.html）
    // 特点：
    // - 同一章分页：/42509753.html -> /42509753_2.html（下一页），最后一页才出现“下一章”
    // - 目录页：/ldks/{bookId}/（章节列表）
    {
      id: "ldks-2baoe",
      name: "零点看书（ldks）",
      version: 1,
      match: {
        pattern: "^https?://(?:23\\.225\\.121\\.247|www\\.2baoe\\.com)/ldks/\\d+/\\d+(?:[_-]\\d+)?\\.html$"
      },
      content: {
        selector: "#content",
        // 正文里不需要标题；导航/脚本也不需要
        remove: "h1.title, script"
      },
      navigation: {
        prev: '.section-opt a:contains("上一章"), .section-opt a:contains("上一页")',
        index: '.section-opt a:contains("章节列表"), a:contains("章节列表")',
        next: '.section-opt a:contains("下一章"), .section-opt a:contains("下一页")'
      },
      title: {
        selector: "h1.title"
      },
      advanced: {
        checkSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "http://23.225.121.247/ldks/111291/42509753_2.html"
      }
    },
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
      version: 2,
      match: {
        pattern: "https://m\\.ilwxs\\.com/shu/\\d+/\\d+\\.html"
      },
      content: {
        selector: ".content"
      },
      navigation: {
        // The chapter page contains both "书页" (book info) and "目录" (full chapter list).
        // Ensure `indexUrl` points to the real TOC page (/shu/{bookId}/), not /info-{bookId}.html.
        prev: '.pager a:contains("上一章"), .pager a:contains("上一页")',
        next: '.pager a:contains("下一章"), .pager a:contains("下一页")',
        index: '.pager a[href^="/shu/"][href$="/"], .pager a[href*="/shu/"][href$="/"], .pager a:contains("目 录"), .pager a:contains("目录")'
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
    // 飞卢小说网
    {
      id: "faloo",
      name: "飞卢小说网",
      version: 1,
      match: {
        pattern: "^https?://[a-z]\\.faloo\\.com/\\d+_\\d+\\.html"
      },
      content: {
        selector: ".noveContent"
      },
      navigation: {
        // Faloo uses stable ids for pager buttons; keep :contains fallback for older layouts.
        prev: '#pre_page, a:contains("上一章")',
        next: '#next_page, a:contains("下一章")',
        index: '#huimulu, a:contains("目录")'
      },
      toc: {
        // Exclude "作品相关/小说相关" section in Faloo catalog sidebar.
        excludeAncestors: ".c_con_relation"
      },
      title: {
        // Chapter title is in <h1>; <h2> is site-wide slogan.
        selector: ".c_l_title > h1, h1",
        bookSelector: "#novelName",
        // Strip the leading book title token: "书名  1 章节名" -> "1 章节名"
        replace: "^\\s*\\S+\\s+"
      },
      meta: {
        source: "builtin",
        autoLaunch: true,
        exampleUrl: "https://b.faloo.com/412421_1.html"
      }
    },
    // 努努书坊 (kanunu8.com)
    {
      id: "kanunu8",
      name: "努努书坊",
      version: 1,
      match: {
        pattern: "^https?://www\\.kanunu8\\.com/.+/\\d+\\.html$"
      },
      content: {
        // 内容在宽度为820的td中的p标签
        selector: 'td[width="820"] > p, td[width="820"] p'
      },
      navigation: {
        // 底部导航表格中的链接，使用 td 位置选择
        prev: 'table[width="700"] td:first-child a',
        index: 'table[width="700"] td:nth-child(2) a',
        next: 'table[width="700"] td:last-child a'
      },
      title: {
        selector: 'font[color="#dc143c"][size="4"]'
      },
      toc: {
        // 排除顶部导航栏的分类链接
        excludeAncestors: '#header, .nav, .nav2, td[bgcolor="#A5BDC6"], td[bgcolor="#CEDFE5"]'
      },
      advanced: {
        // 该网站使用"上一页/下一页"作为章节导航文本，但实际上不是分页
        // 禁用分页检测以避免误判
        noSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://www.kanunu8.com/book3/7748/170164.html"
      }
    },
    // 书海阁小说网 (m.shuhaige.net)
    // 特点：
    // - 目录页：/36354/（章节列表）
    // - 章节页：/36354/55863782.html
    // - 分页章节：/36354/55863791.html -> /36354/55863791_2.html（下一页）
    // - 顶部导航有"书 页"链接，底部导航有"目 录"链接
    // - 需要清洗正文末尾的广告文字和分页提示
    {
      id: "shuhaige-m",
      name: "书海阁小说网(手机版)",
      version: 1,
      match: {
        // 匹配章节页和分页（如 55863791_2.html）
        pattern: "^https?://m\\.shuhaige\\.net/\\d+/\\d+(?:_\\d+)?\\.html$"
      },
      content: {
        selector: ".content",
        // 清洗正文末尾的广告文字和分页提示
        replace: [
          {
            // 分页提示：小主，这个章节后面还有哦，请点击下一页继续阅读，后面更精彩！
            pattern: "小主，这个章节后面还有哦.*?后面更精彩！",
            replacement: "",
            flags: "g"
          },
          {
            // 收藏广告：喜欢XXX请大家收藏：(m.shuhaige.net)XXX更新速度全网最快。
            pattern: "喜欢.*?请大家收藏：\\([^)]+\\).*?更新速度全网最快。",
            replacement: "",
            flags: "g"
          }
        ]
      },
      navigation: {
        // 优先匹配"上一章/下一章"，分页时会自动处理"上一页/下一页"
        prev: '.pager a:contains("上一章"), .pager a:contains("上一页")',
        index: '.pager a[href$="/"]:contains("目"), .pager a:contains("目录")',
        next: '.pager a:contains("下一章"), .pager a:contains("下一页")'
      },
      title: {
        selector: "h1.headline"
      },
      advanced: {
        // 启用分页检测，自动合并章节内的多个分页
        checkSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://m.shuhaige.net/36354/55863791.html"
      }
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
    // ========== Site Preferences (for auto-enable behavior) ==========
    /**
     * Get site preference for a domain
     */
    getSitePreference(domain) {
      try {
        const stored = GM_getValue(STORAGE_KEYS.SITE_PREFERENCES, {});
        const prefs = typeof stored === "object" && stored !== null ? stored : {};
        return prefs[domain] || null;
      } catch {
        return null;
      }
    }
    /**
     * Set site preference for a domain
     */
    setSitePreference(domain, pref) {
      try {
        const stored = GM_getValue(STORAGE_KEYS.SITE_PREFERENCES, {});
        const prefs = typeof stored === "object" && stored !== null ? stored : {};
        prefs[domain] = pref;
        GM_setValue(STORAGE_KEYS.SITE_PREFERENCES, prefs);
      } catch (e) {
        console.error("[MNR] Failed to save site preference:", e);
      }
    }
    /**
     * Delete site preference for a domain
     */
    deleteSitePreference(domain) {
      try {
        const stored = GM_getValue(STORAGE_KEYS.SITE_PREFERENCES, {});
        const prefs = typeof stored === "object" && stored !== null ? stored : {};
        delete prefs[domain];
        GM_setValue(STORAGE_KEYS.SITE_PREFERENCES, prefs);
      } catch (e) {
        console.error("[MNR] Failed to delete site preference:", e);
      }
    }
  }
  let storageInstance = null;
  function getRuleStorage() {
    if (!storageInstance) {
      storageInstance = new RuleStorage();
    }
    return storageInstance;
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
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const rule = ruleMatch.rule;
      if ((_a = rule.hooks) == null ? void 0 : _a.beforeParse) {
        try {
          const fn = new Function("doc", "url", rule.hooks.beforeParse);
          fn(doc2, url);
        } catch (e) {
          console.warn("[Parser] beforeParse hook error:", e);
        }
      }
      const contentElement = this.selectElement(doc2, rule.content.selector);
      if (!contentElement) {
        return this.parseWithDetection(doc2, url, rule);
      }
      let navigation = this.extractNavigation(doc2, rule);
      const hasRulePrev = ((_b = rule.navigation) == null ? void 0 : _b.prev) && rule.navigation.prev !== false;
      const hasRuleNext = ((_c = rule.navigation) == null ? void 0 : _c.next) && rule.navigation.next !== false;
      const hasRuleIndex = ((_d = rule.navigation) == null ? void 0 : _d.index) && rule.navigation.index !== false;
      if (!navigation.next || !navigation.prev || !navigation.index) {
        const detectedNav = this.detectionEngine.detect(doc2, url).results.navigation;
        if (!hasRuleNext && !navigation.next && ((_e = detectedNav.next) == null ? void 0 : _e.url)) {
          navigation.next = detectedNav.next.url;
        }
        if (!hasRulePrev && !navigation.prev && ((_f = detectedNav.prev) == null ? void 0 : _f.url)) {
          navigation.prev = detectedNav.prev.url;
        }
        if (!hasRuleIndex && !navigation.index && ((_g = detectedNav.index) == null ? void 0 : _g.url)) {
          navigation.index = detectedNav.index.url;
        }
      }
      const title = this.extractTitle(doc2, rule);
      const processingOptions = {
        removeSelectors: rule.content.remove,
        replaceRules: rule.content.replace,
        removeAds: ((_h = rule.processing) == null ? void 0 : _h.removeAds) !== false,
        normalizeWhitespace: ((_i = rule.processing) == null ? void 0 : _i.normalizeWhitespace) !== false,
        fixImages: ((_j = rule.processing) == null ? void 0 : _j.fixImages) !== false,
        useRawContent: (_k = rule.processing) == null ? void 0 : _k.useRawContent,
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
      const detection = this.detectionEngine.detect(doc2, url);
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
    detect(doc2 = document, url) {
      var _a;
      return this.detectionEngine.detect(doc2, url || ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href);
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
      var _a, _b, _c, _d, _e, _f, _g;
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
        const currentUrl = ((_d = doc2.location) == null ? void 0 : _d.href) || doc2._mnrUrl || window.location.href;
        const detection = this.detectionEngine.detect(doc2, currentUrl);
        chapter = detection.results.title.chapterTitle;
        book = book || detection.results.title.bookTitle;
      }
      if (!book && ((_e = rule.title) == null ? void 0 : _e.bookSelector)) {
        const el = this.selectElement(doc2, rule.title.bookSelector);
        if (el) {
          book = (_f = el.textContent) == null ? void 0 : _f.trim();
        }
      }
      if (((_g = rule.title) == null ? void 0 : _g.replace) && chapter) {
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
      const selectors = selector.split(",").map((s) => s.trim()).filter(Boolean);
      for (const sel of selectors) {
        const el = this.smartSelect(doc2, sel);
        if (el) return el;
      }
      return null;
    }
    /**
     * Minimal jQuery-like selector support (:contains, :eq, :last)
     */
    smartSelect(doc2, selector) {
      try {
        const native = doc2.querySelector(selector);
        if (native) return native;
      } catch {
      }
      const eqMatch = selector.match(/^(.*):eq\(([-]?\d+)\)$/);
      if (eqMatch) {
        const baseSel = eqMatch[1] || "*";
        const index = parseInt(eqMatch[2], 10);
        try {
          const nodes = Array.from(doc2.querySelectorAll(baseSel));
          if (nodes.length === 0) return null;
          const idx = index >= 0 ? index : nodes.length + index;
          return nodes[idx] || null;
        } catch {
          return null;
        }
      }
      const lastMatch = selector.match(/^(.*):last(?:\(\))?$/);
      if (lastMatch) {
        const baseSel = lastMatch[1] || "*";
        try {
          const nodes = Array.from(doc2.querySelectorAll(baseSel));
          return nodes.length ? nodes[nodes.length - 1] : null;
        } catch {
          return null;
        }
      }
      const firstMatch = selector.match(/^(.*):first(?:\(\))?$/);
      if (firstMatch) {
        const baseSel = firstMatch[1] || "*";
        try {
          const nodes = Array.from(doc2.querySelectorAll(baseSel));
          return nodes.length ? nodes[0] : null;
        } catch {
          return null;
        }
      }
      let currentSel = selector;
      const containsTexts = [];
      const containsRegex = /^(.*):contains\((['"]?)(.*?)\2\)$/;
      while (true) {
        const match = currentSel.match(containsRegex);
        if (!match) break;
        containsTexts.unshift(match[3]);
        currentSel = match[1];
      }
      if (containsTexts.length > 0) {
        const baseSel = currentSel.trim() || "*";
        try {
          let candidates = Array.from(doc2.querySelectorAll(baseSel));
          for (const text of containsTexts) {
            candidates = candidates.filter((el) => (el.textContent || "").includes(text));
          }
          return candidates[0] || null;
        } catch {
          return null;
        }
      }
      return null;
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
    blockVisibilityDetection: true,
    clearTimers: true
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
      if (this.options.clearTimers) {
        this.clearTimers();
      }
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
     * Clear all intervals and timeouts to reduce CPU usage
     * Many novel sites use tracking scripts that create intervals causing high CPU/GC
     */
    clearTimers() {
      const highestId = window.setInterval(() => {
      }, 0);
      for (let i = 0; i <= highestId; i++) {
        window.clearInterval(i);
      }
      const highestTimeoutId = window.setTimeout(() => {
      }, 0);
      for (let i = 0; i <= highestTimeoutId; i++) {
        window.clearTimeout(i);
      }
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
  function getGmXhr$1() {
    if (typeof GM_xmlhttpRequest === "function") {
      return GM_xmlhttpRequest;
    }
    return null;
  }
  function fetchUrl(url, referer) {
    const gmXhr = getGmXhr$1();
    if (!gmXhr) {
      return Promise.resolve(null);
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
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }
  function isSectionLikeUrl$1(currentUrl, nextUrl) {
    try {
      const current = new URL(currentUrl);
      const next = new URL(nextUrl);
      if (current.host !== next.host) return false;
      const currentPath = current.pathname;
      const nextPath = next.pathname;
      const firstPageMatch = currentPath.match(/\/(\d+)\.html?$/i);
      const secondPageMatch = nextPath.match(/\/(\d+)[_-]2\.html?$/i);
      if (firstPageMatch && secondPageMatch && firstPageMatch[1] === secondPageMatch[1]) {
        return true;
      }
      const sectionMatch1 = currentPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
      const sectionMatch2 = nextPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
      if (sectionMatch1 && sectionMatch2 && sectionMatch1[1] === sectionMatch2[1]) {
        const s1 = parseInt(sectionMatch1[2], 10);
        const s2 = parseInt(sectionMatch2[2], 10);
        if (s2 === s1 + 1) return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  function findNextChapterUrl(doc2, currentUrl) {
    var _a;
    const links = doc2.querySelectorAll("a[href]");
    for (const link of links) {
      const anchor = link;
      const text = ((_a = anchor.textContent) == null ? void 0 : _a.trim()) || "";
      const isChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text));
      const isSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text));
      if (isChapter && !isSection) {
        const href = anchor.href;
        if (!isSectionLikeUrl$1(currentUrl, href)) {
          return href;
        }
      }
    }
    return null;
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
      var _a, _b, _c, _d;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const hostname = new URL(url).hostname;
      const storage = getRuleStorage();
      const pref = storage.getSitePreference(hostname);
      if ((pref == null ? void 0 : pref.enabled) === false) {
        return {
          shouldEnable: false,
          method: "user-disabled",
          confidence: 0,
          reasons: ["User previously disabled auto-enable for this site"],
          showFloatingButton: true
        };
      }
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
      const detection = this.detectionEngine.detect(doc2, ((_d = doc2.location) == null ? void 0 : _d.href) || window.location.href);
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
      var _a, _b, _c, _d, _e;
      try {
        const chapter = await this.parser.parse(doc2);
        if (chapter && this.launchCallback) {
          const currentUrl = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
          const enableByRule = !!((_c = (_b = chapter.rule) == null ? void 0 : _b.advanced) == null ? void 0 : _c.checkSection) && !((_e = (_d = chapter.rule) == null ? void 0 : _d.advanced) == null ? void 0 : _e.noSection);
          const shouldMerge = enableByRule && chapter.nextUrl && isSectionLikeUrl$1(currentUrl, chapter.nextUrl);
          if (shouldMerge) {
            const merged = await this.mergeSectionPages(chapter, currentUrl);
            this.launchCallback(merged, decision.rule);
          } else {
            if (chapter.nextUrl && isSectionLikeUrl$1(currentUrl, chapter.nextUrl)) {
              const realNextChapterUrl = findNextChapterUrl(doc2, currentUrl);
              if (realNextChapterUrl) {
                chapter.nextUrl = realNextChapterUrl;
              }
            }
            this.launchCallback(chapter, decision.rule);
          }
        }
      } catch (e) {
        console.error("[AutoEnableManager] Parse error:", e);
      }
    }
    /**
     * Merge all section pages into a single chapter
     */
    async mergeSectionPages(firstChapter, currentUrl) {
      const parser = getParser();
      let mergedContent = firstChapter.content;
      let mergedRaw = firstChapter.rawContent;
      let nextSectionUrl = firstChapter.nextUrl;
      let nextChapterUrl = null;
      let lastUrl = currentUrl;
      const seen = /* @__PURE__ */ new Set([currentUrl]);
      for (let i = 0; i < 10 && nextSectionUrl; i++) {
        const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
        if (seen.has(absNextSection)) break;
        seen.add(absNextSection);
        if (!isSectionLikeUrl$1(lastUrl, absNextSection)) {
          nextChapterUrl = absNextSection;
          break;
        }
        const nextDoc = await fetchUrl(absNextSection, lastUrl);
        if (!nextDoc) break;
        const nextParsed = await parser.parse(nextDoc, absNextSection);
        if (!nextParsed) break;
        mergedContent = joinHtml(mergedContent, nextParsed.content);
        mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);
        if (nextParsed.nextUrl) {
          if (isSectionLikeUrl$1(absNextSection, nextParsed.nextUrl)) {
            nextSectionUrl = nextParsed.nextUrl;
          } else {
            nextChapterUrl = nextParsed.nextUrl;
            nextSectionUrl = null;
          }
        } else {
          nextSectionUrl = null;
        }
        lastUrl = absNextSection;
      }
      return {
        ...firstChapter,
        content: mergedContent,
        rawContent: mergedRaw,
        nextUrl: nextChapterUrl || firstChapter.nextUrl
      };
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
        if (navigation.next) {
          rule.navigation.next = navigation.next.selector || navigation.next.url;
        }
        if (navigation.prev) {
          rule.navigation.prev = navigation.prev.selector || navigation.prev.url;
        }
        if (navigation.index) {
          rule.navigation.index = navigation.index.selector || navigation.index.url;
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
      var _a, _b, _c, _d, _e, _f;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      try {
        const hostname = new URL(url).hostname;
        const storage = getRuleStorage();
        storage.setSitePreference(hostname, { enabled: true, timestamp: Date.now() });
      } catch (e) {
        console.error("[AutoEnableManager] Failed to save site preference:", e);
      }
      if (this.options.enableProtection) {
        const protection = getSiteProtection();
        protection.activate();
        protection.removeOverlays();
      }
      try {
        const chapter = await this.parser.parse(doc2);
        if (chapter && this.launchCallback) {
          const currentUrl = ((_b = doc2.location) == null ? void 0 : _b.href) || window.location.href;
          const enableByRule = !!((_d = (_c = chapter.rule) == null ? void 0 : _c.advanced) == null ? void 0 : _d.checkSection) && !((_f = (_e = chapter.rule) == null ? void 0 : _e.advanced) == null ? void 0 : _f.noSection);
          const shouldMerge = enableByRule && chapter.nextUrl && isSectionLikeUrl$1(currentUrl, chapter.nextUrl);
          if (shouldMerge) {
            const merged = await this.mergeSectionPages(chapter, currentUrl);
            this.launchCallback(merged, void 0);
          } else {
            if (chapter.nextUrl && isSectionLikeUrl$1(currentUrl, chapter.nextUrl)) {
              const realNextChapterUrl = findNextChapterUrl(doc2, currentUrl);
              if (realNextChapterUrl) {
                chapter.nextUrl = realNextChapterUrl;
              }
            }
            this.launchCallback(chapter, void 0);
          }
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
  const s_2_t = {
    "·": "‧",
    "―": "─",
    "‖": "∥",
    "‘": "『",
    "’": "』",
    "“": "「",
    "”": "」",
    "″": "〞",
    "∏": "Π",
    "∑": "Σ",
    "∧": "︿",
    "∨": "﹀",
    "∶": "︰",
    "≈": "≒",
    "≤": "≦",
    "≥": "≧",
    "━": "─",
    "┃": "│",
    "┏": "┌",
    "┓": "┐",
    "┗": "└",
    "┛": "┘",
    "┣": "├",
    "┫": "┤",
    "┳": "┬",
    "┻": "┴",
    "╋": "┼",
    "〖": "【",
    "〗": "】",
    "㑇": "㑳",
    "㖞": "喎",
    "㘎": "㘚",
    "㤘": "㥮",
    "㧏": "掆",
    "㧐": "㩳",
    "㧟": "擓",
    "㭎": "棡",
    "㳠": "澾",
    "䁖": "瞜",
    "䅟": "穇",
    "䌷": "紬",
    "䎬": "䎱",
    "䏝": "膞",
    "䓖": "藭",
    "䙌": "䙡",
    "䜣": "訢",
    "䜩": "讌",
    "䞍": "䝼",
    "䥺": "釾",
    "䥽": "鏺",
    "䦂": "䥇",
    "䦃": "鐯",
    "䦅": "鐥",
    "䦆": "钁",
    "䦶": "䦛",
    "䦷": "䦟",
    "䲟": "鮣",
    "䲡": "鰌",
    "䲢": "鰧",
    "䲣": "䱷",
    "䴓": "鳾",
    "䴔": "鵁",
    "䴕": "鴷",
    "䴖": "鶄",
    "䴗": "鶪",
    "䴘": "鷉",
    "䴙": "鸊",
    "䶮": "龑",
    "万": "萬",
    "与": "與",
    "专": "專",
    "业": "業",
    "丛": "叢",
    "东": "東",
    "丝": "絲",
    "丢": "丟",
    "两": "兩",
    "严": "嚴",
    "丧": "喪",
    "个": "個",
    "丰": "豐",
    "临": "臨",
    "为": "為",
    "丽": "麗",
    "举": "舉",
    "么": "麼",
    "义": "義",
    "乌": "烏",
    "乐": "樂",
    "乔": "喬",
    "习": "習",
    "乡": "鄉",
    "书": "書",
    "买": "買",
    "乱": "亂",
    "争": "爭",
    "于": "於",
    "亏": "虧",
    "云": "雲",
    "亘": "亙",
    "亚": "亞",
    "产": "產",
    "亩": "畝",
    "亲": "親",
    "亵": "褻",
    "亿": "億",
    "仅": "僅",
    "仆": "僕",
    "从": "從",
    "仑": "侖",
    "仓": "倉",
    "仪": "儀",
    "们": "們",
    "价": "價",
    "众": "眾",
    "优": "優",
    "会": "會",
    "伛": "傴",
    "伞": "傘",
    "伟": "偉",
    "传": "傳",
    "伤": "傷",
    "伥": "倀",
    "伦": "倫",
    "伧": "傖",
    "伪": "偽",
    "伫": "佇",
    "伲": "你",
    "体": "體",
    "佣": "傭",
    "佥": "僉",
    "侠": "俠",
    "侣": "侶",
    "侥": "僥",
    "侦": "偵",
    "侧": "側",
    "侨": "僑",
    "侩": "儈",
    "侪": "儕",
    "侬": "儂",
    "俣": "俁",
    "俦": "儔",
    "俨": "儼",
    "俩": "倆",
    "俪": "儷",
    "俭": "儉",
    "倮": "裸",
    "债": "債",
    "倾": "傾",
    "偬": "傯",
    "偻": "僂",
    "偾": "僨",
    "偿": "償",
    "傥": "儻",
    "傧": "儐",
    "储": "儲",
    "傩": "儺",
    "儿": "兒",
    "兑": "兌",
    "兖": "兗",
    "党": "黨",
    "兰": "蘭",
    "关": "關",
    "兴": "興",
    "兹": "茲",
    "养": "養",
    "兽": "獸",
    "冁": "囅",
    "内": "內",
    "冈": "岡",
    "册": "冊",
    "写": "寫",
    "军": "軍",
    "农": "農",
    "冯": "馮",
    "冲": "沖",
    "决": "決",
    "况": "況",
    "冻": "凍",
    "净": "淨",
    "凄": "淒",
    "凇": "淞",
    "凉": "涼",
    "减": "減",
    "凑": "湊",
    "凛": "凜",
    "几": "幾",
    "凤": "鳳",
    "処": "處",
    "凫": "鳧",
    "凭": "憑",
    "凯": "凱",
    "击": "擊",
    "凼": "幽",
    "凿": "鑿",
    "刍": "芻",
    "划": "劃",
    "刘": "劉",
    "则": "則",
    "刚": "剛",
    "创": "創",
    "删": "刪",
    "别": "別",
    "刬": "剗",
    "刭": "剄",
    "刹": "剎",
    "刽": "劊",
    "刿": "劌",
    "剀": "剴",
    "剂": "劑",
    "剐": "剮",
    "剑": "劍",
    "剥": "剝",
    "剧": "劇",
    "剳": "劄",
    "劝": "勸",
    "办": "辦",
    "务": "務",
    "劢": "勱",
    "动": "動",
    "励": "勵",
    "劲": "勁",
    "劳": "勞",
    "势": "勢",
    "勋": "勳",
    "勚": "勩",
    "勛": "勳",
    "勦": "剿",
    "匀": "勻",
    "匦": "匭",
    "匮": "匱",
    "区": "區",
    "医": "醫",
    "华": "華",
    "协": "協",
    "单": "單",
    "卖": "賣",
    "占": "佔",
    "卢": "盧",
    "卤": "鹵",
    "卧": "臥",
    "卫": "衛",
    "却": "卻",
    "卺": "巹",
    "厂": "廠",
    "厅": "廳",
    "历": "歷",
    "厉": "厲",
    "压": "壓",
    "厌": "厭",
    "厍": "厙",
    "厕": "廁",
    "厘": "釐",
    "厢": "廂",
    "厣": "厴",
    "厦": "廈",
    "厨": "廚",
    "厩": "廄",
    "厮": "廝",
    "县": "縣",
    "叁": "參",
    "参": "參",
    "叆": "靉",
    "叇": "靆",
    "双": "雙",
    "发": "發",
    "变": "變",
    "叙": "敘",
    "叠": "疊",
    "叶": "葉",
    "号": "號",
    "叹": "嘆",
    "叽": "嘰",
    "吁": "籲",
    "后": "後",
    "吓": "嚇",
    "吕": "呂",
    "吗": "嗎",
    "吨": "噸",
    "听": "聽",
    "启": "啟",
    "吴": "吳",
    "呐": "吶",
    "呒": "嘸",
    "呓": "囈",
    "呕": "嘔",
    "呖": "嚦",
    "呗": "唄",
    "员": "員",
    "呙": "咼",
    "呛": "嗆",
    "呜": "嗚",
    "咏": "詠",
    "咙": "嚨",
    "咛": "嚀",
    "咝": "噝",
    "哌": "呱",
    "响": "響",
    "哑": "啞",
    "哒": "噠",
    "哓": "嘵",
    "哔": "嗶",
    "哕": "噦",
    "哗": "嘩",
    "哙": "噲",
    "哜": "嚌",
    "哝": "噥",
    "哟": "喲",
    "唛": "嘜",
    "唝": "嗊",
    "唠": "嘮",
    "唡": "啢",
    "唢": "嗩",
    "唤": "喚",
    "啓": "啟",
    "啧": "嘖",
    "啬": "嗇",
    "啭": "囀",
    "啮": "齧",
    "啰": "囉",
    "啸": "嘯",
    "喷": "噴",
    "喽": "嘍",
    "喾": "嚳",
    "嗫": "囁",
    "嗬": "呵",
    "嗳": "噯",
    "嘘": "噓",
    "嘤": "嚶",
    "嘩": "譁",
    "嘱": "囑",
    "噜": "嚕",
    "嚣": "囂",
    "嚮": "向",
    "团": "團",
    "园": "園",
    "囯": "國",
    "囱": "囪",
    "围": "圍",
    "囵": "圇",
    "国": "國",
    "图": "圖",
    "圆": "圓",
    "圣": "聖",
    "圹": "壙",
    "场": "場",
    "坂": "阪",
    "坏": "壞",
    "块": "塊",
    "坚": "堅",
    "坛": "壇",
    "坜": "壢",
    "坝": "壩",
    "坞": "塢",
    "坟": "墳",
    "坠": "墜",
    "垄": "壟",
    "垅": "壟",
    "垆": "壚",
    "垒": "壘",
    "垦": "墾",
    "垩": "堊",
    "垫": "墊",
    "垭": "埡",
    "垲": "塏",
    "垴": "堖",
    "埘": "塒",
    "埙": "壎",
    "埚": "堝",
    "堑": "塹",
    "堕": "墮",
    "墒": "墑",
    "墙": "牆",
    "壮": "壯",
    "声": "聲",
    "壳": "殼",
    "壶": "壺",
    "处": "處",
    "备": "備",
    "复": "復",
    "够": "夠",
    "头": "頭",
    "夸": "誇",
    "夹": "夾",
    "夺": "奪",
    "奁": "奩",
    "奂": "奐",
    "奋": "奮",
    "奖": "獎",
    "奥": "奧",
    "奬": "獎",
    "妆": "妝",
    "妇": "婦",
    "妈": "媽",
    "妩": "嫵",
    "妪": "嫗",
    "妫": "媯",
    "姗": "姍",
    "娄": "婁",
    "娅": "婭",
    "娆": "嬈",
    "娇": "嬌",
    "娈": "孌",
    "娱": "娛",
    "娲": "媧",
    "娴": "嫻",
    "婳": "嫿",
    "婴": "嬰",
    "婵": "嬋",
    "婶": "嬸",
    "媪": "媼",
    "嫒": "嬡",
    "嫔": "嬪",
    "嫱": "嬙",
    "嬷": "嬤",
    "孙": "孫",
    "学": "學",
    "孪": "孿",
    "宁": "寧",
    "宝": "寶",
    "实": "實",
    "宠": "寵",
    "审": "審",
    "宪": "憲",
    "宫": "宮",
    "宽": "寬",
    "宾": "賓",
    "寀": "采",
    "寝": "寢",
    "对": "對",
    "寻": "尋",
    "导": "導",
    "寿": "壽",
    "将": "將",
    "尔": "爾",
    "尘": "塵",
    "尜": "嘎",
    "尝": "嘗",
    "尧": "堯",
    "尴": "尷",
    "尸": "屍",
    "尽": "盡",
    "层": "層",
    "屉": "屜",
    "届": "屆",
    "属": "屬",
    "屡": "屢",
    "屦": "屨",
    "屿": "嶼",
    "岁": "歲",
    "岂": "豈",
    "岖": "嶇",
    "岗": "崗",
    "岘": "峴",
    "岚": "嵐",
    "岛": "島",
    "岭": "嶺",
    "岽": "崠",
    "岿": "巋",
    "峃": "嶨",
    "峄": "嶧",
    "峡": "峽",
    "峣": "嶢",
    "峤": "嶠",
    "峥": "崢",
    "峦": "巒",
    "峯": "峰",
    "崂": "嶗",
    "崃": "崍",
    "崐": "崑",
    "崭": "嶄",
    "嵘": "嶸",
    "嵚": "嶔",
    "嵛": "崳",
    "嵝": "嶁",
    "巅": "巔",
    "巌": "巖",
    "巩": "鞏",
    "巯": "巰",
    "币": "幣",
    "帅": "帥",
    "师": "師",
    "帏": "幃",
    "帐": "帳",
    "帘": "簾",
    "帜": "幟",
    "带": "帶",
    "帧": "幀",
    "帮": "幫",
    "帱": "幬",
    "帻": "幘",
    "帼": "幗",
    "幂": "冪",
    "幵": "開",
    "并": "並",
    "幷": "並",
    "广": "廣",
    "庄": "莊",
    "庆": "慶",
    "庐": "廬",
    "庑": "廡",
    "库": "庫",
    "应": "應",
    "庙": "廟",
    "庞": "龐",
    "废": "廢",
    "庼": "廎",
    "廪": "廩",
    "开": "開",
    "异": "異",
    "弃": "棄",
    "弑": "弒",
    "张": "張",
    "弥": "彌",
    "弪": "弳",
    "弯": "彎",
    "弹": "彈",
    "强": "強",
    "归": "歸",
    "当": "當",
    "彔": "录",
    "录": "錄",
    "彚": "彙",
    "彦": "彥",
    "彻": "徹",
    "径": "徑",
    "徕": "徠",
    "忆": "憶",
    "忏": "懺",
    "忧": "憂",
    "忾": "愾",
    "怀": "懷",
    "态": "態",
    "怂": "慫",
    "怃": "憮",
    "怄": "慪",
    "怅": "悵",
    "怆": "愴",
    "怜": "憐",
    "总": "總",
    "怼": "懟",
    "怿": "懌",
    "恋": "戀",
    "恒": "恆",
    "恳": "懇",
    "恶": "惡",
    "恸": "慟",
    "恹": "懨",
    "恺": "愷",
    "恻": "惻",
    "恼": "惱",
    "恽": "惲",
    "悦": "悅",
    "悫": "愨",
    "悬": "懸",
    "悭": "慳",
    "悯": "憫",
    "惊": "驚",
    "惧": "懼",
    "惨": "慘",
    "惩": "懲",
    "惫": "憊",
    "惬": "愜",
    "惭": "慚",
    "惮": "憚",
    "惯": "慣",
    "愠": "慍",
    "愤": "憤",
    "愦": "憒",
    "愿": "願",
    "慑": "懾",
    "懑": "懣",
    "懒": "懶",
    "懔": "懍",
    "戆": "戇",
    "戋": "戔",
    "戏": "戲",
    "戗": "戧",
    "战": "戰",
    "戬": "戩",
    "户": "戶",
    "扑": "撲",
    "执": "執",
    "扩": "擴",
    "扪": "捫",
    "扫": "掃",
    "扬": "揚",
    "扰": "擾",
    "抚": "撫",
    "抛": "拋",
    "抟": "摶",
    "抠": "摳",
    "抡": "掄",
    "抢": "搶",
    "护": "護",
    "报": "報",
    "担": "擔",
    "拟": "擬",
    "拢": "攏",
    "拣": "揀",
    "拥": "擁",
    "拦": "攔",
    "拧": "擰",
    "拨": "撥",
    "择": "擇",
    "挂": "掛",
    "挚": "摯",
    "挛": "攣",
    "挜": "掗",
    "挝": "撾",
    "挞": "撻",
    "挟": "挾",
    "挠": "撓",
    "挡": "擋",
    "挢": "撟",
    "挣": "掙",
    "挤": "擠",
    "挥": "揮",
    "挦": "撏",
    "捜": "搜",
    "捞": "撈",
    "损": "損",
    "捡": "撿",
    "换": "換",
    "捣": "搗",
    "据": "據",
    "掳": "擄",
    "掴": "摑",
    "掷": "擲",
    "掸": "撣",
    "掺": "摻",
    "掼": "摜",
    "揽": "攬",
    "揿": "撳",
    "搀": "攙",
    "搁": "擱",
    "搂": "摟",
    "搅": "攪",
    "携": "攜",
    "摄": "攝",
    "摅": "攄",
    "摆": "擺",
    "摇": "搖",
    "摈": "擯",
    "摊": "攤",
    "撄": "攖",
    "撑": "撐",
    "撵": "攆",
    "撷": "擷",
    "撸": "擼",
    "撺": "攛",
    "擀": "搟",
    "擞": "擻",
    "攒": "攢",
    "敌": "敵",
    "敛": "斂",
    "数": "數",
    "斋": "齋",
    "斓": "斕",
    "斩": "斬",
    "断": "斷",
    "无": "無",
    "旧": "舊",
    "时": "時",
    "旷": "曠",
    "旸": "暘",
    "昙": "曇",
    "昵": "暱",
    "昼": "晝",
    "昽": "曨",
    "显": "顯",
    "晋": "晉",
    "晒": "曬",
    "晓": "曉",
    "晔": "曄",
    "晕": "暈",
    "晖": "暉",
    "暂": "暫",
    "暧": "曖",
    "暸": "瞭",
    "朮": "術",
    "术": "術",
    "机": "機",
    "杀": "殺",
    "杂": "雜",
    "权": "權",
    "杆": "桿",
    "杠": "槓",
    "条": "條",
    "来": "來",
    "杨": "楊",
    "杩": "榪",
    "杰": "傑",
    "极": "極",
    "构": "構",
    "枞": "樅",
    "枢": "樞",
    "枣": "棗",
    "枥": "櫪",
    "枧": "梘",
    "枨": "棖",
    "枪": "槍",
    "枫": "楓",
    "枭": "梟",
    "柜": "櫃",
    "柠": "檸",
    "柽": "檉",
    "栀": "梔",
    "栅": "柵",
    "标": "標",
    "栈": "棧",
    "栉": "櫛",
    "栊": "櫳",
    "栋": "棟",
    "栌": "櫨",
    "栎": "櫟",
    "栏": "欄",
    "树": "樹",
    "栖": "棲",
    "样": "樣",
    "栾": "欒",
    "桔": "橘",
    "桠": "椏",
    "桡": "橈",
    "桢": "楨",
    "档": "檔",
    "桤": "榿",
    "桥": "橋",
    "桦": "樺",
    "桧": "檜",
    "桨": "槳",
    "桩": "樁",
    "梦": "夢",
    "检": "檢",
    "棂": "櫺",
    "椁": "槨",
    "椟": "櫝",
    "椠": "槧",
    "椤": "欏",
    "椭": "橢",
    "楼": "樓",
    "榄": "欖",
    "榇": "櫬",
    "榈": "櫚",
    "榉": "櫸",
    "榘": "矩",
    "槚": "檟",
    "槛": "檻",
    "槟": "檳",
    "槠": "櫧",
    "槼": "規",
    "横": "橫",
    "樯": "檣",
    "樱": "櫻",
    "橥": "櫫",
    "橱": "櫥",
    "橹": "櫓",
    "橼": "櫞",
    "檐": "簷",
    "檩": "檁",
    "欢": "歡",
    "欤": "歟",
    "欧": "歐",
    "歎": "嘆",
    "歼": "殲",
    "殁": "歿",
    "殇": "殤",
    "残": "殘",
    "殒": "殞",
    "殓": "殮",
    "殚": "殫",
    "殡": "殯",
    "殴": "毆",
    "毁": "毀",
    "毂": "轂",
    "毕": "畢",
    "毙": "斃",
    "毡": "氈",
    "毵": "毿",
    "氇": "氌",
    "气": "氣",
    "氢": "氫",
    "氩": "氬",
    "氲": "氳",
    "氽": "汆",
    "汇": "匯",
    "汉": "漢",
    "汤": "湯",
    "汹": "洶",
    "沟": "溝",
    "没": "沒",
    "沣": "灃",
    "沤": "漚",
    "沥": "瀝",
    "沦": "淪",
    "沧": "滄",
    "沨": "渢",
    "沩": "溈",
    "沪": "滬",
    "沲": "沱",
    "泄": "洩",
    "泞": "濘",
    "泪": "淚",
    "泶": "澩",
    "泷": "瀧",
    "泸": "瀘",
    "泺": "濼",
    "泻": "瀉",
    "泼": "潑",
    "泽": "澤",
    "泾": "涇",
    "洁": "潔",
    "洒": "灑",
    "洼": "窪",
    "浃": "浹",
    "浅": "淺",
    "浆": "漿",
    "浇": "澆",
    "浈": "湞",
    "浉": "溮",
    "浊": "濁",
    "测": "測",
    "浍": "澮",
    "济": "濟",
    "浏": "瀏",
    "浐": "滻",
    "浑": "渾",
    "浒": "滸",
    "浓": "濃",
    "浔": "潯",
    "浕": "濜",
    "浜": "濱",
    "涌": "湧",
    "涛": "濤",
    "涝": "澇",
    "涞": "淶",
    "涟": "漣",
    "涠": "潿",
    "涡": "渦",
    "涢": "溳",
    "涣": "渙",
    "涤": "滌",
    "润": "潤",
    "涧": "澗",
    "涨": "漲",
    "涩": "澀",
    "渊": "淵",
    "渌": "淥",
    "渍": "漬",
    "渎": "瀆",
    "渐": "漸",
    "渑": "澠",
    "渔": "漁",
    "渖": "瀋",
    "渗": "滲",
    "温": "溫",
    "湾": "灣",
    "湿": "濕",
    "溃": "潰",
    "溅": "濺",
    "溆": "漵",
    "溇": "漊",
    "溼": "濕",
    "滗": "潷",
    "滚": "滾",
    "滞": "滯",
    "滟": "灩",
    "滠": "灄",
    "满": "滿",
    "滢": "瀅",
    "滤": "濾",
    "滥": "濫",
    "滦": "灤",
    "滨": "濱",
    "滩": "灘",
    "滪": "澦",
    "潆": "瀠",
    "潇": "瀟",
    "潋": "瀲",
    "潍": "濰",
    "潜": "潛",
    "潴": "瀦",
    "澜": "瀾",
    "濑": "瀨",
    "濒": "瀕",
    "灏": "灝",
    "灭": "滅",
    "灯": "燈",
    "灵": "靈",
    "灾": "災",
    "灿": "燦",
    "炀": "煬",
    "炉": "爐",
    "炖": "燉",
    "炜": "煒",
    "炝": "熗",
    "炤": "照",
    "点": "點",
    "炼": "煉",
    "炽": "熾",
    "烁": "爍",
    "烂": "爛",
    "烃": "烴",
    "烛": "燭",
    "烟": "煙",
    "烦": "煩",
    "烧": "燒",
    "烨": "燁",
    "烩": "燴",
    "烫": "燙",
    "烬": "燼",
    "热": "熱",
    "焕": "煥",
    "焖": "燜",
    "焘": "燾",
    "煅": "鍛",
    "爱": "愛",
    "爲": "為",
    "爷": "爺",
    "牀": "床",
    "牍": "牘",
    "牦": "犛",
    "牵": "牽",
    "牺": "犧",
    "犊": "犢",
    "状": "狀",
    "犷": "獷",
    "犸": "獁",
    "犹": "猶",
    "狈": "狽",
    "狝": "獮",
    "狞": "獰",
    "独": "獨",
    "狭": "狹",
    "狮": "獅",
    "狯": "獪",
    "狰": "猙",
    "狱": "獄",
    "狲": "猻",
    "猃": "獫",
    "猎": "獵",
    "猕": "獼",
    "猡": "玀",
    "猪": "豬",
    "猫": "貓",
    "猬": "蝟",
    "献": "獻",
    "獃": "呆",
    "獭": "獺",
    "玑": "璣",
    "玛": "瑪",
    "玮": "瑋",
    "环": "環",
    "现": "現",
    "玱": "瑲",
    "玺": "璽",
    "珉": "玟",
    "珏": "玨",
    "珐": "琺",
    "珑": "瓏",
    "珲": "琿",
    "琎": "璡",
    "琏": "璉",
    "琐": "瑣",
    "琯": "管",
    "琼": "瓊",
    "瑶": "瑤",
    "瑷": "璦",
    "璎": "瓔",
    "瓒": "瓚",
    "瓮": "甕",
    "瓯": "甌",
    "産": "產",
    "电": "電",
    "画": "畫",
    "畅": "暢",
    "畲": "畬",
    "畴": "疇",
    "疖": "癤",
    "疗": "療",
    "疟": "瘧",
    "疠": "癘",
    "疡": "瘍",
    "疬": "癧",
    "疮": "瘡",
    "疯": "瘋",
    "疱": "皰",
    "疴": "痾",
    "痈": "癰",
    "痉": "痙",
    "痒": "癢",
    "痖": "瘂",
    "痨": "癆",
    "痪": "瘓",
    "痫": "癇",
    "痹": "痺",
    "瘅": "癉",
    "瘗": "瘞",
    "瘘": "瘻",
    "瘪": "癟",
    "瘫": "癱",
    "瘾": "癮",
    "瘿": "癭",
    "癞": "癩",
    "癡": "痴",
    "癣": "癬",
    "癫": "癲",
    "皑": "皚",
    "皰": "疱",
    "皱": "皺",
    "皲": "皸",
    "盏": "盞",
    "盐": "鹽",
    "监": "監",
    "盖": "蓋",
    "盗": "盜",
    "盘": "盤",
    "眍": "瞘",
    "眎": "視",
    "眦": "眥",
    "眬": "矓",
    "着": "著",
    "睁": "睜",
    "睐": "睞",
    "睑": "瞼",
    "瞒": "瞞",
    "瞩": "矚",
    "矫": "矯",
    "矶": "磯",
    "矾": "礬",
    "矿": "礦",
    "砀": "碭",
    "码": "碼",
    "砖": "磚",
    "砗": "硨",
    "砚": "硯",
    "砜": "碸",
    "砺": "礪",
    "砻": "礱",
    "砾": "礫",
    "础": "礎",
    "硕": "碩",
    "硖": "硤",
    "硗": "磽",
    "硙": "磑",
    "硚": "礄",
    "确": "確",
    "硷": "鹼",
    "碍": "礙",
    "碛": "磧",
    "碜": "磣",
    "碱": "鹼",
    "礡": "礴",
    "礼": "禮",
    "祎": "禕",
    "祯": "禎",
    "祷": "禱",
    "祸": "禍",
    "禀": "稟",
    "禄": "祿",
    "禅": "禪",
    "禰": "祢",
    "离": "離",
    "秃": "禿",
    "秆": "稈",
    "种": "種",
    "积": "積",
    "称": "稱",
    "秽": "穢",
    "税": "稅",
    "稣": "穌",
    "稭": "秸",
    "稳": "穩",
    "穑": "穡",
    "穷": "窮",
    "窃": "竊",
    "窍": "竅",
    "窎": "窵",
    "窑": "窯",
    "窜": "竄",
    "窝": "窩",
    "窥": "窺",
    "窦": "竇",
    "窭": "窶",
    "竖": "豎",
    "竞": "競",
    "笃": "篤",
    "笋": "筍",
    "笔": "筆",
    "笕": "筧",
    "笺": "箋",
    "笼": "籠",
    "笾": "籩",
    "筑": "築",
    "筚": "篳",
    "筛": "篩",
    "筝": "箏",
    "筹": "籌",
    "签": "簽",
    "简": "簡",
    "箓": "籙",
    "箦": "簀",
    "箧": "篋",
    "箨": "籜",
    "箩": "籮",
    "箪": "簞",
    "箫": "簫",
    "篑": "簣",
    "篓": "簍",
    "篮": "籃",
    "篱": "籬",
    "簖": "籪",
    "籁": "籟",
    "籴": "糴",
    "类": "類",
    "籼": "秈",
    "粜": "糶",
    "粝": "糲",
    "粤": "粵",
    "粪": "糞",
    "粮": "糧",
    "糁": "糝",
    "糇": "餱",
    "糍": "餈",
    "紥": "紮",
    "紧": "緊",
    "絷": "縶",
    "綫": "線",
    "纠": "糾",
    "纡": "紆",
    "红": "紅",
    "纣": "紂",
    "纤": "纖",
    "纥": "紇",
    "约": "約",
    "级": "級",
    "纨": "紈",
    "纩": "纊",
    "纪": "紀",
    "纫": "紉",
    "纬": "緯",
    "纭": "紜",
    "纮": "紘",
    "纯": "純",
    "纰": "紕",
    "纱": "紗",
    "纲": "綱",
    "纳": "納",
    "纴": "紝",
    "纵": "縱",
    "纶": "綸",
    "纷": "紛",
    "纸": "紙",
    "纹": "紋",
    "纺": "紡",
    "纼": "紖",
    "纽": "紐",
    "纾": "紓",
    "线": "線",
    "绀": "紺",
    "绁": "紲",
    "绂": "紱",
    "练": "練",
    "组": "組",
    "绅": "紳",
    "细": "細",
    "织": "織",
    "终": "終",
    "绉": "縐",
    "绊": "絆",
    "绋": "紼",
    "绌": "絀",
    "绍": "紹",
    "绎": "繹",
    "经": "經",
    "绐": "紿",
    "绑": "綁",
    "绒": "絨",
    "结": "結",
    "绔": "絝",
    "绕": "繞",
    "绖": "絰",
    "绗": "絎",
    "绘": "繪",
    "给": "給",
    "绚": "絢",
    "绛": "絳",
    "络": "絡",
    "绝": "絕",
    "绞": "絞",
    "统": "統",
    "绠": "綆",
    "绡": "綃",
    "绢": "絹",
    "绣": "繡",
    "绥": "綏",
    "绦": "絛",
    "继": "繼",
    "绨": "綈",
    "绩": "績",
    "绪": "緒",
    "绫": "綾",
    "续": "續",
    "绮": "綺",
    "绯": "緋",
    "绰": "綽",
    "绱": "緔",
    "绲": "緄",
    "绳": "繩",
    "维": "維",
    "绵": "綿",
    "绶": "綬",
    "绷": "繃",
    "绸": "綢",
    "绺": "綹",
    "绻": "綣",
    "综": "綜",
    "绽": "綻",
    "绾": "綰",
    "绿": "綠",
    "缀": "綴",
    "缁": "緇",
    "缂": "緙",
    "缃": "緗",
    "缄": "緘",
    "缅": "緬",
    "缆": "纜",
    "缇": "緹",
    "缈": "緲",
    "缉": "緝",
    "缊": "縕",
    "缋": "繢",
    "缌": "緦",
    "缍": "綞",
    "缎": "緞",
    "缏": "緶",
    "缑": "緱",
    "缒": "縋",
    "缓": "緩",
    "缔": "締",
    "缕": "縷",
    "编": "編",
    "缗": "緡",
    "缘": "緣",
    "缙": "縉",
    "缚": "縛",
    "缛": "縟",
    "缜": "縝",
    "缝": "縫",
    "缞": "縗",
    "缟": "縞",
    "缠": "纏",
    "缡": "縭",
    "缢": "縊",
    "缣": "縑",
    "缤": "繽",
    "缥": "縹",
    "缦": "縵",
    "缧": "縲",
    "缨": "纓",
    "缩": "縮",
    "缪": "繆",
    "缫": "繅",
    "缬": "纈",
    "缭": "繚",
    "缮": "繕",
    "缯": "繒",
    "缰": "韁",
    "缱": "繾",
    "缲": "繰",
    "缳": "繯",
    "缴": "繳",
    "缵": "纘",
    "罂": "罌",
    "罎": "罈",
    "网": "網",
    "罗": "羅",
    "罚": "罰",
    "罢": "罷",
    "罴": "羆",
    "羁": "羈",
    "羟": "羥",
    "羡": "羨",
    "翘": "翹",
    "翚": "翬",
    "耢": "耮",
    "耧": "耬",
    "耸": "聳",
    "耻": "恥",
    "聂": "聶",
    "聋": "聾",
    "职": "職",
    "聍": "聹",
    "联": "聯",
    "聩": "聵",
    "聪": "聰",
    "肀": "聿",
    "肃": "肅",
    "肠": "腸",
    "肤": "膚",
    "肮": "骯",
    "肾": "腎",
    "肿": "腫",
    "胀": "脹",
    "胁": "脅",
    "胆": "膽",
    "胜": "勝",
    "胧": "朧",
    "胨": "腖",
    "胪": "臚",
    "胫": "脛",
    "胶": "膠",
    "脉": "脈",
    "脍": "膾",
    "脏": "髒",
    "脐": "臍",
    "脑": "腦",
    "脓": "膿",
    "脔": "臠",
    "脚": "腳",
    "脣": "唇",
    "脩": "修",
    "脱": "脫",
    "脶": "腡",
    "脸": "臉",
    "腊": "臘",
    "腌": "醃",
    "腘": "膕",
    "腭": "顎",
    "腻": "膩",
    "腼": "靦",
    "腽": "膃",
    "腾": "騰",
    "膑": "臏",
    "膻": "羶",
    "臜": "臢",
    "舆": "輿",
    "舣": "艤",
    "舰": "艦",
    "舱": "艙",
    "舻": "艫",
    "艰": "艱",
    "艳": "豔",
    "艺": "藝",
    "节": "節",
    "芈": "羋",
    "芗": "薌",
    "芜": "蕪",
    "芦": "蘆",
    "苁": "蓯",
    "苇": "葦",
    "苈": "藶",
    "苋": "莧",
    "苌": "萇",
    "苍": "蒼",
    "苎": "苧",
    "苏": "蘇",
    "苹": "蘋",
    "茎": "莖",
    "茏": "蘢",
    "茑": "蔦",
    "茔": "塋",
    "茕": "煢",
    "茧": "繭",
    "荆": "荊",
    "荐": "薦",
    "荚": "莢",
    "荛": "蕘",
    "荜": "蓽",
    "荞": "蕎",
    "荟": "薈",
    "荠": "薺",
    "荡": "蕩",
    "荣": "榮",
    "荤": "葷",
    "荥": "滎",
    "荦": "犖",
    "荧": "熒",
    "荨": "蕁",
    "荩": "藎",
    "荪": "蓀",
    "荫": "蔭",
    "荬": "蕒",
    "荭": "葒",
    "荮": "葤",
    "药": "藥",
    "莅": "蒞",
    "莱": "萊",
    "莲": "蓮",
    "莳": "蒔",
    "莴": "萵",
    "莶": "薟",
    "获": "獲",
    "莸": "蕕",
    "莹": "瑩",
    "莺": "鶯",
    "莼": "蓴",
    "萚": "蘀",
    "萝": "蘿",
    "萤": "螢",
    "营": "營",
    "萦": "縈",
    "萧": "蕭",
    "萨": "薩",
    "著": "著",
    "葯": "藥",
    "葱": "蔥",
    "蒇": "蕆",
    "蒉": "蕢",
    "蒋": "蔣",
    "蒌": "蔞",
    "蓝": "藍",
    "蓟": "薊",
    "蓠": "蘺",
    "蓣": "蕷",
    "蓥": "鎣",
    "蓦": "驀",
    "蔴": "麻",
    "蔷": "薔",
    "蔹": "蘞",
    "蔺": "藺",
    "蔼": "藹",
    "蕲": "蘄",
    "蕴": "蘊",
    "薮": "藪",
    "藓": "蘚",
    "蘖": "蘗",
    "虏": "虜",
    "虑": "慮",
    "虚": "虛",
    "虫": "蟲",
    "虬": "虯",
    "虮": "蟣",
    "虱": "蝨",
    "虽": "雖",
    "虾": "蝦",
    "虿": "蠆",
    "蚀": "蝕",
    "蚁": "蟻",
    "蚂": "螞",
    "蚕": "蠶",
    "蚬": "蜆",
    "蛊": "蠱",
    "蛎": "蠣",
    "蛏": "蟶",
    "蛮": "蠻",
    "蛰": "蟄",
    "蛱": "蛺",
    "蛲": "蟯",
    "蛳": "螄",
    "蛴": "蠐",
    "蜕": "蛻",
    "蜗": "蝸",
    "蜡": "蠟",
    "蝇": "蠅",
    "蝈": "蟈",
    "蝉": "蟬",
    "蝎": "蠍",
    "蝰": "虺",
    "蝼": "螻",
    "蝾": "蠑",
    "螨": "蟎",
    "蟏": "蠨",
    "蟮": "蟺",
    "衅": "釁",
    "衆": "眾",
    "衔": "銜",
    "补": "補",
    "衬": "襯",
    "衮": "袞",
    "袄": "襖",
    "袅": "裊",
    "袜": "襪",
    "袭": "襲",
    "装": "裝",
    "裆": "襠",
    "裏": "裡",
    "裢": "褳",
    "裣": "襝",
    "裤": "褲",
    "裥": "襉",
    "褛": "褸",
    "褴": "襤",
    "见": "見",
    "观": "觀",
    "觃": "覎",
    "规": "規",
    "觅": "覓",
    "视": "視",
    "觇": "覘",
    "览": "覽",
    "觉": "覺",
    "觊": "覬",
    "觋": "覡",
    "觌": "覿",
    "觎": "覦",
    "觏": "覯",
    "觐": "覲",
    "觑": "覷",
    "觞": "觴",
    "触": "觸",
    "觯": "觶",
    "証": "證",
    "誉": "譽",
    "誊": "謄",
    "计": "計",
    "订": "訂",
    "讣": "訃",
    "认": "認",
    "讥": "譏",
    "讦": "訐",
    "讧": "訌",
    "讨": "討",
    "让": "讓",
    "讪": "訕",
    "讫": "訖",
    "训": "訓",
    "议": "議",
    "讯": "訊",
    "记": "記",
    "讲": "講",
    "讳": "諱",
    "讴": "謳",
    "讵": "詎",
    "讶": "訝",
    "讷": "訥",
    "许": "許",
    "讹": "訛",
    "论": "論",
    "讻": "訩",
    "讼": "訟",
    "讽": "諷",
    "设": "設",
    "访": "訪",
    "诀": "訣",
    "证": "證",
    "诂": "詁",
    "诃": "訶",
    "评": "評",
    "诅": "詛",
    "识": "識",
    "诇": "詗",
    "诈": "詐",
    "诉": "訴",
    "诊": "診",
    "诋": "詆",
    "诌": "謅",
    "词": "詞",
    "诎": "詘",
    "诏": "詔",
    "译": "譯",
    "诒": "詒",
    "诓": "誆",
    "诔": "誄",
    "试": "試",
    "诖": "詿",
    "诗": "詩",
    "诘": "詰",
    "诙": "詼",
    "诚": "誠",
    "诛": "誅",
    "诜": "詵",
    "话": "話",
    "诞": "誕",
    "诟": "詬",
    "诠": "詮",
    "诡": "詭",
    "询": "詢",
    "诣": "詣",
    "诤": "諍",
    "该": "該",
    "详": "詳",
    "诧": "詫",
    "诨": "諢",
    "诩": "詡",
    "诫": "誡",
    "诬": "誣",
    "语": "語",
    "诮": "誚",
    "误": "誤",
    "诰": "誥",
    "诱": "誘",
    "诲": "誨",
    "诳": "誑",
    "说": "說",
    "诵": "誦",
    "诶": "誒",
    "请": "請",
    "诸": "諸",
    "诹": "諏",
    "诺": "諾",
    "读": "讀",
    "诼": "諑",
    "诽": "誹",
    "课": "課",
    "诿": "諉",
    "谀": "諛",
    "谁": "誰",
    "谂": "諗",
    "调": "調",
    "谄": "諂",
    "谅": "諒",
    "谆": "諄",
    "谇": "誶",
    "谈": "談",
    "谉": "讅",
    "谊": "誼",
    "谋": "謀",
    "谌": "諶",
    "谍": "諜",
    "谎": "謊",
    "谏": "諫",
    "谐": "諧",
    "谑": "謔",
    "谒": "謁",
    "谓": "謂",
    "谔": "諤",
    "谕": "諭",
    "谖": "諼",
    "谗": "讒",
    "谘": "諮",
    "谙": "諳",
    "谚": "諺",
    "谛": "諦",
    "谜": "謎",
    "谝": "諞",
    "谞": "諝",
    "谟": "謨",
    "谠": "讜",
    "谡": "謖",
    "谢": "謝",
    "谣": "謠",
    "谤": "謗",
    "谥": "謚",
    "谦": "謙",
    "谧": "謐",
    "谨": "謹",
    "谩": "謾",
    "谪": "謫",
    "谫": "譾",
    "谬": "謬",
    "谭": "譚",
    "谮": "譖",
    "谯": "譙",
    "谰": "讕",
    "谱": "譜",
    "谲": "譎",
    "谳": "讞",
    "谴": "譴",
    "谵": "譫",
    "谶": "讖",
    "豮": "豶",
    "贜": "贓",
    "贝": "貝",
    "贞": "貞",
    "负": "負",
    "贡": "貢",
    "财": "財",
    "责": "責",
    "贤": "賢",
    "败": "敗",
    "账": "賬",
    "货": "貨",
    "质": "質",
    "贩": "販",
    "贪": "貪",
    "贫": "貧",
    "贬": "貶",
    "购": "購",
    "贮": "貯",
    "贯": "貫",
    "贰": "貳",
    "贱": "賤",
    "贲": "賁",
    "贳": "貰",
    "贴": "貼",
    "贵": "貴",
    "贶": "貺",
    "贷": "貸",
    "贸": "貿",
    "费": "費",
    "贺": "賀",
    "贻": "貽",
    "贼": "賊",
    "贽": "贄",
    "贾": "賈",
    "贿": "賄",
    "赀": "貲",
    "赁": "賃",
    "赂": "賂",
    "赃": "贓",
    "资": "資",
    "赅": "賅",
    "赆": "贐",
    "赇": "賕",
    "赈": "賑",
    "赉": "賚",
    "赊": "賒",
    "赋": "賦",
    "赌": "賭",
    "赍": "齎",
    "赎": "贖",
    "赏": "賞",
    "赐": "賜",
    "赒": "賙",
    "赓": "賡",
    "赔": "賠",
    "赕": "賧",
    "赖": "賴",
    "赗": "賵",
    "赘": "贅",
    "赙": "賻",
    "赚": "賺",
    "赛": "賽",
    "赜": "賾",
    "赝": "贋",
    "赞": "贊",
    "赟": "贇",
    "赠": "贈",
    "赡": "贍",
    "赢": "贏",
    "赣": "贛",
    "赵": "趙",
    "赶": "趕",
    "趋": "趨",
    "趱": "趲",
    "趸": "躉",
    "跃": "躍",
    "跄": "蹌",
    "跞": "躒",
    "践": "踐",
    "跷": "蹺",
    "跸": "蹕",
    "跹": "躚",
    "跻": "躋",
    "踊": "踴",
    "踌": "躊",
    "踪": "蹤",
    "踬": "躓",
    "踯": "躑",
    "蹑": "躡",
    "蹒": "蹣",
    "蹰": "躕",
    "蹿": "躥",
    "躏": "躪",
    "躜": "躦",
    "躯": "軀",
    "躰": "體",
    "车": "車",
    "轧": "軋",
    "轨": "軌",
    "轩": "軒",
    "轫": "軔",
    "转": "轉",
    "轭": "軛",
    "轮": "輪",
    "软": "軟",
    "轰": "轟",
    "轱": "軲",
    "轲": "軻",
    "轳": "轤",
    "轴": "軸",
    "轵": "軹",
    "轶": "軼",
    "轷": "軤",
    "轸": "軫",
    "轹": "轢",
    "轺": "軺",
    "轻": "輕",
    "轼": "軾",
    "载": "載",
    "轾": "輊",
    "轿": "轎",
    "辁": "輇",
    "辂": "輅",
    "较": "較",
    "辄": "輒",
    "辅": "輔",
    "辆": "輛",
    "辇": "輦",
    "辈": "輩",
    "辉": "輝",
    "辊": "輥",
    "辋": "輞",
    "辍": "輟",
    "辎": "輜",
    "辏": "輳",
    "辐": "輻",
    "辑": "輯",
    "输": "輸",
    "辔": "轡",
    "辕": "轅",
    "辖": "轄",
    "辗": "輾",
    "辘": "轆",
    "辙": "轍",
    "辚": "轔",
    "辞": "辭",
    "辩": "辯",
    "辫": "辮",
    "边": "邊",
    "辽": "遼",
    "达": "達",
    "迁": "遷",
    "过": "過",
    "迈": "邁",
    "运": "運",
    "还": "還",
    "这": "這",
    "进": "進",
    "远": "遠",
    "违": "違",
    "连": "連",
    "迟": "遲",
    "迩": "邇",
    "迳": "逕",
    "迹": "跡",
    "适": "適",
    "选": "選",
    "逊": "遜",
    "递": "遞",
    "逦": "邐",
    "逻": "邏",
    "遗": "遺",
    "遥": "遙",
    "邓": "鄧",
    "邝": "鄺",
    "邬": "鄔",
    "邮": "郵",
    "邹": "鄒",
    "邺": "鄴",
    "邻": "鄰",
    "郃": "合",
    "郄": "隙",
    "郏": "郟",
    "郐": "鄶",
    "郑": "鄭",
    "郓": "鄆",
    "郦": "酈",
    "郧": "鄖",
    "郸": "鄲",
    "酝": "醞",
    "酱": "醬",
    "酽": "釅",
    "酾": "釃",
    "酿": "釀",
    "醖": "醞",
    "释": "釋",
    "里": "裡",
    "鈈": "鈽",
    "鈡": "鐘",
    "鉆": "鑽",
    "鉴": "鑑",
    "銮": "鑾",
    "銼": "剉",
    "鋻": "鑑",
    "錘": "鎚",
    "録": "錄",
    "錾": "鏨",
    "鑒": "鑑",
    "钆": "釓",
    "钇": "釔",
    "针": "針",
    "钉": "釘",
    "钊": "釗",
    "钋": "釙",
    "钌": "釕",
    "钍": "釷",
    "钎": "釺",
    "钏": "釧",
    "钐": "釤",
    "钒": "釩",
    "钓": "釣",
    "钔": "鍆",
    "钕": "釹",
    "钖": "鍚",
    "钗": "釵",
    "钘": "鈃",
    "钙": "鈣",
    "钚": "鈈",
    "钛": "鈦",
    "钜": "鉅",
    "钝": "鈍",
    "钞": "鈔",
    "钟": "鐘",
    "钠": "鈉",
    "钡": "鋇",
    "钢": "鋼",
    "钣": "鈑",
    "钤": "鈐",
    "钥": "鑰",
    "钦": "欽",
    "钧": "鈞",
    "钨": "鎢",
    "钩": "鉤",
    "钪": "鈧",
    "钫": "鈁",
    "钬": "鈥",
    "钭": "鈄",
    "钮": "鈕",
    "钯": "鈀",
    "钰": "鈺",
    "钱": "錢",
    "钲": "鉦",
    "钳": "鉗",
    "钴": "鈷",
    "钵": "缽",
    "钶": "鈳",
    "钷": "鉕",
    "钸": "鈽",
    "钹": "鈸",
    "钺": "鉞",
    "钻": "鑽",
    "钼": "鉬",
    "钽": "鉭",
    "钾": "鉀",
    "钿": "鈿",
    "铀": "鈾",
    "铁": "鐵",
    "铂": "鉑",
    "铃": "鈴",
    "铄": "鑠",
    "铅": "鉛",
    "铆": "鉚",
    "铈": "鈰",
    "铉": "鉉",
    "铊": "鉈",
    "铋": "鉍",
    "铌": "鈮",
    "铍": "鈹",
    "铎": "鐸",
    "铏": "鉶",
    "铐": "銬",
    "铑": "銠",
    "铒": "鉺",
    "铓": "鋩",
    "铕": "銪",
    "铖": "鋮",
    "铗": "鋏",
    "铘": "鋣",
    "铙": "鐃",
    "铛": "鐺",
    "铜": "銅",
    "铝": "鋁",
    "铞": "銱",
    "铟": "銦",
    "铠": "鎧",
    "铡": "鍘",
    "铢": "銖",
    "铣": "銑",
    "铤": "鋌",
    "铥": "銩",
    "铧": "鏵",
    "铨": "銓",
    "铩": "鎩",
    "铪": "鉿",
    "铫": "銚",
    "铬": "鉻",
    "铭": "銘",
    "铮": "錚",
    "铯": "銫",
    "铰": "鉸",
    "铱": "銥",
    "铲": "鏟",
    "铳": "銃",
    "铴": "鐋",
    "铵": "銨",
    "银": "銀",
    "铷": "銣",
    "铸": "鑄",
    "铹": "鐒",
    "铺": "鋪",
    "铼": "錸",
    "铽": "鋱",
    "链": "鏈",
    "铿": "鏗",
    "销": "銷",
    "锁": "鎖",
    "锂": "鋰",
    "锃": "鋥",
    "锄": "鋤",
    "锅": "鍋",
    "锆": "鋯",
    "锇": "鋨",
    "锈": "鏽",
    "锉": "銼",
    "锊": "鋝",
    "锋": "鋒",
    "锌": "鋅",
    "锍": "鋶",
    "锎": "鐦",
    "锏": "鐧",
    "锐": "銳",
    "锑": "銻",
    "锒": "鋃",
    "锓": "鋟",
    "锔": "鋦",
    "锕": "錒",
    "锖": "錆",
    "锗": "鍺",
    "锘": "鍩",
    "错": "錯",
    "锚": "錨",
    "锛": "錛",
    "锜": "錡",
    "锝": "鍀",
    "锞": "錁",
    "锟": "錕",
    "锡": "錫",
    "锢": "錮",
    "锣": "鑼",
    "锤": "錘",
    "锥": "錐",
    "锦": "錦",
    "锧": "鑕",
    "锨": "鍁",
    "锩": "錈",
    "锪": "鍃",
    "锫": "錇",
    "锬": "錟",
    "锭": "錠",
    "键": "鍵",
    "锯": "鋸",
    "锰": "錳",
    "锱": "錙",
    "锲": "鍥",
    "锴": "鍇",
    "锵": "鏘",
    "锶": "鍶",
    "锷": "鍔",
    "锸": "鍤",
    "锹": "鍬",
    "锺": "鍾",
    "锻": "鍛",
    "锼": "鎪",
    "锾": "鍰",
    "锿": "鎄",
    "镀": "鍍",
    "镁": "鎂",
    "镂": "鏤",
    "镃": "鎡",
    "镄": "鐨",
    "镅": "鎇",
    "镆": "鏌",
    "镇": "鎮",
    "镉": "鎘",
    "镊": "鑷",
    "镋": "钂",
    "镌": "鐫",
    "镍": "鎳",
    "镎": "鎿",
    "镏": "鎦",
    "镐": "鎬",
    "镑": "鎊",
    "镒": "鎰",
    "镓": "鎵",
    "镔": "鑌",
    "镕": "鎔",
    "镖": "鏢",
    "镗": "鏜",
    "镘": "鏝",
    "镙": "鏍",
    "镚": "鏰",
    "镛": "鏞",
    "镜": "鏡",
    "镝": "鏑",
    "镞": "鏃",
    "镟": "鏇",
    "镡": "鐔",
    "镢": "鐝",
    "镣": "鐐",
    "镤": "鏷",
    "镥": "鑥",
    "镦": "鐓",
    "镧": "鑭",
    "镨": "鐠",
    "镩": "鑹",
    "镪": "鏹",
    "镫": "鐙",
    "镬": "鑊",
    "镭": "鐳",
    "镮": "鐶",
    "镯": "鐲",
    "镰": "鐮",
    "镱": "鐿",
    "镲": "鑔",
    "镳": "鑣",
    "镴": "鑞",
    "镶": "鑲",
    "长": "長",
    "閑": "閒",
    "閧": "鬨",
    "门": "門",
    "闩": "閂",
    "闪": "閃",
    "闫": "閆",
    "闭": "閉",
    "问": "問",
    "闯": "闖",
    "闰": "閏",
    "闱": "闈",
    "闲": "閒",
    "闳": "閎",
    "间": "間",
    "闵": "閔",
    "闶": "閌",
    "闷": "悶",
    "闸": "閘",
    "闹": "鬧",
    "闺": "閨",
    "闻": "聞",
    "闼": "闥",
    "闽": "閩",
    "闾": "閭",
    "闿": "闓",
    "阀": "閥",
    "阁": "閣",
    "阂": "閡",
    "阃": "閫",
    "阄": "鬮",
    "阅": "閱",
    "阆": "閬",
    "阈": "閾",
    "阉": "閹",
    "阊": "閶",
    "阋": "鬩",
    "阌": "閿",
    "阍": "閽",
    "阎": "閻",
    "阏": "閼",
    "阐": "闡",
    "阑": "闌",
    "阒": "闃",
    "阔": "闊",
    "阕": "闋",
    "阖": "闔",
    "阗": "闐",
    "阙": "闕",
    "阚": "闞",
    "队": "隊",
    "阳": "陽",
    "阴": "陰",
    "阵": "陣",
    "阶": "階",
    "际": "際",
    "陆": "陸",
    "陇": "隴",
    "陈": "陳",
    "陉": "陘",
    "陕": "陝",
    "陧": "隉",
    "陨": "隕",
    "险": "險",
    "随": "隨",
    "隐": "隱",
    "隶": "隸",
    "隽": "雋",
    "难": "難",
    "雏": "雛",
    "雠": "讎",
    "雳": "靂",
    "雾": "霧",
    "霁": "霽",
    "霉": "黴",
    "霭": "靄",
    "靓": "靚",
    "静": "靜",
    "靣": "面",
    "靥": "靨",
    "鞑": "韃",
    "鞒": "橇",
    "鞯": "韉",
    "韦": "韋",
    "韧": "韌",
    "韨": "韍",
    "韩": "韓",
    "韪": "韙",
    "韫": "韞",
    "韬": "韜",
    "韵": "韻",
    "页": "頁",
    "顶": "頂",
    "顷": "頃",
    "顸": "頇",
    "项": "項",
    "顺": "順",
    "须": "須",
    "顼": "頊",
    "顽": "頑",
    "顾": "顧",
    "顿": "頓",
    "颀": "頎",
    "颁": "頒",
    "颂": "頌",
    "颃": "頏",
    "预": "預",
    "颅": "顱",
    "领": "領",
    "颇": "頗",
    "颈": "頸",
    "颉": "頡",
    "颊": "頰",
    "颋": "頲",
    "颌": "頜",
    "颍": "潁",
    "颏": "頦",
    "颐": "頤",
    "频": "頻",
    "颓": "頹",
    "颔": "頷",
    "颖": "穎",
    "颗": "顆",
    "题": "題",
    "颙": "顒",
    "颚": "顎",
    "颛": "顓",
    "颜": "顏",
    "额": "額",
    "颞": "顳",
    "颟": "顢",
    "颠": "顛",
    "颡": "顙",
    "颢": "顥",
    "颤": "顫",
    "颥": "顬",
    "颦": "顰",
    "颧": "顴",
    "风": "風",
    "飑": "颮",
    "飒": "颯",
    "飓": "颶",
    "飔": "颸",
    "飕": "颼",
    "飗": "飀",
    "飘": "飄",
    "飙": "飆",
    "飚": "飈",
    "飞": "飛",
    "飨": "饗",
    "餍": "饜",
    "饥": "飢",
    "饦": "飥",
    "饧": "餳",
    "饨": "飩",
    "饩": "餼",
    "饪": "飪",
    "饫": "飫",
    "饬": "飭",
    "饭": "飯",
    "饮": "飲",
    "饯": "餞",
    "饰": "飾",
    "饱": "飽",
    "饲": "飼",
    "饳": "飿",
    "饴": "飴",
    "饵": "餌",
    "饶": "饒",
    "饷": "餉",
    "饸": "餄",
    "饹": "餎",
    "饺": "餃",
    "饻": "餏",
    "饼": "餅",
    "饽": "餑",
    "饿": "餓",
    "馀": "餘",
    "馁": "餒",
    "馃": "餜",
    "馄": "餛",
    "馅": "餡",
    "馆": "館",
    "馇": "餷",
    "馈": "饋",
    "馉": "餶",
    "馊": "餿",
    "馋": "饞",
    "馍": "饃",
    "馎": "餺",
    "馏": "餾",
    "馐": "饈",
    "馑": "饉",
    "馒": "饅",
    "馓": "饊",
    "馔": "饌",
    "馕": "饟",
    "騃": "呆",
    "马": "馬",
    "驭": "馭",
    "驮": "馱",
    "驯": "馴",
    "驰": "馳",
    "驱": "驅",
    "驳": "駁",
    "驴": "驢",
    "驵": "駔",
    "驶": "駛",
    "驷": "駟",
    "驸": "駙",
    "驹": "駒",
    "驺": "騶",
    "驻": "駐",
    "驼": "駝",
    "驽": "駑",
    "驾": "駕",
    "驿": "驛",
    "骀": "駘",
    "骁": "驍",
    "骂": "罵",
    "骄": "驕",
    "骅": "驊",
    "骆": "駱",
    "骇": "駭",
    "骈": "駢",
    "骊": "驪",
    "骋": "騁",
    "验": "驗",
    "骎": "駸",
    "骏": "駿",
    "骐": "騏",
    "骑": "騎",
    "骒": "騍",
    "骓": "騅",
    "骖": "驂",
    "骗": "騙",
    "骘": "騭",
    "骚": "騷",
    "骛": "騖",
    "骜": "驁",
    "骝": "騮",
    "骞": "騫",
    "骟": "騸",
    "骠": "驃",
    "骡": "騾",
    "骢": "驄",
    "骣": "驏",
    "骤": "驟",
    "骥": "驥",
    "骧": "驤",
    "髅": "髏",
    "髋": "髖",
    "髌": "髕",
    "鬓": "鬢",
    "魇": "魘",
    "魉": "魎",
    "鱼": "魚",
    "鱽": "魛",
    "鱿": "魷",
    "鲁": "魯",
    "鲂": "魴",
    "鲅": "鮁",
    "鲆": "鮃",
    "鲇": "鯰",
    "鲈": "鱸",
    "鲊": "鮓",
    "鲋": "鮒",
    "鲍": "鮑",
    "鲎": "鱟",
    "鲏": "鮍",
    "鲐": "鮐",
    "鲑": "鮭",
    "鲒": "鮚",
    "鲔": "鮪",
    "鲕": "鮞",
    "鲖": "鮦",
    "鲗": "鰂",
    "鲙": "鱠",
    "鲚": "鱭",
    "鲛": "鮫",
    "鲜": "鮮",
    "鲝": "鮺",
    "鲞": "鯗",
    "鲟": "鱘",
    "鲠": "鯁",
    "鲡": "鱺",
    "鲢": "鰱",
    "鲣": "鰹",
    "鲤": "鯉",
    "鲥": "鰣",
    "鲦": "鰷",
    "鲧": "鯀",
    "鲨": "鯊",
    "鲩": "鯇",
    "鲫": "鯽",
    "鲭": "鯖",
    "鲮": "鯪",
    "鲰": "鯫",
    "鲱": "鯡",
    "鲲": "鯤",
    "鲳": "鯧",
    "鲴": "鯝",
    "鲵": "鯢",
    "鲶": "鯰",
    "鲷": "鯛",
    "鲸": "鯨",
    "鲺": "鯴",
    "鲻": "鯔",
    "鲼": "鱝",
    "鲽": "鰈",
    "鲿": "鱨",
    "鳁": "鰛",
    "鳃": "鰓",
    "鳄": "鱷",
    "鳅": "鰍",
    "鳆": "鰒",
    "鳇": "鰉",
    "鳊": "鯿",
    "鳋": "鰠",
    "鳌": "鰲",
    "鳍": "鰭",
    "鳎": "鰨",
    "鳏": "鰥",
    "鳐": "鰩",
    "鳑": "鰟",
    "鳒": "鰜",
    "鳓": "鰳",
    "鳔": "鰾",
    "鳕": "鱈",
    "鳖": "鱉",
    "鳗": "鰻",
    "鳘": "鰵",
    "鳙": "鱅",
    "鳛": "鰼",
    "鳜": "鱖",
    "鳝": "鱔",
    "鳞": "鱗",
    "鳟": "鱒",
    "鳢": "鱧",
    "鳣": "鱣",
    "鶏": "雞",
    "鷄": "雞",
    "鸟": "鳥",
    "鸠": "鳩",
    "鸡": "雞",
    "鸢": "鳶",
    "鸣": "鳴",
    "鸥": "鷗",
    "鸦": "鴉",
    "鸧": "鶬",
    "鸨": "鴇",
    "鸩": "鴆",
    "鸪": "鴣",
    "鸫": "鶇",
    "鸬": "鸕",
    "鸭": "鴨",
    "鸮": "鴞",
    "鸯": "鴦",
    "鸰": "鴒",
    "鸱": "鴟",
    "鸲": "鴝",
    "鸳": "鴛",
    "鸵": "鴕",
    "鸶": "鷥",
    "鸷": "鷙",
    "鸸": "鴯",
    "鸹": "鴰",
    "鸺": "鵂",
    "鸻": "鴴",
    "鸼": "鵃",
    "鸽": "鴿",
    "鸾": "鸞",
    "鸿": "鴻",
    "鹁": "鵓",
    "鹂": "鸝",
    "鹃": "鵑",
    "鹄": "鵠",
    "鹅": "鵝",
    "鹆": "鵒",
    "鹇": "鷴",
    "鹈": "鵜",
    "鹉": "鵡",
    "鹊": "鵲",
    "鹋": "鶓",
    "鹌": "鵪",
    "鹎": "鵯",
    "鹏": "鵬",
    "鹐": "鵮",
    "鹑": "鶉",
    "鹒": "鶊",
    "鹕": "鶘",
    "鹖": "鶡",
    "鹗": "鶚",
    "鹘": "鶻",
    "鹙": "鶖",
    "鹚": "鶿",
    "鹛": "鶥",
    "鹜": "鶩",
    "鹞": "鷂",
    "鹡": "鶺",
    "鹣": "鶼",
    "鹤": "鶴",
    "鹥": "鷖",
    "鹦": "鸚",
    "鹧": "鷓",
    "鹨": "鷚",
    "鹩": "鷯",
    "鹪": "鷦",
    "鹫": "鷲",
    "鹬": "鷸",
    "鹭": "鷺",
    "鹯": "鸇",
    "鹰": "鷹",
    "鹱": "鸌",
    "鹳": "鸛",
    "鹾": "鹺",
    "麦": "麥",
    "麸": "麩",
    "麽": "麼",
    "黄": "黃",
    "黉": "黌",
    "黡": "黶",
    "黩": "黷",
    "黪": "黲",
    "黾": "黽",
    "鼋": "黿",
    "鼍": "鼉",
    "鼹": "鼴",
    "齐": "齊",
    "齑": "齏",
    "齶": "顎",
    "齿": "齒",
    "龀": "齔",
    "龃": "齟",
    "龄": "齡",
    "龅": "齙",
    "龆": "齠",
    "龇": "齜",
    "龈": "齦",
    "龉": "齬",
    "龊": "齪",
    "龋": "齲",
    "龌": "齷",
    "龙": "龍",
    "龚": "龔",
    "龛": "龕",
    "龟": "龜",
    "": "　"
  };
  function tify(text) {
    const isString2 = typeof text === "string";
    if (!isString2) {
      console.error(
        "The expected text signature is undefined | null | string, but an unexpected value was passed in:",
        typeof text
      );
    }
    let $$text = isString2 ? text : "";
    $$text = ($$text == null ? void 0 : $$text.replace(/[^\x00-\xFF]/g, replaceFn$1)) || "";
    return $$text;
  }
  function replaceFn$1(char) {
    if (char in s_2_t) {
      return s_2_t[char];
    }
    return char;
  }
  const t_2_s = {
    "¯": "ˉ",
    "‥": "¨",
    "‧": "·",
    "‵": "｀",
    "≒": "≈",
    "≦": "≤",
    "≧": "≥",
    "╱": "／",
    "╲": "＼",
    "╴": "＿",
    "「": "“",
    "」": "”",
    "『": "‘",
    "』": "’",
    "㑳": "㑇",
    "㘚": "㘎",
    "㥮": "㤘",
    "㩳": "㧐",
    "䎱": "䎬",
    "䙡": "䙌",
    "䝼": "䞍",
    "䥇": "䦂",
    "䦛": "䦶",
    "䦟": "䦷",
    "䱷": "䲣",
    "丟": "丢",
    "並": "并",
    "丼": "井",
    "乾": "干",
    "亂": "乱",
    "亙": "亘",
    "亞": "亚",
    "伕": "夫",
    "佇": "伫",
    "佈": "布",
    "佔": "占",
    "佪": "徊",
    "併": "并",
    "來": "来",
    "侖": "仑",
    "侚": "徇",
    "侶": "侣",
    "侷": "局",
    "俁": "俣",
    "係": "系",
    "俠": "侠",
    "倀": "伥",
    "倆": "俩",
    "倉": "仓",
    "個": "个",
    "們": "们",
    "倖": "幸",
    "倣": "仿",
    "倫": "伦",
    "偉": "伟",
    "偪": "逼",
    "側": "侧",
    "偵": "侦",
    "偺": "咱",
    "偽": "伪",
    "傑": "杰",
    "傖": "伧",
    "傘": "伞",
    "備": "备",
    "傚": "效",
    "傢": "家",
    "傭": "佣",
    "傯": "偬",
    "傳": "传",
    "傴": "伛",
    "債": "债",
    "傷": "伤",
    "傾": "倾",
    "僂": "偻",
    "僅": "仅",
    "僉": "佥",
    "僊": "仙",
    "僑": "侨",
    "僕": "仆",
    "僞": "伪",
    "僣": "僭",
    "僥": "侥",
    "僨": "偾",
    "僱": "雇",
    "價": "价",
    "儀": "仪",
    "儂": "侬",
    "億": "亿",
    "儅": "当",
    "儈": "侩",
    "儉": "俭",
    "儐": "傧",
    "儔": "俦",
    "儕": "侪",
    "儘": "尽",
    "償": "偿",
    "優": "优",
    "儲": "储",
    "儷": "俪",
    "儸": "罗",
    "儺": "傩",
    "儻": "傥",
    "儼": "俨",
    "兇": "凶",
    "兌": "兑",
    "兒": "儿",
    "兗": "兖",
    "內": "内",
    "兩": "两",
    "冊": "册",
    "冑": "胄",
    "冪": "幂",
    "凅": "涸",
    "凈": "净",
    "凍": "冻",
    "凜": "凛",
    "凱": "凯",
    "別": "别",
    "刪": "删",
    "剄": "刭",
    "則": "则",
    "剉": "锉",
    "剋": "克",
    "剎": "刹",
    "剗": "刬",
    "剛": "刚",
    "剝": "剥",
    "剮": "剐",
    "剴": "剀",
    "創": "创",
    "剷": "铲",
    "劃": "划",
    "劄": "札",
    "劇": "剧",
    "劉": "刘",
    "劊": "刽",
    "劌": "刿",
    "劍": "剑",
    "劑": "剂",
    "劻": "匡",
    "勁": "劲",
    "動": "动",
    "勗": "勖",
    "務": "务",
    "勛": "勋",
    "勝": "胜",
    "勞": "劳",
    "勢": "势",
    "勣": "绩",
    "勦": "剿",
    "勩": "勚",
    "勱": "劢",
    "勳": "勋",
    "勵": "励",
    "勸": "劝",
    "勻": "匀",
    "匋": "陶",
    "匭": "匦",
    "匯": "汇",
    "匱": "匮",
    "區": "区",
    "卄": "廿",
    "協": "协",
    "卬": "昂",
    "卹": "恤",
    "卻": "却",
    "厙": "厍",
    "厭": "厌",
    "厲": "厉",
    "厴": "厣",
    "參": "参",
    "叡": "睿",
    "叢": "丛",
    "吋": "寸",
    "后": "后",
    "吳": "吴",
    "吶": "呐",
    "呂": "吕",
    "呎": "尺",
    "咷": "啕",
    "咼": "呙",
    "員": "员",
    "唄": "呗",
    "唝": "嗊",
    "唸": "念",
    "問": "问",
    "啓": "启",
    "啗": "啖",
    "啞": "哑",
    "啟": "启",
    "啢": "唡",
    "啣": "衔",
    "喎": "㖞",
    "喚": "唤",
    "喪": "丧",
    "喫": "吃",
    "喬": "乔",
    "單": "单",
    "喲": "哟",
    "嗆": "呛",
    "嗇": "啬",
    "嗎": "吗",
    "嗚": "呜",
    "嗩": "唢",
    "嗶": "哔",
    "嘆": "叹",
    "嘍": "喽",
    "嘔": "呕",
    "嘖": "啧",
    "嘗": "尝",
    "嘜": "唛",
    "嘩": "哗",
    "嘮": "唠",
    "嘯": "啸",
    "嘰": "叽",
    "嘵": "哓",
    "嘸": "呒",
    "噁": "恶",
    "噓": "嘘",
    "噝": "咝",
    "噠": "哒",
    "噥": "哝",
    "噦": "哕",
    "噯": "嗳",
    "噲": "哙",
    "噴": "喷",
    "噸": "吨",
    "噹": "当",
    "嚀": "咛",
    "嚇": "吓",
    "嚌": "哜",
    "嚐": "尝",
    "嚕": "噜",
    "嚙": "啮",
    "嚥": "咽",
    "嚦": "呖",
    "嚨": "咙",
    "嚮": "向",
    "嚳": "喾",
    "嚴": "严",
    "嚶": "嘤",
    "囀": "啭",
    "囁": "嗫",
    "囂": "嚣",
    "囅": "冁",
    "囈": "呓",
    "囉": "啰",
    "囌": "苏",
    "囑": "嘱",
    "囓": "啮",
    "囪": "囱",
    "圇": "囵",
    "國": "国",
    "圍": "围",
    "圏": "圈",
    "園": "园",
    "圓": "圆",
    "圖": "图",
    "團": "团",
    "坵": "丘",
    "埜": "野",
    "埡": "垭",
    "執": "执",
    "埼": "崎",
    "堅": "坚",
    "堊": "垩",
    "堖": "垴",
    "堝": "埚",
    "堯": "尧",
    "報": "报",
    "場": "场",
    "塊": "块",
    "塋": "茔",
    "塏": "垲",
    "塒": "埘",
    "塗": "涂",
    "塚": "冢",
    "塢": "坞",
    "塤": "埙",
    "塵": "尘",
    "塹": "堑",
    "墊": "垫",
    "墑": "墒",
    "墜": "坠",
    "墫": "樽",
    "墮": "堕",
    "墳": "坟",
    "墻": "墙",
    "墾": "垦",
    "壇": "坛",
    "壎": "埙",
    "壓": "压",
    "壘": "垒",
    "壙": "圹",
    "壚": "垆",
    "壞": "坏",
    "壟": "垄",
    "壢": "坜",
    "壩": "坝",
    "壯": "壮",
    "壺": "壶",
    "壽": "寿",
    "夠": "够",
    "夢": "梦",
    "夾": "夹",
    "奐": "奂",
    "奧": "奥",
    "奩": "奁",
    "奪": "夺",
    "奮": "奋",
    "妝": "妆",
    "姍": "姗",
    "姦": "奸",
    "姪": "侄",
    "娛": "娱",
    "婁": "娄",
    "婦": "妇",
    "婬": "淫",
    "婭": "娅",
    "媧": "娲",
    "媮": "偷",
    "媯": "妫",
    "媼": "媪",
    "媽": "妈",
    "媿": "愧",
    "嫋": "袅",
    "嫗": "妪",
    "嫵": "妩",
    "嫻": "娴",
    "嫿": "婳",
    "嬈": "娆",
    "嬋": "婵",
    "嬌": "娇",
    "嬙": "嫱",
    "嬝": "袅",
    "嬡": "嫒",
    "嬤": "嬷",
    "嬪": "嫔",
    "嬭": "奶",
    "嬰": "婴",
    "嬸": "婶",
    "孃": "娘",
    "孌": "娈",
    "孫": "孙",
    "學": "学",
    "孿": "孪",
    "宮": "宫",
    "寘": "置",
    "寢": "寝",
    "實": "实",
    "寧": "宁",
    "審": "审",
    "寫": "写",
    "寬": "宽",
    "寵": "宠",
    "寶": "宝",
    "將": "将",
    "專": "专",
    "尋": "寻",
    "對": "对",
    "導": "导",
    "尷": "尴",
    "屆": "届",
    "屍": "尸",
    "屜": "屉",
    "屝": "扉",
    "屢": "屡",
    "層": "层",
    "屨": "屦",
    "屬": "属",
    "岡": "冈",
    "峴": "岘",
    "島": "岛",
    "峽": "峡",
    "崍": "崃",
    "崑": "昆",
    "崗": "岗",
    "崙": "仑",
    "崠": "岽",
    "崢": "峥",
    "崳": "嵛",
    "嵐": "岚",
    "嵒": "岩",
    "嶁": "嵝",
    "嶄": "崭",
    "嶇": "岖",
    "嶔": "嵚",
    "嶗": "崂",
    "嶠": "峤",
    "嶢": "峣",
    "嶧": "峄",
    "嶨": "峃",
    "嶸": "嵘",
    "嶺": "岭",
    "嶼": "屿",
    "嶽": "岳",
    "巋": "岿",
    "巒": "峦",
    "巔": "巅",
    "巖": "岩",
    "巰": "巯",
    "巹": "卺",
    "帥": "帅",
    "師": "师",
    "帳": "帐",
    "帶": "带",
    "幀": "帧",
    "幃": "帏",
    "幗": "帼",
    "幘": "帻",
    "幟": "帜",
    "幣": "币",
    "幫": "帮",
    "幬": "帱",
    "幵": "开",
    "幷": "并",
    "幹": "干",
    "幾": "几",
    "庂": "仄",
    "庫": "库",
    "廁": "厕",
    "廂": "厢",
    "廄": "厩",
    "廈": "厦",
    "廎": "庼",
    "廚": "厨",
    "廝": "厮",
    "廟": "庙",
    "廠": "厂",
    "廡": "庑",
    "廢": "废",
    "廣": "广",
    "廩": "廪",
    "廬": "庐",
    "廱": "痈",
    "廳": "厅",
    "弒": "弑",
    "弔": "吊",
    "弳": "弪",
    "張": "张",
    "強": "强",
    "彆": "别",
    "彈": "弹",
    "彌": "弥",
    "彎": "弯",
    "彙": "汇",
    "彚": "汇",
    "彥": "彦",
    "彫": "雕",
    "彿": "佛",
    "後": "后",
    "徑": "径",
    "從": "从",
    "徠": "徕",
    "復": "复",
    "徬": "旁",
    "徵": "征",
    "徹": "彻",
    "恆": "恒",
    "恥": "耻",
    "悅": "悦",
    "悵": "怅",
    "悶": "闷",
    "悽": "凄",
    "惇": "敦",
    "惡": "恶",
    "惱": "恼",
    "惲": "恽",
    "惷": "蠢",
    "惻": "恻",
    "愛": "爱",
    "愜": "惬",
    "愨": "悫",
    "愴": "怆",
    "愷": "恺",
    "愾": "忾",
    "慄": "栗",
    "慇": "殷",
    "態": "态",
    "慍": "愠",
    "慘": "惨",
    "慚": "惭",
    "慟": "恸",
    "慣": "惯",
    "慪": "怄",
    "慫": "怂",
    "慮": "虑",
    "慳": "悭",
    "慶": "庆",
    "慼": "戚",
    "慾": "欲",
    "憂": "忧",
    "憊": "惫",
    "憐": "怜",
    "憑": "凭",
    "憒": "愦",
    "憚": "惮",
    "憤": "愤",
    "憫": "悯",
    "憮": "怃",
    "憲": "宪",
    "憶": "忆",
    "懃": "勤",
    "懇": "恳",
    "應": "应",
    "懌": "怿",
    "懍": "懔",
    "懞": "蒙",
    "懟": "怼",
    "懣": "懑",
    "懨": "恹",
    "懲": "惩",
    "懶": "懒",
    "懷": "怀",
    "懸": "悬",
    "懺": "忏",
    "懼": "惧",
    "懾": "慑",
    "戀": "恋",
    "戇": "戆",
    "戉": "钺",
    "戔": "戋",
    "戧": "戗",
    "戩": "戬",
    "戰": "战",
    "戲": "戏",
    "戶": "户",
    "扐": "仂",
    "扞": "捍",
    "扱": "插",
    "扺": "抵",
    "抃": "拚",
    "抔": "抱",
    "抴": "曳",
    "拋": "抛",
    "拑": "钳",
    "挌": "格",
    "挶": "局",
    "挾": "挟",
    "捨": "舍",
    "捫": "扪",
    "捲": "卷",
    "掃": "扫",
    "掄": "抡",
    "掆": "㧏",
    "掗": "挜",
    "掙": "挣",
    "掛": "挂",
    "採": "采",
    "揀": "拣",
    "揚": "扬",
    "換": "换",
    "揮": "挥",
    "揹": "背",
    "搆": "构",
    "損": "损",
    "搖": "摇",
    "搗": "捣",
    "搟": "擀",
    "搥": "捶",
    "搨": "打",
    "搯": "掏",
    "搶": "抢",
    "搾": "榨",
    "摀": "捂",
    "摃": "扛",
    "摑": "掴",
    "摜": "掼",
    "摟": "搂",
    "摯": "挚",
    "摳": "抠",
    "摶": "抟",
    "摻": "掺",
    "撈": "捞",
    "撏": "挦",
    "撐": "撑",
    "撓": "挠",
    "撚": "拈",
    "撟": "挢",
    "撢": "掸",
    "撣": "掸",
    "撥": "拨",
    "撦": "扯",
    "撫": "抚",
    "撲": "扑",
    "撳": "揿",
    "撻": "挞",
    "撾": "挝",
    "撿": "捡",
    "擁": "拥",
    "擄": "掳",
    "擇": "择",
    "擊": "击",
    "擋": "挡",
    "擓": "㧟",
    "擔": "担",
    "據": "据",
    "擠": "挤",
    "擡": "抬",
    "擣": "捣",
    "擬": "拟",
    "擯": "摈",
    "擰": "拧",
    "擱": "搁",
    "擲": "掷",
    "擴": "扩",
    "擷": "撷",
    "擺": "摆",
    "擻": "擞",
    "擼": "撸",
    "擾": "扰",
    "攄": "摅",
    "攆": "撵",
    "攏": "拢",
    "攔": "拦",
    "攖": "撄",
    "攙": "搀",
    "攛": "撺",
    "攜": "携",
    "攝": "摄",
    "攢": "攒",
    "攣": "挛",
    "攤": "摊",
    "攪": "搅",
    "攬": "揽",
    "攷": "考",
    "敗": "败",
    "敘": "叙",
    "敵": "敌",
    "數": "数",
    "斂": "敛",
    "斃": "毙",
    "斕": "斓",
    "斬": "斩",
    "斷": "断",
    "於": "于",
    "旂": "旗",
    "旛": "幡",
    "昇": "升",
    "時": "时",
    "晉": "晋",
    "晝": "昼",
    "晞": "曦",
    "晢": "晰",
    "晳": "晰",
    "晻": "暗",
    "暈": "晕",
    "暉": "晖",
    "暘": "阳",
    "暢": "畅",
    "暫": "暂",
    "暱": "昵",
    "暸": "了",
    "曄": "晔",
    "曆": "历",
    "曇": "昙",
    "曉": "晓",
    "曏": "向",
    "曖": "暧",
    "曠": "旷",
    "曨": "昽",
    "曬": "晒",
    "書": "书",
    "會": "会",
    "朢": "望",
    "朧": "胧",
    "朮": "术",
    "杇": "圬",
    "東": "东",
    "枴": "拐",
    "柵": "栅",
    "柺": "拐",
    "栒": "旬",
    "桮": "杯",
    "桿": "杆",
    "梔": "栀",
    "梘": "枧",
    "條": "条",
    "梟": "枭",
    "梱": "捆",
    "棄": "弃",
    "棖": "枨",
    "棗": "枣",
    "棟": "栋",
    "棡": "㭎",
    "棧": "栈",
    "棲": "栖",
    "椏": "桠",
    "楄": "匾",
    "楊": "杨",
    "楓": "枫",
    "楙": "茂",
    "楜": "胡",
    "楨": "桢",
    "業": "业",
    "極": "极",
    "榦": "干",
    "榪": "杩",
    "榮": "荣",
    "榿": "桤",
    "槃": "盘",
    "構": "构",
    "槍": "枪",
    "槓": "杠",
    "槧": "椠",
    "槨": "椁",
    "槳": "桨",
    "樁": "桩",
    "樂": "乐",
    "樅": "枞",
    "樑": "梁",
    "樓": "楼",
    "標": "标",
    "樞": "枢",
    "樣": "样",
    "樸": "朴",
    "樹": "树",
    "樺": "桦",
    "橈": "桡",
    "橋": "桥",
    "機": "机",
    "橢": "椭",
    "橦": "幢",
    "橫": "横",
    "檁": "檩",
    "檉": "柽",
    "檔": "档",
    "檜": "桧",
    "檟": "槚",
    "檢": "检",
    "檣": "樯",
    "檯": "台",
    "檳": "槟",
    "檸": "柠",
    "檻": "槛",
    "櫂": "棹",
    "櫃": "柜",
    "櫐": "累",
    "櫓": "橹",
    "櫚": "榈",
    "櫛": "栉",
    "櫝": "椟",
    "櫞": "橼",
    "櫟": "栎",
    "櫥": "橱",
    "櫧": "槠",
    "櫨": "栌",
    "櫪": "枥",
    "櫫": "橥",
    "櫬": "榇",
    "櫳": "栊",
    "櫸": "榉",
    "櫺": "棂",
    "櫻": "樱",
    "欄": "栏",
    "權": "权",
    "欏": "椤",
    "欒": "栾",
    "欖": "榄",
    "欞": "棂",
    "欸": "唉",
    "欽": "钦",
    "歎": "叹",
    "歐": "欧",
    "歟": "欤",
    "歡": "欢",
    "歲": "岁",
    "歷": "历",
    "歸": "归",
    "歿": "殁",
    "殀": "夭",
    "殘": "残",
    "殞": "殒",
    "殤": "殇",
    "殫": "殚",
    "殭": "僵",
    "殮": "殓",
    "殯": "殡",
    "殲": "歼",
    "殺": "杀",
    "殼": "壳",
    "殽": "肴",
    "毀": "毁",
    "毆": "殴",
    "毌": "毋",
    "毘": "毗",
    "毬": "球",
    "毿": "毵",
    "氈": "毡",
    "氌": "氇",
    "氣": "气",
    "氫": "氢",
    "氬": "氩",
    "氳": "氲",
    "氾": "泛",
    "汍": "丸",
    "汎": "泛",
    "汙": "污",
    "決": "决",
    "沍": "冱",
    "沒": "没",
    "沖": "冲",
    "況": "况",
    "泝": "溯",
    "洟": "涕",
    "洩": "泄",
    "洶": "汹",
    "浬": "里",
    "浹": "浃",
    "涇": "泾",
    "涼": "凉",
    "淒": "凄",
    "淚": "泪",
    "淥": "渌",
    "淨": "净",
    "淪": "沦",
    "淵": "渊",
    "淶": "涞",
    "淺": "浅",
    "渙": "涣",
    "減": "减",
    "渢": "沨",
    "渦": "涡",
    "測": "测",
    "渾": "浑",
    "湊": "凑",
    "湞": "浈",
    "湣": "闵",
    "湧": "涌",
    "湯": "汤",
    "溈": "沩",
    "準": "准",
    "溝": "沟",
    "溫": "温",
    "溮": "浉",
    "溳": "涢",
    "溼": "湿",
    "滄": "沧",
    "滅": "灭",
    "滌": "涤",
    "滎": "荥",
    "滬": "沪",
    "滯": "滞",
    "滲": "渗",
    "滷": "卤",
    "滸": "浒",
    "滻": "浐",
    "滾": "滚",
    "滿": "满",
    "漁": "渔",
    "漊": "溇",
    "漚": "沤",
    "漢": "汉",
    "漣": "涟",
    "漬": "渍",
    "漲": "涨",
    "漵": "溆",
    "漸": "渐",
    "漿": "浆",
    "潁": "颍",
    "潑": "泼",
    "潔": "洁",
    "潛": "潜",
    "潟": "舄",
    "潤": "润",
    "潯": "浔",
    "潰": "溃",
    "潷": "滗",
    "潿": "涠",
    "澀": "涩",
    "澂": "澄",
    "澆": "浇",
    "澇": "涝",
    "澔": "浩",
    "澗": "涧",
    "澠": "渑",
    "澤": "泽",
    "澦": "滪",
    "澩": "泶",
    "澮": "浍",
    "澱": "淀",
    "澾": "㳠",
    "濁": "浊",
    "濃": "浓",
    "濕": "湿",
    "濘": "泞",
    "濛": "蒙",
    "濜": "浕",
    "濟": "济",
    "濤": "涛",
    "濫": "滥",
    "濬": "浚",
    "濰": "潍",
    "濱": "滨",
    "濺": "溅",
    "濼": "泺",
    "濾": "滤",
    "瀁": "漾",
    "瀅": "滢",
    "瀆": "渎",
    "瀉": "泻",
    "瀋": "沈",
    "瀏": "浏",
    "瀕": "濒",
    "瀘": "泸",
    "瀝": "沥",
    "瀟": "潇",
    "瀠": "潆",
    "瀦": "潴",
    "瀧": "泷",
    "瀨": "濑",
    "瀰": "弥",
    "瀲": "潋",
    "瀾": "澜",
    "灃": "沣",
    "灄": "滠",
    "灑": "洒",
    "灕": "漓",
    "灘": "滩",
    "灝": "灏",
    "灣": "湾",
    "灤": "滦",
    "灩": "滟",
    "災": "灾",
    "炤": "照",
    "炰": "炮",
    "為": "为",
    "烏": "乌",
    "烴": "烃",
    "無": "无",
    "煉": "炼",
    "煒": "炜",
    "煖": "暖",
    "煙": "烟",
    "煢": "茕",
    "煥": "焕",
    "煩": "烦",
    "煬": "炀",
    "熒": "荧",
    "熗": "炝",
    "熱": "热",
    "熾": "炽",
    "燁": "烨",
    "燄": "焰",
    "燈": "灯",
    "燉": "炖",
    "燐": "磷",
    "燒": "烧",
    "燙": "烫",
    "燜": "焖",
    "營": "营",
    "燦": "灿",
    "燬": "毁",
    "燭": "烛",
    "燴": "烩",
    "燻": "熏",
    "燼": "烬",
    "燾": "焘",
    "燿": "耀",
    "爍": "烁",
    "爐": "炉",
    "爛": "烂",
    "爭": "争",
    "爲": "为",
    "爺": "爷",
    "爾": "尔",
    "牆": "墙",
    "牘": "牍",
    "牠": "它",
    "牴": "抵",
    "牽": "牵",
    "犖": "荦",
    "犛": "牦",
    "犢": "犊",
    "犧": "牺",
    "狀": "状",
    "狚": "旦",
    "狹": "狭",
    "狽": "狈",
    "猙": "狰",
    "猶": "犹",
    "猻": "狲",
    "獁": "犸",
    "獃": "呆",
    "獄": "狱",
    "獅": "狮",
    "獎": "奖",
    "獨": "独",
    "獪": "狯",
    "獫": "猃",
    "獮": "狝",
    "獰": "狞",
    "獲": "获",
    "獵": "猎",
    "獷": "犷",
    "獸": "兽",
    "獺": "獭",
    "獻": "献",
    "獼": "猕",
    "玀": "猡",
    "玅": "妙",
    "玆": "兹",
    "玨": "珏",
    "珪": "圭",
    "珮": "佩",
    "現": "现",
    "琱": "雕",
    "琺": "珐",
    "琿": "珲",
    "瑋": "玮",
    "瑣": "琐",
    "瑤": "瑶",
    "瑩": "莹",
    "瑪": "玛",
    "瑯": "琅",
    "瑲": "玱",
    "璉": "琏",
    "璡": "琎",
    "璣": "玑",
    "璦": "瑷",
    "環": "环",
    "璽": "玺",
    "璿": "璇",
    "瓊": "琼",
    "瓏": "珑",
    "瓔": "璎",
    "瓖": "镶",
    "瓚": "瓒",
    "甌": "瓯",
    "甕": "瓮",
    "產": "产",
    "産": "产",
    "甦": "苏",
    "甪": "角",
    "畝": "亩",
    "畢": "毕",
    "畫": "画",
    "畬": "畲",
    "異": "异",
    "當": "当",
    "疇": "畴",
    "疊": "叠",
    "疿": "痱",
    "痙": "痉",
    "痠": "酸",
    "痲": "麻",
    "痳": "麻",
    "痺": "痹",
    "痾": "疴",
    "瘂": "痖",
    "瘉": "愈",
    "瘋": "疯",
    "瘍": "疡",
    "瘓": "痪",
    "瘞": "瘗",
    "瘡": "疮",
    "瘧": "疟",
    "瘺": "瘘",
    "瘻": "瘘",
    "療": "疗",
    "癆": "痨",
    "癇": "痫",
    "癉": "瘅",
    "癒": "愈",
    "癘": "疠",
    "癟": "瘪",
    "癡": "痴",
    "癢": "痒",
    "癤": "疖",
    "癥": "症",
    "癧": "疬",
    "癩": "癞",
    "癬": "癣",
    "癭": "瘿",
    "癮": "瘾",
    "癰": "痈",
    "癱": "瘫",
    "癲": "癫",
    "發": "发",
    "皁": "皂",
    "皚": "皑",
    "皰": "疱",
    "皸": "皲",
    "皺": "皱",
    "盃": "杯",
    "盜": "盗",
    "盞": "盏",
    "盡": "尽",
    "監": "监",
    "盤": "盘",
    "盧": "卢",
    "盪": "荡",
    "眥": "眦",
    "眾": "众",
    "睏": "困",
    "睜": "睁",
    "睞": "睐",
    "睪": "睾",
    "瞇": "眯",
    "瞘": "眍",
    "瞜": "䁖",
    "瞞": "瞒",
    "瞼": "睑",
    "矇": "蒙",
    "矓": "眬",
    "矚": "瞩",
    "矯": "矫",
    "砲": "炮",
    "硃": "朱",
    "硤": "硖",
    "硨": "砗",
    "硯": "砚",
    "碕": "崎",
    "碩": "硕",
    "碪": "砧",
    "碭": "砀",
    "碸": "砜",
    "確": "确",
    "碼": "码",
    "磑": "硙",
    "磚": "砖",
    "磣": "碜",
    "磧": "碛",
    "磯": "矶",
    "磽": "硗",
    "礄": "硚",
    "礎": "础",
    "礙": "碍",
    "礦": "矿",
    "礪": "砺",
    "礫": "砾",
    "礬": "矾",
    "礱": "砻",
    "祂": "他",
    "祅": "祆",
    "祇": "只",
    "祐": "佑",
    "祼": "裸",
    "祿": "禄",
    "禍": "祸",
    "禎": "祯",
    "禕": "祎",
    "禦": "御",
    "禪": "禅",
    "禮": "礼",
    "禱": "祷",
    "禿": "秃",
    "秈": "籼",
    "秏": "耗",
    "稅": "税",
    "稈": "秆",
    "稜": "棱",
    "稟": "禀",
    "稨": "扁",
    "種": "种",
    "稱": "称",
    "穀": "谷",
    "穇": "䅟",
    "穌": "稣",
    "積": "积",
    "穎": "颖",
    "穡": "穑",
    "穢": "秽",
    "穨": "颓",
    "穩": "稳",
    "穫": "获",
    "窩": "窝",
    "窪": "洼",
    "窮": "穷",
    "窯": "窑",
    "窵": "窎",
    "窶": "窭",
    "窺": "窥",
    "竄": "窜",
    "竅": "窍",
    "竇": "窦",
    "竊": "窃",
    "競": "竞",
    "笻": "筇",
    "筆": "笔",
    "筍": "笋",
    "筧": "笕",
    "筴": "策",
    "箄": "箅",
    "箇": "个",
    "箋": "笺",
    "箏": "筝",
    "箠": "棰",
    "節": "节",
    "範": "范",
    "築": "筑",
    "篋": "箧",
    "篛": "箬",
    "篠": "筱",
    "篤": "笃",
    "篩": "筛",
    "篲": "彗",
    "篳": "筚",
    "簀": "箦",
    "簍": "篓",
    "簑": "蓑",
    "簞": "箪",
    "簡": "简",
    "簣": "篑",
    "簫": "箫",
    "簷": "檐",
    "簽": "签",
    "簾": "帘",
    "籃": "篮",
    "籌": "筹",
    "籐": "藤",
    "籙": "箓",
    "籜": "箨",
    "籟": "籁",
    "籠": "笼",
    "籤": "签",
    "籥": "龠",
    "籩": "笾",
    "籪": "簖",
    "籬": "篱",
    "籮": "箩",
    "籲": "吁",
    "粧": "妆",
    "粵": "粤",
    "糝": "糁",
    "糞": "粪",
    "糧": "粮",
    "糰": "团",
    "糲": "粝",
    "糴": "籴",
    "糶": "粜",
    "糾": "纠",
    "紀": "纪",
    "紂": "纣",
    "約": "约",
    "紅": "红",
    "紆": "纡",
    "紇": "纥",
    "紈": "纨",
    "紉": "纫",
    "紋": "纹",
    "納": "纳",
    "紐": "纽",
    "紓": "纾",
    "純": "纯",
    "紕": "纰",
    "紖": "纼",
    "紗": "纱",
    "紘": "纮",
    "紙": "纸",
    "級": "级",
    "紛": "纷",
    "紜": "纭",
    "紝": "纴",
    "紡": "纺",
    "紬": "䌷",
    "紮": "扎",
    "細": "细",
    "紱": "绂",
    "紲": "绁",
    "紳": "绅",
    "紹": "绍",
    "紺": "绀",
    "紼": "绋",
    "紿": "绐",
    "絀": "绌",
    "終": "终",
    "絃": "弦",
    "組": "组",
    "絆": "绊",
    "絎": "绗",
    "結": "结",
    "絕": "绝",
    "絛": "绦",
    "絝": "绔",
    "絞": "绞",
    "絡": "络",
    "絢": "绚",
    "給": "给",
    "絨": "绒",
    "絰": "绖",
    "統": "统",
    "絲": "丝",
    "絳": "绛",
    "絹": "绢",
    "綁": "绑",
    "綃": "绡",
    "綆": "绠",
    "綈": "绨",
    "綏": "绥",
    "綑": "捆",
    "經": "经",
    "綜": "综",
    "綞": "缍",
    "綠": "绿",
    "綢": "绸",
    "綣": "绻",
    "綫": "线",
    "綬": "绶",
    "維": "维",
    "綰": "绾",
    "綱": "纲",
    "網": "网",
    "綴": "缀",
    "綵": "彩",
    "綸": "纶",
    "綹": "绺",
    "綺": "绮",
    "綻": "绽",
    "綽": "绰",
    "綾": "绫",
    "綿": "绵",
    "緄": "绲",
    "緇": "缁",
    "緊": "紧",
    "緋": "绯",
    "緒": "绪",
    "緔": "绱",
    "緗": "缃",
    "緘": "缄",
    "緙": "缂",
    "線": "线",
    "緝": "缉",
    "緞": "缎",
    "締": "缔",
    "緡": "缗",
    "緣": "缘",
    "緦": "缌",
    "編": "编",
    "緩": "缓",
    "緬": "缅",
    "緯": "纬",
    "緱": "缑",
    "緲": "缈",
    "練": "练",
    "緶": "缏",
    "緹": "缇",
    "緻": "致",
    "縈": "萦",
    "縉": "缙",
    "縊": "缢",
    "縋": "缒",
    "縐": "绉",
    "縑": "缣",
    "縕": "缊",
    "縗": "缞",
    "縚": "绦",
    "縛": "缚",
    "縝": "缜",
    "縞": "缟",
    "縟": "缛",
    "縣": "县",
    "縫": "缝",
    "縭": "缡",
    "縮": "缩",
    "縯": "演",
    "縱": "纵",
    "縲": "缧",
    "縳": "缚",
    "縴": "纤",
    "縵": "缦",
    "縶": "絷",
    "縷": "缕",
    "縹": "缥",
    "總": "总",
    "績": "绩",
    "繃": "绷",
    "繅": "缫",
    "繆": "缪",
    "繈": "襁",
    "繒": "缯",
    "織": "织",
    "繕": "缮",
    "繙": "翻",
    "繚": "缭",
    "繞": "绕",
    "繡": "绣",
    "繢": "缋",
    "繩": "绳",
    "繪": "绘",
    "繫": "系",
    "繭": "茧",
    "繯": "缳",
    "繰": "缲",
    "繳": "缴",
    "繹": "绎",
    "繼": "继",
    "繽": "缤",
    "繾": "缱",
    "纈": "缬",
    "纊": "纩",
    "續": "续",
    "纍": "累",
    "纏": "缠",
    "纓": "缨",
    "纔": "才",
    "纖": "纤",
    "纘": "缵",
    "纜": "缆",
    "缽": "钵",
    "缾": "瓶",
    "罈": "坛",
    "罌": "罂",
    "罦": "罘",
    "罰": "罚",
    "罵": "骂",
    "罷": "罢",
    "羅": "罗",
    "羆": "罴",
    "羈": "羁",
    "羋": "芈",
    "羥": "羟",
    "羨": "羡",
    "義": "义",
    "羶": "膻",
    "習": "习",
    "翬": "翚",
    "翹": "翘",
    "耑": "端",
    "耡": "助",
    "耤": "藉",
    "耬": "耧",
    "耮": "耢",
    "聖": "圣",
    "聞": "闻",
    "聯": "联",
    "聰": "聪",
    "聲": "声",
    "聳": "耸",
    "聵": "聩",
    "聶": "聂",
    "職": "职",
    "聹": "聍",
    "聽": "听",
    "聾": "聋",
    "肅": "肃",
    "肏": "操",
    "肐": "胳",
    "胇": "肺",
    "胊": "朐",
    "脅": "胁",
    "脈": "脉",
    "脛": "胫",
    "脣": "唇",
    "脩": "修",
    "脫": "脱",
    "脹": "胀",
    "腎": "肾",
    "腖": "胨",
    "腡": "脶",
    "腦": "脑",
    "腫": "肿",
    "腳": "脚",
    "腸": "肠",
    "膃": "腽",
    "膆": "嗉",
    "膕": "腘",
    "膚": "肤",
    "膞": "䏝",
    "膠": "胶",
    "膩": "腻",
    "膽": "胆",
    "膾": "脍",
    "膿": "脓",
    "臉": "脸",
    "臍": "脐",
    "臏": "膑",
    "臕": "膘",
    "臘": "腊",
    "臙": "胭",
    "臚": "胪",
    "臟": "脏",
    "臠": "脔",
    "臢": "臜",
    "臥": "卧",
    "臨": "临",
    "臺": "台",
    "與": "与",
    "興": "兴",
    "舉": "举",
    "舊": "旧",
    "舋": "衅",
    "舖": "铺",
    "艙": "舱",
    "艣": "橹",
    "艤": "舣",
    "艦": "舰",
    "艫": "舻",
    "艱": "艰",
    "艷": "艳",
    "艸": "艹",
    "芻": "刍",
    "苧": "苎",
    "苺": "莓",
    "茍": "苟",
    "茲": "兹",
    "荅": "答",
    "荊": "荆",
    "荳": "豆",
    "莊": "庄",
    "莖": "茎",
    "莢": "荚",
    "莧": "苋",
    "菫": "堇",
    "華": "华",
    "菴": "庵",
    "萇": "苌",
    "萊": "莱",
    "萬": "万",
    "萵": "莴",
    "葉": "叶",
    "葒": "荭",
    "著": "着",
    "葤": "荮",
    "葦": "苇",
    "葯": "药",
    "葷": "荤",
    "蒐": "搜",
    "蒔": "莳",
    "蒞": "莅",
    "蒼": "苍",
    "蓀": "荪",
    "蓆": "席",
    "蓋": "盖",
    "蓮": "莲",
    "蓯": "苁",
    "蓴": "莼",
    "蓽": "荜",
    "蔆": "菱",
    "蔔": "卜",
    "蔞": "蒌",
    "蔣": "蒋",
    "蔥": "葱",
    "蔦": "茑",
    "蔭": "荫",
    "蕁": "荨",
    "蕆": "蒇",
    "蕎": "荞",
    "蕒": "荬",
    "蕕": "莸",
    "蕘": "荛",
    "蕢": "蒉",
    "蕩": "荡",
    "蕪": "芜",
    "蕭": "萧",
    "蕷": "蓣",
    "薈": "荟",
    "薊": "蓟",
    "薌": "芗",
    "薑": "姜",
    "薔": "蔷",
    "薙": "剃",
    "薟": "莶",
    "薦": "荐",
    "薩": "萨",
    "薺": "荠",
    "藍": "蓝",
    "藎": "荩",
    "藝": "艺",
    "藥": "药",
    "藪": "薮",
    "藭": "䓖",
    "藶": "苈",
    "藷": "薯",
    "藹": "蔼",
    "藺": "蔺",
    "蘀": "萚",
    "蘄": "蕲",
    "蘆": "芦",
    "蘇": "苏",
    "蘊": "蕴",
    "蘋": "苹",
    "蘗": "蘖",
    "蘚": "藓",
    "蘞": "蔹",
    "蘢": "茏",
    "蘭": "兰",
    "蘺": "蓠",
    "蘿": "萝",
    "處": "处",
    "虖": "呼",
    "虛": "虚",
    "虜": "虏",
    "號": "号",
    "虧": "亏",
    "虯": "虬",
    "蛺": "蛱",
    "蛻": "蜕",
    "蜆": "蚬",
    "蜺": "霓",
    "蝕": "蚀",
    "蝟": "猬",
    "蝦": "虾",
    "蝨": "虱",
    "蝸": "蜗",
    "螄": "蛳",
    "螞": "蚂",
    "螢": "萤",
    "螻": "蝼",
    "蟄": "蛰",
    "蟈": "蝈",
    "蟎": "螨",
    "蟣": "虮",
    "蟬": "蝉",
    "蟯": "蛲",
    "蟲": "虫",
    "蟶": "蛏",
    "蟺": "蟮",
    "蟻": "蚁",
    "蠅": "蝇",
    "蠆": "虿",
    "蠍": "蝎",
    "蠐": "蛴",
    "蠑": "蝾",
    "蠔": "蚝",
    "蠟": "蜡",
    "蠣": "蛎",
    "蠨": "蟏",
    "蠱": "蛊",
    "蠶": "蚕",
    "蠷": "蠼",
    "蠻": "蛮",
    "衆": "众",
    "衊": "蔑",
    "衒": "炫",
    "術": "术",
    "衚": "胡",
    "衛": "卫",
    "衝": "冲",
    "衹": "只",
    "袞": "衮",
    "袪": "祛",
    "裊": "袅",
    "裏": "里",
    "補": "补",
    "裝": "装",
    "裡": "里",
    "製": "制",
    "複": "复",
    "褎": "袖",
    "褲": "裤",
    "褳": "裢",
    "褸": "褛",
    "褻": "亵",
    "襉": "裥",
    "襖": "袄",
    "襝": "裣",
    "襠": "裆",
    "襤": "褴",
    "襪": "袜",
    "襬": "摆",
    "襯": "衬",
    "襲": "袭",
    "襾": "西",
    "覈": "核",
    "見": "见",
    "覎": "觃",
    "規": "规",
    "覓": "觅",
    "視": "视",
    "覘": "觇",
    "覜": "眺",
    "覡": "觋",
    "覦": "觎",
    "親": "亲",
    "覬": "觊",
    "覯": "觏",
    "覲": "觐",
    "覷": "觑",
    "覺": "觉",
    "覽": "览",
    "覿": "觌",
    "觀": "观",
    "觔": "筋",
    "觝": "抵",
    "觴": "觞",
    "觶": "觯",
    "觸": "触",
    "訂": "订",
    "訃": "讣",
    "計": "计",
    "訊": "讯",
    "訌": "讧",
    "討": "讨",
    "訐": "讦",
    "訓": "训",
    "訕": "讪",
    "訖": "讫",
    "託": "托",
    "記": "记",
    "訛": "讹",
    "訝": "讶",
    "訟": "讼",
    "訢": "欣",
    "訣": "诀",
    "訥": "讷",
    "訩": "讻",
    "訪": "访",
    "設": "设",
    "許": "许",
    "訴": "诉",
    "訶": "诃",
    "診": "诊",
    "註": "注",
    "証": "证",
    "詁": "诂",
    "詆": "诋",
    "詎": "讵",
    "詐": "诈",
    "詒": "诒",
    "詔": "诏",
    "評": "评",
    "詗": "诇",
    "詘": "诎",
    "詛": "诅",
    "詞": "词",
    "詠": "咏",
    "詡": "诩",
    "詢": "询",
    "詣": "诣",
    "試": "试",
    "詩": "诗",
    "詫": "诧",
    "詬": "诟",
    "詭": "诡",
    "詮": "诠",
    "詰": "诘",
    "話": "话",
    "該": "该",
    "詳": "详",
    "詵": "诜",
    "詶": "酬",
    "詻": "咯",
    "詼": "诙",
    "詿": "诖",
    "誄": "诔",
    "誅": "诛",
    "誆": "诓",
    "誇": "夸",
    "誌": "志",
    "認": "认",
    "誑": "诳",
    "誒": "诶",
    "誕": "诞",
    "誘": "诱",
    "誚": "诮",
    "語": "语",
    "誠": "诚",
    "誡": "诫",
    "誣": "诬",
    "誤": "误",
    "誥": "诰",
    "誦": "诵",
    "誨": "诲",
    "說": "说",
    "説": "说",
    "誰": "谁",
    "課": "课",
    "誶": "谇",
    "誹": "诽",
    "誼": "谊",
    "調": "调",
    "諂": "谄",
    "諄": "谆",
    "談": "谈",
    "諉": "诿",
    "請": "请",
    "諍": "诤",
    "諏": "诹",
    "諑": "诼",
    "諒": "谅",
    "論": "论",
    "諗": "谂",
    "諛": "谀",
    "諜": "谍",
    "諝": "谞",
    "諞": "谝",
    "諠": "喧",
    "諢": "诨",
    "諤": "谔",
    "諦": "谛",
    "諧": "谐",
    "諫": "谏",
    "諭": "谕",
    "諮": "谘",
    "諱": "讳",
    "諳": "谙",
    "諶": "谌",
    "諷": "讽",
    "諸": "诸",
    "諺": "谚",
    "諼": "谖",
    "諾": "诺",
    "謀": "谋",
    "謁": "谒",
    "謂": "谓",
    "謄": "誊",
    "謅": "诌",
    "謊": "谎",
    "謎": "谜",
    "謐": "谧",
    "謔": "谑",
    "謖": "谡",
    "謗": "谤",
    "謙": "谦",
    "謚": "谥",
    "講": "讲",
    "謝": "谢",
    "謠": "谣",
    "謨": "谟",
    "謫": "谪",
    "謬": "谬",
    "謳": "讴",
    "謹": "谨",
    "謼": "呼",
    "謾": "谩",
    "譁": "哗",
    "譆": "嘻",
    "證": "证",
    "譎": "谲",
    "譏": "讥",
    "譔": "撰",
    "譖": "谮",
    "識": "识",
    "譙": "谯",
    "譚": "谭",
    "譜": "谱",
    "譟": "噪",
    "譫": "谵",
    "譭": "毁",
    "譯": "译",
    "議": "议",
    "譴": "谴",
    "護": "护",
    "譽": "誉",
    "譾": "谫",
    "讀": "读",
    "讅": "谉",
    "變": "变",
    "讌": "宴",
    "讎": "雠",
    "讒": "谗",
    "讓": "让",
    "讕": "谰",
    "讖": "谶",
    "讚": "赞",
    "讜": "谠",
    "讞": "谳",
    "谿": "溪",
    "豈": "岂",
    "豎": "竖",
    "豐": "丰",
    "豔": "艳",
    "豖": "亍",
    "豬": "猪",
    "豶": "豮",
    "貍": "狸",
    "貓": "猫",
    "貝": "贝",
    "貞": "贞",
    "負": "负",
    "財": "财",
    "貢": "贡",
    "貧": "贫",
    "貨": "货",
    "販": "贩",
    "貪": "贪",
    "貫": "贯",
    "責": "责",
    "貯": "贮",
    "貰": "贳",
    "貲": "赀",
    "貳": "贰",
    "貴": "贵",
    "貶": "贬",
    "買": "买",
    "貸": "贷",
    "貺": "贶",
    "費": "费",
    "貼": "贴",
    "貽": "贻",
    "貿": "贸",
    "賀": "贺",
    "賁": "贲",
    "賂": "赂",
    "賃": "赁",
    "賄": "贿",
    "賅": "赅",
    "資": "资",
    "賈": "贾",
    "賊": "贼",
    "賑": "赈",
    "賒": "赊",
    "賓": "宾",
    "賕": "赇",
    "賙": "赒",
    "賚": "赉",
    "賜": "赐",
    "賞": "赏",
    "賠": "赔",
    "賡": "赓",
    "賢": "贤",
    "賣": "卖",
    "賤": "贱",
    "賦": "赋",
    "賧": "赕",
    "質": "质",
    "賬": "账",
    "賭": "赌",
    "賴": "赖",
    "賵": "赗",
    "賸": "剩",
    "賺": "赚",
    "賻": "赙",
    "購": "购",
    "賽": "赛",
    "賾": "赜",
    "贄": "贽",
    "贅": "赘",
    "贈": "赠",
    "贊": "赞",
    "贋": "赝",
    "贍": "赡",
    "贏": "赢",
    "贐": "赆",
    "贓": "赃",
    "贖": "赎",
    "贛": "赣",
    "趕": "赶",
    "趙": "赵",
    "趨": "趋",
    "趲": "趱",
    "跡": "迹",
    "跼": "局",
    "踐": "践",
    "踡": "蜷",
    "踫": "碰",
    "踰": "逾",
    "踴": "踊",
    "蹌": "跄",
    "蹕": "跸",
    "蹟": "迹",
    "蹠": "跖",
    "蹣": "蹒",
    "蹤": "踪",
    "蹧": "糟",
    "蹺": "跷",
    "躉": "趸",
    "躊": "踌",
    "躋": "跻",
    "躍": "跃",
    "躑": "踯",
    "躒": "跞",
    "躓": "踬",
    "躕": "蹰",
    "躚": "跹",
    "躡": "蹑",
    "躥": "蹿",
    "躦": "躜",
    "躪": "躏",
    "軀": "躯",
    "車": "车",
    "軋": "轧",
    "軌": "轨",
    "軍": "军",
    "軒": "轩",
    "軔": "轫",
    "軛": "轭",
    "軟": "软",
    "軤": "轷",
    "軫": "轸",
    "軲": "轱",
    "軸": "轴",
    "軹": "轵",
    "軺": "轺",
    "軻": "轲",
    "軼": "轶",
    "軾": "轼",
    "較": "较",
    "輅": "辂",
    "輇": "辁",
    "載": "载",
    "輊": "轾",
    "輒": "辄",
    "輓": "挽",
    "輔": "辅",
    "輕": "轻",
    "輛": "辆",
    "輜": "辎",
    "輝": "辉",
    "輞": "辋",
    "輟": "辍",
    "輥": "辊",
    "輦": "辇",
    "輩": "辈",
    "輪": "轮",
    "輯": "辑",
    "輳": "辏",
    "輸": "输",
    "輻": "辐",
    "輾": "辗",
    "輿": "舆",
    "轂": "毂",
    "轄": "辖",
    "轅": "辕",
    "轆": "辘",
    "轉": "转",
    "轍": "辙",
    "轎": "轿",
    "轔": "辚",
    "轟": "轰",
    "轡": "辔",
    "轢": "轹",
    "轤": "轳",
    "辦": "办",
    "辭": "辞",
    "辮": "辫",
    "辯": "辩",
    "農": "农",
    "迆": "迤",
    "迴": "回",
    "迺": "乃",
    "逕": "迳",
    "這": "这",
    "連": "连",
    "週": "周",
    "進": "进",
    "遊": "游",
    "運": "运",
    "過": "过",
    "達": "达",
    "違": "违",
    "遙": "遥",
    "遜": "逊",
    "遞": "递",
    "遠": "远",
    "適": "适",
    "遲": "迟",
    "遷": "迁",
    "選": "选",
    "遺": "遗",
    "遼": "辽",
    "邁": "迈",
    "還": "还",
    "邇": "迩",
    "邊": "边",
    "邏": "逻",
    "邐": "逦",
    "郟": "郏",
    "郵": "邮",
    "鄆": "郓",
    "鄉": "乡",
    "鄒": "邹",
    "鄔": "邬",
    "鄖": "郧",
    "鄧": "邓",
    "鄭": "郑",
    "鄰": "邻",
    "鄲": "郸",
    "鄴": "邺",
    "鄶": "郐",
    "鄺": "邝",
    "酈": "郦",
    "酖": "鸩",
    "醃": "腌",
    "醆": "盏",
    "醜": "丑",
    "醞": "酝",
    "醫": "医",
    "醬": "酱",
    "醱": "发",
    "醼": "宴",
    "釀": "酿",
    "釁": "衅",
    "釃": "酾",
    "釅": "酽",
    "釆": "采",
    "釋": "释",
    "釐": "厘",
    "釓": "钆",
    "釔": "钇",
    "釕": "钌",
    "釗": "钊",
    "釘": "钉",
    "釙": "钋",
    "針": "针",
    "釣": "钓",
    "釤": "钐",
    "釦": "扣",
    "釧": "钏",
    "釩": "钒",
    "釵": "钗",
    "釷": "钍",
    "釹": "钕",
    "釺": "钎",
    "釾": "䥺",
    "鈀": "钯",
    "鈁": "钫",
    "鈃": "钘",
    "鈄": "钭",
    "鈈": "钚",
    "鈉": "钠",
    "鈍": "钝",
    "鈐": "钤",
    "鈑": "钣",
    "鈔": "钞",
    "鈕": "钮",
    "鈞": "钧",
    "鈣": "钙",
    "鈥": "钬",
    "鈦": "钛",
    "鈧": "钪",
    "鈮": "铌",
    "鈰": "铈",
    "鈳": "钶",
    "鈴": "铃",
    "鈷": "钴",
    "鈸": "钹",
    "鈹": "铍",
    "鈺": "钰",
    "鈽": "钸",
    "鈾": "铀",
    "鈿": "钿",
    "鉀": "钾",
    "鉅": "钜",
    "鉆": "钻",
    "鉈": "铊",
    "鉉": "铉",
    "鉋": "刨",
    "鉍": "铋",
    "鉑": "铂",
    "鉕": "钷",
    "鉗": "钳",
    "鉚": "铆",
    "鉛": "铅",
    "鉞": "钺",
    "鉢": "钵",
    "鉤": "钩",
    "鉦": "钲",
    "鉬": "钼",
    "鉭": "钽",
    "鉶": "铏",
    "鉸": "铰",
    "鉺": "铒",
    "鉻": "铬",
    "鉿": "铪",
    "銀": "银",
    "銃": "铳",
    "銅": "铜",
    "銑": "铣",
    "銓": "铨",
    "銖": "铢",
    "銘": "铭",
    "銚": "铫",
    "銜": "衔",
    "銠": "铑",
    "銣": "铷",
    "銥": "铱",
    "銦": "铟",
    "銨": "铵",
    "銩": "铥",
    "銪": "铕",
    "銫": "铯",
    "銬": "铐",
    "銱": "铞",
    "銲": "焊",
    "銳": "锐",
    "銷": "销",
    "銹": "锈",
    "銻": "锑",
    "銼": "锉",
    "鋁": "铝",
    "鋃": "锒",
    "鋅": "锌",
    "鋇": "钡",
    "鋌": "铤",
    "鋏": "铗",
    "鋒": "锋",
    "鋝": "锊",
    "鋟": "锓",
    "鋣": "铘",
    "鋤": "锄",
    "鋥": "锃",
    "鋦": "锔",
    "鋨": "锇",
    "鋩": "铓",
    "鋪": "铺",
    "鋮": "铖",
    "鋯": "锆",
    "鋰": "锂",
    "鋱": "铽",
    "鋶": "锍",
    "鋸": "锯",
    "鋻": "鉴",
    "鋼": "钢",
    "錁": "锞",
    "錄": "录",
    "錆": "锖",
    "錇": "锫",
    "錈": "锩",
    "錐": "锥",
    "錒": "锕",
    "錕": "锟",
    "錘": "锤",
    "錙": "锱",
    "錚": "铮",
    "錛": "锛",
    "錟": "锬",
    "錠": "锭",
    "錢": "钱",
    "錦": "锦",
    "錨": "锚",
    "錫": "锡",
    "錮": "锢",
    "錯": "错",
    "錳": "锰",
    "錶": "表",
    "錸": "铼",
    "鍀": "锝",
    "鍁": "锨",
    "鍃": "锪",
    "鍆": "钔",
    "鍇": "锴",
    "鍊": "炼",
    "鍋": "锅",
    "鍍": "镀",
    "鍔": "锷",
    "鍘": "铡",
    "鍚": "钖",
    "鍛": "锻",
    "鍤": "锸",
    "鍥": "锲",
    "鍩": "锘",
    "鍬": "锹",
    "鍰": "锾",
    "鍵": "键",
    "鍶": "锶",
    "鍺": "锗",
    "鍼": "针",
    "鍾": "钟",
    "鎂": "镁",
    "鎄": "锿",
    "鎇": "镅",
    "鎊": "镑",
    "鎌": "镰",
    "鎔": "镕",
    "鎖": "锁",
    "鎗": "枪",
    "鎘": "镉",
    "鎚": "锤",
    "鎡": "镃",
    "鎢": "钨",
    "鎣": "蓥",
    "鎦": "镏",
    "鎧": "铠",
    "鎩": "铩",
    "鎪": "锼",
    "鎬": "镐",
    "鎮": "镇",
    "鎰": "镒",
    "鎳": "镍",
    "鎵": "镓",
    "鎿": "镎",
    "鏃": "镞",
    "鏇": "镟",
    "鏈": "链",
    "鏌": "镆",
    "鏍": "镙",
    "鏑": "镝",
    "鏗": "铿",
    "鏘": "锵",
    "鏜": "镗",
    "鏝": "镘",
    "鏞": "镛",
    "鏟": "铲",
    "鏡": "镜",
    "鏢": "镖",
    "鏤": "镂",
    "鏨": "錾",
    "鏰": "镚",
    "鏵": "铧",
    "鏷": "镤",
    "鏹": "镪",
    "鏺": "䥽",
    "鏽": "锈",
    "鐃": "铙",
    "鐉": "铣",
    "鐋": "铴",
    "鐐": "镣",
    "鐒": "铹",
    "鐓": "镦",
    "鐔": "镡",
    "鐘": "钟",
    "鐙": "镫",
    "鐝": "镢",
    "鐠": "镨",
    "鐥": "䦅",
    "鐦": "锎",
    "鐧": "锏",
    "鐨": "镄",
    "鐫": "镌",
    "鐮": "镰",
    "鐯": "䦃",
    "鐲": "镯",
    "鐳": "镭",
    "鐵": "铁",
    "鐶": "镮",
    "鐸": "铎",
    "鐺": "铛",
    "鐿": "镱",
    "鑄": "铸",
    "鑊": "镬",
    "鑌": "镔",
    "鑑": "鉴",
    "鑒": "鉴",
    "鑔": "镲",
    "鑕": "锧",
    "鑞": "镴",
    "鑠": "铄",
    "鑣": "镳",
    "鑤": "刨",
    "鑥": "镥",
    "鑪": "炉",
    "鑭": "镧",
    "鑰": "钥",
    "鑲": "镶",
    "鑵": "罐",
    "鑷": "镊",
    "鑹": "镩",
    "鑼": "锣",
    "鑽": "钻",
    "鑾": "銮",
    "鑿": "凿",
    "钁": "䦆",
    "钂": "镋",
    "長": "长",
    "門": "门",
    "閂": "闩",
    "閃": "闪",
    "閆": "闫",
    "閉": "闭",
    "開": "开",
    "閌": "闶",
    "閎": "闳",
    "閏": "闰",
    "閑": "闲",
    "閒": "闲",
    "間": "间",
    "閔": "闵",
    "閘": "闸",
    "閡": "阂",
    "閣": "阁",
    "閤": "合",
    "閥": "阀",
    "閨": "闺",
    "閩": "闽",
    "閫": "阃",
    "閬": "阆",
    "閭": "闾",
    "閱": "阅",
    "閶": "阊",
    "閹": "阉",
    "閻": "阎",
    "閼": "阏",
    "閽": "阍",
    "閾": "阈",
    "閿": "阌",
    "闃": "阒",
    "闆": "板",
    "闇": "暗",
    "闈": "闱",
    "闊": "阔",
    "闋": "阕",
    "闌": "阑",
    "闐": "阗",
    "闓": "闿",
    "闔": "阖",
    "闕": "阙",
    "闖": "闯",
    "關": "关",
    "闞": "阚",
    "闡": "阐",
    "闢": "辟",
    "闥": "闼",
    "阨": "厄",
    "阬": "坑",
    "阯": "址",
    "陏": "隋",
    "陘": "陉",
    "陝": "陕",
    "陞": "升",
    "陣": "阵",
    "陰": "阴",
    "陳": "陈",
    "陸": "陆",
    "陽": "阳",
    "隄": "堤",
    "隉": "陧",
    "隊": "队",
    "階": "阶",
    "隕": "陨",
    "際": "际",
    "隤": "颓",
    "隨": "随",
    "險": "险",
    "隱": "隐",
    "隴": "陇",
    "隸": "隶",
    "隻": "只",
    "雋": "隽",
    "雖": "虽",
    "雙": "双",
    "雛": "雏",
    "雜": "杂",
    "雞": "鸡",
    "離": "离",
    "難": "难",
    "雲": "云",
    "電": "电",
    "霤": "溜",
    "霧": "雾",
    "霽": "霁",
    "靂": "雳",
    "靄": "霭",
    "靆": "叇",
    "靈": "灵",
    "靉": "叆",
    "靚": "靓",
    "靜": "静",
    "靦": "腼",
    "靨": "靥",
    "鞏": "巩",
    "鞦": "秋",
    "韁": "缰",
    "韃": "鞑",
    "韆": "千",
    "韉": "鞯",
    "韋": "韦",
    "韌": "韧",
    "韍": "韨",
    "韓": "韩",
    "韙": "韪",
    "韜": "韬",
    "韞": "韫",
    "韻": "韵",
    "響": "响",
    "頁": "页",
    "頂": "顶",
    "頃": "顷",
    "項": "项",
    "順": "顺",
    "頇": "顸",
    "須": "须",
    "頊": "顼",
    "頌": "颂",
    "頎": "颀",
    "頏": "颃",
    "預": "预",
    "頑": "顽",
    "頒": "颁",
    "頓": "顿",
    "頗": "颇",
    "領": "领",
    "頜": "颌",
    "頡": "颉",
    "頤": "颐",
    "頦": "颏",
    "頫": "俯",
    "頭": "头",
    "頰": "颊",
    "頲": "颋",
    "頷": "颔",
    "頸": "颈",
    "頹": "颓",
    "頻": "频",
    "顆": "颗",
    "題": "题",
    "額": "额",
    "顎": "腭",
    "顏": "颜",
    "顒": "颙",
    "顓": "颛",
    "顔": "颜",
    "願": "愿",
    "顙": "颡",
    "顛": "颠",
    "類": "类",
    "顢": "颟",
    "顥": "颢",
    "顧": "顾",
    "顫": "颤",
    "顬": "颥",
    "顯": "显",
    "顰": "颦",
    "顱": "颅",
    "顳": "颞",
    "顴": "颧",
    "風": "风",
    "颮": "飑",
    "颯": "飒",
    "颱": "台",
    "颳": "刮",
    "颶": "飓",
    "颸": "飔",
    "颺": "扬",
    "颼": "飕",
    "飀": "飗",
    "飄": "飘",
    "飆": "飙",
    "飈": "飚",
    "飛": "飞",
    "飢": "饥",
    "飥": "饦",
    "飩": "饨",
    "飪": "饪",
    "飫": "饫",
    "飭": "饬",
    "飯": "饭",
    "飲": "饮",
    "飴": "饴",
    "飼": "饲",
    "飽": "饱",
    "飾": "饰",
    "飿": "饳",
    "餃": "饺",
    "餄": "饸",
    "餅": "饼",
    "餈": "糍",
    "餉": "饷",
    "養": "养",
    "餌": "饵",
    "餎": "饹",
    "餏": "饻",
    "餑": "饽",
    "餒": "馁",
    "餓": "饿",
    "餔": "哺",
    "餘": "余",
    "餚": "肴",
    "餛": "馄",
    "餜": "馃",
    "餞": "饯",
    "餡": "馅",
    "館": "馆",
    "餬": "糊",
    "餱": "糇",
    "餳": "饧",
    "餵": "喂",
    "餶": "馉",
    "餷": "馇",
    "餺": "馎",
    "餼": "饩",
    "餽": "馈",
    "餾": "馏",
    "餿": "馊",
    "饃": "馍",
    "饅": "馒",
    "饈": "馐",
    "饉": "馑",
    "饊": "馓",
    "饋": "馈",
    "饌": "馔",
    "饑": "饥",
    "饒": "饶",
    "饗": "飨",
    "饜": "餍",
    "饞": "馋",
    "饟": "馕",
    "馬": "马",
    "馭": "驭",
    "馮": "冯",
    "馱": "驮",
    "馳": "驰",
    "馴": "驯",
    "駁": "驳",
    "駐": "驻",
    "駑": "驽",
    "駒": "驹",
    "駔": "驵",
    "駕": "驾",
    "駘": "骀",
    "駙": "驸",
    "駛": "驶",
    "駝": "驼",
    "駟": "驷",
    "駢": "骈",
    "駭": "骇",
    "駮": "驳",
    "駱": "骆",
    "駸": "骎",
    "駿": "骏",
    "騁": "骋",
    "騃": "呆",
    "騅": "骓",
    "騍": "骒",
    "騎": "骑",
    "騏": "骐",
    "騖": "骛",
    "騙": "骗",
    "騣": "鬃",
    "騫": "骞",
    "騭": "骘",
    "騮": "骝",
    "騰": "腾",
    "騶": "驺",
    "騷": "骚",
    "騸": "骟",
    "騾": "骡",
    "驀": "蓦",
    "驁": "骜",
    "驂": "骖",
    "驃": "骠",
    "驄": "骢",
    "驅": "驱",
    "驊": "骅",
    "驍": "骁",
    "驏": "骣",
    "驕": "骄",
    "驗": "验",
    "驚": "惊",
    "驛": "驿",
    "驟": "骤",
    "驢": "驴",
    "驤": "骧",
    "驥": "骥",
    "驪": "骊",
    "骯": "肮",
    "髏": "髅",
    "髒": "脏",
    "體": "体",
    "髕": "髌",
    "髖": "髋",
    "髣": "仿",
    "髮": "发",
    "鬆": "松",
    "鬍": "胡",
    "鬚": "须",
    "鬢": "鬓",
    "鬥": "斗",
    "鬧": "闹",
    "鬨": "哄",
    "鬩": "阋",
    "鬮": "阄",
    "鬱": "郁",
    "魎": "魉",
    "魘": "魇",
    "魚": "鱼",
    "魛": "鱽",
    "魨": "豚",
    "魯": "鲁",
    "魴": "鲂",
    "魷": "鱿",
    "鮁": "鲅",
    "鮃": "鲆",
    "鮍": "鲏",
    "鮐": "鲐",
    "鮑": "鲍",
    "鮒": "鲋",
    "鮓": "鲊",
    "鮚": "鲒",
    "鮞": "鲕",
    "鮣": "䲟",
    "鮦": "鲖",
    "鮪": "鲔",
    "鮫": "鲛",
    "鮭": "鲑",
    "鮮": "鲜",
    "鮺": "鲝",
    "鯀": "鲧",
    "鯁": "鲠",
    "鯇": "鲩",
    "鯉": "鲤",
    "鯊": "鲨",
    "鯔": "鲻",
    "鯖": "鲭",
    "鯗": "鲞",
    "鯛": "鲷",
    "鯝": "鲴",
    "鯡": "鲱",
    "鯢": "鲵",
    "鯤": "鲲",
    "鯧": "鲳",
    "鯨": "鲸",
    "鯪": "鲮",
    "鯫": "鲰",
    "鯰": "鲇",
    "鯴": "鲺",
    "鯽": "鲫",
    "鯿": "鳊",
    "鰂": "鲗",
    "鰈": "鲽",
    "鰉": "鳇",
    "鰌": "䲡",
    "鰍": "鳅",
    "鰒": "鳆",
    "鰓": "鳃",
    "鰛": "鳁",
    "鰜": "鳒",
    "鰟": "鳑",
    "鰠": "鳋",
    "鰣": "鲥",
    "鰥": "鳏",
    "鰧": "䲢",
    "鰨": "鳎",
    "鰩": "鳐",
    "鰭": "鳍",
    "鰱": "鲢",
    "鰲": "鳌",
    "鰳": "鳓",
    "鰵": "鳘",
    "鰷": "鲦",
    "鰹": "鲣",
    "鰻": "鳗",
    "鰼": "鳛",
    "鰾": "鳔",
    "鱅": "鳙",
    "鱈": "鳕",
    "鱉": "鳖",
    "鱒": "鳟",
    "鱔": "鳝",
    "鱖": "鳜",
    "鱗": "鳞",
    "鱘": "鲟",
    "鱝": "鲼",
    "鱟": "鲎",
    "鱠": "鲙",
    "鱣": "鳣",
    "鱧": "鳢",
    "鱨": "鲿",
    "鱭": "鲚",
    "鱷": "鳄",
    "鱸": "鲈",
    "鱺": "鲡",
    "鳥": "鸟",
    "鳧": "凫",
    "鳩": "鸠",
    "鳳": "凤",
    "鳴": "鸣",
    "鳶": "鸢",
    "鳾": "䴓",
    "鴆": "鸩",
    "鴇": "鸨",
    "鴈": "雁",
    "鴉": "鸦",
    "鴒": "鸰",
    "鴕": "鸵",
    "鴛": "鸳",
    "鴝": "鸲",
    "鴞": "鸮",
    "鴟": "鸱",
    "鴣": "鸪",
    "鴦": "鸯",
    "鴨": "鸭",
    "鴯": "鸸",
    "鴰": "鸹",
    "鴴": "鸻",
    "鴷": "䴕",
    "鴻": "鸿",
    "鴿": "鸽",
    "鵁": "䴔",
    "鵂": "鸺",
    "鵃": "鸼",
    "鵑": "鹃",
    "鵒": "鹆",
    "鵓": "鹁",
    "鵜": "鹈",
    "鵝": "鹅",
    "鵠": "鹄",
    "鵡": "鹉",
    "鵪": "鹌",
    "鵬": "鹏",
    "鵮": "鹐",
    "鵯": "鹎",
    "鵰": "雕",
    "鵲": "鹊",
    "鶄": "䴖",
    "鶇": "鸫",
    "鶉": "鹑",
    "鶊": "鹒",
    "鶏": "鸡",
    "鶓": "鹋",
    "鶖": "鹙",
    "鶘": "鹕",
    "鶚": "鹗",
    "鶡": "鹖",
    "鶥": "鹛",
    "鶩": "鹜",
    "鶪": "䴗",
    "鶬": "鸧",
    "鶯": "莺",
    "鶱": "骞",
    "鶴": "鹤",
    "鶺": "鹡",
    "鶻": "鹘",
    "鶼": "鹣",
    "鶿": "鹚",
    "鷂": "鹞",
    "鷉": "䴘",
    "鷓": "鹧",
    "鷖": "鹥",
    "鷗": "鸥",
    "鷙": "鸷",
    "鷚": "鹨",
    "鷥": "鸶",
    "鷦": "鹪",
    "鷯": "鹩",
    "鷰": "燕",
    "鷲": "鹫",
    "鷳": "鹇",
    "鷴": "鹇",
    "鷸": "鹬",
    "鷹": "鹰",
    "鷺": "鹭",
    "鸇": "鹯",
    "鸊": "䴙",
    "鸌": "鹱",
    "鸕": "鸬",
    "鸚": "鹦",
    "鸛": "鹳",
    "鸝": "鹂",
    "鸞": "鸾",
    "鹵": "卤",
    "鹹": "咸",
    "鹺": "鹾",
    "鹼": "硷",
    "鹽": "盐",
    "麗": "丽",
    "麥": "麦",
    "麩": "麸",
    "麵": "面",
    "麼": "么",
    "黃": "黄",
    "黌": "黉",
    "點": "点",
    "黨": "党",
    "黲": "黪",
    "黴": "霉",
    "黶": "黡",
    "黷": "黩",
    "黽": "黾",
    "黿": "鼋",
    "鼇": "鳌",
    "鼉": "鼍",
    "鼕": "冬",
    "鼴": "鼹",
    "齊": "齐",
    "齋": "斋",
    "齎": "赍",
    "齏": "齑",
    "齒": "齿",
    "齔": "龀",
    "齙": "龅",
    "齜": "龇",
    "齟": "龃",
    "齠": "龆",
    "齡": "龄",
    "齣": "出",
    "齦": "龈",
    "齧": "啮",
    "齪": "龊",
    "齬": "龉",
    "齲": "龋",
    "齶": "腭",
    "齷": "龌",
    "龍": "龙",
    "龐": "庞",
    "龑": "䶮",
    "龔": "龚",
    "龕": "龛",
    "龜": "龟",
    "兀": "兀",
    "︰": "∶",
    "︱": "｜",
    "︳": "｜",
    "︿": "∧",
    "﹀": "∨",
    "﹐": "，",
    "﹑": "、",
    "﹒": "．",
    "﹔": "；",
    "﹕": "：",
    "﹖": "？",
    "﹗": "！",
    "﹙": "（",
    "﹚": "）",
    "﹛": "｛",
    "﹜": "｝",
    "﹝": "［",
    "﹞": "］",
    "﹟": "＃",
    "﹠": "＆",
    "﹡": "＊",
    "﹢": "＋",
    "﹣": "－",
    "﹤": "＜",
    "﹥": "＞",
    "﹦": "＝",
    "﹩": "＄",
    "﹪": "％",
    "﹫": "＠"
    // '\u300C': '\u300C',
    // '\u300D': '\u300D',
  };
  function sify(text) {
    const isString2 = typeof text === "string";
    if (!isString2) {
      console.error(
        "The expected text signature is undefined | null | string, but an unexpected value was passed in:",
        typeof text
      );
    }
    let $$text = isString2 ? text : "";
    $$text = ($$text == null ? void 0 : $$text.replace(/[^\x00-\xFF]/g, replaceFn)) || "";
    return $$text;
  }
  function replaceFn(char) {
    if (char in t_2_s) {
      return t_2_s[char];
    }
    return char;
  }
  async function convertHTML(html, mode) {
    if (mode === "none" || !html) {
      return html;
    }
    try {
      const converter = mode === "sc" ? sify : tify;
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
  const MAX_CACHED_CHAPTERS = 8;
  const useReaderStore = /* @__PURE__ */ defineStore("reader", () => {
    const isActive2 = ref(false);
    const isLoading = ref(false);
    const isLoadingPrev = ref(false);
    const isLoadingNext = ref(false);
    const chapters = ref([]);
    const currentChapterIndex = ref(0);
    const error = ref(null);
    const toastType = ref("error");
    const toastTimer = ref(null);
    const scrollPercent = ref(0);
    const history = ref([]);
    const loadedUrls = ref(/* @__PURE__ */ new Set());
    const originalContents = ref(/* @__PURE__ */ new Map());
    const currentConversionMode = ref("none");
    const pendingNextAbort = ref(null);
    const pendingPrevAbort = ref(null);
    const cacheProgress = ref({ done: 0, total: 0, running: false });
    const cacheQueue = ref([]);
    const cacheAbort = ref(null);
    const toc = ref([]);
    const tocLoading = ref(false);
    const tocAbort = ref(null);
    const cachedContents = ref(/* @__PURE__ */ new Map());
    const persistedUrls = ref(/* @__PURE__ */ new Set());
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
    const tocWithStatus = computed(() => {
      var _a;
      const currentUrl = (_a = chapter.value) == null ? void 0 : _a.url;
      return toc.value.map((entry) => ({
        ...entry,
        isCached: loadedUrls.value.has(entry.url) || cachedContents.value.has(entry.url),
        isPersisted: persistedUrls.value.has(entry.url),
        isCurrent: entry.url === currentUrl
      }));
    });
    const currentChapterUrl = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.url) || "";
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
      cachedContents.value.set(newChapter.url, {
        chapter: newChapter,
        rule: newRule,
        cachedAt: Date.now()
      });
      if (newChapter.url && !history.value.includes(newChapter.url)) {
        history.value.push(newChapter.url);
        if (history.value.length > 100) {
          history.value = history.value.slice(-100);
        }
      }
      restoreCache();
    }
    async function insertCachedChapter(cached, position) {
      const suffix = position === "append" ? "cached" : "cached-prev";
      const id = `chapter-${Date.now()}-${suffix}-${chapters.value.length}`;
      let content2 = cached.chapter.content;
      if (currentConversionMode.value !== "none") {
        content2 = await convertHTML(content2, currentConversionMode.value);
      }
      const entry = {
        chapter: { ...cached.chapter, content: content2 },
        rule: cached.rule,
        id
      };
      if (position === "append") {
        chapters.value.push(entry);
      } else {
        chapters.value.unshift(entry);
        currentChapterIndex.value++;
      }
      originalContents.value.set(id, cached.chapter.content);
      if (chapters.value.length > MAX_CACHED_CHAPTERS) {
        if (position === "append" && currentChapterIndex.value > 2) {
          const removed = chapters.value.shift();
          if (removed) {
            loadedUrls.value.delete(removed.chapter.url);
            originalContents.value.delete(removed.id);
            currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
          }
        } else if (position === "prepend") {
          const removed = chapters.value.pop();
          if (removed) {
            loadedUrls.value.delete(removed.chapter.url);
            originalContents.value.delete(removed.id);
          }
        }
      }
      return true;
    }
    function normalizeUrl(url) {
      return url.replace(/\/$/, "").replace(/\/index\.html?$/, "");
    }
    async function loadChapter(direction) {
      const isNext = direction === "next";
      const refChapter = isNext ? chapters.value[chapters.value.length - 1] : chapters.value[0];
      const isLoadingRef = isNext ? isLoadingNext : isLoadingPrev;
      const pendingAbortRef = isNext ? pendingNextAbort : pendingPrevAbort;
      const endMessage = isNext ? "已经是最后一章了" : "已经是第一章了";
      const errorMessage = isNext ? "加载下一章失败" : "加载上一章失败";
      if (isLoadingRef.value) {
        return false;
      }
      const targetUrl = isNext ? refChapter == null ? void 0 : refChapter.chapter.nextUrl : refChapter == null ? void 0 : refChapter.chapter.prevUrl;
      if (!targetUrl) {
        showToast(endMessage, "info");
        return false;
      }
      if (refChapter.chapter.indexUrl && normalizeUrl(targetUrl) === normalizeUrl(refChapter.chapter.indexUrl)) {
        showToast(endMessage, "info");
        return false;
      }
      if (loadedUrls.value.has(targetUrl)) {
        const cached = cachedContents.value.get(targetUrl);
        if (cached) {
          return insertCachedChapter(cached, isNext ? "append" : "prepend");
        }
        return false;
      }
      isLoadingRef.value = true;
      if (pendingAbortRef.value) {
        pendingAbortRef.value();
        pendingAbortRef.value = null;
      }
      if (isInvalidChapterUrl(targetUrl, refChapter.chapter.url)) {
        loadedUrls.value.add(targetUrl);
        isLoadingRef.value = false;
        showToast(endMessage, "info");
        return false;
      }
      try {
        const referer = refChapter.chapter.url;
        const { promise, abort } = fetchAndParseUrl(targetUrl, referer);
        pendingAbortRef.value = abort;
        const doc2 = await promise;
        pendingAbortRef.value = null;
        if (!doc2) {
          loadedUrls.value.add(targetUrl);
          showToast(endMessage, "info");
          return false;
        }
        const parser = getParser();
        const parsed = await parseWithSectionMerge(parser, doc2, targetUrl, referer);
        if (!parsed) {
          loadedUrls.value.add(targetUrl);
          showToast(endMessage, "info");
          return false;
        }
        const isTocPage = detectTocPage(parsed.content, targetUrl, refChapter.chapter.url);
        if (isTocPage) {
          loadedUrls.value.add(targetUrl);
          showToast(endMessage, "info");
          return false;
        }
        if (!isNext) {
          if (parsed.nextUrl && normalizeUrl(parsed.nextUrl) === normalizeUrl(refChapter.chapter.url)) {
          } else if (parsed.prevUrl && !parsed.nextUrl) {
            loadedUrls.value.add(targetUrl);
            return false;
          }
        }
        const suffix = isNext ? "" : "prev-";
        const id = `chapter-${Date.now()}-${suffix}${chapters.value.length}`;
        const entry = {
          chapter: parsed,
          rule: parsed.rule,
          id
        };
        if (isNext) {
          chapters.value.push(entry);
        } else {
          chapters.value.unshift(entry);
          currentChapterIndex.value++;
        }
        loadedUrls.value.add(parsed.url);
        originalContents.value.set(id, parsed.content);
        cachedContents.value.set(parsed.url, {
          chapter: parsed,
          rule: parsed.rule,
          cachedAt: Date.now()
        });
        if (currentConversionMode.value !== "none") {
          const converted = await convertHTML(parsed.content, currentConversionMode.value);
          const chapterEntry = chapters.value.find((e) => e.id === id);
          if (chapterEntry) {
            chapterEntry.chapter = { ...chapterEntry.chapter, content: converted };
          }
        }
        if (!history.value.includes(parsed.url)) {
          if (isNext) {
            history.value.push(parsed.url);
          } else {
            history.value.unshift(parsed.url);
          }
        }
        if (chapters.value.length > MAX_CACHED_CHAPTERS) {
          if (isNext && currentChapterIndex.value > 2) {
            const removed = chapters.value.shift();
            if (removed) {
              loadedUrls.value.delete(removed.chapter.url);
              originalContents.value.delete(removed.id);
              currentChapterIndex.value = Math.max(0, currentChapterIndex.value - 1);
            }
          } else if (!isNext) {
            const removed = chapters.value.pop();
            if (removed) {
              loadedUrls.value.delete(removed.chapter.url);
              originalContents.value.delete(removed.id);
            }
          }
        }
        return true;
      } catch (e) {
        console.error(`[MNR] Failed to load ${direction} chapter:`, e);
        setError(errorMessage);
        return false;
      } finally {
        isLoadingRef.value = false;
      }
    }
    async function loadNextChapter() {
      return loadChapter("next");
    }
    async function loadPrevChapter() {
      return loadChapter("prev");
    }
    function setLoading(loading) {
      isLoading.value = loading;
    }
    function setError(msg) {
      error.value = msg;
      toastType.value = "error";
      isLoading.value = false;
      if (toastTimer.value) {
        window.clearTimeout(toastTimer.value);
      }
      toastTimer.value = window.setTimeout(() => {
        error.value = null;
        toastTimer.value = null;
      }, 3e3);
    }
    function showToast(msg, type = "info", duration = 2e3) {
      error.value = msg;
      toastType.value = type;
      if (toastTimer.value) {
        window.clearTimeout(toastTimer.value);
      }
      toastTimer.value = window.setTimeout(() => {
        error.value = null;
        toastTimer.value = null;
      }, duration);
    }
    function clearError() {
      error.value = null;
      if (toastTimer.value) {
        window.clearTimeout(toastTimer.value);
        toastTimer.value = null;
      }
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
        url: readerStoreHistoryFallback(),
        chapterUrl: chapter.value.url,
        chapterPercent: calculateCurrentChapterPercent(),
        scrollPercent: scrollPercent.value,
        lastRead: Date.now()
      };
    }
    function readerStoreHistoryFallback() {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.url) || window.location.href;
    }
    function calculateCurrentChapterPercent() {
      return scrollPercent.value;
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
    async function startCacheAll(urls) {
      var _a, _b, _c, _d;
      if (cacheProgress.value.running) return;
      let taskList = urls ? [...urls] : [];
      cacheQueue.value = [...taskList];
      if (!taskList.length) {
        const indexUrl = (_a = chapter.value) == null ? void 0 : _a.indexUrl;
        const currentUrl = (_b = chapter.value) == null ? void 0 : _b.url;
        if (indexUrl) {
          const tocEntries = await loadTocEntriesPaged(indexUrl, currentUrl || indexUrl, (abort) => {
            cacheAbort.value = abort;
          });
          cacheAbort.value = null;
          const tocLinks = tocEntries.map((e) => e.url).slice(0, 1e4);
          taskList = tocLinks.filter((u) => !loadedUrls.value.has(u) && !cachedContents.value.has(u));
          cacheQueue.value = [...taskList];
        }
      }
      const estimatedTotal = taskList.length;
      if (estimatedTotal === 0) {
        cacheProgress.value = { done: 0, total: 0, running: false };
        return;
      }
      cacheProgress.value = { done: 0, total: estimatedTotal, running: true };
      let nextUrl = taskList.shift();
      let referer = ((_c = chapters.value[chapters.value.length - 1]) == null ? void 0 : _c.chapter.url) || ((_d = chapter.value) == null ? void 0 : _d.url);
      while (cacheProgress.value.running && nextUrl) {
        if (loadedUrls.value.has(nextUrl) || cachedContents.value.has(nextUrl)) {
          cacheProgress.value = { ...cacheProgress.value, done: cacheProgress.value.done + 1 };
          nextUrl = taskList.shift() ?? null;
          continue;
        }
        const { promise, abort } = fetchAndParseUrl(nextUrl, referer);
        cacheAbort.value = abort;
        const doc2 = await promise;
        cacheAbort.value = null;
        if (!doc2) {
          nextUrl = taskList.shift() ?? null;
          continue;
        }
        const parser = getParser();
        const parsed = await parseWithSectionMerge(parser, doc2, nextUrl, referer);
        if (!parsed) {
          nextUrl = taskList.shift() ?? null;
          continue;
        }
        cachedContents.value.set(parsed.url, {
          chapter: parsed,
          rule: parsed.rule,
          cachedAt: Date.now()
        });
        loadedUrls.value.add(parsed.url);
        cacheProgress.value = { ...cacheProgress.value, done: cacheProgress.value.done + 1 };
        referer = parsed.url;
        nextUrl = taskList.shift() ?? parsed.nextUrl ?? null;
        if (!cacheQueue.value.length && nextUrl && !loadedUrls.value.has(nextUrl)) {
          cacheProgress.value = { ...cacheProgress.value, total: cacheProgress.value.done + 1 };
        }
      }
      cacheProgress.value = {
        ...cacheProgress.value,
        total: cacheProgress.value.done,
        running: false
      };
      cacheAbort.value = null;
      await persistCache();
    }
    function cancelCacheAll() {
      var _a;
      cacheProgress.value = { done: 0, total: 0, running: false };
      cacheQueue.value = [];
      (_a = cacheAbort.value) == null ? void 0 : _a.call(cacheAbort);
      cacheAbort.value = null;
    }
    function resolveUrl(href, base) {
      try {
        return new URL(href, base).toString();
      } catch {
        return null;
      }
    }
    function extractUrlPattern(url) {
      try {
        const u = new URL(url);
        return u.pathname.replace(/\d+/g, "{N}");
      } catch {
        return url.replace(/\d+/g, "{N}");
      }
    }
    const CHAPTER_TITLE_PATTERNS = [
      // Chinese chapter formats: 第X章/节/回/话/篇/集/卷
      /^.{0,10}第.{1,10}[章节回话篇集卷]/,
      // Numbered chapters: 1. xxx, 001 xxx, etc.
      /^\d{1,4}[.、\s]/,
      // Chapter keyword at start
      /^(序章|序幕|楔子|引子|终章|尾声|番外|后记|前言)/,
      // English format
      /^chapter\s*\d+/i,
      /^(prologue|epilogue|preface)/i
    ];
    const NON_CHAPTER_TITLE_PATTERNS = [
      // Announcements and notices
      /^(公告|通知|声明|说明|必读|注意|警告|温馨提示)/,
      /上架感言|完本感言|请假|推迟|停更|断更|更新|爆更|上架通知|卷末感言/,
      /必看|必读|请务必阅读|读者必看/,
      // Author-related
      /^(作者|关于作者|作品相关|设定|世界观|人物介绍|角色)/,
      // Promotional content
      /求.*票|求.*收藏|求.*订阅|求.*打赏|求.*推荐|求.*支持/,
      /新书|推荐|安利|宣传|书单|书评/,
      // Metadata pages
      /^(目录|封面|简介|内容简介|书籍信息|作品信息)/,
      // Locked/VIP markers that are standalone entries (not part of chapter title)
      /^(VIP|付费|锁定|未解锁|需订阅|加入书架)$/i,
      // External links and community
      /官网|公众号|微信|QQ群|粉丝群|书友群|交流群|读者群/,
      // Common non-content links
      /登[录陆]|注册|充值|书架|书城|排行|分类|搜索|设置/,
      /首页|返回|上一页|下一页|翻页/,
      // Volume/section labels only (e.g., "章节2", "卷一", not real chapter titles)
      /^(章节|分卷|卷|部|篇)\s*[\d一二三四五六七八九十百千]+\s*$/,
      /^(正文|番外|VIP卷?|免费章节?)\s*$/
    ];
    function extractBookId(url) {
      try {
        const u = new URL(url);
        const patterns = [
          /\/book\/(\d+)/,
          /\/chapter\/(\d+)\//,
          /\/(\d+)\/\d+(?:\.html?)?$/,
          // Faloo (飞卢): /{bookId}_{chapterId}.html
          /\/(\d+)_\d+(?:\.html?)?$/,
          /[?&](?:book_?id|bid|id)=(\d+)/i
        ];
        for (const p2 of patterns) {
          const m = u.pathname.match(p2) || u.search.match(p2);
          if (m) return m[1];
        }
      } catch {
      }
      return null;
    }
    function isLikelyChapterTitle(title2) {
      const t = title2.trim();
      return CHAPTER_TITLE_PATTERNS.some((p2) => p2.test(t));
    }
    function isNonChapterTitle(title2) {
      const t = title2.trim();
      if (t.length < 2) return true;
      return NON_CHAPTER_TITLE_PATTERNS.some((p2) => p2.test(t));
    }
    function filterTocEntries(entries) {
      if (entries.length < 5) return entries;
      const bookIdCounts = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        const bookId = extractBookId(entry.url);
        if (bookId) {
          bookIdCounts.set(bookId, (bookIdCounts.get(bookId) || 0) + 1);
        }
      }
      let dominantBookId = null;
      let maxCount = 0;
      for (const [bookId, count] of bookIdCounts) {
        if (count > maxCount) {
          maxCount = count;
          dominantBookId = bookId;
        }
      }
      const sameBookEntries = dominantBookId && maxCount >= 5 ? entries.filter((entry) => {
        const bookId = extractBookId(entry.url);
        return !bookId || bookId === dominantBookId;
      }) : entries;
      const patternCounts = /* @__PURE__ */ new Map();
      const patternEntries = /* @__PURE__ */ new Map();
      for (const entry of sameBookEntries) {
        const pattern = extractUrlPattern(entry.url);
        patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
        if (!patternEntries.has(pattern)) {
          patternEntries.set(pattern, []);
        }
        patternEntries.get(pattern).push(entry);
      }
      const sortedPatterns = Array.from(patternCounts.entries()).sort((a, b) => b[1] - a[1]);
      const dominantPatterns = /* @__PURE__ */ new Set();
      const totalEntries = sameBookEntries.length;
      for (const [pattern, count] of sortedPatterns) {
        const ratio = count / totalEntries;
        if (count >= 5 || ratio > 0.3) {
          dominantPatterns.add(pattern);
          const coveredCount = Array.from(dominantPatterns).reduce(
            (sum, p2) => sum + (patternCounts.get(p2) || 0),
            0
          );
          if (coveredCount / totalEntries > 0.9) break;
        }
      }
      if (dominantPatterns.size === 0 && sortedPatterns.length > 0) {
        dominantPatterns.add(sortedPatterns[0][0]);
      }
      const scoredEntries = sameBookEntries.map((entry) => {
        let score = 0;
        const pattern = extractUrlPattern(entry.url);
        if (dominantPatterns.has(pattern)) {
          score += 2;
        }
        const matchesWhitelist = isLikelyChapterTitle(entry.title);
        if (matchesWhitelist) {
          score += 1;
        }
        if (!matchesWhitelist && isNonChapterTitle(entry.title)) {
          score -= 2;
        }
        return { entry, score };
      });
      const filtered = scoredEntries.filter(({ score }) => score >= 1).map(({ entry }) => entry);
      if (filtered.length < sameBookEntries.length * 0.3 || filtered.length < 10) {
        const lenientFiltered = sameBookEntries.filter((entry) => !isNonChapterTitle(entry.title));
        if (lenientFiltered.length >= filtered.length) {
          return sortTocEntries(lenientFiltered);
        }
      }
      return sortTocEntries(filtered);
    }
    function sortTocEntries(entries) {
      if (entries.length < 5) return entries;
      const entriesWithNum = entries.map((entry, index) => ({
        index,
        // Keep original index
        entry,
        num: extractChapterNumber(entry.title)
      })).filter((item) => item.num !== null);
      if (entriesWithNum.length < entries.length * 0.3 || entriesWithNum.length < 3) {
        return entries;
      }
      let descendingPairs = 0;
      let ascendingPairs = 0;
      for (let i = 0; i < entriesWithNum.length - 1; i++) {
        const diff = entriesWithNum[i + 1].num - entriesWithNum[i].num;
        if (diff < 0) descendingPairs++;
        else if (diff > 0) ascendingPairs++;
      }
      const totalPairs = descendingPairs + ascendingPairs;
      if (totalPairs > 0 && descendingPairs / totalPairs > 0.6) {
        return [...entries].reverse();
      }
      return entries;
    }
    function extractChapterNumber(title2) {
      const match1 = title2.match(/第\s*(\d+)\s*[章节回话篇集卷]/);
      if (match1) return parseInt(match1[1], 10);
      const match2 = title2.match(/^(\d+)[.、\s]/);
      if (match2) return parseInt(match2[1], 10);
      const match3 = title2.match(/Chapter\s*(\d+)/i);
      if (match3) return parseInt(match3[1], 10);
      return null;
    }
    function isPlaceholderTocTitle(title2) {
      return /^章节\s*\d+$/i.test(title2.trim());
    }
    function isBetterTocTitle(oldTitle, newTitle) {
      const oldWhitelist = isLikelyChapterTitle(oldTitle);
      const newWhitelist = isLikelyChapterTitle(newTitle);
      if (newWhitelist && !oldWhitelist) return true;
      if (oldWhitelist && !newWhitelist) return false;
      if (!isPlaceholderTocTitle(oldTitle) && isPlaceholderTocTitle(newTitle)) return false;
      if (isPlaceholderTocTitle(oldTitle) && !isPlaceholderTocTitle(newTitle)) return true;
      return newTitle.length > oldTitle.length;
    }
    function extractTocLinkTitle(a) {
      const titleSelectors = [
        '[class*="chapterItemTitle"]',
        // Qidian mobile: _chapterItemTitle_xxx
        '[class*="chapter-title"]',
        '[class*="chapterTitle"]',
        "h2",
        // Qidian mobile catalog: <a><div><h2>Title</h2></div><span>免费</span></a>
        "h3"
      ];
      for (const sel of titleSelectors) {
        const el = a.querySelector(sel);
        if (el) {
          const text = (el.textContent || "").trim();
          if (text) return text;
        }
      }
      const firstP = a.querySelector("p");
      if (firstP) {
        const allP = a.querySelectorAll("p");
        if (allP.length > 1) {
          const text = (firstP.textContent || "").trim();
          if (text) return text;
        }
      }
      let directText = "";
      for (const node of Array.from(a.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
          directText += node.textContent || "";
        }
      }
      directText = directText.trim();
      if (directText) return directText;
      return (a.textContent || "").trim();
    }
    function collectTocCandidates(doc2, base) {
      var _a, _b;
      const links = Array.from(doc2.querySelectorAll("a[href]"));
      const textPattern = /(第.{1,20}[章节回话篇集卷幕]|[章回节話幕]|chapter|\d+)/i;
      const urlPattern = /(chapter|read|book|novel|txt|\/\d+)[/_-]\d+|\/\d+\.html?$/i;
      const excludeAncestors = (((_b = (_a = rule.value) == null ? void 0 : _a.toc) == null ? void 0 : _b.excludeAncestors) || "").split(",").map((s) => s.trim()).filter(Boolean);
      const candidates = [];
      for (const a of links) {
        if (excludeAncestors.length > 0) {
          let excluded = false;
          for (const sel of excludeAncestors) {
            try {
              if (a.closest(sel)) {
                excluded = true;
                break;
              }
            } catch {
            }
          }
          if (excluded) continue;
        }
        const text = extractTocLinkTitle(a);
        const href = a.getAttribute("href") || "";
        const abs = resolveUrl(href, base);
        if (!abs) continue;
        if (!(textPattern.test(text) || urlPattern.test(href))) {
          continue;
        }
        const title2 = text || `章节 ${candidates.length + 1}`;
        candidates.push({ title: title2, url: abs });
      }
      return candidates;
    }
    function dedupeTocEntries(candidates) {
      const seenUrls = /* @__PURE__ */ new Map();
      const results = [];
      for (let i = candidates.length - 1; i >= 0; i--) {
        const entry = candidates[i];
        if (seenUrls.has(entry.url)) {
          const existing = seenUrls.get(entry.url);
          if (isBetterTocTitle(existing.title, entry.title)) {
            existing.title = entry.title;
          }
        } else {
          seenUrls.set(entry.url, entry);
          results.unshift(entry);
        }
      }
      return results;
    }
    const MAX_TOC_PAGES = 120;
    function normalizeTocPagerText(text) {
      return text.replace(/\s+/g, "").trim();
    }
    function isTocNextPageText(text) {
      const t = normalizeTocPagerText(text).toLowerCase();
      if (!t) return false;
      if (t.includes("下一页") || t.includes("下页") || t.includes("下一頁") || t.includes("下頁")) {
        return true;
      }
      if (t.includes("next") && !t.includes("chapter") && (t.includes("page") || t === "next")) {
        return true;
      }
      return false;
    }
    function extractTocPaginationSeed(indexUrl) {
      try {
        const u = new URL(indexUrl);
        const m = u.pathname.match(/\/(\d{3,})(?:[/?]|$)/);
        return (m == null ? void 0 : m[1]) || null;
      } catch {
        return null;
      }
    }
    function normalizeUrlForCompare(url) {
      try {
        const u = new URL(url);
        u.hash = "";
        return u.toString();
      } catch {
        return url;
      }
    }
    function isValidTocPaginationUrl(candidateUrl, indexUrl) {
      try {
        const c = new URL(candidateUrl);
        const idx = new URL(indexUrl);
        if (c.protocol !== "http:" && c.protocol !== "https:") return false;
        if (c.origin !== idx.origin) return false;
        const seed = extractTocPaginationSeed(indexUrl);
        if (seed && !c.pathname.includes(seed)) return false;
        return true;
      } catch {
        return false;
      }
    }
    function findNextTocPageUrl(doc2, currentPageUrl, indexUrl) {
      var _a, _b;
      const currentNorm = normalizeUrlForCompare(currentPageUrl);
      const pushCandidate = (candidates2, href, score) => {
        const abs = resolveUrl(href, currentPageUrl);
        if (!abs) return;
        const absNorm = normalizeUrlForCompare(abs);
        if (absNorm === currentNorm) return;
        if (!isValidTocPaginationUrl(abs, indexUrl)) return;
        candidates2.push({ url: abs, score });
      };
      const candidates = [];
      const linkNext = (_a = doc2.querySelector('link[rel="next"][href]')) == null ? void 0 : _a.getAttribute("href");
      if (linkNext) {
        pushCandidate(candidates, linkNext, 100);
      }
      const aRelNext = (_b = doc2.querySelector('a[rel~="next"][href]')) == null ? void 0 : _b.getAttribute("href");
      if (aRelNext) {
        pushCandidate(candidates, aRelNext, 90);
      }
      for (const a of Array.from(doc2.querySelectorAll("a[href]"))) {
        const text = a.textContent || "";
        if (!isTocNextPageText(text)) continue;
        const href = a.getAttribute("href");
        if (!href) continue;
        let score = 50;
        const rel = (a.getAttribute("rel") || "").toLowerCase();
        if (rel.includes("next")) score += 10;
        const cls = (a.getAttribute("class") || "").toLowerCase();
        if (cls.includes("next")) score += 3;
        if (a.closest(".pager, .pagination, .page, .pagebar, .caption, nav")) score += 2;
        pushCandidate(candidates, href, score);
      }
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0].url;
    }
    async function loadTocEntriesPaged(indexUrl, currentUrl, setAbort) {
      const visitedPages = /* @__PURE__ */ new Set();
      const seenChapterUrls = /* @__PURE__ */ new Set();
      const allCandidates = [];
      const aborters = [];
      let aborted = false;
      const abortAll = () => {
        aborted = true;
        for (const fn of aborters) {
          try {
            fn();
          } catch {
          }
        }
      };
      setAbort(abortAll);
      try {
        let pageUrl = indexUrl;
        let referer = currentUrl || indexUrl;
        while (pageUrl && visitedPages.size < MAX_TOC_PAGES) {
          const pageKey = normalizeUrlForCompare(pageUrl);
          if (visitedPages.has(pageKey)) break;
          visitedPages.add(pageKey);
          const { promise, abort } = fetchAndParseUrl(pageUrl, referer);
          aborters.push(abort);
          const doc2 = await promise;
          if (aborted) break;
          if (!doc2) break;
          const pageCandidates = collectTocCandidates(doc2, pageUrl);
          allCandidates.push(...pageCandidates);
          let newCount = 0;
          for (const entry of pageCandidates) {
            if (!seenChapterUrls.has(entry.url)) {
              seenChapterUrls.add(entry.url);
              newCount++;
            }
          }
          if (visitedPages.size >= 2 && newCount === 0) break;
          const nextPageUrl = findNextTocPageUrl(doc2, pageUrl, indexUrl);
          if (!nextPageUrl) break;
          referer = pageUrl;
          pageUrl = nextPageUrl;
        }
      } finally {
        setAbort(null);
      }
      if (allCandidates.length === 0) return [];
      return filterTocEntries(dedupeTocEntries(allCandidates));
    }
    async function loadToc() {
      var _a, _b;
      const indexUrl = (_a = chapter.value) == null ? void 0 : _a.indexUrl;
      if (!indexUrl || toc.value.length > 0 || tocLoading.value) return;
      tocLoading.value = true;
      const currentUrl = ((_b = chapter.value) == null ? void 0 : _b.url) || "";
      try {
        toc.value = await loadTocEntriesPaged(indexUrl, currentUrl, (abort) => {
          tocAbort.value = abort;
        });
      } catch (e) {
        console.error("[MNR] Failed to load TOC:", e);
      } finally {
        tocLoading.value = false;
        tocAbort.value = null;
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
      cacheProgress.value = { done: 0, total: 0, running: false };
      cacheQueue.value = [];
      cacheAbort.value = null;
      toc.value = [];
      tocLoading.value = false;
      if (tocAbort.value) {
        tocAbort.value();
        tocAbort.value = null;
      }
    }
    async function rebuildChaptersAround(targetUrl) {
      const cached = cachedContents.value.get(targetUrl);
      if (!cached) return false;
      chapters.value = [];
      currentChapterIndex.value = 0;
      originalContents.value.clear();
      const id = `chapter-${Date.now()}-jump-0`;
      chapters.value.push({
        chapter: cached.chapter,
        rule: cached.rule,
        id
      });
      originalContents.value.set(id, cached.chapter.content);
      if (currentConversionMode.value !== "none") {
        const converted = await convertHTML(cached.chapter.content, currentConversionMode.value);
        chapters.value[0].chapter = { ...chapters.value[0].chapter, content: converted };
      }
      return true;
    }
    async function reloadCurrentChapter() {
      const current = chapters.value[currentChapterIndex.value];
      if (!current) return;
      const url = current.chapter.url;
      showToast("正在重新加载...", "info");
      const { promise } = fetchAndParseUrl(url, url);
      const doc2 = await promise;
      if (!doc2) {
        showToast("重新加载失败", "error");
        return;
      }
      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, doc2, url, url);
      if (parsed) {
        current.chapter = parsed;
        current.rule = parsed.rule;
        originalContents.value.set(current.id, parsed.content);
        cachedContents.value.set(parsed.url, {
          chapter: parsed,
          rule: parsed.rule,
          cachedAt: Date.now()
        });
        if (currentConversionMode.value !== "none") {
          const converted = await convertHTML(parsed.content, currentConversionMode.value);
          current.chapter = { ...current.chapter, content: converted };
        }
        showToast("规则已应用", "info");
      } else {
        showToast("解析失败", "error");
      }
    }
    function generateBookId(indexUrl) {
      try {
        const url = new URL(indexUrl);
        return url.hostname + url.pathname.replace(/\//g, "_");
      } catch {
        return btoa(indexUrl).slice(0, 32);
      }
    }
    async function persistCache() {
      var _a;
      const indexUrl = (_a = chapter.value) == null ? void 0 : _a.indexUrl;
      if (!indexUrl || cachedContents.value.size === 0) return;
      const bookId = generateBookId(indexUrl);
      const chaptersObj = {};
      for (const [url, cached] of cachedContents.value) {
        chaptersObj[url] = cached;
      }
      const data = {
        bookId,
        indexUrl,
        chapters: chaptersObj,
        lastUpdated: Date.now()
      };
      try {
        if (typeof GM_setValue !== "undefined") {
          GM_setValue(`mnr_cache_${bookId}`, JSON.stringify(data));
          persistedUrls.value = new Set(Object.keys(chaptersObj));
        }
      } catch (e) {
        console.error("[MNR] Failed to persist cache:", e);
      }
    }
    async function restoreCache() {
      var _a;
      const indexUrl = (_a = chapter.value) == null ? void 0 : _a.indexUrl;
      if (!indexUrl) return;
      const bookId = generateBookId(indexUrl);
      try {
        if (typeof GM_getValue !== "undefined") {
          const stored = GM_getValue(`mnr_cache_${bookId}`, null);
          if (stored) {
            const data = JSON.parse(stored);
            const urls = Object.keys(data.chapters);
            for (const [url, cached] of Object.entries(data.chapters)) {
              cachedContents.value.set(url, cached);
              loadedUrls.value.add(url);
            }
            persistedUrls.value = new Set(urls);
          }
        }
      } catch (e) {
        console.error("[MNR] Failed to restore cache:", e);
      }
    }
    async function clearPersistedCache() {
      var _a;
      const indexUrl = (_a = chapter.value) == null ? void 0 : _a.indexUrl;
      if (!indexUrl) return;
      const bookId = generateBookId(indexUrl);
      try {
        if (typeof GM_deleteValue !== "undefined") {
          GM_deleteValue(`mnr_cache_${bookId}`);
        }
        persistedUrls.value.clear();
      } catch (e) {
        console.error("[MNR] Failed to clear cache:", e);
      }
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
      toastType,
      scrollPercent,
      history,
      cacheProgress,
      toc,
      tocLoading,
      cachedContents,
      persistedUrls,
      // Getters
      title,
      bookTitle,
      content,
      hasNext,
      hasPrev,
      hasIndex,
      confidence,
      method,
      tocWithStatus,
      currentChapterUrl,
      // Actions
      activate,
      deactivate,
      setChapter,
      setCurrentChapter,
      loadNextChapter,
      loadPrevChapter,
      setLoading,
      setError,
      showToast,
      clearError,
      updateScroll,
      getProgress,
      applyTextConversion,
      startCacheAll,
      cancelCacheAll,
      loadToc,
      rebuildChaptersAround,
      reloadCurrentChapter,
      persistCache,
      restoreCache,
      clearPersistedCache,
      $reset
    };
  });
  function getSectionBaseUrl(url) {
    const m = url.match(/^(.*\/\d+)[_-]\d+(\.html?)$/i);
    if (m) return `${m[1]}${m[2]}`;
    return null;
  }
  function isSectionLikeUrl(currentUrl, nextUrl) {
    try {
      const current = new URL(currentUrl);
      const next = new URL(nextUrl);
      if (current.host !== next.host) return false;
      const currentPath = current.pathname;
      const nextPath = next.pathname;
      const firstPageMatch = currentPath.match(/\/(\d+)\.html?$/i);
      const secondPageMatch = nextPath.match(/\/(\d+)[_-]2\.html?$/i);
      if (firstPageMatch && secondPageMatch && firstPageMatch[1] === secondPageMatch[1]) {
        return true;
      }
      const sectionMatch1 = currentPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
      const sectionMatch2 = nextPath.match(/\/(\d+)[_-](\d+)\.html?$/i);
      if (sectionMatch1 && sectionMatch2 && sectionMatch1[1] === sectionMatch2[1]) {
        const s1 = parseInt(sectionMatch1[2], 10);
        const s2 = parseInt(sectionMatch2[2], 10);
        if (s2 === s1 + 1) return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  async function parseWithSectionMerge(parser, initialDoc, url, referer) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const resolvedUrl = normalizeAbsoluteUrl(url, referer);
    const baseUrl = getSectionBaseUrl(resolvedUrl);
    let startUrl = resolvedUrl;
    let startDoc = initialDoc;
    if (baseUrl && baseUrl !== resolvedUrl) {
      const { promise } = fetchAndParseUrl(baseUrl, referer || resolvedUrl);
      const doc2 = await promise;
      if (doc2) {
        startUrl = baseUrl;
        startDoc = doc2;
      }
    }
    const first = await parser.parse(startDoc, startUrl);
    if (!first) return null;
    const disableByRule = !!((_b = (_a = first.rule) == null ? void 0 : _a.advanced) == null ? void 0 : _b.noSection);
    if (disableByRule) return first;
    const enableByRule = !!((_d = (_c = first.rule) == null ? void 0 : _c.advanced) == null ? void 0 : _d.checkSection);
    const detection = parser.detect(startDoc, startUrl);
    const section = {
      isSection: !!((_e = detection.results.section) == null ? void 0 : _e.isSection),
      nextSectionUrl: ((_f = detection.results.section) == null ? void 0 : _f.nextSectionUrl) || null,
      nextChapterUrl: ((_g = detection.results.section) == null ? void 0 : _g.nextChapterUrl) || null,
      confidence: ((_h = detection.results.section) == null ? void 0 : _h.confidence) || 0
    };
    const shouldMerge = enableByRule || section.isSection && section.confidence >= 0.8;
    if (!shouldMerge) return first;
    let mergedContent = first.content;
    let mergedRaw = first.rawContent;
    let nextSectionUrl = section.nextSectionUrl;
    let nextChapterUrl = section.nextChapterUrl || null;
    let lastUrl = startUrl;
    if (enableByRule && !nextSectionUrl && first.nextUrl) {
      const isSectionUrl = isSectionLikeUrl(startUrl, first.nextUrl);
      if (isSectionUrl) {
        nextSectionUrl = first.nextUrl;
      }
    }
    const seen = /* @__PURE__ */ new Set([startUrl]);
    for (let i = 0; i < 10 && nextSectionUrl; i++) {
      const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
      if (seen.has(absNextSection)) break;
      seen.add(absNextSection);
      const { promise } = fetchAndParseUrl(absNextSection, lastUrl);
      const nextDoc = await promise;
      if (!nextDoc) break;
      const nextParsed = await parser.parse(nextDoc, absNextSection);
      if (!nextParsed) break;
      mergedContent = joinHtml(mergedContent, nextParsed.content);
      mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);
      const nextDet = parser.detect(nextDoc, absNextSection);
      const s = nextDet.results.section;
      if (s == null ? void 0 : s.nextChapterUrl) nextChapterUrl = s.nextChapterUrl;
      nextSectionUrl = (s == null ? void 0 : s.nextSectionUrl) || null;
      if (enableByRule && !nextSectionUrl && nextParsed.nextUrl) {
        if (isSectionLikeUrl(absNextSection, nextParsed.nextUrl)) {
          nextSectionUrl = nextParsed.nextUrl;
        } else {
          if (!nextChapterUrl) nextChapterUrl = nextParsed.nextUrl;
        }
      }
      lastUrl = absNextSection;
    }
    return {
      ...first,
      url: startUrl,
      content: mergedContent,
      rawContent: mergedRaw,
      nextUrl: nextChapterUrl || first.nextUrl
    };
  }
  function getGmXhr() {
    if (typeof GM_xmlhttpRequest === "function") {
      return GM_xmlhttpRequest;
    }
    return null;
  }
  function fetchAndParseUrl(url, referer) {
    const gmXhr = getGmXhr();
    if (!gmXhr) {
      console.error("[MNR] GM_xmlhttpRequest not available");
      return { promise: Promise.resolve(null), abort: () => {
      } };
    }
    let request = null;
    const promise = new Promise((resolve) => {
      const headers = {
        Accept: "text/html,application/xhtml+xml,application/xml",
        "Accept-Language": "zh-CN,zh;q=0.9"
      };
      if (referer) {
        headers["Referer"] = referer;
      }
      request = gmXhr({
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
        onabort: () => {
          resolve(null);
        },
        ontimeout: () => {
          console.error("[MNR] Request timeout");
          resolve(null);
        }
      });
    });
    const abort = () => {
      try {
        request == null ? void 0 : request.abort();
      } catch {
      }
    };
    return { promise, abort };
  }
  function isInvalidChapterUrl(url, currentChapterUrl) {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname;
      if (pathname === "/" || pathname === "") {
        return true;
      }
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length < 2) {
        const part = pathParts[0] || "";
        if (!/\d/.test(part)) {
          return true;
        }
      }
      const invalidPatterns = [
        /^https?:\/\/[^/]+\/?$/i,
        // Root domain
        /^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php)?$/i,
        // Homepage variants
        /\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)\/?/i,
        /\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i,
        // Book index without chapter
        /\/(?:list|catalog|toc|contents?)\.?(?:html?)?$/i,
        /\/(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i
      ];
      for (const pattern of invalidPatterns) {
        if (pattern.test(url) || pattern.test(pathname)) {
          return true;
        }
      }
      if (currentChapterUrl) {
        const currentParsed = new URL(currentChapterUrl);
        const currentParts = currentParsed.pathname.split("/").filter(Boolean);
        if (currentParts.length >= 3 && pathParts.length < currentParts.length - 1) {
          return true;
        }
        if (parsed.host !== currentParsed.host) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
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
  const BASE_RESET_CSS = `
/* Reset all inherited styles */
:host {
  all: initial;
  display: block;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure common elements have expected defaults */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Reset form elements to browser defaults */
input, button, select, textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
}

input[type="checkbox"],
input[type="radio"] {
  appearance: auto;
  -webkit-appearance: checkbox;
  width: auto;
  height: auto;
  margin: 3px 3px 3px 4px;
  cursor: pointer;
}

input[type="range"] {
  appearance: auto;
  -webkit-appearance: slider-horizontal;
}

button {
  appearance: auto;
  cursor: pointer;
}

select {
  appearance: auto;
  -webkit-appearance: menulist;
}

textarea {
  appearance: auto;
  -webkit-appearance: textarea;
  resize: vertical;
}

/* Link defaults */
a {
  color: #1976d2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* List defaults */
ul, ol {
  padding-left: 2em;
}

/* Ensure visibility */
* {
  visibility: visible !important;
}
`;
  function createShadowMount(hostId) {
    const host = document.createElement("div");
    host.id = hostId;
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    window.__MNR_SHADOW_ROOT__ = shadowRoot;
    const resetStyle = document.createElement("style");
    resetStyle.textContent = BASE_RESET_CSS;
    shadowRoot.appendChild(resetStyle);
    if (window.__MNR_STYLES__) {
      const appStyle = document.createElement("style");
      appStyle.textContent = window.__MNR_STYLES__;
      shadowRoot.appendChild(appStyle);
    }
    const mountPoint = document.createElement("div");
    mountPoint.id = `${hostId}-mount`;
    shadowRoot.appendChild(mountPoint);
    const cleanup = () => {
      host.remove();
      if (window.__MNR_SHADOW_ROOT__ === shadowRoot) {
        window.__MNR_SHADOW_ROOT__ = void 0;
      }
    };
    return { host, shadowRoot, mountPoint, cleanup };
  }
  const _hoisted_1$8 = {
    class: "mnr-prompt-card",
    role: "dialog",
    "aria-modal": "true"
  };
  const _hoisted_2$7 = { class: "mnr-confidence" };
  const _hoisted_3$7 = { class: "mnr-confidence-bar" };
  const _hoisted_4$7 = { class: "mnr-confidence-text" };
  const _hoisted_5$6 = { class: "mnr-results" };
  const _hoisted_6$5 = { class: "mnr-checkbox-label" };
  const _sfc_main$8 = /* @__PURE__ */ defineComponent({
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
        return openBlock(), createBlock(Transition, { name: "mnr-fade" }, {
          default: withCtx(() => [
            __props.visible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "mnr-prompt-overlay",
              onClick: withModifiers(handleDismiss, ["self"])
            }, [
              createBaseVNode("div", _hoisted_1$8, [
                _cache[4] || (_cache[4] = createBaseVNode("div", { class: "mnr-prompt-header" }, [
                  createBaseVNode("span", { class: "mnr-prompt-icon" }, "📖"),
                  createBaseVNode("h3", { class: "mnr-prompt-title" }, "启用 MyNovelReader?")
                ], -1)),
                createBaseVNode("div", _hoisted_2$7, [
                  createBaseVNode("div", _hoisted_3$7, [
                    createBaseVNode("div", {
                      class: normalizeClass(["mnr-confidence-fill", confidenceClass.value]),
                      style: normalizeStyle({ width: `${confidence.value * 100}%` })
                    }, null, 6)
                  ]),
                  createBaseVNode("span", _hoisted_4$7, " 检测置信度: " + toDisplayString((confidence.value * 100).toFixed(0)) + "% ", 1)
                ]),
                createBaseVNode("ul", _hoisted_5$6, [
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
                createBaseVNode("label", _hoisted_6$5, [
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
        });
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
  const DetectionPrompt = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-91cf13cd"]]);
  function useVirtualChapters(chapters, options = {}) {
    const { windowSize = 5, overscan = 1, defaultHeight = 1200 } = options;
    const heights = ref(/* @__PURE__ */ new Map());
    const virtualWindow = ref({ start: 0, end: windowSize });
    const totalHeight = computed(
      () => Array.from(heights.value.values()).reduce((sum, h2) => sum + h2, 0)
    );
    const averageHeight = computed(
      () => heights.value.size > 0 ? totalHeight.value / heights.value.size : defaultHeight
    );
    const visibleRange = computed(() => {
      const start = Math.max(0, virtualWindow.value.start - overscan);
      const end = Math.min(chapters.value.length, virtualWindow.value.end + overscan);
      return { start, end };
    });
    const visibleChapters = computed(() => {
      const { start, end } = visibleRange.value;
      return chapters.value.slice(start, end).map((entry, idx) => ({
        ...entry,
        index: start + idx
      }));
    });
    const topSpacer = computed(() => getOffsetBefore(visibleRange.value.start));
    const bottomSpacer = computed(() => {
      const endOffset = getOffsetBefore(visibleRange.value.end);
      const totalOffset = getOffsetBefore(chapters.value.length);
      return Math.max(0, totalOffset - endOffset);
    });
    function setHeight(url, height) {
      const prev = heights.value.get(url);
      if (prev !== height) {
        heights.value.set(url, height);
      }
    }
    function getOffsetBefore(index) {
      if (index <= 0) return 0;
      if (chapters.value.length === 0) return 0;
      let offset = 0;
      const len = Math.min(index, chapters.value.length);
      for (let i = 0; i < len; i++) {
        const entry = chapters.value[i];
        if (!entry) continue;
        const url = entry.chapter.url;
        offset += heights.value.get(url) ?? averageHeight.value;
      }
      return offset;
    }
    function updateWindow(currentIndex) {
      const halfWindow = Math.floor(windowSize / 2);
      virtualWindow.value = {
        start: Math.max(0, currentIndex - halfWindow),
        end: Math.min(chapters.value.length, currentIndex + halfWindow + 1)
      };
    }
    function reset() {
      heights.value.clear();
      virtualWindow.value = { start: 0, end: windowSize };
    }
    watch(
      chapters,
      (newChapters) => {
        const currentUrls = new Set(newChapters.map((entry) => entry.chapter.url));
        for (const url of heights.value.keys()) {
          if (!currentUrls.has(url)) {
            heights.value.delete(url);
          }
        }
        if (newChapters.length === 0) {
          virtualWindow.value = { start: 0, end: 0 };
          return;
        }
        if (virtualWindow.value.end === 0) {
          virtualWindow.value = {
            start: 0,
            end: Math.min(newChapters.length, windowSize)
          };
          return;
        }
        const clampedEnd = Math.min(newChapters.length, virtualWindow.value.end);
        const clampedStart = Math.min(
          virtualWindow.value.start,
          Math.max(0, clampedEnd - windowSize)
        );
        if (clampedStart !== virtualWindow.value.start || clampedEnd !== virtualWindow.value.end) {
          virtualWindow.value = { start: clampedStart, end: clampedEnd };
        }
      },
      { immediate: true, flush: "sync" }
    );
    return {
      // State
      virtualWindow,
      heights,
      // Computed
      visibleChapters,
      topSpacer,
      bottomSpacer,
      totalHeight,
      averageHeight,
      // Methods
      setHeight,
      getOffsetBefore,
      updateWindow,
      reset
    };
  }
  function useEventListener(type, listener, options = {}) {
    const { target = window, passive = false, capture = false } = options;
    let attached = false;
    const add = (currentTarget) => {
      const element = unref(currentTarget);
      if (element && !attached) {
        element.addEventListener(type, listener, { capture, passive });
        attached = true;
      }
    };
    const remove2 = (currentTarget) => {
      const element = unref(currentTarget);
      if (element && attached) {
        element.removeEventListener(type, listener, capture);
        attached = false;
      }
    };
    onMounted(() => add(target));
    onScopeDispose(() => remove2(target));
    if (isRef(target)) {
      watch(target, (newTarget, oldTarget) => {
        remove2(oldTarget);
        add(newTarget);
      });
    }
    return () => remove2(target);
  }
  function isInputElement(el) {
    const tagName = el.tagName;
    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || el.isContentEditable;
  }
  function hasModifiers(e) {
    return e.ctrlKey || e.altKey || e.metaKey;
  }
  function useKeyboardShortcuts(shortcuts, options = {}) {
    const { enabled, ignoreInputs = true, ignoreModifiers = true } = options;
    const isEnabled = computed(() => {
      if (enabled === void 0) return true;
      return unref(enabled);
    });
    function handleKeyDown(e) {
      if (!isEnabled.value) return;
      const target = e.target;
      const key = e.key.toLowerCase();
      for (const shortcut of shortcuts) {
        const keys = Array.isArray(shortcut.key) ? shortcut.key : [shortcut.key];
        const normalizedKeys = keys.map((k) => k.toLowerCase());
        if (!normalizedKeys.includes(key)) continue;
        const shouldIgnoreInput = ignoreInputs && !shortcut.allowInInputs;
        if (shouldIgnoreInput && isInputElement(target)) continue;
        const shouldIgnoreModifier = ignoreModifiers && !shortcut.allowModifiers;
        if (shouldIgnoreModifier && hasModifiers(e)) continue;
        if (shortcut.preventDefault) e.preventDefault();
        if (shortcut.stopPropagation) e.stopPropagation();
        shortcut.handler(e);
        return;
      }
    }
    useEventListener("keydown", handleKeyDown, { capture: true });
  }
  const _hoisted_1$7 = {
    key: 0,
    class: "mnr-progress-text"
  };
  const _sfc_main$7 = /* @__PURE__ */ defineComponent({
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
          __props.showText ? (openBlock(), createElementBlock("span", _hoisted_1$7, toDisplayString(percent.value) + "%", 1)) : createCommentVNode("", true)
        ], 2);
      };
    }
  });
  const ProgressIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-bc314d2a"]]);
  const _hoisted_1$6 = {
    key: 0,
    class: "mnr-floating-toolbar"
  };
  const _hoisted_2$6 = { class: "mnr-fab-group" };
  const _hoisted_3$6 = ["disabled"];
  const _hoisted_4$6 = { class: "mnr-icon" };
  const _hoisted_5$5 = {
    key: 0,
    class: "mnr-fab-badge"
  };
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "FloatingToolbar",
    props: {
      cacheRunning: { type: Boolean },
      cacheDone: {},
      cacheTotal: {},
      cacheDisabled: { type: Boolean },
      visible: { type: Boolean, default: true }
    },
    emits: ["toggleDrawer", "toggleCache", "openSettings"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Transition, { name: "mnr-fade-slide" }, {
          default: withCtx(() => [
            __props.visible ? (openBlock(), createElementBlock("div", _hoisted_1$6, [
              createBaseVNode("button", {
                class: "mnr-fab",
                title: "目录 (Tab)",
                "aria-label": "打开目录",
                onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.$emit("toggleDrawer"), ["stop"]))
              }, [..._cache[3] || (_cache[3] = [
                createBaseVNode("span", { class: "mnr-icon" }, "☰", -1)
              ])]),
              createBaseVNode("div", _hoisted_2$6, [
                createBaseVNode("button", {
                  class: "mnr-fab",
                  title: "缓存本书",
                  "aria-label": "缓存管理",
                  disabled: __props.cacheDisabled,
                  onClick: _cache[1] || (_cache[1] = withModifiers(($event) => _ctx.$emit("toggleCache"), ["stop"]))
                }, [
                  createBaseVNode("span", _hoisted_4$6, toDisplayString(__props.cacheRunning ? "⏹" : "☁"), 1),
                  __props.cacheTotal > 0 ? (openBlock(), createElementBlock("span", _hoisted_5$5, toDisplayString(__props.cacheDone) + "/" + toDisplayString(__props.cacheTotal), 1)) : createCommentVNode("", true)
                ], 8, _hoisted_3$6),
                createBaseVNode("button", {
                  class: "mnr-fab",
                  title: "设置 (S)",
                  "aria-label": "打开设置",
                  onClick: _cache[2] || (_cache[2] = withModifiers(($event) => _ctx.$emit("openSettings"), ["stop"]))
                }, [..._cache[4] || (_cache[4] = [
                  createBaseVNode("span", { class: "mnr-icon" }, "⚙", -1)
                ])])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  });
  const FloatingToolbar = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-63e5b047"]]);
  const _hoisted_1$5 = { class: "mnr-drawer-header" };
  const _hoisted_2$5 = { class: "mnr-drawer-title" };
  const _hoisted_3$5 = {
    key: 0,
    class: "mnr-drawer-loading"
  };
  const _hoisted_4$5 = {
    key: 1,
    class: "mnr-drawer-empty"
  };
  const _hoisted_5$4 = {
    key: 0,
    class: "mnr-cache-progress-bar"
  };
  const _hoisted_6$4 = { class: "mnr-cache-progress-text" };
  const _hoisted_7$4 = { class: "mnr-cache-progress-track" };
  const _hoisted_8$4 = {
    key: 1,
    class: "mnr-cache-stats"
  };
  const _hoisted_9$4 = {
    key: 0,
    class: "mnr-stat-persisted"
  };
  const _hoisted_10$4 = {
    key: 1,
    class: "mnr-stat-session"
  };
  const _hoisted_11$4 = { class: "mnr-chapter-list" };
  const _hoisted_12$3 = ["onClick"];
  const _hoisted_13$3 = {
    key: 0,
    class: "mnr-persisted-icon",
    title: "已持久化"
  };
  const _hoisted_14$3 = {
    key: 1,
    class: "mnr-cached-icon",
    title: "临时缓存"
  };
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "ChapterDrawer",
    props: {
      isOpen: { type: Boolean },
      bookTitle: {},
      chapters: {},
      loading: { type: Boolean },
      cacheProgress: {}
    },
    emits: ["close", "select"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const contentRef = ref(null);
      const activeRef = ref(null);
      const persistedCount = computed(() => props.chapters.filter((ch) => ch.isPersisted).length);
      const sessionCount = computed(
        () => props.chapters.filter((ch) => ch.isCached && !ch.isPersisted).length
      );
      const scrollActiveIntoView = async (behavior = "auto") => {
        await nextTick();
        if (!props.isOpen || props.loading) return;
        const container = contentRef.value;
        if (!container) return;
        const active = container.querySelector("li.active") || activeRef.value;
        if (!active) return;
        activeRef.value = active;
        const targetTop = active.offsetTop - container.clientHeight / 2 + active.offsetHeight / 2;
        container.scrollTo({
          top: Math.max(targetTop, 0),
          behavior
        });
      };
      watch(
        () => props.isOpen,
        async (open) => {
          if (open) {
            await scrollActiveIntoView("smooth");
          }
        },
        { flush: "post" }
      );
      watch(
        () => [props.loading, props.chapters.length],
        async () => {
          await scrollActiveIntoView();
        },
        { flush: "post" }
      );
      watch(
        activeRef,
        async () => {
          await scrollActiveIntoView();
        },
        { flush: "post" }
      );
      function handleSelect(entry) {
        emit2("select", entry);
        emit2("close");
      }
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock(Fragment, null, [
          createVNode(Transition, { name: "mnr-fade" }, {
            default: withCtx(() => [
              __props.isOpen ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "mnr-drawer-overlay",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
              })) : createCommentVNode("", true)
            ]),
            _: 1
          }),
          createBaseVNode("aside", {
            class: normalizeClass(["mnr-drawer", { open: __props.isOpen }])
          }, [
            createBaseVNode("div", _hoisted_1$5, [
              createBaseVNode("h3", _hoisted_2$5, toDisplayString(__props.bookTitle || "目录"), 1),
              createBaseVNode("button", {
                class: "mnr-drawer-close",
                title: "关闭",
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
              }, "✕")
            ]),
            __props.loading ? (openBlock(), createElementBlock("div", _hoisted_3$5, [..._cache[2] || (_cache[2] = [
              createBaseVNode("div", { class: "mnr-loading-spinner small" }, null, -1),
              createBaseVNode("span", null, "加载目录中...", -1)
            ])])) : __props.chapters.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_4$5, [..._cache[3] || (_cache[3] = [
              createBaseVNode("p", null, "暂无目录", -1)
            ])])) : (openBlock(), createElementBlock("div", {
              key: 2,
              ref_key: "contentRef",
              ref: contentRef,
              class: "mnr-drawer-content"
            }, [
              __props.cacheProgress.running ? (openBlock(), createElementBlock("div", _hoisted_5$4, [
                createBaseVNode("div", _hoisted_6$4, " 缓存中: " + toDisplayString(__props.cacheProgress.done) + "/" + toDisplayString(__props.cacheProgress.total), 1),
                createBaseVNode("div", _hoisted_7$4, [
                  createBaseVNode("div", {
                    class: "mnr-cache-progress-fill",
                    style: normalizeStyle({
                      width: `${__props.cacheProgress.total > 0 ? __props.cacheProgress.done / __props.cacheProgress.total * 100 : 0}%`
                    })
                  }, null, 4)
                ])
              ])) : persistedCount.value > 0 || sessionCount.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_8$4, [
                persistedCount.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_9$4, [
                  _cache[4] || (_cache[4] = createBaseVNode("span", { class: "mnr-persisted-icon" }, "✓", -1)),
                  createTextVNode(" 已保存 " + toDisplayString(persistedCount.value) + " 章 ", 1)
                ])) : createCommentVNode("", true),
                sessionCount.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_10$4, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "mnr-cached-icon" }, "○", -1)),
                  createTextVNode(" 临时 " + toDisplayString(sessionCount.value) + " 章 ", 1)
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              createBaseVNode("ul", _hoisted_11$4, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.chapters, (ch) => {
                  return openBlock(), createElementBlock("li", {
                    key: ch.url,
                    ref_for: true,
                    ref: (el) => {
                      if (ch.isCurrent) {
                        activeRef.value = el;
                      }
                    },
                    class: normalizeClass({
                      active: ch.isCurrent,
                      cached: ch.isCached && !ch.isPersisted && !ch.isCurrent,
                      persisted: ch.isPersisted && !ch.isCurrent
                    }),
                    onClick: ($event) => handleSelect(ch)
                  }, [
                    ch.isPersisted ? (openBlock(), createElementBlock("span", _hoisted_13$3, "✓")) : ch.isCached ? (openBlock(), createElementBlock("span", _hoisted_14$3, "○")) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(ch.title), 1)
                  ], 10, _hoisted_12$3);
                }), 128))
              ])
            ], 512))
          ], 2)
        ], 64);
      };
    }
  });
  const ChapterDrawer = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-6d373c76"]]);
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
  const _hoisted_12$2 = { class: "mnr-slider-row" };
  const _hoisted_13$2 = ["value"];
  const _hoisted_14$2 = { class: "mnr-slider-value" };
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
  const _hoisted_30 = { class: "mnr-rule-row" };
  const _hoisted_31 = { class: "mnr-cache-row" };
  const _hoisted_32 = {
    key: 0,
    class: "mnr-cache-progress"
  };
  const _hoisted_33 = { class: "mnr-cache-count" };
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "SettingsPanel",
    props: {
      visible: { type: Boolean },
      domain: {}
    },
    emits: ["close", "editRule", "resetRule", "cacheAll", "textConversionChange"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const configStore = useConfigStore();
      const readerStore = useReaderStore();
      const ruleStore = useRuleStore();
      const hasUserRule = computed(() => {
        if (!props.domain) return false;
        return ruleStore.hasUserRule(props.domain);
      });
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
      const cacheProgress = computed(() => readerStore.cacheProgress);
      const persistedCount = computed(() => readerStore.persistedUrls.size);
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
      async function handleClearCache() {
        if (window.confirm("确定要清除本书的缓存吗？")) {
          await readerStore.clearPersistedCache();
        }
      }
      async function handleResetRule() {
        if (window.confirm("确定要重置站点规则吗？将恢复为默认/自动检测。")) {
          if (props.domain) {
            await ruleStore.deleteUserRule(props.domain);
            emit2("resetRule");
          }
        }
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
              onClick: _cache[16] || (_cache[16] = withModifiers(($event) => _ctx.$emit("close"), ["self"]))
            }, [
              createBaseVNode("div", _hoisted_1$4, [
                createBaseVNode("div", _hoisted_2$4, [
                  _cache[17] || (_cache[17] = createBaseVNode("h3", null, "阅读设置", -1)),
                  _cache[18] || (_cache[18] = createBaseVNode("span", { class: "mnr-shortcut-hint" }, "S", -1)),
                  createBaseVNode("button", {
                    class: "mnr-close-btn",
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
                  }, "✕")
                ]),
                createBaseVNode("div", _hoisted_3$4, [
                  createBaseVNode("section", _hoisted_4$4, [
                    _cache[19] || (_cache[19] = createBaseVNode("h4", null, "主题", -1)),
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
                    _cache[22] || (_cache[22] = createBaseVNode("h4", null, "字体大小", -1)),
                    createBaseVNode("div", _hoisted_8$3, [
                      _cache[20] || (_cache[20] = createBaseVNode("span", { class: "mnr-slider-label" }, "A", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "14",
                        max: "28",
                        value: fontSize.value,
                        class: "mnr-slider",
                        onInput: updateFontSize
                      }, null, 40, _hoisted_9$3),
                      _cache[21] || (_cache[21] = createBaseVNode("span", {
                        class: "mnr-slider-label",
                        style: { "font-size": "1.2em" }
                      }, "A", -1)),
                      createBaseVNode("span", _hoisted_10$3, toDisplayString(fontSize.value) + "px", 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_11$3, [
                    _cache[25] || (_cache[25] = createBaseVNode("h4", null, "行间距", -1)),
                    createBaseVNode("div", _hoisted_12$2, [
                      _cache[23] || (_cache[23] = createBaseVNode("span", { class: "mnr-slider-label" }, "≡", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "1.4",
                        max: "2.4",
                        step: "0.1",
                        value: lineHeight.value,
                        class: "mnr-slider",
                        onInput: updateLineHeight
                      }, null, 40, _hoisted_13$2),
                      _cache[24] || (_cache[24] = createBaseVNode("span", { class: "mnr-slider-label" }, "☰", -1)),
                      createBaseVNode("span", _hoisted_14$2, toDisplayString(lineHeight.value), 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_15$2, [
                    _cache[28] || (_cache[28] = createBaseVNode("h4", null, "内容宽度", -1)),
                    createBaseVNode("div", _hoisted_16$1, [
                      _cache[26] || (_cache[26] = createBaseVNode("span", { class: "mnr-slider-label" }, "⊏⊐", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "500",
                        max: "1200",
                        step: "50",
                        value: maxWidth.value,
                        class: "mnr-slider",
                        onInput: updateMaxWidth
                      }, null, 40, _hoisted_17$1),
                      _cache[27] || (_cache[27] = createBaseVNode("span", { class: "mnr-slider-label" }, "⊏ ⊐", -1)),
                      createBaseVNode("span", _hoisted_18$1, toDisplayString(maxWidth.value) + "px", 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_19$1, [
                    _cache[30] || (_cache[30] = createBaseVNode("h4", null, "字体", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => fontFamily.value = $event),
                      class: "mnr-select",
                      onChange: updateFontFamily
                    }, [..._cache[29] || (_cache[29] = [
                      createBaseVNode("option", { value: "system-ui, -apple-system, 'Microsoft YaHei', sans-serif" }, " 系统默认 ", -1),
                      createBaseVNode("option", { value: "'Noto Serif SC', 'Source Han Serif SC', serif" }, "思源宋体", -1),
                      createBaseVNode("option", { value: "'PingFang SC', 'Hiragino Sans GB', sans-serif" }, "苹方", -1),
                      createBaseVNode("option", { value: "'Kaiti SC', 'STKaiti', serif" }, "楷体", -1)
                    ])], 544), [
                      [vModelSelect, fontFamily.value]
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_20$1, [
                    _cache[31] || (_cache[31] = createBaseVNode("h4", null, "简繁转换", -1)),
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
                    _cache[36] || (_cache[36] = createBaseVNode("h4", null, "阅读行为", -1)),
                    createBaseVNode("label", _hoisted_24$1, [
                      _cache[32] || (_cache[32] = createBaseVNode("span", null, "键盘导航", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => keyboardNav.value = $event),
                        type: "checkbox",
                        onChange: _cache[6] || (_cache[6] = ($event) => updateBehavior("keyboardNavigation", keyboardNav.value))
                      }, null, 544), [
                        [vModelCheckbox, keyboardNav.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_25$1, [
                      _cache[33] || (_cache[33] = createBaseVNode("span", null, "手势翻页", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => swipeGestures.value = $event),
                        type: "checkbox",
                        onChange: _cache[8] || (_cache[8] = ($event) => updateBehavior("swipeGestures", swipeGestures.value))
                      }, null, 544), [
                        [vModelCheckbox, swipeGestures.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_26$1, [
                      _cache[34] || (_cache[34] = createBaseVNode("span", null, "自动隐藏顶栏", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => autoHideHeader.value = $event),
                        type: "checkbox",
                        onChange: _cache[10] || (_cache[10] = ($event) => updateBehavior("autoHideHeader", autoHideHeader.value))
                      }, null, 544), [
                        [vModelCheckbox, autoHideHeader.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_27$1, [
                      _cache[35] || (_cache[35] = createBaseVNode("span", null, "显示阅读进度", -1)),
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
                    _cache[39] || (_cache[39] = createBaseVNode("h4", null, "操作", -1)),
                    createBaseVNode("div", _hoisted_29, [
                      createBaseVNode("div", _hoisted_30, [
                        createBaseVNode("button", {
                          class: "mnr-action-btn",
                          onClick: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("editRule"))
                        }, "编辑站点规则"),
                        hasUserRule.value ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "mnr-action-btn mnr-action-btn--danger",
                          onClick: handleResetRule
                        }, " 重置 ")) : createCommentVNode("", true)
                      ]),
                      createBaseVNode("div", _hoisted_31, [
                        createBaseVNode("button", {
                          class: "mnr-action-btn",
                          onClick: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("cacheAll"))
                        }, [
                          _cache[37] || (_cache[37] = createTextVNode(" 缓存本书 ", -1)),
                          cacheProgress.value.total > 0 ? (openBlock(), createElementBlock("span", _hoisted_32, toDisplayString(cacheProgress.value.done) + "/" + toDisplayString(cacheProgress.value.total), 1)) : createCommentVNode("", true)
                        ]),
                        persistedCount.value > 0 ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "mnr-action-btn mnr-action-btn--danger",
                          onClick: handleClearCache
                        }, [
                          _cache[38] || (_cache[38] = createTextVNode(" 清除 ", -1)),
                          createBaseVNode("span", _hoisted_33, "(" + toDisplayString(persistedCount.value) + ")", 1)
                        ])) : createCommentVNode("", true)
                      ]),
                      createBaseVNode("button", {
                        class: "mnr-action-btn",
                        onClick: _cache[15] || (_cache[15] = ($event) => {
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
  const _hoisted_12$1 = { class: "mnr-preview-content-header" };
  const _hoisted_13$1 = ["innerHTML"];
  const _hoisted_14$1 = {
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
            createBaseVNode("div", _hoisted_12$1, [
              _cache[3] || (_cache[3] = createBaseVNode("span", null, "预览", -1)),
              createBaseVNode("button", {
                class: "mnr-preview-expand",
                onClick: _cache[2] || (_cache[2] = ($event) => expanded.value = !expanded.value)
              }, toDisplayString(expanded.value ? "收起" : "展开"), 1)
            ]),
            createBaseVNode("div", {
              class: normalizeClass(["mnr-preview-text", { expanded: expanded.value }]),
              innerHTML: sanitizedPreview.value
            }, null, 10, _hoisted_13$1)
          ])) : createCommentVNode("", true),
          (openBlock(), createBlock(Teleport, { to: "body" }, [
            isHighlighting.value && highlightRects.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_14$1, [
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
  const _hoisted_12 = { class: "mnr-form-section" };
  const _hoisted_13 = { class: "mnr-editor-content" };
  const _hoisted_14 = { class: "mnr-code-toolbar" };
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
        const plainRule = JSON.parse(JSON.stringify(toRaw(localRule)));
        emit2("save", plainRule);
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
            createBaseVNode("div", _hoisted_12, [
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
          withDirectives(createBaseVNode("div", _hoisted_13, [
            createBaseVNode("div", _hoisted_14, [
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
  const RuleEditorPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-15d78857"]]);
  const _hoisted_1 = { class: "mnr-reader" };
  const _hoisted_2 = {
    key: 0,
    class: "mnr-loading-prev"
  };
  const _hoisted_3 = ["data-chapter-url"];
  const _hoisted_4 = { class: "mnr-chapter-title" };
  const _hoisted_5 = ["innerHTML"];
  const _hoisted_6 = {
    key: 1,
    class: "mnr-loading-next"
  };
  const _hoisted_7 = {
    key: 2,
    class: "mnr-chapter-end"
  };
  const _hoisted_8 = { class: "mnr-chapter-nav" };
  const _hoisted_9 = ["href"];
  const _hoisted_10 = { class: "mnr-rule-editor-container" };
  const _hoisted_11 = {
    key: 2,
    class: "mnr-loading-overlay"
  };
  const SCROLL_THROTTLE_MS = 16;
  const INTERSECTION_ROOT_MARGIN = "800px";
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "ReaderView",
    setup(__props) {
      function throttle(fn, delay) {
        let lastCall = 0;
        let timeoutId = null;
        return ((...fnArgs) => {
          const now = Date.now();
          const remaining = delay - (now - lastCall);
          if (remaining <= 0) {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            lastCall = now;
            fn(...fnArgs);
          } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
              lastCall = Date.now();
              timeoutId = null;
              fn(...fnArgs);
            }, remaining);
          }
        });
      }
      const readerStore = useReaderStore();
      const configStore = useConfigStore();
      const ruleStore = useRuleStore();
      const mainRef = ref(null);
      const topSentinel = ref(null);
      const bottomSentinel = ref(null);
      const settingsVisible = ref(false);
      const ruleEditorVisible = ref(false);
      const isPickerActive = ref(false);
      const drawerOpen = ref(false);
      const isNavigating = ref(false);
      const showControls = ref(true);
      const chapterRefs = /* @__PURE__ */ new Map();
      let topObserver = null;
      let bottomObserver = null;
      let lastScrollTop = 0;
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
      const currentRule = computed(() => readerStore.rule);
      const currentDomain = computed(() => {
        try {
          return new URL(window.location.href).hostname;
        } catch {
          return "";
        }
      });
      const chapters = computed(() => readerStore.chapters);
      const {
        visibleChapters,
        topSpacer,
        bottomSpacer,
        heights: chapterHeights,
        averageHeight,
        setHeight: setChapterHeight,
        updateWindow
      } = useVirtualChapters(chapters, {
        windowSize: 5,
        overscan: 2
      });
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
      const toastType = computed(() => readerStore.toastType);
      const showProgress = computed(() => configStore.behavior.showProgress);
      const cacheProgress = computed(() => readerStore.cacheProgress);
      const autoHideHeader = computed(() => configStore.behavior.autoHideHeader);
      const keyboardEnabled = computed(
        () => configStore.behavior.keyboardNavigation && !isPickerActive.value
      );
      function navigate(direction) {
        if (indexUrl.value) {
          window.location.href = indexUrl.value;
        }
      }
      function toggleDrawer() {
        drawerOpen.value = !drawerOpen.value;
        if (drawerOpen.value) {
          readerStore.loadToc();
        }
      }
      function handleChapterSelect(entry) {
        if (entry.isCached) {
          jumpToCachedChapter(entry.url);
        } else {
          window.location.href = entry.url;
        }
      }
      async function jumpToCachedChapter(url) {
        var _a;
        const existingIndex = readerStore.chapters.findIndex((entry) => entry.chapter.url === url);
        if (existingIndex >= 0) {
          readerStore.setCurrentChapter(existingIndex);
          scrollToChapter(existingIndex);
          return;
        }
        const success = await readerStore.rebuildChaptersAround(url);
        if (success) {
          window.history.replaceState({ mnrChapter: 0 }, "", url);
          (_a = mainRef.value) == null ? void 0 : _a.scrollTo({ top: 0, behavior: "auto" });
        } else {
          window.location.href = url;
        }
      }
      function scrollToChapter(index) {
        const chapterEl = chapterRefs.get(index);
        if (chapterEl) {
          chapterEl.scrollIntoView({ behavior: "smooth", block: "start" });
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
          return;
        }
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          showControls.value = !showControls.value;
        }
      }
      function clearError() {
        readerStore.clearError();
      }
      function openRuleEditor() {
        settingsVisible.value = false;
        ruleEditorVisible.value = true;
        showControls.value = false;
      }
      async function handleRuleSave(rule) {
        if (currentDomain.value) {
          try {
            await ruleStore.saveUserRule(currentDomain.value, rule);
            await readerStore.reloadCurrentChapter();
          } catch (e) {
            console.error("[MNR] Save rule error:", e);
            readerStore.showToast("保存失败", "error");
          }
        }
        ruleEditorVisible.value = false;
      }
      async function handleRuleReset() {
        settingsVisible.value = false;
        await readerStore.reloadCurrentChapter();
      }
      function openSettings() {
        settingsVisible.value = true;
        showControls.value = false;
      }
      async function handleTextConversionChange(mode) {
        await readerStore.applyTextConversion(mode);
      }
      function handleCacheAll() {
        readerStore.startCacheAll();
      }
      function toggleCacheAll() {
        if (cacheProgress.value.running) {
          readerStore.cancelCacheAll();
        } else {
          readerStore.startCacheAll();
        }
      }
      function setChapterRef(index) {
        return (el) => {
          if (!el) {
            chapterRefs.delete(index);
            return;
          }
          chapterRefs.set(index, el);
          const entry = visibleChapters.value.find((c) => c.index === index);
          if (entry) {
            setChapterHeight(entry.chapter.url, el.offsetHeight);
          }
        };
      }
      function estimateIndexFromOffset(offset) {
        if (chapters.value.length === 0) return -1;
        let acc = 0;
        for (let i = 0; i < chapters.value.length; i++) {
          const url = chapters.value[i].chapter.url;
          const height = chapterHeights.value.get(url) ?? averageHeight.value;
          acc += height;
          if (offset < acc) {
            return i;
          }
        }
        return chapters.value.length - 1;
      }
      function handleScrollCore() {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        const currentScrollY = mainEl.scrollTop;
        const scrollHeight = mainEl.scrollHeight - mainEl.clientHeight;
        if (autoHideHeader.value) {
          if (currentScrollY > lastScrollTop && currentScrollY > 100) {
            showControls.value = false;
          } else if (currentScrollY < lastScrollTop - 20) {
            showControls.value = true;
          }
        }
        lastScrollTop = currentScrollY;
        let currentChapterEl = null;
        let currentChapterIdx = -1;
        let maxVisibleHeight = 0;
        const viewportTop = currentScrollY;
        const viewportBottom = currentScrollY + mainEl.clientHeight;
        for (const entry of visibleChapters.value) {
          const el = chapterRefs.get(entry.index);
          if (!el) continue;
          const elTop = el.offsetTop;
          const elHeight = el.offsetHeight;
          const elBottom = elTop + elHeight;
          setChapterHeight(entry.chapter.url, elHeight);
          const visibleTop = Math.max(elTop, viewportTop);
          const visibleBottom = Math.min(elBottom, viewportBottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentChapterIdx = entry.index;
            currentChapterEl = el;
          }
        }
        if (!currentChapterEl || currentChapterIdx === -1) {
          const estimatedIdx = estimateIndexFromOffset(currentScrollY + mainEl.clientHeight / 2);
          if (estimatedIdx !== -1) {
            readerStore.setCurrentChapter(estimatedIdx);
            updateWindow(estimatedIdx);
            if (scrollHeight > 0) {
              const overallPercent = Math.round(currentScrollY / scrollHeight * 100);
              readerStore.updateScroll(overallPercent);
            }
          }
          return;
        }
        readerStore.setCurrentChapter(currentChapterIdx);
        updateWindow(currentChapterIdx);
        if (scrollHeight > 0) {
          const overallPercent = Math.round(currentScrollY / scrollHeight * 100);
          readerStore.updateScroll(overallPercent);
        }
      }
      const handleScroll = throttle(handleScrollCore, SCROLL_THROTTLE_MS);
      async function loadPrevWithScrollAdjust(jumpToStart = false) {
        const mainEl = mainRef.value;
        if (!mainEl || isLoadingPrev.value) return;
        const oldScrollTop = mainEl.scrollTop;
        const oldTopSpacer = topSpacer.value;
        const success = await readerStore.loadPrevChapter();
        if (success) {
          await nextTick();
          updateWindow(readerStore.currentChapterIndex);
          await nextTick();
          await new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve()));
          if (jumpToStart) {
            await jumpToChapter(0, "auto");
            return;
          }
          const chapterEls = mainEl.querySelectorAll(".mnr-reader-content");
          if (chapterEls.length > 0) {
            const newChapterEl = chapterEls[0];
            const newChapterHeight = newChapterEl.offsetHeight;
            const newEntry = readerStore.chapters[0];
            if (newEntry) {
              setChapterHeight(newEntry.chapter.url, newChapterHeight);
            }
            await nextTick();
            const spacerDelta = topSpacer.value - oldTopSpacer;
            mainEl.scrollTop = oldScrollTop + newChapterHeight + spacerDelta;
          }
        }
      }
      function handleWheel(e) {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        if (e.deltaY < 0 && mainEl.scrollTop <= 0 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
          loadPrevWithScrollAdjust();
        }
      }
      function handleEscape() {
        if (drawerOpen.value) {
          drawerOpen.value = false;
        } else if (ruleEditorVisible.value) {
          ruleEditorVisible.value = false;
        } else if (settingsVisible.value) {
          settingsVisible.value = false;
        }
      }
      function toggleSettings() {
        if (!ruleEditorVisible.value) {
          settingsVisible.value = !settingsVisible.value;
        }
      }
      function toggleRuleEditor() {
        if (!settingsVisible.value) {
          ruleEditorVisible.value = !ruleEditorVisible.value;
        }
      }
      useKeyboardShortcuts(
        [
          // Escape - close panels (works in inputs too)
          {
            key: "escape",
            handler: handleEscape,
            allowInInputs: true
          },
          // Tab - toggle chapter drawer
          {
            key: "tab",
            handler: toggleDrawer,
            preventDefault: true
          },
          // Enter - go to index page
          {
            key: "enter",
            handler: () => {
              if (indexUrl.value) {
                window.location.href = indexUrl.value;
              }
            },
            preventDefault: true
          },
          // S or , - toggle settings
          {
            key: ["s", ","],
            handler: toggleSettings,
            preventDefault: true
          },
          // E - toggle rule editor
          {
            key: "e",
            handler: toggleRuleEditor,
            preventDefault: true
          },
          // Q - exit reader
          {
            key: "q",
            handler: exitReader,
            preventDefault: true,
            stopPropagation: true
          },
          // Left arrow or P - previous chapter
          {
            key: ["arrowleft", "p"],
            handler: () => navigateChapter("prev"),
            preventDefault: true,
            stopPropagation: true
          },
          // Right arrow or N - next chapter
          {
            key: ["arrowright", "n"],
            handler: () => navigateChapter("next"),
            preventDefault: true,
            stopPropagation: true
          },
          // Up arrow - scroll up
          {
            key: "arrowup",
            handler: () => scrollReader("up"),
            preventDefault: true
          },
          // Down arrow - scroll down
          {
            key: "arrowdown",
            handler: () => scrollReader("down"),
            preventDefault: true
          },
          // Space - page scroll
          {
            key: " ",
            handler: (e) => scrollReader(e.shiftKey ? "pageup" : "pagedown"),
            preventDefault: true
          }
        ],
        { enabled: keyboardEnabled }
      );
      function scrollReader(direction) {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        const step = 150;
        const pageHeight = mainEl.clientHeight * 0.9;
        let top = 0;
        let behavior = "auto";
        switch (direction) {
          case "up": {
            if (mainEl.scrollTop <= 4 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
              loadPrevWithScrollAdjust(true);
              return;
            }
            top = -step;
            break;
          }
          case "down":
            top = step;
            break;
          case "pageup": {
            if (mainEl.scrollTop <= 4 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
              loadPrevWithScrollAdjust(true);
              return;
            }
            top = -pageHeight;
            behavior = "smooth";
            break;
          }
          case "pagedown":
            top = pageHeight;
            behavior = "smooth";
            break;
        }
        mainEl.scrollBy({ top, behavior });
      }
      async function navigateChapter(direction) {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        const currentIdx = readerStore.currentChapterIndex;
        const chaptersCount = readerStore.chapters.length;
        if (isNavigating.value) {
          return;
        }
        if (direction === "prev") {
          if (currentIdx > 0) {
            jumpToChapter(currentIdx - 1);
          } else if (hasPrev.value && !isLoadingPrev.value) {
            const success = await readerStore.loadPrevChapter();
            if (success) {
              globalThis.requestAnimationFrame(() => jumpToChapter(0, "auto"));
            }
          } else if (!hasPrev.value) {
            readerStore.showToast("已经是第一章了", "info");
          }
        } else {
          if (currentIdx < chaptersCount - 1) {
            jumpToChapter(currentIdx + 1);
          } else if (hasNext.value && !isLoadingNext.value) {
            const success = await readerStore.loadNextChapter();
            if (success) {
              globalThis.requestAnimationFrame(() => jumpToChapter(readerStore.chapters.length - 1));
            }
          } else if (!hasNext.value) {
            readerStore.showToast("已经是最后一章了", "info");
          }
        }
      }
      async function jumpToChapter(index, behavior = "smooth") {
        const mainEl = mainRef.value;
        if (!mainEl) return;
        if (index < 0 || index >= chapters.value.length) return;
        isNavigating.value = true;
        updateWindow(index);
        await nextTick();
        await new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve()));
        const targetEl = chapterRefs.get(index);
        if (!targetEl) {
          isNavigating.value = false;
          return;
        }
        const containerRect = mainEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const targetOffset = targetRect.top - containerRect.top + mainEl.scrollTop;
        mainEl.scrollTo({
          top: targetOffset,
          behavior
        });
        readerStore.setCurrentChapter(index);
        if (behavior === "smooth") {
          setTimeout(() => {
            isNavigating.value = false;
          }, 200);
        } else {
          globalThis.requestAnimationFrame(() => {
            isNavigating.value = false;
          });
        }
      }
      function exitReader() {
        closeReader();
      }
      onMounted(async () => {
        var _a;
        configStore.applyAll();
        const textConversion = configStore.reading.textConversion;
        if (textConversion !== "none") {
          await readerStore.applyTextConversion(textConversion);
        }
        if (mainRef.value) {
          mainRef.value.addEventListener("scroll", handleScroll, { passive: true });
          mainRef.value.addEventListener("wheel", handleWheel, { passive: true });
        }
        const observerOptions = {
          root: mainRef.value,
          rootMargin: INTERSECTION_ROOT_MARGIN,
          threshold: 0
        };
        bottomObserver = new globalThis.IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNext.value && !isLoadingNext.value && !isNavigating.value) {
            readerStore.loadNextChapter();
          }
        }, observerOptions);
        topObserver = new globalThis.IntersectionObserver(() => {
        }, observerOptions);
        if (bottomSentinel.value) {
          bottomObserver.observe(bottomSentinel.value);
        }
        if (topSentinel.value) {
          topObserver.observe(topSentinel.value);
        }
        await nextTick();
        (_a = mainRef.value) == null ? void 0 : _a.focus();
      });
      onUnmounted(() => {
        if (mainRef.value) {
          mainRef.value.removeEventListener("scroll", handleScroll);
          mainRef.value.removeEventListener("wheel", handleWheel);
        }
        topObserver == null ? void 0 : topObserver.disconnect();
        bottomObserver == null ? void 0 : bottomObserver.disconnect();
        topObserver = null;
        bottomObserver = null;
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1, [
          showProgress.value ? (openBlock(), createBlock(ProgressIndicator, {
            key: 0,
            "auto-hide": true
          })) : createCommentVNode("", true),
          createVNode(FloatingToolbar, {
            visible: showControls.value,
            "cache-running": cacheProgress.value.running,
            "cache-done": cacheProgress.value.done,
            "cache-total": cacheProgress.value.total,
            "cache-disabled": cacheProgress.value.running && cacheProgress.value.total === 0,
            onToggleDrawer: toggleDrawer,
            onToggleCache: toggleCacheAll,
            onOpenSettings: openSettings
          }, null, 8, ["visible", "cache-running", "cache-done", "cache-total", "cache-disabled"]),
          createVNode(ChapterDrawer, {
            "is-open": drawerOpen.value,
            "book-title": bookTitle.value,
            chapters: unref(readerStore).tocWithStatus,
            loading: unref(readerStore).tocLoading,
            "cache-progress": cacheProgress.value,
            onClose: _cache[0] || (_cache[0] = ($event) => drawerOpen.value = false),
            onSelect: handleChapterSelect
          }, null, 8, ["is-open", "book-title", "chapters", "loading", "cache-progress"]),
          createBaseVNode("main", {
            ref_key: "mainRef",
            ref: mainRef,
            class: "mnr-reader-main",
            tabindex: "-1"
          }, [
            createBaseVNode("div", {
              ref_key: "topSentinel",
              ref: topSentinel,
              class: "mnr-sentinel"
            }, null, 512),
            isLoadingPrev.value ? (openBlock(), createElementBlock("div", _hoisted_2, [..._cache[5] || (_cache[5] = [
              createBaseVNode("div", { class: "mnr-loading-spinner small" }, null, -1),
              createBaseVNode("span", null, "加载上一章...", -1)
            ])])) : createCommentVNode("", true),
            createBaseVNode("div", {
              style: normalizeStyle({ height: `${unref(topSpacer)}px` })
            }, null, 4),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(visibleChapters), (entry) => {
              return openBlock(), createElementBlock("article", {
                key: entry.id,
                ref_for: true,
                ref: setChapterRef(entry.index),
                class: "mnr-reader-content",
                "data-chapter-url": entry.chapter.url,
                onClick: handleContentClick
              }, [
                createBaseVNode("h1", _hoisted_4, toDisplayString(entry.chapter.title), 1),
                createBaseVNode("div", {
                  innerHTML: entry.chapter.content
                }, null, 8, _hoisted_5)
              ], 8, _hoisted_3);
            }), 128)),
            createBaseVNode("div", {
              style: normalizeStyle({ height: `${unref(bottomSpacer)}px` })
            }, null, 4),
            createBaseVNode("div", {
              ref_key: "bottomSentinel",
              ref: bottomSentinel,
              class: "mnr-sentinel"
            }, null, 512),
            isLoadingNext.value ? (openBlock(), createElementBlock("div", _hoisted_6, [..._cache[6] || (_cache[6] = [
              createBaseVNode("div", { class: "mnr-loading-spinner small" }, null, -1),
              createBaseVNode("span", null, "加载下一章...", -1)
            ])])) : createCommentVNode("", true),
            chapters.value.length > 0 && !hasNext.value && !isLoadingNext.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
              _cache[7] || (_cache[7] = createBaseVNode("p", { class: "mnr-chapter-end-text" }, "— 已是最后一章 —", -1)),
              createBaseVNode("div", _hoisted_8, [
                indexUrl.value ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  href: indexUrl.value,
                  class: "mnr-chapter-link index",
                  onClick: _cache[1] || (_cache[1] = withModifiers(($event) => navigate(), ["prevent"]))
                }, " 返回目录 ", 8, _hoisted_9)) : createCommentVNode("", true)
              ])
            ])) : createCommentVNode("", true)
          ], 512),
          createVNode(_sfc_main$4, {
            visible: settingsVisible.value,
            domain: currentDomain.value,
            onClose: _cache[2] || (_cache[2] = ($event) => settingsVisible.value = false),
            onEditRule: openRuleEditor,
            onResetRule: handleRuleReset,
            onTextConversionChange: handleTextConversionChange,
            onCacheAll: handleCacheAll
          }, null, 8, ["visible", "domain"]),
          ruleEditorVisible.value ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["mnr-rule-editor-overlay", { "mnr-overlay-hidden": isPickerActive.value }])
          }, [
            createBaseVNode("div", _hoisted_10, [
              createVNode(RuleEditorPanel, {
                rule: currentRule.value,
                domain: currentDomain.value,
                onSave: handleRuleSave,
                onCancel: _cache[3] || (_cache[3] = ($event) => ruleEditorVisible.value = false),
                onPickerStateChange: _cache[4] || (_cache[4] = ($event) => isPickerActive.value = $event)
              }, null, 8, ["rule", "domain"])
            ])
          ], 2)) : createCommentVNode("", true),
          isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_11, [..._cache[8] || (_cache[8] = [
            createBaseVNode("div", { class: "mnr-loading-spinner" }, null, -1),
            createBaseVNode("span", null, "加载中...", -1)
          ])])) : createCommentVNode("", true),
          createVNode(Transition, { name: "mnr-toast" }, {
            default: withCtx(() => [
              error.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["mnr-toast", { "mnr-toast--error": toastType.value === "error" }]),
                onClick: clearError
              }, toDisplayString(error.value), 3)) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const ReaderView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-77ee432d"]]);
  const appState = {
    isInitialized: false,
    isActive: false,
    currentDecision: null,
    originalUrl: null
  };
  let app = null;
  let pinia = null;
  let readerCleanup = null;
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
    const skipFlag = sessionStorage.getItem("mnr_skip_auto_enable");
    if (skipFlag) {
      sessionStorage.removeItem("mnr_skip_auto_enable");
      const flagTime = parseInt(skipFlag, 10);
      if (!isNaN(flagTime) && Date.now() - flagTime < 5e3) {
        showFloatingButton();
        return;
      }
    }
    const manager = getAutoEnableManager({
      enableProtection: true
    });
    const decision = await manager.check(document);
    appState.currentDecision = decision;
    if (decision.method === "user-disabled" || decision.showFloatingButton) {
      showFloatingButton();
      return;
    }
    if (!decision.shouldEnable) {
      return;
    }
    manager.setPromptCallback(showPrompt);
    manager.setLaunchCallback(launchReader);
    await manager.execute(document);
  }
  async function showPrompt(decision) {
    return new Promise((resolve) => {
      const { mountPoint, cleanup } = createShadowMount("mnr-prompt-root");
      const showPrompt2 = ref(true);
      const PromptWrapper = /* @__PURE__ */ defineComponent({
        setup() {
          const handleRespond = (response) => {
            showPrompt2.value = false;
            setTimeout(() => {
              cleanup();
              resolve(response);
            }, 300);
          };
          const handleDismiss = () => {
            showPrompt2.value = false;
            setTimeout(() => {
              cleanup();
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
      promptApp.mount(mountPoint);
    });
  }
  function launchReader(chapter, rule) {
    if (!pinia) {
      console.error("[MNR] Pinia not initialized");
      return;
    }
    appState.originalUrl = window.location.href;
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
    const { mountPoint, cleanup } = createShadowMount("mnr-reader-root");
    readerCleanup = cleanup;
    app = createApp(ReaderView);
    app.use(pinia);
    app.mount(mountPoint);
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
    try {
      const hostname = new URL(window.location.href).hostname;
      const storage = getRuleStorage();
      storage.setSitePreference(hostname, { enabled: false, timestamp: Date.now() });
    } catch (e) {
      console.error("[MNR] Failed to save site preference:", e);
    }
    let targetUrl = null;
    if (pinia) {
      const readerStore = useReaderStore(pinia);
      const currentIndex = readerStore.currentChapterIndex;
      const chapter = readerStore.chapters[currentIndex];
      if (chapter == null ? void 0 : chapter.chapter.url) {
        targetUrl = chapter.chapter.url;
      }
    }
    const originalUrl = appState.originalUrl;
    if (app) {
      app.unmount();
      app = null;
    }
    if (readerCleanup) {
      readerCleanup();
      readerCleanup = null;
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
    appState.originalUrl = null;
    if (targetUrl && originalUrl && targetUrl !== originalUrl) {
      sessionStorage.setItem("mnr_skip_auto_enable", Date.now().toString());
      window.location.href = targetUrl;
      return;
    }
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
