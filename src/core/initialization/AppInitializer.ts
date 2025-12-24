/**
 * Application Initializer
 *
 * Centralizes application initialization logic for better maintainability.
 * Replaces scattered initialization code in bootstrap.ts
 *
 * @module AppInitializer
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import type { AutoEnableDecision } from '@/core/AutoEnableManager';
import { getAutoEnableManager } from '@/core/AutoEnableManager';
import { getRuleManager } from '@/core/rules/RuleManager';
import { getSiteProtection } from '@/core/protection/SiteProtection';
import ReaderUI from '@/ui/components/ReaderUI.vue';
import { useConfigStore } from '@/ui/stores/config';

/**
 * Application state
 */
export interface AppState {
  isInitialized: boolean;
  isActive: boolean;
  currentDecision: AutoEnableDecision | null;
  originalUrl: string;
}

/**
 * Initialization options
 */
export interface InitializationOptions {
  /** Enable auto-launch (default: true) */
  autoLaunch?: boolean;
  /** Enable early protection (default: true) */
  enableProtection?: boolean;
  /** Custom protection options */
  protectionOptions?: Record<string, boolean>;
}

/**
 * Application Initializer
 *
 * Manages the complete application lifecycle:
 * 1. Early protection setup
 * 2. Component initialization
 * 3. UI mounting
 * 4. Auto-enable execution
 */
export class AppInitializer {
  private state: AppState = {
    isInitialized: false,
    isActive: false,
    currentDecision: null,
    originalUrl: window.location.href,
  };

  private pinia = createPinia();
  private options: Required<InitializationOptions>;

  constructor(options: InitializationOptions = {}) {
    this.options = {
      autoLaunch: options.autoLaunch ?? true,
      enableProtection: options.enableProtection ?? true,
      protectionOptions: options.protectionOptions ?? {},
    };
  }

  /**
   * Get current application state
   */
  getState(): Readonly<AppState> {
    return { ...this.state };
  }

  /**
   * Initialize the application
   *
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.state.isInitialized) {
      console.warn('[AppInitializer] Already initialized');
      return;
    }

    try {
      // Step 1: Setup early protection (before page fully loads)
      if (this.options.enableProtection) {
        await this.setupEarlyProtection();
      }

      // Step 2: Wait for DOM to be ready
      await this.waitForDOM();

      // Step 3: Initialize Pinia stores
      await this.initializeStores();

      // Step 4: Initialize components
      await this.initializeComponents();

      // Step 5: Setup UI mounting point
      await this.setupUIMountPoint();

      // Step 6: Run auto-enable if configured
      if (this.options.autoLaunch) {
        await this.runAutoEnable();
      }

      this.state.isInitialized = true;
      console.log('[AppInitializer] Initialization complete');
    } catch (error) {
      console.error('[AppInitializer] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup early protection before page loads
   *
   * This runs as early as possible to block malicious scripts
   */
  private async setupEarlyProtection(): Promise<void> {
    try {
      // Check if we should enable protection for this URL
      if (!this.shouldEnableEarlyProtection()) {
        return;
      }

      const protection = getSiteProtection();

      // Build protection options
      const options = this.buildProtectionOptions();

      // Activate protection immediately
      protection.activate(options);

      console.log('[AppInitializer] Early protection activated');
    } catch (error) {
      console.error('[AppInitializer] Failed to setup early protection:', error);
    }
  }

