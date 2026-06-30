// Shared helper for features that track one row of data per business per
// calendar month (IVA e incassi, Commercialista), keyed on the first day
// of the month.
//
// Built on UTC date components (not server-local time) so the result does
// not shift depending on the host process's timezone.

export function startOfCurrentMonth(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}
