export type StatoStipendio = "to_pay" | "paid" | "delayed";

export const STATO_STIPENDIO_LABELS: Record<StatoStipendio, string> = {
  to_pay: "Da pagare",
  paid: "Pagato",
  delayed: "In ritardo",
};

function isStatoStipendio(value: string): value is StatoStipendio {
  return value === "to_pay" || value === "paid" || value === "delayed";
}

export function parseStatoStipendio(value: string): StatoStipendio {
  return isStatoStipendio(value) ? value : "to_pay";
}

export type StipendioRecord = {
  id: string;
  nome: string;
  ruolo: string | null;
  importo: number;
  mese: string;
  scadenza: string | null;
  stato: StatoStipendio;
  nota: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StipendioRow = {
  id: string;
  person_name: string;
  role: string | null;
  amount: number;
  month: string;
  due_date: string | null;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export function mapStipendioRow(row: StipendioRow): StipendioRecord {
  return {
    id: row.id,
    nome: row.person_name,
    ruolo: row.role,
    importo: row.amount,
    mese: row.month,
    scadenza: row.due_date,
    stato: parseStatoStipendio(row.status),
    nota: row.note,
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
  }).format(new Date(scadenza));
}

export function formatImporto(importo: number): string {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(importo);
}
