import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, USER_TABLES } from '../db/db';
import { exportAll, importAll, validateBackup, downloadJson, type Backup } from '../db/backup';
import { setSetting, useSettings, type Direction } from '../lib/settings';
import { englishVoices, getRecognition, loadVoices, recorderSupported, speak, ttsSupported } from '../lib/tts';
import { builtInCards, CONTENT_VERSION } from '../content';
import { LEVELS, type Level } from '../types';
import { PageHeader, useToast } from '../components/ui';

function Capabilities() {
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [usage, setUsage] = useState<string>('');
  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null));
    navigator.storage
      ?.estimate?.()
      .then((e) => e.usage !== undefined && setUsage(`${(e.usage / 1024 / 1024).toFixed(1)} MB`))
      .catch(() => {});
  }, []);
  const rows: [string, boolean | null, string][] = [
    ['Pamięć lokalna (IndexedDB)', 'indexedDB' in window, 'Postępy i ustawienia'],
    ['Trwałe przechowywanie', persisted, persisted ? 'Przeglądarka nie usunie danych automatycznie' : 'Dane mogą zostać usunięte przy braku miejsca, rób kopie'],
    ['Tryb offline (service worker)', 'serviceWorker' in navigator, 'Działa po pierwszym pełnym załadowaniu'],
    ['Synteza mowy (TTS)', ttsSupported(), 'Odsłuchiwanie słów i dialogów'],
    ['Nagrywanie głosu', recorderSupported(), 'Tylko lokalnie, nic nie jest wysyłane'],
    ['Rozpoznawanie mowy', !!getRecognition(), 'Opcjonalne; w Chrome zwykle wymaga internetu'],
  ];
  return (
    <div className="card">
      <h3>Możliwości tej przeglądarki</h3>
      {rows.map(([name, ok, note]) => (
        <div key={name} className="row between small" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)', flexWrap: 'nowrap' }}>
          <span>
            {name}
            <br />
            <span className="tiny">{note}</span>
          </span>
          <strong style={{ color: ok ? 'var(--good)' : ok === null ? 'var(--ink-3)' : 'var(--amber)' }}>{ok ? 'tak' : ok === null ? '?' : 'nie'}</strong>
        </div>
      ))}
      {usage && <p className="tiny" style={{ marginTop: 8 }}>Zajęte miejsce (aplikacja + dane): {usage}</p>}
    </div>
  );
}

