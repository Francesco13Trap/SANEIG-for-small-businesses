import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { PromozioneFormDialog } from "@/components/promozioni/promozione-form-dialog";
import { PromozioniGrid } from "@/components/promozioni/promozioni-grid";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapPromozioneRow, type PromozioneRow } from "@/lib/promozioni/types";

// Reads the session and the promotions list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function PromozioniPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const { data, error } = await supabase
    .from("promotions")
    .select("id, title, description, period, status, created_at, updated_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const promozioni = ((data as PromozioneRow[]) ?? []).map(mapPromozioneRow);

  return (
    <div>
      <PageHeader
        title="Promozioni"
        description="Le promozioni in corso, programmate e concluse."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare le promozioni.
            </p>
          </CardContent>
        </Card>
      ) : promozioni.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessuna promozione salvata.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi la prima promozione per iniziare a comunicarla ai tuoi
                clienti.
              </p>
            </div>
            <PromozioneFormDialog mode="add" />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <PromozioneFormDialog mode="add" />
          </div>
          <PromozioniGrid promozioni={promozioni} />
        </div>
      )}

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
