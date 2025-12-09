<template>
  <div class="mnr-confidence-indicator" :class="levelClass">
    <div class="mnr-indicator-bar">
      <div class="mnr-indicator-fill" :style="{ width: `${percent}%` }"></div>
    </div>
    <span v-if="showLabel" class="mnr-indicator-label">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Confidence value (0-1) */
    value: number;
    /** Show text label */
    showLabel?: boolean;
    /** Compact mode (smaller) */
    compact?: boolean;
  }>(),
  {
    showLabel: true,
    compact: false,
  }
);

const percent = computed(() => Math.round(props.value * 100));

const levelClass = computed(() => {
  if (props.value >= 0.8) return 'level-high';
  if (props.value >= 0.6) return 'level-medium';
  return 'level-low';
});

const label = computed(() => {
  if (props.value >= 0.8) return `${percent.value}% 高`;
  if (props.value >= 0.6) return `${percent.value}% 中`;
  return `${percent.value}% 低`;
});
</script>

<style scoped>
.mnr-confidence-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mnr-indicator-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  min-width: 60px;
}

.mnr-indicator-fill {
  height: 100%;
  border-radius: 4px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.level-high .mnr-indicator-fill {
  background: linear-gradient(90deg, #66bb6a, #43a047);
}

.level-medium .mnr-indicator-fill {
  background: linear-gradient(90deg, #ffca28, #ff9800);
}

.level-low .mnr-indicator-fill {
  background: linear-gradient(90deg, #ef5350, #e53935);
}

.mnr-indicator-label {
  font-size: 12px;
  font-weight: 500;
  min-width: 50px;
}

.level-high .mnr-indicator-label {
  color: #2e7d32;
}

.level-medium .mnr-indicator-label {
  color: #f57c00;
}

.level-low .mnr-indicator-label {
  color: #d32f2f;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .mnr-indicator-bar {
    background: #444;
  }

  .level-high .mnr-indicator-label {
    color: #81c784;
  }

  .level-medium .mnr-indicator-label {
    color: #ffb74d;
  }

  .level-low .mnr-indicator-label {
    color: #ef5350;
  }
}
</style>
