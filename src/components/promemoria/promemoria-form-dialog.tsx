"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Plus } from "lucide-react";

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
import { addPromemoria } from "@/app/promemoria/actions";

export function PromemoriaFormDialog() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(addPromemoria, undefined);

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
        <Button>
          <Plus className="h-4 w-4" />
          Aggiungi promemoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi promemoria</DialogTitle>
          <DialogDescription>
            Inserisci la cosa da non dimenticare.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-titolo`}>Titolo</Label>
            <Input id={`${id}-titolo`} name="titolo" type="text" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-dettaglio`}>Dettaglio (facoltativo)</Label>
            <Textarea id={`${id}-dettaglio`} name="dettaglio" rows={2} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-scadenza`}>Scadenza (facoltativa)</Label>
            <Input id={`${id}-scadenza`} name="scadenza" type="date" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-importante`}>Importanza</Label>
            <Select name="importante" defaultValue="false" required>
              <SelectTrigger id={`${id}-importante`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Normale</SelectItem>
                <SelectItem value="true">Importante</SelectItem>
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
