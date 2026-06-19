import { redirect } from "next/navigation";
import { CalendarClock, Users, Wallet, Repeat, MessageSquare, Bell } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { OverviewCard } from "@/components/oggi/overview-card";
import { PriorityCard } from "@/components/oggi/priority-card";
import { SuggestedActionsCard } from "@/components/oggi/suggested-actions-card";
import { getPriorityItem } from "@/lib/oggi/priority";
import { getSuggestedActions } from "@/lib/oggi/suggested-actions";
import { createClient } from "@/lib/supabase/server";
import {
  appuntamentiOggi,
  clienti,
  pagamenti,
  abbonamenti,
  messaggi,
  promemoria,
  riepilogoSettimana,
} from "@/lib/mock-data";

// Reads the session via Supabase on every request — must never be
// prerendered at build time, when env vars/cookies aren't available.
export const dynamic = "force-dynamic";

export default async function OggiPage() {
  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/nuova-attivita");
  }

  const clientiDaRichiamare = clienti.filter(
    (c) => c.stato === "Da ricontattare"
  );
  const pagamentiDaControllare = pagamenti.filter(
    (p) => p.stato === "Da controllare" || p.stato === "Da sollecitare"
  );
  const abbonamentiInScadenza = abbonamenti.filter(
    (a) => a.stato === "In scadenza" || a.stato === "Da rinnovare"
  );
  const promemoriaImportanti = promemoria.filter((p) => p.importante);

  const priorityItem = getPriorityItem({
    pagamentiDaControllare,
    promemoriaImportanti,
    abbonamentiInScadenza,
    messaggi,
    azioniConsigliate: riepilogoSettimana.prossimeAzioni,
  });

  const suggestedActions = getSuggestedActions({
    pagamentiDaControllare,
    promemoriaImportanti,
    abbonamentiInScadenza,
    messaggi,
    azioniConsigliate: riepilogoSettimana.prossimeAzioni,
    excludeHref: priorityItem?.href,
  });

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
          count={appuntamentiOggi.length}
          href="/riepilogo-settimana"
          ctaLabel="Vedi la settimana"
          emptyText="Nessun appuntamento in programma per oggi."
        >
          {appuntamentiOggi.map((a) => (
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
              <span className="text-muted-foreground">{p.importo} €</span>
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
              <span className="text-muted-foreground">{a.scadenza}</span>
            </li>
          ))}
        </OverviewCard>

        <OverviewCard
          title="Messaggi pronti"
          icon={MessageSquare}
          count={messaggi.length}
          href="/messaggi"
          ctaLabel="Apri Messaggi"
          emptyText="Nessun messaggio pronto."
        >
          {messaggi.slice(0, 4).map((m) => (
            <li key={m.id} className="text-foreground">
              {m.titolo}
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
      </div>

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
