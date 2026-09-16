## 特点

- 提供 **Vue、React 示例**，使用 monorepo 的架构风格
- 完善的 WebView 与 Extension **通讯方案**，基于 JSON-RPC 2.0
- WebView 开发支持支持**热更新**
- React Webview 已二次开发为 **Port 管理页面**，集成 Arco Design、VTable 与可拖拽分栏

## 使用

1. 初始化

   ```
   git clone git@github.com:liutaigang/vscode-webview-extension-example.git
   cd vscode-webview-extension-example
   pnpm i
   ```

2. 在根目录运行 `pnpm run dev`。该命令已经同时启动 Extension 和 React Webview，
   不需要再次单独运行 `dev:extension` 或 `dev:view-react`。
3. 按 F5 启动调试模式。
4. 在新打开的 Extension Development Host 中点击 Activity Bar 的 Port 图标，在侧边栏的
   “功能导航”中选择 `Port`，即可在 Editor 区域打开页面；也可以执行命令
   `Port Management: 打开 Port 管理`。

Port 页面位于 `packages/view-react/src/pages/Port`，基础表格和分栏组件位于
`packages/view-react/src/components`。

## 打包

在 root 目录下：

```bash
pnpm build      # 构建所有项目
pnpm package    # 打包插件
```

打包结果：packages/extension/extension-1.0.1.vsix

## 模块简介

- [extension 模块](./packages/extension/README.md)
- [view-react 模块](./packages/view-react/README.md)
- [view-vue 模块](./packages/view-vue/README.md)
