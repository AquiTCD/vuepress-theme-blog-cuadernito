// This plugin is an excerpt webmasterish/vuepress-plugin-autometa of for description

'use strict'

// const URL = require('url')
const _ = {
  defaultsDeep: require('lodash.defaultsdeep'),
  findIndex: require('lodash.findindex'),
  isEmpty: require('lodash.isempty'),
}

// -----------------------------------------------------------------------------

const REMOVE_MARKDOWN = require('remove-markdown')
const STRIPTAGS = require('striptags')

// -----------------------------------------------------------------------------

/**
 * holds relevant functions and data
 */
const PLUGIN = {
  name: 'autoDescription',
  default_metas: {},
}

// -----------------------------------------------------------------------------

/**
 * @return {object}
 */
PLUGIN.get_options_defaults = () => {
  const out = {
    enable: true, // enables/disables everything - control per page using frontmatter
    // order of what gets the highest priority:
    //
    // 1. frontmatter
    // 2. page excerpt
    // 3. content markdown paragraph
    // 4. content regular html <p>

    description_sources: [
      'frontmatter',
      'excerpt',

      // markdown paragraph regex
      // @todo: needs work
      //
      /^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^!\[.*?\]\((.*?)\))(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n/gim,
      //
      // this excludes blockquotes using `(?!^>)`
      /// ^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^!\[.*?\]\((.*?)\))(?!^>)(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n/img,

      // html paragraph regex
      /<p(?:.*?)>(.*?)<\/p>/i,

      // -----------------------------------------------------------------------

      // @notes: setting as array require escaping `\`

      // ['^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n', 'img'],
      // ['<p(?:.*?)>(.*?)<\/p>', 'i'],
    ],

    // -------------------------------------------------------------------------

    // @consider description max words/char
  }

  // ---------------------------------------------------------------------------

  return out
}
// PLUGIN.get_options_defaults()

/**
 * @return {object}
 */
PLUGIN.get_options = ($page, pluginOptions) => {
  const { frontmatter } = $page

  // ---------------------------------------------------------------------------

  // order of options override:
  // - defaults				-> gets set in this file by `PLUGIN.get_default_options()`
  // - plugin options	-> gets set in `config.js`
  // - frontmatter		-> gets set in each page

  const options = _.defaultsDeep(
    frontmatter[PLUGIN.name],
    pluginOptions,
    PLUGIN.get_options_defaults()
  )

  // ---------------------------------------------------------------------------

  return options
}
// PLUGIN.get_options()

/**
 * @return {string}
 */
PLUGIN.strip_markup = str =>
  STRIPTAGS(REMOVE_MARKDOWN(str, { useImgAltText: false }))

/**
 * @return {RegExp}
 */
PLUGIN.get_regex = re => (Array.isArray(re) ? new RegExp(...re) : re)

/**
 * @return {string}
 */
PLUGIN.get_default_description = ($page, options) => {
  // special handling for home

  const { frontmatter, _computed } = $page

  if (frontmatter.home) {
    const site = _computed.$site
    const description = site.description || ''

    return description
  }

  // ---------------------------------------------------------------------------

  if (_.isEmpty(options['description_sources'])) {
    return
  }

  // ---------------------------------------------------------------------------

  let out = ''

  for (const source of options['description_sources']) {
    let found = ''

    // -------------------------------------------------------------------------

    switch (source) {
      case 'frontmatter':
        if ($page.frontmatter.description) {
          found = $page.frontmatter.description
        }

        break

      // -----------------------------------------------------------------------

      case 'excerpt':
        if ($page.excerpt) {
          found = $page.excerpt
        }

        break

      // -----------------------------------------------------------------------

      default:
        // content without frontmatter - used with regex

        const content = $page._strippedContent || ''

        if (content) {
          const regex = PLUGIN.get_regex(source)

          let match

          if ((match = regex.exec(content)) !== null) {
            if (match[1]) {
              found = match[1]
            }
          }
        }

        break
    }

    // -------------------------------------------------------------------------

    found = PLUGIN.strip_markup(found.trim())

    // -------------------------------------------------------------------------

    if (found) {
      out = found

      break
    }
  }

  // ---------------------------------------------------------------------------

  return out
}
// PLUGIN.get_default_description()

module.exports = (pluginOptions, context) => ({
  extendPageData($page) {
    const options = PLUGIN.get_options($page, pluginOptions)
    const { frontmatter } = $page
    frontmatter.description =
      frontmatter.description || PLUGIN.get_default_description($page, options)
  },
})
