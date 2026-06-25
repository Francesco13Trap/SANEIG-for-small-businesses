// Types for the real, Supabase-backed Recensioni feature. Kept separate
// from the mock `Recensione` type in `@/lib/types` so this section can
// move to real data on its own.

export type RecensioneRecord = {
  id: string;
  cliente: string;
  punteggio: number;
  testo: string;
  data: string | null;
  risposta: "Da rispondere" | "Risposto";
  createdAt: string;
};

export type RecensioneRow = {
  id: string;
  client_name: string;
  rating: number;
  comment: string;
  review_date: string | null;
  responded: boolean;
  created_at: string;
};

export function mapRecensioneRow(row: RecensioneRow): RecensioneRecord {
  return {
    id: row.id,
    cliente: row.client_name,
    punteggio: row.rating,
    testo: row.comment,
    data: row.review_date,
    risposta: row.responded ? "Risposto" : "Da rispondere",
    createdAt: row.created_at,
  };
}

export function formatDataRecensione(data: string | null): string | null {
  if (!data) return null;
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}
