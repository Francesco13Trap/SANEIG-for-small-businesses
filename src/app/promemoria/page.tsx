import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { PromemoriaFormDialog } from "@/components/promemoria/promemoria-form-dialog";
import { PromemoriaList } from "@/components/promemoria/promemoria-list";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapPromemoriaRow, type PromemoriaRow } from "@/lib/promemoria/types";

// Reads the session and the reminders list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function PromemoriaPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const { data, error } = await supabase
    .from("reminders")
    .select("id, title, detail, due_date, important, done, created_at, updated_at")
    .eq("business_id", businessId)
    .order("done", { ascending: true })
    .order("important", { ascending: false })
    .order("due_date", { ascending: true });

  const promemoria = ((data as PromemoriaRow[]) ?? []).map(mapPromemoriaRow);

  return (
    <div>
      <PageHeader
        title="Promemoria"
        description="Le cose da non dimenticare, in ordine di importanza."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare i promemoria.
            </p>
          </CardContent>
        </Card>
      ) : promemoria.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun promemoria salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi il primo promemoria per iniziare a tenere traccia
                delle cose da non dimenticare.
              </p>
            </div>
            <PromemoriaFormDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <PromemoriaFormDialog />
          </div>
          <PromemoriaList promemoria={promemoria} />
        </div>
      )}

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
