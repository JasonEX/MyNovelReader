import { createMeta, toUserscriptConfig } from './src/meta';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import fs from 'fs';
import monkey from 'vite-plugin-monkey';
import path from 'path';
import vue from '@vitejs/plugin-vue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryPoint = path.resolve(__dirname, 'src/index.ts');
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const version = pkg.version || '0.0.0';
const buildDate = process.env.MNR_BUILD_DATE || pkg.buildDate || '1970-01-01';
const meta = createMeta({ version });
const userscript = toUserscriptConfig(meta);

export default defineConfig({
  define: {
    __MNR_VERSION__: JSON.stringify(version),
    __MNR_BUILD_DATE__: JSON.stringify(buildDate),
    // NOTE: Only process.env.NODE_ENV is used; Vite replaces it at build time.
    // No other process.env.* references exist in the codebase.
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'scripts',
    emptyOutDir: false,
    sourcemap: false,
    minify: false,
    cssMinify: true,
    cssCodeSplit: false,
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin({
      topExecutionPriority: false,
      // Store CSS for later injection into Shadow DOM
      injectCodeFunction: function (cssCode) {
        try {
          if (typeof window !== 'undefined') {
            type MnrGlobalState = {
              styles?: string;
              shadowRoots?: Set<ShadowRoot>;
            };
            type MnrWindow = Window & { __MY_NOVEL_READER__?: MnrGlobalState };

            const w = window as MnrWindow;
            const globalState = w.__MY_NOVEL_READER__ || (w.__MY_NOVEL_READER__ = {});

            // Store CSS for Shadow DOM injection
            globalState.styles = (globalState.styles || '') + cssCode;

            // Inject only into MyNovelReader Shadow DOM roots.
            if (globalState.shadowRoots) {
              globalState.shadowRoots.forEach(function (shadowRoot) {
                var shadowStyle = shadowRoot.querySelector('#mnr-app-styles');
                if (!shadowStyle) {
                  shadowStyle = document.createElement('style');
                  shadowStyle.id = 'mnr-app-styles';
                  shadowRoot.appendChild(shadowStyle);
                }
                shadowStyle.textContent = globalState.styles;
              });
            }
          }
        } catch (e) {
          console.error('[MNR] CSS injection error:', e);
        }
      },
    }),
    monkey({
      entry: entryPoint,
      userscript,
      build: {
        fileName: 'MyNovelReader.user.js',
        autoGrant: false,
      },
    }),
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
    testTimeout: 15_000,
    hookTimeout: 15_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/**/*.d.ts', 'src/ui/components/**', 'src/typings/**'],
      thresholds: {
        lines: 88,
        statements: 87,
        functions: 88,
        branches: 76,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
