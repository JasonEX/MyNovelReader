/**
 * useEventListener - Composable for managing event listeners
 *
 * Automatically registers event listeners on mount and removes them on scope dispose.
 * Supports both window/document and ref-based targets.
 */

import { isRef, onMounted, onScopeDispose, type Ref, unref, watch } from 'vue';

type TargetRef<T extends EventTarget = EventTarget> = T | Ref<T | undefined>;

export interface UseEventListenerOptions<T extends EventTarget = EventTarget> {
  /** Event target (window, document, or a ref). Defaults to window. */
  target?: TargetRef<T>;
  /** Use capture phase. */
  capture?: boolean;
  /** Use passive listener. */
  passive?: boolean;
}

/**
 * Register an event listener that is automatically cleaned up.
 *
 * @param type - Event type (e.g., 'keydown', 'scroll')
 * @param listener - Event handler function
 * @param options - Configuration options
 * @returns Cleanup function to manually remove the listener
 */
export function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {}
): () => void {
  const { target = window, passive = false, capture = false } = options;
  let attached = false;

  const add = (currentTarget?: TargetRef) => {
    const element = unref(currentTarget);
    if (element && !attached) {
      element.addEventListener(type, listener, { capture, passive });
      attached = true;
    }
  };

  const remove = (currentTarget?: TargetRef) => {
    const element = unref(currentTarget);
    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  };

  onMounted(() => add(target));
  onScopeDispose(() => remove(target));

  // Watch for ref target changes
  if (isRef(target)) {
    watch(target, (newTarget, oldTarget) => {
      remove(oldTarget);
      add(newTarget);
    });
  }

  return () => remove(target);
}
