import type { MessaggioTemplate } from "@/lib/types";

export const messaggi: MessaggioTemplate[] = [
  {
    id: "m1",
    titolo: "Conferma appuntamento",
    descrizione: "Da usare quando un cliente prenota.",
    testo:
      "Ciao [nome], confermiamo il tuo appuntamento per il [data] alle [ora]. Ti aspettiamo!",
  },
  {
    id: "m2",
    titolo: "Promemoria appuntamento",
    descrizione: "Da inviare il giorno prima.",
    testo:
      "Ciao [nome], ti ricordiamo l'appuntamento di domani [data] alle [ora]. A presto!",
  },
  {
    id: "m3",
    titolo: "Recupero cliente inattivo",
    descrizione: "Per i clienti che non si vedono da un po'.",
    testo:
      "Ciao [nome], è da un po' che non ti vediamo! Se vuoi possiamo trovare un nuovo appuntamento quando preferisci.",
  },
  {
    id: "m4",
    titolo: "Richiesta recensione",
    descrizione: "Da inviare dopo un servizio andato bene.",
    testo:
      "Ciao [nome], grazie per essere venuto/a da noi! Se ti va, una tua recensione ci aiuterebbe molto.",
  },
  {
    id: "m5",
    titolo: "Promozione della settimana",
    descrizione: "Per far conoscere un'offerta in corso.",
    testo:
      "Ciao [nome], questa settimana abbiamo una promozione speciale. Vuoi maggiori informazioni?",
  },
  {
    id: "m6",
    titolo: "Sollecito gentile pagamento",
    descrizione: "Per ricordare un pagamento in sospeso, con tono gentile.",
    testo:
      "Ciao [nome], ti scrivo solo per ricordarti il pagamento di [importo] relativo a [data]. Fammi sapere quando ti è comodo, grazie!",
  },
  {
    id: "m7",
    titolo: "Promemoria scadenza abbonamento",
    descrizione: "Da inviare quando un abbonamento sta per finire.",
    testo:
      "Ciao [nome], il tuo abbonamento sta per scadere il [data]. Vuoi che te lo rinnoviamo?",
  },
  {
    id: "m8",
    titolo: "Conferma rinnovo",
    descrizione: "Da inviare dopo aver rinnovato un abbonamento.",
    testo:
      "Ciao [nome], il tuo abbonamento è stato rinnovato fino al [data]. Grazie per la fiducia!",
  },
];
