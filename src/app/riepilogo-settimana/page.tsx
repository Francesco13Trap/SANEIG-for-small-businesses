import { redirect } from "next/navigation";
import { AlertTriangle, Bell, FileText, Repeat, TrendingUp, Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { OverviewCard } from "@/components/oggi/overview-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IvaMonthlyDiff } from "@/components/iva/iva-monthly-diff";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapPagamentoRow, type PagamentoRow } from "@/lib/pagamenti/types";
import { mapAbbonamentoRow, type AbbonamentoRow } from "@/lib/abbonamenti/types";
import { mapScadenzaRow, type ScadenzaRow } from "@/lib/scadenze/types";
import { mapPromemoriaRow, type PromemoriaRow } from "@/lib/promemoria/types";
import { mapRecensioneRow, type RecensioneRow } from "@/lib/recensioni/types";
import { mapPromozioneRow, type PromozioneRow } from "@/lib/promozioni/types";
import {
  mapDocumentoMancanteRow,
  type DocumentoMancanteRow,
} from "@/lib/commercialista/types";
import { startOfCurrentMonth } from "@/lib/monthly-period";
import { endOfCurrentWeek, startOfCurrentWeek, today as todayDate } from "@/lib/week-period";
import {
  buildAbbonamentiSettimana,
  buildCommercialistaSettimana,
  buildElementiDaControllare,
  buildPagamentiSettimana,
  buildPromemoriaSettimana,
  buildPromozioniInEvidenza,
  buildRecensioniSettimana,
} from "@/lib/riepilogo-settimana/weekly-summary";

// Reads the session and several per-business Supabase tables on every
// request — must never be prerendered at build time, when env vars/cookies
// aren't available.
export const dynamic = "force-dynamic";

export default async function RiepilogoSettimanaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/accedi");
  }

  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const weekStart = startOfCurrentWeek();
  const weekEnd = endOfCurrentWeek();
  const today = todayDate();

  const [
    paymentsResult,
    subscriptionsResult,
    deadlinesResult,
    remindersResult,
    reviewsResult,
    promotionsResult,
    missingDocumentsResult,
    revenueSummaryResult,
  ] = await Promise.all([
    supabase
      .from("payments")
      .select("id, client_id, amount, due_date, status, created_at, updated_at, clients(name)")
      .eq("business_id", businessId)
      .order("due_date", { ascending: true }),
    supabase
      .from("subscriptions")
      .select(
        "id, client_id, name, start_date, expiry_date, status, note, created_at, updated_at, clients(name)",
      )
      .eq("business_id", businessId)
      .order("expiry_date", { ascending: true }),
    supabase
      .from("deadlines")
      .select("id, title, category, due_date, status, created_at")
      .eq("business_id", businessId)
      .order("due_date", { ascending: true }),
    supabase
      .from("reminders")
      .select("id, title, detail, due_date, important, done, created_at, updated_at")
      .eq("business_id", businessId)
      .order("due_date", { ascending: true }),
    supabase
      .from("reviews")
      .select("id, client_name, rating, comment, review_date, responded, created_at")
      .eq("business_id", businessId)
      .order("review_date", { ascending: false }),
    supabase
      .from("promotions")
      .select("id, title, description, period, status, created_at, updated_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false }),
    supabase
      .from("missing_documents")
      .select("id, description")
      .eq("business_id", businessId)
      .order("created_at", { ascending: true }),
    supabase
      .from("monthly_revenue_summaries")
      .select("incassi_segnati, spese_segnate, notes")
      .eq("business_id", businessId)
      .eq("period", startOfCurrentMonth())
      .maybeSingle(),
  ]);

  const pagamenti = ((paymentsResult.data as PagamentoRow[]) ?? []).map(mapPagamentoRow);
  const abbonamenti = ((subscriptionsResult.data as AbbonamentoRow[]) ?? []).map(
    mapAbbonamentoRow,
  );
  const attivita = ((deadlinesResult.data as ScadenzaRow[]) ?? []).map(mapScadenzaRow);
  const promemoria = ((remindersResult.data as PromemoriaRow[]) ?? []).map(mapPromemoriaRow);
  const recensioni = ((reviewsResult.data as RecensioneRow[]) ?? []).map(mapRecensioneRow);
  const promozioni = ((promotionsResult.data as PromozioneRow[]) ?? []).map(mapPromozioneRow);
  const documenti = ((missingDocumentsResult.data as DocumentoMancanteRow[]) ?? []).map(
    mapDocumentoMancanteRow,
  );

  const noteDelMese = revenueSummaryResult.data?.notes ?? "";
  const incassiSegnati = Number(revenueSummaryResult.data?.incassi_segnati ?? 0);
  const speseSegnate = Number(revenueSummaryResult.data?.spese_segnate ?? 0);

  const righePagamenti = buildPagamentiSettimana(pagamenti, weekStart, weekEnd, today);
  const righeAbbonamenti = buildAbbonamentiSettimana(abbonamenti, weekEnd, today);
  const righePromemoria = buildPromemoriaSettimana(promemoria, attivita, weekStart, weekEnd);
  const righeCommercialista = buildCommercialistaSettimana(documenti, noteDelMese);
  const righeDaControllare = buildElementiDaControllare({
    pagamenti,
    abbonamenti,
    attivita,
    promemoria,
    recensioni,
    today,
  });
  const recensioniSettimana = buildRecensioniSettimana(recensioni, weekStart, weekEnd);
  const promozioniInEvidenza = buildPromozioniInEvidenza(promozioni);
  const recensioniDaRispondere = recensioni.filter((r) => r.risposta === "Da rispondere").length;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Riepilogo settimana"
        description="Le cose principali da controllare prima di chiudere la settimana."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Da controllare"
          icon={AlertTriangle}
          count={righeDaControllare.length}
          href="/"
          ctaLabel="Apri Oggi"
          emptyText="Nessun elemento importante questa settimana. Quando ci saranno pagamenti, scadenze o promemoria da seguire, li troverai qui."
        >
          {righeDaControllare.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{r.testo}</span>
              {r.dettaglio ? (
                <span className="text-muted-foreground">{r.dettaglio}</span>
              ) : null}
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Pagamenti"
          icon={Wallet}
          count={righePagamenti.length}
          href="/pagamenti"
          ctaLabel="Apri Pagamenti"
          emptyText="Nessun pagamento da controllare questa settimana."
        >
          {righePagamenti.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{r.testo}</span>
              {r.dettaglio ? (
                <span className="text-muted-foreground">{r.dettaglio}</span>
              ) : null}
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Scadenze"
          icon={Repeat}
          count={righeAbbonamenti.length}
          href="/abbonamenti"
          ctaLabel="Apri Abbonamenti"
          emptyText="Nessun abbonamento in scadenza questa settimana."
        >
          {righeAbbonamenti.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{r.testo}</span>
              {r.dettaglio ? (
                <span className="text-muted-foreground">{r.dettaglio}</span>
              ) : null}
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Promemoria"
          icon={Bell}
          count={righePromemoria.length}
          href="/promemoria"
          ctaLabel="Apri Promemoria"
          emptyText="Nessun promemoria o attività aperta questa settimana."
        >
          {righePromemoria.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{r.testo}</span>
              {r.dettaglio ? (
                <span className="text-muted-foreground">{r.dettaglio}</span>
              ) : null}
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Commercialista"
          icon={FileText}
          count={righeCommercialista.length}
          href="/commercialista"
          ctaLabel="Apri Commercialista"
          emptyText="Nessun documento o nota in sospeso per il commercialista."
        >
          {righeCommercialista.map((r) => (
            <li key={r.id} className="text-foreground">
              {r.testo}
            </li>
          ))}
        </OverviewCard>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Com&apos;è andata</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Incassi segnati</p>
                <p className="text-lg font-semibold text-foreground">
                  {incassiSegnati.toLocaleString("it-IT")} €
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Spese segnate</p>
                <p className="text-lg font-semibold text-foreground">
                  {speseSegnate.toLocaleString("it-IT")} €
                </p>
              </div>
            </div>

            <IvaMonthlyDiff incassiSegnati={incassiSegnati} speseSegnate={speseSegnate} />

            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <p>
                Recensioni questa settimana: {recensioniSettimana.positive.length} positive,{" "}
                {recensioniSettimana.negative.length} da migliorare
                {recensioniDaRispondere > 0
                  ? `, ${recensioniDaRispondere} da rispondere`
                  : ""}
                .
              </p>
              <p>Promozioni attive o in programma: {promozioniInEvidenza.length}.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <TrustNote className="mt-6">
        Questo riepilogo serve solo per organizzarti e non sostituisce il commercialista.
      </TrustNote>
    </div>
  );
}
