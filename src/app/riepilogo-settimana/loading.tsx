import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function RiepilogoSettimanaLoading() {
  return (
    <div>
      <PageHeader
        title="Riepilogo settimana"
        description="Le cose principali da controllare prima di chiudere la settimana."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Caricamento dati…</p>
        </CardContent>
      </Card>
    </div>
  );
}
