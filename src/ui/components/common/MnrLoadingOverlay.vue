<template>
  <div v-if="!inline" class="mnr-loading-overlay" role="alert" aria-busy="true">
    <MnrSpinner size="medium" />
    <slot />
  </div>
  <div v-else class="mnr-loading-overlay--inline" role="alert" aria-busy="true">
    <MnrSpinner size="medium" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import MnrSpinner from './MnrSpinner.vue';

withDefaults(
  defineProps<{
    inline?: boolean;
  }>(),
  { inline: false }
);
</script>

<style scoped>
.mnr-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #333;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .mnr-loading-overlay {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
  }
}

.mnr-loading-overlay--inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
  color: #333;
}
</style>
