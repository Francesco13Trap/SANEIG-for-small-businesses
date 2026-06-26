// Shared helper for the weekly recap (Riepilogo settimana), keyed on the
// Monday-to-Sunday week containing today. Mirrors the style of
// monthly-period.ts so date boundaries stay consistent across the app.

export function startOfCurrentWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday)
    .toISOString()
    .slice(0, 10);
}

export function endOfCurrentWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToSunday = day === 0 ? 0 : 7 - day;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToSunday)
    .toISOString()
    .slice(0, 10);
}

export function today(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .slice(0, 10);
}
