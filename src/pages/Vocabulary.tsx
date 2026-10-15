import { useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Card, Level, Topic } from '../types';
import { LEVELS, TOPIC_LABELS } from '../types';
import { useAllCards } from '../lib/hooks';
import { normalize } from '../lib/feedback';
import { vocabularyPdf, pdfFilename } from '../lib/exports';
import { downloadJson, validateCustomCards, BACKUP_APP_ID } from '../db/backup';
import { CardBack } from '../components/Review';
import { ConfirmButton, Empty, LevelTag, PageHeader, SpeakBtn, useToast } from '../components/ui';

const EMPTY_FORM = { en: '', pl: '', def: '', example: '', examplePl: '', note: '', level: 'B1' as Level };

function CustomCardForm({ initial, onDone }: { initial?: Card; onDone: () => void }) {
  const [f, setF] = useState(
    initial
      ? {
          en: initial.en,
          pl: initial.pl,
          def: initial.def,
          example: initial.examples[0]?.en ?? '',
          examplePl: initial.examples[0]?.pl ?? '',
          note: initial.note,
          level: initial.level,
        }
      : EMPTY_FORM,
  );
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const card: Card = {
      id: initial?.id ?? `c-${crypto.randomUUID()}`,
      en: f.en.trim(),
      pl: f.pl.trim(),
      def: f.def.trim(),
      level: f.level,
      topic: 'communication',
      examples: f.example.trim() ? [{ en: f.example.trim(), pl: f.examplePl.trim() }] : [],
      collocations: [],
      note: f.note.trim(),
      custom: true,
    };
    await db.customCards.put(card);
    onDone();
  };

  return (
    <form className="card" onSubmit={save}>
      <h3>{initial ? 'Edytuj fiszkę' : 'Nowa fiszka'}</h3>
      <label className="field">
        <span>Po angielsku *</span>
        <input required value={f.en} onChange={set('en')} autoCapitalize="off" />
      </label>
      <label className="field">
        <span>Po polsku *</span>
        <input required value={f.pl} onChange={set('pl')} />
      </label>
      <label className="field">
        <span>Definicja (EN)</span>
        <input value={f.def} onChange={set('def')} />
      </label>
      <label className="field">
        <span>Przykład (EN)</span>
        <input value={f.example} onChange={set('example')} />
      </label>
      <label className="field">
        <span>Tłumaczenie przykładu</span>
        <input value={f.examplePl} onChange={set('examplePl')} />
      </label>
      <label className="field">
        <span>Notatka</span>
        <input value={f.note} onChange={set('note')} />
      </label>
      <label className="field">
        <span>Poziom</span>
        <select value={f.level} onChange={set('level')}>
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>
      <div className="row">
        <button className="btn" type="submit">
          Zapisz
        </button>
        <button className="btn ghost" type="button" onClick={onDone}>
          Anuluj
        </button>
      </div>
    </form>
  );
}

