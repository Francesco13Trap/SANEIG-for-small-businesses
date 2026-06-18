"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyMessageButton } from "@/components/copy-message-button";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Abbonamento } from "@/lib/types";

export function AbbonamentiTable({
  abbonamenti,
}: {
  abbonamenti: Abbonamento[];
}) {
  const [righe, setRighe] = useState(abbonamenti);

  function segnaRinnovato(id: string) {
    setRighe((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stato: "Attivo" } : a))
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-5">Cliente</TableHead>
          <TableHead>Abbonamento</TableHead>
          <TableHead>Data inizio</TableHead>
          <TableHead>Scadenza</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="pr-5 text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {righe.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="pl-5 font-medium text-foreground">
              {a.cliente}
            </TableCell>
            <TableCell className="text-muted-foreground">{a.nome}</TableCell>
            <TableCell className="text-muted-foreground">
              {a.dataInizio}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {a.scadenza}
            </TableCell>
            <TableCell>
              <StatusBadge status={a.stato} />
            </TableCell>
            <TableCell className="pr-5">
              <div className="flex flex-wrap justify-end gap-2">
                <CopyMessageButton
                  label="Avvisa cliente"
                  message={`Ciao ${a.cliente}, il tuo abbonamento "${a.nome}" scade il ${a.scadenza}. Vuoi che te lo rinnoviamo?`}
                />
                {a.stato === "Attivo" ? (
                  <Button variant="ghost" size="sm" disabled>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Rinnovato
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => segnaRinnovato(a.id)}>
                    Segna come rinnovato
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
