import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { FornitoreFormDialog } from "@/components/fornitori/fornitore-form-dialog";
import { FornitoriList } from "@/components/fornitori/fornitori-list";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapFornitoreRow, type FornitoreRow } from "@/lib/fornitori/types";

// Reads the session and the suppliers list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function FornitoriPage() {
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
    .from("suppliers")
    .select("id, name, contact_name, phone, email, category, note, created_at, updated_at")
    .eq("business_id", businessId)
    .order("name", { ascending: true });

  const fornitori = ((data as FornitoreRow[]) ?? []).map(mapFornitoreRow);

  return (
    <div>
      <PageHeader
        title="Fornitori"
        description="I fornitori dell'attività e i loro contatti."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare i fornitori.
            </p>
          </CardContent>
        </Card>
      ) : fornitori.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun fornitore salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi il primo fornitore per tenere i contatti importanti
                in ordine.
              </p>
            </div>
            <FornitoreFormDialog mode="add" />
          </CardContent>
        </Card>
      ) : (
        <FornitoriList fornitori={fornitori} />
      )}

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
