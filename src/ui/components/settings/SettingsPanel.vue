<template>
  <Transition name="mnr-slide">
    <div v-if="visible" class="mnr-settings-overlay" @click.self="$emit('close')">
      <div class="mnr-settings-panel">
        <!-- Header -->
        <div class="mnr-settings-header">
          <h3>阅读设置</h3>
          <span class="mnr-shortcut-hint">S</span>
          <button class="mnr-close-btn" @click="$emit('close')">✕</button>
        </div>

        <!-- Content -->
        <div class="mnr-settings-content">
          <!-- Theme -->
          <section class="mnr-settings-section">
            <h4>主题</h4>
            <div class="mnr-theme-grid">
              <button
                v-for="theme in themes"
                :key="theme.id"
                class="mnr-theme-btn"
                :class="{ active: currentTheme === theme.id }"
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

          <!-- Font size -->
          <section class="mnr-settings-section">
            <h4>字体大小</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label">A</span>
              <input
                type="range"
                min="14"
                max="28"
                :value="fontSize"
                class="mnr-slider"
                @input="updateFontSize"
              />
              <span class="mnr-slider-label" style="font-size: 1.2em">A</span>
              <span class="mnr-slider-value">{{ fontSize }}px</span>
            </div>
          </section>

          <!-- Line height -->
          <section class="mnr-settings-section">
            <h4>行间距</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label">≡</span>
              <input
                type="range"
                min="1.4"
                max="2.4"
                step="0.1"
                :value="lineHeight"
                class="mnr-slider"
                @input="updateLineHeight"
              />
              <span class="mnr-slider-label">☰</span>
              <span class="mnr-slider-value">{{ lineHeight }}</span>
            </div>
          </section>

          <!-- Content width -->
          <section class="mnr-settings-section">
            <h4>内容宽度</h4>
            <div class="mnr-slider-row">
              <span class="mnr-slider-label">⊏⊐</span>
              <input
                type="range"
                min="500"
                max="1200"
                step="50"
                :value="maxWidth"
                class="mnr-slider"
                @input="updateMaxWidth"
              />
              <span class="mnr-slider-label">⊏ ⊐</span>
              <span class="mnr-slider-value">{{ maxWidth }}px</span>
            </div>
          </section>

          <!-- Font family -->
          <section class="mnr-settings-section">
            <h4>字体</h4>
            <select v-model="fontFamily" class="mnr-select" @change="updateFontFamily">
              <option value="system-ui, -apple-system, 'Microsoft YaHei', sans-serif">
                系统默认
              </option>
              <option value="'Noto Serif SC', 'Source Han Serif SC', serif">思源宋体</option>
              <option value="'PingFang SC', 'Hiragino Sans GB', sans-serif">苹方</option>
              <option value="'Kaiti SC', 'STKaiti', serif">楷体</option>
            </select>
          </section>

          <!-- Text conversion -->
          <section class="mnr-settings-section">
            <h4>简繁转换</h4>
            <div class="mnr-segmented-control">
              <button
                class="mnr-segment"
                :class="{ active: textConversion === 'none' }"
                @click="updateTextConversion('none')"
              >
                原文
              </button>
              <button
                class="mnr-segment"
                :class="{ active: textConversion === 'sc' }"
                @click="updateTextConversion('sc')"
              >
                简体
              </button>
              <button
                class="mnr-segment"
                :class="{ active: textConversion === 'tc' }"
                @click="updateTextConversion('tc')"
              >
                繁體
              </button>
            </div>
            <p v-if="textConversion !== 'none'" class="mnr-hint">
              {{ textConversion === 'sc' ? '将繁体转换为简体中文' : '將簡體轉換為繁體中文' }}
            </p>
          </section>

          <!-- Behavior -->
          <section class="mnr-settings-section">
            <h4>阅读行为</h4>

            <label class="mnr-switch-row">
              <span>键盘导航</span>
              <input
                v-model="keyboardNav"
                type="checkbox"
                @change="updateBehavior('keyboardNavigation', keyboardNav)"
              />
            </label>

            <label class="mnr-switch-row">
              <span>手势翻页</span>
              <input
                v-model="swipeGestures"
                type="checkbox"
                @change="updateBehavior('swipeGestures', swipeGestures)"
              />
            </label>

            <label class="mnr-switch-row">
              <span>自动隐藏顶栏</span>
              <input
                v-model="autoHideHeader"
                type="checkbox"
                @change="updateBehavior('autoHideHeader', autoHideHeader)"
              />
            </label>

            <label class="mnr-switch-row">
              <span>显示阅读进度</span>
              <input
                v-model="showProgress"
                type="checkbox"
                @change="updateBehavior('showProgress', showProgress)"
              />
            </label>
          </section>

          <!-- Protection -->
          <section class="mnr-settings-section">
            <h4>页面防护</h4>
            <div class="mnr-segmented-control">
              <button
                class="mnr-segment"
                :class="{ active: protectionMode === 'standard' }"
                @click="updateProtectionMode('standard')"
              >
                标准
              </button>
              <button
                class="mnr-segment"
                :class="{ active: protectionMode === 'aggressive' }"
                @click="updateProtectionMode('aggressive')"
              >
                激进
              </button>
            </div>
            <p class="mnr-hint">激进模式会尝试清理可疑脚本，可能影响站点功能。</p>
          </section>

          <!-- Actions -->
          <section class="mnr-settings-section">
            <h4>操作</h4>
            <div class="mnr-action-buttons">
              <div class="mnr-rule-row">
                <button class="mnr-action-btn" @click="$emit('editRule')">编辑站点规则</button>
                <button
                  v-if="hasUserRule"
                  class="mnr-action-btn mnr-action-btn--danger"
                  @click="handleResetRule"
                >
                  重置
                </button>
              </div>
              <div class="mnr-cache-row">
                <button class="mnr-action-btn" @click="$emit('cacheAll')">
                  缓存本书
                  <span v-if="cacheProgress.total > 0" class="mnr-cache-progress">
                    {{ cacheProgress.done }}/{{ cacheProgress.total }}
                  </span>
                </button>
                <button
                  v-if="persistedCount > 0"
                  class="mnr-action-btn mnr-action-btn--danger"
                  @click="handleClearCache"
                >
                  清除
                  <span class="mnr-cache-count">({{ persistedCount }})</span>
                </button>
              </div>
              <button class="mnr-action-btn" @click="handleCopyDiagnosticInfo">复制诊断信息</button>
              <button
                class="mnr-action-btn"
                @click="
                  $emit('close');
                  closeReader();
                "
              >
                退出阅读模式
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useConfigStore, THEMES } from '@/ui/stores/config';
import { useReaderStore } from '@/ui/stores/reader';
import { useRuleStore } from '@/ui/stores/rule';
import { closeReader, getAppDebugSnapshot } from '@/bootstrap';
import { copyDiagnosticInfo } from '@/ui/debug/diagnostics';
import { getSiteProtection } from '@/core/protection';

