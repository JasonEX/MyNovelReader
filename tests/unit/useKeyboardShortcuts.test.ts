import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, nextTick, ref } from 'vue';
import { JSDOM } from 'jsdom';

import { useKeyboardShortcuts } from '@/ui/composables/useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // @ts-expect-error - test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('triggers handler and supports preventDefault/stopPropagation', async () => {
    const onNext = vi.fn();
    const onBody = vi.fn();

    document.body.addEventListener('keydown', onBody);

    const Comp = defineComponent({
      setup() {
        useKeyboardShortcuts([
          { key: 'n', handler: onNext, preventDefault: true, stopPropagation: true },
        ]);
        return () => null;
      },
    });

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp(Comp);
    app.mount(mountEl);
    await nextTick();

    const e = new dom.window.KeyboardEvent('keydown', {
      key: 'n',
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(e);

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(e.defaultPrevented).toBe(true);
    // stopPropagation in capture phase should prevent the body bubble listener
    expect(onBody).toHaveBeenCalledTimes(0);

    app.unmount();
    mountEl.remove();
  });

  it('ignores shortcuts in input elements by default (allowInInputs overrides)', async () => {
    const onNext = vi.fn();

    const Comp = defineComponent({
      setup() {
        useKeyboardShortcuts([
          { key: 'n', handler: onNext },
          { key: 'p', handler: onNext, allowInInputs: true },
        ]);
        return () => null;
      },
    });

    const input = document.createElement('input');
    document.body.appendChild(input);

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp(Comp);
    app.mount(mountEl);
    await nextTick();

    input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'n', bubbles: true }));
    expect(onNext).toHaveBeenCalledTimes(0);

    input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'p', bubbles: true }));
    expect(onNext).toHaveBeenCalledTimes(1);

    app.unmount();
    input.remove();
    mountEl.remove();
  });

  it('ignores modifier keys by default (allowModifiers overrides)', async () => {
    const onNext = vi.fn();

    const Comp = defineComponent({
      setup() {
        useKeyboardShortcuts([
          { key: 'n', handler: onNext },
          { key: 'm', handler: onNext, allowModifiers: true },
        ]);
        return () => null;
      },
    });

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp(Comp);
    app.mount(mountEl);
    await nextTick();

    document.body.dispatchEvent(
      new dom.window.KeyboardEvent('keydown', { key: 'n', bubbles: true, ctrlKey: true })
    );
    expect(onNext).toHaveBeenCalledTimes(0);

    document.body.dispatchEvent(
      new dom.window.KeyboardEvent('keydown', { key: 'm', bubbles: true, ctrlKey: true })
    );
    expect(onNext).toHaveBeenCalledTimes(1);

    app.unmount();
    mountEl.remove();
  });

  it('supports reactive enabled toggle', async () => {
    const onNext = vi.fn();
    const enabled = ref(false);

    const Comp = defineComponent({
      setup() {
        useKeyboardShortcuts([{ key: 'n', handler: onNext }], { enabled });
        return () => null;
      },
    });

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp(Comp);
    app.mount(mountEl);
    await nextTick();

    document.body.dispatchEvent(
      new dom.window.KeyboardEvent('keydown', { key: 'n', bubbles: true })
    );
    expect(onNext).toHaveBeenCalledTimes(0);

    enabled.value = true;
    await nextTick();

    document.body.dispatchEvent(
      new dom.window.KeyboardEvent('keydown', { key: 'n', bubbles: true })
    );
    expect(onNext).toHaveBeenCalledTimes(1);

    app.unmount();
    mountEl.remove();
  });
});
