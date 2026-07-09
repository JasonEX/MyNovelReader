import { afterEach, describe, expect, it, vi } from 'vitest';

const { tify } = vi.hoisted(() => ({
  tify: vi.fn((text: string) => `T:${text}`),
}));

vi.mock('chinese-conv', () => ({ tify }));

import { convertHTML, convertText } from '@/core/converter/ChineseConverter';
import { inferChineseScript } from '@/core/converter/scriptProfile';

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

  it('infers Simplified Chinese from page locale metadata', () => {
    const htmlLangDoc = new DOMParser().parseFromString(
      '<!doctype html><html lang="zh-CN"><body>搁这说我坏话是吧</body></html>',
      'text/html'
    );
    const metaDoc = new DOMParser().parseFromString(
      '<!doctype html><html><head><meta http-equiv="Content-Language" content="zh-Hans"></head></html>',
      'text/html'
    );
    const jsonLdDoc = new DOMParser().parseFromString(
      '<!doctype html><html><head><script type="application/ld+json">{"inLanguage":"zh-CN"}</script></head></html>',
      'text/html'
    );

    expect(inferChineseScript(htmlLangDoc)).toBe('hans');
    expect(inferChineseScript(metaDoc)).toBe('hans');
    expect(inferChineseScript(jsonLdDoc)).toBe('hans');
  });

  it('convertText keeps known Simplified source unchanged in sc mode', async () => {
    await expect(convertText('搁这说我坏话是吧', 'sc', { sourceScript: 'hans' })).resolves.toBe(
      '搁这说我坏话是吧'
    );
  });

  it('convertText still converts known Traditional source in sc mode', async () => {
    await expect(convertText('壞話 / 破壞', 'sc', { sourceScript: 'hant' })).resolves.toBe(
      '坏话 / 破坏'
    );
  });

  it('convertText still normalizes Japanese shinjitai source in sc mode', async () => {
    await expect(convertText('壊 / 黒 / 竜', 'sc', { sourceScript: 'jpan' })).resolves.toBe(
      '坏 / 黑 / 龙'
    );
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

  it('convertHTML short-circuits known Simplified source before parsing tags', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const html = '<p>搁这说我坏话是吧</p>';

    await expect(convertHTML(html, 'sc', { sourceScript: 'hans' })).resolves.toBe(html);
    expect(createElementSpy).not.toHaveBeenCalled();
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
