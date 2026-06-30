import { deriveStatoAbbonamento, type AbbonamentoRecord } from "@/lib/abbonamenti/types";

export type SubscriptionWarningKind = "expired" | "expiring";

export type SubscriptionWarning = {
  kind: SubscriptionWarningKind;
  abbonamentoId: string;
  cliente: string;
  message: string;
};

// Checked in this exact order so an abbonamento matching more than one
// condition produces a single warning, under its most urgent applicable
// category.
const KIND_PRIORITY: SubscriptionWarningKind[] = ["expired", "expiring"];

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
  abbonamento: AbbonamentoRecord,
  todayUtc: Date,
): SubscriptionWarningKind | null {
  const derived = deriveStatoAbbonamento(abbonamento.stato, abbonamento.scadenza, todayUtc);

  if (derived === "expired") return "expired";
  if (derived === "expiring") return "expiring";

  return null;
}

function buildMessage(
  kind: SubscriptionWarningKind,
  cliente: string,
  expiryDate: Date,
  todayUtc: Date,
): string {
  switch (kind) {
    case "expired":
      return `L'abbonamento di ${cliente} è scaduto.`;
    case "expiring": {
      const giorni = diffInDays(expiryDate, todayUtc);
      if (giorni <= 0) return `L'abbonamento di ${cliente} scade oggi.`;
      if (giorni === 1) return `L'abbonamento di ${cliente} scade domani.`;
      return `L'abbonamento di ${cliente} scade tra ${giorni} giorni.`;
    }
  }
}

// Builds the real, user-facing subscription warnings for Oggi, sorted with
// the most urgent first (see KIND_PRIORITY). Each abbonamento produces at
// most one warning.
export function getSubscriptionWarnings(
  abbonamenti: AbbonamentoRecord[],
  today: Date = new Date(),
): SubscriptionWarning[] {
  const todayUtc = toUtcDateOnly(today);

  const warnings: SubscriptionWarning[] = [];
  for (const abbonamento of abbonamenti) {
    const kind = classify(abbonamento, todayUtc);
    if (!kind) continue;

    const expiryDate = parseScadenza(abbonamento.scadenza);
    warnings.push({
      kind,
      abbonamentoId: abbonamento.id,
      cliente: abbonamento.cliente,
      message: buildMessage(kind, abbonamento.cliente, expiryDate, todayUtc),
    });
  }

  return warnings.sort(
    (a, b) => KIND_PRIORITY.indexOf(a.kind) - KIND_PRIORITY.indexOf(b.kind),
  );
}
