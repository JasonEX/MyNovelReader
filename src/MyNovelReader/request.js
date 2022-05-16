import config from './config'
import { Request, parseHTML, sleep, C } from './lib'
import App from './app'
import { observeElement } from './libdom'

/** @enum {number} */
export const RequestStatus = {
  Idle: 0,
  Loading: 1,
  Finish: 2,
  Fail: 3
}

export class XmlRequest {
  constructor() {
    this.status = RequestStatus.Idle
    this.doc = null
    this.errorHandleFunction = () => {}
  }

  async send(url) {
    this.status = RequestStatus.Loading
    const options = {
      url,
      method: 'GET',
      overrideMimeType: 'text/html;charset=' + document.characterSet,
      timeout: config.xhr_time
    }

    try {
      const res = await Request(options)
      this.doc = parseHTML(res.responseText)
      this.status = RequestStatus.Finish
    } catch (e) {
      this.status = RequestStatus.Fail
      this.errorHandleFunction()
      console.error('XmlRequest 请求过程出现异常', e)
    }
  }

  getDocument() {
    this.status = RequestStatus.Idle
    return this.doc
  }

  setErrorHandle(func) {
    this.errorHandleFunction = func
  }

  hide() {}
  show() {}
}

export class IframeRequest {
  constructor() {
    this.status = RequestStatus.Idle
    this.iframe = createIframe(this.loaded.bind(this))
    this.doc = null
    this.win = null
    this.errorHandleFunction = () => {}
  }

  get display () {
    return !this.iframe.style.display
  }

  async send(url) {
    this.status = RequestStatus.Loading
    if (!this.display) {
      this.show()
    }
    this.iframe.setAttribute('src', url)
  }

  async loaded() {
    this.doc = this.iframe.contentDocument
    this.win = this.iframe.contentWindow

    if (!this.doc) {
      this.status = RequestStatus.Fail
      this.hide()
      this.errorHandleFunction()
      console.error('IframeRequest 请求过程出现异常')
      return
    }

    this.win.scrollTo(0, this.doc.body.scrollHeight - this.win.innerHeight * 2)

    if (App.site.startLaunch) {
      App.site.startLaunch($(this.doc))
    }

    if (App.site.mutationSelector) {
      await observeElement(this.doc, App.site)
    } else {
      const timeout = App.site.timeout || 0
      if (timeout) {
        await sleep(timeout)
      }
    }
    this.hide()
    this.status = RequestStatus.Finish
  }

  getDocument() {
    this.status = RequestStatus.Idle
    return this.doc
  }

  setErrorHandle(func) {
    this.errorHandleFunction = func
  }

  hide() {
    this.iframe.style.display = 'none'
  }

  show() {
    this.iframe.style.display = ''
  }
}

function createIframe(onload) {
  const iframe = document.createElement('iframe')
  iframe.name = 'mynovelreader-iframe'
  iframe.style.cssText = `
    width:100%;
    height:${unsafeWindow.innerHeight}px;
    border:0!important;
    margin:0!important;
    padding:0!important;
    visibility:hidden!important;
  `
  document.body.appendChild(iframe)
  iframe.onload = onload
  return iframe
}
