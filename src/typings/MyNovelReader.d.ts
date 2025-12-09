export * from '../MyNovelReader/types';

/**
 * Legacy typings entry that now re-exports the canonical type definitions.
 * Keep this file to satisfy existing imports that point to `src/typings/MyNovelReader`.
 */
declare global {
  interface JQuery<TElement = HTMLElement> {
    size(): number;
    push?(...items: TElement[]): number;
  }

  interface JQueryStatic {
    nano?(template: string, data: Record<string, string>): string;
  }
}
