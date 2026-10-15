import Dexie, { type Table } from 'dexie';
import type { Card, Level } from '../types';

export interface CardState {
  cardId: string;
  due: number; // local day index
  interval: number; // days
  ease: number;
  reps: number;
  lapses: number;
  lastReviewed: number; // day index
  introducedDay: number;
}

export interface ReviewLog {
  id?: number;
  cardId: string;
  ts: number;
  day: number;
  grade: number;
  intervalAfter: number;
}

export type ResultKind = 'lesson' | 'grammar' | 'dialogue' | 'email' | 'speaking' | 'listening' | 'placement';

export interface ExerciseResult {
  id?: number;
  kind: ResultKind;
  itemId: string;
  level: Level;
  score: number; // 0..1
  ts: number;
  day: number;
  detail?: string;
}

export interface Draft {
  emailId: string;
  subject: string;
  body: string;
  updatedAt: number;
}

export interface Transcript {
  id?: number;
  taskId: string;
  text: string;
  score: number;
  missing: string[];
  ts: number;
}

export interface Favourite {
  cardId: string;
}

export interface SettingRow {
  key: string;
  value: unknown;
}

export const DB_NAME = 'insurance-english';
export const SCHEMA_VERSION = 2;

export class AppDB extends Dexie {
  cardStates!: Table<CardState, string>;
  reviews!: Table<ReviewLog, number>;
  results!: Table<ExerciseResult, number>;
  customCards!: Table<Card, string>;
  favourites!: Table<Favourite, string>;
  drafts!: Table<Draft, string>;
  transcripts!: Table<Transcript, number>;
  settings!: Table<SettingRow, string>;

  constructor(name = DB_NAME) {
    super(name);
    // v1: initial schema
    this.version(1).stores({
      cardStates: 'cardId, due',
      reviews: '++id, cardId, day',
      results: '++id, kind, itemId, day',
      customCards: 'id',
      favourites: 'cardId',
      drafts: 'emailId',
      settings: 'key',
    });
    // v2: speaking transcripts + lapse counter on card states
    this.version(2)
      .stores({ transcripts: '++id, taskId, ts' })
      .upgrade(async (tx) => {
        await tx
          .table('cardStates')
          .toCollection()
          .modify((s: Partial<CardState>) => {
            if (typeof s.lapses !== 'number') s.lapses = 0;
          });
      });
  }
}

export let db = new AppDB();

/** Test helper: swap the database instance. */
export function setDb(next: AppDB) {
  db = next;
}

export const USER_TABLES = [
  'cardStates',
  'reviews',
  'results',
  'customCards',
  'favourites',
  'drafts',
  'transcripts',
  'settings',
] as const;
export type UserTable = (typeof USER_TABLES)[number];
