"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Pencil, Plus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addScadenza, updateScadenza } from "@/app/scadenze-attivita/actions";
import {
  STATO_SCADENZA_LABELS,
  type ScadenzaRecord,
} from "@/lib/scadenze/types";

const STATO_OPTIONS = Object.entries(STATO_SCADENZA_LABELS) as Array<
  [keyof typeof STATO_SCADENZA_LABELS, string]
>;

export function ScadenzaFormDialog({
  mode,
  scadenza,
}: {
  mode: "add" | "edit";
  scadenza?: ScadenzaRecord;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addScadenza : updateScadenza,
    undefined,
  );

  // Close the dialog as soon as a save succeeds, adjusting state during
  // render (per React's guidance) instead of in an effect.
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.success) {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button>
            <Plus className="h-4 w-4" />
            Aggiungi scadenza
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
            Modifica
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Aggiungi scadenza" : "Modifica scadenza"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati della nuova scadenza."
              : "Aggiorna i dati della scadenza."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && scadenza && (
            <input type="hidden" name="id" value={scadenza.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-titolo`}>Attività</Label>
            <Input
              id={`${id}-titolo`}
              name="titolo"
              type="text"
              defaultValue={scadenza?.titolo}
              placeholder="Es. Rinnovo assicurazione attività"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-categoria`}>Categoria (facoltativa)</Label>
            <Input
              id={`${id}-categoria`}
              name="categoria"
              type="text"
              defaultValue={scadenza?.categoria ?? ""}
              placeholder="Es. Assicurazione, Manutenzione, Affitto"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-scadenza`}>Scadenza (facoltativa)</Label>
            <Input
              id={`${id}-scadenza`}
              name="scadenza"
              type="date"
              defaultValue={scadenza?.scadenza ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-stato`}>Stato</Label>
            <Select name="stato" defaultValue={scadenza?.stato ?? "todo"} required>
              <SelectTrigger id={`${id}-stato`}>
                <SelectValue placeholder="Scegli uno stato" />
              </SelectTrigger>
              <SelectContent>
                {STATO_OPTIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvataggio in corso..." : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
