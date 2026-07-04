import { type DebugJsonValue, toDebugValue } from './diagnostics';

export type DebugEventLevel = 'info' | 'warn' | 'error';

export interface DebugEvent {
  at: string;
  t: number;
  level: DebugEventLevel;
  type: string;
  detail?: DebugJsonValue;
}

const MAX_DEBUG_EVENTS = 50;
const events: DebugEvent[] = [];

export function recordDebugEvent(
  type: string,
  detail?: unknown,
  level: DebugEventLevel = 'info'
): void {
  events.push({
    at: new Date().toISOString(),
    t: Date.now(),
    level,
    type,
    detail: detail === undefined ? undefined : toDebugValue(detail),
  });
  if (events.length > MAX_DEBUG_EVENTS) {
    events.splice(0, events.length - MAX_DEBUG_EVENTS);
  }
}

export function getDebugEvents(): DebugEvent[] {
  return events.map(event => ({ ...event }));
}

export function clearDebugEvents(): void {
  events.length = 0;
}

export function installGlobalDebugErrorListeners(): void {
  if (typeof window === 'undefined') return;
  const marker = '__mnrDebugErrorListenersInstalled__';
  const target = window as Window & { [marker]?: boolean };
  if (target[marker]) return;
  target[marker] = true;

  window.addEventListener('error', event => {
    recordDebugEvent(
      'window.error',
      {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error instanceof Error ? event.error.message : null,
      },
      'error'
    );
  });

  window.addEventListener('unhandledrejection', event => {
    recordDebugEvent(
      'window.unhandledrejection',
      {
        reason: event.reason instanceof Error ? event.reason.message : event.reason,
      },
      'error'
    );
  });
}
