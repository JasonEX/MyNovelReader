import { C } from './lib'

const {
  HTMLElement,
  EventTarget,
  MutationObserver,
  Navigator,
  Proxy,
  Reflect,
  Object,
  setTimeout,
  clearTimeout,
  console
} = unsafeWindow

// 防止 iframe 中的脚本调用 focus 方法导致页面发生滚动
const _focus = HTMLElement.prototype.focus
HTMLElement.prototype.focus = function focus() {
  _focus.call(this, { preventScroll: true })
}

const clenaupEventArray = []

const _addEventListener = EventTarget.prototype.addEventListener
const addEventListenerProxy = new Proxy(_addEventListener, {
  apply(target, thisArg, argumentsList) {
    Reflect.apply(target, thisArg, argumentsList)
    clenaupEventArray.push(() => {
      try {
        thisArg.removeEventListener(...argumentsList)
      } catch (e) { }
    })
  }
})
EventTarget.prototype.addEventListener = addEventListenerProxy
document.addEventListener = addEventListenerProxy

const _observe = MutationObserver.prototype.observe
const _disconnect = MutationObserver.prototype.disconnect
const observeProxy = new Proxy(_observe, {
  apply(target, thisArg, argumentsList) {
    Reflect.apply(target, thisArg, argumentsList)
    clenaupEventArray.push(() => {
      try {
        _disconnect.apply(thisArg, argumentsList)
      } catch (e) { }
    })
  }
})
MutationObserver.prototype.observe = observeProxy

export function cleanupEvents(iframe) {
  let func
  const length = clenaupEventArray.length
  while ((func = clenaupEventArray.pop())) func()
  C.log(`${iframe ? '[iframe] ' : ''}已移除 ${length} 个事件监听器和观察器`)

  var highestTimeoutId = setTimeout(';')
  for (var i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i)
  }

  try {
    unsafeWindow.$(unsafeWindow).off()
    unsafeWindow.$(document).off()
  } catch (e) { }
}

if (window.name === 'mynovelreader-iframe') {
  unsafeWindow.$cleanupEvents = cleanupEvents
}

Object.defineProperty(Navigator.prototype, 'platform', {
  get: function platform() {
    return ''
  }
})

console.clear = () => { }

const proxies = new WeakMap()

unsafeWindow.Proxy = new Proxy(Proxy, {
  construct: function (target, argumentsList, newTarget) {
    const proxy = Reflect.construct(target, argumentsList, newTarget)
    proxies.set(proxy, argumentsList[0])
    return proxy
  }
})

export function isProxy(obj) {
  return proxies.has(obj)
}

export function getProxyTarget(proxy) {
  return isProxy(proxy) ? proxies.get(proxy) : proxy
}

export function setPropertyReadOnly(obj, prop, target) {
  const value = target || obj[prop]
  Object.defineProperty(obj, prop, {
    get() {
      return value
    },
    set() { }
  })
}
