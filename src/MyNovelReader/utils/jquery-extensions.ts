/* eslint-disable @typescript-eslint/no-explicit-any */

declare const $: any;

// Guard: only extend if jQuery is available
if (typeof $ !== 'undefined' && $) {
  // Simple templating helper: $.nano('{greeting}, {name}!', { greeting: 'Hi', name: 'reader' })
  $.nano = function (template: string, data: Record<string, any>) {
    return template.replace(/\{([\w.]+)\}/g, function (_match: string, key: string) {
      void _match;

      const keys = key.split('.');
      let value = data[keys.shift() as string];

      try {
        for (let i = 0, len = keys.length; i < len; i++) {
          value = value[keys[i]];
        }
      } catch {
        // ignore path traversal errors
      }

      return typeof value !== 'undefined' && value !== null ? value : '';
    });
  };

  // jQuery selector extension for exact text contains: a:econtains('text')
  $.expr[':'].econtains = function (obj: any, _index: number, meta: any, _stack: any) {
    void _index;
    void _stack;

    const text = (obj.textContent || obj.innerText || $(obj).text() || '').toLowerCase();
    return text === meta[3].toLowerCase();
  };
}

export {};
