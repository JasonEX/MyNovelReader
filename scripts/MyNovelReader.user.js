// ==UserScript==
// @name         My Novel Reader
// @namespace    https://github.com/ywzhaiqi
// @version      9.0.11
// @author       ywzhaiqi
// @description  小说阅读脚本，统一阅读样式，内容去广告、修正拼音字、段落整理，自动下一页
// @license      GPL version 3
// @homepage     https://github.com/ywzhaiqi/userscript#readme
// @homepageURL  https://greasyfork.org/scripts/292/
// @source       https://github.com/ywzhaiqi/userscript.git
// @supportURL   https://github.com/JasonEX/MyNovelReader/issues
// @match        *://*/*.html
// @match        *://*/*.htm
// @match        *://*/*.shtml
// @match        *://*/*/*.html
// @match        *://*/*/*.htm
// @match        *://*/*/*/*.html
// @match        *://*/*/*/*.htm
// @match        *://*/*/*/*/*.html
// @match        *://*/txt/*/*
// @match        *://*/book/*/*
// @match        *://*/read/*/*
// @match        *://*/chapter/*/*
// @match        *://*/novel/*/*
// @match        *://*/xs_*/*/*
// @match        *://*/xs_*/*/*/*
// @match        *://*/gb_*/*/*
// @match        *://*/gb_*/*/*/*
// @match        *://www.qidian.com/chapter/*/*
// @match        *://m.qidian.com/chapter/*/*
// @match        *://read.qidian.com/chapter/*
// @match        *://vipreader.qidian.com/chapter/*/*
// @match        *://book.zongheng.com/chapter/*/*.html
// @match        *://read.zongheng.com/chapter/*/*.html
// @match        *://www.17k.com/chapter/*/*.html
// @match        *://book.sfacg.com/Novel/*/*/*/
// @match        *://weread.qq.com/web/reader/*
// @match        *://www.ciweimao.com/chapter/*
// @match        *://wap.ciweimao.com/chapter/*
// @match        *://www.tadu.com/book/*/*/
// @match        *://tieba.baidu.com/p/*
// @match        *://masiro.me/admin/novelReading*
// @match        *://dingdianzww.org/*
// @match        *://www.dingdianzww.org/*
// @match        *://deqixs.org/*
// @match        *://www.deqixs.org/*
// @match        *://deqixs.co/*
// @match        *://www.deqixs.co/*
// @match        *://*/*.php?*
// @match        *://*/*_*.html
// @match        *://*/book/*/*.html
// @match        *://*/chapter/*/*.html
// @match        *://*/read/*/*.html
// @exclude      *://*/*/index.html
// @exclude      *://*/*/list.html
// @exclude      *://*/*/catalog.html
// @exclude      *://*/search/*
// @exclude      *://*/login*
// @exclude      *://*/register*
// @exclude      *://www.tadu.com/book/*/toc/
// @connect      *
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  (function() {
    (function(cssCode) {
      try {
        if (typeof window !== "undefined") {
          const w = window;
          const globalState = w.__MY_NOVEL_READER__ || (w.__MY_NOVEL_READER__ = {});
          globalState.styles = (globalState.styles || "") + cssCode;
          var styleId = "mnr-global-styles";
          var injectGlobalStyle = function() {
            var existingStyle = document.getElementById(styleId);
            if (!existingStyle) {
              var parent = document.head || document.documentElement;
              if (!parent) return false;
              existingStyle = document.createElement("style");
              existingStyle.id = styleId;
              parent.appendChild(existingStyle);
            }
            existingStyle.textContent = globalState.styles;
            return true;
          };
          if (!injectGlobalStyle()) {
            document.addEventListener(
              "DOMContentLoaded",
              function() {
                injectGlobalStyle();
              },
              { once: true }
            );
          }
          if (globalState.shadowRoot) {
            var shadowStyle = globalState.shadowRoot.querySelector("#mnr-app-styles");
            if (!shadowStyle) {
              shadowStyle = document.createElement("style");
              shadowStyle.id = "mnr-app-styles";
              globalState.shadowRoot.appendChild(shadowStyle);
            }
            shadowStyle.textContent = globalState.styles;
          }
        }
      } catch (e) {
        console.error("[MNR] CSS injection error:", e);
      }
    })('.mnr-prompt-overlay[data-v-c89e5106]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px}.mnr-prompt-card[data-v-c89e5106]{background:#fff;border-radius:12px;box-shadow:0 4px 24px #00000026;max-width:360px;width:100%;padding:20px;animation:mnr-slide-up-c89e5106 .3s ease-out}@keyframes mnr-slide-up-c89e5106{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.mnr-prompt-header[data-v-c89e5106]{display:flex;align-items:center;gap:12px;margin-bottom:16px}.mnr-prompt-icon[data-v-c89e5106]{font-size:28px}.mnr-prompt-title[data-v-c89e5106]{margin:0;font-size:18px;font-weight:600;color:#333}.mnr-confidence[data-v-c89e5106]{margin-bottom:16px}.mnr-confidence-bar[data-v-c89e5106]{height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-bottom:6px}.mnr-confidence-fill[data-v-c89e5106]{height:100%;border-radius:3px;transition:width .3s ease}.mnr-confidence-fill.high[data-v-c89e5106]{background:#4caf50}.mnr-confidence-fill.medium[data-v-c89e5106]{background:#ff9800}.mnr-confidence-fill.low[data-v-c89e5106]{background:#f44336}.mnr-confidence-text[data-v-c89e5106]{font-size:13px;color:#666}.mnr-results[data-v-c89e5106]{list-style:none;padding:0;margin:0 0 16px}.mnr-result-item[data-v-c89e5106]{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:14px}.mnr-result-item.success[data-v-c89e5106]{color:#2e7d32}.mnr-result-item.warning[data-v-c89e5106]{color:#ed6c02}.mnr-result-icon[data-v-c89e5106]{font-weight:700}.mnr-checkbox-label[data-v-c89e5106]{display:flex;align-items:center;gap:8px;cursor:pointer;padding:12px 0;font-size:14px;color:#555;border-top:1px solid #eee;margin-bottom:16px}.mnr-checkbox[data-v-c89e5106]{width:18px;height:18px;cursor:pointer;accent-color:var(--mnr-link, #1976d2)}.mnr-prompt-actions[data-v-c89e5106]{display:flex;gap:12px}.mnr-btn[data-v-c89e5106]{flex:1;padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all .2s ease}.mnr-btn-secondary[data-v-c89e5106]{background:#f5f5f5;color:#666}.mnr-btn-secondary[data-v-c89e5106]:hover{background:#e0e0e0}.mnr-btn-primary[data-v-c89e5106]{background:var(--mnr-link, #1976d2);color:var(--mnr-on-link, #fff)}.mnr-btn-primary[data-v-c89e5106]:hover{filter:brightness(.92)}.mnr-fade-enter-active[data-v-c89e5106],.mnr-fade-leave-active[data-v-c89e5106]{transition:opacity .3s ease}.mnr-fade-enter-from[data-v-c89e5106],.mnr-fade-leave-to[data-v-c89e5106]{opacity:0}@media(prefers-color-scheme:dark){.mnr-prompt-card[data-v-c89e5106]{background:#2a2a2a}.mnr-prompt-title[data-v-c89e5106]{color:#e0e0e0}.mnr-confidence-bar[data-v-c89e5106]{background:#444}.mnr-confidence-text[data-v-c89e5106]{color:#aaa}.mnr-checkbox-label[data-v-c89e5106]{color:#bbb;border-top-color:#444}.mnr-btn-secondary[data-v-c89e5106]{background:#3a3a3a;color:#ccc}.mnr-btn-secondary[data-v-c89e5106]:hover{background:#4a4a4a}}@media(max-width:480px){.mnr-prompt-card[data-v-c89e5106]{padding:16px;margin:8px}.mnr-prompt-title[data-v-c89e5106]{font-size:16px}.mnr-btn[data-v-c89e5106]{padding:12px 16px}}.mnr-progress[data-v-16ecd1aa]{position:fixed;top:0;left:0;right:0;height:3px;z-index:1000;transition:opacity .3s ease}.mnr-progress.hidden[data-v-16ecd1aa]{opacity:0}.mnr-progress-bar[data-v-16ecd1aa]{height:100%;background:var(--mnr-link, #1976d2);transition:width .1s ease-out}.mnr-progress-text[data-v-16ecd1aa]{position:absolute;right:8px;top:8px;background:#000000b3;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px}.mnr-floating-toolbar[data-v-dffc57fa]{position:fixed;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;pointer-events:none;z-index:100}.mnr-fab[data-v-dffc57fa]{pointer-events:auto;width:44px;height:44px;border-radius:50%;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);border:1px solid var(--mnr-border, #e5e5e5);box-shadow:0 4px 12px #00000026;cursor:pointer;position:relative;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s cubic-bezier(.25,.8,.25,1);-webkit-tap-highlight-color:transparent}.mnr-fab[data-v-dffc57fa]:hover{background:var(--mnr-border, #f0f0f0);transform:translateY(-2px);box-shadow:0 6px 16px #0003}.mnr-fab[data-v-dffc57fa]:active{transform:scale(.95)}.mnr-fab[data-v-dffc57fa]:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}.mnr-fab-group[data-v-dffc57fa]{display:flex;gap:12px}.mnr-fab-badge[data-v-dffc57fa]{position:absolute;top:-4px;right:-4px;background:var(--mnr-link, #1976d2);color:var(--mnr-on-link, #fff);font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;line-height:1;box-shadow:0 2px 4px #0003}.mnr-icon[data-v-dffc57fa]{line-height:1;display:block}.mnr-fade-slide-enter-active[data-v-dffc57fa],.mnr-fade-slide-leave-active[data-v-dffc57fa]{transition:opacity .3s ease,transform .3s ease}.mnr-fade-slide-enter-from[data-v-dffc57fa],.mnr-fade-slide-leave-to[data-v-dffc57fa]{opacity:0;transform:translateY(-20px)}.mnr-spinner[data-v-c925c262]{border-radius:50%;animation:mnr-spin-c925c262 .8s cubic-bezier(.4,0,.2,1) infinite}.mnr-spinner.small[data-v-c925c262]{width:24px;height:24px;border:2px solid var(--mnr-border, #e0e0e0);border-top-color:var(--mnr-link, #1976d2);animation-duration:1s;animation-timing-function:linear}.mnr-spinner.medium[data-v-c925c262]{width:48px;height:48px;border:4px solid var(--mnr-border, #e0e0e0);border-top-color:var(--mnr-link, #1976d2)}.mnr-spinner.large[data-v-c925c262]{width:64px;height:64px;border:4px solid var(--mnr-border, #e0e0e0);border-top-color:var(--mnr-link, #1976d2)}@keyframes mnr-spin-c925c262{to{transform:rotate(360deg)}}.mnr-toast[data-v-83d04cea]{position:fixed;bottom:32px;left:50%;transform:translate(-50%);background:#1e1e1ee6;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;padding:14px 28px;border-radius:50px;font-size:15px;font-weight:500;cursor:pointer;z-index:1001;box-shadow:0 8px 24px #0003;display:flex;align-items:center;gap:8px;max-width:90vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mnr-toast--error[data-v-83d04cea]{background:#d32f2ff2}.mnr-toast-enter-active[data-v-83d04cea],.mnr-toast-leave-active[data-v-83d04cea]{transition:all .4s cubic-bezier(.175,.885,.32,1.275)}.mnr-toast-enter-from[data-v-83d04cea],.mnr-toast-leave-to[data-v-83d04cea]{opacity:0;transform:translate(-50%) translateY(40px) scale(.9)}.mnr-loading-overlay[data-v-01971069]{position:fixed;top:0;left:0;right:0;bottom:0;background:#fffc;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#333;z-index:1000;transition:opacity .3s ease}@media(prefers-color-scheme:dark){.mnr-loading-overlay[data-v-01971069]{background:#0009;color:#fff}}.mnr-loading-overlay--inline[data-v-01971069]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:40px 20px;color:#333}.mnr-drawer[data-v-fe73b01a]{position:fixed;top:0;left:0;bottom:0;width:85%;max-width:320px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);transform:translate(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);z-index:1001;display:flex;flex-direction:column;box-shadow:4px 0 20px #00000026}.mnr-drawer.open[data-v-fe73b01a]{transform:translate(0)}.mnr-drawer-overlay[data-v-fe73b01a]{position:fixed;top:0;right:0;bottom:0;left:0;background:#00000080;z-index:1000}.mnr-fade-enter-active[data-v-fe73b01a],.mnr-fade-leave-active[data-v-fe73b01a]{transition:opacity .3s ease}.mnr-fade-enter-from[data-v-fe73b01a],.mnr-fade-leave-to[data-v-fe73b01a]{opacity:0}.mnr-drawer-header[data-v-fe73b01a]{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid var(--mnr-border, #e5e5e5);flex-shrink:0}.mnr-drawer-title[data-v-fe73b01a]{margin:0;font-size:16px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mnr-drawer-close[data-v-fe73b01a]{width:32px;height:32px;border:none;background:transparent;color:var(--mnr-text, #333);font-size:18px;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center}.mnr-drawer-close[data-v-fe73b01a]:hover{background:var(--mnr-border, #e5e5e5)}.mnr-drawer-content[data-v-fe73b01a]{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}.mnr-drawer-loading[data-v-fe73b01a]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px 20px;color:var(--mnr-text, #666)}.mnr-drawer-empty[data-v-fe73b01a]{padding:40px 20px;text-align:center;color:var(--mnr-text, #666);opacity:.7}.mnr-cache-progress-bar[data-v-fe73b01a]{position:sticky;top:0;background:var(--mnr-bg, #fff);padding:12px 16px;border-bottom:1px solid var(--mnr-border, #e5e5e5);z-index:1}.mnr-cache-progress-text[data-v-fe73b01a]{font-size:12px;color:var(--mnr-link, #1976d2);margin-bottom:6px}.mnr-cache-progress-track[data-v-fe73b01a]{height:4px;background:var(--mnr-border, #e0e0e0);border-radius:2px;overflow:hidden}.mnr-cache-progress-fill[data-v-fe73b01a]{height:100%;background:var(--mnr-link, #1976d2);border-radius:2px;transition:width .3s ease}.mnr-cache-stats[data-v-fe73b01a]{padding:8px 16px;font-size:12px;border-bottom:1px solid var(--mnr-border, #e5e5e5);display:flex;gap:12px}.mnr-stat-persisted[data-v-fe73b01a]{color:#4caf50}.mnr-stat-session[data-v-fe73b01a]{color:#9e9e9e}.mnr-chapter-list[data-v-fe73b01a]{list-style:none;margin:0;padding:8px 0}.mnr-chapter-list li[data-v-fe73b01a]{padding:12px 16px;cursor:pointer;border-left:3px solid transparent;font-size:14px;line-height:1.4;transition:all .15s ease;scroll-margin-block:24px;display:flex;align-items:flex-start;gap:4px}.mnr-chapter-list li[data-v-fe73b01a]:hover{background:var(--mnr-border, #f0f0f0)}.mnr-chapter-list li.active[data-v-fe73b01a]{background:#1976d21a;border-left-color:var(--mnr-link, #1976d2);font-weight:500;color:var(--mnr-link, #1976d2)}.mnr-chapter-list li.cached[data-v-fe73b01a]{color:#9e9e9e}.mnr-chapter-list li.persisted[data-v-fe73b01a]{color:#4caf50}.mnr-cached-icon[data-v-fe73b01a]{color:#9e9e9e;font-size:12px;flex-shrink:0;margin-top:2px}.mnr-persisted-icon[data-v-fe73b01a]{color:#4caf50;font-size:12px;flex-shrink:0;margin-top:2px}@media(min-width:1024px){.mnr-drawer[data-v-fe73b01a]{max-width:320px;width:320px}}.mnr-settings-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;z-index:1000;display:flex;justify-content:flex-end}.mnr-settings-panel{width:100%;max-width:360px;height:100%;background:var(--mnr-bg, #fff);display:flex;flex-direction:column;box-shadow:-4px 0 20px #00000026}.mnr-settings-header{display:flex;justify-content:space-between;align-items:center;padding:16px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-settings-header h3{margin:0;font-size:18px;color:var(--mnr-text, #333)}.mnr-shortcut-hint{margin-left:auto;margin-right:12px;padding:2px 8px;background:var(--mnr-border, #e0e0e0);border-radius:4px;font-size:12px;font-family:monospace;color:var(--mnr-text, #666)}.mnr-close-btn{background:none;border:none;font-size:20px;cursor:pointer;padding:4px 8px;color:var(--mnr-text, #666)}.mnr-settings-content{flex:1;overflow:auto;padding:16px}.mnr-settings-section{margin-bottom:24px}.mnr-settings-section h4{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--mnr-text, #555)}.mnr-theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mnr-theme-btn{padding:12px 8px;border:2px solid transparent;border-radius:8px;cursor:pointer;font-size:13px;transition:all .2s ease}.mnr-theme-btn.active{border-color:var(--mnr-link, #1976d2)}.mnr-slider-row{display:flex;align-items:center;gap:12px}.mnr-slider-label{flex:0 0 34px;width:34px;text-align:center;line-height:1;white-space:nowrap;color:var(--mnr-text, #666)}.mnr-slider{flex:1 1 auto;min-width:0;height:4px;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--mnr-border, #e0e0e0);border-radius:2px}.mnr-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:var(--mnr-link, #1976d2);border-radius:50%;cursor:pointer}.mnr-slider::-moz-range-thumb{width:20px;height:20px;background:var(--mnr-link, #1976d2);border:none;border-radius:50%;cursor:pointer}.mnr-slider-value{flex:0 0 64px;width:64px;text-align:right;white-space:nowrap;font-size:13px;color:var(--mnr-text, #666)}.mnr-select{width:100%;padding:10px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);font-size:14px}.mnr-segmented-control{display:flex;border:1px solid var(--mnr-border, #ddd);border-radius:8px;overflow:hidden}.mnr-segment{flex:1;padding:10px 16px;border:none;background:var(--mnr-bg, #fff);color:var(--mnr-text, #666);font-size:14px;cursor:pointer;transition:all .2s ease}.mnr-segment:not(:last-child){border-right:1px solid var(--mnr-border, #ddd)}.mnr-segment:hover{background:var(--mnr-border, #f0f0f0)}.mnr-segment.active{background:var(--mnr-link, #1976d2);color:var(--mnr-on-link, #fff)}.mnr-hint{margin-top:8px;font-size:12px;color:var(--mnr-text, #888);opacity:.8}.mnr-switch-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer;color:var(--mnr-text, #333)}.mnr-switch-row input{width:40px;height:22px;accent-color:var(--mnr-link, #1976d2)}.mnr-action-buttons{display:flex;flex-direction:column;gap:8px}.mnr-rule-row{display:flex;gap:8px}.mnr-rule-row .mnr-action-btn{flex:1}.mnr-cache-row{display:flex;gap:8px}.mnr-cache-row .mnr-action-btn{flex:1}.mnr-action-btn{width:100%;padding:12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);font-size:14px;cursor:pointer}.mnr-action-btn:hover{background:var(--mnr-border, #f5f5f5)}.mnr-action-btn--danger{background:#dc3545;color:#fff;border-color:#dc3545}.mnr-action-btn--danger:hover{background:#c82333;border-color:#c82333}.mnr-cache-count{margin-left:4px;opacity:.8}.mnr-slide-enter-active,.mnr-slide-leave-active{transition:all .3s ease}.mnr-slide-enter-from,.mnr-slide-leave-to{opacity:0}.mnr-slide-enter-from .mnr-settings-panel,.mnr-slide-leave-to .mnr-settings-panel{transform:translate(100%)}@media(max-width:480px){.mnr-settings-panel{max-width:100%}.mnr-theme-grid{grid-template-columns:repeat(2,1fr)}}.mnr-picker-overlay[data-v-69ce3430]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;pointer-events:none}.mnr-picker-highlight[data-v-69ce3430]{position:fixed;border:2px solid #1976d2;background:#1976d21a;pointer-events:none;transition:all .05s ease;box-sizing:border-box;z-index:999999}.mnr-picker-tooltip[data-v-69ce3430]{position:fixed;background:#333;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;font-family:monospace;max-width:400px;pointer-events:none;z-index:1000000;box-shadow:0 2px 8px #0000004d}.mnr-picker-tag[data-v-69ce3430]{color:#90caf9;margin-bottom:4px}.mnr-picker-selector[data-v-69ce3430]{color:#a5d6a7;word-break:break-all}.mnr-picker-controls[data-v-69ce3430]{position:fixed;bottom:20px;left:50%;transform:translate(-50%);background:#1976d2;color:#fff;padding:12px 20px;border-radius:8px;display:flex;align-items:center;gap:16px;font-size:14px;pointer-events:auto;box-shadow:0 4px 12px #0000004d}.mnr-picker-label[data-v-69ce3430]{font-weight:600}.mnr-picker-hint[data-v-69ce3430]{opacity:.8;font-size:12px}.mnr-picker-cancel[data-v-69ce3430]{background:#fff3;border:none;color:#fff;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px}.mnr-picker-cancel[data-v-69ce3430]:hover{background:#ffffff4d}@media(max-width:480px){.mnr-picker-controls[data-v-69ce3430]{left:10px;right:10px;transform:none;flex-wrap:wrap;justify-content:center}}.mnr-selector-preview[data-v-26d93800]{background:var(--mnr-border, #f8f9fa);border-radius:8px;padding:12px;margin-bottom:12px}.mnr-preview-header[data-v-26d93800]{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.mnr-preview-label[data-v-26d93800]{font-size:13px;font-weight:600;color:var(--mnr-text, #555)}.mnr-preview-actions[data-v-26d93800]{display:flex;gap:4px}.mnr-preview-btn[data-v-26d93800]{background:none;border:1px solid var(--mnr-border, #ddd);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;color:var(--mnr-text, #666)}.mnr-preview-btn[data-v-26d93800]:hover:not(:disabled){opacity:.8}.mnr-preview-btn[data-v-26d93800]:disabled{opacity:.5;cursor:not-allowed}.mnr-preview-btn.mnr-btn-active[data-v-26d93800]{background:var(--mnr-link, #1976d2);color:var(--mnr-on-link, #fff);border-color:var(--mnr-link, #1976d2)}.mnr-preview-input-row[data-v-26d93800]{margin-bottom:8px}.mnr-preview-input[data-v-26d93800]{width:100%;padding:8px 10px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-size:13px;font-family:monospace;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-preview-input[data-v-26d93800]:focus{outline:none;border-color:var(--mnr-link, #1976d2)}.mnr-preview-selector[data-v-26d93800]{font-family:monospace;font-size:13px;color:var(--mnr-text, #666)}.mnr-preview-match[data-v-26d93800]{font-size:12px;padding:6px 10px;border-radius:4px;margin-bottom:8px}.mnr-preview-match.success[data-v-26d93800]{background:#e8f5e9;color:#2e7d32}.mnr-preview-match.warning[data-v-26d93800]{background:#fff3e0;color:#e65100}.mnr-preview-match.error[data-v-26d93800]{background:#ffebee;color:#c62828}.mnr-preview-content[data-v-26d93800]{border-top:1px solid var(--mnr-border, #e0e0e0);padding-top:8px}.mnr-preview-content-header[data-v-26d93800]{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mnr-text, #666);margin-bottom:6px}.mnr-preview-expand[data-v-26d93800]{background:none;border:none;color:var(--mnr-link, #1976d2);cursor:pointer;font-size:12px}.mnr-preview-text[data-v-26d93800]{font-size:12px;line-height:1.5;color:var(--mnr-text, #444);max-height:80px;overflow:hidden;background:var(--mnr-bg, #fff);padding:8px;border-radius:4px;border:1px solid var(--mnr-border, #e0e0e0)}.mnr-preview-text.expanded[data-v-26d93800]{max-height:300px;overflow:auto}.mnr-highlight-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999998}.mnr-highlight-box{border:3px solid #4caf50;background:#4caf5026;box-sizing:border-box;transition:all .15s ease}.mnr-highlight-label{position:absolute;top:-24px;left:0;background:#4caf50;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:4px 4px 0 0;font-family:sans-serif}.mnr-rule-editor[data-v-0ee14539]{display:flex;flex-direction:column;height:100%;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333);transition:opacity .2s ease,transform .2s ease}.mnr-rule-editor.mnr-editor-hidden[data-v-0ee14539]{opacity:0;pointer-events:none;transform:translate(-100%)}.mnr-editor-header[data-v-0ee14539]{position:relative;padding:16px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-editor-title[data-v-0ee14539]{margin:0 0 12px;font-size:18px;font-weight:600;color:var(--mnr-text, #333)}.mnr-shortcut-hint[data-v-0ee14539]{position:absolute;top:16px;right:16px;padding:2px 8px;background:var(--mnr-border, #e0e0e0);border-radius:4px;font-size:12px;font-family:monospace;color:var(--mnr-text, #666)}.mnr-editor-tabs[data-v-0ee14539]{display:flex;gap:4px}.mnr-tab-btn[data-v-0ee14539]{padding:8px 16px;background:var(--mnr-border, #f5f5f5);border:none;border-radius:6px;cursor:pointer;font-size:14px;color:var(--mnr-text, #666)}.mnr-tab-btn.active[data-v-0ee14539]{background:var(--mnr-link, #1976d2);color:var(--mnr-on-link, #fff)}.mnr-editor-content[data-v-0ee14539]{flex:1;overflow:auto;padding:16px}.mnr-form-section[data-v-0ee14539]{margin-bottom:24px}.mnr-section-title[data-v-0ee14539]{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--mnr-text, #333);padding-bottom:8px;border-bottom:1px solid var(--mnr-border, #e0e0e0)}.mnr-form-group[data-v-0ee14539]{margin-bottom:16px}.mnr-form-group label[data-v-0ee14539]{display:block;margin-bottom:6px;font-size:13px;font-weight:500;color:var(--mnr-text, #555)}.mnr-form-group input[data-v-0ee14539],.mnr-form-group textarea[data-v-0ee14539]{width:100%;padding:10px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-size:14px;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-form-group input[data-v-0ee14539]:focus,.mnr-form-group textarea[data-v-0ee14539]:focus{outline:none;border-color:var(--mnr-link, #1976d2)}.mnr-hint[data-v-0ee14539]{display:block;margin-top:4px;font-size:12px;color:var(--mnr-text, #888);opacity:.7}.mnr-checkbox-row[data-v-0ee14539]{display:flex;align-items:center;gap:8px;padding:8px 0;cursor:pointer}.mnr-checkbox-row input[data-v-0ee14539]{width:18px;height:18px}.mnr-code-toolbar[data-v-0ee14539]{display:flex;gap:8px;margin-bottom:8px}.mnr-format-select[data-v-0ee14539]{padding:6px 12px;border:1px solid var(--mnr-border, #ddd);border-radius:4px;font-size:13px;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-toolbar-btn[data-v-0ee14539]{padding:6px 12px;background:var(--mnr-border, #f5f5f5);border:1px solid var(--mnr-border, #ddd);border-radius:4px;cursor:pointer;font-size:13px;color:var(--mnr-text, #333)}.mnr-toolbar-btn[data-v-0ee14539]:hover{opacity:.8}.mnr-code-editor[data-v-0ee14539]{width:100%;min-height:400px;padding:12px;border:1px solid var(--mnr-border, #ddd);border-radius:6px;font-family:Fira Code,Monaco,monospace;font-size:13px;line-height:1.5;resize:vertical;box-sizing:border-box;background:var(--mnr-bg, #fff);color:var(--mnr-text, #333)}.mnr-code-error[data-v-0ee14539]{margin-top:8px;padding:8px 12px;background:#ffebee;color:#c62828;border-radius:4px;font-size:13px}.mnr-hook-editor[data-v-0ee14539],.mnr-css-editor[data-v-0ee14539]{min-height:100px;font-family:Fira Code,Monaco,monospace;font-size:13px;line-height:1.5}.mnr-editor-footer[data-v-0ee14539]{display:flex;justify-content:flex-end;gap:12px;padding:16px;border-top:1px solid var(--mnr-border, #e0e0e0)}.mnr-btn[data-v-0ee14539]{padding:10px 20px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;border:none}.mnr-btn-secondary[data-v-0ee14539]{background:var(--mnr-border, #f5f5f5);color:var(--mnr-text, #666)}.mnr-btn-primary[data-v-0ee14539]{background:var(--mnr-link, #1976d2);color:var(--mnr-on-link, #fff)}.mnr-btn-primary[data-v-0ee14539]:disabled{opacity:.5;cursor:not-allowed}.mnr-reader[data-v-e6103b6b]{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:var(--mnr-bg, #ffffff);color:var(--mnr-text, #1a1a1a);overflow:hidden;overscroll-behavior:none;display:flex;flex-direction:column}.mnr-reader-main[data-v-e6103b6b]{flex:1;overflow:auto;padding-top:68px;padding-bottom:40px;overscroll-behavior:none;-webkit-overflow-scrolling:touch}.mnr-reader-content[data-v-e6103b6b]{max-width:var(--mnr-max-width, 800px);margin:0 auto;padding:var(--mnr-padding, 20px);font-family:var( --mnr-font-family, "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", system-ui, sans-serif );font-size:var(--mnr-font-size, 18px);line-height:var(--mnr-line-height, 1.8);letter-spacing:var(--mnr-letter-spacing, .05em)}.mnr-reader-content[data-v-e6103b6b] p{text-indent:var(--mnr-paragraph-indent, 2em);margin:0 0 1em}.mnr-reader-content[data-v-e6103b6b] img{max-width:100%;height:auto;display:block;margin:1em auto}.mnr-reader-content[data-v-e6103b6b] a{color:var(--mnr-link, #1976d2)}.mnr-chapter-title[data-v-e6103b6b]{font-size:1.5em;font-weight:700;margin:0 0 1em;color:var(--mnr-text, #1a1a1a);line-height:1.4;text-align:center}.mnr-chapter-end[data-v-e6103b6b]{max-width:var(--mnr-max-width, 800px);margin:0 auto;padding:40px 20px;text-align:center}.mnr-chapter-end-text[data-v-e6103b6b]{color:var(--mnr-text, #666);opacity:.7;margin-bottom:16px}.mnr-chapter-nav[data-v-e6103b6b]{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}.mnr-chapter-link[data-v-e6103b6b]{padding:12px 24px;color:var(--mnr-link, #1976d2);text-decoration:none;border:1px solid var(--mnr-border, #e0e0e0);border-radius:8px;transition:all .2s ease}.mnr-chapter-link[data-v-e6103b6b]:hover{background:var(--mnr-border, #f0f0f0)}.mnr-sentinel[data-v-e6103b6b]{height:1px;width:100%;visibility:hidden}.mnr-loading-prev[data-v-e6103b6b],.mnr-loading-next[data-v-e6103b6b]{display:flex;align-items:center;justify-content:center;gap:12px;padding:24px;color:var(--mnr-text, #666)}@media(min-width:768px){.mnr-reader-content[data-v-e6103b6b]{padding:30px}}@media(min-width:1024px){.mnr-reader-content[data-v-e6103b6b]{padding:40px}}.mnr-rule-editor-overlay[data-v-e6103b6b]{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;transition:opacity .2s ease,visibility .2s ease}.mnr-rule-editor-overlay.mnr-overlay-hidden[data-v-e6103b6b]{opacity:0;visibility:hidden;pointer-events:none}.mnr-rule-editor-container[data-v-e6103b6b]{background:var(--mnr-bg, #fff);border-radius:8px;max-width:800px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 4px 20px #0000004d}');
  })();
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
createSummary(report) {
      const percentage = Math.round(report.overall * 100);
      const status = report.isReliable ? "可信" : "不确定";
      return `检测置信度: ${percentage}% (${status})`;
    }
getThreshold() {
      return this.threshold;
    }
setThreshold(threshold) {
      this.threshold = threshold;
    }
  }
  const KNOWN_CONTENT_SELECTORS = [
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
  function isUniqueSelector(doc2, selector) {
    try {
      return doc2.querySelectorAll(selector).length === 1;
    } catch {
      return false;
    }
  }
  function buildPathSelector(element, doc2, maxDepth) {
    const path = [];
    let current = element;
    while (current && current !== doc2.body && current !== doc2.documentElement && path.length < maxDepth) {
      let segment = current.tagName.toLowerCase();
      const id = current.id;
      if (id) {
        segment = `#${cssEscape(id)}`;
        path.unshift(segment);
        break;
      }
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (sibling) => sibling.tagName === current.tagName
        );
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
  function generateCssSelector(element, options = {}) {
    const doc2 = options.doc || element.ownerDocument || (typeof document !== "undefined" ? document : void 0);
    if (!doc2) {
      return element.tagName.toLowerCase();
    }
    const maxDepth = Math.max(1, options.maxDepth ?? Number.POSITIVE_INFINITY);
    const id = element.id;
    if (id) {
      return `#${cssEscape(id)}`;
    }
    const classes = Array.from(element.classList || []).filter(Boolean);
    for (const cls of classes) {
      const selector = `.${cssEscape(cls)}`;
      if (isUniqueSelector(doc2, selector)) {
        return selector;
      }
    }
    if (options.allowClassCombination && classes.length >= 2) {
      const maxClasses = Math.max(2, options.maxClassCombination ?? 3);
      const selector = classes.slice(0, Math.min(maxClasses, classes.length)).map((cls) => `.${cssEscape(cls)}`).join("");
      if (isUniqueSelector(doc2, selector)) {
        return selector;
      }
    }
    const path = buildPathSelector(element, doc2, maxDepth);
    return path || element.tagName.toLowerCase();
  }
  function parseChapterSectionFromPathname(pathname) {
    if (!pathname) return null;
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
    let match = normalized.match(/^(.*\/\d+)[_-](\d+)\.html?$/i);
    if (match) {
      const section = parseInt(match[2], 10);
      if (section >= 1 && section <= 99) {
        return { chapterKey: match[1], section };
      }
    }
    match = normalized.match(/^(.*\/\d+)\/(\d+)\.html?$/i);
    if (match) {
      const section = parseInt(match[2], 10);
      if (section >= 1 && section <= 99) {
        return { chapterKey: match[1], section };
      }
    }
    match = normalized.match(/^(.*\/\d+)\.html?$/i);
    if (match) {
      return { chapterKey: match[1], section: 1 };
    }
    const parts = normalized.split("/").filter(Boolean);
    if (parts.length >= 4) {
      const pagePart = parts[parts.length - 1];
      const chapterPart = parts[parts.length - 2];
      const hasStableBookId = parts.slice(0, -2).some((p2) => /^\d{3,}$/.test(p2));
      if (/^\d{1,2}$/.test(pagePart) && /^\d{1,6}$/.test(chapterPart) && hasStableBookId) {
        const section = parseInt(pagePart, 10);
        if (section >= 1 && section <= 99) {
          return { chapterKey: `/${parts.slice(0, -1).join("/")}`, section };
        }
      }
    }
    if (parts.length >= 3) {
      const pagePart = parts[parts.length - 1];
      const chapterPart = parts[parts.length - 2];
      if (/^\d{1,2}$/.test(pagePart) && /^\d{3,}$/.test(chapterPart)) {
        const section = parseInt(pagePart, 10);
        const numericSegments = parts.slice(0, -1).filter((p2) => /^\d{3,}$/.test(p2));
        if (numericSegments.length >= 2 && section >= 1 && section <= 99) {
          return { chapterKey: `/${parts.slice(0, -1).join("/")}`, section };
        }
      }
    }
    if (parts.length >= 3) {
      const chapterPart = parts[parts.length - 1];
      const hasStableBookId = parts.slice(0, -1).some((p2) => /^\d{3,}$/.test(p2));
      if (/^\d{1,6}$/.test(chapterPart) && hasStableBookId) {
        return { chapterKey: `/${parts.join("/")}`, section: 1 };
      }
    }
    match = normalized.match(/^(.*\/\d{3,})(?:\/)?$/);
    if (match) {
      return { chapterKey: match[1], section: 1 };
    }
    return null;
  }
  function normalizeAbsoluteUrl(href, base) {
    const baseCandidates = [base];
    if (typeof document !== "undefined") baseCandidates.push(document.baseURI);
    if (typeof location !== "undefined") baseCandidates.push(location.href);
    for (const candidate of baseCandidates) {
      if (!candidate) continue;
      try {
        return new URL(href, candidate).toString();
      } catch {
      }
    }
    try {
      return new URL(href).toString();
    } catch {
      return href;
    }
  }
  function getSectionBaseUrl(url) {
    const m = url.match(/^(.*\/\d+)[_-]\d+(\.html?)$/i);
    if (m) return `${m[1]}${m[2]}`;
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      const hasTrailingSlash = u.pathname.endsWith("/");
      if (parts.length >= 3) {
        const pagePart = parts[parts.length - 1];
        const chapterPart = parts[parts.length - 2];
        if (/^\d{1,2}$/.test(pagePart) && /^\d{3,}$/.test(chapterPart)) {
          const numericSegments = parts.slice(0, -1).filter((p2) => /^\d{3,}$/.test(p2));
          if (numericSegments.length >= 2) {
            parts[parts.length - 1] = "1";
            u.pathname = `/${parts.join("/")}${hasTrailingSlash ? "/" : ""}`;
            return u.toString();
          }
        }
      }
      if (parts.length >= 4) {
        const pagePart = parts[parts.length - 1];
        const chapterPart = parts[parts.length - 2];
        const hasStableBookId = parts.slice(0, -2).some((p2) => /^\d{3,}$/.test(p2));
        if (/^\d{1,2}$/.test(pagePart) && /^\d{1,6}$/.test(chapterPart) && hasStableBookId) {
          const page = parseInt(pagePart, 10);
          if (page > 1 && page <= 99) {
            parts.pop();
            u.pathname = `/${parts.join("/")}${hasTrailingSlash ? "/" : ""}`;
            return u.toString();
          }
        }
      }
    } catch {
    }
    try {
      const u = new URL(url);
      const PAGE_PARAM_KEYS = ["page", "p", "pg", "pageno", "page_no", "pagenum", "pageindex", "pn"];
      for (const [name, value] of u.searchParams) {
        const keyLower = name.toLowerCase();
        if (!PAGE_PARAM_KEYS.includes(keyLower)) continue;
        if (!/^\d+$/.test(value)) continue;
        const page = parseInt(value, 10);
        if (page <= 1) continue;
        u.searchParams.set(name, "1");
        return u.toString();
      }
    } catch {
    }
    return null;
  }
  function isSectionLikeUrl(currentUrl, nextUrl) {
    try {
      const current = new URL(currentUrl);
      const next = new URL(nextUrl, current);
      if (current.host !== next.host) return false;
      const currentPath = current.pathname;
      const nextPath = next.pathname;
      const c = parseChapterSectionFromPathname(currentPath);
      const n = parseChapterSectionFromPathname(nextPath);
      if (c && n && c.chapterKey === n.chapterKey) {
        if (n.section === c.section + 1 && n.section > 1) {
          return true;
        }
      }
      if (currentPath === nextPath) {
        const PAGE_PARAM_KEYS = [
          "page",
          "p",
          "pg",
          "pageno",
          "page_no",
          "pagenum",
          "pageindex",
          "pn"
        ];
        const getParamValueCI = (params, keyLower) => {
          for (const [name, value] of params) {
            if (name.toLowerCase() === keyLower) return value;
          }
          return null;
        };
        const extractPageInfo = (u) => {
          for (const keyLower of PAGE_PARAM_KEYS) {
            const raw = getParamValueCI(u.searchParams, keyLower);
            if (!raw || !/^\d+$/.test(raw)) continue;
            const page = parseInt(raw, 10);
            if (page >= 1 && page <= 99) return { keyLower, page };
          }
          return null;
        };
        const nextPageInfo = extractPageInfo(next);
        if (nextPageInfo) {
          const rawCurrentPage = getParamValueCI(current.searchParams, nextPageInfo.keyLower);
          const currentPage = rawCurrentPage && /^\d+$/.test(rawCurrentPage) ? parseInt(rawCurrentPage, 10) : 1;
          const normalizeNonPageParams = (u, pageKeyLower) => {
            const items = [];
            for (const [name, value] of u.searchParams) {
              if (name.toLowerCase() === pageKeyLower) continue;
              items.push(`${name.toLowerCase()}=${value}`);
            }
            items.sort();
            return items;
          };
          const currentRest = normalizeNonPageParams(current, nextPageInfo.keyLower);
          const nextRest = normalizeNonPageParams(next, nextPageInfo.keyLower);
          const onlyPageDiff = currentRest.length === nextRest.length && currentRest.every((v, i) => v === nextRest[i]);
          if (onlyPageDiff && nextPageInfo.page === currentPage + 1 && nextPageInfo.page > 1) {
            return true;
          }
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  function joinHtml(a, b) {
    const left = (a || "").trim();
    const right = (b || "").trim();
    if (!left) return right;
    if (!right) return left;
    return `${left}<p></p>${right}`;
  }
  function normalizeCiwemaoChapterUrl(url) {
    try {
      const u = new URL(url);
      if ((u.hostname === "wap.ciweimao.com" || u.hostname === "mip.ciweimao.com") && (u.pathname === "/chapter/get_par_tsu_list" || u.pathname === "/chapter/get_par_tsu_list/")) {
        const chapterId = u.searchParams.get("chapter_id");
        if (chapterId && /^\d+$/.test(chapterId)) {
          return `${u.origin}/chapter/${chapterId}`;
        }
      }
      return url;
    } catch {
      return url;
    }
  }
  function normalizeRedundantFirstPageParam(url) {
    try {
      const u = new URL(url);
      if (!/\.html?$/i.test(u.pathname)) return url;
      const params = Array.from(u.searchParams.entries());
      if (params.length !== 1) return url;
      const [name, value] = params[0];
      const pageKeys = ["page", "p", "pg", "pageno", "page_no", "pagenum", "pageindex", "pn"];
      if (!pageKeys.includes(name.toLowerCase()) || value !== "1") return url;
      u.search = "";
      return u.toString();
    } catch {
      return url;
    }
  }
  /*! @license DOMPurify 3.4.11 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.11/LICENSE */
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ;
        else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  const entries = Object.entries, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  let freeze = Object.freeze, seal = Object.seal, create = Object.create;
  let _ref = typeof Reflect !== "undefined" && Reflect, apply$1 = _ref.apply, construct = _ref.construct;
  if (!freeze) {
    freeze = function freeze2(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal2(x) {
      return x;
    };
  }
  if (!apply$1) {
    apply$1 = function apply2(func, thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return func.apply(thisArg, args);
    };
  }
  if (!construct) {
    construct = function construct2(Func) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      return new Func(...args);
    };
  }
  const arrayForEach = unapply(Array.prototype.forEach);
  const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
  const arrayPop = unapply(Array.prototype.pop);
  const arrayPush = unapply(Array.prototype.push);
  const arraySplice = unapply(Array.prototype.splice);
  const arrayIsArray = Array.isArray;
  const stringToLowerCase = unapply(String.prototype.toLowerCase);
  const stringToString = unapply(String.prototype.toString);
  const stringMatch = unapply(String.prototype.match);
  const stringReplace = unapply(String.prototype.replace);
  const stringIndexOf = unapply(String.prototype.indexOf);
  const stringTrim = unapply(String.prototype.trim);
  const numberToString = unapply(Number.prototype.toString);
  const booleanToString = unapply(Boolean.prototype.toString);
  const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
  const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
  const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  const objectToString$1 = unapply(Object.prototype.toString);
  const regExpTest = unapply(RegExp.prototype.test);
  const typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) {
        thisArg.lastIndex = 0;
      }
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return apply$1(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    if (!arrayIsArray(array)) {
      return set;
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const _ref2 of entries(object)) {
      var _ref3 = _slicedToArray(_ref2, 2);
      const property = _ref3[0];
      const value = _ref3[1];
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (arrayIsArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function stringifyValue(value) {
    switch (typeof value) {
      case "string": {
        return value;
      }
      case "number": {
        return numberToString(value);
      }
      case "boolean": {
        return booleanToString(value);
      }
      case "bigint": {
        return bigintToString ? bigintToString(value) : "0";
      }
      case "symbol": {
        return symbolToString ? symbolToString(value) : "Symbol()";
      }
      case "undefined": {
        return objectToString$1(value);
      }
      case "function":
      case "object": {
        if (value === null) {
          return objectToString$1(value);
        }
        const valueAsRecord = value;
        const valueToString = lookupGetter(valueAsRecord, "toString");
        if (typeof valueToString === "function") {
          const stringified = valueToString(valueAsRecord);
          return typeof stringified === "string" ? stringified : objectToString$1(stringified);
        }
        return objectToString$1(value);
      }
      default: {
        return objectToString$1(value);
      }
    }
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function isRegex(value) {
    try {
      regExpTest(value, "");
      return true;
    } catch (_unused) {
      return false;
    }
  }
  const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  const text = freeze(["#text"]);
  const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
  const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
  const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
  const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
  const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
  const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  const IS_ALLOWED_URI = seal(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
);
  const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  const ATTR_WHITESPACE = seal(
    /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
);
  const DOCTYPE_NAME = seal(/^html$/i);
  const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  const ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
  const COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
  const FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
  const SELF_CLOSING_TAG = seal(/\/>/i);
  const NODE_TYPE = {
    element: 1,
    attribute: 2,
    text: 3,
    cdataSection: 4,
    entityReference: 5,
entityNode: 6,
processingInstruction: 7,
    comment: 8,
    document: 9,
    documentType: 10,
    documentFragment: 11,
    notation: 12
};
  const getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  const _createHooksMap = function _createHooksMap2() {
    return {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
  };
  const _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
    return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.4.11";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let document2 = window2.document;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    window2.DocumentFragment;
    const HTMLTemplateElement = window2.HTMLTemplateElement, Node2 = window2.Node, Element2 = window2.Element, NodeFilter2 = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap;
    _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap;
    window2.HTMLFormElement;
    const DOMParser2 = window2.DOMParser, trustedTypes = window2.trustedTypes;
    const ElementPrototype = Element2.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove2 = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
    const getAttributes = lookupGetter(ElementPrototype, "attributes");
    const getNodeType = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeType") : null;
    const getNodeName = Node2 && Node2.prototype ? lookupGetter(Node2.prototype, "nodeName") : null;
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    let defaultTrustedTypesPolicy;
    let defaultTrustedTypesPolicyResolved = false;
    let IN_TRUSTED_TYPES_POLICY = 0;
    const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
      if (IN_TRUSTED_TYPES_POLICY > 0) {
        throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
      }
    };
    const _createTrustedHTML = function _createTrustedHTML2(html2) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createHTML(html2);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createScriptURL(scriptUrl);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
      if (!defaultTrustedTypesPolicyResolved) {
        defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        defaultTrustedTypesPolicyResolved = true;
      }
      return defaultTrustedTypesPolicy;
    };
    const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
    const importNode = originalDocument.importNode;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
    let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let SET_CONFIG_ALLOWED_TAGS = null;
    let SET_CONFIG_ALLOWED_ATTR = null;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",








"selectedcontent",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp"
    ]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(["mi", "mo", "mn", "ms", "mtext"]);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE =
SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, {
        transform: transformCaseFunc
      });
      ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, {
        transform: transformCaseFunc
      });
      ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, {
        transform: stringToString
      });
      URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
        transform: transformCaseFunc,
        base: DEFAULT_URI_SAFE_ATTRIBUTES
      });
      DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
        transform: transformCaseFunc,
        base: DEFAULT_DATA_URI_TAGS
      });
      FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, {
        transform: transformCaseFunc
      });
      FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), {
        transform: transformCaseFunc
      });
      FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), {
        transform: transformCaseFunc
      });
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
      NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
      HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
      const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
      CUSTOM_ELEMENT_HANDLING = create(null);
      if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
      }
      seal(CUSTOM_ELEMENT_HANDLING);
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
        if (typeof cfg.ADD_TAGS === "function") {
          EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        } else if (arrayIsArray(cfg.ADD_TAGS)) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
        if (typeof cfg.ADD_ATTR === "function") {
          EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        } else if (arrayIsArray(cfg.ADD_ATTR)) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        const previousTrustedTypesPolicy = trustedTypesPolicy;
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        try {
          emptyHTML = _createTrustedHTML("");
        } catch (error) {
          trustedTypesPolicy = previousTrustedTypesPolicy;
          throw error;
        }
      } else if (cfg.TRUSTED_TYPES_POLICY === null) {
        trustedTypesPolicy = void 0;
        emptyHTML = "";
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
        }
        if (trustedTypesPolicy && typeof emptyHTML === "string") {
          emptyHTML = _createTrustedHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    };
    const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    };
    const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    };
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        return _checkSvgNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        return _checkMathMlNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        return _checkHtmlNamespace(tagName, parent, parentTagName);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove2(node);
        if (!getParentNode(node)) {
          throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
        }
      }
    };
    const _neutralizeRoot = function _neutralizeRoot2(root) {
      const childNodes = getChildNodes(root);
      if (childNodes) {
        const snapshot = [];
        arrayForEach(childNodes, (child) => {
          arrayPush(snapshot, child);
        });
        arrayForEach(snapshot, (child) => {
          try {
            remove2(child);
          } catch (_) {
          }
        });
      }
      const attributes = getAttributes(root);
      if (attributes) {
        for (let i = attributes.length - 1; i >= 0; --i) {
          const attribute = attributes[i];
          const name = attribute && attribute.name;
          if (typeof name === "string") {
            try {
              root.removeAttribute(name);
            } catch (_) {
            }
          }
        }
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_) {
          }
        }
      }
    };
    const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
      const attributes = getAttributes(element);
      if (!attributes) {
        return;
      }
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) {
          continue;
        }
        try {
          element.removeAttribute(name);
        } catch (_) {
        }
      }
    };
    const _neutralizeSubtree = function _neutralizeSubtree2(root) {
      const stack2 = [root];
      while (stack2.length > 0) {
        const node = stack2.pop();
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        if (nodeType === NODE_TYPE.element) {
          _stripDisallowedAttributes(node);
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack2.push(childNodes[i]);
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc2 = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc2 = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {
        }
      }
      if (!doc2 || !doc2.documentElement) {
        doc2 = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc2.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc2.body || doc2.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc2, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc2.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      return createNodeIterator.call(
        root.ownerDocument || root,
        root,
NodeFilter2.SHOW_ELEMENT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_PROCESSING_INSTRUCTION | NodeFilter2.SHOW_CDATA_SECTION,
        null
      );
    };
    const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
      value = stringReplace(value, MUSTACHE_EXPR$1, " ");
      value = stringReplace(value, ERB_EXPR$1, " ");
      value = stringReplace(value, TMPLIT_EXPR$1, " ");
      return value;
    };
    const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
      var _node$querySelectorAl;
      node.normalize();
      const walker = createNodeIterator.call(
        node.ownerDocument || node,
        node,
NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_CDATA_SECTION | NodeFilter2.SHOW_PROCESSING_INSTRUCTION,
        null
      );
      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.data = _stripTemplateExpressions(currentNode.data);
        currentNode = walker.nextNode();
      }
      const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
      if (templates) {
        arrayForEach(templates, (tmpl) => {
          if (_isDocumentFragment(tmpl.content)) {
            _scrubTemplateExpressions2(tmpl.content);
          }
        });
      }
    };
    const _isClobbered = function _isClobbered2(element) {
      const realTagName = getNodeName ? getNodeName(element) : null;
      if (typeof realTagName !== "string") {
        return false;
      }
      if (transformCaseFunc(realTagName) !== "form") {
        return false;
      }
      return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" ||




element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" ||






element.nodeType !== getNodeType(element) ||










element.childNodes !== getChildNodes(element);
    };
    const _isDocumentFragment = function _isDocumentFragment2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return getNodeType(value) === NODE_TYPE.documentFragment;
      } catch (_) {
        return false;
      }
    };
    const _isNode = function _isNode2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return typeof getNodeType(value) === "number";
      } catch (_) {
        return false;
      }
    };
    function _executeHooks(hooks2, currentNode, data) {
      if (hooks2.length === 0) {
        return;
      }
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.processingInstruction) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) {
        return true;
      }
      return false;
    };
    const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const hoisted = IN_PLACE ? childNodes[i] : cloneNode(childNodes[i], true);
            parentNode.insertBefore(hoisted, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode) {
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (_isUnsafeNode(currentNode, tagName)) {
        _forceRemove(currentNode);
        return true;
      }
      if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
        return _sanitizeDisallowedNode(currentNode, tagName);
      }
      const nt = getNodeType ? getNodeType(currentNode) : currentNode.nodeType;
      if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        const content = _stripTemplateExpressions(currentNode.textContent);
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) {
        return false;
      }
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ;
      else if (!nameIsPermitted) {
        if (


_isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) ||

lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        ) ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
      else if (value) {
        return false;
      } else ;
      return true;
    };
    const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
    };
    const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) {
        switch (trustedTypes.getAttributeType(lcTag, lcName)) {
          case "TrustedHTML": {
            return _createTrustedHTML(value);
          }
          case "TrustedScriptURL": {
            return _createTrustedScriptURL(value);
          }
        }
      }
      return value;
    };
    const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          currentNode.setAttribute(name, value);
        }
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
        } else {
          arrayPop(DOMPurify.removed);
        }
      } catch (_) {
        _removeAttribute(name, currentNode);
      }
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const attributes = currentNode.attributes;
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      const lcTag = transformCaseFunc(currentNode.nodeName);
      while (l--) {
        const attr = attributes[l];
        const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          value = _stripTemplateExpressions(value);
        }
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
        if (value !== initValue) {
          _setAttributeValue(currentNode, name, namespaceURI, value);
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode);
        _sanitizeAttributes(shadowNode);
        if (_isDocumentFragment(shadowNode.content)) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        const shadowNodeType = getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType;
        if (shadowNodeType === NODE_TYPE.element) {
          const innerSr = getShadowRoot(shadowNode);
          if (_isDocumentFragment(innerSr)) {
            _sanitizeAttachedShadowRoots(innerSr);
            _sanitizeShadowDOM2(innerSr);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
      const stack2 = [{
        node: root,
        shadow: null
      }];
      while (stack2.length > 0) {
        const item = stack2.pop();
        if (item.shadow) {
          _sanitizeShadowDOM2(item.shadow);
          continue;
        }
        const node = item.node;
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        const isElement = nodeType === NODE_TYPE.element;
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack2.push({
              node: childNodes[i],
              shadow: null
            });
          }
        }
        if (isElement) {
          const rootName = getNodeName ? getNodeName(node) : null;
          if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
            const content = node.content;
            if (_isDocumentFragment(content)) {
              stack2.push({
                node: content,
                shadow: null
              });
            }
          }
        }
        if (isElement) {
          const sr = getShadowRoot(node);
          if (_isDocumentFragment(sr)) {
            stack2.push({
              node: null,
              shadow: sr
            }, {
              node: sr,
              shadow: null
            });
          }
        }
      }
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        dirty = stringifyValue(dirty);
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (SET_CONFIG) {
        ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
        ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
      } else {
        _parseConfig(cfg);
      }
      if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      if (hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      DOMPurify.removed = [];
      const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
      if (inPlace) {
        const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
        if (typeof nn === "string") {
          const tagName = transformCaseFunc(nn);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
        if (_isClobbered(dirty)) {
          throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
        }
        try {
          _sanitizeAttachedShadowRoots(dirty);
        } catch (error) {
          _neutralizeRoot(dirty);
          throw error;
        }
      } else if (_isNode(dirty)) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
        _sanitizeAttachedShadowRoots(importedNode);
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const nodeIterator = _createNodeIterator(inPlace ? dirty : body);
      try {
        while (currentNode = nodeIterator.nextNode()) {
          _sanitizeElements(currentNode);
          _sanitizeAttributes(currentNode);
          if (_isDocumentFragment(currentNode.content)) {
            _sanitizeShadowDOM2(currentNode.content);
          }
        }
      } catch (error) {
        if (inPlace) {
          _neutralizeRoot(dirty);
        }
        throw error;
      }
      if (inPlace) {
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            _neutralizeSubtree(entry.element);
          }
        });
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(dirty);
        }
        return dirty;
      }
      if (RETURN_DOM) {
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(body);
        }
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = _stripTemplateExpressions(serializedHTML);
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
      SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
      SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
      SET_CONFIG_ALLOWED_TAGS = null;
      SET_CONFIG_ALLOWED_ATTR = null;
      trustedTypesPolicy = defaultTrustedTypesPolicy;
      emptyHTML = "";
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return void 0;
      }
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();
  const SAFE_DATA_ATTR = [
    "data-src",
    "data-original",
    "data-lazy-src",
    "data-original-src",
    "data-srcset",
    "data-url",
    "data-actualsrc",
    "data-echo"
  ];
  const ENHANCED_CONFIG = {
    USE_PROFILES: { html: true, svg: true },
ADD_DATA_URI_TAGS: ["img"],
ADD_ATTR: SAFE_DATA_ATTR,
ALLOW_DATA_ATTR: false,
FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "link",
      "meta",
      "style",
      "form",
      "input",
      "button"
    ],
FORBID_ATTR: [
      "onload",
      "onclick",
      "onerror",
      "onmouseover",
      "onfocus",
      "onmouseenter",
      "onmouseleave",
      "onkeydown",
      "onkeyup",
      "onkeypress",
      "onmousedown",
      "onmouseup",
      "onmousemove",
      "ontouchstart",
      "ontouchend",
      "onfocusin",
      "onfocusout",
      "onblur",
      "onscroll",
      "onresize",
      "onsubmit",
      "onreset",
      "onchange",
      "oninput"
    ],
SANITIZE_DOM: true,
KEEP_CONTENT: true,
SAFE_FOR_TEMPLATES: true,
ALLOWED_TAGS: [
"p",
      "br",
      "hr",
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "sub",
      "sup",
      "small",
      "big",
"svg",
      "g",
      "path",
      "circle",
      "rect",
      "line",
      "polygon",
      "text",
      "tspan",
      "textPath",
      "use",
      "symbol",
      "defs"
    ],
ALLOWED_ATTR: [
      "href",
      "title",
      "alt",
      "src",
      "width",
      "height",
      "class",
      "id",
      "style",
      "dir",
      ...SAFE_DATA_ATTR,
      "rowspan",
      "colspan",
      "viewBox",
      "xmlns",
      "fill",
      "stroke",
      "d",
      "cx",
      "cy",
      "r",
      "x",
      "y",
      "width",
      "height"
]
  };
  const DEFAULT_CONFIG = ENHANCED_CONFIG;
  let domPurifyHooksInstalled = false;
  function sanitizeSvgContent(html2) {
    return html2.replace(/<svg[^>]*>/gi, (match) => {
      return match.replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]*)/gi, "");
    }).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/javascript:/gi, "").replace(/vbscript:/gi, "").replace(/\s+href\s*=\s*["']\s*data:[^"']*["']/gi, "").replace(/expression\([^)]*\)/gi, "");
  }
  function basicSanitize(html2) {
    if (typeof document === "undefined") return html2;
    html2 = sanitizeSvgContent(html2);
    const container = document.createElement("div");
    container.innerHTML = html2;
    const blockedTags = [
      "script",
      "iframe",
      "object",
      "embed",
      "link",
      "meta",
      "style",
      "input",
      "button",
      "textarea",
      "select"
    ];
    blockedTags.forEach((tag) => {
      container.querySelectorAll(tag).forEach((el) => el.remove());
    });
    container.querySelectorAll("form").forEach((form) => {
      const parent = form.parentNode;
      if (!parent) {
        form.remove();
        return;
      }
      while (form.firstChild) {
        parent.insertBefore(form.firstChild, form);
      }
      form.remove();
    });
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      const attrsToRemove = [];
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();
        if (name.startsWith("on")) {
          attrsToRemove.push(attr.name);
          continue;
        }
        if (name === "href") {
          if (value.startsWith("javascript:") || value.startsWith("vbscript:") || value.startsWith("data:")) {
            attrsToRemove.push(attr.name);
            continue;
          }
        }
        if (name === "src") {
          if (value.startsWith("javascript:") || value.startsWith("vbscript:")) {
            attrsToRemove.push(attr.name);
            continue;
          }
          if (value.startsWith("data:")) {
            const tag = el.tagName.toLowerCase();
            if (tag !== "img" || !isSafeDataImageUrl(attr.value)) {
              attrsToRemove.push(attr.name);
              continue;
            }
          }
        }
        if (name === "style") {
          attrsToRemove.push(attr.name);
          continue;
        }
      }
      attrsToRemove.forEach((attrName) => el.removeAttribute(attrName));
    }
    return container.innerHTML;
  }
  function sanitizeHtml(html2, config = DEFAULT_CONFIG) {
    if (!html2) return html2;
    try {
      html2 = sanitizeSvgContent(html2);
      if (typeof window === "undefined" || typeof (purify == null ? void 0 : purify.sanitize) !== "function") {
        return basicSanitize(html2);
      }
      if (!domPurifyHooksInstalled && typeof (purify == null ? void 0 : purify.addHook) === "function") {
        purify.addHook("afterSanitizeAttributes", (node) => {
          const el = node;
          if (!el || el.nodeType !== 1) return;
          if (el.tagName.toLowerCase() !== "img") return;
          const src = el.getAttribute("src");
          if (!src || !src.trim().toLowerCase().startsWith("data:")) return;
          if (!isSafeDataImageUrl(src)) {
            el.removeAttribute("src");
          }
        });
        domPurifyHooksInstalled = true;
      }
      return purify.sanitize(html2, config);
    } catch {
      return basicSanitize(html2);
    }
  }
  const SAFE_DATA_IMAGE_MIME_TYPES = new Set([
    "image/apng",
    "image/avif",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ]);
  function isSafeDataImageUrl(url) {
    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();
    if (!lower.startsWith("data:image/")) return false;
    const commaIndex = trimmed.indexOf(",");
    if (commaIndex === -1) return false;
    const meta = lower.slice("data:".length, commaIndex);
    const mime = meta.split(";")[0] || "";
    if (!SAFE_DATA_IMAGE_MIME_TYPES.has(mime)) return false;
    if (!meta.includes(";base64")) return false;
    return true;
  }
  function sanitizeUrl(url, options = {}) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();
    if (options.allowDataImage && isSafeDataImageUrl(trimmed)) {
      return trimmed;
    }
    const blockedProtocols = ["javascript:", "vbscript:", "data:", "file:"];
    if (blockedProtocols.some((protocol) => lower.startsWith(protocol))) {
      return "";
    }
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      return trimmed;
    }
    if (lower.startsWith("//")) {
      return trimmed;
    }
    const hasExplicitScheme = /^[a-z][a-z0-9+.-]*:/i.test(lower);
    if (hasExplicitScheme) {
      const mode = options.mode ?? "relaxed";
      if (mode === "strict") return "";
      const allowedProtocols = ["mailto:", "tel:", "blob:", "ftp:"];
      if (allowedProtocols.some((protocol) => lower.startsWith(protocol))) {
        return trimmed;
      }
      return "";
    }
    return trimmed;
  }
  const WEIGHTS = {
CONTENT_ID_CLASS: 25,
    ARTICLE_TAG: 15,
    HIGH_TEXT_DENSITY: 20,
    PARAGRAPH_COUNT: 10,
    CHINESE_RATIO: 15,
    TEXT_LENGTH_BONUS: 20,

NAV_HEADER_FOOTER: -25,
    AD_CLASS: -30,
    COMMENT_CLASS: -20,
    HIGH_LINK_DENSITY: -20
  };
  const MIN_TEXT_LENGTH = 500;
  const MIN_CHINESE_RATIO = 0.3;
  class ContentDetector {
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
tryKnownSelectors(doc2) {
      for (const selector of KNOWN_CONTENT_SELECTORS) {
        try {
          const el = doc2.querySelector(selector);
          if (el && (this.isValidContent(el) || this.isPKeyLoadMoreContent(el, doc2))) {
            return {
              element: el,
              selector,
              confidence: this.isValidContent(el) ? 0.9 : 0.78,
              method: "selector",
              preview: this.getPreview(el)
            };
          }
        } catch {
        }
      }
      return null;
    }
isPKeyLoadMoreContent(element, doc2) {
      const rawText = (element.textContent || "").replace(/\s+/g, "").trim();
      if (!rawText) return false;
      const normalized = rawText.replace(/[|｜]/g, "");
      const hasLoadMore = normalized.includes("加载更多");
      const hasBlockedHint = normalized.includes("无法显示本章节全部内容") || normalized.includes("阅读模式") && normalized.includes("无法显示");
      if (!hasLoadMore && !hasBlockedHint) return false;
      return this.hasInlinePKey(doc2);
    }
    hasInlinePKey(doc2) {
      const scripts = Array.from(doc2.querySelectorAll("script"));
      for (const script of scripts) {
        const text2 = script.textContent || "";
        if (!text2 || !text2.includes("p_key")) continue;
        if (/p_key\s*=\s*['"][A-Za-z0-9+/=]{80,}['"]/.test(text2)) return true;
      }
      return false;
    }
findCandidates(doc2) {
      const containers = doc2.querySelectorAll("div, article, section, main, td");
      return Array.from(containers).filter((el) => {
        const text2 = el.textContent || "";
        if (text2.length < MIN_TEXT_LENGTH) return false;
        if (this.isNavigationElement(el)) return false;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") {
          return false;
        }
        return true;
      });
    }
scoreCandidates(candidates) {
      return candidates.map((element) => {
        let score = 0;
        const text2 = element.textContent || "";
        const html2 = element.innerHTML;
        const textLength = text2.length;
        const htmlLength = html2.length;
        const textDensity = textLength / Math.max(htmlLength, 1);
        const linkDensity = this.calculateLinkDensity(element);
        const chineseRatio = this.calculateChineseRatio(text2);
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
isValidContent(element) {
      const text2 = element.textContent || "";
      if (text2.length < MIN_TEXT_LENGTH) return false;
      const chineseRatio = this.calculateChineseRatio(text2);
      if (chineseRatio < MIN_CHINESE_RATIO) return false;
      const linkDensity = this.calculateLinkDensity(element);
      if (linkDensity > 0.5) return false;
      return true;
    }
isNavigationElement(element) {
      const tagName = element.tagName.toUpperCase();
      if (["NAV", "HEADER", "FOOTER", "ASIDE"].includes(tagName)) {
        return true;
      }
      const idClass = ((element.id || "") + " " + (element.className || "")).toLowerCase();
      return /nav|menu|sidebar|footer|header/.test(idClass);
    }
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
calculateChineseRatio(text2) {
      const chineseChars = text2.match(/[\u4e00-\u9fff]/g) || [];
      const nonWhitespace = text2.replace(/\s/g, "");
      return chineseChars.length / Math.max(nonWhitespace.length, 1);
    }
generateSelector(element) {
      return generateCssSelector(element);
    }
normalizeScore(score) {
      return Math.min(Math.max(score / 100, 0), 1);
    }
getPreview(element) {
      const text2 = element.textContent || "";
      return text2.trim().substring(0, 200) + (text2.length > 200 ? "..." : "");
    }
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
/[下上]一?頁/,
/第\d+页/,
/\(\d+\/\d+\)/
];
  const CHAPTER_TEXT_PATTERNS = [
    /[下上]一?章/,
/[下上]一?节/,
/第.+章/
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
    '[class*="share"]',
    '[id*="share"]',
    ".div_feedback",
    '[class*="feedback"]',
    '[id*="feedback"]',
    ".anchor_bookmark",
    '[class*="bookmark"]',
    '[id*="bookmark"]',
    ".social_share_frame",
    ".social_share_inner_frame",
    ".page-separator",
    ".page_separator_first",
    ".page_separator_last",
    ".prev_page",
    ".next_page",
    ".more_recommend",
    '[class*="recommend"]',
    '[id*="recommend"]',
    ".txtcenter",
    ".mobadsq",
    "amp-social-share",
    "ins.adsbygoogle"
  ];
  const AD_PATTERNS = [
/[（(]本章未完[，,]?请?点击下一页继续阅读[）)]/gi,
    /本章未完[，,]?请?点击下一页继续.*/gi,
    /请点击下一页继续阅读/gi,
    /点击下一页继续阅读/gi,
/[（(]第\d+[/／]\d+页[）)]/gi,
    /第\d+[/／]\d+页/gi,
/[（(]\s*[）)]/g,
/[（(]\s*$/gm,
/^\s*[）)]/gm,

/手机用户请到.*阅读/gi,
    /请记住本书.*网址/gi,
    /百度搜索.*最新章节/gi,
    /一秒记住.*为您提供/gi,
    /天才一秒记住/gi,
    /笔趣阁.*www\.[a-z]+\.(com|net|org)/gi,
    /添加书签\s*返回目录\s*章节报错\s*分享给朋友[:：]?\s*/gi,
    /添加書籤\s*返回目錄\s*章節報錯\s*分享給朋友[:：]?\s*/gi,
    /由於[緩缓存]原因[^<\n]{0,120}(?:更新|網站|网站|站)/gi,
    /[请請][用戶用户]直接[瀏覽浏览]器[訪访]問[^<\n]{0,120}/gi,
/(?:阅[|｜\s]*读[|｜\s]*模[|｜\s]*式|畅[|｜\s]*读[|｜\s]*模[|｜\s]*式)[^<\n]{0,60}无[|｜\s]*法[|｜\s]*显[|｜\s]*示[|｜\s]*本[|｜\s]*章[|｜\s]*节[|｜\s]*全[|｜\s]*部[|｜\s]*内[|｜\s]*容[^<\n]{0,120}/gi,
    /请[|｜\s]*返[|｜\s]*回[|｜\s]*原[|｜\s]*网[|｜\s]*页[|｜\s]*阅[|｜\s]*读/gi,
    /加[|｜\s]*载[|｜\s]*更[|｜\s]*多/gi,
/小[^\u4e00-\u9fff]{0,3}说[^\u4e00-\u9fff]{0,3}网[^\u4e00-\u9fff]{0,6}最[^\u4e00-\u9fff]{0,3}新[^\u4e00-\u9fff]{0,3}章[^\u4e00-\u9fff]{0,3}节[^\u4e00-\u9fff]{0,6}更[^\u4e00-\u9fff]{0,3}新[^\u4e00-\u9fff]{0,3}快/gi,
    /最[^\u4e00-\u9fff]{0,3}新[^\u4e00-\u9fff]{0,3}章[^\u4e00-\u9fff]{0,3}节[^\u4e00-\u9fff]{0,6}更[^\u4e00-\u9fff]{0,3}新[^\u4e00-\u9fff]{0,3}快/gi,
    /幻[^\u4e00-\u9fff]{0,3}想[^\u4e00-\u9fff]{0,3}姬[^\u4e00-\u9fff]{0,6}免[^\u4e00-\u9fff]{0,3}费[^\u4e00-\u9fff]{0,3}(?:阅|讀)[^\u4e00-\u9fff]{0,3}(?:读|讀)/gi,
    /萝[^\u4e00-\u9fff]{0,3}拉[^\u4e00-\u9fff]{0,3}小[^\u4e00-\u9fff]{0,3}说[^\u4e00-\u9fff]{0,3}\d{1,3}[^\u4e00-\u9fff]{0,3}最[^\u4e00-\u9fff]{0,3}新[^\u4e00-\u9fff]{0,3}章[^\u4e00-\u9fff]{0,3}节[^\u4e00-\u9fff]{0,6}更[^\u4e00-\u9fff]{0,3}新[^\u4e00-\u9fff]{0,3}快/gi,
    /(天天看小说|天天看小說)[^<\n]*ttks\.tw/gi,
    /⚡?\s*天天看[小小說]{2}[^<\n]*/gi,
    /https?:\/\/[^\s<>"]+/gi,
    /www\.[a-z0-9]+\.(com|net|org|cc)/gi
  ];
  const INVALID_URL_PATTERNS = [
    /(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
    /^javascript:/i,
    /BuyChapterUnLogin/i,
    /\/0\.html$/i,
/\/chapter\/get_par_tsu_list(?:$|[/?#])/i,
    /\/chapter\/ajax_get_session_code(?:$|[/?#])/i,
    /\/chapter\/get_book_chapter_detail_info(?:$|[/?#])/i,
/^https?:\/\/[^/]+\/?$/i,
/^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php|aspx)?$/i,
/^https?:\/\/[^/]+\/\?/i
];
  class NavigationDetector {
    constructor() {
      this._lastSignals = [];
      this._lastBaseUrl = "";
    }
    resolveBaseUrl(doc2, currentUrl) {
      var _a;
      const candidates = [
        currentUrl,
        (_a = doc2.location) == null ? void 0 : _a.href,
        doc2._mnrUrl,
        typeof window !== "undefined" ? window.location.href : void 0
      ];
      for (const candidate of candidates) {
        if (!candidate) continue;
        try {
          const u = new URL(candidate);
          if (u.protocol === "http:" || u.protocol === "https:") {
            return u.toString();
          }
        } catch {
        }
      }
      return candidates.find(Boolean) || "";
    }
    resolveLinkUrl(anchor, baseUrl) {
      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return null;
      let parsedUrl;
      try {
        parsedUrl = new URL(rawHref, baseUrl);
      } catch {
        return null;
      }
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return null;
      }
      return parsedUrl.toString();
    }
collectLinkSignals(doc2, baseUrl) {
      var _a;
      const anchors = doc2.querySelectorAll("a[href]");
      const signals = [];
      for (const node of Array.from(anchors)) {
        const anchor = node;
        const href = this.resolveLinkUrl(anchor, baseUrl);
        if (!href) continue;
        let rect = null;
        try {
          const r = anchor.getBoundingClientRect();
          rect = { top: r.top };
        } catch {
        }
        signals.push({
          anchor,
          href,
          text: ((_a = anchor.textContent) == null ? void 0 : _a.trim()) || "",
          title: anchor.title || "",
          rel: (anchor.getAttribute("rel") || "").toLowerCase(),
          rect
        });
      }
      return signals;
    }
detect(doc2, currentUrl) {
      const resolvedCurrentUrl = this.resolveBaseUrl(doc2, currentUrl);
      const signals = this.collectLinkSignals(doc2, resolvedCurrentUrl);
      this._lastSignals = signals;
      this._lastBaseUrl = resolvedCurrentUrl;
      return {
        next: this.findNavLink(signals, "next", resolvedCurrentUrl),
        prev: this.findNavLink(signals, "prev", resolvedCurrentUrl),
        index: this.findNavLink(signals, "index", resolvedCurrentUrl)
      };
    }
findNavLink(signals, type, currentUrl) {
      const patterns = NAV_PATTERNS[type];
      if (type !== "index") {
        const relSignal = signals.find((s) => s.rel === type);
        if (relSignal && this.isValidLink(relSignal.anchor, type, currentUrl, relSignal.href)) {
          return {
            element: relSignal.anchor,
            url: relSignal.href,
            selector: this.generateSelector(relSignal.anchor),
            confidence: 0.95,
            method: "rel-attribute",
            text: relSignal.text
          };
        }
      }
      const candidates = [];
      for (const signal of signals) {
        const { anchor, href, text: text2, title, rect } = signal;
        if (!this.isValidLink(anchor, type, currentUrl, href)) continue;
        let score = 0;
        for (const pattern of patterns) {
          if (pattern.test(text2)) {
            score += 10;
            if (text2.length <= 5) score += 5;
          }
        }
        if (type === "next" || type === "prev") {
          const isChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text2));
          const isSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text2));
          if (isChapter) score += 3;
          if (isSection && !isChapter) score -= 2;
        }
        if (type === "index") {
          if (/^《.+》$/.test(text2)) {
            score += 8;
          }
          if (href.endsWith("/") || /\/index\.html?$/i.test(href)) {
            score += 3;
          }
        }
        for (const pattern of patterns) {
          if (pattern.test(title)) {
            score += 5;
          }
        }
        if (rect) {
          try {
            if (rect.top < 300 || rect.top > document.documentElement.scrollHeight - 300) {
              score += 2;
            }
          } catch {
          }
        }
        if (text2.length > 20) {
          score -= 5;
        }
        if (score > 0) {
          candidates.push({ element: anchor, score, text: text2, href });
        }
      }
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      return {
        element: best.element,
        url: best.href,
        selector: this.generateSelector(best.element),
        confidence: Math.min(best.score / 15, 0.9),
        method: "text-matching",
        text: best.text
      };
    }
isValidLink(anchor, purpose, currentUrl, href) {
      var _a;
      const text2 = ((_a = anchor.textContent) == null ? void 0 : _a.trim()) || "";
      if (!href) return false;
      let parsedUrl;
      try {
        parsedUrl = new URL(href);
      } catch {
        return false;
      }
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return false;
      }
      for (const pattern of INVALID_URL_PATTERNS) {
        if (pattern.test(href)) {
          if (purpose === "index") {
            const looksLikeIndex = NAV_PATTERNS.index.some((p2) => p2.test(text2));
            const looksLikeBookTitle = /^《.+》$/.test(text2);
            if (looksLikeIndex || looksLikeBookTitle) continue;
          }
          return false;
        }
      }
      if (href.includes("#") && !href.includes("#chapter")) {
        try {
          const currentPathname = new URL(currentUrl).pathname;
          if (parsedUrl.pathname === currentPathname) {
            return false;
          }
        } catch {
        }
      }
      try {
        const pathname = parsedUrl.pathname;
        if (pathname === "/" || pathname.length < 3) {
          if (purpose === "index" && pathname.length >= 3) {
            const looksLikeBookTitle = /^《.+》$/.test(text2);
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
            const looksLikeNav = NAV_PATTERNS[purpose].some((p2) => p2.test(text2)) || CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text2)) || SECTION_TEXT_PATTERNS.some((p2) => p2.test(text2));
            if (!looksLikeNav) {
              return false;
            }
          }
        }
        if (purpose === "index" && pathname.endsWith("/")) {
          return true;
        }
        const nonChapterPaths = [
          /^\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)/i,
          /^\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i
];
        for (const pattern of nonChapterPaths) {
          if (pattern.test(pathname)) return false;
        }
      } catch {
      }
      return true;
    }
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
detectSection(doc2, currentUrl, navigation) {
      var _a;
      const baseUrl = this.resolveBaseUrl(doc2, currentUrl);
      const signals = this._lastSignals.length > 0 && this._lastBaseUrl === baseUrl ? this._lastSignals : this.collectLinkSignals(doc2, baseUrl);
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
          const nextUrl = navigation.next.url;
          const comparison = this.compareUrlsForSection(currentUrl, nextUrl);
          if (comparison.isSection) {
            result.isSection = true;
            result.nextSectionUrl = nextUrl;
            result.confidence = Math.max(result.confidence, 0.9);
            result.method = "link-text";
          } else {
            result.nextChapterUrl = result.nextChapterUrl || nextUrl;
          }
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
          const prevUrl = navigation.prev.url;
          const comparison = this.compareUrlsForSection(prevUrl, currentUrl);
          if (comparison.isSection) {
            result.isSection = true;
            result.currentSection = ((_a = this.extractSectionFromUrl(currentUrl)) == null ? void 0 : _a.section) ?? null;
            result.confidence = Math.max(result.confidence, 0.85);
            result.method = "link-text";
          }
        }
      }
      if (!result.nextSectionUrl) {
        const nextSectionUrl = this.findNextSectionUrl(signals, currentUrl);
        if (nextSectionUrl) {
          result.isSection = true;
          result.nextSectionUrl = nextSectionUrl;
          result.confidence = Math.max(result.confidence, 0.9);
          if (result.method === "none") result.method = "link-text";
        }
      }
      if (result.isSection && !result.nextChapterUrl) {
        result.nextChapterUrl = this.findNextChapterUrl(signals, currentUrl);
      }
      return result;
    }
extractSectionFromUrl(url) {
      try {
        const parsed = new URL(url);
        const info = parseChapterSectionFromPathname(parsed.pathname);
        if (!info) return null;
        if (info.section > 1) {
          return { section: info.section };
        }
        return null;
      } catch {
        return null;
      }
    }
compareUrlsForSection(currentUrl, nextUrl) {
      try {
        const current = new URL(currentUrl);
        const next = new URL(nextUrl);
        if (current.host !== next.host) {
          return { isSection: false, confidence: 0 };
        }
        const currentPath = current.pathname;
        const nextPath = next.pathname;
        if (isSectionLikeUrl(currentUrl, nextUrl)) {
          const currentInfo2 = parseChapterSectionFromPathname(currentPath);
          const nextInfo2 = parseChapterSectionFromPathname(nextPath);
          if (currentInfo2 && nextInfo2 && currentInfo2.chapterKey === nextInfo2.chapterKey && nextInfo2.section === currentInfo2.section + 1 && nextInfo2.section > 1) {
            return { isSection: true, confidence: 0.95 };
          }
          return { isSection: true, confidence: 0.85 };
        }
        const currentInfo = parseChapterSectionFromPathname(currentPath);
        const nextInfo = parseChapterSectionFromPathname(nextPath);
        if (currentInfo && nextInfo && currentInfo.chapterKey !== nextInfo.chapterKey) {
          return { isSection: false, confidence: 0 };
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
    findNextSectionUrl(signals, currentUrl) {
      const normalizeText = (text2) => text2.replace(/\s+/g, "").trim();
      const isNextSectionText = (text2) => {
        const t = normalizeText(text2);
        if (!t) return false;
        if (t.includes("下一页") || t.includes("下页") || t.includes("下一頁") || t.includes("下頁")) {
          return true;
        }
        if (t.toLowerCase().includes("next") && !t.toLowerCase().includes("chapter")) {
          return true;
        }
        return false;
      };
      const candidates = [];
      for (const signal of signals) {
        const { anchor, href, text: text2, rel } = signal;
        if (!text2) continue;
        const isSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text2));
        const isChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text2));
        if (!isSection || isChapter) continue;
        if (!isNextSectionText(text2)) continue;
        if (!this.isValidLink(anchor, "next", currentUrl, href)) continue;
        const comparison = this.compareUrlsForSection(currentUrl, href);
        if (!comparison.isSection) continue;
        let score = 50;
        if (text2.length <= 5) score += 5;
        if (rel.includes("next")) score += 5;
        if (anchor.closest(".pager, .pagination, .page, nav, footer")) score += 2;
        score += Math.round(comparison.confidence * 10);
        candidates.push({ url: href, score });
      }
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0].url;
    }
findNextChapterUrl(signals, currentUrl) {
      for (const signal of signals) {
        const { anchor, href, text: text2 } = signal;
        const normalizedText = text2.replace(/\s+/g, "").trim();
        const isForward = /下一/.test(normalizedText) || /下[章节篇话]/.test(normalizedText) || /后一章/.test(normalizedText) || /next/i.test(normalizedText);
        if (!isForward) continue;
        const isChapter = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text2));
        const isSection = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text2));
        if (isChapter && !isSection && this.isValidLink(anchor, "next", currentUrl, href)) {
          const comparison = this.compareUrlsForSection(currentUrl, href);
          if (!comparison.isSection) {
            return href;
          }
        }
      }
      return null;
    }
generateSelector(element) {
      return generateCssSelector(element);
    }
  }
  const KNOWN_TITLE_SELECTORS = [
    "h1.chapter-title",
    "h1.chapter_title",
    ".chapter-title",
    ".chapter_title",
    ".bookname h1",
    "h1.title",
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
    ".book-name",
    ".book_name",
    ".bookinfo h1",
    ".bookinfo h2",
    "#bookname",
    "#book-info h1",
    "#book-info h2",
    "#info h1",
    "#info h2",
    ".novel-title",
    "h2.title",
    ".layout-tit a[title]",
    ".breadcrumb a:last-of-type",
    ".chapter-nav a:last-of-type",
    ".booknav a:first-of-type"
  ];
  const TITLE_CLEANUP_PATTERNS = [
    /^章节目录/,
    /^文章正文/,
    /^正文卷?/,
    /全文免费阅读$/,
    /最新章节$/,
    /[（(]\s*\d+\s*[/／]\s*\d+\s*[）)]\s*$/,
/\(文\)$/,
    /_.*$/,
/-.*小说.*$/i
  ];
  class TitleDetector {
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
detectFromSelector(doc2) {
      for (const selector of KNOWN_TITLE_SELECTORS) {
        try {
          const el = doc2.querySelector(selector);
          if (el) {
            const text2 = this.cleanTitle(el.textContent || "");
            if (this.isValidTitle(text2)) {
              return {
                chapterTitle: text2,
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
detectFromHeadings(doc2) {
      const h1s = doc2.querySelectorAll("h1");
      for (const h1 of Array.from(h1s)) {
        const text2 = this.cleanTitle(h1.textContent || "");
        if (this.isValidTitle(text2) && TITLE_PATTERN.test(text2)) {
          return {
            chapterTitle: text2,
            selector: this.generateSelector(h1),
            confidence: 0.8,
            method: "heading"
          };
        }
      }
      const h2s = doc2.querySelectorAll("h2");
      for (const h2 of Array.from(h2s)) {
        const text2 = this.cleanTitle(h2.textContent || "");
        if (this.isValidTitle(text2) && TITLE_PATTERN.test(text2)) {
          return {
            chapterTitle: text2,
            selector: this.generateSelector(h2),
            confidence: 0.7,
            method: "heading"
          };
        }
      }
      return null;
    }
detectBookTitle(doc2) {
      var _a, _b;
      const genericLabelPattern = /^(?:首页|主页|home|index|返回|返回目录|目录|章节目录|章節目錄|章节列表|章節列表|章节|章節|最新章节|最新章節|正文|内容|內容|简介|簡介|作品信息|书籍信息|書籍信息|小说|小說|阅读|閱讀|catalog|toc|contents?)$/i;
      const breadcrumbIgnorePattern = /^(?:首页|主页|home|index|返回|返回目录|目录|章节目录|章節目錄|章节列表|章節列表|章节|章節)$/i;
      const isValidBookTitle = (text2) => {
        if (!text2 || text2.length < 2 || text2.length > 100) return false;
        if (TITLE_PATTERN.test(text2)) return false;
        if (genericLabelPattern.test(text2.trim())) return false;
        const normalized = text2.replace(/\s+/g, "").toLowerCase();
        if (normalized.includes("天天看小说") || normalized.includes("天天看小說")) return false;
        const siteWords = [
          "起点中文网",
          "起点中文網",
          "顶点小说",
          "頂點小說",
          "笔趣阁",
          "筆趣閣",
          "小说网",
          "小說網",
          "小说阅读网",
          "小說閱讀網",
          "小说阅读",
          "小說閱讀",
          "阅读网",
          "閱讀網",
          "书吧",
          "書吧",
          "69书吧",
          "69書吧"
        ];
        if (siteWords.some((word) => normalized.includes(word) && normalized.length <= word.length + 4))
          return false;
        if (normalized.startsWith("⚡")) return false;
        return true;
      };
      const candidates = new Map();
      const addCandidate = (text2, weight = 1) => {
        if (!text2) return;
        const cleaned = this.cleanBookTitle(text2);
        if (!cleaned || !isValidBookTitle(cleaned)) return;
        candidates.set(cleaned, (candidates.get(cleaned) || 0) + weight);
      };
      const anchorText = (el) => {
        return (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "").replace(/\s+/g, " ").trim();
      };
      const collectFromBreadcrumbs = () => {
        const breadcrumbSelectors = [
          '[class*="breadcrumb"]',
          '[class*="crumb"]',
          '[class*="bread"]',
          'nav[aria-label*="breadcrumb"]'
        ];
        const containers = doc2.querySelectorAll(breadcrumbSelectors.join(", "));
        for (const container of Array.from(containers)) {
          const links = Array.from(container.querySelectorAll("a"));
          if (links.length === 0) continue;
          const texts = links.map(anchorText).filter(Boolean);
          const filtered = texts.filter(
            (t) => !TITLE_PATTERN.test(t) && !breadcrumbIgnorePattern.test(t)
          );
          if (filtered.length === 0) continue;
          const best = filtered.reduce((a, b) => b.length > a.length ? b : a);
          addCandidate(best, 3);
        }
      };
      const collectFromStructuredData = () => {
        var _a2;
        const scripts = doc2.querySelectorAll(
          'script[type="application/ld+json"], script[type="application/json"]'
        );
        const tryParseJson = (text2) => {
          try {
            return JSON.parse(text2);
          } catch {
            return void 0;
          }
        };
        const findBookTitle = (value, depth = 0) => {
          if (!value || depth > 4) return void 0;
          if (Array.isArray(value)) {
            for (const item of value) {
              const found = findBookTitle(item, depth + 1);
              if (found) return found;
            }
            return void 0;
          }
          if (typeof value !== "object") return void 0;
          const obj = value;
          const directKeys = [
            "bookName",
            "book_name",
            "bookTitle",
            "book_title",
            "novelName",
            "novel_name",
            "novelTitle",
            "novel_title"
          ];
          for (const key of directKeys) {
            const candidate = obj[key];
            if (typeof candidate === "string") return candidate;
          }
          const type = obj["@type"];
          if (typeof type === "string" && /book|novel/i.test(type)) {
            const candidate = obj.name || obj.title;
            if (typeof candidate === "string") return candidate;
          }
          const containerKeys = ["bookInfo", "book", "novel", "novelInfo", "info", "data"];
          for (const key of containerKeys) {
            const found = findBookTitle(obj[key], depth + 1);
            if (found) return found;
          }
          for (const key of Object.keys(obj)) {
            if (directKeys.includes(key) || containerKeys.includes(key)) continue;
            const found = findBookTitle(obj[key], depth + 1);
            if (found) return found;
          }
          return void 0;
        };
        for (const script of Array.from(scripts)) {
          const text2 = (_a2 = script.textContent) == null ? void 0 : _a2.trim();
          if (!text2) continue;
          const data = tryParseJson(text2);
          if (!data) continue;
          const found = findBookTitle(data);
          if (found) {
            addCandidate(found, 4);
          }
        }
      };
      const collectFromScriptText = () => {
        const scriptSelectors = [
          "script:not([type])",
          'script[type="text/javascript"]',
          'script[type="application/javascript"]'
        ];
        const scripts = doc2.querySelectorAll(scriptSelectors.join(", "));
        const patterns = [
          /bookName\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
          /book_name\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
          /bookTitle\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
          /book_title\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
          /novelName\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
          /novel_title\s*[:=]\s*["']([^"'\\n]{2,80})["']/i,
          new RegExp(`lastread\\.set\\([^,]*,[^,]*,\\s*["\\']([^"\\'\\r\\n]{2,80})["\\']`, "i")
        ];
        for (const script of Array.from(scripts)) {
          const text2 = script.textContent;
          if (!text2 || text2.length > 2e5) continue;
          for (const pattern of patterns) {
            const match = text2.match(pattern);
            if (match == null ? void 0 : match[1]) {
              addCandidate(match[1], 3);
            }
          }
        }
      };
      const collectFromSelectors = (selectors, weight = 2) => {
        for (const selector of selectors) {
          try {
            const el = doc2.querySelector(selector);
            if (el) {
              const text2 = (el.textContent || "").trim();
              addCandidate(text2, weight);
            }
          } catch {
            continue;
          }
        }
      };
      collectFromSelectors(KNOWN_BOOK_TITLE_SELECTORS, 3);
      collectFromBreadcrumbs();
      collectFromStructuredData();
      collectFromScriptText();
      const metaNames = ["og:novel:book_name", "og:book:title", "book_name", "og:novel:book_name"];
      for (const name of metaNames) {
        const meta = doc2.querySelector(`meta[name="${cssEscape(name)}"]`) || doc2.querySelector(`meta[property="${cssEscape(name)}"]`);
        addCandidate(meta == null ? void 0 : meta.getAttribute("content"), 4);
      }
      const metaTitles = ["og:title", "twitter:title"];
      for (const name of metaTitles) {
        const meta = doc2.querySelector(`meta[name="${cssEscape(name)}"]`) || doc2.querySelector(`meta[property="${cssEscape(name)}"]`);
        addCandidate(meta == null ? void 0 : meta.getAttribute("content"), 2);
      }
      const metaKeywords = doc2.querySelector('meta[name="keywords"]');
      if (metaKeywords == null ? void 0 : metaKeywords.getAttribute("content")) {
        const keywords = (metaKeywords.getAttribute("content") || "").split(/[，,|｜]/).map((s) => s.trim()).filter(Boolean);
        if (keywords.length > 0) {
          addCandidate(keywords[0], 1);
        }
      }
      const metaDescription = (_a = doc2.querySelector('meta[name="description"]')) == null ? void 0 : _a.getAttribute("content");
      if (metaDescription) {
        const bracket = metaDescription.match(/《([^》]+)》/);
        if (bracket) {
          addCandidate(bracket[1], 2);
        }
      }
      const docTitle = doc2.title;
      const bracketMatch = docTitle.match(/《([^》]+)》/);
      if (bracketMatch) {
        addCandidate(bracketMatch[1], 1);
      }
      const parts = docTitle.split(/[-_|,，]/).map((s) => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        const firstPart = parts[0];
        addCandidate(firstPart.replace(TITLE_PATTERN, "").replace(/《|》/g, ""), 1);
        for (const part of parts) {
          if (TITLE_PATTERN.test(part)) continue;
          addCandidate(part.replace(/《|》/g, ""), 1);
        }
      }
      const fallbackParts = parts.length ? parts : docTitle.split(/[-_|,，]/).map((s) => s.trim()).filter(Boolean);
      if (fallbackParts.length >= 2) {
        const bookPart = fallbackParts[1] || fallbackParts[fallbackParts.length - 1];
        addCandidate(bookPart, 1);
      }
      const directoryLinks = Array.from(doc2.querySelectorAll("a")).filter(
        (a) => /目录|章节/.test(a.textContent || "")
      );
      for (const link of directoryLinks) {
        const text2 = link.textContent || "";
        const bracket = text2.match(/《([^》]+)》/);
        if (bracket) {
          addCandidate(bracket[1], 2);
          continue;
        }
        const cleaned = text2.replace(/目录|章节|列表|返回|最新|TXT/gi, "").trim();
        if (cleaned) {
          addCandidate(cleaned, 1);
        }
      }
      if (candidates.size === 0) return void 0;
      const sorted = Array.from(candidates.entries()).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return b[0].length - a[0].length;
      });
      return (_b = sorted[0]) == null ? void 0 : _b[0];
    }
cleanTitle(text2) {
      let cleaned = text2.trim();
      for (const pattern of TITLE_CLEANUP_PATTERNS) {
        cleaned = cleaned.replace(pattern, "");
      }
      cleaned = cleaned.replace(/\s+/g, " ").trim();
      return cleaned;
    }
cleanBookTitle(text2) {
      let cleaned = text2.trim();
      const bracketMatch = cleaned.match(/《([^》]+)》/);
      if (bracketMatch) {
        cleaned = bracketMatch[1].trim();
      }
      cleaned = cleaned.replace(/^[\]\s"'“”‘’【】[（）()<>《》·•\-—–_~!！?？★☆⚡]+/, "").replace(/[\]\s"'“”‘’【】[（）()<>《》·•\-—–_~!！?？★☆⚡]+$/, "").trim();
      const chapterMatch = cleaned.match(TITLE_PATTERN);
      if ((chapterMatch == null ? void 0 : chapterMatch.index) !== void 0 && chapterMatch.index > 0) {
        cleaned = cleaned.slice(0, chapterMatch.index).trim();
      }
      const cleanupPatterns = [
        /(?:小说|小說)?(?:全文|在线|線上|免费|免費)?阅读$/i,
        /(?:小说|小說)?(?:最新章节|最新章節)$/i,
        /(?:章节目录|章節目錄|章节列表|章節列表|目录|目錄|列表)$/i,
        /(?:TXT|txt)(?:全集|下载|下載)?$/i,
        /(?:无弹窗|無彈窗)$/i
      ];
      for (const pattern of cleanupPatterns) {
        cleaned = cleaned.replace(pattern, "").trim();
      }
      const siteSuffixPattern = new RegExp(
        "[-_|—–]\\s*[^-|—–|_]{0,40}(?:小说|小說|阅读|閱讀|网|網|站|书屋|書屋|书吧|書吧|笔趣阁|筆趣閣|顶点|頂點|起点|起點|中文网|中文網|手机版|手機版|官网|官網|小说网|小說網|阅读网|閱讀網).*$",
        "i"
      );
      cleaned = cleaned.replace(siteSuffixPattern, "").trim();
      cleaned = cleaned.replace(/\s+/g, " ").trim();
      return cleaned;
    }
isValidTitle(text2) {
      if (!text2 || text2.length < 2) return false;
      if (text2.length > 100) return false;
      if (!/\S/.test(text2)) return false;
      return true;
    }
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
detect(doc2 = document, currentUrl = window.location.href) {
      const content = this.contentDetector.detect(doc2);
      const navigation = this.navigationDetector.detect(doc2, currentUrl);
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
detectSection(doc2 = document, currentUrl = window.location.href) {
      const navigation = this.navigationDetector.detect(doc2, currentUrl);
      return this.navigationDetector.detectSection(doc2, currentUrl, navigation);
    }
quickCheck(doc2 = document) {
      var _a;
      const currentUrl = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const indicators = [
() => {
          const title = doc2.title;
          return /第.{1,10}章|chapter|小说|阅读/i.test(title);
        },
() => {
          const selectors = ["#content", "#chapter_content", ".noveltext", "#BookText"];
          return selectors.some((s) => doc2.querySelector(s) !== null);
        },
() => {
          const links = Array.from(doc2.querySelectorAll("a"));
          return links.some((a) => /下一[章页节篇回]|下页/i.test(a.textContent || ""));
        },
() => {
          const body = doc2.body;
          const text2 = (body == null ? void 0 : body.textContent) || "";
          return text2.length > 3e3;
        },
() => {
          const body = doc2.body;
          const text2 = (body == null ? void 0 : body.textContent) || "";
          return /\/chapters?\//i.test(currentUrl) && text2.length > 1200;
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
generateSelector(element) {
      return this.contentDetector.generateSelector(element);
    }
getThreshold() {
      return this.confidenceScorer.getThreshold();
    }
setThreshold(threshold) {
      this.confidenceScorer.setThreshold(threshold);
    }
  }
  class ContentProcessor {
    constructor(options = {}) {
      this.regexCache = new Map();
      this.options = {
        removeAds: true,
        normalizeWhitespace: true,
        fixImages: true,
        stripInlineStyles: true,
        ...options
      };
    }
process(element, doc2) {
      if (this.options.useRawContent) {
        let html22 = element.innerHTML;
        if (this.options.fixImages) {
          html22 = this.fixImages(html22, doc2, { center: false });
        }
        return sanitizeHtml(html22);
      }
      const clone2 = element.cloneNode(true);
      this.expandEncodedLoadMoreContent(clone2, doc2);
      this.removeUnwantedElements(clone2);
      if (this.options.removeSelectors) {
        this.removeBySelector(clone2, this.options.removeSelectors);
      }
      this.removeReaderUiNoise(clone2);
      if (this.options.stripInlineStyles) {
        this.stripInlineStyles(clone2);
      }
      let html2 = clone2.innerHTML;
      if (this.options.replaceRules) {
        html2 = this.applyReplaceRules(html2, this.options.replaceRules);
      }
      if (this.options.removeAds) {
        const temp = doc2.createElement("div");
        temp.innerHTML = html2;
        this.removeAdPatternsFromTextNodes(temp, doc2);
        html2 = temp.innerHTML;
      }
      if (this.options.normalizeWhitespace) {
        html2 = this.normalizeWhitespace(html2);
      }
      if (this.options.fixImages) {
        html2 = this.fixImages(html2, doc2);
      }
      html2 = this.convertBrToParagraphs(html2);
      html2 = this.cleanDuplicateInfo(html2, doc2);
      html2 = sanitizeHtml(html2);
      return html2;
    }
removeReaderUiNoise(container) {
      const normalize = (text2) => text2.replace(/\s+/g, "").trim();
      const uiLabelSet = new Set([
        "投票推荐",
        "投票推薦",
        "加入书签",
        "加入書籤",
        "添加书签",
        "添加書籤",
        "小说报错",
        "小說報錯",
        "章节报错",
        "章節報錯",
        "关灯",
        "關燈",
        "字体-",
        "字体+",
        "字體-",
        "字體+",
        "上一章",
        "下一章",
        "上一页",
        "下一页",
        "上一頁",
        "下一頁",
        "目录",
        "目錄",
        "章节目录",
        "章節目錄",
        "章节列表",
        "章節列表",
        "返回书目",
        "返回書目",
        "返回目录",
        "返回目錄",
        "加入收藏",
        "加入收藏夹"
      ]);
      const isUiLabel = (text2) => {
        const t = normalize(text2);
        if (!t) return false;
        if (uiLabelSet.has(t)) return true;
        if (/^字体[+-]$/.test(t) || /^字體[+-]$/.test(t)) return true;
        if (/^(?:上一|下一)(?:章|页|頁)$/.test(t)) return true;
        if (/^(?:章?节|章節)?(?:目录|目錄|列表)$/.test(t)) return true;
        return false;
      };
      const clickables = Array.from(container.querySelectorAll("a, button, label"));
      for (const el of clickables) {
        const rawText = (el.textContent || "").trim();
        const t = normalize(rawText);
        if (!t) continue;
        if (t.length > 12) continue;
        if (isUiLabel(t)) {
          el.remove();
        }
      }
      const blocks = Array.from(
        container.querySelectorAll("div, p, span, li, section, nav, header, footer")
      );
      for (const el of blocks) {
        const text2 = normalize(el.textContent || "");
        if (!text2) continue;
        if (text2.length > 240) continue;
        const hasPrevNext = (text2.includes("上一章") || text2.includes("上一頁") || text2.includes("上一页")) && (text2.includes("下一章") || text2.includes("下一頁") || text2.includes("下一页"));
        const hasCatalog = text2.includes("目录") || text2.includes("目錄") || text2.includes("章节目录");
        const hasBookmark = text2.includes("书签") || text2.includes("書籤");
        const hasVote = text2.includes("投票推荐") || text2.includes("投票推薦");
        const hasReport = text2.includes("报错") || text2.includes("報錯");
        const hasLight = text2.includes("关灯") || text2.includes("關燈");
        const hasFont = text2.includes("字体") || text2.includes("字體");
        const isNavBar = hasPrevNext && (hasCatalog || text2.includes("章節目錄"));
        const isTopBar = hasVote && hasBookmark || hasBookmark && hasReport;
        const isFontBar = hasLight && hasFont;
        const isKeyboardTip = (text2.includes("温馨提示") || text2.includes("溫馨提示")) && (text2.toLowerCase().includes("enter") || text2.includes("回车") || text2.includes("回車") || text2.includes("←") || text2.includes("→") || text2.includes("按"));
        if (isKeyboardTip) {
          el.remove();
          continue;
        }
        if (isNavBar && text2.length <= 120) {
          el.remove();
          continue;
        }
        if ((isTopBar || isFontBar) && text2.length <= 160) {
          el.remove();
          continue;
        }
      }
    }
processToText(element) {
      const clone2 = element.cloneNode(true);
      this.removeUnwantedElements(clone2);
      let text2 = clone2.textContent || "";
      if (this.options.removeAds) {
        text2 = this.removeAdPatterns(text2);
      }
      if (this.options.normalizeWhitespace) {
        text2 = text2.replace(/\s+/g, " ").trim();
      }
      return text2;
    }
removeUnwantedElements(element) {
      for (const selector of REMOVE_SELECTORS) {
        try {
          const elements = this.smartQueryAll(element, selector);
          elements.forEach((el) => el.remove());
        } catch {
        }
      }
    }
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
getCachedRegex(pattern, flags) {
      const key = `${pattern}\0${flags}`;
      if (this.regexCache.has(key)) {
        return this.regexCache.get(key);
      }
      try {
        const regex = new RegExp(pattern, flags);
        this.regexCache.set(key, regex);
        return regex;
      } catch {
        this.regexCache.set(key, null);
        return null;
      }
    }
applyReplaceRules(html2, rules) {
      let result = html2;
      for (const rule of rules) {
        const regex = this.getCachedRegex(rule.pattern, rule.flags || "g");
        if (regex) {
          result = result.replace(regex, rule.replacement);
        }
      }
      return result;
    }
removeAdPatterns(text2) {
      let result = text2;
      for (const pattern of AD_PATTERNS) {
        result = result.replace(pattern, "");
      }
      return result;
    }
    removeAdPatternsFromTextNodes(container, doc2) {
      const showText = typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_TEXT : 4;
      const walker = doc2.createTreeWalker(container, showText);
      let node;
      while (node = walker.nextNode()) {
        const value = node.nodeValue || "";
        const cleaned = this.removeAdPatterns(value);
        if (cleaned !== value) node.nodeValue = cleaned;
      }
    }
normalizeWhitespace(html2) {
      return html2.replace(/<p>\s*<\/p>/gi, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").replace(/<p>\s+/gi, "<p>").replace(/\s+<\/p>/gi, "</p>");
    }
    fixImages(html2, doc2, options = { center: true }) {
      const temp = doc2.createElement("div");
      temp.innerHTML = html2;
      const images = temp.querySelectorAll("img");
      images.forEach((img) => {
        var _a, _b, _c;
        const srcAttr = ((_a = img.getAttribute("src")) == null ? void 0 : _a.trim()) || "";
        const looksPlaceholder = !srcAttr || srcAttr === "#" || srcAttr === "about:blank" || srcAttr.startsWith("data:") || srcAttr.startsWith("javascript:") || srcAttr.startsWith("vbscript:");
        if (looksPlaceholder) {
          const candidates = [
            "data-src",
            "data-original",
            "data-lazy-src",
            "data-original-src",
            "data-url",
            "data-actualsrc",
            "data-echo",
            "data-srcset"
          ];
          for (const attrName of candidates) {
            const rawValue = (_b = img.getAttribute(attrName)) == null ? void 0 : _b.trim();
            if (!rawValue) continue;
            const value = attrName === "data-srcset" ? (_c = rawValue.split(",")[0]) == null ? void 0 : _c.trim().split(/\s+/)[0] : rawValue;
            const safeUrl = sanitizeUrl(value, { allowDataImage: true, mode: "strict" });
            if (!safeUrl) continue;
            img.setAttribute("src", safeUrl);
            break;
          }
        }
        if (options.center) {
          img.style.display = "block";
          img.style.maxWidth = "100%";
          img.style.margin = "10px auto";
        }
      });
      return temp.innerHTML;
    }
convertBrToParagraphs(html2) {
      let result = html2.replace(/(<br\s*\/?>\s*){2,}/gi, "</p><p>");
      if (!result.includes("<p>")) {
        result = "<p>" + result.replace(/<br\s*\/?>/gi, "</p><p>") + "</p>";
      }
      result = result.replace(/<p>\s*<\/p>/gi, "");
      return result;
    }
setOptions(options) {
      this.options = { ...this.options, ...options };
      this.regexCache.clear();
    }
cleanDuplicateInfo(html2, doc2) {
      var _a, _b, _c, _d;
      const { chapterTitle } = this.options;
      let result = html2;
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
      const tempDiv = doc2.createElement("div");
      tempDiv.innerHTML = result;
      const isRemovableEmptyNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) return true;
        if (node.nodeType !== Node.ELEMENT_NODE) return true;
        const el = node;
        const tag = el.tagName.toLowerCase();
        const keepTags = new Set(["img", "svg", "picture", "video", "audio", "canvas"]);
        if (keepTags.has(tag)) return false;
        if (el.children.length > 0) return false;
        return true;
      };
      const children = Array.from(tempDiv.childNodes);
      let removedCount = 0;
      const maxRemove = 3;
      for (const child of children) {
        if (removedCount >= maxRemove) break;
        const text2 = (child.textContent || "").trim();
        if (!text2) {
          if (isRemovableEmptyNode(child)) {
            (_a = child.parentNode) == null ? void 0 : _a.removeChild(child);
          }
          continue;
        }
        if (text2.length < 100 && this.looksLikeDuplicateTitle(text2)) {
          (_b = child.parentNode) == null ? void 0 : _b.removeChild(child);
          removedCount++;
          continue;
        }
        break;
      }
      for (const child of Array.from(tempDiv.children)) {
        if (child.children.length > 0) continue;
        const text2 = (child.textContent || "").trim();
        if (/^>+$/.test(text2)) {
          child.remove();
        }
      }
      const tailNodes = Array.from(tempDiv.childNodes);
      let tailRemoved = 0;
      const maxTailRemove = 3;
      for (let i = tailNodes.length - 1; i >= 0 && tailRemoved < maxTailRemove; i--) {
        const node = tailNodes[i];
        const text2 = (node.textContent || "").trim();
        if (!text2) {
          if (isRemovableEmptyNode(node)) {
            (_c = node.parentNode) == null ? void 0 : _c.removeChild(node);
            tailRemoved++;
            continue;
          }
          break;
        }
        if (/^>+$/.test(text2)) {
          (_d = node.parentNode) == null ? void 0 : _d.removeChild(node);
          tailRemoved++;
          continue;
        }
        break;
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
looksLikeDuplicateTitle(text2) {
      const { chapterTitle, bookTitle } = this.options;
      const trimmed = text2.trim();
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
fuzzyMatch(text2, target) {
      if (!text2 || !target) return false;
      const t1 = text2.replace(/\s+/g, "").toLowerCase();
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
escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
smartQueryAll(root, selector) {
      const hasJqueryPseudo = /:(?:contains\(|eq\(|first\b|last\b)/.test(selector);
      if (!hasJqueryPseudo) {
        try {
          return Array.from(root.querySelectorAll(selector));
        } catch {
        }
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
          for (const text2 of containsTexts) {
            candidates = candidates.filter((el) => (el.textContent || "").includes(text2));
          }
          return candidates;
        } catch {
          return [];
        }
      }
      return [];
    }
    expandEncodedLoadMoreContent(container, doc2) {
      const normalizedText = this.normalizeObfuscatedText(container.textContent || "");
      const hasLoadMore = normalizedText.includes("加载更多");
      const hasBlockedHint = normalizedText.includes("无法显示本章节全部内容") || normalizedText.includes("阅读模式") && normalizedText.includes("无法显示");
      if (!hasLoadMore && !hasBlockedHint) return;
      const pKey = this.extractInlinePKey(doc2);
      if (!pKey) return;
      const decoded = this.decodeBase64Utf8(pKey);
      if (!decoded) return;
      if (!decoded.includes("<p") || !/[\u4e00-\u9fff]/.test(decoded)) return;
      const decodedPlain = this.normalizeObfuscatedText(decoded.replace(/<[^>]+>/g, ""));
      const decodedTextHead = decodedPlain.slice(0, 60);
      const decodedTextTail = decodedPlain.slice(-60);
      if (decodedTextHead && normalizedText.includes(decodedTextHead)) {
        this.removeLoadMoreUi(container);
        if (decodedTextTail && !normalizedText.includes(decodedTextTail)) {
          container.innerHTML = decoded;
        }
        return;
      }
      this.removeLoadMoreUi(container);
      try {
        container.insertAdjacentHTML("beforeend", decoded);
      } catch {
        const p2 = doc2.createElement("p");
        p2.textContent = decoded.replace(/<[^>]+>/g, "");
        container.appendChild(p2);
      }
    }
    removeLoadMoreUi(container) {
      for (const p2 of Array.from(container.querySelectorAll("p"))) {
        const t = this.normalizeObfuscatedText(p2.textContent || "");
        if (t.includes("无法显示本章节全部内容") || t.includes("阅读模式") && t.includes("无法显示") || t.includes("请返回原网页阅读")) {
          p2.remove();
        }
      }
      const candidates = Array.from(container.querySelectorAll("button, a"));
      for (const el of candidates) {
        const t = this.normalizeObfuscatedText(el.textContent || "");
        if (!t) continue;
        if (t.includes("加载更多") || t.includes("展开更多") || t.includes("查看更多")) {
          const wrapper = el.closest("p");
          if (wrapper) wrapper.remove();
          else el.remove();
        }
      }
    }
    normalizeObfuscatedText(text2) {
      return text2.replace(/\s+/g, "").replace(/[|｜]/g, "").trim();
    }
    extractInlinePKey(doc2) {
      const scripts = Array.from(doc2.querySelectorAll("script"));
      for (const script of scripts) {
        const text2 = script.textContent || "";
        if (!text2 || !text2.includes("p_key")) continue;
        const match = text2.match(/p_key\s*=\s*'([^']+)'/);
        if (match == null ? void 0 : match[1]) return match[1];
        const match2 = text2.match(/p_key\s*=\s*"([^"]+)"/);
        if (match2 == null ? void 0 : match2[1]) return match2[1];
      }
      return null;
    }
    decodeBase64Utf8(input) {
      const value = (input || "").trim();
      if (!value) return null;
      try {
        if (typeof atob === "function" && typeof TextDecoder !== "undefined") {
          const binary = atob(value);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return new TextDecoder("utf-8").decode(bytes);
        }
      } catch {
      }
      try {
        const B = globalThis.Buffer;
        if (!B || typeof B.from !== "function") return null;
        return String(B.from(value, "base64").toString("utf8"));
      } catch {
        return null;
      }
    }
  }
  function asRecord(value) {
    return value && typeof value === "object" ? value : null;
  }
  function isSuccessCode(value) {
    return value === 1e5 || value === "100000";
  }
  function getUnsafeWindow() {
    return typeof unsafeWindow !== "undefined" ? unsafeWindow : null;
  }
  function getCrypto() {
    var _a;
    const win = typeof window !== "undefined" ? window : null;
    return (win == null ? void 0 : win.CryptoJS) || ((_a = getUnsafeWindow()) == null ? void 0 : _a.CryptoJS) || null;
  }
  function normalizeCiweimaoUrl(value, baseUrl) {
    if (!value) return "";
    try {
      return new URL(value, baseUrl).href;
    } catch {
      return value;
    }
  }
  function getCiweimaoChapterId(url) {
    return (url.match(/\/chapter\/(\d+)/) || [])[1] || "";
  }
  function getCiweimaoBookIdFromIndex(url) {
    if (!url) return "";
    return (url.match(/\/chapter-list\/(\d+)/) || [])[1] || "";
  }
  function fixCiweimaoNavHref(doc2, selector, pageUrl) {
    const el = doc2.querySelector(selector);
    if (!el) return;
    let href = el.getAttribute("data-href") || el.getAttribute("data-url") || el.getAttribute("data-next") || el.getAttribute("data-prev") || el.getAttribute("data-link") || "";
    if (!href) href = el.getAttribute("href") || "";
    if (!href || href.startsWith("javascript")) {
      const html2 = el.outerHTML || "";
      const match = html2.match(/https?:\/\/(?:www|wap)\.ciweimao\.com\/chapter\/\d+/);
      if (match) href = match[0];
    }
    if (href && !href.startsWith("javascript")) {
      el.setAttribute("href", normalizeCiweimaoUrl(href, pageUrl));
    } else {
      el.removeAttribute("href");
    }
  }
  async function fetchCiweimaoJson(target, pageUrl, helpers) {
    try {
      const unsafeWin = getUnsafeWindow();
      const currentWin = typeof window !== "undefined" ? window : null;
      const fetcher = (unsafeWin == null ? void 0 : unsafeWin.fetch) || (currentWin == null ? void 0 : currentWin.fetch) || (typeof fetch === "function" ? fetch : null);
      if (fetcher) {
        const fetchThis = (unsafeWin == null ? void 0 : unsafeWin.fetch) ? unsafeWin : (currentWin == null ? void 0 : currentWin.fetch) ? currentWin : void 0;
        const response = await fetcher.call(fetchThis, target, {
          credentials: "include",
          referrer: pageUrl
        });
        if (response == null ? void 0 : response.ok) return asRecord(await response.json());
      }
    } catch {
    }
    if (!(helpers == null ? void 0 : helpers.fetchJson)) return null;
    return helpers.fetchJson(target, {
      headers: { Referer: pageUrl },
      withCredentials: true
    });
  }
  async function fetchCiweimaoText(target, referrer) {
    try {
      const unsafeWin = getUnsafeWindow();
      const currentWin = typeof window !== "undefined" ? window : null;
      const fetcher = (unsafeWin == null ? void 0 : unsafeWin.fetch) || (currentWin == null ? void 0 : currentWin.fetch) || (typeof fetch === "function" ? fetch : null);
      if (!fetcher) return null;
      const fetchThis = (unsafeWin == null ? void 0 : unsafeWin.fetch) ? unsafeWin : (currentWin == null ? void 0 : currentWin.fetch) ? currentWin : void 0;
      const response = await fetcher.call(fetchThis, target, {
        credentials: "include",
        referrer
      });
      if (!(response == null ? void 0 : response.ok)) return null;
      return response.text();
    } catch {
      return null;
    }
  }
  function decryptCiweimaoContent(chapterContent, encryptedKeys, accessKey, crypto) {
    const chars = accessKey.split("");
    const total = encryptedKeys.length;
    if (!total || !chars.length) return "";
    const keyChain = [
      encryptedKeys[chars[chars.length - 1].charCodeAt(0) % total],
      encryptedKeys[chars[0].charCodeAt(0) % total]
    ];
    const decode = (str) => atob(str);
    const encode = (str) => btoa(str);
    let current = chapterContent;
    for (let i = 0; i < keyChain.length; i++) {
      const decoded = decode(typeof current === "string" ? current : current.toString());
      const key = keyChain[i];
      const iv = encode(decoded.substring(0, 16));
      const encrypted = encode(decoded.substring(16));
      const parsed = crypto.format.OpenSSL.parse(encrypted);
      const decrypted = crypto.AES.decrypt(parsed, crypto.enc.Base64.parse(key), {
        iv: crypto.enc.Base64.parse(iv),
        format: crypto.format.OpenSSL
      });
      current = i < keyChain.length - 1 ? decode(decrypted.toString(crypto.enc.Base64)) : decrypted;
    }
    return typeof current === "string" ? current : current.toString(crypto.enc.Utf8);
  }
  async function decryptCiweimaoIfNeeded(doc2, contentEl, pageUrl, helpers) {
    var _a;
    const hasWatermark = !!contentEl.querySelector("#J_BookRead_WaterMark, .watermark");
    const text2 = (contentEl.textContent || "").replace(/\s+/g, "").trim();
    const chapterParas = contentEl.querySelectorAll("p.chapter").length;
    const shouldDecrypt = hasWatermark || text2.length < 200 || chapterParas < 3;
    if (!shouldDecrypt) return;
    const chapterId = ((_a = doc2.querySelector("#J_BookCnt")) == null ? void 0 : _a.getAttribute("data-id")) || (pageUrl.match(/chapter\/(\d+)/) || [])[1];
    if (!chapterId) return;
    const origin = new URL(pageUrl).origin;
    const session = await fetchCiweimaoJson(
      `${origin}/chapter/ajax_get_session_code?chapter_id=${chapterId}`,
      pageUrl,
      helpers
    );
    if (!session || !isSuccessCode(session.code)) return;
    const accessKeyValue = session.chapter_access_key;
    if (accessKeyValue === void 0 || accessKeyValue === null) return;
    const accessKey = String(accessKeyValue);
    const data = await fetchCiweimaoJson(
      `${origin}/chapter/get_book_chapter_detail_info?chapter_id=${chapterId}&chapter_access_key=${accessKey}`,
      pageUrl,
      helpers
    );
    if (!data || !isSuccessCode(data.code)) return;
    const chapterContent = data.chapter_content;
    const encryptedKeys = Array.isArray(data.encryt_keys) ? data.encryt_keys.filter((key) => typeof key === "string") : [];
    const crypto = getCrypto();
    if (typeof chapterContent !== "string" || encryptedKeys.length === 0 || !crypto) return;
    const html2 = decryptCiweimaoContent(chapterContent, encryptedKeys, accessKey, crypto);
    if (html2) {
      contentEl.innerHTML = html2;
    }
  }
  function normalizeWatermarkText(value) {
    return value.replace(/\s+/g, "").replace(/[\u200b-\u200d\ufeff]/g, "").trim();
  }
  function isLikelyWatermarkToken(token) {
    if (!/^[A-Za-z0-9]{4,12}$/.test(token)) return false;
    const hasDigit = /\d/.test(token);
    const hasLower = /[a-z]/.test(token);
    const hasUpper = /[A-Z]/.test(token);
    return hasDigit && (hasLower || hasUpper) || hasLower && hasUpper;
  }
  function isCjk(ch) {
    return /[\u4e00-\u9fff]/.test(ch);
  }
  function isCjkPunct(ch) {
    return /[，。！？、“”‘’（）()【】[\]<>《》:：;；·~…—-]/.test(ch);
  }
  function getPrevNonSpace(text2, index) {
    for (let i = index - 1; i >= 0; i--) {
      const ch = text2[i];
      if (!/\s/.test(ch)) return ch;
    }
    return "";
  }
  function getNextNonSpace(text2, index) {
    for (let i = index; i < text2.length; i++) {
      const ch = text2[i];
      if (!/\s/.test(ch)) return ch;
    }
    return "";
  }
  function shouldStripWatermarkToken(token, before, after) {
    if (!isLikelyWatermarkToken(token)) return false;
    const beforeCjk = before && (isCjk(before) || isCjkPunct(before));
    const afterCjk = after && (isCjk(after) || isCjkPunct(after));
    if (!beforeCjk && !afterCjk) return false;
    const beforeAscii = before && /[A-Za-z0-9]/.test(before);
    const afterAscii = after && /[A-Za-z0-9]/.test(after);
    if (beforeAscii && afterAscii) return false;
    return true;
  }
  function stripWatermarkText(value) {
    if (!value || !/[\u4e00-\u9fff]/.test(value)) return value;
    let result = "";
    let i = 0;
    while (i < value.length) {
      const ch = value[i];
      if (/[A-Za-z0-9]/.test(ch)) {
        let j = i + 1;
        while (j < value.length && /[A-Za-z0-9]/.test(value[j])) j++;
        const token = value.slice(i, j);
        if (token.length >= 4 && token.length <= 12) {
          const before = getPrevNonSpace(value, i);
          const after = getNextNonSpace(value, j);
          if (shouldStripWatermarkToken(token, before, after)) {
            i = j;
            continue;
          }
        }
        result += token;
        i = j;
        continue;
      }
      result += ch;
      i += 1;
    }
    return result;
  }
  function cleanupCiweimaoWatermarks(doc2, contentEl) {
    var _a, _b;
    contentEl.querySelectorAll("span, i, em, b, strong, font").forEach((node) => {
      const text2 = normalizeWatermarkText(node.textContent || "");
      if (isLikelyWatermarkToken(text2)) {
        node.remove();
      }
    });
    const showText = ((_b = (_a = doc2.defaultView) == null ? void 0 : _a.NodeFilter) == null ? void 0 : _b.SHOW_TEXT) ?? 4;
    const walker = doc2.createTreeWalker(contentEl, showText);
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    textNodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent) return;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return;
      const text2 = node.nodeValue || "";
      const cleaned = stripWatermarkText(text2);
      if (cleaned !== text2) {
        node.nodeValue = cleaned;
      }
    });
    contentEl.querySelectorAll("p.chapter span").forEach((span) => span.remove());
    contentEl.querySelectorAll("p.chapter").forEach((p2) => {
      const hasImg = p2.querySelector("img");
      const text2 = (p2.textContent || "").replace(/\s+/g, "").trim();
      if (hasImg && text2.length <= 6) {
        p2.remove();
      }
    });
    const normalizeTailText = (value) => value.replace(/\s+/g, "").replace(/[\u3000]/g, "").replace(/[，。！？、“”‘’（）()【】[\]<>《》:：;；·~…—-]/g, "");
    const textParas = Array.from(contentEl.querySelectorAll("p")).map((p2) => ({ p: p2, text: normalizeTailText(p2.textContent || "") })).filter((item) => item.text);
    textParas.slice(-8).forEach(({ p: p2, text: text2 }) => {
      if (text2 && /^[\u4e00-\u9fff]{2,6}$/.test(text2)) {
        p2.remove();
      }
    });
  }
  const tocCache = new Map();
  function parseCiweimaoToc(html2, tocUrl, fallbackBookTitle = "") {
    var _a;
    const parser = new DOMParser();
    const doc2 = parser.parseFromString(html2, "text/html");
    const seen = new Set();
    const entries2 = [];
    doc2.querySelectorAll('a[href*="/chapter/"]').forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const url = normalizeCiweimaoUrl(href, tocUrl);
      if (!/\/chapter\/\d+/.test(url) || seen.has(url)) return;
      const title = (anchor.textContent || "").replace(/\s+/g, " ").trim();
      if (!title) return;
      seen.add(url);
      entries2.push({ title, url });
    });
    const titleText = (((_a = doc2.querySelector("title")) == null ? void 0 : _a.textContent) || "").trim();
    const bookTitle = fallbackBookTitle || titleText.replace(/最新章节.*$/u, "").replace(/无弹窗全文阅读.*$/u, "").trim();
    return { bookTitle, entries: entries2 };
  }
  async function getCiweimaoToc(indexUrl, referrer, fallbackBookTitle = "") {
    const bookId = getCiweimaoBookIdFromIndex(indexUrl);
    const cacheKey = bookId || indexUrl;
    if (!cacheKey) return null;
    let cached = tocCache.get(cacheKey);
    if (!cached) {
      cached = (async () => {
        const html2 = await fetchCiweimaoText(indexUrl, referrer);
        if (!html2 || /man-machine-verify|验证码|人机验证/i.test(html2)) return null;
        return parseCiweimaoToc(html2, indexUrl, fallbackBookTitle);
      })();
      cached.then((toc) => {
        if (!toc) {
          tocCache.delete(cacheKey);
        }
      });
      tocCache.set(cacheKey, cached);
    }
    return cached;
  }
  function createCiweimaoApiDocument(options) {
    const doc2 = document.implementation.createHTMLDocument(options.title);
    const safeSetText = (el, text2) => {
      el.textContent = text2;
      return el;
    };
    const breadcrumb = doc2.createElement("div");
    breadcrumb.className = "breadcrumb";
    const bookLink = doc2.createElement("a");
    bookLink.href = options.indexUrl || options.url;
    safeSetText(bookLink, options.bookTitle);
    breadcrumb.append(bookLink);
    const box = doc2.createElement("div");
    box.className = "book-read-box";
    const cnt = doc2.createElement("div");
    cnt.id = "J_BookCnt";
    cnt.setAttribute("data-id", getCiweimaoChapterId(options.url));
    const header = doc2.createElement("div");
    header.className = "read-hd";
    const h1 = doc2.createElement("h1");
    h1.className = "chapter";
    safeSetText(h1, options.title);
    header.append(h1);
    const content = doc2.createElement("div");
    content.className = "read-bd";
    content.id = "J_BookRead";
    content.innerHTML = options.contentHtml;
    const nav = doc2.createElement("div");
    nav.className = "book-read-page";
    if (options.prevUrl) {
      const prev = doc2.createElement("a");
      prev.id = "J_BtnPagePrev";
      prev.href = options.prevUrl;
      safeSetText(prev, "上一章");
      nav.append(prev);
    }
    if (options.indexUrl) {
      const index = doc2.createElement("a");
      index.href = options.indexUrl;
      safeSetText(index, "目录");
      nav.append(index);
    }
    if (options.nextUrl) {
      const next = doc2.createElement("a");
      next.id = "J_BtnPageNext";
      next.href = options.nextUrl;
      safeSetText(next, "下一章");
      nav.append(next);
    }
    cnt.append(header, content);
    box.append(cnt, nav);
    doc2.body.append(breadcrumb, box);
    return doc2;
  }
  async function fetchCiweimaoApiDocument(targetUrl, refChapter) {
    var _a, _b;
    try {
      const chapterId = getCiweimaoChapterId(targetUrl);
      if (!chapterId || !/\/\/(?:www|wap)\.ciweimao\.com\/chapter\//.test(targetUrl)) return null;
      const indexUrl = refChapter.indexUrl || "";
      const toc = indexUrl ? await getCiweimaoToc(indexUrl, refChapter.url, refChapter.bookTitle || "") : null;
      const normalizedTargetUrl = normalizeCiweimaoUrl(targetUrl, refChapter.url);
      const tocIndex = (toc == null ? void 0 : toc.entries.findIndex(
        (entry2) => normalizeCiweimaoUrl(entry2.url, refChapter.url) === normalizedTargetUrl
      )) ?? -1;
      if (!toc || tocIndex < 0) return null;
      const entry = toc.entries[tocIndex];
      const prevUrl = ((_a = toc.entries[tocIndex - 1]) == null ? void 0 : _a.url) || "";
      const nextUrl = ((_b = toc.entries[tocIndex + 1]) == null ? void 0 : _b.url) || "";
      const origin = new URL(normalizedTargetUrl).origin;
      const session = await fetchCiweimaoJson(
        `${origin}/chapter/ajax_get_session_code?chapter_id=${chapterId}`,
        normalizedTargetUrl
      );
      if (!session || !isSuccessCode(session.code)) return null;
      const accessKeyValue = session.chapter_access_key;
      if (accessKeyValue === void 0 || accessKeyValue === null) return null;
      const accessKey = String(accessKeyValue);
      const data = await fetchCiweimaoJson(
        `${origin}/chapter/get_book_chapter_detail_info?chapter_id=${chapterId}&chapter_access_key=${accessKey}`,
        normalizedTargetUrl
      );
      if (!data || !isSuccessCode(data.code)) return null;
      const chapterContent = data.chapter_content;
      const encryptedKeys = Array.isArray(data.encryt_keys) ? data.encryt_keys.filter((key) => typeof key === "string") : [];
      const crypto = getCrypto();
      if (typeof chapterContent !== "string" || encryptedKeys.length === 0 || !crypto) return null;
      const html2 = decryptCiweimaoContent(chapterContent, encryptedKeys, accessKey, crypto);
      if (!html2) return null;
      const doc2 = createCiweimaoApiDocument({
        bookTitle: toc.bookTitle || refChapter.bookTitle || "",
        contentHtml: html2,
        indexUrl,
        nextUrl,
        prevUrl,
        title: entry.title,
        url: normalizedTargetUrl
      });
      const contentEl = doc2.querySelector("#J_BookRead");
      if (contentEl) cleanupCiweimaoWatermarks(doc2, contentEl);
      return doc2;
    } catch (e) {
      console.warn("[MyNovelReader] Ciweimao API document error:", e);
      return null;
    }
  }
  const ciweimaoBeforeParse = async (doc2, url, helpers) => {
    var _a, _b;
    try {
      const contentEl = doc2.querySelector("#J_BookRead");
      if (!contentEl) return;
      const fallbackUrl = typeof window !== "undefined" && typeof ((_a = window.location) == null ? void 0 : _a.href) === "string" ? window.location.href : "";
      const pageUrl = url || ((_b = doc2.location) == null ? void 0 : _b.href) || fallbackUrl;
      if (!pageUrl) return;
      fixCiweimaoNavHref(doc2, "#J_BtnPagePrev", pageUrl);
      fixCiweimaoNavHref(doc2, ".J_BtnPagePrev", pageUrl);
      fixCiweimaoNavHref(doc2, "#J_BtnPageNext", pageUrl);
      fixCiweimaoNavHref(doc2, ".J_BtnPageNext", pageUrl);
      await decryptCiweimaoIfNeeded(doc2, contentEl, pageUrl, helpers);
      cleanupCiweimaoWatermarks(doc2, contentEl);
    } catch (e) {
      console.warn("[MyNovelReader] Ciweimao beforeParse error:", e);
    }
  };
  const ciweimaoContent = {
    selector: "#J_BookRead",
    remove: "i.J_Num, .chapter span, #J_BookRead_WaterMark, .watermark"
  };
  const ciweimaoHooks = {
    beforeParse: ciweimaoBeforeParse
  };
  const ciweimaoRule = {
    id: "ciweimao",
    name: "刺猬猫",
    version: 2,
    match: {
      pattern: "^https?://www\\.ciweimao\\.com/chapter/\\d+"
    },
    content: {
      ...ciweimaoContent
    },
    navigation: {
      prev: '#J_BtnPagePrev[href^="http"]',
      index: '.book-read-page a[href*="/chapter-list/"]',
      next: '#J_BtnPageNext[href^="http"]'
    },
    title: {
      selector: ".read-hd .chapter",
      bookSelector: ".breadcrumb > a:last()"
    },
    hooks: {
      ...ciweimaoHooks
    },
    advanced: {
      mutationSelector: "#J_BookRead",
      mutationChildCount: 2,
      timeout: 3e3
    },
    meta: { source: "builtin", exampleUrl: "https://www.ciweimao.com/chapter/113909523" }
  };
  const ciweimaoWapRule = {
    id: "ciweimao-wap",
    name: "刺猬猫(移动端)",
    version: 2,
    match: {
      pattern: "^https?://wap\\.ciweimao\\.com/chapter/\\d+/?(?:[?#].*)?$"
    },
    content: {
      ...ciweimaoContent
    },
    navigation: {
      prev: '.J_BtnPagePrev[href^="http"]',
      index: '.book-read-page .btn-list[href*="/chapter/"]',
      next: '.J_BtnPageNext[href^="http"]'
    },
    title: {
      selector: "h1.read-hd"
    },
    hooks: {
      ...ciweimaoHooks
    },
    advanced: {
      mutationSelector: "#J_BookRead",
      mutationChildCount: 2,
      timeout: 3e3
    },
    meta: { source: "builtin", exampleUrl: "https://wap.ciweimao.com/chapter/113489050" }
  };
  const __vite_glob_0_0$1 = Object.freeze( Object.defineProperty({
    __proto__: null,
    ciweimaoRule,
    ciweimaoWapRule,
    fetchCiweimaoApiDocument
  }, Symbol.toStringTag, { value: "Module" }));
  function getScriptText$1(doc2) {
    return Array.from(doc2.scripts).map((script) => script.textContent || "").join("\n");
  }
  function extractJsValue(source, name) {
    const pattern = new RegExp(
      `(?:var|let|const)\\s+${name}\\s*=\\s*(?:['"]([^'"]+)['"]|([^;\\s]+))\\s*;`
    );
    const match = source.match(pattern);
    return (match == null ? void 0 : match[1]) || (match == null ? void 0 : match[2]) || null;
  }
  function appendHiddenLink$1(doc2, id, href, text2, base) {
    var _a;
    if (!href || href === "#" || /^javascript:/i.test(href) || doc2.getElementById(id)) return;
    try {
      const link = doc2.createElement("a");
      link.id = id;
      link.href = new URL(href, base).toString();
      link.textContent = text2;
      link.style.display = "none";
      (_a = doc2.body) == null ? void 0 : _a.appendChild(link);
    } catch {
    }
  }
  function extractChapterNav$1(scriptText) {
    const match = scriptText.match(
      /if\s*\(\s*direction\s*===\s*['"]prev['"]\s*\)\s*\{[\s\S]*?chapterUrl\s*=\s*['"]([^'"]+)['"][\s\S]*?\}\s*else\s*\{[\s\S]*?chapterUrl\s*=\s*['"]([^'"]+)['"]/
    );
    return {
      prev: (match == null ? void 0 : match[1]) || null,
      next: (match == null ? void 0 : match[2]) || null
    };
  }
  const deqixsCoBeforeParse = async (doc2, url, helpers) => {
    var _a, _b, _c;
    try {
      const pageUrl = url || ((_a = doc2.location) == null ? void 0 : _a.href) || location.href;
      const page = new URL(pageUrl);
      const pathMatch = page.pathname.match(/^\/books\/(\d+)\/(\d+)\.html$/);
      if (!pathMatch) return;
      const [, articleId, chapterId] = pathMatch;
      const scriptText = getScriptText$1(doc2);
      const nav = extractChapterNav$1(scriptText);
      appendHiddenLink$1(doc2, "mnr-deqixs-co-prev", nav.prev, "上一章", pageUrl);
      appendHiddenLink$1(doc2, "mnr-deqixs-co-next", nav.next, "下一章", pageUrl);
      const tokenScriptSrc = (_b = doc2.querySelector('script[src*="/scripts/chapter.js.php"]')) == null ? void 0 : _b.getAttribute("src");
      if (!tokenScriptSrc || !helpers) return;
      const tokenScriptUrl = new URL(tokenScriptSrc, pageUrl).toString();
      const tokenScript = await helpers.fetchText(tokenScriptUrl, {
        timeoutMs: 15e3,
        referrer: pageUrl,
        withCredentials: true
      });
      if (!tokenScript) return;
      const token = extractJsValue(tokenScript, "chapterToken");
      const timestamp = extractJsValue(tokenScript, "timestamp");
      const nonce = extractJsValue(tokenScript, "nonce");
      if (!token || !timestamp || !nonce) return;
      const params = new URLSearchParams({
        aid: articleId,
        cid: chapterId,
        token,
        timestamp,
        nonce
      });
      const ajaxUrl = new URL(`/modules/article/ajax2.php?${params.toString()}`, pageUrl).toString();
      const responseText = await helpers.fetchText(ajaxUrl, {
        timeoutMs: 2e4,
        referrer: pageUrl,
        withCredentials: true,
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      if (!responseText) return;
      const payload = JSON.parse(responseText);
      const content = (_c = payload.data) == null ? void 0 : _c.content;
      if (payload.status !== 1 || typeof content !== "string" || !content.trim()) return;
      const contentEl = doc2.querySelector("#chapter-content");
      if (contentEl) {
        contentEl.innerHTML = content;
        contentEl.setAttribute("data-mnr-deqixs-full", "1");
      }
    } catch (e) {
      console.warn("[MyNovelReader] Deqixs.co beforeParse error:", e);
    }
  };
  const deqixsRule = {
    id: "deqixs",
    name: "得奇小说网",
    version: 1,
    match: {
      pattern: "^https?://www\\.deqixs\\.org/\\d+/\\d+(?:_\\d+)?\\.html(?:[?#].*)?$"
    },
    content: {
      selector: ".con",
      remove: "script, style, iframe, ins"
    },
    navigation: {
      prev: '.prenext span:first-child a[href$=".html"]',
      index: ".prenext > a",
      next: '.prenext span:last-child a[href$=".html"]'
    },
    title: {
      selector: ".submenu h1",
      replace: "^.*?>\\s*",
      bookSelector: '.submenu h1 > a[href$="/"]'
    },
    toc: {
      excludeAncestors: ".new, .item, h1, h2"
    },
    advanced: {
      checkSection: true,
      sectionDelayMs: 800
    },
    meta: {
      source: "builtin",
      exampleUrl: "https://www.deqixs.org/24/18442_6.html"
    }
  };
  const deqixsCoRule = {
    id: "deqixs-co",
    name: "得奇小说网(.co)",
    version: 2,
    match: {
      pattern: "^https?://www\\.deqixs\\.co/books/\\d+/\\d+\\.html(?:[?#].*)?$"
    },
    content: {
      selector: "#chapter-content",
      remove: "script, style, iframe, ins, .loading, .error",
      replace: [
        {
          pattern: "当&前@章#节\\$内%容\\^不&完\\*整！要~查!看-完_整\\|章;节\\)请\\(退&出%阅#读\\|模\\*式！",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "本章节未完.+?请订阅",
          replacement: "",
          flags: "g"
        }
      ]
    },
    navigation: {
      prev: "#mnr-deqixs-co-prev",
      index: '.breadcrumb a[href*="/books/"][href$="/"]',
      next: "#mnr-deqixs-co-next"
    },
    title: {
      selector: "h1.pt10",
      replace: "\\(第[^)]*页\\)\\s*$",
      bookSelector: '.breadcrumb a[href*="/books/"][href$="/"]'
    },
    hooks: {
      beforeParse: deqixsCoBeforeParse
    },
    meta: {
      source: "builtin",
      exampleUrl: "https://www.deqixs.co/books/325/266271.html"
    }
  };
  const __vite_glob_0_1$1 = Object.freeze( Object.defineProperty({
    __proto__: null,
    deqixsCoRule,
    deqixsRule
  }, Symbol.toStringTag, { value: "Module" }));
  function getScriptText(doc2) {
    return Array.from(doc2.scripts).map((script) => script.textContent || "").join("\n");
  }
  function appendHiddenLink(doc2, id, href, text2, base) {
    var _a;
    if (!href || href === "#" || /^javascript:/i.test(href) || doc2.getElementById(id)) return;
    try {
      const link = doc2.createElement("a");
      link.id = id;
      link.href = new URL(href, base).toString();
      link.textContent = text2;
      link.style.display = "none";
      (_a = doc2.body) == null ? void 0 : _a.appendChild(link);
    } catch {
    }
  }
  function extractChapterNav(scriptText) {
    const match = scriptText.match(
      /if\s*\(\s*direction\s*===\s*['"]prev['"]\s*\)\s*\{[\s\S]*?chapterUrl\s*=\s*['"]([^'"]+)['"][\s\S]*?\}\s*else\s*\{[\s\S]*?chapterUrl\s*=\s*['"]([^'"]+)['"]/
    );
    return {
      prev: (match == null ? void 0 : match[1]) || null,
      next: (match == null ? void 0 : match[2]) || null
    };
  }
  function extractChapterIds(pageUrl, scriptText) {
    var _a, _b;
    const pathMatch = new URL(pageUrl).pathname.match(/^\/(\d+)\/(\d+)(?:_\d+)?\.html$/);
    const articleId = (pathMatch == null ? void 0 : pathMatch[1]) || ((_a = scriptText.match(/const\s+articleId\s*=\s*(\d+)/)) == null ? void 0 : _a[1]);
    const chapterId = (pathMatch == null ? void 0 : pathMatch[2]) || ((_b = scriptText.match(/const\s+chapterId\s*=\s*(\d+)/)) == null ? void 0 : _b[1]);
    if (!articleId || !chapterId) return null;
    return { articleId, chapterId };
  }
  function fixPageIndexLink(doc2, base) {
    const index = doc2.querySelector(".page1 .page-index[data-href]");
    const dataHref = index == null ? void 0 : index.getAttribute("data-href");
    if (!index || !dataHref) return;
    try {
      index.href = new URL(dataHref, base).toString();
    } catch {
    }
  }
  const dingdianzwwBeforeParse = async (doc2, url, helpers) => {
    var _a, _b, _c, _d;
    try {
      const pageUrl = url || ((_a = doc2.location) == null ? void 0 : _a.href) || location.href;
      const scriptText = getScriptText(doc2);
      const nav = extractChapterNav(scriptText);
      appendHiddenLink(doc2, "mnr-dingdianzww-prev", nav.prev, "上一章", pageUrl);
      appendHiddenLink(doc2, "mnr-dingdianzww-next", nav.next, "下一章", pageUrl);
      fixPageIndexLink(doc2, pageUrl);
      const indexHref = ((_b = doc2.querySelector(".page1 .page-index")) == null ? void 0 : _b.href) || ((_c = doc2.querySelector('.bread a[href$="/"]:not([href="/"])')) == null ? void 0 : _c.href) || null;
      appendHiddenLink(doc2, "mnr-dingdianzww-index", indexHref, "目录", pageUrl);
      const contentEl = doc2.querySelector("#chapter-content");
      if (!contentEl || !(helpers == null ? void 0 : helpers.fetchText)) return;
      const ids = extractChapterIds(pageUrl, scriptText);
      if (!ids) return;
      const ajaxUrl = new URL("/modules/article/ajax_chapter.php", pageUrl);
      ajaxUrl.searchParams.set("aid", ids.articleId);
      ajaxUrl.searchParams.set("cid", ids.chapterId);
      const responseText = await helpers.fetchText(ajaxUrl.toString(), {
        timeoutMs: 2e4,
        withCredentials: true,
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      if (!responseText) return;
      const payload = JSON.parse(responseText);
      const content = (_d = payload.data) == null ? void 0 : _d.content;
      if (payload.status !== 1 || typeof content !== "string" || !content.trim()) return;
      contentEl.innerHTML = content;
      contentEl.setAttribute("data-mnr-dingdianzww-full", "1");
    } catch (e) {
      console.warn("[MyNovelReader] Dingdianzww beforeParse error:", e);
    }
  };
  const dingdianzwwRule = {
    id: "dingdianzww",
    name: "顶点小说",
    version: 2,
    match: {
      pattern: "^https?://dingdianzww\\.org/\\d+/\\d+\\.html(?:[?#].*)?$"
    },
    content: {
      selector: ".txtnav",
      remove: "script, style, iframe, ins, .txtinfo.hide720, .readinline, .ad_content",
      replace: [
        {
          pattern: "PC站点如章节文字不全请用手机访问dingdianzww\\.org",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "当&前@章#节\\$内%容\\^不&完\\*整！要~查!看-完_整\\|章;节\\)请\\(退&出%阅#读\\|模\\*式！",
          replacement: "",
          flags: "g"
        }
      ]
    },
    navigation: {
      prev: '#mnr-dingdianzww-prev, .page1 a:contains("上一章")',
      index: '#mnr-dingdianzww-index, .page1 a:contains("章节目录"), .page1 a:contains("目录")',
      next: '#mnr-dingdianzww-next, .page1 a:contains("下一章")'
    },
    title: {
      selector: ".txtnav > h1, h1",
      replace: "\\(第[^)]*页\\)\\s*$",
      bookSelector: '.bread a[href^="/"]:not([href="/"]):not([href="/index.html"])[href$="/"]'
    },
    hooks: {
      beforeParse: dingdianzwwBeforeParse
    },
    advanced: {
      useIframe: true,
      noSection: true
    },
    meta: {
      source: "builtin",
      exampleUrl: "https://dingdianzww.org/27543/13341609.html?page=1"
    }
  };
  const __vite_glob_0_2$1 = Object.freeze( Object.defineProperty({
    __proto__: null,
    dingdianzwwRule
  }, Symbol.toStringTag, { value: "Module" }));
  const gobooBeforeParse = async (doc2, url) => {
    var _a;
    try {
      const fallbackUrl = typeof location !== "undefined" && typeof location.href === "string" ? location.href : "";
      const pageUrl = url || ((_a = doc2.location) == null ? void 0 : _a.href) || fallbackUrl;
      const path = pageUrl ? new URL(pageUrl).pathname : "";
      const match = path.match(/^\/gb_(\d+)\/(\d+)\/\d+/);
      if (match && !doc2.querySelector("#mnr-goboo-index")) {
        const index = doc2.createElement("a");
        index.id = "mnr-goboo-index";
        index.href = `/ml_${match[1]}/${match[2]}`;
        index.textContent = "目录";
        index.style.display = "none";
        doc2.body.appendChild(index);
      }
      if (typeof document !== "undefined" && doc2 === document && doc2.querySelector(".content button")) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      doc2.querySelectorAll(".content p").forEach((p2) => {
        const text2 = (p2.textContent || "").replace(/\s+/g, "");
        if (/小说免费阅读，请收藏.*goboo\.cc/i.test(text2) || /阅\|读\|模\|式\|或\|畅\|读\|模\|式/.test(text2) || /加\|载\|更\|多/.test(text2)) {
          p2.remove();
        }
      });
    } catch (e) {
      console.warn("[MyNovelReader] Goboo beforeParse error:", e);
    }
  };
  const gobooRule = {
    id: "goboo-m",
    name: "钢笔小说(手机版)",
    version: 1,
    match: {
      pattern: "^https?://m\\.goboo\\.cc/gb_\\d+/\\d+/\\d+(?:/\\d+)?/?$"
    },
    content: {
      selector: ".content",
      remove: "script, iframe, ins, .page, .emgoouqv_b",
      replace: [
        {
          pattern: "【[^】]+】小说免费阅读，请收藏\\s*钢笔小说【goboo\\.cc】",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "阅\\|读\\|模\\|式\\|或\\|畅\\|读\\|模\\|式\\|下，?无\\|法\\|显\\|示\\|本\\|章\\|节\\|全\\|部\\|内\\|容，请\\|返\\|回\\|原\\|网\\|页阅\\|读。?加\\|载\\|更\\|多",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "本章未完，点击\\[下一页\\]继续阅读-->",
          replacement: "",
          flags: "g"
        }
      ]
    },
    navigation: {
      prev: ".page .left a",
      index: '#mnr-goboo-index, .page .center a, a[href*="/ml_"]',
      next: ".page .right a"
    },
    title: {
      pattern: "^(.+?)(?:\\(\\d+/\\d+\\))?\\s+-\\s+(.+?)小说\\s+-\\s+钢笔小说$",
      patternIndex: 1,
      bookPatternIndex: 2
    },
    hooks: {
      beforeParse: gobooBeforeParse
    },
    advanced: {
      checkSection: true,
      sectionDelayMs: 1200
    },
    meta: {
      source: "builtin",
      exampleUrl: "https://m.goboo.cc/gb_1/94443/1"
    }
  };
  const __vite_glob_0_3 = Object.freeze( Object.defineProperty({
    __proto__: null,
    gobooRule
  }, Symbol.toStringTag, { value: "Module" }));
  const hetushuBeforeParse = async (doc2, url, helpers) => {
    var _a, _b;
    try {
      const contentEl = doc2.querySelector("#content");
      if (!contentEl) return;
      const win = doc2.defaultView || (typeof window !== "undefined" ? window : null);
      const fallbackUrl = typeof window !== "undefined" && typeof ((_a = window.location) == null ? void 0 : _a.href) === "string" ? window.location.href : "";
      const pageUrl = url || ((_b = doc2.location) == null ? void 0 : _b.href) || fallbackUrl;
      const titleEl = contentEl.querySelector("h2");
      const watermarkSelector = "acronym, bdo, big, cite, code, dfn, kbd, q, s, samp, strike, tt, u, var, ins";
      const normalizeWatermarkText2 = (value) => value.replace(/[\s\u3000]+/g, "").replace(
        /[ｗwＷW]+[.．•·。]*[hｈ][eｅ][tｔ][uｕ][sｓ][hｈ][uｕ][.．。]*(?:com|ｃｏｍ)(?:[.．。]*(?:com|ｃｏｍ))?/gi,
        ""
      );
      const collectStyleText = async () => {
        const texts = Array.from(doc2.querySelectorAll("style")).map((style) => style.textContent || "").filter(Boolean);
        const links = Array.from(doc2.querySelectorAll('link[rel~="stylesheet"][href]'));
        for (const link of links) {
          if (!(helpers == null ? void 0 : helpers.fetchText)) continue;
          try {
            const href = link.getAttribute("href");
            if (!href) continue;
            const styleUrl = new URL(href, pageUrl).href;
            const text2 = await helpers.fetchText(styleUrl, {
              timeoutMs: 4e3,
              withCredentials: true
            });
            if (text2) texts.push(text2);
          } catch {
          }
        }
        return texts.join("\n");
      };
      const extractDisplayClasses = (cssText) => {
        const block = new Set();
        const none = new Set();
        const ruleRe = /([^{}]+)\{([^{}]+)\}/g;
        let match;
        while (match = ruleRe.exec(cssText)) {
          const selector = match[1] || "";
          const body = match[2] || "";
          if (!selector.includes("#content")) continue;
          const displayBlock = /display\s*:\s*block\b/i.test(body);
          const displayNone = /display\s*:\s*none\b/i.test(body);
          if (!displayBlock && !displayNone) continue;
          const classRe = /#content\s+\.([A-Za-z0-9_-]+)/g;
          let classMatch;
          while (classMatch = classRe.exec(selector)) {
            if (displayBlock) block.add(classMatch[1]);
            if (displayNone) none.add(classMatch[1]);
          }
        }
        return { block, none };
      };
      const styleClasses = extractDisplayClasses(await collectStyleText());
      const hasLayout = (el) => {
        if (!win) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };
      const isVisibleByClass = (el) => {
        const classes = Array.from(el.classList || []);
        if (!classes.length) return false;
        if (classes.some((cls) => styleClasses.none.has(cls))) return false;
        if (styleClasses.block.size > 0) return classes.some((cls) => styleClasses.block.has(cls));
        return true;
      };
      const isVisible = (el) => {
        if (!win || !hasLayout(el)) return isVisibleByClass(el);
        const style = win.getComputedStyle(el);
        if (style.display === "none") return false;
        if (style.visibility === "hidden" || style.visibility === "collapse") return false;
        if (Number(style.opacity) === 0) return false;
        return true;
      };
      const cleanClone = (el) => {
        var _a2, _b2;
        const clone2 = el.cloneNode(true);
        clone2.querySelectorAll(watermarkSelector).forEach((node) => node.remove());
        const showText = ((_b2 = (_a2 = doc2.defaultView) == null ? void 0 : _a2.NodeFilter) == null ? void 0 : _b2.SHOW_TEXT) ?? 4;
        const walker = doc2.createTreeWalker(clone2, showText);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach((node) => {
          const cleaned = normalizeWatermarkText2(node.nodeValue || "");
          if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
        });
        return clone2;
      };
      const rows = Array.from(contentEl.children).filter((el) => el !== titleEl && el.tagName !== "SCRIPT" && el.tagName !== "STYLE").filter(isVisible).map((el, index) => {
        const rect = win && hasLayout(el) ? el.getBoundingClientRect() : { top: index, left: 0 };
        return {
          index,
          top: rect.top + (win ? win.scrollY : 0),
          left: rect.left + (win ? win.scrollX : 0),
          el
        };
      }).sort((a, b) => a.top - b.top || a.left - b.left || a.index - b.index);
      if (!rows.length) return;
      const fragment = doc2.createDocumentFragment();
      if (titleEl) fragment.appendChild(titleEl.cloneNode(true));
      rows.forEach(({ el }) => {
        const paragraph = doc2.createElement("p");
        const clone2 = cleanClone(el);
        paragraph.innerHTML = clone2.innerHTML || clone2.textContent || "";
        if (paragraph.textContent && paragraph.textContent.replace(/\s+/g, "").trim()) {
          fragment.appendChild(paragraph);
        }
      });
      contentEl.innerHTML = "";
      contentEl.appendChild(fragment);
    } catch (e) {
      console.warn("[MyNovelReader] Hetushu beforeParse error:", e);
    }
  };
  const hetushuRule = {
    id: "hetushu",
    name: "和图书",
    version: 2,
    match: {
      pattern: "^https?://www\\.hetushu\\.com/book/\\d+/\\d+\\.html$"
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
    hooks: {
      beforeParse: hetushuBeforeParse
    },
    advanced: {
      useIframe: true
    },
    meta: { source: "builtin", exampleUrl: "https://www.hetushu.com/book/9145/6567989.html" }
  };
  const __vite_glob_0_4 = Object.freeze( Object.defineProperty({
    __proto__: null,
    hetushuRule
  }, Symbol.toStringTag, { value: "Module" }));
  function hasQidianChapterId(value) {
    return value !== void 0 && value !== null && String(value) !== "-1" && String(value) !== "";
  }
  function readQidianPageContext(doc2) {
    const script = doc2.querySelector("#vite-plugin-ssr_pageContext");
    if (!script) return null;
    try {
      return JSON.parse(script.textContent || "{}");
    } catch {
      return null;
    }
  }
  function extractBookIdFromQidianUrl(url) {
    if (!url) return null;
    try {
      const parsed = new URL(url, typeof location !== "undefined" ? location.href : void 0);
      const match = parsed.pathname.match(/\/(?:book|chapter)\/(\d+)(?:\/|$)/);
      return (match == null ? void 0 : match[1]) || null;
    } catch {
      return null;
    }
  }
  function extractChapterIdFromQidianUrl(url) {
    if (!url) return null;
    try {
      const parsed = new URL(url, typeof location !== "undefined" ? location.href : void 0);
      const match = parsed.pathname.match(/\/chapter\/\d+\/(\d+)(?:\/|$)/);
      return (match == null ? void 0 : match[1]) || null;
    } catch {
      return null;
    }
  }
  function resolveQidianBookId(data, url) {
    var _a, _b, _c, _d, _e, _f;
    const bookId = ((_d = (_c = (_b = (_a = data == null ? void 0 : data.pageContext) == null ? void 0 : _a.pageProps) == null ? void 0 : _b.pageData) == null ? void 0 : _c.bookInfo) == null ? void 0 : _d.bookId) ?? ((_f = (_e = data == null ? void 0 : data.pageContext) == null ? void 0 : _e.routeParams) == null ? void 0 : _f.bookId) ?? extractBookIdFromQidianUrl(url);
    return bookId === void 0 || bookId === null || String(bookId) === "" ? null : String(bookId);
  }
  function resolveQidianFirstChapterId(data) {
    var _a, _b, _c;
    const pageData = (_b = (_a = data == null ? void 0 : data.pageContext) == null ? void 0 : _a.pageProps) == null ? void 0 : _b.pageData;
    return (pageData == null ? void 0 : pageData.firstChapterId) ?? ((_c = pageData == null ? void 0 : pageData.chapterContentInfo) == null ? void 0 : _c.firstChapterId);
  }
  function resolveQidianNextPreviewChapterId(data) {
    var _a, _b, _c;
    const pageData = (_b = (_a = data == null ? void 0 : data.pageContext) == null ? void 0 : _a.pageProps) == null ? void 0 : _b.pageData;
    return (pageData == null ? void 0 : pageData.nextChapterId) ?? ((_c = pageData == null ? void 0 : pageData.chapterContentInfo) == null ? void 0 : _c.nextChapterId);
  }
  function resolveQidianMobileBookPreviewChapterUrl(doc2, url) {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return null;
    }
    if (parsedUrl.hostname !== "m.qidian.com") return null;
    if (!/^\/book\/\d+\/?$/.test(parsedUrl.pathname)) return null;
    const data = readQidianPageContext(doc2);
    const bookId = resolveQidianBookId(data, url);
    const firstChapterId = resolveQidianFirstChapterId(data);
    if (!bookId || !hasQidianChapterId(firstChapterId)) return null;
    return new URL(`/chapter/${bookId}/${String(firstChapterId)}/`, parsedUrl.origin).toString();
  }
  const qidianBeforeParse = (doc2, url) => {
    var _a, _b;
    try {
      const reviews = doc2.querySelectorAll("h1 .review, h2 .review");
      reviews.forEach((el) => el.remove());
    } catch (e) {
      console.debug("[MNR] Failed to remove review elements:", e);
    }
    try {
      const data = readQidianPageContext(doc2);
      const pageData = (_b = (_a = data == null ? void 0 : data.pageContext) == null ? void 0 : _a.pageProps) == null ? void 0 : _b.pageData;
      if (!pageData) return;
      const bookId = resolveQidianBookId(data, url);
      const currentChapterId = extractChapterIdFromQidianUrl(url);
      const firstChapterId = resolveQidianFirstChapterId(data);
      const chapterInfo = pageData.chapterInfo;
      const prevChapterId = chapterInfo == null ? void 0 : chapterInfo.prev;
      let nextChapterId = chapterInfo == null ? void 0 : chapterInfo.next;
      if (!hasQidianChapterId(nextChapterId) && currentChapterId && hasQidianChapterId(firstChapterId) && String(firstChapterId) === currentChapterId) {
        nextChapterId = resolveQidianNextPreviewChapterId(data);
      }
      const host = url ? new URL(url).hostname : location.hostname;
      const navContainer = doc2.createElement("div");
      navContainer.id = "mnr-qidian-nav";
      navContainer.style.display = "none";
      if (bookId && hasQidianChapterId(prevChapterId)) {
        const prev = doc2.createElement("a");
        prev.id = "mnr-qidian-prev";
        prev.href = `//${host}/chapter/${bookId}/${prevChapterId}/`;
        prev.textContent = "上一章";
        navContainer.appendChild(prev);
      }
      if (bookId && hasQidianChapterId(nextChapterId)) {
        const next = doc2.createElement("a");
        next.id = "mnr-qidian-next";
        next.href = `//${host}/chapter/${bookId}/${nextChapterId}/`;
        next.textContent = "下一章";
        navContainer.appendChild(next);
      }
      if (bookId) {
        const index = doc2.createElement("a");
        index.id = "mnr-qidian-index";
        index.href = `//${host}/book/${bookId}/`;
        index.textContent = "目录";
        navContainer.appendChild(index);
      }
      doc2.body.appendChild(navContainer);
    } catch (e) {
      console.warn("[MyNovelReader] Qidian beforeParse error:", e);
    }
  };
  const qidianContent = {
    selector: 'main[id^="c-"]',
    remove: '.review, #r-titlePage, .tooltip-wrapper, .chapter-end-qrcode, section[id^="r-"]'
  };
  const qidianNavigation = {

prev: '#mnr-qidian-prev, .nav-btn-group a:contains("上一章"), a.nav-btn:contains("上一章")',
    index: "#mnr-qidian-index",
    next: '#mnr-qidian-next, .nav-btn-group a:contains("下一章"), a.nav-btn:contains("下一章")'
  };
  const qidianTitle = {
    selector: "h1.title, h2.title, h1.text-1\\.3em, h2.text-1\\.3em, #r-nav-chapter-title"
  };
  const qidianHooks = {
    beforeParse: qidianBeforeParse
  };
  const qidianMobileRule = {
    id: "qidian-mobile",
    name: "起点中文网手机版",
    version: 1,
    match: {
      pattern: "^https?://m\\.qidian\\.com/chapter/.*"
    },
    content: {
      ...qidianContent
    },
    navigation: {
      ...qidianNavigation
    },
    title: {
      ...qidianTitle
    },
    hooks: {
      ...qidianHooks
    },
    advanced: {
      mutationSelector: 'main[id^="c-"]',
      mutationChildCount: 0
    },
    meta: { source: "builtin" }
  };
  const qidianRule = {
    id: "qidian",
    name: "起点中文网",
    version: 9,
    match: {
      pattern: "^https?://www\\.qidian\\.com/chapter/.*"
    },
    content: {
      ...qidianContent
    },
    navigation: {
      ...qidianNavigation
    },
    title: {
      ...qidianTitle
    },
    hooks: {
      ...qidianHooks
    },
    advanced: {
      useIframe: true,
      mutationSelector: 'main[id^="c-"]',
      mutationChildCount: 0
    },
    meta: { source: "builtin" }
  };
  const __vite_glob_0_5 = Object.freeze( Object.defineProperty({
    __proto__: null,
    qidianMobileRule,
    qidianRule,
    resolveQidianMobileBookPreviewChapterUrl
  }, Symbol.toStringTag, { value: "Module" }));
  const shu69BeforeParse = (doc2, url) => {
    var _a;
    try {
      const fallbackUrl = typeof location !== "undefined" && typeof location.href === "string" ? location.href : "";
      const pageUrl = url || ((_a = doc2.location) == null ? void 0 : _a.href) || fallbackUrl;
      const script = Array.from(doc2.querySelectorAll("script")).find(
        (item) => (item.textContent || "").includes("bookinfo")
      );
      const text2 = (script == null ? void 0 : script.textContent) || "";
      if (!text2) return;
      const extractString = (key) => {
        var _a2;
        const match = text2.match(new RegExp(`${key}\\s*:\\s*(["'])([^"'\\r\\n]{1,300})\\1`, "i"));
        return ((_a2 = match == null ? void 0 : match[2]) == null ? void 0 : _a2.trim()) || "";
      };
      const normalizeUrl2 = (value) => {
        if (!value) return "";
        try {
          return new URL(value, pageUrl).href;
        } catch {
          return value;
        }
      };
      const ensureAnchor = (id, href, label) => {
        if (!href || doc2.querySelector(`#${id}`)) return;
        const parent = doc2.body || doc2.documentElement;
        if (!parent) return;
        const anchor = doc2.createElement("a");
        anchor.id = id;
        anchor.href = normalizeUrl2(href);
        anchor.textContent = label;
        anchor.style.display = "none";
        parent.appendChild(anchor);
      };
      const bookTitle = extractString("articlename");
      const chapterTitle = extractString("chaptername");
      const indexUrl = extractString("index_page");
      const prevUrl = extractString("preview_page");
      const nextUrl = extractString("next_page");
      ensureAnchor("mnr-69shu-book", indexUrl || prevUrl, bookTitle);
      ensureAnchor("mnr-69shu-index", indexUrl, "目录");
      ensureAnchor("mnr-69shu-prev", prevUrl, "上一章");
      ensureAnchor("mnr-69shu-next", nextUrl, "下一章");
      if (chapterTitle && !doc2.querySelector("#mnr-69shu-title")) {
        const parent = doc2.body || doc2.documentElement;
        if (!parent) return;
        const title = doc2.createElement("h1");
        title.id = "mnr-69shu-title";
        title.textContent = chapterTitle;
        title.style.display = "none";
        parent.appendChild(title);
      }
    } catch (e) {
      console.warn("[MyNovelReader] 69shu beforeParse error:", e);
    }
  };
  const shu69Rule = {
    id: "69shu",
    name: "69书吧",
    version: 2,
    match: {
      pattern: "^https?://(?:www\\.)?69(?:shu|yuedu)[a-z0-9]*?\\.(?:pro|top|com|cx|net|co|me|biz)/(?:txt|c|r)/\\d+/\\d+/?(?:[?#].*)?$"
    },
    content: {
      selector: "#txtcontent, .txtnav",
      remove: "script, style, iframe, ins, .txtinfo.hide720, #txtright, .bottom-ad, .bottom-ad2, .page1, .readinline, .ad_content",
      replace: [
        {
          pattern: ".*[6六].*[9九].*书.*吧.*",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "请收藏本站.*?最新网址.*?(?:<br\\s*/?>)?",
          replacement: "",
          flags: "g"
        }
      ]
    },
    navigation: {
      prev: '#mnr-69shu-prev, .page1 a:contains("上一章"), .page1 a:nth-child(1)',
      index: '#mnr-69shu-index, .page1 a:contains("目录"), .page1 a:contains("書目"), .page1 a:nth-child(3)',
      next: '#mnr-69shu-next, .page1 a:contains("下一章"), .page1 a:nth-child(4)'
    },
    title: {
      selector: "#mnr-69shu-title, h1",
      bookSelector: '#mnr-69shu-book, .mytitle .bread a[href*="/book/"][href$=".htm"], .txtinfo a:first-child, .con_top a:nth-child(3)'
    },
    hooks: {
      beforeParse: shu69BeforeParse
    },
    advanced: {
      noSection: true,
      useIframe: true
    },
    meta: { source: "builtin", exampleUrl: "https://www.69shuba.com/txt/58672/38147713" }
  };
  const __vite_glob_0_6 = Object.freeze( Object.defineProperty({
    __proto__: null,
    shu69Rule
  }, Symbol.toStringTag, { value: "Module" }));
  const suduguRule = {
    id: "sudugu",
    name: "速读谷",
    version: 1,
    match: {
      pattern: "^https?://www\\.sudugu\\.org/\\d+/\\d+(?:-\\d+)?\\.html(?:[?#].*)?$"
    },
    content: {
      selector: ".con",
      remove: "script, style, iframe, ins"
    },
    navigation: {
      prev: ".prenext span:first-child a",
      index: '.prenext > a[href*="#dir"]',
      next: ".prenext span:last-child a"
    },
    title: {
      selector: ".submenu h1",
      replace: "^.*?>\\s*",
      bookSelector: '.submenu h1 > a[href^="/"][href$="/"]'
    },
    toc: {
      excludeAncestors: ".new, .item, h1, h2"
    },
    advanced: {
      checkSection: true,
      sectionDelayMs: 800
    },
    meta: {
      source: "builtin",
      exampleUrl: "https://www.sudugu.org/109/1226047.html"
    }
  };
  const __vite_glob_0_7 = Object.freeze( Object.defineProperty({
    __proto__: null,
    suduguRule
  }, Symbol.toStringTag, { value: "Module" }));
  const twkanRule = {
    id: "twkan",
    name: "台灣小說網",
    version: 1,
    match: {
      pattern: "^https?://twkan\\.com/txt/\\d+/\\d+/?(?:[?#].*)?$"
    },
    content: {
      selector: "#txtcontent0, .txtnav",
      remove: "script, style, iframe, ins, .page1, .readinline, .read-link, .ad_content, .top-ad, .bottom-ad",
      replace: [
        {
          pattern: "^[\\s\\u00a0\\u3000\\u2000-\\u200a]*第[一二三四五六七八九十百千\\d]+(?:章|节|節|回|话|話|篇|集|卷)[^<]{0,120}(?:<br\\s*/?>\\s*)+",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "（?請記住臺灣小説網[^<\\n]*?）?",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "（?请记住[臺台]湾小[説说]网[^<\\n]{0,160}(?:章节更新|網站|网站)[^<\\n]{0,40}）?",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "〖[^〗]*分享[^〗]*運營[^〗]*〗",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "【[^】]{0,100}(?:域名|[臺台]湾小[説说]网|[臺台]湾好书)[^】]{0,160}】",
          replacement: "",
          flags: "g"
        },
        {
          pattern: "本章完。?",
          replacement: "",
          flags: "g"
        }
      ]
    },
    navigation: {
      prev: 'a:contains("上一章")',
      index: 'a:contains("目錄"), a:contains("目录"), a:contains("書頁"), a:contains("书页")',
      next: 'a:contains("下一章")'
    },
    title: {
      selector: ".txtnav > h1, h1",
      pattern: "^(.+?)-(.+?)-[^-]+-.*?台灣小說網$",
      patternIndex: 1,
      bookPatternIndex: 2,
      bookSelector: 'a[href*="/book/"][href$="/index.html"]'
    },
    advanced: {
      useIframe: true
    },
    meta: {
      source: "builtin",
      exampleUrl: "https://twkan.com/txt/93181/53052605"
    }
  };
  const __vite_glob_0_8 = Object.freeze( Object.defineProperty({
    __proto__: null,
    twkanRule
  }, Symbol.toStringTag, { value: "Module" }));
  const uureadRule = {
    id: "uuread",
    name: "UU看书",
    version: 2,
    match: {
      pattern: "^https?://www\\.uuread\\.tw/chapter/\\d+/\\d+(?:_\\d+)?\\.html$"
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
      replace: "\\s*[（(]\\s*\\d+\\s*/\\s*\\d+\\s*[）)]\\s*$",
      bookSelector: ".bread > li:nth-child(4) > a:nth-child(1)"
    },
    advanced: {
      checkSection: true
    },
    meta: { source: "builtin", exampleUrl: "https://www.uuread.tw/chapter/1880014/2545609.html" }
  };
  const __vite_glob_0_9 = Object.freeze( Object.defineProperty({
    __proto__: null,
    uureadRule
  }, Symbol.toStringTag, { value: "Module" }));
  const modules$1 = Object.assign({ "./ciweimao.ts": __vite_glob_0_0$1, "./deqixs.ts": __vite_glob_0_1$1, "./dingdianzww.ts": __vite_glob_0_2$1, "./goboo.ts": __vite_glob_0_3, "./hetushu.ts": __vite_glob_0_4, "./qidian.ts": __vite_glob_0_5, "./shu69.ts": __vite_glob_0_6, "./sudugu.ts": __vite_glob_0_7, "./twkan.ts": __vite_glob_0_8, "./uuread.ts": __vite_glob_0_9 });
  function isSiteRule(value) {
    if (!value || typeof value !== "object") return false;
    const maybe = value;
    return typeof maybe.id === "string" && typeof maybe.version === "number" && !!maybe.match && typeof maybe.match.pattern === "string" && !!maybe.content && typeof maybe.content.selector === "string";
  }
  const siteRules = Object.keys(modules$1).sort().flatMap((path) => Object.values(modules$1[path]).filter(isSiteRule));
  const specialRules = [
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
{
      id: "wodeshucheng",
      name: "我的书城网",
      version: 1,
      match: {
        pattern: "^https?://www\\.wodeshucheng\\.net/.*?\\.html$"
      },
      content: {
        selector: "#content",
        remove: ".appguide-wrap, .section-opt, .btn-addbs, .reader-fun",
        replace: [
{ pattern: "&lt;/?p&gt;", replacement: "", flags: "gi" },
          { pattern: "&lt;br\\s*/?&gt;", replacement: "", flags: "gi" },
          { pattern: "&lt;script[^>]*&gt;.*?&lt;/script&gt;", replacement: "", flags: "gi" },
{ pattern: "\\\\[^\\s<]{2,}", replacement: "", flags: "g" },
{
            pattern: "[a-z0-9](?:[^\\u4e00-\\u9fff\\s]{1,3}[a-z0-9]){4,}",
            replacement: "",
            flags: "gi"
          },
{
            pattern: "小[^\\u4e00-\\u9fff]{0,3}说[^\\u4e00-\\u9fff]{0,3}网[^\\u4e00-\\u9fff]{0,6}最[^\\u4e00-\\u9fff]{0,3}新[^\\u4e00-\\u9fff]{0,3}章[^\\u4e00-\\u9fff]{0,3}节[^\\u4e00-\\u9fff]{0,6}更[^\\u4e00-\\u9fff]{0,3}新[^\\u4e00-\\u9fff]{0,3}快",
            replacement: "",
            flags: "gi"
          },
{ pattern: "武\\d?墈书\\s*庚薪嶵筷", replacement: "", flags: "g" },
{ pattern: "chapter_\\(\\);?", replacement: "", flags: "gi" },
          { pattern: "script\\/script", replacement: "", flags: "gi" },
{ pattern: "#\\?[^<\\n]{0,80}", replacement: "", flags: "g" }
        ]
      },
      navigation: {
        prev: "#prev_url",
        index: "#info_url",
        next: "#next_url"
      },
      title: {
        selector: "h1.title",
        bookSelector: ".layout-tit a[title]"
      },
      advanced: {
        checkSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://www.wodeshucheng.net/book_95122894/455913227.html"
      }
    },



{
      id: "ldks-2baoe",
      name: "零点看书（ldks）",
      version: 1,
      match: {
        pattern: "^https?://(?:23\\.225\\.121\\.247|www\\.2baoe\\.com)/ldks/\\d+/\\d+(?:[_-]\\d+)?\\.html$"
      },
      content: {
        selector: "#content",
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

{
      id: "uukanshu-cc",
      name: "UU看书（uukanshu.cc）",
      version: 1,
      match: {
        pattern: "^https?://(?:www\\.)?uukanshu\\.cc/book/\\d+/\\d+\\.html(?:\\?.*)?$"
      },
      content: {
selector: ".readcotent, #contentbox, #content, #chaptercontent, #chapter_content, .content"
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://uukanshu.cc/book/26185/17096360.html"
      }
    },
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
prev: '#pre_page, a:contains("上一章")',
        next: '#next_page, a:contains("下一章")',
        index: '#huimulu, a:contains("目录")'
      },
      toc: {
excludeAncestors: ".c_con_relation"
      },
      title: {
selector: ".c_l_title > h1, h1",
        bookSelector: "#novelName",
replace: "^\\s*\\S+\\s+"
      },
      meta: {
        source: "builtin",
        autoLaunch: true,
        exampleUrl: "https://b.faloo.com/412421_1.html"
      }
    },
{
      id: "kanunu8",
      name: "努努书坊",
      version: 1,
      match: {
        pattern: "^https?://www\\.kanunu8\\.com/.+/\\d+\\.html$"
      },
      content: {
selector: 'td[width="820"] > p, td[width="820"] p'
      },
      navigation: {
prev: 'table[width="700"] td:first-child a',
        index: 'table[width="700"] td:nth-child(2) a',
        next: 'table[width="700"] td:last-child a'
      },
      title: {
        selector: 'font[color="#dc143c"][size="4"]'
      },
      toc: {
excludeAncestors: '#header, .nav, .nav2, td[bgcolor="#A5BDC6"], td[bgcolor="#CEDFE5"]'
      },
      advanced: {

noSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://www.kanunu8.com/book3/7748/170164.html"
      }
    },






{
      id: "shuhaige-m",
      name: "书海阁小说网(手机版)",
      version: 1,
      match: {
pattern: "^https?://m\\.shuhaige\\.net/\\d+/\\d+(?:_\\d+)?\\.html$"
      },
      content: {
        selector: ".content",
replace: [
          {
pattern: "小主，这个章节后面还有哦.*?后面更精彩！",
            replacement: "",
            flags: "g"
          },
          {
pattern: "喜欢.*?请大家收藏：\\([^)]+\\).*?更新速度全网最快。",
            replacement: "",
            flags: "g"
          }
        ]
      },
      navigation: {
prev: '.pager a:contains("上一章"), .pager a:contains("上一页")',
        index: '.pager a[href$="/"]:contains("目"), .pager a:contains("目录")',
        next: '.pager a:contains("下一章"), .pager a:contains("下一页")'
      },
      title: {
        selector: "h1.headline"
      },
      advanced: {
checkSection: true
      },
      meta: {
        source: "builtin",
        exampleUrl: "https://m.shuhaige.net/36354/55863791.html"
      }
    }
  ];
  const builtInRules = [...siteRules, ...specialRules, ...simplifiedRules];
  const STORAGE_KEYS = {
    USER_RULES: "mnr_user_rules",
    RULE_PREFIX: "mnr_rule_",
    SITE_PREFERENCES: "mnr_site_prefs"
  };
  function sanitizeUserRuleHooks(rule) {
    const removedKeys = [];
    const rawHooks = rule.hooks;
    if (rawHooks === void 0) {
      return { sanitized: rule, removedKeys };
    }
    const sanitized = { ...rule };
    if (!rawHooks || typeof rawHooks !== "object" || Array.isArray(rawHooks)) {
      removedKeys.push("hooks");
      delete sanitized.hooks;
      return { sanitized, removedKeys };
    }
    const hooksObj = rawHooks;
    for (const key of Object.keys(hooksObj)) {
      if (key !== "beforeParse") {
        removedKeys.push(key);
      }
    }
    const beforeParse = hooksObj.beforeParse;
    const keepBeforeParse = typeof beforeParse === "string" && beforeParse.trim().length > 0;
    if (!keepBeforeParse && "beforeParse" in hooksObj) {
      removedKeys.push("beforeParse");
    }
    if (keepBeforeParse) {
      sanitized.hooks = { beforeParse };
    } else {
      delete sanitized.hooks;
    }
    return { sanitized, removedKeys };
  }
  function warnDroppedHookFields(ruleId, removedKeys) {
    console.warn("[RuleStorage] Dropped unsupported hooks fields:", ruleId, removedKeys);
  }
  class GMStorageDriver {
    constructor(prefix = STORAGE_KEYS.RULE_PREFIX) {
      this.prefix = prefix;
    }
    async get(key) {
      try {
        const data = GM_getValue(this.prefix + key, null);
        if (typeof data === "string") {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error(`[RuleStorage] Failed to parse rule ${key}:`, e);
            return null;
          }
        }
        return null;
      } catch (e) {
        console.debug("[RuleStorage] Failed to get rule:", key, e);
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
      const result = new Map();
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
          const result = new Map();
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
async getUserRule(domain) {
      const rule = await this.driver.get(domain);
      if (!rule) return null;
      const { sanitized, removedKeys } = sanitizeUserRuleHooks(rule);
      if (removedKeys.length > 0) {
        warnDroppedHookFields(domain, removedKeys);
        await this.driver.set(domain, sanitized);
      }
      return sanitized;
    }
async saveUserRule(domain, rule) {
      const ruleToSave = {
        ...rule,
        id: domain,
        meta: {
          ...rule.meta,
          source: "user",
          updated: Date.now()
        }
      };
      const { sanitized, removedKeys } = sanitizeUserRuleHooks(ruleToSave);
      if (removedKeys.length > 0) {
        warnDroppedHookFields(domain, removedKeys);
      }
      await this.driver.set(domain, sanitized);
    }
async deleteUserRule(domain) {
      await this.driver.delete(domain);
    }
async getAllUserRules() {
      const all = await this.driver.getAll();
      const sanitizedRules = new Map();
      for (const [domain, rule] of all) {
        const { sanitized, removedKeys } = sanitizeUserRuleHooks(rule);
        sanitizedRules.set(domain, sanitized);
        if (removedKeys.length > 0) {
          warnDroppedHookFields(domain, removedKeys);
          await this.driver.set(domain, sanitized);
        }
      }
      return sanitizedRules;
    }
async getAllDomains() {
      return this.driver.getAllKeys();
    }
async clearAllRules() {
      await this.driver.clear();
    }
async exportRules() {
      const rules = await this.getAllUserRules();
      const rulesArray = Array.from(rules.values());
      return JSON.stringify(rulesArray, null, 2);
    }
async importRules(json, overwrite = false) {
      let rules;
      try {
        rules = JSON.parse(json);
      } catch (e) {
        console.error("[MNR] Failed to parse imported rules JSON:", e);
        return 0;
      }
      if (!Array.isArray(rules)) {
        console.error("[MNR] Imported rules JSON must be an array.");
        return 0;
      }
      let count = 0;
      for (const rawRule of rules) {
        if (!rawRule || typeof rawRule !== "object") continue;
        const rule = rawRule;
        if (!rule.id) continue;
        if (!overwrite) {
          const existing = await this.driver.get(rule.id);
          if (existing) continue;
        }
        const meta = typeof rule.meta === "object" && rule.meta !== null ? rule.meta : {};
        const ruleToSave = {
          ...rule,
          meta: {
            ...meta,
            source: "user",
            updated: Date.now()
          }
        };
        const { sanitized, removedKeys } = sanitizeUserRuleHooks(ruleToSave);
        if (removedKeys.length > 0) {
          warnDroppedHookFields(ruleToSave.id, removedKeys);
        }
        await this.driver.set(ruleToSave.id, sanitized);
        count++;
      }
      return count;
    }

getSitePreference(domain) {
      try {
        const stored = GM_getValue(STORAGE_KEYS.SITE_PREFERENCES, {});
        const prefs = typeof stored === "object" && stored !== null ? stored : {};
        return prefs[domain] || null;
      } catch (e) {
        console.debug("[RuleStorage] Failed to get site preference:", domain, e);
        return null;
      }
    }
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
      this.userRulesCache = new Map();
      this.initialized = false;
      this.compiledCache = new WeakMap();
      this.storage = new RuleStorage();
    }
async initialize() {
      if (this.initialized) return;
      this.userRulesCache = await this.storage.getAllUserRules();
      this.builtInRules = await this.loadBuiltInRules();
      this.initialized = true;
    }
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
getCompiledRule(rule) {
      const cached = this.compiledCache.get(rule);
      if (cached) return cached;
      const main = toRegExp(rule.match.pattern, rule.match.type);
      const excludes = (rule.match.exclude ?? []).map((e) => new RegExp(e, "i"));
      const compiled = { main, excludes };
      this.compiledCache.set(rule, compiled);
      return compiled;
    }
matchesUrl(rule, url) {
      try {
        const { main, excludes } = this.getCompiledRule(rule);
        if (!main.test(url)) return false;
        for (const exclude of excludes) {
          if (exclude.test(url)) {
            return false;
          }
        }
        return true;
      } catch (e) {
        console.debug("[RuleManager] Rule match error for pattern:", rule.match.pattern, e);
        return false;
      }
    }
async saveUserRule(domain, rule) {
      await this.storage.saveUserRule(domain, rule);
      const saved = await this.storage.getUserRule(domain);
      if (saved) {
        this.userRulesCache.set(domain, saved);
      } else {
        this.userRulesCache.set(domain, rule);
      }
    }
async deleteUserRule(domain) {
      await this.storage.deleteUserRule(domain);
      this.userRulesCache.delete(domain);
    }
getUserRule(domain) {
      return this.userRulesCache.get(domain);
    }
getAllUserRules() {
      return this.userRulesCache;
    }
getBuiltInRules() {
      return this.builtInRules;
    }
getStorage() {
      return this.storage;
    }
async loadBuiltInRules() {
      return builtInRules;
    }
extractDomain(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    }
async exportUserRules() {
      return this.storage.exportRules();
    }
async importUserRules(json, overwrite = false) {
      const count = await this.storage.importRules(json, overwrite);
      this.userRulesCache = await this.storage.getAllUserRules();
      return count;
    }
async clearUserRules() {
      await this.storage.clearAllRules();
      this.userRulesCache.clear();
    }
getStats() {
      return {
        user: this.userRulesCache.size,
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
  function getGmXhr() {
    if (typeof GM_xmlhttpRequest === "function") {
      return GM_xmlhttpRequest;
    }
    return null;
  }
  function normalizeUrlForFetch$1(url) {
    const normalized = normalizeRedundantFirstPageParam(normalizeCiwemaoChapterUrl(url));
    try {
      const u = new URL(normalized);
      u.hash = "";
      return u.toString();
    } catch {
      return normalized.replace(/#.*$/, "");
    }
  }
  function getDefaultBaseUrl() {
    if (typeof location !== "undefined" && typeof location.href === "string") {
      return location.href;
    }
    if (typeof document !== "undefined" && typeof document.baseURI === "string") {
      return document.baseURI;
    }
    return void 0;
  }
  function normalizeHostname(hostname) {
    const trimmed = hostname.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      return trimmed.slice(1, -1).toLowerCase();
    }
    return trimmed.toLowerCase();
  }
  function isPrivateNetworkHost(hostname) {
    const host = normalizeHostname(hostname);
    if (!host) return true;
    if (host === "localhost") return true;
    if (host === "0.0.0.0") return true;
    const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4) {
      const parts = ipv4.slice(1).map((n) => parseInt(n, 10));
      if (parts.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return true;
      const [a, b] = parts;
      if (a === 10) return true;
      if (a === 127) return true;
      if (a === 169 && b === 254) return true;
      if (a === 172 && b >= 16 && b <= 31) return true;
      if (a === 192 && b === 168) return true;
      return false;
    }
    if (host === "::1") return true;
    if (host.startsWith("fe80:")) return true;
    if (host.startsWith("fc") || host.startsWith("fd")) return true;
    return false;
  }
  function parseHttpUrl$1(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      return u;
    } catch {
      return null;
    }
  }
  function isCurrentOriginRequest(url) {
    try {
      if (typeof location === "undefined" || !location.origin) return false;
      return new URL(url).origin === location.origin;
    } catch {
      return false;
    }
  }
  function hasPageNativeFetch() {
    return typeof window !== "undefined" && typeof window.fetch === "function" && typeof fetch === "function" && window.fetch === fetch;
  }
  function normalizeCharset(charset) {
    const normalized = (charset || "").trim().replace(/^["']|["']$/g, "").toLowerCase();
    if (!normalized) return null;
    if (normalized === "utf8") return "utf-8";
    if (normalized === "gbk" || normalized === "gb2312" || normalized === "gb18030") {
      return "gb18030";
    }
    return normalized;
  }
  function extractCharsetFromMime(value) {
    if (!value) return null;
    const match = value.match(/charset\s*=\s*["']?([^;"'\s>]+)/i);
    return normalizeCharset(match == null ? void 0 : match[1]);
  }
  function extractCharsetFromHtmlBytes(buffer) {
    const bytes = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 4096));
    let ascii = "";
    for (const byte of bytes) {
      ascii += byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : " ";
    }
    const charsetMeta = ascii.match(/<meta[^>]+charset\s*=\s*["']?([^"' />]+)/i);
    if (charsetMeta == null ? void 0 : charsetMeta[1]) return normalizeCharset(charsetMeta[1]);
    const contentTypeMeta = ascii.match(
      /<meta[^>]+http-equiv\s*=\s*["']?content-type["']?[^>]+content\s*=\s*["']([^"']+)["']/i
    );
    return extractCharsetFromMime(contentTypeMeta == null ? void 0 : contentTypeMeta[1]);
  }
  function getCurrentDocumentCharset() {
    if (typeof document === "undefined") return null;
    return normalizeCharset(document.characterSet || document.charset);
  }
  function decodeHtmlBytes(buffer, contentType, fallbackCharset) {
    const charset = extractCharsetFromMime(contentType) || extractCharsetFromHtmlBytes(buffer) || normalizeCharset(fallbackCharset) || getCurrentDocumentCharset() || "utf-8";
    try {
      return new TextDecoder(charset).decode(buffer);
    } catch {
      return new TextDecoder("utf-8").decode(buffer);
    }
  }
  async function readFetchResponseText(response) {
    var _a;
    if (typeof response.arrayBuffer !== "function" || typeof TextDecoder === "undefined") {
      return response.text();
    }
    const contentType = typeof ((_a = response.headers) == null ? void 0 : _a.get) === "function" ? response.headers.get("content-type") : null;
    const buffer = await response.arrayBuffer();
    return decodeHtmlBytes(buffer, contentType);
  }
  function resolveAndValidateHttpUrl(url, base) {
    const normalized = normalizeUrlForFetch$1(url);
    let resolved = null;
    try {
      resolved = base ? new URL(normalized, base).toString() : new URL(normalized).toString();
    } catch {
      try {
        const fallbackBase = getDefaultBaseUrl();
        if (!fallbackBase) return null;
        resolved = new URL(normalized, fallbackBase).toString();
      } catch {
        return null;
      }
    }
    try {
      const u = new URL(resolved);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      if (isPrivateNetworkHost(u.hostname)) {
        const baseUrl = parseHttpUrl$1(base || "") || parseHttpUrl$1(getDefaultBaseUrl() || "");
        if (!baseUrl || normalizeHostname(baseUrl.hostname) !== normalizeHostname(u.hostname)) {
          return null;
        }
      }
      u.hash = "";
      return u.toString();
    } catch {
      return null;
    }
  }
  function fetchAndParseUrl(url, referer, options = {}) {
    const gmXhr = getGmXhr();
    const requestUrl = resolveAndValidateHttpUrl(url, referer);
    const timeoutMs = options.timeoutMs ?? 15e3;
    const maxRetries = Math.max(0, options.retries ?? 1);
    if (!requestUrl) {
      console.error("[MNR] Invalid or unsupported URL:", url);
      return {
        promise: Promise.resolve({
          doc: null,
          status: null,
          finalUrl: null,
          error: "invalid-url"
        }),
        abort: () => {
        }
      };
    }
    const parseHtmlToDoc = (html2, finalUrl) => {
      var _a;
      try {
        const parser = new DOMParser();
        const doc2 = parser.parseFromString(html2, "text/html");
        const base = doc2.createElement("base");
        base.href = finalUrl || requestUrl;
        if (doc2.head) {
          doc2.head.insertBefore(base, doc2.head.firstChild);
        } else {
          (_a = doc2.documentElement) == null ? void 0 : _a.insertBefore(base, doc2.documentElement.firstChild);
        }
        doc2._mnrUrl = finalUrl || requestUrl;
        return {
          doc: doc2,
          status: 200,
          finalUrl,
          error: null
        };
      } catch (e) {
        console.error("[MNR] Parse error:", e);
        return {
          doc: null,
          status: null,
          finalUrl,
          error: "parse"
        };
      }
    };
    let request = null;
    let aborted = false;
    let fetchAbortController = null;
    let timeoutTimer = null;
    let timedOut = false;
    const doRequest = () => {
      const headers = {
        Accept: "text/html,application/xhtml+xml,application/xml"
      };
      const normalizedReferer = referer ? resolveAndValidateHttpUrl(referer) : void 0;
      const preferNativeFetch = hasPageNativeFetch() && isCurrentOriginRequest(requestUrl);
      if (gmXhr && !preferNativeFetch) {
        headers["Accept-Language"] = "zh-CN,zh;q=0.9";
        if (normalizedReferer) {
          headers["Referer"] = normalizedReferer;
        }
        return new Promise((resolve) => {
          request = gmXhr({
            method: "GET",
            url: requestUrl,
            headers,
            timeout: timeoutMs,
            overrideMimeType: "text/html;charset=" + document.characterSet,
            onload: (response) => {
              const finalUrl = response.finalUrl ? resolveAndValidateHttpUrl(response.finalUrl, requestUrl) : null;
              if (response.status >= 200 && response.status < 300) {
                const parsed = parseHtmlToDoc(response.responseText, finalUrl);
                resolve({
                  ...parsed,
                  status: response.status,
                  finalUrl
                });
                return;
              }
              console.error("[MNR] HTTP error:", response.status);
              resolve({
                doc: null,
                status: response.status,
                finalUrl,
                error: "http"
              });
            },
            onerror: () => {
              resolve({ doc: null, status: null, finalUrl: null, error: "network" });
            },
            onabort: () => {
              resolve({ doc: null, status: null, finalUrl: null, error: "abort" });
            },
            ontimeout: () => {
              console.error("[MNR] Request timeout");
              resolve({ doc: null, status: null, finalUrl: null, error: "timeout" });
            }
          });
        });
      }
      if (typeof fetch !== "function") {
        console.error("[MNR] GM_xmlhttpRequest not available and fetch is missing");
        return Promise.resolve({
          doc: null,
          status: null,
          finalUrl: null,
          error: "missing-gm-xhr"
        });
      }
      fetchAbortController = new AbortController();
      timedOut = false;
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
        timeoutTimer = null;
      }
      timeoutTimer = setTimeout(() => {
        timedOut = true;
        fetchAbortController == null ? void 0 : fetchAbortController.abort();
      }, timeoutMs);
      const fetchInit = {
        method: "GET",
        headers,
        signal: fetchAbortController.signal,
        credentials: "include",
        redirect: "follow"
      };
      if (normalizedReferer) {
        try {
          fetchInit.referrer = normalizedReferer;
        } catch {
        }
      }
      return fetch(requestUrl, fetchInit).then(async (response) => {
        const finalUrl = response.url ? resolveAndValidateHttpUrl(response.url, requestUrl) : null;
        const status = response.status;
        if (status >= 200 && status < 300) {
          const html2 = await readFetchResponseText(response);
          const parsed = parseHtmlToDoc(html2, finalUrl);
          const result2 = { ...parsed, status, finalUrl };
          return result2;
        }
        console.error("[MNR] HTTP error:", status);
        const result = {
          doc: null,
          status,
          finalUrl,
          error: "http"
        };
        return result;
      }).catch((err) => {
        if (aborted) {
          const result2 = {
            doc: null,
            status: null,
            finalUrl: null,
            error: "abort"
          };
          return result2;
        }
        if (timedOut) {
          console.error("[MNR] Request timeout");
          const result2 = {
            doc: null,
            status: null,
            finalUrl: null,
            error: "timeout"
          };
          return result2;
        }
        console.error("[MNR] Network error:", err);
        const result = {
          doc: null,
          status: null,
          finalUrl: null,
          error: "network"
        };
        return result;
      }).finally(() => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
        }
      });
    };
    const shouldRetry = (res) => {
      if (aborted) return false;
      if (res.error === "timeout" || res.error === "network") return true;
      if (res.error === "http" && res.status && (res.status >= 500 || res.status === 429)) {
        return true;
      }
      return false;
    };
    const promise = (async () => {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (aborted) return { doc: null, status: null, finalUrl: null, error: "abort" };
        const res = await doRequest();
        if (!shouldRetry(res) || attempt === maxRetries) {
          return res;
        }
        const delay = Math.min(400 * Math.pow(2, attempt), 2e3);
        await new Promise((resolve) => globalThis.setTimeout(resolve, delay));
      }
      return { doc: null, status: null, finalUrl: null, error: "network" };
    })();
    const abort = () => {
      aborted = true;
      try {
        request == null ? void 0 : request.abort();
      } catch {
      }
      try {
        fetchAbortController == null ? void 0 : fetchAbortController.abort();
      } catch {
      }
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
        timeoutTimer = null;
      }
    };
    return { promise, abort };
  }
  const MIN_DYNAMIC_TEXT_LENGTH = 80;
  const GLOBAL_DYNAMIC_WAIT_MS = 600;
  const RULE_DYNAMIC_WAIT_MS = 1500;
  const DYNAMIC_SCROLL_STABLE_MS = 200;
  const DYNAMIC_SCROLL_DELAY_MS = 120;
  const DYNAMIC_SCROLL_MAX_STEPS = 10;
  class Parser {
    constructor(options = {}) {
      this.detectionEngine = new DetectionEngine();
      this.contentProcessor = new ContentProcessor(options.processing);
      this.options = options;
    }
async parse(doc2 = document, explicitUrl) {
      var _a;
      const url = explicitUrl || ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const ruleManager = getRuleManager();
      await ruleManager.initialize();
      const ruleMatch = await ruleManager.matchRule(url);
      if (ruleMatch && !this.options.forceDetection) {
        return await this.parseWithRule(doc2, url, ruleMatch);
      }
      return await this.parseWithDetection(doc2, url);
    }
async parseWithRule(doc2, url, ruleMatch) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const rule = ruleMatch.rule;
      await this.runBeforeParseHook(rule, doc2, url);
      let contentElement = this.selectElement(doc2, rule.content.selector);
      if (this.shouldWaitForRuleContent(rule, contentElement)) {
        await this.waitForRuleContent(doc2, rule);
        contentElement = this.selectElement(doc2, rule.content.selector);
      }
      if (!contentElement) {
        return await this.parseWithDetection(doc2, url, rule);
      }
      let navigation = this.extractNavigation(doc2, rule);
      const hasRulePrev = ((_a = rule.navigation) == null ? void 0 : _a.prev) !== void 0;
      const hasRuleNext = ((_b = rule.navigation) == null ? void 0 : _b.next) !== void 0;
      const hasRuleIndex = ((_c = rule.navigation) == null ? void 0 : _c.index) !== void 0;
      if (!navigation.next || !navigation.prev || !navigation.index) {
        const detectedNav = this.detectionEngine.detect(doc2, url).results.navigation;
        if (!hasRuleNext && !navigation.next && ((_d = detectedNav.next) == null ? void 0 : _d.url)) {
          navigation.next = detectedNav.next.url;
        }
        if (!hasRulePrev && !navigation.prev && ((_e = detectedNav.prev) == null ? void 0 : _e.url)) {
          navigation.prev = detectedNav.prev.url;
        }
        if (!hasRuleIndex && !navigation.index && ((_f = detectedNav.index) == null ? void 0 : _f.url)) {
          navigation.index = detectedNav.index.url;
        }
      }
      const title = this.extractTitle(doc2, rule);
      const processingOptions = {
        removeSelectors: rule.content.remove,
        replaceRules: rule.content.replace,
        removeAds: ((_g = rule.processing) == null ? void 0 : _g.removeAds) !== false,
        normalizeWhitespace: ((_h = rule.processing) == null ? void 0 : _h.normalizeWhitespace) !== false,
        fixImages: ((_i = rule.processing) == null ? void 0 : _i.fixImages) !== false,
        useRawContent: (_j = rule.processing) == null ? void 0 : _j.useRawContent,
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
async parseWithDetection(doc2, url, fallbackRule) {
      var _a, _b, _c;
      let detection = this.detectionEngine.detect(doc2, url);
      if (this.shouldWaitForDetectionContent(detection.results.content.element)) {
        const selector = detection.results.content.selector || (fallbackRule == null ? void 0 : fallbackRule.content.selector);
        await this.waitForDynamicContent(doc2, {
          selector,
          timeoutMs: GLOBAL_DYNAMIC_WAIT_MS,
          minTextLength: MIN_DYNAMIC_TEXT_LENGTH
        });
        detection = this.detectionEngine.detect(doc2, url);
      }
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
quickCheck(doc2 = document) {
      return this.detectionEngine.quickCheck(doc2);
    }
detect(doc2 = document, url) {
      var _a;
      return this.detectionEngine.detect(doc2, url || ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href);
    }
extractNavigation(doc2, rule) {
      var _a, _b, _c;
      const result = {};
      const asAnchor = (el) => {
        var _a2;
        if (!el) return null;
        if (((_a2 = el.tagName) == null ? void 0 : _a2.toLowerCase()) === "a") return el;
        return null;
      };
      const prevSelector = (_a = rule.navigation) == null ? void 0 : _a.prev;
      if (typeof prevSelector === "string" && prevSelector.trim()) {
        const el = this.selectElement(doc2, prevSelector);
        const anchor = asAnchor(el);
        if (anchor) result.prev = anchor.href;
      }
      const nextSelector = (_b = rule.navigation) == null ? void 0 : _b.next;
      if (typeof nextSelector === "string" && nextSelector.trim()) {
        const el = this.selectElement(doc2, nextSelector);
        const anchor = asAnchor(el);
        if (anchor) result.next = anchor.href;
      }
      const indexSelector = (_c = rule.navigation) == null ? void 0 : _c.index;
      if (typeof indexSelector === "string" && indexSelector.trim()) {
        const el = this.selectElement(doc2, indexSelector);
        const anchor = asAnchor(el);
        if (anchor) result.index = anchor.href;
      }
      return result;
    }
extractTitle(doc2, rule) {
      var _a, _b, _c, _d, _e, _f;
      let chapter = "";
      let book;
      let detection = null;
      const getDetection = () => {
        var _a2;
        if (!detection) {
          const currentUrl = ((_a2 = doc2.location) == null ? void 0 : _a2.href) || doc2._mnrUrl || window.location.href;
          detection = this.detectionEngine.detect(doc2, currentUrl);
        }
        return detection;
      };
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
        const detected = getDetection();
        chapter = detected.results.title.chapterTitle;
        book = book || detected.results.title.bookTitle;
      }
      if (!book && ((_d = rule.title) == null ? void 0 : _d.bookSelector)) {
        const el = this.selectElement(doc2, rule.title.bookSelector);
        if (el) {
          book = (_e = el.textContent) == null ? void 0 : _e.trim();
        }
      }
      if (!book) {
        const detected = getDetection();
        book = detected.results.title.bookTitle;
      }
      if (((_f = rule.title) == null ? void 0 : _f.replace) && chapter) {
        try {
          chapter = chapter.replace(new RegExp(rule.title.replace), "").trim();
        } catch (e) {
          console.debug("[Parser] Invalid title replace regex:", rule.title.replace, e);
        }
      }
      return { chapter, book };
    }
selectElement(doc2, selector) {
      const selectors = selector.split(",").map((s) => s.trim()).filter(Boolean);
      for (const sel of selectors) {
        const el = this.smartSelect(doc2, sel);
        if (el) return el;
      }
      return null;
    }
    shouldWaitForRuleContent(rule, element) {
      const advanced = rule.advanced;
      if ((advanced == null ? void 0 : advanced.mutationSelector) || (advanced == null ? void 0 : advanced.lazyLoadScroll)) {
        return true;
      }
      return this.isContentInsufficient(element);
    }
    shouldWaitForDetectionContent(element) {
      return this.isContentInsufficient(element);
    }
    isContentInsufficient(element) {
      if (!element) return true;
      if (element instanceof Element && element.hasAttribute("data-mnr-loading")) return true;
      const text2 = (element.textContent || "").replace(/\s+/g, "").trim();
      if (!text2) return true;
      if (text2.length < MIN_DYNAMIC_TEXT_LENGTH) return true;
      if (this.isPlaceholderText(text2)) return true;
      return false;
    }
    isPlaceholderText(text2) {
      return /加载中|正在加载|内容加载|请稍候|请等待|点击加载|下滑|滚动加载/i.test(text2);
    }
    async waitForRuleContent(doc2, rule) {
      const advanced = rule.advanced;
      const selector = (advanced == null ? void 0 : advanced.mutationSelector) || rule.content.selector;
      const timeoutMs = (advanced == null ? void 0 : advanced.timeout) ?? RULE_DYNAMIC_WAIT_MS;
      const minChildCount = advanced == null ? void 0 : advanced.mutationChildCount;
      const shouldScroll = !!(advanced == null ? void 0 : advanced.lazyLoadScroll);
      await this.waitForDynamicContent(doc2, {
        selector,
        minChildCount,
        timeoutMs,
        minTextLength: MIN_DYNAMIC_TEXT_LENGTH,
        scroll: shouldScroll
      });
    }
    async waitForDynamicContent(doc2, options) {
      var _a;
      const selector = (_a = options.selector) == null ? void 0 : _a.trim();
      const minTextLength = options.minTextLength ?? MIN_DYNAMIC_TEXT_LENGTH;
      const timeoutMs = options.timeoutMs ?? GLOBAL_DYNAMIC_WAIT_MS;
      const minChildCount = typeof options.minChildCount === "number" && options.minChildCount > 0 ? options.minChildCount : void 0;
      const target = doc2.body || doc2.documentElement;
      if (!target) return false;
      const getLength = () => {
        var _a2;
        if (!selector) {
          return (((_a2 = doc2.body) == null ? void 0 : _a2.textContent) || "").replace(/\s+/g, "").length;
        }
        const el = this.selectElement(doc2, selector);
        if (!el) return 0;
        return (el.textContent || "").replace(/\s+/g, "").length;
      };
      const isReady = () => {
        var _a2;
        if (selector) {
          const el = this.selectElement(doc2, selector);
          if (!el) return false;
          const length2 = (el.textContent || "").replace(/\s+/g, "").length;
          if (length2 >= minTextLength && !this.isPlaceholderText(el.textContent || "")) {
            return true;
          }
          if (minChildCount && el.children.length >= minChildCount) {
            return true;
          }
          return false;
        }
        const length = (((_a2 = doc2.body) == null ? void 0 : _a2.textContent) || "").replace(/\s+/g, "").length;
        return length >= minTextLength;
      };
      if (isReady()) return true;
      let resolvePromise = () => {
      };
      let observer = null;
      let timeoutId;
      let resolved = false;
      const done = (value) => {
        if (resolved) return;
        resolved = true;
        if (observer) observer.disconnect();
        if (timeoutId) window.clearTimeout(timeoutId);
        resolvePromise(value);
      };
      const waitPromise = new Promise((resolve) => {
        resolvePromise = resolve;
        observer = new MutationObserver(() => {
          if (isReady()) {
            done(true);
          }
        });
        observer.observe(target, { childList: true, subtree: true, characterData: true });
        timeoutId = window.setTimeout(() => done(isReady()), timeoutMs);
      });
      let scrollPromise = null;
      if (options.scroll) {
        scrollPromise = this.triggerLazyLoadScroll(getLength, timeoutMs);
      }
      const ready = await waitPromise;
      if (scrollPromise) {
        await scrollPromise;
      }
      return ready || isReady();
    }
    async triggerLazyLoadScroll(getLength, timeoutMs) {
      if (typeof window === "undefined" || typeof window.scrollBy !== "function") {
        return;
      }
      const startY = window.scrollY;
      if (startY > 5) {
        return;
      }
      const step = Math.max(window.innerHeight * 0.8, 400);
      const maxSteps = Math.min(
        DYNAMIC_SCROLL_MAX_STEPS,
        Math.max(3, Math.floor(timeoutMs / (DYNAMIC_SCROLL_DELAY_MS + 10)))
      );
      let lastLength = getLength();
      let stableFor = 0;
      for (let i = 0; i < maxSteps && stableFor < DYNAMIC_SCROLL_STABLE_MS; i++) {
        window.scrollBy({ top: step, behavior: "auto" });
        await this.sleep(DYNAMIC_SCROLL_DELAY_MS);
        const length = getLength();
        if (length > lastLength) {
          lastLength = length;
          stableFor = 0;
        } else {
          stableFor += DYNAMIC_SCROLL_DELAY_MS;
        }
      }
      if (window.scrollY !== startY) {
        window.scrollTo({ top: startY, behavior: "auto" });
      }
    }
    sleep(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }
resolveHookFetchUrl(url) {
      return resolveAndValidateHttpUrl(url, window.location.href);
    }
smartSelect(doc2, selector) {
      try {
        const native = doc2.querySelector(selector);
        if (native) return native;
      } catch (e) {
        console.debug("[Parser] Native selector failed, trying custom parsing:", selector, e);
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
        } catch (e) {
          console.debug("[Parser] :eq selector failed:", baseSel, e);
          return null;
        }
      }
      const lastMatch = selector.match(/^(.*):last(?:\(\))?$/);
      if (lastMatch) {
        const baseSel = lastMatch[1] || "*";
        try {
          const nodes = Array.from(doc2.querySelectorAll(baseSel));
          return nodes.length ? nodes[nodes.length - 1] : null;
        } catch (e) {
          console.debug("[Parser] :last selector failed:", baseSel, e);
          return null;
        }
      }
      const firstMatch = selector.match(/^(.*):first(?:\(\))?$/);
      if (firstMatch) {
        const baseSel = firstMatch[1] || "*";
        try {
          const nodes = Array.from(doc2.querySelectorAll(baseSel));
          return nodes.length ? nodes[0] : null;
        } catch (e) {
          console.debug("[Parser] :first selector failed:", baseSel, e);
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
          for (const text2 of containsTexts) {
            candidates = candidates.filter((el) => (el.textContent || "").includes(text2));
          }
          return candidates[0] || null;
        } catch (e) {
          console.debug("[Parser] :contains selector failed:", baseSel, e);
          return null;
        }
      }
      return null;
    }
    async runBeforeParseHook(rule, doc2, url) {
      var _a;
      const beforeParse = (_a = rule.hooks) == null ? void 0 : _a.beforeParse;
      if (!beforeParse) return;
      try {
        if (typeof beforeParse === "function") {
          await beforeParse(doc2, url, this.getHookHelpers());
          return;
        }
        const fn = new Function(
          "doc",
          "url",
          "helpers",
          `return (async () => { ${beforeParse} })();`
        );
        await fn(doc2, url, this.getHookHelpers());
      } catch (e) {
        console.warn("[Parser] beforeParse hook error:", e);
      }
    }
    getHookHelpers() {
      return {
        fetchJson: (url, options) => this.fetchJson(url, options),
        fetchText: (url, options) => this.fetchText(url, options)
      };
    }
    async fetchJson(url, options = {}) {
      const responseText = await this.fetchText(url, options);
      if (!responseText) return null;
      try {
        return JSON.parse(responseText);
      } catch {
        return null;
      }
    }
    async fetchText(url, options = {}) {
      const resolved = this.resolveHookFetchUrl(url);
      if (!resolved) {
        console.warn("[Parser] Fetch blocked: invalid or unsafe URL:", url);
        return null;
      }
      const resolvedUrl = new URL(resolved);
      const timeoutMs = options.timeoutMs ?? 4e3;
      const headers = options.headers ?? {};
      const referrer = options.referrer ? resolveAndValidateHttpUrl(options.referrer, window.location.href) || void 0 : void 0;
      const withCredentials = options.withCredentials ?? true;
      const gmXhr = typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null;
      if (gmXhr) {
        return new Promise((resolve) => {
          const gmHeaders = { ...headers };
          if (referrer && !Object.keys(gmHeaders).some((name) => name.toLowerCase() === "referer")) {
            gmHeaders.Referer = referrer;
          }
          gmXhr({
            method: "GET",
            url: resolvedUrl.href,
            headers: gmHeaders,
            timeout: timeoutMs,
            withCredentials,
            onload: (resp) => resolve(resp.responseText || null),
            onerror: () => resolve(null),
            ontimeout: () => resolve(null)
          });
        });
      }
      try {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), timeoutMs);
        const fetchHeaders = { ...headers };
        for (const name of Object.keys(fetchHeaders)) {
          if (name.toLowerCase() === "referer") {
            delete fetchHeaders[name];
          }
        }
        const resp = await fetch(resolvedUrl.href, {
          credentials: withCredentials ? "include" : "omit",
          headers: fetchHeaders,
          referrer,
          signal: controller.signal
        });
        window.clearTimeout(timer);
        if (!resp.ok) return null;
        return await resp.text();
      } catch {
        return null;
      }
    }
  }
  let parserInstance = null;
  function getParser() {
    if (!parserInstance) {
      parserInstance = new Parser();
    }
    return parserInstance;
  }
  function enableRightClick() {
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
    return () => {
      document.removeEventListener("contextmenu", handler, true);
      document.oncontextmenu = originalOnContextMenu;
    };
  }
  function enableSelection() {
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
    return () => {
      document.removeEventListener("selectstart", handler, true);
      style.remove();
    };
  }
  function enableCopy() {
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
    return () => {
      document.removeEventListener("copy", handler, true);
      document.removeEventListener("cut", handler, true);
    };
  }
  function unlockKeyboard() {
    const handler = (e) => {
      const ke = e;
      if (isMnrEvent(ke) && !isMnrReaderShortcutEvent(ke)) {
        return;
      }
      ke.stopImmediatePropagation();
      ke.stopPropagation();
    };
    const types = ["keydown", "keyup", "keypress"];
    types.forEach((type) => document.addEventListener(type, handler, true));
    const originalDocumentHandlers = {
      keydown: document.onkeydown,
      keyup: document.onkeyup,
      keypress: document.onkeypress
    };
    const originalWindowHandlers = {
      keydown: window.onkeydown,
      keyup: window.onkeyup,
      keypress: window.onkeypress
    };
    const originalBodyHandlers = document.body ? {
      keydown: document.body.onkeydown,
      keyup: document.body.onkeyup,
      keypress: document.body.onkeypress
    } : null;
    const originalHtmlHandlers = {
      keydown: document.documentElement.onkeydown,
      keyup: document.documentElement.onkeyup,
      keypress: document.documentElement.onkeypress
    };
    document.onkeydown = null;
    document.onkeyup = null;
    document.onkeypress = null;
    window.onkeydown = null;
    window.onkeyup = null;
    window.onkeypress = null;
    document.documentElement.onkeydown = null;
    document.documentElement.onkeyup = null;
    document.documentElement.onkeypress = null;
    if (document.body) {
      document.body.onkeydown = null;
      document.body.onkeyup = null;
      document.body.onkeypress = null;
    }
    document.querySelectorAll("[onkeydown], [onkeyup], [onkeypress]").forEach((el) => {
      el.removeAttribute("onkeydown");
      el.removeAttribute("onkeyup");
      el.removeAttribute("onkeypress");
    });
    return () => {
      types.forEach((type) => document.removeEventListener(type, handler, true));
      document.onkeydown = originalDocumentHandlers.keydown;
      document.onkeyup = originalDocumentHandlers.keyup;
      document.onkeypress = originalDocumentHandlers.keypress;
      window.onkeydown = originalWindowHandlers.keydown;
      window.onkeyup = originalWindowHandlers.keyup;
      window.onkeypress = originalWindowHandlers.keypress;
      document.documentElement.onkeydown = originalHtmlHandlers.keydown;
      document.documentElement.onkeyup = originalHtmlHandlers.keyup;
      document.documentElement.onkeypress = originalHtmlHandlers.keypress;
      if (document.body && originalBodyHandlers) {
        document.body.onkeydown = originalBodyHandlers.keydown;
        document.body.onkeyup = originalBodyHandlers.keyup;
        document.body.onkeypress = originalBodyHandlers.keypress;
      }
    };
  }
  function isMnrEvent(e) {
    var _a, _b;
    const path = typeof e.composedPath === "function" ? e.composedPath() : [];
    for (const node of path) {
      if (node instanceof ShadowRoot) {
        const host = node.host;
        if ((_a = host == null ? void 0 : host.id) == null ? void 0 : _a.startsWith("mnr-")) return true;
      }
      if (node instanceof Element) {
        if ((_b = node.id) == null ? void 0 : _b.startsWith("mnr-")) return true;
        for (const cls of Array.from(node.classList)) {
          if (cls.startsWith("mnr-")) return true;
        }
      }
    }
    return false;
  }
  function isMnrReaderShortcutEvent(e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return false;
    const key = e.key.toLowerCase();
    const shortcutKeys = new Set([
      "escape",
      "tab",
      "enter",
      "s",
      ",",
      "e",
      "q",
      "arrowleft",
      "arrowright",
      "arrowup",
      "arrowdown",
      " ",
      "spacebar",
      "n",
      "p"
    ]);
    if (!shortcutKeys.has(key)) return false;
    const path = typeof e.composedPath === "function" ? e.composedPath() : [];
    if (path.some(isEditableKeyboardTarget)) return false;
    return path.some((node) => {
      if (!(node instanceof Element)) return false;
      if (node.id === "mnr-reader-root") return true;
      return Array.from(node.classList).some((cls) => cls === "mnr-reader" || cls.startsWith("mnr-"));
    });
  }
  function isEditableKeyboardTarget(node) {
    if (!(node instanceof Element)) return false;
    const tagName = node.tagName;
    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || node.isContentEditable === true;
  }
  const DEFAULT_PROTECTION_OPTIONS = {
    blockRedirects: true,
    enableRightClick: true,
    enableSelection: true,
    enableCopy: true,
    unlockKeyboard: true,
    blockPopups: true,
    removeEventHijacking: true,
    blockVisibilityDetection: true,
    clearTimers: true,
    cleanupScripts: false
  };
  const isCloudflareChallenge = (doc2 = document) => {
    var _a, _b;
    const pathname = ((_a = doc2.location) == null ? void 0 : _a.pathname) || (typeof window !== "undefined" ? window.location.pathname : "");
    if (pathname.startsWith("/cdn-cgi/")) return true;
    const selectors = [
      '[id*="cf-chl"]',
      '[class*="cf-chl"]',
      'form[action*="/cdn-cgi/"]',
      'script[src*="/cdn-cgi/challenge-platform"]',
      'link[href*="/cdn-cgi/challenge-platform"]',
      'iframe[src*="challenges.cloudflare.com"]',
      'iframe[src*="captcha.cloudflare.com"]'
    ];
    if (doc2.querySelector(selectors.join(",")) !== null) return true;
    const title = (doc2.title || "").trim().toLowerCase();
    if (title === "just a moment..." || title === "attention required! | cloudflare") {
      return true;
    }
    const scriptText = Array.from(doc2.querySelectorAll("script")).map((script) => `${script.getAttribute("src") || ""}
${script.textContent || ""}`).join("\n");
    if (/_cf_chl_opt|cf_chl_|challenge-platform|challenges\.cloudflare\.com/i.test(scriptText)) {
      return true;
    }
    const bodyText = (((_b = doc2.body) == null ? void 0 : _b.textContent) || "").replace(/\s+/g, " ").trim();
    return /enable javascript and cookies to continue/i.test(bodyText);
  };
  function withDefaultProtectionOptions(options = {}) {
    return { ...DEFAULT_PROTECTION_OPTIONS, ...options };
  }
  function getEffectiveProtectionOptions(options, doc2 = document) {
    if (!isCloudflareChallenge(doc2)) {
      return options;
    }
    return {
      ...options,
      blockRedirects: false,
      clearTimers: false,
      removeEventHijacking: false
    };
  }
  function blockPopups() {
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
    return () => {
      window.open = originalOpen;
    };
  }
  function blockRedirects(options = {}) {
    var _a, _b;
    const metaRefresh = document.querySelectorAll('meta[http-equiv="refresh"]');
    metaRefresh.forEach((meta) => meta.remove());
    const originalAssign = window.location.assign.bind(window.location);
    const originalReplace = window.location.replace.bind(window.location);
    const isAllowedNavigation = (url) => {
      try {
        const targetUrl = new URL(url, window.location.href);
        const cloudflareHosts = ["challenges.cloudflare.com", "captcha.cloudflare.com"];
        if (cloudflareHosts.some((h2) => targetUrl.hostname === h2)) {
          return true;
        }
        if (targetUrl.origin === window.location.origin && targetUrl.pathname.startsWith("/cdn-cgi/")) {
          return true;
        }
        if (targetUrl.origin === window.location.origin) {
          const blockedPatterns = [
            /(?:^|[/_-])ads?(?:[/_-]|$)/i,
            /(?:^|[/_-])click[_-]?track/i,
            /(?:^|[/_-])redirect(?:[/_-]|$)/i,
            /(?:^|[/_-])jump[_-]?to/i,
            /(?:^|[/_-])go[_-]?to[_-]?url/i,
            /(?:^|[/_-])link[_-]?out/i,
            /(?:^|[/_-])external(?:[/_-]|$)/i
          ];
          return !blockedPatterns.some((p2) => p2.test(targetUrl.pathname));
        }
        return false;
      } catch {
        return false;
      }
    };
    let locationOverrideSucceeded = false;
    const locationProto = Object.getPrototypeOf(window.location);
    const originalHrefDesc = locationProto ? Object.getOwnPropertyDescriptor(locationProto, "href") : null;
    try {
      const target = locationProto || window.location;
      Object.defineProperty(target, "assign", {
        value: (url) => {
          if (isAllowedNavigation(url)) originalAssign(url);
        },
        writable: true,
        configurable: true
      });
      Object.defineProperty(target, "replace", {
        value: (url) => {
          if (isAllowedNavigation(url)) originalReplace(url);
        },
        writable: true,
        configurable: true
      });
      if (locationProto) {
        if ((originalHrefDesc == null ? void 0 : originalHrefDesc.set) && originalHrefDesc.get) {
          Object.defineProperty(locationProto, "href", {
            get: originalHrefDesc.get,
            set: function(url) {
              var _a2;
              if (isAllowedNavigation(url)) {
                (_a2 = originalHrefDesc.set) == null ? void 0 : _a2.call(this, url);
              }
            },
            configurable: true
          });
        }
      }
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
    const isBlockedExternalUrl = (url, kind) => {
      if (url.protocol !== "http:" && url.protocol !== "https:") return true;
      if (url.origin === window.location.origin) return false;
      const cfHosts = ["challenges.cloudflare.com", "captcha.cloudflare.com"];
      if (cfHosts.some((h2) => url.hostname === h2)) return false;
      if (url.pathname.startsWith("/cdn-cgi/")) return false;
      return kind === "script" || kind === "iframe";
    };
    const isHighEntropyPath = (pathname) => {
      return /^\/[A-Za-z0-9]{6,12}\/[A-Za-z0-9]{6,24}\.js(?:$|[?#])/.test(pathname);
    };
    const isLikelyAdScriptPath = (srcUrl) => {
      if (srcUrl.origin !== window.location.origin) return true;
      const path = srcUrl.pathname || "";
      if (path.startsWith("/static/") || path.startsWith("/js/") || path.startsWith("/assets/")) {
        return false;
      }
      return isHighEntropyPath(path);
    };
    const NodeCtor = window.Node;
    const ScriptCtor = window.HTMLScriptElement;
    const IFrameCtor = window.HTMLIFrameElement;
    const ElementCtor = window.Element;
    const DocumentFragmentCtor = window.DocumentFragment;
    const originalAppendChild = NodeCtor.prototype.appendChild;
    const originalInsertBefore = NodeCtor.prototype.insertBefore;
    const shouldBlockNode = (node) => {
      const checkScript = (script) => {
        const src = script.getAttribute("src") || script.src || "";
        if (!src) return false;
        let u;
        try {
          u = new URL(src, window.location.href);
        } catch {
          return false;
        }
        if (isBlockedExternalUrl(u, "script")) return true;
        if (options.cleanupScripts && isLikelyAdScriptPath(u)) return true;
        return false;
      };
      const checkIFrame = (iframe) => {
        const src = iframe.getAttribute("src") || iframe.src || "";
        if (!src) return false;
        let u;
        try {
          u = new URL(src, window.location.href);
        } catch {
          return false;
        }
        if (isBlockedExternalUrl(u, "iframe")) return true;
        return false;
      };
      if (ScriptCtor && node instanceof ScriptCtor) return checkScript(node);
      if (IFrameCtor && node instanceof IFrameCtor) return checkIFrame(node);
      if (DocumentFragmentCtor && node instanceof DocumentFragmentCtor || ElementCtor && node instanceof ElementCtor) {
        const scripts = node.querySelectorAll("script[src]");
        for (const s of Array.from(scripts)) {
          if (ScriptCtor && s instanceof ScriptCtor && checkScript(s)) return true;
        }
        const iframes = node.querySelectorAll("iframe[src]");
        for (const f of Array.from(iframes)) {
          if (IFrameCtor && f instanceof IFrameCtor && checkIFrame(f)) return true;
        }
      }
      return false;
    };
    NodeCtor.prototype.appendChild = function(node) {
      if (shouldBlockNode(node)) return node;
      return originalAppendChild.call(this, node);
    };
    NodeCtor.prototype.insertBefore = function(newNode, referenceNode) {
      if (shouldBlockNode(newNode)) return newNode;
      return originalInsertBefore.call(this, newNode, referenceNode);
    };
    const originalWrite = (_a = document.write) == null ? void 0 : _a.bind(document);
    const originalWriteln = (_b = document.writeln) == null ? void 0 : _b.bind(document);
    let writeBuffer = "";
    let isBufferingWrite = false;
    const MAX_BUFFER_LEN = 4096;
    const bufferLooksLikeScriptTag = (buf) => /<script/i.test(buf);
    const bufferIsClosed = (buf) => /<\/script>/i.test(buf) || /<\\\/script>/i.test(buf);
    const maybeExtractScriptSrc = (buf) => {
      const m = buf.match(/<script[^>]*\ssrc\s*=\s*['"]([^'"]+)['"][^>]*>/i);
      return (m == null ? void 0 : m[1]) || null;
    };
    const flushWriteBuffer = (writer) => {
      if (!writeBuffer) return;
      writer(writeBuffer);
      writeBuffer = "";
      isBufferingWrite = false;
    };
    const handleWriteLike = (writer, args) => {
      if (!originalWrite || !originalWriteln) return writer(String(args.join("")));
      const chunk = args.map((a) => String(a)).join("");
      const startsScriptLike = /<script/i.test(chunk) || isBufferingWrite && bufferLooksLikeScriptTag(writeBuffer);
      if (!isBufferingWrite && startsScriptLike) {
        isBufferingWrite = true;
        writeBuffer = "";
      }
      if (!isBufferingWrite) {
        writer(chunk);
        return;
      }
      writeBuffer += chunk;
      if (writeBuffer.length > MAX_BUFFER_LEN) {
        flushWriteBuffer(writer);
        return;
      }
      if (!bufferIsClosed(writeBuffer)) return;
      const src = maybeExtractScriptSrc(writeBuffer);
      if (src) {
        try {
          const u = new URL(src, window.location.href);
          const shouldBlock = isBlockedExternalUrl(u, "script") || isLikelyAdScriptPath(u);
          if (shouldBlock) {
            writeBuffer = "";
            isBufferingWrite = false;
            return;
          }
        } catch {
        }
      }
      flushWriteBuffer(writer);
    };
    if (options.cleanupScripts && originalWrite && originalWriteln) {
      document.write = (...args) => handleWriteLike(originalWrite, args);
      document.writeln = (...args) => handleWriteLike(originalWriteln, args);
    }
    return () => {
      if (locationOverrideSucceeded) {
        try {
          const target = locationProto || window.location;
          Object.defineProperty(target, "assign", { value: originalAssign, configurable: true });
          Object.defineProperty(target, "replace", { value: originalReplace, configurable: true });
          if (locationProto && originalHrefDesc) {
            Object.defineProperty(locationProto, "href", originalHrefDesc);
          }
        } catch {
        }
      }
      window.setTimeout = originalSetTimeout;
      window.setInterval = originalSetInterval;
      NodeCtor.prototype.appendChild = originalAppendChild;
      NodeCtor.prototype.insertBefore = originalInsertBefore;
      if (originalWrite) {
        document.write = originalWrite;
      }
      if (originalWriteln) {
        document.writeln = originalWriteln;
      }
    };
  }
  function clearAllTimers() {
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
  function removeOverlays() {
    if (!document.body) return;
    const hideElement = (el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
    };
    const overlaySelectors = [
'[class*="overlay"]',
      '[class*="modal"]',
      '[class*="popup"]',
      '[class*="mask"]',
      '[class*="blocker"]',
      '[id*="overlay"]',
      '[id*="modal"]',
      '[id*="popup"]'
];
    document.querySelectorAll(overlaySelectors.join(", ")).forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const isFullPage = rect.width >= window.innerWidth * 0.8 && rect.height >= window.innerHeight * 0.8;
      const isFixed = style.position === "fixed" || style.position === "absolute";
      const zIndex = parseInt(style.zIndex, 10);
      const hasHighZIndex = Number.isFinite(zIndex) && zIndex > 1e3;
      if (isFullPage && isFixed && hasHighZIndex) {
        hideElement(el);
      }
    });
    const isTransparentColor = (color) => {
      const c = (color || "").trim().toLowerCase();
      return c === "transparent" || c === "rgba(0, 0, 0, 0)" || c === "rgba(0,0,0,0)";
    };
    const isMnrHost = (el) => el.id.startsWith("mnr-");
    const hasVisibleContent = (el) => {
      const text2 = (el.textContent || "").trim();
      if (text2.length > 0) return true;
      return el.querySelector("img, svg, canvas, video") !== null;
    };
    const looksLikeClickLayer = (el) => {
      if (isMnrHost(el)) return false;
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (style.pointerEvents === "none") return false;
      if (style.position !== "fixed" && style.position !== "absolute") return false;
      const zIndex = parseInt(style.zIndex, 10);
      if (!Number.isFinite(zIndex) || zIndex <= 1e3) return false;
      const rect = el.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return false;
      const minWidth = window.innerWidth * 0.6;
      const minHeight = 40;
      const maxHeight = window.innerHeight * 0.6;
      if (rect.width < minWidth || rect.height < minHeight || rect.height > maxHeight) return false;
      const nearTop = rect.top <= 2;
      const nearBottom = rect.bottom >= window.innerHeight - 2;
      if (!nearTop && !nearBottom) return false;
      if (hasVisibleContent(el)) return false;
      const rawOpacity = style.opacity || el.style.opacity || "1";
      const opacity = parseFloat(rawOpacity);
      const bg = style.backgroundColor || el.style.backgroundColor || "";
      const invisible = Number.isFinite(opacity) && opacity <= 0.08 || isTransparentColor(bg);
      if (!invisible) return false;
      const AnchorCtor = window.HTMLAnchorElement;
      if (AnchorCtor && el instanceof AnchorCtor) return true;
      if (el.tagName.toLowerCase() === "a" && el.hasAttribute("href")) return true;
      if (el.querySelector("a[href]")) return true;
      if (el.hasAttribute("onclick")) return true;
      const maybeOnclick = el.onclick;
      if (typeof maybeOnclick === "function") return true;
      return false;
    };
    const candidates = Array.from(
      document.body.querySelectorAll("a, div, span, section, header, footer, nav")
    );
    for (const el of candidates) {
      if (looksLikeClickLayer(el)) {
        hideElement(el);
      }
    }
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
  class SiteProtection {
    constructor(options = {}) {
      this.cleanupFunctions = [];
      this.isActive = false;
      this.options = withDefaultProtectionOptions(options);
    }
activate(options) {
      if (options) {
        this.options = withDefaultProtectionOptions(options);
      }
      if (this.isActive) {
        if (!options) return;
        this.deactivate();
      }
      this.isActive = true;
      const effectiveOptions = getEffectiveProtectionOptions(this.options);
      if (effectiveOptions.clearTimers) {
        clearAllTimers();
      }
      if (effectiveOptions.blockRedirects) {
        this.cleanupFunctions.push(
          blockRedirects({ cleanupScripts: !!effectiveOptions.cleanupScripts })
        );
      }
      if (effectiveOptions.enableRightClick) {
        this.cleanupFunctions.push(enableRightClick());
      }
      if (effectiveOptions.enableSelection) {
        this.cleanupFunctions.push(enableSelection());
      }
      if (effectiveOptions.enableCopy) {
        this.cleanupFunctions.push(enableCopy());
      }
      if (effectiveOptions.unlockKeyboard) {
        this.cleanupFunctions.push(unlockKeyboard());
      }
      if (effectiveOptions.blockPopups) {
        this.cleanupFunctions.push(blockPopups());
      }
      if (effectiveOptions.cleanupScripts) {
        this.cleanupScripts();
      }
      if (effectiveOptions.removeEventHijacking) {
        this.removeEventHijacking();
      }
      if (effectiveOptions.blockVisibilityDetection) {
        this.blockVisibilityDetection();
      }
    }
deactivate() {
      if (!this.isActive) return;
      this.cleanupFunctions.forEach((cleanup) => cleanup());
      this.cleanupFunctions = [];
      this.isActive = false;
    }
removeOverlays() {
      removeOverlays();
    }
cleanupScripts() {
      const suspiciousPatterns = [
        /(^|[\\/._-])(adservice|adserver|adsystem|adsbygoogle|pagead)([\\/._-]|$)/i,
        /(^|[\\/._-])ads([\\/._-]|$)/i,
        /doubleclick/i,
        /googlesyndication|googletagmanager|gtag/i,
        /google-analytics/i,
        /(^|[\\/._-])(analytics|track(er|ing)?|pixel|beacon|telemetry)([\\/._-]|$)/i
      ];
      const siteHost = window.location.hostname;
      const isSameSite = (host) => {
        return host === siteHost || host.endsWith(`.${siteHost}`);
      };
      document.querySelectorAll("script[src]").forEach((script) => {
        const src = script.getAttribute("src") || "";
        let url;
        try {
          url = new URL(src, window.location.href);
        } catch {
          return;
        }
        const target = `${url.hostname}${url.pathname}`;
        const isSuspicious = suspiciousPatterns.some((p2) => p2.test(target));
        if (!isSuspicious) return;
        const isThirdParty = !isSameSite(url.hostname);
        const isHighConfidence = /(^|[\\/._-])(adservice|adserver|adsystem|adsbygoogle|pagead)([\\/._-]|$)/i.test(target);
        if (isThirdParty || isHighConfidence) {
          script.remove();
        }
      });
    }
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
blockVisibilityDetection() {
      const docProto = Object.getPrototypeOf(document);
      const savedHidden = (() => {
        const ownDesc = Object.getOwnPropertyDescriptor(document, "hidden");
        if (ownDesc) return { descriptor: ownDesc, owner: "instance" };
        if (docProto) {
          const protoDesc = Object.getOwnPropertyDescriptor(docProto, "hidden");
          if (protoDesc) return { descriptor: protoDesc, owner: "prototype" };
        }
        return { descriptor: void 0, owner: "none" };
      })();
      const savedVisibilityState = (() => {
        const ownDesc = Object.getOwnPropertyDescriptor(document, "visibilityState");
        if (ownDesc) return { descriptor: ownDesc, owner: "instance" };
        if (docProto) {
          const protoDesc = Object.getOwnPropertyDescriptor(docProto, "visibilityState");
          if (protoDesc) return { descriptor: protoDesc, owner: "prototype" };
        }
        return { descriptor: void 0, owner: "none" };
      })();
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
      const restoreDescriptor = (prop, saved) => {
        try {
          if (saved.owner === "instance" && saved.descriptor) {
            Object.defineProperty(document, prop, saved.descriptor);
          } else {
            delete document[prop];
          }
        } catch {
        }
      };
      this.cleanupFunctions.push(() => {
        document.removeEventListener("visibilitychange", visibilityBlocker, true);
        window.removeEventListener("blur", blurBlocker, true);
        window.removeEventListener("focus", blurBlocker, true);
        restoreDescriptor("hidden", savedHidden);
        restoreDescriptor("visibilityState", savedVisibilityState);
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
  class RuleSaver {
createRuleFromDetection(hostname, detection) {
      const content = detection.results.content;
      const navigation = detection.results.navigation;
      const title = detection.results.title;
      const section = detection.results.section;
      const hostPattern = hostname.replace(/\./g, "\\\\.");
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
          created: Date.now()
        }
      };
      if ((section == null ? void 0 : section.isSection) && (section.confidence || 0) >= 0.8) {
        rule.advanced = { checkSection: true };
      }
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
async saveFromDetection(doc2, detection) {
      var _a;
      if (!detection) return;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const hostname = new URL(url).hostname;
      const rule = this.createRuleFromDetection(hostname, detection);
      const ruleManager = getRuleManager();
      await ruleManager.saveUserRule(hostname, rule);
    }
validateRule(rule) {
      var _a;
      if (!rule.id || !rule.name || !rule.match) {
        return false;
      }
      if (!rule.match.pattern) {
        return false;
      }
      if (!((_a = rule.content) == null ? void 0 : _a.selector)) {
        return false;
      }
      return true;
    }
enhanceRule(existingRule, detection) {
      var _a;
      const enhanced = {
        ...existingRule,
        content: { ...existingRule.content }
      };
      const content = detection.results.content;
      const navigation = detection.results.navigation;
      const title = detection.results.title;
      const section = detection.results.section;
      if (content.selector && content.selector !== "#content") {
        enhanced.content = { ...enhanced.content, selector: content.selector };
      }
      if (navigation.next || navigation.prev || navigation.index) {
        enhanced.navigation = enhanced.navigation || {};
        if (navigation.next && !enhanced.navigation.next) {
          enhanced.navigation.next = navigation.next.selector || navigation.next.url;
        }
        if (navigation.prev && !enhanced.navigation.prev) {
          enhanced.navigation.prev = navigation.prev.selector || navigation.prev.url;
        }
        if (navigation.index && !enhanced.navigation.index) {
          enhanced.navigation.index = navigation.index.selector || navigation.index.url;
        }
      }
      if (title.selector && !enhanced.title) {
        enhanced.title = {
          selector: title.selector
        };
      }
      if ((section == null ? void 0 : section.isSection) && (section.confidence || 0) >= 0.8) {
        enhanced.advanced = enhanced.advanced || {};
        enhanced.advanced.checkSection = true;
      }
      const source = ((_a = enhanced.meta) == null ? void 0 : _a.source) ?? "user";
      enhanced.meta = { ...enhanced.meta, source, updated: Date.now() };
      return enhanced;
    }
  }
  function createRuleSaver() {
    return new RuleSaver();
  }
  class SectionMerger {
    constructor(parser) {
      this.parser = parser;
    }
async merge(doc2, url, options = {}) {
      var _a, _b, _c, _d, _e, _f;
      const maxPages = Math.max(1, options.maxPages ?? 10);
      const confidenceThreshold = options.confidenceThreshold ?? 0.8;
      const baseUrl = getSectionBaseUrl(url);
      let startUrl = url;
      let startDoc = doc2;
      const knownDocs = new Map([[normalizeAbsoluteUrl(url, url), doc2]]);
      const qidianBookPreviewUrl = resolveQidianMobileBookPreviewChapterUrl(doc2, url);
      if (qidianBookPreviewUrl) {
        const previewChapter = await this.parser.parse(doc2, qidianBookPreviewUrl);
        if (previewChapter) return previewChapter;
      }
      if (baseUrl && baseUrl !== url) {
        const baseDoc = await this.fetchUrl(baseUrl, url, options.fetcher, options.signal);
        if (baseDoc) {
          startUrl = baseUrl;
          startDoc = baseDoc;
          knownDocs.set(normalizeAbsoluteUrl(baseUrl, url), baseDoc);
        }
      }
      const first = await this.parser.parse(startDoc, startUrl);
      if (!first) return null;
      const disableByRule = !!((_b = (_a = first.rule) == null ? void 0 : _a.advanced) == null ? void 0 : _b.noSection);
      if (disableByRule) return first;
      const enableByRule = !!((_d = (_c = first.rule) == null ? void 0 : _c.advanced) == null ? void 0 : _d.checkSection);
      const detection = this.parser.detect(startDoc, startUrl);
      const section = detection.results.section;
      const hasNextSectionUrl = !!(section == null ? void 0 : section.isSection) && !!(section == null ? void 0 : section.nextSectionUrl);
      const shouldMerge = enableByRule || !!(section == null ? void 0 : section.isSection) && ((section == null ? void 0 : section.confidence) || 0) >= confidenceThreshold;
      if (!shouldMerge) {
        if (!hasNextSectionUrl && first.nextUrl && isSectionLikeUrl(startUrl, first.nextUrl)) {
          const realNextChapterUrl = this.findNextChapterUrl(startDoc, startUrl);
          if (realNextChapterUrl) {
            first.nextUrl = realNextChapterUrl;
          }
        }
        return first;
      }
      const sectionDelayMs = options.fetcher ? 0 : Math.max(0, ((_f = (_e = first.rule) == null ? void 0 : _e.advanced) == null ? void 0 : _f.sectionDelayMs) ?? 0);
      return this.mergeSections(
        startUrl,
        first,
        section,
        maxPages,
        sectionDelayMs,
        options.fetcher,
        knownDocs,
        options.signal
      );
    }
async mergeSections(startUrl, first, section, maxPages, sectionDelayMs, fetcher, knownDocs, signal) {
      let mergedContent = first.content;
      let mergedRaw = first.rawContent;
      let nextSectionUrl = (section == null ? void 0 : section.nextSectionUrl) || null;
      let nextChapterUrl = (section == null ? void 0 : section.nextChapterUrl) || null;
      let lastUrl = startUrl;
      if (!nextSectionUrl && first.nextUrl && isSectionLikeUrl(startUrl, first.nextUrl)) {
        nextSectionUrl = first.nextUrl;
      }
      const maxAdditionalPages = Math.max(0, maxPages - 1);
      const seen = new Set([startUrl]);
      for (let i = 0; i < maxAdditionalPages && nextSectionUrl; i++) {
        if (signal == null ? void 0 : signal.aborted) break;
        const absNextSection = normalizeAbsoluteUrl(nextSectionUrl, lastUrl);
        if (seen.has(absNextSection)) break;
        seen.add(absNextSection);
        if (sectionDelayMs > 0) {
          await this.sleep(sectionDelayMs, signal);
          if (signal == null ? void 0 : signal.aborted) break;
        }
        const cachedDoc = (knownDocs == null ? void 0 : knownDocs.get(absNextSection)) ?? null;
        let nextDoc = cachedDoc ?? await this.fetchUrl(absNextSection, lastUrl, fetcher, signal);
        if (!nextDoc) break;
        let nextParsed = await this.parser.parse(nextDoc, absNextSection);
        if (!nextParsed && cachedDoc) {
          const fetchedDoc = await this.fetchUrl(absNextSection, lastUrl, fetcher, signal);
          if (!fetchedDoc) break;
          knownDocs == null ? void 0 : knownDocs.set(absNextSection, fetchedDoc);
          nextDoc = fetchedDoc;
          nextParsed = await this.parser.parse(nextDoc, absNextSection);
        }
        if (!nextParsed) break;
        mergedContent = joinHtml(mergedContent, nextParsed.content);
        mergedRaw = joinHtml(mergedRaw, nextParsed.rawContent);
        const nextDet = this.parser.detect(nextDoc, absNextSection);
        const s = nextDet.results.section;
        if (s == null ? void 0 : s.nextChapterUrl) nextChapterUrl = s.nextChapterUrl;
        nextSectionUrl = (s == null ? void 0 : s.nextSectionUrl) || null;
        if (!nextSectionUrl && nextParsed.nextUrl) {
          if (isSectionLikeUrl(absNextSection, nextParsed.nextUrl)) {
            nextSectionUrl = nextParsed.nextUrl;
          } else if (!nextChapterUrl) {
            nextChapterUrl = nextParsed.nextUrl;
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
    async sleep(ms, signal) {
      if (ms <= 0 || (signal == null ? void 0 : signal.aborted)) return;
      await new Promise((resolve) => {
        const timer = globalThis.setTimeout(resolve, ms);
        if (!signal) return;
        signal.addEventListener(
          "abort",
          () => {
            globalThis.clearTimeout(timer);
            resolve();
          },
          { once: true }
        );
      });
    }
async fetchUrl(url, referrer, customFetcher, signal) {
      if (signal == null ? void 0 : signal.aborted) {
        return null;
      }
      if (customFetcher) {
        return await customFetcher(url, referrer);
      }
      const { promise, abort } = fetchAndParseUrl(url, referrer);
      if (!signal) {
        const result = await promise;
        return result.doc;
      }
      if (signal.aborted) {
        abort();
        return null;
      }
      let abortListener = null;
      const abortPromise = new Promise((resolve) => {
        abortListener = () => {
          abort();
          resolve({ doc: null, status: null, finalUrl: null, error: "abort" });
        };
        signal.addEventListener("abort", abortListener, { once: true });
      });
      try {
        const result = await Promise.race([promise, abortPromise]);
        return result.doc;
      } finally {
        if (abortListener) {
          signal.removeEventListener("abort", abortListener);
        }
      }
    }
findNextChapterUrl(doc2, currentUrl) {
      var _a;
      const links = doc2.querySelectorAll("a[href]");
      const candidates = [];
      for (const link of links) {
        const anchor = link;
        const href = anchor.getAttribute("href");
        if (!href) continue;
        const absUrl = normalizeAbsoluteUrl(href, currentUrl);
        if (absUrl === currentUrl || isSectionLikeUrl(currentUrl, absUrl)) continue;
        const text2 = ((_a = anchor.textContent) == null ? void 0 : _a.trim()) || "";
        if (!text2) continue;
        const normalizedText = text2.replace(/\s+/g, "").trim();
        if (!normalizedText) continue;
        const lowerText = normalizedText.toLowerCase();
        const isForward = /下一/.test(normalizedText) || /下[章节篇话]/.test(normalizedText) || /后一章/.test(normalizedText) || /继续阅读/.test(normalizedText) || /next/i.test(normalizedText);
        if (!isForward) continue;
        const isChapterText = CHAPTER_TEXT_PATTERNS.some((p2) => p2.test(text2));
        const isSectionText = SECTION_TEXT_PATTERNS.some((p2) => p2.test(text2)) || lowerText.includes("next") && lowerText.includes("page") && !lowerText.includes("chapter");
        const isEnglishNextChapter = lowerText.includes("next") && lowerText.includes("chapter");
        if (isSectionText && !isChapterText && !isEnglishNextChapter) continue;
        let score = 0;
        if (isChapterText) score += 50;
        if (isEnglishNextChapter) score += 45;
        if (lowerText === "next" || lowerText === ">" || lowerText === "»") score += 10;
        if (lowerText.includes("next")) score += 2;
        if (normalizedText.length <= 5) score += 1;
        const rel = (anchor.getAttribute("rel") || "").toLowerCase();
        if (rel.includes("next")) score += 2;
        if (score > 0) {
          candidates.push({ url: absUrl, score });
        }
      }
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0].url;
    }
  }
  function createSectionMerger(parser) {
    return new SectionMerger(parser);
  }
  const TOC_TITLE_PATTERN = /(?:章节目录|章節目錄|章节列表|章節列表|目录|目錄|书目|書目|toc|catalog|contents?)/i;
  const TOC_URL_PATTERN = /(?:^|\/)(?:catalog|toc|contents?|mulu|dir(?:ectory)?|chapterlist|chapters)(?:\/|$)/i;
  const TOC_QUERY_PATTERN = /[?&](?:catalog|toc|contents?)=|[?&](?:mulu|dir)=/i;
  const CHAPTER_URL_STRONG_PATTERN = /\/(?:chapter|chapters?|read|txt|article|novel\/chapters)\/[^?#]*\d/i;
  const CHAPTER_LINK_TEXT_PATTERN = /第\s*[一二两三四五六七八九十○零百千万亿0-9]{1,9}\s*[章回卷节折篇幕集话話]|Chapter\s*\d+/i;
  const NAV_LINK_TEXT_PATTERN = /(?:下一[章页]|上一[章页]|下一章|上一章|next|prev)/i;
  function parseHttpUrl(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      return u;
    } catch {
      return null;
    }
  }
  function getKindFromUrl(url) {
    const parsed = parseHttpUrl(url);
    if (!parsed) return "other";
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    if (TOC_URL_PATTERN.test(pathname) || TOC_QUERY_PATTERN.test(search)) {
      return "toc";
    }
    if (CHAPTER_URL_STRONG_PATTERN.test(pathname)) {
      return "chapter";
    }
    return "other";
  }
  function getKindFromTitle(title) {
    if (!title) return "other";
    if (TOC_TITLE_PATTERN.test(title)) return "toc";
    return "other";
  }
  function getKindFromDom(doc2) {
    const body = doc2.body;
    if (!body) return "other";
    const titleKind = getKindFromTitle(doc2.title);
    if (titleKind !== "other") return titleKind;
    const anchors = Array.from(body.querySelectorAll("a[href]"));
    let linkTextLength = 0;
    let chapterLikeLinkCount = 0;
    let navLinkCount = 0;
    for (const anchor of anchors) {
      const text2 = (anchor.textContent || "").trim();
      if (!text2) continue;
      linkTextLength += text2.length;
      if (CHAPTER_LINK_TEXT_PATTERN.test(text2)) chapterLikeLinkCount++;
      if (NAV_LINK_TEXT_PATTERN.test(text2)) navLinkCount++;
    }
    const totalTextLength = (body.textContent || "").length;
    const linkDensity = linkTextLength / Math.max(1, totalTextLength);
    const paragraphCount = body.querySelectorAll("p").length;
    if (chapterLikeLinkCount >= 25 && linkDensity >= 0.12) return "toc";
    if (anchors.length >= 120 && chapterLikeLinkCount >= 15 && linkDensity >= 0.08) return "toc";
    if (navLinkCount > 0 && totalTextLength >= 2e3 && chapterLikeLinkCount <= 12 && linkDensity < 0.25) {
      return "chapter";
    }
    if (totalTextLength >= 8e3 && chapterLikeLinkCount <= 12 && linkDensity < 0.25) return "chapter";
    if (paragraphCount >= 8 && totalTextLength >= 4e3 && chapterLikeLinkCount <= 12 && linkDensity < 0.25) {
      return "chapter";
    }
    return "other";
  }
  function getPageKind(url, doc2) {
    const kindFromUrl = getKindFromUrl(url);
    if (kindFromUrl !== "other") return kindFromUrl;
    if (!doc2) return "other";
    return getKindFromDom(doc2);
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
      this.sectionMerger = createSectionMerger(this.parser);
      this.ruleSaver = createRuleSaver();
    }
    recordDecision(url, decision) {
      this.currentDecision = decision;
      this.currentDecisionUrl = url;
      return decision;
    }
    updateOptions(options = {}) {
      this.options = { ...this.options, ...options };
      if (Object.prototype.hasOwnProperty.call(options, "forceDetection")) {
        this.parser = new Parser({
          forceDetection: options.forceDetection
        });
        this.sectionMerger = createSectionMerger(this.parser);
      }
    }
setPromptCallback(callback) {
      this.promptCallback = callback;
    }
setLaunchCallback(callback) {
      this.launchCallback = callback;
    }
async check(doc2 = document) {
      var _a, _b, _c, _d;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const decide = (decision2) => this.recordDecision(url, decision2);
      if (isCloudflareChallenge(doc2)) {
        return decide({
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["Cloudflare Challenge 页面，等待验证完成"]
        });
      }
      if (this.shouldSkip(url)) {
        return decide({
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["URL matches skip pattern"]
        });
      }
      const pageKind = getPageKind(url, doc2);
      if (pageKind === "toc") {
        return decide({
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["目录页，跳过自动启用"]
        });
      }
      let hostname = null;
      try {
        hostname = new URL(url).hostname;
      } catch {
        hostname = null;
      }
      if (hostname) {
        const storage = getRuleStorage();
        const pref = storage.getSitePreference(hostname);
        if ((pref == null ? void 0 : pref.enabled) === false) {
          return decide({
            shouldEnable: false,
            method: "user-disabled",
            confidence: 0,
            reasons: ["用户已关闭该站点自动启用"],
            showFloatingButton: true
          });
        }
        if ((pref == null ? void 0 : pref.enabled) === true) {
          return decide({
            shouldEnable: true,
            method: "site-preference",
            confidence: 1,
            reasons: ["用户已为该站点开启自动启用"]
          });
        }
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
          return decide(decision2);
        }
      }
      if (pageKind !== "chapter") {
        return decide({
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["非正文页，跳过自动启用"]
        });
      }
      if (!this.detectionEngine.quickCheck(doc2)) {
        return decide({
          shouldEnable: false,
          method: "manual",
          confidence: 0,
          reasons: ["Page does not appear to be novel content"]
        });
      }
      const detection = this.detectionEngine.detect(doc2, ((_d = doc2.location) == null ? void 0 : _d.href) || window.location.href);
      const decision = {
        shouldEnable: detection.confidence.overall >= (this.options.confidenceThreshold || 0.6),
        method: "detection",
        confidence: detection.confidence.overall,
        detection,
        reasons: detection.confidence.reasons
      };
      return decide(decision);
    }
async execute(doc2 = document) {
      var _a;
      if (this.hasRun) {
        return;
      }
      this.hasRun = true;
      const currentUrl = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      const decision = this.currentDecision && this.currentDecisionUrl === currentUrl ? this.currentDecision : await this.check(doc2);
      if (!decision.shouldEnable) {
        return;
      }
      if (this.options.enableProtection) {
        const protection = getSiteProtection();
        protection.activate(this.options.protectionOptions);
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
          const launched = await this.launch(doc2, decision);
          if (launched) {
            this.rememberSiteEnabled(doc2);
          }
        }
      }
    }
async launch(doc2, decision) {
      var _a;
      try {
        const currentUrl = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
        const chapter = await this.sectionMerger.merge(doc2, currentUrl);
        if (chapter && this.launchCallback) {
          this.launchCallback(chapter, decision.rule);
          return true;
        }
        return false;
      } catch (e) {
        console.error("[AutoEnableManager] Parse error:", e);
        return false;
      }
    }
    rememberSiteEnabled(doc2) {
      var _a;
      const url = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
      if (getPageKind(url, doc2) !== "chapter") return;
      try {
        const hostname = new URL(url).hostname;
        const storage = getRuleStorage();
        storage.setSitePreference(hostname, { enabled: true, timestamp: Date.now() });
      } catch (e) {
        console.error("[AutoEnableManager] Failed to save site preference:", e);
      }
    }
async saveRuleForCurrentSite(doc2, decision) {
      if (!decision.detection) return;
      await this.ruleSaver.saveFromDetection(doc2, decision.detection);
    }
shouldSkip(url) {
      return (this.options.skipPatterns || []).some((pattern) => pattern.test(url));
    }
getDecision() {
      return this.currentDecision;
    }
reset() {
      this.hasRun = false;
      this.currentDecision = void 0;
      this.currentDecisionUrl = void 0;
    }
async manualEnable(doc2 = document) {
      var _a;
      if (this.options.enableProtection) {
        const protection = getSiteProtection();
        protection.activate(this.options.protectionOptions);
        protection.removeOverlays();
      }
      try {
        const currentUrl = ((_a = doc2.location) == null ? void 0 : _a.href) || window.location.href;
        const chapter = await this.sectionMerger.merge(doc2, currentUrl);
        if (chapter && this.launchCallback) {
          this.launchCallback(chapter, chapter.rule);
          this.rememberSiteEnabled(doc2);
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
    } else if (options) {
      managerInstance.updateOptions(options);
    }
    return managerInstance;
  }
  const VERSION = "9.0.11";
  const BUILD_DATE = "2026-07-03";
  function captureHostPageSnapshot() {
    if (typeof window === "undefined" || typeof document === "undefined") return null;
    return {
      url: window.location.href,
      title: document.title,
      state: window.history.state
    };
  }
  function syncHostPageToChapter(chapter, index) {
    var _a;
    if (!chapter) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const chapterTitle = chapter.title.trim();
    const bookTitle = ((_a = chapter.bookTitle) == null ? void 0 : _a.trim()) || "";
    const title = chapterTitle && bookTitle && chapterTitle !== bookTitle ? `${chapterTitle} - ${bookTitle}` : chapterTitle || bookTitle;
    if (!chapter.url) {
      if (title) document.title = title;
      return;
    }
    const currentState = window.history.state;
    const stateBase = currentState && typeof currentState === "object" && !Array.isArray(currentState) ? currentState : {};
    try {
      window.history.replaceState(
        {
          ...stateBase,
          mnr: true,
          mnrChapter: index,
          chapterUrl: chapter.url
        },
        "",
        chapter.url
      );
    } catch {
    }
    if (title) {
      document.title = title;
    }
  }
  function restoreHostPageSnapshot(snapshot) {
    if (!snapshot) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;
    try {
      window.history.replaceState(snapshot.state ?? null, "", snapshot.url);
    } catch {
    }
    document.title = snapshot.title;
  }
  /**
  * @vue/shared v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
function makeMap(str) {
    const map = Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 &&
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
  const isReservedProp = makeMap(
",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
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
  const isSpecialBooleanAttr = makeMap(specialBooleanAttrs);
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
          (entries2, [key, val2], i) => {
            entries2[stringifySymbol(key, i) + " =>"] = val2;
            return entries2;
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
on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
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
  const pausedQueueEffects = new WeakSet();
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
  const targetMap = new WeakMap();
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
        targetMap.set(target, depsMap = new Map());
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
  const isNonTrackableKeys = makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
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
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) ||

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
  const mutableHandlers = new MutableReactiveHandler();
  const readonlyHandlers = new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = new ReadonlyReactiveHandler(true);
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
next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
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
    get: createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, true)
  };
  const reactiveMap = new WeakMap();
  const shallowReactiveMap = new WeakMap();
  const readonlyMap = new WeakMap();
  const shallowReadonlyMap = new WeakMap();
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
notify() {
      this.flags |= 16;
      if (!(this.flags & 8) &&
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
  const cleanupMap = new WeakMap();
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
oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
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
    seen = seen || new Map();
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
      if (trace.length &&
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
  const resolvedPromise = Promise.resolve();
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
      if (!lastJob ||
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
              (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = new Set())).add(target);
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
      leavingVNodes: new Map()
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
onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
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
      leavingVNodesCache = Object.create(null);
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
function defineComponent(options, extraOptions) {
    return isFunction(options) ? (


(() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  const pendingSetRefMap = new WeakMap();
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
  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
      const hasProps = Object.keys(props).length > 0;
      return openBlock(), createBlock(
        Fragment,
        null,
        [createVNode("slot", props, fallback)],
        hasProps ? -2 : 64
      );
    }
    let slot = slots[name];
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const slotKey = props.key ||

validSlotContent && validSlotContent.key;
    const rendered = createBlock(
      Fragment,
      {
        key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) +
(!validSlotContent && fallback ? "_fb" : "")
      },
      validSlotContent || [],
      validSlotContent && slots._ === 1 ? 64 : -2
    );
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child)) return true;
      if (child.type === Comment) return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (


extend( Object.create(null), {
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
(cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
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
data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
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
expose,
      inheritAttrs,
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
methods: mergeObjectOptions,
    computed: mergeObjectOptions,
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
components: mergeObjectOptions,
    directives: mergeObjectOptions,
watch: mergeWatchOptions,
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
    return to ? extend( Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [... new Set([...to, ...from])];
      }
      return extend(
Object.create(null),
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
    const merged = extend( Object.create(null), to);
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
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap()
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
      const installedPlugins = new WeakSet();
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
    let handler = props[handlerName = toHandlerKey(event)] ||
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
  const mixinEmitsCache = new WeakMap();
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
    instance.propsDefaults = Object.create(null);
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
        if (!rawProps ||
!hasOwn(rawProps, key) &&

((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps &&
(rawPrevProps[key] !== void 0 ||
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
]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = new WeakMap();
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
] = shouldCast;
          prop[
            1
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

oldVNode.el &&

(oldVNode.type === Fragment ||

!isSameVNodeType(oldVNode, newVNode) ||
oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (

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
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren &&

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



n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
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
            if (root.ce &&
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
hostParentNode(prevTree.el),
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
        const keyToNewIndexMap = new Map();
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
        } else if (dynamicChildren &&




!dynamicChildren.hasOnce &&
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
        if (c2.type === Text &&
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
    if (isBlockTreeEnabled > 0 &&
!isBlockNode &&
currentBlock &&



(vnode.patchFlag > 0 || shapeFlag & 6) &&

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



patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,



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
  function createTextVNode(text2 = " ", flag = 0) {
    return createVNode(Text, null, text2, flag);
  }
  function createCommentVNode(text2 = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text2)) : createVNode(Comment, null, text2);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
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
next: null,
      subTree: null,
effect: null,
      update: null,
job: null,
      scope: new EffectScope(
        true
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
components: null,
      directives: null,
propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
emit: null,
emitted: null,
propsDefaults: EMPTY_OBJ,
inheritAttrs: type.inheritAttrs,
ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,

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
    instance.accessCache = Object.create(null);
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
      policy = tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && doc.createElement("template");
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
    createText: (text2) => doc.createTextNode(text2),
    createComment: (text2) => doc.createComment(text2),
    setText: (node, text2) => {
      node.nodeValue = text2;
    },
    setElementText: (el, text2) => {
      el.textContent = text2;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },



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
before ? before.nextSibling : parent.firstChild,
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
  const TransitionPropsValidators = extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const decorate$1 = (t) => {
    t.displayName = "Transition";
    t.props = TransitionPropsValidators;
    return t;
  };
  const Transition = decorate$1(
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
    (el[vtcKey] || (el[vtcKey] = new Set())).add(cls);
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
    if (key === "value" && tag !== "PROGRESS" &&
!tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (

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
  const p = Promise.resolve();
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
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 &&
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
  const rendererOptions = extend({ patchProp }, nodeOps);
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
  /*!
   * pinia v2.3.1
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = (
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

_a: null,
      _e: scope,
      _s: new Map(),
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
      pinia2 =

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
  const MAX_SESSION_CACHE = 500;
  const MAX_NAV_FAILURES = 200;
  const VIP_BLOCK_TOAST = "该章节为VIP/付费内容，无法加载";
  const dict_HKVariantsRevPhrases = "一口吃個 一口喫個|一口吃成 一口喫成|一家三口 一家三口|一家五口 一家五口|一家六口 一家六口|一家四口 一家四口|七星巖 七星巖|世胄 世胄|介胄 介冑|傅巖 傅巖|免胄 免冑|冠胄 冠冑|千巖競秀 千巖競秀|千巖萬壑 千巖萬壑|千巖萬谷 千巖萬谷|口吃 口吃|台山 台山|台州 台州|台州地區 台州地區|台州市 台州市|吃口 喫口|吃口令 吃口令|吃口飯 喫口飯|吃吃 喫喫|吃子 喫子|名胄 名胄|國胄 國胄|圍巖 圍巖|地胄 地胄|壓胄子 壓冑子|士胄 士胄|大巖桐 大巖桐|天台女 天台女|天台宗 天台宗|天台山 天台山|天台縣 天台縣|天潢貴胄 天潢貴胄|奇巖 奇巖|寶胄 寶胄|小巖洞 小巖洞|岫巖縣 岫巖縣|峯巖 峯巖|嵌巖 嵌巖|巉巖 巉巖|巖壁 巖壁|巖居 巖居|巖居穴處 巖居穴處|巖居谷飲 巖居谷飲|巖岸 巖岸|巖巉 巖巉|巖巖 巖巖|巖徼 巖徼|巖手縣 巖手縣|巖村 巖村|巖洞 巖洞|巖流圈 巖流圈|巖牆 巖牆|巖牆之下 巖牆之下|巖畫 巖畫|巖穴 巖穴|巖穴之士 巖穴之士|巖薔薇 巖薔薇|巖邑 巖邑|巖郎 巖郎|巖阻 巖阻|巖陛 巖陛|帝胄 帝胄|幽巖 幽巖|幽棲巖谷 幽棲巖谷|張口 張口|懸巖 懸巖|懸巖峭壁 懸巖峭壁|懸胄 懸冑|控制台 控制台|攀巖 攀巖|支胄 支胄|教胄 教胄|景胄 景胄|望胄 望胄|末胄 末胄|村胄 村胄|枕巖漱流 枕巖漱流|枝胄 枝胄|氏胄 氏胄|洪胄 洪胄|浙江天台縣 浙江天台縣|清胄 清胄|灰巖殘丘 灰巖殘丘|玄胄 玄胄|甲胄 甲冑|甲胄魚類 甲冑魚類|皇胄 皇胄|石灰巖洞 石灰巖洞|神胄 神胄|簪纓世胄 簪纓世胄|系胄 系胄|紅巖 紅巖|絕巖 絕巖|緒胄 緒胄|纂胄 纂胄|胃口 胃口|胄嗣 胄嗣|胄子 胄子|胄序 胄序|胄族 胄族|胄甲 冑甲|胄監 胄監|胄科 冑科|胄緒 胄緒|胄胤 胄胤|胄裔 胄裔|胄裔繁衍 胄裔繁衍|胄閥 胄閥|胡雪巖 胡雪巖|胤胄 胤胄|苗胄 苗胄|英胄 英胄|華胄 華胄|血胄 血胄|裔胄 裔胄|訓胄 訓胄|試胄 試胄|豪門貴胄 豪門貴胄|貝胄 貝冑|貴胄 貴胄|賢胄 賢胄|蹇吃 蹇吃|躬擐甲胄 躬擐甲冑|遐胄 遐胄|遙胄 遙胄|遙遙華胄 遙遙華胄|遠胄 遠胄|遺胄 遺胄|鄧艾吃 鄧艾吃|重巖疊嶂 重巖疊嶂|金胄 金胄|鎧胄 鎧冑|鑿巖 鑿巖|門胄 門胄|開口 開口|雲巖區 雲巖區|非層巖 非層巖|韓侂胄 韓侂冑|飮胄 飮冑|骨巖巖 骨巖巖|高胄 高胄|魚胄 魚冑|鮮胄 鮮胄|鴻胄 鴻胄|黃巖區 黃巖區|黃巖島 黃巖島|黃炎貴胄 黃炎貴胄|齒胄 齒胄|龍巖 龍巖|龍巖市 龍巖市|龍巖村 龍巖村|龍胄 龍胄";
  const dict_HKVariantsRev = "偽 僞|兑 兌|卧 臥|叁 叄|台 臺|吃 喫|唇 脣|啟 啓|囱 囪|媪 媼|媯 嬀|悦 悅|愠 慍|户 戶|才 纔|抬 擡|捝 挩|揾 搵|敍 敘|敚 敓|枱 檯|枴 柺|核 覈|棁 梲|榅 榲|氲 氳|涚 涗|温 溫|溈 潙|潀 潨|濕 溼|灶 竈|為 爲|煙 菸|煴 熅|痴 癡|皂 皁|眾 衆|秘 祕|税 稅|稜 棱|粧 妝|粽 糉|糭 糉|緼 縕|缽 鉢|脱 脫|腽 膃|葱 蔥|蒀 蒕|蒍 蔿|藴 蘊|蜕 蛻|衞 衛|衹 只|説 說|踴 踊|輼 轀|醖 醞|針 鍼|鈎 鉤|鋭 銳|閲 閱|鰛 鰮";
  const from_hk = [[dict_HKVariantsRevPhrases, dict_HKVariantsRev]];
  const dict_TWVariantsRevPhrases = "一口吃個 一口喫個|一口吃成 一口喫成|一家三口 一家三口|一家五口 一家五口|一家六口 一家六口|一家四口 一家四口|凶事 凶事|凶信 凶信|凶兆 凶兆|凶吉 凶吉|凶地 凶地|凶多吉少 凶多吉少|凶宅 凶宅|凶年 凶年|凶德 凶德|凶怪 凶怪|凶日 凶日|凶服 凶服|凶歲 凶歲|凶死 凶死|凶氣 凶氣|凶煞 凶煞|凶燄 凶燄|凶神 凶神|凶禮 凶禮|凶耗 凶耗|凶肆 凶肆|凶荒 凶荒|凶訊 凶訊|凶豎 凶豎|凶身 凶身|凶逆 凶逆|凶門 凶門|口吃 口吃|吃口 喫口|吃口令 吃口令|吃口飯 喫口飯|吃吃 喫喫|吃子 喫子|合著 合著|吉凶 吉凶|名著 名著|四凶 四凶|大凶 大凶|巨著 巨著|張口 張口|昭著 昭著|歲凶 歲凶|胃口 胃口|著作 著作|著名 著名|著式 著式|著志 著志|著於 著於|著書 著書|著白 著白|著稱 著稱|著者 著者|著述 著述|著錄 著錄|蹇吃 蹇吃|逢凶 逢凶|避凶 避凶|鄧艾吃 鄧艾吃|鉅著 鉅著|開口 開口|閔凶 閔凶|顯著 顯著";
  const dict_TWVariantsRev = "么 幺|偽 僞|參 蔘|吃 喫|唇 脣|啟 啓|媯 嬀|嫻 嫺|峰 峯|床 牀|才 纔|抬 擡|核 覈|汙 污|洩 泄|溈 潙|潀 潨|灶 竈|為 爲|痴 癡|痺 痹|皂 皁|眾 衆|睪 睾|秘 祕|稜 棱|簷 檐|粽 糉|缽 鉢|群 羣|著 着|蒍 蔿|裡 裏|踴 踊|針 鍼|韁 繮|顎 齶|鯰 鮎|麵 麪";
  const from_tw = [[dict_TWVariantsRevPhrases, dict_TWVariantsRev]];
  const dict_TWPhrasesRev = "PN接面 PN結|SQL隱碼攻擊 SQL注入|三極體 三極管|下拉式清單 下拉列表|丟擲 拋出|中介軟體 中間件|主機板 主板|主開機記錄 主引導記錄|乙太網 以太網|乙太網路 以太網|乙太網路由器 以太網路由器|乙太網路路由器 以太網路由器|乳酪 奶酪|二極體 二極管|互動 交互|互動式 交互式|亞塞拜然 阿塞拜疆|人工智慧 人工智能|介面 接口|介面卡 適配器|代碼 代碼|伺服器 服務器|佇列 隊列|位元 比特|位元率 比特率|位元組 字節|位元速率 碼率|位址 地址|位址列 地址欄|低級 低級|低階 低級|佛漢·威廉斯 沃恩·威廉斯|佛瑞 福雷|作業系統 操作系統|使用者 用戶|使用者名稱 用戶名|來電轉接 呼叫轉移|例項 實例|信號 信號|停用 禁用|偵錯 調試|偵錯程式 調試器|傅立葉 傅里葉|傳送 發送|傷心小棧 紅心大戰|價效比 性價比|優先順序 優先級|儲存 保存|元件 組件|光碟 光盤|光碟機 光驅|克羅埃西亞 克羅地亞|克萊門第 克萊門蒂|入口網站 門戶網站|內建 內置|內碼表 代碼頁|全域性 全局|全形 全角|全球資訊網 萬維網|公元紀年 公元紀年|冰棒 冰棍|冷盤 涼菜|凱吉 凱奇|函式 函數|函數語言程式設計 函數式編程|刀鋒伺服器 刀片服務器|分割槽 分區|分散式 分佈式|分時多工 時分複用|分時多重進接 時分多址|分碼多重進接 碼分多址|分空間多重進接 空分多址|分頻多工 頻分複用|分頻多重進接 頻分多址|列印 打印|列支敦斯登 列支敦士登|列舉 枚舉|利蓋悌 利蓋蒂|前處理器 預處理器|剪下 剪切|剪貼簿 剪貼板|副檔名 擴展名|加彭 加蓬|包羅定 鮑羅丁|匯入 導入|匯出 導出|匯流排 總線|區域性 局部|區域網 局域網|千里達及托巴哥 特立尼達和多巴哥|半形 半角|卡達 卡塔爾|印表機 打印機|即時 實時|厄利垂亞 厄立特里亞|厄瓜多 厄瓜多爾|原始檔 源文件|原始碼 原代碼|原生代碼 本地代碼|參數列 參數表|取樣 採樣|取樣率 採樣率|叢集 集羣|史克里亞賓 斯克里亞賓|史卡拉第 斯卡拉蒂|史托克豪森 施托克豪森|史特勞斯 施特勞斯|史特拉汶斯基 斯特拉文斯基|史瓦濟蘭 斯威士蘭|史麥塔納 斯美塔那|司法程序 司法程序|吉布地 吉布堤|吉里巴斯 基里巴斯|名字空間 命名空間|名稱空間 命名空間|吐瓦魯 圖瓦盧|向量 矢量|呼叫 調用|命令列 命令行|咖哩 咖喱|哈薩克 哈薩克斯坦|哥斯大黎加 哥斯達黎加|啟用 激活|喫茶小舖 喫茶小舖|喬治亞 格魯吉亞|單核心 宏內核|回撥 回調|圖示 圖標|土庫曼 土庫曼斯坦|地址 地址|坦尚尼亞 坦桑尼亞|型別 類型|埠 端口|執行 運行|執行檔 可執行文件|執行緒 線程|執行長 首席執行官|堆疊 堆棧|場效電晶體 場效應管|塑膠 塑料|塔吉克 塔吉克斯坦|塞席爾 塞舌爾|塞普勒斯 塞浦路斯|壁紙 壁紙|夏農 香農|外掛 插件|外接 外置|外部索引鍵 外鍵|多型 多態|多執行緒 多線程|多尼采第 多尼采蒂|多工 多任務|多明尼加 多米尼加|大數據 大數據|太空梭 航天飛機|奈及利亞 尼日利亞|奈米 納米|奧福 奧爾夫|子音 輔音|字串 字符串|字元 字符|字元集 字符集|字型 字體|字型檔 字庫|字尾 後綴|字節跳動 字節跳動|字首 前綴|存取 訪問|存檔 存盤|孟德爾頌 門德爾松|安地卡及巴布達 安提瓜和巴布達|宏都拉斯 洪都拉斯|宕機 死機|定址 尋址|宣告 聲明|實例 實例|實體地址 物理地址|實體記憶體 物理內存|寬頻 寬帶|寮國 老撾|專案 項目|對映 映射|對話方塊 對話框|對象 對象|尚比亞 贊比亞|尤拉 歐拉|尼日 尼日爾|巢狀 嵌套|工作列 任務欄|工作管理員 任務管理器|巨集 宏|巨集函式 宏函數|巨集呼叫 宏調用|巨集命令 宏命令|巨集定義 宏定義|巨集展開 宏展開|巨集指令 宏指令|巨集替換 宏替換|巨集程式設計 宏編程|巨集處理 宏處理|巨集語言 宏語言|巴布亞紐幾內亞 巴布亞新幾內亞|巴貝多 巴巴多斯|布吉納法索 布基納法索|布拉姆斯 勃拉姆斯|布林 布爾|布瑞頓 布里頓|布萊茲 布列茲|帛琉 帕勞|平行計算 並行計算|幾內亞比索 幾內亞比紹|序列 串行|序列埠 串口|序號產生器 註冊機|建構函式 構造函數|建構子 構造器|建立 創建|引數 參數|彙編 彙編|影像 圖像|影印 複印|影片 視頻|後設資料 元數據|循環 循環|微控制器 單片機|德布西 德彪西|德弗札克 德沃夏克|快取 緩存|快取記憶體 高速緩存|快捷半導體 仙童半導體|快閃記憶體 閃存|感測 傳感|憂鬱症 抑鬱症|截圖 截屏|戴奧辛 二噁英|戴流士 戴留斯|打開 打開|批次 批量|技術長 首席技術官|拉摩 拉莫|拉羅 拉洛|拉赫曼尼諾夫 拉赫瑪尼諾夫|指令式程式設計 命令式編程|指令碼 腳本|指標 指針|捲軸 滾動條|掃描器 掃描儀|排程 調度|控制代碼 句柄|控制元件 控件|提佩特 蒂佩特|搜尋 搜索|摩爾線程 摩爾線程|摺積 捲積|撥出 呼出|擴充套件 擴展|擴音 免提|擷取 截取|攜帶型 便攜式|攝護腺 前列腺|支持者 支持者|支援 支持|效能 性能|整合 集成|數位 數字|數位印刷 數字印刷|數位電子 數字電子|數位電路 數字電路|數字 數字|數據 數據|數據機 調製解調器|文件 文檔|文書處理 文字處理|斯洛維尼亞 斯洛文尼亞|新增 添加|方程式 方程式|映象 鏡像|映象管 顯像管|時脈頻率 時鐘頻率|普羅高菲夫 普羅科菲耶夫|普賽爾 珀塞爾|晶片 芯片|智慧 智能|智慧財產權 知識產權|暫存器 寄存器|最佳化 優化|有失真壓縮 有損壓縮|李彥宏 李彥宏|林姆斯基-高沙可夫 里姆斯基-科薩科夫|查德 乍得|查詢 查找|柯普蘭 科普蘭|柯雷利 科雷利|核取按鈕 複選按鈕|核取方塊 複選框|核心 內核|格瑞那達 格林納達|桌上型 桌面型|桌上型電腦 臺式機|桌布 壁紙|梅湘 梅西安|楊納傑克 雅納切克|標頭檔案 頭文件|模擬 仿真|模組 模塊|模里西斯 毛里求斯|機率 幾率|檔名 文件名|檔案 文件|檢視 查看|欄位 字段|歐巴馬 奧巴馬|正當程序 正當程序|正規化 範式|正規表示式 正則表達式|母音 元音|比特幣 比特幣|氣泡排序 冒泡排序|永珍 萬象|永續性 持久性|汶萊 文萊|沙烏地阿拉伯 沙特阿拉伯|泡麵 方便麪|波凱里尼 博凱里尼|波士尼亞赫塞哥維納 波斯尼亞黑塞哥維那|波札那 博茨瓦納|波長分波多工 波分複用|海內存知己 海內存知己|海飛茲 海菲茨|消息 消息|游標 光標|溢位 溢出|滑鼠 鼠標|演算法 算法|漢他病毒 漢坦病毒|潘德列茲基 潘德列茨基|烏茲別克 烏茲別克斯坦|無失真壓縮 無損壓縮|燒錄 刻錄|營運長 首席運營官|片語 詞組|物件 對象|物件導向 面向對象|狀態列 狀態欄|獅子山 塞拉利昂|瓜地馬拉 危地馬拉|甘比亞 岡比亞|畫素 像素|登入 登錄|登出 註銷|登錄檔 註冊表|白遼士 柏遼茲|盧安達 盧旺達|目的碼 目標代碼|直譯器 解釋器|相容 兼容|相簿 圖庫|真實模式 實模式|矽 硅|砈 砹|破圖 花屏|硬碟 硬盤|硬體 硬件|碟片 盤片|磁碟 磁盤|磁碟機代號 盤符|磁軌 磁道|社區 社區|社群 社區|程序 進程|程序不正義 程序不正義|程序導向 面向過程|程序式程式設計 過程式編程|程序正義 程序正義|程式 程序|程式碼 代碼|程式設計 編程|程式設計師 程序員|程式語言 編程語言|稽核 審覈|穆索斯基 穆索爾斯基|積體電路 集成電路|空氣清淨機 空氣淨化器|空間多工 空分複用|突尼西亞 突尼斯|筆記型電腦 筆記本電腦|範式 範式|簡報 演示文稿|簡訊 短信|簽帳金融卡 借記卡|粘貼 粘貼|紐西蘭 新西蘭|純喫茶 純喫茶|索羅門群島 所羅門羣島|索馬利亞 索馬里|終端使用者 最終用戶|組合語言 彙編語言|組譯 彙編|組譯器 彙編器|結束通話 掛斷|維德角 佛得角|網咖 網吧|網絡卡 網卡|網路 網絡|網路上的芳鄰 網上鄰居|網際網路 互聯網|線上 在線|縮圖 縮略圖|縮排 縮進|繫結 綁定|義大利 意大利|聖克里斯多福及尼維斯 聖基茨和尼維斯|聖文森及格瑞那丁 聖文森特和格林納丁斯|聖露西亞 聖盧西亞|聖馬利諾 聖馬力諾|聯結器 連接器|聯絡 聯繫|肯亞 肯尼亞|胰臟 胰腺|腳踏車 自行車|自動旋轉螢幕 自動轉屏|興德密特 欣德米特|艾爾加 埃爾加|茅利塔尼亞 毛里塔尼亞|荀白克 勳伯格|莫三比克 莫桑比克|莫札特 莫扎特|菜單 菜單|華格納 瓦格納|華爾頓 沃爾頓|萊許 賴希|萬用字元 通配符|萬那杜 瓦努阿圖|葉門 也門|葛令卡 格林卡|葛利格 格里格|葛拉斯 格拉斯|葛摩 科摩羅|蒲隆地 布隆迪|蓋亞那 圭亞那|蓋希文 格什溫|蕭士塔高維契 肖斯塔科維奇|蕭邦 肖邦|薩拉沙泰 薩拉薩蒂|薩提 薩蒂|藍色畫面 藍屏|蘇利南 蘇里南|處理程序 處理程序|虛擬函式 虛函數|虛擬機器 虛擬機|虛擬碼 僞代碼|螢幕 屏幕|行內函數 內聯函數|行動式 便攜式|行動數據 移動數據|行動硬碟 移動硬盤|行動網路 移動網絡|行動通訊 移動通信|行動電話 移動電話|行程 進程|衣索比亞 埃塞俄比亞|表示式 表達式|裝置 設備|複製 拷貝|西元 公元|西貝流士 西貝柳斯|視窗 窗口|視覺化 可視化|視訊 視頻|視訊會議 視頻會議|視訊記憶體 顯存|視訊通話 視頻通話|解析度 分辨率|解構函式 析構函數|解構子 析構函數|解除安裝 卸載|觸控 觸摸|觸控式螢幕 觸摸屏|計程車 出租車|訊息 消息|訊號 信號|訊雜比 信噪比|記憶體 內存|訪問 訪問|設定 設置|許可權 權限|訴訟程序 訴訟程序|調色盤 調色板|調變 調製|諾魯 瑙魯|識別符號 標識符|變數 變量|象牙海岸 科特迪瓦|貝南 貝寧|貝里尼 貝利尼|貝里斯 伯利茲|貼上 粘貼|資料 數據|資料來源 數據源|資料倉儲 數據倉庫|資料包 數據報|資料夾 文件夾|資料庫 數據庫|資料探勘 數據挖掘|資訊 信息|資訊安全 信息安全|資訊理論 信息論|資訊科技 信息技術|資訊長 首席信息官|賓士 奔馳|賴比瑞亞 利比里亞|賴索托 萊索托|超程式設計 元編程|跳脫字元 轉義字符|軟碟機 軟驅|軟體 軟件|軟體動物 軟體動物|載入 加載|載入程式 引導程序|輝達 英偉達|辛巴威 津巴布韋|迦納 加納|迴圈 循環|通訊 通信|通話卡 通訊卡|通話記錄 聯繫歷史|通道 信道|速食麵 方便麪|連結 鏈接|連結串列 鏈表|連線 連接|進位制 進制|進程 進程|進階 高端|運算元 操作數|運算子 操作符|運算式 表達式|過載 重載|遞迴 遞歸|遠端 遠程|遮蔽 屏蔽|選單 菜單|邏輯閘 邏輯門|那杜 溫納圖萬|部落格 博客|都會網路 城域網|醯 酰|釋出 發佈|重新命名 重命名|重新整理 刷新|重灌 重裝|金氧半導體 金屬氧化物半導體|金鑰 密鑰|鈽 鈈|鉲 鐦|鉳 錇|鋂 鎇|錄影 錄像|錼 鎿|鍅 鈁|鎝 鍀|鎦 鑥|鑀 鎄|開啟 打開|閘流體 晶閘管|閘道器 網關|閘電路 門電路|關聯式資料庫 關係數據庫|防寫 寫保護|防毒 殺毒|阿拉伯聯合大公國 阿拉伯聯合酋長國|陣列 數組|除錯 調試|隨身碟 U盤|雜湊 哈希|離線 脫機|雲端儲存 雲存儲|雲端計算 雲計算|雷射 激光|電晶體 晶體管|電腦保安 計算機安全|電腦科學 計算機科學|霍洛維茲 霍洛維茨|非同步 異步|韋本 韋伯恩|韋瓦第 維瓦爾第|韌體 固件|韓德爾 亨德爾|音效卡 聲卡|音訊 音頻|頁尾 頁腳|頁首 頁眉|預設 預設|預設值 默認值|頻寬 帶寬|類别範本 類模板|類比 模擬|類比電子 模擬電子|類比電路 模擬電路|顧爾德 古爾德|顯示卡 顯卡|飛航模式 飛行模式|馬利共和國 馬里共和國|馬爾地夫 馬爾代夫|駭客 黑客|高效能運算 高性能計算|高畫質 高清|高空彈跳 蹦極|高級 高級|高階 高端|黃宏 黃宏|點選 點擊|點陣圖 位圖";
  const from_twp = [[dict_TWPhrasesRev, dict_TWVariantsRevPhrases, dict_TWVariantsRev]];
  const JPShinjitaiPhrases = "一獲千金 一攫千金|丁寧 叮嚀|丁重 鄭重|三差路 三叉路|世論 輿論|亜鈴 啞鈴|交差 交叉|供宴 饗宴|俊馬 駿馬|保塁 堡壘|個条書 箇条書|偏平 扁平|停泊 碇泊|優俊 優駿|先兵 尖兵|先鋭 尖鋭|共役 共軛|冗舌 饒舌|凶器 兇器|削岩 鑿岩|包丁 庖丁|包帯 繃帯|区画 區劃|厳然 儼然|友宜 友誼|反乱 叛乱|収集 蒐集|叙情 抒情|台頭 擡頭|合弁 合辦|喜遊曲 嬉遊曲|嘆願 歎願|回転 廻転|回遊 回游|奉持 捧持|委縮 萎縮|展転 輾轉|希少 稀少|幻惑 眩惑|広範 廣汎|広野 曠野|廃虚 廢墟|建坪率 建蔽率|弁当 辨當|弁膜 瓣膜|弁護 辯護|弁髪 辮髮|弦歌 絃歌|恩義 恩誼|意向 意嚮|慰謝料 慰藉料|憶断 臆断|憶病 臆病|戦没 戰歿|扇情 煽情|手帳 手帖|技量 伎倆|抜粋 抜萃|披歴 披瀝|抵触 牴触|抽選 抽籤|拘引 勾引|拠出 醵出|拠金 醵金|掘削 掘鑿|控除 扣除|援護 掩護|放棄 抛棄|散水 撒水|敬謙 敬虔|敷延 敷衍|断固 断乎|族生 簇生|昇叙 陞敘|暖房 煖房|暗唱 暗誦|暗夜 闇夜|暴露 曝露|枯渇 涸渇|格好 恰好|格幅 恰幅|棄損 毀損|模索 摸索|橋頭保 橋頭堡|欠缺 欠缺|死体 屍體|殿部 臀部|母指 拇指|気迫 気魄|決別 訣別|決壊 決潰|沈殿 沈澱|油送船 油槽船|波乱 波瀾|注釈 註釋|洗浄 洗滌|活発 活潑|浸透 滲透|浸食 浸蝕|消却 銷卻|混然 渾然|湾曲 彎曲|溶接 熔接|漁労 漁撈|漂然 飄然|激高 激昂|火炎 火焰|焦燥 焦躁|班点 斑点|留飲 溜飲|略奪 掠奪|疎通 疏通|発酵 醱酵|白亜 白堊|相克 相剋|知恵 智慧|破棄 破毀|確固 確乎|禁固 禁錮|符丁 符牒|粉装 扮装|紫班 紫斑|終息 終熄|総合 綜合|編集 編輯|義援 義捐|耕運機 耕耘機|肝心 肝腎|肩甲骨 肩胛骨|背徳 悖德|脈拍 脈搏|膨張 膨脹|芳純 芳醇|英知 叡智|蒸留 蒸溜|薫蒸 燻蒸|薫製 燻製|衣装 衣裳|衰退 衰退|裕然 悠然|補佐 輔佐|訓戒 訓誡|試練 試煉|詭弁 詭辯|講和 媾和|象眼 象嵌|貫録 貫禄|買弁 買辦|賛辞 讚辭|踏襲 蹈襲|車両 車輛|転倒 顛倒|輪郭 輪廓|退色 褪色|途絶 杜絶|連係 連繫|連合 聯合|選考 銓衡|酢酸 醋酸|野卑 野鄙|鉱石 礦石|間欠 間歇|関数 函數|防御 防禦|険阻 嶮岨|障壁 牆壁|障害 障礙|隠滅 湮滅|集落 聚落|雇用 雇傭|風諭 諷喩|飛語 蜚語|香典 香奠|骨格 骨骼|高進 亢進|鳥観 鳥瞰";
  const JPShinjitaiCharacters = "両 兩|弁 辨|欠 缺|浜 濱|糸 絲|芸 藝";
  const JPVariantsRev = "万 萬|与 與|両 兩|乗 乘|乱 亂|亀 龜|予 豫|争 爭|亘 亙|亜 亞|仏 佛|仮 假|会 會|伝 傳|体 體|余 餘|価 價|倹 儉|偽 僞|兎 兔|児 兒|党 黨|内 內|円 圓|写 寫|処 處|刹 剎|剣 劍|剤 劑|剰 剩|励 勵|労 勞|効 效|勅 敕|勧 勸|勲 勳|匀 勻|区 區|医 醫|単 單|却 卻|厠 廁|厳 嚴|参 參|双 雙|収 收|叙 敘|台 臺|号 號|呉 吳|呪 咒|唇 脣|唖 啞|営 營|嘘 噓|嘱 囑|噛 嚙|団 團|囲 圍|図 圖|国 國|圏 圈|圧 壓|堕 墮|塁 壘|塩 鹽|増 增|壊 壞|壌 壤|壮 壯|声 聲|壱 壹|売 賣|変 變|奥 奧|奨 獎|嬢 孃|学 學|宝 寶|実 實|寛 寬|寝 寢|対 對|寿 壽|専 專|将 將|尽 盡|届 屆|属 屬|岳 嶽|峡 峽|峰 峯|巌 巖|巣 巢|巻 卷|帯 帶|帰 歸|庁 廳|広 廣|庄 莊|床 牀|廃 廢|弁 瓣|弐 貳|弥 彌|弯 彎|弾 彈|当 當|彦 彥|径 徑|従 從|御 禦|徳 德|徴 徵|応 應|恋 戀|恒 恆|恵 惠|悦 悅|悩 惱|悪 惡|惨 慘|懐 懷|戦 戰|戯 戲|戸 戶|戻 戾|才 纔|払 拂|抜 拔|択 擇|担 擔|拝 拜|拠 據|拡 擴|挙 舉|挟 挾|挿 插|捜 搜|掲 揭|掴 摑|掻 搔|揺 搖|摂 攝|撃 擊|撹 攪|数 數|斉 齊|斎 齋|断 斷|旧 舊|昼 晝|晋 晉|晩 晚|暁 曉|暦 曆|曁 暨|曽 曾|条 條|来 來|枢 樞|査 查|栄 榮|桜 櫻|桝 枡|桟 棧|検 檢|楡 榆|楼 樓|楽 樂|様 樣|権 權|横 橫|欠 缺|欧 歐|歓 歡|歩 步|歯 齒|歳 歲|歴 歷|残 殘|殴 毆|殻 殼|毎 每|気 氣|氷 冰|汚 污|没 沒|沢 澤|沪 濾|浄 淨|浅 淺|浜 濱|涙 淚|涛 濤|渇 渴|済 濟|渉 涉|渋 澀|渓 溪|温 溫|湾 灣|湿 溼|満 滿|溌 潑|滝 瀧|滞 滯|潜 潛|瀬 瀨|灯 燈|炉 爐|点 點|為 爲|焔 焰|焼 燒|煙 菸|犠 犧|状 狀|独 獨|狭 狹|猟 獵|猫 貓|献 獻|獣 獸|産 產|画 畫|畳 疊|疏 疎|痩 瘦|痴 癡|痺 痹|発 發|皐 皋|盗 盜|県 縣|砕 碎|砺 礪|礼 禮|祷 禱|禄 祿|禅 禪|秘 祕|称 稱|税 稅|稜 棱|稲 稻|穂 穗|穏 穩|穣 穰|窃 竊|竃 竈|竜 龍|粋 粹|粛 肅|粧 妝|粽 糉|糸 絲|経 經|絵 繪|絶 絕|継 繼|続 續|総 總|緑 綠|緒 緖|縁 緣|縄 繩|縦 縱|繊 纖|繋 繫|繍 繡|缶 罐|群 羣|聡 聰|聴 聽|胆 膽|脚 腳|脱 脫|脳 腦|臓 臟|舎 舍|舗 鋪|芦 蘆|芸 藝|茎 莖|茘 荔|荘 莊|莱 萊|葱 蔥|蒋 蔣|蔵 藏|薫 薰|薬 藥|虚 虛|虫 蟲|蚕 蠶|蛍 螢|蛮 蠻|蝋 蠟|装 裝|覇 霸|覚 覺|覧 覽|観 觀|触 觸|訳 譯|証 證|誉 譽|説 說|読 讀|謡 謠|譲 讓|豊 豐|賛 贊|贋 贗|践 踐|転 轉|軽 輕|輌 輛|辞 辭|辺 邊|逓 遞|連 聯|遅 遲|遙 遥|郷 鄉|酔 醉|醋 酢|醗 醱|醤 醬|醸 釀|釈 釋|鉄 鐵|鉱 鑛|銭 錢|鋳 鑄|錬 鍊|録 錄|関 關|閲 閱|闘 鬥|陥 陷|険 險|随 隨|隠 隱|雑 雜|霊 靈|静 靜|頴 穎|頼 賴|顔 顏|顕 顯|駅 驛|駆 驅|騒 騷|験 驗|髄 髓|髪 髮|鴎 鷗|鶏 雞|鹸 鹼|麦 麥|麹 麴|麺 麪|黄 黃|黒 黑|黙 默|鼈 鱉|齢 齡";
  const from_jp = [[JPShinjitaiPhrases, JPShinjitaiCharacters, JPVariantsRev]];
  const dict_TSPhrases = "一目瞭然 一目了然|上鍊 上链|不瞭解 不了解|么麼 幺麽|么麽 幺麽|乾乾淨淨 干干净净|乾乾脆脆 干干脆脆|乾佑縣 乾佑县|乾元 乾元|乾卦 乾卦|乾嘉 乾嘉|乾圖 乾图|乾坤 乾坤|乾坤一擲 乾坤一掷|乾坤再造 乾坤再造|乾坤大挪移 乾坤大挪移|乾宅 乾宅|乾安縣 乾安县|乾安鎮 乾安镇|乾州 乾州|乾斷 乾断|乾旦 乾旦|乾曜 乾曜|乾清宮 乾清宫|乾盛世 乾盛世|乾紅 乾红|乾綱 乾纲|乾縣 乾县|乾象 乾象|乾造 乾造|乾道 乾道|乾陵 乾陵|乾隆 乾隆|乾隆年間 乾隆年间|乾隆皇帝 乾隆皇帝|二噁英 二𫫇英|以免藉口 以免借口|以功覆過 以功复过|侔德覆載 侔德复载|傢俱 家具|傷亡枕藉 伤亡枕藉|八濛山 八濛山|凌藉 凌借|出醜狼藉 出丑狼藉|函覆 函复|千鍾粟 千锺粟|反反覆覆 反反复复|反覆 反复|反覆思維 反复思维|反覆思量 反复思量|反覆性 反复性|名覆金甌 名复金瓯|哪吒 哪吒|回覆 回复|壺裏乾坤 壶里乾坤|大目乾連冥間救母變文 大目乾连冥间救母变文|宫商角徵羽 宫商角徵羽|尼乾子 尼乾子|尼乾陀 尼乾陀|幺麼 幺麽|幺麼小丑 幺麽小丑|幺麼小醜 幺麽小丑|康乾 康乾|張法乾 张法乾|彷彿 仿佛|彷徨 彷徨|徵弦 徵弦|徵絃 徵弦|徵羽摩柯 徵羽摩柯|徵聲 徵声|徵調 徵调|徵音 徵音|情有獨鍾 情有独钟|憑藉 凭借|憑藉着 凭借着|手鍊 手链|扭轉乾坤 扭转乾坤|找藉口 找借口|拉鍊 拉链|拉鍊工程 拉链工程|拜覆 拜复|據瞭解 据了解|文錦覆阱 文锦复阱|於世成 於世成|於乎 於乎|於仲完 於仲完|於倫 於伦|於其一 於其一|於則 於则|於勇明 於勇明|於呼哀哉 於呼哀哉|於單 於单|於坦 於坦|於崇文 於崇文|於忠祥 於忠祥|於惟一 於惟一|於戲 於戏|於敖 於敖|於梨華 於梨华|於清言 於清言|於潛 於潜|於琳 於琳|於穆 於穆|於竹屋 於竹屋|於菟 於菟|於邑 於邑|於陵子 於陵子|旋乾轉坤 旋乾转坤|旋轉乾坤 旋转乾坤|旋轉乾坤之力 旋转乾坤之力|明瞭 明了|明覆 明复|書中自有千鍾粟 书中自有千锺粟|有序 有序|朝乾夕惕 朝乾夕惕|木吒 木吒|李乾德 李乾德|李澤鉅 李泽钜|李鍊福 李链福|李鍾郁 李锺郁|樊於期 樊於期|沈沒 沉没|沈沒成本 沉没成本|沈積 沉积|沈船 沉船|沈默 沉默|流徵 流徵|浪蕩乾坤 浪荡乾坤|滑藉 滑借|無序 无序|牴牾 抵牾|牴觸 抵触|狐藉虎威 狐借虎威|珍珠項鍊 珍珠项链|甚鉅 甚钜|申覆 申复|畢昇 毕昇|發覆 发复|瞭如 了如|瞭如指掌 了如指掌|瞭望 瞭望|瞭然 了然|瞭然於心 了然于心|瞭若指掌 了若指掌|瞭解 了解|瞭解到 了解到|示覆 示复|神祇 神祇|稟覆 禀复|竺乾 竺乾|答覆 答复|篤麼 笃麽|簡單明瞭 简单明了|籌畫 筹划|素藉 素借|老態龍鍾 老态龙钟|肘手鍊足 肘手链足|茵藉 茵借|萬鍾 万锺|蒜薹 蒜薹|蕓薹 芸薹|蕩覆 荡复|蕭乾 萧乾|藉代 借代|藉以 借以|藉助 借助|藉助於 借助于|藉卉 借卉|藉口 借口|藉喻 借喻|藉寇兵 借寇兵|藉寇兵齎盜糧 借寇兵赍盗粮|藉手 借手|藉據 借据|藉故 借故|藉故推辭 借故推辞|藉方 借方|藉條 借条|藉槁 借槁|藉機 借机|藉此 借此|藉此機會 借此机会|藉甚 借甚|藉由 借由|藉着 借着|藉端 借端|藉端生事 借端生事|藉箸代籌 借箸代筹|藉草枕塊 借草枕块|藉藉 藉藉|藉藉无名 藉藉无名|藉詞 借词|藉讀 借读|藉資 借资|衹得 只得|衹見樹木 只见树木|衹見樹木不見森林 只见树木不见森林|袖裏乾坤 袖里乾坤|覆上 复上|覆住 复住|覆信 复信|覆冒 复冒|覆呈 复呈|覆命 复命|覆墓 复墓|覆宗 复宗|覆帳 复帐|覆幬 复帱|覆成 复成|覆按 复按|覆文 复文|覆杯 复杯|覆校 复校|覆瓿 复瓿|覆盂 复盂|覆盆 覆盆|覆盆子 覆盆子|覆盤 覆盘|覆育 复育|覆蕉尋鹿 复蕉寻鹿|覆逆 复逆|覆醢 复醢|覆醬瓿 复酱瓿|覆電 复电|覆露 复露|覆鹿尋蕉 复鹿寻蕉|覆鹿遺蕉 复鹿遗蕉|覆鼎 复鼎|見覆 见复|角徵 角徵|角徵羽 角徵羽|計畫 计划|變徵 变徵|變徵之聲 变徵之声|變徵之音 变徵之音|貂覆額 貂复额|買臣覆水 买臣复水|踅門瞭戶 踅门了户|躪藉 躏借|郭子乾 郭子乾|酒逢知己千鍾少 酒逢知己千锺少|酒逢知己千鍾少話不投機半句多 酒逢知己千锺少话不投机半句多|醞藉 酝借|重覆 重复|金吒 金吒|金鍊 金链|鈞覆 钧复|鉅子 钜子|鉅萬 钜万|鉅防 钜防|鉸鍊 铰链|銀鍊 银链|錢鍾書 钱锺书|鍊墜 链坠|鍊子 链子|鍊形 链形|鍊條 链条|鍊錘 链锤|鍊鎖 链锁|鍛鍾 锻锺|鍾繇 钟繇|鍾萬梅 锺万梅|鍾重發 锺重发|鍾鍛 锺锻|鍾馗 锺馗|鎖鍊 锁链|鐵鍊 铁链|鑽石項鍊 钻石项链|雁杳魚沈 雁杳鱼沉|雖覆能復 虽覆能复|電覆 电复|露覆 露复|項鍊 项链|頗覆 颇复|頸鍊 颈链|顛乾倒坤 颠乾倒坤|顛倒乾坤 颠倒乾坤|顧藉 顾借|麼些族 麽些族|黄鍾公 黄锺公|龍鍾 龙钟";
  const dict_TSCharacters = "㑮 𫝈|㑯 㑔|㑳 㑇|㑶 㐹|㒓 𠉂|㓄 𪠟|㓨 刾|㔋 𪟎|㖮 𪠵|㗲 𠵾|㗿 𪡛|㘉 𠰱|㘓 𪢌|㘔 𫬐|㘚 㘎|㛝 𫝦|㜄 㚯|㜏 㛣|㜐 𫝧|㜗 𡞋|㜢 𡞱|㜷 𡝠|㞞 𪨊|㟺 𪩇|㠏 㟆|㠣 𫵷|㢗 𪪑|㢝 𢋈|㥮 㤘|㦎 𢛯|㦛 𢗓|㦞 𪫷|㨻 𪮃|㩋 𪮋|㩜 㨫|㩳 㧐|㩵 擜|㪎 𪯋|㯤 𣘐|㰙 𣗙|㵗 𣳆|㵾 𪷍|㶆 𫞛|㷍 𤆢|㷿 𤈷|㸇 𤎺|㹽 𫞣|㺏 𤠋|㺜 𪺻|㻶 𪼋|㿖 𪽮|㿗 𤻊|㿧 𤽯|䀉 𥁢|䀹 𥅴|䁪 𥇢|䁻 䀥|䂎 𥎝|䃮 鿎|䅐 𫀨|䅳 𫀬|䆉 𫁂|䉑 𫁲|䉙 𥬀|䉬 𫂈|䉲 𥮜|䉶 𫁷|䊭 𥺅|䊷 䌶|䊺 𫄚|䋃 𫄜|䋔 𫄞|䋙 䌺|䋚 䌻|䋦 𫄩|䋹 䌿|䋻 䌾|䋼 𫄮|䋿 𦈓|䌈 𦈖|䌋 𦈘|䌖 𦈜|䌝 𦈟|䌟 𦈞|䌥 𦈠|䌰 𦈙|䍤 𫅅|䍦 䍠|䍽 𦍠|䎙 𫅭|䎱 䎬|䓣 𬜯|䕤 𫟕|䕳 𦰴|䖅 𫟑|䗅 𫊪|䗿 𧉞|䙔 𫋲|䙡 䙌|䙱 𧜭|䚩 𫌯|䛄 𫍠|䛳 𫍫|䜀 䜧|䜖 𫟢|䝭 𫎧|䝻 𧹕|䝼 䞍|䞈 𧹑|䞋 𫎪|䞓 𫎭|䟃 𫎺|䟆 𫎳|䟐 𫎱|䠆 𫏃|䠱 𨅛|䡐 𫟤|䡩 𫟥|䡵 𫟦|䢨 𨑹|䤤 𫟺|䥄 𫠀|䥇 䦂|䥑 鿏|䥕 𬭯|䥗 𫔋|䥩 𨱖|䥯 𫔆|䥱 䥾|䦘 𨸄|䦛 䦶|䦟 䦷|䦯 𫔵|䦳 𨷿|䧢 𨸟|䪊 𫖅|䪏 𩏼|䪗 𩐀|䪘 𩏿|䪴 𫖫|䪾 𫖬|䫀 𫖱|䫂 𫖰|䫟 𫖲|䫴 𩖗|䫶 𫖺|䫻 𫗇|䫾 𫠈|䬓 𫗊|䬘 𩙮|䬝 𩙯|䬞 𩙧|䬧 𫗟|䭀 𩠇|䭃 𩠈|䭑 𫗱|䭔 𫗰|䭿 𩧭|䮄 𫠊|䮝 𩧰|䮞 𩨁|䮠 𩧿|䮫 𩨇|䮰 𫘮|䮳 𩨏|䮾 𩧪|䯀 䯅|䯤 𩩈|䰾 鲃|䱀 𫚐|䱁 𫚏|䱙 𩾈|䱧 𫚠|䱬 𩾊|䱰 𩾋|䱷 䲣|䱸 𫠑|䱽 䲝|䲁 鳚|䲅 𫚜|䲖 𩾂|䲘 鳤|䲰 𪉂|䳜 𫛬|䳢 𫛰|䳤 𫛮|䳧 𫛺|䳫 𫛼|䴉 鹮|䴋 𫜅|䴬 𪎈|䴱 𫜒|䴴 𪎋|䴽 𫜔|䵳 𪑅|䵴 𫜙|䶕 𫜨|䶲 𫜳|丟 丢|並 并|乾 干|亂 乱|亙 亘|亞 亚|佇 伫|佈 布|佔 占|併 并|來 来|侖 仑|侶 侣|侷 局|俁 俣|係 系|俓 𠇹|俔 伣|俠 侠|俥 伡|俬 私|倀 伥|倆 俩|倈 俫|倉 仓|個 个|們 们|倖 幸|倫 伦|倲 㑈|偉 伟|偑 㐽|側 侧|偵 侦|偽 伪|傌 㐷|傑 杰|傖 伧|傘 伞|備 备|傢 家|傭 佣|傯 偬|傳 传|傴 伛|債 债|傷 伤|傾 倾|僂 偻|僅 仅|僉 佥|僑 侨|僕 仆|僞 伪|僤 𫢸|僥 侥|僨 偾|僱 雇|價 价|儀 仪|儁 俊|儂 侬|億 亿|儈 侩|儉 俭|儎 傤|儐 傧|儔 俦|儕 侪|儘 尽|償 偿|儣 𠆲|優 优|儭 𠋆|儲 储|儷 俪|儸 㑩|儺 傩|儻 傥|儼 俨|兇 凶|兌 兑|兒 儿|兗 兖|內 内|兩 两|冊 册|冑 胄|冪 幂|凈 净|凍 冻|凙 𪞝|凜 凛|凱 凯|別 别|刪 删|剄 刭|則 则|剋 克|剎 刹|剗 刬|剛 刚|剝 剥|剮 剐|剴 剀|創 创|剷 铲|剾 𠛅|劃 划|劇 剧|劉 刘|劊 刽|劌 刿|劍 剑|劏 㓥|劑 剂|劚 㔉|勁 劲|勑 𠡠|動 动|務 务|勛 勋|勝 胜|勞 劳|勢 势|勣 𪟝|勩 勚|勱 劢|勳 勋|勵 励|勸 劝|勻 匀|匭 匦|匯 汇|匱 匮|區 区|協 协|卹 恤|卻 却|卽 即|厙 厍|厠 厕|厤 历|厭 厌|厲 厉|厴 厣|參 参|叄 叁|叢 丛|吒 咤|吳 吴|吶 呐|呂 吕|咼 呙|員 员|哯 𠯟|唄 呗|唓 𪠳|唸 念|問 问|啓 启|啞 哑|啟 启|啢 唡|喎 㖞|喚 唤|喪 丧|喫 吃|喬 乔|單 单|喲 哟|嗆 呛|嗇 啬|嗊 唝|嗎 吗|嗚 呜|嗩 唢|嗰 𠮶|嗶 哔|嗹 𪡏|嘆 叹|嘍 喽|嘓 啯|嘔 呕|嘖 啧|嘗 尝|嘜 唛|嘩 哗|嘪 𪡃|嘮 唠|嘯 啸|嘰 叽|嘳 𪡞|嘵 哓|嘸 呒|嘺 𪡀|嘽 啴|噁 恶|噅 𠯠|噓 嘘|噚 㖊|噝 咝|噞 𪡋|噠 哒|噥 哝|噦 哕|噯 嗳|噲 哙|噴 喷|噸 吨|噹 当|嚀 咛|嚇 吓|嚌 哜|嚐 尝|嚕 噜|嚙 啮|嚛 𪠸|嚥 咽|嚦 呖|嚧 𠰷|嚨 咙|嚮 向|嚲 亸|嚳 喾|嚴 严|嚶 嘤|嚽 𪢕|囀 啭|囁 嗫|囂 嚣|囃 𠱞|囅 冁|囈 呓|囉 啰|囌 苏|囑 嘱|囒 𪢠|囪 囱|圇 囵|國 国|圍 围|園 园|圓 圆|圖 图|團 团|圞 𪢮|垻 坝|埡 垭|埨 𫭢|埬 𪣆|埰 采|執 执|堅 坚|堊 垩|堖 垴|堚 𪣒|堝 埚|堯 尧|報 报|場 场|塊 块|塋 茔|塏 垲|塒 埘|塗 涂|塚 冢|塢 坞|塤 埙|塵 尘|塸 𫭟|塹 堑|塿 𪣻|墊 垫|墜 坠|墠 𫮃|墮 堕|墰 坛|墲 𪢸|墳 坟|墶 垯|墻 墙|墾 垦|壇 坛|壈 𡒄|壋 垱|壎 埙|壓 压|壗 𡋤|壘 垒|壙 圹|壚 垆|壜 坛|壞 坏|壟 垄|壠 垅|壢 坜|壣 𪤚|壩 坝|壪 塆|壯 壮|壺 壶|壼 壸|壽 寿|夠 够|夢 梦|夥 伙|夾 夹|奐 奂|奧 奥|奩 奁|奪 夺|奬 奖|奮 奋|奼 姹|妝 妆|姍 姗|姦 奸|娙 𫰛|娛 娱|婁 娄|婡 𫝫|婦 妇|婭 娅|媈 𫝨|媧 娲|媯 妫|媰 㛀|媼 媪|媽 妈|嫋 袅|嫗 妪|嫵 妩|嫺 娴|嫻 娴|嫿 婳|嬀 妫|嬃 媭|嬇 𫝬|嬈 娆|嬋 婵|嬌 娇|嬙 嫱|嬡 嫒|嬣 𪥰|嬤 嬷|嬦 𫝩|嬪 嫔|嬰 婴|嬸 婶|嬻 𪥿|孃 娘|孄 𫝮|孆 𫝭|孇 𪥫|孋 㛤|孌 娈|孎 𡠟|孫 孙|學 学|孻 𡥧|孾 𪧀|孿 孪|宮 宫|寀 采|寠 𪧘|寢 寝|實 实|寧 宁|審 审|寫 写|寬 宽|寵 宠|寶 宝|將 将|專 专|尋 寻|對 对|導 导|尷 尴|屆 届|屍 尸|屓 屃|屜 屉|屢 屡|層 层|屨 屦|屩 𪨗|屬 属|岡 冈|峯 峰|峴 岘|島 岛|峽 峡|崍 崃|崑 昆|崗 岗|崙 仑|崢 峥|崬 岽|嵐 岚|嵗 岁|嵼 𡶴|嵽 𫶇|嵾 㟥|嶁 嵝|嶄 崭|嶇 岖|嶈 𡺃|嶔 嵚|嶗 崂|嶘 𡺄|嶠 峤|嶢 峣|嶧 峄|嶨 峃|嶮 崄|嶸 嵘|嶹 𫝵|嶺 岭|嶼 屿|嶽 岳|巊 𪩎|巋 岿|巒 峦|巔 巅|巖 岩|巗 𪨷|巘 𪩘|巰 巯|巹 卺|帥 帅|師 师|帳 帐|帶 带|幀 帧|幃 帏|幓 㡎|幗 帼|幘 帻|幝 𪩷|幟 帜|幣 币|幩 𪩸|幫 帮|幬 帱|幹 干|幾 几|庫 库|廁 厕|廂 厢|廄 厩|廈 厦|廎 庼|廕 荫|廚 厨|廝 厮|廞 𫷷|廟 庙|廠 厂|廡 庑|廢 废|廣 广|廧 𪪞|廩 廪|廬 庐|廳 厅|弒 弑|弔 吊|弳 弪|張 张|強 强|彃 𪪼|彄 𫸩|彆 别|彈 弹|彌 弥|彎 弯|彔 录|彙 汇|彠 彟|彥 彦|彫 雕|彲 彨|彿 佛|後 后|徑 径|從 从|徠 徕|復 复|徵 征|徹 彻|徿 𪫌|恆 恒|恥 耻|悅 悦|悞 悮|悵 怅|悶 闷|悽 凄|惡 恶|惱 恼|惲 恽|惻 恻|愛 爱|愜 惬|愨 悫|愴 怆|愷 恺|愻 𢙏|愾 忾|慄 栗|態 态|慍 愠|慘 惨|慚 惭|慟 恸|慣 惯|慤 悫|慪 怄|慫 怂|慮 虑|慳 悭|慶 庆|慺 㥪|慼 戚|慾 欲|憂 忧|憊 惫|憐 怜|憑 凭|憒 愦|憖 慭|憚 惮|憢 𢙒|憤 愤|憫 悯|憮 怃|憲 宪|憶 忆|憸 𪫺|憹 𢙐|懀 𢙓|懇 恳|應 应|懌 怿|懍 懔|懎 𢠁|懞 蒙|懟 怼|懣 懑|懤 㤽|懨 恹|懲 惩|懶 懒|懷 怀|懸 悬|懺 忏|懼 惧|懾 慑|戀 恋|戇 戆|戔 戋|戧 戗|戩 戬|戰 战|戱 戯|戲 戏|戶 户|拋 抛|挩 捝|挱 挲|挾 挟|捨 舍|捫 扪|捱 挨|捲 卷|掃 扫|掄 抡|掆 㧏|掗 挜|掙 挣|掚 𪭵|掛 挂|採 采|揀 拣|揚 扬|換 换|揮 挥|揯 搄|損 损|搖 摇|搗 捣|搵 揾|搶 抢|摋 𢫬|摐 𪭢|摑 掴|摜 掼|摟 搂|摯 挚|摳 抠|摶 抟|摺 折|摻 掺|撈 捞|撊 𪭾|撏 挦|撐 撑|撓 挠|撝 㧑|撟 挢|撣 掸|撥 拨|撧 𪮖|撫 抚|撲 扑|撳 揿|撻 挞|撾 挝|撿 捡|擁 拥|擄 掳|擇 择|擊 击|擋 挡|擓 㧟|擔 担|據 据|擟 𪭧|擠 挤|擣 捣|擫 𢬍|擬 拟|擯 摈|擰 拧|擱 搁|擲 掷|擴 扩|擷 撷|擺 摆|擻 擞|擼 撸|擽 㧰|擾 扰|攄 摅|攆 撵|攋 𪮶|攏 拢|攔 拦|攖 撄|攙 搀|攛 撺|攜 携|攝 摄|攢 攒|攣 挛|攤 摊|攪 搅|攬 揽|敎 教|敓 敚|敗 败|敘 叙|敵 敌|數 数|斂 敛|斃 毙|斅 𢽾|斆 敩|斕 斓|斬 斩|斷 断|斸 𣃁|於 于|旂 旗|旣 既|昇 升|時 时|晉 晋|晛 𬀪|晝 昼|暈 晕|暉 晖|暐 𬀩|暘 旸|暢 畅|暫 暂|曄 晔|曆 历|曇 昙|曉 晓|曊 𪰶|曏 向|曖 暧|曠 旷|曥 𣆐|曨 昽|曬 晒|書 书|會 会|朥 𦛨|朧 胧|朮 术|東 东|枴 拐|柵 栅|柺 拐|査 查|桱 𣐕|桿 杆|梔 栀|梖 𪱷|梘 枧|梜 𬂩|條 条|梟 枭|梲 棁|棄 弃|棊 棋|棖 枨|棗 枣|棟 栋|棡 㭎|棧 栈|棲 栖|棶 梾|椏 桠|椲 㭏|楇 𣒌|楊 杨|楓 枫|楨 桢|業 业|極 极|榘 矩|榦 干|榪 杩|榮 荣|榲 榅|榿 桤|構 构|槍 枪|槓 杠|槤 梿|槧 椠|槨 椁|槫 𣏢|槮 椮|槳 桨|槶 椢|槼 椝|樁 桩|樂 乐|樅 枞|樑 梁|樓 楼|標 标|樞 枢|樠 𣗊|樢 㭤|樣 样|樤 𣔌|樧 榝|樫 㭴|樳 桪|樸 朴|樹 树|樺 桦|樿 椫|橈 桡|橋 桥|機 机|橢 椭|橫 横|橯 𣓿|檁 檩|檉 柽|檔 档|檜 桧|檟 槚|檢 检|檣 樯|檭 𣘴|檮 梼|檯 台|檳 槟|檵 𪲛|檸 柠|檻 槛|櫃 柜|櫅 𪲎|櫍 𬃊|櫓 橹|櫚 榈|櫛 栉|櫝 椟|櫞 橼|櫟 栎|櫠 𪲮|櫥 橱|櫧 槠|櫨 栌|櫪 枥|櫫 橥|櫬 榇|櫱 蘖|櫳 栊|櫸 榉|櫻 樱|欄 栏|欅 榉|欇 𪳍|權 权|欍 𣐤|欏 椤|欐 𪲔|欑 𪴙|欒 栾|欓 𣗋|欖 榄|欘 𣚚|欞 棂|欽 钦|歎 叹|歐 欧|歟 欤|歡 欢|歲 岁|歷 历|歸 归|歿 殁|殘 残|殞 殒|殢 𣨼|殤 殇|殨 㱮|殫 殚|殭 僵|殮 殓|殯 殡|殰 㱩|殲 歼|殺 杀|殻 壳|殼 壳|毀 毁|毆 殴|毊 𪵑|毿 毵|氂 牦|氈 毡|氌 氇|氣 气|氫 氢|氬 氩|氭 𣱝|氳 氲|氾 泛|汎 泛|汙 污|決 决|沒 没|沖 冲|況 况|泝 溯|洩 泄|洶 汹|浹 浃|浿 𬇙|涇 泾|涗 涚|涼 凉|淒 凄|淚 泪|淥 渌|淨 净|淩 凌|淪 沦|淵 渊|淶 涞|淺 浅|渙 涣|減 减|渢 沨|渦 涡|測 测|渾 浑|湊 凑|湋 𣲗|湞 浈|湧 涌|湯 汤|溈 沩|準 准|溝 沟|溡 𪶄|溫 温|溮 浉|溳 涢|溼 湿|滄 沧|滅 灭|滌 涤|滎 荥|滙 汇|滬 沪|滯 滞|滲 渗|滷 卤|滸 浒|滻 浐|滾 滚|滿 满|漁 渔|漊 溇|漍 𬇹|漚 沤|漢 汉|漣 涟|漬 渍|漲 涨|漵 溆|漸 渐|漿 浆|潁 颍|潑 泼|潔 洁|潕 𣲘|潙 沩|潚 㴋|潛 潜|潣 𫞗|潤 润|潯 浔|潰 溃|潷 滗|潿 涠|澀 涩|澅 𣶩|澆 浇|澇 涝|澐 沄|澗 涧|澠 渑|澤 泽|澦 滪|澩 泶|澫 𬇕|澬 𫞚|澮 浍|澱 淀|澾 㳠|濁 浊|濃 浓|濄 㳡|濆 𣸣|濕 湿|濘 泞|濚 溁|濛 蒙|濜 浕|濟 济|濤 涛|濧 㳔|濫 滥|濰 潍|濱 滨|濺 溅|濼 泺|濾 滤|濿 𪵱|瀂 澛|瀃 𣽷|瀅 滢|瀆 渎|瀇 㲿|瀉 泻|瀋 沈|瀏 浏|瀕 濒|瀘 泸|瀝 沥|瀟 潇|瀠 潆|瀦 潴|瀧 泷|瀨 濑|瀰 弥|瀲 潋|瀾 澜|灃 沣|灄 滠|灍 𫞝|灑 洒|灒 𪷽|灕 漓|灘 滩|灙 𣺼|灝 灏|灡 㳕|灣 湾|灤 滦|灧 滟|灩 滟|災 灾|為 为|烏 乌|烴 烃|無 无|煇 𪸩|煉 炼|煒 炜|煙 烟|煢 茕|煥 焕|煩 烦|煬 炀|煱 㶽|熂 𪸕|熅 煴|熉 𤈶|熌 𤇄|熒 荧|熓 𤆡|熗 炝|熚 𤇹|熡 𤋏|熰 𬉼|熱 热|熲 颎|熾 炽|燀 𬊤|燁 烨|燈 灯|燉 炖|燒 烧|燖 𬊈|燙 烫|燜 焖|營 营|燦 灿|燬 毁|燭 烛|燴 烩|燶 㶶|燻 熏|燼 烬|燾 焘|爃 𫞡|爄 𤇃|爇 𦶟|爍 烁|爐 炉|爖 𤇭|爛 烂|爥 𪹳|爧 𫞠|爭 争|爲 为|爺 爷|爾 尔|牀 床|牆 墙|牘 牍|牽 牵|犖 荦|犛 牦|犞 𪺭|犢 犊|犧 牺|狀 状|狹 狭|狽 狈|猌 𪺽|猙 狰|猶 犹|猻 狲|獁 犸|獃 呆|獄 狱|獅 狮|獊 𪺷|獎 奖|獨 独|獩 𤞃|獪 狯|獫 猃|獮 狝|獰 狞|獱 㺍|獲 获|獵 猎|獷 犷|獸 兽|獺 獭|獻 献|獼 猕|玀 猡|玁 𤞤|珼 𫞥|現 现|琱 雕|琺 珐|琿 珲|瑋 玮|瑒 玚|瑣 琐|瑤 瑶|瑩 莹|瑪 玛|瑲 玱|瑻 𪻲|瑽 𪻐|璉 琏|璊 𫞩|璕 𬍤|璗 𬍡|璝 𪻺|璡 琎|璣 玑|璦 瑷|璫 珰|璯 㻅|環 环|璵 玙|璸 瑸|璼 𫞨|璽 玺|璾 𫞦|璿 璇|瓄 𪻨|瓅 𬍛|瓊 琼|瓏 珑|瓔 璎|瓕 𤦀|瓚 瓒|瓛 𤩽|甌 瓯|甕 瓮|產 产|産 产|甦 苏|甯 宁|畝 亩|畢 毕|畫 画|異 异|畵 画|當 当|畼 𪽈|疇 畴|疊 叠|痙 痉|痠 酸|痮 𪽪|痾 疴|瘂 痖|瘋 疯|瘍 疡|瘓 痪|瘞 瘗|瘡 疮|瘧 疟|瘮 瘆|瘱 𪽷|瘲 疭|瘺 瘘|瘻 瘘|療 疗|癆 痨|癇 痫|癉 瘅|癐 𤶊|癒 愈|癘 疠|癟 瘪|癡 痴|癢 痒|癤 疖|癥 症|癧 疬|癩 癞|癬 癣|癭 瘿|癮 瘾|癰 痈|癱 瘫|癲 癫|發 发|皁 皂|皚 皑|皟 𤾀|皰 疱|皸 皲|皺 皱|盃 杯|盜 盗|盞 盏|盡 尽|監 监|盤 盘|盧 卢|盨 𪾔|盪 荡|眝 𪾣|眞 真|眥 眦|眾 众|睍 𪾢|睏 困|睜 睁|睞 睐|瞘 眍|瞜 䁖|瞞 瞒|瞤 𥆧|瞶 瞆|瞼 睑|矇 蒙|矉 𪾸|矑 𪾦|矓 眬|矚 瞩|矯 矫|硃 朱|硜 硁|硤 硖|硨 砗|硯 砚|碕 埼|碙 𥐻|碩 硕|碭 砀|碸 砜|確 确|碼 码|碽 䂵|磑 硙|磚 砖|磠 硵|磣 碜|磧 碛|磯 矶|磽 硗|磾 䃅|礄 硚|礆 硷|礎 础|礐 𬒈|礒 𥐟|礙 碍|礦 矿|礪 砺|礫 砾|礬 矾|礮 𪿫|礱 砻|祕 秘|祿 禄|禍 祸|禎 祯|禕 祎|禡 祃|禦 御|禪 禅|禮 礼|禰 祢|禱 祷|禿 秃|秈 籼|稅 税|稈 秆|稏 䅉|稜 棱|稟 禀|種 种|稱 称|穀 谷|穇 䅟|穌 稣|積 积|穎 颖|穠 秾|穡 穑|穢 秽|穩 稳|穫 获|穭 穞|窩 窝|窪 洼|窮 穷|窯 窑|窵 窎|窶 窭|窺 窥|竄 窜|竅 窍|竇 窦|竈 灶|竊 窃|竚 𥩟|竪 竖|竱 𫁟|競 竞|筆 笔|筍 笋|筧 笕|筴 䇲|箇 个|箋 笺|箏 筝|節 节|範 范|築 筑|篋 箧|篔 筼|篘 𥬠|篠 筿|篢 𬕂|篤 笃|篩 筛|篳 筚|篸 𥮾|簀 箦|簂 𫂆|簍 篓|簑 蓑|簞 箪|簡 简|簢 𫂃|簣 篑|簫 箫|簹 筜|簽 签|簾 帘|籃 篮|籅 𥫣|籋 𥬞|籌 筹|籔 䉤|籙 箓|籛 篯|籜 箨|籟 籁|籠 笼|籤 签|籩 笾|籪 簖|籬 篱|籮 箩|籲 吁|粵 粤|糉 粽|糝 糁|糞 粪|糧 粮|糰 团|糲 粝|糴 籴|糶 粜|糹 纟|糺 𫄙|糾 纠|紀 纪|紂 纣|紃 𬘓|約 约|紅 红|紆 纡|紇 纥|紈 纨|紉 纫|紋 纹|納 纳|紐 纽|紓 纾|純 纯|紕 纰|紖 纼|紗 纱|紘 纮|紙 纸|級 级|紛 纷|紜 纭|紝 纴|紞 𬘘|紟 𫄛|紡 纺|紬 䌷|紮 扎|細 细|紱 绂|紲 绁|紳 绅|紵 纻|紹 绍|紺 绀|紼 绋|紿 绐|絀 绌|絁 𫄟|終 终|絃 弦|組 组|絅 䌹|絆 绊|絍 𫟃|絎 绗|結 结|絕 绝|絙 𫄠|絛 绦|絝 绔|絞 绞|絡 络|絢 绚|絥 𫄢|給 给|絧 𫄡|絨 绒|絪 𬘡|絰 绖|統 统|絲 丝|絳 绛|絶 绝|絹 绢|絺 𫄨|綀 𦈌|綁 绑|綃 绡|綄 𬘫|綆 绠|綇 𦈋|綈 绨|綉 绣|綋 𫟄|綌 绤|綎 𬘩|綏 绥|綐 䌼|綑 捆|經 经|綖 𫄧|綜 综|綝 𬘭|綞 缍|綟 𫄫|綠 绿|綡 𫟅|綢 绸|綣 绻|綧 𬘯|綪 𬘬|綫 线|綬 绶|維 维|綯 绹|綰 绾|綱 纲|網 网|綳 绷|綴 缀|綵 彩|綸 纶|綹 绺|綺 绮|綻 绽|綽 绰|綾 绫|綿 绵|緄 绲|緇 缁|緊 紧|緋 绯|緍 𦈏|緑 绿|緒 绪|緓 绬|緔 绱|緗 缃|緘 缄|緙 缂|線 线|緝 缉|緞 缎|緟 𫟆|締 缔|緡 缗|緣 缘|緤 𫄬|緦 缌|編 编|緩 缓|緬 缅|緮 𫄭|緯 纬|緰 𦈕|緱 缑|緲 缈|練 练|緶 缏|緷 𦈉|緸 𦈑|緹 缇|緻 致|緼 缊|縈 萦|縉 缙|縊 缢|縋 缒|縍 𫄰|縎 𦈔|縐 绉|縑 缣|縕 缊|縗 缞|縛 缚|縝 缜|縞 缟|縟 缛|縣 县|縧 绦|縫 缝|縬 𦈚|縭 缡|縮 缩|縯 𬙂|縰 𫄳|縱 纵|縲 缧|縳 䌸|縴 纤|縵 缦|縶 絷|縷 缕|縸 𫄲|縹 缥|縺 𦈐|總 总|績 绩|繂 𫄴|繃 绷|繅 缫|繆 缪|繈 𫄶|繏 𦈝|繐 𰬸|繒 缯|繓 𦈛|織 织|繕 缮|繚 缭|繞 绕|繟 𦈎|繡 绣|繢 缋|繨 𫄤|繩 绳|繪 绘|繫 系|繬 𫄱|繭 茧|繮 缰|繯 缳|繰 缲|繳 缴|繶 𫄷|繷 𫄣|繸 䍁|繹 绎|繻 𦈡|繼 继|繽 缤|繾 缱|繿 䍀|纁 𫄸|纆 𬙊|纇 颣|纈 缬|纊 纩|續 续|纍 累|纏 缠|纓 缨|纔 才|纕 𬙋|纖 纤|纗 𫄹|纘 缵|纚 𫄥|纜 缆|缽 钵|罃 䓨|罈 坛|罌 罂|罎 坛|罰 罚|罵 骂|罷 罢|羅 罗|羆 罴|羈 羁|羋 芈|羣 群|羥 羟|羨 羡|義 义|羵 𫅗|羶 膻|習 习|翫 玩|翬 翚|翹 翘|翽 翙|耬 耧|耮 耢|聖 圣|聞 闻|聯 联|聰 聪|聲 声|聳 耸|聵 聩|聶 聂|職 职|聹 聍|聻 𫆏|聽 听|聾 聋|肅 肃|脅 胁|脈 脉|脛 胫|脣 唇|脥 𣍰|脩 修|脫 脱|脹 胀|腎 肾|腖 胨|腡 脶|腦 脑|腪 𣍯|腫 肿|腳 脚|腸 肠|膃 腽|膕 腘|膚 肤|膞 䏝|膠 胶|膢 𦝼|膩 腻|膹 𪱥|膽 胆|膾 脍|膿 脓|臉 脸|臍 脐|臏 膑|臗 𣎑|臘 腊|臚 胪|臟 脏|臠 脔|臢 臜|臥 卧|臨 临|臺 台|與 与|興 兴|舉 举|舊 旧|舘 馆|艙 舱|艣 𫇛|艤 舣|艦 舰|艫 舻|艱 艰|艷 艳|芻 刍|苧 苎|茲 兹|荊 荆|莊 庄|莖 茎|莢 荚|莧 苋|菕 𰰨|華 华|菴 庵|菸 烟|萇 苌|萊 莱|萬 万|萴 荝|萵 莴|葉 叶|葒 荭|葝 𫈎|葤 荮|葦 苇|葯 药|葷 荤|蒍 𫇭|蒐 搜|蒓 莼|蒔 莳|蒕 蒀|蒞 莅|蒭 𫇴|蒼 苍|蓀 荪|蓆 席|蓋 盖|蓧 𦰏|蓮 莲|蓯 苁|蓴 莼|蓽 荜|蔄 𬜬|蔔 卜|蔘 参|蔞 蒌|蔣 蒋|蔥 葱|蔦 茑|蔭 荫|蔯 𫈟|蔿 𫇭|蕁 荨|蕆 蒇|蕎 荞|蕒 荬|蕓 芸|蕕 莸|蕘 荛|蕝 𫈵|蕢 蒉|蕩 荡|蕪 芜|蕭 萧|蕳 𫈉|蕷 蓣|蕽 𫇽|薀 蕰|薆 𫉁|薈 荟|薊 蓟|薌 芗|薑 姜|薔 蔷|薘 荙|薟 莶|薦 荐|薩 萨|薳 䓕|薴 苧|薵 䓓|薹 苔|薺 荠|藍 蓝|藎 荩|藝 艺|藥 药|藪 薮|藭 䓖|藴 蕴|藶 苈|藷 𫉄|藹 蔼|藺 蔺|蘀 萚|蘄 蕲|蘆 芦|蘇 苏|蘊 蕴|蘋 苹|蘚 藓|蘞 蔹|蘟 𦻕|蘢 茏|蘭 兰|蘺 蓠|蘿 萝|虆 蔂|虉 𬟁|處 处|虛 虚|虜 虏|號 号|虧 亏|虯 虬|蛺 蛱|蛻 蜕|蜆 蚬|蝀 𬟽|蝕 蚀|蝟 猬|蝦 虾|蝨 虱|蝸 蜗|螄 蛳|螞 蚂|螢 萤|螮 䗖|螻 蝼|螿 螀|蟂 𫋇|蟄 蛰|蟈 蝈|蟎 螨|蟘 𫋌|蟜 𫊸|蟣 虮|蟬 蝉|蟯 蛲|蟲 虫|蟳 𫊻|蟶 蛏|蟻 蚁|蠀 𧏗|蠁 蚃|蠅 蝇|蠆 虿|蠍 蝎|蠐 蛴|蠑 蝾|蠔 蚝|蠙 𧏖|蠟 蜡|蠣 蛎|蠦 𫊮|蠨 蟏|蠱 蛊|蠶 蚕|蠻 蛮|蠾 𧑏|衆 众|衊 蔑|術 术|衕 同|衚 胡|衛 卫|衝 冲|袞 衮|裊 袅|裏 里|補 补|裝 装|裡 里|製 制|複 复|褌 裈|褘 袆|褲 裤|褳 裢|褸 褛|褻 亵|襀 𫌀|襇 裥|襉 裥|襏 袯|襓 𫋹|襖 袄|襗 𫋷|襘 𫋻|襝 裣|襠 裆|襤 褴|襪 袜|襬 摆|襯 衬|襰 𧝝|襲 袭|襴 襕|襵 𫌇|覈 核|見 见|覎 觃|規 规|覓 觅|視 视|覘 觇|覛 𫌪|覡 觋|覥 觍|覦 觎|親 亲|覬 觊|覯 觏|覲 觐|覷 觑|覹 𫌭|覺 觉|覼 𫌨|覽 览|覿 觌|觀 观|觴 觞|觶 觯|觸 触|訁 讠|訂 订|訃 讣|計 计|訊 讯|訌 讧|討 讨|訏 𬣙|訐 讦|訑 𫍙|訒 讱|訓 训|訕 讪|訖 讫|託 托|記 记|訛 讹|訜 𫍛|訝 讶|訞 𫍚|訟 讼|訢 䜣|訣 诀|訥 讷|訨 𫟞|訩 讻|訪 访|設 设|許 许|訴 诉|訶 诃|診 诊|註 注|証 证|詀 𧮪|詁 诂|詆 诋|詊 𫟟|詎 讵|詐 诈|詑 𫍡|詒 诒|詓 𫍜|詔 诏|評 评|詖 诐|詗 诇|詘 诎|詛 诅|詝 𬣞|詞 词|詠 咏|詡 诩|詢 询|詣 诣|試 试|詩 诗|詪 𬣳|詫 诧|詬 诟|詭 诡|詮 诠|詰 诘|話 话|該 该|詳 详|詵 诜|詷 𫍣|詼 诙|詿 诖|誂 𫍥|誄 诔|誅 诛|誆 诓|誇 夸|誋 𫍪|誌 志|認 认|誑 诳|誒 诶|誕 诞|誘 诱|誚 诮|語 语|誠 诚|誡 诫|誣 诬|誤 误|誥 诰|誦 诵|誨 诲|說 说|誫 𫍨|説 说|誰 谁|課 课|誳 𫍮|誴 𫟡|誶 谇|誷 𫍬|誹 诽|誺 𫍧|誼 谊|誾 訚|調 调|諂 谄|諄 谆|談 谈|諉 诿|請 请|諍 诤|諏 诹|諑 诼|諒 谅|諓 𬣡|論 论|諗 谂|諛 谀|諜 谍|諝 谞|諞 谝|諟 𬤊|諡 谥|諢 诨|諣 𫍩|諤 谔|諥 𫍳|諦 谛|諧 谐|諫 谏|諭 谕|諮 咨|諯 𫍱|諰 𫍰|諱 讳|諲 𬤇|諳 谙|諴 𫍯|諶 谌|諷 讽|諸 诸|諺 谚|諼 谖|諾 诺|謀 谋|謁 谒|謂 谓|謄 誊|謅 诌|謆 𫍸|謉 𫍷|謊 谎|謎 谜|謏 𫍲|謐 谧|謔 谑|謖 谡|謗 谤|謙 谦|謚 谥|講 讲|謝 谢|謠 谣|謡 谣|謨 谟|謫 谪|謬 谬|謭 谫|謯 𫍹|謱 𫍴|謳 讴|謸 𫍵|謹 谨|謾 谩|譁 哗|譂 𫟠|譅 𰶎|譆 𫍻|證 证|譊 𫍢|譎 谲|譏 讥|譑 𫍤|譓 𬤝|譖 谮|識 识|譙 谯|譚 谭|譜 谱|譞 𫍽|譟 噪|譨 𫍦|譫 谵|譭 毁|譯 译|議 议|譴 谴|護 护|譸 诪|譽 誉|譾 谫|讀 读|讅 谉|變 变|讋 詟|讌 䜩|讎 雠|讒 谗|讓 让|讕 谰|讖 谶|讚 赞|讜 谠|讞 谳|豈 岂|豎 竖|豐 丰|豔 艳|豬 猪|豵 𫎆|豶 豮|貓 猫|貗 𫎌|貙 䝙|貝 贝|貞 贞|貟 贠|負 负|財 财|貢 贡|貧 贫|貨 货|販 贩|貪 贪|貫 贯|責 责|貯 贮|貰 贳|貲 赀|貳 贰|貴 贵|貶 贬|買 买|貸 贷|貺 贶|費 费|貼 贴|貽 贻|貿 贸|賀 贺|賁 贲|賂 赂|賃 赁|賄 贿|賅 赅|資 资|賈 贾|賊 贼|賑 赈|賒 赊|賓 宾|賕 赇|賙 赒|賚 赉|賜 赐|賝 𫎩|賞 赏|賟 𧹖|賠 赔|賡 赓|賢 贤|賣 卖|賤 贱|賦 赋|賧 赕|質 质|賫 赍|賬 账|賭 赌|賰 䞐|賴 赖|賵 赗|賺 赚|賻 赙|購 购|賽 赛|賾 赜|贃 𧹗|贄 贽|贅 赘|贇 赟|贈 赠|贉 𫎫|贊 赞|贋 赝|贍 赡|贏 赢|贐 赆|贑 𫎬|贓 赃|贔 赑|贖 赎|贗 赝|贚 𫎦|贛 赣|贜 赃|赬 赪|趕 赶|趙 赵|趨 趋|趲 趱|跡 迹|踐 践|踰 逾|踴 踊|蹌 跄|蹔 𫏐|蹕 跸|蹟 迹|蹠 跖|蹣 蹒|蹤 踪|蹳 𫏆|蹺 跷|蹻 𫏋|躂 跶|躉 趸|躊 踌|躋 跻|躍 跃|躎 䟢|躑 踯|躒 跞|躓 踬|躕 蹰|躘 𨀁|躚 跹|躝 𨅬|躡 蹑|躥 蹿|躦 躜|躪 躏|軀 躯|軉 𨉗|車 车|軋 轧|軌 轨|軍 军|軏 𫐄|軑 轪|軒 轩|軔 轫|軕 𫐅|軗 𨐅|軛 轭|軜 𫐇|軝 𬨂|軟 软|軤 轷|軨 𫐉|軫 轸|軬 𫐊|軲 轱|軷 𫐈|軸 轴|軹 轵|軺 轺|軻 轲|軼 轶|軾 轼|軿 𫐌|較 较|輄 𨐈|輅 辂|輇 辁|輈 辀|載 载|輊 轾|輋 𪨶|輒 辄|輓 挽|輔 辅|輕 轻|輖 𫐏|輗 𫐐|輛 辆|輜 辎|輝 辉|輞 辋|輟 辍|輢 𫐎|輥 辊|輦 辇|輨 𫐑|輩 辈|輪 轮|輬 辌|輮 𫐓|輯 辑|輳 辏|輶 𬨎|輷 𫐒|輸 输|輻 辐|輼 辒|輾 辗|輿 舆|轀 辒|轂 毂|轄 辖|轅 辕|轆 辘|轇 𫐖|轉 转|轊 𫐕|轍 辙|轎 轿|轐 𫐗|轔 辚|轗 𫐘|轟 轰|轠 𫐙|轡 辔|轢 轹|轣 𫐆|轤 轳|辦 办|辭 辞|辮 辫|辯 辩|農 农|迴 回|逕 迳|這 这|連 连|週 周|進 进|遊 游|運 运|過 过|達 达|違 违|遙 遥|遜 逊|遞 递|遠 远|遡 溯|適 适|遱 𫐷|遲 迟|遷 迁|選 选|遺 遗|遼 辽|邁 迈|還 还|邇 迩|邊 边|邏 逻|邐 逦|郟 郏|郵 邮|鄆 郓|鄉 乡|鄒 邹|鄔 邬|鄖 郧|鄟 𫑘|鄧 邓|鄩 𬩽|鄭 郑|鄰 邻|鄲 郸|鄳 𫑡|鄴 邺|鄶 郐|鄺 邝|酇 酂|酈 郦|醃 腌|醖 酝|醜 丑|醞 酝|醟 蒏|醣 糖|醫 医|醬 酱|醱 酦|醲 𬪩|醶 𫑷|釀 酿|釁 衅|釃 酾|釅 酽|釋 释|釐 厘|釒 钅|釓 钆|釔 钇|釕 钌|釗 钊|釘 钉|釙 钋|釚 𫟲|針 针|釟 𫓥|釣 钓|釤 钐|釦 扣|釧 钏|釨 𫓦|釩 钒|釲 𫟳|釳 𨰿|釴 𬬩|釵 钗|釷 钍|釹 钕|釺 钎|釾 䥺|釿 𬬱|鈀 钯|鈁 钫|鈃 钘|鈄 钭|鈅 钥|鈆 𫓪|鈇 𫓧|鈈 钚|鈉 钠|鈋 𨱂|鈍 钝|鈎 钩|鈐 钤|鈑 钣|鈒 钑|鈔 钞|鈕 钮|鈖 𫟴|鈗 𫟵|鈛 𫓨|鈞 钧|鈠 𨱁|鈡 钟|鈣 钙|鈥 钬|鈦 钛|鈧 钪|鈮 铌|鈯 𨱄|鈰 铈|鈲 𨱃|鈳 钶|鈴 铃|鈷 钴|鈸 钹|鈹 铍|鈺 钰|鈽 钸|鈾 铀|鈿 钿|鉀 钾|鉁 𨱅|鉅 巨|鉆 钻|鉈 铊|鉉 铉|鉊 𬬿|鉋 铇|鉍 铋|鉑 铂|鉔 𫓬|鉕 钷|鉗 钳|鉚 铆|鉛 铅|鉝 𫟷|鉞 钺|鉠 𫓭|鉢 钵|鉤 钩|鉥 𬬸|鉦 钲|鉧 𬭁|鉬 钼|鉭 钽|鉮 𬬹|鉳 锫|鉶 铏|鉷 𫟹|鉸 铰|鉺 铒|鉻 铬|鉽 𫟸|鉾 𫓴|鉿 铪|銀 银|銁 𫓲|銂 𫟻|銃 铳|銅 铜|銈 𫓯|銊 𫓰|銍 铚|銏 𫟶|銑 铣|銓 铨|銖 铢|銘 铭|銚 铫|銛 铦|銜 衔|銠 铑|銣 铷|銥 铱|銦 铟|銨 铵|銩 铥|銪 铕|銫 铯|銬 铐|銱 铞|銳 锐|銶 𨱇|銷 销|銹 锈|銻 锑|銼 锉|鋁 铝|鋂 𰾄|鋃 锒|鋅 锌|鋇 钡|鋉 𨱈|鋌 铤|鋏 铗|鋐 𬭎|鋒 锋|鋗 𫓶|鋙 铻|鋝 锊|鋟 锓|鋠 𫓵|鋣 铘|鋤 锄|鋥 锃|鋦 锔|鋨 锇|鋩 铓|鋪 铺|鋭 锐|鋮 铖|鋯 锆|鋰 锂|鋱 铽|鋶 锍|鋸 锯|鋹 𬬮|鋼 钢|錀 𬬭|錁 锞|錂 𨱋|錄 录|錆 锖|錇 锫|錈 锩|錏 铔|錐 锥|錒 锕|錕 锟|錘 锤|錙 锱|錚 铮|錛 锛|錜 𫓻|錝 𫓽|錞 𬭚|錟 锬|錠 锭|錡 锜|錢 钱|錤 𫓹|錥 𫓾|錦 锦|錨 锚|錩 锠|錫 锡|錮 锢|錯 错|録 录|錳 锰|錶 表|錸 铼|錼 镎|錽 𫓸|鍀 锝|鍁 锨|鍃 锪|鍄 𨱉|鍅 钫|鍆 钔|鍇 锴|鍈 锳|鍉 𫔂|鍊 炼|鍋 锅|鍍 镀|鍒 𫔄|鍔 锷|鍘 铡|鍚 钖|鍛 锻|鍠 锽|鍤 锸|鍥 锲|鍩 锘|鍬 锹|鍭 𬭤|鍮 𨱎|鍰 锾|鍵 键|鍶 锶|鍺 锗|鍼 针|鍾 钟|鎂 镁|鎄 锿|鎇 镅|鎈 𫟿|鎊 镑|鎌 镰|鎍 𫔅|鎓 𬭩|鎔 镕|鎖 锁|鎘 镉|鎙 𫔈|鎚 锤|鎛 镈|鎝 𨱏|鎞 𫔇|鎡 镃|鎢 钨|鎣 蓥|鎦 镏|鎧 铠|鎩 铩|鎪 锼|鎬 镐|鎭 镇|鎮 镇|鎯 𨱍|鎰 镒|鎲 镋|鎳 镍|鎵 镓|鎶 鿔|鎷 𨰾|鎸 镌|鎿 镎|鏃 镞|鏆 𨱌|鏇 旋|鏈 链|鏉 𨱒|鏌 镆|鏍 镙|鏏 𬭬|鏐 镠|鏑 镝|鏗 铿|鏘 锵|鏚 𬭭|鏜 镗|鏝 镘|鏞 镛|鏟 铲|鏡 镜|鏢 镖|鏤 镂|鏥 𫔊|鏦 𫓩|鏨 錾|鏰 镚|鏵 铧|鏷 镤|鏹 镪|鏺 䥽|鏻 𬭸|鏽 锈|鏾 𫔌|鐃 铙|鐄 𨱑|鐇 𫔍|鐈 𫓱|鐋 铴|鐍 𫔎|鐎 𨱓|鐏 𨱔|鐐 镣|鐒 铹|鐓 镦|鐔 镡|鐘 钟|鐙 镫|鐝 镢|鐠 镨|鐥 䦅|鐦 锎|鐧 锏|鐨 镄|鐩 𬭼|鐪 𫓺|鐫 镌|鐮 镰|鐯 䦃|鐲 镯|鐳 镭|鐵 铁|鐶 镮|鐸 铎|鐺 铛|鐼 𫔁|鐽 𫟼|鐿 镱|鑀 𰾭|鑄 铸|鑉 𫠁|鑊 镬|鑌 镔|鑑 鉴|鑒 鉴|鑔 镲|鑕 锧|鑞 镴|鑠 铄|鑣 镳|鑥 镥|鑪 𬬻|鑭 镧|鑰 钥|鑱 镵|鑲 镶|鑴 𫔔|鑷 镊|鑹 镩|鑼 锣|鑽 钻|鑾 銮|鑿 凿|钁 镢|钂 镋|長 长|門 门|閂 闩|閃 闪|閆 闫|閈 闬|閉 闭|開 开|閌 闶|閍 𨸂|閎 闳|閏 闰|閐 𨸃|閑 闲|閒 闲|間 间|閔 闵|閗 𫔯|閘 闸|閝 𫠂|閞 𫔰|閡 阂|閣 阁|閤 合|閥 阀|閨 闺|閩 闽|閫 阃|閬 阆|閭 闾|閱 阅|閲 阅|閵 𫔴|閶 阊|閹 阉|閻 阎|閼 阏|閽 阍|閾 阈|閿 阌|闃 阒|闆 板|闇 暗|闈 闱|闉 𬮱|闊 阔|闋 阕|闌 阑|闍 阇|闐 阗|闑 𫔶|闒 阘|闓 闿|闔 阖|闕 阙|闖 闯|關 关|闞 阚|闠 阓|闡 阐|闢 辟|闤 阛|闥 闼|陘 陉|陝 陕|陞 升|陣 阵|陰 阴|陳 陈|陸 陆|陽 阳|隉 陧|隊 队|階 阶|隑 𬮿|隕 陨|際 际|隤 𬯎|隨 随|險 险|隮 𬯀|隯 陦|隱 隐|隴 陇|隸 隶|隻 只|雋 隽|雖 虽|雙 双|雛 雏|雜 杂|雞 鸡|離 离|難 难|雲 云|電 电|霑 沾|霢 霡|霣 𫕥|霧 雾|霼 𪵣|霽 霁|靂 雳|靄 霭|靆 叇|靈 灵|靉 叆|靚 靓|靜 静|靝 靔|靦 腼|靧 𫖃|靨 靥|鞏 巩|鞝 绱|鞦 秋|鞽 鞒|鞾 𫖇|韁 缰|韃 鞑|韆 千|韉 鞯|韋 韦|韌 韧|韍 韨|韓 韩|韙 韪|韚 𫠅|韛 𫖔|韜 韬|韝 鞲|韞 韫|韠 𫖒|韻 韵|響 响|頁 页|頂 顶|頃 顷|項 项|順 顺|頇 顸|須 须|頊 顼|頌 颂|頍 𫠆|頎 颀|頏 颃|預 预|頑 顽|頒 颁|頓 顿|頔 𬱖|頗 颇|領 领|頜 颌|頠 𬱟|頡 颉|頤 颐|頦 颏|頫 𫖯|頭 头|頮 颒|頰 颊|頲 颋|頴 颕|頵 𫖳|頷 颔|頸 颈|頹 颓|頻 频|頽 颓|顂 𩓋|顃 𩖖|顅 𫖶|顆 颗|題 题|額 额|顎 颚|顏 颜|顒 颙|顓 颛|顔 颜|顗 𫖮|願 愿|顙 颡|顛 颠|類 类|顢 颟|顣 𫖹|顥 颢|顧 顾|顫 颤|顬 颥|顯 显|顰 颦|顱 颅|顳 颞|顴 颧|風 风|颭 飐|颮 飑|颯 飒|颰 𩙥|颱 台|颳 刮|颶 飓|颷 𩙪|颸 飔|颺 飏|颻 飖|颼 飕|颾 𩙫|飀 飗|飄 飘|飆 飙|飈 飚|飋 𫗋|飛 飞|飠 饣|飢 饥|飣 饤|飥 饦|飦 𫗞|飩 饨|飪 饪|飫 饫|飭 饬|飯 饭|飱 飧|飲 饮|飴 饴|飵 𫗢|飶 𫗣|飼 饲|飽 饱|飾 饰|飿 饳|餃 饺|餄 饸|餅 饼|餈 糍|餉 饷|養 养|餌 饵|餎 饹|餏 饻|餑 饽|餒 馁|餓 饿|餔 𫗦|餕 馂|餖 饾|餗 𫗧|餘 余|餚 肴|餛 馄|餜 馃|餞 饯|餡 馅|餦 𫗠|餧 𫗪|館 馆|餪 𫗬|餫 𫗥|餬 糊|餭 𫗮|餱 糇|餳 饧|餵 喂|餶 馉|餷 馇|餸 𩠌|餺 馎|餼 饩|餾 馏|餿 馊|饁 馌|饃 馍|饅 馒|饈 馐|饉 馑|饊 馓|饋 馈|饌 馔|饑 饥|饒 饶|饗 飨|饘 𫗴|饜 餍|饞 馋|饟 𫗵|饠 𫗩|饢 馕|馬 马|馭 驭|馮 冯|馯 𫘛|馱 驮|馳 驰|馴 驯|馹 驲|馼 𫘜|駁 驳|駃 𫘝|駉 𬳶|駊 𫘟|駎 𩧨|駐 驻|駑 驽|駒 驹|駓 𬳵|駔 驵|駕 驾|駘 骀|駙 驸|駚 𩧫|駛 驶|駝 驼|駞 𫘞|駟 驷|駡 骂|駢 骈|駤 𫘠|駧 𩧲|駩 𩧴|駪 𬳽|駫 𫘡|駭 骇|駰 骃|駱 骆|駶 𩧺|駸 骎|駻 𫘣|駼 𬳿|駿 骏|騁 骋|騂 骍|騃 𫘤|騄 𫘧|騅 骓|騉 𫘥|騊 𫘦|騌 骔|騍 骒|騎 骑|騏 骐|騑 𬴂|騔 𩨀|騖 骛|騙 骗|騚 𩨊|騜 𫘩|騝 𩨃|騞 𬴃|騟 𩨈|騠 𫘨|騤 骙|騧 䯄|騪 𩨄|騫 骞|騭 骘|騮 骝|騰 腾|騱 𫘬|騴 𫘫|騵 𫘪|騶 驺|騷 骚|騸 骟|騻 𫘭|騼 𫠋|騾 骡|驀 蓦|驁 骜|驂 骖|驃 骠|驄 骢|驅 驱|驊 骅|驋 𩧯|驌 骕|驍 骁|驎 𬴊|驏 骣|驓 𫘯|驕 骄|驗 验|驙 𫘰|驚 惊|驛 驿|驟 骤|驢 驴|驤 骧|驥 骥|驦 骦|驨 𫘱|驪 骊|驫 骉|骯 肮|髏 髅|髒 脏|體 体|髕 髌|髖 髋|髮 发|鬆 松|鬍 胡|鬖 𩭹|鬚 须|鬠 𫘽|鬢 鬓|鬥 斗|鬧 闹|鬨 哄|鬩 阋|鬮 阄|鬱 郁|鬹 鬶|魎 魉|魘 魇|魚 鱼|魛 鱽|魟 𫚉|魢 鱾|魥 𩽹|魦 𫚌|魨 鲀|魯 鲁|魴 鲂|魵 𫚍|魷 鱿|魺 鲄|魽 𫠐|鮀 𬶍|鮁 鲅|鮃 鲆|鮄 𫚒|鮅 𫚑|鮆 𫚖|鮈 𬶋|鮊 鲌|鮋 鲉|鮍 鲏|鮎 鲇|鮐 鲐|鮑 鲍|鮒 鲋|鮓 鲊|鮚 鲒|鮜 鲘|鮝 鲞|鮞 鲕|鮟 𩽾|鮠 𬶏|鮡 𬶐|鮣 䲟|鮤 𫚓|鮦 鲖|鮪 鲔|鮫 鲛|鮭 鲑|鮮 鲜|鮯 𫚗|鮰 𫚔|鮳 鲓|鮵 𫚛|鮶 鲪|鮸 𩾃|鮺 鲝|鮿 𫚚|鯀 鲧|鯁 鲠|鯄 𩾁|鯆 𫚙|鯇 鲩|鯉 鲤|鯊 鲨|鯒 鲬|鯔 鲻|鯕 鲯|鯖 鲭|鯗 鲞|鯛 鲷|鯝 鲴|鯞 𫚡|鯡 鲱|鯢 鲵|鯤 鲲|鯧 鲳|鯨 鲸|鯪 鲮|鯫 鲰|鯬 𫚞|鯰 鲶|鯱 𩾇|鯴 鲺|鯶 𩽼|鯷 鳀|鯻 𬶟|鯽 鲫|鯾 𫚣|鯿 鳊|鰁 鳈|鰂 鲗|鰃 鳂|鰆 䲠|鰈 鲽|鰉 鳇|鰊 𬶠|鰋 𫚢|鰌 䲡|鰍 鳅|鰏 鲾|鰐 鳄|鰑 𫚊|鰒 鳆|鰓 鳃|鰕 𫚥|鰛 鳁|鰜 鳒|鰟 鳑|鰠 鳋|鰣 鲥|鰤 𫚕|鰥 鳏|鰦 𫚤|鰧 䲢|鰨 鳎|鰩 鳐|鰫 𫚦|鰭 鳍|鰮 鳁|鰱 鲢|鰲 鳌|鰳 鳓|鰵 鳘|鰶 𬶭|鰷 鲦|鰹 鲣|鰺 鲹|鰻 鳗|鰼 鳛|鰽 𫚧|鰾 鳔|鱀 𬶨|鱂 鳉|鱄 𫚋|鱅 鳙|鱆 𫠒|鱇 𩾌|鱈 鳕|鱉 鳖|鱊 𫚪|鱒 鳟|鱔 鳝|鱖 鳜|鱗 鳞|鱘 鲟|鱚 𬶮|鱝 鲼|鱟 鲎|鱠 鲙|鱢 𫚫|鱣 鳣|鱤 鳡|鱧 鳢|鱨 鲿|鱭 鲚|鱮 𫚈|鱯 鳠|鱲 𫚭|鱷 鳄|鱸 鲈|鱺 鲡|鳥 鸟|鳧 凫|鳩 鸠|鳬 凫|鳲 鸤|鳳 凤|鳴 鸣|鳶 鸢|鳷 𫛛|鳼 𪉃|鳽 𫛚|鳾 䴓|鴀 𫛜|鴃 𫛞|鴅 𫛝|鴆 鸩|鴇 鸨|鴉 鸦|鴐 𫛤|鴒 鸰|鴔 𫛡|鴕 鸵|鴗 𫁡|鴛 鸳|鴜 𪉈|鴝 鸲|鴞 鸮|鴟 鸱|鴣 鸪|鴥 𫛣|鴦 鸯|鴨 鸭|鴮 𫛦|鴯 鸸|鴰 鸹|鴲 𪉆|鴳 𫛩|鴴 鸻|鴷 䴕|鴻 鸿|鴽 𫛪|鴿 鸽|鵁 䴔|鵂 鸺|鵃 鸼|鵊 𫛥|鵏 𬷕|鵐 鹀|鵑 鹃|鵒 鹆|鵓 鹁|鵚 𪉍|鵜 鹈|鵝 鹅|鵟 𫛭|鵠 鹄|鵡 鹉|鵧 𫛨|鵩 𫛳|鵪 鹌|鵫 𫛱|鵬 鹏|鵮 鹐|鵯 鹎|鵰 雕|鵲 鹊|鵷 鹓|鵾 鹍|鶄 䴖|鶇 鸫|鶉 鹑|鶊 鹒|鶌 𫛵|鶒 𫛶|鶓 鹋|鶖 鹙|鶗 𫛸|鶘 鹕|鶚 鹗|鶠 𬸘|鶡 鹖|鶥 鹛|鶦 𫛷|鶩 鹜|鶪 䴗|鶬 鸧|鶭 𫛯|鶯 莺|鶰 𫛫|鶱 𬸣|鶲 鹟|鶴 鹤|鶹 鹠|鶺 鹡|鶻 鹘|鶼 鹣|鶿 鹚|鷀 鹚|鷁 鹢|鷂 鹞|鷄 鸡|鷅 𫛽|鷉 䴘|鷊 鹝|鷐 𫜀|鷓 鹧|鷔 𪉑|鷖 鹥|鷗 鸥|鷙 鸷|鷚 鹨|鷟 𬸦|鷣 𫜃|鷤 𫛴|鷥 鸶|鷦 鹪|鷨 𪉊|鷩 𫜁|鷫 鹔|鷭 𬸪|鷯 鹩|鷲 鹫|鷳 鹇|鷴 鹇|鷷 𫜄|鷸 鹬|鷹 鹰|鷺 鹭|鷽 鸴|鷿 𬸯|鸂 㶉|鸇 鹯|鸊 䴙|鸋 𫛢|鸌 鹱|鸏 鹲|鸑 𬸚|鸕 鸬|鸗 𫛟|鸘 鹴|鸚 鹦|鸛 鹳|鸝 鹂|鸞 鸾|鹵 卤|鹹 咸|鹺 鹾|鹼 碱|鹽 盐|麗 丽|麥 麦|麨 𪎊|麩 麸|麪 面|麫 面|麬 𤿲|麯 曲|麲 𪎉|麳 𪎌|麴 曲|麵 面|麷 𫜑|麼 么|麽 么|黃 黄|黌 黉|點 点|黨 党|黲 黪|黴 霉|黶 黡|黷 黩|黽 黾|黿 鼋|鼂 鼌|鼉 鼍|鼕 冬|鼴 鼹|齊 齐|齋 斋|齎 赍|齏 齑|齒 齿|齔 龀|齕 龁|齗 龂|齘 𬹼|齙 龅|齜 龇|齟 龃|齠 龆|齡 龄|齣 出|齦 龈|齧 啮|齩 𫜪|齪 龊|齬 龉|齭 𫜭|齮 𬺈|齯 𫠜|齰 𫜬|齲 龋|齴 𫜮|齶 腭|齷 龌|齼 𬺓|齾 𫜰|龍 龙|龎 厐|龐 庞|龑 䶮|龓 𫜲|龔 龚|龕 龛|龜 龟|龭 𩨎|龯 𨱆|鿁 䜤|鿓 鿒|𠁞 𠀾|𠌥 𠆿|𠏢 𠉗|𠐊 𫝋|𠗣 㓆|𠞆 𠛆|𠠎 𠚳|𠬙 𪠡|𠽃 𪠺|𠿕 𪜎|𡂡 𪢒|𡃄 𪡺|𡃕 𠴛|𡃤 𪢐|𡄔 𠴢|𡄣 𠵸|𡅏 𠲥|𡅯 𪢖|𡑍 𫭼|𡑭 𡋗|𡓁 𪤄|𡓾 𡋀|𡔖 𡍣|𡞵 㛟|𡟫 𫝪|𡠹 㛿|𡢃 㛠|𡮉 𡭜|𡮣 𡭬|𡳳 𡳃|𡸗 𪨩|𡹬 𪨹|𡻕 岁|𡽗 𡸃|𡾱 㟜|𡿖 𪩛|𢍰 𪪴|𢠼 𢙑|𢣐 𪬚|𢣚 𢘝|𢣭 𢘞|𢤩 𪫡|𢤱 𢘙|𢤿 𪬯|𢯷 𪭝|𢶒 𪭯|𢶫 𢫞|𢷮 𢫊|𢹿 𢬦|𢺳 𪮳|𣈶 暅|𣋋 𣈣|𣍐 𫧃|𣙎 㭣|𣜬 𪳗|𣝕 𣘷|𣞻 𣘓|𣠩 𣞎|𣠲 𣑶|𣯩 𣯣|𣯴 𣭤|𣯶 毶|𣽏 𪶮|𣾷 㳢|𣿉 𣶫|𤁣 𣺽|𤄷 𪶒|𤅶 𣷷|𤑳 𤎻|𤑹 𪹀|𤒎 𤊀|𤒻 𪹹|𤓌 𪹠|𤓎 𤎺|𤓩 𤊰|𤘀 𪺣|𤛮 𤙯|𤛱 𫞢|𤜆 𪺪|𤠮 𪺸|𤢟 𤝢|𤢻 𢢐|𤩂 𫞧|𤪺 㻘|𤫩 㻏|𤬅 𪼴|𤳷 𪽝|𤳸 𤳄|𤷃 𪽭|𤸫 𤶧|𤺔 𪽴|𥊝 𥅿|𥌃 𥅘|𥏝 𪿊|𥕥 𥐰|𥖅 𥐯|𥖲 𪿞|𥗇 𪿵|𥗽 𬒗|𥜐 𫀓|𥜰 𫀌|𥞵 𥞦|𥢢 䅪|𥢶 𫞷|𥢷 𫀮|𥨐 𥧂|𥪂 𥩺|𥯤 𫁳|𥴨 𫂖|𥴼 𫁺|𥵃 𥱔|𥵊 𥭉|𥶽 𫁱|𥸠 𥮋|𥻦 𫂿|𥼽 𥹥|𥽖 𥺇|𥾯 𫄝|𥿊 𦈈|𦀖 𫄦|𦂅 𦈒|𦃄 𦈗|𦃩 𫄯|𦅇 𫄪|𦅈 𫄵|𦆲 𫟇|𦒀 𫅥|𦔖 𫅼|𦘧 𡳒|𦟼 𫆝|𦠅 𫞅|𦡝 𫆫|𦢈 𣍨|𦣎 𦟗|𦧺 𫇘|𦪙 䑽|𦪽 𦨩|𦱌 𫇪|𦾟 𦶻|𧎈 𧌥|𧒯 𫊹|𧔥 𧒭|𧕟 𧉐|𧜗 䘞|𧜵 䙊|𧝞 䘛|𧞫 𫌋|𧟀 𧝧|𧡴 𫌫|𧢄 𫌬|𧦝 𫍞|𧦧 𫍟|𧩕 𫍭|𧩙 䜥|𧩼 𫍶|𧫝 𫍺|𧬤 𫍼|𧭈 𫍾|𧭹 𫍐|𧳟 𧳕|𧵳 䞌|𧶔 𧹓|𧶧 䞎|𧷎 𪠀|𧸘 𫎨|𧹈 𪥠|𧽯 𫎸|𨂐 𫏌|𨄣 𨀱|𨅍 𨁴|𨆪 𫏕|𨇁 𧿈|𨇞 𨅫|𨇤 𫏨|𨇰 𫏞|𨇽 𫏑|𨈊 𨂺|𨈌 𨄄|𨊰 䢀|𨊸 䢁|𨊻 𨐆|𨋢 䢂|𨌈 𫐍|𨍰 𫐔|𨎌 𫐋|𨎮 𨐉|𨏠 𨐇|𨏥 𨐊|𨞺 𫟫|𨟊 𫟬|𨢿 𨡙|𨣈 𨡺|𨣞 𨟳|𨣧 𨠨|𨤻 𨤰|𨥛 𨱀|𨥟 𫓫|𨦫 䦀|𨧀 𬭊|𨧜 䦁|𨧰 𫟽|𨧱 𨱊|𨨏 𬭛|𨨛 𫓼|𨨢 𫓿|𨩰 𫟾|𨪕 𫓮|𨫒 𨱐|𨬖 𫔏|𨭆 𬭶|𨭎 𬭳|𨭖 𫔑|𨭸 𫔐|𨮂 𨱕|𨮳 𫔒|𨯅 䥿|𨯟 𫔓|𨰃 𫔉|𨰋 𫓳|𨰥 𫔕|𨰲 𫔃|𨲳 𫔖|𨳑 𨸁|𨳕 𨸀|𨴗 𨸅|𨴹 𫔲|𨵩 𨸆|𨵸 𨸇|𨶀 𨸉|𨶏 𨸊|𨶮 𨸌|𨶲 𨸋|𨷲 𨸎|𨼳 𫔽|𨽏 𨸘|𩀨 𫕚|𩅙 𫕨|𩎖 𫖑|𩎢 𩏾|𩏂 𫖓|𩏠 𫖖|𩏪 𩏽|𩏷 𫃗|𩑔 𫖪|𩒎 𫖭|𩓣 𩖕|𩓥 𫖵|𩔑 𫖷|𩔳 𫖴|𩖰 𫠇|𩗀 𩙦|𩗓 𫗈|𩗴 𫗉|𩘀 𩙩|𩘝 𩙭|𩘹 𩙨|𩘺 𩙬|𩙈 𩙰|𩚛 𩟿|𩚥 𩠀|𩚩 𫗡|𩚵 𩠁|𩛆 𩠂|𩛌 𫗤|𩛡 𫗨|𩛩 𩠃|𩜇 𩠉|𩜦 𩠆|𩜵 𩠊|𩝔 𩠋|𩝽 𫗳|𩞄 𩠎|𩞦 𩠏|𩞯 䭪|𩟐 𩠅|𩟗 𫗚|𩠴 𩠠|𩡣 𩡖|𩡺 𩧦|𩢡 𩧬|𩢴 𩧵|𩢸 𩧳|𩢾 𩧮|𩣏 𩧶|𩣑 䯃|𩣫 𩧸|𩣵 𩧻|𩣺 𩧼|𩤊 𩧩|𩤙 𩨆|𩤲 𩨉|𩤸 𩨅|𩥄 𩨋|𩥇 𩨍|𩥉 𩧱|𩥑 𩨌|𩦠 𫠌|𩧆 𩨐|𩭙 𩬣|𩯁 𫙂|𩯳 𩯒|𩰀 𩬤|𩰹 𩰰|𩳤 𩲒|𩴵 𩴌|𩵦 𫠏|𩵩 𩽺|𩵹 𩽻|𩶁 𫚎|𩶘 䲞|𩶰 𩽿|𩶱 𩽽|𩷰 𩾄|𩸃 𩾅|𩸄 𫚝|𩸡 𫚟|𩸦 𩾆|𩻗 𫚨|𩻬 𫚩|𩻮 𫚘|𩼶 𫚬|𩽇 𩾎|𩿅 𫠖|𩿤 𫛠|𩿪 𪉄|𪀖 𫛧|𪀦 𪉅|𪀾 𪉋|𪁈 𪉉|𪁖 𪉌|𪂆 𪉎|𪃍 𪉐|𪃏 𪉏|𪃒 𫛻|𪃧 𫛹|𪄆 𪉔|𪄕 𪉒|𪅂 𫜂|𪆷 𫛾|𪇳 𪉕|𪈼 𱊜|𪉸 𫜊|𪋿 𫧮|𪌭 𫜓|𪍠 𫜕|𪓰 𫜟|𪔵 𪔭|𪘀 𪚏|𪘯 𪚐|𪙏 𫜯|𪟖 𠛾|𪷓 𣶭|𫒡 𫓷|𫜦 𫜫";
  const to_cn = [[dict_TSPhrases, dict_TSCharacters]];
  const fromDicts = {
    hk: from_hk,
    tw: from_tw,
    twp: from_twp,
    jp: from_jp
  };
  const toDicts = {
    cn: to_cn
  };
  const configs = {
    hk2s: { segmentation: dict_TSPhrases, conversionChain: [[dict_HKVariantsRevPhrases, dict_HKVariantsRev], [dict_TSPhrases, dict_TSCharacters]] },
    t2s: { segmentation: dict_TSPhrases, conversionChain: [[dict_TSPhrases, dict_TSCharacters]] },
    tw2s: { segmentation: dict_TSPhrases, conversionChain: [[dict_TWVariantsRevPhrases, dict_TWVariantsRev], [dict_TSPhrases, dict_TSCharacters]] },
    tw2sp: { segmentation: dict_TSPhrases, conversionChain: [[dict_TWPhrasesRev, dict_TWVariantsRevPhrases, dict_TWVariantsRev], [dict_TSPhrases, dict_TSCharacters]] }
  };
  const t2cnPreset = Object.freeze( Object.defineProperty({
    __proto__: null,
    configs,
    from: fromDicts,
    to: toDicts
  }, Symbol.toStringTag, { value: "Module" }));
  class Trie {



constructor() {
      this.map = new Map();
    }
addWord(s, v) {
      let { map } = this;
      for (const c of s) {
        const cp = c.codePointAt(0);
        const nextMap = map.get(cp);
        if (nextMap == null) {
          const tmp = new Map();
          map.set(cp, tmp);
          map = tmp;
        } else {
          map = nextMap;
        }
      }
      map.trie_val = v;
    }
loadDict(d) {
      if (typeof d === "string") {
        d = d.split("|");
        for (const line of d) {
          const [l, r] = line.split(" ");
          this.addWord(l, r);
        }
      } else {
        for (let arr of d) {
          const [l, r] = arr;
          this.addWord(l, r);
        }
      }
    }
loadDictGroup(arr) {
      arr.slice().reverse().forEach((d) => {
        this.loadDict(d);
      });
    }
    matchPrefix(s, i) {
      const n = s.length;
      let t_curr = this.map, k = 0, v;
      for (let j = i; j < n; ) {
        const x = s.codePointAt(j);
        j += x > 65535 ? 2 : 1;
        const t_next = t_curr.get(x);
        if (typeof t_next === "undefined") {
          break;
        }
        t_curr = t_next;
        const v_curr = t_curr.trie_val;
        if (typeof v_curr !== "undefined") {
          k = j;
          v = v_curr;
        }
      }
      if (k > 0) {
        return { end: k, value: v };
      }
      return null;
    }
    segment(s) {
      const n = s.length, segments = [];
      let orig_i = null;
      for (let i = 0; i < n; ) {
        const matched = this.matchPrefix(s, i);
        if (matched) {
          if (orig_i !== null) {
            segments.push(s.slice(orig_i, i));
            orig_i = null;
          }
          segments.push(s.slice(i, matched.end));
          i = matched.end;
        } else {
          if (orig_i === null) {
            orig_i = i;
          }
          i += s.codePointAt(i) > 65535 ? 2 : 1;
        }
      }
      if (orig_i !== null) {
        segments.push(s.slice(orig_i, n));
      }
      return segments;
    }
convert(s) {
      const n = s.length, arr = [];
      let orig_i = null;
      for (let i = 0; i < n; ) {
        const matched = this.matchPrefix(s, i);
        if (matched) {
          if (orig_i !== null) {
            arr.push(s.slice(orig_i, i));
            orig_i = null;
          }
          arr.push(matched.value);
          i = matched.end;
        } else {
          if (orig_i === null) {
            orig_i = i;
          }
          i += s.codePointAt(i) > 65535 ? 2 : 1;
        }
      }
      if (orig_i !== null) {
        arr.push(s.slice(orig_i, n));
      }
      return arr.join("");
    }
  }
  function ConverterFactory(...dictGroups) {
    const trieArr = dictGroups.map((grp) => {
      const t = new Trie();
      t.loadDictGroup(grp);
      return t;
    });
    function convert(s) {
      return trieArr.reduce((res, t) => {
        return t.convert(res);
      }, s);
    }
    return convert;
  }
  function ConverterFactoryWithSegmentation(segmentationDict, ...dictGroups) {
    const segmentation = new Trie();
    segmentation.loadDict(segmentationDict);
    const trieArr = dictGroups.map((grp) => {
      const t = new Trie();
      t.loadDictGroup(grp);
      return t;
    });
    return function convert(s) {
      return trieArr.reduce((segments, t) => segments.map((segment) => t.convert(segment)), segmentation.segment(s)).join("");
    };
  }
  function ConverterBuilder(localePreset) {
    function getConfigName(from, to) {
      if (from === "cn") {
        return `s2${to}`;
      }
      if (to === "cn") {
        return from === "twp" ? "tw2sp" : `${from}2s`;
      }
      return `${from}2${to}`;
    }
    function normalizeDictGroups(dictGroup) {
      if (Array.isArray(dictGroup) && Array.isArray(dictGroup[0])) {
        return dictGroup;
      }
      return [dictGroup];
    }
    return function Converter(options) {
      if (localePreset.configs) {
        const config = localePreset.configs[getConfigName(options.from, options.to)];
        if (config) {
          return ConverterFactoryWithSegmentation(config.segmentation, ...config.conversionChain);
        }
      }
      let dictGroups = [];
      ["from", "to"].forEach((type) => {
        if (typeof options[type] !== "string") {
          throw new Error("Please provide the `" + type + "` option");
        }
        if (options[type] !== "t") {
          dictGroups.push(...normalizeDictGroups(localePreset[type][options[type]]));
        }
      });
      return ConverterFactory.apply(null, dictGroups);
    };
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
  function tify(text2) {
    const isString2 = typeof text2 === "string";
    if (!isString2) {
      console.error(
        "The expected text signature is undefined | null | string, but an unexpected value was passed in:",
        typeof text2
      );
    }
    let $$text = isString2 ? text2 : "";
    $$text = ($$text == null ? void 0 : $$text.replace(/[^\x00-\xFF]/g, replaceFn)) || "";
    return $$text;
  }
  function replaceFn(char) {
    if (char in s_2_t) {
      return s_2_t[char];
    }
    return char;
  }
  let simplifiedConverter = null;
  const japaneseVariantMap = {
    亜: "亚",
    仏: "佛",
    仮: "假",
    価: "价",
    児: "儿",
    円: "圆",
    剣: "剑",
    剤: "剂",
    労: "劳",
    単: "单",
    囲: "围",
    団: "团",
    図: "图",
    圧: "压",
    壊: "坏",
    実: "实",
    対: "对",
    専: "专",
    峡: "峡",
    巣: "巢",
    帯: "带",
    広: "广",
    弾: "弹",
    徳: "德",
    悪: "恶",
    応: "应",
    抜: "拔",
    拡: "扩",
    揺: "摇",
    桜: "樱",
    様: "样",
    権: "权",
    欧: "欧",
    歓: "欢",
    歩: "步",
    歳: "岁",
    殻: "壳",
    気: "气",
    沢: "泽",
    涙: "泪",
    渋: "涩",
    浜: "滨",
    満: "满",
    滝: "泷",
    焼: "烧",
    獣: "兽",
    発: "发",
    県: "县",
    絵: "绘",
    絶: "绝",
    継: "继",
    続: "续",
    緑: "绿",
    縄: "绳",
    総: "总",
    芸: "艺",
    薬: "药",
    蛍: "萤",
    説: "说",
    読: "读",
    転: "转",
    鉄: "铁",
    黒: "黑",
    竜: "龙"
  };
  const japaneseVariantPattern = new RegExp(`[${Object.keys(japaneseVariantMap).join("")}]`, "g");
  const protectedZhuWords = [
    "著作",
    "著名",
    "著称",
    "著書",
    "著书",
    "著述",
    "著錄",
    "著录",
    "著者",
    "著於",
    "著于",
    "著有",
    "著成",
    "著文",
    "名著",
    "原著",
    "巨著",
    "專著",
    "专著",
    "編著",
    "编著",
    "譯著",
    "译著",
    "合著",
    "拙著",
    "新著",
    "舊著",
    "旧著",
    "遺著",
    "遗著",
    "土著",
    "顯著",
    "显著",
    "卓著",
    "昭著",
    "較著",
    "较著",
    "見微知著",
    "见微知著",
    "臭名昭著",
    "彰明較著",
    "彰明较著"
  ];
  function getSimplifiedConverter() {
    simplifiedConverter ?? (simplifiedConverter = ConverterBuilder(t2cnPreset)({ from: "t", to: "cn" }));
    return simplifiedConverter;
  }
  function normalizeJapaneseVariantsForSimplified(text2) {
    return text2.replace(japaneseVariantPattern, (char) => japaneseVariantMap[char] || char);
  }
  function normalizeZheForSimplified(text2) {
    if (!text2.includes("著")) return text2;
    const placeholders = [];
    let converted = text2;
    for (const word of protectedZhuWords) {
      if (!converted.includes(word)) continue;
      const token = `${placeholders.length}`;
      placeholders.push(word);
      converted = converted.split(word).join(token);
    }
    converted = converted.replace(/著/g, "着");
    return converted.replace(/\uE000(\d+)\uE001/g, (_, index) => placeholders[Number(index)]);
  }
  function getConverter(mode) {
    if (mode === "sc") {
      const converter = getSimplifiedConverter();
      return (text2) => normalizeZheForSimplified(normalizeJapaneseVariantsForSimplified(converter(text2)));
    }
    return tify;
  }
  async function convertText(text2, mode) {
    if (mode === "none" || !text2) {
      return text2;
    }
    try {
      const converter = getConverter(mode);
      return converter(text2);
    } catch (error) {
      console.error("[ChineseConverter] Text conversion error:", error);
      return text2;
    }
  }
  async function convertHTML(html2, mode) {
    if (mode === "none" || !html2) {
      return html2;
    }
    try {
      const converter = getConverter(mode);
      const template = document.createElement("template");
      template.innerHTML = html2;
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
      return html2;
    }
  }
  async function applyConversionToChapterEntry(chapters, originalContents, originalTitles, entryId, mode) {
    const entry = chapters.find((e) => e.id === entryId);
    if (!entry) return;
    const originalContent = originalContents.get(entryId);
    const originalTitle = originalTitles.get(entryId);
    const updates = {};
    if (mode === "none") {
      if (originalContent && entry.chapter.content !== originalContent) {
        updates.content = originalContent;
      }
      if (originalTitle) {
        updates.title = originalTitle.title;
        updates.bookTitle = originalTitle.bookTitle;
      }
    } else {
      if (originalContent) {
        updates.content = await convertHTML(originalContent, mode);
      }
      if (originalTitle) {
        updates.title = await convertText(originalTitle.title, mode);
        updates.bookTitle = originalTitle.bookTitle ? await convertText(originalTitle.bookTitle, mode) : originalTitle.bookTitle;
      }
    }
    if (Object.keys(updates).length > 0) {
      entry.chapter = { ...entry.chapter, ...updates };
    }
  }
  async function applyTocConversion(tocOriginal, mode) {
    if (tocOriginal.length === 0) {
      return [];
    }
    if (mode === "none") {
      return [...tocOriginal];
    }
    return Promise.all(
      tocOriginal.map(async (entry) => ({
        ...entry,
        title: await convertText(entry.title, mode)
      }))
    );
  }
  const CACHE_V2_INDEX_PREFIX = "mnr_cache_v2_index_";
  const CACHE_V2_CHAPTER_PREFIX = "mnr_cache_v2_chapter_";
  const DAY_MS = 24 * 60 * 60 * 1e3;
  const PERSISTED_CACHE_MAX_AGE_MS = 30 * DAY_MS;
  const PERSISTED_CACHE_GC_INTERVAL_MS = DAY_MS;
  const PERSISTED_CACHE_TOUCH_INTERVAL_MS = DAY_MS;
  const PERSISTED_CACHE_GC_LAST_RUN_KEY = "mnr_cache_v2_gc_last_run";
  const PERSISTED_CACHE_INDEX_CHECKPOINT_CHAPTERS = 50;
  function generateBookId(indexUrl) {
    try {
      const url = new URL(indexUrl);
      return url.hostname + url.pathname.replace(/\//g, "_");
    } catch {
      return btoa(indexUrl).slice(0, 32);
    }
  }
  function encodeBase64UrlUtf8(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  function parseStoredJson(stored) {
    if (stored === null || stored === void 0) return null;
    if (typeof stored === "string") {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    if (typeof stored === "object") {
      return stored;
    }
    return null;
  }
  function getCacheV2IndexKey(bookId) {
    return `${CACHE_V2_INDEX_PREFIX}${bookId}`;
  }
  function getCacheV2ChapterKey(bookId, url) {
    return `${CACHE_V2_CHAPTER_PREFIX}${bookId}_${encodeBase64UrlUtf8(url)}`;
  }
  function normalizeTimestamp(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }
  function getIndexAccessTime(index) {
    return normalizeTimestamp(index.lastAccessed) ?? normalizeTimestamp(index.lastUpdated);
  }
  function getCurrentBookCacheKey(indexUrl) {
    if (!indexUrl) return null;
    return { bookId: generateBookId(indexUrl), indexUrl };
  }
  function persistCachedChapter(cacheBook, url, cached) {
    if (typeof GM_setValue === "undefined") return false;
    try {
      GM_setValue(getCacheV2ChapterKey(cacheBook.bookId, url), JSON.stringify(cached));
      return true;
    } catch (e) {
      console.error("[MNR] Failed to persist cached chapter:", e);
      return false;
    }
  }
  function getPersistedCachedChapter(cacheBook, url) {
    var _a;
    if (typeof GM_getValue === "undefined") return null;
    try {
      const storedV2 = GM_getValue(getCacheV2ChapterKey(cacheBook.bookId, url), null);
      const cachedV2 = parseStoredJson(storedV2);
      if ((_a = cachedV2 == null ? void 0 : cachedV2.chapter) == null ? void 0 : _a.url) {
        return cachedV2;
      }
    } catch (e) {
      console.error("[MNR] Failed to load persisted chapter:", e);
    }
    return null;
  }
  function persistCache(cacheBook, cachedContents, persistedUrls) {
    if (typeof GM_setValue === "undefined") return persistedUrls;
    const persistedSet = new Set(persistedUrls);
    for (const [url, cached] of cachedContents) {
      const persisted = persistCachedChapter(cacheBook, url, cached);
      if (persisted) {
        persistedSet.add(url);
      }
    }
    if (persistedSet.size === 0) return persistedSet;
    persistCacheIndex(cacheBook, persistedSet);
    return persistedSet;
  }
  function persistCacheIndex(cacheBook, persistedUrls, now = Date.now()) {
    if (typeof GM_setValue === "undefined" || persistedUrls.size === 0) return false;
    const indexData = {
      version: 2,
      bookId: cacheBook.bookId,
      indexUrl: cacheBook.indexUrl,
      urls: Array.from(persistedUrls),
      lastUpdated: now,
      lastAccessed: now
    };
    try {
      GM_setValue(getCacheV2IndexKey(cacheBook.bookId), JSON.stringify(indexData));
      return true;
    } catch (e) {
      console.error("[MNR] Failed to persist cache index:", e);
      return false;
    }
  }
  function restoreCache(cacheBook) {
    if (typeof GM_getValue === "undefined") return null;
    try {
      const storedV2 = GM_getValue(getCacheV2IndexKey(cacheBook.bookId), null);
      const dataV2 = parseStoredJson(storedV2);
      if ((dataV2 == null ? void 0 : dataV2.version) === 2 && Array.isArray(dataV2.urls)) {
        return new Set(dataV2.urls);
      }
    } catch (e) {
      console.error("[MNR] Failed to restore cache:", e);
    }
    return null;
  }
  function touchPersistedCache(cacheBook, now = Date.now(), touchIntervalMs = PERSISTED_CACHE_TOUCH_INTERVAL_MS) {
    if (typeof GM_getValue === "undefined" || typeof GM_setValue === "undefined") return false;
    try {
      const indexKey = getCacheV2IndexKey(cacheBook.bookId);
      const stored = GM_getValue(indexKey, null);
      const data = parseStoredJson(stored);
      if ((data == null ? void 0 : data.version) !== 2 || !Array.isArray(data.urls)) return false;
      const lastAccessed = getIndexAccessTime(data);
      if (lastAccessed !== null && now - lastAccessed < touchIntervalMs) {
        return false;
      }
      GM_setValue(indexKey, JSON.stringify({ ...data, lastAccessed: now }));
      return true;
    } catch (e) {
      console.error("[MNR] Failed to touch cache index:", e);
      return false;
    }
  }
  function cleanupExpiredCaches(options = {}) {
    if (typeof GM_getValue === "undefined" || typeof GM_setValue === "undefined" || typeof GM_deleteValue === "undefined" || typeof GM_listValues !== "function") {
      return;
    }
    const now = options.now ?? Date.now();
    const gcIntervalMs = options.gcIntervalMs ?? PERSISTED_CACHE_GC_INTERVAL_MS;
    const maxAgeMs = options.maxAgeMs ?? PERSISTED_CACHE_MAX_AGE_MS;
    try {
      if (!options.force) {
        const lastRun = normalizeTimestamp(GM_getValue(PERSISTED_CACHE_GC_LAST_RUN_KEY, 0));
        if (lastRun !== null && now - lastRun < gcIntervalMs) return;
      }
      for (const key of GM_listValues()) {
        if (!key.startsWith(CACHE_V2_INDEX_PREFIX)) continue;
        const bookId = key.slice(CACHE_V2_INDEX_PREFIX.length);
        if (!bookId || bookId === options.currentBookId) continue;
        const data = parseStoredJson(GM_getValue(key, null));
        if ((data == null ? void 0 : data.version) !== 2 || !Array.isArray(data.urls)) continue;
        const lastAccessed = getIndexAccessTime(data);
        if (lastAccessed === null || now - lastAccessed <= maxAgeMs) continue;
        clearPersistedCache(
          { bookId, indexUrl: typeof data.indexUrl === "string" ? data.indexUrl : "" },
          new Set(data.urls)
        );
      }
      GM_setValue(PERSISTED_CACHE_GC_LAST_RUN_KEY, now);
    } catch (e) {
      console.error("[MNR] Failed to cleanup expired caches:", e);
    }
  }
  function clearPersistedCache(cacheBook, persistedUrls) {
    if (typeof GM_deleteValue === "undefined") return;
    let urls = new Set(persistedUrls);
    if (typeof GM_getValue !== "undefined") {
      const storedIndex = GM_getValue(getCacheV2IndexKey(cacheBook.bookId), null);
      const dataV2 = parseStoredJson(storedIndex);
      if ((dataV2 == null ? void 0 : dataV2.version) === 2 && Array.isArray(dataV2.urls)) {
        urls = new Set(dataV2.urls);
      }
    }
    try {
      const chapterKeyPrefix = `${CACHE_V2_CHAPTER_PREFIX}${cacheBook.bookId}_`;
      if (urls.size > 0) {
        for (const url of urls) {
          GM_deleteValue(getCacheV2ChapterKey(cacheBook.bookId, url));
        }
      } else if (typeof GM_listValues === "function") {
        for (const key of GM_listValues()) {
          if (key.startsWith(chapterKeyPrefix)) {
            GM_deleteValue(key);
          }
        }
      }
      GM_deleteValue(getCacheV2IndexKey(cacheBook.bookId));
    } catch (e) {
      console.error("[MNR] Failed to clear cache:", e);
    }
  }
  function normalizeUrlForFetch(url) {
    const normalized = normalizeRedundantFirstPageParam(normalizeCiwemaoChapterUrl(url));
    try {
      const u = new URL(normalized);
      u.hash = "";
      return u.toString();
    } catch {
      return normalized.replace(/#.*$/, "");
    }
  }
  function normalizeUrl(url) {
    return url.replace(/\/$/, "").replace(/\/index\.html?$/, "");
  }
  function normalizeUrlForBlock(url) {
    const normalized = normalizeCiwemaoChapterUrl(url);
    try {
      const u = new URL(normalized);
      u.hash = "";
      return normalizeUrl(u.toString());
    } catch {
      return normalizeUrl(normalized.replace(/#.*$/, ""));
    }
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
  function extractBookId(url) {
    try {
      const u = new URL(url);
      const patterns = [
        /\/book\/(\d+)/,
        /\/chapter\/(\d+)\//,
        /\/(\d+)\/\d+(?:\.html?)?$/,
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
  function extractChapterNumber(title) {
    const match1 = title.match(/第\s*(\d+)\s*[章节回话篇集卷]/);
    if (match1) return parseInt(match1[1], 10);
    const match2 = title.match(/^(\d+)[.、\s]/);
    if (match2) return parseInt(match2[1], 10);
    const match3 = title.match(/Chapter\s*(\d+)/i);
    if (match3) return parseInt(match3[1], 10);
    return null;
  }
  function normalizeTocPagerText(text2) {
    return text2.replace(/\s+/g, "").trim();
  }
  function isTocNextPageText(text2) {
    const t = normalizeTocPagerText(text2).toLowerCase();
    if (!t) return false;
    if (t.includes("下一页") || t.includes("下页") || t.includes("下一頁") || t.includes("下頁")) {
      return true;
    }
    if (t.includes("next") && !t.includes("chapter") && (t.includes("page") || t === "next")) {
      return true;
    }
    return false;
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
  function extractTocPaginationSeed(indexUrl) {
    try {
      const u = new URL(indexUrl);
      const m = u.pathname.match(/\/(\d{3,})(?:[/?]|$)/);
      return (m == null ? void 0 : m[1]) || null;
    } catch {
      return null;
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
  function calculateBackoff(failureCount, baseMs = 1500, maxMs = 3e4) {
    return Math.min(baseMs * Math.pow(2, failureCount - 1), maxMs);
  }
  function normalizeTextForVipDetection(text2) {
    return text2.replace(/\s+/g, "").replace(/[\u3000]/g, "").replace(/[，。！？、""''（）()【】[\]<>《》:：;；·~…—-]/g, "").toLowerCase();
  }
  function cleanGobooTocTitleForUrl(title, url) {
    const trimmed = title.trim();
    try {
      const parsed = new URL(url);
      const gobooChapter = parsed.pathname.match(/^\/gb_\d+\/\d+\/(\d+)(?:\/|$)/);
      if (!gobooChapter) return trimmed;
      const chapterPathId = gobooChapter[1];
      if (!trimmed.startsWith(chapterPathId)) return trimmed;
      const rest = trimmed.slice(chapterPathId.length).trimStart();
      if (/^(?:\d{3,4}|第)/.test(rest)) {
        return rest;
      }
    } catch {
    }
    return trimmed;
  }
  const gobooTocTitleCleaner = {
    id: "goboo",
    clean: cleanGobooTocTitleForUrl
  };
  const __vite_glob_0_0 = Object.freeze( Object.defineProperty({
    __proto__: null,
    gobooTocTitleCleaner
  }, Symbol.toStringTag, { value: "Module" }));
  function isQidianHost(hostname) {
    return /(^|\.)qidian\.com$/i.test(hostname);
  }
  function getCookieValue(name) {
    if (typeof document === "undefined" || !document.cookie) return null;
    const encodedName = encodeURIComponent(name);
    for (const part of document.cookie.split(";")) {
      const trimmed = part.trim();
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq);
      if (key === name || key === encodedName) {
        return decodeURIComponent(trimmed.slice(eq + 1));
      }
    }
    return null;
  }
  function resolveQidianPageUrl(indexUrl, currentUrl) {
    const fallbackBase = typeof location !== "undefined" && typeof location.href === "string" && location.href || "https://www.qidian.com/";
    for (const candidate of [currentUrl, indexUrl]) {
      const abs = resolveUrl(candidate, fallbackBase);
      if (!abs) continue;
      try {
        const url = new URL(abs);
        if (isQidianHost(url.hostname)) return url;
      } catch {
      }
    }
    return null;
  }
  function isQidianTocRequest(indexUrl, currentUrl, rule) {
    if ((rule == null ? void 0 : rule.id) === "qidian" || (rule == null ? void 0 : rule.id) === "qidian-mobile") return true;
    return !!resolveQidianPageUrl(indexUrl, currentUrl);
  }
  function buildQidianCategoryUrl(indexUrl, currentUrl) {
    const bookId = extractBookId(currentUrl) || extractBookId(indexUrl);
    const pageUrl = resolveQidianPageUrl(indexUrl, currentUrl);
    if (!bookId || !pageUrl) return null;
    const apiUrl = new URL("/webcommon/book/category", pageUrl.origin);
    const csrfToken = getCookieValue("_csrfToken");
    if (csrfToken) {
      apiUrl.searchParams.set("_csrfToken", csrfToken);
    }
    apiUrl.searchParams.set("bookId", bookId);
    return apiUrl.toString();
  }
  function getNativeFetch$1() {
    if (typeof unsafeWindow !== "undefined" && typeof unsafeWindow.fetch === "function") {
      return unsafeWindow.fetch.bind(unsafeWindow);
    }
    if (typeof window !== "undefined" && typeof window.fetch === "function") {
      return window.fetch.bind(window);
    }
    if (typeof fetch === "function") {
      return fetch;
    }
    return null;
  }
  async function requestQidianCategoryNative(apiUrl, setAbort) {
    const fetcher = getNativeFetch$1();
    if (!fetcher) return null;
    const controller = new AbortController();
    setAbort(() => controller.abort());
    try {
      const response = await fetcher(apiUrl, {
        credentials: "include",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest"
        },
        signal: controller.signal
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    } finally {
      setAbort(null);
    }
  }
  async function requestQidianCategoryGm(apiUrl, currentUrl, setAbort) {
    const gmXhr = typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null;
    if (!gmXhr) return null;
    return new Promise((resolve) => {
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        setAbort(null);
        resolve(value);
      };
      const headers = {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (currentUrl) {
        headers.Referer = currentUrl;
      }
      const request = gmXhr({
        method: "GET",
        url: apiUrl,
        headers,
        timeout: 1e4,
        withCredentials: true,
        onload: (response) => {
          if (response.status < 200 || response.status >= 300) {
            finish(null);
            return;
          }
          try {
            finish(JSON.parse(response.responseText));
          } catch {
            finish(null);
          }
        },
        onerror: () => finish(null),
        onabort: () => finish(null),
        ontimeout: () => finish(null)
      });
      setAbort(() => {
        try {
          request.abort();
        } catch {
        }
        finish(null);
      });
    });
  }
  function dedupeQidianTocEntries(candidates) {
    const seenUrls = new Set();
    const results = [];
    for (let i = candidates.length - 1; i >= 0; i--) {
      const entry = candidates[i];
      if (seenUrls.has(entry.url)) continue;
      seenUrls.add(entry.url);
      results.unshift(entry);
    }
    return results;
  }
  function qidianCategoryToEntries(response, indexUrl, currentUrl) {
    var _a;
    if (!response || response.code !== 0) return [];
    const bookId = extractBookId(currentUrl) || extractBookId(indexUrl);
    const pageUrl = resolveQidianPageUrl(indexUrl, currentUrl);
    if (!bookId || !pageUrl) return [];
    const entries2 = [];
    const volumes = ((_a = response.data) == null ? void 0 : _a.vs) || [];
    for (const volume of volumes) {
      for (const chapter of volume.cs || []) {
        const rawTitle = chapter.cN || chapter.chapterName || "";
        const title = rawTitle.trim() || `章节 ${entries2.length + 1}`;
        const explicitUrl = typeof chapter.cU === "string" ? chapter.cU.trim() : "";
        const chapterId = chapter.id ?? chapter.chapterId;
        let url = explicitUrl ? resolveUrl(explicitUrl, pageUrl.href) : null;
        if (!url && chapterId !== void 0 && chapterId !== null) {
          url = new URL(`/chapter/${bookId}/${String(chapterId)}/`, pageUrl.origin).toString();
        }
        if (!url) continue;
        entries2.push({
          title,
          url: normalizeUrlForFetch(url)
        });
      }
    }
    return dedupeQidianTocEntries(entries2);
  }
  async function loadQidianTocEntries(indexUrl, currentUrl, setAbort) {
    const apiUrl = buildQidianCategoryUrl(indexUrl, currentUrl);
    if (!apiUrl) return [];
    const nativeResponse = await requestQidianCategoryNative(apiUrl, setAbort);
    if ((nativeResponse == null ? void 0 : nativeResponse.code) === 0) {
      return qidianCategoryToEntries(nativeResponse, indexUrl, currentUrl);
    }
    const gmResponse = await requestQidianCategoryGm(apiUrl, currentUrl || indexUrl, setAbort);
    return qidianCategoryToEntries(gmResponse, indexUrl, currentUrl);
  }
  const qidianTocLoader = {
    id: "qidian",
    matches: (context) => isQidianTocRequest(context.indexUrl, context.currentUrl, context.rule),
    load: (context) => loadQidianTocEntries(context.indexUrl, context.currentUrl, context.setAbort)
  };
  const __vite_glob_0_1 = Object.freeze( Object.defineProperty({
    __proto__: null,
    qidianTocLoader
  }, Symbol.toStringTag, { value: "Module" }));
  function isTwkanHost(hostname) {
    return /^twkan\.com$/i.test(hostname);
  }
  function resolveTwkanPageUrl(indexUrl, currentUrl) {
    const fallbackBase = typeof location !== "undefined" && typeof location.href === "string" && location.href || "https://twkan.com/";
    for (const candidate of [currentUrl, indexUrl]) {
      const abs = resolveUrl(candidate, fallbackBase);
      if (!abs) continue;
      try {
        const url = new URL(abs);
        if (isTwkanHost(url.hostname)) return url;
      } catch {
      }
    }
    return null;
  }
  function extractTwkanBookId(indexUrl, currentUrl) {
    for (const candidate of [currentUrl, indexUrl]) {
      const pageUrl = resolveTwkanPageUrl(candidate, currentUrl);
      if (!pageUrl) continue;
      const match = pageUrl.pathname.match(/^\/(?:txt|book)\/(\d+)(?:\/|$)/);
      if (match) return match[1];
    }
    return null;
  }
  function isTwkanTocRequest(indexUrl, currentUrl, rule) {
    if ((rule == null ? void 0 : rule.id) === "twkan") return true;
    return !!resolveTwkanPageUrl(indexUrl, currentUrl);
  }
  function buildTwkanChapterListUrl(indexUrl, currentUrl) {
    const pageUrl = resolveTwkanPageUrl(indexUrl, currentUrl);
    const bookId = extractTwkanBookId(indexUrl, currentUrl);
    if (!pageUrl || !bookId) return null;
    return new URL(`/ajax_novels/chapterlist/${bookId}.html`, pageUrl.origin).toString();
  }
  function getNativeFetch() {
    if (typeof unsafeWindow !== "undefined" && typeof unsafeWindow.fetch === "function") {
      return unsafeWindow.fetch.bind(unsafeWindow);
    }
    if (typeof window !== "undefined" && typeof window.fetch === "function") {
      return window.fetch.bind(window);
    }
    if (typeof fetch === "function") {
      return fetch;
    }
    return null;
  }
  async function requestTwkanChapterListNative(apiUrl, setAbort) {
    const fetcher = getNativeFetch();
    if (!fetcher) return null;
    const controller = new AbortController();
    setAbort(() => controller.abort());
    try {
      const response = await fetcher(apiUrl, {
        credentials: "include",
        headers: {
          Accept: "text/html, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest"
        },
        signal: controller.signal
      });
      if (!response.ok) return null;
      return await response.text();
    } catch {
      return null;
    } finally {
      setAbort(null);
    }
  }
  async function requestTwkanChapterListGm(apiUrl, referer, setAbort) {
    const gmXhr = typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest : null;
    if (!gmXhr) return null;
    return new Promise((resolve) => {
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        setAbort(null);
        resolve(value);
      };
      const headers = {
        Accept: "text/html, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (referer) {
        headers.Referer = referer;
      }
      const request = gmXhr({
        method: "GET",
        url: apiUrl,
        headers,
        timeout: 1e4,
        withCredentials: true,
        onload: (response) => {
          if (response.status < 200 || response.status >= 300) {
            finish(null);
            return;
          }
          finish(response.responseText);
        },
        onerror: () => finish(null),
        onabort: () => finish(null),
        ontimeout: () => finish(null)
      });
      setAbort(() => {
        try {
          request.abort();
        } catch {
        }
        finish(null);
      });
    });
  }
  function cleanTwkanTocTitle(title) {
    return title.replace(/^\s*\d+[.、\s]+/, "").trim();
  }
  function parseTwkanChapterList(html2, apiUrl) {
    var _a;
    if (!html2.trim() || typeof DOMParser === "undefined") return [];
    const doc2 = new DOMParser().parseFromString(html2, "text/html");
    const anchors = Array.from(doc2.querySelectorAll('ul li a[href], a[href*="/txt/"]'));
    const seen = new Set();
    const entries2 = [];
    for (const anchor of anchors) {
      const rawHref = (_a = anchor.getAttribute("href")) == null ? void 0 : _a.trim();
      if (!rawHref) continue;
      const url = resolveUrl(rawHref, apiUrl);
      if (!url) continue;
      let parsed;
      try {
        parsed = new URL(url);
      } catch {
        continue;
      }
      if (!isTwkanHost(parsed.hostname) || !/^\/txt\/\d+\/\d+\/?$/.test(parsed.pathname)) continue;
      const normalizedUrl = normalizeUrlForFetch(parsed.toString());
      if (seen.has(normalizedUrl)) continue;
      const title = cleanTwkanTocTitle(anchor.textContent || "") || `章节 ${entries2.length + 1}`;
      seen.add(normalizedUrl);
      entries2.push({
        title,
        url: normalizedUrl
      });
    }
    return entries2;
  }
  async function loadTwkanTocEntries(indexUrl, currentUrl, setAbort) {
    const apiUrl = buildTwkanChapterListUrl(indexUrl, currentUrl);
    if (!apiUrl) return [];
    const nativeHtml = await requestTwkanChapterListNative(apiUrl, setAbort);
    let entries2 = nativeHtml ? parseTwkanChapterList(nativeHtml, apiUrl) : [];
    if (entries2.length > 0) return entries2;
    const gmHtml = await requestTwkanChapterListGm(apiUrl, currentUrl || indexUrl, setAbort);
    entries2 = gmHtml ? parseTwkanChapterList(gmHtml, apiUrl) : [];
    return entries2;
  }
  const twkanTocLoader = {
    id: "twkan",
    matches: (context) => isTwkanTocRequest(context.indexUrl, context.currentUrl, context.rule),
    load: (context) => loadTwkanTocEntries(context.indexUrl, context.currentUrl, context.setAbort)
  };
  const __vite_glob_0_2 = Object.freeze( Object.defineProperty({
    __proto__: null,
    twkanTocLoader
  }, Symbol.toStringTag, { value: "Module" }));
  const modules = Object.assign({ "./goboo.ts": __vite_glob_0_0, "./qidian.ts": __vite_glob_0_1, "./twkan.ts": __vite_glob_0_2 });
  function isSpecialTocLoader(value) {
    if (!value || typeof value !== "object") return false;
    const maybe = value;
    return typeof maybe.id === "string" && typeof maybe.matches === "function" && typeof maybe.load === "function";
  }
  function isSpecialTocTitleCleaner(value) {
    if (!value || typeof value !== "object") return false;
    const maybe = value;
    return typeof maybe.id === "string" && typeof maybe.clean === "function";
  }
  const specialTocLoaders = Object.keys(modules).sort().flatMap((path) => Object.values(modules[path]).filter(isSpecialTocLoader));
  const specialTocTitleCleaners = Object.keys(modules).sort().flatMap((path) => Object.values(modules[path]).filter(isSpecialTocTitleCleaner));
  const CHAPTER_TITLE_PATTERNS = [
    /^.{0,10}第.{1,10}[章节回话篇集卷]/,
    /^\d{1,4}[.、\s]/,
    /^(序章|序幕|楔子|引子|终章|尾声|番外|后记|前言)/,
    /^chapter\s*\d+/i,
    /^(prologue|epilogue|preface)/i
  ];
  const NON_CHAPTER_TITLE_PATTERNS = [
    /^(公告|通知|声明|说明|必读|注意|警告|温馨提示)/,
    /上架感言|完本感言|请假|推迟|停更|断更|更新|爆更|上架通知|卷末感言/,
    /必看|必读|请务必阅读|读者必看/,
    /^(作者|关于作者|作品相关|设定|世界观|人物介绍|角色)/,
    /求.*票|求.*收藏|求.*订阅|求.*打赏|求.*推荐|求.*支持/,
    /新书|推荐|安利|宣传|书单|书评/,
    /^(目录|封面|简介|内容简介|书籍信息|作品信息)/,
    /^(VIP|付费|锁定|未解锁|需订阅|加入书架)$/i,
    /官网|公众号|微信|QQ群|粉丝群|书友群|交流群|读者群/,
    /登[录陆]|注册|充值|书架|书城|排行|分类|搜索|设置/,
    /首页|返回|上一页|下一页|翻页/,
    /^(章节|分卷|卷|部|篇)\s*[\d一二三四五六七八九十百千]+\s*$/,
    /^(正文|番外|VIP卷?|免费章节?)\s*$/
  ];
  function isLikelyChapterTitle(title) {
    const t = title.trim();
    return CHAPTER_TITLE_PATTERNS.some((p2) => p2.test(t));
  }
  function isNonChapterTitle(title) {
    const t = title.trim();
    if (t.length < 2) return true;
    return NON_CHAPTER_TITLE_PATTERNS.some((p2) => p2.test(t));
  }
  function isPlaceholderTocTitle(title) {
    return /^章节\s*\d+$/i.test(title.trim());
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
      '[class*="chapter-title"]',
      '[class*="chapterTitle"]',
      ".line_1",
      "h2",
      "h3"
    ];
    for (const sel of titleSelectors) {
      const el = a.querySelector(sel);
      if (el) {
        const text2 = (el.textContent || "").trim();
        if (text2) return text2;
      }
    }
    const firstP = a.querySelector("p");
    if (firstP) {
      const allP = a.querySelectorAll("p");
      if (allP.length > 1) {
        const text2 = (firstP.textContent || "").trim();
        if (text2) return text2;
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
  function cleanTocTitleForUrl(title, url) {
    let cleaned = title.trim();
    for (const cleaner of specialTocTitleCleaners) {
      cleaned = cleaner.clean(cleaned, url);
    }
    return cleaned;
  }
  function filterTocEntries(entries2) {
    if (entries2.length < 5) return entries2;
    const bookIdCounts = new Map();
    for (const entry of entries2) {
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
    const sameBookEntries = dominantBookId && maxCount >= 5 ? entries2.filter((entry) => {
      const bookId = extractBookId(entry.url);
      return !bookId || bookId === dominantBookId;
    }) : entries2;
    const patternCounts = new Map();
    for (const entry of sameBookEntries) {
      const pattern = extractUrlPattern(entry.url);
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    }
    const sortedPatterns = Array.from(patternCounts.entries()).sort((a, b) => b[1] - a[1]);
    const dominantPatterns = new Set();
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
  function sortTocEntries(entries2) {
    if (entries2.length < 5) return entries2;
    const entriesWithNum = entries2.map((entry, index) => ({
      index,
      entry,
      num: extractChapterNumber(entry.title)
    })).filter((item) => item.num !== null);
    if (entriesWithNum.length < entries2.length * 0.3 || entriesWithNum.length < 3) {
      return entries2;
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
      return [...entries2].reverse();
    }
    return entries2;
  }
  function dedupeTocEntries(candidates) {
    const seenUrls = new Map();
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
  function collectTocCandidates(doc2, base, rule) {
    var _a;
    const links = Array.from(doc2.querySelectorAll("a[href]"));
    const textPattern = /(第.{1,20}[章节回话篇集卷幕]|[章回节話幕]|chapter|\d+)/i;
    const urlPattern = /(chapter|read|book|novel|txt|\/\d+)[/_-]\d+|\/\d+\.html?$|\/xs_[^/]+\/\d+\/\d+(?:\/\d+)?/i;
    const excludeAncestors = (((_a = rule == null ? void 0 : rule.toc) == null ? void 0 : _a.excludeAncestors) || "").split(",").map((s) => s.trim()).filter(Boolean);
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
      const text2 = extractTocLinkTitle(a);
      const href = a.getAttribute("href") || "";
      const abs = resolveUrl(href, base);
      if (!abs) continue;
      const url = normalizeUrlForFetch(abs);
      if (!(textPattern.test(text2) || urlPattern.test(href))) {
        continue;
      }
      const title = cleanTocTitleForUrl(text2 || `章节 ${candidates.length + 1}`, url);
      candidates.push({ title, url });
    }
    return candidates;
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
      const text2 = a.textContent || "";
      if (!isTocNextPageText(text2)) continue;
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
  const MAX_TOC_PAGES = 120;
  async function loadTocEntriesPaged(indexUrl, currentUrl, rule, setAbort) {
    const loaderContext = {
      indexUrl,
      currentUrl,
      rule,
      setAbort
    };
    const loader = specialTocLoaders.find((item) => item.matches(loaderContext));
    if (loader) {
      return loader.load(loaderContext);
    }
    const visitedPages = new Set();
    const seenChapterUrls = new Set();
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
        const result = await promise;
        if (aborted) break;
        if (result.error === "abort") break;
        if (!result.doc) break;
        const effectivePageUrl = result.finalUrl || pageUrl;
        const pageCandidates = collectTocCandidates(result.doc, effectivePageUrl, rule);
        allCandidates.push(...pageCandidates);
        let newCount = 0;
        for (const entry of pageCandidates) {
          if (!seenChapterUrls.has(entry.url)) {
            seenChapterUrls.add(entry.url);
            newCount++;
          }
        }
        if (visitedPages.size >= 2 && newCount === 0) break;
        const nextPageUrl = findNextTocPageUrl(result.doc, effectivePageUrl, indexUrl);
        if (!nextPageUrl) break;
        referer = effectivePageUrl;
        pageUrl = nextPageUrl;
      }
    } finally {
      setAbort(null);
    }
    if (allCandidates.length === 0) return [];
    return filterTocEntries(dedupeTocEntries(allCandidates));
  }
  function createTocActions(ctx) {
    const _loadTocEntriesPaged = ctx.loadTocEntriesPaged ?? loadTocEntriesPaged;
    async function setTocEntries(entries2) {
      ctx.tocOriginal.value = entries2;
      await ctx.applyTocConversion(ctx.currentConversionMode.value);
    }
    async function ensureIndexUrl() {
      var _a;
      const current = ctx.chapter.value;
      const currentUrl = (current == null ? void 0 : current.url) || "";
      const existing = current == null ? void 0 : current.indexUrl;
      if (existing && (!currentUrl || normalizeUrlForBlock(existing) !== normalizeUrlForBlock(currentUrl))) {
        return existing;
      }
      if (!currentUrl) return void 0;
      try {
        const parser = getParser();
        const detected = (_a = parser.detect(document, currentUrl).results.navigation.index) == null ? void 0 : _a.url;
        if (!detected) return void 0;
        const normalized = normalizeUrlForFetch(detected);
        for (const entry of ctx.chapters.value) {
          const existingIndex = entry.chapter.indexUrl;
          const entryUrl = entry.chapter.url;
          const looksLikeSelf = existingIndex && entryUrl ? normalizeUrlForBlock(existingIndex) === normalizeUrlForBlock(entryUrl) : false;
          if (!existingIndex || looksLikeSelf) {
            entry.chapter.indexUrl = normalized;
          }
        }
        return normalized;
      } catch (e) {
        console.error("[MNR] Failed to detect indexUrl:", e);
        return void 0;
      }
    }
    async function loadToc() {
      var _a, _b;
      const runId = ctx.runtime.sessionId();
      if (ctx.toc.value.length > 0 || ctx.tocLoading.value) return;
      const currentUrl = ((_a = ctx.chapter.value) == null ? void 0 : _a.url) || "";
      let indexUrl = (_b = ctx.chapter.value) == null ? void 0 : _b.indexUrl;
      if (!indexUrl || currentUrl && normalizeUrlForBlock(indexUrl) === normalizeUrlForBlock(currentUrl)) {
        indexUrl = await ensureIndexUrl() || void 0;
      }
      if (!indexUrl) {
        ctx.showToast("未检测到目录链接", "info", 2500);
        return;
      }
      ctx.tocLoading.value = true;
      try {
        let entries2 = await _loadTocEntriesPaged(
          indexUrl,
          currentUrl || indexUrl,
          ctx.rule.value ?? void 0,
          (abort) => {
            if (!ctx.runtime.isSessionStale(runId)) {
              ctx.tocAbort.value = abort;
            }
          }
        );
        if (ctx.runtime.isSessionStale(runId)) return;
        if (entries2.length === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 400));
          if (ctx.runtime.isSessionStale(runId)) return;
          entries2 = await _loadTocEntriesPaged(
            indexUrl,
            currentUrl || indexUrl,
            ctx.rule.value ?? void 0,
            (abort) => {
              if (!ctx.runtime.isSessionStale(runId)) {
                ctx.tocAbort.value = abort;
              }
            }
          );
          if (ctx.runtime.isSessionStale(runId)) return;
        }
        await setTocEntries(entries2);
        if (ctx.runtime.isSessionStale(runId)) return;
        if (entries2.length === 0) {
          ctx.showToast("目录解析为空，可稍后重试或刷新页面", "info", 2500);
        }
      } catch (e) {
        if (!ctx.runtime.isSessionStale(runId)) {
          console.error("[MNR] Failed to load TOC:", e);
          ctx.showToast("目录加载失败，可稍后重试", "error", 2500);
        }
      } finally {
        if (!ctx.runtime.isSessionStale(runId)) {
          ctx.tocLoading.value = false;
          ctx.tocAbort.value = null;
        }
      }
    }
    return { setTocEntries, ensureIndexUrl, loadToc };
  }
  async function parseWithSectionMerge(parser, initialDoc, url, _referer) {
    const merger = createSectionMerger(parser);
    return merger.merge(initialDoc, url);
  }
  function trimCachedContents(cachedContents, maxSessionCache) {
    if (cachedContents.size <= maxSessionCache) return;
    const entries2 = Array.from(cachedContents.entries()).sort(
      (a, b) => a[1].cachedAt - b[1].cachedAt
    );
    const toDelete = entries2.slice(0, entries2.length - maxSessionCache);
    for (const [url] of toDelete) {
      cachedContents.delete(url);
    }
  }
  function trimNavFailures(navFailures, maxNavFailures) {
    const limit = Math.max(0, maxNavFailures);
    if (navFailures.size <= limit) return;
    const entries2 = Array.from(navFailures.entries()).sort(
      (a, b) => a[1].nextRetryAt - b[1].nextRetryAt
    );
    const toDeleteCount = Math.min(entries2.length, navFailures.size - limit);
    for (let i = 0; i < toDeleteCount; i++) {
      navFailures.delete(entries2[i][0]);
    }
  }
  function createCacheAll(ctx) {
    async function startCacheAll(urls) {
      var _a, _b, _c, _d, _e;
      const runId = ctx.runtime.sessionId();
      if (ctx.cacheProgress.value.running) return;
      const seenUrls = new Set();
      await ctx.restoreCache();
      if (ctx.runtime.isSessionStale(runId)) return;
      const persistedSet = new Set(ctx.persistedUrls.value);
      const cacheBook = getCurrentBookCacheKey((_a = ctx.chapter.value) == null ? void 0 : _a.indexUrl);
      let taskList = urls ? [...urls] : [];
      ctx.cacheQueue.value = [...taskList];
      if (!taskList.length) {
        const indexUrl = (_b = ctx.chapter.value) == null ? void 0 : _b.indexUrl;
        const currentUrl = (_c = ctx.chapter.value) == null ? void 0 : _c.url;
        if (indexUrl) {
          const tocEntries = await loadTocEntriesPaged(
            indexUrl,
            currentUrl || indexUrl,
            ctx.rule.value ?? void 0,
            (abort) => {
              if (!ctx.runtime.isSessionStale(runId)) {
                ctx.cacheAbort.value = abort;
              }
            }
          );
          if (ctx.runtime.isSessionStale(runId)) return;
          ctx.cacheAbort.value = null;
          const tocLinks = tocEntries.map((e) => normalizeUrlForFetch(e.url)).slice(0, 1e4);
          taskList = tocLinks.filter(
            (u) => !ctx.loadedUrls.value.has(u) && !ctx.cachedContents.value.has(u) && !persistedSet.has(u)
          );
          ctx.cacheQueue.value = [...taskList];
        }
      }
      const estimatedTotal = taskList.length;
      if (ctx.runtime.isSessionStale(runId)) return;
      if (estimatedTotal === 0) {
        ctx.cacheProgress.value = { done: 0, total: 0, running: false };
        return;
      }
      ctx.cacheProgress.value = { done: 0, total: estimatedTotal, running: true };
      let nextUrl = taskList.shift();
      let referer = ((_d = ctx.chapters.value[ctx.chapters.value.length - 1]) == null ? void 0 : _d.chapter.url) || ((_e = ctx.chapter.value) == null ? void 0 : _e.url);
      let persistedSinceIndexWrite = 0;
      let hasWrittenIndexCheckpoint = false;
      while (ctx.cacheProgress.value.running && nextUrl) {
        const targetUrl = normalizeUrlForFetch(nextUrl);
        if (seenUrls.has(targetUrl) || ctx.loadedUrls.value.has(targetUrl) || ctx.cachedContents.value.has(targetUrl) || persistedSet.has(targetUrl)) {
          ctx.cacheProgress.value = {
            ...ctx.cacheProgress.value,
            done: ctx.cacheProgress.value.done + 1
          };
          nextUrl = taskList.shift() ?? null;
          continue;
        }
        const { promise, abort } = fetchAndParseUrl(targetUrl, referer);
        if (ctx.runtime.isSessionStale(runId)) {
          abort();
          break;
        }
        ctx.cacheAbort.value = abort;
        const result = await promise;
        if (ctx.runtime.isSessionStale(runId)) {
          abort();
          break;
        }
        ctx.cacheAbort.value = null;
        if (result.error === "abort") {
          break;
        }
        if (!result.doc) {
          nextUrl = taskList.shift() ?? null;
          continue;
        }
        const parser = getParser();
        const parsed = await parseWithSectionMerge(parser, result.doc, targetUrl);
        if (ctx.runtime.isSessionStale(runId)) {
          break;
        }
        if (!parsed) {
          nextUrl = taskList.shift() ?? null;
          continue;
        }
        const cached = {
          chapter: parsed,
          rule: parsed.rule,
          cachedAt: Date.now()
        };
        ctx.cachedContents.value.set(parsed.url, cached);
        seenUrls.add(parsed.url);
        trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
        if (cacheBook) {
          const persisted = persistCachedChapter(cacheBook, parsed.url, cached);
          if (persisted) {
            persistedSet.add(parsed.url);
            persistedSinceIndexWrite += 1;
            if (!hasWrittenIndexCheckpoint || persistedSinceIndexWrite >= PERSISTED_CACHE_INDEX_CHECKPOINT_CHAPTERS) {
              if (persistCacheIndex(cacheBook, persistedSet)) {
                persistedSinceIndexWrite = 0;
                hasWrittenIndexCheckpoint = true;
              }
            }
          }
        }
        ctx.cacheProgress.value = {
          ...ctx.cacheProgress.value,
          done: ctx.cacheProgress.value.done + 1
        };
        referer = parsed.url;
        nextUrl = taskList.shift() ?? (parsed.nextUrl ? normalizeUrlForFetch(parsed.nextUrl) : null);
        if (taskList.length === 0 && nextUrl) {
          const normalizedNext = normalizeUrlForFetch(nextUrl);
          if (!seenUrls.has(normalizedNext) && !ctx.loadedUrls.value.has(normalizedNext) && !ctx.cachedContents.value.has(normalizedNext) && !persistedSet.has(normalizedNext)) {
            ctx.cacheProgress.value = {
              ...ctx.cacheProgress.value,
              total: ctx.cacheProgress.value.done + 1
            };
          }
        }
      }
      if (ctx.runtime.isSessionStale(runId)) return;
      ctx.cacheProgress.value = {
        ...ctx.cacheProgress.value,
        total: ctx.cacheProgress.value.done,
        running: false
      };
      ctx.cacheAbort.value = null;
      if (cacheBook && persistedSet.size > 0) {
        ctx.persistedUrls.value = persistedSet;
      }
      await ctx.persistCache();
    }
    function cancelCacheAll() {
      var _a, _b;
      ctx.cacheProgress.value = { done: 0, total: 0, running: false };
      ctx.cacheQueue.value = [];
      (_b = (_a = ctx.cacheAbort).value) == null ? void 0 : _b.call(_a);
      ctx.cacheAbort.value = null;
    }
    return { startCacheAll, cancelCacheAll };
  }
  function recordNavFailure(failures, key, opts) {
    const prev = failures.get(key);
    const count = ((prev == null ? void 0 : prev.count) || 0) + 1;
    const backoffMs = calculateBackoff(count);
    failures.set(key, { count, nextRetryAt: Date.now() + backoffMs });
    trimNavFailures(failures, opts.maxFailures);
    return count;
  }
  function clearNavFailure(failures, key) {
    failures.delete(key);
  }
  function isInvalidChapterUrl(url, currentChapterUrl) {
    try {
      const normalizedUrl = normalizeCiwemaoChapterUrl(url);
      const parsed = new URL(normalizedUrl);
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
/^https?:\/\/[^/]+\/(?:index|home|main)?\.?(?:html?|php)?$/i,
/\/(?:user|login|register|search|rank|category|tag|author|help|about|contact|faq)\/?/i,
        /\/(?:book|novel|xiaoshuo|info)\/?\d*\/?$/i,
/\/(?:list|catalog|toc|contents?)\.?(?:html?)?$/i,
        /\/(?:index|list|last|LastPage|end)\.(?:html?|php|aspx)/i,
/\/chapter\/get_par_tsu_list(?:$|[/?#])/i,
        /\/chapter\/ajax_get_session_code(?:$|[/?#])/i,
        /\/chapter\/get_book_chapter_detail_info(?:$|[/?#])/i
      ];
      for (const pattern of invalidPatterns) {
        if (pattern.test(normalizedUrl) || pattern.test(pathname)) {
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
  function isVipChapterPage(doc2) {
    var _a, _b;
    try {
      const url = doc2._mnrUrl || ((_a = doc2.location) == null ? void 0 : _a.href) || doc2.baseURI || "";
      if (/^https?:\/\/(?:www|wap)\.ciweimao\.com\/chapter\/\d+/i.test(url)) {
        const hasChapterShell = !!doc2.querySelector("#J_BookCnt, #J_BookRead");
        if (hasChapterShell) return false;
      }
    } catch {
    }
    const rawText = ((_b = doc2.body) == null ? void 0 : _b.textContent) || "";
    if (!rawText) return false;
    const text2 = normalizeTextForVipDetection(rawText);
    const patterns = [
      /本章(?:为|是)?vip章节/,
      /(vip|付费|收费)(?:章节|内容)/,
      /(未订阅|未购买|未解锁).{0,10}(本章|本章节|章节|内容)/,
      /(本章|本章节|章节|内容).{0,12}(?:已)?锁定/,
      /(本章|本章节|章节|内容).{0,12}(?:需|需要).{0,6}(订阅|购买|付费|解锁)/,
      /(订阅|购买|付费|解锁).{0,12}(后|即可|才能|方可|才可).{0,12}(阅读|查看|继续阅读|继续查看)/,
      /(请|需).{0,6}(订阅|购买|付费|解锁).{0,12}(阅读|查看|继续阅读|继续查看)/,
      /立即(订阅|购买|解锁|充值)/,
      /(订阅|购买|解锁)本章/
    ];
    if (patterns.some((re) => re.test(text2))) return true;
    const ctaText = Array.from(
      doc2.querySelectorAll('a,button,input[type="button"],input[type="submit"]')
    ).map((el) => {
      if (el instanceof HTMLInputElement) return el.value || "";
      return el.textContent || "";
    }).join(" ");
    const cta = normalizeTextForVipDetection(ctaText);
    if (/立即(订阅|购买|解锁|充值)/.test(cta) && /(vip|付费|订阅|购买|解锁|锁定)/.test(text2)) {
      return true;
    }
    return false;
  }
  function detectTocPage(content, pageUrl, currentChapterUrl) {
    const tocUrlPatterns = [
      /\/book\/\d+\.html?$/i,
      /\/book\/\d+\/?$/i,
      /\/novel\/\d+\/?$/i,
      /\/xiaoshuo\/\d+\/?$/i,
      /\/info\/\d+\.html?$/i,
      /\/\d+\/index\.html?$/i,
      /\/booklist/i,
      /\/catalog/i,
      /\/contents?\.html?$/i,
      /\/list\.html?$/i,
      /\/toc\.html?$/i
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
    const chapterLinkPattern = /\/(chapter|txt|read|book|novel|article)\/|\d+\.html?$|\/xs_[^/]+\/\d+\/\d+(?:\/\d+)?/i;
    const chapterLinks = Array.from(links).filter((a) => {
      const href = a.getAttribute("href") || "";
      return chapterLinkPattern.test(href);
    });
    if (chapterLinks.length > 10) {
      return true;
    }
    const normalizeUrlLocal = (url) => {
      try {
        const u = new URL(url, pageUrl);
        return u.pathname.replace(/\/$/, "");
      } catch {
        return url.replace(/\/$/, "");
      }
    };
    const currentPath = normalizeUrlLocal(currentChapterUrl);
    const hasLinkToCurrentChapter = Array.from(links).some((a) => {
      const href = a.getAttribute("href");
      if (!href) return false;
      return normalizeUrlLocal(href) === currentPath;
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
  function loadDocumentInIframe(url, timeoutMs = 15e3) {
    let iframe = null;
    let timeoutId = null;
    let settled = false;
    let resolveResult = null;
    const clearTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const cleanup = () => {
      clearTimer();
      if (iframe) {
        iframe.remove();
        iframe = null;
      }
    };
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (result) {
        clearTimer();
      } else {
        cleanup();
      }
      resolveResult == null ? void 0 : resolveResult(result);
    };
    const promise = new Promise((resolve) => {
      resolveResult = resolve;
      iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.tabIndex = -1;
      iframe.style.cssText = [
        "position:absolute",
        "display:block!important",
        "left:-10000px",
        "top:0",
        "width:1200px",
        "height:8000px",
        "opacity:0",
        "pointer-events:none",
        "border:0"
      ].join(";");
      iframe.onload = () => {
        window.setTimeout(() => {
          try {
            const doc2 = iframe == null ? void 0 : iframe.contentDocument;
            if (!doc2) {
              finish(null);
              return;
            }
            finish({ doc: doc2, cleanup });
          } catch {
            finish(null);
          }
        }, 300);
      };
      iframe.onerror = () => finish(null);
      timeoutId = window.setTimeout(() => finish(null), timeoutMs);
      const parent = document.body || document.documentElement;
      if (!parent) {
        finish(null);
        return;
      }
      parent.appendChild(iframe);
      iframe.src = url;
    });
    return {
      promise,
      abort: () => finish(null)
    };
  }
  async function loadFetchDocument(ctx, load, runId, referer) {
    const ciweimaoDoc = await loadCiweimaoApiDocument(load);
    if (ciweimaoDoc) return ciweimaoDoc;
    const fetchLoader = fetchAndParseUrl(load.targetUrl, referer);
    const abort = fetchLoader.abort;
    if (ctx.runtime.isViewStale(runId)) {
      abort();
      return "abort";
    }
    load.pendingAbortRef.value = abort;
    const fetchResult = await fetchLoader.promise;
    if (ctx.runtime.isViewStale(runId)) {
      abort();
      return "abort";
    }
    clearPendingAbort(load, abort);
    if (fetchResult.error === "abort") {
      return "abort";
    }
    return fetchResult.doc;
  }
  async function loadCiweimaoApiDocument(load) {
    var _a, _b;
    const ruleId = ((_a = load.refChapter.rule) == null ? void 0 : _a.id) || ((_b = load.refChapter.chapter.rule) == null ? void 0 : _b.id) || "";
    if (ruleId !== "ciweimao" && ruleId !== "ciweimao-wap") return null;
    return fetchCiweimaoApiDocument(load.targetUrl, {
      bookTitle: load.refChapter.chapter.bookTitle,
      indexUrl: load.refChapter.chapter.indexUrl,
      url: load.refChapter.chapter.url
    });
  }
  async function parseCandidateDocument(ctx, load, parser, doc2, runId, referer, source) {
    if (isCloudflareChallenge(doc2)) {
      const count = recordNavFailure(ctx.navFailures, load.navKey, {
        maxFailures: MAX_NAV_FAILURES
      });
      if (source === "manual" || count === 1) {
        ctx.showToast("Cloudflare 验证页面，请在新标签页中完成验证后重试", "info", 4e3);
      }
      return "blocked";
    }
    if (isVipChapterPage(doc2)) {
      ctx.vipBlockedUrls.value.add(normalizeUrlForBlock(load.targetUrl));
      ctx.showToast(VIP_BLOCK_TOAST, "info", 3e3);
      return "blocked";
    }
    const parsed = await parseWithSectionMerge(parser, doc2, load.targetUrl);
    if (ctx.runtime.isViewStale(runId)) {
      return "abort";
    }
    return parsed;
  }
  function clearPendingAbort(load, abort) {
    if (load.pendingAbortRef.value === abort) {
      load.pendingAbortRef.value = null;
    }
  }
  async function insertCachedChapter(ctx, cached, position) {
    const suffix = position === "append" ? "cached" : "cached-prev";
    const id = `chapter-${Date.now()}-${suffix}-${ctx.chapters.value.length}`;
    const entry = {
      chapter: { ...cached.chapter },
      rule: cached.rule,
      id
    };
    if (position === "append") {
      ctx.chapters.value.push(entry);
    } else {
      ctx.chapters.value.unshift(entry);
      ctx.currentChapterIndex.value++;
    }
    ctx.loadedUrls.value.add(entry.chapter.url);
    ctx.originalContents.value.set(id, cached.chapter.content);
    ctx.originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle
    });
    if (ctx.currentConversionMode.value !== "none") {
      await ctx.applyConversionToChapterEntry(id, ctx.currentConversionMode.value);
    }
    trimDisplayChapters(ctx, position === "append");
    return true;
  }
  async function insertParsedChapter(ctx, load, parsed) {
    const suffix = load.isNext ? "" : "prev-";
    const id = `chapter-${Date.now()}-${suffix}${ctx.chapters.value.length}`;
    const entry = {
      chapter: parsed,
      rule: parsed.rule,
      id
    };
    if (load.isNext) {
      ctx.chapters.value.push(entry);
    } else {
      ctx.chapters.value.unshift(entry);
      ctx.currentChapterIndex.value++;
    }
    ctx.loadedUrls.value.add(parsed.url);
    ctx.originalContents.value.set(id, parsed.content);
    ctx.originalTitles.value.set(id, { title: parsed.title, bookTitle: parsed.bookTitle });
    ctx.cachedContents.value.set(parsed.url, {
      chapter: parsed,
      rule: parsed.rule,
      cachedAt: Date.now()
    });
    trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
    if (ctx.currentConversionMode.value !== "none") {
      await ctx.applyConversionToChapterEntry(id, ctx.currentConversionMode.value);
    }
    if (!ctx.history.value.includes(parsed.url)) {
      if (load.isNext) {
        ctx.history.value.push(parsed.url);
      } else {
        ctx.history.value.unshift(parsed.url);
      }
    }
    trimDisplayChapters(ctx, load.isNext);
    return true;
  }
  async function rebuildChaptersFromCache(ctx, cached, url) {
    ctx.chapters.value = [];
    ctx.currentChapterIndex.value = 0;
    ctx.loadedUrls.value.clear();
    ctx.originalContents.value.clear();
    ctx.originalTitles.value.clear();
    const id = `chapter-${Date.now()}-jump-0`;
    ctx.chapters.value.push({
      chapter: { ...cached.chapter },
      rule: cached.rule,
      id
    });
    ctx.loadedUrls.value.add(url);
    ctx.originalContents.value.set(id, cached.chapter.content);
    ctx.originalTitles.value.set(id, {
      title: cached.chapter.title,
      bookTitle: cached.chapter.bookTitle
    });
    if (ctx.currentConversionMode.value !== "none") {
      await ctx.applyConversionToChapterEntry(id, ctx.currentConversionMode.value);
    }
    return true;
  }
  function trimDisplayChapters(ctx, isAppend) {
    if (ctx.chapters.value.length <= MAX_CACHED_CHAPTERS) return;
    if (isAppend && ctx.currentChapterIndex.value > 2) {
      const removed = ctx.chapters.value.shift();
      if (removed) {
        ctx.loadedUrls.value.delete(removed.chapter.url);
        ctx.originalContents.value.delete(removed.id);
        ctx.originalTitles.value.delete(removed.id);
        ctx.currentChapterIndex.value = Math.max(0, ctx.currentChapterIndex.value - 1);
      }
      return;
    }
    if (!isAppend) {
      const removed = ctx.chapters.value.pop();
      if (removed) {
        ctx.loadedUrls.value.delete(removed.chapter.url);
        ctx.originalContents.value.delete(removed.id);
        ctx.originalTitles.value.delete(removed.id);
      }
    }
  }
  function prepareChapterLoad(ctx, direction, source) {
    const isNext = direction === "next";
    const refChapter = isNext ? ctx.chapters.value[ctx.chapters.value.length - 1] : ctx.chapters.value[0];
    const isLoadingRef = isNext ? ctx.isLoadingNext : ctx.isLoadingPrev;
    const pendingAbortRef = isNext ? ctx.pendingNextAbort : ctx.pendingPrevAbort;
    const endMessage = isNext ? "已经是最后一章了" : "已经是第一章了";
    const errorMessage = isNext ? "加载下一章失败" : "加载上一章失败";
    if (isLoadingRef.value) {
      return null;
    }
    const rawTargetUrl = isNext ? refChapter == null ? void 0 : refChapter.chapter.nextUrl : refChapter == null ? void 0 : refChapter.chapter.prevUrl;
    if (!rawTargetUrl || !refChapter) {
      if (source === "manual") {
        ctx.showToast(endMessage, "info");
      }
      return null;
    }
    const targetUrl = normalizeUrlForFetch(rawTargetUrl);
    if (targetUrl !== rawTargetUrl) {
      if (isNext) {
        refChapter.chapter.nextUrl = targetUrl;
      } else {
        refChapter.chapter.prevUrl = targetUrl;
      }
    }
    if (refChapter.chapter.indexUrl && normalizeUrl(targetUrl) === normalizeUrl(refChapter.chapter.indexUrl)) {
      ctx.blockedNavUrls.value.add(normalizeUrlForBlock(targetUrl));
      if (source === "manual") {
        ctx.showToast(endMessage, "info");
      }
      return null;
    }
    if (ctx.vipBlockedUrls.value.has(normalizeUrlForBlock(targetUrl))) {
      ctx.showToast(VIP_BLOCK_TOAST, "info", 3e3);
      return null;
    }
    const navKey = normalizeUrlForBlock(targetUrl);
    if (ctx.blockedNavUrls.value.has(navKey)) {
      if (source === "manual") {
        ctx.showToast(endMessage, "info");
      }
      return null;
    }
    const failure = ctx.navFailures.get(navKey);
    if (failure && Date.now() < failure.nextRetryAt) {
      if (source === "manual") {
        ctx.showToast("加载失败过于频繁，请稍后重试", "info", 2e3);
      }
      return null;
    }
    if (ctx.loadedUrls.value.has(targetUrl)) {
      return null;
    }
    return {
      direction,
      endMessage,
      errorMessage,
      isLoadingRef,
      isNext,
      navKey,
      pendingAbortRef,
      refChapter,
      targetUrl
    };
  }
  function validateTargetChapterUrl(ctx, load, source) {
    if (!isInvalidChapterUrl(load.targetUrl, load.refChapter.chapter.url)) {
      return true;
    }
    load.isLoadingRef.value = false;
    ctx.blockedNavUrls.value.add(load.navKey);
    if (source === "manual") {
      ctx.showToast(load.endMessage, "info");
    }
    return false;
  }
  function createNavigation(ctx) {
    async function loadChapter(direction, source) {
      var _a, _b;
      const runId = ctx.runtime.viewId();
      const load = prepareChapterLoad(ctx, direction, source);
      if (!load) return false;
      const cached = ctx.cachedContents.value.get(load.targetUrl);
      if (cached) {
        return insertCachedChapter(ctx, cached, load.isNext ? "append" : "prepend");
      }
      if (ctx.persistedUrls.value.has(load.targetUrl)) {
        const persisted = await ctx.getPersistedCachedChapter(load.targetUrl);
        if (ctx.runtime.isViewStale(runId)) return false;
        if (persisted) {
          const sessionCached = { ...persisted, cachedAt: Date.now() };
          ctx.cachedContents.value.set(load.targetUrl, sessionCached);
          trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
          return insertCachedChapter(ctx, sessionCached, load.isNext ? "append" : "prepend");
        }
      }
      load.isLoadingRef.value = true;
      if (load.pendingAbortRef.value) {
        load.pendingAbortRef.value();
        load.pendingAbortRef.value = null;
      }
      if (!validateTargetChapterUrl(ctx, load, source)) {
        return false;
      }
      try {
        const referer = load.refChapter.chapter.url;
        const parser = getParser();
        let cleanupIframe = null;
        const recordLoadFailure = () => {
          const count = recordNavFailure(ctx.navFailures, load.navKey, {
            maxFailures: MAX_NAV_FAILURES
          });
          if (source === "manual" || count === 1) {
            ctx.showToast(load.errorMessage, "error", 2500);
          }
        };
        let parsed = null;
        if ((_b = (_a = load.refChapter.rule) == null ? void 0 : _a.advanced) == null ? void 0 : _b.useIframe) {
          const iframeLoader = loadDocumentInIframe(load.targetUrl);
          const abort = iframeLoader.abort;
          if (ctx.runtime.isViewStale(runId)) {
            abort();
            return false;
          }
          load.pendingAbortRef.value = abort;
          const iframeResult = await iframeLoader.promise;
          if (ctx.runtime.isViewStale(runId)) {
            iframeResult == null ? void 0 : iframeResult.cleanup();
            abort();
            return false;
          }
          clearPendingAbort(load, abort);
          cleanupIframe = (iframeResult == null ? void 0 : iframeResult.cleanup) || null;
          if (iframeResult == null ? void 0 : iframeResult.doc) {
            let iframeParsed = null;
            try {
              iframeParsed = await parseCandidateDocument(
                ctx,
                load,
                parser,
                iframeResult.doc,
                runId,
                referer,
                source
              );
            } finally {
              cleanupIframe == null ? void 0 : cleanupIframe();
              cleanupIframe = null;
            }
            if (iframeParsed === "abort" || iframeParsed === "blocked") {
              return false;
            }
            parsed = iframeParsed;
          }
        }
        cleanupIframe == null ? void 0 : cleanupIframe();
        if (!parsed) {
          const fetchDoc = await loadFetchDocument(ctx, load, runId, referer);
          if (fetchDoc === "abort") {
            return false;
          }
          if (!fetchDoc) {
            recordLoadFailure();
            return false;
          }
          const fetchParsed = await parseCandidateDocument(
            ctx,
            load,
            parser,
            fetchDoc,
            runId,
            referer,
            source
          );
          if (fetchParsed === "abort" || fetchParsed === "blocked") {
            return false;
          }
          parsed = fetchParsed;
        }
        if (ctx.runtime.isViewStale(runId)) {
          return false;
        }
        if (!parsed) {
          recordLoadFailure();
          return false;
        }
        if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
        if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
        if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);
        const isTocPage = detectTocPage(parsed.content, load.targetUrl, load.refChapter.chapter.url);
        if (isTocPage) {
          ctx.blockedNavUrls.value.add(load.navKey);
          if (source === "manual") {
            ctx.showToast(load.endMessage, "info");
          }
          return false;
        }
        if (!load.isNext) {
          if (parsed.nextUrl && normalizeUrl(parsed.nextUrl) === normalizeUrl(load.refChapter.chapter.url)) {
          } else if (parsed.prevUrl && !parsed.nextUrl) {
            ctx.blockedNavUrls.value.add(load.navKey);
            return false;
          }
        }
        clearNavFailure(ctx.navFailures, load.navKey);
        return insertParsedChapter(ctx, load, parsed);
      } catch (e) {
        if (!ctx.runtime.isViewStale(runId)) {
          console.error(`[MNR] Failed to load ${direction} chapter:`, e);
          ctx.setError(load.errorMessage);
        }
        return false;
      } finally {
        if (!ctx.runtime.isViewStale(runId)) {
          load.isLoadingRef.value = false;
        }
      }
    }
    async function loadNextChapter(source = "auto") {
      return loadChapter("next", source);
    }
    async function loadPrevChapter(source = "manual") {
      return loadChapter("prev", source);
    }
    async function rebuildChaptersAround(targetUrl) {
      var _a, _b, _c, _d, _e, _f;
      const runId = ctx.runtime.bumpView();
      const url = normalizeUrlForFetch(targetUrl);
      (_b = (_a = ctx.pendingNextAbort).value) == null ? void 0 : _b.call(_a);
      ctx.pendingNextAbort.value = null;
      (_d = (_c = ctx.pendingPrevAbort).value) == null ? void 0 : _d.call(_c);
      ctx.pendingPrevAbort.value = null;
      (_f = (_e = ctx.reloadAbort).value) == null ? void 0 : _f.call(_e);
      ctx.reloadAbort.value = null;
      ctx.isLoading.value = false;
      ctx.isLoadingPrev.value = false;
      ctx.isLoadingNext.value = false;
      let cached = ctx.cachedContents.value.get(url);
      if (!cached && ctx.persistedUrls.value.has(url)) {
        const persisted = await ctx.getPersistedCachedChapter(url);
        if (ctx.runtime.isViewStale(runId)) return false;
        if (persisted) {
          cached = { ...persisted, cachedAt: Date.now() };
          ctx.cachedContents.value.set(url, cached);
          trimCachedContents(ctx.cachedContents.value, MAX_SESSION_CACHE);
        }
      }
      if (!cached) return false;
      if (ctx.runtime.isViewStale(runId)) return false;
      return rebuildChaptersFromCache(ctx, cached, url);
    }
    async function reloadCurrentChapter() {
      var _a, _b;
      const runId = ctx.runtime.viewId();
      const current = ctx.chapters.value[ctx.currentChapterIndex.value];
      if (!current) return;
      const url = current.chapter.url;
      ctx.showToast("正在重新加载...", "info");
      (_b = (_a = ctx.reloadAbort).value) == null ? void 0 : _b.call(_a);
      ctx.reloadAbort.value = null;
      const { promise, abort } = fetchAndParseUrl(url, url);
      if (!ctx.runtime.isViewStale(runId)) {
        ctx.reloadAbort.value = abort;
      }
      const result = await promise;
      if (ctx.runtime.isViewStale(runId)) {
        abort();
        return;
      }
      if (ctx.reloadAbort.value === abort) {
        ctx.reloadAbort.value = null;
      }
      if (result.error === "abort") {
        return;
      }
      if (!result.doc) {
        ctx.showToast("重新加载失败", "error");
        return;
      }
      const parser = getParser();
      const parsed = await parseWithSectionMerge(parser, result.doc, url);
      if (ctx.runtime.isViewStale(runId)) {
        return;
      }
      if (parsed) {
        if (parsed.prevUrl) parsed.prevUrl = normalizeUrlForFetch(parsed.prevUrl);
        if (parsed.nextUrl) parsed.nextUrl = normalizeUrlForFetch(parsed.nextUrl);
        if (parsed.indexUrl) parsed.indexUrl = normalizeUrlForFetch(parsed.indexUrl);
        current.chapter = parsed;
        current.rule = parsed.rule;
        ctx.originalContents.value.set(current.id, parsed.content);
        ctx.cachedContents.value.set(parsed.url, {
          chapter: parsed,
          rule: parsed.rule,
          cachedAt: Date.now()
        });
        if (ctx.currentConversionMode.value !== "none") {
          const converted = await convertHTML(parsed.content, ctx.currentConversionMode.value);
          current.chapter = { ...current.chapter, content: converted };
        }
        ctx.showToast("规则已应用", "info");
      } else {
        ctx.showToast("解析失败", "error");
      }
    }
    function insertCachedChapterForContext(cached, position) {
      return insertCachedChapter(ctx, cached, position);
    }
    return {
      insertCachedChapter: insertCachedChapterForContext,
      loadChapter,
      loadNextChapter,
      loadPrevChapter,
      rebuildChaptersAround,
      reloadCurrentChapter
    };
  }
  function createReaderRuntime() {
    let sessionId = 0;
    let viewId = 0;
    return {
      bumpSession: () => {
        sessionId += 1;
        viewId += 1;
        return sessionId;
      },
      bumpView: () => {
        viewId += 1;
        return viewId;
      },
      isSessionStale: (runId) => runId !== sessionId,
      isViewStale: (runId) => runId !== viewId,
      sessionId: () => sessionId,
      viewId: () => viewId
    };
  }
  const useReaderStore = defineStore("reader", () => {
    const isActive = ref(false);
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
    const loadedUrls = ref( new Set());
    const vipBlockedUrls = ref( new Set());
    const blockedNavUrls = ref( new Set());
    const originalContents = ref( new Map());
    const originalTitles = ref( new Map());
    const currentConversionMode = ref("none");
    const pendingNextAbort = ref(null);
    const pendingPrevAbort = ref(null);
    const navFailures = new Map();
    const cacheProgress = ref({ done: 0, total: 0, running: false });
    const cacheQueue = ref([]);
    const cacheAbort = ref(null);
    const reloadAbort = ref(null);
    const toc = ref([]);
    const tocOriginal = ref([]);
    const tocLoading = ref(false);
    const tocAbort = ref(null);
    const cachedContents = ref( new Map());
    const persistedUrls = ref( new Set());
    const runtime = createReaderRuntime();
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
    function isVipBlockedUrl(url) {
      return vipBlockedUrls.value.has(normalizeUrlForBlock(url));
    }
    function getVipBlockedToast(direction) {
      const entry = direction === "next" ? chapters.value[chapters.value.length - 1] : chapters.value[0];
      const navUrl = direction === "next" ? entry == null ? void 0 : entry.chapter.nextUrl : entry == null ? void 0 : entry.chapter.prevUrl;
      if (!navUrl) return null;
      return isVipBlockedUrl(navUrl) ? VIP_BLOCK_TOAST : null;
    }
    const hasNext = computed(() => {
      const lastChapter = chapters.value[chapters.value.length - 1];
      const nextUrl = lastChapter == null ? void 0 : lastChapter.chapter.nextUrl;
      if (!nextUrl) return false;
      if (blockedNavUrls.value.has(normalizeUrlForBlock(nextUrl))) return false;
      return !isVipBlockedUrl(nextUrl);
    });
    const hasPrev = computed(() => {
      const firstChapter = chapters.value[0];
      const prevUrl = firstChapter == null ? void 0 : firstChapter.chapter.prevUrl;
      if (!prevUrl) return false;
      if (blockedNavUrls.value.has(normalizeUrlForBlock(prevUrl))) return false;
      return !isVipBlockedUrl(prevUrl);
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
    const normalizedTocUrls = computed(() => toc.value.map((entry) => normalizeUrlForFetch(entry.url)));
    const tocStatusMap = computed(() => {
      var _a;
      const currentUrl = (_a = chapter.value) == null ? void 0 : _a.url;
      const map = new Map();
      for (const url of normalizedTocUrls.value) {
        map.set(url, {
          isCached: loadedUrls.value.has(url) || cachedContents.value.has(url) || persistedUrls.value.has(url),
          isPersisted: persistedUrls.value.has(url),
          isCurrent: url === currentUrl
        });
      }
      return map;
    });
    const tocWithStatus = computed(() => {
      const urls = normalizedTocUrls.value;
      const statusMap = tocStatusMap.value;
      return toc.value.map((entry, i) => {
        const url = urls[i];
        const status = statusMap.get(url) || {
          isCached: false,
          isPersisted: false,
          isCurrent: false
        };
        return { ...entry, url, ...status };
      });
    });
    const currentChapterUrl = computed(() => {
      var _a;
      return ((_a = chapter.value) == null ? void 0 : _a.url) || "";
    });
    function syncCurrentHostPage() {
      syncHostPageToChapter(chapter.value, currentChapterIndex.value);
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
    async function applyConversionToChapterEntry$1(entryId, mode) {
      await applyConversionToChapterEntry(
        chapters.value,
        originalContents.value,
        originalTitles.value,
        entryId,
        mode
      );
    }
    async function applyTocConversion$1(mode) {
      toc.value = await applyTocConversion(tocOriginal.value, mode);
    }
    async function applyTextConversion(mode) {
      currentConversionMode.value = mode;
      for (const entry of chapters.value) {
        await applyConversionToChapterEntry$1(entry.id, mode);
      }
      await applyTocConversion$1(mode);
      syncCurrentHostPage();
    }
    async function getPersistedCachedChapterForCurrentBook(url) {
      var _a;
      const cacheBook = getCurrentBookCacheKey((_a = chapter.value) == null ? void 0 : _a.indexUrl);
      if (!cacheBook) return null;
      return getPersistedCachedChapter(cacheBook, url);
    }
    async function persistCache$1() {
      var _a;
      const runId = runtime.sessionId();
      const cacheBook = getCurrentBookCacheKey((_a = chapter.value) == null ? void 0 : _a.indexUrl);
      if (!cacheBook) return;
      const result = persistCache(cacheBook, cachedContents.value, persistedUrls.value);
      if (!runtime.isSessionStale(runId)) {
        persistedUrls.value = result;
      }
    }
    async function restoreCache$1() {
      var _a;
      const runId = runtime.sessionId();
      const cacheBook = getCurrentBookCacheKey((_a = chapter.value) == null ? void 0 : _a.indexUrl);
      if (!cacheBook) return;
      const restored = restoreCache(cacheBook);
      if (runtime.isSessionStale(runId)) return;
      if (restored) {
        persistedUrls.value = restored;
        touchPersistedCache(cacheBook);
      }
      cleanupExpiredCaches({ currentBookId: cacheBook.bookId });
    }
    async function clearPersistedCache$1() {
      var _a;
      const cacheBook = getCurrentBookCacheKey((_a = chapter.value) == null ? void 0 : _a.indexUrl);
      if (!cacheBook) return;
      clearPersistedCache(cacheBook, persistedUrls.value);
      persistedUrls.value.clear();
    }
    const nav = createNavigation({
      chapters,
      currentChapterIndex,
      isLoading,
      isLoadingNext,
      isLoadingPrev,
      pendingNextAbort,
      pendingPrevAbort,
      reloadAbort,
      loadedUrls,
      vipBlockedUrls,
      blockedNavUrls,
      cachedContents,
      persistedUrls,
      originalContents,
      originalTitles,
      currentConversionMode,
      navFailures,
      history,
      runtime,
      showToast,
      setError,
      applyConversionToChapterEntry: applyConversionToChapterEntry$1,
      getPersistedCachedChapter: getPersistedCachedChapterForCurrentBook
    });
    const { startCacheAll, cancelCacheAll } = createCacheAll({
      cacheProgress,
      cacheQueue,
      cacheAbort,
      loadedUrls,
      cachedContents,
      persistedUrls,
      chapter,
      rule,
      chapters,
      runtime,
      restoreCache: restoreCache$1,
      persistCache: persistCache$1
    });
    const tocActions = createTocActions({
      toc,
      tocOriginal,
      tocLoading,
      tocAbort,
      chapters,
      chapter,
      rule,
      currentConversionMode,
      runtime,
      showToast,
      applyTocConversion: applyTocConversion$1,
      loadTocEntriesPaged
    });
    function cancelAllInFlight() {
      var _a, _b, _c, _d, _e;
      (_a = pendingNextAbort.value) == null ? void 0 : _a.call(pendingNextAbort);
      pendingNextAbort.value = null;
      (_b = pendingPrevAbort.value) == null ? void 0 : _b.call(pendingPrevAbort);
      pendingPrevAbort.value = null;
      (_c = cacheAbort.value) == null ? void 0 : _c.call(cacheAbort);
      cacheAbort.value = null;
      (_d = reloadAbort.value) == null ? void 0 : _d.call(reloadAbort);
      reloadAbort.value = null;
      (_e = tocAbort.value) == null ? void 0 : _e.call(tocAbort);
      tocAbort.value = null;
      isLoading.value = false;
      isLoadingPrev.value = false;
      isLoadingNext.value = false;
      tocLoading.value = false;
      cacheProgress.value = { done: 0, total: 0, running: false };
      cacheQueue.value = [];
    }
    function clearAllData() {
      chapters.value = [];
      currentChapterIndex.value = 0;
      error.value = null;
      loadedUrls.value.clear();
      vipBlockedUrls.value.clear();
      blockedNavUrls.value.clear();
      navFailures.clear();
      originalContents.value.clear();
      originalTitles.value.clear();
      cachedContents.value.clear();
      persistedUrls.value.clear();
      toc.value = [];
      tocOriginal.value = [];
    }
    function activate() {
      isActive.value = true;
      error.value = null;
    }
    function deactivate() {
      runtime.bumpSession();
      isActive.value = false;
      cancelAllInFlight();
      clearAllData();
    }
    function setChapter(newChapter, newRule) {
      runtime.bumpSession();
      cancelAllInFlight();
      toc.value = [];
      tocOriginal.value = [];
      const effectiveRule = newRule || newChapter.rule;
      if (newChapter.url) newChapter.url = normalizeUrlForFetch(newChapter.url);
      if (newChapter.prevUrl) newChapter.prevUrl = normalizeUrlForFetch(newChapter.prevUrl);
      if (newChapter.nextUrl) newChapter.nextUrl = normalizeUrlForFetch(newChapter.nextUrl);
      if (newChapter.indexUrl) newChapter.indexUrl = normalizeUrlForFetch(newChapter.indexUrl);
      const id = `chapter-${Date.now()}-0`;
      chapters.value = [{ chapter: newChapter, rule: effectiveRule, id }];
      currentChapterIndex.value = 0;
      error.value = null;
      loadedUrls.value.clear();
      loadedUrls.value.add(newChapter.url);
      vipBlockedUrls.value.clear();
      blockedNavUrls.value.clear();
      navFailures.clear();
      cachedContents.value.clear();
      persistedUrls.value.clear();
      originalContents.value.clear();
      originalContents.value.set(id, newChapter.content);
      originalTitles.value.clear();
      originalTitles.value.set(id, { title: newChapter.title, bookTitle: newChapter.bookTitle });
      cachedContents.value.set(newChapter.url, {
        chapter: newChapter,
        rule: effectiveRule,
        cachedAt: Date.now()
      });
      if (newChapter.url && !history.value.includes(newChapter.url)) {
        history.value.push(newChapter.url);
        if (history.value.length > 100) {
          history.value = history.value.slice(-100);
        }
      }
      if (currentConversionMode.value !== "none") {
        void applyConversionToChapterEntry$1(id, currentConversionMode.value).then(() => {
          syncCurrentHostPage();
        });
      }
      syncCurrentHostPage();
      void restoreCache$1();
    }
    function setLoading(loading) {
      isLoading.value = loading;
    }
    function updateScroll(percent) {
      scrollPercent.value = Math.max(0, Math.min(100, percent));
    }
    function setCurrentChapter(index) {
      if (index < 0 || index >= chapters.value.length) return;
      if (currentChapterIndex.value === index) return;
      currentChapterIndex.value = index;
      syncCurrentHostPage();
    }
    async function rebuildChaptersAround(targetUrl) {
      const ok = await nav.rebuildChaptersAround(targetUrl);
      if (ok) syncCurrentHostPage();
      return ok;
    }
    async function reloadCurrentChapter() {
      await nav.reloadCurrentChapter();
      syncCurrentHostPage();
    }
    function getProgress() {
      var _a, _b;
      if (!((_a = chapter.value) == null ? void 0 : _a.url)) return null;
      return {
        url: ((_b = chapter.value) == null ? void 0 : _b.url) || window.location.href,
        chapterUrl: chapter.value.url,
        chapterPercent: scrollPercent.value,
        scrollPercent: scrollPercent.value,
        lastRead: Date.now()
      };
    }
    function $reset() {
      runtime.bumpSession();
      isActive.value = false;
      cancelAllInFlight();
      clearAllData();
      scrollPercent.value = 0;
      currentConversionMode.value = "none";
    }
    return {
      isActive,
      isLoading,
      isLoadingPrev,
      isLoadingNext,
      chapters,
      currentChapterIndex,
      currentConversionMode,
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
      activate,
      deactivate,
      setChapter,
      setCurrentChapter,
      loadNextChapter: nav.loadNextChapter,
      loadPrevChapter: nav.loadPrevChapter,
      setLoading,
      setError,
      showToast,
      getVipBlockedToast,
      clearError,
      updateScroll,
      getProgress,
      applyTextConversion,
      startCacheAll,
      cancelCacheAll,
      loadToc: tocActions.loadToc,
      rebuildChaptersAround,
      reloadCurrentChapter,
      persistCache: persistCache$1,
      restoreCache: restoreCache$1,
      clearPersistedCache: clearPersistedCache$1,
      $reset
    };
  });
  const THEMES = [
    {
      id: "light",
      name: "默认",
      background: "#ffffff",
      text: "#1a1a1a",
      link: "#0066cc",
      onLink: "#ffffff",
      border: "#e5e5e5"
    },
    {
      id: "dark",
      name: "深色",
      background: "#1e1e1e",
      text: "#c8c8c8",
      link: "#78bdf2",
      onLink: "#111111",
      border: "#3a3a3a"
    },
    {
      id: "sepia",
      name: "护眼",
      background: "#f8f1e3",
      text: "#4a4137",
      link: "#7a4f26",
      onLink: "#ffffff",
      border: "#e8dcc8"
    },
    {
      id: "green",
      name: "绿色",
      background: "#edf6ed",
      text: "#243429",
      link: "#2f6f3d",
      onLink: "#ffffff",
      border: "#c9ddc9"
    },
    {
      id: "blue",
      name: "蓝色",
      background: "#eaf3fb",
      text: "#263746",
      link: "#2563a8",
      onLink: "#ffffff",
      border: "#c7d8e8"
    },
    {
      id: "night",
      name: "夜间",
      background: "#0d0d0d",
      text: "#a0a0a0",
      link: "#5dade2",
      onLink: "#0b0b0b",
      border: "#303030"
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
    mode: "standard",
    blockRedirects: true,
    enableRightClick: true,
    enableSelection: true,
    blockPopups: true
  };
  const STORAGE_KEY = "mnr-config";
  const useConfigStore = defineStore("config", () => {
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
      root.style.setProperty("--mnr-on-link", t.onLink);
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
        let hasInvalidData = false;
        if (typeof GM_getValue !== "undefined") {
          data = await GM_getValue(STORAGE_KEY, null);
        } else if (typeof localStorage !== "undefined") {
          const stored = localStorage.getItem(STORAGE_KEY);
          data = stored;
        }
        if (data) {
          let parsed;
          if (typeof data === "string") {
            try {
              parsed = JSON.parse(data);
            } catch (e) {
              console.error("[ConfigStore] Failed to parse config JSON:", e);
              hasInvalidData = true;
              parsed = null;
            }
          } else {
            parsed = data;
          }
          if (!hasInvalidData && (!parsed || typeof parsed !== "object" || Array.isArray(parsed))) {
            console.warn("[ConfigStore] Invalid config data, expected object");
            hasInvalidData = true;
          }
          if (!hasInvalidData) {
            const config = parsed;
            if (typeof config.themeId === "string") {
              themeId.value = config.themeId;
            }
            if (config.reading && typeof config.reading === "object") {
              reading.value = {
                ...DEFAULT_READING,
                ...config.reading
              };
            }
            if (config.behavior && typeof config.behavior === "object") {
              behavior.value = {
                ...DEFAULT_BEHAVIOR,
                ...config.behavior
              };
            }
            if (config.protection && typeof config.protection === "object") {
              protection.value = {
                ...DEFAULT_PROTECTION,
                ...config.protection
              };
            }
            if (typeof config.customCSS === "string") {
              customCSS.value = config.customCSS;
            }
          }
        }
        applyAll();
        if (hasInvalidData) {
          console.warn("[ConfigStore] Corrupted config detected; resetting to defaults");
          await save();
        }
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
themeId,
      reading,
      behavior,
      protection,
      customCSS,
theme,
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
  const useRuleStore = defineStore("rule", () => {
    const userRules = ref( new Map());
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
        userRules.value.set(domain, manager.getUserRule(domain) ?? rule);
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
      userRules.value = new Map();
      builtInRules2.value = [];
      isLoading.value = false;
      currentRule.value = null;
      isEditing.value = false;
      editingRule.value = null;
    }
    return {
userRules,
      builtInRules: builtInRules2,
      isLoading,
      currentRule,
      isEditing,
      editingRule,
userRuleCount,
      builtInRuleCount,
      totalRuleCount,
      userRuleList,
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
  function getMnrGlobalState() {
    if (!window.__MY_NOVEL_READER__) {
      window.__MY_NOVEL_READER__ = {};
    }
    return window.__MY_NOVEL_READER__;
  }
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
  color: var(--mnr-link, #1976d2);
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
    const globalState = getMnrGlobalState();
    const host = document.createElement("div");
    host.id = hostId;
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    globalState.shadowRoot = shadowRoot;
    const resetStyle = document.createElement("style");
    resetStyle.textContent = BASE_RESET_CSS;
    shadowRoot.appendChild(resetStyle);
    if (globalState.styles) {
      const styleId = "mnr-app-styles";
      const existing = shadowRoot.querySelector(`#${styleId}`);
      const appStyle = existing || document.createElement("style");
      if (!existing) {
        appStyle.id = styleId;
        shadowRoot.appendChild(appStyle);
      }
      appStyle.textContent = globalState.styles;
    }
    const mountPoint = document.createElement("div");
    mountPoint.id = `${hostId}-mount`;
    shadowRoot.appendChild(mountPoint);
    const cleanup = () => {
      host.remove();
      if (globalState.shadowRoot === shadowRoot) {
        globalState.shadowRoot = void 0;
      }
    };
    return { host, shadowRoot, mountPoint, cleanup };
  }
  const _hoisted_1$a = {
    class: "mnr-prompt-card",
    role: "dialog",
    "aria-modal": "true"
  };
  const _hoisted_2$8 = { class: "mnr-confidence" };
  const _hoisted_3$7 = { class: "mnr-confidence-bar" };
  const _hoisted_4$7 = { class: "mnr-confidence-text" };
  const _hoisted_5$6 = { class: "mnr-results" };
  const _hoisted_6$5 = { class: "mnr-checkbox-label" };
  const _sfc_main$b = defineComponent({
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
              createBaseVNode("div", _hoisted_1$a, [
                _cache[4] || (_cache[4] = createBaseVNode("div", { class: "mnr-prompt-header" }, [
                  createBaseVNode("span", { class: "mnr-prompt-icon" }, "📖"),
                  createBaseVNode("h3", { class: "mnr-prompt-title" }, "启用 MyNovelReader?")
                ], -1)),
                createBaseVNode("div", _hoisted_2$8, [
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
  const DetectionPrompt = _export_sfc(_sfc_main$b, [["__scopeId", "data-v-c89e5106"]]);
  function useVirtualChapters(chapters, options = {}) {
    const { windowSize = 5, overscan = 1, defaultHeight = 1200 } = options;
    const heights = ref( new Map());
    const virtualWindow = ref({ start: 0, end: windowSize });
    const averageHeight = computed(() => {
      const h2 = heights.value;
      if (h2.size === 0) return defaultHeight;
      let sum = 0;
      for (const v of h2.values()) sum += v;
      return sum / h2.size;
    });
    const prefixOffsets = computed(() => {
      const chaps = chapters.value;
      const avg = averageHeight.value;
      const h2 = heights.value;
      const offsets = new Float64Array(chaps.length + 1);
      for (let i = 0; i < chaps.length; i++) {
        offsets[i + 1] = offsets[i] + (h2.get(chaps[i].chapter.url) ?? avg);
      }
      return offsets;
    });
    const totalHeight = computed(() => {
      const o = prefixOffsets.value;
      return o[o.length - 1];
    });
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
    const topSpacer = computed(() => {
      const o = prefixOffsets.value;
      const idx = visibleRange.value.start;
      return idx >= 0 && idx < o.length ? o[idx] : 0;
    });
    const bottomSpacer = computed(() => {
      const o = prefixOffsets.value;
      const endIdx = visibleRange.value.end;
      const total = o[o.length - 1];
      const endOffset = endIdx >= 0 && endIdx < o.length ? o[endIdx] : total;
      return Math.max(0, total - endOffset);
    });
    function setHeight(url, height) {
      const prev = heights.value.get(url);
      if (prev !== height) {
        heights.value.set(url, height);
      }
    }
    function getOffsetBefore(index) {
      if (index <= 0) return 0;
      const o = prefixOffsets.value;
      if (o.length <= 1) return 0;
      const clamped = Math.min(index, o.length - 1);
      return o[clamped];
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
      (newChapters, oldChapters = []) => {
        const previousLength = oldChapters.length;
        const grew = newChapters.length > previousLength;
        const appendedAtTail = grew && previousLength > 0 && oldChapters.every((entry, index) => {
          const nextEntry = newChapters[index];
          return (nextEntry == null ? void 0 : nextEntry.id) === entry.id && nextEntry.chapter.url === entry.chapter.url;
        });
        const wasAtTail = previousLength > 0 && virtualWindow.value.end >= previousLength;
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
        if (appendedAtTail && wasAtTail) {
          virtualWindow.value = {
            start: Math.max(0, newChapters.length - windowSize),
            end: newChapters.length
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
virtualWindow,
      heights,
visibleChapters,
      topSpacer,
      bottomSpacer,
      totalHeight,
      averageHeight,
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
    function handleKeyDown(ev) {
      const e = ev;
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
        if (shortcut.stopPropagation) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
        shortcut.handler(e);
        return;
      }
    }
    useEventListener("keydown", handleKeyDown, { capture: true });
  }
  const SCROLL_THROTTLE_MS = 16;
  const SCROLL_SETTLE_CHECK_MS = 180;
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
  function useReaderScroll(options) {
    const {
      mainRef,
      chapters,
      visibleChapters,
      chapterRefs,
      chapterHeights,
      averageHeight,
      setChapterHeight,
      updateWindow,
      readerStore,
      autoHideHeader,
      showControls,
      isNavigating,
      scheduleAutoLoadNext
    } = options;
    let lastScrollTop = 0;
    let pendingAutoLoadCheckFrame = null;
    let pendingScrollSettleTimer = null;
    function queuePostLayoutAutoLoadCheck() {
      if (pendingAutoLoadCheckFrame !== null) return;
      if (typeof globalThis.requestAnimationFrame !== "function") {
        scheduleAutoLoadNext("scroll");
        return;
      }
      pendingAutoLoadCheckFrame = globalThis.requestAnimationFrame(() => {
        pendingAutoLoadCheckFrame = null;
        scheduleAutoLoadNext("scroll");
      });
    }
    function queueScrollSettledAutoLoadCheck() {
      if (pendingScrollSettleTimer) {
        clearTimeout(pendingScrollSettleTimer);
      }
      pendingScrollSettleTimer = setTimeout(() => {
        pendingScrollSettleTimer = null;
        scheduleAutoLoadNext("settled");
      }, SCROLL_SETTLE_CHECK_MS);
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
      const overallPercent = scrollHeight > 0 ? Math.round(currentScrollY / scrollHeight * 100) : 100;
      if (isNavigating.value) {
        readerStore.updateScroll(overallPercent);
        return;
      }
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
        const el = chapterRefs.get(entry.chapter.url);
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
          readerStore.updateScroll(overallPercent);
          scheduleAutoLoadNext("scroll");
          queuePostLayoutAutoLoadCheck();
          queueScrollSettledAutoLoadCheck();
        }
        return;
      }
      readerStore.setCurrentChapter(currentChapterIdx);
      updateWindow(currentChapterIdx);
      readerStore.updateScroll(overallPercent);
      scheduleAutoLoadNext("scroll");
      queuePostLayoutAutoLoadCheck();
      queueScrollSettledAutoLoadCheck();
    }
    const handleScroll = throttle(handleScrollCore, SCROLL_THROTTLE_MS);
    return { handleScroll, lastScrollTop };
  }
  const INTERSECTION_ROOT_MARGIN_PX = 1600;
  const PRELOAD_DELAY_MIN_MS = 3e3;
  const PRELOAD_DELAY_MAX_MS = 5e3;
  const FAILURE_COOLDOWN_MIN_MS = 6e3;
  const FAILURE_COOLDOWN_MAX_MS = 1e4;
  function useReaderAutoLoad(options) {
    const {
      mainRef,
      readerStore,
      configStore,
      hasNext,
      isLoadingNext,
      isLoadingPrev,
      isLoading,
      isNavigating
    } = options;
    let autoLoadTimer = null;
    let autoLoadTimerDueAt = 0;
    let autoLoadInFlight = false;
    let sessionKey = "";
    let graceUntil = 0;
    let failureCooldownUntil = 0;
    function getRandomDelayMs(min, max) {
      const a = Math.min(min, max);
      const b = Math.max(min, max);
      return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    function now() {
      return Date.now();
    }
    function getCurrentIndex() {
      const index = Number(readerStore.currentChapterIndex ?? 0);
      if (!Number.isFinite(index) || readerStore.chapters.length === 0) return 0;
      return Math.max(0, Math.min(readerStore.chapters.length - 1, index));
    }
    function getCurrentSessionKey() {
      const entry = readerStore.chapters[getCurrentIndex()];
      if (!entry) return "";
      return `${getCurrentIndex()}:${entry.chapter.url}`;
    }
    function ensureSession() {
      const nextSessionKey = getCurrentSessionKey();
      if (!nextSessionKey) return false;
      if (nextSessionKey !== sessionKey) {
        sessionKey = nextSessionKey;
        graceUntil = now() + getRandomDelayMs(PRELOAD_DELAY_MIN_MS, PRELOAD_DELAY_MAX_MS);
        failureCooldownUntil = 0;
        clearAutoLoadTimer();
      }
      return true;
    }
    function getUnreadLoadedChapterCount() {
      return Math.max(0, readerStore.chapters.length - getCurrentIndex() - 1);
    }
    function isPageHidden() {
      return typeof document !== "undefined" && document.visibilityState === "hidden";
    }
    function isNearBottom(mainEl) {
      return mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight) <= INTERSECTION_ROOT_MARGIN_PX;
    }
    function clearAutoLoadTimer() {
      if (!autoLoadTimer) return;
      clearTimeout(autoLoadTimer);
      autoLoadTimer = null;
      autoLoadTimerDueAt = 0;
    }
    function scheduleTimerAt(dueAt) {
      if (autoLoadTimer && autoLoadTimerDueAt <= dueAt) return;
      clearAutoLoadTimer();
      autoLoadTimerDueAt = dueAt;
      autoLoadTimer = setTimeout(
        () => {
          autoLoadTimer = null;
          autoLoadTimerDueAt = 0;
          scheduleAutoLoadNext("timer");
        },
        Math.max(0, dueAt - now())
      );
    }
    function canAutoLoadBase() {
      return configStore.behavior.preloadNext && readerStore.chapters.length > 0 && hasNext.value && !isLoadingNext.value && !isLoadingPrev.value && !isLoading.value && !isNavigating.value && !autoLoadInFlight && !isPageHidden() && getUnreadLoadedChapterCount() === 0;
    }
    function finishLoad(ok) {
      autoLoadInFlight = false;
      if (ok) {
        failureCooldownUntil = 0;
        return;
      }
      failureCooldownUntil = now() + getRandomDelayMs(FAILURE_COOLDOWN_MIN_MS, FAILURE_COOLDOWN_MAX_MS);
    }
    function startAutoLoad() {
      if (!mainRef.value || !canAutoLoadBase()) return;
      clearAutoLoadTimer();
      autoLoadInFlight = true;
      void readerStore.loadNextChapter("auto").then(finishLoad, () => finishLoad(false));
    }
    function shouldRetryAfterCooldown(reason) {
      return reason !== "state";
    }
    function scheduleAutoLoadNext(reason = "state") {
      const mainEl = mainRef.value;
      if (!mainEl || !ensureSession()) return;
      if (!canAutoLoadBase()) {
        if (!configStore.behavior.preloadNext || getUnreadLoadedChapterCount() > 0) {
          clearAutoLoadTimer();
        }
        return;
      }
      const currentTime = now();
      if (currentTime < graceUntil) {
        scheduleTimerAt(graceUntil);
        return;
      }
      if (currentTime < failureCooldownUntil) {
        if (shouldRetryAfterCooldown(reason)) {
          scheduleTimerAt(failureCooldownUntil);
        }
        return;
      }
      if (reason === "scroll" || reason === "settled" || reason === "sentinel") {
        if (!isNearBottom(mainEl)) return;
      }
      startAutoLoad();
    }
    watch(
      () => readerStore.chapters.length,
      () => {
        scheduleAutoLoadNext("state");
      }
    );
    watch(
      () => readerStore.currentChapterIndex,
      () => {
        scheduleAutoLoadNext("state");
      }
    );
    watch(
      () => [isLoadingNext.value, isLoadingPrev.value, isLoading.value, isNavigating.value],
      ([loadingNext, loadingPrev, loading, navigating]) => {
        if (loadingNext || loadingPrev || loading || navigating) return;
        scheduleAutoLoadNext("state");
      }
    );
    watch(
      () => configStore.behavior.preloadNext,
      (enabled) => {
        if (!enabled) {
          clearAutoLoadTimer();
          failureCooldownUntil = 0;
          return;
        }
        scheduleAutoLoadNext("state");
      }
    );
    function handleVisibilityChange() {
      if (!isPageHidden()) {
        scheduleAutoLoadNext("visibility");
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    scheduleAutoLoadNext("state");
    onUnmounted(() => {
      clearAutoLoadTimer();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    });
    return {
      scheduleAutoLoadNext,
      clearAutoLoadTimer,
      INTERSECTION_ROOT_MARGIN_PX
    };
  }
  const SWIPE_THRESHOLD_PX = 80;
  const SWIPE_MAX_DURATION_MS = 700;
  const SWIPE_CANCEL_VERTICAL_PX = 28;
  const SWIPE_AXIS_RATIO = 1.5;
  function isTouchEvent(e) {
    const candidate = e;
    return Boolean(candidate.touches && candidate.changedTouches);
  }
  function isInteractiveElement(target) {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest("a, button, input, textarea, select, label"));
  }
  function useTouchGestures(options) {
    const { enabled, onSwipeLeft, onSwipeRight } = options;
    let swipeStart = null;
    function handleTouchStart(e) {
      if (!enabled.value) return;
      if (!isTouchEvent(e)) return;
      if (e.touches.length !== 1) return;
      if (isInteractiveElement(e.target)) return;
      const touch = e.touches[0];
      swipeStart = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        cancelled: false
      };
    }
    function handleTouchMove(e) {
      if (!swipeStart) return;
      if (!isTouchEvent(e)) return;
      if (e.touches.length !== 1) {
        swipeStart = null;
        return;
      }
      const touch = Array.from(e.touches).find((t) => t.identifier === (swipeStart == null ? void 0 : swipeStart.id));
      if (!touch) return;
      const dx = touch.clientX - swipeStart.x;
      const dy = touch.clientY - swipeStart.y;
      if (Math.abs(dy) >= SWIPE_CANCEL_VERTICAL_PX && Math.abs(dy) >= Math.abs(dx) * SWIPE_AXIS_RATIO) {
        swipeStart.cancelled = true;
      }
    }
    function handleTouchEnd(e) {
      if (!swipeStart) return;
      if (!isTouchEvent(e)) return;
      const start = swipeStart;
      swipeStart = null;
      if (start.cancelled) return;
      if (!enabled.value) return;
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === start.id);
      if (!touch) return;
      const dt = Date.now() - start.time;
      if (dt > SWIPE_MAX_DURATION_MS) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO) return;
      if (dx < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
    function handleTouchCancel() {
      swipeStart = null;
    }
    return { handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel };
  }
  const SCROLL_BOUNDARY_EPSILON_PX$1 = 4;
  const SMOOTH_NAVIGATION_LOCK_MS = 650;
  function useChapterNavigation(options) {
    const {
      mainRef,
      chapters,
      chapterRefs,
      readerStore,
      isNavigating,
      isLoadingPrev,
      isLoadingNext,
      hasPrev,
      hasNext,
      topSpacer,
      setChapterHeight,
      updateWindow
    } = options;
    let isLoadingPrevLocal = false;
    function isAtTop(mainEl) {
      return mainEl.scrollTop <= SCROLL_BOUNDARY_EPSILON_PX$1;
    }
    function isAtBottom(mainEl) {
      return mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight) <= SCROLL_BOUNDARY_EPSILON_PX$1;
    }
    function preventBoundaryDefault(e) {
      if (e.cancelable === false) return;
      if (typeof e.preventDefault !== "function") return;
      e.preventDefault();
    }
    function loadNextAtBoundary() {
      if (!hasNext.value) return;
      if (isLoadingNext.value || isLoadingPrev.value || isNavigating.value) return;
      void readerStore.loadNextChapter("manual");
    }
    function scrollToChapter(index) {
      var _a;
      const url = (_a = chapters.value[index]) == null ? void 0 : _a.chapter.url;
      if (!url) return;
      const chapterEl = chapterRefs.get(url);
      if (chapterEl) {
        chapterEl.scrollIntoView({ behavior: "smooth", block: "start" });
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
        (_a = mainRef.value) == null ? void 0 : _a.scrollTo({ top: 0, behavior: "auto" });
      } else {
        window.location.href = url;
      }
    }
    async function jumpToChapter(index, behavior = "smooth") {
      var _a;
      const mainEl = mainRef.value;
      if (!mainEl) return;
      if (index < 0 || index >= chapters.value.length) return;
      isNavigating.value = true;
      updateWindow(index);
      await nextTick();
      await new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve()));
      const url = (_a = chapters.value[index]) == null ? void 0 : _a.chapter.url;
      if (!url) {
        isNavigating.value = false;
        return;
      }
      const targetEl = chapterRefs.get(url);
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
        }, SMOOTH_NAVIGATION_LOCK_MS);
      } else {
        globalThis.requestAnimationFrame(() => {
          isNavigating.value = false;
        });
      }
    }
    async function loadPrevWithScrollAdjust(jumpToStart = false) {
      const mainEl = mainRef.value;
      if (!mainEl || isLoadingPrev.value || isLoadingPrevLocal) return;
      isLoadingPrevLocal = true;
      try {
        const oldScrollTop = mainEl.scrollTop;
        const oldTopSpacer = topSpacer.value;
        const success = await readerStore.loadPrevChapter("manual");
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
      } finally {
        isLoadingPrevLocal = false;
      }
    }
    function handleWheel(e) {
      const mainEl = mainRef.value;
      if (!mainEl) return;
      if (e.deltaY < 0 && isAtTop(mainEl)) {
        preventBoundaryDefault(e);
        if (hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
          loadPrevWithScrollAdjust();
        }
        return;
      }
      if (e.deltaY > 0 && isAtBottom(mainEl)) {
        preventBoundaryDefault(e);
        loadNextAtBoundary();
      }
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
          const success = await readerStore.loadPrevChapter("manual");
          if (success) {
            globalThis.requestAnimationFrame(() => jumpToChapter(0, "auto"));
          }
        } else if (!hasPrev.value) {
          readerStore.showToast(readerStore.getVipBlockedToast("prev") || "已经是第一章了", "info");
        }
      } else {
        if (currentIdx < chaptersCount - 1) {
          jumpToChapter(currentIdx + 1);
        } else if (hasNext.value && !isLoadingNext.value) {
          const success = await readerStore.loadNextChapter("manual");
          if (success) {
            globalThis.requestAnimationFrame(() => jumpToChapter(readerStore.chapters.length - 1));
          }
        } else if (!hasNext.value) {
          readerStore.showToast(readerStore.getVipBlockedToast("next") || "已经是最后一章了", "info");
        }
      }
    }
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
    return {
      navigateChapter,
      jumpToChapter,
      jumpToCachedChapter,
      scrollToChapter,
      loadPrevWithScrollAdjust,
      handleWheel,
      scrollReader
    };
  }
  function useReaderUIControls(options) {
    const { readerStore, ruleStore, showControls } = options;
    const settingsVisible = ref(false);
    const ruleEditorVisible = ref(false);
    const isPickerActive = ref(false);
    const drawerOpen = ref(false);
    const currentRule = computed(() => readerStore.rule);
    const currentDomain = computed(() => {
      try {
        return new URL(window.location.href).hostname;
      } catch {
        return "";
      }
    });
    function toggleDrawer() {
      drawerOpen.value = !drawerOpen.value;
      if (drawerOpen.value) {
        readerStore.loadToc();
      }
    }
    function openSettings() {
      settingsVisible.value = true;
      showControls.value = false;
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
    return {
      settingsVisible,
      ruleEditorVisible,
      isPickerActive,
      drawerOpen,
      currentRule,
      currentDomain,
      toggleDrawer,
      openSettings,
      openRuleEditor,
      handleRuleSave,
      handleRuleReset,
      handleEscape,
      toggleSettings,
      toggleRuleEditor
    };
  }
  const _hoisted_1$9 = {
    key: 0,
    class: "mnr-progress-text"
  };
  const _sfc_main$a = defineComponent({
    __name: "ProgressIndicator",
    props: {
      percent: { default: 0 },
      showText: { type: Boolean, default: false },
      autoHide: { type: Boolean, default: true },
      hideDelay: { default: 2e3 }
    },
    setup(__props) {
      const props = __props;
      const percent = computed(() => {
        const value = Number(props.percent ?? 0);
        if (Number.isNaN(value)) return 0;
        return Math.max(0, Math.min(100, Math.round(value)));
      });
      const visible = ref(true);
      let hideTimeout = null;
      function scheduleAutoHide() {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
        if (!props.autoHide) {
          visible.value = true;
          return;
        }
        hideTimeout = setTimeout(() => {
          visible.value = false;
        }, props.hideDelay);
      }
      watch(
        percent,
        () => {
          visible.value = true;
          scheduleAutoHide();
        },
        { immediate: true }
      );
      onUnmounted(() => {
        if (hideTimeout) clearTimeout(hideTimeout);
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["mnr-progress", { hidden: !visible.value }])
        }, [
          createBaseVNode("div", {
            class: "mnr-progress-bar",
            style: normalizeStyle({ width: `${percent.value}%` })
          }, null, 4),
          __props.showText ? (openBlock(), createElementBlock("span", _hoisted_1$9, toDisplayString(percent.value) + "%", 1)) : createCommentVNode("", true)
        ], 2);
      };
    }
  });
  const ProgressIndicator = _export_sfc(_sfc_main$a, [["__scopeId", "data-v-16ecd1aa"]]);
  const _hoisted_1$8 = {
    key: 0,
    class: "mnr-floating-toolbar"
  };
  const _hoisted_2$7 = { class: "mnr-fab-group" };
  const _hoisted_3$6 = ["disabled"];
  const _hoisted_4$6 = { class: "mnr-icon" };
  const _hoisted_5$5 = {
    key: 0,
    class: "mnr-fab-badge"
  };
  const _sfc_main$9 = defineComponent({
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
            __props.visible ? (openBlock(), createElementBlock("div", _hoisted_1$8, [
              createBaseVNode("button", {
                class: "mnr-fab",
                title: "目录 (Tab)",
                "aria-label": "打开目录",
                onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.$emit("toggleDrawer"), ["stop"]))
              }, [..._cache[3] || (_cache[3] = [
                createBaseVNode("span", { class: "mnr-icon" }, "☰", -1)
              ])]),
              createBaseVNode("div", _hoisted_2$7, [
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
  const FloatingToolbar = _export_sfc(_sfc_main$9, [["__scopeId", "data-v-dffc57fa"]]);
  const _sfc_main$8 = defineComponent({
    __name: "MnrSpinner",
    props: {
      size: { default: "medium" }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["mnr-spinner", __props.size])
        }, null, 2);
      };
    }
  });
  const MnrSpinner = _export_sfc(_sfc_main$8, [["__scopeId", "data-v-c925c262"]]);
  const _hoisted_1$7 = ["role"];
  const _sfc_main$7 = defineComponent({
    __name: "MnrToast",
    props: {
      message: {},
      type: { default: "info" },
      visible: { type: Boolean }
    },
    emits: ["dismiss"],
    setup(__props) {
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Transition, { name: "mnr-toast" }, {
          default: withCtx(() => [
            __props.visible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["mnr-toast", { "mnr-toast--error": __props.type === "error" }]),
              role: __props.type === "error" ? "alert" : "status",
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("dismiss"))
            }, toDisplayString(__props.message), 11, _hoisted_1$7)) : createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  });
  const MnrToast = _export_sfc(_sfc_main$7, [["__scopeId", "data-v-83d04cea"]]);
  const _hoisted_1$6 = {
    key: 0,
    class: "mnr-loading-overlay",
    role: "alert",
    "aria-busy": "true"
  };
  const _hoisted_2$6 = {
    key: 1,
    class: "mnr-loading-overlay--inline",
    role: "alert",
    "aria-busy": "true"
  };
  const _sfc_main$6 = defineComponent({
    __name: "MnrLoadingOverlay",
    props: {
      inline: { type: Boolean, default: false }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return !__props.inline ? (openBlock(), createElementBlock("div", _hoisted_1$6, [
          createVNode(MnrSpinner, { size: "medium" }),
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ])) : (openBlock(), createElementBlock("div", _hoisted_2$6, [
          createVNode(MnrSpinner, { size: "medium" }),
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ]));
      };
    }
  });
  const MnrLoadingOverlay = _export_sfc(_sfc_main$6, [["__scopeId", "data-v-01971069"]]);
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
  const _hoisted_10$3 = {
    key: 1,
    class: "mnr-stat-session"
  };
  const _hoisted_11$3 = { class: "mnr-chapter-list" };
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
  const _sfc_main$5 = defineComponent({
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
            __props.loading ? (openBlock(), createElementBlock("div", _hoisted_3$5, [
              createVNode(unref(MnrSpinner), { size: "small" }),
              _cache[2] || (_cache[2] = createBaseVNode("span", null, "加载目录中...", -1))
            ])) : __props.chapters.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_4$5, [..._cache[3] || (_cache[3] = [
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
                sessionCount.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_10$3, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "mnr-cached-icon" }, "○", -1)),
                  createTextVNode(" 临时 " + toDisplayString(sessionCount.value) + " 章 ", 1)
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              createBaseVNode("ul", _hoisted_11$3, [
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
  const ChapterDrawer = _export_sfc(_sfc_main$5, [["__scopeId", "data-v-fe73b01a"]]);
  const _hoisted_1$4 = { class: "mnr-settings-panel" };
  const _hoisted_2$4 = { class: "mnr-settings-header" };
  const _hoisted_3$4 = { class: "mnr-settings-content" };
  const _hoisted_4$4 = { class: "mnr-settings-section" };
  const _hoisted_5$3 = { class: "mnr-theme-grid" };
  const _hoisted_6$3 = ["onClick"];
  const _hoisted_7$3 = { class: "mnr-settings-section" };
  const _hoisted_8$3 = { class: "mnr-slider-row" };
  const _hoisted_9$3 = ["value"];
  const _hoisted_10$2 = { class: "mnr-slider-value" };
  const _hoisted_11$2 = { class: "mnr-settings-section" };
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
  const _hoisted_27 = { class: "mnr-switch-row" };
  const _hoisted_28 = { class: "mnr-settings-section" };
  const _hoisted_29 = { class: "mnr-segmented-control" };
  const _hoisted_30 = { class: "mnr-settings-section" };
  const _hoisted_31 = { class: "mnr-action-buttons" };
  const _hoisted_32 = { class: "mnr-rule-row" };
  const _hoisted_33 = { class: "mnr-cache-row" };
  const _hoisted_34 = {
    key: 0,
    class: "mnr-cache-progress"
  };
  const _hoisted_35 = { class: "mnr-cache-count" };
  const _sfc_main$4 = defineComponent({
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
      const protectionMode = ref(configStore.protection.mode);
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
      function updateProtectionMode(mode) {
        protectionMode.value = mode;
        configStore.updateProtection({ mode });
        if (mode === "aggressive") {
          getSiteProtection().cleanupScripts();
        }
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
            protectionMode.value = configStore.protection.mode;
          }
        }
      );
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Transition, { name: "mnr-slide" }, {
          default: withCtx(() => [
            __props.visible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "mnr-settings-overlay",
              onClick: _cache[18] || (_cache[18] = withModifiers(($event) => _ctx.$emit("close"), ["self"]))
            }, [
              createBaseVNode("div", _hoisted_1$4, [
                createBaseVNode("div", _hoisted_2$4, [
                  _cache[19] || (_cache[19] = createBaseVNode("h3", null, "阅读设置", -1)),
                  _cache[20] || (_cache[20] = createBaseVNode("span", { class: "mnr-shortcut-hint" }, "S", -1)),
                  createBaseVNode("button", {
                    class: "mnr-close-btn",
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
                  }, "✕")
                ]),
                createBaseVNode("div", _hoisted_3$4, [
                  createBaseVNode("section", _hoisted_4$4, [
                    _cache[21] || (_cache[21] = createBaseVNode("h4", null, "主题", -1)),
                    createBaseVNode("div", _hoisted_5$3, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(themes), (theme) => {
                        return openBlock(), createElementBlock("button", {
                          key: theme.id,
                          class: normalizeClass(["mnr-theme-btn", { active: currentTheme.value === theme.id }]),
                          style: normalizeStyle({
                            background: theme.background,
                            color: theme.text,
                            borderColor: currentTheme.value === theme.id ? "var(--mnr-link, #1976d2)" : theme.border
                          }),
                          onClick: ($event) => setTheme(theme.id)
                        }, toDisplayString(theme.name), 15, _hoisted_6$3);
                      }), 128))
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_7$3, [
                    _cache[24] || (_cache[24] = createBaseVNode("h4", null, "字体大小", -1)),
                    createBaseVNode("div", _hoisted_8$3, [
                      _cache[22] || (_cache[22] = createBaseVNode("span", { class: "mnr-slider-label" }, "A", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "14",
                        max: "28",
                        value: fontSize.value,
                        class: "mnr-slider",
                        onInput: updateFontSize
                      }, null, 40, _hoisted_9$3),
                      _cache[23] || (_cache[23] = createBaseVNode("span", {
                        class: "mnr-slider-label",
                        style: { "font-size": "1.2em" }
                      }, "A", -1)),
                      createBaseVNode("span", _hoisted_10$2, toDisplayString(fontSize.value) + "px", 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_11$2, [
                    _cache[27] || (_cache[27] = createBaseVNode("h4", null, "行间距", -1)),
                    createBaseVNode("div", _hoisted_12$2, [
                      _cache[25] || (_cache[25] = createBaseVNode("span", { class: "mnr-slider-label" }, "≡", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "1.4",
                        max: "2.4",
                        step: "0.1",
                        value: lineHeight.value,
                        class: "mnr-slider",
                        onInput: updateLineHeight
                      }, null, 40, _hoisted_13$2),
                      _cache[26] || (_cache[26] = createBaseVNode("span", { class: "mnr-slider-label" }, "☰", -1)),
                      createBaseVNode("span", _hoisted_14$2, toDisplayString(lineHeight.value), 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_15$2, [
                    _cache[30] || (_cache[30] = createBaseVNode("h4", null, "内容宽度", -1)),
                    createBaseVNode("div", _hoisted_16$1, [
                      _cache[28] || (_cache[28] = createBaseVNode("span", { class: "mnr-slider-label" }, "⊏⊐", -1)),
                      createBaseVNode("input", {
                        type: "range",
                        min: "500",
                        max: "1200",
                        step: "50",
                        value: maxWidth.value,
                        class: "mnr-slider",
                        onInput: updateMaxWidth
                      }, null, 40, _hoisted_17$1),
                      _cache[29] || (_cache[29] = createBaseVNode("span", { class: "mnr-slider-label" }, "⊏ ⊐", -1)),
                      createBaseVNode("span", _hoisted_18$1, toDisplayString(maxWidth.value) + "px", 1)
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_19$1, [
                    _cache[32] || (_cache[32] = createBaseVNode("h4", null, "字体", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => fontFamily.value = $event),
                      class: "mnr-select",
                      onChange: updateFontFamily
                    }, [..._cache[31] || (_cache[31] = [
                      createBaseVNode("option", { value: "system-ui, -apple-system, 'Microsoft YaHei', sans-serif" }, " 系统默认 ", -1),
                      createBaseVNode("option", { value: "'Noto Serif SC', 'Source Han Serif SC', serif" }, "思源宋体", -1),
                      createBaseVNode("option", { value: "'PingFang SC', 'Hiragino Sans GB', sans-serif" }, "苹方", -1),
                      createBaseVNode("option", { value: "'Kaiti SC', 'STKaiti', serif" }, "楷体", -1)
                    ])], 544), [
                      [vModelSelect, fontFamily.value]
                    ])
                  ]),
                  createBaseVNode("section", _hoisted_20$1, [
                    _cache[33] || (_cache[33] = createBaseVNode("h4", null, "简繁转换", -1)),
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
                    _cache[38] || (_cache[38] = createBaseVNode("h4", null, "阅读行为", -1)),
                    createBaseVNode("label", _hoisted_24$1, [
                      _cache[34] || (_cache[34] = createBaseVNode("span", null, "键盘导航", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => keyboardNav.value = $event),
                        type: "checkbox",
                        onChange: _cache[6] || (_cache[6] = ($event) => updateBehavior("keyboardNavigation", keyboardNav.value))
                      }, null, 544), [
                        [vModelCheckbox, keyboardNav.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_25$1, [
                      _cache[35] || (_cache[35] = createBaseVNode("span", null, "手势翻页", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => swipeGestures.value = $event),
                        type: "checkbox",
                        onChange: _cache[8] || (_cache[8] = ($event) => updateBehavior("swipeGestures", swipeGestures.value))
                      }, null, 544), [
                        [vModelCheckbox, swipeGestures.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_26$1, [
                      _cache[36] || (_cache[36] = createBaseVNode("span", null, "自动隐藏顶栏", -1)),
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => autoHideHeader.value = $event),
                        type: "checkbox",
                        onChange: _cache[10] || (_cache[10] = ($event) => updateBehavior("autoHideHeader", autoHideHeader.value))
                      }, null, 544), [
                        [vModelCheckbox, autoHideHeader.value]
                      ])
                    ]),
                    createBaseVNode("label", _hoisted_27, [
                      _cache[37] || (_cache[37] = createBaseVNode("span", null, "显示阅读进度", -1)),
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
                    _cache[39] || (_cache[39] = createBaseVNode("h4", null, "页面防护", -1)),
                    createBaseVNode("div", _hoisted_29, [
                      createBaseVNode("button", {
                        class: normalizeClass(["mnr-segment", { active: protectionMode.value === "standard" }]),
                        onClick: _cache[13] || (_cache[13] = ($event) => updateProtectionMode("standard"))
                      }, " 标准 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["mnr-segment", { active: protectionMode.value === "aggressive" }]),
                        onClick: _cache[14] || (_cache[14] = ($event) => updateProtectionMode("aggressive"))
                      }, " 激进 ", 2)
                    ]),
                    _cache[40] || (_cache[40] = createBaseVNode("p", { class: "mnr-hint" }, "激进模式会尝试清理可疑脚本，可能影响站点功能。", -1))
                  ]),
                  createBaseVNode("section", _hoisted_30, [
                    _cache[43] || (_cache[43] = createBaseVNode("h4", null, "操作", -1)),
                    createBaseVNode("div", _hoisted_31, [
                      createBaseVNode("div", _hoisted_32, [
                        createBaseVNode("button", {
                          class: "mnr-action-btn",
                          onClick: _cache[15] || (_cache[15] = ($event) => _ctx.$emit("editRule"))
                        }, "编辑站点规则"),
                        hasUserRule.value ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "mnr-action-btn mnr-action-btn--danger",
                          onClick: handleResetRule
                        }, " 重置 ")) : createCommentVNode("", true)
                      ]),
                      createBaseVNode("div", _hoisted_33, [
                        createBaseVNode("button", {
                          class: "mnr-action-btn",
                          onClick: _cache[16] || (_cache[16] = ($event) => _ctx.$emit("cacheAll"))
                        }, [
                          _cache[41] || (_cache[41] = createTextVNode(" 缓存本书 ", -1)),
                          cacheProgress.value.total > 0 ? (openBlock(), createElementBlock("span", _hoisted_34, toDisplayString(cacheProgress.value.done) + "/" + toDisplayString(cacheProgress.value.total), 1)) : createCommentVNode("", true)
                        ]),
                        persistedCount.value > 0 ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "mnr-action-btn mnr-action-btn--danger",
                          onClick: handleClearCache
                        }, [
                          _cache[42] || (_cache[42] = createTextVNode(" 清除 ", -1)),
                          createBaseVNode("span", _hoisted_35, "(" + toDisplayString(persistedCount.value) + ")", 1)
                        ])) : createCommentVNode("", true)
                      ]),
                      createBaseVNode("button", {
                        class: "mnr-action-btn",
                        onClick: _cache[17] || (_cache[17] = ($event) => {
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
  const _sfc_main$3 = defineComponent({
    __name: "ElementPicker",
    props: {
      mode: { default: "content" },
      active: { type: Boolean, default: false }
    },
    emits: ["select", "cancel", "update:active"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const isActive = ref(false);
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
        return generateCssSelector(hoveredElement.value, { maxDepth: 5, allowClassCombination: true });
      });
      function handleMouseMove(e) {
        if (!isActive.value) return;
        mouseX.value = e.clientX;
        mouseY.value = e.clientY;
      }
      function tick() {
        if (!isActive.value) return;
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
        if (!isActive.value) return;
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
        const selector = generateCssSelector(target, { maxDepth: 5, allowClassCombination: true });
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
        isActive.value = true;
        document.addEventListener("mousemove", handleMouseMove, true);
        document.addEventListener("click", handleClick, true);
        window.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener("scroll", handleScroll, true);
        document.body.style.cursor = "crosshair";
        rafId.value = globalThis.requestAnimationFrame(tick);
      }
      function deactivate() {
        isActive.value = false;
        hoveredElement.value = null;
        highlightRect.value = null;
        document.removeEventListener("mousemove", handleMouseMove, true);
        document.removeEventListener("click", handleClick, true);
        window.removeEventListener("keydown", handleKeyDown, true);
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
          if (newVal && !isActive.value) {
            activate();
          } else if (!newVal && isActive.value) {
            deactivate();
          }
        },
        { immediate: true }
      );
      onUnmounted(() => {
        if (isActive.value) {
          deactivate();
        }
      });
      __expose({
        activate,
        deactivate,
        isActive
      });
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Teleport, { to: "body" }, [
          isActive.value ? (openBlock(), createElementBlock("div", {
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
  const ElementPicker = _export_sfc(_sfc_main$3, [["__scopeId", "data-v-69ce3430"]]);
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
  const _hoisted_10$1 = { key: 2 };
  const _hoisted_11$1 = {
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
  const _sfc_main$2 = defineComponent({
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
      function escapeHtml(text2) {
        return text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
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
            matchCount.value === 0 ? (openBlock(), createElementBlock("span", _hoisted_8$2, "❌ 未找到匹配元素")) : matchCount.value === 1 ? (openBlock(), createElementBlock("span", _hoisted_9$2, "✓ 找到 1 个元素")) : (openBlock(), createElementBlock("span", _hoisted_10$1, "⚠ 找到 " + toDisplayString(matchCount.value) + " 个元素", 1))
          ], 2)) : createCommentVNode("", true),
          __props.showPreview && previewContent.value ? (openBlock(), createElementBlock("div", _hoisted_11$1, [
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
  const SelectorPreview = _export_sfc(_sfc_main$2, [["__scopeId", "data-v-26d93800"]]);
  const _hoisted_1$1 = { class: "mnr-editor-header" };
  const _hoisted_2$1 = { class: "mnr-editor-title" };
  const _hoisted_3$1 = { class: "mnr-editor-tabs" };
  const _hoisted_4$1 = ["onClick"];
  const _hoisted_5$1 = { class: "mnr-editor-content" };
  const _hoisted_6$1 = { class: "mnr-form-section" };
  const _hoisted_7$1 = { class: "mnr-form-group" };
  const _hoisted_8$1 = { class: "mnr-form-group" };
  const _hoisted_9$1 = { class: "mnr-form-section" };
  const _hoisted_10 = { class: "mnr-form-group" };
  const _hoisted_11 = { class: "mnr-form-section" };
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
  const _hoisted_23 = { class: "mnr-form-section" };
  const _hoisted_24 = { class: "mnr-form-group" };
  const _hoisted_25 = { class: "mnr-editor-footer" };
  const _hoisted_26 = ["disabled"];
  const _sfc_main$1 = defineComponent({
    __name: "RuleEditorPanel",
    props: {
      rule: {},
      domain: {}
    },
    emits: ["save", "cancel", "pickerStateChange"],
    setup(__props, { emit: __emit }) {
      var _a, _b, _c, _d, _e;
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
      const customCSS = ref(((_e = localRule.style) == null ? void 0 : _e.customCSS) || "");
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
          const entries2 = Object.entries(obj).filter(([, v]) => v !== void 0);
          if (entries2.length === 0) return "{}";
          return entries2.map(([k, v]) => {
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
        var _a2;
        if (!localRule.processing) localRule.processing = {};
        localRule.processing.removeAds = processingOptions.removeAds;
        localRule.processing.fixImages = processingOptions.fixImages;
        localRule.processing.useRawContent = processingOptions.useRawContent;
        const beforeParse = hookBeforeParse.value.trim();
        if (beforeParse) {
          if (!localRule.hooks) localRule.hooks = {};
          localRule.hooks.beforeParse = beforeParse;
        } else if ((_a2 = localRule.hooks) == null ? void 0 : _a2.beforeParse) {
          delete localRule.hooks.beforeParse;
          if (Object.keys(localRule.hooks).length === 0) {
            delete localRule.hooks;
          }
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
            _cache[22] || (_cache[22] = createBaseVNode("span", { class: "mnr-shortcut-hint" }, "E", -1)),
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
              _cache[26] || (_cache[26] = createBaseVNode("h4", { class: "mnr-section-title" }, "基本信息", -1)),
              createBaseVNode("div", _hoisted_7$1, [
                _cache[23] || (_cache[23] = createBaseVNode("label", null, "规则名称", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => localRule.name = $event),
                  type: "text",
                  placeholder: "例如: 起点中文网"
                }, null, 512), [
                  [vModelText, localRule.name]
                ])
              ]),
              createBaseVNode("div", _hoisted_8$1, [
                _cache[24] || (_cache[24] = createBaseVNode("label", null, "URL 匹配模式", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => localRule.match.pattern = $event),
                  type: "text",
                  placeholder: "正则表达式，例如: ^https://www\\\\.example\\\\.com/"
                }, null, 512), [
                  [vModelText, localRule.match.pattern]
                ]),
                _cache[25] || (_cache[25] = createBaseVNode("span", { class: "mnr-hint" }, "正则表达式，匹配当前页面 URL", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_9$1, [
              _cache[29] || (_cache[29] = createBaseVNode("h4", { class: "mnr-section-title" }, "内容选择器", -1)),
              createVNode(SelectorPreview, {
                selector: localRule.content.selector,
                "onUpdate:selector": _cache[2] || (_cache[2] = ($event) => localRule.content.selector = $event),
                label: "正文内容",
                "show-preview": true,
                "preview-type": "html",
                onPick: _cache[3] || (_cache[3] = ($event) => startPicking("content"))
              }, null, 8, ["selector"]),
              createBaseVNode("div", _hoisted_10, [
                _cache[27] || (_cache[27] = createBaseVNode("label", null, "移除元素", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => localRule.content.remove = $event),
                  type: "text",
                  placeholder: "例如: .ad, .comment, script"
                }, null, 512), [
                  [vModelText, localRule.content.remove]
                ]),
                _cache[28] || (_cache[28] = createBaseVNode("span", { class: "mnr-hint" }, "要从内容中移除的元素选择器，逗号分隔", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_11, [
              _cache[30] || (_cache[30] = createBaseVNode("h4", { class: "mnr-section-title" }, "导航链接", -1)),
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
              _cache[31] || (_cache[31] = createBaseVNode("h4", { class: "mnr-section-title" }, "标题", -1)),
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
              }, [..._cache[32] || (_cache[32] = [
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
              _cache[36] || (_cache[36] = createBaseVNode("h4", { class: "mnr-section-title" }, "处理选项", -1)),
              createBaseVNode("label", _hoisted_18, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => processingOptions.removeAds = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, processingOptions.removeAds]
                ]),
                _cache[33] || (_cache[33] = createBaseVNode("span", null, "移除广告", -1))
              ]),
              createBaseVNode("label", _hoisted_19, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => processingOptions.fixImages = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, processingOptions.fixImages]
                ]),
                _cache[34] || (_cache[34] = createBaseVNode("span", null, "修复图片", -1))
              ]),
              createBaseVNode("label", _hoisted_20, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => processingOptions.useRawContent = $event),
                  type: "checkbox"
                }, null, 512), [
                  [vModelCheckbox, processingOptions.useRawContent]
                ]),
                _cache[35] || (_cache[35] = createBaseVNode("span", null, "使用原始内容（不处理）", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_21, [
              _cache[38] || (_cache[38] = createBaseVNode("h4", { class: "mnr-section-title" }, "自定义钩子", -1)),
              createBaseVNode("div", _hoisted_22, [
                _cache[37] || (_cache[37] = createBaseVNode("label", null, "解析前执行 (beforeParse)", -1)),
                withDirectives(createBaseVNode("textarea", {
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => hookBeforeParse.value = $event),
                  class: "mnr-hook-editor",
                  placeholder: "// JavaScript 代码，参数: doc, url, helpers"
                }, null, 512), [
                  [vModelText, hookBeforeParse.value]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_23, [
              _cache[39] || (_cache[39] = createBaseVNode("h4", { class: "mnr-section-title" }, "自定义 CSS", -1)),
              createBaseVNode("div", _hoisted_24, [
                withDirectives(createBaseVNode("textarea", {
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => customCSS.value = $event),
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
          createBaseVNode("div", _hoisted_25, [
            createBaseVNode("button", {
              class: "mnr-btn mnr-btn-secondary",
              onClick: _cache[20] || (_cache[20] = ($event) => _ctx.$emit("cancel"))
            }, "取消"),
            createBaseVNode("button", {
              class: "mnr-btn mnr-btn-primary",
              disabled: !isValid.value,
              onClick: save
            }, "保存规则", 8, _hoisted_26)
          ]),
          createVNode(ElementPicker, {
            active: pickerActive.value,
            "onUpdate:active": _cache[21] || (_cache[21] = ($event) => pickerActive.value = $event),
            mode: pickerMode.value,
            onSelect: handlePickerSelect,
            onCancel: handlePickerCancel
          }, null, 8, ["active", "mode"])
        ], 2);
      };
    }
  });
  const RuleEditorPanel = _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0ee14539"]]);
  const _hoisted_1 = {
    key: 0,
    class: "mnr-loading-prev"
  };
  const _hoisted_2 = ["data-chapter-url", "lang"];
  const _hoisted_3 = { class: "mnr-chapter-title" };
  const _hoisted_4 = ["innerHTML"];
  const _hoisted_5 = {
    key: 1,
    class: "mnr-loading-next"
  };
  const _hoisted_6 = {
    key: 2,
    class: "mnr-chapter-end"
  };
  const _hoisted_7 = { class: "mnr-chapter-nav" };
  const _hoisted_8 = ["href"];
  const _hoisted_9 = { class: "mnr-rule-editor-container" };
  const SCROLL_BOUNDARY_EPSILON_PX = 4;
  const _sfc_main = defineComponent({
    __name: "ReaderView",
    setup(__props) {
      const readerStore = useReaderStore();
      const configStore = useConfigStore();
      const ruleStore = useRuleStore();
      const mainRef = ref(null);
      const topSentinel = ref(null);
      const bottomSentinel = ref(null);
      const isNavigating = ref(false);
      const showControls = ref(true);
      const chapterRefs = new Map();
      const {
        settingsVisible,
        ruleEditorVisible,
        isPickerActive,
        drawerOpen,
        currentRule,
        currentDomain,
        toggleDrawer,
        openSettings,
        openRuleEditor,
        handleRuleSave,
        handleRuleReset,
        handleEscape,
        toggleSettings,
        toggleRuleEditor
      } = useReaderUIControls({ readerStore, ruleStore, showControls });
      let topObserver = null;
      let bottomObserver = null;
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
      const scrollPercent = computed(() => readerStore.scrollPercent);
      const showProgress = computed(() => configStore.behavior.showProgress);
      const cacheProgress = computed(() => readerStore.cacheProgress);
      const autoHideHeader = computed(() => configStore.behavior.autoHideHeader);
      const contentLang = computed(() => {
        if (readerStore.currentConversionMode === "sc") return "zh-CN";
        if (readerStore.currentConversionMode === "tc") return "zh-TW";
        return void 0;
      });
      const { scheduleAutoLoadNext } = useReaderAutoLoad({
        mainRef,
        readerStore,
        configStore,
        hasNext,
        isLoadingNext,
        isLoadingPrev,
        isLoading,
        isNavigating
      });
      const { handleScroll } = useReaderScroll({
        mainRef,
        chapters,
        visibleChapters,
        chapterRefs,
        chapterHeights,
        averageHeight,
        setChapterHeight,
        updateWindow,
        readerStore,
        autoHideHeader,
        showControls,
        isNavigating,
        scheduleAutoLoadNext
      });
      const {
        navigateChapter,
        jumpToCachedChapter,
        scrollReader,
        loadPrevWithScrollAdjust,
        handleWheel
      } = useChapterNavigation({
        mainRef,
        chapters,
        chapterRefs,
        readerStore,
        isNavigating,
        isLoadingPrev,
        isLoadingNext,
        hasPrev,
        hasNext,
        topSpacer,
        setChapterHeight,
        updateWindow
      });
      const swipeEnabled = computed(() => configStore.behavior.swipeGestures && !isPickerActive.value);
      const { handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } = useTouchGestures({
        enabled: swipeEnabled,
        onSwipeLeft: () => void navigateChapter("next"),
        onSwipeRight: () => void navigateChapter("prev")
      });
      let lastTouchPoint = null;
      let isManualBoundaryLoadingNext = false;
      function shieldEvent(event) {
        event.stopPropagation();
      }
      function isSingleTouchEvent(event) {
        const candidate = event;
        return Boolean(candidate.touches && candidate.touches.length === 1);
      }
      function isAtTop(mainEl) {
        return mainEl.scrollTop <= SCROLL_BOUNDARY_EPSILON_PX;
      }
      function isAtBottom(mainEl) {
        return mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight) <= SCROLL_BOUNDARY_EPSILON_PX;
      }
      function triggerNextAppendFromBoundary() {
        if (!hasNext.value) return;
        if (isLoadingNext.value || isLoadingPrev.value || isLoading.value || isNavigating.value || isManualBoundaryLoadingNext) {
          return;
        }
        isManualBoundaryLoadingNext = true;
        void readerStore.loadNextChapter("manual").finally(() => {
          isManualBoundaryLoadingNext = false;
          scheduleAutoLoadNext("state");
        });
      }
      function preventIfCancelable(event) {
        if (event.cancelable === false) return;
        event.preventDefault();
      }
      function handleReaderTouchStart(event) {
        if (isSingleTouchEvent(event)) {
          const touch = event.touches[0];
          lastTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };
        } else {
          lastTouchPoint = null;
        }
        handleTouchStart(event);
      }
      function guardTouchBoundary(event) {
        const mainEl = mainRef.value;
        if (!mainEl || !isSingleTouchEvent(event) || !lastTouchPoint) return;
        const touch = event.touches[0];
        const deltaX = lastTouchPoint.clientX - touch.clientX;
        const deltaY = lastTouchPoint.clientY - touch.clientY;
        lastTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };
        if (Math.abs(deltaY) < 2) return;
        if (Math.abs(deltaY) < Math.abs(deltaX)) return;
        if (deltaY > 0 && isAtBottom(mainEl)) {
          preventIfCancelable(event);
          triggerNextAppendFromBoundary();
        } else if (deltaY < 0 && isAtTop(mainEl)) {
          preventIfCancelable(event);
          if (hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
            void loadPrevWithScrollAdjust();
          }
        }
      }
      function handleReaderTouchMove(event) {
        handleTouchMove(event);
        guardTouchBoundary(event);
      }
      function handleReaderTouchEnd(event) {
        lastTouchPoint = null;
        handleTouchEnd(event);
        scheduleAutoLoadNext("settled");
      }
      function handleReaderTouchCancel() {
        lastTouchPoint = null;
        handleTouchCancel();
        scheduleAutoLoadNext("settled");
      }
      function navigate(direction) {
        if (indexUrl.value) {
          window.location.href = indexUrl.value;
        }
      }
      function handleChapterSelect(entry) {
        if (entry.isCached) {
          jumpToCachedChapter(entry.url);
        } else {
          window.location.href = entry.url;
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
      function setChapterRef(url) {
        return (el) => {
          if (!el) {
            chapterRefs.delete(url);
            return;
          }
          chapterRefs.set(url, el);
          setChapterHeight(url, el.offsetHeight);
        };
      }
      function exitReader() {
        closeReader();
      }
      const keyboardEnabled = computed(
        () => configStore.behavior.keyboardNavigation && !isPickerActive.value
      );
      useKeyboardShortcuts(
        [
          { key: "escape", handler: handleEscape, allowInInputs: true },
          { key: "tab", handler: toggleDrawer, preventDefault: true },
          {
            key: "enter",
            handler: () => {
              if (indexUrl.value) window.location.href = indexUrl.value;
            },
            preventDefault: true
          },
          { key: ["s", ","], handler: toggleSettings, preventDefault: true },
          { key: "e", handler: toggleRuleEditor, preventDefault: true },
          { key: "q", handler: exitReader, preventDefault: true, stopPropagation: true },
          {
            key: ["arrowleft", "p"],
            handler: () => navigateChapter("prev"),
            preventDefault: true,
            stopPropagation: true
          },
          {
            key: ["arrowright", "n"],
            handler: () => navigateChapter("next"),
            preventDefault: true,
            stopPropagation: true
          },
          { key: "arrowup", handler: () => scrollReader("up"), preventDefault: true },
          { key: "arrowdown", handler: () => scrollReader("down"), preventDefault: true },
          {
            key: " ",
            handler: (e) => scrollReader(e.shiftKey ? "pageup" : "pagedown"),
            preventDefault: true
          }
        ],
        { enabled: keyboardEnabled }
      );
      const INTERSECTION_ROOT_MARGIN = `${INTERSECTION_ROOT_MARGIN_PX}px`;
      onMounted(async () => {
        var _a;
        configStore.applyAll();
        const textConversion = configStore.reading.textConversion;
        if (textConversion !== "none") {
          await readerStore.applyTextConversion(textConversion);
        }
        if (mainRef.value) {
          mainRef.value.addEventListener("scroll", handleScroll, { passive: true });
          mainRef.value.addEventListener("wheel", handleWheel, { passive: false });
          mainRef.value.addEventListener("touchstart", handleReaderTouchStart, { passive: true });
          mainRef.value.addEventListener("touchmove", handleReaderTouchMove, { passive: false });
          mainRef.value.addEventListener("touchend", handleReaderTouchEnd, { passive: true });
          mainRef.value.addEventListener("touchcancel", handleReaderTouchCancel, { passive: true });
        }
        const observerOptions = {
          root: mainRef.value,
          rootMargin: INTERSECTION_ROOT_MARGIN,
          threshold: 0
        };
        bottomObserver = new globalThis.IntersectionObserver((entries2) => {
          var _a2;
          if (!((_a2 = entries2[0]) == null ? void 0 : _a2.isIntersecting)) return;
          scheduleAutoLoadNext("sentinel");
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
        scheduleAutoLoadNext("state");
      });
      onUnmounted(() => {
        if (mainRef.value) {
          mainRef.value.removeEventListener("scroll", handleScroll);
          mainRef.value.removeEventListener("wheel", handleWheel);
          mainRef.value.removeEventListener("touchstart", handleReaderTouchStart);
          mainRef.value.removeEventListener("touchmove", handleReaderTouchMove);
          mainRef.value.removeEventListener("touchend", handleReaderTouchEnd);
          mainRef.value.removeEventListener("touchcancel", handleReaderTouchCancel);
        }
        topObserver == null ? void 0 : topObserver.disconnect();
        bottomObserver == null ? void 0 : bottomObserver.disconnect();
        topObserver = null;
        bottomObserver = null;
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: "mnr-reader",
          onClick: shieldEvent,
          onMousedown: shieldEvent,
          onMouseup: shieldEvent,
          onWheel: shieldEvent,
          onTouchstart: shieldEvent,
          onTouchmove: shieldEvent,
          onTouchend: shieldEvent,
          onPointerdown: shieldEvent,
          onPointermove: shieldEvent,
          onPointerup: shieldEvent
        }, [
          showProgress.value ? (openBlock(), createBlock(ProgressIndicator, {
            key: 0,
            percent: scrollPercent.value,
            "auto-hide": true
          }, null, 8, ["percent"])) : createCommentVNode("", true),
          createVNode(FloatingToolbar, {
            visible: showControls.value,
            "cache-running": cacheProgress.value.running,
            "cache-done": cacheProgress.value.done,
            "cache-total": cacheProgress.value.total,
            "cache-disabled": cacheProgress.value.running && cacheProgress.value.total === 0,
            onToggleDrawer: unref(toggleDrawer),
            onToggleCache: toggleCacheAll,
            onOpenSettings: unref(openSettings)
          }, null, 8, ["visible", "cache-running", "cache-done", "cache-total", "cache-disabled", "onToggleDrawer", "onOpenSettings"]),
          createVNode(ChapterDrawer, {
            "is-open": unref(drawerOpen),
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
            isLoadingPrev.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
              createVNode(unref(MnrSpinner), { size: "small" }),
              _cache[5] || (_cache[5] = createBaseVNode("span", null, "加载上一章...", -1))
            ])) : createCommentVNode("", true),
            createBaseVNode("div", {
              style: normalizeStyle({ height: `${unref(topSpacer)}px` })
            }, null, 4),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(visibleChapters), (entry) => {
              return openBlock(), createElementBlock("article", {
                key: entry.id,
                ref_for: true,
                ref: setChapterRef(entry.chapter.url),
                class: "mnr-reader-content",
                "data-chapter-url": entry.chapter.url,
                lang: contentLang.value,
                onClick: handleContentClick
              }, [
                createBaseVNode("h1", _hoisted_3, toDisplayString(entry.chapter.title), 1),
                createBaseVNode("div", {
                  innerHTML: entry.chapter.content
                }, null, 8, _hoisted_4)
              ], 8, _hoisted_2);
            }), 128)),
            createBaseVNode("div", {
              style: normalizeStyle({ height: `${unref(bottomSpacer)}px` })
            }, null, 4),
            createBaseVNode("div", {
              ref_key: "bottomSentinel",
              ref: bottomSentinel,
              class: "mnr-sentinel"
            }, null, 512),
            isLoadingNext.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
              createVNode(unref(MnrSpinner), { size: "small" }),
              _cache[6] || (_cache[6] = createBaseVNode("span", null, "加载下一章...", -1))
            ])) : createCommentVNode("", true),
            chapters.value.length > 0 && !hasNext.value && !isLoadingNext.value ? (openBlock(), createElementBlock("div", _hoisted_6, [
              _cache[7] || (_cache[7] = createBaseVNode("p", { class: "mnr-chapter-end-text" }, "— 已是最后一章 —", -1)),
              createBaseVNode("div", _hoisted_7, [
                indexUrl.value ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  href: indexUrl.value,
                  class: "mnr-chapter-link index",
                  onClick: _cache[1] || (_cache[1] = withModifiers(($event) => navigate(), ["prevent"]))
                }, " 返回目录 ", 8, _hoisted_8)) : createCommentVNode("", true)
              ])
            ])) : createCommentVNode("", true)
          ], 512),
          createVNode(_sfc_main$4, {
            visible: unref(settingsVisible),
            domain: unref(currentDomain),
            onClose: _cache[2] || (_cache[2] = ($event) => settingsVisible.value = false),
            onEditRule: unref(openRuleEditor),
            onResetRule: unref(handleRuleReset),
            onTextConversionChange: handleTextConversionChange,
            onCacheAll: handleCacheAll
          }, null, 8, ["visible", "domain", "onEditRule", "onResetRule"]),
          unref(ruleEditorVisible) ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["mnr-rule-editor-overlay", { "mnr-overlay-hidden": unref(isPickerActive) }])
          }, [
            createBaseVNode("div", _hoisted_9, [
              createVNode(RuleEditorPanel, {
                rule: unref(currentRule),
                domain: unref(currentDomain),
                onSave: unref(handleRuleSave),
                onCancel: _cache[3] || (_cache[3] = ($event) => ruleEditorVisible.value = false),
                onPickerStateChange: _cache[4] || (_cache[4] = ($event) => isPickerActive.value = $event)
              }, null, 8, ["rule", "domain", "onSave"])
            ])
          ], 2)) : createCommentVNode("", true),
          isLoading.value ? (openBlock(), createBlock(unref(MnrLoadingOverlay), { key: 2 }, {
            default: withCtx(() => [..._cache[8] || (_cache[8] = [
              createBaseVNode("span", null, "加载中...", -1)
            ])]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(unref(MnrToast), {
            message: error.value ?? "",
            type: toastType.value,
            visible: !!error.value,
            onDismiss: clearError
          }, null, 8, ["message", "type", "visible"])
        ], 32);
      };
    }
  });
  const ReaderView = _export_sfc(_sfc_main, [["__scopeId", "data-v-e6103b6b"]]);
  const appState = {
    isInitialized: false,
    autoEnableDone: false,
    isActive: false,
    currentDecision: null,
    originalHostPage: null,
    entryPageKind: null
  };
  let app = null;
  let pinia = null;
  let readerCleanup = null;
  function buildProtectionOptions(settings) {
    return {
      blockRedirects: settings.blockRedirects,
      enableRightClick: settings.enableRightClick,
      enableSelection: settings.enableSelection,
      blockPopups: settings.blockPopups,
      clearTimers: true,
      unlockKeyboard: true,
      cleanupScripts: settings.mode === "aggressive"
    };
  }
  function shouldEnableEarlyProtection(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      const path = u.pathname.toLowerCase();
      if (/(login|register|signup|search|rank|category|tag|author|help|about|contact)/.test(path)) {
        return false;
      }
      if (/(index|list|catalog|toc|contents?)\.html?$/.test(path) || /\/(catalog|toc)\//.test(path)) {
        return false;
      }
      if (/\/(chapter|txt|read|article)\//.test(path) && /\d/.test(path)) return true;
      if (/\/(book|novel|xiaoshuo)\//.test(path) && /\d/.test(path) && /\.html?$/.test(path)) {
        return true;
      }
      if (/\d{3,}[^/]*\.html?$/.test(path)) return true;
      return false;
    } catch {
      return false;
    }
  }
  try {
    if (shouldEnableEarlyProtection(window.location.href)) {
      getSiteProtection().activate({
        blockRedirects: true,
        blockPopups: true,
        clearTimers: false,
        enableRightClick: false,
        enableSelection: false,
        enableCopy: false,
        unlockKeyboard: false,
        removeEventHijacking: false,
        blockVisibilityDetection: false,
        cleanupScripts: false
      });
    }
  } catch (e) {
    console.error("[MNR] Early protection error:", e);
  }
  async function initialize() {
    await ensureInitialized();
    if (!appState.isInitialized || appState.autoEnableDone) return;
    appState.autoEnableDone = true;
    await runAutoEnable();
  }
  async function ensureInitialized() {
    if (appState.isInitialized) return;
    console.log(`[MNR] MyNovelReader v${VERSION} (${BUILD_DATE})`);
    try {
      pinia = createPinia();
      const configStore = useConfigStore(pinia);
      const ruleStore = useRuleStore(pinia);
      await Promise.all([configStore.load(), ruleStore.initialize()]);
      appState.isInitialized = true;
    } catch (e) {
      console.error("[MNR] Initialization error:", e);
    }
  }
  async function runAutoEnable() {
    const configStore = useConfigStore(pinia);
    const protectionOptions = buildProtectionOptions(configStore.protection);
    const manager = getAutoEnableManager({
      enableProtection: true,
      protectionOptions
    });
    const skipFlag = sessionStorage.getItem("mnr_skip_auto_enable");
    if (skipFlag) {
      sessionStorage.removeItem("mnr_skip_auto_enable");
      const flagTime = parseInt(skipFlag, 10);
      if (!isNaN(flagTime) && Date.now() - flagTime < 5e3) {
        showFloatingButton();
        return;
      }
    }
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
    if (!appState.isActive && decision.shouldEnable) {
      showFloatingButton();
    }
  }
  async function showPrompt(decision) {
    return new Promise((resolve) => {
      const { mountPoint, cleanup } = createShadowMount("mnr-prompt-root");
      const showPrompt2 = ref(true);
      const PromptWrapper = defineComponent({
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
    appState.originalHostPage = captureHostPageSnapshot();
    const pageKind = getPageKind(window.location.href, document);
    appState.entryPageKind = pageKind === "chapter" || rule || chapter.rule ? "chapter" : pageKind;
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
    const entryPageKind = appState.entryPageKind;
    if (entryPageKind === "chapter") {
      try {
        const hostname = new URL(window.location.href).hostname;
        const storage = getRuleStorage();
        storage.setSitePreference(hostname, { enabled: false, timestamp: Date.now() });
      } catch (e) {
        console.error("[MNR] Failed to save site preference:", e);
      }
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
    const originalHostPage = appState.originalHostPage;
    const originalUrl = (originalHostPage == null ? void 0 : originalHostPage.url) || null;
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
    appState.originalHostPage = null;
    appState.entryPageKind = null;
    if (targetUrl && originalUrl && targetUrl !== originalUrl) {
      sessionStorage.setItem("mnr_skip_auto_enable", Date.now().toString());
      window.location.href = targetUrl;
      return;
    }
    restoreHostPageSnapshot(originalHostPage);
    if (entryPageKind === "chapter") {
      showFloatingButton();
    }
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
    const currentUrl = window.location.href;
    hideFloatingButton();
    await ensureInitialized();
    if (!pinia) return;
    const configStore = useConfigStore(pinia);
    const protectionOptions = buildProtectionOptions(configStore.protection);
    const manager = getAutoEnableManager({
      enableProtection: true,
      protectionOptions
    });
    manager.setLaunchCallback(launchReader);
    await manager.manualEnable(document);
    if (!appState.isActive && await shouldShowManualEntryForPage(currentUrl, document)) {
      showFloatingButton();
    }
  }
  function isTopFrame() {
    try {
      return window.top === window.self;
    } catch {
      return false;
    }
  }
  function registerMenuCommands() {
    if (!isTopFrame()) return;
    if (typeof GM_registerMenuCommand !== "function") return;
    GM_registerMenuCommand("进入阅读模式", () => {
      manualEnable().catch((e) => console.error("[MNR] Manual enable error:", e));
    });
  }
  async function bootstrap() {
    registerMenuCommands();
    if (!isTopFrame()) return;
    if (appState.isActive) return;
    const url = window.location.href;
    const pageKind = getPageKind(url, document);
    if (!await shouldBootstrapForPage(url, pageKind)) return;
    try {
      const hostname = new URL(url).hostname;
      const pref = getRuleStorage().getSitePreference(hostname);
      if ((pref == null ? void 0 : pref.enabled) === false) {
        showFloatingButton();
        return;
      }
    } catch (e) {
      console.debug("[MNR] Failed to read site preference:", e);
    }
    await initialize();
  }
  async function shouldBootstrapForPage(url, pageKind) {
    if (pageKind === "chapter") return true;
    if (pageKind === "toc") return false;
    try {
      const manager = getRuleManager();
      await manager.initialize();
      return await manager.matchRule(url) !== null;
    } catch (e) {
      console.debug("[MNR] Failed to match bootstrap rule:", e);
      return false;
    }
  }
  async function shouldShowManualEntryForPage(url, doc2 = document) {
    const pageKind = getPageKind(url, doc2);
    if (pageKind === "chapter") return true;
    if (pageKind === "toc") return false;
    try {
      const manager = getRuleManager();
      await manager.initialize();
      return await manager.matchRule(url) !== null;
    } catch (e) {
      console.debug("[MNR] Failed to match manual-entry rule:", e);
      return false;
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bootstrap().catch((e) => console.error("[MNR] Bootstrap error:", e));
    });
  } else {
    bootstrap().catch((e) => console.error("[MNR] Bootstrap error:", e));
  }

})();