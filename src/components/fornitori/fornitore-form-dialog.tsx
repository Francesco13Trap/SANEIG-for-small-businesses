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
import { addFornitore, updateFornitore } from "@/app/fornitori/actions";
import type { FornitoreRecord } from "@/lib/fornitori/types";

export function FornitoreFormDialog({
  mode,
  fornitore,
}: {
  mode: "add" | "edit";
  fornitore?: FornitoreRecord;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addFornitore : updateFornitore,
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
            Aggiungi fornitore
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
            {mode === "add" ? "Aggiungi fornitore" : "Modifica fornitore"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del nuovo fornitore."
              : "Aggiorna i dati del fornitore."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && fornitore && (
            <input type="hidden" name="id" value={fornitore.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nome`}>Nome fornitore</Label>
            <Input
              id={`${id}-nome`}
              name="nome"
              type="text"
              defaultValue={fornitore?.nome}
              placeholder="Es. Distribuzione Nord Srl"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-referente`}>Referente</Label>
            <Input
              id={`${id}-referente`}
              name="referente"
              type="text"
              defaultValue={fornitore?.referente ?? ""}
              placeholder="Es. Marco Rossi"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-telefono`}>Telefono</Label>
            <Input
              id={`${id}-telefono`}
              name="telefono"
              type="tel"
              defaultValue={fornitore?.telefono ?? ""}
              placeholder="Es. 02 1234567"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              defaultValue={fornitore?.email ?? ""}
              placeholder="Es. info@fornitore.it"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-categoria`}>Categoria</Label>
            <Input
              id={`${id}-categoria`}
              name="categoria"
              type="text"
              defaultValue={fornitore?.categoria ?? ""}
              placeholder="Es. Materiale tecnico"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nota`}>Note</Label>
            <Textarea
              id={`${id}-nota`}
              name="nota"
              defaultValue={fornitore?.nota ?? ""}
              placeholder="Eventuali note sul fornitore"
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
