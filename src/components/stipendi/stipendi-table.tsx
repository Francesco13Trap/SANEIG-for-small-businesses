"use client";

import { useState } from "react";
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
import type { Stipendio } from "@/lib/types";

export function StipendiTable({ stipendi }: { stipendi: Stipendio[] }) {
  const [righe, setRighe] = useState(stipendi);

  function segnaPagato(id: string) {
    setRighe((prev) =>
      prev.map((s) => (s.id === id ? { ...s, stato: "Pagato" } : s))
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Dipendente</TableHead>
          <TableHead>Ruolo</TableHead>
          <TableHead>Mese</TableHead>
          <TableHead>Importo netto</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="pr-5 text-right">Azione</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {righe.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="pl-5 font-medium text-foreground">
              {s.dipendente}
            </TableCell>
            <TableCell className="text-muted-foreground">{s.ruolo}</TableCell>
            <TableCell className="text-muted-foreground">{s.mese}</TableCell>
            <TableCell className="text-foreground">
              {s.importoNetto} €
            </TableCell>
            <TableCell>
              <StatusBadge status={s.stato} />
            </TableCell>
            <TableCell className="pr-5 text-right">
              {s.stato === "Pagato" ? (
                <Button variant="ghost" size="sm" disabled>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Pagato
                </Button>
              ) : (
                <Button size="sm" onClick={() => segnaPagato(s.id)}>
                  Segna come pagato
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
