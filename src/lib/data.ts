import { useLiveQuery } from 'dexie-react-hooks';
import { db, type CardState, type ExerciseResult, type ReviewLog } from '../db/db';
import { lessons, grammar, dialogues, emails, speakingTasks, listeningItems } from '../content';

export interface LearningData {
  loaded: boolean;
  states: CardState[];
  reviews: ReviewLog[];
  results: ExerciseResult[];
}

export function useLearningData(): LearningData {
  const states = useLiveQuery(() => db.cardStates.toArray(), []);
  const reviews = useLiveQuery(() => db.reviews.toArray(), []);
  const results = useLiveQuery(() => db.results.toArray(), []);
  return {
    loaded: states !== undefined && reviews !== undefined && results !== undefined,
    states: states ?? [],
    reviews: reviews ?? [],
    results: results ?? [],
  };
}

const TITLES = new Map<string, string>([
  ...lessons.map((x) => [`lesson:${x.id}`, `Lekcja: ${x.titlePl}`] as [string, string]),
  ...grammar.map((x) => [`grammar:${x.id}`, `Gramatyka: ${x.title}`] as [string, string]),
  ...dialogues.map((x) => [`dialogue:${x.id}`, `Rozmowa: ${x.titlePl}`] as [string, string]),
  ...emails.map((x) => [`email:${x.id}`, `E-mail: ${x.titlePl}`] as [string, string]),
  ...speakingTasks.map((x) => [`speaking:${x.id}`, `Mówienie: ${x.title}`] as [string, string]),
  ...listeningItems.map((x) => [`listening:${x.id}`, `Słuchanie: ${x.title}`] as [string, string]),
  ['placement:placement', 'Test poziomujący'],
]);

export function resultTitle(kind: string, itemId: string): string {
  return TITLES.get(`${kind}:${itemId}`) ?? `${kind}: ${itemId}`;
}
