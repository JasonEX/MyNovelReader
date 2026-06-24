/**
 * Bootstrap - Application entry point
 *
 * Initializes the reader application:
 * 1. Setup Vue app with Pinia
 * 2. Initialize stores
 * 3. Run auto-enable detection
 * 4. Mount UI when needed
 */

import {
  type AutoEnableDecision,
  getAutoEnableManager,
  getRuleManager,
  getSiteProtection,
  type ParsedChapter,
  type ProtectionOptions,
  type SiteRule,
} from '@/core';
import { BUILD_DATE, VERSION } from '@/version';
import { createApp, defineComponent, h, ref } from 'vue';
import { getPageKind, type PageKind } from '@/core/auto-enable/PageKind';
import { type ProtectionSettings, useConfigStore, useReaderStore, useRuleStore } from '@/ui/stores';
import { createPinia } from 'pinia';
import { createShadowMount } from '@/ui/shadowMount';
import { DetectionPrompt } from '@/ui/components/detection';
import { getRuleStorage } from '@/core/rules/RuleStorage';
import { ReaderView } from '@/ui/components/reader';

/** Application state */
interface AppState {
  isInitialized: boolean;
  autoEnableDone: boolean;
  isActive: boolean;
  currentDecision: AutoEnableDecision | null;
  originalUrl: string | null; // URL when reader was opened
  entryPageKind: PageKind | null; // page kind when reader was opened
}

// Global app state
const appState: AppState = {
  isInitialized: false,
  autoEnableDone: false,
  isActive: false,
  currentDecision: null,
  originalUrl: null,
  entryPageKind: null,
};

// Vue app instance
let app: ReturnType<typeof createApp> | null = null;
let pinia: ReturnType<typeof createPinia> | null = null;
let readerCleanup: (() => void) | null = null;

function buildProtectionOptions(settings: ProtectionSettings): ProtectionOptions {
  return {
    blockRedirects: settings.blockRedirects,
    enableRightClick: settings.enableRightClick,
    enableSelection: settings.enableSelection,
    blockPopups: settings.blockPopups,
    clearTimers: true,
    unlockKeyboard: true,
    cleanupScripts: settings.mode === 'aggressive',
  };
}

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
// NOTE: clearTimers is OFF here because at document-start the DOM is not ready, so
// isCloudflareChallenge() always returns false and clearTimers would kill CF's challenge
// scripts. Timers will be cleared later when activate() is called with full options.
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
  if (!appState.isInitialized || appState.autoEnableDone) return;

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
    const ruleStore = useRuleStore(pinia);

    await Promise.all([configStore.load(), ruleStore.initialize()]);

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
  const protectionOptions = buildProtectionOptions(configStore.protection);

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
      // Show floating button instead of auto-enabling
      showFloatingButton();
      return;
    }
  }

  // First, check the decision to handle user-disabled case
  const decision = await manager.check(document);
  appState.currentDecision = decision;

  // If user previously disabled auto-enable, show floating button only
  if (decision.method === 'user-disabled' || decision.showFloatingButton) {
    showFloatingButton();
    return;
  }

  // If no auto-enable needed and no floating button, just return
  if (!decision.shouldEnable) {
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
    showFloatingButton();
  }
}

/**
 * Show detection prompt to user
 */
