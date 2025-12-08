# My Novel Reader

[![User script generation](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml/badge.svg)](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml)

现代化的小说阅读 UserScript，支持自动翻页、自定义样式、语音朗读等功能。当前正逐步用
TypeScript 重构核心逻辑与站点适配。

## 安装

### 稳定版（821938089 上游）

- [Github][install_github]
- [jsDelivr][install_jsdelivr]

### 开发版 / 本仓库

- 运行 `npm install && npm run build`，油猴在“从文件安装”中选择 `scripts/MyNovelReader.user.js`。
- 开发调试可执行 `npm run dev` 持续构建，然后在油猴中指向同一文件。

## 开发

### 环境要求

- Node.js >= 18
- npm（建议 9+）

### 技术栈

- **构建工具**: Vite 6
- **前端框架**: Vue 3 (Composition API) + Pinia
- **语言**: JavaScript / TypeScript（逐步迁移）
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
npx vitest run tests/unit/string-utils.test.ts  # 运行单个测试
```

### 项目结构

```
├── src/
│   ├── MyNovelReader/
│   │   ├── app/             # Vue UI 与阅读器核心，按域拆分
│   │   │   ├── core/        # 协调器、主流程
│   │   │   ├── document/    # DOM 解析与阅读页抽取
│   │   │   ├── page/        # 页面切换、分页
│   │   │   ├── scroll/      # 滚动/自动翻页
│   │   │   ├── site/        # 站点适配层
│   │   │   ├── ui/          # UI 行为、组件适配
│   │   │   └── components/  # Vue 组件（如语音、Loading）
│   │   ├── rule/            # 站点规则（仍包含 legacy JS）
│   │   ├── services/        # 请求、存储、语音等服务
│   │   ├── stores/          # Pinia 状态
│   │   ├── utils/           # TS 工具方法与 jQuery 扩展
│   │   ├── types/           # 类型定义
│   │   └── meta.js          # UserScript 元数据头
│   └── common/utils/        # 跨脚本共享工具
├── tests/unit/              # Vitest 单元测试
├── scripts/                 # 构建输出 MyNovelReader.user.js
└── coverage/                # 覆盖率输出（忽略提交）
```

### 自定义站点规则

参见 [站点规则说明][siteExample]，可按需新增到 `src/MyNovelReader/rule/`。

### 注意事项

- 部分站点需要安装 `ignore-x-frame-headers` 扩展绕过 iframe 限制：
  - [Chrome][ignore-x-frame-options-chrome]
  - [Firefox][ignore-x-frame-options-firefox]
- 新增站点适配或较大改动时，优先使用 TypeScript/Pinia，并保持 `npm run lint:strict` 与
  `npm test` 通过。

## 原作者

- [Github][ywzhaiqi_github]
- [Greasy Fork][ywzhaiqi_greasyfork]

[ywzhaiqi_github]: https://github.com/ywzhaiqi/userscript
[ywzhaiqi_greasyfork]: https://greasyfork.org/users/145-ywzhaiqi
[install_github]: https://github.com/821938089/MyNovelReader/raw/master/scripts/MyNovelReader.user.js
[install_jsdelivr]: https://cdn.jsdelivr.net/gh/821938089/MyNovelReader@master/scripts/MyNovelReader.user.js
[siteExample]: /src/MyNovelReader/rule/siteExample.js
[ignore-x-frame-options-chrome]: https://chromewebstore.google.com/detail/ignore-x-frame-headers/ohgdnhkppgeemnmjebhedjneajcedppf
[ignore-x-frame-options-firefox]: https://addons.mozilla.org/firefox/addon/ignore-x-frame-options-header/
