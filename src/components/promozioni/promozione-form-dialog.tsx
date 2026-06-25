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
import { addPromozione, updatePromozione } from "@/app/promozioni/actions";
import {
  STATO_PROMOZIONE_LABELS,
  type PromozioneRecord,
} from "@/lib/promozioni/types";

const STATO_OPTIONS = Object.entries(STATO_PROMOZIONE_LABELS) as Array<
  [keyof typeof STATO_PROMOZIONE_LABELS, string]
>;

export function PromozioneFormDialog({
  mode,
  promozione,
}: {
  mode: "add" | "edit";
  promozione?: PromozioneRecord;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addPromozione : updatePromozione,
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
            Aggiungi promozione
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
            {mode === "add" ? "Aggiungi promozione" : "Modifica promozione"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati della nuova promozione."
              : "Aggiorna i dati della promozione."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && promozione && (
            <input type="hidden" name="id" value={promozione.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-titolo`}>Titolo</Label>
            <Input
              id={`${id}-titolo`}
              name="titolo"
              type="text"
              defaultValue={promozione?.titolo}
              placeholder="Es. Sconto del 10% per i nuovi clienti"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-descrizione`}>Descrizione (facoltativa)</Label>
            <Textarea
              id={`${id}-descrizione`}
              name="descrizione"
              rows={2}
              defaultValue={promozione?.descrizione ?? ""}
              placeholder="In cosa consiste la promozione"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-periodo`}>Periodo (facoltativo)</Label>
            <Input
              id={`${id}-periodo`}
              name="periodo"
              type="text"
              defaultValue={promozione?.periodo ?? ""}
              placeholder="Es. 1 - 30 giugno 2026"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-stato`}>Stato</Label>
            <Select
              name="stato"
              defaultValue={promozione?.stato ?? "scheduled"}
              required
            >
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
