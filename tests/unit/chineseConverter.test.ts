import { afterEach, describe, expect, it, vi } from 'vitest';

const { sify, tify } = vi.hoisted(() => ({
  sify: vi.fn((text: string) => `S:${text}`),
  tify: vi.fn((text: string) => `T:${text}`),
}));

vi.mock('chinese-conv', () => ({ sify, tify }));

import { convertHTML, convertText } from '@/core/converter/ChineseConverter';

describe('ChineseConverter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    sify.mockClear();
    tify.mockClear();
  });

  it('convertText returns input for mode none / empty', async () => {
    await expect(convertText('abc', 'none')).resolves.toBe('abc');
    await expect(convertText('', 'sc')).resolves.toBe('');
  });

  it('convertText converts using sify/tify', async () => {
    await expect(convertText('汉字', 'sc')).resolves.toBe('S:汉字');
    await expect(convertText('漢字', 'tc')).resolves.toBe('T:漢字');
    expect(sify).toHaveBeenCalledTimes(1);
    expect(tify).toHaveBeenCalledTimes(1);
  });

  it('convertText returns original text on converter error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    sify.mockImplementationOnce(() => {
      throw new Error('boom');
    });

    await expect(convertText('x', 'sc')).resolves.toBe('x');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('convertHTML converts only text nodes and preserves tags', async () => {
    const html = '<p>你好 <strong>世界</strong></p><img src="/a.png" alt="x" />';
    const result = await convertHTML(html, 'sc');

    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('src="/a.png"');
    expect(result).toContain('S:你好');
    expect(result).toContain('S:世界');
  });

  it('convertHTML returns input for mode none / empty', async () => {
    await expect(convertHTML('<p>x</p>', 'none')).resolves.toBe('<p>x</p>');
    await expect(convertHTML('', 'sc')).resolves.toBe('');
  });

  it('convertHTML returns original html on converter error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    tify.mockImplementationOnce(() => {
      throw new Error('boom');
    });

    const html = '<p>測試</p>';
    await expect(convertHTML(html, 'tc')).resolves.toBe(html);
    expect(errorSpy).toHaveBeenCalled();
  });
});
