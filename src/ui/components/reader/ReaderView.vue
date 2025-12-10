<template>
  <div class="mnr-reader">
    <!-- Progress indicator -->
    <ProgressIndicator v-if="showProgress" :auto-hide="true" />

    <!-- Header - fixed position -->
    <header class="mnr-reader-header" :class="{ hidden: headerHidden }">
      <div class="mnr-header-left">
        <button class="mnr-header-btn" title="返回" @click="handleBack">←</button>
      </div>
      <div class="mnr-header-center">
        <h1 class="mnr-chapter-title">{{ currentTitle }}</h1>
        <span v-if="bookTitle" class="mnr-book-title">{{ bookTitle }}</span>
      </div>
      <div class="mnr-header-right">
        <button class="mnr-header-btn" title="设置" @click="openSettings">⚙</button>
      </div>
    </header>

    <!-- Main content with infinite scroll -->
    <main ref="mainRef" class="mnr-reader-main">
      <!-- Loading previous indicator -->
      <div v-if="isLoadingPrev" class="mnr-loading-prev">
        <div class="mnr-loading-spinner small"></div>
        <span>加载上一章...</span>
      </div>

      <!-- All chapters -->
      <template v-for="entry in chapters" :key="entry.id">
        <!-- Chapter separator (except for first) -->
        <div v-if="chapters.indexOf(entry) > 0" class="mnr-chapter-separator">
          <span class="mnr-separator-line"></span>
          <span class="mnr-separator-title">{{ entry.chapter.title }}</span>
          <span class="mnr-separator-line"></span>
        </div>

        <!-- Chapter content -->
        <article
          class="mnr-reader-content"
          :data-chapter-url="entry.chapter.url"
          @click="handleContentClick"
          v-html="entry.chapter.content"
        ></article>
      </template>

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
      @close="settingsVisible = false"
      @editRule="openRuleEditor"
      @textConversionChange="handleTextConversionChange"
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

    <!-- Error message -->
    <div v-if="error" class="mnr-error-toast" @click="clearError">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useReaderStore } from '@/ui/stores/reader';
import { useConfigStore } from '@/ui/stores/config';
import { useRuleStore } from '@/ui/stores/rule';
import { closeReader } from '@/bootstrap';
import ProgressIndicator from './ProgressIndicator.vue';
import SettingsPanel from '@/ui/components/settings/SettingsPanel.vue';
import RuleEditorPanel from '@/ui/components/editor/RuleEditorPanel.vue';
import type { SiteRule } from '@/core/rules/types';

// Stores
const readerStore = useReaderStore();
const configStore = useConfigStore();
const ruleStore = useRuleStore();

// State
const mainRef = ref<HTMLElement | null>(null);
const settingsVisible = ref(false);
const ruleEditorVisible = ref(false);
const isPickerActive = ref(false);
const headerHidden = ref(false);

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
let lastScrollY = 0;
let loadDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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
const currentTitle = computed(() => readerStore.title);
const bookTitle = computed(() => readerStore.bookTitle);
const indexUrl = computed(() => readerStore.chapter?.indexUrl);
const isLoading = computed(() => readerStore.isLoading);
const isLoadingPrev = computed(() => readerStore.isLoadingPrev);
const isLoadingNext = computed(() => readerStore.isLoadingNext);
const hasNext = computed(() => readerStore.hasNext);
const hasPrev = computed(() => readerStore.hasPrev);
const error = computed(() => readerStore.error);
const showProgress = computed(() => configStore.behavior.showProgress);
const autoHideHeader = computed(() => configStore.behavior.autoHideHeader);

// Navigation
function navigate(direction: 'index') {
  if (direction === 'index' && indexUrl.value) {
    window.location.href = indexUrl.value;
  }
}

function handleBack() {
  if (indexUrl.value) {
    window.location.href = indexUrl.value;
  } else {
    window.history.back();
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
    await ruleStore.saveUserRule(currentDomain.value, rule);
  }
  ruleEditorVisible.value = false;
}

function openSettings() {
  settingsVisible.value = true;
}

async function handleTextConversionChange(mode: 'none' | 'sc' | 'tc') {
  await readerStore.applyTextConversion(mode);
}

