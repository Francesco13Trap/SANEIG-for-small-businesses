import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { PreventivoFormDialog } from "@/components/preventivi/preventivo-form-dialog";
import { PreventiviTable } from "@/components/preventivi/preventivi-table";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapPreventivoRow, type PreventivoRow } from "@/lib/preventivi/types";

// Reads the session and the quotes list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function PreventiviPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const [quotesResult, clientsResult] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id, client_id, title, description, amount, status, valid_until, note, created_at, updated_at, clients(name)",
      )
      .eq("business_id", businessId)
      .order("created_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, name")
      .eq("business_id", businessId)
      .order("name", { ascending: true }),
  ]);

  const { data, error } = quotesResult;
  const preventivi = ((data as PreventivoRow[]) ?? []).map(mapPreventivoRow);
  const clienti = (clientsResult.data ?? []).map((c) => ({ id: c.id, nome: c.name }));

  return (
    <div>
      <PageHeader
        title="Preventivi"
        description="I preventivi proposti ai clienti e il loro stato."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare i preventivi.
            </p>
          </CardContent>
        </Card>
      ) : preventivi.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun preventivo salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi il primo preventivo per iniziare a tenere traccia
                delle proposte.
              </p>
            </div>
            <PreventivoFormDialog mode="add" clienti={clienti} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <PreventivoFormDialog mode="add" clienti={clienti} />
          </div>
          <PreventiviTable preventivi={preventivi} clienti={clienti} />
        </div>
      )}

      <TrustNote className="mt-6">
        Questo è solo un elenco di proposte: non genera fatture e non
        gestisce pagamenti.
      </TrustNote>
    </div>
  );
}
