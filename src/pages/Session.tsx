import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db/db';
import { useAllCards } from '../lib/hooks';
import { getSettings, useSettings } from '../lib/settings';
import { buildPlan, MODE_LIMITS, type SessionPlan } from '../lib/session';
import { taskItems, taskPath } from '../content';
import { dayIndex } from '../lib/day';
import { useLiveQuery } from 'dexie-react-hooks';
import { Review, type ReviewStats } from '../components/Review';
import { Empty, LevelTag, PageHeader } from '../components/ui';

const KIND_LABEL: Record<string, string> = { lesson: 'Lekcja', dialogue: 'Rozmowa telefoniczna', email: 'E-mail', grammar: 'Gramatyka' };

export function SessionPage() {
  const cards = useAllCards();
  const settings = useSettings();
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [startedAt] = useState(Date.now());
  const [stage, setStage] = useState<'cards' | 'tasks'>('cards');
  const [stats, setStats] = useState<ReviewStats | null>(null);

  // Plan once when the page opens, so the queue does not change while reviewing.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [states, results, s] = await Promise.all([db.cardStates.toArray(), db.results.toArray(), getSettings()]);
      const p = buildPlan(s.sessionMode, {
        cards,
        states,
        results,
        items: taskItems,
        newPerDay: s.newPerDay,
        startLevel: s.startLevel,
        today: dayIndex(),
      });
      if (alive) setPlan(p);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  const doneTasks = useLiveQuery(() => db.results.filter((r) => r.ts >= startedAt).toArray(), [startedAt]) ?? [];
  const doneSet = new Set(doneTasks.filter((r) => r.ts >= startedAt).map((r) => `${r.kind}:${r.itemId}`));

  if (!plan) return <p className="muted">Przygotowuję sesję…</p>;

  const queue = [...plan.review, ...plan.fresh];
  const lim = MODE_LIMITS[settings.sessionMode];

  return (
    <div>
      <PageHeader title={`Sesja ${settings.sessionMode} min`} back="/">
        <p className="small muted">
          {plan.review.length} powtórek · {plan.fresh.length} nowych ·{' '}
          {plan.tasks.length === 0
            ? 'bez ćwiczeń kontekstowych'
            : plan.tasks.length === 1
              ? '1 ćwiczenie kontekstowe'
              : `${plan.tasks.length} ćwiczenia kontekstowe`}
          {lim.tasks > plan.tasks.length ? ' (wszystkie ukończone na 100%)' : ''}
        </p>
      </PageHeader>

      {stage === 'cards' && queue.length > 0 && (
        <Review
          key={queue.join(',')}
          queue={queue}
          onFinish={(s) => {
            setStats(s);
            setStage('tasks');
          }}
        />
      )}

      {stage === 'cards' && queue.length === 0 && (
        <div className="card">
          <Empty icon="✓">
            <p>Na dziś nie ma kart do powtórki, a limit nowych kart jest wykorzystany.</p>
          </Empty>
          <button className="btn block" onClick={() => setStage('tasks')}>
            Przejdź dalej
          </button>
        </div>
      )}

      {stage === 'tasks' && (
        <div>
          {stats && (
            <div className="notice good">
              Fiszki gotowe: {stats.reviewed} odpowiedzi
              {stats.again ? `, ${stats.again} do ponownego utrwalenia` : ''}.
            </div>
          )}
          {plan.tasks.length > 0 ? (
            <>
              <h2>Ćwiczenie kontekstowe</h2>
              <p className="small muted">Wybrane regułowo: najpierw obszar z najniższym wynikiem albo jeszcze niećwiczony.</p>
              {plan.tasks.map((t) => {
                const done = doneSet.has(`${t.kind}:${t.id}`);
                return (
                  <Link key={t.id} to={taskPath(t.kind, t.id)} className="listlink">
                    <span aria-hidden style={{ fontSize: '1.2rem' }}>
                      {done ? '✓' : '○'}
                    </span>
                    <span className="grow">
                      <span className="title">{t.title}</span>
                      <br />
                      <span className="sub">{KIND_LABEL[t.kind]}</span>
                    </span>
                    <LevelTag level={t.level} />
                  </Link>
                );
              })}
            </>
          ) : (
            <p className="muted">Sesja 10-minutowa obejmuje tylko fiszki. Świetna robota!</p>
          )}
          <div className="row" style={{ marginTop: 14 }}>
            <Link to="/" className="btn secondary">
              Zakończ
            </Link>
            <Link to="/practice" className="btn ghost">
              Więcej ćwiczeń
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
