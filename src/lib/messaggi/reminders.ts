// Turns real, unresolved pagamenti/abbonamenti into ready-to-copy Italian
// message text. Reuses the same urgency classification already trusted by
// Oggi (getPaymentWarnings / getSubscriptionWarnings) so a payment or
// abbonamento is never described differently in two places.

import { formatImporto, formatScadenza, type PagamentoRecord } from "@/lib/pagamenti/types";
import { formatData, type AbbonamentoRecord } from "@/lib/abbonamenti/types";
import { getPaymentWarnings } from "@/lib/oggi/payment-warnings";
import { getSubscriptionWarnings } from "@/lib/oggi/subscription-warnings";

export type ReminderMessage = {
  id: string;
  cliente: string;
  motivo: string;
  dettaglio: string;
  testo: string;
};

// "to_check" payments are an internal note to the business owner (nothing
// concrete to tell the client yet), so they produce no client-facing
// message — unlike "overdue" and "to_remind"/"upcoming".
export function getPagamentiMessages(
  pagamenti: PagamentoRecord[],
  today: Date = new Date(),
): ReminderMessage[] {
  const byId = new Map(pagamenti.map((p) => [p.id, p]));
  const messages: ReminderMessage[] = [];

  for (const warning of getPaymentWarnings(pagamenti, today)) {
    if (warning.kind === "to_check") continue;

    const pagamento = byId.get(warning.pagamentoId);
    if (!pagamento) continue;

    const importo = `${formatImporto(pagamento.importo)} €`;

    if (warning.kind === "overdue") {
      const scaduto = formatScadenza(pagamento.scadenza);
      messages.push({
        id: pagamento.id,
        cliente: pagamento.cliente,
        motivo: "Pagamento scaduto",
        dettaglio: `${importo} · scaduto il ${scaduto}`,
        testo: `Ciao ${pagamento.cliente}, ti scrivo per ricordarti il pagamento di ${importo} scaduto il ${scaduto}. Quando riesci, puoi farmi sapere? Grazie.`,
      });
      continue;
    }

    // "to_remind" or "upcoming": a payment that still needs a gentle nudge.
    if (pagamento.scadenza) {
      const scadenza = formatScadenza(pagamento.scadenza);
      messages.push({
        id: pagamento.id,
        cliente: pagamento.cliente,
        motivo: "Pagamento da ricordare",
        dettaglio: `${importo} · in scadenza il ${scadenza}`,
        testo: `Ciao ${pagamento.cliente}, ti ricordo il pagamento di ${importo} in scadenza il ${scadenza}. Grazie.`,
      });
    } else {
      messages.push({
        id: pagamento.id,
        cliente: pagamento.cliente,
        motivo: "Pagamento da ricordare",
        dettaglio: importo,
        testo: `Ciao ${pagamento.cliente}, ti ricordo il pagamento di ${importo}. Grazie.`,
      });
    }
  }

  return messages;
}

export function getAbbonamentiMessages(
  abbonamenti: AbbonamentoRecord[],
  today: Date = new Date(),
): ReminderMessage[] {
  const byId = new Map(abbonamenti.map((a) => [a.id, a]));
  const messages: ReminderMessage[] = [];

  for (const warning of getSubscriptionWarnings(abbonamenti, today)) {
    const abbonamento = byId.get(warning.abbonamentoId);
    if (!abbonamento) continue;

    const scadenza = formatData(abbonamento.scadenza);

    if (warning.kind === "expired") {
      messages.push({
        id: abbonamento.id,
        cliente: abbonamento.cliente,
        motivo: "Abbonamento scaduto",
        dettaglio: `Scaduto il ${scadenza}`,
        testo: `Ciao ${abbonamento.cliente}, il tuo abbonamento è scaduto il ${scadenza}. Vuoi rinnovarlo?`,
      });
    } else {
      messages.push({
        id: abbonamento.id,
        cliente: abbonamento.cliente,
        motivo: "Abbonamento in scadenza",
        dettaglio: `Scade il ${scadenza}`,
        testo: `Ciao ${abbonamento.cliente}, il tuo abbonamento scade il ${scadenza}. Vuoi rinnovarlo?`,
      });
    }
  }

  return messages;
}

// Generic follow-up: not tied to a due date, so it's offered for any real
// client the owner picks rather than generated automatically for all of them.
export function buildClienteFollowUpMessage(cliente: string): string {
  return `Ciao ${cliente}, ti scrivo per un rapido aggiornamento. Quando hai un momento, fammi sapere.`;
}
