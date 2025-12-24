import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/utils/network', () => ({
  fetchAndParseUrl: vi.fn(),
}));

import { fetchAndParseUrl } from '@/core/utils/network';
import { ParallelLoader } from '../../src/core/optimization/ParallelLoader';

describe('ParallelLoader (signal abort)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should abort the underlying request when signal aborts', async () => {
    const abort = vi.fn();
    vi.mocked(fetchAndParseUrl).mockReturnValue({
      promise: new Promise(() => {}),
      abort,
    });

    const controller = new AbortController();
    const loader = new ParallelLoader();

    const loadPromise = loader.loadChapters(['url1'], {
      maxConcurrent: 1,
      minDelay: 0,
      maxDelay: 0,
      retries: 0,
      timeout: 10000,
      signal: controller.signal,
    });

    await vi.advanceTimersByTimeAsync(1);
    controller.abort();
    await vi.advanceTimersByTimeAsync(1);

    const results = await loadPromise;

    expect(results).toHaveLength(1);
    expect(results[0].success).toBe(false);
    expect(results[0].error).toBe('Request aborted');
    expect(abort).toHaveBeenCalledTimes(1);
  });
});
