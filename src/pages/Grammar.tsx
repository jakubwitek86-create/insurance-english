import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { grammar } from '../content';
import { recordResult, useBestScores } from '../lib/hooks';
import { useSettings } from '../lib/settings';
import { Empty, ExerciseSet, LevelTag, PageHeader, ScoreTag, SpeakBtn } from '../components/ui';

export function GrammarList() {
  const best = useBestScores('grammar');
  return (
    <div>
      <PageHeader title="Gramatyka w praktyce" back="/practice">
        <p className="small muted">Krótko po polsku, przykłady z ubezpieczeń i typowe błędy Polaków.</p>
      </PageHeader>
      {grammar.map((g) => (
        <Link key={g.id} to={`/grammar/${g.id}`} className="listlink">
          <LevelTag level={g.level} />
          <span className="grow">
            <span className="title">{g.title}</span>
          </span>
          <ScoreTag score={best.get(g.id)} />
        </Link>
      ))}
    </div>
  );
}

export function GrammarDetail() {
  const { id } = useParams();
  const g = grammar.find((x) => x.id === id);
  const s = useSettings();
  const [saved, setSaved] = useState<number | null>(null);
  if (!g)
    return (
      <Empty icon="?">
        Nie znaleziono tematu. <Link to="/grammar">Wróć</Link>
      </Empty>
    );
  const next = grammar[grammar.indexOf(g) + 1];

  return (
    <div>
      <PageHeader title={g.title} back="/grammar">
        <LevelTag level={g.level} />
      </PageHeader>
      <div className="card">
        {s.explainLang === 'en' && <p className="muted">{g.summaryEn}</p>}
        {g.explanation.split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="card">
        <h3>Przykłady</h3>
        {g.examples.map((e) => (
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
        <h3>Typowe błędy</h3>
        {g.mistakes.map((m) => (
          <div key={m.wrong} style={{ marginBottom: 12 }}>
            <div>
              <span style={{ color: 'var(--bad)' }}>✗ {m.wrong}</span>
            </div>
            <div>
              <span style={{ color: 'var(--good)' }}>✓ {m.right}</span>
            </div>
            <div className="small muted">{m.why}</div>
          </div>
        ))}
      </div>
      <ExerciseSet
        title="Ćwiczenia"
        items={g.exercises}
        onDone={async (score) => {
          await recordResult('grammar', g.id, g.level, score);
          setSaved(score);
        }}
      />
      {saved !== null && (
        <div className="notice good" role="status">
          Zapisano wynik: {Math.round(saved * 100)}%. {next && <Link to={`/grammar/${next.id}`}>Następny temat: {next.title} →</Link>}
        </div>
      )}
    </div>
  );
}
