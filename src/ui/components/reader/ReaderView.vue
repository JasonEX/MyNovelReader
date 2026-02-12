<template>
  <div
    class="mnr-reader"
    @click="shieldEvent"
    @mousedown="shieldEvent"
    @mouseup="shieldEvent"
    @touchstart="shieldEvent"
    @touchend="shieldEvent"
    @pointerdown="shieldEvent"
    @pointerup="shieldEvent"
  >
    <!-- Progress indicator -->
    <ProgressIndicator v-if="showProgress" :percent="scrollPercent" :auto-hide="true" />

    <!-- Floating toolbar -->
    <FloatingToolbar
      :visible="showControls"
      :cache-running="cacheProgress.running"
      :cache-done="cacheProgress.done"
      :cache-total="cacheProgress.total"
      :cache-disabled="cacheProgress.running && cacheProgress.total === 0"
      @toggle-drawer="toggleDrawer"
      @toggle-cache="toggleCacheAll"
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

      <!-- Virtualized chapters -->
      <div :style="{ height: `${topSpacer}px` }"></div>

      <template v-for="entry in visibleChapters" :key="entry.id">
        <article
          :ref="setChapterRef(entry.chapter.url)"
          class="mnr-reader-content"
          :data-chapter-url="entry.chapter.url"
          @click="handleContentClick"
        >
          <h1 class="mnr-chapter-title">{{ entry.chapter.title }}</h1>
          <div v-html="entry.chapter.content"></div>
        </article>
      </template>

      <div :style="{ height: `${bottomSpacer}px` }"></div>

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
      :domain="currentDomain"
      @close="settingsVisible = false"
      @editRule="openRuleEditor"
      @resetRule="handleRuleReset"
      @textConversionChange="handleTextConversionChange"
      @cacheAll="handleCacheAll"
    />

    <!-- Rule editor panel -->
    <div
      v-if="ruleEditorVisible"
      class="mnr-rule-editor-overlay"
      :class="{ 'mnr-overlay-hidden': isPickerActive }"
    >
      <div class="mnr-rule-editor-container">
        <RuleEditorPanel
          :rule="currentRule"
          :domain="currentDomain"
          @save="handleRuleSave"
          @cancel="ruleEditorVisible = false"
          @pickerStateChange="isPickerActive = $event"
        />
      </div>
    </div>

    <!-- Loading overlay -->
    <MnrLoadingOverlay v-if="isLoading">
      <span>加载中...</span>
    </MnrLoadingOverlay>

    <!-- Toast message -->
    <MnrToast :message="error ?? ''" :type="toastType" :visible="!!error" @dismiss="clearError" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useReaderStore, type TocEntryWithStatus } from '@/ui/stores/reader';
import { useConfigStore } from '@/ui/stores/config';
import { useRuleStore } from '@/ui/stores/rule';
import { useVirtualChapters } from '@/ui/composables/useVirtualChapters';
import { useKeyboardShortcuts } from '@/ui/composables/useKeyboardShortcuts';
import { useReaderScroll } from '@/ui/composables/reader/useReaderScroll';
import {
  useReaderAutoLoad,
  INTERSECTION_ROOT_MARGIN_PX,
} from '@/ui/composables/reader/useReaderAutoLoad';
import { useTouchGestures } from '@/ui/composables/reader/useTouchGestures';
import { useChapterNavigation } from '@/ui/composables/reader/useChapterNavigation';
import { useReaderUIControls } from '@/ui/composables/reader/useReaderUIControls';
import { closeReader } from '@/bootstrap';
import ProgressIndicator from './ProgressIndicator.vue';
import FloatingToolbar from './FloatingToolbar.vue';
import ChapterDrawer from './ChapterDrawer.vue';
import SettingsPanel from '@/ui/components/settings/SettingsPanel.vue';
import RuleEditorPanel from '@/ui/components/editor/RuleEditorPanel.vue';
import { MnrSpinner, MnrToast, MnrLoadingOverlay } from '@/ui/components/common';

// Stores
const readerStore = useReaderStore();
const configStore = useConfigStore();
const ruleStore = useRuleStore();

// State
const mainRef = ref<HTMLElement | null>(null);
const topSentinel = ref<HTMLElement | null>(null);
const bottomSentinel = ref<HTMLElement | null>(null);
const isNavigating = ref(false);
const showControls = ref(true);
const chapterRefs = new Map<string, HTMLElement>();

// UI controls composable
const {
  settingsVisible,
  ruleEditorVisible,
  isPickerActive,
  drawerOpen,
  currentRule,
  currentDomain,
  toggleDrawer,
  openSettings,
  openRuleEditor,
  handleRuleSave,
  handleRuleReset,
  handleEscape,
  toggleSettings,
  toggleRuleEditor,
} = useReaderUIControls({ readerStore, ruleStore, showControls });

// IntersectionObserver instances
let topObserver: globalThis.IntersectionObserver | null = null;
let bottomObserver: globalThis.IntersectionObserver | null = null;

// Watch picker state to show/hide original page
watch(isPickerActive, active => {
  const hideStyle = document.getElementById('mnr-hide-original');
  const readerRoot = document.getElementById('mnr-reader-root');

  if (active) {
    if (hideStyle) {
      hideStyle.setAttribute('data-disabled', 'true');
      hideStyle.textContent = '';
    }
    if (readerRoot) {
      readerRoot.style.display = 'none';
    }
  } else {
    if (hideStyle && hideStyle.hasAttribute('data-disabled')) {
      hideStyle.removeAttribute('data-disabled');
      hideStyle.textContent = `
        body > *:not(#mnr-reader-root):not(#mnr-prompt-root):not(script):not(style) {
          display: none !important;
        }
      `;
    }
    if (readerRoot) {
      readerRoot.style.display = '';
    }
  }
});

