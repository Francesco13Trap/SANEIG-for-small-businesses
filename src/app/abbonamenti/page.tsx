import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { AbbonamentiTable } from "@/components/abbonamenti/abbonamenti-table";
import { abbonamenti } from "@/lib/mock-data";

export default function AbbonamentiPage() {
  return (
    <div>
      <PageHeader
        title="Abbonamenti"
        description="Gli abbonamenti dei clienti e le loro scadenze."
      />

      <Card>
        <CardContent className="p-0">
          <AbbonamentiTable abbonamenti={abbonamenti} />
        </CardContent>
      </Card>

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
