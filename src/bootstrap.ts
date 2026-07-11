/**
 * Bootstrap - Application entry point
 *
 * Initializes the reader application:
 * 1. Setup Vue app with Pinia
 * 2. Initialize stores
 * 3. Run auto-enable detection
 * 4. Mount UI when needed
 */

import { type AutoEnableDecision, getAutoEnableManager } from '@/core/AutoEnableManager';
import { type BootstrapDebugSnapshot, copyDiagnosticInfo } from '@/ui/debug/diagnostics';
import { BUILD_DATE, VERSION } from '@/version';
import {
  captureHostPageSnapshot,
  type HostPageSnapshot,
  restoreHostPageSnapshot,
} from '@/ui/stores/reader/hostPage';
import { createApp, defineComponent, h, ref } from 'vue';
import { getPageKind, getPageKindFromUrl, type PageKind } from '@/core/auto-enable/PageKind';
import { installGlobalDebugErrorListeners, recordDebugEvent } from '@/core/debug/events';
import { ReaderEntryButton, ReaderEntryPrompt } from '@/ui/components/entry';
import { redactUrl, toDebugValue } from '@/core/debug/diagnostics';
import { toProtectionOptions, useConfigStore } from '@/ui/stores/config';
import { createPinia } from 'pinia';
import { createShadowMount } from '@/ui/shadowMount';
import { getRuleManager } from '@/core/rules/RuleManager';
import { getRuleStorage } from '@/core/rules/RuleStorage';
import { getSiteProtection } from '@/core/protection';
import type { ParsedChapter } from '@/core/parser';
import { ReaderView } from '@/ui/components/reader';
import type { SiteRule } from '@/core/rules/types';
import { useReaderStore } from '@/ui/stores/reader';

/** Application state */
interface AppState {
  isInitialized: boolean;
  autoEnableDone: boolean;
  isActive: boolean;
  currentDecision: AutoEnableDecision | null;
  originalHostPage: HostPageSnapshot | null; // Host page state when reader was opened
  entryPageKind: PageKind | null; // page kind when reader was opened
}

// Global app state
const appState: AppState = {
  isInitialized: false,
  autoEnableDone: false,
  isActive: false,
  currentDecision: null,
  originalHostPage: null,
  entryPageKind: null,
};

// Vue app instance
let app: ReturnType<typeof createApp> | null = null;
let pinia: ReturnType<typeof createPinia> | null = null;
let readerCleanup: (() => void) | null = null;
let readerEntryApp: ReturnType<typeof createApp> | null = null;
let readerEntryCleanup: (() => void) | null = null;

function shouldEnableEarlyProtection(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;

    const path = u.pathname.toLowerCase();
    // Exclude common non-reading pages
    if (/(login|register|signup|search|rank|category|tag|author|help|about|contact)/.test(path)) {
      return false;
    }
    if (/(index|list|catalog|toc|contents?)\.html?$/.test(path) || /\/(catalog|toc)\//.test(path)) {
      return false;
    }

    // Common chapter-ish patterns
    if (/\/(chapter|txt|read|article)\//.test(path) && /\d/.test(path)) return true;
    if (/\/(book|novel|xiaoshuo)\//.test(path) && /\d/.test(path) && /\.html?$/.test(path)) {
      return true;
    }
    if (/\d{3,}[^/]*\.html?$/.test(path)) return true;

    return false;
  } catch {
    return false;
  }
}

// Activate minimal protection as early as possible to block mobile ad-tech redirects.
// This is intentionally conservative and will be reconfigured after settings are loaded.
// Keep this phase reversible. Irreversible cleanup belongs to explicit aggressive mode.
try {
  if (shouldEnableEarlyProtection(window.location.href)) {
    getSiteProtection().activate({
      blockRedirects: true,
      blockPopups: true,
      clearTimers: false,
      enableRightClick: false,
      enableSelection: false,
      enableCopy: false,
      unlockKeyboard: false,
      removeEventHijacking: false,
      blockVisibilityDetection: false,
      cleanupScripts: false,
    });
  }
} catch (e) {
  console.error('[MNR] Early protection error:', e);
}

