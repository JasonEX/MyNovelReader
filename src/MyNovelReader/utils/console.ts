export type ConsoleProxy = Pick<
  Console,
  'log' | 'debug' | 'error' | 'warn' | 'group' | 'groupCollapsed' | 'groupEnd' | 'time' | 'timeEnd'
>;

export const nullFn = (): void => {};

export let C: ConsoleProxy;

export function toggleConsole(debug: boolean): void {
  if (debug) {
    C = console;
  } else {
    C = {
      log: nullFn,
      debug: nullFn,
      error: console.error,
      warn: console.warn,
      group: nullFn,
      groupCollapsed: nullFn,
      groupEnd: nullFn,
      time: nullFn,
      timeEnd: nullFn,
    };
  }
}
