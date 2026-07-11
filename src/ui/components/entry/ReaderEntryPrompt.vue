<template>
  <Transition name="mnr-entry-prompt-fade">
    <div v-if="visible" class="mnr-entry-prompt-overlay" @click.self="handleDismiss">
      <section
        ref="cardRef"
        class="mnr-entry-prompt-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mnr-entry-prompt-title"
        aria-describedby="mnr-entry-prompt-description"
      >
        <header class="mnr-entry-prompt-header">
          <span class="mnr-entry-prompt-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 7v14" />
              <path d="M3 18a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3v15" />
              <path d="M21 18a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2h-5a3 3 0 0 0-3 3" />
              <path d="M3 18h6a3 3 0 0 1 3 3" />
              <path d="M21 18h-6a3 3 0 0 0-3 3" />
            </svg>
          </span>
          <div>
            <h3 id="mnr-entry-prompt-title">检测到小说正文</h3>
            <p id="mnr-entry-prompt-description">
              是否使用阅读模式打开本章？正文将采用统一排版并支持连续滚动阅读。
            </p>
          </div>
        </header>

        <label class="mnr-entry-preference">
          <input v-model="rememberForSite" type="checkbox" />
          <span>
            <strong>以后在本站自动进入</strong>
            <small>下次打开本站章节时直接进入阅读模式</small>
          </span>
        </label>

        <div class="mnr-entry-prompt-actions">
          <button type="button" class="mnr-entry-button secondary" @click="handleDismiss">
            暂不
          </button>
          <button
            ref="acceptButtonRef"
            type="button"
            class="mnr-entry-button primary"
            @click="handleAccept"
          >
            进入阅读模式
          </button>
        </div>
      </section>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { UserPromptResponse } from '@/core/AutoEnableManager';
import { useEventListener } from '@/ui/composables/useEventListener';
import { getDeepActiveElement } from '@/ui/focus';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  respond: [response: UserPromptResponse];
}>();

const rememberForSite = ref(true);
const cardRef = ref<globalThis.HTMLElement | null>(null);
const acceptButtonRef = ref<globalThis.HTMLButtonElement | null>(null);
let previouslyFocused: globalThis.HTMLElement | null = null;

function handleAccept() {
  emit('respond', {
    accepted: true,
    rememberForSite: rememberForSite.value,
  });
}

function handleDismiss() {
  emit('respond', {
    accepted: false,
    rememberForSite: false,
  });
}

function trapFocus(event: globalThis.KeyboardEvent) {
  const card = cardRef.value;
  if (!card) return;
  const focusable = Array.from(
    card.querySelectorAll<globalThis.HTMLElement>('button:not([disabled]), input:not([disabled])')
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const activeElement = getDeepActiveElement();
  if (event.shiftKey && activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleDialogKeydown(event: Event) {
  const keyboardEvent = event as globalThis.KeyboardEvent;
  const card = cardRef.value;
  if (!props.visible || !card || !keyboardEvent.composedPath().includes(card)) return;

  if (keyboardEvent.key === 'Escape') {
    keyboardEvent.preventDefault();
    keyboardEvent.stopImmediatePropagation();
    handleDismiss();
  } else if (keyboardEvent.key === 'Tab') {
    keyboardEvent.stopImmediatePropagation();
    trapFocus(keyboardEvent);
  }
}

useEventListener('keydown', handleDialogKeydown, { capture: true });

watch(
  () => props.visible,
  async visible => {
    if (visible) {
      previouslyFocused = getDeepActiveElement();
      await nextTick();
      acceptButtonRef.value?.focus({ preventScroll: true });
    } else {
      await nextTick();
      previouslyFocused?.focus?.({ preventScroll: true });
      previouslyFocused = null;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.mnr-entry-prompt-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  background: rgba(0, 0, 0, 0.52);
}

.mnr-entry-prompt-card {
  width: min(100%, 400px);
  max-height: calc(100dvh - 32px);
  overflow: auto;
  padding: 24px;
  border: 1px solid var(--mnr-border, #e0e0e0);
  border-radius: 14px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  animation: mnr-entry-prompt-in 0.24s ease-out;
}

.mnr-entry-prompt-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.mnr-entry-prompt-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--mnr-link, #1976d2) 12%, transparent);
  color: var(--mnr-link, #1976d2);
}

.mnr-entry-prompt-icon svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mnr-entry-prompt-header h3 {
  margin: 1px 0 6px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
}

.mnr-entry-prompt-header p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  opacity: 0.76;
}

.mnr-entry-preference {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 22px 0;
  padding: 13px 14px;
  border: 1px solid var(--mnr-border, #e0e0e0);
  border-radius: 10px;
  background: color-mix(in srgb, var(--mnr-border, #e0e0e0) 34%, transparent);
  cursor: pointer;
}

.mnr-entry-preference input {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  margin: 1px 0 0;
  accent-color: var(--mnr-link, #1976d2);
}

.mnr-entry-preference span,
.mnr-entry-preference strong,
.mnr-entry-preference small {
  display: block;
}

.mnr-entry-preference strong {
  font-size: 14px;
  font-weight: 600;
}

.mnr-entry-preference small {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.68;
}

.mnr-entry-prompt-actions {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 10px;
}

.mnr-entry-button {
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    filter 0.18s ease,
    background 0.18s ease;
}

.mnr-entry-button.secondary {
  border-color: var(--mnr-border, #ddd);
  background: transparent;
  color: var(--mnr-text, #555);
}

.mnr-entry-button.primary {
  background: var(--mnr-link, #1976d2);
  color: var(--mnr-on-link, #fff);
}

.mnr-entry-button:focus-visible,
.mnr-entry-preference input:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--mnr-link, #1976d2) 55%, transparent);
  outline-offset: 2px;
}

@media (hover: hover) {
  .mnr-entry-button:hover {
    filter: brightness(0.94);
  }

  .mnr-entry-button.secondary:hover {
    background: var(--mnr-border, #f0f0f0);
  }
}

.mnr-entry-prompt-fade-enter-active,
.mnr-entry-prompt-fade-leave-active {
  transition: opacity 0.24s ease;
}

.mnr-entry-prompt-fade-enter-from,
.mnr-entry-prompt-fade-leave-to {
  opacity: 0;
}

@keyframes mnr-entry-prompt-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}

@media (max-width: 480px) {
  .mnr-entry-prompt-card {
    padding: 20px;
  }

  .mnr-entry-prompt-header {
    gap: 12px;
  }

  .mnr-entry-prompt-icon {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mnr-entry-prompt-card,
  .mnr-entry-button,
  .mnr-entry-prompt-fade-enter-active,
  .mnr-entry-prompt-fade-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
