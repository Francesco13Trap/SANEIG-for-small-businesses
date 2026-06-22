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
import { addAbbonamento, updateAbbonamento } from "@/app/abbonamenti/actions";
import {
  STATO_ABBONAMENTO_LABELS,
  type AbbonamentoRecord,
} from "@/lib/abbonamenti/types";

const STATO_OPTIONS = Object.entries(STATO_ABBONAMENTO_LABELS) as Array<
  [keyof typeof STATO_ABBONAMENTO_LABELS, string]
>;

export function AbbonamentoFormDialog({
  mode,
  abbonamento,
  clienti,
}: {
  mode: "add" | "edit";
  abbonamento?: AbbonamentoRecord;
  clienti: { id: string; nome: string }[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addAbbonamento : updateAbbonamento,
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
            Aggiungi abbonamento
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
            {mode === "add" ? "Aggiungi abbonamento" : "Modifica abbonamento"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del nuovo abbonamento."
              : "Aggiorna i dati dell'abbonamento."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && abbonamento && (
            <input type="hidden" name="id" value={abbonamento.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-clienteId`}>Cliente</Label>
            <Select
              name="clienteId"
              defaultValue={abbonamento?.clienteId ?? undefined}
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
            <Label htmlFor={`${id}-nome`}>Nome abbonamento</Label>
            <Input
              id={`${id}-nome`}
              name="nome"
              type="text"
              defaultValue={abbonamento?.nome}
              placeholder="Es. Abbonamento mensile"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-dataInizio`}>Data inizio</Label>
            <Input
              id={`${id}-dataInizio`}
              name="dataInizio"
              type="date"
              defaultValue={abbonamento?.dataInizio ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-scadenza`}>Data scadenza</Label>
            <Input
              id={`${id}-scadenza`}
              name="scadenza"
              type="date"
              defaultValue={abbonamento?.scadenza ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-stato`}>Stato</Label>
            <Select
              name="stato"
              defaultValue={abbonamento?.stato ?? "active"}
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
              defaultValue={abbonamento?.nota ?? ""}
              placeholder="Eventuali note sull'abbonamento"
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
