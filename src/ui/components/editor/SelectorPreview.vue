<template>
  <div class="mnr-selector-preview">
    <div class="mnr-preview-header">
      <label class="mnr-preview-label">{{ label }}</label>
      <div class="mnr-preview-actions">
        <button v-if="editable" class="mnr-preview-btn" title="可视化选择" @click="$emit('pick')">
          🎯
        </button>
        <button
          class="mnr-preview-btn"
          :class="{ 'mnr-btn-active': isHighlighting }"
          :disabled="!localSelector"
          title="高亮选中元素"
          @click="toggleHighlight"
        >
          {{ isHighlighting ? '✕' : '👁' }}
        </button>
      </div>
    </div>

    <div class="mnr-preview-input-row">
      <input
        v-if="editable"
        v-model="localSelector"
        type="text"
        class="mnr-preview-input"
        placeholder="CSS 选择器"
        @input="handleInput"
        @blur="handleBlur"
      />
      <span v-else class="mnr-preview-selector">{{ selector || '未设置' }}</span>
    </div>

    <!-- Match info -->
    <div v-if="matchCount !== null" class="mnr-preview-match" :class="matchClass">
      <span v-if="matchCount === 0">❌ 未找到匹配元素</span>
      <span v-else-if="matchCount === 1">✓ 找到 1 个元素</span>
      <span v-else>⚠ 找到 {{ matchCount }} 个元素</span>
    </div>

    <!-- Content preview -->
    <div v-if="showPreview && previewContent" class="mnr-preview-content">
      <div class="mnr-preview-content-header">
        <span>预览</span>
        <button class="mnr-preview-expand" @click="expanded = !expanded">
          {{ expanded ? '收起' : '展开' }}
        </button>
      </div>
      <div class="mnr-preview-text" :class="{ expanded }" v-html="sanitizedPreview"></div>
    </div>

    <!-- Highlight overlay -->
    <Teleport to="body">
      <div v-if="isHighlighting && highlightRects.length > 0" class="mnr-highlight-overlay">
        <div
          v-for="(rect, index) in highlightRects"
          :key="index"
          class="mnr-highlight-box"
          :style="getHighlightStyle(rect)"
        >
          <span class="mnr-highlight-label">{{ index + 1 }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Label for this selector */
    label: string;
    /** Current selector value */
    selector?: string;
    /** Whether selector is editable */
    editable?: boolean;
    /** Show content preview */
    showPreview?: boolean;
    /** Preview type: 'text' or 'html' */
    previewType?: 'text' | 'html';
  }>(),
  {
    selector: '',
    editable: true,
    showPreview: true,
    previewType: 'text',
  }
);

const emit = defineEmits<{
  'update:selector': [value: string];
  pick: [];
}>();

// State
const localSelector = ref(props.selector);
const matchCount = ref<number | null>(null);
const previewContent = ref<string>('');
const expanded = ref(false);
const isHighlighting = ref(false);
const highlightRects = ref<(typeof globalThis.DOMRect.prototype)[]>([]);

// Computed
const matchClass = computed(() => {
  if (matchCount.value === null) return '';
  if (matchCount.value === 0) return 'error';
  if (matchCount.value === 1) return 'success';
  return 'warning';
});

const sanitizedPreview = computed(() => {
  if (props.previewType === 'text') {
    return escapeHtml(previewContent.value);
  }
  // For HTML preview, strip scripts and limit size
  return previewContent.value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .slice(0, 2000);
});

