# 资源共享索引设计

## 背景

本项目是一个资源共享索引网站。网站用于展示贡献者整理的资源网址与说明，例如电子书资源、BT 种子资源和游戏资源。资源内容由贡献者通过 Pull Request 提交，站点自动构建并发布到 GitHub Pages。

当前任务只实现网站框架、资源组织方式、示例内容、投稿说明和自动发布流程；真实资源内容后续由维护者和贡献者补充。

## 目标

- 使用 VitePress 创建文档目录型资源网站。
- 每条资源使用一个独立 Markdown 文件维护，降低多人协作冲突。
- 构建时自动生成资源总览页和分类索引页，避免手动维护目录。
- 提供清晰的投稿说明，方便贡献者按模板提交 PR。
- 使用 GitHub Actions 自动构建并发布到 GitHub Pages。

## 非目标

- 不实现登录、后台管理、在线投稿表单或数据库。
- 不收录真实资源内容，只提供示例资源和占位结构。
- 不实现复杂搜索、评分、评论或资源可用性自动检测。

## 技术方案

项目采用 VitePress 作为静态站点框架。源码主要放在 `docs/` 目录，构建脚本放在 `scripts/` 目录，GitHub Actions 工作流放在 `.github/workflows/`。

资源文件按分类存放。每个资源 Markdown 文件包含 frontmatter 和正文说明。构建前运行 `scripts/generate-resource-indexes.mjs`，扫描资源文件，读取 frontmatter，生成资源总览页和各分类索引页。随后执行 VitePress 构建并部署到 GitHub Pages。

## 目录结构

```text
docs/
  .vitepress/
    config.mts
    theme/
      custom.css
  index.md
  resources/
    index.md
    ebooks/
      index.md
      example.md
    torrents/
      index.md
      example.md
    games/
      index.md
      example.md
  contribute.md
scripts/
  generate-resource-indexes.mjs
.github/
  workflows/
    deploy.yml
package.json
.gitignore
```

其中 `docs/resources/index.md` 和各分类下的 `index.md` 由生成脚本维护。资源详情文件由贡献者提交和维护。

## 资源分类

初始内置三个分类：

- `ebooks`：电子书资源。
- `torrents`：BT 种子资源。
- `games`：游戏资源。

后续新增分类时，需要在 VitePress 导航、侧边栏、生成脚本分类配置和投稿说明中同步补充。

## 资源文件格式

每条资源一个 Markdown 文件，文件名使用小写 kebab-case，例如 `example-site.md`。

```md
---
title: 示例资源站
url: https://example.com
category: ebooks
tags: [电子书, 搜索]
status: active
---

这里填写网站说明、适合查找的资源类型、使用注意事项等。
```

必填字段：

- `title`：资源名称。
- `url`：资源网址。
- `category`：资源分类，必须是 `ebooks`、`torrents` 或 `games` 之一。

可选字段：

- `tags`：资源标签，用于在索引页辅助识别。
- `status`：资源状态，初始支持 `active`、`unknown`、`deprecated`。

## 页面结构

首页 `docs/index.md` 展示网站用途、三个资源分类入口和投稿入口。

资源总览页 `docs/resources/index.md` 自动列出所有分类，并展示每个分类下的资源数量和资源链接。

分类索引页例如 `docs/resources/ebooks/index.md` 自动列出该分类下的全部资源，包括资源名称、网址、标签、状态和简短说明入口。

资源详情页由每条资源 Markdown 文件提供，正文用于写更完整的说明。

投稿说明页 `docs/contribute.md` 说明如何复制示例文件、新增资源、填写字段、提交 Pull Request，以及提交前检查事项。

## 自动索引生成

生成脚本 `scripts/generate-resource-indexes.mjs` 负责：

- 扫描 `docs/resources/ebooks/`、`docs/resources/torrents/` 和 `docs/resources/games/` 下的资源详情文件。
- 跳过各目录下的 `index.md`。
- 解析 frontmatter。
- 校验必填字段是否完整。
- 校验 `category` 是否与所在目录一致。
- 生成 `docs/resources/index.md`。
- 生成各分类目录下的 `index.md`。

如果资源文件缺少必填字段或分类不匹配，脚本应输出中文错误信息并以非零状态退出，使本地构建和 GitHub Actions 构建失败。

## GitHub Pages 发布

GitHub Actions 工作流 `deploy.yml` 在主分支推送时运行：

1. 检出仓库。
2. 安装 Node 依赖。
3. 执行资源索引生成脚本。
4. 执行 VitePress 构建。
5. 上传 Pages artifact。
6. 部署到 GitHub Pages。

PR 可以运行构建校验，但不执行部署。

## 本地开发命令

计划提供以下命令：

```bash
npm install
npm run generate
npm run docs:dev
npm run docs:build
```

`npm run docs:build` 应先生成索引，再构建站点，确保本地和 CI 行为一致。

## 风格与文案

站点使用克制、清晰的文档站风格，不做营销型首页。页面文案使用中文。资源说明、代码注释、贡献说明和校验错误信息也使用中文。

## 验收标准

- 本地可以启动 VitePress 开发服务器。
- 示例资源可通过首页、资源总览页和分类索引页访问。
- 新增一个资源 Markdown 文件后，运行生成命令会更新对应索引页。
- 缺少必填字段或分类不匹配时，生成脚本会失败并输出中文错误。
- GitHub Actions 配置可构建并部署到 GitHub Pages。
