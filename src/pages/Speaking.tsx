import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { speakingTasks } from '../content';
import { recordResult, useBestScores } from '../lib/hooks';
import { evaluateText, type Feedback } from '../lib/feedback';
import { transcriptPdf, pdfFilename } from '../lib/exports';
import { getRecognition, recorderSupported } from '../lib/tts';
import { Empty, LevelTag, PageHeader, ScoreTag, SpeakBtn, useToast } from '../components/ui';
import { SpeechInput } from '../components/SpeechInput';

export function SpeakingList() {
  const best = useBestScores('speaking');
  return (
    <div>
      <PageHeader title="Mówienie" back="/practice">
        <p className="small muted">Krótkie zadania z pracy brokera. Nagraj się, podyktuj lub wpisz odpowiedź i porównaj z wymaganiami.</p>
      </PageHeader>
      <div className="notice info small">
        Nagrywanie: {recorderSupported() ? 'dostępne' : 'niedostępne'} · Rozpoznawanie mowy: {getRecognition() ? 'dostępne (zwykle wymaga internetu)' : 'niedostępne w tej przeglądarce'}.
        Ręczne wpisywanie działa zawsze.
      </div>
      {speakingTasks.map((t) => (
        <Link key={t.id} to={`/speaking/${t.id}`} className="listlink">
          <LevelTag level={t.level} />
          <span className="grow">
            <span className="title">{t.title}</span>
          </span>
          <ScoreTag score={best.get(t.id)} />
        </Link>
      ))}
    </div>
  );
}

export function SpeakingDetail() {
  const { id } = useParams();
  const task = speakingTasks.find((t) => t.id === id);
  const [text, setText] = useState('');
  const [fb, setFb] = useState<Feedback | null>(null);
  const [toast, showToast] = useToast();
  const history = useLiveQuery(() => (id ? db.transcripts.where('taskId').equals(id).reverse().sortBy('ts') : []), [id], []) ?? [];

  if (!task)
    return (
      <Empty icon="?">
        Nie znaleziono zadania. <Link to="/speaking">Wróć</Link>
      </Empty>
    );

  const evaluate = async () => {
    const f = evaluateText(text, task.required, 15);
    setFb(f);
    await db.transcripts.add({ taskId: task.id, text, score: f.score, missing: f.elements.filter((e) => !e.found).map((e) => e.label), ts: Date.now() });
    await recordResult('speaking', task.id, task.level, f.score);
  };

  return (
    <div>
      <PageHeader title={task.title} back="/speaking">
        <LevelTag level={task.level} />
      </PageHeader>
      <div className="card accent">
        <h3>Zadanie</h3>
        <p style={{ margin: 0 }}>{task.prompt}</p>
        <p className="tiny" style={{ marginTop: 8 }}>
          Elementy do uwzględnienia: {task.required.map((r) => r.label).join(' · ')}
        </p>
      </div>

      <div className="card">
        <SpeechInput value={text} onChange={setText} />
        <button className="btn" onClick={evaluate} disabled={!text.trim()}>
          Porównaj z wymaganiami
        </button>
      </div>

      {fb && (
        <div className="card" role="status">
          <h3>Pokrycie wymaganych elementów: {Math.round(fb.score * 100)}%</h3>
          <p className="tiny">Bez oceny wymowy i gramatyki. Aplikacja sprawdza obecność kluczowych informacji i zwrotów grzecznościowych.</p>
          {fb.elements.map((e) => (
            <div key={e.label} className="small" style={{ padding: '4px 0' }}>
              {e.found ? '✓' : '–'} {e.label}
              {!e.found && <span className="muted"> np. „{e.example}”</span>}
            </div>
          ))}
          <div className="small" style={{ padding: '4px 0' }}>
            {fb.polite ? '✓' : '–'} uprzejmy ton
          </div>
          {fb.suggestions.length > 0 && (
            <ul className="small" style={{ paddingLeft: 20 }}>
              {fb.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <hr />
          <div className="row between">
            <h3 style={{ margin: 0 }}>Wzorcowa odpowiedź</h3>
            <div className="row">
              <SpeakBtn text={task.model} />
              <SpeakBtn text={task.model} slow />
            </div>
          </div>
          <p style={{ marginTop: 8 }}>{task.model}</p>
          <p className="tiny">Twoja wersja może być inna i nadal poprawna. Wzór pokazuje jedną naturalną możliwość.</p>
          <button
            className="btn secondary"
            onClick={async () => {
              try {
                (await transcriptPdf(task, text, fb)).save(pdfFilename(`mowienie-${task.title}`));
              } catch (e) {
                showToast(`Błąd PDF: ${(e as Error).message}`);
              }
            }}
          >
            Eksportuj PDF
          </button>
        </div>
      )}

      {history.length > 0 && (
        <details className="card flat">
          <summary>Poprzednie próby ({history.length})</summary>
          {history.slice(0, 10).map((h) => (
            <div key={h.id} className="small" style={{ padding: '6px 0', borderTop: '1px solid var(--line)' }}>
              <div className="row between">
                <span className="muted">{new Date(h.ts).toLocaleString('pl-PL')}</span>
                <ScoreTag score={h.score} />
              </div>
              <div>{h.text}</div>
            </div>
          ))}
        </details>
      )}
      {toast}
    </div>
  );
}
