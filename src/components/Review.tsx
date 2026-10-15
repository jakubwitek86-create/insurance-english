import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Card } from '../types';
import { TOPIC_LABELS } from '../types';
import { review, newState, previewIntervals, type Grade, GRADE_LABELS } from '../lib/srs';
import { useSettings } from '../lib/settings';
import { useAllCards } from '../lib/hooks';
import { dayIndex } from '../lib/day';
import { checkGap } from '../lib/feedback';
import { LevelTag, SpeakBtn } from './ui';

export interface ReviewStats {
  reviewed: number;
  again: number;
}

const fmtInterval = (d: number) => (d <= 1 ? '1 dzień' : d < 30 ? `${d} dni` : `${Math.round(d / 30)} mies.`);

/** Accepted typed answers: "excess (deductible)" → excess, deductible; "a / b" → a, b. */
export function acceptedAnswers(en: string): string[] {
  const out = new Set<string>([en]);
  const noParens = en.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  out.add(noParens);
  for (const m of en.matchAll(/\(([^)]*)\)/g)) out.add(m[1]);
  for (const part of noParens.split('/')) out.add(part.trim());
  return Array.from(out).filter(Boolean);
}

export function CardBack({ card }: { card: Card }) {
  const s = useSettings();
  const fav = useLiveQuery(() => db.favourites.get(card.id), [card.id]);
  const def = card.def && (
    <p>
      <strong>Definition:</strong> {card.def}
    </p>
  );
  const note = (card.note || card.plNote) && (
    <p className="small">
      <strong>Uwaga:</strong> {card.plNote ? `${card.plNote} ` : ''}
      {card.note}
    </p>
  );
  return (
    <div className="back">
      <div className="row between">
        <div className="row">
          <LevelTag level={card.level} />
          <span className="chip">{card.custom ? 'Moja fiszka' : TOPIC_LABELS[card.topic]}</span>
          {card.needsReview && <span className="chip" title="Termin do weryfikacji">⚑ do weryfikacji</span>}
        </div>
        <button
          type="button"
          className="btn ghost sm"
          aria-pressed={!!fav}
          aria-label={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          onClick={() => (fav ? db.favourites.delete(card.id) : db.favourites.put({ cardId: card.id }))}
        >
          {fav ? '★' : '☆'}
        </button>
      </div>
      {s.explainLang === 'en' ? (
        <>
          {def}
          {note}
        </>
      ) : (
        <>
          {note}
          {def}
        </>
      )}
      {card.examples.map((e, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
            <span style={{ flex: 1 }}>„{e.en}”</span>
            <SpeakBtn text={e.en} />
          </div>
          <div className="pl">{e.pl}</div>
        </div>
      ))}
      {card.collocations.length > 0 && (
        <p className="small muted">
          <strong>Kolokacje:</strong> {card.collocations.join(' · ')}
        </p>
      )}
    </div>
  );
}

export function Review({ queue, onFinish }: { queue: string[]; onFinish: (s: ReviewStats) => void }) {
  const settings = useSettings();
  const all = useAllCards();
  const byId = useMemo(() => new Map(all.map((c) => [c.id, c])), [all]);
  const [order, setOrder] = useState<string[]>(queue);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState('');
  const [typedOk, setTypedOk] = useState<boolean | null>(null);
  const [stats, setStats] = useState<ReviewStats>({ reviewed: 0, again: 0 });

  const id = order[pos];
  const card = id ? byId.get(id) : undefined;
  const state = useLiveQuery(() => (id ? db.cardStates.get(id) : undefined), [id]);
  const today = dayIndex();

  const direction = useMemo(() => {
    if (settings.direction !== 'mixed') return settings.direction;
    return Math.random() < 0.5 ? 'en-pl' : 'pl-en';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pos, settings.direction]);

  const intervals = previewIntervals(state ?? newState(id ?? '', today), today);

  useEffect(() => {
    if (!id && order.length) onFinish(stats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const grade = async (g: Grade) => {
    if (!card) return;
    const now = Date.now();
    const d = dayIndex(now);
    const current = (await db.cardStates.get(card.id)) ?? newState(card.id, d);
    const next = review(current, g, d);
    await db.transaction('rw', db.cardStates, db.reviews, async () => {
      await db.cardStates.put(next);
      await db.reviews.add({ cardId: card.id, ts: now, day: d, grade: g, intervalAfter: next.interval });
    });
    if (g === 0 && !requeued.has(card.id)) {
      setOrder((o) => [...o, card.id]);
      setRequeued((r) => new Set(r).add(card.id));
    }
    setStats((s) => ({ reviewed: s.reviewed + 1, again: s.again + (g === 0 ? 1 : 0) }));
    setRevealed(false);
    setTyped('');
    setTypedOk(null);
    setPos((p) => p + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
        grade(([0, 3, 4, 5] as Grade[])[Number(e.key) - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!order.length) return null;
  if (!card) {
    if (id) return <p className="muted">Wczytywanie…</p>;
    return null;
  }

  const typedMode = settings.typedAnswer && direction === 'pl-en';
  const remaining = order.length - pos;

  return (
    <div>
      <div className="row between small muted" style={{ marginBottom: 8 }}>
        <span>
          Karta {pos + 1} z {order.length}
        </span>
        <span>{!state ? 'Nowa' : `Pozostało: ${remaining}`}</span>
      </div>
      <div className="card flash" aria-live="polite">
        {direction === 'en-pl' ? (
          <>
            <div className="term">{card.en}</div>
            <div className="row" style={{ justifyContent: 'center' }}>
              <SpeakBtn text={card.en} />
            </div>
            {revealed && <div style={{ fontSize: '1.2rem', marginTop: 12 }}>{card.pl}</div>}
          </>
        ) : (
          <>
            <div className="small muted">Jak to powiesz po angielsku?</div>
            <div className="term" style={{ fontFamily: 'var(--font)', fontSize: '1.35rem' }}>
              {card.pl}
            </div>
            {typedMode && !revealed && (
              <form
                className="row"
                style={{ justifyContent: 'center', marginTop: 8 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setTypedOk(checkGap(typed, acceptedAnswers(card.en)));
                  setRevealed(true);
                }}
              >
                <input
                  type="text"
                  aria-label="Wpisz odpowiedź po angielsku"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="off"
                  spellCheck={false}
                  style={{ maxWidth: 280 }}
                />
                <button className="btn sm" type="submit">
                  Sprawdź
                </button>
              </form>
            )}
            {revealed && (
              <>
                {typedOk !== null && (
                  <div className={`fb ${typedOk ? 'ok' : 'no'}`} style={{ margin: '10px auto 0' }}>
                    {typedOk ? '✓ Poprawnie' : `✗ Twoja odpowiedź: „${typed || '—'}”`}
                  </div>
                )}
                <div className="term" style={{ marginTop: 12 }}>
                  {card.en}
                </div>
                <div className="row" style={{ justifyContent: 'center' }}>
                  <SpeakBtn text={card.en} />
                </div>
              </>
            )}
          </>
        )}
        {revealed && <CardBack card={card} />}
      </div>

      {!revealed ? (
        <button className="btn block" onClick={() => setRevealed(true)}>
          Pokaż odpowiedź
        </button>
      ) : (
        <div className="grades" role="group" aria-label="Jak dobrze pamiętasz?">
          {([0, 3, 4, 5] as Grade[]).map((g) => (
            <button key={g} className={`g${g}`} onClick={() => grade(g)}>
              {GRADE_LABELS[g]}
              <small>{g === 0 ? 'w tej sesji' : fmtInterval(intervals[g])}</small>
            </button>
          ))}
        </div>
      )}
      <p className="tiny" style={{ marginTop: 10 }}>
        Powtórki planuje algorytm SM-2 (regułowy, bez AI). „Nie pamiętam” wraca jeszcze raz na końcu tej sesji.
      </p>
    </div>
  );
}
