import { CalendarClock, Users, Wallet, Repeat, MessageSquare, Bell } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { OverviewCard } from "@/components/oggi/overview-card";
import {
  appuntamentiOggi,
  clienti,
  pagamenti,
  abbonamenti,
  messaggi,
  promemoria,
} from "@/lib/mock-data";

export default function OggiPage() {
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

  return (
    <div>
      <PageHeader
        title="Oggi"
        description="Ecco cosa conviene seguire oggi, in un solo colpo d'occhio."
      />

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
