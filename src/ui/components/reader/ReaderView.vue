<template>
  <div
    class="mnr-reader"
    @click="shieldEvent"
    @mousedown="shieldEvent"
    @mouseup="shieldEvent"
    @wheel="shieldEvent"
    @touchstart="shieldEvent"
    @touchmove="shieldEvent"
    @touchend="shieldEvent"
    @pointerdown="shieldEvent"
    @pointermove="shieldEvent"
    @pointerup="shieldEvent"
  >
    <!-- Progress indicator -->
    <ProgressIndicator v-if="showProgress" :percent="scrollPercent" :auto-hide="true" />

    <!-- Floating toolbar -->
    <FloatingToolbar
      :visible="showControls"
      @toggle-drawer="toggleDrawer"
      @open-settings="openSettings"
    />

    <!-- Chapter drawer -->
    <ChapterDrawer
      :is-open="drawerOpen"
      :book-title="bookTitle"
      :chapters="readerStore.tocWithStatus"
      :loading="readerStore.tocLoading"
      :cache-progress="cacheProgress"
      @close="drawerOpen = false"
      @select="handleChapterSelect"
      @cache-all="handleCacheAll"
      @retry-cache="handleRetryCache"
    />

    <!-- Main content with virtualized infinite scroll -->
    <main ref="mainRef" class="mnr-reader-main" tabindex="-1">
      <!-- Top sentinel for IntersectionObserver -->
      <div ref="topSentinel" class="mnr-sentinel"></div>

      <!-- Loading previous indicator -->
      <div v-if="isLoadingPrev" class="mnr-loading-prev">
        <MnrSpinner size="small" />
        <span>加载上一章...</span>
      </div>

      <template v-for="(entry, index) in chapters" :key="entry.id">
        <article
          :ref="setChapterRef(entry.chapter.url)"
          class="mnr-reader-content"
          :data-chapter-url="entry.chapter.url"
          :lang="contentLang"
          @click="handleContentClick"
        >
          <h1 class="mnr-chapter-title">{{ entry.chapter.title }}</h1>
          <div v-html="entry.chapter.content"></div>
          <nav class="mnr-chapter-boundary-nav" aria-label="章节导航">
            <button
              type="button"
              :disabled="index === 0 && !hasPrev"
              @click.stop="navigateChapter('prev')"
            >
              上一章
            </button>
            <button
              type="button"
              :disabled="index === chapters.length - 1 && !hasNext"
              @click.stop="navigateChapter('next')"
            >
              下一章
            </button>
          </nav>
        </article>
      </template>

      <!-- Bottom sentinel for IntersectionObserver -->
      <div ref="bottomSentinel" class="mnr-sentinel"></div>

      <!-- Loading next chapter indicator -->
      <div v-if="isLoadingNext" class="mnr-loading-next">
        <MnrSpinner size="small" />
        <span>加载下一章...</span>
      </div>

      <!-- End of content (no more chapters) -->
      <div v-if="chapters.length > 0 && !hasNext && !isLoadingNext" class="mnr-chapter-end">
        <p class="mnr-chapter-end-text">— 已是最后一章 —</p>
        <div class="mnr-chapter-nav">
          <a
            v-if="indexUrl"
            :href="indexUrl"
            class="mnr-chapter-link index"
            @click.prevent="navigate('index')"
          >
            返回目录
          </a>
        </div>
      </div>
    </main>

    <!-- Settings panel -->
    <SettingsPanel
      :visible="settingsVisible"
      :site-auto-enable="siteAutoEnableValue"
      @close="closeSettings"
      @textConversionChange="handleTextConversionChange"
      @cacheAll="handleCacheAll"
      @retryCache="handleRetryCache"
      @copyDiagnostics="emit('copyDiagnostics')"
      @siteAutoEnableChange="handleSiteAutoEnableChange"
      @protectionModeChange="handleProtectionModeChange"
      @exit="emit('exit')"
    />

    <!-- Loading overlay -->
    <MnrLoadingOverlay v-if="isLoading">
      <span>加载中...</span>
    </MnrLoadingOverlay>

    <!-- Toast message -->
    <MnrToast :message="error ?? ''" :type="toastType" :visible="!!error" @dismiss="clearError" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useReaderStore, type TocEntryWithStatus } from '@/ui/stores/reader';
