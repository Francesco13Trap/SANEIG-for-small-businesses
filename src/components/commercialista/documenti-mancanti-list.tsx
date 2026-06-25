"use client";

import { useActionState, useEffect, useRef } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addDocumentoMancante,
  deleteDocumentoMancante,
} from "@/app/commercialista/actions";
import type { DocumentoMancanteRecord } from "@/lib/commercialista/types";

export function DocumentiMancantiList({
  documenti,
}: {
  documenti: DocumentoMancanteRecord[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {documenti.length > 0 ? (
        <ul className="flex flex-col gap-2 text-sm">
          {documenti.map((documento) => (
            <DocumentoMancanteItem key={documento.id} documento={documento} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nessun documento mancante al momento.
        </p>
      )}
      <AggiungiDocumentoForm />
    </div>
  );
}

function DocumentoMancanteItem({
  documento,
}: {
  documento: DocumentoMancanteRecord;
}) {
  const [, formAction, pending] = useActionState(deleteDocumentoMancante, undefined);

  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-foreground">• {documento.descrizione}</span>
      <form action={formAction}>
        <input type="hidden" name="id" value={documento.id} />
        <Button variant="ghost" size="sm" type="submit" disabled={pending}>
          <Check className="h-4 w-4" />
          Trovato
        </Button>
      </form>
    </li>
  );
}

function AggiungiDocumentoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(addDocumentoMancante, undefined);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        name="descrizione"
        placeholder="Es. Fattura fornitore di giugno"
        required
        className="sm:w-72"
      />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        <Plus className="h-4 w-4" />
        Aggiungi
      </Button>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </form>
  );
}
