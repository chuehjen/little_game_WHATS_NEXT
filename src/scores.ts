import type { ScoreEntry } from './types';

const STORAGE_KEY = 'whatsnext_scores';
const MAX_ENTRIES = 10;

/** Load saved scores from localStorage. Returns sorted array (desc), top 10. */
export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((e: ScoreEntry) => typeof e.score === 'number')
      .sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Save a new score. Keeps top 10, sorted descending. */
export function saveScore(totalScore: number): void {
  const scores = loadScores();
  scores.push({
    score: Math.round(totalScore * 100) / 100,
    date: Date.now(),
  });
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  } catch {
    // localStorage full or disabled
  }
}

/** Format a timestamp to a short date string. */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
