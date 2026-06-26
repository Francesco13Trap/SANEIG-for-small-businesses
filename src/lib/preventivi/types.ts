// Types for the real, Supabase-backed Preventivi feature.

export type StatoPreventivo = "draft" | "sent" | "accepted" | "rejected";

export const STATO_PREVENTIVO_LABELS: Record<StatoPreventivo, string> = {
  draft: "Bozza",
  sent: "Inviato",
  accepted: "Accettato",
  rejected: "Rifiutato",
};

function isStatoPreventivo(value: string): value is StatoPreventivo {
  return (
    value === "draft" ||
    value === "sent" ||
    value === "accepted" ||
    value === "rejected"
  );
}

export function parseStatoPreventivo(value: string): StatoPreventivo {
  return isStatoPreventivo(value) ? value : "draft";
}

export type PreventivoRecord = {
  id: string;
  clienteId: string | null;
  cliente: string;
  titolo: string;
  descrizione: string | null;
  importo: number;
  stato: StatoPreventivo;
  validoFino: string | null;
  nota: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PreventivoRow = {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  valid_until: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  clients: { name: string }[] | { name: string } | null;
};

export function mapPreventivoRow(row: PreventivoRow): PreventivoRecord {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;

  return {
    id: row.id,
    clienteId: row.client_id,
    cliente: client?.name ?? "Cliente non specificato",
    titolo: row.title,
    descrizione: row.description,
    importo: Number(row.amount),
    stato: parseStatoPreventivo(row.status),
    validoFino: row.valid_until,
    nota: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatData(data: string | null): string {
  if (!data) return "Non specificata";
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

export function formatImporto(importo: number): string {
  return importo.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