/**
 * Initialize the application
 */
export async function initialize(): Promise<void> {
  await ensureInitialized();
  if (!appState.isInitialized) {
    getSiteProtection().deactivate();
    return;
  }
  if (appState.autoEnableDone) return;

  appState.autoEnableDone = true;
  await runAutoEnable();
}

async function ensureInitialized(): Promise<void> {
  if (appState.isInitialized) return;

  console.log(`[MNR] MyNovelReader v${VERSION} (${BUILD_DATE})`);

  try {
    // Create Pinia store
    pinia = createPinia();

    // Initialize stores
    const configStore = useConfigStore(pinia);

    await configStore.load();

    appState.isInitialized = true;
  } catch (e) {
    console.error('[MNR] Initialization error:', e);
  }
}

/**
 * Run the auto-enable flow
 */
async function runAutoEnable(): Promise<void> {
  const configStore = useConfigStore(pinia!);
  const protectionOptions = toProtectionOptions(configStore.protection);

  // Ensure the singleton is initialized with the current runtime options even if we skip auto-enable.
  const manager = getAutoEnableManager({
    enableProtection: true,
    protectionOptions,
  });

  // Check if we should skip auto-enable (e.g., after exiting reader and navigating to new chapter)
  const skipFlag = sessionStorage.getItem('mnr_skip_auto_enable');
  if (skipFlag) {
    // Always clear the flag
    sessionStorage.removeItem('mnr_skip_auto_enable');

    // Only skip if flag was set recently (within 5 seconds)
    const flagTime = parseInt(skipFlag, 10);
    if (!isNaN(flagTime) && Date.now() - flagTime < 5000) {
      // Keep a manual entry instead of auto-enabling.
      getSiteProtection().deactivate();
      showReaderEntry();
      return;
    }
  }

  // First, check the decision to handle user-disabled case
  const decision = await manager.check(document);
  appState.currentDecision = decision;

  // If user previously disabled auto-enable, keep only the manual entry.
  if (decision.method === 'user-disabled' || decision.showManualEntry) {
    getSiteProtection().deactivate();
    showReaderEntry();
    return;
  }

  // If no auto-enable or manual entry is needed, stop here.
  if (!decision.shouldEnable) {
    getSiteProtection().deactivate();
    return;
  }

  // Set up prompt callback
  manager.setPromptCallback(showPrompt);

  // Set up launch callback
  manager.setLaunchCallback(launchReader);

  // Execute the flow (will use cached decision)
  await manager.execute(document);

  // If an explicit/detected chapter page failed to auto-launch, keep a manual entry visible.
  if (!appState.isActive && decision.shouldEnable) {
    getSiteProtection().deactivate();
    showReaderEntry();
  }
}

/**
 * Show detection prompt to user
 */
async function showPrompt(): Promise<{
  accepted: boolean;
  rememberForSite: boolean;
}> {
  return new Promise(resolve => {
    // Create Shadow DOM mount point for CSS isolation
    const { mountPoint, cleanup } = createShadowMount('mnr-entry-prompt-root');

    // Track response
    const promptVisible = ref(true);
    let promptApp: ReturnType<typeof createApp> | null = null;
    let settled = false;

    const finish = (response: { accepted: boolean; rememberForSite: boolean }) => {
      if (settled) return;
      settled = true;
      promptVisible.value = false;
      window.setTimeout(() => {
        promptApp?.unmount();
        promptApp = null;
        cleanup();
        resolve(response);
      }, 300);
    };

    // Create prompt component wrapper
    const PromptWrapper = defineComponent({
      setup() {
        const handleRespond = (response: { accepted: boolean; rememberForSite: boolean }) => {
          finish(response);
        };

        return () =>
          h(ReaderEntryPrompt, {
            visible: promptVisible.value,
            onRespond: handleRespond,
          });
      },
    });

    try {
      promptApp = createApp(PromptWrapper);
      promptApp.mount(mountPoint);
    } catch (e) {
      settled = true;
      cleanup();
      console.error('[MNR] Failed to mount reader entry prompt:', e);
      resolve({ accepted: false, rememberForSite: false });
    }
  });
}

