export interface StorageService {
  getValue<T>(_key: string, _defaultValue?: T): T | undefined;
  setValue<T>(_key: string, _value: T): void;
  deleteValue(_key: string): void;
}

export class DefaultStorageService implements StorageService {
  private gmGet = typeof GM_getValue === 'function' ? GM_getValue : undefined;

  private gmSet = typeof GM_setValue === 'function' ? GM_setValue : undefined;

  private gmDelete = typeof GM_deleteValue === 'function' ? GM_deleteValue : undefined;

  getValue<T>(key: string, defaultValue?: T): T | undefined {
    if (this.gmGet) {
      return this.gmGet(key, defaultValue as T) as T;
    }

    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return defaultValue;
      }

      try {
        return JSON.parse(raw) as T;
      } catch (error) {
        void error;
        return raw as unknown as T;
      }
    } catch (error) {
      void error;
      return defaultValue;
    }
  }

  setValue<T>(key: string, value: T): void {
    if (this.gmSet) {
      this.gmSet(key, value as never);
      return;
    }

    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      if (serialized !== undefined) {
        localStorage.setItem(key, serialized);
      }
    } catch (error) {
      void error;
    }
  }

  deleteValue(key: string): void {
    if (this.gmDelete) {
      this.gmDelete(key);
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      void error;
    }
  }
}
