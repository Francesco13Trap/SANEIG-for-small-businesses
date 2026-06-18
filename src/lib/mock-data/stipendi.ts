import type { Stipendio } from "@/lib/types";

export const stipendi: Stipendio[] = [
  {
    id: "s1",
    dipendente: "Federica Conti",
    ruolo: "Collaboratrice",
    importoNetto: 1250,
    mese: "Giugno 2026",
    stato: "Da pagare",
  },
  {
    id: "s2",
    dipendente: "Matteo Russo",
    ruolo: "Collaboratore",
    importoNetto: 1100,
    mese: "Giugno 2026",
    stato: "Da pagare",
  },
  {
    id: "s3",
    dipendente: "Federica Conti",
    ruolo: "Collaboratrice",
    importoNetto: 1250,
    mese: "Maggio 2026",
    stato: "Pagato",
  },
  {
    id: "s4",
    dipendente: "Matteo Russo",
    ruolo: "Collaboratore",
    importoNetto: 1100,
    mese: "Maggio 2026",
    stato: "Pagato",
  },
];