// Methods
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function getHighlightStyle(rect: typeof globalThis.DOMRect.prototype) {
  return {
    position: 'absolute' as const,
    top: `${rect.top + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}

function testSelector() {
  if (!localSelector.value) {
    matchCount.value = null;
    previewContent.value = '';
    return;
  }

  try {
    const elements = document.querySelectorAll(localSelector.value);
    matchCount.value = elements.length;

    if (elements.length > 0) {
      const el = elements[0];
      if (props.previewType === 'text') {
        previewContent.value = el.textContent?.slice(0, 500) || '';
      } else {
        previewContent.value = el.innerHTML.slice(0, 2000);
      }
    } else {
      previewContent.value = '';
    }
  } catch {
    matchCount.value = 0;
    previewContent.value = '';
  }
}

function updateHighlightRects() {
  if (!localSelector.value) {
    highlightRects.value = [];
    return;
  }

  try {
    const elements = document.querySelectorAll(localSelector.value);
    highlightRects.value = Array.from(elements).map(el => el.getBoundingClientRect());
    matchCount.value = elements.length;

    if (elements.length > 0) {
      const el = elements[0];
      if (props.previewType === 'text') {
        previewContent.value = el.textContent?.slice(0, 500) || '';
      } else {
        previewContent.value = el.innerHTML.slice(0, 2000);
      }
      // Scroll first element into view
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      previewContent.value = '';
    }
  } catch {
    highlightRects.value = [];
    matchCount.value = 0;
    previewContent.value = '';
  }
}

function toggleHighlight() {
  if (isHighlighting.value) {
    stopHighlight();
  } else {
    startHighlight();
  }
}

function startHighlight() {
  isHighlighting.value = true;
  updateHighlightRects();
  // Update rects on scroll/resize
  window.addEventListener('scroll', updateHighlightRects);
  window.addEventListener('resize', updateHighlightRects);
}

function stopHighlight() {
  isHighlighting.value = false;
  highlightRects.value = [];
  window.removeEventListener('scroll', updateHighlightRects);
  window.removeEventListener('resize', updateHighlightRects);
}

function handleInput() {
  emit('update:selector', localSelector.value);
  // Stop highlighting when input changes
  if (isHighlighting.value) {
    stopHighlight();
  }
}

function handleBlur() {
  testSelector();
}

// Watch for external changes
watch(
  () => props.selector,
  newVal => {
    localSelector.value = newVal;
    // Auto test when selector changes from picker
    if (newVal) {
      testSelector();
    }
    if (isHighlighting.value) {
      updateHighlightRects();
    }
  }
);

// Cleanup
onUnmounted(() => {
  if (isHighlighting.value) {
    stopHighlight();
  }
});
</script>

<style scoped>
.mnr-selector-preview {
  background: var(--mnr-border, #f8f9fa);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.mnr-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.mnr-preview-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--mnr-text, #555);
}

.mnr-preview-actions {
  display: flex;
  gap: 4px;
}

.mnr-preview-btn {
  background: none;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--mnr-text, #666);
}

.mnr-preview-btn:hover:not(:disabled) {
  opacity: 0.8;
}

.mnr-preview-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mnr-preview-btn.mnr-btn-active {
  background: var(--mnr-link, #1976d2);
  color: #fff;
  border-color: var(--mnr-link, #1976d2);
}

.mnr-preview-input-row {
  margin-bottom: 8px;
}

.mnr-preview-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 6px;
  font-size: 13px;
  font-family: monospace;
  box-sizing: border-box;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
}

.mnr-preview-input:focus {
  outline: none;
  border-color: var(--mnr-link, #1976d2);
}

.mnr-preview-selector {
  font-family: monospace;
  font-size: 13px;
  color: var(--mnr-text, #666);
}

.mnr-preview-match {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.mnr-preview-match.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.mnr-preview-match.warning {
  background: #fff3e0;
  color: #e65100;
}

.mnr-preview-match.error {
  background: #ffebee;
  color: #c62828;
}

.mnr-preview-content {
  border-top: 1px solid var(--mnr-border, #e0e0e0);
  padding-top: 8px;
}

.mnr-preview-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--mnr-text, #666);
  margin-bottom: 6px;
}

.mnr-preview-expand {
  background: none;
  border: none;
  color: var(--mnr-link, #1976d2);
  cursor: pointer;
  font-size: 12px;
}

.mnr-preview-text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--mnr-text, #444);
  max-height: 80px;
  overflow: hidden;
  background: var(--mnr-bg, #fff);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-preview-text.expanded {
  max-height: 300px;
  overflow: auto;
}
</style>

<!-- Global styles for teleported highlight overlay -->
<style>
.mnr-highlight-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999998;
}

.mnr-highlight-box {
  border: 3px solid #4caf50;
  background: rgba(76, 175, 80, 0.15);
  box-sizing: border-box;
  transition: all 0.15s ease;
}

.mnr-highlight-label {
  position: absolute;
  top: -24px;
  left: 0;
  background: #4caf50;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px 4px 0 0;
  font-family: sans-serif;
}
</style>
