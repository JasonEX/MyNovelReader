import config from './config'
import { Request, parseHTML, sleep, C } from './lib'
import { observeElement } from './libdom'
import Setting from './Setting'

/** @enum {number} */
export const RequestStatus = {
  Idle: 0,
  Loading: 1,
  Finish: 2,
  Fail: 3
}

export const iframeHeight = unsafeWindow.innerHeight

class BaseRequest {
  /**@param { import("../typings/MyNovelReader").SiteConfig } siteInfo */
  constructor(siteInfo) {
    this.errorHandle = () => { }
    this.finishHandle = () => { }
    // 站点规则
    this.siteInfo = siteInfo
  }

  setErrorHandle(func) {
    this.errorHandle = func
  }

  setFinishHandle(func) {
    this.finishHandle = func
  }
}

export class HttpRequest extends BaseRequest {
  constructor(siteInfo) {
    super(siteInfo)
    this.status = RequestStatus.Idle
    this.doc = null
  }

  async send(url, referer) {
    this.status = RequestStatus.Loading
    this.doc = null
    const options = {
      url,
      method: 'GET',
      overrideMimeType: 'text/html;charset=' + document.characterSet,
      timeout: config.xhr_time
    }

    if (referer) {
      options.headers = { Referer: referer }
    }

    let retry = 3
    let error = null

    while (retry--) {
      try {
        const res = await Request(options)
        this.doc = parseHTML(res.responseText)
        this.status = RequestStatus.Finish
        this.finishHandle()
        break
      } catch (e) {
        error = e
        C.error(`HttpRequest 请求过程出现异常，第 ${3 - retry} 次请求`, error)
      }
    }

    if (!this.doc) {
      this.status = RequestStatus.Fail
      this.errorHandle()
      C.error('HttpRequest 请求失败', error)
    }

    return this.doc
  }

  getDocument() {
    this.status = RequestStatus.Idle
    return this.doc
  }

  hide() { }
  show() { }
}

export class IframeRequest extends BaseRequest {
  constructor(siteInfo) {
    super(siteInfo)
    this.status = RequestStatus.Idle
    this.iframe = null
    this.doc = null
    this.win = null
  }

  get display() {
    return this.iframe && !this.iframe.style.display
  }

  async send(url) {
    if (!this.iframe) {
      this.iframe = createIframe(this.loaded.bind(this), this.siteInfo)
    }
    this.status = RequestStatus.Loading
    this.doc = this.win = null

    if (!this.display) {
      this.show()
    }
    this.iframe.setAttribute('src', url + '#mynovelreader')
    return new Promise(resolve => (this.resolve = resolve))
  }

  async loaded() {
    this.doc = this.iframe.contentDocument
    this.win = this.iframe.contentWindow

    if (!this.doc) {
      this.status = RequestStatus.Fail
      this.hide()
      this.errorHandle()
      C.error('IframeRequest 请求过程出现异常')
      return
    }

    this.win.dispatchEvent(new WheelEvent('mousewheel', { deltaY: -100 }))
    this.win.scrollTo(0, this.doc.body.scrollHeight - this.win.innerHeight * 2)

    if (this.siteInfo.startLaunch) {
      this.siteInfo.startLaunch($(this.doc))
    }

    if (this.siteInfo.mutationSelector) {
      await observeElement(this.doc, this.siteInfo)
    } else {
      const timeout = this.siteInfo.timeout || 0
      if (timeout) {
        await sleep(timeout)
      }
    }
    this.hide()
    this.status = RequestStatus.Finish
    this.finishHandle()
    this.resolve(this.doc)
  }

  getDocument() {
    this.status = RequestStatus.Idle
    return this.doc
  }

  hide() {
    this.iframe.style.display = 'none'
  }

  show() {
    this.iframe.style.display = ''
  }
}

function createIframe(onload, { iframeSandbox, withReferer }) {
  const iframe = document.createElement('iframe')
  iframe.name = 'mynovelreader-iframe'
  iframe.style.cssText = `
    width:100%;
    height:${iframeHeight}px;
    border:0!important;
    margin:0!important;
    padding:0!important;
    visibility:hidden!important;
    display:none;
  `
  if (Setting.preloadNextPage && !withReferer) {
    iframe.referrerPolicy = 'no-referrer'
  }
  if (!_.isUndefined(iframeSandbox)) {
    iframe.sandbox = iframeSandbox
  }
  document.body.appendChild(iframe)
  iframe.onload = onload
  return iframe
}

