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
import type { ScadenzaAttivita } from "@/lib/types";

export function ScadenzeTable({ scadenze }: { scadenze: ScadenzaAttivita[] }) {
  const [righe, setRighe] = useState(scadenze);

  function segnaCompletata(id: string) {
    setRighe((prev) =>
      prev.map((s) => (s.id === id ? { ...s, stato: "Completata" } : s))
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Attività</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Scadenza</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="pr-5 text-right">Azione</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {righe.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="pl-5 font-medium text-foreground">
              {s.titolo}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {s.categoria}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {s.scadenza}
            </TableCell>
            <TableCell>
              <StatusBadge status={s.stato} />
            </TableCell>
            <TableCell className="pr-5 text-right">
              {s.stato === "Completata" ? (
                <Button variant="ghost" size="sm" disabled>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Completata
                </Button>
              ) : (
                <Button size="sm" onClick={() => segnaCompletata(s.id)}>
                  Segna come completata
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
