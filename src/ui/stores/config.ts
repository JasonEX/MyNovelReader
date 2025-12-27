/**
 * Config Store - Manages user settings
 */

import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

/** Theme definition */
export interface Theme {
  id: string;
  name: string;
  background: string;
  text: string;
  link: string;
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
  /** Auto scroll to last position */
  autoScrollToPosition: boolean;
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
export type ProtectionMode = 'standard' | 'aggressive';

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
    id: 'light',
    name: '默认',
    background: '#ffffff',
    text: '#1a1a1a',
    link: '#0066cc',
    border: '#e5e5e5',
  },
  {
    id: 'dark',
    name: '深色',
    background: '#1e1e1e',
    text: '#d4d4d4',
    link: '#4fc1ff',
    border: '#3c3c3c',
  },
  {
    id: 'sepia',
    name: '护眼',
    background: '#f8f1e3',
    text: '#4a4137',
    link: '#8b5a2b',
    border: '#e8dcc8',
  },
  {
    id: 'green',
    name: '绿色',
    background: '#e8f5e9',
    text: '#1b5e20',
    link: '#2e7d32',
    border: '#c8e6c9',
  },
  {
    id: 'blue',
    name: '蓝色',
    background: '#e3f2fd',
    text: '#0d47a1',
    link: '#1565c0',
    border: '#bbdefb',
  },
  {
    id: 'night',
    name: '夜间',
    background: '#0d0d0d',
    text: '#a0a0a0',
    link: '#5dade2',
    border: '#2a2a2a',
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
  autoScrollToPosition: true,
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

// Storage key
const STORAGE_KEY = 'mnr-config';
const STORAGE_BACKUP_KEY = `${STORAGE_KEY}-backup`;

export const useConfigStore = defineStore('config', () => {
  // State
  const themeId = ref('light');
  const reading = ref<ReadingSettings>({ ...DEFAULT_READING });
  const behavior = ref<BehaviorSettings>({ ...DEFAULT_BEHAVIOR });
  const protection = ref<ProtectionSettings>({ ...DEFAULT_PROTECTION });
  const customCSS = ref('');

  // Computed
  const theme = (): Theme => {
    return THEMES.find(t => t.id === themeId.value) || THEMES[0];
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
    const root = document.documentElement;
    root.style.setProperty('--mnr-bg', t.background);
    root.style.setProperty('--mnr-text', t.text);
    root.style.setProperty('--mnr-link', t.link);
    root.style.setProperty('--mnr-border', t.border);
  }

  function applyReading() {
    const r = reading.value;
    const root = document.documentElement;
    root.style.setProperty('--mnr-font-family', r.fontFamily);
    root.style.setProperty('--mnr-font-size', `${r.fontSize}px`);
    root.style.setProperty('--mnr-line-height', `${r.lineHeight}`);
    root.style.setProperty('--mnr-letter-spacing', `${r.letterSpacing}em`);
    root.style.setProperty('--mnr-paragraph-indent', `${r.paragraphIndent}em`);
    root.style.setProperty('--mnr-max-width', `${r.maxWidth}px`);
    root.style.setProperty('--mnr-padding', `${r.padding}px`);
  }

  function applyCustomCSS() {
    let styleEl = document.getElementById('mnr-custom-css');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'mnr-custom-css';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = customCSS.value;
  }

  function applyAll() {
    applyTheme();
    applyReading();
    applyCustomCSS();
  }

  function safeToString(value: unknown): string {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  async function backupCorruptedConfig(original: unknown): Promise<void> {
    if (original === null || original === undefined) return;
    try {
      const payload = JSON.stringify({
        savedAt: new Date().toISOString(),
        type: typeof original,
        value: safeToString(original),
      });

      if (typeof GM_setValue !== 'undefined') {
        await GM_setValue(STORAGE_BACKUP_KEY, payload);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_BACKUP_KEY, payload);
      }
    } catch (e) {
      console.error('[ConfigStore] Backup error:', e);
    }
  }

  // Persistence
  async function load() {
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
        console.warn(
          '[ConfigStore] Corrupted config detected; backing up and resetting to defaults'
        );
        await backupCorruptedConfig(data);
        await save();
      }
    } catch (e) {
      console.error('[ConfigStore] Load error:', e);
    }
  }

  async function save() {
    try {
      const data = JSON.stringify({
        themeId: themeId.value,
        reading: reading.value,
        behavior: behavior.value,
        protection: protection.value,
        customCSS: customCSS.value,
      });

      if (typeof GM_setValue !== 'undefined') {
        await GM_setValue(STORAGE_KEY, data);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, data);
      }
    } catch (e) {
      console.error('[ConfigStore] Save error:', e);
    }
  }

  // Auto-save on changes
  watch(
    [themeId, reading, behavior, protection, customCSS],
    () => {
      save();
    },
    { deep: true }
  );

  function $reset() {
    themeId.value = 'light';
    reading.value = { ...DEFAULT_READING };
    behavior.value = { ...DEFAULT_BEHAVIOR };
    protection.value = { ...DEFAULT_PROTECTION };
    customCSS.value = '';
    applyAll();
    save();
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
    $reset,
  };
});
