export interface Appuntamento {
  id: string;
  cliente: string;
  ora: string;
  servizio: string;
}

export interface Promemoria {
  id: string;
  titolo: string;
  dettaglio: string;
  scadenza: string;
  importante: boolean;
}

export type StatoCliente = "Nuovo" | "Abituale" | "Da ricontattare";

export interface Cliente {
  id: string;
  nome: string;
  telefono: string;
  ultimoContatto: string;
  stato: StatoCliente;
  nota: string;
}

export type StatoPagamento = "Da controllare" | "Da sollecitare" | "Pagato";

export interface Pagamento {
  id: string;
  clienteId: string;
  cliente: string;
  importo: number;
  scadenza: string;
  stato: StatoPagamento;
}

export type StatoAbbonamento = "Attivo" | "In scadenza" | "Scaduto" | "Da rinnovare";

export interface Abbonamento {
  id: string;
  clienteId: string;
  cliente: string;
  nome: string;
  dataInizio: string;
  scadenza: string;
  stato: StatoAbbonamento;
}

export interface MessaggioTemplate {
  id: string;
  titolo: string;
  descrizione: string;
  testo: string;
}

export interface RiepilogoSettimana {
  clientiServiti: number;
  clientiNuovi: number;
  clientiDaRecuperare: number;
  appuntamentiCompletati: number;
  pagamentiDaControllare: number;
  abbonamentiInScadenza: number;
  prossimeAzioni: string[];
}

export type RegimeIva = "ordinario" | "forfettario" | "non-lo-so";

export interface MovimentoIva {
  id: string;
  descrizione: string;
  importo: number;
}

export interface RiepilogoMensileCommercialista {
  mese: string;
  incassiSegnati: number;
  speseSegnate: number;
  pagamentiDaControllare: number;
  documentiMancanti: string[];
  noteDelMese: string;
}

export interface Promozione {
  id: string;
  titolo: string;
  descrizione: string;
  periodo: string;
  stato: "Attiva" | "Programmata" | "Conclusa";
}

export interface Recensione {
  id: string;
  cliente: string;
  punteggio: number;
  testo: string;
  data: string;
  risposta: "Da rispondere" | "Risposto";
}

export type StatoPreventivo = "Da inviare" | "Inviato" | "Accettato" | "Rifiutato";

export interface Preventivo {
  id: string;
  cliente: string;
  descrizione: string;
  importo: number;
  data: string;
  stato: StatoPreventivo;
}

export interface Stipendio {
  id: string;
  dipendente: string;
  ruolo: string;
  importoNetto: number;
  mese: string;
  stato: "Da pagare" | "Pagato";
}

export interface Fornitore {
  id: string;
  nome: string;
  categoria: string;
  telefono: string;
  ultimoOrdine: string;
  stato: "Attivo" | "Da contattare";
}

export type StatoMagazzino = "Disponibile" | "In esaurimento" | "Da ordinare";

export interface ArticoloMagazzino {
  id: string;
  nome: string;
  quantita: number;
  unita: string;
  stato: StatoMagazzino;
}

export interface ScadenzaAttivita {
  id: string;
  titolo: string;
  categoria: string;
  scadenza: string;
  stato: "Da fare" | "In corso" | "Completata";
}
