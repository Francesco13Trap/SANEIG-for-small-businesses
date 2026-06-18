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
import type { ArticoloMagazzino } from "@/lib/types";

export function MagazzinoTable({
  articoli,
}: {
  articoli: ArticoloMagazzino[];
}) {
  const [righe, setRighe] = useState(articoli);

  function segnaOrdinato(id: string) {
    setRighe((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stato: "Disponibile" } : a))
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Articolo</TableHead>
          <TableHead>Quantità</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="pr-5 text-right">Azione</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {righe.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="pl-5 font-medium text-foreground">
              {a.nome}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {a.quantita} {a.unita}
            </TableCell>
            <TableCell>
              <StatusBadge status={a.stato} />
            </TableCell>
            <TableCell className="pr-5 text-right">
              {a.stato === "Disponibile" ? (
                <Button variant="ghost" size="sm" disabled>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  A posto
                </Button>
              ) : (
                <Button size="sm" onClick={() => segnaOrdinato(a.id)}>
                  Segna come ordinato
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
