import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lessons, cardById } from '../content';
import { recordResult, useBestScores } from '../lib/hooks';
import { useSettings } from '../lib/settings';
import { ExerciseSet, LevelTag, PageHeader, ScoreTag, SpeakBtn, Empty } from '../components/ui';
import { LEVELS } from '../types';

export function LessonsList() {
  const best = useBestScores('lesson');
  return (
    <div>
      <PageHeader title="Ścieżka lekcji" back="/practice">
        <p className="small muted">Lekcje od A2 do B2. Każda ma słownictwo, sytuację biznesową, pytania i ćwiczenia z kluczem.</p>
      </PageHeader>
      {LEVELS.map((lvl) => (
        <section key={lvl}>
          <h2>
            <LevelTag level={lvl} />
          </h2>
          {lessons
            .filter((l) => l.level === lvl)
            .map((l, i) => (
              <Link key={l.id} to={`/lessons/${l.id}`} className="listlink">
                <span className="grow">
                  <span className="title">{l.titlePl}</span>
                  <br />
                  <span className="sub">
                    {i + 1}. {l.title}
                  </span>
                </span>
                <ScoreTag score={best.get(l.id)} />
              </Link>
            ))}
        </section>
      ))}
    </div>
  );
}

export function LessonDetail() {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id === id);
  const s = useSettings();
  const [showPl, setShowPl] = useState(false);
  const [compScore, setCompScore] = useState<number | null>(null);
  const [exScore, setExScore] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  // Save once both parts are answered (in any order).
  useEffect(() => {
    if (!lesson || compScore === null || exScore === null) return;
    const nC = lesson.comprehension.length;
    const nE = lesson.exercises.length;
    const total = (compScore * nC + exScore * nE) / (nC + nE);
    recordResult('lesson', lesson.id, lesson.level, total).then(() => setSaved(total));
  }, [compScore, exScore, lesson]);

  if (!lesson)
    return (
      <Empty icon="?">
        Nie znaleziono lekcji. <Link to="/lessons">Wróć do listy</Link>
      </Empty>
    );

  const idx = lessons.indexOf(lesson);
  const next = lessons[idx + 1];

  return (
    <div>
      <PageHeader title={lesson.titlePl} back="/lessons">
        <div className="row">
          <LevelTag level={lesson.level} />
          <span className="small muted">{lesson.title}</span>
        </div>
      </PageHeader>

      <div className="card">
        <h3>Cele</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Wyjaśnienie</h3>
        {s.explainLang === 'en' && <p className="muted">{lesson.summaryEn}</p>}
        {lesson.explanation.split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <h3 style={{ marginTop: 14 }}>Przykłady</h3>
        {lesson.examples.map((e) => (
          <div key={e.en} style={{ marginBottom: 10 }}>
            <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
              <span style={{ flex: 1 }}>{e.en}</span>
              <SpeakBtn text={e.en} />
            </div>
            <div className="pl">{e.pl}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Słownictwo</h3>
        <div className="row">
          {lesson.cardIds.map((cid) => {
            const c = cardById.get(cid);
            return c ? (
              <span key={cid} className="chip" title={c.pl}>
                {c.en} — {c.pl}
              </span>
            ) : null;
          })}
        </div>
        <p className="tiny" style={{ marginTop: 8 }}>
          Te hasła są też w fiszkach i wrócą w powtórkach.
        </p>
      </div>

      <div className="card">
        <div className="row between">
          <h3 style={{ margin: 0 }}>Sytuacja: {lesson.situation.title}</h3>
          <SpeakBtn text={lesson.situation.text} />
        </div>
        <p style={{ marginTop: 10 }}>{lesson.situation.text}</p>
        <button className="btn ghost sm" onClick={() => setShowPl((v) => !v)} aria-expanded={showPl}>
          {showPl ? 'Ukryj tłumaczenie' : 'Pokaż tłumaczenie'}
        </button>
        {showPl && <p className="pl">{lesson.situation.pl}</p>}
      </div>

      <ExerciseSet title="Pytania do sytuacji" items={lesson.comprehension} onDone={setCompScore} />
      <ExerciseSet title="Ćwiczenia" items={lesson.exercises} onDone={setExScore} />
      {saved === null && (compScore === null) !== (exScore === null) && (
        <p className="small muted">Dokończ obie części, aby zapisać wynik lekcji.</p>
      )}

      {saved !== null && (
        <div className="notice good" role="status">
          Lekcja zapisana: {Math.round(saved * 100)}%.{' '}
          {next ? (
            <Link to={`/lessons/${next.id}`}>Następna lekcja: {next.titlePl} →</Link>
          ) : (
            <Link to="/lessons">To była ostatnia lekcja.</Link>
          )}
        </div>
      )}
    </div>
  );
}
