/**
 * Unit tests for InputValidator
 */

import { describe, expect, it } from 'vitest';
import { InputValidator, sanitizeInput } from '@/core/validation/InputValidator';

describe('InputValidator', () => {
  describe('validateSelector', () => {
    it('should accept valid CSS selectors', () => {
      const result = InputValidator.validateSelector('.content > p');
      expect(result.valid).toBe(true);
    });

    it('should reject selectors with dangerous patterns', () => {
      // Use patterns that are actually checked
      const result = InputValidator.validateSelector('div[onclick="eval(1)"]');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject selectors with javascript: protocol', () => {
      const result = InputValidator.validateSelector('a[href="javascript:alert(1)"]');
      expect(result.valid).toBe(false);
    });

    it('should reject overly long selectors', () => {
      const longSelector = 'a'.repeat(2000);
      const result = InputValidator.validateSelector(longSelector);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('超出限制');
    });

    it('should reject empty selectors', () => {
      const result = InputValidator.validateSelector('');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateCSS', () => {
    it('should accept valid CSS', () => {
      const result = InputValidator.validateCSS('p { color: red; }');
      expect(result.valid).toBe(true);
    });

    it('should reject CSS with expression()', () => {
      const result = InputValidator.validateCSS('div { width: expression(alert(1)); }');
      expect(result.valid).toBe(false);
    });

    it('should reject CSS with @import', () => {
      const result = InputValidator.validateCSS('@import url("evil.css");');
      expect(result.valid).toBe(false);
    });

    it('should reject overly long CSS', () => {
      // Create CSS that exceeds MAX_CSS_LENGTH (5000)
      const longCSS = 'p { color: red; }'.repeat(200);
      const result = InputValidator.validateCSS(longCSS);
      // The CSS is 18 chars * 200 = 3600 chars, which might not exceed limit
      // Let's verify the actual behavior
      if (longCSS.length > 5000) {
        expect(result.valid).toBe(false);
      } else {
        // If it's not over limit, test with even longer CSS
        const hugeCSS = 'p { color: red; }'.repeat(500);
        const result2 = InputValidator.validateCSS(hugeCSS);
        expect(result2.valid).toBe(false);
      }
    });
  });

  describe('validateBase64Input', () => {
    it('should accept valid Base64', () => {
      const result = InputValidator.validateBase64Input('SGVsbG8gV29ybGQ=');
      expect(result.valid).toBe(true);
    });

    it('should reject overly large Base64 input', () => {
      const hugeBase64 = 'a'.repeat(2_000_000); // Simulates large input
      const result = InputValidator.validateBase64Input(hugeBase64);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('过大');
    });

    it('should reject invalid Base64 format', () => {
      const result = InputValidator.validateBase64Input('not@base64!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('格式');
    });
  });

  describe('validateURL', () => {
    it('should accept valid HTTP URLs', () => {
      const result = InputValidator.validateURL('https://example.com/chapter/1');
      expect(result.valid).toBe(true);
    });

    it('should accept relative URLs', () => {
      const result = InputValidator.validateURL('/chapter/2');
      expect(result.valid).toBe(true);
    });

    it('should reject javascript: URLs', () => {
      const result = InputValidator.validateURL('javascript:alert(1)');
      expect(result.valid).toBe(false);
    });

    it('should reject data: URLs', () => {
      const result = InputValidator.validateURL('data:text/html,<script>alert(1)</script>');
      expect(result.valid).toBe(false);
    });

    it('should reject overly long URLs', () => {
      const longURL = `https://example.com/${'a'.repeat(3000)}`;
      const result = InputValidator.validateURL(longURL);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateTextInput', () => {
    it('should accept valid text', () => {
      const result = InputValidator.validateTextInput('Hello World');
      expect(result.valid).toBe(true);
    });

    it('should reject text with script tags', () => {
      const result = InputValidator.validateTextInput('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
    });

    it('should reject text with iframe tags', () => {
      const result = InputValidator.validateTextInput('<iframe src="evil.com"></iframe>');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert(1)</script>';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
    });

    it('should remove javascript: protocol', () => {
      const input = 'Click javascript:alert(1) here';
      const result = sanitizeInput(input);
      expect(result).not.toContain('javascript:');
    });
  });
});
