/**
 * Helpers that restore ordinary user interaction: right-click, selection,
 * copy/cut, and keyboard propagation for MyNovelReader controls.
 */

export function enableRightClick(): () => void {
  const handler = (e: Event) => {
    e.stopPropagation();
    return true;
  };

  // Remove existing contextmenu blockers
  document.addEventListener('contextmenu', handler, true);

  // Override oncontextmenu
  const originalOnContextMenu = document.oncontextmenu;
  document.oncontextmenu = null;

  // Remove from body as well
  if (document.body) {
    document.body.oncontextmenu = null;
  }

  // Remove inline handlers
  document.querySelectorAll('[oncontextmenu]').forEach(el => {
    el.removeAttribute('oncontextmenu');
  });

  return () => {
    document.removeEventListener('contextmenu', handler, true);
    document.oncontextmenu = originalOnContextMenu;
  };
}

export function enableSelection(): () => void {
  const handler = (e: Event) => {
    e.stopPropagation();
    return true;
  };

  document.addEventListener('selectstart', handler, true);

  // Remove CSS that prevents selection
  const style = document.createElement('style');
  style.id = 'mnr-enable-selection';
  style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
  document.head.appendChild(style);

  // Remove inline handlers
  document.querySelectorAll('[onselectstart]').forEach(el => {
    el.removeAttribute('onselectstart');
  });

  // Remove unselectable attribute
  document.querySelectorAll('[unselectable]').forEach(el => {
    el.removeAttribute('unselectable');
  });

  return () => {
    document.removeEventListener('selectstart', handler, true);
    style.remove();
  };
}

export function enableCopy(): () => void {
  const handler = (e: Event) => {
    e.stopPropagation();
    return true;
  };

  document.addEventListener('copy', handler, true);
  document.addEventListener('cut', handler, true);

  // Remove inline handlers
  document.querySelectorAll('[oncopy], [oncut]').forEach(el => {
    el.removeAttribute('oncopy');
    el.removeAttribute('oncut');
  });

  return () => {
    document.removeEventListener('copy', handler, true);
    document.removeEventListener('cut', handler, true);
  };
}

export function unlockKeyboard(): () => void {
  const handler = (e: Event) => {
    const ke = e as KeyboardEvent;
    if (isMnrEvent(ke) && !isMnrReaderShortcutEvent(ke)) {
      return;
    }
    ke.stopImmediatePropagation();
    ke.stopPropagation();
  };

  const types: Array<keyof DocumentEventMap> = ['keydown', 'keyup', 'keypress'];
  types.forEach(type => document.addEventListener(type, handler, true));

  const originalDocumentHandlers = {
    keydown: document.onkeydown,
    keyup: document.onkeyup,
    keypress: document.onkeypress,
  };

  const originalWindowHandlers = {
    keydown: window.onkeydown,
    keyup: window.onkeyup,
    keypress: window.onkeypress,
  };

  const originalBodyHandlers = document.body
    ? {
        keydown: document.body.onkeydown,
        keyup: document.body.onkeyup,
        keypress: document.body.onkeypress,
      }
    : null;

  const originalHtmlHandlers = {
    keydown: document.documentElement.onkeydown,
    keyup: document.documentElement.onkeyup,
    keypress: document.documentElement.onkeypress,
  };

  document.onkeydown = null;
  document.onkeyup = null;
  document.onkeypress = null;
  window.onkeydown = null;
  window.onkeyup = null;
  window.onkeypress = null;
  document.documentElement.onkeydown = null;
  document.documentElement.onkeyup = null;
  document.documentElement.onkeypress = null;

  if (document.body) {
    document.body.onkeydown = null;
    document.body.onkeyup = null;
    document.body.onkeypress = null;
  }

  // Remove inline handlers
  document.querySelectorAll('[onkeydown], [onkeyup], [onkeypress]').forEach(el => {
    el.removeAttribute('onkeydown');
    el.removeAttribute('onkeyup');
    el.removeAttribute('onkeypress');
  });

  return () => {
    types.forEach(type => document.removeEventListener(type, handler, true));
    document.onkeydown = originalDocumentHandlers.keydown;
    document.onkeyup = originalDocumentHandlers.keyup;
    document.onkeypress = originalDocumentHandlers.keypress;
    window.onkeydown = originalWindowHandlers.keydown;
    window.onkeyup = originalWindowHandlers.keyup;
    window.onkeypress = originalWindowHandlers.keypress;
    document.documentElement.onkeydown = originalHtmlHandlers.keydown;
    document.documentElement.onkeyup = originalHtmlHandlers.keyup;
    document.documentElement.onkeypress = originalHtmlHandlers.keypress;
    if (document.body && originalBodyHandlers) {
      document.body.onkeydown = originalBodyHandlers.keydown;
      document.body.onkeyup = originalBodyHandlers.keyup;
      document.body.onkeypress = originalBodyHandlers.keypress;
    }
  };
}

function isMnrEvent(e: Event): boolean {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
  for (const node of path) {
    if (node instanceof ShadowRoot) {
      const host = node.host as HTMLElement | null;
      if (host?.id?.startsWith('mnr-')) return true;
    }
    if (node instanceof Element) {
      if (node.id?.startsWith('mnr-')) return true;
      for (const cls of Array.from(node.classList)) {
        if (cls.startsWith('mnr-')) return true;
      }
    }
  }
  return false;
}

function isMnrReaderShortcutEvent(e: KeyboardEvent): boolean {
  if (e.ctrlKey || e.altKey || e.metaKey) return false;

  const key = e.key.toLowerCase();
  const shortcutKeys = new Set([
    'escape',
    'tab',
    'enter',
    's',
    ',',
    'e',
    'q',
    'arrowleft',
    'arrowright',
    'arrowup',
    'arrowdown',
    ' ',
    'spacebar',
    'n',
    'p',
  ]);
  if (!shortcutKeys.has(key)) return false;

  const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
  if (path.some(isEditableKeyboardTarget)) return false;

  return path.some(node => {
    if (!(node instanceof Element)) return false;
    if (node.id === 'mnr-reader-root') return true;
    return Array.from(node.classList).some(cls => cls === 'mnr-reader' || cls.startsWith('mnr-'));
  });
}

function isEditableKeyboardTarget(node: EventTarget): boolean {
  if (!(node instanceof Element)) return false;
  const tagName = node.tagName;
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    (node as HTMLElement).isContentEditable === true
  );
}
