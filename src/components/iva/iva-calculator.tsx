"use client";

import { useId, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AliquotaSelect } from "@/components/iva/aliquota-select";
import { TrustNote } from "@/components/trust-note";

function formatEuro(value: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function IvaCalculator() {
  const id = useId();
  const [importoNetto, setImportoNetto] = useState("100");
  const [aliquota, setAliquota] = useState(22);

  const { iva, totale } = useMemo(() => {
    const netto = Number(importoNetto.replace(",", ".")) || 0;
    const ivaCalcolata = netto * (aliquota / 100);
    return { iva: ivaCalcolata, totale: netto + ivaCalcolata };
  }, [importoNetto, aliquota]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-netto`}>Importo netto</Label>
          <Input
            id={`${id}-netto`}
            inputMode="decimal"
            value={importoNetto}
            onChange={(e) => setImportoNetto(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-aliquota`}>Aliquota IVA</Label>
          <AliquotaSelect
            id={`${id}-aliquota`}
            value={aliquota}
            onChange={setAliquota}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">IVA</p>
            <p className="text-xl font-semibold text-foreground">
              {formatEuro(iva)} €
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Totale</p>
            <p className="text-xl font-semibold text-foreground">
              {formatEuro(totale)} €
            </p>
          </div>
        </div>
        <TrustNote>
          Calcolo indicativo, utile solo per organizzarti. Per conferme
          fiscali rivolgiti al commercialista.
        </TrustNote>
      </div>
    </div>
  );
}
