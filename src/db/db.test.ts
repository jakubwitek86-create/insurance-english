import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { AppDB, setDb, SCHEMA_VERSION } from './db';
import { exportAll, importAll, validateBackup, validateCustomCards, type Backup } from './backup';
import { getSettings, setSetting } from '../lib/settings';
import { newState, review } from '../lib/srs';

let n = 0;
const fresh = () => {
  const d = new AppDB(`test-${++n}`);
  setDb(d);
  return d;
};

afterEach(async () => {
  // nothing: each test uses its own database name
});

describe('persistence', () => {
  it('keeps card states after the database is closed and reopened', async () => {
    const name = `persist-${++n}`;
    const a = new AppDB(name);
    const s = review(newState('v-policy', 100), 4, 100);
    await a.cardStates.put(s);
    await a.reviews.add({ cardId: 'v-policy', ts: 1, day: 100, grade: 4, intervalAfter: s.interval });
    a.close();

    const b = new AppDB(name);
    const back = await b.cardStates.get('v-policy');
    expect(back?.interval).toBe(1);
    expect(back?.due).toBe(101);
    expect(await b.reviews.count()).toBe(1);
    b.close();
  });

  it('migrates v1 data to v2 (adds lapses)', async () => {
    const name = `migrate-${++n}`;
    const { default: Dexie } = await import('dexie');
    const v1 = new Dexie(name);
    v1.version(1).stores({
      cardStates: 'cardId, due',
      reviews: '++id, cardId, day',
      results: '++id, kind, itemId, day',
      customCards: 'id',
      favourites: 'cardId',
      drafts: 'emailId',
      settings: 'key',
    });
    await v1.table('cardStates').put({ cardId: 'v-old', due: 1, interval: 1, ease: 2.5, reps: 1, lastReviewed: 0, introducedDay: 0 });
    v1.close();

    const v2 = new AppDB(name);
    const s = await v2.cardStates.get('v-old');
    expect(s?.lapses).toBe(0);
    expect(v2.verno).toBe(SCHEMA_VERSION);
    expect(await v2.transcripts.count()).toBe(0);
    v2.close();
  });

  it('stores settings with defaults', async () => {
    fresh();
    expect((await getSettings()).newPerDay).toBe(10);
    await setSetting('newPerDay', 15);
    expect((await getSettings()).newPerDay).toBe(15);
  });
});

describe('backup export / import', () => {
  it('round-trips all user data', async () => {
    const d = fresh();
    await d.cardStates.put(newState('v-premium', 50));
    await d.results.add({ kind: 'lesson', itemId: 'l01', level: 'A2', score: 0.8, ts: 1, day: 50 });
    await d.customCards.put({ id: 'c-1', en: 'loss run', pl: 'zestawienie szkód', def: '', level: 'B1', topic: 'claims', examples: [], collocations: [], note: '', custom: true });
    await d.drafts.put({ emailId: 'e01', subject: 'S', body: 'Body ąęł', updatedAt: 1 });
    await d.transcripts.add({ taskId: 's01', text: 'hello', score: 0.5, missing: [], ts: 1 });
    await setSetting('startLevel', 'B1');

    const backup = await exportAll();
    expect(validateBackup(backup)).toEqual([]);
    const json = JSON.parse(JSON.stringify(backup)) as Backup;

    const d2 = fresh();
    await importAll(json);
    expect(await d2.cardStates.count()).toBe(1);
    expect((await d2.drafts.get('e01'))?.body).toBe('Body ąęł');
    expect((await d2.customCards.get('c-1'))?.en).toBe('loss run');
    expect(await d2.transcripts.count()).toBe(1);
    expect((await getSettings()).startLevel).toBe('B1');
  });

  it('rejects invalid backups without touching data', async () => {
    const d = fresh();
    await d.cardStates.put(newState('keep-me', 1));
    expect(validateBackup({ foo: 1 }).length).toBeGreaterThan(0);
    expect(validateBackup({ app: 'insurance-english', schemaVersion: 99, tables: {} }).join(' ')).toMatch(/nowszej/);
    const broken = { app: 'insurance-english', schemaVersion: 2, exportedAt: '', tables: { cardStates: [{ nope: 1 }] } };
    await expect(importAll(broken as unknown as Backup)).rejects.toThrow();
    expect(await d.cardStates.get('keep-me')).toBeTruthy();
  });

  it('accepts v1 backups without the transcripts table', () => {
    const tables = { cardStates: [], reviews: [], results: [], customCards: [], favourites: [], drafts: [], settings: [] };
    expect(validateBackup({ app: 'insurance-english', schemaVersion: 1, exportedAt: '', tables })).toEqual([]);
  });

  it('validates custom card files', () => {
    const ok = validateCustomCards({ app: 'insurance-english', kind: 'custom-cards', cards: [{ en: 'a', pl: 'b' }, { en: '' }] });
    expect(ok.cards).toHaveLength(1);
    expect(ok.cards[0].id.startsWith('c-')).toBe(true);
    expect(ok.errors).toHaveLength(1);
  });
});
