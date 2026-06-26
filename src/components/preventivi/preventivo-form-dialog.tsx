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
import { addPreventivo, updatePreventivo } from "@/app/preventivi/actions";
import {
  STATO_PREVENTIVO_LABELS,
  type PreventivoRecord,
} from "@/lib/preventivi/types";

const STATO_OPTIONS = Object.entries(STATO_PREVENTIVO_LABELS) as Array<
  [keyof typeof STATO_PREVENTIVO_LABELS, string]
>;

export function PreventivoFormDialog({
  mode,
  preventivo,
  clienti,
}: {
  mode: "add" | "edit";
  preventivo?: PreventivoRecord;
  clienti: { id: string; nome: string }[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addPreventivo : updatePreventivo,
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

  const noClienti = clienti.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button disabled={noClienti}>
            <Plus className="h-4 w-4" />
            Aggiungi preventivo
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
            {mode === "add" ? "Aggiungi preventivo" : "Modifica preventivo"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del nuovo preventivo."
              : "Aggiorna i dati del preventivo."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && preventivo && (
            <input type="hidden" name="id" value={preventivo.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-clienteId`}>Cliente</Label>
            <Select
              name="clienteId"
              defaultValue={preventivo?.clienteId ?? undefined}
              required
            >
              <SelectTrigger id={`${id}-clienteId`}>
                <SelectValue placeholder="Scegli un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clienti.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-titolo`}>Titolo preventivo</Label>
            <Input
              id={`${id}-titolo`}
              name="titolo"
              type="text"
              defaultValue={preventivo?.titolo}
              placeholder="Es. Sito web vetrina"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-descrizione`}>Descrizione</Label>
            <Textarea
              id={`${id}-descrizione`}
              name="descrizione"
              defaultValue={preventivo?.descrizione ?? ""}
              placeholder="Cosa comprende il preventivo"
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
              defaultValue={preventivo?.importo}
              placeholder="Es. 850.00"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-validoFino`}>Valido fino al</Label>
            <Input
              id={`${id}-validoFino`}
              name="validoFino"
              type="date"
              defaultValue={preventivo?.validoFino ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-stato`}>Stato</Label>
            <Select
              name="stato"
              defaultValue={preventivo?.stato ?? "draft"}
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
              defaultValue={preventivo?.nota ?? ""}
              placeholder="Eventuali note sul preventivo"
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
