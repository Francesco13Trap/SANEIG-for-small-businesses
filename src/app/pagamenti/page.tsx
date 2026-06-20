import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { PagamentoFormDialog } from "@/components/pagamenti/pagamento-form-dialog";
import { PagamentiTable } from "@/components/pagamenti/pagamenti-table";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapPagamentoRow, type PagamentoRow } from "@/lib/pagamenti/types";

// Reads the session and the payments list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function PagamentiPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const [paymentsResult, clientsResult] = await Promise.all([
    supabase
      .from("payments")
      .select("id, client_id, amount, due_date, status, created_at, updated_at, clients(name)")
      .eq("business_id", businessId)
      .order("due_date", { ascending: true }),
    supabase
      .from("clients")
      .select("id, name")
      .eq("business_id", businessId)
      .order("name", { ascending: true }),
  ]);

  const { data, error } = paymentsResult;
  const pagamenti = ((data as PagamentoRow[]) ?? []).map(mapPagamentoRow);
  const clienti = (clientsResult.data ?? []).map((c) => ({ id: c.id, nome: c.name }));

  return (
    <div>
      <PageHeader
        title="Pagamenti"
        description="I pagamenti da controllare o da sollecitare ai clienti."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare i pagamenti.
            </p>
          </CardContent>
        </Card>
      ) : pagamenti.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun pagamento salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi il primo pagamento per iniziare a tenere sotto
                controllo gli incassi.
              </p>
            </div>
            <PagamentoFormDialog mode="add" clienti={clienti} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <PagamentoFormDialog mode="add" clienti={clienti} />
          </div>
          <PagamentiTable pagamenti={pagamenti} clienti={clienti} />
        </div>
      )}

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
