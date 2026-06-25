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
import { Textarea } from "@/components/ui/textarea";
import { addRecensione, updateRecensione } from "@/app/recensioni/actions";
import { type RecensioneRecord } from "@/lib/recensioni/types";

const PUNTEGGIO_OPTIONS = [1, 2, 3, 4, 5].map((value) => ({
  value: String(value),
  label: value === 1 ? "1 stella" : `${value} stelle`,
}));

export function RecensioneFormDialog({
  mode,
  recensione,
}: {
  mode: "add" | "edit";
  recensione?: RecensioneRecord;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addRecensione : updateRecensione,
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
            Aggiungi recensione
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
            {mode === "add" ? "Aggiungi recensione" : "Modifica recensione"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati della recensione ricevuta."
              : "Aggiorna i dati della recensione."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && recensione && (
            <input type="hidden" name="id" value={recensione.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-cliente`}>Cliente</Label>
            <Input
              id={`${id}-cliente`}
              name="cliente"
              type="text"
              defaultValue={recensione?.cliente}
              placeholder="Es. Marco Rossi"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-punteggio`}>Punteggio</Label>
            <Select
              name="punteggio"
              defaultValue={String(recensione?.punteggio ?? 5)}
              required
            >
              <SelectTrigger id={`${id}-punteggio`}>
                <SelectValue placeholder="Scegli un punteggio" />
              </SelectTrigger>
              <SelectContent>
                {PUNTEGGIO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-testo`}>Testo della recensione</Label>
            <Textarea
              id={`${id}-testo`}
              name="testo"
              rows={3}
              defaultValue={recensione?.testo}
              placeholder="Cosa ha scritto il cliente"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-data`}>Data (facoltativa)</Label>
            <Input
              id={`${id}-data`}
              name="data"
              type="date"
              defaultValue={recensione?.data ?? ""}
            />
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
