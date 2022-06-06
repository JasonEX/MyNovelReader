import { C } from './lib'

function mousedownEventTest() {
  let clicked
  const $div = $('<div>')
    .on('mousedown', () => (clicked = true))
    .appendTo('body')
  $div[0].dispatchEvent(new MouseEvent('mousedown'))
  $div.remove()
  if (!clicked) {
    C.error(
      'mousedown 事件测试失败，请检查浏览器是否有扩展或脚本（尤其是右键/复制限制解除类）与小说阅读脚本冲突！'
    )
  }
}

export function envCheckInit() {
  mousedownEventTest()
}
