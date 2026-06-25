// Shared helper for features that track one row of data per business per
// calendar month (IVA e incassi, Commercialista), keyed on the first day
// of the month.

export function startOfCurrentMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}
