import { describe, expect, it, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setFontData, pdfFilename } from './pdf';
import { vocabularyPdf, dialoguePdf, emailPdf, transcriptPdf, progressPdf } from './exports';
import { builtInCards, dialogues, emails, speakingTasks } from '../content';
import { evaluateText } from './feedback';

const decoder = new TextDecoder('latin1');

beforeAll(() => {
  const font = (f: string) => readFileSync(resolve(__dirname, '../../public/fonts', f)).toString('base64');
  setFontData(font('DejaVuSans.ttf'), font('DejaVuSans-Bold.ttf'));
});

const isPdf = (buf: ArrayBuffer) => decoder.decode(buf.slice(0, 5)) === '%PDF-';

describe('PDF generation', () => {
  it('builds a vocabulary PDF with the embedded Unicode font', async () => {
    const w = await vocabularyPdf(builtInCards.slice(0, 20));
    const buf = w.output();
    expect(isPdf(buf)).toBe(true);
    expect(decoder.decode(buf)).toContain('DejaVu');
    expect(w.doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it('builds dialogue, email, transcript and progress PDFs', async () => {
    const d = await dialoguePdf(dialogues[0]);
    expect(isPdf(d.output())).toBe(true);

    const e = emails[0];
    const fb = evaluateText(e.model.body, e.required);
    const ep = await emailPdf(e, { subject: 'Zażółć gęślą jaźń', body: 'Treść ąęółśżźćń' }, fb);
    expect(isPdf(ep.output())).toBe(true);

    const s = speakingTasks[0];
    const tp = await transcriptPdf(s, 'My name is Jakub', evaluateText('My name is Jakub', s.required));
    expect(isPdf(tp.output())).toBe(true);

    const pp = await progressPdf({
      streak: 3,
      totalReviews: 40,
      retention: 0.8,
      cardsSeen: 30,
      cardsTotal: 150,
      levelLabel: 'A2',
      estimates: [{ level: 'A2', vocab: 0.5, knowledge: 0.6, communication: 0.7, score: 0.59, reached: false }],
      topics: [{ topic: 'claims', total: 20, seen: 10, mature: 2 }],
      recent: [{ label: 'Lekcja 1', score: 0.9, date: '15 paź' }],
    });
    expect(isPdf(pp.output())).toBe(true);
  });

  it('makes safe ASCII file names', () => {
    expect(pdfFilename('Słownictwo – B2')).toMatch(/^slownictwo-b2-\d{4}-\d{2}-\d{2}\.pdf$/);
  });
});
