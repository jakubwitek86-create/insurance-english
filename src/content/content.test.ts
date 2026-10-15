import { describe, expect, it } from 'vitest';
import { builtInCards, lessons, grammar, dialogues, emails, speakingTasks, listeningItems, placement, cardById, placementLevel } from './index';
import { evaluateText } from '../lib/feedback';
import type { Exercise } from '../types';

const checkExercises = (where: string, list: Exercise[]) => {
  for (const ex of list) {
    if (ex.type === 'mcq') {
      expect(ex.answer, `${where}: ${ex.q}`).toBeGreaterThanOrEqual(0);
      expect(ex.answer, `${where}: ${ex.q}`).toBeLessThan(ex.options.length);
    }
    if (ex.type === 'gap') {
      expect(ex.q.includes('___'), `${where}: gap marker in "${ex.q}"`).toBe(true);
      expect(ex.answers.length).toBeGreaterThan(0);
    }
    if (ex.type === 'order') expect(ex.words.length).toBeGreaterThan(1);
  }
};

describe('content integrity', () => {
  it('meets the minimum counts', () => {
    expect(builtInCards.length).toBeGreaterThanOrEqual(150);
    expect(lessons.length).toBeGreaterThanOrEqual(12);
    expect(grammar.length).toBeGreaterThanOrEqual(10);
    expect(dialogues.length).toBeGreaterThanOrEqual(10);
    expect(emails.length).toBeGreaterThanOrEqual(8);
    expect(speakingTasks.length).toBeGreaterThanOrEqual(10);
    expect(listeningItems.length).toBeGreaterThanOrEqual(6);
    expect(placement).toHaveLength(12);
  });

  it('has unique, stable IDs', () => {
    const all = [
      ...builtInCards.map((c) => c.id),
      ...lessons.map((x) => x.id),
      ...grammar.map((x) => x.id),
      ...dialogues.map((x) => x.id),
      ...emails.map((x) => x.id),
      ...speakingTasks.map((x) => x.id),
      ...listeningItems.map((x) => x.id),
    ];
    expect(new Set(all).size).toBe(all.length);
    for (const c of builtInCards) expect(c.id).toMatch(/^v-[a-z0-9-]+$/);
  });

  it('cards have all required fields and cover every level', () => {
    for (const c of builtInCards) {
      expect(c.en && c.pl && c.def && c.note, c.id).toBeTruthy();
      expect(c.examples.length, c.id).toBeGreaterThan(0);
      expect(c.collocations.length, c.id).toBeGreaterThan(0);
    }
    for (const l of ['A2', 'B1', 'B2'] as const) expect(builtInCards.filter((c) => c.level === l).length).toBeGreaterThanOrEqual(40);
  });

  it('references only existing cards', () => {
    for (const l of lessons) for (const id of l.cardIds) expect(cardById.has(id), `${l.id} → ${id}`).toBe(true);
    for (const d of dialogues) for (const id of d.cardIds) expect(cardById.has(id), `${d.id} → ${id}`).toBe(true);
  });

  it('exercises are well formed', () => {
    for (const l of lessons) {
      checkExercises(l.id, l.comprehension);
      checkExercises(l.id, l.exercises);
    }
    for (const g of grammar) checkExercises(g.id, g.exercises);
    for (const d of dialogues) {
      checkExercises(d.id, d.questions);
      for (const c of d.choose) expect(c.answer).toBeLessThan(c.options.length);
      expect(d.lines.some((x) => x.s === d.learner)).toBe(true);
    }
    for (const li of listeningItems) checkExercises(li.id, li.questions);
    for (const p of placement) expect(p.answer).toBeLessThan(p.options.length);
  });

  it('model answers satisfy their own required elements', () => {
    for (const e of emails) {
      const fb = evaluateText(`${e.model.subject}\n${e.model.body}`, e.required);
      expect(fb.elements.filter((x) => !x.found).map((x) => x.label), e.id).toEqual([]);
    }
    for (const s of speakingTasks) {
      const fb = evaluateText(s.model, s.required);
      expect(fb.elements.filter((x) => !x.found).map((x) => x.label), s.id).toEqual([]);
    }
  });

  it('maps placement scores to a level', () => {
    expect(placementLevel({ A2: 4, B1: 4, B2: 4 })).toBe('B2');
    expect(placementLevel({ A2: 4, B1: 3, B2: 1 })).toBe('B1');
    expect(placementLevel({ A2: 2, B1: 4, B2: 4 })).toBe('A2');
  });
});
