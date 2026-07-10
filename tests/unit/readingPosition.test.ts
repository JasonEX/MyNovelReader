import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('readingPosition', () => {
  beforeEach(() => {
    vi.resetModules();
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'https://example.com/',
    });
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.localStorage = dom.window.localStorage;
    vi.stubGlobal('GM_getValue', undefined);
    vi.stubGlobal('GM_setValue', undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns null when no position has been saved', async () => {
    const { getReadingPosition } = await import('@/ui/stores/reader/readingPosition');
    await expect(getReadingPosition('https://example.com/chapter/1')).resolves.toBeNull();
  });

  it('saves a normalized, clamped chapter position', async () => {
    const { flushReadingPositions, getReadingPosition, saveReadingPosition } =
      await import('@/ui/stores/reader/readingPosition');

    saveReadingPosition('https://example.com/chapter/1#paragraph', 120);
    await flushReadingPositions();
    await vi.waitFor(async () => {
      await expect(getReadingPosition('https://example.com/chapter/1')).resolves.toBe(100);
    });
  });

  it('rounds the persisted percentage without losing useful precision', async () => {
    const { flushReadingPositions, getReadingPosition, saveReadingPosition } =
      await import('@/ui/stores/reader/readingPosition');

    saveReadingPosition('https://example.com/chapter/2', 37.456);
    await flushReadingPositions();
    await vi.waitFor(async () => {
      await expect(getReadingPosition('https://example.com/chapter/2')).resolves.toBe(37.5);
    });
  });

  it('uses GM storage when the userscript APIs are available', async () => {
    vi.resetModules();
    const gmSetValue = vi.fn();
    vi.stubGlobal(
      'GM_getValue',
      vi.fn(() =>
        JSON.stringify({
          'https://example.com/chapter/4': { percent: 42, updatedAt: 1 },
        })
      )
    );
    vi.stubGlobal('GM_setValue', gmSetValue);
    const { flushReadingPositions, getReadingPosition, saveReadingPosition } =
      await import('@/ui/stores/reader/readingPosition');

    await expect(getReadingPosition('https://example.com/chapter/4')).resolves.toBe(42);
    saveReadingPosition('not a valid URL', 12);
    await flushReadingPositions();
    expect(gmSetValue).toHaveBeenCalledTimes(1);
  });

  it('ignores invalid saves and recovers from malformed storage', async () => {
    localStorage.setItem('mnr-reading-positions', '{bad json');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { getReadingPosition, saveReadingPosition } =
      await import('@/ui/stores/reader/readingPosition');

    saveReadingPosition('', 20);
    saveReadingPosition('https://example.com/chapter/3', Number.NaN);
    await expect(getReadingPosition('https://example.com/chapter/3')).resolves.toBeNull();
    expect(error).toHaveBeenCalled();
  });

  it('keeps the saved-position index bounded', async () => {
    const { flushReadingPositions, saveReadingPosition } =
      await import('@/ui/stores/reader/readingPosition');
    for (let index = 0; index < 205; index++) {
      saveReadingPosition(`https://example.com/chapter/${index}`, index % 100);
    }
    await flushReadingPositions();

    const stored = JSON.parse(localStorage.getItem('mnr-reading-positions') || '{}');
    expect(Object.keys(stored)).toHaveLength(200);
  });

  it('coalesces multiple position updates into one persisted snapshot', async () => {
    const gmSetValue = vi.fn();
    vi.stubGlobal(
      'GM_getValue',
      vi.fn(() => null)
    );
    vi.stubGlobal('GM_setValue', gmSetValue);
    const { flushReadingPositions, saveReadingPosition } =
      await import('@/ui/stores/reader/readingPosition');

    for (let percent = 1; percent <= 20; percent++) {
      saveReadingPosition('https://example.com/chapter/5', percent);
    }
    await flushReadingPositions();

    expect(gmSetValue).toHaveBeenCalledTimes(1);
    expect(gmSetValue).toHaveBeenCalledWith(
      'mnr-reading-positions',
      expect.stringContaining('"percent":20')
    );
  });
});
