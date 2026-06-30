// Shared helper for the weekly recap (Riepilogo settimana), keyed on the
// Monday-to-Sunday week containing today. Mirrors the style of
// monthly-period.ts so date boundaries stay consistent across the app.
//
// Built on UTC date components (not server-local time) so the result does
// not shift depending on the host process's timezone.

export function startOfCurrentWeek(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday),
  )
    .toISOString()
    .slice(0, 10);
}

export function endOfCurrentWeek(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToSunday = day === 0 ? 0 : 7 - day;
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToSunday),
  )
    .toISOString()
    .slice(0, 10);
}

export function today(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}
