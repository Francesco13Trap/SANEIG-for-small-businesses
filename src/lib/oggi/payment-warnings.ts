import type { PagamentoRecord } from "@/lib/pagamenti/types";

export type PaymentWarningKind = "overdue" | "to_remind" | "upcoming" | "to_check";

export type PaymentWarning = {
  kind: PaymentWarningKind;
  pagamentoId: string;
  cliente: string;
  message: string;
};

const UPCOMING_WINDOW_DAYS = 7;

// Checked in this exact order so a payment matching more than one
// condition (e.g. a "to_remind" payment that's also overdue) produces a
// single warning, under its most urgent applicable category.
const KIND_PRIORITY: PaymentWarningKind[] = [
  "overdue",
  "to_remind",
  "upcoming",
  "to_check",
];

function toUtcDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function parseScadenza(scadenza: string): Date {
  return new Date(`${scadenza}T00:00:00Z`);
}

function diffInDays(later: Date, earlier: Date): number {
  return Math.round((later.getTime() - earlier.getTime()) / 86_400_000);
}

function classify(
  pagamento: PagamentoRecord,
  todayUtc: Date,
  dueDate: Date | null,
): PaymentWarningKind | null {
  if (pagamento.stato === "paid") return null;

  if (dueDate && dueDate < todayUtc) return "overdue";
  if (pagamento.stato === "to_remind") return "to_remind";
  if (dueDate && diffInDays(dueDate, todayUtc) <= UPCOMING_WINDOW_DAYS) return "upcoming";
  if (pagamento.stato === "to_check") return "to_check";

  return null;
}

function buildMessage(
  kind: PaymentWarningKind,
  cliente: string,
  dueDate: Date | null,
  todayUtc: Date,
): string {
  switch (kind) {
    case "overdue": {
      const giorni = dueDate ? diffInDays(todayUtc, dueDate) : 0;
      return `${cliente} ha un pagamento scaduto da ${giorni} ${giorni === 1 ? "giorno" : "giorni"}.`;
    }
    case "to_remind":
      return `${cliente} ha un pagamento da sollecitare.`;
    case "upcoming": {
      const giorni = dueDate ? diffInDays(dueDate, todayUtc) : 0;
      if (giorni <= 0) return `${cliente} ha un pagamento in scadenza oggi.`;
      if (giorni === 1) return `${cliente} ha un pagamento in scadenza domani.`;
      return `${cliente} ha un pagamento in scadenza tra ${giorni} giorni.`;
    }
    case "to_check":
      return `Controlla il pagamento di ${cliente}.`;
  }
}

// Builds the real, user-facing payment warnings for Oggi, sorted with the
// most urgent first (see KIND_PRIORITY). Each unpaid payment produces at
// most one warning.
export function getPaymentWarnings(
  pagamenti: PagamentoRecord[],
  today: Date = new Date(),
): PaymentWarning[] {
  const todayUtc = toUtcDateOnly(today);

  const warnings: PaymentWarning[] = [];
  for (const pagamento of pagamenti) {
    const dueDate = pagamento.scadenza ? parseScadenza(pagamento.scadenza) : null;
    const kind = classify(pagamento, todayUtc, dueDate);
    if (!kind) continue;

    warnings.push({
      kind,
      pagamentoId: pagamento.id,
      cliente: pagamento.cliente,
      message: buildMessage(kind, pagamento.cliente, dueDate, todayUtc),
    });
  }

  return warnings.sort(
    (a, b) => KIND_PRIORITY.indexOf(a.kind) - KIND_PRIORITY.indexOf(b.kind),
  );
}
