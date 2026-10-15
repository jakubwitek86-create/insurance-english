import type { CardState, ExerciseResult, ReviewLog } from '../db/db';
import type { Card, Level, Topic } from '../types';
import { LEVELS } from '../types';
import { isMature } from './srs';

/** Consecutive days with any activity, ending today (or yesterday if nothing yet today). */
export function streak(activeDays: Set<number>, today: number): number {
  let d = activeDays.has(today) ? today : today - 1;
  let n = 0;
  while (activeDays.has(d)) {
    n++;
    d--;
  }
  return n;
}

export function activeDaySet(reviews: Pick<ReviewLog, 'day'>[], results: Pick<ExerciseResult, 'day'>[]): Set<number> {
  const s = new Set<number>();
  for (const r of reviews) s.add(r.day);
  for (const r of results) s.add(r.day);
  return s;
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Best score per item, so repeating an exercise improves rather than dilutes the average. */
function bestPerItem(results: ExerciseResult[]): ExerciseResult[] {
  const m = new Map<string, ExerciseResult>();
  for (const r of results) {
    const k = `${r.kind}:${r.itemId}`;
    const cur = m.get(k);
    if (!cur || r.score > cur.score) m.set(k, r);
  }
  return Array.from(m.values());
}

export interface LevelEstimate {
  level: Level;
  vocab: number;
  knowledge: number;
  communication: number;
  score: number;
  reached: boolean;
}

export const LEVEL_THRESHOLD = 0.7;

/**
 * Internal estimate (NOT a CEFR certificate):
 * score = 0.4 × share of the level's cards that are mature (interval ≥ 7 days)
 *       + 0.3 × average best score of lessons & grammar at that level
 *       + 0.3 × average best score of dialogues, emails, speaking & listening at that level.
 */
export function levelEstimates(cards: Card[], states: CardState[], results: ExerciseResult[]): LevelEstimate[] {
  const stateMap = new Map(states.map((s) => [s.cardId, s]));
  const best = bestPerItem(results.filter((r) => r.kind !== 'placement'));
  return LEVELS.map((level) => {
    const lc = cards.filter((c) => c.level === level && !c.custom);
    const mature = lc.filter((c) => {
      const s = stateMap.get(c.id);
      return s ? isMature(s) : false;
    }).length;
    const vocab = lc.length ? mature / lc.length : 0;
    const knowledge = avg(best.filter((r) => r.level === level && (r.kind === 'lesson' || r.kind === 'grammar')).map((r) => r.score));
    const communication = avg(
      best
        .filter((r) => r.level === level && ['dialogue', 'email', 'speaking', 'listening'].includes(r.kind))
        .map((r) => r.score),
    );
    const score = 0.4 * vocab + 0.3 * knowledge + 0.3 * communication;
    return { level, vocab, knowledge, communication, score, reached: score >= LEVEL_THRESHOLD };
  });
}

/** Highest level reached in sequence (A2 must be reached before B1 counts). */
export function currentLevelLabel(est: LevelEstimate[]): string {
  let label = 'poniżej A2';
  for (const e of est) {
    if (e.reached) label = e.level;
    else break;
  }
  return label;
}

export interface TopicProgress {
  topic: Topic;
  total: number;
  seen: number;
  mature: number;
}

export function topicProgress(cards: Card[], states: CardState[]): TopicProgress[] {
  const stateMap = new Map(states.map((s) => [s.cardId, s]));
  const m = new Map<Topic, TopicProgress>();
  for (const c of cards) {
    if (c.custom) continue;
    const t = m.get(c.topic) ?? { topic: c.topic, total: 0, seen: 0, mature: 0 };
    t.total++;
    const s = stateMap.get(c.id);
    if (s) {
      t.seen++;
      if (isMature(s)) t.mature++;
    }
    m.set(c.topic, t);
  }
  return Array.from(m.values()).sort((a, b) => b.total - a.total);
}

/** Reviews per day for the last n days (oldest first). */
export function reviewsPerDay(reviews: Pick<ReviewLog, 'day'>[], today: number, n = 14): { day: number; count: number }[] {
  const out: { day: number; count: number }[] = [];
  for (let d = today - n + 1; d <= today; d++) out.push({ day: d, count: 0 });
  for (const r of reviews) {
    const i = r.day - (today - n + 1);
    if (i >= 0 && i < n) out[i].count++;
  }
  return out;
}

export function retentionRate(reviews: Pick<ReviewLog, 'grade'>[]): number {
  if (!reviews.length) return 0;
  return reviews.filter((r) => r.grade >= 3).length / reviews.length;
}
