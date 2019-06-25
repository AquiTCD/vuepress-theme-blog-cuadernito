<template lang="pug">
  .related_posts(v-if="relatedPosts")
    h2.related_posts--title 関連記事
    ul.related_posts--list
      li.related_posts--item(v-for="post in relatedPosts" :key="post.path")
        router-link(:to="post.path") {{ post.title }}
</template>

<script>
export default {
  computed: {
    relatedPosts() {
      const postCount = this.$site.themeConfig.relatedPosts || 5
      if (this.$relatedPosts.slice(0, postCount).length === 0) {
        return false
      } else {
        return this.$relatedPosts.slice(0, postCount)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/config'

.related_posts
  rhythmical-margin: 1 0.5 0 0.5
.related_posts--title
  font-weight: bold
  link-variation: $font-color-base true
.related_posts--list
  list-style: none
.related_posts--item
  border-bottom: 1px dashed $grey-base
  rhythmical-padding: 0 0.5 0 0.5
</style>
