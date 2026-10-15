export type Level = 'A2' | 'B1' | 'B2';
export const LEVELS: Level[] = ['A2', 'B1', 'B2'];

export type Topic =
  | 'basics'
  | 'claims'
  | 'coverage'
  | 'underwriting'
  | 'programmes'
  | 'property-risk'
  | 'communication'
  | 'finance';

export const TOPIC_LABELS: Record<Topic, string> = {
  basics: 'Podstawy',
  claims: 'Szkody',
  coverage: 'Zakres ochrony',
  underwriting: 'Underwriting',
  programmes: 'Programy międzynarodowe',
  'property-risk': 'Ryzyko majątkowe',
  communication: 'Komunikacja',
  finance: 'Finanse i wyceny',
};

export interface Example {
  en: string;
  pl: string;
}

export interface Card {
  id: string;
  en: string;
  pl: string;
  def: string;
  plNote?: string;
  level: Level;
  topic: Topic;
  examples: Example[];
  collocations: string[];
  note: string;
  audio?: string;
  needsReview?: boolean;
  custom?: boolean;
}

export type Exercise =
  | { type: 'mcq'; q: string; options: string[]; answer: number; explain?: string }
  | { type: 'gap'; q: string; answers: string[]; hint?: string; explain?: string }
  | { type: 'order'; words: string[]; pl?: string; explain?: string };

export interface Lesson {
  id: string;
  level: Level;
  title: string;
  titlePl: string;
  objectives: string[];
  cardIds: string[];
  explanation: string;
  summaryEn: string;
  examples: Example[];
  situation: { title: string; text: string; pl: string };
  comprehension: Exercise[];
  exercises: Exercise[];
}

export interface GrammarTopic {
  id: string;
  level: Level;
  title: string;
  explanation: string;
  summaryEn: string;
  examples: Example[];
  mistakes: { wrong: string; right: string; why: string }[];
  exercises: Exercise[];
}

export interface DialogueLine {
  s: 'A' | 'B';
  en: string;
  pl: string;
}

export interface Dialogue {
  id: string;
  level: Level;
  title: string;
  titlePl: string;
  situation: string;
  roles: { A: string; B: string };
  learner: 'A' | 'B';
  lines: DialogueLine[];
  expressions: Example[];
  cardIds: string[];
  questions: Exercise[];
  choose: { prompt: string; options: string[]; answer: number; explain: string }[];
}

export interface RequiredElement {
  label: string;
  accept: string[];
}

export interface EmailTask {
  id: string;
  level: Level;
  title: string;
  titlePl: string;
  brief: string;
  required: RequiredElement[];
  model: { subject: string; body: string };
  phrases: Example[];
}

export interface SpeakingTask {
  id: string;
  level: Level;
  title: string;
  prompt: string;
  required: RequiredElement[];
  model: string;
}

export interface ListeningItem {
  id: string;
  level: Level;
  title: string;
  intro: string;
  text: string;
  questions: Exercise[];
}

export interface PlacementQuestion {
  level: Level;
  q: string;
  options: string[];
  answer: number;
}
