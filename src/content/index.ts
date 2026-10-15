import type { Card, Level } from '../types';
import { cardsA2 } from './cards-a2';
import { cardsB1 } from './cards-b1';
import { cardsB2 } from './cards-b2';
import { lessons } from './lessons';
import { grammar } from './grammar';
import { dialogues } from './dialogues';
import { emails } from './emails';
import { speakingTasks } from './speaking';
import { listeningItems, placement } from './listening';
import type { TaskItem } from '../lib/session';

export const CONTENT_VERSION = '1.0.0';

export const builtInCards: Card[] = [...cardsA2, ...cardsB1, ...cardsB2];
export const cardById = new Map(builtInCards.map((c) => [c.id, c]));

export { lessons, grammar, dialogues, emails, speakingTasks, listeningItems, placement };

/** Items the session planner can choose as a contextual task. */
export const taskItems: TaskItem[] = [
  ...lessons.map((l) => ({ kind: 'lesson' as const, id: l.id, title: l.titlePl, level: l.level })),
  ...dialogues.map((d) => ({ kind: 'dialogue' as const, id: d.id, title: d.titlePl, level: d.level })),
  ...emails.map((e) => ({ kind: 'email' as const, id: e.id, title: e.titlePl, level: e.level })),
  ...grammar.map((g) => ({ kind: 'grammar' as const, id: g.id, title: g.title, level: g.level })),
];

export function taskPath(kind: string, id: string): string {
  const base: Record<string, string> = {
    lesson: '/lessons/',
    dialogue: '/dialogues/',
    email: '/emails/',
    grammar: '/grammar/',
    speaking: '/speaking/',
    listening: '/listening/',
  };
  return `${base[kind] ?? '/'}${id}`;
}

export function placementLevel(correctByLevel: Record<Level, number>): Level {
  if (correctByLevel.A2 >= 3 && correctByLevel.B1 >= 3 && correctByLevel.B2 >= 3) return 'B2';
  if (correctByLevel.A2 >= 3 && correctByLevel.B1 >= 3) return 'B1';
  return 'A2';
}
