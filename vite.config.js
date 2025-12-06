import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import fs from 'fs';

const metaPath = path.resolve(__dirname, 'src/MyNovelReader/meta.js');
const metaText = fs.readFileSync(metaPath, 'utf8');
const metaStart = metaText.indexOf('// ==UserScript==');
const metaEnd = metaText.indexOf('// ==/UserScript==');
const metaHeader =
  metaStart !== -1 && metaEnd !== -1
    ? metaText.slice(metaStart, metaEnd + '// ==/UserScript=='.length)
    : '';

// 插件：将模板和样式文件作为字符串导入
function stringPlugin() {
  return {
    name: 'string',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.tpl') || id.endsWith('.css.txt')) {
        return `export default ${JSON.stringify(fs.readFileSync(id, 'utf-8'))}`;
      }
    },
  };
}

// 插件：强制把 UserScript 元数据头插入最终产物
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
      entry: path.resolve(__dirname, 'src/MyNovelReader/index.js'),
      name: 'MyNovelReader',
      formats: ['iife'],
      fileName: format => 'MyNovelReader.user.js',
    },
    outDir: 'scripts',
    emptyOutDir: false,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      mangle: false,
      compress: {
        defaults: false,
        unused: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        sequences: true,
        evaluate: true,
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        // 保留 UserScript 元数据头，否则被压缩器去掉后脚本无法被油猴识别
        comments: (_node, comment) => comment.value.includes('==UserScript=='),
        beautify: false,
        preserve_annotations: true,
      },
      keep_classnames: true,
      keep_fnames: true,
    },
    cssMinify: true,
    rollupOptions: {
      external: [
        'jquery',
        'zepto',
        'dayjs',
        'ajax-hook',
        'md5',
        'underscore',
        'keymaster',
        'crypto-js',
      ],
      treeshake: {
        // Keep side-effectful modules like lang.js, meta.js etc. so
        // prototype extensions (uiTrans) and metadata are not tree-shaken.
        moduleSideEffects: true,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        globals: {
          jquery: 'jQuery',
          zepto: 'Zepto',
          dayjs: 'dayjs',
          'ajax-hook': 'ah',
          md5: 'md5',
          underscore: '_',
          keymaster: 'key',
          'crypto-js': 'CryptoJS',
        },
        banner: metaHeader || '/* This script build by Vite. */',
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
  },
  plugins: [vue(), cssInjectedByJsPlugin(), stringPlugin(), userscriptHeaderPlugin()],
  css: {
    // 不提取 CSS 文件，将样式内联到 JS 中
    extract: false,
    // 将 CSS 作为模块注入
    modules: {
      scopeBehaviour: 'global',
    },
    // 配置预处理器
    preprocessorOptions: {
      less: {
        // 可添加全局 Less 变量等配置
        additionalData: '',
        javascriptEnabled: true,
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
