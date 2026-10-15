import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placement, placementLevel } from '../content';
import { setSetting } from '../lib/settings';
import { recordResult } from '../lib/hooks';
import type { Level } from '../types';
import { LevelTag, PageHeader } from '../components/ui';

export function Placement() {
  const nav = useNavigate();
  const [answers, setAnswers] = useState<(number | null)[]>(placement.map(() => null));
  const [result, setResult] = useState<Level | null>(null);
  const done = answers.every((a) => a !== null);

  const finish = async () => {
    const correct: Record<Level, number> = { A2: 0, B1: 0, B2: 0 };
    placement.forEach((q, i) => {
      if (answers[i] === q.answer) correct[q.level]++;
    });
    const lvl = placementLevel(correct);
    const total = correct.A2 + correct.B1 + correct.B2;
    await setSetting('startLevel', lvl);
    await setSetting('placementDone', true);
    await recordResult('placement', 'placement', lvl, total / placement.length, JSON.stringify(correct));
    setResult(lvl);
  };

  if (result)
    return (
      <div>
        <PageHeader title="Wynik testu" />
        <div className="card">
          <p>
            Nowe słownictwo zaczniemy od poziomu <LevelTag level={result} />.
          </p>
          <p className="small muted">
            To tylko punkt startowy dla kolejności fiszek, a nie ocena poziomu CEFR. Możesz go zmienić w Ustawieniach. Karty z niższego poziomu
            pojawią się później jako powtórka.
          </p>
          <button className="btn block" onClick={() => nav('/session')}>
            Zacznij pierwszą sesję
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <PageHeader title="Test poziomujący" back="/">
        <p className="muted small">12 pytań, bez limitu czasu. Jeśli nie wiesz, wybierz odpowiedź, która wydaje się najbardziej naturalna.</p>
      </PageHeader>
      <div className="card">
        {placement.map((q, i) => (
          <div className="ex" key={i}>
            <div className="q">
              {i + 1}. {q.q}
            </div>
            <div className="opts" role="radiogroup" aria-label={`Pytanie ${i + 1}`}>
              {q.options.map((o, j) => (
                <button
                  key={j}
                  type="button"
                  role="radio"
                  aria-checked={answers[i] === j}
                  className={`opt ${answers[i] === j ? 'sel' : ''}`}
                  onClick={() => setAnswers((a) => a.map((x, k) => (k === i ? j : x)))}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn block" disabled={!done} onClick={finish}>
        {done ? 'Zobacz wynik' : `Odpowiedz na wszystkie pytania (${answers.filter((a) => a !== null).length}/12)`}
      </button>
    </div>
  );
}
