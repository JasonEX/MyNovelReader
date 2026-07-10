<template>
  <Transition name="mnr-slide">
    <div v-if="visible" class="mnr-settings-overlay" @click.self="closePanel">
      <section
        ref="panelRef"
        class="mnr-settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mnr-settings-title"
        @keydown.esc.stop="closePanel"
        @keydown.tab="trapFocus"
      >
        <header class="mnr-settings-header">
          <h3 id="mnr-settings-title">阅读设置</h3>
          <button
            ref="closeButtonRef"
            class="mnr-close-btn"
            aria-label="关闭设置"
            @click="closePanel"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div class="mnr-settings-content">
          <section class="mnr-settings-section">
            <h4>主题</h4>
            <div class="mnr-theme-grid">
              <button
                v-for="theme in themes"
                :key="theme.id"
                class="mnr-theme-btn"
                :class="{ active: currentTheme === theme.id }"
                :aria-pressed="currentTheme === theme.id"
                :style="{
                  background: theme.background,
                  color: theme.text,
                  borderColor:
                    currentTheme === theme.id ? 'var(--mnr-link, #1976d2)' : theme.border,
                }"
                @click="setTheme(theme.id)"
              >
                {{ theme.name }}
              </button>
            </div>
          </section>

          <section class="mnr-settings-section">
            <h4>字号</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label" aria-hidden="true">A</span>
              <input
                type="range"
                min="14"
                max="28"
                :value="fontSize"
                class="mnr-slider"
                aria-label="字体大小"
                @input="updateFontSize"
              />
              <span class="mnr-slider-label mnr-slider-label--large" aria-hidden="true">A</span>
              <span class="mnr-slider-value">{{ fontSize }}px</span>
            </div>
          </section>

          <section class="mnr-settings-section">
            <h4>行距</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label" aria-hidden="true">
                <svg class="mnr-scale-icon" viewBox="0 0 24 24">
                  <path d="M5 9h14M5 12h14M5 15h14" />
                </svg>
              </span>
              <input
                type="range"
                min="1.4"
                max="2.4"
                step="0.1"
                :value="lineHeight"
                class="mnr-slider"
                aria-label="行间距"
                @input="updateLineHeight"
              />
              <span class="mnr-slider-label" aria-hidden="true">
                <svg class="mnr-scale-icon" viewBox="0 0 24 24">
                  <path d="M5 6h14M5 12h14M5 18h14" />
                </svg>
              </span>
              <span class="mnr-slider-value">{{ lineHeight }}</span>
            </div>
          </section>

          <section class="mnr-settings-section">
            <h4>字间距</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label" aria-hidden="true">紧</span>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                :value="letterSpacing"
                class="mnr-slider"
                aria-label="文字间距"
                @input="updateLetterSpacing"
              />
              <span class="mnr-slider-label" aria-hidden="true">松</span>
              <span class="mnr-slider-value">{{ letterSpacing.toFixed(2) }}em</span>
            </div>
          </section>

          <section class="mnr-settings-section">
            <h4>段落缩进</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label" aria-hidden="true">0</span>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                :value="paragraphIndent"
                class="mnr-slider"
                aria-label="段落首行缩进"
                @input="updateParagraphIndent"
              />
              <span class="mnr-slider-label" aria-hidden="true">4</span>
              <span class="mnr-slider-value">{{ paragraphIndent }}em</span>
            </div>
          </section>

          <section class="mnr-settings-section">
            <h4>内容宽度</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label" aria-hidden="true">
                <svg class="mnr-scale-icon" viewBox="0 0 24 24">
                  <path d="m4 8 4 4-4 4M20 8l-4 4 4 4" />
                </svg>
              </span>
              <input
                type="range"
                min="500"
                max="1200"
                step="50"
                :value="maxWidth"
                class="mnr-slider"
                aria-label="正文内容宽度"
                @input="updateMaxWidth"
              />
              <span class="mnr-slider-label" aria-hidden="true">
                <svg class="mnr-scale-icon" viewBox="0 0 24 24">
                  <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />
                </svg>
              </span>
              <span class="mnr-slider-value">{{ maxWidth }}px</span>
            </div>
          </section>

          <section class="mnr-settings-section">
            <h4>内容边距</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label" aria-hidden="true">窄</span>
              <input
                type="range"
                min="12"
                max="48"
                step="2"
                :value="padding"
                class="mnr-slider"
                aria-label="正文内容边距"
                @input="updatePadding"
              />
              <span class="mnr-slider-label" aria-hidden="true">宽</span>
              <span class="mnr-slider-value">{{ padding }}px</span>
            </div>
          </section>

          <section class="mnr-settings-section">
            <label class="mnr-field-label" for="mnr-font-family">字体</label>
            <select
              id="mnr-font-family"
              v-model="fontFamily"
              class="mnr-select"
              @change="updateFontFamily"
            >
              <option v-for="option in fontOptions" :key="option.label" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </section>

          <section class="mnr-settings-section">
            <h4>简繁转换</h4>
            <div class="mnr-segmented-control">
              <button
                v-for="option in conversionOptions"
                :key="option.value"
                class="mnr-segment"
                :class="{ active: textConversion === option.value }"
                :aria-pressed="textConversion === option.value"
                @click="updateTextConversion(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </section>

          <details class="mnr-more-settings">
            <summary>更多设置</summary>
            <div class="mnr-more-content">
              <label class="mnr-switch-row">
                <span>显示阅读进度</span>
                <input
                  v-model="showProgress"
                  type="checkbox"
                  @change="updateBehavior('showProgress', showProgress)"
                />
              </label>

              <label class="mnr-switch-row">
                <span>自动加载下一章</span>
                <input
                  v-model="preloadNext"
                  type="checkbox"
                  @change="updateBehavior('preloadNext', preloadNext)"
                />
              </label>

              <label class="mnr-switch-row">
                <span>键盘导航</span>
                <input
                  v-model="keyboardNavigation"
                  type="checkbox"
                  @change="updateBehavior('keyboardNavigation', keyboardNavigation)"
                />
              </label>

              <label class="mnr-switch-row">
                <span>触摸手势</span>
                <input
                  v-model="swipeGestures"
                  type="checkbox"
                  @change="updateBehavior('swipeGestures', swipeGestures)"
                />
              </label>

              <label class="mnr-switch-row">
                <span>自动隐藏工具栏</span>
                <input
                  v-model="autoHideHeader"
                  type="checkbox"
                  @change="updateBehavior('autoHideHeader', autoHideHeader)"
                />
              </label>

              <label class="mnr-switch-row">
                <span>在本站自动开启</span>
                <input
                  v-model="siteAutoEnable"
                  type="checkbox"
                  @change="emit('siteAutoEnableChange', siteAutoEnable)"
                />
              </label>

              <div class="mnr-more-section">
                <span class="mnr-more-label">网站防护</span>
                <div class="mnr-segmented-control">
                  <button
                    class="mnr-segment"
                    :class="{ active: protectionMode === 'standard' }"
                    :aria-pressed="protectionMode === 'standard'"
                    @click="updateProtectionMode('standard')"
                  >
                    标准
                  </button>
                  <button
                    class="mnr-segment"
                    :class="{ active: protectionMode === 'aggressive' }"
                    :aria-pressed="protectionMode === 'aggressive'"
                    @click="updateProtectionMode('aggressive')"
                  >
                    强力
                  </button>
                </div>
              </div>

              <div class="mnr-more-section">
                <label class="mnr-more-label" for="mnr-custom-css">自定义 CSS</label>
                <textarea
                  id="mnr-custom-css"
                  v-model="customCSS"
                  class="mnr-custom-css"
                  rows="5"
                  spellcheck="false"
                  placeholder=".mnr-reader-content { ... }"
                  @input="updateCustomCSS"
                ></textarea>
              </div>

              <div class="mnr-action-buttons">
                <button class="mnr-action-btn" @click="emit('cacheAll')">
                  {{ cacheProgress.running ? '取消缓存' : '离线缓存' }}
                  <span v-if="cacheProgress.total > 0" class="mnr-cache-progress">
                    {{ cacheProgress.done }}/{{ cacheProgress.total }}
                  </span>
                </button>
                <button
                  v-if="!cacheProgress.running && cacheProgress.failed > 0"
                  class="mnr-action-btn"
                  @click="emit('retryCache')"
                >
                  重试失败章节（{{ cacheProgress.failed }}）
                </button>
                <button v-if="persistedCount > 0" class="mnr-action-btn" @click="handleClearCache">
                  清除离线缓存（{{ persistedCount }}）
                </button>
                <button class="mnr-action-btn" @click="emit('copyDiagnostics')">
                  复制诊断信息
                </button>
                <button class="mnr-action-btn mnr-action-btn--danger" @click="emit('exit')">
                  退出阅读模式
                </button>
              </div>
            </div>
          </details>
        </div>
      </section>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { THEMES, useConfigStore } from '@/ui/stores/config';
