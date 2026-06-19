import type {
  Abbonamento,
  MessaggioTemplate,
  Pagamento,
  Promemoria,
} from "@/lib/types";

export type SuggestedAction = {
  label: string;
  href: string;
};

// Builds a calm to-do list of small, already-actionable things, reusing the
// same category checks as the priority card. The category already shown in
// "Da controllare prima" (excludeHref) is skipped so the page doesn't repeat
// itself, and only the first 3 remaining suggestions are kept.
export function getSuggestedActions({
  pagamentiDaControllare,
  promemoriaImportanti,
  abbonamentiInScadenza,
  messaggi,
  azioniConsigliate,
  excludeHref,
}: {
  pagamentiDaControllare: Pagamento[];
  promemoriaImportanti: Promemoria[];
  abbonamentiInScadenza: Abbonamento[];
  messaggi: MessaggioTemplate[];
  azioniConsigliate: string[];
  excludeHref?: string;
}): SuggestedAction[] {
  const candidates: SuggestedAction[] = [];

  if (pagamentiDaControllare.length > 0) {
    candidates.push({
      label: "Controlla i pagamenti in sospeso",
      href: "/pagamenti",
    });
  }

  if (promemoriaImportanti.length > 0) {
    candidates.push({
      label: "Rivedi i promemoria importanti",
      href: "/promemoria",
    });
  }

  if (abbonamentiInScadenza.length > 0) {
    candidates.push({
      label: "Controlla gli abbonamenti in scadenza",
      href: "/abbonamenti",
    });
  }

  if (messaggi.length > 0) {
    candidates.push({
      label: "Prepara i messaggi da inviare",
      href: "/messaggi",
    });
  }

  if (azioniConsigliate.length > 0) {
    candidates.push({
      label: "Dai un'occhiata al riepilogo della settimana",
      href: "/riepilogo-settimana",
    });
  }

  return candidates.filter((a) => a.href !== excludeHref).slice(0, 3);
}
