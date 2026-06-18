import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/riepilogo/stat-card";
import { PrepareSummaryButton } from "@/components/commercialista/prepare-summary-button";
import { riepilogoMensileCommercialista } from "@/lib/mock-data";

export default function CommercialistaPage() {
  const r = riepilogoMensileCommercialista;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Commercialista"
        description={`Il riepilogo del mese di ${r.mese}, pronto da condividere.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Incassi segnati" value={r.incassiSegnati} />
        <StatCard label="Spese segnate" value={r.speseSegnate} />
        <StatCard
          label="Pagamenti da controllare"
          value={r.pagamentiDaControllare}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documenti mancanti</CardTitle>
          <CardDescription>
            Documenti che potrebbero servire al commercialista.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {r.documentiMancanti.length > 0 ? (
            <ul className="flex flex-col gap-2 text-sm">
              {r.documentiMancanti.map((doc) => (
                <li key={doc} className="text-foreground">
                  • {doc}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nessun documento mancante al momento.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Note del mese</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{r.noteDelMese}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prepara il riepilogo</CardTitle>
          <CardDescription>
            Copia un riepilogo del mese da inviare al commercialista come preferisci.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrepareSummaryButton riepilogo={r} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
        <TrustNote>Questo riepilogo serve solo per organizzarti.</TrustNote>
        <TrustNote>Impresa Viva non sostituisce il commercialista.</TrustNote>
      </div>
    </div>
  );
}