// Scroll handling with infinite scroll
function handleScroll() {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  const currentScrollY = mainEl.scrollTop;
  const scrollHeight = mainEl.scrollHeight - mainEl.clientHeight;

  // Auto-hide header
  if (autoHideHeader.value) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      headerHidden.value = true;
    } else {
      headerHidden.value = false;
    }
  }

  lastScrollY = currentScrollY;

  // Find current visible chapter and calculate position within it
  const chapterEls = mainEl.querySelectorAll('.mnr-reader-content');
  if (chapterEls.length === 0) return;

  // Find which chapter is currently in view
  let currentChapterEl: Element | null = null;
  let currentChapterIdx = 0;
  const viewportTop = currentScrollY;
  const viewportBottom = currentScrollY + mainEl.clientHeight;

  for (let i = 0; i < chapterEls.length; i++) {
    const el = chapterEls[i] as HTMLElement;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;

    // Check if this chapter is in viewport
    if (elTop <= viewportBottom && elBottom >= viewportTop) {
      currentChapterEl = el;
      currentChapterIdx = i;
      break;
    }
  }

  if (!currentChapterEl) return;

  // Update current chapter in store (this updates header title and browser URL)
  readerStore.setCurrentChapter(currentChapterIdx);

  const chapterEl = currentChapterEl as HTMLElement;
  const chapterTop = chapterEl.offsetTop;
  const chapterHeight = chapterEl.offsetHeight;

  // Calculate position within current chapter
  const posInChapter = currentScrollY - chapterTop + mainEl.clientHeight;
  const chapterPercent = Math.round((posInChapter / chapterHeight) * 100);
  const clampedPercent = Math.max(0, Math.min(100, chapterPercent));

  // Update overall scroll progress for UI
  if (scrollHeight > 0) {
    const overallPercent = Math.round((currentScrollY / scrollHeight) * 100);
    readerStore.updateScroll(overallPercent);
  }

  // Debounce loading
  if (loadDebounceTimer) clearTimeout(loadDebounceTimer);

  // Preload next chapter when past 70% of LAST chapter
  const isLastChapter = currentChapterIdx === chapterEls.length - 1;
  if (isLastChapter && clampedPercent >= 70 && hasNext.value && !isLoadingNext.value) {
    loadDebounceTimer = setTimeout(() => {
      readerStore.loadNextChapter();
    }, 200);
  }

  // Preload previous chapter when in top 30% of FIRST chapter
  const isFirstChapter = currentChapterIdx === 0;
  if (isFirstChapter && clampedPercent <= 30 && hasPrev.value && !isLoadingPrev.value) {
    loadDebounceTimer = setTimeout(async () => {
      const oldScrollHeight = mainEl.scrollHeight;
      const success = await readerStore.loadPrevChapter();
      if (success) {
        globalThis.requestAnimationFrame(() => {
          const newScrollHeight = mainEl.scrollHeight;
          const addedHeight = newScrollHeight - oldScrollHeight;
          mainEl.scrollTop = currentScrollY + addedHeight;
        });
      }
    }, 200);
  }
}

// Handle wheel event for loading previous chapter when already at top
function handleWheel(e: WheelEvent) {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  // Only handle upward scroll when at top
  if (e.deltaY < 0 && mainEl.scrollTop <= 0 && hasPrev.value && !isLoadingPrev.value) {
    if (loadDebounceTimer) clearTimeout(loadDebounceTimer);
    loadDebounceTimer = setTimeout(async () => {
      const oldScrollHeight = mainEl.scrollHeight;
      const success = await readerStore.loadPrevChapter();
      if (success) {
        globalThis.requestAnimationFrame(() => {
          const newScrollHeight = mainEl.scrollHeight;
          const addedHeight = newScrollHeight - oldScrollHeight;
          mainEl.scrollTop = addedHeight;
        });
      }
    }, 200);
  }
}

