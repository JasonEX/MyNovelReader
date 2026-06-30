import type { ChapterEntry } from '@/ui/stores/reader';

export interface AdaptivePreloadStats {
  version: 1;
  key: string;
  loadSrttMs: number;
  loadRttVarMs: number;
  loadSamples: number;
  charsPerMs: number;
  readSamples: number;
  failureCount: number;
  updatedAt: number;
}

const STORAGE_PREFIX = 'mnr_preload_stats_v1_';

const DEFAULT_LOAD_SRTT_MS = 6000;
const DEFAULT_LOAD_RTTVAR_MS = 3000;
const MIN_RECORDED_LOAD_MS = 300;
const MAX_RECORDED_LOAD_MS = 45000;
const LOAD_EWMA_ALPHA = 0.2;
const LOAD_VARIANCE_ALPHA = 0.25;

const DEFAULT_CHARS_PER_MINUTE = 900;
const MIN_CHARS_PER_MINUTE = 180;
const MAX_CHARS_PER_MINUTE = 2400;
const READ_EWMA_ALPHA = 0.2;
const READ_SPEED_EARLY_MULTIPLIER = 1.25;

export const ADAPTIVE_PRELOAD_EARLY_BIAS_MS = 5000;
export const ADAPTIVE_PRELOAD_MIN_LEAD_MS = 10000;
export const ADAPTIVE_PRELOAD_MAX_LEAD_MS = 45000;
export const ADAPTIVE_PRELOAD_MIN_READ_MS = 10000;
export const ADAPTIVE_PRELOAD_MAX_READ_MS = 45 * 60 * 1000;
export const ADAPTIVE_PRELOAD_MIN_READ_CHARS = 200;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function encodeBase64UrlUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function parseStoredJson<T>(stored: unknown): T | null {
  if (stored === null || stored === undefined) return null;
  if (typeof stored === 'string') {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }
  if (typeof stored === 'object') return stored as T;
  return null;
}

