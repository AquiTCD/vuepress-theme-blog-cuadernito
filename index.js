const removeMd = require('remove-markdown')

module.exports = (themeConfig, ctx) => {
  themeConfig = Object.assign(
    {},
    themeConfig,
    {
      summary: true,
      summaryLength: 200,
      pwa: false,
    }
  )

  const defaultBlogPluginOptions = {
    directories: [
      {
        id: 'post',
        dirname: '_posts',
        path: '/',
        layout: 'IndexPost',
        itemLayout: 'Post',
        frontmatter: { title: '' },
        itemPermalink: '/:slug',
        pagination: {
          lengthPerPage: 12,
        },
      },
      {
        id: 'archive',
        dirname: '_archive',
        path: '/archive/',
        layout: 'IndexArchive',
        itemLayout: 'Post',
        itemPermalink: '/archive/:year/:month/:day/:slug',
        pagination: {
          lengthPerPage: 12,
        },
      },
    ],
    frontmatters: [
      {
        id: "tag",
        keys: ['tag', 'tags'],
        path: '/tag/',
        layout: 'Tag',
        frontmatter: { title: 'Tag' },
        itemlayout: 'Tag',
        pagination: {
          perPagePosts: 12
        }
      },
    ]
  }

  const { modifyBlogPluginOptions } = themeConfig

  const blogPluginOptions = typeof modifyBlogPluginOptions === 'function'
    ? modifyBlogPluginOptions(defaultBlogPluginOptions)
    : themeConfig

  const plugins = [
    '@vuepress/plugin-nprogress',
    ['@vuepress/medium-zoom', true],
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }],
    [
      '@vuepress/blog',
      blogPluginOptions,
    ],
  ]

  if (themeConfig.pwa) {
    plugins.push(
      ['@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: true
      }],
    )
  }

  const config = {
    plugins,
    define: {
      THEME_BLOG_PAGINATION_COMPONENT: themeConfig.paginationComponent
        ? themeConfig.paginationComponent
        : 'Pagination'
    }
  }

  /**
   * Generate summary.
   */
  if (themeConfig.summary) {
    config.extendPageData = function (pageCtx) {
      const strippedContent = pageCtx._strippedContent
      if (!strippedContent) {
        return
      }
      pageCtx.summary = removeMd(
        strippedContent
          .trim()
          .replace(/^#+\s+(.*)/, '')
          .slice(0, themeConfig.summaryLength)
      ) + ' ...'
    }
  }

  return config
}
