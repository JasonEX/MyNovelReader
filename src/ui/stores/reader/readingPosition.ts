type ReadingPosition = {
  percent: number;
  updatedAt: number;
};

type ReadingPositionMap = Record<string, ReadingPosition>;

const STORAGE_KEY = 'mnr-reading-positions';
const MAX_SAVED_POSITIONS = 200;
const PERSIST_INTERVAL_MS = 4000;

let positionCache: ReadingPositionMap | null = null;
let updateQueue = Promise.resolve();
let persistQueue = Promise.resolve();
let persistTimer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;

function normalizeChapterUrl(url: string): string {
  try {
    const normalized = new URL(url);
    normalized.hash = '';
    return normalized.toString();
  } catch {
    return url;
  }
}

function parsePositions(stored: unknown): ReadingPositionMap {
  if (typeof stored === 'string') stored = JSON.parse(stored);
  if (!stored || typeof stored !== 'object') return {};

  const positions: ReadingPositionMap = {};
  for (const [url, value] of Object.entries(stored)) {
    const position = value as Partial<ReadingPosition> | null;
    if (!position || !Number.isFinite(position.percent) || !Number.isFinite(position.updatedAt)) {
      continue;
    }
    positions[url] = {
      percent: position.percent as number,
      updatedAt: position.updatedAt as number,
    };
  }
  return positions;
}

function trimPositions(positions: ReadingPositionMap): ReadingPositionMap {
  const entries = Object.entries(positions);
  if (entries.length <= MAX_SAVED_POSITIONS) return positions;

  const trimmed: ReadingPositionMap = {};
  for (const [url, position] of entries
    .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_SAVED_POSITIONS)) {
    trimmed[url] = position;
  }
  return trimmed;
}

function mergePositions(...sources: ReadingPositionMap[]): ReadingPositionMap {
  const merged: ReadingPositionMap = {};
  for (const source of sources) {
    for (const [url, position] of Object.entries(source)) {
      const existing = merged[url];
      if (!existing || position.updatedAt >= existing.updatedAt) {
        merged[url] = position;
      }
    }
  }
  return trimPositions(merged);
}

async function readStoredPositions(): Promise<ReadingPositionMap> {
  try {
    let stored: unknown = null;
    if (typeof GM_getValue !== 'undefined') {
      stored = await GM_getValue<unknown>(STORAGE_KEY, null);
    } else if (typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(STORAGE_KEY);
    }
    return parsePositions(stored);
  } catch (error) {
    console.error('[MNR] Failed to load reading positions:', error);
    return {};
  }
}

async function loadPositions(refresh = false): Promise<ReadingPositionMap> {
  if (positionCache && !refresh) return positionCache;

  const stored = await readStoredPositions();
  positionCache = mergePositions(stored, positionCache ?? {});
  return positionCache;
}

async function persistPositions(serialized: string): Promise<void> {
  if (typeof GM_setValue !== 'undefined') {
    await GM_setValue(STORAGE_KEY, serialized);
  } else if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, serialized);
  }
}

export async function getReadingPosition(url: string): Promise<number | null> {
  if (!url) return null;
  const positions = await loadPositions(true);
  const position = positions[normalizeChapterUrl(url)];
  if (!position || !Number.isFinite(position.percent)) return null;
  return Math.max(0, Math.min(100, position.percent));
}

export function saveReadingPosition(url: string, percent: number): void {
  if (!url || !Number.isFinite(percent)) return;
  const normalizedUrl = normalizeChapterUrl(url);
  const normalizedPercent = Math.max(0, Math.min(100, Math.round(percent * 10) / 10));

  updateQueue = updateQueue
    .then(async () => {
      const positions = await loadPositions();
      const isNewPosition = !(normalizedUrl in positions);
      positions[normalizedUrl] = { percent: normalizedPercent, updatedAt: Date.now() };

      if (isNewPosition && Object.keys(positions).length > MAX_SAVED_POSITIONS) {
        positionCache = trimPositions(positions);
      }

      dirty = true;
      schedulePersist();
    })
    .catch(error => console.error('[MNR] Failed to update reading position:', error));
}

function schedulePersist(): void {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    void flushReadingPositions();
  }, PERSIST_INTERVAL_MS);
}

export async function flushReadingPositions(): Promise<void> {
  await updateQueue;
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  if (!dirty) return persistQueue;

  const snapshot = mergePositions(await loadPositions());
  dirty = false;
  persistQueue = persistQueue
    .then(async () => {
      const merged = mergePositions(await readStoredPositions(), snapshot);
      await persistPositions(JSON.stringify(merged));
      positionCache = mergePositions(merged, positionCache ?? {});
    })
    .catch(error => console.error('[MNR] Failed to save reading positions:', error));
  return persistQueue;
}
