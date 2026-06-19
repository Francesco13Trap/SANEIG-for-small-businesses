import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientiLoading() {
  return (
    <div>
      <PageHeader
        title="Clienti"
        description="L'elenco dei tuoi clienti, tutti in un posto."
      />
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Caricamento clienti…
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
