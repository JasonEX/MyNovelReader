export function L_getValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function L_setValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore quota/storage errors
  }
}

export function L_removeValue(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore removal errors
  }
}
