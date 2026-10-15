import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dialogues, cardById } from '../content';
import type { Dialogue } from '../types';
import { recordResult, useBestScores } from '../lib/hooks';
import { lineSimilarity, tokenizeForOrder } from '../lib/feedback';
import { dialoguePdf, pdfFilename } from '../lib/exports';
import { Empty, ExerciseSet, LevelTag, PageHeader, ScoreTag, SpeakBtn, useSpeechSequence, useToast } from '../components/ui';
import { SpeechInput } from '../components/SpeechInput';

export function DialoguesList() {
  const best = useBestScores('dialogue');
  return (
    <div>
      <PageHeader title="Rozmowy telefoniczne" back="/practice">
        <p className="small muted">Czytaj, słuchaj, układaj, wybieraj odpowiedzi i mów. Ty jesteś brokerem.</p>
      </PageHeader>
      {dialogues.map((d) => (
        <Link key={d.id} to={`/dialogues/${d.id}`} className="listlink">
          <LevelTag level={d.level} />
          <span className="grow">
            <span className="title">{d.titlePl}</span>
            <br />
            <span className="sub">{d.title}</span>
          </span>
          <ScoreTag score={best.get(d.id)} />
        </Link>
      ))}
    </div>
  );
}

type Tab = 'read' | 'listen' | 'reconstruct' | 'choose' | 'speak';
const TABS: [Tab, string][] = [
  ['read', 'Czytaj'],
  ['listen', 'Słuchaj'],
  ['reconstruct', 'Ułóż'],
  ['choose', 'Wybierz'],
  ['speak', 'Mów'],
];

