import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

test('启用 VitePress 本地搜索并使用中文文案', async () => {
  const config = await readFile(join(process.cwd(), 'docs', '.vitepress', 'config.mts'), 'utf8')

  assert.match(config, /search:\s*{/)
  assert.match(config, /provider:\s*'local'/)
  assert.match(config, /buttonText:\s*'搜索资源'/)
  assert.match(config, /buttonAriaLabel:\s*'搜索资源'/)
  assert.match(config, /noResultsText:\s*'没有找到相关资源'/)
})

test('排除 superpowers 过程文档避免被搜索和访问', async () => {
  const config = await readFile(join(process.cwd(), 'docs', '.vitepress', 'config.mts'), 'utf8')

  assert.match(config, /srcExclude:\s*\[/)
  assert.match(config, /superpowers\/\*\*\//)
})
