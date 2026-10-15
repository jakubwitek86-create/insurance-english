import type { Card, Level, Topic } from '../types';

/** Compact card builder used by the content files. */
export function k(
  id: string,
  level: Level,
  topic: Topic,
  en: string,
  pl: string,
  def: string,
  examples: [string, string][],
  collocations: string[],
  note: string,
  extra: { plNote?: string; needsReview?: boolean } = {},
): Card {
  return {
    id,
    level,
    topic,
    en,
    pl,
    def,
    examples: examples.map(([e, p]) => ({ en: e, pl: p })),
    collocations,
    note,
    ...extra,
  };
}
