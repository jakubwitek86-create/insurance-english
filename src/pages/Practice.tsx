import { Link } from 'react-router-dom';
import { lessons, grammar, dialogues, emails, speakingTasks, listeningItems, builtInCards } from '../content';
import { useBestScores } from '../lib/hooks';
import { PageHeader } from '../components/ui';

function Module({ to, icon, title, sub, done, total }: { to: string; icon: string; title: string; sub: string; done: number; total: number }) {
  return (
    <Link to={to} className="listlink">
      <span aria-hidden style={{ fontSize: '1.4rem', width: 30, textAlign: 'center' }}>
        {icon}
      </span>
      <span className="grow">
        <span className="title">{title}</span>
        <br />
        <span className="sub">{sub}</span>
      </span>
      <span className="tiny">
        {done}/{total}
      </span>
    </Link>
  );
}

export function PracticeHub() {
  const l = useBestScores('lesson');
  const g = useBestScores('grammar');
  const d = useBestScores('dialogue');
  const e = useBestScores('email');
  const s = useBestScores('speaking');
  const li = useBestScores('listening');
  return (
    <div>
      <PageHeader title="Ćwiczenia">
        <p className="small muted">Każdy moduł działa osobno. Liczby pokazują, ile elementów już przerobiłeś.</p>
      </PageHeader>
      <Module to="/lessons" icon="📘" title="Ścieżka lekcji" sub="A2 → B2, sytuacje z pracy brokera" done={l.size} total={lessons.length} />
      <Module to="/dialogues" icon="☎" title="Rozmowy telefoniczne" sub="Czytaj, słuchaj, układaj, wybieraj, mów" done={d.size} total={dialogues.length} />
      <Module to="/emails" icon="✉" title="E-maile" sub="Pisanie z listą kontrolną i wzorem" done={e.size} total={emails.length} />
      <Module to="/grammar" icon="✎" title="Gramatyka" sub="Typowe błędy Polaków w kontekście ubezpieczeń" done={g.size} total={grammar.length} />
      <Module to="/speaking" icon="🎙" title="Mówienie" sub="Nagrywanie, dyktowanie lub wpisywanie" done={s.size} total={speakingTasks.length} />
      <Module to="/listening" icon="🎧" title="Słuchanie" sub="Wiadomości głosowe, transkrypcja ukryta" done={li.size} total={listeningItems.length} />
      <Module to="/vocab" icon="❏" title="Słownik" sub="Wyszukiwanie, własne fiszki, PDF" done={0} total={builtInCards.length} />
      <p className="tiny" style={{ marginTop: 14 }}>
        Wszystko działa offline. Dobór ćwiczeń w sesji jest regułowy (najsłabsze obszary najpierw), bez sztucznej inteligencji.
      </p>
    </div>
  );
}
