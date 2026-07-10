<template>
  <Transition name="mnr-fade">
    <div v-if="isOpen" class="mnr-drawer-overlay" @click="emit('close')" />
  </Transition>

  <aside
    ref="drawerRef"
    class="mnr-drawer"
    :class="{ open: isOpen }"
    :aria-hidden="!isOpen"
    :inert="!isOpen"
    role="dialog"
    aria-modal="true"
    aria-labelledby="mnr-drawer-title"
    @keydown.esc.stop="emit('close')"
    @keydown.tab="trapFocus"
  >
    <header class="mnr-drawer-header">
      <div class="mnr-drawer-heading">
        <h3 id="mnr-drawer-title" class="mnr-drawer-title">{{ bookTitle || '目录' }}</h3>
        <span v-if="currentChapterNumber" class="mnr-drawer-position">
          第 {{ currentChapterNumber }} / {{ chapters.length }} 章
        </span>
      </div>
      <button
        ref="closeButtonRef"
        class="mnr-drawer-close"
        aria-label="关闭目录"
        @click="emit('close')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </header>

    <div v-if="chapters.length > SEARCH_THRESHOLD" class="mnr-drawer-search">
      <label class="mnr-visually-hidden" for="mnr-chapter-search">搜索章节</label>
      <input
        id="mnr-chapter-search"
        v-model.trim="query"
        type="search"
        placeholder="搜索章节"
        autocomplete="off"
        @input="resetVirtualWindow"
      />
    </div>

    <div class="mnr-drawer-tools">
      <button class="mnr-cache-action" @click="emit('cacheAll')">
        {{ cacheProgress.running ? '取消缓存' : '离线缓存' }}
        <span v-if="cacheProgress.total > 0">
          {{ cacheProgress.done }}/{{ cacheProgress.total }}
        </span>
      </button>
      <button
        v-if="!cacheProgress.running && cacheProgress.failed > 0"
        class="mnr-cache-action"
        @click="emit('retryCache')"
      >
        重试失败 {{ cacheProgress.failed }} 章
      </button>
    </div>

    <div v-if="cacheProgress.running" class="mnr-cache-progress-track" aria-hidden="true">
      <div class="mnr-cache-progress-fill" :style="{ width: `${cachePercent}%` }"></div>
    </div>

    <div v-if="persistedCount > 0 || sessionCount > 0" class="mnr-cache-stats">
      <span v-if="persistedCount > 0">已保存 {{ persistedCount }} 章</span>
      <span v-if="sessionCount > 0">临时 {{ sessionCount }} 章</span>
    </div>

    <div v-if="loading" class="mnr-drawer-state">
      <MnrSpinner size="small" />
      <span>加载目录中...</span>
    </div>

    <div v-else-if="chapters.length === 0" class="mnr-drawer-state">暂无目录</div>

    <div v-else-if="filteredChapters.length === 0" class="mnr-drawer-state">没有匹配的章节</div>

    <div v-else ref="contentRef" class="mnr-drawer-content" @scroll.passive="handleScroll">
      <ul
        class="mnr-chapter-list"
        :style="{ paddingTop: `${topSpacer}px`, paddingBottom: `${bottomSpacer}px` }"
      >
        <li v-for="ch in visibleChapters" :key="ch.url">
          <button
            class="mnr-chapter-button"
            :class="{
              active: ch.isCurrent,
              cached: ch.isCached && !ch.isPersisted && !ch.isCurrent,
              persisted: ch.isPersisted && !ch.isCurrent,
            }"
            :aria-current="ch.isCurrent ? 'page' : undefined"
            @click="handleSelect(ch)"
          >
            <span v-if="ch.isPersisted" class="mnr-cache-mark" aria-label="已离线缓存">✓</span>
            <span v-else-if="ch.isCached" class="mnr-cache-mark" aria-label="已临时缓存">○</span>
            <span class="mnr-chapter-title-text">{{ ch.title }}</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { CacheProgressState, TocEntryWithStatus } from '@/ui/stores/reader';
import { MnrSpinner } from '@/ui/components/common';

const props = defineProps<{
  isOpen: boolean;
  bookTitle?: string;
  chapters: TocEntryWithStatus[];
  loading: boolean;
  cacheProgress: CacheProgressState;
}>();

const emit = defineEmits<{
  close: [];
  select: [entry: TocEntryWithStatus];
  cacheAll: [];
  retryCache: [];
}>();

const SEARCH_THRESHOLD = 50;
const ROW_HEIGHT = 44;
const OVERSCAN = 8;
const contentRef = ref<HTMLElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<globalThis.HTMLButtonElement | null>(null);
const query = ref('');
const scrollTop = ref(0);
const viewportHeight = ref(600);
let previouslyFocused: HTMLElement | null = null;

const filteredChapters = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase();
  if (!needle) return props.chapters;
  return props.chapters.filter(chapter => chapter.title.toLocaleLowerCase().includes(needle));
});

const currentChapterNumber = computed(() => {
  const index = props.chapters.findIndex(chapter => chapter.isCurrent);
  return index >= 0 ? index + 1 : 0;
});
const persistedCount = computed(() => props.chapters.filter(chapter => chapter.isPersisted).length);
const sessionCount = computed(
  () => props.chapters.filter(chapter => chapter.isCached && !chapter.isPersisted).length
);
const cachePercent = computed(() => {
  if (props.cacheProgress.total <= 0) return 0;
  return Math.min(100, (props.cacheProgress.done / props.cacheProgress.total) * 100);
});
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / ROW_HEIGHT) - OVERSCAN));
const visibleCount = computed(() => Math.ceil(viewportHeight.value / ROW_HEIGHT) + OVERSCAN * 2);
const endIndex = computed(() =>
  Math.min(filteredChapters.value.length, startIndex.value + visibleCount.value)
);
const visibleChapters = computed(() =>
  filteredChapters.value.slice(startIndex.value, endIndex.value)
);
const topSpacer = computed(() => startIndex.value * ROW_HEIGHT);
const bottomSpacer = computed(() =>
  Math.max(0, (filteredChapters.value.length - endIndex.value) * ROW_HEIGHT)
);

