<template lang="pug">
  .recent_posts(v-if="recentPosts")
    h2.recent_posts--title 最近の記事
    ul.recent_posts--list
      li.recent_posts--item(v-for="post in recentPosts" :key="post.path")
        router-link(:to="post.path") {{ post.title }}
</template>

<script>
export default {
  computed: {
    recentPosts() {
      const postCount = this.$site.themeConfig.recentPosts || 5
      if (this.$posts.slice(0, postCount).length === 0) {
        return false
      } else {
        return this.$posts.slice(0, postCount)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/config'

.recent_posts
  rhythmical-margin: 1 0.5 0 0.5
.recent_posts--title
  font-weight: bold
  link-variation: $font-color-base true
.recent_posts--list
  list-style: none
.recent_posts--item
  border-bottom: 1px dashed $grey-base
  rhythmical-padding: 0 0.5 0 0.5
</style>
