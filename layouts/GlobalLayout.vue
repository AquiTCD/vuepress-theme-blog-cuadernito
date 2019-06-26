<template lang="pug">
  #vuperess-theme-blog__global-layout.l-body.theme-container(
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  )
    Header(:should-show-navbar="shouldShowNavbar" :sidebar-items="sidebarItems" @toggle-sidebar="toggleSidebar")
    .content-wrapper
      DefaultGlobalLayout.l-main
    Footer(:should-show-navbar="shouldShowNavbar")
</template>

<script>
import GlobalLayout from '@app/components/GlobalLayout.vue'
import Header from '@theme/components/Header.vue'
import MobileHeader from '@theme/components/MobileHeader.vue'
import Footer from '@theme/components/Footer.vue'
import 'ress/dist/ress.min.css'
import { resolveSidebarItems } from '@theme/components/util'

export default {
  components: {
    DefaultGlobalLayout: GlobalLayout,
    Header,
    MobileHeader,
    Footer,
  },
  data() {
    return {
      isSidebarOpen: false,
    }
  },
  computed: {
    // isIndex() {
    //   return !!(
    //     this.$page.frontmatter.home ||
    //     this.$pagination.paginationIndex ||
    //     this.$category ||
    //     this.$tag
    //   )
    // },
    shouldShowNavbar() {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home &&
        frontmatter.layout === 'Post' &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
        },
        userPageClass,
      ]
    },
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
  },

  methods: {
    toggleSidebar(to) {
      console.log(to)

      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },
  },
}
</script>

<style lang="stylus"></style>
