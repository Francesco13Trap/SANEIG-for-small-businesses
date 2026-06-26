// Pure derivation helpers that turn the records already used by Pagamenti,
// Abbonamenti, Scadenze attività, Promemoria, Recensioni, Promozioni and
// Commercialista into the grouped lists shown on the Riepilogo settimana
// page. No data fetching here — the page reads the real tables and these
// functions only sort what's already loaded into the right weekly buckets.

import { formatImporto, type PagamentoRecord } from "@/lib/pagamenti/types";
import { formatData as formatDataAbbonamento, type AbbonamentoRecord } from "@/lib/abbonamenti/types";
import { formatScadenza as formatScadenzaAttivita, type ScadenzaRecord } from "@/lib/scadenze/types";
import type { PromemoriaRecord } from "@/lib/promemoria/types";
import type { RecensioneRecord } from "@/lib/recensioni/types";
import type { PromozioneRecord } from "@/lib/promozioni/types";
import type { DocumentoMancanteRecord } from "@/lib/commercialista/types";

export type RigaRiepilogo = {
  id: string;
  testo: string;
  dettaglio: string | null;
};

function isWithinWeek(value: string | null, weekStart: string, weekEnd: string): boolean {
  if (!value) return false;
  const date = value.slice(0, 10);
  return date >= weekStart && date <= weekEnd;
}

// Pagamenti: ogni pagamento finisce in un solo gruppo (scaduto, da
// sollecitare, in scadenza questa settimana, oppure pagato questa
// settimana), così il conteggio non duplica lo stesso pagamento.
export function buildPagamentiSettimana(
  pagamenti: PagamentoRecord[],
  weekStart: string,
  weekEnd: string,
  today: string,
): RigaRiepilogo[] {
  const righe: RigaRiepilogo[] = [];

  for (const p of pagamenti) {
    const dettaglio = `${formatImporto(p.importo)} €`;

    if (p.stato === "paid") {
      if (isWithinWeek(p.updatedAt, weekStart, weekEnd)) {
        righe.push({ id: p.id, testo: `Pagato questa settimana — ${p.cliente}`, dettaglio });
      }
      continue;
    }

    if (p.scadenza && p.scadenza < today) {
      righe.push({ id: p.id, testo: `Scaduto — ${p.cliente}`, dettaglio });
    } else if (p.stato === "to_remind") {
      righe.push({ id: p.id, testo: `Da sollecitare — ${p.cliente}`, dettaglio });
    } else if (p.scadenza && p.scadenza >= today && p.scadenza <= weekEnd) {
      righe.push({ id: p.id, testo: `In scadenza questa settimana — ${p.cliente}`, dettaglio });
    }
  }

  return righe;
}

// Abbonamenti: scaduti o in scadenza questa settimana (gli annullati non
// servono in un riepilogo di cose da controllare).
export function buildAbbonamentiSettimana(
  abbonamenti: AbbonamentoRecord[],
  weekEnd: string,
  today: string,
): RigaRiepilogo[] {
  const righe: RigaRiepilogo[] = [];

  for (const a of abbonamenti) {
    if (a.stato === "cancelled") continue;

    if (a.stato === "expired" || a.scadenza < today) {
      righe.push({
        id: a.id,
        testo: `Scaduto — ${a.cliente} (${a.nome})`,
        dettaglio: formatDataAbbonamento(a.scadenza),
      });
    } else if (a.scadenza <= weekEnd) {
      righe.push({
        id: a.id,
        testo: `In scadenza — ${a.cliente} (${a.nome})`,
        dettaglio: formatDataAbbonamento(a.scadenza),
      });
    }
  }

  return righe;
}

