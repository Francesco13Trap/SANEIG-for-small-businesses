import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function IvaEIncassiLoading() {
  return (
    <div>
      <PageHeader
        title="IVA e incassi"
        description="Uno spazio per organizzare l'IVA e gli incassi, prima di parlarne con il commercialista."
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
