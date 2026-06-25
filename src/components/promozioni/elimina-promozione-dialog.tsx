"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePromozione } from "@/app/promozioni/actions";

export function EliminaPromozioneDialog({
  id,
  titolo,
}: {
  id: string;
  titolo: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deletePromozione, undefined);

  // Close the dialog as soon as the delete succeeds, adjusting state during
  // render (per React's guidance) instead of in an effect.
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
          Elimina
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conferma eliminazione</DialogTitle>
          <DialogDescription>
            Vuoi eliminare la promozione &quot;{titolo}&quot;? L&apos;operazione
            non si può annullare.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          {state?.error && (
            <p className="mb-3 text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Eliminazione in corso..." : "Elimina"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
