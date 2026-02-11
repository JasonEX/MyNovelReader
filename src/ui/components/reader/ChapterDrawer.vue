<template>
  <!-- 遮罩层 -->
  <Transition name="mnr-fade">
    <div v-if="isOpen" class="mnr-drawer-overlay" @click="$emit('close')" />
  </Transition>

  <!-- 抽屉 -->
  <aside class="mnr-drawer" :class="{ open: isOpen }">
    <div class="mnr-drawer-header">
      <h3 class="mnr-drawer-title">{{ bookTitle || '目录' }}</h3>
      <button class="mnr-drawer-close" title="关闭" @click="$emit('close')">✕</button>
    </div>

    <div v-if="loading" class="mnr-drawer-loading">
      <MnrSpinner size="small" />
      <span>加载目录中...</span>
    </div>

    <div v-else-if="chapters.length === 0" class="mnr-drawer-empty">
      <p>暂无目录</p>
    </div>

    <div v-else ref="contentRef" class="mnr-drawer-content">
      <!-- 缓存进度条 -->
      <div v-if="cacheProgress.running" class="mnr-cache-progress-bar">
        <div class="mnr-cache-progress-text">
          缓存中: {{ cacheProgress.done }}/{{ cacheProgress.total }}
        </div>
        <div class="mnr-cache-progress-track">
          <div
            class="mnr-cache-progress-fill"
            :style="{
              width: `${cacheProgress.total > 0 ? (cacheProgress.done / cacheProgress.total) * 100 : 0}%`,
            }"
          ></div>
        </div>
      </div>

      <!-- 缓存统计 -->
      <div v-else-if="persistedCount > 0 || sessionCount > 0" class="mnr-cache-stats">
        <span v-if="persistedCount > 0" class="mnr-stat-persisted">
          <span class="mnr-persisted-icon">✓</span> 已保存 {{ persistedCount }} 章
        </span>
        <span v-if="sessionCount > 0" class="mnr-stat-session">
          <span class="mnr-cached-icon">○</span> 临时 {{ sessionCount }} 章
        </span>
      </div>

      <ul class="mnr-chapter-list">
        <li
          v-for="ch in chapters"
          :key="ch.url"
          :ref="
            el => {
              if (ch.isCurrent) {
                activeRef = el as HTMLElement | null;
              }
            }
          "
          :class="{
            active: ch.isCurrent,
            cached: ch.isCached && !ch.isPersisted && !ch.isCurrent,
            persisted: ch.isPersisted && !ch.isCurrent,
          }"
          @click="handleSelect(ch)"
        >
          <span v-if="ch.isPersisted" class="mnr-persisted-icon" title="已持久化">✓</span>
          <span v-else-if="ch.isCached" class="mnr-cached-icon" title="临时缓存">○</span>
          {{ ch.title }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import type { TocEntryWithStatus, CacheProgressState } from '@/ui/stores/reader';
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
}>();

const contentRef = ref<HTMLElement | null>(null);
const activeRef = ref<HTMLElement | null>(null);

// Count cached chapters
const persistedCount = computed(() => props.chapters.filter(ch => ch.isPersisted).length);
const sessionCount = computed(
  () => props.chapters.filter(ch => ch.isCached && !ch.isPersisted).length
);

const scrollActiveIntoView = async (behavior: 'auto' | 'smooth' = 'auto') => {
  await nextTick();
  if (!props.isOpen || props.loading) return;

  const container = contentRef.value;
  if (!container) return;

  // 直接在 DOM 中查找当前高亮项，避免依赖 ref 回调未触发的情况
  const active = (container.querySelector('li.active') as HTMLElement | null) || activeRef.value;

  if (!active) return;
  activeRef.value = active;

  const targetTop = active.offsetTop - container.clientHeight / 2 + active.offsetHeight / 2;
  container.scrollTo({
    top: Math.max(targetTop, 0),
    behavior,
  });
};

// 当抽屉打开或当前章节/目录加载完成时，滚动到当前章节
watch(
  () => props.isOpen,
  async open => {
    if (open) {
      await scrollActiveIntoView('smooth');
    }
  },
  { flush: 'post' }
);

watch(
  () => [props.loading, props.chapters.length],
  async () => {
    await scrollActiveIntoView();
  },
  { flush: 'post' }
);

watch(
  activeRef,
  async () => {
    await scrollActiveIntoView();
  },
  { flush: 'post' }
);

function handleSelect(entry: TocEntryWithStatus) {
  emit('select', entry);
  emit('close');
}
</script>

<style scoped>
/* 抽屉 */
.mnr-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 85%;
  max-width: 320px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.mnr-drawer.open {
  transform: translateX(0);
}

/* 遮罩 */
.mnr-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.mnr-fade-enter-active,
.mnr-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mnr-fade-enter-from,
.mnr-fade-leave-to {
  opacity: 0;
}

/* Header */
.mnr-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
  flex-shrink: 0;
}

.mnr-drawer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mnr-drawer-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--mnr-text, #333);
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mnr-drawer-close:hover {
  background: var(--mnr-border, #e5e5e5);
}

/* Content */
.mnr-drawer-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Loading */
.mnr-drawer-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--mnr-text, #666);
}

/* Empty */
.mnr-drawer-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--mnr-text, #666);
  opacity: 0.7;
}

/* Cache progress bar */
.mnr-cache-progress-bar {
  position: sticky;
  top: 0;
  background: var(--mnr-bg, #fff);
  padding: 12px 16px;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
  z-index: 1;
}

.mnr-cache-progress-text {
  font-size: 12px;
  color: var(--mnr-link, #1976d2);
  margin-bottom: 6px;
}

.mnr-cache-progress-track {
  height: 4px;
  background: var(--mnr-border, #e0e0e0);
  border-radius: 2px;
  overflow: hidden;
}

.mnr-cache-progress-fill {
  height: 100%;
  background: var(--mnr-link, #1976d2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Cache stats */
.mnr-cache-stats {
  padding: 8px 16px;
  font-size: 12px;
  border-bottom: 1px solid var(--mnr-border, #e5e5e5);
  display: flex;
  gap: 12px;
}

.mnr-stat-persisted {
  color: #4caf50;
}

.mnr-stat-session {
  color: #9e9e9e;
}

/* Chapter list */
.mnr-chapter-list {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.mnr-chapter-list li {
  padding: 12px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  font-size: 14px;
  line-height: 1.4;
  transition: all 0.15s ease;
  scroll-margin-block: 24px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.mnr-chapter-list li:hover {
  background: var(--mnr-border, #f0f0f0);
}

.mnr-chapter-list li.active {
  background: rgba(25, 118, 210, 0.1);
  border-left-color: var(--mnr-link, #1976d2);
  font-weight: 500;
  color: var(--mnr-link, #1976d2);
}

/* Cached chapter style - session cache (gray) */
.mnr-chapter-list li.cached {
  color: #9e9e9e;
}

/* Persisted chapter style - saved to storage (green) */
.mnr-chapter-list li.persisted {
  color: #4caf50;
}

.mnr-cached-icon {
  color: #9e9e9e;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 2px;
}

.mnr-persisted-icon {
  color: #4caf50;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 桌面端宽度调整 */
@media (min-width: 1024px) {
  .mnr-drawer {
    max-width: 320px;
    width: 320px;
  }
}
</style>
