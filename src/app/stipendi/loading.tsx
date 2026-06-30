import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function StipendiLoading() {
  return (
    <div>
      <PageHeader
        title="Stipendi"
        description="Un promemoria semplice per i pagamenti ai collaboratori."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento stipendi…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