// Computed
const chapters = computed(() => readerStore.chapters);

// Virtual chapters composable
const {
  visibleChapters,
  topSpacer,
  bottomSpacer,
  heights: chapterHeights,
  averageHeight,
  setHeight: setChapterHeight,
  updateWindow,
} = useVirtualChapters(chapters, {
  windowSize: 5,
  overscan: 2,
});

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

// === Composables ===

// Auto-load composable (must be initialized before scroll composable)
const { autoLoadArmed, scheduleAutoLoadNext, lastAutoLoadScrollTop, autoLoadShortChainCount } =
  useReaderAutoLoad({
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
  visibleChapters,
  chapterRefs,
  chapterHeights,
  averageHeight,
  setChapterHeight,
  updateWindow,
  readerStore,
  autoHideHeader,
  showControls,
  isNavigating,
  autoLoadArmed,
  lastAutoLoadScrollTop,
  autoLoadShortChainCount,
  scheduleAutoLoadNext,
});

// Chapter navigation composable
const { navigateChapter, jumpToCachedChapter, scrollReader, handleWheel } = useChapterNavigation({
  mainRef,
  chapters,
  chapterRefs,
  readerStore,
  isNavigating,
  isLoadingPrev,
  isLoadingNext,
  hasPrev,
  hasNext,
  topSpacer,
  setChapterHeight,
  updateWindow,
});

// Touch gestures composable
const swipeEnabled = computed(() => configStore.behavior.swipeGestures && !isPickerActive.value);
const { handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } = useTouchGestures({
  enabled: swipeEnabled,
  onSwipeLeft: () => void navigateChapter('next'),
  onSwipeRight: () => void navigateChapter('prev'),
});

// === UI event handlers ===

function shieldEvent(event: Event) {
  event.stopPropagation();
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

function handleCacheAll() {
  readerStore.startCacheAll();
}

function toggleCacheAll() {
  if (cacheProgress.value.running) {
    readerStore.cancelCacheAll();
  } else {
    readerStore.startCacheAll();
  }
}

// Ref setter for virtualized chapters
function setChapterRef(url: string) {
  return (el: HTMLElement | null) => {
    if (!el) {
      chapterRefs.delete(url);
      return;
    }
    chapterRefs.set(url, el);
    setChapterHeight(url, el.offsetHeight);
  };
}

function exitReader() {
  closeReader();
}

// === Keyboard shortcuts ===

const keyboardEnabled = computed(
  () => configStore.behavior.keyboardNavigation && !isPickerActive.value
);

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
    { key: 'e', handler: toggleRuleEditor, preventDefault: true },
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

onMounted(async () => {
  configStore.applyAll();

  const textConversion = configStore.reading.textConversion;
  if (textConversion !== 'none') {
    await readerStore.applyTextConversion(textConversion);
  }

  if (mainRef.value) {
    mainRef.value.addEventListener('scroll', handleScroll, { passive: true });
    mainRef.value.addEventListener('wheel', handleWheel, { passive: true });
    mainRef.value.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainRef.value.addEventListener('touchmove', handleTouchMove, { passive: true });
    mainRef.value.addEventListener('touchend', handleTouchEnd, { passive: true });
    mainRef.value.addEventListener('touchcancel', handleTouchCancel, { passive: true });
  }

  const observerOptions = {
    root: mainRef.value,
    rootMargin: INTERSECTION_ROOT_MARGIN,
    threshold: 0,
  };

  bottomObserver = new globalThis.IntersectionObserver(entries => {
    if (!entries[0]?.isIntersecting) return;
    scheduleAutoLoadNext();
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
  mainRef.value?.focus();

  scheduleAutoLoadNext();
});

onUnmounted(() => {
  if (mainRef.value) {
    mainRef.value.removeEventListener('scroll', handleScroll);
    mainRef.value.removeEventListener('wheel', handleWheel);
    mainRef.value.removeEventListener('touchstart', handleTouchStart);
    mainRef.value.removeEventListener('touchmove', handleTouchMove);
    mainRef.value.removeEventListener('touchend', handleTouchEnd);
    mainRef.value.removeEventListener('touchcancel', handleTouchCancel);
  }

  topObserver?.disconnect();
  bottomObserver?.disconnect();
  topObserver = null;
  bottomObserver = null;
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
  display: flex;
  flex-direction: column;
}

/* Main content - with padding for floating toolbar */
.mnr-reader-main {
  flex: 1;
  overflow: auto;
  padding-top: 68px;
  padding-bottom: 40px;
  /* Prevent rubber-band bounce from propagating and messing with prev-chapter positioning */
  overscroll-behavior: contain;
}

.mnr-reader-content {
  max-width: var(--mnr-max-width, 800px);
  margin: 0 auto;
  padding: var(--mnr-padding, 20px);
  font-family: var(--mnr-font-family, system-ui);
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

/* Rule editor overlay */
.mnr-rule-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
}

.mnr-rule-editor-overlay.mnr-overlay-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.mnr-rule-editor-container {
  background: var(--mnr-bg, #fff);
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
