import type { Preventivo } from "@/lib/types";

export const preventivi: Preventivo[] = [
  {
    id: "pv1",
    cliente: "Davide Romano",
    descrizione: "Intervento completo",
    importo: 250,
    data: "10 giugno 2026",
    stato: "Inviato",
  },
  {
    id: "pv2",
    cliente: "Chiara Marini",
    descrizione: "Primo trattamento + prodotti",
    importo: 90,
    data: "17 giugno 2026",
    stato: "Da inviare",
  },
  {
    id: "pv3",
    cliente: "Anna Colombo",
    descrizione: "Rinnovo abbonamento annuale",
    importo: 480,
    data: "2 giugno 2026",
    stato: "Accettato",
  },
  {
    id: "pv4",
    cliente: "Luca Ferrari",
    descrizione: "Servizio extra richiesto",
    importo: 60,
    data: "30 maggio 2026",
    stato: "Rifiutato",
  },
];
