<template>
  <div class="mnr-rule-editor" :class="{ 'mnr-editor-hidden': pickerActive }">
    <!-- Header -->
    <div class="mnr-editor-header">
      <h3 class="mnr-editor-title">{{ isNew ? '创建规则' : '编辑规则' }}</h3>
      <span class="mnr-shortcut-hint">E</span>
      <div class="mnr-editor-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="mnr-tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Visual Editor Tab -->
    <div v-show="activeTab === 'visual'" class="mnr-editor-content">
      <!-- Basic info -->
      <div class="mnr-form-section">
        <h4 class="mnr-section-title">基本信息</h4>

        <div class="mnr-form-group">
          <label>规则名称</label>
          <input v-model="localRule.name" type="text" placeholder="例如: 起点中文网" />
        </div>

        <div class="mnr-form-group">
          <label>URL 匹配模式</label>
          <input
            v-model="localRule.match.pattern"
            type="text"
            placeholder="正则表达式，例如: ^https://www\\.example\\.com/"
          />
          <span class="mnr-hint">正则表达式，匹配当前页面 URL</span>
        </div>
      </div>

      <!-- Content selector -->
      <div class="mnr-form-section">
        <h4 class="mnr-section-title">内容选择器</h4>

        <SelectorPreview
          v-model:selector="localRule.content.selector"
          label="正文内容"
          :show-preview="true"
          preview-type="html"
          @pick="startPicking('content')"
        />

        <div class="mnr-form-group">
          <label>移除元素</label>
          <input
            v-model="localRule.content.remove"
            type="text"
            placeholder="例如: .ad, .comment, script"
          />
          <span class="mnr-hint">要从内容中移除的元素选择器，逗号分隔</span>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mnr-form-section">
        <h4 class="mnr-section-title">导航链接</h4>

        <SelectorPreview
          v-model:selector="navPrev"
          label="上一章"
          :show-preview="false"
          @pick="startPicking('prev')"
        />

        <SelectorPreview
          v-model:selector="navNext"
          label="下一章"
          :show-preview="false"
          @pick="startPicking('next')"
        />

        <SelectorPreview
          v-model:selector="navIndex"
          label="目录"
          :show-preview="false"
          @pick="startPicking('index')"
        />
      </div>

      <!-- Title -->
      <div class="mnr-form-section">
        <h4 class="mnr-section-title">标题</h4>

        <SelectorPreview
          v-model:selector="titleSelector"
          label="章节标题"
          :show-preview="true"
          preview-type="text"
          @pick="startPicking('title')"
        />
      </div>
    </div>

    <!-- JSON/YAML Editor Tab -->
    <div v-show="activeTab === 'code'" class="mnr-editor-content">
      <div class="mnr-code-toolbar">
        <select v-model="codeFormat" class="mnr-format-select">
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
        </select>
        <button class="mnr-toolbar-btn" @click="formatCode">格式化</button>
        <button class="mnr-toolbar-btn" @click="validateCode">验证</button>
      </div>

      <textarea
        v-model="codeContent"
        class="mnr-code-editor"
        spellcheck="false"
        @blur="parseCode"
      ></textarea>

      <div v-if="codeError" class="mnr-code-error">
        {{ codeError }}
      </div>
    </div>

    <!-- Advanced Tab -->
    <div v-show="activeTab === 'advanced'" class="mnr-editor-content">
      <div class="mnr-form-section">
        <h4 class="mnr-section-title">处理选项</h4>

        <label class="mnr-checkbox-row">
          <input v-model="processingOptions.removeAds" type="checkbox" />
          <span>移除广告</span>
        </label>

        <label class="mnr-checkbox-row">
          <input v-model="processingOptions.fixImages" type="checkbox" />
          <span>修复图片</span>
        </label>

        <label class="mnr-checkbox-row">
          <input v-model="processingOptions.useRawContent" type="checkbox" />
          <span>使用原始内容（不处理）</span>
        </label>
      </div>

      <div class="mnr-form-section">
        <h4 class="mnr-section-title">自定义钩子</h4>

        <div class="mnr-form-group">
          <label>解析前执行 (beforeParse)</label>
          <textarea
            v-model="hookBeforeParse"
            class="mnr-hook-editor"
            placeholder="// JavaScript 代码，参数: doc"
          ></textarea>
        </div>

        <div class="mnr-form-group">
          <label>解析后执行 (afterParse)</label>
          <textarea
            v-model="hookAfterParse"
            class="mnr-hook-editor"
            placeholder="// JavaScript 代码，参数: content"
          ></textarea>
        </div>
      </div>

      <div class="mnr-form-section">
        <h4 class="mnr-section-title">自定义 CSS</h4>
        <div class="mnr-form-group">
          <textarea
            v-model="customCSS"
            class="mnr-css-editor"
            placeholder="/* 自定义样式 */"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mnr-editor-footer">
      <button class="mnr-btn mnr-btn-secondary" @click="$emit('cancel')">取消</button>
      <button class="mnr-btn mnr-btn-primary" :disabled="!isValid" @click="save">保存规则</button>
    </div>

    <!-- Element Picker -->
    <ElementPicker
      v-model:active="pickerActive"
      :mode="pickerMode"
      @select="handlePickerSelect"
      @cancel="handlePickerCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, toRaw } from 'vue';
