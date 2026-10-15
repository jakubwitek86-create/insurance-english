import { useMemo } from 'react';
import { useLearningData, resultTitle } from '../lib/data';
import { useAllCards, useToday } from '../lib/hooks';
import { activeDaySet, currentLevelLabel, levelEstimates, retentionRate, reviewsPerDay, streak, topicProgress, LEVEL_THRESHOLD } from '../lib/progress';
import { formatDay } from '../lib/day';
import { TOPIC_LABELS } from '../types';
import { progressPdf, pdfFilename } from '../lib/exports';
import { Bar, BarChart, LevelTag, PageHeader, ScoreTag, useToast } from '../components/ui';
import { isMature } from '../lib/srs';

export function StatsPage() {
  const cards = useAllCards();
  const today = useToday();
  const { states, reviews, results, loaded } = useLearningData();
  const [toast, showToast] = useToast();

  const est = useMemo(() => levelEstimates(cards, states, results), [cards, states, results]);
  const topics = useMemo(() => topicProgress(cards, states), [cards, states]);
  const perDay = reviewsPerDay(reviews, today, 14);
  const st = streak(activeDaySet(reviews, results), today);
  const retention = retentionRate(reviews.slice(-200));
  const mature = states.filter(isMature).length;
  const recent = results.slice(-12).reverse();

  if (!loaded) return <p className="muted">Wczytywanie…</p>;

  const exportPdf = async () => {
    try {
      const w = await progressPdf({
        streak: st,
        totalReviews: reviews.length,
        retention,
        cardsSeen: states.length,
        cardsTotal: cards.length,
        levelLabel: currentLevelLabel(est),
        estimates: est,
        topics,
        recent: recent.map((r) => ({ label: resultTitle(r.kind, r.itemId), score: r.score, date: formatDay(r.day) })),
      });
      w.save(pdfFilename('postepy'));
    } catch (e) {
      showToast(`Błąd PDF: ${(e as Error).message}`);
    }
  };

  return (
    <div>
      <PageHeader title="Postępy" />
      <div className="grid2" style={{ marginBottom: 14 }}>
        <div className="stat">
          <div className="label">Seria</div>
          <div className="big">{st}</div>
          <div className="tiny">dni z rzędu</div>
        </div>
        <div className="stat">
          <div className="label">Skuteczność</div>
          <div className="big">{reviews.length ? `${Math.round(retention * 100)}%` : '–'}</div>
          <div className="tiny">ostatnie 200 odpowiedzi</div>
        </div>
        <div className="stat">
          <div className="label">Poznane karty</div>
          <div className="big">{states.length}</div>
          <div className="tiny">z {cards.length}</div>
        </div>
        <div className="stat">
          <div className="label">Utrwalone</div>
          <div className="big">{mature}</div>
          <div className="tiny">odstęp ≥ 7 dni</div>
        </div>
      </div>

      <div className="card">
        <h3>Powtórki: ostatnie 14 dni</h3>
        <BarChart label="Liczba powtórek dziennie" data={perDay.map((p) => ({ label: formatDay(p.day).split(' ')[0], value: p.count }))} />
      </div>

      <div className="card">
        <h3>Szacowany poziom: {currentLevelLabel(est)}</h3>
        <p className="tiny">
          Wewnętrzny szacunek aplikacji, a nie certyfikat CEFR. Wynik poziomu = 40% utrwalonego słownictwa + 30% lekcji i gramatyki + 30% dialogów,
          e-maili, mówienia i słuchania (najlepszy wynik z każdego ćwiczenia). Poziom jest „osiągnięty” od {LEVEL_THRESHOLD * 100}%, kolejno od A2.
        </p>
        {est.map((e) => (
          <div key={e.level} style={{ margin: '12px 0' }}>
            <div className="row between">
              <span>
                <LevelTag level={e.level} /> {e.reached && '✓'}
              </span>
              <strong>{Math.round(e.score * 100)}%</strong>
            </div>
            <div className="small muted" style={{ margin: '4px 0' }}>
              słownictwo {Math.round(e.vocab * 100)}% · wiedza {Math.round(e.knowledge * 100)}% · komunikacja {Math.round(e.communication * 100)}%
            </div>
            <Bar value={e.score} amber={!e.reached} label={`Poziom ${e.level}`} />
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Tematy</h3>
        {topics.map((t) => (
          <div key={t.topic} style={{ marginBottom: 10 }}>
            <div className="row between small">
              <span>{TOPIC_LABELS[t.topic]}</span>
              <span className="muted">
                {t.seen}/{t.total} · utrwalone {t.mature}
              </span>
            </div>
            <Bar value={t.total ? t.seen / t.total : 0} label={TOPIC_LABELS[t.topic]} />
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Ostatnie wyniki</h3>
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
          <p className="muted small">Brak wyników. Zrób pierwszą lekcję lub dialog.</p>
        )}
      </div>

      <button className="btn secondary block" onClick={exportPdf}>
        Eksportuj podsumowanie do PDF
      </button>
      {toast}
    </div>
  );
}
