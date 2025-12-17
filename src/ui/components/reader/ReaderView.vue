<template>
  <div class="mnr-reader">
    <!-- Progress indicator -->
    <ProgressIndicator v-if="showProgress" :auto-hide="true" />

    <!-- Floating toolbar -->
    <FloatingToolbar
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
        <div class="mnr-loading-spinner small"></div>
        <span>加载上一章...</span>
      </div>

      <!-- Virtualized chapters -->
      <div :style="{ height: `${topSpacer}px` }"></div>

      <template v-for="entry in visibleChapters" :key="entry.id">
        <article
          :ref="setChapterRef(entry.index)"
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
        <div class="mnr-loading-spinner small"></div>
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
    <div v-if="isLoading" class="mnr-loading-overlay">
      <div class="mnr-loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- Toast message -->
    <Transition name="mnr-toast">
      <div
        v-if="error"
        class="mnr-toast"
        :class="{ 'mnr-toast--error': toastType === 'error' }"
        @click="clearError"
      >
        {{ error }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useReaderStore, type TocEntryWithStatus } from '@/ui/stores/reader';
import { useConfigStore } from '@/ui/stores/config';
import { useRuleStore } from '@/ui/stores/rule';
import { useVirtualChapters } from '@/ui/composables/useVirtualChapters';
import { useKeyboardShortcuts } from '@/ui/composables/useKeyboardShortcuts';
import { closeReader } from '@/bootstrap';
import ProgressIndicator from './ProgressIndicator.vue';
import FloatingToolbar from './FloatingToolbar.vue';
import ChapterDrawer from './ChapterDrawer.vue';
import SettingsPanel from '@/ui/components/settings/SettingsPanel.vue';
import RuleEditorPanel from '@/ui/components/editor/RuleEditorPanel.vue';
import type { SiteRule } from '@/core/rules/types';

// === Constants ===
const SCROLL_THROTTLE_MS = 16; // ~60fps
const INTERSECTION_ROOT_MARGIN = '800px';

// === Utility: Throttle function ===
type AnyFn = (...args: unknown[]) => void; // eslint-disable-line no-unused-vars

function throttle<T extends AnyFn>(fn: T, delay: number): T {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...fnArgs: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn(...fnArgs);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...fnArgs);
      }, remaining);
    }
  }) as T;
}

// Stores
const readerStore = useReaderStore();
const configStore = useConfigStore();
const ruleStore = useRuleStore();

// State
const mainRef = ref<HTMLElement | null>(null);
const topSentinel = ref<HTMLElement | null>(null);
const bottomSentinel = ref<HTMLElement | null>(null);
const settingsVisible = ref(false);
const ruleEditorVisible = ref(false);
const isPickerActive = ref(false);
const drawerOpen = ref(false);
const isNavigating = ref(false);
const chapterRefs = new Map<number, HTMLElement>();

// IntersectionObserver instances
let topObserver: globalThis.IntersectionObserver | null = null;
let bottomObserver: globalThis.IntersectionObserver | null = null;

