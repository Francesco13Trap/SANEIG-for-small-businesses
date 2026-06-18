import type { ScadenzaAttivita } from "@/lib/types";

export const scadenzeAttivita: ScadenzaAttivita[] = [
  {
    id: "sa1",
    titolo: "Rinnovo assicurazione attività",
    categoria: "Assicurazione",
    scadenza: "30 giugno 2026",
    stato: "Da fare",
  },
  {
    id: "sa2",
    titolo: "Controllo periodico attrezzature",
    categoria: "Manutenzione",
    scadenza: "10 luglio 2026",
    stato: "In corso",
  },
  {
    id: "sa3",
    titolo: "Rinnovo certificazione sicurezza",
    categoria: "Sicurezza",
    scadenza: "5 giugno 2026",
    stato: "Completata",
  },
  {
    id: "sa4",
    titolo: "Pagamento canone locale",
    categoria: "Affitto",
    scadenza: "1 luglio 2026",
    stato: "Da fare",
  },
];
