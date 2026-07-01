/**
 * useReaderAutoLoad - one-chapter-ahead automatic preloading.
 *
 * Automatic preloading is intentionally conservative: every visible chapter gets
 * a short reading grace period before the script may fetch the next chapter.
 * Explicit user navigation is handled outside this composable as manual loading.
 */

import { type ComputedRef, onUnmounted, type Ref, watch } from 'vue';
import type { useConfigStore } from '@/ui/stores/config';
import type { useReaderStore } from '@/ui/stores/reader';

export const INTERSECTION_ROOT_MARGIN_PX = 1600;

const PRELOAD_DELAY_MIN_MS = 3000;
const PRELOAD_DELAY_MAX_MS = 5000;
const FAILURE_COOLDOWN_MIN_MS = 6000;
const FAILURE_COOLDOWN_MAX_MS = 10000;

export type AutoLoadReason = 'state' | 'scroll' | 'settled' | 'sentinel' | 'visibility' | 'timer';

export type ScheduleAutoLoadNext = (reason?: AutoLoadReason) => void;

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

  let autoLoadTimer: ReturnType<typeof setTimeout> | null = null;
  let autoLoadTimerDueAt = 0;
  let autoLoadInFlight = false;
  let sessionKey = '';
  let graceUntil = 0;
  let failureCooldownUntil = 0;

  function getRandomDelayMs(min: number, max: number): number {
    const a = Math.min(min, max);
    const b = Math.max(min, max);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function now(): number {
    return Date.now();
  }

  function getCurrentIndex(): number {
    const index = Number(readerStore.currentChapterIndex ?? 0);
    if (!Number.isFinite(index) || readerStore.chapters.length === 0) return 0;
    return Math.max(0, Math.min(readerStore.chapters.length - 1, index));
  }

  function getCurrentSessionKey(): string {
    const entry = readerStore.chapters[getCurrentIndex()];
    if (!entry) return '';
    return `${getCurrentIndex()}:${entry.chapter.url}`;
  }

  function ensureSession(): boolean {
    const nextSessionKey = getCurrentSessionKey();
    if (!nextSessionKey) return false;

    if (nextSessionKey !== sessionKey) {
      sessionKey = nextSessionKey;
      graceUntil = now() + getRandomDelayMs(PRELOAD_DELAY_MIN_MS, PRELOAD_DELAY_MAX_MS);
      failureCooldownUntil = 0;
      clearAutoLoadTimer();
    }
    return true;
  }

  function getUnreadLoadedChapterCount(): number {
    return Math.max(0, readerStore.chapters.length - getCurrentIndex() - 1);
  }

  function isPageHidden(): boolean {
    return typeof document !== 'undefined' && document.visibilityState === 'hidden';
  }

  function isNearBottom(mainEl: HTMLElement): boolean {
    return (
      mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight) <= INTERSECTION_ROOT_MARGIN_PX
    );
  }

  function clearAutoLoadTimer(): void {
    if (!autoLoadTimer) return;
    clearTimeout(autoLoadTimer);
    autoLoadTimer = null;
    autoLoadTimerDueAt = 0;
  }

  function scheduleTimerAt(dueAt: number): void {
    if (autoLoadTimer && autoLoadTimerDueAt <= dueAt) return;

    clearAutoLoadTimer();
    autoLoadTimerDueAt = dueAt;
    autoLoadTimer = setTimeout(
      () => {
        autoLoadTimer = null;
        autoLoadTimerDueAt = 0;
        scheduleAutoLoadNext('timer');
      },
      Math.max(0, dueAt - now())
    );
  }

  function canAutoLoadBase(): boolean {
    return (
      configStore.behavior.preloadNext &&
      readerStore.chapters.length > 0 &&
      hasNext.value &&
      !isLoadingNext.value &&
      !isLoadingPrev.value &&
      !isLoading.value &&
      !isNavigating.value &&
      !autoLoadInFlight &&
      !isPageHidden() &&
      getUnreadLoadedChapterCount() === 0
    );
  }

  function finishLoad(ok: boolean): void {
    autoLoadInFlight = false;
    if (ok) {
      failureCooldownUntil = 0;
      return;
    }

    failureCooldownUntil =
      now() + getRandomDelayMs(FAILURE_COOLDOWN_MIN_MS, FAILURE_COOLDOWN_MAX_MS);
  }

  function startAutoLoad(): void {
    if (!mainRef.value || !canAutoLoadBase()) return;

    clearAutoLoadTimer();
    autoLoadInFlight = true;
    void readerStore.loadNextChapter('auto').then(finishLoad, () => finishLoad(false));
  }

  function shouldRetryAfterCooldown(reason: AutoLoadReason): boolean {
    return reason !== 'state';
  }

  function scheduleAutoLoadNext(reason: AutoLoadReason = 'state'): void {
    const mainEl = mainRef.value;
    if (!mainEl || !ensureSession()) return;

    if (!canAutoLoadBase()) {
      if (!configStore.behavior.preloadNext || getUnreadLoadedChapterCount() > 0) {
        clearAutoLoadTimer();
      }
      return;
    }

    const currentTime = now();
    if (currentTime < graceUntil) {
      scheduleTimerAt(graceUntil);
      return;
    }

    if (currentTime < failureCooldownUntil) {
      if (shouldRetryAfterCooldown(reason)) {
        scheduleTimerAt(failureCooldownUntil);
      }
      return;
    }

    if (reason === 'scroll' || reason === 'settled' || reason === 'sentinel') {
      if (!isNearBottom(mainEl)) return;
    }

    startAutoLoad();
  }

  watch(
    () => readerStore.chapters.length,
    () => {
      scheduleAutoLoadNext('state');
    }
  );

  watch(
    () => readerStore.currentChapterIndex,
    () => {
      scheduleAutoLoadNext('state');
    }
  );

  watch(
    () => [isLoadingNext.value, isLoadingPrev.value, isLoading.value, isNavigating.value],
    ([loadingNext, loadingPrev, loading, navigating]) => {
      if (loadingNext || loadingPrev || loading || navigating) return;
      scheduleAutoLoadNext('state');
    }
  );

  watch(
    () => configStore.behavior.preloadNext,
    enabled => {
      if (!enabled) {
        clearAutoLoadTimer();
        failureCooldownUntil = 0;
        return;
      }
      scheduleAutoLoadNext('state');
    }
  );

  function handleVisibilityChange(): void {
    if (!isPageHidden()) {
      scheduleAutoLoadNext('visibility');
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  scheduleAutoLoadNext('state');

  onUnmounted(() => {
    clearAutoLoadTimer();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  });

  return {
    scheduleAutoLoadNext,
    clearAutoLoadTimer,
    INTERSECTION_ROOT_MARGIN_PX,
  };
}
