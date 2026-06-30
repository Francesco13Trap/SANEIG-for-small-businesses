import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/riepilogo/stat-card";
import { PrepareSummaryButton } from "@/components/commercialista/prepare-summary-button";
import { DocumentiMancantiList } from "@/components/commercialista/documenti-mancanti-list";
import { NoteDelMeseField } from "@/components/commercialista/note-del-mese-field";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapDocumentoMancanteRow, type DocumentoMancanteRow } from "@/lib/commercialista/types";
import { startOfCurrentMonth } from "@/lib/monthly-period";

// Reads the session and several per-business Supabase tables on every
// request — must never be prerendered at build time, when env vars/cookies
// aren't available.
export const dynamic = "force-dynamic";

export default async function CommercialistaPage() {
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

  const [{ data: riepilogo }, { data: documentiData }, { count: pagamentiDaControllare }] =
    await Promise.all([
      supabase
        .from("monthly_revenue_summaries")
        .select("incassi_segnati, spese_segnate, notes")
        .eq("business_id", businessId)
        .eq("period", startOfCurrentMonth())
        .maybeSingle(),
      supabase
        .from("missing_documents")
        .select("id, description")
        .eq("business_id", businessId)
        .order("created_at", { ascending: true }),
      supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("status", "to_check"),
    ]);

  const incassiSegnati = Number(riepilogo?.incassi_segnati ?? 0);
  const speseSegnate = Number(riepilogo?.spese_segnate ?? 0);
  const noteDelMese = riepilogo?.notes ?? "";
  const documenti = ((documentiData as DocumentoMancanteRow[]) ?? []).map(
    mapDocumentoMancanteRow,
  );
  const mese = new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Commercialista"
        description={`Il riepilogo del mese di ${mese}, pronto da condividere.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Incassi segnati" value={incassiSegnati} suffix="€" />
        <StatCard label="Spese segnate" value={speseSegnate} suffix="€" />
        <StatCard
          label="Pagamenti da controllare"
          value={pagamentiDaControllare ?? 0}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documenti mancanti</CardTitle>
          <CardDescription>
            Documenti che potrebbero servire al commercialista.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentiMancantiList documenti={documenti} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Note del mese</CardTitle>
        </CardHeader>
        <CardContent>
          <NoteDelMeseField note={noteDelMese} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prepara il riepilogo</CardTitle>
          <CardDescription>
            Copia un riepilogo del mese da inviare al commercialista come preferisci.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrepareSummaryButton
            mese={mese}
            incassiSegnati={incassiSegnati}
            speseSegnate={speseSegnate}
            pagamentiDaControllare={pagamentiDaControllare ?? 0}
            documentiMancanti={documenti.map((d) => d.descrizione)}
            noteDelMese={noteDelMese}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
        <TrustNote>Questo riepilogo serve solo per organizzarti.</TrustNote>
        <TrustNote>Impresa Viva non sostituisce il commercialista.</TrustNote>
      </div>
    </div>
  );
}
