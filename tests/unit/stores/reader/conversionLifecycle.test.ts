import { beforeEach, expect, it, vi } from 'vitest';
import { createDom } from '../../../testUtils/dom';
import { setupPinia } from '../../../testUtils/pinia';
import { useReaderStore } from '@/ui/stores/reader';

const mocks = vi.hoisted(() => ({ html: vi.fn(), text: vi.fn(), toc: vi.fn() }));
vi.mock('@/core/converter', async importOriginal => ({
  ...(await importOriginal<typeof import('@/core/converter')>()),
  convertHTML: mocks.html,
  convertText: mocks.text,
}));
vi.mock('@/ui/stores/reader/toc', async importOriginal => ({
  ...(await importOriginal<typeof import('@/ui/stores/reader/toc')>()),
  loadTocEntriesPaged: mocks.toc,
}));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.html.mockImplementation(async (html: string) => html);
  mocks.toc.mockResolvedValue([{ title: '目錄', url: 'https://example.com/read/100/201.html' }]);
  setupPinia();
  createDom('https://example.com/read/100/200.html');
  mocks.text.mockImplementation(async (s: string) => s);
});
it('keeps the latest conversion choice when an earlier conversion finishes late', async () => {
  let finish!: (html: string) => void;
  mocks.html.mockReturnValue(
    new Promise<string>(resolve => {
      finish = resolve;
    })
  );
  const store = useReaderStore();
  store.setChapter({
    title: '東風',
    content: '<p>東風</p>',
    rawContent: '<p>東風</p>',
    url: location.href,
    confidence: 1,
    method: 'detection',
  });
  const first = store.applyTextConversion('sc');
  await store.applyTextConversion('none');
  finish('<p>东风</p>');
  await first;
  expect(store.currentConversionMode).toBe('none');
  expect(store.chapter?.content).toBe('<p>東風</p>');
});

it.each(['mode', 'exit'] as const)(
  'ignores stale TOC conversion after %s changes',
  async change => {
    const store = useReaderStore();
    store.setChapter({
      title: '東風',
      content: '<p>東風</p>',
      rawContent: '<p>東風</p>',
      url: location.href,
      indexUrl: 'https://example.com/book/100.html',
      confidence: 1,
      method: 'detection',
    });
    await store.loadToc();
    let finish!: (text: string) => void;
    mocks.text.mockImplementation((text: string) =>
      text === '目錄'
        ? new Promise<string>(resolve => {
            finish = resolve;
          })
        : Promise.resolve(text)
    );
    const run = store.applyTextConversion('sc');
    await vi.waitFor(() => expect(finish).toBeDefined());
    if (change === 'mode') await store.applyTextConversion('none');
    else store.deactivate();
    finish('目录');
    await run;
    expect(store.toc.map(entry => entry.title)).toEqual(change === 'mode' ? ['目錄'] : []);
  }
);
