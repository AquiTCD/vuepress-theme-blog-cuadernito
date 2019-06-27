<template lang="pug">
  .l-main
    main.blog-tags
      BlogTag(
        v-for="tag in tags"
        :key="tag.name"
        :tag="tag"
      )
</template>

<script>
export default {
  props: ['tags'],
}
</script>

<style lang="stylus">
@import '~@theme/styles/config'

.blog-tags
  margin: auto
  padding: 1rem
  width: 66%
@media screen and (max-width: 1000px)
  .blog-tags
    width: 90%
</style>
