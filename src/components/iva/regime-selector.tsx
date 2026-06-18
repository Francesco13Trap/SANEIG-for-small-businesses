"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegimeIva } from "@/lib/types";

const OPZIONI: { value: RegimeIva; label: string }[] = [
  { value: "ordinario", label: "Regime ordinario IVA" },
  { value: "forfettario", label: "Regime forfettario" },
  { value: "non-lo-so", label: "Non lo so" },
];

export function RegimeSelector() {
  const [regime, setRegime] = useState<RegimeIva>("non-lo-so");

  return (
    <Select value={regime} onValueChange={(v) => setRegime(v as RegimeIva)}>
      <SelectTrigger className="sm:w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPZIONI.map((opzione) => (
          <SelectItem key={opzione.value} value={opzione.value}>
            {opzione.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
