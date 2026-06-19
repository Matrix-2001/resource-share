# Resource Share VitePress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向贡献者 PR 投稿的 VitePress 资源共享索引框架，并自动发布到 GitHub Pages。

**Architecture:** 站点源码放在 `docs/`，资源详情以独立 Markdown 文件存放在分类目录中。构建前由 `scripts/generate-resource-indexes.mjs` 扫描资源 frontmatter，校验字段并生成总览页和分类索引页，然后 VitePress 构建静态站点。

**Tech Stack:** VitePress、Node.js ESM、`node:test`、GitHub Actions、GitHub Pages。

---

## 文件结构

- Create: `package.json`，定义开发、生成、构建、测试命令。
- Create: `.gitignore`，忽略依赖、构建产物、临时视觉伴随目录。
- Create: `docs/.vitepress/config.mts`，配置 VitePress 标题、导航、侧边栏和构建输出。
- Create: `docs/.vitepress/theme/custom.css`，提供克制的文档站样式。
- Create: `scripts/generate-resource-indexes.mjs`，扫描资源文件、校验 frontmatter、生成索引。
- Create: `tests/generate-resource-indexes.test.mjs`，用临时目录验证生成脚本。
- Create: `docs/index.md`，网站首页。
- Create: `docs/contribute.md`，贡献者投稿说明。
- Create: `docs/resources/ebooks/example.md`，电子书示例资源。
- Create: `docs/resources/torrents/example.md`，BT 种子示例资源。
- Create: `docs/resources/games/example.md`，游戏示例资源。
- Generated: `docs/resources/index.md`，资源总览页。
- Generated: `docs/resources/ebooks/index.md`，电子书分类索引。
- Generated: `docs/resources/torrents/index.md`，BT 种子分类索引。
- Generated: `docs/resources/games/index.md`，游戏分类索引。
- Create: `.github/workflows/deploy.yml`，GitHub Pages 构建与部署。
- Modify: `README.md`，说明项目用途和常用命令。

## Task 1: 基础项目骨架

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `docs/.vitepress/config.mts`
- Create: `docs/.vitepress/theme/custom.css`
- Create: `docs/index.md`

- [ ] **Step 1: 创建 `package.json`**

写入：

```json
{
  "name": "resource-share",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "generate": "node scripts/generate-resource-indexes.mjs",
    "test": "node --test tests/*.test.mjs",
    "docs:dev": "npm run generate && vitepress dev docs",
    "docs:build": "npm run generate && vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.6.3"
  }
}
```

- [ ] **Step 2: 创建 `.gitignore`**

写入：

```gitignore
node_modules/
docs/.vitepress/cache/
docs/.vitepress/dist/
.superpowers/
```

- [ ] **Step 3: 创建 VitePress 配置**

在 `docs/.vitepress/config.mts` 写入：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '资源共享站',
  description: '资源共享索引',
  lang: 'zh-CN',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '资源总览', link: '/resources/' },
      { text: '投稿说明', link: '/contribute' }
    ],
    sidebar: [
      {
        text: '资源共享站',
        items: [
          { text: '首页', link: '/' },
          { text: '资源总览', link: '/resources/' },
          { text: '投稿说明', link: '/contribute' }
        ]
      },
      {
        text: '资源分类',
        items: [
          { text: '电子书资源', link: '/resources/ebooks/' },
          { text: 'BT 种子资源', link: '/resources/torrents/' },
          { text: '游戏资源', link: '/resources/games/' }
        ]
      }
    ],
    socialLinks: []
  }
})
```

- [ ] **Step 4: 创建自定义样式**

在 `docs/.vitepress/theme/custom.css` 写入：

```css
:root {
  --vp-c-brand-1: #2f6f56;
  --vp-c-brand-2: #3d8167;
  --vp-c-brand-3: #5a9a7d;
  --vp-c-bg-soft: #f5f7f3;
}

.vp-doc table {
  display: table;
  width: 100%;
}

