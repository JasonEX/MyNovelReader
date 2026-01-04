import { describe, expect, it } from 'vitest';

import { createMeta, generateMetaBlock, toUserscriptConfig } from '@/meta';

describe('userscript meta', () => {
  it('generates a meta block (includes build-date/require/resource when present)', () => {
    const meta = {
      ...createMeta({ version: '1.2.3', buildDate: '2025-01-01' }),
      requires: ['https://example.com/dep.js'],
      resources: ['demo https://example.com/demo.css'],
    };

    const block = generateMetaBlock(meta);

    expect(block).toContain('// ==UserScript==');
    expect(block).toContain('// @version        1.2.3');
    expect(block).toContain('// @build-date     2025-01-01');
    expect(block).toContain('// @match          *://*/*.html');
    expect(block).toContain('// @require        https://example.com/dep.js');
    expect(block).toContain('// @resource       demo https://example.com/demo.css');
    expect(block.trimEnd().endsWith('// ==/UserScript==')).toBe(true);
  });

  it('omits build-date line when buildDate is missing', () => {
    const meta = createMeta({ version: '1.0.0' });
    const block = generateMetaBlock(meta);

    expect(block).toContain('// @version        1.0.0');
    expect(block).not.toContain('@build-date');
  });

  it('converts to userscript config shape for build tools', () => {
    const meta = createMeta({ version: '9.9.9', buildDate: '2025-12-31' });
    const config = toUserscriptConfig(meta);

    expect(config).toMatchObject({
      id: meta.id,
      name: meta.name,
      version: meta.version,
      match: meta.matches,
      exclude: meta.excludes,
      grant: meta.grants,
      connect: meta.connects,
      'run-at': 'document-start',
      'build-date': '2025-12-31',
    });
  });
});
