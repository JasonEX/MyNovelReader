/**
 * Input validation utilities for security
 *
 * Provides validation for user-provided inputs including:
 * - CSS selectors
 * - Custom CSS code
 * - Base64-encoded content
 * - URLs
 *
 * Helps prevent XSS, injection attacks, and DoS vulnerabilities
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Input validator for security-sensitive user inputs
 *
 * @example
 * ```typescript
 * // Validate a CSS selector
 * const result = InputValidator.validateSelector('.content > p');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 *
 * // Validate custom CSS
 * const cssResult = InputValidator.validateCSS('p { color: red; }');
 * ```
 */
export class InputValidator {
  private static readonly MAX_INPUT_LENGTH = 10000;
  private static readonly MAX_CSS_LENGTH = 5000;
  private static readonly MAX_SELECTOR_LENGTH = 1000;
  private static readonly MAX_URL_LENGTH = 2000;

  // Maximum decoded size for Base64 input (1MB)
  private static readonly MAX_BASE64_DECODED_SIZE = 1024 * 1024;

  /**
   * Validate a CSS selector for safety
   *
   * @param selector - The CSS selector to validate
   * @returns Validation result with error message if invalid
   */
  static validateSelector(selector: string): ValidationResult {
    if (!selector) {
      return { valid: false, error: '选择器不能为空' };
    }

    if (selector.length > this.MAX_SELECTOR_LENGTH) {
      return { valid: false, error: '选择器长度超出限制' };
    }

    // Check for dangerous patterns that could lead to XSS or injection
    const dangerousPatterns = [
      /expression\(/i, // CSS expression (IE XSS vector)
      /javascript:/i, // JavaScript protocol
      /vbscript:/i, // VBScript protocol
      /data:/i, // Data protocol
      /@import/i, // CSS import (can inject external content)
      /<script/i, // Script tag
      /<iframe/i, // iframe tag
      /<object/i, // object tag
      /<embed/i, // embed tag
      /eval\(/i, // eval function
      /setTimeout\(/i, // setTimeout with string
      /setInterval\(/i, // setInterval with string
      /new\s+Function/i, // Function constructor
      /document\.write/i, // document.write
      /document\.cookie/i, // Cookie access
      /window\.location/i, // Location manipulation
      /\.innerHTML/i, // innerHTML manipulation
      /\.outerHTML/i, // outerHTML manipulation
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(selector)) {
        return {
          valid: false,
          error: `选择器包含不安全内容: ${pattern.source}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate custom CSS code
   *
   * @param css - The CSS code to validate
   * @returns Validation result with error message if invalid
   */
  static validateCSS(css: string): ValidationResult {
    if (!css) {
      return { valid: false, error: 'CSS不能为空' };
    }

    if (css.length > this.MAX_CSS_LENGTH) {
      return { valid: false, error: `CSS长度超出限制 (最大 ${this.MAX_CSS_LENGTH} 字符)` };
    }

    // Check for dangerous CSS functions and constructs
    const dangerousCSS = [
      /expression\(/i, // IE CSS expression
      /javascript:/i, // JavaScript in CSS
      /vbscript:/i, // VBScript in CSS
      /@import/i, // Import external stylesheets
      /behavior:\s*url/i, // IE behaviors
      /binding:\s*url/i, // HTC behaviors
      /-ms-behavior/i, // IE behaviors
      /@charset/i, // Charset declaration (can be abused)
    ];

    for (const pattern of dangerousCSS) {
      if (pattern.test(css)) {
        return {
          valid: false,
          error: `CSS包含不安全函数: ${pattern.source}`,
        };
      }
    }

    // Check for script tags in CSS
    if (/<script/i.test(css)) {
      return { valid: false, error: 'CSS不能包含脚本标签' };
    }

    return { valid: true };
  }

  /**
   * Validate Base64-encoded input
   *
   * @param input - The Base64 string to validate
   * @returns Validation result with error message if invalid
   */
  static validateBase64Input(input: string): ValidationResult {
    if (!input) {
      return { valid: true }; // Empty input is allowed
    }

    // Base64解码前的长度检查 (防止DoS)
    // Base64解码后大约是原长度的75%
    const estimatedDecodedSize = input.length * 0.75;

    if (estimatedDecodedSize > this.MAX_BASE64_DECODED_SIZE) {
      return {
        valid: false,
        error: `输入数据过大 (最大 ${Math.floor(this.MAX_BASE64_DECODED_SIZE / 1024)}KB)`,
      };
    }

    // Check for valid Base64 format
    // Base64 contains only A-Za-z0-9+/ and ends with 0-2 '=' padding
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(input)) {
      return { valid: false, error: '无效的Base64格式' };
    }

    // Check for suspicious patterns that might indicate injection attempts
    const suspiciousPatterns = [/<script/i, /javascript:/i, /<iframe/i, /<object/i];

    // Try to decode and check the content
    try {
      const decoded = atob(input);

      if (decoded.length > this.MAX_BASE64_DECODED_SIZE) {
        return {
          valid: false,
          error: `解码后数据过大 (最大 ${this.MAX_BASE64_DECODED_SIZE} 字节)`,
        };
      }

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(decoded)) {
          return {
            valid: false,
            error: '解码内容包含不安全代码',
          };
        }
      }
    } catch {
      return { valid: false, error: 'Base64解码失败' };
    }

    return { valid: true };
  }

  /**
   * Validate a URL for safety
   *
   * @param url - The URL to validate
   * @returns Validation result with error message if invalid
   */
  static validateURL(url: string): ValidationResult {
    if (!url) {
      return { valid: false, error: 'URL不能为空' };
    }

    if (url.length > this.MAX_URL_LENGTH) {
      return {
        valid: false,
        error: `URL长度超出限制 (最大 ${this.MAX_URL_LENGTH} 字符)`,
      };
    }

    const trimmed = url.trim().toLowerCase();

    // Block dangerous protocols
    const dangerousProtocols = [
      'javascript:',
      'vbscript:',
      'data:',
      'file:',
      'ftp:',
      'chrome:',
      'chrome-extension:',
      'moz-extension:',
    ];

    for (const protocol of dangerousProtocols) {
      if (trimmed.startsWith(protocol)) {
        return {
          valid: false,
          error: `不允许使用 ${protocol} 协议`,
        };
      }
    }

    // Only allow http, https, and relative URLs
    if (
      !trimmed.startsWith('http://') &&
      !trimmed.startsWith('https://') &&
      !trimmed.startsWith('/') &&
      !trimmed.startsWith('./') &&
      !trimmed.startsWith('../')
    ) {
      return {
        valid: false,
        error: '只允许 HTTP、HTTPS 和相对 URL',
      };
    }

    return { valid: true };
  }

  /**
   * Validate general text input
   *
   * @param input - The text input to validate
   * @param maxLength - Maximum allowed length (defaults to MAX_INPUT_LENGTH)
   * @returns Validation result with error message if invalid
   */
  static validateTextInput(
    input: string,
    maxLength: number = this.MAX_INPUT_LENGTH
  ): ValidationResult {
    if (input === null || input === undefined) {
      return { valid: false, error: '输入不能为空' };
    }

    if (typeof input !== 'string') {
      return { valid: false, error: '输入必须是字符串' };
    }

    if (input.length > maxLength) {
      return {
        valid: false,
        error: `输入长度超出限制 (最大 ${maxLength} 字符)`,
      };
    }

    // Check for script tags
    if (/<script/i.test(input)) {
      return { valid: false, error: '输入不能包含脚本标签' };
    }

    // Check for common XSS patterns
    const xssPatterns = [
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /javascript:/i,
      /onerror\s*=/i,
      /onload\s*=/i,
      /onclick\s*=/i,
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        return {
          valid: false,
          error: '输入包含潜在的XSS代码',
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate a rule object for auto-enable functionality
   *
   * @param rule - The rule object to validate
   * @returns Validation result with error message if invalid
   */
  static validateRule(rule: Record<string, unknown>): ValidationResult {
    if (!rule || typeof rule !== 'object') {
      return { valid: false, error: '规则必须是对象' };
    }

    // Validate rule name
    if (rule.name && typeof rule.name === 'string') {
      const nameValidation = this.validateTextInput(rule.name, 200);
      if (!nameValidation.valid) {
        return nameValidation;
      }
    }

    // Validate CSS selectors in the rule
    const selectorFields = ['content', 'title', 'prev', 'next'];
    for (const field of selectorFields) {
      const selector = rule[field];
      if (selector && typeof selector === 'string') {
        const validation = this.validateSelector(selector);
        if (!validation.valid) {
          return {
            valid: false,
            error: `字段 ${field} 的选择器无效: ${validation.error}`,
          };
        }
      }
    }

    return { valid: true };
  }
}

/**
 * Sanitize a string input by removing potentially dangerous content
 *
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Escape HTML special characters to prevent XSS
 *
 * @param str - The string to escape
 * @returns Escaped string safe for HTML output
 */
export function escapeHtml(str: string): string {
  if (!str) return str;

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, char => htmlEntities[char]);
}
