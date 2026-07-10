type ReadingPosition = {
  percent: number;
  updatedAt: number;
};

type ReadingPositionMap = Record<string, ReadingPosition>;

const STORAGE_KEY = 'mnr-reading-positions';
const MAX_SAVED_POSITIONS = 200;

let positionCache: ReadingPositionMap | null = null;
let saveQueue = Promise.resolve();

function normalizeChapterUrl(url: string): string {
  try {
    const normalized = new URL(url);
    normalized.hash = '';
    return normalized.toString();
  } catch {
    return url;
  }
}

async function loadPositions(): Promise<ReadingPositionMap> {
  if (positionCache) return positionCache;

  try {
    let stored: unknown = null;
    if (typeof GM_getValue !== 'undefined') {
      stored = await GM_getValue<unknown>(STORAGE_KEY, null);
    } else if (typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(STORAGE_KEY);
    }

    if (typeof stored === 'string') stored = JSON.parse(stored);
    positionCache = stored && typeof stored === 'object' ? (stored as ReadingPositionMap) : {};
  } catch (error) {
    console.error('[MNR] Failed to load reading positions:', error);
    positionCache = {};
  }

  return positionCache;
}

async function persistPositions(positions: ReadingPositionMap): Promise<void> {
  const serialized = JSON.stringify(positions);
  if (typeof GM_setValue !== 'undefined') {
    await GM_setValue(STORAGE_KEY, serialized);
  } else if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, serialized);
  }
}

export async function getReadingPosition(url: string): Promise<number | null> {
  if (!url) return null;
  const positions = await loadPositions();
  const position = positions[normalizeChapterUrl(url)];
  if (!position || !Number.isFinite(position.percent)) return null;
  return Math.max(0, Math.min(100, position.percent));
}

export function saveReadingPosition(url: string, percent: number): void {
  if (!url || !Number.isFinite(percent)) return;
  const normalizedUrl = normalizeChapterUrl(url);
  const normalizedPercent = Math.max(0, Math.min(100, Math.round(percent * 10) / 10));

  saveQueue = saveQueue
    .then(async () => {
      const positions = await loadPositions();
      positions[normalizedUrl] = { percent: normalizedPercent, updatedAt: Date.now() };

      const entries = Object.entries(positions);
      if (entries.length > MAX_SAVED_POSITIONS) {
        entries
          .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
          .slice(MAX_SAVED_POSITIONS)
          .forEach(([key]) => delete positions[key]);
      }

      await persistPositions(positions);
    })
    .catch(error => console.error('[MNR] Failed to save reading position:', error));
}
