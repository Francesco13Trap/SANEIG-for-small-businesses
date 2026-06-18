import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { ScadenzeTable } from "@/components/scadenze/scadenze-table";
import { scadenzeAttivita } from "@/lib/mock-data";

export default function ScadenzeAttivitaPage() {
  return (
    <div>
      <PageHeader
        title="Scadenze attività"
        description="Le scadenze importanti della tua attività, da non perdere di vista."
      />

      <Card>
        <CardContent className="p-0">
          <ScadenzeTable scadenze={scadenzeAttivita} />
        </CardContent>
      </Card>

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
