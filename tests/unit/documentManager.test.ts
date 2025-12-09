import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentManager } from '../../src/MyNovelReader/app/document/DocumentManager';

const templateMock = vi.hoisted(() => ({ uiTrans: () => '<div id="tpl"></div>' }));
const cMock = vi.hoisted(() => ({ log: vi.fn(), error: vi.fn() }));

vi.mock('../../src/MyNovelReader/Setting', () => ({
  default: {},
}));

vi.mock('../../src/MyNovelReader/res/main.tpl', () => ({
  default: templateMock,
}));

vi.mock('../../src/MyNovelReader/lib', () => ({
  C: cMock,
}));

const resetInstance = () => {
  (DocumentManager as unknown as { instance?: unknown }).instance = undefined;
};

beforeEach(() => {
  resetInstance();
  document.documentElement.innerHTML = '<head></head><body></body>';
  vi.stubGlobal('unsafeWindow', {});
});

afterEach(() => {
  resetInstance();
  vi.restoreAllMocks();
  vi.unstubAllGlobals?.();
});

describe('DocumentManager.prepDocument', () => {
  it('clears handlers and removes page-level styles and scripts', () => {
    const manager = DocumentManager.getInstance();

    document.body.setAttribute('style', 'background:red');
    document.body.setAttribute('bgcolor', 'blue');

    const script = document.createElement('script');
    script.id = 'remove-script';
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'remove-style';
    document.body.appendChild(link);

    const keepStyle = document.createElement('style');
    keepStyle.classList.add('noRemove');
    keepStyle.textContent = 'body{}';
    document.body.appendChild(keepStyle);

    const style = document.createElement('style');
    style.textContent = '.foo{}';
    document.body.appendChild(style);

    const extra = document.createElement('section');
    document.documentElement.appendChild(extra);

    document.body.onclick = () => false;
    const child = document.createElement('div');
    child.onmouseup = () => false;
    document.body.appendChild(child);

    manager.prepDocument();

    expect(document.querySelector('#remove-script')).toBeNull();
    expect(document.querySelector('#remove-style')).toBeNull();
    expect(document.querySelector('style.noRemove')).not.toBeNull();
    expect(child.onmouseup).toBeNull();
    expect(document.body.onclick).toBeNull();
    const remainingTags = Array.from(document.documentElement.children).map(el => el.tagName);
    expect(remainingTags.every(tag => tag === 'HEAD' || tag === 'BODY')).toBe(true);
    expect(document.body.getAttribute('style')).toBeNull();
    expect(document.body.getAttribute('bgcolor')).toBeNull();
  });
});

describe('DocumentManager.clean', () => {
  it('removes unrelated nodes and resets attributes', () => {
    const manager = DocumentManager.getInstance();

    const container = document.createElement('div');
    container.id = 'container';
    container.setAttribute('style', 'color:red');
    container.className = 'foo';

    const readerBtn = document.createElement('div');
    readerBtn.className = 'readerbtn';

    const noRemove = document.createElement('div');
    noRemove.className = 'noRemove';

    const preferences = document.createElement('div');
    preferences.id = 'reader_preferences';

    const removable = document.createElement('div');
    removable.id = 'remove-me';

    document.body.append(container, readerBtn, noRemove, preferences, removable);

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.id = 'remove-link';
    document.head.appendChild(stylesheet);

    const keepStylesheet = document.createElement('link');
    keepStylesheet.rel = 'stylesheet';
    keepStylesheet.classList.add('noRemove');
    keepStylesheet.id = 'keep-link';
    document.head.appendChild(keepStylesheet);

    manager.clean();

    expect(document.querySelector('#remove-me')).toBeNull();
    expect(document.querySelector('#remove-link')).toBeNull();
    expect(document.querySelector('#keep-link')).not.toBeNull();
    expect(container.getAttribute('style')).toBeNull();
    expect(container.getAttribute('class')).toBeNull();
    expect(readerBtn.parentElement).toBe(document.body);
  });
});
