"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitDemoRequest } from "@/app/richiedi-demo/actions";

export function DemoRequestForm() {
  const [state, formAction, pending] = useActionState(
    submitDemoRequest,
    undefined,
  );

  if (state?.success) {
    return <p className="text-sm text-success">{state.success}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="businessName">Attività</Label>
        <Input
          id="businessName"
          name="businessName"
          type="text"
          autoComplete="organization"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Telefono</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Messaggio (facoltativo)</Label>
        <Textarea id="message" name="message" rows={3} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? "Invio in corso..." : "Invia richiesta"}
      </Button>
    </form>
  );
}