.vp-doc th,
.vp-doc td {
  vertical-align: top;
}

.resource-meta {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.resource-tag {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  padding: 2px 8px;
}
```

- [ ] **Step 5: 创建首页**

在 `docs/index.md` 写入：

```md
# 资源共享站

这是一个用于整理电子书资源、BT 种子资源和游戏资源的共享索引。

本站只提供资源网站的网址和说明，真实内容由贡献者通过 Pull Request 补充和维护。

## 资源分类

- [电子书资源](./resources/ebooks/)：电子书搜索、下载和阅读相关网站。
- [BT 种子资源](./resources/torrents/)：BT 种子搜索、索引和相关资源站。
- [游戏资源](./resources/games/)：游戏信息、下载和相关工具资源。

## 参与维护

如果你想补充资源，请阅读 [投稿说明](./contribute.md)，按模板新增资源文件并提交 Pull Request。
```

- [ ] **Step 6: 本地提交基础骨架**

运行：

```bash
git add package.json .gitignore docs/.vitepress/config.mts docs/.vitepress/theme/custom.css docs/index.md
git commit -m "搭建 VitePress 基础骨架"
```

预期：生成一个中文提交，且不包含 `.superpowers/`。

## Task 2: 资源索引生成脚本与测试

**Files:**
- Create: `scripts/generate-resource-indexes.mjs`
- Create: `tests/generate-resource-indexes.test.mjs`

- [ ] **Step 1: 创建失败测试**

在 `tests/generate-resource-indexes.test.mjs` 写入：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateResourceIndexes } from '../scripts/generate-resource-indexes.mjs'

async function createProject() {
  const root = await mkdtemp(join(tmpdir(), 'resource-share-test-'))
  for (const category of ['ebooks', 'torrents', 'games']) {
    await mkdir(join(root, 'docs', 'resources', category), { recursive: true })
  }
  return root
}

test('根据资源文件生成总览页和分类索引页', async () => {
  const root = await createProject()
  try {
    await writeFile(join(root, 'docs', 'resources', 'ebooks', 'example.md'), `---
title: 示例电子书站
url: https://example.com
category: ebooks
tags: [电子书, 搜索]
status: active
---

这里是电子书资源站说明。
`)

    await generateResourceIndexes({ rootDir: root })

    const overview = await readFile(join(root, 'docs', 'resources', 'index.md'), 'utf8')
    const ebooks = await readFile(join(root, 'docs', 'resources', 'ebooks', 'index.md'), 'utf8')

    assert.match(overview, /# 资源总览/)
    assert.match(overview, /电子书资源/)
    assert.match(ebooks, /# 电子书资源/)
    assert.match(ebooks, /示例电子书站/)
    assert.match(ebooks, /https:\/\/example.com/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('资源缺少必填字段时抛出中文错误', async () => {
  const root = await createProject()
  try {
    await writeFile(join(root, 'docs', 'resources', 'games', 'bad.md'), `---
title: 缺少网址的游戏站
category: games
---

说明。
`)

    await assert.rejects(
      () => generateResourceIndexes({ rootDir: root }),
      /缺少必填字段 url/
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('资源分类与所在目录不一致时抛出中文错误', async () => {
  const root = await createProject()
  try {
    await writeFile(join(root, 'docs', 'resources', 'torrents', 'bad.md'), `---
title: 分类错误
url: https://example.com
category: games
---

说明。
`)

    await assert.rejects(
      () => generateResourceIndexes({ rootDir: root }),
      /分类必须与所在目录一致/
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
```

- [ ] **Step 2: 运行测试确认失败**

运行：

```bash
npm test
```

预期：失败，提示找不到 `scripts/generate-resource-indexes.mjs` 或 `generateResourceIndexes`。

- [ ] **Step 3: 实现生成脚本**

在 `scripts/generate-resource-indexes.mjs` 写入：

```js
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CATEGORIES = [
  { key: 'ebooks', title: '电子书资源', description: '电子书搜索、下载和阅读相关网站。' },
  { key: 'torrents', title: 'BT 种子资源', description: 'BT 种子搜索、索引和相关资源站。' },
  { key: 'games', title: '游戏资源', description: '游戏信息、下载和相关工具资源。' }
]

const REQUIRED_FIELDS = ['title', 'url', 'category']
const STATUS_LABELS = {
  active: '可用',
  unknown: '未知',
  deprecated: '已废弃'
}

function parseFrontmatter(content, filePath) {
  if (!content.startsWith('---\n')) {
    throw new Error(`${filePath} 缺少 frontmatter`)
  }

  const end = content.indexOf('\n---', 4)
  if (end === -1) {
    throw new Error(`${filePath} frontmatter 未正确结束`)
  }

  const raw = content.slice(4, end).trim()
  const data = {}

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const separator = trimmed.indexOf(':')
    if (separator === -1) {
      throw new Error(`${filePath} frontmatter 行格式错误：${trimmed}`)
    }

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim()
    data[key] = parseValue(value)
  }

  return data
}

function parseValue(value) {
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((item) => item.trim()).filter(Boolean)
  }

  return value.replace(/^['"]|['"]$/g, '')
}

function validateResource(resource) {
  for (const field of REQUIRED_FIELDS) {
    if (!resource[field]) {
      throw new Error(`${resource.filePath} 缺少必填字段 ${field}`)
    }
  }

  if (resource.category !== resource.directoryCategory) {
    throw new Error(`${resource.filePath} 分类必须与所在目录一致：当前目录是 ${resource.directoryCategory}，字段是 ${resource.category}`)
  }

  if (!CATEGORIES.some((category) => category.key === resource.category)) {
    throw new Error(`${resource.filePath} 使用了不支持的分类 ${resource.category}`)
  }
}

function firstParagraph(content) {
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
  const paragraph = body.split(/\n\s*\n/).find((item) => item.trim())
  return paragraph ? paragraph.replace(/\n/g, ' ').trim() : '暂无说明。'
}

async function readCategoryResources(rootDir, category) {
  const categoryDir = join(rootDir, 'docs', 'resources', category.key)
  const entries = await readdir(categoryDir, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))

  const resources = []
  for (const fileName of files) {
    const filePath = join(categoryDir, fileName)
    const content = await readFile(filePath, 'utf8')
    const data = parseFrontmatter(content, relative(rootDir, filePath).replaceAll('\\', '/'))
    const resource = {
      ...data,
      status: data.status || 'unknown',
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: firstParagraph(content),
      fileName,
      directoryCategory: category.key,
      filePath: relative(rootDir, filePath).replaceAll('\\', '/')
    }
    validateResource(resource)
    resources.push(resource)
  }

  return resources
}

function renderTags(tags) {
  return tags.length > 0 ? tags.join('、') : '无'
}

function renderResourceList(resources, currentCategory) {
  if (resources.length === 0) {
    return '当前分类还没有资源，欢迎提交 Pull Request 补充。\n'
  }

  return resources.map((resource) => {
    const relativeLink = currentCategory ? `./${resource.fileName}` : `./${resource.category}/${resource.fileName}`
    const status = STATUS_LABELS[resource.status] || resource.status
    return [
      `## [${resource.title}](${relativeLink})`,
      '',
      `- 地址：${resource.url}`,
      `- 状态：${status}`,
      `- 标签：${renderTags(resource.tags)}`,
      '',
      resource.summary,
      ''
    ].join('\n')
  }).join('\n')
}

