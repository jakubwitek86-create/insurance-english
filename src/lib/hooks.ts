import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type ResultKind } from '../db/db';
import type { Card, Level } from '../types';
import { builtInCards } from '../content';
import { dayIndex } from './day';

export function useOnline(): boolean {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function useToday(): number {
  const [today, setToday] = useState(dayIndex());
  useEffect(() => {
    const t = setInterval(() => setToday(dayIndex()), 60_000);
    return () => clearInterval(t);
  }, []);
  return today;
}

/** Built-in cards plus the learner's own cards. */
export function useAllCards(): Card[] {
  const custom = useLiveQuery(() => db.customCards.toArray(), [], [] as Card[]) ?? [];
  return [...custom.map((c) => ({ ...c, custom: true })), ...builtInCards];
}

export async function recordResult(kind: ResultKind, itemId: string, level: Level, score: number, detail?: string) {
  const ts = Date.now();
  await db.results.add({ kind, itemId, level, score: Math.max(0, Math.min(1, score)), ts, day: dayIndex(ts), detail });
}

/** Best score per item of one kind, e.g. to show ticks on lists. */
export function useBestScores(kind: ResultKind): Map<string, number> {
  const rows = useLiveQuery(() => db.results.where('kind').equals(kind).toArray(), [kind], []) ?? [];
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.itemId, Math.max(m.get(r.itemId) ?? 0, r.score));
  return m;
}
