import { vi } from 'vitest';

export type GmStorageMock = {
  store: Map<string, unknown>;
  GM_getValue: (key: string, defaultValue?: unknown) => unknown;
  GM_setValue: (key: string, value: unknown) => void;
  GM_deleteValue: (key: string) => void;
  GM_listValues: () => string[];
};

export function createGmStorageMock(initial: Record<string, unknown> = {}): GmStorageMock {
  const store = new Map<string, unknown>(Object.entries(initial));

  const GM_getValue = vi.fn((key: string, defaultValue?: unknown) => {
    if (store.has(key)) return store.get(key);
    return defaultValue;
  });

  const GM_setValue = vi.fn((key: string, value: unknown) => {
    store.set(key, value);
  });

  const GM_deleteValue = vi.fn((key: string) => {
    store.delete(key);
  });

  const GM_listValues = vi.fn(() => Array.from(store.keys()));

  return { store, GM_getValue, GM_setValue, GM_deleteValue, GM_listValues };
}

export function stubGmStorage(mock: GmStorageMock): void {
  vi.stubGlobal('GM_getValue', mock.GM_getValue);
  vi.stubGlobal('GM_setValue', mock.GM_setValue);
  vi.stubGlobal('GM_deleteValue', mock.GM_deleteValue);
  vi.stubGlobal('GM_listValues', mock.GM_listValues);
}
