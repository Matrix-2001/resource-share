# 仓库指南

不管用户使用什么语言提问，回复都必须使用中文。新增或修改的文档说明、代码注释、错误提示和提交信息也应使用中文。

## 项目结构与模块组织

本项目是一个使用 VitePress 构建的资源共享索引。核心目录如下：

- `docs/`：VitePress 站点内容。
- `docs/.vitepress/config.mts`：站点标题、导航、侧边栏配置。
- `docs/.vitepress/theme/`：主题入口和自定义样式。
- `docs/resources/`：资源内容目录。
- `docs/resources/ebooks/`：电子书资源。
- `docs/resources/torrents/`：P2P 索引资源。
- `docs/resources/games/`：游戏资源。
- `docs/resources/creator-archives/`：创作者内容索引。
- `docs/resources/network-tools/`：网络工具。
- `docs/resources/❤大家想看的东西❤/`：特定内容资源。
- `scripts/generate-resource-indexes.mjs`：扫描资源 Markdown 并生成索引页。
- `tests/`：资源索引生成脚本测试。
- `.github/workflows/deploy.yml`：GitHub Pages 自动构建与发布流程。

每条资源使用一个独立 Markdown 文件维护，例如 `docs/resources/ebooks/z-library.md`。各分类目录下的 `index.md` 和 `docs/resources/index.md` 由生成脚本维护，不要手动长期编辑这些索引页。

不要提交 `node_modules/`、`docs/.vitepress/cache/`、`docs/.vitepress/dist/`、`docs/.vitepress/.temp/`、`.superpowers/` 或 `.worktrees/`。

## 构建、测试与开发命令

常用命令：

- `npm install`：安装依赖。
- `npm run generate`：根据资源文件生成资源总览页和分类索引页。
- `npm test`：运行 Node 测试。
- `npm run docs:dev`：生成索引并启动 VitePress 本地开发服务。
- `npm run docs:build`：生成索引并构建静态站点。
- `npm run docs:preview`：预览已构建站点。

在 Windows PowerShell 中如果 `npm` 被执行策略拦截，可以使用 `npm.cmd`。如果当前会话找不到 Node，可临时补充路径：

```powershell
$env:Path = 'D:\nodejs;' + $env:Path
```

## 资源文件规范

新增资源时，在对应分类目录中新增小写 kebab-case 文件名，例如 `my-resource.md`。

资源文件必须包含 frontmatter：

```md
---
title: 示例资源站
url: https://example.com
category: ebooks
tags: [电子书, 搜索]
status: active
---

这里填写资源说明、适合查找的内容和注意事项。
```

必填字段：

- `title`：资源名称。
- `url`：资源网址。
- `category`：资源分类，只能是 `ebooks`、`torrents`、`games`、`creator-archives`、`network-tools` 或 `❤大家想看的东西❤`。

可选字段：

- `tags`：资源标签。
- `status`：资源状态，支持 `active`、`unknown`、`deprecated`。

资源文件所在目录必须与 `category` 字段一致。新增或修改资源后运行 `npm run generate`，并检查生成的索引页是否合理。

## 编码风格与命名约定

使用项目现有风格：ESM JavaScript、Markdown 文档、VitePress 配置。文件名优先使用小写 kebab-case。

所有面向用户或贡献者的文案使用中文。脚本报错信息也使用中文，便于贡献者根据 CI 输出自行修正投稿。

不要对任务无关文件进行大范围格式化。生成索引页可能因 Windows 换行产生工作区状态变化；如果没有实际内容差异，不要把纯换行变化混入提交。

## 测试指南

资源索引脚本的测试位于 `tests/generate-resource-indexes.test.mjs`。修改 `scripts/generate-resource-indexes.mjs` 时必须运行：

```bash
npm test
```

涉及站点结构、VitePress 配置、资源示例或 GitHub Pages 流程时，还应运行：

```bash
npm run docs:build
```

测试应覆盖正常生成、缺少必填字段、分类不一致、命令行直接运行和 Windows CRLF 换行等关键路径。

## 提交与 Pull Request 规范

提交信息使用简短中文祈使句，例如：

- `添加资源索引生成脚本`
- `配置 GitHub Pages 自动发布`
- `更新仓库协作指南`

提交前检查：

- `git status --short`，确认没有误提交缓存、构建产物或临时目录。
- 相关测试和构建命令已运行。
- 只提交本次任务相关文件。

Pull Request 应包含变更说明、变更原因和测试结果。新增资源的 PR 应说明所属分类、资源用途和是否已运行 `npm run generate`。

## 安全与配置建议

不要提交密钥、账号密码、邀请码、私有下载链接、生成凭据、机器相关路径或本地环境文件。

本站只维护资源网址与说明，不提供账号凭据或受限内容。新增资源说明应保持中立、清晰，避免包含敏感信息。
