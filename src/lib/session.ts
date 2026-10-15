import type { CardState, ExerciseResult } from '../db/db';
import type { Card, Level } from '../types';
import type { SessionMode } from './settings';

export const MODE_LIMITS: Record<SessionMode, { reviews: number; fresh: number; tasks: number }> = {
  10: { reviews: 20, fresh: 5, tasks: 0 },
  15: { reviews: 30, fresh: 8, tasks: 1 },
  20: { reviews: 40, fresh: 10, tasks: 2 },
};

export type TaskKind = 'lesson' | 'dialogue' | 'email' | 'grammar';

export interface TaskItem {
  kind: TaskKind;
  id: string;
  title: string;
  level: Level;
}

export interface PlanInput {
  cards: Card[];
  states: CardState[];
  results: ExerciseResult[];
  items: TaskItem[];
  newPerDay: number;
  startLevel: Level;
  today: number;
}

export interface SessionPlan {
  review: string[];
  fresh: string[];
  tasks: TaskItem[];
}

const LEVEL_ORDER: Level[] = ['A2', 'B1', 'B2'];

/** Order in which new cards are introduced: start level, then harder levels, then easier ones. */
export function levelPriority(start: Level): Level[] {
  const i = LEVEL_ORDER.indexOf(start);
  return [...LEVEL_ORDER.slice(i), ...LEVEL_ORDER.slice(0, i).reverse()];
}

export function dueCards(states: CardState[], today: number): CardState[] {
  return states
    .filter((s) => s.due <= today)
    .sort((a, b) => b.lapses - a.lapses || a.due - b.due || a.cardId.localeCompare(b.cardId));
}

export function newCardQueue(cards: Card[], states: CardState[], startLevel: Level): Card[] {
  const seen = new Set(states.map((s) => s.cardId));
  const unseen = cards.filter((c) => !seen.has(c.id));
  const custom = unseen.filter((c) => c.custom);
  const prio = levelPriority(startLevel);
  const builtIn = prio.flatMap((l) => unseen.filter((c) => !c.custom && c.level === l));
  return [...custom, ...builtIn];
}

export function newAllowance(states: CardState[], newPerDay: number, today: number): number {
  const introducedToday = states.filter((s) => s.introducedDay === today).length;
  return Math.max(0, newPerDay - introducedToday);
}

function bestScores(results: ExerciseResult[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of results) {
    const k = `${r.kind}:${r.itemId}`;
    m.set(k, Math.max(m.get(k) ?? 0, r.score));
  }
  return m;
}

/**
 * Rule-based task choice: the kind with the lowest average best score goes first
 * (kinds never tried count as weakest). Inside a kind: first untried item at or above
 * the start level, otherwise the item with the lowest best score.
 */
export function pickTasks(items: TaskItem[], results: ExerciseResult[], startLevel: Level, n: number): TaskItem[] {
  if (n <= 0) return [];
  const best = bestScores(results);
  const kinds = Array.from(new Set(items.map((i) => i.kind)));
  const weakness = (k: TaskKind) => {
    const tried = items.filter((i) => i.kind === k && best.has(`${k}:${i.id}`));
    if (!tried.length) return -1;
    return tried.reduce((a, i) => a + (best.get(`${k}:${i.id}`) ?? 0), 0) / tried.length;
  };
  const orderedKinds = kinds.sort((a, b) => weakness(a) - weakness(b));
  const prio = levelPriority(startLevel);
  const out: TaskItem[] = [];
  for (const k of orderedKinds) {
    if (out.length >= n) break;
    const ofKind = items.filter((i) => i.kind === k);
    const untried = prio.flatMap((l) => ofKind.filter((i) => i.level === l && !best.has(`${k}:${i.id}`)));
    if (untried.length) {
      out.push(untried[0]);
      continue;
    }
    const sorted = ofKind.slice().sort((a, b) => (best.get(`${k}:${a.id}`) ?? 0) - (best.get(`${k}:${b.id}`) ?? 0));
    if (sorted[0] && (best.get(`${k}:${sorted[0].id}`) ?? 0) < 1) out.push(sorted[0]);
  }
  return out;
}

export function buildPlan(mode: SessionMode, input: PlanInput): SessionPlan {
  const lim = MODE_LIMITS[mode];
  const review = dueCards(input.states, input.today)
    .slice(0, lim.reviews)
    .map((s) => s.cardId);
  const freshN = Math.min(lim.fresh, newAllowance(input.states, input.newPerDay, input.today));
  const fresh = newCardQueue(input.cards, input.states, input.startLevel)
    .slice(0, freshN)
    .map((c) => c.id);
  const tasks = pickTasks(input.items, input.results, input.startLevel, lim.tasks);
  return { review, fresh, tasks };
}
