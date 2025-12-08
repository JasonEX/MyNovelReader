import type { AppState } from './AppState';

class AppCore {
  private static instance: AppCore;
  private state: AppState;

  private constructor() {
    this.state = this.createDefaultState();
  }

  static getInstance(): AppCore {
    if (!AppCore.instance) {
      AppCore.instance = new AppCore();
    }
    return AppCore.instance;
  }

  init(initialState: Partial<AppState> = {}): AppState {
    this.state = { ...this.createDefaultState(), ...initialState };
    return this.getState();
  }

  toggle(): boolean {
    const isEnabled = !this.state.isEnabled;
    this.state = { ...this.state, isEnabled };
    return isEnabled;
  }

  getState(): AppState {
    return { ...this.state };
  }

  setState(updates: Partial<AppState>): AppState {
    this.state = { ...this.state, ...updates };
    return this.getState();
  }

  private createDefaultState(): AppState {
    const curPageUrl =
      typeof window !== 'undefined' && typeof window.location !== 'undefined'
        ? window.location.href
        : '';

    return {
      isEnabled: false,
      parsedPages: {},
      pageNum: 1,
      paused: false,
      curPageUrl,
      requestUrl: null,
      lastRequestUrl: null,
      curFocusElement: null,
      curFocusIndex: 1,
      scrollOffsets: [],
      site: null,
      siteFontInfo: null,
      isTheEnd: false,
      activeUrl: null,
      remove: [],
      preloadNextPagePromiseResolve: null,
    };
  }
}

const appCore = AppCore.getInstance();

export { AppCore, appCore };
export default appCore;
