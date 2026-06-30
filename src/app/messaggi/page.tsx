import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { ReminderMessageCard } from "@/components/messaggi/reminder-message-card";
import { ClienteFollowUpCard } from "@/components/messaggi/cliente-followup-card";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapPagamentoRow, type PagamentoRow } from "@/lib/pagamenti/types";
import { mapAbbonamentoRow, type AbbonamentoRow } from "@/lib/abbonamenti/types";
import { getAbbonamentiMessages, getPagamentiMessages } from "@/lib/messaggi/reminders";

// Reads the session and the real pagamenti/abbonamenti/clienti via Supabase
// on every request — must never be prerendered at build time, when env
// vars/cookies aren't available.
export const dynamic = "force-dynamic";

export default async function MessaggiPage() {
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

  const [paymentsResult, subscriptionsResult, clientsResult] = await Promise.all([
    supabase
      .from("payments")
      .select("id, client_id, amount, due_date, status, created_at, updated_at, clients(name)")
      .eq("business_id", businessId)
      .neq("status", "paid"),
    supabase
      .from("subscriptions")
      .select(
        "id, client_id, name, start_date, expiry_date, status, note, created_at, updated_at, clients(name)",
      )
      .eq("business_id", businessId)
      .neq("status", "cancelled"),
    supabase.from("clients").select("id, name").eq("business_id", businessId).order("name", { ascending: true }),
  ]);

  const hasError = Boolean(
    paymentsResult.error || subscriptionsResult.error || clientsResult.error,
  );

  const pagamenti = ((paymentsResult.data as PagamentoRow[]) ?? []).map(mapPagamentoRow);
  const abbonamenti = ((subscriptionsResult.data as AbbonamentoRow[]) ?? []).map(
    mapAbbonamentoRow,
  );
  const clienti = (clientsResult.data ?? []).map((c) => ({ id: c.id, nome: c.name }));

  const messaggiPagamenti = getPagamentiMessages(pagamenti);
  const messaggiAbbonamenti = getAbbonamentiMessages(abbonamenti);
  const hasClienti = clienti.length > 0;

  const nessunMessaggio =
    !hasError &&
    messaggiPagamenti.length === 0 &&
    messaggiAbbonamenti.length === 0 &&
    !hasClienti;

  return (
    <div>
      <PageHeader
        title="Messaggi"
        description="Messaggi pronti da copiare, preparati dai pagamenti e dagli abbonamenti reali."
      />

      {hasError ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile preparare i messaggi.
            </p>
          </CardContent>
        </Card>
      ) : nessunMessaggio ? (
        <Card>
          <CardContent className="flex flex-col gap-1 p-6">
            <p className="font-medium text-foreground">
              Nessun promemoria da preparare.
            </p>
            <p className="text-sm text-muted-foreground">
              Quando ci saranno pagamenti o scadenze da seguire, li troverai
              qui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {messaggiPagamenti.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Pagamenti
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {messaggiPagamenti.map((m) => (
                  <ReminderMessageCard key={`pagamento-${m.id}`} message={m} />
                ))}
              </div>
            </section>
          )}

          {messaggiAbbonamenti.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Abbonamenti
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {messaggiAbbonamenti.map((m) => (
                  <ReminderMessageCard key={`abbonamento-${m.id}`} message={m} />
                ))}
              </div>
            </section>
          )}

          {hasClienti && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Clienti
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <ClienteFollowUpCard clienti={clienti} />
              </div>
            </section>
          )}
        </div>
      )}

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