function ReadTab({ d }: { d: Dialogue }) {
  const [pl, setPl] = useState(false);
  const { playing, play, stop, supported } = useSpeechSequence();
  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        {supported && (
          <>
            <button className="btn sm" onClick={() => play(d.lines.map((l) => l.en))}>
              ▶ Odtwórz całość
            </button>
            {playing >= 0 && (
              <button className="btn secondary sm" onClick={stop}>
                ■ Stop
              </button>
            )}
          </>
        )}
        <button className="btn ghost sm" onClick={() => setPl((v) => !v)} aria-pressed={pl}>
          {pl ? 'Ukryj PL' : 'Pokaż PL'}
        </button>
      </div>
      {d.lines.map((l, i) => (
        <div key={i} className={`line ${l.s === d.learner ? 'me' : ''} ${playing === i ? 'playing' : ''}`}>
          <div className="who" aria-hidden>
            {l.s === d.learner ? 'Ty' : l.s}
          </div>
          <div className="bubble">
            <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
              <span style={{ flex: 1 }}>
                <span className="sr-only">{l.s === 'A' ? d.roles.A : d.roles.B}: </span>
                {l.en}
              </span>
              <SpeakBtn text={l.en} />
            </div>
            {pl && <div className="pl">{l.pl}</div>}
          </div>
        </div>
      ))}
      <h3>Przydatne zwroty</h3>
      {d.expressions.map((e) => (
        <div key={e.en} style={{ marginBottom: 8 }}>
          <strong>{e.en}</strong>
          <div className="pl">{e.pl}</div>
        </div>
      ))}
      <h3>Słownictwo</h3>
      <div className="row">
        {d.cardIds.map((id) => {
          const c = cardById.get(id);
          return c ? (
            <span className="chip" key={id}>
              {c.en} — {c.pl}
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
}

function ListenTab({ d, onScore }: { d: Dialogue; onScore: (s: number) => void }) {
  const [show, setShow] = useState(false);
  const { playing, play, stop, supported } = useSpeechSequence();
  return (
    <div>
      {!supported && (
        <div className="notice">Ta przeglądarka nie ma syntezy mowy. Przeczytaj transkrypcję i odpowiedz na pytania.</div>
      )}
      <div className="card flat">
        <p className="small muted">Najpierw posłuchaj bez tekstu. Potem odpowiedz na pytania.</p>
        <div className="row">
          {supported && (
            <>
              <button className="btn sm" onClick={() => play(d.lines.map((l) => l.en))}>
                ▶ Odtwórz
              </button>
              <button className="btn secondary sm" onClick={() => play(d.lines.map((l) => l.en), -0.25)}>
                ▶ Wolniej
              </button>
              {playing >= 0 && (
                <button className="btn secondary sm" onClick={stop}>
                  ■ Stop
                </button>
              )}
            </>
          )}
          <button className="btn ghost sm" onClick={() => setShow((v) => !v)} aria-expanded={show || !supported}>
            {show ? 'Ukryj transkrypcję' : 'Pokaż transkrypcję'}
          </button>
        </div>
        {playing >= 0 && <p className="tiny">Kwestia {playing + 1} z {d.lines.length}</p>}
        {(show || !supported) && (
          <div style={{ marginTop: 10 }}>
            {d.lines.map((l, i) => (
              <p key={i} className="small">
                <strong>{l.s === d.learner ? 'Broker' : l.s}:</strong> {l.en}
              </p>
            ))}
          </div>
        )}
      </div>
      <ExerciseSet title="Pytania" items={d.questions} onDone={onScore} />
    </div>
  );
}

function ReconstructTab({ d, onScore }: { d: Dialogue; onScore: (s: number) => void }) {
  const items = useMemo(
    () =>
      d.lines
        .filter((l) => l.s === d.learner)
        .slice(0, 4)
        .map((l) => ({ type: 'order' as const, words: tokenizeForOrder(l.en), pl: l.pl })),
    [d],
  );
  return <ExerciseSet title="Ułóż kwestie brokera" items={items} onDone={onScore} />;
}

function ChooseTab({ d, onScore }: { d: Dialogue; onScore: (s: number) => void }) {
  const items = d.choose.map((c) => ({ type: 'mcq' as const, q: c.prompt, options: c.options, answer: c.answer, explain: c.explain }));
  return <ExerciseSet title="Wybierz najlepszą reakcję" items={items} onDone={onScore} />;
}

function SpeakTab({ d, onScore }: { d: Dialogue; onScore: (s: number) => void }) {
  const mine = d.lines.filter((l) => l.s === d.learner);
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number; missing: string[] } | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const line = mine[i];
  const prev = d.lines[d.lines.indexOf(line) - 1];

  if (!line) {
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return (
      <div className="notice good">
        Koniec. Średnie pokrycie słów kluczowych: {Math.round(avg * 100)}%.{' '}
        <button
          className="btn ghost sm"
          onClick={() => {
            setI(0);
            setScores([]);
          }}
        >
          Jeszcze raz
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="small muted">
        Kwestia {i + 1} z {mine.length}. Powiedz po angielsku, potem porównaj z wzorem. Ocena sprawdza tylko słowa kluczowe, nie wymowę ani gramatykę.
      </p>
      {prev && prev.s !== d.learner && (
        <div className="line">
          <div className="who">{prev.s}</div>
          <div className="bubble">
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <span style={{ flex: 1 }}>{prev.en}</span>
              <SpeakBtn text={prev.en} />
            </div>
          </div>
        </div>
      )}
      <div className="notice info">
        <strong>Powiedz:</strong> {line.pl}
      </div>
      <SpeechInput value={text} onChange={setText} rows={3} />
      {!result ? (
        <button
          className="btn"
          disabled={!text.trim()}
          onClick={() => {
            const r = lineSimilarity(text, line.en);
            setResult(r);
            const ns = [...scores, r.score];
            setScores(ns);
            if (i === mine.length - 1) onScore(ns.reduce((a, b) => a + b, 0) / ns.length);
          }}
        >
          Porównaj z wzorem
        </button>
      ) : (
        <div>
          <div className={`fb ${result.score >= 0.7 ? 'ok' : 'no'}`}>
            Słowa kluczowe: {Math.round(result.score * 100)}%
            {result.missing.length > 0 && <> · brakuje: {result.missing.join(', ')}</>}
          </div>
          <p style={{ marginTop: 10 }}>
            <strong>Wzór:</strong> {line.en} <SpeakBtn text={line.en} />
          </p>
          <button
            className="btn"
            onClick={() => {
              setI(i + 1);
              setText('');
              setResult(null);
            }}
          >
            Dalej
          </button>
        </div>
      )}
    </div>
  );
}

export function DialogueDetail() {
  const { id } = useParams();
  const d = dialogues.find((x) => x.id === id);
  const [tab, setTab] = useState<Tab>('read');
  const [toast, showToast] = useToast();
  if (!d)
    return (
      <Empty icon="?">
        Nie znaleziono rozmowy. <Link to="/dialogues">Wróć</Link>
      </Empty>
    );

  const save = (mode: string) => async (score: number) => {
    await recordResult('dialogue', d.id, d.level, score, mode);
    showToast(`Zapisano wynik: ${Math.round(score * 100)}%`);
  };

  return (
    <div>
      <PageHeader title={d.titlePl} back="/dialogues">
        <div className="row">
          <LevelTag level={d.level} />
          <span className="small muted">{d.title}</span>
        </div>
      </PageHeader>
      <div className="card flat">
        <p style={{ margin: 0 }}>{d.situation}</p>
        <p className="tiny" style={{ marginTop: 6 }}>
          A: {d.roles.A} · B: {d.roles.B}
        </p>
      </div>
      <div className="tabs" role="tablist">
        {TABS.map(([k, v]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {v}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'read' && <ReadTab d={d} />}
        {tab === 'listen' && <ListenTab d={d} onScore={save('listen')} />}
        {tab === 'reconstruct' && <ReconstructTab d={d} onScore={save('reconstruct')} />}
        {tab === 'choose' && <ChooseTab d={d} onScore={save('choose')} />}
        {tab === 'speak' && <SpeakTab d={d} onScore={save('speak')} />}
      </div>
      <button
        className="btn secondary"
        style={{ marginTop: 14 }}
        onClick={async () => {
          try {
            (await dialoguePdf(d)).save(pdfFilename(d.title));
          } catch (e) {
            showToast(`Błąd PDF: ${(e as Error).message}`);
          }
        }}
      >
        Pobierz PDF
      </button>
      {toast}
    </div>
  );
}
