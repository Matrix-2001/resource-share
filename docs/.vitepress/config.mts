import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '资源共享站',
  description: 'QQ 群资源共享索引',
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
