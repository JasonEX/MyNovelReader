# My Novel Reader

[![User script generation](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml/badge.svg)](https://github.com/JasonEX/MyNovelReader/actions/workflows/build-and-push.yml)

小说阅读脚本，支持自动翻页、自定义样式、语音朗读等功能。

## 安装

### 821938089 上游版本
- [Github][install_github]
- [jsDelivr][install_jsdelivr]

## 开发

### 环境要求
- Node.js >= 18
- npm

### 技术栈
- **构建工具**: Vite 6
- **前端框架**: Vue 3 (Composition API)
- **语言**: JavaScript / TypeScript
- **测试框架**: Vitest
- **代码规范**: ESLint + Prettier

### 常用命令

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化自动构建）
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 项目结构

```
├── src/
│   ├── MyNovelReader/
│   │   ├── app/           # Vue 组件
│   │   ├── rule/          # 站点规则
│   │   ├── utils/         # 工具函数
│   │   ├── cnConv/        # 简繁转换
│   │   └── res/           # 模板和样式
│   └── typings/           # TypeScript 类型定义
├── tests/                 # 单元测试
├── scripts/               # 构建输出
│   └── MyNovelReader.user.js
└── vite.config.js         # Vite 配置
```

### 自定义站点规则

参见 [站点规则说明][siteExample]

## 注意事项

部分站点需要安装 `ignore-x-frame-headers` 扩展绕过 iframe 限制：
- [Chrome][ignore-x-frame-options-chrome]
- [Firefox][ignore-x-frame-options-firefox]

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
