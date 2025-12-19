/**
 * Chinese Simplified/Traditional Converter
 * Minimal, dependency-light implementation for UserScript
 * Uses character-level maps from chinese-conv (MIT, ~270 KB bundled)
 */

import { sify, tify } from 'chinese-conv';

export type ConversionMode = 'none' | 'sc' | 'tc';

/**
 * Convert plain text between Simplified/Traditional
 */
export async function convertText(text: string, mode: ConversionMode): Promise<string> {
  if (mode === 'none' || !text) {
    return text;
  }

  try {
    const converter = mode === 'sc' ? sify : tify;
    return converter(text);
  } catch (error) {
    console.error('[ChineseConverter] Text conversion error:', error);
    return text;
  }
}

/**
 * Convert HTML content while preserving tags
 * This converts only text nodes, keeping HTML structure intact
 */
export async function convertHTML(html: string, mode: ConversionMode): Promise<string> {
  if (mode === 'none' || !html) {
    return html;
  }

  try {
    const converter = mode === 'sc' ? sify : tify;

    // Parse HTML and convert text nodes only
    const template = document.createElement('template');
    template.innerHTML = html;

    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT, null);

    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      textNodes.push(node);
    }

    // Convert all text nodes
    for (const textNode of textNodes) {
      if (textNode.textContent) {
        textNode.textContent = converter(textNode.textContent);
      }
    }

    return template.innerHTML;
  } catch (error) {
    console.error('[ChineseConverter] HTML conversion error:', error);
    return html;
  }
}

export default {
  convertHTML,
};
