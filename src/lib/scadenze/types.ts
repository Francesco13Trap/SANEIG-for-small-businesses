// Types for the real, Supabase-backed Scadenze attività feature. Kept
// separate from the mock `ScadenzaAttivita` type in `@/lib/types` (still
// used by the Riepilogo settimana page's mock data) so this section can
// move to real data on its own.

export type StatoScadenza = "todo" | "in_progress" | "done";

export const STATO_SCADENZA_LABELS: Record<StatoScadenza, string> = {
  todo: "Da fare",
  in_progress: "In corso",
  done: "Completata",
};

function isStatoScadenza(value: string): value is StatoScadenza {
  return value === "todo" || value === "in_progress" || value === "done";
}

export function parseStatoScadenza(value: string): StatoScadenza {
  return isStatoScadenza(value) ? value : "todo";
}

export type ScadenzaRecord = {
  id: string;
  titolo: string;
  categoria: string | null;
  scadenza: string | null;
  stato: StatoScadenza;
  createdAt: string;
};

export type ScadenzaRow = {
  id: string;
  title: string;
  category: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
};

export function mapScadenzaRow(row: ScadenzaRow): ScadenzaRecord {
  return {
    id: row.id,
    titolo: row.title,
    categoria: row.category,
    scadenza: row.due_date,
    stato: parseStatoScadenza(row.status),
    createdAt: row.created_at,
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
