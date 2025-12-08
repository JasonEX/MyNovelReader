export interface ErrorContext {
  scope?: string;
  data?: Record<string, unknown>;
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error('Unknown error');
  }
}

export function logError(error: unknown, context: ErrorContext = {}): void {
  const normalized = normalizeError(error);
  const prefix = context.scope ? `[${context.scope}] ` : '';

  if (context.data) {
    console.error(`${prefix}${normalized.message}`, normalized, context.data);
  } else {
    console.error(`${prefix}${normalized.message}`, normalized);
  }
}

export function safeExecute<T>(fn: () => T, fallback: T, context?: ErrorContext): T {
  try {
    return fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}

export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}
