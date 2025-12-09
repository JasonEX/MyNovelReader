# My Novel Reader

[![User script generation](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml/badge.svg)](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml)

现代化的小说阅读 UserScript，支持自动翻页、自定义样式、语音朗读等功能。核心逻辑已使用 TypeScript 重构。

## 安装

### 稳定版（821938089 上游）

- [Github][install_github]
- [jsDelivr][install_jsdelivr]

### 开发版 / 本仓库

- 运行 `npm install && npm run build`，油猴在"从文件安装"中选择 `scripts/MyNovelReader.user.js`。
- 开发调试可执行 `npm run dev` 持续构建，然后在油猴中指向同一文件。

## 开发

### 环境要求

- Node.js >= 18
- npm（建议 9+）

### 技术栈

- **构建工具**: Vite 6
- **前端框架**: Vue 3 (Composition API) + Pinia
- **语言**: TypeScript
- **测试框架**: Vitest (jsdom)
- **代码规范**: ESLint + Prettier + lint-staged（Husky pre-commit）

### 常用命令

```bash
npm install                  # 安装依赖并安装 Husky 钩子
npm run dev                  # 监听文件变化自动构建到 scripts/
npm run build                # 生产构建，生成 scripts/MyNovelReader.user.js
npm test                     # 运行全部单测
npm test -- --coverage       # 生成 coverage 报告（已在 .gitignore）
npm run lint                 # 基础语法检查
npm run lint:strict          # 不允许有 warnings
npm run format               # Prettier 全量格式化
npx vitest run tests/unit/xxx.test.ts  # 运行单个测试
```

### 项目结构

```
├── src/
│   ├── index.ts             # 入口文件
│   ├── bootstrap.ts         # 启动逻辑
│   ├── meta.ts              # UserScript 元数据
│   ├── version.ts           # 版本号
│   ├── core/                # 核心逻辑
│   │   ├── detection/       # 智能内容检测
│   │   │   ├── ContentDetector.ts    # 内容检测器
│   │   │   ├── NavigationDetector.ts # 导航检测
│   │   │   ├── TitleDetector.ts      # 标题检测
│   │   │   └── ConfidenceScorer.ts   # 置信度评分
│   │   ├── parser/          # 内容解析
│   │   ├── converter/       # 繁简转换
│   │   ├── rules/           # 站点规则管理
│   │   └── protection/      # 站点保护
│   ├── ui/                  # UI 组件
│   ├── utils/               # 工具函数
│   └── typings/             # 类型定义
├── tests/unit/              # Vitest 单元测试
├── scripts/                 # 构建输出 MyNovelReader.user.js
└── coverage/                # 覆盖率输出（忽略提交）
```

### 注意事项

- 部分站点需要安装 `ignore-x-frame-headers` 扩展绕过 iframe 限制：
  - [Chrome][ignore-x-frame-options-chrome]
  - [Firefox][ignore-x-frame-options-firefox]
- 新增站点适配或较大改动时，保持 `npm run lint:strict` 与 `npm test` 通过。

## 原作者

- [Github][ywzhaiqi_github]
- [Greasy Fork][ywzhaiqi_greasyfork]

[ywzhaiqi_github]: https://github.com/ywzhaiqi/userscript
[ywzhaiqi_greasyfork]: https://greasyfork.org/users/145-ywzhaiqi
[install_github]: https://github.com/821938089/MyNovelReader/raw/master/scripts/MyNovelReader.user.js
[install_jsdelivr]: https://cdn.jsdelivr.net/gh/821938089/MyNovelReader@master/scripts/MyNovelReader.user.js
[ignore-x-frame-options-chrome]: https://chromewebstore.google.com/detail/ignore-x-frame-headers/ohgdnhkppgeemnmjebhedjneajcedppf
[ignore-x-frame-options-firefox]: https://addons.mozilla.org/firefox/addon/ignore-x-frame-options-header/
