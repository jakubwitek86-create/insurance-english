import type { Exercise, RequiredElement } from '../types';

/** Lower-case, unify apostrophes/quotes, drop punctuation, collapse spaces. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[^a-z0-9ąćęłńóśźż'\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, 'i am'],
  [/\bwe're\b/g, 'we are'],
  [/\byou're\b/g, 'you are'],
  [/\bthey're\b/g, 'they are'],
  [/\bit's\b/g, 'it is'],
  [/\bthat's\b/g, 'that is'],
  [/\bi'll\b/g, 'i will'],
  [/\bwe'll\b/g, 'we will'],
  [/\bi'd\b/g, 'i would'],
  [/\bwe'd\b/g, 'we would'],
  [/\bi've\b/g, 'i have'],
  [/\bwe've\b/g, 'we have'],
  [/\bdon't\b/g, 'do not'],
  [/\bdoesn't\b/g, 'does not'],
  [/\bisn't\b/g, 'is not'],
  [/\baren't\b/g, 'are not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\bhaven't\b/g, 'have not'],
  [/\bhasn't\b/g, 'has not'],
  [/\bwasn't\b/g, 'was not'],
  [/\bcouldn't\b/g, 'could not'],
  [/\bwouldn't\b/g, 'would not'],
];

/** normalize + expand contractions, so "I'm" and "I am" match each other. */
export function canon(s: string): string {
  let out = normalize(s);
  for (const [re, rep] of CONTRACTIONS) out = out.replace(re, rep);
  return ` ${out} `;
}

export function containsPhrase(text: string, phrase: string): boolean {
  return canon(text).includes(canon(phrase));
}

export function checkGap(input: string, answers: string[]): boolean {
  const a = canon(input).trim();
  return a.length > 0 && answers.some((x) => canon(x).trim() === a);
}

export function checkOrder(input: string[], correct: string[]): boolean {
  return canon(input.join(' ')) === canon(correct.join(' '));
}

export function checkExercise(ex: Exercise, value: unknown): boolean {
  switch (ex.type) {
    case 'mcq':
      return value === ex.answer;
    case 'gap':
      return typeof value === 'string' && checkGap(value, ex.answers);
    case 'order':
      return Array.isArray(value) && checkOrder(value as string[], ex.words);
  }
}

export const POLITE_MARKERS = [
  'please',
  'could you',
  'would you',
  'thank you',
  'thanks',
  'i am afraid',
  'i would recommend',
  'let me',
  'i appreciate',
  'kindly',
  'i understand',
  'i apologise',
  'i apologize',
  'sorry',
  'would it be possible',
  'i would be grateful',
  'kind regards',
  'best regards',
];

export interface ElementCheck {
  label: string;
  found: boolean;
  matched?: string;
  example: string;
}

export interface Feedback {
  score: number; // 0..1, share of required elements found
  elements: ElementCheck[];
  polite: boolean;
  wordCount: number;
  suggestions: string[];
}

/**
 * Deterministic feedback: each required element passes if ANY accepted phrase appears.
 * Alternatives are listed in content, so valid paraphrases are not penalised.
 */
export function evaluateText(text: string, required: RequiredElement[], minWords = 15): Feedback {
  const elements: ElementCheck[] = required.map((r) => {
    const matched = r.accept.find((p) => containsPhrase(text, p));
    return { label: r.label, found: !!matched, matched, example: r.accept[0] };
  });
  const polite = POLITE_MARKERS.some((p) => containsPhrase(text, p));
  const wordCount = normalize(text).split(' ').filter(Boolean).length;
  const found = elements.filter((e) => e.found).length;
  const score = required.length ? found / required.length : 0;

  const suggestions: string[] = [];
  for (const e of elements.filter((x) => !x.found)) {
    if (suggestions.length >= 2) break;
    suggestions.push(`Brakuje: ${e.label}. Np. „${e.example}”.`);
  }
  if (!polite && suggestions.length < 3)
    suggestions.push('Dodaj zwrot grzecznościowy, np. „Could you…”, „Thank you for…”, „I’m afraid…”.');
  if (wordCount < minWords && suggestions.length < 3)
    suggestions.push(`Odpowiedź jest krótka (${wordCount} słów). Rozwiń ją o szczegóły lub kolejny krok.`);
  return { score, elements, polite, wordCount, suggestions };
}

const STOP = new Set(
  'a an the to of and or in on at for with is are be i you we it that this my your our will would can could do does have has as by from so if'.split(
    ' ',
  ),
);

export function contentWords(s: string): string[] {
  return canon(s)
    .trim()
    .split(' ')
    .filter((w) => w && !STOP.has(w));
}

/** Share of the model sentence's content words present in the attempt (0..1) + missing words. */
export function lineSimilarity(attempt: string, model: string): { score: number; missing: string[] } {
  const target = Array.from(new Set(contentWords(model)));
  if (!target.length) return { score: 1, missing: [] };
  const have = new Set(contentWords(attempt));
  const missing = target.filter((w) => !have.has(w));
  return { score: (target.length - missing.length) / target.length, missing };
}

export function shuffle<T>(arr: T[], seed = Math.random()): T[] {
  const a = arr.slice();
  let s = Math.floor(seed * 2 ** 31) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2 ** 31;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function tokenizeForOrder(sentence: string): string[] {
  return sentence.split(/\s+/).filter(Boolean);
}
