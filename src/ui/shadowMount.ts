/**
 * Shadow DOM Mount Utilities
 *
 * Provides CSS isolation for Vue components by mounting them inside Shadow DOM.
 * This prevents host page CSS from interfering with our UI components.
 */

declare global {
  interface Window {
    __MNR_STYLES__?: string;
    __MNR_SHADOW_ROOT__?: ShadowRoot;
  }
}

interface ShadowMountResult {
  host: HTMLElement;
  shadowRoot: ShadowRoot;
  mountPoint: HTMLElement;
  cleanup: () => void;
}

/**
 * Base CSS reset for Shadow DOM container
 * Ensures our components start from a clean slate
 */
const BASE_RESET_CSS = `
/* Reset all inherited styles */
:host {
  all: initial;
  display: block;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure common elements have expected defaults */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Reset form elements to browser defaults */
input, button, select, textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
}

input[type="checkbox"],
input[type="radio"] {
  appearance: auto;
  -webkit-appearance: checkbox;
  width: auto;
  height: auto;
  margin: 3px 3px 3px 4px;
  cursor: pointer;
}

input[type="range"] {
  appearance: auto;
  -webkit-appearance: slider-horizontal;
}

button {
  appearance: auto;
  cursor: pointer;
}

select {
  appearance: auto;
  -webkit-appearance: menulist;
}

textarea {
  appearance: auto;
  -webkit-appearance: textarea;
  resize: vertical;
}

/* Link defaults */
a {
  color: #1976d2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* List defaults */
ul, ol {
  padding-left: 2em;
}

/* Ensure visibility */
* {
  visibility: visible !important;
}
`;

/**
 * Create a Shadow DOM mount point for Vue components
 *
 * @param hostId - ID for the host element
 * @returns Shadow mount result with host, shadowRoot, mountPoint, and cleanup function
 */
export function createShadowMount(hostId: string): ShadowMountResult {
  // Create host element
  const host = document.createElement('div');
  host.id = hostId;
  document.body.appendChild(host);

  // Create Shadow DOM
  const shadowRoot = host.attachShadow({ mode: 'open' });

  // Store shadow root globally for CSS injection
  window.__MNR_SHADOW_ROOT__ = shadowRoot;

  // Create style element with reset CSS
  const resetStyle = document.createElement('style');
  resetStyle.textContent = BASE_RESET_CSS;
  shadowRoot.appendChild(resetStyle);

  // Inject any previously collected CSS
  if (window.__MNR_STYLES__) {
    const appStyle = document.createElement('style');
    appStyle.textContent = window.__MNR_STYLES__;
    shadowRoot.appendChild(appStyle);
  }

  // Create mount point inside Shadow DOM
  const mountPoint = document.createElement('div');
  mountPoint.id = `${hostId}-mount`;
  shadowRoot.appendChild(mountPoint);

  // Cleanup function
  const cleanup = () => {
    host.remove();
    if (window.__MNR_SHADOW_ROOT__ === shadowRoot) {
      window.__MNR_SHADOW_ROOT__ = undefined;
    }
  };

  return { host, shadowRoot, mountPoint, cleanup };
}

/**
 * Inject additional CSS into the Shadow DOM
 *
 * @param shadowRoot - Target Shadow DOM
 * @param css - CSS string to inject
 */
export function injectShadowCSS(shadowRoot: ShadowRoot, css: string): void {
  const style = document.createElement('style');
  style.textContent = css;
  shadowRoot.appendChild(style);
}
