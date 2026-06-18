import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RegimeSelector } from "@/components/iva/regime-selector";
import { IvaCalculator } from "@/components/iva/iva-calculator";
import { IvaMonthlyDiff } from "@/components/iva/iva-monthly-diff";
import { AccountantNoteField } from "@/components/iva/accountant-note-field";
import { riepilogoMensileCommercialista } from "@/lib/mock-data";

export default function IvaEIncassiPage() {
  const { incassiSegnati, speseSegnate, mese } = riepilogoMensileCommercialista;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="IVA e incassi"
        description="Uno spazio per organizzare l'IVA e gli incassi, prima di parlarne con il commercialista."
      />

      <Card>
        <CardHeader>
          <CardTitle>Il tuo regime</CardTitle>
          <CardDescription>
            Indica il regime che usi, anche solo come riferimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <Label>Regime</Label>
            <RegimeSelector />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calcolatore IVA</CardTitle>
          <CardDescription>
            Inserisci un importo netto per calcolare IVA e totale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IvaCalculator />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incassi del mese</CardTitle>
            <CardDescription>{mese}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {incassiSegnati.toLocaleString("it-IT")} €
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Totale incassi segnati questo mese.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spese del mese</CardTitle>
            <CardDescription>{mese}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {speseSegnate.toLocaleString("it-IT")} €
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Totale spese segnate questo mese.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Differenza IVA indicativa</CardTitle>
          <CardDescription>
            Una stima generica tra IVA su incassi e IVA su spese, solo per farti un&apos;idea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IvaMonthlyDiff
            incassiSegnati={incassiSegnati}
            speseSegnate={speseSegnate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nota per il commercialista</CardTitle>
          <CardDescription>
            Scrivi qui quello che vuoi ricordarti di chiedere o segnalare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountantNoteField />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
        <TrustNote>Questo riepilogo serve solo per organizzarti.</TrustNote>
        <TrustNote>
          Prima di usarlo fiscalmente, controllalo con il commercialista.
        </TrustNote>
        <TrustNote>LocalFlow non sostituisce il commercialista.</TrustNote>
      </div>
    </div>
  );
}
