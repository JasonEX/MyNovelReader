/**
 * useReaderAutoLoad - Composable for auto-loading next chapters
 *
 * Manages the auto-load safety gate, cooldown timers, and scheduling
 * for preloading subsequent chapters during reading.
 */

import { type ComputedRef, onUnmounted, ref, type Ref, watch } from 'vue';
import type { useConfigStore } from '@/ui/stores/config';
import type { useReaderStore } from '@/ui/stores/reader';

// === Constants ===
export const INTERSECTION_ROOT_MARGIN_PX = 800;
const AUTO_LOAD_COOLDOWN_MIN_MS = 3000;
const AUTO_LOAD_COOLDOWN_MAX_MS = 5000;
const AUTO_LOAD_ARM_SCROLL_DELTA_PX = 180;
const AUTO_LOAD_SHORT_CHAIN_LIMIT = 10;

export interface UseReaderAutoLoadOptions {
  mainRef: Ref<HTMLElement | null>;
  readerStore: ReturnType<typeof useReaderStore>;
  configStore: ReturnType<typeof useConfigStore>;
  hasNext: ComputedRef<boolean>;
  isLoadingNext: ComputedRef<boolean>;
  isLoadingPrev: ComputedRef<boolean>;
  isLoading: ComputedRef<boolean>;
  isNavigating: Ref<boolean>;
}

export function useReaderAutoLoad(options: UseReaderAutoLoadOptions) {
  const {
    mainRef,
    readerStore,
    configStore,
    hasNext,
    isLoadingNext,
    isLoadingPrev,
    isLoading,
    isNavigating,
  } = options;

  // Auto-load safety gate:
  // - Avoid request storms when the sentinel stays intersecting (e.g. short chapters / large rootMargin).
  // - Require some user scrolling after each append before allowing the next auto-load.
  const autoLoadArmed = ref(false);
  const lastAutoLoadScrollTop = { value: 0 };
  const autoLoadShortChainCount = { value: 0 };
  let nextAutoLoadAt = 0;
  let autoLoadTimer: ReturnType<typeof setTimeout> | null = null;

  function getRandomDelayMs(min: number, max: number): number {
    const a = Math.min(min, max);
    const b = Math.max(min, max);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function getDistanceToBottom(mainEl: HTMLElement): number {
    return mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight);
  }

  function isNearBottom(mainEl: HTMLElement): boolean {
    return getDistanceToBottom(mainEl) <= INTERSECTION_ROOT_MARGIN_PX;
  }

  function isShortScrollableContent(mainEl: HTMLElement): boolean {
    const scrollableDistance = mainEl.scrollHeight - mainEl.clientHeight;
    return scrollableDistance < AUTO_LOAD_ARM_SCROLL_DELTA_PX;
  }

  function clearAutoLoadTimer(): void {
    if (!autoLoadTimer) return;
    clearTimeout(autoLoadTimer);
    autoLoadTimer = null;
  }

  function scheduleAutoLoadNext(): void {
    const mainEl = mainRef.value;
    if (!mainEl) return;
    if (!configStore.behavior.preloadNext) return;
    if (!hasNext.value) return;
    if (isLoadingNext.value || isLoadingPrev.value || isLoading.value || isNavigating.value) return;
    if (!isNearBottom(mainEl)) return;

    const fillMode = isShortScrollableContent(mainEl);
    const canAutoLoad = autoLoadArmed.value || fillMode;
    if (!canAutoLoad) return;

    // Prevent endless auto-loading when content stays extremely short.
    if (fillMode && autoLoadShortChainCount.value >= AUTO_LOAD_SHORT_CHAIN_LIMIT) return;

    const now = Date.now();
    if (nextAutoLoadAt === 0) {
      nextAutoLoadAt = now + getRandomDelayMs(AUTO_LOAD_COOLDOWN_MIN_MS, AUTO_LOAD_COOLDOWN_MAX_MS);
    }
    const delayMs = Math.max(0, nextAutoLoadAt - now);
    if (delayMs > 0) {
      if (!autoLoadTimer) {
        autoLoadTimer = setTimeout(() => {
          autoLoadTimer = null;
          scheduleAutoLoadNext();
        }, delayMs);
      }
      return;
    }

    // Commit auto-load
    clearAutoLoadTimer();
    nextAutoLoadAt = now + getRandomDelayMs(AUTO_LOAD_COOLDOWN_MIN_MS, AUTO_LOAD_COOLDOWN_MAX_MS);
    lastAutoLoadScrollTop.value = mainEl.scrollTop;
    autoLoadArmed.value = false;
    autoLoadShortChainCount.value = fillMode ? autoLoadShortChainCount.value + 1 : 0;

    void readerStore.loadNextChapter('auto').then(ok => {
      if (!ok) {
        // On failures, slow down a bit more to avoid triggering anti-crawler rules.
        nextAutoLoadAt =
          Date.now() + getRandomDelayMs(AUTO_LOAD_COOLDOWN_MAX_MS, AUTO_LOAD_COOLDOWN_MAX_MS * 2);
      }
    });
  }

  // Any chapter list change (append/prepend) should re-arm only after user scrolls again.
  watch(
    () => readerStore.chapters.length,
    () => {
      const mainEl = mainRef.value;
      if (!mainEl) return;
      lastAutoLoadScrollTop.value = mainEl.scrollTop;
      autoLoadArmed.value = false;
      // Allow a few consecutive auto-loads when content is too short to scroll.
      if (!isShortScrollableContent(mainEl)) {
        autoLoadShortChainCount.value = 0;
      }
      scheduleAutoLoadNext();
    }
  );

  watch(
    () => configStore.behavior.preloadNext,
    enabled => {
      if (!enabled) {
        clearAutoLoadTimer();
        nextAutoLoadAt = 0;
        autoLoadShortChainCount.value = 0;
        return;
      }
      scheduleAutoLoadNext();
    }
  );

  onUnmounted(() => {
    clearAutoLoadTimer();
  });

  return {
    autoLoadArmed,
    scheduleAutoLoadNext,
    clearAutoLoadTimer,
    lastAutoLoadScrollTop,
    autoLoadShortChainCount,
    INTERSECTION_ROOT_MARGIN_PX,
  };
}
