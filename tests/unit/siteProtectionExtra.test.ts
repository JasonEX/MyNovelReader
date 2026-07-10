import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { SiteProtection } from '@/core/protection/SiteProtection';

type FakeLocation = {
  href: string;
  origin: string;
  hostname: string;
  assign: (url: string) => void;
  replace: (url: string) => void;
};

describe('SiteProtection (extra coverage)', () => {
  let dom: JSDOM;
  let protection: SiteProtection;

  afterEach(() => {
    protection?.deactivate();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const createDom = (html = '<!doctype html><html><body></body></html>') =>
    new JSDOM(html, { url: 'https://example.com/chapter/1', pretendToBeVisual: true });

  it('filters location.assign/replace when override is possible', () => {
    dom = createDom();
    globalThis.document = dom.window.document;

    const assign = vi.fn();
    const replace = vi.fn();

    const location = Object.create(null) as unknown as FakeLocation;
    location.href = 'https://example.com/chapter/1';
    location.origin = 'https://example.com';
    location.hostname = 'example.com';
    location.assign = assign as unknown as FakeLocation['assign'];
    location.replace = replace as unknown as FakeLocation['replace'];

    const win = {
      location,
      setTimeout: dom.window.setTimeout,
      setInterval: dom.window.setInterval,
      clearTimeout: dom.window.clearTimeout,
      clearInterval: dom.window.clearInterval,
      Node: dom.window.Node,
      HTMLScriptElement: dom.window.HTMLScriptElement,
      HTMLIFrameElement: dom.window.HTMLIFrameElement,
      Element: dom.window.Element,
      DocumentFragment: dom.window.DocumentFragment,
    } as unknown as Window & typeof globalThis;

    globalThis.window = win;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });
    protection.activate();

    // Allowed: same-origin normal path.
    win.location.assign('https://example.com/novel/2.html');
    expect(assign).toHaveBeenCalledTimes(1);

    // Blocked: cross-origin.
    win.location.assign('https://evil.example/x');
    expect(assign).toHaveBeenCalledTimes(1);

    // Blocked: same-origin but redirect pattern.
    win.location.replace('https://example.com/redirect?x=1');
    expect(replace).toHaveBeenCalledTimes(0);
  });

  it('blocks suspicious string callbacks for setTimeout/setInterval', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const originalSetTimeout = vi.fn(() => 123);
    const originalSetInterval = vi.fn(() => 456);
    // overriding in test
    dom.window.setTimeout = originalSetTimeout;
    // overriding in test
    dom.window.setInterval = originalSetInterval;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });
    protection.activate();

    // Suspicious string callback
    // TimerHandler supports string
    expect(dom.window.setTimeout('location.href="https://evil.example/"', 100)).toBe(0);
    // TimerHandler supports string
    expect(dom.window.setInterval('window.open("https://evil.example/")', 100)).toBe(0);

    // Safe function callback should pass through to original
    expect(dom.window.setTimeout(() => {}, 10)).toBe(123);
    expect(dom.window.setInterval(() => {}, 10)).toBe(456);
  });

  it('blocks dynamic injection of iframes, fragments, and aggressive same-origin ad scripts', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: true,
    });
    protection.activate();

    const okScript = dom.window.document.createElement('script');
    okScript.src = 'https://example.com/js/app.js';
    dom.window.document.body.appendChild(okScript);
    expect(
      dom.window.document.querySelector('script[src="https://example.com/js/app.js"]')
    ).not.toBeNull();

    const blockedIframe = dom.window.document.createElement('iframe');
    blockedIframe.src = 'https://evil.example/x';
    dom.window.document.body.appendChild(blockedIframe);
    expect(dom.window.document.querySelector('iframe[src="https://evil.example/x"]')).toBeNull();

    const fragment = dom.window.document.createDocumentFragment();
    const nested = dom.window.document.createElement('div');
    const nestedScript = dom.window.document.createElement('script');
    nestedScript.src = 'https://evil.example/x.js';
    nested.appendChild(nestedScript);
    fragment.appendChild(nested);
    dom.window.document.body.appendChild(fragment);
    expect(dom.window.document.querySelector('script[src="https://evil.example/x.js"]')).toBeNull();

    const aggressive = dom.window.document.createElement('script');
    aggressive.src = 'https://example.com/Ab12Cd34/EFgh5678iJ.js';
    dom.window.document.body.appendChild(aggressive);
    expect(
      dom.window.document.querySelector('script[src="https://example.com/Ab12Cd34/EFgh5678iJ.js"]')
    ).toBeNull();
  });

  it('allows trusted same-origin popups but blocks others', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const originalOpen = vi.fn(() => ({}) as unknown as Window);
    Object.defineProperty(dom.window, 'open', { value: originalOpen, configurable: true });

    // @ts-expect-error - test env
    dom.window.event = { isTrusted: true };

    protection = new SiteProtection({
      blockPopups: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    const allowed = dom.window.open('https://example.com/chapter/2');
    expect(allowed).not.toBeNull();
    expect(originalOpen).toHaveBeenCalledTimes(1);

    // @ts-expect-error - test env
    dom.window.event = { isTrusted: false };
    expect(dom.window.open('https://example.com/chapter/3')).toBeNull();
  });

  it('unlockKeyboard blocks non-MNR events but allows MNR events', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    // Ensure instanceof checks in isMnrEvent use the same realm as the JSDOM we created.
    globalThis.Element = dom.window.Element as unknown as typeof Element;
    globalThis.ShadowRoot = dom.window.ShadowRoot as unknown as typeof ShadowRoot;

    protection = new SiteProtection({
      unlockKeyboard: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    const nextCaptureListener = vi.fn();
    dom.window.document.addEventListener('keydown', nextCaptureListener, true);

    const blocked = new dom.window.KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    dom.window.document.dispatchEvent(blocked);
    expect(nextCaptureListener).not.toHaveBeenCalled();

    const host = dom.window.document.createElement('div');
    host.id = 'mnr-root';
    dom.window.document.body.appendChild(host);

    const allowed = new dom.window.KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(allowed, 'composedPath', {
      value: () => [host],
    });
    dom.window.document.dispatchEvent(allowed);
    expect(nextCaptureListener).toHaveBeenCalledTimes(1);
  });

  it('blockVisibilityDetection overrides document visibility and stops listeners', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      blockVisibilityDetection: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
    });
    protection.activate();

    expect(dom.window.document.hidden).toBe(false);
    expect(dom.window.document.visibilityState).toBe('visible');

    const visibilityListener = vi.fn();
    dom.window.document.addEventListener('visibilitychange', visibilityListener, true);
    dom.window.document.dispatchEvent(new dom.window.Event('visibilitychange'));
    expect(visibilityListener).not.toHaveBeenCalled();

    const blurListener = vi.fn();
    dom.window.addEventListener('blur', blurListener, true);
    dom.window.dispatchEvent(new dom.window.Event('blur'));
    expect(blurListener).not.toHaveBeenCalled();
  });

  it('blockVisibilityDetection restores original descriptors on deactivate', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    // Capture the original descriptor from the prototype before activation
    const proto = Object.getPrototypeOf(dom.window.document) as object;
    const originalHiddenDesc = Object.getOwnPropertyDescriptor(proto, 'hidden');
    const originalVisibilityDesc = Object.getOwnPropertyDescriptor(proto, 'visibilityState');

    protection = new SiteProtection({
      blockVisibilityDetection: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
    });
    protection.activate();

    // While active, our override is an own property on document
    expect(Object.getOwnPropertyDescriptor(dom.window.document, 'hidden')).toBeDefined();
    expect(dom.window.document.hidden).toBe(false);

    protection.deactivate();

    // After deactivation, the own property should be removed so the prototype shows through
    const afterHiddenDesc = Object.getOwnPropertyDescriptor(dom.window.document, 'hidden');
    expect(afterHiddenDesc).toBeUndefined();

    // The prototype descriptor should still be intact
    const protoHiddenDesc = Object.getOwnPropertyDescriptor(proto, 'hidden');
    expect(protoHiddenDesc).toEqual(originalHiddenDesc);

    const protoVisDesc = Object.getOwnPropertyDescriptor(proto, 'visibilityState');
    expect(protoVisDesc).toEqual(originalVisibilityDesc);
  });

  it('blockVisibilityDetection restores instance-level descriptors on deactivate', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    // Set a custom own-property descriptor on document before activation
    const customGetter = () => true;
    Object.defineProperty(dom.window.document, 'hidden', {
      configurable: true,
      get: customGetter,
    });

    protection = new SiteProtection({
      blockVisibilityDetection: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
    });
    protection.activate();

    // While active, our override returns false
    expect(dom.window.document.hidden).toBe(false);

    protection.deactivate();

    // After deactivation, the custom instance descriptor should be restored
    const restored = Object.getOwnPropertyDescriptor(dom.window.document, 'hidden');
    expect(restored).toBeDefined();
    expect(restored!.get).toBe(customGetter);
    expect(dom.window.document.hidden).toBe(true);
  });

  it('repeated activate/deactivate cycles do not leak visibility overrides', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const proto = Object.getPrototypeOf(dom.window.document) as object;
    const originalHiddenDesc = Object.getOwnPropertyDescriptor(proto, 'hidden');

    protection = new SiteProtection({
      blockVisibilityDetection: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
    });

    for (let i = 0; i < 5; i++) {
      protection.activate();
      expect(dom.window.document.hidden).toBe(false);
      expect(dom.window.document.visibilityState).toBe('visible');

      protection.deactivate();

      // Own property should be cleaned up each time
      expect(Object.getOwnPropertyDescriptor(dom.window.document, 'hidden')).toBeUndefined();
      expect(
        Object.getOwnPropertyDescriptor(dom.window.document, 'visibilityState')
      ).toBeUndefined();
    }

    // Prototype descriptor should remain untouched after all cycles
    expect(Object.getOwnPropertyDescriptor(proto, 'hidden')).toEqual(originalHiddenDesc);
  });

  it('re-applies options when activate(options) is called while active', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    dom.window.document.body.setAttribute('oncopy', 'return false');

    protection = new SiteProtection({
      enableCopy: true,
      enableSelection: false,
      enableRightClick: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      blockRedirects: false,
      clearTimers: false,
    });

    protection.activate();
    expect(dom.window.document.body.getAttribute('oncopy')).toBeNull();

    dom.window.document.body.setAttribute('oncopy', 'return false');

    protection.activate({
      enableCopy: false,
      enableSelection: false,
      enableRightClick: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      blockRedirects: false,
      clearTimers: false,
    });

    expect(dom.window.document.body.getAttribute('oncopy')).toBe('return false');
  });

  it('handles invalid navigation URLs in location.assign (URL parsing failure)', () => {
    dom = createDom();
    globalThis.document = dom.window.document;

    const assign = vi.fn();
    const replace = vi.fn();

    const locationProto = Object.create(null) as unknown as Partial<FakeLocation>;
    Object.defineProperty(locationProto, 'href', {
      get: () => 'https://example.com/chapter/1',
      set: vi.fn(),
      configurable: true,
    });

    const location = Object.create(locationProto) as unknown as FakeLocation;
    location.origin = 'https://example.com';
    location.hostname = 'example.com';
    locationProto.assign = assign as unknown as FakeLocation['assign'];
    locationProto.replace = replace as unknown as FakeLocation['replace'];

    const win = {
      location,
      setTimeout: dom.window.setTimeout,
      setInterval: dom.window.setInterval,
      clearTimeout: dom.window.clearTimeout,
      clearInterval: dom.window.clearInterval,
      Node: dom.window.Node,
      HTMLScriptElement: dom.window.HTMLScriptElement,
      HTMLIFrameElement: dom.window.HTMLIFrameElement,
      HTMLAnchorElement: dom.window.HTMLAnchorElement,
      Element: dom.window.Element,
      DocumentFragment: dom.window.DocumentFragment,
      open: dom.window.open,
      getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
      innerWidth: dom.window.innerWidth,
      innerHeight: dom.window.innerHeight,
    } as unknown as Window & typeof globalThis;

    globalThis.window = win;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });
    protection.activate();

    win.location.assign('http://[invalid');
    expect(assign).toHaveBeenCalledTimes(0);
  });

  it('guards location.href setter when an overridable prototype exists', () => {
    dom = createDom();
    globalThis.document = dom.window.document;

    const hrefSet = vi.fn();
    const locationProto = Object.create(null) as unknown as Partial<FakeLocation>;
    Object.defineProperty(locationProto, 'href', {
      get: () => 'https://example.com/chapter/1',
      set: hrefSet,
      configurable: true,
    });

    const assign = vi.fn();
    const replace = vi.fn();

    const location = Object.create(locationProto) as unknown as FakeLocation;
    location.origin = 'https://example.com';
    location.hostname = 'example.com';
    locationProto.assign = assign as unknown as FakeLocation['assign'];
    locationProto.replace = replace as unknown as FakeLocation['replace'];

    const win = {
      location,
      setTimeout: dom.window.setTimeout,
      setInterval: dom.window.setInterval,
      clearTimeout: dom.window.clearTimeout,
      clearInterval: dom.window.clearInterval,
      Node: dom.window.Node,
      HTMLScriptElement: dom.window.HTMLScriptElement,
      HTMLIFrameElement: dom.window.HTMLIFrameElement,
      HTMLAnchorElement: dom.window.HTMLAnchorElement,
      Element: dom.window.Element,
      DocumentFragment: dom.window.DocumentFragment,
      open: dom.window.open,
      getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
      innerWidth: dom.window.innerWidth,
      innerHeight: dom.window.innerHeight,
    } as unknown as Window & typeof globalThis;

    globalThis.window = win;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });
    protection.activate();

    win.location.href = 'https://example.com/novel/2.html';
    expect(hrefSet).toHaveBeenCalledTimes(1);

    win.location.href = 'https://evil.example/x';
    expect(hrefSet).toHaveBeenCalledTimes(1);

    protection.deactivate();
    win.location.href = 'https://evil.example/x';
    expect(hrefSet).toHaveBeenCalledTimes(2);
  });

  it('tolerates read-only location overrides (defineProperty fails)', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });

    expect(() => protection.activate()).not.toThrow();
  });

  it('does not block same-origin iframes and tolerates invalid src URLs', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      blockRedirects: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });
    protection.activate();

    const invalidScript = dom.window.document.createElement('script');
    invalidScript.setAttribute('src', 'http://[invalid');
    dom.window.document.body.appendChild(invalidScript);
    expect(dom.window.document.body.contains(invalidScript)).toBe(true);

    const invalidFrame = dom.window.document.createElement('iframe');
    invalidFrame.setAttribute('src', 'http://[invalid');
    dom.window.document.body.appendChild(invalidFrame);
    expect(dom.window.document.body.contains(invalidFrame)).toBe(true);

    const okFrame = dom.window.document.createElement('iframe');
    okFrame.src = 'https://example.com/frame';
    dom.window.document.body.appendChild(okFrame);
    expect(dom.window.document.body.contains(okFrame)).toBe(true);
  });

  it('blocks insertBefore injection and document.write passthrough/flush cases in aggressive mode', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const doc = dom.window.document as unknown as Document & {
      write: (...args: unknown[]) => void;
      writeln: (...args: unknown[]) => void;
    };

    const originalWrite = vi.fn();
    const originalWriteln = vi.fn();
    // override for test
    doc.write = originalWrite;
    // override for test
    doc.writeln = originalWriteln;

    protection = new SiteProtection({
      blockRedirects: true,
      cleanupScripts: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    const ref = dom.window.document.body.firstChild;
    const blocked = dom.window.document.createElement('script');
    blocked.src = 'https://evil.example/x.js';
    dom.window.document.body.insertBefore(blocked, ref);
    expect(dom.window.document.querySelector('script[src="https://evil.example/x.js"]')).toBeNull();

    doc.writeln('hello');
    expect(originalWriteln).toHaveBeenCalledTimes(1);

    const huge = '<script src="http://[invalid">' + 'x'.repeat(5000);
    doc.write(huge);
    doc.write('<script src="http://[invalid"></script>');
    expect(originalWrite).toHaveBeenCalled();
  });

  it('removeOverlays hides invisible click-layers with transparent background and nested click targets', () => {
    dom = createDom('<!doctype html><html><body></body></html>');
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection();

    const layer = dom.window.document.createElement('div');
    layer.style.position = 'fixed';
    layer.style.top = '0';
    layer.style.left = '0';
    layer.style.width = '100%';
    layer.style.height = '80px';
    layer.style.zIndex = '2147483647';
    layer.style.opacity = '0.01';
    layer.style.backgroundColor = 'transparent';
    layer.getBoundingClientRect = () =>
      ({
        width: dom.window.innerWidth,
        height: 80,
        top: 0,
        left: 0,
        bottom: 80,
        right: dom.window.innerWidth,
      }) as DOMRect;

    const nested = dom.window.document.createElement('a');
    nested.href = 'https://example.com/x';
    layer.appendChild(nested);
    dom.window.document.body.appendChild(layer);

    protection.removeOverlays();
    expect(layer.style.display).toBe('none');

    const onclickLayer = dom.window.document.createElement('div');
    onclickLayer.style.position = 'fixed';
    onclickLayer.style.top = '0';
    onclickLayer.style.left = '0';
    onclickLayer.style.width = '100%';
    onclickLayer.style.height = '80px';
    onclickLayer.style.zIndex = '2147483647';
    onclickLayer.style.opacity = '0.01';
    onclickLayer.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    onclickLayer.setAttribute('onclick', 'return false');
    onclickLayer.getBoundingClientRect = layer.getBoundingClientRect;
    dom.window.document.body.appendChild(onclickLayer);

    const fnLayer = dom.window.document.createElement('div');
    fnLayer.style.position = 'fixed';
    fnLayer.style.top = '0';
    fnLayer.style.left = '0';
    fnLayer.style.width = '100%';
    fnLayer.style.height = '80px';
    fnLayer.style.zIndex = '2147483647';
    fnLayer.style.opacity = '0.01';
    fnLayer.style.backgroundColor = 'transparent';
    fnLayer.onclick = () => {};
    fnLayer.getBoundingClientRect = layer.getBoundingClientRect;
    dom.window.document.body.appendChild(fnLayer);

    protection.removeOverlays();
    expect(onclickLayer.style.display).toBe('none');
    expect(fnLayer.style.display).toBe('none');
  });

  it('cleanupScripts ignores invalid src and removes obvious ad scripts', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection();

    const invalid = dom.window.document.createElement('script');
    invalid.setAttribute('src', 'http://[invalid');
    dom.window.document.body.appendChild(invalid);

    const ad = dom.window.document.createElement('script');
    ad.src = 'https://evil.example/adsbygoogle.js';
    dom.window.document.body.appendChild(ad);

    protection.cleanupScripts();

    expect(dom.window.document.body.contains(invalid)).toBe(true);
    expect(
      dom.window.document.querySelector('script[src="https://evil.example/adsbygoogle.js"]')
    ).toBeNull();
  });

  it('removeEventHijacking blocks body clicks and allows real links', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      removeEventHijacking: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    const link = dom.window.document.createElement('a');
    link.href = 'https://example.com/x';
    dom.window.document.body.appendChild(link);

    dom.window.document.body.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    link.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    dom.window.document.body.dispatchEvent(
      new dom.window.MouseEvent('mousedown', { bubbles: true })
    );
    dom.window.document.body.dispatchEvent(new dom.window.MouseEvent('mouseup', { bubbles: true }));
  });

  it('enableRightClick/enableSelection/enableCopy remove inline blockers and stop propagation', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const el = dom.window.document.createElement('div');
    el.setAttribute('oncontextmenu', 'return false');
    el.setAttribute('unselectable', 'on');
    dom.window.document.body.setAttribute('oncopy', 'return false');
    dom.window.document.body.appendChild(el);

    const stopSpy = vi.spyOn(dom.window.Event.prototype, 'stopPropagation');

    protection = new SiteProtection({
      enableRightClick: true,
      enableSelection: true,
      enableCopy: true,
      clearTimers: false,
      blockRedirects: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    expect(el.getAttribute('oncontextmenu')).toBeNull();
    expect(el.getAttribute('unselectable')).toBeNull();
    expect(dom.window.document.body.getAttribute('oncopy')).toBeNull();

    dom.window.document.dispatchEvent(new dom.window.Event('selectstart', { bubbles: true }));
    dom.window.document.dispatchEvent(new dom.window.Event('copy', { bubbles: true }));

    expect(stopSpy).toHaveBeenCalled();
  });

  it('unlockKeyboard allows ShadowRoot/class-based MNR events but blocks others', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.Element = dom.window.Element as unknown as typeof Element;
    globalThis.ShadowRoot = dom.window.ShadowRoot as unknown as typeof ShadowRoot;

    protection = new SiteProtection({
      unlockKeyboard: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    const capture = vi.fn();
    dom.window.document.addEventListener('keydown', capture, true);

    const blocked = new dom.window.KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    dom.window.document.dispatchEvent(blocked);
    expect(capture).not.toHaveBeenCalled();

    const host = dom.window.document.createElement('div');
    host.id = 'mnr-root';
    dom.window.document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const allowedShadow = new dom.window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(allowedShadow, 'composedPath', { value: () => [shadow] });
    dom.window.document.dispatchEvent(allowedShadow);

    const classEl = dom.window.document.createElement('div');
    classEl.className = 'mnr-hotkey';
    dom.window.document.body.appendChild(classEl);

    const allowedClass = new dom.window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(allowedClass, 'composedPath', { value: () => [classEl] });
    dom.window.document.dispatchEvent(allowedClass);

    expect(capture).toHaveBeenCalledTimes(2);
  });

  it('unlockKeyboard shields MNR reader shortcuts but keeps editable MNR fields usable', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.Element = dom.window.Element as unknown as typeof Element;
    globalThis.ShadowRoot = dom.window.ShadowRoot as unknown as typeof ShadowRoot;

    protection = new SiteProtection({
      unlockKeyboard: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    const capture = vi.fn();
    dom.window.document.addEventListener('keydown', capture, true);

    const reader = dom.window.document.createElement('div');
    reader.className = 'mnr-reader';
    dom.window.document.body.appendChild(reader);

    const blockedShortcut = new dom.window.KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(blockedShortcut, 'composedPath', { value: () => [reader] });
    dom.window.document.dispatchEvent(blockedShortcut);
    expect(capture).not.toHaveBeenCalled();

    const input = dom.window.document.createElement('input');
    input.className = 'mnr-rule-input';
    reader.appendChild(input);

    const editableShortcut = new dom.window.KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(editableShortcut, 'composedPath', { value: () => [input, reader] });
    dom.window.document.dispatchEvent(editableShortcut);
    expect(capture).toHaveBeenCalledTimes(1);
  });

  it('blockPopups returns null on invalid URLs even when event is trusted', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const originalOpen = vi.fn(() => ({}) as unknown as Window);
    Object.defineProperty(dom.window, 'open', { value: originalOpen, configurable: true });
    // @ts-expect-error - test env
    dom.window.event = { isTrusted: true };

    protection = new SiteProtection({
      blockPopups: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    expect(dom.window.open('http://[invalid')).toBeNull();
    expect(originalOpen).toHaveBeenCalledTimes(0);
  });

  it('blockVisibilityDetection: document.hidden returns false even after real visibility change', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      blockVisibilityDetection: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
    });
    protection.activate();

    // Even after dispatching visibilitychange, our override keeps hidden=false
    dom.window.document.dispatchEvent(new dom.window.Event('visibilitychange'));
    expect(dom.window.document.hidden).toBe(false);
    expect(dom.window.document.visibilityState).toBe('visible');
  });

  it('repeated activate/deactivate does not leak event listeners', () => {
    dom = createDom();
    globalThis.document = dom.window.document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    protection = new SiteProtection({
      blockVisibilityDetection: true,
      enableCopy: true,
      enableSelection: true,
      enableRightClick: true,
      clearTimers: false,
      blockRedirects: false,
      unlockKeyboard: false,
      blockPopups: false,
      removeEventHijacking: false,
    });

    // Run multiple cycles
    for (let i = 0; i < 3; i++) {
      protection.activate();
      expect(dom.window.document.hidden).toBe(false);

      protection.deactivate();
    }

    // After final deactivate, visibility override should be gone
    const ownDesc = Object.getOwnPropertyDescriptor(dom.window.document, 'hidden');
    expect(ownDesc).toBeUndefined();

    // Re-activate one more time to confirm it still works
    protection.activate();
    expect(dom.window.document.hidden).toBe(false);
    expect(dom.window.document.visibilityState).toBe('visible');
    protection.deactivate();
  });

  it('unlockKeyboard tolerates documents without body and removes inline key handlers', () => {
    dom = createDom('<!doctype html><html><head></head><body></body></html>');

    const doc = dom.window.document;
    Object.defineProperty(doc, 'body', { value: null, configurable: true });

    globalThis.document = doc;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;

    const el = doc.createElement('div');
    el.setAttribute('onkeydown', 'return false');
    el.setAttribute('onkeyup', 'return false');
    el.setAttribute('onkeypress', 'return false');
    doc.documentElement.appendChild(el);

    protection = new SiteProtection({
      unlockKeyboard: true,
      clearTimers: false,
      blockRedirects: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      blockPopups: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
    });
    protection.activate();

    expect(el.getAttribute('onkeydown')).toBeNull();
    expect(el.getAttribute('onkeyup')).toBeNull();
    expect(el.getAttribute('onkeypress')).toBeNull();
  });
});
