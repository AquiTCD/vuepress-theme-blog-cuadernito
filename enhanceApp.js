const _ = require('lodash')

const defaultConfig = {
  threshold: 70,
  includeNewer: true,
  toLower: true,
  indices: [
    {
      name: 'keywords',
      weight: 100,
    },
    {
      name: 'tags',
      weight: 70,
    },
    {
      name: 'date',
      weight: 10,
    },
  ],
}

/**
 * 指定した記事の関連記事を抽出する.
 *
 * @param {Array} allpostNodes 全記事のノード一覧
 * @param {Object} postNode 記事のノード
 * @param {Object} config 設定
 */
function extractRelatedPosts(allpostNodes, postNode, config) {
  if (!allpostNodes || allpostNodes.length === 0) {
    return []
  }

  return extractRelatedPostRankings(allpostNodes, postNode, config).map(
    r => r.node
  )
}

/**
 * 指定した記事の関連記事の関連度ランキングを抽出する.
 *
 * @param {Array} allpostNodes 全記事のノード一覧
 * @param {Object} postNode 記事のノード
 * @param {Object} config 設定
 */
function extractRelatedPostRankings(allpostNodes, postNode, config) {
  if (!allpostNodes || allpostNodes.length === 0) {
    return []
  }

  const idx = createInvertedIndex(allpostNodes, config)
  const query = createQuery(idx, postNode, config.indices)
  const upperDate = new Date(postNode.frontmatter.date)

  // 自分自身は関連記事のランキングから削除する
  return _extractRelatedPostRankings(idx, query, upperDate).filter(
    r => r.node !== postNode
  )
}

/**
 * 転置インデックスを生成する.
 *
 * @param {Object} config 設定
 * @param {Array} allpostNodes 全記事のノード一覧
 * @return 転置インデックス
 */
function createInvertedIndex(allpostNodes, config) {
  const searchInvertedIndex = initInvertedIndex(config)
  addInvertedIndex(searchInvertedIndex, allpostNodes)
  return searchInvertedIndex
}

/**
 * 転置インデックスのひな型を作成する.
 *
 * @param {Object} config 設定
 * @return {Object} 転置インデックス
 */
function initInvertedIndex(config) {
  return {
    index: config.indices
      .map(i => ({ [i.name]: [] }))
      .reduce((a, b) => Object.assign(a, b), {}),
    minWeight: Math.min(...config.indices.map(i => i.weight)),
    maxWeight: Math.max(...config.indices.map(i => i.weight)),
    cfg: config,
  }
}

/**
 * 指定した転置インデックスに記事情報を追加する.
 *
 * @param {Object} idx 転置インデックス
 * @param {Array} allpostNodes 全記事のノード一覧
 * @return なし
 */
function addInvertedIndex(idx, allpostNodes) {
  idx.cfg.indices.forEach(config => {
    if (config.weight === 0) {
      return
    }

    const setm = idx.index[config.name]

    allpostNodes.forEach(postNode => {
      getKeywords(postNode, config).forEach(keyword => {
        if (setm[keyword]) {
          setm[keyword].push(postNode)
        } else {
          setm[keyword] = [postNode]
        }
      })
    })
  })
}

/**
 * 転置インデックスと記事から、関連記事を抽出用のクエリを生成する.
 *
 * @param {Object} idx 転置インデックス
 * @param {Object} postNode 記事のノード(この記事の関連記事を探す)
 * @param {Object} indices 索引
 * @return {Object} 関連記事を抽出用のクエリ
 */
function createQuery(idx, postNode, indices) {
  // 索引設定を取得
  // const indexConfigs =
  //   indices && indices.length > 0
  //     ? // 索引を指定している場合は、指定した転置インデックスから検索設定を取得する
  //       indices.map(i => getIndexCfg(idx, i.name))
  //     : // 索引未指定の場合は、設定ファイルに指定した索引を使用する
  //       cfg.indices
  const indexConfigs = indices.map(i => getIndexCfg(idx, i.name))

  // 索引設定から検索クエリを生成
  return indexConfigs.map(indexConfig => ({
    index: indexConfig.name,
    keywords: getKeywords(postNode, indexConfig),
  }))
}

/**
 * 転置インデックスから、指定した索引名の索引を取得する.
 *
 * @param {Object} idx 転置インデックス
 * @param {string} name 索引名
 * @return 索引
 */
function getIndexCfg(idx, name) {
  for (const conf of idx.cfg.indices) {
    if (conf.name === name) {
      return conf
    }
  }

  throw new Error(`index config for ${name} not found`)
}

/**
 * 記事のノードから設定で指定した名前の情報を取得する.
 *
 * @param {Object} postNode 記事のノード
 * @param {Object} cfg 設定
 * @return 記事ノードのメタ情報（設定で指定した名前の情報）
 */