function getHostname(url: string | undefined): string {
  if (!url) return '';
  try {
    return new URL(url, window.location.href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getDefaultCharsPerMs(): number {
  return DEFAULT_CHARS_PER_MINUTE / 60000;
}

function isValidStats(
  value: AdaptivePreloadStats | null,
  key: string
): value is AdaptivePreloadStats {
  return (
    value?.version === 1 &&
    value.key === key &&
    Number.isFinite(value.loadSrttMs) &&
    Number.isFinite(value.loadRttVarMs) &&
    Number.isFinite(value.loadSamples) &&
    Number.isFinite(value.charsPerMs) &&
    Number.isFinite(value.readSamples) &&
    Number.isFinite(value.failureCount)
  );
}

export function getAdaptivePreloadStatsKey(entry: ChapterEntry | undefined): string {
  const chapter = entry?.chapter;
  const ruleId = entry?.rule?.id || chapter?.rule?.id || 'site';
  const host = getHostname(chapter?.indexUrl || chapter?.url);
  if (!host) return '';
  return `${ruleId}@${host}`;
}

export function getAdaptivePreloadStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${encodeBase64UrlUtf8(key)}`;
}

export function createDefaultAdaptivePreloadStats(
  key: string,
  now = Date.now()
): AdaptivePreloadStats {
  return {
    version: 1,
    key,
    loadSrttMs: DEFAULT_LOAD_SRTT_MS,
    loadRttVarMs: DEFAULT_LOAD_RTTVAR_MS,
    loadSamples: 0,
    charsPerMs: getDefaultCharsPerMs(),
    readSamples: 0,
    failureCount: 0,
    updatedAt: now,
  };
}

export function loadAdaptivePreloadStats(key: string): AdaptivePreloadStats {
  const fallback = createDefaultAdaptivePreloadStats(key);
  if (!key) return fallback;

  try {
    if (typeof GM_getValue !== 'undefined') {
      const stored = GM_getValue<unknown>(getAdaptivePreloadStorageKey(key), null);
      const parsed = parseStoredJson<AdaptivePreloadStats>(stored);
      return isValidStats(parsed, key) ? parsed : fallback;
    }

    if (typeof localStorage !== 'undefined') {
      const parsed = parseStoredJson<AdaptivePreloadStats>(
        localStorage.getItem(getAdaptivePreloadStorageKey(key))
      );
      return isValidStats(parsed, key) ? parsed : fallback;
    }
  } catch (e) {
    console.error('[MNR] Failed to load adaptive preload stats:', e);
  }

  return fallback;
}

export function saveAdaptivePreloadStats(stats: AdaptivePreloadStats): void {
  if (!stats.key) return;

  try {
    const value = JSON.stringify(stats);
    const storageKey = getAdaptivePreloadStorageKey(stats.key);
    if (typeof GM_setValue !== 'undefined') {
      GM_setValue(storageKey, value);
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, value);
    }
  } catch (e) {
    console.error('[MNR] Failed to save adaptive preload stats:', e);
  }
}

export function recordLoadSample(
  stats: AdaptivePreloadStats,
  durationMs: number,
  now = Date.now()
): AdaptivePreloadStats {
  const sample = clamp(durationMs, MIN_RECORDED_LOAD_MS, MAX_RECORDED_LOAD_MS);

  if (stats.loadSamples <= 0) {
    return {
      ...stats,
      loadSrttMs: sample,
      loadRttVarMs: sample / 2,
      loadSamples: 1,
      failureCount: Math.max(0, stats.failureCount - 1),
      updatedAt: now,
    };
  }

  const previousSrtt = stats.loadSrttMs;
  const nextVar =
    (1 - LOAD_VARIANCE_ALPHA) * stats.loadRttVarMs +
    LOAD_VARIANCE_ALPHA * Math.abs(previousSrtt - sample);
  const nextSrtt = (1 - LOAD_EWMA_ALPHA) * previousSrtt + LOAD_EWMA_ALPHA * sample;

  return {
    ...stats,
    loadSrttMs: nextSrtt,
    loadRttVarMs: nextVar,
    loadSamples: stats.loadSamples + 1,
    failureCount: Math.max(0, stats.failureCount - 1),
    updatedAt: now,
  };
}

export function recordLoadFailure(
  stats: AdaptivePreloadStats,
  now = Date.now()
): AdaptivePreloadStats {
  return {
    ...stats,
    failureCount: Math.min(10, stats.failureCount + 1),
    updatedAt: now,
  };
}

export function recordReadingSample(
  stats: AdaptivePreloadStats,
  chars: number,
  durationMs: number,
  now = Date.now()
): AdaptivePreloadStats {
  if (
    chars < ADAPTIVE_PRELOAD_MIN_READ_CHARS ||
    durationMs < ADAPTIVE_PRELOAD_MIN_READ_MS ||
    durationMs > ADAPTIVE_PRELOAD_MAX_READ_MS
  ) {
    return stats;
  }

  const charsPerMs = clamp(
    chars / durationMs,
    MIN_CHARS_PER_MINUTE / 60000,
    MAX_CHARS_PER_MINUTE / 60000
  );

  if (stats.readSamples <= 0) {
    return {
      ...stats,
      charsPerMs,
      readSamples: 1,
      updatedAt: now,
    };
  }

  return {
    ...stats,
    charsPerMs: (1 - READ_EWMA_ALPHA) * stats.charsPerMs + READ_EWMA_ALPHA * charsPerMs,
    readSamples: stats.readSamples + 1,
    updatedAt: now,
  };
}

export function estimateAdaptivePreloadLeadMs(stats: AdaptivePreloadStats): number {
  const srtt = stats.loadSamples > 0 ? stats.loadSrttMs : DEFAULT_LOAD_SRTT_MS;
  const rttVar = stats.loadSamples > 0 ? stats.loadRttVarMs : DEFAULT_LOAD_RTTVAR_MS;
  const failurePenalty = Math.min(stats.failureCount, 3) * 2000;
  return clamp(
    srtt + 2 * rttVar + ADAPTIVE_PRELOAD_EARLY_BIAS_MS + failurePenalty,
    ADAPTIVE_PRELOAD_MIN_LEAD_MS,
    ADAPTIVE_PRELOAD_MAX_LEAD_MS
  );
}

export function estimateReadingCharsPerMs(stats: AdaptivePreloadStats): number {
  const base = stats.readSamples > 0 ? stats.charsPerMs : getDefaultCharsPerMs();
  return clamp(
    base * READ_SPEED_EARLY_MULTIPLIER,
    MIN_CHARS_PER_MINUTE / 60000,
    MAX_CHARS_PER_MINUTE / 60000
  );
}

export function countReadableChars(html: string): number {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;/gi, '')
    .replace(/\s+/g, '').length;
}
