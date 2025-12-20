/**
 * Unit tests for URL utilities
 */

import { describe, expect, it } from 'vitest';
import { normalizeCiwemaoChapterUrl } from '@/core/utils/urlUtils';

describe('normalizeCiwemaoChapterUrl', () => {
  it('should rewrite get_par_tsu_list to chapter URL', () => {
    const input =
      'https://wap.ciweimao.com/chapter/get_par_tsu_list?chapter_id=113493242&data-pgid=0';
    const output = normalizeCiwemaoChapterUrl(input);
    expect(output).toBe('https://wap.ciweimao.com/chapter/113493242');
  });

  it('should keep original URL when not a ciweimao tsukkomi page', () => {
    const input = 'https://wap.ciweimao.com/chapter/113493242';
    expect(normalizeCiwemaoChapterUrl(input)).toBe(input);
  });

  it('should keep original URL when chapter_id is missing', () => {
    const input = 'https://wap.ciweimao.com/chapter/get_par_tsu_list?data-pgid=0';
    expect(normalizeCiwemaoChapterUrl(input)).toBe(input);
  });
});
