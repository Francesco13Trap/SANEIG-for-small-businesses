import { redirect } from "next/navigation";
import { CalendarClock, Users, Wallet, Repeat, MessageSquare, Bell, Package, Banknote } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { OverviewCard } from "@/components/oggi/overview-card";
import { PriorityCard } from "@/components/oggi/priority-card";
import { SuggestedActionsCard } from "@/components/oggi/suggested-actions-card";
import { isDemoAccount } from "@/lib/oggi/demo-account";
import { getPaymentWarnings } from "@/lib/oggi/payment-warnings";
import { getPriorityItem } from "@/lib/oggi/priority";
import { getSubscriptionWarnings } from "@/lib/oggi/subscription-warnings";
import { getSuggestedActions } from "@/lib/oggi/suggested-actions";
import { buildOggiWarnings } from "@/lib/oggi/warnings";
import { getAbbonamentiMessages, getPagamentiMessages } from "@/lib/messaggi/reminders";
import { createClient } from "@/lib/supabase/server";
import {
  formatImporto,
  mapPagamentoRow,
  type PagamentoRow,
} from "@/lib/pagamenti/types";
import {
  formatData as formatDataAbbonamento,
  mapAbbonamentoRow,
  type AbbonamentoRow,
} from "@/lib/abbonamenti/types";
import { mapPromemoriaRow, type PromemoriaRow } from "@/lib/promemoria/types";
import { isScortaBassa, mapProdottoRow, type ProdottoRow } from "@/lib/magazzino/types";
import { mapStipendioRow, type StipendioRow } from "@/lib/stipendi/types";
import { appuntamentiOggi, clienti } from "@/lib/mock-data";

