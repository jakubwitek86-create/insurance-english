import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { emails, EMAIL_CHECKLIST, EMAIL_STRUCTURE } from '../content/emails';
import { recordResult, useBestScores } from '../lib/hooks';
import { evaluateText, type Feedback } from '../lib/feedback';
import { emailPdf, pdfFilename } from '../lib/exports';
import { Empty, LevelTag, PageHeader, ScoreTag, SpeakBtn, useToast } from '../components/ui';

export function EmailsList() {
  const best = useBestScores('email');
  const drafts = useLiveQuery(() => db.drafts.toArray(), [], []) ?? [];
  const hasDraft = new Set(drafts.filter((d) => d.body.trim()).map((d) => d.emailId));
  return (
    <div>
      <PageHeader title="E-maile biznesowe" back="/practice">
        <p className="small muted">Napisz własną wersję, sprawdź wymagane elementy i porównaj z wzorem. Szkice zapisują się automatycznie.</p>
      </PageHeader>
      <details className="card flat">
        <summary>Struktura dobrego e-maila</summary>
        {EMAIL_STRUCTURE.map((s) => (
          <p key={s.part} className="small">
            <strong>{s.part}:</strong> {s.tip}
          </p>
        ))}
      </details>
      {emails.map((e) => (
        <Link key={e.id} to={`/emails/${e.id}`} className="listlink">
          <LevelTag level={e.level} />
          <span className="grow">
            <span className="title">{e.titlePl}</span>
            <br />
            <span className="sub">
              {e.title}
              {hasDraft.has(e.id) ? ' · szkic zapisany' : ''}
            </span>
          </span>
          <ScoreTag score={best.get(e.id)} />
        </Link>
      ))}
    </div>
  );
}

export function EmailDetail() {
  const { id } = useParams();
  const task = emails.find((e) => e.id === id);
  const draft = useLiveQuery(() => (id ? db.drafts.get(id) : undefined), [id]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [fb, setFb] = useState<Feedback | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(EMAIL_CHECKLIST.map(() => false));
  const [toast, showToast] = useToast();
  const timer = useRef<number>();

  // Load the saved draft once, before autosave is enabled (so an empty form never overwrites it).
  useEffect(() => {
    if (!id) return;
    let alive = true;
    db.drafts.get(id).then((d) => {
      if (!alive) return;
      if (d) {
        setSubject(d.subject);
        setBody(d.body);
      }
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  // Autosave (debounced) to IndexedDB.
  useEffect(() => {
    if (!loaded || !id) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      db.drafts.put({ emailId: id, subject, body, updatedAt: Date.now() });
    }, 600);
    return () => window.clearTimeout(timer.current);
  }, [subject, body, loaded, id]);

  if (!task)
    return (
      <Empty icon="?">
        Nie znaleziono zadania. <Link to="/emails">Wróć</Link>
      </Empty>
    );

  const evaluate = async () => {
    const f = evaluateText(`${subject}\n${body}`, task.required, 50);
    setFb(f);
    setShowModel(true);
    await recordResult('email', task.id, task.level, f.score);
  };

  return (
    <div>
      <PageHeader title={task.titlePl} back="/emails">
        <LevelTag level={task.level} />
      </PageHeader>
      <div className="card accent">
        <h3>Zadanie</h3>
        <p style={{ margin: 0 }}>{task.brief}</p>
      </div>
      <details className="card flat">
        <summary>Przydatne zwroty</summary>
        {task.phrases.map((p) => (
          <div key={p.en} style={{ marginBottom: 8 }}>
            <strong>{p.en}</strong>
            <div className="pl">{p.pl}</div>
          </div>
        ))}
      </details>

      <div className="card">
        <label className="field">
          <span>Temat (Subject)</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="field">
          <span>Treść</span>
          <textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} spellCheck />
        </label>
        <div className="row">
          <button className="btn" onClick={evaluate} disabled={!body.trim()}>
            Sprawdź
          </button>
          <button className="btn secondary" onClick={() => setShowModel((v) => !v)}>
            {showModel ? 'Ukryj wzór' : 'Pokaż wzór'}
          </button>
          <button
            className="btn secondary"
            onClick={async () => {
              try {
                (await emailPdf(task, { subject, body }, fb ?? undefined)).save(pdfFilename(task.title));
              } catch (e) {
                showToast(`Błąd PDF: ${(e as Error).message}`);
              }
            }}
          >
            PDF
          </button>
        </div>
        <p className="tiny" style={{ marginTop: 8 }}>
          {draft?.updatedAt ? `Szkic zapisany ${new Date(draft.updatedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}` : 'Szkic zapisuje się automatycznie.'}
        </p>
      </div>

      {fb && (
        <div className="card" role="status">
          <h3>Wynik sprawdzenia: {Math.round(fb.score * 100)}% wymaganych elementów</h3>
          <p className="tiny">
            Sprawdzanie jest regułowe: szuka zwrotów, które spełniają wymagania zadania (akceptuje też alternatywy). Nie ocenia gramatyki.
          </p>
          {fb.elements.map((e) => (
            <div key={e.label} className="small" style={{ padding: '4px 0' }}>
              {e.found ? '✓' : '–'} {e.label}
              {e.found ? <span className="muted"> („{e.matched}”)</span> : <span className="muted"> np. „{e.example}”</span>}
            </div>
          ))}
          {fb.suggestions.length > 0 && (
            <>
              <h3 style={{ marginTop: 12 }}>Wskazówki</h3>
              <ul className="small" style={{ paddingLeft: 20 }}>
                {fb.suggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div className="card flat">
        <h3>Lista kontrolna (samoocena)</h3>
        {EMAIL_CHECKLIST.map((c, i) => (
          <label key={c} className="check">
            <input type="checkbox" checked={checks[i]} onChange={() => setChecks((x) => x.map((v, j) => (j === i ? !v : v)))} />
            <span className="small">{c}</span>
          </label>
        ))}
      </div>

      {showModel && (
        <div className="card">
          <div className="row between">
            <h3 style={{ margin: 0 }}>Wzór</h3>
            <SpeakBtn text={task.model.body} />
          </div>
          <p style={{ marginTop: 8 }}>
            <strong>Subject:</strong> {task.model.subject}
          </p>
          <div className="pre">{task.model.body}</div>
        </div>
      )}
      {toast}
    </div>
  );
}
