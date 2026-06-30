import { redirect } from "next/navigation";
import { Info } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { StipendioFormDialog } from "@/components/stipendi/stipendio-form-dialog";
import { StipendiTable } from "@/components/stipendi/stipendi-table";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapStipendioRow, type StipendioRow } from "@/lib/stipendi/types";

// Reads the session and the staff payments list via Supabase on every
// request — must never be prerendered at build time, when env vars/cookies
// aren't available.
export const dynamic = "force-dynamic";

export default async function StipendiPage() {
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
    .from("staff_payments")
    .select(
      "id, person_name, role, amount, month, due_date, status, note, created_at, updated_at",
    )
    .eq("business_id", businessId)
    .order("due_date", { ascending: true });

  const stipendi = ((data as StipendioRow[]) ?? []).map(mapStipendioRow);

  return (
    <div>
      <PageHeader
        title="Stipendi"
        description="Un promemoria semplice per i pagamenti ai collaboratori."
      />

      <Card className="mb-6 border-l-4 border-l-warning">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-sm text-foreground">
            Questa sezione è solo un promemoria interno. Non sostituisce buste
            paga, consulente del lavoro o commercialista.
          </p>
        </CardContent>
      </Card>

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare gli stipendi.
            </p>
          </CardContent>
        </Card>
      ) : stipendi.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessuno stipendio salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi un promemoria per tenere sotto controllo i pagamenti.
              </p>
            </div>
            <StipendioFormDialog mode="add" />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <StipendioFormDialog mode="add" />
          </div>
          <StipendiTable stipendi={stipendi} />
        </div>
      )}

      <TrustNote className="mt-6">
        Impresa Viva non sostituisce il commercialista.
      </TrustNote>
    </div>
  );
}