/**
 * Launch the reader with parsed content
 */
function launchReader(chapter: ParsedChapter, rule?: SiteRule): void {
  if (!pinia) {
    console.error('[MNR] Pinia not initialized');
    return;
  }

  hideReaderEntry();

  // Save host page state before the reader modifies title/URL.
  recordDebugEvent('bootstrap.launchReader', {
    url: chapter.url,
    title: chapter.title,
    ruleId: rule?.id || chapter.rule?.id,
  });
  appState.originalHostPage = captureHostPageSnapshot();
  const pageKind = getPageKind(window.location.href, document);
  appState.entryPageKind = pageKind === 'chapter' || rule || chapter.rule ? 'chapter' : pageKind;

  // Update reader store
  const readerStore = useReaderStore(pinia);
  readerStore.activate();
  readerStore.setChapter(chapter, rule);

  appState.isActive = true;

  // Mount reader UI
  mountReaderUI();
}

/**
 * Mount the reader UI
 */
function mountReaderUI(): void {
  // Check if already mounted
  if (document.getElementById('mnr-reader-root')) {
    return;
  }

  // Create Shadow DOM mount point for CSS isolation
  const { mountPoint, cleanup } = createShadowMount('mnr-reader-root');
  readerCleanup = cleanup;

  // Create and mount app with explicit callbacks so UI components do not import bootstrap.
  app = createApp(ReaderView, {
    siteAutoEnable: getCurrentSiteAutoEnable(),
    onCopyDiagnostics: () => {
      void copyDiagnosticsFromMenu();
    },
    onExit: closeReader,
    onProtectionModeChange: setProtectionMode,
    onSiteAutoEnableChange: setCurrentSiteAutoEnable,
  });
  app.use(pinia!);
  app.mount(mountPoint);

  // Hide original page content
  hideOriginalContent();
}

/**
 * Hide the original page content
 */
