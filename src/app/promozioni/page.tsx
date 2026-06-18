import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { StatusBadge } from "@/components/status-badge";
import { CopyMessageButton } from "@/components/copy-message-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { promozioni } from "@/lib/mock-data";

export default function PromozioniPage() {
  return (
    <div>
      <PageHeader
        title="Promozioni"
        description="Le promozioni in corso, programmate e concluse."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {promozioni.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{p.titolo}</CardTitle>
                <StatusBadge status={p.stato} />
              </div>
              <CardDescription>{p.periodo}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-foreground">{p.descrizione}</p>
            </CardContent>
            <CardFooter>
              <CopyMessageButton
                label="Copia messaggio"
                message={`Ciao [nome], ti scrivo per "${p.titolo}": ${p.descrizione}. Valida nel periodo ${p.periodo}.`}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
