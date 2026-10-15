import { useEffect, useRef, useState } from 'react';
import { getRecognition, recorderSupported } from '../lib/tts';
import { useOnline } from '../lib/hooks';

/**
 * Optional voice capture:
 * - MediaRecorder: record and play back locally (audio stays in memory, never uploaded).
 * - Web Speech recognition: only if the browser has it. In Chrome it usually needs internet.
 * - Always available fallback: type what you said.
 */
export function SpeechInput({ value, onChange, rows = 5, label = 'Twoja wypowiedź (transkrypcja)' }: { value: string; onChange: (v: string) => void; rows?: number; label?: string }) {
  const online = useOnline();
  const Recognition = getRecognition();
  const canRecord = recorderSupported();
  const [recording, setRecording] = useState(false);
  const [listening, setListening] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recogRef = useRef<InstanceType<NonNullable<ReturnType<typeof getRecognition>>> | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(
    () => () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      recRef.current?.stream.getTracks().forEach((t) => t.stop());
      recogRef.current?.stop();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      recRef.current = mr;
      setRecording(true);
    } catch {
      setError('Brak dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki.');
    }
  };

  const stopRecording = () => {
    recRef.current?.stop();
    setRecording(false);
  };

  const startRecognition = () => {
    if (!Recognition) return;
    setError(null);
    const r = new Recognition();
    r.lang = 'en-GB';
    r.interimResults = false;
    r.continuous = true;
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const text = last?.[0]?.transcript ?? '';
      if (text) onChange(`${valueRef.current}${valueRef.current ? ' ' : ''}${text.trim()}`);
    };
    r.onerror = (e) =>
      setError(
        e.error === 'network'
          ? 'Rozpoznawanie mowy wymaga internetu w tej przeglądarce. Wpisz tekst ręcznie.'
          : e.error === 'not-allowed'
            ? 'Brak zgody na mikrofon.'
            : `Rozpoznawanie mowy niedostępne (${e.error}). Wpisz tekst ręcznie.`,
      );
    r.onend = () => setListening(false);
    try {
      r.start();
      recogRef.current = r;
      setListening(true);
    } catch {
      setError('Nie udało się uruchomić rozpoznawania mowy.');
    }
  };

  const stopRecognition = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        {canRecord ? (
          recording ? (
            <button type="button" className="btn danger sm" onClick={stopRecording}>
              ■ Zatrzymaj nagranie
            </button>
          ) : (
            <button type="button" className="btn secondary sm" onClick={startRecording}>
              ● Nagraj się
            </button>
          )
        ) : (
          <span className="tiny">Nagrywanie niedostępne w tej przeglądarce.</span>
        )}
        {Recognition ? (
          listening ? (
            <button type="button" className="btn danger sm" onClick={stopRecognition}>
              ■ Zakończ dyktowanie
            </button>
          ) : (
            <button type="button" className="btn secondary sm" onClick={startRecognition}>
              🎙 Dyktuj (rozpoznawanie)
            </button>
          )
        ) : (
          <span className="tiny">Rozpoznawanie mowy niedostępne: wpisz, co powiedziałeś.</span>
        )}
      </div>
      {audioUrl && <audio controls src={audioUrl} style={{ width: '100%', marginBottom: 8 }} aria-label="Twoje nagranie" />}
      {Recognition && !online && <div className="tiny">Jesteś offline: rozpoznawanie mowy może nie działać. Nagranie i wpisywanie działają.</div>}
      {error && <div className="fb no">{error}</div>}
      <label className="field" style={{ marginTop: 8 }}>
        <span>{label}</span>
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} autoCapitalize="sentences" spellCheck />
      </label>
      <p className="tiny">Nagrania są tylko w pamięci tej karty przeglądarki i nigdzie nie są wysyłane.</p>
    </div>
  );
}
