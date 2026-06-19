"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/nuova-password/actions";

export function NuovaPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    undefined,
  );

  if (state?.success) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-success">{state.success}</p>
        <Link
          href="/accedi"
          className="text-sm font-medium text-primary hover:underline"
        >
          Vai ad accedere
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Nuova password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Conferma password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Aggiornamento in corso..." : "Aggiorna password"}
      </Button>
    </form>
  );
}
