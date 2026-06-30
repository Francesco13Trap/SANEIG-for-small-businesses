import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { RecensioneFormDialog } from "@/components/recensioni/recensione-form-dialog";
import { RecensioniList } from "@/components/recensioni/recensioni-list";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapRecensioneRow, type RecensioneRow } from "@/lib/recensioni/types";

// Reads the session and the reviews list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function RecensioniPage() {
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

  const { data, error } = await supabase
    .from("reviews")
    .select("id, client_name, rating, comment, review_date, responded, created_at")
    .eq("business_id", businessId)
    .order("review_date", { ascending: false });

  const recensioni = ((data as RecensioneRow[]) ?? []).map(mapRecensioneRow);

  return (
    <div>
      <PageHeader
        title="Recensioni"
        description="Le recensioni lasciate dai clienti, da leggere e da ringraziare."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare le recensioni.
            </p>
          </CardContent>
        </Card>
      ) : recensioni.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessuna recensione salvata.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi la prima recensione ricevuta per iniziare a tenerne
                traccia.
              </p>
            </div>
            <RecensioneFormDialog mode="add" />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <RecensioneFormDialog mode="add" />
          </div>
          <RecensioniList recensioni={recensioni} />
        </div>
      )}

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
