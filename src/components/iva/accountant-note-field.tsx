"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateNotaCommercialista } from "@/app/iva-e-incassi/actions";

export function AccountantNoteField({ nota }: { nota: string }) {
  const [state, formAction, pending] = useActionState(updateNotaCommercialista, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Textarea
        name="nota"
        defaultValue={nota}
        placeholder="Scrivi qui eventuali domande o promemoria per il commercialista..."
      />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}
      <div>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvataggio..." : "Salva nota"}
        </Button>
      </div>
    </form>
  );
}
