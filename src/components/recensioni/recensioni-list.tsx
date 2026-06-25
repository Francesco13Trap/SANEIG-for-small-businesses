"use client";

import { useActionState } from "react";
import { Check, Undo2 } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { CopyMessageButton } from "@/components/copy-message-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Stars } from "@/components/recensioni/stars";
import { RecensioneFormDialog } from "@/components/recensioni/recensione-form-dialog";
import { EliminaRecensioneDialog } from "@/components/recensioni/elimina-recensione-dialog";
import { setRecensioneRisposta } from "@/app/recensioni/actions";
import {
  formatDataRecensione,
  type RecensioneRecord,
} from "@/lib/recensioni/types";

export function RecensioniList({
  recensioni,
}: {
  recensioni: RecensioneRecord[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {recensioni.map((r) => (
        <RecensioneItem key={r.id} recensione={r} />
      ))}
    </div>
  );
}

function RecensioneItem({ recensione: r }: { recensione: RecensioneRecord }) {
  const [state, formAction, pending] = useActionState(
    setRecensioneRisposta,
    undefined,
  );
  const risposto = r.risposta === "Risposto";
  const data = formatDataRecensione(r.data);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground">{r.cliente}</span>
          <Stars punteggio={r.punteggio} />
        </div>
        <StatusBadge status={r.risposta} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{r.testo}</p>
        {data && <p className="mt-1 text-xs text-muted-foreground">{data}</p>}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <CopyMessageButton
          label="Copia risposta"
          message={`Ciao ${r.cliente}, grazie mille per la tua recensione! Per noi conta davvero tanto.`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <form action={formAction}>
            <input type="hidden" name="id" value={r.id} />
            <input
              type="hidden"
              name="risposto"
              value={risposto ? "false" : "true"}
            />
            <Button
              variant={risposto ? "ghost" : "outline"}
              size="sm"
              type="submit"
              disabled={pending}
            >
              {risposto ? (
                <Undo2 className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {risposto ? "Da rispondere" : "Segna come risposto"}
            </Button>
          </form>
          <RecensioneFormDialog mode="edit" recensione={r} />
          <EliminaRecensioneDialog id={r.id} cliente={r.cliente} />
        </div>
      </CardFooter>
      {state?.error && (
        <CardContent className="pt-0">
          <p className="text-xs text-destructive">{state.error}</p>
        </CardContent>
      )}
    </Card>
  );
}
