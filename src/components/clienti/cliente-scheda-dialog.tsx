"use client";

import { Phone, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import type { Cliente } from "@/lib/types";

export function ClienteSchedaDialog({ cliente }: { cliente: Cliente }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Apri scheda
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cliente.nome}</DialogTitle>
          <DialogDescription>{cliente.telefono}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Stato</span>
            <StatusBadge status={cliente.stato} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ultimo contatto</span>
            <span className="text-foreground">{cliente.ultimoContatto}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Nota</span>
            <span className="text-foreground">{cliente.nota}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" asChild>
            <a href={`tel:${cliente.telefono.replace(/\s+/g, "")}`}>
              <Phone className="h-4 w-4" />
              Chiama
            </a>
          </Button>
          <Button asChild>
            <a href="/messaggi">
              <MessageSquare className="h-4 w-4" />
              Vai ai messaggi
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
