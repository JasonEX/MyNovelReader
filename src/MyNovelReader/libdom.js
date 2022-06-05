import { C } from './lib'

// 等待页面上的元素出现
export function observeElement(
  doc,
  { contentSelector, mutationSelector, mutationChildText, mutationChildCount }
) {
  var shouldAdd = false
  var $doc = $(doc)

  var contentSize = $doc.find(contentSelector).size()

  if (contentSize && !mutationSelector) {
    shouldAdd = false
  } else {
    var target = $doc.find(mutationSelector)[0]

    if (target) {
      var beforeTargetChilren = target.children.length
      C.log(`target.children.length = ${target.children.length}`, target)

      if (mutationChildText) {
        if (target.textContent.indexOf(mutationChildText) > -1) {
          shouldAdd = true
        }
      } else {
        if (
          mutationChildCount === undefined ||
          target.children.length <= mutationChildCount
        ) {
          shouldAdd = true
        }
      }
    }
  }

  if (shouldAdd) {
    return new Promise(resolve => {
      var observer = new MutationObserver(function () {
        target = $doc.find(mutationSelector)[0]
        var nodeAdded = target.children.length > beforeTargetChilren

        if (nodeAdded) {
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
}

// 将非p标签段落转换为p标签段落
export function toParagraphNode(node) {
  const p = document.createElement('p')
  const cloneTextNode = node.cloneNode()
  p.appendChild(cloneTextNode)
  node.replaceWith(p)
  return cloneTextNode
}