// Watch picker state to show/hide original page
watch(isPickerActive, active => {
  const hideStyle = document.getElementById('mnr-hide-original');
  const readerRoot = document.getElementById('mnr-reader-root');

  if (active) {
    // Show original page for element selection
    if (hideStyle) {
      hideStyle.setAttribute('data-disabled', 'true');
      hideStyle.textContent = '';
    }
    if (readerRoot) {
      readerRoot.style.display = 'none';
    }
  } else {
    // Restore reader UI
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

// Rule editor state
const currentRule = computed(() => readerStore.rule);
const currentDomain = computed(() => {
  try {
    return new URL(window.location.href).hostname;
  } catch {
    return '';
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
const showProgress = computed(() => configStore.behavior.showProgress);
const cacheProgress = computed(() => readerStore.cacheProgress);

// Keyboard shortcuts enabled state
const keyboardEnabled = computed(
  () => configStore.behavior.keyboardNavigation && !isPickerActive.value
);

// Navigation
function navigate(direction: 'index') {
  if (direction === 'index' && indexUrl.value) {
    window.location.href = indexUrl.value;
  }
}

// Drawer functions
function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
  // Load TOC when opening drawer
  if (drawerOpen.value) {
    readerStore.loadToc();
  }
}

function handleChapterSelect(entry: TocEntryWithStatus) {
  // Check if chapter is cached - smart jump
  if (entry.isCached) {
    jumpToCachedChapter(entry.url);
  } else {
    // Not cached - navigate to the URL (page reload)
    window.location.href = entry.url;
  }
}

/**
 * Jump to a cached chapter without page reload
 */
async function jumpToCachedChapter(url: string) {
  // First check if already in the current chapters array
  const existingIndex = readerStore.chapters.findIndex(entry => entry.chapter.url === url);

  if (existingIndex >= 0) {
    // Already in display list - just scroll to it
    readerStore.setCurrentChapter(existingIndex);
    scrollToChapter(existingIndex);
    return;
  }

  // Not in current chapters - rebuild from cache
  const success = await readerStore.rebuildChaptersAround(url);
  if (success) {
    // Update browser URL without reload
    window.history.replaceState({ mnrChapter: 0 }, '', url);

    // Scroll to top
    mainRef.value?.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    // Fallback to page navigation if cache miss
    window.location.href = url;
  }
}

/**
 * Scroll to a specific chapter in the view
 */
function scrollToChapter(index: number) {
  const chapterEl = chapterRefs.get(index);
  if (chapterEl) {
    chapterEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function handleContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement;

  // Handle link clicks
  if (target.tagName === 'A') {
    const href = target.getAttribute('href');
    if (href && !href.startsWith('javascript:')) {
      // Allow navigation to chapter links
      return;
    }
    e.preventDefault();
  }
}

function clearError() {
  readerStore.clearError();
}

function openRuleEditor() {
  settingsVisible.value = false;
  ruleEditorVisible.value = true;
}

async function handleRuleSave(rule: SiteRule) {
  if (currentDomain.value) {
    try {
      await ruleStore.saveUserRule(currentDomain.value, rule);
      // Reload current chapter to apply new rule
      await readerStore.reloadCurrentChapter();
    } catch (e) {
      console.error('[MNR] Save rule error:', e);
      readerStore.showToast('保存失败', 'error');
    }
  }
  ruleEditorVisible.value = false;
}

async function handleRuleReset() {
  // Close settings panel and reload with default/auto-detection
  settingsVisible.value = false;
  await readerStore.reloadCurrentChapter();
}

function openSettings() {
  settingsVisible.value = true;
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
function setChapterRef(index: number) {
  return (el: HTMLElement | null) => {
    if (!el) {
      chapterRefs.delete(index);
      return;
    }
    chapterRefs.set(index, el);
    const entry = visibleChapters.value.find(c => c.index === index);
    if (entry) {
      setChapterHeight(entry.chapter.url, el.offsetHeight);
    }
  };
}

function estimateIndexFromOffset(offset: number): number {
  if (chapters.value.length === 0) return -1;

  let acc = 0;
  for (let i = 0; i < chapters.value.length; i++) {
    const url = chapters.value[i].chapter.url;
    const height = chapterHeights.value.get(url) ?? averageHeight.value;
    acc += height;
    if (offset < acc) {
      return i;
    }
  }
  return chapters.value.length - 1;
}

// Scroll handling - Core logic (will be throttled)
function handleScrollCore() {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  const currentScrollY = mainEl.scrollTop;
  const scrollHeight = mainEl.scrollHeight - mainEl.clientHeight;

  // Find current visible chapter using visible area calculation
  let currentChapterEl: HTMLElement | null = null;
  let currentChapterIdx = -1;
  let maxVisibleHeight = 0;

  const viewportTop = currentScrollY;
  const viewportBottom = currentScrollY + mainEl.clientHeight;

  for (const entry of visibleChapters.value) {
    const el = chapterRefs.get(entry.index);
    if (!el) continue;

    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const elBottom = elTop + elHeight;

    // Update height cache
    setChapterHeight(entry.chapter.url, elHeight);

    // Calculate visible overlap
    const visibleTop = Math.max(elTop, viewportTop);
    const visibleBottom = Math.min(elBottom, viewportBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    if (visibleHeight > maxVisibleHeight) {
      maxVisibleHeight = visibleHeight;
      currentChapterIdx = entry.index;
      currentChapterEl = el;
    }
  }

  if (!currentChapterEl || currentChapterIdx === -1) {
    // Fallback: when spacer fills the viewport, estimate index from scroll offset
    const estimatedIdx = estimateIndexFromOffset(currentScrollY + mainEl.clientHeight / 2);
    if (estimatedIdx !== -1) {
      readerStore.setCurrentChapter(estimatedIdx);
      updateWindow(estimatedIdx);
      if (scrollHeight > 0) {
        const overallPercent = Math.round((currentScrollY / scrollHeight) * 100);
        readerStore.updateScroll(overallPercent);
      }
    }
    return;
  }

  // Update current chapter in store (this updates header title and browser URL)
  readerStore.setCurrentChapter(currentChapterIdx);

  // Update virtual window based on current chapter
  updateWindow(currentChapterIdx);

  // Update overall scroll progress for UI
  if (scrollHeight > 0) {
    const overallPercent = Math.round((currentScrollY / scrollHeight) * 100);
    readerStore.updateScroll(overallPercent);
  }

  // Note: Chapter loading is now handled by IntersectionObserver, not scroll percentage
}

// Throttled scroll handler
const handleScroll = throttle(handleScrollCore, SCROLL_THROTTLE_MS);

// Load previous chapter with scroll position adjustment
// jumpToStart: true => snap to the start (title) of the newly loaded chapter to avoid bounce
async function loadPrevWithScrollAdjust(jumpToStart = false) {
  const mainEl = mainRef.value;
  if (!mainEl || isLoadingPrev.value) return;

  // 1. Remember current scroll position and topSpacer
  const oldScrollTop = mainEl.scrollTop;
  const oldTopSpacer = topSpacer.value;

  const success = await readerStore.loadPrevChapter();

  if (success) {
    // 2. Wait for Vue to update DOM
    await nextTick();

    // 3. Update virtual window to include new chapter (critical!)
    updateWindow(readerStore.currentChapterIndex);

    // 4. Wait for window change to trigger re-render
    await nextTick();
    await new Promise<void>(resolve => globalThis.requestAnimationFrame(() => resolve()));

    if (jumpToStart) {
      // When user explicitly wants to go to previous chapter, snap to its title
      await jumpToChapter(0, 'auto');
      return;
    }

    // 5. Get new chapter height and cache it
    const chapterEls = mainEl.querySelectorAll('.mnr-reader-content');
    if (chapterEls.length > 0) {
      const newChapterEl = chapterEls[0] as HTMLElement;
      const newChapterHeight = newChapterEl.offsetHeight;

      // 6. Ensure new chapter height is cached
      const newEntry = readerStore.chapters[0];
      if (newEntry) {
        setChapterHeight(newEntry.chapter.url, newChapterHeight);
      }

      // 7. Wait for heights update to trigger reactive updates
      await nextTick();

      // 8. Calculate scroll adjustment including spacer delta
      const spacerDelta = topSpacer.value - oldTopSpacer;
      mainEl.scrollTop = oldScrollTop + newChapterHeight + spacerDelta;
    }
  }
}

// Handle wheel event for loading previous chapter when already at top
function handleWheel(e: WheelEvent) {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  // Only handle upward scroll when at top
  if (
    e.deltaY < 0 &&
    mainEl.scrollTop <= 0 &&
    hasPrev.value &&
    !isLoadingPrev.value &&
    !isNavigating.value
  ) {
    loadPrevWithScrollAdjust();
  }
}

// === Keyboard shortcuts ===

// Escape handler - closes panels (works even in inputs)
function handleEscape() {
  if (drawerOpen.value) {
    drawerOpen.value = false;
  } else if (ruleEditorVisible.value) {
    ruleEditorVisible.value = false;
  } else if (settingsVisible.value) {
    settingsVisible.value = false;
  }
}

// Toggle settings panel
function toggleSettings() {
  if (!ruleEditorVisible.value) {
    settingsVisible.value = !settingsVisible.value;
  }
}

// Toggle rule editor panel
function toggleRuleEditor() {
  if (!settingsVisible.value) {
    ruleEditorVisible.value = !ruleEditorVisible.value;
  }
}

// Register keyboard shortcuts using composable
useKeyboardShortcuts(
  [
    // Escape - close panels (works in inputs too)
    {
      key: 'escape',
      handler: handleEscape,
      allowInInputs: true,
    },
    // Tab - toggle chapter drawer
    {
      key: 'tab',
      handler: toggleDrawer,
      preventDefault: true,
    },
    // Enter - go to index page
    {
      key: 'enter',
      handler: () => {
        if (indexUrl.value) {
          window.location.href = indexUrl.value;
        }
      },
      preventDefault: true,
    },
    // S or , - toggle settings
    {
      key: ['s', ','],
      handler: toggleSettings,
      preventDefault: true,
    },
    // E - toggle rule editor
    {
      key: 'e',
      handler: toggleRuleEditor,
      preventDefault: true,
    },
    // Q - exit reader
    {
      key: 'q',
      handler: exitReader,
      preventDefault: true,
      stopPropagation: true,
    },
    // Left arrow or P - previous chapter
    {
      key: ['arrowleft', 'p'],
      handler: () => navigateChapter('prev'),
      preventDefault: true,
      stopPropagation: true,
    },
    // Right arrow or N - next chapter
    {
      key: ['arrowright', 'n'],
      handler: () => navigateChapter('next'),
      preventDefault: true,
      stopPropagation: true,
    },
    // Up arrow - scroll up
    {
      key: 'arrowup',
      handler: () => scrollReader('up'),
      preventDefault: true,
    },
    // Down arrow - scroll down
    {
      key: 'arrowdown',
      handler: () => scrollReader('down'),
      preventDefault: true,
    },
    // Space - page scroll
    {
      key: ' ',
      handler: e => scrollReader(e.shiftKey ? 'pageup' : 'pagedown'),
      preventDefault: true,
    },
  ],
  { enabled: keyboardEnabled }
);

// Scroll content
function scrollReader(direction: 'up' | 'down' | 'pageup' | 'pagedown') {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  const step = 150; // slightly more than standard line height
  const pageHeight = mainEl.clientHeight * 0.9;

  let top = 0;
  let behavior: 'auto' | 'smooth' = 'auto';

  switch (direction) {
    case 'up': {
      // If already at the very top, load previous chapter
      if (mainEl.scrollTop <= 4 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
        loadPrevWithScrollAdjust(true);
        return;
      }
      top = -step;
      break;
    }
    case 'down':
      top = step;
      break;
    case 'pageup': {
      // If already at the very top, directly load previous chapter and snap to its title
      if (mainEl.scrollTop <= 4 && hasPrev.value && !isLoadingPrev.value && !isNavigating.value) {
        loadPrevWithScrollAdjust(true);
        return;
      }
      top = -pageHeight;
      behavior = 'smooth';
      break;
    }
    case 'pagedown':
      top = pageHeight;
      behavior = 'smooth';
      break;
  }

  mainEl.scrollBy({ top, behavior });
}

// Navigate to previous or next chapter
async function navigateChapter(direction: 'prev' | 'next') {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  const currentIdx = readerStore.currentChapterIndex;
  const chaptersCount = readerStore.chapters.length;

  // Smart lock: allow navigation if the previous one is almost done (e.g. DOM updated),
  // but prevent instant double-clicks.
  // If navigating, we ignore request only if it's very recent.
  if (isNavigating.value) {
    // Optional: add timestamp check here if needed, but for now rely on jumpToChapter's shorter lock
    return;
  }

  if (direction === 'prev') {
    if (currentIdx > 0) {
      jumpToChapter(currentIdx - 1);
    } else if (hasPrev.value && !isLoadingPrev.value) {
      const success = await readerStore.loadPrevChapter();
      if (success) {
        // Use auto scroll to prevent bounce/race condition with top observer
        globalThis.requestAnimationFrame(() => jumpToChapter(0, 'auto'));
      }
    } else if (!hasPrev.value) {
      // Show toast when no previous chapter available
      readerStore.showToast('已经是第一章了', 'info');
    }
  } else {
    if (currentIdx < chaptersCount - 1) {
      jumpToChapter(currentIdx + 1);
    } else if (hasNext.value && !isLoadingNext.value) {
      const success = await readerStore.loadNextChapter();
      if (success) {
        globalThis.requestAnimationFrame(() => jumpToChapter(readerStore.chapters.length - 1));
      }
    } else if (!hasNext.value) {
      // Show toast when no next chapter available
      readerStore.showToast('已经是最后一章了', 'info');
    }
  }
}

// Jump to a specific chapter by index
async function jumpToChapter(index: number, behavior: 'auto' | 'smooth' = 'smooth') {
  const mainEl = mainRef.value;
  if (!mainEl) return;
  if (index < 0 || index >= chapters.value.length) return;

  isNavigating.value = true;

  // Update virtual window first to include target chapter
  updateWindow(index);

  // Wait for Vue to update the DOM after window change
  await nextTick();
  // Wait a frame so layout/offsets are correct
  await new Promise<void>(resolve => globalThis.requestAnimationFrame(() => resolve()));

  const targetEl = chapterRefs.get(index);
  if (!targetEl) {
    isNavigating.value = false;
    return;
  }

  const containerRect = mainEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const targetOffset = targetRect.top - containerRect.top + mainEl.scrollTop;
  mainEl.scrollTo({
    top: targetOffset,
    behavior,
  });

  // Update current chapter index
  readerStore.setCurrentChapter(index);

  // Reset navigating flag
  if (behavior === 'smooth') {
    // Reduced lock time to allow faster sequential navigation.
    // 200ms is enough to prevent accidental double-clicks but feels responsive.
    // The browser's smooth scroll will continue, but we accept new input.
    setTimeout(() => {
      isNavigating.value = false;
    }, 200);
  } else {
    // Immediate reset for auto scroll
    globalThis.requestAnimationFrame(() => {
      isNavigating.value = false;
    });
  }
}

// Exit reader mode
function exitReader() {
  closeReader();
}

// Lifecycle
onMounted(async () => {
  // Apply theme and settings
  configStore.applyAll();

  // Apply initial text conversion if set
  const textConversion = configStore.reading.textConversion;
  if (textConversion !== 'none') {
    await readerStore.applyTextConversion(textConversion);
  }

  // Event listeners
  if (mainRef.value) {
    mainRef.value.addEventListener('scroll', handleScroll, { passive: true });
    mainRef.value.addEventListener('wheel', handleWheel, { passive: true });
  }
  // Keyboard shortcuts are handled by useKeyboardShortcuts composable

  // Setup IntersectionObservers for infinite scroll
  const observerOptions = {
    root: mainRef.value,
    rootMargin: INTERSECTION_ROOT_MARGIN,
    threshold: 0,
  };

  // Bottom sentinel - load next chapter
  bottomObserver = new globalThis.IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasNext.value && !isLoadingNext.value && !isNavigating.value) {
      readerStore.loadNextChapter();
    }
  }, observerOptions);

  // Top sentinel - NO auto-load for previous chapter
  // Previous chapter loading is now ONLY triggered by explicit user actions:
  // - Wheel scroll up when at top (handleWheel)
  // - Keyboard shortcuts (ArrowUp/PageUp when at top)
  // This prevents unwanted bounce during programmatic navigation
  topObserver = new globalThis.IntersectionObserver(() => {
    // Intentionally empty - we keep the observer for potential future use
    // but don't auto-trigger prev chapter loading
  }, observerOptions);

  if (bottomSentinel.value) {
    bottomObserver.observe(bottomSentinel.value);
  }
  if (topSentinel.value) {
    topObserver.observe(topSentinel.value);
  }

  // Auto-focus main content for keyboard shortcuts
  await nextTick();
  mainRef.value?.focus();
});

onUnmounted(() => {
  if (mainRef.value) {
    mainRef.value.removeEventListener('scroll', handleScroll);
    mainRef.value.removeEventListener('wheel', handleWheel);
  }
  // Keyboard shortcuts cleanup is handled by useKeyboardShortcuts composable

  // Cleanup IntersectionObservers
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
  z-index: 99999;
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

.mnr-loading-spinner.small {
  width: 24px;
  height: 24px;
  border: 2px solid var(--mnr-border, #e0e0e0);
  border-top-color: var(--mnr-link, #1976d2);
  border-radius: 50%;
  animation: mnr-spin 1s linear infinite;
}

/* Loading overlay */
.mnr-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #fff;
  z-index: 1000;
}

.mnr-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: mnr-spin 1s linear infinite;
}

@keyframes mnr-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Toast */
.mnr-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  z-index: 1001;
}

.mnr-toast--error {
  background: #d32f2f;
}

.mnr-toast-enter-active,
.mnr-toast-leave-active {
  transition: all 0.3s ease;
}

.mnr-toast-enter-from,
.mnr-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
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
