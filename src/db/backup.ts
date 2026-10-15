import { db, SCHEMA_VERSION, USER_TABLES, type UserTable } from './db';
import type { Card } from '../types';

export const BACKUP_APP_ID = 'insurance-english';

export interface Backup {
  app: string;
  schemaVersion: number;
  exportedAt: string;
  tables: Record<UserTable, unknown[]>;
}

export async function exportAll(): Promise<Backup> {
  const tables = {} as Record<UserTable, unknown[]>;
  await db.transaction('r', USER_TABLES.map((t) => db.table(t)), async () => {
    for (const t of USER_TABLES) tables[t] = await db.table(t).toArray();
  });
  return {
    app: BACKUP_APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    tables,
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Returns a list of problems; empty list means the backup can be imported. */
export function validateBackup(data: unknown): string[] {
  const errors: string[] = [];
  if (!isObj(data)) return ['Plik nie zawiera obiektu JSON.'];
  if (data.app !== BACKUP_APP_ID) errors.push('To nie jest kopia zapasowa tej aplikacji.');
  if (typeof data.schemaVersion !== 'number') errors.push('Brak wersji schematu.');
  else if (data.schemaVersion > SCHEMA_VERSION)
    errors.push(`Kopia pochodzi z nowszej wersji aplikacji (schemat ${data.schemaVersion}). Zaktualizuj aplikację.`);
  if (!isObj(data.tables)) {
    errors.push('Brak sekcji "tables".');
    return errors;
  }
  const tables = data.tables;
  for (const t of USER_TABLES) {
    if (t === 'transcripts' && tables[t] === undefined) continue; // added in schema v2
    if (!Array.isArray(tables[t])) errors.push(`Tabela "${t}" ma niepoprawny format.`);
  }
  const states = tables.cardStates;
  if (Array.isArray(states)) {
    states.forEach((s, i) => {
      if (!isObj(s) || typeof s.cardId !== 'string' || typeof s.due !== 'number' || typeof s.ease !== 'number')
        errors.push(`cardStates[${i}] jest uszkodzony.`);
    });
  }
  const custom = tables.customCards;
  if (Array.isArray(custom)) {
    custom.forEach((c, i) => {
      if (!isObj(c) || typeof c.id !== 'string' || typeof c.en !== 'string' || typeof c.pl !== 'string')
        errors.push(`customCards[${i}] jest uszkodzona.`);
    });
  }
  return errors.slice(0, 20);
}

/** Replaces all user data with the backup contents (single transaction: all or nothing). */
export async function importAll(data: Backup): Promise<void> {
  const errors = validateBackup(data);
  if (errors.length) throw new Error(errors.join('\n'));
  await db.transaction('rw', USER_TABLES.map((t) => db.table(t)), async () => {
    for (const t of USER_TABLES) {
      await db.table(t).clear();
      const rows = (data.tables[t] ?? []) as object[];
      if (t === 'cardStates') {
        for (const r of rows as Record<string, unknown>[]) if (typeof r.lapses !== 'number') r.lapses = 0;
      }
      if (rows.length) await db.table(t).bulkAdd(rows);
    }
  });
}

export function downloadJson(obj: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export interface CustomCardsFile {
  app: string;
  kind: 'custom-cards';
  cards: Card[];
}

export function validateCustomCards(data: unknown): { cards: Card[]; errors: string[] } {
  if (!isObj(data) || data.kind !== 'custom-cards' || !Array.isArray(data.cards))
    return { cards: [], errors: ['To nie jest plik z własnymi fiszkami.'] };
  const errors: string[] = [];
  const cards: Card[] = [];
  data.cards.forEach((c, i) => {
    if (!isObj(c) || typeof c.en !== 'string' || typeof c.pl !== 'string' || !c.en.trim()) {
      errors.push(`Fiszka ${i + 1} nie ma pól "en" i "pl".`);
      return;
    }
    cards.push({
      id: typeof c.id === 'string' && c.id.startsWith('c-') ? c.id : `c-${crypto.randomUUID()}`,
      en: c.en,
      pl: c.pl,
      def: typeof c.def === 'string' ? c.def : '',
      level: c.level === 'A2' || c.level === 'B1' || c.level === 'B2' ? c.level : 'B1',
      topic: 'communication',
      examples: Array.isArray(c.examples) ? (c.examples as Card['examples']) : [],
      collocations: Array.isArray(c.collocations) ? (c.collocations as string[]) : [],
      note: typeof c.note === 'string' ? c.note : '',
      custom: true,
    });
  });
  return { cards, errors };
}
