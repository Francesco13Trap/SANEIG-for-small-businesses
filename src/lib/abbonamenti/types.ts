// Types for the real, Supabase-backed Abbonamenti feature.

export type StatoAbbonamento = "active" | "expiring" | "expired" | "cancelled";

export const STATO_ABBONAMENTO_LABELS: Record<StatoAbbonamento, string> = {
  active: "Attivo",
  expiring: "In scadenza",
  expired: "Scaduto",
  cancelled: "Annullato",
};

function isStatoAbbonamento(value: string): value is StatoAbbonamento {
  return (
    value === "active" ||
    value === "expiring" ||
    value === "expired" ||
    value === "cancelled"
  );
}

export function parseStatoAbbonamento(value: string): StatoAbbonamento {
  return isStatoAbbonamento(value) ? value : "active";
}

export type AbbonamentoRecord = {
  id: string;
  clienteId: string | null;
  cliente: string;
  nome: string;
  dataInizio: string | null;
  scadenza: string;
  stato: StatoAbbonamento;
  nota: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AbbonamentoRow = {
  id: string;
  client_id: string | null;
  name: string;
  start_date: string | null;
  expiry_date: string;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  clients: { name: string }[] | { name: string } | null;
};

export function mapAbbonamentoRow(row: AbbonamentoRow): AbbonamentoRecord {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;

  return {
    id: row.id,
    clienteId: row.client_id,
    cliente: client?.name ?? "Cliente non specificato",
    nome: row.name,
    dataInizio: row.start_date,
    scadenza: row.expiry_date,
    stato: parseStatoAbbonamento(row.status),
    nota: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const EXPIRING_WINDOW_DAYS = 7;

// Single source of truth for how a subscription's status is shown: the
// stored status stays the record of truth for "cancelled", everything
// else is derived from today's date vs. the expiry date so the UI and
// the warnings on "Oggi" can never drift apart.
export function deriveStatoAbbonamento(
  stato: StatoAbbonamento,
  scadenza: string,
  today: Date = new Date(),
): StatoAbbonamento {
  if (stato === "cancelled") return "cancelled";

  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const expiryUtc = new Date(`${scadenza}T00:00:00Z`).getTime();

  if (expiryUtc < todayUtc) return "expired";

  const diffDays = Math.round((expiryUtc - todayUtc) / 86_400_000);
  if (diffDays <= EXPIRING_WINDOW_DAYS) return "expiring";

  return "active";
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