import type { SiteRule } from '@/core/rules/types';
import ElementPicker, { type PickerMode } from './ElementPicker.vue';
import SelectorPreview from './SelectorPreview.vue';

const props = defineProps<{
  rule?: SiteRule;
  domain?: string;
}>();

const emit = defineEmits<{
  save: [rule: SiteRule];
  cancel: [];
  pickerStateChange: [active: boolean];
}>();

// Tabs
const tabs = [
  { id: 'visual', label: '可视化' },
  { id: 'code', label: '代码' },
  { id: 'advanced', label: '高级' },
];
const activeTab = ref('visual');

// Local rule copy
const createEmptyRule = (): SiteRule => ({
  id: `user-${Date.now()}`,
  name: '',
  version: 1,
  match: {
    pattern: props.domain ? `^https?://${props.domain.replace(/\./g, '\\.')}/` : '',
    type: 'regex',
  },
  content: {
    selector: '',
  },
  meta: {
    source: 'user',
    autoLaunch: true,
  },
});

const localRule = reactive<SiteRule>(props.rule ? { ...props.rule } : createEmptyRule());

// Navigation helpers
const navPrev = computed({
  get: () => (typeof localRule.navigation?.prev === 'string' ? localRule.navigation.prev : ''),
  set: val => {
    if (!localRule.navigation) localRule.navigation = {};
    localRule.navigation.prev = val || undefined;
  },
});

const navNext = computed({
  get: () => (typeof localRule.navigation?.next === 'string' ? localRule.navigation.next : ''),
  set: val => {
    if (!localRule.navigation) localRule.navigation = {};
    localRule.navigation.next = val || undefined;
  },
});

const navIndex = computed({
  get: () => (typeof localRule.navigation?.index === 'string' ? localRule.navigation.index : ''),
  set: val => {
    if (!localRule.navigation) localRule.navigation = {};
    localRule.navigation.index = val || undefined;
  },
});

const titleSelector = computed({
  get: () => localRule.title?.selector || '',
  set: val => {
    if (!localRule.title) localRule.title = {};
    localRule.title.selector = val || undefined;
  },
});

// Processing options
const processingOptions = reactive({
  removeAds: localRule.processing?.removeAds ?? true,
  fixImages: localRule.processing?.fixImages ?? true,
  useRawContent: localRule.processing?.useRawContent ?? false,
});

// Hooks
const hookBeforeParse = ref(localRule.hooks?.beforeParse || '');
const hookAfterParse = ref(localRule.hooks?.afterParse || '');
const customCSS = ref(localRule.style?.customCSS || '');

