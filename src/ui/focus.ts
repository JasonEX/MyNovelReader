export function getDeepActiveElement(): globalThis.HTMLElement | null {
  let active: globalThis.Element | null = document.activeElement;

  while (active instanceof window.HTMLElement && active.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }

  return active instanceof window.HTMLElement ? active : null;
}