async function showPrompt(decision: AutoEnableDecision): Promise<{
  accepted: boolean;
  saveForDomain: boolean;
}> {
  return new Promise(resolve => {
    // Create Shadow DOM mount point for CSS isolation
    const { mountPoint, cleanup } = createShadowMount('mnr-prompt-root');

    // Track response
    const showPrompt = ref(true);

    // Create prompt component wrapper
    const PromptWrapper = defineComponent({
      setup() {
        const handleRespond = (response: { accepted: boolean; saveForDomain: boolean }) => {
          showPrompt.value = false;
          setTimeout(() => {
            cleanup();
            resolve(response);
          }, 300);
        };

        const handleDismiss = () => {
          showPrompt.value = false;
          setTimeout(() => {
            cleanup();
            resolve({ accepted: false, saveForDomain: false });
          }, 300);
        };

        return () =>
          h(DetectionPrompt, {
            decision,
            visible: showPrompt.value,
            onRespond: handleRespond,
            onDismiss: handleDismiss,
          });
      },
    });

    // Mount prompt
    const promptApp = createApp(PromptWrapper);
    promptApp.mount(mountPoint);
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

  // Save original URL before reader modifies it
  appState.originalUrl = window.location.href;
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

  // Create and mount app with ReaderView
  app = createApp(ReaderView);
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
    body > *:not(#mnr-reader-root):not(#mnr-prompt-root):not(script):not(style) {
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

  const entryPageKind = appState.entryPageKind;

  // Save site preference - user exited reader, don't auto-enable next time.
  // Only persist this on chapter pages to avoid TOC false-positives polluting the whole domain.
  if (entryPageKind === 'chapter') {
    try {
      const hostname = new URL(window.location.href).hostname;
      const storage = getRuleStorage();
      storage.setSitePreference(hostname, { enabled: false, timestamp: Date.now() });
    } catch (e) {
      console.error('[MNR] Failed to save site preference:', e);
    }
  }

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

  // Get the original page URL (saved when reader was opened)
  const originalUrl = appState.originalUrl;

  // Unmount app
  if (app) {
    app.unmount();
    app = null;
  }

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
  appState.originalUrl = null; // Clear saved URL
  appState.entryPageKind = null;

  // If current chapter URL is different from the original page URL,
  // navigate to the target URL so page content matches what user was reading
  if (targetUrl && originalUrl && targetUrl !== originalUrl) {
    // Set flag to prevent auto-enable on the new page
    sessionStorage.setItem('mnr_skip_auto_enable', Date.now().toString());
    window.location.href = targetUrl;
    return; // Don't show floating button, page will reload
  }

  // Show floating button to re-enter (chapter pages only)
  if (entryPageKind === 'chapter') {
    showFloatingButton();
  }
}

/**
 * Show floating button to re-enter reader
 */
function showFloatingButton(): void {
  // Remove existing button if any
  hideFloatingButton();

  const button = document.createElement('button');
  button.id = 'mnr-floating-btn';
  button.innerHTML = '📖';
  button.title = '进入阅读模式';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #4a90d9;
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s, background 0.2s;
  `;
  button.onmouseover = () => {
    button.style.transform = 'scale(1.1)';
    button.style.background = '#357abd';
  };
  button.onmouseout = () => {
    button.style.transform = 'scale(1)';
    button.style.background = '#4a90d9';
  };
  button.onclick = async () => {
    hideFloatingButton();
    await manualEnable();
  };
  document.body.appendChild(button);
}

/**
 * Hide floating button
 */
function hideFloatingButton(): void {
  const btn = document.getElementById('mnr-floating-btn');
  if (btn) {
    btn.remove();
  }
}

/**
 * Manual enable (for toolbar button)
 */
export async function manualEnable(): Promise<void> {
  const currentUrl = window.location.href;
  hideFloatingButton();

  await ensureInitialized();
  if (!pinia) return;

  const configStore = useConfigStore(pinia);
  const protectionOptions = buildProtectionOptions(configStore.protection);

  const manager = getAutoEnableManager({
    enableProtection: true,
    protectionOptions,
  });
  manager.setLaunchCallback(launchReader);
  await manager.manualEnable(document);
  if (!appState.isActive && (await shouldShowManualEntryForPage(currentUrl, document))) {
    showFloatingButton();
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
}

async function bootstrap(): Promise<void> {
  registerMenuCommands();

  if (!isTopFrame()) return;
  if (appState.isActive) return;

  const url = window.location.href;
  const pageKind = getPageKind(url, document);
  if (!(await shouldBootstrapForPage(url, pageKind))) return;

  // If user disabled auto-enable for this site, avoid heavy initialization and show the floating button.
  try {
    const hostname = new URL(url).hostname;
    const pref = getRuleStorage().getSitePreference(hostname);
    if (pref?.enabled === false) {
      showFloatingButton();
      return;
    }
  } catch (e) {
    console.debug('[MNR] Failed to read site preference:', e);
  }

  await initialize();
}

async function shouldBootstrapForPage(url: string, pageKind: PageKind): Promise<boolean> {
  if (pageKind === 'chapter') return true;
  if (pageKind === 'toc') return false;

  try {
    const manager = getRuleManager();
    await manager.initialize();
    return (await manager.matchRule(url)) !== null;
  } catch (e) {
    console.debug('[MNR] Failed to match bootstrap rule:', e);
    return false;
  }
}

async function shouldShowManualEntryForPage(
  url: string,
  doc: Document = document
): Promise<boolean> {
  const pageKind = getPageKind(url, doc);
  if (pageKind === 'chapter') return true;
  if (pageKind === 'toc') return false;

  try {
    const manager = getRuleManager();
    await manager.initialize();
    return (await manager.matchRule(url)) !== null;
  } catch (e) {
    console.debug('[MNR] Failed to match manual-entry rule:', e);
    return false;
  }
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