function hideOriginalContent(): void {
  const style = document.createElement('style');
  style.id = 'mnr-hide-original';
  style.textContent = `
    body > *:not(#mnr-reader-root):not(#mnr-entry-prompt-root):not(script):not(style) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Close the reader and restore original page
 */
export function closeReader(): void {
  if (!appState.isActive) return;

  recordDebugEvent('bootstrap.closeReader');
  const entryPageKind = appState.entryPageKind;

  // Get current chapter URL before closing
  let targetUrl: string | null = null;

  if (pinia) {
    const readerStore = useReaderStore(pinia);
    const currentIndex = readerStore.currentChapterIndex;
    const chapter = readerStore.chapters[currentIndex];

    if (chapter?.chapter.url) {
      targetUrl = chapter.chapter.url;
    }
  }

  // Get the original page state (saved when reader was opened)
  const originalHostPage = appState.originalHostPage;
  const originalUrl = originalHostPage?.url || null;

  // Unmount app
  if (app) {
    app.unmount();
    app = null;
  }

  getSiteProtection().deactivate();

  // Cleanup Shadow DOM
  if (readerCleanup) {
    readerCleanup();
    readerCleanup = null;
  }

  // Restore original content
  const hideStyle = document.getElementById('mnr-hide-original');
  if (hideStyle) {
    hideStyle.remove();
  }

  // Update state
  if (pinia) {
    const readerStore = useReaderStore(pinia);
    readerStore.deactivate();
  }

  appState.isActive = false;
  appState.originalHostPage = null; // Clear saved host page state
  appState.entryPageKind = null;

  // If current chapter URL is different from the original page URL,
  // navigate to the target URL so page content matches what user was reading
  if (targetUrl && originalUrl && targetUrl !== originalUrl) {
    // Set flag to prevent auto-enable on the new page
    sessionStorage.setItem('mnr_skip_auto_enable', Date.now().toString());
    window.location.href = targetUrl;
    return; // The next page load will decide whether to show the manual entry.
  }

  restoreHostPageSnapshot(originalHostPage);

  // Keep a manual re-entry on chapter pages.
  if (entryPageKind === 'chapter') {
    showReaderEntry();
  }
}

function getCurrentSiteAutoEnable(): boolean {
  try {
    const hostname = new URL(window.location.href).hostname;
    return getRuleStorage().getSitePreference(hostname)?.enabled !== false;
  } catch {
    return true;
  }
}

function setCurrentSiteAutoEnable(enabled: boolean): void {
  try {
    const hostname = new URL(window.location.href).hostname;
    getRuleStorage().setSitePreference(hostname, { enabled, timestamp: Date.now() });
  } catch (e) {
    console.error('[MNR] Failed to update site auto-enable preference:', e);
  }
}

async function setProtectionMode(mode: 'standard' | 'aggressive'): Promise<void> {
  if (!pinia) return;
  const configStore = useConfigStore(pinia);
  configStore.updateProtection({ mode });
  await configStore.flushSave();
  getSiteProtection().activate(toProtectionOptions(configStore.protection));
}

/** Show the isolated manual entry without initializing reader state. */
function showReaderEntry(): void {
  if (appState.isActive || readerEntryApp) return;

  const { mountPoint, cleanup } = createShadowMount('mnr-entry-root');
  readerEntryCleanup = cleanup;

  try {
    readerEntryApp = createApp(ReaderEntryButton, {
      onEnter: () => {
        manualEnable().catch(e => console.error('[MNR] Manual enable error:', e));
      },
    });
    readerEntryApp.mount(mountPoint);
  } catch (e) {
    readerEntryApp = null;
    readerEntryCleanup = null;
    cleanup();
    console.error('[MNR] Failed to mount reader entry:', e);
  }
}

/** Remove the manual entry and release its Shadow DOM registration. */
function hideReaderEntry(): void {
  readerEntryApp?.unmount();
  readerEntryApp = null;
  readerEntryCleanup?.();
  readerEntryCleanup = null;
}

/**
 * Manually enter reading mode.
 */
export async function manualEnable(): Promise<void> {
  const currentUrl = window.location.href;
  recordDebugEvent('bootstrap.manualEnable', { url: currentUrl });
  hideReaderEntry();

  try {
    await ensureInitialized();
    if (!pinia) return;

    const configStore = useConfigStore(pinia);
    const protectionOptions = toProtectionOptions(configStore.protection);

    const manager = getAutoEnableManager({
      enableProtection: true,
      protectionOptions,
    });
    manager.setLaunchCallback(launchReader);
    await manager.manualEnable(document);
  } finally {
    if (!appState.isActive && (await shouldShowManualEntryForPage(currentUrl, document))) {
      showReaderEntry();
    }
  }
}

/**
 * Check if reader is active
 */
export function isActive(): boolean {
  return appState.isActive;
}

/**
 * Get version info
 */
export function getVersion(): { version: string; buildDate: string } {
  return { version: VERSION, buildDate: BUILD_DATE };
}

export function getAppDebugSnapshot(): BootstrapDebugSnapshot {
  const decision = appState.currentDecision;

  return {
    isInitialized: appState.isInitialized,
    autoEnableDone: appState.autoEnableDone,
    isActive: appState.isActive,
    entryPageKind: appState.entryPageKind,
    currentDecision: decision
      ? toDebugValue({
          shouldEnable: decision.shouldEnable,
          method: decision.method,
          confidence: decision.confidence,
          reasons: decision.reasons,
          showManualEntry: decision.showManualEntry,
          ruleId: decision.rule?.id,
        })
      : null,
    originalHostPage: appState.originalHostPage
      ? toDebugValue({
          url: redactUrl(appState.originalHostPage.url),
          title: appState.originalHostPage.title,
          state: appState.originalHostPage.state,
        })
      : null,
  };
}

// Auto-initialize when DOM is ready
function isTopFrame(): boolean {
  try {
    return window.top === window.self;
  } catch {
    return false;
  }
}

function registerMenuCommands(): void {
  if (!isTopFrame()) return;
  if (typeof GM_registerMenuCommand !== 'function') return;

  GM_registerMenuCommand('进入阅读模式', () => {
    manualEnable().catch(e => console.error('[MNR] Manual enable error:', e));
  });

  GM_registerMenuCommand('复制诊断信息', () => {
    copyDiagnosticsFromMenu().catch(e => console.error('[MNR] Copy diagnostics error:', e));
  });
}

async function copyDiagnosticsFromMenu(): Promise<void> {
  await ensureInitialized();

  const readerStore = pinia ? useReaderStore(pinia) : null;
  const configStore = pinia ? useConfigStore(pinia) : null;
  const notify =
    readerStore?.isActive === true
      ? (message: string, type: 'info' | 'error' = 'info') => readerStore.showToast(message, type)
      : undefined;

  const result = await copyDiagnosticInfo({
    readerStore,
    configStore,
    bootstrap: getAppDebugSnapshot(),
    notify,
  });

  if (notify) return;
  if (result.ok) {
    console.info('[MNR] 诊断信息已复制');
  } else {
    console.error('[MNR] 诊断信息复制失败:', result.error);
  }
}

async function bootstrap(): Promise<void> {
  registerMenuCommands();

  if (!isTopFrame()) return;
  installGlobalDebugErrorListeners();
  if (appState.isActive) return;

  const url = window.location.href;
  if (!(await shouldBootstrapForPage(url, document))) {
    getSiteProtection().deactivate();
    return;
  }

  // If auto-enable is disabled, avoid store initialization and keep a lightweight manual entry.
  try {
    const hostname = new URL(url).hostname;
    const pref = getRuleStorage().getSitePreference(hostname);
    if (pref?.enabled === false) {
      getSiteProtection().deactivate();
      showReaderEntry();
      return;
    }
  } catch (e) {
    console.debug('[MNR] Failed to read site preference:', e);
  }

  await initialize();
}

async function shouldBootstrapForPage(url: string, doc: Document): Promise<boolean> {
  const urlKind = getPageKindFromUrl(url);
  if (urlKind === 'chapter') return true;
  if (urlKind === 'toc') return false;

  try {
    const manager = getRuleManager();
    await manager.initialize();
    if ((await manager.matchRule(url)) !== null) return true;
  } catch (e) {
    console.debug('[MNR] Failed to match bootstrap rule:', e);
  }

  return getPageKind(url, doc) === 'chapter';
}

async function shouldShowManualEntryForPage(
  url: string,
  doc: Document = document
): Promise<boolean> {
  const urlKind = getPageKindFromUrl(url);
  if (urlKind === 'chapter') return true;
  if (urlKind === 'toc') return false;

  try {
    const manager = getRuleManager();
    await manager.initialize();
    if ((await manager.matchRule(url)) !== null) return true;
  } catch (e) {
    console.debug('[MNR] Failed to match manual-entry rule:', e);
  }

  return getPageKind(url, doc) === 'chapter';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(e => console.error('[MNR] Bootstrap error:', e));
  });
} else {
  bootstrap().catch(e => console.error('[MNR] Bootstrap error:', e));
}

// Export for manual control
export { VERSION, BUILD_DATE };
