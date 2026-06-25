// Types for the real, Supabase-backed Promozioni feature. Kept separate
// from the mock `Promozione` type in `@/lib/types` so this section can
// move to real data on its own.

export type StatoPromozione = "scheduled" | "active" | "ended";

export const STATO_PROMOZIONE_LABELS: Record<StatoPromozione, string> = {
  scheduled: "Programmata",
  active: "Attiva",
  ended: "Conclusa",
};

function isStatoPromozione(value: string): value is StatoPromozione {
  return value === "scheduled" || value === "active" || value === "ended";
}

export function parseStatoPromozione(value: string): StatoPromozione {
  return isStatoPromozione(value) ? value : "scheduled";
}

export type PromozioneRecord = {
  id: string;
  titolo: string;
  descrizione: string | null;
  periodo: string | null;
  stato: StatoPromozione;
  createdAt: string;
  updatedAt: string;
};

export type PromozioneRow = {
  id: string;
  title: string;
  description: string | null;
  period: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export function mapPromozioneRow(row: PromozioneRow): PromozioneRecord {
  return {
    id: row.id,
    titolo: row.title,
    descrizione: row.description,
    periodo: row.period,
    stato: parseStatoPromozione(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
