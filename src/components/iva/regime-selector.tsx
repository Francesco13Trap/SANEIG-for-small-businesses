"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateRegimeIva } from "@/app/iva-e-incassi/actions";
import { REGIME_OPTIONS } from "@/lib/iva/types";
import type { RegimeIva } from "@/lib/types";

export function RegimeSelector({ regime }: { regime: RegimeIva }) {
  const [state, formAction, pending] = useActionState(updateRegimeIva, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Select name="regime" defaultValue={regime}>
          <SelectTrigger className="sm:w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGIME_OPTIONS.map((opzione) => (
              <SelectItem key={opzione.value} value={opzione.value}>
                {opzione.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Salvataggio..." : "Salva"}
        </Button>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}
    </form>
  );
}