import { useConfigStore } from '@/ui/stores/config';
import { useKeyboardShortcuts } from '@/ui/composables/useKeyboardShortcuts';
import { useReaderScroll } from '@/ui/composables/reader/useReaderScroll';
import {
  useReaderAutoLoad,
  INTERSECTION_ROOT_MARGIN_PX,
} from '@/ui/composables/reader/useReaderAutoLoad';
import { useTouchGestures } from '@/ui/composables/reader/useTouchGestures';
import { useChapterNavigation } from '@/ui/composables/reader/useChapterNavigation';
import { useReaderUIControls } from '@/ui/composables/reader/useReaderUIControls';
import {
  flushReadingPositions,
  getReadingPosition,
  saveReadingPosition,
} from '@/ui/stores/reader/readingPosition';
import ProgressIndicator from './ProgressIndicator.vue';
import FloatingToolbar from './FloatingToolbar.vue';
import ChapterDrawer from './ChapterDrawer.vue';
import SettingsPanel from '@/ui/components/settings/SettingsPanel.vue';
import { MnrSpinner, MnrToast, MnrLoadingOverlay } from '@/ui/components/common';

const props = withDefaults(defineProps<{ siteAutoEnable?: boolean }>(), { siteAutoEnable: true });
const emit = defineEmits<{
  copyDiagnostics: [];
  exit: [];
  siteAutoEnableChange: [enabled: boolean];
  protectionModeChange: [mode: 'standard' | 'aggressive'];
}>();

// Stores
const readerStore = useReaderStore();
const configStore = useConfigStore();

// State
const mainRef = ref<HTMLElement | null>(null);
const topSentinel = ref<HTMLElement | null>(null);
const bottomSentinel = ref<HTMLElement | null>(null);
const isNavigating = ref(false);
const showControls = ref(true);
const chapterRefs = new Map<string, HTMLElement>();
const siteAutoEnableValue = ref(props.siteAutoEnable);

// UI controls composable
const {
  settingsVisible,
  drawerOpen,
  toggleDrawer,
  openSettings,
  closeSettings,
  handleEscape,
  toggleSettings,
} = useReaderUIControls({ readerStore, showControls });

// IntersectionObserver instances
let topObserver: globalThis.IntersectionObserver | null = null;
let bottomObserver: globalThis.IntersectionObserver | null = null;

// Computed
const chapters = computed(() => readerStore.chapters);

const bookTitle = computed(() => readerStore.bookTitle);
const indexUrl = computed(() => readerStore.chapter?.indexUrl);
const isLoading = computed(() => readerStore.isLoading);
const isLoadingPrev = computed(() => readerStore.isLoadingPrev);
const isLoadingNext = computed(() => readerStore.isLoadingNext);
const hasNext = computed(() => readerStore.hasNext);
const hasPrev = computed(() => readerStore.hasPrev);
const error = computed(() => readerStore.error);
const toastType = computed(() => readerStore.toastType);
const scrollPercent = computed(() => readerStore.scrollPercent);
const showProgress = computed(() => configStore.behavior.showProgress);
const cacheProgress = computed(() => readerStore.cacheProgress);
const autoHideHeader = computed(() => configStore.behavior.autoHideHeader);
const contentLang = computed(() => {
  if (readerStore.currentConversionMode === 'sc') return 'zh-CN';
  if (readerStore.currentConversionMode === 'tc') return 'zh-TW';
  return undefined;
});

// === Composables ===

// Auto-load composable (must be initialized before scroll composable)
const { scheduleAutoLoadNext } = useReaderAutoLoad({
  mainRef,
  readerStore,
  configStore,
  hasNext,
  isLoadingNext,
  isLoadingPrev,
  isLoading,
  isNavigating,
});

// Scroll composable
const { handleScroll } = useReaderScroll({
  mainRef,
  chapters,
  chapterRefs,
  readerStore,
  autoHideHeader,
  showControls,
  isNavigating,
  scheduleAutoLoadNext,
});

// Chapter navigation composable
const {
  navigateChapter,
  jumpToCachedChapter,
  scrollReader,
  loadPrevWithScrollAdjust,
  handleWheel,
} = useChapterNavigation({
  mainRef,
  chapters,
  chapterRefs,
  readerStore,
  isNavigating,
  isLoadingPrev,
  isLoadingNext,
  hasPrev,
  hasNext,
});

// Touch gestures composable
const swipeEnabled = computed(() => configStore.behavior.swipeGestures);
const { handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } = useTouchGestures({
  enabled: swipeEnabled,
  onSwipeLeft: () => void navigateChapter('next'),
  onSwipeRight: () => void navigateChapter('prev'),
});

// === UI event handlers ===

type TouchPointLike = {
  clientX: number;
  clientY: number;
};

type SingleTouchEventLike = Event & {
  touches: ArrayLike<TouchPointLike>;
};

const SCROLL_BOUNDARY_EPSILON_PX = 4;
let lastTouchPoint: TouchPointLike | null = null;
let isManualBoundaryLoadingNext = false;

