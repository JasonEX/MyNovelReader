import { afterEach, describe, expect, it, vi } from 'vitest';

const { tify } = vi.hoisted(() => ({
  tify: vi.fn((text: string) => `T:${text}`),
}));

vi.mock('chinese-conv', () => ({ tify }));

import { convertHTML, convertText } from '@/core/converter/ChineseConverter';

describe('ChineseConverter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    tify.mockClear();
  });

  it('convertText returns input for mode none / empty', async () => {
    await expect(convertText('abc', 'none')).resolves.toBe('abc');
    await expect(convertText('', 'sc')).resolves.toBe('');
  });

  it('convertText converts Simplified -> Traditional using tify', async () => {
    await expect(convertText('漢字', 'tc')).resolves.toBe('T:漢字');
    expect(tify).toHaveBeenCalledTimes(1);
  });

  it('convertText converts Traditional, variants and Japanese shinjitai to Simplified', async () => {
    await expect(convertText('臺灣小説網 言情小說 説明', 'sc')).resolves.toBe(
      '台湾小说网 言情小说 说明'
    );
    await expect(convertText('黒 歩 壊 竜 亜 広', 'sc')).resolves.toBe('黑 步 坏 龙 亚 广');
  });

  it('convertText avoids Japanese-mode false positives on common Traditional words', async () => {
    await expect(convertText('連忙 連接 連續 聯盟 聯手', 'sc')).resolves.toBe(
      '连忙 连接 连续 联盟 联手'
    );
  });

  it('convertText preserves semantic Traditional words while normalizing aspect 著', async () => {
    await expect(convertText('著作 原著 著名 看著 挥动著 乾坤 乾涸', 'sc')).resolves.toBe(
      '著作 原著 著名 看着 挥动着 乾坤 干涸'
    );
  });

  it('convertText returns original text on converter error', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    tify.mockImplementationOnce(() => {
      throw new Error('boom');
    });

    await expect(convertText('x', 'tc')).resolves.toBe('x');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('convertHTML converts only text nodes and preserves tags', async () => {
    const html = '<p>臺灣小説網 <strong>看著乾涸</strong></p><img src="/a.png" alt="x" />';
    const result = await convertHTML(html, 'sc');

    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('src="/a.png"');
    expect(result).toContain('台湾小说网');
    expect(result).toContain('看着干涸');
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
