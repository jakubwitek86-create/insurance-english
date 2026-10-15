import type { jsPDF } from 'jspdf';

/**
 * Client-side PDF generation. Polish diacritics need a Unicode font, so a DejaVu Sans
 * subset (Latin + Latin Extended-A) is loaded from /fonts and embedded. The font files are
 * precached by the service worker, so export works offline.
 */

let fontCache: { regular: string; bold: string } | null = null;

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** Tests (Node) inject the font bytes directly. */
export function setFontData(regular: string, bold: string) {
  fontCache = { regular, bold };
}

async function loadFonts(): Promise<{ regular: string; bold: string }> {
  if (fontCache) return fontCache;
  const base = import.meta.env.BASE_URL;
  const [r, b] = await Promise.all([
    fetch(`${base}fonts/DejaVuSans.ttf`).then((x) => {
      if (!x.ok) throw new Error('Nie udało się wczytać czcionki PDF.');
      return x.arrayBuffer();
    }),
    fetch(`${base}fonts/DejaVuSans-Bold.ttf`).then((x) => {
      if (!x.ok) throw new Error('Nie udało się wczytać czcionki PDF.');
      return x.arrayBuffer();
    }),
  ]);
  fontCache = { regular: toBase64(r), bold: toBase64(b) };
  return fontCache;
}

export class PdfWriter {
  doc: jsPDF;
  y = 20;
  readonly margin = 18;
  readonly width: number;
  readonly height: number;

  private constructor(doc: jsPDF) {
    this.doc = doc;
    this.width = doc.internal.pageSize.getWidth();
    this.height = doc.internal.pageSize.getHeight();
  }

  static async create(): Promise<PdfWriter> {
    const [fonts, { jsPDF: JsPDF }] = await Promise.all([loadFonts(), import('jspdf')]);
    const doc = new JsPDF({ unit: 'mm', format: 'a4' });
    doc.addFileToVFS('DejaVuSans.ttf', fonts.regular);
    doc.addFont('DejaVuSans.ttf', 'DejaVu', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', fonts.bold);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVu', 'bold');
    doc.setFont('DejaVu', 'normal');
    return new PdfWriter(doc);
  }

  private ensure(h: number) {
    if (this.y + h > this.height - 16) {
      this.doc.addPage();
      this.y = 20;
    }
  }

  private block(text: string, size: number, style: 'normal' | 'bold', gap: number, color: [number, number, number] = [20, 20, 20], indent = 0) {
    this.doc.setFont('DejaVu', style);
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
    const lineH = size * 0.45;
    const lines: string[] = this.doc.splitTextToSize(text, this.width - this.margin * 2 - indent);
    for (const line of lines) {
      this.ensure(lineH);
      this.doc.text(line, this.margin + indent, this.y);
      this.y += lineH;
    }
    this.y += gap;
  }

  title(text: string, subtitle?: string) {
    this.block(text, 18, 'bold', 2, [18, 38, 66]);
    if (subtitle) this.block(subtitle, 10, 'normal', 4, [90, 90, 90]);
    this.doc.setDrawColor(232, 170, 66);
    this.doc.setLineWidth(0.8);
    this.doc.line(this.margin, this.y - 2, this.width - this.margin, this.y - 2);
    this.y += 4;
  }

  heading(text: string) {
    this.ensure(14);
    this.y += 2;
    this.block(text, 13, 'bold', 2, [18, 38, 66]);
  }

  para(text: string, indent = 0) {
    for (const p of text.split('\n')) this.block(p || ' ', 10.5, 'normal', 1.2, [20, 20, 20], indent);
    this.y += 1;
  }

  bold(text: string, indent = 0) {
    this.block(text, 10.5, 'bold', 1, [20, 20, 20], indent);
  }

  muted(text: string, indent = 0) {
    this.block(text, 9.5, 'normal', 1.5, [100, 100, 100], indent);
  }

  space(mm = 3) {
    this.y += mm;
  }

  footer(label: string) {
    const n = this.doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      this.doc.setPage(i);
      this.doc.setFont('DejaVu', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(140, 140, 140);
      this.doc.text(`${label} · ${i}/${n}`, this.margin, this.height - 8);
    }
  }

  output(): ArrayBuffer {
    return this.doc.output('arraybuffer');
  }

  save(filename: string) {
    this.doc.save(filename);
  }
}

export function pdfFilename(stem: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const safe = stem
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${safe || 'export'}-${date}.pdf`;
}
