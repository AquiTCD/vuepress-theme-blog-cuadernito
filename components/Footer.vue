<template>
  <footer class="footer">
    <div class="footer-left-wrap">
      <ul class="contact" v-if="contact">
        <li class="contact-item" v-for="item in contact">
          <NavLink :link="item.link">
            <span> {{item.iconComponent}} </span>
            <!-- <component :is="item.iconComponent"></component> -->
            {{ item.text }}
          </NavLink>
        </li>
      </ul>
    </div>

    <div class="footer-right-wrap">
      <ul class="copyright" v-if="copyright">
        <li class="copyright-item" v-for="item in copyright">
          <NavLink :link="item.link">{{ item.text }}</NavLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
// import {
//   GithubIcon,
//   FacebookIcon,
//   TwitterIcon,
// } from 'vue-feather-icons'

export default {
  components: {
    // GithubIcon,
    // FacebookIcon,
    // TwitterIcon,
  },

  methods: {
    getIconComponentName(contactType) {
      switch (contactType) {
        case 'github':
          return 'GithubIcon'
        case 'facebook':
          return 'FacebookIcon'
        case 'twitter':
          return 'TwitterIcon'
        default:
          return ''
      }
    },
  },

  computed: {
    contact() {
      return (
        (this.$themeConfig.footer && this.$themeConfig.footer.contact) ||
        []
      )
        .map(({ type, link }) => {
          return {
            iconComponent: this.getIconComponentName(type),
            link,
          }
        })
        .filter(({ iconComponent }) => iconComponent)
    },

    copyright() {
      return (
        (this.$themeConfig.footer && this.$themeConfig.footer.copyright) || []
      )
    },
  },
}
</script>

<style lang="stylus" scoped>
ol,
ul
  list-style: none
  margin: 0
  padding: 0
.footer
  // background-color darken(#3eaf7c, 70%)
  background-color: #000
  box-sizing: border-box
  color: #FFF
  display: flex
  height: 60px
  padding: 15px 32px
  .footer-left-wrap
    display: flex
    flex: 1
    line-height: 30px
    .contact
      display: flex
      .contact-item
        flex: 1
        margin-right: 10px
        a
          color: rgba(255, 255, 255, 0.45)
          font-size: 12px
          text-decoration: none
          transition: color 0.3s
          &:hover
            color: #FFF
  .footer-right-wrap
    align-items: center
    display: flex
    flex: 1
    justify-content: center
    @media (min-width: $MQNarrow)
      justify-content: flex-end
    .copyright
      display: flex
      justify-content: flex-end
      .copyright-item
        border-right: 1px solid rgba(255, 255, 255, 0.6)
        flex: 0 0 auto
        line-height: 12px
        padding: 0 10px
        position: relative
        &:last-child
          border-right: none
        a
          color: rgba(255, 255, 255, 0.6)
          font-size: 12px
          text-decoration: none
          transition: color 0.3s
          &:hover
            color: rgba(255, 255, 255, 0.9)
@media (max-width: $MQMobile)
  .footer
    flex-direction: column
    height: 100px
    .footer-left-wrap
      align-items: center
      justify-content: center
</style>
