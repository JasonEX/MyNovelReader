type Clock = () => number;

const now: Clock = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export interface PerformanceResult<T = unknown> {
  label: string;
  duration: number;
  result: T;
}

export class PerformanceTimer {
  private marks = new Map<string, number>();

  start(label: string): void {
    this.marks.set(label, now());
  }

  end(label: string): number | null {
    const start = this.marks.get(label);

    if (start === undefined) {
      return null;
    }

    const duration = now() - start;
    this.marks.delete(label);
    return duration;
  }

  measure<T>(label: string, fn: () => T): PerformanceResult<T> {
    const start = now();
    const result = fn();

    return { label, result, duration: now() - start };
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<PerformanceResult<T>> {
    const start = now();
    const result = await fn();

    return { label, result, duration: now() - start };
  }
}

export function formatDuration(duration: number): string {
  return `${duration.toFixed(2)}ms`;
}