export function VocabularyPage() {
  const cards = useAllCards();
  const favs = useLiveQuery(() => db.favourites.toArray(), [], []) ?? [];
  const states = useLiveQuery(() => db.cardStates.toArray(), [], []) ?? [];
  const favSet = new Set(favs.map((f) => f.cardId));
  const seen = new Set(states.map((s) => s.cardId));
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [only, setOnly] = useState<'all' | 'fav' | 'custom' | 'seen'>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<Card | 'new' | null>(null);
  const [limit, setLimit] = useState(40);
  const [toast, showToast] = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return cards.filter((c) => {
      if (level !== 'all' && c.level !== level) return false;
      if (topic !== 'all' && (c.custom || c.topic !== topic)) return false;
      if (only === 'fav' && !favSet.has(c.id)) return false;
      if (only === 'custom' && !c.custom) return false;
      if (only === 'seen' && !seen.has(c.id)) return false;
      if (nq && !normalize(`${c.en} ${c.pl}`).includes(nq)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, q, level, topic, only, favs, states]);

  const exportPdf = async () => {
    try {
      const w = await vocabularyPdf(filtered, 'Słownictwo: Insurance English');
      w.save(pdfFilename('slownictwo'));
    } catch (e) {
      showToast(`Nie udało się utworzyć PDF: ${(e as Error).message}`);
    }
  };

  const exportCustom = async () => {
    const custom = await db.customCards.toArray();
    if (!custom.length) return showToast('Nie masz jeszcze własnych fiszek.');
    downloadJson({ app: BACKUP_APP_ID, kind: 'custom-cards', cards: custom }, `moje-fiszki-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const importCustom = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      const { cards: imported, errors } = validateCustomCards(data);
      if (imported.length) await db.customCards.bulkPut(imported);
      showToast(`Zaimportowano ${imported.length} fiszek${errors.length ? `, pominięto ${errors.length}` : ''}.`);
    } catch {
      showToast('Plik nie jest poprawnym JSON-em.');
    }
  };

  return (
    <div>
      <PageHeader title="Słownik" back="/cards">
        <p className="small muted">{cards.length} haseł. Stuknij hasło, aby zobaczyć szczegóły.</p>
      </PageHeader>

      {editing && <CustomCardForm initial={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />}

      <div className="card flat">
        <label className="field">
          <span>Szukaj (EN lub PL)</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="np. excess, szkoda" />
        </label>
        <div className="grid2">
          <label className="field">
            <span>Poziom</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')}>
              <option value="all">Wszystkie</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Temat</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value as Topic | 'all')}>
              <option value="all">Wszystkie</option>
              {Object.entries(TOPIC_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="seg" role="group" aria-label="Filtr">
          {(
            [
              ['all', 'Wszystkie'],
              ['seen', 'Poznane'],
              ['fav', '★ Ulubione'],
              ['custom', 'Moje'],
            ] as const
          ).map(([k, v]) => (
            <button key={k} aria-pressed={only === k} onClick={() => setOnly(k)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn sm" onClick={() => setEditing('new')}>
          + Własna fiszka
        </button>
        <button className="btn secondary sm" onClick={exportPdf} disabled={!filtered.length}>
          PDF ({filtered.length})
        </button>
        <button className="btn secondary sm" onClick={exportCustom}>
          Eksport moich
        </button>
        <button className="btn secondary sm" onClick={() => fileRef.current?.click()}>
          Import moich
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Plik z fiszkami"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importCustom(f);
            e.target.value = '';
          }}
        />
      </div>

      {!filtered.length && <Empty icon="⌕">Nic nie pasuje do filtrów.</Empty>}

      {filtered.slice(0, limit).map((c) => (
        <div key={c.id} className="card flat" style={{ padding: 0 }}>
          <button
            type="button"
            className="listlink"
            style={{ border: 0, margin: 0, width: '100%', font: 'inherit', textAlign: 'left', background: 'transparent' }}
            aria-expanded={open === c.id}
            onClick={() => setOpen(open === c.id ? null : c.id)}
          >
            <span className="grow">
              <span className="title">
                {favSet.has(c.id) ? '★ ' : ''}
                {c.en}
              </span>
              <br />
              <span className="sub">{c.pl}</span>
            </span>
            {c.custom ? <span className="chip">moja</span> : <LevelTag level={c.level} />}
          </button>
          {open === c.id && (
            <div style={{ padding: '0 16px 16px' }}>
              <div className="row">
                <SpeakBtn text={c.en} label="Wymowa" />
                <SpeakBtn text={c.en} slow />
                {c.custom && (
                  <>
                    <button className="btn secondary sm" onClick={() => setEditing(c)}>
                      Edytuj
                    </button>
                    <ConfirmButton
                      className="btn ghost sm"
                      label="Usuń"
                      question="Usunąć tę fiszkę i jej historię powtórek?"
                      onConfirm={async () => {
                        await db.customCards.delete(c.id);
                        await db.cardStates.delete(c.id);
                      }}
                    />
                  </>
                )}
              </div>
              <CardBack card={c} />
            </div>
          )}
        </div>
      ))}
      {filtered.length > limit && (
        <button className="btn secondary block" onClick={() => setLimit((l) => l + 60)}>
          Pokaż więcej ({filtered.length - limit})
        </button>
      )}
      {toast}
    </div>
  );
}
