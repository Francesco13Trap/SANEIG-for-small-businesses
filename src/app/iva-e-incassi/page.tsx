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
import { Label } from "@/components/ui/label";
import { RegimeSelector } from "@/components/iva/regime-selector";
import { IvaCalculator } from "@/components/iva/iva-calculator";
import { IvaMonthlyDiff } from "@/components/iva/iva-monthly-diff";
import { AccountantNoteField } from "@/components/iva/accountant-note-field";
import { RiepilogoMeseDialog } from "@/components/iva/riepilogo-mese-dialog";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { parseRegimeIva } from "@/lib/iva/types";
import { startOfCurrentMonth } from "@/lib/monthly-period";

// Reads the session, the IVA settings and the current month's summary via
// Supabase on every request — must never be prerendered at build time,
// when env vars/cookies aren't available.
export const dynamic = "force-dynamic";

export default async function IvaEIncassiPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const [{ data: settings }, { data: riepilogo }] = await Promise.all([
    supabase
      .from("iva_settings")
      .select("regime, accountant_note")
      .eq("business_id", businessId)
      .maybeSingle(),
    supabase
      .from("monthly_revenue_summaries")
      .select("incassi_segnati, spese_segnate")
      .eq("business_id", businessId)
      .eq("period", startOfCurrentMonth())
      .maybeSingle(),
  ]);

  const regime = parseRegimeIva(settings?.regime ?? "non-lo-so");
  const nota = settings?.accountant_note ?? "";
  const incassiSegnati = Number(riepilogo?.incassi_segnati ?? 0);
  const speseSegnate = Number(riepilogo?.spese_segnate ?? 0);
  const mese = new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="IVA e incassi"
        description="Uno spazio per organizzare l'IVA e gli incassi, prima di parlarne con il commercialista."
      />

      <Card>
        <CardHeader>
          <CardTitle>Il tuo regime</CardTitle>
          <CardDescription>
            Indica il regime che usi, anche solo come riferimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label>Regime</Label>
            <RegimeSelector regime={regime} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calcolatore IVA</CardTitle>
          <CardDescription>
            Inserisci un importo netto per calcolare IVA e totale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IvaCalculator />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Incassi e spese del mese</CardTitle>
            <CardDescription className="capitalize">{mese}</CardDescription>
          </div>
          <RiepilogoMeseDialog
            incassiSegnati={incassiSegnati}
            speseSegnate={speseSegnate}
          />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Incassi segnati</p>
            <p className="text-2xl font-semibold text-foreground">
              {incassiSegnati.toLocaleString("it-IT")} €
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Spese segnate</p>
            <p className="text-2xl font-semibold text-foreground">
              {speseSegnate.toLocaleString("it-IT")} €
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Differenza IVA indicativa</CardTitle>
          <CardDescription>
            Una stima generica tra IVA su incassi e IVA su spese, solo per farti un&apos;idea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IvaMonthlyDiff
            incassiSegnati={incassiSegnati}
            speseSegnate={speseSegnate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nota per il commercialista</CardTitle>
          <CardDescription>
            Scrivi qui quello che vuoi ricordarti di chiedere o segnalare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountantNoteField nota={nota} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
        <TrustNote>
          Questo riepilogo serve solo per organizzarti: prima di usarlo
          fiscalmente, controllalo con il commercialista.
        </TrustNote>
        <TrustNote>Impresa Viva non sostituisce il commercialista.</TrustNote>
      </div>
    </div>
  );
}
