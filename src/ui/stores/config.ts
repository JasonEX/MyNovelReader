/**
 * Config Store - Manages user settings
 */

import { ref, watch } from 'vue';
import { setShadowCustomCSS, setShadowStyleProperties } from '@/ui/shadowMount';
import { defineStore } from 'pinia';
import type { ProtectionOptions } from '@/core/protection';

/** Theme definition */
export interface Theme {
  id: string;
  name: string;
  background: string;
  text: string;
  link: string;
  onLink: string;
  border: string;
}

/** Reading settings */
export interface ReadingSettings {
  /** Font family */
  fontFamily: string;
  /** Font size (px) */
  fontSize: number;
  /** Line height (em) */
  lineHeight: number;
  /** Letter spacing (em) */
  letterSpacing: number;
  /** Paragraph indent (em) */
  paragraphIndent: number;
  /** Content max width (px) */
  maxWidth: number;
  /** Content padding (px) */
  padding: number;
  /** Text conversion mode: 'none' | 'sc' (simplified) | 'tc' (traditional) */
  textConversion: 'none' | 'sc' | 'tc';
}

/** Behavior settings */
export interface BehaviorSettings {
  /** Enable keyboard navigation */
  keyboardNavigation: boolean;
  /** Enable swipe gestures */
  swipeGestures: boolean;
  /** Auto hide header on scroll */
  autoHideHeader: boolean;
  /** Preload next chapter */
  preloadNext: boolean;
  /** Show progress indicator */
  showProgress: boolean;
}

/** Protection settings */
type ProtectionMode = 'standard' | 'aggressive';

export interface ProtectionSettings {
  /** Protection mode */
  mode: ProtectionMode;
  /** Block redirects */
  blockRedirects: boolean;
  /** Enable right-click */
  enableRightClick: boolean;
  /** Enable text selection */
  enableSelection: boolean;
  /** Block popups */
  blockPopups: boolean;
}

// Default themes - improved for better readability
export const THEMES: Theme[] = [
  {
    id: 'system',
    name: '跟随系统',
    background: '#f5f5f5',
    text: '#242424',
    link: '#2563a8',
    onLink: '#ffffff',
    border: '#d8d8d8',
  },
  {
    id: 'light',
    name: '默认',
    background: '#ffffff',
    text: '#1a1a1a',
    link: '#0066cc',
    onLink: '#ffffff',
    border: '#e5e5e5',
  },
  {
    id: 'dark',
    name: '深色',
    background: '#1e1e1e',
    text: '#c8c8c8',
    link: '#78bdf2',
    onLink: '#111111',
    border: '#3a3a3a',
  },
  {
    id: 'sepia',
    name: '护眼',
    background: '#f8f1e3',
    text: '#4a4137',
    link: '#7a4f26',
    onLink: '#ffffff',
    border: '#e8dcc8',
  },
  {
    id: 'green',
    name: '绿色',
    background: '#edf6ed',
    text: '#243429',
    link: '#2f6f3d',
    onLink: '#ffffff',
    border: '#c9ddc9',
  },
  {
    id: 'blue',
    name: '蓝色',
    background: '#eaf3fb',
    text: '#263746',
    link: '#2563a8',
    onLink: '#ffffff',
    border: '#c7d8e8',
  },
  {
    id: 'night',
    name: '夜间',
    background: '#0d0d0d',
    text: '#a0a0a0',
    link: '#5dade2',
    onLink: '#0b0b0b',
    border: '#303030',
  },
];

// Default settings
const DEFAULT_READING: ReadingSettings = {
  fontFamily: 'system-ui, -apple-system, "Microsoft YaHei", sans-serif',
  fontSize: 18,
  lineHeight: 1.8,
  letterSpacing: 0.05,
  paragraphIndent: 2,
  maxWidth: 800,
  padding: 20,
  textConversion: 'none',
};

const DEFAULT_BEHAVIOR: BehaviorSettings = {
  keyboardNavigation: true,
  swipeGestures: true,
  autoHideHeader: true,
  preloadNext: true,
  showProgress: true,
};

const DEFAULT_PROTECTION: ProtectionSettings = {
  mode: 'standard',
  blockRedirects: true,
  enableRightClick: true,
  enableSelection: true,
  blockPopups: true,
};

export function toProtectionOptions(settings: ProtectionSettings): ProtectionOptions {
  const aggressive = settings.mode === 'aggressive';

  return {
    blockRedirects: settings.blockRedirects,
    enableRightClick: settings.enableRightClick,
    enableSelection: settings.enableSelection,
    blockPopups: settings.blockPopups,
    clearTimers: aggressive,
    unlockKeyboard: true,
    cleanupScripts: aggressive,
  };
}

// Storage key
const STORAGE_KEY = 'mnr-config';
const SAVE_DEBOUNCE_MS = 300;

