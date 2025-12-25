import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

import { createRuleSaver, RuleSaver } from '@/core/auto-enable/RuleSaver';
import type { DetectionEngineResult } from '@/core/detection';
import type { SiteRule } from '@/core/rules/types';

const { mockSaveUserRule } = vi.hoisted(() => ({
  mockSaveUserRule: vi.fn(),
}));

vi.mock('@/core/rules/RuleManager', () => ({
  getRuleManager: () => ({
    saveUserRule: mockSaveUserRule,
  }),
}));

describe('RuleSaver', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockSaveUserRule.mockReset();
  });

  const makeDetection = (overrides: Partial<DetectionEngineResult> = {}): DetectionEngineResult =>
    ({
      results: {
        content: { element: null, selector: '#main', confidence: 0.9, method: 'selector' },
        navigation: {
          next: {
            element: null as unknown as HTMLAnchorElement,
            url: 'https://example.com/next',
            selector: '#next',
            confidence: 0.9,
            method: 'text-matching',
            text: '下一章',
          },
          prev: null,
          index: null,
        },
        title: {
          chapterTitle: '第1章',
          bookTitle: '书名',
          selector: 'h1',
          confidence: 0.8,
          method: 'heading',
        },
        section: {
          isSection: true,
          currentSection: 1,
          nextSectionUrl: 'https://example.com/1_2.html',
          nextChapterUrl: 'https://example.com/2.html',
          confidence: 0.9,
          method: 'link-text',
        },
      },
      confidence: {
        overall: 0.9,
        content: 0.9,
        navigation: 0.9,
        title: 0.8,
        isReliable: true,
        reasons: [],
      },
      ...overrides,
    }) as DetectionEngineResult;

  it('createRuleFromDetection maps selectors, navigation and section flags', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    const rule = saver.createRuleFromDetection('example.com', detection);

    expect(rule.match.pattern).toContain('example\\\\.com');
    expect(rule.content.selector).toBe('#main');
    expect(rule.navigation?.next).toBe('#next');
    expect(rule.title?.selector).toBe('h1');
    expect(rule.advanced?.checkSection).toBe(true);
  });

  it('createRuleFromDetection includes prev/index navigation (selector or url)', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.navigation.prev = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/prev',
      selector: '',
      confidence: 0.9,
      method: 'text-matching',
      text: '上一章',
    };
    detection.results.navigation.index = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/index',
      selector: '#index',
      confidence: 0.9,
      method: 'text-matching',
      text: '目录',
    };

    const rule = saver.createRuleFromDetection('example.com', detection);

    expect(rule.navigation?.prev).toBe('https://example.com/prev');
    expect(rule.navigation?.index).toBe('#index');
  });

  it('createRuleFromDetection uses index URL when selector is empty', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.navigation.next = null;
    detection.results.navigation.index = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/index',
      selector: '',
      confidence: 0.9,
      method: 'text-matching',
      text: '目录',
    };

    const rule = saver.createRuleFromDetection('example.com', detection);
    expect(rule.navigation?.index).toBe('https://example.com/index');
  });

  it('createRuleFromDetection uses defaults when optional fields are missing', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.content.selector = '';
    detection.results.navigation.next = null;
    detection.results.navigation.prev = null;
    detection.results.navigation.index = null;
    detection.results.title.selector = undefined;
    detection.results.section = {
      isSection: true,
      currentSection: 1,
      nextSectionUrl: null,
      nextChapterUrl: null,
      confidence: 0.2,
      method: 'link-text',
    };

    const rule = saver.createRuleFromDetection('example.com', detection);

    expect(rule.content.selector).toBe('#content');
    expect(rule.navigation).toBeUndefined();
    expect(rule.title).toBeUndefined();
    expect(rule.advanced?.checkSection).toBeUndefined();
  });

  it('validateRule validates required fields', () => {
    const saver = new RuleSaver();
    const base: SiteRule = {
      id: 'id',
      name: 'name',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    expect(saver.validateRule(base)).toBe(true);
    expect(saver.validateRule({ ...base, id: '' })).toBe(false);
    expect(saver.validateRule({ ...base, match: { pattern: '', type: 'regex' } })).toBe(false);
    expect(saver.validateRule({ ...base, content: { selector: '' } })).toBe(false);
  });

  it('enhanceRule fills missing fields without overwriting existing navigation', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    const existing: SiteRule = {
      id: 'example.com',
      name: 'existing',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      navigation: { next: '#keep' },
      meta: { source: 'user' },
    };

    const enhanced = saver.enhanceRule(existing, detection);

    expect(enhanced.content?.selector).toBe('#main');
    expect(enhanced.navigation?.next).toBe('#keep');
    expect(enhanced.navigation?.prev).toBeUndefined();
    expect(enhanced.advanced?.checkSection).toBe(true);
    expect(enhanced.meta?.updated).toBeTruthy();
  });

  it('enhanceRule keeps existing navigation values when already present', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.navigation.prev = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/prev',
      selector: '#prev',
      confidence: 0.9,
      method: 'text-matching',
      text: '上一章',
    };

    const existing: SiteRule = {
      id: 'example.com',
      name: 'existing',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      navigation: { prev: '#keep-prev' },
      meta: { source: 'user' },
    };

    const enhanced = saver.enhanceRule(existing, detection);

    expect(enhanced.navigation?.prev).toBe('#keep-prev');
  });

  it('enhanceRule does not add navigation when detection has no navigation', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.navigation.next = null;
    detection.results.navigation.prev = null;
    detection.results.navigation.index = null;
    detection.results.content.selector = '#content';

    const existing: SiteRule = {
      id: 'example.com',
      name: 'existing',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    const enhanced = saver.enhanceRule(existing, detection);

    expect(enhanced.navigation).toBeUndefined();
  });

  it('enhanceRule fills missing content/navigation fields from detection', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.navigation.prev = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/prev',
      selector: '#prev',
      confidence: 0.9,
      method: 'text-matching',
      text: '上一章',
    };
    detection.results.navigation.index = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/index',
      selector: '',
      confidence: 0.9,
      method: 'text-matching',
      text: '目录',
    };

    const existing: SiteRule = {
      id: 'example.com',
      name: 'existing',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      meta: undefined,
    };

    const enhanced = saver.enhanceRule(existing, detection);

    expect(enhanced.content?.selector).toBe('#main');
    expect(enhanced.navigation?.next).toBe('#next');
    expect(enhanced.navigation?.prev).toBe('#prev');
    expect(enhanced.navigation?.index).toBe('https://example.com/index');
    expect(enhanced.meta?.updated).toBeTruthy();
  });

  it('enhanceRule does not overwrite existing title and does not enable section when not confident', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.content.selector = '#content';
    detection.results.section.confidence = 0.1;

    const existing: SiteRule = {
      id: 'example.com',
      name: 'existing',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      title: { selector: 'h1' },
      meta: { source: 'user' },
    };

    const enhanced = saver.enhanceRule(existing, detection);

    expect(enhanced.content?.selector).toBe('#content');
    expect(enhanced.title?.selector).toBe('h1');
    expect(enhanced.advanced?.checkSection).toBeUndefined();
  });

  it('enhanceRule uses URL fallback when navigation selector is empty', () => {
    const saver = new RuleSaver();
    const detection = makeDetection();

    detection.results.navigation.next = {
      element: null as unknown as HTMLAnchorElement,
      url: 'https://example.com/next',
      selector: '',
      confidence: 0.9,
      method: 'text-matching',
      text: '下一章',
    };

    const existing: SiteRule = {
      id: 'example.com',
      name: 'existing',
      version: 1,
      match: { pattern: '^https?://example\\\\.com', type: 'regex' },
      content: { selector: '#content' },
      meta: { source: 'user' },
    };

    const enhanced = saver.enhanceRule(existing, detection);

    expect(enhanced.navigation?.next).toBe('https://example.com/next');
  });

  it('saveFromDetection saves a rule via RuleManager', async () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'https://example.com/chapter/1',
    });

    const saver = new RuleSaver();
    const detection = makeDetection();
    await saver.saveFromDetection(dom.window.document, detection);

    expect(mockSaveUserRule).toHaveBeenCalledTimes(1);
    const [domain] = mockSaveUserRule.mock.calls[0] as [string, SiteRule];
    expect(domain).toBe('example.com');
  });

  it('saveFromDetection uses window.location when doc.location is missing', async () => {
    window.history.pushState({}, '', '/chapter/1');

    const saver = new RuleSaver();
    const detection = makeDetection();

    const doc = {} as Document;
    await saver.saveFromDetection(doc, detection);

    expect(mockSaveUserRule).toHaveBeenCalledTimes(1);
    expect(mockSaveUserRule).toHaveBeenCalledWith(window.location.hostname, expect.anything());
  });

  it('saveFromDetection is a no-op when detection is missing', async () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'https://example.com/chapter/1',
    });

    const saver = new RuleSaver();
    // @ts-expect-error - intentional null in test
    await saver.saveFromDetection(dom.window.document, null);

    expect(mockSaveUserRule).not.toHaveBeenCalled();
  });

  it('createRuleSaver creates an instance', () => {
    expect(createRuleSaver()).toBeInstanceOf(RuleSaver);
  });
});
