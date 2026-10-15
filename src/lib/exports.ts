import type { Card, Dialogue, EmailTask, SpeakingTask } from '../types';
import { TOPIC_LABELS } from '../types';
import type { Feedback } from './feedback';
import type { LevelEstimate, TopicProgress } from './progress';
import { PdfWriter, pdfFilename } from './pdf';

export async function vocabularyPdf(cards: Card[], title = 'Słownictwo'): Promise<PdfWriter> {
  const w = await PdfWriter.create();
  w.title(title, `${cards.length} haseł · Insurance English`);
  for (const c of cards) {
    w.bold(`${c.en}  —  ${c.pl}`);
    w.muted(`${c.level} · ${TOPIC_LABELS[c.topic] ?? c.topic}`);
    if (c.def) w.para(c.def, 4);
    for (const e of c.examples) {
      w.para(`• ${e.en}`, 4);
      w.muted(e.pl, 7);
    }
    if (c.collocations.length) w.muted(`Kolokacje: ${c.collocations.join(', ')}`, 4);
    if (c.note) w.muted(`Uwaga: ${c.note}`, 4);
    w.space(2);
  }
  w.footer('Insurance English · słownictwo');
  return w;
}

export async function dialoguePdf(d: Dialogue): Promise<PdfWriter> {
  const w = await PdfWriter.create();
  w.title(d.title, `${d.titlePl} · ${d.level}`);
  w.para(d.situation);
  w.muted(`A: ${d.roles.A} · B: ${d.roles.B}`);
  w.heading('Dialog');
  for (const l of d.lines) {
    w.bold(`${l.s === 'A' ? d.roles.A : d.roles.B}:`);
    w.para(l.en, 4);
    w.muted(l.pl, 4);
  }
  w.heading('Przydatne zwroty');
  for (const e of d.expressions) {
    w.para(`• ${e.en}`);
    w.muted(e.pl, 4);
  }
  w.footer('Insurance English · dialog');
  return w;
}

export async function emailPdf(task: EmailTask, draft: { subject: string; body: string }, fb?: Feedback): Promise<PdfWriter> {
  const w = await PdfWriter.create();
  w.title(task.title, `${task.titlePl} · ${task.level}`);
  w.heading('Zadanie');
  w.para(task.brief);
  w.heading('Moja wersja');
  w.bold(`Subject: ${draft.subject || '(brak tematu)'}`);
  w.para(draft.body || '(pusto)');
  if (fb) {
    w.heading('Samoocena (automatyczna, regułowa)');
    w.para(`Wymagane elementy: ${Math.round(fb.score * 100)}% · słowa: ${fb.wordCount}`);
    for (const e of fb.elements) w.para(`${e.found ? '✓' : '–'} ${e.label}${e.found ? '' : ` (np. „${e.example}”)`}`, 4);
    for (const s of fb.suggestions) w.muted(`• ${s}`, 4);
  }
  w.heading('Wzór');
  w.bold(`Subject: ${task.model.subject}`);
  w.para(task.model.body);
  w.footer('Insurance English · e-mail');
  return w;
}

export async function transcriptPdf(task: SpeakingTask, text: string, fb: Feedback): Promise<PdfWriter> {
  const w = await PdfWriter.create();
  w.title(task.title, `Mówienie · ${task.level}`);
  w.heading('Zadanie');
  w.para(task.prompt);
  w.heading('Moja wypowiedź (transkrypcja)');
  w.para(text || '(pusto)');
  w.heading('Porównanie z wymaganiami');
  w.muted('Aplikacja nie poprawia gramatyki ani wymowy. Pokazuje, których wymaganych elementów brakuje w porównaniu z wzorem.');
  for (const e of fb.elements) w.para(`${e.found ? '✓' : '–'} ${e.label}${e.found ? '' : ` (np. „${e.example}”)`}`, 4);
  for (const s of fb.suggestions) w.muted(`• ${s}`, 4);
  w.heading('Wzorcowa odpowiedź');
  w.para(task.model);
  w.footer('Insurance English · mówienie');
  return w;
}

export interface ProgressSummary {
  streak: number;
  totalReviews: number;
  retention: number;
  cardsSeen: number;
  cardsTotal: number;
  levelLabel: string;
  estimates: LevelEstimate[];
  topics: TopicProgress[];
  recent: { label: string; score?: number; date: string }[];
}

export async function progressPdf(s: ProgressSummary): Promise<PdfWriter> {
  const w = await PdfWriter.create();
  w.title('Podsumowanie postępów', new Date().toLocaleDateString('pl-PL', { dateStyle: 'long' }));
  w.para(`Seria dni: ${s.streak} · powtórki łącznie: ${s.totalReviews} · skuteczność: ${Math.round(s.retention * 100)}%`);
  w.para(`Fiszki poznane: ${s.cardsSeen} z ${s.cardsTotal}`);
  w.heading(`Szacowany poziom: ${s.levelLabel}`);
  w.muted('Wewnętrzny szacunek aplikacji, a nie certyfikat CEFR. Wzór: 40% słownictwo utrwalone, 30% lekcje i gramatyka, 30% dialogi, e-maile, mówienie i słuchanie.');
  for (const e of s.estimates)
    w.para(
      `${e.level}: ${Math.round(e.score * 100)}%  (słownictwo ${Math.round(e.vocab * 100)}%, wiedza ${Math.round(e.knowledge * 100)}%, komunikacja ${Math.round(e.communication * 100)}%)${e.reached ? ' ✓' : ''}`,
      4,
    );
  w.heading('Tematy');
  for (const t of s.topics) w.para(`${TOPIC_LABELS[t.topic]}: poznane ${t.seen}/${t.total}, utrwalone ${t.mature}`, 4);
  if (s.recent.length) {
    w.heading('Ostatnia aktywność');
    for (const r of s.recent) w.para(`${r.date} · ${r.label}${r.score !== undefined ? ` · ${Math.round(r.score * 100)}%` : ''}`, 4);
  }
  w.footer('Insurance English · postępy');
  return w;
}

export { pdfFilename };
