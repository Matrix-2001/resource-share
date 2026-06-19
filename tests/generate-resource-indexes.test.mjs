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
