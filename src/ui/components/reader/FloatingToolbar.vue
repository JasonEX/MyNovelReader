<template>
  <div class="mnr-floating-toolbar">
    <!-- 左侧：目录按钮 -->
    <button class="mnr-fab" title="目录 (Tab)" @click="$emit('toggleDrawer')">☰</button>

    <!-- 右侧：设置和缓存 -->
    <div class="mnr-fab-group">
      <button
        class="mnr-fab"
        title="缓存本书"
        :disabled="cacheDisabled"
        @click="$emit('toggleCache')"
      >
        <span>{{ cacheRunning ? '⏹' : '☁' }}</span>
        <span v-if="cacheTotal > 0" class="mnr-fab-badge"> {{ cacheDone }}/{{ cacheTotal }} </span>
      </button>
      <button class="mnr-fab" title="设置 (S)" @click="$emit('openSettings')">⚙</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cacheRunning: boolean;
  cacheDone: number;
  cacheTotal: number;
  cacheDisabled?: boolean;
}>();

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  position: relative;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mnr-fab:hover {
  background: var(--mnr-border, #f0f0f0);
  transform: scale(1.05);
}

.mnr-fab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.mnr-fab-group {
  display: flex;
  gap: 8px;
}

.mnr-fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--mnr-link, #1976d2);
  color: #fff;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 8px;
  line-height: 1;
}
</style>
