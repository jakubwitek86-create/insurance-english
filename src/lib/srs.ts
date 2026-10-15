import type { CardState } from '../db/db';

/**
 * SM-2 (Wozniak, 1987) with four buttons mapped to SM-2 quality grades:
 * Again = 0, Hard = 3, Good = 4, Easy = 5.
 * - grade < 3: repetition count resets, interval = 1 day, lapse counted.
 * - first successful review: 1 day, second: 6 days, then interval × ease factor.
 * - ease factor update: EF + (0.1 − (5 − q)(0.08 + (5 − q)·0.02)), floor 1.3.
 * Due dates are local day indexes, so a card is due for the whole day.
 */
export type Grade = 0 | 3 | 4 | 5;

export const GRADE_LABELS: Record<Grade, string> = {
  0: 'Nie pamiętam',
  3: 'Trudne',
  4: 'Dobrze',
  5: 'Łatwe',
};

export const MIN_EASE = 1.3;
export const START_EASE = 2.5;

export function newState(cardId: string, today: number): CardState {
  return {
    cardId,
    due: today,
    interval: 0,
    ease: START_EASE,
    reps: 0,
    lapses: 0,
    lastReviewed: -1,
    introducedDay: today,
  };
}

export function nextEase(ease: number, grade: Grade): number {
  const q = grade;
  const e = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return Math.max(MIN_EASE, Math.round(e * 100) / 100);
}

export function review(state: CardState, grade: Grade, today: number): CardState {
  const s = { ...state };
  if (grade < 3) {
    if (s.reps > 0) s.lapses += 1;
    s.reps = 0;
    s.interval = 1;
  } else {
    if (s.reps === 0) s.interval = 1;
    else if (s.reps === 1) s.interval = 6;
    else s.interval = Math.max(1, Math.round(s.interval * s.ease));
    s.reps += 1;
  }
  s.ease = nextEase(s.ease, grade);
  s.lastReviewed = today;
  s.due = today + s.interval;
  return s;
}

/** Preview of the interval each button would give (for button labels). */
export function previewIntervals(state: CardState, today: number): Record<Grade, number> {
  return {
    0: review(state, 0, today).interval,
    3: review(state, 3, today).interval,
    4: review(state, 4, today).interval,
    5: review(state, 5, today).interval,
  };
}

export function isMature(state: CardState): boolean {
  return state.interval >= 7;
}
