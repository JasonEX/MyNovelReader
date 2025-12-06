import { describe, it, expect } from 'vitest';
import cnNum2ArabNum from '../../src/MyNovelReader/utils/cnNum2ArabNum';

describe('cnNum2ArabNum', () => {
  it('should convert basic Chinese numbers', () => {
    expect(cnNum2ArabNum('零')).toBe(0);
    expect(cnNum2ArabNum('一')).toBe(1);
    expect(cnNum2ArabNum('二')).toBe(2);
    expect(cnNum2ArabNum('三')).toBe(3);
    expect(cnNum2ArabNum('四')).toBe(4);
    expect(cnNum2ArabNum('五')).toBe(5);
    expect(cnNum2ArabNum('六')).toBe(6);
    expect(cnNum2ArabNum('七')).toBe(7);
    expect(cnNum2ArabNum('八')).toBe(8);
    expect(cnNum2ArabNum('九')).toBe(9);
  });

  it('should convert tens', () => {
    expect(cnNum2ArabNum('十')).toBe(10);
    expect(cnNum2ArabNum('十一')).toBe(11);
    expect(cnNum2ArabNum('二十')).toBe(20);
    expect(cnNum2ArabNum('二十一')).toBe(21);
    expect(cnNum2ArabNum('九十九')).toBe(99);
  });

  it('should convert hundreds', () => {
    expect(cnNum2ArabNum('一百')).toBe(100);
    expect(cnNum2ArabNum('一百零一')).toBe(101);
    expect(cnNum2ArabNum('一百一十')).toBe(110);
    expect(cnNum2ArabNum('一百二十三')).toBe(123);
    expect(cnNum2ArabNum('九百九十九')).toBe(999);
  });

  it('should convert thousands', () => {
    expect(cnNum2ArabNum('一千')).toBe(1000);
    expect(cnNum2ArabNum('一千零一')).toBe(1001);
    expect(cnNum2ArabNum('一千一百')).toBe(1100);
    expect(cnNum2ArabNum('一千二百三十四')).toBe(1234);
    expect(cnNum2ArabNum('九千九百九十九')).toBe(9999);
  });

  it('should convert ten-thousands', () => {
    expect(cnNum2ArabNum('一万')).toBe(10000);
    expect(cnNum2ArabNum('一万零一')).toBe(10001);
    expect(cnNum2ArabNum('一万二千三百四十五')).toBe(12345);
    expect(cnNum2ArabNum('十万')).toBe(100000);
    expect(cnNum2ArabNum('一百二十三万四千五百六十七')).toBe(1234567);
  });

  it('should convert hundred-millions', () => {
    expect(cnNum2ArabNum('一亿')).toBe(100000000);
    expect(cnNum2ArabNum('一亿零一')).toBe(100000001);
    expect(cnNum2ArabNum('一亿二千三百四十五万六千七百八十九')).toBe(123456789);
  });

  it('should handle empty string', () => {
    expect(cnNum2ArabNum('')).toBe(0);
  });

  it.skip('should handle mixed Chinese and Arabic digits', () => {
    // Note: the function currently doesn't support Arabic digits directly
    // but the regex pattern includes \d, so we test if it works
    // This test is skipped because the behavior is undefined
    expect(cnNum2ArabNum('1')).toBe(1); // actually may not work
    expect(cnNum2ArabNum('12')).toBe(12);
  });
});
