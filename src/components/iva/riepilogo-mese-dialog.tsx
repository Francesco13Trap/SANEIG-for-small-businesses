"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRiepilogoMese } from "@/app/iva-e-incassi/actions";

export function RiepilogoMeseDialog({
  incassiSegnati,
  speseSegnate,
}: {
  incassiSegnati: number;
  speseSegnate: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateRiepilogoMese, undefined);

  // Close the dialog as soon as the save succeeds, adjusting state during
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
          <Pencil className="h-4 w-4" />
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incassi e spese del mese</DialogTitle>
          <DialogDescription>
            Inserisci gli importi totali raccolti questo mese.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="riepilogo-incassi">Incassi segnati</Label>
            <Input
              id="riepilogo-incassi"
              name="incassi"
              inputMode="decimal"
              defaultValue={incassiSegnati}
              placeholder="0,00"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="riepilogo-spese">Spese segnate</Label>
            <Input
              id="riepilogo-spese"
              name="spese"
              inputMode="decimal"
              defaultValue={speseSegnate}
              placeholder="0,00"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvataggio in corso..." : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
