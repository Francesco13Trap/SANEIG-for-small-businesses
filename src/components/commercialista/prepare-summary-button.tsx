"use client";

import { useState } from "react";
import { Check, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RiepilogoMensileCommercialista } from "@/lib/types";

function buildSummaryText(r: RiepilogoMensileCommercialista) {
  const documenti =
    r.documentiMancanti.length > 0
      ? r.documentiMancanti.map((d) => `- ${d}`).join("\n")
      : "Nessun documento mancante segnalato.";

  return [
    `Riepilogo ${r.mese}`,
    `Incassi segnati: ${r.incassiSegnati} €`,
    `Spese segnate: ${r.speseSegnate} €`,
    `Pagamenti da controllare: ${r.pagamentiDaControllare}`,
    `Documenti mancanti:`,
    documenti,
    `Note del mese: ${r.noteDelMese}`,
  ].join("\n");
}

export function PrepareSummaryButton({
  riepilogo,
}: {
  riepilogo: RiepilogoMensileCommercialista;
}) {
  const [pronto, setPronto] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(buildSummaryText(riepilogo));
      setPronto(true);
      setTimeout(() => setPronto(false), 3000);
    } catch {
      setPronto(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick}>
        {pronto ? (
          <>
            <Check className="h-4 w-4" />
            Riepilogo copiato
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Prepara riepilogo
          </>
        )}
      </Button>
      {pronto && (
        <p className="text-sm text-muted-foreground">
          Il riepilogo è pronto da condividere con il commercialista.
        </p>
      )}
    </div>
  );
}
