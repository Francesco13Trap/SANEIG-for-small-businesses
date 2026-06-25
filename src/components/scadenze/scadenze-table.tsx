"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScadenzaFormDialog } from "@/components/scadenze/scadenza-form-dialog";
import { EliminaScadenzaDialog } from "@/components/scadenze/elimina-scadenza-dialog";
import { setScadenzaCompletata } from "@/app/scadenze-attivita/actions";
import {
  STATO_SCADENZA_LABELS,
  formatScadenza,
  type ScadenzaRecord,
} from "@/lib/scadenze/types";

export function ScadenzeTable({ scadenze }: { scadenze: ScadenzaRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Attività</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Scadenza</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="pr-5 text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scadenze.map((s) => (
          <ScadenzaRow key={s.id} scadenza={s} />
        ))}
      </TableBody>
    </Table>
  );
}

function ScadenzaRow({ scadenza: s }: { scadenza: ScadenzaRecord }) {
  const [state, formAction, pending] = useActionState(
    setScadenzaCompletata,
    undefined,
  );
  const completata = s.stato === "done";

  return (
    <TableRow>
      <TableCell className="pl-5 font-medium text-foreground">
        {s.titolo}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {s.categoria ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatScadenza(s.scadenza)}
      </TableCell>
      <TableCell>
        <StatusBadge status={STATO_SCADENZA_LABELS[s.stato]} />
      </TableCell>
      <TableCell className="pr-5 text-right">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {completata ? (
            <Button variant="ghost" size="sm" disabled>
              <CheckCircle2 className="h-4 w-4 text-success" />
              Completata
            </Button>
          ) : (
            <form action={formAction}>
              <input type="hidden" name="id" value={s.id} />
              <Button size="sm" type="submit" disabled={pending}>
                Segna come completata
              </Button>
            </form>
          )}
          <ScadenzaFormDialog mode="edit" scadenza={s} />
          <EliminaScadenzaDialog id={s.id} titolo={s.titolo} />
        </div>
        {state?.error && (
          <p className="mt-1 text-xs text-destructive">{state.error}</p>
        )}
      </TableCell>
    </TableRow>
  );
}
