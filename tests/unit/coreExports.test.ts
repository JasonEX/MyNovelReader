import { describe, expect, it } from 'vitest';

import * as core from '@/core';

describe('core exports', () => {
  it('exports primary APIs', () => {
    expect(core).toHaveProperty('DetectionEngine');
    expect(core).toHaveProperty('Parser');
    expect(core).toHaveProperty('getParser');
    expect(core).toHaveProperty('getRuleManager');
    expect(core).toHaveProperty('SiteProtection');
    expect(core).toHaveProperty('AutoEnableManager');
  });
});
