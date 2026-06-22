import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { AbbonamentoFormDialog } from "@/components/abbonamenti/abbonamento-form-dialog";
import { AbbonamentiTable } from "@/components/abbonamenti/abbonamenti-table";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapAbbonamentoRow, type AbbonamentoRow } from "@/lib/abbonamenti/types";

// Reads the session and the subscriptions list via Supabase on every
// request — must never be prerendered at build time, when env
// vars/cookies aren't available.
export const dynamic = "force-dynamic";

export default async function AbbonamentiPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const [subscriptionsResult, clientsResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select(
        "id, client_id, name, start_date, expiry_date, status, note, created_at, updated_at, clients(name)",
      )
      .eq("business_id", businessId)
      .order("expiry_date", { ascending: true }),
    supabase
      .from("clients")
      .select("id, name")
      .eq("business_id", businessId)
      .order("name", { ascending: true }),
  ]);

  const { data, error } = subscriptionsResult;
  const abbonamenti = ((data as AbbonamentoRow[]) ?? []).map(mapAbbonamentoRow);
  const clienti = (clientsResult.data ?? []).map((c) => ({ id: c.id, nome: c.name }));

  return (
    <div>
      <PageHeader
        title="Abbonamenti"
        description="Gli abbonamenti dei clienti e le loro scadenze."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare gli abbonamenti.
            </p>
          </CardContent>
        </Card>
      ) : abbonamenti.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun abbonamento salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi una scadenza per iniziare a tenere tutto sotto
                controllo.
              </p>
            </div>
            <AbbonamentoFormDialog mode="add" clienti={clienti} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <AbbonamentoFormDialog mode="add" clienti={clienti} />
          </div>
          <AbbonamentiTable abbonamenti={abbonamenti} clienti={clienti} />
        </div>
      )}

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
