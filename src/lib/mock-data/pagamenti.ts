import type { Pagamento } from "@/lib/types";

export const pagamenti: Pagamento[] = [
  {
    id: "p1",
    clienteId: "c2",
    cliente: "Giulia Bianchi",
    importo: 45,
    scadenza: "20 giugno 2026",
    stato: "Da sollecitare",
  },
  {
    id: "p2",
    clienteId: "c4",
    cliente: "Anna Colombo",
    importo: 120,
    scadenza: "22 giugno 2026",
    stato: "Da sollecitare",
  },
  {
    id: "p3",
    clienteId: "c1",
    cliente: "Marco Rossi",
    importo: 30,
    scadenza: "19 giugno 2026",
    stato: "Da controllare",
  },
  {
    id: "p4",
    clienteId: "c5",
    cliente: "Paolo Greco",
    importo: 60,
    scadenza: "15 giugno 2026",
    stato: "Pagato",
  },
  {
    id: "p5",
    clienteId: "c7",
    cliente: "Davide Romano",
    importo: 80,
    scadenza: "25 giugno 2026",
    stato: "Da controllare",
  },
  {
    id: "p6",
    clienteId: "c6",
    cliente: "Sara Esposito",
    importo: 50,
    scadenza: "14 giugno 2026",
    stato: "Pagato",
  },
];