import { useReaderStore } from '@/ui/stores/reader';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    siteAutoEnable?: boolean;
  }>(),
  { siteAutoEnable: true }
);

const emit = defineEmits<{
  close: [];
  cacheAll: [];
  retryCache: [];
  copyDiagnostics: [];
  exit: [];
  siteAutoEnableChange: [enabled: boolean];
  textConversionChange: [mode: 'none' | 'sc' | 'tc'];
  protectionModeChange: [mode: 'standard' | 'aggressive'];
}>();

const configStore = useConfigStore();
const readerStore = useReaderStore();
const panelRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<globalThis.HTMLButtonElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

const conversionOptions = [
  { label: '原文', value: 'none' },
  { label: '简体', value: 'sc' },
  { label: '繁體', value: 'tc' },
] as const;
const fontOptions = [
  {
    label: '系统默认',
    value: 'system-ui, -apple-system, "Microsoft YaHei", sans-serif',
  },
  { label: '思源宋体', value: "'Noto Serif SC', 'Source Han Serif SC', serif" },
  { label: '苹方', value: "'PingFang SC', 'Hiragino Sans GB', sans-serif" },
  { label: '楷体', value: "'Kaiti SC', 'STKaiti', serif" },
] as const;
const currentTheme = computed(() => configStore.themeId);
const themes = THEMES;
const cacheProgress = computed(() => readerStore.cacheProgress);
const persistedCount = computed(() => readerStore.persistedUrls.size);

