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
      <div class="mnr-loading-spinner small"></div>
      <span>加载目录中...</span>
    </div>

    <div v-else-if="chapters.length === 0" class="mnr-drawer-empty">
      <p>暂无目录</p>
    </div>

    <div v-else ref="contentRef" class="mnr-drawer-content">
      <ul class="mnr-chapter-list">
        <li
          v-for="ch in chapters"
          :key="ch.url"
          :ref="
            el => {
              if (ch.url === currentUrl) {
                activeRef.value = el as HTMLElement | null;
              }
            }
          "
          :class="{ active: ch.url === currentUrl }"
          @click="handleSelect(ch.url)"
        >
          {{ ch.title }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

export interface TocEntry {
  title: string;
  url: string;
}

const props = defineProps<{
  isOpen: boolean;
  bookTitle?: string;
  currentUrl?: string;
  chapters: TocEntry[];
  loading: boolean;
}>();

const emit = defineEmits<{
  close: [];
  select: [url: string];
}>();

const contentRef = ref<HTMLElement | null>(null);
const activeRef = ref<HTMLElement | null>(null);

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
  () => [props.currentUrl, props.loading, props.chapters.length],
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

function handleSelect(url: string) {
  emit('select', url);
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

.mnr-loading-spinner.small {
  width: 24px;
  height: 24px;
  border: 2px solid var(--mnr-border, #e0e0e0);
  border-top-color: var(--mnr-link, #1976d2);
  border-radius: 50%;
  animation: mnr-spin 1s linear infinite;
}

@keyframes mnr-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty */
.mnr-drawer-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--mnr-text, #666);
  opacity: 0.7;
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

/* 桌面端宽度调整 */
@media (min-width: 1024px) {
  .mnr-drawer {
    max-width: 320px;
    width: 320px;
  }
}
</style>
