// HTML string parsing utilities

export function parseHTML(str: string): Document {
  let doc: Document | null = null;

  try {
    doc = new DOMParser().parseFromString(str, 'text/html');
  } catch {
    // ignore malformed HTML and fall back
  }

  if (!doc) {
    doc = document.implementation.createHTMLDocument('');
    const html = doc.querySelector('html');
    if (html) {
      html.innerHTML = str;
    }
  }

  return doc;
}

// Remove wrapper tags while keeping children
export function unwrapTag(doc: Document, tagName: string): void {
  const tags = doc.getElementsByTagName(tagName);

  while (tags.length) {
    const tag = tags[0];
    const parent = tag.parentNode;

    if (!parent) {
      tag.remove();
      continue;
    }

    while (tag.firstChild) {
      parent.insertBefore(tag.firstChild, tag);
    }

    parent.removeChild(tag);
  }

  doc.normalize();
}

// Collect all text nodes under a node
export function getTextNodesIn(node: Node, includeWhitespaceNodes = false): Text[] {
  const textNodes: Text[] = [];
  const nonWhitespaceMatcher = /\S/;

  const collectTextNodes = (current: Node): void => {
    if (current.nodeType === Node.TEXT_NODE) {
      if (includeWhitespaceNodes || nonWhitespaceMatcher.test(current.nodeValue ?? '')) {
        textNodes.push(current as Text);
      }
      return;
    }

    for (let i = 0; i < current.childNodes.length; i += 1) {
      collectTextNodes(current.childNodes[i]);
    }
  };

  node.normalize();
  collectTextNodes(node);

  return textNodes;
}
