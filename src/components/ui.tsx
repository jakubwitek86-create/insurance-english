import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Exercise, Level } from '../types';
import { checkExercise, shuffle } from '../lib/feedback';
import { speak, speakSequence, stopSpeaking, ttsSupported } from '../lib/tts';
import { useSettings } from '../lib/settings';

export function LevelTag({ level }: { level: Level }) {
  return <span className={`chip lvl ${level}`}>{level}</span>;
}

export function ScoreTag({ score }: { score?: number }) {
  if (score === undefined) return null;
  const pct = Math.round(score * 100);
  return <span className={`score ${pct < 70 ? 'low' : ''}`}>{pct}%</span>;
}

export function Bar({ value, amber = false, label }: { value: number; amber?: boolean; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className={`bar ${amber ? 'amber' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({ title, back, children }: { title: string; back?: string; children?: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {back && (
        <Link to={back} className="small" style={{ textDecoration: 'none', display: 'inline-block', minHeight: 32 }}>
          ← Wróć
        </Link>
      )}
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export function Empty({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="empty">
      <div className="big-ico" aria-hidden>
        {icon}
      </div>
      {children}
    </div>
  );
}

/** Speaker button. Falls back to a disabled state with an explanation. */
export function SpeakBtn({ text, label = '', slow = false }: { text: string; label?: string; slow?: boolean }) {
  const s = useSettings();
  if (!ttsSupported())
    return (
      <span className="tiny" title="Ta przeglądarka nie obsługuje syntezy mowy">
        (brak TTS)
      </span>
    );
  return (
    <button
      type="button"
      className="btn secondary sm"
      aria-label={`${slow ? 'Odsłuchaj wolniej' : 'Odsłuchaj'}: ${text}`}
      onClick={() => speak(text, { rate: slow ? Math.max(0.5, s.rate - 0.3) : s.rate, voiceURI: s.voiceURI })}
    >
      <span aria-hidden>🔊</span>
      {slow ? ' Wolniej' : label ? ` ${label}` : ''}
    </button>
  );
}

export function useSpeechSequence() {
  const s = useSettings();
  const [playing, setPlaying] = useState(-1);
  const [cancel, setCancel] = useState<(() => void) | null>(null);
  useEffect(() => () => stopSpeaking(), []);
  const play = (texts: string[], rateDelta = 0) => {
    cancel?.();
    const c = speakSequence(texts, {
      rate: Math.max(0.5, s.rate + rateDelta),
      voiceURI: s.voiceURI,
      onIndex: setPlaying,
      onEnd: () => setPlaying(-1),
    });
    setCancel(() => c);
  };
  const stop = () => {
    cancel?.();
    setPlaying(-1);
  };
  return { playing, play, stop, supported: ttsSupported() };
}

function OrderExercise({ words, value, onChange, disabled }: { words: string[]; value: string[]; onChange: (v: string[]) => void; disabled: boolean }) {
  const pool = useMemo(() => shuffle(words.map((w, i) => ({ w, i })), words.length * 0.137 + 0.21), [words]);
  const [used, setUsed] = useState<number[]>([]);
  useEffect(() => {
    if (value.length === 0) setUsed([]);
  }, [value.length]);
  return (
    <div>
      <div className="answer-area tokens" aria-label="Twoja odpowiedź">
        {used.map((i, k) => (
          <button
            key={k}
            type="button"
            className="token"
            disabled={disabled}
            onClick={() => {
              const nu = used.filter((_, j) => j !== k);
              setUsed(nu);
              onChange(nu.map((x) => words[x]));
            }}
          >
            {words[i]}
          </button>
        ))}
        {!used.length && <span className="tiny">Stuknij słowa poniżej we właściwej kolejności</span>}
      </div>
      <div className="tokens">
        {pool
          .filter((p) => !used.includes(p.i))
          .map((p) => (
            <button
              key={p.i}
              type="button"
              className="token"
              disabled={disabled}
              onClick={() => {
                const nu = [...used, p.i];
                setUsed(nu);
                onChange(nu.map((x) => words[x]));
              }}
            >
              {p.w}
            </button>
          ))}
      </div>
    </div>
  );
}

export function ExerciseView({
  ex,
  index,
  onResult,
  showKey,
}: {
  ex: Exercise;
  index: number;
  onResult: (ok: boolean) => void;
  showKey?: boolean;
}) {
  const [value, setValue] = useState<unknown>(ex.type === 'order' ? [] : ex.type === 'gap' ? '' : null);
  const [checked, setChecked] = useState<null | boolean>(null);

  const check = (v: unknown = value) => {
    if (checked !== null) return;
    const ok = checkExercise(ex, v);
    setChecked(ok);
    onResult(ok);
  };

  const keyText =
    ex.type === 'mcq' ? ex.options[ex.answer] : ex.type === 'gap' ? ex.answers.join(' / ') : ex.words.join(' ');

  return (
    <div className="ex">
      <div className="q">
        {index + 1}. {ex.type === 'order' ? 'Ułóż zdanie' + (ex.pl ? `: „${ex.pl}”` : '') : ex.q}
      </div>
      {ex.type === 'gap' && ex.hint && <div className="tiny">{ex.hint}</div>}

      {ex.type === 'mcq' && (
        <div className="opts" role="radiogroup">
          {ex.options.map((o, i) => {
            const cls =
              checked === null ? (value === i ? 'sel' : '') : i === ex.answer ? 'right' : value === i ? 'wrong' : '';
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={value === i}
                className={`opt ${cls}`}
                disabled={checked !== null}
                onClick={() => {
                  setValue(i);
                  check(i);
                }}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}

      {ex.type === 'gap' && (
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <input
            type="text"
            aria-label="Odpowiedź"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            disabled={checked !== null}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            style={{ flex: 1, minWidth: 160 }}
          />
          <button className="btn sm" type="submit" disabled={checked !== null || !(value as string).trim()}>
            Sprawdź
          </button>
        </form>
      )}

      {ex.type === 'order' && (
        <>
          <OrderExercise words={ex.words} value={value as string[]} onChange={setValue} disabled={checked !== null} />
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn sm" type="button" disabled={checked !== null || (value as string[]).length !== ex.words.length} onClick={() => check()}>
              Sprawdź
            </button>
          </div>
        </>
      )}

      {checked !== null && (
        <div className={`fb ${checked ? 'ok' : 'no'}`} role="status">
          {checked ? '✓ Dobrze. ' : `✗ Poprawnie: ${keyText}. `}
          {ex.explain}
        </div>
      )}
      {showKey && checked === null && <div className="fb ok">Klucz: {keyText}</div>}
    </div>
  );
}

/** A list of exercises that reports the score when all are answered. */
export function ExerciseSet({
  items,
  onDone,
  title,
}: {
  items: Exercise[];
  onDone?: (score: number) => void;
  title?: string;
}) {
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [showKey, setShowKey] = useState(false);
  const [round, setRound] = useState(0);
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const done = answered === items.length;

  useEffect(() => {
    if (done && items.length) onDone?.(correct / items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="card">
      <div className="row between">
        {title && <h3 style={{ margin: 0 }}>{title}</h3>}
        <button type="button" className="btn ghost sm" onClick={() => setShowKey((v) => !v)} aria-pressed={showKey}>
          {showKey ? 'Ukryj klucz' : 'Pokaż klucz'}
        </button>
      </div>
      <div key={round}>
        {items.map((ex, i) => (
          <ExerciseView key={i} ex={ex} index={i} showKey={showKey} onResult={(ok) => setResults((r) => ({ ...r, [i]: ok }))} />
        ))}
      </div>
      <div className="row between" style={{ marginTop: 8 }}>
        <span className="small muted" role="status">
          {answered}/{items.length} · poprawnie {correct}
        </span>
        {done && (
          <button
            type="button"
            className="btn secondary sm"
            onClick={() => {
              setResults({});
              setRound((r) => r + 1);
            }}
          >
            Spróbuj ponownie
          </button>
        )}
      </div>
    </div>
  );
}

export function BarChart({ data, height = 120, label }: { data: { label: string; value: number }[]; height?: number; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 320;
  const bw = w / data.length;
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${height + 22}`} role="img" aria-label={label}>
      {data.map((d, i) => {
        const h = (d.value / max) * height;
        return (
          <g key={i}>
            <rect x={i * bw + 3} y={height - h} width={bw - 6} height={Math.max(h, d.value ? 2 : 0)} rx={3} fill="var(--navy-2)" />
            {d.value > 0 && (
              <text x={i * bw + bw / 2} y={height - h - 4} textAnchor="middle" fontSize="9" fill="var(--ink-2)">
                {d.value}
              </text>
            )}
            {(i % 2 === 0 || data.length <= 7) && (
              <text x={i * bw + bw / 2} y={height + 16} textAnchor="middle" fontSize="9" fill="var(--ink-3)">
                {d.label}
              </text>
            )}
          </g>
        );
      })}
      <line x1={0} x2={w} y1={height} y2={height} stroke="var(--line)" />
    </svg>
  );
}

export function useToast(): [ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3500);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div className="toast" role="status">
      {msg}
    </div>
  ) : null;
  return [node, setMsg];
}