function renderOverview(groupedResources) {
  const sections = CATEGORIES.map((category) => {
    const resources = groupedResources.get(category.key) || []
    return [
      `## ${category.title}`,
      '',
      category.description,
      '',
      `资源数量：${resources.length}`,
      '',
      renderResourceList(resources, false)
    ].join('\n')
  })

  return [
    '# 资源总览',
    '',
    '这里自动汇总贡献者提交的资源。请不要手动编辑本页，运行 `npm run generate` 会重新生成内容。',
    '',
    ...sections
  ].join('\n')
}

function renderCategoryIndex(category, resources) {
  return [
    `# ${category.title}`,
    '',
    category.description,
    '',
    '本页由资源 Markdown 文件自动生成。新增资源时，请在当前目录新增独立资源文件。',
    '',
    `资源数量：${resources.length}`,
    '',
    renderResourceList(resources, true)
  ].join('\n')
}

export async function generateResourceIndexes({ rootDir = join(__dirname, '..') } = {}) {
  const groupedResources = new Map()

  for (const category of CATEGORIES) {
    const resources = await readCategoryResources(rootDir, category)
    groupedResources.set(category.key, resources)
    await writeFile(
      join(rootDir, 'docs', 'resources', category.key, 'index.md'),
      renderCategoryIndex(category, resources),
      'utf8'
    )
  }

  await writeFile(
    join(rootDir, 'docs', 'resources', 'index.md'),
    renderOverview(groupedResources),
    'utf8'
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateResourceIndexes().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
```

- [ ] **Step 4: 运行测试确认通过**

运行：

```bash
npm test
```

预期：所有 `node:test` 测试通过。

- [ ] **Step 5: 提交生成脚本和测试**

运行：

```bash
git add scripts/generate-resource-indexes.mjs tests/generate-resource-indexes.test.mjs
git commit -m "添加资源索引生成脚本"
```

预期：生成一个中文提交。

## Task 3: 示例资源与投稿说明

**Files:**
- Create: `docs/contribute.md`
- Create: `docs/resources/ebooks/example.md`
- Create: `docs/resources/torrents/example.md`
- Create: `docs/resources/games/example.md`
- Generated: `docs/resources/index.md`
- Generated: `docs/resources/ebooks/index.md`
- Generated: `docs/resources/torrents/index.md`
- Generated: `docs/resources/games/index.md`

- [ ] **Step 1: 创建投稿说明**

在 `docs/contribute.md` 写入：

```md
# 投稿说明

欢迎通过 Pull Request 补充资源。

## 新增资源步骤

1. 选择资源分类目录：
   - `docs/resources/ebooks/`：电子书资源。
   - `docs/resources/torrents/`：BT 种子资源。
   - `docs/resources/games/`：游戏资源。
2. 复制同目录下的 `example.md`，改成小写 kebab-case 文件名，例如 `my-resource.md`。
3. 修改 frontmatter 中的 `title`、`url`、`category`、`tags` 和 `status`。
4. 在正文中填写资源说明、适合查找的内容和注意事项。
5. 运行 `npm run generate` 和 `npm run docs:build` 检查是否能正常构建。
6. 提交 Pull Request。

## 字段说明

```md
---
title: 示例资源站
url: https://example.com
category: ebooks
tags: [电子书, 搜索]
status: active
---
```

- `title`：资源名称，必填。
- `url`：资源网址，必填。
- `category`：资源分类，必填，只能是 `ebooks`、`torrents` 或 `games`。
- `tags`：资源标签，可选。
- `status`：资源状态，可选，支持 `active`、`unknown`、`deprecated`。

## 提交前检查

- 文件名使用小写 kebab-case。
- 资源分类和所在目录一致。
- 网址可以打开。
- 正文说明使用中文，写清楚资源用途。
- 不提交账号、密码、邀请码、密钥或本地路径。
```

- [ ] **Step 2: 创建电子书示例资源**

在 `docs/resources/ebooks/example.md` 写入：

```md
---
title: 示例电子书资源站
url: https://example.com/ebooks
category: ebooks
tags: [电子书, 搜索]
status: unknown
---

这是一个电子书资源示例条目。贡献者可以复制本文件，修改网址、标签和说明后提交 Pull Request。
```

- [ ] **Step 3: 创建 BT 种子示例资源**

在 `docs/resources/torrents/example.md` 写入：

```md
---
title: 示例 BT 种子资源站
url: https://example.com/torrents
category: torrents
tags: [BT, 种子]
status: unknown
---

这是一个 BT 种子资源示例条目。请在真实投稿中说明网站适合查找的资源类型和使用注意事项。
```

- [ ] **Step 4: 创建游戏示例资源**

在 `docs/resources/games/example.md` 写入：

```md
---
title: 示例游戏资源站
url: https://example.com/games
category: games
tags: [游戏, 工具]
status: unknown
---

这是一个游戏资源示例条目。请在真实投稿中说明资源类型、平台范围和注意事项。
```

- [ ] **Step 5: 生成索引页**

运行：

```bash
npm run generate
```

预期：生成 `docs/resources/index.md` 和三个分类 `index.md`，命令成功退出。

- [ ] **Step 6: 检查生成内容**

运行：

```bash
Select-String -Path docs/resources/index.md -Pattern '电子书资源|BT 种子资源|游戏资源'
Select-String -Path docs/resources/games/index.md -Pattern '示例游戏资源站'
```

预期：能匹配到三个分类名和游戏示例资源。

- [ ] **Step 7: 提交内容页和生成索引**

运行：

```bash
git add docs/contribute.md docs/resources
git commit -m "添加资源示例和投稿说明"
```

预期：生成一个中文提交。

## Task 4: GitHub Pages 工作流与 README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] **Step 1: 创建 GitHub Actions 工作流**

在 `.github/workflows/deploy.yml` 写入：

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build site
        run: npm run docs:build

      - name: Setup Pages
        if: github.event_name != 'pull_request'
        uses: actions/configure-pages@v5

      - name: Upload artifact
        if: github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    if: github.event_name != 'pull_request'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 更新 README**

用以下内容替换 `README.md`：

````md
# resource-share

资源共享索引，使用 VitePress 构建，用于展示电子书资源、BT 种子资源和游戏资源的网址与说明。

## 本地开发

```bash
npm install
npm run docs:dev
```

## 常用命令

```bash
npm run generate
npm test
npm run docs:build
```

- `npm run generate`：根据资源 Markdown 文件生成资源总览和分类索引。
- `npm test`：运行资源索引生成脚本测试。
- `npm run docs:build`：生成索引并构建 VitePress 网站。

## 投稿

贡献者可以阅读 `docs/contribute.md`，新增资源 Markdown 文件后提交 Pull Request。
````

- [ ] **Step 3: 验证 YAML 和 README 已存在**

运行：

```bash
Test-Path .github/workflows/deploy.yml
Test-Path README.md
```

预期：两行输出均为 `True`。

- [ ] **Step 4: 提交发布工作流和 README**

运行：

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "配置 GitHub Pages 自动发布"
```

预期：生成一个中文提交。

## Task 5: 端到端验证

**Files:**
- No new files.
- Verify: all created project files.

- [ ] **Step 1: 安装依赖**

运行：

```bash
npm install
```

预期：生成 `package-lock.json`，依赖安装成功。

- [ ] **Step 2: 运行测试**

运行：

```bash
npm test
```

预期：所有测试通过。

- [ ] **Step 3: 运行构建**

运行：

```bash
npm run docs:build
```

预期：构建成功，输出目录为 `docs/.vitepress/dist`。

- [ ] **Step 4: 提交 lockfile**

运行：

```bash
git add package-lock.json
git commit -m "锁定 Node 依赖版本"
```

预期：生成一个中文提交。

- [ ] **Step 5: 查看最终状态**

运行：

```bash
git status --short
```

预期：只剩下用户已有但不属于本实现的未跟踪文件，例如 `AGENTS.md`；`.superpowers/` 已被 `.gitignore` 忽略。

## 自查记录

- 设计文档中的 VitePress、独立资源 Markdown、自动索引、投稿说明、GitHub Actions 发布均有对应任务。
- 分类全部使用 `ebooks`、`torrents`、`games`。
- 生成脚本包含中文错误信息，并会在字段缺失或分类不一致时失败。
- 计划中的提交信息均为中文。
