<template>
  <Transition name="mnr-fade-slide">
    <div v-if="visible" class="mnr-floating-toolbar">
      <!-- 左侧：目录按钮 -->
      <button
        class="mnr-fab"
        title="目录 (Tab)"
        aria-label="打开目录"
        @click.stop="$emit('toggleDrawer')"
      >
        <span class="mnr-icon">☰</span>
      </button>

      <!-- 右侧：设置和缓存 -->
      <div class="mnr-fab-group">
        <button
          class="mnr-fab"
          title="缓存本书"
          aria-label="缓存管理"
          :disabled="cacheDisabled"
          @click.stop="$emit('toggleCache')"
        >
          <span class="mnr-icon">{{ cacheRunning ? '⏹' : '☁' }}</span>
          <span v-if="cacheTotal > 0" class="mnr-fab-badge">
            {{ cacheDone }}/{{ cacheTotal }}
          </span>
        </button>
        <button
          class="mnr-fab"
          title="设置 (S)"
          aria-label="打开设置"
          @click.stop="$emit('openSettings')"
        >
          <span class="mnr-icon">⚙</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    cacheRunning: boolean;
    cacheDone: number;
    cacheTotal: number;
    cacheDisabled?: boolean;
    visible?: boolean;
  }>(),
  {
    visible: true,
  }
);

defineEmits<{
  toggleDrawer: [];
  toggleCache: [];
  openSettings: [];
}>();
</script>

<style scoped>
.mnr-floating-toolbar {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 100;
}

.mnr-fab {
  pointer-events: auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  border: 1px solid var(--mnr-border, #e5e5e5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  position: relative;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  -webkit-tap-highlight-color: transparent;
}

.mnr-fab:hover {
  background: var(--mnr-border, #f0f0f0);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.mnr-fab:active {
  transform: scale(0.95);
}

.mnr-fab:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.mnr-fab-group {
  display: flex;
  gap: 12px;
}

.mnr-fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--mnr-link, #1976d2);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mnr-icon {
  line-height: 1;
  display: block;
}

/* Transitions */
.mnr-fade-slide-enter-active,
.mnr-fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.mnr-fade-slide-enter-from,
.mnr-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
