import { getActivePinia } from 'pinia';
import { type ReaderState, useReaderStore } from './stores/readerStore';

// 共享 App 引用，用于解决循环依赖
export interface IApp {
  // 状态属性
  isEnabled?: boolean;
  parsedPages?: Record<string, boolean>;
  pageNum?: number;
  paused?: boolean;
  curPageUrl?: string | null;
  requestUrl?: string | null;
  lastRequestUrl?: string | null;
  curFocusElement?: HTMLElement | null;
  curFocusIndex?: number;
  scrollOffsets?: number[];
  site?: { useSiteFont?: boolean } | null;
  siteFontInfo?: { siteFontFamily?: string } | null;
  isTheEnd?: boolean | 'vip';
  activeUrl?: string | null;
  indexUrl?: string | null;
  prevUrl?: string | null;
  oArticles?: string[];

  // 方法
  toggle?: () => Promise<void> | void;
  openUrl?: (url?: string | null) => void;
  resetCache?: () => void;
  saveAsTxt?: () => Promise<void> | void;
  scrollForce?: () => Promise<void> | void;
  scrollToArticle?: (elem: unknown) => void;
  scrollItems?: { toArray?: () => unknown[]; get?: (_index: number) => unknown };
}

let _app: IApp | null = null;

const readerStoreKeys: readonly (keyof ReaderState)[] = [
  'isEnabled',
  'parsedPages',
  'pageNum',
  'paused',
  'curPageUrl',
  'requestUrl',
  'lastRequestUrl',
  'curFocusElement',
  'curFocusIndex',
  'scrollOffsets',
  'site',
  'siteFontInfo',
  'isTheEnd',
  'activeUrl',
  'indexUrl',
  'prevUrl',
];

function getReaderStore(): ReturnType<typeof useReaderStore> | null {
  const activePinia = getActivePinia();
  if (!activePinia) {
    return null;
  }

  try {
    return useReaderStore(activePinia);
  } catch {
    // Pinia 还未初始化时直接返回 null，避免抛错
    return null;
  }
}

function readFromStore(key: keyof ReaderState): unknown {
  const store = getReaderStore();
  return store ? (store as unknown as Record<string, unknown>)[key as string] : undefined;
}

function writeToStore(key: keyof ReaderState, value: unknown): boolean {
  const store = getReaderStore();
  if (!store) {
    return false;
  }

  store.setState({ [key]: value } as Partial<ReaderState>);
  return true;
}

function syncStoreFromApp(app: IApp | null): void {
  if (!app) {
    return;
  }

  const updates: Partial<ReaderState> = {};
  readerStoreKeys.forEach(key => {
    const value = (app as Record<string, unknown>)[key];
    if (typeof value !== 'undefined') {
      updates[key] = value as never;
    }
  });

  const store = getReaderStore();
  store?.setState(updates);
}

function hasDataSource(): boolean {
  return Boolean(_app) || Boolean(getReaderStore());
}

const appProxy = new Proxy(
  {},
  {
    get(_target, prop: keyof IApp | keyof ReaderState) {
      if (readerStoreKeys.includes(prop as keyof ReaderState)) {
        return readFromStore(prop as keyof ReaderState);
      }

      return _app ? (_app as Record<string, unknown>)[prop as keyof IApp] : undefined;
    },
    set(_target, prop: keyof IApp | keyof ReaderState, value: unknown) {
      if (readerStoreKeys.includes(prop as keyof ReaderState)) {
        const handled = writeToStore(prop as keyof ReaderState, value);
        if (handled) {
          if (_app) {
            (_app as Record<string, unknown>)[prop as keyof IApp] = value;
          }
          return true;
        }
      }

      if (_app) {
        (_app as Record<string, unknown>)[prop as keyof IApp] = value;
        return true;
      }

      return false;
    },
    has(_target, prop: keyof IApp | keyof ReaderState) {
      if (readerStoreKeys.includes(prop as keyof ReaderState)) {
        return true;
      }
      return _app ? prop in _app : false;
    },
  }
) as IApp;

export function setApp(app: IApp): void {
  _app = app;
  syncStoreFromApp(app);
}

export function getApp(): IApp | null {
  if (!hasDataSource()) {
    return null;
  }

  // 每次读取时尝试同步一次 legacy 状态到 store，保证状态最新
  syncStoreFromApp(_app);
  return appProxy;
}

export function syncAppToStores(): void {
  syncStoreFromApp(_app);
}