function shieldEvent(event: Event) {
  event.stopPropagation();
}

function isSingleTouchEvent(event: Event): event is SingleTouchEventLike {
  const candidate = event as Partial<SingleTouchEventLike>;
  return Boolean(candidate.touches && candidate.touches.length === 1);
}

function isAtTop(mainEl: HTMLElement): boolean {
  return mainEl.scrollTop <= SCROLL_BOUNDARY_EPSILON_PX;
}

function isAtBottom(mainEl: HTMLElement): boolean {
  return (
    mainEl.scrollHeight - (mainEl.scrollTop + mainEl.clientHeight) <= SCROLL_BOUNDARY_EPSILON_PX
  );
}

function triggerNextAppendFromBoundary(): void {
  if (!hasNext.value) return;
  if (
    isLoadingNext.value ||
    isLoadingPrev.value ||
    isLoading.value ||
    isNavigating.value ||
    isManualBoundaryLoadingNext
  ) {
    return;
  }

  isManualBoundaryLoadingNext = true;
  void readerStore.loadNextChapter('manual').finally(() => {
    isManualBoundaryLoadingNext = false;
    scheduleAutoLoadNext('state');
  });
}

function preventIfCancelable(event: Event): void {
  if (event.cancelable === false) return;
  event.preventDefault();
}

function handleReaderTouchStart(event: Event): void {
  if (isSingleTouchEvent(event)) {
    const touch = event.touches[0];
    lastTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };
  } else {
    lastTouchPoint = null;
  }

  handleTouchStart(event);
}

function guardTouchBoundary(event: Event): void {
  const mainEl = mainRef.value;
  if (!mainEl || !isSingleTouchEvent(event) || !lastTouchPoint) return;

  const touch = event.touches[0];
  const deltaX = lastTouchPoint.clientX - touch.clientX;
  const deltaY = lastTouchPoint.clientY - touch.clientY;
  lastTouchPoint = { clientX: touch.clientX, clientY: touch.clientY };

  if (Math.abs(deltaY) < 2) return;
  if (Math.abs(deltaY) < Math.abs(deltaX)) return;

  if (deltaY > 0 && isAtBottom(mainEl)) {
    preventIfCancelable(event);
    triggerNextAppendFromBoundary();
  } else if (deltaY < 0 && isAtTop(mainEl)) {
    preventIfCancelable(event);
    if (hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
      void loadPrevWithScrollAdjust();
    }
  }
}

function handleReaderTouchMove(event: Event): void {
  handleTouchMove(event);
  guardTouchBoundary(event);
}

function handleReaderTouchEnd(event: Event): void {
  lastTouchPoint = null;
  handleTouchEnd(event);
  scheduleAutoLoadNext('settled');
}

function handleReaderTouchCancel(): void {
  lastTouchPoint = null;
  handleTouchCancel();
  scheduleAutoLoadNext('settled');
}

function navigate(direction: 'index') {
  if (direction === 'index' && indexUrl.value) {
    window.location.href = indexUrl.value;
  }
}

function handleChapterSelect(entry: TocEntryWithStatus) {
  if (entry.isCached) {
    jumpToCachedChapter(entry.url);
  } else {
    window.location.href = entry.url;
  }
}

function handleContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement;

  if (target.tagName === 'A') {
    const href = target.getAttribute('href');
    if (href && !href.startsWith('javascript:')) {
      return;
    }
    e.preventDefault();
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.toString().length === 0) {
    showControls.value = !showControls.value;
  }
}

function clearError() {
  readerStore.clearError();
}

async function handleTextConversionChange(mode: 'none' | 'sc' | 'tc') {
  await readerStore.applyTextConversion(mode);
}

async function handleCacheAll() {
  if (cacheProgress.value.running) {
    readerStore.cancelCacheAll();
    readerStore.showToast('已取消离线缓存', 'info');
    return;
  }

  await readerStore.loadToc();
  const remaining = readerStore.tocWithStatus.filter(entry => !entry.isPersisted).length;
  const message =
    remaining > 0
      ? `预计缓存 ${remaining} 章，过程可能需要一些时间。是否继续？`
      : '将从当前章节开始缓存后续内容，是否继续？';
  if (!window.confirm(message)) return;
  void readerStore.startCacheAll();
}

function handleRetryCache() {
  void readerStore.retryFailedCache();
}

function handleSiteAutoEnableChange(enabled: boolean) {
  siteAutoEnableValue.value = enabled;
  emit('siteAutoEnableChange', enabled);
  readerStore.showToast(enabled ? '已开启本站自动阅读' : '已关闭本站自动阅读', 'info');
}