export function SettingsPage() {
  const s = useSettings();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [toast, showToast] = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const review = builtInCards.filter((c) => c.needsReview);

  useEffect(() => {
    loadVoices().then((v) => setVoices(englishVoices(v)));
  }, []);

  const doExport = async () => {
    const data = await exportAll();
    downloadJson(data, `insurance-english-backup-${new Date().toISOString().slice(0, 10)}.json`);
    await setSetting('lastBackup', Date.now());
    showToast('Kopia zapasowa pobrana. Zapisz ją w chmurze lub na komputerze.');
  };

  const onFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      const errors = validateBackup(data);
      if (errors.length) return showToast(`Nieprawidłowa kopia: ${errors[0]}`);
      setPending(data as Backup);
    } catch {
      showToast('To nie jest poprawny plik JSON.');
    }
  };

  const confirmImport = async () => {
    if (!pending) return;
    try {
      await importAll(pending);
      setPending(null);
      showToast('Przywrócono dane z kopii.');
    } catch (e) {
      showToast(`Import nieudany: ${(e as Error).message}`);
    }
  };

  const clearAll = async () => {
    if (!confirm('Usunąć WSZYSTKIE postępy, szkice i własne fiszki z tego urządzenia? Tego nie można cofnąć.')) return;
    await db.transaction('rw', USER_TABLES.map((t) => db.table(t)), async () => {
      for (const t of USER_TABLES) await db.table(t).clear();
    });
    showToast('Dane usunięte.');
  };

  return (
    <div>
      <PageHeader title="Ustawienia" back="/" />

      <div className="card">
        <h3>Nauka</h3>
        <label className="field">
          <span>Nowe karty dziennie: {s.newPerDay}</span>
          <input type="range" min={0} max={30} step={1} value={s.newPerDay} onChange={(e) => setSetting('newPerDay', Number(e.target.value))} />
        </label>
        <label className="field">
          <span>Kierunek fiszek</span>
          <select value={s.direction} onChange={(e) => setSetting('direction', e.target.value as Direction)}>
            <option value="mixed">Mieszany (EN→PL i PL→EN)</option>
            <option value="en-pl">EN → PL (rozpoznawanie)</option>
            <option value="pl-en">PL → EN (przypominanie)</option>
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={s.typedAnswer} onChange={(e) => setSetting('typedAnswer', e.target.checked)} />
          <span>
            Wpisuj odpowiedź przy PL → EN
            <br />
            <span className="tiny">Trudniejsze, ale lepiej utrwala pisownię.</span>
          </span>
        </label>
        <label className="field">
          <span>Poziom startowy nowych kart</span>
          <select value={s.startLevel} onChange={(e) => setSetting('startLevel', e.target.value as Level)}>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Wyjaśnienia</span>
          <select value={s.explainLang} onChange={(e) => setSetting('explainLang', e.target.value as 'pl' | 'en')}>
            <option value="pl">Najpierw po polsku</option>
            <option value="en">Najpierw po angielsku (definicje + streszczenia EN)</option>
          </select>
        </label>
        <Link to="/placement" className="btn secondary sm">
          Powtórz test poziomujący
        </Link>
      </div>

      <div className="card">
        <h3>Głos lektora</h3>
        {!ttsSupported() ? (
          <p className="small muted">Ta przeglądarka nie obsługuje syntezy mowy. Ćwiczenia działają z transkrypcją.</p>
        ) : voices.length === 0 ? (
          <div className="notice small">
            Nie znaleziono angielskiego głosu. Na Androidzie: Ustawienia → System → Język → Zamiana tekstu na mowę → zainstaluj dane głosowe dla
            angielskiego (UK). Po instalacji głos działa też offline.
          </div>
        ) : (
          <label className="field">
            <span>Głos</span>
            <select value={s.voiceURI} onChange={(e) => setSetting('voiceURI', e.target.value)}>
              <option value="">Automatycznie (preferuj en-GB)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}){v.localService ? '' : ' · online'}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="field">
          <span>Tempo: {s.rate.toFixed(2)}</span>
          <input type="range" min={0.6} max={1.2} step={0.05} value={s.rate} onChange={(e) => setSetting('rate', Number(e.target.value))} />
        </label>
        <button
          className="btn secondary sm"
          disabled={!ttsSupported()}
          onClick={() => speak('Subject to the policy wording, the claim should be covered.', { rate: s.rate, voiceURI: s.voiceURI })}
        >
          🔊 Testuj głos
        </button>
        <p className="tiny" style={{ marginTop: 8 }}>Głosy oznaczone „online” wymagają internetu. Lokalne działają offline.</p>
      </div>

      <div className="card">
        <h3>Wygląd</h3>
        <div className="seg" role="group" aria-label="Motyw">
          {(
            [
              ['auto', 'Systemowy'],
              ['light', 'Jasny'],
              ['dark', 'Ciemny'],
            ] as const
          ).map(([k, v]) => (
            <button key={k} aria-pressed={s.theme === k} onClick={() => setSetting('theme', k)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Kopia zapasowa</h3>
        <div className="notice small">
          Postępy są zapisane tylko w tej przeglądarce na tym urządzeniu. Wyczyszczenie danych przeglądarki, odinstalowanie aplikacji lub zmiana telefonu
          je usunie. Pamięć lokalna nie zastępuje kopii zapasowej.
        </div>
        <p className="small muted">Ostatnia kopia: {s.lastBackup ? new Date(s.lastBackup).toLocaleString('pl-PL') : 'nigdy'}</p>
        <div className="row">
          <button className="btn" onClick={doExport}>
            Eksportuj wszystko (JSON)
          </button>
          <button className="btn secondary" onClick={() => fileRef.current?.click()}>
            Przywróć z pliku
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Plik kopii zapasowej"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = '';
            }}
          />
        </div>
        {pending && (
          <div className="notice bad" style={{ marginTop: 12 }}>
            <p>
              Kopia z {new Date(pending.exportedAt).toLocaleString('pl-PL')} zastąpi wszystkie obecne dane ({pending.tables.reviews?.length ?? 0} powtórek,{' '}
              {pending.tables.results?.length ?? 0} wyników). Kontynuować?
            </p>
            <div className="row">
              <button className="btn danger sm" onClick={confirmImport}>
                Tak, przywróć
              </button>
              <button className="btn ghost sm" onClick={() => setPending(null)}>
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>

      <Capabilities />

      {review.length > 0 && (
        <details className="card flat">
          <summary>Terminy do weryfikacji ({review.length})</summary>
          <p className="small muted">
            Te hasła zależą od jurysdykcji albo nie mają jednoznacznego polskiego odpowiednika. Sprawdź je w praktyce swojego rynku.
          </p>
          {review.map((c) => (
            <p key={c.id} className="small">
              <strong>{c.en}</strong>: {c.pl}
            </p>
          ))}
        </details>
      )}

      <div className="card flat">
        <h3>O aplikacji</h3>
        <p className="small">
          Wersja treści {CONTENT_VERSION}. Działa w całości na urządzeniu, bez konta i bez serwera. Planowanie powtórek (SM-2) i dobór ćwiczeń są
          regułowe: priorytet mają zapomniane karty i obszary z najniższym wynikiem. Aplikacja nie używa sztucznej inteligencji.
        </p>
        <Link to="/install" className="small">
          Jak zainstalować na telefonie →
        </Link>
      </div>

      <button className="btn danger" onClick={clearAll}>
        Usuń wszystkie dane
      </button>
      {toast}
    </div>
  );
}
