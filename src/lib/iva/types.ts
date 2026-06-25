// Types for the real, Supabase-backed IVA e incassi feature.

import type { RegimeIva } from "@/lib/types";

export const REGIME_OPTIONS: { value: RegimeIva; label: string }[] = [
  { value: "ordinario", label: "Regime ordinario IVA" },
  { value: "forfettario", label: "Regime forfettario" },
  { value: "non-lo-so", label: "Non lo so" },
];

function isRegimeIva(value: string): value is RegimeIva {
  return REGIME_OPTIONS.some((option) => option.value === value);
}

export function parseRegimeIva(value: string): RegimeIva {
  return isRegimeIva(value) ? value : "non-lo-so";
}
