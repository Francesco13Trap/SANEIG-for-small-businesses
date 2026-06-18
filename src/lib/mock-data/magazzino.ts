import type { ArticoloMagazzino } from "@/lib/types";

export const magazzino: ArticoloMagazzino[] = [
  {
    id: "mg1",
    nome: "Prodotto base trattamento",
    quantita: 18,
    unita: "pezzi",
    stato: "Disponibile",
  },
  {
    id: "mg2",
    nome: "Guanti monouso",
    quantita: 4,
    unita: "scatole",
    stato: "In esaurimento",
  },
  {
    id: "mg3",
    nome: "Materiale di consumo vario",
    quantita: 0,
    unita: "pezzi",
    stato: "Da ordinare",
  },
  {
    id: "mg4",
    nome: "Asciugamani",
    quantita: 32,
    unita: "pezzi",
    stato: "Disponibile",
  },
];
