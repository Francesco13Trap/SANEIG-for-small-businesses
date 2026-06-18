"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { creaAttivita } from "@/app/nuova-attivita/actions";

export function NuovaAttivitaForm() {
  const [state, formAction, pending] = useActionState(creaAttivita, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nome">Nome attività</Label>
        <Input
          id="nome"
          name="nome"
          type="text"
          placeholder="Es. Parrucchieria Anna"
          autoComplete="organization"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creazione in corso..." : "Crea attività"}
      </Button>
    </form>
  );
}