function handleProtectionModeChange(mode: 'standard' | 'aggressive') {
  emit('protectionModeChange', mode);
}

function setChapterRef(url: string) {
  return (el: HTMLElement | null) => {
    if (!el) {
      chapterRefs.delete(url);
      return;
    }
    chapterRefs.set(url, el);
  };
}

function exitReader() {
  emit('exit');
}

// === Keyboard shortcuts ===

const keyboardEnabled = computed(() => configStore.behavior.keyboardNavigation);

useKeyboardShortcuts(
  [
    { key: 'escape', handler: handleEscape, allowInInputs: true },
    { key: 'tab', handler: toggleDrawer, preventDefault: true },
    {
      key: 'enter',
      handler: () => {
        if (indexUrl.value) window.location.href = indexUrl.value;
      },
      preventDefault: true,
    },
    { key: ['s', ','], handler: toggleSettings, preventDefault: true },
    { key: 'q', handler: exitReader, preventDefault: true, stopPropagation: true },
    {
      key: ['arrowleft', 'p'],
      handler: () => navigateChapter('prev'),
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: ['arrowright', 'n'],
      handler: () => navigateChapter('next'),
      preventDefault: true,
      stopPropagation: true,
    },
    { key: 'arrowup', handler: () => scrollReader('up'), preventDefault: true },
    { key: 'arrowdown', handler: () => scrollReader('down'), preventDefault: true },
    {
      key: ' ',
      handler: e => scrollReader(e.shiftKey ? 'pageup' : 'pagedown'),
      preventDefault: true,
    },
  ],
  { enabled: keyboardEnabled }
);

// === Lifecycle ===

const INTERSECTION_ROOT_MARGIN = `${INTERSECTION_ROOT_MARGIN_PX}px`;

async function restoreReadingPosition(): Promise<void> {
  const mainEl = mainRef.value;
  const currentUrl = readerStore.chapter?.url;
  if (!mainEl || !currentUrl) return;

  const percent = await getReadingPosition(currentUrl);
  if (percent === null || percent < 3 || percent > 98) return;

  await nextTick();
  await new Promise<void>(resolve => globalThis.requestAnimationFrame(() => resolve()));
  const chapterEl = chapterRefs.get(currentUrl);
  if (!chapterEl) return;

  const mainRect = mainEl.getBoundingClientRect();
  const chapterRect = chapterEl.getBoundingClientRect();
  const chapterTop = mainEl.scrollTop + chapterRect.top - mainRect.top;
  const scrollableHeight = Math.max(0, chapterEl.offsetHeight - mainEl.clientHeight * 0.5);
  mainEl.scrollTop = chapterTop + (percent / 100) * scrollableHeight;
  readerStore.updateScroll(percent);
  readerStore.showToast('已回到上次阅读位置', 'info', 1800);
}

watch(
  () => props.siteAutoEnable,
  value => {
    siteAutoEnableValue.value = value;
  }
);

watch(
  () => readerStore.currentChapterIndex,
  () => {
    void flushReadingPositions();
  }
);

function flushPersistentState(): void {
  if (readerStore.chapter?.url) {
    saveReadingPosition(readerStore.chapter.url, readerStore.scrollPercent);
  }
  void flushReadingPositions();
  void configStore.flushSave();
}

function handleVisibilityChange(): void {
  if (document.visibilityState === 'hidden') flushPersistentState();
}

