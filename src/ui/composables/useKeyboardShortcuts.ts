/**
 * useKeyboardShortcuts - Composable for managing keyboard shortcuts
 *
 * Features:
 * - Declarative shortcut definitions
 * - Automatic input element detection (ignores shortcuts in inputs)
 * - Modifier key handling (ignores Ctrl/Alt/Meta by default)
 * - Per-shortcut override options
 * - Reactive enabled state
 */

import { computed, type MaybeRef, unref } from 'vue';
import { useEventListener } from './useEventListener';

export interface ShortcutDefinition {
  /** Key(s) that trigger this shortcut. Use lowercase. */
  key: string | string[];
  /** Handler function called when shortcut is triggered. */
  handler: (e: KeyboardEvent) => void;
  /** Whether to call e.preventDefault(). Default: false */
  preventDefault?: boolean;
  /** Whether to call e.stopPropagation(). Default: false */
  stopPropagation?: boolean;
  /** Whether repeated keydown events may invoke the handler. Default: true */
  allowRepeat?: boolean;
  /** Allow this shortcut to trigger even with modifier keys (Ctrl/Alt/Meta). Default: false */
  allowModifiers?: boolean;
  /** Allow this shortcut to trigger in input elements. Default: false */
  allowInInputs?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  /** Reactive boolean to enable/disable all shortcuts. */
  enabled?: MaybeRef<boolean>;
  /** Globally ignore key events in input elements. Default: true */
  ignoreInputs?: boolean;
  /** Globally ignore key events with modifier keys. Default: true */
  ignoreModifiers?: boolean;
}

/**
 * Check if an element is an input-like element where shortcuts should be ignored.
 */
function isInputElement(el: HTMLElement): boolean {
  const tagName = el.tagName;
  return (
    tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || el.isContentEditable
  );
}

/**
 * Check if any modifier key (Ctrl/Alt/Meta) is pressed.
 * Note: Shift is not included as it's commonly used with letter keys.
 */
function hasModifiers(e: KeyboardEvent): boolean {
  return e.ctrlKey || e.altKey || e.metaKey;
}

/**
 * Register keyboard shortcuts with automatic cleanup.
 *
 * @example
 * ```ts
 * useKeyboardShortcuts([
 *   { key: 'escape', handler: closeModal },
 *   { key: ['arrowleft', 'p'], handler: prevPage, preventDefault: true },
 *   { key: ['arrowright', 'n'], handler: nextPage, preventDefault: true },
 * ], { enabled: isReaderActive });
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutDefinition[],
  options: UseKeyboardShortcutsOptions = {}
): void {
  const { enabled, ignoreInputs = true, ignoreModifiers = true } = options;

  const isEnabled = computed(() => {
    if (enabled === undefined) return true;
    return unref(enabled);
  });

  function handleKeyDown(ev: Event) {
    const e = ev as KeyboardEvent;
    // Check global enabled state
    if (!isEnabled.value) return;

    const target = e.target as HTMLElement;
    const key = e.key.toLowerCase();

    // Try to match a shortcut
    for (const shortcut of shortcuts) {
      const keys = Array.isArray(shortcut.key) ? shortcut.key : [shortcut.key];
      const normalizedKeys = keys.map(k => k.toLowerCase());

      // Check if key matches
      if (!normalizedKeys.includes(key)) continue;

      // Check input element restriction
      const shouldIgnoreInput = ignoreInputs && !shortcut.allowInInputs;
      if (shouldIgnoreInput && isInputElement(target)) continue;

      // Check modifier key restriction
      const shouldIgnoreModifier = ignoreModifiers && !shortcut.allowModifiers;
      if (shouldIgnoreModifier && hasModifiers(e)) continue;

      // Execute handler
      if (shortcut.preventDefault) e.preventDefault();
      if (shortcut.stopPropagation) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      if (e.repeat && shortcut.allowRepeat === false) return;
      shortcut.handler(e);

      // Only one shortcut per key event
      return;
    }
  }

  // Use capture phase to handle events before other listeners
  useEventListener('keydown', handleKeyDown, { capture: true });
}
