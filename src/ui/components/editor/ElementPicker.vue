<template>
  <Teleport to="body">
    <div v-if="isActive" ref="overlayRef" class="mnr-picker-overlay">
      <!-- Highlight box -->
      <div v-if="highlightRect" class="mnr-picker-highlight" :style="highlightStyle"></div>

      <!-- Info tooltip -->
      <div v-if="hoveredElement" class="mnr-picker-tooltip" :style="tooltipStyle">
        <div class="mnr-picker-tag">{{ elementTag }}</div>
        <div class="mnr-picker-selector">{{ generatedSelector }}</div>
      </div>

      <!-- Control bar -->
      <div class="mnr-picker-controls">
        <span class="mnr-picker-label">{{ modeLabel }}</span>
        <span class="mnr-picker-hint">点击选择元素，ESC 取消</span>
        <button class="mnr-picker-cancel" @click="cancel">取消</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';

// Types
export type PickerMode = 'content' | 'next' | 'prev' | 'index' | 'title' | 'remove';

const props = withDefaults(
  defineProps<{
    /** Picker mode determines what we're selecting */
    mode?: PickerMode;
    /** Whether picker is active */
    active?: boolean;
  }>(),
  {
    mode: 'content',
    active: false,
  }
);

const emit = defineEmits<{
  select: [result: { element: Element; selector: string }];
  cancel: [];
  'update:active': [value: boolean];
}>();

// State
const isActive = ref(false);
const hoveredElement = ref<Element | null>(null);
const highlightRect = ref<typeof globalThis.DOMRect.prototype | null>(null);
const overlayRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);
const rafId = ref<number | null>(null);

// Mode labels
const modeLabels: Record<PickerMode, string> = {
  content: '选择内容区域',
  next: '选择"下一章"链接',
  prev: '选择"上一章"链接',
  index: '选择"目录"链接',
  title: '选择标题元素',
  remove: '选择要移除的元素',
};

const modeLabel = computed(() => modeLabels[props.mode]);

// Computed styles - use viewport coordinates for fixed positioning
const highlightStyle = computed(() => {
  if (!highlightRect.value) return {};
  const rect = highlightRect.value;
  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
});

