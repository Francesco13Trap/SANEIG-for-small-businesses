// Types for the real, Supabase-backed Pagamenti feature. Kept separate
// from the mock `Pagamento` type in `@/lib/types` (still used by the Oggi
// page's mock data) so this section can move to real data on its own.

export type StatoPagamento = "to_check" | "to_remind" | "paid";

export const STATO_PAGAMENTO_LABELS: Record<StatoPagamento, string> = {
  to_check: "Da controllare",
  to_remind: "Da sollecitare",
  paid: "Pagato",
};

function isStatoPagamento(value: string): value is StatoPagamento {
  return value === "to_check" || value === "to_remind" || value === "paid";
}

export function parseStatoPagamento(value: string): StatoPagamento {
  return isStatoPagamento(value) ? value : "to_check";
}

export type PagamentoRecord = {
  id: string;
  clienteId: string | null;
  cliente: string;
  importo: number;
  scadenza: string | null;
  stato: StatoPagamento;
  createdAt: string;
  updatedAt: string;
};

export type PagamentoRow = {
  id: string;
  client_id: string | null;
  amount: number;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  clients: { name: string }[] | { name: string } | null;
};

export function mapPagamentoRow(row: PagamentoRow): PagamentoRecord {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;

  return {
    id: row.id,
    clienteId: row.client_id,
    cliente: client?.name ?? "Cliente non specificato",
    importo: Number(row.amount),
    scadenza: row.due_date,
    stato: parseStatoPagamento(row.status),
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

export function formatImporto(importo: number): string {
  return importo.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
