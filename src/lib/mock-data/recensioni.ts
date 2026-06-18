import type { Recensione } from "@/lib/types";

export const recensioni: Recensione[] = [
  {
    id: "r1",
    cliente: "Marco Rossi",
    punteggio: 5,
    testo: "Sempre gentili e puntuali, consigliato!",
    data: "12 giugno 2026",
    risposta: "Risposto",
  },
  {
    id: "r2",
    cliente: "Sara Esposito",
    punteggio: 5,
    testo: "Servizio ottimo, ambiente curato.",
    data: "8 giugno 2026",
    risposta: "Risposto",
  },
  {
    id: "r3",
    cliente: "Chiara Marini",
    punteggio: 4,
    testo: "Molto bene, un po' di attesa in più del previsto.",
    data: "16 giugno 2026",
    risposta: "Da rispondere",
  },
  {
    id: "r4",
    cliente: "Davide Romano",
    punteggio: 3,
    testo: "Nella media, mi aspettavo qualcosa in più.",
    data: "17 giugno 2026",
    risposta: "Da rispondere",
  },
];
