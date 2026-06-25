import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { ScadenzaFormDialog } from "@/components/scadenze/scadenza-form-dialog";
import { ScadenzeTable } from "@/components/scadenze/scadenze-table";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapScadenzaRow, type ScadenzaRow } from "@/lib/scadenze/types";

// Reads the session and the deadlines list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function ScadenzeAttivitaPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const { data, error } = await supabase
    .from("deadlines")
    .select("id, title, category, due_date, status, created_at")
    .eq("business_id", businessId)
    .order("due_date", { ascending: true });

  const scadenze = ((data as ScadenzaRow[]) ?? []).map(mapScadenzaRow);

  return (
    <div>
      <PageHeader
        title="Scadenze attività"
        description="Le scadenze importanti della tua attività, da non perdere di vista."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare le scadenze.
            </p>
          </CardContent>
        </Card>
      ) : scadenze.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessuna scadenza salvata.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi la prima scadenza per iniziare a tenere tutto sotto
                controllo.
              </p>
            </div>
            <ScadenzaFormDialog mode="add" />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <ScadenzaFormDialog mode="add" />
          </div>
          <Card>
            <CardContent className="p-0">
              <ScadenzeTable scadenze={scadenze} />
            </CardContent>
          </Card>
        </div>
      )}

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