// Code editor
const codeFormat = ref<'json' | 'yaml'>('json');
const codeContent = ref('');
const codeError = ref('');

// Picker
const pickerActive = ref(false);
const pickerMode = ref<PickerMode>('content');

// Computed
const isNew = computed(() => !props.rule);
const isValid = computed(() => {
  return localRule.match.pattern && localRule.content.selector;
});

// Methods
function startPicking(mode: PickerMode) {
  pickerMode.value = mode;
  pickerActive.value = true;
  emit('pickerStateChange', true);
}

function handlePickerSelect(result: { element: Element; selector: string }) {
  switch (pickerMode.value) {
    case 'content':
      localRule.content.selector = result.selector;
      break;
    case 'prev':
      navPrev.value = result.selector;
      break;
    case 'next':
      navNext.value = result.selector;
      break;
    case 'index':
      navIndex.value = result.selector;
      break;
    case 'title':
      titleSelector.value = result.selector;
      break;
  }
  pickerActive.value = false;
  emit('pickerStateChange', false);
}

function handlePickerCancel() {
  pickerActive.value = false;
  emit('pickerStateChange', false);
}

function updateCodeFromRule() {
  try {
    if (codeFormat.value === 'json') {
      codeContent.value = JSON.stringify(localRule, null, 2);
    } else {
      // Simple YAML conversion
      codeContent.value = jsonToYaml(localRule);
    }
    codeError.value = '';
  } catch (e) {
    codeError.value = `转换错误: ${e}`;
  }
}

function parseCode() {
  try {
    let parsed: SiteRule;
    if (codeFormat.value === 'json') {
      parsed = JSON.parse(codeContent.value);
    } else {
      parsed = yamlToJson(codeContent.value);
    }
    Object.assign(localRule, parsed);
    codeError.value = '';
  } catch (e) {
    codeError.value = `解析错误: ${e}`;
  }
}

function formatCode() {
  parseCode();
  if (!codeError.value) {
    updateCodeFromRule();
  }
}

function validateCode() {
  parseCode();
  if (!codeError.value) {
    codeError.value = '✓ 格式正确';
    setTimeout(() => {
      codeError.value = '';
    }, 2000);
  }
}

// Simple YAML helpers (basic implementation)
function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'string') return `"${obj}"`;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => `${spaces}- ${jsonToYaml(item, indent + 1)}`).join('\n');
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return '{}';
    return entries
      .map(([k, v]) => {
        const value = jsonToYaml(v, indent + 1);
        if (typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length > 0) {
          return `${spaces}${k}:\n${value}`;
        }
        return `${spaces}${k}: ${value}`;
      })
      .join('\n');
  }
  return String(obj);
}

function yamlToJson(yaml: string): SiteRule {
  // Basic YAML parsing - for production use a proper library
  // This is a simplified version that handles basic cases
  const lines = yaml.split('\n');
  const result: Record<string, unknown> = {};
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -2 }];

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const match = line.match(/^(\s*)(\w+):\s*(.*)$/);
    if (!match) continue;

    const indent = match[1].length;
    const key = match[2];
    let value: unknown = match[3].trim();

    // Parse value
    if (value === '' || value === '{}') {
      value = {};
    } else if (value === '[]') {
      value = [];
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (value === 'null') {
      value = null;
    } else if (/^-?\d+(\.\d+)?$/.test(value as string)) {
      value = Number(value);
    } else if ((value as string).startsWith('"') && (value as string).endsWith('"')) {
      value = (value as string).slice(1, -1);
    }

    // Find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].obj;
    parent[key] = value;

    if (typeof value === 'object' && value !== null) {
      stack.push({ obj: value as Record<string, unknown>, indent });
    }
  }

  return result as SiteRule;
}