function getKeywords(postNode, cfg) {
  const keywords = postNode.frontmatter[cfg.name]

  // メタ情報は未指定or文字列or文字列配列の可能性がある
  if (!keywords) {
    return []
  }

  if (_.isArray(keywords)) {
    if (cfg.toLower) {
      return keywords.map(k => k.toLowerCase())
    }
    return keywords
  }

  if (_.isString(keywords)) {
    if (cfg.toLower) {
      return [keywords.toLowerCase()]
    }
    return [keywords]
  }

  return []
}

/**
 * 指定した転置インデックスから、指定した検索クエリと関連記事公開日上限の条件を満たす、関連記事の関連度のランキングを抽出する.
 *
 * @param {Object} idx 転置インデックス
 * @param {Object} query 検索クエリ
 * @param {Object} upperDate 関連記事公開日上限
 */
function _extractRelatedPostRankings(idx, query, upperDate) {
  // 記事別のランキングを集約する
  // 記事の識別は記事のURL(path)で行う
  const rangings = {}

  query.forEach(q => {
    const setm = idx.index[q.index]
    if (!setm) {
      throw new Error(`index for ${q.index} not found`)
    }

    const config = getIndexCfg(idx, q.index)
    if (!config) {
      throw new Error(`index config for ${q.index} not found`)
    }

    q.keywords
      .map(keyword => ({
        // 索引に紐づく記事のノード一覧を取得
        keyword,
        postNodes: setm[keyword],
      }))
      .filter(({ postNodes }) => !postNodes || postNodes.length > 0) // 見つからない場合、空配列の場合は除外
      .forEach(({ keyword, postNodes }) => {
        postNodes
          .filter(postNode => {
            if (idx.cfg.includeNewer) {
              return true
            }
            // includeNewerを指定していない場合、対象記事より新しい記事を関連記事から除外する
            return (
              new Date(postNode.frontmatter.date).getTime() <=
              upperDate.getTime()
            )
          })
          .forEach(postNode => {
            const path = postNode.path
            const r = rangings[path]

            // ランキングが存在する場合は、情報追加
            if (r) {
              r.weight += config.weight
              r.matches++
              r.details.push({
                weight: config.weight,
                keyword,
              })
              // 存在しない場合は、新規作成
            } else {
              rangings[path] = {
                node: postNode,
                matches: 1,
                weight: config.weight,
                details: [
                  {
                    weight: config.weight,
                    keyword,
                  },
                ],
              }
            }
          })
      })
  })

  // 収集したランキングの正規化した重み付けが、設定した閾値以上の場合を関連記事とみなす
  return Object.values(rangings)
    .map(ranking => {
      const avgWeight = ranking.weight / ranking.matches
      const totalWeight = norm(avgWeight, idx.minWeight, idx.maxWeight)
      const threshold = idx.cfg.threshold / ranking.matches
      const isRelated = totalWeight >= threshold

      return Object.assign({}, ranking, {
        avgWeight,
        totalWeight,
        threshold,
        isRelated,
      })
    })
    .filter(ranking => ranking.isRelated)
    .sort((a, b) => {
      // 第一ソートキーは重み 降順（関連が多い記事を先に）
      if (a.weight > b.weight) {
        return -1
      }
      if (a.weight < b.weight) {
        return 1
      }
      // 第二ソートキーは日付 降順（新しい記事を先に）
      if (
        new Date(a.node.frontmatter.date).getTime() >
        new Date(b.node.frontmatter.date).getTime()
      ) {
        return -1
      }
      if (
        new Date(a.node.frontmatter.date).getTime() <
        new Date(b.node.frontmatter.date).getTime()
      ) {
        return 1
      }

      return 0
    })
}

/**
 * 指定した数値を0～100の範囲で標準化した値を取得する.
 *
 * @param {*} num 数値
 * @param {*} min 最小値
 * @param {*} max 最大値
 */
function norm(num, min, max) {
  if (min > max) {
    throw Error(`min(${min}) > max(${max})`)
  }
  return Math.floor(((num - min) / (max - min)) * 100 + 0.5)
}

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      $relatedPosts() {
        const allPostNodes = this.$site.pages
        const node = this.$page
        const config = defaultConfig
        const relatedPosts = extractRelatedPosts(
          allPostNodes, // 全記事のノード配列
          node, // 対象の記事のノード
          config
          // relatedPost.defaultConfig // 設定
        )
        return relatedPosts
      },
      $posts() {
        const allPostNodes = this.$site.pages.filter((post) => post.frontmatter.layout === 'Post')
        return _.reverse(_.sortBy(allPostNodes, (entry) => entry.frontmatter.date))
      },
      $isPost() {
        return this.$page.regularPath.startsWith('/_posts/')
      },
    },
  })
}
