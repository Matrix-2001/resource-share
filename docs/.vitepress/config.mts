import { defineConfig } from 'vitepress'
import { processSearchTerm, tokenizeSearchText } from './search-tokenizer.mjs'

export default defineConfig({
  title: '资源共享索引',
  description: '资源共享索引',
  lang: 'zh-CN',
  base: '/resource-share/',
  cleanUrls: true,
  srcExclude: ['superpowers/**/*.md'],
  vite: {
    plugins: [
      {
        name: 'block-superpowers-pages',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url) {
              next()
              return
            }

            const normalizedPath = decodeURI(req.url).replace(/[?#].*$/, '')
            if (
              normalizedPath.startsWith('/resource-share/superpowers/') ||
              normalizedPath.startsWith('/superpowers/')
            ) {
              res.statusCode = 404
              res.end('Not Found')
              return
            }

            next()
          })
        }
      }
    ]
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '资源总览', link: '/resources/' },
      { text: '投稿说明', link: '/contribute' }
    ],
    sidebar: [
      {
        text: '资源共享索引',
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
          { text: 'P2P 索引资源', link: '/resources/torrents/' },
          { text: '游戏资源', link: '/resources/games/' },
          { text: '创作者内容索引', link: '/resources/creator-archives/' },
          { text: '网络工具', link: '/resources/network-tools/' },
          { text: '❤大家想看的东西❤', link: '/resources/❤大家想看的东西❤/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Matrix-2001/resource-share' }
    ],
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: tokenizeSearchText,
            processTerm: processSearchTerm
          }
        },
        translations: {
          button: {
            buttonText: '搜索资源',
            buttonAriaLabel: '搜索资源'
          },
          modal: {
            noResultsText: '没有找到相关资源',
            resetButtonTitle: '清除搜索',
            backButtonTitle: '关闭搜索',
            displayDetails: '显示详情',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
