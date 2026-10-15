import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listeningItems, dialogues } from '../content';
import { recordResult, useBestScores } from '../lib/hooks';
import { Empty, ExerciseSet, LevelTag, PageHeader, ScoreTag, useSpeechSequence, useToast } from '../components/ui';

/** Split into sentences so long texts are spoken reliably (some engines cut long utterances). */
const sentences = (t: string) => t.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [t];

export function ListeningList() {
  const best = useBestScores('listening');
  return (
    <div>
      <PageHeader title="Słuchanie" back="/practice">
        <p className="small muted">Wiadomości głosowe i krótkie komunikaty. Transkrypcja jest domyślnie ukryta. Dialogi telefoniczne mają też tryb „Słuchaj”.</p>
      </PageHeader>
      {listeningItems.map((l) => (
        <Link key={l.id} to={`/listening/${l.id}`} className="listlink">
          <LevelTag level={l.level} />
          <span className="grow">
            <span className="title">{l.title}</span>
          </span>
          <ScoreTag score={best.get(l.id)} />
        </Link>
      ))}
      <h2>Słuchanie dialogów</h2>
      {dialogues.slice(0, 4).map((d) => (
        <Link key={d.id} to={`/dialogues/${d.id}`} className="listlink">
          <LevelTag level={d.level} />
          <span className="grow">
            <span className="title">{d.titlePl}</span>
            <br />
            <span className="sub">Otwórz i wybierz zakładkę „Słuchaj”</span>
          </span>
        </Link>
      ))}
      <Link to="/dialogues" className="small">
        Wszystkie dialogi →
      </Link>
    </div>
  );
}

export function ListeningDetail() {
  const { id } = useParams();
  const item = listeningItems.find((l) => l.id === id);
  const [show, setShow] = useState(false);
  const { playing, play, stop, supported } = useSpeechSequence();
  const [toast, showToast] = useToast();
  if (!item)
    return (
      <Empty icon="?">
        Nie znaleziono nagrania. <Link to="/listening">Wróć</Link>
      </Empty>
    );
  const parts = sentences(item.text);
  return (
    <div>
      <PageHeader title={item.title} back="/listening">
        <LevelTag level={item.level} />
      </PageHeader>
      <div className="card">
        <p className="muted">{item.intro}</p>
        {!supported && <div className="notice">Brak syntezy mowy w tej przeglądarce. Przeczytaj transkrypcję.</div>}
        <div className="row">
          {supported && (
            <>
              <button className="btn" onClick={() => play(parts)}>
                ▶ Odtwórz
              </button>
              <button className="btn secondary" onClick={() => play(parts, -0.25)}>
                ▶ Wolniej
              </button>
              {playing >= 0 && (
                <button className="btn secondary" onClick={stop}>
                  ■ Stop
                </button>
              )}
            </>
          )}
          <button className="btn ghost" onClick={() => setShow((v) => !v)} aria-expanded={show || !supported}>
            {show ? 'Ukryj transkrypcję' : 'Pokaż transkrypcję'}
          </button>
        </div>
        {(show || !supported) && (
          <p style={{ marginTop: 12 }}>
            {parts.map((p, i) => (
              <span key={i} style={playing === i ? { background: 'var(--amber-soft)' } : undefined}>
                {p}{' '}
              </span>
            ))}
          </p>
        )}
      </div>
      <ExerciseSet
        title="Pytania"
        items={item.questions}
        onDone={async (s) => {
          await recordResult('listening', item.id, item.level, s);
          showToast(`Zapisano wynik: ${Math.round(s * 100)}%`);
        }}
      />
      {toast}
    </div>
  );
}
