<template lang="pug">
  #base-list-layout
    .l-main
      main.home(role='main')
      .index_title
        .page_number(v-if="$pagination.paginationIndex")
          span.type Page:
          span.number {{$pagination.paginationIndex + 1 }}
        .page_tag(v-if="$currentTag")
          span.type Tag:
          span.name {{ currentTagName }}
      .posts
        .l-posts.post_summaries
          router-link.post_summary(v-for="page in pages" :key="page.path" :to="page.path")
            .post_summary--image
              img(:src="eyeCatchImage(page)" lazyload="on")
            .post_summary--title
              h2 {{page.title}}
            .post_summary--description
              p.post_body {{page.frontmatter.description}}
            .post_summary--date
              i.fas.fa-clock
              time.datetime(:datetime="publishedOn(page.frontmatter.date)") {{publishedOn(page.frontmatter.date)}}
            .post_summary--tags(v-if="page.frontmatter.tags")
              i.fas.fa-tags
              ul.tag_list
                li.tag_list--item(v-for="tag in page.frontmatter.tags")
                  .tag_list--link {{ tag }}
    //- component(v-if="paginationComponent" :is="paginationComponent")
    .l-pagination
      Paging.page_nav
</template>

<script>
/* global THEME_BLOG_PAGINATION_COMPONENT */
import Paging from '@theme/components/Paging.vue'
import Toc from '@theme/components/Toc.vue'
import {
  Pagination,
  SimplePagination,
} from '@vuepress/plugin-blog/lib/client/components'

export default {
  components: { Toc, Pagination, Paging },
  props: ['pagination'],
  data() {
    return {
      paginationComponent: null,
    }
  },

  created() {
    this.paginationComponent = this.getPaginationComponent()
  },

  computed: {
    pages() {
      if (this.$currentTag) {
        return this.$currentTag.pages
      } else {
        return this.pagination.pages
      }
    },
    currentTagName() {
      if (this.$currentTag) {
        const tag = this.$currentTag.path.match(/\/tag\/(.*)\//)[1]
        return tag
      } else {
        return false
      }
    },
  },

  methods: {
    getPaginationComponent() {
      const n = THEME_BLOG_PAGINATION_COMPONENT
      if (n === 'Pagination') {
        return Pagination
      }
      if (n === 'SimplePagination') {
        return SimplePagination
      }
      return Vue.component(n) || Pagination
    },
    publishedOn(date) {
      if (date) {
        return date.substr(0, 10)
      } else {
        return null
      }
    },
    eyeCatchImage(post) {
      const url = post.frontmatter.image || '/ogp_default.png'
      return url
    },
  },
  mounted() {
    console.log(this.$pagination)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/config'

.index_title
  font-size: $font-size-large
  rhythmical-margin: 0.5 0 0.5 0.5
  +mq-medium()
    margin-left: rhythmical-space(1)
    margin-right: rhythmical-space(1)
  +mq-larger()
    padding-left: rhythmical-space(1.5)
    padding-right: rhythmical-space(1.5)
.page_number,
.page_category,
.page_tag
  .type
    font-weight: bold
    padding-right: 0.5em
.post_summaries
  color: $font-color-base
  display: grid
  grid-gap: rhythmical-space(0.25)
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr))
  justify-content: center
  link-fix: true
  margin-bottom: rhythmical-space(0.5)
  margin-left: rhythmical-space(0.5)
  margin-right: rhythmical-space(0.5)
  +mq-medium()
    grid-gap: rhythmical-space(1)
    margin-bottom: rhythmical-space(1)
    margin-left: rhythmical-space(1)
    margin-right: rhythmical-space(1)
  +mq-larger()
    grid-gap: rhythmical-space(1.5)
    margin-bottom: rhythmical-space(1.5)
    margin-left: auto
    margin-right: auto
    padding-left: rhythmical-space(1.5)
    padding-right: rhythmical-space(1.5)
.post_summary
  background-color: $bg-object-base
  border-radius: 2px
  display: block
  height: 100%
  min-width: 360px
  padding: 0
  vertical-rhythm: true
  width: 100%
  z-depth: 1
  &:hover
    opacity: 0.6
    text-decoration: none
    z-depth: 3
.post_summary--image
  line-height: 0
  margin: 0
  padding: 0
  img
    min-width: 360px
    width: 100%
.post_summary--title
  background: $black-base
  color: $white-base
  rhythmical-padding: 0.25 0.5 0.25 0.5
  h2
    font-feature-settings: 'palt' 1
    font-size: 1.8rem
.post_summary--description,
.post_summary--date,
.post_summary--categories,
.post_summary--tags
  font-size: $font-size-small
  rhythmical-padding: 0 0.5 0 0.5
.page_nav
  align-items: center
  background: $white-base
  background-color: $bg-object-base
  border: 1px solid $black-base
  border-radius: 3px
  display: flex
  flex-flow: row nowrap
  justify-content: center
  list-style: none
  margin-bottom: 0
  rhythmical-margin: 0 0.25 1 0.25
  vertical-rhythm: true
.page_nav--item
  align-self: stretch
  flex-grow: 1
  justify-content: center
  max-width: 50%
  text-align: center
  &:not(:last-child)
    border-right: 1px solid $black-base
  .is-current
    background: $primary-color-tint
    border-bottom: 0
    color: $white-base
    height: 100%
    width: 100%
  .is-link
    border-bottom: 0
    display: block
    height: 100%
    width: 100%
    &:hover
      background: $primary-color-shade
      border-bottom: 0
      color: $white-base
.page_nav
  align-items: center
  background: $white-base
  background-color: $bg-object-base
  border: 1px solid $black-base
  border-radius: 3px
  display: flex
  flex-flow: row nowrap
  justify-content: center
  list-style: none
  margin-bottom: 0
  rhythmical-margin: 0 0.25 1 0.25
  vertical-rhythm: true
//
.common-layout
  .content-wrapper
    padding-bottom: 80px
</style>

<style src="prismjs/themes/prism-okaidia.css"></style>
