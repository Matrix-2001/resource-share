import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const CATEGORIES = [
  { key: 'ebooks', title: '电子书资源', description: '电子书搜索、下载和阅读相关网站。' },
  { key: 'torrents', title: 'P2P 索引资源', description: 'P2P 文件索引、目录和相关资源站。' },
  { key: 'games', title: '游戏资源', description: '游戏信息、下载和相关工具资源。' },
  { key: 'creator-archives', title: '创作者内容索引', description: '创作者平台内容目录、索引和资料入口。' },
  { key: 'network-tools', title: '网络工具', description: '网络访问、代理服务和相关工具入口。' },
  { key: '❤大家想看的东西❤', title: '❤大家想看的东西❤', description: '特定内容索引、导航和相关资源入口。' }
]

const REQUIRED_FIELDS = ['title', 'url', 'category']
const STATUS_LABELS = {
  active: '可用',
  unknown: '未知',
  deprecated: '已废弃'
}

function parseFrontmatter(content, filePath) {
  const normalized = content.replaceAll('\r\n', '\n')
  if (!normalized.startsWith('---\n')) {
    throw new Error(`${filePath} 缺少 frontmatter`)
  }

  const end = normalized.indexOf('\n---', 4)
  if (end === -1) {
    throw new Error(`${filePath} frontmatter 未正确结束`)
  }

  const raw = normalized.slice(4, end).trim()
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
  const normalized = content.replaceAll('\r\n', '\n')
  const body = normalized.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
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
      summary: data.summary || firstParagraph(content),
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
    const headingLevel = currentCategory ? '##' : '###'
    const status = STATUS_LABELS[resource.status] || resource.status
    return [
      `${headingLevel} [${resource.title}](${relativeLink})`,
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  generateResourceIndexes({ rootDir: process.cwd() }).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
