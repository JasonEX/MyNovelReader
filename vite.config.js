import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryPoint = path.resolve(__dirname, 'src/index.ts');

// Generate meta header from version.ts
const version =
  fs
    .readFileSync(path.resolve(__dirname, 'src/version.ts'), 'utf8')
    .match(/VERSION\s*=\s*['"]([^'"]+)['"]/)?.[1] || '2.0.0';

const metaHeader = `// ==UserScript==
// @id             mynovelreader@ywzhaiqi@gmail.com
// @name           My Novel Reader
// @name:zh-CN     小说阅读脚本
// @name:zh-TW     小說閱讀腳本
// @version        ${version}
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
// ==/UserScript==`;

// Plugin: Insert UserScript meta header into final bundle
function userscriptHeaderPlugin() {
  return {
    name: 'userscript-header',
    enforce: 'post',
    generateBundle(_options, bundle) {
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && fileName.endsWith('.js') && metaHeader) {
          chunk.code = `${metaHeader}\n${chunk.code}`;
        }
      });
    },
  };
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({ NODE_ENV: 'production' }),
    process: JSON.stringify({ env: { NODE_ENV: 'production' } }),
  },
  build: {
    lib: {
      entry: entryPoint,
      name: 'MyNovelReader',
      formats: ['iife'],
      fileName: () => 'MyNovelReader.user.js',
    },
    outDir: 'scripts',
    emptyOutDir: false,
    sourcemap: false,
    minify: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        banner: metaHeader,
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin({
      // Store CSS for later injection into Shadow DOM
      // Also inject to document.head for components that need light DOM (like ElementPicker)
      injectCodeFunction: function (cssCode) {
        try {
          if (typeof window !== 'undefined') {
            // Store CSS for Shadow DOM injection
            window.__MNR_STYLES__ = (window.__MNR_STYLES__ || '') + cssCode;

            // Also inject to document.head for light DOM components (ElementPicker, etc.)
            // Use a unique ID to prevent duplicate injection
            var styleId = 'mnr-global-styles';
            var existingStyle = document.getElementById(styleId);
            if (!existingStyle) {
              existingStyle = document.createElement('style');
              existingStyle.id = styleId;
              document.head.appendChild(existingStyle);
            }
            existingStyle.textContent = window.__MNR_STYLES__;

            // If Shadow DOM already exists, also inject there
            if (window.__MNR_SHADOW_ROOT__) {
              var shadowStyle = window.__MNR_SHADOW_ROOT__.querySelector('#mnr-app-styles');
              if (!shadowStyle) {
                shadowStyle = document.createElement('style');
                shadowStyle.id = 'mnr-app-styles';
                window.__MNR_SHADOW_ROOT__.appendChild(shadowStyle);
              }
              shadowStyle.textContent = window.__MNR_STYLES__;
            }
          }
        } catch (e) {
          console.error('[MNR] CSS injection error:', e);
        }
      },
    }),
    userscriptHeaderPlugin(),
  ],
  css: {
    extract: false,
    modules: {
      scopeBehaviour: 'global',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/core/**/*.{js,ts}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
