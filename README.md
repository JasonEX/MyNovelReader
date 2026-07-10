# My Novel Reader

[![User script generation](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml/badge.svg)](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml)

现代化的小说阅读 UserScript，支持智能正文识别、连续阅读、阅读位置恢复、简繁转换和克制的排版定制。核心逻辑使用 TypeScript 实现。

## 安装

### 稳定版（821938089 上游）

- [Github][install_github]
- [jsDelivr][install_jsdelivr]

### 开发版 / 本仓库

- 运行 `npm install && npm run build`，油猴在"从文件安装"中选择 `scripts/MyNovelReader.user.js`。
- 开发调试可执行 `npm run dev` 持续构建，然后在油猴中指向同一文件。

## 开发

### 环境要求

- Node.js >= 20.19
- npm（建议 10+）

### 技术栈

- **构建工具**: Vite 8 + vite-plugin-monkey
- **前端框架**: Vue 3 (Composition API) + Pinia
- **语言**: TypeScript
- **测试框架**: Vitest (jsdom)
- **代码规范**: ESLint + Prettier + lint-staged（Husky pre-commit）

### 常用命令

```bash
npm install                  # 安装依赖并安装 Husky 钩子
npm run dev                  # 监听文件变化自动构建到 scripts/
npm run build                # 生产构建，生成 scripts/MyNovelReader.user.js
npm run check:size           # 检查用户脚本原始与 gzip 体积预算
npm run profile:performance  # 生成本地压力场景 Chrome CPU Profile
npm run profile:performance:real # 额外生成真实站点启动 Profile
npm test                     # 运行全部单测（watch）
npm run test:run             # 单次运行全部单测
npm run test:coverage        # 生成 coverage 报告（已在 .gitignore）
npm run e2e:warmup           # 打开持久化浏览器 profile，手动通过 Cloudflare 后自动保存会话
npm run e2e:smoke            # 构建并在真实章节页注入脚本，验证阅读器实际渲染
npm run e2e:smoke:headed     # 有些站点不信任 headless 时，用有界面浏览器跑同一套 smoke
npm run e2e:smoke:cdp        # 连接已开启远程调试端口的真实 Chrome 会话做 smoke
npm run e2e:local             # 构建并运行本地固定页面 smoke
npm run lint                 # 基础语法检查
npm run lint:strict          # 不允许有 warnings
npm run lint:fix             # 自动修复可修复的 lint 问题
npm run typecheck            # TypeScript 类型检查（noEmit）
npm run typecheck:tests      # 测试代码 TypeScript 类型检查
npm run validate             # 完整本地验证
npm run format               # Prettier 全量格式化
npx vitest run tests/unit/xxx.test.ts  # 运行单个测试
```

### 真实站点 E2E 测试

默认目标是一个可公开访问的章节页。切换目标站点时设置 `MNR_E2E_URL`：

```bash
MNR_E2E_URL="https://example.com/book/1/2.html" npm run e2e:warmup
MNR_E2E_URL="https://example.com/book/1/2.html" npm run e2e:smoke
```

`e2e:warmup` 会打开 Playwright 的持久化 Chromium profile。如果页面出现 Cloudflare
或站点验证，人工在弹出的浏览器里完成一次即可；脚本检测到目标页可读后会自动关闭浏览器并保留
cookie/profile。之后 `e2e:smoke` 会复用同一个 profile，自动构建、注入
`scripts/MyNovelReader.user.js`、断言阅读器 Shadow DOM 已挂载、正文长度达标、原页面已隐藏、
样式已注入，并保存截图到 `.test/mnr-e2e/`。

如果站点明显识别 Playwright 默认浏览器，可以改用真实 Chrome 的 CDP 会话。先在
Windows 启动一个独立 profile 的 Chrome：

```bash
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --remote-debugging-port=9222 \
  --user-data-dir="C:\\temp\\mnr-cdp-profile"
```

在打开的 Chrome 里人工通过站点验证后，再从 WSL 运行：

```bash
MNR_E2E_CDP_ENDPOINT="http://127.0.0.1:9222" \
MNR_E2E_URL="https://example.com/book/1/2.html" \
npm run e2e:smoke:cdp
```

常用环境变量：

- `MNR_E2E_URL`：目标章节页，默认 `https://www.ciweimao.com/chapter/102930784`
- `MNR_E2E_PROXY`：显式代理；未设置时会读取 `HTTPS_PROXY` / `HTTP_PROXY`
- `MNR_E2E_PROFILE_DIR`：持久化浏览器 profile，默认 `.test/mnr-e2e-profile`
- `MNR_E2E_CDP_ENDPOINT`：真实 Chrome 的 CDP 地址，例如 `http://127.0.0.1:9222`
- `MNR_E2E_HEADLESS=false`：用有界面浏览器跑 smoke；等价于常用场景下的 `npm run e2e:smoke:headed`
- `MNR_E2E_MIN_CONTENT_CHARS`：阅读器正文最少字符数断言，默认 `1000`

### 项目结构

```
├── src/
│   ├── index.ts             # 入口文件
│   ├── bootstrap.ts         # 启动逻辑
│   ├── meta.ts              # UserScript 元数据
│   ├── version.ts           # 版本号
│   ├── env.d.ts             # Vite/TS 全局类型
│   ├── core/                # 核心逻辑
│   │   ├── auto-enable/     # 自动启用相关
│   │   ├── constants/       # 常量
│   │   ├── detection/       # 智能内容检测
│   │   │   ├── ContentDetector.ts    # 内容检测器
│   │   │   ├── NavigationDetector.ts # 导航检测
│   │   │   ├── TitleDetector.ts      # 标题检测
│   │   │   └── ConfidenceScorer.ts   # 置信度评分
│   │   ├── parser/          # 内容解析
│   │   ├── converter/       # 繁简转换
│   │   ├── rules/           # 内置站点规则管理
│   │   ├── protection/      # 站点保护
│   │   └── utils/           # 工具函数
│   ├── ui/                  # UI
│   │   ├── components/      # 组件
│   │   ├── composables/     # 组合式逻辑
│   │   └── stores/          # Pinia stores
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

## 许可证

本项目以 [GPL-3.0-only](LICENSE) 发布。

[ywzhaiqi_github]: https://github.com/ywzhaiqi/userscript
[ywzhaiqi_greasyfork]: https://greasyfork.org/users/145-ywzhaiqi
[install_github]: https://github.com/821938089/MyNovelReader/raw/master/scripts/MyNovelReader.user.js
[install_jsdelivr]: https://cdn.jsdelivr.net/gh/821938089/MyNovelReader@master/scripts/MyNovelReader.user.js
[ignore-x-frame-options-chrome]: https://chromewebstore.google.com/detail/ignore-x-frame-headers/ohgdnhkppgeemnmjebhedjneajcedppf
[ignore-x-frame-options-firefox]: https://addons.mozilla.org/firefox/addon/ignore-x-frame-options-header/
