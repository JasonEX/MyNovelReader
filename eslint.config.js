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
        $: true,
        _: true,
        CSSFontFaceRule: true,
        CryptoJS: true,
        DOMParser: true,
        Element: true,
        Event: true,
        FileReader: true,
        GM: true,
        GM_addStyle: true,
        GM_config: true,
        GM_deleteValue: true,
        GM_getResourceText: true,
        GM_getResourceURL: true,
        GM_getValue: true,
        GM_info: true,
        GM_listValues: true,
        GM_log: true,
        GM_openInTab: true,
        GM_registerMenuCommand: true,
        GM_setClipboard: true,
        GM_setValue: true,
        GM_xmlhttpRequest: true,
        HTMLElement: true,
        Image: true,
        JQuery: true,
        JQueryStatic: true,
        KeyboardEvent: true,
        MouseEvent: true,
        MutationObserver: true,
        Node: true,
        NodeFilter: true,
        NodeList: true,
        URL: true,
        WheelEvent: true,
        XPathResult: true,
        Zepto: true,
        SpeechSynthesisUtterance: true,
        getSelection: true,
        speechSynthesis: true,
        __dirname: true,
        ah: true,
        alert: true,
        atob: true,
        Blob: true,
        clearInterval: true,
        clearTimeout: true,
        cn2tw: true,
        console: true,
        Config: true,
        dayjs: true,
        document: true,
        exportFunction: true,
        fetch: true,
        getComputedStyle: true,
        g_data: true,
        history: true,
        jQuery: true,
        key: true,
        localStorage: true,
        location: true,
        md5: true,
        navigator: true,
        prompt: true,
        require: true,
        setInterval: true,
        setTimeout: true,
        unsafeWindow: true,
        window: true,
      },
    },
  },
  // TypeScript configuration (non-Vue files)
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.d.ts'],
    plugins: {
      '@typescript-eslint': ts,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...ts.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      // Apply lightweight import ordering to keep diffs clean
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  // Type definitions
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off',
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
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
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
  // Legacy JavaScript rules (kept lenient for existing scripts)
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-redeclare': 'warn',
      'no-prototype-builtins': 'warn',
      'no-case-declarations': 'warn',
      'no-dupe-keys': 'warn',
    },
  },
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js',
      '*.log',
      '.vscode/**',
      '.github/**',
      'src/autoScript/**',
      'src/typings/**',
      'scripts/**', // 暂时忽略用户脚本目录，因为可能有特殊语法
    ],
  },
];