// Reads the session and real payments via Supabase on every request — must
// never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function OggiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isDemo = isDemoAccount(user?.email);

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/nuova-attivita");
  }

  // Errors fall back to an empty list rather than surfacing a raw Supabase
  // error: Oggi's cards already have a clean "no warnings" state for that.
  const [
    paymentsResult,
    subscriptionsResult,
    remindersResult,
    inventoryResult,
    staffPaymentsResult,
  ] = await Promise.all([
      supabase
        .from("payments")
        .select("id, client_id, amount, due_date, status, created_at, updated_at, clients(name)")
        .eq("business_id", membership.business_id)
        .neq("status", "paid")
        .order("due_date", { ascending: true }),
      supabase
        .from("subscriptions")
        .select(
          "id, client_id, name, start_date, expiry_date, status, note, created_at, updated_at, clients(name)",
        )
        .eq("business_id", membership.business_id)
        .neq("status", "cancelled")
        .order("expiry_date", { ascending: true }),
      supabase
        .from("reminders")
        .select("id, title, detail, due_date, important, done, created_at, updated_at")
        .eq("business_id", membership.business_id)
        .eq("important", true)
        .eq("done", false)
        .order("due_date", { ascending: true }),
      supabase
        .from("inventory_items")
        .select(
          "id, supplier_id, name, quantity, minimum_quantity, unit, category, note, created_at, updated_at, suppliers(name)",
        )
        .eq("business_id", membership.business_id)
        .order("name", { ascending: true }),
      supabase
        .from("staff_payments")
        .select("id, person_name, role, amount, month, due_date, status, note, created_at, updated_at")
        .eq("business_id", membership.business_id)
        .in("status", ["to_pay", "delayed"])
        .order("due_date", { ascending: true }),
    ]);

  const pagamentiNonPagati = ((paymentsResult.data as PagamentoRow[]) ?? []).map(
    mapPagamentoRow,
  );
  const paymentWarnings = getPaymentWarnings(pagamentiNonPagati);
  const pagamentiDaControllare = pagamentiNonPagati.filter(
    (p) => p.stato === "to_check" || p.stato === "to_remind",
  );

  const abbonamentiAttivi = ((subscriptionsResult.data as AbbonamentoRow[]) ?? []).map(
    mapAbbonamentoRow,
  );
  const subscriptionWarnings = getSubscriptionWarnings(abbonamentiAttivi);
  const abbonamentiInScadenza = abbonamentiAttivi.filter(
    (a) => a.stato === "expiring",
  );

  // Appuntamenti and "clienti da richiamare" have no real data behind them
  // yet, so only the demo account sees the curated sample content here —
  // everyone else gets the genuine empty state.
  const appuntamenti = isDemo ? appuntamentiOggi : [];
  const clientiDaRichiamare = isDemo
    ? clienti.filter((c) => c.stato === "Da ricontattare")
    : [];
  const promemoriaImportanti = ((remindersResult.data as PromemoriaRow[]) ?? []).map(
    mapPromemoriaRow,
  );

  const prodottiScortaBassa = ((inventoryResult.data as ProdottoRow[]) ?? [])
    .map(mapProdottoRow)
    .filter(isScortaBassa);

  const stipendiDaControllare = ((staffPaymentsResult.data as StipendioRow[]) ?? []).map(
    mapStipendioRow,
  );

  // "Messaggi pronti" reuses the same real reminder text shown on /messaggi,
  // so the count and preview here never drift from what the page itself
  // generates.
  const messaggiPronti = [
    ...getPagamentiMessages(pagamentiNonPagati),
    ...getAbbonamentiMessages(abbonamentiAttivi),
  ];

  const oggiWarnings = buildOggiWarnings(subscriptionWarnings, paymentWarnings);
  const priorityItem = getPriorityItem(oggiWarnings);
  const suggestedActions = getSuggestedActions(oggiWarnings);

  const oggi = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div>
      <PageHeader title="Oggi" description={`Buongiorno, oggi è ${oggi}.`} />

      <PriorityCard item={priorityItem} />

      <SuggestedActionsCard actions={suggestedActions} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Appuntamenti di oggi"
          icon={CalendarClock}
          count={appuntamenti.length}
          href="/riepilogo-settimana"
          ctaLabel="Vedi la settimana"
          emptyText="Nessun appuntamento in programma per oggi."
        >
          {appuntamenti.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{a.cliente}</span>
              <span className="text-muted-foreground">{a.ora}</span>
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Clienti da richiamare"
          icon={Users}
          count={clientiDaRichiamare.length}
          href="/clienti"
          ctaLabel="Apri Clienti"
          emptyText="Nessun cliente da richiamare oggi."
        >
          {clientiDaRichiamare.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{c.nome}</span>
              <span className="text-muted-foreground">{c.telefono}</span>
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Pagamenti da controllare"
          icon={Wallet}
          count={pagamentiDaControllare.length}
          href="/pagamenti"
          ctaLabel="Apri Pagamenti"
          emptyText="Nessun pagamento da controllare."
        >
          {pagamentiDaControllare.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{p.cliente}</span>
              <span className="text-muted-foreground">{formatImporto(p.importo)} €</span>
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Abbonamenti in scadenza"
          icon={Repeat}
          count={abbonamentiInScadenza.length}
          href="/abbonamenti"
          ctaLabel="Apri Abbonamenti"
          emptyText="Nessun abbonamento in scadenza."
        >
          {abbonamentiInScadenza.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{a.cliente}</span>
              <span className="text-muted-foreground">
                {formatDataAbbonamento(a.scadenza)}
              </span>
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Messaggi pronti"
          icon={MessageSquare}
          count={messaggiPronti.length}
          href="/messaggi"
          ctaLabel="Apri Messaggi"
          emptyText="Nessun messaggio pronto."
        >
          {messaggiPronti.slice(0, 4).map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{m.cliente}</span>
              <span className="text-muted-foreground">{m.motivo}</span>
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Promemoria importanti"
          icon={Bell}
          count={promemoriaImportanti.length}
          href="/promemoria"
          ctaLabel="Apri Promemoria"
          emptyText="Nessun promemoria importante al momento."
        >
          {promemoriaImportanti.map((p) => (
            <li key={p.id} className="text-foreground">
              {p.titolo}
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Magazzino"
          icon={Package}
          count={prodottiScortaBassa.length}
          href="/magazzino"
          ctaLabel="Apri Magazzino"
          emptyText="Nessun prodotto con scorta bassa."
        >
          {prodottiScortaBassa.map((p) => (
            <li key={p.id} className="text-foreground">
              {p.nome} ha scorta bassa.
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Stipendi"
          icon={Banknote}
          count={stipendiDaControllare.length}
          href="/stipendi"
          ctaLabel="Apri Stipendi"
          emptyText="Nessun pagamento collaboratore da controllare."
        >
          {stipendiDaControllare.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{s.nome}</span>
              <span className="text-muted-foreground">
                Pagamento collaboratore da controllare.
              </span>
            </li>
          ))}
        </OverviewCard>
      </div>

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
