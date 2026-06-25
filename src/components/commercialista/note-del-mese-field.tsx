"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateNoteDelMese } from "@/app/commercialista/actions";

export function NoteDelMeseField({ note }: { note: string }) {
  const [state, formAction, pending] = useActionState(updateNoteDelMese, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Textarea
        name="note"
        defaultValue={note}
        placeholder="Scrivi qui le note di questo mese..."
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
