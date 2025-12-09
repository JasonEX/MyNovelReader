import type { IParser as ParserInstance, SiteConfig } from '../../../typings/MyNovelReader';
import Setting from '../../Setting';
import tpl_mainHtml from '../../res/main.tpl';
import { C } from '../../lib';

type ParserLike = ParserInstance;
type WrappedDocument = Document & { wrappedJSObject?: Document };
type WrappedElement = HTMLElement & { wrappedJSObject?: HTMLElement };

class DocumentManager {
  private static instance: DocumentManager;

  private site: SiteConfig | null = null;

  private constructor() {
    // 引入 Setting 以保持与设置模块的耦合（与旧逻辑一致）
    void Setting;
  }

  static getInstance(): DocumentManager {
    if (!DocumentManager.instance) {
      DocumentManager.instance = new DocumentManager();
    }
    return DocumentManager.instance;
  }

  setSite(site: SiteConfig | null): void {
    this.site = site;
  }

  prepDocument(): void {
    window.onload = window.onunload = function () {};

    // 破解右键限制
    let doc: WrappedDocument = document;
    const bd = doc.body;
    bd.onclick =
      bd.ondblclick =
      bd.onselectstart =
      bd.oncopy =
      bd.onpaste =
      bd.onkeydown =
      bd.oncontextmenu =
      bd.onmousemove =
      bd.onselectstart =
      bd.ondragstart =
      doc.onselectstart =
      doc.oncopy =
      doc.onpaste =
      doc.onkeydown =
      doc.oncontextmenu =
        null;
    doc.onclick =
      doc.ondblclick =
      doc.onselectstart =
      doc.oncontextmenu =
      doc.onmousedown =
      doc.onkeydown =
        function () {
          return true;
        };

    const wrappedDocument = document as WrappedDocument;
    doc = wrappedDocument.wrappedJSObject ?? document;
    doc.onmouseup = null;
    doc.onmousedown = null;
    doc.oncontextmenu = null;

    const arAllElements = doc.getElementsByTagName('*');
    for (let i = arAllElements.length - 1; i >= 0; i--) {
      const element =
        (arAllElements[i] as WrappedElement).wrappedJSObject ??
        (arAllElements[i] as WrappedElement);
      element.onmouseup = null;
      element.onmousedown = null;
    }

    // remove body style
    document.querySelectorAll('link[rel="stylesheet"], script').forEach(el => el.remove());
    document.querySelectorAll('html, body').forEach(el => {
      el.removeAttribute('style');
      el.removeAttribute('bgcolor');
    });

    document.querySelectorAll<HTMLStyleElement>('style:not(.noRemove)').forEach(styleEl => {
      if (styleEl.textContent?.includes('#cVim-link-container')) {
        // chrome 的 cVim 扩展
        return;
      }
      styleEl.remove();
    });

    // 移除 html 标签中非 head 和 body 的元素
    Array.from(document.documentElement.children).forEach(child => {
      const tagName = child.tagName.toLowerCase();
      if (tagName !== 'head' && tagName !== 'body') {
        child.remove();
      }
    });
  }

  initDocument(parser: ParserLike): void {
    document.title = parser.docTitle;

    document.body.innerHTML = this.renderTemplate(tpl_mainHtml.uiTrans(), parser);
  }

  private renderTemplate(template: string, data: ParserLike): string {
    const parserData = data as unknown as Record<string, unknown>;

    return template.replace(/\{([\w.]+)\}/g, (_match, key) => {
      const keys = key.split('.');
      let value: unknown = parserData[keys.shift() as string];

      try {
        for (let i = 0; i < keys.length; i += 1) {
          value = (value as Record<string, unknown>)[keys[i]];
        }
      } catch {
        value = undefined;
      }

      return value === undefined || value === null ? '' : String(value);
    });
  }

  clean(): void {
    document
      .querySelectorAll(
        'body > *:not(#container):not(.readerbtn):not(.noRemove):not(#reader_preferences):not(#uil_blocker):not(iframe[name="mynovelreader-iframe"])'
      )
      .forEach(el => el.remove());
    document.querySelectorAll('link[rel="stylesheet"]:not(.noRemove)').forEach(el => el.remove());
    document.querySelectorAll<HTMLElement>('body, #container').forEach(el => {
      el.removeAttribute('style');
      el.removeAttribute('class');
    });

    const gmWindow = unsafeWindow as typeof unsafeWindow & { jQuery?: JQueryStatic };
    if (gmWindow.jQuery && location.host.indexOf('qidian') > 0) {
      gmWindow.jQuery(document).off('selectstart').off('contextmenu');
    }
  }

  cleanAgain(): void {
    // 再次移除其它不相关的，起点，纵横中文有时候有问题
    setTimeout(() => this.clean(), 2000);
    setTimeout(() => this.clean(), 5000);
    setTimeout(() => this.clean(), 8000);
    // TM 用 addEventListener('load') 有问题
    window.onload = () => {
      this.clean();
      setTimeout(() => this.clean(), 500);
    };
  }

  addMutationObserve(callback: () => void): void {
    const siteConfig = this.site;
    if (!siteConfig) {
      return;
    }

    const resolvedContentSelector =
      typeof siteConfig.contentSelector === 'function'
        ? siteConfig.contentSelector($(document))
        : siteConfig.contentSelector;
    const contentSize =
      typeof resolvedContentSelector === 'string'
        ? document.querySelectorAll(resolvedContentSelector).length
        : 0;
    if (contentSize && !siteConfig.mutationSelector) {
      return;
    }

    if (!siteConfig.mutationSelector) {
      return;
    }

    let target = document.querySelector<HTMLElement>(siteConfig.mutationSelector);
    if (!target) {
      return;
    }

    const beforeTargetChildren = target.children.length;
    C.log(`target.children.length = ${target.children.length}`, target);

    let shouldAdd = false;

    if (siteConfig.mutationChildText) {
      shouldAdd =
        !!target.textContent && target.textContent.indexOf(siteConfig.mutationChildText) > -1;
    } else {
      const childCount = siteConfig.mutationChildCount;
      shouldAdd = childCount === undefined || target.children.length <= childCount;
    }

    if (!shouldAdd) {
      return;
    }

    const observer = new MutationObserver(() => {
      target = document.querySelector(siteConfig.mutationSelector as string);
      const nodeAdded = !!target && target.children.length > beforeTargetChildren;

      if (nodeAdded) {
        observer.disconnect();
        callback();
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    C.log('添加 MutationObserve 成功：', siteConfig.mutationSelector);
  }
}

const documentManager = DocumentManager.getInstance();

export { DocumentManager, documentManager };
export default documentManager;