const fontSize = ref(configStore.reading.fontSize);
const lineHeight = ref(configStore.reading.lineHeight);
const letterSpacing = ref(configStore.reading.letterSpacing);
const paragraphIndent = ref(configStore.reading.paragraphIndent);
const maxWidth = ref(configStore.reading.maxWidth);
const padding = ref(configStore.reading.padding);
const fontFamily = ref(configStore.reading.fontFamily);
const textConversion = ref(configStore.reading.textConversion);
const showProgress = ref(configStore.behavior.showProgress);
const preloadNext = ref(configStore.behavior.preloadNext);
const keyboardNavigation = ref(configStore.behavior.keyboardNavigation);
const swipeGestures = ref(configStore.behavior.swipeGestures);
const autoHideHeader = ref(configStore.behavior.autoHideHeader);
const siteAutoEnable = ref(props.siteAutoEnable);
const protectionMode = ref(configStore.protection.mode);
const customCSS = ref(configStore.customCSS);

function closePanel() {
  void configStore.flushSave();
  emit('close');
}

function trapFocus(event: globalThis.KeyboardEvent) {
  const panel = panelRef.value;
  if (!panel) return;
  const focusable = Array.from(
    panel.querySelectorAll<globalThis.HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(element => element.offsetParent !== null || element === document.activeElement);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setTheme(id: string) {
  configStore.setTheme(id);
}

function updateFontSize(event: Event) {
  const value = Number((event.target as globalThis.HTMLInputElement).value);
  fontSize.value = value;
  configStore.updateReading({ fontSize: value });
  configStore.applyReading();
}

function updateLineHeight(event: Event) {
  const value = Number((event.target as globalThis.HTMLInputElement).value);
  lineHeight.value = value;
  configStore.updateReading({ lineHeight: value });
  configStore.applyReading();
}

function updateLetterSpacing(event: Event) {
  const value = Number((event.target as globalThis.HTMLInputElement).value);
  letterSpacing.value = value;
  configStore.updateReading({ letterSpacing: value });
  configStore.applyReading();
}

function updateParagraphIndent(event: Event) {
  const value = Number((event.target as globalThis.HTMLInputElement).value);
  paragraphIndent.value = value;
  configStore.updateReading({ paragraphIndent: value });
  configStore.applyReading();
}

function updateMaxWidth(event: Event) {
  const value = Number((event.target as globalThis.HTMLInputElement).value);
  maxWidth.value = value;
  configStore.updateReading({ maxWidth: value });
  configStore.applyReading();
}

function updatePadding(event: Event) {
  const value = Number((event.target as globalThis.HTMLInputElement).value);
  padding.value = value;
  configStore.updateReading({ padding: value });
  configStore.applyReading();
}

function updateFontFamily() {
  configStore.updateReading({ fontFamily: fontFamily.value });
  configStore.applyReading();
}

function updateTextConversion(mode: 'none' | 'sc' | 'tc') {
  textConversion.value = mode;
  configStore.updateReading({ textConversion: mode });
  emit('textConversionChange', mode);
}

function updateBehavior(
  key: 'showProgress' | 'preloadNext' | 'keyboardNavigation' | 'swipeGestures' | 'autoHideHeader',
  value: boolean
) {
  configStore.updateBehavior({ [key]: value });
}

function updateProtectionMode(mode: 'standard' | 'aggressive') {
  protectionMode.value = mode;
  configStore.updateProtection({ mode });
  emit('protectionModeChange', mode);
}

function updateCustomCSS() {
  configStore.setCustomCSS(customCSS.value);
}

async function handleClearCache() {
  if (!window.confirm('确定要清除本书的离线缓存吗？')) return;
  await readerStore.clearPersistedCache();
  readerStore.showToast('离线缓存已清除', 'info');
}

watch(
  () => props.siteAutoEnable,
  value => {
    siteAutoEnable.value = value;
  }
);

watch(
  () => props.visible,
  async visible => {
    if (visible) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      fontSize.value = configStore.reading.fontSize;
      lineHeight.value = configStore.reading.lineHeight;
      letterSpacing.value = configStore.reading.letterSpacing;
      paragraphIndent.value = configStore.reading.paragraphIndent;
      maxWidth.value = configStore.reading.maxWidth;
      padding.value = configStore.reading.padding;
      fontFamily.value = configStore.reading.fontFamily;
      textConversion.value = configStore.reading.textConversion;
      showProgress.value = configStore.behavior.showProgress;
      preloadNext.value = configStore.behavior.preloadNext;
      keyboardNavigation.value = configStore.behavior.keyboardNavigation;
      swipeGestures.value = configStore.behavior.swipeGestures;
      autoHideHeader.value = configStore.behavior.autoHideHeader;
      siteAutoEnable.value = props.siteAutoEnable;
      protectionMode.value = configStore.protection.mode;
      customCSS.value = configStore.customCSS;
      await nextTick();
      closeButtonRef.value?.focus({ preventScroll: true });
      return;
    }

    void configStore.flushSave();
    previouslyFocused?.focus?.({ preventScroll: true });
    previouslyFocused = null;
  }
);
</script>

<style>
.mnr-settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.mnr-settings-panel {
  display: flex;
  width: min(100%, 380px);
  height: 100%;
  flex-direction: column;
  padding-right: env(safe-area-inset-right);
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.mnr-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: max(16px, env(safe-area-inset-top)) 16px 16px;
  border-bottom: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-settings-header h3,
.mnr-settings-section h4,
.mnr-field-label {
  margin: 0;
  color: var(--mnr-text, #333);
}

.mnr-settings-header h3 {
  font-size: 18px;
}

.mnr-close-btn {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.mnr-close-btn svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.mnr-settings-content {
  flex: 1;
  overflow: auto;
  padding: 18px 16px max(24px, env(safe-area-inset-bottom));
}

.mnr-settings-section {
  margin-bottom: 22px;
}

.mnr-settings-section h4,
.mnr-field-label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}

.mnr-theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.mnr-theme-btn {
  min-width: 0;
  padding: 10px 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}

.mnr-slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mnr-slider-label {
  flex: 0 0 30px;
  width: 30px;
  color: var(--mnr-text, #666);
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.mnr-slider-label--large {
  font-size: 1.2em;
}

.mnr-scale-icon {
  display: block;
  width: 22px;
  height: 22px;
  margin: 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mnr-slider {
  flex: 1;
  min-width: 0;
  height: 4px;
  appearance: none;
  border-radius: 2px;
  background: var(--mnr-border, #e0e0e0);
}

.mnr-slider::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  appearance: none;
  border-radius: 50%;
  background: var(--mnr-link, #1976d2);
  cursor: pointer;
}

.mnr-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: var(--mnr-link, #1976d2);
  cursor: pointer;
}

.mnr-slider-value {
  flex: 0 0 60px;
  width: 60px;
  color: var(--mnr-text, #666);
  font-size: 13px;
  text-align: right;
  white-space: nowrap;
}

.mnr-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 8px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  font-size: 14px;
}

.mnr-segmented-control {
  display: flex;
  overflow: hidden;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 8px;
}

.mnr-segment {
  flex: 1;
  padding: 10px 12px;
  border: 0;
  border-right: 1px solid var(--mnr-border, #ddd);
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #666);
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
}

.mnr-segment:last-child {
  border-right: 0;
}

.mnr-segment.active {
  background: var(--mnr-link, #1976d2);
  color: var(--mnr-on-link, #fff);
}

.mnr-more-settings {
  border-top: 1px solid var(--mnr-border, #ddd);
}

.mnr-more-settings summary {
  padding: 16px 0;
  color: var(--mnr-text, #555);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.mnr-more-content {
  padding-bottom: 8px;
}

.mnr-more-section {
  margin-top: 16px;
}

.mnr-more-label {
  display: block;
  margin-bottom: 8px;
  color: var(--mnr-text, #333);
  font-size: 14px;
  font-weight: 600;
}

.mnr-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  color: var(--mnr-text, #333);
  cursor: pointer;
}

.mnr-switch-row input {
  width: 40px;
  height: 22px;
  accent-color: var(--mnr-link, #1976d2);
}

.mnr-custom-css {
  box-sizing: border-box;
  width: 100%;
  min-height: 110px;
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 8px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  font:
    12px/1.5 ui-monospace,
    SFMono-Regular,
    Consolas,
    monospace;
}

.mnr-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.mnr-action-btn {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 8px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  font-size: 14px;
  cursor: pointer;
}

.mnr-action-btn--danger {
  border-color: #c93f49;
  color: #c93f49;
}

.mnr-cache-progress {
  margin-left: 6px;
  opacity: 0.75;
}

.mnr-close-btn:hover,
.mnr-action-btn:hover,
.mnr-segment:hover {
  background: var(--mnr-border, #f0f0f0);
}

.mnr-close-btn:focus-visible,
.mnr-theme-btn:focus-visible,
.mnr-slider:focus-visible,
.mnr-select:focus-visible,
.mnr-custom-css:focus-visible,
.mnr-segment:focus-visible,
.mnr-action-btn:focus-visible,
.mnr-more-settings summary:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--mnr-link, #1976d2) 55%, transparent);
  outline-offset: 2px;
}

.mnr-slide-enter-active,
.mnr-slide-leave-active,
.mnr-settings-panel {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.mnr-slide-enter-from,
.mnr-slide-leave-to {
  opacity: 0;
}

.mnr-slide-enter-from .mnr-settings-panel,
.mnr-slide-leave-to .mnr-settings-panel {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .mnr-settings-panel {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mnr-slide-enter-active,
  .mnr-slide-leave-active,
  .mnr-settings-panel {
    transition: none;
  }
}
</style>
