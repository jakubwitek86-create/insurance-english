import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLearningData, resultTitle } from '../lib/data';
import { useAllCards, useToday } from '../lib/hooks';
import { setSetting, useSettings, type SessionMode } from '../lib/settings';
import { activeDaySet, currentLevelLabel, levelEstimates, streak } from '../lib/progress';
import { buildPlan, dueCards, newAllowance } from '../lib/session';
import { taskItems, taskPath } from '../content';
import { formatDay } from '../lib/day';
import { Bar, LevelTag, ScoreTag } from '../components/ui';

const KIND_LABEL: Record<string, string> = { lesson: 'Lekcja', dialogue: 'Rozmowa', email: 'E-mail', grammar: 'Gramatyka' };

export function Dashboard() {
  const s = useSettings();
  const today = useToday();
  const cards = useAllCards();
  const { loaded, states, reviews, results } = useLearningData();

  const due = dueCards(states, today).length;
  const allowance = Math.min(newAllowance(states, s.newPerDay, today), cards.length - states.length);
  const days = activeDaySet(reviews, results);
  const st = streak(days, today);
  const doneToday = days.has(today);
  const est = useMemo(() => levelEstimates(cards, states, results), [cards, states, results]);
  const plan = useMemo(
    () => buildPlan(20, { cards, states, results, items: taskItems, newPerDay: s.newPerDay, startLevel: s.startLevel, today }),
    [cards, states, results, s.newPerDay, s.startLevel, today],
  );
  const next = plan.tasks[0];
  const recent = results
    .filter((r) => r.kind !== 'placement')
    .slice(-4)
    .reverse();
  const backupDays = s.lastBackup ? Math.floor((Date.now() - s.lastBackup) / 86_400_000) : null;
  const needBackup = (reviews.length > 0 || results.length > 0) && (backupDays === null || backupDays >= 7);
  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone);

  if (!loaded) return <p className="muted">Wczytywanie…</p>;

  return (
    <div>
      <h1>Dzień dobry{doneToday ? ' 👋' : ''}</h1>
      <p className="muted">Krótkie, codzienne sesje działają lepiej niż długie i rzadkie.</p>

      {!s.placementDone && (
        <div className="card accent">
          <h3>Na początek: krótki test (2 minuty)</h3>
          <p className="small muted">12 pytań ustawi poziom, od którego aplikacja będzie wprowadzać nowe słownictwo. Możesz go pominąć.</p>
          <div className="row">
            <Link to="/placement" className="btn">
              Zrób test
            </Link>
            <button className="btn secondary" onClick={() => setSetting('placementDone', true)}>
              Pomiń, zacznij od A2
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="row between">
          <h2 style={{ margin: 0 }}>Dzisiejsza sesja</h2>
          <div className="seg" role="group" aria-label="Długość sesji">
            {([10, 15, 20] as SessionMode[]).map((m) => (
              <button key={m} aria-pressed={s.sessionMode === m} onClick={() => setSetting('sessionMode', m)}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className="grid2" style={{ margin: '14px 0' }}>
          <div className="stat">
            <div className="label">Do powtórki</div>
            <div className="big">{due}</div>
          </div>
          <div className="stat">
            <div className="label">Nowe dziś</div>
            <div className="big">{Math.max(0, allowance)}</div>
          </div>
        </div>
        <Link to="/session" className="btn block">
          {doneToday ? 'Kontynuuj naukę' : 'Zacznij sesję'} · {s.sessionMode} min
        </Link>
      </div>

      {needBackup && (
        <div className="notice">
          <strong>Zrób kopię zapasową.</strong>{' '}
          {backupDays === null ? 'Nie masz jeszcze żadnej kopii.' : `Ostatnia kopia: ${backupDays} dni temu.`} Dane są tylko na tym
          urządzeniu. <Link to="/settings">Eksportuj w Ustawieniach</Link>.
        </div>
      )}

      <div className="grid2">
        <div className="stat">
          <div className="label">Seria dni</div>
          <div className="big">{st}</div>
          <div className="tiny">{doneToday ? 'Dziś zaliczone' : st ? 'Ucz się dziś, by ją utrzymać' : 'Zacznij dziś'}</div>
        </div>
        <Link to="/stats" className="stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="label">Szacowany poziom*</div>
          <div className="big">{currentLevelLabel(est)}</div>
          <div className="tiny">*wewnętrzny szacunek, nie certyfikat</div>
        </Link>
      </div>

      {next && (
        <>
          <h2>Proponowane ćwiczenie</h2>
          <Link to={taskPath(next.kind, next.id)} className="listlink">
            <span className="grow">
              <span className="title">{next.title}</span>
              <br />
              <span className="sub">{KIND_LABEL[next.kind]} · wybrane według Twoich najsłabszych obszarów</span>
            </span>
            <LevelTag level={next.level} />
          </Link>
        </>
      )}

      <h2>Postęp według poziomów</h2>
      <div className="card flat">
        {est.map((e) => (
          <div key={e.level} style={{ marginBottom: 10 }}>
            <div className="row between small">
              <span>
                <LevelTag level={e.level} /> {e.reached ? 'osiągnięty' : ''}
              </span>
              <span className="muted">{Math.round(e.score * 100)}% / 70%</span>
            </div>
            <Bar value={e.score / 0.7} amber={!e.reached} label={`Postęp ${e.level}`} />
          </div>
        ))}
      </div>

      <h2>Ostatnia aktywność</h2>
      {recent.length ? (
        recent.map((r) => (
          <div key={r.id} className="row between small" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
            <span>
              <span className="muted">{formatDay(r.day)}</span> · {resultTitle(r.kind, r.itemId)}
            </span>
            <ScoreTag score={r.score} />
          </div>
        ))
      ) : (
        <p className="muted small">Jeszcze nic. Pierwsza sesja zajmie 10–15 minut.</p>
      )}

      {!isStandalone && (
        <p className="small" style={{ marginTop: 18 }}>
          <Link to="/install">Zainstaluj aplikację na telefonie</Link>, aby działała jak zwykła aplikacja i offline.
        </p>
      )}
    </div>
  );
}