// Promemoria e Scadenze e attività vengono mostrati insieme, perché sono
// entrambe semplici cose-da-fare. Solo i promemoria espongono updatedAt, per
// questo "completato questa settimana" è disponibile solo per loro: le
// attività (tabella deadlines) restano nell'elenco degli aperti finché non
// vengono segnate come completate altrove.
export function buildPromemoriaSettimana(
  promemoria: PromemoriaRecord[],
  attivita: ScadenzaRecord[],
  weekStart: string,
  weekEnd: string,
): RigaRiepilogo[] {
  const righe: RigaRiepilogo[] = [];

  for (const p of promemoria) {
    if (!p.fatto) {
      righe.push({
        id: `promemoria-${p.id}`,
        testo: p.importante ? `Importante — ${p.titolo}` : p.titolo,
        dettaglio: null,
      });
    } else if (isWithinWeek(p.updatedAt, weekStart, weekEnd)) {
      righe.push({
        id: `promemoria-${p.id}`,
        testo: `Completato questa settimana — ${p.titolo}`,
        dettaglio: null,
      });
    }
  }

  for (const s of attivita) {
    if (s.stato === "done") continue;
    righe.push({
      id: `attivita-${s.id}`,
      testo: s.titolo,
      dettaglio: s.scadenza ? formatScadenzaAttivita(s.scadenza) : null,
    });
  }

  return righe;
}

// Commercialista: documenti mancanti più, se presente, la nota del mese
// come ultima riga.
export function buildCommercialistaSettimana(
  documenti: DocumentoMancanteRecord[],
  notaDelMese: string,
): RigaRiepilogo[] {
  const righe: RigaRiepilogo[] = documenti.map((d) => ({
    id: d.id,
    testo: d.descrizione,
    dettaglio: null,
  }));

  const nota = notaDelMese.trim();
  if (nota) {
    righe.push({ id: "nota-del-mese", testo: `Nota del mese — ${nota}`, dettaglio: null });
  }

  return righe;
}

// "Da controllare": solo le cose davvero urgenti, prese da tutte le altre
// sezioni, per avere un unico elenco da guardare prima di chiudere la
// settimana.
export function buildElementiDaControllare(input: {
  pagamenti: PagamentoRecord[];
  abbonamenti: AbbonamentoRecord[];
  attivita: ScadenzaRecord[];
  promemoria: PromemoriaRecord[];
  recensioni: RecensioneRecord[];
  today: string;
}): RigaRiepilogo[] {
  const { pagamenti, abbonamenti, attivita, promemoria, recensioni, today } = input;
  const righe: RigaRiepilogo[] = [];

  for (const p of pagamenti) {
    if (p.stato === "paid") continue;
    if ((p.scadenza && p.scadenza < today) || p.stato === "to_remind") {
      righe.push({
        id: `pagamento-${p.id}`,
        testo: `Pagamento — ${p.cliente}`,
        dettaglio: `${formatImporto(p.importo)} €`,
      });
    }
  }

  for (const a of abbonamenti) {
    if (a.stato === "cancelled") continue;
    if (a.stato === "expired" || a.scadenza < today) {
      righe.push({
        id: `abbonamento-${a.id}`,
        testo: `Abbonamento scaduto — ${a.cliente}`,
        dettaglio: formatDataAbbonamento(a.scadenza),
      });
    }
  }

  for (const s of attivita) {
    if (s.stato !== "done" && s.scadenza && s.scadenza < today) {
      righe.push({
        id: `attivita-${s.id}`,
        testo: `Attività in ritardo — ${s.titolo}`,
        dettaglio: formatScadenzaAttivita(s.scadenza),
      });
    }
  }

  for (const p of promemoria) {
    if (!p.fatto && p.importante) {
      righe.push({ id: `promemoria-${p.id}`, testo: `Promemoria — ${p.titolo}`, dettaglio: null });
    }
  }

  for (const r of recensioni) {
    if (r.risposta === "Da rispondere") {
      righe.push({
        id: `recensione-${r.id}`,
        testo: `Recensione da rispondere — ${r.cliente}`,
        dettaglio: null,
      });
    }
  }

  return righe;
}

// Recensioni di questa settimana, divise tra positive e da migliorare —
// solo per dare un'idea di come è andata, non un'analisi del sentiment.
export function buildRecensioniSettimana(
  recensioni: RecensioneRecord[],
  weekStart: string,
  weekEnd: string,
): { positive: RecensioneRecord[]; negative: RecensioneRecord[] } {
  const questaSettimana = recensioni.filter((r) => isWithinWeek(r.data, weekStart, weekEnd));

  return {
    positive: questaSettimana.filter((r) => r.punteggio >= 4),
    negative: questaSettimana.filter((r) => r.punteggio <= 2),
  };
}

export function buildPromozioniInEvidenza(promozioni: PromozioneRecord[]): PromozioneRecord[] {
  return promozioni.filter((p) => p.stato === "active" || p.stato === "scheduled");
}
