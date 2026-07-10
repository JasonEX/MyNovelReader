import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, nextTick, ref } from 'vue';
import { JSDOM } from 'jsdom';

import { useEventListener } from '@/ui/composables/useEventListener';

describe('useEventListener', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.com/',
      pretendToBeVisual: true,
    });

    // @ts-expect-error - test env: assigning jsdom window to globalThis
    globalThis.window = dom.window;
    // test env: assigning jsdom document to globalThis
    globalThis.document = dom.window.document;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('attaches listener on mount and removes it on unmount', async () => {
    const onClick = vi.fn();

    const Comp = defineComponent({
      setup() {
        useEventListener('click', onClick);
        return () => null;
      },
    });

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp(Comp);
    app.mount(mountEl);
    await nextTick();

    window.dispatchEvent(new dom.window.Event('click'));
    expect(onClick).toHaveBeenCalledTimes(1);

    app.unmount();
    window.dispatchEvent(new dom.window.Event('click'));
    expect(onClick).toHaveBeenCalledTimes(1);

    mountEl.remove();
  });

  it('moves listener when target ref changes', async () => {
    const onCustom = vi.fn();
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    const target = ref<EventTarget | undefined>(el1);

    const Comp = defineComponent({
      setup() {
        useEventListener('custom', onCustom, { target });
        return () => null;
      },
    });

    const mountEl = document.createElement('div');
    document.body.appendChild(mountEl);
    const app = createApp(Comp);
    app.mount(mountEl);
    await nextTick();

    el1.dispatchEvent(new dom.window.Event('custom'));
    expect(onCustom).toHaveBeenCalledTimes(1);

    target.value = el2;
    await nextTick();

    el1.dispatchEvent(new dom.window.Event('custom'));
    el2.dispatchEvent(new dom.window.Event('custom'));
    expect(onCustom).toHaveBeenCalledTimes(2);

    app.unmount();
    el2.dispatchEvent(new dom.window.Event('custom'));
    expect(onCustom).toHaveBeenCalledTimes(2);

    mountEl.remove();
    el1.remove();
    el2.remove();
  });
});
