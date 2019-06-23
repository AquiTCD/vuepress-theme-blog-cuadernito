<template lang="pug">
  header.hero(:class="{'has-sidebar': $page.type === 'post' }")
    h1.site_title
      router-link.home-link(:to="$localePath")
        img.site_title--logo(v-if="data.heroImage || $site.themeConfig.logo"
          :src="$withBase(data.heroImage || $site.themeConfig.logo)"
          :alt="data.heroAlt || $title"
        )
        span#main-title(v-else)
          | {{ data.heroText || $title }}
    .site_tags
      ul.tag_list
        li.tag_list--item(v-for="tag in tags")
          a.tag_list--link(:href="'/tag/' + tag") {{ tag }}
    p.site_description
      | {{ data.tagline || $site.description }}
    //- p.action(v-if="data.actionText && data.actionLink")
    //-   NavLink.action-button(:item="actionLink")
</template>

<script>
// import NavLink from '@theme/components/Header/NavLink.vue'

export default {
  // components: { NavLink },

  computed: {
    data() {
      return this.$page.frontmatter
    },
    tags() {
      return this.$themeConfig.popularTags
    },
    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText,
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@theme/styles/config'

.hero
  vertical-rhythm: true
  z-depth: 1
.site_title
  background: $heroBackground
  is-full-width: true
  link-fix: true
  margin-top: $navbarHeight
  rhythmical-padding: 0.5 0 0.5 0
  text-align: center
.site_tags
  background: $heroBackground
  color: #fff
  is-full-width: true
  text-align: center
.tag_list
  display: inline-block
.tag_list--item
  color: $grey-base
  display: inline-block
  &:not(:last-child)
    margin-right: 1rem
.tag_list--link
  color: $grey-base
  &:before
    content: '#'
.site_title--logo
  background: transparent
  max-height: 192px
.site_description
  background: $descriptionBackgrond
  font-size: $font-size-small
  is-full-width: true
  line-height: 2rem
  text-align: center
  white-space: pre-wrap
</style>