const props = defineProps<{
  visible: boolean;
  domain?: string;
}>();

const emit = defineEmits<{
  close: [];
  editRule: [];
  resetRule: [];
  cacheAll: [];
  textConversionChange: [mode: 'none' | 'sc' | 'tc'];
}>();

// Store
const configStore = useConfigStore();
const readerStore = useReaderStore();
const ruleStore = useRuleStore();

// Check if current site has user rule
const hasUserRule = computed(() => {
  if (!props.domain) return false;
  return ruleStore.hasUserRule(props.domain);
});

// Local state synced with store
const themes = THEMES;
const currentTheme = computed(() => configStore.themeId);
const fontSize = ref(configStore.reading.fontSize);
const lineHeight = ref(configStore.reading.lineHeight);
const maxWidth = ref(configStore.reading.maxWidth);
const fontFamily = ref(configStore.reading.fontFamily);
const textConversion = ref(configStore.reading.textConversion);
const keyboardNav = ref(configStore.behavior.keyboardNavigation);
const swipeGestures = ref(configStore.behavior.swipeGestures);
const autoHideHeader = ref(configStore.behavior.autoHideHeader);
const showProgress = ref(configStore.behavior.showProgress);
const protectionMode = ref(configStore.protection.mode);
const cacheProgress = computed(() => readerStore.cacheProgress);
const persistedCount = computed(() => readerStore.persistedUrls.size);

// Methods
function setTheme(id: string) {
  configStore.setTheme(id);
}

function updateFontSize(e: Event) {
  const value = Number((e.target as globalThis.HTMLInputElement).value);
  fontSize.value = value;
  configStore.updateReading({ fontSize: value });
  configStore.applyReading();
}

function updateLineHeight(e: Event) {
  const value = Number((e.target as globalThis.HTMLInputElement).value);
  lineHeight.value = value;
  configStore.updateReading({ lineHeight: value });
  configStore.applyReading();
}

function updateMaxWidth(e: Event) {
  const value = Number((e.target as globalThis.HTMLInputElement).value);
  maxWidth.value = value;
  configStore.updateReading({ maxWidth: value });
  configStore.applyReading();
}

function updateFontFamily() {
  configStore.updateReading({ fontFamily: fontFamily.value });
  configStore.applyReading();
}

function updateTextConversion(mode: 'none' | 'sc' | 'tc') {
  textConversion.value = mode;
  configStore.updateReading({ textConversion: mode });
  // Emit event to trigger content re-conversion
  emit('textConversionChange', mode);
}

function updateBehavior(key: string, value: boolean) {
  configStore.updateBehavior({ [key]: value });
}

function updateProtectionMode(mode: 'standard' | 'aggressive') {
  protectionMode.value = mode;
  configStore.updateProtection({ mode });
  if (mode === 'aggressive') {
    getSiteProtection().cleanupScripts();
  }
}

async function handleClearCache() {
  if (window.confirm('确定要清除本书的缓存吗？')) {
    await readerStore.clearPersistedCache();
  }
}

