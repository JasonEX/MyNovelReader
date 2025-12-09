import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IframeRequest } from '../../src/MyNovelReader/request/IframeRequest';
import { RequestStatus } from '../../src/MyNovelReader/request/constants';

const sleepMock = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const observeElementMock = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const logger = vi.hoisted(() => ({ error: vi.fn() }));

vi.mock('../../src/MyNovelReader/Setting', () => ({
  default: { preloadNextPage: false },
}));

vi.mock('../../src/MyNovelReader/lib', () => ({
  sleep: sleepMock,
  C: logger,
}));

vi.mock('../../src/MyNovelReader/libdom', () => ({
  observeElement: observeElementMock,
}));

const createIframeStub = () => {
  const iframe: any = {
    style: { display: 'none' },
    setAttribute: vi.fn((key: string, value: string) => {
      (iframe as any)[key] = value;
    }),
    contentDocument: null as Document | null,
    contentWindow: null as Window | null,
  };
  return iframe as HTMLIFrameElement;
};

const createWindowStub = () =>
  ({
    dispatchEvent: vi.fn(),
    scrollTo: vi.fn(),
    innerHeight: 600,
  }) as unknown as Window;

beforeEach(() => {
  sleepMock.mockClear();
  observeElementMock.mockClear();
  logger.error.mockClear();
  (globalThis as any)._ = { isUndefined: (val: unknown) => val === undefined };
  (globalThis as any).WheelEvent = class FakeWheelEvent extends Event {
    deltaY: number;
    constructor(type: string, init?: { deltaY?: number }) {
      super(type);
      this.deltaY = init?.deltaY ?? 0;
    }
  } as unknown as typeof WheelEvent;
});

describe('IframeRequest', () => {
  it('transitions to finish when iframe loads successfully', async () => {
    const request = new IframeRequest({} as never);
    (request as any).iframe = createIframeStub();
    const iframe = (request as any).iframe as any;
    const doc = document.implementation.createHTMLDocument('iframe');
    iframe.contentDocument = doc;
    iframe.contentWindow = createWindowStub();
    const finishHandle = vi.fn();
    request.setFinishHandle(finishHandle);

    const promise = request.send('https://example.com/page');
    expect(request.status).toBe(RequestStatus.Loading);

    await (request as any).loaded();
    const result = await promise;

    expect(request.status).toBe(RequestStatus.Finish);
    expect(result).toBe(doc);
    expect(finishHandle).toHaveBeenCalled();
  });

  it('enters fail status when iframe document is missing', async () => {
    const request = new IframeRequest({} as never);
    (request as any).iframe = createIframeStub();
    const iframe = (request as any).iframe as any;
    iframe.contentDocument = null;
    iframe.contentWindow = null;
    const errorHandle = vi.fn();
    request.setErrorHandle(errorHandle);

    const promise = request.send('https://example.com/page');

    await (request as any).loaded();
    const result = await promise;

    expect(request.status).toBe(RequestStatus.Fail);
    expect(result).toBeNull();
    expect(errorHandle).toHaveBeenCalled();
  });

  it('resets status to idle after getDocument', async () => {
    const request = new IframeRequest({} as never);
    (request as any).iframe = createIframeStub();
    const iframe = (request as any).iframe as any;
    const doc = document.implementation.createHTMLDocument('ready');
    iframe.contentDocument = doc;
    iframe.contentWindow = createWindowStub();

    const promise = request.send('https://example.com/reset');

    await (request as any).loaded();
    await promise;

    const returned = request.getDocument();

    expect(returned).toBe(doc);
    expect(request.status).toBe(RequestStatus.Idle);
  });

  it('display getter reflects iframe visibility', () => {
    const request = new IframeRequest({} as never);
    (request as any).iframe = createIframeStub();
    const iframe = (request as any).iframe as any;

    iframe.style.display = 'none';
    expect(request.display).toBe(false);

    request.show();
    expect(request.display).toBe(true);

    request.hide();
    expect(request.display).toBe(false);
  });
});
