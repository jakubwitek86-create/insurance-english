import { describe, expect, it } from 'vitest';
import { newState, review, nextEase, MIN_EASE } from './srs';
import { checkGap, checkOrder, evaluateText, lineSimilarity, containsPhrase } from './feedback';
import { streak, levelEstimates, currentLevelLabel, topicProgress, reviewsPerDay, retentionRate } from './progress';
import { buildPlan, levelPriority, pickTasks, newAllowance, dueCards } from './session';
import type { Card } from '../types';
import type { CardState, ExerciseResult } from '../db/db';

describe('SM-2 scheduling', () => {
  const today = 20000;

  it('schedules first reviews at 1 and 6 days, then multiplies by ease', () => {
    let s = newState('x', today);
    s = review(s, 4, today);
    expect(s.interval).toBe(1);
    expect(s.due).toBe(today + 1);
    s = review(s, 4, today + 1);
    expect(s.interval).toBe(6);
    s = review(s, 4, today + 7);
    expect(s.interval).toBe(Math.round(6 * s.ease));
    expect(s.reps).toBe(3);
  });

  it('resets on "Again", counts a lapse and lowers ease', () => {
    let s = newState('x', today);
    s = review(s, 5, today);
    s = review(s, 5, today + 1);
    const easeBefore = s.ease;
    s = review(s, 0, today + 7);
    expect(s.reps).toBe(0);
    expect(s.interval).toBe(1);
    expect(s.lapses).toBe(1);
    expect(s.ease).toBeLessThan(easeBefore);
  });

  it('does not count a lapse for a brand new card', () => {
    const s = review(newState('x', today), 0, today);
    expect(s.lapses).toBe(0);
  });

  it('keeps ease at or above the 1.3 floor', () => {
    let e = 1.35;
    for (let i = 0; i < 10; i++) e = nextEase(e, 0);
    expect(e).toBe(MIN_EASE);
  });

  it('applies the SM-2 ease formula', () => {
    expect(nextEase(2.5, 5)).toBe(2.6);
    expect(nextEase(2.5, 4)).toBe(2.5);
    expect(nextEase(2.5, 3)).toBe(2.36);
  });
});

describe('answer checking and deterministic feedback', () => {
  it('accepts case/punctuation variants and contractions', () => {
    expect(checkGap('  Excess. ', ['excess', 'deductible'])).toBe(true);
    expect(checkGap('deductible', ['excess', 'deductible'])).toBe(true);
    expect(checkGap('premium', ['excess'])).toBe(false);
    expect(checkGap('', ['excess'])).toBe(false);
    expect(containsPhrase("I'm afraid it's excluded", 'i am afraid')).toBe(true);
  });

  it('checks word order', () => {
    expect(checkOrder(['Was', 'anyone', 'injured?'], ['Was', 'anyone', 'injured?'])).toBe(true);
    expect(checkOrder(['anyone', 'Was', 'injured?'], ['Was', 'anyone', 'injured?'])).toBe(false);
  });

  it('does not penalise valid alternatives', () => {
    const req = [{ label: 'deadline', accept: ['by friday', 'by the end of the week'] }];
    expect(evaluateText('Could you send it by the end of the week?', req).score).toBe(1);
    expect(evaluateText('Could you send it by Friday?', req).score).toBe(1);
    expect(evaluateText('Send it.', req).score).toBe(0);
  });

  it('gives at most three suggestions and flags missing politeness', () => {
    const req = [
      { label: 'a', accept: ['alpha'] },
      { label: 'b', accept: ['beta'] },
      { label: 'c', accept: ['gamma'] },
    ];
    const fb = evaluateText('Send it.', req);
    expect(fb.suggestions.length).toBeLessThanOrEqual(3);
    expect(fb.polite).toBe(false);
    expect(evaluateText('Could you please send it?', req).polite).toBe(true);
  });

  it('measures line similarity on content words', () => {
    const r = lineSimilarity('When did it happen', 'When exactly did it happen?');
    expect(r.missing).toEqual(['exactly']);
    expect(r.score).toBeCloseTo(3 / 4);
  });
});

const mkCard = (id: string, level: Card['level'], topic: Card['topic'] = 'basics', custom = false): Card => ({
  id,
  en: id,
  pl: id,
  def: '',
  level,
  topic,
  examples: [],
  collocations: [],
  note: '',
  custom,
});
const mkState = (cardId: string, p: Partial<CardState> = {}): CardState => ({
  cardId,
  due: 100,
  interval: 1,
  ease: 2.5,
  reps: 1,
  lapses: 0,
  lastReviewed: 99,
  introducedDay: 90,
  ...p,
});
const mkResult = (p: Partial<ExerciseResult>): ExerciseResult => ({
  kind: 'lesson',
  itemId: 'l1',
  level: 'A2',
  score: 1,
  ts: 0,
  day: 100,
  ...p,
});

