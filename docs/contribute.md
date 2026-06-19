# 投稿说明

欢迎通过 Pull Request 补充资源。

## 新增资源步骤

1. 选择资源分类目录：
   - `docs/resources/ebooks/`：电子书资源。
   - `docs/resources/torrents/`：BT 种子资源。
   - `docs/resources/games/`：游戏资源。
   - `docs/resources/creator-archives/`：创作者内容归档。
   - `docs/resources/network-tools/`：网络工具。
   - `docs/resources/❤大家想看的东西❤/`：成人向资源。
2. 参考同目录下已有资源文件，新建一个小写 kebab-case 文件名，例如 `my-resource.md`。
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
- `category`：资源分类，必填，只能是 `ebooks`、`torrents`、`games`、`creator-archives`、`network-tools` 或 `❤大家想看的东西❤`。
- `tags`：资源标签，可选。
- `status`：资源状态，可选，支持 `active`、`unknown`、`deprecated`。

## 提交前检查

- 文件名使用小写 kebab-case。
- 资源分类和所在目录一致。
- 网址可以打开。
- 正文说明使用中文，写清楚资源用途。
- 不提交账号、密码、邀请码、密钥或本地路径。
