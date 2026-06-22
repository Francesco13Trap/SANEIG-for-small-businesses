"use client";

import { useMemo, useState } from "react";

import { CopyMessageButton } from "@/components/copy-message-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildClienteFollowUpMessage } from "@/lib/messaggi/reminders";

export function ClienteFollowUpCard({
  clienti,
}: {
  clienti: { id: string; nome: string }[];
}) {
  const [clienteId, setClienteId] = useState(clienti[0]?.id ?? "");
  const cliente = clienti.find((c) => c.id === clienteId);
  const testo = useMemo(
    () => (cliente ? buildClienteFollowUpMessage(cliente.nome) : ""),
    [cliente],
  );

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Aggiornamento per un cliente</CardTitle>
        <CardDescription>
          Scegli un cliente per preparare un messaggio di aggiornamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <Select value={clienteId} onValueChange={setClienteId}>
          <SelectTrigger>
            <SelectValue placeholder="Scegli un cliente" />
          </SelectTrigger>
          <SelectContent>
            {clienti.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="rounded-lg bg-secondary p-3 text-sm text-foreground">
          {testo}
        </p>
      </CardContent>
      <CardFooter>
        <CopyMessageButton message={testo} />
      </CardFooter>
    </Card>
  );
}
