import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpRequest } from '../../src/MyNovelReader/request/HttpRequest';
import { RequestStatus } from '../../src/MyNovelReader/request/constants';

const parseHTMLMock = vi.hoisted(() => vi.fn());
const logger = vi.hoisted(() => ({ error: vi.fn() }));

vi.mock('../../src/MyNovelReader/lib', () => ({
  parseHTML: parseHTMLMock,
  C: logger,
}));

const createHttpService = () => ({ request: vi.fn() });

beforeEach(() => {
  parseHTMLMock.mockReset();
  logger.error.mockReset();
});

describe('HttpRequest', () => {
  it('transitions to finish on successful request', async () => {
    const doc = document.implementation.createHTMLDocument('ok');
    parseHTMLMock.mockReturnValue(doc);
    const httpService = createHttpService();
    httpService.request.mockResolvedValue({ responseText: '<html>ok</html>' });

    const request = new HttpRequest({} as never, httpService as never);
    const finishHandle = vi.fn();
    request.setFinishHandle(finishHandle);

    const promise = request.send('https://example.com');
    expect(request.status).toBe(RequestStatus.Loading);

    const result = await promise;

    expect(httpService.request).toHaveBeenCalledTimes(1);
    expect(request.status).toBe(RequestStatus.Finish);
    expect(result).toBe(doc);
    expect(finishHandle).toHaveBeenCalled();
  });

  it('fails after 3 retries and invokes error handler', async () => {
    const httpService = createHttpService();
    httpService.request.mockRejectedValue(new Error('fail'));

    const request = new HttpRequest({} as never, httpService as never);
    const errorHandle = vi.fn();
    request.setErrorHandle(errorHandle);

    const result = await request.send('https://example.com');

    expect(httpService.request).toHaveBeenCalledTimes(3);
    expect(request.status).toBe(RequestStatus.Fail);
    expect(result).toBeNull();
    expect(errorHandle).toHaveBeenCalled();
  });

  it('resets status to idle after getDocument', async () => {
    const doc = document.implementation.createHTMLDocument('ok');
    parseHTMLMock.mockReturnValue(doc);
    const httpService = createHttpService();
    httpService.request.mockResolvedValue({ responseText: '<html>ok</html>' });

    const request = new HttpRequest({} as never, httpService as never);

    await request.send('https://example.com');
    const returned = request.getDocument();

    expect(returned).toBe(doc);
    expect(request.status).toBe(RequestStatus.Idle);
  });
});
