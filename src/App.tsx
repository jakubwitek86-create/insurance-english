import { useEffect } from 'react';
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useOnline } from './lib/hooks';
import { useSettings } from './lib/settings';
import { Dashboard } from './pages/Dashboard';
import { Placement } from './pages/Placement';
import { SessionPage } from './pages/Session';
import { FlashcardsPage } from './pages/Flashcards';
import { VocabularyPage } from './pages/Vocabulary';
import { LessonsList, LessonDetail } from './pages/Lessons';
import { GrammarList, GrammarDetail } from './pages/Grammar';
import { DialoguesList, DialogueDetail } from './pages/Dialogues';
import { EmailsList, EmailDetail } from './pages/Emails';
import { SpeakingList, SpeakingDetail } from './pages/Speaking';
import { ListeningList, ListeningDetail } from './pages/Listening';
import { PracticeHub } from './pages/Practice';
import { StatsPage } from './pages/Stats';
import { SettingsPage } from './pages/Settings';
import { InstallPage } from './pages/Install';

function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(e) {
      console.warn('Service worker registration failed', e);
    },
  });
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 5000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  if (needRefresh)
    return (
      <div className="toast" role="alert">
        <span>Dostępna jest nowa wersja aplikacji. Twoje postępy zostaną zachowane.</span>
        <button className="btn sm" onClick={() => updateServiceWorker(true)}>
          Odśwież
        </button>
        <button className="btn ghost sm" style={{ color: 'inherit' }} onClick={() => setNeedRefresh(false)} aria-label="Później">
          ✕
        </button>
      </div>
    );
  if (offlineReady)
    return (
      <div className="toast" role="status">
        Aplikacja jest gotowa do pracy offline.
      </div>
    );
  return null;
}

function ThemeSync() {
  const { theme } = useSettings();
  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'auto') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

const NAV = [
  { to: '/', label: 'Start', ico: '⌂', end: true },
  { to: '/session', label: 'Sesja', ico: '▶' },
  { to: '/cards', label: 'Fiszki', ico: '❏' },
  { to: '/practice', label: 'Ćwiczenia', ico: '✎' },
  { to: '/stats', label: 'Postępy', ico: '▤' },
];

function Shell() {
  const online = useOnline();
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Insurance English, strona główna">
          <span className="brand-mark" aria-hidden>
            EN
          </span>
          Insurance English
        </Link>
        <span className="spacer" />
        <span className={`status ${online ? '' : 'offline'}`} role="status" aria-live="polite">
          {online ? 'Online' : 'Offline'}
        </span>
        <Link to="/settings" className="icon-btn" aria-label="Ustawienia">
          ⚙
        </Link>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/cards" element={<FlashcardsPage />} />
          <Route path="/vocab" element={<VocabularyPage />} />
          <Route path="/practice" element={<PracticeHub />} />
          <Route path="/lessons" element={<LessonsList />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/grammar" element={<GrammarList />} />
          <Route path="/grammar/:id" element={<GrammarDetail />} />
          <Route path="/dialogues" element={<DialoguesList />} />
          <Route path="/dialogues/:id" element={<DialogueDetail />} />
          <Route path="/emails" element={<EmailsList />} />
          <Route path="/emails/:id" element={<EmailDetail />} />
          <Route path="/speaking" element={<SpeakingList />} />
          <Route path="/speaking/:id" element={<SpeakingDetail />} />
          <Route path="/listening" element={<ListeningList />} />
          <Route path="/listening/:id" element={<ListeningDetail />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/install" element={<InstallPage />} />
          <Route
            path="*"
            element={
              <div className="card">
                <h1>Nie ma takiej strony</h1>
                <Link to="/" className="btn">
                  Wróć na start
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <nav className="bottomnav" aria-label="Główna nawigacja">
        <ul>
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} end={n.end}>
                <span className="ico" aria-hidden>
                  {n.ico}
                </span>
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <UpdatePrompt />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Ask the browser not to evict our IndexedDB data (result shown in Settings).
    if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
  }, []);
  return (
    <HashRouter>
      <ThemeSync />
      <ScrollTop />
      <Shell />
    </HashRouter>
  );
}
