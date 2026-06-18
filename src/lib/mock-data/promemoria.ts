import type { Promemoria } from "@/lib/types";

export const promemoria: Promemoria[] = [
  {
    id: "pm1",
    titolo: "Richiamare Giulia Bianchi",
    dettaglio: "Pagamento di 45 € ancora da sollecitare.",
    scadenza: "Oggi",
    importante: true,
  },
  {
    id: "pm2",
    titolo: "Avvisare Paolo Greco",
    dettaglio: "Abbonamento in scadenza il 20 giugno.",
    scadenza: "Oggi",
    importante: true,
  },
  {
    id: "pm3",
    titolo: "Ordinare guanti monouso",
    dettaglio: "In magazzino ne restano pochi.",
    scadenza: "Questa settimana",
    importante: false,
  },
  {
    id: "pm4",
    titolo: "Rispondere alla recensione di Chiara Marini",
    dettaglio: "Recensione lasciata il 16 giugno.",
    scadenza: "Questa settimana",
    importante: false,
  },
  {
    id: "pm5",
    titolo: "Rinnovo assicurazione attività",
    dettaglio: "Scade il 30 giugno, da non dimenticare.",
    scadenza: "30 giugno 2026",
    importante: true,
  },
];