describe('progress calculations', () => {
  it('counts a streak ending today or yesterday', () => {
    expect(streak(new Set([98, 99, 100]), 100)).toBe(3);
    expect(streak(new Set([98, 99]), 100)).toBe(2);
    expect(streak(new Set([97]), 100)).toBe(0);
  });

  it('estimates level from vocabulary, knowledge and communication', () => {
    const cards = [mkCard('a', 'A2'), mkCard('b', 'A2'), mkCard('c', 'B1')];
    const states = [mkState('a', { interval: 10 }), mkState('b', { interval: 10 })];
    const results = [
      mkResult({ kind: 'lesson', level: 'A2', score: 1 }),
      mkResult({ kind: 'dialogue', itemId: 'd1', level: 'A2', score: 0.5 }),
      mkResult({ kind: 'dialogue', itemId: 'd1', level: 'A2', score: 1 }),
    ];
    const est = levelEstimates(cards, states, results);
    const a2 = est.find((e) => e.level === 'A2')!;
    expect(a2.vocab).toBe(1);
    expect(a2.knowledge).toBe(1);
    expect(a2.communication).toBe(1); // best score per item counts
    expect(a2.score).toBeCloseTo(1);
    expect(a2.reached).toBe(true);
    expect(currentLevelLabel(est)).toBe('A2');
  });

  it('requires levels in sequence', () => {
    const est = levelEstimates([mkCard('c', 'B1')], [mkState('c', { interval: 30 })], [
      mkResult({ level: 'B1', score: 1 }),
      mkResult({ kind: 'email', itemId: 'e', level: 'B1', score: 1 }),
    ]);
    expect(est.find((e) => e.level === 'B1')!.reached).toBe(true);
    expect(currentLevelLabel(est)).toBe('poniżej A2');
  });

  it('computes topic progress, daily reviews and retention', () => {
    const tp = topicProgress([mkCard('a', 'A2', 'claims'), mkCard('b', 'A2', 'claims')], [mkState('a', { interval: 8 })]);
    expect(tp[0]).toEqual({ topic: 'claims', total: 2, seen: 1, mature: 1 });
    const per = reviewsPerDay([{ day: 100 }, { day: 100 }, { day: 99 }, { day: 50 }], 100, 3);
    expect(per.map((p) => p.count)).toEqual([0, 1, 2]);
    expect(retentionRate([{ grade: 0 }, { grade: 4 }, { grade: 5 }, { grade: 3 }])).toBe(0.75);
  });
});

describe('session planning', () => {
  it('orders levels from the start level', () => {
    expect(levelPriority('A2')).toEqual(['A2', 'B1', 'B2']);
    expect(levelPriority('B1')).toEqual(['B1', 'B2', 'A2']);
  });

  it('prioritises lapsed cards and respects the daily new-card limit', () => {
    const states = [mkState('a', { due: 100 }), mkState('b', { due: 99, lapses: 2 }), mkState('c', { due: 120 })];
    expect(dueCards(states, 100).map((s) => s.cardId)).toEqual(['b', 'a']);
    const withToday = [...states, mkState('n1', { introducedDay: 100 }), mkState('n2', { introducedDay: 100 })];
    expect(newAllowance(withToday, 10, 100)).toBe(8);
  });

  it('builds a 15-minute plan with custom cards first and one task', () => {
    const cards = [mkCard('x1', 'B1'), mkCard('x2', 'A2'), mkCard('mine', 'B2', 'communication', true)];
    const plan = buildPlan(15, {
      cards,
      states: [mkState('due1', { due: 100 })],
      results: [],
      items: [{ kind: 'grammar', id: 'g1', title: 'g', level: 'A2' }],
      newPerDay: 10,
      startLevel: 'A2',
      today: 100,
    });
    expect(plan.review).toEqual(['due1']);
    expect(plan.fresh).toEqual(['mine', 'x2', 'x1']);
    expect(plan.tasks).toHaveLength(1);
    const ten = buildPlan(10, { cards, states: [], results: [], items: [], newPerDay: 10, startLevel: 'A2', today: 100 });
    expect(ten.tasks).toHaveLength(0);
  });

  it('picks the weakest kind first', () => {
    const items = [
      { kind: 'email' as const, id: 'e1', title: '', level: 'A2' as const },
      { kind: 'email' as const, id: 'e2', title: '', level: 'B1' as const },
      { kind: 'grammar' as const, id: 'g1', title: '', level: 'A2' as const },
    ];
    const results = [mkResult({ kind: 'email', itemId: 'e1', score: 0.3 }), mkResult({ kind: 'grammar', itemId: 'g1', score: 0.9 })];
    const t = pickTasks(items, results, 'A2', 1);
    expect(t[0].kind).toBe('email');
    expect(t[0].id).toBe('e2');
  });
});
