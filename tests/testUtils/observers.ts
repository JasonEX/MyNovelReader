import { vi } from 'vitest';

export function stubIntersectionObserver(): void {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly thresholds: ReadonlyArray<number>;

    constructor(_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.root = options?.root ?? null;
      this.rootMargin = options?.rootMargin ?? '';
      this.thresholds = Array.isArray(options?.threshold)
        ? options!.threshold
        : options?.threshold != null
          ? [options.threshold]
          : [0];
    }

    disconnect(): void {}
    observe(_target: Element): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve(_target: Element): void {}
  }

  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
}
