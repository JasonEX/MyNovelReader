<template>
  <div class="loading-spinner" role="status" aria-live="polite">
    <PulseLoader
      :loading="props.loading"
      :color="props.color"
      :size="props.size"
      :margin="props.margin"
    />
    <span v-if="props.label" class="loading-spinner__label">{{ props.label }}</span>
  </div>
</template>

<script setup lang="ts">
import PulseLoader from '../../../common/components/spinner/PulseLoader.vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: '#5dc596',
  },
  size: {
    type: String,
    default: '15px',
  },
  margin: {
    type: String,
    default: '2px',
  },
});
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.loading-spinner__label {
  font-size: 12px;
  color: #666;
}
</style>