function save() {
  // Apply processing options
  if (!localRule.processing) localRule.processing = {};
  localRule.processing.removeAds = processingOptions.removeAds;
  localRule.processing.fixImages = processingOptions.fixImages;
  localRule.processing.useRawContent = processingOptions.useRawContent;

  // Apply hooks
  if (hookBeforeParse.value || hookAfterParse.value) {
    if (!localRule.hooks) localRule.hooks = {};
    if (hookBeforeParse.value) localRule.hooks.beforeParse = hookBeforeParse.value;
    if (hookAfterParse.value) localRule.hooks.afterParse = hookAfterParse.value;
  }

  // Apply custom CSS
  if (customCSS.value) {
    if (!localRule.style) localRule.style = {};
    localRule.style.customCSS = customCSS.value;
  }

  // Update metadata
  if (!localRule.meta) localRule.meta = {};
  localRule.meta.source = 'user';
  localRule.meta.updated = Date.now();
  localRule.version = (localRule.version || 0) + 1;

  // Convert reactive proxy to plain object for GM_setValue compatibility
  const plainRule = JSON.parse(JSON.stringify(toRaw(localRule))) as SiteRule;
  emit('save', plainRule);
}

// Watch for tab change to sync code
watch(activeTab, tab => {
  if (tab === 'code') {
    updateCodeFromRule();
  }
});

// Watch for format change
watch(codeFormat, () => {
  updateCodeFromRule();
});
</script>

<style scoped>
.mnr-rule-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mnr-rule-editor.mnr-editor-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-100%);
}

.mnr-editor-header {
  position: relative;
  padding: 16px;
  border-bottom: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-editor-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--mnr-text, #333);
}

.mnr-shortcut-hint {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 2px 8px;
  background: var(--mnr-border, #e0e0e0);
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  color: var(--mnr-text, #666);
}

.mnr-editor-tabs {
  display: flex;
  gap: 4px;
}

.mnr-tab-btn {
  padding: 8px 16px;
  background: var(--mnr-border, #f5f5f5);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--mnr-text, #666);
}

.mnr-tab-btn.active {
  background: var(--mnr-link, #1976d2);
  color: #fff;
}

.mnr-editor-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.mnr-form-section {
  margin-bottom: 24px;
}

.mnr-section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--mnr-text, #333);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-form-group {
  margin-bottom: 16px;
}

.mnr-form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--mnr-text, #555);
}

.mnr-form-group input,
.mnr-form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
}

.mnr-form-group input:focus,
.mnr-form-group textarea:focus {
  outline: none;
  border-color: var(--mnr-link, #1976d2);
}

.mnr-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--mnr-text, #888);
  opacity: 0.7;
}

.mnr-checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
}

.mnr-checkbox-row input {
  width: 18px;
  height: 18px;
}

/* Code editor */
.mnr-code-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.mnr-format-select {
  padding: 6px 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 4px;
  font-size: 13px;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
}

.mnr-toolbar-btn {
  padding: 6px 12px;
  background: var(--mnr-border, #f5f5f5);
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--mnr-text, #333);
}

.mnr-toolbar-btn:hover {
  opacity: 0.8;
}

.mnr-code-editor {
  width: 100%;
  min-height: 400px;
  padding: 12px;
  border: 1px solid var(--mnr-border, #ddd);
  border-radius: 6px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
  background: var(--mnr-bg, #fff);
  color: var(--mnr-text, #333);
}

.mnr-code-error {
  margin-top: 8px;
  padding: 8px 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 13px;
}

/* Hook/CSS editors */
.mnr-hook-editor,
.mnr-css-editor {
  min-height: 100px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
}

/* Footer */
.mnr-editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--mnr-border, #e0e0e0);
}

.mnr-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.mnr-btn-secondary {
  background: var(--mnr-border, #f5f5f5);
  color: var(--mnr-text, #666);
}

.mnr-btn-primary {
  background: var(--mnr-link, #1976d2);
  color: #fff;
}

.mnr-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
