import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db/db';
import { useAllCards, useToday } from '../lib/hooks';
import { getSettings } from '../lib/settings';
import { dueCards, newAllowance, newCardQueue } from '../lib/session';
import { useLearningData } from '../lib/data';
import { Review } from '../components/Review';
import { Empty, PageHeader } from '../components/ui';

type Mode = 'due' | 'new' | 'weak' | 'favourites';

export function FlashcardsPage() {
  const cards = useAllCards();
  const today = useToday();
  const { loaded, states } = useLearningData();
  const [queue, setQueue] = useState<string[] | null>(null);
  const [finished, setFinished] = useState<string | null>(null);

  const due = dueCards(states, today);
  const weak = states.filter((s) => s.lapses > 0).sort((a, b) => b.lapses - a.lapses);

  const start = async (mode: Mode) => {
    const s = await getSettings();
    const st = await db.cardStates.toArray();
    let q: string[] = [];
    if (mode === 'due') q = dueCards(st, today).map((x) => x.cardId);
    if (mode === 'new') q = newCardQueue(cards, st, s.startLevel).slice(0, newAllowance(st, s.newPerDay, today)).map((c) => c.id);
    if (mode === 'weak') q = st.filter((x) => x.lapses > 0).sort((a, b) => b.lapses - a.lapses).slice(0, 20).map((x) => x.cardId);
    if (mode === 'favourites') q = (await db.favourites.toArray()).map((f) => f.cardId);
    setFinished(null);
    setQueue(q);
  };

  if (queue && queue.length)
    return (
      <div>
        <PageHeader title="Fiszki" />
        <Review
          key={queue.join(',')}
          queue={queue}
          onFinish={(s) => {
            setQueue(null);
            setFinished(`Gotowe: ${s.reviewed} odpowiedzi${s.again ? `, w tym ${s.again} „Nie pamiętam”` : ''}.`);
          }}
        />
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => setQueue(null)}>
          Przerwij
        </button>
      </div>
    );

  return (
    <div>
      <PageHeader title="Fiszki">
        <p className="muted small">Powtórki według algorytmu SM-2. Postęp zapisuje się po każdej karcie.</p>
      </PageHeader>
      {finished && <div className="notice good">{finished}</div>}
      {queue && queue.length === 0 && (
        <div className="notice info">Brak kart w tym trybie. Wybierz inny albo dodaj karty do ulubionych w słowniku.</div>
      )}
      {!loaded ? (
        <p className="muted">Wczytywanie…</p>
      ) : (
        <div className="stack">
          <button className="listlink" style={{ width: '100%', font: 'inherit', textAlign: 'left' }} onClick={() => start('due')} disabled={!due.length}>
            <span className="grow">
              <span className="title">Powtórki na dziś</span>
              <br />
              <span className="sub">{due.length ? `${due.length} kart czeka` : 'Wszystko powtórzone'}</span>
            </span>
            <span aria-hidden>›</span>
          </button>
          <button className="listlink" style={{ width: '100%', font: 'inherit', textAlign: 'left' }} onClick={() => start('new')}>
            <span className="grow">
              <span className="title">Nowe karty</span>
              <br />
              <span className="sub">W ramach dziennego limitu nowych kart</span>
            </span>
            <span aria-hidden>›</span>
          </button>
          <button className="listlink" style={{ width: '100%', font: 'inherit', textAlign: 'left' }} onClick={() => start('weak')} disabled={!weak.length}>
            <span className="grow">
              <span className="title">Trudne karty</span>
              <br />
              <span className="sub">{weak.length ? `${weak.length} kart zapomnianych co najmniej raz` : 'Jeszcze brak'}</span>
            </span>
            <span aria-hidden>›</span>
          </button>
          <button className="listlink" style={{ width: '100%', font: 'inherit', textAlign: 'left' }} onClick={() => start('favourites')}>
            <span className="grow">
              <span className="title">Ulubione</span>
              <br />
              <span className="sub">Karty oznaczone gwiazdką</span>
            </span>
            <span aria-hidden>›</span>
          </button>
        </div>
      )}
      <h2>Słownik</h2>
      <Link to="/vocab" className="listlink">
        <span className="grow">
          <span className="title">Przeglądaj wszystkie hasła</span>
          <br />
          <span className="sub">{cards.length} haseł · wyszukiwanie, własne fiszki, eksport PDF</span>
        </span>
        <span aria-hidden>›</span>
      </Link>
      {!cards.length && <Empty icon="❏">Brak kart.</Empty>}
    </div>
  );
}
