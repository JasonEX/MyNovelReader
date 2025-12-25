import { afterEach, describe, expect, it, vi } from 'vitest';

import { cssEscape } from '@/core/utils/cssEscape';

describe('cssEscape', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back when CSS.escape is missing', () => {
    vi.stubGlobal('CSS', undefined);
    expect(cssEscape('foo:bar')).toBe('foo\\:bar');
  });

  it('delegates to native CSS.escape when available', () => {
    const escape = vi.fn((value: string) => `ESC:${value}`);
    vi.stubGlobal('CSS', { escape });

    expect(cssEscape('a:b')).toBe('ESC:a:b');
    expect(escape).toHaveBeenCalledWith('a:b');
  });
});
