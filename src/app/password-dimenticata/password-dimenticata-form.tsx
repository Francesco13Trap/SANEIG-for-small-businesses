"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/app/password-dimenticata/actions";

export function PasswordDimenticataForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-success">{state.success}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Invio in corso..." : "Invia link"}
      </Button>
    </form>
  );
}
