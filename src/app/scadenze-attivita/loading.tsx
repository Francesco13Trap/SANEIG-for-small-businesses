import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function ScadenzeAttivitaLoading() {
  return (
    <div>
      <PageHeader
        title="Scadenze attività"
        description="Le scadenze importanti della tua attività, da non perdere di vista."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento scadenze…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
