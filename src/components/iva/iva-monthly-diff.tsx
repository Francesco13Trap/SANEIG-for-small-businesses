"use client";

import { useId, useMemo, useState } from "react";

import { Label } from "@/components/ui/label";
import { AliquotaSelect } from "@/components/iva/aliquota-select";

function formatEuro(value: number) {
  return value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function IvaMonthlyDiff({
  incassiSegnati,
  speseSegnate,
}: {
  incassiSegnati: number;
  speseSegnate: number;
}) {
  const id = useId();
  const [aliquota, setAliquota] = useState(22);

  const differenza = useMemo(() => {
    const ivaIncassi = incassiSegnati * (aliquota / 100);
    const ivaSpese = speseSegnate * (aliquota / 100);
    return ivaIncassi - ivaSpese;
  }, [incassiSegnati, speseSegnate, aliquota]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 sm:w-56">
        <Label htmlFor={`${id}-aliquota`}>Aliquota di riferimento</Label>
        <AliquotaSelect
          id={`${id}-aliquota`}
          value={aliquota}
          onChange={setAliquota}
        />
      </div>

      <div className="rounded-lg bg-secondary p-4">
        <p className="text-sm text-muted-foreground">
          Differenza IVA indicativa
        </p>
        <p className="text-xl font-semibold text-foreground">
          {differenza >= 0 ? "+" : ""}
          {formatEuro(differenza)} €
        </p>
      </div>
    </div>
  );
}