// Keyboard navigation
function handleKeyDown(e: KeyboardEvent) {
  // Don't handle shortcuts when picker is active
  if (isPickerActive.value) return;

  // Always handle Escape to close panels or exit reader
  if (e.key === 'Escape') {
    if (ruleEditorVisible.value) {
      ruleEditorVisible.value = false;
      e.preventDefault();
      return;
    }
    if (settingsVisible.value) {
      settingsVisible.value = false;
      e.preventDefault();
      return;
    }
    return;
  }

  // Don't handle other shortcuts if keyboard nav is disabled
  if (!configStore.behavior.keyboardNavigation) return;

  // Don't handle shortcuts when typing in inputs
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
    return;
  }

  switch (e.key.toLowerCase()) {
    // 's' or ',' to toggle settings
    case 's':
    case ',':
      if (!ruleEditorVisible.value) {
        settingsVisible.value = !settingsVisible.value;
        e.preventDefault();
      }
      break;

    // 'e' to toggle rule editor
    case 'e':
      if (!settingsVisible.value) {
        ruleEditorVisible.value = !ruleEditorVisible.value;
        e.preventDefault();
      }
      break;

    // 'q' to exit reader mode
    case 'q':
      e.preventDefault();
      e.stopPropagation();
      exitReader();
      break;

    // Left arrow or 'p' - previous chapter
    case 'arrowleft':
    case 'p':
      e.preventDefault();
      e.stopPropagation();
      navigateChapter('prev');
      break;

    // Right arrow or 'n' - next chapter
    case 'arrowright':
    case 'n':
      e.preventDefault();
      e.stopPropagation();
      navigateChapter('next');
      break;
  }
}

// Navigate to previous or next chapter
async function navigateChapter(direction: 'prev' | 'next') {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  const currentIdx = readerStore.currentChapterIndex;
  const chaptersCount = readerStore.chapters.length;

  if (direction === 'prev') {
    if (currentIdx > 0) {
      jumpToChapter(currentIdx - 1);
    } else if (hasPrev.value && !isLoadingPrev.value) {
      const success = await readerStore.loadPrevChapter();
      if (success) {
        globalThis.requestAnimationFrame(() => jumpToChapter(0));
      }
    }
  } else {
    if (currentIdx < chaptersCount - 1) {
      jumpToChapter(currentIdx + 1);
    } else if (hasNext.value && !isLoadingNext.value) {
      const success = await readerStore.loadNextChapter();
      if (success) {
        globalThis.requestAnimationFrame(() => jumpToChapter(readerStore.chapters.length - 1));
      }
    }
  }
}

// Jump to a specific chapter by index
function jumpToChapter(index: number) {
  const mainEl = mainRef.value;
  if (!mainEl) return;

  const chapterEls = mainEl.querySelectorAll('.mnr-reader-content');
  if (index < 0 || index >= chapterEls.length) return;

  const targetEl = chapterEls[index] as HTMLElement;
  mainEl.scrollTo({
    top: targetEl.offsetTop,
    behavior: 'smooth',
  });

  // Update current chapter index
  readerStore.setCurrentChapter(index);
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
  // Use capture to handle events before other listeners
  window.addEventListener('keydown', handleKeyDown, true);
});

onUnmounted(() => {
  if (mainRef.value) {
    mainRef.value.removeEventListener('scroll', handleScroll);
    mainRef.value.removeEventListener('wheel', handleWheel);
  }
  window.removeEventListener('keydown', handleKeyDown, true);
  if (loadDebounceTimer) clearTimeout(loadDebounceTimer);
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

/* Header - fixed, inherits background from parent */
.mnr-reader-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: inherit;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.mnr-reader-header.hidden {
  transform: translateY(-100%);
  opacity: 0;
  position: absolute;
  width: 100%;
}

.mnr-header-left,
.mnr-header-right {
  width: 48px;
}

.mnr-header-center {
  flex: 1;
  text-align: center;
  overflow: hidden;
}

.mnr-header-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: var(--mnr-text, #333);
  border-radius: 8px;
}

.mnr-header-btn:hover {
  background: var(--mnr-border, #e0e0e0);
}

.mnr-chapter-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--mnr-text, #333);
}

.mnr-book-title {
  font-size: 12px;
  color: var(--mnr-text, #666);
  opacity: 0.7;
}

/* Main content */
.mnr-reader-main {
  flex: 1;
  overflow: auto;
  padding-bottom: 40px;
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

/* Chapter separator */
.mnr-chapter-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: var(--mnr-max-width, 800px);
  margin: 40px auto;
  padding: 0 20px;
}

.mnr-separator-line {
  flex: 1;
  height: 1px;
  background: var(--mnr-border, #e0e0e0);
}

.mnr-separator-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--mnr-text, #333);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
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

/* Error toast */
.mnr-error-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #d32f2f;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  z-index: 1001;
  animation: mnr-fade-in 0.3s ease;
}

@keyframes mnr-fade-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Mobile first - base styles are mobile */
@media (min-width: 768px) {
  .mnr-reader-header {
    padding: 16px 24px;
  }

  .mnr-chapter-title {
    font-size: 18px;
  }

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