const tooltipStyle = computed(() => {
  if (!highlightRect.value) return {};
  const rect = highlightRect.value;
  // Position tooltip above the element, but keep it in viewport
  let top = rect.top - 60;
  let left = rect.left;

  // Keep tooltip in viewport
  if (top < 10) top = rect.bottom + 10;
  if (left < 10) left = 10;
  if (left > window.innerWidth - 200) left = window.innerWidth - 200;

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

const elementTag = computed(() => {
  if (!hoveredElement.value) return '';
  const el = hoveredElement.value;
  let tag = el.tagName.toLowerCase();
  if (el.id) tag += `#${el.id}`;
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.trim().split(/\s+/).slice(0, 2);
    tag += classes.map(c => `.${c}`).join('');
  }
  return tag;
});

const generatedSelector = computed(() => {
  if (!hoveredElement.value) return '';
  return generateSelector(hoveredElement.value);
});

// Selector generation
function generateSelector(element: Element): string {
  // Try ID first
  if (element.id) {
    const escaped = cssEscape(element.id);
    return `#${escaped}`;
  }

  // Try unique class
  if (element.className && typeof element.className === 'string') {
    const classes = element.className
      .trim()
      .split(/\s+/)
      .filter(c => c.length > 0);
    for (const cls of classes) {
      const selector = `.${cssEscape(cls)}`;
      try {
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      } catch {
        // Invalid selector
      }
    }

    // Try class combination
    if (classes.length >= 2) {
      const selector = classes
        .slice(0, 3)
        .map(c => `.${cssEscape(c)}`)
        .join('');
      try {
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      } catch {
        // Invalid selector
      }
    }
  }

  // Build path selector
  return buildPathSelector(element);
}

function buildPathSelector(element: Element): string {
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body && path.length < 5) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${cssEscape(current.id)}`;
      path.unshift(selector);
      break;
    }

    // Add nth-child if needed
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = parent;
  }

  return path.join(' > ');
}

function cssEscape(str: string): string {
  if (typeof globalThis.CSS !== 'undefined' && globalThis.CSS.escape) {
    return globalThis.CSS.escape(str);
  }
  return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

// Event handlers
function handleMouseMove(e: MouseEvent) {
  if (!isActive.value) return;
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
}

function tick() {
  if (!isActive.value) return;

  // Temporarily hide overlay to get element underneath
  const overlay = overlayRef.value;
  if (overlay) {
    overlay.style.pointerEvents = 'none';
  }

  const target = document.elementFromPoint(mouseX.value, mouseY.value);

  if (overlay) {
    overlay.style.pointerEvents = '';
  }

  // Skip our own elements and invalid targets
  if (target && !target.closest('[id^="mnr-"]') && !target.closest('.mnr-picker-overlay')) {
    hoveredElement.value = target;
    highlightRect.value = target.getBoundingClientRect();
  }

  rafId.value = globalThis.requestAnimationFrame(tick);
}

function handleClick(e: MouseEvent) {
  if (!isActive.value) return;

  // Use elementFromPoint for accurate detection
  const overlay = overlayRef.value;
  if (overlay) {
    overlay.style.pointerEvents = 'none';
  }

  const target = document.elementFromPoint(e.clientX, e.clientY);

  if (overlay) {
    overlay.style.pointerEvents = '';
  }

  // Skip our own elements
  if (!target || target.closest('[id^="mnr-"]') || target.closest('.mnr-picker-overlay')) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  const selector = generateSelector(target);
  emit('select', { element: target, selector });
  deactivate();
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    cancel();
  }
}

function handleScroll() {
  // Update highlight rect when page scrolls
  if (hoveredElement.value) {
    highlightRect.value = hoveredElement.value.getBoundingClientRect();
  }
}

function cancel() {
  emit('cancel');
  deactivate();
}

function activate() {
  isActive.value = true;
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('scroll', handleScroll, true);
  document.body.style.cursor = 'crosshair';
  // Start animation loop
  rafId.value = globalThis.requestAnimationFrame(tick);
}

function deactivate() {
  isActive.value = false;
  hoveredElement.value = null;
  highlightRect.value = null;
  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('click', handleClick, true);
  window.removeEventListener('keydown', handleKeyDown, true);
  window.removeEventListener('scroll', handleScroll, true);
  document.body.style.cursor = '';
  // Stop animation loop
  if (rafId.value !== null) {
    globalThis.cancelAnimationFrame(rafId.value);
    rafId.value = null;
  }
  emit('update:active', false);
}

// Watch active prop
watch(
  () => props.active,
  newVal => {
    if (newVal && !isActive.value) {
      activate();
    } else if (!newVal && isActive.value) {
      deactivate();
    }
  },
  { immediate: true }
);

// Cleanup
onUnmounted(() => {
  if (isActive.value) {
    deactivate();
  }
});

// Expose for parent
defineExpose({
  activate,
  deactivate,
  isActive,
});
</script>

<style scoped>
.mnr-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  pointer-events: none;
}

.mnr-picker-highlight {
  position: fixed;
  border: 2px solid #1976d2;
  background: rgba(25, 118, 210, 0.1);
  pointer-events: none;
  transition: all 0.05s ease;
  box-sizing: border-box;
  z-index: 999999;
}

.mnr-picker-tooltip {
  position: fixed;
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  max-width: 400px;
  pointer-events: none;
  z-index: 1000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.mnr-picker-tag {
  color: #90caf9;
  margin-bottom: 4px;
}

.mnr-picker-selector {
  color: #a5d6a7;
  word-break: break-all;
}

.mnr-picker-controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #1976d2;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.mnr-picker-label {
  font-weight: 600;
}

.mnr-picker-hint {
  opacity: 0.8;
  font-size: 12px;
}

.mnr-picker-cancel {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.mnr-picker-cancel:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Mobile */
@media (max-width: 480px) {
  .mnr-picker-controls {
    left: 10px;
    right: 10px;
    transform: none;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
