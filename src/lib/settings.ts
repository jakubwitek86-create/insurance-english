import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Level } from '../types';

export type Direction = 'en-pl' | 'pl-en' | 'mixed';
export type SessionMode = 10 | 15 | 20;

export interface Settings {
  newPerDay: number;
  direction: Direction;
  typedAnswer: boolean;
  explainLang: 'pl' | 'en';
  voiceURI: string;
  rate: number;
  startLevel: Level;
  placementDone: boolean;
  lastBackup: number; // ms timestamp, 0 = never
  sessionMode: SessionMode;
  theme: 'auto' | 'light' | 'dark';
}

export const DEFAULT_SETTINGS: Settings = {
  newPerDay: 10,
  direction: 'mixed',
  typedAnswer: false,
  explainLang: 'pl',
  voiceURI: '',
  rate: 0.95,
  startLevel: 'A2',
  placementDone: false,
  lastBackup: 0,
  sessionMode: 15,
  theme: 'auto',
};

export async function getSettings(): Promise<Settings> {
  const rows = await db.settings.toArray();
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const r of rows) if (r.key in DEFAULT_SETTINGS) out[r.key] = r.value;
  return out as unknown as Settings;
}

export async function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  await db.settings.put({ key, value });
}

export function useSettings(): Settings {
  return useLiveQuery(getSettings, [], DEFAULT_SETTINGS) ?? DEFAULT_SETTINGS;
}
