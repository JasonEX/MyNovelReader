import { C, toggleConsole } from './lib'
import Setting from './Setting'

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

function minFontSizeTest() {
  const $div = $('<div>')
    .text('阅读模式')
    .css('font-size', '12px')
    .appendTo('body')
  const fontSize = +getComputedStyle($div[0]).fontSize.slice(0, -2)
  $div.remove()
  if (fontSize > 12) {
    C.warn('浏览器最小字号超过 12px ，将会导致阅读模式按钮文字显示位置异常！')
  }
}

function logLevelTest() {
  toggleConsole(true)
  C.log('这是一条测试日志信息。')
  C.warn('这是一条测试警告信息。')
  C.error('这是一条测试错误信息。')
  toggleConsole(Setting.debug)
}

export function envCheckInit() {
  logLevelTest()
  mousedownEventTest()
  minFontSizeTest()
}