export const useConfigStore = defineStore('config', () => {
  // State
  const themeId = ref('system');
  const reading = ref<ReadingSettings>({ ...DEFAULT_READING });
  const behavior = ref<BehaviorSettings>({ ...DEFAULT_BEHAVIOR });
  const protection = ref<ProtectionSettings>({ ...DEFAULT_PROTECTION });
  const customCSS = ref('');
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  let savePending = false;
  let saveQueue = Promise.resolve();
  let isHydrating = false;

  // Computed
  const theme = (): Theme => {
    if (themeId.value === 'system') {
      const prefersDark =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      return THEMES.find(t => t.id === (prefersDark ? 'dark' : 'light')) || THEMES[1];
    }
    return THEMES.find(t => t.id === themeId.value) || THEMES[1];
  };

  // Actions
  function setTheme(id: string) {
    if (THEMES.some(t => t.id === id)) {
      themeId.value = id;
      applyTheme();
    }
  }

  function updateReading(settings: Partial<ReadingSettings>) {
    reading.value = { ...reading.value, ...settings };
  }

  function updateBehavior(settings: Partial<BehaviorSettings>) {
    behavior.value = { ...behavior.value, ...settings };
  }

  function updateProtection(settings: Partial<ProtectionSettings>) {
    protection.value = { ...protection.value, ...settings };
  }

  function setCustomCSS(css: string) {
    customCSS.value = css;
    applyCustomCSS();
  }

  function applyTheme() {
    const t = theme();
    setShadowStyleProperties({
      '--mnr-bg': t.background,
      '--mnr-text': t.text,
      '--mnr-link': t.link,
      '--mnr-on-link': t.onLink,
      '--mnr-border': t.border,
    });
  }

  function applyReading() {
    const r = reading.value;
    setShadowStyleProperties({
      '--mnr-font-family': r.fontFamily,
      '--mnr-font-size': `${r.fontSize}px`,
      '--mnr-line-height': `${r.lineHeight}`,
      '--mnr-letter-spacing': `${r.letterSpacing}em`,
      '--mnr-paragraph-indent': `${r.paragraphIndent}em`,
      '--mnr-max-width': `${r.maxWidth}px`,
      '--mnr-padding': `${r.padding}px`,
    });
  }

  function applyCustomCSS() {
    setShadowCustomCSS(customCSS.value);
  }

  function applyAll() {
    applyTheme();
    applyReading();
    applyCustomCSS();
  }

  // Persistence
  async function load() {
    isHydrating = true;
    try {
      let data: unknown = null;
      let hasInvalidData = false;

      // Try GM_getValue first
      if (typeof GM_getValue !== 'undefined') {
        data = await GM_getValue<unknown>(STORAGE_KEY, null);
      } else if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        data = stored;
      }

      if (data) {
        let parsed: unknown;
        if (typeof data === 'string') {
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            console.error('[ConfigStore] Failed to parse config JSON:', e);
            hasInvalidData = true;
            parsed = null;
          }
        } else {
          parsed = data;
        }

        // Validate parsed data is an object
        if (!hasInvalidData && (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))) {
          console.warn('[ConfigStore] Invalid config data, expected object');
          hasInvalidData = true;
        }

        if (!hasInvalidData) {
          const config = parsed as Record<string, unknown>;

          // Validate and apply each field with type checking
          if (typeof config.themeId === 'string') {
            themeId.value = config.themeId;
          }
          if (config.reading && typeof config.reading === 'object') {
            reading.value = {
              ...DEFAULT_READING,
              ...(config.reading as Partial<typeof DEFAULT_READING>),
            };
          }
          if (config.behavior && typeof config.behavior === 'object') {
            behavior.value = {
              ...DEFAULT_BEHAVIOR,
              ...(config.behavior as Partial<typeof DEFAULT_BEHAVIOR>),
            };
          }
          if (config.protection && typeof config.protection === 'object') {
            protection.value = {
              ...DEFAULT_PROTECTION,
              ...(config.protection as Partial<typeof DEFAULT_PROTECTION>),
            };
          }
          if (typeof config.customCSS === 'string') {
            customCSS.value = config.customCSS;
          }
        }
      }

      applyAll();

      // Repair corrupted data so users aren't stuck with repeated parse failures.
      if (hasInvalidData) {
        console.warn('[ConfigStore] Corrupted config detected; resetting to defaults');
        await save();
      }
    } catch (e) {
      console.error('[ConfigStore] Load error:', e);
    } finally {
      isHydrating = false;
    }
  }

  function serialize(): string {
    return JSON.stringify({
      themeId: themeId.value,
      reading: reading.value,
      behavior: behavior.value,
      protection: protection.value,
      customCSS: customCSS.value,
    });
  }

  function save(): Promise<void> {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    savePending = false;
    const data = serialize();

    saveQueue = saveQueue
      .then(async () => {
        if (typeof GM_setValue !== 'undefined') {
          await GM_setValue(STORAGE_KEY, data);
        } else if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, data);
        }
      })
      .catch(e => console.error('[ConfigStore] Save error:', e));

    return saveQueue;
  }

  function scheduleSave(): void {
    savePending = true;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      void save();
    }, SAVE_DEBOUNCE_MS);
  }

  function flushSave(): Promise<void> {
    return savePending ? save() : saveQueue;
  }

  // Auto-save on changes
  watch(
    [themeId, reading, behavior, protection, customCSS],
    () => {
      if (!isHydrating) scheduleSave();
    },
    { deep: true, flush: 'sync' }
  );

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.addEventListener?.('change', () => {
      if (themeId.value === 'system') applyTheme();
    });
  }

  function $reset() {
    themeId.value = 'system';
    reading.value = { ...DEFAULT_READING };
    behavior.value = { ...DEFAULT_BEHAVIOR };
    protection.value = { ...DEFAULT_PROTECTION };
    customCSS.value = '';
    applyAll();
    void save();
  }

  return {
    // State
    themeId,
    reading,
    behavior,
    protection,
    customCSS,

    // Getters
    theme,

    // Actions
    setTheme,
    updateReading,
    updateBehavior,
    updateProtection,
    setCustomCSS,
    applyTheme,
    applyReading,
    applyAll,
    load,
    save,
    flushSave,
    $reset,
  };
});
