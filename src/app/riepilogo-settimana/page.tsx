import { ListChecks } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/riepilogo/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { riepilogoSettimana } from "@/lib/mock-data";

export default function RiepilogoSettimanaPage() {
  const r = riepilogoSettimana;

  return (
    <div>
      <PageHeader
        title="Riepilogo settimana"
        description="Come è andata questa settimana, in breve."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Clienti serviti" value={r.clientiServiti} />
        <StatCard label="Clienti nuovi" value={r.clientiNuovi} />
        <StatCard label="Clienti da recuperare" value={r.clientiDaRecuperare} />
        <StatCard
          label="Appuntamenti completati"
          value={r.appuntamentiCompletati}
        />
        <StatCard
          label="Pagamenti da controllare"
          value={r.pagamentiDaControllare}
        />
        <StatCard
          label="Abbonamenti in scadenza"
          value={r.abbonamentiInScadenza}
        />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <CardTitle>Prossime 3 azioni consigliate</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {r.prossimeAzioni.map((azione, index) => (
              <li key={azione} className="flex items-start gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-foreground">{azione}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
