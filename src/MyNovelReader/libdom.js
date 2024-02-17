import { C, getTextNodesIn, parseHTML } from './lib'
import { toRE } from './lib'

// 等待页面上的元素出现
export function observeElement(
  doc,
  {
    contentSelector,
    mutationSelector,
    mutationChildText,
    mutationChildCount,
    mutationCheck
  }
) {
  var $doc = $(doc)

  var contentSize = $doc.find(contentSelector).size()

  if (contentSize && !mutationSelector) {
    return
  }

  var target = $doc.find(mutationSelector)[0]

  if (!target) {
    return
  }

  var check = true

  if (_.isFunction(mutationCheck)) {
    check = mutationCheck($doc)
  }

  var beforeTargetChilren = target.children.length
  C.log(`target.children.length = ${target.children.length}`, target)

  // 未找到加载中标志文本
  const textNotFound = mutationChildText && !target.textContent.includes(mutationChildText)

  if (textNotFound && check) {
    return
  }

  // 节点孩子数量足够多（一般正文的节点数量会多于加载时）
  const childCountEnough = mutationChildCount !== undefined && target.children.length > mutationChildCount

  if (childCountEnough && check) {
    return
  }

  if ((textNotFound || childCountEnough) && !check) {
    // 正文已生成，但检查函数还未通过，设置为 0 使得 nodeAdded 始终为 true
    beforeTargetChilren = 0
  }

  return new Promise(resolve => {
    var observer = new MutationObserver(function () {
      const target = $doc.find(mutationSelector)[0]
      var nodeAdded = target.children.length > beforeTargetChilren
      var check = true
      if (nodeAdded && _.isFunction(mutationCheck)) {
        check = mutationCheck($doc)
      }

      if (nodeAdded && check) {
        observer.disconnect()
        resolve()
      }
    })

    observer.observe(document, {
      childList: true,
      subtree: true
    })

    C.log('添加 MutationObserve 成功：', mutationSelector)
  })
}

// 等待 DOM 稳定
export function domMutation() {
  return new Promise(resolve => {
    const fn = _.debounce(() => {
      observer.disconnect()
      resolve()
    }, 100)
    const observer = new MutationObserver(fn)
    observer.observe(document, {
      childList: true,
      subtree: true
    })
    fn()
  })
}

const r = String.raw
const spaceRegex = toRE(r`&nbsp;|&ensp;|&emsp;`),
  noPrintRegex = toRE(r`&thinsp;|&zwnj;|&zwj;`),
  wrapHtmlRegex = toRE(r`</?(?:div|p|br|hr|h\d|article|dd|dl)[^>]*>`),
  indent1Regex = toRE(r`\s*\n+\s*`),
  indent2Regex = toRE(r`^[\n\s]+`),
  lastRegex = toRE(r`[\n\s]+$`),
  otherHtmlRegex = toRE(r`</?[a-zA-Z]+(?=[ >])[^<>]*>`)

export function htmlFmt(text, otherRegex = otherHtmlRegex) {
  text = text.replace(toRE('\ufeff|\u200b'), '')
  text = text.replace(spaceRegex, ' ')
  text = text.replace(noPrintRegex, '')
  text = text.replace(wrapHtmlRegex, '\n')
  text = text.replace(otherRegex, '')
  text = text.replace(indent1Regex, '\n')
  text = text.replace(indent2Regex, '')
  text = text.replace(lastRegex, '')
  // Unescape HTML entities
  text = parseHTML(text).documentElement.textContent

  return text
}

/**
 * 清除 HTML 代码，保留格式
 * @param {Document} doc
 * @returns {string}
 */
export function cleanHTML(doc) {
  const treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_COMMENT)
  while (treeWalker.nextNode()) {
    treeWalker.currentNode.remove()
  }

  // 模拟渲染文本节点
  getTextNodesIn(doc, true)
    .filter(n => n.data !== '\n')
    .forEach(n => (n.data = n.data.trim().replace(/\s+/g, ' ')))

  return htmlFmt(doc.outerHTML)
}

export function renderHTML(text) {
  text = text
    .split('\n')
    .filter(t => !!t.trim())
    .map(t => `<p>　　${escapeHtml(t)}</p>`)
    .join('\n')

  return `<div class="content">${text}</div>`
}

// https://stackoverflow.com/a/22706073
const p = document.createElement("p")
function escapeHtml(text) {
  p.textContent = text
  return p.innerHTML
}

