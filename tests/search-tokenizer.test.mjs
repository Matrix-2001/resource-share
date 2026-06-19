import test from 'node:test'
import assert from 'node:assert/strict'
import { tokenizeSearchText, processSearchTerm } from '../docs/.vitepress/search-tokenizer.mjs'

test('中文搜索词支持短词匹配', () => {
  const tokens = tokenizeSearchText('电子书搜索、下载和阅读相关网站')

  assert.ok(tokens.includes('电子书'))
  assert.ok(tokens.includes('下载'))
  assert.ok(tokens.includes('阅读'))
})

test('英文搜索词兼容大小写和连接符差异', () => {
  const tokens = tokenizeSearchText('Z-Library 是电子书资源入口')

  assert.ok(tokens.includes('z-library'))
  assert.ok(tokens.includes('zlibrary'))
  assert.equal(processSearchTerm('Z-Library'), 'zlibrary')
  assert.equal(processSearchTerm('zlibrary'), 'zlibrary')
})
