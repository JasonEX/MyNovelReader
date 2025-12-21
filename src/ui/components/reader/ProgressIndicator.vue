<template>
  <div class="mnr-progress" :class="{ hidden: !visible }">
    <div class="mnr-progress-bar" :style="{ width: `${percent}%` }"></div>
    <span v-if="showText" class="mnr-progress-text">{{ percent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Progress percent (0-100). */
    percent?: number;
    /** Show percentage text */
    showText?: boolean;
    /** Auto-hide when not scrolling */
    autoHide?: boolean;
    /** Hide delay in ms */
    hideDelay?: number;
  }>(),
  {
    percent: 0,
    showText: false,
    autoHide: true,
    hideDelay: 2000,
  }
);

// State
const percent = computed(() => {
  const value = Number(props.percent ?? 0);
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
});
const visible = ref(true);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleAutoHide() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  if (!props.autoHide) {
    visible.value = true;
    return;
  }

  hideTimeout = setTimeout(() => {
    visible.value = false;
  }, props.hideDelay);
}

watch(
  percent,
  () => {
    visible.value = true;
    scheduleAutoHide();
  },
  { immediate: true }
);

onUnmounted(() => {
  if (hideTimeout) clearTimeout(hideTimeout);
});
</script>

<style scoped>
.mnr-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.mnr-progress.hidden {
  opacity: 0;
}

.mnr-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  transition: width 0.1s ease-out;
}

.mnr-progress-text {
  position: absolute;
  right: 8px;
  top: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
