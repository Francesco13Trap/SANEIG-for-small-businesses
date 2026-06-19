import type { LucideIcon } from "lucide-react";
import { Wallet, Bell, Repeat, MessageSquare, ListChecks } from "lucide-react";

import type {
  Abbonamento,
  MessaggioTemplate,
  Pagamento,
  Promemoria,
} from "@/lib/types";

export type PriorityItem = {
  icon: LucideIcon;
  label: string;
  message: string;
  note?: string;
  href: string;
  ctaLabel: string;
};

// Picks the single most important thing to show on Oggi, checking each
// category in order and stopping at the first one that has something to
// flag. Later categories are only reached when the earlier ones are empty.
export function getPriorityItem({
  pagamentiDaControllare,
  promemoriaImportanti,
  abbonamentiInScadenza,
  messaggi,
  azioniConsigliate,
}: {
  pagamentiDaControllare: Pagamento[];
  promemoriaImportanti: Promemoria[];
  abbonamentiInScadenza: Abbonamento[];
  messaggi: MessaggioTemplate[];
  azioniConsigliate: string[];
}): PriorityItem | null {
  if (pagamentiDaControllare.length > 0) {
    const daSollecitare = pagamentiDaControllare.filter(
      (p) => p.stato === "Da sollecitare"
    );
    const principale = daSollecitare[0] ?? pagamentiDaControllare[0];
    const altri = pagamentiDaControllare.length - 1;

    return {
      icon: Wallet,
      label:
        principale.stato === "Da sollecitare"
          ? "Pagamento da sollecitare"
          : "Pagamento da controllare",
      message:
        principale.stato === "Da sollecitare"
          ? `${principale.cliente} non ha ancora pagato ${principale.importo} € (scadenza ${principale.scadenza}).`
          : `Controlla il pagamento di ${principale.cliente}: ${principale.importo} €, scadenza ${principale.scadenza}.`,
      note: altri > 0 ? `Ci sono altri ${altri} pagamenti da controllare.` : undefined,
      href: "/pagamenti",
      ctaLabel: "Apri Pagamenti",
    };
  }

  if (promemoriaImportanti.length > 0) {
    const principale = promemoriaImportanti[0];
    const altri = promemoriaImportanti.length - 1;

    return {
      icon: Bell,
      label: "Promemoria importante",
      message: `${principale.titolo}: ${principale.dettaglio}`,
      note: altri > 0 ? `Ci sono altri ${altri} promemoria importanti.` : undefined,
      href: "/promemoria",
      ctaLabel: "Apri Promemoria",
    };
  }

  if (abbonamentiInScadenza.length > 0) {
    const principale = abbonamentiInScadenza[0];
    const altri = abbonamentiInScadenza.length - 1;

    return {
      icon: Repeat,
      label: "Abbonamento in scadenza",
      message: `${principale.cliente} – ${principale.nome}, scade il ${principale.scadenza}.`,
      note: altri > 0 ? `Ci sono altri ${altri} abbonamenti in scadenza.` : undefined,
      href: "/abbonamenti",
      ctaLabel: "Apri Abbonamenti",
    };
  }

  if (messaggi.length > 0) {
    const principale = messaggi[0];
    const altri = messaggi.length - 1;

    return {
      icon: MessageSquare,
      label: "Messaggio da preparare",
      message: `${principale.titolo}: ${principale.descrizione}`,
      note: altri > 0 ? `Ci sono altri ${altri} messaggi pronti da usare.` : undefined,
      href: "/messaggi",
      ctaLabel: "Apri Messaggi",
    };
  }

  if (azioniConsigliate.length > 0) {
    const altri = azioniConsigliate.length - 1;

    return {
      icon: ListChecks,
      label: "Azione consigliata",
      message: azioniConsigliate[0],
      note: altri > 0 ? `Ci sono altre ${altri} azioni consigliate.` : undefined,
      href: "/riepilogo-settimana",
      ctaLabel: "Apri Riepilogo settimana",
    };
  }

  return null;
}
