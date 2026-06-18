import type { Abbonamento } from "@/lib/types";

export const abbonamenti: Abbonamento[] = [
  {
    id: "a1",
    clienteId: "c1",
    cliente: "Marco Rossi",
    nome: "Abbonamento mensile",
    dataInizio: "1 maggio 2026",
    scadenza: "1 luglio 2026",
    stato: "Attivo",
  },
  {
    id: "a2",
    clienteId: "c5",
    cliente: "Paolo Greco",
    nome: "Abbonamento 10 ingressi",
    dataInizio: "20 aprile 2026",
    scadenza: "20 giugno 2026",
    stato: "In scadenza",
  },
  {
    id: "a3",
    clienteId: "c4",
    cliente: "Anna Colombo",
    nome: "Abbonamento mensile",
    dataInizio: "1 marzo 2026",
    scadenza: "1 aprile 2026",
    stato: "Scaduto",
  },
  {
    id: "a4",
    clienteId: "c6",
    cliente: "Sara Esposito",
    nome: "Abbonamento trimestrale",
    dataInizio: "1 aprile 2026",
    scadenza: "24 giugno 2026",
    stato: "In scadenza",
  },
  {
    id: "a5",
    clienteId: "c2",
    cliente: "Giulia Bianchi",
    nome: "Abbonamento mensile",
    dataInizio: "10 maggio 2026",
    scadenza: "10 giugno 2026",
    stato: "Da rinnovare",
  },
];
