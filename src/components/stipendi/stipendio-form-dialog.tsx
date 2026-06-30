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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addStipendio, updateStipendio } from "@/app/stipendi/actions";
import { STATO_STIPENDIO_LABELS, type StipendioRecord } from "@/lib/stipendi/types";

const STATO_OPTIONS = Object.entries(STATO_STIPENDIO_LABELS) as Array<
  [keyof typeof STATO_STIPENDIO_LABELS, string]
>;

export function StipendioFormDialog({
  mode,
  stipendio,
}: {
  mode: "add" | "edit";
  stipendio?: StipendioRecord;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addStipendio : updateStipendio,
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
            Aggiungi promemoria
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
            {mode === "add" ? "Aggiungi promemoria pagamento" : "Modifica promemoria"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del pagamento collaboratore da tenere sotto controllo."
              : "Aggiorna i dati del promemoria pagamento."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && stipendio && (
            <input type="hidden" name="id" value={stipendio.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nome`}>Nome</Label>
            <Input
              id={`${id}-nome`}
              name="nome"
              defaultValue={stipendio?.nome}
              placeholder="Es. Marco Rossi"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-ruolo`}>Ruolo</Label>
            <Input
              id={`${id}-ruolo`}
              name="ruolo"
              defaultValue={stipendio?.ruolo ?? ""}
              placeholder="Es. Collaboratore (facoltativo)"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-importo`}>Importo</Label>
            <Input
              id={`${id}-importo`}
              name="importo"
              type="number"
              step="0.01"
              min="0"
              defaultValue={stipendio?.importo}
              placeholder="Es. 1200.00"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-mese`}>Mese</Label>
            <Input
              id={`${id}-mese`}
              name="mese"
              defaultValue={stipendio?.mese}
              placeholder="Es. Giugno 2026"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-scadenza`}>Scadenza</Label>
            <Input
              id={`${id}-scadenza`}
              name="scadenza"
              type="date"
              defaultValue={stipendio?.scadenza ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-stato`}>Stato</Label>
            <Select
              name="stato"
              defaultValue={stipendio?.stato ?? "to_pay"}
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nota`}>Note</Label>
            <Textarea
              id={`${id}-nota`}
              name="nota"
              defaultValue={stipendio?.nota ?? ""}
              placeholder="Note facoltative"
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
