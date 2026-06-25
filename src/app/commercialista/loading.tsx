import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function CommercialistaLoading() {
  return (
    <div>
      <PageHeader
        title="Commercialista"
        description="Il riepilogo del mese, pronto da condividere."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento dati…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
