import { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPage() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
  const isAndroid = /Android/.test(ua);
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    const done = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', h);
    window.addEventListener('appinstalled', done);
    return () => {
      window.removeEventListener('beforeinstallprompt', h);
      window.removeEventListener('appinstalled', done);
    };
  }, []);

  return (
    <div>
      <PageHeader title="Instalacja" back="/settings" />
      {standalone || installed ? (
        <div className="notice good">Aplikacja jest zainstalowana. Działa offline po pierwszym pełnym załadowaniu.</div>
      ) : evt ? (
        <div className="card">
          <p>Ta przeglądarka pozwala zainstalować aplikację jednym przyciskiem.</p>
          <button
            className="btn block"
            onClick={async () => {
              await evt.prompt();
              const c = await evt.userChoice;
              if (c.outcome === 'accepted') setInstalled(true);
              setEvt(null);
            }}
          >
            Zainstaluj aplikację
          </button>
        </div>
      ) : null}

      <div className="card" style={isIOS ? { borderLeft: '5px solid var(--amber)' } : undefined}>
        <h3>iPhone / iPad (Safari)</h3>
        <ol className="small" style={{ paddingLeft: 20 }}>
          <li>Otwórz tę stronę w Safari (nie w innej przeglądarce).</li>
          <li>Stuknij przycisk Udostępnij (kwadrat ze strzałką).</li>
          <li>Wybierz „Do ekranu początkowego” i potwierdź.</li>
          <li>Uruchom aplikację z ikony raz przy włączonym internecie, aby pobrała wszystkie treści.</li>
        </ol>
        <p className="tiny">
          Na iOS dane aplikacji z ekranu początkowego są oddzielone od Safari. Rozpoznawanie mowy w trybie aplikacji może być niedostępne, a wtedy wpisujesz
          tekst ręcznie.
        </p>
      </div>

      <div className="card" style={isAndroid ? { borderLeft: '5px solid var(--amber)' } : undefined}>
        <h3>Android (Chrome)</h3>
        <ol className="small" style={{ paddingLeft: 20 }}>
          <li>Otwórz stronę w Chrome.</li>
          <li>Stuknij menu ⋮ i wybierz „Zainstaluj aplikację” albo „Dodaj do ekranu głównego”.</li>
          <li>Uruchom raz z internetem. Potem działa offline.</li>
          <li>Jeśli lektor nie mówi: zainstaluj angielskie dane głosowe w ustawieniach zamiany tekstu na mowę.</li>
        </ol>
      </div>

      <div className="card">
        <h3>Komputer (Chrome, Edge)</h3>
        <p className="small">Kliknij ikonę instalacji w pasku adresu albo menu → „Zainstaluj Insurance English”.</p>
      </div>
    </div>
  );
}
