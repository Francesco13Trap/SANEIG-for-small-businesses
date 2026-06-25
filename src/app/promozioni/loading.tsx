import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PromozioniLoading() {
  return (
    <div>
      <PageHeader
        title="Promozioni"
        description="Le promozioni in corso, programmate e concluse."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento promozioni…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
