<template>
  <div class="mnr-progress" :class="{ hidden: !visible }">
    <div class="mnr-progress-bar" :style="{ width: `${percent}%` }"></div>
    <span v-if="showText" class="mnr-progress-text">{{ percent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Show percentage text */
    showText?: boolean;
    /** Auto-hide when not scrolling */
    autoHide?: boolean;
    /** Hide delay in ms */
    hideDelay?: number;
  }>(),
  {
    showText: false,
    autoHide: true,
    hideDelay: 2000,
  }
);

// State
const percent = ref(0);
const visible = ref(true);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

// Methods
function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollHeight > 0) {
    percent.value = Math.round((scrollTop / scrollHeight) * 100);
  } else {
    percent.value = 100;
  }

  // Show progress bar
  visible.value = true;

  // Auto-hide logic
  if (props.autoHide) {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      visible.value = false;
    }, props.hideDelay);
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
  if (hideTimeout) clearTimeout(hideTimeout);
});

// Expose for parent
defineExpose({
  percent,
  updateProgress,
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
