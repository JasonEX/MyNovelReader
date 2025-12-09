/**
 * Chinese Simplified/Traditional Converter
 * Uses opencc-js for accurate conversion
 * Dynamically loads the library from CDN to minimize bundle size
 */

export type ConversionMode = 'none' | 'sc' | 'tc';

// OpenCC converter type
interface OpenCCConverter {
  (text: string): string;
}

interface OpenCCModule {
  Converter: (options: { from: string; to: string }) => OpenCCConverter;
}

// Cached converters
let openccModule: OpenCCModule | null = null;
let toSimplifiedConverter: OpenCCConverter | null = null;
let toTraditionalConverter: OpenCCConverter | null = null;

// Loading state
let isLoading = false;
let loadPromise: Promise<void> | null = null;

// CDN URL for opencc-js
const OPENCC_CDN = 'https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js';

/**
 * Load opencc-js library from CDN
 */
async function loadOpenCC(): Promise<void> {
  if (openccModule) return;
  if (loadPromise) return loadPromise;

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as unknown as { OpenCC?: OpenCCModule }).OpenCC) {
      openccModule = (window as unknown as { OpenCC: OpenCCModule }).OpenCC;
      isLoading = false;
      resolve();
      return;
    }

    // Load from CDN
    const script = document.createElement('script');
    script.src = OPENCC_CDN;
    script.async = true;

    script.onload = () => {
      openccModule = (window as unknown as { OpenCC: OpenCCModule }).OpenCC;
      if (openccModule) {
        resolve();
      } else {
        reject(new Error('OpenCC module not found after loading'));
      }
      isLoading = false;
    };

    script.onerror = () => {
      console.error('[ChineseConverter] Failed to load OpenCC from CDN');
      isLoading = false;
      reject(new Error('Failed to load OpenCC'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Get or create converter for the specified mode
 */
async function getConverter(mode: ConversionMode): Promise<OpenCCConverter | null> {
  if (mode === 'none') return null;

  await loadOpenCC();

  if (!openccModule) {
    console.error('[ChineseConverter] OpenCC not available');
    return null;
  }

  if (mode === 'sc') {
    if (!toSimplifiedConverter) {
      // Traditional to Simplified (Taiwan standard to Simplified)
      toSimplifiedConverter = openccModule.Converter({ from: 'tw', to: 'cn' });
    }
    return toSimplifiedConverter;
  }

  if (mode === 'tc') {
    if (!toTraditionalConverter) {
      // Simplified to Traditional (Simplified to Taiwan standard)
      toTraditionalConverter = openccModule.Converter({ from: 'cn', to: 'tw' });
    }
    return toTraditionalConverter;
  }

  return null;
}

/**
 * Convert text based on the specified mode
 */
export async function convertText(text: string, mode: ConversionMode): Promise<string> {
  if (mode === 'none' || !text) {
    return text;
  }

  try {
    const converter = await getConverter(mode);
    if (converter) {
      return converter(text);
    }
  } catch (error) {
    console.error('[ChineseConverter] Conversion error:', error);
  }

  return text;
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
    const converter = await getConverter(mode);
    if (!converter) return html;

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

/**
 * Check if the converter is ready (library loaded)
 */
export function isConverterReady(): boolean {
  return openccModule !== null;
}

/**
 * Check if the converter is currently loading
 */
export function isConverterLoading(): boolean {
  return isLoading;
}

/**
 * Preload the converter library
 */
export async function preloadConverter(): Promise<void> {
  try {
    await loadOpenCC();
  } catch {
    // Ignore preload errors
  }
}

export default {
  convertText,
  convertHTML,
  isConverterReady,
  isConverterLoading,
  preloadConverter,
};
