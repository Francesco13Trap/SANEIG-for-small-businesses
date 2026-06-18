import type { Fornitore } from "@/lib/types";

export const fornitori: Fornitore[] = [
  {
    id: "f1",
    nome: "Distribuzione Nord Srl",
    categoria: "Prodotti di consumo",
    telefono: "02 1234567",
    ultimoOrdine: "5 giugno 2026",
    stato: "Attivo",
  },
  {
    id: "f2",
    nome: "Forniture Italia",
    categoria: "Materiale tecnico",
    telefono: "06 7654321",
    ultimoOrdine: "28 maggio 2026",
    stato: "Attivo",
  },
  {
    id: "f3",
    nome: "EcoPulizie",
    categoria: "Pulizia e igiene",
    telefono: "011 9988776",
    ultimoOrdine: "1 maggio 2026",
    stato: "Da contattare",
  },
];
