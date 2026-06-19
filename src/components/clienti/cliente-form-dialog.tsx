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
import { addCliente, updateCliente } from "@/app/clienti/actions";
import type { ClienteRecord } from "@/lib/clienti/types";

export function ClienteFormDialog({
  mode,
  cliente,
}: {
  mode: "add" | "edit";
  cliente?: ClienteRecord;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    mode === "add" ? addCliente : updateCliente,
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
            Aggiungi cliente
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
            {mode === "add" ? "Aggiungi cliente" : "Modifica cliente"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Inserisci i dati del nuovo cliente."
              : "Aggiorna i dati del cliente."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {mode === "edit" && cliente && (
            <input type="hidden" name="id" value={cliente.id} />
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nome`}>Nome cliente</Label>
            <Input
              id={`${id}-nome`}
              name="nome"
              type="text"
              defaultValue={cliente?.nome}
              placeholder="Es. Marco Rossi"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-telefono`}>Telefono</Label>
            <Input
              id={`${id}-telefono`}
              name="telefono"
              type="tel"
              defaultValue={cliente?.telefono ?? ""}
              placeholder="Es. 333 1234567"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              defaultValue={cliente?.email ?? ""}
              placeholder="Es. marco@email.it"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-nota`}>Note</Label>
            <Textarea
              id={`${id}-nota`}
              name="nota"
              defaultValue={cliente?.nota ?? ""}
              placeholder="Eventuali note sul cliente"
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
