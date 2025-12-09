<template>
  <Teleport to="body">
    <Transition name="mnr-fade">
      <div v-if="visible" class="mnr-prompt-overlay" @click.self="handleDismiss">
        <div class="mnr-prompt-card" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="mnr-prompt-header">
            <span class="mnr-prompt-icon">📖</span>
            <h3 class="mnr-prompt-title">启用 MyNovelReader?</h3>
          </div>

          <!-- Confidence indicator -->
          <div class="mnr-confidence">
            <div class="mnr-confidence-bar">
              <div
                class="mnr-confidence-fill"
                :style="{ width: `${confidence * 100}%` }"
                :class="confidenceClass"
              ></div>
            </div>
            <span class="mnr-confidence-text">
              检测置信度: {{ (confidence * 100).toFixed(0) }}%
            </span>
          </div>

          <!-- Detection results -->
          <ul class="mnr-results">
            <li v-for="reason in positiveReasons" :key="reason" class="mnr-result-item success">
              <span class="mnr-result-icon">✓</span>
              <span>{{ reason }}</span>
            </li>
            <li v-for="reason in negativeReasons" :key="reason" class="mnr-result-item warning">
              <span class="mnr-result-icon">⚠</span>
              <span>{{ reason }}</span>
            </li>
          </ul>

          <!-- Auto-enable checkbox -->
          <label class="mnr-checkbox-label">
            <input v-model="saveForDomain" type="checkbox" class="mnr-checkbox" />
            <span>为此站点自动启用</span>
          </label>

          <!-- Actions -->
          <div class="mnr-prompt-actions">
            <button class="mnr-btn mnr-btn-secondary" @click="handleDismiss">暂不</button>
            <button class="mnr-btn mnr-btn-primary" @click="handleAccept">启用阅读器</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AutoEnableDecision, UserPromptResponse } from '@/core/AutoEnableManager';

// Props
const props = defineProps<{
  decision: AutoEnableDecision;
  visible: boolean;
}>();

// Emits
const emit = defineEmits<{
  respond: [response: UserPromptResponse];
  dismiss: [];
}>();

// State
const saveForDomain = ref(true);

// Computed
const confidence = computed(() => props.decision.confidence);

const confidenceClass = computed(() => {
  if (confidence.value >= 0.8) return 'high';
  if (confidence.value >= 0.6) return 'medium';
  return 'low';
});

const positiveReasons = computed(() => {
  return props.decision.reasons.filter(
    r => r.includes('找到') || r.includes('检测到') || r.includes('成功')
  );
});

const negativeReasons = computed(() => {
  return props.decision.reasons.filter(
    r => r.includes('未能') || r.includes('置信度') || r.includes('警告')
  );
});

// Methods
function handleAccept() {
  emit('respond', {
    accepted: true,
    saveForDomain: saveForDomain.value,
  });
}

function handleDismiss() {
  emit('respond', {
    accepted: false,
    saveForDomain: false,
  });
  emit('dismiss');
}
</script>

<style scoped>
.mnr-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 16px;
}

.mnr-prompt-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  max-width: 360px;
  width: 100%;
  padding: 20px;
  animation: mnr-slide-up 0.3s ease-out;
}

@keyframes mnr-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mnr-prompt-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.mnr-prompt-icon {
  font-size: 28px;
}

.mnr-prompt-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.mnr-confidence {
  margin-bottom: 16px;
}

.mnr-confidence-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.mnr-confidence-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.mnr-confidence-fill.high {
  background: #4caf50;
}

.mnr-confidence-fill.medium {
  background: #ff9800;
}

.mnr-confidence-fill.low {
  background: #f44336;
}

.mnr-confidence-text {
  font-size: 13px;
  color: #666;
}

.mnr-results {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.mnr-result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
}

.mnr-result-item.success {
  color: #2e7d32;
}

.mnr-result-item.warning {
  color: #ed6c02;
}

.mnr-result-icon {
  font-weight: bold;
}

.mnr-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 0;
  font-size: 14px;
  color: #555;
  border-top: 1px solid #eee;
  margin-bottom: 16px;
}

.mnr-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1976d2;
}

.mnr-prompt-actions {
  display: flex;
  gap: 12px;
}

.mnr-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.mnr-btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.mnr-btn-secondary:hover {
  background: #e0e0e0;
}

.mnr-btn-primary {
  background: #1976d2;
  color: #fff;
}

.mnr-btn-primary:hover {
  background: #1565c0;
}

/* Transitions */
.mnr-fade-enter-active,
.mnr-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mnr-fade-enter-from,
.mnr-fade-leave-to {
  opacity: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mnr-prompt-card {
    background: #2a2a2a;
  }

  .mnr-prompt-title {
    color: #e0e0e0;
  }

  .mnr-confidence-bar {
    background: #444;
  }

  .mnr-confidence-text {
    color: #aaa;
  }

  .mnr-checkbox-label {
    color: #bbb;
    border-top-color: #444;
  }

  .mnr-btn-secondary {
    background: #3a3a3a;
    color: #ccc;
  }

  .mnr-btn-secondary:hover {
    background: #4a4a4a;
  }
}

/* Mobile optimization */
@media (max-width: 480px) {
  .mnr-prompt-card {
    padding: 16px;
    margin: 8px;
  }

  .mnr-prompt-title {
    font-size: 16px;
  }

  .mnr-btn {
    padding: 12px 16px;
  }
}
</style>
