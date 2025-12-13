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
  type ParsedChapter,
  type SiteRule,
} from '@/core';
import { createApp, defineComponent, h, ref } from 'vue';
import { useConfigStore, useReaderStore, useRuleStore } from '@/ui/stores';
import { BUILD_DATE, VERSION } from '@/version';
import { createPinia } from 'pinia';
import { createShadowMount } from '@/ui/shadowMount';
import { DetectionPrompt } from '@/ui/components/detection';
import { ReaderView } from '@/ui/components/reader';

/** Application state */
interface AppState {
  isInitialized: boolean;
  isActive: boolean;
  currentDecision: AutoEnableDecision | null;
  originalUrl: string | null; // URL when reader was opened
}

// Global app state
const appState: AppState = {
  isInitialized: false,
  isActive: false,
  currentDecision: null,
  originalUrl: null,
};

// Vue app instance
let app: ReturnType<typeof createApp> | null = null;
let pinia: ReturnType<typeof createPinia> | null = null;
let readerCleanup: (() => void) | null = null;

/**
 * Initialize the application
 */
export async function initialize(): Promise<void> {
  if (appState.isInitialized) {
    return;
  }

  console.log(`[MNR] MyNovelReader v${VERSION} (${BUILD_DATE})`);

  try {
    // Create Pinia store
    pinia = createPinia();

    // Initialize stores
    const configStore = useConfigStore(pinia);
    const ruleStore = useRuleStore(pinia);

    await Promise.all([configStore.load(), ruleStore.initialize()]);

    appState.isInitialized = true;

    // Run auto-enable check
    await runAutoEnable();
  } catch (e) {
    console.error('[MNR] Initialization error:', e);
  }
}

/**
 * Run the auto-enable flow
 */
async function runAutoEnable(): Promise<void> {
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

  const manager = getAutoEnableManager({
    enableProtection: true,
  });

  // Set up prompt callback
  manager.setPromptCallback(showPrompt);

  // Set up launch callback
  manager.setLaunchCallback(launchReader);

  // Execute the flow
  await manager.execute(document);
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

  // If current chapter URL is different from the original page URL,
  // navigate to the target URL so page content matches what user was reading
  if (targetUrl && originalUrl && targetUrl !== originalUrl) {
    // Set flag to prevent auto-enable on the new page
    sessionStorage.setItem('mnr_skip_auto_enable', Date.now().toString());
    window.location.href = targetUrl;
    return; // Don't show floating button, page will reload
  }

  // Show floating button to re-enter
  showFloatingButton();
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
  const manager = getAutoEnableManager();
  manager.setLaunchCallback(launchReader);
  await manager.manualEnable(document);
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  // DOM already ready
  initialize();
}

// Export for manual control
export { VERSION, BUILD_DATE };
