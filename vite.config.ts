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
const buildDate = new Date().toISOString().split('T')[0];
const meta = createMeta({ version, buildDate });
const userscript = toUserscriptConfig(meta);

export default defineConfig({
  define: {
    __MNR_VERSION__: JSON.stringify(version),
    __MNR_BUILD_DATE__: JSON.stringify(buildDate),
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({ NODE_ENV: 'production' }),
    process: JSON.stringify({ env: { NODE_ENV: 'production' } }),
  },
  build: {
    outDir: 'scripts',
    emptyOutDir: false,
    sourcemap: false,
    minify: false,
    cssMinify: true,
    rollupOptions: {
      output: {
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
            type MnrGlobalState = {
              styles?: string;
              shadowRoot?: ShadowRoot;
            };
            type MnrWindow = Window & { __MY_NOVEL_READER__?: MnrGlobalState };

            const w = window as MnrWindow;
            const globalState = w.__MY_NOVEL_READER__ || (w.__MY_NOVEL_READER__ = {});

            // Store CSS for Shadow DOM injection
            globalState.styles = (globalState.styles || '') + cssCode;

            // Also inject to document.head for light DOM components (ElementPicker, etc.)
            // Use a unique ID to prevent duplicate injection
            var styleId = 'mnr-global-styles';
            var existingStyle = document.getElementById(styleId);
            if (!existingStyle) {
              existingStyle = document.createElement('style');
              existingStyle.id = styleId;
              document.head.appendChild(existingStyle);
            }
            existingStyle.textContent = globalState.styles;

            // If Shadow DOM already exists, also inject there
            if (globalState.shadowRoot) {
              var shadowStyle = globalState.shadowRoot.querySelector('#mnr-app-styles');
              if (!shadowStyle) {
                shadowStyle = document.createElement('style');
                shadowStyle.id = 'mnr-app-styles';
                globalState.shadowRoot.appendChild(shadowStyle);
              }
              shadowStyle.textContent = globalState.styles;
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
        statements: 88,
        functions: 88,
        branches: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