function handleScroll() {
  const content = contentRef.value;
  if (!content) return;
  scrollTop.value = content.scrollTop;
  viewportHeight.value = content.clientHeight || 600;
}

function resetVirtualWindow() {
  scrollTop.value = 0;
  if (contentRef.value) contentRef.value.scrollTop = 0;
}

async function scrollCurrentIntoView() {
  await nextTick();
  const content = contentRef.value;
  if (!content || query.value) return;
  const currentIndex = props.chapters.findIndex(chapter => chapter.isCurrent);
  if (currentIndex < 0) return;
  const targetTop = Math.max(
    0,
    currentIndex * ROW_HEIGHT - content.clientHeight / 2 + ROW_HEIGHT / 2
  );
  content.scrollTop = targetTop;
  scrollTop.value = targetTop;
  viewportHeight.value = content.clientHeight || 600;
}

function handleSelect(entry: TocEntryWithStatus) {
  emit('select', entry);
  emit('close');
}

function trapFocus(event: globalThis.KeyboardEvent) {
  const drawer = drawerRef.value;
  if (!drawer) return;
  const focusable = Array.from(
    drawer.querySelectorAll<globalThis.HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(element => element.offsetParent !== null || element === document.activeElement);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.isOpen,
  async open => {
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      query.value = '';
      await scrollCurrentIntoView();
      closeButtonRef.value?.focus({
        preventScroll: true,
      });
      return;
    }

    previouslyFocused?.focus?.({ preventScroll: true });
    previouslyFocused = null;
  },
  { flush: 'post' }
);

watch(
  () => [props.loading, props.chapters.length, currentChapterNumber.value],
  () => {
    if (props.isOpen) void scrollCurrentIntoView();
  },
  { flush: 'post' }
);
</script>

<style scoped>
.mnr-drawer {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 1001;
  display: flex;
  width: min(88%, 340px);
  flex-direction: column;
  padding-left: env(safe-area-inset-left);
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(-105%);
  transition: transform 0.24s ease;
}

.mnr-drawer.open {
  transform: translateX(0);
}

.mnr-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}

.mnr-drawer-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: max(16px, env(safe-area-inset-top)) 16px 14px;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
}

.mnr-drawer-heading {
  min-width: 0;
}

.mnr-drawer-title {
  overflow: hidden;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mnr-drawer-position {
  display: block;
  margin-top: 3px;
  color: var(--mnr-text, #666);
  font-size: 12px;
  opacity: 0.72;
}

.mnr-drawer-close {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.mnr-drawer-close svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.mnr-drawer-search {
  flex-shrink: 0;
  padding: 10px 12px 6px;
}

.mnr-drawer-search input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 8px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  font-size: 14px;
}

.mnr-drawer-tools {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 6px 12px 10px;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
}

.mnr-cache-action {
  min-height: 32px;
  padding: 5px 10px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 7px;
  background: transparent;
  color: var(--mnr-link, #1976d2);
  font-size: 12px;
  cursor: pointer;
}

.mnr-drawer-state {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--mnr-text, #666);
  text-align: center;
  opacity: 0.78;
}

.mnr-drawer-content {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.mnr-cache-progress-track {
  flex-shrink: 0;
  height: 3px;
  background: var(--mnr-border, #e0e0e0);
}

.mnr-cache-progress-fill {
  height: 100%;
  background: var(--mnr-link, #1976d2);
  transition: width 0.2s ease;
}

.mnr-cache-stats {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  padding: 7px 12px;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
  color: var(--mnr-text, #666);
  font-size: 12px;
}

.mnr-chapter-list {
  margin: 0;
  padding-right: 0;
  padding-left: 0;
  list-style: none;
}

.mnr-chapter-list li {
  height: 44px;
}

.mnr-chapter-button {
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  padding: 0 14px;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  color: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.mnr-chapter-title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mnr-chapter-button.active {
  border-left-color: var(--mnr-link, #1976d2);
  background: color-mix(in srgb, var(--mnr-link, #1976d2) 10%, transparent);
  color: var(--mnr-link, #1976d2);
  font-weight: 600;
}

.mnr-chapter-button.cached {
  color: #777;
}

.mnr-chapter-button.persisted,
.mnr-cache-mark {
  color: #388e3c;
}

.mnr-cache-mark {
  flex: 0 0 auto;
  font-size: 12px;
}

.mnr-drawer-close:hover,
.mnr-chapter-button:hover,
.mnr-cache-action:hover {
  background: var(--mnr-border, #f0f0f0);
}

.mnr-drawer-close:focus-visible,
.mnr-drawer-search input:focus-visible,
.mnr-cache-action:focus-visible,
.mnr-chapter-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--mnr-link, #1976d2) 55%, transparent);
  outline-offset: -3px;
}

.mnr-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.mnr-fade-enter-active,
.mnr-fade-leave-active {
  transition: opacity 0.24s ease;
}

.mnr-fade-enter-from,
.mnr-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .mnr-drawer,
  .mnr-fade-enter-active,
  .mnr-fade-leave-active,
  .mnr-cache-progress-fill {
    transition: none;
  }
}
</style>