  /**
   * Check if early protection should be enabled
   */
  private shouldEnableEarlyProtection(): boolean {
    const url = window.location.href;

    // Skip on certain pages
    const skipPatterns = [/google\.com/, /bing\.com/, /baidu\.com/, /about:blank/];

    return !skipPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Build protection options
   */
  private buildProtectionOptions(): Record<string, boolean> {
    return {
      blockPopups: true,
      blockRedirects: true,
      cleanupScripts: true,
      clearTimers: true,
      enableRightClick: true,
      enableSelection: true,
      unlockKeyboard: true,
      ...this.options.protectionOptions,
    };
  }

  /**
   * Wait for DOM to be ready
   */
  private async waitForDOM(): Promise<void> {
    return new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialize Pinia stores
   */
  private async initializeStores(): Promise<void> {
    try {
      // Initialize config store to load user preferences
      const configStore = useConfigStore(this.pinia);
      await configStore.loadFromStorage();

      console.log('[AppInitializer] Stores initialized');
    } catch (error) {
      console.error('[AppInitializer] Failed to initialize stores:', error);
      throw error;
    }
  }

  /**
   * Initialize application components
   */
  private async initializeComponents(): Promise<void> {
    try {
      // Initialize rule manager
      const ruleManager = getRuleManager();
      await ruleManager.initialize();

      console.log('[AppInitializer] Components initialized');
    } catch (error) {
      console.error('[AppInitializer] Failed to initialize components:', error);
      throw error;
    }
  }

  /**
   * Setup UI mounting point
   */
  private async setupUIMountPoint(): Promise<void> {
    const mountPointId = 'mnr-reader-root';
    let mountPoint = document.getElementById(mountPointId);

    if (!mountPoint) {
      mountPoint = document.createElement('div');
      mountPoint.id = mountPointId;
      document.body.appendChild(mountPoint);
    }

    // Create Vue app but don't mount it yet
    const vueApp = createApp(ReaderUI);
    vueApp.use(this.pinia);

    // Store app instance for later mounting
    window.MNR_VUE_APP = vueApp;
    window.MNR_MOUNT_POINT = mountPointId;

    console.log('[AppInitializer] UI mount point ready');
  }

  /**
   * Run auto-enable detection
   */
  private async runAutoEnable(): Promise<void> {
    try {
      const manager = getAutoEnableManager();

      // Set up launch callback
      manager.setLaunchCallback(decision => {
        this.onAutoEnableComplete(decision);
      });

      // Execute auto-enable
      await manager.execute();

      this.state.currentDecision = manager.currentDecision;

      console.log('[AppInitializer] Auto-enable complete');
    } catch (error) {
      console.error('[AppInitializer] Auto-enable failed:', error);
    }
  }

  /**
   * Handle auto-enable completion
   */
  private onAutoEnableComplete(decision: AutoEnableDecision): void {
    this.state.currentDecision = decision;

    if (decision.shouldEnable) {
      this.launchReader();
    } else if (decision.showFloatingButton) {
      this.showFloatingButton();
    }
  }

  /**
   * Launch the reader UI
   */
  private launchReader(): void {
    try {
      const vueApp = window.MNR_VUE_APP;
      const mountPointId = window.MNR_MOUNT_POINT;

      if (!vueApp || !mountPointId) {
        throw new Error('Vue app or mount point not found');
      }

      const mountPoint = document.getElementById(mountPointId);
      if (!mountPoint) {
        throw new Error('Mount point element not found');
      }

      // Mount the Vue app
      vueApp.mount(mountPoint);

      // Hide original content
      this.hideOriginalContent();

      this.state.isActive = true;
      console.log('[AppInitializer] Reader launched');
    } catch (error) {
      console.error('[AppInitializer] Failed to launch reader:', error);
    }
  }

  /**
   * Show floating button for manual activation
   */
  private showFloatingButton(): void {
    // Create floating button
    const button = document.createElement('div');
    button.id = 'mnr-floating-button';
    button.textContent = '阅读模式';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;

    button.addEventListener('click', () => {
      this.manualEnable();
    });

    document.body.appendChild(button);
    console.log('[AppInitializer] Floating button shown');
  }

  /**
   * Hide original page content
   */
  private hideOriginalContent(): void {
    const style = document.createElement('style');
    style.textContent = `
      body > *:not(#mnr-reader-root):not(#mnr-prompt-root):not(script):not(style) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Manually enable the reader
   */
  async manualEnable(): Promise<void> {
    try {
      const manager = getAutoEnableManager();
      await manager.manualEnable();
      this.launchReader();
    } catch (error) {
      console.error('[AppInitializer] Manual enable failed:', error);
    }
  }

  /**
   * Close the reader
   */
  closeReader(): void {
    try {
      const vueApp = window.MNR_VUE_APP;
      if (vueApp) {
        vueApp.unmount();
      }

      // Remove mount point
      const mountPoint = document.getElementById('mnr-reader-root');
      if (mountPoint) {
        mountPoint.remove();
      }

      // Show original content
      const style = document.querySelector('style[data-mnr-hide-original]');
      if (style) {
        style.remove();
      }

      this.state.isActive = false;
      console.log('[AppInitializer] Reader closed');
    } catch (error) {
      console.error('[AppInitializer] Failed to close reader:', error);
    }
  }

  /**
   * Reset the application state
   */
  reset(): void {
    this.closeReader();

    this.state = {
      isInitialized: false,
      isActive: false,
      currentDecision: null,
      originalUrl: window.location.href,
    };

    // Clear global references
    delete window.MNR_VUE_APP;
    delete window.MNR_MOUNT_POINT;

    console.log('[AppInitializer] Application reset');
  }
}

/**
 * Global application initializer instance
 */
let appInitializer: AppInitializer | null = null;

/**
 * Get the global AppInitializer instance
 *
 * @param options - Initialization options (only used on first call)
 * @returns AppInitializer instance
 */
export function getAppInitializer(options?: InitializationOptions): AppInitializer {
  if (!appInitializer) {
    appInitializer = new AppInitializer(options);
  }
  return appInitializer;
}

/**
 * Initialize the application with default options
 *
 * @param options - Optional initialization options
 * @returns Promise that resolves when initialization is complete
 */
export async function initializeApp(options?: InitializationOptions): Promise<void> {
  const initializer = getAppInitializer(options);
  return initializer.initialize();
}
