export function $x(aXPath: string, aContext?: Node): Node[] {
  const nodes: Node[] = [];
  const doc = document;
  const context = aContext || doc;

  try {
    const results = doc.evaluate(aXPath, context, null, XPathResult.ANY_TYPE, null);
    let node: Node | null = results.iterateNext();

    while (node) {
      nodes.push(node);
      node = results.iterateNext();
    }
  } catch {
    // ignore invalid XPath expressions
  }

  return nodes;
}
