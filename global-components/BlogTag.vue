<template>
  <router-link class="blog-tag" :to="tag.path">
    {{ tag.name }} ({{ tag.pages.length }})
  </router-link>
</template>

<script>
export default {
  props: ['tag'],
}
</script>

<style lang="stylus">
.blog-tag
  align-items: center
  border: 1px solid #000
  border-radius: 5px
  box-sizing: border-box
  color: #000
  display: inline-flex
  font-size: 20px
  font-weight: 300
  height: 45px
  justify-content: center
  margin-bottom: 20px
  margin-right: 20px
  padding: 0 15px
  text-align: left
  text-decoration: none
  transition: background-color 0.3s
  transition: all 0.5s
  word-break: break-word
  &:hover
    border: 1px solid $accentColor
    box-shadow: 0 0 5px $accentColor
    color: $accentColor !important
@media screen and (max-width: 768px)
  .blog-tag
    font-size: 14px
    margin-bottom: 10px
    margin-right: 10px
    padding: 3px 10px
</style>