async function handleCopyDiagnosticInfo() {
  await copyDiagnosticInfo({
    readerStore,
    configStore,
    bootstrap: getAppDebugSnapshot(),
    notify: (message, type = 'info') => readerStore.showToast(message, type),
  });
}

async function handleResetRule() {
  if (window.confirm('确定要重置站点规则吗？将恢复为默认/自动检测。')) {
    if (props.domain) {
      await ruleStore.deleteUserRule(props.domain);
      emit('resetRule');
    }
  }
}

// Sync with store when panel opens
watch(
  () => props.visible,
  visible => {
    if (visible) {
      fontSize.value = configStore.reading.fontSize;
      lineHeight.value = configStore.reading.lineHeight;
      maxWidth.value = configStore.reading.maxWidth;
      fontFamily.value = configStore.reading.fontFamily;
      textConversion.value = configStore.reading.textConversion;
      keyboardNav.value = configStore.behavior.keyboardNavigation;
      swipeGestures.value = configStore.behavior.swipeGestures;
      autoHideHeader.value = configStore.behavior.autoHideHeader;
      showProgress.value = configStore.behavior.showProgress;
      protectionMode.value = configStore.protection.mode;
    }
  }
);
</script>

<style>
/* Settings panel styles - not scoped because Teleport moves content outside Vue tree */
.mnr-settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.mnr-settings-panel {
  width: 100%;
  max-width: 360px;
  height: 100%;
  background: var(--mnr-bg, #fff);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
}

.mnr-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-settings-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--mnr-text, #333);
}

.mnr-shortcut-hint {
  margin-left: auto;
  margin-right: 12px;
  padding: 2px 8px;
  background: var(--mnr-border, #e0e0e0);
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  color: var(--mnr-text, #666);
}

.mnr-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  color: var(--mnr-text, #666);
}

.mnr-settings-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.mnr-settings-section {
  margin-bottom: 24px;
}

.mnr-settings-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--mnr-text, #555);
}

/* Theme grid */
.mnr-theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.mnr-theme-btn {
  padding: 12px 8px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.mnr-theme-btn.active {
  border-color: var(--mnr-link, #1976d2);
}

/* Sliders */
.mnr-slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mnr-slider-label {
  flex: 0 0 34px;
  width: 34px;
  text-align: center;
  line-height: 1;
  white-space: nowrap;
  color: var(--mnr-text, #666);
}

.mnr-slider {
  flex: 1 1 auto;
  min-width: 0;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--mnr-border, #e0e0e0);
  border-radius: 2px;
}

.mnr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--mnr-link, #1976d2);
  border-radius: 50%;
  cursor: pointer;
}

.mnr-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--mnr-link, #1976d2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.mnr-slider-value {
  flex: 0 0 64px;
  width: 64px;
  text-align: right;
  white-space: nowrap;
  font-size: 13px;
  color: var(--mnr-text, #666);
}

/* Select */
.mnr-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 6px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  font-size: 14px;
}

/* Segmented control */
.mnr-segmented-control {
  display: flex;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 8px;
  overflow: hidden;
}

.mnr-segment {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #666);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mnr-segment:not(:last-child) {
  border-right: 1px solid var(--mnr-border, #ddd);
}

.mnr-segment:hover {
  background: var(--mnr-border, #f0f0f0);
}

.mnr-segment.active {
  background: var(--mnr-link, #1976d2);
  color: var(--mnr-on-link, #fff);
}

.mnr-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--mnr-text, #888);
  opacity: 0.8;
}

/* Switch rows */
.mnr-switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  color: var(--mnr-text, #333);
}

.mnr-switch-row input {
  width: 40px;
  height: 22px;
  accent-color: var(--mnr-link, #1976d2);
}

/* Action buttons */
.mnr-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mnr-rule-row {
  display: flex;
  gap: 8px;
}

.mnr-rule-row .mnr-action-btn {
  flex: 1;
}

.mnr-cache-row {
  display: flex;
  gap: 8px;
}

.mnr-cache-row .mnr-action-btn {
  flex: 1;
}

.mnr-action-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 6px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  font-size: 14px;
  cursor: pointer;
}

.mnr-action-btn:hover {
  background: var(--mnr-border, #f5f5f5);
}

.mnr-action-btn--danger {
  background: #dc3545;
  color: #fff;
  border-color: #dc3545;
}

.mnr-action-btn--danger:hover {
  background: #c82333;
  border-color: #c82333;
}

.mnr-cache-count {
  margin-left: 4px;
  opacity: 0.8;
}

/* Transitions */
.mnr-slide-enter-active,
.mnr-slide-leave-active {
  transition: all 0.3s ease;
}

.mnr-slide-enter-from,
.mnr-slide-leave-to {
  opacity: 0;
}

.mnr-slide-enter-from .mnr-settings-panel,
.mnr-slide-leave-to .mnr-settings-panel {
  transform: translateX(100%);
}

/* Mobile */
@media (max-width: 480px) {
  .mnr-settings-panel {
    max-width: 100%;
  }

  .mnr-theme-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
