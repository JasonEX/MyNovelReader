// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('userscript build configuration', () => {
  it('keeps the generated userscript readable instead of minifying it', () => {
    const source = readFileSync(new URL('../../vite.config.ts', import.meta.url), 'utf8');
    expect(source).toMatch(/\bminify:\s*false\b/);
  });
});
