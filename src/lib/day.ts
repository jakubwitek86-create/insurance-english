const DAY = 86_400_000;

/** Local calendar day index (days since epoch in the user's time zone). */
export function dayIndex(ts: number = Date.now()): number {
  const d = new Date(ts);
  return Math.floor((ts - d.getTimezoneOffset() * 60_000) / DAY);
}

export function dayToDate(day: number): Date {
  const utc = new Date(day * DAY);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export function formatDay(day: number): string {
  return dayToDate(day).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}
