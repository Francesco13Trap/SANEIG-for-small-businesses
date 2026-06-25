// Types for the real, Supabase-backed Promemoria feature. Kept separate
// from the mock `Promemoria` type in `@/lib/types` (still used by the
// mock-data sample list) so this section can move to real data on its own.

export type PromemoriaRecord = {
  id: string;
  titolo: string;
  dettaglio: string | null;
  scadenza: string | null;
  importante: boolean;
  fatto: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PromemoriaRow = {
  id: string;
  title: string;
  detail: string | null;
  due_date: string | null;
  important: boolean;
  done: boolean;
  created_at: string;
  updated_at: string;
};

export function mapPromemoriaRow(row: PromemoriaRow): PromemoriaRecord {
  return {
    id: row.id,
    titolo: row.title,
    dettaglio: row.detail,
    scadenza: row.due_date,
    importante: row.important,
    fatto: row.done,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatScadenza(scadenza: string | null): string {
  if (!scadenza) return "Nessuna scadenza";
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${scadenza}T00:00:00Z`));
}
