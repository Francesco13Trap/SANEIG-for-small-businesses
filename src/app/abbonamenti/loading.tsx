import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AbbonamentiLoading() {
  return (
    <div>
      <PageHeader
        title="Abbonamenti"
        description="Gli abbonamenti dei clienti e le loro scadenze."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento abbonamenti…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
