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
