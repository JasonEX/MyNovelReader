<template>
  <nav class="mnr-nav-bar" :class="{ hidden: !visible }">
    <a
      v-if="prevUrl"
      :href="prevUrl"
      class="mnr-nav-btn"
      @click.prevent="$emit('navigate', 'prev')"
    >
      <span class="mnr-nav-icon">←</span>
      <span class="mnr-nav-label">上一章</span>
    </a>
    <span v-else class="mnr-nav-btn disabled">
      <span class="mnr-nav-icon">←</span>
      <span class="mnr-nav-label">上一章</span>
    </span>

    <a
      v-if="indexUrl"
      :href="indexUrl"
      class="mnr-nav-btn"
      @click.prevent="$emit('navigate', 'index')"
    >
      <span class="mnr-nav-icon">☰</span>
      <span class="mnr-nav-label">目录</span>
    </a>
    <button v-else class="mnr-nav-btn" @click="$emit('openSettings')">
      <span class="mnr-nav-icon">⚙</span>
      <span class="mnr-nav-label">设置</span>
    </button>

    <a
      v-if="nextUrl"
      :href="nextUrl"
      class="mnr-nav-btn"
      @click.prevent="$emit('navigate', 'next')"
    >
      <span class="mnr-nav-label">下一章</span>
      <span class="mnr-nav-icon">→</span>
    </a>
    <span v-else class="mnr-nav-btn disabled">
      <span class="mnr-nav-label">下一章</span>
      <span class="mnr-nav-icon">→</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  prevUrl?: string;
  nextUrl?: string;
  indexUrl?: string;
}>();

defineEmits<{
  navigate: [direction: 'prev' | 'next' | 'index'];
  openSettings: [];
}>();

// Auto-hide on scroll
const visible = ref(true);
let lastScrollY = 0;
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

function handleScroll() {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;
  const isNearBottom = window.innerHeight + currentScrollY >= document.body.scrollHeight - 100;

  // Show when near bottom or scrolling up
  if (isNearBottom || !isScrollingDown) {
    visible.value = true;
  } else if (currentScrollY > 50) {
    visible.value = false;
  }

  lastScrollY = currentScrollY;

  // Always show after stopping scroll
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    visible.value = true;
  }, 1500);
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>

<style scoped>
.mnr-nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--mnr-bg, #fff);
  border-top: 1px solid var(--mnr-border, #e0e0e0);
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0));
  z-index: 100;
  transition: transform 0.3s ease;
}

.mnr-nav-bar.hidden {
  transform: translateY(100%);
}

.mnr-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: var(--mnr-text, #333);
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  min-width: 80px;
  transition: opacity 0.2s ease;
}

.mnr-nav-btn:active {
  opacity: 0.6;
}

.mnr-nav-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.mnr-nav-icon {
  font-size: 20px;
}

.mnr-nav-label {
  font-size: 12px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .mnr-nav-bar {
    padding: 12px 0;
  }

  .mnr-nav-btn {
    flex-direction: row;
    gap: 8px;
    padding: 10px 24px;
  }

  .mnr-nav-icon {
    font-size: 16px;
  }

  .mnr-nav-label {
    font-size: 14px;
  }
}
</style>
