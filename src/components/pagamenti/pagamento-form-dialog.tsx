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
import { addPagamento, updatePagamento } from "@/app/pagamenti/actions";
import { STATO_PAGAMENTO_LABELS, type PagamentoRecord } from "@/lib/pagamenti/types";

const STATO_OPTIONS = Object.entries(STATO_PAGAMENTO_LABELS) as Array<
  [keyof typeof STATO_PAGAMENTO_LABELS, string]
>;

export function PagamentoFormDialog({
  mode,
  pagamento,
  clienti,
}: {
  mode: "add" | "edit";
  pagamento?: PagamentoRecord;
  clienti: { id: string; nome: string }[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addPagamento : updatePagamento,
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
            Aggiungi pagamento
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
            {mode === "add" ? "Aggiungi pagamento" : "Modifica pagamento"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del nuovo pagamento."
              : "Aggiorna i dati del pagamento."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && pagamento && (
            <input type="hidden" name="id" value={pagamento.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-clienteId`}>Cliente</Label>
            <Select
              name="clienteId"
              defaultValue={pagamento?.clienteId ?? undefined}
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
            <Label htmlFor={`${id}-importo`}>Importo</Label>
            <Input
              id={`${id}-importo`}
              name="importo"
              type="number"
              step="0.01"
              min="0"
              defaultValue={pagamento?.importo}
              placeholder="Es. 45.00"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-scadenza`}>Scadenza</Label>
            <Input
              id={`${id}-scadenza`}
              name="scadenza"
              type="date"
              defaultValue={pagamento?.scadenza ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-stato`}>Stato</Label>
            <Select
              name="stato"
              defaultValue={pagamento?.stato ?? "to_check"}
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
