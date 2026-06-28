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
import { addProdotto, updateProdotto } from "@/app/magazzino/actions";
import type { ProdottoRecord } from "@/lib/magazzino/types";

export function ProdottoFormDialog({
  mode,
  prodotto,
  fornitori,
}: {
  mode: "add" | "edit";
  prodotto?: ProdottoRecord;
  fornitori: { id: string; nome: string }[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addProdotto : updateProdotto,
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
            Aggiungi prodotto
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
            {mode === "add" ? "Aggiungi prodotto" : "Modifica prodotto"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del nuovo prodotto."
              : "Aggiorna i dati del prodotto."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && prodotto && (
            <input type="hidden" name="id" value={prodotto.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nome`}>Nome prodotto</Label>
            <Input
              id={`${id}-nome`}
              name="nome"
              type="text"
              defaultValue={prodotto?.nome}
              placeholder="Es. Guanti monouso"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-quantita`}>Quantità</Label>
            <Input
              id={`${id}-quantita`}
              name="quantita"
              type="number"
              min="0"
              step="1"
              defaultValue={prodotto?.quantita ?? 0}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-scortaMinima`}>Scorta minima</Label>
            <Input
              id={`${id}-scortaMinima`}
              name="scortaMinima"
              type="number"
              min="0"
              step="1"
              defaultValue={prodotto?.scortaMinima ?? ""}
              placeholder="Es. 5"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-unita`}>Unità</Label>
            <Input
              id={`${id}-unita`}
              name="unita"
              type="text"
              defaultValue={prodotto?.unita ?? ""}
              placeholder="Es. pezzi, scatole, kg"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-categoria`}>Categoria</Label>
            <Input
              id={`${id}-categoria`}
              name="categoria"
              type="text"
              defaultValue={prodotto?.categoria ?? ""}
              placeholder="Es. Materiale di consumo"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-fornitoreId`}>Fornitore</Label>
            <Select name="fornitoreId" defaultValue={prodotto?.fornitoreId ?? "none"}>
              <SelectTrigger id={`${id}-fornitoreId`}>
                <SelectValue placeholder="Nessun fornitore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessun fornitore</SelectItem>
                {fornitori.map((fornitore) => (
                  <SelectItem key={fornitore.id} value={fornitore.id}>
                    {fornitore.nome}
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
              defaultValue={prodotto?.nota ?? ""}
              placeholder="Eventuali note sul prodotto"
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
