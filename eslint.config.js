import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser';

export default [
  // Base JavaScript configuration
  js.configs.recommended,
  // Global globals
  {
    languageOptions: {
      globals: {
        window: true,
        document: true,
        console: true,
        GM: true,
        GM_addStyle: true,
        GM_getValue: true,
        GM_setValue: true,
        GM_deleteValue: true,
        GM_listValues: true,
        GM_xmlhttpRequest: true,
        unsafeWindow: true,
      },
    },
  },
  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    plugins: {
      '@typescript-eslint': ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      ...ts.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Vue configuration
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
      },
    },
    rules: {
      ...vuePlugin.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },
  // Prettier integration
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.vue'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
    },
  },
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js',
      '*.d.ts',
      '*.log',
      '.vscode/**',
      '.github/**',
      'scripts/**', // 暂时忽略用户脚本目录，因为可能有特殊语法
    ],
  },
];