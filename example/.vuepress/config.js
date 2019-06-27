module.exports = {
  title: 'VuePress Blog Example',
  description: 'This is a blog example built by VuePress',
  theme: require.resolve('../../'),
  locales: {
    '/': {
      lang: 'ja',
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.ico' }],
    ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }],
    [
      'meta',
      {
        name: 'google-site-verification',
        content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0',
      },
    ],
    [
      'meta',
      { name: 'format-detection', content: 'telephone=no,address=no,email=no' },
    ],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { property: 'og:locale', content: 'ja_JP' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.8.2/css/all.css',
        integrity:
          'sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay',
        crossorigin: 'anonymous',
      },
    ],
  ],
  plugins: [
    [
      'feed',
      {
        canonical_base: 'https://sandbox.solunita.net',
        sort: entries => _.reverse(_.sortBy(entries, 'date')),
      },
    ],
    [
      'sitemap',
      {
        hostname: 'https://sandbox.solunita.net',
      },
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-xxxxxxxxx-x',
      },
    ],
    [
      'seo',
      {
        title: $page => $page.frontmatter.title || $page.title,
        type: $page =>
          ['_posts'].some(folder => $page.regularPath.startsWith('/' + folder))
            ? 'article'
            : 'website',
        image: ($page, $site) => {
          const domain = $site.themeConfig.domain || ''
          let imagePath = ''
          if ($page.frontmatter.image) {
            imagePath = $page.frontmatter.image
          } else {
            imagePath =
              $page.frontmatter.layout === 'Page'
                ? $site.themeConfig.pageOgImage
                : $site.themeConfig.siteOgImage
          }
          return domain + imagePath
        },
        customMeta: (add, context) => {
          const {
            $site, // Site configs provided by Vuepress
            // $page, // Page configs provided by Vuepress
            // $isPage,

            // All the computed options from above:
            // siteTitle,
            // title,
            // description,
            // author,
            // tags,
            // twitterCard,
            // type,
            // url,
            // image,
            // publishedAt,
            // modifiedAt,
          } = context
          add('twitter:creater', '@' + $site.themeConfig.twitter)
        },
      },
    ],
    [require('./autoDescription.js'), {}],
  ],
  themeConfig: {
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#modifyblogpluginoptions
     * Workaround of https://github.com/ulivz/vuepress-plugin-blog/issues/1
     */
    modifyBlogPluginOptions(blogPlugnOptions) {
      const archiveDirectoryClassifierIndex = blogPlugnOptions.directories.findIndex(d => d.id === 'archive')
      blogPlugnOptions.directories.splice(archiveDirectoryClassifierIndex, 1)
      return blogPlugnOptions
    },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#nav
     */
    nav: [
      {
        text: 'Blog',
        link: '/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
    ],
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#footer
     */
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/AquiTCD',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/aquitcd',
        },
      ],
      copyright: [
        // {
        //   text: 'Privacy Policy',
        //   link: 'https://policies.google.com/privacy?hl=en-US',
        // },
        {
          text: 'Copyright © 2014 Aqui TCD',
          link: 'https://aquitcd.github.io',
        },
        {
          text: 'Powered by VuePress',
          link: 'https://vuepress.vuejs.org/',
        },
      ],
    },
    domain: 'https://sandbox.solunita.net',
    author: 'Aqui TSUCHIDA',
    twitter: 'AquiTCD',
    siteOgImage: '/ogp.png',
    pageOgImage: '/ogp_default.png',
    logo: '/logo.svg',
    navLogo: '/logo_mini.svg',
    sidebar: 'auto',
    sidebarDepth: 3,
    relatedPosts: 5,
    recentPosts: 5,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about/' },
      { text: 'Tags', link: '/tag/' },
    ],
    popularTags: [
      'Rails',
      'Vue.js',
      'Mac',
      'ガジェット',
      'ゲーム',
      '革工芸',
      '旅',
      '本',
    ],
    // paginationComponent: 'Pagination'
  },
}
