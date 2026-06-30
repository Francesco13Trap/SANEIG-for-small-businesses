import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { ClienteFormDialog } from "@/components/clienti/cliente-form-dialog";
import { ClientiList } from "@/components/clienti/clienti-list";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapClienteRow, type ClienteRow } from "@/lib/clienti/types";

// Reads the session and the clients list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function ClientiPage() {
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
    .from("clients")
    .select("id, name, phone, email, note, created_at, updated_at")
    .eq("business_id", businessId)
    .order("name", { ascending: true });

  const clienti = ((data as ClienteRow[]) ?? []).map(mapClienteRow);

  return (
    <div>
      <PageHeader
        title="Clienti"
        description="L'elenco dei tuoi clienti, tutti in un posto."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare i clienti.
            </p>
          </CardContent>
        </Card>
      ) : clienti.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun cliente salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi il primo cliente per iniziare a tenere tutto in
                ordine.
              </p>
            </div>
            <ClienteFormDialog mode="add" />
          </CardContent>
        </Card>
      ) : (
        <ClientiList clienti={clienti} />
      )}

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
