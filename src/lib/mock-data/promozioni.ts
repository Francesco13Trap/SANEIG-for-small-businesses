import type { Promozione } from "@/lib/types";

export const promozioni: Promozione[] = [
  {
    id: "pr1",
    titolo: "Sconto del 10% per i nuovi clienti",
    descrizione: "Valido sul primo appuntamento prenotato.",
    periodo: "1 - 30 giugno 2026",
    stato: "Attiva",
  },
  {
    id: "pr2",
    titolo: "Porta un amico",
    descrizione: "Uno sconto per chi porta un nuovo cliente.",
    periodo: "15 giugno - 15 luglio 2026",
    stato: "Attiva",
  },
  {
    id: "pr3",
    titolo: "Promozione estiva",
    descrizione: "Offerta speciale per i mesi di luglio e agosto.",
    periodo: "1 luglio - 31 agosto 2026",
    stato: "Programmata",
  },
  {
    id: "pr4",
    titolo: "Promozione di primavera",
    descrizione: "Sconto sui rinnovi degli abbonamenti.",
    periodo: "1 - 30 aprile 2026",
    stato: "Conclusa",
  },
];