onMounted(async () => {
  configStore.applyAll();

  const textConversion = configStore.reading.textConversion;
  if (textConversion !== 'none') {
    await readerStore.applyTextConversion(textConversion);
  }

  if (mainRef.value) {
    mainRef.value.addEventListener('scroll', handleScroll, { passive: true });
    mainRef.value.addEventListener('wheel', handleWheel, { passive: false });
    mainRef.value.addEventListener('touchstart', handleReaderTouchStart, { passive: true });
    mainRef.value.addEventListener('touchmove', handleReaderTouchMove, { passive: false });
    mainRef.value.addEventListener('touchend', handleReaderTouchEnd, { passive: true });
    mainRef.value.addEventListener('touchcancel', handleReaderTouchCancel, { passive: true });
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', flushPersistentState);

  const observerOptions = {
    root: mainRef.value,
    rootMargin: INTERSECTION_ROOT_MARGIN,
    threshold: 0,
  };

  bottomObserver = new globalThis.IntersectionObserver(entries => {
    if (!entries[0]?.isIntersecting) return;
    scheduleAutoLoadNext('sentinel');
  }, observerOptions);

  topObserver = new globalThis.IntersectionObserver(() => {
    // Intentionally empty - prev chapter loading is triggered by explicit user actions only
  }, observerOptions);

  if (bottomSentinel.value) {
    bottomObserver.observe(bottomSentinel.value);
  }
  if (topSentinel.value) {
    topObserver.observe(topSentinel.value);
  }

  await nextTick();
  await restoreReadingPosition();
  mainRef.value?.focus();

  scheduleAutoLoadNext('state');
});

onUnmounted(() => {
  flushPersistentState();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('pagehide', flushPersistentState);
  if (mainRef.value) {
    mainRef.value.removeEventListener('scroll', handleScroll);
    mainRef.value.removeEventListener('wheel', handleWheel);
    mainRef.value.removeEventListener('touchstart', handleReaderTouchStart);
    mainRef.value.removeEventListener('touchmove', handleReaderTouchMove);
    mainRef.value.removeEventListener('touchend', handleReaderTouchEnd);
    mainRef.value.removeEventListener('touchcancel', handleReaderTouchCancel);
  }

  topObserver?.disconnect();
  bottomObserver?.disconnect();
  topObserver = null;
  bottomObserver = null;

  chapterRefs.clear();
});
</script>

<style scoped>
.mnr-reader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2147483647;
  background: var(--mnr-bg, #ffffff);
  color: var(--mnr-text, #1a1a1a);
  overflow: hidden;
  overscroll-behavior: none;
  display: flex;
  flex-direction: column;
}

/* Main content - with padding for floating toolbar */
.mnr-reader-main {
  flex: 1;
  overflow: auto;
  padding-top: 68px;
  padding-bottom: max(40px, env(safe-area-inset-bottom));
  /* Prevent rubber-band bounce from propagating and messing with prev-chapter positioning */
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

.mnr-reader-content {
  max-width: var(--mnr-max-width, 800px);
  margin: 0 auto;
  padding: var(--mnr-padding, 20px);
  font-family: var(
    --mnr-font-family,
    'Microsoft YaHei',
    'PingFang SC',
    'Noto Sans CJK SC',
    system-ui,
    sans-serif
  );
  font-size: var(--mnr-font-size, 18px);
  line-height: var(--mnr-line-height, 1.8);
  letter-spacing: var(--mnr-letter-spacing, 0.05em);
}

.mnr-reader-content :deep(p) {
  text-indent: var(--mnr-paragraph-indent, 2em);
  margin: 0 0 1em 0;
}

.mnr-reader-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}

.mnr-reader-content :deep(a) {
  color: var(--mnr-link, #1976d2);
}

.mnr-chapter-boundary-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 36px 0 12px;
  padding-top: 18px;
  border-top: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-chapter-boundary-nav button {
  min-width: 92px;
  padding: 9px 14px;
  border: 1px solid var(--mnr-border, #e0e0e0);
  border-radius: 8px;
  background: transparent;
  color: var(--mnr-link, #1976d2);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.mnr-chapter-boundary-nav button:hover {
  background: var(--mnr-border, #f0f0f0);
}

.mnr-chapter-boundary-nav button:disabled {
  opacity: 0.4;
  cursor: default;
}

.mnr-chapter-boundary-nav button:focus-visible,
.mnr-reader-main:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--mnr-link, #1976d2) 55%, transparent);
  outline-offset: 2px;
}

.mnr-chapter-title {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0 0 1em 0;
  color: var(--mnr-text, #1a1a1a);
  line-height: 1.4;
  text-align: center;
}

/* Chapter end */
.mnr-chapter-end {
  max-width: var(--mnr-max-width, 800px);
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.mnr-chapter-end-text {
  color: var(--mnr-text, #666);
  opacity: 0.7;
  margin-bottom: 16px;
}

.mnr-chapter-nav {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.mnr-chapter-link {
  padding: 12px 24px;
  color: var(--mnr-link, #1976d2);
  text-decoration: none;
  border: 1px solid var(--mnr-border, #e0e0e0);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mnr-chapter-link:hover {
  background: var(--mnr-border, #f0f0f0);
}

/* Sentinel elements for IntersectionObserver */
.mnr-sentinel {
  height: 1px;
  width: 100%;
  visibility: hidden;
}

/* Loading indicators */
.mnr-loading-prev,
.mnr-loading-next {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: var(--mnr-text, #666);
}

/* Mobile first - base styles are mobile */
@media (min-width: 768px) {
  .mnr-reader-content {
    padding: 30px;
  }
}

@media (min-width: 1024px) {
  .mnr-reader-content {
    padding: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mnr-chapter-link,
  .mnr-chapter-boundary-nav button {
    transition: none;
  }
}
</style>
